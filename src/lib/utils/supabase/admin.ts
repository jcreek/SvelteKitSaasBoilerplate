import { createClient } from '@supabase/supabase-js';
import stripe from 'stripe';
import type { Database, Tables, TablesInsert } from '$lib/types/supabase';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { stripe as stripeClient } from '$lib/utils/stripe';

const toDateTime = (secs: number) => {
	const t = new Date(+0); // Unix epoch start.
	t.setSeconds(secs);
	return t;
};

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
	PUBLIC_SUPABASE_URL || '',
	SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: stripe.Product) => {
	const productData: Product = {
		id: product.id,
		active: product.active,
		name: product.name,
		description: product.description ?? null,
		features: product.marketing_features.map(({ name }) => name || '').filter((name) => !!name),
		images: product.images ?? null,
		metadata: product.metadata,
		created_at: new Date(product.created * 1000).toISOString(),
		updated_at: new Date(product.updated * 1000).toISOString()
	};

	const { error: upsertError } = await supabaseAdmin.from('products').upsert([productData]);
	if (upsertError) throw new Error(`Product insert/update failed: ${upsertError.message}`);
	console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: stripe.Price, retryCount = 0, maxRetries = 3) => {
	const priceData: Price = {
		id: price.id,
		product_id: typeof price.product === 'string' ? price.product : '',
		active: price.active,
		currency: price.currency,
		description: price.nickname ?? null,
		metadata: price.metadata,
		type: price.type,
		unit_amount: price.unit_amount ?? null,
		interval: price.recurring?.interval ?? null,
		interval_count: price.recurring?.interval_count ?? null,
		trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS
	};

	const { error: upsertError } = await supabaseAdmin.from('prices').upsert([priceData]);

	if (upsertError?.message.includes('foreign key constraint')) {
		if (retryCount < maxRetries) {
			console.log(`Retry attempt ${retryCount + 1} for price ID: ${price.id}`);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			await upsertPriceRecord(price, retryCount + 1, maxRetries);
		} else {
			throw new Error(
				`Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
			);
		}
	} else if (upsertError) {
		throw new Error(`Price insert/update failed: ${upsertError.message}`);
	} else {
		console.log(`Price inserted/updated: ${price.id}`);
	}
};

const deleteProductRecord = async (product: stripe.Product) => {
	const { error: deletionError } = await supabaseAdmin
		.from('products')
		.delete()
		.eq('id', product.id);
	if (deletionError) throw new Error(`Product deletion failed: ${deletionError.message}`);
	console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: stripe.Price) => {
	const { error: deletionError } = await supabaseAdmin.from('prices').delete().eq('id', price.id);
	if (deletionError) throw new Error(`Price deletion failed: ${deletionError.message}`);
	console.log(`Price deleted: ${price.id}`);
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
	const { error: upsertError } = await supabaseAdmin
		.from('customers')
		.upsert([{ id: uuid, stripe_customer_id: customerId }]);

	if (upsertError)
		throw new Error(`Supabase customer record creation failed: ${upsertError.message}`);

	return customerId;
};

const createCustomerInStripe = async (uuid: string, email: string) => {
	const customerData = { metadata: { supabaseUUID: uuid }, email: email };
	const newCustomer = await stripeClient.customers.create(customerData);
	if (!newCustomer) throw new Error('Stripe customer creation failed.');

	return newCustomer.id;
};

const getStripeCustomerId = async (email: string, uuid: string) => {
	const { data: existingSupabaseCustomer, error: queryError } = await supabaseAdmin
		.from('customers')
		.select('*')
		.eq('id', uuid)
		.maybeSingle();

	if (queryError) {
		throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
	}

	let stripeCustomerId: string | undefined;
	if (existingSupabaseCustomer?.stripe_customer_id) {
		const existingStripeCustomer = await stripeClient.customers.retrieve(
			existingSupabaseCustomer.stripe_customer_id
		);
		stripeCustomerId = existingStripeCustomer.id;
	} else {
		const stripeCustomers = await stripeClient.customers.list({ email: email });
		stripeCustomerId = stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
	}

	return stripeCustomerId;
};

const createOrRetrieveCustomer = async ({ email, uuid }: { email: string; uuid: string }) => {
	// Check if the customer already exists in Supabase
	const { data: existingSupabaseCustomer, error: queryError } = await supabaseAdmin
		.from('customers')
		.select('*')
		.eq('id', uuid)
		.maybeSingle();

	if (queryError) {
		throw new Error(`Supabase customer lookup failed: ${queryError.message}`);
	}

	// Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
	let stripeCustomerId: string | undefined;
	if (existingSupabaseCustomer?.stripe_customer_id) {
		const existingStripeCustomer = await stripeClient.customers.retrieve(
			existingSupabaseCustomer.stripe_customer_id
		);
		stripeCustomerId = existingStripeCustomer.id;
	} else {
		// If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
		const stripeCustomers = await stripeClient.customers.list({ email: email });
		stripeCustomerId = stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
	}

	// If still no stripeCustomerId, create a new customer in Stripe
	const stripeIdToInsert = stripeCustomerId
		? stripeCustomerId
		: await createCustomerInStripe(uuid, email);
	if (!stripeIdToInsert) throw new Error('Stripe customer creation failed.');

	if (existingSupabaseCustomer && stripeCustomerId) {
		// If Supabase has a record but doesn't match Stripe, update Supabase record
		if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
			const { error: updateError } = await supabaseAdmin
				.from('customers')
				.update({ stripe_customer_id: stripeCustomerId })
				.eq('id', uuid);

			if (updateError)
				throw new Error(`Supabase customer record update failed: ${updateError.message}`);
			console.warn(`Supabase customer record mismatched Stripe ID. Supabase record updated.`);
		}
		// If Supabase has a record and matches Stripe, return Stripe customer ID
		return stripeCustomerId;
	} else {
		console.warn(`Supabase customer record was missing. A new record was created.`);

		// If Supabase has no record, create a new record and return Stripe customer ID
		const upsertedStripeCustomer = await upsertCustomerToSupabase(uuid, stripeIdToInsert);
		if (!upsertedStripeCustomer) throw new Error('Supabase customer record creation failed.');

		return upsertedStripeCustomer;
	}
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (uuid: string, payment_method: stripe.PaymentMethod) => {
	//Todo: check this assertion
	const customer = payment_method.customer as string;
	const { name, phone, address } = payment_method.billing_details;
	if (!name || !phone || !address) return;

	await stripeClient.customers.update(customer, { name, phone, address });
	const { error: updateError } = await supabaseAdmin
		.from('users')
		.update({
			billing_address: { ...address },
			payment_method: { ...payment_method[payment_method.type] }
		})
		.eq('id', uuid);
	if (updateError) throw new Error(`Customer update failed: ${updateError.message}`);
};

const manageSubscriptionStatusChange = async (
	subscriptionId: string,
	customerId: string,
	createAction = false
) => {
	// Get customer's UUID from mapping table.
	const { data: customerData, error: noCustomerError } = await supabaseAdmin
		.from('customers')
		.select('id')
		.eq('stripe_customer_id', customerId)
		.single();

	if (noCustomerError) throw new Error(`Customer lookup failed: ${noCustomerError.message}`);

	const { id: uuid } = customerData!;

	const subscription = await stripeClient.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method']
	});
	// Upsert the latest status of the subscription object.
	const subscriptionData: TablesInsert<'subscriptions'> = {
		id: subscription.id,
		user_id: uuid,
		metadata: subscription.metadata,
		status: subscription.status,
		product_id: subscription.items.data[0].price.product as string,
		price_id: subscription.items.data[0].price.id,
		quantity: 1, //subscription.quantity,
		cancel_at_period_end: subscription.cancel_at_period_end,
		cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
		canceled_at: subscription.canceled_at
			? toDateTime(subscription.canceled_at).toISOString()
			: null,
		current_period_start: toDateTime(subscription.current_period_start).toISOString(),
		current_period_end: toDateTime(subscription.current_period_end).toISOString(),
		created: toDateTime(subscription.created).toISOString(),
		ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
		trial_start: subscription.trial_start
			? toDateTime(subscription.trial_start).toISOString()
			: null,
		trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null
	};

	const { error: upsertError } = await supabaseAdmin
		.from('subscriptions')
		.upsert([subscriptionData]);
	if (upsertError) throw new Error(`Subscription insert/update failed: ${upsertError.message}`);
	console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`);

	// // For a new subscription copy the billing details to the customer object.
	// // NOTE: This is a costly operation and should happen at the very end.
	// if (createAction && subscription.default_payment_method && uuid) {
	// 	await copyBillingDetailsToCustomer(
	// 		uuid,
	// 		subscription.default_payment_method as stripe.PaymentMethod
	// 	);
	// }
};

const recordProductPurchase = async (userId: string, productId: string, priceId: string) => {
	console.log(
		`Recording product purchase for user [${userId}] and product [${productId}] with price [${priceId}]`
	);

	try {
		const { error } = await supabaseAdmin
			.from('purchases')
			.insert([{ user_id: userId, product_id: productId, price_id: priceId }]);

		if (error) {
			throw new Error(`Failed to record product purchase: ${error.message}`);
		}
	} catch (error) {
		console.error(error);
	}

	console.log(`Product purchased recorded for user [${userId}] and product [${productId}]`);
};

const hasProductAccess = async (userId: string, productId: string) => {
	// Check if user has purchased the product
	const { data: purchases, error: purchaseError } = await supabaseAdmin
		.from('purchases')
		.select('*')
		.eq('user_id', userId)
		.eq('product_id', productId);

	if (purchaseError) throw new Error(purchaseError.message);

	if (purchases && purchases.length > 0) {
		// User has purchased the product
		return true;
	}

	// Check if user has an active subscription for the product
	const { data: subscriptions, error: subError } = await supabaseAdmin
		.from('subscriptions')
		.select('*')
		.eq('user_id', userId)
		.eq('product_id', productId)
		.in('status', ['active', 'trialing']);

	if (subError) throw new Error(subError.message);

	if (subscriptions && subscriptions.length > 0) {
		// User has an active subscription
		return true;
	}

	return false;
};

const validateInput = (userId: string, credits: number, description: string) => {
	if (!userId) throw new Error('User ID is required');
	if (credits <= 0) throw new Error('Credits must be greater than zero');
	if (!description) throw new Error('Description is required');
};

const logCreditTransaction = async (userId: string, creditsChange: number, description: string) => {
	const { error } = await supabaseAdmin.from('credit_transactions').insert({
		user_id: userId,
		credits_change: creditsChange,
		description,
		created_at: new Date().toISOString()
	});

	if (error) {
		throw new Error(`Error logging credit transaction: ${error.message}`);
	}
};

const updateUserCredits = async (userId: string, creditsChange: number, description: string) => {
	validateInput(userId, Math.abs(creditsChange), description);

	const { data: creditData, error: fetchError } = await supabaseAdmin
		.from('user_credits')
		.select('credits_remaining, last_updated')
		.eq('user_id', userId)
		.single();

	if (fetchError) {
		throw new Error(`Error fetching credits: ${fetchError.message}`);
	}

	const newCreditTotal = (creditData?.credits_remaining || 0) + creditsChange;

	if (newCreditTotal < 0) {
		throw new Error('Insufficient credits');
	}

	const { error: upsertError } = await supabaseAdmin
		.from('user_credits')
		.upsert(
			{
				user_id: userId,
				credits_remaining: newCreditTotal,
				last_updated: new Date().toISOString()
			},
			{
				onConflict: 'user_id'
			}
		)
		.eq('last_updated', creditData?.last_updated); // Optimistic concurrency control

	if (upsertError) {
		throw new Error(`Error updating credits: ${upsertError.message}`);
	}

	await logCreditTransaction(userId, creditsChange, description);

	console.log(
		`${creditsChange > 0 ? 'Added' : 'Deducted'} ${Math.abs(creditsChange)} credits to user [${userId}]`
	);
};

const addCredits = async (userId: string, creditsToAdd: number, description: string) => {
	try {
		await updateUserCredits(userId, creditsToAdd, description);
	} catch (error) {
		console.error(error);
	}
};

const deductCredits = async (userId: string, creditsToDeduct: number, description: string) => {
	try {
		await updateUserCredits(userId, -creditsToDeduct, description);
	} catch (error) {
		console.error(error);
	}
};

const getUserCredits = async (userId: string) => {
	if (!userId) throw new Error('User ID is required');

	// Fetch the user's credits from the user_credits table
	const { data: creditData, error } = await supabaseAdmin
		.from('user_credits')
		.select('credits_remaining')
		.eq('user_id', userId)
		.single();

	if (error && error.code !== 'PGRST116') {
		// Code 'PGRST116' represents no rows found
		throw new Error(`Error fetching credits: ${error.message}`);
	}

	if (!creditData) {
		// If no row exists in the user_credits table, insert a new row for the user
		const { error: insertError } = await supabaseAdmin.from('user_credits').insert({
			user_id: userId,
			credits_remaining: 0
		});

		if (insertError) {
			throw new Error(`Error creating user credits: ${insertError.message}`);
		}

		return 0;
	}

	return creditData.credits_remaining;
};

type ProductWithPrices = Product & {
	prices: Price[];
	actualPrice?: number;
};

const getActiveProductsWithPrices = async (limit = 10, offset = 0) => {
	const {
		data: products,
		error,
		count
	} = await supabaseAdmin
		.from('products')
		.select('*, prices(*)', { count: 'exact' })
		.eq('active', true)
		.order('name', { ascending: true })
		.range(offset, offset + limit - 1);

	if (error) {
		throw new Error(`Error fetching products: ${error.message}`);
	}

	for (const product of products as ProductWithPrices[]) {
		if (product.prices && product.prices.length > 0) {
			// Assuming the default price is the first one
			const defaultPrice = product.prices[0];
			product.actualPrice = defaultPrice.unit_amount! / 100;
		}
	}

	return { products: products as ProductWithPrices[], count };
};

const getProductById = async (productId: string) => {
	const { data: product, error } = await supabaseAdmin
		.from('products')
		.select('*')
		.eq('id', productId)
		.single();

	if (error) {
		throw new Error(`Error fetching product: ${error.message}`);
	}

	return product as Product;
};

const getUserSubscriptions = async (userId: string) => {
	try {
		// Step 1: Retrieve subscription data
		const { data: subscriptions, error } = await supabaseAdmin
			.from('subscriptions')
			.select('*')
			.eq('user_id', userId);

		if (error) {
			console.error('Error retrieving subscriptions:', error.message);
			throw new Error('Failed to fetch subscriptions');
		}

		// Step 2: Map through each subscription and fetch product and price details
		const subscriptionDetails = await Promise.all(
			subscriptions.map(async (sub) => {
				// Fetch product and price details from Stripe
				const product = await stripeClient.products.retrieve(sub.product_id);
				const price = await stripeClient.prices.retrieve(sub.price_id);

				console.log(sub);

				const expiryDate = new Date(sub.current_period_end);

				// Format output data
				return {
					productName: product.name,
					amount: (price.unit_amount / 100).toFixed(2),
					currency: price.currency.toUpperCase(),
					interval: price.recurring?.interval || 'one-time',
					expiryDate: expiryDate.toLocaleDateString('en-GB', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric'
					}),
					status: sub.status
				};
			})
		);

		return subscriptionDetails;
	} catch (error) {
		console.error('An error occurred while retrieving subscription details:', error);
		throw new Error('Could not retrieve subscription details');
	}
};

const getUserTransactions = async (userId: string) => {
	try {
		// Step 1: Retrieve the customer ID associated with the user
		const { data, error } = await supabaseAdmin
			.from('customers')
			.select('stripe_customer_id')
			.eq('id', userId)
			.single();

		if (error) {
			console.error('Error retrieving user data:', error.message);
			throw new Error('Failed to fetch user data');
		}

		const customerId = data?.stripe_customer_id;
		if (!customerId) {
			throw new Error('No Stripe customer ID found for this user');
		}

		// Step 2: Fetch charge transactions from Stripe
		const charges = await stripeClient.charges.list({ customer: customerId });

		// Step 3: Format transaction data
		const transactions = charges.data.map((charge) => ({
			amount: (charge.amount / 100).toFixed(2),
			currency: charge.currency.toUpperCase(),
			description: charge.description ?? 'No description provided',
			status: charge.status,
			created: new Date(charge.created * 1000).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			}),
			receipt_url: charge.receipt_url
		}));

		return transactions;
	} catch (error) {
		console.error('An error occurred while retrieving transactions:', error);
		throw new Error('Could not retrieve transactions');
	}
};

export {
	upsertProductRecord,
	upsertPriceRecord,
	deleteProductRecord,
	deletePriceRecord,
	createOrRetrieveCustomer,
	manageSubscriptionStatusChange,
	recordProductPurchase,
	hasProductAccess,
	addCredits,
	deductCredits,
	getUserCredits,
	getActiveProductsWithPrices,
	getProductById,
	upsertCustomerToSupabase,
	getStripeCustomerId,
	getUserSubscriptions,
	getUserTransactions
};

import type { RequestHandler } from '@sveltejs/kit';
import stripe from 'stripe';
import { PUBLIC_STRIPE_SECRET_KEY } from '$env/static/public';
import { PUBLIC_STRIPE_ENDPOINT_SECRET } from '$env/static/public';
import {
	createOrRetrieveCustomer,
	deletePriceRecord,
	deleteProductRecord,
	manageSubscriptionStatusChange,
	upsertPriceRecord,
	upsertProductRecord
} from '$lib/utils/supabase/admin';

const stripeClient = new stripe(PUBLIC_STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();

	try {
		let event = JSON.parse(body) as stripe.Event;

		// Get the signature sent by Stripe
		const signature = request.headers.get('stripe-signature');

		// Only verify the event if you have an endpoint secret defined.
		// Otherwise use the basic event deserialized with JSON.parse
		if (PUBLIC_STRIPE_ENDPOINT_SECRET && signature) {
			try {
				event = stripeClient.webhooks.constructEvent(
					body,
					signature,
					PUBLIC_STRIPE_ENDPOINT_SECRET
				);
			} catch (err) {
				console.error(`⚠️  Webhook signature verification failed.`, err.message);
				return {
					status: 400,
					body: {}
				};
			}
		}

		switch (event.type) {
			case 'product.created':
			case 'product.updated':
				await upsertProductRecord(event.data.object as stripe.Product);
				break;
			case 'price.created':
			case 'price.updated':
				await upsertPriceRecord(event.data.object as stripe.Price);
				break;
			case 'price.deleted':
				await deletePriceRecord(event.data.object as stripe.Price);
				break;
			case 'product.deleted':
				await deleteProductRecord(event.data.object as stripe.Product);
				break;
			case 'customer.created':
			case 'customer.updated':
				// TODO - this should be passing the supabase customer uuid not the stripe customer id
				await createOrRetrieveCustomer({
					email: (event.data.object as stripe.Customer).email!,
					uuid: event.data.object.id
				});
				break;
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted': {
				const subscription = event.data.object as stripe.Subscription;
				await manageSubscriptionStatusChange(
					subscription.id,
					subscription.customer as string,
					event.type === 'customer.subscription.created'
				);
				break;
			}
			case 'checkout.session.completed': {
				const checkoutSession = event.data.object as stripe.Checkout.Session;
				if (checkoutSession.mode === 'subscription') {
					const subscriptionId = checkoutSession.subscription;
					await manageSubscriptionStatusChange(
						subscriptionId as string,
						checkoutSession.customer as string,
						true
					);
				}
				break;
			}
			default:
				console.error(`Unhandled event type ${event.type}`);
		}

		// Return a response to acknowledge receipt of the event
		return new Response(JSON.stringify({ received: true }), {
			status: 200
		});
	} catch (err) {
		console.log(`Webhook Error: ${err.message}`);
		return {
			status: 400,
			body: `Webhook Error: ${err.message}`
		};
	}
};

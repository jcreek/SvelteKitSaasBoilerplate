import { redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import { getProductById, upsertCustomerToSupabase } from '$lib/utils/supabase/admin';
import logger from '$lib/utils/logger/logger';

export const load = async ({ fetch, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	const response = await fetch('/api/checkout/status');
	if (!response.ok) {
		logger.error('Failed to fetch checkout status');
		return;
	}

	const responseJson = await response.json();
	const checkoutSession: Stripe.Checkout.Session = responseJson.checkoutSession;
	const lineItems: Stripe.LineItem[] = responseJson.lineItems.data;
	const paymentStatus: Stripe.Checkout.Session.PaymentStatus = responseJson.paymentStatus;

	if (paymentStatus == 'unpaid') {
		throw redirect(303, '/checkout/cancelled');
	}

	for (const lineItem of lineItems as LineItemForCheckout[]) {
		const product = await getProductById(lineItem.price?.product.toString() ?? '');
		lineItem.imgSrc = product.images ? product.images[0] : '';
		lineItem.productDescription = product.description ?? '';
	}

	if (session?.user.id) {
		const stripeCustomerId = checkoutSession.customer as string;
		await upsertCustomerToSupabase(session.user.id, stripeCustomerId);
	} else {
		logger.error('User ID is undefined');
	}

	return {
		checkoutSession,
		lineItems
	};
};

type LineItemForCheckout = Stripe.LineItem & {
	imgSrc: string;
	productDescription: string;
};

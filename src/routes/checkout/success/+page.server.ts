import { redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import { getProductById } from '$lib/utils/supabase/admin';

export const load = async ({ fetch }) => {
	const response = await fetch('/api/checkout/status');
	if (!response.ok) {
		console.error('Failed to fetch checkout status');
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

	return {
		checkoutSession,
		lineItems
	};
};

type LineItemForCheckout = Stripe.LineItem & {
	imgSrc: string;
	productDescription: string;
};

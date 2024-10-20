import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import Stripe from 'stripe';

export const load: PageLoad = async ({ fetch }) => {
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

	// Save the stripe customer id in the customers table
	const stripeCustomerId = checkoutSession.customer as string;
	console.log('stripeCustomerId', stripeCustomerId);
	const createCustomerResponse = await fetch(
		'/api/checkout/create-customer?stripeCustomerId=' + stripeCustomerId
	);
	if (!createCustomerResponse.ok) {
		console.error('Failed to create customer');
	}

	return {
		checkoutSession,
		lineItems,
		paymentStatus
	};
};

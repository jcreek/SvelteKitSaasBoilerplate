import { type RequestHandler, redirect } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';
import { getStripeCustomerId } from '$lib/utils/supabase/admin';
import type Stripe from 'stripe';

// Create a checkout session
export const POST: RequestHandler = async ({ request, cookies, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		// If no session is found, the user isn't authenticated, so block the action
		return new Response('Unauthorized', { status: 401 });
	}

	const userId = session.user.id;
	const userEmail = session.user.email;

	const formData = new URLSearchParams(await request.text());
	const items: { priceId: string; quantity: number }[] = [];

	// Iterate over form data to extract basket items and their details
	for (const [key, value] of formData) {
		items.push({ priceId: key, quantity: parseInt(value, 10) });
	}

	const lineItems = items.map((item) => ({
		price: item.priceId,
		quantity: item.quantity
	}));

	let stripeCustomerId = null;

	// Get the existing Stripe customer ID from Supabase, if it exists
	try {
		stripeCustomerId = await getStripeCustomerId(userEmail!, userId);
	} catch (error) {
		console.error('Error fetching Stripe customer ID:', error);
	}

	const stripeCheckoutSessionObject = {
		line_items: lineItems,
		mode: 'payment',
		success_url: `${request.headers.get('origin')}/checkout/success`,
		cancel_url: `${request.headers.get('origin')}/checkout/cancelled`,
		metadata: {
			userId: userId
		}
	} as Stripe.Checkout.SessionCreateParams;

	if (stripeCustomerId) {
		// If the user has a Stripe customer ID, attach it to the checkout session
		stripeCheckoutSessionObject.customer = stripeCustomerId;
	} else {
		// If the user doesn't have a Stripe customer ID, create a new customer
		stripeCheckoutSessionObject.customer_creation = 'always';
		stripeCheckoutSessionObject.customer_email = userEmail;
	}

	const checkoutSession = await stripeClient.checkout.sessions.create(stripeCheckoutSessionObject);

	// Store the checkout session.id for access from the frontend
	cookies.set('checkout_session_id', checkoutSession.id, { path: '/' });
	return redirect(303, checkoutSession.url as string);
};

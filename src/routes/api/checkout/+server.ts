import { type RequestHandler, redirect } from '@sveltejs/kit';
import { PUBLIC_STRIPE_SECRET_KEY } from '$env/static/public';
import stripe from 'stripe';

const stripeClient = new stripe(PUBLIC_STRIPE_SECRET_KEY);

// Create a checkout session
export const POST: RequestHandler = async ({ request }) => {
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

	const session = await stripeClient.checkout.sessions.create({
		line_items: lineItems,
		mode: 'payment',
		success_url: `${request.headers.get('origin')}/checkout/success`,
		cancel_url: `${request.headers.get('origin')}/checkout/cancelled`
	});

	// TODO - Store the checkout session.id for access from the frontend
	// https://docs.stripe.com/api/checkout/sessions/retrieve

	return redirect(303, session.url as string);
};

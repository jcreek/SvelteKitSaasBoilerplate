import { type RequestHandler, redirect } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';

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

	const checkoutSession = await stripeClient.checkout.sessions.create({
		customer_creation: 'always',
		customer_email: userEmail,
		line_items: lineItems,
		mode: 'payment',
		success_url: `${request.headers.get('origin')}/checkout/success`,
		cancel_url: `${request.headers.get('origin')}/checkout/cancelled`,
		metadata: {
			userId: userId
		}
	});

	// Store the checkout session.id for access from the frontend
	cookies.set('checkout_session_id', checkoutSession.id, { path: '/' });
	return redirect(303, checkoutSession.url as string);
};

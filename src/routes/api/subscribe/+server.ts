import { type RequestHandler, redirect } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';

// Create a subscription checkout session
export const POST: RequestHandler = async ({ request, cookies, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		// If no session is found, the user isn't authenticated, so block the action
		return new Response('Unauthorized', { status: 401 });
	}

	const userId = session.user.id;

	// Get the price ID from the request body
	const { priceId } = await request.json();

	if (!priceId) {
		return new Response('Price ID is required', { status: 400 });
	}

	// Create a subscription checkout session with Stripe
	const checkoutSession = await stripeClient.checkout.sessions.create({
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode: 'subscription',
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

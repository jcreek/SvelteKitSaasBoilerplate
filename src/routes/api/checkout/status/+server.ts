import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe as stripeClient } from '$lib/utils/stripe';

export const GET: RequestHandler = async ({ cookies }) => {
  const sessionId = cookies.get('checkout_session_id');
	if (!sessionId) {
		return json({ error: 'No checkout session found' }, { status: 400 });
	}
	const checkoutSession = await stripeClient.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });

	const statusResponse = {
		checkoutSession: checkoutSession,
		paymentStatus: checkoutSession.payment_status,
		lineItems: checkoutSession.line_items
	};

	return json(statusResponse);
};

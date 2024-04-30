import { type RequestHandler, redirect } from '@sveltejs/kit';

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
// eslint-disable-next-line @typescript-eslint/no-var-requires
import stripe from 'stripe';
const stripeSecretKey =
	'sk_test_51PBMpZLiKlsU6INBHEsWwU2ekDfmotWTZghSl0XRLhtWp6mU7cBIfyBs6eBnG5kgC6MUhnvH5lUm2AbSWxgGfnKm00qTpaUnAP';
const stripeClient = new stripe(stripeSecretKey);

// Create a checkout session
export const POST: RequestHandler = async ({ request }) => {
	// const { priceId } = await request.json(); // Assuming you'll send the price ID from the client
	const session = await stripeClient.checkout.sessions.create({
		line_items: [
			{
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price: 'price_1PBNHRLiKlsU6INBjXMcRxxS', //priceId,
				quantity: 1
			}
		],
		mode: 'payment',
		success_url: `${request.headers.get('origin')}/checkout/success`,
		cancel_url: `${request.headers.get('origin')}/checkout/cancel`
	});

	return redirect(303, session.url as string);
};

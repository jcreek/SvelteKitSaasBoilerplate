import { json } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';

export const GET = async ({ params }) => {
	const { priceId } = params;
	const price = await stripeClient.prices.retrieve(priceId);
	return json(price);
};

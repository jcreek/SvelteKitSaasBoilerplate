import { json } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';

export const GET = async ({ params }) => {
	const { productId } = params;
	const product = await stripeClient.products.retrieve(productId);
	return json(product);
};

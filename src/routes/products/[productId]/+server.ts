import { json } from '@sveltejs/kit';
import { PUBLIC_STRIPE_SECRET_KEY } from '$env/static/public';
import stripe from 'stripe';
const stripeClient = new stripe(PUBLIC_STRIPE_SECRET_KEY);

export const GET = async ({ params }) => {
	const { productId } = params;
	const product = await stripeClient.products.retrieve(productId);
	return json(product);
};

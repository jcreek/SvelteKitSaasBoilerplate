import { json } from '@sveltejs/kit';
import { PUBLIC_STRIPE_SECRET_KEY } from '$env/static/public';
import stripe from 'stripe';
const stripeClient = new stripe(PUBLIC_STRIPE_SECRET_KEY);

export const GET = async () => {
	const products = await stripeClient.products.list({
		limit: 100
	});

	try {
		// Get the price for each product
		for (const product of products.data) {
			const price = await stripeClient.prices.retrieve(product.default_price as string);
			if (price) {
				product.actualPrice = price.unit_amount / 100;
			}
		}
	} catch (error) {
		console.error(error);
	}
	return json(products);
};

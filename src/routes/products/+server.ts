import { json } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';

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

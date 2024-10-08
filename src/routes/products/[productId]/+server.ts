import { json } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';
import Stripe from 'stripe';

export const GET = async ({ params }) => {
	const { productId } = params;
	const product = await stripeClient.products.retrieve(productId);

	const price = await stripeClient.prices.retrieve(product.default_price);

	const isSubscription = price.type === ('recurring' as Stripe.Price.type);
	product.isSubscription = isSubscription;
	return json(product);
};

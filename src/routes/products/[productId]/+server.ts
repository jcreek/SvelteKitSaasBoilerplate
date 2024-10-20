import { json } from '@sveltejs/kit';
import { stripe as stripeClient } from '$lib/utils/stripe';
import Stripe from 'stripe';
import { type ProductInfo } from '$lib/types/Products/ProductInfo';

export const GET = async ({ params }) => {
	const { productId } = params;
	const product = await stripeClient.products.retrieve(productId);

	const price = await stripeClient.prices.retrieve(product.default_price as string);

	const isSubscription = price.type === ('recurring' as Stripe.Price.Type);

	const productInfo: ProductInfo = {
		product,
		price,
		isSubscription
	}

	return json(productInfo);
};

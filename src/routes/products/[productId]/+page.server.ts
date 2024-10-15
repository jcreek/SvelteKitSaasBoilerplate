import { redirect } from '@sveltejs/kit';
import { hasProductAccess } from '$lib/utils/supabase/admin';

export const load = async ({ params, locals: { safeGetSession }, fetch }) => {
	const { session } = await safeGetSession();
	if (!session) {
		throw redirect(303, '/login'); // Redirect unauthenticated users to login
	}
	
	const productResponse = await fetch(`/products/${params.productId}`);
	const product = await productResponse.json();
	
	// Create the item object
	const item = {
		id: product.id,
		name: product.name,
		categoryDescription: product.description,
		imgAlt: product.description,
		imgSrc: product.images[0],
		price: 0,
		priceId: product.default_price,
		quantity: 1
	}

	// Fetch the price of the product
	const priceResponse = await fetch(`/products/prices/${product.default_price}`);
	const price = await priceResponse.json();
	// Set the price of the product
	item.price = price.unit_amount / 100;

	// Check if the user has access to the 'EXAMPLE PRODUCT' product
	const hasPurchasedProduct = await hasProductAccess(session.user.id, params.productId);

	return { params, hasPurchasedProduct, item };
};

import { redirect } from '@sveltejs/kit';
import { hasProductAccess } from '$lib/utils/supabase/admin';
import type { ProductInfo } from '$lib/types/Products/ProductInfo';

export const load = async ({ params, locals: { safeGetSession }, fetch }) => {
	const { session } = await safeGetSession();
	if (!session) {
		throw redirect(303, '/login'); // Redirect unauthenticated users to login
	}
	
	const productResponse = await fetch(`/products/${params.productId}`);
	const { product, isSubscription, price }: ProductInfo = await productResponse.json();
	
	// Create the item object
	const item = {
		id: product.id,
		name: product.name,
		categoryDescription: product.description,
		imgAlt: product.description,
		imgSrc: product.images[0],
		priceId: product.default_price,
		quantity: 1,
		isSubscription: isSubscription,
		price: (price.unit_amount ? price.unit_amount / 100 : NaN),
		interval: price.recurring ? price.recurring.interval : null,
	}
	

	// Check if the user has access to the 'EXAMPLE PRODUCT' product
	const hasPurchasedProduct = await hasProductAccess(session.user.id, params.productId);

	return { params, hasPurchasedProduct, item };
};

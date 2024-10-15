import { json } from '@sveltejs/kit';
import { getActiveProductsWithPrices } from '$lib/utils/supabase/admin';

export const GET = async ({ url }) => {
	try {
		const limitParam = url.searchParams.get('limit');
		const offsetParam = url.searchParams.get('offset');

		const limit = limitParam ? parseInt(limitParam, 10) : 10;
		const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

		const { products, count } = await getActiveProductsWithPrices(limit, offset);

		return json({ products, count });
	} catch (error) {
		console.error(error);
		return json({ error: error.message }, { status: 500 });
	}
};

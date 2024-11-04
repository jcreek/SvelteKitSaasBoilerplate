import { json } from '@sveltejs/kit';
import { getActiveProductsWithPrices } from '$lib/utils/supabase/admin';
import logger from '$lib/utils/logger/logger';

export const GET = async ({ url }) => {
	try {
		const limitParam = url.searchParams.get('limit');
		const offsetParam = url.searchParams.get('offset');

		const limit = limitParam ? parseInt(limitParam, 10) : 10;
		const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

		const { products, count } = await getActiveProductsWithPrices(limit, offset);

		return json({ products, count });
	} catch (error) {
		logger.error('Failed to fetch products', {
			error: error.message,
			stack: error.stack,
			params: {
				limit: limitParam,
				offset: offsetParam
			}
		});
		return json({ error: error.message }, { status: 500 });
	}
};

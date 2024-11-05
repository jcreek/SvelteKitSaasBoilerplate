import { json } from '@sveltejs/kit';
import { getActiveProductsWithPrices } from '$lib/utils/supabase/admin';
import logger from '$lib/utils/logger/logger';

export const GET = async ({ url }) => {
	const limitParam: string | null = url.searchParams.get('limit');
	const offsetParam: string | null = url.searchParams.get('offset');
	try {
		const limit = limitParam ? Number.parseInt(limitParam, 10) : 10;
		const offset = offsetParam ? Number.parseInt(offsetParam, 10) : 0;

		const { products, count } = await getActiveProductsWithPrices(limit, offset);

		return json({ products, count });
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error('Failed to fetch products', {
				error: error.message,
				stack: error.stack,
				params: {
					limit: limitParam,
					offset: offsetParam
				}
			});
			return json({ error: error.message }, { status: 500 });
		} else {
			logger.error('Failed to fetch products', {
				error,
				params: {
					limit: limitParam,
					offset: offsetParam
				}
			});
			return json({ error }, { status: 500 });
		}
	}
};

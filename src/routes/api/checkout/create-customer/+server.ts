import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { upsertCustomerToSupabase } from '$lib/utils/supabase/admin';

export const GET: RequestHandler = async ({ url, locals: { safeGetSession } }) => {
	const stripeCustomerId = url.searchParams.get('stripeCustomerId');
	const { session } = await safeGetSession();

	if (!session || !stripeCustomerId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	await upsertCustomerToSupabase(session?.user.id, stripeCustomerId);

	return json({ message: 'Customer created' });
};

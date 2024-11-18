import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import logger from '$lib/utils/logger/logger';
import { getUserSubscriptions, getUserTransactions } from '$lib/utils/supabase/admin';
import { requestAccountDeletion } from '$lib/utils/supabase/admin';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: user } = await supabase
		.from('users')
		.select(`name`)
		.eq('id', session.user.id)
		.single();

	const subscriptions = await getUserSubscriptions(session.user.id);

	const transactions = await getUserTransactions(session.user.id);

	return { session, user, subscriptions, transactions };
};

export const actions: Actions = {
	delete: async ({ url, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const baseUrl = url.origin;
		if (session) {
			if (!session.user.email) {
				return fail(400, { message: 'Email is required for account deletion' });
			}
			try {
				await requestAccountDeletion(session.user.id, session.user.email, baseUrl);
				return {
					success: true,
					message: 'Account deletion request submitted successfully'
				};
			} catch (error) {
				console.error('Failed to request account deletion:', error);
				return fail(500, { message: 'Failed to process deletion request' });
			}
		} else {
			redirect(303, '/');
		}
	},
	update: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;

		const { session } = await safeGetSession();

		if (!session) {
			return fail(401, { name });
		}
		const { error } = await supabase
			.from('users')
			.update({
				name: name
			})
			.eq('id', session?.user.id);

		if (error) {
			logger.error('Failed to update user name', {
				userId: session?.user.id,
				error
			});
		}

		if (error) {
			return fail(500, {
				name
			});
		}

		return {
			name
		};
	}
};

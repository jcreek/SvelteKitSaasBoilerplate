import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSubscriptions, getUserTransactions } from '$lib/utils/supabase/admin';

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

		console.error('Failed to update user:', error);

		if (error) {
			return fail(500, {
				name,
				message: 'Failed to update profile',
				error: error.message
			});
		}

		return {
			name
		};
	},
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const { session } = await safeGetSession();
		if (session) {
			await supabase.auth.signOut();
			redirect(303, '/');
		}
	}
};

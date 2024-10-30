import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import logger from '$lib/utils/logger/logger';

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

	return { session, user };
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

		logger.error(error);

		if (error) {
			return fail(500, {
				name
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

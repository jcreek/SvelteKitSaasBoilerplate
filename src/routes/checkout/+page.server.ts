/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';

export const load = async ({ params, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		throw redirect(303, '/login'); // Redirect unauthenticated users to login
	}

	return params;
};

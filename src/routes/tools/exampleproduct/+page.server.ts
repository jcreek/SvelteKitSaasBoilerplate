/** @type {import('./$types').PageLoad} */
import { redirect } from '@sveltejs/kit';
import { hasProductAccess } from '$lib/utils/supabase/admin';
import { VITE_PRODUCT_ID_EXAMPLEPRODUCT } from '$env/static/private'; // Import the example product ID from env

export const load = async ({ params, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (!session) {
		throw redirect(303, '/login'); // Redirect unauthenticated users to login
	}

	// Check if the user has access to the 'EXAMPLE PRODUCT' product
	const accessGranted = await hasProductAccess(session.user.id, VITE_PRODUCT_ID_EXAMPLEPRODUCT);
	if (!accessGranted) {
		throw redirect(303, '/unauthorised');
	}

	return params;
};

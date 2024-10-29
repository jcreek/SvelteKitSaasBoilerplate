import type { RequestHandler } from '@sveltejs/kit';
import { deleteAccount } from '$lib/utils/supabase/admin';

export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		return new Response('Invalid token', { status: 400 });
	}

	try {
		await deleteAccount(token);
	} catch (error) {
		console.error(error);
		return new Response('Failed to delete account', { status: 500 });
	}

	return new Response('Account deleted successfully', { status: 200 });
};

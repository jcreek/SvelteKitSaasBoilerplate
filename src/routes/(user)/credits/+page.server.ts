import { redirect } from '@sveltejs/kit';
import { getUserCredits, getUserCreditTransactions } from '$lib/utils/supabase/admin';

export async function load({ locals: { safeGetSession } }) {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const userId = session.user?.id;
	if (!userId) {
		return { error: 'User not authenticated' };
	}

	try {
		const creditsRemaining = await getUserCredits(userId);
		const transactions = await getUserCreditTransactions(userId);

		return {
			creditsRemaining,
			transactions
		};
	} catch (error) {
		return {
			error: error.message
		};
	}
}

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserCredits, getUserCreditTransactions } from '$lib/utils/supabase/admin';
import logger from '$lib/utils/logger/logger';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const userId = session.user?.id;
	if (!userId) {
		return { error: 'User not authenticated' };
	}

	try {
		const creditsRemaining = await getUserCredits(userId).catch((error) => {
			logger.error('Failed to fetch user credits:', error);
			throw new Error('Unable to retrieve credit balance');
		});
		const transactions = await getUserCreditTransactions(userId).catch((error) => {
			logger.error('Failed to fetch credit transactions:', error);
			throw new Error('Unable to retrieve transaction history');
		});

		const monthlyAggregates = transactions.reduce((acc, transaction) => {
			const date = new Date(transaction.created_at);
			const month = date.toISOString().substring(0, 7); // Returns YYYY-MM format

			if (!acc[month]) acc[month] = { credits_added: 0, credits_deducted: 0 };

			if (transaction.credits_change > 0) {
				acc[month].credits_added += transaction.credits_change;
			} else {
				acc[month].credits_deducted += transaction.credits_change;
			}

			return acc;
		}, {});

		return {
			creditsRemaining,
			transactions,
			monthlyAggregates
		};
	} catch (error) {
		return {
			error: error.message
		};
	}
};

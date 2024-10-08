import { json } from '@sveltejs/kit';
import { addCredits, deductCredits, getUserCredits } from '$lib/utils/supabase/admin';

export const POST = async ({ request }) => {
	const { action, userId, credits, description } = await request.json();

	if (!userId) {
		return json({ success: false, error: 'User ID is required' }, { status: 400 });
	}

	try {
		if (action === 'addCredits') {
			await addCredits(userId, credits, description);
			const updatedCredits = await getUserCredits(userId);
			return json({ success: true, credits: updatedCredits });
		} else if (action === 'deductCredits') {
			await deductCredits(userId, credits, description);
			const updatedCredits = await getUserCredits(userId);
			return json({ success: true, credits: updatedCredits });
		} else if (action === 'getUserCredits') {
			const fetchedCredits = await getUserCredits(userId);
			return json({ success: true, credits: fetchedCredits });
		} else {
			return json({ success: false, error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}
};

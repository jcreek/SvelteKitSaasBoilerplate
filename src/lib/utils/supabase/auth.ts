import type { SupabaseClient } from '@supabase/supabase-js';

export async function signOut(supabase: SupabaseClient, callback: () => void): Promise<void> {
	// TODO - #61 use the error from the response
	const { error } = await supabase.auth.signOut().then(callback);
}

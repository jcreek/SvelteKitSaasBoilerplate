// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';
declare global {
	const __DATE__: string;
	const __RELOAD_SW__: boolean;

	// Enable images with query params
	declare module '*&img';

	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
			userid: string;
			buildDate: string;
			periodicUpdates: boolean;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

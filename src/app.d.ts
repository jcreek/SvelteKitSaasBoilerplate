// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import { SupabaseClient, Session, User } from '@supabase/supabase-js'
declare global {
	const __DATE__: string;
	const __RELOAD_SW__: boolean;
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient
      safeGetSession(): Promise<{ session: Session | null; user: User | null }>
			userid: string;
			buildDate: string;
			periodicUpdates: boolean;
		}
		interface PageData {
      session: Session | null
    }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

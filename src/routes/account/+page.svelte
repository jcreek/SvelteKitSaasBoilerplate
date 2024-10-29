<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, supabase, user } = data;
	$: ({ session, supabase, user } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let name: string = user?.name ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};

	const handleAccountDeletion: SubmitFunction = () => {
		loading = true;
		if (session.user && session.user.email) {
			alert('Check your email to confirm account deletion.');
		}
		return async () => {
			loading = false;
		};
	};
</script>

<div class="form-widget">
	<form
		class="form-widget"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div>
			<label for="name">Name</label>
			<input id="name" name="name" type="text" value={form?.name ?? name} />
		</div>

		<div>
			<input
				type="submit"
				class="button block primary"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}
			/>
		</div>
	</form>

	<form method="post" action="?/signout" use:enhance={handleSignOut}>
		<div>
			<button class="button block" disabled={loading}>Sign Out</button>
		</div>
	</form>

	<form method="post" action="?/delete" use:enhance={handleAccountDeletion}>
		<div>
			<button class="button block" disabled={loading}>Delete My Account</button>
		</div>
	</form>
</div>

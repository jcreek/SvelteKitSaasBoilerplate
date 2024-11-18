<script lang="ts">
	import { scheduleToast } from '$lib/stores/toastStore.js';

	// Access the supabase client from the layout data
	export let supabase: any;

	let newPassword = '';

	async function resetPassword() {
		if (newPassword === '') {
			scheduleToast('Please enter a new password', 'error', 5000);
			return;
		}

		const { data, error } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (error) {
			console.error('Error updating password:', error.message);
			scheduleToast('Error updating password. Please try again.', 'error', 5000);

			return;
		} else {
			scheduleToast(
				'Password updated successfully. Please sign in with your new password.',
				'success',
				5000
			);
		}
	}
</script>

<svelte:head>
	<title>Update Password</title>
</svelte:head>

<main>
	<h1>Update Password</h1>
	<form on:submit|preventDefault={resetPassword}>
		<label for="newPassword">New Password</label>
		<input type="password" id="newPassword" bind:value={newPassword} />
		<button type="submit">Update Password</button>
	</form>
</main>

<script lang="ts">
	import { general } from '$lib/stores/generalStore.js';

	// Access the supabase client from the layout data
	export let supabase: any;

	let newPassword = '';

	async function resetPassword() {
		if (newPassword === '') {
			general.update((value) => {
				return {
					...value,
					hideToast: false,
					toastMessage: 'Please enter a new password',
					toastType: 'error'
				};
			});

			setTimeout(() => {
				general.update((value) => {
					return { ...value, hideToast: true, toastMessage: '', toastType: 'success' };
				});
			}, 5000);

			return;
		}

		const { data, error } = await supabase.auth.updateUser({
			password: newPassword
		});

		if (error) {
			console.error('Error updating password:', error.message);
			general.update((value) => {
				return {
					...value,
					hideToast: false,
					toastMessage: 'Error updating password. Please try again.',
					toastType: 'error'
				};
			});

			setTimeout(() => {
				general.update((value) => {
					return { ...value, hideToast: true, toastMessage: '', toastType: 'success' };
				});
			}, 5000);

			return;
		} else {
			general.update((value) => {
				return {
					...value,
					hideToast: false,
					toastMessage: 'Password updated successfully. Please sign in with your new password.',
					toastType: 'success'
				};
			});

			setTimeout(() => {
				general.update((value) => {
					return { ...value, hideToast: true, toastMessage: '', toastType: 'success' };
				});
			}, 5000);
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

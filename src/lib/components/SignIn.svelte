<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { general } from '$lib/stores/generalStore.js';
	import stripe from 'stripe';
	import { PUBLIC_STRIPE_SECRET_KEY } from '$env/static/public';
	
	const stripeClient = new stripe(PUBLIC_STRIPE_SECRET_KEY);
	
	const dispatch = createEventDispatcher();

	function emitSignedInEvent() {
		dispatch('signedIn', {});
	}

	let email = '';
	let password = '';

	// Access the supabase client from the layout data
	export let supabase: any;
	export let session: any;

	async function signInWithEmail() {
		try {
			// Sign in with email and password
			const { data, error } = await supabase.auth.signInWithPassword({
				email: email,
				password: password,
			});

			if (error) {
				console.error('Sign in error:', error.message);
				return;
			}

			// Emit signed-in event
			emitSignedInEvent();

			// Check if the session data is available
			if (data && data.session && data.session.user) {
				const userId = data.session.user.id;
				// Create Stripe customer
				await createStripeCustomer(userId);
			} else {
				console.error('User session data is missing');
			}

			// Log data for debugging purposes
			console.log(data);

		} catch (err) {
			console.error('Unexpected error:', err);
		}
	}


	async function createStripeCustomer(userId: string) {
		console.log('createStripeCustomer');
		await stripeClient.customers
			.create({
				email
			})
			.then(async (customer) => {
				// Create a new customer in the database customers table with id data.user.id and stripe_customer_id customer.id
				const { dataFromUpsert, error } = await supabase.from('customers').upsert([
					{
						id: userId,
						stripe_customer_id: customer.id
					}
				]);

				console.log(dataFromUpsert);

				if (error) {
					throw error;
				}
			});
	}

	async function forgotPassword() {
		if (email === '') {
			general.update((value) => {
				return {
					...value,
					hideToast: false,
					toastMessage: 'Please enter your email address',
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

		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: 'https://example.com/auth/update-password'
		});

		if (error) {
			console.error('Error sending password reset email:', error.message);
			general.update((value) => {
				return {
					...value,
					hideToast: false,
					toastMessage: 'Error sending password reset email. Please try again.',
					toastType: 'error'
				};
			});
		} else {
			console.log('Password reset email sent:', data);
			general.update((value) => {
				return {
					...value,
					hideToast: false,
					toastMessage: 'Password reset email sent. Please check your inbox.',
					toastType: 'success'
				};
			});
		}

		setTimeout(() => {
			general.update((value) => {
				return { ...value, hideToast: true, toastMessage: '', toastType: 'success' };
			});
		}, 5000);
	}
</script>

<div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
	<form class="card-body">
		<div class="form-control">
			<label class="input input-bordered flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4 opacity-70"
					><path
						d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
					/><path
						d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
					/>
				</svg>
				<input type="text" class="grow" placeholder="Email" required bind:value={email} />
			</label>
		</div>
		<div class="form-control">
			<label class="input input-bordered flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
					fill="currentColor"
					class="w-4 h-4 opacity-70"
					><path
						fill-rule="evenodd"
						d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
						clip-rule="evenodd"
					/>
				</svg>
				<input type="password" class="grow" placeholder="Password" required bind:value={password} />
			</label>
		</div>
		<div class="form-control">
			<button id="forgot-password" class="label-text-alt link link-hover" on:click={forgotPassword}>
				Forgot your password?
			</button>
		</div>
		<div class="form-control mt-2">
			<button class="btn btn-primary" on:click={signInWithEmail}>Sign In</button>
		</div>
	</form>
</div>

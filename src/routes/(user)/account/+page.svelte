<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, user, subscriptions, transactions, firstTransactionId, hasMoreThanOnePage } = data;
	$: ({ session, user, transactions, firstTransactionId, hasMoreThanOnePage } = data);

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
		} else {
			alert('Please sign in to delete your account.');
		}

		return async () => {
			loading = false;
		};
	};

	let startingAfter: string | undefined = undefined;
	let endingBefore: string | undefined = undefined;
	let hasNextPage = hasMoreThanOnePage;
	let hasPreviousPage = false;

	const handlePaginationSubmit: SubmitFunction = () => {
		loading = true;

		return async ({ result }) => {
			transactions = JSON.parse(result.data.transactions);
			hasNextPage = result.data.hasNextPage;
			hasPreviousPage = !result.data.isFirstPage;
			loading = false;
		};
	};
</script>

<div
	class="account-page max-w-4xl mx-auto p-6 bg-base-100 rounded-lg shadow-md space-y-6 overflow-y-auto"
>
	<!-- Flex container for two columns -->
	<div class="flex flex-col lg:flex-row gap-6">
		<!-- Left Column: Account Overview, Subscriptions, and Billing History -->
		<div class="flex-1 space-y-6">
			<!-- Account Overview -->
			<section class="space-y-4">
				<h2 class="text-xl font-semibold">Account Overview</h2>
				<div class="form-control">
					<label for="email" class="label font-medium">Email</label>
					<input
						id="email"
						type="email"
						class="input input-bordered"
						value={session.user.email}
						disabled
					/>
				</div>
				<div class="text-sm text-gray-500">Signed in with magic link.</div>
				<form
					class="form-widget space-y-4"
					method="post"
					action="?/update"
					use:enhance={handleSubmit}
					bind:this={profileForm}
				>
					<div class="form-control">
						<label for="name" class="label font-medium">Name</label>
						<input
							id="name"
							name="name"
							type="text"
							value={form?.name ?? name}
							class="input input-bordered w-full"
							placeholder="Enter your name"
						/>
					</div>

					<div>
						<input
							type="submit"
							class="btn btn-primary w-full"
							value={loading ? 'Loading...' : 'Update Name'}
							disabled={loading}
						/>
					</div>
				</form>
			</section>

			<!-- Active Subscriptions -->
			<section class="space-y-4">
				<h2 class="text-xl font-semibold">Subscriptions</h2>
				{#if subscriptions.length === 0}
					<p class="text-gray-600">You do not have any subscriptions.</p>
				{:else}
					<ul class="space-y-3">
						{#each subscriptions as subscription}
							<li class="p-4 border border-gray-200 rounded-md">
								<div class="flex items-center justify-between">
									<div>
										<p class="font-semibold">{subscription.productName}</p>
										<p class="text-sm text-gray-500">
											Price: {subscription.amount}
											{subscription.currency} / {subscription.interval}
										</p>
										<p class="text-sm text-gray-500">
											Expiry Date: {subscription.expiryDate}
										</p>
										<p class="text-sm text-gray-500">
											Status: {subscription.status}
										</p>
									</div>
									<!-- <button class="btn btn-secondary btn-sm">Manage</button> -->
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<section class="space-y-4">
				<h2 class="text-xl font-semibold">Credit Usage</h2>
				<p class="text-gray-600">Monitor your credit balance and view transaction history.</p>
				<a href="/credits" class="btn btn-secondary w-full">View details</a>
			</section>

			<!-- Billing History -->
			<section class="space-y-4">
				<h2 class="text-xl font-semibold">Billing History</h2>

				{#if transactions && transactions.length > 0}
					<ul class="space-y-3">
						{#each transactions as transaction}
							<li class="flex justify-between p-4 border border-gray-200 rounded-md">
								<div>
									<p class="text-sm text-gray-500">Date: {transaction.created}</p>
									<p class="text-sm text-gray-500">
										Amount: {transaction.amount}
										{transaction.currency}
									</p>
								</div>
								{#if transaction.receipt_url}
									<a href={transaction.receipt_url} class="btn btn-outline btn-sm" target="_blank">
										Download Receipt
									</a>
								{:else}
									<span class="text-gray-500">Receipt unavailable</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-gray-600">No transactions found.</p>
				{/if}

				<!-- Pagination Form -->
				<form method="post" action="?/paginate" use:enhance={handlePaginationSubmit}>
					<div
						class="flex justify-center items-center space-x-2 mt-4"
						role="navigation"
						aria-label="Transactions pagination"
					>
						<input type="hidden" name="startingAfter" value={startingAfter} />
						<input type="hidden" name="endingBefore" value={endingBefore} />
						<input type="hidden" name="firstTransactionId" value={firstTransactionId} />
						<input type="hidden" name="hasMoreThanOnePage" value={hasMoreThanOnePage} />

						<button
							type="submit"
							name="direction"
							value="previous"
							class="btn btn-outline"
							disabled={!hasPreviousPage || loading}
							aria-label="View previous page of transactions"
							on:click={() => {
								if (transactions.length) {
									endingBefore = transactions[0].id;
									startingAfter = undefined;
								}
							}}
						>
							Previous
						</button>

						<button
							type="submit"
							name="direction"
							value="next"
							class="btn btn-outline"
							disabled={!hasNextPage || loading}
							aria-label="View next page of transactions"
							on:click={() => {
								if (transactions.length) {
									startingAfter = transactions[transactions.length - 1].id;
									endingBefore = undefined;
								}
							}}
						>
							Next
						</button>
					</div>
				</form>
			</section>
		</div>

		<!-- Right Column: Notification Preferences and Feedback -->
		<div class="flex-none w-full lg:w-64 space-y-6">
			<!-- Notification Preferences -->
			<section class="space-y-4">
				<h2 class="text-xl font-semibold">Notification Preferences</h2>
				<form method="post" action="?/update_notifications" class="space-y-2">
					<label class="flex items-center space-x-3">
						<input type="checkbox" class="checkbox checkbox-primary" />
						<!-- checked={user.notifications.productUpdates} -->
						<span>Product Updates</span>
					</label>
					<label class="flex items-center space-x-3">
						<input type="checkbox" class="checkbox checkbox-primary" />
						<!-- checked={user.notifications.billingReminders} -->
						<span>Billing Reminders</span>
					</label>
					<label class="flex items-center space-x-3">
						<input type="checkbox" class="checkbox checkbox-primary" />
						<!-- checked={user.notifications.promotions} -->
						<span>Promotional Emails</span>
					</label>
				</form>
			</section>

			<!-- Feedback Section -->
			<section class="space-y-4">
				<h2 class="text-xl font-semibold">Feedback</h2>
				<p class="text-gray-600">
					We'd love to hear your thoughts! Please feel free to provide any feedback.
				</p>
				<a href="/contact" class="btn btn-outline w-full">Provide Feedback</a>
			</section>

			<form method="post" action="?/delete" use:enhance={handleAccountDeletion}>
				<div>
					<button class="btn btn-error w-full" disabled={loading}>Delete My Account</button>
				</div>
			</form>
		</div>
	</div>
</div>

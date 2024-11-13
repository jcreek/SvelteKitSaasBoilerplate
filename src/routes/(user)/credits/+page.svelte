<script lang="ts">
	import { onMount } from 'svelte';
	import Chart, { type ChartData } from 'chart.js/auto';

	export let data;
	const { creditsRemaining, transactions } = data;

	let chartCanvas: HTMLCanvasElement | null = null;
	let creditsTrendChart: Chart | null = null;
	let noTransactions = transactions ? transactions.length === 0 : true;
	let chartData: ChartData | null = null;

	if (!noTransactions) {
		chartData = {
			labels: transactions.map((t) => new Date(t.created_at).toLocaleDateString()),
			datasets: [
				{
					label: 'Credit Changes',
					data: transactions.map((t) => t.credits_change),
					backgroundColor: transactions.map((t) => (t.credits_change > 0 ? 'green' : 'red'))
				}
			]
		};
	}

	onMount(() => {
		if (chartCanvas && chartData) {
			creditsTrendChart = new Chart(chartCanvas, {
				type: 'bar',
				data: chartData,
				options: { responsive: true }
			});
		}
	});

	$: if (transactions && chartData) {
		chartData.labels = transactions.map((t) => new Date(t.created_at).toLocaleDateString());
		chartData.datasets[0].data = transactions.map((t) => t.credits_change);
		creditsTrendChart?.update();
	}
</script>

<main class="flex flex-col items-center p-4">
	<h1 class="text-3xl font-bold mb-4">Credit Dashboard</h1>
	<p class="text-lg">Credits Remaining: {creditsRemaining}</p>

	<div class="w-full md:w-3/4 mt-6">
		<canvas bind:this={chartCanvas} class="my-8"></canvas>
	</div>

	<h2 class="text-2xl font-semibold mb-2">Transaction History</h2>
	<div class="overflow-x-auto w-full md:w-3/4">
		{#if noTransactions}
			<p class="text-lg">No transactions found.</p>
		{:else}
			<table class="table-auto w-full text-left border-collapse">
				<thead>
					<tr class="border-b">
						<th class="px-4 py-2">Date</th>
						<th class="px-4 py-2">Description</th>
						<th class="px-4 py-2">Change</th>
					</tr>
				</thead>
				<tbody>
					{#each transactions as transaction}
						<tr class="border-b hover:bg-gray-100">
							<td class="px-4 py-2">{new Date(transaction.created_at).toLocaleDateString()}</td>
							<td class="px-4 py-2">{transaction.description}</td>
							<td
								class="px-4 py-2"
								class:text-green-600={transaction.credits_change > 0}
								class:text-red-600={transaction.credits_change < 0}
							>
								{transaction.credits_change > 0 ? '+' : ''}{transaction.credits_change}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</main>

<style>
	main {
		text-align: center;
	}
	table {
		margin-top: 1rem;
	}
</style>

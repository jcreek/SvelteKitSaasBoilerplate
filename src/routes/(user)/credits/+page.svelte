<script lang="ts">
	import { onMount } from 'svelte';
	import Chart, { type ChartData } from 'chart.js/auto';
	import { DataTable } from 'simple-datatables';

	export let data;
	const { creditsRemaining, transactions, monthlyAggregates } = data;

	let chartCanvas: HTMLCanvasElement | null = null;
	let creditsChart: Chart | null = null;
	let chartType: 'bar' | 'line' = 'bar';
	let chartData: ChartData | null = null;

	const monthlyLabels = Object.keys(monthlyAggregates).reverse();
	const creditsAdded = monthlyLabels.map((month) => monthlyAggregates[month].credits_added);
	const creditsDeducted = monthlyLabels.map((month) =>
		Math.abs(monthlyAggregates[month].credits_deducted)
	);

	const groupedTransactions = transactions.reduce((acc, transaction) => {
		const date = new Date(transaction.created_at);
		const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
		if (!acc[month]) acc[month] = [];
		acc[month].push(transaction);
		return acc;
	}, {});

	let cumulativeBalance = 0;
	const cumulativeBalanceData = monthlyLabels.map((month) => {
		const monthTransactions = groupedTransactions[month] || [];
		const monthCreditsChange = monthTransactions.reduce((sum, transaction) => {
			return sum + transaction.credits_change;
		}, 0);

		cumulativeBalance += monthCreditsChange;

		return cumulativeBalance;
	});
	function initialiseChartData() {
		if (chartType === 'bar') {
			chartData = {
				labels: monthlyLabels,
				datasets: [
					{
						label: 'Credits Added',
						data: creditsAdded,
						backgroundColor: 'green'
					},
					{
						label: 'Credits Deducted',
						data: creditsDeducted,
						backgroundColor: 'red'
					}
				]
			};
		} else if (chartType === 'line') {
			chartData = {
				labels: monthlyLabels,
				datasets: [
					{
						label: 'Cumulative Balance',
						data: cumulativeBalanceData,
						borderColor: 'blue',
						fill: false
					}
				]
			};
		}
	}

	function updateChart(type: 'bar' | 'line') {
		chartType = type;
		initialiseChartData();
		if (creditsChart) {
			creditsChart.config.type = chartType;
			creditsChart.data = chartData;
			creditsChart.update();
		}
	}

	onMount(() => {
		initialiseChartData();
		if (chartCanvas && chartData) {
			creditsChart = new Chart(chartCanvas, {
				type: chartType,
				data: chartData,
				options: { responsive: true }
			});
		}

		const dataTable = new DataTable('#transaction-history');
	});
</script>

<main class="flex flex-col items-center p-4">
	<h1 class="text-3xl font-bold mb-4">Credit Dashboard</h1>
	<p class="text-lg">Credits Remaining: {creditsRemaining}</p>

	<div class="flex justify-center my-4">
		<button on:click={() => updateChart('bar')} class:font-bold={chartType === 'bar'}
			>Monthly Usage</button
		>
		<button on:click={() => updateChart('line')} class:font-bold={chartType === 'line'}
			>Cumulative Balance</button
		>
	</div>

	<div class="w-full md:w-3/4 mt-6">
		<canvas bind:this={chartCanvas} class="my-8"></canvas>
	</div>

	<h2 class="text-2xl font-semibold mb-2">Transaction History</h2>
	<div class="overflow-x-auto w-full md:w-3/4">
		{#if transactions.length === 0}
			<p class="text-lg">No transactions found.</p>
		{:else}
			<table id="transaction-history" class="table-auto w-full text-left border-collapse">
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
	button {
		margin: 0 1rem;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		cursor: pointer;
	}
	button.font-bold {
		font-weight: bold;
		background-color: #f0f0f0;
	}
</style>

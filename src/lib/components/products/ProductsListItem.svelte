<script lang="ts">
	export let product;

	const defaultPrice = product.prices[0];
	const isSubscription = defaultPrice.type === 'recurring';
</script>

<a href="/products/{product.id}" class="max-w-[384px] mx-auto">
	<div class="w-full max-w-sm aspect-square relative">
		<img src={product.images[0]} alt={product.description} class="w-full h-full rounded-xl" />
		<!-- <span
			class="py-1 min-[400px]:py-2 px-2 min-[400px]:px-4 cursor-pointer rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 font-medium text-base leading-7 text-white absolute top-3 right-3 z-10"
			>20% Off</span
		> -->
	</div>
	<div class="mt-5 flex items-center justify-between">
		<div class="">
			<h6 class="font-medium text-xl leading-8 text-black mb-2">{product.name}</h6>
			<h6 class="font-semibold text-xl leading-8 text-indigo-600">£{product.actualPrice} {isSubscription ? `/ ${defaultPrice.interval}` : ''}</h6>
		</div>
		<button
			class="p-2 min-[400px]:p-4 rounded-full bg-white border border-gray-300 flex items-center justify-center group shadow-sm shadow-transparent transition-all duration-500 hover:shadow-gray-200 hover:border-gray-400 hover:bg-gray-50"
		>
			<svg
				class="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
				xmlns="http://www.w3.org/2000/svg"
				width="26"
				height="26"
				viewBox="0 0 26 26"
				fill="none"
			>
				<path
					d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25"
					stroke=""
					stroke-width="1.6"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>
</a>

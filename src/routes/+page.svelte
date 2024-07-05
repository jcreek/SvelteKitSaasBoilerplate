<script lang="ts">
	import SignUp from '$lib/components/SignUp.svelte';

	export let data;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);
</script>

<div class="hero bg-base-100 my-36">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left">
			<h1 class="text-5xl font-bold">Sign up for this amazing SaaS right now - don't miss out!</h1>
		</div>
		<div id="sign-up" class="card shrink-0 w-full max-w-sm shadow-2xl">
			<SignUp {supabase} />
		</div>
	</div>
</div>

<div
	class="md:container md:mx-auto justify-self-center flex justify-center items-center h-full flex-col mb-10"
>
	<div class="stats stats-vertical lg:stats-horizontal shadow text-center">
		<div class="stat">
			<div class="stat-title">Conversions</div>
			<div class="stat-value">310K</div>
			<div class="stat-desc">Since January 2024</div>
		</div>

		<div class="stat">
			<div class="stat-title">New Users</div>
			<div class="stat-value">4,200</div>
			<div class="stat-desc">↗︎ 400 (22%)</div>
		</div>

		<div class="stat">
			<div class="stat-title">Contracts Completed</div>
			<div class="stat-value">1,200</div>
			<div class="stat-desc">↘︎ 90 (14%)</div>
		</div>
	</div>

	<div class="features mt-8">
		<h1 class="flex justify-center text-4xl font-bold mb-5">Features</h1>

		<ul class="space-y-6">
			<li class="p-6 rounded-lg shadow-md">
				<div class="flex items-start space-x-4">
					<svg
						class="w-8 h-8 text-green-500 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					<div>
						<h2 class="text-lg font-semibold">Blah</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut ex blandit, hendrerit
							dolor in, egestas erat. In hac habitasse platea dictumst. Vestibulum consequat arcu
							ultrices, dignissim quam consectetur, mattis turpis. Quisque ligula est, consectetur a
							nunc eget, efficitur euismod sapien.
						</p>
					</div>
				</div>
			</li>
			<li class="p-6 rounded-lg shadow-md">
				<div class="flex items-start space-x-4">
					<svg
						class="w-8 h-8 text-green-500 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					<div>
						<h2 class="text-lg font-semibold">Blah</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut ex blandit, hendrerit
							dolor in, egestas erat. In hac habitasse platea dictumst. Vestibulum consequat arcu
							ultrices, dignissim quam consectetur, mattis turpis. Quisque ligula est, consectetur a
							nunc eget, efficitur euismod sapien.
						</p>
					</div>
				</div>
			</li>
			<li class="p-6 rounded-lg shadow-md">
				<div class="flex items-start space-x-4">
					<svg
						class="w-8 h-8 text-green-500 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					<div>
						<h2 class="text-lg font-semibold">Blah</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut ex blandit, hendrerit
							dolor in, egestas erat. In hac habitasse platea dictumst. Vestibulum consequat arcu
							ultrices, dignissim quam consectetur, mattis turpis. Quisque ligula est, consectetur a
							nunc eget, efficitur euismod sapien.
						</p>
					</div>
				</div>
			</li>
			<li class="p-6 rounded-lg shadow-md">
				<div class="flex items-start space-x-4">
					<svg
						class="w-8 h-8 text-green-500 flex-shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
					<div>
						<h2 class="text-lg font-semibold">Blah</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut ex blandit, hendrerit
							dolor in, egestas erat. In hac habitasse platea dictumst. Vestibulum consequat arcu
							ultrices, dignissim quam consectetur, mattis turpis. Quisque ligula est, consectetur a
							nunc eget, efficitur euismod sapien.
						</p>
					</div>
				</div>
			</li>
		</ul>
	</div>

	<section>
		<div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
			<div class="mx-auto max-w-lg text-center">
				<h2 class="text-3xl font-bold sm:text-4xl">Kickstart your marketing</h2>

				<p class="mt-4 text-gray-500">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur aliquam doloribus
					nesciunt eos fugiat. Vitae aperiam fugit consequuntur saepe laborum.
				</p>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				<a
					class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="size-10 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>

					<h2 class="mt-4 text-xl font-bold">Digital campaigns</h2>

					<p class="mt-1 text-sm text-gray-500">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
						distinctio alias voluptatum blanditiis laudantium.
					</p>
				</a>

				<a
					class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="size-10 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>

					<h2 class="mt-4 text-xl font-bold">Digital campaigns</h2>

					<p class="mt-1 text-sm text-gray-500">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
						distinctio alias voluptatum blanditiis laudantium.
					</p>
				</a>

				<a
					class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="size-10 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>

					<h2 class="mt-4 text-xl font-bold">Digital campaigns</h2>

					<p class="mt-1 text-sm text-gray-500">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
						distinctio alias voluptatum blanditiis laudantium.
					</p>
				</a>

				<a
					class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="size-10 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>

					<h2 class="mt-4 text-xl font-bold">Digital campaigns</h2>

					<p class="mt-1 text-sm text-gray-500">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
						distinctio alias voluptatum blanditiis laudantium.
					</p>
				</a>

				<a
					class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="size-10 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>

					<h2 class="mt-4 text-xl font-bold">Digital campaigns</h2>

					<p class="mt-1 text-sm text-gray-500">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
						distinctio alias voluptatum blanditiis laudantium.
					</p>
				</a>

				<a
					class="block rounded-xl border border-gray-800 p-8 shadow-xl transition hover:border-indigo-500/10 hover:shadow-indigo-500/10"
					href="#"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="size-10 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M12 14l9-5-9-5-9 5 9 5z" />
						<path
							d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
						/>
					</svg>

					<h2 class="mt-4 text-xl font-bold">Digital campaigns</h2>

					<p class="mt-1 text-sm text-gray-500">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex ut quo possimus adipisci
						distinctio alias voluptatum blanditiis laudantium.
					</p>
				</a>
			</div>

			<div class="mt-12 text-center">
				<a href="#sign-up" class="btn btn-primary">Get Started Today</a>
			</div>
		</div>
	</section>
</div>

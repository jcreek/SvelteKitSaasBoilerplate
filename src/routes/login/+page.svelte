<script lang="ts">
	import MagicLink from '$lib/components/MagicLink.svelte';

	export let data;
	let { supabase, session, url } = data;
	$: ({ supabase, session, url } = data);
</script>

<MagicLink {supabase} {url} />

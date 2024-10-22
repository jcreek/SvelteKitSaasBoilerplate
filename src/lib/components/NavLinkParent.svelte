<script lang="ts">
  import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import Dropdown from './Dropdown.svelte';

  export let text: string;
  export let children: NavLinkItem[] | undefined;
</script>

<Dropdown indicator>
  <div slot="dropdown">{text}</div>
  {#each children ?? [] as child}
    <li><a href={child.href}>{child.text}</a></li>
  {/each}
</Dropdown>
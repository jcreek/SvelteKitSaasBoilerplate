<script lang="ts">
  import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';
	import { onMount } from 'svelte';

  export let text: string;
  export let children: NavLinkItem[] | undefined;

  const DropdownIcon = {
    closed: '&#x25BC;',
    open: '&#x25B2;'
  };

  let isOpen = false;
  let dropdown: HTMLDivElement;

  onMount(() => {
    const handleClick = (event: MouseEvent) => {
      if (!dropdown.contains(event.target as Node) && isOpen) {
        isOpen = false;
      }
      if (event.target instanceof HTMLAnchorElement) {
        isOpen = false;
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
</script>

<div bind:this={dropdown}>
  <div class="dropdown-title">
    <button on:click={() => isOpen = !isOpen}>
      <span class="mr-1">{@html isOpen ? DropdownIcon.open : DropdownIcon.closed }</span>{text}
    </button>
  </div>
  <ul class:flex={isOpen} class:hidden={!isOpen} class="absolute rounded-box w-52 shadow z-[1] menu p-2 bg-base-100 text-base-content">
    {#each children ?? [] as child}
      <li><a href={child.href}>{child.text}</a></li>
    {/each}
  </ul>
</div>
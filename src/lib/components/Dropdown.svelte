<script lang="ts">
	import { onMount } from 'svelte';

  export let indicator: boolean = false;

  let isOpen = false;
  let dropdown: HTMLDivElement;
  
  const DropdownIcon = {
    closed: '&#x25BC;',
    open: '&#x25B2;'
  };

  onMount(() => {
    const handleClick = (event: MouseEvent) => {
      if (!isOpen) return;
      if (!dropdown.contains(event.target as Node) || event.target instanceof HTMLAnchorElement) {
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
    <button class="flex" on:click={() => isOpen = !isOpen}>
      {#if indicator}
        <span class="mr-1">{@html isOpen ? DropdownIcon.open : DropdownIcon.closed }</span>
      {/if}
      <slot name="dropdown"></slot>
    </button>
  </div>
  <ul class:flex={isOpen} class:hidden={!isOpen} class="absolute rounded-box w-52 shadow z-[1] menu p-2 bg-base-100 text-base-content">
    <slot />
  </ul>
</div>
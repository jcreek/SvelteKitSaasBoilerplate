<script lang="ts">
  import { type NavLinkItem } from '$lib/types/Nav/NavLinkItem';

  export let text: string;
  export let children: NavLinkItem[] | undefined;

</script>

<details>
  <summary class="flex items-center"><span class="mr-1">&#x25BC;</span>{text}</summary>
  <ul class="absolute rounded-box w-52 shadow z-[1] menu p-2 bg-base-100 text-base-content">
    {#each children ?? [] as child}
      <li><a href={child.href}>{child.text}</a></li>
    {/each}
  </ul>
</details>

<script lang="ts">
import { Auth } from '@supabase/auth-ui-svelte'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export let supabase: any;
export let url: string;

</script>

<div class="p-4">
  <Auth
      supabaseClient={supabase}
      view="magic_link"
      redirectTo={`${url}/auth/callback`}
      showLinks={false}
      appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
      additionalData={{}}
    />
</div>
import { redirect, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  const { url, locals: { supabase } } = event;
  const code = url.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // TODO: Create stripe customer and sync with supabase user

  throw redirect(303, '/account')
}

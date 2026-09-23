-- Not meant to be called directly via PostgREST RPC — only by the auth.users trigger.
revoke execute on function public.kingdom_handle_new_user() from public, anon, authenticated;

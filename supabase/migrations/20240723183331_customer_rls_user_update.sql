-- TESTS FOR RLS policy
create policy "Enable update for users based on id"
on "public"."customers"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));

create policy "Enable insert for users based on id"
on "public"."customers"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = id));

create policy "DEMO Enable insert for users based on id"
on "public"."customers"
as permissive
for insert
to public
with check (true);

create policy "DEMO Enable update for users based on id"
on "public"."customers"
as permissive
for update
to public
using (true)
with check (true);



GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
-- 1) Function: collect roles and add to event.claims.roles
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  roles_json jsonb;
  verified_bool boolean;
begin
  -- Initialize claims object (if missing)
  claims := coalesce(event -> 'claims', '{}'::jsonb);

  -- Aggregate distinct roles for the user into a jsonb array
  select coalesce(jsonb_agg(distinct role order by role), '[]'::jsonb)
  into roles_json
  from public.roles
  where user_id = (event ->> 'user_id')::uuid;

    -- Determine verified: true if any matching row has verified = true
  select coalesce(MAX(verified::int) = 1, false)
  into verified_bool
  from public.roles
  where user_id = (event ->> 'user_id')::uuid;

  -- Insert the roles array into the claims object under key "roles"
  claims := jsonb_set(claims, '{user_roles}', roles_json, true);
  -- Insert the verified status
  claims := jsonb_set(claims, '{user_verified}', to_jsonb(verified_bool), true);

  -- Write updated claims back into the event payload
  event := jsonb_set(event, '{claims}', claims, true);

  return event;
end;
$$;

-- 2) Security: grant/revoke execution rights for the hook function
-- Allow the Supabase auth system to execute it, but not anon/authenticated
grant usage on schema public to supabase_auth_admin;

grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;

revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon;

-- 3) Table permissions: allow supabase_auth_admin to read roles, block public/anon/authenticated
grant select on table public.roles to supabase_auth_admin;

-- revoke all on table public.roles from authenticated, anon, public;

-- 4) RLS policy: allow supabase_auth_admin to select from public.roles
-- (If you already have policies, adapt accordingly.)

-- create policy if not exists "allow_auth_admin_select_roles" on public.roles
--   as permissive
--   for select
--   to supabase_auth_admin
--   using (true);
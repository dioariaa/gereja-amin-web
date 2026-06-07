-- Repair admin profile role mapping for Gereja AMIN Jemaat Tangerang Raya.
-- Run this in Supabase SQL Editor after the three admin users exist in Authentication.
-- Safe to rerun: it only updates matching profile rows by auth.users.email.

with expected_roles(email, full_name, role_id) as (
  values
    ('admin@gerejaamin.org', 'Super Admin Gereja', 'super_admin'),
    ('sekretaris@gerejaamin.org', 'Sekretaris Jemaat', 'sekretaris'),
    ('bendahara@gerejaamin.org', 'Bendahara Gereja', 'bendahara')
)
insert into public.profiles (id, full_name, role_id, is_active)
select
  users.id,
  expected_roles.full_name,
  expected_roles.role_id,
  true
from auth.users
join expected_roles on lower(users.email) = expected_roles.email
on conflict (id) do update
set full_name = excluded.full_name,
    role_id = excluded.role_id,
    is_active = true,
    updated_at = now();

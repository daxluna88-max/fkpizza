alter table public.admins add column if not exists permissions jsonb not null default '{}'::jsonb;

comment on column public.admins.permissions is 'Granular dashboard permissions for admin/collaboratore roles: {restaurants,dishes,media,orders,account} booleans. Superadmin ignores this and always has full access.';

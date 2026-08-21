alter table public.dishes add column if not exists video_urls jsonb not null default '{}'::jsonb;

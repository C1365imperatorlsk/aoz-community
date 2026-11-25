create table public.aoz_board_listings (
 id uuid primary key default gen_random_uuid(),
 author_id bigint not null check(author_id>0),
 game_version text not null check(game_version in ('v3','v1','global')),
 world text not null check(char_length(world) between 1 and 24),
 city_level integer not null check(city_level between 1 and 99),
 power bigint check(power between 0 and 999999999999),
 price numeric(12,2) check(price between 0 and 9999999999.99),
 currency text not null check(currency in ('USD','EUR','RUB','CNY')),
 title text not null check(char_length(title) between 1 and 80),
 description text not null check(char_length(description)<=1500),
 image_count integer not null check(image_count between 0 and 5),
 status text not null default 'uploading' check(status in ('uploading','pending','published','rejected','closed','deleting')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 published_at timestamptz,
 expires_at timestamptz,
 check(status <> 'published' or (published_at is not null and expires_at is not null))
);
create index aoz_board_author_idx on public.aoz_board_listings(author_id,created_at desc);
create index aoz_board_status_expiry_idx on public.aoz_board_listings(status,expires_at);
alter table public.aoz_board_listings enable row level security;
revoke all on public.aoz_board_listings from public,anon,authenticated;
grant select,insert,update,delete on public.aoz_board_listings to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('aoz-board-private','aoz-board-private',false,256000,array['image/jpeg']);

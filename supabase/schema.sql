-- MyCub production schema for Supabase project nztjwlrmvidnsxhnopip
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default uuid_generate_v4(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'parent' check (role in ('owner','parent','caregiver','viewer')),
  created_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

create table if not exists public.children (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_id uuid references public.families(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  birth_date date not null check (birth_date <= current_date),
  gender text not null check (gender in ('boy','girl')),
  photo_url text,
  theme_color text not null default 'brand',
  created_at timestamptz not null default now()
);

create table if not exists public.growth_entries (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references public.children(id) on delete cascade,
  date date not null default current_date check (date <= current_date),
  weight_kg numeric(5,2) check (weight_kg > 0 and weight_kg < 300),
  height_cm numeric(5,1) check (height_cm > 20 and height_cm < 260),
  head_circumference_cm numeric(5,1) check (head_circumference_cm > 10 and head_circumference_cm < 100),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  check (weight_kg is not null or height_cm is not null or head_circumference_cm is not null)
);

create table if not exists public.milestones (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references public.children(id) on delete cascade,
  category text not null check (category in ('motor','language','cognitive','social','self_care')),
  title text not null,
  description text,
  achieved_at date,
  expected_age_months integer not null check (expected_age_months between 0 and 240),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references public.children(id) on delete cascade,
  url text,
  storage_path text,
  caption text,
  tags text[] not null default '{}',
  taken_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- Safe upgrades for databases created from the earlier MyCub prototype.
alter table public.children add column if not exists family_id uuid references public.families(id) on delete cascade;
alter table public.photos add column if not exists storage_path text;

create table if not exists public.ai_insights (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references public.children(id) on delete cascade,
  type text not null check (type in ('growth','milestone','recommendation')),
  title text not null,
  content text not null,
  products jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.children enable row level security;
alter table public.growth_entries enable row level security;
alter table public.milestones enable row level security;
alter table public.photos enable row level security;
alter table public.ai_insights enable row level security;

create or replace function public.is_family_member(target_family uuid)
returns boolean language sql stable security invoker set search_path = ''
as $$ select exists(select 1 from public.family_members fm where fm.family_id = target_family and fm.user_id = (select auth.uid())) $$;

create or replace function public.can_edit_family(target_family uuid)
returns boolean language sql stable security invoker set search_path = ''
as $$ select exists(select 1 from public.family_members fm where fm.family_id = target_family and fm.user_id = (select auth.uid()) and fm.role in ('owner','parent','caregiver')) $$;

create or replace function public.can_access_child(target_child uuid)
returns boolean language sql stable security invoker set search_path = ''
as $$ select exists(select 1 from public.children c where c.id = target_child and (c.user_id = (select auth.uid()) or public.is_family_member(c.family_id))) $$;

create or replace function public.can_edit_child(target_child uuid)
returns boolean language sql stable security invoker set search_path = ''
as $$ select exists(select 1 from public.children c where c.id = target_child and (c.user_id = (select auth.uid()) or public.can_edit_family(c.family_id))) $$;

drop policy if exists "profile read own" on public.profiles;
drop policy if exists "profile update own" on public.profiles;
drop policy if exists "family create" on public.families;
drop policy if exists "family read" on public.families;
drop policy if exists "family update owners" on public.families;
drop policy if exists "membership read" on public.family_members;
drop policy if exists "membership bootstrap" on public.family_members;
drop policy if exists "children read" on public.children;
drop policy if exists "children insert" on public.children;
drop policy if exists "children update" on public.children;
drop policy if exists "children delete" on public.children;
drop policy if exists "growth family access" on public.growth_entries;
drop policy if exists "milestones family access" on public.milestones;
drop policy if exists "photos family access" on public.photos;
drop policy if exists "insights family read" on public.ai_insights;

create policy "profile read own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "profile update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "family create" on public.families for insert to authenticated with check (created_by = (select auth.uid()));
create policy "family read" on public.families for select to authenticated using (created_by = (select auth.uid()) or public.is_family_member(id));
create policy "family update owners" on public.families for update to authenticated using (created_by = (select auth.uid())) with check (created_by = (select auth.uid()));
create policy "membership read" on public.family_members for select to authenticated using (user_id = (select auth.uid()));
create policy "membership bootstrap" on public.family_members for insert to authenticated with check (user_id = (select auth.uid()) and exists(select 1 from public.families f where f.id = family_id and f.created_by = (select auth.uid())));
create policy "children read" on public.children for select to authenticated using (user_id = (select auth.uid()) or public.is_family_member(family_id));
create policy "children insert" on public.children for insert to authenticated with check (user_id = (select auth.uid()) and (family_id is null or public.can_edit_family(family_id)));
create policy "children update" on public.children for update to authenticated using (user_id = (select auth.uid()) or public.can_edit_family(family_id)) with check (user_id = (select auth.uid()) or public.can_edit_family(family_id));
create policy "children delete" on public.children for delete to authenticated using (user_id = (select auth.uid()) or public.can_edit_family(family_id));

create policy "growth family access" on public.growth_entries for all to authenticated using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));
create policy "milestones family access" on public.milestones for all to authenticated using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));
create policy "photos family access" on public.photos for all to authenticated using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));
create policy "insights family read" on public.ai_insights for select to authenticated using (public.can_access_child(child_id));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$ begin
  insert into public.profiles(id,email,full_name,avatar_url)
  values(new.id,coalesce(new.email,''),coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',''),coalesce(new.raw_user_meta_data->>'avatar_url',new.raw_user_meta_data->>'picture'));
  return new;
end $$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into storage.buckets(id,name,public) values('child-photos','child-photos',false) on conflict (id) do update set public = false;
drop policy if exists "Users can upload photos" on storage.objects;
drop policy if exists "Anyone can view photos" on storage.objects;
drop policy if exists "Users can delete own photos" on storage.objects;
drop policy if exists "family photo read" on storage.objects;
drop policy if exists "family photo upload" on storage.objects;
drop policy if exists "family photo update" on storage.objects;
drop policy if exists "family photo delete" on storage.objects;
create policy "family photo read" on storage.objects for select to authenticated using (bucket_id='child-photos' and (public.can_access_child(((storage.foldername(name))[1])::uuid) or public.can_access_child(((storage.foldername(name))[2])::uuid)));
create policy "family photo upload" on storage.objects for insert to authenticated with check (bucket_id='child-photos' and (public.can_edit_child(((storage.foldername(name))[1])::uuid) or public.can_edit_child(((storage.foldername(name))[2])::uuid)));
create policy "family photo update" on storage.objects for update to authenticated using (bucket_id='child-photos' and (public.can_edit_child(((storage.foldername(name))[1])::uuid) or public.can_edit_child(((storage.foldername(name))[2])::uuid))) with check (bucket_id='child-photos' and (public.can_edit_child(((storage.foldername(name))[1])::uuid) or public.can_edit_child(((storage.foldername(name))[2])::uuid)));
create policy "family photo delete" on storage.objects for delete to authenticated using (bucket_id='child-photos' and (public.can_edit_child(((storage.foldername(name))[1])::uuid) or public.can_edit_child(((storage.foldername(name))[2])::uuid)));

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles, public.families, public.family_members, public.children, public.growth_entries, public.milestones, public.photos to authenticated;
grant select on public.ai_insights to authenticated;
grant execute on function public.is_family_member(uuid), public.can_edit_family(uuid), public.can_access_child(uuid), public.can_edit_child(uuid) to authenticated;
create index if not exists idx_family_members_user on public.family_members(user_id);
create index if not exists idx_children_family on public.children(family_id);
create index if not exists idx_children_user on public.children(user_id);
create index if not exists idx_growth_child_date on public.growth_entries(child_id,date);
create index if not exists idx_milestones_child on public.milestones(child_id);
create index if not exists idx_photos_child on public.photos(child_id);

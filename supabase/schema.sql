-- MyCub Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- CHILDREN
-- ============================================
create table public.children (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  birth_date date not null,
  gender text check (gender in ('boy', 'girl')) not null,
  photo_url text,
  theme_color text default 'brand',
  created_at timestamptz default now() not null
);

alter table public.children enable row level security;

create policy "Users can manage own children"
  on public.children for all
  using (auth.uid() = user_id);

-- ============================================
-- GROWTH ENTRIES
-- ============================================
create table public.growth_entries (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  date date not null default current_date,
  weight_kg numeric(5,2),
  height_cm numeric(5,1),
  head_circumference_cm numeric(5,1),
  notes text,
  created_at timestamptz default now() not null
);

alter table public.growth_entries enable row level security;

create policy "Users can manage growth entries for own children"
  on public.growth_entries for all
  using (
    child_id in (
      select id from public.children where user_id = auth.uid()
    )
  );

-- ============================================
-- PHOTOS
-- ============================================
create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  url text not null,
  caption text,
  tags text[] default '{}',
  taken_at date default current_date,
  created_at timestamptz default now() not null
);

alter table public.photos enable row level security;

create policy "Users can manage photos for own children"
  on public.photos for all
  using (
    child_id in (
      select id from public.children where user_id = auth.uid()
    )
  );

-- ============================================
-- MILESTONES
-- ============================================
create table public.milestones (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  category text check (category in ('motor', 'language', 'cognitive', 'social', 'self_care')) not null,
  title text not null,
  description text,
  achieved_at date,
  expected_age_months integer not null,
  notes text,
  created_at timestamptz default now() not null
);

alter table public.milestones enable row level security;

create policy "Users can manage milestones for own children"
  on public.milestones for all
  using (
    child_id in (
      select id from public.children where user_id = auth.uid()
    )
  );

-- ============================================
-- AI INSIGHTS
-- ============================================
create table public.ai_insights (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references public.children(id) on delete cascade not null,
  type text check (type in ('growth', 'milestone', 'recommendation')) not null,
  title text not null,
  content text not null,
  products jsonb default '[]',
  created_at timestamptz default now() not null
);

alter table public.ai_insights enable row level security;

create policy "Users can view AI insights for own children"
  on public.ai_insights for select
  using (
    child_id in (
      select id from public.children where user_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKETS
-- ============================================
insert into storage.buckets (id, name, public)
values ('child-photos', 'child-photos', true)
on conflict do nothing;

create policy "Users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'child-photos' and auth.role() = 'authenticated');

create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'child-photos');

create policy "Users can delete own photos"
  on storage.objects for delete
  using (bucket_id = 'child-photos' and auth.role() = 'authenticated');

-- ============================================
-- INDEXES
-- ============================================
create index idx_children_user_id on public.children(user_id);
create index idx_growth_entries_child_id on public.growth_entries(child_id);
create index idx_growth_entries_date on public.growth_entries(date);
create index idx_photos_child_id on public.photos(child_id);
create index idx_milestones_child_id on public.milestones(child_id);
create index idx_ai_insights_child_id on public.ai_insights(child_id);

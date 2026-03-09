-- Drop existing tables to ensure clean slate
drop table if exists public.saved_matchings;
drop table if exists public.saved_charts;
drop table if exists public.profiles;

-- Create profiles table (referenced by auth helpers)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  gender text,
  birth_date text,
  birth_time text,
  birth_place text,
  birth_latitude numeric,
  birth_longitude numeric,
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id);

grant all on public.profiles to authenticated;

-- Create saved_charts table
create table public.saved_charts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  person_name text not null,
  birth_data jsonb not null,
  chart_type text not null default 'kundali',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.saved_charts enable row level security;

create policy "Users can view their own charts"
on public.saved_charts for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own charts"
on public.saved_charts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own charts"
on public.saved_charts for delete
to authenticated
using (auth.uid() = user_id);

-- Create saved_matchings table
create table public.saved_matchings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  person_1_chart_id uuid references public.saved_charts(id) on delete set null,
  person_2_chart_id uuid references public.saved_charts(id) on delete set null,
  matching_data jsonb not null,
  guna_score numeric,
  created_at timestamptz default now() not null
);

alter table public.saved_matchings enable row level security;

create policy "Users can view their own matchings"
on public.saved_matchings for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own matchings"
on public.saved_matchings for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete their own matchings"
on public.saved_matchings for delete
to authenticated
using (auth.uid() = user_id);

grant all on public.saved_charts to authenticated;
grant all on public.saved_matchings to authenticated;

-- ============================================================================
-- Streamlive — Migration 002: Add profile fields for OAuth & app needs
-- Run in Supabase SQL Editor after 001_initial_schema.sql
-- ============================================================================

-- Add missing columns (idempotent: IF NOT EXISTS)
alter table public.profiles add column if not exists name       text;
alter table public.profiles add column if not exists category   text;
alter table public.profiles add column if not exists bio        text;
alter table public.profiles add column if not exists platforms  text[] default '{}';

-- Update the signup trigger to populate name and avatar_url from Google OAuth
create or replace function public.on_auth_user_created()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, name, avatar_url, account_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'account_type', 'business')
  );
  return new;
end;
$$ language plpgsql security definer;

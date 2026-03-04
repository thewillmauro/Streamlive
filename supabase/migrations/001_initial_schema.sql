-- ============================================================================
-- Streamlive — Initial Schema
-- Run in Supabase SQL Editor (or via supabase db push)
-- ============================================================================

-- ── Helper: auto-update updated_at ──────────────────────────────────────────

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── 1. profiles ─────────────────────────────────────────────────────────────

create table public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text not null,
  first_name    text,
  account_type  text default 'business' check (account_type in ('business', 'partner')),
  plan          text default 'starter' check (plan in ('starter', 'growth', 'pro', 'enterprise')),
  shop_name     text,
  slug          text unique,
  stripe_customer_id text,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ── 2. buyers ───────────────────────────────────────────────────────────────

create table public.buyers (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  name        text not null,
  email       text,
  phone       text,
  handle      text,
  platform    text,
  spend       numeric default 0,
  orders      int default 0,
  last_order  timestamptz,
  status      text default 'new' check (status in ('vip', 'active', 'risk', 'new', 'dormant')),
  loyalty_tier   text default 'bronze' check (loyalty_tier in ('bronze', 'silver', 'gold', 'vip')),
  loyalty_points int default 0,
  tags        text[] default '{}',
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index buyers_profile_id_idx on public.buyers (profile_id);
create index buyers_status_idx on public.buyers (status);

create trigger buyers_updated_at before update on public.buyers
  for each row execute function public.update_updated_at();

alter table public.buyers enable row level security;

create policy "Users can manage own buyers"
  on public.buyers for all using (auth.uid() = profile_id);

-- ── 3. products ─────────────────────────────────────────────────────────────

create table public.products (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  name        text not null,
  sku         text,
  price       numeric not null default 0,
  cost        numeric default 0,
  inventory   int default 0,
  category    text,
  show_ready  boolean default false,
  shopify_id  text,
  image_url   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index products_profile_id_idx on public.products (profile_id);

create trigger products_updated_at before update on public.products
  for each row execute function public.update_updated_at();

alter table public.products enable row level security;

create policy "Users can manage own products"
  on public.products for all using (auth.uid() = profile_id);

-- ── 4. shows ────────────────────────────────────────────────────────────────

create table public.shows (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles on delete cascade,
  title         text not null,
  date          timestamptz,
  duration_min  int,
  platforms     text[] default '{}',
  gmv           numeric default 0,
  buyers_count  int default 0,
  new_buyers    int default 0,
  repeat_rate   numeric default 0,
  status        text default 'planned' check (status in ('planned', 'live', 'completed', 'cancelled')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index shows_profile_id_idx on public.shows (profile_id);
create index shows_date_idx on public.shows (date desc);

create trigger shows_updated_at before update on public.shows
  for each row execute function public.update_updated_at();

alter table public.shows enable row level security;

create policy "Users can manage own shows"
  on public.shows for all using (auth.uid() = profile_id);

-- ── 5. show_products (join table) ───────────────────────────────────────────

create table public.show_products (
  id              uuid primary key default gen_random_uuid(),
  show_id         uuid not null references public.shows on delete cascade,
  product_id      uuid not null references public.products on delete cascade,
  position        int default 0,
  timing_seconds  int default 120,
  talking_points  text,
  created_at      timestamptz default now()
);

create index show_products_show_id_idx on public.show_products (show_id);

alter table public.show_products enable row level security;

create policy "Users can manage show products via show ownership"
  on public.show_products for all
  using (
    exists (
      select 1 from public.shows
      where shows.id = show_products.show_id
        and shows.profile_id = auth.uid()
    )
  );

-- ── 6. orders ───────────────────────────────────────────────────────────────

create table public.orders (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  buyer_id    uuid references public.buyers on delete set null,
  show_id     uuid references public.shows on delete set null,
  items       jsonb default '[]',
  total       numeric default 0,
  platform    text,
  status      text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index orders_profile_id_idx on public.orders (profile_id);
create index orders_buyer_id_idx on public.orders (buyer_id);
create index orders_show_id_idx on public.orders (show_id);

create trigger orders_updated_at before update on public.orders
  for each row execute function public.update_updated_at();

alter table public.orders enable row level security;

create policy "Users can manage own orders"
  on public.orders for all using (auth.uid() = profile_id);

-- ── 7. campaigns ────────────────────────────────────────────────────────────

create table public.campaigns (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles on delete cascade,
  name            text not null,
  type            text,
  channel         text,
  status          text default 'draft' check (status in ('draft', 'scheduled', 'sent', 'paused')),
  target_audience jsonb default '{}',
  recipients      int default 0,
  opens           int default 0,
  clicks          int default 0,
  conversions     int default 0,
  gmv             numeric default 0,
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index campaigns_profile_id_idx on public.campaigns (profile_id);

create trigger campaigns_updated_at before update on public.campaigns
  for each row execute function public.update_updated_at();

alter table public.campaigns enable row level security;

create policy "Users can manage own campaigns"
  on public.campaigns for all using (auth.uid() = profile_id);

-- ── 8. automations ──────────────────────────────────────────────────────────

create table public.automations (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  name        text not null,
  status      text default 'active' check (status in ('active', 'paused', 'draft')),
  platforms   text[] default '{}',
  keywords    jsonb default '[]',
  reply       text,
  goal        text,
  triggers    int default 0,
  conversions int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index automations_profile_id_idx on public.automations (profile_id);

create trigger automations_updated_at before update on public.automations
  for each row execute function public.update_updated_at();

alter table public.automations enable row level security;

create policy "Users can manage own automations"
  on public.automations for all using (auth.uid() = profile_id);

-- ── 9. loyalty_transactions ─────────────────────────────────────────────────

create table public.loyalty_transactions (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references public.profiles on delete cascade,
  buyer_id         uuid not null references public.buyers on delete cascade,
  points           int not null,
  reason           text,
  related_show_id  uuid references public.shows on delete set null,
  created_at       timestamptz default now()
);

create index loyalty_tx_profile_id_idx on public.loyalty_transactions (profile_id);
create index loyalty_tx_buyer_id_idx on public.loyalty_transactions (buyer_id);

alter table public.loyalty_transactions enable row level security;

create policy "Users can manage own loyalty transactions"
  on public.loyalty_transactions for all using (auth.uid() = profile_id);

-- ── 10. team_members ────────────────────────────────────────────────────────

create table public.team_members (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles on delete cascade,
  user_id         uuid references auth.users on delete set null,
  name            text not null,
  email           text not null,
  role            text default 'viewer' check (role in ('owner', 'manager', 'analyst', 'producer', 'support', 'viewer')),
  permissions     jsonb default '{}',
  assigned_sellers text[] default '{}',
  last_active     timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index team_members_profile_id_idx on public.team_members (profile_id);
create index team_members_user_id_idx on public.team_members (user_id);

create trigger team_members_updated_at before update on public.team_members
  for each row execute function public.update_updated_at();

alter table public.team_members enable row level security;

create policy "Owners can manage team members"
  on public.team_members for all using (auth.uid() = profile_id);
create policy "Team members can view own record"
  on public.team_members for select using (auth.uid() = user_id);

-- ── 11. connections ─────────────────────────────────────────────────────────

create table public.connections (
  id                    uuid primary key default gen_random_uuid(),
  profile_id            uuid not null references public.profiles on delete cascade,
  platform              text not null,
  access_token_encrypted text,
  refresh_token_encrypted text,
  handle                text,
  scope                 text,
  connected_at          timestamptz default now(),
  expires_at            timestamptz,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index connections_profile_id_idx on public.connections (profile_id);
create unique index connections_profile_platform_idx on public.connections (profile_id, platform);

create trigger connections_updated_at before update on public.connections
  for each row execute function public.update_updated_at();

alter table public.connections enable row level security;

create policy "Users can manage own connections"
  on public.connections for all using (auth.uid() = profile_id);

-- ── 12. opt_in_records ──────────────────────────────────────────────────────

create table public.opt_in_records (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  buyer_id    uuid references public.buyers on delete set null,
  email       text,
  phone       text,
  handles     jsonb default '{}',
  opt_ins     jsonb default '{}',
  source      text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index opt_in_records_profile_id_idx on public.opt_in_records (profile_id);

create trigger opt_in_records_updated_at before update on public.opt_in_records
  for each row execute function public.update_updated_at();

alter table public.opt_in_records enable row level security;

create policy "Users can manage own opt-in records"
  on public.opt_in_records for all using (auth.uid() = profile_id);

-- ── 13. devices ─────────────────────────────────────────────────────────────

create table public.devices (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles on delete cascade,
  name        text not null,
  category    text,
  settings    jsonb default '{}',
  connected   boolean default false,
  battery     int,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index devices_profile_id_idx on public.devices (profile_id);

create trigger devices_updated_at before update on public.devices
  for each row execute function public.update_updated_at();

alter table public.devices enable row level security;

create policy "Users can manage own devices"
  on public.devices for all using (auth.uid() = profile_id);

-- ── Trigger: auto-create profile on signup ──────────────────────────────────

create or replace function public.on_auth_user_created()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, account_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    coalesce(new.raw_user_meta_data->>'account_type', 'business')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.on_auth_user_created();

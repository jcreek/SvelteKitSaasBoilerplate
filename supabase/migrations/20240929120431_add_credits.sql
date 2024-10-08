create table user_credits (
  user_id uuid references auth.users not null primary key,
  credits_remaining integer not null default 0,
  last_updated timestamp with time zone not null default now()
);

alter table user_credits enable row level security;

create policy "Can view own credits." on user_credits
  for select using (auth.uid() = user_id);

-- Uncomment and modify the update policy if allowing users to modify their own credits
-- create policy "Can update own credits." on user_credits
--   for update using (auth.uid() = user_id);

create table credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  credits_change integer not null,
  description text,
  created_at timestamp with time zone not null default now()
);

alter table credit_transactions enable row level security;

create policy "Can view own transactions." on credit_transactions
  for select using (auth.uid() = user_id);

-- Adding indexing to improve query performance
create index on user_credits (user_id);
create index on credit_transactions (user_id);

-- Adding a check constraint to enforce data integrity
alter table credit_transactions
add constraint check_credits_change_nonzero check (credits_change <> 0);

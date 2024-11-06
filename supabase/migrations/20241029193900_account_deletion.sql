create table account_deletion_requests (
  user_id uuid references auth.users not null primary key,
  token text not null,
  requested_at timestamp with time zone default now() not null
);

alter table account_deletion_requests enable row level security;
create policy "Can view own deletion request data" on account_deletion_requests
  for select using (auth.uid() = user_id);
create policy "Can insert own deletion request data" on account_deletion_requests
  for insert with check (auth.uid() = user_id);

ALTER TABLE customers
DROP CONSTRAINT IF EXISTS customers_id_fkey;
ALTER TABLE customers
ADD CONSTRAINT customers_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE purchases
DROP CONSTRAINT IF EXISTS purchases_user_id_fkey;
ALTER TABLE purchases
ADD CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE user_credits
DROP CONSTRAINT IF EXISTS user_credits_user_id_fkey;
ALTER TABLE user_credits
ADD CONSTRAINT user_credits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE credit_transactions
DROP CONSTRAINT IF EXISTS credit_transactions_user_id_fkey;
ALTER TABLE credit_transactions
ADD CONSTRAINT credit_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE account_deletion_requests
DROP CONSTRAINT IF EXISTS account_deletion_requests_user_id_fkey;
ALTER TABLE account_deletion_requests
ADD CONSTRAINT account_deletion_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users
ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

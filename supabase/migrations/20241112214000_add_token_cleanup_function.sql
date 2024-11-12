-- Enable the "pg_cron" extension
create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- Create a function to delete expired tokens
CREATE OR REPLACE FUNCTION delete_expired_tokens()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM account_deletion_requests
  WHERE requested_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Schedule the function to run every hour
SELECT cron.schedule(
  'delete_expired_tokens',
  '0 * * * *',
  'CALL delete_expired_tokens()'
);
-- Enable the "pg_cron" extension
create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

-- Create a function to delete expired tokens
CREATE OR REPLACE FUNCTION delete_expired_tokens()
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE
  deletion_count integer;
  expiry_interval interval := '24 hours'::interval;
BEGIN
  DELETE FROM account_deletion_requests
  WHERE requested_at < NOW() - expiry_interval
  RETURNING COUNT(*) INTO deletion_count;
  RAISE NOTICE 'Deleted % expired token(s)', deletion_count;
  RETURN deletion_count;
END;
$$;

DO $$
BEGIN
  -- Schedule the function to run every hour
  PERFORM cron.schedule(
    'delete_expired_tokens',
    '0 * * * *',
    'SELECT delete_expired_tokens()'
  );
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Failed to schedule token cleanup: %', SQLERRM;
  RAISE;
END;
$$;
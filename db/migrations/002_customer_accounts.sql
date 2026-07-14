BEGIN;

ALTER TABLE payment_orders
  ADD COLUMN IF NOT EXISTS payer_name TEXT,
  ADD COLUMN IF NOT EXISTS payment_gateway TEXT NOT NULL DEFAULT 'mercado_pago';

ALTER TABLE payment_orders
  DROP CONSTRAINT IF EXISTS payment_orders_payment_gateway_check;

ALTER TABLE payment_orders
  ADD CONSTRAINT payment_orders_payment_gateway_check
  CHECK (payment_gateway IN ('mercado_pago'));

CREATE TABLE IF NOT EXISTS customer_accounts (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  email_normalized TEXT NOT NULL UNIQUE,
  name TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_sessions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS customer_sessions_account_idx ON customer_sessions(account_id);
CREATE INDEX IF NOT EXISTS customer_sessions_active_idx ON customer_sessions(token_hash, expires_at) WHERE revoked_at IS NULL;

COMMIT;

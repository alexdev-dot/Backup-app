-- ============================================================
--  GigaFix — PostgreSQL Schema
--  Run once against a fresh database:
--    psql -U postgres -d gigafix -f schema.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUM types ──────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'professional');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('active', 'completed', 'draft');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tx_status AS ENUM ('completed', 'pending', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(120)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  phone       VARCHAR(30)   NOT NULL,
  password    TEXT          NOT NULL,
  role        user_role     NOT NULL,
  location    VARCHAR(255),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);

-- ─── professionals ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS professionals (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  service_category  VARCHAR(100)  NOT NULL,
  hourly_rate       VARCHAR(50)   NOT NULL,
  rating            NUMERIC(3,2)  NOT NULL DEFAULT 0,
  reviews_count     INTEGER       NOT NULL DEFAULT 0,
  verified          BOOLEAN       NOT NULL DEFAULT FALSE,
  response_time     VARCHAR(50),
  location          VARCHAR(255),
  description       TEXT,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_professionals_user_id         ON professionals (user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_service_category ON professionals (service_category);

-- ─── services ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120)  NOT NULL UNIQUE,
  category    VARCHAR(100)  NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);

-- ─── bookings ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  professional_id  INTEGER         NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  service          VARCHAR(120)    NOT NULL,
  date             DATE            NOT NULL,
  time             TIME            NOT NULL,
  location         VARCHAR(255)    NOT NULL,
  amount           NUMERIC(12,2)   NOT NULL,
  status           booking_status  NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id     ON bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON bookings (professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status          ON bookings (status);

-- ─── jobs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title            VARCHAR(200)  NOT NULL,
  description      TEXT          NOT NULL,
  category         VARCHAR(100)  NOT NULL,
  budget           VARCHAR(50)   NOT NULL,
  location         VARCHAR(255)  NOT NULL,
  status           job_status    NOT NULL DEFAULT 'active',
  proposals_count  INTEGER       NOT NULL DEFAULT 0,
  views_count      INTEGER       NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON jobs (customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status      ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_category    ON jobs (category);

-- ─── conversations ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id                  SERIAL PRIMARY KEY,
  customer_id         INTEGER       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  professional_id     INTEGER       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  service             VARCHAR(120)  NOT NULL,
  unread_customer     INTEGER       NOT NULL DEFAULT 0,
  unread_professional INTEGER       NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, professional_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_customer_id     ON conversations (customer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_professional_id ON conversations (professional_id);

-- ─── messages ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id               SERIAL PRIMARY KEY,
  conversation_id  INTEGER  NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  sender_id        INTEGER  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  receiver_id      INTEGER  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  text             TEXT     NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id       ON messages (sender_id);

-- ─── payment_methods ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_methods (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type        VARCHAR(50)   NOT NULL,
  number      VARCHAR(30)   NOT NULL,
  is_default  BOOLEAN       NOT NULL DEFAULT FALSE,
  expiry      VARCHAR(10),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods (user_id);

-- ─── transactions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  description  TEXT          NOT NULL,
  amount       NUMERIC(12,2) NOT NULL,
  date         DATE          NOT NULL,
  status       tx_status     NOT NULL DEFAULT 'completed',
  method       VARCHAR(50)   NOT NULL,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions (user_id);


-- ─── reviews ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id               SERIAL PRIMARY KEY,
  customer_id      INTEGER   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  professional_id  INTEGER   NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  booking_id       INTEGER   REFERENCES bookings (id) ON DELETE SET NULL,
  rating           SMALLINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, booking_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews (professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id     ON reviews (customer_id);

-- ─── auto-update updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','professionals','bookings','jobs',
    'conversations'
  ] LOOP
    EXECUTE format(
      'CREATE OR REPLACE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t);
  END LOOP;
END $$;

-- ─── Row Level Security (RLS) ─────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- services table is public read-only, no RLS needed

-- ─── Helper function to get current user ID from context ───────
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_user_id', true), '')::INTEGER;
END;
$$ LANGUAGE plpgsql STABLE;

-- ─── RPC function to set current user ID for RLS ───────────────
CREATE OR REPLACE FUNCTION set_current_user_id(user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::TEXT, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RPC function to reset current user ID for RLS ─────────────
CREATE OR REPLACE FUNCTION reset_current_user_id()
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_user_id', '', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── RLS Policies for users ────────────────────────────────────
-- Users can view their own profile
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users
  FOR SELECT
  USING (id = get_current_user_id());

-- Users can update their own profile
DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users
  FOR UPDATE
  USING (id = get_current_user_id());

-- ─── RLS Policies for professionals ────────────────────────────
-- Public can view professional profiles
DROP POLICY IF EXISTS professionals_select_public ON professionals;
CREATE POLICY professionals_select_public ON professionals
  FOR SELECT
  USING (true);

-- Professionals can view their own profile
DROP POLICY IF EXISTS professionals_select_own ON professionals;
CREATE POLICY professionals_select_own ON professionals
  FOR SELECT
  USING (user_id = get_current_user_id());

-- Professionals can update their own profile
DROP POLICY IF EXISTS professionals_update_own ON professionals;
CREATE POLICY professionals_update_own ON professionals
  FOR UPDATE
  USING (user_id = get_current_user_id());

-- ─── RLS Policies for bookings ──────────────────────────────────
-- Customers can view their own bookings
DROP POLICY IF EXISTS bookings_select_customer ON bookings;
CREATE POLICY bookings_select_customer ON bookings
  FOR SELECT
  USING (customer_id = get_current_user_id());

-- Professionals can view bookings where they are the professional
DROP POLICY IF EXISTS bookings_select_professional ON bookings;
CREATE POLICY bookings_select_professional ON bookings
  FOR SELECT
  USING (professional_id = get_current_user_id());

-- Customers can create bookings for themselves
DROP POLICY IF EXISTS bookings_insert_customer ON bookings;
CREATE POLICY bookings_insert_customer ON bookings
  FOR INSERT
  WITH CHECK (customer_id = get_current_user_id());

-- Customers can update their own bookings
DROP POLICY IF EXISTS bookings_update_customer ON bookings;
CREATE POLICY bookings_update_customer ON bookings
  FOR UPDATE
  USING (customer_id = get_current_user_id());

-- Professionals can update their own bookings
DROP POLICY IF EXISTS bookings_update_professional ON bookings;
CREATE POLICY bookings_update_professional ON bookings
  FOR UPDATE
  USING (professional_id = get_current_user_id());

-- ─── RLS Policies for jobs ─────────────────────────────────────
-- Public can view active jobs
DROP POLICY IF EXISTS jobs_select_public ON jobs;
CREATE POLICY jobs_select_public ON jobs
  FOR SELECT
  USING (true);

-- Customers can view their own jobs
DROP POLICY IF EXISTS jobs_select_own ON jobs;
CREATE POLICY jobs_select_own ON jobs
  FOR SELECT
  USING (customer_id = get_current_user_id());

-- Customers can create jobs for themselves
DROP POLICY IF EXISTS jobs_insert_own ON jobs;
CREATE POLICY jobs_insert_own ON jobs
  FOR INSERT
  WITH CHECK (customer_id = get_current_user_id());

-- Customers can update their own jobs
DROP POLICY IF EXISTS jobs_update_own ON jobs;
CREATE POLICY jobs_update_own ON jobs
  FOR UPDATE
  USING (customer_id = get_current_user_id());

-- ─── RLS Policies for conversations ────────────────────────────
-- Users can view conversations they are part of
DROP POLICY IF EXISTS conversations_select_participant ON conversations;
CREATE POLICY conversations_select_participant ON conversations
  FOR SELECT
  USING (customer_id = get_current_user_id() OR professional_id = get_current_user_id());

-- Users can create conversations where they are the customer
DROP POLICY IF EXISTS conversations_insert_customer ON conversations;
CREATE POLICY conversations_insert_customer ON conversations
  FOR INSERT
  WITH CHECK (customer_id = get_current_user_id());

-- Users can update conversations they are part of
DROP POLICY IF EXISTS conversations_update_participant ON conversations;
CREATE POLICY conversations_update_participant ON conversations
  FOR UPDATE
  USING (customer_id = get_current_user_id() OR professional_id = get_current_user_id());

-- ─── RLS Policies for messages ─────────────────────────────────
-- Users can view messages in conversations they are part of
DROP POLICY IF EXISTS messages_select_participant ON messages;
CREATE POLICY messages_select_participant ON messages
  FOR SELECT
  USING (
    sender_id = get_current_user_id() OR
    receiver_id = get_current_user_id() OR
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (c.customer_id = get_current_user_id() OR c.professional_id = get_current_user_id())
    )
  );

-- Users can send messages
DROP POLICY IF EXISTS messages_insert_own ON messages;
CREATE POLICY messages_insert_own ON messages
  FOR INSERT
  WITH CHECK (sender_id = get_current_user_id());

-- ─── RLS Policies for payment_methods ─────────────────────────
-- Users can view their own payment methods
DROP POLICY IF EXISTS payment_methods_select_own ON payment_methods;
CREATE POLICY payment_methods_select_own ON payment_methods
  FOR SELECT
  USING (user_id = get_current_user_id());

-- Users can create payment methods for themselves
DROP POLICY IF EXISTS payment_methods_insert_own ON payment_methods;
CREATE POLICY payment_methods_insert_own ON payment_methods
  FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- Users can update their own payment methods
DROP POLICY IF EXISTS payment_methods_update_own ON payment_methods;
CREATE POLICY payment_methods_update_own ON payment_methods
  FOR UPDATE
  USING (user_id = get_current_user_id());

-- Users can delete their own payment methods
DROP POLICY IF EXISTS payment_methods_delete_own ON payment_methods;
CREATE POLICY payment_methods_delete_own ON payment_methods
  FOR DELETE
  USING (user_id = get_current_user_id());

-- ─── RLS Policies for transactions ─────────────────────────────
-- Users can view their own transactions
DROP POLICY IF EXISTS transactions_select_own ON transactions;
CREATE POLICY transactions_select_own ON transactions
  FOR SELECT
  USING (user_id = get_current_user_id());

-- Users can create transactions for themselves
DROP POLICY IF EXISTS transactions_insert_own ON transactions;
CREATE POLICY transactions_insert_own ON transactions
  FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- ─── RLS Policies for reviews ──────────────────────────────────
-- Users can view reviews for professionals (public read)
DROP POLICY IF EXISTS reviews_select_public ON reviews;
CREATE POLICY reviews_select_public ON reviews
  FOR SELECT
  USING (true);

-- Customers can create reviews for bookings they made
DROP POLICY IF EXISTS reviews_insert_own ON reviews;
CREATE POLICY reviews_insert_own ON reviews
  FOR INSERT
  WITH CHECK (customer_id = get_current_user_id());

-- Customers can update their own reviews
DROP POLICY IF EXISTS reviews_update_own ON reviews;
CREATE POLICY reviews_update_own ON reviews
  FOR UPDATE
  USING (customer_id = get_current_user_id());

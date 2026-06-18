import 'dotenv/config';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase exposes a SQL-over-REST endpoint at /rest/v1/rpc/
// We can bootstrap by calling the PostgREST schema cache reload,
// but first we need tables. Use the pg-over-HTTP approach via the 
// Supabase "postgres" REST extension if available, or use fetch to 
// call the Supabase SQL API (available via the service role key on /sql)

// Try the undocumented but working SQL endpoint
const sqlStatements = [
`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`,
`DO $$ BEGIN CREATE TYPE user_role AS ENUM ('customer','professional'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
`DO $$ BEGIN CREATE TYPE booking_status AS ENUM ('pending','scheduled','completed','cancelled'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
`DO $$ BEGIN CREATE TYPE job_status AS ENUM ('active','completed','draft'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
`DO $$ BEGIN CREATE TYPE tx_status AS ENUM ('completed','pending','failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
`DO $$ BEGIN CREATE TYPE invoice_status AS ENUM ('paid','pending','overdue'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, full_name VARCHAR(120) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(30) NOT NULL, password TEXT NOT NULL, role user_role NOT NULL, location VARCHAR(255), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`,
`CREATE TABLE IF NOT EXISTS professionals (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, service_category VARCHAR(100) NOT NULL, hourly_rate VARCHAR(50) NOT NULL, rating NUMERIC(3,2) NOT NULL DEFAULT 0, reviews_count INTEGER NOT NULL DEFAULT 0, verified BOOLEAN NOT NULL DEFAULT FALSE, response_time VARCHAR(50), location VARCHAR(255), description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(user_id))`,
`CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id)`,
`CREATE INDEX IF NOT EXISTS idx_professionals_service_category ON professionals(service_category)`,
`CREATE TABLE IF NOT EXISTS services (id SERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL UNIQUE, category VARCHAR(100) NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_services_category ON services(category)`,
`CREATE TABLE IF NOT EXISTS bookings (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, professional_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, service VARCHAR(120) NOT NULL, date DATE NOT NULL, time TIME NOT NULL, location VARCHAR(255) NOT NULL, amount NUMERIC(12,2) NOT NULL, status booking_status NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id)`,
`CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON bookings(professional_id)`,
`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`,
`CREATE TABLE IF NOT EXISTS jobs (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(200) NOT NULL, description TEXT NOT NULL, category VARCHAR(100) NOT NULL, budget VARCHAR(50) NOT NULL, location VARCHAR(255) NOT NULL, status job_status NOT NULL DEFAULT 'active', proposals_count INTEGER NOT NULL DEFAULT 0, views_count INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON jobs(customer_id)`,
`CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)`,
`CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category)`,
`CREATE TABLE IF NOT EXISTS conversations (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, professional_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, service VARCHAR(120) NOT NULL, unread_customer INTEGER NOT NULL DEFAULT 0, unread_professional INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(customer_id, professional_id))`,
`CREATE INDEX IF NOT EXISTS idx_conversations_customer_id ON conversations(customer_id)`,
`CREATE INDEX IF NOT EXISTS idx_conversations_professional_id ON conversations(professional_id)`,
`CREATE TABLE IF NOT EXISTS messages (id SERIAL PRIMARY KEY, conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE, sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, text TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)`,
`CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)`,
`CREATE TABLE IF NOT EXISTS payment_methods (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, type VARCHAR(50) NOT NULL, number VARCHAR(30) NOT NULL, is_default BOOLEAN NOT NULL DEFAULT FALSE, expiry VARCHAR(10), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id)`,
`CREATE TABLE IF NOT EXISTS transactions (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, description TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL, date DATE NOT NULL, status tx_status NOT NULL DEFAULT 'completed', method VARCHAR(50) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`,
`CREATE TABLE IF NOT EXISTS invoices (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, number VARCHAR(50) NOT NULL UNIQUE, description TEXT NOT NULL, amount NUMERIC(12,2) NOT NULL, date DATE NOT NULL, due_date DATE NOT NULL, status invoice_status NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
`CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id)`,
`CREATE TABLE IF NOT EXISTS reviews (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, professional_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL, rating SMALLINT NOT NULL CHECK(rating BETWEEN 1 AND 5), comment TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(customer_id, booking_id))`,
`CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON reviews(professional_id)`,
`CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id)`,
`CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $f$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $f$`,
`DO $d$ DECLARE t TEXT; BEGIN FOREACH t IN ARRAY ARRAY['users','professionals','bookings','jobs','conversations','invoices'] LOOP EXECUTE format('CREATE OR REPLACE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t, t); END LOOP; END $d$`,
];

// Supabase has a SQL endpoint accessible via service role key
// Try POST to /rest/v1/ with raw SQL using the pg-meta-style endpoint
async function runSQL(sql) {
  // PostgREST doesn't accept raw SQL, but Supabase's internal pg-meta does on /pg
  // The correct way for cloud Supabase: use the SQL via the dashboard API
  // which requires a personal access token. 
  // Alternative: use the "execute_sql" RPC if we can create it first.
  
  // Actually Supabase REST API v1 has a /query endpoint on the management API.
  // The service_role JWT *can* be used if the project is configured to allow it.
  // Let's try their internal endpoint:
  const r = await fetch(`${url}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });
  return { status: r.status, body: await r.text() };
}

// First test what endpoints are available
const test = await fetch(`${url}/rest/v1/`, {
  headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
});
console.log('REST root status:', test.status);
const rootBody = await test.text();
console.log('Root:', rootBody.slice(0, 200));

// Try the pg endpoint  
const pgTest = await fetch(`${url}/pg/query`, {
  method: 'POST',
  headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/sql' },
  body: 'SELECT 1',
});
console.log('PG endpoint status:', pgTest.status, await pgTest.text().then(t => t.slice(0,200)));

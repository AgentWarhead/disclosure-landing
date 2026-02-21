-- DISCLOSURE — Supabase Schema
-- Run this in: https://supabase.com/dashboard/project/bexjbozbrhijtjombxkm/sql/new

CREATE TABLE IF NOT EXISTS waitlist (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email           text        UNIQUE NOT NULL,
  archetype       text,
  serial_number   text,
  readiness_score integer,
  readiness_label text,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to join the waitlist
CREATE POLICY "public_insert" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Only service role can read the list
CREATE POLICY "no_public_read" ON waitlist
  FOR SELECT USING (false);

-- Count for the live counter (public function)
CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS integer
LANGUAGE sql SECURITY DEFINER
AS $$ SELECT COUNT(*)::integer FROM waitlist; $$;

-- MIGRATION (run if table already exists without these columns):
-- ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS archetype text;
-- ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS serial_number text;

-- ═══════════════════════════════════════════════════════════════════════════
-- URRUTIA WASH — Row Level Security Policies
-- Migration: 00002_rls_policies.sql
-- ═══════════════════════════════════════════════════════════════════════════
-- Note: All mutations that bypass RLS (status updates, membership writes,
-- referral credit) are performed using the SUPABASE_SERVICE_ROLE_KEY on
-- the server. The anon/user key is never used in API routes.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── users ─────────────────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own row only
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Users can update their own row (name, email, etc. — not membership_tier)
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Only service role can insert new user rows (done server-side via upsert)
-- Service role bypasses RLS automatically — no policy needed for INSERT/DELETE

-- ─── vehicles ──────────────────────────────────────────────────────────────
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicles_select_own"
  ON vehicles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "vehicles_insert_own"
  ON vehicles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "vehicles_update_own"
  ON vehicles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "vehicles_delete_own"
  ON vehicles FOR DELETE
  USING (user_id = auth.uid());

-- ─── washes ────────────────────────────────────────────────────────────────
ALTER TABLE washes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "washes_select_own"
  ON washes FOR SELECT
  USING (user_id = auth.uid());

-- Customers can book their own washes; service_type and amount set server-side
CREATE POLICY "washes_insert_own"
  ON washes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Status updates are ONLY performed by service role (operator console)
-- No UPDATE policy for users — service role bypasses RLS
-- No DELETE policy for anyone — washes are immutable records

-- ─── memberships ───────────────────────────────────────────────────────────
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "memberships_select_own"
  ON memberships FOR SELECT
  USING (user_id = auth.uid());

-- INSERT and UPDATE are service-role-only (driven by Stripe webhooks)
-- Service role bypasses RLS — no explicit policies needed

-- ─── referrals ─────────────────────────────────────────────────────────────
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Users can see referrals they sent or received
CREATE POLICY "referrals_select_participant"
  ON referrals FOR SELECT
  USING (referrer_id = auth.uid() OR referee_id = auth.uid());

-- INSERT and UPDATE are service-role-only (referral route uses service client)
-- Service role bypasses RLS — no explicit policies needed

-- ─── sms_log ───────────────────────────────────────────────────────────────
ALTER TABLE sms_log ENABLE ROW LEVEL SECURITY;

-- sms_log is an audit trail — no access for authenticated users via client
-- All reads/writes go through the service role exclusively
-- Service role bypasses RLS — no policies needed

-- ═══════════════════════════════════════════════════════════════════════════
-- DOWN / Rollback
-- ═══════════════════════════════════════════════════════════════════════════
-- DROP POLICY IF EXISTS "users_select_own" ON users;
-- DROP POLICY IF EXISTS "users_update_own" ON users;
-- DROP POLICY IF EXISTS "vehicles_select_own" ON vehicles;
-- DROP POLICY IF EXISTS "vehicles_insert_own" ON vehicles;
-- DROP POLICY IF EXISTS "vehicles_update_own" ON vehicles;
-- DROP POLICY IF EXISTS "vehicles_delete_own" ON vehicles;
-- DROP POLICY IF EXISTS "washes_select_own" ON washes;
-- DROP POLICY IF EXISTS "washes_insert_own" ON washes;
-- DROP POLICY IF EXISTS "memberships_select_own" ON memberships;
-- DROP POLICY IF EXISTS "referrals_select_participant" ON referrals;
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE vehicles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE washes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE sms_log DISABLE ROW LEVEL SECURITY;

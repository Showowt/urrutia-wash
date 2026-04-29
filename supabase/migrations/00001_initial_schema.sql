-- ═══════════════════════════════════════════════════════════════════════════
-- URRUTIA WASH — Initial Schema
-- Migration: 00001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── updated_at trigger function ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── users ─────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone                  TEXT        UNIQUE NOT NULL,
  name                   TEXT,
  email                  TEXT,
  membership_tier        TEXT        CHECK (membership_tier IN ('SOLO', 'DUO', 'FLEET')),
  membership_started_at  TIMESTAMPTZ,
  membership_renews_at   TIMESTAMPTZ,
  punch_count            INT         NOT NULL DEFAULT 0,
  referral_code          TEXT        UNIQUE,
  referred_by            UUID        REFERENCES users(id) ON DELETE SET NULL,
  referral_credit_cents  INT         NOT NULL DEFAULT 0,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── vehicles ──────────────────────────────────────────────────────────────
CREATE TABLE vehicles (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year        INT,
  make        TEXT,
  model       TEXT,
  color       TEXT,
  plate       TEXT        NOT NULL,
  is_primary  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_plate   ON vehicles(plate);
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);

CREATE TRIGGER trg_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── washes ────────────────────────────────────────────────────────────────
CREATE TABLE washes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  vehicle_id        UUID        REFERENCES vehicles(id) ON DELETE SET NULL,
  service_type      TEXT        NOT NULL CHECK (service_type IN ('express', 'classic', 'detail', 'ceramic')),
  location          TEXT        NOT NULL CHECK (location IN ('lvac', 'mobile')),
  mobile_address    TEXT,
  scheduled_for     TIMESTAMPTZ,
  status            TEXT        NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued', 'started', 'washing', 'detailing', 'finishing', 'ready', 'complete')),
  status_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  amount_cents      INT,
  tip_cents         INT         NOT NULL DEFAULT 0,
  before_photo_url  TEXT,
  after_photo_url   TEXT,
  detailer_id       UUID,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_washes_user_id        ON washes(user_id);
CREATE INDEX idx_washes_status         ON washes(status);
CREATE INDEX idx_washes_user_status    ON washes(user_id, status);
CREATE INDEX idx_washes_scheduled_for  ON washes(scheduled_for);

CREATE TRIGGER trg_washes_updated_at
  BEFORE UPDATE ON washes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── memberships ───────────────────────────────────────────────────────────
CREATE TABLE memberships (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT        UNIQUE,
  tier                    TEXT        NOT NULL CHECK (tier IN ('SOLO', 'DUO', 'FLEET')),
  status                  TEXT        NOT NULL CHECK (status IN ('active', 'paused', 'cancelled')),
  current_period_end      TIMESTAMPTZ,
  washes_used_this_cycle  INT         NOT NULL DEFAULT 0,
  washes_allowed_this_cycle INT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_status  ON memberships(status);
CREATE INDEX idx_memberships_user_status ON memberships(user_id, status);

CREATE TRIGGER trg_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── referrals ─────────────────────────────────────────────────────────────
CREATE TABLE referrals (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status              TEXT        NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'completed', 'expired')),
  credit_amount_cents INT         NOT NULL DEFAULT 2500,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referee_id  ON referrals(referee_id);

-- referrals has no updated_at per spec (immutable audit rows)

-- ─── sms_log ───────────────────────────────────────────────────────────────
CREATE TABLE sms_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
  wash_id     UUID        REFERENCES washes(id) ON DELETE SET NULL,
  template    TEXT,
  body        TEXT,
  twilio_sid  TEXT,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sms_log_user_id ON sms_log(user_id);
CREATE INDEX idx_sms_log_wash_id ON sms_log(wash_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- DOWN / Rollback
-- ═══════════════════════════════════════════════════════════════════════════
-- DROP TABLE IF EXISTS sms_log;
-- DROP TABLE IF EXISTS referrals;
-- DROP TABLE IF EXISTS memberships;
-- DROP TABLE IF EXISTS washes;
-- DROP TABLE IF EXISTS vehicles;
-- DROP TABLE IF EXISTS users;
-- DROP FUNCTION IF EXISTS set_updated_at;

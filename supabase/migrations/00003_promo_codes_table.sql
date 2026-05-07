-- ═══════════════════════════════════════════════════════════════════════════
-- URRUTIA WASH — Promo Codes Table
-- Migration: 00003_promo_codes_table.sql
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE promo_codes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone            TEXT        NOT NULL,
  code             TEXT        UNIQUE NOT NULL,
  discount_percent INT         NOT NULL DEFAULT 10,
  free_addon       TEXT        DEFAULT 'spray_wax',
  used             BOOLEAN     NOT NULL DEFAULT FALSE,
  used_at          TIMESTAMPTZ,
  order_reference  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_phone ON promo_codes(phone);
CREATE INDEX idx_promo_codes_code  ON promo_codes(code);

CREATE TRIGGER trg_promo_codes_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can manage promo codes
CREATE POLICY "Service role full access on promo_codes"
  ON promo_codes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ═══════════════════════════════════════════════════════════════════════════
-- DOWN / Rollback
-- ═══════════════════════════════════════════════════════════════════════════
-- DROP TABLE IF EXISTS promo_codes;

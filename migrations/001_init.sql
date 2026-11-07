-- 001_init: tenant root + first master (item_category) with Row-Level Security.
-- Run as the admin/owner role. The app connects as minv_app (no BYPASSRLS).

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'minv_app') THEN
    CREATE ROLE minv_app LOGIN PASSWORD 'minv_app_pw';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tenant (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS item_category (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenant(id),
  code        text NOT NULL,
  name        text NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code)
);

ALTER TABLE item_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_category FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON item_category;
CREATE POLICY tenant_isolation ON item_category
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON item_category TO minv_app;
GRANT SELECT ON tenant TO minv_app;

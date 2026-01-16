-- ============================================================================
-- RADAROID - INITIAL SCHEMA V3.5
-- ============================================================================
-- Execute this file in Supabase SQL Editor
-- https://vfdubeefeivejipennnw.supabase.co
-- ============================================================================

-- ============================================================================
-- STEP 1: EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- STEP 2: CORE TABLES
-- ============================================================================

-- BRANDS (Fabricants)
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  country TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- GLOSSARY TERMS
CREATE TABLE glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE glossary_terms_i18n (
  term_id UUID REFERENCES glossary_terms(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  term TEXT NOT NULL,
  definition_short TEXT,
  definition_long TEXT,
  PRIMARY KEY (term_id, locale)
);

-- ============================================================================
-- STEP 3: ROBOTS TABLES
-- ============================================================================

CREATE TABLE robots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id),
  specs JSONB DEFAULT '{}',
  youtube_review_url TEXT,
  official_video_url TEXT,
  status TEXT DEFAULT 'prototype',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE robots_i18n (
  robot_id UUID REFERENCES robots(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  PRIMARY KEY (robot_id, locale)
);

CREATE TABLE robot_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id UUID REFERENCES robots(id),
  type TEXT CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  alt TEXT,
  blur_data_url TEXT,
  is_hero BOOLEAN DEFAULT false
);

-- ============================================================================
-- STEP 4: JOBS TABLES
-- ============================================================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  scoring_criteria JSONB NOT NULL,
  video_protocol_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE jobs_i18n (
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  technical_title TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (job_id, locale)
);

-- SCORES CACHE
CREATE TABLE robot_job_scores (
  robot_id UUID REFERENCES robots(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  score_tech INT,
  score_breakdown JSONB,
  last_calculated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (robot_id, job_id)
);

-- ============================================================================
-- STEP 5: DEPLOYMENTS & GROWTH TABLES
-- ============================================================================

CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id UUID REFERENCES robots(id),
  job_id UUID REFERENCES jobs(id),
  company_name TEXT,
  status TEXT,
  robot_count INT,
  source_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE intent_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id UUID REFERENCES robots(id),
  user_email TEXT NOT NULL,
  user_industry TEXT,
  fleet_size_interest TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  threshold_score INT DEFAULT 70,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE page_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id UUID REFERENCES robots(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  proof_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE error_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  reported_by_email TEXT,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- STEP 6: INDEXES
-- ============================================================================

-- Filtres frequents
CREATE INDEX idx_robots_status ON robots(status);
CREATE INDEX idx_robots_brand ON robots(brand_id);
CREATE INDEX idx_robots_deleted ON robots(deleted_at) WHERE deleted_at IS NULL;

-- Recherche textuelle (pg_trgm)
CREATE INDEX idx_robots_name_trgm ON robots USING gin(name gin_trgm_ops);
CREATE INDEX idx_brands_name_trgm ON brands USING gin(name gin_trgm_ops);

-- JOINs i18n
CREATE INDEX idx_robots_i18n_locale ON robots_i18n(locale);
CREATE INDEX idx_jobs_i18n_locale ON jobs_i18n(locale);
CREATE INDEX idx_glossary_i18n_locale ON glossary_terms_i18n(locale);

-- Leaderboards
CREATE INDEX idx_robot_job_scores_ranking ON robot_job_scores(job_id, score_tech DESC);

-- Deployments
CREATE INDEX idx_deployments_robot ON deployments(robot_id);
CREATE INDEX idx_deployments_job ON deployments(job_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_verified ON deployments(is_verified) WHERE is_verified = true;

-- Lead Gen
CREATE UNIQUE INDEX idx_job_alerts_unique ON job_alerts(email, job_id);
CREATE INDEX idx_error_reports_status ON error_reports(status);

-- Unicite deployments (evite doublons)
CREATE UNIQUE INDEX idx_deployments_unique
ON deployments(robot_id, LOWER(company_name), COALESCE(job_id, '00000000-0000-0000-0000-000000000000'));

-- ============================================================================
-- STEP 7: FUNCTIONS & TRIGGERS
-- ============================================================================

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_brands_updated BEFORE UPDATE ON brands
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_robots_updated BEFORE UPDATE ON robots
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_jobs_updated BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_glossary_updated BEFORE UPDATE ON glossary_terms
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Cache invalidation quand specs changent
CREATE OR REPLACE FUNCTION invalidate_robot_scores()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.specs IS DISTINCT FROM NEW.specs THEN
    DELETE FROM robot_job_scores WHERE robot_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invalidate_scores
AFTER UPDATE ON robots
FOR EACH ROW EXECUTE FUNCTION invalidate_robot_scores();

-- Cache invalidation quand scoring_criteria change
CREATE OR REPLACE FUNCTION invalidate_job_scores()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.scoring_criteria IS DISTINCT FROM NEW.scoring_criteria THEN
    DELETE FROM robot_job_scores WHERE job_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invalidate_job_scores
AFTER UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION invalidate_job_scores();

-- ============================================================================
-- STEP 8: VIEWS (Soft Delete)
-- ============================================================================

CREATE VIEW active_brands AS
SELECT * FROM brands WHERE deleted_at IS NULL;

CREATE VIEW active_robots AS
SELECT * FROM robots WHERE deleted_at IS NULL;

CREATE VIEW active_jobs AS
SELECT * FROM jobs WHERE deleted_at IS NULL;

CREATE VIEW active_glossary_terms AS
SELECT * FROM glossary_terms WHERE deleted_at IS NULL;

-- ============================================================================
-- DONE! Verify with: SELECT * FROM active_robots;
-- ============================================================================

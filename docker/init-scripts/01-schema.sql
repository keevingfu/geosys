-- Dymesty AI Glasses FAQ DAM Database Schema
-- Database: dymestydam
-- Purpose: GEO/GEM Content Asset Management for AI Platform Optimization

-- Create schemas
CREATE SCHEMA IF NOT EXISTS faq;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS ai_platforms;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For better indexing

-- Set default search path
SET search_path TO faq, public;

-- Categories table
CREATE TABLE faq.categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQ entries table
CREATE TABLE faq.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INTEGER REFERENCES faq.categories(id),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    question_variations TEXT[], -- Alternative phrasings
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tags table for keyword optimization
CREATE TABLE faq.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQ-Tags junction table
CREATE TABLE faq.faq_tags (
    faq_id UUID REFERENCES faq.faqs(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES faq.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (faq_id, tag_id)
);

-- AI Platforms configuration
CREATE TABLE ai_platforms.platforms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    api_endpoint VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQ-Platform optimization settings
CREATE TABLE ai_platforms.faq_platform_optimization (
    id SERIAL PRIMARY KEY,
    faq_id UUID REFERENCES faq.faqs(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES ai_platforms.platforms(id),
    optimized_question TEXT,
    optimized_answer TEXT,
    keywords TEXT[],
    performance_score DECIMAL(3,2),
    last_synced TIMESTAMP WITH TIME ZONE,
    UNIQUE(faq_id, platform_id)
);

-- Analytics tracking
CREATE TABLE analytics.faq_views (
    id BIGSERIAL PRIMARY KEY,
    faq_id UUID REFERENCES faq.faqs(id),
    platform_id INTEGER REFERENCES ai_platforms.platforms(id),
    source VARCHAR(50),
    user_agent TEXT,
    ip_hash VARCHAR(64), -- Hashed for privacy
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search queries tracking
CREATE TABLE analytics.search_queries (
    id BIGSERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    results_count INTEGER,
    platform_id INTEGER REFERENCES ai_platforms.platforms(id),
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_faqs_category ON faq.faqs(category_id);
CREATE INDEX idx_faqs_active ON faq.faqs(is_active) WHERE is_active = true;
CREATE INDEX idx_faqs_featured ON faq.faqs(is_featured) WHERE is_featured = true;
CREATE INDEX idx_faqs_question_gin ON faq.faqs USING gin(to_tsvector('english', question));
CREATE INDEX idx_faqs_answer_gin ON faq.faqs USING gin(to_tsvector('english', answer));
CREATE INDEX idx_faq_tags_faq ON faq.faq_tags(faq_id);
CREATE INDEX idx_faq_tags_tag ON faq.faq_tags(tag_id);
CREATE INDEX idx_analytics_views_faq ON analytics.faq_views(faq_id);
CREATE INDEX idx_analytics_views_date ON analytics.faq_views(viewed_at);

-- Full-text search configuration
ALTER TABLE faq.faqs ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION faq.update_search_vector()
RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.question, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.answer, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faq_search_vector
    BEFORE INSERT OR UPDATE ON faq.faqs
    FOR EACH ROW
    EXECUTE FUNCTION faq.update_search_vector();

CREATE INDEX idx_faqs_search_vector ON faq.faqs USING gin(search_vector);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faq.faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON faq.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Views for common queries
CREATE OR REPLACE VIEW faq.v_faq_complete AS
SELECT 
    f.id,
    f.question,
    f.answer,
    f.question_variations,
    f.is_featured,
    f.view_count,
    f.helpful_count,
    c.code as category_code,
    c.name as category_name,
    c.icon as category_icon,
    ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
    f.created_at,
    f.updated_at
FROM faq.faqs f
JOIN faq.categories c ON f.category_id = c.id
LEFT JOIN faq.faq_tags ft ON f.id = ft.faq_id
LEFT JOIN faq.tags t ON ft.tag_id = t.id
WHERE f.is_active = true
GROUP BY f.id, c.id;

-- Analytics view
CREATE OR REPLACE VIEW analytics.v_faq_performance AS
SELECT 
    f.id,
    f.question,
    c.name as category,
    COUNT(DISTINCT v.id) as total_views,
    COUNT(DISTINCT v.id) FILTER (WHERE v.viewed_at > CURRENT_DATE - INTERVAL '7 days') as views_last_7_days,
    COUNT(DISTINCT v.id) FILTER (WHERE v.viewed_at > CURRENT_DATE - INTERVAL '30 days') as views_last_30_days,
    f.helpful_count,
    f.not_helpful_count,
    CASE 
        WHEN (f.helpful_count + f.not_helpful_count) > 0 
        THEN ROUND((f.helpful_count::numeric / (f.helpful_count + f.not_helpful_count)) * 100, 2)
        ELSE 0 
    END as helpfulness_score
FROM faq.faqs f
JOIN faq.categories c ON f.category_id = c.id
LEFT JOIN analytics.faq_views v ON f.id = v.faq_id
GROUP BY f.id, c.id;

-- Grant permissions
GRANT USAGE ON SCHEMA faq TO PUBLIC;
GRANT USAGE ON SCHEMA analytics TO PUBLIC;
GRANT USAGE ON SCHEMA ai_platforms TO PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA faq TO PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO PUBLIC;
GRANT SELECT ON ALL TABLES IN SCHEMA ai_platforms TO PUBLIC;
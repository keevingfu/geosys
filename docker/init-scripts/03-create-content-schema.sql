-- Create content schema
CREATE SCHEMA IF NOT EXISTS content;

-- Create content types enum
CREATE TYPE content.content_type AS ENUM ('article', 'faq', 'guide', 'announcement', 'report');
CREATE TYPE content.content_status AS ENUM ('draft', 'published', 'archived', 'scheduled');

-- Create content items table
CREATE TABLE IF NOT EXISTS content.items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    type content.content_type NOT NULL,
    status content.content_status DEFAULT 'draft',
    metadata JSONB DEFAULT '{}',
    tags TEXT[],
    created_by INTEGER REFERENCES auth.users(id),
    updated_by INTEGER REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS content.activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Create page views table
CREATE TABLE IF NOT EXISTS analytics.page_views (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    page_url TEXT NOT NULL,
    content_id INTEGER REFERENCES content.items(id),
    referrer TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    country_code VARCHAR(2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS analytics.sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES auth.users(id),
    duration INTEGER, -- in seconds
    page_count INTEGER DEFAULT 0,
    bounce BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI platforms metrics table
CREATE TABLE IF NOT EXISTS ai_platforms.content_performance (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES content.items(id),
    platform_id INTEGER REFERENCES ai_platforms.platforms(id),
    visibility_score DECIMAL(5,2),
    ranking_position INTEGER,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_platforms.metrics (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES content.items(id),
    visibility_score DECIMAL(5,2),
    impressions INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_platforms.submissions (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES content.items(id),
    platform_id INTEGER REFERENCES ai_platforms.platforms(id),
    submitted_by INTEGER REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'pending',
    response JSONB,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_content_items_type ON content.items(type);
CREATE INDEX idx_content_items_status ON content.items(status);
CREATE INDEX idx_content_items_created_by ON content.items(created_by);
CREATE INDEX idx_content_items_tags ON content.items USING GIN(tags);
CREATE INDEX idx_content_items_metadata ON content.items USING GIN(metadata);

CREATE INDEX idx_activity_log_user_id ON content.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON content.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created_at ON content.activity_log(created_at);

CREATE INDEX idx_page_views_session_id ON analytics.page_views(session_id);
CREATE INDEX idx_page_views_content_id ON analytics.page_views(content_id);
CREATE INDEX idx_page_views_created_at ON analytics.page_views(created_at);

CREATE INDEX idx_sessions_session_id ON analytics.sessions(session_id);
CREATE INDEX idx_sessions_user_id ON analytics.sessions(user_id);

-- Create update trigger for content items
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content.items
    FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA content TO dymesty_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA content TO dymesty_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA content TO dymesty_admin;

GRANT USAGE ON SCHEMA analytics TO dymesty_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO dymesty_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO dymesty_admin;

-- Insert sample content
INSERT INTO content.items (title, content, type, status, tags) VALUES
('Getting Started with Dymesty AI Glasses', 'Complete guide to setting up your Dymesty AI Glasses...', 'guide', 'published', ARRAY['setup', 'tutorial']),
('AI Translation Features Overview', 'Learn about the real-time translation capabilities...', 'article', 'published', ARRAY['translation', 'features']),
('Privacy and Security FAQ', 'Common questions about privacy features...', 'faq', 'published', ARRAY['privacy', 'security']),
('New Firmware Update 2.0', 'Announcing our latest firmware update...', 'announcement', 'published', ARRAY['update', 'firmware']);

-- Insert sample AI platforms
INSERT INTO ai_platforms.platforms (name, platform_type, api_endpoint) VALUES
('ChatGPT', 'conversational', 'https://api.openai.com'),
('Perplexity', 'search', 'https://api.perplexity.ai'),
('Claude', 'conversational', 'https://api.anthropic.com'),
('Gemini', 'conversational', 'https://api.google.com'),
('You.com', 'search', 'https://api.you.com')
ON CONFLICT (name) DO NOTHING;
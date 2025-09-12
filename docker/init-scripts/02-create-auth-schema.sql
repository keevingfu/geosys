-- Create auth schema for user management
CREATE SCHEMA IF NOT EXISTS auth;

-- Create users table
CREATE TABLE IF NOT EXISTS auth.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create login attempts table for security monitoring
CREATE TABLE IF NOT EXISTS auth.login_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for token management
CREATE TABLE IF NOT EXISTS auth.sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id) NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Create logout log table
CREATE TABLE IF NOT EXISTS auth.logout_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES auth.users(id),
    logged_out_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_username ON auth.users(username);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_login_attempts_user_id ON auth.login_attempts(user_id);
CREATE INDEX idx_login_attempts_ip ON auth.login_attempts(ip_address);
CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_token ON auth.sessions(token_hash);
CREATE INDEX idx_sessions_expires ON auth.sessions(expires_at);

-- Create default admin user (password: Admin@123!)
INSERT INTO auth.users (email, username, password_hash, role) 
VALUES (
    'admin@dymesty.com',
    'admin',
    '$2a$10$YGPZxQza4p2STzP1MpL5seUKjJvR0Y3aJWqzPqB1heNrDQGxI7QH2', -- Admin@123!
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Create demo users (password: Demo@123!)
INSERT INTO auth.users (email, username, password_hash, role) 
VALUES 
    ('demo@dymesty.com', 'demo', '$2a$10$HtWecqF5MSM7hZPqnQBxH.DGAW8vv0WPqskH8KxD.pQ0GxHtLZXNi', 'user'),
    ('editor@dymesty.com', 'editor', '$2a$10$HtWecqF5MSM7hZPqnQBxH.DGAW8vv0WPqskH8KxD.pQ0GxHtLZXNi', 'editor')
ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION auth.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION auth.update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA auth TO dymesty_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO dymesty_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO dymesty_admin;
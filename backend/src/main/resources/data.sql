-- Database initialization script for admin user
-- This script creates a default admin user for development purposes
-- Username: admin
-- Password: admin123
-- BCrypt hash generated with strength 10

-- Insert default admin user if not exists
INSERT INTO admin_users (username, password, role, created_at)
SELECT 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'admin'
);

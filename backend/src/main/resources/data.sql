-- Database initialization script for admin user
-- Password is managed programmatically via CommandLineRunner in WebVibesApplication.java
-- This only inserts the row if it doesn't exist yet (password will be overwritten on startup anyway)

INSERT INTO admin_users (username, password, role, created_at)
SELECT 'admin', 'PLACEHOLDER', 'ROLE_ADMIN', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'admin'
);

-- Database initialization script for admin user
-- Uses INSERT IGNORE to safely insert only if not exists (works on MySQL and TiDB)
INSERT IGNORE INTO admin_users (username, password, role, created_at)
VALUES ('admin', 'PLACEHOLDER', 'ROLE_ADMIN', NOW());

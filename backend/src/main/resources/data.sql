-- Database initialization script for admin user
-- Username: admin
-- Password: admin123
-- BCrypt hash (strength 10) for: admin123

-- Insert default admin user if not exists
INSERT INTO admin_users (username, password, role, created_at)
SELECT 'admin', '$2a$10$EblZqNptyYvcLm/VwDptluAkl1/E740bzdCrmL1Ndp.k7C0.TVnmm', 'ROLE_ADMIN', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM admin_users WHERE username = 'admin'
);

-- Fix existing admin user if password hash is wrong (was seeded with wrong hash)
UPDATE admin_users
SET password = '$2a$10$EblZqNptyYvcLm/VwDptluAkl1/E740bzdCrmL1Ndp.k7C0.TVnmm'
WHERE username = 'admin'
  AND password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

-- Database Verification Script for WebVibes Technology Backend
-- Run this script after starting the application to verify database schema

-- Connect to the database
USE webvibes_db;

-- Show all tables
SHOW TABLES;

-- Verify internship_applications table structure
DESCRIBE internship_applications;

-- Verify course_enrollments table structure
DESCRIBE course_enrollments;

-- Verify contact_messages table structure
DESCRIBE contact_messages;

-- Verify projects table structure
DESCRIBE projects;

-- Show indexes on internship_applications
SHOW INDEX FROM internship_applications;

-- Show indexes on course_enrollments
SHOW INDEX FROM course_enrollments;

-- Show indexes on contact_messages
SHOW INDEX FROM contact_messages;

-- Show indexes on projects
SHOW INDEX FROM projects;

-- Count records in each table
SELECT 'internship_applications' AS table_name, COUNT(*) AS record_count FROM internship_applications
UNION ALL
SELECT 'course_enrollments', COUNT(*) FROM course_enrollments
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'projects', COUNT(*) FROM projects;

-- Sample data queries (if any data exists)
SELECT * FROM internship_applications LIMIT 5;
SELECT * FROM course_enrollments LIMIT 5;
SELECT * FROM contact_messages LIMIT 5;
SELECT * FROM projects LIMIT 5;

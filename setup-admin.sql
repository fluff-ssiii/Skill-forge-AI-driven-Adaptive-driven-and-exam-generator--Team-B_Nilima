-- Create test admin account
-- Email: admin@test.com
-- Password: admin123 (bcrypt encoded)
-- The password below is the bcrypted version of "admin123"

USE springpro_db;

INSERT INTO users (email, full_name, password, role) VALUES 
('admin@test.com', 'Test Admin', '$2a$10$slYQmyNdGzin7olVgsiqFuPmGe2短暂的编码版本', 'ADMIN');

-- Verify it was created
SELECT * FROM users WHERE role = 'ADMIN';

-- Ensure the admin user exists in auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'admin@biteon.com', crypt('password123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (email) DO NOTHING;

-- Ensure the admin user exists in public.users with the correct employee_id
INSERT INTO users (email, employee_id, name, role)
VALUES ('admin@biteon.com', 'ADM001', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Update the employee_id if it exists but is different
UPDATE users 
SET employee_id = 'ADM001' 
WHERE email = 'admin@biteon.com' AND employee_id != 'ADM001';

-- Create a function to create a user in auth.users if they don't exist
CREATE OR REPLACE FUNCTION create_auth_user_if_not_exists()
RETURNS VOID AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if the user exists in auth.users
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@biteon.com') INTO user_exists;
  
  -- If the user doesn't exist, create them
  IF NOT user_exists THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
      (gen_random_uuid(), 'admin@biteon.com', crypt('password123', gen_salt('bf')), now(), now(), now());
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_auth_user_if_not_exists();

-- Drop the function after use
DROP FUNCTION create_auth_user_if_not_exists();

-- Ensure the admin user exists in public.users with the correct employee_id
INSERT INTO users (email, employee_id, name, role)
VALUES ('admin@biteon.com', 'ADM001', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

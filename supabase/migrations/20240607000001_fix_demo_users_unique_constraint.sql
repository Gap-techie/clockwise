-- Check if admin user exists before inserting
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@biteon.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', 'admin@biteon.com', '$2a$10$Ql9XLaLqYnrSA1QE/QXKVeVl9/pCzw0dvW.MRfBEHJOO5ZHXww5Vu', now(), now(), now());
  END IF;

  -- Ensure admin user exists in public.users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@biteon.com') THEN
    INSERT INTO public.users (id, name, email, role, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin@biteon.com', 'admin', now(), now());
  END IF;

  -- Check if employee user exists before inserting
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'employee@biteon.com') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000001', 'employee@biteon.com', '$2a$10$Ql9XLaLqYnrSA1QE/QXKVeVl9/pCzw0dvW.MRfBEHJOO5ZHXww5Vu', now(), now(), now());
  END IF;

  -- Ensure employee user exists in public.users
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'employee@biteon.com') THEN
    INSERT INTO public.users (id, name, email, role, employee_id, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Employee', 'employee@biteon.com', 'employee', 'EMP001', now(), now());
  END IF;
END
$$;
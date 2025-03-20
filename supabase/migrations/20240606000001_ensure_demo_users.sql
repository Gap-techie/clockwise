-- Ensure demo admin user exists
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@biteon.com', '$2a$10$Ql9XLaLqYnrSA1QE/QXKVeVl9/pCzw0dvW.MRfBEHJOO5ZHXww5Vu', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Ensure demo admin user exists in public.users
INSERT INTO public.users (id, name, email, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin@biteon.com', 'admin', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Ensure demo employee user exists
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'employee@biteon.com', '$2a$10$Ql9XLaLqYnrSA1QE/QXKVeVl9/pCzw0dvW.MRfBEHJOO5ZHXww5Vu', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Ensure demo employee user exists in public.users
INSERT INTO public.users (id, name, email, role, employee_id, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Employee', 'employee@biteon.com', 'employee', 'EMP001', now(), now())
ON CONFLICT (id) DO NOTHING;

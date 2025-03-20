-- Ensure the projects table exists
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add realtime support
alter publication supabase_realtime add table projects;

-- Add some default projects if none exist
INSERT INTO public.projects (name, description)
SELECT 'Website Redesign', 'Complete overhaul of the company website'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Website Redesign');

INSERT INTO public.projects (name, description)
SELECT 'Mobile App Development', 'Development of iOS and Android applications'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Mobile App Development');

INSERT INTO public.projects (name, description)
SELECT 'Database Migration', 'Migration of legacy database to new system'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Database Migration');

INSERT INTO public.projects (name, description)
SELECT 'Marketing Campaign', 'Q3 marketing campaign for new product launch'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Marketing Campaign');

INSERT INTO public.projects (name, description)
SELECT 'Internal Training', 'Employee training program for new technologies'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Internal Training');

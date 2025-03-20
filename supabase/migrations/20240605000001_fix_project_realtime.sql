-- Check if projects table is already a member of the publication before adding it
DO $$
DECLARE
  is_member BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'projects'
  ) INTO is_member;
  
  IF NOT is_member THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.projects';
  END IF;
END
$$;

-- Ensure we have some default projects
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

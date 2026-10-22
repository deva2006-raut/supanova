CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Development',
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS allow_all ON public.tasks;
CREATE POLICY allow_all ON public.tasks
    FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

GRANT ALL ON public.tasks TO anon, authenticated, service_role;

INSERT INTO public.tasks (title, description, category, priority, status)
VALUES 
    ('Design Modern Dashboard UI', 'Implement dark mode glassmorphism layout with Tailwind CSS', 'Design', 'High', 'Completed'),
    ('Connect Supabase Client SDK', 'Configure @supabase/supabase-js with local Envoy Gateway', 'Development', 'Urgent', 'Completed'),
    ('Setup Database RLS Policies', 'Configure Row Level Security for anon and authenticated roles', 'Security', 'High', 'Completed'),
    ('Add Realtime Activity Stream', 'Listen to postgres_changes channel for instant UI updates', 'Feature', 'Medium', 'In Progress'),
    ('Deploy Edge Functions for Email', 'Trigger transactional welcome emails via Resend API', 'Backend', 'Low', 'Pending');

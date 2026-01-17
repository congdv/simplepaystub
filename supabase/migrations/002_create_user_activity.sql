-- Create user_activity table for lightweight retention tracking
-- One row per user, updated on key actions (generate_pdf, send_email, etc)

CREATE TABLE IF NOT EXISTS public.user_activity (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen_at TIMESTAMP WITH TIME ZONE,
  last_event TEXT,
  last_event_at TIMESTAMP WITH TIME ZONE,
  total_generates INTEGER NOT NULL DEFAULT 0,
  total_emails INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_last_seen_at ON public.user_activity(last_seen_at DESC);

-- Enable Row Level Security
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own activity row
CREATE POLICY "Allow authenticated users to read own activity"
  ON public.user_activity
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own activity row
CREATE POLICY "Allow authenticated users to insert own activity"
  ON public.user_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own activity row
CREATE POLICY "Allow authenticated users to update own activity"
  ON public.user_activity
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all rows
CREATE POLICY "Allow service role to manage user activity"
  ON public.user_activity
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Keep updated_at in sync (function defined in 001_create_daily_stats.sql)
CREATE TRIGGER update_user_activity_updated_at
  BEFORE UPDATE ON public.user_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

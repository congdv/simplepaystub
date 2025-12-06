-- Create daily_stats table for tracking daily metrics
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_users INTEGER DEFAULT 0,
  pdf_downloads INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for efficient querying
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date DESC);

-- Enable Row Level Security
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all stats
CREATE POLICY "Allow authenticated users to read stats"
  ON public.daily_stats
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert/update stats
-- The service role is the client with secrite key access
CREATE POLICY "Allow service role to manage stats"
  ON public.daily_stats
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON public.daily_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

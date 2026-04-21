-- migrate:up

-- Shared trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Credits: one row per user, tracks balance
CREATE TABLE IF NOT EXISTS public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credits_user_id ON public.credits(user_id);

DROP TRIGGER IF EXISTS update_credits_updated_at ON public.credits;
CREATE TRIGGER update_credits_updated_at
  BEFORE UPDATE ON public.credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Credit transactions: audit log of every deduction and top-up
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  action TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);

-- RLS (only applies when running inside Supabase)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
    EXECUTE 'CREATE POLICY "Users can read own credits" ON public.credits FOR SELECT TO authenticated USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Service role manages credits" ON public.credits FOR ALL TO service_role USING (true) WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "Users can read own transactions" ON public.credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id)';
    EXECUTE 'CREATE POLICY "Service role manages transactions" ON public.credit_transactions FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
END $$;


-- migrate:down
DROP TRIGGER IF EXISTS update_credits_updated_at ON public.credits;
DROP TABLE IF EXISTS public.credit_transactions;
DROP TABLE IF EXISTS public.credits;
DROP FUNCTION IF EXISTS update_updated_at_column();

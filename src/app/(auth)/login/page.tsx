'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/dashboard');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth-callback`,
        },
      });
      if (error) setError(error.message);
      else setError('Check your email for the login link.');
    } catch (err: any) {
      setError('Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/auth-callback`,
        },
      });
      if (error) setError(error.message);
    } catch (err: any) {
      setError('Social login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg border w-full max-w-md">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-64">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border">
        <form className="space-y-4" onSubmit={handleEmailSignIn}>
          <h1 className="text-2xl font-bold mb-2 text-center">Sign in with Email</h1>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full mt-2" disabled={loading || !email}>
            {loading ? 'Sending link...' : 'Send magic link'}
          </Button>
          <div className="my-4 flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
            >
              {/* Google SVG */}
              Continue with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
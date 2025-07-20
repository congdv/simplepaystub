'use client';

import CardWithLogo from '@/components/card-with-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import paths from '@/paths';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace(paths.dashboard);
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    setSuccess(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_REDIRECT_URL}/reset-password`,
      });
      if (error) setError(error.message);
      else setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setSending(false);
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
    <CardWithLogo>
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-1 text-center">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Remember your password?{' '}
          <Link href={paths.signIn} className="text-blue-600 hover:underline">Sign in</Link>
        </p>
        <form className="space-y-4 w-full" onSubmit={handleResetPassword}>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              className="rounded-lg"
            />
          </div>
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full mt-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900"
            disabled={sending || !email}
          >
            {sending ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </CardWithLogo>
  );
}
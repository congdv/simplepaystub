'use client';

import CardWithLogo from '@/components/card-with-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const token_hash = searchParams.get('token_hash');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!password || !confirm) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!token_hash) {
      setError('Invalid or missing token.');
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({ type: 'email', token_hash });
      if (verifyError) {
        setError(verifyError.message);
        setSubmitting(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) setError(error.message);
      else {
        setSuccess('Your password has been reset! You can now sign in.');
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CardWithLogo>
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-1 text-center text-blue-700">Set a New Password</h2>
        <form className="space-y-4 w-full" onSubmit={handleReset}>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="confirm" className="text-sm font-medium text-gray-700">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={submitting}
              className="rounded-lg"
            />
          </div>
          {success && (
            <div className="text-sm text-center text-green-600">
              {success}
              <div className="mt-4">
                <Link href="/sign-in">
                  <Button variant="outline" className='text-black'>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            disabled={submitting || !password || !confirm}
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </CardWithLogo>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
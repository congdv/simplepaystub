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

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // simple client-side password confirmation check
    if (!password || !confirmPassword || password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSigning(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) setError(error.message);
      else {
        setSuccess('Sign up successful! Please check your email (including your spam or junk folder) and click the verification link to activate your account.');
      }
    } catch (err: any) {
      setError('Sign up failed. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const handleSocialLogin = async (provider: 'google') => {
    setSigning(true);
    setError(null);
    setSuccess(null);

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
      setSigning(false);
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
        <h2 className="text-2xl font-bold mb-1 text-center">Sign up</h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Already have an account?{' '}
          <Link href={paths.signIn} className="text-blue-600 hover:underline">Sign in</Link>
        </p>

        {/* Social Login */}
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mb-4 bg-gray-50 border-gray-200"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <svg className="mr-2" width="18" height="18" viewBox="0 0 18 18">
            <g>
              <path d="M17.64 9.2045c0-.638-.0573-1.2527-.1636-1.8418H9v3.481h4.844c-.2087 1.125-.8409 2.0809-1.7891 2.7191v2.2581h2.8936C16.7855 14.5227 17.64 12.0827 17.64 9.2045z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.4673-.8055 5.9564-2.1882l-2.8936-2.2581c-.8036.5391-1.8309.8591-3.0628.8591-2.3555 0-4.3518-1.5918-5.0664-3.7309H.9573v2.3418C2.4382 16.5682 5.4818 18 9 18z" fill="#34A853" />
              <path d="M3.9336 10.6827c-.1818-.5391-.2864-1.1136-.2864-1.6827s.1045-1.1436.2864-1.6827V4.9755H.9573C.3473 6.2064 0 7.5618 0 9c0 1.4382.3473 2.7936.9573 4.0245l2.9763-2.3418z" fill="#FBBC05" />
              <path d="M9 3.5791c1.3227 0 2.5055.4545 3.4382 1.3464l2.5782-2.5782C13.4645.8055 11.4273 0 9 0 5.4818 0 2.4382 1.4318.9573 4.0245l2.9763 2.3418C4.6482 5.1709 6.6445 3.5791 9 3.5791z" fill="#EA4335" />
            </g>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center w-full my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        {/* Sign up Form */}
        <form className="space-y-4 w-full" onSubmit={handleSignUp}>
          <div className="flex gap-2">
            <div className="w-1/2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={signing}
                className="rounded-lg"
              />
            </div>
            <div className="w-1/2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={signing}
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={signing}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={signing}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={signing}
              className="rounded-lg"
            />
          </div>
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full mt-2 bg-blue-500 text-white hover:text-white hover:bg-blue-700 font-semibold rounded-lg "
            disabled={signing || !email || !password || !confirmPassword || !firstName || !lastName}
          >
            {signing ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </div>
    </CardWithLogo>
  );
}
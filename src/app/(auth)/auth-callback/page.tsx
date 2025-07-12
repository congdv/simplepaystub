'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function AuthError({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">Authentication Error</h1>
        <p className="text-red-700 text-center mb-6">{message}</p>
        <Button onClick={() => (window.location.href = '/login')} variant="outline">
          Back to Login
        </Button>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const errorCode = searchParams.get('error_code');
    const errorDesc = searchParams.get('error_description');
    const errorGeneral = searchParams.get('error');
    if (errorCode || errorGeneral) {
      let msg = errorDesc || 'Authentication failed.';
      if (errorCode === 'otp_expired') {
        msg = 'Your magic link has expired or is invalid. Please request a new link.';
      } else if (errorCode === 'invalid_request') {
        msg = 'Invalid authentication request. Please try again.';
      } else if (errorGeneral === 'access_denied') {
        msg = 'Access denied. Please try again or contact support.';
      }
      setError(msg);
      setChecking(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setError('Authentication failed. Please try again.');
        setChecking(false);
        return;
      }
      if (data.session) {
         window.location.replace('/');
      } else {
        setError('Authentication failed or session not found. Please try again.');
        setChecking(false);
      }
    });
  }, [searchParams, router]);

  if (error) {
    return <AuthError message={error} />;
  }

  return (
    <div className="flex items-center justify-center mt-64">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border flex flex-col items-center">
        <Loader2 className="animate-spin mb-4 text-gray-400" size={32} />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Signing you in...</h2>
        <p className="text-sm text-gray-500 text-center">
          Please wait while we verify your authentication.
          <br />
          You will be redirected automatically.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center mt-64">
        <Loader2 className="animate-spin mb-4 text-gray-400" size={32} />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Signing you in...</h2>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { ProBadge } from '@/components/pro-badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import paths from '@/paths';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const { isPro, isLoading: subLoading, subscription } = useSubscription();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setUserLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      toast.success('Welcome to Pro! Your subscription is now active.');
    }
  }, [searchParams]);

  const userFullName = useMemo(() => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return 'Unknown';
  }, [user]);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      toast.error('Failed to open subscription portal.');
    } finally {
      setPortalLoading(false);
    }
  };

  const loading = userLoading || subLoading;

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg border mt-32 mx-auto">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-lg bg-white p-8 rounded-xl shadow-lg border mt-32 mx-auto space-y-6">
        {/* Account info */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Account Information</h2>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Full Name:</span>
            <span className="ml-2 text-gray-900">{userFullName}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">{user?.email || 'N/A'}</span>
          </div>
        </div>

        {/* Subscription info */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
            {isPro && <ProBadge />}
          </div>

          <div className="mb-3">
            <span className="font-medium text-gray-700">Plan:</span>
            <span className="ml-2 text-gray-900">{isPro ? 'Pro' : 'Free'}</span>
          </div>

          {isPro && subscription && (
            <>
              <div className="mb-3">
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2 capitalize text-gray-900">{subscription.status}</span>
              </div>
              {subscription.interval && (
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Billing:</span>
                  <span className="ml-2 capitalize text-gray-900">{subscription.interval}ly</span>
                </div>
              )}
              {renewalDate && (
                <div className="mb-4">
                  <span className="font-medium text-gray-700">
                    {subscription.cancelAtPeriodEnd ? 'Access until:' : 'Renews on:'}
                  </span>
                  <span className="ml-2 text-gray-900">{renewalDate}</span>
                </div>
              )}
              {subscription.cancelAtPeriodEnd && (
                <p className="text-sm text-amber-600 mb-4">
                  Your subscription will not renew. You'll keep Pro access until the period ends.
                </p>
              )}
              <Button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                variant="outline"
                className="w-full"
              >
                {portalLoading ? 'Loading…' : 'Manage Subscription'}
              </Button>
            </>
          )}

          {!isPro && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Upgrade to Pro to unlock auto tax calculations, bulk generation, premium templates, and more.
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={paths.pricing}>Upgrade to Pro</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

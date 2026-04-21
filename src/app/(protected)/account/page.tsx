'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';
import { useCredits } from '@/hooks/use-credits';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import paths from '@/paths';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { balance, isLoading: creditsLoading, refresh: refreshCredits } = useCredits();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setUserLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get('purchase') === 'success') {
      const pack = searchParams.get('pack');
      const packNames: Record<string, string> = { starter: '5', value: '20', pro: '50' };
      const credits = pack ? packNames[pack] : null;
      toast.success(credits ? `${credits} credits added to your account!` : 'Credits added successfully!');
      refreshCredits();
    }
  }, [searchParams, refreshCredits]);

  const userFullName = useMemo(() => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return 'Unknown';
  }, [user]);

  const loading = userLoading || creditsLoading;

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

        {/* Credits */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Credits</h3>
            <div className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              <Zap className="h-3 w-3" />
              {balance}
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Credits are used for Auto Tax and bulk generation. They never expire.
          </p>

          <div className="mb-4 p-4 bg-slate-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Available balance</p>
              <p className="text-2xl font-bold text-gray-900">{balance} credit{balance === 1 ? '' : 's'}</p>
            </div>
            <Zap className="h-8 w-8 text-blue-200" />
          </div>

          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={paths.pricing}>Buy more credits</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

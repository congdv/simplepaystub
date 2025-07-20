'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useMemo, useState } from 'react';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const userFullName = useMemo(() => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return "Unknown";
  }, [user]);


  if (loading) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-md bg-white p-8 rounded-xl shadow-lg border mt-32 mx-auto">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-6 w-48 mb-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-lg bg-white p-8 rounded-xl shadow-lg border mt-32 mx-auto">
        < h2 className="text-2xl font-bold mb-6 text-blue-700" > Account Information</h2 >
        <div className="mb-4">
          <span className="font-medium text-gray-700">Full Name:</span>
          <span className="ml-2 text-gray-900">{userFullName}</span>
        </div>
        <div className="mb-4">
          <span className="font-medium text-gray-700">Email:</span>
          <span className="ml-2 text-gray-900">{user?.email || 'N/A'}</span>
        </div>
      </div >
    </div >
  );
}
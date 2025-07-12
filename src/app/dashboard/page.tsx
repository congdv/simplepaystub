'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string; name?: string | null }>({});
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      console.log(data);
      setUser({
        email: data.user?.email,
        name: data.user?.user_metadata?.name || null,
      });
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <div className="mt-32 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border">
        <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        <p className="text-gray-700 text-center mb-4">
          Welcome to your dashboard!
          <br />
          Here you can manage your pay stubs and account.
        </p>
        <div className="text-center mt-4">
          <p className="font-semibold">Name: {user.name || 'N/A'}</p>
          <p className="font-semibold">Email: {user.email || 'N/A'}</p>
        </div>
        <Button className="mt-6 w-full" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}

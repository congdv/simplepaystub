'use client';
import { createClient } from '@/lib/supabase/client';
import { getInitial } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';
import { LogOut, User2Icon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

export default function UserButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
      setUser(data.session?.user);
      data.session?.user
      setLoading(false);
    });
  }, []);

  const getInitialMemo = useMemo(() => getInitial, []);
  const userFullName = useMemo(() => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return "Unknown";
  }, [user]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.reload();
  };
  if (loading) {
    return (
      <Skeleton className="w-10 h-10 rounded-lg bg-gray-200" />
    )
  }
  if (!loggedIn) {
    return (
      <Link href="/login">
        <Button variant={"ghost"}>Sign in</Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          className='w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-lg'
        >
          {getInitialMemo(user?.email || 'Simple')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-lg">
              {getInitialMemo(user?.email)}
            </div>
            <div>
              <div className="font-semibold">{userFullName}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex items-center gap-2">
            <User2Icon className="w-4 h-4" />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
          <LogOut className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
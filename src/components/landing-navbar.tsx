'use client';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from './ui/button';

const font = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

function UserAuth() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-white">Hello, {user?.firstName}</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button id="user-sign-in" className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
        Login
      </Button>
    </SignInButton>
  );
}

export const LandingNavbar = () => {
  return (
    <nav className="p-4 bg-[#213555]  items-center  ">
      <div className="mx-auto max-w-screen-xl w-full flex justify-between">
        <Link href={'/'} className="flex items-center">
          <Image
            src="/logo.png" // Place your logo in the public/ directory and update the path if needed
            alt="Pay Stub Generator Logo"
            width={40}
            height={40}
            className="rounded mr-2"
            priority
          />
          <h1 className={cn('text-2xl font-bold text-[#F5EFE7]', font.className)}>
            Simple Pay Stub
          </h1>
        </Link>
        {/* <div className="flex items-center">{UserAuth()}</div> */}
      </div>
    </nav>
  );
};

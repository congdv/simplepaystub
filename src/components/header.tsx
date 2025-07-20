'use client';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import UserButton from './user-button';

const font = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export const Header = ({ showAuth = true }: { showAuth?: boolean }) => {


  return (
    <nav className="p-4 border-gray-200 border-b">
      <div className="mx-auto max-w-screen-xl w-full flex justify-between items-center">
        <Link href={'/'} className="flex items-center">
          <Image
            src="/logo.png"
            alt="Pay Stub Generator Logo"
            width={40}
            height={40}
            className="rounded mr-2"
            priority
          />
          <h1 className={cn('text-2xl font-bold text-blue-700', font.className)}>SimplePaystub</h1>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            href="/faq"
          >
            <Button
              variant={"ghost"}
              className="px-2 py-2 rounded text-black"
            >
              FAQ
            </Button>
          </Link>
          {showAuth && <UserButton />}
        </div>
      </div>
    </nav>
  );
};
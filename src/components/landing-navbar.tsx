'use client';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const font = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export const LandingNavbar = () => {
  return (
    <nav className="p-4 bg-[#213555] flex items-center justify-between ">
      <div className="mx-auto max-w-screen-xl w-full">
        <Link href={'/'} className="flex items-center">
        <Image
        src="/logo.png" // Place your logo in the public/ directory and update the path if needed
        alt="Paystub Generator Logo"
        width={40}
        height={40}
        className="rounded mr-2"
        priority
      />
          <h1 className={cn('text-2xl font-bold text-[#F5EFE7]', font.className)}>Simple Paystub</h1>
        </Link>
      </div>
    </nav>
  );
};

'use client';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

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
            src="/logo.png" // Place your logo in the public/ directory and update the path if needed
            alt="Pay Stub Generator Logo"
            width={40}
            height={40}
            className="rounded mr-2"
            priority
          />
          <h1 className={cn('text-2xl font-bold text-[##92459]', font.className)}>SimplePaystub</h1>
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/faq"
            className="text-[##92459] hover:text-blue-500 transition-colors duration-200 font-medium"
          >
            FAQ
          </Link>
          {showAuth && (
            <div className="flex items-center space-x-4">
              {/* Add other auth buttons here if needed */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

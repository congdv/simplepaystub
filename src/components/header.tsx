'use client';
import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import UserButton from './user-button';
import { CreditBalance } from './credit-balance';

const font = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export const Header = ({ showAuth = true }: { showAuth?: boolean }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Pay Stub Generator Logo"
            width={32}
            height={32}
            className="rounded"
            priority
          />
          <span className={cn('text-xl font-bold text-primary tracking-tight', font.className)}>
            SimplePaystub
          </span>
        </Link>

        {/* Right: Nav + Auth */}
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <CreditBalance />
          {showAuth && <UserButton />}
        </div>
      </nav>
    </header>
  );
};

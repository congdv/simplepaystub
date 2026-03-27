import { cn } from '@/lib/utils';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const font = Montserrat({
  weight: '600',
  subsets: ['latin'],
});

export const Footer = () => (
  <footer className="bg-white border-t border-slate-200 py-12 mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SimplePaystub Logo"
              width={32}
              height={32}
              className="rounded"
            />
            <span className={cn('text-xl font-bold text-primary tracking-tight', font.className)}>
              SimplePaystub
            </span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Professional payroll solutions made simple for businesses and individuals.
          </p>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Notice</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
        <span className="text-sm text-slate-400">&copy; 2024 - {new Date().getFullYear()} SimplePaystub.com.</span>
      </div>
    </div>
  </footer>
);

import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => (
  <footer className="bg-white border-t border-slate-200 py-12 mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {/* Product */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Notice</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">&copy; 2024 - {new Date().getFullYear()} SimplePaystub.com.</span>
        </div>
      </div>
    </div>
  </footer>
);

import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => (
  <footer className="bg-white border-t border-slate-200 py-12 mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

        {/* Stay Updated */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-sm font-bold text-slate-900 mb-4">Stay Updated</h4>
          <p className="text-xs text-slate-500 mb-4">Professional payroll tips delivered to your inbox.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="SimplePaystub" width={24} height={24} className="opacity-50 grayscale" />
          <span className="text-sm text-slate-400">&copy; 2024 - {new Date().getFullYear()} SimplePaystub.com.</span>
        </div>
        <div className="flex gap-6">
          <div className="w-5 h-5 bg-slate-200 rounded-full" />
          <div className="w-5 h-5 bg-slate-200 rounded-full" />
          <div className="w-5 h-5 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  </footer>
);

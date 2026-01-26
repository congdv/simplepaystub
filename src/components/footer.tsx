import Link from 'next/link';

export const Footer = () => (
  <footer className="w-full border-t border-gray-200 py-6 px-4 flex flex-col items-center gap-2 text-center text-sm text-gray-500 mt-4">
    <div className="flex flex-wrap gap-4 justify-center mb-1">
      <Link href="/terms" className="hover:underline" rel="noopener noreferrer">
        Terms of Service
      </Link>
      <span>|</span>
      <Link href="/privacy" className="hover:underline" rel="noopener noreferrer">
        Privacy Notice
      </Link>
      <span>|</span>
      <Link href="/help" className="hover:underline" rel="noopener noreferrer">
        Help
      </Link>
    </div>
    <div>
      Made with <span className="text-red-500">♥</span> &middot;
      <a
        href="https://x.com/CongDao9"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Follow me on Twitter<span role="img" aria-label="waving hand">👋</span>
      </a>
    </div>
    <div>&copy; {new Date().getFullYear()} SimplePaystub.com. All rights reserved.</div>
  </footer>
);
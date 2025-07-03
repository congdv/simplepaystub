export const LandingFooter = () => (
  <footer className="w-full bg-white border-t border-gray-200 py-6 px-4 flex flex-col items-center gap-2 text-center text-sm text-gray-500 mt-4">
    <div>
      &copy; {new Date().getFullYear()} Paystub Generator. All rights reserved.
    </div>
    <div className="flex flex-wrap justify-center gap-4">
      <a
        href="/"
        className="hover:text-blue-600 transition-colors"
      >
        Home
      </a>
      <a
        href="/about"
        className="hover:text-blue-600 transition-colors"
      >
        About
      </a>
      <a
        href="/privacy"
        className="hover:text-blue-600 transition-colors"
      >
        Privacy Policy
      </a>
      <a
        href="/contact"
        className="hover:text-blue-600 transition-colors"
      >
        Contact
      </a>
    </div>
    <div>
      Made with <span className="text-red-500">&hearts;</span> for small businesses.
    </div>
  </footer>
);
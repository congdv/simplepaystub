export const LandingFooter = () => (
  <footer className="w-full bg-white border-t border-gray-200 py-6 px-4 flex flex-col items-center gap-2 text-center text-sm text-gray-500 mt-4">
    <div>&copy; {new Date().getFullYear()} Simple Paystub. All rights reserved.</div>
    <div>
      Made with <span className="text-red-500">&hearts;</span> by <a href="https://x.com/CongDao9" className="underline hover:text-blue-600">Cong Dao</a>
    </div>
  </footer>
);

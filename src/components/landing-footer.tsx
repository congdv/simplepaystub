import { Flame } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="text-[#213555] py-4 fixed bottom-0 right-0">
      <div className="container px-4 text-right">
        <p className="flex items-center justify-center space-x-2">
          <span>Made with </span>
          <Flame className="w-5 h-5 text-red-500 fill-red" />
          <a
            href="https://congdv.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            by Cong Dao
          </a>
        </p>
      </div>
    </footer>
  );
};

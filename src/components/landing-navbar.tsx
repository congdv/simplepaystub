"use client";
import { cn } from "@/lib/utils";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const font = Montserrat({
  weight: "600",
  subsets: ["latin"]
});

export const LandingNavbar = () => {
  return (
    <nav className="p-4 bg-[#213555] flex items-center justify-between ">
      <div className="mx-auto max-w-screen-xl w-full">
        <Link href={"/"} className="flex items-center">
          <h1
            className={cn("text-2xl font-bold text-[#F5EFE7]", font.className)}
          >
            Paystub
          </h1>
        </Link>
      </div>
    </nav>
  );
};

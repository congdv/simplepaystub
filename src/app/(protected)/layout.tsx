
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { KofiButton } from "@/components/kofi-button";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <KofiButton />
    </>
  );
}
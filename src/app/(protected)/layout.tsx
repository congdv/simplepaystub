import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { KofiButton } from "@/components/kofi-button";
import { CreditsProvider } from "@/contexts/credits-context";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <CreditsProvider>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <KofiButton />
    </CreditsProvider>
  );
}
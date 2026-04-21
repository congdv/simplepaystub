import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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
    </CreditsProvider>
  );
}
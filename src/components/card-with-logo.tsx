
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';

interface CardWithLogProps {
  children: ReactNode;
  className?: string;
}

export default function CardWithLogo({ children, className }: CardWithLogProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] ${className}`
    } >
      <div className="flex flex-row items-center mb-6">
        <Link href="/" className="flex items-center group">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="mb-2" />
          <h1 className="text-2xl font-bold ml-2 ">SimplePaystub</h1>
        </Link>
      </div>
      {children}
    </div >
  )
}
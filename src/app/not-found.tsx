'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import paths from '@/paths';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <div className="space-y-6">
          {/* 404 Number */}
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been moved,
            deleted, or you may have entered an incorrect URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href={paths.home}>
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>

          {/* Additional Help */}
          <div className="pt-4 text-sm text-muted-foreground">
            Need help? Visit our{' '}
            <Link href={paths.faq} className="text-primary hover:underline">
              FAQ page
            </Link>{' '}
            or{' '}
            <Link href={paths.help} className="text-primary hover:underline">
              help center
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

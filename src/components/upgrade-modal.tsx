'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import paths from '@/paths';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

export function UpgradeModal({ open, onClose, featureName }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <DialogTitle>Pro Feature</DialogTitle>
          </div>
          <DialogDescription>
            {featureName
              ? `${featureName} is available on the Pro plan.`
              : 'This feature is available on the Pro plan.'}{' '}
            Upgrade to unlock auto tax calculations, bulk generation, premium templates, and more.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe later
          </Button>
          <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={paths.pricing} onClick={onClose}>
              View Pro plans
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

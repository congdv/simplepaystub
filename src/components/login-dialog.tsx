import Link from 'next/link';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import paths from '@/paths';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginDialog({ open, onClose }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to access this feature. Please log in to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-2">
          <Button asChild className="w-full">
            <Link href={`${paths.signIn}?redirect=/`} onClick={onClose}>
              Sign in
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`${paths.signUp}?redirect=/`} onClick={onClose}>
              Create free account
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

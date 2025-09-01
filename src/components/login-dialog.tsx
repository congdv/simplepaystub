import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginDialog({ open, onClose, onLoginSuccess }: LoginDialogProps) {
  const handleLogin = () => {
    onLoginSuccess && onLoginSuccess();
    window.location.href = '/login'; // or use your auth system
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to access this feature. Please log in to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleLogin} >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface DownloadConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  confirmLabel?: string;
}

export function DownloadConfirmationModal({
  open,
  onClose,
  onConfirm,
  confirmLabel = 'Agree & Download',
}: DownloadConfirmationModalProps) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (open) {
      setAgreed(false); // Reset agreed state every time popup opens
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>⚠️ Confirm Responsible Use</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            By continuing, you confirm that:
            <ul className="list-disc ml-5 mt-2">
              <li>This paystub is for personal or illustrative use only.</li>
              <li>It must not be used to falsify income, employment, or financial documents.</li>
              <li>Misuse of this tool may be illegal and is your sole responsibility.</li>
              <li>We disclaim all liability for any misuse.</li>
            </ul>
          </p>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked: boolean | 'indeterminate') => setAgreed(checked === true)}
            />
            <label htmlFor="agree" className="text-sm">
              I have read and agree to these terms.
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onConfirm} disabled={!agreed}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

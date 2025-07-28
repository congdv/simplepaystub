import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SendEmailDialog({ open, onClose, onSend }: {
  open: boolean;
  onClose: () => void;
  onSend: (recipientEmail: string | null, recipientName: string | null) => void
}) {
  const [mode, setMode] = useState<'self' | 'other'>('self');
  const [otherEmail, setOtherEmail] = useState('');
  const [otherName, setOtherName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getLoggedInUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || '')
    }
    getLoggedInUser();
  }, [])

  const handleSend = () => {
    if (mode === 'self') {
      onSend(null, null);
    } else {
      onSend(otherEmail, otherName);
    }
    onClose();
  };

  const showEmailError = mode === 'other' && touched && otherEmail && !isValidEmail(otherEmail);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Paystub PDF</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup value={mode} onValueChange={val => setMode(val as 'self' | 'other')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self" id="send-self" />
              <label htmlFor="send-self" className="cursor-pointer">
                Send to myself ({userEmail})
              </label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <RadioGroupItem value="other" id="send-other" />
              <label htmlFor="send-other" className="cursor-pointer">
                Send to someone else
              </label>
            </div>
          </RadioGroup>
          {mode === 'other' && (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Recipient's name"
                value={otherName}
                onChange={e => setOtherName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Recipient's email"
                value={otherEmail}
                onChange={e => {
                  setOtherEmail(e.target.value);
                  setTouched(true);
                }}
                required
              />
              {showEmailError && (
                <div className="text-red-500 text-xs mt-1">Please enter a valid email address.</div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSend}
            className='bg-blue-500 text-white hover:text-white hover:bg-blue-700'
            disabled={
              mode === 'other' && (
                !otherEmail ||
                !isValidEmail(otherEmail) ||
                !otherName
              )
            }
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
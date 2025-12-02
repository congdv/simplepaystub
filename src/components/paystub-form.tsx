'use client';

import { PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { usePaystub } from '@/contexts/paystub-context';
import { useToolbar } from '@/contexts/toolbar-context';
import { usePaystubActions } from '@/hooks/use-paystub-actions';
import { mockPayStub } from '@/lib/mock';
import { createClient } from '@/lib/supabase/client';
import { PayStubType } from '@/types';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DownloadConfirmationModal } from './download-confirmation-modal';
import { LoginDialog } from './login-dialog';
import PaystubFormContent, { PAYSTUB_STEPS } from './paystub-form-content';
import { PaystubFormHeader } from './paystub-form-header';
import { SendEmailDialog } from './send-email-dialog';
import { Form } from './ui/form';
import { Tabs } from './ui/tabs';

export const PaystubForm = () => {
  const supabase = createClient();
  const form = useFormContext<PayStubType>();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'download' | 'send' | null>(null);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);
  const [showSendEmailDialog, setShowSendEmailDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(PAYSTUB_STEPS[0].value);

  // Use toolbar context
  const { setLoadingState, setOnReset, setOnLoadSample, setOnDownload, setOnSave, setOnViewPaystub, setOnSendEmail } = useToolbar();
  const { savePaystub, getPaystub } = usePaystub();

  // Initialize actions
  const actions = usePaystubActions({
    form,
    supabase,
    setShowLoginDialog,
    setConfirmOpen,
    setConfirmAction,
    setFormData,
    setLoadingState,
    savePaystub,
    getPaystub,
    mockPayStub,
  });

  // Register actions with toolbar
  useEffect(() => {
    setOnReset(() => actions.reset.execute.bind(actions.reset));
    setOnLoadSample(() => actions.loadSample.execute.bind(actions.loadSample));
    setOnDownload(() => actions.download.execute.bind(actions.download));
    setOnSave(() => actions.save.execute.bind(actions.save));
    setOnViewPaystub((id: string) => actions.viewPaystub.execute.bind(actions.viewPaystub)(id));
    setOnSendEmail(() => actions.sendEmail.execute.bind(actions.sendEmail));
  }, [actions, setOnReset, setOnLoadSample, setOnDownload, setOnSave, setOnViewPaystub, setOnSendEmail]);

  return (
    <Form {...form}>
      <form onSubmit={(e) => { e.preventDefault(); actions.download.execute(); }}>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <PaystubFormHeader />

          <PaystubFormContent currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </Tabs>
        <DownloadConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            if (confirmAction === 'download') {
              actions.performDownload.execute(formData);
            } else if (confirmAction === 'send') {
              setShowSendEmailDialog(true);
            }
            setConfirmAction(null);
          }}
          confirmLabel={confirmAction === 'send' ? 'Agree & Send' : 'Agree & Download'}
        />
        <LoginDialog
          open={showLoginDialog}
          onClose={() => setShowLoginDialog(false)}
          onLoginSuccess={() => {
            setShowLoginDialog(false);
          }}
        />
        <SendEmailDialog
          open={showSendEmailDialog}
          onClose={() => setShowSendEmailDialog(false)}
          onSend={(email, name) => actions.actuallySendEmail.execute(email, name)}
        />
      </form>
    </Form >
  );
};

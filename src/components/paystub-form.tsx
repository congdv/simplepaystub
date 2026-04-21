'use client';

import { DEFAULT_PAYMENT_TYPE, PAY_STUB_FORM_DEFAULT_VALUES } from '@/constants';
import { usePaystub } from '@/contexts/paystub-context';
import { useToolbar } from '@/contexts/toolbar-context';
import { usePaystubActions } from '@/hooks/use-paystub-actions';
import { useCreditsContext } from '@/contexts/credits-context';
import { calculateAutoTax, TaxRow } from '@/lib/tax';
import { mockPayStub } from '@/lib/mock';
import { createClient } from '@/lib/supabase/client';
import { PayStubType } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { DownloadConfirmationModal } from './download-confirmation-modal';
import { LoginDialog } from './login-dialog';
import { UpgradeModal } from './upgrade-modal';
import PaystubFormContent, { PAYSTUB_STEPS } from './paystub-form-content';
import { PaystubFormHeader } from './paystub-form-header';
import { SendEmailDialog } from './send-email-dialog';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Form } from './ui/form';
import { Tabs } from './ui/tabs';

const AUTO_TAX_LABELS = new Set(['Social Security', 'Medicare', 'Additional Medicare', 'CPP', 'EI']);

export const PaystubForm = () => {
  const supabase = createClient();
  const form = useFormContext<PayStubType>();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'download' | 'send' | null>(null);
  const [formData, setFormData] = useState<PayStubType>(PAY_STUB_FORM_DEFAULT_VALUES);
  const [showSendEmailDialog, setShowSendEmailDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(PAYSTUB_STEPS[0].value);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState<string | undefined>();
  const [autoTaxDisclaimerOpen, setAutoTaxDisclaimerOpen] = useState(false);
  const [pendingAutoTaxRows, setPendingAutoTaxRows] = useState<TaxRow[] | null>(null);
  const [unsupportedGeoOpen, setUnsupportedGeoOpen] = useState(false);
  const [unsupportedGeoReason, setUnsupportedGeoReason] = useState('');

  const { balance, refresh: refreshCredits } = useCreditsContext();
  const { setLoadingState, setOnReset, setOnLoadSample, setOnDownload, setOnSave, setOnViewPaystub, setOnSendEmail, setOnAutoTax } = useToolbar();
  const { savePaystub, getPaystub } = usePaystub();

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

  const applyAutoTaxRows = useCallback((rows: TaxRow[]) => {
    const current = form.getValues('deductions');
    const filtered = current.filter((d: { label: string }) => !AUTO_TAX_LABELS.has(d.label));
    form.setValue('deductions', [...filtered, ...rows], { shouldDirty: true });
    toast.success('Payroll contributions added. Review and adjust as needed.');
  }, [form]);

  useEffect(() => {
    setOnReset(() => actions.reset.execute.bind(actions.reset));
    setOnLoadSample(() => actions.loadSample.execute.bind(actions.loadSample));
    setOnDownload(() => actions.download.execute.bind(actions.download));
    setOnSave(() => actions.save.execute.bind(actions.save));
    setOnViewPaystub(() => (id: string) => actions.viewPaystub.execute.bind(actions.viewPaystub)(id));
    setOnSendEmail(() => actions.sendEmail.execute.bind(actions.sendEmail));
    setOnAutoTax(() => () => {
      if (balance < 1) {
        setUpgradeFeatureName('Auto Tax');
        setUpgradeModalOpen(true);
        return;
      }
      const values = form.getValues();
      const country = values.payee.countryOrRegion ?? '';
      const province = values.payee.stateOrProvince ?? '';
      const gross =
        values.payment.type === DEFAULT_PAYMENT_TYPE
          ? Number(values.payment.hourlyRate) * Number(values.payment.numOfHours)
          : Number(values.payment.annualSalary);
      const frequency = values.payment.frequency;
      const result = calculateAutoTax({ country, province, gross, frequency });
      if (result.unsupportedReason === 'unsupported_province') {
        setUnsupportedGeoReason('Auto Tax does not currently support Quebec payroll.');
        setUnsupportedGeoOpen(true);
        return;
      }
      if (result.unsupportedReason === 'unsupported_country') {
        setUnsupportedGeoReason('Auto Tax is available for United States and Canada (excluding Quebec) payroll only.');
        setUnsupportedGeoOpen(true);
        return;
      }
      setPendingAutoTaxRows(result.rows);
      setAutoTaxDisclaimerOpen(true);
    });
  }, [actions, balance, refreshCredits, applyAutoTaxRows, setOnReset, setOnLoadSample, setOnDownload, setOnSave, setOnViewPaystub, setOnSendEmail, setOnAutoTax]);

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
          onLoginSuccess={() => setShowLoginDialog(false)}
        />
        <UpgradeModal
          open={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          featureName={upgradeFeatureName}
          balance={balance}
        />
        <SendEmailDialog
          open={showSendEmailDialog}
          onClose={() => setShowSendEmailDialog(false)}
          onSend={(email, name) => actions.actuallySendEmail.execute(email, name)}
        />
        <Dialog open={autoTaxDisclaimerOpen} onOpenChange={(v) => !v && setAutoTaxDisclaimerOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Auto Tax — 1 Credit</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    Auto Tax fills in payroll contributions using 2025 rates for US (Social Security,
                    Medicare) and Canada (CPP, EI, excluding Quebec).
                  </p>
                  <p>
                    These are <strong>estimates</strong> and may differ from your actual withholdings.
                    Wage-base caps are not applied. Always verify with your employer or a tax professional.
                  </p>
                  <p className="text-slate-500">
                    This action costs <strong>1 credit</strong>. You have <strong>{balance} credit{balance !== 1 ? 's' : ''}</strong> remaining.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={() => setAutoTaxDisclaimerOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={async () => {
                  setAutoTaxDisclaimerOpen(false);
                  const res = await fetch('/api/credits/deduct', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'auto_tax' }),
                  });
                  if (!res.ok) {
                    setUpgradeFeatureName('Auto Tax');
                    setUpgradeModalOpen(true);
                    return;
                  }
                  refreshCredits();
                  if (pendingAutoTaxRows) {
                    applyAutoTaxRows(pendingAutoTaxRows);
                    setPendingAutoTaxRows(null);
                  }
                }}
              >
                Use 1 credit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={unsupportedGeoOpen} onOpenChange={(v) => !v && setUnsupportedGeoOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Region Not Supported</DialogTitle>
              <DialogDescription>{unsupportedGeoReason}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-2">
              <Button variant="outline" onClick={() => setUnsupportedGeoOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

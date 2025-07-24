import { LOADING_STATES } from '@/constants';
import { useToolbar } from '@/contexts/toolbar-context';
import { DownloadCloud, FilePlus2, ListRestart, Loader2, Mail, Save } from 'lucide-react';
import { Button } from './ui/button';

export default function Toolbar() {
  const { onReset, onLoadSample, loadingState, onDownload, onSave, onSendEmail } = useToolbar();
  return (
    <div className="flex flex-row gap-2">
      <Button
        type="button"
        variant="outline"
        title="Load sample data"
        onClick={onLoadSample}
        className="items-center justify-center px-2 py-2"
        disabled={!!loadingState}
      >
        <FilePlus2 className="w-5 h-5" />
        <span>Sample Data</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Reset paystub"
        onClick={onReset}
        disabled={!!loadingState}
        className="items-center justify-center px-2 py-2"
      >
        <ListRestart className="w-5 h-5" />
        <span>Reset</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Reset paystub"
        onClick={onSave}
        disabled={!!loadingState}
        className="items-center justify-center px-2 py-2"
      >
        <Save className="w-5 h-5" />
        <span>Save</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Download paystub"
        className="items-center justify-center px-2 py-2"
        disabled={!!loadingState}
        onClick={onDownload}
      >
        {loadingState && loadingState === LOADING_STATES.DOWNLOADING ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <DownloadCloud className="w-5 h-5" />
            <span>Download PDF</span>
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Send PDF to email"
        onClick={onSendEmail}
        disabled={!!loadingState}
        className="items-center justify-center px-2 py-2"
      >
        {loadingState && loadingState === LOADING_STATES.SENDING_EMAIL ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            <span>Send PDF to Email</span>
          </>
        )}
      </Button>
    </div>
  );
}

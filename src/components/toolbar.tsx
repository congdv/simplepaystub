import { LOADING_STATES } from '@/constants';
import { useToolbar } from '@/contexts/toolbar-context';
import {
  DownloadCommand,
  LoadSampleCommand,
  ResetCommand,
  SaveCommand,
  SendEmailCommand,
} from '@/lib/commands/toolbar-commands';
import { DownloadCloud, FilePlus2, ListRestart, Loader2, Mail, Save } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from './ui/button';

export default function Toolbar() {
  const { onReset, onLoadSample, loadingState, onDownload, onSave, onSendEmail } = useToolbar();

  // Create command instances
  const commands = useMemo(() => {
    const isDisabled = !!loadingState;
    
    return {
      loadSample: new LoadSampleCommand(onLoadSample, isDisabled),
      reset: new ResetCommand(onReset, isDisabled),
      save: new SaveCommand(onSave, isDisabled),
      download: new DownloadCommand(onDownload, isDisabled),
      sendEmail: new SendEmailCommand(onSendEmail, isDisabled),
    };
  }, [onReset, onLoadSample, onDownload, onSave, onSendEmail, loadingState]);

  return (
    <div className="flex flex-row gap-2">
      <Button
        type="button"
        variant="outline"
        title="Load sample data"
        onClick={() => commands.loadSample.execute()}
        className="items-center justify-center px-2 py-2"
        disabled={!commands.loadSample.canExecute()}
      >
        <FilePlus2 className="w-5 h-5" />
        <span className="hidden lg:inline">Sample Data</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Reset paystub"
        onClick={() => commands.reset.execute()}
        disabled={!commands.reset.canExecute()}
        className="items-center justify-center px-2 py-2"
      >
        <ListRestart className="w-5 h-5" />
        <span className="hidden lg:inline">Reset</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Save paystub"
        onClick={() => commands.save.execute()}
        disabled={!commands.save.canExecute()}
        className="items-center justify-center px-2 py-2"
      >
        <Save className="w-5 h-5" />
        <span className="hidden lg:inline">Save</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Download paystub"
        className="items-center justify-center px-2 py-2"
        disabled={!commands.download.canExecute()}
        onClick={() => commands.download.execute()}
      >
        {loadingState && loadingState === LOADING_STATES.DOWNLOADING ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden lg:inline">Generating...</span>
          </>
        ) : (
          <>
            <DownloadCloud className="w-5 h-5" />
            <span className="hidden lg:inline">Download PDF</span>
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Send PDF to email"
        onClick={() => commands.sendEmail.execute()}
        disabled={!commands.sendEmail.canExecute()}
        className="items-center justify-center px-2 py-2"
      >
        {loadingState && loadingState === LOADING_STATES.SENDING_EMAIL ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden lg:inline">Sending...</span>
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            <span className="hidden lg:inline">Send PDF to Email</span>
          </>
        )}
      </Button>
    </div>
  );
}

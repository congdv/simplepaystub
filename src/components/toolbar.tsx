import { useToolbar } from '@/contexts/toolbar-context';
import {
  DownloadCommand,
  LoadSampleCommand,
  ResetCommand,
  SaveCommand,
  SendEmailCommand,
  Command,
} from '@/lib/commands/toolbar-commands';
import { TOOLBAR_BUTTONS, ToolbarButtonConfig } from '@/lib/commands/toolbar-config';
import { Loader2 } from 'lucide-react';
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

  const renderButton = (config: ToolbarButtonConfig) => {
    const command = commands[config.id as keyof typeof commands] as Command;
    const isLoading = config.loadingState && loadingState === config.loadingState;
    const Icon = config.icon;

    return (
      <Button
        key={config.id}
        type="button"
        variant="outline"
        title={config.title}
        onClick={() => command.execute()}
        disabled={!command.canExecute()}
        className="items-center justify-center px-2 py-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden lg:inline">{config.loadingLabel}</span>
          </>
        ) : (
          <>
            <Icon className="w-5 h-5" />
            <span className="hidden lg:inline">{config.label}</span>
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="flex flex-row gap-2">
      {TOOLBAR_BUTTONS.map(renderButton)}
    </div>
  );
}

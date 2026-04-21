import { useToolbar } from '@/contexts/toolbar-context';
import {
  DownloadCommand,
  LoadSampleCommand,
  ResetCommand,
  SaveCommand,
  SendEmailCommand,
  SimpleCommand,
  Command,
} from '@/lib/commands/toolbar-commands';
import { TOOLBAR_BUTTONS, ToolbarButtonConfig } from '@/lib/commands/toolbar-config';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from './ui/button';

const LEFT_BUTTONS = ['loadSample', 'reset', 'save'];
const RIGHT_BUTTONS = ['download', 'sendEmail'];
const PRO_BUTTONS = ['autoTax'];

export default function Toolbar() {
  const { onReset, onLoadSample, loadingState, onDownload, onSave, onSendEmail, onAutoTax } = useToolbar();

  const commands = useMemo(() => {
    const isDisabled = !!loadingState;
    return {
      loadSample: new LoadSampleCommand(onLoadSample, isDisabled),
      reset: new ResetCommand(onReset, isDisabled),
      save: new SaveCommand(onSave, isDisabled),
      download: new DownloadCommand(onDownload, isDisabled),
      sendEmail: new SendEmailCommand(onSendEmail, isDisabled),
      autoTax: new SimpleCommand(onAutoTax, isDisabled),
    };
  }, [onReset, onLoadSample, onDownload, onSave, onSendEmail, onAutoTax, loadingState]);

  const renderButton = (config: ToolbarButtonConfig) => {
    const command = commands[config.id as keyof typeof commands] as Command;
    const isLoading = config.loadingState && loadingState === config.loadingState;
    const Icon = config.icon;
    const isRight = RIGHT_BUTTONS.includes(config.id);
    const isPro = PRO_BUTTONS.includes(config.id);

    const rightStyles =
      config.id === 'download'
        ? 'bg-primary text-white hover:bg-primary/90 border-primary'
        : 'bg-slate-800 text-white hover:bg-slate-700 border-slate-800';

    return (
      <Button
        key={config.id}
        type="button"
        variant="outline"
        title={config.title}
        onClick={() => command.execute()}
        disabled={!command.canExecute()}
        className={cn(
          'inline-flex items-center px-3 py-2 text-sm font-medium relative',
          isRight
            ? rightStyles
            : isPro
              ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>{config.loadingLabel}</span>
          </>
        ) : (
          <>
            <Icon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{config.label}</span>
            {isPro && (
              <span className="ml-1.5 hidden sm:inline text-[10px] font-bold bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                PRO
              </span>
            )}
          </>
        )}
      </Button>
    );
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        {TOOLBAR_BUTTONS.filter((b) => LEFT_BUTTONS.includes(b.id)).map(renderButton)}
        {TOOLBAR_BUTTONS.filter((b) => PRO_BUTTONS.includes(b.id)).map(renderButton)}
      </div>
      <div className="flex flex-wrap gap-2">
        {TOOLBAR_BUTTONS.filter((b) => RIGHT_BUTTONS.includes(b.id)).map(renderButton)}
      </div>
    </div>
  );
}

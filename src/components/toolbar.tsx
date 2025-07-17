import { useToolbar } from '@/contexts/toolbar-context';
import { DownloadCloud, FilePlus2, ListRestart, Loader2, Save } from 'lucide-react';
import { Button } from './ui/button';

export default function Toolbar() {
  const { onReset, onLoadSample, isLoading, onDownload, onSave } = useToolbar();
  return (
    <div className="flex flex-row gap-2">
      <Button
        type="button"
        variant="outline"
        title="Load sample data"
        onClick={onLoadSample}
        className="items-center justify-center px-2 py-2"
        disabled={isLoading}
      >
        <FilePlus2 className="w-5 h-5" />
        <span>Sample Data</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        title="Reset paystub"
        onClick={onReset}
        disabled={isLoading}
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
        disabled={isLoading}
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
        disabled={isLoading}
        onClick={onDownload}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <DownloadCloud className="w-5 h-5" />
            <span>Download</span>
          </>
        )}
      </Button>
    </div>
  );
}

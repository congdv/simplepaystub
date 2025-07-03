import { DownloadCloud, FilePlus2, ListRestart, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface ToolbarProps {
  onReset: () => void;
  onLoadSample: () => void;
  isLoading: boolean;
}
export default function Toolbar({ onReset, onLoadSample, isLoading = false }: ToolbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-3 flex flex-col gap-2 items-center sm:flex-row sm:justify-center sm:gap-4 md:static md:border-0 md:p-0 md:flex-row md:justify-center md:bg-transparent">
      <Button
        type="button"
        variant="ghost"
        title="Load sample data"
        onClick={onLoadSample}
        className="flex-1 flex items-center justify-center gap-2 py-3 text-base md:flex-initial md:w-auto md:px-6 md:py-2"
        disabled={isLoading}
      >
        <FilePlus2 className="w-5 h-5" />
        <span>Sample Data</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        title="Reset pay stub"
        onClick={onReset}
        disabled={isLoading}
        className="flex-1 flex items-center justify-center gap-2 py-3 text-base md:flex-initial md:w-auto md:px-6 md:py-2"
      >
        <ListRestart className="w-5 h-5" />
        <span>Reset</span>
      </Button>
      <Button
        type="submit"
        variant="ghost"
        title="Download pay stub"
        className="flex-1 flex items-center justify-center gap-2 py-3 text-base md:flex-initial md:w-auto md:px-6 md:py-2"
        disabled={isLoading}
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

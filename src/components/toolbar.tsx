import { DownloadCloud, ListRestart } from "lucide-react";
import { Button } from "./ui/button";

interface ToolbarProps {
  onReset: () => void;
}
export default function Toolbar({ onReset }: ToolbarProps) {
  return (
    <div className="fixed bottom-4 z-50 left-1/2 transform -translate-x-1/2 bg-white  p-4 rounded-full shadow-lg">
      <Button type="button" variant={"ghost"} title="Reset pay stub" onClick={onReset}>
        <ListRestart />
        <span>Reset Pay Stub</span>
      </Button>
      <Button type="submit" variant={"ghost"} title="Download pay stub">
        <DownloadCloud />
        <span>Download Pay Stub</span>
      </Button>
    </div>
  );
}

import { DownloadCloud, PlusCircleIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function Toolbar() {
  return (
    <div className="fixed bottom-4 z-50 left-1/2 transform -translate-x-1/2 bg-white  p-4 rounded-full shadow-lg">
      <Button type="button" variant={"ghost"} title="New pay stub" disabled>
        <PlusCircleIcon />
        <span>New pay stub</span>
      </Button>
      <Button type="submit" variant={"ghost"} title="Download pay stub">
        <DownloadCloud />
        <span>Download pay stub</span>
      </Button>
    </div>
  );
}

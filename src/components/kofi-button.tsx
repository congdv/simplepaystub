'use client';

import { Coffee } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';

export const KofiButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#FF5E5B] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#e54e4b] focus:outline-none"
                aria-label="Support me on Ko-fi"
            >
                <Coffee size={18} />
                Support me
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 overflow-hidden max-w-[375px] w-full">
                    <iframe
                        src="https://ko-fi.com/simplepaystub?hidefeed=true&widget=true&embed=true"
                        title="Support me on Ko-fi"
                        className="w-full border-none"
                        style={{ height: '600px' }}
                    />
                    <div className="px-4 py-2 text-center text-xs text-gray-500">
                        <a
                            href="https://ko-fi.com/simplepaystub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            ko-fi.com/simplepaystub
                        </a>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

'use client';
import { useRef, useState, useEffect } from 'react';
import { Plus, Pencil, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import imageCompression from 'browser-image-compression';

interface LogoUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LogoUpload({ value, onChange, className }: LogoUploadProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const logoAreaRef = useRef<HTMLDivElement>(null);

  // Close hover state when clicking outside
  useEffect(() => {
    if (!hovered) return;
    const handleClick = (event: MouseEvent) => {
      if (logoAreaRef.current && !logoAreaRef.current.contains(event.target as Node)) {
        setHovered(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [hovered]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const options = {
        maxSizeMB: 0.05, // 50KB
        maxWidthOrHeight: 256,
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: 1,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
        onChange(dataUrl);
        setHovered(false);
      } catch (error) {
        // handle error
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />
      <div
        ref={logoAreaRef}
        className="relative w-40 h-40 flex items-center justify-center bg-gray-50 border rounded-lg cursor-pointer hover:bg-gray-100 transition group"
        onClick={() => logoInputRef.current?.click()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {loading ? (
          <Loader2 className="animate-spin text-gray-400 w-10 h-10" />
        ) : value ? (
          <>
            <img
              src={value}
              alt="Business Logo"
              className="object-contain w-full h-full rounded-lg"
            />
            {hovered && (
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-lg transition">
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  onClick={handleRemoveLogo}
                  tabIndex={-1}
                  type="button"
                >
                  <X className="w-5 h-5 text-red-500" />
                </Button>
                <Button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    logoInputRef.current?.click();
                  }}
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-12 bg-white rounded-full p-1 shadow hover:bg-blue-100"
                  type="button"
                >
                  <Pencil className="w-5 h-5 text-blue-500" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Plus className="w-8 h-8 mb-2" />
            <span className="text-base font-medium">Add Logo</span>
          </div>
        )}
      </div>
    </div>
  );
}

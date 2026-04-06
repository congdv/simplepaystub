import { cn } from '@/lib/utils';

interface ProBadgeProps {
  className?: string;
}

export function ProBadge({ className }: ProBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded',
        className
      )}
    >
      PRO
    </span>
  );
}

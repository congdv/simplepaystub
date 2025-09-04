'use client';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeedbackButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const CANNY_URL = 'https://simplepaystub.canny.io/';

export function FeedbackButton({
  variant = 'floating',
  className,
  children,
  showIcon = true,
  position = 'bottom-right'
}: FeedbackButtonProps) {
  const handleClick = () => {
    window.open(CANNY_URL, '_blank', 'noopener,noreferrer');
  };

  const getPositionClasses = () => {
    if (variant !== 'floating') return '';

    const positionMap = {
      'bottom-right': 'fixed bottom-6 right-6',
      'bottom-left': 'fixed bottom-6 left-6',
      'top-right': 'fixed top-6 right-6',
      'top-left': 'fixed top-6 left-6',
    };

    return positionMap[position];
  };

  if (variant === 'inline') {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        className={cn(
          "gap-2 transition-all duration-200 hover:scale-105",
          className
        )}
      >
        {showIcon && <MessageCircle className="h-4 w-4" />}
        {children || 'Give Feedback'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className={cn(
        "gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50",
        "bg-blue-600 hover:bg-blue-700 text-white rounded-full",
        getPositionClasses(),
        className
      )}
      aria-label="Give feedback"
    >
      {showIcon && <MessageCircle className="h-5 w-5" />}
      {children && <span className="hidden sm:inline">{children}</span>}
      {!children && <span className="hidden sm:inline">Feedback</span>}
    </Button>
  );
}

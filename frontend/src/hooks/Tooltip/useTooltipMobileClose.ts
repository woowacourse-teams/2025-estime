import { useEffect } from 'react';

interface UseTooltipLeaveProps {
  isMobile: boolean;
  handleTooltipLeave: () => void;
}

export default function useMobileTooltipClose({
  isMobile,
  handleTooltipLeave,
}: UseTooltipLeaveProps) {
  useEffect(() => {
    if (!isMobile) return;

    const handleDocumentClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-heatmap-cell]')) {
        handleTooltipLeave();
      }
    };

    document.addEventListener('pointerdown', handleDocumentClick);
    document.addEventListener('scroll', handleTooltipLeave, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handleDocumentClick);
      document.removeEventListener('scroll', handleTooltipLeave);
    };
  }, [isMobile, handleTooltipLeave]);
}

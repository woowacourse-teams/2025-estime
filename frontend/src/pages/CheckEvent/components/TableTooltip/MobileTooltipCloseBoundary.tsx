import React, { useEffect, useRef } from 'react';

interface MobileTooltipCloseBoundaryProps {
  isMobile: boolean;
  closeTooltip: () => void;
  children: React.ReactNode;
}

function MobileTooltipCloseBoundary({
  isMobile,
  closeTooltip,
  children,
}: MobileTooltipCloseBoundaryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMobile) return;

    const handleDocumentPointerDown = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const container = containerRef.current;
      if (!container) return;
      if (target && container.contains(target)) return;
      closeTooltip();
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('scroll', closeTooltip, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      document.removeEventListener('scroll', closeTooltip);
    };
  }, [isMobile, closeTooltip]);

  return <div ref={containerRef}>{children}</div>;
}

export default MobileTooltipCloseBoundary;

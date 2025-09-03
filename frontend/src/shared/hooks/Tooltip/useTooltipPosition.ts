import { useCallback, useState, useEffect, useRef } from 'react';
import { useTheme } from '@emotion/react';
import type { PointerEvent as ReactPointerEvent } from 'react';

const useTooltipPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const latestPosRef = useRef({ x: 0, y: 0 });
  const { isMobile } = useTheme();

  useEffect(() => {
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      latestPosRef.current = { x: e.clientX, y: e.clientY };

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setPosition(latestPosRef.current);
        rafId = null;
      });
    };

    if (!isMobile) {
      document.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = null;
    };
  }, [isMobile]);

  const initializePosition = useCallback((e: ReactPointerEvent) => {
    const p = { x: e.clientX, y: e.clientY };
    latestPosRef.current = p;
    setPosition(p);
  }, []);

  const onEnter = useCallback(
    (e: ReactPointerEvent) => {
      initializePosition(e);
    },
    [initializePosition]
  );
  const onMobileTap = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const p = { x: centerX, y: centerY };
    latestPosRef.current = p;
    setPosition(p);
  }, []);

  return {
    position,
    onEnter,
    onMobileTap,
  };
};

export default useTooltipPosition;

import { useCallback, useEffect, useRef, useState } from 'react';

const useEventDelegation = () => {
  const [currentCellId, setCurrentCellId] = useState<string | null>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef<number | null>(null);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const updateTooltipPosition = useCallback((x: number, y: number) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${x}px`;
      tooltipRef.current.style.top = `${y - 20}px`;
      tooltipRef.current.style.transform = 'translate(-50%, -100%)';
    }
  }, []);

  const handlePointerOver = useCallback(
    (e: PointerEvent) => {
      if (isMobile) return;

      const target = (e.target as HTMLElement).closest('[data-cell-id]') as HTMLElement | null;
      if (!target) return;
      const cellId = target.dataset.cellId;
      if (!cellId) return;

      setCurrentCellId(cellId);
      updateTooltipPosition(e.clientX, e.clientY);
    },
    [isMobile, updateTooltipPosition]
  );

  const handlePointerOut = useCallback(() => {
    if (isMobile) return;
    setCurrentCellId(null);
  }, [isMobile]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (isMobile) return;
      if (throttleRef.current) return;

      throttleRef.current = window.requestAnimationFrame(() => {
        updateTooltipPosition(e.clientX, e.clientY);
        throttleRef.current = null;
      });
    },
    [isMobile, updateTooltipPosition]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!isMobile) return; // 데스크탑 무시

      const target = (e.target as HTMLElement).closest('[data-cell-id]') as HTMLElement | null;
      if (!target) return;
      const cellId = target.dataset.cellId;
      if (!cellId) return;

      if (currentCellId === cellId) {
        setCurrentCellId(null);
        return;
      }

      setCurrentCellId(cellId);
      updateTooltipPosition(e.clientX, e.clientY);

      // 바깥 클릭하면 닫기
      const close = (event: PointerEvent) => {
        const el = containerRef.current;
        if (el && !el.contains(event.target as Node)) {
          setCurrentCellId(null);
          window.removeEventListener('pointerdown', close);
        }
      };
      window.addEventListener('pointerdown', close);
    },
    [isMobile, currentCellId, updateTooltipPosition]
  );
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('pointerover', handlePointerOver);
    container.addEventListener('pointerout', handlePointerOut);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);

    return () => {
      container.removeEventListener('pointerover', handlePointerOver);
      container.removeEventListener('pointerout', handlePointerOut);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);

      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handlePointerOver, handlePointerMove, handlePointerOut, handlePointerDown]);

  return {
    currentCellId,
    containerRef,
    tooltipRef,
  };
};

export default useEventDelegation;

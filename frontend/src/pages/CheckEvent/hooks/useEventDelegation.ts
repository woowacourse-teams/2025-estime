import { useCallback, useEffect, useRef, useState } from 'react';

const useEventDelegation = () => {
  const [currentCellId, setCurrentCellId] = useState<string | null>(null);
  // const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef<number | null>(null);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const updateTooltipPosition = useCallback((x: number, y: number) => {
    if (tooltipRef.current) {
      tooltipRef.current.style.transform = `translate(${x - 70}px, ${y - 140}px)`;
    }
  }, []);

  const handlePointerOver = useCallback(
    (e: PointerEvent) => {
      if (isMobile) return; // 모바일 무시

      const target = (e.target as HTMLElement).closest('[data-cell-id]') as HTMLElement | null;
      if (!target) return;
      const cellId = target.dataset.cellId;
      if (!cellId) return;

      setCurrentCellId(cellId);
      setIsVisible(true);
      updateTooltipPosition(e.clientX, e.clientY);
    },
    [isMobile, updateTooltipPosition]
  );

  const handlePointerOut = useCallback(() => {
    if (isMobile) return;
    setIsVisible(false);
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

      if (isVisible && currentCellId === cellId) {
        setIsVisible(false);
        setCurrentCellId(null);
        return;
      }

      setCurrentCellId(cellId);
      setIsVisible(true);
      updateTooltipPosition(e.clientX, e.clientY);

      // 바깥 클릭하면 닫기
      const close = (event: PointerEvent) => {
        const el = containerRef.current;
        if (el && !el.contains(event.target as Node)) {
          setIsVisible(false);
          setCurrentCellId(null);
          window.removeEventListener('pointerdown', close);
        }
      };
      window.addEventListener('pointerdown', close);
    },
    [isMobile, isVisible, currentCellId, updateTooltipPosition]
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
    isVisible,
    containerRef,
    tooltipRef,
  };
};

export default useEventDelegation;

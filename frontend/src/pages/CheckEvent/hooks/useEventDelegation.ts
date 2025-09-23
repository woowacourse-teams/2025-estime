import { useCallback, useEffect, useRef, useState } from 'react';

const useEventDelegation = () => {
  const [currentCellId, setCurrentCellId] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef<number | null>(null);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const cellId = target.dataset.cellId;
    if (!cellId) return;

    setCurrentCellId(cellId);
    setIsVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (throttleRef.current) return;

    throttleRef.current = window.setTimeout(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      throttleRef.current = null;
    }, 16); // 약 60fps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      container.removeEventListener('mousemove', handleMouseMove);

      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handleMouseOver, handleMouseMove, handleMouseOut]);

  return {
    currentCellId,
    position,
    isVisible,
    containerRef,
  };
};

export default useEventDelegation;

import { useCallback, useEffect, useRef, useState } from 'react';

const useEventDelegation = () => {
  const [currentCellId, setCurrentCellId] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef<number | null>(null);

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const handlePointerOver = useCallback(
    (e: PointerEvent) => {
      if (isTouchDevice) return; // 모바일 무시

      const target = e.target as HTMLElement;
      const cellId = target.dataset.cellId;
      if (!cellId) return;

      setCurrentCellId(cellId);
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    },
    [isTouchDevice]
  );

  const handlePointerOut = useCallback(() => {
    if (isTouchDevice) return;
    setIsVisible(false);
  }, [isTouchDevice]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (isTouchDevice) return;
      if (throttleRef.current) return;

      throttleRef.current = window.setTimeout(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        throttleRef.current = null;
      }, 16);
    },
    [isTouchDevice]
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!isTouchDevice) return; // 데스크탑 무시

      const target = e.target as HTMLElement;
      const cellId = target.dataset.cellId;
      if (!cellId) return;

      if (isVisible && currentCellId === cellId) {
        setIsVisible(false);
        setCurrentCellId(null);
        return;
      }

      setCurrentCellId(cellId);
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      // 바깥 클릭하면 닫기
      const close = (ev: PointerEvent) => {
        const el = containerRef.current;
        if (el && !el.contains(ev.target as Node)) {
          setIsVisible(false);
          setCurrentCellId(null);
          window.removeEventListener('pointerdown', close);
        }
      };
      window.addEventListener('pointerdown', close);
    },
    [isTouchDevice, isVisible, currentCellId]
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
    position,
    isVisible,
    containerRef,
  };
};

export default useEventDelegation;

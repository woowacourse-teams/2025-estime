import { useEffect, RefObject } from 'react';

const usePreventScroll = (containerRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prevent = (e: Event) => {
      // 드래그 중일 때만, cancelable일 때만 차단
      if (!container.classList.contains('dragging')) return;
      if (e.cancelable) e.preventDefault();
    };

    container.addEventListener('touchmove', prevent, { passive: false });

    return () => {
      container.removeEventListener('touchmove', prevent);
    };
  }, [containerRef]);
};

export default usePreventScroll;

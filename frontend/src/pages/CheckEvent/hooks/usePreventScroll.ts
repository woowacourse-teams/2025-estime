import { useEffect, RefObject } from 'react';

const usePreventScroll = (containerRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (!containerRef) return;
    const preventScroll = (e: TouchEvent) => {
      if (containerRef.current?.classList.contains('dragging')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [containerRef]);
};

export default usePreventScroll;

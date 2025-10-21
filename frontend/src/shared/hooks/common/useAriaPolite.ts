import { useCallback, useRef } from 'react';

const useAriaPolite = () => {
  const srDivRef = useRef<HTMLDivElement | null>(null);

  const announce = useCallback((message: string) => {
    const srDiv = srDivRef.current;

    if (!srDiv) return;

    srDiv.textContent = '';

    setTimeout(() => {
      if (srDivRef.current) {
        srDivRef.current.textContent = message;
      }
    }, 100);
  }, []);

  return { srDivRef, announce };
};

export default useAriaPolite;

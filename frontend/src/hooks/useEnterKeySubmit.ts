import { useEffect, useCallback } from 'react';

interface UseEnterKeySubmitOptions {
  callback?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function useEnterKeySubmit({ callback, buttonRef }: UseEnterKeySubmitOptions) {
  // input에서 쓰는 경우
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
        callback?.();
      }
    },
    [callback]
  );

  // 버튼 ref에서 쓰는 경우
  useEffect(() => {
    if (!buttonRef) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buttonRef]);

  return { handleInputKeyDown };
}

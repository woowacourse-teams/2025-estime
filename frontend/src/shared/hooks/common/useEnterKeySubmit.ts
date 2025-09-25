import { useEffect, useRef } from 'react';

interface UseEnterKeySubmitOptions {
  callback?: () => void | Promise<void>;
}

const useEnterKeySubmit = ({ callback }: UseEnterKeySubmitOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;

      e.preventDefault();

      if (document.activeElement === inputRef.current && !e.isComposing) {
        callbackRef.current?.();
      }

      buttonRef.current?.click();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { inputRef, buttonRef };
};

export default useEnterKeySubmit;

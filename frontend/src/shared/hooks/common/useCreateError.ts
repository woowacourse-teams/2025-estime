import * as Sentry from '@sentry/react';
import { useToastContext } from '@/shared/contexts/ToastContext';
import { useCallback } from 'react';

export type HandleErrorReturn = (error: unknown, context: string) => void;

const useHandleError = () => {
  const { addToast } = useToastContext();

  return useCallback(
    (error: unknown, context: string) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addToast({
        type: 'error',
        message: errorMessage,
      });
      Sentry.captureException(error, {
        level: 'error',
        tags: { context },
      });
    },
    [addToast]
  );
};

export default useHandleError;

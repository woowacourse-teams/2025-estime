import * as Sentry from '@sentry/react';
import { useToastContext } from '@/contexts/ToastContext';

export type HandleErrorReturn = (error: unknown, context: string) => void;
export default function useHandleError() {
  const { addToast } = useToastContext();

  return (error: unknown, context: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    addToast({
      type: 'error',
      message: errorMessage,
    });
    Sentry.captureException(error, {
      level: 'error',
      tags: { context },
    });
  };
}

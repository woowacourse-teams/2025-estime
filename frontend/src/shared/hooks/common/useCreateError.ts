import { showToast } from '@/shared/store/toastStore';
import * as Sentry from '@sentry/react';

export type HandleErrorReturn = (error: unknown, context: string) => void;

const useHandleError = () => {
  return (error: unknown, context: string) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    showToast({
      type: 'error',
      message: errorMessage,
    });
    Sentry.captureException(error, {
      level: 'error',
      tags: { context },
    });
  };
};

export default useHandleError;

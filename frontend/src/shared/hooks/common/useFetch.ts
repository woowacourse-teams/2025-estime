import { useCallback, useState } from 'react';
import useHandleError from './useCreateError';

const useFetch = <T>({
  context,
  requestFn,
}: {
  context: string;
  requestFn: () => Promise<T>;
}): { isLoading: boolean; triggerFetch: () => Promise<T> } => {
  const handleError = useHandleError();
  const [isLoading, setIsLoading] = useState(false);

  const triggerFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await requestFn();
      return response;
    } catch (err) {
      const e = err as Error;
      handleError(e, context);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [context, handleError, requestFn]);
  return { isLoading, triggerFetch };
};

export default useFetch;

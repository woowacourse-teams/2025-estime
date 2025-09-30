import { useState } from 'react';
import useHandleError from './useCreateError';

const useFetch = <T>({
  context,
  requestFn,
}: {
  context: string;
  requestFn: () => Promise<T>;
}): { isLoading: boolean; triggerFetch: () => Promise<T | undefined> } => {
  const handleError = useHandleError();
  const [isLoading, setIsLoading] = useState(false);

  const triggerFetch = async () => {
    try {
      setIsLoading(true);
      const response = await requestFn();
      return response;
    } catch (err) {
      const e = err as Error;
      handleError(e, context);
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, triggerFetch };
};

export default useFetch;

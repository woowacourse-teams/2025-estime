import { useState } from 'react';
import useHandleError from './useCreateError';

const useFetch = () => {
  const handleError = useHandleError();
  const [isLoading, setIsLoading] = useState(false);

  const runFetch = async <T>({
    context,
    requestFn,
  }: {
    context: string;
    requestFn: () => Promise<T>;
  }): Promise<T | undefined> => {
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
  return { isLoading, runFetch };
};

export default useFetch;

import { useLocation } from 'react-router';

export const useExtractQueryParam = (key: string): string | null => {
  const { search } = useLocation();
  return new URLSearchParams(search).get(key);
};

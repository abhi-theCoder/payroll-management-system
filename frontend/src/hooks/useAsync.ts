'use client';

import { useState, useCallback } from 'react';

interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options?: UseAsyncOptions
) => {
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      options?.onSuccess?.(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction, options]);

  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return { isLoading, error, data, execute };
};

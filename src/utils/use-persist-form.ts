import { useEffect, useCallback } from 'react';

export const usePersistForm = ({ value, localStorageKey, debounceMs = 500, onRestore }) => {
  // Restore data on mount
  useEffect(() => {
    if (onRestore) {
      try {
        const stored = localStorage.getItem(localStorageKey);
        if (stored) {
          const parsedData = JSON.parse(stored);
          onRestore(parsedData);
        }
      } catch (error) {
        console.warn(`Failed to restore data for ${localStorageKey}:`, error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist data with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
      } catch (error) {
        console.warn(`Failed to persist data for ${localStorageKey}:`, error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [value, localStorageKey, debounceMs]);

  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.warn(`Failed to clear data for ${localStorageKey}:`, error);
    }
  }, [localStorageKey]);

  return { clearPersistedData };
};

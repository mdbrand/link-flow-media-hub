import { useEffect, useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import debounce from 'lodash.debounce';

/**
 * Persists react-hook-form state to localStorage and restores it on mount.
 * @param form The form object from useForm().
 * @param storageKey A unique key for localStorage.
 * @param debounceMs Debounce time in milliseconds for saving state.
 */
export function usePersistentFormState<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  storageKey: string,
  debounceMs = 500
) {
  const { watch, reset, formState: { isSubmitSuccessful } } = form;
  const [isLoaded, setIsLoaded] = useState(false);

  // Debounced save function
  const saveState = useCallback(
    debounce((values: T) => {
      try {
        // console.log(`[usePersistentFormState] Saving state for ${storageKey}:`, values);
        localStorage.setItem(storageKey, JSON.stringify(values));
      } catch (error) {
        console.error(`[usePersistentFormState] Error saving state for ${storageKey}:`, error);
      }
    }, debounceMs),
    [storageKey, debounceMs]
  );

  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        console.log(`[usePersistentFormState] Found saved state for ${storageKey}, restoring...`);
        const parsedState = JSON.parse(savedState);
        // Use reset to populate the form with saved values
        reset(parsedState, { keepDefaultValues: false }); 
      } else {
         console.log(`[usePersistentFormState] No saved state found for ${storageKey}.`);
      }
    } catch (error) {
      console.error(`[usePersistentFormState] Error loading state for ${storageKey}:`, error);
    } finally {
      setIsLoaded(true); // Mark loading as complete
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, reset]); // Only run on mount and if key/reset changes

  // Watch form values and save changes
  useEffect(() => {
    // Only start saving *after* initial state is loaded/restored
    if (!isLoaded) return; 

    const subscription = watch((values) => {
      saveState(values as T);
    });
    return () => subscription.unsubscribe();
  }, [watch, saveState, isLoaded]);

  // Clear state from localStorage on successful submission
  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log(`[usePersistentFormState] Form ${storageKey} submitted successfully, clearing saved state.`);
      localStorage.removeItem(storageKey);
    }
  }, [isSubmitSuccessful, storageKey]);
} 
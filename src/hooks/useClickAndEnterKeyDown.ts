import { useCallback, KeyboardEvent } from 'react';

/**
 * Provides memoized functions that will activate onClick and on Enter Keydown.
 * @param callback The callback
 */
const useClickAndEnterKeyDown = (callback: () => void): [() => void, (event: KeyboardEvent<HTMLElement>) => void] => {
  const onClick = useCallback(callback, [callback]);
  const onEnter = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter') {
        callback();
      }
    },
    [callback]
  );

  return [onClick, onEnter];
};

export default useClickAndEnterKeyDown;

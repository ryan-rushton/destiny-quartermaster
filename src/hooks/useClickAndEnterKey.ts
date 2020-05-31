import { useCallback, KeyboardEvent } from 'react';

export const useClickAndEnterKey = (
    callback: () => void
): [() => void, (event: KeyboardEvent<HTMLElement>) => void] => {
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

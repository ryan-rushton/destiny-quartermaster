import { useEffect, MutableRefObject } from 'react';

const handleClick = (
    event: MouseEvent,
    ref: MutableRefObject<HTMLElement | null>,
    callback: () => void
): void => {
    if (ref.current && event.target instanceof Element && !ref.current.contains(event.target)) {
        callback();
    }
};

/**
 * This hook will detect clicks outside where the ref is not a parent of the clicked object.
 * It uses the `mousedown` event to ensure it runs before onClick events.
 *
 * @param ref React ref object.
 * @param enabled Whether the event should be listening. For example if a modal isn't open, you don't need this to be enabled.
 * @param callback The function to call when a click outside is detected.
 */
const useClickOutside = (
    ref: MutableRefObject<HTMLElement | null>,
    enabled: boolean,
    callback: () => void
): void => {
    useEffect(() => {
        if (enabled) {
            const eventHandler = (event: MouseEvent): void => handleClick(event, ref, callback);
            document.addEventListener('mousedown', eventHandler);
            return () => document.removeEventListener('mousedown', eventHandler);
        }
    }, [ref, enabled, callback]);
};

export default useClickOutside;

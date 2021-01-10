import { useEffect, MutableRefObject } from 'react';

const refocus = (
  event: KeyboardEvent,
  trapRef: MutableRefObject<HTMLElement | null>,
  refocusRef: MutableRefObject<HTMLElement | null>
) => {
  if (event.key === 'Tab' && !trapRef.current?.contains(document.activeElement)) {
    refocusRef.current?.focus();
  }
};

/**
 * This hook will trap the active element within a react element.
 *
 * @param trapRef The React ref to trap focus within
 * @param refocusRef The React ref to focus on if focus tries to leave trapRef.
 * @param enabled Whether this global event is currently enabled.
 */
const useFocusTrap = (
  trapRef: MutableRefObject<HTMLElement | null>,
  refocusRef: MutableRefObject<HTMLElement | null>,
  enabled: boolean
) => {
  useEffect(() => {
    if (enabled) {
      const handler = (event: KeyboardEvent) => refocus(event, trapRef, refocusRef);
      document.addEventListener('keydown', handler, true);

      return document.removeEventListener('keydown', handler);
    }
  }, [trapRef, refocusRef, enabled]);
};

export default useFocusTrap;

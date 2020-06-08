import { useEffect } from 'react';

const useGlobalEscKeyDown = (enabled: boolean, callback: () => void) => {
    useEffect(() => {
        if (enabled) {
            const handler = (event: KeyboardEvent) => {
                if (event.key === 'Escape') {
                    callback();
                }
            };

            document.addEventListener('keydown', handler);

            return () => document.removeEventListener('keydown', handler);
        }
    }, [enabled, callback]);
};

export default useGlobalEscKeyDown;

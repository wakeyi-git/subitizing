import { useState, useCallback, useRef } from 'react';

interface UseFlashTimerOptions {
  duration: number;
  onHide?: () => void;
}

export function useFlashTimer({ duration, onHide }: UseFlashTimerOptions) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((keepVisible = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(true);
    if (!keepVisible) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, duration);
    }
  }, [duration, onHide]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  return { isVisible, show, hide, toggle };
}

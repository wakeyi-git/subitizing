import { useEffect } from 'react';

interface KeyboardHandlers {
  onNext?: () => void;
  onPrevious?: () => void;
  onToggleAnswer?: () => void;
  onToggleFullscreen?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      switch (e.key) {
        case ' ':
        case 'ArrowRight':
          e.preventDefault();
          handlers.onNext?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onPrevious?.();
          break;
        case 'Enter':
          e.preventDefault();
          handlers.onToggleAnswer?.();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handlers.onToggleFullscreen?.();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

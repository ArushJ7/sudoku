import { GameSettings } from '../types/sudoku';

let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

/**
 * Applies the board theme (light, dark, system) and board contrast (gentle, high)
 * globally to document.documentElement using data-theme and data-contrast attributes.
 */
export function applyThemeAndContrast(settings: GameSettings): void {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.documentElement) return;

  const { boardTheme, boardContrast } = settings;

  // Clean up any existing media query listener
  if (mediaQueryListener) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    if (media.removeEventListener) {
      media.removeEventListener('change', mediaQueryListener);
    } else if ((media as any).removeListener) {
      (media as any).removeListener(mediaQueryListener);
    }
    mediaQueryListener = null;
  }

  let resolvedTheme: 'light' | 'dark' = 'light';

  if (boardTheme === 'dark') {
    resolvedTheme = 'dark';
  } else if (boardTheme === 'light') {
    resolvedTheme = 'light';
  } else if (boardTheme === 'system') {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    resolvedTheme = media.matches ? 'dark' : 'light';

    // React to OS theme changes dynamically while system is selected
    mediaQueryListener = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    if (media.addEventListener) {
      media.addEventListener('change', mediaQueryListener);
    } else if ((media as any).addListener) {
      (media as any).addListener(mediaQueryListener);
    }
  }

  document.documentElement.setAttribute('data-theme', resolvedTheme);
  document.documentElement.setAttribute('data-contrast', boardContrast || 'gentle');
}

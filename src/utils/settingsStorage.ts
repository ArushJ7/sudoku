import { GameSettings } from '../types/sudoku';
import { setSoundEnabled } from './soundEngine';
import { defaultSettings } from '../data/mockSudoku';
import { PROGRESS_KEY, ACTIVE_GAME_KEY, getDefaultPlayerProgress, savePlayerProgress } from './storage';
import { applyThemeAndContrast } from './theme';

export const SETTINGS_STORAGE_VERSION = 1;
export const SETTINGS_KEY = 'sudoku_settings';

export function loadGameSettings(): GameSettings {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      setSoundEnabled(defaultSettings.soundEffects);
      applyThemeAndContrast(defaultSettings);
      return defaultSettings;
    }
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      setSoundEnabled(defaultSettings.soundEffects);
      applyThemeAndContrast(defaultSettings);
      return defaultSettings;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      setSoundEnabled(defaultSettings.soundEffects);
      applyThemeAndContrast(defaultSettings);
      return defaultSettings;
    }
    const merged: GameSettings = {
      ...defaultSettings,
      ...parsed,
    };
    setSoundEnabled(merged.soundEffects);
    applyThemeAndContrast(merged);
    return merged;
  } catch (err) {
    console.warn('Failed to load game settings from localStorage:', err);
    setSoundEnabled(defaultSettings.soundEffects);
    applyThemeAndContrast(defaultSettings);
    return defaultSettings;
  }
}

export function saveGameSettings(settings: GameSettings): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      setSoundEnabled(settings.soundEffects);
      applyThemeAndContrast(settings);
      return false;
    }
    const payload = {
      ...settings,
      version: SETTINGS_STORAGE_VERSION,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    setSoundEnabled(settings.soundEffects);
    applyThemeAndContrast(settings);
    return true;
  } catch (err) {
    console.warn('Failed to save game settings to localStorage:', err);
    setSoundEnabled(settings.soundEffects);
    applyThemeAndContrast(settings);
    return false;
  }
}

/**
 * Resets player level progress, completed levels, best times, stars, active saved game, and achievements.
 * Does NOT reset user settings preferences (soundEffects, theme, boardContrast, accessibility options remain intact).
 */
export function resetProgressAndStats(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Clear player progress, active game, and achievements
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(ACTIVE_GAME_KEY);
      localStorage.removeItem('sudoku_achievements');

      // Re-save default player progress
      savePlayerProgress(getDefaultPlayerProgress());
    }
  } catch (err) {
    console.warn('Failed to reset progress and statistics:', err);
  }
}

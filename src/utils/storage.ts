import { SudokuCell } from '../types/sudoku';

export const STORAGE_VERSION = 1;

export const PROGRESS_KEY = 'sudoku_player_progress';
export const ACTIVE_GAME_KEY = 'sudoku_active_game';

export interface GameSnapshot {
  board: SudokuCell[][];
  hintsRemaining: number;
}

export interface PlayerProgress {
  version: number;
  unlockedLevel: number;
  completedLevels: number[];
  levelStars: Record<number, number>;
  bestTimes: Record<number, number>;
}

export interface SavedGameState {
  version: number;
  levelNumber: number;
  board: SudokuCell[][];
  timeSeconds: number;
  mistakes: number;
  hintsRemaining: number;
  hintsUsed: number;
  history: GameSnapshot[];
}

export function getDefaultPlayerProgress(): PlayerProgress {
  return {
    version: STORAGE_VERSION,
    unlockedLevel: 1,
    completedLevels: [],
    levelStars: {},
    bestTimes: {},
  };
}

/**
 * Safely load player progress from localStorage with fallback defaults.
 */
export function loadPlayerProgress(): PlayerProgress {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return getDefaultPlayerProgress();
    }
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return getDefaultPlayerProgress();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== STORAGE_VERSION) {
      return getDefaultPlayerProgress();
    }
    const unlockedLevel = typeof parsed.unlockedLevel === 'number' && parsed.unlockedLevel >= 1
      ? Math.min(50, parsed.unlockedLevel)
      : 1;
    const completedLevels = Array.isArray(parsed.completedLevels) ? parsed.completedLevels.filter((n: any) => typeof n === 'number') : [];
    const levelStars = parsed.levelStars && typeof parsed.levelStars === 'object' ? parsed.levelStars : {};
    const bestTimes = parsed.bestTimes && typeof parsed.bestTimes === 'object' ? parsed.bestTimes : {};

    return {
      version: STORAGE_VERSION,
      unlockedLevel,
      completedLevels,
      levelStars,
      bestTimes,
    };
  } catch (err) {
    console.warn('Failed to load player progress from localStorage:', err);
    return getDefaultPlayerProgress();
  }
}

/**
 * Safely save player progress to localStorage.
 */
export function savePlayerProgress(progress: PlayerProgress): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const payload: PlayerProgress = {
      ...progress,
      version: STORAGE_VERSION,
      unlockedLevel: Math.min(50, Math.max(1, progress.unlockedLevel)),
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('Failed to save player progress to localStorage:', err);
    return false;
  }
}

/**
 * Record a level completion event:
 * - Adds to completedLevels without duplicates
 * - Unlocks sequential next level ONLY if levelNumber === current.unlockedLevel (capped at 50)
 * - Records best completion time if faster
 * - Records star rating if higher (never downgrades)
 */
export function recordLevelCompletion(levelNumber: number, timeSeconds: number, stars: number): PlayerProgress {
  const current = loadPlayerProgress();
  
  // Guard against completing locked levels out of order
  if (levelNumber > current.unlockedLevel) {
    return current;
  }

  // Add to completedLevels if not present
  const completedLevels = current.completedLevels.includes(levelNumber)
    ? current.completedLevels
    : [...current.completedLevels, levelNumber];

  // Defensive sequential level unlock: completing active level N unlocks N+1
  const nextUnlocked = levelNumber === current.unlockedLevel
    ? Math.min(50, levelNumber + 1)
    : current.unlockedLevel;

  // Best time
  const existingBestTime = current.bestTimes[levelNumber];
  const bestTimes = { ...current.bestTimes };
  if (existingBestTime === undefined || timeSeconds < existingBestTime) {
    bestTimes[levelNumber] = timeSeconds;
  }

  // Star rating (never downgrade)
  const existingStars = current.levelStars[levelNumber];
  const levelStars = { ...current.levelStars };
  if (existingStars === undefined || stars > existingStars) {
    levelStars[levelNumber] = stars;
  }

  const updated: PlayerProgress = {
    version: STORAGE_VERSION,
    unlockedLevel: nextUnlocked,
    completedLevels,
    levelStars,
    bestTimes,
  };

  savePlayerProgress(updated);
  return updated;
}

/**
 * Safely load active saved game from localStorage.
 */
export function loadActiveGame(): SavedGameState | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = localStorage.getItem(ACTIVE_GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== STORAGE_VERSION) {
      return null;
    }
    if (typeof parsed.levelNumber !== 'number' || !Array.isArray(parsed.board)) {
      return null;
    }
    return {
      version: STORAGE_VERSION,
      levelNumber: parsed.levelNumber,
      board: parsed.board,
      timeSeconds: typeof parsed.timeSeconds === 'number' ? parsed.timeSeconds : 0,
      mistakes: typeof parsed.mistakes === 'number' ? parsed.mistakes : 0,
      hintsRemaining: typeof parsed.hintsRemaining === 'number' ? parsed.hintsRemaining : 3,
      hintsUsed: typeof parsed.hintsUsed === 'number' ? parsed.hintsUsed : 0,
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch (err) {
    console.warn('Failed to load active game state:', err);
    return null;
  }
}

/**
 * Safely save active game session.
 */
export function saveActiveGame(state: Omit<SavedGameState, 'version'>): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const payload: SavedGameState = {
      ...state,
      version: STORAGE_VERSION,
    };
    localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('Failed to save active game state:', err);
    return false;
  }
}

/**
 * Clear current active game session.
 */
export function clearActiveGame(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(ACTIVE_GAME_KEY);
    }
  } catch (err) {
    console.warn('Failed to clear active game state:', err);
  }
}

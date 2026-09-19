import { AchievementItem } from '../types/sudoku';
import { PlayerProgress } from './storage';

export const ACHIEVEMENTS_STORAGE_VERSION = 1;
export const ACHIEVEMENTS_KEY = 'sudoku_achievements';

export interface LevelWinStats {
  levelNumber: number;
  timeSeconds: number;
  mistakes: number;
  hintsUsed: number;
}

export const BASE_ACHIEVEMENTS: Omit<AchievementItem, 'unlocked' | 'unlockedDate' | 'currentValue'>[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete Level 1 of your Sudoku journey.',
    category: 'progress',
    targetValue: '1',
    iconName: 'CheckCircle2',
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Complete 5 unique Sudoku levels.',
    category: 'progress',
    targetValue: '5',
    iconName: 'Award',
  },
  {
    id: 'flawless',
    title: 'Flawless',
    description: 'Complete any level with zero mistakes.',
    category: 'mastery',
    targetValue: '0',
    iconName: 'Sparkles',
  },
  {
    id: 'no-help-needed',
    title: 'No Help Needed',
    description: 'Complete any level without using any hints.',
    category: 'mastery',
    targetValue: '0',
    iconName: 'CheckCircle2',
  },
  {
    id: 'speed-solver',
    title: 'Speed Solver',
    description: 'Complete any level in less than 3 minutes (180s).',
    category: 'zen',
    targetValue: '03:00',
    iconName: 'Clock',
  },
  {
    id: 'halfway-there',
    title: 'Halfway There',
    description: 'Complete 25 unique Sudoku levels.',
    category: 'progress',
    targetValue: '25',
    iconName: 'Award',
  },
  {
    id: 'sudoku-master',
    title: 'Sudoku Master',
    description: 'Complete all 50 handcrafted Sudoku levels.',
    category: 'mastery',
    targetValue: '50',
    iconName: 'Sparkles',
  },
];

/**
 * Safely load unlocked achievement IDs from localStorage.
 */
export function loadUnlockedAchievementIds(): Set<string> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return new Set();
    }
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.version !== ACHIEVEMENTS_STORAGE_VERSION) {
      return new Set();
    }
    if (Array.isArray(parsed.unlockedIds)) {
      return new Set(parsed.unlockedIds.filter((id: any) => typeof id === 'string'));
    }
    return new Set();
  } catch (err) {
    console.warn('Failed to load achievements from localStorage:', err);
    return new Set();
  }
}

/**
 * Safely save unlocked achievement IDs to localStorage.
 */
export function saveUnlockedAchievementIds(unlockedIds: Set<string> | string[]): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const idsArray = Array.from(unlockedIds);
    const payload = {
      version: ACHIEVEMENTS_STORAGE_VERSION,
      unlockedIds: idsArray,
    };
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('Failed to save achievements to localStorage:', err);
    return false;
  }
}

/**
 * Evaluate achievements against updated player progress and win statistics.
 * Unlocking is idempotent and persists newly unlocked achievement badges.
 */
export function evaluateAchievements(
  progress: PlayerProgress,
  winStats?: LevelWinStats
): AchievementItem[] {
  const unlockedSet = loadUnlockedAchievementIds();
  const newlyUnlocked = new Set(unlockedSet);

  const totalCompleted = progress.completedLevels.length;

  // 1. First Step: Complete Level 1
  if (progress.completedLevels.includes(1)) {
    newlyUnlocked.add('first-step');
  }

  // 2. Getting Started: Complete 5 unique levels
  if (totalCompleted >= 5) {
    newlyUnlocked.add('getting-started');
  }

  // 3. Halfway There: Complete 25 unique levels
  if (totalCompleted >= 25) {
    newlyUnlocked.add('halfway-there');
  }

  // 4. Sudoku Master: Complete all 50 levels
  if (totalCompleted >= 50) {
    newlyUnlocked.add('sudoku-master');
  }

  // Evaluated on winStats if provided
  if (winStats) {
    // 5. Flawless: Complete any level with 0 mistakes
    if (winStats.mistakes === 0) {
      newlyUnlocked.add('flawless');
    }

    // 6. No Help Needed: Complete any level without using hints
    if (winStats.hintsUsed === 0) {
      newlyUnlocked.add('no-help-needed');
    }

    // 7. Speed Solver: Complete any level in LESS THAN 180 seconds (< 180)
    if (winStats.timeSeconds < 180) {
      newlyUnlocked.add('speed-solver');
    }
  }

  // Persist if new achievements unlocked
  if (newlyUnlocked.size > unlockedSet.size) {
    saveUnlockedAchievementIds(newlyUnlocked);
  }

  // Map to strongly typed AchievementItem list
  return BASE_ACHIEVEMENTS.map((base) => {
    const isUnlocked = newlyUnlocked.has(base.id);

    let currentValue: string | undefined = undefined;
    if (base.id === 'getting-started') {
      currentValue = `${Math.min(5, totalCompleted)}`;
    } else if (base.id === 'halfway-there') {
      currentValue = `${Math.min(25, totalCompleted)}`;
    } else if (base.id === 'sudoku-master') {
      currentValue = `${Math.min(50, totalCompleted)}`;
    }

    return {
      ...base,
      unlocked: isUnlocked,
      unlockedDate: isUnlocked ? 'Unlocked' : undefined,
      currentValue,
    };
  });
}

/**
 * Load list of all achievements with current unlocked status.
 */
export function loadAchievements(progress?: PlayerProgress): AchievementItem[] {
  const currentProgress = progress || {
    version: 1,
    unlockedLevel: 1,
    completedLevels: [],
    levelStars: {},
    bestTimes: {},
  };
  return evaluateAchievements(currentProgress);
}

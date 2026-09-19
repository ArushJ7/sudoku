import { AchievementItem, GameSettings, LevelItem, SudokuCell } from '../types/sudoku';
import { getLevelByNumber, SUDOKU_LEVELS } from './sudokuLevels';

// 9x9 Board configuration created dynamically from Level seed database
export const createInitialBoard = (levelNum: number = 17): SudokuCell[][] => {
  const seed = getLevelByNumber(levelNum);
  return seed.initialBoard.map((rowCells, rIdx) =>
    rowCells.map((val, cIdx) => {
      // Level 17 special initial error state from prototype
      const isErrorCell = levelNum === 17 && rIdx === 1 && cIdx === 6 && val === 8;
      const isNotesCell = levelNum === 17 && rIdx === 4 && cIdx === 1;

      return {
        row: rIdx,
        col: cIdx,
        value: isErrorCell ? 8 : val,
        isGiven: val !== null && !isErrorCell,
        isUserEntered: isErrorCell,
        isError: isErrorCell,
        isConflict: isErrorCell,
        notes: isNotesCell ? [2, 7] : undefined,
      };
    })
  );
};

export const initialMockBoard: SudokuCell[][] = createInitialBoard(17);

// Digits remaining count exactly as in Game Screen:
// 1 (2 left), 2 (3 left), 3 (4 left), 4 (2 left), 5 (1 left), 6 (3 left), 7 (2 left), 8 (2 left), 9 (1 left)
export const mockNumberCounts: Record<number, number> = {
  1: 2,
  2: 3,
  3: 4,
  4: 2,
  5: 1,
  6: 3,
  7: 2,
  8: 2,
  9: 1,
};

// 50 Handcrafted Levels matching the screenshot categorization
export const mockLevels: LevelItem[] = Array.from({ length: 50 }, (_, i) => {
  const levelNum = i + 1;
  let difficulty: LevelItem['difficulty'] = 'easy';
  if (levelNum > 10 && levelNum <= 20) difficulty = 'medium';
  else if (levelNum > 20 && levelNum <= 30) difficulty = 'hard';
  else if (levelNum > 30 && levelNum <= 40) difficulty = 'expert';
  else if (levelNum > 40) difficulty = 'master';

  // 1-10 complete (Easy 10/10)
  // 11-16 complete (Medium 6)
  // 17 in progress (active)
  // 18-20 unlocked
  // 21-50 locked
  const isCompleted = levelNum <= 16;
  const isLocked = levelNum > 20;

  return {
    id: levelNum,
    levelNumber: levelNum,
    difficulty,
    isCompleted,
    isLocked,
    stars: isCompleted ? 3 : 0,
    bestTime: isCompleted ? '04:32' : undefined,
  };
});

// Achievements exact matches to the Stitch screenshot:
// 4 OF 7 UNLOCKED (57% Completed)
export const mockAchievements: AchievementItem[] = [
  {
    id: 'first-step',
    title: 'FIRST STEP',
    description: 'Complete Level 1',
    unlockedDate: 'Awarded Jan 14',
    unlocked: true,
    iconName: 'CheckCircle2',
  },
  {
    id: 'getting-started',
    title: 'GETTING STARTED',
    description: 'Complete 5 levels',
    unlockedDate: 'Awarded Jan 18',
    unlocked: true,
    iconName: 'CheckCircle2',
  },
  {
    id: 'flawless',
    title: 'FLAWLESS',
    description: 'Complete a level with zero mistakes',
    unlockedDate: 'Awarded Level 09',
    unlocked: true,
    iconName: 'CheckCircle2',
  },
  {
    id: 'no-help-needed',
    title: 'NO HELP NEEDED',
    description: 'Complete a level without hints',
    unlockedDate: 'Awarded Level 12',
    unlocked: true,
    iconName: 'CheckCircle2',
  },
  {
    id: 'speed-solver',
    title: 'SPEED SOLVER',
    description: 'Complete a level under 3 minutes',
    currentValue: '03:14',
    targetValue: '03:00',
    unlocked: false,
    iconName: 'Lock',
  },
  {
    id: 'halfway-there',
    title: 'HALFWAY THERE',
    description: 'Complete Level 25',
    currentValue: '17',
    targetValue: '25',
    unlocked: false,
    iconName: 'Lock',
  },
  {
    id: 'sudoku-master',
    title: 'SUDOKU MASTER',
    description: 'Complete all 50 levels',
    currentValue: '17',
    targetValue: '50',
    unlocked: false,
    iconName: 'Lock',
  },
];

// Default settings exact matches to the Stitch screenshot
export const defaultSettings: GameSettings = {
  boardTheme: 'light',
  boardContrast: 'gentle',
  typography: 'outfit',
  highlightRelated: true,
  highlightSameNumbers: true,
  showMistakesImmediately: true,
  autoClearNotes: true,
  hideUsedNumbers: false,
  soundEffects: true,
  hapticFeedback: true,
  highContrastGrid: false,
  reducedMotion: true,
  largeNumberMode: false,
  // legacy aliases
  soundEnabled: true,
  ambientMusic: false,
  highlightDuplicates: true,
  autoRemoveNotes: true,
  showTimer: true,
  mistakeLimit: true,
  theme: 'olive-light',
};

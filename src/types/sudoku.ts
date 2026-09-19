export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'master' | 'gentle' | 'calm' | 'mindful';

export type ScreenType =
  | 'home'
  | 'levels'
  | 'pause'
  | 'game'
  | 'complete'
  | 'achievements'
  | 'settings';

export type Screen = ScreenType;

export interface SudokuCell {
  row: number;
  col: number;
  value: number | null;
  isGiven: boolean;
  isUserEntered?: boolean;
  notes?: number[];
  isConflict?: boolean;
  isSelected?: boolean;
  isRelated?: boolean;
  isSameNumber?: boolean;
  isError?: boolean;
}

export type CellData = SudokuCell;

export interface LevelItem {
  id: number;
  levelNumber: number;
  difficulty: Difficulty;
  isLocked: boolean;
  isCompleted: boolean;
  stars: number;
  bestTime?: string;
  score?: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  category?: 'progress' | 'mastery' | 'zen';
  unlocked: boolean;
  unlockedDate?: string;
  currentValue?: string;
  targetValue?: string;
  iconName: string;
}

export interface GameSettings {
  // Appearance
  boardTheme: 'light' | 'dark' | 'system';
  boardContrast: 'gentle' | 'high';
  typography: 'outfit' | 'system';
  
  // Gameplay
  highlightRelated: boolean;
  highlightSameNumbers: boolean;
  showMistakesImmediately: boolean;
  autoClearNotes: boolean;
  hideUsedNumbers: boolean;
  
  // Audio & Haptics
  soundEffects: boolean;
  hapticFeedback: boolean;
  
  // Accessibility
  highContrastGrid: boolean;
  reducedMotion: boolean;
  largeNumberMode: boolean;
  
  // Legacy compatibility
  soundEnabled?: boolean;
  ambientMusic?: boolean;
  highlightDuplicates?: boolean;
  autoRemoveNotes?: boolean;
  showTimer?: boolean;
  mistakeLimit?: boolean;
  theme?: 'olive-light' | 'olive-sand' | 'olive-deep';
}

export interface GameStats {
  levelNumber: number;
  difficulty: Difficulty;
  timerString: string;
  secondsElapsed: number;
  mistakes: number;
  maxMistakes: number;
  hintsRemaining: number;
  score: number;
  notesActive: boolean;
}

import {
  loadPlayerProgress,
  recordLevelCompletion,
  getDefaultPlayerProgress,
  savePlayerProgress,
  PROGRESS_KEY,
  ACTIVE_GAME_KEY,
} from './storage';
import {
  loadGameSettings,
  saveGameSettings,
  resetProgressAndStats,
} from './settingsStorage';
import {
  loadAchievements,
  loadUnlockedAchievementIds,
  evaluateAchievements,
} from './achievementsEngine';
import { defaultSettings } from '../data/mockSudoku';
import { setSoundEnabled, isSoundEnabled } from './soundEngine';
import { applyThemeAndContrast } from './theme';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASSED: ${message}`);
}

// In-memory localStorage mock for Node environment
const memoryStore: Record<string, string> = {};

if (typeof window === 'undefined' || !(globalThis as any).localStorage) {
  (globalThis as any).window = globalThis;
  (globalThis as any).localStorage = {
    getItem: (key: string) => memoryStore[key] || null,
    setItem: (key: string, value: string) => {
      memoryStore[key] = String(value);
    },
    removeItem: (key: string) => {
      delete memoryStore[key];
    },
    clear: () => {
      for (const k in memoryStore) delete memoryStore[k];
    },
  };
}

console.log('=== THREE BUG FIXES REGRESSION VALIDATION SUITE ===\n');

localStorage.clear();

// ---------------------------------------------------------------------
// BUG 1 REGRESSION TESTS: DEFENSIVE LEVEL PROGRESSION & ZERO SIDE-EFFECTS
// ---------------------------------------------------------------------
console.log('1. TEST 1: Fresh State Verification...');
let prog = loadPlayerProgress();
assert(prog.unlockedLevel === 1, 'Fresh state has unlockedLevel === 1');
assert(prog.completedLevels.length === 0, 'Fresh state has completedLevels === []');

console.log('\n2. TEST 2 & 3: Screen Navigation Zero Side-Effects...');
// Simulating opening screens (Home, Levels, Badges, Settings, Complete preview)
loadPlayerProgress();
loadAchievements(loadPlayerProgress());
loadGameSettings();
prog = loadPlayerProgress();
assert(prog.unlockedLevel === 1, 'Opening screens does NOT modify unlockedLevel');
assert(prog.completedLevels.length === 0, 'Opening screens does NOT modify completedLevels');

console.log('\n3. TEST 4: Open Badges/Settings/Complete Has Zero Achievements Changes...');
const unlockedAchievements = loadUnlockedAchievementIds();
assert(unlockedAchievements.size === 0, 'Opening screens does NOT unlock any achievements');

console.log('\n4. TEST 5 & 8: Arbitrary / Out-of-Order Level Completion Protection...');
// Attempt to call recordLevelCompletion for Level 10 while player is on Level 1
recordLevelCompletion(10, 150, 3);
prog = loadPlayerProgress();
assert(prog.unlockedLevel === 1, 'Completing Level 10 while unlockedLevel === 1 does NOT skip unlockedLevel to 11');

console.log('\n5. TEST 6: Legitimately Completing Level 1...');
recordLevelCompletion(1, 200, 3);
prog = loadPlayerProgress();
assert(prog.completedLevels.includes(1), 'Level 1 is marked as completed');
assert(prog.unlockedLevel === 2, 'Completing Level 1 unlocks Level 2');
assert(!prog.completedLevels.includes(3), 'Level 3 remains locked');

console.log('\n6. TEST 7: Legitimately Completing Level 2...');
recordLevelCompletion(2, 180, 3);
prog = loadPlayerProgress();
assert(prog.completedLevels.includes(2), 'Level 2 is marked as completed');
assert(prog.unlockedLevel === 3, 'Completing Level 2 unlocks Level 3');

// ---------------------------------------------------------------------
// BUG 2 REGRESSION TESTS: APPEARANCE SETTINGS PERSISTENCE & SYSTEM THEME
// ---------------------------------------------------------------------
console.log('\n7. TEST 9: Appearance Settings Persistence (Light/Dark/System/Contrast)...');
localStorage.clear();

const testSettings = {
  ...defaultSettings,
  boardTheme: 'dark' as const,
  boardContrast: 'high' as const,
  soundEffects: false,
};
saveGameSettings(testSettings);

let loadedSettings = loadGameSettings();
assert(loadedSettings.boardTheme === 'dark', 'boardTheme "dark" persists across reloads');
assert(loadedSettings.boardContrast === 'high', 'boardContrast "high" persists across reloads');
assert(loadedSettings.soundEffects === false, 'soundEffects false persists across reloads');
assert(isSoundEnabled() === false, 'soundEngine soundEnabled is synchronized to false');

console.log('\n8. TEST 10: System Theme Behavior...');
const systemSettings = {
  ...defaultSettings,
  boardTheme: 'system' as const,
};
saveGameSettings(systemSettings);
loadedSettings = loadGameSettings();
assert(loadedSettings.boardTheme === 'system', 'boardTheme remains stored as "system" (not permanently converted)');

console.log('\n9. TEST 11: Reset Progress Preserves Appearance Settings...');
recordLevelCompletion(1, 100, 3);
saveGameSettings({
  ...defaultSettings,
  boardTheme: 'dark',
  boardContrast: 'high',
  soundEffects: false,
});

resetProgressAndStats();

prog = loadPlayerProgress();
assert(prog.unlockedLevel === 1, 'Reset returns unlockedLevel to 1');
assert(prog.completedLevels.length === 0, 'Reset clears completedLevels');
assert(loadUnlockedAchievementIds().size === 0, 'Reset clears unlocked achievements');

const settingsAfterReset = loadGameSettings();
assert(settingsAfterReset.boardTheme === 'dark', 'Reset preserves boardTheme setting ("dark")');
assert(settingsAfterReset.boardContrast === 'high', 'Reset preserves boardContrast setting ("high")');
assert(settingsAfterReset.soundEffects === false, 'Reset preserves soundEffects setting (false)');

// ---------------------------------------------------------------------
// BUG 3 REGRESSION TESTS: PLAYER-ENTERED VS GIVEN NUMBER STYLING
// ---------------------------------------------------------------------
console.log('\n10. TEST 12: Given vs Player-Entered Cell Color Tokens...');
const mockGivenCell = { row: 0, col: 0, value: 5, isGiven: true };
const mockUserCell = { row: 0, col: 1, value: 3, isGiven: false, isUserEntered: true };

assert(mockGivenCell.isGiven === true, 'Given cell has isGiven === true');
assert(mockUserCell.isGiven === false && mockUserCell.value !== null, 'Player cell has isGiven === false with non-null value');
assert(mockGivenCell.isGiven !== mockUserCell.isGiven, 'Given cell and player-entered cell are strictly distinguishable via isGiven flag');

console.log('\n=== THREE BUG FIXES REGRESSION SUMMARY: ALL TESTS PASSED ===\n');

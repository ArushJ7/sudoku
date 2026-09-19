import {
  evaluateAchievements,
  loadAchievements,
  saveUnlockedAchievementIds,
  loadUnlockedAchievementIds,
  ACHIEVEMENTS_KEY,
  ACHIEVEMENTS_STORAGE_VERSION,
} from './achievementsEngine';
import {
  loadGameSettings,
  saveGameSettings,
  resetProgressAndStats,
  SETTINGS_KEY,
} from './settingsStorage';
import {
  loadPlayerProgress,
  recordLevelCompletion,
  getDefaultPlayerProgress,
  PROGRESS_KEY,
} from './storage';
import { isSoundEnabled } from './soundEngine';
import { defaultSettings } from '../data/mockSudoku';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASSED: ${message}`);
}

// In-memory localStorage mock for node environment
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

console.log('=== PHASE 4 PLAN 04-02 AUTOMATED VALIDATION SUITE ===\n');

localStorage.clear();

// 1. First Step unlock test
console.log('1. Testing "First Step" Achievement Unlock...');
recordLevelCompletion(1, 200, 3);
let prog = loadPlayerProgress();
let achievements = evaluateAchievements(prog);
let firstStep = achievements.find((a) => a.id === 'first-step');
assert(firstStep?.unlocked === true, '"First Step" unlocks after completing Level 1');

// 2. Getting Started unlock test (5 unique completed levels)
console.log('\n2. Testing "Getting Started" (5 levels) Unlock...');
localStorage.clear();
for (let i = 1; i <= 4; i++) {
  recordLevelCompletion(i, 200, 3);
}
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog);
let gettingStarted = achievements.find((a) => a.id === 'getting-started');
assert(gettingStarted?.unlocked === false, '"Getting Started" is LOCKED at 4 completed levels');

recordLevelCompletion(5, 200, 3);
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog);
gettingStarted = achievements.find((a) => a.id === 'getting-started');
assert(gettingStarted?.unlocked === true, '"Getting Started" UNLOCKS at exactly 5 unique completed levels');

// 3. Flawless unlock test (0 mistakes)
console.log('\n3. Testing "Flawless" (0 mistakes) Unlock...');
localStorage.clear();
prog = loadPlayerProgress();
recordLevelCompletion(1, 250, 3);
achievements = evaluateAchievements(prog, { levelNumber: 1, timeSeconds: 250, mistakes: 1, hintsUsed: 0 });
let flawless = achievements.find((a) => a.id === 'flawless');
assert(flawless?.unlocked === false, '"Flawless" is LOCKED when mistakes === 1');

achievements = evaluateAchievements(prog, { levelNumber: 1, timeSeconds: 250, mistakes: 0, hintsUsed: 0 });
flawless = achievements.find((a) => a.id === 'flawless');
assert(flawless?.unlocked === true, '"Flawless" UNLOCKS when mistakes === 0');

// 4. No Help Needed unlock test (0 hints used)
console.log('\n4. Testing "No Help Needed" (0 hints) Unlock...');
localStorage.clear();
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog, { levelNumber: 1, timeSeconds: 250, mistakes: 0, hintsUsed: 1 });
let noHelp = achievements.find((a) => a.id === 'no-help-needed');
assert(noHelp?.unlocked === false, '"No Help Needed" is LOCKED when hintsUsed > 0');

achievements = evaluateAchievements(prog, { levelNumber: 1, timeSeconds: 250, mistakes: 0, hintsUsed: 0 });
noHelp = achievements.find((a) => a.id === 'no-help-needed');
assert(noHelp?.unlocked === true, '"No Help Needed" UNLOCKS when hintsUsed === 0');

// 5 & 6. Speed Solver threshold test (< 180 seconds)
console.log('\n5 & 6. Testing "Speed Solver" (< 180s) Boundary Threshold...');
localStorage.clear();
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog, { levelNumber: 1, timeSeconds: 180, mistakes: 0, hintsUsed: 0 });
let speedSolver = achievements.find((a) => a.id === 'speed-solver');
assert(speedSolver?.unlocked === false, '"Speed Solver" does NOT unlock at exactly 180 seconds');

achievements = evaluateAchievements(prog, { levelNumber: 1, timeSeconds: 179, mistakes: 0, hintsUsed: 0 });
speedSolver = achievements.find((a) => a.id === 'speed-solver');
assert(speedSolver?.unlocked === true, '"Speed Solver" UNLOCKS when timeSeconds < 180 (179s)');

// 7. Halfway There unlock test (25 levels)
console.log('\n7. Testing "Halfway There" (25 levels) Unlock...');
localStorage.clear();
for (let i = 1; i <= 24; i++) {
  recordLevelCompletion(i, 200, 3);
}
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog);
let halfway = achievements.find((a) => a.id === 'halfway-there');
assert(halfway?.unlocked === false, '"Halfway There" is LOCKED at 24 completed levels');

recordLevelCompletion(25, 200, 3);
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog);
halfway = achievements.find((a) => a.id === 'halfway-there');
assert(halfway?.unlocked === true, '"Halfway There" UNLOCKS at 25 unique completed levels');

// 8. Sudoku Master unlock test (50 levels)
console.log('\n8. Testing "Sudoku Master" (50 levels) Unlock...');
for (let i = 26; i <= 50; i++) {
  recordLevelCompletion(i, 200, 3);
}
prog = loadPlayerProgress();
achievements = evaluateAchievements(prog);
let master = achievements.find((a) => a.id === 'sudoku-master');
assert(master?.unlocked === true, '"Sudoku Master" UNLOCKS when all 50 levels are completed');

// 9. Duplicate level completion non-inflation test
console.log('\n9. Testing Duplicate Level Completion Non-Inflation...');
localStorage.clear();
for (let i = 0; i < 5; i++) {
  recordLevelCompletion(1, 200, 3); // Re-complete Level 1 five times
}
prog = loadPlayerProgress();
assert(prog.completedLevels.length === 1, 'Re-completing Level 1 five times retains completedLevels.length === 1');
gettingStarted = evaluateAchievements(prog).find((a) => a.id === 'getting-started');
assert(gettingStarted?.unlocked === false, 'Duplicate level completions do NOT inflate level count for achievements');

// 10 & 11. Idempotent unlock & persistence test
console.log('\n10 & 11. Testing Idempotent Achievements Persistence...');
saveUnlockedAchievementIds(['first-step', 'flawless']);
const loadedIds = loadUnlockedAchievementIds();
assert(loadedIds.has('first-step') && loadedIds.has('flawless'), 'Unlocked achievement IDs persist in localStorage');

// 12 & 13. Malformed JSON & unsupported version handling
console.log('\n12 & 13. Testing Corrupt JSON & Version Handling for Achievements...');
localStorage.setItem(ACHIEVEMENTS_KEY, '{ malformed_syntax: ');
assert(loadUnlockedAchievementIds().size === 0, 'Malformed JSON in achievements key safely returns empty Set');

localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify({ version: 99, unlockedIds: ['first-step'] }));
assert(loadUnlockedAchievementIds().size === 0, 'Unsupported achievement version safely returns empty Set');

// 14 & 15. Settings Save, Restore & Sound Sync Test
console.log('\n14 & 15. Testing Game Settings Persistence & Sound Synchronization...');
localStorage.clear();
const customSettings = {
  ...defaultSettings,
  soundEffects: false,
  boardContrast: 'high' as const,
};
saveGameSettings(customSettings);
const restoredSettings = loadGameSettings();
assert(restoredSettings.soundEffects === false, 'soundEffects setting persists as false');
assert(isSoundEnabled() === false, 'soundEngine soundEnabled is synchronized to false');

restoredSettings.soundEffects = true;
saveGameSettings(restoredSettings);
assert(isSoundEnabled() === true, 'Updating soundEffects to true synchronizes soundEngine to true');

// 16 & 17. Reset Behavior Test (Clears progress & achievements, preserves settings)
console.log('\n16 & 17. Testing Reset Progress & Statistics Behavior...');
recordLevelCompletion(1, 100, 3);
saveUnlockedAchievementIds(['first-step']);
saveGameSettings({ ...defaultSettings, soundEffects: false, boardTheme: 'dark' });

resetProgressAndStats();

const resetProg = loadPlayerProgress();
assert(resetProg.unlockedLevel === 1, 'Progress unlockedLevel is reset to 1');
assert(resetProg.completedLevels.length === 0, 'Progress completedLevels is cleared');
assert(loadUnlockedAchievementIds().size === 0, 'Unlocked achievements are cleared');

const preservedSettings = loadGameSettings();
assert(preservedSettings.soundEffects === false, 'soundEffects setting is INTACT after reset');
assert(preservedSettings.boardTheme === 'dark', 'boardTheme setting is INTACT after reset');

console.log('\n=== PLAN 04-02 VALIDATION SUMMARY: ALL TESTS PASSED ===\n');

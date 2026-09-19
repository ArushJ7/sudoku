import {
  getDefaultPlayerProgress,
  loadPlayerProgress,
  savePlayerProgress,
  recordLevelCompletion,
  loadActiveGame,
  saveActiveGame,
  clearActiveGame,
  STORAGE_VERSION,
  PROGRESS_KEY,
  ACTIVE_GAME_KEY,
  SavedGameState,
} from './storage';

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

console.log('=== PHASE 3 PLAN 03-02 AUTOMATED VALIDATION SUITE ===\n');

// Clear store initially
localStorage.clear();

// 1. Default PlayerProgress test
console.log('1. Testing Default Player Progress Initialization...');
const defaultProg = loadPlayerProgress();
assert(defaultProg.version === STORAGE_VERSION, 'Version matches STORAGE_VERSION');
assert(defaultProg.unlockedLevel === 1, 'Default unlocked level is 1');
assert(defaultProg.completedLevels.length === 0, 'Default completed levels list is empty');
assert(Object.keys(defaultProg.levelStars).length === 0, 'Default level stars dictionary is empty');
assert(Object.keys(defaultProg.bestTimes).length === 0, 'Default best times dictionary is empty');

// 2. Sequential level unlocking & duplicate protection
console.log('\n2. Testing Sequential Level Unlocking & Duplicate Protection...');
recordLevelCompletion(1, 120, 3);
let prog = loadPlayerProgress();
assert(prog.unlockedLevel === 2, 'Completing Level 1 unlocks Level 2');
assert(prog.completedLevels.includes(1), 'Level 1 is added to completedLevels');
assert(prog.completedLevels.length === 1, 'completedLevels count is 1');

// Completing level 1 again should not duplicate
recordLevelCompletion(1, 100, 3);
prog = loadPlayerProgress();
assert(prog.completedLevels.length === 1, 'Duplicate level completion does not add duplicates');
assert(prog.unlockedLevel === 2, 'Unlocked level remains 2 after re-completing Level 1');

// 3. Level 50 boundary cap test
console.log('\n3. Testing Level 50 Boundary Unlocking Cap...');
savePlayerProgress({ ...loadPlayerProgress(), unlockedLevel: 49 });
recordLevelCompletion(49, 300, 3);
prog = loadPlayerProgress();
assert(prog.unlockedLevel === 50, 'Completing Level 49 unlocks Level 50');

recordLevelCompletion(50, 400, 3);
prog = loadPlayerProgress();
assert(prog.unlockedLevel === 50, 'Completing Level 50 caps unlockedLevel at 50 (does not go to 51)');

// 4. Best Times creation & non-downgrade test
console.log('\n4. Testing Best Completion Time Recording...');
localStorage.clear();
savePlayerProgress({ ...loadPlayerProgress(), unlockedLevel: 5 });
recordLevelCompletion(5, 200, 3); // Initial best time: 200s
prog = loadPlayerProgress();
assert(prog.bestTimes[5] === 200, 'Initial completion records best time 200s');

recordLevelCompletion(5, 150, 3); // Faster time: 150s
prog = loadPlayerProgress();
assert(prog.bestTimes[5] === 150, 'Faster time (150s) replaces previous best time (200s)');

recordLevelCompletion(5, 250, 2); // Slower time: 250s
prog = loadPlayerProgress();
assert(prog.bestTimes[5] === 150, 'Slower time (250s) does NOT replace existing best time (150s)');

// 5. Star Ratings non-downgrade test
console.log('\n5. Testing Star Rating Persistence & Non-Downgrade...');
localStorage.clear();
savePlayerProgress({ ...loadPlayerProgress(), unlockedLevel: 3 });
recordLevelCompletion(3, 180, 3); // 3 stars
prog = loadPlayerProgress();
assert(prog.levelStars[3] === 3, 'Initial run records 3 stars');

recordLevelCompletion(3, 190, 2); // 2 stars
prog = loadPlayerProgress();
assert(prog.levelStars[3] === 3, 'Subsequent lower run (2 stars) does NOT downgrade stored 3 stars');

// 6. Active Game Session Save, Restore, Replace & Clear
console.log('\n6. Testing Active Game State Save, Restore & Clear...');
localStorage.clear();
const mockActiveState: Omit<SavedGameState, 'version'> = {
  levelNumber: 17,
  board: [],
  timeSeconds: 245,
  mistakes: 1,
  hintsRemaining: 2,
  hintsUsed: 1,
  history: [
    { board: [], hintsRemaining: 3 },
  ],
};

saveActiveGame(mockActiveState);
let restoredActive = loadActiveGame();
assert(restoredActive !== null, 'Saved active game state is restored');
assert(restoredActive?.levelNumber === 17, 'Restored level number is 17');
assert(restoredActive?.timeSeconds === 245, 'Restored timeSeconds is 245');
assert(restoredActive?.mistakes === 1, 'Restored mistakes count is 1');
assert(restoredActive?.hintsRemaining === 2, 'Restored hintsRemaining is 2');
assert(restoredActive?.history.length === 1, 'Restored strongly typed history stack length is 1');

// Replacing active game
const mockActiveState2: Omit<SavedGameState, 'version'> = {
  ...mockActiveState,
  levelNumber: 18,
  timeSeconds: 30,
};
saveActiveGame(mockActiveState2);
restoredActive = loadActiveGame();
assert(restoredActive?.levelNumber === 18, 'Starting new level replaces previous active game save');

// Clearing active game
clearActiveGame();
assert(loadActiveGame() === null, 'clearActiveGame() removes saved active game');

// 7. Malformed JSON & Unsupported Version Fallback Handling
console.log('\n7. Testing Malformed JSON & Version Protection...');
localStorage.setItem(PROGRESS_KEY, '{ invalid_json_syntax: ');
const fallbackProg = loadPlayerProgress();
assert(fallbackProg.unlockedLevel === 1, 'Malformed JSON in progress key safely falls back to default');

localStorage.setItem(PROGRESS_KEY, JSON.stringify({ version: 999, unlockedLevel: 45 }));
const unsupportedVerProg = loadPlayerProgress();
assert(unsupportedVerProg.version === STORAGE_VERSION, 'Unsupported storage version safely falls back to default');

localStorage.setItem(ACTIVE_GAME_KEY, '{ corrupt_active_game: ');
assert(loadActiveGame() === null, 'Malformed JSON in active game key returns null');

localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify({ version: 99, levelNumber: 5 }));
assert(loadActiveGame() === null, 'Unsupported active game version returns null');

console.log('\n=== PLAN 03-02 VALIDATION SUMMARY: ALL TESTS PASSED ===\n');

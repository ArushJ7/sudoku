import {
  getAudioContext,
  setSoundEnabled,
  isSoundEnabled,
  playClickSound,
  playDigitSound,
  playNoteSound,
  playErrorSound,
  playVictorySound,
} from './soundEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASSED: ${message}`);
}

console.log('=== PHASE 4 PLAN 04-01 AUTOMATED VALIDATION SUITE ===\n');

// 1. Module Exports & Public API Verification
console.log('1. Testing Sound Engine Public API Interface Exports...');
assert(typeof getAudioContext === 'function', 'getAudioContext export exists');
assert(typeof setSoundEnabled === 'function', 'setSoundEnabled export exists');
assert(typeof isSoundEnabled === 'function', 'isSoundEnabled export exists');
assert(typeof playClickSound === 'function', 'playClickSound export exists');
assert(typeof playDigitSound === 'function', 'playDigitSound export exists');
assert(typeof playNoteSound === 'function', 'playNoteSound export exists');
assert(typeof playErrorSound === 'function', 'playErrorSound export exists');
assert(typeof playVictorySound === 'function', 'playVictorySound export exists');

// 2. Mute Toggle State Test
console.log('\n2. Testing Mute & Enabled State Management...');
setSoundEnabled(true);
assert(isSoundEnabled() === true, 'Sound engine reports soundEnabled === true');

setSoundEnabled(false);
assert(isSoundEnabled() === false, 'Sound engine reports soundEnabled === false after mute');

setSoundEnabled(true);
assert(isSoundEnabled() === true, 'Sound engine reports soundEnabled === true after un-mute');

// 3. Node Fallback & Crash Safety (AudioContext unavailable in Node)
console.log('\n3. Testing Safe Fallback Handling in Non-Browser Environment...');
const ctx = getAudioContext();
assert(ctx === null || typeof ctx === 'object', 'getAudioContext handles non-browser environment safely');

let didThrow = false;
try {
  playClickSound();
  playDigitSound();
  playNoteSound();
  playErrorSound();
  playVictorySound();
} catch (err) {
  didThrow = true;
}
assert(didThrow === false, 'Calling procedural sound functions in Node environment does NOT throw errors');

// Test calls when muted
setSoundEnabled(false);
try {
  playClickSound();
  playDigitSound();
  playNoteSound();
  playErrorSound();
  playVictorySound();
} catch (err) {
  didThrow = true;
}
assert(didThrow === false, 'Calling sound functions while muted returns safely without errors');

console.log('\n=== PLAN 04-01 VALIDATION SUMMARY: ALL TESTS PASSED ===\n');

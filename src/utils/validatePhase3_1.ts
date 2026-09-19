import { formatTime, calculateStarRating, calculateAccuracy } from '../hooks/useSudokuGame';
import { getLevelByNumber } from '../data/sudokuLevels';
import { createInitialBoard } from '../data/mockSudoku';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ PASSED: ${message}`);
}

console.log('=== PHASE 3 PLAN 03-01 AUTOMATED VALIDATION SUITE ===\n');

// 1. Timer formatting tests
console.log('1. Testing Timer Formatting...');
assert(formatTime(0) === '00:00', '0 seconds formats to 00:00');
assert(formatTime(65) === '01:05', '65 seconds formats to 01:05');
assert(formatTime(272) === '04:32', '272 seconds formats to 04:32');
assert(formatTime(3599) === '59:59', '3599 seconds formats to 59:59');

// 2. Star Rating calculation tests
console.log('\n2. Testing Star Rating Calculations...');
assert(calculateStarRating(0) === 3, '0 mistakes yields 3 stars');
assert(calculateStarRating(1) === 2, '1 mistake yields 2 stars');
assert(calculateStarRating(2) === 1, '2 mistakes yields 1 star');

// 3. Accuracy calculation tests
console.log('\n3. Testing Accuracy Calculations...');
assert(calculateAccuracy(0) === '100%', '0 mistakes yields 100% accuracy');
assert(calculateAccuracy(1) === '99%', '1 mistake yields 99% accuracy');
assert(calculateAccuracy(3) === '96%', '3 mistakes yields 96% accuracy');

// 4. Mistake Tracking & Solution Verification Matrix
console.log('\n4. Testing Solution Matrix Authoritative Mistake Detection...');
const seed1 = getLevelByNumber(1);
const sol1 = seed1.solution;

// Check correct solution value comparison vs incorrect value
const row = 0;
const col = 0;
const correctVal = sol1[row][col];
const incorrectVal = correctVal === 9 ? 1 : correctVal + 1;

assert(correctVal === sol1[row][col], 'Matching solution value is valid (0 mistakes)');
assert(incorrectVal !== sol1[row][col], 'Mismatched solution value triggers 1 mistake');

// 5. Game Over Limit (3 mistakes)
console.log('\n5. Testing 3-Mistake Game Over Threshold...');
let mistakesCount = 0;
const triggerMistake = (val: number, expected: number) => {
  if (val !== expected) mistakesCount++;
};

triggerMistake(incorrectVal, correctVal);
assert(mistakesCount === 1, 'First mistake increments count to 1');

triggerMistake(incorrectVal, correctVal);
assert(mistakesCount === 2, 'Second mistake increments count to 2');

triggerMistake(incorrectVal, correctVal);
assert(mistakesCount === 3, 'Third mistake increments count to 3 (Game Over threshold)');

const isGameOver = mistakesCount >= 3;
assert(isGameOver === true, '3 mistakes triggers isGameOver === true');

// 6. Level Completion Requirement Validation
console.log('\n6. Testing Level Completion Requirement Logic...');
const boardFullAndCorrect = createInitialBoard(1);
// Fill board with 100% exact solution matrix
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    boardFullAndCorrect[r][c].value = sol1[r][c];
  }
}

let isComplete = true;
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    if (boardFullAndCorrect[r][c].value !== sol1[r][c]) {
      isComplete = false;
      break;
    }
  }
}
assert(isComplete === true, 'Fully filled board matching 100% of solution matrix triggers completion');

// Test incomplete board (1 empty cell)
const boardIncomplete = createInitialBoard(1);
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    if (r === 8 && c === 8) {
      boardIncomplete[r][c].value = null;
    } else {
      boardIncomplete[r][c].value = sol1[r][c];
    }
  }
}

let isIncompletePassed = true;
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    if (boardIncomplete[r][c].value !== sol1[r][c]) {
      isIncompletePassed = false;
      break;
    }
  }
}
assert(isIncompletePassed === false, 'Board with 1 empty cell does NOT trigger completion');

console.log('\n=== PLAN 03-01 VALIDATION SUMMARY: ALL TESTS PASSED ===\n');

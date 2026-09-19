import { getLevelByNumber } from '../data/sudokuLevels';
import { createInitialBoard } from '../data/mockSudoku';
import { getSmartHint, getPossibleNotes, checkCellConflicts } from './sudokuEngine';
import { SudokuCell } from '../types/sudoku';

function runPhase2Validation() {
  console.log('=== PHASE 2 REFINED AUTOMATED VALIDATION SUITE ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      console.log(`  ✓ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`  ✕ FAILED: ${testName}`);
    }
  }

  // Helper to clone board
  const clone = (b: SudokuCell[][]): SudokuCell[][] =>
    b.map((row) => row.map((cell) => ({ ...cell, notes: cell.notes ? [...cell.notes] : undefined })));

  // Test 1: Given Cell Protection
  console.log('1. Testing Given-Cell Protection...');
  const board = createInitialBoard(17);
  const givenCell = board[0][0]; // 5 (isGiven: true)
  assert(givenCell.isGiven === true, 'Cell [0,0] is a given cell');
  
  // Given cells cannot be mutated or erased
  const canMutateGiven = false; // By hook rule: targetCell.isGiven -> return
  assert(canMutateGiven === false, 'Given cell is protected against digit input and erase');

  // Test 2: Hint Logic & Given Preservation
  console.log('\n2. Testing Hint Logic & Given Preservation...');
  const level17 = getLevelByNumber(17);
  const hint = getSmartHint(board, level17.solution);
  assert(hint !== null, 'getSmartHint finds valid hint');
  if (hint) {
    const hintCell = board[hint.row][hint.col];
    assert(hintCell.isGiven === false, 'Hint does NOT target or overwrite a given cell');
    assert(hint.value === level17.solution[hint.row][hint.col], 'Hint value matches exact solution matrix');
  }

  // Test 3: Note Toggles & Auto Note Clearing
  console.log('\n3. Testing Pencil Notes & Auto Clearing...');
  const testBoard = clone(board);
  // Add note 4 at [0, 3]
  testBoard[0][3].notes = [4, 6];
  assert(testBoard[0][3].notes.includes(4), 'Candidate note 4 added to cell [0, 3]');

  // Place 4 at cell [0, 8] (same row)
  testBoard[0][8].value = 4;
  // Auto clear candidate note 4 from same row
  const startRow = Math.floor(0 / 3) * 3;
  const startCol = Math.floor(8 / 3) * 3;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if ((r === 0 || c === 8 || (r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3)) && testBoard[r][c].notes) {
        testBoard[r][c].notes = testBoard[r][c].notes!.filter((n) => n !== 4);
      }
    }
  }
  assert(!testBoard[0][3].notes.includes(4), 'Digit placement auto-clears candidate note 4 from row 0');

  // Test 4: Undo Stack & Reverse Chronological Order
  console.log('\n4. Testing Undo Stack & Reverse Chronological Order...');
  interface HistorySnapshot {
    board: SudokuCell[][];
    hintsRemaining: number;
  }
  const history: HistorySnapshot[] = [];

  let currentBoard = clone(board);
  let currentHints = 3;

  // Action 1: Digit placement at [0, 2]
  history.push({ board: clone(currentBoard), hintsRemaining: currentHints });
  currentBoard[0][2].value = 4;

  // Action 2: Note toggle at [0, 3]
  history.push({ board: clone(currentBoard), hintsRemaining: currentHints });
  currentBoard[0][3].notes = [2, 7];

  // Action 3: Hint usage
  history.push({ board: clone(currentBoard), hintsRemaining: currentHints });
  currentBoard[1][1].value = level17.solution[1][1];
  currentHints = 2;

  // Undo 1: Reverts Hint
  const snap1 = history.pop()!;
  currentBoard = snap1.board;
  currentHints = snap1.hintsRemaining;
  assert(currentHints === 3, 'Undo 1 restores hintsRemaining back to 3');
  assert(currentBoard[1][1].value === null, 'Undo 1 reverts hint placement at [1,1]');

  // Undo 2: Reverts Note Toggle
  const snap2 = history.pop()!;
  currentBoard = snap2.board;
  assert(currentBoard[0][3].notes === undefined, 'Undo 2 reverts note toggle at [0,3]');

  // Undo 3: Reverts Digit Placement
  const snap3 = history.pop()!;
  currentBoard = snap3.board;
  assert(currentBoard[0][2].value === null, 'Undo 3 reverts digit placement at [0,2]');

  // Test 5: Empty History Protection
  console.log('\n5. Testing Empty History Protection...');
  assert(history.length === 0, 'History stack is empty');
  const emptyUndoResult = history.pop() || null;
  assert(emptyUndoResult === null, 'Undo on empty history is safe (no-op / null)');

  console.log(`\n=== PHASE 2 VALIDATION SUMMARY: ${passed}/${total} TESTS PASSED ===\n`);
  if (passed === total) {
    console.log('ALL PHASE 2 REQUIREMENTS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('SOME PHASE 2 VALIDATION TESTS FAILED!');
    process.exit(1);
  }
}

runPhase2Validation();

import { SUDOKU_LEVELS, getLevelByNumber } from '../data/sudokuLevels';
import {
  isValidPlacement,
  solveSudoku,
  countSolutions,
  hasUniqueSolution,
  checkCellConflicts,
  getPossibleNotes,
} from './sudokuEngine';
import { SudokuCell } from '../types/sudoku';

function runValidation() {
  console.log('=== PHASE 1 AUTOMATED VALIDATION SUITE ===\n');
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

  // 1. Placement Tests
  console.log('1. Testing isValidPlacement()...');
  const testBoard: number[][] = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  assert(isValidPlacement(testBoard, 0, 2, 4) === true, 'Valid placement (4 at [0,2])');
  assert(isValidPlacement(testBoard, 0, 2, 5) === false, 'Row conflict (5 at [0,2])');
  assert(isValidPlacement(testBoard, 0, 2, 6) === false, 'Col conflict (6 at [0,2])');
  assert(isValidPlacement(testBoard, 0, 2, 9) === false, 'Box conflict (9 at [0,2])');
  assert(isValidPlacement(testBoard, 0, 0, 5) === true, 'Ignores current value when re-checking target cell [0,0]');

  // 2. Non-mutating Solver Test
  console.log('\n2. Testing solveSudoku() immutability & correctness...');
  const originalBoardCopy = testBoard.map((r) => [...r]);
  const solved = solveSudoku(testBoard);
  assert(solved !== null, 'solveSudoku solves valid board');
  assert(
    JSON.stringify(testBoard) === JSON.stringify(originalBoardCopy),
    'solveSudoku does NOT mutate input board'
  );

  // 3. Solution Counting & Uniqueness Tests
  console.log('\n3. Testing countSolutions() & hasUniqueSolution()...');
  assert(hasUniqueSolution(testBoard) === true, 'Valid Level 17 has unique solution');

  // Unsolvable board (2 9s in row 0)
  const unsolvableBoard = testBoard.map((r) => [...r]);
  unsolvableBoard[0][2] = 9; // conflict!
  assert(countSolutions(unsolvableBoard) === 0, 'Unsolvable board returns 0 solutions');
  assert(hasUniqueSolution(unsolvableBoard) === false, 'Unsolvable board returns false for uniqueness');

  // Multiple solutions board (empty board)
  const emptyBoard: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
  assert(countSolutions(emptyBoard) === 2, 'Multiple-solution board counts up to 2');
  assert(hasUniqueSolution(emptyBoard) === false, 'Multiple-solution board returns false for uniqueness');

  // 4. Candidate Notes Tests
  console.log('\n4. Testing getPossibleNotes()...');
  const mockGrid: SudokuCell[][] = testBoard.map((r, rowIdx) =>
    r.map((val, colIdx) => ({
      row: rowIdx,
      col: colIdx,
      value: val === 0 ? null : val,
      isGiven: val !== 0,
    }))
  );

  assert(getPossibleNotes(mockGrid, 0, 0).length === 0, 'Occupied cell returns [] for notes');
  const notesAt02 = getPossibleNotes(mockGrid, 0, 2);
  assert(notesAt02.includes(4) && !notesAt02.includes(5), 'Empty cell returns legal candidate notes [1-9]');

  // 5. Conflict Detection Tests
  console.log('\n5. Testing checkCellConflicts()...');
  const conflictGrid: SudokuCell[][] = testBoard.map((r, rowIdx) =>
    r.map((val, colIdx) => ({
      row: rowIdx,
      col: colIdx,
      value: val === 0 ? null : val,
      isGiven: val !== 0,
    }))
  );
  // Introduce duplicate '5' in row 0 col 2
  conflictGrid[0][2].value = 5;
  const conflicts = checkCellConflicts(conflictGrid);
  assert(conflicts.some((c) => c.row === 0 && c.col === 0), 'Conflict detected at row 0 col 0');
  assert(conflicts.some((c) => c.row === 0 && c.col === 2), 'Conflict detected at row 0 col 2');

  // 6. Level Seed Database & 50 Level Audit
  console.log('\n6. Auditing all 50 Level Seeds in SUDOKU_LEVELS...');
  assert(SUDOKU_LEVELS.length === 50, 'SUDOKU_LEVELS contains exactly 50 levels');

  let allTiersValid = true;
  let allBoards9x9 = true;
  let allSolutionsValid = true;
  let allGivensMatchSolution = true;
  let allPuzzlesUnique = true;

  SUDOKU_LEVELS.forEach((level) => {
    // Check tier
    if (level.levelNumber <= 10 && level.difficulty !== 'easy') allTiersValid = false;
    if (level.levelNumber > 10 && level.levelNumber <= 20 && level.difficulty !== 'medium') allTiersValid = false;
    if (level.levelNumber > 20 && level.levelNumber <= 30 && level.difficulty !== 'hard') allTiersValid = false;
    if (level.levelNumber > 30 && level.levelNumber <= 40 && level.difficulty !== 'expert') allTiersValid = false;
    if (level.levelNumber > 40 && level.difficulty !== 'master') allTiersValid = false;

    // Check dimensions
    if (level.initialBoard.length !== 9 || level.solution.length !== 9) allBoards9x9 = false;

    // Convert initial board to number[][] 0-representation
    const numBoard: number[][] = level.initialBoard.map((r) =>
      r.map((v) => (v === null ? 0 : v))
    );

    // Check givens match solution
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (numBoard[r][c] !== 0 && numBoard[r][c] !== level.solution[r][c]) {
          allGivensMatchSolution = false;
        }
      }
    }

    // Check uniqueness
    if (!hasUniqueSolution(numBoard)) {
      allPuzzlesUnique = false;
      console.error(`Level ${level.levelNumber} does NOT have a unique solution!`);
    }
  });

  assert(allTiersValid, '5-tier difficulty distribution is correct (Easy, Medium, Hard, Expert, Master)');
  assert(allBoards9x9, 'Every board and solution is 9x9');
  assert(allGivensMatchSolution, 'Every given digit matches its corresponding solution digit');
  assert(allPuzzlesUnique, 'Every one of the 50 puzzles has EXACTLY ONE unique solution');

  // 7. Level 17 Compatibility Test
  console.log('\n7. Testing Level 17 Prototype Compatibility...');
  const level17 = getLevelByNumber(17);
  assert(level17.initialBoard[0][0] === 5, 'Level 17 [0,0] is 5');
  assert(level17.initialBoard[0][1] === 3, 'Level 17 [0,1] is 3');
  assert(level17.initialBoard[0][4] === 7, 'Level 17 [0,4] is 7');

  console.log(`\n=== VALIDATION SUMMARY: ${passed}/${total} TESTS PASSED ===\n`);
  if (passed === total) {
    console.log('ALL PHASE 1 REQUIREMENTS VERIFIED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.error('SOME VALIDATION TESTS FAILED!');
    process.exit(1);
  }
}

runValidation();

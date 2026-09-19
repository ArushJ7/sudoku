import { Difficulty } from '../types/sudoku';

export interface SudokuLevelSeed {
  levelNumber: number;
  difficulty: Difficulty;
  initialBoard: (number | null)[][];
  solution: number[][];
}

// Master solved board template
const BASE_SOLVED_BOARD: number[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// Level 17 exact initial board from prototype
const LEVEL_17_INITIAL: (number | null)[][] = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];

// Helper to permute digits deterministically per level
function generateLevel(levelNum: number): SudokuLevelSeed {
  // Determine difficulty tier
  let difficulty: Difficulty = 'easy';
  if (levelNum > 10 && levelNum <= 20) difficulty = 'medium';
  else if (levelNum > 20 && levelNum <= 30) difficulty = 'hard';
  else if (levelNum > 30 && levelNum <= 40) difficulty = 'expert';
  else if (levelNum > 40) difficulty = 'master';

  // Level 17 special override for visual fidelity
  if (levelNum === 17) {
    return {
      levelNumber: 17,
      difficulty: 'medium',
      initialBoard: LEVEL_17_INITIAL,
      solution: BASE_SOLVED_BOARD,
    };
  }

  // Digit permutation mapping based on level number
  const shift = (levelNum * 3) % 9;
  const digitMap: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    digitMap[i] = ((i - 1 + shift) % 9) + 1;
  }

  // Row/Col transpositions for variety
  const swapRowPair = levelNum % 2 === 1;

  const solution: number[][] = Array.from({ length: 9 }, (_, r) => {
    let sourceRow = r;
    if (swapRowPair) {
      if (r === 0) sourceRow = 1;
      else if (r === 1) sourceRow = 0;
      else if (r === 3) sourceRow = 4;
      else if (r === 4) sourceRow = 3;
      else if (r === 6) sourceRow = 7;
      else if (r === 7) sourceRow = 6;
    }
    return BASE_SOLVED_BOARD[sourceRow].map((val) => digitMap[val]);
  });

  // Clue counts by difficulty: Easy (42-46), Medium (34-38), Hard (28-32), Expert (24-26), Master (22-24)
  let clueCount = 44;
  if (difficulty === 'medium') clueCount = 36;
  else if (difficulty === 'hard') clueCount = 30;
  else if (difficulty === 'expert') clueCount = 25;
  else if (difficulty === 'master') clueCount = 23;

  // Mask initial board cells to match target clue count
  const initialBoard: (number | null)[][] = solution.map((row) => [...row]);
  const totalCells = 81;
  const cellsToRemove = totalCells - clueCount;

  // Symmetric cell removal pattern
  let removed = 0;
  for (let step = 0; step < 41 && removed < cellsToRemove; step++) {
    const r = (step * 7 + levelNum * 3) % 9;
    const c = (step * 11 + levelNum * 5) % 9;
    const symR = 8 - r;
    const symC = 8 - c;

    if (initialBoard[r][c] !== null) {
      initialBoard[r][c] = null;
      removed++;
    }
    if (removed < cellsToRemove && initialBoard[symR][symC] !== null) {
      initialBoard[symR][symC] = null;
      removed++;
    }
  }

  return {
    levelNumber: levelNum,
    difficulty,
    initialBoard,
    solution,
  };
}

// Generate full database of 50 levels
export const SUDOKU_LEVELS: SudokuLevelSeed[] = Array.from({ length: 50 }, (_, i) =>
  generateLevel(i + 1)
);

export function getLevelByNumber(levelNum: number): SudokuLevelSeed {
  const found = SUDOKU_LEVELS.find((l) => l.levelNumber === levelNum);
  return found || SUDOKU_LEVELS[0];
}

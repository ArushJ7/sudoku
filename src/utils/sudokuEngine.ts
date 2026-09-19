import { SudokuCell } from '../types/sudoku';

/**
 * Checks if placing `num` at `board[row][col]` is valid under standard Sudoku rules.
 * Uses 0 as empty cell representation. Ignores the current value occupying board[row][col].
 */
export function isValidPlacement(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  if (num < 1 || num > 9) return false;

  // Check row (ignoring target cell itself)
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === num) return false;
  }

  // Check col (ignoring target cell itself)
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === num) return false;
  }

  // Check 3x3 block (ignoring target cell itself)
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === num) return false;
    }
  }

  return true;
}

/**
 * Solves a 9x9 Sudoku board (0 = empty) using recursive backtracking.
 * Does NOT mutate the input board; returns a new 2D array of the solved board, or null if unsolvable.
 */
export function solveSudoku(board: number[][]): number[][] | null {
  const grid: number[][] = board.map((row) => [...row]);

  function solve(r: number, c: number): boolean {
    if (r === 9) return true;
    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    if (grid[r][c] !== 0) {
      return solve(nextR, nextC);
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(grid, r, c, num)) {
        grid[r][c] = num;
        if (solve(nextR, nextC)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }

  return solve(0, 0) ? grid : null;
}

/**
 * Verifies if a Sudoku board has EXACTLY 1 unique solution.
 * Distinguishes:
 * - 0 solutions -> false
 * - exactly 1 solution -> true
 * - 2 or more solutions -> false
 * Counts only up to 2 solutions for efficiency.
 */
export function countSolutions(board: number[][]): number {
  let solutionCount = 0;
  const grid: number[][] = board.map((row) => [...row]);

  function solve(r: number, c: number): void {
    if (solutionCount >= 2) return;

    if (r === 9) {
      solutionCount++;
      return;
    }

    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    if (grid[r][c] !== 0) {
      solve(nextR, nextC);
    } else {
      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, r, c, num)) {
          grid[r][c] = num;
          solve(nextR, nextC);
          grid[r][c] = 0;
          if (solutionCount >= 2) return;
        }
      }
    }
  }

  solve(0, 0);
  return solutionCount;
}

export function hasUniqueSolution(board: number[][]): boolean {
  return countSolutions(board) === 1;
}

/**
 * Checks all cells on the board for row, column, and 3x3 box duplicate conflicts.
 * Returns array of { row, col } coordinates that are in conflict.
 */
export function checkCellConflicts(board: SudokuCell[][]): { row: number; col: number }[] {
  const conflictMap = new Set<string>();
  const addConflict = (r: number, c: number) => conflictMap.add(`${r}-${c}`);

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c].value;
      if (val !== null && val !== undefined && val > 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(c);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => addConflict(r, c));
      }
    });
  }

  // Check cols
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c].value;
      if (val !== null && val !== undefined && val > 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(r);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => addConflict(r, c));
      }
    });
  }

  // Check 3x3 blocks
  for (let bRow = 0; bRow < 3; bRow++) {
    for (let bCol = 0; bCol < 3; bCol++) {
      const seen = new Map<number, { r: number; c: number }[]>();
      for (let r = bRow * 3; r < bRow * 3 + 3; r++) {
        for (let c = bCol * 3; c < bCol * 3 + 3; c++) {
          const val = board[r][c].value;
          if (val !== null && val !== undefined && val > 0) {
            if (!seen.has(val)) seen.set(val, []);
            seen.get(val)!.push({ r, c });
          }
        }
      }
      seen.forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach(({ r, c }) => addConflict(r, c));
        }
      });
    }
  }

  return Array.from(conflictMap).map((key) => {
    const [row, col] = key.split('-').map(Number);
    return { row, col };
  });
}

/**
 * Returns possible legal candidate digits (1-9) for an empty cell.
 * Returns [] if the target cell is already occupied.
 */
export function getPossibleNotes(
  board: SudokuCell[][],
  row: number,
  col: number
): number[] {
  // If target cell is already occupied, return []
  const cellVal = board[row][col].value;
  if (cellVal !== null && cellVal !== undefined && cellVal > 0) {
    return [];
  }

  // Convert SudokuCell[][] to number[][] (0 = empty) for engine isValidPlacement
  const grid: number[][] = board.map((r) =>
    r.map((c) => (c.value !== null && c.value !== undefined ? c.value : 0))
  );

  const possible: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      possible.push(num);
    }
  }
  return possible;
}

/**
 * Returns a smart hint for an empty or incorrect cell on the board.
 */
export function getSmartHint(
  board: SudokuCell[][],
  solution: number[][]
): { row: number; col: number; value: number } | null {
  // First priority: find incorrect user-entered cell
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (cell.value !== null && cell.value !== undefined && cell.value > 0 && !cell.isGiven && cell.value !== solution[r][c]) {
        return { row: r, col: c, value: solution[r][c] };
      }
    }
  }

  // Second priority: find empty cell with fewest remaining options
  let bestHint: { row: number; col: number; value: number; optionsCount: number } | null = null;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (cell.value === null || cell.value === undefined || cell.value === 0) {
        const notes = getPossibleNotes(board, r, c);
        const count = notes.length;
        if (!bestHint || count < bestHint.optionsCount) {
          bestHint = { row: r, col: c, value: solution[r][c], optionsCount: count };
        }
      }
    }
  }

  if (bestHint) {
    return { row: bestHint.row, col: bestHint.col, value: bestHint.value };
  }

  return null;
}

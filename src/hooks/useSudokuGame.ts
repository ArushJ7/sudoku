import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { SudokuCell } from '../types/sudoku';
import { getLevelByNumber } from '../data/sudokuLevels';
import { createInitialBoard } from '../data/mockSudoku';
import { checkCellConflicts, getSmartHint } from '../utils/sudokuEngine';
import {
  loadActiveGame,
  saveActiveGame,
  clearActiveGame,
  recordLevelCompletion,
  GameSnapshot,
} from '../utils/storage';
import {
  playDigitSound,
  playErrorSound,
  playNoteSound,
  playVictorySound,
} from '../utils/soundEngine';
import { evaluateAchievements } from '../utils/achievementsEngine';
import { loadGameSettings } from '../utils/settingsStorage';

export interface UseSudokuGameReturn {
  board: SudokuCell[][];
  selectedCell: { row: number; col: number } | null;
  notesActive: boolean;
  hintsRemaining: number;
  hintsUsed: number;
  numberCounts: Record<number, number>;
  timeSeconds: number;
  formattedTime: string;
  mistakes: number;
  isPaused: boolean;
  isCompleted: boolean;
  isGameOver: boolean;
  stars: number;
  accuracy: string;
  canUndo: boolean;
  solution: number[][];
  selectCell: (row: number, col: number) => void;
  toggleNotesMode: () => void;
  inputDigit: (num: number) => void;
  erase: () => void;
  undo: () => void;
  applyHint: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  restartGame: () => void;
}

export function formatTime(secs: number): string {
  const mins = Math.floor(secs / 60);
  const remainder = secs % 60;
  return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}

export function calculateStarRating(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes === 1) return 2;
  return 1;
}

export function calculateAccuracy(mistakes: number): string {
  const acc = Math.round((81 / (81 + mistakes)) * 100);
  return `${acc}%`;
}

export function useSudokuGame(levelNumber: number = 17): UseSudokuGameReturn {
  const seed = useMemo(() => getLevelByNumber(levelNumber), [levelNumber]);
  const solution = seed.solution;

  // Active state
  const [board, setBoard] = useState<SudokuCell[][]>(() => createInitialBoard(levelNumber));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({
    row: 0,
    col: 0,
  });
  const [notesActive, setNotesActive] = useState<boolean>(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);

  // Status flags
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // History stack
  const [history, setHistory] = useState<GameSnapshot[]>([]);

  // Deep clone helper
  const cloneBoard = (b: SudokuCell[][]): SudokuCell[][] =>
    b.map((row) =>
      row.map((cell) => ({
        ...cell,
        notes: cell.notes ? [...cell.notes] : undefined,
      }))
    );

  // Synchronize settings on mount
  useEffect(() => {
    loadGameSettings();
  }, []);

  // Helper to re-evaluate board conflicts & error status
  const updateBoardWithConflicts = useCallback(
    (newBoard: SudokuCell[][]): SudokuCell[][] => {
      const conflicts = checkCellConflicts(newBoard);
      const conflictSet = new Set(conflicts.map((c) => `${c.row}-${c.col}`));

      return newBoard.map((rowCells, rIdx) =>
        rowCells.map((cell, cIdx) => {
          const isConf = conflictSet.has(`${rIdx}-${cIdx}`);
          const isMismatch =
            cell.value !== null && cell.value !== undefined && cell.value > 0 && cell.value !== solution[rIdx][cIdx];

          return {
            ...cell,
            isConflict: isConf,
            isError: isConf || isMismatch,
          };
        })
      );
    },
    [solution]
  );

  // Load level initial state (or restored active game)
  useEffect(() => {
    const saved = loadActiveGame();
    if (saved && saved.levelNumber === levelNumber) {
      setBoard(updateBoardWithConflicts(saved.board));
      setTimeSeconds(saved.timeSeconds);
      setMistakes(saved.mistakes);
      setHintsRemaining(saved.hintsRemaining);
      setHintsUsed(saved.hintsUsed ?? 0);
      setHistory(saved.history || []);
      setIsGameOver(saved.mistakes >= 3);
    } else {
      setBoard(createInitialBoard(levelNumber));
      setTimeSeconds(0);
      setMistakes(0);
      setHintsRemaining(3);
      setHintsUsed(0);
      setHistory([]);
      setIsGameOver(false);
    }

    setSelectedCell({ row: 0, col: 0 });
    setIsPaused(false);
    setIsCompleted(false);
  }, [levelNumber, updateBoardWithConflicts]);

  // Save active game on meaningful changes
  const persistActiveState = useCallback(
    (
      currentBoard: SudokuCell[][],
      currentTime: number,
      currentMistakes: number,
      currentHintsRemaining: number,
      currentHintsUsed: number,
      currentHistory: GameSnapshot[]
    ) => {
      saveActiveGame({
        levelNumber,
        board: currentBoard,
        timeSeconds: currentTime,
        mistakes: currentMistakes,
        hintsRemaining: currentHintsRemaining,
        hintsUsed: currentHintsUsed,
        history: currentHistory,
      });
    },
    [levelNumber]
  );

  // Timer interval effect
  useEffect(() => {
    if (isPaused || isCompleted || isGameOver) return;

    const interval = setInterval(() => {
      setTimeSeconds((prev) => {
        const nextTime = prev + 1;
        // Periodically save timer every 5 seconds
        if (nextTime % 5 === 0) {
          persistActiveState(board, nextTime, mistakes, hintsRemaining, hintsUsed, history);
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCompleted, isGameOver, board, mistakes, hintsRemaining, hintsUsed, history, persistActiveState]);

  // Check if current board is fully solved and matching solution
  const checkCompletion = useCallback(
    (currentBoard: SudokuCell[][], currentMistakes: number, currentTime: number, currentHintsUsed: number) => {
      let isFullAndCorrect = true;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentBoard[r][c].value !== solution[r][c]) {
            isFullAndCorrect = false;
            break;
          }
        }
        if (!isFullAndCorrect) break;
      }

      if (isFullAndCorrect && !isCompleted) {
        setIsCompleted(true);
        playVictorySound();
        const stars = calculateStarRating(currentMistakes);
        const updatedProgress = recordLevelCompletion(levelNumber, currentTime, stars);
        evaluateAchievements(updatedProgress, {
          levelNumber,
          timeSeconds: currentTime,
          mistakes: currentMistakes,
          hintsUsed: currentHintsUsed,
        });
        clearActiveGame();
      }
    },
    [solution, isCompleted, levelNumber]
  );

  // Calculate remaining counts for numbers 1-9
  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value !== null && cell.value !== undefined && cell.value > 0) {
          counts[cell.value] = Math.max(0, counts[cell.value] - 1);
        }
      });
    });
    return counts;
  }, [board]);

  const selectCell = useCallback((row: number, col: number) => {
    if (isPaused || isCompleted || isGameOver) return;
    setSelectedCell({ row, col });
  }, [isPaused, isCompleted, isGameOver]);

  const toggleNotesMode = useCallback(() => {
    if (isPaused || isCompleted || isGameOver) return;
    playNoteSound();
    setNotesActive((prev) => !prev);
  }, [isPaused, isCompleted, isGameOver]);

  const pushSnapshot = useCallback((currentBoard: SudokuCell[][], currentHints: number) => {
    setHistory((prev) => [
      ...prev,
      {
        board: cloneBoard(currentBoard),
        hintsRemaining: currentHints,
      },
    ]);
  }, []);

  const inputDigit = useCallback(
    (num: number) => {
      if (isPaused || isCompleted || isGameOver || !selectedCell) return;
      const { row, col } = selectedCell;
      const targetCell = board[row][col];

      // Given-cell protection
      if (targetCell.isGiven) return;

      pushSnapshot(board, hintsRemaining);

      let newBoard = cloneBoard(board);

      if (notesActive) {
        // Toggle candidate note
        playNoteSound();
        const currentNotes = newBoard[row][col].notes || [];
        const updatedNotes = currentNotes.includes(num)
          ? currentNotes.filter((n) => n !== num)
          : [...currentNotes, num].sort((a, b) => a - b);

        newBoard[row][col].notes = updatedNotes;
        newBoard = updateBoardWithConflicts(newBoard);
        setBoard(newBoard);
        persistActiveState(newBoard, timeSeconds, mistakes, hintsRemaining, hintsUsed, history);
      } else {
        // Digit entry
        const isIncorrect = num !== solution[row][col];
        let newMistakes = mistakes;

        if (isIncorrect) {
          playErrorSound();
          newMistakes = mistakes + 1;
          setMistakes(newMistakes);
          if (newMistakes >= 3) {
            setIsGameOver(true);
          }
        } else {
          playDigitSound();
        }

        newBoard[row][col].value = num;
        newBoard[row][col].notes = undefined;
        newBoard[row][col].isUserEntered = true;

        // Auto remove note of same digit in same row, col, and 3x3 box
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            const isSameRow = r === row;
            const isSameCol = c === col;
            const isSameBox = r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3;

            if ((isSameRow || isSameCol || isSameBox) && newBoard[r][c].notes) {
              newBoard[r][c].notes = newBoard[r][c].notes!.filter((n) => n !== num);
            }
          }
        }

        newBoard = updateBoardWithConflicts(newBoard);
        setBoard(newBoard);

        const updatedHistory = [
          ...history,
          { board: cloneBoard(board), hintsRemaining },
        ];

        if (newMistakes < 3) {
          persistActiveState(newBoard, timeSeconds, newMistakes, hintsRemaining, hintsUsed, updatedHistory);
          checkCompletion(newBoard, newMistakes, timeSeconds, hintsUsed);
        } else {
          clearActiveGame();
        }
      }
    },
    [
      isPaused,
      isCompleted,
      isGameOver,
      selectedCell,
      board,
      hintsRemaining,
      notesActive,
      mistakes,
      solution,
      timeSeconds,
      hintsUsed,
      history,
      pushSnapshot,
      updateBoardWithConflicts,
      persistActiveState,
      checkCompletion,
    ]
  );

  const erase = useCallback(() => {
    if (isPaused || isCompleted || isGameOver || !selectedCell) return;
    const { row, col } = selectedCell;
    const targetCell = board[row][col];

    if (targetCell.isGiven) return;
    if (targetCell.value === null && (!targetCell.notes || targetCell.notes.length === 0)) return;

    pushSnapshot(board, hintsRemaining);

    let newBoard = cloneBoard(board);
    newBoard[row][col].value = null;
    newBoard[row][col].notes = undefined;
    newBoard[row][col].isUserEntered = false;
    newBoard[row][col].isError = false;
    newBoard[row][col].isConflict = false;

    newBoard = updateBoardWithConflicts(newBoard);
    setBoard(newBoard);

    const updatedHistory = [
      ...history,
      { board: cloneBoard(board), hintsRemaining },
    ];
    persistActiveState(newBoard, timeSeconds, mistakes, hintsRemaining, hintsUsed, updatedHistory);
  }, [
    isPaused,
    isCompleted,
    isGameOver,
    selectedCell,
    board,
    hintsRemaining,
    timeSeconds,
    mistakes,
    hintsUsed,
    history,
    pushSnapshot,
    updateBoardWithConflicts,
    persistActiveState,
  ]);

  const undo = useCallback(() => {
    if (isPaused || isCompleted || isGameOver || history.length === 0) return;

    const lastSnapshot = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    setHistory(newHistory);

    const restoredBoard = updateBoardWithConflicts(lastSnapshot.board);
    setBoard(restoredBoard);
    setHintsRemaining(lastSnapshot.hintsRemaining);

    persistActiveState(restoredBoard, timeSeconds, mistakes, lastSnapshot.hintsRemaining, hintsUsed, newHistory);
  }, [isPaused, isCompleted, isGameOver, history, timeSeconds, mistakes, hintsUsed, updateBoardWithConflicts, persistActiveState]);

  const applyHint = useCallback(() => {
    if (isPaused || isCompleted || isGameOver || hintsRemaining <= 0) return;

    const hint = getSmartHint(board, solution);
    if (!hint) return;

    if (board[hint.row][hint.col].isGiven) return;

    pushSnapshot(board, hintsRemaining);

    let newBoard = cloneBoard(board);
    newBoard[hint.row][hint.col].value = hint.value;
    newBoard[hint.row][hint.col].notes = undefined;
    newBoard[hint.row][hint.col].isGiven = false;
    newBoard[hint.row][hint.col].isUserEntered = true;

    // Auto clear notes
    const startRow = Math.floor(hint.row / 3) * 3;
    const startCol = Math.floor(hint.col / 3) * 3;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const isSameRow = r === hint.row;
        const isSameCol = c === hint.col;
        const isSameBox = r >= startRow && r < startRow + 3 && c >= startCol && c < startCol + 3;
        if ((isSameRow || isSameCol || isSameBox) && newBoard[r][c].notes) {
          newBoard[r][c].notes = newBoard[r][c].notes!.filter((n) => n !== hint.value);
        }
      }
    }

    newBoard = updateBoardWithConflicts(newBoard);
    setBoard(newBoard);
    setSelectedCell({ row: hint.row, col: hint.col });
    playDigitSound();

    const newRemaining = Math.max(0, hintsRemaining - 1);
    const newUsed = hintsUsed + 1;
    setHintsRemaining(newRemaining);
    setHintsUsed(newUsed);

    const updatedHistory = [
      ...history,
      { board: cloneBoard(board), hintsRemaining },
    ];

    persistActiveState(newBoard, timeSeconds, mistakes, newRemaining, newUsed, updatedHistory);
    checkCompletion(newBoard, mistakes, timeSeconds, newUsed);
  }, [
    isPaused,
    isCompleted,
    isGameOver,
    hintsRemaining,
    board,
    solution,
    hintsUsed,
    history,
    timeSeconds,
    mistakes,
    pushSnapshot,
    updateBoardWithConflicts,
    persistActiveState,
    checkCompletion,
  ]);

  const pauseGame = useCallback(() => {
    if (isCompleted || isGameOver) return;
    setIsPaused(true);
    persistActiveState(board, timeSeconds, mistakes, hintsRemaining, hintsUsed, history);
  }, [isCompleted, isGameOver, board, timeSeconds, mistakes, hintsRemaining, hintsUsed, history, persistActiveState]);

  const resumeGame = useCallback(() => {
    if (isCompleted || isGameOver) return;
    setIsPaused(false);
  }, [isCompleted, isGameOver]);

  const togglePause = useCallback(() => {
    if (isCompleted || isGameOver) return;
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        persistActiveState(board, timeSeconds, mistakes, hintsRemaining, hintsUsed, history);
      }
      return next;
    });
  }, [isCompleted, isGameOver, board, timeSeconds, mistakes, hintsRemaining, hintsUsed, history, persistActiveState]);

  const restartGame = useCallback(() => {
    const freshBoard = createInitialBoard(levelNumber);
    setBoard(freshBoard);
    setTimeSeconds(0);
    setMistakes(0);
    setHintsRemaining(3);
    setHintsUsed(0);
    setHistory([]);
    setSelectedCell({ row: 0, col: 0 });
    setIsPaused(false);
    setIsCompleted(false);
    setIsGameOver(false);
    clearActiveGame();
  }, [levelNumber]);

  const stars = calculateStarRating(mistakes);
  const accuracy = calculateAccuracy(mistakes);
  const formattedTime = formatTime(timeSeconds);

  return {
    board,
    selectedCell,
    notesActive,
    hintsRemaining,
    hintsUsed,
    numberCounts,
    timeSeconds,
    formattedTime,
    mistakes,
    isPaused,
    isCompleted,
    isGameOver,
    stars,
    accuracy,
    canUndo: history.length > 0,
    solution,
    selectCell,
    toggleNotesMode,
    inputDigit,
    erase,
    undo,
    applyHint,
    pauseGame,
    resumeGame,
    togglePause,
    restartGame,
  };
}

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Clock, Flag, Lightbulb, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { SudokuBoard } from '../components/SudokuBoard';
import { GameControls } from '../components/GameControls';
import { NumberPad } from '../components/NumberPad';
import { useSudokuGame } from '../hooks/useSudokuGame';
import { playClickSound } from '../utils/soundEngine';

export interface LevelCompleteData {
  levelNumber: number;
  difficultyLabel: string;
  timeString: string;
  timeSeconds: number;
  mistakes: number;
  accuracy: string;
  hintsUsed: number;
  stars: number;
}

interface GameScreenProps {
  levelNumber?: number;
  difficultyLabel?: string;
  onBackToLevels: () => void;
  onOpenSettings?: () => void;
  onOpenPause?: () => void;
  onLevelComplete?: (data: LevelCompleteData) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  levelNumber = 17,
  difficultyLabel = 'Medium',
  onBackToLevels,
  onOpenPause,
  onLevelComplete,
}) => {
  const {
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
    selectCell,
    toggleNotesMode,
    inputDigit,
    erase,
    undo,
    applyHint,
    pauseGame,
    restartGame,
  } = useSudokuGame(levelNumber);

  const [activeDigit, setActiveDigit] = useState<number | null>(5);
  const completedFired = useRef(false);

  // Sync activeDigit with selected cell's value or last input
  useEffect(() => {
    if (selectedCell) {
      const val = board[selectedCell.row]?.[selectedCell.col]?.value;
      if (val !== null && val !== undefined && val > 0) {
        setActiveDigit(val);
      }
    }
  }, [selectedCell, board]);

  // Handle Level Complete callback
  useEffect(() => {
    if (isCompleted && !completedFired.current) {
      completedFired.current = true;
      if (onLevelComplete) {
        onLevelComplete({
          levelNumber,
          difficultyLabel,
          timeString: formattedTime,
          timeSeconds,
          mistakes,
          accuracy,
          hintsUsed,
          stars,
        });
      }
    } else if (!isCompleted) {
      completedFired.current = false;
    }
  }, [
    isCompleted,
    levelNumber,
    difficultyLabel,
    formattedTime,
    timeSeconds,
    mistakes,
    accuracy,
    hintsUsed,
    stars,
    onLevelComplete,
  ]);

  // Keyboard navigation & digit input listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isCompleted || isGameOver) return;

      // Digits 1-9
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10);
        setActiveDigit(num);
        inputDigit(num);
        return;
      }

      // Notes mode toggle: 'N' or 'n'
      if (e.key === 'n' || e.key === 'N') {
        toggleNotesMode();
        return;
      }

      // Erase: Backspace or Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        erase();
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        undo();
        return;
      }

      // Arrow navigation
      if (selectedCell) {
        let { row, col } = selectedCell;
        if (e.key === 'ArrowUp') row = Math.max(0, row - 1);
        else if (e.key === 'ArrowDown') row = Math.min(8, row + 1);
        else if (e.key === 'ArrowLeft') col = Math.max(0, col - 1);
        else if (e.key === 'ArrowRight') col = Math.min(8, col + 1);

        if (row !== selectedCell.row || col !== selectedCell.col) {
          playClickSound();
          selectCell(row, col);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPaused,
    isCompleted,
    isGameOver,
    selectedCell,
    inputDigit,
    toggleNotesMode,
    erase,
    undo,
    selectCell,
  ]);

  const handleCellSelect = (r: number, c: number) => {
    if (isPaused || isCompleted || isGameOver) return;
    playClickSound();
    selectCell(r, c);
  };

  const handleNumberClick = (num: number) => {
    if (isPaused || isCompleted || isGameOver) return;
    setActiveDigit(num);
    inputDigit(num);
  };

  const handlePauseClick = () => {
    playClickSound();
    pauseGame();
    if (onOpenPause) onOpenPause();
  };

  const handleBackToLevels = () => {
    playClickSound();
    onBackToLevels();
  };

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-start select-none py-1.5 sm:py-3 px-2.5 sm:px-4 relative gap-1.5 sm:gap-2">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b border-[#D5DFC9] dark:border-[#35412B] bg-[#EAF0E2] dark:bg-[#192016] transition-colors rounded-t-xl">
        <button
          id="btn-game-back"
          type="button"
          onClick={handleBackToLevels}
          className="p-1.5 rounded-full hover:bg-[#DCE6D3] dark:hover:bg-[#20291B] text-[#242F1E] dark:text-[#F1F3E8] transition-colors cursor-pointer"
          aria-label="Back to Levels"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold tracking-wider text-[#242F1E] dark:text-[#F1F3E8] uppercase transition-colors">
          Active Game
        </span>

        <div className="w-7 h-7 rounded-full bg-[#242F1E] dark:bg-[#273322] flex items-center justify-center text-white dark:text-[#F1F3E8] transition-colors">
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* Subheader Level pill & Pause button */}
      <div className="px-2 pt-1 sm:px-4 sm:pt-2 flex items-center justify-between">
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#E2ECDA] dark:bg-[#20291B] text-[#26371D] dark:text-[#F1F3E8] border border-[#CBD8BF] dark:border-[#35412B] tracking-wide transition-colors">
          LEVEL {levelNumber} • {difficultyLabel}
        </span>

        <button
          id="btn-game-pause"
          type="button"
          onClick={handlePauseClick}
          className="w-7 h-7 rounded-lg bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] flex items-center justify-center text-[#242F1E] dark:text-[#F1F3E8] hover:bg-[#EEF3E8] dark:hover:bg-[#20291B] cursor-pointer shadow-xs transition-colors"
          aria-label="Pause Game"
        >
          <Pause className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>

      {/* Stats Row: Time & Mistakes */}
      <div className="px-2 pt-1 pb-0.5 sm:px-4 flex items-center justify-between text-xs font-bold text-[#242F1E] dark:text-[#F1F3E8] transition-colors">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] shadow-xs transition-colors">
          <Clock className="w-3.5 h-3.5 text-[#5B6E4F] dark:text-[#AEBB7A]" />
          <span className="text-[10px] text-[#697B5E] dark:text-[#AEB79B] tracking-wider uppercase font-bold transition-colors">
            TIME
          </span>
          <span className="font-extrabold">{formattedTime}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] shadow-xs transition-colors">
          <Flag className="w-3.5 h-3.5 text-[#C0392B] dark:text-[#E58A82]" />
          <span className="text-[10px] text-[#697B5E] dark:text-[#AEB79B] tracking-wider uppercase font-bold transition-colors">
            MISTAKES
          </span>
          <span className="font-extrabold">
            <span className="text-[#C0392B] dark:text-[#E58A82]">{mistakes}</span> / 3
          </span>
        </div>
      </div>

      {/* 9x9 Sudoku Board */}
      <div className="px-2 py-0.5 sm:px-4 sm:py-1 flex justify-center w-full">
        <SudokuBoard
          board={board}
          selectedCell={selectedCell}
          onSelectCell={handleCellSelect}
          activeDigit={activeDigit}
        />
      </div>

      {/* Controls Row: Undo, Erase, Notes, Hint */}
      <div className="px-2 py-0.5 sm:px-4 sm:py-1">
        <GameControls
          isNotesMode={notesActive}
          hintsRemaining={hintsRemaining}
          onUndo={() => {
            playClickSound();
            undo();
          }}
          onErase={() => {
            playClickSound();
            erase();
          }}
          onToggleNotes={toggleNotesMode}
          onHint={applyHint}
        />
      </div>

      {/* Number Pad: 1-9 in horizontal strip with remaining counts */}
      <div className="px-2 py-0.5 sm:px-4 sm:py-1">
        <NumberPad
          numberCounts={numberCounts}
          selectedNumber={activeDigit}
          onNumberClick={handleNumberClick}
        />
      </div>

      {/* Bottom Footer: Hint Tip */}
      <div className="px-2 pt-1 flex items-center justify-between text-[11px] text-[#4E6240] dark:text-[#AEB79B] border-t border-[#D5DFC9]/70 dark:border-[#35412B]/70 mt-0.5 transition-colors">
        <div className="flex items-center gap-1.5 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-[#546A44] dark:text-[#AEBB7A]" />
          <span>Find the solitary row note</span>
        </div>

        <span className="text-[10px] font-bold tracking-wider uppercase text-[#242F1E] dark:text-[#F1F3E8] bg-[#E2ECDA] dark:bg-[#20291B] px-2 py-0.5 rounded border border-[#CBD8BF] dark:border-[#35412B] transition-colors">
          SUDOKU PRO
        </span>
      </div>

      {/* Game Over Modal Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-[#212C1B]/80 dark:bg-[#11160F]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 rounded-3xl">
          <div className="bg-white dark:bg-[#192016] rounded-2xl border border-[#D5DFC9] dark:border-[#35412B] p-6 shadow-xl text-center max-w-[320px] w-full transition-colors">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#FDEDEC] dark:bg-[#442220] border border-[#FADBD8] dark:border-[#682A2A] flex items-center justify-center text-[#C0392B] dark:text-[#E58A82]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-black tracking-wider text-[#1E2818] dark:text-[#F1F3E8] uppercase transition-colors">
              GAME OVER
            </h2>
            <p className="text-xs text-[#5E7153] dark:text-[#AEB79B] mt-1 font-medium transition-colors">
              You reached 3 mistakes on Level {levelNumber}.
            </p>

            <div className="flex flex-col gap-2.5 pt-5">
              <button
                id="btn-gameover-restart"
                type="button"
                onClick={() => {
                  playClickSound();
                  restartGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#212C1B] dark:bg-[#273322] hover:bg-[#1A2315] dark:hover:bg-[#303F2A] active:scale-[0.99] text-white dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-[#35412B]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART PUZZLE</span>
              </button>

              <button
                id="btn-gameover-levels"
                type="button"
                onClick={handleBackToLevels}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] hover:bg-[#F2F6ED] dark:hover:bg-[#20291B] active:scale-[0.99] text-[#242F1E] dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
              >
                LEVEL SELECTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

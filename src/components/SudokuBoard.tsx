import React from 'react';
import { SudokuCell } from '../types/sudoku';

interface SudokuBoardProps {
  board: SudokuCell[][];
  selectedCell: { row: number; col: number } | null;
  onSelectCell?: (row: number, col: number) => void;
  activeDigit?: number | null;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  onSelectCell,
  activeDigit = 5,
}) => {
  const selectedValue =
    selectedCell !== null
      ? board[selectedCell.row]?.[selectedCell.col]?.value
      : activeDigit ?? null;

  return (
    <div
      className="w-full max-w-[360px] aspect-square mx-auto rounded-xl overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--sudoku-board-surface)',
        border: '2px solid var(--sudoku-board-border)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        padding: '2px',
      }}
    >
      <div
        className="grid grid-cols-9 grid-rows-9 w-full h-full gap-[1px]"
        style={{ backgroundColor: 'var(--sudoku-grid-line)' }}
      >
        {board.map((rowCells, rIdx) =>
          rowCells.map((cell, cIdx) => {
            const isSelected =
              selectedCell?.row === rIdx && selectedCell?.col === cIdx;

            const isSameRowOrCol =
              selectedCell !== null &&
              (selectedCell.row === rIdx || selectedCell.col === cIdx);

            const isSameBlock =
              selectedCell !== null &&
              Math.floor(selectedCell.row / 3) === Math.floor(rIdx / 3) &&
              Math.floor(selectedCell.col / 3) === Math.floor(cIdx / 3);

            const isSameValue =
              selectedValue !== null &&
              cell.value !== null &&
              cell.value === selectedValue;

            // 3x3 block border styling — thicker + colored borders at subgrid edges
            const blockBorders: React.CSSProperties = {};
            if (cIdx % 3 === 2 && cIdx !== 8) {
              blockBorders.borderRight = '2px solid var(--sudoku-block-border)';
            }
            if (rIdx % 3 === 2 && rIdx !== 8) {
              blockBorders.borderBottom = '2px solid var(--sudoku-block-border)';
            }

            // Error state
            const isErrorCell = Boolean(cell.isError || cell.isConflict);

            // Background — state priority: Error > Selected > SameValue > Related > Default
            let bgColor = 'var(--sudoku-cell-bg)';
            let ringStyle: React.CSSProperties = {};

            if (isErrorCell) {
              bgColor = 'var(--sudoku-error-bg)';
            } else if (isSelected) {
              bgColor = 'var(--sudoku-cell-selected)';
              ringStyle = {
                boxShadow: 'inset 0 0 0 2px var(--sudoku-cell-selected-ring)',
              };
            } else if (isSameValue) {
              bgColor = 'var(--sudoku-cell-same)';
            } else if (isSameRowOrCol || isSameBlock) {
              bgColor = 'var(--sudoku-cell-related)';
            }

            // Text color — priority: Error > Player > Given
            let textColor = 'var(--sudoku-given-color)';
            let fontWeight: React.CSSProperties['fontWeight'] = 700; // font-bold for player
            let fontSize = ''; // default

            if (isErrorCell) {
              textColor = 'var(--sudoku-error-color)';
              fontWeight = 700;
            } else if (!cell.isGiven && cell.value !== null) {
              // Player-entered: olive accent
              textColor = 'var(--sudoku-user-color)';
              fontWeight = 700;
            } else if (cell.isGiven) {
              // Given: parchment white (dark) / charcoal (light), heaviest weight
              textColor = 'var(--sudoku-given-color)';
              fontWeight = 900; // font-black
            }

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                id={`cell-${rIdx}-${cIdx}`}
                type="button"
                onClick={() => onSelectCell?.(rIdx, cIdx)}
                className="relative flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  backgroundColor: bgColor,
                  ...blockBorders,
                  ...ringStyle,
                }}
                aria-label={`Row ${rIdx + 1} Column ${cIdx + 1}, Value ${cell.value || 'Empty'}`}
              >
                {cell.value !== null ? (
                  <span
                    className="text-lg sm:text-2xl leading-none"
                    style={{
                      color: textColor,
                      fontWeight: fontWeight,
                    }}
                  >
                    {cell.value}
                  </span>
                ) : cell.notes && cell.notes.length > 0 ? (
                  <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-[1px] sm:p-0.5 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <span
                        key={n}
                        className="text-[8px] sm:text-[9px] leading-tight flex items-center justify-center"
                        style={{
                          color: 'var(--sudoku-note-color)',
                          fontWeight: 500,
                        }}
                      >
                        {cell.notes?.includes(n) ? n : ''}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

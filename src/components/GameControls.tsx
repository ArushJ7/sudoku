import React from 'react';
import { Undo2, Eraser, Pencil, Lightbulb } from 'lucide-react';

interface GameControlsProps {
  isNotesMode?: boolean;
  hintsRemaining?: number;
  onUndo?: () => void;
  onErase?: () => void;
  onToggleNotes?: () => void;
  onHint?: () => void;
  disabled?: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isNotesMode = true,
  hintsRemaining = 3,
  onUndo,
  onErase,
  onToggleNotes,
  onHint,
  disabled = false,
}) => {
  return (
    <div className="w-full max-w-[360px] mx-auto grid grid-cols-4 gap-2 select-none">
      {/* Undo */}
      <button
        id="btn-control-undo"
        type="button"
        disabled={disabled}
        onClick={onUndo}
        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DEC9] dark:border-[#35412B] text-[#242F1E] dark:text-[#F1F3E8] hover:bg-[#F0F5EB] dark:hover:bg-[#20291B] active:scale-95 transition-all shadow-xs cursor-pointer"
        aria-label="Undo move"
      >
        <Undo2 className="w-4 h-4 mb-1 text-[#242F1E] dark:text-[#F1F3E8] transition-colors" />
        <span className="text-[10px] font-bold tracking-wider text-[#242F1E] dark:text-[#F1F3E8] uppercase transition-colors">
          UNDO
        </span>
      </button>

      {/* Erase */}
      <button
        id="btn-control-erase"
        type="button"
        disabled={disabled}
        onClick={onErase}
        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DEC9] dark:border-[#35412B] text-[#242F1E] dark:text-[#F1F3E8] hover:bg-[#F0F5EB] dark:hover:bg-[#20291B] active:scale-95 transition-all shadow-xs cursor-pointer"
        aria-label="Erase cell"
      >
        <Eraser className="w-4 h-4 mb-1 text-[#242F1E] dark:text-[#F1F3E8] transition-colors" />
        <span className="text-[10px] font-bold tracking-wider text-[#242F1E] dark:text-[#F1F3E8] uppercase transition-colors">
          ERASE
        </span>
      </button>

      {/* Pencil / Notes Mode */}
      <button
        id="btn-control-notes"
        type="button"
        disabled={disabled}
        onClick={onToggleNotes}
        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all shadow-xs cursor-pointer ${
          isNotesMode
            ? 'bg-[#212C1B] dark:bg-[#273322] text-white dark:text-[#F1F3E8] border border-[#212C1B] dark:border-[#AEBB7A]'
            : 'bg-white dark:bg-[#192016] border border-[#D5DEC9] dark:border-[#35412B] text-[#242F1E] dark:text-[#F1F3E8] hover:bg-[#F0F5EB] dark:hover:bg-[#20291B]'
        }`}
        aria-label={`Notes mode ${isNotesMode ? 'On' : 'Off'}`}
      >
        <div className="flex items-center gap-0.5 mb-1">
          <Pencil className={`w-4 h-4 ${isNotesMode ? 'text-white dark:text-[#F1F3E8]' : 'text-[#242F1E] dark:text-[#F1F3E8]'}`} />
          {isNotesMode && <span className="text-[10px] font-black leading-none">+</span>}
        </div>
        <span
          className={`text-[10px] font-bold tracking-wider uppercase ${
            isNotesMode ? 'text-white dark:text-[#F1F3E8]' : 'text-[#242F1E] dark:text-[#F1F3E8]'
          }`}
        >
          NOTES {isNotesMode ? '•' : ''}
        </span>
      </button>

      {/* Hint */}
      <button
        id="btn-control-hint"
        type="button"
        disabled={disabled}
        onClick={onHint}
        className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DEC9] dark:border-[#35412B] text-[#242F1E] dark:text-[#F1F3E8] hover:bg-[#F0F5EB] dark:hover:bg-[#20291B] active:scale-95 transition-all shadow-xs cursor-pointer"
        aria-label={`Hint (${hintsRemaining} left)`}
      >
        <Lightbulb className="w-4 h-4 mb-1 text-[#242F1E] dark:text-[#F1F3E8] transition-colors" />
        <span className="text-[10px] font-bold tracking-wider text-[#242F1E] dark:text-[#F1F3E8] uppercase transition-colors">
          HINT
        </span>
      </button>
    </div>
  );
};

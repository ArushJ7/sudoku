import React from 'react';
import { Star, ArrowRight, Grid, Eye, CheckCircle2 } from 'lucide-react';

interface LevelCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextLevel: () => void;
  onExitToLevels: () => void;
  onReviewBoard?: () => void;
  levelNumber?: number;
  timeString?: string;
  accuracy?: string;
  stars?: number;
}

export const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({
  isOpen,
  onClose,
  onNextLevel,
  onExitToLevels,
  onReviewBoard,
  levelNumber = 14,
  timeString = '05:42',
  accuracy = '98%',
  stars = 3,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="completion-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E261A]/40 backdrop-blur-[2px] transition-all"
    >
      <div
        id="completion-modal-card"
        className="relative w-full max-w-sm bg-[#FAF9F5] rounded-2xl border-2 border-[#BAC7AF] p-6 shadow-xl text-center"
      >
        {/* Decorative Badge */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#EAF0E2] border border-[#BAC8AE] flex items-center justify-center text-[#556947]">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-[#222E1B]">
          Level Complete!
        </h2>
        <p className="text-xs text-[#6A7C5F] mt-1">
          Level {levelNumber} • Calm Difficulty
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`p-2 rounded-xl border transition-all ${
                starIndex <= stars
                  ? 'bg-[#EBF2E3] border-[#7F946F] text-[#556947]'
                  : 'bg-[#F2F4EF] border-[#DFE3DA] text-[#BAC4B3]'
              }`}
            >
              <Star
                className={`w-6 h-6 ${
                  starIndex <= stars ? 'fill-[#607452] text-[#607452]' : 'text-[#C5CEBF]'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Performance metrics */}
        <div className="my-5 py-3 px-4 rounded-xl bg-[#F0F5EC] border border-[#DAE3D2] grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="block text-[10px] text-[#718265] uppercase font-semibold tracking-wider">
              Time
            </span>
            <span className="text-sm font-bold text-[#273420]">{timeString}</span>
          </div>
          <div className="border-x border-[#D2DCB6]/70">
            <span className="block text-[10px] text-[#718265] uppercase font-semibold tracking-wider">
              Accuracy
            </span>
            <span className="text-sm font-bold text-[#273420]">{accuracy}</span>
          </div>
          <div>
            <span className="block text-[10px] text-[#718265] uppercase font-semibold tracking-wider">
              Score
            </span>
            <span className="text-sm font-bold text-[#273420]">+850</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-completion-next"
            type="button"
            onClick={onNextLevel}
            className="w-full py-3 px-4 rounded-xl bg-[#596B48] hover:bg-[#4C5C3D] active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Next Puzzle
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-completion-levels"
              type="button"
              onClick={onExitToLevels}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#D0DAC7] hover:bg-[#F2F6ED] text-[#3D4D32] font-medium text-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              Level Select
            </button>

            <button
              id="btn-completion-review"
              type="button"
              onClick={() => {
                onReviewBoard?.();
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-white border border-[#D0DAC7] hover:bg-[#F2F6ED] text-[#3D4D32] font-medium text-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Review Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

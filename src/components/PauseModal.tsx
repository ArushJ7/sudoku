import React from 'react';
import { Play, RotateCcw, Grid, Volume2, VolumeX, X } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExitToLevels: () => void;
  levelNumber?: number;
  timeString?: string;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onClose,
  onResume,
  onRestart,
  onExitToLevels,
  levelNumber = 14,
  timeString = '04:28',
}) => {
  const [soundOn, setSoundOn] = React.useState(true);

  if (!isOpen) return null;

  return (
    <div
      id="pause-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E261A]/40 backdrop-blur-[2px] transition-all"
    >
      <div
        id="pause-modal-card"
        className="relative w-full max-w-sm bg-[#FAF9F5] rounded-2xl border border-[#C5D0BD] p-6 shadow-xl text-center"
      >
        {/* Close Button */}
        <button
          id="btn-pause-close"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#6E7E63] hover:bg-[#EEF2E8] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#EBF0E4] border border-[#BAC8AF] flex items-center justify-center text-[#556947]">
          <Play className="w-5 h-5 fill-current ml-0.5" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-[#242F1E]">
          Game Paused
        </h2>
        <p className="text-xs text-[#6B7C60] mt-1 font-medium">
          Level {levelNumber} • Calm Mode
        </p>

        {/* Mini stats preview */}
        <div className="my-5 py-3 px-4 rounded-xl bg-[#F0F4EC] border border-[#DCE4D4] flex items-center justify-around text-center">
          <div>
            <span className="block text-[11px] text-[#718265] uppercase font-semibold tracking-wider">
              Elapsed
            </span>
            <span className="text-base font-bold text-[#2A3723]">{timeString}</span>
          </div>
          <div className="w-px h-6 bg-[#D1DBC7]" />
          <div>
            <span className="block text-[11px] text-[#718265] uppercase font-semibold tracking-wider">
              Mistakes
            </span>
            <span className="text-base font-bold text-[#2A3723]">1 / 3</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-pause-resume"
            type="button"
            onClick={onResume}
            className="w-full py-3 px-4 rounded-xl bg-[#596B48] hover:bg-[#4C5C3D] active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Resume Puzzle
          </button>

          <button
            id="btn-pause-restart"
            type="button"
            onClick={onRestart}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#D0DAC7] hover:bg-[#F2F6ED] text-[#3D4D32] font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Level
          </button>

          <button
            id="btn-pause-levels"
            type="button"
            onClick={onExitToLevels}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#D0DAC7] hover:bg-[#F2F6ED] text-[#3D4D32] font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            Level Select
          </button>
        </div>

        {/* Bottom Quick Controls */}
        <div className="mt-5 pt-4 border-t border-[#E3E9DC] flex items-center justify-between text-xs text-[#5D6F51]">
          <span>Sound Effects</span>
          <button
            id="btn-pause-sound-toggle"
            type="button"
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-lg border border-[#D1DBC7] hover:bg-[#EBF1E4] text-[#4E6042] cursor-pointer"
            aria-label="Toggle sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

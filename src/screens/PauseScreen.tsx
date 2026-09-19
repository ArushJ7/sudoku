import React, { useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Volume2, CheckSquare, User, Pause } from 'lucide-react';

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
  onExitToLevels: () => void;
  onBack?: () => void;
  levelNumber?: number;
  timeString?: string;
  solvedCount?: number;
  mistakes?: number;
}

export const PauseScreen: React.FC<PauseScreenProps> = ({
  onResume,
  onRestart,
  onExitToLevels,
  onBack,
  levelNumber = 17,
  timeString = '04:32',
  solvedCount = 42,
  mistakes = 1,
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [autoCheckOn, setAutoCheckOn] = useState(true);

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-start select-none pb-4 sm:pb-6 gap-3 sm:gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b border-[#D5DFC9] dark:border-[#35412B] bg-[#EAF0E2] dark:bg-[#192016] transition-colors rounded-t-xl">
        <button
          id="btn-pause-header-back"
          type="button"
          onClick={onBack || onResume}
          className="p-1.5 rounded-full hover:bg-[#DCE6D3] dark:hover:bg-[#20291B] text-[#242F1E] dark:text-[#F1F3E8] transition-colors cursor-pointer"
          aria-label="Back"
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

      {/* Main Centered Pause Card */}
      <div className="px-3.5 pt-2 sm:px-4 sm:pt-3">
        <div className="bg-white dark:bg-[#192016] rounded-2xl border border-[#D5DFC9] dark:border-[#35412B] p-6 shadow-sm text-center transition-colors">
          {/* Pause Icon Box */}
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#E2ECDA] dark:bg-[#273322] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#212C1B] dark:text-[#AEBB7A] transition-colors">
            <Pause className="w-5 h-5 fill-current" />
          </div>

          <h2 className="text-2xl font-black tracking-widest text-[#1E2818] dark:text-[#F1F3E8] uppercase transition-colors">
            PAUSED
          </h2>
          <p className="text-xs text-[#5E7153] dark:text-[#AEB79B] mt-1 font-medium transition-colors">
            Level {levelNumber} • Medium • {timeString} Elapsed
          </p>

          {/* Progress and Accuracy */}
          <div className="my-5 pt-3 border-t border-[#EEF3EA] dark:border-[#2A3424] space-y-2.5 text-left transition-colors">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-[#2A3B22] dark:text-[#F1F3E8] mb-1 transition-colors">
                <span>Progress</span>
                <span>{solvedCount} / 81 Solved</span>
              </div>
              <div className="w-full h-2 bg-[#E2ECDA] dark:bg-[#34412B] rounded-full overflow-hidden transition-colors">
                <div
                  className="h-full bg-[#394B2E] dark:bg-[#899A5F] rounded-full"
                  style={{ width: `${Math.round((solvedCount / 81) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-bold text-[#2A3B22] dark:text-[#F1F3E8] pt-1 transition-colors">
              <span>Accuracy</span>
              <span className="text-[#C0392B] dark:text-[#E58A82] font-semibold flex items-center gap-1">
                <span>⚐</span> {mistakes} Mistake
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              id="btn-pause-resume"
              type="button"
              onClick={onResume}
              className="w-full py-3 px-4 rounded-xl bg-[#212C1B] dark:bg-[#273322] hover:bg-[#1A2315] dark:hover:bg-[#303F2A] active:scale-[0.99] text-white dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-[#35412B]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RESUME</span>
            </button>

            <button
              id="btn-pause-restart"
              type="button"
              onClick={onRestart}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] hover:bg-[#F2F6ED] dark:hover:bg-[#20291B] active:scale-[0.99] text-[#242F1E] dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART PUZZLE</span>
            </button>

            <button
              id="btn-pause-levels"
              type="button"
              onClick={onExitToLevels}
              className="mt-1 py-1 text-xs font-bold tracking-wider uppercase text-[#546847] dark:text-[#AEBB7A] hover:text-[#212C1B] dark:hover:text-[#F1F3E8] transition-colors cursor-pointer"
            >
              LEVEL SELECTION
            </button>
          </div>

          {/* Bottom Quick Toggles */}
          <div className="mt-5 pt-4 border-t border-[#EEF3EA] dark:border-[#2A3424] flex items-center justify-center gap-4 text-xs font-semibold text-[#485B3A] dark:text-[#AEB79B] transition-colors">
            <button
              id="btn-pause-toggle-sound"
              type="button"
              onClick={() => setSoundOn(!soundOn)}
              className="flex items-center gap-1.5 hover:text-[#212C1B] dark:hover:text-[#F1F3E8] cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Sound: {soundOn ? 'ON' : 'OFF'}</span>
            </button>

            <span className="text-[#CBD8BF] dark:text-[#35412B]">•</span>

            <button
              id="btn-pause-toggle-autocheck"
              type="button"
              onClick={() => setAutoCheckOn(!autoCheckOn)}
              className="flex items-center gap-1.5 hover:text-[#212C1B] dark:hover:text-[#F1F3E8] cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Auto-check: {autoCheckOn ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="pb-4 text-center">
        <span className="text-[10px] text-[#788C6C] dark:text-[#8F997F] font-semibold tracking-wider uppercase transition-colors">
          Focus is restored in stillness
        </span>
      </div>
    </div>
  );
};

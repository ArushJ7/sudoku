import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Grid3X3, Sparkles, User, Award, CheckCircle2, Clock } from 'lucide-react';

interface LevelCompleteScreenProps {
  levelNumber?: number;
  difficultyLabel?: string;
  timeString?: string;
  mistakes?: number;
  accuracy?: string;
  onNextLevel: () => void;
  onReplay: () => void;
  onAllLevels: () => void;
  onBack?: () => void;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  levelNumber = 17,
  difficultyLabel = 'Medium Matrix',
  timeString = '04:32',
  mistakes = 1,
  accuracy = '98.8%',
  onNextLevel,
  onReplay,
  onAllLevels,
  onBack,
}) => {
  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-start select-none pb-4 sm:pb-6 gap-3 sm:gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b border-[#D5DFC9] dark:border-[#35412B] bg-[#EAF0E2] dark:bg-[#192016] transition-colors rounded-t-xl">
        <button
          id="btn-complete-back"
          type="button"
          onClick={onBack || onAllLevels}
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

      {/* Main Centered Card */}
      <div className="px-3.5 pt-2 sm:px-4 sm:pt-3">
        <div className="bg-white dark:bg-[#192016] rounded-2xl border border-[#D5DFC9] dark:border-[#35412B] p-6 shadow-sm text-center transition-colors">
          {/* Trophy Badge */}
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-[#EAF0E2] dark:bg-[#273322] border border-[#BACAA8] dark:border-[#35412B] flex items-center justify-center text-[#3D5230] dark:text-[#AEBB7A] transition-colors">
            <Award className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-black tracking-widest text-[#1E2818] dark:text-[#F1F3E8] uppercase transition-colors">
            LEVEL COMPLETE
          </h2>
          <p className="text-xs text-[#5E7153] dark:text-[#AEB79B] mt-0.5 font-medium transition-colors">
            Level {levelNumber} • {difficultyLabel}
          </p>

          {/* New Best Time Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2ECDA] dark:bg-[#20291B] border border-[#CBD8BF] dark:border-[#35412B] text-[#2B3C21] dark:text-[#AEBB7A] text-[11px] font-bold my-2.5 shadow-xs transition-colors">
            <Sparkles className="w-3 h-3 text-[#4A5F3C] dark:text-[#AEBB7A]" />
            <span>NEW BEST TIME</span>
          </div>

          {/* Dots / Stars Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#242F1E] dark:bg-[#AEBB7A]" />
            <span className="w-2 h-2 rounded-full bg-[#242F1E] dark:bg-[#AEBB7A]" />
            <span className="w-2 h-2 rounded-full bg-[#242F1E] dark:bg-[#AEBB7A]" />
          </div>

          {/* Performance Grid */}
          <div className="bg-[#F5F8F2] dark:bg-[#20291B] rounded-xl p-3.5 border border-[#DCE5D4] dark:border-[#35412B] text-left space-y-2.5 text-xs transition-colors">
            {/* Solving Time */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#6C7E61] dark:text-[#AEB79B] block transition-colors">
                  SOLVING TIME
                </span>
                <span className="text-sm font-extrabold text-[#1E2818] dark:text-[#F1F3E8] transition-colors">{timeString}</span>
              </div>
              <span className="text-[10px] font-semibold text-[#485E39] dark:text-[#AEBB7A] flex items-center gap-1 transition-colors">
                <Clock className="w-3 h-3" />
                -18s faster than average
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E3ECE0] dark:border-[#2A3424]">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#6C7E61] dark:text-[#AEB79B] block transition-colors">
                  MISTAKES
                </span>
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] transition-colors">{mistakes} / 3</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#6C7E61] dark:text-[#AEB79B] block transition-colors">
                  ACCURACY
                </span>
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] flex items-center gap-1 transition-colors">
                  {accuracy} <CheckCircle2 className="w-3 h-3 text-[#485E39] dark:text-[#AEBB7A]" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E3ECE0] dark:border-[#2A3424]">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#6C7E61] dark:text-[#AEB79B] block transition-colors">
                  HINTS
                </span>
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] transition-colors">0</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#6C7E61] dark:text-[#AEB79B] block transition-colors">
                  PERSONAL RECORD
                </span>
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] flex items-center gap-1 transition-colors">
                  {timeString} 🏆
                </span>
              </div>
            </div>

            {/* Matrix 17 Sealed */}
            <div className="pt-2 border-t border-[#E3ECE0] dark:border-[#2A3424] flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#E2ECDA] dark:bg-[#273322] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#2F4024] dark:text-[#AEBB7A] font-bold text-[10px]">
                ☷
              </div>
              <span className="text-[10px] font-medium text-[#5B6E4F] dark:text-[#AEB79B] transition-colors">
                Matrix {levelNumber} Sealed • 81 cells harmoniously resolved
              </span>
            </div>
          </div>

          {/* Action Button: Next Matrix */}
          <div className="flex flex-col gap-2.5 pt-4">
            <button
              id="btn-complete-next"
              type="button"
              onClick={onNextLevel}
              className="w-full py-3.5 px-4 rounded-xl bg-[#212C1B] dark:bg-[#273322] hover:bg-[#1A2315] dark:hover:bg-[#303F2A] active:scale-[0.99] text-white dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-[#35412B]"
            >
              <span>NEXT MATRIX: Play Level {levelNumber + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-complete-replay"
                type="button"
                onClick={onReplay}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] hover:bg-[#F2F6ED] dark:hover:bg-[#20291B] active:scale-[0.99] text-[#242F1E] dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REPLAY</span>
              </button>

              <button
                id="btn-complete-alllevels"
                type="button"
                onClick={onAllLevels}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#192016] border border-[#D5DFC9] dark:border-[#35412B] hover:bg-[#F2F6ED] dark:hover:bg-[#20291B] active:scale-[0.99] text-[#242F1E] dark:text-[#F1F3E8] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>ALL LEVELS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="px-6 pb-4 text-center">
        <p className="text-[10px] italic text-[#637756] dark:text-[#AEB79B] leading-relaxed transition-colors">
          "Order emerges not from haste, but from the patient elimination of doubt."
        </p>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Lock, User, Sparkles } from 'lucide-react';
import { loadAchievements } from '../utils/achievementsEngine';
import { loadPlayerProgress } from '../utils/storage';
import { playClickSound } from '../utils/soundEngine';

interface AchievementsScreenProps {
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onBack }) => {
  const achievements = useMemo(() => {
    const progress = loadPlayerProgress();
    return loadAchievements(progress);
  }, []);

  const achievedHonors = achievements.filter((a) => a.unlocked);
  const inProgress = achievements.filter((a) => !a.unlocked);

  const unlockedCount = achievedHonors.length;
  const percentage = Math.round((unlockedCount / 7) * 100);

  const handleBack = () => {
    playClickSound();
    onBack();
  };

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-start select-none pb-4 sm:pb-6 gap-3 sm:gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b border-[#D5DFC9] dark:border-[#35412B] bg-[#EAF0E2] dark:bg-[#192016] transition-colors rounded-t-xl">
        <button
          id="btn-achievements-back"
          type="button"
          onClick={handleBack}
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

      {/* Main Content */}
      <div className="px-3.5 pt-3 sm:px-4 sm:pt-4 flex flex-col gap-3.5 sm:gap-4">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-xl font-black text-[#1E2818] dark:text-[#F1F3E8] tracking-tight transition-colors">
            BADGES & HONORS
          </h1>
          <p className="text-xs text-[#586A4C] dark:text-[#AEB79B] font-semibold mt-0.5 transition-colors">
            Milestones of focus & mastery.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-[#E7EFE0] dark:bg-[#20291B] rounded-2xl p-3.5 border border-[#D1DECA] dark:border-[#35412B] transition-colors">
          <div className="flex items-center justify-between text-xs font-extrabold text-[#242F1E] dark:text-[#F1F3E8] mb-1.5 transition-colors">
            <span className="text-[10px] tracking-wider uppercase font-black">
              {unlockedCount} OF 7 UNLOCKED
            </span>
            <span className="text-xs font-bold text-[#4B603D] dark:text-[#AEBB7A]">{percentage}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-[#D2E0CB] dark:bg-[#34412B] rounded-full overflow-hidden transition-colors">
            <div
              className="h-full bg-[#212C1B] dark:bg-[#899A5F] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Section: ACHIEVED HONORS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#242F1E] dark:text-[#F1F3E8] transition-colors">
            <span className="text-[10px] tracking-wider uppercase font-extrabold">
              ACHIEVED HONORS
            </span>
            <span className="text-[11px] text-[#637657] dark:text-[#AEB79B] font-semibold transition-colors">
              {unlockedCount} {unlockedCount === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {achievedHonors.length === 0 ? (
              <div className="bg-white dark:bg-[#192016] rounded-2xl p-3.5 border border-[#D5DFC9] dark:border-[#35412B] text-center text-xs text-[#6A7F5F] dark:text-[#8F997F] font-medium transition-colors">
                No honors achieved yet. Complete Level 1 to earn your first badge!
              </div>
            ) : (
              achievedHonors.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#192016] rounded-2xl p-3.5 border border-[#D5DFC9] dark:border-[#35412B] shadow-xs flex items-center justify-between transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#E5EEDF] dark:bg-[#273322] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#3D5230] dark:text-[#AEBB7A] mt-0.5 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] tracking-wide uppercase transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#556948] dark:text-[#AEB79B] font-medium leading-tight mt-0.5 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EEDF] dark:bg-[#273322] text-[#344629] dark:text-[#AEBB7A] border border-[#CAD7C0] dark:border-[#35412B] transition-colors">
                    Unlocked
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section: IN PROGRESS */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#242F1E] dark:text-[#F1F3E8] transition-colors">
            <span className="text-[10px] tracking-wider uppercase font-extrabold">
              IN PROGRESS
            </span>
            <span className="text-[11px] text-[#637657] dark:text-[#AEB79B] font-semibold transition-colors">
              {inProgress.length} Remaining
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {inProgress.map((item) => (
              <div
                key={item.id}
                className="bg-[#F3F7EE] dark:bg-[#20291B] rounded-2xl p-3.5 border border-[#D5DFC9] dark:border-[#35412B] flex items-center justify-between opacity-85 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#E2ECDA] dark:bg-[#151B12] border border-[#CBD8BF] dark:border-[#2A3424] flex items-center justify-center text-[#6A7F5F] dark:text-[#8F997F] mt-0.5 transition-colors">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2B3924] dark:text-[#F1F3E8] tracking-wide uppercase transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#556948] dark:text-[#8F997F] font-medium leading-tight mt-0.5 transition-colors">
                      {item.description}
                    </p>
                    {item.currentValue && item.targetValue && (
                      <span className="text-[10px] text-[#425536] dark:text-[#AEBB7A] font-bold block mt-1 transition-colors">
                        Progress: {item.currentValue} / {item.targetValue}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2ECDA] dark:bg-[#151B12] text-[#637656] dark:text-[#8F997F] border border-[#CBD8BF] dark:border-[#2A3424] flex items-center gap-1 transition-colors">
                  <Lock className="w-2.5 h-2.5" />
                  Locked
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Refined Focus Philosophy Note Card */}
        <div className="bg-[#E7EFE0] dark:bg-[#20291B] rounded-2xl p-3.5 border border-[#D1DECA] dark:border-[#35412B] flex items-start gap-3 mt-2 transition-colors">
          <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#273322] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#2A3B22] dark:text-[#AEBB7A] shrink-0 mt-0.5 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] transition-colors">Refined Focus</h4>
            <p className="text-[11px] text-[#556948] dark:text-[#AEB79B] font-medium leading-relaxed mt-0.5 transition-colors">
              Completing milestones deepens concentration and reveals quiet clarity in every grid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { ArrowLeft, Check, Lock, Play, User, Star } from 'lucide-react';
import { LevelItem } from '../types/sudoku';
import { mockLevels } from '../data/mockSudoku';
import { loadPlayerProgress, loadActiveGame } from '../utils/storage';

interface LevelSelectScreenProps {
  onBack: () => void;
  onSelectLevel: (level: LevelItem) => void;
  currentLevelNumber?: number;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onBack,
  onSelectLevel,
  currentLevelNumber = 1,
}) => {
  const progress = useMemo(() => loadPlayerProgress(), []);
  const activeGame = useMemo(() => loadActiveGame(), []);

  const activeLevelNumber = activeGame?.levelNumber || currentLevelNumber || progress.unlockedLevel;

  const currentLevelItem =
    mockLevels.find((l) => l.levelNumber === activeLevelNumber) || mockLevels[0];

  const totalCompleted = progress.completedLevels.length;
  const masteryPercentage = Math.round((totalCompleted / 50) * 100);

  const getTierStats = (start: number, end: number) => {
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (progress.completedLevels.includes(i)) count++;
    }
    return count;
  };

  const easyCompleted = getTierStats(1, 10);
  const mediumCompleted = getTierStats(11, 20);
  const hardCompleted = getTierStats(21, 30);
  const expertCompleted = getTierStats(31, 40);
  const masterCompleted = getTierStats(41, 50);

  const categories = [
    {
      name: '1. EASY',
      icon: easyCompleted === 10 ? 'check' : easyCompleted > 0 ? 'bullet' : 'lock',
      status: `${easyCompleted}/10 Complete`,
      levels: mockLevels.slice(0, 10),
    },
    {
      name: '2. MEDIUM',
      icon: mediumCompleted === 10 ? 'check' : mediumCompleted > 0 ? 'bullet' : 'lock',
      status: `${mediumCompleted}/10 Complete`,
      levels: mockLevels.slice(10, 20),
    },
    {
      name: '3. HARD',
      icon: hardCompleted === 10 ? 'check' : hardCompleted > 0 ? 'bullet' : 'lock',
      status: `${hardCompleted}/10 Complete`,
      levels: mockLevels.slice(20, 30),
    },
    {
      name: '4. EXPERT',
      icon: expertCompleted === 10 ? 'check' : expertCompleted > 0 ? 'bullet' : 'lock',
      status: `${expertCompleted}/10 Complete`,
      levels: mockLevels.slice(30, 40),
    },
    {
      name: '5. MASTER',
      icon: masterCompleted === 10 ? 'check' : masterCompleted > 0 ? 'bullet' : 'lock',
      status: `${masterCompleted}/10 Complete`,
      levels: mockLevels.slice(40, 50),
    },
  ];

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-start select-none pb-20 sm:pb-24 gap-3 sm:gap-4">
      {/* Top App Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b border-[#D5DFC9] dark:border-[#35412B] bg-[#EAF0E2] dark:bg-[#192016] transition-colors rounded-t-xl">
        <button
          id="btn-levels-back"
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-[#DCE6D3] dark:hover:bg-[#20291B] text-[#242F1E] dark:text-[#F1F3E8] transition-colors cursor-pointer"
          aria-label="Back to Home"
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
        {/* Title & Total Badge */}
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-[#1E2818] dark:text-[#F1F3E8] transition-colors">
              LEVELS
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E2ECDA] dark:bg-[#20291B] text-[#2F4024] dark:text-[#AEBB7A] border border-[#CBD8BF] dark:border-[#35412B] flex items-center gap-1.5 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#465A38] dark:bg-[#AEBB7A]" />
              {totalCompleted} of 50 Completed
            </span>
          </div>
          <p className="text-xs text-[#5D7053] dark:text-[#AEB79B] mt-1 font-medium transition-colors">
            50 handcrafted logic matrices to master.
          </p>
        </div>

        {/* Mastery Arch Progress Box */}
        <div className="bg-[#E5EFE0] dark:bg-[#20291B] rounded-2xl p-3.5 border border-[#D0DCCA] dark:border-[#35412B] transition-colors">
          <div className="flex items-center justify-between text-xs font-bold text-[#2A3C22] dark:text-[#F1F3E8] mb-1.5 transition-colors">
            <span className="text-[10px] tracking-wider uppercase font-extrabold text-[#4F6443] dark:text-[#AEBB7A]">
              MASTERY ARCH
            </span>
            <span className="text-xs font-extrabold">{masteryPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-[#D1DEC9] dark:bg-[#34412B] rounded-full overflow-hidden transition-colors">
            <div
              className="h-full bg-[#222D1D] dark:bg-[#899A5F] rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-1 text-[9px] font-semibold text-[#5B6F50] dark:text-[#AEB79B] mt-2 text-center transition-colors">
            <span>Easy ({easyCompleted}/10)</span>
            <span>Medium ({mediumCompleted}/10)</span>
            <span>Hard ({hardCompleted}/10)</span>
            <span>Master ({masterCompleted}/10)</span>
          </div>
        </div>

        {/* Categories & 5-Column Level Grids */}
        <div className="flex flex-col gap-5 pt-1">
          {categories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#222D1D] dark:text-[#F1F3E8] transition-colors">
                <div className="flex items-center gap-1.5">
                  <span>{cat.name}</span>
                  {cat.icon === 'check' && (
                    <span className="w-3.5 h-3.5 rounded-full bg-[#4C623E] dark:bg-[#7F8F55] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {cat.icon === 'lock' && (
                    <Lock className="w-3 h-3 text-[#7B8D72] dark:text-[#8F997F]" />
                  )}
                </div>
                <span className="text-[11px] text-[#637657] dark:text-[#AEB79B] font-semibold transition-colors">
                  {cat.status}
                </span>
              </div>

              {/* 5 columns of square tiles */}
              <div className="grid grid-cols-5 gap-2">
                {cat.levels.map((lvl) => {
                  const isFinished = progress.completedLevels.includes(lvl.levelNumber);
                  const isLocked = lvl.levelNumber > progress.unlockedLevel;
                  const isCurrent = lvl.levelNumber === activeLevelNumber;
                  const earnedStars = progress.levelStars[lvl.levelNumber] || 0;

                  return (
                    <button
                      key={lvl.id}
                      id={`btn-level-${lvl.levelNumber}`}
                      type="button"
                      disabled={isLocked}
                      onClick={() => onSelectLevel(lvl)}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-white dark:bg-[#273322] border-2 border-[#222D1D] dark:border-[#AEBB7A] text-[#222D1D] dark:text-[#F1F3E8] shadow-sm ring-1 ring-[#222D1D] dark:ring-[#AEBB7A]'
                          : isFinished
                          ? 'bg-white dark:bg-[#192016] border border-[#D5DFC8] dark:border-[#35412B] text-[#222D1D] dark:text-[#F1F3E8] hover:bg-[#F0F5EC] dark:hover:bg-[#20291B]'
                          : isLocked
                          ? 'bg-[#E3ECD9] dark:bg-[#151B12] border border-[#D3DEC7] dark:border-[#2A3424] text-[#8EA084] dark:text-[#465438] opacity-70 cursor-not-allowed'
                          : 'bg-white dark:bg-[#192016] border border-[#D5DFC8] dark:border-[#35412B] text-[#222D1D] dark:text-[#F1F3E8] hover:bg-[#F0F5EC] dark:hover:bg-[#20291B]'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold leading-tight">
                        {String(lvl.levelNumber).padStart(2, '0')}
                      </span>

                      {isFinished ? (
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {earnedStars > 0 ? (
                            <div className="flex text-[#3A4E2D] dark:text-[#AEBB7A]">
                              {Array.from({ length: earnedStars }).map((_, i) => (
                                <Star key={i} className="w-2 h-2 fill-current" />
                              ))}
                            </div>
                          ) : (
                            <Check className="w-3 h-3 text-[#4A603D] dark:text-[#AEBB7A]" />
                          )}
                        </div>
                      ) : isCurrent ? (
                        <span className="text-[8px] font-black tracking-wider uppercase text-[#222D1D] dark:text-[#AEBB7A] mt-0.5">
                          PLAY
                        </span>
                      ) : isLocked ? (
                        <Lock className="w-2.5 h-2.5 text-[#8EA084] dark:text-[#465438] mt-0.5" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Floating Bar: "Continue Level X" */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-3 sm:px-4 z-30">
        <div className="bg-[#212C1B] dark:bg-[#20291B] rounded-2xl p-3 border border-[#212C1B] dark:border-[#35412B] shadow-lg flex items-center justify-between text-white dark:text-[#F1F3E8] transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#34442A] dark:bg-[#303B27] border border-[#485E3B] dark:border-[#465438] flex items-center justify-center font-bold text-sm text-white dark:text-[#DCE4C9]">
              {activeLevelNumber}
            </div>
            <div>
              <span className="block text-xs font-bold text-white dark:text-[#F1F3E8] leading-tight">
                Continue Level {activeLevelNumber}
              </span>
              <span className="block text-[10px] text-[#A6BD99] dark:text-[#C2C9B5] font-medium leading-tight">
                {currentLevelItem.difficulty.toUpperCase()} • {activeGame ? 'In Progress' : 'Ready'}
              </span>
            </div>
          </div>

          <button
            id="btn-levels-sticky-play"
            type="button"
            onClick={() => onSelectLevel(currentLevelItem)}
            className="px-3.5 py-1.5 rounded-xl bg-[#EAF0E2] dark:bg-[#273322] text-[#212C1B] dark:text-[#F1F3E8] hover:bg-white dark:hover:bg-[#303F2A] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs border border-transparent dark:border-[#35412B]"
          >
            <span>Play</span>
            <Play className="w-3 h-3 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

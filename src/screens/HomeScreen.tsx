import React, { useMemo } from 'react';
import { Grid3X3, Award, Settings, ArrowRight, ChevronRight, Sparkles, Clock, Compass } from 'lucide-react';
import { ScreenType } from '../types/sudoku';
import { loadActiveGame, loadPlayerProgress } from '../utils/storage';
import { formatTime } from '../hooks/useSudokuGame';
import { getLevelByNumber } from '../data/sudokuLevels';
import { loadAchievements } from '../utils/achievementsEngine';
import { playClickSound } from '../utils/soundEngine';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onContinueGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onContinueGame,
}) => {
  const activeGame = useMemo(() => loadActiveGame(), []);
  const progress = useMemo(() => loadPlayerProgress(), []);
  const achievements = useMemo(() => loadAchievements(progress), [progress]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const totalCompleted = progress.completedLevels.length;
  const masteryPercentage = Math.round((totalCompleted / 50) * 100);

  const activeLevelNumber = activeGame?.levelNumber || progress.unlockedLevel;
  const levelSeed = getLevelByNumber(activeLevelNumber);
  const difficultyLabel = levelSeed.difficulty.charAt(0).toUpperCase() + levelSeed.difficulty.slice(1);

  const handleNav = (screen: ScreenType) => {
    playClickSound();
    onNavigate(screen);
  };

  const handleContinue = () => {
    playClickSound();
    onContinueGame();
  };

  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col justify-start py-3.5 px-3.5 sm:py-5 sm:px-4 select-none gap-3 sm:gap-4">
      {/* Top Brand Header */}
      <div className="text-center pt-1 pb-2 sm:pt-2 sm:pb-3">
        {/* Sudoku Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E2ECDA] dark:bg-[#20291B] border border-[#BACAA8] dark:border-[#35412B] mb-2 sm:mb-3 shadow-xs transition-colors">
          <div className="grid grid-cols-3 gap-1 w-5 h-5 sm:w-6 sm:h-6">
            <div className="rounded-[2px] bg-[#222D1D] dark:bg-[#AEBB7A]" />
            <div className="rounded-[2px] bg-[#899E7C] dark:bg-[#7F8F55]" />
            <div className="rounded-[2px] bg-[#222D1D] dark:bg-[#AEBB7A]" />
            <div className="rounded-[2px] bg-[#899E7C] dark:bg-[#7F8F55]" />
            <div className="rounded-[2px] bg-[#222D1D] dark:bg-[#AEBB7A]" />
            <div className="rounded-[2px] bg-[#899E7C] dark:bg-[#7F8F55]" />
            <div className="rounded-[2px] bg-[#222D1D] dark:bg-[#AEBB7A]" />
            <div className="rounded-[2px] bg-[#899E7C] dark:bg-[#7F8F55]" />
            <div className="rounded-[2px] bg-[#222D1D] dark:bg-[#AEBB7A]" />
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-extrabold tracking-widest text-[#1E2818] dark:text-[#F1F3E8] uppercase transition-colors">
          SUDOKU
        </h1>
        <p className="text-[11px] sm:text-xs text-[#5C6E52] dark:text-[#AEB79B] mt-0.5 sm:mt-1 font-medium tracking-wide transition-colors">
          Clear your mind. Solve one board at a time.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col gap-3 sm:gap-3.5">
        {/* Journey Progress Card */}
        <div className="bg-[#E7EFE0] dark:bg-[#20291B] rounded-2xl p-3.5 border border-[#D1DECA] dark:border-[#35412B] transition-colors">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-[11px] text-[#283820] dark:text-[#F1F3E8] font-bold tracking-wider uppercase transition-colors">
              <Compass className="w-3.5 h-3.5 text-[#4E6340] dark:text-[#AEBB7A]" />
              JOURNEY
            </span>
            <span className="text-[#4E6340] dark:text-[#AEB79B] text-xs font-bold transition-colors">{totalCompleted} / 50 Completed</span>
          </div>
          <div className="w-full h-2 bg-[#D4E2CC] dark:bg-[#34412B] rounded-full overflow-hidden transition-colors">
            <div
              className="h-full bg-[#222D1D] dark:bg-[#899A5F] rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </div>

        {/* Resume Ritual Hero Card (Dark Forest Olive) */}
        <button
          id="btn-home-continue"
          type="button"
          onClick={handleContinue}
          className="w-full text-left bg-[#212C1B] dark:bg-[#20291B] hover:bg-[#1A2315] dark:hover:bg-[#273322] active:scale-[0.99] text-white rounded-2xl p-4 shadow-sm transition-all border border-[#212C1B] dark:border-[#35412B] cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold tracking-widest text-[#9BB18D] dark:text-[#AEBB7A] uppercase transition-colors">
                RESUME RITUAL
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white dark:text-[#F1F3E8] transition-colors">
                Continue
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A8BE9A] dark:text-[#C2C9B5] font-medium pt-0.5 transition-colors">
                <Clock className="w-3 h-3" />
                <span>
                  Level {activeLevelNumber} • {difficultyLabel}
                  {activeGame ? ` • ${formatTime(activeGame.timeSeconds)}` : ' • Ready'}
                </span>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#34442B] dark:bg-[#303B27] border border-[#485D3B] dark:border-[#465438] flex items-center justify-center text-white dark:text-[#DCE4C9] shadow-xs transition-colors">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </button>

        {/* Navigation List Cards */}
        <div className="flex flex-col gap-2">
          {/* Levels */}
          <button
            id="btn-home-levels"
            type="button"
            onClick={() => handleNav('levels')}
            className="w-full bg-white dark:bg-[#20291B] hover:bg-[#F3F7EE] dark:hover:bg-[#273322] active:scale-[0.99] border border-[#D5DFC9] dark:border-[#35412B] rounded-2xl p-3.5 transition-all flex items-center justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EFF4E9] dark:bg-[#293521] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#2A3B22] dark:text-[#B8C68A] transition-colors">
                <Grid3X3 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] tracking-wider uppercase transition-colors">
                  LEVELS
                </span>
                <span className="block text-[11px] text-[#607354] dark:text-[#AEB79B] transition-colors">
                  50 Handcrafted Boards
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8BA07E] dark:text-[#9DAA83] transition-colors" />
          </button>

          {/* Achievements */}
          <button
            id="btn-home-achievements"
            type="button"
            onClick={() => handleNav('achievements')}
            className="w-full bg-white dark:bg-[#20291B] hover:bg-[#F3F7EE] dark:hover:bg-[#273322] active:scale-[0.99] border border-[#D5DFC9] dark:border-[#35412B] rounded-2xl p-3.5 transition-all flex items-center justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EFF4E9] dark:bg-[#293521] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#2A3B22] dark:text-[#B8C68A] transition-colors">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] tracking-wider uppercase transition-colors">
                  ACHIEVEMENTS
                </span>
                <span className="block text-[11px] text-[#607354] dark:text-[#AEB79B] transition-colors">
                  Milestones of Focus
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EEDF] dark:bg-[#273322] text-[#344629] dark:text-[#AEBB7A] border border-[#CAD7C0] dark:border-[#35412B] transition-colors">
                {unlockedCount} of 7
              </span>
              <ChevronRight className="w-4 h-4 text-[#8BA07E] dark:text-[#9DAA83] transition-colors" />
            </div>
          </button>

          {/* Settings */}
          <button
            id="btn-home-settings"
            type="button"
            onClick={() => handleNav('settings')}
            className="w-full bg-white dark:bg-[#20291B] hover:bg-[#F3F7EE] dark:hover:bg-[#273322] active:scale-[0.99] border border-[#D5DFC9] dark:border-[#35412B] rounded-2xl p-3.5 transition-all flex items-center justify-between shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EFF4E9] dark:bg-[#293521] border border-[#CBD8BF] dark:border-[#35412B] flex items-center justify-center text-[#2A3B22] dark:text-[#B8C68A] transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] tracking-wider uppercase transition-colors">
                  SETTINGS
                </span>
                <span className="block text-[11px] text-[#607354] dark:text-[#AEB79B] transition-colors">
                  Pencil, Sounds & Contrast
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8BA07E] dark:text-[#9DAA83] transition-colors" />
          </button>
        </div>
      </div>

      {/* Bottom Daily Puzzle Banner */}
      <div className="mt-4 pt-3 border-t border-[#D5DEC9] dark:border-[#35412B] transition-colors">
        <div className="bg-[#E7EFE0]/80 dark:bg-[#20291B]/80 rounded-xl p-3 border border-[#D1DECA] dark:border-[#35412B] text-center transition-colors">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#2C3E23] dark:text-[#F1F3E8] transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#526845] dark:text-[#AEBB7A]" />
            <span>DAILY PUZZLE • DAY 12 STREAK</span>
          </div>
          <p className="text-[9px] font-bold tracking-wider uppercase text-[#697B5E] dark:text-[#AEB79B] mt-1 transition-colors">
            CONTEMPLATIVE LOGIC & LITHOGRAPHY • NO TIMERS RUSHING YOU
          </p>
        </div>
      </div>
    </div>
  );
};

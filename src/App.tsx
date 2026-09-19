import React, { useState, useEffect } from 'react';
import { ScreenType, LevelItem } from './types/sudoku';
import { HomeScreen } from './screens/HomeScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { GameScreen, LevelCompleteData } from './screens/GameScreen';
import { PauseScreen } from './screens/PauseScreen';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Grid } from 'lucide-react';
import { loadActiveGame, loadPlayerProgress } from './utils/storage';
import { loadGameSettings } from './utils/settingsStorage';
import { getLevelByNumber } from './data/sudokuLevels';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Load and apply global theme & contrast settings on startup
  useEffect(() => {
    loadGameSettings();
  }, []);

  // Initialize current level from active saved game or highest unlocked level
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const active = loadActiveGame();
    if (active) return active.levelNumber;
    const prog = loadPlayerProgress();
    return prog.unlockedLevel;
  });

  const [currentDifficulty, setCurrentDifficulty] = useState<string>(() => {
    const seed = getLevelByNumber(currentLevel);
    return seed.difficulty.charAt(0).toUpperCase() + seed.difficulty.slice(1);
  });

  const [completionData, setCompletionData] = useState<LevelCompleteData | null>(null);

  // Production header navigation tabs (development preview routes removed)
  const screens: { key: ScreenType; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'levels', label: 'Levels' },
    { key: 'game', label: 'Game' },
    { key: 'achievements', label: 'Badges' },
    { key: 'settings', label: 'Settings' },
  ];

  const handleSelectLevel = (level: LevelItem) => {
    const prog = loadPlayerProgress();
    // Guard against selecting locked levels
    if (level.levelNumber > prog.unlockedLevel) return;

    setCurrentLevel(level.levelNumber);
    const label = level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1);
    setCurrentDifficulty(label);
    setCurrentScreen('game');
  };

  const handleContinueGame = () => {
    const active = loadActiveGame();
    const targetLevel = active ? active.levelNumber : loadPlayerProgress().unlockedLevel;
    setCurrentLevel(targetLevel);
    const seed = getLevelByNumber(targetLevel);
    setCurrentDifficulty(seed.difficulty.charAt(0).toUpperCase() + seed.difficulty.slice(1));
    setCurrentScreen('game');
  };

  const handleLevelComplete = (data: LevelCompleteData) => {
    setCompletionData(data);
    setCurrentScreen('complete');
  };

  const renderScreenComponent = (screenKey: ScreenType) => {
    switch (screenKey) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={(s) => setCurrentScreen(s)}
            onContinueGame={handleContinueGame}
          />
        );
      case 'levels':
        return (
          <LevelSelectScreen
            onBack={() => setCurrentScreen('home')}
            onSelectLevel={handleSelectLevel}
            currentLevelNumber={currentLevel}
          />
        );
      case 'pause':
        return (
          <PauseScreen
            levelNumber={currentLevel}
            timeString="00:00"
            solvedCount={0}
            mistakes={0}
            onResume={() => setCurrentScreen('game')}
            onRestart={() => setCurrentScreen('game')}
            onExitToLevels={() => setCurrentScreen('levels')}
            onBack={() => setCurrentScreen('game')}
          />
        );
      case 'game':
        return (
          <GameScreen
            levelNumber={currentLevel}
            difficultyLabel={currentDifficulty}
            onBackToLevels={() => setCurrentScreen('levels')}
            onOpenPause={() => setCurrentScreen('pause')}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 'complete':
        return (
          <LevelCompleteScreen
            levelNumber={completionData?.levelNumber ?? currentLevel}
            difficultyLabel={completionData?.difficultyLabel ?? currentDifficulty}
            timeString={completionData?.timeString ?? '00:00'}
            mistakes={completionData?.mistakes ?? 0}
            accuracy={completionData?.accuracy ?? '100%'}
            onNextLevel={() => {
              const prog = loadPlayerProgress();
              const nextLvl = Math.min(prog.unlockedLevel, Math.min(50, (completionData?.levelNumber ?? currentLevel) + 1));
              setCurrentLevel(nextLvl);
              const seed = getLevelByNumber(nextLvl);
              setCurrentDifficulty(seed.difficulty.charAt(0).toUpperCase() + seed.difficulty.slice(1));
              setCompletionData(null);
              setCurrentScreen('game');
            }}
            onReplay={() => {
              setCompletionData(null);
              setCurrentScreen('game');
            }}
            onAllLevels={() => {
              setCompletionData(null);
              setCurrentScreen('levels');
            }}
            onBack={() => {
              setCompletionData(null);
              setCurrentScreen('game');
            }}
          />
        );
      case 'achievements':
        return <AchievementsScreen onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] bg-dot-pattern text-[var(--text-main)] flex flex-col selection:bg-[#CCD8C2] transition-colors duration-200">
      {/* Application Header */}
      <header className="border-b border-[var(--card-border)] dark:border-[#35412B] bg-[var(--header-bg)] backdrop-blur-md sticky top-0 z-50 px-3 py-2 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#212C1B] dark:bg-[#20291B] border border-[#212C1B] dark:border-[#35412B] flex items-center justify-center text-white dark:text-[#AEBB7A] transition-colors">
              <Grid className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold tracking-wider text-[var(--text-main)] uppercase text-xs transition-colors">
              SUDOKU
            </span>
          </div>

          {/* Top Screen Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-0.5" aria-label="Screen Navigation">
            {screens.map((s) => {
              const isActive = currentScreen === s.key;
              return (
                <button
                  key={s.key}
                  id={`nav-tab-${s.key}`}
                  type="button"
                  onClick={() => setCurrentScreen(s.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 border ${
                    isActive
                      ? 'bg-[#212C1B] text-white border-[#212C1B] dark:bg-[#273322] dark:text-[#F1F3E8] dark:border-[#35412B] shadow-xs'
                      : 'bg-white dark:bg-[#192016] text-[var(--text-muted)] dark:text-[#8F997F] border-[var(--card-border)] dark:border-[#35412B] hover:bg-[#EFF5EB] dark:hover:bg-[#20291B]'
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main App Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start py-2.5 px-2 sm:py-6 sm:px-4">
        <div className="w-full max-w-[440px] mx-auto">
          <div className="bg-[var(--app-bg)] dark:bg-[#151B12] rounded-2xl sm:rounded-3xl border border-[#D5DFC9] sm:border-2 dark:border-[#35412B] shadow-lg overflow-hidden flex flex-col relative transition-colors duration-200">
            {renderScreenComponent(currentScreen)}
          </div>
        </div>
      </main>
    </div>
  );
}

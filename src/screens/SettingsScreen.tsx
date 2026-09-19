import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, RotateCcw, Volume2, Eye, Sparkles, Sliders } from 'lucide-react';
import { GameSettings } from '../types/sudoku';
import { loadGameSettings, saveGameSettings, resetProgressAndStats } from '../utils/settingsStorage';
import { playClickSound, playDigitSound } from '../utils/soundEngine';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<GameSettings>(() => loadGameSettings());
  const [resetConfirmed, setResetConfirmed] = useState(false);

  useEffect(() => {
    saveGameSettings(settings);
  }, [settings]);

  const toggle = (key: keyof GameSettings) => {
    playClickSound();
    setSettings((prev) => {
      const next = {
        ...prev,
        [key]: !prev[key],
      };
      if (key === 'soundEffects' && !prev.soundEffects) {
        // Play sample sound when turning sound back on
        playDigitSound();
      }
      return next;
    });
  };

  const handleReset = () => {
    playClickSound();
    resetProgressAndStats();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  const handleBack = () => {
    playClickSound();
    onBack();
  };

  return (
    <div className="w-full max-w-[390px] mx-auto flex flex-col justify-between select-none min-h-[780px] pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D5DFC9] dark:border-[#35412B] bg-[#EAF0E2] dark:bg-[#192016] transition-colors">
        <button
          id="btn-settings-back"
          type="button"
          onClick={handleBack}
          className="p-1.5 rounded-full hover:bg-[#DCE6D3] dark:hover:bg-[#20291B] text-[#242F1E] dark:text-[#F1F3E8] transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-bold tracking-wider text-[#242F1E] dark:text-[#F1F3E8] uppercase transition-colors">
          Settings
        </span>

        <div className="w-7 h-7 rounded-full bg-[#242F1E] dark:bg-[#273322] flex items-center justify-center text-white dark:text-[#F1F3E8] transition-colors">
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-3 flex flex-col gap-4">
        {/* Subheader */}
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-[#475C3B] dark:text-[#AEBB7A] block transition-colors">
            PREFERENCES & MECHANICS
          </span>
          <p className="text-xs text-[#5D7053] dark:text-[#AEB79B] font-medium mt-0.5 transition-colors">
            Refine your ritual of quiet, unhurried logic.
          </p>
        </div>

        {/* Section 1: APPEARANCE */}
        <div className="bg-white dark:bg-[#192016] rounded-2xl p-4 border border-[#D5DFC9] dark:border-[#35412B] shadow-xs space-y-3.5 transition-colors">
          <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-[#222D1D] dark:text-[#F1F3E8] transition-colors">
            <Eye className="w-3.5 h-3.5 text-[#4D6240] dark:text-[#AEBB7A]" />
            <span>APPEARANCE</span>
          </div>

          {/* Board Theme */}
          <div>
            <span className="block text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] mb-1.5 transition-colors">
              Board Theme
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EEF3E9] dark:bg-[#20291B] rounded-xl border border-[#D5DFC9] dark:border-[#35412B] transition-colors">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSettings((s) => ({ ...s, boardTheme: t }));
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    settings.boardTheme === t
                      ? 'bg-[#212C1B] dark:bg-[#273322] text-white dark:text-[#F1F3E8] shadow-xs'
                      : 'text-[#586A4C] dark:text-[#8F997F] hover:text-[#212C1B] dark:hover:text-[#F1F3E8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Board Contrast */}
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] transition-colors">Board Contrast</span>
              <span className="text-[10px] text-[#718465] dark:text-[#AEB79B] transition-colors">Warm newsprint or strict</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EEF3E9] dark:bg-[#20291B] rounded-xl border border-[#D5DFC9] dark:border-[#35412B] transition-colors">
              {(['gentle', 'high'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setSettings((s) => ({ ...s, boardContrast: c }));
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settings.boardContrast === c
                      ? 'bg-[#212C1B] dark:bg-[#273322] text-white dark:text-[#F1F3E8] shadow-xs'
                      : 'text-[#586A4C] dark:text-[#8F997F] hover:text-[#212C1B] dark:hover:text-[#F1F3E8]'
                  }`}
                >
                  {c === 'gentle' ? 'Gentle Warm' : 'High'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: GAMEPLAY */}
        <div className="bg-white dark:bg-[#192016] rounded-2xl p-4 border border-[#D5DFC9] dark:border-[#35412B] shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-[#222D1D] dark:text-[#F1F3E8] transition-colors">
            <Sliders className="w-3.5 h-3.5 text-[#4D6240] dark:text-[#AEBB7A]" />
            <span>GAMEPLAY</span>
          </div>

          <div className="divide-y divide-[#EEF3EA] dark:divide-[#2A3424]">
            {/* Highlight Related Cells */}
            <div className="flex items-center justify-between py-2">
              <div className="pr-3">
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] block transition-colors">
                  Highlight Related Cells
                </span>
                <span className="text-[10px] text-[#6A7C5F] dark:text-[#AEB79B] block transition-colors">
                  Soft shading for active row, column & block
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggle('highlightRelated')}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  settings.highlightRelated ? 'bg-[#212C1B] dark:bg-[#AEBB7A]' : 'bg-[#D6DFC9] dark:bg-[#20291B]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#11160F] transition-transform ${
                    settings.highlightRelated ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Highlight Same Numbers */}
            <div className="flex items-center justify-between py-2">
              <div className="pr-3">
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] block transition-colors">
                  Highlight Same Numbers
                </span>
                <span className="text-[10px] text-[#6A7C5F] dark:text-[#AEB79B] block transition-colors">
                  Identify matching digits across grid
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggle('highlightSameNumbers')}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  settings.highlightSameNumbers ? 'bg-[#212C1B] dark:bg-[#AEBB7A]' : 'bg-[#D6DFC9] dark:bg-[#20291B]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#11160F] transition-transform ${
                    settings.highlightSameNumbers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto-Clear Notes */}
            <div className="flex items-center justify-between py-2">
              <div className="pr-3">
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] block transition-colors">
                  Auto-Clear Notes
                </span>
                <span className="text-[10px] text-[#6A7C5F] dark:text-[#AEB79B] block transition-colors">
                  Erase obsolete pencil marks on input
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggle('autoClearNotes')}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  settings.autoClearNotes ? 'bg-[#212C1B] dark:bg-[#AEBB7A]' : 'bg-[#D6DFC9] dark:bg-[#20291B]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#11160F] transition-transform ${
                    settings.autoClearNotes ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: AUDIO & HAPTICS */}
        <div className="bg-white dark:bg-[#192016] rounded-2xl p-4 border border-[#D5DFC9] dark:border-[#35412B] shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-[#222D1D] dark:text-[#F1F3E8] transition-colors">
            <Volume2 className="w-3.5 h-3.5 text-[#4D6240] dark:text-[#AEBB7A]" />
            <span>AUDIO & HAPTICS</span>
          </div>

          <div className="divide-y divide-[#EEF3EA] dark:divide-[#2A3424]">
            <div className="flex items-center justify-between py-2">
              <div className="pr-3">
                <span className="text-xs font-bold text-[#1E2818] dark:text-[#F1F3E8] block transition-colors">
                  Sound Effects
                </span>
                <span className="text-[10px] text-[#6A7C5F] dark:text-[#AEB79B] block transition-colors">
                  Subtle wooden block click feedback
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggle('soundEffects')}
                className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                  settings.soundEffects ? 'bg-[#212C1B] dark:bg-[#AEBB7A]' : 'bg-[#D6DFC9] dark:bg-[#20291B]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white dark:bg-[#11160F] transition-transform ${
                    settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center pt-2">
          <button
            id="btn-reset-stats"
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-[#C0392B] dark:text-[#E58A82] hover:text-[#962D22] dark:hover:text-[#F1948A] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {resetConfirmed
                ? 'Puzzle Progress & Badges Reset!'
                : 'Reset Puzzle Progress & Statistics'}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 space-y-0.5">
          <span className="block text-[10px] font-bold text-[#6D815E] dark:text-[#AEBB7A] tracking-wider uppercase transition-colors">
            Sudoku v1.0 • Handcrafted Minimalist Logic
          </span>
          <span className="block text-[9px] text-[#8EA081] dark:text-[#8F997F] italic transition-colors">
            Crafted with intentional quietness
          </span>
        </div>
      </div>
    </div>
  );
};

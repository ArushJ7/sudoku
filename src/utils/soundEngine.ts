/**
 * Web Audio API Procedural Sound Engine
 * Zero external audio files, pure oscillator-synthesized sound effects.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

/**
 * Safely initialize or resume the lazily-created AudioContext singleton.
 * Returns null if Web Audio is unsupported or unavailable.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    } catch (err) {
      console.warn('AudioContext initialization failed:', err);
      audioCtx = null;
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((err) => {
      console.warn('AudioContext resume failed:', err);
    });
  }

  return audioCtx;
}

/**
 * Configure whether sound effects are enabled or muted.
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/**
 * Get current sound enabled status.
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Play a soft 15ms sine wave click (800Hz -> 200Hz drop).
 * Used for cell selection and button navigation.
 */
export function playClickSound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.015);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch (err) {
    // Sound failures must never crash gameplay
  }
}

/**
 * Play a warm 60ms resonant sine chime.
 * Used for valid digit entry.
 */
export function playDigitSound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5 chime

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {
    // Sound failures must never crash gameplay
  }
}

/**
 * Play a crisp 20ms triangle tick (~1200Hz).
 * Used for pencil candidate notes toggle.
 */
export function playNoteSound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch (err) {
    // Sound failures must never crash gameplay
  }
}

/**
 * Play a low double-buzz error tone (150Hz square wave ~100ms).
 * Used for incorrect digit entry.
 */
export function playErrorSound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First pulse
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(150, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.04);

    // Second pulse
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(130, now + 0.05);
    gain2.gain.setValueAtTime(0.08, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.1);
  } catch (err) {
    // Sound failures must never crash gameplay
  }
}

/**
 * Play a 4-note ascending victory arpeggio: C5 -> E5 -> G5 -> C6.
 * Triggered exactly once on level completion.
 */
export function playVictorySound(): void {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, timeOffset: 0.0, duration: 0.12 }, // C5
      { freq: 659.25, timeOffset: 0.1, duration: 0.12 }, // E5
      { freq: 783.99, timeOffset: 0.2, duration: 0.12 }, // G5
      { freq: 1046.5, timeOffset: 0.3, duration: 0.35 }, // C6
    ];

    const now = ctx.currentTime;

    notes.forEach(({ freq, timeOffset, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + timeOffset;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    // Sound failures must never crash gameplay
  }
}

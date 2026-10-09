/**
 * uiAudio.ts
 * Procedural Web Audio API sound effects for Apex GT UI interactions.
 * Delivers crisp, tactile acoustic feedback for clicks, hovers, mode transitions,
 * and cinematic engine ignition roars without external sound assets.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        sharedAudioCtx = new AudioContextClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Subtle high-tech hover sound for menu buttons
 */
export function playUiHover(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch {
    // Audio context may not be ready yet
  }
}

/**
 * Tactile, crisp UI click with customizable frequency punch
 */
export function playUiClick(freq: number = 800): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {
    // Audio context may not be ready yet
  }
}

/**
 * Ascending harmonic chime for selecting race modes
 */
export function playModeSelectChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.055;
      const duration = 0.28;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.045, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    });
  } catch {
    // Audio context may not be ready yet
  }
}

/**
 * High-octane V8/V10 ignition roar sequence when launching from the title screen
 */
export function playEngineIgnitionRoar(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Starter motor cranking clicks
    for (let i = 0; i < 3; i++) {
      const crankOsc = ctx.createOscillator();
      const crankGain = ctx.createGain();
      const crankTime = now + i * 0.07;

      crankOsc.type = 'sawtooth';
      crankOsc.frequency.setValueAtTime(110 + i * 20, crankTime);

      crankGain.gain.setValueAtTime(0.06, crankTime);
      crankGain.gain.exponentialRampToValueAtTime(0.001, crankTime + 0.045);

      crankOsc.connect(crankGain);
      crankGain.connect(ctx.destination);

      crankOsc.start(crankTime);
      crankOsc.stop(crankTime + 0.05);
    }

    // 2. High-rev ignition roar (starts at ~0.25s)
    const roarTime = now + 0.22;
    const roarDuration = 0.85;

    // Sub rumble
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(75, roarTime);
    subOsc.frequency.exponentialRampToValueAtTime(280, roarTime + 0.25);
    subOsc.frequency.exponentialRampToValueAtTime(140, roarTime + roarDuration);

    subGain.gain.setValueAtTime(0.08, roarTime);
    subGain.gain.exponentialRampToValueAtTime(0.14, roarTime + 0.25);
    subGain.gain.exponentialRampToValueAtTime(0.001, roarTime + roarDuration);

    // Distortion filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, roarTime);
    filter.frequency.exponentialRampToValueAtTime(2400, roarTime + 0.25);
    filter.frequency.exponentialRampToValueAtTime(800, roarTime + roarDuration);

    subOsc.connect(filter);
    filter.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(roarTime);
    subOsc.stop(roarTime + roarDuration + 0.05);

    // Harmonic scream
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'sawtooth';
    highOsc.frequency.setValueAtTime(150, roarTime);
    highOsc.frequency.exponentialRampToValueAtTime(560, roarTime + 0.25);
    highOsc.frequency.exponentialRampToValueAtTime(280, roarTime + roarDuration);

    highGain.gain.setValueAtTime(0.04, roarTime);
    highGain.gain.exponentialRampToValueAtTime(0.08, roarTime + 0.25);
    highGain.gain.exponentialRampToValueAtTime(0.001, roarTime + roarDuration);

    highOsc.connect(filter);
    filter.connect(highGain);
    highGain.connect(ctx.destination);

    highOsc.start(roarTime);
    highOsc.stop(roarTime + roarDuration + 0.05);

    // White noise exhaust blast
    const bufferSize = ctx.sampleRate * 0.4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(800, roarTime + 0.1);
    noiseFilter.Q.setValueAtTime(1.5, roarTime + 0.1);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, roarTime + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, roarTime + 0.45);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(roarTime + 0.1);
    whiteNoise.stop(roarTime + 0.45);
  } catch {
    // Audio context may not be ready yet
  }
}

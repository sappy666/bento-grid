// Audio feedback utility using Web Audio API for Apple iOS soundscape and haptic feel

let audioCtx: AudioContext | null = null;
let activeSoundscapeOsc: OscillatorNode | null = null;
let activeGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Gentle Apple iOS toggle haptic click sound
 */
export function playToggleClick(isActive: boolean) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency shifts slightly higher when turning ON, lower when OFF
    osc.frequency.setValueAtTime(isActive ? 640 : 480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isActive ? 840 : 360, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (err) {
    // Ignore audio autoplay prevention errors silently
  }
}

/**
 * Start ambient spatial soundscape for the Apple Music media widget
 */
export function startAmbientSoundscape() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopAmbientSoundscape();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Warm, calming Apple sound design chord (432Hz ambient harmonic)
    osc.frequency.setValueAtTime(432, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    activeSoundscapeOsc = osc;
    activeGain = gain;
  } catch (err) {
    // Ignore silently
  }
}

/**
 * Stop ambient soundscape with smooth fade out
 */
export function stopAmbientSoundscape() {
  try {
    if (activeSoundscapeOsc && activeGain && audioCtx) {
      activeGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      setTimeout(() => {
        try {
          activeSoundscapeOsc?.stop();
          activeSoundscapeOsc?.disconnect();
          activeSoundscapeOsc = null;
          activeGain = null;
        } catch {}
      }, 200);
    }
  } catch {}
}

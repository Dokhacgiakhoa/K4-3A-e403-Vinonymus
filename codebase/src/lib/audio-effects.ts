/**
 * AI in Action (AIIA) - Procedural Web Audio & Particle Effects Engine
 * 
 * Clean, zero-asset sound synthesizer using Web Audio API.
 * No external MP3 downloads, zero network latency, instant playback.
 */

// Sound state controller
let audioMuted = false;
let globalAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (audioMuted) return null;

  try {
    if (!globalAudioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        globalAudioCtx = new AudioCtx();
      }
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      void globalAudioCtx.resume();
    }
    return globalAudioCtx;
  } catch {
    return null;
  }
}

export class SoundFX {
  static isMuted(): boolean {
    return audioMuted;
  }

  static toggleMute(): boolean {
    audioMuted = !audioMuted;
    return audioMuted;
  }

  static setMuted(muted: boolean) {
    audioMuted = muted;
  }

  /**
   * 1. Nhẹ nhàng khi click chọn đáp án hoặc tương tác tab
   */
  static playClick() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Ignore audio synthesis errors on unsupported browsers
    }
  }

  /**
   * 2. Tiếng Chime khi trả lời đúng, cao độ tăng dần theo Combo
   */
  static playCorrect(combo: number = 0) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Arpeggio C5 - E5 - G5 with pitch multiplier based on combo
      const baseFreq = 523.25;
      const multiplier = Math.min(1.8, 1 + combo * 0.07);
      const notes = [
        baseFreq * multiplier,
        baseFreq * multiplier * 1.2599, // Major third
        baseFreq * multiplier * 1.4983  // Fifth
      ];

      notes.forEach((freq, idx) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.055);

        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.055 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.055);
        osc.stop(ctx.currentTime + idx * 0.055 + 0.22);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * 3. Tiếng Buzzer khi trả lời sai hoặc mất Heart
   */
  static playWrong() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.24);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.24);
    } catch {
      // Ignore
    }
  }

  /**
   * 4. Tiếng Va chạm khi Boss trúng đòn (Boss Hit)
   */
  static playBossHit() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Ignore
    }
  }

  /**
   * 5. Khúc nhạc chiến thắng hoàn thành mốc (Victory Fanfare)
   */
  static playVictory() {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Notes: A4, C#5, E5, A5
      const fanfare = [440, 554.37, 659.25, 880];
      fanfare.forEach((freq, i) => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);

        gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.35);
      });
    } catch {
      // Ignore
    }
  }
}

/**
 * Hiệu ứng Canvas Confetti nhẹ nhàng, thuần vanilla TypeScript
 */
export class CanvasFX {
  static fireConfetti() {
    if (typeof window === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const colors = ['#38bdf8', '#34d399', '#fbbf24', '#f43f5e', '#a855f7', '#60a5fa'];
    const particleCount = 70;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      vRot: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 300,
        y: height * 0.4 + (Math.random() - 0.5) * 150,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)] ?? '#38bdf8',
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 2500; // 2.5s

    const render = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        cancelAnimationFrame(animationFrameId);
        canvas.remove();
        return;
      }

      const progress = elapsed / duration;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vRot;
        p.opacity = Math.max(0, 1 - progress);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
  }
}

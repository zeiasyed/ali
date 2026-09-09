/** Generate short hero SFX WAV files for the Ali math app. */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname);
const SR = 22050;

function clamp(v) {
  return Math.max(-1, Math.min(1, v));
}

function writeWav(filename, samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const s = clamp(samples[i]);
    data.writeInt16LE((s * 32767) | 0, i * 2);
  }
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SR, 24);
  header.writeUInt32LE(SR * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(OUT, filename), Buffer.concat([header, data]));
  console.log("wrote", filename, (samples.length / SR).toFixed(2) + "s");
}

function env(t, a, d, sLen, r) {
  if (t < a) return t / a;
  if (t < a + d) return 1 - (1 - 0.7) * ((t - a) / d);
  if (t < a + d + sLen) return 0.7;
  const u = (t - a - d - sLen) / r;
  return u >= 1 ? 0 : 0.7 * (1 - u);
}

function makeCorrect() {
  const dur = 0.85;
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;

    // Whoosh noise (band-ish by amplitude envelope)
    if (t < 0.22) {
      const w = Math.sin((Math.PI * t) / 0.22);
      s += (Math.random() * 2 - 1) * 0.45 * w * w;
    }

    // Deep POW punch
    if (t >= 0.05 && t < 0.28) {
      const u = t - 0.05;
      const punchEnv = Math.exp(-u * 14);
      s += Math.sin(2 * Math.PI * (70 + 40 * Math.exp(-u * 20)) * u) * 0.7 * punchEnv;
      s += (Math.random() * 2 - 1) * 0.25 * Math.exp(-u * 18);
    }

    // Hero fanfare: longer warm notes C4 E4 G4 C5
    const notes = [
      [0.14, 261.63],
      [0.28, 329.63],
      [0.42, 392.0],
      [0.56, 523.25],
    ];
    for (const [start, f] of notes) {
      const u = t - start;
      if (u >= 0 && u < 0.32) {
        const e = env(u, 0.02, 0.05, 0.14, 0.11);
        s += Math.sin(2 * Math.PI * f * u) * 0.28 * e;
        s += Math.sin(2 * Math.PI * f * 2 * u) * 0.08 * e; // soft harmonic
      }
    }

    // Sparkle
    if (t > 0.5 && t < 0.85) {
      const u = t - 0.5;
      s += Math.sin(2 * Math.PI * 1046.5 * u) * 0.12 * Math.exp(-u * 4);
      s += Math.sin(2 * Math.PI * 1568 * u) * 0.07 * Math.exp(-u * 5);
    }

    out[i] = s * 0.9;
  }
  return out;
}

function makeWrong() {
  const dur = 0.45;
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    // Soft thud noise
    s += (Math.random() * 2 - 1) * 0.35 * Math.exp(-t * 10);
    // Descending “deflate”
    const f = 240 * Math.exp(-t * 5);
    s += Math.sin(2 * Math.PI * f * t) * 0.35 * Math.exp(-t * 4);
    s += Math.sin(2 * Math.PI * (f * 0.5) * t) * 0.2 * Math.exp(-t * 5);
    out[i] = s * 0.85;
  }
  return out;
}

function makeStart() {
  const dur = 0.35;
  const n = Math.floor(SR * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    if (t < 0.15) {
      s += (Math.random() * 2 - 1) * 0.3 * Math.sin((Math.PI * t) / 0.15);
    }
    const u = t - 0.04;
    if (u > 0) {
      s += Math.sin(2 * Math.PI * 392 * u) * 0.28 * Math.exp(-u * 5);
      s += Math.sin(2 * Math.PI * 523 * u) * 0.18 * Math.exp(-u * 6);
    }
    out[i] = s;
  }
  return out;
}

writeWav("sfx-correct.wav", makeCorrect());
writeWav("sfx-wrong.wav", makeWrong());
writeWav("sfx-start.wav", makeStart());

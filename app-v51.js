(() => {
  const STORAGE_KEY = "ali-ayaan-hero-times-v1";
  const CHILD = "Ali Ayaan";
  const MASTERY_STREAK = 5;
  const QUESTION_SECS = 5;

  const DIFFICULTY = {
    easy: 5,
    medium: 10,
    hard: 12,
    expert: 15,
  };

  /** Grade unlocks skills and sets kid-friendly defaults */
  const GRADE_PROFILES = {
    prek: {
      label: "Pre-K",
      skills: ["add"],
      defaultOp: "add",
      digitLevel: "single",
      difficulty: "easy",
      roundPreset: "10:2",
    },
    k: {
      label: "Kindergarten",
      skills: ["add", "sub"],
      defaultOp: "add",
      digitLevel: "single",
      difficulty: "easy",
      roundPreset: "10:2",
    },
    1: {
      label: "Grade 1",
      skills: ["add", "sub"],
      defaultOp: "add",
      digitLevel: "single",
      difficulty: "easy",
      roundPreset: "10:2",
    },
    2: {
      label: "Grade 2",
      skills: ["add", "sub", "multiply", "round"],
      defaultOp: "multiply",
      digitLevel: "dual",
      difficulty: "easy",
      roundPreset: "10:2",
    },
    3: {
      label: "Grade 3",
      skills: ["add", "sub", "multiply", "round"],
      defaultOp: "multiply",
      digitLevel: "dual",
      difficulty: "medium",
      roundPreset: "10:3",
    },
    4: {
      label: "Grade 4",
      skills: ["add", "sub", "multiply", "round"],
      defaultOp: "multiply",
      digitLevel: "dual",
      difficulty: "hard",
      roundPreset: "100:3",
    },
  };

  const SKILL_LABELS = {
    multiply: "Multiplication",
    add: "Addition",
    sub: "Subtraction",
    round: "Rounding · nearest 10 / 100",
  };

  const HEROES = [
    // Marvel first
    { id: "spiderman", icon: "🕷️", name: "Spider-Man", need: 0, universe: "Marvel" },
    { id: "ironman", icon: "🦾", name: "Iron Man", need: 25, universe: "Marvel" },
    { id: "cap", icon: "🛡️", name: "Captain America", need: 50, universe: "Marvel" },
    { id: "thor", icon: "⚡", name: "Thor", need: 75, universe: "Marvel" },
    { id: "hulk", icon: "💪", name: "Hulk", need: 100, universe: "Marvel" },
    { id: "blackpanther", icon: "🐆", name: "Black Panther", need: 130, universe: "Marvel" },
    { id: "strange", icon: "🌀", name: "Doctor Strange", need: 160, universe: "Marvel" },
    { id: "captainmarvel", icon: "⭐", name: "Captain Marvel", need: 200, universe: "Marvel" },
    // Then Roblox
    { id: "roblox-noob", icon: "🧱", name: "Noob", need: 240, universe: "Roblox" },
    { id: "roblox-guest", icon: "👤", name: "Guest", need: 280, universe: "Roblox" },
    { id: "roblox-builderman", icon: "🔧", name: "Builderman", need: 320, universe: "Roblox" },
    { id: "roblox-bloxy", icon: "🏆", name: "Bloxy", need: 360, universe: "Roblox" },
    { id: "roblox-bacon", icon: "🥓", name: "Bacon Hair", need: 400, universe: "Roblox" },
    // Then Fortnite
    { id: "fortnite-jonesy", icon: "🤠", name: "Jonesy", need: 450, universe: "Fortnite" },
    { id: "fortnite-peely", icon: "🍌", name: "Peely", need: 500, universe: "Fortnite" },
    { id: "fortnite-fishstick", icon: "🐟", name: "Fishstick", need: 560, universe: "Fortnite" },
    { id: "fortnite-raven", icon: "🦅", name: "Raven", need: 620, universe: "Fortnite" },
    { id: "fortnite-meowscles", icon: "🐱", name: "Meowscles", need: 700, universe: "Fortnite" },
  ];

  const BADGES = [
    { id: "first", icon: "🎯", name: "First Pow", desc: "Get 1 correct answer", check: (s) => s.totalCorrect >= 1 },
    { id: "streak5", icon: "🔥", name: "Hot Streak", desc: "Reach a streak of 5", check: (s) => s.bestStreak >= 5 },
    { id: "streak10", icon: "💫", name: "Power 10", desc: "Reach a streak of 10", check: (s) => s.bestStreak >= 10 },
    { id: "stars50", icon: "⭐", name: "Star Collector", desc: "Earn 50 stars", check: (s) => s.stars >= 50 },
    { id: "stars200", icon: "🌠", name: "Galaxy Stars", desc: "Earn 200 stars", check: (s) => s.stars >= 200 },
    { id: "table5", icon: "5️⃣", name: "Table Titan 5", desc: "Master the 5 times table", check: (s) => isTableMastered(s, 5) },
    { id: "table10", icon: "🔟", name: "Table Titan 10", desc: "Master the 10 times table", check: (s) => isTableMastered(s, 10) },
    { id: "missions5", icon: "🚀", name: "Mission Pro", desc: "Finish 5 missions", check: (s) => s.missionsCompleted >= 5 },
    { id: "marvel-set", icon: "🦸", name: "Avenger Squad", desc: "Unlock all Marvel heroes", check: (s) => HEROES.filter((h) => h.universe === "Marvel").every((h) => s.unlockedHeroes[h.id]) },
    { id: "roblox-set", icon: "🧱", name: "Roblox Crew", desc: "Unlock all Roblox heroes", check: (s) => HEROES.filter((h) => h.universe === "Roblox").every((h) => s.unlockedHeroes[h.id]) },
    { id: "fortnite-set", icon: "🍌", name: "Victory Royale", desc: "Unlock all Fortnite heroes", check: (s) => HEROES.filter((h) => h.universe === "Fortnite").every((h) => s.unlockedHeroes[h.id]) },
  ];

  const CHEERS = [
    "You got this!",
    "Hero mode!",
    "Power punch!",
    "Lightning brain!",
    "Keep flying!",
    "Super focus!",
  ];

  const WIN_LINES = [
    "POW! Correct!",
    "Boom! Nailed it!",
    "Yes! Hero hit!",
    "Zap! Perfect!",
  ];

  /** @type {ReturnType<typeof defaultState>} */
  let state = loadState();
  /** @type {null | {
   *  operation: string,
   *  difficulty: string,
   *  digitLevel: string,
   *  mode: string,
   *  shuffle: boolean,
   *  tables: number[],
   *  problemType: string,
   *  max: number,
   *  asked: number,
   *  target: number | null,
   *  correct: number,
   *  firstTryCorrect: number,
   *  attemptsOnCurrent: number,
   *  sessionStars: number,
   *  current: {a:number,b:number,key:string,promptType:string,expected:number,display:string} | null,
   *  ended: boolean,
   *  timerId: number | null,
   *  timeLeft: number,
   * }} */
  let session = null;
  let speechRec = null;
  let listening = false;
  let wantListen = false;
  let micPrimed = false;
  let speechStartLock = false;
  let audioCtx = null;
  let audioReady = false;
  let masterGain = null;
  let sfxPrimed = false;
  const sfx = { correct: null, wrong: null, start: null };

  const $ = (id) => document.getElementById(id);

  function isAppleMobile() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }

  function loadSfx() {
    sfx.correct = new Audio("sfx-correct.wav?v=34");
    sfx.wrong = new Audio("sfx-wrong.wav?v=34");
    sfx.start = new Audio("sfx-start.wav?v=34");
    for (const a of Object.values(sfx)) {
      a.preload = "auto";
      a.setAttribute("playsinline", "true");
    }
  }

  async function unlockAudio() {
    try {
      if (navigator.audioSession) navigator.audioSession.type = "playback";
    } catch { /* ignore */ }

    if (!sfx.correct) loadSfx();

    // Prime HTML audio once inside a user gesture (iPhone requirement)
    if (!sfxPrimed) {
      try {
        for (const a of [sfx.start, sfx.correct, sfx.wrong]) {
          if (!a) continue;
          a.muted = true;
          a.currentTime = 0;
          const p = a.play();
          if (p && p.then) await p.catch(() => {});
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        }
        sfxPrimed = true;
      } catch { /* ignore */ }
    }

    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      if (!audioCtx) {
        audioCtx = new AC();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.9;
        masterGain.connect(audioCtx.destination);
      }
      if (audioCtx.state === "suspended") {
        try { await audioCtx.resume(); } catch { /* ignore */ }
      }
    }
    audioReady = true;
    return true;
  }

  function playSfx(audio, volume = 1) {
    if (!audio) return false;
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  async function playCorrectSound() {
    await unlockAudio();
    playSfx(sfx.correct, 1);
  }

  async function playWrongSound() {
    await unlockAudio();
    playSfx(sfx.wrong, 1);
  }

  async function playStartSound() {
    await unlockAudio();
    playSfx(sfx.start, 1);
  }

  const ONES = {
    zero: 0, oh: 0, o: 0,
    one: 1, won: 1, juan: 1,
    two: 2, too: 2,
    three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
    fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  };
  const TENS = {
    twenty: 20, thirty: 30, forty: 40, fifty: 50,
    sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  };

  /** Pull separate number values: "twenty one" → [21], "eight one" → [8, 1] (never 9). */
  function extractSpokenNumbers(tokens) {
    const nums = [];
    let i = 0;
    while (i < tokens.length) {
      const w = tokens[i];
      if (/^\d{1,4}$/.test(w)) {
        nums.push(Number(w));
        i += 1;
        continue;
      }
      if (TENS[w] != null) {
        let n = TENS[w];
        const next = tokens[i + 1];
        if (next && ONES[next] != null && ONES[next] < 10) {
          n += ONES[next];
          i += 2;
        } else {
          i += 1;
        }
        nums.push(n);
        continue;
      }
      if (ONES[w] != null) {
        let n = ONES[w];
        if (tokens[i + 1] === "hundred") {
          n *= 100;
          i += 2;
          const next = tokens[i];
          if (next && TENS[next] != null) {
            n += TENS[next];
            i += 1;
            const ones = tokens[i];
            if (ones && ONES[ones] != null && ONES[ones] < 10) {
              n += ONES[ones];
              i += 1;
            }
          } else if (next && ONES[next] != null) {
            n += ONES[next];
            i += 1;
          }
        } else {
          i += 1;
        }
        nums.push(n);
        continue;
      }
      i += 1;
    }
    return nums;
  }

  function parseTailNumber(tail) {
    if (!tail) return null;
    const digitTail = tail.match(/\b\d{1,4}\b/);
    if (digitTail) return Number(digitTail[0]);
    const skip = new Set(["to", "the", "answer", "a", "an"]);
    const tokens = tail.split(" ").filter(Boolean).filter((w) => !skip.has(w));
    const nums = extractSpokenNumbers(tokens);
    return nums.length ? nums[nums.length - 1] : null;
  }

  function looksLikeReadingFactors(nums, a, b) {
    if (!nums || nums.length < 2) return false;
    const factors = [Number(a), Number(b)].sort((x, y) => x - y);
    const head = nums.slice(0, 2).slice().sort((x, y) => x - y);
    return head[0] === factors[0] && head[1] === factors[1];
  }

  /** "11" from saying 1×1, "81" from 8×1, etc. */
  function looksLikeFactorConcat(value, a, b) {
    const s = String(value);
    const as = String(a);
    const bs = String(b);
    return s === as + bs || s === bs + as;
  }

  /**
   * Final gate: reject mic guesses that are really the kid reading the problem.
   * Returns the value to fill, or null to ignore.
   */
  function acceptSpokenAnswer(value, problem, transcript) {
    if (value == null || !Number.isFinite(value)) return null;
    if (!problem) return value;

    const a = Number(problem.a);
    const b = Number(problem.b);
    const expected = Number(problem.expected);

    if (looksLikeFactorConcat(value, a, b)) return null;

    // Said a factor instead of the product/missing number (e.g. "one" on 8×1)
    if (value !== expected && (value === a || value === b)) return null;

    // 1×1 is uniquely ambiguous — only accept a lone "one"/"1"
    if (a === 1 && b === 1 && expected === 1) {
      const t = String(transcript || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!/^(1|one|won|juan)$/.test(t)) return null;
      return 1;
    }

    return value;
  }

  /**
   * Parse a spoken answer. Uses the current problem so reading
   * "one times one" / "eight one" does not overwrite the real answer.
   */
  function parseSpokenNumber(text, problem) {
    if (!text) return null;
    const cleaned = String(text)
      .toLowerCase()
      .replace(/×/g, " times ")
      .replace(/\*/g, " times ")
      .replace(/\bby\b/g, " times ")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned) return null;

    const hasOp =
      /\b(times|multiplied|plus|minus|divided|over)\b/.test(cleaned) ||
      /\bx\b/.test(cleaned);

    // "eight times one equals eight" / "is 8" → answer after equals/is
    // Avoid splitting short words like "this" — use careful boundaries
    const afterEquals = cleaned.split(/\b(?:equals|equal|=)\b|\bis\b/);
    if (afterEquals.length > 1) {
      const n = parseTailNumber(afterEquals[afterEquals.length - 1].trim());
      if (n != null) return acceptSpokenAnswer(n, problem, afterEquals[afterEquals.length - 1]);
    }

    // Kid is reading the problem out loud — ignore
    if (hasOp) return null;

    const skip = new Set([
      "its", "it's", "the", "answer", "um", "uh", "like", "just",
      "i", "think", "say", "said", "a", "an", "to", "my",
    ]);
    const tokens = cleaned.split(" ").filter(Boolean).filter((w) => !skip.has(w));
    if (!tokens.length) return null;

    const nums = extractSpokenNumbers(tokens);
    if (!nums.length) return null;

    // "eight one" / "one one" without "times" = reading factors, not 9 or 2
    if (problem && looksLikeReadingFactors(nums, problem.a, problem.b)) {
      if (nums.length >= 3) {
        const last = nums[nums.length - 1];
        if (last === Number(problem.expected)) {
          return acceptSpokenAnswer(last, problem, cleaned);
        }
      }
      return null;
    }

    // Single clear number ("one", "8", "twelve")
    if (nums.length === 1) {
      return acceptSpokenAnswer(nums[0], problem, cleaned);
    }

    // Multiple unrelated numbers — take the last (often the answer)
    return acceptSpokenAnswer(nums[nums.length - 1], problem, cleaned);
  }

  function choosePromptType(problemType, a, b, operation) {
    if (operation === "round") return "product";
    let type = problemType || "product";
    if (type === "mix") {
      const kinds = ["product", "missing-b", "missing-a"];
      type = kinds[Math.floor(Math.random() * kinds.length)];
    }
    // Avoid confusing prompts like 8 × ? = 8 (kids answer 8)
    if (
      operation === "multiply" &&
      (type === "missing-a" || type === "missing-b") &&
      (Number(a) === 1 || Number(b) === 1)
    ) {
      type = "product";
    }
    return type;
  }

  function speechSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function setVoiceStatus(msg) {
    const el = $("voice-status");
    if (el) el.textContent = msg || "";
  }

  function setListeningUI(on) {
    listening = on;
    const btn = $("btn-mic");
    if (btn) {
      btn.classList.toggle("listening", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Listening…" : "Tap Mic";
    }
  }

  async function ensureMicAccess() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceStatus("This browser can’t use the mic — type the answer");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      micPrimed = true;
      return true;
    } catch {
      micPrimed = false;
      setVoiceStatus("Allow microphone access, then tap Mic");
      wantListen = false;
      setListeningUI(false);
      return false;
    }
  }

  function stopListening(clearWant = true) {
    if (clearWant) wantListen = false;
    try {
      speechRec?.stop();
    } catch {
      try {
        speechRec?.abort();
      } catch {
        /* ignore */
      }
    }
    setListeningUI(false);
  }

  function getSpeechRec() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;

    // Reuse one instance on iPhone/iPad — recreating breaks the mic
    if (!speechRec) {
      speechRec = new SR();
      speechRec.lang = "en-US";
      speechRec.interimResults = true;
      speechRec.maxAlternatives = 5;
      speechRec.continuous = false;
    }
    return speechRec;
  }

  function wireSpeechHandlers(rec) {
    const applySpokenValue = (alts, allowInterim) => {
      let value = null;
      let matchedExpected = null;
      const problem = session?.current || null;
      const expected = problem ? Number(problem.expected) : null;

      for (const t of alts) {
        const trimmed = String(t || "").trim();
        if (!trimmed) continue;
        if (allowInterim && trimmed.split(/\s+/).length > 4) continue;

        const v = parseSpokenNumber(trimmed, problem);
        if (v == null) continue;
        if (expected != null && v === expected) {
          matchedExpected = v;
          break;
        }
        if (value == null) value = v;
      }
      value = matchedExpected ?? value;
      if (value == null) return false;

      const box = $("answer");
      if (!box) return false;
      const already = String(box.value || "").replace(/[^\d]/g, "");
      if (
        already &&
        expected != null &&
        Number(already) === expected &&
        value !== expected
      ) {
        return true;
      }

      if (box.value !== String(value)) {
        box.value = String(value);
      }
      setVoiceStatus(`Got it: ${value} — hit POW!`);
      return true;
    };

    rec.onresult = (event) => {
      let finalAlts = [];
      let interimAlts = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const texts = [];
        for (let j = 0; j < result.length; j++) texts.push(result[j].transcript);
        if (!texts.length && result[0]) texts.push(result[0].transcript);
        if (result.isFinal) finalAlts = texts;
        else interimAlts = texts;
      }

      if (finalAlts.length) {
        applySpokenValue(finalAlts, false);
        return;
      }
      if (interimAlts.length) {
        applySpokenValue(interimAlts, true);
      }
    };

    rec.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        wantListen = false;
        setListeningUI(false);
        setVoiceStatus("Mic blocked — allow microphone for this site, or type");
        return;
      }
      if (event.error === "no-speech" || event.error === "aborted") return;
      setVoiceStatus("Couldn’t hear that — tap Mic and say it again");
    };

    rec.onend = () => {
      setListeningUI(false);
      speechStartLock = false;
      if (
        wantListen &&
        session &&
        !session.ended &&
        session.accepting !== false &&
        !session.waitingNext
      ) {
        window.setTimeout(() => {
          if (wantListen && session && session.accepting && !session.waitingNext) {
            startListening();
          }
        }, isAppleMobile() ? 180 : 80);
      }
    };
  }

  function startListening() {
    if (!speechSupported()) {
      setVoiceStatus("Voice not supported here — type the answer");
      const btn = $("btn-mic");
      if (btn) btn.textContent = "Type instead";
      return;
    }
    if (!session || session.ended || session.accepting === false || session.waitingNext) return;
    if (speechStartLock) return;

    const rec = getSpeechRec();
    if (!rec) return;
    wireSpeechHandlers(rec);

    wantListen = true;
    setListeningUI(true);
    setVoiceStatus("Listening… say the number");

    speechStartLock = true;
    try {
      rec.start();
    } catch {
      // Already started — treat as listening
      speechStartLock = false;
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        if (wantListen) startListening();
      }, 160);
    }
  }

  async function startListeningWithPermission() {
    if (!speechSupported()) {
      setVoiceStatus("Voice not supported here — type the answer");
      return;
    }
    const ok = micPrimed || (await ensureMicAccess());
    if (!ok) return;
    startListening();
  }

  function maybeAutoListen() {
    if (!session || session.ended || session.waitingNext) return;
    if (session.accepting === false) return;
    if (!(state.settings.voiceMode || $("voice-mode")?.checked)) {
      setVoiceStatus("Tap Mic to talk, or type the answer");
      return;
    }
    if (!speechSupported()) {
      setVoiceStatus("Type your answer, then hit POW!");
      return;
    }
    // On phones, only auto-listen after mic was allowed via a tap
    if (!micPrimed) {
      setVoiceStatus("Tap Mic once to allow the microphone");
      setListeningUI(false);
      return;
    }
    window.setTimeout(() => {
      if (session && !session.ended && session.accepting && !session.waitingNext) {
        startListening();
      }
    }, 60);
  }

  function setPowLabel(text) {
    const btn = $("btn-pow");
    if (btn) btn.textContent = text;
  }

  function focusAnswer() {
    const input = $("answer");
    if (!input) return;
    // Slight delay helps iPad/Safari apply focus after UI updates
    window.setTimeout(() => {
      input.focus({ preventScroll: false });
      try {
        input.select();
      } catch {
        /* ignore */
      }
    }, 50);
  }

  function rangeTables(max) {
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  function opSymbol(operation) {
    if (operation === "add") return "+";
    if (operation === "sub") return "−";
    if (operation === "round") return "≈";
    return "×";
  }

  function roundToPlace(n, place) {
    place = Number(place) || 10;
    return Math.round(Number(n) / place) * place;
  }

  function computeResult(a, b, operation) {
    if (operation === "add") return a + b;
    if (operation === "sub") return a - b;
    if (operation === "round") return roundToPlace(a, b);
    return a * b;
  }

  const ROBLOX_REWARD_POINTS = 5;
  const ROBLOX_PASS_PCT = 90;

  function defaultState() {
    return {
      stars: 0,
      streak: 0,
      bestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      missionsCompleted: 0,
      badges: {},
      unlockedHeroes: { spiderman: true },
      activeHero: "spiderman",
      facts: {},
      robloxPoints: 0,
      robloxLog: [],
      robloxLastAwardDay: "",
      settings: {
        grade: "2",
        operation: "multiply",
        difficulty: "easy",
        digitLevel: "dual",
        mode: "endless",
        shuffle: false,
        voiceMode: true,
        perQuestionTimer: false,
        tables: rangeTables(5),
        problemType: "product",
        roundPlace: "10",
        roundDigits: "2",
      },
    };
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function getRobloxPoints() {
    return Number(state.robloxPoints) || 0;
  }

  function renderRobloxBank() {
    const pts = getRobloxPoints();
    document.querySelectorAll("[data-roblox-points]").forEach((el) => {
      el.textContent = String(pts);
    });
  }

  /** Award once per day when quiz score meets pass % */
  function maybeAwardRobloxPoints(pct, right, total) {
    if (pct < ROBLOX_PASS_PCT) {
      return { awarded: false, reason: `Need ${ROBLOX_PASS_PCT}% or higher for Roblox points.` };
    }
    const day = todayKey();
    if (state.robloxLastAwardDay === day) {
      return {
        awarded: false,
        already: true,
        reason: "Already earned today’s Roblox points. Come back tomorrow!",
      };
    }
    state.robloxPoints = getRobloxPoints() + ROBLOX_REWARD_POINTS;
    state.robloxLastAwardDay = day;
    if (!Array.isArray(state.robloxLog)) state.robloxLog = [];
    state.robloxLog.unshift({
      day,
      points: ROBLOX_REWARD_POINTS,
      pct,
      right,
      total,
      week: SS_WEEK.week,
      title: SS_WEEK.title,
      at: Date.now(),
    });
    state.robloxLog = state.robloxLog.slice(0, 40);
    saveState();
    renderRobloxBank();
    return {
      awarded: true,
      points: ROBLOX_REWARD_POINTS,
      total: getRobloxPoints(),
      reason: `+${ROBLOX_REWARD_POINTS} Roblox points! Bank: ${getRobloxPoints()}`,
    };
  }

  function clearRobloxBank() {
    if (!confirm(`Clear Ali’s Roblox points bank? (Currently ${getRobloxPoints()} points)`)) {
      return;
    }
    state.robloxPoints = 0;
    state.robloxLog = [];
    state.robloxLastAwardDay = "";
    saveState();
    renderRobloxBank();
    renderParent();
  }

  function getGradeId() {
    const fromUi = $("grade")?.value;
    if (fromUi && GRADE_PROFILES[fromUi]) return fromUi;
    const saved = state.settings.grade;
    if (saved && GRADE_PROFILES[saved]) return saved;
    return "2";
  }

  function getGradeProfile(gradeId = getGradeId()) {
    return GRADE_PROFILES[gradeId] || GRADE_PROFILES["2"];
  }

  function syncGradeUI(gradeId = getGradeId(), { applyDefaults = false } = {}) {
    const profile = getGradeProfile(gradeId);
    state.settings.grade = gradeId;
    if ($("grade")) $("grade").value = gradeId;

    const opSelect = $("operation");
    const previousOp = state.settings.operation || opSelect?.value;
    if (opSelect) {
      opSelect.innerHTML = "";
      for (const skill of profile.skills) {
        const opt = document.createElement("option");
        opt.value = skill;
        opt.textContent = SKILL_LABELS[skill] || skill;
        opSelect.appendChild(opt);
      }
      const keepOp =
        !applyDefaults && previousOp && profile.skills.includes(previousOp)
          ? previousOp
          : profile.defaultOp;
      opSelect.value = keepOp;
      state.settings.operation = keepOp;
    }

    const allowDual = gradeId === "2" || gradeId === "3" || gradeId === "4";
    if ($("digit-level")) {
      [...$("digit-level").options].forEach((opt) => {
        if (opt.value === "dual") opt.hidden = !allowDual;
      });
      if (!allowDual && $("digit-level").value === "dual") {
        $("digit-level").value = "single";
        state.settings.digitLevel = "single";
      }
    }

    if (applyDefaults) {
      if ($("difficulty")) {
        $("difficulty").value = profile.difficulty;
        state.settings.difficulty = profile.difficulty;
      }
      if ($("digit-level")) {
        const digit = allowDual ? profile.digitLevel : "single";
        $("digit-level").value = digit;
        state.settings.digitLevel = digit;
      }
      if ($("round-preset") && profile.roundPreset) {
        $("round-preset").value = profile.roundPreset;
        const parsed = parseRoundPreset(profile.roundPreset);
        state.settings.roundPlace = parsed.roundPlace;
        state.settings.roundDigits = parsed.roundDigits;
      }
      const max = DIFFICULTY[profile.difficulty] || 10;
      state.settings.tables = rangeTables(max);
    }

    renderTableChips();
    syncOperationUI();
  }

  function parseRoundPreset(value) {
    const raw = String(value || "10:3");
    const [place, digits] = raw.split(":");
    return {
      roundPlace: place === "100" || place === "mix" ? place : "10",
      roundDigits: ["2", "3", "4", "mix"].includes(digits) ? digits : "3",
    };
  }

  function roundPresetValue(roundPlace, roundDigits) {
    const place = roundPlace === "100" || roundPlace === "mix" ? roundPlace : "10";
    const digits = ["2", "3", "4", "mix"].includes(String(roundDigits))
      ? String(roundDigits)
      : "3";
    return `${place}:${digits}`;
  }

  function readRoundSettings() {
    const preset = $("round-preset");
    if (preset?.value) return parseRoundPreset(preset.value);
    return {
      roundPlace: $("round-place")?.value || "10",
      roundDigits: $("round-digits")?.value || "3",
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      const merged = {
        ...base,
        ...parsed,
        settings: {
          ...base.settings,
          ...(parsed.settings || {}),
        },
        facts: parsed.facts || {},
        badges: parsed.badges || {},
        unlockedHeroes: { ...base.unlockedHeroes, ...(parsed.unlockedHeroes || {}) },
      };
      if (!Array.isArray(merged.settings.tables) || !merged.settings.tables.length) {
        const max = DIFFICULTY[merged.settings.difficulty] || 10;
        merged.settings.tables = rangeTables(max);
      }
      merged.settings.tables = merged.settings.tables
        .map(Number)
        .filter((n) => n >= 1 && n <= 15);
      // Migrate old starter hero id
      if (merged.unlockedHeroes?.spark || merged.activeHero === "spark") {
        merged.unlockedHeroes = { ...merged.unlockedHeroes, spiderman: true };
        delete merged.unlockedHeroes.spark;
        if (merged.activeHero === "spark") merged.activeHero = "spiderman";
      }
      if (!merged.unlockedHeroes?.spiderman) {
        merged.unlockedHeroes = { ...merged.unlockedHeroes, spiderman: true };
      }
      if (!GRADE_PROFILES[merged.settings.grade]) {
        merged.settings.grade = "2";
      }
      const gradeSkills = GRADE_PROFILES[merged.settings.grade].skills;
      if (!gradeSkills.includes(merged.settings.operation)) {
        merged.settings.operation = GRADE_PROFILES[merged.settings.grade].defaultOp;
      }
      if (typeof merged.robloxPoints !== "number") merged.robloxPoints = 0;
      if (!Array.isArray(merged.robloxLog)) merged.robloxLog = [];
      if (typeof merged.robloxLastAwardDay !== "string") merged.robloxLastAwardDay = "";
      return merged;
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function factKey(a, b, operation = "multiply") {
    if (operation === "add") {
      const x = Math.min(a, b);
      const y = Math.max(a, b);
      return `+:${x}+${y}`;
    }
    if (operation === "sub") {
      return `-:${a}-${b}`;
    }
    if (operation === "round") {
      return `r${b}:${a}`;
    }
    const x = Math.min(a, b);
    const y = Math.max(a, b);
    return `${x}x${y}`;
  }

  function ensureFact(key) {
    if (!state.facts[key]) {
      state.facts[key] = {
        weight: 1,
        correctStreak: 0,
        wrongs: 0,
        corrects: 0,
        mastered: false,
      };
    }
    return state.facts[key];
  }

  function isTableMastered(s, n) {
    const maxOther = Math.max(DIFFICULTY.easy, ...Object.values(DIFFICULTY).filter(() => true));
    // Master table n within 1..12 range for badge fairness
    const limit = Math.min(12, maxOther);
    for (let i = 1; i <= limit; i++) {
      const f = s.facts[factKey(n, i)];
      if (!f || !f.mastered) return false;
    }
    return true;
  }

  function levelFromStars(stars) {
    return Math.floor(stars / 25) + 1;
  }

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    $(`screen-${name}`).classList.add("active");
    if (name === "home") renderHome();
    if (name === "map") renderMap();
    if (name === "badges") renderBadges();
    if (name === "parent") renderParent();
    if (name === "social") {
      renderRobloxBank();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // ---------------------------------------------------------------------------
  // Social Studies · Week 7 · Thinking Like a Geographer
  // ---------------------------------------------------------------------------
  const SS_WEEK = {
    week: 7,
    unit: "Geography",
    title: "Thinking Like a Geographer",
    guiding: "How do maps help us learn about the Earth?",
  };

  /** Full-screen learning cards — kid language, one idea each */
  const SS_LESSONS = [
    {
      emoji: "🌍",
      badge: "Week 7 · Learning",
      title: "Thinking Like a Geographer",
      body: [
        "A geographer learns about Earth.",
        "Land. Water. Places. People.",
        "Big question this week:",
        "How do maps help us learn about Earth?",
      ],
      remember: "Maps and globes help us learn about Earth.",
    },
    {
      emoji: "🚀",
      badge: "The Earth is HUGE",
      title: "25,000 Miles Around!",
      body: [
        "Earth is super big!",
        "To go all the way around it is about 25,000 miles.",
        "That is a really long way.",
        "So we use maps and globes to learn about it.",
      ],
      remember: "Around Earth = about 25,000 miles.",
    },
    {
      emoji: "🌐",
      badge: "Tool #1",
      title: "What is a Globe?",
      body: [
        "A globe is a round model of Earth.",
        "It is like a tiny Earth you can look at.",
        "It shows water, land, and countries.",
      ],
      remember: "Globe = round model of Earth.",
    },
    {
      emoji: "🗺️",
      badge: "Tool #2",
      title: "What is a Map?",
      body: [
        "A map is a flat picture of a place.",
        "A map can show roads, cities, and parks.",
        "Different maps show different things.",
      ],
      remember: "Map = flat picture of a place.",
    },
    {
      emoji: "✏️",
      badge: "Who makes maps?",
      title: "Meet the Cartographer",
      body: [
        "A cartographer makes maps.",
        "Like a writer picks words for a book,",
        "a cartographer picks what goes on the map.",
      ],
      remember: "Cartographer = map maker.",
    },
    {
      emoji: "🏷️",
      badge: "Map tool",
      title: "The Title",
      body: [
        "The title is the name of the map.",
        "It tells you what the map is about.",
        "Read the title first!",
      ],
      remember: "Title = what the map is about.",
    },
    {
      emoji: "🔑",
      badge: "Map tool",
      title: "The Legend (Key)",
      body: [
        "Maps use little pictures and colors.",
        "Blue might mean water. A tree might mean a park.",
        "The legend tells you what they mean.",
      ],
      remember: "Legend = what the pictures mean.",
    },
    {
      emoji: "🧭",
      badge: "Map tool",
      title: "Compass Rose",
      body: [
        "A compass rose shows directions.",
        "North. South. East. West.",
        "Silly tip: Never Eat Soggy Worms!",
      ],
      remember: "Compass rose = N, S, E, W.",
    },
    {
      emoji: "📏",
      badge: "Map tool",
      title: "Scale = Distance",
      body: [
        "Distance means how far.",
        "The scale helps you know how far places are.",
        "A short line on the map can mean many miles.",
      ],
      remember: "Scale = how far.",
    },
    {
      emoji: "👥",
      badge: "Map types",
      title: "Population Map",
      body: [
        "Population means people.",
        "This map shows where people live.",
        "Busy places have lots of people.",
      ],
      remember: "Population map = where people live.",
    },
    {
      emoji: "🏛️",
      badge: "Map types",
      title: "Political Map",
      body: [
        "A political map shows borders.",
        "Borders are lines between places.",
        "They show cities, states, and countries.",
      ],
      remember: "Political map = borders.",
    },
    {
      emoji: "⛰️",
      badge: "Map types",
      title: "Physical Map",
      body: [
        "A physical map shows nature.",
        "Mountains. Valleys. Lakes. Streams.",
        "It shows land and water.",
      ],
      remember: "Physical map = mountains, lakes, and more.",
    },
    {
      emoji: "🌤️",
      badge: "Map types",
      title: "Climate Map",
      body: [
        "A climate map shows if a place is usually hot or cold.",
        "Or wet or dry.",
        "Climate means weather over a long time — not just today.",
      ],
      remember: "Climate = weather over time.",
    },
    {
      emoji: "⭐",
      badge: "You did it!",
      title: "Ready, Geographer!",
      body: [
        "You learned the big map words!",
        "Globe. Map. Cartographer. Title. Legend. Compass. Scale.",
        "Now try the quiz. If you miss one, try again!",
      ],
      remember: "Learn first. Then take the quiz.",
    },
  ];

  /** Assessment-style questions matching Studies Weekly (fill-in / MC / T-F) */
  const SS_QUESTIONS = [
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "A __________ is a round model of Earth.",
      choices: ["map", "globe", "legend", "scale"],
      answer: "globe",
      explain: "A globe is a round model of Earth.",
    },
    {
      type: "mc",
      prompt: "Pick the best answer:",
      text: "About how far is it around Earth?",
      choices: ["2,500 miles", "10,000 miles", "25,000 miles", "100,000 miles"],
      answer: "25,000 miles",
      explain: "Around Earth is about 25,000 miles.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "A person who makes maps is called a __________.",
      choices: ["historian", "cartographer", "explorer", "geologist"],
      answer: "cartographer",
      explain: "A cartographer is a map maker.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "The __________ tells what the pictures and colors on a map mean.",
      choices: ["title", "scale", "legend", "border"],
      answer: "legend",
      explain: "The legend tells what map pictures mean.",
    },
    {
      type: "mc",
      prompt: "Pick the best answer:",
      text: "What does a compass rose show?",
      choices: [
        "How far places are",
        "Where people live",
        "North, South, East, West",
        "Today’s weather",
      ],
      answer: "North, South, East, West",
      explain: "A compass rose shows N, S, E, and W.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "The __________ helps you know how far places are on a map.",
      choices: ["legend", "title", "compass rose", "scale"],
      answer: "scale",
      explain: "Scale means how far.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "A __________ map shows where people live.",
      choices: ["political", "physical", "population", "climate"],
      answer: "population",
      explain: "Population map = where people live.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "A __________ map shows borders of cities, states, and countries.",
      choices: ["population", "political", "climate", "road"],
      answer: "political",
      explain: "Political map = borders.",
    },
    {
      type: "mc",
      prompt: "Pick the best answer:",
      text: "What does a physical map show?",
      choices: [
        "Only city names",
        "Mountains, valleys, lakes, and streams",
        "Only today’s weather",
        "How many people live somewhere",
      ],
      answer: "Mountains, valleys, lakes, and streams",
      explain: "A physical map shows nature — land and water.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "A climate map shows if a place is usually warm, cold, wet, or __________.",
      choices: ["dry", "loud", "crowded", "flat"],
      answer: "dry",
      explain: "Climate maps show warm, cold, wet, or dry.",
    },
    {
      type: "fill",
      prompt: "Tap the best word:",
      text: "Climate means weather over __________.",
      choices: ["one day", "time", "one hour", "maps only"],
      answer: "time",
      explain: "Climate = weather over time.",
    },
    {
      type: "tf",
      prompt: "True or False:",
      text: "Only one kind of map is useful.",
      choices: ["TRUE", "FALSE"],
      answer: "FALSE",
      explain: "We use many kinds of maps.",
    },
    {
      type: "mc",
      prompt: "Pick the best answer:",
      text: "What does a map title tell you?",
      choices: [
        "How old the map is",
        "What the map is about",
        "Who lives there",
        "The weather today",
      ],
      answer: "What the map is about",
      explain: "The title tells what the map is about.",
    },
    {
      type: "mc",
      prompt: "Pick the best answer:",
      text: "What can a map help you find?",
      choices: [
        "Only oceans",
        "Roads, cities, and parks",
        "Only one country",
        "Nothing",
      ],
      answer: "Roads, cities, and parks",
      explain: "Maps can show roads, cities, and parks.",
    },
    {
      type: "tf",
      prompt: "True or False:",
      text: "A cartographer picks what to put on a map.",
      choices: ["TRUE", "FALSE"],
      answer: "TRUE",
      explain: "Yes — a cartographer chooses what goes on the map.",
    },
  ];

  let ssSession = null;
  let ssLearnIndex = 0;

  function startSocialLearn() {
    ssLearnIndex = 0;
    showScreen("ss-learn");
    renderSocialLesson();
  }

  function renderSocialLesson() {
    const lesson = SS_LESSONS[ssLearnIndex];
    if (!lesson) return;
    const total = SS_LESSONS.length;
    $("ss-learn-progress").textContent = `${ssLearnIndex + 1} of ${total}`;
    $("ss-lesson-emoji").textContent = lesson.emoji || "";
    $("ss-lesson-badge").textContent = lesson.badge || "Learning";
    $("ss-lesson-title").textContent = lesson.title || "";
    $("ss-lesson-body").innerHTML = (lesson.body || [])
      .map((p) => `<p>${p}</p>`)
      .join("");
    const rememberBox = $("ss-lesson-remember");
    const rememberText = $("ss-lesson-remember-text");
    if (rememberBox && rememberText) {
      if (lesson.remember) {
        rememberText.textContent = lesson.remember;
        rememberBox.hidden = false;
      } else {
        rememberText.textContent = "";
        rememberBox.hidden = true;
      }
    }

    const dots = $("ss-learn-dots");
    if (dots) {
      dots.innerHTML = "";
      for (let i = 0; i < total; i++) {
        const d = document.createElement("span");
        d.className = "ss-learn-dot";
        if (i < ssLearnIndex) d.classList.add("done");
        if (i === ssLearnIndex) d.classList.add("on");
        dots.appendChild(d);
      }
    }

    const back = $("btn-ss-learn-back");
    const next = $("btn-ss-learn-next");
    if (back) back.disabled = ssLearnIndex === 0;
    if (next) {
      next.textContent =
        ssLearnIndex >= total - 1 ? "Take Assessment" : "Next";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceSocialLearn(dir) {
    if (dir < 0) {
      if (ssLearnIndex <= 0) return;
      ssLearnIndex -= 1;
      renderSocialLesson();
      return;
    }
    if (ssLearnIndex >= SS_LESSONS.length - 1) {
      startSocialQuiz();
      return;
    }
    ssLearnIndex += 1;
    renderSocialLesson();
  }

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function startSocialQuiz() {
    const order = SS_QUESTIONS.map((_, i) => i);
    shuffleInPlace(order);
    ssSession = {
      order,
      index: 0,
      correct: 0,
      answered: false,
      attemptsOnCurrent: 0,
      misses: [],
      intro: true,
    };
    showScreen("ss-quiz");
    renderSocialQuizIntro();
  }

  function setQuizIntroMode(showIntro) {
    const intro = $("ss-quiz-intro");
    const card = $("ss-quiz-card");
    if (intro) {
      intro.hidden = !showIntro;
      intro.style.display = showIntro ? "" : "none";
      intro.classList.toggle("ss-panel-hidden", !showIntro);
    }
    if (card) {
      card.hidden = !!showIntro;
      card.style.display = showIntro ? "none" : "";
      card.classList.toggle("ss-panel-hidden", !!showIntro);
    }
  }

  function renderSocialQuizIntro() {
    renderRobloxBank();
    setQuizIntroMode(true);
    $("ss-progress").textContent = "Quiz goal";
    $("ss-score").textContent = "0";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function beginSocialQuizQuestions() {
    if (!ssSession) return;
    ssSession.intro = false;
    setQuizIntroMode(false);
    renderSocialQuestion();
  }

  function currentSsQuestion() {
    if (!ssSession) return null;
    const qi = ssSession.order[ssSession.index];
    return SS_QUESTIONS[qi];
  }

  function renderSocialQuestion() {
    const q = currentSsQuestion();
    if (!q || !ssSession) return;
    ssSession.answered = false;
    ssSession.attemptsOnCurrent = 0;
    $("ss-quiz-card")?.classList.remove("ss-revealed");
    $("ss-progress").textContent = `Question ${ssSession.index + 1} of ${ssSession.order.length}`;
    $("ss-score").textContent = String(ssSession.correct);
    $("ss-question-text").textContent = q.text;
    $("ss-prompt").textContent = `${q.prompt || ""} · 2 tries`;
    $("ss-feedback").textContent = "";
    $("ss-feedback").className = "feedback";
    const nextBtn = $("btn-ss-next");
    if (nextBtn) {
      nextBtn.hidden = true;
      nextBtn.textContent =
        ssSession.index + 1 >= ssSession.order.length ? "See Results" : "Next";
    }

    const box = $("ss-choices");
    box.innerHTML = "";
    const choices = q.choices.slice();
    // Keep TRUE/FALSE order; shuffle other choice lists
    if (q.type !== "tf") shuffleInPlace(choices);
    choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ss-choice";
      btn.setAttribute("role", "option");
      const letter = String.fromCharCode(97 + i); // a, b, c...
      btn.textContent = q.type === "tf" ? choice : `${letter}. ${choice}`;
      btn.dataset.value = choice;
      btn.addEventListener("click", () => answerSocial(choice, btn));
      box.appendChild(btn);
    });
  }

  const SS_MAX_TRIES = 2;

  function revealSocialAnswer(wrongBtn) {
    const q = currentSsQuestion();
    const card = $("ss-quiz-card");
    card?.classList.add("ss-revealed");

    let correctBtn = null;
    [...$("ss-choices").querySelectorAll(".ss-choice")].forEach((el) => {
      el.disabled = true;
      el.classList.remove("selected");
      if (el.dataset.value === q.answer) {
        el.classList.add("correct", "ss-answer-pop");
        el.classList.remove("wrong", "faded");
        // Make the right answer unmistakable
        if (!el.querySelector(".ss-right-tag")) {
          const tag = document.createElement("span");
          tag.className = "ss-right-tag";
          tag.textContent = "✓ RIGHT ANSWER";
          el.prepend(tag);
        }
        correctBtn = el;
      } else {
        el.classList.add("faded");
        if (el === wrongBtn || el.classList.contains("wrong")) {
          el.classList.add("wrong");
        }
      }
    });
    if (wrongBtn) {
      wrongBtn.classList.add("wrong");
      wrongBtn.classList.remove("faded");
    }
    correctBtn?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  async function answerSocial(choice, btn) {
    if (!ssSession || ssSession.answered) return;
    if (btn.disabled) return;
    const q = currentSsQuestion();
    const ok = choice === q.answer;
    ssSession.attemptsOnCurrent += 1;
    const triesLeft = SS_MAX_TRIES - ssSession.attemptsOnCurrent;

    await unlockAudio();

    if (ok) {
      ssSession.answered = true;
      [...$("ss-choices").querySelectorAll(".ss-choice")].forEach((el) => {
        el.disabled = true;
        if (el.dataset.value === q.answer) {
          el.classList.add("correct", "ss-answer-pop");
          if (!el.querySelector(".ss-right-tag")) {
            const tag = document.createElement("span");
            tag.className = "ss-right-tag";
            tag.textContent = "✓ RIGHT ANSWER";
            el.prepend(tag);
          }
        } else {
          el.classList.add("faded");
        }
      });
      ssSession.correct += 1;
      $("ss-score").textContent = String(ssSession.correct);
      state.stars += 1;
      saveState();
      $("ss-feedback").innerHTML =
        ssSession.attemptsOnCurrent === 1
          ? `<strong>Yes!</strong> ${q.explain}`
          : `<strong>You got it!</strong> ${q.explain}`;
      $("ss-feedback").className = "feedback right ss-feedback-banner";
      await playCorrectSound();
      const nextBtn = $("btn-ss-next");
      if (nextBtn) nextBtn.hidden = false;
      return;
    }

    // Attempt 1 of 2: do NOT reveal — try again
    if (triesLeft > 0) {
      btn.disabled = true;
      btn.classList.add("wrong");
      $("ss-feedback").innerHTML =
        `<strong>Not quite.</strong> Try again! (${triesLeft} ${triesLeft === 1 ? "try" : "tries"} left)`;
      $("ss-feedback").className = "feedback wrong ss-feedback-banner";
      await playWrongSound();
      return;
    }

    // After 2 misses: reveal the right answer clearly
    ssSession.answered = true;
    revealSocialAnswer(btn);
    if (!ssSession.misses.some((m) => m.text === q.text)) {
      ssSession.misses.push({
        text: q.text,
        answer: q.answer,
        picked: choice,
        explain: q.explain,
      });
    }
    $("ss-feedback").innerHTML =
      `<strong>Right answer → ${q.answer}</strong><br>${q.explain}`;
    $("ss-feedback").className = "feedback ss-feedback-reveal";
    await playWrongSound();
    const nextBtn = $("btn-ss-next");
    if (nextBtn) nextBtn.hidden = false;
  }

  function advanceSocialQuiz() {
    if (!ssSession) return;
    if (ssSession.index + 1 >= ssSession.order.length) {
      endSocialQuiz();
      return;
    }
    ssSession.index += 1;
    renderSocialQuestion();
  }

  function endSocialQuiz() {
    const total = ssSession.order.length;
    const right = ssSession.correct;
    const pct = Math.round((right / total) * 100);
    const reward = maybeAwardRobloxPoints(pct, right, total);

    $("ss-results-title").textContent =
      pct >= ROBLOX_PASS_PCT
        ? "Geographer Hero!"
        : pct >= 70
          ? "Nice Exploring!"
          : "Keep Studying!";
    $("ss-results-sub").textContent = `${SS_WEEK.title} · ${right}/${total} correct (${pct}%)`;
    $("ss-results-grid").innerHTML = `
      <div class="stat-card"><span>${right}</span> correct</div>
      <div class="stat-card"><span>${total - right}</span> missed</div>
      <div class="stat-card"><span>${pct}%</span> score</div>
      <div class="stat-card"><span data-roblox-points>${getRobloxPoints()}</span> Roblox pts</div>
    `;

    const rewardBox = $("ss-reward-box");
    if (rewardBox) {
      if (reward.awarded) {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box won";
        rewardBox.innerHTML = `
          <p class="ss-reward-emoji">🧱</p>
          <p class="ss-reward-title">You earned ${reward.points} Roblox points!</p>
          <p>Score ${pct}% (need ${ROBLOX_PASS_PCT}%+). Bank now: <strong>${reward.total}</strong> points.</p>
          <p class="ss-reward-note">Dad buys the bank at the end of the week.</p>
        `;
      } else if (pct >= ROBLOX_PASS_PCT && reward.already) {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box ok";
        rewardBox.innerHTML = `
          <p class="ss-reward-title">Great score — ${pct}%!</p>
          <p>${reward.reason}</p>
          <p>Bank: <strong data-roblox-points>${getRobloxPoints()}</strong> Roblox points</p>
        `;
      } else {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box miss";
        rewardBox.innerHTML = `
          <p class="ss-reward-title">Roblox points: not yet</p>
          <p>Get <strong>${ROBLOX_PASS_PCT}%</strong> or higher to earn <strong>${ROBLOX_REWARD_POINTS}</strong> Roblox points.</p>
          <p>You got ${pct}%. Study a bit and try again!</p>
          <p>Bank: <strong data-roblox-points>${getRobloxPoints()}</strong> points</p>
        `;
      }
    }

    const review = $("ss-review");
    if (!ssSession.misses.length) {
      review.innerHTML =
        '<div class="ss-review-item"><p class="ss-rev-q">You got every question — awesome map skills!</p></div>';
    } else {
      review.innerHTML = ssSession.misses
        .map(
          (m) => `
        <div class="ss-review-item missed">
          <p class="ss-rev-q">${m.text}</p>
          <p class="ss-rev-a">Answer: ${m.answer}</p>
          <p>${m.explain}</p>
        </div>`
        )
        .join("");
    }
    showScreen("ss-results");
  }

  function renderHome() {
    $("stat-stars").textContent = String(state.stars);
    $("stat-streak").textContent = String(state.bestStreak);
    $("stat-level").textContent = String(levelFromStars(state.stars));
    renderRobloxBank();
    syncGradeUI(state.settings.grade || "2", { applyDefaults: false });
    if ($("difficulty")) $("difficulty").value = state.settings.difficulty;
    if ($("digit-level")) $("digit-level").value = state.settings.digitLevel || "single";
    if ($("round-preset")) {
      $("round-preset").value = roundPresetValue(
        state.settings.roundPlace || "10",
        state.settings.roundDigits || "3"
      );
    }
    if ($("round-place")) $("round-place").value = state.settings.roundPlace || "10";
    if ($("round-digits")) $("round-digits").value = state.settings.roundDigits || "3";
    if ($("mode")) $("mode").value = state.settings.mode;
    if ($("problem-type")) $("problem-type").value = state.settings.problemType || "product";
    if ($("in-order")) $("in-order").checked = !state.settings.shuffle;
    if ($("per-question-timer")) {
      $("per-question-timer").checked = !!state.settings.perQuestionTimer;
    }
    if ($("question-order")) {
      $("question-order").value = state.settings.shuffle ? "shuffle" : "order";
    }
    if ($("shuffle")) $("shuffle").checked = !!state.settings.shuffle;
    if ($("voice-mode")) $("voice-mode").checked = !!state.settings.voiceMode;
    updateHeroAvatar();
  }

  function setSetupVisible(el, visible) {
    if (!el) return;
    el.hidden = !visible;
    el.style.display = visible ? "" : "none";
    el.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function syncOperationUI() {
    const op = $("operation")?.value || state.settings.operation || "multiply";
    const isMult = op === "multiply";
    const isRound = op === "round";
    const isAddSub = op === "add" || op === "sub";

    // Rounding must not show multiplication table chips / difficulty
    setSetupVisible($("difficulty-wrap"), isMult);
    setSetupVisible($("table-picker"), isMult);
    setSetupVisible($("digit-wrap"), isAddSub);
    setSetupVisible($("round-wrap"), isRound);
    setSetupVisible($("round-digits-wrap"), false);
    setSetupVisible($("problem-type-wrap"), !isRound);
    // In-order (13, 14, 15…) is for tables — rounding should stay random
    const inOrderRow = $("in-order")?.closest("label");
    setSetupVisible(inOrderRow, !isRound);
    if (isRound && $("in-order")) $("in-order").checked = false;

    const tag = $("home-tagline");
    if (tag) {
      if (op === "add") tag.textContent = "Power up your addition!";
      else if (op === "sub") tag.textContent = "Power up your subtraction!";
      else if (op === "round") tag.textContent = "Power up your rounding!";
      else tag.textContent = "Power up your multiplication!";
    }

    updateProblemTypeOptions(op);
  }

  function updateProblemTypeOptions(operation) {
    const select = $("problem-type");
    if (!select) return;
    if (operation === "round") {
      select.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = "product";
      opt.textContent = "Round to the nearest 10 or 100";
      select.appendChild(opt);
      select.value = "product";
      return;
    }
    const current = select.value || state.settings.problemType || "product";
    const sym = opSymbol(operation);
    const samples =
      operation === "add"
        ? { a: 4, b: 3, r: 7 }
        : operation === "sub"
          ? { a: 12, b: 4, r: 8 }
          : { a: 4, b: 3, r: 12 };

    const options = [
      ["product", `${samples.a} ${sym} ${samples.b} = ?`],
      ["missing-b", `${samples.a} ${sym} ? = ${samples.r}`],
      ["missing-a", `? ${sym} ${samples.b} = ${samples.r}`],
      ["mix", "Mix all styles"],
    ];

    select.innerHTML = "";
    for (const [value, label] of options) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    }
    select.value = options.some(([v]) => v === current) ? current : "product";
  }

  function currentMax() {
    return DIFFICULTY[$("difficulty")?.value || state.settings.difficulty] || 10;
  }

  function getSelectedTables() {
    const max = currentMax();
    return [...document.querySelectorAll(".table-chip[aria-pressed='true']")]
      .map((btn) => Number(btn.dataset.table))
      .filter((n) => n >= 1 && n <= max);
  }

  function renderTableChips() {
    const host = $("table-chips");
    if (!host) return;

    const max = currentMax();
    let selected = (state.settings.tables || [])
      .map(Number)
      .filter((n) => n >= 1 && n <= max);
    if (!selected.length) selected = rangeTables(max);
    const selectedSet = new Set(selected);

    const chips = [...host.querySelectorAll(".table-chip")];
    if (!chips.length) {
      // Fallback: build chips if HTML is empty / outdated cache
      host.innerHTML = "";
      for (let n = 1; n <= 15; n++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "table-chip";
        btn.dataset.table = String(n);
        btn.textContent = `${n}×`;
        host.appendChild(btn);
      }
    }

    host.querySelectorAll(".table-chip").forEach((btn) => {
      const n = Number(btn.dataset.table);
      const inRange = n >= 1 && n <= max;
      btn.hidden = !inRange;
      if (!inRange) {
        btn.setAttribute("aria-pressed", "false");
        return;
      }
      btn.setAttribute("aria-pressed", selectedSet.has(n) ? "true" : "false");
    });
  }

  function updateHeroAvatar() {
    const hero = HEROES.find((h) => h.id === state.activeHero) || HEROES[0];
    const el = $("hero-avatar");
    if (el) {
      el.dataset.hero = hero.id;
      el.textContent = hero.icon;
    }
  }

  function unlockRewards() {
    for (const hero of HEROES) {
      if (state.stars >= hero.need) state.unlockedHeroes[hero.id] = true;
    }
    const unlocked = HEROES.filter((h) => state.unlockedHeroes[h.id]);
    state.activeHero = unlocked[unlocked.length - 1].id;

    for (const badge of BADGES) {
      if (!state.badges[badge.id] && badge.check(state)) {
        state.badges[badge.id] = { earnedAt: Date.now() };
      }
    }
  }

  function digitRange(digitLevel, gradeId = getGradeId()) {
    // Younger grades use smaller number ranges
    if (gradeId === "prek") return { min: 1, max: 5 };
    if (gradeId === "k") return { min: 1, max: 10 };
    if (digitLevel === "dual") return { min: 10, max: 99 };
    if (gradeId === "1") return { min: 1, max: 20 };
    return { min: 1, max: 9 };
  }

  function roundDigitRanges(roundDigits) {
    const key = String(roundDigits || "2");
    if (key === "mix") {
      return [
        { min: 10, max: 99 },
        { min: 100, max: 999 },
        { min: 1000, max: 9999 },
      ];
    }
    if (key === "3") return [{ min: 100, max: 999 }];
    if (key === "4") return [{ min: 1000, max: 9999 }];
    return [{ min: 10, max: 99 }];
  }

  function buildRoundPool(roundPlace, roundDigits) {
    const pool = [];
    const seen = new Set();
    const places =
      roundPlace === "mix" ? [10, 100] : [Number(roundPlace) === 100 ? 100 : 10];
    const ranges = roundDigitRanges(roundDigits);

    const pushPair = (a, b) => {
      a = Number(a);
      b = Number(b);
      const id = `${a}:${b}`;
      if (seen.has(id)) return;
      // Skip questions that round to 0 (awkward for kids)
      if (roundToPlace(a, b) === 0) return;
      // Skip numbers already on the place (e.g. 240 → nearest 10)
      if (a % b === 0) return;
      seen.add(id);
      const key = factKey(a, b, "round");
      const fact = ensureFact(key);
      const weight = fact.mastered ? 0.35 : Math.max(1, fact.weight);
      pool.push({ a, b, key, weight });
    };

    for (const place of places) {
      for (const range of ranges) {
        let min = range.min;
        let max = range.max;
        // 2-digit + nearest 100: keep numbers that round to 100
        if (place === 100 && max < 100) {
          min = Math.max(min, 50);
          max = Math.min(max, 99);
        }
        for (let n = min; n <= max; n++) pushPair(n, place);
      }
    }
    return pool;
  }

  function buildPool(
    operation,
    max,
    tables,
    digitLevel,
    roundPlace,
    roundDigits,
    gradeId
  ) {
    const pool = [];
    const seen = new Set();

    const pushPair = (a, b) => {
      a = Number(a);
      b = Number(b);
      const id = `${a}:${b}`;
      if (seen.has(id)) return;
      seen.add(id);
      const key = factKey(a, b, operation);
      const fact = ensureFact(key);
      const weight = fact.mastered ? 0.35 : Math.max(1, fact.weight);
      pool.push({ a, b, key, weight });
    };

    if (operation === "round") {
      return buildRoundPool(roundPlace || "10", roundDigits || "3");
    }

    if (operation === "multiply") {
      const focus = (tables && tables.length ? tables : rangeTables(max))
        .map(Number)
        .filter((n) => n >= 1 && n <= max);
      for (const a of focus) {
        for (let b = 1; b <= max; b++) pushPair(a, b);
      }
      return pool;
    }

    const { min, max: hi } = digitRange(
      digitLevel || "single",
      gradeId || session?.grade || state.settings.grade || "2"
    );
    for (let a = min; a <= hi; a++) {
      for (let b = min; b <= hi; b++) {
        if (operation === "sub" && a < b) continue;
        pushPair(a, b);
      }
    }
    return pool;
  }

  function readShuffleSetting() {
    // Prefer the clear "Go in order" toggle (checked = sequential)
    const inOrder = $("in-order");
    if (inOrder) return !inOrder.checked;

    const orderSelect = $("question-order");
    if (orderSelect) return orderSelect.value !== "order";

    const legacy = $("shuffle");
    if (legacy) return !!legacy.checked;

    return !!state.settings.shuffle;
  }

  function buildOrderedQueue(
    operation,
    max,
    tables,
    digitLevel,
    roundPlace,
    roundDigits,
    gradeId
  ) {
    const pool = buildPool(
      operation,
      max,
      tables,
      digitLevel,
      roundPlace,
      roundDigits,
      gradeId
    );
    // Stable order: tables 7×1, 7×2… or rounding place then number
    pool.sort((x, y) => {
      if (operation === "round") {
        if (x.b !== y.b) return x.b - y.b;
        return x.a - y.a;
      }
      if (x.a !== y.a) return x.a - y.a;
      return x.b - y.b;
    });
    return pool.map((p) => ({ a: p.a, b: p.b, key: p.key }));
  }

  function pickQuestion(operation, max, shuffle, tables, digitLevel, roundPlace, roundDigits) {
    // Rounding is always random (never 13, then 14, then 15…)
    const wantOrder =
      operation !== "round" && (session ? session.shuffle === false : !shuffle);
    const place = roundPlace || session?.roundPlace || "10";
    const digits = roundDigits || session?.roundDigits || "3";

    // In-order mode: strict walk — never weighted-random
    if (wantOrder) {
      if (!session.queue || !session.queue.length) {
        session.queue = buildOrderedQueue(
          operation,
          max,
          tables,
          digitLevel,
          place,
          digits,
          session.grade
        );
        session.queueIndex = 0;
      }
      if (!session.queue.length) {
        return operation === "round"
          ? { a: 346, b: 10, key: factKey(346, 10, "round") }
          : { a: 1, b: 1, key: factKey(1, 1, operation) };
      }
      if (session.queueIndex >= session.queue.length) {
        session.queueIndex = 0;
      }
      const p = session.queue[session.queueIndex];
      session.queueIndex += 1;
      return { a: Number(p.a), b: Number(p.b), key: p.key };
    }

    const pool = buildPool(
      operation,
      max,
      tables,
      digitLevel,
      place,
      digits,
      session?.grade
    );
    if (!pool.length) {
      return operation === "round"
        ? { a: 346, b: 10, key: factKey(346, 10, "round") }
        : { a: 1, b: 1, key: factKey(1, 1, operation) };
    }

    const filtered =
      session?.current && pool.length > 1
        ? pool.filter((p) => !(p.a === session.current.a && p.b === session.current.b) || p.weight > 3)
        : pool;

    const use = filtered.length ? filtered : pool;
    const total = use.reduce((sum, p) => sum + p.weight, 0);
    let r = Math.random() * total;
    for (const p of use) {
      r -= p.weight;
      if (r <= 0) return { a: p.a, b: p.b, key: p.key };
    }
    const last = use[use.length - 1];
    return { a: last.a, b: last.b, key: last.key };
  }

  function formatProblem(a, b, promptType, operation) {
    a = Number(a);
    b = Number(b);

    if (operation === "round") {
      const result = roundToPlace(a, b);
      const placeWord = b === 100 ? "100" : "10";
      return {
        display: `Round ${a} to the nearest ${placeWord}`,
        expected: result,
        hint: "5 or more rounds up · type or say the answer",
      };
    }

    const sym = opSymbol(operation);
    const result = Number(computeResult(a, b, operation));
    const blank = "?";

    if (promptType === "missing-b") {
      return {
        display: `${a} ${sym} ${blank} = ${result}`,
        expected: b,
        hint: "Fill in the missing number — type it or say it",
      };
    }
    if (promptType === "missing-a") {
      return {
        display: `${blank} ${sym} ${b} = ${result}`,
        expected: a,
        hint: "Fill in the missing number — type it or say it",
      };
    }
    return {
      display: `${a} ${sym} ${b} = ${blank}`,
      expected: result,
      hint: "Type it or tap 🎤 and say it",
    };
  }

  function startMission(opts) {
    stopTimer();
    stopQuestionTimer();
    const operation = opts.operation || "multiply";
    const max = DIFFICULTY[opts.difficulty] || 10;
    const digitLevel = opts.digitLevel || "single";
    const roundPlace = opts.roundPlace || "10";
    const roundDigits = opts.roundDigits || "3";
    let tables = (opts.tables || [])
      .map(Number)
      .filter((n) => n >= 1 && n <= max)
      .sort((x, y) => x - y);
    if (!tables.length) tables = rangeTables(max);
    const problemType = operation === "round" ? "product" : opts.problemType || "product";
    // Rounding always shuffles; sequential order is for times-table drill only
    const shuffle = operation === "round" ? true : !!opts.shuffle;
    const perQuestionTimer = !!opts.perQuestionTimer;
    const grade = opts.grade && GRADE_PROFILES[opts.grade] ? opts.grade : getGradeId();
    const queue = shuffle
      ? null
      : buildOrderedQueue(
          operation,
          max,
          tables,
          digitLevel,
          roundPlace,
          roundDigits,
          grade
        );

    session = {
      grade,
      operation,
      difficulty: opts.difficulty,
      digitLevel,
      roundPlace,
      roundDigits,
      mode: opts.mode,
      shuffle,
      perQuestionTimer,
      tables,
      problemType,
      max,
      queue,
      queueIndex: 0,
      asked: 0,
      target: opts.mode === "10" || opts.mode === "20" ? Number(opts.mode) : null,
      correct: 0,
      firstTryCorrect: 0,
      attemptsOnCurrent: 0,
      sessionStars: 0,
      current: null,
      ended: false,
      waitingNext: false,
      timerId: null,
      questionTimerId: null,
      questionTimeLeft: QUESTION_SECS,
      timeLeft: 60,
    };

    state.settings = {
      grade,
      operation,
      difficulty: opts.difficulty,
      digitLevel,
      roundPlace,
      roundDigits,
      mode: opts.mode,
      shuffle: opts.shuffle,
      voiceMode: !!opts.voiceMode,
      perQuestionTimer,
      tables,
      problemType,
    };
    saveState();

    $("play-stars").textContent = "0";
    $("live-streak").textContent = String(state.streak);
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    setVoiceStatus("");
    updateHeroAvatar();
    $("hero-cheer").textContent = CHEERS[Math.floor(Math.random() * CHEERS.length)];

    const timerEl = $("play-timer");
    if (opts.mode === "timed" && !perQuestionTimer) {
      timerEl.hidden = false;
      timerEl.textContent = "60s";
      session.timerId = window.setInterval(() => {
        session.timeLeft -= 1;
        timerEl.textContent = `${session.timeLeft}s`;
        if (session.timeLeft <= 0) endMission("Time’s up!");
      }, 1000);
    } else if (!perQuestionTimer) {
      timerEl.hidden = true;
    }

    showScreen("play");
    nextQuestion();
  }

  function stopTimer() {
    if (session?.timerId) {
      clearInterval(session.timerId);
      session.timerId = null;
    }
  }

  function stopQuestionTimer() {
    if (session?.questionTimerId) {
      clearInterval(session.questionTimerId);
      session.questionTimerId = null;
    }
  }

  function updateQuestionTimerUI() {
    const timerEl = $("play-timer");
    if (!timerEl || !session) return;
    if (!session.perQuestionTimer) return;
    timerEl.hidden = false;
    timerEl.textContent = `${session.questionTimeLeft}s`;
  }

  function startQuestionTimer() {
    stopQuestionTimer();
    if (!session || !session.perQuestionTimer || session.ended) return;

    session.questionTimeLeft = QUESTION_SECS;
    updateQuestionTimerUI();

    session.questionTimerId = window.setInterval(() => {
      if (!session || session.ended || !session.accepting || session.waitingNext) {
        stopQuestionTimer();
        return;
      }
      session.questionTimeLeft -= 1;
      updateQuestionTimerUI();
      if (session.questionTimeLeft <= 0) {
        onQuestionTimeout();
      }
    }, 1000);
  }

  function onQuestionTimeout() {
    if (!session || session.ended || !session.current) return;
    if (!session.accepting || session.waitingNext) return;

    stopQuestionTimer();
    stopListening();
    session.accepting = false;
    session.attemptsOnCurrent += 1;
    playWrongSound();

    const card = $("problem-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    $("feedback").textContent = "Time’s up!";
    $("feedback").className = "feedback wrong";
    $("hero-cheer").textContent = "Faster next time!";
    $("answer").value = "";

    state.streak = 0;
    $("live-streak").textContent = "0";

    const fact = ensureFact(session.current.key);
    fact.weight = Math.min(20, fact.weight + 4);
    fact.correctStreak = 0;
    fact.wrongs += 1;
    fact.mastered = false;
    state.totalAttempts += 1;
    saveState();

    window.setTimeout(() => {
      if (session && !session.ended) nextQuestion();
    }, 650);
  }

  function nextQuestion() {
    if (!session || session.ended) return;
    stopQuestionTimer();

    if (session.target != null && session.asked >= session.target) {
      endMission("Mission complete!");
      return;
    }

    const picked = pickQuestion(
      session.operation,
      session.max,
      session.shuffle,
      session.tables,
      session.digitLevel,
      session.roundPlace,
      session.roundDigits
    );
    const promptType = choosePromptType(
      session.problemType,
      picked.a,
      picked.b,
      session.operation
    );
    const formatted = formatProblem(picked.a, picked.b, promptType, session.operation);
    session.current = {
      ...picked,
      a: Number(picked.a),
      b: Number(picked.b),
      promptType,
      expected: Number(formatted.expected),
      display: formatted.display,
      hint: formatted.hint,
    };
    session.attemptsOnCurrent = 0;
    session.accepting = true;
    session.waitingNext = false;
    session.asked += 1;

    const problemEl = $("problem-text");
    problemEl.textContent = session.current.display;
    problemEl.classList.toggle("equation", session.operation !== "round");
    problemEl.classList.toggle("round-prompt", session.operation === "round");
    const hintEl = $("problem-hint");
    if (hintEl) {
      if (session.operation === "round") {
        hintEl.textContent = session.current.hint || "Type or say the rounded number, then POW!";
      } else if (session.perQuestionTimer) {
        hintEl.textContent = `Beat the clock — ${QUESTION_SECS} seconds!`;
      } else if (!session.shuffle) {
        hintEl.textContent = "In order — type or say the answer, then POW!";
      } else {
        hintEl.textContent = "Say it or type it — then hit POW!";
      }
    }
    $("answer").value = "";
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("problem-card").classList.remove("shake", "pop");
    setPowLabel("POW!");
    stopListening();
    setVoiceStatus("");
    maybeAutoListen();
    startQuestionTimer();

    if (session.target != null) {
      $("play-progress").textContent = `Q ${session.asked} / ${session.target}`;
    } else if (session.mode === "timed") {
      $("play-progress").textContent = `Solved ${session.correct}`;
    } else {
      $("play-progress").textContent = `Q ${session.asked}`;
    }

    focusAnswer();
  }

  function onWrong() {
    stopListening();
    stopQuestionTimer();
    playWrongSound();
    const card = $("problem-card");
    card.classList.remove("shake");
    void card.offsetWidth;
    card.classList.add("shake");
    $("feedback").textContent = "Not yet — try again!";
    $("feedback").className = "feedback wrong";
    $("hero-cheer").textContent = "Shake it off. Try once more!";

    state.streak = 0;
    $("live-streak").textContent = "0";

    const fact = ensureFact(session.current.key);
    if (session.attemptsOnCurrent === 1) {
      // First miss on this prompt: bump frequency hard
      fact.weight = Math.min(20, fact.weight + 4);
      fact.correctStreak = 0;
      fact.wrongs += 1;
      fact.mastered = false;
    } else {
      fact.weight = Math.min(20, fact.weight + 1);
    }
    state.totalAttempts += 1;
    saveState();
    maybeAutoListen();
    // Wrong answer still on same question — restart the 5s clock if timed
    if (session.perQuestionTimer) startQuestionTimer();
    focusAnswer();
  }

  function onCorrect() {
    stopListening();
    stopQuestionTimer();
    playCorrectSound();
    session.accepting = false;
    const firstTry = session.attemptsOnCurrent === 1;
    const fact = ensureFact(session.current.key);

    fact.corrects += 1;
    fact.correctStreak += 1;
    if (fact.correctStreak >= MASTERY_STREAK) {
      fact.mastered = true;
      fact.weight = 0.5;
    } else {
      // Still reinforce until mastery, but ease a bit after success
      fact.weight = Math.max(1, fact.weight - 1);
    }

    state.totalCorrect += 1;
    state.totalAttempts += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);

    const starGain = firstTry ? 2 : 1;
    state.stars += starGain;
    session.sessionStars += starGain;
    session.correct += 1;
    if (firstTry) session.firstTryCorrect += 1;

    unlockRewards();
    saveState();

    $("play-stars").textContent = String(session.sessionStars);
    $("live-streak").textContent = String(state.streak);
    $("feedback").textContent = WIN_LINES[Math.floor(Math.random() * WIN_LINES.length)];
    $("feedback").className = "feedback right";
    $("hero-cheer").textContent = fact.mastered
      ? session.operation === "round"
        ? `${session.current.a} → ${session.current.expected} mastered!`
        : `${session.current.a}${opSymbol(session.operation)}${session.current.b} mastered!`
      : CHEERS[Math.floor(Math.random() * CHEERS.length)];

    const card = $("problem-card");
    card.classList.remove("pop");
    void card.offsetWidth;
    card.classList.add("pop");
    burstStars();

    session.waitingNext = true;
    setPowLabel("NEXT!");

    // Timed rounds keep moving — auto-advance after a short cheer
    if (session.perQuestionTimer) {
      window.setTimeout(() => {
        if (session && !session.ended && session.waitingNext) {
          session.waitingNext = false;
          nextQuestion();
        }
      }, 500);
    }
  }

  function burstStars() {
    const fx = $("fx");
    for (let i = 0; i < 6; i++) {
      const el = document.createElement("div");
      el.className = "star-burst";
      el.textContent = "★";
      el.style.left = `${20 + Math.random() * 60}%`;
      el.style.top = `${40 + Math.random() * 30}%`;
      el.style.color = Math.random() > 0.5 ? "#e6392e" : "#ffc107";
      fx.appendChild(el);
      window.setTimeout(() => el.remove(), 900);
    }
  }

  function endMission(title) {
    if (!session || session.ended) return;
    session.ended = true;
    stopListening();
    stopTimer();
    stopQuestionTimer();
    state.missionsCompleted += 1;
    unlockRewards();
    saveState();
    setVoiceStatus("");

    $("results-title").textContent = title;
    $("results-sub").textContent = `${CHILD} powered through another mission.`;

    const accuracy =
      session.correct + (session.asked ? 0 : 0) === 0 && session.correct === 0
        ? 0
        : Math.round((session.firstTryCorrect / Math.max(1, session.correct)) * 100);

    $("results-grid").innerHTML = `
      <div class="stat-card"><strong>${session.sessionStars}</strong>stars earned</div>
      <div class="stat-card"><strong>${session.correct}</strong>solved</div>
      <div class="stat-card"><strong>${session.firstTryCorrect}</strong>first-try hits</div>
      <div class="stat-card"><strong>${state.bestStreak}</strong>best streak</div>
    `;

    void accuracy;
    showScreen("results");
  }

  function tableMasteryPercent(n, maxCheck) {
    let done = 0;
    const limit = maxCheck;
    for (let i = 1; i <= limit; i++) {
      const f = state.facts[factKey(n, i)];
      if (f?.mastered) done += 1;
    }
    return Math.round((done / limit) * 100);
  }

  function renderMap() {
    const max = DIFFICULTY[state.settings.difficulty] || 10;
    const grid = $("map-grid");
    grid.innerHTML = "";
    for (let n = 1; n <= max; n++) {
      const pct = tableMasteryPercent(n, max);
      const cell = document.createElement("div");
      cell.className = "map-cell";
      if (pct >= 100) cell.classList.add("mastered");
      else if (pct > 0) cell.classList.add("training");
      else cell.classList.add("locked");
      cell.innerHTML = `<span class="table-n">${n}s</span>${pct}%`;
      grid.appendChild(cell);
    }
  }

  function renderBadges() {
    const grid = $("badge-grid");
    grid.innerHTML = "";

    const universes = ["Marvel", "Roblox", "Fortnite"];
    for (const universe of universes) {
      const heading = document.createElement("h2");
      heading.className = "badge-universe";
      heading.textContent = universe;
      grid.appendChild(heading);

      const row = document.createElement("div");
      row.className = "badge-universe-grid";
      for (const hero of HEROES.filter((h) => h.universe === universe)) {
        const unlocked = !!state.unlockedHeroes[hero.id];
        const card = document.createElement("div");
        card.className = `badge-card${unlocked ? "" : " locked"}`;
        card.innerHTML = `
          <span class="icon">${hero.icon}</span>
          <h3>${hero.name}</h3>
          <p>${unlocked ? "Unlocked hero" : `Need ${hero.need} stars`}</p>
        `;
        row.appendChild(card);
      }
      grid.appendChild(row);
    }

    const badgeHeading = document.createElement("h2");
    badgeHeading.className = "badge-universe";
    badgeHeading.textContent = "Power Badges";
    grid.appendChild(badgeHeading);

    const badgeRow = document.createElement("div");
    badgeRow.className = "badge-universe-grid";
    for (const badge of BADGES) {
      const earned = !!state.badges[badge.id];
      const card = document.createElement("div");
      card.className = `badge-card${earned ? "" : " locked"}`;
      card.innerHTML = `
        <span class="icon">${badge.icon}</span>
        <h3>${badge.name}</h3>
        <p>${badge.desc}</p>
      `;
      badgeRow.appendChild(card);
    }
    grid.appendChild(badgeRow);
  }

  function weakFacts(limit = 8) {
    return Object.entries(state.facts)
      .filter(([, f]) => f.wrongs > 0 || (!f.mastered && f.corrects + f.wrongs > 0))
      .sort((a, b) => b[1].weight - a[1].weight || b[1].wrongs - a[1].wrongs)
      .slice(0, limit);
  }

  function renderParent() {
    const weak = weakFacts();
    const mastered = Object.values(state.facts).filter((f) => f.mastered).length;
    const accuracy =
      state.totalAttempts === 0
        ? 0
        : Math.round((state.totalCorrect / state.totalAttempts) * 100);

    const gradeLabel =
      GRADE_PROFILES[state.settings.grade]?.label || "Grade 2";

    const robloxLog = Array.isArray(state.robloxLog) ? state.robloxLog : [];
    const robloxLogHtml = robloxLog.length
      ? `<ul>${robloxLog
          .slice(0, 10)
          .map(
            (e) =>
              `<li>${e.day}: +${e.points} pts · Week ${e.week || "?"} · ${e.pct}% (${e.right}/${e.total})</li>`
          )
          .join("")}</ul>`
      : "<p>No Roblox points earned yet.</p>";

    $("parent-summary").innerHTML = `
      <div class="parent-card">
        <h3>Roblox points bank</h3>
        <p style="margin:0 0 0.5rem;font-weight:900;font-size:1.35rem">
          <span data-roblox-points>${getRobloxPoints()}</span> points to buy
        </p>
        <p style="margin:0 0 0.65rem;font-weight:700;color:var(--muted)">
          Earn ${ROBLOX_REWARD_POINTS} points for a Social Studies quiz at ${ROBLOX_PASS_PCT}%+. Once per day. Buy the bank at week’s end, then clear.
        </p>
        ${robloxLogHtml}
        <button type="button" class="btn secondary" id="btn-clear-roblox" style="margin-top:0.75rem;width:100%">
          Clear bank (after you buy)
        </button>
      </div>
      <div class="parent-card">
        <h3>Overview</h3>
        <ul>
          <li>Grade: ${gradeLabel}</li>
          <li>Stars: ${state.stars}</li>
          <li>Best streak: ${state.bestStreak}</li>
          <li>Missions finished: ${state.missionsCompleted}</li>
          <li>Facts mastered: ${mastered}</li>
          <li>Lifetime accuracy: ${accuracy}%</li>
          <li>Hero level: ${levelFromStars(state.stars)}</li>
          <li>Focus tables: ${(state.settings.tables || []).map((n) => `${n}×`).join(", ") || "all"}</li>
          <li>Skill: ${
            state.settings.operation === "add"
              ? "Addition"
              : state.settings.operation === "sub"
                ? "Subtraction"
                : state.settings.operation === "round"
                  ? "Rounding"
                  : "Multiplication"
          }${
            state.settings.operation === "round"
              ? ` · nearest ${
                  state.settings.roundPlace === "mix"
                    ? "10s & 100s"
                    : state.settings.roundPlace === "100"
                      ? "100"
                      : "10"
                } · ${
                  state.settings.roundDigits === "mix"
                    ? "2/3/4 digits"
                    : `${state.settings.roundDigits || "2"} digits`
                }`
              : state.settings.operation === "add" || state.settings.operation === "sub"
                ? ` · ${state.settings.digitLevel === "dual" ? "dual digit" : "single digit"}`
                : ""
          }</li>
        </ul>
      </div>
      <div class="parent-card">
        <h3>Needs more practice</h3>
        ${
          weak.length
            ? `<ul>${weak
                .map(([key, f]) => {
                  let pretty = key;
                  const roundMatch = key.match(/^r(\d+):(\d+)$/);
                  if (roundMatch) {
                    pretty = `Round ${roundMatch[2]} → nearest ${roundMatch[1]}`;
                  } else {
                    pretty = key
                      .replace(/^.:/, "")
                      .replace("x", " × ")
                      .replace("+", " + ")
                      .replace("-", " − ");
                  }
                  return `<li>${pretty} · weight ${f.weight.toFixed(1)} · ${f.correctStreak}/${MASTERY_STREAK} streak</li>`;
                })
                .join("")}</ul>`
            : "<p>No weak facts yet — start a mission!</p>"
        }
      </div>
      <div class="parent-card">
        <h3>How mastery works</h3>
        <p style="margin:0;font-weight:700;color:var(--muted)">
          Missed facts show up more often. A fact is mastered after ${MASTERY_STREAK} correct answers in a row.
          Wrong answers must be retried until correct (no hint).
        </p>
      </div>
    `;
    $("btn-clear-roblox")?.addEventListener("click", clearRobloxBank);
  }

  function submitAnswer(guess) {
    if (!session || session.ended || !session.current) return;
    if (session.waitingNext) return;
    if (session.accepting === false) return;

    guess = Number(guess);
    if (!Number.isFinite(guess)) return;

    const expected = Number(session.current.expected);
    session.attemptsOnCurrent += 1;

    if (guess === expected) onCorrect();
    else {
      onWrong();
      $("answer").value = "";
    }
  }

  // Events
  $("setup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const operation = $("operation")?.value || "multiply";
    const tables = operation === "multiply" ? getSelectedTables() : state.settings.tables || rangeTables(10);
    if (operation === "multiply" && !tables.length) {
      alert("Pick at least one times table (like 2× or 7×).");
      return;
    }
    const voiceOn = !!$("voice-mode")?.checked;
    await unlockAudio();
    await playStartSound();
    if (voiceOn && speechSupported()) {
      await ensureMicAccess();
    }
    startMission({
      grade: $("grade")?.value || state.settings.grade || "2",
      operation,
      difficulty: $("difficulty")?.value || "medium",
      digitLevel: $("digit-level")?.value || "single",
      ...readRoundSettings(),
      mode: $("mode")?.value || "endless",
      shuffle: readShuffleSetting(),
      voiceMode: voiceOn,
      perQuestionTimer: !!$("per-question-timer")?.checked,
      tables,
      problemType: $("problem-type")?.value || "product",
    });
  });

  $("grade")?.addEventListener("change", () => {
    const gradeId = $("grade").value;
    syncGradeUI(gradeId, { applyDefaults: true });
    saveState();
  });

  $("operation")?.addEventListener("change", () => {
    state.settings.operation = $("operation").value;
    syncOperationUI();
    saveState();
  });

  $("difficulty")?.addEventListener("change", () => {
    const max = currentMax();
    state.settings.tables = getSelectedTables().filter((n) => n <= max);
    if (!state.settings.tables.length) state.settings.tables = rangeTables(max);
    renderTableChips();
  });

  $("table-chips")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".table-chip");
    if (!btn || btn.hidden) return;
    e.preventDefault();
    const on = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", on ? "false" : "true");
  });

  $("tables-all")?.addEventListener("click", () => {
    document.querySelectorAll(".table-chip").forEach((btn) => {
      if (btn.hidden) return;
      btn.setAttribute("aria-pressed", "true");
    });
  });

  $("tables-none")?.addEventListener("click", () => {
    document.querySelectorAll(".table-chip").forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
    });
  });

  $("answer-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!session || session.ended || !session.current) return;

    // After a correct answer, POW becomes NEXT!
    if (session.waitingNext) {
      session.waitingNext = false;
      nextQuestion();
      return;
    }

    if (session.accepting === false) return;

    const raw = String($("answer").value || "").replace(/[^\d]/g, "");
    if (!raw) {
      $("feedback").textContent = "Say or type a number, then hit POW!";
      $("feedback").className = "feedback wrong";
      return;
    }

    await unlockAudio();
    submitAnswer(Number(raw));
  });

  $("btn-mic")?.addEventListener("click", async () => {
    if (session?.waitingNext) return;
    await unlockAudio();
    if (listening) {
      stopListening();
      setVoiceStatus("Mic paused — tap Mic to listen");
      return;
    }
    await startListeningWithPermission();
  });

  $("btn-quit").addEventListener("click", () => {
    if (!session || session.ended) {
      showScreen("home");
      return;
    }
    if (confirm("Quit this mission?")) {
      endMission("Mission paused");
    }
  });

  $("btn-again").addEventListener("click", () => {
    startMission({
      grade: state.settings.grade || "2",
      operation: state.settings.operation || "multiply",
      difficulty: state.settings.difficulty,
      digitLevel: state.settings.digitLevel || "single",
      roundPlace: state.settings.roundPlace || "10",
      roundDigits: state.settings.roundDigits || "3",
      mode: state.settings.mode,
      shuffle: state.settings.shuffle,
      voiceMode: !!state.settings.voiceMode,
      perQuestionTimer: !!state.settings.perQuestionTimer,
      tables: state.settings.tables,
      problemType: state.settings.problemType || "product",
    });
  });

  function resetProgress() {
    if (!confirm("Reset all progress for Ali Ayaan?")) return;
    state = defaultState();
    saveState();
    renderParent();
    renderHome();
    showScreen("home");
  }

  $("btn-reset").addEventListener("click", resetProgress);
  $("btn-reset-results").addEventListener("click", resetProgress);

  document.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.getAttribute("data-go")));
  });

  function pokeAudio() {
    // Never block UI on audio unlock / sound
    Promise.resolve()
      .then(() => unlockAudio())
      .then(() => playStartSound())
      .catch(() => {});
  }

  $("btn-ss-learn")?.addEventListener("click", () => {
    pokeAudio();
    startSocialLearn();
  });

  $("btn-ss-quiz")?.addEventListener("click", () => {
    pokeAudio();
    startSocialQuiz();
  });

  $("btn-ss-study-jump")?.addEventListener("click", () => {
    $("ss-study")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("btn-ss-learn-quit")?.addEventListener("click", () => {
    if (confirm("Leave Learning and go back?")) showScreen("social");
  });

  $("btn-ss-learn-back")?.addEventListener("click", () => advanceSocialLearn(-1));

  $("btn-ss-learn-next")?.addEventListener("click", () => {
    if (ssLearnIndex >= SS_LESSONS.length - 1) pokeAudio();
    advanceSocialLearn(1);
  });

  $("btn-ss-quit")?.addEventListener("click", () => {
    if (!ssSession) {
      showScreen("social");
      return;
    }
    if (confirm("Quit this Social Studies assessment?")) {
      ssSession = null;
      showScreen("social");
    }
  });

  $("btn-ss-quiz-go")?.addEventListener("click", () => {
    pokeAudio();
    beginSocialQuizQuestions();
  });

  $("btn-ss-next")?.addEventListener("click", () => advanceSocialQuiz());

  $("btn-ss-retry")?.addEventListener("click", () => {
    pokeAudio();
    startSocialQuiz();
  });

  $("btn-ss-learn-again")?.addEventListener("click", () => {
    pokeAudio();
    startSocialLearn();
  });

  // iPad: keep input usable
  $("answer").addEventListener("focus", () => {
    window.setTimeout(() => {
      $("answer").scrollIntoView({ block: "center", behavior: "smooth" });
    }, 300);
  });

  renderHome();
})();

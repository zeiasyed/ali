(() => {
  const STORAGE_KEY = "ali-ayaan-hero-times-v1";
  /** Dedicated keys so Roblox bank survives main-state resets / version reloads */
  const ROBLOX_BANK_KEY = "ali-ayaan-roblox-bank-v1";
  const ROBLOX_BANK_BACKUP_KEY = "ali-ayaan-roblox-bank-backup-v1";
  /** Parent clear sets this to "cleared"; otherwise floor is always enforced on load */
  const ROBLOX_FLOOR_FLAG = "ali-ayaan-roblox-floor-225-2026-11-16";
  const ROBLOX_FLOOR_POINTS = 225;
  const CHILD = "Ali Ayaan";
  const MASTERY_STREAK = 5;
  /** After a miss, re-ask this many questions later (not the very next one) */
  const RETRY_GAP_MIN = 2;
  const RETRY_GAP_MAX = 4;
  const RETRY_AFTER_HIT_GAP = 3;
  const QUESTION_SECS = 5;

  const DIFFICULTY = {
    easy: 5,
    medium: 10,
    hard: 12,
    expert: 15,
  };

  /** Grade unlocks skills and sets kid-friendly defaults */
  const GRADE_PROFILES = {
    // Pre-K folded into Kindergarten (kept as alias for old saved settings)
    prek: {
      label: "Kindergarten",
      skills: ["add", "sub"],
      defaultOp: "add",
      digitLevel: "single",
      difficulty: "easy",
      roundPreset: "mix:2",
      subjects: ["math", "english", "social"],
    },
    k: {
      label: "Kindergarten",
      skills: ["add", "sub"],
      defaultOp: "add",
      digitLevel: "single",
      difficulty: "easy",
      roundPreset: "mix:2",
      subjects: ["math", "english", "social"],
    },
    1: {
      label: "Grade 1",
      skills: ["add", "sub"],
      defaultOp: "add",
      digitLevel: "single",
      difficulty: "easy",
      roundPreset: "mix:2",
      subjects: ["math", "english", "social"],
    },
    2: {
      label: "Grade 2",
      skills: ["add", "sub", "multiply", "divide", "md-mult", "long-div", "round"],
      defaultOp: "multiply",
      digitLevel: "dual",
      difficulty: "easy",
      roundPreset: "mix:2",
      subjects: ["math", "english", "social"],
    },
    3: {
      label: "Grade 3",
      skills: ["add", "sub", "multiply", "divide", "md-mult", "long-div", "round"],
      defaultOp: "multiply",
      digitLevel: "dual",
      difficulty: "medium",
      roundPreset: "mix:3",
      subjects: ["math", "english", "social", "arabic"],
    },
    4: {
      label: "Grade 4",
      skills: ["add", "sub", "multiply", "divide", "md-mult", "long-div", "round"],
      defaultOp: "multiply",
      digitLevel: "dual",
      difficulty: "hard",
      roundPreset: "mix:mix",
      subjects: ["math", "english", "social"],
    },
  };

  const SUBJECT_LABELS = {
    math: "Math",
    english: "English",
    social: "Social Studies",
    arabic: "Arabic",
  };

  function gradeAllowsSocial(gradeId = getGradeId()) {
    const subjects = getGradeProfile(gradeId).subjects || ["math", "english", "social"];
    return subjects.includes("social");
  }

  const SKILL_LABELS = {
    multiply: "Multiplication",
    divide: "Division",
    "md-mult": "Practice · multi-digit ×",
    "long-div": "Practice · long division",
    add: "Addition",
    sub: "Subtraction",
    round: "Rounding · nearest 10 / 100",
  };

  function isPadPractice(op) {
    return op === "md-mult" || op === "long-div";
  }

  /** Every math skill earns Roblox on a completed fixed round (90%+ first-try) */
  function isRobloxSkill(op) {
    return (
      op === "add" ||
      op === "sub" ||
      op === "multiply" ||
      op === "divide" ||
      op === "md-mult" ||
      op === "long-div" ||
      op === "round"
    );
  }

  /** Pad + rounding lock to a fixed 10-question mission */
  function locksFixedTenMission(op) {
    return isPadPractice(op) || op === "round";
  }

  function robloxSkillTitle(op) {
    if (op === "long-div") return "Practice · long division";
    if (op === "md-mult") return "Practice · multi-digit ×";
    if (op === "round") return "Rounding practice";
    if (op === "multiply") return "Multiplication practice";
    if (op === "divide") return "Division practice";
    if (op === "add") return "Addition practice";
    if (op === "sub") return "Subtraction practice";
    return "Math practice";
  }

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
    // Easy division starts as “45 ÷ 5 = ?” only
    if (operation === "divide") return "product";
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
    if (btn) {
      btn.textContent = text;
      if (text === "POW!") btn.disabled = false;
    }
  }

  let answerKeyboardWanted = false;

  /** Pre-K / Kindergarten addition: keyboard only (no Pencil / Keyboard toggle) */
  function usesKeyboardOnlyAnswer(op = session?.operation, grade = session?.grade) {
    const gradeId = grade || state.settings.grade || getGradeId();
    const operation = op || state.settings.operation || "multiply";
    return (gradeId === "k" || gradeId === "prek") && operation === "add";
  }

  function setAnswerInputMode(wantKeyboard) {
    answerKeyboardWanted = !!wantKeyboard;
    const keyboardOnly = usesKeyboardOnlyAnswer();
    // Math always needs the number pad (not letters) when the keyboard is open
    const mode = keyboardOnly || wantKeyboard ? "numeric" : "none";
    const ans = $("answer");
    const rem = $("answer-rem");
    const applyMode = (el, placeholder) => {
      if (!el) return;
      el.setAttribute("inputmode", mode);
      if (mode === "numeric") {
        el.setAttribute("pattern", "[0-9]*");
        el.setAttribute("enterkeyhint", "done");
      } else {
        el.removeAttribute("pattern");
      }
      if (placeholder != null) el.placeholder = placeholder;
    };
    applyMode(
      ans,
      keyboardOnly ? "Type here" : wantKeyboard ? "Type answer" : "Write with Pencil"
    );
    applyMode(rem, null);
    const btn = $("btn-keyboard");
    if (btn) btn.classList.toggle("keyboard-on", wantKeyboard && !keyboardOnly);
  }

  function syncAnswerEntryUI() {
    const keyboardOnly = usesKeyboardOnlyAnswer(
      $("operation")?.value || session?.operation || state.settings.operation,
      $("grade")?.value || session?.grade || state.settings.grade
    );
    const hint = $("answer-pen-hint");
    const keyBtn = $("btn-keyboard");
    if (hint) {
      hint.hidden = keyboardOnly;
      hint.style.display = keyboardOnly ? "none" : "";
    }
    if (keyBtn) {
      keyBtn.hidden = keyboardOnly;
      keyBtn.style.display = keyboardOnly ? "none" : "";
    }
    document.body.classList.toggle("keyboard-only-answer", keyboardOnly);
  }

  /** Pencil mode by default; Pre-K/K addition opens the keyboard like before */
  function focusAnswer() {
    if (usesKeyboardOnlyAnswer()) {
      openAnswerKeyboard();
      return;
    }
    setAnswerInputMode(false);
    window.setTimeout(() => {
      try {
        $("answer")?.blur();
        $("answer-rem")?.blur();
      } catch {
        /* ignore */
      }
    }, 40);
  }

  function syncPlayViewportFit() {
    const vv = window.visualViewport;
    const full = window.innerHeight || document.documentElement.clientHeight || 1;
    const visible = vv?.height || full;
    const landscape = window.matchMedia("(orientation: landscape)").matches;
    const kbOpen = visible / full < 0.78;
    document.documentElement.style.setProperty("--vvh", `${Math.round(visible)}px`);
    document.body.classList.toggle("play-landscape", landscape);
    document.body.classList.toggle("kb-open", kbOpen);
    const playOn =
      $("screen-play")?.classList.contains("active") ||
      $("screen-eng-play")?.classList.contains("active");
    document.body.classList.toggle("play-fit", !!(playOn && (landscape || kbOpen)));
    document.body.classList.toggle("eng-play-on", !!$("screen-eng-play")?.classList.contains("active"));
  }

  function ensureAnswerVisible() {
    const input = $("answer");
    if (!input) return;
    syncPlayViewportFit();
    window.requestAnimationFrame(() => {
      const vv = window.visualViewport;
      const rect = input.getBoundingClientRect();
      if (!vv) {
        input.scrollIntoView({ block: "nearest", inline: "nearest" });
        return;
      }
      const topLimit = vv.offsetTop + 8;
      const bottomLimit = vv.offsetTop + vv.height - 10;
      if (rect.bottom > bottomLimit || rect.top < topLimit) {
        input.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    });
  }

  function openAnswerKeyboard() {
    const input = $("answer");
    if (!input) return;
    // Blur first so iPad rebuilds the keyboard as numeric, not letters
    try {
      input.blur();
      $("answer-rem")?.blur();
    } catch {
      /* ignore */
    }
    setAnswerInputMode(true);
    syncPlayViewportFit();
    window.setTimeout(() => {
      input.focus({ preventScroll: true });
      try {
        if (usesKeyboardOnlyAnswer()) {
          input.select();
        } else {
          const len = String(input.value || "").length;
          input.setSelectionRange(len, len);
        }
      } catch {
        /* ignore */
      }
      ensureAnswerVisible();
      // Second pass after iPad keyboard finishes animating
      window.setTimeout(ensureAnswerVisible, 280);
    }, 50);
  }

  /** Map Scribble/handwriting lookalikes to digits (S→5, O→0, etc.) */
  function digitizeHandwriting(raw) {
    const map = {
      O: "0",
      o: "0",
      D: "0",
      Q: "0",
      I: "1",
      i: "1",
      l: "1",
      L: "1",
      "|": "1",
      "!": "1",
      Z: "2",
      z: "2",
      E: "3",
      A: "4",
      h: "4",
      S: "5",
      s: "5",
      $: "5",
      G: "6",
      b: "6",
      T: "7",
      "?": "7",
      B: "8",
      "&": "8",
      g: "9",
      q: "9",
      p: "9",
    };
    return String(raw || "")
      .split("")
      .map((ch) => {
        if (/\d/.test(ch)) return ch;
        return map[ch] || "";
      })
      .join("");
  }

  function normalizeAnswerField(el) {
    if (!el) return "";
    const digits = digitizeHandwriting(el.value);
    if (el.value !== digits) {
      const start = el.selectionStart;
      el.value = digits;
      try {
        const pos = Math.min(digits.length, start ?? digits.length);
        el.setSelectionRange(pos, pos);
      } catch {
        /* ignore */
      }
    }
    return digits;
  }

  function rangeTables(max) {
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  function opSymbol(operation) {
    if (operation === "add") return "+";
    if (operation === "sub") return "−";
    if (operation === "divide") return "÷";
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
    if (operation === "divide") return Math.floor(Number(a) / Number(b));
    if (operation === "round") return roundToPlace(a, b);
    return a * b;
  }

  function clampInt(n, lo, hi, fallback) {
    n = Number(n);
    if (!Number.isFinite(n)) n = fallback;
    return Math.max(lo, Math.min(hi, Math.round(n)));
  }

  function readMdRangeSettings() {
    let bigMin = clampInt($("md-big-min")?.value, 10, 9999, state.settings.mdBigMin || 10);
    let bigMax = clampInt($("md-big-max")?.value, 10, 9999, state.settings.mdBigMax || 99);
    let smallMin = clampInt($("md-small-min")?.value, 1, 9, state.settings.mdSmallMin || 2);
    let smallMax = clampInt($("md-small-max")?.value, 1, 9, state.settings.mdSmallMax || 9);
    if (bigMax < bigMin) [bigMin, bigMax] = [bigMax, bigMin];
    if (smallMax < smallMin) [smallMin, smallMax] = [smallMax, smallMin];
    return { mdBigMin: bigMin, mdBigMax: bigMax, mdSmallMin: smallMin, mdSmallMax: smallMax };
  }

  function syncMdRangeInputs(settings = state.settings) {
    if ($("md-big-min")) $("md-big-min").value = String(settings.mdBigMin || 10);
    if ($("md-big-max")) $("md-big-max").value = String(settings.mdBigMax || 99);
    if ($("md-small-min")) $("md-small-min").value = String(settings.mdSmallMin || 2);
    if ($("md-small-max")) $("md-small-max").value = String(settings.mdSmallMax || 9);
  }

  function randomInRange(min, max) {
    min = Number(min);
    max = Number(max);
    if (max < min) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomMdMultPair(range) {
    const single = randomInRange(range.mdSmallMin, range.mdSmallMax);
    const multi = randomInRange(range.mdBigMin, range.mdBigMax);
    // Random order so kids see both 5×35 and 35×5
    if (Math.random() < 0.5) {
      return {
        a: single,
        b: multi,
        key: factKey(single, multi, "multiply"),
      };
    }
    return {
      a: multi,
      b: single,
      key: factKey(single, multi, "multiply"),
    };
  }

  function readLongDivRangeSettings() {
    let divMin = clampInt($("ld-div-min")?.value, 10, 9999, state.settings.ldDivMin || 10);
    let divMax = clampInt($("ld-div-max")?.value, 10, 9999, state.settings.ldDivMax || 99);
    let byMin = clampInt($("ld-by-min")?.value, 2, 9, state.settings.ldByMin || 2);
    let byMax = clampInt($("ld-by-max")?.value, 2, 9, state.settings.ldByMax || 9);
    if (divMax < divMin) [divMin, divMax] = [divMax, divMin];
    if (byMax < byMin) [byMin, byMax] = [byMax, byMin];
    return { ldDivMin: divMin, ldDivMax: divMax, ldByMin: byMin, ldByMax: byMax };
  }

  function syncLongDivRangeInputs(settings = state.settings) {
    if ($("ld-div-min")) $("ld-div-min").value = String(settings.ldDivMin || 10);
    if ($("ld-div-max")) $("ld-div-max").value = String(settings.ldDivMax || 99);
    if ($("ld-by-min")) $("ld-by-min").value = String(settings.ldByMin || 2);
    if ($("ld-by-max")) $("ld-by-max").value = String(settings.ldByMax || 9);
  }

  /** Long division with remainders allowed (remainder may be 0). */
  function randomLongDivPair(range) {
    const divisor = randomInRange(range.ldByMin, range.ldByMax);
    const lo = Math.max(range.ldDivMin, divisor);
    const hi = Math.max(lo, range.ldDivMax);
    let dividend = randomInRange(lo, hi);
    // ~1 in 3 exact so kids practice both with and without leftover
    if (Math.random() < 0.33) {
      const qMin = Math.max(1, Math.ceil(lo / divisor));
      const qMax = Math.max(qMin, Math.floor(hi / divisor));
      dividend = divisor * randomInRange(qMin, qMax);
    }
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    return {
      a: dividend,
      b: divisor,
      dividend,
      divisor,
      expected: quotient,
      remainder,
      key: `d:${dividend}/${divisor}`,
    };
  }

  function setLongDivAnswerUI(visible) {
    const wrap = $("ld-rem-wrap");
    const rem = $("answer-rem");
    const ans = $("answer");
    if (wrap) wrap.hidden = !visible;
    if (ans) {
      ans.placeholder = visible ? "Quotient" : "Type here";
      ans.classList.toggle("ld-quot-input", !!visible);
    }
    if (rem) {
      rem.value = "";
      rem.hidden = !visible;
    }
    document.body.classList.toggle("ld-answer-mode", !!visible);
  }

  function longDivisionDisplayHtml(dividend, divisor) {
    return `
      <span class="ld-figure" aria-label="${dividend} divided by ${divisor}">
        <span class="ld-top">
          <span class="ld-gutter" aria-hidden="true"></span>
          <span class="ld-quot-slot">?</span>
        </span>
        <span class="ld-mid">
          <span class="ld-divisor">${divisor}</span>
          <span class="ld-rparen" aria-hidden="true">)</span>
          <span class="ld-dividend">${dividend}</span>
        </span>
      </span>
    `;
  }

  /** Step-by-step long division for a 1-digit divisor (remainder OK). */
  function buildLongDivisionWork(dividend, divisor) {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    const digits = String(dividend).split("").map(Number);
    const steps = [];
    let i = 0;
    let working = 0;

    while (i < digits.length && working < divisor) {
      working = working * 10 + digits[i];
      i += 1;
    }

    while (true) {
      const qDigit = Math.floor(working / divisor);
      const product = qDigit * divisor;
      const nextRem = working - product;
      const step = {
        ask: `How many ${divisor}s fit in ${working}?`,
        fit: `${qDigit}`,
        multiply: `${qDigit} × ${divisor} = ${product}`,
        subTop: working,
        subBot: product,
        subDiff: nextRem,
      };
      if (i < digits.length) {
        const brought = digits[i];
        i += 1;
        working = nextRem * 10 + brought;
        step.bring = `Bring down ${brought} → ${working}`;
        steps.push(step);
      } else {
        if (nextRem > 0) {
          step.left = `Left over (remainder) = ${nextRem}`;
        } else {
          step.left = "Nothing left over — remainder = 0";
        }
        steps.push(step);
        break;
      }
    }

    return {
      quotient,
      remainder,
      steps,
      check:
        remainder > 0
          ? `${quotient} × ${divisor} + ${remainder} = ${dividend}`
          : `${quotient} × ${divisor} = ${dividend}`,
    };
  }

  function verticalSubtractHtml(top, bot, diff) {
    const width = Math.max(String(top).length, String(bot).length, String(diff).length);
    const pad = (n) => String(n).padStart(width, " ");
    return `
      <div class="ld-vsub" aria-label="${top} minus ${bot} equals ${diff}">
        <div class="ld-vsub-row">${pad(top)}</div>
        <div class="ld-vsub-row ld-vsub-minus"><span class="ld-vsub-op">−</span>${pad(bot)}</div>
        <div class="ld-vsub-line" aria-hidden="true"></div>
        <div class="ld-vsub-row ld-vsub-diff">${pad(diff)}</div>
      </div>
    `;
  }

  function renderWorkedSolution(dividend, divisor) {
    const work = buildLongDivisionWork(dividend, divisor);
    const stepsHtml = work.steps
      .map(
        (s, idx) => `
      <li class="ld-step">
        <p class="ld-step-n">Step ${idx + 1}</p>
        <p><strong>${s.ask}</strong> → <span class="ld-fit">${s.fit}</span></p>
        <p>${s.multiply}</p>
        ${verticalSubtractHtml(s.subTop, s.subBot, s.subDiff)}
        ${s.bring ? `<p class="ld-bring">${s.bring}</p>` : ""}
        ${s.left ? `<p class="ld-left">${s.left}</p>` : ""}
      </li>`
      )
      .join("");
    const answerHtml =
      work.remainder > 0
        ? `Answer = <strong>${work.quotient}</strong> <span class="ld-r-mark">R</span> <strong>${work.remainder}</strong>`
        : `Answer = <strong>${work.quotient}</strong> <span class="ld-r-none">R 0</span>`;
    return `
      <p class="ld-worked-title">Here’s the work</p>
      <div class="ld-mini-problem" aria-hidden="true">
        <span class="ld-figure small">
          <span class="ld-top">
            <span class="ld-gutter"></span>
            <span class="ld-quot-slot filled">${work.quotient}</span>
          </span>
          <span class="ld-mid">
            <span class="ld-divisor">${divisor}</span>
            <span class="ld-rparen">)</span>
            <span class="ld-dividend">${dividend}</span>
          </span>
        </span>
      </div>
      <ol class="ld-steps">${stepsHtml}</ol>
      <p class="ld-answer-big">${answerHtml}</p>
      <p class="ld-check">Check: ${work.check} ✓</p>
    `;
  }

  function resetHelpWork() {
    const help = $("help-work");
    const btn = $("btn-show-work");
    const panel = $("worked-solution");
    if (help) help.hidden = true;
    if (btn) {
      btn.hidden = true;
      btn.disabled = false;
    }
    if (panel) {
      panel.hidden = true;
      panel.innerHTML = "";
    }
  }

  function offerShowWork() {
    const help = $("help-work");
    const btn = $("btn-show-work");
    if (help) help.hidden = false;
    if (btn) btn.hidden = false;
  }

  function revealLongDivisionWork() {
    if (!session?.current) return;
    const dividend = session.current.dividend ?? session.current.a;
    const divisor = session.current.divisor ?? session.current.b;
    const panel = $("worked-solution");
    const help = $("help-work");
    const btn = $("btn-show-work");
    if (help) help.hidden = false;
    if (panel) {
      panel.hidden = false;
      panel.innerHTML = renderWorkedSolution(dividend, divisor);
      panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    if (btn) btn.hidden = true;
    session.workShown = true;
    $("feedback").textContent = "Study the work, then type the answer!";
    $("feedback").className = "feedback";
    $("hero-cheer").textContent = "Now you can finish it!";
    focusAnswer();
  }

  const workPad = {
    ready: false,
    drawing: false,
    lastX: 0,
    lastY: 0,
    ctx: null,
  };

  function resizeWorkPad() {
    const canvas = $("work-pad-canvas");
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1a1f36";
    ctx.fillStyle = "#1a1f36";
    ctx.lineWidth = 4.5;
    workPad.ctx = ctx;
  }

  function clearWorkPad() {
    const canvas = $("work-pad-canvas");
    if (!canvas) return;
    if (!workPad.ctx) resizeWorkPad();
    if (!workPad.ctx) return;
    const rect = canvas.getBoundingClientRect();
    workPad.ctx.clearRect(0, 0, rect.width || canvas.width, rect.height || canvas.height);
  }

  function setupWorkPad() {
    const canvas = $("work-pad-canvas");
    if (!canvas || workPad.ready) return;
    workPad.ready = true;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const penWidth = (e) => {
      if (e.pointerType === "pen") {
        const pressure = Number.isFinite(e.pressure) && e.pressure > 0 ? e.pressure : 0.5;
        return 2.2 + pressure * 5.5;
      }
      return 4.5;
    };

    canvas.addEventListener(
      "pointerdown",
      (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        workPad.drawing = true;
        const p = pos(e);
        workPad.lastX = p.x;
        workPad.lastY = p.y;
        const ctx = workPad.ctx;
        if (!ctx) return;
        ctx.lineWidth = penWidth(e);
        ctx.beginPath();
        ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
      },
      { passive: false }
    );

    canvas.addEventListener(
      "pointermove",
      (e) => {
        if (!workPad.drawing) return;
        e.preventDefault();
        const p = pos(e);
        const ctx = workPad.ctx;
        if (!ctx) return;
        ctx.lineWidth = penWidth(e);
        ctx.beginPath();
        ctx.moveTo(workPad.lastX, workPad.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        workPad.lastX = p.x;
        workPad.lastY = p.y;
      },
      { passive: false }
    );

    const endDraw = (e) => {
      if (!workPad.drawing) return;
      workPad.drawing = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    };
    canvas.addEventListener("pointerup", endDraw);
    canvas.addEventListener("pointercancel", endDraw);
    canvas.addEventListener("lostpointercapture", () => {
      workPad.drawing = false;
    });

    $("btn-clear-pad")?.addEventListener("click", () => clearWorkPad());
    window.addEventListener("resize", () => {
      if ($("work-pad") && !$("work-pad").hidden) resizeWorkPad();
    });
  }

  function setWorkPadVisible(visible) {
    const pad = $("work-pad");
    if (!pad) return;
    pad.hidden = !visible;
    pad.style.display = visible ? "" : "none";
    document.body.classList.toggle("md-work-mode", !!visible);
    if (!visible) {
      document.body.classList.remove("ld-work-mode");
    }
    if (visible) {
      setupWorkPad();
      requestAnimationFrame(() => {
        resizeWorkPad();
        clearWorkPad();
      });
    } else {
      workPad.drawing = false;
    }
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
        mode: "10",
        shuffle: true,
        voiceMode: false,
        perQuestionTimer: false,
        tables: rangeTables(5),
        problemType: "product",
        roundPlace: "mix",
        roundDigits: "3",
        mdBigMin: 10,
        mdBigMax: 99,
        mdSmallMin: 2,
        mdSmallMax: 9,
        ldDivMin: 10,
        ldDivMax: 99,
        ldByMin: 2,
        ldByMax: 9,
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

  function robloxFloorCleared() {
    try {
      return localStorage.getItem(ROBLOX_FLOOR_FLAG) === "cleared";
    } catch {
      return false;
    }
  }

  function parseRobloxBankRaw(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return {
        points: Number(parsed.points) || 0,
        highWater: Number(parsed.highWater) || 0,
        log: Array.isArray(parsed.log) ? parsed.log : [],
        lastAwardDay: typeof parsed.lastAwardDay === "string" ? parsed.lastAwardDay : "",
      };
    } catch {
      return null;
    }
  }

  function readRobloxBankStore() {
    try {
      const primary = parseRobloxBankRaw(localStorage.getItem(ROBLOX_BANK_KEY));
      const backup = parseRobloxBankRaw(localStorage.getItem(ROBLOX_BANK_BACKUP_KEY));
      if (!primary && !backup) return null;
      if (!primary) return backup;
      if (!backup) return primary;
      const points = Math.max(primary.points, backup.points);
      const highWater = Math.max(primary.highWater, backup.highWater, points);
      const log = primary.log?.length ? primary.log : backup.log || [];
      const lastAwardDay = primary.lastAwardDay || backup.lastAwardDay || "";
      return { points, highWater, log, lastAwardDay };
    } catch {
      return null;
    }
  }

  function writeRobloxBankStore() {
    const prev = readRobloxBankStore();
    const points = getRobloxPoints();
    const highWater = Math.max(
      points,
      prev?.highWater || 0,
      robloxFloorCleared() ? 0 : ROBLOX_FLOOR_POINTS
    );
    const payload = JSON.stringify({
      points,
      highWater,
      log: Array.isArray(state.robloxLog) ? state.robloxLog : [],
      lastAwardDay: state.robloxLastAwardDay || "",
      updatedAt: Date.now(),
    });
    try {
      localStorage.setItem(ROBLOX_BANK_KEY, payload);
      localStorage.setItem(ROBLOX_BANK_BACKUP_KEY, payload);
    } catch {
      /* ignore quota / private mode */
    }
  }

  /** Keep the highest known bank across main state + both dedicated stores + floor */
  function mergeRobloxFromStores(target) {
    const bank = readRobloxBankStore();
    const fromState = Number(target.robloxPoints) || 0;
    const fromBank = bank ? Number(bank.points) || 0 : 0;
    const highWater = bank ? Number(bank.highWater) || 0 : 0;
    const floor = robloxFloorCleared() ? 0 : ROBLOX_FLOOR_POINTS;
    const best = Math.max(fromState, fromBank, highWater, floor);
    target.robloxPoints = best;
    if (!Array.isArray(target.robloxLog) || !target.robloxLog.length) {
      target.robloxLog = bank?.log?.length ? bank.log : target.robloxLog || [];
    }
    if (!target.robloxLastAwardDay && bank?.lastAwardDay) {
      target.robloxLastAwardDay = bank.lastAwardDay;
    }
    return target;
  }

  /** On every load: restore max(saved, high-water, floor) unless parent cleared */
  function ensureRobloxFloor() {
    try {
      if (robloxFloorCleared()) return;
      mergeRobloxFromStores(state);
      // Carry over any higher saved bank; bump up to the current floor if below
      state.robloxPoints = Math.max(getRobloxPoints(), ROBLOX_FLOOR_POINTS);
      localStorage.setItem(ROBLOX_FLOOR_FLAG, "1");
      writeRobloxBankStore();
      saveState();
      renderRobloxBank();
    } catch {
      /* ignore */
    }
  }

  function renderRobloxBank() {
    const pts = getRobloxPoints();
    document.querySelectorAll("[data-roblox-points]").forEach((el) => {
      el.textContent = String(pts);
    });
  }

  /** Award whenever score meets pass % (no daily limit) */
  function maybeAwardRobloxPoints(pct, right, total, meta = {}) {
    if (pct < ROBLOX_PASS_PCT) {
      return { awarded: false, reason: `Need ${ROBLOX_PASS_PCT}% or higher for Roblox points.` };
    }
    const day = todayKey();
    state.robloxPoints = getRobloxPoints() + ROBLOX_REWARD_POINTS;
    state.robloxLastAwardDay = day;
    if (!Array.isArray(state.robloxLog)) state.robloxLog = [];
    state.robloxLog.unshift({
      day,
      points: ROBLOX_REWARD_POINTS,
      pct,
      right,
      total,
      week: meta.week ?? SS_WEEK.week,
      title: meta.title || SS_WEEK.title,
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
    const current = getRobloxPoints();
    const ok = confirm(
      `Are you sure?\n\nThis will reset Roblox points to 0.\n(Currently ${current} points)\n\nTap OK to reset, or Cancel to keep them.`
    );
    if (!ok) return;
    state.robloxPoints = 0;
    state.robloxLog = [];
    state.robloxLastAwardDay = "";
    try {
      localStorage.setItem(ROBLOX_FLOOR_FLAG, "cleared");
      const cleared = JSON.stringify({
        points: 0,
        highWater: 0,
        log: [],
        lastAwardDay: "",
        updatedAt: Date.now(),
      });
      localStorage.setItem(ROBLOX_BANK_KEY, cleared);
      localStorage.setItem(ROBLOX_BANK_BACKUP_KEY, cleared);
    } catch {
      /* ignore */
    }
    saveState();
    renderRobloxBank();
    if ($("screen-parent")?.classList.contains("active")) renderParent();
  }

  function normalizeGradeId(gradeId) {
    // Pre-K combined into Kindergarten
    if (gradeId === "prek") return "k";
    return gradeId;
  }

  function getGradeId() {
    const fromUi = normalizeGradeId($("grade")?.value);
    if (fromUi && GRADE_PROFILES[fromUi]) return fromUi;
    const saved = normalizeGradeId(state.settings.grade);
    if (saved && GRADE_PROFILES[saved]) return saved;
    return "2";
  }

  function getGradeProfile(gradeId = getGradeId()) {
    return GRADE_PROFILES[gradeId] || GRADE_PROFILES["2"];
  }

  function syncGradeUI(gradeId = getGradeId(), { applyDefaults = false } = {}) {
    gradeId = normalizeGradeId(gradeId);
    const profile = getGradeProfile(gradeId);
    state.settings.grade = gradeId;
    if ($("grade")) {
      // Pre-K option removed — always store/select Kindergarten
      $("grade").value = gradeId === "prek" ? "k" : gradeId;
    }

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
      // Defaults: Easy · not in order · no auto-listen
      state.settings.difficulty = profile.difficulty || "easy";
      state.settings.shuffle = true;
      state.settings.voiceMode = false;
      if ($("in-order")) $("in-order").checked = false;
      if ($("voice-mode")) $("voice-mode").checked = false;
      const max = DIFFICULTY[profile.difficulty] || 10;
      state.settings.tables = rangeTables(max);
    }

    renderTableChips();
    syncSubjectOptions(gradeId);
    syncOperationUI();
    syncEngHubCards();
  }

  function syncSubjectOptions(gradeId = getGradeId()) {
    const profile = getGradeProfile(gradeId);
    const allowed = profile.subjects || ["math", "english", "social"];
    const select = $("subject");
    if (!select) return;
    const previous = select.value || "math";
    select.innerHTML = "";
    for (const id of allowed) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = SUBJECT_LABELS[id] || id;
      select.appendChild(opt);
    }
    const next = allowed.includes(previous) ? previous : "math";
    select.value = next;
    syncSubjectUI();
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
      if (merged.settings.grade === "prek") {
        merged.settings.grade = "k";
      }
      if (!GRADE_PROFILES[merged.settings.grade]) {
        merged.settings.grade = "2";
      }
      const gradeSkills = GRADE_PROFILES[merged.settings.grade].skills;
      if (!gradeSkills.includes(merged.settings.operation)) {
        merged.settings.operation = GRADE_PROFILES[merged.settings.grade].defaultOp;
      }
      // Standard skills default to a fixed 10-question round (not endless)
      if (
        isRobloxSkill(merged.settings.operation) &&
        !locksFixedTenMission(merged.settings.operation) &&
        (merged.settings.mode === "endless" || !merged.settings.mode)
      ) {
        merged.settings.mode = "10";
      }
      if (typeof merged.robloxPoints !== "number") merged.robloxPoints = 0;
      if (!Array.isArray(merged.robloxLog)) merged.robloxLog = [];
      if (typeof merged.robloxLastAwardDay !== "string") merged.robloxLastAwardDay = "";
      if (typeof merged.settings.mdBigMin !== "number") merged.settings.mdBigMin = 10;
      if (typeof merged.settings.mdBigMax !== "number") merged.settings.mdBigMax = 99;
      if (typeof merged.settings.mdSmallMin !== "number") merged.settings.mdSmallMin = 2;
      if (typeof merged.settings.mdSmallMax !== "number") merged.settings.mdSmallMax = 9;
      if (typeof merged.settings.ldDivMin !== "number") merged.settings.ldDivMin = 10;
      if (typeof merged.settings.ldDivMax !== "number") merged.settings.ldDivMax = 99;
      if (typeof merged.settings.ldByMin !== "number") merged.settings.ldByMin = 2;
      if (typeof merged.settings.ldByMax !== "number") merged.settings.ldByMax = 9;
      // One-time: Easy · shuffled · no auto-listen
      if (!merged.settings._defaults121) {
        merged.settings.difficulty = "easy";
        merged.settings.shuffle = true;
        merged.settings.voiceMode = false;
        merged.settings._defaults121 = true;
      }
      mergeRobloxFromStores(merged);
      return merged;
    } catch {
      const fresh = defaultState();
      mergeRobloxFromStores(fresh);
      return fresh;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    writeRobloxBankStore();
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
    if (operation === "divide") {
      return `÷:${a}/${b}`;
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

  function retryGap(min = RETRY_GAP_MIN, max = RETRY_GAP_MAX) {
    if (max <= min) return min;
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  /** Snapshot of current math problem for later re-ask */
  function snapshotMathProblem(problem = session?.current) {
    if (!problem) return null;
    return {
      a: Number(problem.a),
      b: Number(problem.b),
      key: problem.key,
      dividend: problem.dividend,
      divisor: problem.divisor,
      expected: problem.expected,
      remainder: problem.remainder,
    };
  }

  function scheduleMathRetry(delay, problem = session?.current) {
    if (!session || !problem?.key) return;
    session.retrySoon = session.retrySoon || [];
    // asked is still the current question #; delay 1 = next question
    const dueAt = (session.asked || 0) + Math.max(1, delay) - 1;
    const existing = session.retrySoon.find((r) => r.key === problem.key);
    if (existing) {
      existing.dueAt = Math.min(existing.dueAt, dueAt);
      existing.needs = Math.min(8, (existing.needs || 1) + 1);
      return;
    }
    session.retrySoon.push({
      ...snapshotMathProblem(problem),
      dueAt,
      needs: 1,
    });
  }

  function clearMathRetry(key) {
    if (!session?.retrySoon?.length || !key) return;
    session.retrySoon = session.retrySoon.filter((r) => r.key !== key);
  }

  /** Pull a missed problem that is due to show again */
  function takeDueMathRetry() {
    if (!session?.retrySoon?.length) return null;
    const due = session.retrySoon
      .filter((r) => r.dueAt <= session.asked)
      .sort((a, b) => a.dueAt - b.dueAt || (b.needs || 0) - (a.needs || 0));
    if (!due.length) return null;
    const pick = due[0];
    session.retrySoon = session.retrySoon.filter((r) => r !== pick);
    return pick;
  }

  /** Re-insert a missed English/SS item a couple questions later */
  function insertRetrySoon(list, index, item, gapMin = 1, gapMax = 2) {
    if (!Array.isArray(list) || !item) return;
    const gap = retryGap(gapMin, gapMax);
    const at = Math.min(list.length, Math.max(index + 1, index + gap));
    const clone = typeof structuredClone === "function" ? structuredClone(item) : JSON.parse(JSON.stringify(item));
    clone._retry = true;
    list.splice(at, 0, clone);
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
    // Pre-K has no Social Studies
    const ssScreens = ["social", "ss-hub", "ss-learn", "ss-quiz", "ss-results"];
    if (ssScreens.includes(name) && !gradeAllowsSocial()) {
      name = "home";
    }
    document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
    $(`screen-${name}`).classList.add("active");
    const homeBtn = $("btn-global-home");
    // Keep Home visible under the version badge on every screen
    if (homeBtn) homeBtn.hidden = false;
    if (name === "home") {
      // Leave nested practice sessions when returning to the dashboard
      ssSession = null;
      engSession = null;
      arSession = null;
      renderHome();
    }
    if (name === "map") renderMap();
    if (name === "badges") renderBadges();
    if (name === "parent") renderParent();
    if (name === "social" || name === "english" || name === "arabic" || name === "ss-hub") {
      renderRobloxBank();
      if (name === "ss-hub") renderSsHub();
      if (name === "english") syncEngHubCards();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Compact play layout for landscape / keyboard after screen switch
    if (typeof syncPlayViewportFit === "function") syncPlayViewportFit();
  }

  function openSsWeek(weekId) {
    const id = Number(weekId);
    if (!SS_CATALOG[id]) return;
    ssWeekId = id;
    showScreen("ss-hub");
  }

  function renderSsHub() {
    const week = getSsWeek();
    if ($("ss-hub-eyebrow")) $("ss-hub-eyebrow").textContent = week.eyebrow || `Week ${week.week}`;
    if ($("ss-hub-title")) $("ss-hub-title").textContent = week.title || `Week ${week.week}`;
    if ($("ss-hub-tagline")) $("ss-hub-tagline").textContent = week.tagline || week.guiding || "";
    const study = $("ss-study");
    if (study) {
      study.innerHTML = (week.study || [])
        .map(
          (card) => `
        <article class="ss-card">
          <h3>${card.title}</h3>
          <ul>
            ${(card.items || []).map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>`
        )
        .join("");
    }
    renderRobloxBank();
  }

  function setSsDifficulty(diff) {
    const next = SS_DIFFICULTIES.includes(diff) ? diff : "medium";
    ssQuizDifficulty = next;
    document.querySelectorAll("[data-ss-diff]").forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-ss-diff") === next);
    });
  }

  // ---------------------------------------------------------------------------
  // English · Pre-K alphabet + easy words
  // ---------------------------------------------------------------------------
  const ENG_TARGET = 10;
  const ENG_MAX_TRIES = 2;
  const ENG_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const ENG_LETTER_WORDS = [
    { letter: "A", word: "Apple", emoji: "🍎" },
    { letter: "B", word: "Ball", emoji: "⚽" },
    { letter: "C", word: "Cat", emoji: "🐱" },
    { letter: "D", word: "Dog", emoji: "🐶" },
    { letter: "E", word: "Egg", emoji: "🥚" },
    { letter: "F", word: "Fish", emoji: "🐟" },
    { letter: "G", word: "Goat", emoji: "🐐" },
    { letter: "H", word: "Hat", emoji: "🎩" },
    { letter: "I", word: "Ice", emoji: "🧊" },
    { letter: "J", word: "Jam", emoji: "🍓" },
    { letter: "K", word: "Kite", emoji: "🪁" },
    { letter: "L", word: "Leaf", emoji: "🍃" },
    { letter: "M", word: "Moon", emoji: "🌙" },
    { letter: "N", word: "Nest", emoji: "🪺" },
    { letter: "O", word: "Owl", emoji: "🦉" },
    { letter: "P", word: "Pig", emoji: "🐷" },
    { letter: "Q", word: "Queen", emoji: "👑" },
    { letter: "R", word: "Rain", emoji: "🌧️" },
    { letter: "S", word: "Sun", emoji: "☀️" },
    { letter: "T", word: "Tree", emoji: "🌳" },
    { letter: "U", word: "Umbrella", emoji: "☂️" },
    { letter: "V", word: "Van", emoji: "🚐" },
    { letter: "W", word: "Whale", emoji: "🐋" },
    { letter: "X", word: "Box", emoji: "📦" },
    { letter: "Y", word: "Yo-yo", emoji: "🪀" },
    { letter: "Z", word: "Zebra", emoji: "🦓" },
  ];
  const ENG_EASY_WORDS = [
    { word: "cat", emoji: "🐱" },
    { word: "dog", emoji: "🐶" },
    { word: "sun", emoji: "☀️" },
    { word: "moon", emoji: "🌙" },
    { word: "bee", emoji: "🐝" },
    { word: "bug", emoji: "🐛" },
    { word: "hat", emoji: "🎩" },
    { word: "cup", emoji: "☕" },
    { word: "bus", emoji: "🚌" },
    { word: "car", emoji: "🚗" },
    { word: "red", emoji: "🔴" },
    { word: "blue", emoji: "🔵" },
    { word: "pig", emoji: "🐷" },
    { word: "cow", emoji: "🐄" },
    { word: "fox", emoji: "🦊" },
    { word: "hen", emoji: "🐔" },
    { word: "map", emoji: "🗺️" },
    { word: "pen", emoji: "🖊️" },
    { word: "book", emoji: "📖" },
    { word: "star", emoji: "⭐" },
    { word: "fish", emoji: "🐟" },
    { word: "bird", emoji: "🐦" },
    { word: "tree", emoji: "🌳" },
    { word: "ball", emoji: "⚽" },
  ];

  /** Pre-K spelling — see C A T, tap letters in order */
  const ENG_PREK_SPELL_WORDS = [
    { word: "cat", emoji: "🐱", letters: ["C", "A", "T"] },
    { word: "dog", emoji: "🐶", letters: ["D", "O", "G"] },
    { word: "sun", emoji: "☀️", letters: ["S", "U", "N"] },
    { word: "hat", emoji: "🎩", letters: ["H", "A", "T"] },
    { word: "pig", emoji: "🐷", letters: ["P", "I", "G"] },
    { word: "bus", emoji: "🚌", letters: ["B", "U", "S"] },
    { word: "cup", emoji: "☕", letters: ["C", "U", "P"] },
    { word: "bee", emoji: "🐝", letters: ["B", "E", "E"] },
    { word: "mom", emoji: "👩", letters: ["M", "O", "M"] },
    { word: "dad", emoji: "👨", letters: ["D", "A", "D"] },
    { word: "red", emoji: "🔴", letters: ["R", "E", "D"] },
    { word: "map", emoji: "🗺️", letters: ["M", "A", "P"] },
  ];

  /** Kindergarten CVC spelling — emoji + sounds, no printed word */
  const ENG_SPELL_WORDS = [
    { word: "cat", emoji: "🐱", sounds: ["c", "a", "t"] },
    { word: "dog", emoji: "🐶", sounds: ["d", "o", "g"] },
    { word: "sun", emoji: "☀️", sounds: ["s", "u", "n"] },
    { word: "pig", emoji: "🐷", sounds: ["p", "i", "g"] },
    { word: "hat", emoji: "🎩", sounds: ["h", "a", "t"] },
    { word: "cup", emoji: "☕", sounds: ["c", "u", "p"] },
    { word: "bus", emoji: "🚌", sounds: ["b", "u", "s"] },
    { word: "car", emoji: "🚗", sounds: ["c", "a", "r"] },
    { word: "bed", emoji: "🛏️", sounds: ["b", "e", "d"] },
    { word: "pen", emoji: "🖊️", sounds: ["p", "e", "n"] },
    { word: "fox", emoji: "🦊", sounds: ["f", "o", "x"] },
    { word: " hen", emoji: "🐔", sounds: ["h", "e", "n"] },
    { word: "map", emoji: "🗺️", sounds: ["m", "a", "p"] },
    { word: "jam", emoji: "🍓", sounds: ["j", "a", "m"] },
    { word: "box", emoji: "📦", sounds: ["b", "o", "x"] },
    { word: "web", emoji: "🕸️", sounds: ["w", "e", "b"] },
    { word: "bug", emoji: "🐛", sounds: ["b", "u", "g"] },
    { word: "mud", emoji: "🟤", sounds: ["m", "u", "d"] },
    { word: "net", emoji: "🥅", sounds: ["n", "e", "t"] },
    { word: "log", emoji: "🪵", sounds: ["l", "o", "g"] },
  ].map((item) => ({ ...item, word: item.word.trim() }));

  let engSession = null;
  let engLastMode = "alphabet";

  function engPickChoices(correct, pool, count = 4) {
    const others = pool.filter((x) => x !== correct);
    shuffleInPlace(others);
    const picks = [correct, ...others.slice(0, count - 1)];
    return shuffleInPlace(picks);
  }

  function buildAlphabetQuestions(n = ENG_TARGET) {
    const pool = shuffleInPlace([...ENG_LETTER_WORDS]);
    const out = [];
    for (let i = 0; i < n; i++) {
      const item = pool[i % pool.length];
      const kind = i % 2 === 0 ? "match" : "starts";
      out.push({
        kind,
        letter: item.letter,
        word: item.word,
        emoji: item.emoji,
        choices: engPickChoices(item.letter, ENG_ALPHABET, 4),
      });
    }
    return shuffleInPlace(out);
  }

  function buildWordQuestions(n = ENG_TARGET) {
    const pool = shuffleInPlace([...ENG_EASY_WORDS]);
    return pool.slice(0, Math.min(n, pool.length)).map((item) => {
      const letters = String(item.word || "")
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .split("");
      return {
        kind: "write",
        word: item.word,
        target: item.word,
        display: letters.join(" "),
        emoji: item.emoji,
        letters,
      };
    });
  }

  function buildPenQuestions(n = ENG_TARGET) {
    const letters = shuffleInPlace([...ENG_LETTER_WORDS]);
    const words = shuffleInPlace([...ENG_EASY_WORDS]);
    const out = [];
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) {
        const item = letters[Math.floor(i / 2) % letters.length];
        out.push({
          kind: "pen-letter",
          target: item.letter.toLowerCase(),
          display: item.letter,
          emoji: item.emoji,
          guide: item.letter,
        });
      } else {
        const item = words[Math.floor(i / 2) % words.length];
        out.push({
          kind: "pen-word",
          target: item.word,
          display: item.word,
          emoji: item.emoji,
          guide: item.word,
        });
      }
    }
    return shuffleInPlace(out);
  }

  function buildSpellQuestions(n = ENG_TARGET) {
    const pool = shuffleInPlace([...ENG_SPELL_WORDS]);
    return pool.slice(0, Math.min(n, pool.length)).map((item) => ({
      kind: "spell",
      target: item.word,
      display: item.word,
      emoji: item.emoji,
      sounds: item.sounds || item.word.split(""),
      guide: "",
    }));
  }

  function buildPrekSpellQuestions(n = ENG_TARGET) {
    const pool = shuffleInPlace([...ENG_PREK_SPELL_WORDS]);
    return pool.slice(0, Math.min(n, pool.length)).map((item) => {
      const letters = (item.letters || item.word.toUpperCase().split("")).map((L) =>
        String(L).toUpperCase()
      );
      return {
        kind: "prek-spell",
        target: item.word.toLowerCase(),
        display: letters.join(" "),
        emoji: item.emoji,
        letters,
        guide: letters.join(" "),
      };
    });
  }

  function syncEngHubCards() {
    const gradeId = getGradeId();
    const isKinder = gradeId === "k";
    const prekBtn = $("btn-eng-prek-spell");
    const spellBtn = $("btn-eng-spell");
    // Spell It (tap letters) lives under Kindergarten now
    if (prekBtn) {
      prekBtn.hidden = !isKinder;
      prekBtn.style.display = isKinder ? "" : "none";
    }
    if (spellBtn) {
      spellBtn.hidden = false;
      spellBtn.style.display = "";
    }
  }

  function getQuestionLetters(q) {
    if (Array.isArray(q?.letters) && q.letters.length) {
      return q.letters.map((L) => String(L).toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean);
    }
    return String(q?.word || q?.target || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("");
  }

  function readSpellBuildFromSlots() {
    const slots = $("eng-spell-slots");
    if (!slots) return (engSession?.spellBuild || []).map((L) => String(L).toUpperCase());
    return [...slots.querySelectorAll(".eng-spell-slot")]
      .map((el) => String(el.textContent || "").trim().toUpperCase())
      .filter(Boolean);
  }

  function renderPrekSpellBoard(q) {
    const slots = $("eng-spell-slots");
    const tiles = $("eng-spell-tiles");
    const letters = getQuestionLetters(q);
    if (!slots || !tiles || !letters.length || !engSession) return;
    // Keep a normalized copy on the question so submit always matches
    q.letters = letters;
    engSession.spellBuild = [];
    engSession.spellTilePool = shuffleInPlace([...letters]);
    slots.innerHTML = letters
      .map((_, i) => `<button type="button" class="eng-spell-slot" data-slot="${i}" aria-label="Letter ${i + 1}"></button>`)
      .join("");
    tiles.innerHTML = engSession.spellTilePool
      .map(
        (letter, i) =>
          `<button type="button" class="eng-spell-tile" data-tile="${i}" data-letter="${letter}">${letter}</button>`
      )
      .join("");
    tiles.querySelectorAll(".eng-spell-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (
          !engSession ||
          engSession.answered ||
          (engSession.mode !== "prek-spell" && engSession.mode !== "words")
        ) {
          return;
        }
        if (btn.disabled) return;
        const letter = String(btn.getAttribute("data-letter") || "").toUpperCase();
        if (engSession.spellBuild.length >= letters.length) return;
        engSession.spellBuild.push(letter);
        btn.disabled = true;
        btn.classList.add("used");
        refreshPrekSpellSlots();
        // Auto-check as soon as all letters are in
        if (engSession.spellBuild.length >= letters.length) {
          window.setTimeout(() => submitPrekSpell(), 80);
        }
      });
    });
    slots.querySelectorAll(".eng-spell-slot").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (
          !engSession ||
          engSession.answered ||
          (engSession.mode !== "prek-spell" && engSession.mode !== "words")
        ) {
          return;
        }
        // Pop last letter if tapping filled slots
        if (!engSession.spellBuild.length) return;
        const removed = engSession.spellBuild.pop();
        refreshPrekSpellSlots();
        const tile = [...$("eng-spell-tiles").querySelectorAll(".eng-spell-tile")].find(
          (t) => t.disabled && String(t.getAttribute("data-letter") || "").toUpperCase() === removed
        );
        if (tile) {
          tile.disabled = false;
          tile.classList.remove("used");
        }
      });
    });
    refreshPrekSpellSlots();
  }

  function refreshPrekSpellSlots() {
    const slots = $("eng-spell-slots");
    if (!slots || !engSession) return;
    const built = engSession.spellBuild || [];
    slots.querySelectorAll(".eng-spell-slot").forEach((el, i) => {
      const letter = built[i] || "";
      el.textContent = letter;
      el.classList.toggle("filled", !!letter);
    });
  }

  function clearPrekSpellBoard() {
    const q = engCurrent();
    if (!q || (engSession?.mode !== "prek-spell" && engSession?.mode !== "words")) return;
    renderPrekSpellBoard(q);
  }

  async function submitPrekSpell() {
    if (
      !engSession ||
      engSession.answered ||
      (engSession.mode !== "prek-spell" && engSession.mode !== "words")
    ) {
      return;
    }
    const q = engCurrent();
    if (!q) return;
    const letters = getQuestionLetters(q);
    q.letters = letters;
    const builtArr = readSpellBuildFromSlots();
    // Keep spellBuild in sync with what is on screen
    engSession.spellBuild = builtArr;
    const built = builtArr.join("");
    const target = letters.join("");
    const feedback = $("eng-feedback");
    const nextBtn = $("btn-eng-next");
    const pretty =
      letters.join(" ") ||
      q.display ||
      String(q.word || q.target || "").toUpperCase();

    if (!target) {
      if (feedback) {
        feedback.textContent = "Missing word — go back and try again.";
        feedback.className = "feedback wrong";
      }
      return;
    }

    if (!built || built.length < target.length) {
      if (feedback) {
        feedback.textContent = `Tap the letters for ${pretty}!`;
        feedback.className = "feedback";
      }
      return;
    }

    engSession.attemptsOnCurrent += 1;
    const ok = built === target;

    if (ok) {
      engSession.answered = true;
      if (engSession.attemptsOnCurrent === 1) engSession.firstTryCorrect += 1;
      else noteEngNeedsRetry();
      engSession.correct += 1;
      if ($("eng-stars")) $("eng-stars").textContent = String(engSession.correct);
      $("eng-spell-tiles")
        ?.querySelectorAll(".eng-spell-tile")
        .forEach((btn) => {
          btn.disabled = true;
        });
      if (feedback) {
        feedback.textContent =
          engSession.attemptsOnCurrent === 1 ? `Yes! ${pretty} ★` : "Got it!";
        feedback.className = "feedback right";
      }
      await playCorrectSound();
      window.setTimeout(() => advanceEngQuestion(), 700);
      return;
    }

    if (engSession.attemptsOnCurrent >= ENG_MAX_TRIES) {
      engSession.answered = true;
      noteEngNeedsRetry();
      if (feedback) {
        feedback.textContent = `It's ${pretty}!`;
        feedback.className = "feedback wrong";
      }
      if (nextBtn) nextBtn.hidden = false;
      await playWrongSound();
      return;
    }

    if (feedback) {
      feedback.textContent = "Almost — clear and try again!";
      feedback.className = "feedback wrong";
    }
    clearPrekSpellBoard();
    await playWrongSound();
  }

  function speakEngWord(word) {
    try {
      if (!window.speechSynthesis || !word) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(word));
      u.rate = 0.9;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }

  const engWritePad = {
    ready: false,
    drawing: false,
    lastX: 0,
    lastY: 0,
    ctx: null,
    strokeCount: 0,
    inkDistance: 0,
  };

  function engWritePadHasInk() {
    // Enough finger/Pencil ink on the practice pad to count as a real drawing
    return engWritePad.strokeCount >= 1 && engWritePad.inkDistance >= 28;
  }

  function resizeEngWritePad() {
    const canvas = $("eng-write-canvas");
    const wrap = canvas?.parentElement;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1a1f36";
    ctx.fillStyle = "#1a1f36";
    ctx.lineWidth = 5;
    engWritePad.ctx = ctx;
  }

  function clearEngWritePad() {
    const canvas = $("eng-write-canvas");
    if (!canvas) return;
    if (!engWritePad.ctx) resizeEngWritePad();
    if (!engWritePad.ctx) return;
    const rect = canvas.getBoundingClientRect();
    engWritePad.ctx.clearRect(0, 0, rect.width || canvas.width, rect.height || canvas.height);
    engWritePad.strokeCount = 0;
    engWritePad.inkDistance = 0;
  }

  function setupEngWritePad() {
    const canvas = $("eng-write-canvas");
    if (!canvas || engWritePad.ready) return;
    engWritePad.ready = true;

    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const penWidth = (e) => {
      if (e.pointerType === "pen") {
        const pressure = Number.isFinite(e.pressure) && e.pressure > 0 ? e.pressure : 0.5;
        return 2.4 + pressure * 6;
      }
      return 5;
    };

    canvas.addEventListener(
      "pointerdown",
      (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);
        engWritePad.drawing = true;
        engWritePad.strokeCount += 1;
        const p = pos(e);
        engWritePad.lastX = p.x;
        engWritePad.lastY = p.y;
        const ctx = engWritePad.ctx;
        if (!ctx) return;
        ctx.lineWidth = penWidth(e);
        ctx.beginPath();
        ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        engWritePad.inkDistance += 2;
      },
      { passive: false }
    );

    canvas.addEventListener(
      "pointermove",
      (e) => {
        if (!engWritePad.drawing) return;
        e.preventDefault();
        const p = pos(e);
        const ctx = engWritePad.ctx;
        if (!ctx) return;
        const dx = p.x - engWritePad.lastX;
        const dy = p.y - engWritePad.lastY;
        engWritePad.inkDistance += Math.hypot(dx, dy);
        ctx.lineWidth = penWidth(e);
        ctx.beginPath();
        ctx.moveTo(engWritePad.lastX, engWritePad.lastY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        engWritePad.lastX = p.x;
        engWritePad.lastY = p.y;
      },
      { passive: false }
    );

    const endDraw = (e) => {
      if (!engWritePad.drawing) return;
      engWritePad.drawing = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
    };
    canvas.addEventListener("pointerup", endDraw);
    canvas.addEventListener("pointercancel", endDraw);
    canvas.addEventListener("lostpointercapture", () => {
      engWritePad.drawing = false;
    });

    window.addEventListener("resize", () => {
      if (
        (engSession?.mode === "pen" ||
          engSession?.mode === "spell" ||
          engSession?.mode === "words") &&
        $("eng-pen-form") &&
        !$("eng-pen-form").hidden
      ) {
        resizeEngWritePad();
      }
    });
  }

  function prepareEngPenPad(guideText) {
    setupEngWritePad();
    const guide = $("eng-trace-guide");
    if (guide) {
      guide.textContent = guideText || "";
      guide.classList.toggle("eng-trace-word", String(guideText || "").length > 1);
    }
    requestAnimationFrame(() => {
      resizeEngWritePad();
      clearEngWritePad();
    });
  }

  function syncEngWordKeyboard() {
    const input = $("eng-word-input");
    if (!input) return;
    // Easy Words / typing: letter keyboard
    input.setAttribute("inputmode", "text");
    input.setAttribute("enterkeyhint", "done");
    input.removeAttribute("pattern");
    input.setAttribute("autocapitalize", "off");
  }

  function setEngWordsPadOnly(on) {
    document.body.classList.toggle("eng-words-pad", !!on);
    const hint = document.querySelector("#eng-pen-form .answer-pen-hint");
    const input = $("eng-pen-input");
    const clearBox = $("btn-eng-pen-clear");
    const keyboard = $("btn-eng-pen-keyboard");
    const tools = document.querySelector("#eng-pen-form .eng-pen-tools");
    const label = document.querySelector("#eng-pen-form label[for='eng-pen-input']");
    if (hint) {
      hint.hidden = !!on;
      hint.style.display = on ? "none" : "";
      if (!on) hint.textContent = "Finger or Pencil on the pad · then POW!";
    }
    if (input) {
      input.hidden = !!on;
      input.style.display = on ? "none" : "";
    }
    if (label) {
      label.hidden = !!on;
      label.style.display = on ? "none" : "";
    }
    if (clearBox) {
      clearBox.hidden = !!on;
      clearBox.style.display = on ? "none" : "";
    }
    if (keyboard) {
      keyboard.hidden = !!on;
      keyboard.style.display = on ? "none" : "";
    }
    if (tools) {
      tools.hidden = false;
      tools.style.display = "";
    }
    const padLabel = document.querySelector("#eng-write-pad .work-pad-label");
    if (padLabel) {
      padLabel.textContent = on
        ? "Write with your finger"
        : "Practice pad · finger or Pencil";
    }
  }

  function setEngPenKeyboard(wantKeyboard) {
    const input = $("eng-pen-input");
    const btn = $("btn-eng-pen-keyboard");
    if (!input) return;
    const q = engCurrent();
    const letterMode =
      engSession?.mode === "pen" && (q?.kind === "pen-letter" || String(q?.target || "").length === 1);
    if (wantKeyboard) {
      // Letters for English — never the number pad
      input.setAttribute("inputmode", "text");
      input.removeAttribute("pattern");
      input.setAttribute("enterkeyhint", "done");
      input.setAttribute("autocapitalize", letterMode ? "characters" : "off");
      input.placeholder = letterMode ? "Type the letter" : "Type the word";
    } else {
      input.setAttribute("inputmode", "none");
      input.removeAttribute("pattern");
      input.placeholder = "Write with Pencil";
    }
    if (btn) btn.classList.toggle("keyboard-on", !!wantKeyboard);
    if (wantKeyboard) {
      try {
        input.blur();
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        input.focus({ preventScroll: true });
        input.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 50);
    } else {
      try {
        input.blur();
      } catch {
        /* ignore */
      }
    }
  }

  function startEngPractice(mode) {
    engLastMode = mode;
    const questions =
      mode === "words"
        ? buildWordQuestions(ENG_TARGET)
        : mode === "pen"
          ? buildPenQuestions(ENG_TARGET)
          : mode === "spell"
            ? buildSpellQuestions(ENG_TARGET)
            : mode === "prek-spell"
              ? buildPrekSpellQuestions(ENG_TARGET)
              : buildAlphabetQuestions(ENG_TARGET);
    engSession = {
      mode,
      questions,
      index: 0,
      correct: 0,
      firstTryCorrect: 0,
      attemptsOnCurrent: 0,
      answered: false,
    };
    showScreen("eng-play");
    renderEngQuestion();
  }

  function engCurrent() {
    return engSession?.questions?.[engSession.index] || null;
  }

  function renderEngQuestion() {
    if (!engSession) return;
    const q = engCurrent();
    if (!q) return;

    engSession.answered = false;
    engSession.attemptsOnCurrent = 0;

    const progress = $("eng-progress");
    const stars = $("eng-stars");
    const tag = $("eng-mode-tag");
    const prompt = $("eng-prompt");
    const hint = $("eng-hint");
    const choices = $("eng-choices");
    const wordForm = $("eng-word-form");
    const penForm = $("eng-pen-form");
    const feedback = $("eng-feedback");
    const nextBtn = $("btn-eng-next");
    const wordInput = $("eng-word-input");
    const penInput = $("eng-pen-input");
    const soundBoxes = $("eng-sound-boxes");
    const hearBtn = $("btn-eng-hear");

    if (progress) progress.textContent = `${engSession.index + 1} / ${engSession.questions.length}`;
    if (stars) stars.textContent = String(engSession.correct);
    if (feedback) {
      feedback.textContent = "";
      feedback.className = "feedback";
    }
    if (nextBtn) nextBtn.hidden = true;
    if (soundBoxes) {
      soundBoxes.hidden = true;
      soundBoxes.innerHTML = "";
      soundBoxes.classList.remove("eng-sound-boxes-caps");
    }
    if (hearBtn) hearBtn.hidden = true;
    const prekSpell = $("eng-prek-spell");
    if (prekSpell) prekSpell.hidden = true;
    const easyForm = $("eng-easy-form");
    if (easyForm) easyForm.hidden = true;
    if (engSession.mode !== "words") setEngWordsPadOnly(false);

    if (engSession.mode === "prek-spell") {
      if (tag) tag.textContent = "Spell It";
      if (choices) {
        choices.hidden = true;
        choices.innerHTML = "";
      }
      if (wordForm) wordForm.hidden = true;
      if (penForm) penForm.hidden = true;
      if (prekSpell) prekSpell.hidden = false;
      if (prompt) {
        prompt.className = "eng-prompt eng-prompt-word";
        prompt.innerHTML = `<span class="eng-emoji" aria-hidden="true">${q.emoji}</span>`;
      }
      if (soundBoxes) {
        soundBoxes.hidden = false;
        soundBoxes.classList.add("eng-sound-boxes-caps");
        soundBoxes.innerHTML = (q.letters || [])
          .map((L) => `<span class="eng-sound-box eng-sound-box-cap">${L}</span>`)
          .join('<span class="eng-sound-dot">·</span>');
      }
      if (hint) hint.textContent = `Spell ${q.display} · tap the letters in order!`;
      if (hearBtn) hearBtn.hidden = false;
      renderPrekSpellBoard(q);
      window.setTimeout(() => speakEngWord(q.target), 250);
      return;
    }

    if (engSession.mode === "words") {
      if (tag) tag.textContent = "Easy Words";
      if (prompt) {
        prompt.className = "eng-prompt eng-prompt-word";
        prompt.innerHTML = `<span class="eng-emoji" aria-hidden="true">${q.emoji}</span><span class="eng-copy-word">${q.word}</span>`;
      }
      if (hint) hint.textContent = "Write with Apple Pencil (Scribble) in the box!";
      if (choices) {
        choices.hidden = true;
        choices.innerHTML = "";
      }
      // iPad Scribble: Pencil writing becomes letters we can check
      if (wordForm) wordForm.hidden = true;
      if (penForm) penForm.hidden = true;
      if (prekSpell) prekSpell.hidden = true;
      if (easyForm) easyForm.hidden = false;
      if (hearBtn) hearBtn.hidden = false;
      setEngWordsPadOnly(false);
      const easyPadLabel = document.querySelector("#eng-easy-form .work-pad-label");
      if (easyPadLabel) easyPadLabel.textContent = "Apple Pencil · write in this box";
      const easyInput = $("eng-easy-input");
      if (easyInput) {
        easyInput.disabled = false;
        easyInput.value = "";
        easyInput.maxLength = 24;
        easyInput.placeholder = "Write here with Pencil";
        easyInput.setAttribute("inputmode", "text");
        easyInput.setAttribute("enterkeyhint", "done");
        easyInput.removeAttribute("readonly");
        updateEasySeen(true);
        window.setTimeout(() => {
          try {
            easyInput.focus({ preventScroll: true });
          } catch {
            easyInput.focus();
          }
          updateEasySeen(true);
        }, 180);
      }
      window.setTimeout(() => speakEngWord(q.word), 250);
      return;
    }

    if (engSession.mode === "spell") {
      if (tag) tag.textContent = "Spell the Word";
      setEngWordsPadOnly(false);
      if (choices) {
        choices.hidden = true;
        choices.innerHTML = "";
      }
      if (wordForm) wordForm.hidden = true;
      if (penForm) penForm.hidden = false;
      if (prompt) {
        prompt.className = "eng-prompt eng-prompt-word";
        prompt.innerHTML = `<span class="eng-emoji" aria-hidden="true">${q.emoji}</span>`;
      }
      if (soundBoxes) {
        soundBoxes.hidden = false;
        soundBoxes.innerHTML = (q.sounds || [])
          .map((s) => `<span class="eng-sound-box">${s}</span>`)
          .join('<span class="eng-sound-dot">·</span>');
      }
      if (hint) {
        hint.textContent = "Say the sounds, then type the word (Keyboard)!";
      }
      if (hearBtn) hearBtn.hidden = false;
      const spellHint = document.querySelector("#eng-pen-form .answer-pen-hint");
      if (spellHint) spellHint.textContent = "Tap Keyboard and type the word, then POW!";
      if (penInput) {
        penInput.disabled = false;
        penInput.value = "";
        penInput.placeholder = "Type the word";
      }
      // Finger-friendly: open keyboard for spelling (Scribble needs Apple Pencil)
      setEngPenKeyboard(true);
      prepareEngPenPad("");
      window.setTimeout(() => speakEngWord(q.target), 250);
      return;
    }

    if (engSession.mode === "pen") {
      if (tag) tag.textContent = "Write with Pen";
      setEngWordsPadOnly(false);
      if (choices) {
        choices.hidden = true;
        choices.innerHTML = "";
      }
      // iPad Scribble checks the letter/word — drawing alone no longer counts
      if (wordForm) wordForm.hidden = true;
      if (penForm) penForm.hidden = true;
      if (prekSpell) prekSpell.hidden = true;
      if (easyForm) easyForm.hidden = false;
      if (q.kind === "pen-letter") {
        if (prompt) {
          prompt.className = "eng-prompt";
          prompt.innerHTML = `<span class="eng-emoji" aria-hidden="true">${q.emoji}</span>${q.display}`;
        }
        if (hint) hint.textContent = `Write the letter ${q.display} with Apple Pencil!`;
      } else {
        if (prompt) {
          prompt.className = "eng-prompt eng-prompt-word";
          prompt.innerHTML = `<span class="eng-emoji" aria-hidden="true">${q.emoji}</span><span class="eng-copy-word">${q.display}</span>`;
        }
        if (hint) hint.textContent = "Write the word with Apple Pencil (Scribble)!";
      }
      const easyPadLabel = document.querySelector("#eng-easy-form .work-pad-label");
      if (easyPadLabel) {
        easyPadLabel.textContent =
          q.kind === "pen-letter"
            ? "Apple Pencil · write the letter"
            : "Apple Pencil · write the word";
      }
      const easyInput = $("eng-easy-input");
      if (easyInput) {
        easyInput.disabled = false;
        easyInput.value = "";
        easyInput.setAttribute("inputmode", "text");
        easyInput.setAttribute("enterkeyhint", "done");
        easyInput.removeAttribute("readonly");
        easyInput.placeholder =
          q.kind === "pen-letter" ? "Write the letter" : "Write the word";
        easyInput.maxLength = q.kind === "pen-letter" ? 4 : 24;
        updateEasySeen(true);
        window.setTimeout(() => {
          try {
            easyInput.focus({ preventScroll: true });
          } catch {
            easyInput.focus();
          }
          updateEasySeen(true);
        }, 180);
      }
      return;
    }

    if (tag) tag.textContent = "Alphabet";
    if (choices) choices.hidden = false;
    if (wordForm) wordForm.hidden = true;
    if (penForm) penForm.hidden = true;
    if (prompt) prompt.className = "eng-prompt";

    if (q.kind === "starts") {
      if (prompt) {
        prompt.innerHTML = `<span class="eng-emoji" aria-hidden="true">${q.emoji}</span>${q.word}`;
      }
      if (hint) hint.textContent = `${q.word} starts with which letter?`;
    } else {
      if (prompt) prompt.textContent = q.letter;
      if (hint) hint.textContent = "Tap the matching letter!";
    }

    if (choices) {
      choices.innerHTML = q.choices
        .map(
          (letter) =>
            `<button type="button" class="eng-choice" data-letter="${letter}">${letter}</button>`
        )
        .join("");
      choices.querySelectorAll(".eng-choice").forEach((btn) => {
        btn.addEventListener("click", () => submitEngLetter(btn.getAttribute("data-letter"), btn));
      });
    }
  }

  function lockEngChoices(correctLetter, pickedBtn) {
    const choices = $("eng-choices");
    if (!choices) return;
    choices.querySelectorAll(".eng-choice").forEach((btn) => {
      btn.disabled = true;
      const letter = btn.getAttribute("data-letter");
      if (letter === correctLetter) btn.classList.add("correct");
      if (btn === pickedBtn && letter !== correctLetter) btn.classList.add("wrong");
    });
  }

  async function submitEngLetter(letter, btn) {
    if (!engSession || engSession.answered || engSession.mode !== "alphabet") return;
    const q = engCurrent();
    if (!q) return;

    engSession.attemptsOnCurrent += 1;
    const feedback = $("eng-feedback");
    const nextBtn = $("btn-eng-next");
    const ok = letter === q.letter;

    if (ok) {
      engSession.answered = true;
      if (engSession.attemptsOnCurrent === 1) engSession.firstTryCorrect += 1;
      else noteEngNeedsRetry();
      engSession.correct += 1;
      if ($("eng-stars")) $("eng-stars").textContent = String(engSession.correct);
      lockEngChoices(q.letter, btn);
      if (feedback) {
        feedback.textContent = engSession.attemptsOnCurrent === 1 ? "Yes! ★" : "Got it!";
        feedback.className = "feedback right";
      }
      await playCorrectSound();
      window.setTimeout(() => advanceEngQuestion(), 650);
      return;
    }

    if (engSession.attemptsOnCurrent >= ENG_MAX_TRIES) {
      engSession.answered = true;
      noteEngNeedsRetry();
      lockEngChoices(q.letter, btn);
      if (feedback) {
        feedback.textContent = `It's ${q.letter}!`;
        feedback.className = "feedback wrong";
      }
      if (nextBtn) nextBtn.hidden = false;
      await playWrongSound();
      return;
    }

    if (btn) {
      btn.classList.add("wrong");
      btn.disabled = true;
    }
    if (feedback) {
      feedback.textContent = "Try again!";
      feedback.className = "feedback wrong";
    }
    await playWrongSound();
  }

  function normalizeEngWord(raw) {
    return String(raw || "")
      .trim()
      .toLowerCase()
      // Scribble / handwriting lookalikes
      .replace(/0/g, "o")
      .replace(/1/g, "l")
      .replace(/\|/g, "l")
      .replace(/5/g, "s")
      .replace(/\$/g, "s")
      .replace(/@/g, "a")
      .replace(/[^a-z]/g, "");
  }

  function readEasyInputRaw(input = $("eng-easy-input")) {
    if (!input) return "";
    return String(input.value || input.textContent || "");
  }

  let easySeenTimer = null;

  function updateEasySeen(immediate = false) {
    const seen = $("eng-easy-seen");
    if (!seen) return;
    const show = () => {
      const letters = normalizeEngWord(readEasyInputRaw());
      seen.textContent = letters ? `I see: ${letters}` : "I see: —";
    };
    if (easySeenTimer) {
      window.clearTimeout(easySeenTimer);
      easySeenTimer = null;
    }
    // Don't flash partial Scribble guesses while he's still writing
    if (immediate === true) {
      show();
      return;
    }
    seen.textContent = "Writing…";
    easySeenTimer = window.setTimeout(show, 2000);
  }

  async function waitForScribbleSettle(input, stableMs = 2500, maxMs = 7000) {
    // Give a few seconds after strokes stop so Scribble can finish the letter/word
    const seen = $("eng-easy-seen");
    if (easySeenTimer) {
      window.clearTimeout(easySeenTimer);
      easySeenTimer = null;
    }
    if (seen) seen.textContent = "Waiting for writing…";

    const started = Date.now();
    let last = readEasyInputRaw(input);
    let lastChange = Date.now();

    while (Date.now() - started < maxMs) {
      await new Promise((r) => window.setTimeout(r, 200));
      const now = readEasyInputRaw(input);
      if (now !== last) {
        last = now;
        lastChange = Date.now();
        if (seen) seen.textContent = "Still writing…";
      } else if (Date.now() - lastChange >= stableMs) {
        break;
      }
    }

    updateEasySeen(true);
    return normalizeEngWord(readEasyInputRaw(input));
  }

  async function submitEasyWord(event) {
    if (event) event.preventDefault();
    if (
      !engSession ||
      engSession.answered ||
      (engSession.mode !== "words" && engSession.mode !== "pen")
    ) {
      return;
    }
    const q = engCurrent();
    const input = $("eng-easy-input") || $("eng-word-input");
    if (!q || !input) return;

    const typed = await waitForScribbleSettle(input);
    const target = normalizeEngWord(q.word || q.target);
    const pretty = q.display || q.word || target;
    const feedback = $("eng-feedback");
    const nextBtn = $("btn-eng-next");

    if (!typed) {
      if (feedback) {
        feedback.textContent =
          "No letters yet — write with Apple Pencil in the box, wait until “I see” shows letters, then POW!";
        feedback.className = "feedback";
      }
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
      return;
    }

    engSession.attemptsOnCurrent += 1;
    const ok = typed === target;

    if (ok) {
      engSession.answered = true;
      if (engSession.attemptsOnCurrent === 1) engSession.firstTryCorrect += 1;
      else noteEngNeedsRetry();
      engSession.correct += 1;
      if ($("eng-stars")) $("eng-stars").textContent = String(engSession.correct);
      input.disabled = true;
      if (feedback) {
        feedback.textContent =
          engSession.attemptsOnCurrent === 1
            ? engSession.mode === "pen"
              ? "Nice pen writing! ★"
              : "Nice writing! ★"
            : "Got it!";
        feedback.className = "feedback right";
      }
      await playCorrectSound();
      window.setTimeout(() => advanceEngQuestion(), 700);
      return;
    }

    if (engSession.attemptsOnCurrent >= ENG_MAX_TRIES) {
      engSession.answered = true;
      noteEngNeedsRetry();
      input.disabled = true;
      input.value = pretty;
      updateEasySeen(true);
      if (feedback) {
        feedback.textContent = `It's “${pretty}” (I saw “${typed}”)`;
        feedback.className = "feedback wrong";
      }
      if (nextBtn) nextBtn.hidden = false;
      await playWrongSound();
      return;
    }

    if (feedback) {
      feedback.textContent = `Not quite — I saw “${typed}”. Clear and write “${pretty}” again!`;
      feedback.className = "feedback wrong";
    }
    input.value = "";
    updateEasySeen(true);
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
    await playWrongSound();
  }

  async function submitEngWord(event) {
    return submitEasyWord(event);
  }

  async function submitEngPen(event) {
    if (event) event.preventDefault();
    if (
      !engSession ||
      engSession.answered ||
      (engSession.mode !== "pen" &&
        engSession.mode !== "spell" &&
        engSession.mode !== "words")
    ) {
      return;
    }
    const q = engCurrent();
    const input = $("eng-pen-input");
    if (!q || !input) return;

    // Write with Pen / Easy Words: Scribble field checks the real letters
    if (engSession.mode === "words" || engSession.mode === "pen") {
      await submitEasyWord(event);
      return;
    }

    const typed = normalizeEngWord(input.value);
    const padInk = engWritePadHasInk();
    const targetWord = normalizeEngWord(q.target || q.word);

    if (!typed) {
      const emptyFeedback = $("eng-feedback");
      if (emptyFeedback) {
        emptyFeedback.textContent = padInk
          ? "Nice drawing! Now tap Keyboard and type the word"
          : "Type the word (tap Keyboard), then POW!";
        emptyFeedback.className = "feedback";
      }
      return;
    }

    engSession.attemptsOnCurrent += 1;
    const feedback = $("eng-feedback");
    const nextBtn = $("btn-eng-next");
    const ok = typed === targetWord;

    if (ok) {
      engSession.answered = true;
      if (engSession.attemptsOnCurrent === 1) engSession.firstTryCorrect += 1;
      else noteEngNeedsRetry();
      engSession.correct += 1;
      if ($("eng-stars")) $("eng-stars").textContent = String(engSession.correct);
      input.disabled = true;
      if (feedback) {
        feedback.textContent =
          engSession.attemptsOnCurrent === 1
            ? engSession.mode === "spell"
              ? "Great spelling! ★"
              : engSession.mode === "words"
                ? "Nice writing! ★"
                : "Beautiful writing! ★"
            : "Got it!";
        feedback.className = "feedback right";
      }
      await playCorrectSound();
      window.setTimeout(() => advanceEngQuestion(), 750);
      return;
    }

    if (engSession.attemptsOnCurrent >= ENG_MAX_TRIES) {
      engSession.answered = true;
      noteEngNeedsRetry();
      input.disabled = true;
      input.value = q.display || q.word || targetWord;
      if (feedback) {
        feedback.textContent =
          engSession.mode === "spell" || engSession.mode === "words"
            ? `It's “${q.display || q.word}”`
            : `Write “${q.display}”`;
        feedback.className = "feedback wrong";
      }
      if (nextBtn) nextBtn.hidden = false;
      await playWrongSound();
      return;
    }

    if (feedback) {
      feedback.textContent = "Almost — clear and try again!";
      feedback.className = "feedback wrong";
    }
    await playWrongSound();
  }

  function noteEngNeedsRetry() {
    if (!engSession) return;
    const q = engCurrent();
    if (!q) return;
    const marker = q._retryOf || q.target || q.letter || q.word || q.display || "";
    // Cap so a hard item doesn't explode the round length forever
    const already = engSession.questions.filter((item) => item._retryOf === marker).length;
    if (already >= 3) return;
    const clone =
      typeof structuredClone === "function" ? structuredClone(q) : JSON.parse(JSON.stringify(q));
    clone._retry = true;
    clone._retryOf = marker;
    const gap = retryGap(1, 2);
    const at = Math.min(engSession.questions.length, engSession.index + gap);
    engSession.questions.splice(at, 0, clone);
  }

  function advanceEngQuestion() {
    if (!engSession) return;
    if (engSession.index + 1 >= engSession.questions.length) {
      endEngPractice();
      return;
    }
    engSession.index += 1;
    renderEngQuestion();
  }

  function endEngPractice() {
    if (!engSession) return;
    const total = engSession.questions.length;
    const right = engSession.correct;
    const firstTry = engSession.firstTryCorrect;
    const pct = Math.round((firstTry / total) * 100);
    const title =
      engSession.mode === "words"
        ? "English · Easy Words"
        : engSession.mode === "pen"
          ? "English · Write with Pen"
          : engSession.mode === "spell"
            ? "English · Spell the Word"
            : engSession.mode === "prek-spell"
              ? "English · Spell It"
              : "English · Alphabet";
    const reward = maybeAwardRobloxPoints(pct, firstTry, total, {
      week: "EN",
      title,
    });

    const resultsTitle = $("eng-results-title");
    const resultsSub = $("eng-results-sub");
    const grid = $("eng-results-grid");
    const rewardBox = $("eng-reward-box");

    if (resultsTitle) {
      resultsTitle.textContent =
        pct >= ROBLOX_PASS_PCT ? "Word Hero!" : pct >= 70 ? "Great Practice!" : "Keep Going!";
    }
    if (resultsSub) {
      resultsSub.textContent = `${title} · ${right}/${total} correct · ${firstTry}/${total} first-try (${pct}%)`;
    }
    if (grid) {
      grid.innerHTML = `
        <div class="stat-card"><span>${right}</span> correct</div>
        <div class="stat-card"><span>${firstTry}</span> first-try</div>
        <div class="stat-card"><span>${pct}%</span> first-try</div>
        <div class="stat-card"><span data-roblox-points>${getRobloxPoints()}</span> Roblox pts</div>
      `;
    }
    if (rewardBox) {
      if (reward.awarded) {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box won";
        rewardBox.innerHTML = `
          <p class="ss-reward-emoji">🧱</p>
          <p class="ss-reward-title">You earned ${reward.points} Roblox points!</p>
          <p>First-try ${pct}% (need ${ROBLOX_PASS_PCT}%+). Bank: <strong>${reward.total}</strong></p>
        `;
      } else {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box miss";
        rewardBox.innerHTML = `
          <p class="ss-reward-title">Roblox points: not yet</p>
          <p>Get <strong>${ROBLOX_PASS_PCT}%</strong> first-try (9 of 10) to earn <strong>${ROBLOX_REWARD_POINTS}</strong> pts.</p>
          <p>You got ${pct}% first-try. Try again!</p>
          <p>Bank: <strong data-roblox-points>${getRobloxPoints()}</strong></p>
        `;
      }
    }

    showScreen("eng-results");
    engSession = null;
  }

  // ---------------------------------------------------------------------------
  // Social Studies · Week 7 · Thinking Like a Geographer
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Arabic · Grade 3 letters + easy words
  // ---------------------------------------------------------------------------
  const AR_TARGET = 10;
  const AR_MAX_TRIES = 2;
  const AR_LETTERS = [
    { letter: "ا", name: "Alif", emoji: "🐪" },
    { letter: "ب", name: "Ba", emoji: "🚪" },
    { letter: "ت", name: "Ta", emoji: "🌴" },
    { letter: "ث", name: "Tha", emoji: "🦊" },
    { letter: "ج", name: "Jeem", emoji: "🐪" },
    { letter: "ح", name: "Haa", emoji: "🕌" },
    { letter: "خ", name: "Kha", emoji: "🥬" },
    { letter: "د", name: "Dal", emoji: "🐔" },
    { letter: "ذ", name: "Thal", emoji: "🌽" },
    { letter: "ر", name: "Ra", emoji: "🌙" },
    { letter: "ز", name: "Zay", emoji: "🌸" },
    { letter: "س", name: "Seen", emoji: "🐟" },
    { letter: "ش", name: "Sheen", emoji: "☀️" },
    { letter: "ص", name: "Sad", emoji: "🧼" },
    { letter: "ض", name: "Dad", emoji: "💡" },
    { letter: "ط", name: "Taa", emoji: "🐦" },
    { letter: "ظ", name: "Zaa", emoji: "🕶️" },
    { letter: "ع", name: "Ain", emoji: "👁️" },
    { letter: "غ", name: "Ghain", emoji: "☁️" },
    { letter: "ف", name: "Fa", emoji: "🐘" },
    { letter: "ق", name: "Qaf", emoji: "🖊️" },
    { letter: "ك", name: "Kaf", emoji: "📖" },
    { letter: "ل", name: "Lam", emoji: "🍋" },
    { letter: "م", name: "Meem", emoji: "💧" },
    { letter: "ن", name: "Noon", emoji: "⭐" },
    { letter: "ه", name: "Heh", emoji: "🏠" },
    { letter: "و", name: "Waw", emoji: "🌹" },
    { letter: "ي", name: "Ya", emoji: "✋" },
  ].map((item) => ({ ...item, emoji: String(item.emoji).trim() || "✨" }));

  const AR_WORDS = [
    { ar: "كتاب", en: "book", emoji: "📖" },
    { ar: "قلم", en: "pen", emoji: "🖊️" },
    { ar: "بيت", en: "house", emoji: "🏠" },
    { ar: "ماء", en: "water", emoji: "💧" },
    { ar: "شمس", en: "sun", emoji: "☀️" },
    { ar: "قمر", en: "moon", emoji: "🌙" },
    { ar: "باب", en: "door", emoji: "🚪" },
    { ar: "ولد", en: "boy", emoji: "👦" },
    { ar: "بنت", en: "girl", emoji: "👧" },
    { ar: "أم", en: "mom", emoji: "👩" },
    { ar: "أب", en: "dad", emoji: "👨" },
    { ar: "يد", en: "hand", emoji: "✋" },
    { ar: "عين", en: "eye", emoji: "👁️" },
    { ar: "سمك", en: "fish", emoji: "🐟" },
    { ar: "تفاح", en: "apple", emoji: "🍎" },
    { ar: "حليب", en: "milk", emoji: "🥛" },
  ];

  let arSession = null;
  let arLastMode = "letters";

  function speakArabic(text) {
    try {
      if (!window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = "ar-SA";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }

  function buildArLetterQuestions(n = AR_TARGET) {
    const pool = shuffleInPlace([...AR_LETTERS]);
    const names = AR_LETTERS.map((x) => x.name);
    const out = [];
    for (let i = 0; i < n; i++) {
      const item = pool[i % pool.length];
      const kind = i % 2 === 0 ? "letter-to-name" : "name-to-letter";
      if (kind === "letter-to-name") {
        out.push({
          kind,
          prompt: item.letter,
          answer: item.name,
          speak: item.letter,
          choices: engPickChoices(item.name, names, 4),
          hint: "Tap the matching letter name!",
        });
      } else {
        const letters = AR_LETTERS.map((x) => x.letter);
        out.push({
          kind,
          prompt: item.name,
          answer: item.letter,
          speak: item.letter,
          choices: engPickChoices(item.letter, letters, 4),
          hint: `Tap the letter for “${item.name}”!`,
        });
      }
    }
    return out;
  }

  function buildArFlashQuestions(n = AR_WORDS.length) {
    const pool = shuffleInPlace([...AR_WORDS]);
    return pool.slice(0, Math.min(n, pool.length)).map((item) => ({
      kind: "flash",
      ar: item.ar,
      en: item.en,
      emoji: item.emoji,
      answer: item.en,
      speak: item.ar,
      hint: "Tap the card to show English",
    }));
  }

  function buildArWriteQuestions(n = AR_TARGET) {
    const pool = shuffleInPlace([...AR_WORDS]);
    return pool.slice(0, Math.min(n, pool.length)).map((item) => ({
      kind: "write",
      promptHtml: `<span class="eng-emoji" aria-hidden="true">${item.emoji}</span><span class="eng-copy-word">${item.en}</span>`,
      ar: item.ar,
      en: item.en,
      emoji: item.emoji,
      answer: item.ar,
      speak: item.ar,
      hint: "Write the Arabic word, then POW!",
    }));
  }

  function startArPractice(mode) {
    arLastMode = mode;
    const questions =
      mode === "flash"
        ? buildArFlashQuestions()
        : mode === "words"
          ? buildArWriteQuestions(AR_TARGET)
          : buildArLetterQuestions(AR_TARGET);
    arSession = {
      mode,
      questions,
      index: 0,
      correct: 0,
      firstTryCorrect: 0,
      attemptsOnCurrent: 0,
      answered: false,
      flashRevealed: false,
    };
    showScreen("ar-play");
    renderArQuestion();
  }

  function arCurrent() {
    return arSession?.questions?.[arSession.index] || null;
  }

  function hideArExtraPanels() {
    const flash = $("ar-flash-card");
    const writeForm = $("ar-write-form");
    const reveal = $("ar-reveal");
    const choices = $("ar-choices");
    if (flash) flash.hidden = true;
    if (writeForm) writeForm.hidden = true;
    if (reveal) reveal.hidden = true;
    if (choices) {
      choices.hidden = false;
      choices.innerHTML = "";
    }
  }

  function renderArQuestion() {
    if (!arSession) return;
    const q = arCurrent();
    if (!q) return;
    arSession.answered = false;
    arSession.attemptsOnCurrent = 0;
    arSession.flashRevealed = false;
    arSession._writeSettled = false;

    if ($("ar-progress")) {
      $("ar-progress").textContent = `${arSession.index + 1} / ${arSession.questions.length}`;
    }
    if ($("ar-stars")) $("ar-stars").textContent = String(arSession.correct);
    if ($("ar-mode-tag")) {
      $("ar-mode-tag").textContent =
        arSession.mode === "flash"
          ? "Flashcards"
          : arSession.mode === "words"
            ? "Write Words"
            : "Letters";
    }
    if ($("ar-feedback")) {
      $("ar-feedback").textContent = "";
      $("ar-feedback").className = "feedback";
    }
    if ($("btn-ar-next")) $("btn-ar-next").hidden = true;

    hideArExtraPanels();

    const prompt = $("ar-prompt");
    const hint = $("ar-hint");
    const choices = $("ar-choices");
    const hearBtn = $("btn-ar-hear");

    if (arSession.mode === "flash") {
      if (prompt) {
        prompt.className = "eng-prompt ar-prompt";
        prompt.textContent = "";
        prompt.hidden = true;
      }
      if (hint) hint.textContent = "Tap the card to show English";
      if (hearBtn) hearBtn.hidden = false;
      if (choices) choices.hidden = true;
      const flash = $("ar-flash-card");
      const flashEmoji = $("ar-flash-emoji");
      const flashAr = $("ar-flash-ar");
      const flashEn = $("ar-flash-en");
      const flashTap = $("ar-flash-tap");
      if (flash) {
        flash.hidden = false;
        flash.classList.remove("revealed");
      }
      if (flashEmoji) flashEmoji.textContent = q.emoji || "✨";
      if (flashAr) flashAr.textContent = q.ar || "";
      if (flashEn) {
        flashEn.textContent = q.en || "";
        flashEn.hidden = true;
      }
      if (flashTap) {
        flashTap.hidden = false;
        flashTap.textContent = "Tap to show English";
      }
      if ($("btn-ar-next")) $("btn-ar-next").hidden = false;
      if (q.speak) window.setTimeout(() => speakArabic(q.speak), 250);
      return;
    }

    if (arSession.mode === "words") {
      if (prompt) {
        prompt.hidden = false;
        prompt.className = "eng-prompt eng-prompt-word ar-prompt";
        prompt.innerHTML = q.promptHtml || "";
      }
      if (hint) hint.textContent = "Write the Arabic word, then POW!";
      if (hearBtn) hearBtn.hidden = true;
      if (choices) choices.hidden = true;
      const writeForm = $("ar-write-form");
      const writeInput = $("ar-write-input");
      const reveal = $("ar-reveal");
      if (writeForm) writeForm.hidden = false;
      if (reveal) reveal.hidden = true;
      if (writeInput) {
        writeInput.disabled = false;
        writeInput.value = "";
        window.setTimeout(() => {
          try {
            writeInput.focus({ preventScroll: true });
          } catch {
            writeInput.focus();
          }
        }, 120);
      }
      return;
    }

    // Letters quiz
    if (prompt) {
      prompt.hidden = false;
      if (q.promptHtml) {
        prompt.className = "eng-prompt eng-prompt-word ar-prompt";
        prompt.innerHTML = q.promptHtml;
      } else {
        prompt.className =
          q.kind === "name-to-letter"
            ? "eng-prompt eng-prompt-word ar-prompt"
            : "eng-prompt ar-prompt ar-prompt-letter";
        prompt.textContent = q.prompt;
      }
    }
    if (hint) hint.textContent = q.hint || "Tap the answer!";
    if (hearBtn) hearBtn.hidden = !q.speak;
    if (choices) {
      choices.hidden = false;
      choices.innerHTML = (q.choices || [])
        .map(
          (choice) =>
            `<button type="button" class="eng-choice ar-choice" data-ar-choice="${String(choice).replace(/"/g, "&quot;")}">${choice}</button>`
        )
        .join("");
      choices.querySelectorAll(".eng-choice").forEach((btn) => {
        btn.addEventListener("click", () =>
          submitArChoice(btn.getAttribute("data-ar-choice"), btn)
        );
      });
    }
    if (q.speak) window.setTimeout(() => speakArabic(q.speak), 250);
  }

  function flipArFlashCard() {
    if (!arSession || arSession.mode !== "flash") return;
    const q = arCurrent();
    if (!q) return;
    arSession.flashRevealed = true;
    const flash = $("ar-flash-card");
    const flashEn = $("ar-flash-en");
    const flashTap = $("ar-flash-tap");
    if (flash) flash.classList.add("revealed");
    if (flashEn) flashEn.hidden = false;
    if (flashTap) flashTap.textContent = "English shown";
    speakArabic(q.ar);
  }

  function submitArWrite(event) {
    if (event) event.preventDefault();
    if (!arSession || arSession.answered || arSession.mode !== "words") return;
    const q = arCurrent();
    const input = $("ar-write-input");
    if (!q || !input) return;

    const yours = String(input.value || "").trim();
    arSession.answered = true;
    input.disabled = true;

    const writeForm = $("ar-write-form");
    const reveal = $("ar-reveal");
    if (writeForm) writeForm.hidden = true;
    if (reveal) reveal.hidden = false;
    if ($("ar-reveal-ar")) $("ar-reveal-ar").textContent = q.ar || q.answer || "";
    if ($("ar-reveal-yours")) {
      $("ar-reveal-yours").textContent = yours
        ? `Your writing: ${yours}`
        : "Your writing: (blank)";
    }
    if ($("ar-feedback")) {
      $("ar-feedback").textContent = "Compare your writing — how close are you?";
      $("ar-feedback").className = "feedback";
    }
    speakArabic(q.ar || q.answer);
  }

  function finishArWriteSelfCheck(gotIt) {
    if (!arSession || arSession.mode !== "words" || arSession._writeSettled) return;
    arSession._writeSettled = true;
    if (gotIt) {
      arSession.correct += 1;
      arSession.firstTryCorrect += 1;
      if ($("ar-stars")) $("ar-stars").textContent = String(arSession.correct);
      playCorrectSound();
    } else {
      noteArNeedsRetry();
      playWrongSound();
    }
    window.setTimeout(() => advanceArQuestion(), 400);
  }

  async function submitArChoice(choice, btn) {
    if (!arSession || arSession.answered) return;
    const q = arCurrent();
    if (!q) return;
    const picked = String(choice || "");
    const ok = picked === String(q.answer);
    arSession.attemptsOnCurrent += 1;
    const feedback = $("ar-feedback");
    const nextBtn = $("btn-ar-next");

    if (ok) {
      arSession.answered = true;
      if (arSession.attemptsOnCurrent === 1) arSession.firstTryCorrect += 1;
      else noteArNeedsRetry();
      arSession.correct += 1;
      if ($("ar-stars")) $("ar-stars").textContent = String(arSession.correct);
      $("ar-choices")
        ?.querySelectorAll(".eng-choice")
        .forEach((el) => {
          el.disabled = true;
          if (el.getAttribute("data-ar-choice") === String(q.answer)) el.classList.add("right");
        });
      if (feedback) {
        feedback.textContent =
          arSession.attemptsOnCurrent === 1 ? "Yes! ★" : "Got it!";
        feedback.className = "feedback right";
      }
      await playCorrectSound();
      window.setTimeout(() => advanceArQuestion(), 700);
      return;
    }

    if (btn) {
      btn.classList.add("wrong");
      btn.disabled = true;
    }

    if (arSession.attemptsOnCurrent >= AR_MAX_TRIES) {
      arSession.answered = true;
      noteArNeedsRetry();
      $("ar-choices")
        ?.querySelectorAll(".eng-choice")
        .forEach((el) => {
          el.disabled = true;
          if (el.getAttribute("data-ar-choice") === String(q.answer)) el.classList.add("right");
        });
      if (feedback) {
        feedback.textContent = `It's “${q.answer}”`;
        feedback.className = "feedback wrong";
      }
      if (nextBtn) nextBtn.hidden = false;
      await playWrongSound();
      return;
    }

    if (feedback) {
      feedback.textContent = "Try again!";
      feedback.className = "feedback wrong";
    }
    await playWrongSound();
  }

  function noteArNeedsRetry() {
    if (!arSession) return;
    const q = arCurrent();
    if (!q) return;
    const marker = q.answer || q.prompt || "";
    const already = arSession.questions.filter((item) => item._retryOf === marker).length;
    if (already >= 3) return;
    const clone =
      typeof structuredClone === "function" ? structuredClone(q) : JSON.parse(JSON.stringify(q));
    clone._retry = true;
    clone._retryOf = marker;
    const gap = retryGap(1, 2);
    const at = Math.min(arSession.questions.length, arSession.index + gap);
    arSession.questions.splice(at, 0, clone);
  }

  function advanceArQuestion() {
    if (!arSession) return;
    if (arSession.index + 1 >= arSession.questions.length) {
      endArPractice();
      return;
    }
    arSession.index += 1;
    renderArQuestion();
  }

  function endArPractice() {
    if (!arSession) return;
    const total = arSession.questions.length;
    const right = arSession.correct;
    const firstTry = arSession.firstTryCorrect;
    const pct = Math.round((firstTry / total) * 100);
    const title =
      arSession.mode === "flash"
        ? "Arabic · Flashcards"
        : arSession.mode === "words"
          ? "Arabic · Write Words"
          : "Arabic · Letters";
    const reward = maybeAwardRobloxPoints(pct, firstTry, total, {
      week: "AR",
      title,
    });
    const resultsTitle = $("ar-results-title");
    const resultsSub = $("ar-results-sub");
    const grid = $("ar-results-grid");
    const rewardBox = $("ar-reward-box");
    if (resultsTitle) {
      resultsTitle.textContent =
        pct >= ROBLOX_PASS_PCT ? "Arabic Star!" : pct >= 70 ? "Great Practice!" : "Keep Going!";
    }
    if (resultsSub) {
      resultsSub.textContent = `${title} · ${right}/${total} correct · ${firstTry}/${total} first-try (${pct}%)`;
    }
    if (grid) {
      grid.innerHTML = `
        <div class="stat-card"><span>${right}</span> correct</div>
        <div class="stat-card"><span>${firstTry}</span> first-try</div>
        <div class="stat-card"><span>${pct}%</span> first-try</div>
        <div class="stat-card"><span data-roblox-points>${getRobloxPoints()}</span> Roblox pts</div>
      `;
    }
    if (rewardBox) {
      if (reward.awarded) {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box won";
        rewardBox.innerHTML = `
          <p class="ss-reward-emoji">🧱</p>
          <p class="ss-reward-title">You earned ${reward.points} Roblox points!</p>
          <p>First-try ${pct}% (need ${ROBLOX_PASS_PCT}%+). Bank: <strong>${reward.total}</strong></p>
        `;
      } else {
        rewardBox.hidden = false;
        rewardBox.className = "ss-reward-box miss";
        rewardBox.innerHTML = `
          <p class="ss-reward-title">Almost — need ${ROBLOX_PASS_PCT}%+ first-try for Roblox points</p>
          <p>You got ${pct}%. Bank: <strong>${getRobloxPoints()}</strong></p>
        `;
      }
    }
    arSession = null;
    showScreen("ar-results");
    renderRobloxBank();
  }

  const SS_DIFFICULTIES = ["easy1", "easy2", "medium", "hard"];
  const SS_DIFF_LABELS = {
    easy1: "Easy 1",
    easy2: "Easy 2",
    medium: "Medium",
    hard: "Hard",
  };
  let ssWeekId = 8;
  let ssQuizDifficulty = "medium";

  function ssDiffLabel(diff) {
    return SS_DIFF_LABELS[diff] || String(diff || "Medium");
  }

  function ssContentDifficulty(diff) {
    if (diff === "easy1" || diff === "easy2" || diff === "easy") return "easy";
    return SS_DIFFICULTIES.includes(diff) ? diff : "medium";
  }

  const SS_CATALOG = {
    7: {
      week: 7,
      unit: "Geography",
      title: "Thinking Like a Geographer",
      guiding: "How do maps help us learn about the Earth?",
      eyebrow: "California Studies Weekly · Week 7",
      tagline: "Unit: Geography · How do maps help us learn about the Earth?",
      lessons: [
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
  ],
      study: [
      {
        title: "What are maps & globes?",
        items: [
          "A <strong>globe</strong> is a model of the Earth. It shows water, land, and countries.",
          "You would travel about <strong>25,000 miles</strong> to go around the Earth.",
          "<strong>Maps</strong> are models of places. They show sizes, shapes, locations, and distances.",
          "Maps can show roads, cities, national parks, landforms, boundaries, and weather.",
        ],
      },
      {
        title: "Cartographers & map tools",
        items: [
          "A <strong>cartographer</strong> creates maps and decides what to include.",
          "The <strong>title</strong> tells what the map is about.",
          "The <strong>legend</strong> explains symbols and colors.",
          "The <strong>compass rose</strong> shows cardinal directions: north, south, east, west.",
          "The <strong>scale</strong> helps you tell distance (how far places are).",
        ],
      },
      {
        title: "Kinds of maps",
        items: [
          "<strong>Population map</strong> — where people live",
          "<strong>Political map</strong> — borders between cities, states, and countries",
          "<strong>Physical map</strong> — natural features (mountains, valleys, lakes, streams)",
          "<strong>Climate map</strong> — whether a place is usually warm, cold, wet, or dry",
          "<strong>Climate</strong> is the study of weather over time",
        ],
      },
    ],
      banks: [
    {
      id: "globe",
      variants: [
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A __________ is a round model of Earth.",
          choices: ["map", "globe", "legend", "scale"],
          answer: "globe",
          explain: "A globe is a round model of Earth.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "What is a globe?",
          choices: [
            "A flat road map",
            "A round model of Earth",
            "A weather report",
            "A list of cities",
          ],
          answer: "A round model of Earth",
          explain: "A globe is a round model of Earth.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A globe shows water, land, and __________.",
          choices: ["toys", "countries", "songs", "foods"],
          answer: "countries",
          explain: "A globe shows water, land, and countries.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "A globe is shaped like Earth — round.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Yes — a globe is round like Earth.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which one is a model of the whole Earth?",
          choices: ["A street map", "A globe", "A book title", "A compass only"],
          answer: "A globe",
          explain: "A globe is a model of the whole Earth.",
        },
      ],
    },
    {
      id: "distance",
      variants: [
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "About how far is it around Earth?",
          choices: ["2,500 miles", "10,000 miles", "25,000 miles", "100,000 miles"],
          answer: "25,000 miles",
          explain: "Around Earth is about 25,000 miles.",
        },
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "To go all the way around Earth is about __________ miles.",
          choices: ["25", "250", "2,500", "25,000"],
          answer: "25,000",
          explain: "Around Earth is about 25,000 miles.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Earth is huge. About how many miles around is it?",
          choices: ["250 miles", "2,500 miles", "25,000 miles", "250,000 miles"],
          answer: "25,000 miles",
          explain: "About 25,000 miles around.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "It is about 25,000 miles around Earth.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — about 25,000 miles.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which number matches “around Earth”?",
          choices: ["25 miles", "250 miles", "2,500 miles", "25,000 miles"],
          answer: "25,000 miles",
          explain: "Around Earth ≈ 25,000 miles.",
        },
      ],
    },
    {
      id: "cartographer",
      variants: [
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A person who makes maps is called a __________.",
          choices: ["historian", "cartographer", "explorer", "geologist"],
          answer: "cartographer",
          explain: "A cartographer is a map maker.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Who makes maps?",
          choices: ["A cartographer", "A dentist", "A chef", "A pilot only"],
          answer: "A cartographer",
          explain: "A cartographer makes maps.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "A cartographer is a map maker.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — cartographer = map maker.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Cartographer means __________ maker.",
          choices: ["cake", "map", "song", "shoe"],
          answer: "map",
          explain: "Cartographer = map maker.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Like a writer picks words, a cartographer picks what goes on a __________.",
          choices: ["map", "pizza", "movie", "song"],
          answer: "map",
          explain: "A cartographer chooses what goes on a map.",
        },
      ],
    },
    {
      id: "legend",
      variants: [
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The __________ tells what the pictures and colors on a map mean.",
          choices: ["title", "scale", "legend", "border"],
          answer: "legend",
          explain: "The legend tells what map pictures mean.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "What does a map legend do?",
          choices: [
            "Tells how old the map is",
            "Explains symbols and colors",
            "Shows only north",
            "Names the cartographer’s dog",
          ],
          answer: "Explains symbols and colors",
          explain: "The legend explains symbols and colors.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Another name for a map legend is a __________.",
          choices: ["key", "boat", "cloud", "desk"],
          answer: "key",
          explain: "The legend is also called the key.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "The legend explains what map symbols mean.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — check the legend for symbol meanings.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Blue means water on many maps. Where do you check that?",
          choices: ["The legend", "The moon", "The title only", "Nowhere"],
          answer: "The legend",
          explain: "The legend explains colors and symbols.",
        },
      ],
    },
    {
      id: "compass",
      variants: [
        {
          difficulty: "hard",
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
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A compass rose shows __________ directions.",
          choices: ["cardinal", "silly", "tiny", "secret"],
          answer: "cardinal",
          explain: "Cardinal directions are N, S, E, W.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which are the four main directions?",
          choices: [
            "Up, down, left, right only",
            "North, South, East, West",
            "Hot, cold, wet, dry",
            "Red, blue, green, yellow",
          ],
          answer: "North, South, East, West",
          explain: "Those are the cardinal directions.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "A compass rose helps you find north, south, east, and west.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — that’s what a compass rose shows.",
        },
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Never Eat Soggy Worms helps you remember __________.",
          choices: ["directions", "animals", "foods", "numbers"],
          answer: "directions",
          explain: "N-E-S-W are the directions.",
        },
      ],
    },
    {
      id: "scale",
      variants: [
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The __________ helps you know how far places are on a map.",
          choices: ["legend", "title", "compass rose", "scale"],
          answer: "scale",
          explain: "Scale means how far.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "What does map scale tell you?",
          choices: [
            "Distance (how far)",
            "The map maker’s age",
            "Only the color blue",
            "Who lives there",
          ],
          answer: "Distance (how far)",
          explain: "Scale tells distance.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "Scale helps you know distance on a map.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — scale = how far.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "A short line on a map can stand for many real __________.",
          choices: ["miles", "jokes", "songs", "colors"],
          answer: "miles",
          explain: "Scale turns map length into real distance.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Distance means how __________.",
          choices: ["far", "loud", "funny", "new"],
          answer: "far",
          explain: "Distance = how far.",
        },
      ],
    },
    {
      id: "population",
      variants: [
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A __________ map shows where people live.",
          choices: ["political", "physical", "population", "climate"],
          answer: "population",
          explain: "Population map = where people live.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which map shows where people live?",
          choices: ["Population map", "Climate map", "Physical map", "Lunch map"],
          answer: "Population map",
          explain: "Population = people.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "A population map is about where people live.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — population means people.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Busy cities with lots of people show up on a __________ map.",
          choices: ["population", "dessert", "music", "shoe"],
          answer: "population",
          explain: "Population maps show where people live.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Population means __________.",
          choices: ["people", "rain", "rocks", "roads only"],
          answer: "people",
          explain: "Population = people.",
        },
      ],
    },
    {
      id: "political",
      variants: [
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A __________ map shows borders of cities, states, and countries.",
          choices: ["population", "political", "climate", "road"],
          answer: "political",
          explain: "Political map = borders.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which map shows borders between places?",
          choices: ["Political map", "Climate map", "Only a globe", "A joke book"],
          answer: "Political map",
          explain: "Political maps show borders.",
        },
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "A political map shows borders.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — borders of cities, states, countries.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Borders are __________ between places.",
          choices: ["lines", "songs", "clouds", "pets"],
          answer: "lines",
          explain: "Borders are dividing lines.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "States and countries are shown with borders on a __________ map.",
          choices: ["political", "bedtime", "funny", "empty"],
          answer: "political",
          explain: "Political map = borders.",
        },
      ],
    },
    {
      id: "physical",
      variants: [
        {
          difficulty: "medium",
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
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A __________ map shows mountains, valleys, lakes, and streams.",
          choices: ["political", "physical", "population", "shopping"],
          answer: "physical",
          explain: "Physical map = nature features.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "A physical map shows natural features like mountains and lakes.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — physical = nature.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which map is best for finding mountains?",
          choices: ["Physical map", "Population map", "Only a title", "A menu"],
          answer: "Physical map",
          explain: "Physical maps show landforms.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Physical maps show __________ features.",
          choices: ["natural", "cartoon", "secret", "tiny only"],
          answer: "natural",
          explain: "Natural features = mountains, lakes, and more.",
        },
      ],
    },
    {
      id: "climate-map",
      variants: [
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A climate map shows if a place is usually warm, cold, wet, or __________.",
          choices: ["dry", "loud", "crowded", "flat"],
          answer: "dry",
          explain: "Climate maps show warm, cold, wet, or dry.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "What does a climate map show?",
          choices: [
            "If a place is usually warm/cold or wet/dry",
            "Only one road name",
            "Who made the map yesterday",
            "How tall a mountain is in inches only",
          ],
          answer: "If a place is usually warm/cold or wet/dry",
          explain: "Climate maps show usual weather patterns.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "A climate map can show if a place is usually dry.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — warm, cold, wet, or dry.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which map helps you see if a place is usually hot or cold?",
          choices: ["Climate map", "Only a legend", "A blank page", "A shoe map"],
          answer: "Climate map",
          explain: "Climate maps show usual weather.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Warm, cold, wet, and dry are ideas on a __________ map.",
          choices: ["climate", "pencil", "lunch", "toy"],
          answer: "climate",
          explain: "That’s a climate map.",
        },
      ],
    },
    {
      id: "climate-time",
      variants: [
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Climate means weather over __________.",
          choices: ["one day", "time", "one hour", "maps only"],
          answer: "time",
          explain: "Climate = weather over time.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Climate is weather studied over __________.",
          choices: ["a long time", "one second", "one sneeze", "never"],
          answer: "a long time",
          explain: "Climate = weather over time.",
        },
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "Climate is just today’s weather.",
          choices: ["TRUE", "FALSE"],
          answer: "FALSE",
          explain: "Climate is weather over a long time.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Today’s rain is weather. Climate is weather over __________.",
          choices: ["time", "one blink", "one song", "one jump"],
          answer: "time",
          explain: "Climate = weather over time.",
        },
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Weather over a long time is called __________.",
          choices: ["climate", "lunch", "recess", "glue"],
          answer: "climate",
          explain: "Climate = weather over time.",
        },
      ],
    },
    {
      id: "many-maps",
      variants: [
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "Only one kind of map is useful.",
          choices: ["TRUE", "FALSE"],
          answer: "FALSE",
          explain: "We use many kinds of maps.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "How many kinds of maps can be useful?",
          choices: ["Only one", "Many different kinds", "Zero", "Only funny maps"],
          answer: "Many different kinds",
          explain: "Different maps give different information.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "Different maps can show different information.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — each map has a job.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Why do we have many map types?",
          choices: [
            "Each map gives special information",
            "Maps are only for decoration",
            "There is only one map ever",
            "Maps cannot help us",
          ],
          answer: "Each map gives special information",
          explain: "Each map type has a purpose.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "We use __________ kinds of maps to learn about Earth.",
          choices: ["many", "zero", "one only forever", "no"],
          answer: "many",
          explain: "Many map types help us learn.",
        },
      ],
    },
    {
      id: "title",
      variants: [
        {
          difficulty: "easy",
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
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The __________ is the name of the map.",
          choices: ["title", "ocean", "pencil", "shoe"],
          answer: "title",
          explain: "Title = what the map is about.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "You should read the map title first.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "The title tells what the map is about.",
        },
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "“California Parks” on a map is most likely the __________.",
          choices: ["title", "climate", "population only", "wrong answer forever"],
          answer: "title",
          explain: "That’s the map’s title.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The title tells what the map is __________.",
          choices: ["about", "eating", "singing", "hiding"],
          answer: "about",
          explain: "Title = what the map is about.",
        },
      ],
    },
    {
      id: "map-uses",
      variants: [
        {
          difficulty: "hard",
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
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Maps are __________ of places.",
          choices: ["models", "animals", "jokes", "clouds only"],
          answer: "models",
          explain: "Maps are models of places.",
        },
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "Maps can help people find roads and cities.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — maps help us find places.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which can a map show?",
          choices: [
            "National parks",
            "Only dreams",
            "Only tomorrow’s lottery",
            "Nothing useful",
          ],
          answer: "National parks",
          explain: "Maps can show parks, roads, cities, and more.",
        },
        {
          difficulty: "easy",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A map is usually __________ (not round like a globe).",
          choices: ["flat", "fuzzy", "invisible", "liquid"],
          answer: "flat",
          explain: "Maps are flat models of places.",
        },
      ],
    },
    {
      id: "cartographer-choice",
      variants: [
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "A cartographer picks what to put on a map.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Yes — a cartographer chooses what goes on the map.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Who decides what to include on a map?",
          choices: [
            "The cartographer",
            "A random sock",
            "Nobody ever",
            "Only a fish",
          ],
          answer: "The cartographer",
          explain: "The cartographer chooses what to include.",
        },
        {
          difficulty: "easy",
          type: "tf",
          prompt: "True or False:",
          text: "A cartographer has a purpose for the map.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "True — maps are made with a purpose.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "A cartographer is like a book author because both __________.",
          choices: [
            "Choose what to include",
            "Only draw cats",
            "Never make choices",
            "Hide the title always",
          ],
          answer: "Choose what to include",
          explain: "Both choose what matters for their work.",
        },
        {
          difficulty: "hard",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A cartographer decides what __________ on a map.",
          choices: ["matters", "melts", "sleeps", "hides forever"],
          answer: "matters",
          explain: "They decide what matters to show.",
        },
      ],
    },
  ],
    },
    8: {
      week: 8,
      unit: "Geography",
      title: "Oceans and Continents",
      guiding: "How do geographical tools help us learn about our world?",
      eyebrow: "California Studies Weekly · Week 8",
      tagline: "Unit: Geography · Map Skills · Oceans, continents, lines & time",
      lessons: [
    {
      emoji: "🌊",
      badge: "Week 8 · Learning",
      title: "Oceans and Continents",
      body: [
        "This week we learn map skills.",
        "Oceans. Continents. Lines on maps.",
        "Big question:",
        "How do geographical tools help us learn about our world?",
      ],
      remember: "Maps and globes are tools that help us learn about Earth.",
    },
    {
      emoji: "🌏",
      badge: "Water world",
      title: "Five Oceans",
      body: [
        "Earth has five oceans.",
        "Arctic. Atlantic. Indian. Pacific. Southern.",
        "Oceans are the largest bodies of water.",
      ],
      remember: "5 oceans: Arctic, Atlantic, Indian, Pacific, Southern.",
    },
    {
      emoji: "💧",
      badge: "Water world",
      title: "Mostly Water!",
      body: [
        "More than two-thirds of Earth is water.",
        "Oceans look bigger than land on a world map.",
        "Other water: rivers, lakes, ponds, and streams.",
      ],
      remember: "More than 2/3 of Earth is covered by water.",
    },
    {
      emoji: "🗺️",
      badge: "Land",
      title: "Seven Continents",
      body: [
        "About one-third of Earth is land.",
        "Big land areas are continents.",
        "There are seven: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.",
      ],
      remember: "7 continents. Land = about 1/3 of Earth.",
    },
    {
      emoji: "📍",
      badge: "Theme 1",
      title: "Location",
      body: [
        "The first theme of geography is location.",
        "Location means where a place is.",
        "Absolute location is the exact place on a map.",
      ],
      remember: "Location = where. Absolute location = exact place.",
    },
    {
      emoji: "↔️",
      badge: "Latitude",
      title: "Latitude Lines",
      body: [
        "Latitude lines run east and west.",
        "They show how far a place is from the Equator.",
        "Latitude lines are also called parallels.",
      ],
      remember: "Latitude = east–west lines (parallels).",
    },
    {
      emoji: "🌐",
      badge: "Latitude",
      title: "The Equator",
      body: [
        "The Equator is an imaginary line around the middle of Earth.",
        "It splits Earth into Northern and Southern Hemispheres.",
        "Hemi- means half. A hemisphere is half a sphere.",
      ],
      remember: "Equator → Northern & Southern Hemispheres.",
    },
    {
      emoji: "❄️",
      badge: "Latitude",
      title: "Special Latitude Lines",
      body: [
        "North of the Equator: Tropic of Cancer and Arctic Circle.",
        "South of the Equator: Tropic of Capricorn and Antarctic Circle.",
        "These help map warm and cold parts of Earth.",
      ],
      remember: "Cancer & Arctic north · Capricorn & Antarctic south.",
    },
    {
      emoji: "↕️",
      badge: "Longitude",
      title: "Longitude Lines",
      body: [
        "Longitude lines run from the North Pole to the South Pole.",
        "They show how far east or west a place is.",
        "Longitude lines are called meridians.",
      ],
      remember: "Longitude = north–south lines (meridians).",
    },
    {
      emoji: "🧭",
      badge: "Longitude",
      title: "Prime Meridian",
      body: [
        "The Prime Meridian is a special longitude line.",
        "It splits Earth into Eastern and Western Hemispheres.",
        "Other meridians measure distance from the Prime Meridian.",
      ],
      remember: "Prime Meridian → Eastern & Western Hemispheres.",
    },
    {
      emoji: "🔤",
      badge: "Grid",
      title: "Coordinate Grid",
      body: [
        "Cartographers divide maps into small squares.",
        "Those squares make a grid.",
        "A coordinate grid uses letters and numbers to name places.",
      ],
      remember: "Grid = letters + numbers for absolute location.",
    },
    {
      emoji: "⬆️",
      badge: "Directions",
      title: "Cardinal Directions",
      body: [
        "Cardinal directions are the four main points.",
        "North. South. East. West.",
        "North and south point toward Earth’s poles.",
      ],
      remember: "Cardinal = N, S, E, W.",
    },
    {
      emoji: "↗️",
      badge: "Directions",
      title: "Intermediate Directions",
      body: [
        "In-between directions are intermediate directions.",
        "Northwest. Northeast. Southwest. Southeast.",
        "Find them on a compass rose with the cardinal points.",
      ],
      remember: "Intermediate = NW, NE, SW, SE.",
    },
    {
      emoji: "🕒",
      badge: "Time",
      title: "Time Zones",
      body: [
        "Earth spins once each day — 24 hours.",
        "That is why Earth has 24 time zones.",
        "A time zone shows what time it is in a place.",
      ],
      remember: "24 hours → 24 time zones.",
    },
    {
      emoji: "➕",
      badge: "Time",
      title: "Prime Meridian Time",
      body: [
        "The Prime Meridian is the starting point for time zones.",
        "Go east → add one hour per zone.",
        "Go west → take one hour away per zone.",
      ],
      remember: "East = +1 hour · West = −1 hour.",
    },
    {
      emoji: "🇺🇸",
      badge: "Time",
      title: "U.S. Time Zones",
      body: [
        "Big countries can have many time zones.",
        "The United States has six time zones.",
        "Time zone lines often follow political borders to make life easier.",
      ],
      remember: "United States = 6 time zones.",
    },
    {
      emoji: "📅",
      badge: "Time",
      title: "International Date Line",
      body: [
        "The International Date Line marks where one day becomes the next.",
        "It is halfway around the world from the Prime Meridian.",
        "It is not straight because it follows political boundaries.",
      ],
      remember: "Date Line = new day boundary (not a straight line).",
    },
    {
      emoji: "⭐",
      badge: "You did it!",
      title: "Ready, Map Explorer!",
      body: [
        "You learned oceans, continents, latitude, longitude, directions, and time zones!",
        "Pick Easy, Medium, or Hard for the quiz.",
        "Hit 90%+ to earn Roblox points!",
      ],
      remember: "Learn first. Then take the quiz.",
    },
  ],
      study: [
      {
        title: "Oceans & continents",
        items: [
          "Earth has <strong>five oceans</strong>: Arctic, Atlantic, Indian, Pacific, Southern.",
          "More than <strong>two-thirds</strong> of Earth is water. About <strong>one-third</strong> is land.",
          "Other bodies of water: rivers, lakes, ponds, and streams.",
          "There are <strong>seven continents</strong>: Africa, Antarctica, Asia, Australia, Europe, North America, South America.",
        ],
      },
      {
        title: "Location, latitude & longitude",
        items: [
          "Geography’s first theme is <strong>location</strong> (where a place is).",
          "<strong>Absolute location</strong> uses vertical and horizontal lines.",
          "<strong>Latitude</strong> (parallels) run east–west and measure distance from the <strong>Equator</strong>.",
          "The Equator splits Earth into <strong>Northern</strong> and <strong>Southern</strong> Hemispheres.",
          "North of Equator: Tropic of Cancer, Arctic Circle. South: Tropic of Capricorn, Antarctic Circle.",
          "<strong>Longitude</strong> (meridians) run pole to pole. The <strong>Prime Meridian</strong> splits Eastern & Western Hemispheres.",
          "A <strong>coordinate grid</strong> uses letters and numbers.",
        ],
      },
      {
        title: "Directions & time",
        items: [
          "<strong>Cardinal</strong>: north, south, east, west.",
          "<strong>Intermediate</strong>: northwest, northeast, southwest, southeast.",
          "Earth has <strong>24 time zones</strong> (24-hour rotation).",
          "From the Prime Meridian: east = +1 hour per zone, west = −1 hour.",
          "The United States has <strong>six</strong> time zones. Boundaries often follow political borders.",
          "The <strong>International Date Line</strong> marks where the day changes (not a straight line).",
        ],
      },
    ],
      banks: [
    {
      id: "oceans-count",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "How many oceans does Earth have?",
          choices: ["3", "4", "5", "7"],
          answer: "5",
          explain: "Earth has five oceans.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Earth has __________ oceans.",
          choices: ["three", "four", "five", "nine"],
          answer: "five",
          explain: "There are five oceans.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which list names all five oceans?",
          choices: ["Arctic, Atlantic, Indian, Pacific, Southern", "Arctic, Atlantic, Caspian, Pacific, Southern", "Atlantic, Indian, Pacific, Red, Southern", "Arctic, Baltic, Indian, Pacific, Southern"],
          answer: "Arctic, Atlantic, Indian, Pacific, Southern",
          explain: "Those five are Earth's oceans.",
        }
      ],
    },
    {
      id: "oceans-names",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which one is an ocean?",
          choices: ["Sahara", "Pacific", "Amazon", "Himalaya"],
          answer: "Pacific",
          explain: "The Pacific is an ocean.",
        },
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "The Southern Ocean is one of Earth's five oceans.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Yes — Southern is one of the five.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Oceans are the __________ bodies of water.",
          choices: ["smallest", "saltiest only in lakes", "largest", "newest"],
          answer: "largest",
          explain: "Oceans are the largest bodies of water.",
        }
      ],
    },
    {
      id: "water-fraction",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which covers more of Earth — oceans or land?",
          choices: ["Land", "Oceans", "They are equal", "Only ice"],
          answer: "Oceans",
          explain: "Oceans cover more than land.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "More than __________ of Earth is covered in water.",
          choices: ["one-third", "two-thirds", "one-half", "one-fourth"],
          answer: "two-thirds",
          explain: "More than two-thirds is water.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "Less than half of Earth is covered by water.",
          choices: ["TRUE", "FALSE"],
          answer: "FALSE",
          explain: "More than two-thirds is water.",
        }
      ],
    },
    {
      id: "other-water",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which is NOT an ocean?",
          choices: ["Lake", "Pacific", "Atlantic", "Indian"],
          answer: "Lake",
          explain: "A lake is another body of water, not an ocean.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Besides oceans, bodies of water include rivers, lakes, ponds, and __________.",
          choices: ["continents", "streams", "equators", "meridians"],
          answer: "streams",
          explain: "Streams are smaller bodies of water.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "Rivers, lakes, ponds, and streams can be different sizes and shapes.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Yes — they vary in size and shape.",
        }
      ],
    },
    {
      id: "continents-count",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "How many continents are there?",
          choices: ["5", "6", "7", "8"],
          answer: "7",
          explain: "There are seven continents.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Large areas of land are called __________.",
          choices: ["oceans", "continents", "equators", "grids"],
          answer: "continents",
          explain: "Continents are large land areas.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "About how much of Earth is covered by land?",
          choices: ["Two-thirds", "One-third", "Almost all", "None"],
          answer: "One-third",
          explain: "About one-third is land.",
        }
      ],
    },
    {
      id: "continents-names",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which is a continent?",
          choices: ["Pacific", "Asia", "Atlantic", "Equator"],
          answer: "Asia",
          explain: "Asia is a continent.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which continent is farthest south?",
          choices: ["Europe", "Antarctica", "Asia", "North America"],
          answer: "Antarctica",
          explain: "Antarctica is at the South Pole.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "Australia is one of the seven continents.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Yes — Australia is a continent.",
        }
      ],
    },
    {
      id: "location-theme",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "The first theme of geography is __________.",
          choices: ["location", "food", "music", "sports"],
          answer: "location",
          explain: "Location is the first theme of geography.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Location means __________ a place is.",
          choices: ["why", "where", "when", "who"],
          answer: "where",
          explain: "Location = where a place is.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Absolute location means __________.",
          choices: ["a nickname for a city", "the exact place on a map", "only the ocean name", "a made-up story"],
          answer: "the exact place on a map",
          explain: "Absolute location is the exact place.",
        }
      ],
    },
    {
      id: "latitude",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Latitude lines run __________.",
          choices: ["north and south only", "east and west", "only through space", "in a spiral"],
          answer: "east and west",
          explain: "Latitude lines run east and west.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Latitude lines are also called __________.",
          choices: ["meridians", "parallels", "time zones", "compasses"],
          answer: "parallels",
          explain: "Latitude lines = parallels.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Latitude lines show how far places are from the __________.",
          choices: ["Prime Meridian", "Equator", "Date Line", "South Pole only"],
          answer: "Equator",
          explain: "Latitude measures distance from the Equator.",
        }
      ],
    },
    {
      id: "equator",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "The Equator runs around the __________ of Earth.",
          choices: ["middle", "only North Pole", "only South Pole", "moon"],
          answer: "middle",
          explain: "The Equator is around the middle.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The Equator divides Earth into Northern and Southern __________.",
          choices: ["oceans", "hemispheres", "continents", "grids"],
          answer: "hemispheres",
          explain: "It makes two hemispheres.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "The prefix hemi- means half, so a hemisphere is half a sphere.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Hemi- means half.",
        }
      ],
    },
    {
      id: "latitude-special",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which line is north of the Equator?",
          choices: ["Tropic of Capricorn", "Arctic Circle", "Antarctic Circle", "Southern Ocean only"],
          answer: "Arctic Circle",
          explain: "Arctic Circle is north of the Equator.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "The Tropic of Capricorn is __________ of the Equator.",
          choices: ["north", "south", "east only", "west only"],
          answer: "south",
          explain: "Capricorn is south of the Equator.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which pair is south of the Equator?",
          choices: ["Tropic of Cancer and Arctic Circle", "Tropic of Capricorn and Antarctic Circle", "Prime Meridian and Date Line", "Only the Arctic Circle"],
          answer: "Tropic of Capricorn and Antarctic Circle",
          explain: "Those two are south of the Equator.",
        }
      ],
    },
    {
      id: "longitude",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Longitude lines run from the North Pole to the __________.",
          choices: ["Equator only", "South Pole", "moon", "Pacific only"],
          answer: "South Pole",
          explain: "Longitude lines go pole to pole.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "Lines of longitude are called __________.",
          choices: ["parallels", "meridians", "oceans", "continents"],
          answer: "meridians",
          explain: "Longitude lines = meridians.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Longitude lines show how far __________ a place is from the Prime Meridian.",
          choices: ["east or west", "hot or cold", "high or low only", "wet or dry only"],
          answer: "east or west",
          explain: "Longitude = east/west from the Prime Meridian.",
        }
      ],
    },
    {
      id: "prime-meridian",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "The Prime Meridian is a line of __________.",
          choices: ["latitude", "longitude", "only weather", "only rivers"],
          answer: "longitude",
          explain: "It is a longitude line.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The Prime Meridian divides Earth into Eastern and Western __________.",
          choices: ["oceans", "hemispheres", "forests", "deserts"],
          answer: "hemispheres",
          explain: "It makes Eastern and Western Hemispheres.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "The Prime Meridian is also the starting point for time zones.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Time zones start at the Prime Meridian.",
        }
      ],
    },
    {
      id: "grid",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "A map grid is made of small __________.",
          choices: ["songs", "squares", "clouds", "mountains"],
          answer: "squares",
          explain: "Lines make small squares — a grid.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "A coordinate grid uses __________ to label places.",
          choices: ["only colors", "letters and numbers", "only emojis", "only animal names"],
          answer: "letters and numbers",
          explain: "Grids use letters and numbers.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "Vertical and horizontal lines help find absolute location on a map.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Those lines help find absolute location.",
        }
      ],
    },
    {
      id: "cardinal",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which are the four cardinal directions?",
          choices: ["N, S, E, W", "NE, NW, SE, SW", "Up, Down, Left, In", "Hot, Cold, Wet, Dry"],
          answer: "N, S, E, W",
          explain: "Cardinal = north, south, east, west.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "North and south point toward Earth's __________.",
          choices: ["oceans", "poles", "equators only", "deserts"],
          answer: "poles",
          explain: "N and S refer to the poles.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "Cardinal directions help us locate places around the world.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "They help us find our way.",
        }
      ],
    },
    {
      id: "intermediate",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Which is an intermediate direction?",
          choices: ["North", "Northeast", "East", "South"],
          answer: "Northeast",
          explain: "Northeast is intermediate.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Intermediate directions include northwest, northeast, southwest, and __________.",
          choices: ["south", "southeast", "east", "west"],
          answer: "southeast",
          explain: "SE is an intermediate direction.",
        },
        {
          difficulty: "hard",
          type: "tf",
          prompt: "True or False:",
          text: "Both cardinal and intermediate directions appear on a compass rose.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "A compass rose can show all eight.",
        }
      ],
    },
    {
      id: "time-zones",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "How many time zones does Earth have?",
          choices: ["12", "24", "7", "5"],
          answer: "24",
          explain: "Earth has 24 time zones.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "A time zone shows what __________ it is in a place.",
          choices: ["color", "time", "ocean", "continent"],
          answer: "time",
          explain: "Time zones show the local time.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Earth has 24 time zones because it rotates fully in __________.",
          choices: ["12 hours", "24 hours", "7 days", "60 minutes only"],
          answer: "24 hours",
          explain: "One full spin takes 24 hours.",
        }
      ],
    },
    {
      id: "time-east-west",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "From the Prime Meridian, moving east means you __________ an hour per zone.",
          choices: ["add", "subtract", "erase", "freeze"],
          answer: "add",
          explain: "East → add one hour.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "From the Prime Meridian, moving west means you __________ an hour per zone.",
          choices: ["add", "take away", "double", "ignore"],
          answer: "take away",
          explain: "West → subtract one hour.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "If you go two zones east of the Prime Meridian, you add __________.",
          choices: ["1 hour", "2 hours", "24 hours", "0 hours"],
          answer: "2 hours",
          explain: "One hour per zone east.",
        }
      ],
    },
    {
      id: "us-time",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "How many time zones does the United States have?",
          choices: ["1", "2", "6", "24"],
          answer: "6",
          explain: "The U.S. has six time zones.",
        },
        {
          difficulty: "medium",
          type: "tf",
          prompt: "True or False:",
          text: "Larger countries often have many time zones.",
          choices: ["TRUE", "FALSE"],
          answer: "TRUE",
          explain: "Big countries can span many zones.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Time zone boundaries often follow __________ instead of only longitude lines.",
          choices: ["political boundaries", "only rivers", "only mountain tops", "only ocean waves"],
          answer: "political boundaries",
          explain: "They often follow political borders.",
        }
      ],
    },
    {
      id: "date-line",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "The International Date Line shows the boundary between one __________ and the next.",
          choices: ["day", "ocean", "continent", "school"],
          answer: "day",
          explain: "It marks where the day changes.",
        },
        {
          difficulty: "medium",
          type: "fill",
          prompt: "Tap the best word:",
          text: "The International Date Line is about halfway around the world from the __________.",
          choices: ["Equator", "Prime Meridian", "Arctic Circle", "Amazon"],
          answer: "Prime Meridian",
          explain: "It is opposite the Prime Meridian.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Why isn't the International Date Line perfectly straight?",
          choices: ["It follows political boundaries", "It is only drawn in pencil", "Oceans erase it each night", "It must match the Equator"],
          answer: "It follows political boundaries",
          explain: "It bends to follow political lines.",
        }
      ],
    },
    {
      id: "lat-long-absolute",
      variants: [
        {
          difficulty: "easy",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "We use latitude and longitude to find __________.",
          choices: ["absolute location", "only weather songs", "only animal homes", "only book titles"],
          answer: "absolute location",
          explain: "Lat/long find absolute location.",
        },
        {
          difficulty: "medium",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Longitude measures Earth's rotation in __________.",
          choices: ["colors", "degrees", "continents", "oceans only"],
          answer: "degrees",
          explain: "Longitude is measured in degrees.",
        },
        {
          difficulty: "hard",
          type: "mc",
          prompt: "Pick the best answer:",
          text: "Each degree of longitude has 60 minutes, and each minute has __________ seconds.",
          choices: ["10", "24", "60", "100"],
          answer: "60",
          explain: "60 seconds in each minute.",
        }
      ],
    }
  ],
    },
    9: {
      week: 9,
      unit: "Geography",
      title: "Natural Features and Landforms",
      guiding: "How do landforms influence movement and resources?",
      eyebrow: "California Studies Weekly · Week 9",
      tagline: "Unit: Geography · Mountains, valleys & natural features",
      lessons: [
        {
          emoji: "⛰️",
          badge: "Week 9 · Learning",
          title: "Natural Features and Landforms",
          body: [
            "This week we learn about Earth’s landforms.",
            "Mountains. Valleys. Deserts. Oceans.",
            "Big question:",
            "How do landforms influence movement and resources?",
          ],
          remember: "Landforms shape how people move and find resources.",
        },
        {
          emoji: "🌍",
          badge: "Natural features",
          title: "What Are Natural Features?",
          body: [
            "Natural features are parts of Earth’s surface.",
            "They are made in different ways.",
            "Earth’s surface is changing every day!",
          ],
          remember: "Natural features = parts of Earth’s surface.",
        },
        {
          emoji: "🌋",
          badge: "Change",
          title: "What Shapes the Land?",
          body: [
            "Wind, rain, and drought shape the land.",
            "Volcanoes and earthquakes shape it too.",
            "People name landforms by how the land forms.",
          ],
          remember: "Weather, volcanoes & earthquakes shape Earth.",
        },
        {
          emoji: "🗺️",
          badge: "Landforms",
          title: "Kinds of Natural Features",
          body: [
            "Mountains, valleys, deserts, and oceans are natural features.",
            "Each one looks different.",
            "Each one can help plants, animals, and people in different ways.",
          ],
          remember: "Mountains · valleys · deserts · oceans.",
        },
        {
          emoji: "🏔️",
          badge: "Mountains",
          title: "What Is a Mountain?",
          body: [
            "A mountain is land at least 1,968 feet taller than the land around it.",
            "Mountains have peaks on top and sloping sides.",
            "They can be sharp or rounded. They are on every continent — even under the ocean!",
          ],
          remember: "Mountain = tall land with a peak and sloping sides.",
        },
        {
          emoji: "⏳",
          badge: "Mountains",
          title: "How Mountains Form",
          body: [
            "Mountains take millions of years to form.",
            "They form from movement of Earth’s crust.",
            "Weather keeps shaping them over time.",
          ],
          remember: "Mountains form from Earth’s crust (takes a long time!).",
        },
        {
          emoji: "💎",
          badge: "Resources",
          title: "Mountain Resources",
          body: [
            "Rich minerals are found in mountains.",
            "Peaks are often covered in snow.",
            "When snow melts, water flows down as streams, creeks, and brooks.",
          ],
          remember: "Mountains give minerals and fresh water.",
        },
        {
          emoji: "🌲",
          badge: "Biomes",
          title: "Mountain Biomes",
          body: [
            "A biome is plants and animals living together.",
            "Tall mountains are colder — fewer plants up high.",
            "Lower slopes are warmer — more plants and more animal food and shelter.",
          ],
          remember: "Biome = plants + animals living together.",
        },
        {
          emoji: "🏞️",
          badge: "Valleys",
          title: "What Is a Valley?",
          body: [
            "A valley is a low area between mountains.",
            "Rivers or streams often make valleys.",
            "Valleys are usually “V”-shaped.",
          ],
          remember: "Valley = low land between mountains (often V-shaped).",
        },
        {
          emoji: "🌿",
          badge: "Resources",
          title: "Valley Resources",
          body: [
            "Valleys collect soil and plants washed down from mountains.",
            "The soil has nutrients that help plants grow.",
            "Mild weather helps plants and animals thrive.",
          ],
          remember: "Valleys have rich soil and mild weather.",
        },
        {
          emoji: "🦌",
          badge: "Compare",
          title: "Mountains vs Valleys",
          body: [
            "Mountains: tall, cold up high, minerals, snowmelt water.",
            "Valleys: low, sheltered, rich soil, rivers, homes for animals.",
            "Both are natural features that give resources!",
          ],
          remember: "Mountains = tall · Valleys = low between mountains.",
        },
        {
          emoji: "⭐",
          badge: "You did it!",
          title: "Ready, Landform Explorer!",
          body: [
            "You learned natural features, mountains, valleys, biomes, and resources!",
            "Pick Easy, Medium, or Hard for the quiz.",
            "Hit 90%+ to earn Roblox points!",
          ],
          remember: "Learn first. Then take the quiz.",
        },
      ],
      study: [
        {
          title: "Natural features",
          items: [
            "Natural features are parts of <strong>Earth’s surface</strong>.",
            "Wind, rain, drought, volcanoes, and earthquakes shape the land.",
            "Examples: <strong>mountains, valleys, deserts, and oceans</strong>.",
            "Guiding question: How do landforms influence <strong>movement and resources</strong>?",
          ],
        },
        {
          title: "Mountains",
          items: [
            "A mountain is at least <strong>1,968 feet</strong> taller than nearby land.",
            "Mountains have <strong>peaks</strong> and sloping sides.",
            "They form from movement of Earth’s <strong>crust</strong> (millions of years).",
            "Resources: <strong>minerals</strong> and meltwater → streams, creeks, brooks.",
            "A <strong>biome</strong> is plants and animals living together. Higher = colder / fewer plants.",
          ],
        },
        {
          title: "Valleys",
          items: [
            "A valley is a <strong>low area between mountains</strong>.",
            "Often made by a river/stream, or when mountains form close together.",
            "Usually <strong>V-shaped</strong>; they collect soil washed down from mountains.",
            "Resources: nutrient-rich soil, mild weather, shelter for animals, rivers from mountain streams.",
          ],
        },
      ],
      banks: [
        {
          id: "w9-natural-features",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Natural features are parts of __________.",
              choices: ["Earth’s surface", "Earth’s core only", "the atmosphere only", "the Moon’s shadow"],
              answer: "Earth’s surface",
              explain: "Natural features are parts of Earth’s surface.",
            },
            {
              difficulty: "medium",
              type: "fill",
              prompt: "Tap the best word:",
              text: "Mountains, valleys, deserts, and oceans are __________ features.",
              choices: ["natural", "human-made", "seasonal only", "underground only"],
              answer: "natural",
              explain: "They are natural features.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Which list are all natural features?",
              choices: [
                "Mountains, valleys, deserts, oceans",
                "Mountains, bridges, deserts, oceans",
                "Valleys, highways, deserts, dams",
                "Oceans, airports, valleys, tunnels",
              ],
              answer: "Mountains, valleys, deserts, oceans",
              explain: "Bridges, highways, dams, and airports are human-made.",
            },
          ],
        },
        {
          id: "w9-shape-earth",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Which can shape Earth’s surface?",
              choices: ["Wind and rain", "Only sunlight color", "Only map titles", "Only compass roses"],
              answer: "Wind and rain",
              explain: "Wind and rain help shape the land.",
            },
            {
              difficulty: "medium",
              type: "tf",
              prompt: "True or False:",
              text: "Volcanoes and earthquakes can shape Earth’s surface.",
              choices: ["TRUE", "FALSE"],
              answer: "TRUE",
              explain: "Yes — they change the land.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Earth’s surface is shaped by weather and by __________.",
              choices: [
                "volcanoes and earthquakes",
                "map borders and legends",
                "latitude and longitude lines",
                "city names and state capitals",
              ],
              answer: "volcanoes and earthquakes",
              explain: "Weather, volcanoes, and earthquakes change the land over time.",
            },
          ],
        },
        {
          id: "w9-guiding",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "This week’s big question is about landforms and __________.",
              choices: ["resources", "climates only", "map scales only", "compass directions only"],
              answer: "resources",
              explain: "How landforms influence movement and resources.",
            },
            {
              difficulty: "medium",
              type: "fill",
              prompt: "Tap the best word:",
              text: "Landforms can influence movement and __________.",
              choices: ["resources", "time zones", "map keys", "hemispheres"],
              answer: "resources",
              explain: "Landforms affect resources people and animals use.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "How can landforms influence movement and resources?",
              choices: [
                "They can make travel harder or easier and change what water, soil, or minerals are nearby",
                "They only change ocean tides and nothing else",
                "They only decide which way a river flows uphill",
                "They only rename deserts every year",
              ],
              answer:
                "They can make travel harder or easier and change what water, soil, or minerals are nearby",
              explain:
                "Landforms shape routes people and animals take and what resources are available.",
            },
          ],
        },
        {
          id: "w9-mountain-def",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "A mountain is __________ than the land around it.",
              choices: ["taller", "lower", "flatter", "wider only"],
              answer: "taller",
              explain: "Mountains rise high above nearby land.",
            },
            {
              difficulty: "medium",
              type: "fill",
              prompt: "Tap the best word:",
              text: "Mountains have __________ at the top with sloping sides.",
              choices: ["peaks", "valleys", "plains", "deltas"],
              answer: "peaks",
              explain: "Peaks are the tops of mountains.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "A mountain is land at least about __________ feet taller than the land around it.",
              choices: ["1,968", "500", "100", "10,000"],
              answer: "1,968",
              explain: "About 1,968 feet taller than nearby land.",
            },
          ],
        },
        {
          id: "w9-mountain-form",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Mountains form from movement of Earth’s __________.",
              choices: ["crust", "oceans", "clouds", "forests"],
              answer: "crust",
              explain: "Earth’s crust movement builds mountains.",
            },
            {
              difficulty: "medium",
              type: "tf",
              prompt: "True or False:",
              text: "Mountains form in just a few days.",
              choices: ["TRUE", "FALSE"],
              answer: "FALSE",
              explain: "They take millions of years.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "After mountains form, __________ keeps shaping them.",
              choices: ["weather", "mapmakers", "ocean tides alone", "valley soil alone"],
              answer: "weather",
              explain: "Weather shapes mountains over time.",
            },
          ],
        },
        {
          id: "w9-mountain-resources",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Melting mountain snow can make __________.",
              choices: ["streams", "deserts", "plateaus", "islands"],
              answer: "streams",
              explain: "Snowmelt flows down as streams and brooks.",
            },
            {
              difficulty: "medium",
              type: "fill",
              prompt: "Tap the best word:",
              text: "Rich __________ are found in the core of mountains.",
              choices: ["minerals", "fossils only", "clouds", "coral reefs"],
              answer: "minerals",
              explain: "Mountains can hold rich minerals.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Mountain snowmelt can send water down in streams, creeks, and __________.",
              choices: ["brooks", "glaciers", "aquifers", "estuaries"],
              answer: "brooks",
              explain: "Streams, creeks, and brooks carry meltwater downhill.",
            },
          ],
        },
        {
          id: "w9-biome",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "A biome is plants and animals __________.",
              choices: ["living together", "living only in deserts", "living only underwater", "living only on peaks"],
              answer: "living together",
              explain: "A biome is a living community.",
            },
            {
              difficulty: "medium",
              type: "tf",
              prompt: "True or False:",
              text: "Taller mountain tops are usually colder, with less plant life.",
              choices: ["TRUE", "FALSE"],
              answer: "TRUE",
              explain: "Cold high places have fewer plants.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Lower mountain slopes are warmer, so plant life __________.",
              choices: [
                "increases",
                "decreases because it is colder",
                "stays the same at every height",
                "moves only into valleys forever",
              ],
              answer: "increases",
              explain: "Warmer lower slopes support more plants (and more animal food/shelter).",
            },
          ],
        },
        {
          id: "w9-valley-def",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "A valley is a __________ area between mountains.",
              choices: ["low", "high peak", "flat desert", "deep ocean"],
              answer: "low",
              explain: "Valleys are low land between mountains.",
            },
            {
              difficulty: "medium",
              type: "fill",
              prompt: "Tap the best word:",
              text: "Valleys are usually __________-shaped.",
              choices: ["V", "U-only always", "circle", "square"],
              answer: "V",
              explain: "Valleys are often V-shaped.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "A valley can be created by a river or when two mountains form __________.",
              choices: [
                "close together",
                "far across an ocean",
                "under a desert only",
                "inside a volcano crater only",
              ],
              answer: "close together",
              explain: "Nearby mountains can leave a valley between them.",
            },
          ],
        },
        {
          id: "w9-valley-resources",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Valley soil helps __________ grow.",
              choices: ["plants", "glaciers", "mountain peaks", "ocean waves"],
              answer: "plants",
              explain: "Nutrient-rich soil helps plants.",
            },
            {
              difficulty: "medium",
              type: "tf",
              prompt: "True or False:",
              text: "Valleys often have mild weather where plants and animals thrive.",
              choices: ["TRUE", "FALSE"],
              answer: "TRUE",
              explain: "Mountains shelter valleys; weather is often mild.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Streams from mountains can form __________ in valleys.",
              choices: ["rivers", "deserts", "plateaus", "peninsulas"],
              answer: "rivers",
              explain: "Mountain streams feed valley rivers.",
            },
          ],
        },
        {
          id: "w9-compare",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Which is taller — a mountain or a valley?",
              choices: ["Mountain", "Valley", "They are always equal", "A desert is always taller"],
              answer: "Mountain",
              explain: "Mountains are high; valleys are low.",
            },
            {
              difficulty: "medium",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Which landform is a low area between mountains?",
              choices: ["Valley", "Mountain peak", "Plateau top", "Ocean trench"],
              answer: "Valley",
              explain: "A valley sits low between mountains.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Compared with mountain peaks, valleys are more likely to have __________.",
              choices: [
                "richer soil and milder weather for plants and animals",
                "colder air and almost no plant life",
                "only minerals and no water",
                "only snow and no soil",
              ],
              answer: "richer soil and milder weather for plants and animals",
              explain: "Valleys collect nutrient-rich soil and often have milder weather.",
            },
          ],
        },
        {
          id: "w9-where-mountains",
          variants: [
            {
              difficulty: "easy",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Mountains are found on __________.",
              choices: ["every continent", "only one continent", "only underwater", "only near deserts"],
              answer: "every continent",
              explain: "Mountains are on every continent.",
            },
            {
              difficulty: "medium",
              type: "tf",
              prompt: "True or False:",
              text: "Mountains can even be found under the ocean.",
              choices: ["TRUE", "FALSE"],
              answer: "TRUE",
              explain: "Yes — mountains exist underwater too.",
            },
            {
              difficulty: "hard",
              type: "mc",
              prompt: "Pick the best answer:",
              text: "Mountain shapes can be sharp or __________.",
              choices: ["rounded", "perfectly flat", "always V-shaped", "always underground"],
              answer: "rounded",
              explain: "Peaks can be sharp or rounded.",
            },
          ],
        },
      ],
    },
  };

  function getSsWeek() {
    return SS_CATALOG[ssWeekId] || SS_CATALOG[8];
  }

  // Back-compat aliases used by older reward logging
  const SS_WEEK = new Proxy(
    {},
    {
      get(_t, prop) {
        const w = getSsWeek();
        if (prop === "week") return w.week;
        if (prop === "title") return w.title;
        if (prop === "unit") return w.unit;
        if (prop === "guiding") return w.guiding;
        return w[prop];
      },
    }
  );

  function pickQuizQuestions(difficulty = ssQuizDifficulty) {
    const week = getSsWeek();
    const mode = SS_DIFFICULTIES.includes(difficulty)
      ? difficulty
      : difficulty === "easy"
        ? "easy2"
        : "medium";
    ssQuizDifficulty = mode;
    const contentDiff = ssContentDifficulty(mode);
    const sameSet = mode === "easy1";
    const picked = (week.banks || [])
      .map((bank) => {
        const variants = bank.variants || [];
        const pool = variants.filter((v) => (v.difficulty || "medium") === contentDiff);
        const use = pool.length ? pool : variants;
        if (!use.length) return null;
        // Easy 1: always the same question from each bank; other modes pick randomly
        const q = sameSet ? use[0] : use[Math.floor(Math.random() * use.length)];
        return { ...q, bankId: bank.id, difficulty: mode };
      })
      .filter(Boolean);
    // All modes shuffle order — Easy 1 keeps the same set, just mixed up
    shuffleInPlace(picked);
    return picked;
  }

  let ssSession = null;
  let ssLearnIndex = 0;

  function startSocialLearn() {
    ssLearnIndex = 0;
    showScreen("ss-learn");
    renderSocialLesson();
  }

  function renderSocialLesson() {
    const lesson = getSsWeek().lessons[ssLearnIndex];
    if (!lesson) return;
    const total = getSsWeek().lessons.length;
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
    if (ssLearnIndex >= getSsWeek().lessons.length - 1) {
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

  function startSocialQuiz(difficulty = ssQuizDifficulty) {
    setSsDifficulty(difficulty);
    const questions = pickQuizQuestions(ssQuizDifficulty);
    ssSession = {
      weekId: ssWeekId,
      difficulty: ssQuizDifficulty,
      questions,
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

  function ssQuestionsLeft() {
    if (!ssSession?.questions?.length) return 0;
    return Math.max(0, ssSession.questions.length - ssSession.index);
  }

  function updateSsProgressUi() {
    if (!ssSession) return;
    const total = ssSession.questions.length;
    const left = ssQuestionsLeft();
    const num = ssSession.index + 1;
    if (ssSession.intro) {
      $("ss-progress").textContent = `Quiz · ${total} questions`;
      if ($("ss-left")) $("ss-left").textContent = `${total} left`;
      return;
    }
    $("ss-progress").textContent = `Question ${num} of ${total}`;
    if ($("ss-left")) {
      $("ss-left").textContent = left === 1 ? "1 left" : `${left} left`;
      $("ss-left").hidden = false;
    }
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
    setSsDifficulty(ssSession?.difficulty || ssQuizDifficulty);
    $("ss-score").textContent = "0";
    updateSsProgressUi();
    const week = getSsWeek();
    const total = ssSession?.questions?.length || 0;
    const diff = ssSession?.difficulty || ssQuizDifficulty;
    const introBody = $("ss-quiz-intro-extra");
    if (introBody) {
      introBody.textContent =
        diff === "easy1"
          ? `Week ${week.week} · Easy 1 · ${total} questions. Same questions, mixed order each time.`
          : `Week ${week.week} · ${ssDiffLabel(diff)} · ${total} questions. They change each time you play!`;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function beginSocialQuizQuestions() {
    if (!ssSession) return;
    ssSession.intro = false;
    setQuizIntroMode(false);
    renderSocialQuestion();
  }

  function currentSsQuestion() {
    if (!ssSession?.questions?.length) return null;
    return ssSession.questions[ssSession.index] || null;
  }

  function renderSocialQuestion() {
    const q = currentSsQuestion();
    if (!q || !ssSession) return;
    ssSession.answered = false;
    ssSession.attemptsOnCurrent = 0;
    $("ss-quiz-card")?.classList.remove("ss-revealed");
    updateSsProgressUi();
    $("ss-score").textContent = String(ssSession.correct);
    const week = getSsWeek();
    const badge = $("ss-week-badge");
    if (badge) {
      badge.textContent = `Week ${week.week} · ${ssDiffLabel(ssSession.difficulty)} · ${week.title}`;
    }
    const goal = $("ss-quiz-goal-bar");
    if (goal) {
      goal.textContent = `Goal: 90%+ = 5 Roblox points · ${ssDiffLabel(ssSession.difficulty)}`;
    }
    $("ss-question-text").textContent = q.text;
    $("ss-prompt").textContent = `${q.prompt || ""} · 2 tries`;
    $("ss-feedback").textContent = "";
    $("ss-feedback").className = "feedback";
    const nextBtn = $("btn-ss-next");
    if (nextBtn) {
      nextBtn.hidden = true;
      nextBtn.textContent =
        ssSession.index + 1 >= ssSession.questions.length ? "See Results" : "Next";
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
      // Second-try success still needs another look soon
      if (ssSession.attemptsOnCurrent > 1) {
        const marker = q.text;
        const already = ssSession.questions.filter((item) => item._retryOf === marker).length;
        if (already < 2) {
          const clone =
            typeof structuredClone === "function"
              ? structuredClone(q)
              : JSON.parse(JSON.stringify(q));
          clone._retry = true;
          clone._retryOf = marker;
          const gap = retryGap(1, 2);
          const at = Math.min(ssSession.questions.length, ssSession.index + gap);
          ssSession.questions.splice(at, 0, clone);
        }
      }
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

    // After 2 misses: reveal the right answer clearly, then bring it back soon
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
    const marker = q.text;
    const already = ssSession.questions.filter((item) => item._retryOf === marker).length;
    if (already < 2) {
      const clone =
        typeof structuredClone === "function" ? structuredClone(q) : JSON.parse(JSON.stringify(q));
      clone._retry = true;
      clone._retryOf = marker;
      const gap = retryGap(1, 2);
      const at = Math.min(ssSession.questions.length, ssSession.index + gap);
      ssSession.questions.splice(at, 0, clone);
    }
    $("ss-feedback").innerHTML =
      `<strong>Right answer → ${q.answer}</strong><br>${q.explain}<br><em>We’ll ask this one again soon!</em>`;
    $("ss-feedback").className = "feedback ss-feedback-reveal";
    await playWrongSound();
    const nextBtn = $("btn-ss-next");
    if (nextBtn) nextBtn.hidden = false;
  }

  function advanceSocialQuiz() {
    if (!ssSession) return;
    if (ssSession.index + 1 >= ssSession.questions.length) {
      endSocialQuiz();
      return;
    }
    ssSession.index += 1;
    renderSocialQuestion();
  }

  function endSocialQuiz() {
    const total = ssSession.questions.length;
    const right = ssSession.correct;
    const pct = Math.round((right / total) * 100);
    const week = getSsWeek();
    const reward = maybeAwardRobloxPoints(pct, right, total, {
      week: week.week,
      title: `${week.title} · ${ssDiffLabel(ssSession?.difficulty || ssQuizDifficulty)}`,
    });

    $("ss-results-title").textContent =
      pct >= ROBLOX_PASS_PCT
        ? "Geographer Hero!"
        : pct >= 70
          ? "Nice Exploring!"
          : "Keep Studying!";
    $("ss-results-sub").textContent = `${week.title} · ${ssDiffLabel(ssSession?.difficulty || ssQuizDifficulty)} · ${right}/${total} correct (${pct}%)`;
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
    syncMdRangeInputs();
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
    if ($("mode")) {
      let mode = state.settings.mode || "10";
      const op = state.settings.operation || $("operation")?.value || "multiply";
      if (
        isRobloxSkill(op) &&
        !locksFixedTenMission(op) &&
        (mode === "endless" || mode === "timed" || !mode)
      ) {
        mode = "10";
        state.settings.mode = "10";
      }
      $("mode").value = mode;
    }
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
    if ($("subject")) $("subject").value = "math";
    syncSubjectUI();
    updateHeroAvatar();
  }

  function setSetupVisible(el, visible) {
    if (!el) return;
    el.hidden = !visible;
    el.style.display = visible ? "" : "none";
    el.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function getSubject() {
    return $("subject")?.value || "math";
  }

  function syncSubjectUI() {
    const subject = getSubject();
    const isMath = subject === "math";
    const isEnglish = subject === "english";
    const isSocial = subject === "social";
    const isArabic = subject === "arabic";
    setSetupVisible($("subject-math"), isMath);
    setSetupVisible($("subject-english"), isEnglish);
    setSetupVisible($("subject-social"), isSocial);
    setSetupVisible($("subject-arabic"), isArabic);
    const uploadPanel = $("week-upload-panel");
    if (uploadPanel) {
      setSetupVisible(uploadPanel, !!weekUpload.active && (isMath || isSocial));
    }
    const tag = $("home-tagline");
    if (tag) {
      if (isEnglish) tag.textContent = "Letters, spelling & easy words!";
      else if (isSocial) tag.textContent = "Learn California Studies Weekly!";
      else if (isArabic) tag.textContent = "Arabic letters & easy words!";
      else tag.textContent = "Power up your math skills!";
    }
    if (isMath) syncOperationUI();
  }

  /* ── Upload Week’s Work → save file + ask Cursor to build ── */
  const WEEK_UPLOAD_DB = "ali-week-upload-v1";
  const weekUpload = {
    active: false,
    subject: "social",
    week: null,
    fileName: "",
    dirHandle: null,
    pollTimer: null,
  };

  function parseWeekFromFileName(name) {
    const base = String(name || "");
    const patterns = [
      /week[_\s-]*0*(\d{1,2})/i,
      /\bw\s*0*(\d{1,2})\b/i,
      /\b0*(\d{1,2})\s*student/i,
    ];
    for (const re of patterns) {
      const m = base.match(re);
      if (m) {
        const n = Number(m[1]);
        if (n >= 1 && n <= 52) return n;
      }
    }
    return null;
  }

  function subjectLabelForUpload(subject) {
    return subject === "math" ? "Math" : "Social Studies";
  }

  function setWeekUploadProgress(pct, message, ready) {
    const fill = $("week-upload-bar-fill");
    const status = $("week-upload-status");
    const readyEl = $("week-upload-ready");
    const panel = $("week-upload-panel");
    if (panel) setSetupVisible(panel, true);
    weekUpload.active = true;
    if (status && message) status.textContent = message;
    if (fill) {
      const clamped = Math.max(0, Math.min(100, Number(pct) || 0));
      fill.style.width = `${clamped}%`;
      fill.classList.toggle("is-ready", !!ready || clamped >= 100);
    }
    if (readyEl) readyEl.hidden = !ready;
  }

  async function idbOpenWeekUpload() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(WEEK_UPLOAD_DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("handles")) db.createObjectStore("handles");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveDirHandle(handle) {
    const db = await idbOpenWeekUpload();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("handles", "readwrite");
      tx.objectStore("handles").put(handle, "week-uploads");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  async function loadDirHandle() {
    try {
      const db = await idbOpenWeekUpload();
      const handle = await new Promise((resolve, reject) => {
        const tx = db.transaction("handles", "readonly");
        const req = tx.objectStore("handles").get("week-uploads");
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
      db.close();
      return handle || null;
    } catch {
      return null;
    }
  }

  async function ensureWeekUploadsDir() {
    if (weekUpload.dirHandle) {
      try {
        const perm = await weekUpload.dirHandle.queryPermission({ mode: "readwrite" });
        if (perm === "granted") return weekUpload.dirHandle;
        const next = await weekUpload.dirHandle.requestPermission({ mode: "readwrite" });
        if (next === "granted") return weekUpload.dirHandle;
      } catch {
        /* fall through */
      }
    }
    const saved = await loadDirHandle();
    if (saved) {
      try {
        const perm = await saved.queryPermission({ mode: "readwrite" });
        if (perm === "granted" || (await saved.requestPermission({ mode: "readwrite" })) === "granted") {
          weekUpload.dirHandle = saved;
          return saved;
        }
      } catch {
        /* fall through */
      }
    }
    if (typeof window.showDirectoryPicker !== "function") return null;
    const handle = await window.showDirectoryPicker({
      id: "ali-week-uploads",
      mode: "readwrite",
      startIn: "documents",
    });
    weekUpload.dirHandle = handle;
    await saveDirHandle(handle);
    return handle;
  }

  async function writeUploadStatus(dir, payload) {
    const file = await dir.getFileHandle("status.json", { create: true });
    const writable = await file.createWritable();
    await writable.write(JSON.stringify(payload, null, 2));
    await writable.close();
  }

  async function readUploadStatus(dir) {
    try {
      const file = await dir.getFileHandle("status.json");
      const blob = await (await file.getFile()).text();
      return JSON.parse(blob);
    } catch {
      return null;
    }
  }

  function stopWeekUploadPoll() {
    if (weekUpload.pollTimer) {
      clearInterval(weekUpload.pollTimer);
      weekUpload.pollTimer = null;
    }
  }

  function startWeekUploadPoll(dir) {
    stopWeekUploadPoll();
    weekUpload.pollTimer = setInterval(async () => {
      const status = await readUploadStatus(dir);
      if (!status) return;
      const phase = String(status.phase || "");
      const progress = Number(status.progress);
      const message = status.message || "";
      if (phase === "ready" || progress >= 100) {
        setWeekUploadProgress(100, message || `Week ${weekUpload.week} ready`, true);
        stopWeekUploadPoll();
        return;
      }
      if (phase === "building" || phase === "uploaded" || phase === "reading") {
        setWeekUploadProgress(
          Number.isFinite(progress) ? progress : 15,
          message || `Building Week ${weekUpload.week}…`
        );
      }
    }, 2000);
  }

  function buildCursorWeekPrompt(subject, week, fileName) {
    const label = subjectLabelForUpload(subject);
    const pathHint = `week-uploads/${fileName}`;
    if (subject === "math") {
      return (
        `Build Math Week ${week} for the Ali Ayaan app from the uploaded file at ${pathHint}. ` +
        `Read the PDF, photos, or Word doc. Add practice content matching existing math patterns in app.js. ` +
        `Deploy (copy app.js → latest app-vN.js, bump index/go version, commit, push). ` +
        `While building, update week-uploads/status.json with phase (reading|building|ready), progress 0–100, and message. ` +
        `When live, set phase to "ready", progress 100, message "Week ${week} ready".`
      );
    }
    return (
      `Build Social Studies Week ${week} for the Ali Ayaan app from the uploaded file at ${pathHint}. ` +
      `Read the PDF, photos, or Word doc (Studies Weekly student edition). ` +
      `Add SS_CATALOG week ${week} with lessons + quiz banks like weeks 7–9, add the week card on the SS hub, deploy (copy app.js → latest app-vN.js, bump index/go version, commit, push). ` +
      `While building, update week-uploads/status.json with phase (reading|building|ready), progress 0–100, and message. ` +
      `When live, set phase to "ready", progress 100, message "Week ${week} ready".`
    );
  }

  function openCursorBuildPrompt(subject, week, fileName) {
    const text = buildCursorWeekPrompt(subject, week, fileName);
    const url = new URL("cursor://anysphere.cursor-deeplink/prompt");
    url.searchParams.set("text", text);
    url.searchParams.set("mode", "agent");
    try {
      window.location.href = url.toString();
    } catch {
      /* ignore */
    }
    // Fallback web link if protocol is blocked
    setTimeout(() => {
      const web = new URL("https://cursor.com/link/prompt");
      web.searchParams.set("text", text);
      // only used if user still needs it — keep as data attribute
      const status = $("week-upload-status");
      if (status) status.dataset.cursorLink = web.toString();
    }, 0);
  }

  function downloadFallback(file, safeName) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function handleWeekUploadFile(file, subject) {
    if (!file) return;
    const week = parseWeekFromFileName(file.name);
    if (!week) {
      setWeekUploadProgress(0, "Couldn’t find the week number in the file name. Use something like Week_9_….pdf", false);
      return;
    }
    weekUpload.subject = subject;
    weekUpload.week = week;
    weekUpload.fileName = file.name;
    const label = subjectLabelForUpload(subject);
    setWeekUploadProgress(8, `Uploaded · ${label} Week ${week}`, false);

    const safeName = file.name.replace(/[^\w.\- ()]/g, "_");
    let savedToFolder = false;
    try {
      setWeekUploadProgress(12, `Saving Week ${week}…`, false);
      const dir = await ensureWeekUploadsDir();
      if (dir) {
        const inbox = await dir.getDirectoryHandle("inbox", { create: true });
        const out = await inbox.getFileHandle(safeName, { create: true });
        const writable = await out.createWritable();
        await writable.write(file);
        await writable.close();
        weekUpload.fileName = `inbox/${safeName}`;
        await writeUploadStatus(dir, {
          phase: "uploaded",
          progress: 15,
          subject,
          week,
          file: weekUpload.fileName,
          message: `Uploaded · ${label} Week ${week}. Opening Cursor…`,
          updatedAt: new Date().toISOString(),
        });
        savedToFolder = true;
        setWeekUploadProgress(20, `Uploaded · ${label} Week ${week}. Opening Cursor…`, false);
        startWeekUploadPoll(dir);
      }
    } catch (err) {
      console.warn("week upload folder save failed", err);
    }

    if (!savedToFolder) {
      downloadFallback(file, safeName);
      setWeekUploadProgress(
        20,
        `Uploaded Week ${week} (saved to Downloads). Opening Cursor — pick the week-uploads folder next time for live progress.`,
        false
      );
    }

    openCursorBuildPrompt(subject, week, weekUpload.fileName);
    setWeekUploadProgress(
      25,
      `Building ${label} Week ${week}… Confirm the prompt in Cursor.`,
      false
    );
  }

  function beginWeekUpload(subject) {
    weekUpload.subject = subject || getSubject() || "social";
    const input = $("week-upload-input");
    if (!input) return;
    setWeekUploadProgress(0, "Choose a PDF, photo, or Word file.", false);
    const readyEl = $("week-upload-ready");
    if (readyEl) readyEl.hidden = true;
    input.value = "";
    input.click();
  }

  function syncOperationUI() {
    const op = $("operation")?.value || state.settings.operation || "multiply";
    const isMult = op === "multiply";
    const isDivide = op === "divide";
    const isMdMult = op === "md-mult";
    const isLongDiv = op === "long-div";
    const isPad = isPadPractice(op);
    const isRound = op === "round";
    const isAddSub = op === "add" || op === "sub";
    const kinderAddSub = isKinderGrade() && isAddSub;

    // Rounding / pad practice hide table chips
    // Kindergarten add/sub: show Easy / Medium finger-counting levels
    setSetupVisible($("difficulty-wrap"), isMult || isDivide || kinderAddSub);
    setSetupVisible($("table-picker"), isMult || isDivide);
    setSetupVisible($("digit-wrap"), isAddSub && !kinderAddSub);
    syncDifficultyOptions();
    setSetupVisible($("round-wrap"), isRound);
    setSetupVisible($("round-digits-wrap"), false);
    setSetupVisible($("md-wrap"), isMdMult);
    setSetupVisible($("long-div-wrap"), isLongDiv);
    const lockedTen = locksFixedTenMission(op);
    setSetupVisible($("problem-type-wrap"), !isRound && !isPad && !isDivide);
    // Show Roblox note whenever mission mode is visible (add / sub / multiply / divide)
    setSetupVisible($("mult-roblox-note"), !lockedTen && (isMult || isDivide || isAddSub));
    // In-order is for tables / divisor sets
    const inOrderRow = $("in-order")?.closest("label");
    setSetupVisible(inOrderRow, isMult || isDivide);
    const timedRow = $("per-question-timer")?.closest("label");
    setSetupVisible(timedRow, !lockedTen);
    const modeWrap = $("mode")?.closest("label");
    if (modeWrap) {
      setSetupVisible(modeWrap, !lockedTen);
    }
    if (isRound && $("in-order")) $("in-order").checked = false;
    if (lockedTen) {
      if ($("mode")) $("mode").value = "10";
      if ($("in-order")) $("in-order").checked = false;
      if ($("per-question-timer")) $("per-question-timer").checked = false;
      if (isMdMult) syncMdRangeInputs();
      if (isLongDiv) syncLongDivRangeInputs();
    } else if ((isMult || isDivide || isAddSub) && $("mode")) {
      // Nudge toward the Roblox-eligible 10-question round
      if ($("mode").value === "endless" || $("mode").value === "timed") {
        $("mode").value = "10";
      }
    }

    const tag = $("home-tagline");
    if (tag) {
      if (op === "add") tag.textContent = "Power up your addition!";
      else if (op === "sub") tag.textContent = "Power up your subtraction!";
      else if (op === "divide") tag.textContent = "Power up your division!";
      else if (op === "round") tag.textContent = "Power up your rounding!";
      else if (op === "md-mult") tag.textContent = "Practice multi-digit × single digit!";
      else if (op === "long-div") tag.textContent = "Practice long division!";
      else tag.textContent = "Power up your multiplication!";
    }

    updateProblemTypeOptions(op);
    syncAnswerEntryUI();
  }

  function updateProblemTypeOptions(operation) {
    const select = $("problem-type");
    if (!select) return;
    if (operation === "round" || isPadPractice(operation)) {
      select.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = "product";
      opt.textContent =
        operation === "md-mult"
          ? "Multi-digit × single digit = ?"
          : operation === "long-div"
            ? "Long division · quotient + remainder"
            : "Round to the nearest 10 or 100";
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
          : operation === "divide"
            ? { a: 35, b: 5, r: 7 }
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

  function isKinderGrade(gradeId = getGradeId()) {
    return gradeId === "k" || gradeId === "prek";
  }

  function kinderMathLevel(difficulty = state.settings.difficulty) {
    return String(difficulty || "easy") === "medium" ? "medium" : "easy";
  }

  function digitRange(digitLevel, gradeId = getGradeId(), difficulty) {
    // Kindergarten: Easy = one hand (+ a few), Medium = to 10
    if (isKinderGrade(gradeId)) {
      return kinderMathLevel(difficulty) === "medium"
        ? { min: 1, max: 10 }
        : { min: 1, max: 5 };
    }
    if (digitLevel === "dual") return { min: 10, max: 99 };
    if (gradeId === "1") return { min: 1, max: 20 };
    return { min: 1, max: 9 };
  }

  const MULT_DIFFICULTY_OPTIONS = [
    ["easy", "Easy · tables 1–5"],
    ["medium", "Medium · tables 1–10"],
    ["hard", "Hard · tables 1–12"],
    ["expert", "Expert · tables 1–15"],
  ];

  const DIV_DIFFICULTY_OPTIONS = [
    ["easy", "Easy · no remainders · up to 2 digits · ÷2–5 (answers to ×12)"],
    ["medium", "Medium · no remainders · up to 2 digits · ÷2–10 (answers to ×12)"],
    ["hard", "Hard · no remainders · up to 2 digits · ÷2–12 (answers to ×12)"],
    ["expert", "Expert · no remainders · up to 2 digits · ÷2–15 (answers to ×12)"],
  ];

  const KINDER_DIFFICULTY_OPTIONS = [
    ["easy", "Easy · one hand + a few fingers (to 5)"],
    ["medium", "Medium · numbers to 10"],
  ];

  function syncDifficultyOptions() {
    const select = $("difficulty");
    const label = $("difficulty-label");
    if (!select) return;
    const op = $("operation")?.value || state.settings.operation || "multiply";
    const isAddSub = op === "add" || op === "sub";
    const kinder = isKinderGrade() && isAddSub;
    const options = kinder
      ? KINDER_DIFFICULTY_OPTIONS
      : op === "divide"
        ? DIV_DIFFICULTY_OPTIONS
        : MULT_DIFFICULTY_OPTIONS;
    const previous = select.value || state.settings.difficulty || "easy";
    const allowed = new Set(options.map(([v]) => v));
    select.innerHTML = "";
    for (const [value, text] of options) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = text;
      select.appendChild(opt);
    }
    const next = allowed.has(previous) ? previous : "easy";
    select.value = next;
    state.settings.difficulty = next;
    if (label) label.textContent = kinder ? "Math level" : "Difficulty";
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
      const weight = fact.mastered ? 0.25 : Math.max(1, fact.weight);
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
      const weight = fact.mastered ? 0.25 : Math.max(1, fact.weight);
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

    if (operation === "divide") {
      // No remainders. Allow 2-digit dividends (e.g. 35 ÷ 5, 24 ÷ 2).
      // Quotient always stays within times tables 1–12 (never 2 × 13).
      const quotientMax = 12;
      const focus = (tables && tables.length ? tables : rangeTables(max))
        .map(Number)
        .filter((n) => n >= 2 && n <= max);
      for (const divisor of focus) {
        for (let q = 2; q <= quotientMax; q++) {
          const dividend = divisor * q;
          // Keep dividends at most 2 digits
          if (dividend >= 4 && dividend <= 99) pushPair(dividend, divisor);
        }
      }
      return pool;
    }

    const gid = gradeId || session?.grade || state.settings.grade || "2";
    const level =
      session?.difficulty ||
      state.settings.difficulty ||
      $("difficulty")?.value ||
      "easy";
    const { min, max: hi } = digitRange(digitLevel || "single", gid, level);
    // Easy K: answers stay countable on one hand + a few fingers (≤ 8)
    const sumCap =
      isKinderGrade(gid) && operation === "add"
        ? kinderMathLevel(level) === "easy"
          ? 8
          : 10
        : null;
    for (let a = min; a <= hi; a++) {
      for (let b = min; b <= hi; b++) {
        if (operation === "sub" && a < b) continue;
        if (sumCap != null && a + b > sumCap) continue;
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
      if (operation === "divide") {
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
      hint:
        operation === "divide"
          ? `${a} divided by ${b} — type or say the answer`
          : "Type it or tap 🎤 and say it",
    };
  }

  function startMission(opts) {
    stopTimer();
    stopQuestionTimer();
    const operation = opts.operation || "multiply";
    const isMdMult = operation === "md-mult";
    const isLongDiv = operation === "long-div";
    const isPad = isPadPractice(operation);
    const max = DIFFICULTY[opts.difficulty] || 10;
    const digitLevel = opts.digitLevel || "single";
    const roundPlace = opts.roundPlace || (operation === "round" ? "mix" : "10");
    const roundDigits = opts.roundDigits || "3";
    const mdRange = {
      mdBigMin: clampInt(opts.mdBigMin, 10, 9999, 10),
      mdBigMax: clampInt(opts.mdBigMax, 10, 9999, 99),
      mdSmallMin: clampInt(opts.mdSmallMin, 1, 9, 2),
      mdSmallMax: clampInt(opts.mdSmallMax, 1, 9, 9),
    };
    if (mdRange.mdBigMax < mdRange.mdBigMin) {
      [mdRange.mdBigMin, mdRange.mdBigMax] = [mdRange.mdBigMax, mdRange.mdBigMin];
    }
    if (mdRange.mdSmallMax < mdRange.mdSmallMin) {
      [mdRange.mdSmallMin, mdRange.mdSmallMax] = [mdRange.mdSmallMax, mdRange.mdSmallMin];
    }
    const ldRange = {
      ldDivMin: clampInt(opts.ldDivMin, 10, 9999, 10),
      ldDivMax: clampInt(opts.ldDivMax, 10, 9999, 99),
      ldByMin: clampInt(opts.ldByMin, 2, 9, 2),
      ldByMax: clampInt(opts.ldByMax, 2, 9, 9),
    };
    if (ldRange.ldDivMax < ldRange.ldDivMin) {
      [ldRange.ldDivMin, ldRange.ldDivMax] = [ldRange.ldDivMax, ldRange.ldDivMin];
    }
    if (ldRange.ldByMax < ldRange.ldByMin) {
      [ldRange.ldByMin, ldRange.ldByMax] = [ldRange.ldByMax, ldRange.ldByMin];
    }
    let tables = (opts.tables || [])
      .map(Number)
      .filter((n) => n >= 1 && n <= max)
      .sort((x, y) => x - y);
    if (!tables.length) tables = rangeTables(max);
    const lockedTen = locksFixedTenMission(operation);
    const problemType =
      operation === "round" || isPad ? "product" : opts.problemType || "product";
    // Pad practice + rounding always shuffle
    const shuffle = operation === "round" || isPad ? true : !!opts.shuffle;
    const perQuestionTimer = lockedTen ? false : !!opts.perQuestionTimer;
    const mode = lockedTen ? "10" : opts.mode;
    const grade = opts.grade && GRADE_PROFILES[opts.grade] ? opts.grade : getGradeId();
    const queue =
      shuffle || isPad
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
      mdRange,
      ldRange,
      mode,
      shuffle,
      perQuestionTimer,
      tables,
      problemType,
      max,
      queue,
      queueIndex: 0,
      retrySoon: [],
      asked: 0,
      target: mode === "10" || mode === "20" ? Number(mode) : null,
      correct: 0,
      firstTryCorrect: 0,
      attemptsOnCurrent: 0,
      sessionStars: 0,
      current: null,
      ended: false,
      waitingNext: false,
      workShown: false,
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
      mode,
      shuffle: isPad || operation === "round" ? true : opts.shuffle,
      voiceMode: !!opts.voiceMode,
      perQuestionTimer,
      tables,
      problemType,
      ...mdRange,
      ...ldRange,
    };
    saveState();

    $("play-stars").textContent = "0";
    $("live-streak").textContent = String(state.streak);
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    setVoiceStatus("");
    resetHelpWork();
    setWorkPadVisible(isPad);
    setLongDivAnswerUI(isLongDiv);
    document.body.classList.toggle("ld-work-mode", isLongDiv);
    syncAnswerEntryUI();
    updateHeroAvatar();
    $("hero-cheer").textContent = isPad
      ? isLongDiv
        ? "Write the long division, then type the answer!"
        : "Show your work, then type the answer!"
      : operation === "round"
        ? "Round it — 90% first-try earns Roblox pts!"
        : CHEERS[Math.floor(Math.random() * CHEERS.length)];

    const timerEl = $("play-timer");
    if (mode === "timed" && !perQuestionTimer) {
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
    fact.weight = Math.min(24, fact.weight + 8);
    fact.correctStreak = 0;
    fact.wrongs += 1;
    fact.mastered = false;
    scheduleMathRetry(retryGap());
    state.totalAttempts += 1;
    saveState();

    window.setTimeout(() => {
      if (session && !session.ended) nextQuestion();
    }, 650);
  }

  function nextQuestion() {
    if (!session || session.ended) return;
    stopQuestionTimer();

    // Fixed rounds (10 / 20): keep going until that many are answered correctly
    if (session.target != null && session.correct >= session.target) {
      endMission("Mission complete!");
      return;
    }

    const isMdMult = session.operation === "md-mult";
    const isLongDiv = session.operation === "long-div";
    const isPad = isPadPractice(session.operation);
    const opForMath = isMdMult ? "multiply" : session.operation;
    // Missed problems come back soon until mastered
    const retryPick = takeDueMathRetry();
    const picked = retryPick
      ? retryPick
      : isMdMult
        ? randomMdMultPair(session.mdRange || state.settings)
        : isLongDiv
          ? randomLongDivPair(session.ldRange || state.settings)
          : pickQuestion(
              session.operation,
              session.max,
              session.shuffle,
              session.tables,
              session.digitLevel,
              session.roundPlace,
              session.roundDigits
            );
    const promptType = isPad
      ? "product"
      : choosePromptType(session.problemType, picked.a, picked.b, session.operation);

    let expected;
    let display;
    let hint;
    let remainder = 0;
    if (isLongDiv) {
      const dividend = Number(picked.dividend ?? picked.a);
      const divisor = Number(picked.divisor ?? picked.b);
      if (Number.isFinite(Number(picked.expected))) {
        expected = Number(picked.expected);
        remainder = Number(picked.remainder) || 0;
      } else {
        expected = Math.floor(dividend / divisor);
        remainder = dividend % divisor;
      }
      picked.dividend = dividend;
      picked.divisor = divisor;
      picked.a = dividend;
      picked.b = divisor;
      display = `${dividend} ÷ ${divisor} = ?`;
      hint = "Write the long division, then type quotient and R!";
    } else {
      const formatted = formatProblem(picked.a, picked.b, promptType, opForMath);
      expected = Number(formatted.expected);
      display = formatted.display;
      hint = isMdMult
        ? "Write your work below, then type the answer and hit POW!"
        : formatted.hint;
    }

    session.current = {
      ...picked,
      a: Number(picked.a),
      b: Number(picked.b),
      promptType,
      expected,
      remainder,
      display,
      hint,
    };
    session.attemptsOnCurrent = 0;
    session.accepting = true;
    session.waitingNext = false;
    session.workShown = false;
    session.asked += 1;

    const problemEl = $("problem-text");
    if (isLongDiv) {
      problemEl.innerHTML = longDivisionDisplayHtml(
        session.current.dividend ?? session.current.a,
        session.current.divisor ?? session.current.b
      );
    } else {
      problemEl.textContent = session.current.display;
    }
    problemEl.classList.toggle("equation", session.operation !== "round" && !isLongDiv);
    problemEl.classList.toggle("round-prompt", session.operation === "round");
    problemEl.classList.toggle("md-prompt", isMdMult);
    problemEl.classList.toggle("ld-prompt", isLongDiv);
    const hintEl = $("problem-hint");
    if (hintEl) {
      if (isLongDiv) {
        hintEl.textContent = "Write in the box · type quotient and remainder (R 0 if none)!";
      } else if (isMdMult) {
        hintEl.textContent = "Write your work in the big box, then type the answer!";
      } else if (session.operation === "round") {
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
    if ($("answer-rem")) $("answer-rem").value = "";
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("problem-card").classList.remove("shake", "pop");
    resetHelpWork();
    setLongDivAnswerUI(isLongDiv);
    setPowLabel("POW!");
    stopListening();
    setVoiceStatus("");
    maybeAutoListen();
    startQuestionTimer();

    if (session.target != null) {
      const need = Math.max(0, session.target - session.correct);
      $("play-progress").textContent =
        `${session.correct}/${session.target} right` +
        (need > 0 ? ` · Q ${session.asked}` : "");
    } else if (session.mode === "timed") {
      $("play-progress").textContent = `Solved ${session.correct}`;
    } else {
      $("play-progress").textContent = `Q ${session.asked}`;
    }

    if ($("btn-mic")) {
      $("btn-mic").hidden = isPad;
      $("btn-mic").style.display = isPad ? "none" : "";
    }

    if (isPad) clearWorkPad();
    syncAnswerEntryUI();
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

    const canOfferHelp =
      session.operation === "long-div" &&
      session.attemptsOnCurrent >= 2 &&
      !session.workShown;

    if (canOfferHelp) {
      $("feedback").textContent = "Not yet — try again, or show the work & answer.";
      $("hero-cheer").textContent = "It’s okay — peek at the steps!";
      offerShowWork();
    } else {
      $("feedback").textContent = "Not yet — try again!";
      $("hero-cheer").textContent = "Shake it off. Stay on this one!";
    }
    $("feedback").className = "feedback wrong";

    state.streak = 0;
    $("live-streak").textContent = "0";

    const fact = ensureFact(session.current.key);
    if (session.attemptsOnCurrent === 1) {
      fact.weight = Math.min(24, fact.weight + 8);
      fact.correctStreak = 0;
      fact.wrongs += 1;
      fact.mastered = false;
      // After he eventually gets it right, bring it back later in the mix
      scheduleMathRetry(retryGap(RETRY_GAP_MIN, RETRY_GAP_MAX));
    } else {
      fact.weight = Math.min(24, fact.weight + 2);
      scheduleMathRetry(retryGap(RETRY_GAP_MIN, RETRY_GAP_MAX));
    }
    state.totalAttempts += 1;
    saveState();

    // Stay on this question until he gets it right
    session.accepting = true;
    maybeAutoListen();
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
      fact.weight = 0.25;
      clearMathRetry(session.current.key);
    } else if (firstTry) {
      clearMathRetry(session.current.key);
      fact.weight = Math.max(fact.wrongs > 0 ? 2 : 1, fact.weight - 0.5);
    } else {
      // Missed first, then got it — keep a later re-ask mixed into the round
      fact.weight = Math.max(2, fact.weight - 0.5);
      scheduleMathRetry(RETRY_AFTER_HIT_GAP, session.current);
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
        : session.operation === "long-div"
          ? `${session.current.a} ÷ ${session.current.b} mastered!`
          : session.operation === "divide"
            ? `${session.current.a} ÷ ${session.current.b} mastered!`
            : `${session.current.a}${opSymbol(session.operation)}${session.current.b} mastered!`
      : CHEERS[Math.floor(Math.random() * CHEERS.length)];

    const card = $("problem-card");
    card.classList.remove("pop");
    void card.offsetWidth;
    card.classList.add("pop");
    burstStars();

    // Auto-advance after a short cheer — no NEXT! tap needed
    session.waitingNext = true;
    setPowLabel("POW!");
    const powBtn = $("btn-pow");
    if (powBtn) powBtn.disabled = true;
    window.setTimeout(() => {
      if (!session || session.ended || !session.waitingNext) return;
      session.waitingNext = false;
      if (powBtn) powBtn.disabled = false;
      nextQuestion();
    }, session.perQuestionTimer ? 500 : 700);
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
    setWorkPadVisible(false);
    state.missionsCompleted += 1;
    unlockRewards();

    const totalQ = Math.max(1, session.correct);
    const firstTry = session.firstTryCorrect;
    const accuracy = Math.round((firstTry / totalQ) * 100);

    let reward = null;
    const robloxDone =
      isRobloxSkill(session.operation) &&
      session.target &&
      session.correct >= session.target;
    if (robloxDone) {
      reward = maybeAwardRobloxPoints(accuracy, firstTry, totalQ, {
        week: "math",
        title: robloxSkillTitle(session.operation),
      });
    }

    saveState();
    setVoiceStatus("");
    document.body.classList.remove("ld-work-mode");
    setLongDivAnswerUI(false);
    resetHelpWork();

    $("results-title").textContent = title;
    $("results-sub").textContent =
      session.target && isRobloxSkill(session.operation)
        ? `${CHILD} finished ${robloxSkillTitle(session.operation).toLowerCase()} · ${accuracy}% first-try`
        : `${CHILD} powered through another mission.`;

    $("results-grid").innerHTML = `
      <div class="stat-card"><strong>${session.sessionStars}</strong>stars earned</div>
      <div class="stat-card"><strong>${session.correct}</strong>solved</div>
      <div class="stat-card"><strong>${session.firstTryCorrect}</strong>first-try hits</div>
      <div class="stat-card"><strong>${accuracy}%</strong>first-try score</div>
      ${
        isRobloxSkill(session.operation)
          ? `<div class="stat-card"><strong data-roblox-points>${getRobloxPoints()}</strong>Roblox pts</div>`
          : `<div class="stat-card"><strong>${state.bestStreak}</strong>best streak</div>`
      }
    `;

    let rewardEl = $("math-reward-box");
    if (!rewardEl) {
      rewardEl = document.createElement("div");
      rewardEl.id = "math-reward-box";
      rewardEl.className = "ss-reward-box";
      $("results-grid")?.insertAdjacentElement("afterend", rewardEl);
    }
    if (isRobloxSkill(session.operation) && reward) {
      rewardEl.hidden = false;
      if (reward.awarded) {
        rewardEl.className = "ss-reward-box won";
        rewardEl.innerHTML = `
          <p class="ss-reward-emoji">🧱</p>
          <p class="ss-reward-title">You earned ${reward.points} Roblox points!</p>
          <p>First-try score ${accuracy}% (need ${ROBLOX_PASS_PCT}%+). Bank: <strong>${reward.total}</strong></p>
        `;
      } else if (accuracy >= ROBLOX_PASS_PCT && reward.already) {
        rewardEl.className = "ss-reward-box ok";
        rewardEl.innerHTML = `<p class="ss-reward-title">Great score — ${accuracy}%!</p><p>${reward.reason}</p>`;
      } else {
        rewardEl.className = "ss-reward-box miss";
        rewardEl.innerHTML = `
          <p class="ss-reward-title">Roblox points: not yet</p>
          <p>Get <strong>${ROBLOX_PASS_PCT}%</strong> first-try (9 of 10) to earn <strong>${ROBLOX_REWARD_POINTS}</strong> pts.</p>
          <p>You got ${firstTry}/${totalQ} first-try (${accuracy}%).</p>
        `;
      }
    } else if (rewardEl) {
      rewardEl.hidden = true;
      rewardEl.innerHTML = "";
    }

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
          Earn ${ROBLOX_REWARD_POINTS} pts for English, Social Studies, or math practice at ${ROBLOX_PASS_PCT}%+ (first-try). Buy the bank at week’s end, then clear.
        </p>
        ${robloxLogHtml}
        <button type="button" class="btn secondary" id="btn-clear-roblox" style="margin-top:0.75rem;width:100%">
          Reset Roblox to 0
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
          Missed problems come back again soon until mastered (${MASTERY_STREAK} correct in a row).
          Wrong answers must be retried until correct (no hint).
        </p>
      </div>
    `;
    $("btn-clear-roblox")?.addEventListener("click", clearRobloxBank);
  }

  function submitAnswer(guess, remGuess) {
    if (!session || session.ended || !session.current) return;
    if (session.waitingNext) return;
    if (session.accepting === false) return;

    guess = Number(guess);
    if (!Number.isFinite(guess)) return;

    const expected = Number(session.current.expected);
    session.attemptsOnCurrent += 1;

    let ok = guess === expected;
    if (session.operation === "long-div") {
      const remExpected = Number(session.current.remainder) || 0;
      const rem = Number(remGuess);
      const remOk = Number.isFinite(rem) && rem === remExpected;
      ok = ok && remOk;
    }

    if (ok) onCorrect();
    else {
      onWrong();
      $("answer").value = "";
      if ($("answer-rem")) $("answer-rem").value = "";
    }
  }

  // Events
  $("setup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const subject = getSubject();
    pokeAudio();
    if (subject === "english") {
      showScreen("english");
      return;
    }
    if (subject === "social") {
      if (!gradeAllowsSocial()) {
        if ($("subject")) $("subject").value = "math";
        syncSubjectUI();
        return;
      }
      showScreen("social");
      return;
    }
    if (subject === "arabic") {
      showScreen("arabic");
      return;
    }

    const operation = $("operation")?.value || "multiply";
    const tables =
      operation === "multiply" || operation === "divide"
        ? getSelectedTables()
        : state.settings.tables || rangeTables(10);
    if (operation === "multiply" && !tables.length) {
      alert("Pick at least one times table (like 2× or 7×).");
      return;
    }
    if (operation === "divide" && !tables.filter((n) => Number(n) >= 2).length) {
      alert("Pick at least one divisor table (like ÷2 or ÷5).");
      return;
    }
    const mdRange = operation === "md-mult" ? readMdRangeSettings() : {};
    if (operation === "md-mult") {
      syncMdRangeInputs({ ...state.settings, ...mdRange });
    }
    const ldRange = operation === "long-div" ? readLongDivRangeSettings() : {};
    if (operation === "long-div") {
      syncLongDivRangeInputs({ ...state.settings, ...ldRange });
    }
    const voiceOn = !!$("voice-mode")?.checked;
    const padOp = isPadPractice(operation);
    const lockedTen = locksFixedTenMission(operation);
    if (voiceOn && speechSupported() && !padOp) {
      await ensureMicAccess();
    }
    startMission({
      grade: $("grade")?.value || state.settings.grade || "2",
      operation,
      difficulty: $("difficulty")?.value || "medium",
      digitLevel: $("digit-level")?.value || "single",
      ...readRoundSettings(),
      ...mdRange,
      ...ldRange,
      mode: lockedTen ? "10" : $("mode")?.value || "10",
      shuffle: padOp || operation === "round" ? true : readShuffleSetting(),
      voiceMode: padOp ? false : voiceOn,
      perQuestionTimer: lockedTen ? false : !!$("per-question-timer")?.checked,
      tables,
      problemType: $("problem-type")?.value || "product",
    });
  });

  $("subject")?.addEventListener("change", () => {
    syncSubjectUI();
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
    state.settings.difficulty = $("difficulty").value || "easy";
    const max = currentMax();
    state.settings.tables = getSelectedTables().filter((n) => n <= max);
    if (!state.settings.tables.length) state.settings.tables = rangeTables(max);
    renderTableChips();
    saveState();
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

    // Correct answers auto-advance — ignore taps while cheering
    if (session.waitingNext || session.accepting === false) return;

    const raw = normalizeAnswerField($("answer"));
    if (!raw) {
      $("feedback").textContent =
        session.operation === "long-div"
          ? "Type the quotient (and R), then hit POW!"
          : "Say or type a number, then hit POW!";
      $("feedback").className = "feedback wrong";
      return;
    }

    let remGuess = 0;
    if (session.operation === "long-div") {
      const cleaned = normalizeAnswerField($("answer-rem"));
      if (cleaned === "" && String($("answer-rem")?.value || "").trim() === "") {
        remGuess = 0;
      } else if (cleaned === "") {
        $("feedback").textContent = "Type a remainder number (or 0), then POW!";
        $("feedback").className = "feedback wrong";
        return;
      } else {
        remGuess = Number(cleaned);
      }
    }

    await unlockAudio();
    submitAnswer(Number(raw), remGuess);
  });

  const bindDigitNormalize = (el) => {
    if (!el) return;
    const run = () => normalizeAnswerField(el);
    el.addEventListener("input", run);
    el.addEventListener("blur", run);
    el.addEventListener("change", run);
  };
  bindDigitNormalize($("answer"));
  bindDigitNormalize($("answer-rem"));

  $("btn-keyboard")?.addEventListener("click", () => {
    if (session?.waitingNext) return;
    if (answerKeyboardWanted && document.activeElement === $("answer")) {
      // Toggle off — back to Pencil-only
      focusAnswer();
      setVoiceStatus("Keyboard hidden — write with Pencil or tap Keyboard");
      return;
    }
    openAnswerKeyboard();
    setVoiceStatus("Keyboard on — type your answer");
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

  $("btn-show-work")?.addEventListener("click", () => {
    if (!session || session.ended || session.operation !== "long-div") return;
    revealLongDivisionWork();
  });

  function leavePlayMission() {
    if (!session || session.ended) {
      showScreen("home");
      return;
    }
    if (confirm("Go back to Home Base?")) {
      endMission("Mission paused");
    }
  }

  $("btn-play-back")?.addEventListener("click", () => leavePlayMission());
  $("btn-quit").addEventListener("click", () => leavePlayMission());

  $("btn-again").addEventListener("click", () => {
    startMission({
      grade: state.settings.grade || "2",
      operation: state.settings.operation || "multiply",
      difficulty: state.settings.difficulty,
      digitLevel: state.settings.digitLevel || "single",
      roundPlace: state.settings.roundPlace || "10",
      roundDigits: state.settings.roundDigits || "3",
      mdBigMin: state.settings.mdBigMin,
      mdBigMax: state.settings.mdBigMax,
      mdSmallMin: state.settings.mdSmallMin,
      mdSmallMax: state.settings.mdSmallMax,
      ldDivMin: state.settings.ldDivMin,
      ldDivMax: state.settings.ldDivMax,
      ldByMin: state.settings.ldByMin,
      ldByMax: state.settings.ldByMax,
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
    const keepRoblox = {
      robloxPoints: getRobloxPoints(),
      robloxLog: Array.isArray(state.robloxLog) ? state.robloxLog : [],
      robloxLastAwardDay: state.robloxLastAwardDay || "",
    };
    state = { ...defaultState(), ...keepRoblox };
    mergeRobloxFromStores(state);
    saveState();
    renderParent();
    renderHome();
    showScreen("home");
  }

  $("btn-reset-roblox")?.addEventListener("click", clearRobloxBank);
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

  $("btn-ar-letters")?.addEventListener("click", () => {
    pokeAudio();
    startArPractice("letters");
  });
  $("btn-ar-flash")?.addEventListener("click", () => {
    pokeAudio();
    startArPractice("flash");
  });
  $("btn-ar-words")?.addEventListener("click", () => {
    pokeAudio();
    startArPractice("words");
  });
  $("btn-ar-hear")?.addEventListener("click", () => {
    const q = arCurrent();
    if (q?.speak) speakArabic(q.speak);
  });
  $("ar-flash-card")?.addEventListener("click", () => flipArFlashCard());
  $("ar-write-form")?.addEventListener("submit", (e) => submitArWrite(e));
  $("btn-ar-got-it")?.addEventListener("click", () => finishArWriteSelfCheck(true));
  $("btn-ar-missed")?.addEventListener("click", () => finishArWriteSelfCheck(false));
  $("btn-ar-quit")?.addEventListener("click", () => {
    if (!arSession) {
      showScreen("arabic");
      return;
    }
    if (confirm("Quit Arabic practice?")) {
      arSession = null;
      showScreen("arabic");
    }
  });
  $("btn-ar-next")?.addEventListener("click", () => {
    if (arSession?.mode === "flash") {
      if (arSession.flashRevealed) {
        arSession.correct += 1;
        arSession.firstTryCorrect += 1;
        if ($("ar-stars")) $("ar-stars").textContent = String(arSession.correct);
      }
      advanceArQuestion();
      return;
    }
    advanceArQuestion();
  });
  $("btn-ar-again")?.addEventListener("click", () => {
    pokeAudio();
    startArPractice(arLastMode || "letters");
  });

  $("btn-eng-alphabet")?.addEventListener("click", () => {
    pokeAudio();
    startEngPractice("alphabet");
  });

  $("btn-eng-prek-spell")?.addEventListener("click", () => {
    pokeAudio();
    startEngPractice("prek-spell");
  });

  $("btn-eng-spell")?.addEventListener("click", () => {
    pokeAudio();
    startEngPractice("spell");
  });

  $("btn-eng-spell-pow")?.addEventListener("click", () => {
    pokeAudio();
    submitPrekSpell();
  });

  $("btn-eng-spell-clear")?.addEventListener("click", () => {
    clearPrekSpellBoard();
  });

  $("btn-eng-pen")?.addEventListener("click", () => {
    pokeAudio();
    startEngPractice("pen");
  });

  $("btn-eng-words")?.addEventListener("click", () => {
    pokeAudio();
    startEngPractice("words");
  });

  $("btn-eng-hear")?.addEventListener("click", () => {
    const q = engCurrent();
    const word = q?.target || q?.word;
    if (word) speakEngWord(word);
  });

  $("btn-eng-quit")?.addEventListener("click", () => {
    if (!engSession) {
      showScreen("english");
      return;
    }
    if (confirm("Quit English practice?")) {
      engSession = null;
      showScreen("english");
    }
  });

  $("eng-word-form")?.addEventListener("submit", (e) => {
    submitEasyWord(e);
  });

  $("eng-easy-form")?.addEventListener("submit", (e) => {
    submitEasyWord(e);
  });

  $("btn-eng-easy-clear")?.addEventListener("click", () => {
    const input = $("eng-easy-input");
    if (!input || input.disabled) return;
    input.value = "";
    updateEasySeen(true);
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
  });

  $("eng-easy-input")?.addEventListener("input", () => updateEasySeen());
  $("eng-easy-input")?.addEventListener("keyup", () => updateEasySeen());
  $("eng-easy-input")?.addEventListener("change", () => updateEasySeen(true));

  $("eng-pen-form")?.addEventListener("submit", (e) => {
    submitEngPen(e);
  });

  $("btn-eng-clear-pad")?.addEventListener("click", () => clearEngWritePad());

  $("btn-eng-pen-clear")?.addEventListener("click", () => {
    const input = $("eng-pen-input");
    if (!input || input.disabled) return;
    input.value = "";
    setEngPenKeyboard(false);
  });

  $("btn-eng-pen-keyboard")?.addEventListener("click", () => {
    const btn = $("btn-eng-pen-keyboard");
    const on = !btn?.classList.contains("keyboard-on");
    setEngPenKeyboard(on);
  });

  $("btn-eng-next")?.addEventListener("click", () => advanceEngQuestion());

  $("btn-eng-again")?.addEventListener("click", () => {
    pokeAudio();
    startEngPractice(engLastMode || "alphabet");
  });

  document.querySelectorAll("[data-upload-subject]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      pokeAudio();
      beginWeekUpload(btn.getAttribute("data-upload-subject") || getSubject());
    });
  });

  $("week-upload-input")?.addEventListener("change", async () => {
    const input = $("week-upload-input");
    const file = input?.files?.[0];
    if (!file) return;
    await handleWeekUploadFile(file, weekUpload.subject || getSubject());
  });

  document.querySelectorAll("[data-ss-week]").forEach((btn) => {
    btn.addEventListener("click", () => {
      pokeAudio();
      openSsWeek(btn.getAttribute("data-ss-week"));
    });
  });

  document.querySelectorAll("[data-ss-diff]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const diff = btn.getAttribute("data-ss-diff");
      setSsDifficulty(diff);
      if (ssSession?.intro) {
        ssSession.difficulty = ssQuizDifficulty;
        ssSession.questions = pickQuizQuestions(ssQuizDifficulty);
        ssSession.index = 0;
        ssSession.correct = 0;
        ssSession.misses = [];
        renderSocialQuizIntro();
      }
    });
  });

  $("btn-ss-learn")?.addEventListener("click", () => {
    pokeAudio();
    startSocialLearn();
  });

  $("btn-ss-quiz")?.addEventListener("click", () => {
    pokeAudio();
    startSocialQuiz(ssQuizDifficulty);
  });

  $("btn-ss-study-jump")?.addEventListener("click", () => {
    $("ss-study")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("btn-ss-learn-quit")?.addEventListener("click", () => {
    if (confirm("Leave Learning and go back?")) showScreen("ss-hub");
  });

  $("btn-ss-learn-back")?.addEventListener("click", () => advanceSocialLearn(-1));

  $("btn-ss-learn-next")?.addEventListener("click", () => {
    if (ssLearnIndex >= getSsWeek().lessons.length - 1) pokeAudio();
    advanceSocialLearn(1);
  });

  $("btn-ss-quit")?.addEventListener("click", () => {
    if (!ssSession) {
      showScreen("ss-hub");
      return;
    }
    if (confirm("Quit this Social Studies assessment?")) {
      ssSession = null;
      showScreen("ss-hub");
    }
  });

  $("btn-ss-quiz-go")?.addEventListener("click", () => {
    pokeAudio();
    if (ssSession?.intro) {
      ssSession.difficulty = ssQuizDifficulty;
      ssSession.questions = pickQuizQuestions(ssQuizDifficulty);
      ssSession.index = 0;
      ssSession.correct = 0;
      ssSession.misses = [];
    }
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

  // Keep answer above keyboard without jumping the page to center
  $("answer").addEventListener("focus", () => {
    if (!answerKeyboardWanted && !usesKeyboardOnlyAnswer()) return;
    window.setTimeout(ensureAnswerVisible, 120);
    window.setTimeout(ensureAnswerVisible, 320);
  });

  const onViewportFit = () => syncPlayViewportFit();
  window.addEventListener("resize", onViewportFit);
  window.addEventListener("orientationchange", () => {
    window.setTimeout(onViewportFit, 100);
    window.setTimeout(ensureAnswerVisible, 350);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onViewportFit);
    window.visualViewport.addEventListener("scroll", onViewportFit);
  }

  $("btn-global-refresh")?.addEventListener("click", () => {
    // Cache-bust reload so iPad picks up new CSS/JS
    const u = new URL(window.location.href);
    u.searchParams.set("r", String(Date.now()));
    window.location.replace(u.toString());
  });

  syncAnswerEntryUI();
  syncPlayViewportFit();

  ensureRobloxFloor();
  writeRobloxBankStore();
  renderHome();
})();

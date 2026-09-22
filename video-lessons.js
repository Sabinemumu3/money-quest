/* ==========================================================================
   视频教学挂载点（MVP 口子）
   --------------------------------------------------------------------------
   这一层只做三件事：
     1. 读 media/video/manifest.json，回答「这节课这一步有没有配片」；
     2. 有片就渲染一张儿童可用的播放卡片；
     3. 没片 / 清单读不到 / 片子加载失败 → 一律返回 null，
        课程流程按原样继续（配片前后行为完全一致，零回归）。

   课程数据层和页面渲染层都不需要知道片子从哪来、什么编码、有没有字幕。
   放片流程见 media/video/README.md；接口契约见 docs/VIDEO-MODULE.md。

   产品立场（硬约束，改动前先读）：
     - 永不自动播放、永不自动跳步、永不倒计时、永不因未看完而阻止推进
     - 只记录「看过 / 没看过」这一个布尔值，不记录观看时长（时长不是 KPI）
     - AI 生成的内容必须在 manifest 里如实标记（aiGenerated）；儿童端界面不再
       显示 AI 角标或说明文字（20260922 口径，见 docs/VIDEO-MODULE.md §3.8）
   ========================================================================== */
(() => {
  "use strict";

  const MANIFEST_URL = "media/video/manifest.json";
  const PREF_KEY = "future-money-quest-video-v1";
  const PREF_VERSION = 1;
  const LOAD_TIMEOUT = 8000;
  const SAVE_EVERY = 5;

  /* 步骤号 → 挂载位名称。第 0 步是「节前钩子」，其余为将来预留。 */
  const STAGE_BY_STEP = { 0: "hook", 1: "demo", 2: "practice", 3: "challenge", 4: "discovery" };

  /* ?videoPreview=1 仅供内部评审：即使还没配片，也把挂载位置显示出来。
     孩子手里永远是 false，看不到任何占位物。 */
  const previewMode = (() => {
    try { return new URLSearchParams(window.location.search).has("videoPreview"); }
    catch { return false; }
  })();

  const h = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  let manifest = { version: PREF_VERSION, lessons: {} };
  let manifestPromise = null;
  let current = null;
  let prefs = readPrefs();

  function emptyPrefs() {
    return { version: PREF_VERSION, muted: false, captions: true, watched: {}, positions: {}, broken: {} };
  }

  function readPrefs() {
    const empty = emptyPrefs();
    try {
      const raw = JSON.parse(localStorage.getItem(PREF_KEY) || "null");
      if (!raw || raw.version !== PREF_VERSION) return empty;
      return { ...empty, ...raw, watched: raw.watched || {}, positions: raw.positions || {}, broken: raw.broken || {} };
    } catch { return empty; }
  }

  function writePrefs() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); }
    catch { /* 存不下也不影响观看，本次照常播。 */ }
  }

  /* ---------- 清单 ---------------------------------------------------------- */

  function loadManifest() {
    /* 记忆的是「这个请求」，不是「请求过一次」。
       早先用 manifestRequested 去重，第二次调用会立刻 resolve 出当时还是空的
       manifest —— 调用方以为清单到了，其实没有。同一个 promise 可以被多方等待，
       所以这里改存 promise；app.js 的 preload() 与课程里的视觉区回填共用它。 */
    if (!manifestPromise) {
      manifestPromise = (typeof window.fetch !== "function")
        ? Promise.resolve(manifest)
        : window.fetch(MANIFEST_URL, { cache: "no-cache" })
          .then((response) => (response && response.ok ? response.json() : null))
          .then((data) => {
            if (data && data.lessons && typeof data.lessons === "object") {
              manifest = { version: data.version || PREF_VERSION, lessons: data.lessons };
            }
          })
          .catch(() => { /* 没有清单就是没有片，静默跳过，不打扰孩子。 */ })
          .then(() => manifest);
    }
    return manifestPromise;
  }

  function realEntry(lessonId, stage) {
    const entry = manifest.lessons?.[lessonId]?.[stage];
    if (!entry || !entry.src) return null;
    if (entry.status === "planned") return null;
    if (prefs.broken[`${lessonId}:${stage}`]) return null;
    return { ...entry, lessonId, stage, preview: false };
  }

  /* 评审占位：把「这里将来会有一段片」显示出来，用来看位置合不合理。 */
  function previewEntry(lessonId, stage) {
    const planned = manifest.lessons?.[lessonId]?.[stage] || {};
    return {
      ...planned,
      lessonId,
      stage,
      preview: true,
      title: planned.title || { zh: "节前趣味视频（位置占位）", en: "Intro clip (placeholder)" },
      summary: planned.summary || {
        zh: "这段片会放在这里：看完再进故事，孩子带着画面去做题。",
        en: "A clip will live here: watch, then go into the story and try it yourself.",
      },
      duration: planned.duration || 75,
    };
  }

  function resolve(lessonId, step) {
    const stage = STAGE_BY_STEP[step];
    if (!stage || !lessonId) return null;
    const real = realEntry(lessonId, stage);
    if (real) return real;
    return previewMode ? previewEntry(lessonId, stage) : null;
  }

  /* 课程渲染层用这个同步问「这里要不要留位置」。返回空串 = 不留。 */
  function slot(lessonId, step) {
    const entry = resolve(lessonId, step);
    if (!entry) return "";
    return `<div class="video-slot" data-video-lesson="${h(lessonId)}" data-video-stage="${h(entry.stage)}"></div>`;
  }

  /* ---------- 播放卡片 ------------------------------------------------------ */

  function mount(root, config = {}) {
    dispose();
    if (!root || !root.isConnected) return null;
    const entry = resolve(config.lessonId, config.step);
    if (!entry) return null;

    const english = Boolean(config.english);
    const t = (zh, en) => (english ? en : zh);
    const key = `${entry.lessonId}:${entry.stage}`;
    const pick = (value, fallback) => {
      if (value == null || value === "") return fallback;
      if (typeof value === "string") return value;
      return (english ? value.en || value.zh : value.zh || value.en) || fallback;
    };

    const sources = [];
    if (entry.webm) sources.push({ src: entry.webm, type: "video/webm" });
    if (entry.src) sources.push({ src: entry.src, type: /\.webm$/i.test(entry.src) ? "video/webm" : "video/mp4" });

    const captionLang = entry.captions
      ? (entry.captions[english ? "en" : "zh"] ? (english ? "en" : "zh") : Object.keys(entry.captions)[0] || "")
      : "";
    const captionSrc = captionLang ? entry.captions[captionLang] : "";
    const length = entry.duration ? `${Math.max(1, Math.round(entry.duration / 60))} ${t("分钟", "min")}` : "";

    const section = document.createElement("section");
    section.className = "lesson-video";
    section.dataset.videoState = entry.preview ? "preview" : "idle";
    section.dataset.videoKey = key;
    if (entry.aiGenerated) section.dataset.aiGenerated = "true";
    section.setAttribute("aria-label", t("教学视频", "Teaching video"));

    section.innerHTML = `
      <div class="video-frame">
        <video class="video-el" playsinline controls preload="metadata"${entry.poster ? ` poster="${h(entry.poster)}"` : ""}>
          ${sources.map((s) => `<source src="${h(s.src)}" type="${s.type}">`).join("")}
          ${captionSrc ? `<track kind="captions" src="${h(captionSrc)}" srclang="${h(captionLang)}" label="${h(captionLang === "en" ? "English" : "中文字幕")}" default>` : ""}
        </video>
        <div class="video-cover">
          <span class="video-cover-mark" aria-hidden="true">${window.mqIcon("play")}</span>
          <strong class="video-title">${h(pick(entry.title, t("先看一小段，再动手", "A short clip first")))}</strong>
          <p class="video-summary">${h(pick(entry.summary, t("看完就可以自己试一试。", "Then it is your turn to try.")))}</p>
          <div class="video-cover-actions">
            <button type="button" class="video-play" data-video-action="play">${t("看视频", "Play video")}</button>
            ${length ? `<small class="video-length">${h(length)}</small>` : ""}
          </div>
        </div>
        <p class="video-flag" hidden></p>
        <p class="video-status" role="status"></p>
      </div>
      <div class="video-actions">
        <button type="button" class="video-skip" data-video-action="skip">${t("先不看，直接开始 →", "Skip for now →")}</button>
        <button type="button" class="video-replay" data-video-action="replay" hidden>${t("再看一遍", "Watch again")}</button>
      </div>
      <!-- 文字版不再作为可见 UI（20260922 口径：卡片下方保持干净）。
           transcript 仍留在 DOM 里（sr-only），作为「视频没播成 / 读屏孩子」的
           无障碍兜底；字幕与静音交给播放器原生控件，偏好默认开字幕。 -->
      <p class="sr-only video-transcript">${h(pick(entry.transcript, pick(entry.summary, t("本段暂无文字稿。", "No transcript yet."))))}</p>
    `;
    root.replaceChildren(section);

    const video = section.querySelector(".video-el");
    const cover = section.querySelector(".video-cover");
    const status = section.querySelector(".video-status");
    const flag = section.querySelector(".video-flag");
    const replay = section.querySelector('[data-video-action="replay"]');
    const skipButton = section.querySelector('[data-video-action="skip"]');
    const track = video.querySelector("track");
    let readinessTimer = null;
    let lastSaved = 0;
    let finished = false;

    const setState = (state) => { section.dataset.videoState = state; };
    const say = (text) => { status.textContent = text; };

    function showFlag() {
      // 角标只留给评审占位。AI 生成的披露不再盖在封面上：
      // aiGenerated 数据标记与「看文字版」折叠区里的完整说明仍然保留（合规口径见 docs/VIDEO-MODULE.md §3.8）。
      if (entry.preview) {
        flag.hidden = false;
        flag.dataset.tone = "preview";
        flag.textContent = t("位置占位 · 尚未配片（仅评审可见）", "Placeholder · no video yet (review only)");
      }
    }

    function applyCaptions() {
      if (!track) return;
      try { track.mode = prefs.captions ? "showing" : "hidden"; }
      catch { /* 字幕不支持时视频照常播。 */ }
    }

    function savePosition(force) {
      const now = Date.now();
      if (!force && now - lastSaved < SAVE_EVERY * 1000) return;
      lastSaved = now;
      const at = Number(video.currentTime) || 0;
      if (at > 1 && Number.isFinite(video.duration) && video.duration > 0 && at < video.duration - 3) prefs.positions[key] = Math.round(at);
      else delete prefs.positions[key];
      writePrefs();
    }

    function markWatched() {
      if (finished) return;
      finished = true;
      prefs.watched[key] = true;      // 只记「看过」，不记时长。
      delete prefs.positions[key];
      writePrefs();
      config.onFinished?.({ lessonId: entry.lessonId, stage: entry.stage });
    }

    function fail(reason) {
      clearTimeout(readinessTimer);
      setState("error");
      prefs.broken[key] = reason || "load";
      writePrefs();
      say(t("这段片子这次没能播放。后面的练习都还在，可以继续。", "This clip did not play. The exercises are still here, so you can carry on."));
      if (!entry.preview) replay.hidden = false;
    }

    function play() {
      if (entry.preview) {
        // 占位态没有真实文件，直接告诉评审「配片后这里会播」。
        setState("preview");
        say(t("尚未配片：把 mp4 放进 media/video/ 并在 manifest.json 里登记即可播。", "No clip yet: drop an mp4 into media/video/ and register it in manifest.json."));
        return;
      }
      clearTimeout(readinessTimer);
      say("");
      const promise = video.play();
      setState("playing");
      cover.classList.add("is-gone");
      replay.hidden = true;
      readinessTimer = setTimeout(() => {
        if (video.readyState < 2 && !finished) fail("timeout");
      }, LOAD_TIMEOUT);
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          setState("idle");
          cover.classList.remove("is-gone");
          say(t("播放没开始。可以再点一次「看视频」。", "Playback did not start. Tap Play again."));
        });
      }
    }

    function skip() {
      video.pause();
      savePosition(true);
      setState("skipped");
      cover.classList.add("is-gone");
      skipButton.hidden = true;
      replay.hidden = false;
      say(t("这次先跳过了。前面的内容都在，随时可以回来看。", "Skipped this time. Everything else is still here whenever you want to come back."));
      config.onSkip?.({ lessonId: entry.lessonId, stage: entry.stage });
    }

    section.querySelector('[data-video-action="play"]').addEventListener("click", play);
    section.querySelector('[data-video-action="skip"]').addEventListener("click", skip);
    replay.addEventListener("click", () => { video.currentTime = 0; play(); });
    section.querySelector('[data-video-action="captions"]').addEventListener("change", (event) => {
      prefs.captions = event.target.checked; writePrefs(); applyCaptions();
    });
    section.querySelector('[data-video-action="muted"]').addEventListener("change", (event) => {
      prefs.muted = event.target.checked; video.muted = prefs.muted; writePrefs();
    });

    video.muted = prefs.muted;
    applyCaptions();
    showFlag();

    video.addEventListener("loadedmetadata", () => {
      clearTimeout(readinessTimer);
      setState("idle");
      say("");
      const resume = clamp(prefs.positions[key], 0, Math.max(0, (video.duration || 0) - 3));
      if (resume > 3 && !finished) {
        video.currentTime = resume;
        say(t("上次看到这里，接着看就行。", "Picking up where you left off."));
      }
    });
    video.addEventListener("timeupdate", () => savePosition(false));
    video.addEventListener("ended", () => { markWatched(); setState("ended"); cover.classList.add("is-gone"); skipButton.hidden = true; replay.hidden = false; say(t("看完啦。现在轮到你试一试。", "All done. Now it is your turn.")); });
    video.addEventListener("pause", () => { if (section.dataset.videoState === "playing") setState("paused"); savePosition(true); });
    video.addEventListener("play", () => setState("playing"));
    video.addEventListener("error", () => fail("media"));
    video.querySelector("source:last-of-type")?.addEventListener("error", () => fail("source"));
    ["play", "seeking", "waiting"].forEach((eventName) => video.addEventListener(eventName, () => clearTimeout(readinessTimer)));

    // 标签页切走时先停一下，回到页面不自动续播（孩子主动点才算数）。
    current = { section, video, savePosition };
    return { play, skip, element: section, entry };
  }

  function dispose() {
    if (!current) return;
    const { section, video, savePosition } = current;
    try { savePosition(true); } catch { /* ignore */ }
    try { video.pause(); video.removeAttribute("src"); video.load(); } catch { /* ignore */ }
    section.remove();
    current = null;
  }

  /* 学习时钟按「暂停休息」时调用：暂停画面但保留卡片与进度。 */
  function pause() {
    if (!current) return;
    try { current.video.pause(); } catch { /* ignore */ }
  }

  function has(lessonId, step) { return Boolean(resolve(lessonId, step)); }

  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });

  window.MoneyVideo = {
    slot,
    mount,
    dispose,
    pause,
    has,
    resolve,
    preload: loadManifest,
    manifest: () => manifest,
    isPreview: () => previewMode,
    PREF_KEY,
  };

  loadManifest();
})();

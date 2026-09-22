/* Device speech + deterministic lesson diagrams. No microphone or AI endpoint. */
(() => {
  "use strict";
  const PREF_KEY = "money-quest-media-preferences-v1";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefs = { muted: false, rate: 0.95, reduce: false, style: "warm", voices: {} };
  try {
    const saved = JSON.parse(localStorage.getItem(PREF_KEY) || "null");
    if (saved) prefs = { muted: saved.muted === true, reduce: saved.reduce === true, rate: [0.7, 0.85, 0.95, 1].includes(saved.rate) ? saved.rate : 0.95, style: saved.style === "plain" ? "plain" : "warm", voices: { zh: typeof saved.voices?.zh === "string" ? saved.voices.zh : "", en: typeof saved.voices?.en === "string" ? saved.voices.en : "" } };
  } catch { /* Device preferences are optional. */ }
  let mounted = null;
  let audioContext = null, tones = [], soundRun = 0;
  let coinTones = [], coinRun = 0;
  function stopChime() {
    soundRun += 1;
    coinRun += 1;
    tones.forEach(({ oscillator, gain }) => { try { oscillator.stop(); } catch { /* Already ended. */ } oscillator.disconnect(); gain.disconnect(); });
    tones = [];
    coinTones.forEach(({ oscillator, gain }) => { try { oscillator.stop(); } catch { /* Already ended. */ } oscillator.disconnect(); gain.disconnect(); });
    coinTones = [];
  }
  function playChime(onUnavailable) {
    stopChime();
    if (prefs.muted) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) { onUnavailable(); return; }
    try {
      audioContext ||= new Audio();
      const run = soundRun;
      const schedule = () => {
        if (run !== soundRun || prefs.muted || document.hidden) return;
        if (audioContext.state !== "running") { onUnavailable(); return; }
        [523.25, 659.25, 783.99].forEach((frequency, i) => {
          const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
          const at = audioContext.currentTime + 0.02 + i * 0.13;
          oscillator.type = "sine"; oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(0.085, at + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, at + 0.24);
          oscillator.connect(gain); gain.connect(audioContext.destination);
          const tone = { oscillator, gain }; tones.push(tone);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); tones = tones.filter(t => t !== tone); };
          oscillator.start(at); oscillator.stop(at + 0.26);
        });
      };
      if (audioContext.state === "running") schedule();
      else audioContext.resume().then(schedule).catch(() => { if (run === soundRun) onUnavailable(); });
    } catch { onUnavailable(); }
  }

  /* 硬币「叮」：数钱 / 付款时每枚一枚的短促高频双击，比答对 chime 轻一档。
     与 playChime 同一个 AudioContext，但用独立的 tones 池 —— 硬币连响
     不该把正在收尾的答对音掐掉。音高每次随机微移，连发才不像机械节拍器。
     静音偏好与 playChime 共用一把闸；AudioContext 未解锁时安静放弃，
     下一枚硬币自然重试，不弹任何提示。 */
  function playCoin() {
    if (prefs.muted) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      audioContext ||= new Audio();
      const run = ++coinRun;
      const schedule = () => {
        if (run !== coinRun || prefs.muted || document.hidden) return;
        if (audioContext.state !== "running") return;
        const base = 1850 + Math.random() * 550;
        [base, base * 1.34].forEach((frequency, i) => {
          const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
          const at = audioContext.currentTime + 0.005 + i * 0.048;
          oscillator.type = "triangle"; oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, at);
          gain.gain.linearRampToValueAtTime(0.055, at + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.001, at + 0.13);
          oscillator.connect(gain); gain.connect(audioContext.destination);
          const tone = { oscillator, gain }; coinTones.push(tone);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); coinTones = coinTones.filter(t => t !== tone); };
          oscillator.start(at); oscillator.stop(at + 0.15);
        });
      };
      if (audioContext.state === "running") schedule();
      else audioContext.resume().then(schedule).catch(() => { /* 解锁失败就无声 */ });
    } catch { /* 无声可玩 */ }
  }

  function celebrate(root, total, english) {    root.querySelector(".answer-reward")?.remove();
    const card = document.createElement("aside");
    card.className = "answer-reward";
    card.setAttribute("role", "status");
    card.innerHTML = `<span class="reward-star" aria-hidden="true">★</span><div><strong>${english ? "You worked it out! +1 learning star" : "你想明白啦！学习星星 +1"}</strong><p>${english ? `Now ${total} stars. Keep exploring at your own pace.` : `已经收集 ${total} 颗。慢慢想，也值得庆祝！`}</p><small>${english ? "Stars celebrate practice. They are not spending money." : "星星记录练习，不是可以花的钱。"}</small></div>`;
    root.querySelector(".lesson-feedback").after(card);
    // Fired only from a successful answer click; rendering or reloading never pays again.
    playChime(() => { if (card.isConnected) card.querySelector("small").textContent += english ? " Sound is unavailable; your star is saved." : " 当前音效未能播放，星星照样保存。"; });
  }
  const savePrefs = () => { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch { /* Session still works. */ } };
  const reduced = () => prefs.reduce || motionQuery.matches;
  const supported = () => Boolean(window.speechSynthesis) && typeof window.SpeechSynthesisUtterance === "function";
  const ids = (start, end, prefix = "coin") => Array.from({ length: end - start }, (_, i) => `${prefix}-${start + i}`);
  const group = (label, tokens, unit = "coin") => ({ label, tokens, unit });
  const h = (text) => String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Each demo has its own declared purse. Never infer profit from its balance.
  function framesFor(id, step, t, original) {
    const pocket = t("口袋里的钱", "Money available"), paid = t("已经花出去", "Money spent");
    const f = (caption, groups, equation = "") => ({ caption, groups, equation });
    const count = (n, label = pocket) => [
      f(t(`一起数一数，这里有 ${n} 枚星币。`, `Count with me: there are ${n} coins here.`), [group(label, ids(0, n))]),
      f(original, [group(label, ids(0, n))], t(`一共 ${n} 枚`, `${n} coins in total`)),
    ];
    const spend = (total, cost, name) => [
      f(t(`先看看：口袋有 ${total} 枚，还没有付款。`, `First: ${total} coins are in the purse, before paying.`), [group(pocket, ids(0, total)), group(name || paid, [])]),
      f(t(`把 ${cost} 枚付出去，数数留下的星币。`, `Pay ${cost} coins. Count those that stay.`), [group(pocket, ids(cost, total)), group(name || paid, ids(0, cost))], `${total} − ${cost} = ${total - cost}`),
      f(original, [group(pocket, ids(cost, total)), group(name || paid, ids(0, cost))], `${total} − ${cost} = ${total - cost}`),
    ];
    if (id === "lesson-1") return step === 0 ? count(10) : step === 1 ? spend(10, 6, t("面包的钱", "Paid for bread")) : spend(4, 3, t("果汁的钱", "Paid for juice"));
    if (id === "lesson-2") {
      if (step === 0) return count(10);
      if (step === 1) return [
        f(t("先留出工具和材料的钱。", "Set aside money for tools and materials."), [group(pocket, ids(0, 10)), group(t("工具", "Tools"), []), group(t("材料", "Materials"), [])]),
        f(t("工具花 3 枚，材料花 4 枚。一共花 7 枚。", "Tools cost 3 and materials cost 4: 7 spent."), [group(pocket, ids(7, 10)), group(t("工具的钱", "Paid for tools"), ids(0, 3)), group(t("材料的钱", "Paid for materials"), ids(3, 7))], "10 − 3 − 4 = 3"),
        f(original, [group(pocket, ids(7, 10)), group(t("工具的钱", "Paid for tools"), ids(0, 3)), group(t("材料的钱", "Paid for materials"), ids(3, 7))], "10 − 7 = 3"),
      ];
      return [f(t("左边是现有的钱，右边是招牌的价格，不是另外获得的钱。", "Left is the money we have; right is the sign's price, not extra money."), [group(t("我只有", "I have"), ids(0, 3)), group(t("招牌需要", "The sign costs"), ids(0, 5, "price"))], t("还差 2 枚", "2 more needed")), f(original, [group(t("我只有", "I have"), ids(0, 3)), group(t("招牌需要", "The sign costs"), ids(0, 5, "price"))])];
    }
    if (id === "lesson-3") {
      if (step === 0) return count(10, t("原有的钱", "Starting money"));
      if (step === 1) return spend(10, 2, t("材料成本", "Material cost"));
      if (step === 2) return [
        f(t("买完材料，小店剩 8 枚。顾客准备支付 5 枚。", "After materials, the shop has 8 coins. The customer will pay 5."), [group(pocket, ids(0, 8)), group(t("顾客的钱", "Customer's payment"), ids(8, 13))]),
        f(t("5 枚进来了，口袋变成 13 枚。", "Five coins come in. The purse now holds 13."), [group(pocket, ids(0, 13)), group(t("顾客已付", "Payment completed"), [])], "8 + 5 = 13"),
        f(original, [group(pocket, ids(0, 13)), group(t("顾客已付", "Payment completed"), [])], "8 + 5 = 13"),
      ];
      return [
        f(t("现在的 13 枚，不都是今天赚的。", "Not all 13 coins were earned today."), [group(t("现在共有", "Total now"), ids(0, 13)), group(t("比原来多的", "Increase"), [])]),
        f(t("分开看看：原有 10 枚，比原来多了 3 枚。", "Separate them: 10 were here before; 3 are the increase."), [group(t("原有的钱", "Starting money"), ids(0, 10)), group(t("这笔利润", "Profit on this sale"), ids(10, 13))], "13 − 10 = 5 − 2 = 3"),
        f(original, [group(t("原有的钱", "Starting money"), ids(0, 10)), group(t("这笔利润", "Profit on this sale"), ids(10, 13))], "5 − 2 = 3"),
      ];
    }
    if (id === "lesson-4") {
      if (step === 0) return count(10);
      if (step === 1) return [
        f(t("进货前有 10 枚，货架是空的。", "Before buying, there are 10 coins and an empty shelf."), [group(pocket, ids(0, 10)), group(t("货架上的产品", "Stock on shelf"), [], "stock")]),
        f(t("每份花 2 枚，买 5 份就花完了 10 枚。钱换成了货物。", "Each item costs 2. Five cost all 10 coins. Money was exchanged for stock."), [group(pocket, []), group(t("货架上的产品", "Stock on shelf"), ids(0, 5, "stock"), "stock")], "10 − 5 × 2 = 0"),
        f(original, [group(pocket, []), group(t("货架上的产品", "Stock on shelf"), ids(0, 5, "stock"), "stock")]),
      ];
      return [
        f(t("货架有 5 份，准备迎接 3 位顾客。", "Five items on the shelf; three customers are coming."), [group(pocket, []), group(t("还没卖出的货", "Unsold stock"), ids(0, 5, "stock"), "stock"), group(t("顾客买到", "Items sold"), [], "stock")]),
        f(t("卖出 3 份，收到 9 枚；剩 2 份货还在。", "Sell three for 9 coins; two items remain."), [group(pocket, ids(0, 9)), group(t("还没卖出的货", "Unsold stock"), ids(3, 5, "stock"), "stock"), group(t("顾客买到", "Items sold"), ids(0, 3, "stock"), "stock")], t("收到 9 枚 · 还有 2 份库存", "9 coins received · 2 items still in stock")),
        f(original, [group(pocket, ids(0, 9)), group(t("还没卖出的货", "Unsold stock"), ids(3, 5, "stock"), "stock"), group(t("顾客买到", "Items sold"), ids(0, 3, "stock"), "stock")]),
      ];
    }
    if (id === "lesson-5") {
      if (step === 0) return count(12);
      const split = [group(t("明天要用", "For tomorrow"), ids(0, 6)), group(t("愿望口袋", "Saved for a wish"), ids(6, 12))];
      if (step === 1) return [
        f(t("一共有 12 枚，先给明天留好钱。", "There are 12 coins. Protect tomorrow's needs first."), [group(pocket, ids(0, 12)), group(t("愿望口袋", "Saved for a wish"), [])]),
        f(t("6 枚给明天，6 枚存愿望。钱没有变多，只是分开了。", "Six for tomorrow, six for the wish. The amount is unchanged; it is divided."), split, "6 + 6 = 12"),
        f(original, split, "12 − 6 = 6"),
      ];
      return [f(t("存了 6 枚，目标是 8 枚。还差多少？", "Six saved toward a goal of eight. How many more?"), split, "8 − 6 = 2"), f(original, split, t("还差 2 枚，可以慢慢来", "Two more needed; take your time"))];
    }
    if (id === "lesson-6") {
      if (step === 0) return spend(8, 6, t("如果买装饰", "If spent on decorations"));
      if (step === 1) return [f(t("比较一下：现有 2 枚，补杯子要 5 枚。", "Compare: 2 available; replacing cups costs 5."), [group(t("如果只剩", "If only these remain"), ids(0, 2)), group(t("补杯子需要", "Replacement cost"), ids(0, 5, "price"))], "5 − 2 = 3"), f(original, [group(t("如果只剩", "If only these remain"), ids(0, 2)), group(t("补杯子需要", "Replacement cost"), ids(0, 5, "price"))])];
      return spend(8, 5, t("先补杯子", "Replace cups first"));
    }
    return [];
  }

  function mount(root, config) {
    dispose();
    const t = (zh, en) => config.english ? en : zh;
    const frames = config.stage === 1 ? framesFor(config.lessonId, config.demo, t, config.text) : [];
    const turns = frames.length ? window.MoneyDialogues.demo(config, frames) : config.dialogue || [];
    let turnIndex = Math.max(0, Math.min(turns.length - 1, config.dialogueIndex || 0));
    const conversation = document.createElement("section");
    conversation.className = "character-conversation";
    conversation.setAttribute("aria-label", t("小芽和团团的对话", "Sunny and Tuan's conversation"));
    conversation.innerHTML = `<div class="dialogue-cast" aria-hidden="true"><span class="dialogue-actor actor-sunny"><span class="sunny-sprite" data-mood="welcome"></span><span>${t("小芽", "Sunny")}</span></span><span class="cast-caption">${t("小小问题 · 一起发现", "Little questions · Big discoveries")}</span><span class="dialogue-actor actor-tuan"><img src="tuan-buddy.png" width="128" height="128" alt="" /><span>${t("团团", "Tuan")}</span></span></div><div class="dialogue-bubble" role="status" aria-atomic="true"><strong class="dialogue-speaker"></strong><p class="dialogue-line"></p></div><div class="dialogue-controls"><button type="button" data-dialogue="back" aria-label="${t("上一句", "Previous line")}">←</button><span class="dialogue-count"></span><button type="button" data-dialogue="next">${t("接着聊 →", "Next line →")}</button></div>`;
    (root.querySelector(".dialogue-slot") || root).append(conversation);
    const bar = document.createElement("section");
    bar.className = "narration-bar";
    bar.setAttribute("aria-label", t("讲解播放设置", "Explanation playback controls"));
    bar.innerHTML = `<div class="narration-controls"><button type="button" data-media="listen" class="listen-button">${window.mqIcon("play")} ${t("听小芽讲", "Listen to Sunny")}</button><button type="button" data-media="stop" disabled>${t("停止朗读", "Stop voice")}</button><label>${t("语速", "Speed")}<select data-media="rate"><option value="0.7">${t("更慢", "Slower")}</option><option value="0.85">${t("慢慢讲", "Gentle")}</option><option value="0.95">${t("轻松聊", "Easy pace")}</option><option value="1">${t("正常", "Normal")}</option></select></label><label><input type="checkbox" data-media="muted" />${t("静音", "Mute")}</label><label><input type="checkbox" data-media="reduce" />${t("减少动画", "Less motion")}</label></div><details class="voice-options"><summary>${t("换个声音试试", "Try another voice")}</summary><div class="narration-controls"><label>${t("讲述方式", "Delivery")}<select data-media="style"><option value="warm">${t("小芽讲故事", "Sunny's story pace")}</option><option value="plain">${t("平稳朗读", "Steady reading")}</option></select></label><label class="voice-picker">${t("设备声线", "Device voice")}<select data-media="voice"></select></label></div><p>${t("讲故事会留出思考停顿，轻轻变化语调。音色取决于设备，这还不是专门录制的情感配音；部分声音由浏览器联网提供。", "Story mode leaves thinking pauses and gently varies pitch. Voices depend on your device; this is not a specially recorded character voice. Some browser voices use the network.")}</p></details><p class="voice-status" role="status"></p><p class="spoken-caption" hidden></p>`;
    conversation.after(bar);
    // Leave two clear playback buttons; less-used settings stay tucked away.
    const settings = bar.querySelector(".voice-options .narration-controls");
    [...bar.querySelector(".narration-controls").querySelectorAll("label")].forEach(label => settings.append(label));
    bar.querySelector(".voice-options summary").textContent = t("声音与动画设置", "Voice & motion settings");
    bar.querySelector(".voice-options").append(bar.querySelector(".voice-status"));
    const $ = sel => bar.querySelector(sel);
    $('[data-media="rate"]').value = String(prefs.rate);
    $('[data-media="style"]').value = prefs.style;
    $('[data-media="muted"]').checked = prefs.muted;
    $('[data-media="muted"]').setAttribute("aria-label", t("静音：关闭朗读和答对提示音", "Mute narration and correct-answer sounds"));
    $('[data-media="muted"]').closest("label").title = t("关闭朗读和答对提示音", "Mute narration and answer sounds");
    $('[data-media="reduce"]').checked = reduced();
    $('[data-media="reduce"]').disabled = motionQuery.matches;
    let index = 0, timer = null, speechWatch = null, speechPause = null, speechRun = 0, speaking = false, playing = false, utterance = null, live = true;
    let animations = [], diagram = null;

    function showTurn(next, animate = true) {
      if (!turns.length) return;
      turnIndex = Math.max(0, Math.min(turns.length - 1, next));
      const turn = turns[turnIndex];
      conversation.dataset.speaker = turn.who;
      conversation.querySelector(".dialogue-speaker").textContent = turn.who === "tuan" ? t("团团", "Tuan") : t("小芽", "Sunny");
      conversation.querySelector(".dialogue-line").textContent = turn.text;
      conversation.querySelector(".sunny-sprite").dataset.mood = turn.mood || "welcome";
      conversation.querySelector(".dialogue-count").textContent = `${turnIndex + 1} / ${turns.length}`;
      conversation.querySelector('[data-dialogue="back"]').disabled = turnIndex === 0;
      conversation.querySelector('[data-dialogue="next"]').disabled = turnIndex === turns.length - 1;
      conversation.querySelector('[data-dialogue="next"]').textContent = turnIndex === turns.length - 1 ? t("轮到你啦 ✓", "Your turn ✓") : t("接着聊 →", "Next line →");
      if (turn.frame !== undefined) showFrame(turn.frame, animate);
      config.onDialogueChange?.(turnIndex, turnIndex === turns.length - 1);
    }

    const voiceKey = v => `${v.voiceURI || v.name || "voice"}|${v.lang}`;
    function availableVoices() {
      if (!supported()) return [];
      return window.speechSynthesis.getVoices().filter(v => config.english ? /^en(?:-|_|$)/i.test(v.lang) : /^(zh|cmn)(?:-|_|$)/i.test(v.lang));
    }
    function voiceScore(v) {
      const name = v.name || "";
      const locale = config.english ? /^en[-_]AU/i.test(v.lang) : /^(zh[-_]CN|cmn)/i.test(v.lang);
      return (locale ? 30 : 0) + (/natural|neural|premium|enhanced|自然/i.test(name) ? 40 : 0) + (/xiaoxiao|xiaoyi|晓晓|晓伊|tingting|婷婷|samantha|karen|aria|jenny/i.test(name) ? 15 : 0) + (v.localService ? 3 : 0);
    }
    function selectedVoice() {
      const candidates = availableVoices();
      return candidates.find(v => voiceKey(v) === prefs.voices[config.english ? "en" : "zh"]) || candidates.sort((a, b) => voiceScore(b) - voiceScore(a))[0] || null;
    }
    function status(text) {
      // 状态只写进折叠区内的状态行（读屏的 role=status 照常播报），
      // 不再自动展开「声音与动画设置」—— 之前设备缺中文声音时每次进课都被撑开，
      // 把题目往下顶一大截。要不要展开，交给孩子自己点。
      $(".voice-status").textContent = text;
    }
    function refreshVoices() {
      if (!live || speaking) return;
      const available = selectedVoice();
      const picker = $('[data-media="voice"]');
      const chosen = prefs.voices[config.english ? "en" : "zh"];
      picker.innerHTML = `<option value="">${t("自动选择", "Automatic")}</option>` + availableVoices().map(v => `<option value="${h(voiceKey(v))}">${h(v.name || v.lang)}${v.localService ? "" : t("（网络）", " (online)")}</option>`).join("");
      picker.value = [...picker.options].some(o => o.value === chosen) ? chosen : "";
      picker.disabled = !available;
      $('[data-media="listen"]').disabled = prefs.muted || !supported();
      if (prefs.muted) status(t("已静音。文字和无声演示仍可使用。", "Muted. Text and silent demonstrations remain available."));
      else if (!supported()) status(t("这个浏览器暂不支持朗读，可以看字幕和演示。", "This browser does not support speech. Read the text and use the demonstration."));
      else if (!available) status(t("正在等待设备的中文声音；若仍无声，可换浏览器或安装中文语音。文字学习不受影响。", "Waiting for an English voice. If none is available, try another browser or install an English voice. Text still works."));
      else status(t("设备合成语音 · 点击才播放 · 不使用麦克风", "Device-generated voice · Click to play · No microphone"));
    }

    function finishMotion() { animations.forEach(a => { try { a.finish(); } catch { a.cancel(); } }); animations = []; }
    function updateAnimationButtons() {
      if (!diagram) return;
      diagram.querySelector('[data-scene="play"]').textContent = playing ? t("暂停演示", "Pause demo") : index === frames.length - 1 ? t("重播演示", "Replay demo") : t("播放演示", "Play demo");
      diagram.querySelector('[data-scene="next"]').disabled = index === frames.length - 1;
      diagram.querySelector('[data-scene="back"]').disabled = index === 0;
    }
    function showFrame(next, animate = true) {
      if (!diagram) return;
      finishMotion();
      const before = new Map([...diagram.querySelectorAll("[data-token]")].map(n => [n.dataset.token, n.getBoundingClientRect()]));
      index = Math.max(0, Math.min(frames.length - 1, next));
      const f = frames[index];
      diagram.querySelector(".scene-groups").innerHTML = f.groups.map(g => `<article class="scene-group"><h3>${h(g.label)}</h3><strong>${g.tokens.length} <small>${g.unit === "stock" ? t("份", "items") : t("枚", "coins")}</small></strong><div class="scene-tokens" aria-hidden="true">${g.tokens.map(id => `<span data-token="${id}" class="scene-token ${g.unit === "stock" ? "stock-token" : ""}">${g.unit === "stock" ? "□" : "1"}</span>`).join("") || '<span class="empty-tokens">—</span>'}</div></article>`).join("");
      diagram.querySelector(".scene-caption").textContent = f.caption;
      if (!$(".spoken-caption").hidden) $(".spoken-caption").textContent = f.caption;
      diagram.querySelector(".scene-equation").textContent = f.equation;
      diagram.querySelector(".scene-count").textContent = `${index + 1} / ${frames.length}`;
      if (animate && !reduced()) {
        diagram.querySelectorAll("[data-token]").forEach((node, i) => {
          if (!node.animate) return;
          const old = before.get(node.dataset.token), now = node.getBoundingClientRect();
          const start = old ? { transform: `translate(${old.left - now.left}px, ${old.top - now.top}px)` } : { opacity: 0, transform: "translateY(12px) scale(.8)" };
          animations.push(node.animate([start, { opacity: 1, transform: "none" }], { duration: 620, delay: i * 35, easing: "ease-in-out", fill: "backwards" }));
        });
      }
      updateAnimationButtons();
    }

    function cancelSpeech() {
      speechRun += 1; clearTimeout(speechWatch); clearTimeout(speechPause); speechWatch = null; speechPause = null; speaking = false;
      if (supported()) window.speechSynthesis.cancel();
      utterance = null; root.classList.remove("is-narrating");
      $('[data-media="stop"]').disabled = true;
      $('[data-media="listen"]').innerHTML = `${window.mqIcon("play")} ${t("听她们聊", "Listen to the chat")}`;
    }
    function stop(message) {
      clearTimeout(timer); timer = null; playing = false; cancelSpeech(); stopChime(); finishMotion(); updateAnimationButtons();
      if (message) status(message); else refreshVoices();
    }
    function speakSequence() {
      stop();
      const voice = selectedVoice();
      if (prefs.muted || !supported()) { refreshVoices(); return; }
      if (!voice) { status(t("这个设备还没有可用的中文声音。可以用无声演示，或在系统设置中安装中文语音后重试。", "No English voice is available on this device. Use the silent demonstration, or install an English system voice and try again.")); return; }
      const start = turnIndex === turns.length - 1 ? 0 : turnIndex;
      const sequence = turns.length ? turns.slice(start).map((part, i) => ({ ...part, turn: start + i })) : [{ text: config.text }];
      if (!sequence.length) return;
      const run = ++speechRun;
      speaking = true;
      $('[data-media="stop"]').disabled = false;
      $('[data-media="listen"]').textContent = `↻ ${t("从头听", "Listen again")}`;
      function speakAt(n) {
        if (!live || run !== speechRun) return;
        if (n >= sequence.length) { speaking = false; utterance = null; root.classList.remove("is-narrating"); $('[data-media="stop"]').disabled = true; status(t("讲完啦。你可以重听，也可以自己试试。", "Finished. Listen again or have your own turn.")); return; }
        const part = sequence[n];
        if (part.turn !== undefined) showTurn(part.turn);
        const caption = $(".spoken-caption"); caption.hidden = true;
        const u = new SpeechSynthesisUtterance(part.text.replace(/−/g, t("减", " minus ")).replace(/×/g, t("乘", " times ")).replace(/=/g, t("等于", " equals ")));
        const question = /[？?]/.test(part.text), encouragement = /没关系|别着急|慢慢|Take your time|okay/i.test(part.text), delighted = /发现啦|太棒|真好|You found|Well done/i.test(part.text);
        utterance = u; u.voice = voice; u.lang = voice.lang;
        u.rate = prefs.rate * (prefs.style === "warm" && encouragement ? 0.97 : 1);
        u.pitch = prefs.style === "plain" ? 1 : encouragement ? 1.01 : question || delighted ? 1.07 : 1.03;
        if (prefs.style === "warm" && part.who === "tuan") u.pitch = Math.min(1.14, u.pitch + 0.05);
        u.onstart = () => { if (run !== speechRun) return; clearTimeout(speechWatch); root.classList.add("is-narrating"); status(t("正在对话……可以随时停止。", "Conversation playing… Stop whenever you like.")); };
        u.onend = () => {
          if (run !== speechRun) return;
          clearTimeout(speechWatch);
          if (n === sequence.length - 1 || prefs.style === "plain") speakAt(n + 1);
          else speechPause = setTimeout(() => speakAt(n + 1), question || sequence[n + 1]?.who !== part.who ? 650 : 260);
        };
        u.onerror = () => { if (run !== speechRun) return; stop(t("这次没有成功播放。请检查设备音量，或重试；文字和无声演示仍可使用。", "Speech did not play. Check device volume or try again; text and the silent demo still work.")); };
        // Some browsers expose speech but never start an unavailable voice.
        speechWatch = setTimeout(() => { if (run === speechRun) stop(t("设备没有开始朗读。可以重试、换浏览器，或继续看字幕。", "The device did not start speaking. Retry, switch browser or use the text.")); }, 7000);
        try { window.speechSynthesis.speak(u); } catch { u.onerror(); }
      }
      speakAt(0);
    }

    if (frames.length) {
      diagram = document.createElement("section"); diagram.className = "teaching-animation";
      diagram.setAttribute("aria-label", t("星币分步演示", "Step-by-step money demonstration"));
      diagram.innerHTML = `<header><strong>${t("跟着星币看变化", "Follow the money")}</strong><span class="scene-count"></span></header><div class="scene-groups"></div><p class="scene-equation"></p><p class="scene-caption" aria-live="polite"></p><div class="scene-controls"><button type="button" data-scene="play">${t("播放演示", "Play demo")}</button><button type="button" data-scene="back">${t("上一画面", "Previous frame")}</button><button type="button" data-scene="next">${t("下一画面", "Next frame")}</button></div><small>${t("演示不会自动过关。看懂以后，再点课程的下一步。", "This demonstration never advances the lesson. Continue when you understand.")}</small>`;
      root.querySelector(".demo-money").replaceWith(diagram);
      showFrame(0, false);
      diagram.querySelector('[data-scene="play"]').addEventListener("click", () => {
        if (playing) { stop(t("演示暂停了，可继续播放或手动看下一画面。", "Demo paused. Play again or step through the frames.")); return; }
        cancelSpeech(); playing = true;
        showFrame(index === frames.length - 1 ? 0 : index);
        const advance = () => {
          if (!live || !playing) return;
          if (index < frames.length - 1) { showFrame(index + 1); timer = setTimeout(advance, 3200); }
          else { playing = false; timer = null; updateAnimationButtons(); }
        };
        timer = setTimeout(advance, 3200); updateAnimationButtons();
      });
      ["back", "next"].forEach(direction => diagram.querySelector(`[data-scene="${direction}"]`).addEventListener("click", () => { stop(); showFrame(index + (direction === "next" ? 1 : -1)); }));
      // Dialogue drives each visual frame; avoid two competing sets of next buttons.
      diagram.querySelector(".scene-controls").hidden = true;
      diagram.querySelector(".scene-caption").hidden = true;
      diagram.lastElementChild.hidden = true;
    }
    conversation.querySelector('[data-dialogue="back"]').addEventListener("click", () => { stop(); showTurn(turnIndex - 1); });
    conversation.querySelector('[data-dialogue="next"]').addEventListener("click", () => { stop(); showTurn(turnIndex + 1); });
    showTurn(turnIndex, false);
    $('[data-media="listen"]').innerHTML = `${window.mqIcon("play")} ${t("听她们聊", "Listen to the chat")}`;
    $('[data-media="listen"]').addEventListener("click", speakSequence);
    $('[data-media="stop"]').addEventListener("click", () => stop(t("已停止。再点“听她们聊”可以接着听。", "Stopped. Click Listen to the chat to continue.")));
    $('[data-media="muted"]').addEventListener("change", e => { prefs.muted = e.target.checked; savePrefs(); stop(); refreshVoices(); });
    $('[data-media="rate"]').addEventListener("change", e => { prefs.rate = Number(e.target.value); savePrefs(); stop(t("语速已调整，再点“听她们聊”即可。", "Speed changed. Click Listen to the chat when ready.")); });
    $('[data-media="style"]').addEventListener("change", e => { prefs.style = e.target.value; savePrefs(); stop(t("讲述方式换好了，点“听她们聊”试听。", "Delivery changed. Click Listen to the chat to try it.")); });
    $('[data-media="voice"]').addEventListener("change", e => { prefs.voices[config.english ? "en" : "zh"] = e.target.value; savePrefs(); stop(t("声线换好了，点“听她们聊”试听。", "Voice changed. Click Listen to the chat to try it.")); });
    $('[data-media="reduce"]').addEventListener("change", e => { prefs.reduce = e.target.checked; savePrefs(); stop(); root.classList.toggle("less-motion", reduced()); });
    root.classList.toggle("less-motion", reduced());
    const onMotion = () => { stop(); root.classList.toggle("less-motion", reduced()); $('[data-media="reduce"]').checked = reduced(); $('[data-media="reduce"]').disabled = motionQuery.matches; };
    if (supported()) window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    motionQuery.addEventListener?.("change", onMotion);
    refreshVoices();
    mounted = {
      stop,
      updateText(text) { config.text = text; stop(); $(".spoken-caption").hidden = true; },
      dispose() { stop(); live = false; conversation.remove(); bar.remove(); if (supported()) window.speechSynthesis.removeEventListener("voiceschanged", refreshVoices); motionQuery.removeEventListener?.("change", onMotion); },
    };
  }
  function dispose() { stopChime(); mounted?.dispose(); mounted = null; }
  function suspend() { stopChime(); mounted?.stop(document.documentElement.lang === "en" ? "Playback stopped. Click Listen or Play again when you return." : "播放已停止。回来后可再点朗读或演示。"); }
  document.addEventListener("visibilitychange", () => { if (document.hidden) suspend(); });
  window.addEventListener("pagehide", suspend);
  window.TeachingMedia = { mount, dispose, suspend, celebrate, playSuccessSound: () => playChime(() => {}), playCoin, updateText: text => mounted?.updateText(text) };
})();

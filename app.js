(() => {
  "use strict";

  const STORAGE_KEY = "future-life-skills-money-game-v1";
  const LESSONS = window.MoneyLessons.lessons;
  const TASKS = [...LESSONS.map((lesson) => lesson.id), "mission-4"];
  const XP_PER_LEVEL = 60;

  const businessScenarios = {
    "bubble-tea": {
      icon: window.mqIcon("tea"),
      shopZh: "星光奶茶铺",
      shopEn: "Star Bubble Tea",
      sign: "STAR TEA",
      briefZh: "从一杯奶茶开始，学习钱的流动、采购、定价和现金管理。",
      briefEn: "Start with one drink and learn money flow, supplies, pricing and cash management.",
      supplies: [
        { key: "tea", icon: window.mqIcon("tea-cup"), zh: "茶底", en: "Tea base", cost: 8, essential: true },
        { key: "cups", icon: window.mqIcon("cup"), zh: "杯子和吸管", en: "Cups and straws", cost: 6, essential: true },
        { key: "milk", icon: window.mqIcon("milk"), zh: "牛奶", en: "Milk", cost: 9, essential: true },
        { key: "fruit", icon: window.mqIcon("cherry"), zh: "水果口味", en: "Fruit flavour", cost: 12, essential: false },
        { key: "sign", icon: window.mqIcon("sparkles"), zh: "手绘招牌", en: "Handmade sign", cost: 7, essential: false },
      ],
      customers: [
        {
          avatar: window.mqIcon("customer-1"),
          titleZh: "第一位顾客想买一杯原味奶茶",
          titleEn: "The first customer wants a classic milk tea",
          storyZh: "制作成本是4星币。怎样定价既能覆盖成本，又不会离谱？",
          storyEn: "It costs 4 coins to make. Which price covers the cost without being unreasonable?",
          options: [
            { key: "low", zh: "卖3星币", en: "Charge 3 coins", correct: false, feedbackZh: "售价低于成本，每卖一杯都会减少店里的钱。", feedbackEn: "The price is below cost, so each sale reduces shop cash." },
            { key: "fair", zh: "卖7星币", en: "Charge 7 coins", correct: true, feedbackZh: "合理。7星币收入减去4星币成本，留下3星币利润。", feedbackEn: "Sound choice. 7 coins revenue minus 4 coins cost leaves 3 coins profit." },
            { key: "high", zh: "卖20星币", en: "Charge 20 coins", correct: false, feedbackZh: "利润可能很高，但顾客也可能觉得价格不合理。", feedbackEn: "Profit could be high, but customers may find the price unreasonable." },
          ],
        },
        {
          avatar: window.mqIcon("customer-2"),
          titleZh: "顾客想要的草莓口味卖完了",
          titleEn: "The strawberry flavour has sold out",
          storyZh: "你希望保住收入，也希望顾客下次还愿意来。",
          storyEn: "You want revenue today and trust that brings the customer back.",
          options: [
            { key: "hide", zh: "不告诉她，换成别的口味", en: "Hide it and use another flavour", correct: false, feedbackZh: "隐瞒会损害信任。声誉也是生意的重要资产。", feedbackEn: "Hiding it damages trust. Reputation is an important business asset." },
            { key: "honest", zh: "说明缺货，提供其他选择", en: "Explain and offer alternatives", correct: true, feedbackZh: "诚信可能少赚一次，却能建立长期信任。", feedbackEn: "Honesty may lose one sale but builds long-term trust." },
            { key: "promise", zh: "保证明天一定有，但不检查库存", en: "Promise tomorrow without checking", correct: false, feedbackZh: "没有检查就承诺，会增加下一次失信的风险。", feedbackEn: "A promise without checking creates another risk of broken trust." },
          ],
        },
        {
          avatar: window.mqIcon("customer-3"),
          titleZh: "小店只剩20星币现金",
          titleEn: "The shop has only 20 coins of cash left",
          storyZh: "明天必须买牛奶才能营业，但新装饰正在打折。先买什么？",
          storyEn: "Milk is needed to open tomorrow, but new decoration is on sale. What comes first?",
          options: [
            { key: "decor", zh: "先买装饰，折扣不能错过", en: "Buy decoration before the sale ends", correct: false, feedbackZh: "装饰是想要；没有必需材料，明天可能无法营业。", feedbackEn: "Decoration is a want. Without essential materials, the shop may not open." },
            { key: "milk", zh: "先保留资金购买牛奶", en: "Keep cash for milk first", correct: true, feedbackZh: "现金流优先保证小店能继续营业，再考虑升级。", feedbackEn: "Cash flow keeps the shop operating before optional upgrades." },
            { key: "all", zh: "全部买下，之后再想办法", en: "Buy everything and solve it later", correct: false, feedbackZh: "把现金一次花完，会失去应对变化的空间。", feedbackEn: "Spending all cash removes room to handle surprises." },
          ],
        },
      ],
    },
    "nail-artist": {
      icon: window.mqIcon("nails"),
      shopZh: "彩虹美甲屋",
      shopEn: "Rainbow Nail Studio",
      sign: "NAIL STUDIO",
      briefZh: "经营一家小小工作室，学习材料预算、服务定价和现金管理。",
      briefEn: "Run a small studio and learn materials budgets, service pricing and cash management.",
      supplies: [
        { key: "polish", icon: window.mqIcon("palette"), zh: "基础甲油", en: "Basic polish", cost: 8, essential: true },
        { key: "tools", icon: window.mqIcon("tools"), zh: "护理工具", en: "Care tools", cost: 6, essential: true },
        { key: "clean", icon: window.mqIcon("bubble"), zh: "清洁用品", en: "Cleaning supplies", cost: 9, essential: true },
        { key: "glitter", icon: window.mqIcon("sparkles"), zh: "闪粉套装", en: "Glitter set", cost: 12, essential: false },
        { key: "sign", icon: window.mqIcon("sign"), zh: "手绘招牌", en: "Handmade sign", cost: 7, essential: false },
      ],
      customers: [
        {
          avatar: window.mqIcon("customer-2"),
          titleZh: "第一位顾客想做简单款式",
          titleEn: "The first customer wants a simple design",
          storyZh: "材料成本是4星币。怎样定价既能覆盖成本，又不会离谱？",
          storyEn: "Materials cost 4 coins. Which price covers the cost without being unreasonable?",
          options: [
            { key: "low", zh: "收3星币", en: "Charge 3 coins", correct: false, feedbackZh: "收费低于材料成本，每次服务都会减少店里的钱。", feedbackEn: "The price is below material cost, so each service reduces shop cash." },
            { key: "fair", zh: "收7星币", en: "Charge 7 coins", correct: true, feedbackZh: "合理。7星币收入减去4星币成本，留下3星币利润。", feedbackEn: "Sound choice. 7 coins revenue minus 4 coins cost leaves 3 coins profit." },
            { key: "high", zh: "收20星币", en: "Charge 20 coins", correct: false, feedbackZh: "利润可能很高，但顾客也可能觉得价格不合理。", feedbackEn: "Profit could be high, but customers may find the price unreasonable." },
          ],
        },
        {
          avatar: window.mqIcon("customer-1"),
          titleZh: "顾客想要的蓝色甲油用完了",
          titleEn: "The blue polish has run out",
          storyZh: "你希望保住这次收入，也希望顾客信任你。",
          storyEn: "You want revenue today and trust that brings the customer back.",
          options: [
            { key: "hide", zh: "不说明，偷偷换一种颜色", en: "Hide it and use another colour", correct: false, feedbackZh: "隐瞒会损害信任。声誉也是生意的重要资产。", feedbackEn: "Hiding it damages trust. Reputation is an important business asset." },
            { key: "honest", zh: "说明缺货，展示其他颜色", en: "Explain and show other colours", correct: true, feedbackZh: "诚信可能少赚一次，却能建立长期信任。", feedbackEn: "Honesty may lose one sale but builds long-term trust." },
            { key: "promise", zh: "保证明天一定有，但不检查库存", en: "Promise tomorrow without checking", correct: false, feedbackZh: "没有检查就承诺，会增加下一次失信的风险。", feedbackEn: "A promise without checking creates another risk of broken trust." },
          ],
        },
        {
          avatar: window.mqIcon("customer-3"),
          titleZh: "工作室只剩20星币现金",
          titleEn: "The studio has only 20 coins of cash left",
          storyZh: "明天必须买清洁用品才能营业，但新装饰正在打折。先买什么？",
          storyEn: "Cleaning supplies are needed tomorrow, but new decoration is on sale. What comes first?",
          options: [
            { key: "decor", zh: "先买装饰，折扣不能错过", en: "Buy decoration before the sale ends", correct: false, feedbackZh: "装饰是想要；没有必需材料，明天可能无法营业。", feedbackEn: "Decoration is a want. Without essential supplies, the studio may not open." },
            { key: "clean", zh: "先保留资金购买清洁用品", en: "Keep cash for cleaning supplies", correct: true, feedbackZh: "现金流优先保证工作室安全营业，再考虑升级。", feedbackEn: "Cash flow keeps the studio safely operating before upgrades." },
            { key: "all", zh: "全部买下，之后再想办法", en: "Buy everything and solve it later", correct: false, feedbackZh: "把现金一次花完，会失去应对变化的空间。", feedbackEn: "Spending all cash removes room to handle surprises." },
          ],
        },
      ],
    },
  };

  const companies = [
    { key: "water", icon: window.mqIcon("water"), zh: "安心水务", en: "Harbour Water", riskZh: "较低波动", riskEn: "Lower volatility", price: 10, nextPrice: 12 },
    { key: "games", icon: window.mqIcon("robot"), zh: "星火游戏", en: "Spark Play", riskZh: "较高波动", riskEn: "Higher volatility", price: 20, nextPrice: 14 },
    { key: "green", icon: window.mqIcon("bus"), zh: "绿行交通", en: "Green Wheels", riskZh: "中等波动", riskEn: "Medium volatility", price: 15, nextPrice: 18 },
  ];

  const defaultState = {
    version: 1,
    language: "zh-CN",
    started: false,
    nickname: "",
    scenario: "bubble-tea",
    cash: 120,
    reputation: 50,
    xp: 0,
    completed: { "mission-1": false, "mission-2": false, "mission-3": false, "mission-4": false },
    quizAnswers: {},
    supplySelected: [],
    customerIndex: 0,
    customerAnswers: {},
    lessonProgress: {},
    learningSeconds: 0,
    learningStars: 0,
    market: {
      cash: 100,
      holdings: { water: 0, games: 0, green: 0 },
      prices: { water: 10, games: 20, green: 15 },
      ran: false,
      riskAnswer: "",
    },
  };

  function cloneDefault() {
    return JSON.parse(JSON.stringify(defaultState));
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || saved.version !== 1) return cloneDefault();
      return {
        ...cloneDefault(),
        ...saved,
        completed: { ...defaultState.completed, ...(saved.completed || {}) },
        lessonProgress: saved.lessonProgress || {},
        learningStars: Number.isSafeInteger(saved.learningStars) && saved.learningStars >= 0 ? saved.learningStars : 0,
        // 场景归一化：MVP 只有奶茶店。旧存档里可能是 ""（从没选过），一律落到奶茶店，
        // 否则家长中心的场景选择器会一个都不高亮，看着像「没选」。已明确选过的美甲店
        // （"nail-artist"）保留原样 —— 这里只纠「没选」，不覆盖用户的选择。
        // 不动 version：这是纠偏，不是改 schema，不该触发存档重置。
        scenario: businessScenarios[saved.scenario] ? saved.scenario : "bubble-tea",
        market: {
          ...defaultState.market,
          ...(saved.market || {}),
          holdings: { ...defaultState.market.holdings, ...(saved.market?.holdings || {}) },
          prices: { ...defaultState.market.prices, ...(saved.market?.prices || {}) },
        },
      };
    } catch (error) {
      return cloneDefault();
    }
  }

  let state = loadState();
  let activeMission = "";
  // 「清除本机进度」按下后必须彻底停止写入：reload / 关闭页面都会触发 pagehide，
  // 而 pagehide 的监听正是 saveState()，会把刚删掉的存档原样写回去。
  let storageDisabled = false;
  let paused = false;
  let activeSeconds = 0;
  let lastInteraction = Date.now();
  let returnFocus = null;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const isEnglish = () => state.language === "en";
  const t = (zh, en) => (isEnglish() ? en : zh);

  // 全站唯一的「主动播报」出口（对应 index.html 的 #a11y-announcer）。
  // 只播没有自带 role="status" 的事件。先清空再写，是为了让连续两次相同的文案
  // 也能被再播一次 —— 直接改 textContent 时，值没变则 DOM 不变、播报不会触发。
  // 用 optional chaining 调用：lessons.js 比本文件先加载，运行时才拿得到这个函数。
  window.mqAnnounce = (message) => {
    const box = document.getElementById("a11y-announcer");
    if (!box || !message) return;
    box.textContent = "";
    window.setTimeout(() => { box.textContent = message; }, 60);
  };

  // 视图名与侧栏导航一致：切换后播报的就是「刚刚点的那一项」，
  // 避免孩子点了「我的成就」却听到另一串词。
  const VIEW_NAMES = {
    home: ["经营地图", "Business map"],
    badges: ["我的成就", "My badges"],
    parent: ["家长中心", "Parent centre"],
  };
  const scenario = () => businessScenarios[state.scenario] || businessScenarios["bubble-tea"];
  const guided = window.MoneyLessons.create({ state, english: isEnglish, save: saveState, complete: finishLesson });

  // 结课：首次完成走「发现入手」仪式（峰终定律里的那个「终」——
  // 不能让孩子离开时只带走一行提示文字），复习完成则安静返回地图。
  function finishLesson(id) {
    if (!state.completed[id]) {
      state.completed[id] = true;
      state.xp += 20;
      saveState();
      showCeremony(id);
      return;
    }
    closeMission();
    showView("home");
    $("#learning-notice").textContent = t("这一课学完了。起来伸伸懒腰，下次回来接着学。", "Lesson complete. Stretch and take a break; come back when you are ready.");
    $(`[data-open-mission="${id}"]`)?.focus();
  }

  function showCeremony(id) {
    const lesson = LESSONS.find((item) => item.id === id);
    const index = LESSONS.indexOf(lesson) + 1;
    $("#ceremony-kicker").textContent = t(`第 ${index} 课 · 小小发现入手`, `Lesson ${index} · A little discovery collected`);
    $("#ceremony-icon").innerHTML = lesson.icon;
    $("#ceremony-title").textContent = isEnglish() ? lesson.title.en : lesson.title.zh;
    $("#ceremony-copy").textContent = t("你的每一次发现，都留在了地图上。", "Every discovery you make stays on your map.");
    $("#ceremony-xp").textContent = t("+20 经验值", "+20 XP");
    $("#ceremony-stars").textContent = `★ ${state.learningStars || 0}`;
    $("#ceremony-go").dataset.lesson = id;
    $("#lesson-ceremony").hidden = false;
    $("#ceremony-go").focus();
    // 礼花只在这里放：庆祝的是「孩子的成就」，不是「他打开了网页」。
    window.mqConfetti?.cannons();
    window.TeachingMedia.playSuccessSound();
  }

  function saveState() {
    if (storageDisabled) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // The game still works for the current session if storage is unavailable.
    }
  }

  function setMessage(element, zh, en, success = false) {
    if (!element) return;
    element.dataset.messageZh = zh;
    element.dataset.messageEn = en;
    element.textContent = t(zh, en);
    element.classList.toggle("is-success", success);
  }

  function refreshMessages() {
    $$('[data-message-zh]').forEach((element) => {
      element.textContent = t(element.dataset.messageZh, element.dataset.messageEn);
    });
  }

  function level() {
    return Math.min(3, 1 + Math.floor(state.xp / XP_PER_LEVEL));
  }

  function completedCount() {
    return LESSONS.filter((lesson) => state.completed[lesson.id]).length;
  }

  function isUnlocked(task) {
    if (task === "lesson-1") return true;
    const index = TASKS.indexOf(task);
    if (index < 1) return false;
    if (!state.completed[TASKS[index - 1]]) return false;
    return true;
  }

  function setLanguage(language) {
    state.language = language === "en" ? "en" : "zh-CN";
    document.documentElement.lang = state.language;
    document.title = t("财商经营岛｜智行未来学院", "Money Quest Island | Future Life Skills");
    $$('[data-language]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === state.language)));
    $$('[data-placeholder-zh]').forEach((input) => { input.placeholder = t(input.dataset.placeholderZh, input.dataset.placeholderEn); });
    refreshMessages();
    renderAll();
    if (activeMission.startsWith("lesson-")) guided.render();
    renderStudyClock();
    saveState();
  }

  function renderPlayer() {
    const data = scenario();
    const name = state.nickname || t("小小店长", "Money Explorer");
    $("#player-name").textContent = name;
    $("#player-avatar").innerHTML = data.icon;
    $("#shop-name").textContent = isEnglish() ? data.shopEn : data.shopZh;
    $("#shop-brief").textContent = t("小芽：今天发现一点点就好！团团：一起聊聊，再试试吧。", "Sunny: One little discovery is plenty today! Tuan: Let's chat, then try it.");
    $("#store-sign").textContent = data.sign;
    $("#store-emoji").innerHTML = data.icon;
    // 家长中心的场景选择器与昵称框：进入视图时回填当前存档，避免显示成「未选」。
    $$('[data-career]').forEach((choice) => {
      const selected = choice.dataset.career === state.scenario;
      choice.classList.toggle("is-selected", selected);
      choice.setAttribute("aria-checked", String(selected));
    });
    const nickname = $("#nickname");
    if (nickname && document.activeElement !== nickname) nickname.value = state.nickname || "";
  }

  // 首页最上面的「继续学习」条。回访用户的第一眼应当是「下一步学什么」——
  // 8–12 岁的用户不会去读顶栏的进度数字，只会找那个能按的按钮。
  // 读存档算出第一个未完成的节点；全学完时改成去成就页，不再假装还有下一步。
  function nextLesson() {
    return LESSONS.find((lesson) => !state.completed[lesson.id]) || null;
  }

  function renderContinue() {
    const bar = $("#continue-bar");
    const go = $("#continue-go");
    if (!bar || !go) return;
    const kicker = $("#continue-kicker");
    const title = $("#continue-title");
    const meta = $("#continue-meta");
    const lesson = nextLesson();
    if (!lesson) {
      kicker.textContent = t("基础课已全部完成", "Foundation course complete");
      title.textContent = t("六节课都学完了", "All six lessons done");
      meta.textContent = t("可以去市场实验室，或者看看已经收集到的徽章。", "Try the market lab, or look at the badges you collected.");
      go.textContent = t("看看我的成就 →", "See my badges →");
      go.dataset.continueTarget = "badges";
      return;
    }
    const index = LESSONS.indexOf(lesson) + 1;
    const inProgress = (state.lessonProgress[lesson.id]?.step || 0) > 0;
    // 文案自带「接着上次 / 下一步」：孩子先认出这两个字，再读课名。
    kicker.textContent = inProgress
      ? t(`接着上次 · 第 ${index} / ${LESSONS.length} 课`, `Pick up · lesson ${index} of ${LESSONS.length}`)
      : t(`下一步 · 第 ${index} / ${LESSONS.length} 课`, `Next up · lesson ${index} of ${LESSONS.length}`);
    title.textContent = isEnglish() ? lesson.title.en : lesson.title.zh;
    meta.textContent = isEnglish() ? lesson.goal.en : lesson.goal.zh;
    go.textContent = inProgress ? t("继续学习 →", "Continue →") : t("开始这一课 →", "Start this lesson →");
    go.dataset.continueTarget = lesson.id;
  }

  function renderStats() {
    $("#cash-stat").textContent = `${completedCount()} / 6`;
    $("#reputation-stat").textContent = Math.floor(activeSeconds / 60);
    $("#reputation-label").textContent = t("一次学一件事", "One idea at a time");
    $("#level-stat").textContent = level();
    $("#mission-count").textContent = `${completedCount()} / 6`;
    const levelProgress = state.xp >= XP_PER_LEVEL * 2 ? XP_PER_LEVEL : state.xp % XP_PER_LEVEL;
    $("#xp-label").textContent = `${levelProgress} / ${XP_PER_LEVEL} XP`;
    $("#xp-fill").style.width = `${Math.min(100, (levelProgress / XP_PER_LEVEL) * 100)}%`;
    $("#xp-hint").textContent = level() >= 3
      ? t("已达到基础版最高等级", "Base version maximum reached")
      : t(`再获得${XP_PER_LEVEL - levelProgress} XP升级`, `${XP_PER_LEVEL - levelProgress} XP to level up`);
  }

  function renderTaskMap() {
    $("#mission-road").innerHTML = LESSONS.map((lesson, index) => `<article class="mission-node" data-task-card="${lesson.id}"><div class="node-top"><span class="node-number">0${index + 1}</span><span class="node-status" data-task-status="${lesson.id}"></span></div><span class="node-icon" aria-hidden="true">${lesson.icon}</span><h3>${t(lesson.title.zh, lesson.title.en)}</h3><p>${t(lesson.goal.zh, lesson.goal.en)}</p><div class="node-reward">${t("故事 · 示范 · 陪练 · 自己试", "Story · Demo · Practice · Your turn")}</div><button type="button" data-open-mission="${lesson.id}"></button></article>`).join("") + `<article class="mission-node market-node" data-task-card="mission-4"><div class="node-top"><span class="node-number">${t("拓展", "EXTRA")}</span><span class="node-status" data-task-status="mission-4"></span></div><span class="node-icon">${window.mqIcon("chart-up")}</span><h3>${t("市场实验室", "Market lab")}</h3><p>${t("六课之后，可与家长一起体验。不计入基础课完成度。", "Optional after six lessons, with an adult. Not required for the foundation course.")}</p><button type="button" data-open-mission="mission-4"></button></article>`;
    $$('[data-open-mission]', $("#mission-road")).forEach((button) => button.addEventListener("click", () => openMission(button.dataset.openMission)));
    TASKS.forEach((task, index) => {
      const card = $(`[data-task-card="${task}"]`);
      const button = $(`[data-open-mission="${task}"]`);
      const status = $(`[data-task-status="${task}"]`);
      const unlocked = isUnlocked(task);
      const complete = state.completed[task];
      card.classList.toggle("is-locked", !unlocked);
      card.classList.toggle("is-complete", complete);
      button.disabled = !unlocked;
      if (complete) {
        status.textContent = "✓ " + t("已完成", "COMPLETE");
        button.textContent = t("再次查看", "Review mission");
      } else if (unlocked) {
        status.textContent = t("可开始", "READY");
        button.textContent = t(state.lessonProgress[task]?.step ? "接着上次学 →" : "陪小芽开始 →", state.lessonProgress[task]?.step ? "Continue learning →" : "Start with Sunny →");
      } else {
        // 锁图标由图标系统统一 aria-hidden，读屏完全读不到 —— 补一段只给读屏的
        // 状态文字，否则「这一课还锁着」在无障碍树里根本不存在。
        status.innerHTML = window.mqIcon("lock") + `<span class="sr-only">${t("未解锁", "Locked")}</span>`;
        // 解锁文案统一（提案 §5.2）：① 说清前置条件的具体名字，不用「完成上一关」这种
        // 要靠记忆推断的说法；② 阶段门用「还差 X」而不是「达到 Y」——前者是进度，后者是门槛。
        // 前提：TASKS = 6 节课 + mission-4，而 isUnlocked() 是纯顺序解锁，
        // 所以市场实验室的真实门槛是「学完第 6 课」，与等级、徽章都无关。
        if (task === "mission-4") {
          const remaining = LESSONS.filter((lesson) => !state.completed[lesson.id]).length;
          button.textContent = t(`还差 ${remaining} 节基础课`, `${remaining} foundation lessons to go`);
        } else {
          const at = LESSONS.findIndex((lesson) => lesson.id === task);
          const previous = at > 0 ? LESSONS[at - 1] : null;
          const previousName = previous ? (isEnglish() ? previous.title.en : previous.title.zh) : "";
          button.textContent = t(`先完成「${previousName}」`, `Finish "${previousName}" first`);
        }
      }
      // 按钮名要自带节点名：按「按钮」跳读时不会带上卡片里的 h3，
      // 否则六个锁着的节点读出来全是一模一样的「先学会前一课」。
      const nodeName = card.querySelector("h3")?.textContent.trim() || "";
      button.setAttribute("aria-label", `${nodeName}${t("：", ": ")}${button.textContent.trim()}`);
    });
    const marketUnlocked = isUnlocked("mission-4");
    $("#market-nav").disabled = !marketUnlocked;
    $("#market-nav i").innerHTML = marketUnlocked ? "→" : window.mqIcon("lock");
    // 顶栏这个入口锁着时也要说明原因，否则读屏只报「市场实验室，不可用」。
    // 跟着 renderTaskMap 走，切语言时会一起刷新，不会留下另一种语言的旧字符串。
    if (marketUnlocked) $("#market-nav").removeAttribute("aria-label");
    else {
      const remainingLessons = LESSONS.filter((lesson) => !state.completed[lesson.id]).length;
      $("#market-nav").setAttribute("aria-label", t(`市场实验室：还差 ${remainingLessons} 节基础课`, `Market lab: ${remainingLessons} foundation lessons to go`));
    }
  }

  function renderBadges() {
    $(".badge-grid").innerHTML = `<article class="is-earned learning-stars-badge"><span aria-hidden="true">★</span><strong>${state.learningStars} ${t("颗学习星星", "learning stars")}</strong><small>${t("每次完成一道练习获得一颗，复习也算。星星不是钱，也不代表投资能力。", "One for each successful exercise, including review. Stars are not money or a measure of investing ability.")}</small></article>` + LESSONS.map((lesson) => `<article class="${state.completed[lesson.id] ? "is-earned" : ""}"><span>${lesson.icon}</span><strong>${t(lesson.title.zh, lesson.title.en)}</strong><small>${state.completed[lesson.id] ? t("我已经练习过", "I have practised this") : t("一步一步来", "One step at a time")}</small></article>`).join("");
    $("#parent-progress").textContent = t(`基础课完成 ${completedCount()} / 6；本机累计有效学习约 ${Math.floor(state.learningSeconds / 60)} 分钟。时长不用于解锁。`, `${completedCount()} / 6 foundation lessons completed; about ${Math.floor(state.learningSeconds / 60)} active minutes on this device. Time does not unlock lessons.`);
  }

  function renderShell() {
    $("#start-screen").hidden = state.started;
    $("#game-app").hidden = !state.started;
    if (state.started) renderAll();
  }

  // 启动页永远是第一屏：存档不再能跳过它。回访用户省下的那一次点击，代价是孩子
  // 再也看不到「开始学习」这个入口 —— MVP 的验收口径反过来，先看见它。
  // 存档在这里只剩一个职责：进地图后「继续学习」条指向哪一课。
  // 礼花已从启动页挪到结课仪式（showCeremony）：分量应该花在成就上。
  function showStartScreen() {
    $("#start-screen").hidden = false;
    $("#game-app").hidden = true;
  }

  function renderAll() {
    if (!state.started) return;
    renderPlayer();
    renderContinue();
    renderStats();
    renderTaskMap();
    renderBadges();
    if (activeMission === "mission-2") renderSupplies();
    if (activeMission === "mission-3") renderCustomer();
    if (activeMission === "mission-4") renderMarket();
  }

  function showView(view) {
    if (view === "market") {
      if (isUnlocked("mission-4")) openMission("mission-4");
      return;
    }
    $$('[data-game-view]').forEach((section) => section.classList.toggle("is-active", section.dataset.gameView === view));
    $$('[data-view]').forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    $("#game-sidebar").classList.remove("is-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const viewName = VIEW_NAMES[view];
    if (viewName) window.mqAnnounce(t(viewName[0], viewName[1]));
  }

  function openMission(task) {
    if (!isUnlocked(task)) return;
    window.TeachingMedia.dispose();
    window.MoneyVideo?.dispose();
    returnFocus = document.activeElement;
    paused = false;
    $("#study-pause").hidden = true;
    $(".mission-content").inert = false;
    lastInteraction = Date.now();
    activeMission = task;
    // 课程页与关卡页共用一条 sticky 顶栏。课程页只需要「在哪一步 / 想休息」，
    // 让 CSS 能用 body.is-lesson 收掉关卡才需要的文案。
    document.body.classList.toggle("is-lesson", task.startsWith("lesson-"));
    $("#mission-layer").hidden = false;
    $$('[data-mission]').forEach((screen) => screen.classList.toggle("is-active", screen.dataset.mission === task));
    if (task.startsWith("lesson-")) {
      $("#guided-lesson").classList.add("is-active");
      guided.open(task);
      document.body.style.overflow = "hidden";
      $("#game-app").inert = true;
      $("#lesson-heading").focus({ preventScroll: true });
      $("#mission-layer").scrollTop = 0;
      return;
    }
    $("#guided-lesson").classList.remove("is-active");
    $("#mission-progress-fill").style.width = "100%";
    $("#mission-progress-label").textContent = t("课后拓展", "Optional extra");
    document.body.style.overflow = "hidden";
    $("#mission-layer").scrollTop = 0;
    $("#game-app").inert = true;
    $("#mission-back").focus();
    const missionTitle = document.querySelector('[data-mission="' + task + '"] .mission-title h2');
    window.mqAnnounce(missionTitle ? missionTitle.textContent.trim() : "");
    if (task === "mission-2") renderSupplies();
    if (task === "mission-3") renderCustomer();
    if (task === "mission-4") renderMarket();
  }

  function closeMission() {
    window.TeachingMedia.dispose();
    window.MoneyVideo?.dispose();
    activeMission = "";
    document.body.classList.remove("is-lesson");
    paused = false;
    $("#game-app").inert = false;
    saveState();
    $("#mission-layer").hidden = true;
    document.body.style.overflow = "";
    renderAll();
    if (returnFocus?.isConnected) returnFocus.focus();
  }

  function renderStudyClock() {
    const mins = Math.floor(activeSeconds / 60), secs = activeSeconds % 60;
    $("#study-time").textContent = t(`本次 ${mins}:${String(secs).padStart(2, "0")}`, `This visit ${mins}:${String(secs).padStart(2, "0")}`);
    $("#pause-study").textContent = t("暂停休息", "Take a break");
    $("#pause-title").textContent = t("休息一下，进度帮你留着", "Take a break. Your place is saved.");
    $("#resume-study").textContent = t("我准备好了，继续", "I'm ready to continue");
    $("#reputation-stat").textContent = mins;
  }

  function initialiseStudyClock() {
    ["pointerdown", "keydown", "input", "scroll"].forEach((event) => document.addEventListener(event, () => { lastInteraction = Date.now(); }, { passive: true, capture: true }));
    document.addEventListener("visibilitychange", () => { lastInteraction = Date.now(); saveState(); });
    window.addEventListener("pagehide", saveState);
    $("#pause-study").addEventListener("click", () => {
      window.TeachingMedia.suspend();
      window.MoneyVideo?.pause();
      paused = true; saveState(); $("#study-pause").hidden = false;
      $(".mission-content").inert = true; $("#resume-study").focus();
    });
    $("#resume-study").addEventListener("click", () => {
      paused = false; lastInteraction = Date.now(); $("#study-pause").hidden = true;
      $(".mission-content").inert = false; $("#pause-study").focus();
    });
    setInterval(() => {
      if (!activeMission || paused || document.hidden || Date.now() - lastInteraction > 60000) return;
      activeSeconds += 1; state.learningSeconds += 1; renderStudyClock();
      if (activeSeconds % 10 === 0) saveState();
      if (activeSeconds >= 900) $("#break-reminder").hidden = false;
    }, 1000);
  }

  const rewardData = {
    "mission-1": { badge: window.mqIcon("brain"), titleZh: "钱的流动看懂了！", titleEn: "Money flow understood!", copyZh: "+30 XP　+20经营星币", copyEn: "+30 XP and +20 business coins" },
    "mission-2": { badge: window.mqIcon("package"), titleZh: "第一次采购完成！", titleEn: "First supply run complete!", copyZh: "+30 XP　解锁开门营业", copyEn: "+30 XP and Open for Business unlocked" },
    "mission-3": { badge: window.mqIcon("store"), titleZh: "你会经营现金了！", titleEn: "You managed business cash!", copyZh: "+40 XP　解锁市场实验室", copyEn: "+40 XP and Market Lab unlocked" },
    "mission-4": { badge: window.mqIcon("chart-up"), titleZh: "完成一次风险观察", titleEn: "Risk observation complete", copyZh: "+40 XP　做过练习不等于掌握真实投资", copyEn: "+40 XP · Practice is not real investing expertise" },
  };

  function showReward(task) {
    const reward = rewardData[task];
    $("#reward-title").textContent = t(reward.titleZh, reward.titleEn);
    $("#reward-badge").innerHTML = reward.badge;
    $("#reward-copy").textContent = t(reward.copyZh, reward.copyEn);
    $("#reward-popover").hidden = false;
    // 星币到账：播放器与动画数据在这一刻才按需加载，首屏不含它们
    window.MoneyRewardCoin?.play($("#reward-coin"));
    window.TeachingMedia.playSuccessSound();
    $("#collect-reward").focus();
  }

  function completeTask(task, changes = {}) {
    if (state.completed[task]) return false;
    state.completed[task] = true;
    state.xp += changes.xp || 0;
    state.cash += changes.cash || 0;
    state.reputation = Math.max(0, Math.min(100, state.reputation + (changes.reputation || 0)));
    saveState();
    renderAll();
    showReward(task);
    return true;
  }

  function initialiseQuiz() {
    $$('[data-quiz]').forEach((card) => {
      $$('[data-answer]', card).forEach((button) => {
        button.addEventListener("click", () => {
          if (state.completed["mission-1"]) return;
          state.quizAnswers[card.dataset.quiz] = button.dataset.answer;
          $$('[data-answer]', card).forEach((choice) => choice.classList.toggle("is-selected", choice === button));
          card.classList.remove("is-correct", "is-incorrect");
          saveState();
        });
      });
    });

    $("#submit-quiz").addEventListener("click", () => {
      const cards = $$('[data-quiz]');
      if (Object.keys(state.quizAnswers).length < cards.length) {
        setMessage($("#mission-1-feedback"), "还有题目没有回答。先按顺序完成三步。", "Some questions are unanswered. Complete all three steps first.");
        return;
      }
      let score = 0;
      cards.forEach((card) => {
        const correct = state.quizAnswers[card.dataset.quiz] === card.dataset.correct;
        card.classList.toggle("is-correct", correct);
        card.classList.toggle("is-incorrect", !correct);
        if (correct) score += 1;
      });
      if (score < 2) {
        setMessage($("#mission-1-feedback"), `答对${score}/3。再看一次：收入是流入，成本是流出，利润是剩余。`, `${score}/3 correct. Remember: revenue comes in, cost goes out and profit remains.`);
        return;
      }
      setMessage($("#mission-1-feedback"), `答对${score}/3。你已经理解第一笔钱的流动。`, `${score}/3 correct. You understand your first money flow.`, true);
      completeTask("mission-1", { xp: 30, cash: 20 });
    });

    $$('[data-quiz]').forEach((card) => {
      const saved = state.quizAnswers[card.dataset.quiz];
      if (saved) $(`[data-answer="${saved}"]`, card)?.classList.add("is-selected");
    });
  }

  function supplyTotal() {
    return scenario().supplies.filter((item) => state.supplySelected.includes(item.key)).reduce((total, item) => total + item.cost, 0);
  }

  function renderSupplies() {
    const grid = $("#supply-grid");
    grid.replaceChildren();
    scenario().supplies.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "supply-card";
      button.dataset.key = item.key;
      button.dataset.essential = String(item.essential);
      button.classList.toggle("is-selected", state.supplySelected.includes(item.key));
      button.disabled = state.completed["mission-2"];
      button.innerHTML = `<span>${item.icon}</span><span><strong>${isEnglish() ? item.en : item.zh}</strong><small>${item.essential ? t("开店必需", "Essential") : t("特色升级", "Optional upgrade")}</small></span><strong>${item.cost} ${window.mqIcon("coin")}</strong><i>${item.essential ? t("需要", "NEED") : t("升级", "UPGRADE")}</i>`;
      button.addEventListener("click", () => {
        state.supplySelected = state.supplySelected.includes(item.key)
          ? state.supplySelected.filter((key) => key !== item.key)
          : [...state.supplySelected, item.key];
        saveState();
        renderSupplies();
      });
      grid.append(button);
    });
    const total = supplyTotal();
    const left = 35 - total;
    $("#supply-fill").style.width = `${Math.min(100, (total / 35) * 100)}%`;
    $("#supply-fill").classList.toggle("is-over", total > 35);
    $("#supply-left").textContent = left >= 0 ? t(`还剩${left}星币`, `${left} coins left`) : t(`超出${Math.abs(left)}星币`, `${Math.abs(left)} coins over`);
    $("#submit-supplies").disabled = state.completed["mission-2"];
    if (state.completed["mission-2"]) $("#submit-supplies").textContent = t("采购已完成", "Supply run complete");
  }

  function initialiseSupplies() {
    $("#submit-supplies").addEventListener("click", () => {
      const supplies = scenario().supplies;
      const essentials = supplies.filter((item) => item.essential).map((item) => item.key);
      const upgrades = supplies.filter((item) => !item.essential).map((item) => item.key);
      const hasAllEssentials = essentials.every((key) => state.supplySelected.includes(key));
      const upgradeCount = upgrades.filter((key) => state.supplySelected.includes(key)).length;
      const total = supplyTotal();
      if (!hasAllEssentials) {
        setMessage($("#mission-2-feedback"), "必需材料还没有买齐。先保证小店能够开门。", "Some essential supplies are missing. Make sure the shop can open first.");
        return;
      }
      if (upgradeCount !== 1) {
        setMessage($("#mission-2-feedback"), "请选择一种特色升级，不需要一次把所有想要的都买下。", "Choose one special upgrade. You do not need to buy every want at once.");
        return;
      }
      if (total > 35) {
        setMessage($("#mission-2-feedback"), `现在要花${total}星币，超过35星币预算。换一种升级试试。`, `The order costs ${total} coins, above the 35-coin budget. Try another upgrade.`);
        return;
      }
      setMessage($("#mission-2-feedback"), `采购成功：花费${total}星币，保留${35 - total}星币应对变化。`, `Supply run complete: ${total} spent and ${35 - total} kept for surprises.`, true);
      completeTask("mission-2", { xp: 30, cash: -total });
    });
  }

  function currentCustomer() {
    return scenario().customers[state.customerIndex] || scenario().customers[0];
  }

  function renderCustomer() {
    const customer = currentCustomer();
    const selectedKey = state.customerAnswers[state.customerIndex];
    $("#customer-avatar").innerHTML = customer.avatar;
    $("#customer-count").textContent = t(`顾客 ${state.customerIndex + 1} / 3`, `CUSTOMER ${state.customerIndex + 1} / 3`);
    $("#customer-title").textContent = isEnglish() ? customer.titleEn : customer.titleZh;
    $("#customer-story").textContent = isEnglish() ? customer.storyEn : customer.storyZh;
    const options = $("#customer-options");
    options.replaceChildren();
    customer.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.key = option.key;
      button.textContent = isEnglish() ? option.en : option.zh;
      button.classList.toggle("is-selected", selectedKey === option.key);
      button.disabled = Boolean(selectedKey) || state.completed["mission-3"];
      button.addEventListener("click", () => selectCustomerOption(option));
      options.append(button);
    });
    const feedback = $("#decision-feedback");
    if (selectedKey) {
      const selected = customer.options.find((option) => option.key === selectedKey);
      feedback.hidden = false;
      feedback.classList.toggle("is-wrong", !selected.correct);
      $("#decision-icon").textContent = selected.correct ? "✓" : "!";
      $("#decision-title").textContent = selected.correct ? t("合理的经营决定", "Sound business decision") : t("看看这个决定的后果", "Consider the consequence");
      $("#decision-copy").textContent = isEnglish() ? selected.feedbackEn : selected.feedbackZh;
      $("#next-customer").hidden = state.completed["mission-3"];
      $("#next-customer").textContent = state.customerIndex < 2 ? t("下一位顾客 →", "Next customer →") : t("查看经营结果 →", "See business result →");
    } else {
      feedback.hidden = true;
      $("#next-customer").hidden = true;
    }
    const score = Object.entries(state.customerAnswers).filter(([index, key]) => {
      const item = scenario().customers[Number(index)];
      return item?.options.find((option) => option.key === key)?.correct;
    }).length;
    $("#customer-score").textContent = `${score} / 3`;
  }

  function selectCustomerOption(option) {
    if (state.customerAnswers[state.customerIndex] || state.completed["mission-3"]) return;
    state.customerAnswers[state.customerIndex] = option.key;
    saveState();
    renderCustomer();
  }

  function initialiseCustomers() {
    $("#next-customer").addEventListener("click", () => {
      if (state.customerIndex < 2) {
        state.customerIndex += 1;
        saveState();
        renderCustomer();
        return;
      }
      const score = Object.entries(state.customerAnswers).filter(([index, key]) => {
        const item = scenario().customers[Number(index)];
        return item?.options.find((option) => option.key === key)?.correct;
      }).length;
      if (score < 2) {
        setMessage($("#mission-3-feedback"), `本轮做出${score}/3次合理决定。重新尝试，注意利润、诚信和现金流。`, `${score}/3 sound decisions. Try again and watch profit, honesty and cash flow.`);
        state.customerIndex = 0;
        state.customerAnswers = {};
        saveState();
        renderCustomer();
        return;
      }
      setMessage($("#mission-3-feedback"), `经营成功：${score}/3次合理决定。你知道利润不是唯一目标。`, `Business complete: ${score}/3 sound decisions. You know profit is not the only goal.`, true);
      completeTask("mission-3", { xp: 40, cash: 30 + score * 4, reputation: score * 5 });
    });
  }

  function portfolioValue() {
    return state.market.cash + companies.reduce((sum, company) => sum + state.market.holdings[company.key] * state.market.prices[company.key], 0);
  }

  function companyCount() {
    return companies.filter((company) => state.market.holdings[company.key] > 0).length;
  }

  function renderMarket() {
    $("#market-cash").innerHTML = `${state.market.cash} ${window.mqIcon("coin")}`;
    $("#portfolio-value").innerHTML = `${portfolioValue()} ${window.mqIcon("coin")}`;
    $("#company-count").textContent = `${companyCount()} / 3`;
    const grid = $("#company-grid");
    grid.replaceChildren();
    companies.forEach((company) => {
      const price = state.market.prices[company.key];
      const held = state.market.holdings[company.key];
      const article = document.createElement("article");
      article.className = "company-card";
      const directionClass = state.market.ran ? (price > company.price ? "is-up" : "is-down") : "";
      article.innerHTML = `<header><span>${company.icon}</span><h2>${isEnglish() ? company.en : company.zh}</h2><p>${isEnglish() ? company.riskEn : company.riskZh}</p></header><section><div class="company-meta"><span>${t("每股价格", "PRICE PER SHARE")}<strong class="${directionClass}">${price} ${window.mqIcon("coin")}</strong></span><span>${t("持有", "OWNED")}<strong>${held} ${t("股", "shares")}</strong></span></div><div class="company-actions"><button type="button" data-buy>${t("买1股", "Buy 1")}</button><button type="button" data-sell>${t("卖1股", "Sell 1")}</button></div></section>`;
      const buy = $("[data-buy]", article);
      const sell = $("[data-sell]", article);
      buy.disabled = state.market.ran || state.completed["mission-4"] || state.market.cash < price;
      sell.disabled = state.market.ran || state.completed["mission-4"] || held < 1;
      buy.addEventListener("click", () => tradeShare(company.key, 1));
      sell.addEventListener("click", () => tradeShare(company.key, -1));
      grid.append(article);
    });
    $("#run-market").disabled = state.market.ran || state.completed["mission-4"];
    $("#market-event").hidden = !state.market.ran;
    $("#risk-check").hidden = !state.market.ran;
    if (state.market.ran) {
      $("#market-event-copy").textContent = t(
        "水务需求稳定，安心水务上涨；新游戏延期，星火游戏下跌；公交客流增加，绿行交通上涨。组合仍可能上涨或下跌。",
        "Water demand held steady, Spark Play delayed a game, and Green Wheels gained passengers. A portfolio can still rise or fall.",
      );
      setMessage($("#market-feedback"), `一周后组合价值为${portfolioValue()}实验币。价格变化不等于保证未来结果。`, `After one week, the portfolio is worth ${portfolioValue()} lab coins. Past movement does not guarantee future results.`, true);
    }
    $$('[data-risk-answer]').forEach((button) => button.classList.toggle("is-selected", state.market.riskAnswer === button.dataset.riskAnswer));
    renderMarketDialogue();
  }

  function renderMarketDialogue() {
    if (activeMission !== "mission-4") return;
    const screen = $("#mission-4"), key = `${state.language}:${state.market.ran}:${state.market.riskAnswer || ""}`;
    if (screen.dataset.dialogueKey === key && screen.querySelector(".character-conversation")) return;
    screen.dataset.dialogueKey = key;
    if (state.market.dialogueKey !== key) { state.market.dialogueKey = key; state.market.dialogue = 0; }
    window.TeachingMedia.mount(screen, {
      english: isEnglish(), stage: 0, text: "",
      dialogue: window.MoneyDialogues.market(isEnglish(), state.market.ran, portfolioValue(), state.market.riskAnswer),
      dialogueIndex: state.market.dialogue || 0,
      onDialogueChange(index) { state.market.dialogue = index; saveState(); },
    });
  }

  function tradeShare(key, amount) {
    if (state.market.ran || state.completed["mission-4"]) return;
    const price = state.market.prices[key];
    if (amount > 0 && state.market.cash >= price) {
      state.market.cash -= price;
      state.market.holdings[key] += 1;
    } else if (amount < 0 && state.market.holdings[key] > 0) {
      state.market.cash += price;
      state.market.holdings[key] -= 1;
    }
    saveState();
    renderMarket();
  }

  function initialiseMarket() {
    $("#run-market").addEventListener("click", () => {
      if (companyCount() < 2) {
        setMessage($("#market-feedback"), "至少选择两家不同公司。把全部实验币放在一家公司会集中风险。", "Choose at least two companies. Putting everything in one company concentrates risk.");
        return;
      }
      state.market.ran = true;
      companies.forEach((company) => { state.market.prices[company.key] = company.nextPrice; });
      saveState();
      renderMarket();
    });

    $$('[data-risk-answer]').forEach((button) => {
      button.addEventListener("click", () => {
        if (!state.market.ran || state.completed["mission-4"]) return;
        state.market.riskAnswer = button.dataset.riskAnswer;
        saveState();
        renderMarket();
        if (state.market.riskAnswer === "yes") {
          setMessage($("#risk-feedback"), "再想一想：分散能减少单一公司的影响，但整个市场仍可能下跌。", "Think again: diversification reduces the impact of one company, but the whole market can still fall.");
          return;
        }
        setMessage($("#risk-feedback"), "正确。分散是在管理风险，不是保证赚钱。", "Correct. Diversification manages risk; it does not guarantee profit.", true);
        completeTask("mission-4", { xp: 40 });
      });
    });
  }

  function initialiseSetup() {
    // 场景选择器现在住在家长中心。切换场景只影响叙事外壳，不重置课程进度。
    $$('[data-career]').forEach((button) => {
      button.addEventListener("click", () => {
        state.scenario = button.dataset.career;
        saveState();
        renderAll();
      });
    });

    // 首次进入页已经精简为一个「开始学习」按钮，原来的角色创建表单
    // （场景选择 + 昵称 + 家长勾选 + 提交）整体下线：场景与昵称迁到家长中心，
    // 家长须知压成按钮下方一行小字。这里不再保留任何表单分支。
    const nickname = $("#nickname");
    nickname?.addEventListener("input", () => {
      state.nickname = nickname.value.trim().slice(0, 16);
      saveState();
      $("#player-name").textContent = state.nickname || t("小小店长", "Money Explorer");
    });
  }

  // 唯一入口：不问场景、不问昵称，点一下落到课程地图。
  // 刻意不再直接 openMission("lesson-1") —— 先给地图，让孩子自己挑：第 1 课本来就是
  // 解锁态、地图上第一张卡就是它，多一步却多一个「我在哪、还剩多少」的锚点。
  // 家长须知（本机保存 / 虚拟货币 / 非投资建议）压成按钮下的一行小字，不挡孩子。
  // 场景不在这里兜底：loadState() 已把「没选过」归一化成奶茶店（MVP 唯一场景）。
  function initialiseStart() {
    $("#start-learning")?.addEventListener("click", () => {
      state.started = true;
      saveState();
      renderShell();
      window.scrollTo(0, 0);
      // 落在「经营地图」而不是某个任务：showView 同时负责侧栏高亮、回顶和播报。
      showView("home");
    });
  }

  function initialiseNavigation() {
    $$('[data-language]').forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    $$('[data-go-home]').forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); showView("home"); }));
    $$('[data-view]').forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
    $$('[data-open-mission]').forEach((button) => button.addEventListener("click", () => openMission(button.dataset.openMission)));
    // 「继续学习」条的目标由 renderContinue() 每次渲染时写进 data-continue-target，
    // 所以点击那一刻再读，绑定时不缓存 —— 否则学完一课后就指向了旧的节点。
    $("#continue-go")?.addEventListener("click", (event) => {
      const target = event.currentTarget.dataset.continueTarget;
      if (!target) return;
      if (target === "badges") showView("badges");
      else openMission(target);
    });
    $("#mission-back").addEventListener("click", closeMission);
    // 结课仪式的唯一出口：关掉仪式、回到地图。焦点还给地图上这一课的节点，
    // 让键盘/读屏孩子从「刚刚完成的地方」继续。
    $("#ceremony-go").addEventListener("click", () => {
      const id = $("#ceremony-go").dataset.lesson;
      $("#lesson-ceremony").hidden = true;
      closeMission();
      showView("home");
      $("#learning-notice").textContent = t("这一课学完了。起来伸伸懒腰，下次回来接着学。", "Lesson complete. Stretch and take a break; come back when you are ready.");
      $(`[data-open-mission="${id}"]`)?.focus();
    });
    $("#collect-reward").addEventListener("click", () => {
      $("#reward-popover").hidden = true;
      window.MoneyRewardCoin?.stop();
      closeMission();
      showView("home");
    });
    $("#mobile-menu").addEventListener("click", () => $("#game-sidebar").classList.add("is-open"));
    $("#sidebar-close").addEventListener("click", () => $("#game-sidebar").classList.remove("is-open"));
    $("#reset-game").addEventListener("click", () => {
      if (!window.confirm(t("确定清除这台设备上的游戏进度吗？", "Clear game progress on this device?"))) return;
      // 先关闸，再删。少了这一步，下面那个 reload() 触发的 pagehide → saveState()
      // 会把存档原样写回来 —— 实测这个按钮在加闸门之前从来没有真正清除过进度。
      storageDisabled = true;
      try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* no-op */ }
      // 视频偏好里含「坏片黑名单」。不清掉的话，片子修好了也永远不会再试。
      try { if (window.MoneyVideo) localStorage.removeItem(window.MoneyVideo.PREF_KEY); } catch (error) { /* no-op */ }
      window.location.reload();
    });
  }

  function initialise() {
    // Old quiz screens are retained in source for the previous test, not in the beginner path.
    ["mission-1", "mission-2", "mission-3"].forEach((id) => { document.getElementById(id).hidden = true; });
    initialiseSetup();
    initialiseStart();
    initialiseNavigation();
    initialiseQuiz();
    initialiseSupplies();
    initialiseCustomers();
    initialiseMarket();
    initialiseStudyClock();
    setLanguage(state.language);
    // 这里刻意不调 renderShell() —— 它按 state.started 分流，会把有存档的回访用户
    // 直接送进游戏态、跳过启动页。启动页固定由 showStartScreen() 呈现。
    showStartScreen();

    // 视频清单提前拉取：挂载点是同步判定「这一步有没有片」的，
    // 清单晚到会让配了片的课节漏掉播放卡。契约见 docs/VIDEO-MODULE.md。
    window.MoneyVideo?.preload();

    if (document.documentElement.dataset.privatePreview !== "true" && "serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  initialise();
})();

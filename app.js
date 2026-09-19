(() => {
  "use strict";

  const STORAGE_KEY = "future-life-skills-money-game-v1";
  const TASKS = ["mission-1", "mission-2", "mission-3", "mission-4"];
  const XP_PER_LEVEL = 60;

  const businessScenarios = {
    "bubble-tea": {
      emoji: "🧋",
      shopZh: "星光奶茶铺",
      shopEn: "Star Bubble Tea",
      sign: "STAR TEA",
      briefZh: "从一杯奶茶开始，学习钱的流动、采购、定价和现金管理。",
      briefEn: "Start with one drink and learn money flow, supplies, pricing and cash management.",
      supplies: [
        { key: "tea", emoji: "🍵", zh: "茶底", en: "Tea base", cost: 8, essential: true },
        { key: "cups", emoji: "🥤", zh: "杯子和吸管", en: "Cups and straws", cost: 6, essential: true },
        { key: "milk", emoji: "🥛", zh: "牛奶", en: "Milk", cost: 9, essential: true },
        { key: "fruit", emoji: "🍓", zh: "水果口味", en: "Fruit flavour", cost: 12, essential: false },
        { key: "sign", emoji: "✨", zh: "手绘招牌", en: "Handmade sign", cost: 7, essential: false },
      ],
      customers: [
        {
          avatar: "🧒",
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
          avatar: "👧",
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
          avatar: "🧑",
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
      emoji: "💅",
      shopZh: "彩虹美甲屋",
      shopEn: "Rainbow Nail Studio",
      sign: "NAIL STUDIO",
      briefZh: "经营一家小小工作室，学习材料预算、服务定价和现金管理。",
      briefEn: "Run a small studio and learn materials budgets, service pricing and cash management.",
      supplies: [
        { key: "polish", emoji: "🎨", zh: "基础甲油", en: "Basic polish", cost: 8, essential: true },
        { key: "tools", emoji: "🧰", zh: "护理工具", en: "Care tools", cost: 6, essential: true },
        { key: "clean", emoji: "🫧", zh: "清洁用品", en: "Cleaning supplies", cost: 9, essential: true },
        { key: "glitter", emoji: "✨", zh: "闪粉套装", en: "Glitter set", cost: 12, essential: false },
        { key: "sign", emoji: "🪧", zh: "手绘招牌", en: "Handmade sign", cost: 7, essential: false },
      ],
      customers: [
        {
          avatar: "👧",
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
          avatar: "🧒",
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
          avatar: "🧑",
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
    { key: "water", emoji: "💧", zh: "安心水务", en: "Harbour Water", riskZh: "较低波动", riskEn: "Lower volatility", price: 10, nextPrice: 12 },
    { key: "games", emoji: "🤖", zh: "星火游戏", en: "Spark Play", riskZh: "较高波动", riskEn: "Higher volatility", price: 20, nextPrice: 14 },
    { key: "green", emoji: "🚌", zh: "绿行交通", en: "Green Wheels", riskZh: "中等波动", riskEn: "Medium volatility", price: 15, nextPrice: 18 },
  ];

  const defaultState = {
    version: 1,
    language: "zh-CN",
    started: false,
    nickname: "",
    scenario: "",
    cash: 120,
    reputation: 50,
    xp: 0,
    completed: { "mission-1": false, "mission-2": false, "mission-3": false, "mission-4": false },
    quizAnswers: {},
    supplySelected: [],
    customerIndex: 0,
    customerAnswers: {},
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

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const isEnglish = () => state.language === "en";
  const t = (zh, en) => (isEnglish() ? en : zh);
  const scenario = () => businessScenarios[state.scenario] || businessScenarios["bubble-tea"];

  function saveState() {
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
    return TASKS.filter((task) => state.completed[task]).length;
  }

  function isUnlocked(task) {
    if (task === "mission-1") return true;
    const index = TASKS.indexOf(task);
    if (index < 1) return false;
    if (!state.completed[TASKS[index - 1]]) return false;
    return task !== "mission-4" || level() >= 2;
  }

  function setLanguage(language) {
    state.language = language === "en" ? "en" : "zh-CN";
    document.documentElement.lang = state.language;
    document.title = t("财商经营岛｜智行未来学院", "Money Quest Island | Future Life Skills");
    $$('[data-language]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.language === state.language)));
    $$('[data-placeholder-zh]').forEach((input) => { input.placeholder = t(input.dataset.placeholderZh, input.dataset.placeholderEn); });
    refreshMessages();
    renderAll();
    saveState();
  }

  function renderPlayer() {
    const data = scenario();
    const name = state.nickname || t("小小店长", "Money Explorer");
    $("#player-name").textContent = name;
    $("#player-avatar").textContent = data.emoji;
    $("#shop-name").textContent = isEnglish() ? data.shopEn : data.shopZh;
    $("#shop-brief").textContent = isEnglish() ? data.briefEn : data.briefZh;
    $("#store-sign").textContent = data.sign;
    $("#store-emoji").textContent = data.emoji;
  }

  function renderStats() {
    $("#cash-stat").textContent = state.cash;
    $("#reputation-stat").textContent = state.reputation;
    $("#reputation-label").textContent = `${state.reputation} / 100`;
    $("#level-stat").textContent = level();
    $("#mission-count").textContent = `${completedCount()} / 4`;
    const levelProgress = state.xp >= XP_PER_LEVEL * 2 ? XP_PER_LEVEL : state.xp % XP_PER_LEVEL;
    $("#xp-label").textContent = `${levelProgress} / ${XP_PER_LEVEL} XP`;
    $("#xp-fill").style.width = `${Math.min(100, (levelProgress / XP_PER_LEVEL) * 100)}%`;
    $("#xp-hint").textContent = level() >= 3
      ? t("已达到基础版最高等级", "Base version maximum reached")
      : t(`再获得${XP_PER_LEVEL - levelProgress} XP升级`, `${XP_PER_LEVEL - levelProgress} XP to level up`);
  }

  function renderTaskMap() {
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
        button.textContent = t("开始任务", "Start mission");
      } else {
        status.textContent = "🔒";
        button.textContent = index === 3 ? t("完成经营关卡", "Finish business missions") : t("完成上一关", "Finish previous");
      }
    });
    const marketUnlocked = isUnlocked("mission-4");
    $("#market-nav").disabled = !marketUnlocked;
    $("#market-nav i").textContent = marketUnlocked ? "→" : "🔒";
  }

  function renderBadges() {
    const mapping = { profit: "mission-1", buyer: "mission-2", owner: "mission-3", market: "mission-4" };
    Object.entries(mapping).forEach(([badge, task]) => {
      $(`[data-badge="${badge}"]`).classList.toggle("is-earned", state.completed[task]);
    });
  }

  function renderShell() {
    $("#start-screen").hidden = state.started;
    $("#game-app").hidden = !state.started;
    if (state.started) renderAll();
  }

  function renderAll() {
    if (!state.started) return;
    renderPlayer();
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
  }

  function openMission(task) {
    if (!isUnlocked(task)) return;
    activeMission = task;
    $("#mission-layer").hidden = false;
    $$('[data-mission]').forEach((screen) => screen.classList.toggle("is-active", screen.dataset.mission === task));
    const index = TASKS.indexOf(task);
    $("#mission-progress-fill").style.width = `${(index + 1) * 25}%`;
    $("#mission-progress-label").textContent = `${index + 1} / 4`;
    document.body.style.overflow = "hidden";
    $("#mission-layer").scrollTop = 0;
    if (task === "mission-2") renderSupplies();
    if (task === "mission-3") renderCustomer();
    if (task === "mission-4") renderMarket();
  }

  function closeMission() {
    activeMission = "";
    $("#mission-layer").hidden = true;
    document.body.style.overflow = "";
    renderAll();
  }

  const rewardData = {
    "mission-1": { badge: "🧠", titleZh: "钱的流动看懂了！", titleEn: "Money flow understood!", copyZh: "+30 XP　+20经营星币", copyEn: "+30 XP and +20 business coins" },
    "mission-2": { badge: "📦", titleZh: "第一次采购完成！", titleEn: "First supply run complete!", copyZh: "+30 XP　解锁开门营业", copyEn: "+30 XP and Open for Business unlocked" },
    "mission-3": { badge: "🏪", titleZh: "你会经营现金了！", titleEn: "You managed business cash!", copyZh: "+40 XP　解锁市场实验室", copyEn: "+40 XP and Market Lab unlocked" },
    "mission-4": { badge: "📈", titleZh: "风险观察员徽章！", titleEn: "Risk Observer badge!", copyZh: "+40 XP　完成基础财商经营岛", copyEn: "+40 XP and base Money Quest complete" },
  };

  function showReward(task) {
    const reward = rewardData[task];
    $("#reward-title").textContent = t(reward.titleZh, reward.titleEn);
    $("#reward-badge").textContent = reward.badge;
    $("#reward-copy").textContent = t(reward.copyZh, reward.copyEn);
    $("#reward-popover").hidden = false;
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
      button.innerHTML = `<span>${item.emoji}</span><span><strong>${isEnglish() ? item.en : item.zh}</strong><small>${item.essential ? t("开店必需", "Essential") : t("特色升级", "Optional upgrade")}</small></span><strong>${item.cost} 🪙</strong><i>${item.essential ? t("需要", "NEED") : t("升级", "UPGRADE")}</i>`;
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
    $("#customer-avatar").textContent = customer.avatar;
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
    $("#market-cash").textContent = `${state.market.cash} 🪙`;
    $("#portfolio-value").textContent = `${portfolioValue()} 🪙`;
    $("#company-count").textContent = `${companyCount()} / 3`;
    const grid = $("#company-grid");
    grid.replaceChildren();
    companies.forEach((company) => {
      const price = state.market.prices[company.key];
      const held = state.market.holdings[company.key];
      const article = document.createElement("article");
      article.className = "company-card";
      const directionClass = state.market.ran ? (price > company.price ? "is-up" : "is-down") : "";
      article.innerHTML = `<header><span>${company.emoji}</span><h2>${isEnglish() ? company.en : company.zh}</h2><p>${isEnglish() ? company.riskEn : company.riskZh}</p></header><section><div class="company-meta"><span>${t("每股价格", "PRICE PER SHARE")}<strong class="${directionClass}">${price} 🪙</strong></span><span>${t("持有", "OWNED")}<strong>${held} ${t("股", "shares")}</strong></span></div><div class="company-actions"><button type="button" data-buy>${t("买1股", "Buy 1")}</button><button type="button" data-sell>${t("卖1股", "Sell 1")}</button></div></section>`;
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
    $$('[data-career]').forEach((button) => {
      button.addEventListener("click", () => {
        state.scenario = button.dataset.career;
        $$('[data-career]').forEach((choice) => {
          const selected = choice === button;
          choice.classList.toggle("is-selected", selected);
          choice.setAttribute("aria-checked", String(selected));
        });
      });
    });

    $("#player-setup").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!state.scenario) {
        setMessage($("#setup-feedback"), "请先选择一个模拟经营场景。", "Choose a business simulation first.");
        return;
      }
      if (!$("#parent-confirm").checked) {
        setMessage($("#setup-feedback"), "请由家长或监护人确认教育与隐私说明。", "A parent or guardian must confirm the education and privacy notice.");
        return;
      }
      state.nickname = $("#nickname").value.trim().slice(0, 16);
      state.started = true;
      saveState();
      renderShell();
      window.scrollTo(0, 0);
    });
  }

  function initialiseNavigation() {
    $$('[data-language]').forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
    $$('[data-go-home]').forEach((button) => button.addEventListener("click", (event) => { event.preventDefault(); showView("home"); }));
    $$('[data-view]').forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
    $$('[data-open-mission]').forEach((button) => button.addEventListener("click", () => openMission(button.dataset.openMission)));
    $("#mission-back").addEventListener("click", closeMission);
    $("#collect-reward").addEventListener("click", () => {
      $("#reward-popover").hidden = true;
      closeMission();
      showView("home");
    });
    $("#mobile-menu").addEventListener("click", () => $("#game-sidebar").classList.add("is-open"));
    $("#sidebar-close").addEventListener("click", () => $("#game-sidebar").classList.remove("is-open"));
    $("#reset-game").addEventListener("click", () => {
      if (!window.confirm(t("确定清除这台设备上的游戏进度吗？", "Clear game progress on this device?"))) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (error) { /* no-op */ }
      window.location.reload();
    });
  }

  function initialise() {
    initialiseSetup();
    initialiseNavigation();
    initialiseQuiz();
    initialiseSupplies();
    initialiseCustomers();
    initialiseMarket();
    setLanguage(state.language);
    renderShell();

    if (document.documentElement.dataset.privatePreview !== "true" && "serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  initialise();
})();

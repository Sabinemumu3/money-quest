/* Guided lessons: all money is fictional and each exercise has its own purse. */
(() => {
  "use strict";

  // 上一次已经播报过的「课 + 步」，见 render() 里的换步播报。
  let announcedStepKey = "";
  const L = (zh, en) => ({ zh, en });
  const item = (id, icon, name, cost) => ({ id, icon, name, cost });
  const option = (label, correct, feedback) => ({ label, correct, feedback });
  const lessons = [
    {
      id: "lesson-1", icon: window.mqIcon("wallet"), title: L("我的钱有多少？", "How much do I have?"),
      goal: L("买东西前，先看看自己的钱够不够。", "Check your money before choosing what to buy."),
      story: L("嗨，我是小芽，准备去野餐啦！你看，我的口袋里有 10 枚星币。面包香香的，果汁也想喝，还看到了喜欢的贴纸。哎，钱够不够呢？别着急，陪我一起数一数吧。", "Hi, I'm Sunny, and I'm going on a picnic! Look, I have 10 coins in my pocket. The bread smells lovely. I'd like some juice, and those stickers look fun too. Hmm, can I afford them all? Let's count together."),
      demo: [
        { amount: 10, title: L("先数一数", "Count first"), text: L("这 10 枚就是今天能用的钱。想买的东西再多，口袋里的钱也不会自己变多。", "These 10 coins are today's spending money. Wanting more things does not add more coins.") },
        { amount: 4, title: L("买了面包", "Buy the bread"), text: L("面包花了 6 枚。10 − 6 = 4，口袋里还剩 4 枚。", "Bread costs 6. 10 − 6 = 4: four coins remain.") },
        { amount: 1, title: L("还能买什么？", "What fits now?"), text: L("果汁要 3 枚，买得起；贴纸要 5 枚，现在不够。买果汁后还剩 1 枚。", "Juice costs 3 and fits. Stickers cost 5 and do not. After juice, one coin remains.") },
      ],
      // 第 2 步改成「亲手数、亲手付」的场景练习（coins.js 挂载）：
      // 数钱 → 恰好付 6 枚买面包 → 剩 4 枚面对 5 枚的贴纸，「买不起」由托盘装不满
      // 这个物理事实讲出来，最后才让孩子的手回答那道原来的选择题。
      practice: {
        type: "payScene", purse: 10, cost: 6,
        bread: item("bread", window.mqIcon("bread"), L("面包", "Bread"), 6),
        goods: [item("juice", window.mqIcon("juice"), L("果汁", "Juice"), 3), item("stickers", window.mqIcon("rainbow"), L("贴纸", "Stickers"), 5)],
        countLine: L("把口袋里的星币一枚一枚数到柜台上。", "Move the coins from your pocket to the counter, one by one."),
        payLine: L("面包要 6 枚。从柜台把星币放进托盘，放好了就点「付钱」。", "Bread costs 6 coins. Move coins into the tray, then tap Pay."),
        shelfLine: L("果汁和贴纸都想要。柜台上还剩几枚？自己点点看。", "You want juice and stickers. How many coins are left? Try it and see."),
        shortLine: L("托盘装不满了。现在你知道该怎么办了吗？", "The tray cannot be filled. Now, what will you do?"),
        options: [
          option(L("等攒够了再买", "Save up and buy later"), true, L("对，先等一等也是一个选择。4 比 5 少 1，现在还买不起。", "Yes. Waiting is a choice too. Four is one less than five.")),
          option(L("想要就能买", "Wanting it is enough"), false, L("我们再数一次：只有 4 枚，还缺 1 枚。想要一件东西，不会让钱自动增加。", "Count again: there are 4 coins and you need one more. Wanting something does not create money.")),
        ],
      },
      // 复习变体：再玩时换一组数字和情境，第二次是练习而不是默写。
      // 结构与主挑战完全同形：两件必需便宜货 + 一件单独买得起的贵货。
      challenge: { type: "basket", budget: 9, prompt: L("明天画画要用铅笔和橡皮。你有 9 枚，选好要买的东西。", "You have 9 coins and need a pencil and eraser for drawing tomorrow. Pack your basket."), items: [item("pencil", window.mqIcon("pencil"), L("铅笔", "Pencil"), 5), item("eraser", window.mqIcon("eraser"), L("橡皮", "Eraser"), 3), item("badge", window.mqIcon("star"), L("小徽章", "Badge"), 4)], required: ["pencil", "eraser"], variants: [
        { budget: 8, prompt: L("明天去郊游，水和面包一定要带。你有 8 枚，选好要买的东西。", "Tomorrow is an outing: water and bread are must-haves. You have 8 coins. Pack your basket."), items: [item("water", window.mqIcon("water"), L("水", "Water"), 2), item("bread", window.mqIcon("bread"), L("面包", "Bread"), 4), item("gift", window.mqIcon("gift"), L("小礼物", "Little gift"), 4)], required: ["water", "bread"] },
      ] },
      takeaway: L("先数钱，再选择。不能一次买下所有东西，也没有关系。", "Count first, then choose. It is okay not to buy everything."),
      home: L("下次看到价签，试着说一说：如果有 10 元，买完还剩多少？不用真的购买。", "Look at a price tag: with $10, how much would remain? No purchase needed."),
    },
    {
      id: "lesson-2", icon: window.mqIcon("basket"), title: L("先买哪一样？", "What comes first?"),
      goal: L("先照顾眼前要做的事，再想喜欢的东西。", "Choose what your task needs before the extras."),
      story: L("今天，陪我给小店买材料吧！哇，这个招牌真漂亮，我好想带回去。等等，做产品的工具和材料还没买呢。要是少了它们，小店还能开门吗？你愿意帮我想一想，先买什么吗？", "Let's get our shop ready! Oh, that sign is lovely. I'd love to take it home. Wait a moment. We still need tools and materials. Could the shop open without them? What do you think we should buy first?"),
      demo: [
        { amount: 10, title: L("先问：我要做什么？", "What is the task?"), text: L("今天要给顾客做一份产品。先找做产品要用的工具和材料。", "Today we need to make something for a customer. First find the tools and materials.") },
        { amount: 3, title: L("先买能开店的东西", "Supplies first"), text: L("工具 3 枚，材料 4 枚，一共 7 枚。10 − 7 = 3。小店可以开始了。", "Tools cost 3 and materials cost 4: 7 in total. 10 − 7 = 3. Now the shop can start.") },
        { amount: 3, title: L("喜欢的可以放在愿望单", "Keep a wish list"), text: L("招牌要 5 枚，现在先等等。想要并没有错，只是这一次材料更重要。", "The sign costs 5 and can wait. Wanting it is fine; supplies matter more for today's task.") },
      ],
      practice: { type: "shopBasket", budget: 10, prompt: L("轮到你准备小店了：先选齐工具和材料，别超过 10 枚。", "Prepare your shop: choose both tools and materials without spending more than 10 coins."), required: ["tools", "materials"] },
      challenge: { type: "basket", budget: 8, prompt: L("换个地方想一想：下雨了，出门需要雨伞。你有 8 枚，怎样选？不必把钱花光。", "A new situation: it is raining and you need an umbrella to go out. You have 8 coins. You do not have to spend them all."), items: [item("umbrella", window.mqIcon("umbrella"), L("雨伞", "Umbrella"), 6), item("stickers", window.mqIcon("rainbow"), L("贴纸", "Stickers"), 3), item("snack", window.mqIcon("cookie"), L("小饼干", "Cookie"), 2)], required: ["umbrella"] },
      takeaway: L("“需要”要看情境。今天先完成重要的事，喜欢的东西可以以后再选。", "Needs depend on the situation. Take care of the task; extras can wait."),
      home: L("和家长准备一次出门用品：哪样少了会影响今天的活动？", "Pack for an outing together: which missing item would stop today's activity?"),
    },
    {
      id: "lesson-3", icon: window.mqIcon("coin"), title: L("卖到的钱都是赚的吗？", "Is every coin a gain?"),
      goal: L("把花掉的钱和收到的钱分开看。", "Separate money spent from money received."),
      story: L("耶，顾客付给我 5 枚星币啦！我是不是赚了 5 枚呢？嗯，好像还有一件事没想起来。刚才买材料，我也花了钱呀。来，我们把花出去的和收进来的，一起看看。", "Yay, a customer paid me 5 coins! Does that mean I earned all five? Hmm, I think I've forgotten something. I paid for the materials too! Let's look at the money going out and coming in."),
      demo: [
        { amount: 10, title: L("开店前的钱", "Before the sale"), text: L("小店原来有 10 枚。这是原有的钱，还不是今天赚到的。", "The shop starts with 10 coins. They were already here, not earned today.") },
        { amount: 8, title: L("钱出去：买材料", "Money out: materials"), text: L("只做一份产品，材料花 2 枚。口袋变成 10 − 2 = 8 枚。这笔花费叫成本。", "Materials for one item cost 2 coins. 10 − 2 = 8 remain. This spending is a cost.") },
        { amount: 13, title: L("钱进来：顾客付钱", "Money in: a customer pays"), text: L("卖出这份产品，收到 5 枚。口袋有 8 + 5 = 13 枚。收到的 5 枚叫收入。", "Sell that item for 5. Now 8 + 5 = 13 coins are in the purse. The 5 received is revenue.") },
        { amount: 3, title: L("今天多了 3 枚", "Three more than before"), text: L("13 − 10 = 3，也就是 5 − 2 = 3。这一笔赚了 3 枚，叫利润。本练习只有材料这一项成本，以后还会遇到租金等花费。", "13 − 10 = 3, also 5 − 2 = 3. This sale made a profit of 3. Materials are the only cost in this exercise; later we will meet costs such as rent.") },
      ],
      practice: { type: "choice", prompt: L("口袋现在有 13 枚。今天这一笔真正赚了多少？", "There are 13 coins in the purse. How much did this sale earn?"), options: [
        option(L("13 枚", "13 coins"), false, L("13 枚里还有原来的 10 枚。先把原有的钱分出来，再看多了多少。", "Those 13 include the original 10. Set the original money aside and count the increase.")),
        option(L("5 枚", "5 coins"), false, L("5 枚是顾客付来的，还要减去做这份产品花掉的 2 枚。", "Five is what the customer paid. Subtract the 2 spent making the item.")),
        option(L("3 枚", "3 coins"), true, L("你把原有的钱、收到的钱和赚到的钱分清了：5 − 2 = 3。", "You separated the starting money, revenue and profit: 5 − 2 = 3.")),
      ] },
      challenge: { type: "choice", prompt: L("换一笔：一张手工卡片的材料花 3 枚，卖出收到 7 枚。没有其他花费，这一笔赚了多少？", "A new sale: a handmade card uses 3 coins of materials and sells for 7. There are no other costs. What is the profit?"), options: [
        option(L("7 枚", "7 coins"), false, L("7 枚是收入。还记得材料已经花掉了 3 枚吗？用 7 减去 3 再试试。", "Seven is the revenue. The materials cost 3. Try subtracting 3 from 7.")),
        option(L("4 枚", "4 coins"), true, L("7 − 3 = 4。换了商品和数字，你也会算了。", "7 − 3 = 4. You can use the idea with a different item and different numbers.")),
        option(L("10 枚", "10 coins"), false, L("材料的钱是花出去的，不能加到赚的钱里。试试 7 − 3。", "Material costs went out; do not add them to the gain. Try 7 − 3.")),
      ] },
      takeaway: L("口袋里有多少钱，不等于今天赚了多少。收入减去这笔生意的成本，才是利润。", "Money in the purse is not the same as profit. Subtract a sale's costs from its revenue."),
      home: L("用纸画 7 个圆圈，划掉 3 个“材料钱”，给家长讲讲剩下的 4 个。", "Draw 7 circles, cross out 3 for materials, and explain the remaining 4."),
    },
    {
      id: "lesson-4", icon: window.mqIcon("package"), title: L("今天准备几份？", "How many for today?"),
      goal: L("买之前想想用量，不是买得越多越好。", "Think about demand before buying more."),
      story: L("叮咚，今天有 3 位顾客预约，每人要 1 份。我有个想法：多买一点货，会不会就赚得更多呢？你也好奇吗？咱们先试一试，再看看货架上留下了什么，口袋里还剩多少。", "Ding-dong! Three customers have booked one item each. I've had a thought: would buying extra stock help us earn more? Are you curious too? Let's try, then check what's on the shelf and what's in our purse."),
      demo: [
        { amount: 10, title: L("先看已知的消息", "Check what we know"), text: L("这次练习确定有 3 位顾客。每份进货 2 枚、卖出 3 枚。现实里的顾客数量不一定知道。", "For this exercise, exactly 3 customers will come. Each item costs 2 and sells for 3. Real demand is not always known.") },
        { amount: 0, title: L("如果买了 5 份", "What if we buy 5?"), text: L("5 × 2 = 10，进货后口袋暂时空了。货还在，所以这不是 10 枚全亏掉了。", "5 × 2 = 10. The purse is temporarily empty, but the stock still exists. This is not a loss of all 10 coins.") },
        { amount: 9, title: L("卖出 3 份，还有 2 份", "Sell 3, keep 2"), text: L("收到 9 枚，货架剩 2 份。如果只买 3 份，也能服务所有顾客，口袋会留下更多能用的钱。", "Sales bring in 9 coins, with 2 items left. Buying only 3 would still serve everyone and leave more cash available.") },
      ],
      practice: { type: "stock", demand: 3, prompt: L("先自由试一次：3 位顾客，每人要 1 份。你想准备几份？", "Try a plan: 3 customers want one item each. How many will you prepare?") },
      challenge: { type: "stock", demand: 2, prompt: L("新的一天，确定有 2 位顾客。让每人买到一份，也不要留下多余库存。", "A new day has exactly 2 customers. Serve both without leaving extra stock.") },
      takeaway: L("多买的货会占用钱。先想需要几份，再决定买几份。", "Extra stock ties up money. Plan the quantity before buying."),
      home: L("想想一次家庭野餐：3 个人，每人 1 瓶水，要准备几瓶？", "Plan a picnic: 3 people each need one bottle of water. How many bottles?"),
    },
    {
      id: "lesson-5", icon: window.mqIcon("piggy"), title: L("给愿望留一点钱", "Save for a wish"),
      goal: L("把今天要用的钱和为以后留的钱分开。", "Separate today's needs from money saved for later."),
      story: L("告诉你一个小愿望：我想给小店换一个新招牌，要 8 枚星币呢。我现在有 12 枚，不过，明天买材料还要用 6 枚。嗯，怎样才能照顾明天，也给愿望留一点？陪我分成两个小口袋吧！", "Can I tell you a little wish? I'd love a new sign for the shop. It costs 8 coins. I have 12, but tomorrow's supplies need 6. Hmm, how can I save for my wish and look after tomorrow too? Let's make two little pockets!"),
      demo: [
        { amount: 12, title: L("给钱分两个小口袋", "Make two pockets"), text: L("一个口袋写“明天要用”，另一个写“我的愿望”。分开存，不会让钱变多，但不容易弄混。", "Label one pocket 'tomorrow' and the other 'my wish'. Separating money does not create more; it helps us keep track.") },
        { amount: 6, title: L("先留明天的 6 枚", "Keep 6 for tomorrow"), text: L("12 − 6 = 6，最多还可以存 6 枚到愿望口袋。", "12 − 6 = 6. Up to 6 coins can go into the wish pocket.") },
        { amount: 6, title: L("没有攒够也没关系", "It is okay to wait"), text: L("愿望口袋有 6 枚，离 8 枚还差 2 枚。等以后有多余的钱，再继续存。", "There are 6 saved toward an 8-coin wish. Two more are needed. Save again when there is money available.") },
      ],
      practice: { type: "jars", total: 12, reserve: 6, target: 8, prompt: L("试着分一分。请给愿望存一些，也给明天留下至少 6 枚。", "Save something for the wish and keep at least 6 coins for tomorrow.") },
      challenge: { type: "jars", total: 10, reserve: 6, target: 4, prompt: L("换成你的零花钱：一共有 10 枚，明天车费要 6 枚。试着为 4 枚的贴纸存够钱。", "You have 10 coins. Tomorrow's bus needs 6. Save enough for a 4-coin sticker set."), requireTarget: true },
      takeaway: L("储蓄是给未来留钱。先留好要用的，再慢慢实现愿望。", "Saving means setting money aside for later. Protect what you need and work toward a wish."),
      home: L("画两个口袋：一个写最近需要的钱，另一个画一个小愿望。无需填写家庭收入。", "Draw two pockets: something you need soon and a small wish. No family income details needed."),
    },
    {
      id: "lesson-6", icon: window.mqIcon("umbrella"), title: L("计划变了怎么办？", "What if plans change?"),
      goal: L("花钱时留一点余地，遇到变化可以重新安排。", "Leave some room in your plan and adjust when things change."),
      story: L("哎呀，小店的杯子不小心破了，补齐要 5 枚。我现在有 8 枚。昨天看到 6 枚的装饰，我差一点就买啦。幸好先等了一等！你看，留下一点钱，是不是多了一个办法？", "Oh dear, some shop cups broke. Replacements cost 5 coins, and I have 8. Yesterday I nearly spent 6 on decorations. I'm glad I waited! Can you see how keeping some money gives us another option?"),
      demo: [
        { amount: 8, title: L("变化发生之前", "Before the surprise"), text: L("口袋有 8 枚，装饰要 6 枚。虽然买得起，但买完只剩 2 枚。", "There are 8 coins. Decorations cost 6. They are affordable, but would leave only 2.") },
        { amount: 2, title: L("只剩 2 枚会怎样？", "What if only 2 remain?"), text: L("补杯子要 5 枚，还差 3 枚。可能要晚一点开门，或和家长一起重新安排。", "Replacement cups cost 5: we would be 3 short. We might delay opening or plan again with an adult.") },
        { amount: 3, title: L("留的钱帮上忙了", "Spare money helps"), text: L("装饰先不买，8 − 5 = 3。补齐杯子后还能剩 3 枚。备用的钱不能解决所有事，但能多给我们一些选择。", "Wait on decorations: 8 − 5 = 3. After replacing cups, 3 remain. Spare money cannot solve everything, but offers more choices.") },
      ],
      practice: { type: "choice", prompt: L("开店要用的杯子坏了。现在先做哪件事？", "The cups needed for opening are broken. What comes first?"), options: [
        option(L("买打折装饰，只剩 2 枚", "Buy sale decorations; keep 2"), false, L("折扣不等于现在需要。剩 2 枚不够补杯子。先看看什么会影响开店。", "A discount does not make something necessary. Two coins cannot replace the cups. Check what the shop needs.")),
        option(L("花 5 枚补杯子，装饰等一等", "Replace cups for 5; decorations wait"), true, L("你先解决了眼前的问题，还留着 3 枚。愿望没有消失，只是换个时间实现。", "You solved today's problem and kept 3 coins. The wish can happen another time.")),
      ] },
      challenge: { type: "choice", prompt: L("周末你有 20 枚，已经约好参加 12 枚的活动。又看到 10 枚的玩具，怎样安排？", "You have 20 coins and have planned a 12-coin activity. You spot a 10-coin toy. What is your plan?"), options: [
        option(L("两个都买，钱应该够", "Buy both; it should be enough"), false, L("一起算：12 + 10 = 22，比 20 多 2。先把已经安排的钱留出来。", "12 + 10 = 22, which is 2 more than 20. Set aside the planned spending first.")),
        option(L("先留活动的 12 枚，玩具等一等", "Keep 12 for the activity; wait on the toy"), true, L("留好 12 枚后剩 8 枚。你把小店里学会的计划方法，用到了自己的生活里。", "Setting aside 12 leaves 8. You used your shop-planning skill in everyday life.")),
      ] },
      takeaway: L("花钱前停一停：我有多少？先要做什么？花完还剩多少？", "Pause before spending: how much do I have, what comes first, and what will remain?"),
      home: L("给家长讲一个例子：你为什么决定先等一等？答案不一定是“永远不买”。", "Tell an adult about a time you would wait. The answer does not have to be 'never buy it'."),
    },
  ];

  window.MoneyLessons = { lessons, create };

  function create(api) {
    let current, review = false, lastFeedback = null, sceneWidget = null;
    const root = document.getElementById("guided-lesson");
    const t = (value) => api.english() ? value.en : value.zh;
    const h = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const txt = (zh, en) => t(L(zh, en));
    const progress = () => {
      const saved = api.state.lessonProgress[current.id] ||= { step: 0, demo: 0, selected: [], amount: 0, passed: false, attempts: 0, variant: 0, pay: null };
      return saved;
    };
    // 「●」换成面额「1」：与教学演示的 .scene-token、星币场景的 .mq-coin 同一视觉语言。
    const coins = (amount) => `<div class="coin-row" aria-label="${amount} ${txt("星币", "coins")}">${Array.from({ length: amount }, () => '<span aria-hidden="true">1</span>').join("")}</div>`;
    const button = (label, action, css = "primary-button") => `<button type="button" class="${css}" data-lesson-action="${action}">${h(label)}</button>`;
    const panel = (title, copy) => `<div class="teach-panel"><h2>${h(title)}</h2><p>${h(copy)}</p></div>`;

    function exercise() {
      const p = progress();
      const data = { ...(p.step === 2 ? current.practice : current.challenge) };
      // 复习变体：p.variant 在 open() 里于「再次查看」时置 1，同一结构换数字换情境。
      if (p.variant && Array.isArray(data.variants) && data.variants[p.variant - 1]) Object.assign(data, data.variants[p.variant - 1]);
      if (data.type === "shopBasket") {
        data.type = "basket";
        const nail = api.state.scenario === "nail-artist";
        data.items = [item("tools", nail ? window.mqIcon("tools") : window.mqIcon("cup"), nail ? L("工具", "Tools") : L("杯子", "Cups"), 3), item("materials", nail ? window.mqIcon("palette") : window.mqIcon("milk"), nail ? L("甲油", "Polish") : L("牛奶", "Milk"), 4), item("sign", window.mqIcon("sparkles"), L("漂亮招牌", "Pretty sign"), 5)];
      }
      return data;
    }

    function feedback(message, success) {
      lastFeedback = { message, success };
      progress().dialogueKey = "";
      render();
    }

    // 轻反馈：只更新状态行，不进对白、不重渲染。付款场景里托盘里币的分布
    // 就是孩子的工作进度，一次「还差 1 枚」的提示不该打断它，更不该把币归位。
    function inlineNote(message) {
      const box = root.querySelector(".lesson-feedback");
      if (box) box.textContent = txt(message.zh, message.en);
      window.TeachingMedia.updateText(narrationText());
    }

    // 付款场景（第 1 课第 3 步）的分步状态。挂在进度对象里，
    // 中途离开再回来时，柜台和托盘的分布原样恢复。
    function payState() {
      const saved = progress();
      saved.pay ||= { phase: "count", moved: 0, breadPaid: false, juice: false, tried: false };
      return saved.pay;
    }

    // 付款场景里「还没花掉」的钱：10 − 面包 6 −（果汁买了再减 3）。
    function coinsLeft(d, pay) {
      const juiceCost = d.goods[0].cost;
      return d.purse - d.cost - (pay.juice ? juiceCost : 0);
    }

    function narrationText() {
      const p = progress();
      if (lastFeedback) return txt(lastFeedback.success ? "你发现啦！" : "没关系，我们一起看看。", lastFeedback.success ? "You found it! " : "That's okay. Let's look together. ") + t(lastFeedback.message);
      if (p.step === 0) return t(current.story);
      if (p.step === 1) return t(current.demo[p.demo].text);
      if (p.step === 4) return `${t(current.takeaway)} ${t(current.home)}`;
      const data = exercise();
      let copy;
      if (data.type === "payScene") {
        const pay = p.pay || { phase: "count", tried: false };
        copy = pay.phase === "count" ? t(data.countLine)
          : pay.phase === "pay" ? t(data.payLine)
          : t(pay.tried ? data.shortLine : data.shelfLine);
      } else copy = t(data.prompt);
      if (data.type === "choice" || (data.type === "payScene" && (p.pay || {}).tried)) copy += " " + data.options.map((o, i) => `${i + 1}. ${t(o.label)}`).join("。 ");
      if (data.type === "basket") copy += txt(` 你有 ${data.budget} 枚。`, ` You have ${data.budget} coins. `) + data.items.map(i => `${t(i.name)} ${i.cost} ${txt("枚", "coins")}`).join("。 ");
      if (data.type === "stock") copy += txt(" 开门前有10枚，进货一份2枚，卖出一份3枚。请选择准备几份。", " Start with 10 coins. Each item costs 2 and sells for 3. Choose how many to prepare.");
      if (data.type === "jars") copy += txt(` 一共有 ${data.total} 枚，明天至少要留 ${data.reserve} 枚。现在愿望口袋 ${p.amount} 枚，留下 ${data.total - p.amount} 枚。`, ` There are ${data.total} coins. Tomorrow needs at least ${data.reserve}. Your wish pocket has ${p.amount}, leaving ${data.total - p.amount} available.`);
      return copy;
    }

    function renderExercise(data) {
      const p = progress();
      let html = `<h2 class="exercise-heading">${txt("轮到你动手啦", "Your turn to try")}</h2>`;
      if (data.type === "choice") {
        html += `<div class="lesson-choices">${data.options.map((o, i) => `<button type="button" data-choice="${i}" ${p.passed ? "disabled" : ""} class="${p.selected[0] === i ? "is-selected" : ""}">${h(t(o.label))}</button>`).join("")}</div>`;
      } else if (data.type === "payScene") {
        html += renderPayScene(data);
      } else if (data.type === "basket") {
        const sum = data.items.filter((i) => p.selected.includes(i.id)).reduce((a, i) => a + i.cost, 0);
        html += `<div class="lesson-wallet"><strong>${txt("一共有", "Budget")} ${data.budget} ${window.mqIcon("coin")}</strong><span class="basket-sum">${txt("已选", "Selected")} ${sum} · ${sum > data.budget ? txt("还差", "Short by") : txt("还剩", "Remaining")} ${Math.abs(data.budget - sum)}</span></div>`;
        html += `<div class="lesson-choices basket-choices">${data.items.map((i) => `<button type="button" data-item="${i.id}" aria-pressed="${p.selected.includes(i.id)}" ${p.passed ? "disabled" : ""}><span aria-hidden="true">${i.icon}</span><strong>${h(t(i.name))}</strong><span>${i.cost} ${window.mqIcon("coin")} <b class="item-mark">${p.selected.includes(i.id) ? "✓" : "+"}</b></span></button>`).join("")}</div><p class="lesson-hint">${txt("点一下放进篮子，再点一下拿出来。", "Tap to add to your basket; tap again to remove.")}</p>`;
      } else if (data.type === "stock") {
        html += `<div class="lesson-wallet"><span>${txt("开门前", "Starting cash")} 10 ${window.mqIcon("coin")}</span><span>${txt("进货一份", "Cost each")} 2 ${window.mqIcon("coin")}</span><span>${txt("卖出一份", "Price each")} 3 ${window.mqIcon("coin")}</span></div><div class="lesson-choices quantity-choices">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-amount="${n}" aria-pressed="${p.amount === n}" ${p.passed ? "disabled" : ""}>${n} ${txt("份", "items")}</button>`).join("")}</div>`;
        if (p.result) {
          const r = p.result;
          html += `<div class="stock-result" role="status"><h3>${txt("小店账本", "Shop notebook")}</h3><p>${txt("卖出", "Sold")} ${r.sold} · ${txt("剩货", "Stock left")} ${r.left} · ${txt("没买到", "Unserved")} ${r.missed}</p><p>${txt("口袋", "Purse")}: 10 − ${r.quantity * 2} + ${r.sold * 3} = <strong>${r.cash} ${window.mqIcon("coin")}</strong></p><details><summary>${txt("再看看利润", "Check the profit")}</summary><p>${txt("卖出部分的利润", "Profit on items sold")}: ${r.sold * 3} − ${r.sold * 2} = ${r.sold} ${window.mqIcon("coin")}</p><small>${txt("剩货不是全亏掉。练习暂不计租金和货物变质。", "Unsold stock is not all lost. This exercise excludes rent and spoilage.")}</small></details></div>`;
        }
      } else if (data.type === "jars") {
        html += `<div class="lesson-wallet"><span>${txt("一共有", "Total")} ${data.total} ${window.mqIcon("coin")}</span><span>${txt("明天至少要用", "Needed tomorrow")} ${data.reserve} ${window.mqIcon("coin")}</span></div><label class="jar-control">${txt("存到愿望口袋", "Put in the wish pocket")}<input type="range" min="0" max="${data.total}" value="${p.amount}" ${p.passed ? "disabled" : ""} id="saving-amount" /></label><div class="jar-grid"><article><span>${window.mqIcon("piggy")}</span><strong>${p.amount} / ${data.target}</strong><p>${txt("我的愿望", "My wish")}</p><progress value="${Math.min(p.amount, data.target)}" max="${data.target}"></progress></article><article><span>${window.mqIcon("wallet")}</span><strong>${data.total - p.amount} ${window.mqIcon("coin")}</strong><p>${txt("留下可以用的钱", "Money kept available")}</p></article></div>`;
      }
      // 反馈行常驻占位（空时靠 :empty + visibility 隐形）：答错的一行提示
      // 出现/消失时，下面的按钮不再上下跳。
      html += '<p class="lesson-feedback" role="status"></p>';
      if (!p.passed && data.type !== "choice" && data.type !== "payScene") html += button(txt(data.type === "stock" ? "开门试一试" : "看看我的选择", data.type === "stock" ? "Try this shop day" : "Check my choices"), "check");
      if (!p.passed && !payBodyHasPrimary(data, progress())) html += button(txt("给我一点提示", "Give me a hint"), "hint", "quiet-button");
      if (p.passed) html += button(txt(p.step === 2 ? "换个情境，我来试试 →" : "说说今天的发现 →", p.step === 2 ? "Try a new situation →" : "My discovery →"), "next");
      return html;
    }

    // 付款场景的任务区：每一段只有「一个状态 + 一个主按钮」。
    // 币本身在视觉区（mountPayScene 挂进 .coin-scene-slot），这里只放文字与按钮。
    function renderPayScene(data) {
      const p = progress();
      const pay = payState(); // 必须经 payState()：确保对象挂在进度上，widget 才能更新同一份
      if (pay.phase === "count") {
        return `<p class="pay-status" role="status">${txt(`柜台上已有 ${pay.moved} / ${data.purse} 枚`, `${pay.moved} of ${data.purse} coins on the counter`)}</p><button type="button" class="primary-button" data-lesson-action="toPay" ${pay.moved === data.purse ? "" : "disabled"}>${txt("数好了，去买面包 →", "Counted! Get the bread →")}</button>`;
      }
      if (pay.phase === "pay") {
        return `<p class="pay-status" role="status">${txt(`托盘里有 ${pay.moved} 枚 · 面包要 ${data.cost} 枚`, `${pay.moved} in the tray · bread costs ${data.cost}`)}</p><button type="button" class="primary-button" data-lesson-action="pay" ${pay.moved ? "" : "disabled"}>${txt("付钱", "Pay")}</button>`;
      }
      let html = `<p class="pay-status" role="status">${txt(`柜台上还剩 ${coinsLeft(data, pay) - pay.moved} 枚`, `${coinsLeft(data, pay) - pay.moved} coins left on the counter`)}</p>`;
      if (pay.tried) {
        html += `<div class="lesson-choices">${data.options.map((o, i) => `<button type="button" data-choice="${i}" ${p.passed ? "disabled" : ""} class="${p.selected[0] === i ? "is-selected" : ""}">${h(t(o.label))}</button>`).join("")}</div>`;
      } else {
        html += `<p class="lesson-hint">${txt("点货架上的东西试一试。", "Tap things on the shelf to try them.")}</p>`;
      }
      return html;
    }

    // 付款场景在 count / pay 两段有自己的主按钮，通用的「提示」按钮就让位，
    // 不然孩子面前并排出现两个绿色主按钮，不知道该按哪个。
    function payBodyHasPrimary(data, p) {
      if (data.type !== "payScene") return false;
      const phase = (p.pay || {}).phase;
      return phase === "count" || phase === "pay";
    }

    function render() {
      if (!current) return;
      window.TeachingMedia.dispose();
      window.MoneyVideo?.dispose();
      sceneWidget = null; // innerHTML 即将整体替换，旧场景的句头随之作废
      const p = progress();
      p.feedback = lastFeedback;
      // 付款场景的相位也参与对白键：换相位要换一组对白，但同一相位里
      // 每数一枚币都不该把对白打回第一句。
      const payKey = p.pay ? `${p.pay.phase}${p.pay.juice ? "j" : ""}${p.pay.tried ? "t" : ""}` : "intro";
      const dialogueKey = `${p.step}:${p.demo}:${payKey}:${lastFeedback ? JSON.stringify(lastFeedback.message) : "intro"}`;
      if (p.dialogueKey !== dialogueKey) { p.dialogueKey = dialogueKey; p.dialogue = 0; }
      const stages = [L("故事时间", "Story"), L("陪你看一遍", "Watch together"), L("一起试试", "Try together"), L("这次我来", "Your turn"), L("我的发现", "Discovery")];
      // 换步播报的开关。render() 每选一次道具、每改一次金额都会被调，直接播会把
      // 同一句话念到孩子烦；只有「课 + 步」这个组合变了才播一次。
      const stepKey = current.id + ":" + p.step;
      // 视频有没有配，一步只问一次：视觉区用它决定要不要让位给播放卡，
      // 任务区用它决定主按钮写「接着看故事」还是「一起看看」。
      const slot = videoSlot(p);
      root.innerHTML = `<header class="mission-title blue"><span aria-hidden="true">${current.icon}</span><div><p>${txt("第", "Lesson ")}${lessons.indexOf(current) + 1}${txt("课 · 一次发现一点点", " · One little discovery")}</p><h2 tabindex="-1" id="lesson-heading">${h(t(current.title))}</h2></div><small class="learning-star-count">★ ${api.state.learningStars || 0}</small></header><ol class="lesson-steps" data-total="${stages.length}">${stages.map((s, i) => `<li ${i === p.step ? 'aria-current="step"' : ""} class="${i < p.step ? "done" : ""}">${i < p.step ? "✓" : i + 1} ${h(t(s))}</li>`).join("")}</ol><div class="lesson-stage" data-step="${p.step}"><div class="stage-visual">${visualContent(p, slot)}</div><div class="stage-task"><div class="dialogue-slot"></div>${stageContent(p, slot)}</div></div><div class="lesson-bottom">${p.step > 0 ? button(txt("← 再看一遍", "← Look again"), "back", "quiet-button") : ""}<span>${txt("自动保存 · 练习用的都是虚拟币", "Saved automatically · All coins are pretend")}</span></div>`;
      document.getElementById("mission-progress-label").textContent = `${p.step + 1} / 5`;
      if (announcedStepKey !== stepKey) {
        announcedStepKey = stepKey;
        window.mqAnnounce?.(`${txt("第 ", "Step ")}${p.step + 1}${txt(" 步 · ", " · ")}${t(stages[p.step])}`);
      }
      // has-demonstration 现在只是「正在看示范」的状态标记，不再驱动双栏布局：
      // 左右分栏会把故事和数字拆到两侧，孩子要来回扫视。见 dialogue.css 学习页一节。
      root.querySelector(".lesson-stage").classList.toggle("has-demonstration", p.step === 1);
      // 星币场景进了视觉区的步骤，视觉区要高一些——它现在是主角，不是题头。
      root.querySelector(".lesson-stage").classList.toggle("has-coin-scene",
        (p.step === 2 || p.step === 3) && ["payScene", "basket"].includes(exercise().type));
      document.getElementById("mission-progress-fill").style.width = `${(p.step + 1) * 20}%`;
      root.querySelectorAll("[data-lesson-action]").forEach((b) => b.addEventListener("click", () => act(b.dataset.lessonAction)));
      root.querySelectorAll("[data-choice]").forEach((b) => b.addEventListener("click", () => check(Number(b.dataset.choice))));
      // 购物篮改成「就地更新」：整页重渲染会把星币场景重建、飞动动画全部丢掉，
      // 孩子每点一件货，币应该自己飞过去，而不是整块画面闪一下。
      root.querySelectorAll("[data-item]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.item;
        p.selected = p.selected.includes(id) ? p.selected.filter((v) => v !== id) : [...p.selected, id];
        lastFeedback = null; api.save();
        const d = exercise();
        const chosen = d.items.filter((i) => p.selected.includes(i.id));
        const sum = chosen.reduce((a, i) => a + i.cost, 0);
        b.classList.toggle("is-selected", p.selected.includes(id));
        b.setAttribute("aria-pressed", String(p.selected.includes(id)));
        const mark = b.querySelector(".item-mark");
        if (mark) mark.textContent = p.selected.includes(id) ? "✓" : "+";
        const sumBox = root.querySelector(".basket-sum");
        if (sumBox) sumBox.textContent = `${txt("已选", "Selected")} ${sum} · ${sum > d.budget ? txt("还差", "Short by") : txt("还剩", "Remaining")} ${Math.abs(d.budget - sum)}`;
        if (sceneWidget && !p.passed) sceneWidget.setCounts([Math.max(0, d.budget - sum), Math.min(sum, d.budget)]);
        const box = root.querySelector(".lesson-feedback");
        if (box) box.textContent = "";
        window.TeachingMedia.updateText(narrationText());
        b.focus();
      }));
      root.querySelectorAll("[data-amount]").forEach((b) => b.addEventListener("click", () => { p.amount = Number(b.dataset.amount); lastFeedback = null; api.save(); render(); root.querySelector(`[data-amount="${p.amount}"]`).focus(); }));
      root.querySelector("#saving-amount")?.addEventListener("input", (e) => {
        p.amount = Number(e.target.value); lastFeedback = null; p.feedback = null;
        const jars = root.querySelectorAll(".jar-grid strong"); jars[0].textContent = `${p.amount} / ${exercise().target}`; jars[1].innerHTML = `${exercise().total - p.amount} ${window.mqIcon("coin")}`;
        root.querySelector("progress").value = Math.min(p.amount, exercise().target);
        root.querySelector(".lesson-feedback").hidden = true; api.save();
        window.TeachingMedia.updateText(narrationText());
      });
      root.querySelector("#saving-amount")?.addEventListener("change", () => { render(); root.querySelector("#saving-amount")?.focus({ preventScroll: true }); });
      window.TeachingMedia.mount(root, {
        english: api.english(), lessonId: current.id, stage: p.step, demo: p.demo, text: narrationText(),
        dialogue: window.MoneyDialogues.lesson({ current, p, feedback: lastFeedback, english: api.english() }), dialogueIndex: p.dialogue,
        onDialogueChange(index, ended) {
          p.dialogue = index;
          root.querySelectorAll('[data-lesson-action="next"], [data-lesson-action="demo"], [data-lesson-action="finish"]').forEach(b => { b.disabled = !ended; });
          api.save();
        },
      });
      window.MoneyVideo?.mount(root.querySelector(".video-slot"), {
        lessonId: current.id,
        step: p.step,
        english: api.english(),
      });
      mountCoinScene();
    }

    /* ── 星币场景挂载 ────────────────────────────────────────────────────
       视觉区里的 .coin-scene-slot 是占位点：付款场景（第 1 课第 3 步）与
       购物篮（所有 basket 课）在这里放「可以上手」的星币，替代原来的
       图标 + 角色占位画面。要「做」的事因此长在要「看」的画面里。 */
    function mountCoinScene() {
      sceneWidget = null;
      const slot = root.querySelector(".coin-scene-slot");
      if (!slot) return;
      const d = exercise();
      if (d.type === "payScene") mountPayScene(slot, d);
      else if (d.type === "basket") mountBasketScene(slot, d);
    }

    function mountBasketScene(slot, d) {
      const p = progress();
      const sum = d.items.filter((i) => p.selected.includes(i.id)).reduce((a, i) => a + i.cost, 0);
      // 已过关后再看：那部分币已经付给店家了，托盘区清空，只剩「还没花的」。
      sceneWidget = window.MoneyCoins.mount(slot, {
        zones: [txt("还没花的", "Not spent yet"), txt(p.passed ? "已经付给店家" : "准备付", p.passed ? "Paid to the shop" : "Ready to pay")],
        counts: p.passed ? [d.budget - sum, 0] : [d.budget - sum, sum],
        manual: false,
      });
    }

    function mountPayScene(slot, d) {
      const pay = payState(); // 同上：widget 的 onMove 更新的必须是进度里的那份
      const stickers = d.goods[1];
      let zones, counts;
      if (pay.phase === "count") {
        zones = [txt("口袋", "Pocket"), txt("柜台", "Counter")];
        counts = [d.purse - pay.moved, pay.moved];
      } else if (pay.phase === "pay") {
        zones = [txt("柜台", "Counter"), txt("付款托盘", "Pay tray")];
        counts = [d.purse - pay.moved, pay.moved];
      } else {
        zones = [txt("柜台", "Counter"), txt("付款托盘", "Pay tray")];
        counts = [coinsLeft(d, pay) - pay.moved, pay.moved];
      }
      const scene = document.createElement("div");
      scene.className = "mq-pay-scene";
      const coinHost = document.createElement("div");
      scene.appendChild(coinHost);
      scene.appendChild(goodsShelf(d, pay));
      slot.replaceChildren(scene);
      sceneWidget = window.MoneyCoins.mount(coinHost, {
        zones, counts, manual: true,
        // 托盘装不满要看得见：贴纸 5 枚，位子画出来，差几枚一目了然。
        slots: pay.phase === "shelf" && pay.tried ? [null, stickers.cost] : null,
        onMove(moved) {
          pay.moved = moved;
          api.save();
          updatePayStatus(d, pay);
        },
      });
      // 货架按钮比挂载点晚一步出现，绑定也跟在这里做。
      scene.querySelectorAll("[data-lesson-action]").forEach((b) => b.addEventListener("click", () => act(b.dataset.lessonAction)));
      if (pay.phase === "shelf" && pay.tried && coinsLeft(d, pay) < stickers.cost) sceneWidget.shake();
    }

    function goodsShelf(d, pay) {
      const shelf = document.createElement("div");
      shelf.className = "mq-goods-shelf";
      if (pay.phase !== "count") {
        shelf.appendChild(goodsTile(d.bread, pay.breadPaid ? "bought" : "target"));
        if (pay.phase === "shelf") {
          d.goods.forEach((g) => {
            shelf.appendChild(goodsTile(g, g.id === "juice" && pay.juice ? "bought" : "buy", `goods-${g.id}`));
          });
        }
      }
      return shelf;
    }

    function goodsTile(g, mode, action) {
      const el = document.createElement(mode === "buy" ? "button" : "div");
      if (mode === "buy") { el.type = "button"; el.dataset.lessonAction = action; }
      el.className = "mq-goods" + (mode === "bought" ? " is-bought" : "");
      el.innerHTML = `<span aria-hidden="true">${g.icon}</span><strong>${h(t(g.name))}</strong><span class="mq-goods-price">${g.cost} ${window.mqIcon("coin")}${mode === "bought" ? txt(" 已买到", " bought") : ""}</span>`;
      if (mode === "buy") el.setAttribute("aria-label", `${t(g.name)}：${g.cost} ${txt("枚星币", "coins")}`);
      return el;
    }

    function updatePayStatus(d, pay) {
      const status = root.querySelector(".pay-status");
      if (status) {
        if (pay.phase === "count") status.textContent = txt(`柜台上已有 ${pay.moved} / ${d.purse} 枚`, `${pay.moved} of ${d.purse} coins on the counter`);
        else if (pay.phase === "pay") status.textContent = txt(`托盘里有 ${pay.moved} 枚 · 面包要 ${d.cost} 枚`, `${pay.moved} in the tray · bread costs ${d.cost}`);
        else status.textContent = txt(`柜台上还剩 ${coinsLeft(d, pay) - pay.moved} 枚`, `${coinsLeft(d, pay) - pay.moved} coins left on the counter`);
      }
      const go = root.querySelector('[data-lesson-action="toPay"]');
      if (go) go.disabled = pay.moved !== d.purse;
      const payButton = root.querySelector('[data-lesson-action="pay"]');
      if (payButton) payButton.disabled = pay.moved === 0;
    }

    // 付钱：恰好等于价目才成交。差/多都只是托盘摇一摇 + 状态行说明，
    // 币留在原地让孩子自己调整 —— 错误由物件暴露，不由文字批评。
    function payAttempt() {
      const d = exercise();
      const pay = payState();
      const w = sceneWidget;
      if (!w || pay.phase !== "pay") return;
      if (pay.moved === d.cost) {
        w.lock(true);
        w.paySuccess().then(() => {
          pay.breadPaid = true;
          pay.phase = "shelf";
          pay.moved = 0;
          lastFeedback = null;
          api.save(); render();
        });
        return;
      }
      w.shake();
      const note = pay.moved < d.cost
        ? L(`托盘里是 ${pay.moved} 枚，还差 ${d.cost - pay.moved} 枚。再数一数。`, `The tray has ${pay.moved}: ${d.cost - pay.moved} short. Count again.`)
        : L(`托盘里是 ${pay.moved} 枚，多出 ${pay.moved - d.cost} 枚。放回去一点。`, `The tray has ${pay.moved}: ${pay.moved - d.cost} too many. Put some back.`);
      window.setTimeout(() => inlineNote(note), 420);
    }

    function buyJuice() {
      const d = exercise();
      const pay = payState();
      const w = sceneWidget;
      const juiceCost = d.goods[0].cost;
      if (!w || pay.phase !== "shelf" || pay.juice) return;
      const onCounter = coinsLeft(d, pay) - pay.moved;
      if (onCounter < juiceCost) return; // 钱不够就不响应，货架按钮的失败感留给贴纸那一幕
      w.lock(true);
      w.setCounts([onCounter - juiceCost, pay.moved + juiceCost]);
      window.setTimeout(() => {
        pay.juice = true;
        pay.moved = 0;
        lastFeedback = null;
        api.save(); render();
      }, 620);
    }

    // 试买贴纸：把柜台上的钱全部推进托盘 —— 位子画出来后，「还差几枚」
    // 不再是大人告诉的结论，而是孩子亲眼看见的缺口。
    function tryStickers() {
      const d = exercise();
      const pay = payState();
      const stickers = d.goods[1];
      if (pay.phase !== "shelf" || pay.tried) return;
      const left = coinsLeft(d, pay);
      pay.tried = true;
      pay.moved = Math.min(left, stickers.cost);
      lastFeedback = null;
      api.save(); render();
      if (left < stickers.cost) {
        window.setTimeout(() => inlineNote(L(`柜台上只有 ${left} 枚，贴纸要 ${stickers.cost} 枚，还差 ${stickers.cost - left} 枚。`, `Only ${left} coins on the counter; stickers cost ${stickers.cost}: ${stickers.cost - left} short.`)), 380);
      }
    }

    // 视频教学挂载点：配了片的课节在第 0 步多一张播放卡；没配片时这里返回空串，
    // 页面与配片前完全一致。契约见 docs/VIDEO-MODULE.md。
    function videoSlot(p) {
      return window.MoneyVideo ? window.MoneyVideo.slot(current.id, p.step) : "";
    }

    // 清单是异步拉的，挂载点却是同步判定的。孩子若抢在清单到达之前点了开始，
    // 第 1 步的视觉区会先落到角色舞台。清单到达后补一次 —— 只重画视觉区，
    // 不整页重渲染：重渲染会把对白打回第一句，孩子刚读的话就没了。
    function backfillVideoSlot() {
      if (!current) return;
      const p = progress();
      if (p.step !== 0) return;
      const visual = root.querySelector(".stage-visual");
      if (!visual || visual.querySelector(".video-slot")) return;
      const slot = videoSlot(p);
      if (!slot) return;
      visual.innerHTML = slot;
      window.MoneyVideo.mount(root.querySelector(".video-slot"), { lessonId: current.id, step: p.step, english: api.english() });
    }

    // 视觉区＝这一屏要「看」的东西。三种内容按优先级取一种：
    //   ① 配了片 → 视频卡（播放卡自带封面与播放按钮，是整块画面）；
    //   ② 第 2 步 → 星币分步演示。这里先画一个空的 .demo-money，
    //      TeachingMedia.mount() 会把它整体换成 .teaching-animation；
    //      万一某课没有演示帧，它也会留下「几枚星币」这个静态画面，不会是空盒；
    //   ③ 其余 → 角色舞台（课图标当道具 + 小芽按当前情绪换表情）。
    // 要「做」的东西全部留在 .stage-task。见 dialogue.css「上图下题」一节。
    function visualContent(p, slot) {
      if (p.step === 1) {
        const d = current.demo[p.demo];
        return `<div class="demo-money"><strong>${d.amount} ${txt("枚星币", "coins")}</strong>${coins(d.amount)}</div>`;
      }
      if (slot) return slot;
      // 练习与挑战如果自带星币场景，视觉区就交给场景 —— 货架、柜台、托盘
      // 取代「图标 + 角色占位」。要动手的东西应该在眼睛看着的地方。
      if (p.step === 2 || p.step === 3) {
        const d = exercise();
        if (d.type === "payScene" || d.type === "basket") return '<div class="coin-scene-slot"></div>';
      }
      const mood = lastFeedback ? (lastFeedback.success ? "happy" : "gentle") : p.step === 4 ? "happy" : p.step >= 2 ? "curious" : "welcome";
      const note = [
        txt("先听听小芽遇到了什么事", "Listen to what happened to Sunny"),
        txt("跟着星币看一遍", "Follow the money"),
        txt("轮到你做决定了", "Your turn to decide"),
        txt("换一个情境，自己试试", "A new situation, your own plan"),
        txt("今天的发现", "Today's discovery"),
      ][p.step];
      return `<div class="lesson-scene" data-mood="${mood}"><span class="scene-cast"><span class="scene-prop" aria-hidden="true">${current.icon}</span><span class="sunny-sprite" data-mood="${mood}" aria-hidden="true"></span></span><p class="scene-note">${h(note)}</p></div>`;
    }

    function stageContent(p, slot) {
      if (p.step === 0) return button(txt(slot ? "接着看故事 →" : "一起看看 →", slot ? "Go to the story →" : "Let's take a look →"), "next");
      if (p.step === 1) {
        const d = current.demo[p.demo];
        return `<h2 class="demo-heading">${h(t(d.title))} <small>${p.demo + 1} / ${current.demo.length}</small></h2>${button(txt(p.demo < current.demo.length - 1 ? "下一小步 →" : "我来试一下 →", p.demo < current.demo.length - 1 ? "Next little step →" : "Let me try →"), "demo")}`;
      }
      if (p.step < 4) return renderExercise(exercise());
      return button(txt("带着发现回地图 →", "Take my discovery to the map →"), "finish");
    }

    function check(index) {
      const p = progress(); if (p.passed) return;
      const d = exercise(); let ok = false, message;
      p.attempts += 1;
      if (d.type === "choice" || d.type === "payScene") {
        const answer = d.options[index]; if (!answer) return;
        p.selected = [index]; ok = answer.correct; message = answer.feedback;
      } else if (d.type === "basket") {
        const chosen = d.items.filter((i) => p.selected.includes(i.id));
        const sum = chosen.reduce((a, i) => a + i.cost, 0);
        const missing = d.items.filter((i) => d.required.includes(i.id) && !p.selected.includes(i.id));
        ok = sum <= d.budget && !missing.length;
        message = sum > d.budget ? L(`一共要 ${sum} 枚，你有 ${d.budget} 枚，还差 ${sum - d.budget} 枚。拿出一件可以等等的东西，再试试。`, `Your basket costs ${sum}, but you have ${d.budget}: ${sum - d.budget} short. Remove something that can wait.`)
          : missing.length ? L(`再看看今天要做的事。还缺：${missing.map((i) => i.name.zh).join("、")}。`, `Check today's task. Still needed: ${missing.map((i) => i.name.en).join(", ")}.`)
          : L(`需要的都齐了！花 ${sum} 枚，还剩 ${d.budget - sum} 枚。不花光也很好。`, `Everything needed is here! Spend ${sum}, keep ${d.budget - sum}. Leaving money is fine.`);
        // 钱的动作在前，奖励在后：先把「准备付」区的币付给店家，再庆祝。
        if (ok && sceneWidget) {
          sceneWidget.lock(true);
          sceneWidget.paySuccess().then(() => commit(true, message));
          return;
        }
      } else if (d.type === "stock") {
        if (!p.amount) { feedback(L("先选择准备几份。", "Choose how many items to prepare first."), false); return; }
        const sold = Math.min(p.amount, d.demand), left = p.amount - sold, missed = d.demand - sold;
        p.result = { quantity: p.amount, sold, left, missed, cash: 10 - p.amount * 2 + sold * 3 };
        ok = p.amount === d.demand;
        message = left ? L(`还有 ${left} 份没卖出。它们还在货架上，但买货用的钱暂时不能拿来买别的。试着少准备一点。`, `${left} items remain. They still exist, but the cash used to buy them is tied up. Try preparing fewer.`)
          : missed ? L(`有 ${missed} 位顾客没买到。已经知道预约人数，可以再多准备一点。`, `${missed} customers missed out. With bookings known, try preparing a little more.`)
          : L("刚刚好，每位顾客都买到了，也没有多余库存。你根据已知的需求做了计划。", "Everyone was served with no extra stock. You planned using the known demand.");
      } else if (d.type === "jars") {
        const left = d.total - p.amount;
        ok = p.amount > 0 && left >= d.reserve && (!d.requireTarget || p.amount >= d.target);
        message = left < d.reserve ? L(`明天只剩 ${left} 枚，不够需要的 ${d.reserve} 枚。把一些钱从愿望口袋移回来。`, `Only ${left} remain for tomorrow, below the ${d.reserve} needed. Move some money back.`)
          : !p.amount ? L("试着给愿望留一点点，同时保留明天要用的钱。", "Try saving a little while keeping tomorrow's money.")
          : d.requireTarget && p.amount < d.target ? L(`已经存了 ${p.amount} 枚，再看看能不能留好车费，同时存够 ${d.target} 枚。`, `You saved ${p.amount}. Can you protect the bus fare and reach ${d.target}?`)
          : L(`你存了 ${p.amount} 枚，还留着 ${left} 枚可以用。两个口袋加起来仍是 ${d.total} 枚。`, `You saved ${p.amount} and kept ${left} available. The two pockets still total ${d.total}.`);
      }
      commit(ok, message);

      // 过关与反馈的公共收尾：购物篮付款飞币完成后也从这里走。
      function commit(good, note) {
        p.passed = good;
        if (good) api.state.learningStars = (api.state.learningStars || 0) + 1;
        lastFeedback = { message: note, success: good }; p.dialogueKey = ""; render();
        if (good) window.TeachingMedia.celebrate(root, api.state.learningStars, api.english());
        if (good) root.querySelector('[data-dialogue="next"]')?.focus();
        else if (d.type === "choice" || d.type === "payScene") root.querySelector(`[data-choice="${index}"]`)?.focus();
        else root.querySelector('[data-lesson-action="check"]')?.focus();
      }
    }

    function act(action) {
      const p = progress();
      if (action === "hint") { feedback(current.goal, false); return; }
      if (action === "check") { check(); return; }
      if (action === "finish") { api.complete(current.id); return; }
      // 付款场景的场景内动作：换段、付钱、买果汁、试买贴纸。
      if (action === "toPay") {
        const d = exercise();
        const pay = payState();
        if (pay.moved !== d.purse) return;
        pay.phase = "pay"; pay.moved = 0;
        lastFeedback = null; api.save(); render();
        return;
      }
      if (action === "pay") { payAttempt(); return; }
      if (action === "goods-juice") { buyJuice(); return; }
      if (action === "goods-stickers") { tryStickers(); return; }
      if (action === "demo" && p.demo < current.demo.length - 1) p.demo += 1;
      else if (action === "back") { p.step = Math.max(0, p.step - 1); p.demo = 0; p.passed = false; p.selected = []; p.amount = 0; p.result = null; p.pay = null; }
      else {
        if (p.step === 2 || p.step === 3) { if (!p.passed) return; }
        p.step = Math.min(4, p.step + 1); p.passed = false; p.selected = []; p.amount = 0; p.result = null; p.pay = null;
      }
      lastFeedback = null; api.save(); render();
      document.getElementById("mission-layer").scrollTop = 0;
      root.querySelector("#lesson-heading").focus({ preventScroll: true });
    }

    return {
      open(id) {
        current = lessons.find((l) => l.id === id); if (!current) return;
        review = Boolean(api.state.completed[id]); lastFeedback = null;
        if (review) {
          // 复习不是重播：challenge 配了 variants 的课（第 1 课）换一组数字，
          // 第二次是练习而不是默写。首学永远用主版本（variant 0）。
          api.state.lessonProgress[id] = { step: 0, demo: 0, selected: [], amount: 0, passed: false, attempts: 0, variant: current.challenge.variants ? 1 : 0, pay: null };
        } else lastFeedback = progress().feedback || null;
        api.save(); render();
        window.MoneyVideo?.preload?.().then(backfillVideoSlot);
      },
      render,
    };
  }
})();

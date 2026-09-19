/* Guided lessons: all money is fictional and each exercise has its own purse. */
(() => {
  "use strict";
  const L = (zh, en) => ({ zh, en });
  const item = (id, icon, name, cost) => ({ id, icon, name, cost });
  const option = (label, correct, feedback) => ({ label, correct, feedback });
  const lessons = [
    {
      id: "lesson-1", icon: "👛", title: L("我的钱有多少？", "How much do I have?"),
      goal: L("买东西前，先看看自己的钱够不够。", "Check your money before choosing what to buy."),
      story: L("小芽准备去野餐。口袋里有 10 枚星币。面包、果汁、贴纸都想要，可是钱够吗？我们先陪她买一次。", "Sunny has 10 coins for a picnic. Bread, juice and stickers all look lovely. Can she buy them all? Let's help her."),
      demo: [
        { amount: 10, title: L("先数一数", "Count first"), text: L("这 10 枚就是今天能用的钱。想买的东西再多，口袋里的钱也不会自己变多。", "These 10 coins are today's spending money. Wanting more things does not add more coins.") },
        { amount: 4, title: L("买了面包", "Buy the bread"), text: L("面包花了 6 枚。10 − 6 = 4，口袋里还剩 4 枚。", "Bread costs 6. 10 − 6 = 4: four coins remain.") },
        { amount: 1, title: L("还能买什么？", "What fits now?"), text: L("果汁要 3 枚，买得起；贴纸要 5 枚，现在不够。买果汁后还剩 1 枚。", "Juice costs 3 and fits. Stickers cost 5 and do not. After juice, one coin remains.") },
      ],
      practice: { type: "choice", prompt: L("你还剩 4 枚。想买 5 枚的贴纸，怎么办？", "You have 4 coins left. The stickers cost 5. What can you do?"), options: [
        option(L("等攒够了再买", "Save up and buy later"), true, L("对，先等一等也是一个选择。4 比 5 少 1，现在还买不起。", "Yes. Waiting is a choice too. Four is one less than five.")),
        option(L("想要就能买", "Wanting it is enough"), false, L("我们再数一次：只有 4 枚，还缺 1 枚。想要一件东西，不会让钱自动增加。", "Count again: there are 4 coins and you need one more. Wanting something does not create money.")),
      ] },
      challenge: { type: "basket", budget: 9, prompt: L("明天画画要用铅笔和橡皮。你有 9 枚，选好要买的东西。", "You have 9 coins and need a pencil and eraser for drawing tomorrow. Pack your basket."), items: [item("pencil", "✏️", L("铅笔", "Pencil"), 5), item("eraser", "🧽", L("橡皮", "Eraser"), 3), item("badge", "🌟", L("小徽章", "Badge"), 4)], required: ["pencil", "eraser"] },
      takeaway: L("先数钱，再选择。不能一次买下所有东西，也没有关系。", "Count first, then choose. It is okay not to buy everything."),
      home: L("下次看到价签，试着说一说：如果有 10 元，买完还剩多少？不用真的购买。", "Look at a price tag: with $10, how much would remain? No purchase needed."),
    },
    {
      id: "lesson-2", icon: "🧺", title: L("先买哪一样？", "What comes first?"),
      goal: L("先照顾眼前要做的事，再想喜欢的东西。", "Choose what your task needs before the extras."),
      story: L("今天要为小店准备材料。小芽发现了漂亮的招牌，但少了做产品的材料，小店还能开门吗？", "Today we are getting the shop ready. Sunny loves a pretty sign. But can the shop open without its supplies?"),
      demo: [
        { amount: 10, title: L("先问：我要做什么？", "What is the task?"), text: L("今天要给顾客做一份产品。先找做产品要用的工具和材料。", "Today we need to make something for a customer. First find the tools and materials.") },
        { amount: 3, title: L("先买能开店的东西", "Supplies first"), text: L("工具 3 枚，材料 4 枚，一共 7 枚。10 − 7 = 3。小店可以开始了。", "Tools cost 3 and materials cost 4: 7 in total. 10 − 7 = 3. Now the shop can start.") },
        { amount: 3, title: L("喜欢的可以放在愿望单", "Keep a wish list"), text: L("招牌要 5 枚，现在先等等。想要并没有错，只是这一次材料更重要。", "The sign costs 5 and can wait. Wanting it is fine; supplies matter more for today's task.") },
      ],
      practice: { type: "shopBasket", budget: 10, prompt: L("轮到你准备小店了：先选齐工具和材料，别超过 10 枚。", "Prepare your shop: choose both tools and materials without spending more than 10 coins."), required: ["tools", "materials"] },
      challenge: { type: "basket", budget: 8, prompt: L("换个地方想一想：下雨了，出门需要雨伞。你有 8 枚，怎样选？不必把钱花光。", "A new situation: it is raining and you need an umbrella to go out. You have 8 coins. You do not have to spend them all."), items: [item("umbrella", "☂️", L("雨伞", "Umbrella"), 6), item("stickers", "🌈", L("贴纸", "Stickers"), 3), item("snack", "🍪", L("小饼干", "Cookie"), 2)], required: ["umbrella"] },
      takeaway: L("“需要”要看情境。今天先完成重要的事，喜欢的东西可以以后再选。", "Needs depend on the situation. Take care of the task; extras can wait."),
      home: L("和家长准备一次出门用品：哪样少了会影响今天的活动？", "Pack for an outing together: which missing item would stop today's activity?"),
    },
    {
      id: "lesson-3", icon: "🪙", title: L("卖到的钱都是赚的吗？", "Is every coin a gain?"),
      goal: L("把花掉的钱和收到的钱分开看。", "Separate money spent from money received."),
      story: L("小芽收到顾客给的 5 枚星币，很开心：“我赚了 5 枚！”等等，刚才买材料花了多少？我们把两笔钱一起看看。", "A customer pays Sunny 5 coins. 'I made five!' she says. Wait—what did the materials cost? Let's look at both steps."),
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
      id: "lesson-4", icon: "📦", title: L("今天准备几份？", "How many for today?"),
      goal: L("买之前想想用量，不是买得越多越好。", "Think about demand before buying more."),
      story: L("今天有 3 位顾客预约，每人要 1 份。小芽想：“买多一点，会不会赚更多？”我们让她试试，再看货架和口袋。", "Three customers booked one item each. Sunny wonders if buying more will mean earning more. Let's check the shelf and the purse."),
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
      id: "lesson-5", icon: "🐷", title: L("给愿望留一点钱", "Save for a wish"),
      goal: L("把今天要用的钱和为以后留的钱分开。", "Separate today's needs from money saved for later."),
      story: L("小芽想要 8 枚星币的新招牌。她现在有 12 枚，但明天买材料要 6 枚。愿望可以慢慢实现，小店也要能继续开门。", "Sunny wants an 8-coin sign. She has 12 coins, but tomorrow's supplies need 6. She can save gradually and keep the shop running."),
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
      id: "lesson-6", icon: "☂️", title: L("计划变了怎么办？", "What if plans change?"),
      goal: L("花钱时留一点余地，遇到变化可以重新安排。", "Leave some room in your plan and adjust when things change."),
      story: L("小店杯子不小心破了，要 5 枚才能补齐。小芽有 8 枚，昨天差点花 6 枚买装饰。幸好她先等了一等！", "Some shop cups broke and replacements cost 5 coins. Sunny has 8. Yesterday she almost spent 6 on decorations. Waiting helped today!"),
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
    let current, review = false, lastFeedback = null;
    const root = document.getElementById("guided-lesson");
    const t = (value) => api.english() ? value.en : value.zh;
    const h = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const txt = (zh, en) => t(L(zh, en));
    const progress = () => {
      const saved = api.state.lessonProgress[current.id] ||= { step: 0, demo: 0, selected: [], amount: 0, passed: false, attempts: 0 };
      return saved;
    };
    const coins = (amount) => `<div class="coin-row" aria-label="${amount} ${txt("星币", "coins")}">${Array.from({ length: amount }, () => '<span aria-hidden="true">●</span>').join("")}</div>`;
    const button = (label, action, css = "primary-button") => `<button type="button" class="${css}" data-lesson-action="${action}">${h(label)}</button>`;
    const panel = (title, copy) => `<div class="teach-panel"><h2>${h(title)}</h2><p>${h(copy)}</p></div>`;

    function exercise() {
      const p = progress();
      const data = { ...(p.step === 2 ? current.practice : current.challenge) };
      if (data.type === "shopBasket") {
        data.type = "basket";
        const nail = api.state.scenario === "nail-artist";
        data.items = [item("tools", nail ? "🧰" : "🥤", nail ? L("工具", "Tools") : L("杯子", "Cups"), 3), item("materials", nail ? "🎨" : "🥛", nail ? L("甲油", "Polish") : L("牛奶", "Milk"), 4), item("sign", "✨", L("漂亮招牌", "Pretty sign"), 5)];
      }
      return data;
    }

    function feedback(message, success) {
      lastFeedback = { message, success };
      const node = root.querySelector(".lesson-feedback");
      if (!node) return;
      node.hidden = false;
      node.className = `lesson-feedback ${success ? "success" : "try-again"}`;
      node.textContent = `${success ? txt("发现了！", "You found it! ") : txt("一起再看看：", "Let's look again: ")}${t(message)}`;
    }

    function renderExercise(data) {
      const p = progress();
      let html = `<h2>${h(t(data.prompt))}</h2>`;
      if (data.type === "choice") {
        html += `<div class="lesson-choices">${data.options.map((o, i) => `<button type="button" data-choice="${i}" ${p.passed ? "disabled" : ""} class="${p.selected[0] === i ? "is-selected" : ""}">${h(t(o.label))}</button>`).join("")}</div>`;
      } else if (data.type === "basket") {
        const sum = data.items.filter((i) => p.selected.includes(i.id)).reduce((a, i) => a + i.cost, 0);
        html += `<div class="lesson-wallet"><strong>${txt("一共有", "Budget")} ${data.budget} 🪙</strong><span>${txt("已选", "Selected")} ${sum} · ${sum > data.budget ? txt("还差", "Short by") : txt("还剩", "Remaining")} ${Math.abs(data.budget - sum)}</span></div>`;
        html += `<div class="lesson-choices basket-choices">${data.items.map((i) => `<button type="button" data-item="${i.id}" aria-pressed="${p.selected.includes(i.id)}" ${p.passed ? "disabled" : ""}><span aria-hidden="true">${i.icon}</span><strong>${h(t(i.name))}</strong><span>${i.cost} 🪙 ${p.selected.includes(i.id) ? "✓" : "+"}</span></button>`).join("")}</div><p class="lesson-hint">${txt("点一下放进篮子，再点一下拿出来。", "Tap to add to your basket; tap again to remove.")}</p>`;
      } else if (data.type === "stock") {
        html += `<div class="lesson-wallet"><span>${txt("开门前", "Starting cash")} 10 🪙</span><span>${txt("进货一份", "Cost each")} 2 🪙</span><span>${txt("卖出一份", "Price each")} 3 🪙</span></div><div class="lesson-choices quantity-choices">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-amount="${n}" aria-pressed="${p.amount === n}" ${p.passed ? "disabled" : ""}>${n} ${txt("份", "items")}</button>`).join("")}</div>`;
        if (p.result) {
          const r = p.result;
          html += `<div class="stock-result" role="status"><h3>${txt("这次小店发生了什么？", "What happened this time?")}</h3><p>${txt("花了", "Spent")} ${r.quantity * 2} · ${txt("卖出", "Sold")} ${r.sold} · ${txt("货架剩", "Stock left")} ${r.left} · ${txt("没买到的顾客", "Unserved")} ${r.missed}</p><p>${txt("口袋里的钱", "Cash now")}: 10 − ${r.quantity * 2} + ${r.sold * 3} = <strong>${r.cash} 🪙</strong></p><p>${txt("卖出部分的利润", "Profit on items sold")}: ${r.sold * 3} − ${r.sold * 2} = ${r.sold} 🪙</p><small>${txt("剩下的货还在，不等于钱全亏掉。这个练习没有租金，也没有货物变质。", "Unsold stock still exists; it is not all lost money. This exercise excludes rent and spoilage.")}</small></div>`;
        }
      } else if (data.type === "jars") {
        html += `<div class="lesson-wallet"><span>${txt("一共有", "Total")} ${data.total} 🪙</span><span>${txt("明天至少要用", "Needed tomorrow")} ${data.reserve} 🪙</span></div><label class="jar-control">${txt("存到愿望口袋", "Put in the wish pocket")}<input type="range" min="0" max="${data.total}" value="${p.amount}" ${p.passed ? "disabled" : ""} id="saving-amount" /></label><div class="jar-grid"><article><span>🐷</span><strong>${p.amount} / ${data.target}</strong><p>${txt("我的愿望", "My wish")}</p><progress value="${Math.min(p.amount, data.target)}" max="${data.target}"></progress></article><article><span>👛</span><strong>${data.total - p.amount} 🪙</strong><p>${txt("留下可以用的钱", "Money kept available")}</p></article></div>`;
      }
      html += '<p class="lesson-feedback" role="status" hidden></p>';
      if (!p.passed && data.type !== "choice") html += button(txt(data.type === "stock" ? "开门试一试" : "看看我的选择", data.type === "stock" ? "Try this shop day" : "Check my choices"), "check");
      if (!p.passed) html += button(txt("给我一点提示", "Give me a hint"), "hint", "quiet-button");
      if (p.passed) html += button(txt(p.step === 2 ? "换个情境，我来试试 →" : "说说今天的发现 →", p.step === 2 ? "Try a new situation →" : "My discovery →"), "next");
      return html;
    }

    function render() {
      if (!current) return;
      const p = progress();
      const stages = [L("故事时间", "Story"), L("陪你看一遍", "Watch together"), L("一起试试", "Try together"), L("这次我来", "Your turn"), L("我的发现", "Discovery")];
      root.innerHTML = `<header class="mission-title blue"><span aria-hidden="true">${current.icon}</span><div><p>${txt("第", "Lesson ")}${lessons.indexOf(current) + 1}${txt("课 · 一次学一件事", " · One idea at a time")}</p><h1 tabindex="-1" id="lesson-heading">${h(t(current.title))}</h1><p>${h(t(current.goal))}</p></div></header><ol class="lesson-steps">${stages.map((s, i) => `<li ${i === p.step ? 'aria-current="step"' : ""} class="${i < p.step ? "done" : ""}">${i < p.step ? "✓" : i + 1} ${h(t(s))}</li>`).join("")}</ol><div class="lesson-teacher"><span aria-hidden="true">🌱</span><p>${txt("我是小芽，陪你一起学。不着急，试错不会扣你的钱。", "I'm Sunny. Let's learn together. Take your time—mistakes never cost your game money.")}</p></div><div class="lesson-stage">${stageContent(p)}</div><div class="lesson-bottom">${p.step > 0 ? button(txt("← 再看前面的讲解", "← Review the explanation"), "back", "quiet-button") : ""}<span>${txt("每个练习有自己的星币 · 随时返回会保存本课步骤", "Each exercise has its own coins · Your lesson step saves when you leave")}</span></div>`;
      document.getElementById("mission-progress-label").textContent = `${p.step + 1} / 5`;
      document.getElementById("mission-progress-fill").style.width = `${(p.step + 1) * 20}%`;
      root.querySelectorAll("[data-lesson-action]").forEach((b) => b.addEventListener("click", () => act(b.dataset.lessonAction)));
      root.querySelectorAll("[data-choice]").forEach((b) => b.addEventListener("click", () => check(Number(b.dataset.choice))));
      root.querySelectorAll("[data-item]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.item;
        p.selected = p.selected.includes(id) ? p.selected.filter((v) => v !== id) : [...p.selected, id];
        lastFeedback = null; api.save(); render(); root.querySelector(`[data-item="${id}"]`).focus();
      }));
      root.querySelectorAll("[data-amount]").forEach((b) => b.addEventListener("click", () => { p.amount = Number(b.dataset.amount); lastFeedback = null; api.save(); render(); root.querySelector(`[data-amount="${p.amount}"]`).focus(); }));
      root.querySelector("#saving-amount")?.addEventListener("input", (e) => {
        p.amount = Number(e.target.value); lastFeedback = null;
        const jars = root.querySelectorAll(".jar-grid strong"); jars[0].textContent = `${p.amount} / ${exercise().target}`; jars[1].textContent = `${exercise().total - p.amount} 🪙`;
        root.querySelector("progress").value = Math.min(p.amount, exercise().target);
        root.querySelector(".lesson-feedback").hidden = true; api.save();
      });
      if (lastFeedback) feedback(lastFeedback.message, lastFeedback.success);
    }

    function stageContent(p) {
      if (p.step === 0) return panel(txt("今天的小故事", "Today's little story"), t(current.story)) + button(txt("陪小芽看一遍 →", "Watch with Sunny →"), "next");
      if (p.step === 1) {
        const d = current.demo[p.demo];
        return `<p class="lesson-hint">${txt("慢慢点，一次看一步", "One tap, one step")} · ${p.demo + 1} / ${current.demo.length}</p>${panel(t(d.title), t(d.text))}<div class="demo-money"><strong>${d.amount} ${txt("枚星币", "coins")}</strong>${coins(d.amount)}</div>${button(txt(p.demo < current.demo.length - 1 ? "接下来呢？ →" : "我来试一下 →", p.demo < current.demo.length - 1 ? "What happens next? →" : "Let me try →"), "demo")}`;
      }
      if (p.step < 4) return renderExercise(exercise());
      return `${panel(txt("今天我发现……", "Today I discovered…"), t(current.takeaway))}<div class="home-activity"><h3>${txt("带回生活里 · 可以和家长一起试", "Try it in real life · With an adult")}</h3><p>${h(t(current.home))}</p></div><p>${txt("这一课到这里。可以休息一下，下次再学新的。", "That is enough for this lesson. Take a break; the next idea can wait.")}</p>${button(txt(review ? "复习完成，回到地图" : "记下我的发现，回到地图", review ? "Finish review and return" : "Save my discovery and return"), "finish")}`;
    }

    function check(index) {
      const p = progress(); if (p.passed) return;
      const d = exercise(); let ok = false, message;
      p.attempts += 1;
      if (d.type === "choice") {
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
      p.passed = ok; api.save(); lastFeedback = { message, success: ok }; render();
      if (ok) root.querySelector('[data-lesson-action="next"]')?.focus();
      else if (d.type === "choice") root.querySelector(`[data-choice="${index}"]`)?.focus();
      else root.querySelector('[data-lesson-action="check"]')?.focus();
    }

    function act(action) {
      const p = progress();
      if (action === "hint") { feedback(L(`先回想：${current.goal.zh} 可以点下方“再看前面的讲解”，不会扣分。`, `Remember: ${current.goal.en} You can review the explanation below, without losing points.`), false); return; }
      if (action === "check") { check(); return; }
      if (action === "finish") { api.complete(current.id); return; }
      if (action === "demo" && p.demo < current.demo.length - 1) p.demo += 1;
      else if (action === "back") { p.step = Math.max(0, p.step - 1); p.demo = 0; p.passed = false; p.selected = []; p.amount = 0; p.result = null; }
      else {
        if (p.step === 2 || p.step === 3) { if (!p.passed) return; }
        p.step = Math.min(4, p.step + 1); p.passed = false; p.selected = []; p.amount = 0; p.result = null;
      }
      lastFeedback = null; api.save(); render();
      document.getElementById("mission-layer").scrollTop = 0;
      root.querySelector("#lesson-heading").focus({ preventScroll: true });
    }

    return {
      open(id) {
        current = lessons.find((l) => l.id === id); if (!current) return;
        review = Boolean(api.state.completed[id]); lastFeedback = null;
        if (review) api.state.lessonProgress[id] = { step: 0, demo: 0, selected: [], amount: 0, passed: false, attempts: 0 };
        api.save(); render();
      },
      render,
    };
  }
})();

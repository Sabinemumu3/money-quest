/* Short, authored conversations. No child messages are sent to a server. */
(() => {
  "use strict";
  const L = (zh, en) => ({ zh, en });
  const S = (zh, en, mood = "welcome") => ({ who: "sunny", text: L(zh, en), mood });
  const T = (zh, en) => ({ who: "tuan", text: L(zh, en), mood: "curious" });
  const stories = [
    [T("小芽，野餐想吃面包，还想喝果汁！", "Sunny, I'd like bread AND juice for our picnic!"), S("好呀！先摸摸口袋，我们有 10 枚星币。", "Okay! Let's check our purse. We have 10 coins."), T("我还想买贴纸，都能带走吗？", "And stickers! Can we get everything?"), S("一起数数看。钱不够的，可以等一等。", "Let's count together. Some things can wait.", "gentle")],
    [T("哇，这个招牌好漂亮！先买它吧？", "Ooh, that sign is pretty! Shall we buy it first?"), S("今天要开小店。工具和材料还没买呢。", "We're opening our shop today. We still need tools and materials."), T("没有材料，就做不出东西了呀。", "Without materials, we can't make anything!"), S("对啦！先把今天要做的事准备好。", "That's it! Let's get what today's task needs first.", "happy")],
    [T("顾客给了 5 枚！我们赚了 5 枚吗？", "The customer paid 5! Did we earn all five?"), S("嗯……做这份东西，材料也花了钱。", "Hmm… we paid for the materials too.", "curious"), T("哦！那要把花掉的钱算进去。", "Oh! We need to count what we spent."), S("一起看：钱出去，再进来，究竟多了多少？", "Let's watch money go out and come in. How much did we gain?")],
    [T("今天有 3 位顾客，每人要 1 份！", "Three customers today. One item each!"), S("那你想准备几份呢？", "How many should we prepare?", "curious"), T("买多一点，会不会赚更多？", "Would buying more help us earn more?"), S("试试看！也看看货架和口袋有什么变化。", "Let's try! Watch both the shelf and the purse.")],
    [T("我想要 8 枚的新招牌！", "I'd love that new sign. It costs 8 coins!"), S("现在有 12 枚，但明天的材料要用 6 枚。", "We have 12 coins, but tomorrow's materials need 6."), T("那我的愿望怎么办呢？", "What about my wish?"), S("给钱分两个小口袋：明天用，和慢慢存。", "Let's make two pockets: tomorrow's needs and savings.", "gentle")],
    [T("这串装饰 6 枚，好想买呀！", "These decorations cost 6. I'd love them!"), S("我们有 8 枚。等等，杯子坏了，要补 5 枚。", "We have 8 coins. Oh! Broken cups need replacing for 5."), T("要是先买装饰，还够换杯子吗？", "If we buy decorations first, can we still replace the cups?"), S("先停一下，一起想想接下来会怎样。", "Let's pause and think about what would happen.", "gentle")],
  ];
  const questions = [
    [L("口袋到底有多少？", "How much is in our purse?"), L("面包要 6 枚，买完还剩多少？", "Bread costs 6. How much will be left?"), L("剩下的钱，够买什么呢？", "What can we afford with what's left?")],
    [L("开店前先找什么？", "What do we need before opening?"), L("工具和材料一共花多少？", "How much do tools and materials cost?"), L("现在可以买招牌吗？", "Can we buy the sign now?")],
    [L("原来的 10 枚也是今天赚的吗？", "Did we earn those starting 10 coins today?"), L("买材料，钱会去哪儿？", "Where does the money go when we buy materials?"), L("顾客付钱以后呢？", "What happens when the customer pays?"), L("口袋有 13 枚，真正多了几枚？", "We have 13 coins. How many did we actually gain?")],
    [L("今天知道有几位顾客呢？", "How many customers do we know are coming?"), L("如果一下买 5 份呢？", "What if we buy five items?"), L("顾客走了，货都卖完了吗？", "The customers have left. Did everything sell?")],
    [L("现在有 12 枚，都能存起来吗？", "Can we save all 12 coins?"), L("两个口袋怎么分？", "How can we split it into two pockets?"), L("存下的 6 枚，够买招牌了吗？", "Are the 6 saved coins enough for our sign?")],
    [L("先买装饰，口袋会怎样？", "What happens if we buy decorations first?"), L("只剩 2 枚，能补杯子吗？", "With only 2 left, can we replace the cups?"), L("换个顺序，会不会更好？", "Would changing the order help?")],
  ];
  const tries = [
    [ [T("我有 4 枚，贴纸却要 5 枚……", "I have 4 coins, but the stickers cost 5…"), S("你觉得怎么办？点一个主意吧。", "What could we do? Pick an idea.", "curious")], [T("明天画画，要用铅笔和橡皮！", "We need a pencil and eraser for drawing tomorrow!"), S("你有 9 枚。帮团团装好购物篮吧。", "You have 9 coins. Help Tuan fill the basket.")] ],
    [ [T("小店要开门啦，先买什么？", "The shop is opening! What should we buy first?"), S("一共 10 枚。工具和材料要备齐哦。", "We have 10 coins. We need both tools and materials.")], [T("下雨了，出门得带雨伞。", "It's raining. We need an umbrella to go out."), S("你有 8 枚。不用把钱都花光。", "You have 8 coins. You don't have to spend it all.", "gentle")] ],
    [ [T("原来 10 枚，花 2 枚，又收到 5 枚。", "We started with 10, spent 2, then received 5."), S("现在有 13 枚。这一笔真正赚了多少？", "We now have 13. How much did this sale actually earn?", "curious")], [T("卡片材料花 3 枚，卖出收到 7 枚。", "A card costs 3 to make and sells for 7."), S("没有其他花费。这一笔赚了多少？", "There are no other costs. What is the profit?", "curious")] ],
    [ [T("3 位顾客，每人要 1 份。", "Three customers want one item each."), S("进货每份 2 枚，卖出 3 枚。你准备几份？", "Each costs 2 and sells for 3. How many will you prepare?", "curious")], [T("新一天！确定有 2 位顾客。", "A new day! Exactly two customers are coming."), S("让每人买到 1 份，也别留下多余的货。", "Prepare one each, without leftover stock.")] ],
    [ [T("我有 12 枚，愿望需要 8 枚。", "I have 12 coins. My wish costs 8."), S("明天先留 6 枚。你想给愿望存多少？", "Keep 6 for tomorrow. How much would you like to save?", "curious")], [T("我有 10 枚，车费要留 6 枚。", "I have 10 coins. I need 6 for the bus."), S("愿望要 4 枚。滑一滑，两个都照顾到吧！", "Your wish costs 4. Move the slider to cover both!")] ],
    [ [T("只有 8 枚。装饰 6 枚，补杯子 5 枚。", "We have 8 coins. Decorations cost 6; new cups cost 5."), S("今天要开店，你会先选哪个？", "We need to open today. Which comes first?", "curious")], [T("周末有 20 枚，已经答应参加 12 枚的活动。", "We have 20 coins and a planned activity costs 12."), S("玩具要 10 枚。你会怎么安排？", "A toy costs 10. What would you do?", "curious")] ],
  ];
  // Keep each bubble short, without truncating explanations or splitting decimals.
  function chunks(text, english) {
    if (text.length <= (english ? 110 : 42)) return [text];
    const sentences = text.split(english ? /(?<=[!?])\s*|(?<=\.)\s+/u : /(?<=[。！？])\s*/u).filter(Boolean);
    return sentences.flatMap(sentence => sentence.length > (english ? 110 : 42)
      ? sentence.split(english ? /(?<=[;:])\s*/u : /(?<=[，；：])\s*/u).filter(Boolean) : [sentence]);
  }
  const localize = (turns, english) => turns.flatMap(turn => chunks(english ? turn.text.en : turn.text.zh, english).map(text => ({ ...turn, text })));
  function lesson(config) {
    const { current, p, feedback, english } = config, n = Number(current.id.slice(-1)) - 1;
    if (feedback) return localize([
      T(feedback.success ? "这样安排，可以吗？" : "咦，哪里要再想一想？", feedback.success ? "Does that plan work?" : "Hmm, what should we rethink?"),
      { who: "sunny", mood: feedback.success ? "happy" : "gentle", text: feedback.message },
      S(feedback.success ? "想明白啦！要不要换个地方试试？" : "没关系，你可以改一改，再试一次。", feedback.success ? "We worked it out! Ready to try another situation?" : "That's okay. Change your choice and try again.", feedback.success ? "happy" : "gentle"),
    ], english);
    if (p.step === 0) return localize(stories[n], english);
    if (p.step === 2 || p.step === 3) return localize(tries[n][p.step - 2], english);
    if (p.step === 4) return localize([T("今天的小发现是什么呀？", "What did we discover today?"), { who: "sunny", mood: "happy", text: current.takeaway }, T("生活里也能试试吗？", "Can we try it in real life too?"), { who: "sunny", mood: "welcome", text: current.home }, S("今天到这里啦！休息一下，下次再见。", "That's enough for today! Take a break. See you next time.", "gentle")], english);
    return [];
  }
  function demo(config, frames) {
    const q = questions[Number(config.lessonId.slice(-1)) - 1][config.demo];
    return [{ who: "tuan", mood: "curious", text: config.english ? q.en : q.zh, frame: 0 }, ...frames.flatMap((frame, i) => chunks(frame.caption, config.english).map(text => ({ who: "sunny", mood: i === frames.length - 1 ? "happy" : "welcome", text, frame: i })))];
  }
  function market(english, ran, worth, answer) {
    if (answer) return localize([T("分到不同公司，就一定不会亏吗？", "If we spread money across companies, is loss impossible?"), S(answer === "yes" ? "还不能这样保证哦。好几家公司也可能一起跌。" : "对！好几家公司也可能一起跌。", answer === "yes" ? "We can't promise that. Several companies can fall together." : "Right! Several companies can fall together.", answer === "yes" ? "gentle" : "happy"), S("分散只会减少单一公司的影响，不会消除风险。", "Spreading money reduces one company's impact. It does not remove risk.")], english);
    if (ran) return localize([T("一周过去，发生什么啦？", "A week has passed. What happened?"), S("水务需求稳定，水务价格上涨。", "Steady water demand: the water company rose."), S("游戏延期，游戏公司价格下跌。", "A delayed game: the game company fell."), S("公交客流增加，交通公司价格上涨。", "More bus passengers: the transport company rose."), T(`我们现在一共有 ${worth} 枚实验币的价值！`, `Our cash and shares are now worth ${worth} lab coins!`), S("这只是虚构的一周，不能预测下一次哦。", "This week is fictional. It cannot predict the next one.", "gentle"), T("分散到不同公司，就保证不会亏吗？", "Does spreading money across companies mean we can't lose?")], english);
    return localize([T("股票是什么？能摸到吗？", "What's a share? Can I hold it?"), S("可以想成：拥有一家公司的很小一份。", "Think of it as owning a tiny piece of a company."), T("那公司给我的钱，会一直变多吗？", "Will it always make me more money?"), S("不会哦。股票的价格会变高，也会变低。", "No. A share's price can go up or down.", "gentle"), S("这里只有 100 枚实验币，没有真钱和真实股票。", "We have 100 lab coins here. No real money or real shares."), T("我们来观察，不是比谁赚得多！", "Let's observe, not compete to make the most!"), S("试着选两家不同公司，再看看这一周。", "Try two different companies, then watch this pretend week.")], english);
  }
  window.MoneyDialogues = { lesson, demo, market, chunks };
})();

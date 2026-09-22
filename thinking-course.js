/* A local-only, branching sample lesson. Preferences are not right/wrong answers. */
(() => {
  "use strict";
  const KEY = "future-thinking-picnic-v1";
  const L = (zh, en) => ({zh,en});
  const initial = () => ({version:1, language:"zh-CN", stage:0, wish:null, basket:[], first:[], prediction:null, plans:[], final:[], reasons:[], transfer:[], transferAttempts:0, transferHint:false, transferPassed:false, explained:false, done:false, elapsed:0, chatIndex:0, chatKey:""});
  const picnic = [
    {id:"bread",icon:window.mqIcon("bread"),name:L("面包","Bread"),price:6,food:true},
    {id:"apple",icon:window.mqIcon("apple"),name:L("苹果","Apple"),price:4,food:true},
    {id:"juice",icon:window.mqIcon("juice"),name:L("果汁","Juice"),price:3},
    {id:"stickers",icon:window.mqIcon("rainbow"),name:L("贴纸","Stickers"),price:5},
  ];
  const supplies = [
    {id:"pencil",icon:window.mqIcon("pencil"),name:L("铅笔","Pencil"),price:3},
    {id:"eraser",icon:window.mqIcon("eraser"),name:L("橡皮","Eraser"),price:2},
    {id:"stickers",icon:window.mqIcon("rainbow"),name:L("贴纸","Stickers"),price:4},
    {id:"notebook",icon:window.mqIcon("notebook"),name:L("小本子","Notebook"),price:2},
  ];
  const predictions = { spare:L("够，还能剩钱","Enough, with some left"), exact:L("刚好花完","Exactly enough"), short:L("不够，要改一改","Not enough; change the plan"), help:L("还不确定，一起数数","Not sure yet. Let's count") };
  const reasons = { budget:L("我想让钱够用","I want it to fit my budget"), food:L("先准备一份吃的","I need something to eat"), wish:L("想留下喜欢的那样","I want to keep my favourite"), save:L("想留一点钱以后用","I want some money left for later"), own:L("我有自己的理由，想说一说","I have my own reason to say aloud") };
  let state = initial(), storageOK = true, paused = false, lastActive = Date.now(), visitSeconds = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved?.version === 1) {
      state = {...state,...saved};
      state.stage = Math.max(0,Math.min(7,Number.isInteger(saved.stage)?saved.stage:0));
      state.language = saved.language === "en" ? "en" : "zh-CN";
      for (const k of ["basket","first","final"]) state[k] = [...new Set((Array.isArray(saved[k])?saved[k]:[]).filter(id=>picnic.some(i=>i.id===id)))];
      state.transfer = [...new Set((Array.isArray(saved.transfer)?saved.transfer:[]).filter(id=>supplies.some(i=>i.id===id)))];
      state.reasons = (Array.isArray(saved.reasons)?saved.reasons:[]).filter(id=>Object.hasOwn(reasons,id));
      state.plans = Array.isArray(saved.plans)?saved.plans.slice(-6):[];
      state.elapsed = Number.isFinite(saved.elapsed)&&saved.elapsed>=0?saved.elapsed:0;
    }
  } catch { storageOK = false; }
  const root = document.getElementById("thinking-main");
  const t = (zh,en) => state.language === "en" ? en : zh;
  const tr = v => state.language === "en" ? v.en : v.zh;
  const h = v => String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  const selected = (list,ids) => list.filter(i=>ids.includes(i.id));
  const total = (ids,list=picnic) => selected(list,ids).reduce((n,i)=>n+i.price,0);
  const hasFood = ids => selected(picnic,ids).some(i=>i.food);
  const validPlan = ids => total(ids)<=10 && hasFood(ids);
  const validTransfer = () => state.transfer.includes("pencil") && state.transfer.includes("eraser") && total(state.transfer,supplies)<=8;
  const names = (ids,list=picnic) => selected(list,ids).map(i=>tr(i.name)).join(t("、",", ")) || t("还没放东西","Nothing packed yet");
  const icons = (ids,list=picnic) => selected(list,ids).map(i=>i.icon).join(" ") || "—";
  const S = (zh,en,mood="welcome") => ({who:"sunny",mood,text:t(zh,en)});
  const T = (zh,en) => ({who:"tuan",mood:"curious",text:t(zh,en)});
  let feedback = null;
  function save() {
    try { localStorage.setItem(KEY,JSON.stringify(state)); storageOK=true; } catch { storageOK=false; }
    document.getElementById("local-save").textContent = storageOK ? t("自动保存到本机 · 都是虚拟币","Saved on this device · All coins are pretend") : t("本次仍可玩，但无法保存。请先不要关闭页面。","You can play, but saving is unavailable. Keep this page open.");
  }
  const action = (label,id,disabled=false,secondary=false) => `<button type="button" class="${secondary?"secondary-action":"primary-button"}" data-action="${id}" ${disabled?"disabled":""}>${h(label)}</button>`;
  const choice = (label,id,kind,pressed=false,icon="",sub="") => `<button class="thinking-choice" type="button" data-${kind}="${id}" aria-pressed="${pressed}">${icon?`<span class="choice-icon" aria-hidden="true">${icon}</span>`:""}<span><strong>${h(label)}</strong>${sub?`<small>${h(sub)}</small>`:""}</span><span class="choice-mark" aria-hidden="true">${pressed?"✓":"+"}</span></button>`;
  function shop(list,ids) {
    return `<div class="shop-items">${list.map(i=>`<button type="button" class="shop-item" data-item="${i.id}" aria-pressed="${ids.includes(i.id)}"><span class="item-check" aria-hidden="true">${ids.includes(i.id)?"✓":"+"}</span><span class="item-icon" aria-hidden="true">${i.icon}</span><strong>${h(tr(i.name))}</strong><span class="item-price">${i.price} ${t("枚","coins")}</span></button>`).join("")}</div><div class="backpack-strip" aria-live="polite"><strong>${t("我的背包","My bag")}</strong>${selected(list,ids).map(i=>`<span>${i.icon} ${h(tr(i.name))}</span>`).join("")||`<span>${t("点一下放进来","Tap something to pack it")}</span>`}</div>`;
  }
  const coins = (n,css="") => `<div class="think-coins" aria-hidden="true">${Array.from({length:Math.max(0,n)},(_,i)=>`<span class="think-coin ${css}" style="animation-delay:${i*25}ms">1</span>`).join("")||"—"}</div>`;
  function ledger(ids,budget=10,list=picnic) {
    const cost=total(ids,list), fits=cost<=budget;
    return `<div class="coin-lab"><div class="coin-equation">${fits?`${budget} − ${cost} = ${budget-cost}`:`${cost} − ${budget} = ${cost-budget}`}</div><div class="coin-groups">${fits?`<div class="coin-group spent"><strong>${t("试着付出","Pretend payment")} ${cost}</strong>${coins(cost)}</div><div class="coin-group"><strong>${t("还剩","Left")} ${budget-cost}</strong>${coins(budget-cost)}</div>`:`<div class="coin-group"><strong>${t("我有","I have")} ${budget}</strong>${coins(budget)}</div><div class="coin-group"><strong>${t("还差","Need another")} ${cost-budget}</strong>${coins(cost-budget,"needed")}</div>`}</div></div>`;
  }
  function conversations() {
    if(feedback) return feedback;
    if(state.stage===0) return [T("明天去野餐！我想带点自己喜欢的。","We're going on a picnic! I'd like something I love."),S("一共有 10 枚。先准备一份吃的，再想想喜欢的。","We have 10 coins. Pack something to eat, then consider a treat."),T("你最想带哪一样？喜欢没有标准答案。","What would you most like? There's no right favourite.")];
    if(state.stage===1) return [T(state.wish==="none"?"那就先看看，有哪些能带去。":`我记得，你喜欢${names([state.wish])}！`,state.wish==="none"?"Let's see what we could take.":`I remember: you like ${names([state.wish])}!`),S("水已经装好，不用买。吃的选面包或苹果都可以。","Water is packed already. Bread or an apple can be our food."),T("我还没付款，可以放心试自己的想法。","We haven't paid. It's safe to try your own plan.")];
    if(state.stage===2) return [T("先别揭晓！你猜这 10 枚够不够？","Before we reveal it, will these 10 coins be enough?"),S("可以看价签，也可以在心里数。不确定也没关系。","Look at the prices or count in your head. It's okay to be unsure.","gentle")];
    if(state.stage===3) {
      const cost=total(state.first), result=cost>10?"short":cost===10?"exact":"spare";
      return [T(state.prediction==="help"?"我还不确定，想和你数数。":`我刚才猜：${tr(predictions[state.prediction])}。`,state.prediction==="help"?"I'm not sure. Let's count together.":`I guessed: ${tr(predictions[state.prediction])}.`),
        S(cost>10?`一共要 ${cost} 枚，只有 10 枚，还差 ${cost-10} 枚。`:`一共花 ${cost} 枚，10 减去 ${cost}，还剩 ${10-cost} 枚。`,cost>10?`It costs ${cost}. We have 10, so we need ${cost-10} more.`:`It costs ${cost}. Take ${cost} from 10; ${10-cost} remain.`),
        S(state.prediction==="help"?"不确定时，动手数就是一个办法。":state.prediction===result?"你先猜，再用星币检查了自己的想法。":"这次结果和猜的不一样。发现差别，也是在学习。",state.prediction==="help"?"Counting is a useful way to check when we're unsure.":state.prediction===result?"You made a prediction and checked it with coins.":"The result differs from your guess. Noticing that helps us learn.","gentle"),
        T(hasFood(state.first)?"也有吃的啦。还能想出别的安排吗？":"等一下，野餐要吃的东西还没装呢！",hasFood(state.first)?"We packed food too. Is there another possible plan?":"Wait, we haven't packed any food for the picnic!"),
        S("我会先看钱，再看今天要做什么，最后比较喜欢的。","I check the money, check what we need today, then compare the treats.")];
    }
    if(state.stage===4) return [T("现在知道结果了，你想保留什么，换掉什么？","Now that we've seen the result, what would you keep or change?"),S("面包、苹果都能作食物。钱够用，就不只有一种办法。","Bread or an apple can be our food. More than one plan can fit."),S("也可以保留原计划。想清楚了，不必为了改而改。","You can keep your original plan too. Change it only for a reason.","gentle")];
    if(state.stage===5) return [T("你为什么这样安排？我想听听你的理由。","Why did you choose this plan? I'd like to hear your reason."),S("选一两个理由，或者把自己的想法说给身边的人听。","Choose one or two reasons, or tell someone your own idea."),S("我们只看理由和计划是否相符，不给喜欢的东西打分。","Let's check whether the reason fits the plan. Favourites aren't graded.","gentle")];
    if(state.stage===6) return [T("换个地方！明天画画，铅笔和橡皮都要带。","A new situation! We need a pencil AND eraser for drawing tomorrow."),S("这次只有 8 枚。你来试试刚才的办法。","This time you have 8 coins. Try the strategy you just used."),S("遇到困难，可以请我提醒一点点。","If you get stuck, you can ask me for a small hint.","gentle")];
    return [T("原来，重要的是把自己的想法想清楚！","So what matters is thinking our choices through!"),S("你做了预测、看了结果，也试着解释自己的计划。","You predicted, checked the result and tried explaining your plan.","happy"),S("今天到这里就好。下次买东西，可以先问：钱够吗？","That's enough for today. Next time, ask: does it fit my budget?","gentle")];
  }
  function work() {
    if(state.stage===0) return `<h2>${t("野餐时，我最想带……","For the picnic, I'd love…")}</h2><div class="choice-stack">${choice(t("一盒果汁","A juice box"),"juice","wish",state.wish==="juice",window.mqIcon("juice"),t("甜甜的，野餐时喝","A sweet picnic drink"))}${choice(t("一张彩虹贴纸","Rainbow stickers"),"stickers","wish",state.wish==="stickers",window.mqIcon("rainbow"),t("给背包装饰一下","A little decoration for my bag"))}${choice(t("先看看，再决定","I'll look before deciding"),"none","wish",state.wish==="none",window.mqIcon("eyes"))}</div><div class="thinking-actions">${action(t("我来装背包 →","Let's pack →"),"start",!state.wish)}</div><p class="thinking-intro-note">${t("8–12 岁基础样板课 · 预留约 8–12 分钟，可随时休息。无需昵称、录音或付费。","Foundation sample for ages 8–12 · Allow about 8–12 minutes, with breaks whenever you like. No name, recording or payment required.")}</p>`;
    if(state.stage===1) return `<div class="wallet-strip"><span>${t("今天可以用","Today's budget")}</span><strong>10 ${window.mqIcon("coin")}</strong></div><p class="goal-note">${t("任务：带一份吃的。水已准备好","Task: pack some food. Water is already packed")}</p>${shop(picnic,state.basket)}<p class="helper-copy">${t("每样最多一份。再点一次可以拿出来。","One of each at most. Tap again to remove it.")}</p><div class="thinking-actions">${action(t("先猜猜钱够不够 →","Make a prediction →"),"predict",!state.basket.length)}</div>`;
    if(state.stage===2) return `<h2>${t("还没付钱，先猜一下","Before paying, make a guess")}</h2><div class="backpack-strip">${selected(picnic,state.first).map(i=>`<span>${i.icon} ${h(tr(i.name))} ${i.price}</span>`).join("")}</div><div class="choice-stack" style="margin-top:16px">${Object.entries(predictions).map(([id,label])=>choice(tr(label),id,"prediction",state.prediction===id,{spare:window.mqIcon("wallet"),exact:window.mqIcon("coin"),short:window.mqIcon("thinking"),help:window.mqIcon("hand")}[id])).join("")}</div><div class="thinking-actions">${action(t("试着付款，看一看 →","Try paying and see →"),"reveal",!state.prediction)}${action(t("我想改背包","Change my bag"),"repack",false,true)}</div>`;
    if(state.stage===3) {const cost=total(state.first);return `<h2>${t("我的想法，和发生的事","My prediction and what happened")}</h2><p class="helper-copy">${h(names(state.first))}</p>${ledger(state.first)}<div class="outcome-label ${cost<=10?"works":""}">${cost>10?t("这次没付款，10 枚都还在。想要的超过了现有的钱。","No payment happened. All 10 coins are still here; the basket costs more than we have."):t(`模拟付款后还剩 ${10-cost} 枚。下一步会退回星币，让你重新试。`,`After this pretend payment, ${10-cost} remain. The coins come back for your next trial.`)}</div><div class="criteria"><span class="${cost<=10?"met":""}">${cost<=10?"✓":"○"} ${t("钱够用","Fits the budget")}</span><span class="${hasFood(state.first)?"met":""}">${hasFood(state.first)?"✓":"○"} ${t("带了吃的","Food packed")}</span></div><div class="thinking-actions">${action(t("想想别的办法 →","Explore another plan →"),"revise")}</div>`;}
    if(state.stage===4) return `<h2>${t("这次，我来安排","My plan this time")}</h2><div class="wallet-strip"><span>${t("重新试：10 枚","Try again: 10 coins")}</span><strong>${total(state.basket)>10?t(`还差 ${total(state.basket)-10}`,`Short ${total(state.basket)-10}`):t(`会剩 ${10-total(state.basket)}`,`${10-total(state.basket)} left`)}</strong></div>${shop(picnic,state.basket)}<div class="criteria"><span class="${total(state.basket)<=10?"met":""}">${total(state.basket)<=10?"✓":"○"} ${t("不超过 10 枚","Within 10 coins")}</span><span class="${hasFood(state.basket)?"met":""}">${hasFood(state.basket)?"✓":"○"} ${t("一份吃的","Some food")}</span></div>${feedback?`<p class="hint-message" role="status">${h(feedback[0].text)}</p>`:""}<div class="thinking-actions">${action(t("这是我的计划 →","This is my plan →"),"commit")}${action(t("给我一点提示","A small hint"),"plan-hint",false,true)}</div>`;
    if(state.stage===5) return `<h2>${t("我这样选，因为……","I chose this because…")}</h2><div class="comparison"><article><h3>${t("第一次","First plan")}</h3><p class="bag-icons">${icons(state.first)}</p><p>${total(state.first)} ${t("枚","coins")}</p></article><article><h3>${t("现在的计划","My plan now")}</h3><p class="bag-icons">${icons(state.final)}</p><p>${total(state.final)} ${t("枚","coins")} · ${t("剩","left")} ${10-total(state.final)}</p></article></div><div class="choice-stack">${Object.entries(reasons).filter(([id])=>id!=="wish"||state.wish!=="none").map(([id,label])=>choice(tr(label),id,"reason",state.reasons.includes(id))).join("")}</div>${feedback?`<p class="hint-message" role="status">${h(feedback[0].text)}</p>`:""}<div class="thinking-actions">${action(t("带着办法，换一题 →","Take my strategy to a new task →"),"explain",!state.reasons.length)}${action(t("再改一下计划","Change my plan"),"revise",false,true)}</div>`;
    if(state.stage===6) return `<h2>${t("画画前的小采购","A little art-shop trip")}</h2><div class="wallet-strip"><span>${t("新的钱袋","A new purse")}</span><strong>8 ${window.mqIcon("coin")}</strong></div><p class="goal-note">${t("任务：铅笔 + 橡皮，两样都要。","Task: a pencil AND an eraser. You need both.")}</p>${shop(supplies,state.transfer)}${state.transferHint?`<p class="hint-message">${t("先找今天要用的两样，再把价签加起来，和 8 比一比。","Find the two things you need, add their prices, then compare with 8.")}</p>`:""}${feedback?`<p class="hint-message" role="status">${h(feedback[0].text)}</p>`:""}${state.transferPassed?ledger(state.transfer,8,supplies):""}<div class="thinking-actions">${action(state.transferPassed?t("收好我的思考卡 →","Save my thinking card →"):t("看看我的安排","Check my plan"),state.transferPassed?"finish":"transfer-check",!state.transfer.length)}${!state.transferPassed?action(t("小芽，提醒我一下","Sunny, a little hint?"),"transfer-hint",false,true):""}</div>`;
    const changed=[...state.first].sort().join()!==[...state.final].sort().join();
    return `<div class="thought-stamp"><span aria-hidden="true">${window.mqIcon("seedling")}</span><div><strong>${t("我的第一张思考卡","My first thinking card")}</strong><p class="helper-copy">${t("记录你的过程，不给你贴标签。","A record of your process, not a label about you.")}</p></div></div><ol class="think-timeline"><li><strong>${t("我先有了一个想法","I started with an idea")}</strong>${h(names(state.first))} · ${total(state.first)} ${t("枚","coins")}</li><li><strong>${t("我猜，然后检查","I predicted, then checked")}</strong>${h(tr(predictions[state.prediction]||predictions.help))} → ${total(state.first)>10?t(`还差 ${total(state.first)-10} 枚`,`Needed ${total(state.first)-10} more`):t(`剩 ${10-total(state.first)} 枚`,`${10-total(state.first)} remained`)}</li><li><strong>${changed?t("我调整了计划","I changed my plan"):t("我检查后保留了计划","I checked and kept my plan")}</strong>${h(names(state.final))} · ${t("还留着","left")} ${10-total(state.final)} ${t("枚","coins")}</li><li><strong>${t("我的理由","My reason")}</strong>${h(state.reasons.map(id=>tr(reasons[id])).join(t("；","; ")))}</li><li><strong>${t("换个情境，我也试了","I tried a new situation")}</strong>${h(names(state.transfer,supplies))} · ${t("花","spent")} ${total(state.transfer,supplies)} / 8</li></ol><div class="thinking-actions">${action(t("再试一种野餐计划","Try another picnic plan"),"restart",false,true)}<a class="primary-button" href="index.html">${t("今天到这里，回地图","Enough for today. Back to map")}</a></div><details><summary>${t("给家长：看见孩子怎么想","For adults: notice the thinking")}</summary><p>${t(`这次完成了 ${state.transferAttempts} 次迁移练习检查；${state.transferHint?"使用过提示":"没有点击迁移提示"}。自己的口头理由不会录音或自动评分。`,`This run had ${state.transferAttempts} transfer checks; ${state.transferHint?"a hint was used":"no transfer hint was requested"}. Spoken reasons are not recorded or automatically assessed.`)}</p><p>${t("可以问：你第一次想带什么？后来为什么保留或改变？换到生活里，你会先看什么？先听解释，不急着替孩子选。","Ask: What did you choose first? Why did you keep or change it? What would you check first in real life? Listen before choosing for the child.")}</p><p>${t("完成不等于已经掌握。建议过几天换个生活情境，再观察孩子是否能自己运用。","Completion does not prove mastery. Try a different everyday situation another day and see what the child can do independently.")}</p><p>${t("教学设计参考计划、检查、回顾的教学策略，以及儿童财商的思维能力基础；这是产品原型，不是经验证的测评工具。","The design draws on planning, monitoring and reviewing, and the thinking foundations of financial capability. This prototype is not a validated assessment.")} <a href="https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation" target="_blank" rel="noopener noreferrer">EEF</a> · <a href="https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/learn/" target="_blank" rel="noopener noreferrer">CFPB</a></p><p>${t("记录仅存本机，不收集姓名、家庭收入、录音或自由聊天。语音由设备提供，部分声线可能联网。预计时长是设计假设，待儿童试玩验证。","Records stay on this device. No names, family income, recordings or open chat are collected. Device voices may use the network. The estimated lesson time is a design assumption to test with children.")}</p></details>`;
  }
  const stages = [L("先说说喜欢的","What I like"),L("我先试一种","My first plan"),L("猜猜会怎样","Make a prediction"),L("看看发生什么","See what happens"),L("比较和调整","Compare and adjust"),L("说说为什么","Explain my reason"),L("换个情境试试","Try a new situation"),L("收好我的发现","My discoveries")];
  function render(focus=false) {
    window.TeachingMedia.dispose();
    document.documentElement.lang=state.language;
    document.title=t("小芽思考站 · 10枚星币的野餐计划","Sunny's Thinking Lab · A 10-Coin Picnic");
    document.getElementById("app-name").textContent=t("小芽思考站","Sunny's Thinking Lab");
    document.getElementById("course-home").setAttribute("aria-label",t("返回课程地图","Back to course map"));
    document.querySelector("#course-home span").textContent=t("课程地图","Course map");
    document.getElementById("course-language").textContent=t("EN","中文");
    document.getElementById("course-language").setAttribute("aria-label",t("Switch to English","切换到中文"));
    document.getElementById("course-pause").textContent=t("休息","Pause");
    root.innerHTML=`<p class="course-kicker">${t("思维样板课 · 10枚星币的野餐计划","Thinking sample · A 10-coin picnic")}</p><div class="thinking-title"><h1 id="thinking-heading" tabindex="-1">${h(tr(stages[state.stage]))}</h1><span>${state.stage+1} / 8</span></div><ol class="thinking-steps" aria-label="${t("课程进度","Lesson progress")}">${stages.map((s,i)=>`<li class="${i<state.stage?"done":""}" ${i===state.stage?'aria-current="step"':""} aria-label="${h(tr(s))}"></li>`).join("")}</ol><div class="thinking-layout"><aside class="thinking-chat"><div class="dialogue-slot"></div></aside><section class="thinking-work">${work()}</section></div>`;
    const turns=conversations(), chatKey=`${state.stage}:${state.language}:${feedback?JSON.stringify(feedback):"intro"}`;
    if(state.chatKey!==chatKey){state.chatIndex=0;state.chatKey=chatKey;}
    window.TeachingMedia.mount(root,{english:state.language==="en",stage:0,text:"",dialogue:turns,dialogueIndex:state.chatIndex,onDialogueChange(index){state.chatIndex=index;save();}});
    root.querySelectorAll("[data-wish]").forEach(b=>b.addEventListener("click",()=>{state.wish=b.dataset.wish;refreshChoice(`[data-wish="${state.wish}"]`);}));
    root.querySelectorAll("[data-item]").forEach(b=>b.addEventListener("click",()=>{
      const id=b.dataset.item, field=state.stage===6?"transfer":"basket";
      state[field]=state[field].includes(id)?state[field].filter(v=>v!==id):[...state[field],id];
      if(state.stage===6)state.transferPassed=false;
      refreshChoice(`[data-item="${id}"]`);
    }));
    root.querySelectorAll("[data-prediction]").forEach(b=>b.addEventListener("click",()=>{state.prediction=b.dataset.prediction;refreshChoice(`[data-prediction="${state.prediction}"]`);}));
    root.querySelectorAll("[data-reason]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.reason;state.reasons=state.reasons.includes(id)?state.reasons.filter(v=>v!==id):[...state.reasons.slice(-1),id];refreshChoice(`[data-reason="${id}"]`);}));
    root.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>act(b.dataset.action)));
    save(); clock();
    if(focus){window.scrollTo({top:0,behavior:"instant"});document.getElementById("thinking-heading").focus({preventScroll:true});}
  }
  function refreshChoice(selector){feedback=null;save();render();root.querySelector(selector)?.focus({preventScroll:true});}
  function go(stage){state.stage=stage;feedback=null;state.chatKey="";save();render(true);}
  function say(zh,en){feedback=[S(zh,en,"gentle")];render();root.querySelector(".dialogue-line")?.scrollIntoView({block:"nearest",behavior:"instant"});}
  function act(id){
    if(id==="start"&&state.wish){go(1);return;}
    if(id==="predict"&&state.basket.length){state.first=[...state.basket];state.prediction=null;go(2);return;}
    if(id==="repack"){go(1);return;}
    if(id==="reveal"&&state.prediction){go(3);return;}
    if(id==="revise"){state.basket=[...(state.final.length?state.final:state.first)];state.reasons=[];state.explained=false;go(4);return;}
    if(id==="plan-hint"){say("看看：面包和苹果都能当食物。你想把哪一样先留在背包？","Bread and an apple can both be food. Which one would you keep first?");return;}
    if(id==="commit"){
      if(total(state.basket)>10){say(`这份计划要 ${total(state.basket)} 枚，比 10 多 ${total(state.basket)-10} 枚。哪样可以换一换？`,`This plan costs ${total(state.basket)}, which is ${total(state.basket)-10} over 10. What could you change?`);return;}
      if(!hasFood(state.basket)){say("钱够用了。不过，野餐的食物还没准备好。面包或苹果都可以。","The money fits, but we haven't packed food yet. Bread or an apple would work.");return;}
      state.final=[...state.basket];state.plans.push([...state.final]);state.plans=state.plans.slice(-6);go(5);window.TeachingMedia.playSuccessSound();return;
    }
    if(id==="explain"&&state.reasons.length){
      if(state.reasons.includes("save")&&total(state.final)===10){say("现在的计划刚好花完 10 枚。想留钱的话，要不要改一下计划？也可以换个更符合的理由。","This plan spends all 10 coins. To keep some money, change the plan or choose a reason that fits.");return;}
      if(state.reasons.includes("wish")&&!state.final.includes(state.wish)){say(`你开始喜欢的是${names([state.wish])}，现在背包里没有它。可以改计划，也可以换个理由。`,`Your first favourite was ${names([state.wish])}, but it's not in this bag. You can change the plan or the reason.`);return;}
      state.explained=true;go(6);return;
    }
    if(id==="transfer-hint"){state.transferHint=true;say("先看明天要做什么：铅笔和橡皮都要。再看看两张价签。","Check tomorrow's task first: both a pencil and eraser. Then look at their prices.");return;}
    if(id==="transfer-check"&&state.transfer.length){
      if(state.transferPassed)return;
      state.transferAttempts++;
      const cost=total(state.transfer,supplies);
      if(cost>8){say(`一共 ${cost} 枚，比 8 多 ${cost-8} 枚。哪样可以等一等？`,`It costs ${cost}, which is ${cost-8} over 8. What could wait?`);return;}
      if(!state.transfer.includes("pencil")||!state.transfer.includes("eraser")){say("还要检查画画用的两样：铅笔和橡皮，都装好了吗？","Check both things needed for drawing: are the pencil and eraser packed?");return;}
      state.transferPassed=true;feedback=[S(`两样都准备好了！花 ${cost} 枚，还剩 ${8-cost} 枚。`,`Both essentials are packed! Spend ${cost}; ${8-cost} remain.`,"happy"),T("换了东西和数字，我也试着用这个办法了。","Different things and numbers, and I tried the same strategy.")];state.chatKey="";render();window.TeachingMedia.playSuccessSound();return;
    }
    if(id==="finish"&&state.transferPassed&&validTransfer()&&validPlan(state.final)&&state.explained){const first=!state.done;state.done=true;go(7);if(first)window.TeachingMedia.playSuccessSound();return;}
    if(id==="restart")openRestart();
  }
  function clock(){document.getElementById("course-time").textContent=`${t("本次","This visit")} ${Math.floor(visitSeconds/60)}:${String(visitSeconds%60).padStart(2,"0")}`;}
  function pause(){
    paused=true;window.TeachingMedia.suspend();
    document.getElementById("pause-heading").textContent=t("休息一下，进度留在这里。","Take a break. Your place is saved.");
    document.getElementById("pause-copy").textContent=t("没有倒计时。准备好了再回来。","No countdown. Come back when you're ready.");
    document.getElementById("resume-course").textContent=t("我准备好了","I'm ready");
    save();document.getElementById("pause-dialog").showModal();
  }
  function openRestart(){window.TeachingMedia.suspend();paused=true;document.getElementById("restart-heading").textContent=t("重新体验这节课？","Try this lesson again?");document.getElementById("restart-copy").textContent=t("只清除这节样板课的记录，不会改变原来的六课进度。","Only this sample's record will reset. The six original lessons stay unchanged.");document.getElementById("cancel-restart").textContent=t("先留着","Keep it");document.getElementById("confirm-restart").textContent=t("重新开始","Start again");document.getElementById("restart-dialog").showModal();}
  document.getElementById("course-language").addEventListener("click",()=>{state.language=state.language==="en"?"zh-CN":"en";feedback=null;render();});
  document.getElementById("course-pause").addEventListener("click",pause);
  document.getElementById("resume-course").addEventListener("click",()=>document.getElementById("pause-dialog").close());
  document.getElementById("cancel-restart").addEventListener("click",()=>document.getElementById("restart-dialog").close());
  document.getElementById("confirm-restart").addEventListener("click",()=>{const lang=state.language;state=initial();state.language=lang;visitSeconds=0;feedback=null;document.getElementById("restart-dialog").close();save();render(true);});
  document.querySelectorAll("dialog").forEach(dialog=>dialog.addEventListener("close",()=>{paused=false;lastActive=Date.now();}));
  for(const event of ["pointerdown","keydown"]) document.addEventListener(event,()=>lastActive=Date.now(),{passive:true});
  setInterval(()=>{if(paused||document.hidden||state.stage===0||state.done||Date.now()-lastActive>60000)return;state.elapsed++;visitSeconds++;clock();if(visitSeconds%10===0)save();},1000);
  window.addEventListener("pagehide",()=>{window.TeachingMedia.suspend();save();});
  document.addEventListener("visibilitychange",()=>{if(document.hidden)save();});
  render();
})();

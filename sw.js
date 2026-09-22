// 缓存版本：字体与字号阶梯会改变整站排版，必须换版本戳，
// 否则老用户会拿到新 CSS 配旧缓存，出现「字体缺失 + 字号换挡」的半成品。
// 同理，按钮按压系统、形状系统、图标系统这类改动全站观感的，也要换戳。
// 20260922-6：三个缺字形 emoji（🪙🧋🫧）换成 SVG 图标 + 新增 icons.js / reward-coin.js。
// 20260922-7：全站 112 处 emoji 换成自带矢量图标（icons.js 从 3 个扩到 59 个）。
//             index.html 与五个 JS 都改了，必须换戳，否则老缓存里 index.html 还是 emoji 版。
// 20260922-8：学习页改成「上图下题」——舞台拆成 .stage-visual / .stage-task，
//             课头压成一行、课程页收窄到 760px、选项改纵向等宽卡片。
//             dialogue.css 与 lessons.js 都改了，老缓存会把新 HTML 配旧 CSS。
// 20260922-9：设计方案 v2 的批 1 + 批 2 —— styles.css 的 :root 换了令牌
//             （--muted 变深、焦点环收敛、新增 --on-* / --focus*），
//             焦点环重写、8 个 h1 收成 1 个、新增 #a11y-announcer 播报区。
//             五份 CSS 里有四份 + index.html + app.js + lessons.js 全改了，
//             这次不换戳的后果比 -8 更明显：焦点环会整片消失。
// 20260922-10：批 3 首页首屏重排 —— 新增「继续学习」条、任务地图提到第二、
//             店铺 hero 压成横向状态条（storefront 等比缩放）、两张样板课卡移到地图之后，
//             并统一了解锁文案。index.html 的 #home-view 结构大改、styles.css 首页一节重写、
//             app.js 新增 renderContinue()，不换戳会拿到旧结构配新 CSS。
// 20260922-12：课程地图顺序调整 —— 「你的第一个模拟生意 · 星光奶茶铺」提到最前，
//             继续学习条与任务地图依次下移。只改 index.html 的 #home-view 块顺序，
//             但 HTML 结构变了、老缓存会把旧顺序配新注释，还是得换戳。
// 20260922-11：启动流与首页范围调整 —— 启动页不再被存档跳过，点「开始学习」落到
//             课程地图（不再直跳 lesson-1），场景默认奶茶店，首页两张样板课卡整体下线；
//             同时修掉「清除本机进度」从来没生效过（pagehide → saveState 把存档写回）。
//             index.html / styles.css / app.js 三份都改了，必须换戳。
// 20260922-13：启动页加了两门礼炮（新文件 confetti.js，零依赖 canvas 彩纸）。
//             新增一个脚本文件又不换戳，老缓存里 index.html 会引一个不存在的
//             confetti.js，启动页直接 404 —— 这类「新文件 + 旧 HTML」必须换戳。
// 20260922-14：星币实体系统上线（新文件 coins.js + teaching-media.js 的 playCoin
//             硬币声），第 1 课改成「亲手数、亲手付」的付款场景，购物篮练习
//             长出星币托盘，新增结课仪式（礼花从启动页挪到仪式）。
//             涉及 index.html / lessons.js / dialogues.js / app.js / 两份 CSS，
//             并且又是一次「新文件 + 旧 HTML」组合，不换戳必 404。
// 20260922-15：视频封面撤掉「AI 生成 · 已人工审核」角标（披露收进「看文字版」
//             折叠区，aiGenerated 数据标记与流程约束不变）；对白角色条改成
//             小芽居左、团团居右，头像与气泡尾巴严格对位。
//             video-lessons.js 与 dialogue.css 都改了，老缓存会新旧混用，必须换戳。
// 注意：lottie 播放器与 coin-star.json 刻意**不进 CORE_FILES** —— 它们是懒加载的
// 164KB + 33KB，预缓存会把首屏成本拉高；首次用到时由 fetch 分支按常规运行时缓存。
const CACHE_NAME = "money-quest-dialogue-20260922-15";
const CORE_FILES = ["./", "./index.html", "./styles.css", "./dialogue.css", "./video.css", "./nunito-latin-vf.woff2", "./icons.js", "./reward-coin.js", "./confetti.js", "./dialogues.js", "./teaching-media.js", "./video-lessons.js", "./coins.js", "./lessons.js", "./app.js", "./icon.svg", "./sunny-expressions.png", "./tuan-buddy.png", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        // 视频走 Range 请求，206 分片无法入缓存，失败就跳过。
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => {
        if (cached) return cached;
        const isDocument = event.request.mode === "navigate" || event.request.destination === "document";
        // 只有页面导航才回退到首页；视频等资源失败就如实失败，避免把 HTML 当成视频喂给孩子。
        return isDocument ? caches.match("./index.html").then((page) => page || Response.error()) : Response.error();
      })),
  );
});

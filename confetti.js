/* 启动页的「出发」礼花（零依赖 canvas 彩纸）
   ────────────────────────────────────────────────────────────────
   左下与右下两门礼炮同时向中间对射，两轮齐射、约两秒自然落尽，
   画布自行销毁，页面上不留任何常驻节点。

   为什么手写，而不是引入 canvas-confetti：项目约定是零第三方运行时依赖，
   全站唯一的例外是 vendor/lottie（只服务「星币到账」那一个高光时刻，取舍已
   写进 docs/ICON-SYSTEM.md）。礼花是纯装饰，不值得再开第二个例外 ——
   这条效果真正需要的只是「一批带重力的矩形纸片」，手写不到 200 行。

   设计一致性：配色不写死在 JS 里，从 :root 读设计令牌，改令牌即改彩纸；
   形状只有矩形与方片（方向 A「硬边纸玩」），没有圆角、没有光泽。
   「翻面」是靠横向压缩模拟自转，不做 3D 透视 —— 和全站硬边纸片是同一套语言。

   降级与失败：prefers-reduced-motion 命中时直接返回（连画布都不创建、不启
   rAF）；任何异常一律静默吞掉 —— 礼花挂了绝不能挡住「开始学习」这个唯一出口。
   无障碍：画布 aria-hidden + pointer-events:none，不进 tab 序、不吃点击；
   纯装饰，不往 #a11y-announcer 写任何东西，读屏用户听到的仍是页面本身。

   用法：window.mqConfetti.cannons()  → 放一次，返回 boolean；
         false 表示这次没放（reduced-motion / 环境不支持），不是错误。
         API 刻意做成通用的，日后想用在别的高光时刻直接调即可。
   ──────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  /* 令牌名与兜底值一一对应。兜底只在 CSS 尚未生效时才会用到
     （正常情况 getComputedStyle 一定能读到值）。 */
  var TOKENS = ["--lime", "--coral", "--blue", "--purple", "--yellow", "--white", "--ink"];
  var FALLBACK = ["#d9fb8f", "#ff8265", "#9edce9", "#cbbcf8", "#ffd96c", "#ffffff", "#173f37"];

  var GRAVITY = 0.38; // px / 帧²（以 60fps 归一）
  var DRAG = 0.988;
  var SPREAD = 23; // 每门炮的角度抖动（±度）
  var BASE_SPEED = 19; // 初速 px / 帧，再乘视口缩放
  var MAX_DPR = 2; // 高分屏封顶，避免 4K 上白烧填充率
  var SPIN = 2.1; // 翻面速度相对自转的倍数

  /* 两轮齐射。第一轮给「炸开」，第二轮补密度，间隔略小于一轮人眼反应。 */
  var VOLLEYS = [
    { at: 0, count: 88 },
    { at: 190, count: 60 }
  ];

  /* 两门炮都略在屏幕外，只让弹道从画面里穿出来。y 取 .84 落在启动页按钮一线。 */
  var CANNONS = [
    { x: -0.02, y: 0.84, angle: 58 }, // 左下，朝右上
    { x: 1.02, y: 0.84, angle: 122 } // 右下，朝左上
  ];

  var canvas = null;
  var ctx = null;
  var particles = [];
  var raf = 0;
  var timers = [];
  var lastFrame = 0;
  var pending = 0;
  var dpr = 1;
  var vw = 0;
  var vh = 0;

  function reducedMotion() {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function readColors() {
    var styles = window.getComputedStyle(document.documentElement);
    return TOKENS.map(function (name, index) {
      var value = (styles.getPropertyValue(name) || "").trim();
      return value || FALLBACK[index];
    });
  }

  function fit() {
    if (!canvas || !ctx) return;
    vw = window.innerWidth || 1;
    vh = window.innerHeight || 1;
    dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function viewportScale() {
    return Math.max(0.7, Math.min(1.5, Math.sqrt((vw * vh) / (1280 * 800))));
  }

  function makeParticle(cannon, colors, scale) {
    var angle = ((cannon.angle + (Math.random() * 2 - 1) * SPREAD) * Math.PI) / 180;
    var speed = BASE_SPEED * scale * (0.72 + Math.random() * 0.56);
    var roll = Math.random();
    var w;
    var h;
    if (roll < 0.44) {
      w = (12 + Math.random() * 8) * scale; // 长条纸片
      h = (6 + Math.random() * 5) * scale;
    } else if (roll < 0.78) {
      w = (8 + Math.random() * 7) * scale; // 方片
      h = w;
    } else {
      w = (5 + Math.random() * 4) * scale; // 细长飘带
      h = (18 + Math.random() * 11) * scale;
    }
    return {
      x: cannon.x * vw,
      y: cannon.y * vh,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      w: w,
      h: h,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.36,
      color: colors[(Math.random() * colors.length) | 0],
      age: 0,
      ttl: 88 + Math.random() * 52
    };
  }

  function spawn(count, colors) {
    var scale = viewportScale();
    var perCannon = Math.max(1, Math.round(count / CANNONS.length));
    for (var c = 0; c < CANNONS.length; c++) {
      for (var i = 0; i < perCannon; i++) particles.push(makeParticle(CANNONS[c], colors, scale));
    }
  }

  function frame(now) {
    if (!ctx) return;
    raf = window.requestAnimationFrame(frame);

    var dt = lastFrame ? (now - lastFrame) / 16.6667 : 1;
    lastFrame = now;
    if (dt > 3) dt = 3; // 切走标签页再回来时钳住，避免纸片瞬移出屏

    ctx.clearRect(0, 0, vw, vh);
    var dragStep = Math.pow(DRAG, dt);
    var alive = [];

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.age += dt;
      if (p.age >= p.ttl) continue;

      p.vx *= dragStep;
      p.vy = p.vy * dragStep + GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.y > vh + 90) continue; // 已落出屏幕，不必再画

      var alpha = p.age > p.ttl * 0.62 ? 1 - (p.age - p.ttl * 0.62) / (p.ttl * 0.38) : 1;
      var halfW = (p.w * Math.abs(Math.cos(p.rot * SPIN))) / 2;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha < 0 ? 0 : alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-halfW, -p.h / 2, halfW * 2, p.h);
      ctx.restore();

      alive.push(p);
    }
    particles = alive;

    if (!particles.length && pending === 0) stop();
  }

  function stop() {
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
    for (var i = 0; i < timers.length; i++) window.clearTimeout(timers[i]);
    timers = [];
    particles = [];
    pending = 0;
    window.removeEventListener("resize", fit);
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null;
    ctx = null;
  }

  function cannons() {
    try {
      if (reducedMotion()) return false;
      if (!document.body) return false;

      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "mq-confetti";
        canvas.setAttribute("aria-hidden", "true");
        canvas.style.cssText =
          "position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:50;";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        if (!ctx) {
          stop();
          return false;
        }
      }

      /* 上一次还没放完就又被叫了一次：把旧的齐射清掉，避免两组弹道叠在一起。 */
      for (var i = 0; i < timers.length; i++) window.clearTimeout(timers[i]);
      timers = [];
      particles = [];
      pending = VOLLEYS.length;
      lastFrame = 0;

      fit();
      window.addEventListener("resize", fit);
      var colors = readColors();

      VOLLEYS.forEach(function (volley) {
        timers.push(
          window.setTimeout(function () {
            pending -= 1;
            if (!ctx) return;
            spawn(volley.count, colors);
            if (!raf) raf = window.requestAnimationFrame(frame);
          }, volley.at)
        );
      });

      return true;
    } catch (err) {
      stop();
      return false;
    }
  }

  window.mqConfetti = { cannons: cannons };
})();

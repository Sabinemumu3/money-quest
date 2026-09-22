/* 星币实体系统 · 让钱变成孩子可以上手数的东西
   ────────────────────────────────────────────────────────────────
   为什么要有这个模块：
     财商游戏的主角是钱。之前它只是一行数字和几个圆点 —— 「数钱」「付钱」
     从来不在孩子的手上发生，这是「像做题」而不像「做游戏」的最大单点原因。
   本模块只做一件事：在两个「区」之间搬运星币，把搬运做出手感。
     · 手动模式（数钱 / 凑钱付款）：点一枚动一枚，孩子自己凑出数量；
     · 自动模式（购物篮）：外部给出目标分布，币按成本自己飞过去。
   呈现层约定与 confetti.js / reward-coin.js 同构：
     · 零依赖、零资产：币是 DOM 按钮；硬币声借 TeachingMedia.playCoin()，
       静音由它的偏好统一管，这里不重复实现；
     · reduced-motion / less-motion 下所有飞行动画退化为直接落位；
     · 状态不在本地存储：分布完全由调用方（lessons.js 的进度对象）给出，
       重挂载时原样恢复，本模块不保存任何东西。
   ──────────────────────────────────────────────────────────────── */
(() => {
  "use strict";

  const motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;

  // 与 reward-coin.js 的 prefersStill() 同一套判断：系统 reduce 或站内「减少动画」。
  function still(node) {
    if (motionQuery && motionQuery.matches) return true;
    if (node && node.closest && node.closest(".less-motion")) return true;
    return document.documentElement.classList.contains("less-motion") ||
      document.body.classList.contains("less-motion");
  }
  function clink() {
    try { window.TeachingMedia && window.TeachingMedia.playCoin(); } catch { /* 无声可玩 */ }
  }
  // 带一点回弹的缓动：落位要「啪嗒」一下，不要 ease-out 的滑行感。
  const DROP = "cubic-bezier(.2,.7,.3,1.25)";

  /* 把一枚币移动到目标区：先量旧位 → 挂到新区 → 量新位 → 从旧位飞过去（FLIP）。
     返回动画时长（不动时为 0），调用方用它决定什么时候播声、什么时候算落地。 */
  function flyTo(el, field, reduce) {
    const before = reduce ? null : el.getBoundingClientRect();
    field.appendChild(el);
    if (!before) return 0;
    const after = el.getBoundingClientRect();
    const dx = before.left + before.width / 2 - (after.left + after.width / 2);
    const dy = before.top + before.height / 2 - (after.top + after.height / 2);
    if (!dx && !dy) return 0;
    if (!el.animate) return 0;
    el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }],
      { duration: 330, easing: DROP },
    );
    return 330;
  }

  /* 挂载一枚双区星币场景。
     config = {
       zones:  [口袋名, 目标区名]        （已按当前语言翻译好的字符串）
       counts: [区0枚数, 区1枚数]        （初始分布，重挂载恢复用）
       manual: true → 币是按钮，点一下在两区之间互搬；
                 false → 币是装饰 span（aria-hidden），只能由 setCounts 驱动。
       slots:  [null, n] → 目标区画 n 个虚线空位（「装不满」看得见）。
       onMove: manual 模式下每次搬动后回调 (区1枚数)。
     }
     返回句柄：{ el, moved(), setCounts(), paySuccess(), shake(), lock() } */
  function mount(host, config) {
    const manual = config.manual === true;
    const total = config.counts[0] + config.counts[1];
    const zoneOf = new Array(total);
    const coinEls = new Array(total);
    const fields = [];
    const counters = [];
    let busy = false;

    const scene = document.createElement("section");
    scene.className = "mq-coin-scene";
    scene.setAttribute("aria-label", config.zones.join("，"));
    for (let z = 0; z < 2; z += 1) {
      const zone = document.createElement("div");
      zone.className = "mq-coin-zone";
      zone.dataset.zone = String(z);
      const name = document.createElement("p");
      name.className = "mq-coin-zone-name";
      name.innerHTML = `<span>${config.zones[z]}</span>`;
      const count = document.createElement("span");
      count.className = "mq-coin-zone-count";
      if (z === 1) count.setAttribute("role", "status"); // 每放一枚播报一次累计：数数的孩子听得到自己数到几了
      name.appendChild(count);
      const field = document.createElement("div");
      field.className = "mq-coin-field";
      zone.append(name, field);
      scene.appendChild(zone);
      fields.push(field);
      counters.push(count);
    }
    host.replaceChildren(scene);

    for (let i = 0; i < total; i += 1) {
      const el = document.createElement(manual ? "button" : "span");
      if (manual) el.type = "button";
      el.className = "mq-coin";
      el.textContent = "1"; // 面额 1，与教学演示的 .scene-token 同一语言
      el.dataset.coin = String(i);
      if (manual) {
        el.setAttribute("aria-label", `第 ${i + 1} 枚星币`);
        el.addEventListener("click", () => tap(i));
      } else {
        el.setAttribute("aria-hidden", "true");
      }
      coinEls[i] = el;
    }
    // 初始分布直接落位（不飞）：重挂载恢复的分布对币来说是「本来就在那」。
    let placed = 0;
    for (let z = 0; z < 2; z += 1) {
      for (let n = 0; n < config.counts[z]; n += 1) {
        zoneOf[placed] = z;
        fields[z].appendChild(coinEls[placed]);
        placed += 1;
      }
    }
    if (config.slots && config.slots[1]) paintSlots(config.slots[1] - config.counts[1]);

    // 入场：一枚枚蹦出来。 Reduce 下省略，直接出现。
    if (!still(scene) && coinEls[0] && coinEls[0].animate) {
      coinEls.forEach((el, i) => {
        el.animate(
          [{ opacity: 0, transform: "scale(.4)" }, { opacity: 1, transform: "scale(1)" }],
          { duration: 240, delay: i * 36, easing: DROP, fill: "backwards" },
        );
      });
    }
    updateCounts();

    function tap(i) {
      if (busy) return;
      const to = zoneOf[i] === 0 ? 1 : 0; // 两区互搬
      flyTo(coinEls[i], fields[to], still(scene));
      zoneOf[i] = to;
      clink();
      updateCounts();
      if (config.onMove) config.onMove(moved());
    }

    function moved() {
      let n = 0;
      zoneOf.forEach((z) => { if (z === 1) n += 1; });
      return n;
    }

    function updateCounts() {
      for (let z = 0; z < 2; z += 1) {
        const n = zoneOf.filter((zone) => zone === z).length;
        counters[z].textContent = `${n} 枚`;
      }
    }

    function paintSlots(ghosts) {
      fields[1].querySelectorAll(".mq-coin--ghost").forEach((n) => n.remove());
      for (let g = 0; g < Math.max(0, ghosts); g += 1) {
        const ghost = document.createElement("span");
        ghost.className = "mq-coin mq-coin--ghost";
        ghost.setAttribute("aria-hidden", "true");
        fields[1].appendChild(ghost);
      }
    }

    /* 自动模式：给出新的分布，把差额一枚枚飞过去（购物篮加减货时用）。 */
    function setCounts(target) {
      if (busy) return;
      const inOne = zoneOf.map((z, i) => ({ z, i })).filter((c) => c.z === 1);
      let add = target[1] - inOne.length;
      if (add > 0) {
        const source = zoneOf.map((z, i) => ({ z, i })).filter((c) => c.z === 0).map((c) => c.i);
        source.forEach((i, k) => {
          if (k >= add) return;
          window.setTimeout(() => {
            flyTo(coinEls[i], fields[1], still(scene));
            zoneOf[i] = 1;
            clink();
            updateCounts();
          }, k * 60);
        });
      } else if (add < 0) {
        const back = inOne.slice(add).map((c) => c.i); // 从队尾退回
        back.forEach((i, k) => {
          window.setTimeout(() => {
            flyTo(coinEls[i], fields[0], still(scene));
            zoneOf[i] = 0;
            updateCounts();
          }, k * 50);
        });
        add = 0;
      }
    }

    /* 付款成功：目标区的币逐枚飞走消失（它们已经是店家的了）。
       返回 Promise —— 调用方在落地后再更新进度、重渲染。 */
    function paySuccess() {
      busy = true;
      const flying = zoneOf.map((z, i) => ({ z, i })).filter((c) => c.z === 1);
      const reduce = still(scene);
      flying.forEach(({ i }, k) => {
        const el = coinEls[i];
        const done = () => { el.style.visibility = "hidden"; };
        if (reduce || !el.animate) { done(); return; }
        window.setTimeout(() => {
          clink();
          el.animate(
            [{ opacity: 1, transform: "translate(0,0) rotate(0)" },
             { opacity: 0, transform: "translate(-14px,-46px) rotate(-24deg)" }],
            { duration: 380, easing: "ease-in", fill: "forwards" },
          ).onfinish = done;
        }, k * 70);
      });
      fields[1].querySelectorAll(".mq-coin--ghost").forEach((n) => n.remove());
      const wait = reduce ? 0 : 380 + (flying.length - 1) * 70;
      return new Promise((resolve) => { window.setTimeout(resolve, wait + 120); });
    }

    /* 数量不对：整区左右一摇。纯视觉，无音效（错不起声，符合产品红线）。 */
    function shake() {
      const zone = fields[1].closest(".mq-coin-zone");
      zone.classList.remove("is-shake");
      if (still(scene)) return;
      // 强制重排让同名动画能连续触发两次
      void zone.offsetWidth;
      zone.classList.add("is-shake");
      zone.addEventListener("animationend", () => zone.classList.remove("is-shake"), { once: true });
    }

    function lock(v) { busy = Boolean(v); }

    return { el: scene, moved, setCounts, paySuccess, shake, lock, repaintSlots: paintSlots };
  }

  window.MoneyCoins = { mount };
})();

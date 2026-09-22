/* 奖励时刻的星币动画（Lottie）
   ────────────────────────────────────────────────────────────────
   只在「任务完成 → 星币到账」这一刻播一次，播放器与动画数据都不进首屏：
     vendor/lottie/lottie_light.min.js   164 KB（lottie-web 5.12.2 light，自托管）
     assets/lottie/coin-star.json         33 KB（原片删掉印度卢比文字层 + 换成矢量 ★
                                                 + 调色板收敛到 --yellow / --ink）
   为什么单独做成一个模块：与 teaching-media.js、video-lessons.js 同构 ——
   把「可分离的呈现能力」从 app.js 的业务逻辑里摘出来，摘掉它 app 照常跑。
   失败一律静默：动画挂了绝不能挡住「领取奖励」这个唯一出口。
   ────────────────────────────────────────────────────────────────
   已知取舍（有意为之，写进 docs/ICON-SYSTEM.md）：
   这枚币是全站唯一的写实 3D 光泽物件，其余图标都是方向 A 的硬边纸玩。
   把它压在 31 处行内位置等于 31 个并行动画循环，也失去「到账那一刻」的分量，
   所以只留这一个高光时刻。 */
(function () {
  "use strict";

  var PLAYER = "vendor/lottie/lottie_light.min.js";
  var DATA = "assets/lottie/coin-star.json";
  var REST_FRAME = 60; // 静止时停在光扫刚过的正面

  var scriptPromise = null;
  var dataPromise = null;
  var anim = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var el = document.createElement("script");
      el.src = src;
      el.async = true;
      el.onload = function () { resolve(); };
      el.onerror = function () { reject(new Error("script failed: " + src)); };
      document.head.appendChild(el);
    });
  }

  function ensurePlayer() {
    if (window.lottie) return Promise.resolve();
    if (!scriptPromise) {
      scriptPromise = loadScript(PLAYER).then(function () {
        if (!window.lottie) throw new Error("lottie global missing");
      }).catch(function (err) {
        scriptPromise = null; // 允许下次重试
        throw err;
      });
    }
    return scriptPromise;
  }

  function ensureData() {
    if (!dataPromise) {
      dataPromise = fetch(DATA).then(function (res) {
        if (!res.ok) throw new Error("data " + res.status);
        return res.json();
      }).catch(function (err) {
        dataPromise = null;
        throw err;
      });
    }
    return dataPromise;
  }

  function prefersStill() {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    } catch (error) { /* 老浏览器没有 matchMedia，按可动处理 */ }
    return !!(document.documentElement.classList.contains("less-motion") || document.body.classList.contains("less-motion"));
  }

  function stop() {
    if (anim) {
      try { anim.destroy(); } catch (error) { /* 已经销毁过 */ }
      anim = null;
    }
  }

  /* 在 container 里播一次。container 为空或加载失败时不抛错、不占位。 */
  function play(container) {
    if (!container) return;
    stop();
    if (container.__mqToken === undefined) container.__mqToken = 0;
    var token = ++container.__mqToken;
    container.hidden = true;
    container.innerHTML = "";

    Promise.all([ensurePlayer(), ensureData()]).then(function (pair) {
      if (token !== container.__mqToken) return; // 期间又被触发过一次，让新的那次接管
      var data = pair[1];
      var still = prefersStill();
      var instance = window.lottie.loadAnimation({
        container: container,
        renderer: "svg",
        loop: false,
        autoplay: !still,
        animationData: data,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      instance.addEventListener("DOMLoaded", function () {
        if (token !== container.__mqToken) return;
        if (still) instance.goToAndStop(REST_FRAME, true);
        container.hidden = false;
      });
      anim = instance;
    }).catch(function () {
      // 播放器或数据没拿到：安静地把位置收掉，reward-popover 的其他内容照常
      if (token === container.__mqToken) {
        container.hidden = true;
        container.innerHTML = "";
      }
    });
  }

  window.MoneyRewardCoin = { play: play, stop: stop };
})();

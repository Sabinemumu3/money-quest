# 图表与图标系统 · 设计与实施记录

> 面向对象：前端 / 设计 / 运营
> 状态：图标系统已落地；图表规范为**建议稿**，其中一条（涨跌配色）已顺手修复
> 相关文件：`icons.js`、`styles.css`「图标系统」一节、`reward-coin.js`、`assets/lottie/coin-star.json`、`vendor/lottie/lottie_light.min.js`

---

## 0. 一页结论

报的「icon 丢失」**不是文件缺失，是系统 emoji 字体太老**。仓库里所有 `<img>`、CSS `url()`、JS 资源路径全部零 404 —— 缺的是**字体里的字形**，不是磁盘上的文件。

- 本机 Windows 10 Build 19045，但 `C:\Windows\Fonts\seguiemj.ttf` 的文件日期是 **2019-12-07**，字形只覆盖到 **Emoji 12.0**
- 项目里承担教学含义的三个图标都晚于这个版本，在这台机器（以及任何没更新 emoji 字体的设备）上渲染成空白方块：

| 码位 | 字符 | emoji 版本 | 全站处数 |
|---|---|---|---|
| U+1FA99 | 🪙 星币 | 13.0（2020） | **26** |
| U+1F9CB | 🧋 奶茶 | 13.0（2020） | **4** |
| U+1FAE7 | 🫧 泡泡 | 14.0（2021） | **1** |
| | | **合计** | **31** |

**已全部替换为内联 SVG**，并把星币的 Lottie 接到「奖励到账」那一刻。共 31 处：`index.html` 10 处（静态，`data-icon` 自动填充）+ JS 模板里 21 处（`window.mqIcon()`）。

---

## 1. 根因证据链

排查顺序与结论（**下次遇到同类问题照这个顺序走，别先怀疑缺文件**）：

### ① 先证明不是文件缺失

扫描全部资源引用：HTML 的 `<img src>`、CSS 的 `url()`、JS 里以引号包裹的 `.png/.svg/.json/.mp4/.vtt/.woff2` 路径 —— **零 404**。

### ② 再证明是字形缺失

取本机字体版本：

```
OS         : Windows 10  Build 19045
seguiemj.ttf: 修改时间 2019-12-07
```

Windows 10 的 emoji 字形随**功能更新**升级而不是随 build 号 —— 19045 的 build 号很新，字体文件却停在 2019，只到 Emoji 12.0。而项目里**承担教学含义**的图标恰好都是更晚的版本。两者叠加就成了「打开页面看到空白」。

### ③ 扫描全仓 emoji，按版本筛出风险码位

把 Emoji 11.0 以后新增的码位做成白名单去比对全仓 emoji，得到上面那 3 种 31 处。**注意别把 Emoji 11.0（2018）也算进去**：👛 🧺 📦 🐷 ☂️ 🧰 这些是 11.0 或更早，2019 的字体画得出来（曾经误判过 🧰，是粗筛正则的假阳性）。

### ④ 为什么不能「就地修字体」

- 我们无法要求用户升级 Windows；家庭用户的设备只会比开发机更旧
- 就算在 `--font-ui` 里塞 emoji 字体，等于自托管一个几 MB 的彩色字体 —— 与「零第三方运行时依赖 + 首屏成本」冲突
- **根本问题不是字体，是把教学含义压在 emoji 上**。emoji 的字形由操作系统决定，任何平台差异都会重现同一个 bug

---

## 2. 31 处替换清单

| 文件 | 行 | 原字符 | 换成 | 上下文 |
|---|---|---|---|---|
| index.html | 74 | 🧋 | `data-icon="tea"` | `.avatar` 玩家头像 |
| index.html | 105 | 🧋 | `data-icon="tea"` | `#store-emoji` 店铺窗 |
| index.html | 117 | 🪙 | `data-icon="coin"` | `.node-icon` 关卡图标 |
| index.html | 117 | 🪙 | `data-icon="coin"` | `.node-reward`「+20 星币」 |
| index.html | 168 | 🧋 | `data-icon="tea"` | `.career-emoji` 奶茶店经营 |
| index.html | 194 | 🪙 | `data-icon="coin"` | `.mission-title.coral` 课头 |
| index.html | 195 | 🪙 | `data-icon="coin"` | `.profit-card` 利润卡 |
| index.html | 206 | 🪙 | `data-icon="coin"` | `.supply-budget`「35 星币」 |
| index.html | 226 | 🪙 | `data-icon="coin"` | `#market-cash` 实验币 |
| index.html | 226 | 🪙 | `data-icon="coin"` | `#portfolio-value` 组合价值 |
| app.js | 11 | 🧋 | `mqIcon("tea")` | 场景数据的 `icon` 字段 |
| app.js | 73 | 🫧 | `mqIcon("bubble")` | 开店必需品「清洁用品」 |
| app.js | 512 | 🪙 | `mqIcon("coin")` | 必需品卡片价格 |
| app.js | 641 | 🪙 | `mqIcon("coin")` | 实验币余额 |
| app.js | 642 | 🪙 | `mqIcon("coin")` | 组合价值 |
| app.js | 652 | 🪙 | `mqIcon("coin")` | 虚构公司每股价格 |
| lessons.js | 40 | 🪙 | `mqIcon("coin")` | 第 3 课图标 |
| lessons.js | 167 | 🪙 | `mqIcon("coin")` | 第 2 课「一共有」 |
| lessons.js | 168 | 🪙 | `mqIcon("coin")` | 第 2 课商品单价（循环内） |
| lessons.js | 170 | 🪙 ×3 | `mqIcon("coin")` | 第 4 课「开门前 / 进货 / 卖出」 |
| lessons.js | 173 | 🪙 ×2 | `mqIcon("coin")` | 第 4 课账本与利润 |
| lessons.js | 176 | 🪙 ×3 | `mqIcon("coin")` | 第 5 课愿望罐 |
| lessons.js | 210 | 🪙 | `mqIcon("coin")` | 第 5 课滑杆实时值 |
| thinking-course.js | 83 | 🪙 | `mqIcon("coin")` | 思考站「今天可以用 10」 |
| thinking-course.js | 84 | 🪙 | `mqIcon("coin")` | 预测选项「刚好花完」 |
| thinking-course.js | 88 | 🪙 | `mqIcon("coin")` | 思考站「新的钱袋 8」 |

> `money-lab.html` / `thinking.html` / `dialogues.js` / `teaching-media.js` / 三份样板课 CSS **一处都没有** —— 这次改动没碰它们。

---

## 3. 图标系统规格

### 3.1 三个图标

| 名称 | 用途 | 构成 |
|---|---|---|
| `coin` | 星币（货币单位） | 金币圆 + 五角星。星纹用 ★ 而不是 ¥ / $ —— 呼应「星币」命名，且不牵涉任何真实货币（产品立场：虚拟货币只用于教育） |
| `tea` | 奶茶店场景 | 杯身（上宽下窄 2:1）+ 茶汤 + 三颗珍珠 + 杯盖 + 吸管 |
| `bubble` | 清洁用品 | 一大一小两颗泡泡（间隙卡在 1 个单位：贴太近描边连成一团，拉太远小圆变成飘点） |

### 3.2 三条硬规则

1. **尺寸一律 `1em`** —— 跟随所在元素的字号，不与字号阶梯争抢档位。容器是什么字号，图标就是多大：`.node-icon` 38px、`.avatar` 28px、行内正文 18px、`.node-reward` 14px 全部自动适配。
2. **颜色只用 `:root` 令牌，零新增色值** —— 星币 = `var(--yellow)` 面 + `var(--ink)` 描边/星纹；奶茶 = `var(--white)` 杯身 + `var(--yellow)` 茶汤 + `var(--ink)` 细节；泡泡 = `var(--blue)` + `var(--ink)` 描边。
3. **星币刻意不继承 `currentColor`** —— 同一枚金币要在深色钱包条、浅色卡片、珊瑚色课头三种底色上都读成「一枚金币」。交给上下文变色，在深底上会糊成一团白光。

### 3.3 为什么是内联 `<svg>`，不是背景图 / mask

- **背景图**：在文本流里没法跟随字号，`100 <bg>` 这种行内用法会错位
- **`mask-image`**：一旦不被支持会**静默不显示** —— 等于把同一个 bug 换个原因再犯一次。这次的教训就是「图标消失太难被发现」，绝不能选一个会静默失败的实现
- **内联 `<svg>`**：任何环境都画得出来，且能吃到 CSS 令牌

### 3.4 两种用法

**① 静态 HTML** —— 给容器加 `data-icon`，`icons.js` 在加载时自动填充：

```html
<span class="node-icon" data-icon="coin"></span>
<strong>35<span data-icon="coin"></span></strong>
```

**② JS 拼字符串** —— 直接输出标记（`innerHTML` 上下文）：

```js
button.innerHTML = `<strong>${item.cost} ${window.mqIcon("coin")}</strong>`;
```

> ⚠️ 别在会重新渲染的 `innerHTML` 里写 `data-icon` —— 填充只在页面加载时发生一次。JS 侧一律用 `window.mqIcon()`。
>
> 另外改了三处 `textContent` → `innerHTML`（`#player-avatar`、`#store-emoji`、`#market-cash`、`#portfolio-value`、`.jar-grid strong`）：`textContent` 会把 SVG 标记当纯文本显示出来。

### 3.5 无障碍

图标全部 `aria-hidden="true"`。理由：它们旁边的文字已经说明了含义 —— `35 [金币]` 该读成「35 星币」，不该被读成「35」再补一句装饰。**代价**：屏幕阅读器读不到「金币」这个单位词。如果后续要做无障碍强化，正确做法是在数字后补一个 `.sr-only` 的「星币」文本，而不是给 26 个图标各加一个 `aria-label`。

### 3.6 体积

| 文件 | 体积 | 说明 |
|---|---|---|
| `icons.js` | 4.1 KB（83 行） | 三个图标的全部定义 + 填充逻辑 |
| `styles.css` 新增 | 约 30 行 | `.mq-icon` 几何与配色 |

首屏零额外请求：图标是 JS 内联输出的标记，不下载任何图片文件。

---

## 4. 星币 Lottie

### 4.1 原片有什么问题

拿到的 `coin.json` 有三个必须先处理的问题：

**① 币面印着印度卢比 ₹**

`chars` 里存的字形是 `â¹` —— 一个 8–12 岁中国孩子的财商游戏，金币上印着印度卢比，且我们明确定过「不连真实货币」。必须换掉。

（顺带说明：`â¹` 是 ₹(U+20B9) 的 JSON 编码乱码残留，不是设计意图。）

**② 那层文字在浏览器里根本不渲染**

文字层（`ty: 5`）依赖一个名叫 `Konnect` 的字体，系统里不存在；而且 `lottie_light` 播放器不带文字渲染能力。

实测对照：**删掉文字层前后，渲染出的 SVG 长度完全相同（18516 字节）** —— 这层对视觉的贡献是 0。所以处理方式是**直接删层**，不是去修它。

**③ 风格与方向 A 冲突**

原片是 `ddd: 1` 的写实 3D 光泽金币，靠 `Light` / `LightMask` 图层做高光横扫；配色是 `#ffd500 / #ffe200 / #ffbc00 / #ff9f00` 一套独立金系 + `#241527` 深紫描边 + `#a9a9a9` 灰描边。而刚验收的方向 A「硬边纸玩」是**无模糊、2px 墨色描边、纯色填充**。

### 4.2 做了什么

产出 `assets/lottie/coin-star.json`（33.7 KB）：

| 动作 | 细节 |
|---|---|
| **删文字层** | 移除 `ty: 5` 那层，同时清掉 `fonts` / `chars` 整块无用声明 |
| **加矢量五角星** | 币面图层 `ind=13` 的局部坐标系里，币心 `(3, -7)`、外圈半径 100、内环半径 72.5。五角星外径 **60**（落内环以内，留 12.5 边距）、内径 23，作为 `parent: 13` 的子层 —— 跟着币一起翻面、做挤压 |
| **调色板收敛** | 6 个实色映射到品牌令牌：`#ffd500 → #ffd96c`(`--yellow`)、`#ffe200 / #ffbc00 / #ff9f00` → `--yellow` 的三档明度、`#a9a9a9 / #241527 → #173f37`(`--ink`)。`#ffffff` 保留（高光是它，立体感靠它，不动）。共改写 16 处 |
| **星纹颜色** | `#173f37`（品牌墨色），与行内 SVG 星币一致 |

改造后逐帧渲染核对：翻面、光扫、闪点都在，星形在每个角度都跟着币走（侧视帧被压扁、光扫帧变亮）。

### 4.3 为什么只在「奖励到账」用一次

原方案考虑过把 Lottie 直接放进 31 处行内位置。**不可行，也不合适**：

- 26 处是**行内文字**（`100 🪙`、`35 🪙`）。行内不断旋转既不合语法，也会变成 26 个并行动画循环
- 164 KB 播放器 + 34 KB 数据进首屏，与「首屏成本」和「零第三方运行时依赖」两条约束都冲突

所以拆成两层，这也是最终方案：

| 场景 | 用什么 | 加载时机 |
|---|---|---|
| 31 处行内图标 | 硬边 SVG（`icons.js`） | 首屏，内联，零请求 |
| 奖励到账那一刻（`#reward-popover`） | Lottie 3D 金币 | **按需**：`reward-coin.js` 在 `showReward()` 里才插 `<script>` + `fetch` 动画数据 |

**已知取舍（有意为之）**：这枚币是全站唯一的写实 3D 物件，其余图标都是硬边纸玩，风格不完全统一。这是拿「到账那一刻的分量」换的 —— 压成 26 个行内小图标，这个瞬间就没了。

**失败是静默的**：播放器或数据拿不到时，容器保持 `hidden`，奖励文案与「领取奖励并继续」按钮照常 —— 动画绝不能挡住弹出层里唯一的出口。

**`prefers-reduced-motion` / `.less-motion`**：命中时不播动画，直接停在第 60 帧（光扫刚过的正面）。

### 4.4 一个 CSS 坑（改这段前必读）

lottie 生成的 `<svg>` 画布是 **480×480**，而金币本体只占画布中心的一个 200×200 圆 —— **直径只有画布的 41.7%**。不管的话，120px 的容器里只有 50px 一枚小币；要让它长到 100px 就得留一个 240px 的空白方块，矮屏上会把奖励文案顶出可视区。

解法：把 svg 撑到 2 倍、容器 `overflow: hidden` 裁到金币本身，容器尺寸 = 金币尺寸。

```css
.reward-coin { position: relative; width: 120px; height: 120px; overflow: hidden; }
.reward-coin svg { position: absolute; left: -60px; top: -60px; width: 240px !important; height: 240px !important; }
```

三个必须记住的点：

1. **`!important` 是必需的** —— svg 的宽高由 lottie 写在**行内样式**里，只有 `!important` 的样式表声明盖得住
2. **居中位移必须用 `left/top` 负偏移，不能用 `transform`** —— lottie 同时在行内样式里写了 `transform: translate3d(0,0,0)`，用 `transform` 居中会被它盖掉，金币会整个跑出裁切框（这个坑踩过：表现出来就是「容器是空的」）
3. **2 倍是上限** —— 挤压帧金币会横向平移 20/480，放大超过 2 倍就会被裁到边缘

---

## 5. 图表规范（建议稿）

### 5.1 现状盘点

| 图表 | 实现 | 位置 | 状态 |
|---|---|---|---|
| 升级进度条 | 手写 div（`.xp-track` 8px + `#xp-fill`） | 侧栏 | 可用 |
| 采购预算条 | 手写 div（10px + `#supply-fill`，超支转 `--coral`） | 第 2 课 | 可用 |
| 愿望罐 | **原生 `<progress>`**（`accent-color: var(--ink)`） | 第 5 课 | 可用，语义最完整 |
| 涨跌 | 文本色（`.is-up` / `.is-down`） | 市场实验室 | **已修**，见 5.3 |
| 计数徽章 | `.player-stats` 胶囊 + 数字 | 顶栏 | 可用 |

**没有引入任何图表库** —— 与「零第三方运行时依赖」一致，且项目只需要这 5 种形态，不需要库。

### 5.2 建议固化的规则

1. **不用饼图 / 折线图 / 环形图**。8–12 岁读不出面积比例与斜率；而且任何「成绩趋势图」都会变成变相的财商评分，与「不给财商分」的产品立场冲突。
2. **条形图的长度不能是唯一线索** —— 必须同时给出数值文本（现有的三处都做到了）。
3. **同一语义用同一颜色**。现状不一致：升级条填充是 `--coral`，预算条与愿望罐是 `--lime`，三者都是「进度」。建议统一为「进度 = `--lime`，超限/风险 = `--coral`」。
4. **轨道高度统一**：现在是 8px（XP）与 10px（预算）并存。建议统一 **10px**，圆角 `--radius-pill`。
5. **轨道色提为令牌**：现在写死 `rgba(13,48,42,.18)`（浅底）与 `rgba(255,255,255,.17)`（深底）。建议加成 `--track-on-paper` / `--track-on-deep`。
6. **手写进度条补无障碍语义**：两个手写 div 条缺 `role="progressbar"` + `aria-valuenow/valuemin/valuemax`，屏幕阅读器完全读不到进度。原生 `<progress>` 那条没有这个问题 —— **优先用原生元素**。
7. **数字等宽**：实测自托管的 Nunito 数字 advance width 恒为 600（天然等宽），所以数值跳动时不会左右抖，无需 `font-variant-numeric`。

### 5.3 涨跌配色：**这是一处真 bug，已修**

```css
/* 修前（欧美习惯） */
.company-meta strong.is-down { color:#bd432f; }  /* 跌 = 红 */
.company-meta strong.is-up   { color:#3a7d43; }  /* 涨 = 绿 */
```

**中国市场的习惯是「涨红跌绿」，与欧美相反。** 面向中国家庭，之前的方向正好读反了。

已改为（不新增色值，只把两个既有色值换个方向并提为令牌）：

```css
--up: #bd432f;    /* 涨 */
--down: #3a7d43;  /* 跌 */
.company-meta strong.is-up   { color: var(--up); }
.company-meta strong.is-down { color: var(--down); }
```

> 遗留讨论：`--up` 用的红与 `.form-feedback` 的报错红同源，孩子可能把「涨」读成「出错」。若要区分，需要为「涨」单独选一个更暖的红。**这一条留给你定。**

---

## 6. 验收清单

- [x] 全仓扫不到缺字形的三个码位（源文件里仅剩 `icons.js` / `sw.js` 的**注释**中提到，用于说明来由）
- [x] 静态 `data-icon` 容器全部填充成功 —— 无头 Chrome 断言：`ICONS=22 EMPTY=0`
- [x] Lottie 懒加载通路打通 —— 断言：`REWARD_HIDDEN=false REWARD_SVG=yes`
- [x] 三个图标在 12 / 14 / 16 / 18 / 24 / 38 / 52px 七档下均可辨认
- [x] 深色底（`.lesson-wallet`）上星币仍读作「金面 + ink 星」
- [x] JS 语法检查通过（`icons.js` / `reward-coin.js` / `app.js` / `lessons.js` / `thinking-course.js`）
- [x] 构建断言通过（25 项资源，`dist/` 顶层与白名单严格相等）
- [x] 新增资源已同步 `build-private.mjs` 白名单与 `sw.js` `CORE_FILES`（缓存戳 `20260922-6`）
- [x] 星币 Lottie 无印度卢比残留（`₹` 与乱码字符零命中）
- [ ] **待你在浏览器里确认**：清档后的入口页 → 第 1 课 → 完成第 1 关的奖励弹窗（看星币动画）

---

## 7. 待确认与后续

| # | 项 | 说明 |
|---|---|---|
| 1 | 其余 emoji 是否也要 SVG 化 | 现在只剩三个「承担教学含义」的换掉了。`.player-stats` 的 👣（"Lessons completed"）在 14px 下糊成一个深色团块 —— 不是缺字形，是**小尺寸下认不出**。同类候选：🏦 🌱 🏅 🔒 ✨ 💅 🛍️ 📦 |
| 2 | `--up` 的红要不要单独选色 | 见 5.3 末尾。现在与报错红同源 |
| 3 | 进度条语义色统一 | 见 5.2 第 3 条（`--coral` vs `--lime`）。改之前请先确认第 5 课「愿望罐」的配色语义 |
| 4 | 图表规范是否按建议稿执行 | 第 5.2 节 7 条里，1 / 2 / 7 是现状已符合的；3 / 4 / 5 / 6 需要改动 |
| 5 | Lottie 是否再收一次 | 若希望奖励币也是硬边风，可以再出一版纯 SVG 的 CSS 动画币，代价是丢掉 3D 光泽。**建议先看一次真实奖励弹窗再定** |
| 6 | `vendor/` 的治理 | 现在 `vendor/lottie/` 只有一个播放器（164 KB）。它**故意没进 `sw.js` 的 `CORE_FILES`** —— 预缓存会把首屏成本拉高，首次用到时走常规运行时缓存 |

---

## 附：文件与体积

| 文件 | 体积 | 角色 |
|---|---|---|
| `icons.js` | 4.1 KB | 三个图标的唯一定义 + `data-icon` 填充 |
| `reward-coin.js` | 4.6 KB | Lottie 懒加载与播放，失败静默 |
| `assets/lottie/coin-star.json` | 33.7 KB | 改造后的星币动画（删 ₹ 文字层 + 矢量 ★ + 调色板收敛） |
| `vendor/lottie/lottie_light.min.js` | 164.3 KB | lottie-web 5.12.2 light，自托管，仅奖励时刻加载 |
| `styles.css` | 778 行（`:root` 49 个令牌） | 新增「图标系统」一节 + `--up` / `--down` |

---

# 第二章 · 全站 emoji 换成自带矢量图标

> 第一章解决的是「🪙🧋🫧 三种渲染成空白方块」这一个 bug。
> 第二章解决的是同一类问题的根源：**只要图标还由系统字体渲染，字形覆盖就永远不在我们手里**。
> 所以把生产面 112 处 / 56 种 emoji 全部换成随包发布的矢量图。

## 1. 为什么值得全换（不只是修 bug）

| 理由 | 具体表现 |
|---|---|
| 字形覆盖不可控 | 就是第一章那个 bug。换掉之后原理上不会再出现 |
| 跨平台不一致 | 同一段文案在 Windows / macOS / Android / 鸿蒙上是四套画风，截图、宣传物料、家长手机上的观感都对不上 |
| 不能上色与对齐 | emoji 是彩色位图字形，无法用令牌上色、无法与文字基线和字重对齐，尺寸只能靠 `font-size` 间接控制 |
| 不能承载状态 | 想表达「已锁定 / 已获得 / 必需品」只能靠再加文字；矢量图可以用描边宽度、填充色做区分 |

## 2. 盘点（只统计生产面）

```
替换 112 处 / 去重 56 种，落在 7 个文件

index.html          38        money-lab.js         9
app.js              26        teaching-media.js    3
lessons.js          18        video-lessons.js     1
thinking-course.js  17
```

`docs/` 下的审计页与风格取样板里还有 88 处 emoji —— **刻意不动**：它们是给内部看的说明性页面，
不面向用户，改动它们只会让历史审计记录与当时的截图对不上。

## 3. 选型对比（都是实测抓取，不是照抄官网）

| 来源 | 许可 | 覆盖 | 56 个合计 | 单个均值 | 形态 |
|---|---|---|---|---|---|
| **Tabler Icons 3.47** | MIT | 57 / 58 | 15.4 KB | 277 B | 24×24 **描边型** |
| **Phosphor 2.1** | MIT | 58 / 58 | 29.7 KB | 524 B | 256×256 **实色型** |
| Twemoji | CC-BY 4.0 | 58 / 58 | 73.8 KB | 1303 B | 36×36 彩色 |
| OpenMoji | CC BY-SA 4.0 | 58 / 58 | — | — | 彩色；**SA 条款对商业产品是负担** |

> 覆盖数是我们的 58 个目标 key 里有几个能直接命中。
> 对比基准：**现在这套 emoji 方案的体积是 0 KB**（靠系统字体白拿）。
> 换图标一定是「加体积换一致性」，这一点要认，不能当成纯粹的优化。

**为什么不用 Lottie 做图标**：三个理由都足以否决 ——
① 单体重量。上面一格 Tabler 图标 277 字节，一段 Lottie 动效是几十到几百 KB；
② 每个动画实例都是一个独立的 `requestAnimationFrame` 循环，170 个位置并排跑会直接拖垮低端机；
③ 动画自带一套造型语言，改不动 —— 上色、描边宽度、与字重的关系都锁死在 JSON 里。
Lottie 只适合「一个高光时刻」，也就是第一章里那枚奖励星币，这次维持不动。

**为什么最终是 Tabler + Phosphor 混用**：本项目是纯静态、零第三方运行时依赖。
两个库都是 MIT，构建期把几何抽成内联 SVG 之后，**运行时既不下载文件也不依赖任何库**。
两者都在 `vendor/icons/` 留了许可全文。

## 4. 方案：界面元件走线稿，教学物件走实色

单一画风都有明显缺陷，所以按「这个图标承担什么」分两套：

- **界面元件（47 处）→ Tabler 线稿**
  导航、统计条、关卡状态锁、徽章、按钮前的播放标记。
  它们不承担教学信息，只需要「清晰、不抢戏」，线稿最合适。
- **有教学含义的物件（60 处 + 自绘 5 处）→ Phosphor 实色 + ink 粗描边**
  课程图标（👛🧺📦🐷☂️）、商品（🍵🥤🥛🍓🧃）、招牌、存钱罐、水果、彩虹。
  这些是「这一课学什么」的核心信息，需要更重的视觉权重，也要和产品既有的
  「硬边纸玩」形状系统（方向 A）同语言。

**两条必须一起改的比例**：

```
24 网格（Tabler 与自绘）  stroke-width: 2            → 占图标 8.3%
256 网格（Phosphor）      stroke-width: 42 + paint-order: stroke fill
                         → 只露外半圈，可见 21/256 = 8.2%
```

改一个不改另一个，两套图标就会一粗一细。`paint-order: stroke fill` 是让描边只向外长的关键，
不加的话描边会把图形内部细节（比如存钱罐的鼻子）糊掉。

**描边色为什么线稿用 `currentColor`、自绘用固定 `--ink`**：
线稿是单色轮廓，跟着文字颜色走最省事 —— 深色侧栏上自动变浅、浅色卡片上自动变深，一处不用覆盖。
自绘的六个是多部件图形（星币要「黄面 + 深色星纹」），颜色是语义的一部分，
跟着上下文变色会散掉，所以显式写 `--ink`。

## 5. 库里的空缺与六个自绘图标

| 缺口 | 处理 |
|---|---|
| 🍎 苹果 | **自绘**。Phosphor 只有 `apple-logo` —— 那是 Apple 公司的商标，拿来当水果用有商标风险 |
| 🥛 牛奶 | **自绘**（牛奶盒）。两个库都没有牛奶 |
| 🧃 果汁 | **自绘**（果汁盒带吸管）。同上 |
| 🪧 招牌 | Tabler 没有，用 Phosphor 的 `signpost` |
| 🏷️ 标签 | Tabler 没有，用 Phosphor 的 `tag` |
| 🤔 思考 | Tabler 用 `mood-confused`，Phosphor 用 `puzzle-piece` |
| 🍓 草莓 | 两个库都没有草莓，用 `cherries`（樱桃）替代 |
| 💅 美甲 | 用 `hand-finger`（手势），不是美甲专用图形 |

自绘图标在 24 网格上画，和 Tabler 同比例；配色只用现有令牌
（`--white` 纸面、`--yellow` 奖励黄、`--blue` 牛奶标签、`--purple` 果汁标签、`--lime` 苹果叶）。
**没有新增任何色值**。

## 6. 改动清单

| 文件 | 改动 |
|---|---|
| `icons.js` | 从 3 个图标扩到 **59 个**（Tabler 22 / Phosphor 31 / 自绘 6），4.2 KB → 27.0 KB。新增 `k` 字段区分画法 |
| `styles.css` | 「图标系统」一节重写：`.mq-icon-chrome` / `.mq-icon-object` / `.mq-icon-money` + 8 个自绘部件类 |
| `index.html` | 38 处 emoji → `<span data-icon="key"></span>`（与既有的 `data-icon="coin"` 同一机制） |
| `app.js` | 26 处；其中 **4 处 `textContent` 必须改成 `innerHTML`** |
| `lessons.js` | 18 处 |
| `thinking-course.js` | 17 处；**2 处在翻译文案里**，改完会切断字符串，改为直接删掉该 emoji |
| `money-lab.js` | 9 处；1 处 emoji 嵌在双引号里，不能裸插表达式 |
| `teaching-media.js` | 3 处；**2 处 `textContent` 改 `innerHTML`** |
| `video-lessons.js` | 1 处 |
| `money-lab.html` | **补上遗漏的 `<script src="icons.js" defer>`** —— 见下 |
| `sw.js` | 缓存戳 `20260922-6` → `20260922-7` |
| `vendor/icons/` | 新增 `LICENSE-tabler.txt` / `LICENSE-phosphor.txt` |

### 顺手抓到的真 bug

`money-lab.html`（零花钱小镇）**从来没有引入过 `icons.js`** ——
它是第一章新增的文件，当时只挂到了 `index.html` 与 `thinking.html`。
第一章那三个图标没在零花钱小镇出现过，所以这个缺口一直没暴露。
第二章让 `money-lab.js` 开始调用 `window.mqIcon` 之后，页面直接
`Uncaught TypeError: window.mqIcon is not a function`，整个小镇渲染不出来。
**这是无头浏览器验证抓到的，不是靠读代码看出来的。**

## 7. 验证

无头 Chrome 抓三个页面的真实 DOM（`--dump-dom`）+ 控制台：

| 页面 | 渲染出的图标 | 图标插槽 | 未填充插槽 | 残留 emoji | JS 错误 |
|---|---|---|---|---|---|
| `index.html` | 48 | 48 | 0 | 0 | 0 |
| `thinking.html` | 4 | 0 | 0 | 0 | 0 |
| `money-lab.html` | 10 | 0 | 0 | 0 | 0 |

其它核对项：

- 生产面 7 个文件的 emoji 残留 **0 行**（正则 `\p{Extended_Pictographic}` 全扫）
- 8 个 JS 文件 `node --check` 全部通过
- 构建断言通过：`dist/` 顶层 25 项，HTML 内 `src|href` 全在白名单内
- 新换行符一致：`icons.js` CRLF / `styles.css` LF / `video-lessons.js` 保持原有 LF（未churn）

## 8. 已知取舍（都记在这里，不要当成遗漏）

1. **三位顾客用三张不同的脸**：🧒→`mood-kid`、👧→`mood-smile`、🧑→`user`。
   Tabler 没有带性别区分的人物图标。要「一个女孩」的准确表达，得等专门画的角色图。
2. **💛 与 💚 现在同形**：都映射到 `heart`，只差描边色。原本靠颜色区分（+20 星币 / +30 XP），
   换掉之后这一层区分弱了。若在意，给它们各加一个 `--yellow` / `--lime` 描边类即可。
3. **🥤 与 🥛 是两个 key 但同源几何**（都是 Phosphor `pint-glass`）：
   在采购清单里它们是「杯子和吸管」与「牛奶」两件不同商品，
   牛奶已改为自绘牛奶盒，这个冲突已解；🍵（`coffee`）与它们不冲突。
4. **单色化**：物件统一纸白填充，只有金额类是奖励黄。
   好处是不与状态色打架，代价是商品格里的颜色信息变少（原来 🍓 是红的、🌈 是彩的）。
   标签文字始终在旁边，信息没丢，但「一眼分辨」变弱了。
5. **`docs/` 里的 88 处 emoji 未动**，属于历史记录，不参与产品一致性。
6. **没有引入「每件商品一个色调」的机制**：`--coral` 在本项目里是错误色，不能拿来当水果色；
   其余可用令牌只有 5 个，不够分给 30 多个物件。要做需要先扩色板。

## 9. 怎么重新生成（改映射后照做）

```bash
node .workbuddy/tmp-icons/fetch-missing.js   # 按 icon-table.js 补齐缺的图标到本地缓存
node .workbuddy/tmp-icons/build-icons.js     # 生成 icons.js
node .workbuddy/tmp-icons/replace-emoji.js            # 干跑，只报告
node .workbuddy/tmp-icons/replace-emoji.js --write    # 落盘
node .workbuddy/tmp-icons/build-sampler.js   # 重出方向对照页
node scripts/build-private.mjs               # 构建（会跑白名单断言）
```

`icon-table.js` 是唯一事实来源：emoji → key / 来源 / 文件名 / 画法。
四个脚本都读它，所以改映射只需要改一处。

## 10. 待确认

1. 是否给部分物件加**语义色**（需要先扩 `:root` 色板，或引入 `--on-*` 配对层）。
2. 三位顾客是否改回 emoji，或等专门绘制的角色图。
3. 💛 / 💚 是否补上各自的描边色以恢复区分度。
4. 是否把 `docs/` 下的 88 处 emoji 也一并换掉（目前判断不需要）。
5. Lottie 是否要扩用到别的高光时刻（例如整章完成）。
6. `vendor/icons/` 的两个许可文件目前**随包进 dist**（约 2.5 KB）。若希望产物更干净，
   可在 `build-private.mjs` 的 `copyDir` 里把 `.txt` 也一并跳过 —— 但 MIT 要求随分发保留许可文本，
   建议保留。

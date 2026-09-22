# 06 · 小芽思考站（样板课）

**文件**：`thinking.html` + `thinking-course.js` + `thinking.css` + `dialogue.css`
**课程**：10 枚星币的野餐计划 —— 先猜、再试、看结果、改主意

---

## 1. 页面目标

独立于主游戏的**思维课样板**：体验「做预测 → 试自己的计划 → 说清为什么」的学习循环。

与主应用的关系：

| | 主应用（经营岛） | 思考站 |
|---|---|---|
| 存档 | `future-life-skills-money-game-v1` | `future-thinking-picnic-v1`（独立命名空间） |
| 入口 | 首次进入页（首次）／首页卡片（回访） | 首页入口卡 / 页脚互相跳转 |
| 是否需要角色 | 需要（有昵称与场景） | **不需要**，直接体验 |
| 页面语言 | 中 / EN 双语 | 中 / EN 双语 |

## 2. 页面骨架

```
thinking-header（sticky 72px）
  [← 课程地图]     小芽思考站      [EN] [休息]
thinking-main（min(1100px, 100% - 40px)）
  ├ .course-kicker        先在游戏里试一试…
  ├ .thinking-title       h1 + [本课标签]
  ├ .thinking-steps       进度条（线段式，非数字）
  └ .thinking-layout      两栏 grid
       ├ .thinking-chat   ← 左栏（0.88fr）对白，≥761px 时 sticky
       │                    .dialogue-cast + .dialogue-bubble + .narration-bar
       └ .thinking-work   ← 右栏（1.12fr）工作区（带 --e2 硬边）
                            h2 + 说明 + 选择/购物/星币演示 + .thinking-actions
thinking-footer
  [只保存到这台设备]      [下一站：存·花·捐与模拟银行]      [本次 0:00]
```

## 3. 组件规格

| 组件 | 规格 |
|------|------|
| `.thinking-steps` | **线段式**进度条：5–6 段，每段高 7px；已完成 `#88b761`、当前 `--ink`、未到 `#dce4d1`。与学习页的「文字标签条」是两套表达，各自页内自洽 |
| `.thinking-chat` | 白底 + ink 描边 + `--radius-xl`；`position: sticky; top: 98px` |
| `.thinking-work` | 同款容器 + `--e2` 硬边；`h2` 22px，正文 `--fs-body` 18px / 行高 1.7 |
| `.thinking-choice` | 整行按钮，`min-height:72px`，图标 32px + 主文案 18px + 副文案 14px；选中 `#eff8d7` + 实色底边 |
| `.shop-item` | 两列网格，`min-height:142px`，图标 40px + 名称 + 价格；选中 `#eafaC9` + 右上角 ✓ 圆点 |
| `.coin-lab` | 星币演示区：底 `#fff8df`+ ink 描边；两列 `.coin-group`；星币 25px 圆片 |
| `.think-timeline` | 左侧 4px 绿强调条（`--bw-accent`），用于「改主意的过程」 |
| `.thought-stamp` | 黄底「我的想法」卡，40px 图标 + 20px 加粗 |
| 弹窗 | 原生 `<dialog>` + `::backdrop` 深绿半透明 + blur；`#pause-dialog` / `#restart-dialog` |

## 4. 与主应用的差异（有意为之）

| 项 | 主应用 | 思考站 | 说明 |
|----|--------|--------|------|
| 进度表达 | 五步文字标签条 | 线段式进度条 | 主线课程需要孩子知道「下一步是什么」；样板课只需要知道「还剩多少」 |
| 深色区块 | 有（`coming-worlds`） | 无 | 样板课全程浅色，转场更少 |
| 一次性的「改主意」 | 无 | 有（`.think-timeline`） | 这是这节样板课的核心教学点 |
| 结束方式 | 奖励弹窗 + 回地图 | `<dialog>` 重新体验 / 页脚去下一站 | 样板课不产出 XP、徽章、星币 |

## 5. 排版检查结论

| # | 项 | 结论 |
|---|----|------|
| 1 | 左栏 sticky 与右栏长内容 | `.thinking-chat { position: sticky; top: 98px }` 在右栏内容高于视口时表现良好；但右栏内容短（如「预测」步）时两栏高度差大，左侧会孤立地悬着 ⚠️ 建议给 `align-items:start` 之外的兜底：右栏内容 < 400px 时取消 sticky |
| 2 | 对白字号 | 21px / 行高 1.65，`--fs-body` 之上，适合共读 ✅ |
| 3 | 装饰字幕 | `.thinking-app .cast-caption { display:none }` —— 与学习页改版后的处理一致 ✅ |
| 4 | 断点 | 只有 760px 一个断点，与全站 640 / 900 不一致 ⚠️ 见总览 §2.7 |
| 5 | 颜色 token | `thinking.css` 大面积硬编码色值（`#f6f8ed` / `#577552` / `#e9f3cf` / `#88b761` / `#dce4d1` / `#5f735a` 等）⚠️ 应并入 `styles.css` token 表 |
| 6 | 焦点环颜色 | 本页 `outline: 3px solid #237d9a`（蓝），主应用是 `--coral` ⚠️ 两套焦点色不一致 |
| 7 | 触控目标 | `min-height:44px` 为下限，主按钮 52px ✅ |
| 8 | `.dialogue-bubble` 最小高度 | 138px（主应用 112px），因为本页气泡是主叙事区 ✅ |
| 9 | 顶部标题 | `h1` `clamp(23px,3vw,32px)` / 字重 750，比主应用课头（800 / 21–27px）略轻 ⚠️ 建议对齐 |

## 6. 验收清单

- [ ] 从首页入口卡进入，无需任何创建角色步骤。
- [ ] 五段进度条随步骤推进：已完成绿 → 当前深绿 → 未到浅灰绿。
- [ ] 左栏对白翻页、朗读、语速、静音、减少动画全部可用（与主应用同一套 `TeachingMedia`）。
- [ ] 星币演示的两组圆片在「花掉」时变色，`.spent` 组为灰调。
- [ ] `<dialog>` 打开时背景内容不可滚动/不可聚焦；Esc 可关闭。
- [ ] 页脚「下一站」可跳到 `money-lab.html`；页头「课程地图」可跳回 `index.html`。
- [ ] 清空存档**不会**清除本页记录（独立命名空间 `future-thinking-picnic-v1`）。
- [ ] 760px 以下单列，左栏 sticky 取消。
- [ ] 本页对白排版未受学习页改版影响（学习页规则全部限定在 `#guided-lesson`）。

## 7. 待确认

1. 断点与焦点色是否并入全站规范（本页 760px / 蓝色焦点环）。
2. 是否需要一个「结束」动作（当前体验完只能自己点重新开始或离开）。
3. 教学上是否要展示「预测 vs 结果」的对照（数据已有，界面未做）。

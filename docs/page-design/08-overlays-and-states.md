# 08 · 浮层与通用状态

**文件**：`index.html` / `thinking.html` / `money-lab.html` + `styles.css` / `video.css` / `thinking.css`

---

## 1. 浮层清单

| 浮层 | 触发 | 实现 | 尺寸与位置 |
|------|------|------|-----------|
| 奖励弹窗 `#reward-popover` | 完成一节 / 一个任务 | `div[role=dialog][aria-modal]`，`position:fixed; z-index:300` | 遮罩 `rgba(13,48,42,.82)` + blur 8px；面板 `min(440px,100%)`，白底 + 3px ink 描边 + `--radius-xl` + **`--e4-lime`（绿色硬边，因为底色不是纸白）** |
| 休息遮罩 `#study-pause` | 学习页点「暂停休息」 | `role=dialog[aria-modal]`，`inset:72px 0 0` | 半透明深绿遮罩 + 纸色面板；`z-index:10`（在 `.mission-header` 之下，顶栏仍可用） |
| 暂停对话框（思考站 / 小镇） | 页头「休息」按钮 | 原生 `<dialog id="pause-dialog">` | 居中，`max-width:min(480px,100%-30px)`；`::backdrop` 深绿 + blur 4px |
| 重新体验对话框（思考站） | 重新开始 | 原生 `<dialog id="restart-dialog">` | 同上，含「先留着 / 重新开始」两按钮 |
| 视频播放卡 `.lesson-video` | 该课该步配了片 | `video.css` 作用域 | 白底 + ink 描边 + `--e2` 硬边；画面 16:9 + 深绿底 |

### 1.1 奖励弹窗的规格

```
        ✦（右上角 130px 黄色光斑，opacity .4）
      任务完成
   钱的流动看懂了！        ← h2 35px
        🏅                ← 92px 圆形，lime 底 + ink 描边 + --e2
    +30 XP　+20经营星币     ← 14px muted
  [ 领取奖励并继续 ]        ← 主按钮
```

| 状态 | 表现 |
|------|------|
| 打开 | `hidden = false`；`TeachingMedia.playSuccessSound()`；焦点移到「领取奖励并继续」 |
| 关闭 | 点按钮 → 隐藏弹窗 → `closeMission()` → 回到地图首页 |
| 静音偏好开启 | 不播放提示音（`prefs.muted`） |
| 减少动画 | 无庆祝动效 |

**文案红线**：奖励数字后必须带一条诚实说明。例如市场实验室的奖励写「+40 XP　**做过练习不等于掌握真实投资**」。不得出现「你已经是小投资者」这类身份结论。

## 2. 状态清单（跨页面）

| 状态 | 表达方式 | 用在哪 |
|------|---------|--------|
| 可开始 / READY | lime 小标签 + ink 字 | 章节卡右上角 |
| 已完成 | `✓ 已完成` + 浅绿底 + 描边加粗到 3px | 章节卡 / 徽章卡 |
| 未解锁 | `🔒` + `saturate(.25) opacity(.66)` + 禁用按钮 | 章节卡 / 侧栏市场项 / 小镇页签 |
| 已选中 | 浅绿底（`#effbd8` / `#eafaC9`）+ **实色底边**（不是描边）+ 勾号 | 场景卡 / 选项 / 口袋物品 |
| 禁用 | `opacity:.5` + 底边收为 0 | 全局 `button:disabled` |
| 正确 | 左侧 4px 绿强调条 `#507c2d` + 「你发现啦！」 | 学习页反馈 |
| 错误 | 左侧 4px **coral** 强调条 + 「没关系，我们一起看看」 | 学习页反馈（**不用红色报错**） |
| 载入/占位 | 视频未配片时 `MoneyVideo.slot()` 返回空串，**不显示空占位** | 学习页 |
| 失败（语音） | 状态行文字提示 + 自动展开「声音与动画设置」 | 学习页朗读 |
| 空态 | 徽章页至少有 6 张灰卡；小镇账本空时显示「还没有交易。分配是在口袋之间移动，不是收入。」 | 全局 |

### 2.1 提示文本机制

- 静态多语言：`<span class="zh">…</span><span class="en">…</span>`，靠 `html[lang]` 切换。
- 运行时消息：`setMessage(el, zh, en, success)` 把文案写进 `data-message-zh/en`，`refreshMessages()` 在切语言时统一刷新 —— **动态插入的反馈必须走这条路，否则切语言会残留旧语言**。
- 覆盖的反馈位：`#mission-1-feedback` / `#mission-2-feedback` / `#mission-3-feedback` / `#market-feedback` / `#risk-feedback`。原 `#setup-feedback`（入口页表单）已随表单一起下线，相关分支在 `app.js` 中已删净。

## 3. 焦点与可访问性

| 项 | 规则 |
|----|------|
| 焦点环 | `3px solid var(--coral)`，`offset: 3px`（思考站/小镇用 `#237d9a`，两套颜色待统一） |
| 焦点移入浮层 | 奖励弹窗 → 主按钮；休息遮罩 → 「我准备好了，继续」 |
| 焦点移出浮层 | `closeMission()` 后回到 `returnFocus`（触发前的元素），`isConnected` 校验后才 `focus()` |
| 背景屏蔽 | 浮层打开时给 `.mission-content` 或 `#game-app` 设 `inert = true`；`body.overflow = hidden` |
| 滚动复位 | 每次切换步骤 `#mission-layer.scrollTop = 0`，并把焦点给 `#lesson-heading`（`preventScroll: true`） |
| 语言切换 | 焦点不丢：`setLanguage()` 只重绘文案，不重建 DOM 结构（学习页额外调用 `guided.render()`） |
| 读屏播报 | `.dialogue-bubble[role=status][aria-atomic]`、`.lesson-feedback[role=status]`、`#break-reminder[role=status]` |

## 4. 排版检查结论

| # | 项 | 结论 |
|---|----|------|
| 1 | 奖励弹窗硬边用色 | 面板是白底却用 `--e4-lime`（绿边）—— 原因已写在 token 注释里：奖励场景的绿边与浮层语义绑定 ✅ |
| 2 | 休息遮罩起点 | 与 `.mission-header` 高度绑定。学习页顶栏已从 72px 收到 60px，遮罩起点原本仍写死 72px，会露出 12px 白条 —— **已修**：`dialogue.css` 内用 `@media (min-width:651px) body.is-lesson .study-pause { inset:60px 0 0 }` 跟随；窄屏仍由 `styles.css` 的 120px 规则负责（顶栏折两行） |
| 3 | 弹窗层级 | 300（奖励）/ 100（任务层）/ 50（顶栏）/ 45（侧栏）/ 15（思考站页头）/ 10（休息遮罩）。层级清晰 ✅ |
| 4 | 三个页面的 dialog 样式 | `thinking.css` 统一处理 `.thinking-app dialog`；主应用未用 `<dialog>`（用 div 模拟）⚠️ 两套实现，建议统一 |
| 5 | `--focus` token | 只定义在 `.lesson-video` 作用域内（`video.css`），其他文件用硬编码焦点色 ⚠️ 建议提到 `:root` |
| 6 | 奖励弹窗内容高度 | 白板内容较短（标题 + 徽章 + 一行说明），在 844px 高的手机上比例合适 ✅ |

## 5. 验收清单

- [ ] 完成一节基础课后，奖励弹窗出现、播提示音（未静音时）、焦点在「领取奖励并继续」。
- [ ] 弹窗打开时，Tab 不会跑到背后的页面元素上。
- [ ] 关闭弹窗后焦点回到刚才点的那张章节卡。
- [ ] 学习页点「暂停休息」：内容被遮住且不可聚焦，顶栏仍可用，进度已保存。
- [ ] 学习页连续学习 15 分钟后出现一次休息提醒，**不是强制中断**，关掉后不重复骚扰式弹出。
- [ ] 切语言后，所有动态反馈（含上一次的答对/答错文案）一起变语言。
- [ ] 视频未配片的课节看不到任何占位框。
- [ ] 未解锁的章节卡按钮不可聚焦（`disabled`），读屏读得出原因。

## 6. 待确认 / 待修

| # | 项 | 说明 |
|---|----|------|
| 1 | 主应用浮层未使用原生 `<dialog>` | 缺少原生焦点陷阱与 Esc 关闭，靠手工 `inert` 实现 |
| 2 | 焦点色两套 | 主应用 coral vs 思考站/小镇 蓝 `#237d9a` |
| 3 | `#break-reminder` 无关闭按钮 | 出现后只能离开页面才消失，建议加「我知道了」 |
| 4 | 奖励弹窗没有「稍后再说」 | 只有一个出口按钮，符合「不做成打断」的立场，但需确认 |

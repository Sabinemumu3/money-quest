# media/video · 片子放这里

这个目录是「视频教学」的插座。代码已经接好了，这里没放片时，课程会安静地跳过视频——孩子看到的流程和以前一模一样。

## 放一段片，只要三步

1. 把成片拷进本目录，比如 `lesson-1-hook.mp4`
2. （建议）导出同名封面 `lesson-1-hook.jpg` 和字幕 `lesson-1-hook.zh.vtt`
3. 在 `manifest.json` 的 `lessons` 里登记：

```json
{
  "lessons": {
    "lesson-1": {
      "hook": {
        "src": "media/video/lesson-1-hook.mp4",
        "poster": "media/video/lesson-1-hook.jpg",
        "captions": { "zh": "media/video/lesson-1-hook.zh.vtt" },
        "transcript": "小芽今天带 10 枚星币去野餐……",
        "duration": 78,
        "aiGenerated": true,
        "title": { "zh": "10 枚星币，够买什么？", "en": "Ten coins: what fits?" },
        "summary": { "zh": "先看小芽怎么数钱，再轮到你。", "en": "Watch Sunny count, then it is your turn." }
      }
    }
  }
}
```

刷新页面就生效，不用改任何代码。

## 验收前必看

- 片长 60–120 秒，横屏 16:9
- 首帧不要压字幕、不要压 logo
- 必须有文字版（`transcript`）——字幕缺失或无中文语音时，孩子靠它仍然看得懂
- AI 生成的必须 `"aiGenerated": true`，卡片会自动带标注（合规要求）
- 自己先看一遍：卡顿、错别字、数字对不上，都不行

## 想看位置在哪

在地址后加 `?videoPreview=1`，即使还没配片，也会把挂载位置显示出来，用于内部评审。孩子手里不会带这个参数，看不到占位物。

## 技术细节

接口契约、降级链、埋点口径与验收清单都在 `docs/VIDEO-MODULE.md`。改动 `manifest.json` 的字段含义前，先改那份文档。

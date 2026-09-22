import { mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
const assets = ["styles.css", "dialogue.css", "video.css", "nunito-latin-vf.woff2", "icons.js", "reward-coin.js", "confetti.js", "dialogues.js", "teaching-media.js", "video-lessons.js", "coins.js", "lessons.js", "app.js", "icon.svg", "sunny-mascot.png", "sunny-expressions.png", "tuan-buddy.png", "thinking.html", "thinking.css", "thinking-course.js", "money-lab.html", "money-lab.css", "money-lab.js"];
mkdirSync(output, { recursive: true });

// 视频资产随包发布，方便在私有预览链接上用 ?videoPreview=1 给评审看挂载位置。
// .md 是给运营看的放片说明，不进产物。
const mediaDir = join(root, "media", "video");
const mediaAssets = readdirSync(mediaDir).filter((name) => !name.endsWith(".md"));
mkdirSync(join(output, "media", "video"), { recursive: true });
for (const name of mediaAssets) copyFileSync(join(mediaDir, name), join(output, "media", "video", name));

// 递归拷贝（同样跳过说明文档）
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dest = join(to, entry);
    if (statSync(src).isDirectory()) copyDir(src, dest);
    else if (!entry.endsWith(".md")) copyFileSync(src, dest);
  }
}

// 两个随包发布的目录：
//   vendor/  —— 自托管的第三方运行时（lottie-web light，仅奖励时刻懒加载）
//   assets/  —— 自研图形资产（assets/lottie/coin-star.json）
// 都不进首屏：首屏的行内图标是纯 SVG（icons.js 内联输出），不下载任何额外文件。
const extraDirs = ["vendor", "assets"].filter((dir) => existsSync(join(root, dir)));
for (const dir of extraDirs) copyDir(join(root, dir), join(output, dir));

// Hosting controls the audience. Test publications do not install an offline
// worker, so an older cached lesson cannot hide a newly published teaching fix.
const source = readFileSync(join(root, "index.html"), "utf8");
assert(source.includes('<html lang="zh-CN">'), "Expected document language declaration");
assert(source.includes('content="noindex, nofollow"'), "Preview must retain noindex metadata");
const html = source
  .replace('<html lang="zh-CN">', '<html lang="zh-CN" data-private-preview="true">')
  .replace(/^.*<link rel="manifest".*\r?\n/m, "");
writeFileSync(join(output, "index.html"), html, "utf8");
for (const asset of assets) copyFileSync(join(root, asset), join(output, asset));

const expected = ["index.html", ...assets, ...extraDirs, "media"].sort();
assert.deepEqual(readdirSync(output).sort(), expected, "Private output must contain only game assets");
for (const [, url] of (html + readFileSync(join(output, "thinking.html"), "utf8") + readFileSync(join(output, "money-lab.html"), "utf8")).matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (url.startsWith("#")) continue;
  assert(expected.includes(url), `Unexpected asset reference: ${url}`);
}
assert(readFileSync(join(output, "app.js"), "utf8").includes('dataset.privatePreview !== "true"'));
console.log(`Test site prepared: ${expected.length} game assets; offline installation disabled.`);

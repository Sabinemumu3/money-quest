import { mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
const assets = ["styles.css", "app.js", "icon.svg"];
mkdirSync(output, { recursive: true });

// Identity is checked by the hosting platform before it serves these assets.
// Private previews don't install an offline worker or cache a signed-in page.
const source = readFileSync(join(root, "index.html"), "utf8");
assert(source.includes('<html lang="zh-CN">'), "Expected document language declaration");
assert(source.includes('content="noindex, nofollow"'), "Preview must retain noindex metadata");
const html = source
  .replace('<html lang="zh-CN">', '<html lang="zh-CN" data-private-preview="true">')
  .replace(/^.*<link rel="manifest".*\r?\n/m, "");
writeFileSync(join(output, "index.html"), html, "utf8");
for (const asset of assets) copyFileSync(join(root, asset), join(output, asset));

const expected = ["index.html", ...assets].sort();
assert.deepEqual(readdirSync(output).sort(), expected, "Private output must contain only game assets");
for (const [, url] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (url.startsWith("#")) continue;
  assert(expected.includes(url), `Unexpected asset reference: ${url}`);
}
assert(readFileSync(join(output, "app.js"), "utf8").includes('dataset.privatePreview !== "true"'));
console.log("Private preview prepared: 4 game assets; offline installation disabled.");

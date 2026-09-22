import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../dist", import.meta.url));
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".json": "application/json; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".vtt": "text/vtt; charset=utf-8", ".mp4": "video/mp4", ".webm": "video/webm", ".m4a": "audio/mp4", ".woff2": "font/woff2", ".woff": "font/woff" };

// 仅本地预览使用的「清空本机存档」钩子：带 ?reset=1 打开任意页面时，
// 先清掉全部项目命名空间的 localStorage / sessionStorage / Cache Storage 与
// 残留的 Service Worker，再把地址还原成干净路径，所以只清一次、刷新不会重复清。
const RESET_SNIPPET = `<script>
(function () {
  var NAMESPACES = [
    "future-life-skills-money-game-v1",
    "future-thinking-picnic-v1",
    "future-money-town-v1",
    "money-quest-media-preferences-v1",
    "future-money-quest-video-v1"
  ];
  try {
    Object.keys(localStorage).forEach(function (key) {
      if (NAMESPACES.indexOf(key) !== -1 || /^future-/.test(key) || /^money-quest-/.test(key)) localStorage.removeItem(key);
    });
    sessionStorage.clear();
  } catch (error) { /* 隐私模式下静默失败 */ }
  try {
    if (window.caches) caches.keys().then(function (keys) { keys.forEach(function (key) { caches.delete(key); }); });
    if (navigator.serviceWorker) navigator.serviceWorker.getRegistrations().then(function (list) { list.forEach(function (item) { item.unregister(); }); });
  } catch (error) { /* 无 SW 支持时忽略 */ }
  try { history.replaceState(null, "", location.pathname); } catch (error) { /* 忽略 */ }
  document.addEventListener("DOMContentLoaded", function () {
    var note = document.createElement("div");
    note.setAttribute("role", "status");
    note.textContent = "本机存档已清空（本地预览专用）";
    note.style.cssText = "position:fixed;z-index:9999;left:50%;bottom:24px;transform:translateX(-50%);padding:10px 18px;background:#173f37;color:#fbfaf4;border-radius:999px;font:900 14px/1.4 \\"Nunito\\",\\"PingFang SC\\",system-ui,sans-serif;pointer-events:none";
    document.body.appendChild(note);
    setTimeout(function () { note.remove(); }, 4200);
  });
})();
</script>
`;

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const path = resolve(root, "." + decodeURIComponent(url.pathname).replace(/\/$/, "/index.html"));
    if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(path);
    const type = mime[extname(path)] || "application/octet-stream";
    const isMedia = /^(video|audio)\//.test(type);
    const range = isMedia ? /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "") : null;
    if (range) {
      const total = data.length;
      const start = range[1] ? Number(range[1]) : Math.max(0, total - Number(range[2] || 0));
      const end = Math.min(range[2] && range[1] ? Number(range[2]) : total - 1, total - 1);
      if (start >= total || start > end) { res.writeHead(416, { "Content-Range": `bytes */${total}` }).end(); return; }
      const chunk = data.subarray(start, end + 1);
      res.writeHead(206, { "Content-Type": type, "Content-Length": chunk.length, "Content-Range": `bytes ${start}-${end}/${total}`, "Accept-Ranges": "bytes", "Cache-Control": "no-store" });
      if (req.method === "HEAD") { res.end(); return; }
      res.end(chunk);
      return;
    }
    let body = data;
    if (/(?:^|[?&])reset=1(?:&|$)/.test(url.search) && type.startsWith("text/html")) {
      body = Buffer.from(data.toString("utf8").replace("</head>", RESET_SNIPPET + "</head>"), "utf8");
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": body.length, ...(isMedia ? { "Accept-Ranges": "bytes" } : {}), "Cache-Control": "no-store" });
    if (req.method === "HEAD") { res.end(); return; }
    res.end(body);
  } catch { res.writeHead(404).end("Not found"); }
}).listen(4107, "127.0.0.1", () => console.log("Local: http://127.0.0.1:4107  (?reset=1 清空本机存档)"));

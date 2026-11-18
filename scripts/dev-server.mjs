import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function resolvePath(urlPath){
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const relative = clean === "/" ? "index.html" : clean.replace(/^\/+/, "");
  const full = normalize(join(root, relative));
  if(!full.startsWith(root)) return null;
  return full;
}

createServer(async (req, res) => {
  const file = resolvePath(req.url || "/");
  if(!file){
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try{
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  }catch(error){
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, host, () => {
  console.log(`TESSELLE dev server: http://${host}:${port}/`);
});

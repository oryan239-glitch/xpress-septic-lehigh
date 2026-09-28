// Crawls the local build: checks internal links/anchors, one H1 per page, JSON-LD parses, canonical/title uniqueness.
const base = process.argv[2] || "http://localhost:8080";
const seen = new Map(); const queue = ["/"]; const problems = []; const titles = {}; const canon = {};
while (queue.length) {
  const path = queue.shift(); if (seen.has(path)) continue;
  const res = await fetch(base + path); seen.set(path, res.status);
  if (res.status !== 200) { problems.push(`${path} -> ${res.status}`); continue; }
  if (!/\.html$|\/$/.test(path)) continue;
  const html = await res.text();
  const h1 = (html.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) problems.push(`${path}: ${h1} h1`);
  const t = html.match(/<title>(.*?)<\/title>/)[1]; (titles[t] ||= []).push(path);
  const c = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1]; if (c) (canon[c] ||= []).push(path);
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); console.log(path, "JSON-LD:", j["@graph"].map((n) => n["@type"]).join(", ")); } catch (e) { problems.push(`${path}: bad JSON-LD ${e.message}`); }
  }
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let u = m[1];
    if (/^(tel:|mailto:|https?:)/.test(u)) continue;
    if (u.startsWith("#")) { if (u.length > 1 && !ids.has(u.slice(1))) problems.push(`${path}: missing anchor ${u}`); continue; }
    const [p, hash] = u.split("#");
    if (!seen.has(p) && !queue.includes(p)) queue.push(p);
    if (hash && p === "/") { const home = await (await fetch(base + "/")).text(); if (!home.includes(`id="${hash}"`)) problems.push(`${path}: missing /#${hash}`); }
  }
}
for (const [t, ps] of Object.entries(titles)) if (ps.length > 1) problems.push(`duplicate title: ${t}`);
for (const [c, ps] of Object.entries(canon)) if (ps.length > 1) problems.push(`duplicate canonical ${c}: ${ps}`);
console.log("checked", seen.size, "URLs"); console.log(problems.length ? problems.join("\n") : "no problems");

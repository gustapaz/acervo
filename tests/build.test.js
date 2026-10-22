import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import works from "../src/_data/works.js";
import essays from "../src/_data/essays.js";
async function pages(dir) {
  const result = [];
  for (const item of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) result.push(...(await pages(p)));
    else if (p.endsWith(".html")) result.push(p);
  }
  return result;
}
test("exportação contém todas as páginas, títulos e conteúdo estático", async () => {
  for (const w of works) {
    const html = await fs.readFile(`dist/obras/${w.slug}/index.html`, "utf8");
    assert.ok(html.includes(`<h1>${w.title}</h1>`));
    assert.ok(
      html.includes(`https://gustapaz.github.io/acervo/obras/${w.slug}/`),
    );
    assert.ok(html.includes(w.reading));
  }
  for (const e of essays)
    assert.ok(
      (
        await fs.readFile(`dist/cadernos/${e.slug}/index.html`, "utf8")
      ).includes(e.sections[0].paragraphs[0]),
    );
});
test("links e arquivos internos do HTML apontam para destinos existentes", async () => {
  for (const page of await pages("dist")) {
    const html = await fs.readFile(page, "utf8");
    for (const match of html.matchAll(/(?:href|src)="(\/acervo\/[^"{}]*)"/g)) {
      const relative = decodeURIComponent(match[1].slice(8).split(/[?#]/)[0]);
      if (!relative) continue;
      const target = path.join(
        "dist",
        relative.endsWith("/") ? relative + "index.html" : relative,
      );
      await assert.doesNotReject(fs.access(target), `${page}: ${match[1]}`);
    }
  }
});
test("todas as reproduções locais têm registro CC0 e tamanhos responsivos", async () => {
  const sources = JSON.parse(await fs.readFile("docs/sources.json", "utf8"));
  for (const work of works) {
    const source = sources.find((s) => String(s.id) === work.id);
    assert.equal(source.license, "CC0");
    assert.ok(source.sha256Original.length === 64);
    for (const size of [640, 1600])
      await fs.access(`dist/images/${work.id}-${size}.webp`);
  }
});

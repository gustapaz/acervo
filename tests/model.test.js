import { test } from "node:test";
import assert from "node:assert/strict";
import works from "../src/_data/works.js";
import {
  filterWorks,
  sortWorks,
  sanitizeLibrary,
  pairFromSearch,
} from "../src/client/model.js";
const ids = works.map((w) => w.id);
test("busca ignora acentos e maiúsculas e combina filtros", () => {
  assert.equal(filterWorks(works, { query: "nenufares" })[0].id, "136510");
  assert.equal(
    filterWorks(works, {
      query: "CÉZANNE",
      theme: "Natureza",
      technique: "Óleo",
    }).length,
    1,
  );
  assert.equal(
    filterWorks(works, { query: "CÉZANNE", theme: "Retratos" }).length,
    0,
  );
  assert.equal(filterWorks(works, { query: "não existe" }).length, 0);
  assert.equal(filterWorks(works, { technique: "Pastel" }).length, 1);
});
test("ordena cronologicamente sem alterar a curadoria original", () => {
  const original = works.map((w) => w.id),
    old = sortWorks(works, "antigas"),
    recent = sortWorks(works, "recentes");
  assert.equal(old[0].id, "111654");
  assert.equal(recent[0].id, "136510");
  assert.deepEqual(
    works.map((w) => w.id),
    original,
  );
});
test("seleção ignora ids externos, remove duplicatas e limita notas", () => {
  const result = sanitizeLibrary(
    {
      version: 1,
      saved: [ids[0], ids[0], "x"],
      notes: { [ids[0]]: "x".repeat(2000), x: "fora" },
    },
    ids,
  );
  assert.deepEqual(result.saved, [ids[0]]);
  assert.equal(result.notes[ids[0]].length, 1500);
  assert.equal(result.notes.x, undefined);
  assert.throws(() => sanitizeLibrary(null, ids));
  assert.throws(() => sanitizeLibrary({ version: 2, saved: [] }, ids));
});
test("comparação só aceita duas obras existentes e diferentes", () => {
  assert.deepEqual(pairFromSearch("?a=121188&b=136510", ids), [
    "121188",
    "136510",
  ]);
  for (const q of ["?a=x&b=136510", "?a=121188&b=121188", "?a=121188", ""])
    assert.deepEqual(pairFromSearch(q, ids), []);
});
test("notas permanecem texto e não são interpretadas como HTML", () => {
  const text = "<img src=x onerror=alert(1)>";
  assert.equal(
    sanitizeLibrary(
      { version: 1, saved: [ids[0]], notes: { [ids[0]]: text } },
      ids,
    ).notes[ids[0]],
    text,
  );
});

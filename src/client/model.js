export const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export function filterWorks(
  works,
  { query = "", theme = "Todos", technique = "Todas", artist = "Todos" } = {},
) {
  const q = normalize(query);
  return works.filter(
    (w) =>
      (theme === "Todos" || w.theme === theme) &&
      (technique === "Todas" || w.technique === technique) &&
      (artist === "Todos" || w.artist === artist) &&
      normalize(
        `${w.title} ${w.original} ${w.artist} ${w.theme} ${w.date}`,
      ).includes(q),
  );
}
export function sortWorks(works, sort = "curadoria") {
  const list = [...works];
  if (sort === "antigas") list.sort((a, b) => a.year - b.year);
  if (sort === "recentes") list.sort((a, b) => b.year - a.year);
  if (sort === "artista")
    list.sort((a, b) => a.artist.localeCompare(b.artist, "pt-BR"));
  return list;
}
export function sanitizeLibrary(value, ids) {
  if (!value || value.version !== 1 || !Array.isArray(value.saved))
    throw new Error("Coleção inválida");
  const saved = [
    ...new Set(
      value.saved.filter((id) => typeof id === "string" && ids.includes(id)),
    ),
  ];
  const notes = {};
  if (value.notes && typeof value.notes === "object")
    for (const id of ids)
      if (typeof value.notes[id] === "string")
        notes[id] = value.notes[id].slice(0, 1500);
  return { version: 1, saved, notes };
}
export function pairFromSearch(search, ids) {
  const p = new URLSearchParams(search),
    a = p.get("a"),
    b = p.get("b");
  return ids.includes(a) && ids.includes(b) && a !== b ? [a, b] : [];
}

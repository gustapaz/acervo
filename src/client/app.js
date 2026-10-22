import Alpine from "alpinejs";
import {
  filterWorks,
  sortWorks,
  sanitizeLibrary,
  pairFromSearch,
} from "./model.js";
import "./style.css";
const works = JSON.parse(document.getElementById("work-data").textContent),
  ids = works.map((w) => w.id);
const empty = () => ({ version: 1, saved: [], notes: {} });
let toastTimer, opener;
function read() {
  try {
    const v = localStorage.getItem("acervo-library");
    return v ? sanitizeLibrary(JSON.parse(v), ids) : empty();
  } catch {
    return empty();
  }
}
const initial = read();
function readCompare() {
  try {
    const list = JSON.parse(sessionStorage.getItem("acervo-compare") || "[]");
    return Array.isArray(list)
      ? [...new Set(list.filter((id) => ids.includes(id)))].slice(0, 2)
      : [];
  } catch {
    return [];
  }
}
Alpine.store("archive", {
  saved: initial.saved,
  notes: initial.notes,
  compare: readCompare(),
  message: "",
  storageError: false,
  has(id) {
    return this.saved.includes(id);
  },
  get count() {
    return this.saved.length;
  },
  notify(text) {
    this.message = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (this.message = ""), 5000);
  },
  persist() {
    try {
      localStorage.setItem(
        "acervo-library",
        JSON.stringify({ version: 1, saved: this.saved, notes: this.notes }),
      );
      this.storageError = false;
      return true;
    } catch {
      this.storageError = true;
      this.notify(
        "O navegador não permitiu salvar. Suas alterações ficam disponíveis apenas nesta aba.",
      );
      return false;
    }
  },
  toggle(id) {
    if (!ids.includes(id)) return;
    const was = this.has(id);
    this.saved = was ? this.saved.filter((x) => x !== id) : [...this.saved, id];
    if (this.persist())
      this.notify(
        was ? "Obra removida da sua seleção." : "Obra guardada na sua seleção.",
      );
  },
  persistCompare() {
    try {
      sessionStorage.setItem("acervo-compare", JSON.stringify(this.compare));
    } catch {
      this.notify(
        "A comparação fica disponível apenas nesta página porque o armazenamento não foi permitido.",
      );
    }
  },
  toggleCompare(id) {
    if (!ids.includes(id)) return;
    if (this.compare.includes(id)) {
      this.compare = this.compare.filter((x) => x !== id);
      this.persistCompare();
      return;
    }
    if (this.compare.length === 2) {
      this.notify(
        "Escolha até duas obras. Remova uma para trocar a comparação.",
      );
      return;
    }
    this.compare = [...this.compare, id];
    this.persistCompare();
  },
  compareUrl() {
    return this.compare.length === 2
      ? `/acervo/comparar/?a=${this.compare[0]}&b=${this.compare[1]}`
      : "#";
  },
  clearCompare() {
    this.compare = [];
    this.persistCompare();
  },
  work(id) {
    return works.find((w) => w.id === id);
  },
});
Alpine.data("shell", () => ({
  menu: false,
  modal: null,
  current: works[0],
  draft: "",
  zoom: 1,
  reading: 0,
  init() {
    window.addEventListener("storage", (e) => {
      if (e.key === "acervo-library") {
        const v = read(),
          s = Alpine.store("archive");
        s.saved = v.saved;
        s.notes = v.notes;
      }
    });
  },
  open(kind, id) {
    opener = document.activeElement;
    this.current = works.find((w) => w.id === id) || works[0];
    this.draft = Alpine.store("archive").notes[this.current.id] || "";
    this.zoom = 1;
    this.modal = kind;
    this.$nextTick(() => {
      const d = document.getElementById("global-dialog");
      d.showModal();
      (d.querySelector("[autofocus]") || d.querySelector("button"))?.focus();
    });
  },
  close() {
    document.getElementById("global-dialog").close();
    this.modal = null;
    if (opener?.isConnected) opener.focus();
    else document.querySelector("main")?.focus();
  },
  trap(event) {
    if (event.key !== "Tab") return;
    const nodes = [
        ...document
          .getElementById("global-dialog")
          .querySelectorAll(
            'button,input,textarea,select,a[href],[tabindex]:not([tabindex="-1"])',
          ),
      ].filter((e) => e.getClientRects().length && !e.disabled),
      first = nodes[0],
      last = nodes.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  },
  saveNote() {
    const s = Alpine.store("archive");
    s.notes = {
      ...s.notes,
      [this.current.id]: this.draft.trim().slice(0, 1500),
    };
    if (!s.has(this.current.id)) s.saved = [...s.saved, this.current.id];
    const success = s.persist();
    this.close();
    if (success)
      s.notify(
        this.draft.trim()
          ? "Nota guardada junto à obra."
          : "Nota removida. A obra continua na seleção.",
      );
  },
  clearLibrary() {
    const s = Alpine.store("archive");
    s.saved = [];
    s.notes = {};
    const success = s.persist();
    this.close();
    if (success) s.notify("Sua seleção e suas notas foram limpas.");
  },
  printSelection() {
    window.print();
  },
}));
Alpine.data("gallery", () => ({
  query: "",
  theme: "Todos",
  technique: "Todas",
  artist: "Todos",
  sort: "curadoria",
  layout: "salon",
  filters: false,
  init() {
    const p = new URLSearchParams(location.search);
    this.query = p.get("q") || "";
    if (["Todos", "Natureza", "Retratos", "Cotidiano"].includes(p.get("tema")))
      this.theme = p.get("tema");
    for (const key of ["query", "theme", "technique", "artist", "sort"])
      this.$watch(key, () => {
        this.reorder();
        const next = new URLSearchParams();
        if (this.query) next.set("q", this.query);
        if (this.theme !== "Todos") next.set("tema", this.theme);
        history.replaceState(
          null,
          "",
          location.pathname + (next.size ? "?" + next.toString() : ""),
        );
      });
  },
  get results() {
    return sortWorks(
      filterWorks(works, {
        query: this.query,
        theme: this.theme,
        technique: this.technique,
        artist: this.artist,
      }),
      this.sort,
    );
  },
  matches(id) {
    return this.results.some((w) => w.id === id);
  },
  reorder() {
    this.$nextTick(() => {
      const list = this.$refs.wall;
      if (!list) return;
      const ordered = sortWorks(works, this.sort);
      for (const w of ordered) {
        const item = list.querySelector(`[data-work="${w.id}"]`);
        if (item) list.append(item);
      }
    });
  },
  clear() {
    this.query = "";
    this.theme = "Todos";
    this.technique = "Todas";
    this.artist = "Todos";
    this.sort = "curadoria";
  },
}));
Alpine.data("comparison", () => ({
  pair: pairFromSearch(location.search, ids),
  get selected() {
    return this.pair.map((id) => works.find((w) => w.id === id));
  },
  left: "",
  right: "",
  error: "",
  init() {
    this.left = this.pair[0] || works[0].id;
    this.right = this.pair[1] || works[1].id;
  },
  apply() {
    if (this.left === this.right) {
      this.error = "Escolha duas obras diferentes para comparar.";
      return;
    }
    this.error = "";
    this.pair = [this.left, this.right];
    history.replaceState(null, "", `?a=${this.left}&b=${this.right}`);
  },
}));
Alpine.data("reader", () => ({
  size: 1,
  progress: 0,
  init() {
    const update = () => {
      const article = this.$el,
        rect = article.getBoundingClientRect(),
        total = Math.max(1, article.offsetHeight - innerHeight);
      this.progress = Math.max(0, Math.min(100, (-rect.top / total) * 100));
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  },
}));
window.Alpine = Alpine;
Alpine.start();

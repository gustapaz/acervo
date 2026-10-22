import fs from "node:fs/promises";
import sharp from "sharp";
import crypto from "node:crypto";
const sources = JSON.parse(await fs.readFile("docs/sources.json", "utf8"));
await fs.mkdir("src/static/images", { recursive: true });
for (const s of sources) {
  let original;
  try {
    original = await fs.readFile(`docs/original-${s.id}.jpg`);
  } catch {
    const response = await fetch(s.image);
    if (!response.ok) throw new Error(`Image ${s.id}: ${response.status}`);
    original = Buffer.from(await response.arrayBuffer());
  }
  for (const size of [640, 1600]) {
    const result = await sharp(original)
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: size === 640 ? 78 : 85 })
      .toBuffer();
    await fs.writeFile(`src/static/images/${s.id}-${size}.webp`, result);
  }
  s.sha256Original = crypto.createHash("sha256").update(original).digest("hex");
  console.log(s.id, s.title);
}
await fs.writeFile(
  "docs/sources.json",
  JSON.stringify(sources, null, 2) + "\n",
);
const canvas = sharp({
  create: { width: 1200, height: 630, channels: 3, background: "#f8f6ef" },
});
const artwork = await sharp("src/static/images/136510-1600.webp")
  .resize(650, 350, { fit: "cover" })
  .toBuffer();
const text = Buffer.from(
  `<svg width="1200" height="630"><text x="65" y="160" font-family="Georgia" font-size="110" fill="#2e352b">acervo.</text><text x="65" y="220" font-family="Arial" font-size="22" fill="#64685e">UM LUGAR PARA DEMORAR O OLHAR.</text><text x="65" y="560" font-family="Arial" font-size="18" fill="#64685e">GALERIA DIGITAL · COLEÇÃO ABERTA</text></svg>`,
);
await canvas
  .composite([{ input: artwork, left: 485, top: 250 }, { input: text }])
  .png()
  .toFile("src/static/social.png");

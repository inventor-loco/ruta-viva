import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(projectRoot, "dist");
const standaloneDir = join(projectRoot, "standalone");

const reactIndex = join(distDir, "index.html");
const reactFallback = join(distDir, "index-react.html");
const landing = join(standaloneDir, "index.html");
const deck = join(standaloneDir, "presentacion.html");
const tokens = join(standaloneDir, "tokens.css");
const uploads = join(standaloneDir, "uploads");

for (const file of [reactIndex, landing, deck, tokens]) {
  if (!existsSync(file)) {
    throw new Error(`Missing required build input: ${file}`);
  }
}

copyFileSync(reactIndex, reactFallback);
copyFileSync(landing, join(distDir, "index.html"));
copyFileSync(deck, join(distDir, "presentacion.html"));
copyFileSync(tokens, join(distDir, "tokens.css"));

mkdirSync(join(distDir, "app"), { recursive: true });
mkdirSync(join(distDir, "presentacion"), { recursive: true });
copyFileSync(reactFallback, join(distDir, "app", "index.html"));
copyFileSync(deck, join(distDir, "presentacion", "index.html"));

if (existsSync(uploads)) {
  cpSync(uploads, join(distDir, "uploads"), { recursive: true });
}

console.log("Standalone landing/deck prepared; React app preserved at index-react.html and /app.");

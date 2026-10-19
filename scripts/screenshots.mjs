// Generates the README screenshots straight from the theme files.
//
// The code is highlighted with Shiki (same TextMate grammars as VS Code) and
// rendered in Chrome, which saves the PNGs in images/. Run `npm run screenshots`.
// Requires Google Chrome. Set CHROME_PATH if it isn't in the default location.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHighlighter } from "shiki";
import puppeteer from "puppeteer-core";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME_PATH =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// One screenshot per language, in the main theme.
const GALLERY = [
  { file: "examples/typescript/demo.ts", lang: "typescript", out: "images/typescript-example.png" },
  { file: "examples/react/Dashboard.tsx", lang: "tsx", out: "images/react-example.png" },
  { file: "examples/python/analysis.py", lang: "python", out: "images/python-example.png" },
  { file: "examples/go/server.go", lang: "go", out: "images/go-example.png" },
  { file: "examples/rust/main.rs", lang: "rust", out: "images/rust-example.png" },
  { file: "examples/java/Greenhouse.java", lang: "java", out: "images/java-example.png" },
  { file: "examples/php/Nursery.php", lang: "php", out: "images/php-example.png" },
  { file: "examples/sql/queries.sql", lang: "sql", out: "images/sql-example.png" },
  { file: "examples/shell/deploy.sh", lang: "shellscript", out: "images/sh-example.png" },
];

// One screenshot per variant, all with the same snippet.
const VARIANTS = [
  { theme: "verdula", out: "images/variants/verdula.png" },
  { theme: "verdula-black", out: "images/variants/verdula-black.png" },
  { theme: "verdula-gray", out: "images/variants/verdula-gray.png" },
  { theme: "verdula-purple", out: "images/variants/verdula-purple.png" },
  { theme: "verdula-burgundy", out: "images/variants/verdula-burgundy.png" },
  { theme: "verdula-ocean", out: "images/variants/verdula-ocean.png" },
  { theme: "verdula-light", out: "images/variants/verdula-light.png" },
];
const VARIANT_SNIPPET = { file: "examples/typescript/demo.ts", lang: "typescript", lines: 30 };

const BACKDROP = "#A9B5C1";
const FONT_DIR = path.join(ROOT, "node_modules/@fontsource/jetbrains-mono/files");

function loadTheme(id) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "themes", `${id}-color-theme.json`), "utf8"));
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderLines(highlighter, code, lang, theme) {
  const { tokens } = highlighter.codeToTokens(code, { lang, theme: theme.name });
  return tokens.map((line) =>
    line
      .map(({ content, color, fontStyle = 0 }) => {
        const style = [
          color && `color:${color}`,
          fontStyle & 1 && "font-style:italic",
          fontStyle & 2 && "font-weight:700",
          fontStyle & 4 && "text-decoration:underline",
          fontStyle & 8 && "text-decoration:line-through",
        ].filter(Boolean);
        return `<span style="${style.join(";")}">${escapeHtml(content)}</span>`;
      })
      .join("")
  );
}

function fontFace(style, weight) {
  const file = path.join(FONT_DIR, `jetbrains-mono-latin-${weight}-${style}.woff2`);
  const data = fs.readFileSync(file).toString("base64");
  return `@font-face { font-family: "JetBrains Mono"; font-style: ${style}; font-weight: ${weight};
    src: url("data:font/woff2;base64,${data}") format("woff2"); }`;
}

function renderPage(lines, theme, title) {
  const c = theme.colors;
  const rows = lines
    .map((html, i) => `<div class="row"><span class="ln">${i + 1}</span><span class="code">${html || " "}</span></div>`)
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${fontFace("normal", 400)} ${fontFace("italic", 400)} ${fontFace("normal", 700)} ${fontFace("italic", 700)}
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${BACKDROP}; }
    #frame { display: inline-block; padding: 39px; background: ${BACKDROP}; }
    .window { background: ${c["editor.background"]}; color: ${c["editor.foreground"]}; border-radius: 6px;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35); padding: 0 26px 22px 18px; }
    .header { position: relative; height: 54px; display: flex; align-items: center; gap: 10px; padding-left: 0; }
    .dot { width: 14px; height: 14px; border-radius: 50%; }
    .title { position: absolute; left: 0; right: 0; text-align: center; font: 600 13px/1 -apple-system, "Helvetica Neue", sans-serif;
      color: ${c["descriptionForeground"]}; pointer-events: none; }
    .lines { font-family: "JetBrains Mono", monospace; font-size: 14px; line-height: 18px; white-space: pre; tab-size: 4; }
    .row { display: flex; }
    .ln { width: 3ch; margin-right: 2.5ch; text-align: right; color: ${c["editorLineNumber.foreground"]}; flex: none; }
  </style></head><body><div id="frame"><div class="window">
    <div class="header">
      <span class="dot" style="background:#FF5F57"></span>
      <span class="dot" style="background:#FEBC2E"></span>
      <span class="dot" style="background:#28C840"></span>
      ${title ? `<span class="title">${escapeHtml(title)}</span>` : ""}
    </div>
    <div class="lines">${rows}</div>
  </div></div></body></html>`;
}

async function capture(browser, html, out) {
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 800, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(path.join(ROOT, out)), { recursive: true });
  await (await page.$("#frame")).screenshot({ path: path.join(ROOT, out) });
  await page.close();
  console.log(`✓ ${out}`);
}

const themeIds = VARIANTS.map((v) => v.theme);
const themes = Object.fromEntries(themeIds.map((id) => [id, loadTheme(id)]));
const highlighter = await createHighlighter({
  themes: Object.values(themes),
  langs: [...new Set([...GALLERY.map((g) => g.lang), VARIANT_SNIPPET.lang])],
});

const browser = await puppeteer.launch({ executablePath: CHROME_PATH });

try {
  for (const { file, lang, out } of GALLERY) {
    const code = fs.readFileSync(path.join(ROOT, file), "utf8");
    const lines = renderLines(highlighter, code, lang, themes.verdula);
    await capture(browser, renderPage(lines, themes.verdula), out);
  }

  const snippet = fs
    .readFileSync(path.join(ROOT, VARIANT_SNIPPET.file), "utf8")
    .split("\n")
    .slice(0, VARIANT_SNIPPET.lines)
    .join("\n")
    .trimEnd();
  for (const { theme, out } of VARIANTS) {
    const lines = renderLines(highlighter, snippet, VARIANT_SNIPPET.lang, themes[theme]);
    await capture(browser, renderPage(lines, themes[theme], themes[theme].name), out);
  }
} finally {
  await browser.close();
}

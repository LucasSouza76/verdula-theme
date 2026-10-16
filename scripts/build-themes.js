// Generates the Verdula variants from the main (green) theme.
//
// themes/verdula-color-theme.json is the source. Edit only that file and run
// `npm run build` to update the variants. Each variant swaps the background
// colors and neutral tones (text, borders, comments) for the ones in its `map`
// table. In the dark variants, accent and syntax colors stay the same. In the
// light variant, they are darkened (same hue) so they have contrast on white.

const fs = require("fs");
const path = require("path");

const THEMES_DIR = path.join(__dirname, "..", "themes");
const SOURCE = path.join(THEMES_DIR, "verdula-color-theme.json");

// Colors from the green theme that are not part of the background: unchanged in the dark variants.
const ACCENTS = [
  "#5BD98C", "#7FE6A6", "#4CC9A6", "#B5DD6E", "#E3809B", "#E5B567", "#A79BE3",
  "#E8925F", "#EF6F6C", "#8FA8E8", "#F59A97", "#D2EE98", "#C2B8F0", "#F0A3B8",
  "#7FE3C4", "#FFFFFF", "#000000", "#0F3329", "#3A1418", "#3A2A12",
];

const VARIANTS = [
  {
    file: "verdula-black-color-theme.json",
    name: "Verdula Black",
    type: "dark",
    map: {
      "#06100B": "#000000", // darkest background (title, activity and status bars)
      "#0A1711": "#060606", // sidebar, panel, widgets
      "#0D1D15": "#0B0B0B", // editor
      "#143024": "#1D1D1D", // current line, hover
      "#18352A": "#222222", // indent guides
      "#1C4030": "#2D2D2D", // borders, selected item
      "#245038": "#3C3C3C", // selection
      "#2A5A43": "#464646", // scrollbar, whitespace
      "#356D52": "#5A5A5A", // active indent guide
      "#4A7A62": "#6E6E6E", // line numbers
      "#6A9A80": "#8D8D8D", // comments
      "#9DBBAA": "#B2B2B2", // secondary text
      "#EDF5F0": "#F3F3F3", // text
    },
  },
  {
    file: "verdula-gray-color-theme.json",
    name: "Verdula Gray",
    type: "dark",
    map: {
      "#06100B": "#131415",
      "#0A1711": "#191A1B",
      "#0D1D15": "#1E1F20",
      "#143024": "#2D2F31",
      "#18352A": "#323336",
      "#1C4030": "#3A3C3F",
      "#245038": "#47494D",
      "#2A5A43": "#4F5256",
      "#356D52": "#5F6267",
      "#4A7A62": "#6B6E73",
      "#6A9A80": "#8B8E92",
      "#9DBBAA": "#B1B3B6",
      "#EDF5F0": "#F2F3F3",
    },
  },
  {
    file: "verdula-purple-color-theme.json",
    name: "Verdula Purple",
    type: "dark",
    map: {
      "#06100B": "#0E0C14",
      "#0A1711": "#14121C",
      "#0D1D15": "#1A1724",
      "#143024": "#2B263B",
      "#18352A": "#302B40",
      "#1C4030": "#39334E",
      "#245038": "#483F63",
      "#2A5A43": "#51486E",
      "#356D52": "#635884",
      "#4A7A62": "#6F6A81",
      "#6A9A80": "#8F8AA1",
      "#9DBBAA": "#B3B0C0",
      "#EDF5F0": "#F3F2F6",
    },
  },
  {
    file: "verdula-light-color-theme.json",
    name: "Verdula Light",
    type: "light",
    map: {
      // Backgrounds and neutrals
      "#06100B": "#EBEBEB",
      "#0A1711": "#F3F3F3",
      "#0D1D15": "#FFFFFF",
      "#143024": "#E5E5E5",
      "#18352A": "#E0E0E0",
      "#1C4030": "#D6D6D6",
      "#245038": "#CCE8D5",
      "#2A5A43": "#C2C2C2",
      "#356D52": "#A8A8A8",
      "#4A7A62": "#8F8F8F",
      "#6A9A80": "#6E6E6E",
      "#9DBBAA": "#555555",
      "#EDF5F0": "#1F1F1F",
      "#FFFFFF": "#0A0A0A",
      "#000000": "#000000",
      "#0F3329": "#DDF3EC",
      "#3A1418": "#FBE4E4",
      "#3A2A12": "#FBEBDD",
      // Accents and syntax: same hue, darker (contrast ≥ 5:1 on white)
      "#5BD98C": "#008136",
      "#7FE6A6": "#007F43",
      "#4CC9A6": "#007F5E",
      "#B5DD6E": "#567A00",
      "#E3809B": "#AF4D6B",
      "#E5B567": "#956600",
      "#A79BE3": "#7365AC",
      "#E8925F": "#AD581D",
      "#EF6F6C": "#C34042",
      "#8FA8E8": "#556CAB",
      "#F59A97": "#AC5453",
      "#D2EE98": "#60781A",
      "#C2B8F0": "#72679C",
      "#F0A3B8": "#A2596F",
      "#7FE3C4": "#007D61",
    },
    // Keys where a direct color swap doesn't work on a light background.
    overrides: {
      "widget.shadow": "#00000029",
      "scrollbar.shadow": "#00000029",
      "button.foreground": "#FFFFFF",
      "button.hoverBackground": "#006B2C",
      "badge.foreground": "#FFFFFF",
      "activityBarBadge.foreground": "#FFFFFF",
      "keybindingLabel.bottomBorder": "#C2C2C2",
      "editor.lineHighlightBackground": "#F2F2F2",
      "statusBar.debuggingForeground": "#FFFFFF",
      "statusBarItem.remoteForeground": "#FFFFFF",
      "statusBarItem.prominentForeground": "#FFFFFF",
      "statusBarItem.errorForeground": "#FFFFFF",
      "terminal.ansiBlack": "#1F1F1F",
      "terminal.ansiWhite": "#555555",
      "terminal.ansiBrightBlack": "#6E6E6E",
      "terminal.ansiBrightWhite": "#8A8A8A",
    },
  },
];

const HEX = /#([0-9a-f]{6})([0-9a-f]{2})?\b/gi;

function build(source, variant) {
  const unmapped = new Set();

  let text = source.replace(HEX, (match, rgb, alpha = "") => {
    const color = "#" + rgb.toUpperCase();
    if (color in variant.map) return variant.map[color] + alpha.toUpperCase();
    if (!ACCENTS.includes(color) || variant.type === "light") unmapped.add(color);
    return match;
  });

  text = setValue(text, "name", variant.name);
  text = setValue(text, "type", variant.type);
  for (const [key, value] of Object.entries(variant.overrides || {})) {
    text = setValue(text, key, value);
  }

  JSON.parse(text);
  return { text, unmapped };
}

// Replaces a key's value while keeping the file's original formatting.
function setValue(text, key, value) {
  const pattern = new RegExp(`("${key.replace(/\./g, "\\.")}":\\s*)"[^"]*"`);
  if (!pattern.test(text)) throw new Error(`Key not found: ${key}`);
  return text.replace(pattern, `$1"${value}"`);
}

const source = fs.readFileSync(SOURCE, "utf8");
let warnings = 0;

for (const variant of VARIANTS) {
  const { text, unmapped } = build(source, variant);
  fs.writeFileSync(path.join(THEMES_DIR, variant.file), text);
  console.log(`✓ ${variant.name} → themes/${variant.file}`);
  for (const color of unmapped) {
    console.warn(`  ! ${color} has no color defined in "${variant.name}"`);
    warnings++;
  }
}

if (warnings) process.exitCode = 1;

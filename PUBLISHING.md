# Development and publishing

## Testing changes

1. Open this folder in VS Code and press `F5` (**Test the theme** configuration).
2. In the "[Extension Development Host]" window, pick the **Verdula** theme.
3. Edit `themes/verdula-color-theme.json` and save. Changes show up right away.

Use **Developer: Inspect Editor Tokens and Scopes** to find out which scope controls the color of a piece of code.

## Variants (Black, Gray, Purple, Light)

The variants are generated from `themes/verdula-color-theme.json`. Don't edit the other files in `themes/` by hand.

1. Edit the green theme.
2. Run `npm run build`. The `scripts/build-themes.js` script regenerates the variants.
3. To change a variant's background, edit its `map` table in the script.

If you use a new background or text color in the green theme, the script tells you which variant still has no matching color.

## Taking screenshots

Run `npm run screenshots` (requires Google Chrome). The `scripts/screenshots.mjs` script highlights the files in `examples/` with the theme files and saves:

- `images/<language>-example.png`: one image per language, in the main theme.
- `images/variants/<theme>.png`: the same snippet in each variant.

To add a language, add an entry to the `GALLERY` list in the script and the image to the gallery in `README.md`. Set `CHROME_PATH` if Chrome is not in the default location.

The images are rendered with Shiki, which uses the same grammars as VS Code but not semantic highlighting, so a few identifiers may look slightly different from the editor. To take a real VS Code screenshot instead, choose **Take screenshots (no other extensions)** in **Run and Debug** and press `F5`.

The README images use absolute links (`https://raw.githubusercontent.com/LucasSouza76/verdula-theme/main/images/...`), so they must be on GitHub before you publish the new version.

## Publishing to the Marketplace

1. Create the publisher at https://marketplace.visualstudio.com/manage (sign in with a Microsoft account).
   The publisher **ID** must match the `"publisher"` field in `package.json`.
2. Push the code to GitHub (`https://github.com/LucasSouza76/verdula-theme`). The Marketplace loads the README images from there.
3. Build the package:
   ```bash
   npx @vscode/vsce package
   ```
4. At https://marketplace.visualstudio.com/manage, click **New extension → Visual Studio Code** and upload the `.vsix` file.
5. Wait for verification (a few minutes). The theme then shows up in the VS Code extension search.

## Publishing a new version

1. Bump `"version"` in `package.json` (e.g. `0.0.4`) and write down the changes in `CHANGELOG.md`.
2. Run `npm run build` and then `npx @vscode/vsce package`.
3. In the Marketplace dashboard, click the `...` next to the extension → **Update** and upload the new `.vsix`.

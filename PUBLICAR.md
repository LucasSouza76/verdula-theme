# Desenvolvimento e publicação

## Testar alterações

1. Abra esta pasta no VS Code e pressione `F5` (configuração **Testar o tema**).
2. Na janela "[Extension Development Host]", escolha o tema **Verdula**.
3. Edite `themes/verdula-color-theme.json` e salve. As mudanças aparecem na hora.

Use **Developer: Inspect Editor Tokens and Scopes** para descobrir qual escopo controla a cor de um trecho de código.

## Tirar os prints

1. Em **Run and Debug**, escolha **Tirar prints (sem outras extensões)** e pressione `F5`. Assim a barra de status fica limpa, sem ícones de outras extensões.
2. Abra um arquivo de `exemplos/` e tire o print.
3. Salve em `images/` com o nome `<linguagem>-example.png` (ex.: `go-example.png`) e adicione a imagem na galeria do `README.md`.

As imagens do README usam links absolutos (`https://raw.githubusercontent.com/LucasSouza76/verdula-theme/main/images/...`), então precisam estar no GitHub antes de publicar a nova versão.

## Publicar no Marketplace

1. Crie o publisher em https://marketplace.visualstudio.com/manage (login com conta Microsoft).
   O **ID** do publisher precisa ser igual ao campo `"publisher"` do `package.json`.
2. Suba o código para o GitHub (`https://github.com/LucasSouza76/verdula-theme`). O Marketplace busca as imagens do README lá.
3. Gere o pacote:
   ```bash
   npx @vscode/vsce package
   ```
4. Em https://marketplace.visualstudio.com/manage, clique em **New extension → Visual Studio Code** e envie o arquivo `.vsix`.
5. Aguarde a verificação (alguns minutos). Depois o tema aparece na busca de extensões do VS Code.

## Publicar uma nova versão

1. Aumente o `"version"` no `package.json` (ex.: `0.0.3`) e anote as mudanças no `CHANGELOG.md`.
2. Rode `npx @vscode/vsce package` de novo.
3. No painel do Marketplace, clique nos `...` da extensão → **Update** e envie o novo `.vsix`.

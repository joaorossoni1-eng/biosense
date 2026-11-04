# Como trocar os bonecos provisórios pelos modelos do Blender (MA3D)

O protótipo já funciona com dois bonecos provisórios feitos no código: **menino** e **menina** (a criança escolhe no canto da tela). Quando os modelos do Blender ficarem prontos, exporte cada um com as regras abaixo e salve como:

- `public/modelos/boneco-menino.glb`
- `public/modelos/boneco-menina.glb`

O app carrega cada GLB automaticamente quando ele existe; se faltar algum, continua usando o provisório daquele tipo. Dá para entregar um de cada vez.

As regras valem para os dois modelos.

## Regras do modelo

1. **Cada região é um objeto separado**, com exatamente estes nomes:

   | Objeto no Blender | Região |
   |---|---|
   | `regiao_cabeca` | Cabeça (olhos e boca podem ser filhos dela) |
   | `regiao_garganta` | Garganta / pescoço |
   | `regiao_peito` | Peito |
   | `regiao_barriga` | Barriga |
   | `regiao_bracos` | Os dois braços (um objeto, ou um vazio com os dois braços como filhos) |
   | `regiao_maos` | As duas mãos |
   | `regiao_pernas` | As duas pernas |
   | `regiao_pes` | Os dois pés |

   Objetos dentro de uma região (filhos) contam como parte dela.

   **Detalhes que não mudam de cor** (olhos, cabelo, boca, sobrancelhas, bochechas): coloque como filhos da região e dê um nome começando com `fixo_` (ex.: `fixo_olho_esq`, `fixo_cabelo`). Assim só a pele e a roupa acendem quando a criança toca.

2. **Material:** cores lisas (Principled BSDF), *roughness* alto (~0,7), sem metal e sem textura brilhante. Cada peça pode ter sua cor (pele, camiseta, bermuda, tênis); o app pinta a região tocada e depois volta para a cor original de cada peça. **Evite** verde, amarelo, coral e lavanda nas roupas: são as cores da escala e da seleção.
3. **Posição:** boneco de pé, de frente para a vista frontal do Blender (tecla `1` do teclado numérico, ou seja, olhando para −Y). O app ajusta a altura e põe os pés no chão sozinho. Aplique escala e rotação (`Ctrl+A → All Transforms`) antes de exportar.
4. **Leve:** até ~30 mil triângulos no total. Use *Decimate* se precisar.
5. **Animações (opcional na V1):** ações curtas e lentas (respirar, tremer de frio devagar). Nada brusco ou piscante.

## Ponto de partida

`public/modelos/boneco-provisorio-menino.glb` e `boneco-provisorio-menina.glb` são os bonecos atuais do app, já com as regiões e os detalhes `fixo_` nomeados. Importe no Blender (`File → Import → glTF 2.0`) e use como referência de proporção ou como base para esculpir o modelo final.

## Exportação

`File → Export → glTF 2.0 (.glb)`

- Format: **glTF Binary (.glb)**
- Include: **Selected Objects** desmarcado (exporta a cena), **Custom Properties** opcional
- Transform: **+Y Up** marcado
- Geometry: **Apply Modifiers** marcado; Compression (Draco) pode ficar marcado
- Salve como `public/modelos/boneco-menino.glb` ou `public/modelos/boneco-menina.glb`

## Conferindo

Rode `npm run dev`, abra o navegador e veja o console (F12). Deve aparecer `[BioSense] modelo boneco-menino.glb carregado` (ou `menina`), ao escolher aquele boneco. Se faltar alguma região, o console avisa qual.

# Guia de identidade visual — BioSense

## Logo

| Arquivo | Quando usar |
|---|---|
| `assets/identidade/biosense-logo.svg` | Versão principal, sobre fundos claros (Areia ou branco) |
| `assets/identidade/biosense-logo-negativo.svg` | Sobre fundos escuros (Tinta ou Azul Calma) |
| `assets/identidade/biosense-logo-mono.svg` | Impressão em uma cor, carimbo, materiais P&B |
| `assets/identidade/biosense-simbolo.svg` | Ícone do app (PWA), favicon, avatar e espaços pequenos |

Os arquivos `.png` de mesmo nome servem para slides e documentos que não aceitam SVG. O texto do logo está convertido em curvas, então ele aparece igual em qualquer computador, mesmo sem as fontes instaladas.

**Conceito:** o boneco é o próprio produto. O ponto na barriga marca *onde* algo é sentido; as três ondas, que crescem e passam de verde para amarelo e coral, são os três níveis da escala: *pouco, médio, muito*.

**Regras:**
- Área de respiro mínima ao redor do logo: a altura da cabeça do boneco.
- Largura mínima: 120 px (logo completo) e 24 px (símbolo).
- Não distorcer, não girar, não trocar as cores das ondas, não aplicar sombra ou brilho.

## Cores

| Nome | HEX | RGB | Uso |
|---|---|---|---|
| Azul Calma | `#2E4A8C` | 46, 74, 140 | Primária: títulos, botões, contorno do boneco |
| Lavanda | `#6C5FB5` | 108, 95, 181 | Destaque, estado de foco, links |
| Sálvia | `#5E9C82` | 94, 156, 130 | Apoio em ilustrações (não usar em texto pequeno) |
| Tinta | `#1F2A44` | 31, 42, 68 | Texto |
| Areia | `#F7F3EC` | 247, 243, 236 | Fundo padrão |
| Pouco | `#8CC7A6` | 140, 199, 166 | Escala nível 1 |
| Médio | `#F0BE5E` | 240, 190, 94 | Escala nível 2 |
| Muito | `#D9694F` | 217, 105, 79 | Escala nível 3 |

Tokens para o código (Checkpoint 2):

```css
:root {
  --bs-azul: #2E4A8C;
  --bs-lavanda: #6C5FB5;
  --bs-salvia: #5E9C82;
  --bs-tinta: #1F2A44;
  --bs-areia: #F7F3EC;
  --bs-pouco: #8CC7A6;
  --bs-medio: #F0BE5E;
  --bs-muito: #D9694F;
  --bs-fonte-titulo: "Lexend", system-ui, sans-serif;
  --bs-fonte-texto: "Atkinson Hyperlegible", system-ui, sans-serif;
}
```

**Regra da escala:** a intensidade nunca é mostrada só pela cor. Sempre aparece junto com o número de bolinhas (●○○ · ●●○ · ●●●), o tamanho do indicador e o áudio ("pouco", "médio", "muito").

**Regra sensorial:** nada de vermelho puro piscando, gradientes chamativos ou neon. O coral do nível "muito" é firme, mas não alarmante.

## Tipografia

| Papel | Fonte | Peso | Tamanho mínimo |
|---|---|---|---|
| Logo e títulos | Lexend | SemiBold (600) | 28 px |
| Botões e rótulos | Atkinson Hyperlegible | Bold (700) | 20 px |
| Textos | Atkinson Hyperlegible | Regular (400) | 18 px |

As duas fontes estão no Google Fonts sob licença SIL Open Font License. No app, os arquivos das fontes serão incluídos no próprio projeto, para funcionar offline.

## Linguagem

- Frases curtas, na primeira pessoa da criança: "Eu sinto…", "Onde você sente?"
- Uma instrução por tela.
- Nada de texto todo em maiúsculas nas telas das crianças.
- Erro não existe: qualquer escolha pode ser trocada com o botão "Voltar".

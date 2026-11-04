# Ficha técnica — BioSense: O que eu sinto?

| | |
|---|---|
| **Produto** | BioSense: O que eu sinto? — sentidos e interocepção |
| **Tipo** | Aplicação web 3D instalável (PWA), com uso offline |
| **Versão** | V1 (Checkpoint 2) · V2 prevista para 27/11/2026 |
| **Endereço** | https://joaorossoni1-eng.github.io/biosense/ |
| **Código-fonte** | https://github.com/joaorossoni1-eng/biosense |
| **Programa** | BioDesign Inclusivo · Compartilhe Docência Level Up · FMU Tech Inovação 2026.2 |
| **Instituição** | Centro Universitário FMU |
| **ODS** | 3 (Saúde e Bem-Estar) e 4 (Educação de Qualidade) |
| **Instituição parceira** | _a definir_ |

## Créditos

### Estudantes

| Nome | RA | Papel |
|---|---|---|
| Jessica Caporal | _preencher_ | Curadoria científica e bases de dados |
| Lara Falcão | _preencher_ | Conteúdo, linguagem e glossário |
| Fernanda Goveia | _preencher_ | Acessibilidade e testes |
| Yan Dias | 2025112818 | Modelagem 3D e animação |
| João Rossoni | 2025112836 | Desenvolvimento, integração e identidade visual |

### Docentes

- **Prof.ª Dra. Raphaela Pascarelli** — Processos Biológicos (orientação e validação científica)
- **Prof. Hercules Ramos** — Modelagem e Animação 3D | Inteligência Artificial

### Apoio

- Desenvolvimento com apoio de ferramenta de IA (Claude, da Anthropic) para código, documentação e identidade visual, sob direção e revisão da equipe.

## Tecnologias

| Componente | Tecnologia | Versão |
|---|---|---|
| Renderização 3D | Three.js | 0.170 |
| Build e servidor local | Vite | 6 |
| Linguagens | JavaScript (ES2022), HTML5, CSS3 | — |
| Voz | Web Speech API (voz do aparelho, pt-BR) | — |
| Uso offline | Service Worker + Web App Manifest | — |
| Modelos 3D | Formas geradas no código (V1); Blender → glTF/GLB (V2) | — |
| Publicação | GitHub Actions + GitHub Pages | — |

## Licenças dos recursos

| Recurso | Autoria | Licença |
|---|---|---|
| Código do BioSense | Equipe BioSense | _a definir com os docentes_ (sugestão: MIT, para permitir a doação e reuso) |
| Logo, paleta e pictogramas | Equipe BioSense (criação própria) | _a definir junto com o código_ (sugestão: CC BY 4.0) |
| Bonecos 3D provisórios (menino e menina) | Equipe BioSense (criação própria) | Idem |
| Textos do modo Descobrir | Equipe BioSense, com revisão da Prof.ª Raphaela | Idem |
| [Three.js](https://github.com/mrdoob/three.js) | three.js authors | MIT |
| [Vite](https://github.com/vitejs/vite) | Vite contributors | MIT |
| [Lexend](https://fonts.google.com/specimen/Lexend) | The Lexend Project Authors | SIL Open Font License 1.1 |
| [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) | Braille Institute of America | SIL Open Font License 1.1 |
| Voz | Sintetizador do próprio aparelho | Não é distribuída com o app |

**Não usados na V1:** pictogramas ARASAAC (CC BY-NC-SA). Se forem adotados na V2, incluir a atribuição exigida: *"Autor pictogramas: Sergio Palao. Origem: ARASAAC (http://www.arasaac.org). Licença: CC (BY-NC-SA). Propriedade: Governo de Aragão (Espanha)"*.

## Dados e fontes

| Fonte | Uso |
|---|---|
| IBGE — Censo Demográfico 2022: Pessoas com Deficiência e Pessoas Diagnosticadas com TEA | Dimensionamento do público |
| INEP — Censo Escolar 2024 | Demanda nas escolas |
| Nicholson et al. (2019); Palser et al. (2019), *Journal of Autism and Developmental Disorders* | Fundamentação sobre interocepção |

## Privacidade

Sem login, anúncios, chat ou coleta de dados. Nenhuma informação da criança é armazenada ou transmitida. Apenas preferências de interface (som, movimento, boneco) ficam no armazenamento local do aparelho.

## Requisitos de uso

Navegador moderno com WebGL. Internet apenas no primeiro acesso. Detalhes em [`manual-de-uso.md`](manual-de-uso.md).

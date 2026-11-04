# Como contribuir — equipe BioSense

A avaliação do FMU Tech Inovação confere se **todos os integrantes aparecem no histórico de commits**. Por isso, cada pessoa faz os próprios commits, com a própria conta do GitHub.

## Primeira vez

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver) e mande seu usuário para o grupo.
2. Quem criou o repositório adiciona todos em **Settings → Collaborators**.
3. Aceite o convite que chega por e-mail.
4. Configure seu nome e e-mail no Git, iguais aos da sua conta do GitHub:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "email-da-sua-conta@github"
```

> Se o e-mail do Git for diferente do da conta, o commit aparece sem o seu perfil e **não conta como participação**.

**Sem Git instalado?** Dá para editar direto pelo site: abra o arquivo, clique no lápis (✏️), faça a alteração e clique em **Commit changes**. O commit fica no seu nome do mesmo jeito.

## Padrão das mensagens de commit

```
tipo: o que foi feito
```

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `docs` | Textos e documentação | `docs: adiciona fontes do Censo Escolar 2024` |
| `design` | Logo, paleta, imagens | `design: exporta logo negativo em PNG` |
| `conteudo` | Textos do produto, glossário | `conteudo: revisa explicação da sede` |
| `3d` | Modelos e animações | `3d: separa malhas das 8 regiões` |
| `feat` | Funcionalidade nova no código | `feat: detecta toque nas regiões do boneco` |
| `fix` | Correção | `fix: corrige áudio repetido na escala` |

## Primeira contribuição de cada pessoa (Checkpoint 1)

Repositório: https://github.com/joaorossoni1-eng/biosense

| Integrante | Commit sugerido |
|---|---|
| Jessica | Completar a própria linha na tabela da equipe (README, seção 5) e revisar a seção 1 (problema e bases de dados) |
| Lara | Completar a própria linha e revisar `docs/conteudo-mvp.md` |
| Fernanda | Completar a própria linha e revisar a seção 4 do README (pitch e diferencial) |
| Yan | Completar a própria linha e revisar `docs/modelo-blender.md` |
| João Vitor | Estrutura inicial do repositório, identidade visual e protótipo |

**Como fazer pelo site:** abra o arquivo no GitHub → clique no lápis ✏️ → edite → **Commit changes**, com uma mensagem como `docs: adiciona RA e usuário da Lara`.

## Divisão sugerida para o Checkpoint 2

| Integrante | Commit |
|---|---|
| Yan | Modelos do Blender: `public/modelos/boneco-menino.glb` e `boneco-menina.glb` |
| João Vitor | Código do app: `index.html`, `src/`, `package.json`, `.github/workflows/` |
| Jessica | Revisão científica dos textos em `public/conteudo/sensacoes.json` |
| Lara | Narrações gravadas em `public/audio/` e ajuste das frases em `regioes.json` |
| Fernanda | Prints em `docs/prints/`, link do vídeo no README e relatório de testes |

**Dica:** quem não usa Git pode subir arquivos pelo site em **Add file → Upload files**, na pasta certa. Cada upload vira um commit no seu nome.

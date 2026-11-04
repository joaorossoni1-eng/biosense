# Conteúdo do MVP — rascunho para curadoria científica

> Documento de trabalho entre Processos Biológicos e MA3D. Os textos abaixo são **propostas iniciais** e serão revisados pela curadoria científica e pela Prof.ª Raphaela antes de entrarem no produto.

## 6 sensações

| ID | Sensação | Frase falada | Modo Descobrir (rascunho a validar) |
|---|---|---|---|
| `dor` | Dor | "Eu sinto dor" | A dor é um aviso do corpo: os nervos levam ao cérebro a mensagem de que algo precisa de cuidado. |
| `fome` | Fome | "Eu sinto fome" | Quando o estômago fica vazio e o corpo precisa de energia, o cérebro avisa que é hora de comer. |
| `sede` | Sede | "Eu sinto sede" | O corpo precisa de água para funcionar. Quando falta água, o cérebro avisa com a sede. |
| `enjoo` | Enjoo | "Eu sinto enjoo" | Enjoo é quando a barriga fica estranha, como se quisesse devolver a comida. Pode ser cansaço, movimento ou doença. |
| `frio` | Frio | "Eu sinto frio" | Com frio, o corpo treme para produzir calor e a pele fica arrepiada. |
| `calor` | Calor | "Eu sinto calor" | Com calor, o corpo sua: o suor ajuda a esfriar a pele. |

## 8 regiões do boneco

| ID (nome da malha no Blender) | Região | Frase |
|---|---|---|
| `regiao_cabeca` | Cabeça | "na cabeça" |
| `regiao_garganta` | Garganta | "na garganta" |
| `regiao_peito` | Peito | "no peito" |
| `regiao_barriga` | Barriga | "na barriga" |
| `regiao_bracos` | Braços | "nos braços" |
| `regiao_maos` | Mãos | "nas mãos" |
| `regiao_pernas` | Pernas | "nas pernas" |
| `regiao_pes` | Pés | "nos pés" |

Algumas sensações são do corpo todo (frio, calor, sede, enjoo). Para elas, o fluxo pode pular a pergunta "onde?" ou oferecer a opção "o corpo todo". **Ponto a decidir com a curadoria.**

## Escala de 3 níveis

| Nível | Palavra | Visual | Cor |
|---|---|---|---|
| 1 | Pouco | ●○○ indicador pequeno | `#8CC7A6` |
| 2 | Médio | ●●○ indicador médio | `#F0BE5E` |
| 3 | Muito | ●●● indicador grande | `#D9694F` |

## Formato do arquivo de conteúdo (Checkpoint 2)

```json
{
  "id": "dor",
  "nome": "Dor",
  "pictograma": "pictogramas/dor.png",
  "audio": "audio/dor.mp3",
  "frase": "Eu sinto dor",
  "corpoTodo": false,
  "descobrir": {
    "texto": "A dor é um aviso do corpo...",
    "audio": "audio/descobrir-dor.mp3",
    "revisadoPor": "Curadoria científica"
  }
}
```

## Glossário (a completar)

- **Interocepção:** sentido que percebe o que acontece dentro do corpo (fome, sede, dor, batimento do coração).
- **Pictograma:** desenho simples que representa uma palavra ou ideia.
- **CAA:** Comunicação Aumentativa e Alternativa, formas de comunicação além da fala.

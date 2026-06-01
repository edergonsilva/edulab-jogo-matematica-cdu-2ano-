# Jogo CDU - 2º ano

Jogo educacional para praticar **Centena, Dezena e Unidade (CDU)** com foco no **material dourado**:

- **Placa** = 1 centena = 100
- **Barra** = 1 dezena = 10
- **Cubo** = 1 unidade = 1

## O que o jogo inclui

- Tabela de resposta com cabeçalho **C, D e U**
- Questões em português com linguagem infantil
- 3 tipos de pergunta:
  - Representação com material dourado
  - Contas matemáticas com CDU
  - Probleminhas de interpretação
- Rodadas com ordem aleatória
- Cada rodada gera **30 questões novas** com valores diferentes
- Sem repetição de perguntas dentro de cada rodada
- Feedback de acerto/erro e avanço entre questões

## Como executar

Como é um jogo web estático, basta abrir `index.html` no navegador.

Opcionalmente, para rodar com servidor local:

```bash
# a partir da pasta do repositório clonado
python3 -m http.server 8000
```

Depois abra: `http://localhost:8000`

## Gerar pacote `.edugame`

O projeto inclui um empacotador em `scripts/package-edugame.sh`.
Os metadados do pacote ficam em `manifest.json` na raiz do repositório.

```bash
# gera em dist/cdu-matematica-2ano.edugame
./scripts/package-edugame.sh
```

Também é possível informar um arquivo de saída:

```bash
./scripts/package-edugame.sh dist/meu-jogo.edugame
```

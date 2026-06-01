const QUESTOES = [
  {
    tipo: "Material dourado",
    enunciado: "Observe os blocos e complete a tabela CDU.",
    representacao: { c: 1, d: 2, u: 3 },
    resposta: { c: 1, d: 2, u: 3 }
  },
  {
    tipo: "Material dourado",
    enunciado: "Observe os blocos e complete a tabela CDU.",
    representacao: { c: 2, d: 0, u: 5 },
    resposta: { c: 2, d: 0, u: 5 }
  },
  {
    tipo: "Material dourado",
    enunciado: "Observe os blocos e complete a tabela CDU.",
    representacao: { c: 3, d: 4, u: 1 },
    resposta: { c: 3, d: 4, u: 1 }
  },
  {
    tipo: "Material dourado",
    enunciado: "Observe os blocos e complete a tabela CDU.",
    representacao: { c: 0, d: 8, u: 6 },
    resposta: { c: 0, d: 8, u: 6 }
  },
  {
    tipo: "Conta",
    enunciado: "Resolva: 120 + 34. Depois preencha C, D e U.",
    resposta: { c: 1, d: 5, u: 4 }
  },
  {
    tipo: "Conta",
    enunciado: "Resolva: 243 - 21. Depois preencha C, D e U.",
    resposta: { c: 2, d: 2, u: 2 }
  },
  {
    tipo: "Conta",
    enunciado: "Resolva: 168 + 101. Depois preencha C, D e U.",
    resposta: { c: 2, d: 6, u: 9 }
  },
  {
    tipo: "Conta",
    enunciado: "Resolva: 305 + 44. Depois preencha C, D e U.",
    resposta: { c: 3, d: 4, u: 9 }
  },
  {
    tipo: "Interpretação",
    enunciado:
      "Ana juntou 2 placas de trânsito de brinquedo, 1 barra de adesivos e 7 cubinhos. Que número ela formou?",
    resposta: { c: 2, d: 1, u: 7 }
  },
  {
    tipo: "Interpretação",
    enunciado:
      "No cofrinho de Pedro há 1 moeda de 100, 5 moedas de 10 e 2 moedas de 1. Complete a tabela CDU.",
    resposta: { c: 1, d: 5, u: 2 }
  },
  {
    tipo: "Interpretação",
    enunciado:
      "A escola recebeu 3 caixas com 100 lápis, 2 pacotes com 10 e mais 4 lápis soltos. Qual o número total?",
    resposta: { c: 3, d: 2, u: 4 }
  },
  {
    tipo: "Interpretação",
    enunciado:
      "Em um jogo, Sofia ganhou 4 pontos de centena, 0 de dezena e 9 de unidade. Preencha C, D e U.",
    resposta: { c: 4, d: 0, u: 9 }
  }
];

let rodada = 1;
let pontuacao = 0;
let indiceQuestao = 0;
let questoesRodada = [];

const rodadaAtualEl = document.getElementById("rodadaAtual");
const questaoAtualEl = document.getElementById("questaoAtual");
const totalQuestoesEl = document.getElementById("totalQuestoes");
const pontuacaoEl = document.getElementById("pontuacao");
const tipoQuestaoEl = document.getElementById("tipoQuestao");
const tituloQuestaoEl = document.getElementById("tituloQuestao");
const textoQuestaoEl = document.getElementById("textoQuestao");
const materialEl = document.getElementById("materialDourado");
const inputC = document.getElementById("inputC");
const inputD = document.getElementById("inputD");
const inputU = document.getElementById("inputU");
const feedbackEl = document.getElementById("feedback");
const btnVerificar = document.getElementById("btnVerificar");
const btnProxima = document.getElementById("btnProxima");
const btnNovaRodada = document.getElementById("btnNovaRodada");

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function limparInputs() {
  inputC.value = "";
  inputD.value = "";
  inputU.value = "";
  inputC.focus();
}

function criarBlocos(classe, quantidade) {
  return Array.from({ length: quantidade }, () => `<span class="${classe}"></span>`).join("");
}

function renderMaterial(representacao) {
  materialEl.innerHTML = "";
  if (!representacao) {
    materialEl.innerHTML = "<p>Use o enunciado para descobrir C, D e U.</p>";
    return;
  }

  const blocos = [
    { nome: "Placas (C)", classe: "placa", qtd: representacao.c },
    { nome: "Barras (D)", classe: "barra", qtd: representacao.d },
    { nome: "Cubos (U)", classe: "cubo", qtd: representacao.u }
  ];

  blocos.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "linha-material";
    linha.innerHTML = `<span class="etiqueta-material">${item.nome}:</span>${criarBlocos(item.classe, item.qtd) || " <em>0</em>"}`;
    materialEl.appendChild(linha);
  });
}

function atualizarStatus(questao) {
  rodadaAtualEl.textContent = rodada;
  questaoAtualEl.textContent = indiceQuestao + 1;
  totalQuestoesEl.textContent = questoesRodada.length;
  pontuacaoEl.textContent = pontuacao;
  tipoQuestaoEl.textContent = questao.tipo;
}

function mostrarQuestao() {
  const questao = questoesRodada[indiceQuestao];
  atualizarStatus(questao);
  tituloQuestaoEl.textContent = `Questão ${indiceQuestao + 1}`;
  textoQuestaoEl.textContent = questao.enunciado;
  renderMaterial(questao.representacao);

  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  btnVerificar.disabled = false;
  btnProxima.disabled = true;
  limparInputs();
}

function respostasIguais(resposta, c, d, u) {
  return resposta.c === c && resposta.d === d && resposta.u === u;
}

function lerValor(input) {
  const numero = Number.parseInt(input.value, 10);
  return Number.isNaN(numero) ? -1 : numero;
}

function verificarResposta() {
  const questao = questoesRodada[indiceQuestao];
  const c = lerValor(inputC);
  const d = lerValor(inputD);
  const u = lerValor(inputU);

  if (c < 0 || d < 0 || u < 0) {
    feedbackEl.textContent = "Preencha as 3 colunas: C, D e U.";
    feedbackEl.className = "feedback erro";
    return;
  }

  if (respostasIguais(questao.resposta, c, d, u)) {
    pontuacao += 1;
    pontuacaoEl.textContent = pontuacao;
    feedbackEl.textContent = "Parabéns! Você acertou!";
    feedbackEl.className = "feedback acerto";
  } else {
    feedbackEl.textContent = `Quase! A resposta correta é C=${questao.resposta.c}, D=${questao.resposta.d}, U=${questao.resposta.u}.`;
    feedbackEl.className = "feedback erro";
  }

  btnVerificar.disabled = true;
  btnProxima.disabled = false;
}

function proximaQuestao() {
  indiceQuestao += 1;
  if (indiceQuestao >= questoesRodada.length) {
    finalizarRodada();
    return;
  }
  mostrarQuestao();
}

function finalizarRodada() {
  tipoQuestaoEl.textContent = "-";
  tituloQuestaoEl.textContent = "Fim da rodada!";
  textoQuestaoEl.textContent = `Você terminou a rodada ${rodada} com ${pontuacao} ponto(s). Clique em "Nova rodada" para jogar novamente com ordem aleatória.`;
  materialEl.innerHTML = "<p>Nova rodada = novas perguntas embaralhadas, sem repetição dentro da rodada.</p>";
  btnVerificar.disabled = true;
  btnProxima.disabled = true;
  btnNovaRodada.hidden = false;
}

function iniciarRodada() {
  questoesRodada = embaralhar(QUESTOES);
  indiceQuestao = 0;
  pontuacao = 0;
  pontuacaoEl.textContent = pontuacao;
  btnNovaRodada.hidden = true;
  mostrarQuestao();
}

btnVerificar.addEventListener("click", verificarResposta);
btnProxima.addEventListener("click", proximaQuestao);
btnNovaRodada.addEventListener("click", () => {
  rodada += 1;
  iniciarRodada();
});

iniciarRodada();

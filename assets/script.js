const TOTAL_QUESTOES_RODADA = 30;

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

function valorAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numeroParaCDU(numero) {
  return {
    c: Math.floor(numero / 100),
    d: Math.floor((numero % 100) / 10),
    u: numero % 10
  };
}

function criarQuestaoMaterial() {
  let c = valorAleatorio(0, 9);
  let d = valorAleatorio(0, 9);
  let u = valorAleatorio(0, 9);

  if (c === 0 && d === 0 && u === 0) {
    u = 1;
  }

  return {
    tipo: "Material dourado",
    enunciado: "Observe os blocos e complete a tabela CDU.",
    representacao: { c, d, u },
    resposta: { c, d, u }
  };
}

function criarQuestaoConta() {
  const usarSoma = Math.random() < 0.5;

  if (usarSoma) {
    let a = 0;
    let b = 0;
    let resultado = 1000;

    while (resultado > 999) {
      a = valorAleatorio(100, 850);
      b = valorAleatorio(10, 250);
      resultado = a + b;
    }

    return {
      tipo: "Conta",
      enunciado: `Resolva: ${a} + ${b}. Depois preencha C, D e U.`,
      resposta: numeroParaCDU(resultado)
    };
  }

  const a = valorAleatorio(200, 999);
  const b = valorAleatorio(10, a - 100);
  const resultado = a - b;

  return {
    tipo: "Conta",
    enunciado: `Resolva: ${a} - ${b}. Depois preencha C, D e U.`,
    resposta: numeroParaCDU(resultado)
  };
}

function criarQuestaoInterpretacao() {
  const c = valorAleatorio(0, 9);
  const d = valorAleatorio(0, 9);
  const u = valorAleatorio(0, 9);
  const total = c * 100 + d * 10 + u;

  const modelos = [
    `No cofrinho da Ana há ${c} moedas de 100, ${d} moedas de 10 e ${u} moedas de 1. Complete a tabela CDU.`,
    `A turma montou ${c} placas, ${d} barras e ${u} cubos de material dourado. Qual número foi formado?`,
    `Em um jogo, Pedro ganhou ${c} pontos de centena, ${d} de dezena e ${u} de unidade. Preencha C, D e U.`,
    `Uma caixa tem ${c} grupos de 100 figurinhas, ${d} grupos de 10 e ${u} figurinhas soltas. Qual número total?`,
    `A professora escreveu o número ${total} no quadro e pediu a decomposição em C, D e U. Complete a tabela.`
  ];

  return {
    tipo: "Interpretação",
    enunciado: modelos[valorAleatorio(0, modelos.length - 1)],
    resposta: { c, d, u }
  };
}

function assinaturaQuestao(questao) {
  return `${questao.tipo}|${questao.enunciado}|${questao.resposta.c}${questao.resposta.d}${questao.resposta.u}`;
}

function gerarQuestoesDaRodada(totalQuestoes) {
  const geradores = [criarQuestaoMaterial, criarQuestaoConta, criarQuestaoInterpretacao];
  const questoes = [];
  const assinaturas = new Set();

  const porTipo = Math.floor(totalQuestoes / geradores.length);

  geradores.forEach((gerador) => {
    let geradas = 0;
    let tentativas = 0;

    while (geradas < porTipo && tentativas < 500) {
      tentativas += 1;
      const questao = gerador();
      const assinatura = assinaturaQuestao(questao);
      if (assinaturas.has(assinatura)) {
        continue;
      }
      assinaturas.add(assinatura);
      questoes.push(questao);
      geradas += 1;
    }
  });

  while (questoes.length < totalQuestoes) {
    const gerador = geradores[valorAleatorio(0, geradores.length - 1)];
    const questao = gerador();
    const assinatura = assinaturaQuestao(questao);
    if (assinaturas.has(assinatura)) {
      continue;
    }
    assinaturas.add(assinatura);
    questoes.push(questao);
  }

  return embaralhar(questoes);
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
  textoQuestaoEl.textContent = `Você terminou a rodada ${rodada} com ${pontuacao} ponto(s). Clique em \"Nova rodada\" para jogar mais 30 questões com novos valores.`;
  materialEl.innerHTML = "<p>Nova rodada = 30 novas perguntas aleatórias, sem repetição dentro da rodada.</p>";
  btnVerificar.disabled = true;
  btnProxima.disabled = true;
  btnNovaRodada.hidden = false;
}

function iniciarRodada() {
  questoesRodada = gerarQuestoesDaRodada(TOTAL_QUESTOES_RODADA);
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

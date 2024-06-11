const denominacoes = [
  {
    valor: 100,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/100/100_front.jpg",
  },
  {
    valor: 50,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/50/50_front.jpg",
  },
  {
    valor: 20,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/20/20_front.jpg",
  },
  {
    valor: 10,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/10/10_front.jpg",
  },
  {
    valor: 5,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/5/5_front.jpg",
  },
  {
    valor: 2,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/2/2_front.jpg",
  },
  {
    valor: 1,
    imagem:
      "https://www.bcb.gov.br/novasnotas/assets/img/section/1/1_front.jpg",
  },
  { valor: 0.5, imagem: "https://i.imgur.com/t8GX6v3.png" },
  { valor: 0.25, imagem: "https://i.imgur.com/8zTLI1r.png" },
  { valor: 0.1, imagem: "https://i.imgur.com/l3t7yJ8.png" },
  { valor: 0.05, imagem: "https://i.imgur.com/5y99w97.png" },
  { valor: 0.01, imagem: "https://i.imgur.com/X7VdVJf.png" },
];

const quantidades = {};
let valorTotalEmCaixa = 0;

document.addEventListener("DOMContentLoaded", criarCamposQuantidades);

function criarCamposQuantidades() {
  const quantidadesDiv = document.getElementById("quantidades");
  quantidadesDiv.innerHTML = "";
  denominacoes.forEach((denominacao) => {
    const container = document.createElement("div");
    container.style.marginBottom = "10px";

    const img = document.createElement("img");
    img.src = denominacao.imagem;
    img.alt = `${denominacao.valor} Reais`;
    img.style.width = "200px";
    img.style.marginRight = "5px";

    const input = document.createElement("input");
    input.type = "number";
    input.id = `qtd-${denominacao.valor}`;
    input.min = "0";
    input.addEventListener("input", calcularValorEmCaixa);

    container.appendChild(img);
    container.appendChild(input);
    quantidadesDiv.appendChild(container);
  });
}

function calcularValorEmCaixa() {
  valorTotalEmCaixa = 0;
  denominacoes.forEach((denominacao) => {
    const input = document.getElementById(`qtd-${denominacao.valor}`);
    const quantidade = parseInt(input.value) || 0;
    quantidades[denominacao.valor] = quantidade;
    valorTotalEmCaixa += denominacao.valor * quantidade;
  });

  document.getElementById(
    "valorTotal"
  ).textContent = `Valor total em caixa: R$ ${valorTotalEmCaixa.toFixed(2)}`;
  document.getElementById("valorDesejado").disabled = false;
}

function calcularTroco() {
  const valorDesejado = parseFloat(
    document.getElementById("valorDesejado").value.replace(",", ".")
  );
  if (
    isNaN(valorDesejado) ||
    valorDesejado < 0 ||
    valorDesejado > valorTotalEmCaixa
  ) {
    alert(
      "Valor desejado inválido. Insira um valor positivo menor ou igual ao valor em caixa."
    );
    return;
  }

  const valorRetirar = valorTotalEmCaixa - valorDesejado;
  const troco = calcularNotasMoedas(valorRetirar);

  if (troco.valorRestante > 0) {
    alertarTrocoInsuficiente(troco.valorRestante);
    return;
  }

  exibirResultados(troco.notasMoedas, valorRetirar, valorDesejado);
}

function calcularNotasMoedas(valorRetirar) {
  const troco = {};
  let valorRestante = valorRetirar;

  denominacoes.forEach((denominacao) => {
    const qtdUsar = Math.min(
      Math.floor(valorRestante / denominacao.valor),
      quantidades[denominacao.valor]
    );
    troco[denominacao.valor] = qtdUsar;
    valorRestante -= qtdUsar * denominacao.valor;
    if (valorRestante < 0.01) valorRestante = 0;
  });

  return { notasMoedas: troco, valorRestante };
}

function alertarTrocoInsuficiente(valorRestante) {
  const motivos = identificarMotivos(valorRestante);
  const solucoes = sugerirSolucoes(valorRestante);

  let mensagem =
    "Não é possível retirar o valor desejado com as notas e moedas disponíveis.\n\nMotivos:\n";
  motivos.forEach((motivo) => (mensagem += `- ${motivo}\n`));

  if (solucoes.length > 0) {
    mensagem += "\nSoluções alternativas:\n";
    solucoes.forEach((solucao) => (mensagem += `- ${solucao}\n`));
  }

  alert(mensagem);
}

function identificarMotivos(valorRestante) {
  return denominacoes
    .filter(
      (denominacao) =>
        valorRestante >= denominacao.valor &&
        quantidades[denominacao.valor] === 0
    )
    .map(
      (denominacao) =>
        `Faltam notas/moedas de R$ ${denominacao.valor.toFixed(2)}.`
    );
}

function sugerirSolucoes(valorRestante) {
  const solucoes = [];
  const valorAproximado = Math.floor(valorRestante / 10) * 10;
  solucoes.push(`Retirar R$ ${valorAproximado.toFixed(2)} (aproximado).`);
  return solucoes;
}

function exibirResultados(troco, valorRetirar, valorDesejado) {
  const elementoExibicao = document.getElementById("exibicao");
  elementoExibicao.innerHTML = "";

  let resultado = `Valor em Caixa: R$ ${valorTotalEmCaixa.toFixed(2)}<br>
                    Valor a Retirar: R$ ${valorRetirar.toFixed(2)}<br>
                    Valor Restante: R$ ${valorDesejado.toFixed(2)}<br><br>
                    Retire:<br>`;

  elementoExibicao.innerHTML += resultado;

  const containerImagens = document.createElement("div");
  containerImagens.id = "imagensTroco";

  Object.entries(troco).forEach(([valor, quantidade]) => {
    if (quantidade > 0) {
      const denominacao = denominacoes.find((den) => den.valor == valor);
      const imgContainer = document.createElement("div");
      imgContainer.style.display = "flex";
      imgContainer.style.alignItems = "center";
      imgContainer.style.marginBottom = "10px";

      const img = document.createElement("img");
      img.src = denominacao.imagem;
      img.alt = `${valor} Reais`;
      img.style.width = "150px";
      img.style.marginRight = "10px";

      const texto = document.createElement("span");
      texto.textContent = `x${quantidade} = R$ ${(valor * quantidade).toFixed(
        2
      )}`; // Mostra a quantidade e o valor total da denominação

      imgContainer.appendChild(img);
      imgContainer.appendChild(texto);
      containerImagens.appendChild(imgContainer);
    }
  });

  elementoExibicao.appendChild(containerImagens);
}

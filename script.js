const denominacoes = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.01];
const quantidades = {};
let valorTotalEmCaixa = 0;

function criarCamposQuantidades() {
  const quantidadesDiv = document.getElementById("quantidades");
  denominacoes.forEach((valor) => {
    const label = document.createElement("label");
    label.textContent = `${valor} Reais: `;
    const input = document.createElement("input");
    input.type = "number";
    input.id = `qtd-${valor}`;
    input.min = "0";
    input.addEventListener("input", calcularValorEmCaixa);
    quantidadesDiv.appendChild(label);
    quantidadesDiv.appendChild(input);
    quantidadesDiv.appendChild(document.createElement("br"));
  });
}

function calcularValorEmCaixa() {
  valorTotalEmCaixa = 0;
  denominacoes.forEach((valor) => {
    quantidades[valor] =
      parseInt(document.getElementById(`qtd-${valor}`).value) || 0;
    valorTotalEmCaixa += valor * quantidades[valor];
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
  const troco = {};
  let valorRestante = valorRetirar;

  for (const valor of denominacoes) {
    const qtdUsar = Math.min(
      Math.floor(valorRestante / valor),
      quantidades[valor]
    );
    troco[valor] = qtdUsar;
    valorRestante -= qtdUsar * valor;

    if (valorRestante < 0.01) break;
  }

  if (valorRestante > 0) {
    const motivos = identificarMotivos(valorRestante);
    const solucoes = sugerirSolucoes(valorRestante);

    let mensagem =
      "Não é possível retirar o valor desejado com as notas e moedas disponíveis.\n\nMotivos:\n";
    motivos.forEach((motivo) => (mensagem += "- " + motivo + "\n"));

    if (solucoes.length > 0) {
      mensagem += "\nSoluções alternativas:\n";
      solucoes.forEach((solucao) => (mensagem += "- " + solucao + "\n"));
    }

    alert(mensagem);
    return;
  }

  exibirResultados(troco);
}

function identificarMotivos(valorRestante) {
  const motivos = [];
  for (const valor of denominacoes) {
    if (valorRestante >= valor && quantidades[valor] === 0) {
      motivos.push(`Faltam notas/moedas de R$ ${valor.toFixed(2)}.`);
    }
  }
  return motivos;
}

function sugerirSolucoes(valorRestante) {
  const solucoes = [];
  const valorAproximado = Math.floor(valorRestante / 10) * 10;
  solucoes.push(`Retirar R$ ${valorAproximado.toFixed(2)} (aproximado).`);
  return solucoes;
}

function exibirResultados(troco) {
  const valorDesejado = parseFloat(
    document.getElementById("valorDesejado").value.replace(",", ".")
  );
  const valorRetirar = valorTotalEmCaixa - valorDesejado;

  const elementoExibicao = document.getElementById("exibicao");
  elementoExibicao.innerHTML = "";

  let novoParagrafo = document.createElement("p");
  let resultado = `Valor em Caixa: R$ ${valorTotalEmCaixa.toFixed(2)}<br>
                      Valor a Retirar: R$ ${valorRetirar.toFixed(2)}<br>
                      Valor Restante: R$ ${valorDesejado.toFixed(2)}<br><br>
                      Notas e Moedas a Retirar:<br>`;

  for (const [valor, quantidade] of Object.entries(troco)) {
    if (quantidade > 0) {
      resultado += `${valor} Reais: ${quantidade}<br>`;
    }
  }

  novoParagrafo.innerHTML = resultado;
  elementoExibicao.appendChild(novoParagrafo);
}

criarCamposQuantidades();

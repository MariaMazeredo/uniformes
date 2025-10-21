document.addEventListener("DOMContentLoaded", () => {
  // Variáveis globais
  const botoesProduto = document.querySelectorAll(".btn-produto");
  const modalProduto = document.getElementById("modal-produto");
  const modalProdutoImg = document.getElementById("modal-produto-img");
  const modalProdutoNome = document.getElementById("modal-produto-nome");
  const modalProdutoDesc = document.getElementById("modal-produto-desc");
  const modalProdutoPreco = document.getElementById("modal-produto-preco");
  const quantidadeSpan = document.getElementById("quantidade");
  const tamanhoBtns = document.querySelectorAll(".tamanho-btn");
  const modalCarrinho = document.getElementById("modal-carrinho-compras");
  const botaoCarrinho = document.querySelector(".btn-carrinho");
  const botaoCarrinhoModal = document.querySelector(".btn-carrinho-modal");
  const botoesFechar = document.querySelectorAll(".btn-fechar");
  const carrinhoItens = document.getElementById("carrinho-itens");
  const carrinhoTotalSpan = document.getElementById("carrinho-total");
  const mensagemVazio = document.getElementById("mensagem-vazio");

  let quantidade = 1;
  let tamanhoSelecionado = "";

  // Funções abrir/fechar modais
  function abrirModal(modal) {
    if (!modal) return;
    modal.style.display = "flex";
    document.body.classList.add("modal-ativo");
  }

  function fecharModal(modal) {
    if (!modal) return;
    modal.style.display = "none";
    const algumAberto = document.querySelector('.modal[style*="flex"]');
    if (!algumAberto) document.body.classList.remove("modal-ativo");
  }

  // Abrir modal produto
  botoesProduto.forEach((botao) => {
    botao.addEventListener("click", () => {
      const img = botao.querySelector("img");
      const nome = botao.querySelector("h2");
      const desc = botao.querySelector(".informacoes");
      const preco = botao.querySelector(".preco");

      modalProdutoImg.src = img ? img.src : "";
      modalProdutoNome.textContent = nome ? nome.textContent : "";
      modalProdutoDesc.textContent = desc ? desc.textContent : "";
      modalProdutoPreco.textContent = preco ? preco.textContent : "";

      quantidade = 1;
      quantidadeSpan.textContent = quantidade;
      tamanhoSelecionado = "";
      tamanhoBtns.forEach((b) => b.classList.remove("selecionado"));

      abrirModal(modalProduto);
    });
  });

  // Botões de quantidade
  const maisBtn = document.querySelector(".menos");
  const menosBtn = document.querySelector(".mais");

  if (menosBtn)
    menosBtn.addEventListener("click", () => {
      if (quantidade > 1) quantidade--;
      quantidadeSpan.textContent = quantidade;
    });

  if (maisBtn)
    maisBtn.addEventListener("click", () => {
      quantidade++;
      quantidadeSpan.textContent = quantidade;
    });

  // Botões de tamanho
  tamanhoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tamanhoBtns.forEach((b) => b.classList.remove("selecionado"));
      btn.classList.add("selecionado");
      tamanhoSelecionado = btn.textContent;
    });
  });

  // Fechar modais
  botoesFechar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) fecharModal(modal);
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList && e.target.classList.contains("modal")) {
      fecharModal(e.target);
    }
  });

  const botaoComprarModal = document.querySelector(".btn-comprar-modal");
  if (botaoComprarModal) {
    botaoComprarModal.addEventListener("click", () => {
      window.location.href = "termosDeUso.html";
    });
  }

  // Botão "Comprar Agora" do modal carrinho
  const botaoFinalizarCompra = document.querySelector(".btn-finalizar-compra");
  if (botaoFinalizarCompra) {
    botaoFinalizarCompra.addEventListener("click", () => {
      window.location.href = "termosDeUso.html";
    });
  }

  // Abrir modal carrinho
  if (botaoCarrinho) {
    botaoCarrinho.addEventListener("click", () => {
      fecharModal(modalProduto);
      abrirModal(modalCarrinho);
    });
  }

  // Adicionar ao carrinho
  if (botaoCarrinhoModal) {
    botaoCarrinhoModal.addEventListener("click", () => {
      // Verifica se o tamanho foi selecionado
      if (!tamanhoSelecionado) {
        alert("Selecione um tamanho antes de adicionar ao carrinho!");
        return; // impede adicionar sem tamanho
      }

      const nome = modalProdutoNome.textContent;
      const precoTexto = modalProdutoPreco.textContent
        .replace("R$ ", "")
        .replace(",", ".");
      const preco = parseFloat(precoTexto) || 0;
      const img = modalProdutoImg.src;

      adicionarAoCarrinho(nome, preco, img, quantidade, tamanhoSelecionado);

      fecharModal(modalProduto);
      abrirModal(modalCarrinho);
      mensagemVazio.style.display =
        carrinhoItens.children.length === 0 ? "block" : "none"; // Atualiza mensagem carrinho vazio
    });
  }

  function adicionarAoCarrinho(nome, preco, img, qtd, tamanho) {
    // Verifica se já existe produto com mesmo nome e tamanho
    let itemExistente = Array.from(carrinhoItens.children).find((item) => {
      return item.dataset.nome === nome && item.dataset.tamanho === tamanho;
    });

    if (itemExistente) {
      // Atualiza quantidade existente
      let novaQtd = parseInt(itemExistente.dataset.quantidade) + qtd;
      itemExistente.dataset.quantidade = novaQtd;
      itemExistente.querySelector(".quantidade-item").textContent = novaQtd;
    } else {
      // Cria novo item
      const itemCarrinho = document.createElement("div");
      itemCarrinho.classList.add("produto");
      itemCarrinho.dataset.preco = preco;
      itemCarrinho.dataset.quantidade = qtd;
      itemCarrinho.dataset.nome = nome;
      itemCarrinho.dataset.tamanho = tamanho;

      if (tamanho != "p, m, g, gg") {
        nome += ` - ${tamanho}`;
      }

      itemCarrinho.innerHTML = `
        <input type="checkbox" checked>
        <img src="${img}" alt="${nome}">
        <div class="produto-info">
          <span class="nome">${nome} ${tamanho ? "- " + tamanho : ""}</span>
          <span class="preco">R$ ${preco.toFixed(2).replace(".", ",")}</span>
          <span class="quantidade-item">${qtd}</span>
        </div>
        <button class="btn-remover">✖</button>
      `;

      carrinhoItens.appendChild(itemCarrinho);

      // Remover item
      itemCarrinho
        .querySelector(".btn-remover")
        .addEventListener("click", () => {
          itemCarrinho.remove();
          atualizarTotal();
        });

      // Atualiza total ao marcar/desmarcar
      itemCarrinho
        .querySelector("input[type='checkbox']")
        .addEventListener("change", atualizarTotal);
    }

    atualizarTotal();
  }

  function atualizarTotal() {
    let total = 0;
    document.querySelectorAll("#carrinho-itens .produto").forEach((item) => {
      const checkbox = item.querySelector("input[type='checkbox']");
      if (checkbox && checkbox.checked) {
        const preco = parseFloat(item.dataset.preco) || 0;
        const qtd = parseInt(item.dataset.quantidade) || 0;
        total += preco * qtd;
      }
    });

    carrinhoTotalSpan.textContent = total.toFixed(2).replace(".", ",");
  }
});

// Botão Voltar para página inicial
const botaoVoltar = document.querySelector(".btn-voltar");
if (botaoVoltar) {
  botaoVoltar.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// document.addEventListener("DOMContentLoaded", () => {
  // Botão Negar Termos para página inicial
  const botaoNegarTermos = document.querySelector(".btn-negar-termos");
  if (botaoNegarTermos) {
    botaoNegarTermos.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Botão Aceitar Termos para página de finalização
  const botaoAceitarTermos = document.querySelector(".btn-aceitar-termos");
  if (botaoAceitarTermos) {
    botaoAceitarTermos.addEventListener("click", () => {
      window.location.href = "finalizado.html";
    });
  }

  // Validação opcional de formulário (se os campos existirem)
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const mensagemInput = document.getElementById("mensagem");
  const botaoEnviar = document.getElementById("btn-enviar");

  if (botaoEnviar && nomeInput && emailInput && mensagemInput) {
    botaoEnviar.addEventListener("click", (e) => {
      if (!nomeInput.value.trim() || !emailInput.value.trim() || !mensagemInput.value.trim()) {
        e.preventDefault();
        alert("Preencha todos os campos antes de enviar.");
        return;
      }
      // aqui pode submeter o form ou realizar outra ação
    });
  }
// });


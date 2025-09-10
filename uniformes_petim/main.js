document.addEventListener("DOMContentLoaded", () => {

  // ================= MODAL PRODUTO =================
  const botoesProduto = document.querySelectorAll(".btn-produto");
  const modalProduto = document.getElementById("modal-produto");
  const fecharProduto = modalProduto.querySelector(".btn-fechar");

  const modalImg = document.getElementById("modal-img");
  const modalNome = document.getElementById("modal-nome");
  const modalDesc = document.getElementById("modal-desc");
  const modalPreco = document.getElementById("modal-preco");
  const quantidadeEl = document.getElementById("quantidade");
  const btnMais = modalProduto.querySelector(".mais");
  const btnMenos = modalProduto.querySelector(".menos");
  const tamanhoBtns = modalProduto.querySelectorAll(".tamanho-btn");

  let quantidade = 1;

  // Abrir modal do produto
  botoesProduto.forEach(botao => {
    botao.addEventListener("click", () => {
      const img = botao.querySelector("img").src;
      const nome = botao.querySelector("h2").textContent;
      const desc = botao.querySelector(".informacoes").textContent;
      const preco = botao.querySelector(".preco").textContent;

      modalImg.src = img;
      modalNome.textContent = nome;
      modalDesc.textContent = desc;
      modalPreco.textContent = preco;

      quantidade = 1;
      quantidadeEl.textContent = quantidade;

      // Reset seleção de tamanho
      tamanhoBtns.forEach(b => b.classList.remove("selecionado"));

      modalProduto.classList.add("ativo");
      document.body.classList.add("modal-ativo");
    });
  });

  // Fechar modal do produto
  fecharProduto.addEventListener("click", () => {
    modalProduto.classList.remove("ativo");
    document.body.classList.remove("modal-ativo");
  });

  // Controles de quantidade
  btnMais.addEventListener("click", () => {
    quantidade++;
    quantidadeEl.textContent = quantidade;
  });

  btnMenos.addEventListener("click", () => {
    if (quantidade > 1) {
      quantidade--;
      quantidadeEl.textContent = quantidade;
    }
  });

  // Seleção de tamanho
  tamanhoBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tamanhoBtns.forEach(b => b.classList.remove("selecionado"));
      btn.classList.add("selecionado");
    });
  });

  // ================= MODAL CARRINHO =================
const modalCarrinho = document.getElementById("modal-carrinho-compras");
const btnFecharCarrinho = modalCarrinho.querySelector(".btn-fechar");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");

  let carrinho = [];

  // Fechar modal carrinho
  btnFecharCarrinho.addEventListener("click", () => {
    modalCarrinho.style.display = "none";
    document.body.classList.remove("modal-ativo");
  });

  // Abrir modal carrinho pelo botão de ícone (se existir)
  const btnAbrirCarrinho = document.querySelector(".btn-carrinho");
  if (btnAbrirCarrinho) {
    btnAbrirCarrinho.addEventListener("click", () => {
      modalCarrinho.style.display = "flex";
      document.body.classList.add("modal-ativo");
      atualizarCarrinho();
    });
  }

  // ================= ADICIONAR AO CARRINHO =================
  const btnCarrinhoModal = modalProduto.querySelector(".btn-carrinho-modal");

  btnCarrinhoModal.addEventListener("click", () => {
    const nome = modalNome.innerText;
    const preco = parseFloat(modalPreco.innerText.replace("R$", "").replace(",", "."));
    const tamanhoSelecionado = modalProduto.querySelector(".tamanho-btn.selecionado");
    
    if (!tamanhoSelecionado) {
      alert("Selecione um tamanho antes de adicionar ao carrinho!");
      return;
    }

    // Verifica se produto já existe no carrinho
    const produtoExistente = carrinho.find(p => p.nome === nome && p.tamanho === tamanhoSelecionado.innerText);
    if (produtoExistente) {
      produtoExistente.quantidade += quantidade;
    } else {
      carrinho.push({
        nome: nome,
        preco: preco,
        quantidade: quantidade,
        tamanho: tamanhoSelecionado.innerText
      });
    }

    atualizarCarrinho();
    modalCarrinho.style.display = "flex";
    document.body.classList.add("modal-ativo");
  });

  // Atualiza itens e total do carrinho
  function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";
    let total = 0;

    carrinho.forEach(item => {
      total += item.preco * item.quantidade;
      const div = document.createElement("div");
      div.classList.add("item-carrinho");
      div.innerHTML = `
        <strong>${item.nome}</strong> - Tamanho: ${item.tamanho} - Qtd: ${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}
      `;
      listaCarrinho.appendChild(div);
    });

    totalCarrinho.innerText = `Total: R$ ${total.toFixed(2)}`;
  }

  // Fechar modal clicando fora
  window.addEventListener("click", (e) => {
    if (e.target === modalProduto) {
      modalProduto.classList.remove("ativo");
      document.body.classList.remove("modal-ativo");
    }
    if (e.target === modalCarrinho) {
      modalCarrinho.style.display = "none";
      document.body.classList.remove("modal-ativo");
    }
  });

});

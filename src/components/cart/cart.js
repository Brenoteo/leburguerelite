let carrinho = [];

// Torna todo o container clicável
document
  .querySelectorAll(".menu-item, .sides-item, .drinks-item, .sauces-item")
  .forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const nome = this.dataset.name;
      const preco = parseFloat(this.dataset.price);

      const produtoExistente = carrinho.find(
        (produto) => produto.name === nome
      );
      if (produtoExistente) {
        produtoExistente.quantity += 1;
      } else {
        carrinho.push({
          name: nome,
          quantity: 1,
          price: preco,
        });
      }

      console.log("Item adicionado:", nome, "R$", preco);
      console.log("Carrinho completo:", carrinho);
      alert(`${nome} adicionado ao carrinho!`);

      atualizarCarrinho();
    });
  });

function atualizarCarrinho() {
  const contador = document.querySelector(".cart-container span");
  contador.textContent = carrinho.length;
  console.log("Total de itens no carrinho:", carrinho.length);
}

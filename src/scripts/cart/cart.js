class CartManager {
  constructor() {
    this.items = [];
    this.initialize();
  }

  initialize() {
    // Listener para adicionar itens
    document.addEventListener("click", (e) => {
      const item = e.target.closest(".menu-item, .sides-item, .drinks-item, .sauces-item");
      if (item) {
        e.preventDefault();
        this.addItem(item);
      }
    });

    // Listener para abrir o carrinho
    const cartIcon = document.querySelector('.cart-container');
    cartIcon.addEventListener('click', () => this.showCartModal());
  }

  addItem(element) {
    const name = element.dataset.name;
    const price = parseFloat(element.dataset.price);

    if (!name || isNaN(price)) return;

    const existingItem = this.items.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ name, quantity: 1, price });
    }

    this.updateUI();
    this.showFeedback(name);
  }

  updateUI() {
    const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    const counter = document.querySelector(".cart-container span");
    if (counter) counter.textContent = totalItems;
  }

  showFeedback(productName) {
    this.showModal(`${productName} foi adicionado ao carrinho.`);
  }

  showModal(message) {
    const modal = document.querySelector("#cart-modal");
    const text = modal.querySelector(".modal-text");
    text.textContent = message;
    modal.classList.add("show");

    setTimeout(() => {
      modal.classList.remove("show");
    }, 1500);
  }

  // Modal do carrinho
  showCartModal() {
    const existingModal = document.querySelector('.cart-detail-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'cart-detail-modal';
    modal.innerHTML = `
      <div class="cart-content">
        <div class="cart-header">
          <h2>Seu Pedido</h2>
          <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items">
          ${this.items.length > 0 ?
        this.items.map(item => `
              <div class="cart-item">
                <span class="item-name">${item.name}</span>
                <div class="item-controls">
                  <button class="quantity-btn minus" data-name="${item.name}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="quantity-btn plus" data-name="${item.name}">+</button>
                </div>
                <span class="item-total">R$ ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')
        : '<p class="empty-cart">Carrinho vazio</p>'
      }
        </div>
        ${this.items.length > 0 ? `
          <div class="cart-footer">
            <div class="cart-total">
              <strong>Total:</strong>
              <strong>R$ ${this.getTotal()}</strong>
            </div>
            <button class="checkout-btn">Finalizar Pedido</button>
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(modal);
    this.bindModalEvents(modal);
  }

  bindModalEvents(modal) {
    // Fechar modal
    modal.querySelector('.close-cart').addEventListener('click', () => modal.remove());

    // Fechar clicando fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    // Botões de quantidade
    modal.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        if (e.target.classList.contains('plus')) {
          this.increaseQuantity(name);
        } else {
          this.decreaseQuantity(name);
        }
      });
    });
  }

  increaseQuantity(name) {
    const item = this.items.find(i => i.name === name);
    if (item) {
      item.quantity++;
      this.updateUI();
      this.showCartModal();
    }
  }

  decreaseQuantity(name) {
    const itemIndex = this.items.findIndex(i => i.name === name);
    if (itemIndex !== -1) {
      if (this.items[itemIndex].quantity > 1) {
        this.items[itemIndex].quantity--;
      } else {
        this.items.splice(itemIndex, 1);
      }
      this.updateUI();
      this.showCartModal();
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  }
}

new CartManager();
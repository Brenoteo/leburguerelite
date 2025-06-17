class CartManager {
  constructor() {
    this.items = [];
    this.deliveryFee = 3.00; // Taxa de entrega
    this.maxQuantity = 99;
    this.initialize();
  }

  initialize() {
    // Listener para adicionar itens
    document.addEventListener("click", (e) => {
      // Para o carrinho
      if (e.target.closest('.cart-container')) {
        e.preventDefault();
        e.stopPropagation();
        this.showCartModal();
        return;
      }

      // Para os itens
      const item = e.target.closest(".menu-item, .sides-item, .drinks-item, .sauces-item");
      if (item) {
        e.preventDefault();
        this.addItem(item);
      }
    });
  }

  addItem(element) {
    const name = element.dataset.name;
    const price = parseFloat(element.dataset.price);
    const image = element.querySelector('img')?.src || '';

    if (!name || isNaN(price)) return;

    const existingItem = this.items.find(item => item.name === name);

    if (existingItem) {
      if (existingItem.quantity < this.maxQuantity) {
        existingItem.quantity += 1;
        this.showFeedback(name, 'adicionado');
      } else {
        this.showFeedback('Quantidade máxima atingida', 'erro');
      }
    } else {
      this.items.push({ name, quantity: 1, price, image, notes: '' });
      this.showFeedback(name, 'adicionado');
    }

    this.updateUI();
    this.vibrateDevice();
  }

  updateUI() {
    const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    const counter = document.querySelector(".cart-container span");
    if (counter) {
      counter.textContent = totalItems;
      counter.classList.add("pulse");
      setTimeout(() => counter.classList.remove("pulse"), 300);
    }
  }

  showFeedback(message, type = 'success') {
    const modal = document.querySelector("#cart-modal");
    const text = modal.querySelector(".modal-text");

    text.textContent = type === 'adicionado' ? `${message} foi adicionado ao carrinho.` : message;
    modal.classList.add("show");

    if (type === 'erro') {
      modal.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
    } else {
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }

    setTimeout(() => {
      modal.classList.remove("show");
    }, 1500);
  }

  showCartModal() {
    let existingModal = document.querySelector('.cart-detail-modal');

    // Se modal existe, apenas atualiza conteúdo
    if (existingModal) {
      this.updateModalContent(existingModal);
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'cart-detail-modal';

    modal.innerHTML = this.generateModalContent();
    document.body.appendChild(modal);

    // Animação de entrada suave
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    this.bindModalEvents(modal);
  }

  generateModalContent() {
    const hasItems = this.items.length > 0;
    const subtotal = this.getSubtotal();
    const total = subtotal + (hasItems ? this.deliveryFee : 0);

    return `
      <div class="cart-overlay"></div>
      <div class="cart-content">
        <div class="cart-header">
          <h2>Seu Pedido</h2>
          <button class="close-cart" aria-label="Fechar carrinho">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="cart-body">
          ${hasItems ?
        this.items.map((item, index) => `
              <div class="cart-item" data-index="${index}">
                <div class="cart-item-content">
                  <img src="${item.image}" alt="${item.name}" class="item-image">
                  <div class="item-info">
                    <div class="item-header">
                      <h3 class="item-name">${item.name}</h3>
                      <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="quantity-controls">
                      <button class="quantity-btn minus" data-name="${item.name}">−</button>
                      <span class="quantity-display">${item.quantity}</span>
                      <button class="quantity-btn plus" data-name="${item.name}" 
                              ${item.quantity >= this.maxQuantity ? 'disabled' : ''}>+</button>
                    </div>
                    <textarea class="item-notes" 
                              placeholder="Observações (ex: sem cebola, ponto da carne...)" 
                              data-index="${index}">${item.notes}</textarea>
                  </div>
                </div>
              </div>
            `).join('')
        : `<div class="empty-cart">
                 <span class="empty-cart-icon">🛒</span>
                 <p class="empty-cart-text">Seu carrinho está vazio</p>
               </div>`
      }
        </div>
        
        ${hasItems ? `
          <div class="cart-footer">
            <div class="order-summary">
              <div class="summary-row subtotal">
                <span>Subtotal:</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
              </div>
              <div class="summary-row delivery">
                <span>Taxa de entrega:</span>
                <span>R$ ${this.deliveryFee.toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span class="total-value">R$ ${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="delivery-time">
              <span>🕐</span>
              <span>Entrega em 30-45 minutos</span>
            </div>
            
            <div class="cart-actions">
              <button class="btn-clear">Limpar</button>
              <button class="btn-checkout">Continuar</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  bindModalEvents(modal) {
    // Fechar modal - overlay
    const overlay = modal.querySelector('.cart-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeModal(modal));
    }

    // Fechar modal - botão
    const closeBtn = modal.querySelector('.close-cart');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal(modal));
    }

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

    // Observações - usando change ao invés de input
    modal.querySelectorAll('.item-notes').forEach(textarea => {
      textarea.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.items[index].notes = e.target.value;
      });
    });

    // Limpar carrinho
    const clearBtn = modal.querySelector('.btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Deseja realmente limpar o carrinho?')) {
          this.clearCart();
          this.closeModal(modal);
        }
      });
    }

    // Finalizar pedido
    const checkoutBtn = modal.querySelector('.btn-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout(modal));
    }
  }

  closeModal(modal) {
    modal.classList.add('closing');
    setTimeout(() => modal.remove(), 300);
  }

  increaseQuantity(name) {
    const item = this.items.find(i => i.name === name);
    if (item && item.quantity < this.maxQuantity) {
      item.quantity++;
      this.updateUI();
      this.vibrateDevice();

      // Atualiza modal se estiver aberto
      const modal = document.querySelector('.cart-detail-modal');
      if (modal) this.updateModalContent(modal);
    }
  }

  decreaseQuantity(name) {
    const itemIndex = this.items.findIndex(i => i.name === name);
    if (itemIndex !== -1) {
      if (this.items[itemIndex].quantity > 1) {
        this.items[itemIndex].quantity--;
      } else {
        if (confirm(`Remover ${name} do carrinho?`)) {
          this.items.splice(itemIndex, 1);
        }
      }
      this.updateUI();
      this.vibrateDevice();

      // Atualiza modal se estiver aberto
      const modal = document.querySelector('.cart-detail-modal');
      if (modal) this.updateModalContent(modal);
    }
  }

  animateQuantityChange() {
    const modal = document.querySelector('.cart-detail-modal');
    if (modal) {
      const totalElement = modal.querySelector('.total-value');
      if (totalElement) {
        totalElement.classList.add('updating');
        setTimeout(() => totalElement.classList.remove('updating'), 300);
      }
    }
  }

  updateModalContent(modal) {
    const content = modal.querySelector('.cart-content');
    const oldScrollTop = content.querySelector('.cart-body')?.scrollTop || 0;

    // Atualiza apenas o conteúdo interno
    content.innerHTML = this.generateModalContent().match(/<div class="cart-content">([\s\S]*)<\/div>/)[1];

    // Restaura posição do scroll
    const newBody = content.querySelector('.cart-body');
    if (newBody) newBody.scrollTop = oldScrollTop;

    // Re-bind eventos
    this.bindModalEvents(modal);
  }

  clearCart() {
    this.items = [];
    this.updateUI();
    this.showFeedback('Carrinho limpo', 'info');
  }

  checkout(modal) {
    this.cartHTML = modal.querySelector('.cart-content').innerHTML;

    const content = modal.querySelector('.cart-content');

    content.innerHTML = `
    <div class="cart-header">
      <button class="back-to-cart">← Voltar</button>
      <h2>Finalizar Pedido</h2>
      <button class="close-cart" aria-label="Fechar">✕</button>
    </div>
    
    <div class="cart-body">
      <div class="order-review">
        <h3>Seu Pedido</h3>
        ${this.items.map(item => `
          <div class="review-item">
            <span>${item.quantity}x ${item.name}</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="review-total">
          <strong>Total: R$ ${(this.getSubtotal() + this.deliveryFee).toFixed(2)}</strong>
        </div>
      </div>
      
      <h3>Seus Dados</h3>
      <div class="form-grid">
        <input type="text" id="nome" placeholder="Seu nome" required class="full-width">
        <input type="tel" id="telefone" placeholder="WhatsApp" required class="full-width">
        
        <input type="text" id="cep" placeholder="CEP" maxlength="9">
        <input type="text" id="numero" placeholder="Número" required>
        
        <input type="text" id="endereco" placeholder="Endereço" required class="full-width">
        <input type="text" id="bairro" placeholder="Bairro" required class="full-width">
        <textarea id="referencia" placeholder="Referência (opcional)" rows="2" class="full-width"></textarea>
        
        <h3 class="full-width">Pagamento</h3>
        <select id="pagamento" class="full-width">
          <option>Pix</option>
          <option>Dinheiro</option>
          <option>Cartão</option>
          <option>Vale Refeição/Restaurante</option>
        </select>
      </div>
    </div>
    
    <div class="cart-footer">
      <button class="btn-send-order">Finalizar Pedido</button>
    </div>
  `;

    this.bindCheckoutEvents(modal);
  }

  bindCheckoutEvents(modal) {
    // Voltar pro carrinho
    modal.querySelector('.back-to-cart').addEventListener('click', () => {
      modal.querySelector('.cart-content').innerHTML = this.cartHTML;
      this.bindModalEvents(modal);
    });

    // Fechar modal
    modal.querySelector('.close-cart').addEventListener('click', () => {
      this.closeModal(modal);
    });

    // CEP automático
    modal.querySelector('#cep').addEventListener('input', async (e) => {
      let cep = e.target.value.replace(/\D/g, '');

      // Formata com hífen
      if (cep.length > 5) {
        e.target.value = cep.slice(0, 5) + '-' + cep.slice(5, 8);
      }

      // Busca quando digita 8 números
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (!data.erro) {
            document.getElementById('endereco').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('endereco').focus(); // Foca pra digitar o número
          }
        } catch (error) {
          // Ignora erro, usuário preenche manual
        }
      }
    });

    // Enviar pedido
    modal.querySelector('.btn-send-order').addEventListener('click', () => {
      const nome = document.getElementById('nome').value;
      const telefone = document.getElementById('telefone').value;
      const cep = document.getElementById('cep').value;
      const endereco = document.getElementById('endereco').value;
      const bairro = document.getElementById('bairro').value;
      const numeroEnd = document.getElementById('numero').value;
      const referencia = document.getElementById('referencia').value;
      const pagamento = document.getElementById('pagamento').value;

      if (!nome || !telefone || !endereco || !bairro) {
        alert('Preencha todos os campos!');
        return;
      }

      // Salva dados do pedido para usar depois
      this.pedidoData = {
        nome, telefone, cep, endereco, bairro,
        numeroEnd, referencia, pagamento
      };

      // Mostra tela de progresso
      this.showOrderProgress(modal);
    });
  }

  showOrderProgress(modal) {
    const content = modal.querySelector('.cart-content');

    content.innerHTML = `
    <div class="cart-header">
      <h2>Acompanhando seu Pedido</h2>
    </div>
    
    <div class="order-progress-container">
      <div class="progress-timeline">
        <div class="progress-line"></div>
        
        <div class="progress-step active" data-step="1">
          <div class="step-icon">⏳</div>
          <div class="step-info">
            <h3>Aguardando confirmação</h3>
            <p>Verificando seu pedido...</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="2">
          <div class="step-icon">👨‍🍳</div>
          <div class="step-info">
            <h3>Em preparo</h3>
            <p>Preparando com carinho</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="3">
          <div class="step-icon">🛵</div>
          <div class="step-info">
            <h3>Saiu para entrega</h3>
            <p>A caminho!</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="4">
          <div class="step-icon">✅</div>
          <div class="step-info">
            <h3>Pedido confirmado</h3>
            <p>Redirecionando...</p>
          </div>
        </div>
      </div>
      
      <div class="progress-message">
        <h2 id="progress-title">Aguardando confirmação do estabelecimento</h2>
        <p id="progress-subtitle">Seu pedido está sendo processado</p>
      </div>
    </div>
  `;

    this.animateProgress(modal);
  }

  animateProgress(modal) {
    const steps = modal.querySelectorAll('.progress-step');
    const progressLine = modal.querySelector('.progress-line');
    const progressTitle = modal.querySelector('#progress-title');
    const progressSubtitle = modal.querySelector('#progress-subtitle');

    const messages = [
      {
        title: "Aguardando confirmação do estabelecimento",
        subtitle: "Seu pedido está sendo processado"
      },
      {
        title: "Seu pedido está em preparo",
        subtitle: "Nossos chefs estão preparando tudo"
      },
      {
        title: "Pedido saiu para entrega",
        subtitle: "Em breve chegará até você"
      },
      {
        title: "Pedido confirmado com sucesso!",
        subtitle: "Obrigado por testar o projeto!"
      }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < 4) {
        // Ativa próximo step
        steps[currentStep].classList.add('active');
        steps[currentStep - 1].classList.add('completed');

        // Atualiza linha de progresso
        progressLine.style.height = `${(currentStep / 3) * 100}%`;

        // Atualiza mensagens
        progressTitle.textContent = messages[currentStep].title;
        progressSubtitle.textContent = messages[currentStep].subtitle;

      } else {
        clearInterval(interval);

        // Após completar, envia pro WhatsApp
        setTimeout(() => {
          this.sendToWhatsApp();
        }, 1500);
      }
    }, 3000); // 3 segundos entre cada etapa
  }

  showOrderProgress(modal) {
    const content = modal.querySelector('.cart-content');

    content.innerHTML = `
    <div class="cart-header">
      <h2>Acompanhando seu Pedido</h2>
    </div>
    
    <div class="order-progress-container">
      <div class="progress-timeline">
        <div class="progress-line"></div>
        
        <div class="progress-step active" data-step="1">
          <div class="step-icon">⏳</div>
          <div class="step-info">
            <h3>Aguardando confirmação</h3>
            <p>Verificando seu pedido...</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="2">
          <div class="step-icon">👨‍🍳</div>
          <div class="step-info">
            <h3>Em preparo</h3>
            <p>Preparando com carinho</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="3">
          <div class="step-icon">🛵</div>
          <div class="step-info">
            <h3>Saiu para entrega</h3>
            <p>A caminho!</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="4">
          <div class="step-icon">✅</div>
          <div class="step-info">
            <h3>Pedido confirmado</h3>
            <p>Redirecionando...</p>
          </div>
        </div>
      </div>
      
      <div class="progress-message">
        <h2 id="progress-title">Aguardando confirmação do estabelecimento</h2>
        <p id="progress-subtitle">Seu pedido está sendo processado</p>
      </div>
    </div>
  `;

    this.animateProgress(modal);
  }

  animateProgress(modal) {
    const steps = modal.querySelectorAll('.progress-step');
    const progressLine = modal.querySelector('.progress-line');
    const progressTitle = modal.querySelector('#progress-title');
    const progressSubtitle = modal.querySelector('#progress-subtitle');

    const messages = [
      {
        title: "Aguardando confirmação do estabelecimento",
        subtitle: "Seu pedido está sendo processado"
      },
      {
        title: "Seu pedido está em preparo",
        subtitle: "Nossos chefs estão preparando tudo"
      },
      {
        title: "Pedido saiu para entrega",
        subtitle: "Em breve chegará até você"
      },
      {
        title: "Pedido confirmado com sucesso!",
        subtitle: "Obrigado por testar o projeto!..."
      }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < 4) {
        // Ativa próximo step
        steps[currentStep].classList.add('active');
        steps[currentStep - 1].classList.add('completed');

        // Atualiza linha de progresso
        progressLine.style.height = `${(currentStep / 3) * 100}%`;

        // Atualiza mensagens
        progressTitle.textContent = messages[currentStep].title;
        progressSubtitle.textContent = messages[currentStep].subtitle;

      } else {
        clearInterval(interval);

        // Após completar, envia pro WhatsApp
        setTimeout(() => {
          this.sendToWhatsApp();
        }, 1500);
      }
    }, 3000); // 3 segundos entre cada etapa
  }

  showOrderProgress(modal) {
    const content = modal.querySelector('.cart-content');

    content.innerHTML = `
    <div class="cart-header">
      <h2>Acompanhando seu Pedido</h2>
      <button class="close-cart" aria-label="Fechar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="order-progress-container">
      <div class="progress-timeline">
        <div class="progress-line"></div>
        
        <div class="progress-step active" data-step="1">
          <div class="step-icon">⏳</div>
          <div class="step-info">
            <h3>Aguardando confirmação</h3>
            <p>Verificando seu pedido...</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="2">
          <div class="step-icon">👨‍🍳</div>
          <div class="step-info">
            <h3>Em preparo</h3>
            <p>Preparando com carinho</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="3">
          <div class="step-icon">🛵</div>
          <div class="step-info">
            <h3>Saiu para entrega</h3>
            <p>A caminho!</p>
          </div>
        </div>
        
        <div class="progress-step" data-step="4">
          <div class="step-icon">✅</div>
          <div class="step-info">
            <h3>Pedido confirmado</h3>
            <p>Redirecionando...</p>
          </div>
        </div>
      </div>
      
      <div class="progress-message">
        <h2 id="progress-title">Aguardando confirmação do estabelecimento</h2>
        <p id="progress-subtitle">Seu pedido está sendo processado</p>
      </div>
    </div>
  `;
    // Adicione estas linhas logo após content.innerHTML = `...`;

    // Bind do botão fechar
    const closeBtn = modal.querySelector('.close-cart');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (confirm('Deseja cancelar o acompanhamento do pedido?')) {
          this.closeModal(modal);
        }
      });
    }
    this.animateProgress(modal);
  }

  animateProgress(modal) {
    const steps = modal.querySelectorAll('.progress-step');
    const progressLine = modal.querySelector('.progress-line');
    const progressTitle = modal.querySelector('#progress-title');
    const progressSubtitle = modal.querySelector('#progress-subtitle');

    const messages = [
      {
        title: "Aguardando confirmação do estabelecimento",
        subtitle: "Seu pedido está sendo processado"
      },
      {
        title: "Seu pedido está em preparo",
        subtitle: "Nossos chefs estão preparando tudo"
      },
      {
        title: "Pedido saiu para entrega",
        subtitle: "Em breve chegará até você"
      },
      {
        title: "Pedido confirmado com sucesso!",
        subtitle: "Obrigado por testar o projeto!"
      }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < 4) {
        // Ativa próximo step
        steps[currentStep].classList.add('active');
        steps[currentStep - 1].classList.add('completed');

        // Atualiza linha de progresso
        progressLine.style.height = `${(currentStep / 3) * 100}%`;

        // Atualiza mensagens
        progressTitle.textContent = messages[currentStep].title;
        progressSubtitle.textContent = messages[currentStep].subtitle;

      } else {
        clearInterval(interval);

        // Após completar, envia pro WhatsApp
        setTimeout(() => {
          this.sendToWhatsApp();
        }, 1500);
      }
    }, 3000); // 3 segundos entre cada etapa
  }

  sendToWhatsApp() {
    const data = this.pedidoData;

    let msg = `*PEDIDO*\n\n`;
    msg += `Nome: ${data.nome}\n`;
    msg += `Tel: ${data.telefone}\n`;
    if (data.cep) msg += `CEP: ${data.cep}\n`;
    msg += `Endereço: ${data.endereco}, ${data.bairro}, Nº ${data.numeroEnd}\n`;
    if (data.referencia) msg += `Ref: ${data.referencia}\n`;
    msg += `Pagamento: ${data.pagamento}\n\n`;

    msg += `*ITENS:*\n`;
    this.items.forEach(item => {
      msg += `${item.quantity}x ${item.name} = R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      if (item.notes) msg += `   Obs: ${item.notes}\n`;
    });

    msg += `\n*TOTAL: R$ ${(this.getSubtotal() + this.deliveryFee).toFixed(2)}*`;

    const numero = '5511999999999'; // NÚMERO DA LOJA
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`);

    this.clearCart();
    window.location.reload(); // Recarrega página
  }

  formatOrder() {
    const items = this.items.map(item => {
      let text = `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`;
      if (item.notes) text += `\n   Obs: ${item.notes}`;
      return text;
    }).join('\n');

    const subtotal = this.getSubtotal();
    const total = subtotal + this.deliveryFee;

    return `*NOVO PEDIDO*\n\n${items}\n\nSubtotal: R$ ${subtotal.toFixed(2)}\nEntrega: R$ ${this.deliveryFee.toFixed(2)}\n*Total: R$ ${total.toFixed(2)}*`;
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  vibrateDevice() {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
}

// Inicializar
const cartManager = new CartManager();
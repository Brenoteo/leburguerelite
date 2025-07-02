/**
 * Lazy Loading para Imagens
 * Implementação moderna usando Intersection Observer API
 * Fallback para navegadores antigos
 */

class LazyImageLoader {
  constructor() {
    this.images = [];
    this.observer = null;
    this.placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2FycmVnYW5kby4uLjwvdGV4dD48L3N2Zz4=';
    this.init();
  }

  init() {
    // Verifica se o Intersection Observer é suportado
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback para navegadores antigos
      this.setupFallback();
    }
  }

  setupIntersectionObserver() {
    // Configuração do observer
    const options = {
      root: null, // viewport
      rootMargin: '50px', // carrega 50px antes da imagem entrar na viewport
      threshold: 0.1 // dispara quando 10% da imagem está visível
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observa todas as imagens com data-src
    this.images = document.querySelectorAll('img[data-src]');
    this.images.forEach(img => {
      this.observer.observe(img);
    });
  }

  setupFallback() {
    // Fallback para navegadores sem Intersection Observer
    this.images = document.querySelectorAll('img[data-src]');
    
    // Carrega imagens visíveis imediatamente
    this.images.forEach(img => {
      if (this.isElementInViewport(img)) {
        this.loadImage(img);
      }
    });

    // Listener de scroll para carregar outras imagens
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.images.forEach(img => {
          if (img.dataset.src && this.isElementInViewport(img)) {
            this.loadImage(img);
          }
        });
      }, 100);
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Adiciona classe de loading
    img.classList.add('lazy-loading');

    // Cria uma nova imagem para pré-carregar
    const tempImage = new Image();
    
    tempImage.onload = () => {
      // Remove placeholder e adiciona a imagem real
      img.src = src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      
      // Remove o data-src para evitar recarregamento
      img.removeAttribute('data-src');
      
      // Adiciona animação de fade-in
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
    };

    tempImage.onerror = () => {
      // Em caso de erro, remove classes e mantém placeholder
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      console.warn(`Erro ao carregar imagem: ${src}`);
    };

    // Inicia o carregamento
    tempImage.src = src;
  }

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Método para adicionar novas imagens dinamicamente
  addImage(img) {
    if (this.observer) {
      this.observer.observe(img);
    } else if (this.isElementInViewport(img)) {
      this.loadImage(img);
    }
  }

  // Método para limpeza
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Inicializa o lazy loading quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.lazyImageLoader = new LazyImageLoader();
});

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyImageLoader;
} 
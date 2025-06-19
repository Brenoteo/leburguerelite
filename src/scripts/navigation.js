// Throttle limita execução em intervalos regulares (útil para scroll)
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Menu Hambúrguer
class MobileMenu {
  constructor() {
    this.hamburger = document.querySelector(".menu-toggle");
    this.menu = document.querySelector(".menu-list");
    
    // Cache do estado
    this.isOpen = false;
    
    // Bind mantém contexto correto do 'this'
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    
    this.initialize();
  }
  
  initialize() {
    if (!this.hamburger || !this.menu) return;
    
    // Event listeners
    this.hamburger.addEventListener("click", this.toggle);
    
    // Throttle no scroll para performance
    window.addEventListener("scroll", throttle(() => {
      if (this.isOpen) this.close();
    }, 100));
    
    // Delegação de eventos para clicks fora
    document.addEventListener("click", this.handleClickOutside, true);
  }
  
  toggle(e) {
    e.stopPropagation();
    this.isOpen ? this.close() : this.open();
  }
  
  open() {
    this.isOpen = true;
    this.menu.classList.add("show");
    this.menu.classList.remove("hide");
    
    // Acessibilidade
    this.hamburger.setAttribute("aria-expanded", "true");
  }
  
  close() {
    this.isOpen = false;
    this.menu.classList.remove("show");
    this.menu.classList.add("hide");
    
    // Acessibilidade
    this.hamburger.setAttribute("aria-expanded", "false");
  }
  
  handleClickOutside(e) {
    if (this.isOpen && !e.target.closest(".main-nav")) {
      this.close();
    }
  }
  
  // Limpeza ao destruir
  destroy() {
    this.hamburger?.removeEventListener("click", this.toggle);
    document.removeEventListener("click", this.handleClickOutside, true);
  }
}

// Navegação Sticky
class StickyMenuNavigation {
  constructor() {
    this.nav = document.getElementById('stickyMenuNav');
    this.links = document.querySelectorAll('.sticky-nav-link');
    this.sections = document.querySelectorAll('.section-offset');
    
    // Cache de valores
    this.navHeight = 0;
    this.sectionData = [];
    this.scrollThreshold = 50;
    this.isScrolled = false;
    
    // Bind de métodos
    this.handleScroll = throttle(this.handleScroll.bind(this), 16); // 60fps
    this.updateActiveLink = throttle(this.updateActiveLink.bind(this), 100);
    
    this.initialize();
  }

  initialize() {
    if (!this.nav) return;
    
    // Cache dimensões iniciais
    this.navHeight = this.nav.offsetHeight;
    this.cacheSectionData();
    
    this.bindEvents();
    this.updateActiveLink();
  }
  
  cacheSectionData() {
    // Pré-calcula posições das seções
    this.sectionData = Array.from(this.sections).map(section => ({
      id: section.id,
      top: section.offsetTop,
      height: section.offsetHeight
    }));
  }

  bindEvents() {
    // Scroll otimizado com throttle
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateActiveLink();
    });
    
    // Recalcula ao redimensionar
    window.addEventListener('resize', throttle(() => {
      this.navHeight = this.nav.offsetHeight;
      this.cacheSectionData();
    }, 250));

    // Navegação por clique
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  handleScroll() {
    const scrolled = window.scrollY > this.scrollThreshold;
    
    // Só atualiza se mudou o estado
    if (scrolled !== this.isScrolled) {
      this.isScrolled = scrolled;
      this.nav.classList.toggle('scrolled', scrolled);
    }
  }

  scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return;
    
    const targetPosition = target.offsetTop - this.navHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  updateActiveLink() {
    const scrollPosition = window.scrollY + this.navHeight + 100;
    
    // Encontra seção ativa usando dados cacheados
    let activeSection = null;
    
    for (const section of this.sectionData) {
      if (scrollPosition >= section.top && 
          scrollPosition < section.top + section.height) {
        activeSection = section.id;
        break;
      }
    }
    
    // Atualiza links apenas se mudou
    if (this.currentActiveSection === activeSection) return;
    
    this.currentActiveSection = activeSection;
    
    // Remove todas as classes active primeiro
    this.links.forEach(link => {
      const isActive = link.getAttribute('data-section') === activeSection;
      link.classList.toggle('active', isActive);
    });
  }
}

// Inicialização com gerenciamento de instâncias
let mobileMenu = null;
let stickyNav = null;

document.addEventListener('DOMContentLoaded', () => {
  mobileMenu = new MobileMenu();
  stickyNav = new StickyMenuNavigation();
});

// Limpeza ao sair (previne memory leaks)
window.addEventListener('beforeunload', () => {
  mobileMenu?.destroy();
});
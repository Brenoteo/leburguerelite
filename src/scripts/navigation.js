const hamburger = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-list");

// Função única para alternar menu
function toggleMenu(show) {
  menu.classList.toggle("show", show);
  menu.classList.toggle("hide", !show);
}

// Clique no hambúrguer
hamburger.addEventListener("click", () => {
  const isShowing = menu.classList.contains("show");
  toggleMenu(!isShowing);
});

// Fechar ao rolar
window.addEventListener("scroll", () => {
  if (menu.classList.contains("show")) {
    toggleMenu(false);
  }
});

// OPCIONAL: Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".main-nav") && menu.classList.contains("show")) {
    toggleMenu(false);
  }
});

// Navegação Sticky
class StickyMenuNavigation {
  constructor() {
    this.nav = document.getElementById('stickyMenuNav');
    this.links = document.querySelectorAll('.sticky-nav-link');
    this.sections = document.querySelectorAll('.section-offset');
    this.initialize();
  }

  initialize() {
    if (!this.nav) return;

    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.updateActiveLink();
    });

    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }

  scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
      const navHeight = this.nav.offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  updateActiveLink() {
    const scrollPosition = window.scrollY + this.nav.offsetHeight + 100;

    let activeSection = null;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSection = section.id;
      }
    });

    this.links.forEach(link => {
      const targetSection = link.getAttribute('data-section');

      if (targetSection === activeSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new StickyMenuNavigation();
});
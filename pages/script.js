document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle"); // Botão hambúrguer
  const menuList = document.querySelector(".menu-list"); // Menu suspenso
  const mediaQuery = window.matchMedia("(max-width: 788px)"); // Responsivo

  // Função para controlar o estado inicial do menu
  const initializeMenu = () => {
    if (mediaQuery.matches) {
      // Telas menores (abaixo ou igual a 788px)
      menuList.style.display = "none"; // Esconder menu
      menuList.classList.remove("show");
    } else {
      // Telas maiores (acima de 788px)
      menuList.style.display = "flex"; // Mostrar menu
      menuList.classList.remove("hide");
    }
  };

  // Função para alternar o menu no mobile
  const toggleMenu = () => {
    if (menuList.classList.contains("show")) {
      menuList.classList.remove("show");
      menuList.classList.add("hide");
      menuList.addEventListener(
        "animationend",
        () => {
          if (menuList.classList.contains("hide")) {
            menuList.style.display = "none";
            menuList.classList.remove("hide");
          }
        },
        { once: true }
      );
    } else {
      menuList.style.display = "flex";
      menuList.classList.add("show");
    }
  };

  // Evento de clique no botão hambúrguer
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Fecha o menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (!menuList.contains(e.target) && !menuToggle.contains(e.target)) {
      if (menuList.classList.contains("show")) {
        toggleMenu();
      }
    }
  });

  // Fecha o menu ao rolar a página (somente no mobile)
  window.addEventListener("scroll", () => {
    if (mediaQuery.matches && menuList.classList.contains("show")) {
      toggleMenu();
    }
  });

  // Verificar quando redimensionar a janela
  mediaQuery.addEventListener("change", initializeMenu);

  // Inicializar o estado do menu
  initializeMenu();
});
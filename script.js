document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menuList = document.querySelector(".menu-list");
  let lastScrollY = window.scrollY;

  // Abrir/fechar o menu ao clicar no botão
  menuToggle.addEventListener("click", () => {
    if (menuList.classList.contains("show")) {
      closeMenuWithEffect();
    } else {
      menuList.classList.add("show");
      menuList.classList.add("fade-in");
      setTimeout(() => menuList.classList.remove("fade-in"), 300);
    }
  });

  // Fechar o menu ao rolar para baixo
  window.addEventListener("scroll", () => {
    if (menuList.classList.contains("show")) {
      const currentScrollY = window.scrollY;

      // Verifica se o usuário está rolando para baixo
      if (currentScrollY > lastScrollY) {
        closeMenuWithEffect();
      }

      lastScrollY = currentScrollY;
    }
  });

  function closeMenuWithEffect() {
    menuList.classList.add("fade-out");
    setTimeout(() => {
      menuList.classList.remove("show");
      menuList.classList.remove("fade-out");
    }, 300);
  }
});
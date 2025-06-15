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
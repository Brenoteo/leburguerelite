// Assumindo que você tem uma div #main-content em todas as páginas
const mainContent = document.querySelector("#main-content");

// Extrai apenas o conteúdo da nova página
const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");
const newContent = doc.querySelector("#main-content");

if (newContent) {
  mainContent.innerHTML = newContent.innerHTML;
}

const hamburger = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-list");

// Evento de clique ao botão
hamburger.addEventListener("click", () => {
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    menu.classList.add("hide");
  } else {
    menu.classList.remove("hide");
    menu.classList.add("show");
  }
});

// Evento de scroll para fechar o menu
window.addEventListener("scroll", () => {
  if (menu.classList.contains("show")) {
    menu.classList.remove("show");
    menu.classList.add("hide");
  }
});

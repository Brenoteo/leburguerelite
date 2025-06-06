const hamburger = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu-list');

// Evento de clique ao botão
hamburger.addEventListener('click', () => {
  if (menu.classList.contains('show')) {
    menu.classList.remove('show');
    menu.classList.add('hide');
  } else {
    menu.classList.remove('hide');
    menu.classList.add('show');
  }
});

// Evento de scroll para fechar o menu
window.addEventListener('scroll', () => {
  if (menu.classList.contains('show')) {
    menu.classList.remove('show');
    menu.classList.add('hide');
  }
});
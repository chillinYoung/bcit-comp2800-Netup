function openMenu() {
  document.querySelector(".mobile-nav").style.height = "calc(100vh - 4.7rem)";
  // document.querySelector(".mobile-nav").style.height = "100vh";
  document.querySelector(".mobile-nav-links").style.height = "100%";
  document.querySelector(".mobile-menu-open-btn").style.display = "none";
  document.querySelector(".mobile-menu-close-btn").style.display = "inline";
}

function closeMenu() {
  document.querySelector(".mobile-nav").style.height = "0";
  document.querySelector(".mobile-nav-links").style.height = "0";
  document.querySelector(".mobile-menu-open-btn").style.display = "inline";
  document.querySelector(".mobile-menu-close-btn").style.display = "none";
}

function resizeMenu() {
  if (window.matchMedia("(min-width: 640px)").matches) {
    closeMenu();
  }
}

window.onresize = function() {resizeMenu()};


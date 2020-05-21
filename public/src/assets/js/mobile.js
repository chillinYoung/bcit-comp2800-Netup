// mobile nav open
function openMenu() {
  document.querySelector(".mobile-nav").style.height = "calc(100vh - 4.7rem)";
  document.querySelector(".mobile-nav-links").style.height = "100%";
  document.querySelector(".mobile-menu-open-btn").style.display = "none";
  document.querySelector(".mobile-menu-close-btn").style.display = "inline";
}

// mobile nav close
function closeMenu() {
  document.querySelector(".mobile-nav").style.height = "0";
  document.querySelector(".mobile-nav-links").style.height = "0";
  document.querySelector(".mobile-menu-open-btn").style.display = "inline";
  document.querySelector(".mobile-menu-close-btn").style.display = "none";
}


// hide mobile nav on window resizing
window.onresize = function() {resizeMenu()};
function resizeMenu() {
  if (window.matchMedia("(min-width: 640px)").matches) {
    closeMenu();
  }
}

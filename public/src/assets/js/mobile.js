function openMenu() {
  // document.querySelector(".mobile-nav").style.height = "100%";
  document.querySelector(".mobile-nav").style.height = "13rem";
  document.querySelector(".mobile-menu-open-btn").style.display = "none";
  document.querySelector(".mobile-menu-close-btn").style.display = "inline";
  document.querySelector(".mobile-nav-links").style.display = "block";
}

function closeMenu() {
  document.querySelector(".mobile-nav").style.height = "0";
  document.querySelector(".mobile-menu-open-btn").style.display = "inline";
  document.querySelector(".mobile-menu-close-btn").style.display = "none";
  document.querySelector(".mobile-nav-links").style.display = "none";
}

const searchInp = document.querySelector("#allevents-search-keyword");



// EASTER EGG
window.onresize = function() {easterEgg()};
function easterEgg() {
  if (searchInp.value.toLowerCase().trim() == "karen") {
    changeColor();

    if (window.matchMedia("(min-width: 1025px)").matches) {
      visibleChris(); 
      startFireworks(); 
    }
  }

  if (window.matchMedia("(max-width: 1024px)").matches) {
    hideChris();
  }
}

const searchInp = document.querySelector("#allevents-search-keyword");
const titles = document.querySelectorAll(".video-post-title");

function eventSearch() {
  easterEgg();
  titles.forEach(title => {
    let target = title.innerHTML.toLowerCase();
    if (!target.includes(searchInp.value)) {
      title.parentNode.parentNode.style.display = "none";
    }
    if (target.includes(searchInp.value)) {
      title.parentNode.parentNode.style.display = "block";      
    }
  })
};


// EASTER EGG
window.onresize = function() {easterEgg()};
function easterEgg() {
  if (searchInp.value.toLowerCase().trim() == "karen") {
    changeColor();
    startFireworks(); 


    if (window.matchMedia("(min-width: 1025px)").matches) {
      visibleChris(); 
    }
  }

  if (window.matchMedia("(max-width: 1024px)").matches) {
    hideChris();
  }
};

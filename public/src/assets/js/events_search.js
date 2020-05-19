const searchInp = document.querySelector("#allevents-search-keyword");
const titles = document.querySelectorAll(".video-post-title");

function eventSearch() {
  easterEgg();
  titles.forEach(title => {
    let target = title.innerHTML.toLowerCase();
    if (!target.includes(searchInp.value.toLowerCase())) {
      title.parentNode.parentNode.style.display = "none";
    }
    if (target.includes(searchInp.value.toLowerCase())) {
      title.parentNode.parentNode.style.display = "block";      
    }
  })
};


// EASTER EGG
window.onresize = function() {easterEgg()};
function easterEgg() {

  // if input is 'karen', insert canvas, execute fireworks, and remove it
  if (searchInp.value.toLowerCase().trim() == "karen") {
    document.querySelector("#allevents-search-keyword").blur();
    window.scrollTo(0,1);
    let parent = document.querySelector(".body-allevents");
    let figurePos = document.querySelector("figure");
    let newDiv = document.createElement("div");
    newDiv.id = "fireworks";
    parent.insertBefore(newDiv, figurePos);

    changeColor();
    startFireworks();
    
    setTimeout(function () {
      document.querySelector('canvas').style.transition = "opacity 1s";
      document.querySelector('canvas').style.opacity = "0";
      setTimeout(function () {
        document.querySelector('#fireworks').remove();
      }, 500);
    }, 10000);



    if (window.matchMedia("(min-width: 1025px)").matches) {
      visibleChris(); 
    }
  }

  if (window.matchMedia("(max-width: 1024px)").matches) {
    hideChris();
  }
};

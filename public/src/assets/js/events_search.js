// search feature on events pages (all, health, social....)
const searchInp = document.querySelector("#allevents-search-keyword");
const titles = document.querySelectorAll(".video-post-title");

function eventSearch() {
  easterEgg();  // check easterEgg condition

  titles.forEach(title => {
    let target = title.innerHTML.toLowerCase();

    // if the user input and event title is matched, display it
    if (!target.includes(searchInp.value.toLowerCase())) {
      title.parentNode.parentNode.style.display = "none";
    }

    // if the user input and event title is NOT matched, hide it
    if (target.includes(searchInp.value.toLowerCase())) {
      title.parentNode.parentNode.style.display = "block";      
    }
  })
};


// EASTER EGG 
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
    startFireworks();

    // temporary dark theme change until refresh the page
    changeColor();

    // stop fireworkds after 10 seconds
    setTimeout(function () {
      document.querySelector('canvas').style.transition = "opacity 1s";
      document.querySelector('canvas').style.opacity = "0";
      setTimeout(function () {
        document.querySelector('#fireworks').remove();
      }, 500);
    }, 10000);

    // show chris picture only on the pc
    if (window.matchMedia("(min-width: 1025px)").matches) {
      visibleChris(); 
    }
  }
};


window.onresize = function() {
  // hide chris picture on mobile and tablet devices
  if (window.matchMedia("(max-width: 1024px)").matches) {
    hideChris();
  }
};


// functions of mouse trailing feature (Esater Egg, Chris picture)
let mouse = {x:100, y:100};
let xPosition = 0;
let yPosition = 0;
const chrisImage = document.querySelector("#chrisFace");

function moveChris(chrisImageElement) {

  function onEnter() {    
    chrisImageElement.style.left = mouse.x + "px";    
    chrisImageElement.style.top = mouse.y + "px";
    requestAnimationFrame(onEnter);
  }
  onEnter();
}
    
function onMove(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
}

function visibleChris() {
  document.addEventListener('mousemove', onMove, false);
  chrisImage.style.borderRadius = "50%";
  chrisImage.style.border = "3px solid white";
  chrisImage.style.display = "block";
  moveChris(chrisImage);
}

function hideChris() {
  chrisImage.style.display = "none";
  chrisImage.style.top = "0";
  chrisImage.style.left = "0";
  document.removeEventListener('mousemove', onMove, false);
}
  
  

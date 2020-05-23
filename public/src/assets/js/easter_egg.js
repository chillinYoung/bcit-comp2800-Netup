// functions of mouse trailing feature (Esater Egg, Chris picture)
let mouse = {x:100, y:100};
let xPosition = 0;
let yPosition = 0;
const chrisImage = document.querySelector("#chrisFace");

/**
 * Move Chris's image with the mouse cursor
 * @param {Object} chrisImageElement - the image element with src to an image with Chris' head
 */
function moveChris(chrisImageElement) {

  /**
   * This is to ensure every time the mouse moves, Chris's image also moves with it
   */
  function onEnter() {    
    chrisImageElement.style.left = mouse.x + "px";    
    chrisImageElement.style.top = mouse.y + "px";
    requestAnimationFrame(onEnter);
  }
  onEnter();
}

/**
 * @param {object} e - the default event that gets passed to the function when event is triggered 
 */
function onMove(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
}

/**
 * Causes Chris to become visible
 */
function visibleChris() {
  document.addEventListener('mousemove', onMove, false);
  chrisImage.style.borderRadius = "50%";
  chrisImage.style.border = "3px solid white";
  chrisImage.style.display = "block";
  moveChris(chrisImage);
}

/**
 * Causes Chris to become invisible during the fireworks animation
 */
function hideChris() {
  chrisImage.style.display = "none";
  chrisImage.style.top = "0";
  chrisImage.style.left = "0";
  document.removeEventListener('mousemove', onMove, false);
}
  
  

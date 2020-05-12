let mouse = {x:100, y:100};
let xPosition = 0;
let yPosition = 0;
document.addEventListener('mousemove', onMove, false);

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




  
  
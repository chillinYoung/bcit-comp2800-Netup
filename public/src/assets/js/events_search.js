const searchInp = document.querySelector("#allevents-search-keyword");

function eventsSearch() {
  if (searchInp.value.toLowerCase().trim() == "karen") {
    changeColor();
    //'<img id="chrisFace" alt="surprise" src="/src/assets/images/chris_face.jpeg">';
    let chrisImage = document.querySelector("#chrisFace");
    chrisImage.style.visibility = "visible";
    moveChris(chrisImage);
    startFireworks();
  }
}


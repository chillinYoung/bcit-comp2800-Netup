const searchInp = document.querySelector("#allevents-search-keyword");
const mainIndex = document.querySelector(".main-index");

function eventsSearch() {
  if (searchInp.value.toLowerCase().trim() == "karen") {
    changeColor();
    mainIndex.innerHTML = '';
    //'<img id="chrisFace" alt="surprise" src="/src/assets/images/chris_face.jpeg">';
    let chrisImage = document.querySelector("#chrisFace");
    chrisImage.style.visibility = "visible";
    moveChris(chrisImage);
  }
}


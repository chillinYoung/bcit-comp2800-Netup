const searchInp = document.querySelector("#allevents-search-keyword");

function eventsSearch() {
  if (searchInp.value.toLowerCase().trim() == "karen") {
    changeColor();
  }
}


document.querySelector("#all-events-topic-select").onchange = (e) => {
  let selectedValue = e.target.selectedIndex;
  getPage(e.target[selectedValue].innerText);
} 

function getPage(value) {
  if (value !== "All Topics") {
    fetch(`/allEvents/${value.toLowerCase()}`)
    .then(response => {
      window.location.replace(response.url);
    })
    .catch(error => console.error(error))
  } else {
    fetch("/allEvents")
    .then(response => {
      window.location.replace(response.url);
    })
    .catch(error => console.error(error));
  }

}
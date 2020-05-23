// topic filtering on 'Events' page
document.querySelector("#all-events-topic-select").onchange = (e) => {
  let selectedValue = e.target.selectedIndex;
  getPage(e.target[selectedValue].innerText);
} 

/**
 * @param {string} value - value of the selected topic 
 */
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

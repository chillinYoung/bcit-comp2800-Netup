function deleteConfirm(id) {
  closeAllConfirm();
  document.querySelector(".warn-" + id).style.width = "100%";
  document.querySelector(".warn-" + id + " span").style.display = "block";
  document.querySelector(".warn-" + id + " div").style.display = "flex";
}

function closeAllConfirm() {
  document.querySelectorAll(".myevents-warn").forEach(elem => {
    elem.style.width = "0";
  });
  document.querySelectorAll(".myevents-warn span").forEach(elem => {
    elem.style.display = "none";
  });
  document.querySelectorAll(".myevents-warn div").forEach(elem => {
    elem.style.display = "none";
  });
}

window.onscroll = function() {closeAllConfirm()};

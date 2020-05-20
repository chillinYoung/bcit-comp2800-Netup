function deleteConfirm(id) {
  closeAllConfirm();
  document.querySelector(".warn-" + id).style.width = "100%";
  setTimeout(function () {
    document.querySelector(".warn-" + id + " span").style.display = "block";
    document.querySelector(".warn-" + id + " div").style.display = "flex";
    document.querySelector(".warn-" + id + " span").style.opacity = "1";
  }, 300);
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
  document.querySelectorAll(".myevents-warn span").forEach(elem => {
    elem.style.opacity = "0";
  });
}

window.onscroll = function() {closeAllConfirm()};

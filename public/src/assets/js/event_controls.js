function joinToJoined(eventIdAsId) {
  document.getElementById(eventIdAsId).innerHTML = "Joined";
  document.getElementById(eventIdAsId).removeAttribute("formmethod");
  document.getElementById(eventIdAsId).removeAttribute("formaction");
  document.getElementById(eventIdAsId).removeAttribute("onclick");
  document.getElementById(eventIdAsId).setAttribute("class", "video-post-joined");
}

function joinToJoinedDetail(eventIdAsId) {
  document.getElementById(eventIdAsId).innerHTML = "Joined";
  document.getElementById(eventIdAsId).removeAttribute("formmethod");
  document.getElementById(eventIdAsId).removeAttribute("formaction");
  document.getElementById(eventIdAsId).removeAttribute("onclick");
  document.getElementById(eventIdAsId).setAttribute("class", "details-joined-btn");
}


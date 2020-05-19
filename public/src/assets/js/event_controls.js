function joinToJoined(eventIdAsId) {
  let parent = document.getElementById(eventIdAsId).parentNode;
  document.getElementById(eventIdAsId).remove();
  let new_btn = document.createElement("button");
  parent.appendChild(new_btn);
  new_btn.className = "video-post-joined";
  new_btn.innerHTML = "Joined";
}

function joinToJoinedDetail(eventIdAsId) {
  let parent = document.getElementById(eventIdAsId).parentNode;
  document.getElementById(eventIdAsId).remove();
  let new_btn = document.createElement("button");
  parent.appendChild(new_btn);
  new_btn.className = "details-joined-btn";
  new_btn.innerHTML = "Joined";
}


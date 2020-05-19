function joinToJoined(eventIdAsId) {
  let parent = document.getElementById(eventIdAsId).parentNode;
  document.getElementById(eventIdAsId).remove();
  let newBtn = document.createElement("button");
  parent.appendChild(newBtn);
  newBtn.className = "video-post-joined";
  newBtn.innerHTML = "Joined";
}

function joinToJoinedDetail(eventIdAsId) {
  let parent = document.getElementById(eventIdAsId).parentNode;
  document.getElementById(eventIdAsId).remove();
  let newBtn = document.createElement("button");
  parent.appendChild(newBtn);
  newBtn.className = "details-joined-btn";
  newBtn.innerHTML = "Joined";
}


// join event by clicking join button
$(document).ready(function(){

    $('.video-post-join').on('click', function() {

        $.ajax({
            url: '/joinEvent',
            method: 'POST',
            data: {
                id: this.id,
            },
            success: function (response) {
                // let's not relocate the page! I commented out this (from Young)
                // window.location.assign("/allEventsSuccess");
             }
        }).
        done(function(data){
        })
        .fail(function(error){
            window.location.assign("/loginRequired");
        })
    })

    $('.details-join-btn').on('click', function() {

        $.ajax({
            url: '/joinEvent',
            method: 'POST',
            data: {
                id: this.id,
            },
            success: function (response) {
             }
        }).
        done(function(data){
        })
        .fail(function(error){
            window.location.assign("/loginRequired");
        })
    })
})

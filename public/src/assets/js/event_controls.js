// Change the colour of the join event button if it is already 
//joined by the user inside of the 'all events' page.
function joinToJoined(eventIdAsId) {
  let parent = document.getElementById(eventIdAsId).parentNode;
  document.getElementById(eventIdAsId).remove();
  let newBtn = document.createElement("button");
  parent.appendChild(newBtn);
  newBtn.className = "video-post-joined";
  newBtn.innerHTML = "Joined";
}

// Change the colour of the join button if the event is already joined inside the event's detail page.
function joinToJoinedDetail(eventIdAsId) {
  let parent = document.getElementById(eventIdAsId).parentNode;
  document.getElementById(eventIdAsId).remove();
  let newBtn = document.createElement("button");
  parent.appendChild(newBtn);
  newBtn.className = "details-joined-btn";
  newBtn.innerHTML = "Joined";
}


// Logic for joining an event by clicking join button
$(document).ready(function(){

    // Joining an event on the 'all events' page.
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

    // Joining an event inside of the specific event's details page.
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

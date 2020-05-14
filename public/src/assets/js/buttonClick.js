
$(document).ready(function(){

    $('.video-post-join').on('click', function() {

        $.ajax({
            url: '/joinEvent',
            method: 'POST',
            data: {
                id: this.id,
            },
            success: function (response) {
                window.location.assign("/allEventsSuccess");
             }
        }).
        done(function(data){
        })
        .fail(function(error){
            window.location.assign("/loginRequired");
        })
    })
})
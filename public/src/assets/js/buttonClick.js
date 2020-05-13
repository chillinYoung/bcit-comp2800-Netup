$(document).ready(function(){

    $('.video-post-join').on('click', function() {

        $.ajax({
            url: '/joinEvent',
            method: 'POST',
            data: {
                id: this.id,
            }
        }).
        done(function(data){
            console.log("success")
        })
        .fail(function(error){
            console.log(error);
        })

    })
})
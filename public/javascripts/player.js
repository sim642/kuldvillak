var socket = io();

$(function() {

var myid, myplayer;

socket.emit('name', prompt('Nimi: '), function(id, player) {
    myid = id;
    myplayer = player;
});

socket.on('players', function(players) {
    $.each(players, function(id, player) {
        if (id == myid) {
            myplayer = player;

            $('#myname').text(myplayer.name);
            $('#myscore').text(myplayer.score);
        }
    })
});

socket.on('answerers', function(answerers) {
    $.each(answerers, function(i, id) {
        if (id == myid) {
            var val = i * 64;
            $('#player-pane').css('background', 'rgb(255, ' + val + ', ' + val + ')');
        }
    });
});

$(document).keydown(function(e) {
    if (e.which == 32) // space
        socket.emit('answer');
});

$(document).on('click touchend', function() {
    socket.emit('answer');
})

socket.on('unpick', function() {
    $('#player-pane').css('background', '');
});

socket.on('timer', function(id) {
    if (id == myid)
        $('#player-pane').css('background', 'green');
});

socket.on('timeout', function(id) {
    if (id == myid)
        $('#player-pane').css('background', '');
});

});

var socket = io();

$(function() {

var myid, myplayer;

socket.emit('name', prompt('Nimi: '), function(id, player) {
    myid = id;
    myplayer = player;
});

$('#answer').click(function() {
    socket.emit('answer');
});

$(document).keydown(function(e) {
    if (e.which == 32) // space
        socket.emit('answer');
});

});

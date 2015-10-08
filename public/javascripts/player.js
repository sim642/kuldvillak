var socket = io();

$(function() {


socket.emit('name', prompt('Nimi: '));

$('#answer').click(function() {
    socket.emit('answer');
});

$(document).keydown(function(e) {
    if (e.which == 32) // space
        socket.emit('answer');
});

});

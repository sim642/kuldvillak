var socket = io();

$(function() {
    $('#test').click(function() {
        socket.emit('test');
    });
});

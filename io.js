var io = require('socket.io')();

io.on('connection', function(socket) {
    socket.on('test', function() {
        console.log('asd');
    });
});

module.exports = io;

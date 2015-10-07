var io = require('socket.io')();
var fs = require('fs');

var data = JSON.parse(fs.readFileSync('./data/test.json'));
var players = {};


io.on('connection', function(socket) {
    socket.on('name', function(name) {
        players[socket.id] = {
            name: name,
            score: 0,
            admin: name == 'admin' // TODO: add more security
        };
        io.emit('players', players);

        socket.emit('board', data.categories.map(function(category) {
            return category.name;
        }), data.multiplier);
    });

    socket.on('pick', function(j, i) {
        io.emit('pick', j, i, data.categories[j].questions[i].question);
    });

    socket.on('unpick', function() {
        if (!players[socket.id].admin)
            return;

        io.emit('unpick');
    });

    socket.on('disconnect', function() {
        delete players[socket.id];
        io.emit('players', players);
    });
});

module.exports = io;

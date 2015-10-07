var io = require('socket.io')();
var fs = require('fs');

var data = JSON.parse(fs.readFileSync('./data/test.json'));
var players = {};

io.on('connection', function(socket) {
    players[socket.id] = {
        score: 0
    };

    console.log(players);

    socket.emit('board', data.categories.map(function(category) {
        return category.name;
    }), data.multiplier);

    socket.on('pick', function(j, i) {
        console.log('pick', j, i);
        io.emit('pick', j, i, data.categories[j].questions[i].question);
    });

    socket.on('unpick', function() {
        io.emit('unpick');
    });

    socket.on('disconnect', function() {
        delete players[socket.id];
    });
});

module.exports = io;

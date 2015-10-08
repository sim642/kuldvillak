var io = require('socket.io')();
var fs = require('fs');

var data = JSON.parse(fs.readFileSync('./data/test.json'));
var players = {};

var actives = [];
for (var i = 0; i < 5; i++)
{
    var row = [];
    for (var j = 0; j < 6; j++)
        row.push(true);
    actives.push(row);
}

var curp = null, curj = null, curi = null;
var answerers = null;

io.on('connection', function(socket) {
    var player = null;

    socket.on('name', function(name, callback) {
        player = players[socket.id] = {
            name: name,
            score: 0,
            admin: name == 'admin' // TODO: add more security
        };

        callback(socket.id, player);

        if (player.admin)
            socket.join('admin');

        io.emit('players', players);

        socket.emit('board', data.categories.map(function(category) {
            return category.name;
        }), actives, data.multiplier);
    });

    socket.on('pick', function(j, i) {
        io.emit('pick', j, i, data.categories[j].questions[i].question);

        io.to('admin').emit('answer', data.categories[j].questions[i].answer);

        curj = j;
        curi = i;
        actives[i][j] = false;
        answerers = [];
    });

    socket.on('unpick', function() {
        if (!player.admin)
            return;

        io.emit('unpick');

        curj = null;
        curi = null;
        answerers = null;
    });

    socket.on('score', function(id, correct) {
        if (!player.admin)
            return;

        players[id].score += (correct ? 1 : -1) * (curi + 1) * 10 * data.multiplier;
        io.emit('players', players);
    });

    socket.on('answer', function() {
        if (answerers !== null && answerers.indexOf(socket.id) < 0) {
            answerers.push(socket.id);
            io.emit('answerers', answerers);
        }
    });

    socket.on('timer', function(id) {
        if (!player.admin)
            return;

        io.emit('timer', id);
        console.log('timer', id);

        setTimeout(function() {
            io.emit('timeout', id);
            console.log('timeout', id);
        }, 5000);
    });

    socket.on('disconnect', function() {
        delete players[socket.id];
        player = null;
        io.emit('players', players);
    });
});

module.exports = io;

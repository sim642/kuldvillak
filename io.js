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
    socket.on('name', function(name) {
        players[socket.id] = {
            name: name,
            score: 0,
            admin: name == 'admin' // TODO: add more security
        };
        if (players[socket.id].admin)
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
        if (!players[socket.id].admin)
            return;

        io.emit('unpick');

        curj = null;
        curi = null;
        answerers = null;
    });

    socket.on('score', function(id, correct) {
        if (!players[socket.id].admin)
            return;

        players[id].score += (correct ? 1 : -1) * (curi + 1) * 10 * data.multiplier;
        io.emit('players', players);
    });

    socket.on('answer', function() {
        if (answerers !== null && answerers.indexOf(socket.id) < 0) {
            answerers.push(socket.id);
            console.log(answerers);
            io.emit('answerers', answerers);
        }
    });

    socket.on('disconnect', function() {
        delete players[socket.id];
        io.emit('players', players);
    });
});

module.exports = io;

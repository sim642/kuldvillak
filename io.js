var io = require('socket.io')();
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json'));
var data = JSON.parse(fs.readFileSync('./data/' + config.data + '.json'));
var players = {};

var actives = [];
for (var i = 0; i < 5; i++)
{
    var row = [];
    for (var j = 0; j < 6; j++)
        row.push(true);
    actives.push(row);
}
var final = false;

var curj = null, curi = null;
var answerers = null;

io.on('connection', function(socket) {
    var player = null;

    socket.on('name', function(name, callback) {
        player = players[socket.id] = {
            name: name,
            score: 0,
            admin: name == config.adminName
        };

        callback(socket.id, player);

        if (player.admin)
            socket.join('admin');

        io.emit('players', players);
        socket.emit('answerers', answerers);

        socket.emit('board', data.categories.map(function(category) {
            return category.name;
        }), actives, data.multiplier);
    });

    socket.on('pick', function(j, i) {
        if (!player.admin)
            return;

        io.emit('pick', j, i, data.categories[j].questions[i].question);

        io.to('admin').emit('answer', data.categories[j].questions[i].answer);

        curj = j;
        curi = i;
        actives[i][j] = false;
    });

    socket.on('answering', function() {
        if (!player.admin)
            return;

        if (curj !== null && curi !== null) // picked
            answerers = [];
        else if (final) {
            io.emit('pickfinal', data.final.question);

            io.to('admin').emit('answer', data.final.answer);
        }
    });

    socket.on('unpick', function() {
        if (!player.admin)
            return;

        io.emit('unpick');

        curj = null;
        curi = null;
        answerers = null;

        var done = true;
        for (var j = 0; j < actives.length; j++)
        {
            for (var i = 0; i < actives[j].length; i++)
            {
                if (actives[j][i])
                    done = false;
            }
        }

        if (done) {
            final = true;

            setTimeout(function() {
                io.emit('pickfinal', data.final.category);

                io.to('admin').emit('answer', "");
            }, 2000);
        }
    });

    socket.on('score', function(id, correct) {
        if (!player.admin)
            return;

        if (answerers === null)
            return;

        players[id].score += (correct ? 1 : -1) * (curi + 1) * 10 * data.multiplier;

        var i = answerers.indexOf(id);
        if (i >= 0) {
            answerers.splice(i, 1);
            io.emit('answerers', answerers);
        }

        io.emit('players', players);
        io.emit('answerers', answerers);
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

        setTimeout(function() {
            io.emit('timeout', id);

            if (answerers) {
                var i = answerers.indexOf(id);
                if (i >= 0) {
                    answerers.splice(i, 1);
                    io.emit('answerers', answerers);
                }
            }
        }, data.timer * 1000);
    });

    socket.on('disconnect', function() {
        if (answerers !== null) {
            var i = answerers.indexOf(socket.id);
            if (i >= 0)
                answerers.splice(i, 1);
        }

        delete players[socket.id];
        player = null;
        io.emit('players', players);
        io.emit('answerers', answerers);
    });
});

module.exports = io;

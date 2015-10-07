var io = require('socket.io')();
var fs = require('fs');

var data = JSON.parse(fs.readFileSync('./data/test.json'));

io.on('connection', function(socket) {
    socket.emit('board', data.categories.map(function(category) {
        return category.name;
    }), data.multiplier);

    socket.on('pick', function(j, i) {
        console.log('pick', j, i);
        socket.emit('pick', j, i, data.categories[j].questions[i].question);
    });
});

module.exports = io;

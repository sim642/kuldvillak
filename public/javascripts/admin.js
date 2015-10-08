var socket = io();

$(function() {


$('#overlay-outer').hide();

socket.emit('name', prompt('Nimi: '));

socket.on('players', function(players) {
    $('#names').empty();
    $('#scores').empty();

    for (var id in players) {
        (function(id) {
            var player = players[id];

            if (!player.admin) {
                $('#names').append($('<td></td>').text(player.name));
                $score = $('<td></td>');

                var decr = $('<button></button>').text('-').click(function() {
                    socket.emit('score', id, false);
                });
                var incr = $('<button></button>').text('+').click(function() {
                    socket.emit('score', id, true);
                });

                $score.append(decr).append(player.score).append(incr);
                $('#scores').append($score);
            }

        })(id);
    }
});

socket.on('board', function(categories, actives, multiplier) {
    var $grid = $('#grid');
    $grid.empty();

    {
        var row = $('<tr></tr>').addClass('heading');

        for (var j = 0; j < 6; j++) {
            var cell = $("<td></td>");
            cell.text(categories[j]);
            row.append(cell);
        }

        $grid.append(row);
    }

    for (var i = 0; i < 5; i++) {
        var row = $("<tr></tr>").addClass('values');

        for (var j = 0; j < 6; j++) {
            var cell = $("<td></td>");
            cell.attr('data-i', i);
            cell.attr('data-j', j);

            if (actives[i][j]) {
                cell.addClass('active');
                cell.text((i + 1) * 10 * multiplier);
            }

            row.append(cell);
        }

        $grid.append(row);
    }

    $("#grid .values td").click(function() {
        var $cell = $(this);
        socket.emit('pick', parseInt($cell.attr('data-j')), parseInt($cell.attr('data-i')));
    });
});

socket.on('pick', function(j, i, question) {
    $cell = $('#grid .values td[data-j="' + j + '"][data-i="' + i + '"]');
    if ($cell.text() != "") {
        $cell.removeClass("active");
        $("#overlay").text($cell.data('j') + "-" + $cell.data('i') + " " + $cell.text() + " " + question);

        $("#overlay-outer").css({
            "left": $cell.offset().left + "px",
            "top": $cell.offset().top + "px",
            "width": 100 * $cell.outerWidth() / $(window).width() + "%",
            "height": 100 * $cell.outerHeight() / $(window).height() + "%",
            "opacity": "0.0",
            "fontSize": $cell.css("font-size")
        }).show();

        $("#overlay-outer").animate({
            "left": "0px",
            "top": "0px",
            "width": "100%",
            "height": $('#grid-pane').outerHeight(),
            "opacity": "1.0",
            "fontSize": "15vh"
        }, "slow", function() {
            $cell.text("");
        });

        /*$("#overlay").fadeIn(function() {
            $cell.html("&nbsp;");
        });*/
    }
});

$("#overlay-outer").click(function() {
    socket.emit('unpick');
});

socket.on('unpick', function() {
    $("#overlay-outer").fadeOut();
});


});

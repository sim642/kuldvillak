var socket = io();

$(function() {


$('#overlay-outer').hide();

socket.emit('name', prompt('Nimi: '));

socket.on('players', function(players) {
    $('#names').empty();
    $('#scores').empty();

    for (var id in players) {
        var player = players[id];

        if (!player.admin) {
            $('#names').append($('<td></td>').text(player.name));
            $('#scores').append($('<td></td>').text(player.score));
        }
    }
});

socket.on('board', function(categories, multiplier) {
    var $grid = $('#grid');

    {
        var row = $('<tr></tr>');

        for (var j = 0; j < 6; j++) {
            var cell = $("<td></td>");
            cell.text(categories[j]);
            row.append(cell);
        }

        $('thead', $grid).empty().append(row);
    }

    $('tbody', $grid).empty();
    for (var i = 0; i < 5; i++) {
        var row = $("<tr></tr>");

        for (var j = 0; j < 6; j++) {
            var cell = $("<td></td>").addClass("active");
            cell.attr('data-i', i);
            cell.attr('data-j', j);
            cell.text((i + 1) * 10 * multiplier);
            row.append(cell);
        }

        $('tbody', $grid).append(row);
    }

    $("#grid tbody td").click(function() {
        var $cell = $(this);
        socket.emit('pick', $cell.attr('data-j'), $cell.attr('data-i'));
    });
});

socket.on('pick', function(j, i, question) {
    $cell = $('#grid tbody td[data-j="' + j + '"][data-i="' + i + '"]');
    if ($cell.text() != "") {
        $cell.removeClass("active");
        $("#overlay").text($cell.data('j') + "-" + $cell.data('i') + " " + $cell.text() + " " + question);

        $("#overlay-outer").css({
            "left": $cell.offset().left + "px",
            "top": $cell.offset().top + "px",
            "width": 100 * $cell.outerWidth() / $(window).width() + "%",
            "height": 100 * $cell.outerHeight() / $(window).height() + "%",
            "opacity": "0.0"
        }).show();

        $("#overlay-outer").animate({
            "left": "0px",
            "top": "0px",
            "width": "100%",
            "height": "100%",
            "opacity": "1.0"
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

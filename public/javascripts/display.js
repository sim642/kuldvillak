var socket = io();

$(function() {

var myid, myplayer;

$('#overlay-outer').hide();

socket.emit('name', prompt('Nimi: '), function(id, player) {
    myid = id;
    myplayer = player;
});

socket.on('players', function(players) {
    $('#names').empty();
    $('#scores').empty();

    $.each(players, function(id, player) {
        if (!player.admin) {
            $name = $('<td></td>').attr('data-id', id).text(player.name);
            $score = $('<td></td>').attr('data-id', id).text(player.score);

            $('#names').append($name);
            $('#scores').append($score);
        }
    });

    if (!$('#overlay-outer').is(':visible'))
        $('#players button').hide();
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
});

socket.on('pick', function(j, i, question) {
    $cell = $('#grid .values td[data-j="' + j + '"][data-i="' + i + '"]');
    if ($cell.text() != "") {
        $cell.removeClass("active");
        $("#overlay").text(question);
        $('#players button').show();

        $("#overlay-outer").css({
            "left": $cell.offset().left + "px",
            "top": $cell.offset().top + "px",
            "width": 100 * $cell.outerWidth() / $(window).width() + "%",
            "height": 100 * $cell.outerHeight() / $(window).height() + "%",
            "opacity": "0.0",
            "fontSize": "1.5vh"
        }).show();

        $("#overlay-outer").animate({
            "left": "0px",
            "top": "0px",
            "width": "100%",
            "height": 100 * $('#grid-pane').outerHeight() / $(window).height() + '%',
            "opacity": "1.0",
            "fontSize": "10vh"
        }, "slow", function() {
            $cell.text("");
        });

        /*$("#overlay").fadeIn(function() {
            $cell.html("&nbsp;");
        });*/
    }
});

socket.on('pickfinal', function(question) {
    $("#overlay").text(question);
    $('#players button').show();

    $("#overlay-outer").css({
        "left": "0px",
        "top": "0px",
        "width": "100%",
        "height": 100 * $('#grid-pane').outerHeight() / $(window).height() + '%',
        "opacity": "0.0",
        "fontSize": "10vh"
    }).show();

    $("#overlay-outer").animate({
        "opacity": "1.0"
    }, "slow");
});

socket.on('unpick', function() {
    $("#overlay-outer").fadeOut();
    $('#players button').hide();
    $('#players td').css('background-color', '');
});

socket.on('answerers', function(answerers) {
    if (answerers) {
        $.each(answerers, function(i, id) {
            var val = i * 64
            $('#names td[data-id="' + id + '"]').css('background-color', 'rgb(255, ' + val + ', ' + val + ')');
        });
    }
});

socket.on('timer', function(id) {
    $('#names td[data-id="' + id + '"]').css('background-color', 'green');
});

socket.on('timeout', function(id) {
    $('#names td[data-id="' + id + '"]').css('background-color', '');
});


});

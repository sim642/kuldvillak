var socket = io();

$(function() {


$('#test').click(function() {
    socket.emit('test');
});

$("#overlay").hide();

{
    var row = $("<tr></tr>").addClass("head");

    for (var j = 0; j < 6; j++) {
        var cell = $("<td></td>");
        cell.text("Kateg " + j);
        row.append(cell);
    }

    $("#grid").append(row);
}

for (var i = 0; i < 5; i++) {
    var row = $("<tr></tr>").addClass("nums");

    for (var j = 0; j < 6; j++) {
        var cell = $("<td></td>");
        cell.text((i + 1) * 10);
        row.append(cell);
    }

    $("#grid").append(row);
}

$(".nums td").click(function() {
    var $cell = $(this);
    if ($cell.html() != "&nbsp;") {
        $("#overtext").text($cell.text());
		//$("#overlay").fitText(2);
        $("#overlay").css({
            "left": $cell.offset().left + "px",
            "top": $cell.offset().top + "px",
            "width": 100 * $cell.outerWidth() / $(window).width() + "%",
            "height": 100 * $cell.outerHeight() / $(window).height() + "%",
            "opacity": "0.0"
        }).show();

        $("#overlay").animate({
            "left": "0px",
            "top": "0px",
            "width": "100%",
            "height": "100%",
            "opacity": "1.0"
        }, "slow", function() {
            $cell.html("&nbsp;");
        });

        /*$("#overlay").fadeIn(function() {
            $cell.html("&nbsp;");
        });*/
    }
});

$("#overlay").click(function() {
    $(this).fadeOut();
});



});

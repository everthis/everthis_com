!(function() {

    $(".ripple_item").on("click", function(e) {

        var x = e.pageX;
        var y = e.pageY;
        var clickY = y - $(this).offset().top;
        var clickX = x - $(this).offset().left;
        var box = this;

        var setX = parseInt(clickX);
        var setY = parseInt(clickY);
        $(this).css({
            position: 'relative'
        });
        var $svg = $(this).find('svg');
        $svg.remove();
        $(this).append('<svg><circle cx="' + setX + '" cy="' + setY + '" r="' + 0 + '"></circle></svg>');

        setTimeout(function() {
            var s = $(box).find("svg");
            var c = $(box).find("circle");
            c.animate({
                "r": $(box).outerWidth()
            }, {
                easing: "easeOutQuad",
                duration: 600,
                step: function(val) {
                    c.attr("r", val);
                },
                complete: function() {
                    c.attr("r", 0);
                    s.css({
                        display: 'none'
                    });
                }
            });
        });
    });

}());

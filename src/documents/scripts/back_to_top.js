/* Your scripts go here */
/**
 * post_title scroll to fixed
 */
!(function() {
    "use strict";
    var $post_title = $(".post_title"),
        $post = $(".post"),
        $back_to_top = $(".back_to_top"),
        element_position = 0,
        parent_width = 0,
        link_left_offset = 0;
    if ($post.length !== 0) {
        element_position = $post_title.offset();
            parent_width = $post.outerWidth();
        link_left_offset = $post.offset().left + parent_width + 15;
    };
    // back to top
    $back_to_top.css({
        'left': link_left_offset
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $back_to_top.fadeIn(100);
        } else {
            $back_to_top.fadeOut(100);
        }
    });
    $back_to_top.click(function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 300);
    });

    // scroll to fixed
    $(window).scroll(function() {
        if ($(window).scrollTop() > element_position.top) {
            $post_title.css({
                'position': 'fixed',
                'top': '0',
                'width': parent_width
            });
        } else {
            $post_title.removeAttr('style');
        }
    })
})();

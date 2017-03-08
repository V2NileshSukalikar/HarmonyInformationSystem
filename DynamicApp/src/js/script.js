$(document).ready(function () {

    // tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $("body").tooltip({ selector: '[data-toggle=tooltip]' });


    // scroll to top
    $('.scroll-top').click(function () {
        $('html, body').animate({
            scrollTop: '0px'
        }, 1000);
        return false;
    });


    // font-control
    $('.font-control li span').on('click', function () {
        var fontName = $(this).attr("class");
        $("body").removeClass();
        $("body").addClass(fontName);
    });


    // theme palette
    $(".theme-palette-trigger").click(function () {
        $("#theme-palette, .theme-palette-overlay").fadeToggle();
    });

    $(".theme-palette-close").click(function () {
        $("#theme-palette, .theme-palette-overlay").fadeOut();
    });

    $(document).mousedown(function (e) {
        if ($(e.target).closest('#theme-palette').length === 0) {
            $("#theme-palette").stop(true, true).fadeOut();
        }
    });


    // theme color
    var selector = '.theme-container > div';

    $(selector).on('click', function () {
        var colorName = $(this).attr("title");
        $("#main-container").removeClass();
        $("#main-container").addClass(colorName);
        $(selector).removeClass('active');
        $(this).addClass('active');
    });
});



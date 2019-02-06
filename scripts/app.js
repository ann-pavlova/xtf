'use strict';

var albums = void 0;
var albumsTemplate = void 0;
var popupTemplate = void 0;
var popupContentTemplate = void 0;

var hbsUrl = 'https://ann-pavlova.github.io/xtf/hbs/';

$(function () {
    //init gallery
    (function ($homeSlider) {
        if (!$homeSlider.length) {
            return;
        }

        $($homeSlider).slick({
            dots: false,
            arrow: false,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: false
        });
    })($('.j-home-slider'));

    //menu mobile
    (function ($burger) {
        if (!$burger.length) {
            return;
        }

        $burger.on('click', function () {
            $('.b-header__mobile-menu-wrap').toggleClass('is-open');
            $(this).parents().find('.b-header_type_mob').toggleClass('is-open');
            if (window.innerWidth < 1280) {
                $('body').toggleClass('is-open');
            }
            $('.b-header__hamburger').toggleClass('is-active');
        });
    })($('.j-burger'));

    //tabs(projects page)
    (function ($tabLink) {
        if (!$tabLink.length) {
            return;
        }

        $tabLink.on('click', function (e) {
            var currentTabJsonLink = $(e.target).data('json');
            $('.b-tabs__link.is-active').removeClass('is-active');
            $(e.target).addClass('is-active');

            $.ajax({
                url: currentTabJsonLink,
                dataType: 'html',
                type: 'get',
                success: function success(data) {
                    albums = JSON.parse(data);

                    $.get(hbsUrl + 'albums.hbs', function (template) {
                        albumsTemplate = Handlebars.compile(template);
                        $('.b-tabs__content').html(albumsTemplate(albums));
                    }, 'html');
                }
            });
        });
    })($('.j-tabs-link'));

    //init popup
    $('body').on('click', '.j-popup', function (event) {
        event.preventDefault();

        var currentAlbumName = $(event.currentTarget).data('name');
        var gallery = $(event.currentTarget).attr('href');
        var currentAlbum = void 0;

        for (var i = 0; i < albums.length; i++) {
            if (albums[i].name === currentAlbumName) {
                currentAlbum = albums[i];
            }
        }

        $('.b-popup').html(popupTemplate(currentAlbum));

        $('body').addClass('is-open');

        $(gallery).magnificPopup({
            delegate: 'a',
            type: 'image',
            image: {
                titleSrc: function titleSrc() {
                    return popupContentTemplate(currentAlbum);
                }
            },
            callbacks: {
                close: function close() {
                    $('body').removeClass('is-open');
                }
            },
            gallery: {
                enabled: true
            }
        }).magnificPopup('open');

        $("body").swipe({
            swipeLeft: function swipeLeft() {
                $('.mfp-arrow-left').magnificPopup("prev");
            },
            swipeRight: function swipeRight() {
                $('.mfp-arrow-right').magnificPopup("next");
            },
            threshold: 50
        });
    });

    //detect horizontal mobile
    var detectHorMobile = function detectHorMobile() {
        if (window.innerWidth < 959 && window.innerHeight < 400) {
            if (!$('.b-home__slider-content').length) {
                return;
            } else {
                $('.b-home__slider-content').addClass('is-hor-mobile');
            }
        } else {
            $('.b-home__slider-content').removeClass('is-hor-mobile');
        }
    };

    $(document).ready(function () {
        detectHorMobile();
    });

    $(window).resize(function () {
        detectHorMobile();
    });

    //get data with projects
    $(document).ready(function () {
        if (!$('.b-tabs__link.is-active').length) {
            return;
        }

        var currentTabJsonLink = $('.b-tabs__link.is-active').data('json');

        $.ajax({
            url: currentTabJsonLink,
            dataType: 'html',
            type: 'get',
            success: function success(data) {
                albums = JSON.parse(data);

                $.get(hbsUrl + 'albums.hbs', function (template) {
                    albumsTemplate = Handlebars.compile(template);
                    $('.b-tabs__content').html(albumsTemplate(albums));
                }, 'html');

                $.get(hbsUrl + 'projects-popup.hbs', function (template) {
                    popupTemplate = Handlebars.compile(template);
                }, 'html');

                $.get(hbsUrl + 'project-popup-content.hbs', function (template) {
                    popupContentTemplate = Handlebars.compile(template);
                }, 'html');
            }
        });
    });
});
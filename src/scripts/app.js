let albums;
let albumsTemplate;
let popupTemplate;
let popupContentTemplate;

$(function () {
    //init gallery
    (function($homeSlider) {
        if(!$homeSlider.length) {
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
        if(!$tabLink.length) {
            return;
        }

        $tabLink.on('click', (e) => {
            let currentTabJsonLink = $(e.target).data('json');
            $('.b-tabs__link.is-active').removeClass('is-active');
            $(e.target).addClass('is-active');

            $.ajax({
                url: currentTabJsonLink,
                dataType: 'html',
                type: 'get',
                success: function(data) {
                    albums = JSON.parse(data);

                    $.get('../hbs/albums.hbs', function (template) {
                        albumsTemplate = Handlebars.compile(template);
                        $('.b-tabs__content').html(albumsTemplate(albums));
                    }, 'html');
                }
            });
        });
    })($('.j-tabs-link'));

    //init popup
    $('body').on('click', '.j-popup', function(event){
        event.preventDefault();

        let currentAlbumName = $(event.currentTarget).data('name');
        let gallery = $(event.currentTarget).attr('href');
        let currentAlbum;

        for(var i=0; i < albums.length; i++) {
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
                titleSrc: function () {
                    return popupContentTemplate(currentAlbum);
                }
            },
            callbacks: {
              close: () => {
                  $('body').removeClass('is-open');
              }
            },
            gallery: {
                enabled: true
            }
        }).magnificPopup('open');

        $("body").swipe({
            swipeLeft: function() {
                $('.mfp-arrow-left').magnificPopup("prev");
            },
            swipeRight: function() {
                $('.mfp-arrow-right').magnificPopup("next");
            },
            threshold: 50
        });
    });

    //detect horizontal mobile
    let detectHorMobile = () => {
        if (window.innerWidth < 959 && window.innerHeight < 400) {
            if(!$('.b-home__slider-content').length) {
                return;
            } else {
                $('.b-home__slider-content').addClass('is-hor-mobile');
            }
        } else {
            $('.b-home__slider-content').removeClass('is-hor-mobile');
        }
    };

    $(document).ready(() => {
        detectHorMobile();
    });

    $(window).resize(()=> {
        detectHorMobile();
    });

    //get data with projects
    $(document).ready(() => {
        if(!($('.b-tabs__link.is-active').length)) {
            return;
        }

        let currentTabJsonLink = $('.b-tabs__link.is-active').data('json');

        $.ajax({
            url: currentTabJsonLink,
            dataType: 'html',
            type: 'get',
            success: function(data) {
                albums = JSON.parse(data);

                $.get('../hbs/albums.hbs', function (template) {
                    albumsTemplate = Handlebars.compile(template);
                    $('.b-tabs__content').html(albumsTemplate(albums));
                }, 'html');

                $.get('../hbs/projects-popup.hbs', function (template) {
                    popupTemplate = Handlebars.compile(template);
                }, 'html');

                $.get('../hbs/project-popup-content.hbs', function (template) {
                    popupContentTemplate = Handlebars.compile(template);
                }, 'html');
            }
        });
    });
});

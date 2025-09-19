/**!
 * [滨州北海新区智慧城市建设]
 * date:2018-12-24
 * author: [gaojing];
 */

(function(win, $) {
    var $platform = $("#platform"),$swipercontainer = $(".card-wrap"),swiper;

    $swipercontainer.animate({ "opacity": 0.1 }, 500, function() {
        if (swiper) {
            swiper.destroy(true);
        }
        var swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            loop: true,
            slideToClickedSlide: false,
            centeredSlides: true,
            mousewheelControl: true,
            slidesPerView: 2,
            loopedSlides: 5,
            coverflow: {
                rotate: 30,
                stretch: 300,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            },
            onInit: function() {
                $swipercontainer.animate({ "opacity": 1 }, 500);
            }
        });
    });

    
}(this, jQuery));
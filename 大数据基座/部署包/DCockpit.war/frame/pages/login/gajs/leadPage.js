/* 页面交互效果 */

(function (win, $) {
    // 判断显示几组的图标
    var $fourfunc=$("#four-func"),
        $fivefunc=$("#five-func");
    
    var $initfunc=1;
    
    // 初始化时标识判断（请后续自定义标识）
    if($initfunc==1){
        // 展示5组
        $fivefunc.show();
    }else{
         // 展示4组
        $fourfunc.show();
    }

    var wow = new WOW().init({});

    var homeBan = new Swiper('.banner-place .swiper-container', {
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        speed: 500,
        effect: 'fade',
        resizeReInit: true,
        observer: true,
        observeParents: true,
        noSwiping : true,
        onInit: function (swiper) {
            swiperAnimateCache(swiper);
            swiperAnimate(swiper);
        },
        onSlideChangeEnd: function (swiper) {
            swiperAnimate(swiper);
        }
    });


    // 高度自适应调整
    var $body = $("body");

    function initscreen() {
        var $winhei = $(window).height();

        if ($winhei < 700) {
            $body.addClass("hack-sm");
        }else{
            $body.removeClass("hack-sm");
        }
    }

    // 初始化调整
    initscreen();

    var resizeTimer=null;
    $(window).on('resize',function(){
         if(resizeTimer){
              clearTimeout(resizeTimer);
         }
        resizeTimer = setTimeout(function(){
            initscreen();
        },400);
    });
}(this, jQuery));
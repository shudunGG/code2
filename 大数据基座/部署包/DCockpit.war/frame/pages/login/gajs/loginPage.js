/* 页面交互效果 */

(function (win, $) {
    if (!window.Util) {
        window.Util = {};
    }
}(this, jQuery));
/**
 * 表单相关的 Util 方法
 */
(function ($, exports) {

    $.fn.extend({
        /**
         * 把表单控件序列化为字面对象, 如： { controlName: 'controlValue' }
         * 需要序列化的表单控件必须有 name 属性
         * 注：此 FormData 与 html5中的 FormData 不一样。
         */
        toFormData: function () {
            var o = {};
            var a = this.serializeArray();

            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });

            return o;
        },

        /**
         * 为表单控件进行批量赋值
         * data 为表单控件数据的字面对象，如： { controlName： 'controlValue' }
         * 表单控件必须有 name 属性
         */
        loadFormData: function (data) {
            function _checkField(name, val, $target) {
                var cc = $target.find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
                if (cc.length) {
                    cc.prop('checked', false);
                    cc.each(function () {
                        if (_isChecked($(this).val(), val)) {
                            $(this).prop('checked', true);
                        }
                    });
                    return true;
                }
                return false;
            }

            function _isChecked(v, val) {
                if (v == String(val) || $.inArray(v, $.isArray(val) ? val : [val]) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }

            for (var name in data) {
                var val = data[name];
                if (!_checkField(name, val, $(this))) {
                    $(this).find('input[name="' + name + '"]').val(val);
                    $(this).find('textarea[name="' + name + '"]').val(val);
                    $(this).find('select[name="' + name + '"]').val(val);
                }
            }
        }
    });

    $.extend(exports, {
        // id 为 form id
        toFormData: function (id) {
            return $(document.getElementById(id)).toFormData();
        },

        // id 为 form id
        loadFormData: function (id, data) {
            return $(document.getElementById(id)).loadFormData(data);
        }
    });

}(jQuery, window.Util));

/* 页面交互效果 */

(function (win, $) {

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
        } else {
            $body.removeClass("hack-sm");
        }
    }

    // 初始化调整
    initscreen();

    var resizeTimer = null;
    $(window).on('resize', function () {
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function () {
            initscreen();
        }, 400);
    });

    // 验证
    // placeholder
    var inputTips = new inputPlaceholder();

}(this, jQuery));
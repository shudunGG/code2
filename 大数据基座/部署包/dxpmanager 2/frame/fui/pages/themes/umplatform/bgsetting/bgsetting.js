/**
 * imac 换背景页面
 */

(function (win, $) {
    var $wrap = $('#bgs-wrap'),
        $container = $wrap.parent();

    // 父页面的themeId
    var themeId = (function () {

        try {
            if(top === win) {
                throw new Error('此页用于给主界面设置背景不能单独打开！');
            }
            // 从主界面中获取themeId
            var themeMatch = top.location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
                themeId = themeMatch && themeMatch[1];

            if (!themeId) {
                throw new Error('无法正确获取主界面的themeId！');
            }
            return themeId;
        } catch (err) {
            throw err;
        }
    }());
    // 父界面的pageId
    var pageId = (function () {
        try {
            return top.Util.getUrlParams('pageId');
        } catch (err) {
            throw err;
        }
    })();

    var getBg = function () {
        return Util.ajax({
            url: getAllBgUrl,
            data: {
                themeId: themeId,
                pageId: pageId
            }
        }).done(function (data) {
            $.each(data, function (i, item) {

                $('<div class="bg-item l' + (item == localStorage.getItem('_umplatform_bg_') ? ' active' : '') + '" data-url="' + item + '"><img src="' + Util.getRightUrl(item) + '"/></div>')
                    .appendTo($wrap);
            });
        });
    };
    getBg();

    // niceScroll
    if ($.fn.niceScroll) {
        $container.niceScroll();
    } else {
        Util.loadJs('frame/fui/js/libs/jquery.nicescroll.min.js', function () {
            $container.niceScroll();
        });
    }

    // 点击设为背景
    $wrap.on('click', '.bg-item', function () {
        var $this = $(this),
            url = $this.data('url');
        if ($this.hasClass('active')) return;

        // 设置背景
        Util.ajax({
            url: setBgUrl,
            data: {
                bg: url,
                themeId: themeId,
                pageId: pageId
            }
        }).done(function (data) {
            if (data.status == 'success') {
                top.setBg && top.setBg(url);
                $this.addClass('active')
                    .siblings().removeClass('active');
            } else if (data.description) {
                epoint.alert(description,null,null,'info');
            }
        });
    });

}(this, jQuery));
// 每个界面的模板
var THEMEITEM_TPL = '<div class="theme-item l {{#inUse}}js-inuse{{/inUse}} {{#isDefault}}js-isdefault{{/isDefault}}"data-pageId="{{pageId}}"data-themeid="{{themeId}}"data-url="{{url}}"><div class="theme-preview"><img src="{{preview}}"alt=""></div><div class="theme-btns"><span class="btn js-default {{#isDefault}}hidden{{/isDefault}}">设为默认</span><span class="btn js-change  {{#inUse}}hidden{{/inUse}}">立即切换</span></div><p class="theme-name">{{name}}</p></div>';

(function (win, $) {

    var $themesWrap = $('#themes-box');

    // 主界面中获取themeId
    var themeId = (function () {
        try {
            // 从主界面中获取themeId
            var themeMatch = top.location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
                themeId = themeMatch && themeMatch[1];

            return themeId ? themeId : null;
        } catch (err) {
            console && console.error(err.message);
            return null;
        }
    })();
    // 主题界面中获取pageId
    var pageId = (function () {
        return top.Util.getUrlParams('pageId');
    })();
    // 处理数据，标识出当前的 并处理地址
    var dealData = function (data) {
        var pages = [];
        $.each(data.pages, function (i, item) {
            item.url = Util.getRightUrl(item.url);
            item.preview = Util.getRightUrl(item.preview);
            if (item.pageId == pageId) {
                item.inUse = true;
            }
            if (item.pageId == data.defaultPage) {
                item.isDefault = true;
            }
            pages.push(item);
        });
        return pages;
    };
    // 渲染
    var render = function (data) {
        var html = [];

        $.each(data, function (i, item) {
            html.push(Mustache.render(THEMEITEM_TPL, item));
        });

        return $(html.join('')).appendTo($themesWrap);
    };

    // 获取所有界面
    var getData = function () {
        return Util.ajax({
            url: getAllPageUrl,
            data: {
                themeId: themeId
            }
        }).done(function (data) {
            // 处理并渲染
            render(dealData(data));
        });
    };
    getData();

    // 点击设为默认
    $themesWrap.on('click', '.js-default', function () {
        var $item = $(this).closest('.theme-item'),
            aimPageId = $item.data('pageid'),
            aimUrl = $item.data('url');
        Util.ajax({
            url: setPageUrl,
            data: {
                pageId: aimPageId,
                themeId: themeId
            }
        }).done(function (data) {
            if (data.status == 'success') {
                epoint.confirm('切换成功，是否立即切换？', '系统提醒', function () {
                    top.location.href = aimUrl;
                });
            } else if (data.description) {
                epoint.alert(data.description,null,null,'warning');
            }
        });
    }).on('click', '.js-change', function () {
        var $item = $(this).closest('.theme-item'),
            aimPageId = $item.data('pageid'),
            aimUrl = $item.data('url');

        top.location.href = aimUrl;
    });

    if ($.fn.niceScroll) {
        $themesWrap.parent().niceScroll();
    } else {
        Util.loadJs('frame/fui/js/widgets/jquery.nicescroll.min.js', function () {
            $themesWrap.parent().niceScroll();
        });
    }

})(this, jQuery);
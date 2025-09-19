var TABVIEW_HEADER_TPL = '<div class="tabview-header" data-role="head"></div>';
var TABVIEW_HEADER_ITEM_TPL = '<div class="tabview-header-item active" data-role="tab" data-target="{{target}}">{{name}}</div>';
var TABVIEW_BODY_TPL = '<div class="tabview-body" data-role="body"></div>';
var TABVIEW_BODY_ITEM_TPL = '<div class="tabview-body-item hidden" data-id="{{target}}" data-role="tab-content">{{{bodyHTML}}}</div>';


// 文本列表模板
var TEXT_LIST_TPL = '{{#items}}<div class="text-item"><a href="javascript:;" class="text-item-link" title="{{title}}" data-url="{{url}}" data-id="{{id}}">{{{content}}}</a><span class="text-item-date">{{date}}</span></div>{{/items}}';

// 图文混合模板
var TEXTIMG_LIST_TPL = '{{#items}}<div class="text-item {{#isIMG}}hasimg{{/isIMG}}">{{#isIMG}}<img class="item-img" src="{{img}}" />{{/isIMG}}<a href="javascript:;" class="text-item-link" title="{{content}}" data-url="{{url}}" data-id="{{id}}">{{{content}}}</a><span class="text-item-date">{{date}}</span></div>{{/items}}';

// 图片列表模板
// var IMG_LIST_TPL = '<div class="img-list-wrap"><div class="wb-slider-conbox">{{#items}}<div class="img-item wb-slider-ctag"><a href="javascript:;" class="img-item-link" title="{{title}}" data-url="{{url}}" data-id="{{id}}"><img class="item-img" src="{{img}}" /></a><div class="wb-slider-mask"><span class="img-info ellipsis" style="margin-right:{{marginRight}}px">{{{content}}}</span><span class="img-item-date">{{date}}</span></div></div>{{/items}}</div><div class="wb-slider-switcher">{{#items}}<div class="wb-slider-stag">{{_index}}</div>{{/items}}</div></div>';
var IMG_LIST_TPL = '<div class="img-list-wrap"><span class="arrow-left l"></span><span class="arrow-right l"></span><div class="swiper-container"><div class="swiper-wrapper">{{#items}}<div class="img-item swiper-slide"><img class="item-img" src="{{img}}" /><div class="item-info-mask" ><a href="javascript:;" class="img-item-link" style="margin-right:{{marginR}}px" title="{{title}}" data-url="{{url}}" data-id="{{id}}">{{{content}}}</a><span class="img-item-date">{{date}}</span></div></div>{{/items}}</div></div><div class="pagination-wrap" style="width:{{paginationWidth}}px"><div class="pagination"></div></div></div>';

// 三种栏目类型名称定义
var LISTTYPE = {
    text: 'text',
    imgAndText: 'imgAndText',
    imgs: 'imgs'
};
// 是否需要初始化图片轮播
var isNeedInitImgScroll = false;
var $wrap = $('#container');
var getData = function () {
    return Util.ajax({
        url: getElementDataUrl,
        query: 'getElementData',
        elementID: elementID
    }).done(function (data) {
        // todo bg color 
        // if (data.contentColor) {
        //     $wrap.css('background-color', data.contentColor);
        // }
        // link openType
        $wrap.data('link-open-type', data.linkOpenType);
        $wrap.data('opentype', data.openType);
        // 渲染
        render(data.partList);
        initEvent(data.openType || data.linkOpenType);
    });
};
getData();
var render = function (list) {
    if (!list || !list.length) {
        return;
    }
    // 只配置了一个栏目时直接渲染即可
    if (list.length === 1) {
        renderSinglePart(list[0]);
        // 图片轮播初始化
        if (isNeedInitImgScroll) {

            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.pagination',
                autoplay: 2000,
                loop: true,
                paginationClickable: true
            });
            // hover 停止 离开重启
            $('.swipper-container').on('mouseenter', function () {
                mySwiper && mySwiper.stopAutoplay();
            }).on('mouseleave', function () {
                mySwiper && mySwiper.startAutoplay();
            });
            $('.img-list-wrap').on('click', '.arrow-right, .arrow-left', function () {
                var $this = $(this);
                if ($this.hasClass('arrow-right')) {
                    mySwiper.swipeNext();
                } else {
                    mySwiper.swipePrev();
                }
            });

        }
    } else {
        // 多个需要构成tabview的形式
        renderTabView(list);
    }
};
// 单栏目渲染
var renderSinglePart = function (part) {
    return $(renderPart(part)).appendTo($wrap.empty());
};
var SwipperObjects = {};
// 多栏目tabview渲染
var renderTabView = function (data) {
    var header_html = '<div class="tabview-header" data-role="head">',
        body_html = '<div class="tabview-body" data-role="body">';
    $.each(data, function (i, part) {
        header_html += Mustache.render(TABVIEW_HEADER_ITEM_TPL, {
            target: i,
            name: part.name
        });
        body_html += Mustache.render(TABVIEW_BODY_ITEM_TPL, {
            target: i,
            bodyHTML: renderPart(part)
        });
    });
    header_html += '</div>';
    body_html += '</div>';
    $(header_html + body_html).appendTo($wrap.empty());
    // 全部渲染完成 初始化tabview
    return new TabView({
        dom: $wrap,
        activeCallback: function ($tabCon) {
            var $content = $tabCon.children().first(),
                idx = $tabCon.index(),
                isImgScroll = $content.hasClass('img-list-wrap');
            if (isImgScroll && !$content.data('img-init')) {
                $tabCon.find('.swiper-container').addClass('swipper-container-' + idx);
                $tabCon.find('.pagination').addClass('swipper-pagination-' + idx);

                var $pagination = $('.swipper-pagination-' + idx);

                SwipperObjects[idx] = new Swiper('.swipper-container-' + idx, {
                    pagination: $pagination[0],
                    autoplay: 3000,
                    loop: true,
                    paginationClickable: true
                });
                // hover 停止 离开重启
                $('.swipper-container-' + idx).on('mouseenter', function () {
                    SwipperObjects[idx] && SwipperObjects[idx].stopAutoplay();
                }).on('mouseleave', function () {
                    SwipperObjects[idx] && SwipperObjects[idx].startAutoplay();
                });

                $tabCon.find('.img-list-wrap').on('click', '.arrow-right, .arrow-left', function () {
                    var $this = $(this);
                    if ($this.hasClass('arrow-right')) {
                        SwipperObjects[idx].swipeNext();
                    } else {
                        SwipperObjects[idx].swipePrev();
                    }
                });
                $content.data('img-init', true);
            }

        }
    });
};
// 每个栏目的渲染
var renderPart = function (part) {

    switch (part.type) {
        case LISTTYPE.text:
            return renderTextPart(part.list);
            // break;
        case LISTTYPE.imgAndText:
            return renderImgTextPart(part.list);
            // break;
        case LISTTYPE.imgs:
            return renderImgPart(part.list);
            // break;

        default:
            console.error('类型不匹配，无法正确渲染');
            return '';
            // break;
    }
};
var renderTextPart = function (list) {
    return Mustache.render(TEXT_LIST_TPL, {
        items: list
    });
};
var renderImgTextPart = function (list) {
    if (list[0]) {
        list[0].isIMG = true;
    }
    return Mustache.render(TEXTIMG_LIST_TPL, {
        items: list
    });
};
var renderImgPart = function (list) {
    
    $.each(list, function (i, item) {
        item.marginR = list.length * 15 + 20;
    });
    // 存在图片列表则需要图片轮播
    isNeedInitImgScroll = true;
    return Mustache.render(IMG_LIST_TPL, {
        items: list,
        paginationWidth: list.length * 15
    });
};

function initEvent(openType) {
    $wrap.on('click', '.text-item-link, .img-item-link', function () {
        var $this = $(this),
            url = Util.getRightUrl($this.data('url')),
            id = $this.data('id'),
            name = $this.attr('title') || $this.text();
        try {
            if (openType.toString() == 'tabsnav') {
                top.TabsNav.addTab({
                    name: name,
                    id: id || ((Math.random() * 256) >> 0).toString(16) + +new Date(),
                    url: url,
                    closeCallback: getData
                });
            } else if (openType == 'dialog') {
                epoint.openTopDialog(name, url, getData);
            } else {
                window.open(url);
            }
        } catch (err) {
            window.open(url);
        }
    });
}

// tabview
(function (win, $) {
    var defaultSettings = {
        // 默认选中的tab项，从0计数
        activeIndex: 0,
        // 容器dom对象
        dom: null,
        // 触发tab切换的事件：click|mouseover
        triggerEvent: 'click',
        // 高亮时的样式名
        activeCls: 'active',
        activeCallback: function () {}
    };

    win.TabView = function (opts) {
        this.cfg = $.extend({}, defaultSettings, opts);

        this._initView();
        this._initEvent();
    };

    /* global TabView */
    $.extend(TabView.prototype, {
        _initView: function () {
            var c = this.cfg;

            var $widget = $(c.dom),

                $widgetHd = $widget.find('> [data-role="head"]'),
                $widgetBd = $widget.find('> [data-role="body"]'),

                $tabs = $widgetHd.find('[data-role="tab"]'),
                $tabCons = $widgetBd.find('> [data-role="tab-content"]');

            $.extend(this, {
                $widgetHd: $widgetHd,
                $tabs: $tabs,
                $tabCons: $tabCons
            });

            this.activeTabByIndex(c.activeIndex);
        },

        _initEvent: function () {
            var c = this.cfg,
                triggerEvent = c.triggerEvent,

                $widgetHd = this.$widgetHd,
                self = this;

            // 用于mouseover触发时的延时
            var overTimer = 0;

            if (triggerEvent == 'click') {
                $widgetHd.on('click', '[data-role="tab"]', function (event) {
                    event.preventDefault();

                    $.proxy(self._activeTab, self, $(this))();
                });

            } else if (triggerEvent == 'mouseover') {
                $widgetHd.on('mouseover', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);

                    overTimer = setTimeout($.proxy(self._activeTab, self, $(this)), 500);

                }).on('mouseout', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);
                });
            }
        },

        _activeTab: function ($tab) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs;

            var targetId = $tab.data('target');

            $tabs.removeClass(activeCls);
            $tab.addClass(activeCls);

            this._activeTabContent(targetId);
        },

        // 通过index激活对应tab
        activeTabByIndex: function (index) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs,

                $activeTab = null,
                targetId = '';

            // 若index合法
            if (index >= 0 && index < $tabs.length) {
                $activeTab = $tabs.removeClass(activeCls).eq(index).addClass(activeCls);

                targetId = $activeTab.data('target');

                this._activeTabContent(targetId);
            }
        },

        _activeTabContent: function (targetId) {
            var $tabCons = this.$tabCons;

            var $tabCon = $tabCons.addClass('hidden')
                .filter('[data-id="' + targetId + '"]')
                .removeClass('hidden');
            this.cfg.activeCallback.call(this, $tabCon);
        }
    });

}(this, jQuery));
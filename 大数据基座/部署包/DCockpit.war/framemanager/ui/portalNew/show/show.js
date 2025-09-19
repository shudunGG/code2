// Util 扩展
(function (win, $, Util) {
    if (Util.getZIndex) {
        Util.getZIndex = function () {
            return mini.getMaxZIndex();
        };
    }
    $.extend(Util, {
        // 动态加载js
        _jsPromise: {},
        loadJsPromise: function (url) {
            if (this._jsPromise[url]) {
                return this._jsPromise[url];
            }

            var dtd = $.Deferred(),
                script = document.createElement('script');
            script.type = 'text/javascript';

            // IE8- IE9+ 已经支持onload等，控制更加精确 不应该再试试onreadystatechange
            if ((this.browsers.isIE67 || this.browsers.isIE8) && script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        dtd.resolve();
                        script.onreadystatechange = null;
                    }
                };
                // w3c
            } else {
                script.onload = function () {
                    dtd.resolve();
                    script.onload = null;
                };
                script.onerror = function () {
                    dtd.reject();
                    script.onerror = null;
                    Util._jsPromise[url] = null;
                };
            }

            script.src = Util.getRightUrl(url);
            // append to head
            document.getElementsByTagName('head')[0].appendChild(script);

            return (this._jsPromise[url] = dtd.promise());
        },
        // 虚拟滚动条
        doNiceScroll: function ($el, cfg) {
            this.loadJsPromise('frame/fui/js/widgets/jquery.nicescroll.min.js').done(function () {
                $el.niceScroll(cfg);
            });
        },
        /**
         * [归并排序]
         * @param  {[Array]} arr   [要排序的数组]
         * @param  {[String]} prop  [排序字段，用于数组成员是对象时，按照其某个属性进行排序，简单数组直接排序忽略此参数]
         * @param  {[String]} order [排序方式]
         * @return {[Array]}       [排序后数组，新数组，并非在原数组上的修改]
         */
        mergeSort: (function () {
            // 合并
            var _merge = function (left, right, prop) {
                var result = [];

                // 对数组内成员的某个属性排序
                if (prop) {
                    while (left.length && right.length) {
                        if (left[0][prop] <= right[0][prop]) {
                            result.push(left.shift());
                        } else {
                            result.push(right.shift());
                        }
                    }
                } else {
                    // 数组成员直接排序
                    while (left.length && right.length) {
                        if (left[0] <= right[0]) {
                            result.push(left.shift());
                        } else {
                            result.push(right.shift());
                        }
                    }
                }

                while (left.length) {
                    result.push(left.shift());
                }

                while (right.length) {
                    result.push(right.shift());
                }

                return result;
            };

            var _mergeSort = function (arr, prop) {
                // 采用自上而下的递归方法
                var len = arr.length;
                if (len < 2) {
                    return arr;
                }
                var middle = Math.floor(len / 2),
                    left = arr.slice(0, middle),
                    right = arr.slice(middle);
                return _merge(_mergeSort(left, prop), _mergeSort(right, prop), prop);
            };

            return function (arr, prop, order) {
                var result = _mergeSort(arr, prop);
                if (!order || order.toLowerCase() === 'asc') {
                    // 升序
                    return result;
                } else {
                    // 降序
                    var _ = [];
                    // result.forEach(function(item) {
                    //     _.unshift(item);
                    // });
                    $.each(result, function (i, item) {
                        _.unshift(item);
                    });
                    return _;
                }
            };
        })()
    });
})(this, jQuery, Util || {});

// 列模板
var COL_TPL = '<div class="col-item{{#isLast}} isLast{{/isLast}}" style="width:{{width}}"><div class="col-item-inner"></div></div>';

// 元件模板
var ELEMENT_TPL = '<div class="element-item {{#showHeader}} showHeader{{/showHeader}} {{#showToolbar}} showToolbar{{/showToolbar}}" style="{{#borderColor}}{{borderColor}};{{/borderColor}}" data-id="{{id}}" data-name="{{title}}" data-url="{{url}}" data-more-url="{{moreOpenUrl}}" data-link-open-type="{{linkOpenType}}"><div class="element-header" style="{{#titleColor}}color:{{titleColor}};{{/titleColor}}{{#titleBgColor}}background:{{titleBgColor}};{{/titleBgColor}}">{{#titleIcon}}<img class="icon" src="{{titleIcon}}" />{{/titleIcon}}<span class="name">{{title}}</span><div class="header-operations">{{#showMoreBtn}}<span class="icon open"></span>{{/showMoreBtn}}{{#showRefreshBtn}}<span class="icon refresh"></span>{{/showRefreshBtn}}</div></div><div class="element-body" style="height:{{actualHeight}}px;{{#contentBg}}background:{{contentBg}};{{/contentBg}}"><iframe class="element-body-content" src="about:blank" data-url="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe></div></div>';

(function (win, $) {
    var $contentWrap = $('#main-content-wrap'),
        $contentContainer = $('.main-content-container', $contentWrap);

    var drawLayoutBlock = function (data) {

        // 清空内容
        $contentContainer.empty();

        // 重新绘制每块
        $.each(data, function (i, layout) {
            drawCols(layout);
        });

        // $contentWrap.mCustomScrollbar({
        //     theme: 'dark-thin',
        //     scrollbarPosition: 'outside',
        //     axis:"yx",
        //     // autoHideScrollbar: true,
        //     scrollButtons: {
        //         enable: true
        //     }
        // });
    };

    var drawCols = function (layout) {
        var $layoutBlock = $('<div class="layout-block" data-id="' + layout.id + '" data-name="' + layout.name + '" data-cols="' + JSON.stringify(layout.cols) + '"></div>');
        var $colWrap = $('<div class="col-content"></div>').appendTo($layoutBlock);

        var data = layout.cols;

        var widthArr = [],
            len = data.length,
            t = 0;
        $.each(data, function (i, item) {
            var w = parseInt(item, 10);
            if (w) {
                t += w;
                widthArr.push(w);
            }
        });

        var contentHtml = '';
        $.each(widthArr, function (i, item) {
            var width = ((item * 1000000 / t) >> 0) / 1000000 * 100 + '%';
            contentHtml += Mustache.render(COL_TPL, {
                width: width,
                // 标记最后一个以便修复toolbar位置
                // 处理IE8兼容 IE9+使用:last-child即可
                isLast: i === len - 1 ? true : false
            });
        });

        $(contentHtml).appendTo($colWrap);

        $layoutBlock.appendTo($contentContainer);

        // 画元件
        if (layout.elements && layout.elements.length) {
            $.each(Util.mergeSort(layout.elements, 'row'), function (i, item) {
                drawElement(item, $colWrap);
            });
        }
    };
    // 处理地址，url上拼接元件guid
    var dealUrl = (function () {
        var elIDReg = /[?&]elementID=/;

        function _dealUrl(url, id) {
            // 没URL不处理
            if (!url) {
                return url;
            }
            // url中已经存在参数则不处理
            var idx = url.indexOf('?');
            if (elIDReg.test(url.substr(idx))) {
                return url;
            }
            if (url.indexOf('?') != -1) {
                url += '&elementID=' + id;
            } else {
                url += '?elementID=' + id;
            }
            return url;
        }

        return function (data) {
            var id = data.id;
            data.url = Util.getRightUrl(_dealUrl(data.url, id));
            if (data.titleIcon) {
                data.titleIcon = Util.getRightUrl(data.titleIcon);
            }
            return data;
        };
    }());

    var ELEMENT_PADDING = 15;
    // 绘制元件
    var drawElement = function (data, $colWrap) {
        // 处理高度
        if (!data.height || data.height == 'auto') {
            data.actualHeight = (data.customTitleHeight ? (parseInt(data.customTitleHeight, 10) || 0) : 0) + 30 * data.itemNum + ELEMENT_PADDING * 2;
        } else {
            data.actualHeight = data.height || 300;
        }
        // 处理地址
        data = dealUrl(data);
        // border-color
        if (data.borderColor) {
            data.borderColor = getBorderColorStyle(data.borderColor);
        }
        // data.borderColor = null;
        var $html = $(Mustache.render(ELEMENT_TPL, data));
        var $aimCol = $colWrap.find('.col-item').eq(data.col);
        if ($aimCol.length) {
            $html.appendTo($aimCol.find('.col-item-inner'));
        } else {
            console.error('元件数据和列不匹配', data);
        }
    };
    var BORDER_COLOR_TPL = [
        'border:1px solid {{borderColor}};',
        'border:0 rgba(0,0,0,0.3);',
        '-webkit-box-shadow:0 0 4px {{rgbaBorderColor}};',
        '-moz-box-shadow:0 0 4px {{rgbaBorderColor}};',
        'box-shadow:0 0 4px {{rgbaBorderColor}};'
    ].join('');

    function hex2rgba(c, a) {
        a = a || .3;
        c = c.substr(1);
        if (c.length === 3) {
            c = c.replace(/([0-9a-fA-f])([0-9a-fA-f])([0-9a-fA-f])/, '$1$1$2$2$3$3');
        }
        var r = parseInt(c.substr(0, 2), 16) || 0,
            g = parseInt(c.substr(2, 2), 16) || 0,
            b = parseInt(c.substr(4, 2), 16) || 0;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    function getBorderColorStyle(c) {
        if (!c) {
            return '';
        }
        return Mustache.render(BORDER_COLOR_TPL, {
            borderColor: c,
            rgbaBorderColor: hex2rgba(c, .3)
        });
    }
    // 头部点击事件 打开和刷新
    $contentContainer.on('click', '.header-operations > .refresh', function () {
        var $el = $(this).closest('.element-item'),
            iframe = $el.find('.element-body-content')[0],
            url = $el.data('url');
        // 不跨域直接reload 否则 重设url
        // try {
        //     iframe.contentWindow.location.reload();
        // } catch (err) {
        //     var url = iframe.src;
        //     iframe.src = 'about:blank';
        //     iframe.src = url;
        // }
        // 如果内容错误，reload还是错误页面 刷新应重新加载原url
        iframe.src = 'about:blank';
        iframe.src = url;
    }).on('click', '.header-operations > .open', function () {
        var $el = $(this).closest('.element-item'),
            id = $el.data('id'),
            name = $el.data('name'),
            // url = Util.getRightUrl($el.data('url')),
            url = Util.getRightUrl($el.data('more-url')),
            openType = $el.data('link-open-type');
        try {
            if (openType == 'tabsNav') {
                top.TabsNav.addTab({
                    name: name,
                    id: id,
                    url: url
                });
            } else if (openType == 'dialog') {
                epoint.openTopDialog(name, url);
            } else {
                window.open(url);
            }
        } catch (err) {
            window.open(url);
        }
    });

    // 加载iframe
    var loadUrl = function () {
        var $items = $contentContainer.find('.element-body-content'),
            $item,
            i = 0,
            len = $items.length;

        // 没有元件时
        if (!len) return;

        function load() {
            $item = $items.eq(i);
            $item.attr('src', $item.data('url'));

            if (++i < len) {
                setTimeout(load, 50);
            }
        }
        load();
    };

    // 获取数据
    var getData = function () {
        Util.ajax({
            url: getPortalDataUrl,
            data: {
                query: 'getPortalData',
                portalGuid: portalGuid
            }
        }).done(function (data) {
            if (!data || !data.layouts) {
                console.error('门户初始化信息数据错误！');
                return;
            }
            drawLayoutBlock(data.layouts);
            loadUrl();
        });
    };

    getData();
}(this, jQuery));
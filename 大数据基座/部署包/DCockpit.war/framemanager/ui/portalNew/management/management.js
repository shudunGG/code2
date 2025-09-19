/* global Mustache, getElDataUrl,portalGuid,getPortalDataUrl,getLayoutDataUrl,getELementDataUrl,deleteElementUrl,saveElementsUrl  */
// Util 扩展
(function (win, $, Util) {
    if (Util.getZIndex) {
        Util.getZIndex = function () {
            return mini.getMaxZIndex();
        };
    }
    $.extend(Util, {
        // 高亮闪烁布局块
        highlightBlock: (function () {
            var style = document.createElement('div').style;
            var isSupportAnimation = 'animation' in style || '-webkit-animation' in style;
            // 优先使用css3 动画
            if (!isSupportAnimation) {
                return function ($app) {
                    var dark = function () {
                            $app.animate({
                                    opacity: 0.3
                                },
                                200,
                                next
                            );
                        },
                        light = function () {
                            $app.animate({
                                    opacity: 1
                                },
                                200,
                                next
                            );
                        },
                        next = function () {
                            var n = $app.queue('highlight');

                            if (!n.length) {
                                $app.clearQueue('highlight');
                            } else {
                                $app.dequeue('highlight');
                            }
                        };

                    $app.queue('highlight', [dark, light, dark, light, dark, light]);

                    next();
                };
            }

            return function ($app) {
                $app.addClass('highlight');
                setTimeout(function () {
                    $app.removeClass('highlight');
                }, 1300);
            };
        })(),
        fixedIconPath: function (item) {
            item.icon = item.icon || Util.getRightUrl('./images/lauout/icon-common.png');
            item.hoverIcon = Util.getRightUrl(
                item.icon.replace(/.(?=\.png)/, function (a) {
                    return a + '-h';
                })
            );
            item.icon = Util.getRightUrl(item.icon);

            return item;
        },
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
         * 
         * @param {[Array]}
         *            arr [要排序的数组]
         * @param {[String]}
         *            prop [排序字段，用于数组成员是对象时，按照其某个属性进行排序，简单数组直接排序忽略此参数]
         * @param {[String]}
         *            order [排序方式]
         * @return {[Array]} [排序后数组，新数组，并非在原数组上的修改]
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
                    // _.unshift(item);
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
        activeCls: 'active'
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
                $widgetHd
                    .on('mouseover', '[data-role="tab"]', function () {
                        overTimer && clearTimeout(overTimer);

                        overTimer = setTimeout($.proxy(self._activeTab, self, $(this)), 500);
                    })
                    .on('mouseout', '[data-role="tab"]', function () {
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
                $activeTab = $tabs
                    .removeClass(activeCls)
                    .eq(index)
                    .addClass(activeCls);

                targetId = $activeTab.data('target');

                this._activeTabContent(targetId);
            }
        },

        _activeTabContent: function (targetId) {
            var $tabCons = this.$tabCons;

            $tabCons
                .addClass('hidden')
                .filter('[data-id="' + targetId + '"]')
                .removeClass('hidden');
        }
    });

    new TabView({
        dom: '#left-tabview'
    });
})(this, jQuery);
// layout模板
var LAYOUT_TPL =
    '<div class="layout-item {{#isCommon}}js-isCommon{{/isCommon}}" data-id="{{id}}"  {{^isCommon}}data-cols="{{cols}}"{{/isCommon}} {{#isCommon}}data-layouts="{{layouts}}"{{/isCommon}} data-name="{{name}}"><div class="layout-item-inner"><img class="icon" src="{{icon}}" alt=""><img class="icon-hover" src="{{hoverIcon}}" alt=""><span class="name" title="{{name}}">{{name}}</span></div></div>';
// 通栏模板
var SIMPLE_LAYOUT_TPL =
    '<div class="simple-layout-item " data-cols="{{cols}}" data-name="{{name}}"><div class="simple-layout-item-inner"><img class="icon" src="{{icon}}"><img class="icon-hover" src="{{hoverIcon}}"><span class="name" title="{{name}}">{{name}}</span><span class="btn add"></span></div></div>';
// 元件模板
var EL_TPL =
    '<div class="el-item" data-id="{{id}}"><img src="{{icon}}" alt="" class="icon"><span class="name" title="{{name}}">{{{name}}}</span></div>';
// 列模板
var COL_TPL =
    '<div class="col-item{{#isLast}} isLast{{/isLast}}" style="width:{{width}}"><div class="col-item-inner"></div></div>';
// 列背景模板
var COL_BG_TPL = '<div class="col-bg-item" style="width:{{width}}"></div>';
// 元件模板
var ELEMENT_TPL =
    '<div class="element-item {{#showHeader}} showHeader{{/showHeader}} showToolbar" style="{{#borderColor}}{{borderColor}};{{/borderColor}}" data-id="{{id}}" data-name="{{title}}" data-url="{{url}}" data-manage-url="{{manageUrl}}" data-more-url="{{moreOpenUrl}}" data-link-open-type="{{linkOpenTYpe}}"><div class="element-header" style="{{#titleColor}}color:{{titleColor}};{{/titleColor}}{{#titleBgColor}}background:{{titleBgColor}};{{/titleBgColor}}">{{#titleIcon}}<img class="icon" src="{{titleIcon}}"/>{{/titleIcon}}<span class="name">{{title}}</span><div class="header-operations">{{#showMoreBtn}}<span class="icon open"></span>{{/showMoreBtn}}{{#showRefreshBtn}}<span class="icon refresh"></span>{{/showRefreshBtn}}</div></div><div class="element-toolbar"><span class="icon move"></span><span class="split"></span><span class="icon setting"></span><span class="icon refresh"></span><span class="icon delete"></span></div><div class="element-body" style="height:{{actualHeight}}px;{{#contentBg}}background:{{contentBg}};{{/contentBg}}"><iframe class="element-body-content" src="{{url}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe></div></div>';

// 通栏模板
(function (win, $) {
    var $list = $('#simple-layout-list');
    var render = function (data) {
        var html = '';
        $.each(data, function (i, item) {
            if (item.cols + '' !== item.cols) {
                item.cols = JSON.stringify(item.cols);
            }
            html += Mustache.render(SIMPLE_LAYOUT_TPL, Util.fixedIconPath(item));
        });
        $(html).appendTo($list);
    };
    /* global simpleTplConfig */
    render(simpleTplConfig);

    // 用户自定义列实现
    var $input = $('#simple-layout-userset-input');
    win.usersetLayout = {
        check: function (arr) {
            if (!arr || !arr.length) {
                return {
                    level: 'error',
                    msg: '至少存在一列'
                };
            }
            var sum = 0,
                errors = [],
                hasNaN = false;
            $.each(arr, function (i, item) {
                if (isNaN(item)) {
                    hasNaN = true;
                    return false;
                }
                sum += item;
            });
            if (hasNaN) {
                return {
                    level: 'error',
                    msg: '必须输入有效的列值，只接受数字和冒号'
                };
            }
            $.each(arr, function (i, item) {
                // 列宽不能小于 1/10
                if (item / sum <= 0.2) {
                    errors.push('第' + (i + 1) + '列宽度过小');
                }
            });

            if (errors.length) {
                return {
                    level: 'waring',
                    msg: errors.join(';<br/>') + '<br/>建议列宽不小于20%'
                };
            }

            return {
                level: 'success'
            };
        },
        getData: function () {
            var v = $.trim($input.val())
                .replace(/：/g, ':')
                .split(':');
            var arr = [];

            $.each(v, function (i, item) {
                item.length && arr.push(parseFloat(item, 10));
            });

            return {
                cols: arr,
                warning: this.check(arr)
            };
        },
        clear: function () {
            $input.val('');
            $input.focus();
        }
    };
    // 帮助提示
    var tip = new mini.ToolTip();
    tip.set({
        target: document,
        selector: '.userset-help',
        placement: 'right',
        trigger: 'click',
        autoHide: true,
        onopen: function (e) {
            var el = e.element;
            var title = el.getAttribute('data-tooltip');
            console.log(el);
            if (title) {
                var html =
                    '<div class="userset-help-box">\
                <div class="userset-help-header">设置方式</div>\
                <div class="userset-help-content">' +
                    title +
                    '<div></div>';

                tip.setContent(html);
            }
        }
    });
})(this, jQuery);

var elementManageEvent = new Util.UserEvent();
// 左侧渲染
(function (win, $) {
    var $sidebar = $('#sidebar'),
        $sidebarTigger = $('.sidebar-trigger', $sidebar);

    var $tabView = $('#left-tabview'),
        $layout = $('.layout-wrap', $tabView),
        $layoutTpl = $('.layout-tpl', $layout),
        $layoutTplList = $('.layout-list', $layoutTpl),
        $layoutUse = $('.layout-oftenuse', $layout),
        $layoutUseList = $('.layout-list', $layoutUse);

    var $elWrap = $('#el-content'),
        $elCommonPanel = $('.cotent-panel', $elWrap),
        $elSearchPanel = $('.result-panel', $elWrap);

    var $mainWrap = $('#right-container'),
        $contentWrap = $('.main-content-wrap', $mainWrap),
        $contentContainer = $('.main-content-container', $contentWrap);
    // $bgWrap = $('.col-bg', $mainWrap),
    // $colWrap = $('.col-content', $mainWrap);

    // #region lauout
    var generateSingleLayoutHtml = function (data) {
        var html = '';
        $.each(data, function (i, item) {
            item.layout = null;
            if (item.cols) {
                $.each(item.cols, function (i, it) {
                    item.cols[i] = parseFloat(it, 10) || 0;
                });
            }
            item.cols = JSON.stringify(item.cols);
            item.isCommon = false;
            html += Mustache.render(LAYOUT_TPL, Util.fixedIconPath(item));
        });
        return html;
    };
    var generateCommonLayoutHtml = function (data) {
        var html = '';
        $.each(data, function (i, item) {
            item.cols = null;
            if (item.layouts) {
                $.each(item.layouts, function (i, cols) {

                    $.each(cols, function (i, it) {
                        cols[i] = parseFloat(it, 10) || 0;
                    });

                });
            }
            item.layouts = JSON.stringify(item.layouts);
            item.isCommon = true;
            html += Mustache.render(LAYOUT_TPL, Util.fixedIconPath(item));
        });
        return html;
    };

    var drawLayoutBlock = function (data) {
        // 销毁之前的可放置以及元件排序
        var $cols = $contentWrap.find('.col-item');
        if ($cols.length) {
            destoryDrop($cols);
        }
        var $colInner = $contentWrap.find('.col-item-inner');
        if ($colInner.length) {
            destroyElSort($colInner);
        }
        // 清空内容
        $contentContainer.empty();

        // 重新绘制每块
        $.each(data, function (i, layout) {
            drawCols(layout);
        });
    };

    var drawCols = function (layout) {
        var data = layout.cols;

        var widthArr = [],
            len = data.length,
            t = 0;
        // 计算宽度比例并处理为数值
        $.each(data, function (i, item) {
            var w = parseFloat(item, 10);
            data[i] = w;
            if (w) {
                t += w;
                widthArr.push(w);
            }
        });
        var $layoutBlock = $(
            '<div class="layout-block" data-id="' +
            layout.id +
            '" data-name="' +
            layout.name +
            '" data-cols="' +
            JSON.stringify(layout.cols) +
            '"></div>'
        );
        var $bgWrap = $('<div class="col-bg"></div>').appendTo($layoutBlock);
        var $colWrap = $('<div class="col-content"></div>').appendTo($layoutBlock);
        // 插入布局块操作区域
        $(
            '<div class="layout-block-operations"><div class="inner"><span class="top icon" title="移到最上"></span><span class="up icon" title="上移"></span><span class="delete icon" title="删除"></span><span class="down icon" title="下移"></span><span class="bottom icon" title="移到最下"></span></div></div>'
        ).appendTo($layoutBlock);

        var contentHtml = '',
            bgHtml = '';
        $.each(widthArr, function (i, item) {
            var width = ((item * 1000000 / t) >> 0) / 1000000 * 100 + '%';
            contentHtml += Mustache.render(COL_TPL, {
                width: width,
                // 标记最后一个以便修复toolbar位置
                // 处理IE8兼容 IE9+使用:last-child即可
                isLast: i === len - 1 ? true : false
            });
            bgHtml += Mustache.render(COL_BG_TPL, {
                width: width
            });
        });

        COL_SCROLL_CONTENT = false;
        $(contentHtml).appendTo($colWrap);
        $(bgHtml).appendTo($bgWrap);
        // 滚动条插件使得结构变化需要进行判断
        // var $scrollerContainer = $contentWrap.find('> .mCustomScrollBox >
        // .mCSB_container');
        // $layoutBlock.appendTo($scrollerContainer.length ? $scrollerContainer
        // : $contentWrap);
        $layoutBlock.appendTo($contentContainer);

        // 画元件
        if (layout.elements && layout.elements.length) {
            $.each(Util.mergeSort(layout.elements, 'row'), function (i, item) {
                drawElement(item, false, $colWrap);
            });
        }

        // 初始化放置和排序
        initDrop($colWrap);
        initELSort($colWrap.find('.col-item-inner'));

        // 绘制完成触发最后一个改变事件，用于控制最后一个禁止下移
        elementManageEvent.fire('alyoutBlockChange');

        return $layoutBlock;
    };

    var getLayoutData = function (isRefresh) {
        return Util.ajax({
            url: getLayoutDataUrl,
            data: {
                query: 'getLayout',
                portalGuid: portalGuid
            }
        }).done(function (data) {
            if (!data) {
                return;
            }
            if (data.layoutTpl) {
                $(generateSingleLayoutHtml(data.layoutTpl)).appendTo($layoutUseList);
            }
            if (data.commonTpl) {
                $(generateCommonLayoutHtml(data.commonTpl)).appendTo($layoutUseList);

                !isRefresh && $layout.mCustomScrollbar({
                    // scrollbarPosition:'outside',
                    theme: 'dark-thin',
                    // autoHideScrollbar: true,
                    scrollButtons: {
                        enable: true
                    }
                });
            }
        });
    };
    getLayoutData();
    // #endregion

    // #region 元件模板
    var elTplCache = [];
    var generateElItemHtml = function (item) {
        item.icon = Util.getRightUrl(item.icon);
        return Mustache.render(EL_TPL, item);
    };
    var generateElHtml = function (data) {
        var html = '';
        $.each(data, function (i, category) {
            html +=
                '<h2 class="el-header"><span class="trigger"></span><span class="name">' +
                category.name +
                '</span></h2>';
            html += '<div class="el-list" data-cate="' + category.id + '">';
            // html += generateElItemHtml(category.items);
            $.each(category.items, function (i, item) {
                // 缓存数据
                elTplCache.push(item);
                html += generateElItemHtml(item);
            });
            html += '</div>';
        });
        return html;
    };

    var getElData = function () {
        return Util.ajax({
            url: getElDataUrl,
            data: {
                query: 'getElementTpl',
                portalGuid: portalGuid
            }
        }).done(function (data) {
            if (!data || !data.length) {
                return;
            }
            $(generateElHtml(data)).appendTo($elCommonPanel);
            // 滚动条
            $elWrap.mCustomScrollbar({
                // scrollbarPosition:'outside',
                theme: 'dark-thin',
                // autoHideScrollbar: true,
                scrollButtons: {
                    enable: true
                }
            });
            initTplDrag($elCommonPanel);
        });
    };
    getElData();
    // #endregion

    // #region 事件处理
    $sidebarTigger.on('click', function () {
        if ($sidebar.hasClass('min')) {
            $sidebar.removeClass('min');
            localStorage.setItem('_el-manage-status_', 'wide');
        } else {
            $sidebar.addClass('min');
            localStorage.setItem('_el-manage-status_', 'min');
        }
    });
    var elTplSearch = {
        filter: function (key) {
            var data = [];
            var reg = new RegExp(key, 'g');
            $.each(elTplCache, function (i, item) {
                if (reg.test(item.name)) {
                    var li = $.extend(true, {}, item);
                    li.name = li.name.replace(reg, function (m) {
                        return '<span class="kw">' + m + '</span>';
                    });
                    data.push(li);
                }
            });
            return data;
        },
        render: function (data) {
            destroyTplDrag($elSearchPanel);
            $elSearchPanel.empty();
            if (data && data.length) {
                var html = '';
                $.each(data, function (i, item) {
                    html += generateElItemHtml(item);
                });
                $(html).appendTo($elSearchPanel.removeClass('empty'));
                initTplDrag($elSearchPanel);
            } else {
                $elSearchPanel.addClass('empty');
            }
        },
        search: function (key) {
            key = $.trim(key);
            if (key) {
                this.render(this.filter(key));
                $elCommonPanel.addClass('hidden');
                $elSearchPanel.removeClass('hidden');
            } else {
                $elCommonPanel.removeClass('hidden');
                $elSearchPanel.addClass('hidden');
            }
        }
    };
    $sidebar
        // 内容展开收起
        .on('click', '.el-header, .layout-header', function (e) {
            if ($(e.target).hasClass('userset-help')) {
                // e.stopPropagation();
                return;
            }
            var $this = $(this),
                $list = $this.next();
            if (!$list.length) {
                return;
            }
            // $this.toggleClass('collapsed');
            if ($this.hasClass('collapsed')) {
                $this.removeClass('collapsed');
                $list.stop(true).slideDown();
            } else {
                $this.addClass('collapsed');
                $list.stop(true).slideUp();
            }
        })
        // 搜索
        .on('click', '.el-search-icon', function () {
            var key = $(this)
                .prev()
                .val();
            elTplSearch.search(key);
        })
        .on('keypress', '.el-search-input', function (e) {
            if (e.which === 13) {
                var key = this.value;
                elTplSearch.search(key);
            }
        });

    function doAddLayout(layoutData) {
        var $block = drawCols(layoutData);
        $contentWrap.mCustomScrollbar('scrollTo', $block.position().top, {
            // 关闭滚动动画 防止卡顿
            scrollInertia: 0
        });
        setTimeout(function () {
            Util.highlightBlock($block);
        });
    }
    $layout
        .on('click', '.simple-layout-userset .add', function () {
            var data = usersetLayout.getData(),
                warning = data.warning,
                layoutData = {
                    cols: data.cols,
                    id: Util.uuid(),
                    name: data.cols.join(':')
                };
            if (warning.level == 'error') {
                return mini.alert(warning.msg, '系统提醒', function (e) {
                    usersetLayout.clear();
                });
            }
            var msg =
                '将加入 ' +
                layoutData.name +
                ' 的布局，' +
                (warning.msg ? '但是：<br/>' + warning.msg : '') +
                '<br/>确认添加？';
            mini.confirm(msg, '系统提醒', function (action) {
                if (action == 'ok') {
                    doAddLayout(layoutData);
                }
            });
        })
        .on('click', '.simple-layout-item .add', function () {
            var $this = $(this).closest('.simple-layout-item'),
                name = $this.data('name'),
                layoutData = {
                    id: $this.data('id') || Util.uuid(),
                    name: name,
                    cols: $this.data('cols')
                };
            if (layoutData.cols + '' === layoutData.cols) {
                layoutData.cols = JSON.parse(layoutData.cols);
            }
            mini.confirm('新加入 ' + name + ' 的布局？', '系统提醒', function (e) {
                if (e == 'ok') {
                    doAddLayout(layoutData);
                }
            });
        })
        .on('click', '.layout-item', function () {
            var $this = $(this),
                $cols = $contentWrap.find('.col-item'),
                isCommon = $this.hasClass('js-isCommon');
            // if ($this.hasClass('active')) {
            // return;
            // }
            if ($cols.length) {
                return mini.confirm('原布局将被替换，是否继续？', '系统提醒', function (e) {
                    if (e == 'ok') {
                        // $layout.find('.layout-item').removeClass('active');
                        // $this.addClass('active');
                        replaceLayouts($this, isCommon);
                    }
                });
            }

            replaceLayouts($this, isCommon);
        });

    function replaceLayouts($this, isCommon) {
        if (isCommon) {
            var layoutArr = [];
            var layoutCols = $this.data('layouts');

            if (layoutCols + '' === layoutCols) {
                layoutCols = JSON.parse(layoutCols);
            }
            $.each(layoutCols, function (i, cols) {
                layoutArr.push({
                    cols: cols
                });
            });
            if (!layoutArr || !layoutArr.length) {
                console.error('常用布局模板错误！');
                return;
            }
            // 重新替换为多布局 只能所有元件直接放在新的布局的第一个里面
            layoutArr[0] = dealOverCols(getOldElementsData(false), layoutArr[0])[0];

            // 重新绘制
            drawLayoutBlock(layoutArr);
        } else {
            var layoutData = {
                id: $this.data('id'),
                name: $this.data('name')
            };
            var cols = $this.data('cols');
            if (cols + '' === cols) {
                cols = JSON.parse(cols);
            }
            layoutData.cols = cols;
            // 获取原来的元件数据 并处理列溢出
            var data = dealOverCols(getOldElementsData(false), layoutData);
            console.log(data);

            // 重新绘制
            drawLayoutBlock(data);
        }
    }
    // 鼠标进入出现工具栏
    var timerCache = {};
    // 布局删除的处理函数
    function doLayoutBlockRemove($block) {
        destoryDrop($block.find('.col-item'));
        destroyElSort($block.find('.col-item-inner'));
        // 缓存数据清理
        $block.find('.element-item').each(function (i, item) {
            elementsCache[item.getAttribute('data-id')] = null;
        });
        $block.remove();
    }
    $mainWrap
        .on('mouseenter', '.element-item', function () {
            var $this = $(this),
                id = $this.data('id');
            if (timerCache[id]) {
                clearTimeout(timerCache[id]);
            }
            $this.css('z-index', Util.getZIndex()).addClass('enter');
        })
        .on('mouseleave', '.element-item', function () {
            var $this = $(this),
                id = $this.data('id');
            timerCache[id] = setTimeout(function () {
                $this.removeClass('enter');
            }, 500);
        })
        // 工具栏点击
        .on('click', '.element-toolbar > .setting', function () {
            var $el = $(this).closest('.element-item'),
                id = $el.data('id'),
                url = $el.data('manage-url');

            if (id) {
                epoint.openTopDialog('元件配置', url, function (e) {
                    // 元件更新后 根据新配置更新元件
                    if (e == 'save') {
                        updateElements($el);
                    }
                }, {
                    width: 600,
                    height: 550
                });
            }
        })
        .on('click', '.element-toolbar > .refresh,.header-operations > .refresh', function () {
            var $el = $(this).closest('.element-item'),
                iframe = $el.find('.element-body-content')[0],
                url = $el.data('url');
            // 不跨域直接reload 否则 重设url
            // try {
            // iframe.contentWindow.location.reload();
            // } catch (err) {
            // var url = iframe.src;
            // iframe.src = 'about:blank;';
            // iframe.src = url;
            // }
            // 如果内容错误，reload还是错误页面 刷新应重新加载原url
            iframe.src = 'about:blank;';
            iframe.src = url;
        })
        .on('click', '.element-toolbar > .delete', function () {
            var $el = $(this).closest('.element-item');
            mini.confirm('确认移除此元件吗？', '系统提醒', function (action) {
                if (action == 'ok') {
                    removeElement($el);
                }
            });
        })
        .on('click', '.header-operations > .open', function () {
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
        })
        // 布局块上移，下移，删除操作
        .on('click', '.layout-block-operations .icon', function () {
            var $this = $(this),
                $block = $this.closest('.layout-block'),
                index = $block.index(),
                hasMoved = false;

            if ($this.hasClass('top')) {
                if (index === 0) {
                    console && console.error && console.error('已经是第一个，无法上移');
                    return;
                }

                $block.prependTo($block.parent());
                hasMoved = true;
            } else if ($this.hasClass('up')) {
                if (index === 0) {
                    console && console.error && console.error('已经是第一个，无法上移');
                    return;
                }

                $block.insertBefore($block.prev());
                hasMoved = true;
            } else if ($this.hasClass('delete')) {
                var $elements = $block.find('.element-item');
                if ($elements.length) {
                    mini.confirm('布局内存在的元件，将会被一并删除', '系统提醒', function (action) {
                        if (action == 'ok') {
                            doLayoutBlockRemove($block);
                            $block = null;
                        }
                    });
                } else {
                    doLayoutBlockRemove($block);
                    $block = null;
                }
            } else if ($this.hasClass('down')) {
                if ($block.is(':last-child')) {
                    console && console.error && console.error('已经是最后一个，无法下移');
                    return;
                }

                $block.insertAfter($block.next());
                hasMoved = true;
            } else if ($this.hasClass('bottom')) {
                if ($block.is(':last-child')) {
                    console && console.error && console.error('已经是最后一个，无法下移');
                    return;
                }

                $block.appendTo($block.parent());
                hasMoved = true;
            }

            // 滚动并高亮
            if (hasMoved && $block) {
                $contentWrap.mCustomScrollbar('scrollTo', $block.position().top, {
                    // 关闭滚动动画 防止卡顿
                    scrollInertia: 0
                });
                setTimeout(function () {
                    Util.highlightBlock($block);
                });
            }

            // 触发最后一个改变事件，用于控制最后一个禁止下移的鼠标样式
            elementManageEvent.fire('alyoutBlockChange');
            return;
        })
        // 布局块操作标识
        .on('mouseenter', '.layout-block-operations', function (e) {
            $(this)
                .closest('.layout-block')
                .addClass('active');
        })
        .on('mouseleave', '.layout-block-operations', function (e) {
            $(this)
                .closest('.layout-block')
                .removeClass('active');
        })
        // 移除删除
        .on('mouseenter', '.layout-block-operations .delete', function () {
            $(this)
                .closest('.layout-block')
                .addClass('danger');
        })
        .on('mouseleave', '.layout-block-operations .delete', function () {
            $(this)
                .closest('.layout-block')
                .removeClass('danger');
        });
    // #endregion

    // #region 拖拽相关
    var $dragPlaceHolder = $('<div><div>').css({
        border: '2px solid #ccc',
        margin: 3,
        height: 200
    });
    var tplDragCfg = {
        distance: 20, // 触发距离
        revert: 'invalid', // 不是在可放置区域时还原
        snap: '.col-item-inner', // 对齐
        snapMode: 'inner',
        helper: function () {
            return $('<div style="width:200px;height:200px;background:rgba(0,0,0,.4);"></div>');
        },
        drag: function (e, ui) {
            var $currCol = $contentWrap.find('.col-item.active');
            // 在可接受区域内
            $dragPlaceHolder.remove();
            if ($currCol.length) {
                insertToAdaptPos(ui.position, $currCol.find('>.col-item-inner'));
            }
        },
        zIndex: 10000,
        appendTo: 'body'
    };
    var dropCfg = {
        hoverClass: 'active',
        activeClass: 'hl',
        tolerance: 'pointer', // 鼠标在其他元素上即可认为放置，替代默认的“intersect”至少50%模式，可修复较宽元素无法拖入很窄的列中的问题
        drop: function (e, ui) {
            // 区分是侧边元件模板的拖拽放置 还是 元件移动位置的
            if (ui.draggable.hasClass('el-item')) {
                var aimIndex = $dragPlaceHolder.index(),
                    $colInner = $(this).find('.col-item-inner');
                $dragPlaceHolder.remove();
                var $aimEl = $colInner.children().eq(aimIndex);
                // 占位符添加，然后发送新建请求
                var $holder = $(ui.helper[0])
                    .clone()
                    .css({
                        position: 'static',
                        width: 'auto',
                        minHeight: 200,
                        marginBottom: 20,
                        lineHeight: '200px',
                        color: '#fff',
                        textAlign: 'center'
                    })
                    .append('<p>元件创建中，请稍后...</p>');
                // 占位元素放置在正确的位置
                if ($aimEl.length) {
                    $holder.insertBefore($aimEl);
                } else {
                    $holder.appendTo($colInner);
                }
                // 发送新建请求 替换为实例元件
                initActualEl({
                        tplId: ui.draggable.data('id')
                    },
                    $holder
                );
            }
            // else if (ui.draggable.hasClass('element-item')) {
            // // 自身移动位置
            // console.log(ui.draggable);
            // }
        }
    };
    var posUpdateTimer;
    var sortCfg = {
        connectWith: '.col-item-inner',
        handle: '.move',
        opacity: 0.3,
        revert: true,
        zIndex: 9999,
        // containment: '.col-content',
        forcePlaceholderSize: true, // 强制占位元素具有尺寸
        // forceHelperSize:true,
        tolerance: 'pointer', // 鼠标在其他元素上即可认为放置，替代默认的“intersect”至少50%模式，可修复较宽元素无法拖入很窄的列中的问题
        placeholder: 'element-sortable-placeholder',
        // 元素移出时更新当前的高度
        out: function (event, ui) {
            elementManageEvent.fire('adjustElement', {
                $wrap: $(ui.item).closest('.layout-block')
            });
        },
        // 排序完成 且dom已经更新时 提交最新更改
        update: function (e, ui) {
            elementManageEvent.fire('adjustElement', {
                $wrap: $(ui.item).closest('.layout-block')
            });
            // 多列更新时，update会触发多次 以最后一次为准
            // clearTimeout(posUpdateTimer);
            // posUpdateTimer = setTimeout(function() {
            // saveElements();
            // }, 50);
        }
    };
    // 记录滚动容器
    var COL_SCROLL_CONTENT;
    // 根据位置获取占位插入位置
    var insertToAdaptPos = function (pos, $col) {
        // 没有子元素直接插入
        var $children = $col.children();
        if (!$children.length) {
            return $dragPlaceHolder.appendTo($col);
        }
        // 容器已经滚动高度
        var scrollTop = 0;
        // 已经存在实例 则直接取 否则从jq上获取
        // if (colNiceScrollObj) {
        // scrollTop = colNiceScrollObj.getScrollTop();
        // } else if ($colWrap.getNiceScroll) {
        // colNiceScrollObj = $colWrap.getNiceScroll(0);
        // scrollTop = colNiceScrollObj.getScrollTop();
        // }
        if (!COL_SCROLL_CONTENT) {
            COL_SCROLL_CONTENT = $contentWrap.find('>.mCustomScrollBox>.mCSB_container')[0];
        }
        scrollTop = Math.abs(parseInt(COL_SCROLL_CONTENT.style.top, 10));

        var block_t = $col.closest('.layout-block').position().top || 0;
        // 位置的真实高度 滚动过的高度 + 位置 - 容器的顶部
        var t = scrollTop + pos.top - block_t;
        // 计算子元素高度
        var c_t = 0,
            curr_h = 0,
            inserted = false,
            $currEl;

        $children.each(function (i, item) {
            $currEl = $(item);
            curr_h = $currEl.height();
            // 逐个向下计算高度，当加上当前高度一半时 已经在鼠标下面 则插入到这个前面
            if (c_t + curr_h / 2 > t) {
                inserted = true;
                $dragPlaceHolder.insertBefore($currEl);
                return false;
            } else {
                // 否则继续相加 20 为marginBottom
                c_t += curr_h + 20;
            }
        });

        // 仍然未插入 则直接最后
        if (!inserted) {
            return $dragPlaceHolder.appendTo($col);
        }
    };
    var initTplDrag = function ($wrap) {
        $wrap.find('.el-item').draggable(tplDragCfg);
    };
    var destroyTplDrag = function ($wrap) {
        $wrap.find('.el-item').draggable('destroy');
    };
    var initELSort = function ($colInner) {
        $colInner.sortable(sortCfg);
    };
    var destroyElSort = function ($colInner) {
        $colInner.sortable('destroy');
    };

    var initDrop = function ($colWrap) {
        $colWrap.find('.col-item').droppable(dropCfg);
    };
    var destoryDrop = function ($cols) {
        $cols.droppable('destroy');
    };
    // #endregion

    // #region 元件相关
    var elementsCache = {};
    win.elementsCache = elementsCache;
    // 获取原来的元件数据
    var getOldElementsData = function (asPlainArray) {
        var oldData = [];
        // 遍历每个布局块
        $contentWrap.find('.layout-block').each(function (i, block) {
            var blockData = {
                id: block.getAttribute('data-id'),
                name: block.getAttribute('data-name'),
                cols: JSON.parse(block.getAttribute('data-cols')),
                elements: []
            };
            // cols数据类型处理
            $.each(blockData.cols, function (i, item) {
                blockData.cols[i] = parseInt(item, 10);
            });
            oldData.push(blockData);
            // 遍历布局块中的每列
            $(block)
                .find('.col-item')
                .each(function (colIndex, col) {
                    if (!blockData.elements[colIndex]) {
                        blockData.elements[colIndex] = [];
                    }
                    // 遍历列中的每个元件
                    $(col)
                        .find('.element-item')
                        .each(function (i, item) {
                            var id = $(item).data('id'),
                                data = elementsCache[id];
                            // 根据dom位置更新row值、col值
                            data.row = i;
                            data.col = colIndex;
                            blockData.elements[colIndex].push(data);
                        });
                });
        });
        // 输出为简单数组
        if (asPlainArray) {
            return toPlainArr(oldData);
        }
        return oldData;
    };
    win.getElementDataFromEl = getOldElementsData;
    // 溢出列处理
    var dealOverCols = function (layoutBlocks, newLayout) {
        if (!newLayout.elements) {
            newLayout.elements = [];
        }
        // 新布局的列的数目
        var newColsCount = newLayout.cols.length;
        // 遍历原来布局中所有的块对列进行处理
        $.each(layoutBlocks, function (index, block) {
            var oldData = block.elements;
            var overCols = oldData.length - newColsCount;

            if (overCols > 0) {
                // 某一布局下列未溢出则直接放入新布局中即可，无需处理
                // 溢出列逐个移动到前面每一列
                var colIndex = 0;
                for (var i = 0; i < overCols; i++) {
                    // 溢出的列中拿出一个 逐个添加到前面的列
                    while (oldData[newColsCount + i].length) {
                        var oldElement = oldData[newColsCount + i].shift();
                        // 修复列索引
                        oldElement.col = colIndex;
                        oldData[colIndex].push(oldElement);
                        if (++colIndex >= newColsCount) {
                            colIndex = 0;
                        }
                    }
                }
            }
            // 更新到新数据
            newLayout.elements = newLayout.elements.concat(oldData);
        });

        return toPlainArr([newLayout]);
    };
    // 列嵌套数组扁平化
    var toPlainArr = function (data) {
        $.each(data, function (blockIndex, block) {
            // 列嵌套数组扁平化
            var arr = [];
            $.each(block.elements, function (col, colsData) {
                arr = arr.concat(colsData);
            });
            block.elements = arr;
        });
        return data;
    };
    // 拖拽元件模板新建元件
    var initActualEl = function (info, $holder) {
        createActualEL(info).then(function (data) {
            drawElement(data, $holder, $holder.closest('.col-content'));
        });
    };
    var createActualEL = function (info) {
        return Util.ajax({
            url: createElementUrl,
            data: $.extend({
                    query: 'createElement',
                    portalGuid: portalGuid
                },
                info
            )
        });
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
            data.manageUrl = Util.getRightUrl(_dealUrl(data.manageUrl, id));
            if (data.titleIcon) {
                data.titleIcon = Util.getRightUrl(data.titleIcon);
            }
            return data;
        };
    })();
    var ELEMENT_PADDING = 15;
    var drawElement = function (data, $placeHolader, $colWrap) {
        // 缓存数据
        data.col = parseInt(data.col, 10);
        elementsCache[data.id] = $.extend({}, data);
        // 处理高度
        if (!data.height || data.height == 'auto') {
            data.actualHeight = (data.customTitleHeight ? (parseInt(data.customTitleHeight, 10) || 0) : 0) + 30 * data.itemNum + ELEMENT_PADDING * 2;
        } else {
            data.actualHeight = data.height || 300;
        }
        if (data.borderColor) {
            data.borderColor = getBorderColorStyle(data.borderColor);
        }
        // 处理地址
        data = dealUrl(data);
        // 生成HTML
        var $html = $(Mustache.render(ELEMENT_TPL, data));
        if ($placeHolader) {
            $placeHolader.replaceWith($html);
        } else {
            var $aimCol = $colWrap.find('.col-item').eq(data.col);
            if ($aimCol.length) {
                $html.appendTo($aimCol.find('.col-item-inner'));
            } else {
                console.error('元件数据和列不匹配', data);
            }
        }
        elementManageEvent.fire('adjustElement', {
            $wrap: $colWrap.closest('.layout-block')
        });
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
    // 更新元件 用于配置页调整后更新
    var updateElements = function ($oldEl) {
        // 遮罩 发请求移除元件
        mini.mask({
            el: document.body,
            html: '元件更新中'
        });
        return Util.ajax({
                url: getELementDataUrl,
                data: {
                    query: 'getElementData',
                    portalGuid: portalGuid,
                    elementId: $oldEl.data('id')
                }
            })
            .done(function (data) {
                if (data) {
                    // 重新绘制替换之前的元件
                    drawElement(data, $oldEl, $oldEl.closest('.col-content'));
                    mini.showTips({
                        content: '元件更新成功',
                        state: 'success',
                        x: 'center',
                        y: 'center'
                    });
                }
            })
            .always(function () {
                mini.unmask(document.body);
            });
    };
    var removeElement = function ($el) {

        var id = $el.data('id');
        elementsCache[id] = null;
        var $block = $el.closest('.layout-block');
        $el.remove();
        // 更新高度
        elementManageEvent.fire('adjustElement', {
            $wrap: $block
        });
    };

    var saveElements = function () {
        mini.mask({
            el: document.body,
            html: '保存中...'
        });
        var data = getOldElementsData(true);
        return Util.ajax({
                url: saveElementsUrl,
                data: {
                    query: 'saveElements',
                    portalGuid: portalGuid,
                    elements: JSON.stringify(data)
                }
            })
            .done(function (data) {
                if (data.success) {
                    mini.showTips({
                        content: '保存成功',
                        state: 'success',
                        x: 'center',
                        y: 'center'
                    });
                }
            })
            .always(function () {
                mini.unmask(document.body);
            });
    };
    win.saveLayoutAndElements = saveElements;
    // 保存模板
    win.saveLayoutData = function (name) {
        var layoutData = {
            name: name,
            icon: './images/layout/icon-common.png',
            layouts: []
        };
        $contentContainer.find('.layout-block').each(function (i, block) {
            var $block = $(block);
            var cols = $block.data('cols');

            layoutData.layouts.push(cols);
        });

        return Util.ajax({
            /* global saveLayoutDataUrl */
            url: saveLayoutDataUrl,
            data: {
                query: 'saveLayoutData',
                data: JSON.stringify(layoutData)
            }
        }).done(function (data) {
            if (data.success) {
                mini.showTips({
                    content: '保存成功',
                    state: 'success',
                    x: 'center',
                    y: 'center'
                });
                // 更新左侧
                $layoutUseList.empty();
                getLayoutData(true);

            } else {
                if (data.msg) {
                    mini.showTips({
                        content: data.msg,
                        state: 'warning',
                        x: 'center',
                        y: 'center'
                    });
                }
            }
        });
    };
    // #endregion

    // 记住上次的折叠状态
    $(function () {
        var sidebarStatus = localStorage.getItem('_el-manage-status_');
        if (sidebarStatus === 'min') {
            $sidebar.addClass('min');
        } else if (sidebarStatus === 'wide') {
            $sidebar.removeClass('min');
        }
    });

    // 事件处理
    (function () {
        // 处理高度防止一列过高，其他列过矮，无法拖入矮列的情况
        // 多布局则有多个调整的timer
        var heightTimer = {};
        var adjust = function ($wrap) {
            var $cols = $wrap.find('.col-item-inner');
            var h_arr = [];
            $cols.css('min-height', 'auto').each(function (i, item) {
                // h_arr.push($(item).outerHeight());
                h_arr.push($(item).height());
            });
            var max_h = Math.max.apply(Math, h_arr);
            // 150为预留的 padding-bottom 由于使用min-height控制高度，防止不一致必须加上
            // 不适用height控制高度是因为设置height后，拖动的占位符无法将将容器撑开
            // $cols.css('min-height', max_h + 150);

            if (max_h < 150) {
                max_h = 150;
            }
            $cols.css('min-height', max_h);
        };
        // 在元件新增和移动时 调整列高
        elementManageEvent.on('adjustElement', function (e) {
            var eventData = e.data,
                layoutId = e.data.$wrap.data('id');
            clearTimeout(heightTimer[layoutId]);

            // 连续拖动或者绘制时，以最后一次为准
            heightTimer[layoutId] = setTimeout(function () {
                adjust(eventData.$wrap);
            }, 200);
        });

        // IE8 最后一个布局块标记
        if (Util.browsers.isIE8) {
            var blockChangeTimer;
            elementManageEvent.on('alyoutBlockChange', function () {
                clearTimeout(blockChangeTimer);
                blockChangeTimer = setTimeout(function () {
                    var $blocks = $mainWrap.find('.layout-block');
                    $blocks.removeClass('is-last');
                    $blocks.last().addClass('is-last');
                }, 50);
            });
        }
    })();

    // 初始化加载
    win.initportal = function (pid) {
        return Util.ajax({
            url: getPortalDataUrl,
            data: {
                query: 'getPortalData',
                portalGuid: pid
            }
        }).done(function (data) {
            if (!data || !data.layouts) {
                console.error('门户初始化信息数据错误！');
                return;
            }

            // 画布局并添加其中的元件
            drawLayoutBlock(data.layouts);

            // 重新初始化滚动
            $contentWrap.mCustomScrollbar({
                theme: 'dark-thin',
                scrollbarPosition: 'outside',
                // autoHideScrollbar: true,
                scrollButtons: {
                    enable: true
                }
            });
        });
    };
})(this, jQuery);

(function (win, $) {
    if (Util.browsers.isIE67 || Util.browsers.isIE8 || Util.browsers.isIE9) {
        Util.loadJs('frame/fui/js/widgets/jquery.placeholder.min.js', function () {
            $('input[placeholder]').placeholder();
        });
    }
})(this, jQuery);


(function (win, $) {
    var $helpCenter = $('#help-center');

    $helpCenter.on('click', '.help-center-close', function () {
        $helpCenter.removeClass('active');
    });
    win.showHelp = function () {
        $helpCenter.addClass('active');
    };
})(this, jQuery);
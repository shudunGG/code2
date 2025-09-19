// 元件模板
var WIDGET_TPL = '<li class="widget gs-w" data-id="{{code}}" data-view="{{view}}"><iframe src="" data-src="{{url}}" frameborder="0" width="100%" height="100%" scrolling="no"></iframe><div class="widget-cover trans hidden"><div class="widget-sz-opts">{{#btns}}<span class="widget-sz-btn {{cls}}" data-view="{{view}}" title="{{title}}"></span>{{/btns}}</div></div></li>';

(function (win, $) {
    // 元件间距
    var GAP = 10;
    // 元件基础尺寸
    // var BASE_SIZE = [130, 130];

    // revise by chendongshun at 2017.05.11
    // cause : 为了防止大屏幕下，空白过多的问题，基础尺寸根据屏幕大小来计算。注 原始130 是为1200 的宽度设计的，下面是在此基础上等比缩放
    var BASE_SIZE = (function () {
        var _base = 130;
        var width = $(win).width();
        if (width > 1366) {
            _base *= width / 1200;
        }
        return [_base, 130];
    })();

    var VIEW_ARR = ['small', 'medium', 'large'];

    var M = Mustache,
        widgetTempl = WIDGET_TPL;

    var $widgetList = $('#my-desktop ul');

    // gridster 的容器宽度仅有内容决定，会导致显示有问题需要为其设置最小宽度 列宽 * 8
    $widgetList.css('min-width', (BASE_SIZE[0] + GAP * 2) * 8);

    // gridster组件实例
    var gridster = $widgetList.gridster({
        widget_margins: [GAP, GAP],
        widget_base_dimensions: BASE_SIZE,
        extra_cols: 4,
        max_cols: 8,
        // 拖拽过程中不显示视图切换按钮
        draggable: {
            start: function (event, ui) {
                ui.$player.find('.widget-sz-opts').addClass('hidden');
            },
            stop: function (event, ui) {
                ui.$player.find('.widget-sz-opts').removeClass('hidden');
            }
        },
        // FOR: gridster.serialize
        // 元件序列化时，返回自定义的信息
        serialize_params: function ($w, wgd) {
            return {
                code: $w.data('id'),
                col: wgd.col,
                row: wgd.row,
                view: $w.data('view')
            };
        }
    }).data('gridster');

    // 根据视图类型返回size比列
    var getSize = function (view) {
        var size = {};

        switch (view) {
            case VIEW_ARR[0]:
                size.x = 1;
                size.y = 1;
                break;

            case VIEW_ARR[1]:
                size.x = 2;
                size.y = 2;
                break;

            case VIEW_ARR[2]:
                size.x = 4;
                size.y = 2;
                break;
        };

        return size;
    };

    // 增加元件
    var addWidget = function (html, opt) {
        var sz = getSize(opt.view);

        // 明确位置的
        if (opt.col && opt.row) {
            gridster.add_widget(html, sz.x, sz.y, opt.col, opt.row);

            // 不明确位置的
        } else {
            gridster.add_widget(html, sz.x, sz.y);
        }
    };

    // 获取切换按钮的渲染对象
    // FOR: getWidgetViewObj
    var _getBtnView = function (i, url, view) {
        var btn = {},
            cls = [],
            title = '',
            curView = VIEW_ARR[i];

        cls.push(curView);

        if (view == curView) {
            cls.push('active')
        }

        if (!url) {
            cls.push('disabled');
            title = '该组件未配置' + curView + '视图';
        } else {
            title = '切换到' + curView + '视图';
        }

        btn.title = title;
        btn.view = curView;

        btn.cls = cls.join(' ');

        return btn;
    };

    // 获取构建元件视图的对象，用于模板渲染
    var getWidgetViewObj = function (opt) {
        var view = {};

        $.extend(view, {
            code: opt.code,
            view: opt.view,
            url: CacheMgr.getWidgetViewUrl(opt.code, opt.view),
            btns: (function () {
                var ret = [],
                    i = 0,
                    len = opt.urls.length;

                for (; i < len; i++) {
                    ret.push(_getBtnView(i, opt.urls[i], opt.view));
                }

                return ret;
            }())
        });

        return view;
    };

    // 元件缓存管理
    var CacheMgr = {

        _cache: {},

        // 缓存元件信息
        cacheWidgetData: function (data) {
            this._cache[data.code] = data;
        },

        // 根据视图类型返回对应url
        getWidgetViewUrl: function (id, view) {
            var data = this._cache[id],
                url = '';

            var i = $.inArray(view, VIEW_ARR);

            if (i !== -1) {
                url = data.urls[i];
            }

            return url;
        }
    };

    // 元件遮罩层集合
    var $widgetCovers = null;

    // FOR: initView
    // 初始化元件后，加载元件内容
    // 为了防止多个iframe同时load，造成浏览器假死
    // 采用异步方式，错开时间
    var _loadIframes = function () {
        var i = 0,
            $iframes = $('.widget > iframe'),
            len = $iframes.length;

        setTimeout(function load() {
            $iframes[i].src = Util.getRightUrl($iframes.eq(i).data('src'));

            i++;
            if (i == len) return;

            setTimeout(load, 120);
        }, 120);
    };

    // 初始化元件布局
    var initView = function (data) {
        var noPosArr = [],
            item;

        if (data && data.length) {
            // 把位置未定的元件过滤出来
            // $.each(data, function(i, item) {
            // 	if(!item.col || !item.row) {
            // 		noPosArr.push(data.splice(i, 1)[0]);
            // 	}
            // });

            // 原先的写法有问题，splice会改变原数组的长度，导致循环的length会随着splice的调用而减少
            for (var i = 0, len = data.length; i < len; i++) {
                item = data[i];
                if ((!item.col && item.col !== 0) || (!item.row && item.row !== 0)) {
                    noPosArr.push(data.splice(i, 1)[0]);
                    len--;
                }
            }

            /**
	         * 2017.01.24 By chends
	         * 需要对数组按行进行排序，否则实际位置可能与制定位置不符
	         * 以下数据为例：
			 row | col
			 ---|---
			 5 | 2
			 3 | 1
			 1 | 3

			 1. 解析时，5行2列添加，头部不应有空行，5行2列调整至1行列；

			 2. 3行1列正常，直接添加
			 3. 1行3列 应占据第一行，之前的进行下移，将1,2变成3,2，将3,1变成5,1。自己占据1,3
			 到此 布局结束：

			 row  | col
			 ---|---
			 3 | 2
			 5 | 1
			 1 | 3

			 从而导致了实际布局和数据不一致。

			 解决方案：
			 1、 查阅资料看有无不进行空行上移的参数。(无此配置)
			 2、 尝试对数据按行排序后再调用添加方法。
             */
            var temp;
            for (i = 0, len = data.length; i < len; i++) {
                for (var j = 0; j < len - 1 - i; j++) {
                    if (data[j].row > data[j + 1].row) {
                        temp = data[j + 1];
                        data[j + 1] = data[j];
                        data[j] = temp;
                    }
                }
            }

            // END

            // 如果存在位置未定的元件，追加原数组末尾
            if (noPosArr.length) {
                $.each(noPosArr, function (i, item) {
                    data.push(item);
                });
            }

            $.each(data, function (i, item) {
                CacheMgr.cacheWidgetData(item);

                var html = M.render(widgetTempl, getWidgetViewObj(item));

                addWidget(html, item);
            });

            $widgetCovers = $('.widget-cover');

            _loadIframes();
        }
    };

    // 调整元件视图
    var adjustWidgetView = function ($widget, view) {
        var id = $widget.data('id'),
            url = CacheMgr.getWidgetViewUrl(id, view),
            size = getSize(view);

        $widget.data('view', view);

        gridster.resize_widget($widget, size.x, size.y, function () {
            // 视图改变，iframe切换地址略有卡顿，采用异步延时
            setTimeout(function () {
                $widget.find('> iframe')[0].src = Util.getRightUrl(url);
            }, 400);
        });
    };

    // 桌面锁
    var $lock = $('#desktop-lock');

    // 保存桌面元件信息
    var _saveXhr = null;
    var saveDesktop = function () {
        _saveXhr && _saveXhr.abort();

        _saveXhr = Util.ajax({
            type: 'POST',
            url: Util.getRightUrl(MyDesktop.save.url),
            data: $.extend(MyDesktop.save.params, {
                widgetStatus: JSON.stringify(gridster.serialize())
            }),
            success: Util.noop,
            error: Util._ajaxErr
        });
    };

    // 初始化元件视图切换事件
    var initEvent = function () {

        $widgetList.on('click', '.widget-sz-btn', function (e) {
            var $btn = $(this);

            // 高亮|失效 状态不做处理
            if ($btn.hasClass('active') || $btn.hasClass('disabled')) return;

            var $widget = $btn.closest('.widget');

            $btn.addClass('active')
                .siblings()
                .removeClass('active');

            adjustWidgetView($widget, $btn.data('view'));
        });

        $lock.on('click', function (e) {
            var $btn = $(this);

            // 解锁元件：视图可编辑
            if ($btn.hasClass('locked')) {
                $btn.removeClass('locked')
                    .addClass('unlocked');

                $widgetCovers.removeClass('hidden');

                // 锁定元件：视图不可编辑
            } else {
                $btn.removeClass('unlocked')
                    .addClass('locked');

                $widgetCovers.addClass('hidden');

                // 保存元件
                saveDesktop();
            }
        });
    };

    // 初始化我的桌面
    var initDesktop = function () {
        var xhr = Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: Util.getRightUrl(MyDesktop.get.url),
            data: MyDesktop.get.params,
        });

        xhr.done(initView, initEvent)
            .fail(Util._ajaxErr);
    };

    $(initDesktop);

}(this, jQuery));
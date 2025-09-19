/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-08-29 14:56:02
 * @Description: '' 
 */
var $container = $('#grid-container');

var cacheColumnResult = {}; // 缓存请求
cacheColumnCountResult = {}; // 缓存数字请求

// 栅格及元件参数
var containerSize = {
        w: $container.width(),
        h: $container.height()
    },
    GAPS = [8, 8], // 元件边距
    COLS = 24, // 列数
    ROW_H = 57, // 行间距，计算时需要加上 元件边距 的高度 * 2
    MAX_COLSPAN = 24, // 元件最大跨列数
    MAX_ROWSPAN = 6, // 元件最大列数
    MIN_COLSPAN = 4, // 元件最小跨列数
    MIN_ROWSPAN = 4, // 元件最小跨行数
    BASE_SIZE = (function () { // 元件本身占的宽度和高度
        var c_w = containerSize.w,
            // base_x = (c_w - GAPS[0] * (2 * COLS - 1)) / COLS;
            base_x = (c_w - GAPS[0] * (2 * COLS)) / COLS;
        return [base_x, ROW_H];
    })();

var MOVE_WIDTH = 50;


// 点击事件
(function (win, $) {

    $('body').on('click', '.clock', function () {
        top.epoint.openLightDialog(Util.getRightUrl('./deskedit?portalGuid=' + portalGuid), function (param) {
            if (param.type == 'ok') {
                var tableData = JSON.parse(param.options);
                gridster.remove_all_widgets();
                $.each(tableData, function (index, item) {
                    ElementManage.addElementItem(item, true);
                });

                gridster.disable();
            }
        });

    }).on('click', '.todo-item-link', function () {
        var $this = $(this),
            $widget = $this.closest('.widget'),
            linkOpenType = $widget.data('linkOpenType');

        dealLinkOpen({
            openType: linkOpenType,
            name: this.title,
            id: $this.data('id'),
            url: $this.data('url')
        });

    });

    // 处理链接打开
    win.dealLinkOpen = function (linkData) {
        switch (linkData.openType) {
            case 'tabsnav':
                TabsNav.addTab(linkData);
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                win.open(Util.getRightUrl(linkData.url), linkData.id);
                break;
            default:
                break;
        }
    };

})(window, jQuery);


// 右侧内容
(function (win, $) {

    var timer = null;

    win.onresize = function () {
        timer && clearTimeout(timer);
        timer = setTimeout(resetBaseDimensions, 200);
    };

    win.resetBaseDimensions = function () {
        containerSize = {
            w: $container.width(),
            h: $container.height()
        };

        BASE_SIZE = (function () { // 元件本身占的宽度和高度
            var c_w = containerSize.w,
                // base_x = (c_w - GAPS[0] * (2 * COLS - 1)) / COLS;
                base_x = (c_w - GAPS[0] * (2 * COLS)) / COLS;
            return [base_x, ROW_H];
        })();

        gridster.resize_widget_dimensions({
            widget_base_dimensions: BASE_SIZE
        });
        // drawBg();

        $('.element-item').each(function (index, item) {
            adjustScrollWrap($(item));
        });
    };

    /* ----------- 绘制行列 end ----------- */

})(window, jQuery);

// 右侧表格中的元件
(function (win, $) {
    var ELEMENT_TPL = $.trim($("#element-tpl").html()), // 右侧移动的元件
        ELEMENT_CONTENT_TPL = $.trim($('#element-content-tpl').html());

    var $gridList = $('ul', $container);
    var isDragging = false; // 是否开始移动

    win.gridster = $gridList.gridster({
        autogenerate_stylesheet: true,
        widget_margins: GAPS,
        widget_base_dimensions: BASE_SIZE,
        min_cols: MIN_COLSPAN,
        max_cols: COLS,
        max_size_x: MAX_COLSPAN,
        // 调整大小
        resize: {
            // 启动拖动
            enabled: true,
            handle_class: ["spots"],
            // 最大行列限制
            max_size: [MAX_COLSPAN, 6],
            start: function (e, ui, $widget) {
                $widget.addClass('elem-in-drag');
            },
            stop: function (e, ui, $widget) {

                $widget.removeClass('elem-in-drag');
                adjustScrollWrap($widget);

            }
        },
        // 拖拽
        draggable: {
            start: function (event, ui) {
                // 开始拖动则需要立即停止闪动
                ui.$player.addClass('elem-in-drag');

                isDragging = true;
                ElementManage.removeBound();
            },
            stop: function (event, ui) {
                ui.$player.removeClass('elem-in-drag');
            }
        },
        // 自定义数据序列化
        serialize_params: function ($w, wgd) {

            var dataInfo = $w[0].dataset,
                result = $.extend({}, {}, {
                    id: dataInfo['id'],
                    title: dataInfo['name'],
                    col: wgd.col,
                    row: wgd.row,
                    sizex: wgd.size_x,
                    sizey: wgd.size_y
                })
            return result;
        }
    }).data('gridster');


    // 绑定事件
    function bindEvent() {
        $('body').on('click', '.scroll-left', function () {
            var $this = $(this),
                $columnBox = $this.parent().find('.column-box'),
                moveX = Number($columnBox.css('margin-left').replace(/px/, '')),
                siteX = moveX + MOVE_WIDTH > 0 ? 0 : moveX + MOVE_WIDTH;

            $columnBox.stop().animate({
                'margin-left': siteX
            });

        }).on('click', '.scroll-right', function () {
            var $this = $(this),
                wrapWidth = $this.parent().find('.scroll-wrap').width(),
                $columnBox = $this.parent().find('.column-box'),
                columnWidth = $columnBox.width(),
                moveX = Number($columnBox.css('margin-left').replace(/px/, '')),
                siteX = moveX - MOVE_WIDTH < wrapWidth - columnWidth ? wrapWidth - columnWidth : moveX - MOVE_WIDTH;

            $columnBox.stop().animate({
                'margin-left': siteX
            });

        }).on('click', '.element-column-item', function () {
            var $this = $(this),
                $widget = $this.closest('.widget'),
                id = $widget.data('id'),
                url = $this.data('url'),
                isDiy = $this.data('isDiy'),
                countUrl = $widget.data('countUrl');

            $this.addClass('active').siblings('.active').removeClass('active');
            renderElementBody({
                id: id,
                isDiy: isDiy,
                url: url,
                $widget: $widget,
                countUrl: countUrl || ''
            })
        }).on('click', '.refresh', function () {
            // TODO:
            var $this = $(this),
                $widget = $this.closest('.widget'),
                id = $widget.data('id'),
                url = $widget.data('url'),
                countUrl = $widget.data('countUrl'),
                hasIframe = $widget.find('.element-iframe').length ? true : false;


            if ($widget.find('.element-column-item.active').length) {
                url = $widget.find('.element-column-item.active').data('url');
            }

            renderElementBody({
                id: id,
                isDiy: hasIframe,
                url: url,
                $widget: $widget,
                refresh: true,
                countUrl: countUrl || ''
            })


        }).on('click', '.add', function () {
            var $this = $(this),
                $widget = $this.closest('.widget'),
                linkOpenType = $widget.data('linkOpenType'),
                title = $widget.data('title'),
                id = $widget.data('id');

            dealLinkOpen({
                openType: linkOpenType,
                name: title,
                id: id,
                url: $this.data('url')
            });
        }).on('click', '.open', function () {
            var $this = $(this),
                $widget = $this.closest('.widget'),
                linkOpenType = $widget.data('linkOpenType'),
                title = $widget.data('title'),
                id = $widget.data('id');

            dealLinkOpen({
                openType: linkOpenType,
                name: title,
                id: id,
                url: $this.data('url')
            });
        });
    }

    bindEvent();


    var renderElem = function (data) {
        if (data.icon == 0) {
            data.icon = '';
        } else {
            if (isNaN(+data.icon)) {
                data.titleIcon = Util.getRightUrl(data.icon);
            } else {
                data.titleIcon = '../../../ui/elements/icons/f9mod-' + data.icon + '.svg';
            }
        }
        return $(Mustache.render(ELEMENT_TPL, data));
    };

    // 渲染模板内容
    var renderElementBody = function (opt) {
        (function (opt) {
            var id = opt.id,
                isDiy = opt.isDiy,
                url = opt.url,
                refresh = opt.refresh || false,
                countUrl = opt.countUrl,
                $widget = opt.$widget;

            if (countUrl) {
                if (!cacheColumnCountResult[countUrl] || refresh) {
                    Util.ajax({
                        url: Util.getRightUrl(epoint.dealRestfulUrl(countUrl)),
                        data: {
                            elementGuid: id
                        }
                    }).done(function (res) {
                        cacheColumnCountResult[countUrl] = res || [];
                        $(res).each(function (index, item) {
                            var $columnItem = $('.column-item-' + item.id, $('#element-' + id)),
                                showNum = $columnItem.data('showNum'),
                                name = $columnItem.data('name');
                            if (showNum) {
                                $columnItem.html(name + '(' + item.count + ')');
                            }
                        });
                    })
                } else {
                    var countList = cacheColumnCountResult[countUrl] || [];
                    $(countList).each(function (index, item) {
                        var $columnItem = $('.column-item-' + item.id, $('#element-' + id)),
                            showNum = $columnItem.data('showNum'),
                            name = $columnItem.data('name');
                        if (showNum) {
                            $columnItem.html(name + '(' + item.count + ')');
                        }
                    });
                    countList = null;
                }

            }

            // 如果为空，则直接显示空白
            if (!url) {
                $('#element-body-' + id, $widget).empty();
                return;
            }


            if (!isDiy) {
                // 有缓存就从缓存中取
                if (!cacheColumnResult[url] || refresh) {
                    Util.ajax({
                        url: Util.getRightUrl(epoint.dealRestfulUrl(url))
                    }).done(function (res) {
                        cacheColumnResult[url] = res;
                        if (res && res.itemList) {
                            $('#element-body-' + id, $widget).html(Mustache.render(ELEMENT_CONTENT_TPL, res));
                        } else {
                            $('#element-body-' + id, $widget).html(Mustache.render(ELEMENT_CONTENT_TPL, []));
                        }
                    })
                } else {
                    var res = cacheColumnResult[url];
                    if (res && res.itemList) {
                        $('#element-body-' + id, $widget).html(Mustache.render(ELEMENT_CONTENT_TPL, res));
                    } else {
                        $('#element-body-' + id, $widget).html(Mustache.render(ELEMENT_CONTENT_TPL, []));
                    }
                    res = null;
                }

            } else {
                // 自定义链接
                var url = Util.getRightUrl(url);

                $('#element-body-' + id, $widget).empty().html('<iframe class="element-body-content element-iframe" src="' + url + '" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>');

            }
        })(opt);
    }

    /**
     * 新增元件
     * @param {Object} data 元件数据
     * data 格式
     * {
     *      code: '元件id',
     *      name: '元件名称',
     *      url: '元件内嵌iframe的url',
     *      // 新增的元件只用有以上信息即可
     *      rowspan: 1,
     *      colspan: 1,
     *      row: 1,
     *      col: 1
     * }
     * @param {Boolean} isInit 是否是初始化
     */
    var addElementItem = function (data, isInit, noAddLib) {
        if (data.row == 0) {
            data.row = "";
        }
        if (data.col == 0) {
            data.col = '';
        }

        // 是否有子栏目
        data['hasChildColumn'] = false;
        // 是否自定义链接
        data['isDiy'] = false;
        // 加载的地址判断并赋值
        var url = '';
        if (data.column) {
            if (data.column.columnItems && data.column.columnItems.length) {
                data['hasChildColumn'] = true;
                $(data.column.columnItems).each(function (index, item) {
                    if (item.default) {
                        data['isDiy'] = item.isDiy;
                        url = item.url;
                    }
                });
                if (!url) {
                    url = data.column.columnItems[0].url;
                    data.column.columnItems[0].default = true;
                    data['isDiy'] = data.column.columnItems[0].isDiy
                }
            } else {
                data['isDiy'] = data.column.isDiy;
                url = data.column.columnUrl;
            }
        }

        data.url = url;

        if (typeof data.visible == 'string') {
            data.visible = data.visible === 'true' ? true : false;
        }
        var countUrl = "";
        if (data.countUrl) {
            countUrl = data.countUrl;
        } else if (data.column) {
            if (data.column.countUrl) {
                countUrl = data.column.countUrl;
            }
        }

        data.countUrl = countUrl;
        // 加载的地址判断并赋值 end
        if (data.visible) {
            var html = renderElem(data);
            // 初始化元件
            if (isInit) {
                var arr = ['sizex', 'sizey'];

                $(arr).each(function (index, item) {
                    if (typeof data[item] == 'string') {
                        data[item] = Number(data[item])
                    }
                })

                if (data.row && data.col) {
                    gridster.add_widget(html, data.sizex || 4, data.sizey || 4, data.col, data.row, [MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
                } else {
                    gridster.add_widget(html, data.sizex || 4, data.sizey || 4, "", "", [MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
                }
            }
        }

        var $widget = $(html);


        if (data.visible) {
            var countUrl = "";
            if (data.countUrl) {
                countUrl = data.countUrl;
            } else if (data.column) {
                if (data.column.countUrl) {
                    countUrl = data.column.countUrl;
                }
            }
            renderElementBody({
                id: data.id,
                isDiy: data.isDiy,
                url: data.url,
                $widget: $widget,
                countUrl: countUrl
            });
        }

        adjustScrollWrap($widget);
    };

    win.adjustScrollWrap = function ($widget) {
        var $columnBox = $('.column-box', $widget); // 栏目
        if ($columnBox.length) {
            //因为添加元件明明是个同步的操作，却获取不到内容的宽度，所以此处加上定时器
            setTimeout(function () {
                var $scrollWrap = $('.scroll-wrap', $widget),
                    widgetWidth = $widget.width() - 10 * 2, // 元件宽度

                    $scrollBtn = $('.scroll-btn', $widget); // 切换按钮

                var item_width = 0;
                $('.element-column-item', $columnBox).each(function (index, item) {
                    item_width += $(item).outerWidth(true) + 1; // + 1 是因为获取元素宽度时，有小数会自动向下取整，导致最终宽度不准确，故加1兼容
                });

                $columnBox.css({
                    "width": item_width + 'px'
                });

                if (item_width > widgetWidth) {
                    // 显示两侧切换按钮
                    $scrollBtn.show();
                    $scrollWrap.addClass('show');
                } else {
                    // 不显示两侧切换按钮
                    $scrollBtn.hide();
                    $scrollWrap.removeClass('show');
                }
            }, 200);
        }


    }


    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        addElementItem: addElementItem
    };

})(window, jQuery);
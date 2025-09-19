/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2020-04-17 17:28:14
 * @Description: '' 
 */

var cacheColumnResult = {}; // 缓存请求
cacheColumnCountResult = {}; // 缓存数字请求


var MOVE_WIDTH = 50;


// 点击事件
(function (win, $) {

    $('body').on('click', '.clock', function () {
        top.epoint.openLightDialog(Util.getRightUrl('./deskedit?portalGuid=' + portalGuid), function (param) {
            if (param.type == 'ok') {
                var tableData = JSON.parse(param.options);
                // 行列排序
                tableData.sort(
                    function(a, b) {
                    if(typeof a.col == "string") {
                        a.col = +a.col
                    }
                    if(typeof b.col == "string") {
                        b.col = +b.col
                    }
                    if(typeof a.row == "string") {
                        a.row = +a.row
                    }
                    if(typeof b.row == "string") {
                        b.row = +b.row
                    }
                    if (a.col === b.col) {
                        return a.row - b.row;
                    }
                    return a.col > b.col ? 1 : -1;
                });
                var i = 1;
                if(sum_app) {
                    gridster.remove_all_widgets(function() {
                    
                        if(i == sum_app) {
                            var _sum = 0;
                            $.each(tableData, function (index, item) {
                                ElementManage.addElementItem(item, true);
                                 if(item.visible) {
                                    _sum++;
                                }
                            });
                            sum_app = _sum || 0;
                            gridster.disable();
                        } else {
                            i++;
                        }
                    });
                } else {
                    $.each(tableData, function (index, item) {
                        ElementManage.addElementItem(item, true);
                    });
                }
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
            case 'tabsNav':
                if(top.TabsNav) {
                    top.TabsNav.addTab(linkData);
                } else {
                    win.open(Util.getRightUrl(linkData.url), linkData.id.replace(/-/g, '_'));
                } 
                break;
            case 'tabsnav':
                if(top.TabsNav) {
                    top.TabsNav.addTab(linkData);
                } else {
                    win.open(Util.getRightUrl(linkData.url), linkData.id.replace(/-/g, '_'));
                }
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                win.open(Util.getRightUrl(linkData.url), linkData.id.replace(/-/g, '_'));
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

    win.resetBaseDimensions = commonUtil.resetBaseDimensions({
        adjustScroll: true
    });

    /* ----------- 绘制行列 end ----------- */

})(window, jQuery);

// 右侧表格中的元件
(function (win, $) {
    var ELEMENT_TPL = '', // 右侧移动的元件
        ELEMENT_CONTENT_TPL = $.trim($('#element-content-tpl').html());

    var $gridList = $('ul', $container);

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

            var dataInfo = $($w[0]).data(),
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
                countUrl = $widget.data('countUrl'),
                showHeader = $widget.data('showHeader'),
                hasChildColumn = $widget.data('hasChildColumn');


            $this.addClass('active').siblings('.active').removeClass('active');
            renderElementBody({
                id: id,
                isDiy: isDiy,
                url: url,
                $widget: $widget,
                countUrl: countUrl || '',
                showHeader: showHeader,
                hasChildColumn: hasChildColumn
            });

            // TODO:
            if(hasChildColumn) {
                // 默认是第一个标签
                var currentColumn = $this.data();
                commonUtil.adjustColumnOperation(currentColumn, $widget);
            }
            
        }).on('click', '.refresh', function () {
            
            var $this = $(this),
                $widget = $this.closest('.widget'),
                id = $widget.data('id'),
                url = $widget.data('url'),
                countUrl = $widget.data('countUrl'),
                hasIframe = $widget.find('.element-iframe').length ? true : false,
                showHeader = $widget.data('showHeader'),
                hasChildColumn = $widget.data('hasChildColumn');


            if ($widget.find('.element-column-item.active').length) {
                url = $widget.find('.element-column-item.active').data('url');
            }

            renderElementBody({
                id: id,
                isDiy: hasIframe,
                url: url,
                $widget: $widget,
                refresh: true,
                countUrl: countUrl || '',
                showHeader: showHeader,
                hasChildColumn: hasChildColumn
            })


        }).on('click', '.add', function () {
            /**
             * 新增地址
             * 如果子标签有此功能，则优先使用子标签的功能
             */
            var $this = $(this),
                $widget = $this.closest('.widget'),
                linkOpenType = $widget.data('linkOpenType'),
                // 主栏目信息
                title = $widget.data('title'),
                id = $widget.data('id'),
                url = $this.data('url');
            
            // 有子标签
            if($widget.find('.element-columns').length) {
                var $currentChildColumn = $('.element-column-item.active', $widget);
                title = title + $currentChildColumn.data('name');
                id = id + $currentChildColumn.data('id');
                if($currentChildColumn.data('showAddBtn')) {
                	title = "新增" + $widget.data('title');
                    url = $currentChildColumn.data('addUrl');
                }
            }


            dealLinkOpen({
                openType: linkOpenType,
                name: title,
                id: id,
                url: url
            });
        }).on('click', '.open', function () {
            /**
             * 更多地址
             * 如果子标签有此功能，则优先使用子标签的功能
             */
            var $this = $(this),
                $widget = $this.closest('.widget'),
                linkOpenType = $widget.data('linkOpenType'),
                // 主栏目信息
                title = $widget.data('title'),
                id = $widget.data('id'),
                url = $this.data('url');

            // 有子标签
            if($widget.find('.element-columns').length) {
                var $currentChildColumn = $('.element-column-item.active', $widget);
                title = title + $currentChildColumn.data('name');
                id = id + $currentChildColumn.data('id');
                if($currentChildColumn.data('showMoreBtn')) {
                    url = $currentChildColumn.data('moreUrl');
                }
            }

            dealLinkOpen({
                openType: linkOpenType,
                name: title,
                id: id,
                url: url
            });
        });
    }

    bindEvent();


    // 渲染模板内容
    var renderElementBody = function (opt) {
        (function (opt) {
            var id = opt.id,
                isDiy = opt.isDiy,
                url = opt.url,
                refresh = opt.refresh || false,
                countUrl = opt.countUrl,
                $widget = opt.$widget,
                showHeader = opt.showHeader,
                hasChildColumn = opt.hasChildColumn,
                columnGuid = opt.columnGuid || '';

            // 如果为空，则直接显示空白
            if (!url) {
                $('#element-body-' + id, $widget).empty();
                return;
            }


            if (!isDiy) {

                // 标准元件

                // 将 url 上的参数传到请求的参数上，故此处获取
                var urlParams = Util._getUrlParams(url) || '',
                    urlParamStr = '';
                if (urlParams) {
                    for (var param in urlParams) {
                        urlParamStr += '&' + param + '=' + urlParams[param];
                    }
                }
                // 将 url 上的参数传到请求的参数上 end

                Util.ajax({
                    url: portalConfig.getElementDataUrl + urlParamStr, //Util.getRightUrl(epoint.dealRestfulUrl(url)),
                    data: {
                        elementGuid: id,
                        url: url,
                        columnguid: columnGuid, // 点击tab 传此值，第一次加载为空字符串
                        counturl: countUrl
                    }
                }).done(function (res) {
                    var titleCount = 0;
                    if (res.data) {
                    	if(typeof res.data == 'string') {
                    		res.data = JSON.parse(res.data)
                    	}
                        var itemListData = res.data.itemList|| [];
                        $('#element-body-' + id).html(Mustache.render(ELEMENT_CONTENT_TPL, {
                            itemList: itemListData
                        }));
                    }
                    if (res.countdata) {
                        var countData = res.countdata || [];
                        $(countData).each(function (index, item) {
                            var $columnItem = $('.column-item-' + item.id, $('#element-' + id)),
                                showNum = $columnItem.data('showNum'),
                                name = $columnItem.data('name');
                            if (showNum) {
                                $columnItem.html(name + '(' + item.count + ')');
                            }
                            titleCount =  titleCount + parseInt(item.count);
                        });
                    }
                    var $column = $('#element-' + id),
                        titleName = $column.data('title'),
                        showTitleCount = $column.data('showTitleCount');
                    if(showTitleCount){
                        $('.name', $('#element-' + id)).html(titleName + '(' + titleCount + ')');
                    }
                });


            } else {
                // 自定义数据来源
                var url = Util.getRightUrl(url);
                var head_h = showHeader ? 40 : 0,
                    childColumn_h = hasChildColumn ? 30 : 0,
                    top_h = head_h + childColumn_h;
                $('#element-body-' + id, $widget).css({
                    'margin': 0,
                    'height': 'calc(100% -  ' + top_h + 'px)'
                }).empty().html('<iframe class="element-body-content element-iframe" src="' + url + '" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>');

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

        // 是否有子标签
        data['hasChildColumn'] = false;
        // 是否自定义数据来源
        data['isDiy'] = false;
        // 加载的地址判断并赋值
        var url = '',
            columnGuid = '';
        if (data.column) {
            if (data.column.columnItems && data.column.columnItems.length) {
                data['hasChildColumn'] = true;
                $(data.column.columnItems).each(function (index, item) {
                    if (item.default) {
                        data['isDiy'] = item.isDiy;
                        url = item.url;
                        columnGuid = item.id;
                    }
                });
                if (!url) {
                    var firstColumn = data.column.columnItems[0]
                    url = firstColumn.url;
                    data.column.columnItems[0].default = true;
                    data['isDiy'] = firstColumn.isDiy;
                    columnGuid = firstColumn.id
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
            ELEMENT_TPL = $.trim($("#element-tpl").html());
            data["desk"] = true;

            var html = commonUtil.renderElem(data, ELEMENT_TPL);
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
                    countUrl: countUrl,
                    showHeader: data.showHeader,
                    hasChildColumn: data.hasChildColumn,
                    columnGuid: columnGuid || ''
                });
            }

            // 如果没有主标题
            // if(!data.showHeader) {
                // 如果有子标签
                if(data.hasChildColumn) {
                    // 默认是第一个标签
                    var currentColumn = '';
                    $(data.column.columnItems).each(function(index,item) {
                        if(item.default) {
                            currentColumn = item;
                        }
                    });
                    if(!currentColumn) {
                        currentColumn = data.column.columnItems[0];
                    }
                    commonUtil.adjustColumnOperation(currentColumn, $widget);
                }

            // }
            adjustScrollWrap($widget);
        }
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

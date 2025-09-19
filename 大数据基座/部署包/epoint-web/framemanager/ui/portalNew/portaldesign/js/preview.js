/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2020-03-19 11:22:48
 * @Description: '' 
 */
var $sidebarPanel = $('#sidebar-panel');


// 右侧背景
(function (win, $) {
    // 绘制背景
    win.drawBg = function () {
        commonUtil.drawColBg(COLS);
    }
    drawBg();
    var timer = null;
    win.onresize = function () {
        timer && clearTimeout(timer);
        timer = setTimeout(resetBaseDimensions, 200);
    };
    win.resetBaseDimensions = commonUtil.resetBaseDimensions();
})(window, jQuery);

// 右侧表格中的元件
(function (win, $) {
    var ELEMENT_TPL = $.trim($("#element-tpl").html()), // 右侧移动的元件
        ELEMENT_CONTENT_TPL = $.trim($('#element-content-tpl').html());

    var $gridList = $('ul', $container);
    var isDragging = false; // 是否开始移动

    win.gridster = $gridList.gridster({
        widget_margins: GAPS,
        widget_base_dimensions: BASE_SIZE,
        min_cols: MIN_COLSPAN,
        max_cols: COLS,
        max_size_x: MAX_COLSPAN,
        // 调整大小
        resize: {
            // 启动拖动
            enabled: false,
            // handle_class: ["spots"],
            // 最大行列限制
            max_size: [MAX_COLSPAN, 6],
            start: function (e, ui, $widget) {
                $widget.addClass('elem-in-drag');
            },
            stop: function (e, ui, $widget) {
                $widget.removeClass('elem-in-drag');
            }
        },
        // 拖拽
        draggable: {
            start: function (event, ui) {
                // 开始拖动则需要立即停止闪动
                // stopHighlight();
                ui.$player.addClass('elem-in-drag');

                isDragging = false;
                ElementManage.removeBound();
            },
            stop: function (event, ui) {
                ui.$player.removeClass('elem-in-drag');
            }
        },
        // 自定义数据序列化
        serialize_params: function ($w, wgd) {
            var dataInfo = $($w[0]).data();
            var result = $.extend({}, {}, {
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
        $('body').on('click', '.element-item', function () {
            isDragging = false;
        }).on('click', function (e) {
            if (!$(e.target).closest('.element-item').length) {
                ElementManage.removeBound();
            }
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
        var id = opt.id,
            isDiy = opt.isDiy,
            url = opt.url,
            countUrl = opt.countUrl,
            showHeader = opt.showHeader,
            hasChildColumn = opt.hasChildColumn,
            columnGuid = opt.columnGuid || '';

        // 如果为空，则直接显示空白
        if (!url) {
            $('#element-body-' + id).empty();
            return;
        }
        if (!isDiy) {
            // 标准元件

            // 将 url 上的参数传到请求的参数上，故此处获取
            var urlParams = Util._getUrlParams(url) || '',
                urlParamStr = '';
                if(urlParams) {
                    for(var param in urlParams) {
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
                if(res.data) {
                	if(typeof res.data == 'string') {
                		res.data = JSON.parse(res.data)
                	}
                    var itemListData = res.data.itemList || [];
                    $('#element-body-' + id).html(Mustache.render(ELEMENT_CONTENT_TPL, {itemList: itemListData}));
                }
                if(res.countdata) {                    
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
            var url = Util.getRightUrl(url);
            var head_h = showHeader ? 40 : 0,
                childColumn_h = showHeader ? (hasChildColumn ? 30 : 0) : 40,
                top_h = head_h + childColumn_h;

            $('#element-body-' + id).css({
                'margin': 0,
                'height': 'calc(100% -  ' + top_h + 'px)'
            }).empty().html('<iframe class="element-body-content" src="' + url + '" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>');
        }

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
    var addElementItem = function (data, isInit) {


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
                    columnGuid = firstColumn.id;
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


        // 加载的地址判断并赋值 end
        if (data.visible) {

            ELEMENT_TPL = $.trim($("#element-tpl").html());

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
                showHeader: data.showHeader,
                hasChildColumn: data.hasChildColumn,
                columnGuid: columnGuid,
                countUrl: countUrl
            })

            // 如果没有主标题
            if(!data.showHeader) {
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
                    commonUtil.adjustColumnOperation(currentColumn, $(html));
                }

            }

        }


    };
    
    // 移除元件
    var removeElement = function ($el, cb) {
        if ($el.width()) {
            return gridster.remove_widget($el, false, cb);
        }
    };

    var removeAll = function () {
        return gridster.remove_all_widgets();
    }

    // 移除元件调整大小的框
    var removeBound = function () {
        $('.element-item').removeClass('change');
    }

    var createEle = function (opt) {

    }

    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        // init: init,
        // addElement: addElements,
        addElementItem: addElementItem,
        removeElement: removeElement,
        removeALl: removeAll,
        removeBound: removeBound,
        getData: function () {

            return gridster.serialize();
        }
    };

})(window, jQuery);
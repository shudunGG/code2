var $container = $('#grid-container');
var cacheTempList = {}; // TPL 模板对象

var cacheElementData = {};

// 栅格及元件参数
var containerSize = {
        w: $container.width(),
        h: $container.height()
    },
    GAPS = [8, 8], // 元件边距
    COLS = 24, // 列数
    ROW_H = 56, // 行间距，计算时需要加上 元件边距 的高度 * 2
    MAX_COLSPAN = 24, // 元件最大跨列数
    MAX_ROWSPAN = 24, // 元件最大列数
    MIN_COLSPAN = 1, // 元件最小跨列数
    MIN_ROWSPAN = 1, // 元件最小跨行数
    BASE_SIZE = (function () { // 元件本身占的宽度和高度
        var c_w = containerSize.w,
            // base_x = (c_w - GAPS[0] * (2 * COLS - 1)) / COLS;
            base_x = (c_w - GAPS[0] * (2 * COLS)) / COLS;
        return [base_x, ROW_H];
    })();

var expand = true, // 是否展开左侧
    LEFT_EXPAND_WIDTH = 260, // 左侧菜单的宽度
    LEFT_SIDEBAR_WIDTH = 70, // 左侧按钮 + 标尺 宽度 
    TOP_DISTANCE = 69, // 顶部距离画布的距离
    MOVE_WIDTH = 50;

var useMove = true;

// 元件（模板）的拖拽配置
var tplDragCfg = {
    distance: 20, // 触发距离
    placeholder: "ui-state-highlight",

    helper: function (e, ui) {
        var data = $(e.currentTarget).data();
        var size = {
            x: data.sizex, // 宽
            y: data.sizey // 高
        }

        return $('<div style="width:' + (BASE_SIZE[0] + 16) * size.x + 'px;height:' + (BASE_SIZE[1] + 16) * size.y + 'px;background:rgba(0,0,0,.4);"></div>');

    },
    start: function (e, ui) {
        if (e.currentTarget.className.indexOf('active') > -1) {
            return false;
        }
        if (useMove) {
            var expandWidth = expand ? LEFT_EXPAND_WIDTH : 0;
            var dataInfo = $(e.target).data(),
                sizex = dataInfo.sizex,
                sizey = dataInfo.sizey,
                left = ui.position.left, 
                top = ui.position.top, 
                col = Math.ceil(left / (BASE_SIZE[0] + 16)),
                row = Math.ceil(top / (BASE_SIZE[1] + 16));

            ElementManage.addCacheElement({
                id: dataInfo.id,
                title: "",
                row: Number(row),
                col: Number(col),
                sizex: Number(sizex),
                sizey: Number(sizey)
            });
        }

    },
    drag: function (e, ui) {
        var expandWidth = expand ? LEFT_EXPAND_WIDTH : 0;
        var dataInfo = $(e.target).data(),
            left = ui.position.left,
            top = ui.position.top,
            col = Math.ceil(left / (BASE_SIZE[0] + 16)),
            row = Math.ceil(top / (BASE_SIZE[1] + 16));

        if (useMove) {
            gridster.move_widget($('#cache-element-' + dataInfo.id), Number(col), Number(row));
        }

    },
    stop: function (e, ui) {
        var expandWidth = expand ? LEFT_EXPAND_WIDTH : 0;

        var dataInfo = $(e.target).data(),
            left = ui.position.left,
            top = ui.position.top,
            col = Math.ceil(left / (BASE_SIZE[0] + 16)),
            row = Math.ceil(top / (BASE_SIZE[1] + 16));

        if (useMove) {
            ElementManage.removeElement($('#cache-element-' + dataInfo.id));
        }
        if(left < 0 || top < 0) {
            return;
        }

        dataInfo['col'] = Number(col);
        dataInfo['row'] = Number(row);

        if (e.target.className.indexOf('lib-item') > -1) {
            // 添加元件
            var otherInfo = JSON.parse(dataInfo.other);
            otherInfo.visible = true;
            otherInfo.col = Number(col);
            otherInfo.row = Number(row);

            ElementManage.addElementItem(otherInfo, true, true);

        } else {
            ElementManage.getAndAddElement(dataInfo);
        }

    },
    zIndex: 10000,
    appendTo: '#grid-container'
};

var commonUtil = {
    // 加载TPL模板
    loadTemp: function (path) {
        // (function(path) {
        if (cacheTempList[path.templ]) {
            if (path.callback) {
                path.callback();
            }
        } else {
            $.ajax({
                type: 'POST',
                dataType: 'html',
                url: window.SrcBoot ? SrcBoot.handleResPath(path.templ) : Util.getRightUrl(path.templ),
                data: {},
                success: function (html) {
                    $('body').append(html);
                    cacheTempList[path.templ] = 1;
                    if (path.callback) {
                        path.callback();
                    }
                }
            });
        }
        // })(path);

    },
    // 渲染元件
    renderElem: function (data, ELEMENT_TPL) {
        if (data.icon == 0) {
            data.icon = '';
        } else {
            if (isNaN(+data.icon)) {
                data.titleIcon = Util.getRightUrl(data.icon);
            } else {
                data.titleIcon = '../../../ui/elements/icons/f9mod-' + data.icon + '.svg';
            }
            data['isfonticon'] = !isNaN(+data.icon) ? true : false;
        }
        return $(Mustache.render(ELEMENT_TPL, data));
    },
    // 更多菜单位置
    menuPosition: function ($btn, $menu) {
        var pos = $btn.offset(),
            toCalcPos = { // 用于计算的位置
                left: pos.left - 80,
                top: pos.top + 28
            },
            docHeight = $(window).height(),
            libHeight = $menu.outerHeight(),
            toUsePos = { // 最后使用的位置
                left: toCalcPos.left,
                top: toCalcPos.top
            };

        // 常量 5 表示与底部的间距
        if (toUsePos.top + libHeight + 5 > docHeight) {
            toUsePos.top = docHeight - libHeight - 5;
        }

        $menu.css({
            left: toUsePos.left,
            top: toUsePos.top
        }).fadeIn(200);
    },
    drawColBg: function (cols) {
        if ($('#grid-bg')) {
            $('#grid-bg').remove();
        }
        var w = containerSize.w,
            w1 = ((w * 1000000 / cols) >> 0) / 1000000, // 6 位 向下取整 尽可能保证网格精确 
            $bg = $('<div id="grid-bg" class="grid-bg"></div>');
        $bg.empty();
        for (var i = 0; i < cols; i++) {
            $('<div class="bg-col" style="width:' + w1 + 'px"></div>').appendTo($bg);
        }

        $bg.css('width', w).appendTo($container);
    },


    // 初始化 Gridster
    initGridster: function () {
        var $gridList = $('ul', $container);

        return $gridList.gridster({
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
                max_size: [MAX_COLSPAN, MAX_ROWSPAN],
                min_size: [MIN_COLSPAN, MIN_ROWSPAN],
                start: function (e, ui, $widget) {
                    $widget.addClass('elem-in-drag');
                    var max_size_x = $widget.data('maxStart'), //最大宽度
                        min_size_x = $widget.data('minStart'), // 最小宽度
                        max_size_y = $widget.data('maxEnd'), // 最大高度
                        min_size_y = $widget.data('minEnd'); // 最小高度
                    this.resize_min_size_x = min_size_x;
                    this.resize_min_size_y = min_size_y;
                    this.resize_max_size_y = max_size_y;
                    this.resize_max_size_x = max_size_x;
                },
                stop: function (e, ui, $widget) {
                    resetCacheLibMenu();

                    $widget.removeClass('elem-in-drag');
                }
            },
            // 拖拽
            draggable: {
                start: function (event, ui) {
                    ui.$player.addClass('elem-in-drag');

                    isDragging = true;
                    ElementManage.removeBound();
                },
                stop: function (event, ui) {

                    resetCacheLibMenu();

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
                    sizey: wgd.size_y,
                    visible: true
                })
                return result;
            }
        }).data('gridster');
    },

    // 渲染模板内容
    renderElementBody: function (opt) {
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

        
    },
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
    addElementItem: function (data, isInit, noAddLib) {
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

        // 加载的地址判断并赋值 end
        if (data.visible) {
            if (!data.manageUrl) {
                data.manageUrl = '';
            }

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
                    gridster.add_widget(html, data.sizex || 4, data.sizey || 4, '', '', [MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
                }
            }

            var _index = getLibIndex(data.id);
            if (noAddLib) {
                var otherData = JSON.parse(cacheLibMenu[_index].other);
                otherData.visible = true;
                cacheLibMenu[_index].visible = true;
                cacheLibMenu[_index].other = JSON.stringify(otherData);
            } else {
                if (_index < 0) {
                    var libItemData = JSON.parse(JSON.stringify(data)); // $('#element-' + data.id).data()

                    cacheLibMenu.push({
                        id: data.id,
                        title: data.title,
                        sizex: data.sizex,
                        sizey: data.sizey,
                        visible: data.visible,
                        other: JSON.stringify(libItemData)
                    })
                    // cacheLibMenu.push(libItemData);
                } else {
                    var libItemData = JSON.parse(JSON.stringify(data)),
                        newData = {
                            id: data.id,
                            title: data.title,
                            sizex: data.sizex,
                            sizey: data.sizey,
                            visible: data.visible,
                            other: JSON.stringify(libItemData)
                        };
                    cacheLibMenu.splice(_index, 1, newData);
                }
            }

            renderLibDom();

            var countUrl = "";
            if (data.countUrl) {
                countUrl = data.countUrl;
            } else if (data.column) {
                if (data.column.countUrl) {
                    countUrl = data.column.countUrl;
                }
            }

            commonUtil.renderElementBody({
                id: data.id, // 元件ID
                isDiy: data.isDiy, // 是否自定义，自定义的则 url 为iframe 地址
                url: data.url, // 加载列表的接口，或者iframe地址
                countUrl: countUrl, // 获取子标签数量的接口
                showHeader: data.showHeader,
                hasChildColumn: data.hasChildColumn,
                columnGuid: columnGuid
            })


            // 如果没有主标题
            // if(!data.showHeader) {
                // 如果有子标签
                if(data.hasChildColumn) {
                    // 默认是第一个标签
                    var $widget = $(html);
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
        } else {
            var _index = getLibIndex(data.id);
            if (noAddLib) {
                var otherData = JSON.parse(cacheLibMenu[_index].other);
                otherData.visible = true;
                cacheLibMenu[_index].visible = true;
                cacheLibMenu[_index].other = JSON.stringify(otherData);
            } else {
                if (_index < 0) {
                    var libItemData = JSON.parse(JSON.stringify(data)); // $('#element-' + data.id).data()

                    cacheLibMenu.push({
                        id: data.id,
                        title: data.title,
                        sizex: data.sizex,
                        sizey: data.sizey,
                        visible: data.visible,
                        other: JSON.stringify(libItemData)
                    })
                    // cacheLibMenu.push(libItemData);
                } else {
                    var libItemData = JSON.parse(JSON.stringify(data)),
                        newData = {
                            id: data.id,
                            title: data.title,
                            sizex: data.sizex,
                            sizey: data.sizey,
                            visible: data.visible,
                            other: JSON.stringify(libItemData)
                        };
                    cacheLibMenu.splice(_index, 1, newData);
                }
            }

            renderLibDom();
        }


    },
    // 调整栏目的功能
    adjustColumnOperation: function(currentColumn, $widget) {
        var ele_data = $widget.data(),
            showHeader = ele_data.showHeader;
        if(currentColumn) {
            var showRefreshBtn = true,
                showAddBtn = true,
                showMoreBtn = true;

            if(currentColumn.showRefreshBtn) {
                showRefreshBtn = true;
            } else {
                if(ele_data.showRefreshBtn) {
                    showRefreshBtn = true;
                } else {
                    showRefreshBtn = false;
                }
                if(!showHeader) {
                    showRefreshBtn = false;
                }
            }

            if(currentColumn.showAddBtn) {
                showAddBtn = true;
            } else {
                if(ele_data.showAddBtn) {
                    showAddBtn = true;
                } else {
                    showAddBtn = false;
                }
                if(!showHeader) {
                    showAddBtn = false;
                }
            }

            if(currentColumn.showMoreBtn) {
                showMoreBtn = true;
            } else {
                if(ele_data.showMoreBtn) {
                    showMoreBtn = true;
                } else {
                    showMoreBtn = false;
                }
                if(!showHeader) {
                    showMoreBtn = false;
                }
            }

            $('.refresh', $widget)[showRefreshBtn ? 'removeClass' : 'addClass']('hidden');
            $('.open', $widget)[showMoreBtn ? 'removeClass' : 'addClass']('hidden');
            $('.add', $widget)[showAddBtn ? 'removeClass' : 'addClass']('hidden');

        }
        var o_w = $('.column-operations', $widget).outerWidth(); // 右侧按钮的宽度
        if(o_w) {
            $('.element-columns', $widget).css('margin-right', o_w + 10 + 'px');
        }
    },
    // 重置栅格
    resetBaseDimensions: function (opt) {
        opt = opt ? opt : {};

        var adjustScroll = opt.adjustScroll || false;
        return function () {
            containerSize = {
                w: $container.width(),
                h: $container.height()
            };

            // 当容器尺寸为0时，说明当前页是隐藏的，不能重置
            if(containerSize.w <= 0 || containerSize.h <= 0) {
                return;
            }

            BASE_SIZE = (function () { // 元件本身占的宽度和高度
                var c_w = containerSize.w,
                    base_x = (c_w - GAPS[0] * (2 * COLS)) / COLS;
                return [base_x, ROW_H];
            })();

            gridster.resize_widget_dimensions({
                widget_base_dimensions: BASE_SIZE
            });
            if (!adjustScroll) {
                drawBg();
            } else {
                $('.element-item').each(function (index, item) {
                    adjustScrollWrap($(item));
                });
            }
        }
    }
};

// 编辑页面公共方法
var editCommonUtil = {
    // 隐藏/显示 左侧面板
    togglePanel: function (flag) {
        if (flag) {
            $typesDetail.fadeIn(200);
            expand = true;
            $main.addClass('expand');
        } else {
            expand = false;
            $typesDetail.fadeOut(200);
            $main.removeClass('expand');
            $('.type.active').removeClass('active');
        }

        resetBaseDimensions();
    },
    // fixed方式 固定 左侧面板
    fixedPanel: function () {
        $typesDetail.fadeIn(200);
        $main.addClass('fix-flag');
    },
    // 设置元件仓库中模板的可见性
    setEleVisible: function (opt) {
        var libId = opt.libId,
            visible = opt.visible,
            callback = opt.callback;

        Util.ajax({
            url: portalConfig.setEleVisible,
            data: {
                id: libId,
                visible: visible
            }
        }).done(function (data) {
            if (typeof callback == 'function') {
                callback();
            }
        });
    },
    // 左侧拖拽后添加元件
    getAndAddElement: function (opt) {
        if (sessionStorage.showTip) {
            // 本次设计不再提示
            createEle(opt);
        } else {
            // componentType -> 0：元件模板 1：元件实例
            if(opt.componentType == 0) {
                epoint.openDialog('初始化', './child/initele?title=' + opt.name, function (param) {
                    if (param.type == 'ok') {
                        opt = $.extend({}, opt, param.options);
                        createEle(opt);

                    } else if (param.type == 'close') {
                        createEle(opt);
                    }

                    if (param.options.tip) {
                        sessionStorage.showTip = 1;
                    }

                }, {
                    width: "415",
                    height: "394",
                    param: {
                        // title: opt.name
                    }
                });
            } else if(opt.componentType == 1) {
                // 实例 请求接口获取元件数据
                createEle(opt);
            }
            
        }
    },
    // 添加临时元件，用于占位移动
    addCacheElement: function (data) {
        var html = $(Mustache.render(CACHE_ELEMENT_TPL, data));
        gridster.add_widget(html, data.sizex || 4, data.sizey || 4, data.col, data.row, [MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
    },
    // 重置仓库列表
    resetCacheLibMenu: function () {
        var _widgetList = ElementManage.getData();

        var widgetIds = []; // 右侧元件中的数据
        $(_widgetList).each(function (index, item) {
            widgetIds.push(item.id);
            $(cacheLibMenu).each(function (i, el) {
                if (el.id === item.id) {
                    el.sizex = item.sizex;
                    el.sizey = item.sizey;
                    var _elOther = JSON.parse(el.other);
                    _elOther['col'] = item.col;
                    _elOther['row'] = item.row;
                    _elOther['sizex'] = item.sizex;
                    _elOther['sizey'] = item.sizey;

                    el.other = JSON.stringify(_elOther);
                    el.sizex = item.sizex;
                    el.sizey = item.sizey;
                }
            })
        })

        renderLibDom();
    }
}

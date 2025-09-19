/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-08-29 14:57:16
 * @Description: '' 
 */
var $sidebarPanel = $('#sidebar-panel'),
    $container = $('#grid-container');
    
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

// 右侧内容
(function (win, $) {

    /* ----------- 绘制行列 ----------- */

    // 绘制列
    var drawColBg = function (cols) {
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
    }
   

    // 绘制背景
    win.drawBg = function () {
        drawColBg(COLS);
    }

    drawBg();
    var timer = null;
    
    win.onresize = function () {
        timer && clearTimeout(timer);
        timer = setTimeout(resetBaseDimensions, 200);
    };

    win.resetBaseDimensions = function() {
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
        drawBg();
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
            
            
            var dataInfo = $w[0].dataset;
            var result = $.extend({}, {} ,{
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
            // var $this = $(this);
            // if (!isDragging) {
            //     $this.addClass('change').siblings('.change').removeClass(('change'));
            // }
            isDragging = false;
        }).on('click', function (e) {
            if (!$(e.target).closest('.element-item').length) {
                ElementManage.removeBound();
            }
        });
    }

    bindEvent();

    
    var renderElem = function (data) {
        if(data.icon == 0) {
            data.icon = '';
        } else {
            if(isNaN(+data.icon)) {
                data.titleIcon = Util.getRightUrl(data.icon);
            } else {
                data.titleIcon = '../../../ui/elements/icons/f9mod-' + data.icon +'.svg';
            }
        }
        return $(Mustache.render(ELEMENT_TPL, data));
    };

    // 渲染模板内容
    var renderElementBody = function(opt) {
        var id = opt.id,
            isDiy = opt.isDiy,
            url = opt.url,
            countUrl = opt.countUrl;
            
        if(countUrl) {
            Util.ajax({
                url: Util.getRightUrl(epoint.dealRestfulUrl(countUrl)),
                data: {
                    elementGuid: id
                }
            }).done(function(res) {
                $(res).each(function(index, item) {
                    var $columnItem = $('.column-item-'+ item.id, $('#element-' + id)),
                        showNum = $columnItem.data('showNum'),
                        name = $columnItem.data('name');
                    if(showNum) {
                        $columnItem.html(name + '('+item.count+')');
                    }
                });
            })
        }
        // 如果为空，则直接显示空白
        if(!url) {
            $('#element-body-'+ id).empty();
            return;
        }
        if(!isDiy) {
            Util.ajax({
                url: Util.getRightUrl(epoint.dealRestfulUrl(url))
            }).done(function(res) {
                
                if(res && res.itemList) {
                    $('#element-body-'+ id).html(Mustache.render(ELEMENT_CONTENT_TPL, res));
                }
            })
        } else {
            var url = Util.getRightUrl(url);
            $('#element-body-'+ id).empty().html('<iframe class="element-body-content" src="'+ url +'" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>');
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
        

        if(data.row == 0) {
            data.row = "";
        }
        if(data.col == 0) {
            data.col = '';
        }

        // 是否有子栏目
        data['hasChildColumn'] = false;
        // 是否自定义链接
        data['isDiy'] = false;
        // 加载的地址判断并赋值

        // 加载的地址判断并赋值
        var url = '';
        if(data.column) {
            if(data.column.columnItems && data.column.columnItems.length) {
                data['hasChildColumn'] = true;
                $(data.column.columnItems).each(function(index, item) {
                    if(item.default) {
                        data['isDiy'] = item.isDiy;
                        url = item.url;
                    }
                });
                if(!url) {
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

        if(typeof data.visible == 'string') {
            data.visible = data.visible === 'true' ? true : false;
        }

        
        // 加载的地址判断并赋值 end
        if(data.visible) {
            var html = renderElem(data);
            // 初始化元件
            if (isInit) {
                var arr = ['sizex', 'sizey'];

                $(arr).each(function(index, item) {
                    if(typeof data[item] == 'string') {
                        data[item] = Number(data[item])
                    }
                })
                
                if(data.row && data.col) {
                    gridster.add_widget(html, data.sizex || 4, data.sizey || 4, data.col, data.row ,[MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
                }  else {
                    gridster.add_widget(html, data.sizex || 4, data.sizey || 4, "", "",[MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);                
                }
            }
        }

        renderElementBody({
            id: data.id,
            isDiy: data.isDiy,
            url: data.url
        })
    };
    // 移除元件
    var removeElement = function ($el, cb) {
        if($el.width()) {
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

    var getAndAddElement = function (opt) {

        if (sessionStorage.showTip) {
            // 本次设计不再提示
            createEle(opt);
        } else {
            epoint.openDialog('初始化', './child/initele', function (param) {
                if (param.type == 'ok') {
                    
                    opt = $.extend({}, opt, param.options);
                    
                    createEle(opt);


                } else if (param.type == 'close') {
                    // TODO
                    

                    createEle(opt);
                }

                if (param.options.tip == 'true') {
                    sessionStorage.showTip = 1;
                }


            }, {
                width: "415",
                height: "394",
                param: {
                    title: opt.name
                }
            });
        }


    }

    var createEle = function (opt) {
        // 请求模板数据
       /*  Util.ajax({
            url: portalConfig.createElementUrl,
            data: $.extend({
                    portalGuid: portalGuid
                },
                opt)
        }).done(function (data) {
            if (!data) {
                return;
            }
            if (opt.title) {
                data.title = opt.title;
            }
            addElement(data);
        }); */
    }

    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        // init: init,
        getAndAddElement: getAndAddElement,
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
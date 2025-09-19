/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-08-29 14:56:01
 * @Description: '' 
 */
var $sidebarPanel = $('#sidebar-panel'),
    $main = $('#main'),
    $paintingArea = $('#painting-area'),
    $container = $('#grid-container');

var cacheColumnResult = {};
    
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

var expand = false, // 是否展开左侧
    LEFT_EXPAND_WIDTH = 260, // 左侧菜单的宽度
    LEFT_SIDEBAR_WIDTH = 70, // 左侧按钮 + 标尺 宽度 
    TOP_DISTANCE = 69, // 顶部距离画布的距离
    MOVE_WIDTH = 200;

// 顶部按钮
(function (win, $) {
    var getSaveData = function() {
        var tableData = [];
        $(cacheLibMenu).each(function(index,item) {
            var other = JSON.parse(item.other);
            tableData.push({
                orginalEleGuid: item.orginalEleGuid,
                id: item.id, // 标识
                row: other.row,
                col: other.col,
                sizex: item.sizex,
                sizey: item.sizey,
                visible: item.visible
            })
        })
        
        var resultData = {
            tableData: JSON.stringify(tableData) //JSON.stringify(ElementManage.getData())
        }
        
        return resultData;
    }

    var getAllSaveData = function() {
        var tableData = [];
        $(cacheLibMenu).each(function(index,item) {
            var other = JSON.parse(item.other);
            tableData.push(other)
        })
        
        return tableData;
    }
    
    // 保存
    win.save = function (e) {
        var resultData = getSaveData();
        
        Util.ajax({
            url: portalConfig.deskSave,
            data: $.extend({}, {
                portalGuid: portalGuid
            }, resultData)
        }).done(function(res) {
            // epoint.showTips(res.msg || '保存成功');
            epoint.closeDialog({
                type: 'ok',
                options: getAllSaveData()
            });
        });
    }

    win.cancel = function() {
        epoint.closeDialog({
            type: 'close'
        });
    }

    var htmlContent = document.getElementById("htmlContent"),
        $titleName = $('#portal-name');

    win.otherSave = function (e) {
        
        htmlContent.style.display = "";
        mini.showMessageBox({
            width: 350,
            height: 150,
            title: "存为模板",
            buttons: ["取消", "保存"],
            customCls: "portal-tip",
            // message: "自定义Html",
            html: htmlContent,
            showModal: true,
            callback: function (action) {
                if (action == '保存') {
                    var name = $titleName.val().trim();
                    if(!name) {
                        epoint.showTips('名称不能为空', {state: "danger"});
                        return;
                    }

                    if(name.length > 50) {
                        epoint.showTips('名称请控制在50字以内，谢谢', {state: "danger"});
                        return;
                    }

                    var resultData = getSaveData();

                    saveToTemp($.extend({},{
                        portalGuid: portalGuid,
                        name: $titleName.val().trim(),
                    }, resultData));
                }

            }
        });
    };

    function saveToTemp(data) {
        Util.ajax({
            url: portalConfig.saveToTemplate,
            data: data
        }).done(function(res) {
            
            getTemplateData();
            epoint.showTips('保存成功');
        })
    }
})(window, jQuery);

var cacheEleMenu = [], // 缓存元件-模板菜单
    cacheLibMenu = [], // 缓存元件-仓库菜单
    cacheTempMenu = []; // 缓存模板菜单

// 左侧面板
(function (win, $) {
    var $libNum = $('.lib-num', $sidebarPanel), // 仓库数字
        $libMoreMenu = $('#lib-more-menu'), // 仓库更多菜单
        $libListContainer = $('#lib-list-container'); // 元件（仓库）
   

    var LIB_ITEM_SEARCH_TPL = $.trim($("#lib-item-search-tpl").html()); // 元件（搜索仓库）

    var LIB_ITEM_TPL = $.trim($("#lib-item-tpl").html()); // 元件（仓库）

    var tempHtmlContent = document.getElementById("tempRename"),
        $tempName = $('#temp-name');

    // 重命名模板
    var renameTemplate = function (opt) {
        var id = opt.id,
            name = opt.name,
            callback = opt.callback || '';

        Util.ajax({
            url: portalConfig.renameTemplate,
            data: {
                name: name,
                id: id
            }
        }).done(function (data) {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    $sidebarPanel
        .on('click', '.search-menu', function (e) {
            var $this = $(this);

            menuPosition($this, $libMoreMenu);
        })
        // 元件-仓库搜索值改变
        .on('input propertychange', '#lib-search', function () {
            var $this = $(this),
                searchVal = $this.val();
            
            renderLibDom(searchVal);
        });

    $libMoreMenu.on('click', '.template-edit', function(e) {
        var $this = $(this),
            id = $this.data('id'),
            tempName = $this.data('name');
        e.stopPropagation();
        $libMoreMenu.hide();

        tempHtmlContent.style.display = "";
        $tempName.val(tempName);

        mini.showMessageBox({
            width: 350,
            height: 150,
            title: "模板重命名",
            buttons: ["取消", "保存"],
            customCls: "portal-tip",
            html: tempHtmlContent,
            showModal: true,
            callback: function (action) {
                
                if(action == '保存') {
                    var name = $tempName.val().trim();
                    if(!name) {
                        epoint.showTips('名称不能为空', {state: "danger"});
                        return;
                    }
                    if(name.length > 50) {
                        epoint.showTips('名称请控制在50字以内，谢谢', {state: "danger"});
                        return;
                    }
                    renameTemplate({
                        id: id,
                        name: name,
                        callback: function () {
                            epoint.showTips('保存成功');
                            // $tempMoreMenu.data('name', name);
                            $this.data('name', name);
                            $this.parent().data('name', name);
                            $this.parent().attr('title', name);
                            $this.prev().text(name);
                        }
                    })
                }
                
            }
        });
        

    }).on('click', '.menu-item', function(e) {
        var $this = $(this),
            ref = $this.data('ref'),
            id = $this.data('id'),
            public = $this.data('public');
            
        if(ref == 'create') {
            otherSave();
        } else {
            if($this.hasClass('edit-disable')) {
                epoint.showTips('请打开元件显隐功能');
                return;
            }
            getTemplateById({
                id: id,
                public: public
            });
        }

        $libMoreMenu.hide();
        e.stopPropagation();
    });

    function getTemplateById(opt) {
        var id = opt.id,
            public = opt.public;
            
        Util.ajax({
            url: portalConfig.getTemplateById,
            data: {
                templateGuid: id,
                public: public
            }
        }).done(function(data) {
            // cacheLibMenu = [];
            $(cacheLibMenu).each(function(index, item) {
                item.visible = false;
                var other = JSON.parse(item.other);
                other.visible = false;
                item.other = JSON.stringify(other);
            });

            var tableData = data.tableData;
            gridster.remove_all_widgets();
            $.each(tableData, function (index, item) {
                ElementManage.addElementItem(item, true);
            });
        })
    }

    // 更多菜单位置
    function menuPosition($btn, $menu) {
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
    }



    /* -------- 加载元件（模板） ---------- */
    var useMove = true;

    // 元件（模板）的拖拽配置
    var tplDragCfg = {
        distance: 20, // 触发距离
        placeholder: "ui-state-highlight",
        
        helper: function (e, ui) {
          
            var size = {
                x: e.currentTarget.dataset.sizex, // 宽
                y: e.currentTarget.dataset.sizey // 高
            }

            return $('<div style="width:'+(BASE_SIZE[0]+16) * size.x+'px;height:'+(BASE_SIZE[1]+16) * size.y+'px;background:rgba(0,0,0,.4);"></div>');

        },
        start: function (e, ui) {
            if(e.currentTarget.className.indexOf('active') > -1) {
                return false;
            }
            if(useMove) {
                var expandWidth = expand ? LEFT_EXPAND_WIDTH : 0;
                var dataInfo = e.target.dataset,
                    sizex = dataInfo.sizex,
                    sizey = dataInfo.sizey,
                    left = ui.position.left - LEFT_SIDEBAR_WIDTH < 0 ? 0 : ui.position.left - LEFT_SIDEBAR_WIDTH - expandWidth,
                    top = ui.position.top - TOP_DISTANCE < 0 ? 0 : ui.position.top - TOP_DISTANCE,
                    col = Math.ceil(left/(BASE_SIZE[0] + 16)),
                    row = Math.ceil(top/(BASE_SIZE[1] +16));

                ElementManage.addCacheElement({
                    id: dataInfo.id,
                    // rowspan: Number(sizey),
                    // colspan: Number(sizex),
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
            var dataInfo = e.target.dataset,
                left = ui.position.left - LEFT_SIDEBAR_WIDTH < 0 ? 0 : ui.position.left - LEFT_SIDEBAR_WIDTH - expandWidth,
                top = ui.position.top - TOP_DISTANCE < 0 ? 0 : ui.position.top - TOP_DISTANCE,
                col = Math.ceil(left/(BASE_SIZE[0] + 16)),
                row = Math.ceil(top/(BASE_SIZE[1] +16));

            if(useMove) {
                gridster.move_widget($('#cache-element-' + dataInfo.id), Number(col), Number(row));
            }

        },
        stop: function (e, ui) {
            var expandWidth = expand ? LEFT_EXPAND_WIDTH : 0;
            
            var dataInfo = e.target.dataset,
                left = ui.position.left - LEFT_SIDEBAR_WIDTH < 0 ? 0 : ui.position.left - LEFT_SIDEBAR_WIDTH - expandWidth,
                top = ui.position.top - TOP_DISTANCE < 0 ? 0 : ui.position.top - TOP_DISTANCE,
                col = Math.ceil(left/(BASE_SIZE[0] + 16)),
                row = Math.ceil(top/(BASE_SIZE[1] +16));

            
            
            dataInfo['col'] = Number(col);
            dataInfo['row'] = Number(row);
            
            if(useMove) {
                ElementManage.removeElement($('#cache-element-' + dataInfo.id)); 
            }
            if(e.target.className.indexOf('lib-item') > -1) {
                // 添加元件
                var otherInfo = JSON.parse(dataInfo.other);
                    otherInfo.visible = true;
                    otherInfo.col = Number(col);
                    otherInfo.row = Number(row);

                ElementManage.addElementItem(otherInfo, true, true);

            } else {
                // ElementManage.getAndAddElement(dataInfo);
            }
            
        },
        zIndex: 10000,
        appendTo: 'body'
    };

    /* -------- 加载元件（仓库） ---------- */

    win.renderLibDom = function(searchVal) {
        var elementItemDom = '';
        if(searchVal) {
            var empty = true;
            var list = JSON.parse(JSON.stringify(cacheLibMenu));
            $(list).each(function(index, item) {
                if (item.title.indexOf(searchVal) > -1) {
                    var reg = new RegExp(searchVal, "g");
                    empty = false;
                    item.result = item.title.replace(reg, '<span class="result-mark">' + searchVal + '</span>');
                }
            });
            elementItemDom = Mustache.render(LIB_ITEM_SEARCH_TPL, {
                list: list || []
            });
            if (empty) {
                elementItemDom = '<li class="no-result">暂无数据</>'
            }
        } else {
            elementItemDom = Mustache.render(LIB_ITEM_TPL, {
                list: cacheLibMenu || []
            });

            if(cacheLibMenu.length != 0) {
                $libNum.text('('+ cacheLibMenu.length +')');
            }

        }
        $libListContainer.html(elementItemDom);
        // 加载后初始化拖拽事件
        $('.drag-item').draggable(tplDragCfg);
    }

    win.getLibIndex = function(orginalEleGuid) {
        var _index = -1;
        $(cacheLibMenu).each(function(index, item) {
            if(item.orginalEleGuid == orginalEleGuid) {
                _index = index;
            }
        });
        return _index;
    }

    // 设置元件仓库模板可见性
    win.setEleVisible = function (opt) {
        // var libId = opt.libId,
        //     visible = opt.visible,
        var callback = opt.callback;

        // Util.ajax({
        //     url: portalConfig.setEleVisible,
        //     data: {
        //         id: libId,
        //         visible: visible
        //     }
        // }).done(function (data) {
        //     if (typeof callback == 'function') {
        //         callback();
        //     }
        // });
        if (typeof callback == 'function') {
            callback();
        }
    };

    /* -------- 加载元件（仓库）end ---------- */

    /* ------------ 左上角模板列表----- */
    var $menuItems = $('#menu-items'),
        TEMP_ITEM_TPL = $.trim($('#temp-item-tpl').html());
        
    win.getTemplateData = function () {
        Util.ajax({
            url: portalConfig.getTemplateList,
            data: {
                portalGuid: portalGuid,
                type: "front"
            }
        }).done(function (data) {
            if (!data || !data.length) {
                return;
            }
            
            var publicStr = '',
                myStr = '';
            
            $(data).each(function(index, item) {
                if(item.public) {
                    publicStr += Mustache.render(TEMP_ITEM_TPL, item);
                } else {
                    myStr += Mustache.render(TEMP_ITEM_TPL, item);
                }
            })

            $menuItems.html(publicStr + myStr);

        });
    };

    getTemplateData();
        

    // 点击其他地方隐藏更多菜单
    $('body').on('click', function (e) {
        if (!$(e.target).closest('.lib-more, .more-menu, .search-menu').length) {
            $libMoreMenu.hide();
        }
    }).on('click', '.clock', function() {

        epoint.openDialog('元件设置', './deskedit?portalGuid=' + portalGuid, function (param) {

        });
        
    });

})(window, jQuery);

// 仓库更多菜单的内容
(function (win, $) {
    win.libMenuEvent = {
        edit: function (opt) {
            epoint.openDialog('元件设置', './child/eleedit?title=' + opt.title + '&id=' + opt.id, function (param) {
                if (param.type == 'ok') {

                    var info = opt.info; // 原来组件的信息

                    var gridOption = {
                        col: info.col,
                        id: info.id,
                        row: info.row,
                        sizex: info.sizex,
                        sizey: info.sizey,
                        manageUrl: info.manageUrl || "",
                    };

                    // 设置元件中的数据
                    var setOption = param.options.attr;

                    var newOption = $.extend({}, gridOption, setOption);
                    
                    

                    ElementManage.removeElement($('#element-' + opt.id), function() {
                        // 添加进去
                        
                        ElementManage.addElementItem(newOption, true)
                    });
                     

                } else if (param == 'close') {
                    // TODO
                }
            }, {
                width: "415",
                height: "578",
                param: {
                    // title: opt.title || '',
                    // id: opt.id || ''
                }
            });
        },
        create: function () {
            epoint.openDialog('创建元件副本', './child/createele', function (param) {
                if (param.type == 'ok') {
                    
                    

                } else if (param == 'close') {
                    // TODO
                }
            }, {
                width: "415",
                height: "394",
                param: {

                }
            });
        }
    }
})(window, jQuery);

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
        // drawRowBg(ROW_H + GAPS[1] * 2);
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
        CACHE_ELEMENT_TPL = $.trim($("#cache-element-tpl").html()),
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

                resetCacheLibMenu();
                
                $widget.removeClass('elem-in-drag');
                adjustScrollWrap($widget);

            }
        },
        // 拖拽
        draggable: {
            start: function (event, ui) {
                // 开始拖动则需要立即停止闪动
                // stopHighlight();
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
            
            
            var dataInfo = $w[0].dataset;
            var result = $.extend({}, {} ,{
                orginalEleGuid: dataInfo['orginalEleGuid'],
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

    win.resetCacheLibMenu = function() {
        var _widgetList = ElementManage.getData();

        var widgetIds = []; // 右侧元件中的数据
        $(_widgetList).each(function(index, item) {
            widgetIds.push(item.id);
            $(cacheLibMenu).each(function(i, el) {
                if(el.orginalEleGuid === item.orginalEleGuid) {
                    var _elOther = JSON.parse(el.other);
                    _elOther['col'] = item.col;
                    _elOther['row'] = item.row;
                    _elOther['sizex'] = item.sizex;
                    _elOther['sizey'] = item.sizey;
                    el.sizex = item.sizex;
                    el.sizey = item.sizey;
                    el.other = JSON.stringify(_elOther);
                    
                }
            })
        })

        renderLibDom();
    }

    // 绑定事件
    function bindEvent() {
        $('body').on('click', '.element-item', function () {
            var $this = $(this);
            if($('body').hasClass('edit')) {
                if (!isDragging) {
                    $this.addClass('change').siblings('.change').removeClass(('change'));
                }
                isDragging = false;
            }
            
        }).on('click', function (e) {
            if (!$(e.target).closest('.element-item').length) {
                ElementManage.removeBound();
            }
        }).on('click', '.scroll-left', function() {
            var $this = $(this),
                $columnBox = $this.parent().find('.column-box'),
                moveX = Number($columnBox.css('margin-left').replace(/px/, '')),
                siteX = moveX + MOVE_WIDTH > 0 ? 0 : moveX + MOVE_WIDTH;

            $columnBox .animate({
                'margin-left': siteX
            });

        }).on('click', '.scroll-right', function() {
            var $this = $(this),
                wrapWidth = $this.parent().find('.scroll-wrap').width(),
                $columnBox = $this.parent().find('.column-box'),
                columnWidth = $columnBox.width(),
                moveX = Number($columnBox.css('margin-left').replace(/px/, '')),
                siteX =  moveX - MOVE_WIDTH < wrapWidth - columnWidth ? wrapWidth - columnWidth : moveX - MOVE_WIDTH;

            $columnBox .animate({
                'margin-left': siteX
            });

        }).on('click', '.element-column-item', function() {
            var $this = $(this),
                $widget = $this.closest('.widget'),
                id = $widget.data('id'),
                url = $(this).data('url');
            
            $this.addClass('active').siblings('.active').removeClass('active');
            // TODO:
            renderElementBody({
                id: id,
                isDiy: false,
                $widget: $widget,
                url: url
            })
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
    	(function(opt) {
    		var id = opt.id,
	            isDiy = opt.isDiy,
	            url = opt.url,
	            $widget = opt.$widget,
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
	            $('#element-body-'+ id, $widget).empty();
	            return;
	        }
	        
	        if(!isDiy) {
	            // 有缓存就从缓存中取
	            if(!cacheColumnResult[url]) {
	                Util.ajax({
	                    url: Util.getRightUrl(epoint.dealRestfulUrl(url))
	                }).done(function(res) {
	                    cacheColumnResult[url] = res;
	                    if(res && res.itemList) {
	                        $('#element-body-'+ id, $widget).html(Mustache.render(ELEMENT_CONTENT_TPL, res));
	                    }
	                })
	            } else {
	                res = cacheColumnResult[url];
	                if(res && res.itemList) {
	                    $('#element-body-'+ id, $widget).html(Mustache.render(ELEMENT_CONTENT_TPL, res));
	                }
	            }
	            
	        } else {
	            var url = Util.getRightUrl(url);
	            $('#element-body-'+ id, $widget).empty().html('<iframe class="element-body-content" src="'+ url +'" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>');
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
        
        var $widget = $(html);

        adjustScrollWrap($widget);

        // 元件-仓库添加数据
        
        
            
        var _index = getLibIndex(data.orginalEleGuid);
        if(noAddLib) {
        	var otherData = JSON.parse(cacheLibMenu[_index].other);
        	otherData.visible = true;
            cacheLibMenu[_index].visible = true;
            cacheLibMenu[_index].other = JSON.stringify(otherData);
        } else {
            if(_index < 0) {
                var libItemData = JSON.parse(JSON.stringify(data)); // $('#element-' + data.id).data()
               
                cacheLibMenu.push({
                    id: data.id,
                    orginalEleGuid: data.orginalEleGuid,
                    title: data.title,
                    visible: data.visible,
                    sizex: data.sizex,
                    sizey: data.sizey,
                    other: JSON.stringify(libItemData)
                })
            } else {
            	var libItemData = JSON.parse(JSON.stringify(data)),
        		newData = {
                    id: data.id,
                    orginalEleGuid: data.orginalEleGuid,
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
        if(data.visible) {
            var countUrl = "";
            if(data.countUrl) {
                countUrl = data.countUrl;
            } else if(data.column) {
                if(data.column.countUrl) {
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
        
        
    };

    win.adjustScrollWrap = function($widget) {
        var $scrollWrap = $('.scroll-wrap', $widget),
            widgetWidth = $widget.width() - 10*2, // 元件宽度
            $columnBox = $('.column-box', $widget), // 栏目
            $scrollBtn = $('.scroll-btn', $widget); // 切换按钮

        var item_width = 0;
        $('.element-column-item', $columnBox).each(function(index, item) {
            item_width += $(item).outerWidth(true);
        });

        $columnBox.css({
            "width": item_width + 'px'
        });

        if(item_width > widgetWidth) {
            // 显示两侧切换按钮
            $scrollBtn.show();
            $scrollWrap.addClass('show');
        } else {
            // 不显示两侧切换按钮
            $scrollBtn.hide();
            $scrollWrap.removeClass('show');
        }
    }

    // 添加临时元件，用于占位移动
    var addCacheElement = function(data) {
        
        var html = $(Mustache.render(CACHE_ELEMENT_TPL, data));
        gridster.add_widget(html, data.sizex || 4, data.sizey || 4, data.col, data.row ,[MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);
    }

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

   /*  var getAndAddElement = function (opt) {

        if (sessionStorage.showTip) {
            // 本次设计不再提示
            createEle(opt);
        } else {
            epoint.openDialog('初始化', './child/initEle.html', function (param) {
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
        Util.ajax({
            url: portalConfig.createElementUrl,
            data: $.extend({
                    portalGuid: portalGuid,
                    id: opt.id,
                    title: opt.name,
                    sizex: opt.sizex,
                    sizey: opt.sizey
                },
                opt)
        }).done(function (data) {
            if (!data) {
                return;
            }
            if (opt.name) {
                data.title = opt.name;
            }

            // 如果元件没有sizex和sizey属性，则直接从元件-模板的属性中获取
            if(!data.sizex) {
                data.sizex = opt.sizex;
            }
            if(!data.sizey) {
                data.sizey = opt.sizey;
            }

            data.col = Number(opt.col);
            data.row = Number(opt.row);

            
            data.visible = true;
            // 添加元件
            ElementManage.addElementItem(data, true);
        });
    } */

    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        // init: init,
        // getAndAddElement: getAndAddElement,
        addCacheElement: addCacheElement,
        addElementItem: addElementItem,
        removeElement: removeElement,
        removeALl: removeAll,
        removeBound: removeBound,
        getData: function () {
            // return gridster.serialize();
            
            return gridster.serialize();// checkData(sortByRowCol(dealData(gridster.serialize())));
        }
    };


    // var $paintingArea = $('#painting-area');

    $paintingArea.on('click', '.elem-icon', function () {
        var $this = $(this),
            $li = $this.parent().parent(),
            type = $this.data('ref'),
            info = $li.data();

        if (type == 'delete') {
            mini.showMessageBox({
                title: "提示",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", "确定"],
                customCls: "portal-tip",
                message: "确定要删除元件" + '<span class="text-blue">' + info.title + '</span>' + "吗？",
                callback: function (action) {
                    
                    if(action == '确定') {
                        setEleVisible({
                            libId: info.id,
                            visible: false,
                            callback: function () {
                                $li.toggleClass('active');
                                var _index = getLibIndex(info.orginalEleGuid);
                                var otherData = JSON.parse(cacheLibMenu[_index].other);
                                otherData.visible = false;
                                cacheLibMenu[_index].other = JSON.stringify(otherData);
                                
                                cacheLibMenu[_index].visible = false;
                                ElementManage.removeElement($('#element-' + info.id));
                                renderLibDom();
                            }
                        })
                    }
                }
            });
        }

    });

})(window, jQuery);
/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-10-18 15:41:10
 * @Description: '' 
 */
var $sidebarPanel = $('#sidebar-panel'),
    $libNum = $('.lib-num', $sidebarPanel), // 仓库数字
    $main = $('#main'),
    $paintingArea = $('#painting-area');

var cacheEleMenu = [], // 缓存元件-模板菜单，用于搜索
    cacheLibMenu = [], // 缓存元件-仓库菜单，用于搜索
    cacheTempResource = [], // 缓存模板菜单，原来的数据
    cacheTempMenu = [], // 缓存模板菜单，用于搜索
    cacheRemoveLib = []; // 缓存删除的元件，保存时一起删除

var CACHE_ELEMENT_TPL = $.trim($("#cache-element-tpl").html());

// 顶部按钮
(function (win, $) {
    $('#title').text(decodeURIComponent(Util.getUrlParams('title')));

    var getSaveData = function () {
        var tableData = [];
        $(cacheLibMenu).each(function (index, item) {
            var other = JSON.parse(item.other);
            tableData.push({
                id: item.id, // 标识
                row: other.row,
                col: other.col,
                sizex: item.sizex,
                sizey: item.sizey,
                visible: item.visible
            })
        })

        var resultData = {
            tempInfo: JSON.stringify({
                widthType: mini.get('widthType').value,
                pageWidth: mini.get('pageWidth').value,
                pagePercent: mini.get('pagePercent').value,
                eleGrid: mini.get('eleGrid').value,
                eleRuler: mini.get('eleRuler').value || 'false',
                eleMove: mini.get('eleMove').value,
                eleShow: mini.get('eleShow').value,
                eleScale: mini.get('eleScale').value
            }),
            tableData: JSON.stringify(tableData)
        }

        return resultData;
    }
    // 保存
    win.save = function (e) {
        var resultData = getSaveData();

        removeAllLib();

        saveToTemp($.extend({}, {
            tempGuid: portalGuid,
        }, resultData));

    }

    function saveToTemp(data) {
        Util.ajax({
            url: portalConfig.saveTemplate,
            data: data
        }).done(function (res) {
            epoint.showTips('保存成功');
        })
    }
})(window, jQuery);

var $typesDetail = $('.types-detail', $sidebarPanel);

// 左侧面板
(function (win, $) {
    var $libMoreMenu = $('#lib-more-menu'), // 仓库更多菜单
        $tempMoreMenu = $('#temp-more-menu'), // 模板更多菜单 
        $elListContainer = $('#element-list-container'), // 元件（模板）
        $libListContainer = $('#lib-list-container'), // 元件（仓库）
        $tempListContainer = $('#temp-list-container'), // 模板
        $gridBg = $('#grid-bg'); // 表格背景

    var $cacheTempLi = ''; // 缓存模板节点

    var ELEMENT_ITEM_SEARCH_TPL = $.trim($("#element-item-search-tpl").html()), // 元件（搜索模板）
        LIB_ITEM_SEARCH_TPL = $.trim($("#lib-item-search-tpl").html()), // 元件（搜索仓库）
        TEMP_ITEM_SEARCH_TPL = $.trim($('#temp-item-search-tpl').html()); // 模板搜索

    var ELEMENT_ITEM_TPL = $.trim($("#element-item-tpl").html()), // 元件（模板）
        LIB_ITEM_TPL = $.trim($("#lib-item-tpl").html()), // 元件（仓库）
        TEMP_ITEM_TPL = $.trim($('#temp-item-tpl').html()); // 模板


    $sidebarPanel
        // 模板tab 中列表展开收起
        .on('click', '.template-title', function () {
            var $this = $(this),
                $templateLists = $this.parent(),
                $nextList = $this.next();

            $nextList.slideToggle();
            $templateLists.toggleClass('active');
        })
        // 切换左侧栏目
        .on('click', '.type', function () {
            var $this = $(this),
                type = $this.data('ref');

            $this.addClass('active').siblings('.active').removeClass('active');
            $('.' + type + '-detail', $sidebarPanel).removeClass('hidden').siblings().addClass('hidden');

            if ($typesDetail.css('display') === 'none') {
                editCommonUtil.fixedPanel(true);
            }
        })
        // 收起左侧展开的面板
        .on('click', '.panel-back', function () {
            if (!expand) {
                $('.icon-page').addClass('active');
            }
            editCommonUtil.togglePanel(!expand);

            $main.removeClass('fix-flag');
        })
        // 切换元件中的tab
        .on('click', '.element-tab', function () {
            var $this = $(this),
                ref = $this.data('ref');

            $this.addClass('active').siblings('.active').removeClass('active');
            $('.' + ref + '-panel', $sidebarPanel).removeClass('hidden').siblings().addClass('hidden');
        })
        // 显示隐藏
        .on('click', '.icon-eye', function (e) {
            var $this = $(this),
                $li = $this.parent(),
                info = $li.data(),
                visible = $li.hasClass('active');

            editCommonUtil.setEleVisible({
                libId: info.id,
                visible: !visible,
                callback: function () {
                    $li.toggleClass('active');
                    var _index = getLibIndex(info.id);

                    var otherData = JSON.parse(cacheLibMenu[_index].other);
                    otherData.visible = !visible;
                    cacheLibMenu[_index].other = JSON.stringify(otherData);
                    if (visible) {

                        cacheLibMenu[_index].visible = false;
                        ElementManage.removeElement($('#element-' + info.id));
                    } else {

                        cacheLibMenu[_index].visible = true;
                        ElementManage.addElementItem(otherData, true, true);
                    }
                }
            });

        })
        // 点击仓库更多按钮
        .on('click', '.lib-more', function (e) {
            var $this = $(this),
                $li = $this.parent();
            // 缓存仓库的数据
            $libMoreMenu.data('info', $li.data());

            commonUtil.menuPosition($this, $libMoreMenu);
        })
        // 点击模板更多按钮
        .on('click', '.temp-more', function (e) {
            var $this = $(this),
                $li = $this.parent();

            $cacheTempLi = $li;

            var liData = $li.data();

            // 缓存模板的数据
            $tempMoreMenu.data('info', liData)

            if (liData.publicId) {
                $tempMoreMenu.find('.public-item').text('取消公开');
            } else {
                $tempMoreMenu.find('.public-item').text('公开模板');
            }
            commonUtil.menuPosition($this, $tempMoreMenu);
        })
        // 点击模板进行预览
        .on('click', '.template-item', function () {
            var $this = $(this),
                $li = $this.parent(),
                info = $li.data();

            epoint.openDialog(info.name, './preview?templateGuid=' + info.id, function (param) {
                if (param.type == 'ok') {

                    var tableData = param.options.data || [];
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
                    var sum = $('.element-item').length;
                    var i = 1;
                    if(sum) {
                        gridster.remove_all_widgets(function() {
                            if(i == sum) {
                                $.each(tableData, function(index, item) {
                                    ElementManage.addElementItem(item, true);
                                });
                            } else {
                                i++;
                            }
                        });
                    } else {
                        $.each(tableData, function(index, item) {
                            ElementManage.addElementItem(item, true);
                        });
                    }
                    

                }
            }, {
                param: {

                }
            });

        })
        // 元件-模板搜索值改变
        .on('input propertychange keyup', '#ele-search', function () {
            var $this = $(this),
                searchVal = $this.val();

            renderEleDom(searchVal);
            $('.element-list').slideDown();

        })
        // 元件-仓库搜索值改变
        .on('input propertychange keyup', '#lib-search', function () {
            var $this = $(this),
                searchVal = $this.val();

            renderLibDom(searchVal);
        })
        // 模板搜索值改变
        .on('input propertychange keyup', '#temp-search', function () {
            var $this = $(this),
                searchVal = $this.val();


            renderTemplateDom(searchVal);
            $('.template-list').slideDown();
        });

    // 点击其他地方隐藏更多菜单
    $('body').on('click', function (e) {
        if (!$(e.target).closest('.lib-more, .temp-more, .more-menu').length) {
            $libMoreMenu.hide();
        }
        if (!$(e.target).closest('.sidebar-panel').length) {
            if ($main.hasClass('fix-flag')) {
                $('.types-detail').hide();
            }
        }
    });

    // 页面操作
    var $pageNumber = $('#page-number');
    // 宽度
    win.widthChange = function (e) {
        widthType(e.value);
    }

    win.widthValueChange = function (e) {

        $paintingArea.css('width', e.value + 'px');
        resetBaseDimensions();
    };

    win.widthPercentChange = function (e) {


        $paintingArea.css('width', e.value + '%');
        resetBaseDimensions();
    };

    win.widthType = function (value) {
        $pageNumber[value == 2 ? 'removeClass' : 'addClass']('percent');
        if (value == 2) {
            mini.get('pagePercent').setVisible(false)
            mini.get('pageWidth').setVisible(true)
            $paintingArea.css('width', mini.get('pageWidth').value + 'px');

        } else {
            mini.get('pageWidth').setVisible(false);
            mini.get('pagePercent').setVisible(true);
            $paintingArea.css('width', mini.get('pagePercent').value + '%');
        }

        resetBaseDimensions();
    }

    // 辅助设计
    // 栅格线
    win.gridChange = function (e) {


        if (e.value == 'true') {
            $gridBg.removeClass('hidden');
            $container.addClass('row-line');
        } else {
            $gridBg.addClass('hidden');
            $container.removeClass('row-line');
        }
    }
    // 标尺
    var pageRuler;
    win.ruleChange = function (e) {

        if (e.value == 'true') {
            // 标尺
            if (pageRuler) {
                pageRuler.showRuler()
            } else {
                pageRuler = new PageRuler({
                    container: "#container-panel", // 所在容器
                    target: "#painting-area",
                    rulerId: "rulerBox"
                });
            }

        } else {
            pageRuler.hideRuler();
        }
    }

    // 仓库更多菜单事件
    $libMoreMenu.on('click', '.menu-item', function () {
        var $this = $(this),
            ref = $this.data('ref');

        var infoData = $libMoreMenu.data('info');

        var _index = getLibIndex(infoData.id);
        var libData = JSON.parse(cacheLibMenu[_index].other);


        if (ref == 'delete') {
            epoint.confirm("确定要删除仓库中的元件" + '<span class="text-blue">' + libData.title + '</span>' + "吗？", '', function (action) {

                delEleLib({
                    libId: libData.id,
                    callback: function () {
                        ElementManage.removeElement($('#element-' + libData.id));
                        var _index = getLibIndex(libData.id);
                        cacheLibMenu.splice(_index, 1);
                        resetCacheLibMenu();
                    }
                })
            });
        } else if (ref == 'edit') {
            libMenuEvent.edit({
                title: libData.name,
                id: libData.id,
                info: libData
            });
        } else if (ref == 'create') {
            libMenuEvent.create({
                title: libData.title,
                id: libData.id,
                columnId: libData.other.column.columnId
            });
        }

        $libMoreMenu.hide();
    });

    /* -------- 加载元件（模板） ---------- */


    // 获取元件模板数据
    var getElData = function () {
        Util.ajax({
            url: portalConfig.getAllComponentUrl,
            data: {
                portalGuid: portalGuid
            }
        }).done(function (data) {
            if (!data || !data.length) {
                $elListContainer.html('<li class="no-result">暂无数据</>');
                return;
            }
            cacheEleMenu = data;
            renderEleDom();
        });
    };

    // 渲染元件-模板列表
    function renderEleDom(searchVal) {

        var elementItemDom;
        if (searchVal) {
            var list = JSON.parse(JSON.stringify(cacheEleMenu));
            var empty = true;
            $(list).each(function (index, temp) {
                $(temp.items).each(function (m, item) {
                    if (item.name.indexOf(searchVal) > -1) {
                        var reg = new RegExp(searchVal, "g");
                        temp['has'] = true;
                        empty = false;
                        item.result = item.name.replace(reg, '<span class="result-mark">' + searchVal + '</span>');
                    }
                    if(!item.icon) {
                        item.icon = 22;
                    }

                    if(!isNaN(+item.icon)) {
                        // 数字
                        item['isfonticon'] = true;
                    } else {
                        // 字符串自定义背景图
                        item['isfonticon'] = false;
                        item['titleIcon'] = Util.getRightUrl(item.icon);
                    }
                    
                })
            });
            elementItemDom = Mustache.render(ELEMENT_ITEM_SEARCH_TPL, {
                list: list || []
            });
            if (empty) {
                elementItemDom = '<li class="no-result">暂无数据</>'
            }

        } else {
        	var list = JSON.parse(JSON.stringify(cacheEleMenu));
        	$(list).each(function (index, temp) {
                $(temp.items).each(function (m, item) {
                    if(!item.icon) {
                        item.icon = 22;
                    }

                    if(!isNaN(+item.icon)) {
                        // 数字
                        item['isfonticon'] = true;
                    } else {
                        // 字符串自定义背景图
                        item['isfonticon'] = false;
                        item['titleIcon'] = Util.getRightUrl(item.icon);
                    }
                    
                })
            });
            elementItemDom = Mustache.render(ELEMENT_ITEM_TPL, {
                list: list || []
            });

        }
        $elListContainer.html(elementItemDom)
        // 加载后初始化拖拽事件
        $('.drag-item').draggable(tplDragCfg);
    }

    getElData();

    /* -------- 加载元件（模板） end ---------- */

    /* -------- 加载元件（仓库） ---------- */

    win.renderLibDom = function (searchVal) {
        var elementItemDom = '';
        if (searchVal) {
            var empty = true;
            var list = JSON.parse(JSON.stringify(cacheLibMenu));
            $(list).each(function (index, item) {
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

            if (cacheLibMenu.length != 0) {
                $libNum.text('(' + cacheLibMenu.length + ')');
            } else {
                $libNum.text('');
            }

        }
        $libListContainer.html(elementItemDom);
        // 加载后初始化拖拽事件
        $('.drag-item').draggable(tplDragCfg);
    }

    win.getLibIndex = function (id) {
        var _index = -1;
        $(cacheLibMenu).each(function (index, item) {
            if (item.id == id) {
                _index = index;
            }
        });
        return _index;
    }


    // 删除仓库，同删除元件
    win.delEleLib = function (opt) {
        var libId = opt.libId,
            callback = opt.callback,
            _index = cacheRemoveLib.indexOf(libId);

        // 理论上不会有同一个删两次的情况，但是还是加个判断，还原时，需要把 cacheRemoveLib 置为 []
        if (_index < 0) {
            cacheRemoveLib.push(libId);
        }

        if (typeof callback == 'function') {
            callback();
        }
    }

    win.removeAllLib = function () {
        Util.ajax({
            url: portalConfig.delEleLib,
            data: {
                id: cacheRemoveLib.join(',')
            }
        }).done(function (data) {

        });
    }

    /* -------- 加载元件（仓库）end ---------- */

    /* -------- 加载模板 ---------- */

    win.getTemplateData = function () {
        Util.ajax({
            url: portalConfig.getTemplateList
        }).done(function (data) {

            cacheTempResource = data || [];
            setCacheTempMenu();

            renderTemplateDom();
        });
    };

    function setCacheTempMenu() {
        var data = cacheTempResource;
        var arr = [{
            id: "public",
            name: "公开模板",
            items: []
        }, {
            id: "my",
            name: "个人模板",
            items: []
        }]
        $(data).each(function (index, item) {
            if (item.public) {
                arr[0].items.push(item);
            } else {
                arr[1].items.push(item);
            }
        })
        cacheTempMenu = arr || [];
    }

    // 渲染模板列表
    function renderTemplateDom(searchVal) {

        var elementItemDom;
        if (searchVal) {

            var list = JSON.parse(JSON.stringify(cacheTempMenu));
            var empty = true;
            $(list).each(function (index, temp) {
                $(temp.items).each(function (m, item) {
                    if (item.name.indexOf(searchVal) > -1) {
                        var reg = new RegExp(searchVal, "g");
                        temp['has'] = true;
                        empty = false;
                        item.result = item.name.replace(reg, '<span class="result-mark">' + searchVal + '</span>');
                    }
                })
            });
            elementItemDom = Mustache.render(TEMP_ITEM_SEARCH_TPL, {
                list: list || []
            });
            if (empty) {
                elementItemDom = '<li class="no-result">暂无数据</>';
            }

        } else {
            elementItemDom = Mustache.render(TEMP_ITEM_TPL, {
                list: cacheTempMenu || []
            });

        }
        $tempListContainer.html(elementItemDom);
    }

    // getTemplateData();

    var delTemplate = function (opt) {
        var id = opt.id,
            callback = opt.callback || '';

        Util.ajax({
            url: portalConfig.deleteTemplate,
            data: {
                id: id
            }
        }).done(function (data) {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    var publicTemplate = function (opt) {
        var id = opt.id,
            public = opt.public,
            callback = opt.callback || '';

        Util.ajax({
            url: portalConfig.publicTemplate,
            data: {
                id: id,
                public: public
            }
        }).done(function (data) {
            if (typeof callback == 'function') {
                callback(data);
            }
        });
    }

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

    /* -------- 加载模板 end ---------- */


})(window, jQuery);

// 仓库更多菜单的内容
(function (win, $) {
    win.libMenuEvent = { // TODO
        edit: function (opt) {
            var componentType = opt.info.componentType;
            var settingUrl = ''; 
            if(componentType == 1) {
                // 实例
                settingUrl = './child/exampleedit'
            } else {
                // 模板
                settingUrl = './child/templateedit'
            }

            if (opt.info.manageUrl) {
                settingUrl = Util.getRightUrl(opt.info.manageUrl);
            }
            if (settingUrl.indexOf('?') > -1) {
                settingUrl += 'title=' + encodeURIComponent(opt.title) + '&id=' + opt.id;
            } else {
                settingUrl += '?title=' + encodeURIComponent(opt.title) + '&id=' + opt.id;
            }
            epoint.openDialog('元件设置', settingUrl, function (param) {
                if (param.type == 'ok') {
                    epoint.showTips('保存成功');
                    var info = opt.info; // 原来组件的信息

                    var gridOption = {
                        col: info.col,
                        // code: info.code,
                        id: info.id,
                        row: info.row,
                        sizex: info.sizex,
                        sizey: info.sizey,
                        manageUrl: info.manageUrl || "",
                        componentType: info.componentType,
                        titleCount: info.titleCount
                        // 设置元件中无以下参数
                    };

                    

                    // 设置元件中的数据
                    var setOption = param.options.attr;

                    var newOption = $.extend({}, gridOption, setOption);

                    if(componentType == 1) {
                        // 实例
                        
                        var _index = getLibIndex(info.id);
                        var libData = JSON.parse(cacheLibMenu[_index].other);
                        newOption = $.extend({}, newOption, {
                            column: libData.column
                        });
                    }

                    if (!$('#element-' + opt.id).length) {
                        newOption.visible = false;
                        ElementManage.addElementItem(newOption, true)
                        return;
                    }

                    ElementManage.removeElement($('#element-' + opt.id), function () {
                        // 添加进去
                        ElementManage.addElementItem(newOption, true)
                    });


                } else if (param.type == 'close') {
                    
                }
                // if (param.type == 'ok') {

                //     epoint.showTips('保存成功');
                //     var info = opt.info; // 原来组件的信息


                //     var gridOption = {
                //         col: info.col,
                //         // code: info.code,
                //         id: info.id,
                //         row: info.row,
                //         sizex: info.sizex,
                //         sizey: info.sizey,
                //         manageUrl: info.manageUrl || "",
                //         // 设置元件中无以下参数
                //     };

                //     // 设置元件中的数据
                //     var setOption = param.options.attr;


                //     var newOption = $.extend({}, gridOption, setOption);


                //     ElementManage.removeElement($('#element-' + opt.id), function () {
                //         // 添加进去

                //         ElementManage.addElementItem(newOption, true)
                //     });


                // } else if (param.type == 'close') {
                // }
            }, {
                width: "415",
                height: "578",
                param: {
                }
            });
        },
        create: function (opt) {
            epoint.openDialog('创建元件副本', './child/createele?title=' + opt.title + '&id=' + opt.id + '&columnId=' + opt.columnId, function (param) {
                if (param.type == 'ok') {
                    var options = param.options;
                    var data = $libMoreMenu.data('info');

                    data.title = options.name;
                    data.other.column.columnId = options.columnId;
                    data.other.column.columnName = options.columnName;
                    data.other.column.columnUrl = options.columnUrl;
                    data.other.column.isDiy = options.isDiy;
                    data.other.title = options.name;
                    data.other.name = options.name;
                    data.other.col = '';
                    data.other.row = '';

                    createEle(data.other);

                } else if (param.type == 'close') {
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

var isDragging = false; // 是否开始移动
var ELEMENT_CONTENT_TPL = $.trim($('#element-content-tpl').html());
var ELEMENT_TPL = ''; // 右侧移动的元件
// 右侧表格中的元件
(function (win, $) {

    win.gridster = commonUtil.initGridster();

    win.resetCacheLibMenu = editCommonUtil.resetCacheLibMenu;

    // 绑定事件
    function bindEvent() {
        $('body').on('click', '.element-item', function () {
            var $this = $(this);
            if (!isDragging) {
                $this.addClass('change').siblings('.change').removeClass(('change'));
            }
            isDragging = false;
        }).on('click', function (e) {
            if (!$(e.target).closest('.element-item').length) {
                ElementManage.removeBound();
            }
        });
    }

    bindEvent();

    // 新增元件
    var addElementItem = commonUtil.addElementItem;

    // 添加元件 兼容一次多个的操作 如果参数为数组，则表示一次添加多个

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


    /* 
     * col: "2"
     * columnId: "2"
     * columnName: "栏目二"
     * columnUrl: "columnlist"
     * id: "150000201504167589"
     * isDiy: false
     * name: "元件模板-都间集2222"
     * row: "1"
     * sizex: "11"
     * sizey: "4"
     * tip: false
     */
    win.createEle = function (opt) {
        // 请求模板数据
        Util.ajax({
            url: portalConfig.createElementUrl,
            data: {
                guid: portalGuid,
                type: "template",
                id: opt.id,
                title: opt.name,
                sizex: opt.sizex,
                sizey: opt.sizey,
                countUrl: opt.countUrl,
                column: JSON.stringify({
                    columnId: opt.columnId,
                    columnName: opt.columnName,
                    columnUrl: opt.columnUrl,
                    isDiy: opt.isDiy
                })
            }
        }).done(function (data) {
            if (!data) {
                return;
            }
            if (opt.name) {
                data.title = opt.name;
            }

            if (data.isExistComponent) {
				epoint.showTips('此模板下已有此元件实例，不能重复创建！', {
					state : "danger"
				});
				return;
			}

            // 如果元件没有sizex和sizey属性，则直接从元件-模板的属性中获取
            if (!data.sizex) {
                data.sizex = opt.sizex;
            }
            if (!data.sizey) {
                data.sizey = opt.sizey;
            }

            data.col = Number(opt.col);
            data.row = Number(opt.row);

            data.visible = true;
            // 添加元件
            ElementManage.addElementItem(data, true);


        });
    }

    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        getAndAddElement: editCommonUtil.getAndAddElement,
        addElementItem: addElementItem,
        addCacheElement: editCommonUtil.addCacheElement,
        removeElement: removeElement,
        removeALl: removeAll,
        removeBound: removeBound,
        getData: function () {
            return gridster.serialize();
        }
    };

    $paintingArea.on('click', '.elem-icon', function () {
        var $this = $(this),
            $li = $this.parent().parent(),
            type = $this.data('ref'),
            info = $li.data();


        if (type == 'set') {
            libMenuEvent.edit({
                title: info.title,
                id: info.id,
                info: info
            });
        } else if (type == 'delete') {
            epoint.confirm("确定要删除元件" + '<span class="text-blue">' + info.title + '</span>' + "吗？", '', function (action) {

                delEleLib({
                    libId: info.id,
                    callback: function () {
                        ElementManage.removeElement($('#element-' + info.id));
                        var _index = getLibIndex(info.id);
                        cacheLibMenu.splice(_index, 1);
                        resetCacheLibMenu();
                    }
                })
            })
        }

    });

})(window, jQuery);
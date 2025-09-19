/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2020-04-17 17:09:12
 * @Description: '' 
 */

var $sidebarPanel = $('#sidebar-panel'),
    $libNum = $('.lib-num', $sidebarPanel), // 仓库数字
    $main = $('#main'),
    $libMoreMenu = $('#lib-more-menu'), // 仓库更多菜单
    $paintingArea = $('#painting-area');

var cacheEleMenu = [], // 缓存元件-模板菜单，用于搜索
    cacheLibMenu = [], // 缓存元件-仓库菜单，用于搜索
    cacheTempResource = [], // 缓存模板菜单，原来的数据
    cacheTempMenu = [], // 缓存模板菜单，用于搜索
    cacheRemoveLib = [], // 缓存删除的元件，保存时一起删除
    // hasClear = false, // 是否清空过
    hasSave = false; // 是否保存过，用于第一次清空后，拖拽时进行保存，用于重置数据，防止刷新时新旧内容一起加载

var CACHE_ELEMENT_TPL = $.trim($("#cache-element-tpl").html());

// 顶部按钮
(function (win, $) {
    $('#title').text(Util.getUrlParams('title'));

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
        var type = e.sender.value;
        if (type === '1') {
            var resultData = getSaveData();

            Util.ajax({
                url: portalConfig.saveDesign,
                data: $.extend({}, {
                    portalGuid: portalGuid
                }, resultData)
            }).done(function (res) {
                epoint.showTips(res.msg || '保存成功');
                hasSave = true;
            });

        }
    }

    win.otherSave = function (e) {
        var type = e.sender.value;
        if (type === '2') {
            var htmlContent = $('#htmlContent').clone().addClass('copy')[0]
            htmlContent.style.display = "";
            
            mini.showMessageBox({
                width: 350,
                height: 150,
                title: "存为模板",
                buttons: ["cancel", "ok"],
                // customCls: "portal-tip",
                // message: "自定义Html",
                html: htmlContent,
                showModal: true,
                callback: function (action) {
                    if (action == 'ok') {
                        var name = $('.copy #portal-name').val().trim();
                        if (!name) {
                            epoint.showTips('名称不能为空', {
                                state: "danger"
                            });
                            return;
                        }
                        if (name.length > 50) {
                            epoint.showTips('名称请控制在50字以内，谢谢', {
                                state: "danger"
                            });
                            return;
                        }
                        var resultData = getSaveData();

                        saveToTemp($.extend({}, {
                            portalGuid: portalGuid,
                            name: name,
                        }, resultData));
                    }

                }
            });
        } else if (type === '3') {
            epoint.confirm("是否还原到上一次页面加载的状态？", '', function (action) {

                cacheLibMenu = [];
                cacheRemoveLib = [];
                var sum = $('.element-item').length;
                var i = 1;

                function addCacheInitData() {
                    if (cacheInitData.length) {
                        // 行列排序
                        cacheInitData.sort(
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
                        $.each(cacheInitData, function(index, item) {
                            ElementManage.addElementItem(item, true);
                        });
                    }
                }
                if(sum) {
                    gridster.remove_all_widgets(function() {
                        if(i == sum) {
                            addCacheInitData();
                        } else {
                            i++;
                        }
                    });
                } else {
                    addCacheInitData();
                }
               
                
            })
        } else if (type === '4') {
            epoint.confirm("当前设计的内容将被移入仓库，可通过 <span style='color: #51a6ef'>[还原]</span> 功能，恢复到到上一次页面加载的状态。", '', function (action) {
    
                hasClear = true;
                hasSave = false;
                $(cacheLibMenu).each(function (index, item) {
                    item.visible = false;
                    var other = JSON.parse(item.other);
                    other.visible = false;
                    item.other = JSON.stringify(other);
                });
                ElementManage.removeALl();
                renderLibDom();
            })
        }
    }

    function saveToTemp(data) {
        Util.ajax({
            url: portalConfig.saveToTemplate,
            data: data
        }).done(function (res) {
            getTemplateData();

            epoint.showTips('保存成功');
        })
    }

    
})(window, jQuery);

// 左侧面板
var $typesDetail = $('.types-detail', $sidebarPanel);
(function (win, $) {

    var $tempMoreMenu = $('#temp-more-menu'), // 模板更多菜单 
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
                $('.icon-element').addClass('active');
                $('.element-detail').removeClass('hidden').siblings().addClass('hidden');
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
            // $cacheLibLi = $li;
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
                    getTemplateById({
                        id: info.id
                    });

                } else if (param.type == 'close') {
                   
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

    function getTemplateById(opt) {
       
        var id = opt.id;
        Util.ajax({
            url: portalConfig.getTemplateById,
            data: {
                templateGuid: id,
                portalGuid: portalGuid
            }
        }).done(function (data) {
            var tableData = data.tableData;
            var sum = $('.element-item').length;
            var i = 1;
            removeAllLib(function() {
                if(sum) {
                    gridster.remove_all_widgets(function() {
                        if(i == sum) {
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
                            $.each(tableData, function(index, item) {
                                ElementManage.addElementItem(item, true);
                            });
                        } else {
                            i++;
                        }
                    });
                } else {
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
                    $.each(tableData, function(index, item) {
                        ElementManage.addElementItem(item, true);
                    });
                }
            });
            
        })
    }


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
    win.onMoveChange = function (e) {
        if(e.value == 'false') {
            mini.get('eleShow').disable();
            mini.get('eleScale').disable();
        } else {
            mini.get('eleShow').enable();
            mini.get('eleScale').enable();
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
                title: libData.title,
                id: libData.id,
                info: libData
            });
        } else if (ref == 'create') {            
            libMenuEvent.create({
                title: libData.title,
                id: libData.id,
                columnId: libData.column.columnId,
                isDiy: libData.column.isDiy,
                columnUrl: libData.column.columnUrl
            });
        }

        $libMoreMenu.hide();
    });

    var findTemplateItem = function (id) {
        for (var i = 0, len = cacheTempResource.length; i < len; i++) {
            if (id == cacheTempResource[i].id) {
                return cacheTempResource[i];
            }
        }
    }

    // 模板更多菜单事件
    $tempMoreMenu.on('click', '.menu-item', function () {
        var $this = $(this),
            ref = $this.data('ref');

        var info = $tempMoreMenu.data('info'),
            libData = findTemplateItem(info.id);
        if(!libData) {
            libData = info;
        }
        if (ref == 'delete') {
            epoint.confirm("确定要删除模板" + '<span class="text-blue">' + libData.name + '</span>' + "吗？", '', function (action) {

                delTemplate({
                    id: libData.id,
                    callback: function () {
                        $(cacheTempResource).each(function (index, item) {
                            if (item.id == libData.publicId) {
                                cacheTempResource.splice(index, 1);
                            }
                        });

                        $(cacheTempResource).each(function (index, item) {
                            if (item.publicId == libData.publicId) {
                                cacheTempResource.splice(index, 1);
                            }
                        });

                        setCacheTempMenu();

                        $cacheTempLi.remove();
                        $cacheTempLi = null;

                        $('#template-item-' + libData.publicId).remove()
                        $('#template-item-search-' + libData.publicId).remove()
                    }
                })
            });
            
        } else if (ref == 'public') {
            var flag = libData.publicId ? true : false;
            var txt = flag ? '取消公开，其他用户不可见？' : '设为公开，对其他用户可见？';
            var btnTxt = flag ? '确定' : '公开';
            mini.showMessageBox({
                title: flag ? '取消公开模板' : "公开模板",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", btnTxt],
                customCls: "portal-tip",
                message: "是否将" + '<span class="text-blue">' + libData.name + '</span>' + txt,
                callback: function (action) {

                    if (action == '公开') {
                        publicTemplate({
                            id: libData.id,
                            public: true,
                            callback: function (data) {
                                var newId = data.id;
                                $cacheTempLi.addClass('public').attr('data-public-id', newId).data('publicId', newId);

                                var str = '<li class="l template-item-box" id="template-item-' + newId + '" data-id="' + newId + '" data-name="' + libData.name + '">' +
                                    '<div class="template-item">' +
                                    '<div class="temp-item-img"><img src="./css/images/icon_public.png" alt="">' +
                                    '</div>' +
                                    '<p class="temp-item-text">' + libData.name + '</p>' +
                                    '</div>' +
                                    '</li>';

                                $('#temlate-list-public').append(str);

                                cacheTempResource.push({
                                    id: newId,
                                    img: '',
                                    name: libData.name,
                                    "public": true, // 是否公开模板
                                    "publicId": ""
                                });

                                $(cacheTempResource).each(function (index, item) {
                                    if (item.id == libData.id) {
                                        item.publicId = newId;
                                    }
                                });

                                setCacheTempMenu();
                            }
                        })
                    }

                    if (action == '确定') {

                        publicTemplate({
                            id: libData.id,
                            public: false,
                            callback: function (data) {

                                $('#template-item-' + libData.publicId).remove();
                                $('#template-item-search-' + libData.publicId).remove();

                                $(cacheTempResource).each(function (index, item) {
                                    if (item.id == libData.publicId) {
                                        cacheTempResource.splice(index, 1);
                                    }
                                    if(item.publicId == libData.publicId) {
                                        item.publicId = '';
                                    }
                                });

                                setCacheTempMenu();
                                $cacheTempLi.removeClass('public').attr('data-public-id', '').data('publicId', '');;
                            }
                        })
                    }

                }
            });
        } else if (ref == 'rename') {
            $('.portal-name').val(libData.name);
            var tempHtmlContent = $('#tempRename').clone().addClass('copy')[0];
            tempHtmlContent.style.display = "";

            mini.showMessageBox({
                width: 350,
                height: 150,
                title: "模板重命名",
                buttons: ["取消", "保存"],
                customCls: "portal-tip",
                // message: "自定义Html",
                html: tempHtmlContent,
                showModal: true,
                callback: function (action) {

                    if (action == '保存') {
                        var name = $('.copy #temp-name').val().trim();
                        if (!name) {
                            epoint.showTips('名称不能为空', {
                                state: "danger"
                            });
                            return;
                        }
                        if (name.length > 50) {
                            epoint.showTips('名称请控制在50字以内，谢谢', {
                                state: "danger"
                            });
                            return;
                        }
                        renameTemplate({
                            id: libData.id,
                            name: name,
                            callback: function () {
                                $(cacheTempResource).each(function (index, item) {
                                    if (item.id == libData.id || item.publicId == libData.publicId) {
                                        item.name = name;
                                    }
                                });

                                setCacheTempMenu();

                                $cacheTempLi.find('.temp-item-text').text(name);
                                $cacheTempLi.data("name", name);
                                if (libData.publicId) {
                                    $('#template-item-' + libData.publicId).find('.temp-item-text').text(name);
                                    $('#template-item-search-' + libData.publicId).find('.temp-item-text').text(name);
                                }

                            }
                        })
                    }

                }
            });
        } else if (ref == 'edit') {
            win.open(Util.getRightUrl('./edit?tempGuid=' + libData.id + '&title=' +  encodeURIComponent(libData.name)));
        }
        $tempMoreMenu.hide();
    });

    // 点击其他地方隐藏更多菜单
    $('body').on('click', function (e) {
        if (!$(e.target).closest('.lib-more, .temp-more, .more-menu').length) {
            $libMoreMenu.hide();
            $tempMoreMenu.hide();
        }
        if (!$(e.target).closest('.sidebar-panel').length) {
            if ($main.hasClass('fix-flag')) {
                $('.types-detail').hide();
                $('.type').removeClass('active');
            }
        }
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

        Util.ajax({
            url: portalConfig.delEleLib,
            data: {
                id: libId
            }
        }).done(function (data) {
            if (typeof callback == 'function') {
                callback();
            }
        });
    }

    win.removeAllLib = function (callback) {
        var libs = [];
        if(cacheLibMenu.length) {
            $(cacheLibMenu).each(function(index,item) {
                libs.push(item.id)
            });
        Util.ajax({
            url: portalConfig.delEleLib,
            data: {
                id: libs.join(',')
            }
        }).done(function (data) {
             cacheLibMenu = [];
            if(typeof callback == 'function') {
                callback();
            }
        });
        } else {
            if(typeof callback == 'function') {
                callback();
            }
        }
    }

    /* -------- 加载元件（仓库）end ---------- */

    /* -------- 加载模板 ---------- */

    win.getTemplateData = function () {
        Util.ajax({
            url: portalConfig.getTemplateList,
            data: {
                type: "backstage"
            }
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

    getTemplateData();

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
    win.libMenuEvent = {
        edit: function (opt) {
            var componentType = opt.info.componentType;
            var settingUrl = ''; // './child/eleedit'
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
                settingUrl += 'title=' + opt.title + '&id=' + opt.id;
            } else {
                settingUrl += '?title=' + opt.title + '&id=' + opt.id;
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
                        newOption = $.extend({},{
                            column: libData.column
                        }, newOption );
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
            }, {
                width: "415",
                height: "578",
                param: {
                    // title: opt.title || '',
                    // id: opt.id || ''
                }
            });
        },
        create: function (opt) {
            epoint.openDialog('创建元件副本', './child/createele?title=' + encodeURIComponent(opt.title) + '&id=' + opt.id + '&columnId=' + opt.columnId + '&isdiy=' + opt.isDiy + '&columnurl=' + opt.columnUrl, function (param) {
                if (param.type == 'ok') {
                    var options = param.options;
                    var data = $libMoreMenu.data('info');

                    data.title = options.name;
                    data.other.columnId = options.columnId;
                    data.other.columnName = options.columnName;
                    data.other.columnUrl = options.columnUrl;
                    data.other.isDiy = options.isDiy;
                    data.other.name = options.name;
                    data.other.title = options.name;
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

// 右侧表格中的元件
var isDragging = false; // 是否开始移动
var ELEMENT_CONTENT_TPL = $.trim($('#element-content-tpl').html());
var ELEMENT_TPL = ''; // 右侧移动的元件
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
     * componentType: 0   0：元件模板 1：元件实例
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
                type: "portal",
                id: opt.id,
                componentType: opt.componentType,
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
				epoint.showTips('当前门户下已有此元件实例，不能重复创建！', {
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
            // info = $li.data();
            info = getDataset($li[0]);

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

    function getDataset(ele){
        var attrs = ele.attributes,//元素的属性集合
            dataset = {},
            name,
            matchStr;
        for(var i = 0;i<attrs.length;i++){
            matchStr = attrs[i].name.match(/^data-(.+)/);
            if(matchStr){
                name = matchStr[1].replace(/-([\da-z])/gi,function(all,letter){
                    return letter.toUpperCase();
                });
                if(!isNaN(+attrs[i].value)) {
                    dataset[name] = Number(attrs[i].value)
                } else {
                    dataset[name] = attrs[i].value;
                }
                
            }
        }
        return dataset;
    }
})(window, jQuery);
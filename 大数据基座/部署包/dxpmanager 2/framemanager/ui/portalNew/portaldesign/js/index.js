/*
 * @Author: jjj 
 * @Date: 2019-07-26 10:58:54 
 * @Last Modified by: jjj
 * @Last Modified time: 2019-08-29 15:00:38
 * @Description: '' 
 */

var $sidebarPanel = $('#sidebar-panel'),
    $libNum = $('.lib-num', $sidebarPanel), // 仓库数字
    $main = $('#main'),
    $libMoreMenu = $('#lib-more-menu'), // 仓库更多菜单
    $paintingArea = $('#painting-area'),
    $container = $('#grid-container');

var cacheEleMenu = [], // 缓存元件-模板菜单，用于搜索
    cacheLibMenu = [], // 缓存元件-仓库菜单，用于搜索
    cacheTempResource = [], // 缓存模板菜单，原来的数据
    cacheTempMenu = [], // 缓存模板菜单，用于搜索
    cacheRemoveLib = []; // 缓存删除的元件，保存时一起删除
    // cacheColumns = []; // 缓存主栏目
    
// 栅格及元件参数
var containerSize = {
        w: $container.width(),
        h: $container.height()
    },
    GAPS = [8, 8], // 元件边距
    COLS = 24, // 列数
    ROW_H = 57, // 行间距，计算时需要加上 元件边距 的高度 * 2
    MAX_COLSPAN = 24, // 元件最大跨列数
    MAX_ROWSPAN = 6, // 元件最大跨行数
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
    TOP_DISTANCE = 69; // 顶部距离画布的距离

// 顶部按钮
(function (win, $) {
    $('#title').text(Util.getUrlParams('title'));

    var getSaveData = function() {
        var tableData = [];
        $(cacheLibMenu).each(function(index,item) {
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
            tableData: JSON.stringify(tableData) //JSON.stringify(ElementManage.getData())
        }
        
        return resultData;
    }
    // 保存
    win.save = function (e) {
        var type = e.sender.value;
        if (type === '1') {
           var resultData = getSaveData();

           // 保存同时删除缓存的已删除元件
           removeAllLib();

            Util.ajax({
                url: portalConfig.saveDesign,
                data: $.extend({}, {
                    portalGuid: portalGuid
                }, resultData)
            }).done(function(res) {
                epoint.showTips(res.msg || '保存成功');
            });

        }
    }

    var htmlContent = document.getElementById("htmlContent"),
        $titleName = $('#portal-name');

    win.otherSave = function (e) {
        var type = e.sender.value;
        if (type === '2') {
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
                            name: name,
                        }, resultData));
                    }

                }
            });
        } else if (type === '3') {
            mini.showMessageBox({
                title: "提示",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", "还原"],
                customCls: "portal-tip",
                message: "是否还原到最近一次的保存状态？",
                callback: function (action) {
                    if(action == '还原') {
                        cacheLibMenu = [];
                        cacheRemoveLib = [];
                        gridster.remove_all_widgets();
                        if(cacheInitData.length) {
                            $.each(cacheInitData, function (index, item) {
                                ElementManage.addElementItem(item, true);
                            });
                        }
                    }
                    
                }
            });
        } else if (type === '4') {
            mini.showMessageBox({
                title: "提示",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", "清空"],
                customCls: "portal-tip",
                message: "当前设计的内容将被全部清空，可通过 <span style='color: #51a6ef'>[还原]</span> 功能，回复到最近一次保存状态。",
                callback: function (action) {
                    if (action == '清空') {
                    	$(cacheLibMenu).each(function(index, item) {
                            item.visible = false;
                            var other = JSON.parse(item.other);
                            other.visible = false;
                            item.other = JSON.stringify(other);
                        });
                        ElementManage.removeALl();
                        renderLibDom();
                    }
                }
            });
        }
    }

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

// 左侧面板
(function (win, $) {
    var $typesDetail = $('.types-detail', $sidebarPanel),
        // $panelBack = $('.panel-back', $sidebarPanel),
        $containerPanel = $('#container-panel'),
        
        $tempMoreMenu = $('#temp-more-menu'), // 模板更多菜单 
        $elListContainer = $('#element-list-container'), // 元件（模板）
        $libListContainer = $('#lib-list-container'), // 元件（仓库）
        $tempListContainer = $('#temp-list-container'), // 模板
        $gridBg = $('#grid-bg'); // 表格背景

    var //$cacheLibLi = '', // 缓存仓库模板节点
        $cacheTempLi = ''; // 缓存模板节点

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
            // $templateLists.siblings('.active').removeClass('active').find('.template-list,.element-list').slideUp();
        })
        // 切换左侧栏目
        .on('click', '.type', function () {
            var $this = $(this),
                type = $this.data('ref');

            $this.addClass('active').siblings('.active').removeClass('active');
            $('.' + type + '-detail', $sidebarPanel).removeClass('hidden').siblings().addClass('hidden');

            if ($typesDetail.css('display') === 'none') {
                fixedPanel(true);
            }
        })
        // 收起左侧展开的面板
        .on('click', '.panel-back', function () {
            if(!expand) {
                $('.icon-page').addClass('active');
            }
            togglePanel(!expand);

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
            
            setEleVisible({
                libId: info.id,
                visible: !visible,
                callback: function () {
                    $li.toggleClass('active');
                    var _index = getLibIndex(info.id);
                    var otherData = JSON.parse(cacheLibMenu[_index].other);
                    otherData.visible = !visible;
                    cacheLibMenu[_index].other = JSON.stringify(otherData);
                    // var itemData = JSON.parse(info.other);
                    // itemData.visible = !visible;
                    // cacheLibMenu[_index].other = JSON.stringify(itemData);
                    
                    if(visible) {
                        
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

            menuPosition($this, $libMoreMenu);
        })
        // 点击模板更多按钮
        .on('click', '.temp-more', function (e) {
            var $this = $(this),
                $li = $this.parent();

            $cacheTempLi = $li;

            var liData =  $li.data();


            // 缓存模板的数据
            $tempMoreMenu.data('info', liData)
            if(liData.publicId) {
                $tempMoreMenu.find('.public-item').text('取消公开');
            } else {
                $tempMoreMenu.find('.public-item').text('公开模板');
            }
            menuPosition($this, $tempMoreMenu);
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
                    
                    // var tableData = param.options.data || [];
                    // $(cacheLibMenu).each(function(index, item) {
                    //     item.visible = false;
                    //     var other = JSON.parse(item.other);
                    //     other.visible = false;
                    //     item.other = JSON.stringify(other);
                    // });
                    
                    // gridster.remove_all_widgets();
                    // if(tableData.length) {
                    //     $.each(tableData, function (index, item) {
                    //         ElementManage.addElementItem(item, true);
                    //     });
                    // }

                } else if (param.type == 'close') {
                    // TODO
                }
            }, {
                // width: "1000",
                // height: "80%",
                param: {

                }
            });

        })
        // 元件-模板搜索值改变
        .on('input propertychange', '#ele-search', function () {
            var $this = $(this),
                searchVal = $this.val();


            renderEleDom(searchVal);
            $('.element-list').slideDown();

        })
        // 元件-仓库搜索值改变
        .on('input propertychange', '#lib-search', function () {
            var $this = $(this),
                searchVal = $this.val();
            
            renderLibDom(searchVal);
        })
        // 模板搜索值改变
        .on('input propertychange', '#temp-search', function () {
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
            }).done(function(data) {
                cacheLibMenu = [];
                // $(cacheLibMenu).each(function(index, item) {
                //     item.visible = false;
                //     var other = JSON.parse(item.other);
                //     other.visible = false;
                //     item.other = JSON.stringify(other);
                // });
    
                var tableData = data.tableData;
                gridster.remove_all_widgets();
                $.each(tableData, function (index, item) {
                    ElementManage.addElementItem(item, true);
                });
            })
        }


    // 页面操作
    var $pageNumber = $('#page-number');
    // 宽度
    win.widthChange = function (e) {
        widthType(e.value);
    }

    win.widthValueChange = function(e) {
        
        $paintingArea.css('width', e.value + 'px');
        resetBaseDimensions();
    };

    win.widthPercentChange = function(e) {
        

        $paintingArea.css('width', e.value + '%');
        resetBaseDimensions();
    };

    win.widthType = function(value) {
        $pageNumber[value == 2 ? 'removeClass' : 'addClass']('percent');
        if(value == 2) {
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

    // 门户操控
    // 元件拖动
   /*  win.eleMoveChange = function (e) {
        
        
    }
    // 元件显隐
    win.eleShowChange = function (e) {
        
        
    }
    // 元件缩放
    win.eleScaleChange = function (e) {
        
        
    }
 */

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

    // 仓库更多菜单事件
    $libMoreMenu.on('click', '.menu-item', function () {
        var $this = $(this),
            ref = $this.data('ref');

        var infoData = $libMoreMenu.data('info');

        var _index = getLibIndex(infoData.id);
        var libData = JSON.parse(cacheLibMenu[_index].other);
        
        if (ref == 'delete') {
            mini.showMessageBox({
                title: "提示",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", "确定"],
                customCls: "portal-tip",
                message: "确定要删除仓库中的元件" + '<span class="text-blue">' + libData.title + '</span>' + "吗？",
                callback: function (action) {
                    if (action == '确定') {
                        delEleLib({
                            libId: libData.id,
                            callback: function () {
                                ElementManage.removeElement($('#element-' + libData.id));
                                var _index = getLibIndex(libData.id);
                                cacheLibMenu.splice(_index, 1);
                                resetCacheLibMenu();
                            }
                        })
                    }
                }
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
                columnId: libData.other.column.columnId
            });
        }
        
        $libMoreMenu.hide();
    });

    var tempHtmlContent = document.getElementById("tempRename"),
        $tempName = $('#temp-name');

    var findTemplateItem = function(id) {
        for(var i = 0, len = cacheTempResource.length; i < len; i++) {
            if(id == cacheTempResource[i].id) {
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


        if (ref == 'delete') {
            mini.showMessageBox({
                title: "删除模板",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", "确定"],
                customCls: "portal-tip",
                message: "确定要删除模板" + '<span class="text-blue">' + libData.name + '</span>' + "吗？",
                callback: function (action) {
                    
                    if (action == '确定') {
                        delTemplate({
                            id: libData.id,
                            callback: function () {
                                $(cacheTempResource).each(function(index, item) {
                                    if(item.id == libData.publicId ) {
                                        cacheTempResource.splice(index, 1);
                                    }
                                });

                                $(cacheTempResource).each(function(index, item) {
                                    if( item.publicId == libData.publicId) {
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
                    }
                }
            });
        } else if (ref == 'public') {
            var flag = libData.publicId ? true : false;
            var txt = flag ? '取消公开，其他用户不可见？' : '设为公开，对其他用户可见？';
            var btnTxt = flag ? '确定' : '公开';
            mini.showMessageBox({
                title: flag ? '取消公开模板':"公开模板",
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

                                var str = '<li class="l template-item-box" id="template-item-'+newId+'" data-id="'+newId+'" data-name="'+libData.name+'">'+
                                            '<div class="template-item">'+
                                                '<div class="temp-item-img"><img src="./css/images/icon_public.png" alt="">'+
                                                '</div>'+
                                                '<p class="temp-item-text">'+libData.name+'</p>'+
                                            '</div>'+
                                        '</li>';

                                $('#temlate-list-public').append(str);

                                cacheTempResource.push({
                                    id: newId,
                                    img: '',
                                    name: libData.name,
                                    "public": true, // 是否公开模板
                                    "publicId": ""
                                });

                                $(cacheTempResource).each(function(index, item) {
                                    if( item.id == libData.id) {
                                        item.publicId = newId;
                                    }
                                });

                                setCacheTempMenu();
                            }
                        })
                    }

                    if(action == '确定') {
                        
                        publicTemplate({
                            id: libData.id,
                            public: false,
                            callback: function (data) {

                                $('#template-item-' + libData.publicId).remove();
                                $('#template-item-search-' + libData.publicId).remove();
                               
                                $(cacheTempResource).each(function(index, item) {
                                    if( item.id == libData.publicId) {
                                        cacheTempResource.splice(index,1);
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
            tempHtmlContent.style.display = "";
            $tempName.val(libData.name);

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
                    // alert(action);
                    
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
                            id: libData.id,
                            name: name,
                            callback: function () {
                                // $tempMoreMenu.data('name', name);
                                $(cacheTempResource).each(function(index, item) {
                                    if(item.id == libData.id || item.publicId == libData.publicId) {
                                        item.name = name;
                                    }
                                });

                                setCacheTempMenu();

                                $cacheTempLi.find('.temp-item-text').text(name);
                                $cacheTempLi.data("name", name);
                                if(libData.publicId) {
                                    $('#template-item-' + libData.publicId).find('.temp-item-text').text(name);
                                    $('#template-item-search-' + libData.publicId).find('.temp-item-text').text(name);
                                }
                                
                            }
                        })
                    }
                    
                }
            });
        } else if (ref == 'edit') {
            // alert('编辑')
            win.open('./edit?tempGuid=' + libData.id + '&title=' + libData.name);
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
            if($main.hasClass('fix-flag')) {
                $('.types-detail').hide();
                $('.type').removeClass('active');
            }
        }
    });

    // 隐藏/显示 左侧面板
    function togglePanel(flag) {
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
    }

    function fixedPanel() {
        $typesDetail.fadeIn(200);
        $main.addClass('fix-flag');
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
                ElementManage.getAndAddElement(dataInfo);
            }
            
        },
        zIndex: 10000,
        appendTo: 'body'
    };

    // 获取元件模板数据
    var getElData = function () {
        Util.ajax({
            url: portalConfig.getEleDataUrl,
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
                })
            });
            elementItemDom = Mustache.render(ELEMENT_ITEM_SEARCH_TPL, {
                list: list || []
            });
            if (empty) {
                elementItemDom = '<li class="no-result">暂无数据</>'
            }

        } else {
            elementItemDom = Mustache.render(ELEMENT_ITEM_TPL, {
                list: cacheEleMenu || []
            });

        }
        $elListContainer.html(elementItemDom)
        // 加载后初始化拖拽事件
        $('.drag-item').draggable(tplDragCfg);
    }

    getElData();

    /* -------- 加载元件（模板） end ---------- */

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
            } else {
                $libNum.text('');
            }

        }
        $libListContainer.html(elementItemDom);
        // 加载后初始化拖拽事件
        $('.drag-item').draggable(tplDragCfg);
    }

    win.getLibIndex = function(id) {
        var _index = -1;
        $(cacheLibMenu).each(function(index, item) {
            if(item.id == id) {
                _index = index;
            }
        });
        return _index;
    }

    // getLibData();


    // 设置元件仓库模板可见性
    var setEleVisible = function (opt) {
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
    };

    // 删除仓库，同删除元件
    win.delEleLib = function (opt) {
        var libId = opt.libId,
            callback = opt.callback,
            _index = cacheRemoveLib.indexOf(libId);

        // 理论上不会有同一个删两次的情况，但是还是加个判断，还原时，需要把 cacheRemoveLib 置为 []
        if(_index < 0) {
            cacheRemoveLib.push(libId);
        }
        
        if (typeof callback == 'function') {
            callback();
        }
    }

    win.removeAllLib = function() {
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
        var arr = [
            {
                id: "public",
                name: "公开模板",
                items: []
            }, {
                id: "my",
                name: "个人模板",
                items: []
            }
        ]
        $(data).each(function(index, item) {
            if(item.public) {
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
            var settingUrl = './child/eleedit'
            if(opt.info.manageUrl) {
                settingUrl = Util.getRightUrl(opt.info.manageUrl);
            }
            if(settingUrl.indexOf('?') > -1) {
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
                        // 设置元件中无以下参数
                    };

                    // 设置元件中的数据
                    var setOption = param.options.attr;

                    var newOption = $.extend({}, gridOption, setOption);
                    
                    if(!$('#element-' + opt.id).length) {
                        newOption.visible = false;
                        ElementManage.addElementItem(newOption, true)
                        return;
                    }

                    ElementManage.removeElement($('#element-' + opt.id), function() {
                        // 添加进去
                        ElementManage.addElementItem(newOption, true)
                    });
                     

                } else if (param.type == 'close') {
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
        create: function (opt) {
            epoint.openDialog('创建元件副本', './child/createele?title=' + opt.title + '&id=' + opt.id + '&columnId=' + opt.columnId, function (param) {
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

// 右侧背景
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
            min_size: [4, 4],
            start: function (e, ui, $widget) {
                $widget.addClass('elem-in-drag');
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
            var dataInfo = $w[0].dataset;
            var result = $.extend({}, {} ,{
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

    win.resetCacheLibMenu = function() {
        var _widgetList = ElementManage.getData();

        var widgetIds = []; // 右侧元件中的数据
        $(_widgetList).each(function(index, item) {
            widgetIds.push(item.id);
            $(cacheLibMenu).each(function(i, el) {
                if(el.id === item.id) {
                    el.sizex  = item.sizex;
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
            if(!data.manageUrl) {
                data.manageUrl = '';
            }
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
                    gridster.add_widget(html, data.sizex || 4, data.sizey || 4, '','',[MAX_COLSPAN, MAX_ROWSPAN], [MIN_COLSPAN, MIN_ROWSPAN]);                
                }
            }
        }
        
        var _index = getLibIndex(data.id);
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
        if(data.countUrl) {
            countUrl = data.countUrl;
        } else if(data.column) {
            if(data.column.countUrl) {
                countUrl = data.column.countUrl;
            }
        }

        renderElementBody({
            id: data.id, // 元件ID
            isDiy: data.isDiy, // 是否自定义，自定义的则 url 为iframe 地址
            url: data.url, // 加载列表的接口，或者iframe地址
            countUrl: countUrl // 获取子栏目数量的接口
        })
        
    };

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

    var getAndAddElement = function (opt) {
        
        if (sessionStorage.showTip) {
            // 本次设计不再提示
            createEle(opt);
        } else {
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
        }
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
                type: "portal",
                id: opt.id,
                title: opt.name,
                sizex: opt.sizex,
                sizey: opt.sizey,
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
    }

    // 对外开放的属性和方法
    win.ElementManage = {
        // 初始化后的gridster对象
        _gridster: gridster,
        // init: init,
        getAndAddElement: getAndAddElement,
        // addElement: addElements,
        addElementItem: addElementItem,
        addCacheElement: addCacheElement,
        removeElement: removeElement,
        removeALl: removeAll,
        removeBound: removeBound,
        getData: function () {
            // return gridster.serialize();
            return gridster.serialize();// checkData(sortByRowCol(dealData(gridster.serialize())));
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
            mini.showMessageBox({
                title: "提示",
                iconCls: "mini-messagebox-question",
                buttons: ["取消", "确定"],
                customCls: "portal-tip",
                message: "确定要删除元件" + '<span class="text-blue">' + info.title + '</span>' + "吗？",
                callback: function (action) {
                    if(action == '确定') {

                        delEleLib({
                            libId: info.id,
                            callback: function () {
                                ElementManage.removeElement($('#element-' + info.id));
                                var _index = getLibIndex(info.id);
                                cacheLibMenu.splice(_index, 1);
                                resetCacheLibMenu();
                            }
                        })

                    }
                    
                }
            });
        }

    });

})(window, jQuery);
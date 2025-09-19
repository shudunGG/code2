(function (win, $) {
    var COLUMN_TPL = $.trim($("#column-element-tpl").html());

    var $column = mini.get('column'),
        $url = mini.get('columnUrl'),
        $diy = mini.get('diy'),
        $columnContainer = $('#column-container'),
        $columnMoreMenu = $('#column-more-menu'),
        
        $titleHeader = $('#title-header'),
        $eleName = $('#ele-name'),
        $eleStyle = $('#ele-style'),
        $attrAdd = $('#attr-add'),
        $attrMore = $('#attr-more'),
        $visible = mini.get('visible'),
        $iconColor = mini.get('iconColor'),
        $titleColor = mini.get('titleColor'),
        $titleBgColor = mini.get('titleBgColor'),
        $cacheLi = '',
        query = Util.getUrlParams(),
        eleTitle = decodeURIComponent(query.title),
        eleId = query.id,
        iconNum = '',
        $sortList = $('#sort-list'),

        $maxStart = mini.get('maxStart'),
        $maxEnd = mini.get('maxEnd'),
        $minStart = mini.get('minStart'),
        $minEnd = mini.get('minEnd');
    
    var isDiyContent = '',
	cacheShowCount = '';

    function allowEdit(flag) {
        $maxStart.setEnabled(flag);
        $maxEnd.setEnabled(flag);
        $minStart.setEnabled(flag);
        $minEnd.setEnabled(flag);
    }

    $eleName.text(eleTitle);

    eleEvent.initPage({
        callback: function (data) {
            // 初始化控件
            mini.get('title').setValue(eleTitle);

            allowEdit(!data.allowEdit || false);
            
            isDiyContent = data.isDiy;
            
            cacheShowCount = mini.get('showTitleCount').checked;
            
            $('.tab-column')[data.column.columnUrl ? 'removeClass' : 'addClass']('new')

            $diy.setValue(data.column.isDiy);
            
            if(data.isDiy || $diy.checked) {
                mini.get('showTitleCount').setValue(false);
                mini.get('showTitleCount').hide();
            }
            
            if (data.column.isDiy) {
                $url.setVisible(true);
                $column.setVisible(false);
                $url.setValue(data.column.columnUrl);
                $columnContainer.addClass('hide-column');
            } else {
                $url.setVisible(false);
                $column.setVisible(true);
                $column.setValue(data.column.columnId);
                $columnContainer.removeClass('hide-column');
            }

            manageThemeStyle(mini.get('themeCheck').checked);

            var $iconSet = $('#icon-set');
            $iconSet.removeClass().addClass('l icon-set mr-5').css({
                "background": "transparent"
            });

            var iconValue = mini.get('icon').value;
            if (iconValue) {
                var iconUrl = '';
                if (isNaN(+iconValue)) {
                    iconUrl = Util.getRightUrl(iconValue);
                    $iconSet.css({
                        "background": "url(" + iconUrl + ") no-repeat center"
                    }).removeClass('icon-none');
                } else {
                    // 数字
                    $iconSet.addClass('modicon-' + iconValue).removeClass('icon-none');
                }
            } else {
                $('#icon-set').css({
                    "background": "none"
                }).addClass('icon-none');
            }

            if (mini.get('showAddBtn').checked) {
                $attrAdd.removeClass('hidden');
            }

            if (mini.get('showMoreBtn').checked) {
                $attrMore.removeClass('hidden');
            }
            renderChildColumn(data.column.columnItems);
        }
    })
    // epoint.initPage('elementeditaction', '', function (data) {

    // });

    /* -------- 加载数据来源 ---------- */

    function getColumns() {
        Util.ajax({
            url: portalConfig.getColumns
        }).done(function (data) {
            $column.setData(data.columns);
        });
    }

    getColumns();

    /* -------- 加载数据来源 end ---------- */

    // 随主题换肤
    win.themeChange = function (e) {
        manageThemeStyle(e.sender.checked);
    };

    // 随主题换肤 开启/ 关闭
    function manageThemeStyle(flag) {
        if (flag) {
            $eleStyle.addClass('hidden');
            $titleColor.setVisible(false);
            $titleBgColor.setVisible(false);
            $iconColor.setVisible(false);
        } else {
            $eleStyle.removeClass('hidden');
            $titleColor.setVisible(true);
            $titleBgColor.setVisible(true);
            $iconColor.setVisible(true);
        }
    }


    // 功能选择-新增
    win.addChange = function (e) {
        var value = e.value;
        if (value == 'true') {
            $attrAdd.removeClass('hidden');
        } else {
            // mini.get('addUrl').setValue('');
            $attrAdd.addClass('hidden');
        }
    };

    // 功能选择-更多
    win.moreChange = function (e) {
        var value = e.value;
        if (value == 'true') {
            $attrMore.removeClass('hidden');
        } else {
            // mini.get('moreUrl').setValue('');
            $attrMore.addClass('hidden');
        }
    };

    // 自定义数据来源
    win.onDiyChange = function (e) {
        if (this.getChecked()) {
            $columnContainer.addClass('hide-column');
            $column.setVisible(false);
            $url.setVisible(true);
            mini.get('showTitleCount').setValue(false);
            mini.get('showTitleCount').hide();
        } else {
            $columnContainer.removeClass('hide-column')
            $column.setVisible(true);
            $url.setVisible(false);
            if(!isDiyContent) {
				mini.get('showTitleCount').setValue(cacheShowCount);
				mini.get('showTitleCount').show();
			}
        }
    }

    win.save = function () {
    	var maxStart = $maxStart.getValue(),
    	maxEnd = $maxEnd.getValue(),
    	minStart = $minStart.getValue(),
    	minEnd = $minEnd.getValue();
    	if (maxStart < minStart || maxEnd < minEnd) {
    		epoint.showTips("最大/最小宽高不符合要求，请重新设置", {
				state : "warning"
			});
            return;
        }
    	
        var isDiy = $diy.checked;
        // 获取数据来源的信息
        if(!isDiy){
        	var selectColumn = $column.getSelected();
            var url = '', // 数据来源地址
                id = '',
                name = '',
                countUrl = '';

            if (selectColumn && selectColumn.id) {
                url = selectColumn.url;
                id = selectColumn.id;
                name = selectColumn.name;
                countUrl = selectColumn.countUrl;
            }
        } else {
            url = $url.value;
        }
        // 获取数据来源的信息 end
        
        var childUrl = "";  

        if (!url) {
            epoint.showTips('数据来源不能为空', {
				state : "warning"
			});
            return;
        }

        var columnItems = [];

        if ($sortList.html()) {
            var childColumnData = getChildColumnData();

            columnItems = childColumnData.columnItems;

            childUrl = childColumnData.defaultUrl;

        }

        if (childUrl) {
            url = childUrl;
        }

        var otherData = JSON.stringify({
            columnItems: columnItems,
            columnId: id,
            columnName: name,
            columnUrl: url,
            countUrl: countUrl,
            isDiy: isDiy
            // visible: $eleName.hasClass('active') // 元件-仓库是否可见
        });

        var bindData = JSON.parse(epoint.getCommonDtoData().commonDto),
            attrData = {
                titleIcon: iconNum
            };


        var convertArr = ['showRefreshBtn', 'showAddBtn', 'showHeader', 'showMoreBtn', 'themeCheck',
            'visible','showTitleCount'
        ];

        $(bindData).each(function (index, item) {
            if (convertArr.indexOf(item.id) > -1) {
                item.value = item.value == 'true' ? true : false;
            }
            attrData[item.id] = item.value;
        });

        attrData['visible'] = $titleHeader.hasClass('active');
        attrData['column'] = JSON.parse(otherData);
        
        epoint.execute('elementSave', '@all', [otherData], function (data) {
            // if (data.msg) {
            // epoint.alert(data.msg);
            // }
            attrData.countUrl = countUrl;
            epoint.closeDialog({
                type: 'ok',
                options: {
                    attr: attrData
                }
            });
        }); 
    }

    win.cancle = function () {
        epoint.closeDialog({
            type: 'close'
        });

    }

    // 渲染子标签
    function renderChildColumn(list) {
        var str = '';
        $(list).each(function (index, item) {
            var defaultStr = item.default ? 'default' : '';
            str += Mustache.render(COLUMN_TPL, item);
        });

        $sortList.html(str);
    }

    $('body')
        .on('click', '.change-confirm', function () {
            var type = $('.type-business').hasClass('hidden') ? '1' : '2';
            if (type == 1) {
                // 选项
                var optionName = mini.get('optionName').value;

                epoint.closeDialog({
                    type: 'ok',
                    options: {
                        name: optionName
                    }
                });
            } else {

                // 业务
                var businessName = mini.get('businessName').value;

                epoint.closeDialog({
                    type: 'ok',
                    options: {
                        name: businessName
                    }
                });

            }
        })
        .on('click', '.tab-item', function () {
            var $this = $(this),
                ref = $this.data('ref');
            $this.addClass('active').siblings('.active').removeClass('active');
            $('#' + ref + '-container').removeClass('hidden').siblings().addClass('hidden');
        })
        .on('click', '.lib-more', function () {
            var $this = $(this),
                $li = $this.parent();

            $cacheLi = $li;

            // 缓存仓库的数据
            $columnMoreMenu.data('info', $li.data())

            menuPosition($this, $columnMoreMenu);
        })
        .on('click', '#icon-set', function () {
            var $this = $(this);
            var currentIcon = mini.get('icon').value;

            epoint.openTopDialog('图标设置', './icons?icon=' + currentIcon + '&elementGuid=' + eleId,
                function (param) {
                    if (param.type == 'ok') {
                        iconNum = param.options.num;
                        // $this.removeClass().addClass('l icon-set mr-5
						// modicon-' + iconNum)
                        $this.removeClass().addClass('l icon-set mr-5').css({
                            "background": "transparent"
                        });
                        if (typeof iconNum == 'string') {
                            if(iconNum) {
                              $this.css({
                                  "background": "url(" + Util.getRightUrl(iconNum) +
                                      ") #f5f6f9 no-repeat"
                              }).removeClass('icon-none');
                            } else {
                              $this.css({
                                  "background": "transparent"
                              }).addClass('icon-none');
                            }
                        } else {
                            if (!iconNum) {
                                $this.css({
                                    "background": "transparent"
                                }).addClass('icon-none');
                            } else {
                                $this.addClass('modicon-' + iconNum).removeClass('icon-none');
                            }
                        }

                        mini.get('icon').setValue(iconNum);
                        
                    } else if (param == 'close') {
                    }
                }, {
                    width: "500",
                    height: "494",
                    param: {

                    }
                });
        })
        .on('click', '.add-child-column', function () {
            var selectColumn = $column.getSelected();

            if (!selectColumn) {
                epoint.showTips('请先选择数据来源', {
    				state : "warning"
    			});
                return;
            }
            epoint.openTopDialog('子标签设置', './childcolumn?parentColumnguid=' + selectColumn.id,
                function (param) {
                    if (param.type == 'ok') {
                        addChildColumn(param.options);

                    } else if (param == 'close') {
                    }
                }, {
                    width: "415",
                    height: "394",
                    param: {


                    }
                });
        })
        .on('click', '.icon-eye', function () {
            var $this = $(this),
                $title = $this.parent();

            $title.toggleClass('active');

            if ($title.hasClass('active')) {
                $visible.setValue(true);
            } else {
                $visible.setValue(false);
            }
        });

    $sortList.sortable();



    // 添加子标签
    function addChildColumn(data) {
        $sortList.append(Mustache.render(COLUMN_TPL, data));
    }

    // 获取子标签数据
    function getChildColumnData() {
        var columnData = [];
        var defaultUrl = "";
        var $columnItems = $('.column-item', $sortList);
        var length = $columnItems.length;
        $columnItems.each(function (index, item) {
            var data = $(item).data();
            var hasDefault = $(item).hasClass('default');
            columnData.push($.extend({}, {
                sort: length - index,
                default: hasDefault
            }, {
                id: data.id,
                isDiy: data.isDiy,
                name: data.name,
                showNum: data.showNum,
                url: data.url,
                showRefreshBtn: data.showRefreshBtn,
                showAddBtn: data.showAddBtn,
                showMoreBtn: data.showMoreBtn,
                moreUrl: data.moreUrl,
                addUrl: data.addUrl
            }));

            if (hasDefault) {
                defaultUrl = data.url
            }

        });

        return {
            columnItems: columnData,
            defaultUrl: defaultUrl
        };
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

    $columnMoreMenu.on('click', '.menu-item', function () {
        var $this = $(this),
            ref = $this.data('ref');

        if (ref == 'edit') {
            var selectColumn = $column.getSelected();

            if (!selectColumn) {
            	 epoint.showTips('请先选择数据来源', {
     				state : "warning"
     			});
                return;
            }

            epoint.openTopDialog('子设置', './childcolumn?parentColumnguid=' + selectColumn.id,
                function (param) {
                    if (param.type == 'ok') {
                        var childData = param.options;
                        $cacheLi.attr({
                            "data-show-num": childData.showNum,
                            'data-name': childData.name,
                            'data-is-diy': childData.isDiy,
                            'data-url': childData.url,
                            'data-id': childData.id,
                            'data-show-refresh': childData.showRefreshBtn,
                            'data-show-add': childData.showAddBtn,
                            'data-show-more': childData.showMoreBtn,
                            'data-more-url': childData.moreUrl,
                            'data-add-url': childData.addUrl
                        });
                        $cacheLi.find('.column-item-name').text(childData.name);
                        $cacheLi.data({
                            isDiy: childData.isDiy,
                            name: childData.name,
                            showNum: childData.showNum,
                            url: childData.url,
                            id: childData.id,
                            showRefreshBtn: childData.showRefreshBtn,
                            showAddBtn: childData.showAddBtn,
                            showMoreBtn: childData.showMoreBtn,
                            moreUrl: childData.moreUrl,
                            addUrl: childData.addUrl
                        })

                    } else if (param == 'close') {
                    }
                }, {
                    width: "415",
                    height: "394",
                    param: $columnMoreMenu.data('info')
                });
        } else if (ref == 'default') {
            $cacheLi.addClass('default').siblings('.default').removeClass('default');

        } else if (ref == 'delete') {
            $cacheLi.remove();
        }
        $columnMoreMenu.hide();
    });

    // 点击其他地方隐藏更多菜单
    $('body').on('click', function (e) {
        if (!$(e.target).closest('.menu-item, .lib-more, .more-menu').length) {
            $columnMoreMenu.hide();
        }
    });


})(window, jQuery);
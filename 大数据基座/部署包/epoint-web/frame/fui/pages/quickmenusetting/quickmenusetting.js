(function (win, $) {

    // 最大可选的数目
    var MAX_COUNT = 50;
    var MENU_ITEM_TPL = Util.clearHtml($('#menu-item-tpl').html()),
        MENU_SELECTED_ITEM_TPL = Util.clearHtml($('#menu-selected-item-tpl').html());

    var $qm = $('#qm'),
        $filterInput = $qm.find('#qm-filter-input'),
        $menu = $('#qm-menu'),
        $menuList = $('.qm-menu-list', $menu),
        $menuSearchList = $qm.find('.qm-menu-search-list'),
        $selectedMenu = $('#qm-selected'),
        $selectedMenuList = $('.qm-menu-selected-list', $selectedMenu),
        $selectedCount = $('#qm-menu-selected-count'),
        $selectedCountMax = $('#qm-selected-count-all');

    $selectedCountMax.text(MAX_COUNT);

    var qmState = mini.get('qm-state'),
        $qmStateText = $('#qm-state-text');

    function switchUsingRate(open) {
        if (open) {
            $qm.addClass('using-rate');
            qmState.setValue(true);
            $qmStateText.text('已开启');
            $filterInput.addClass('disabled').prop('disabled', true);
        } else {
            $qm.removeClass('using-rate');
            qmState.setValue(false);
            $qmStateText.text('已关闭');
            $filterInput.removeClass('disabled').prop('disabled', false);
        }
    }
    qmState.on('valueChanged', function () {
        switchUsingRate(qmState.getValue() == 'true');
    });

    // 所有菜单数据
    var menuData = [],
        // 菜单列表类型数据、用于检索
        menuList = [],
        // 用户已选的菜单
        selectedMenu = [];

    var origin_type = true,
        origin_selected = [];

    var _ANIMATION_TIME_ = {
        slide: 200
    };
    var slideDownCb = function () {
        $(this).attr('style', 'display: block;');
    };

    var slideUpCb = function () {
        $(this).attr('style', 'display: none;');
    };

    function getAllMenu() {
        return Util.ajax({
            url: window.getCommonMenuUrl,
            data: {
            	showNum: MAX_COUNT
            }
        }).done(function (data) {
            var type = data.type;
            menuData = data.menu;
            data.userSelected = data.userSelected || [];

            dealData(menuData, data.userSelected);
            initMenuView(menuData);

            var isUsingRate = type == 'using-rate';
            switchUsingRate(isUsingRate);

            initSelectedMenu(data.userSelected);
            $selectedCount.text(selectedMenu.length || 0);

            origin_type = isUsingRate;
            origin_selected = data.userSelected;
        });
    }
    getAllMenu();

    // 处理菜单数据  
    // 1、加入到扁平数组 用于搜索
    // 2、处理菜单是否可被选择
    // 3、获取菜单是否已经被选择
    function dealData(data, selectedArr) {
        $.each(data, function (i, item) {
            if (!item.icon) item.icon = 'modicon-1';
            if (!item.iconBackColor) item.iconBackColor = randomColor(i);

            // (item.items && item.items.length && Math.random() > .5) && (item.url = null);

            if (item.url) {
                item.allowSelect = true;
                menuList.push(item);
            } else {
                item.allowSelect = false;
            }
            // 当前菜单是否是选中的
            if ($.inArray(item.code, selectedArr) !== -1) {
                item.selected = true;
                selectedMenu.push(item);
            } else {
                item.selected = false;
            }

            // 递归子分类
            if (item.items) {
                dealData(item.items, selectedArr);
            }
        });
    }

    function randomColor(index) {
        var colors = ['#3391e5', '#58cece', '#f16caa', '#7d9459', '#298aae', '#58cece', '#ffce3d', '#fe5d58', '#3391e5', '#f16caa'];

        return colors[index % 10];
    }

    function getRowKey(rowkey, i) {
        return rowkey === undefined ? i + '' : rowkey + '-' + i;
    }
    // 缩进值
    var INDENT_INIT = 10,
        INDENT_STEP = 26;

    // 获取节点缩进值
    function getIndent(rowkey, len) {
        //分割成数组判断长度
        len = len || rowkey.split('-').length;
        // if (len < 2) {
        //     return 0;
        // }
        return INDENT_INIT + (len - 1) * INDENT_STEP;
    }
    /**
     * 构建左侧菜单的详情html
     *
     * @param {Array} data 菜单数据
     * @param {String} rowkey 父节点rowkey
     * @returns 渲染完成的html字符串
     */
    function buildMenuHTML(data, rowkey) {
        var html = '';

        $.each(data, function (i, item) {
            var view = item;
            view.hasSub = !!(item.items && item.items.length);
            view.rowkey = getRowKey(rowkey, i);

            var len = view.rowkey.split('-').length;
            view.isTop = len === 1;
            view.level = 'level-' + len;
            view.indent = getIndent(view.rowkey, len);

            if (view.isTop) {
                view.bg = item.iconBackColor || randomColor(i);
            }

            if (len === 1) {
                view.icon = view.icon || 'modicon-1';
            }

            if (view.hasSub) {
                html += Mustache.render(MENU_ITEM_TPL, $.extend(view, {
                    subMenu: buildMenuHTML(item.items, view.rowkey)
                }));
            } else {
                html += Mustache.render(MENU_ITEM_TPL, view);
            }
        });
        return html;
    }

    function initMenuView(data) {
        var html = buildMenuHTML(data);
        $menuList.empty().append(html);
    }

    function initEvent() {
        $menu
            .on('click', '.qm-menu-trigger', function (ev) {
                var $link = $(this).closest('.qm-menu-link'),
                    hasSub = $link.data('hassub'),
                    opened = $link.hasClass('opened');
                if (hasSub) {
                    var $subMenu = $link.next();
                    if (!opened) {
                        $link.addClass('opened');
                        $subMenu.stop(true).slideDown(_ANIMATION_TIME_.slide, slideDownCb);
                    } else {
                        $link.removeClass('opened');
                        $subMenu.stop(true).slideUp(_ANIMATION_TIME_.slide, slideUpCb);
                    }
                }
                ev.stopPropagation();
            })
            // .on('click', '.qm-menu-link', function () {
            .on('click', '.qm-menu-name,.qm-menu-checkbox,.qm-menu-icon', function () {
                var $this = $(this).closest('.qm-menu-link'),
                    enable = !$this.hasClass('unable'),
                    selected = $this.hasClass('mini-checkbox-checked'),
                    id = $this.data('id');
                if (!enable || $qm.hasClass('using-rate')) return;

                // $this[selected ? 'removeClass' : 'addClass']('mini-checkbox-checked');
                if (!selected) {
                    addMenu(id);
                } else {
                    removeMenu(id);
                }
            });
        // 右侧已选点击删除
        $selectedMenuList.on('click', '.qm-menu-selected-remove', function () {
            var $item = $(this).closest('.qm-menu-selected-item'),
                id = $item.data('id');

            removeMenu(id, $item);
        });

        var timer;
        $filterInput.on('keyup', function (e) {
            clearTimeout(timer);
            timer = setTimeout(doSearch, 100);
            if (e.which == 13) {
                doSearch();
            }
        });

        function doSearch() {
            var v = $.trim($filterInput[0].value);
            if (!v) {
                $menuSearchList.addClass('hidden');
                $menuList.removeClass('hidden');
                return;
            }

            var result = [];
            var reg = new RegExp(v, 'i');
            $.each(menuList, function (i, item) {
                if (reg.test(item.name)) {
                    result.push(item);
                }
            });

            renderSearch(result);
        }

        function renderSearch(data) {
            var html = [];

            $.each(data, function (i, item) {
                var view = $.extend(true, {}, item);
                view.hasSub = false;
                view.isTop = true;
                view.level = 'level-1';
                view.rowkey = getRowKey(undefined, i);
                view.indent = getIndent(view.rowkey);
                view.bg = item.iconBackColor || randomColor(i);
                // view.icon = item.icon || 'modicon-1';
                // view.allowSelect = item.allowSelect;

                html.push(Mustache.render(MENU_ITEM_TPL, view));
            });

            if (Util.browsers.isIE8 || Util.browsers.isIE9) {
                $menuSearchList.empty().removeClass('hidden');
            }

            $(html.join('')).appendTo($menuSearchList.empty());
            $menuSearchList.removeClass('hidden empty');
            $menuList.addClass('hidden');
            if (!data.length) {
                $menuSearchList.addClass('empty');
            }
        }
    }
    initEvent();

    /**
     * 初始化渲染已选部分
     *
     * @param {Array} sort 后端返回的已选的菜单id数组
     */
    function initSelectedMenu(sort) {
        // 按照目标顺序排序
        var arr = [];
        $.each(sort, function (i, id) {
            // 如果当前位置不等 则查找 插入到当前位置
            var aimIdx = -1;
            var aim = $.grep(selectedMenu, function (item, idx) {
                if (item.code == id) {
                    aimIdx = idx;
                    return true;
                }
                return false;
            });
            if (aimIdx != -1) {
                selectedMenu.splice(aimIdx, 1);
                arr.push(aim[0]);
            }

        });
        selectedMenu = arr;

        var html = [];
        $.each(selectedMenu, function (i, item) {
            html.push(Mustache.render(MENU_SELECTED_ITEM_TPL, item));
        });

        $(html.join('')).appendTo($selectedMenuList.empty());
        initSort();
    }

    function initSort() {
        $selectedMenuList.sortable({
            revert: 200,
            delay: 50,
            distance: 5,
            forcePlaceholderSize: true,
            containment: 'parent',
            tolerance: 'pointer',
        });
    }

    // 新增一个已选菜单
    function addMenu(id) {
        if (parseInt($selectedCount.text(), 10) >= MAX_COUNT) {
            return epoint.alert('最多只能选择' + MAX_COUNT + '个！');
        }


        var item = findMenu(menuList, id);
        if (!item) {
            return;
        }

        $menu.find('.qm-menu-link[data-id="' + id + '"]').addClass('mini-checkbox-checked');
        item.selected = true;

        selectedMenu.push(item);
        $selectedCount.text(selectedMenu.length);

        $(Mustache.render(MENU_SELECTED_ITEM_TPL, item)).appendTo($selectedMenuList);

    }
    // 移除一个已选菜单
    function removeMenu(id, $elRight) {
        var item = findMenu(menuList, id);
        if (item) {
            item.selected = false;
        }

        $menu.find('.qm-menu-link[data-id="' + id + '"]').removeClass('mini-checkbox-checked');
        ($elRight || $selectedMenuList.find('.qm-menu-selected-item[data-id="' + id + '"]')).remove();

        $.each(selectedMenu, function (i, it) {
            if (it.code == id) {
                selectedMenu.splice(i, 1);
                return false;
            }
        });
        $selectedCount.text(selectedMenu.length);
    }

    /**
     * 查找目标菜单
     *
     * @param {Array} list 扁平菜单数据的缓存
     * @param {String} id 目标菜单id
     * @returns 
     */
    function findMenu(list, id) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].code == id) {
                return list[i];
            }
        }
    }


    function save(callback) {
        var isUsingRate = qmState.getValue() == 'true';
        var newSelected = $selectedMenuList.sortable('toArray', {
            attribute: 'data-id'
        });
        var data = {};
        // 系统推挤
        if (isUsingRate) {
            // 之前也是 则不保存 直接关闭
            if (origin_type == true) {
                return callback(false);
            }
            // 否则更新type即可
            data.type = 'using-rate';

        } else {
            // 新的是配置的  不管之前是什么状态都需要检查已选是否变化

            // 之前也是配置 且 数据未变 则不保存
            if (!origin_type && origin_selected.join(',') == newSelected.join(',')) {
                return callback(false);
            }

            data.type = 'user-setting';
            data.userSelected = JSON.stringify(newSelected);
        }
        return _save(data, callback);
    }

    function _save(data, callback) {
        return Util.ajax({
            url: window.saveCommonMenuUrl,
            data: data
        }).done(function () {
            try {
                top.epoint.showTips('保存成功', {state:'success'});
            } catch (error) {}
            callback(true);
            sendMessageToQmElement();
        });
    }

    mini.get('qm-save').on('click', function () {
        save(function (isChanged) {
            epoint.closeDialog(isChanged);
        });
    });

    $('#qm-cancel').click(function () {
        epoint.closeDialog(false);
    });

    // 查找 ifr 发送快捷菜单数据更改的通知
    function sendMessageToQmElement() {
        var data = JSON.stringify({
            type: 'quickMenuChanged'
        });
        $.each(findIfr(win.top), function (i, ifr) {
            ifr.contentWindow.postMessage(data, '*');
        });

        function findIfr(startWindow) {
            var ifrArr = [];
            try {
                var ifrCollections = startWindow.document.getElementsByTagName('iframe'),
                    ifrs = [].slice.call(ifrCollections);
                // 直接找到的放入
                ifrArr = ifrArr.concat(ifrs);

                // 遍历递归iframe内部的
                $.each(ifrs, function (i, ifr) {
                    ifrArr = ifrArr.concat(findIfr(ifr.contentWindow));
                });
                return ifrArr;
            } catch (err) {}
            return [];
        }
    }
})(this, this.jQuery);
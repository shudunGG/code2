// 常用应用配置
(function (win, $) {

    var isMetro = Util.getUrlParams('themeId') === 'metro';
    var genderSvgHtml = (function () {
        if (!isMetro) {
            return function (icon) {
                return '<img src="' + Util.getRightUrl(icon) + '" class="qa-item-icon" alt="">';
            };
        }
        if (Util.browsers.isIE8) {
            return function (icon) {
                return '<img src="' + Util.getRightUrl('frame/fui/pages/themes/metro/images/app/' + icon + '.png') + '" class="qa-item-icon" alt="">';
            };
        }

        $.ajax({
            url: Util.getRightUrl('frame/fui/pages/themes/metro//images/app/svg.svg'),
            dataType: 'html',
            async: false,
            success: function (data) {
                $('<div hidden class="hidden"></div>').append(data).appendTo('body');
            }
        });
        return function (icon) {
            return '<svg class="qa-item-icon"><use xlink:href="#metro-app-icon-' + icon + '"></use></svg>';
        };

    })();

    var MAX_COUNT = 10;

    var APP_TPL = Util.clearHtml($('#app-item-tpl').html());

    var $qa = $('#qa'),
        $filterInput = $qa.find('#qa-filter-input'),
        $appsContainer = $('#qa-app'),
        $allAppList = $('.qa-app-list', $appsContainer),
        $appSearchList = $qa.find('.qa-app-search-list'),
        $selectedApp = $('#qa-selected'),
        $selectedAppList = $('.qa-app-selected-list', $selectedApp),
        $selectedCount = $('#qa-app-selected-count'),
        $selectedCountMax = $('#qa-selected-count-all');

    $selectedCountMax.text(MAX_COUNT);

    var qaState = mini.get('qa-state'),
        $qaStateText = $('#qa-state-text');

    function switchUsingRate(open) {
        if (open) {
            $qa.addClass('using-rate');
            qaState.setValue(true);
            $qaStateText.text('已开启');
            $filterInput.addClass('disabled').prop('disabled', true);
        } else {
            $qa.removeClass('using-rate');
            qaState.setValue(false);
            $qaStateText.text('已关闭');
            $filterInput.removeClass('disabled').prop('disabled', false);
        }
    }
    qaState.on('valueChanged', function () {
        switchUsingRate(qaState.getValue() == 'true');
    });

    // 所有app数据
    var appList = [],
        appsMap = {},
        // 用户已选的app
        userSelectedIds = [],
        userSelectedApps = [];

    var origin_type = true,
        origin_selected = [];

    function getQuickAppCfg() {
        return Util.ajax({
            url: window.getQuickAppCfgUrl
        }).done(function (data) {
            var type = data.type;
            var isUsingRate = type == 'using-rate';
            origin_type = isUsingRate;
            origin_selected = JSON.parse(JSON.stringify(data.userSelected));
            switchUsingRate(isUsingRate);

            userSelectedIds = data.userSelected || [];
            $selectedCount.text(userSelectedIds.length || 0);

            initAppList(data.appList, userSelectedIds);
            initSelectedAppList(appsMap, userSelectedIds);
            Util.hidePageLoading();
        });
    }
    getQuickAppCfg();

    /**
     * 渲染所有应用的列表
     *
     * @param {Array} list 应用数据列表
     * @param {string []} selectedArr  已选应用ID 集合
     */
    function initAppList(list, selectedArr) {
        appsMap = {};
        appList = [];
        var html = [];
        $.each(list, function (i, category) {
            html.push('<div class="qa-app-category clearfix"><h3><span class="qa-app-category-toggle"></span>' + category.name + '</h3><div class="qa-app-sub-list clearfix">');
            $.each(category.apps, function (i, item) {
                if (item.icon) {
                    item.icon = genderSvgHtml(item.icon, item.bgcolor);
                }

                item.isMetro = isMetro;
                item.selected = $.inArray(item.id, selectedArr) !== -1;
                html.push(Mustache.render(APP_TPL, item));

                // 缓存数据
                appList.push(item);
                appsMap[item.id] = item;
            });
            html.push('</div></div>');
        });

        $(html.join('')).appendTo($allAppList.empty());
    }

    /**
     * 渲染已选应用的列表
     *
     * @param {object} allApps 应用列表 map
     * @param {string []} selectedArr  已选应用ID 集合
     */
    function initSelectedAppList(allApps, selectedArr) {
        var html = [];
        userSelectedApps = getSelectedApps();
        $.each(userSelectedApps, function (i, item) {
            html.push(Mustache.render(APP_TPL, item));
        });
        $(html.join('')).appendTo($selectedAppList.empty());
        initSort();

        function getSelectedApps() {
            return $.map(selectedArr, function (key) {
                return allApps[key];
            });
        }
    }

    function initSort() {
        $selectedAppList.sortable({
            revert: 200,
            delay: 50,
            distance: 5,
            forcePlaceholderSize: true,
            containment: 'parent',
            tolerance: 'pointer',
        });
    }

    function addApp(id) {
        if (parseInt($selectedCount.text(), 10) >= MAX_COUNT) {
            return epoint.alert('最多只能选择' + MAX_COUNT + '个！');
        }

        var app = appsMap[id];
        if (!app) {
            return;
        }

        $qa.find('.qa-item[data-id="' + id + '"]').addClass('selected');
        app.selected = true;

        userSelectedApps.push(app);
        userSelectedIds.push(id);
        $selectedCount.text(userSelectedApps.length);

        $(Mustache.render(APP_TPL, app)).appendTo($selectedAppList);
    }

    function removeApp(id, $rightTarget) {
        var app = appsMap[id];
        if (!app) {
            return;
        }
        if ($rightTarget) {
            $rightTarget.remove();
        }

        $qa.find('.qa-item[data-id="' + id + '"]').removeClass('selected');
        app.selected = false;
        $.each(userSelectedApps, function (i, it) {
            if (it.id == id) {
                userSelectedApps.splice(i, 1);
                return false;
            }
        });
        $.each(userSelectedIds, function (i, it) {
            if (it == id) {
                userSelectedIds.splice(i, 1);
                return false;
            }
        });
        $selectedCount.text(userSelectedApps.length);
    }

    $appsContainer
        .on('click', '.qa-app-category > h3', function () {
            var $it = $(this).parent(),
                $block = $it.find('.qa-app-sub-list');
            if (!$it.hasClass('collapse')) {
                $it.addClass('collapse');
                $block.stop(true).slideUp(200);
            } else {
                $it.removeClass('collapse');
                $block.stop(true).slideDown(200);
            }
        }).on('click', '.qa-item', function () {
            if ($qa.hasClass('using-rate')) return;

            var $this = $(this),
                selected = $this.hasClass('selected'),
                id = $this.data('id');
            if (!selected) {
                addApp(id);
            } else {
                removeApp(id, $selectedAppList.find('.qa-item[data-id="' + id + '"]'));
            }
        });
    // 右侧点击删除
    $selectedAppList.on('click', '.qa-item-remove', function () {
        var $it = $(this).parent(),
            id = $it.data('id');
        removeApp(id, $it);
    });

    // search
    var timer;
    $filterInput.on('keyup', function (e) {
        clearTimeout(timer);
        timer = setTimeout(doSearch, 100);
        if (e.which == 13) {
            doSearch();
        }
    });

    function doSearch() {
        var v = $.trim($filterInput.val());
        if (!v) {
            $appSearchList.addClass('hidden');
            $allAppList.removeClass('hidden');
            return;
        }
        var res = [];
        var reg = new RegExp(v, 'i');
        $.each(appList, function (i, app) {
            if (reg.test(app.name)) {
                var item = JSON.parse(JSON.stringify(app));
                item.name = app.name.replace(reg, '<span class="kw fui-theme-main-color">' + v + '</span>');
                res.push(item);
            }
        });
        renderSearch(res);
    }

    function renderSearch(data) {
        var html = [];

        $.each(data, function (i, app) {
            html.push(Mustache.render(APP_TPL, app));
        });

        if (Util.browsers.isIE8 || Util.browsers.isIE9) {
            $appSearchList.empty().removeClass('hidden');
        }

        $(html.join('')).appendTo($appSearchList.empty());
        $appSearchList.removeClass('hidden empty');
        $allAppList.addClass('hidden');
        if (!data.length) {
            $appSearchList.addClass('empty');
        }
    }

    function save(callback) {
        var isUsingRate = qaState.getValue() == 'true';
        var newSelected = $selectedAppList.sortable('toArray', {
            attribute: 'data-id'
        });
        var data = {};
        // 系统推荐
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
        var d = $.extend(Util.getUrlParams(), data);
        return Util.ajax({
            url: window.saveQuickAppCfgUrl,
            data: d
        }).done(function () {
            try {
                top.epoint.showTips('保存成功', {
                    state: 'success'
                });
            } catch (error) {}
            callback(true);
        });
    }

    mini.get('qa-save').on('click', function () {
        // save(function (isChanged) {
        //     epoint.closeDialog(isChanged);
        // });
        save(epoint.closeDialog);
    });

    $('#qa-cancel').click(function () {
        epoint.closeDialog(false);
    });
}(this, jQuery));
(function (win, $) {
    var $tabNav = $('#tabNav'),
        $navHd = $('.fui-tabnav-hd', $tabNav),
        $navHdList = $('.fui-tabnav-main', $navHd),
        $topNavWrap = $navHdList.parent(),
        $navBd = $('.fui-tabnav-bd', $tabNav),
        $subNavWrap = $('.fui-navlist-wrap', $navBd),
        $iframeCon = $('#mainContent'),
        $iframe = $('#content-iframe', $iframeCon);

    var $topSrcollBtns = $('.nav-scroll-btns', $navHd),
        $subScrollBtns = $('.nav-scroll-btns', $navBd),
        $subScroll_left = $subScrollBtns.find('.scroll-left'),
        $subScroll_right = $subScrollBtns.find('.scroll-right');

    var $activeSub;

    var setPageUrl = function (url) {
        $iframe[0].src = Util.getRightUrl(url);
    };

    var M = Mustache,
        itemTempl = $.trim($('#tabnav-item-templ').html()),
        subItemTempl = $.trim($('#tabnav-subitem-templ').html());

    var renderSubNavs = function (data) {
        return M.render(subItemTempl, data);
    };

    var renderNavs = function (data) {
        var topHtml = [],
            subHtml = [];

        $.each(data, function (i, nav) {

            // 有子菜单先渲染子菜单
            if (nav.items && nav.items.length) {
                var data = {
                    items: nav.items
                };

                // 通过target和id来关联子父菜单
                nav.target = data.id = 'sub_' + nav.code;

                subHtml.push(renderSubNavs(data));
            }

            topHtml.push(M.render(itemTempl, nav));
        });

        $navHdList.html(Util.clearHtml(topHtml.join('')));
        $subNavWrap.html(Util.clearHtml(subHtml.join('')));
    };

    // 初始化菜单
    var initNav = function (data) {
        // 渲染菜单项
        renderNavs(data);

        // 设置了defaultUrl则直接显示defaultUrl页面
        if (TabNav.defaultUrl) {
            setPageUrl(TabNav.defaultUrl);
        } else {
            $navHdList.find('.fui-tabnav-item').eq(0).trigger('click');
        }
    };

    // 获取菜单数据
    var getNavData = function () {
        var params = $.extend({
            query: 'init-tabNav'
        }, TabNav.params);

        return Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: Util.getRightUrl(TabNav.loadUrl),
            data: params,
            error: Util._ajaxErr
        }).done(function (data) {
            if (data) {
                initNav(data);
                adjustLimitWidth();
                adjustTopVisible();
            }
        });
    };
    var topNavWidth,
        subNavWidths = {};

    var topNavWidthLimit = 0,
        subNavWidthLimit = 0;

    // 可滚动的距离
    var top_scroll_width = 0,
        sub_scroll_width = 0,
        STEP_WIDTH = 100;

    // 获取列表宽度 ul为列表dom gap为每个li的之间的间距
    var getWidth = function (ul, gap) {
        gap = gap || 0;
        var width = 0;
        $(ul).find('li').each(function (i, item) {
            width += $(item).outerWidth() + gap;
        });
        return width - gap;
    };

    // 计算列表限制宽度 resize时更新
    var adjustLimitWidth = function () {
        topNavWidthLimit = $topNavWrap.width();
        subNavWidthLimit = $subNavWrap.width();
    };

    // 按钮可见调整
    var adjustTopVisible = function () {
        // 顶级菜单
        if (!topNavWidth) {
            topNavWidth = getWidth($navHdList, 12);
        }
        top_scroll_width = topNavWidth - topNavWidthLimit;

        if (top_scroll_width > 0) {
            $topSrcollBtns.removeClass('invisible');
        } else {
            $topSrcollBtns.addClass('invisible');
            $navHdList.stop(true).css('margin-left', 0);
            $topSrcollBtns.find('.scroll-left').addClass('disabled')
                .next().removeClass('disabled');
        }
    };
    var adjustSubVisible = function ($sub) {
        $sub = $sub || $subNavWrap.find('.fui-tabnav-sub.active');

        if (!$sub || !$sub.length) {
            return;
        }

        var id = $sub[0].id;

        subNavWidths[id] = subNavWidths[id] || getWidth($sub);
        subNavWidthLimit = subNavWidthLimit || $subNavWrap.width();

        sub_scroll_width = subNavWidths[id] - subNavWidthLimit;

        if (subNavWidths[id] > subNavWidthLimit) {
            $subScrollBtns.removeClass('invisible');
            var ml = -parseInt($navHdList.css('margin-left'), 10);
            if (ml === 0) {
                // 最左时 禁用左侧
                $subScroll_left.addClass('disabled');
                $subScroll_right.removeClass('disabled');
            } else if (ml >= sub_scroll_width) {
                // 最右时 禁用右侧
                $subScroll_right.addClass('disabled');
                $subScroll_left.removeClass('disabled');
            } else {
                $subScroll_right.removeClass('disabled');
                $subScroll_left.removeClass('disabled');
            }
        } else {
            $subScrollBtns.addClass('invisible');
            $sub.stop(true).css('margin-left', 0);
        }
    };

    $(win).on('resize', function () {
        adjustLimitWidth();
        adjustTopVisible();
        adjustSubVisible();
    });


    // 顶级菜单点击事件
    $navHd
        .on('click', '.fui-tabnav-item', function (e) {
            e.preventDefault();

            var $el = $(this),
                $a = $el.find('.fui-tabnav-link'),
                target = $a.data('target');

            if (!$el.hasClass('active')) {
                // 高亮当前项
                var $sibling = $el.addClass('active').siblings('.active').removeClass('active');

                // Force IE8 redraw :before/:after pseudo element
                Util.redrawPseudoEl($a.find('> .fui-tabnav-icon')[0]);
                Util.redrawPseudoEl($sibling.find('> .fui-tabnav-link > .fui-tabnav-icon')[0]);

                // 有二级菜单，默认显示二级菜单的第一个选项对应的页面
                if (target) {
                    var $sub = $('#' + target);
                    // 显示对应二级菜单
                    $sub.addClass('active')
                        .siblings()
                        .removeClass('active');


                    $navBd.removeClass('hidden');
                    $iframeCon.addClass('shrinked');

                    $activeSub = $sub;
                    adjustSubVisible($sub);

                    $sub.find('.fui-tabnav-item').eq(0).trigger('click');

                    // 没有二级菜单，显示自身对应的页面
                } else {
                    $navBd.addClass('hidden');
                    $iframeCon.removeClass('shrinked');

                    var url = $a.data('url');
                    setPageUrl(url);
                }
            }
        })
        .on('click', '.scroll-left', function () {
            var $this = $(this),
                ml = -parseInt($navHdList.css('margin-left')),
                //  最多滚到0
                range = Math.min(STEP_WIDTH, ml);

            if (ml < 0) {
                return;
            }
            $this.next().removeClass('disabled');
            $navHdList.stop(true).animate({
                marginLeft: '+=' + range + 'px'
            }, function () {
                // 移动到最左后禁止
                if (range == ml) {
                    $this.addClass('disabled');
                }
            });
        })
        .on('click', '.scroll-right', function () {
            var $this = $(this),
                ml = -parseInt($navHdList.css('margin-left'), 10),
                // 最大到可滚动的位置
                temp = top_scroll_width - ml,
                range = Math.min(STEP_WIDTH, temp);

            if (ml >= top_scroll_width) {
                return;
            }

            $this.prev().removeClass('disabled');
            $navHdList.stop(true).animate({
                marginLeft: '-=' + range + 'px'
            }, function () {
                // 移动到最右后禁止
                if (range == temp) {
                    $this.addClass('disabled');
                }
            });
        });
    // 子菜单的点击滚动
    $subScrollBtns
        .on('click', '.scroll-left', function () {
            if (!$activeSub || !$activeSub.length) {
                return;
            }
            var $this = $(this),
                ml = -parseInt($activeSub.css('margin-left')),
                //  最多滚到0
                range = Math.min(STEP_WIDTH, ml);
            if (ml < 0) {
                return;
            }
            $this.next().removeClass('disabled');
            $activeSub.stop(true).animate({
                marginLeft: '+=' + range + 'px'
            }, function () {
                // 移动到最左后禁止
                if (range == ml) {
                    $this.addClass('disabled');
                }
            });
        })
        .on('click', '.scroll-right', function () {
            if (!$activeSub || !$activeSub.length) {
                return;
            }
            var $this = $(this),
                ml = -parseInt($activeSub.css('margin-left'), 10),
                // 最大到可滚动的位置
                temp = sub_scroll_width - ml,
                range = Math.min(STEP_WIDTH, temp);
            if (ml >= sub_scroll_width) {
                return;
            }

            $this.prev().removeClass('disabled');
            $activeSub.stop(true).animate({
                marginLeft: '-=' + range + 'px'
            }, function () {
                // 移动到最右后禁止
                if (range == temp) {
                    $this.addClass('disabled');
                }
            });
        });

    // 二级菜单点击事件
    $navBd.on('click', '.fui-tabnav-item', function (e) {
        e.preventDefault();

        var $el = $(this),
            url = $el.find('.fui-tabnav-link').data('url');

        $el.addClass('active')
            .siblings()
            .removeClass('active');

        setPageUrl(url);
    });

    // domReady时获取节点数据
    $(getNavData);

}(this, jQuery));
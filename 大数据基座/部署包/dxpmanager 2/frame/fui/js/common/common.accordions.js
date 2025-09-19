(function (win, $) {
    var $accsWrap = $('.fui-accordions'),
        $fuiContent = $('.fui-content');

    var $accNav,
        $accReturn,
        $scrollEl;

    if (!$accsWrap.length) return;

    var getOrder = function (order) {
        if (order < 10) {
            order = '0' + order;
        }
        return order;
    };

    var showNav = $fuiContent.length > 0 && $accsWrap.attr('showNav');

    if(showNav === undefined) {
        showNav = Util.getFrameSysParam('showAccordionsNav');
    } else {
        showNav = showNav === "true";
    }

    var getAccHdHtml = function (order, title) {
        var html = [];

        html.push('<span class="fui-acc-order">' + getOrder(order) + '</span>');
        html.push('<i class="fui-acc-toggle"></i>');
        html.push('<h4 class="fui-acc-title">' + title + '</h4>');

        return html.join('');
    };

    var getNavItemHtml = function (id, title) {
        return '<li class="acc-menu-item" data-ref="' + id + '" title="' + title + '">' + title + '</li>';
    };

    var getNavHtml = function (itemHtml) {
        var html = [];

        html.push('<div class="fui-acc-menu">');
        html.push('<ul class="acc-menu-list">');
        html.push(itemHtml);
        html.push('</ul>');
        html.push('</div>');

        return html.join('');
    };

    var scroll = function (el) {

        var id = el.data("ref"),

            $accItem = $('#' + id);

        if ($scrollEl.length) {
            // var scrollTop = $accItem.offset().top + $scrollEl.scrollTop() - $scrollEl.offset().top;

            // if (Util.browsers.isIE) {
            //     $scrollEl.animate({
            //         scrollTop: scrollTop
            //     }, 500);
            // }else {
            //     $scrollEl[0].scrollTop = scrollTop;
            // }
            scrollTopTo($accItem[0].offsetTop);
            
        }

        el.addClass('active').siblings().removeClass('active');
    };

    var scrollTopTo = (function () {
        if (Util.browsers.isIE) {
            return function (scrollTop) {
                $scrollEl.stop(true).animate({
                    scrollTop: scrollTop
                }, 500);
            };
        }
        return function (scrollTop) {
            $scrollEl[0].scrollTop = scrollTop;
        };
    }());

    // 设置导航的位置
    var setNavPos = function () {
        var scrollContainerWidth = $('.fui-content').width(),
            accWrapWidth = $accsWrap.outerWidth();

        var right = (scrollContainerWidth - accWrapWidth) / 2;

        // 避免导航区域遮住滚动条
        if (right < 17) {
            right = 17;
        }

        if (showNav) {
            $accNav.css('right', right);
            $accReturn.css('right', right);
        }
    };

    var adjustNavDisplay = function(){
        if(!showNav) {
            return;
        }
        var len = $accsWrap.find('[role="accordion"]').filter(function(){
            return !$(this).hasClass('hidden');
        }).length;

        if(len > 2) {
            $accsWrap.addClass('shownav');
            $accNav.removeClass('hidden');
            $accReturn.removeClass('hidden');
        } else {
            $accsWrap.removeClass('shownav');
            $accNav.addClass('hidden');
            $accReturn.addClass('hidden');
        }
    };

    // 解析手风琴html结构
    var parse = function () {
        var $accs = $accsWrap.find('[role="accordion"]'),
            len = $accs.length,
            navHtml = [];

        $.each($accs, function (i, acc) {
            var $acc = $(acc),
                $hd = $acc.find('[role="head"]'),
                $bd = $acc.find('[role="body"]');

            var opened = $acc.attr('opened') !== 'false',
                title = $hd.attr('title');

            $acc.addClass('fui-accordion');
            $hd.addClass('fui-acc-hd');
            $bd.addClass('fui-acc-bd');

            opened ? $acc.addClass('opened') : $acc.addClass('closed');
            opened ? $bd.show() : $bd.hide();

            // 填充head默认内容
            $(getAccHdHtml((i + 1), title)).prependTo($hd);
            var id;
            // 配置个性化的手风琴 且 没有配置showNav
            if (showNav) {
                id = acc.id ? acc.id : (acc.id = 'accordion_' + i);

                navHtml.push(getNavItemHtml(id, title));
            }
        });

        if (showNav) {
            $accNav = $(getNavHtml(navHtml.join('')));
            $accNav.appendTo(document.body);
            // 返回顶部按钮
            $accReturn = $("<div class='fui-acc-return' title='返回顶部' style='display:none;'></div>").appendTo(document.body);

            $accsWrap.addClass('shownav');
            $accNav.find('.acc-menu-item').eq(0).addClass('active');

            $accNav.css('top', $accsWrap.find('.fui-accordion').eq(0).offset().top);
            setNavPos();

            adjustNavDisplay();
        }
    };

    $accsWrap.on('click', '.fui-acc-toggle', function () {
        var $el = $(this),
            $acc = $el.closest('.fui-accordion'),
            opened = $acc.hasClass('opened'),
            ontoggle = $acc.attr('ontoggle');

        $acc.toggleClass('closed', opened)
            .toggleClass('opened', !opened);
        $acc.find('>.fui-acc-bd').stop(true)[opened ? 'slideUp': 'slideDown'](200);

        if (ontoggle && win[ontoggle]) {
            win[ontoggle](opened ? 'closed' : 'opened');
        }
    });

    var timer;
    // 默认滚动区域为fui-content，滚动时激活对应导航item
    $fuiContent.on('scroll', function (event) {
        var $items = $(".fui-accordion:not(.hidden)"),
            $navItems = $(".acc-menu-item:not(.hidden)");

        clearTimeout(timer);

        timer = setTimeout(function () {
            $items.each(function (i, el) {
                var top = $(el).offset().top;

                if (top >= 0) {
                    $navItems.eq(i).addClass('active')
                        .siblings().removeClass('active');

                    return false;
                }
            });
            var top = $items.eq(0).offset().top;
            if (showNav) {
                if (top <= -100) {
                    $accReturn.show();
                } else {
                    $accReturn.hide();
                }
            }
        }, 200);

    });

    $(win).on('resize', function (e) {
        setNavPos();
    });

    if (showNav) {
        $('body').on('click', function (e) {
            var $target = $(e.target),
                ref = $target.data('ref');

            $scrollEl = $(Util.getFirstScrollEl($accsWrap.find('.fui-accordion')[0]));

            if ($target.closest($accNav).length) {
                if ($target.hasClass('acc-nav-trigger')) {
                    $accNav.toggleClass('active');
                } else if ($target.hasClass('acc-menu-item')) {
                    $('#' + ref).removeClass('closed').addClass('opened');
                    scroll($target);
                }
            } else {
                $accNav.removeClass('active');
            }

            if ($target.hasClass('fui-acc-return')) {
                // $scrollEl.animate({
                //     scrollTop: 0
                // }, 500);
                scrollTopTo(0);
            }

        });
    }

    Util.accordion = {
        _accs: $accsWrap.find('[role="accordion"]'),

        _accNavs: undefined,

        _accTpl: '<div role="accordion" class="fui-accordion {{status}}"><div class="fui-acc-hd" role="head" title="{{title}}"><span class="fui-acc-order">{{order}}</span><i class="fui-acc-toggle"></i><h4 class="fui-acc-title">{{title}}</h4></div><div class="fui-acc-bd" role="body"><iframe frameborder="0" width="100%" height="{{contentHeight}}" src="{{url}}"></iframe></div></div>',

        // 显示手风琴项
        showItem: function (index) {
            var $acc = this._accs.eq(index);

            if ($acc.length && $acc.hasClass('hidden')) {
                $acc.removeClass('hidden');
                this._updateOrders();
            }

            if (showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length && $navItem.hasClass('hidden')) {
                    $navItem.removeClass('hidden');
                }
                adjustNavDisplay();
                $fuiContent.trigger('scroll');
            }
        },

        // 隐藏手风琴项
        hideItem: function (index) {
            var $acc = this._accs.eq(index);

            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.addClass('hidden');
                this._updateOrders();
            }
            if (showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length && !$navItem.hasClass('hidden')) {
                    $navItem.addClass('hidden');
                }

                adjustNavDisplay();
                $fuiContent.trigger('scroll');
            }
        },
        hideNav: function() {
            if (showNav) {
                showNav = false;
                $accNav.addClass('hidden');
                $accReturn.addClass('hidden');
                $accsWrap.removeClass('shownav');
            }
        },

        // 展开手风琴
        expandItem: function (index) {
            var $acc = this._accs.eq(index);
            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.removeClass('closed').addClass('opened');
                $acc.find('>.fui-acc-bd').stop(true).slideDown(200);
            }
        },
        // 收起手风琴
        collapseItem: function (index) {
            var $acc = this._accs.eq(index);
            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.removeClass('opened').addClass('closed');
                $acc.find('>.fui-acc-bd').stop(true).slideUp(200);
            }
        },

        // 设置手风琴标题
        setTitle: function (title, index) {
            var $acc = this._accs.eq(index);
            if ($acc.length) {
                var $header = $acc.find('[role="head"]').attr('title', title);

                $header.find('.fui-acc-title').html(title);
            }

            if (showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length) {
                    $navItem.html(title).attr('title', title);
                }
            }
        },

        // 动态添加手风琴项
        addItem: function (title, url, opened, contentHeight) {
            var html = Mustache.render(this._accTpl, {
                title: title,
                url: url,
                status: opened ? "opened" : "closed",
                contentHeight: contentHeight || "100%"
            });

            $(html).appendTo($accsWrap);

            this._accs = $accsWrap.find('[role="accordion"]');

            this._updateOrders();

            if (showNav) {
                var index = this._accs.length - 1,
                    acc = this._accs[index],
                    id = acc.id ? acc.id : (acc.id = 'accordion_' + index);
                html = getNavItemHtml(id, title);

                $(html).appendTo($accNav.find('.acc-menu-list'));

                this._accNavs = $accNav.find('.acc-menu-item');

                adjustNavDisplay();
            }

        },

        // 显示|隐藏后需要更新下序号
        _updateOrders: function () {
            var order = 0;

            $.each(this._accs, function (i, acc) {
                var $acc = $(acc),
                    $order = $acc.find('.fui-acc-order');

                if (!$acc.hasClass('hidden')) {
                    $order.html(getOrder(++order));
                }
            });
        },

        _getAccNavs: function () {
            if (!this._accNavs) {
                this._accNavs = $accNav ? $accNav.find('.acc-menu-item') : undefined;
            }

            return this._accNavs;
        }
    };

    parse();

}(this, jQuery));
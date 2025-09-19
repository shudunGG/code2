/**
 * 应用实现
 */
(function name(win, $) {
    // 应用高度
    var APP_HEIGHT = 110;
    var APP_WIDTH = 100;
    // 分页高度
    var PAGE_WIDTH = 372;
    var PAGE_HEIGHT = 30;


    // 应用模板
    var APP_TPL = '<div class="qm-item" id="{{#isInstalled}}installed-{{/isInstalled}}{{^isInstalled}}qm-{{/isInstalled}}{{code}}" data-id="{{code}}"    title="{{name}}" data-url="{{url}}" data-hassub="{{hasSub}}" data-opentype="{{openType}}" style="width:{{WIDTH}}" title="{{name}}"><div class="qm-item-inner" style="background:{{iconBackColor}};"><span class="qm-item-icon {{icon}}"></span><span class="qm-item-name {{#mutiLine}}long{{/mutiLine}}">{{{shortName}}}</span></div>{{#hasSub}}<div class="sub-qm hidden" data-count="{{subCount}}"><h2 class="sub-qm-name">{{name}}</h2><div class="sub-qm-list">{{{subQms}}}</div></div>{{/hasSub}}</div>';

    var $main = $('#qm'),
        $myQms = $('#my-qm', $main);

    var APPS_HEIGHT = $myQms.height();

    var cache = null;
    /* global getQuickMenuUrl */
    function getQm() {
        return Util.ajax({
            url: getQuickMenuUrl
        }).done(function (data) {
            if (!data) {
                return;
            }
            cache = data;
            renderView(data);
        });
    }

    function renderView(data) {
        qmCache.removeAll();
        $(renderQms(data)).appendTo($myQms.empty());

        // 处理分页动画
        var $pages = $myQms.find('>.qm-pages-list'),
            pageCount = $pages.children().length;

        if (pageCount > 1) {
            $pages.width(100 * pageCount + '%');
        }
        // 处理弹出子应用滚动
        var $subs = $myQms.find('.sub-qm > .sub-qm-list');

        if ($subs.length) {
            try {
                if ($.fn.niceScroll) {
                    $subs.niceScroll({
                        cursorcolor: '#abccf2',
                        cursorborder: '1px solid #d5dee6',
                        cursorwidth: '3px'
                    });
                } else {
                    setTimeout(function () {
                        Util.loadJs('frame/fui/js/widgets/jquery.nicescroll.min.js', function () {
                            $subs.niceScroll({
                                cursorcolor: '#abccf2',
                                cursorborder: '1px solid #d5dee6',
                                cursorwidth: '3px'
                            });
                        });
                    }, 1000);
                }
            } catch (error) {
                console.err(error);
            }
        }
    }

    getQm();

    // 当收到快捷菜单改变的通知时 重新加载新数据
    $(win).on('message', function (ev) {
        var data = ev.originalEvent.data;
        if (data + '' === data) {
            try {
                data = JSON.parse(data);
                if (data.type == 'quickMenuChanged') {
                    getQm();
                }
            } catch (err) {}
        }
    });

    // 所有应用缓存
    var qmCache = {
        _data: {},
        get: function (id) {
            return this._data[id];
        },
        getKeys: function () {
            var arr = [];
            for (var key in this._data) {
                if (this._data.hasOwnProperty(key)) {
                    arr.push(key);
                }
            }
            return arr;
        },
        getKeysAsObj: function () {
            var obj = {};
            for (var key in this._data) {
                if (this._data.hasOwnProperty(key)) {
                    obj[key] = true;
                }
            }
            return obj;
        },
        set: function (item) {
            this._data[item.code] = item;
        },
        remove: function (id) {
            this._data[id] = null;
            delete this._data[id];
        },
        removeAll: function () {
            this._data = {};
        }
    };

    win.qmCache = qmCache;

    function randomColor(index) {
        if (index === undefined) {
            index = Math.random() * 100 >> 0;
        }
        var colors = ['#3391e5', '#58cece', '#f16caa', '#7d9459', '#298aae', '#58cece', '#ffce3d', '#fe5d58', '#3391e5', '#f16caa'];

        return colors[index % 10];
    }

    // 图标
    function fixedIcon(item) {
        item.icon = item.icon || 'modicon-114';
        if (!item.iconBackColor) item.iconBackColor = randomColor();
        return item;
    }
    // 文本长度截断
    function ellipsisText(item) {
        item.shortName = item.name.substr(0, 10);
        var len = item.shortName.length;
        if (len > 5) {
            var split = len / 2 >> 0;
            item.shortName = item.shortName.substr(0, split) + '<br/>' + item.shortName.substr(split);
            item.mutiLine = true;
        }
        return item;
    }
    // 一行显示的个数
    var LINE_COUNTS = ($myQms.width() / APP_WIDTH >> 0) || 3;
    var ADJUST_APP_WIDTH = (1000000 / LINE_COUNTS >> 0) / 10000 + '%';
    // 计算一页显示多少个
    function getSize(reservedHeight) {
        reservedHeight = reservedHeight || 0;
        return ((($myQms.height() - reservedHeight) / APP_HEIGHT >> 0) || 1) * LINE_COUNTS;
    }

    // 渲染应用
    function renderQms(data, isSub) {
        if (!data || !data.length) {
            return '';
        }

        // debugger;
        var len = data.length,
            isOver = len > getSize(),
            html = [];

        if (!isSub && isOver) {
            // 出现分页后 高度重新计算
            var pageSize = getSize(PAGE_HEIGHT),
                pages = Math.ceil(len / pageSize),
                page = 0,
                i = 0,
                pageHtml = ['<div class="qm-page-bar"><span class="qm-page-prev disabled"></span>'];

            // console.log(pageSize,pages);

            html.push('<div class="qm-pages-list clearfix">');
            while (page < pages) {
                html.push('<div class="qm-page-content l' + (page === 0 ? ' active' : '') + '" data-target="' + page + '" style="width:' + ((1000000 / pages >> 0) / 10000) + '%;">');
                for (; i < Math.min(len, (page + 1) * pageSize); i++) {
                    html.push(renderApp(data[i]));
                }
                html.push('</div>');

                pageHtml.push('<span class="qm-page-btn  ' + (page === 0 ? ' active' : '') + '" data-id="' + page + '">' + (page === 0 ? '1' : '') + '</span>');
                page++;
            }
            html.push('</div>');
            pageHtml.push('<span class="qm-page-next"></span></div>');

            return html.concat(pageHtml).join('');
        }
        $.each(data, function (i, item) {
            html.push(renderApp(item));
        });
        return html.join('');
    }
    // 渲染单个应用
    function renderApp(item) {
        item.hasSub = item.hasSub || (item.items && item.items.length);
        item.WIDTH = ADJUST_APP_WIDTH;
        if (item.hasSub) {
            item.subCount = item.items.length;
            item.subQms = renderQms(item.items, true);
        }
        qmCache.set(item);
        return Mustache.render(APP_TPL, ellipsisText(fixedIcon(item)));
    }

    function changePage($aimBtn) {
        var page = $aimBtn.data('id');
        $aimBtn.text(page + 1).addClass('active')
            .siblings('.active').text('').removeClass('active');

        var $pages = $myQms.find('.qm-pages-list'),
            $aimPage = $pages.find('[data-target="' + page + '"]')
        $aimPage.addClass('active')
            .siblings().removeClass('active');
        // $pages.css('margin-left', -PAGE_WIDTH * page);
        $pages.css('margin-left', (-100 * page) + '%');

        var $sib = $aimBtn.siblings(),
            $prev = $sib.filter('.qm-page-prev'),
            $next = $sib.filter('.qm-page-next');
        if ($aimBtn.prev('.qm-page-btn').length) {
            $prev.removeClass('disabled');
        } else {
            $prev.addClass('disabled');
        }

        if ($aimBtn.next('.qm-page-btn').length) {
            $next.removeClass('disabled');
        } else {
            $next.addClass('disabled');
        }

    }
    // 获取弹出的子应用容器的高度和宽度
    function getSubAppSize($sub) {
        return {
            width: 110 * LINE_COUNTS + 20,
            height: 130 * Math.ceil($sub.data('count') / LINE_COUNTS) + 40
        };
    }
    // 获取弹出的高度值
    function getSubAppsTop(h) {
        var dif = APPS_HEIGHT - h;
        if (dif < 0) return 0;

        return dif / 2;
    }

    function setSubAppsLeft(w) {
        return ($myQms.width() - w) / 2;
    }
    // 隐藏子应用
    function hideSubApps($sub) {
        $sub = $sub || $('.sub-qm');

        $sub.addClass('hidden')
            .attr('style', '');
        $main.removeClass('in-showsub');
    }

    $main
        // app内分页点击
        .on('click', '.qm-page-btn', function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                return;
            }

            changePage($this);
        })
        .on('click', '.qm-page-prev', function () {
            var $this = $(this);
            if ($this.hasClass('disabled')) return;
            changePage($this.siblings('.qm-page-btn.active').prev());
        })
        .on('click', '.qm-page-next', function () {
            var $this = $(this);
            if ($this.hasClass('disabled')) return;
            changePage($this.siblings('.qm-page-btn.active').next());
        })
        // 展开更多分类
        // .on('click', '.apps-tabview-header > .more-trigger', function (e) {
        //     e.stopPropagation();
        //     var $this = $(this).parent();

        //     $this.toggleClass('open');
        // })
        // 点击打开应用
        .on('click', '.sub-qm', function (e) {
            e.stopPropagation();
        })
        .on('click', '.qm-item', function (e) {
            e.stopPropagation();
            var $this = $(this),
                name = this.title,
                id = $this.data('id'),
                url = $this.data('url'),
                hasSub = $this.data('hassub'),
                openType = $this.data('opentype');
            if (hasSub) {
                $main.addClass('in-showsub');
                var $sub = $this.find('>.sub-qm');
                var pos = $this.position();
                var size = getSubAppSize($sub);
                $sub.css({
                    top: pos.top + (APP_HEIGHT / 2),
                    left: pos.left + (APP_WIDTH / 2),
                    height: size.height > APPS_HEIGHT ? APPS_HEIGHT : size.height,
                    width: size.width
                });
                setTimeout(function () {
                    $sub.addClass('trans');
                    $sub.css({
                        top: getSubAppsTop(size.height),
                        left: setSubAppsLeft(size.width),
                        '-webkit-transform': 'scale(1)',
                        '-moz-transform': 'scale(1)',
                        '-ms-transform': 'scale(1)',
                        '-o-transform': 'scale(1)',
                        'transform': 'scale(1)',
                    });
                    setTimeout(function () {
                        $sub.removeClass('trans');
                    }, 300);
                }, 0);
                return $sub.removeClass('hidden');
            }

            if (!url) return;

            if (openType === 'tabsnav') {
                try {
                    top.TabsNav.addTab({
                        id: id,
                        name: name,
                        url: url
                    });
                } catch (err) {
                    win.open(Util.getRightUrl(url));
                }
            } else if (openType === 'dialog') {
                epoint.openTopDialog(name, url);
            } else {
                win.open(Util.getRightUrl(url));
            }
            hideSubApps();
            // 打开应用后 移除蒙版
            // win.appPanel.hide();
        });
    // 空白处点击 隐藏更多分类
    // $('body').on('click', function (e) {
    //     var $tab = $tabBody.find('.apps-tabview-header.open');

    //     if ($tab.length && $tab.is(':visible') && !$(e.target).closest('.apps-tabview-header').length) {
    //         $tab.removeClass('open');
    //     }
    // });
    $('body').on('click', function (e) {
        if (!$(e.target).closest('.sub-qm').length && $main.hasClass('in-showsub')) {
            hideSubApps();
        }
    });
    var resizeTimer;
    $(win).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            LINE_COUNTS = ($myQms.width() / APP_WIDTH >> 0) || 3;
            ADJUST_APP_WIDTH = (1000000 / LINE_COUNTS >> 0) / 10000 + '%';
            APPS_HEIGHT = $myQms.height();
            cache &&  renderView(cache);
        }, 50);
    });

}(this, jQuery));
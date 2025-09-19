// 事件扩展
(function (win, $, Util) {
    if (typeof Util.UserEvent === 'function') return;

    // 实现一个自定义事件
    function UserEvent() {
        // 必须使用new命令
        if (!(this instanceof UserEvent)) return new UserEvent();
        this.events = {};
    }
    UserEvent.prototype = {
        constructor: UserEvent,
        on: function (type, fn) {
            if (!this.events[type]) {
                this.events[type] = [];
            }
            this.events[type].push(fn);
        },
        fire: function (type, data, context) {
            var eventArr = this.events[type];
            if (!eventArr || !eventArr.length) return;
            for (var i = 0, l = eventArr.length; i < l; ++i) {
                eventArr[i].call(context, {
                    type: type,
                    target: this,
                    data: data
                });
            }
        },
        off: function (type, fn) {
            var eventArr = this.events[type];
            if (!eventArr || !eventArr.length) return;

            if (!fn) {
                // eventArr = []; 错误代码！！！
                // eventArr 直接赋值为一个新数组就切断了原有的引用联系 实际的this.events[type];并未被改变！！ 应为：
                this.events[type] = eventArr = [];
            } else {
                // for (var i = 0, l = eventArr.length; i < l; ++i) {
                //     if (fn === eventArr[i]) {
                //         break;
                //         // 1、直接退出后 splice 不会被执行
                //         // 2、实际上可能存在一个事件绑定多次，并使用同一个处理函数的情况，并不能找到就直接一个就结束。
                //     }
                //     eventArr.splice(i, 1);
                // }
                for (var i = 0; i < eventArr.lenth; ++i) {
                    if (fn === eventArr[i]) {
                        eventArr.splice(i, 1);
                        // 1、找到后不能立即 break 肯存在一个事件一个函数绑定多次的情况
                        // 删除后数组改变，下一个仍然需要遍历处理！
                        --i;
                    }
                }
            }
        }
    };
    Util.UserEvent = UserEvent;
}(this, jQuery, window.Util || {}));

// 事件
window.graceEvent = new Util.UserEvent();
/**
 * 应用实现
 */
(function name(win, $) {
    // 应用高度
    var APP_HEIGHT = 120;
    var APP_WIDTH = 124;
    // 分页高度
    var PAGE_WIDTH = 372;
    var PAGE_HEIGHT = 50;


    // 应用模板
    var APP_TPL = '<div class="app-item" id="{{#isInstalled}}installed-{{/isInstalled}}{{^isInstalled}}app-{{/isInstalled}}{{code}}" data-id="{{code}}"    title="{{name}}" data-url="{{url}}" data-hassub="{{hasSub}}" data-opentype="{{openType}}" style="width:{{WIDTH}}" title="{{name}}"><img class="icon" src="{{icon}}" alt="{{name}}" /><span class="name {{#mutiLine}}long{{/mutiLine}}">{{{shortName}}}</span>{{#hasSub}}<div class="sub-apps hidden" data-count="{{subCount}}"><h2 class="sub-apps-name">{{name}}</h2><div class="sub-apps-list">{{{subApps}}}</div></div>{{/hasSub}}</div>';

    var $main = $('#left-panel'),
        $cover = $('.left-panel-cover', $main),
        $myApps = $('#my-apps');

    var APPS_HEIGHT = $myApps.height();

    /* global installedApp */
    function getInstalled() {
        return Util.ajax({
            url: installedApp.url,
            data: installedApp.data
        }).done(function (data) {
            if (!data || !data.sysList) {
                return;
            }
            appCache.removeAll();
            $('#left-panel-header-name').text(data.title);
            $(renderApps(data.sysList)).appendTo($myApps.empty());

            // 处理分页动画
            var $pages = $myApps.find('>.apps-pages-list'),
                pageCount = $pages.children().length;

            if (pageCount > 1) {
                // $pages.width(PAGE_WIDTH * pageCount);
                $pages.width(100 * pageCount + '%');
            }
            // 处理弹出子应用滚动
            var $subs = $myApps.find('.sub-apps > .sub-apps-list');

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
                            Util.loadJs('frame/fui/js/widgets/jquery.nicescroll.min.js',function () {
                                $subs.niceScroll({
                                    cursorcolor: '#abccf2',
                                    cursorborder: '1px solid #d5dee6',
                                    cursorwidth: '3px'
                                });
                            });
                        }, 1000);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });
    }

    getInstalled();

    // 所有应用缓存
    var appCache = {
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
        set: function (app) {
            this._data[app.code] = app;
        },
        remove: function (id) {
            this._data[id] = null;
            delete this._data[id];
        },
        removeAll: function () {
            this._data = {};
        }
    };

    win.appCache = appCache;

    // 图标路径处理
    function fixedPath(app) {
        app.icon = Util.getRightUrl(app.icon);
        return app;
    }
    // 文本长度截断
    function ellipsisText(app) {
        app.shortName = app.name.substr(0, 6);
        // app.shortName = app.name;
        app.mutiLine = app.name.length > 6 ? true : false;
        return app;
    }
    // 一行显示的个数
    var LINE_COUNTS = ($myApps.width() / APP_WIDTH >> 0) || 3;
    var ADJUST_APP_WIDTH = (1000000 / LINE_COUNTS >> 0 ) / 10000 + '%';
    // 计算一页显示多少个
    function getSize(reservedHeight) {
        reservedHeight = reservedHeight || 0;
        // return ((($myApps.innerHeight() - reservedHeight) / APP_HEIGHT >> 0) || 1) * 3;
        // return ((($myApps.height() - reservedHeight) / APP_HEIGHT >> 0) || 1) * 3;
        return ((($myApps.height() - reservedHeight) / APP_HEIGHT >> 0) || 1) * LINE_COUNTS;
    }

    // 渲染应用
    function renderApps(data, isSub) {
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
                pageHtml = ['<div class="apps-page-bar"><span class="apps-page-prev disabled"></span>'];
            
            // console.log(pageSize,pages);

            html.push('<div class="apps-pages-list clearfix">');
            while (page < pages) {
                html.push('<div class="apps-page-content l' + (page === 0 ? ' active' : '') + '" data-target="' + page + '" style="width:'+ (( 1000000 / pages >> 0 ) / 10000 )+'%;">');
                for (; i < Math.min(len, (page + 1) * pageSize); i++) {
                    html.push(renderApp(data[i]));
                }
                html.push('</div>');

                pageHtml.push('<span class="apps-page-btn  ' + (page === 0 ? ' active' : '') + '" data-id="' + page + '">' + (page === 0 ? '1' : '') + '</span>');
                page++;
            }
            html.push('</div>');
            pageHtml.push('<span class="apps-page-next"></span></div>');

            return html.concat(pageHtml).join('');
        }
        $.each(data, function (i, item) {
            html.push(renderApp(item));
        });
        return html.join('');
    }
    // 渲染单个应用
    function renderApp(app) {
        app.hasSub = app.hasSub || (app.items && app.items.length);
        app.WIDTH = ADJUST_APP_WIDTH;
        if (app.hasSub) {
            app.subCount = app.items.length;
            app.subApps = renderApps(app.items, true);
        }
        appCache.set(app);
        return Mustache.render(APP_TPL, ellipsisText(fixedPath(app)));
    }

    function changePage($aimBtn) {
        var page = $aimBtn.data('id');
        $aimBtn.text(page + 1).addClass('active')
            .siblings('.active').text('').removeClass('active');

        var $pages = $myApps.find('.apps-pages-list'),
            $aimPage = $pages.find('[data-target="' + page + '"]')
        $aimPage.addClass('active')
            .siblings().removeClass('active');
        // $pages.css('margin-left', -PAGE_WIDTH * page);
        $pages.css('margin-left', (-100 * page) + '%');

        var $sib = $aimBtn.siblings(),
            $prev = $sib.filter('.apps-page-prev'),
            $next = $sib.filter('.apps-page-next');
        if ($aimBtn.prev('.apps-page-btn').length) {
            $prev.removeClass('disabled');
        } else {
            $prev.addClass('disabled');
        }

        if ($aimBtn.next('.apps-page-btn').length) {
            $next.removeClass('disabled');
        } else {
            $next.addClass('disabled');
        }

    }
    // 获取弹出的子应用容器的高度和宽度
    function getSubAppSize($sub) {
        return {
            width: 110 * LINE_COUNTS + 20,
            height: 130 * Math.ceil($sub.data('count') / LINE_COUNTS) + 40};
    }
    // 获取弹出的高度值
    function getSubAppsTop(h) {
        var dif = APPS_HEIGHT - h;
        if (dif < 0) return 0;

        return dif / 2;
    }
    function setSubAppsLeft(w) {
        return ($myApps.width() - w )/2;
    }
    // 隐藏子应用
    function hideSubApps($sub) {
        $sub = $sub || $('.sub-apps');

        $sub.addClass('hidden')
            .attr('style', '');
        $main.removeClass('in-showsub');
    }

    $main
        // .on('click', '.left-panel-header-icon', function () {
        //     top.epoint.openTopDialog('应用配置', installedApp.manangeUrl, function () {
        //         // 配置更新后重新渲染新的应用
        //         getInstalled();
        //     });
        // })
        // // 配置 保存 取消
        // .on('click', '.tabview-header-btn', function () {
        //     var $this = $(this);
        //     if ($this.hasClass('settings')) {
        //         return appMange.init();
        //     }

        //     if ($this.hasClass('save')) {
        //         return appMange.save();
        //     }

        //     if ($this.hasClass('cancel')) {
        //         return appMange.cancel();
        //     }

        // })
        // 应用新增操作
        // .on('click', '.app-item > .add', function (e) {
        //     e.stopPropagation();
        //     appMange.add($(this).parent());
        // })
        // // 应用移除
        // .on('click', '.app-item > .remove', function (e) {
        //     e.stopPropagation();
        //     appMange.remove($(this).parent());
        // })
        // app内分页点击
        .on('click', '.apps-page-btn', function () {
            var $this = $(this);
            if ($this.hasClass('active')) {
                return;
            }

            changePage($this);
        })
        .on('click', '.apps-page-prev', function () {
            var $this = $(this);
            if ($this.hasClass('disabled')) return;
            changePage($this.siblings('.apps-page-btn.active').prev());
        })
        .on('click', '.apps-page-next', function () {
            var $this = $(this);
            if ($this.hasClass('disabled')) return;
            changePage($this.siblings('.apps-page-btn.active').next());
        })
        // 展开更多分类
        // .on('click', '.apps-tabview-header > .more-trigger', function (e) {
        //     e.stopPropagation();
        //     var $this = $(this).parent();

        //     $this.toggleClass('open');
        // })
        // 点击打开应用
        .on('click', '.sub-apps', function (e) {
            e.stopPropagation();
        })
        .on('click', '.app-item', function (e) {
            e.stopPropagation();
            var $this = $(this),
                name = this.title,
                id = $this.data('id'),
                url = $this.data('url'),
                hasSub = $this.data('hassub'),
                openType = $this.data('opentype');
            if (hasSub) {
                $main.addClass('in-showsub');
                var $sub = $this.find('>.sub-apps');
                var pos = $this.position();
                var size = getSubAppSize($sub);
                $sub.css({
                    top: pos.top + (APP_HEIGHT / 2),
                    left: pos.left + (APP_WIDTH / 2),
                    height: size.height > APPS_HEIGHT ? APPS_HEIGHT : size.height,
                    width:size.width
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
        if (!$(e.target).closest('.sub-apps').length && $main.hasClass('in-showsub')) {
            hideSubApps();
        }
    });
    var resizeTimer;
    $(win).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            APPS_HEIGHT = $myApps.height();
        }, 50);
    });

}(this, jQuery));


/**
 * 应用交互实现
 */
// (function (win, $, TabsNav) {
//     // 需要直接显示我的桌面的ID
//     var HOME_ID = 'tab-home-0';

//     // 应用容器
//     var $appPanel = $('#left-panel'),
//         // 显示触发按钮
//         $trigger = $('#app-start-trigger'),
//         // tab列表
//         $tabList = $('#all-tabs-list');

//     var $panelCover = $('<div id="app-panel-cover" class="hidden"></div>').css({
//         'position': 'absolute',
//         'top': 0,
//         'right': 0,
//         'bottom': 0,
//         'left': 0,
//         'background': 'rgba(0,0,0,.3)'
//     }).appendTo('body');

//     var appPanel = {
//         show: function () {
//             $panelCover.css('z-index', Util.getZIndex()).removeClass('hidden');
//             $appPanel.css('z-index', Util.getZIndex()).removeClass('hidden');
//         },
//         hide: function () {
//             $panelCover.addClass('hidden');
//             $appPanel.css('z-index', '');
//             $trigger.removeClass('active');
//             // 非首页展示点击时 需要隐藏
//             if ($tabList.find('.tabs-nav-item.active').attr('id') !== HOME_ID) {
//                 $appPanel.addClass('hidden');
//             }
//         }
//     };
//     win.appPanel = appPanel;
//     // 切换tab时
//     graceEvent.on('activeTab', function (e) {
//         var tabId = e.data;
//         if (tabId === HOME_ID) {
//             // 切换到主页
//             $appPanel.removeClass('hidden');
//         } else {
//             // 非主页
//             $appPanel.addClass('hidden');
//         }
//     });
//     // 点击显示
//     $trigger.on('click', function (e) {
//         var $this = $(this);
//         if (!$this.hasClass('active')) {
//             $this.addClass('active');
//             appPanel.show();
//         } else {
//             e.stopPropagation();
//             $this.removeClass('active');
//             appPanel.hide();
//         }
//     });

//     $panelCover.on('click', function () {
//         appPanel.hide();
//     });

// }(this, jQuery, window.TabsNav));
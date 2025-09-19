// 应用模板
var METRO_APP_TPL = '<div class="metro-app" data-id="{{id}}" title="{{name}}" style="top:{{top}}px;left:{{left}}px;width:{{width}}px;height:{{height}}px;"><div class="app-inner" style="background-color:{{bgcolor}}">{{#innerUrl}}<iframe src="{{innerUrl}}" frameborder="0" width="{{ifrWidth}}" height="{{ifrHeight}}" allowtransparency="true" class="app-iframe" scrolling="no"></iframe>{{/innerUrl}}{{#icon}}{{{icon}}}{{/icon}}<p class="app-name">{{name}}</p><span class="app-unread unread {{^count}}hidden{{/count}}">{{count}}</span></div></div>',
    // 屏幕模板
    METRO_SCREEN_TPL = '<div class="screen-item l" data-name="{{name}}" data-server-index="{{screenIndex}}"><h2 class="screen-header">{{name}}</h2><div class="apps-wrap">{{{appHtml}}}</div></div>',
    // 屏幕导航模板
    METRO_SCREEN_NAV_TPL = '<li class="screen-nav-item" title="{{name}}" data-server-index="{{screenIndex}}"></li>',
    COMMON_APP_TPL = '<div class="common-app" data-id="{{id}}" title="{{name}}"><span class="common-app-unread app-unread unread {{^count}}hidden{{/count}}">{{count}}</span><span class="common-app-icon-wrap">{{#icon}}{{{icon}}}{{/icon}}</span><span class="common-app-name">{{sname}}</span></div>',
    // 底部任务项模板
    METRO_TASK_TPL = '<a href="javascript:void(0);" data-id="{{id}}" class="task-item l clearfix" title="{{name}}"><p class="task-name">{{name}}</p></a>',
    // 我的看板内容模板
    BOARD_CONTENT_TPL = '<iframe src="{{url}}" class="board-content hidden" id="board-content-{{id}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>';

/* global METRO_SETTINGS: true, EpDialog, _MetroEvent_, MetroDataActionUrl, AppMgr */

// 工具方法和组件扩展、全局配置
(function (win, $) {
    'use strict';
    // 自动加载 svg 内容
    if (!Util.browsers.isIE8) {
        $.ajax({
            url: './images/app/svg.svg',
            dataType: 'html',
            async: false,
            success: function (data) {
                $('<div hidden class="hidden"></div>').append(data).appendTo('body');
            }
        });
    }

    EpDialog.setMaxCoord({
        top: 50,
        left: 0,
        right: 0,
        bottom: 40
    });
    if (!win.METRO_SETTINGS) {
        win.METRO_SETTINGS = {};
    }
    var METRO_SETTINGS_DEFAULT = {
        // 列数目
        columns: 4,
        // 行数目
        rows: 4,
        // 默认显示的分屏页，从1开始
        activePage: 1,
        // [x, y] dialog打开时 宽高相对于视窗大小的比列
        dialogSizeRadio: [0.6, 0.6],
        // 屏幕滚动方向 0 水平 1 垂直
        scrollDirection: 0,

        // App 的基准大小
        // appSize: [240, 115],
        appSize: [200, 90],
        // app 缩放的基准尺寸
        // baseSize: [1366, 768]
        baseSize: [1200, 600]
    };

    METRO_SETTINGS = $.extend({}, METRO_SETTINGS_DEFAULT, METRO_SETTINGS);

    function freeze(obj) {
        Object.freeze(obj);
        for (var key in obj) {
            if (typeof obj[key] == 'object' && Object.prototype.hasOwnProperty.call(obj, key)) {
                Object.freeze(obj[key]);
            }
        }
    }

    if (Object.freeze) {
        freeze(win.METRO_SETTINGS);
    }

    win.useWebsocket = Util.getFrameSysParam('useWebsocket') === true;

    // 页面websocket对象
    win.eWebSocket = undefined;

    // 创建websocket链接
    win.creatWebSocket = function (uid, uname, callback) {
        // 避免重复创建
        if (eWebSocket) {
            callback && callback();
            return;
        }

        var cfg = win.EWebSocketConfig ? win.EWebSocketConfig : {
            url: EmsgConfig.websocketUrl
        };

        cfg.uid = uid;
        cfg.uname = uname;

        if (win.EWebSocket) {
            eWebSocket = new EWebSocket(cfg);
            callback && callback();
            _aideEvent_.fire('websocketCreated');

        } else {
            Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function () {
                eWebSocket = new EWebSocket(cfg);
                callback && callback();
                _aideEvent_.fire('websocketCreated');
            });
        }
    };

    $.extend(Util, {
        // debounce
        debounce: function (fn, delay, ctx) {
            delay = delay || 17;
            var timer;
            return function () {
                var args = arguments;
                var context = ctx || this;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        },
        // throttle
        throttle: function (fn, delay, ctx) {
            delay = delay || 200;
            var timer,
                prevTime = +new Date();
            return function () {
                clearTimeout(timer);
                var args = arguments;
                var context = ctx || this;
                var pastTime = +new Date() - prevTime;

                if (pastTime >= delay) {
                    // 如果过去的时间已经大于间隔时间 则立即执行
                    fn.apply(context, args);
                    prevTime = +new Date();
                } else {
                    // 过去的时间还没到 则等待
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                        prevTime = +new Date();
                    }, delay - pastTime);
                }
            };
        },
        // 纯数字数组排序
        sortArr: function (arr, type) {
            var copyArr = Array.prototype.slice.call(arr, 0),
                sortFunc;

            // 默认升序
            if (!type) type = 'asc';

            if (type == 'asc') {
                sortFunc = function (a, b) {
                    return a - b;
                };
            } else if (type == 'desc') {
                sortFunc = function (a, b) {
                    return b - a;
                };
            }

            return copyArr.sort(sortFunc);
        },

        // 修正页面、图标路径
        fixPath: function (data) {
            var copy = $.extend({}, data);

            copy.url = Util.getRightUrl(data.url);

            // if (copy.icon) {
            //     // copy.icon = Util.getRightUrl(data.icon);
            //     copy.icon = Util._genderIconHtml(data.icon);
            // }

            if (data.innerUrl) {
                copy.innerUrl = Util.getRightUrl(data.innerUrl);
            }

            return copy;
        },
        _genderIconHtml: (function () {
            if (Util.browsers.isIE8) {
                return function (icon, cls) {
                    return '<img src="' + Util.getRightUrl('./images/app/' + icon + '.png') + '" class="' + cls + '" alt="">';
                };
            }
            return function (icon, cls) {
                return '<svg class="' + cls + '"><use xlink:href="#metro-app-icon-' + icon + '"></use></svg>';
            };

        })(),

        // 高亮闪烁应用
        highlightApp: function ($app) {
            var dark = function () {
                    $app.animate({
                        opacity: 0.3
                    }, 200, next);
                },
                light = function () {
                    $app.animate({
                        opacity: 1
                    }, 200, next);
                },
                next = function () {
                    var n = $app.queue('highlight');

                    if (!n.length) {
                        $app.clearQueue('highlight');
                    } else {
                        $app.dequeue('highlight');
                    }
                };

            $app.queue('highlight', [dark, light,
                dark, light,
                dark, light,
                dark, light
            ]);

            next();
        },

        // 根据应用数据配置右键菜单的操作是否可用
        configAppCmOpers: function (cm, data) {
            // 是否可卸载
            data.uninstallable !== false ? cm.enableItem('uninstall-app') : cm.disableItem('uninstall-app');

            // 是否可移动
            // TODO:
            // 如果应用不可移动，除了通过ContextMenu无法操作外，
            // 还应该无法进行鼠标的拖动，在Metro的实现中，因为一个应用的移动会影响其他应用的位置，
            // 后者的处理会复杂些，暂未处理。
            data.movable !== false ? cm.enableItem('move-app') : cm.disableItem('move-app');

            // 是否可打开
            data.openable !== false ? cm.enableItem('open-app') : cm.disableItem('open-app');
        },
        getAppShortName: function (name) {
            return name.substr(0, 4);
        },
        // 动态加载js
        _jsPromise: {},
        loadJsPromise: function (url) {
            if (this._jsPromise[url]) return this._jsPromise[url];

            var dtd = $.Deferred(),
                script = document.createElement('script');
            script.type = 'text/javascript';

            // IE8- IE9+ 已经支持onload等，控制更加精确 不应该再试试onreadystatechange
            if ((this.browsers.isIE67 || this.browsers.isIE8) && script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        dtd.resolve();
                        script.onreadystatechange = null;
                    }
                };
                // w3c
            } else {
                script.onload = function () {
                    dtd.resolve();
                    script.onload = null;
                };
                script.onerror = function () {
                    dtd.reject();
                    script.onerror = null;
                    Util._jsPromise[url] = null;
                };
            }

            script.src = Util.getRightUrl(url);
            // append to head
            document.getElementsByTagName('head')[0].appendChild(script);

            return (this._jsPromise[url] = dtd.promise());
        },

        // 虚拟滚动条
        doNiceScroll: function ($el, cfg) {
            this.loadJsPromise('frame/fui/js/widgets/jquery.nicescroll.min.js').done(function () {
                $el.niceScroll(cfg);
            });
        }

    });

    win._MetroEvent_ = new Util.UserEvent();

}(this, jQuery));

/* global ImacDataActionUrl */
// 加载背景图片
(function (win, $) {
    var DEFAULT_BG = 'frame/fui/pages/themes/metro/images/skinbg/new.jpg';

    var $bg = $('#metro-skin-bg');

    Util.ajax({
        url: MetroDataActionUrl.getBgUrl
    }).done(function (data) {
        if (data && data.bg) {
            $bg[0].src = Util.getRightUrl(data.bg);
            localStorage.setItem('_imac_bg_', data.bg);
        } else {
            $bg[0].src = Util.getRightUrl(DEFAULT_BG);
            console && console.error('未返回背景，加载默认背景！');
            localStorage.setItem('_imac_bg_', DEFAULT_BG);
        }
    });

    // 开放方法 用于换背景图
    win.setBg = function (url) {
        $bg[0].src = Util.getRightUrl(url);
        localStorage.setItem('_umplatform_bg_', url);
    };
})(this, jQuery);

// 获取用户信息、 界面信息
(function (win, $) {
    var $userInfo = $('#top-user'),
        $userPortrait = $('.user-img', $userInfo);

    var $logo = $('#sys-logo');


    var getUserInfo = function () {
        return Util.ajax({
            url: win.MetroDataActionUrl.userInfoUrl,
            success: function (data) {
                $userInfo.find('.user-name').text(data.name);
                $userInfo.find('.user-ou').text(data.ouName);
                // 用户guid和name是E讯必须要使用的 需要记录下来
                win._userName_ = data.name;
                win._userGuid_ = data.guid;
                // 消息中心的配置-打开是否全屏
                win._msgcenterConfig_ = $.extend({}, MsgCenterConfig, {
                    isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
                    msgCenterOrder: data.msgCenterOrder || "asc",
                    hideCallback: function () {
                        $cover.addClass('hidden');
                    }
                });
                // 使用websocket来更新消息数目，需要先建立连接
                if (useWebsocket) {
                    creatWebSocket(_userGuid_, _userName_);
                }
                if (data.portrait) {
                    // 头像
                    var url = Util.getRightUrl(epoint.dealRestfulUrl(data.portrait));
                    $userPortrait.attr('src', url);
                }
                // 兼职
                if (data.hasParttime) {
                    $userInfo.find('.user-action-item.role-change').removeClass('hidden');
                }

                _MetroEvent_.fire('afterUserInfo', data);
            }
        });
    };

    getUserInfo();
    getPageInfo();

    function getPageInfo() {
        return Util.ajax({
            url: MetroDataActionUrl.pageInfoUrl
        }).done(function (data) {
            if (data.logo) {
                $logo.attr('src', Util.getRightUrl(data.logo));
            }

            // title
            if (data.title) {
                document.title = data.title;
                win.systemTitle = data.title;
            }
            // fullsearch
            win._fullSearchUrl_ = data.fullSearchUrl;

            _MetroEvent_.fire('afterPageInfo', data);
        });
    }

}(this, jQuery));

// metro分屏模块
(function (win, $) {
    var $screenContainer = $('#metro-screens'),
        $screenList = $('.screen-list', $screenContainer),
        $screenNavList = $('#screen-nav'),
        $screenBtn = $('.screen-btn', $screenContainer),
        $screenPrev = $screenBtn.filter('.prev'),
        $screenNext = $screenBtn.filter('.next');

    // 滚动方向的配置
    $screenList[0].setAttribute('data-direction', METRO_SETTINGS.scrollDirection === 0 ? '0' : '1');
    $screenBtn.attr('data-direction', METRO_SETTINGS.scrollDirection === 0 ? '0' : '1');

    // leftnav width
    var LEFT_WIDTH = $('#left-bar').width() || 90,
        TOP_HEIGHT = $('#metro-top-bar').height() || 50,
        BOTTOM_HEIGHT = $('#metro-task-bar').height() || 40,
        PAGE_ITEM_SIZE = {
            width: 0,
            height: 0
        },

        SCROLL_PROP = METRO_SETTINGS.scrollDirection == 0 ? 'margin-left' : 'margin-top',

        // app width,height
        APP_UNIT_WIDTH = METRO_SETTINGS.appSize[0],
        APP_UNIT_HEIGHT = METRO_SETTINGS.appSize[1],

        APP_BORDER_WIDTH = 3,

        // width, height for .apps-wrap
        appsWrap_w = (win.METRO_SETTINGS.columns || 4) * APP_UNIT_WIDTH,
        appsWrap_h = (win.METRO_SETTINGS.rows || 4) * APP_UNIT_HEIGHT,

        // margin-top, margin-left for .apps-wrap
        appsWrap_mt = appsWrap_h / 2,
        appsWrap_ml = appsWrap_w / 2;

    var needAdjustApp = true;
    // 根据屏幕大小缩放 app size
    function scaleAppSize() {
        var size = Util.getWinSize();
        var radio = 1;
        if (size.width > METRO_SETTINGS.baseSize[0] && size.height > METRO_SETTINGS.baseSize[1]) {
            radio = parseFloat(Math.min(size.width / METRO_SETTINGS.baseSize[0], size.height / METRO_SETTINGS.baseSize[1]), 10);
        }
        var w = METRO_SETTINGS.appSize[0] * radio >> 0,
            h = METRO_SETTINGS.appSize[1] * radio >> 0;
        if (w == APP_UNIT_WIDTH && h == APP_UNIT_HEIGHT) {
            needAdjustApp = false;
        } else {
            needAdjustApp = true;
        }
        APP_UNIT_WIDTH = w;
        APP_UNIT_HEIGHT = h;

        appsWrap_w = win.METRO_SETTINGS.columns * APP_UNIT_WIDTH;
        appsWrap_h = win.METRO_SETTINGS.rows * APP_UNIT_HEIGHT;
        appsWrap_mt = appsWrap_h / 2;
        appsWrap_ml = appsWrap_w / 2;
    }
    scaleAppSize();

    // 适配屏幕尺寸
    var adjustScreenSize = function () {
        scaleAppSize();
        var bs = Util.getWinSize();

        PAGE_ITEM_SIZE = {
            width: bs.width - LEFT_WIDTH,
            height: bs.height - TOP_HEIGHT - BOTTOM_HEIGHT
        };

        var showHeader = bs.height < 600 ? false : true;

        // 屏幕
        $screenContainer.css(PAGE_ITEM_SIZE)
            .find('.screen-item').css(PAGE_ITEM_SIZE)
            .find('.screen-header').css({
                width: appsWrap_w,
                marginLeft: -(appsWrap_w / 2),
                marginTop: -(appsWrap_h / 2 + 80),
                display: showHeader ? 'block' : 'none'
            });

        $screenList.find('.apps-wrap').css({
            marginTop: -appsWrap_mt,
            marginLeft: -appsWrap_ml,
            width: appsWrap_w,
            height: appsWrap_h
        });
        // 导航
        $screenNavList.css({
            marginTop: appsWrap_h / 2 + 40,
        });

        // 按钮
        $screenBtn.css('margin-top', -appsWrap_h / 2);
        $screenPrev.css('margin-left', -(appsWrap_w / 2 + $screenPrev.outerHeight()));
        $screenNext.css('margin-left', appsWrap_w / 2);

        if (METRO_SETTINGS.scrollDirection == 0) {
            $screenList.css('margin-left', -activePage * PAGE_ITEM_SIZE.width);
        } else {
            $screenList.css('margin-top', -activePage * PAGE_ITEM_SIZE.height);
        }
    };

    var IFR_TO_TOP = 6,
        IFR_TO_LEFT = 14,
        IFR_TO_BOTTOM = 35;

    // 返回合适的样式数据
    var getPropStyles = function (data) {
        var styles = {},

            r = data.rowspan,
            c = data.colspan,
            i = data.index;

        var el_w = APP_UNIT_WIDTH * c - APP_BORDER_WIDTH * 2,
            el_h = APP_UNIT_HEIGHT * r - APP_BORDER_WIDTH * 2,

            ifr_w = el_w - IFR_TO_LEFT * 2,
            ifr_h = el_h - IFR_TO_TOP - IFR_TO_BOTTOM,

            el_t = (i % METRO_SETTINGS.rows) * APP_UNIT_HEIGHT,
            el_l = Util.toInt(i / METRO_SETTINGS.rows) * APP_UNIT_WIDTH,

            // 给元件添加一个默认背景色，以防止未配置背景色时元件透明
            bgc = data.bgcolor || '#2a6ebb';

        $.extend(styles, {
            width: el_w,
            height: el_h,
            ifrWidth: ifr_w,
            ifrHeight: ifr_h,
            top: el_t,
            left: el_l,
            bgcolor: bgc
        });

        return styles;
    };

    /**
     * 为 App 设置位置数据
     *
     * @param {HTMLElement | jQuery | Selector} app 要设定的app元素
     * @param {Object} style 样式数据
     */
    function setAppPos(app, style) {
        $(app).css({
            top: style.top,
            left: style.left,
            width: style.width,
            height: style.height
        }).find('.app-iframe').css({
            width: style.ifrWidth,
            height: style.ifrHeight
        });
    }

    // 重设 app 位置
    function adjustAppsSize() {
        if (!needAdjustApp) {
            return;
        }
        $screenList.children().each(function (i, screenEl) {
            $(screenEl).find('.metro-app').each(function (j, app) {
                var appId = app.getAttribute('data-id');
                var data = AppMgr.getAppData(appId);
                if (data) {
                    var style = getPropStyles(data);
                    setAppPos(app, style);
                }
            });
        });
    }

    $(win).on('resize', Util.debounce(function () {
        adjustScreenSize();
        adjustAppsSize();
    }, 17));

    // 页码总数
    var PAGE_NUM;

    var activePage = (win.METRO_SETTINGS.activePage || 1) - 1;

    var appTpl = $.trim(METRO_APP_TPL);
    // 桌面应用右键菜单对象
    var appCm;

    // 绘制分屏
    var renderScreens = function (data) {
        var screen = {};
        var len = data.length;

        var html = $.map(data, function (item, i) {
            screen = {
                name: item.leftNav.name,
                icon: item.leftNav.icon,
                screenIndex: item.leftNav.screenIndex,
                isFirst: i === 0,
                isLast: i === len - 1,
                appHtml: renderApps(item.screenApps, item.leftNav.screenIndex)
            };
            return Mustache.render(METRO_SCREEN_TPL, screen);
        });

        var $screens = $(html.join(''));

        $screens.find('.apps-wrap').css({
            marginTop: -appsWrap_mt,
            marginLeft: -appsWrap_ml,
            width: appsWrap_w,
            height: appsWrap_h
        });
        $screenList.append($screens);
    };

    /**
     * 绘制屏幕内应用
     *
     * @param {app []} apps 当前屏幕下的app数组
     * @param {string | number} screenIndex 所在屏幕的服务的索引
     * @returns 渲染后的html
     */
    var renderApps = function (apps, screenIndex) {
        var html = $.map(apps, function (item) {
            item = Util.fixPath(item);

            if (item.icon) {
                item.icon = Util._genderIconHtml(item.icon, 'app-icon');
            }

            // 唯一的索引，用于服务端权限控制
            item.screenIndex = screenIndex;

            AppMgr.cacheAppData(item.id, item);
            return Mustache.render(appTpl, $.extend({}, item, getPropStyles(item)));
        });

        return html.join('');
    };

    // 记录菜单，用于应用右键菜单移动时显示名称 和 获取屏幕真实索引
    var leftItems = [];

    // 绘制屏幕导航
    var renderPages = function (data) {
        var l = data.length,
            leftData,
            html = [],
            i = 0;

        for (; i < l; i++) {
            leftData = data[i].leftNav;
            // 记录菜单名，用于应用右键菜单
            leftItems.push(leftData);

            html.push(Mustache.render(METRO_SCREEN_NAV_TPL, {
                page: i,
                name: leftData.name,
                icon: leftData.icon,
                screenIndex: leftData.screenIndex
            }));
        }
        var w = 20 * l;
        $screenNavList.css({
            marginLeft: -w / 2,
            width: w
        }).html(html.join(''));

        PAGE_NUM = l;
    };

    // 获取分屏信息、应用信息
    var getScreenInfo = function () {
        Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: win.MetroDataActionUrl.screenInfoUrl,
            data: {
                query: 'screen-apps'
            },
            success: function (data) {
                if (data && data.length) {
                    renderScreens(data);
                    renderPages(data);

                    // 应用右键菜单
                    if (appContextmenu) {
                        appCm = createAppContextMenu();
                    }

                    // 支持拖拽
                    AppDragMgr.enableAllApps();

                    // 立刻调节屏幕尺寸
                    adjustScreenSize();
                    // 设置默认分屏
                    MetroScreen.setPageActive(activePage);
                }
                _MetroEvent_.fire('afterAllAppsLoad');
            },
            error: Util._ajaxErr
        });
    };

    // 获取合适的页码
    var getRightPage = function (page) {
        var rt = page;

        if (page < 0) {
            rt = 0;
        } else if (page >= PAGE_NUM) {
            rt = PAGE_NUM - 1;
        }

        return rt;
    };

    // 键盘：up down
    var LEFT_KEY = 37,
        UP_KEY = 38,
        RIGHT_KEY = 39,
        DOWN_KEY = 40;

    var handleKeydown = function (event) {
        var code = event.which,
            page;
        // 上下左右
        if (code == UP_KEY || code == LEFT_KEY) {
            page = activePage - 1;
        } else if (code == DOWN_KEY || code == RIGHT_KEY) {
            page = activePage + 1;
        }

        if (page === undefined) return;

        page = getRightPage(page);

        MetroScreen.setPageActive(page);
    };

    $(document).on('keydown', handleKeydown);

    // 点击导航
    $screenNavList.on('click', '.screen-nav-item', function (event) {
        event.preventDefault();

        var page = $(this).index();

        MetroScreen.setPageActive(page);
    });

    // 按钮翻页
    $screenPrev.click(function () {
        if (this.disabled) {
            return;
        }
        MetroScreen.goPrev();
    });
    $screenNext.click(function () {
        if (this.disabled) {
            return;
        }
        MetroScreen.goNext();
    });
    // 鼠标滚轮控制屏幕翻滚
    Util.loadJs(Util.getRightUrl('frame/fui/js/libs/jquery.mousewheel.min.js'), function () {
        // 绑定鼠标滚轮事件
        var mousewheelTimer;

        $screenContainer.on('mousewheel', function (event) {
            console.log(event.deltaX, event.deltaY, event.deltaFactor);

            // 虽然鼠标滚轮不是连续事件，但是为了防止一次拨动滚轮太多，导致连续翻页，所以使用定时器处理一下
            clearTimeout(mousewheelTimer);
            mousewheelTimer = setTimeout(function () {
                var page;
                // 向下
                if (event.deltaY < 0) {
                    page = activePage + 1;
                    // 向上
                } else if (event.deltaY > 0) {
                    page = activePage - 1;
                }
                if (page === undefined) return;

                page = getRightPage(page);

                MetroScreen.setPageActive(page);

            }, 200);
        });
    });

    // 屏幕相关操作 
    /* global MetroScreen */
    win.MetroScreen = {
        setPageActive: function (i) {
            var page = getRightPage(i);

            var $page = $screenNavList.find('.screen-nav-item').eq(page);

            if ($page.hasClass('active')) return;

            $screenPrev.prop('disabled', page === 0);
            $screenNext.prop('disabled', page === PAGE_NUM - 1);
            // $screenPrev[0].setAttribute('disabled', page === 0);
            // $screenNext[0].setAttribute('disabled', page === PAGE_NUM - 1);


            var range = {};
            var v = METRO_SETTINGS.scrollDirection == 0 ? PAGE_ITEM_SIZE.width : PAGE_ITEM_SIZE.height;
            range[SCROLL_PROP] = -(v * page);

            $screenList.stop(true)
                .animate(range, 300);

            $page.addClass('active')
                .siblings()
                .removeClass('active');

            // ContextMenu移动到当前页失效
            if (appContextmenu) {
                appCm.enableItem('page-' + activePage)
                    .disableItem('page-' + page);
            }

            activePage = page;
        },

        getActivePage: function () {
            return activePage;
        },
        goPrev: function () {
            return this.setPageActive(this.getActivePage() - 1);
        },
        goNext: function () {
            return this.setPageActive(this.getActivePage() + 1);
        },
        getActiveNavItem: function () {
            return $screenNavList.find('.page-item').eq(activePage);
        },

        getScreen: function (page) {
            return $screenList.find('.screen-item').eq(page);
        },

        // 获取应用DOM
        getApp: function (id) {
            return $screenContainer.find('[data-id="' + id + '"]');
        },

        // 添加应用
        addApp: function (data, page) {
            var $screen = $screenList.find('.screen-item').eq(page),
                $app = $(Mustache.render(appTpl, $.extend({}, data, getPropStyles(data))));
            // 应用中心的安装需要替换一下应用的图标class
            $app.find('.app-center-item-icon').attr('class', 'app-icon');

            $app.appendTo($screen.find('.apps-wrap'));

            AppDragMgr.enableApp($app);

            // data.page = page;

            data.screenIndex = $screen.data('server-index');
            AppMgr.cacheAppData(data.id, data);

            Util.highlightApp($app);
        },

        // 移除应用DOM
        removeApp: function (id) {
            var $app = this.getApp(id);

            AppDragMgr.destroy($app);

            $app.fadeOut(200, function () {
                $app.remove();
            });
        },

        // 获取指定屏幕上已被应用占用的格子索引数组
        getOccupiedGrids: function (page) {
            var arr = [],
                $apps = this.getScreen(page).find('.metro-app');

            $.each($apps, function (i, el) {
                var $el = $(el),
                    id = $el.data('id');

                // 如果有ignored样式则表示忽略该应用
                if ($el.hasClass('ignored')) return;

                arr = arr.concat(MetroScreen.getAppOccupiedGrids(id));
            });

            if (arr.length >= 2) {
                arr = Util.sortArr(arr);
            }

            return Array.prototype.slice.call(arr, 0);
        },

        // 获取一个应用所占的格子索引数组
        getAppOccupiedGrids: function (id) {
            var data = $.isPlainObject(id) ? id : AppMgr.getAppData(id),
                arr = [],

                r = data.rowspan,
                c = data.colspan,
                idx = data.index,

                i = 0,
                j = 1,
                n;

            if (c == 1 && r == 1) {
                arr.push(idx);
            } else {

                for (; i < r; i++) {
                    n = idx + i;
                    arr.push(n);

                    for (j = 1; j < c; j++) {
                        arr.push(n + j * METRO_SETTINGS.rows);
                    }
                }
            }

            if (arr.length >= 2) {
                arr = Util.sortArr(arr);
            }

            return Array.prototype.slice.call(arr, 0);
        },

        // 在指定page上 根据index查找应用
        getAppByIndex: function (page, index) {
            var $apps = this.getScreen(page).find('.metro-app'),
                $rt = false;

            $apps.each(function (i, app) {
                var id = $(app).data('id'),
                    data = AppMgr.getAppData(id);
                if (!data) {
                    return;
                }
                if (data.index == index) {
                    $rt = $(app);
                    return false;
                }
            });

            return $rt;
        },

        // 根据位置来获取合适的索引
        getAppIndexByPos: function (pos) {
            var c, r, index;

            // 是否越界
            var isOut = (pos.left > (METRO_SETTINGS.columns - 1) * APP_UNIT_WIDTH + APP_UNIT_WIDTH / 2) || (pos.top > (METRO_SETTINGS.rows - 1) * APP_UNIT_HEIGHT + APP_UNIT_HEIGHT / 2);

            if (isOut) {
                index = -1;
            } else {
                c = (pos.left < 0 ? 0 : pos.left) / APP_UNIT_WIDTH;
                r = (pos.top < 0 ? 0 : pos.top) / APP_UNIT_HEIGHT;

                index = Math.round(c) * METRO_SETTINGS.rows + Math.round(r);
            }

            return index;
        },

        // 根据index调整应用位置
        adjustAppPosByIndex: function ($app, index) {
            var id = $app.data('id'),

                data = AppMgr.getAppData(id),
                pos = getAppPosByIndex(index);
            if (!data) {
                return;
            }

            $app.stop(true)
                .animate(pos, 200);

            // 如果索引号发生变化，则发送更新请求
            if (data.index != index) {
                data.index = index;

                AppMgr.cacheAppData(id, data);
                AppMgr.sendAppUpdate(id, 'update-app-index');
            }
        },

        // 判断应用所占的格子是否成块
        isOneBlock: function (data) {
            var idx = data.index,
                r = data.rowspan,

                col = Util.toInt(idx / METRO_SETTINGS.rows),

                i = 1;

            for (; i < r; i++) {
                if (Util.toInt((idx + i) / METRO_SETTINGS.rows) != col) {
                    return false;
                }
            }

            return true;
        },

        // 获取指定页可用的格子索引数组
        getEmptyGrids: function (page) {
            var l = METRO_SETTINGS.columns * METRO_SETTINGS.rows,

                occupiedGrids = MetroScreen.getOccupiedGrids(page),
                emptyGrids = [],

                i = 0;

            for (; i < l; i++) {
                if ($.inArray(i, occupiedGrids) == -1) {
                    emptyGrids.push(i);
                }
            }

            return Array.prototype.slice.call(emptyGrids, 0);
        },

        // 返回应用在指定分屏可插入的index
        getInsertIndex: function (data, page) {
            var r = data.rowspan,
                c = data.colspan,

                emptyGrids = MetroScreen.getEmptyGrids(page),
                occupiedGrids = [],

                rt = 0,
                hasRoom = true,

                i, j, l, m;

            // 空余格子数
            l = emptyGrids.length;

            // 所需格子数
            m = r * c;

            // 如果无空余格子、或者所占空间大于空余空间，则直接返回
            if (!l || m > l) {
                rt = -1;

                // 非扩展应用取一地个空格索引即可
            } else if (r == 1 && c == 1) {
                rt = emptyGrids[0];

                // 扩展应用判断是否有足够的空间容纳
            } else {
                for (i = 0; i < l; i++) {
                    hasRoom = true;

                    // 假设扩展应用的起始索引为一个空格索引
                    data.index = emptyGrids[i];

                    // 若格子不成整体，则跳过
                    if (!MetroScreen.isOneBlock(data)) {
                        continue;
                    }

                    // 获取它应该占据的格子索引数组
                    occupiedGrids = MetroScreen.getAppOccupiedGrids(data);

                    // 如果所需占用的格子索引中有一个已被占用则表示没有空间
                    for (j = 0; j < m; j++) {

                        if ($.inArray(occupiedGrids[j], emptyGrids) == -1) {
                            // 标记为空间不足
                            hasRoom = false;
                            break;
                        }
                    }

                    // 如果发现合适的格子索引，则停止计算
                    if (hasRoom) {
                        rt = data.index;
                        break;
                    }
                }

                if (!hasRoom) {
                    rt == -1;
                }
            }

            return rt;
        }
    };

    // 根据索引获取位置
    var getAppPosByIndex = function (index) {
        var col = Util.toInt(index / METRO_SETTINGS.rows),
            row = Util.toInt(index % METRO_SETTINGS.rows);

        return {
            left: APP_UNIT_WIDTH * col,
            top: APP_UNIT_HEIGHT * row
        };
    };

    // 创建应用右键菜单
    var createAppContextMenu = function () {
        var items = [],
            i,
            moveItems = [];

        var moveToScreen = function (opt, data) {
            AppMgr.moveToScreen(opt.id, data.page);
        };

        items.push({
            text: '打开应用',
            role: 'open-app',
            click: function (opt) {
                AppMgr.openApp(opt.id);
            }
        });
        items.push('sep');

        for (i = 1; i <= PAGE_NUM; i++) {
            moveItems.push({
                // text: ('智慧桌面' + i),
                text: ((leftItems[i - 1]).name),
                role: ('page-' + (i - 1)),
                page: (i - 1),
                click: moveToScreen
            });
        }

        items.push({
            text: '移动应用到',
            role: 'move-app',
            items: moveItems
        });

        items.push({
            text: '卸载应用',
            role: 'uninstall-app',
            click: function (opt) {
                mini.confirm('您确定卸载该应用吗？卸载后可从应用仓库中再次添加到桌面。', '系统提示', function (action) {
                    if (action == 'ok') {
                        AppMgr.uninstallApp(opt.id);
                    }
                });
                // uninstallTip.setOptions('id', opt.id)
                //  .show(true);
            }
        });

        var cm = new EpContextMenu({
            items: items
        });

        return cm;
    };

    // 更新应用提醒数
    var updateUnread = function ($app, count) {
        var $unread = $app.find('.app-unread');

        if (count <= 0) {
            $unread.addClass('hidden');
        } else {
            $unread.html(count >= 99 ? 99 : count).removeClass('hidden');
        }
    };

    // 应用缓存数据
    var appDataCache = {};
    win.sss = appDataCache;
    // 应用管理
    win.AppMgr = {
        msgRemindApps: [],
        cacheAppData: function (id, data) {
            appDataCache[id] = $.extend({}, data);
            // 检查是否需要消息轮训 需要则更新数组
            if (data.needMsgRemind) {
                AppMgr.msgRemindApps.push(data.id);
            }
        },

        getAppData: function (id) {
            if (appDataCache[id]) {
                return $.extend({}, appDataCache[id]);
            }
        },

        delAppData: function (id) {
            appDataCache[id] = null;
        },

        // 打开应用
        openApp: function (id) {
            var data = AppMgr.getAppData(id);

            if (data.isBlank) {
                win.open(data.url);
            } else {
                TabsNav.addOrActiveTask(id);
            }
        },

        // 安装应用
        installApp: function (data) {
            if (!data.rowspan || !data.colspan) {
                console.error('应用数据不完整无法安装', data);
                return;
            }

            var page = MetroScreen.getActivePage(),

                data = Util.fixPath(data);

            var insertIndex = MetroScreen.getInsertIndex(data, page);

            if (insertIndex === -1) {
                epoint.showTips('很抱歉，当前页没有足够的空间安装该应用，您可以选择其他分屏或者调整应用布局后再安装。', {
                    state: 'error'
                });
                // 安装失败
                return false;
            }
            data.index = insertIndex;
            MetroScreen.addApp(data, page);
            epoint.showTips('应用【' + data.name + '】安装成功！', {
                state: 'success'
            });

            // 安装成功，给后台发送page，index信息
            AppMgr.sendAppUpdate(data, 'install-app');
        },

        // 移动到另一个分屏
        moveToScreen: function (id, page) {
            var data = AppMgr.getAppData(id);
            if (!data) {
                return;
            }
            var idx = MetroScreen.getInsertIndex(data, page);
            if (idx == -1) {
                mini.showMessageBox({
                    title: '系统提示',
                    message: '很抱歉，第' + (page + 1) + '分屏没有足够的空间，您可以选择其他分屏或者调整应用布局后再移动。',
                    buttons: ["ok"],
                    iconCls: "mini-messagebox-warn"
                });
                // onlyOkTip.setMessage('很抱歉，第' + (page + 1) + '分屏没有足够的空间，您可以选择其他分屏或者调整应用布局后再移动。')
                //  .setType('warn')
                //  .show(true);
            } else {
                data.index = idx;

                // 移除应用
                MetroScreen.removeApp(id);

                // 添加应用
                MetroScreen.addApp(data, page);

                // 自动切换到
                MetroScreen.setPageActive(page);

                // 发送移动到屏幕请求
                AppMgr.sendAppUpdate(id, 'screen-to-screen');
            }
        },

        // 卸载应用
        uninstallApp: function (id) {
            // 移除任务应用
            TabsNav.removeTab(id);

            // 移除应用
            MetroScreen.removeApp(id);

            // 发送卸载请求
            AppMgr.sendAppUpdate(id, 'uninstall-app');

            // 删除应用数据
            AppMgr.delAppData(id);
        },

        // 发送应用信息更新请求
        sendAppUpdate: function (id, query) {
            var data = $.isPlainObject(id) ? id : AppMgr.getAppData(id),

                params = $.extend({}, data, {
                    query: query
                });

            Util.ajax({
                type: 'POST',
                url: MetroDataActionUrl.updateAppUrl,
                dataType: 'json',
                data: params,
                success: Util.noop,
                error: Util._ajaxErr
            });
        }
    };

    // 点击应用，打开
    $screenContainer.on('click', '.metro-app', function (event) {
        var id = $(this).data('id');

        AppMgr.openApp(id);


    });
    // 右键应用 弹出菜单
    if (appContextmenu) {
        $screenContainer.on('contextmenu', '.metro-app', function (event) {
            var id = $(this).data('id'),
                data = AppMgr.getAppData(id);
            if (!data) {
                return;
            }

            appCm.setOptions('id', id).show({
                x: event.pageX,
                y: event.pageY
            });

            Util.configAppCmOpers(appCm, data);

            return false;
        });
    }

    getScreenInfo();

}(this, jQuery));

// 应用拖动管理
(function (win, $) {
    var $screenContainer = $('#metro-screens');

    var appDragStart = function (event, ui) {
        var $el = $(this);

        $el.addClass('app-drag-zindex');
    };

    var appDragStop = function (event, ui) {
        var $el = $(this),

            id = $el.data('id'),
            data = AppMgr.getAppData(id);
        if (!data) {
            return;
        }

        // 原始的index
        var oldIdx = data.index,

            pos = ui.position,
            i = MetroScreen.getAppIndexByPos(pos),

            // 应用位置改变后，应该占据的格子
            occupied = [],
            // 原位置所占的格子
            oldOccupied = [],
            // 被覆盖的应用集合
            overApps = [],
            // 被覆盖应用所占的格子
            overOccupied = [],
            // 原本空的格子
            empty = [],
            // 用作比较
            temp = [],
            // 是否合适移到新位置
            isFit = false,

            activePage = MetroScreen.getActivePage();

        // 新起始位
        data.index = i;

        // 越界
        if (i == -1) {
            isFit = false;

            // 所占格子不成块
        } else if (!MetroScreen.isOneBlock(data)) {
            isFit = false;

        } else {
            occupied = MetroScreen.getAppOccupiedGrids(data);

            oldOccupied = MetroScreen.getAppOccupiedGrids($.extend({}, data, {
                index: oldIdx
            }));

            empty = MetroScreen.getEmptyGrids(activePage);

            // 获取被覆盖的应用集合
            $.each(occupied, function (i, idx) {
                var $app = MetroScreen.getAppByIndex(activePage, idx);

                // 除掉应用自己（可能之前的index在覆盖之下）
                if ($app && $app.data('id') != id) {
                    overApps.push($app.addClass('ignored'));
                }
            });

            // 获取被覆盖应用所占的格子
            if (overApps.length) {
                $.each(overApps, function (i, $app) {
                    var id = $app.data('id');

                    overOccupied = overOccupied.concat(MetroScreen.getAppOccupiedGrids(id));
                });
            }

            $.each(occupied, function (i, idx) {
                if ($.inArray(idx, empty) != -1 || $.inArray(idx, oldOccupied) != -1) {
                    temp.push(idx);
                }
            });

            temp = Util.sortArr(temp.concat(overOccupied));

            isFit = temp[0] == occupied[0] && temp[temp.length] == occupied[occupied.length] && temp.length == occupied.length;

        }

        if (!isFit) {
            i = oldIdx;
        }

        MetroScreen.adjustAppPosByIndex($el, i);

        if (overApps.length) {
            // 移动被覆盖的应用
            if (isFit) {
                $.each(overApps, function (i, $app) {
                    var id = $app.data('id'),
                        data = AppMgr.getAppData(id);
                    if (!data) {
                        return;
                    }

                    var idx = MetroScreen.getInsertIndex(data, activePage);

                    MetroScreen.adjustAppPosByIndex($app.removeClass('ignored'), idx);
                });

                // 清理ignored样式
            } else {
                $.each(overApps, function (i, $app) {
                    $app.removeClass('ignored');
                });
            }
        }

        $el.removeClass('app-drag-zindex');
    };

    var dragConfig = {
        containment: 'body',
        scroll: false,
        opacity: 0.5,
        distance: 10,
        iframeFix: true,
        start: appDragStart,
        stop: appDragStop
    };

    // 只支持最小单元尺寸的应用拖拽
    win.AppDragMgr = {
        enableAllApps: function () {
            $screenContainer.find('.metro-app')
                .draggable(dragConfig);
        },

        enableApp: function ($app) {
            $app.draggable(dragConfig);
        },

        destroy: function ($app) {
            $app.draggable("destroy");
        }
    };

}(this, jQuery));

// 轮训获取应用上的消息数目
(function (win, $) {
    var $container = $('body');
    var appElCache = {};
    var resolveDtd = (function () {
        var dtd = $.Deferred();
        dtd.resolve();
        return dtd.promise();
    })();

    var getAppMsgCount = function () {
        var ids = $.unique(AppMgr.msgRemindApps);
        if (!ids) {
            return resolveDtd;
        }
        return Util.ajax({
                url: MetroDataActionUrl.updateAppMsgCountUrl,
                data: {
                    appIds: ids
                }
            })
            .done(function (data) {
                if (!data) return;
                $.each(data, function (id, count) {
                    count = parseInt(count, 10) || 0;
                    count = count > 99 ? '99+' : count;

                    var $appCount = appElCache[id] ? appElCache[id] : (appElCache[id] = $container.find('[data-id="' + id + '"]').find('.unread'));

                    if (count) {
                        $appCount.text(count).removeClass('hidden');
                    } else {
                        $appCount.addClass('hidden');
                    }
                });
            });
    };

    function startUpdateAppMsgCount() {
        getAppMsgCount().always(function () {
            setTimeout(startUpdateAppMsgCount, 30 * 1000);
        });
    }

    _MetroEvent_.on('afterAllAppsLoad', startUpdateAppMsgCount);
})(this, jQuery);

// 底部任务栏
(function (win, $) {
    var $taskBar = $('#metro-task-bar'),
        $tasksWrap = $('.tasks-wrap', $taskBar),
        $taskList = $('.task-list', $taskBar);

    // 包括a.scroll-l,a.scroll-r
    var $scrollWrap = $taskBar.find('.scroll-wrap');

    // 滚动导航宽度
    var SCROLL_WIDTH = 50,
        // 任务宽度
        TASK_WIDTH = 114,
        // 滚动一次的距离
        SCROLL_UNIT = 200,
        // 被占据的宽度 左侧导航和快捷菜单
        EXTRA_WIDTH = 0;

    var taskTempl = $.trim(METRO_TASK_TPL);

    // 调整TabsNav组件的宽度 适时显示、隐藏导航
    var adjustTabsNav = function () {
        var bd_w = $('body').width(),
            wrap_w = bd_w - SCROLL_WIDTH * 2 - EXTRA_WIDTH;

        $tasksWrap.css('width', wrap_w);

        var l = $taskList.find('.task-item').length,
            tasks_w = TASK_WIDTH * l;

        if (tasks_w > wrap_w) {
            $scrollWrap.removeClass('hidden');
        } else {
            $scrollWrap.addClass('hidden');

            // 复位.task-list
            $taskList.css('margin-left', 0);
        }
    };

    // contextmenu for .task-item
    var contextMenu = new EpContextMenu({
        items: [{
            text: '显示桌面',
            click: function (opt) {
                TabsNav.minAllTabs();
            }
        }, 'sep', {
            text: '关闭此任务',
            click: function (opt) {
                var id = opt.id;
                TabsNav.removeTab(id);
            }
        }, {
            text: '只显示此任务窗口',
            click: function (opt) {
                TabsNav.minAllTabs(opt.id);
            }
        }, 'sep', {
            text: '关闭其他任务',
            click: function (opt) {
                var id = opt.id;
                TabsNav.removeOthers(id);
            }
        }, {
            text: '关闭所有任务',
            click: function () {
                TabsNav.removeAll();
            }
        }, 'sep', {
            text: '取消',
            role: 'cancel'
        }]
    });

    var taskCache = {};

    // 只处理显示的、最大化的窗口
    var adjustTaskDialogSize = function () {
        var p, d;

        for (p in taskCache) {
            if (taskCache.hasOwnProperty(p)) {
                d = taskCache[p];

                if (d && !d.isHidden() && d.isMax()) {
                    d.maxWin();
                }
            }
        }
    };
    var containerSize = {
        width: $(win).width() - 66,
        height: $(win).height() - 50 - 40
    };

    win.TabsNav = {
        openTask: function (id) {
            var data = AppMgr.getAppData(id),
                dialog = null;
            if (!data) {
                return;
            }

            if (!taskCache[id]) {
                dialog = new EpDialog({
                    id: id + '-epdialog',
                    title: data.name,
                    url: data.url,
                    draggable: true,
                    resizable: true,
                    width: (data.widthRatio || METRO_SETTINGS.dialogSizeRadio[0]) * containerSize.width,
                    height: (data.heightRatio || METRO_SETTINGS.dialogSizeRadio[1]) * containerSize.height,
                    btns: [{
                        role: 'min',
                        title: '最小化',
                        click: function () {
                            this.hide();
                        }
                    }, {
                        role: 'maxwin',
                        title: '最大化'
                    }, {
                        role: 'refresh',
                        title: '刷新'
                    }, {
                        role: 'close',
                        title: '关闭',
                        click: function (opt) {
                            TabsNav.removeTab(opt.id);
                            return false;
                        }
                    }]
                }).setOptions('id', id);

                if (data.isFullView) {
                    dialog.show(0, 0).maxWin();
                } else {
                    dialog.show(0, 1);
                }

                taskCache[id] = dialog;
            } else {
                dialog = taskCache[id];

                dialog.show(0, 0);
            }
        },

        // 最小化所有任务窗口，除了指定id的任务
        minAllTabs: function (id) {
            var p, d;

            for (p in taskCache) {
                if (taskCache.hasOwnProperty(p)) {
                    d = taskCache[p];

                    if (p != id) {
                        d.hide();
                    } else {
                        d.show(0, 0);

                        TabsNav.activeTask(p);
                    }
                }
            }
        },

        // 添加任务项，并高亮
        addOrActiveTask: function (id) {
            var isOn = taskCache[id],
                data = AppMgr.getAppData(id);
            if (!data) {
                return;
            }

            if (!isOn) {
                $(Mustache.render(taskTempl, {
                    id: data.id,
                    name: data.name,
                })).appendTo($taskList);

                adjustTabsNav();
            }

            TabsNav.openTask(id);
            TabsNav.activeTask(id);
        },

        // 调节任务位置在可视范围内
        makeTaskVisiable: function (id) {
            var $task = TabsNav.getTask(id),
                $prevAll = $task.prevAll(),

                prev_w = $prevAll.length * TASK_WIDTH,

                mL = Math.abs(Util.toInt($taskList.css('margin-left'))),
                wrap_w = $tasksWrap.width(),

                dis = 0;

            if (prev_w < mL) {
                dis = prev_w;
            } else if (prev_w + TASK_WIDTH - wrap_w > mL) {
                dis = prev_w + TASK_WIDTH - wrap_w;
            }

            if (!dis) return;

            $taskList.stop(true)
                .animate({
                    marginLeft: -dis
                }, 300);
        },

        // 获取任务元素
        getTask: function (id) {
            return $taskList.find('[data-id="' + id + '"]');
        },

        // 移除任务
        removeTab: function (id) {
            var $task = TabsNav.getTask(id);

            if (!$task.length) return;

            $task.remove();

            taskCache[id].hide().destroy();
            taskCache[id] = null;
            delete taskCache[id];

            adjustTabsNav();
        },

        // 移除除了指定id的所有任务
        removeOthers: function (stayId) {
            var $tasks = $taskList.find('.task-item');

            if (!$tasks.length) return;

            $tasks.each(function (i, el) {
                var $el = $(el),
                    id = $el.data('id');

                if (stayId != id) {
                    $el.remove();

                    taskCache[id].hide().destroy();
                    taskCache[id] = null;
                    delete taskCache[id];

                }
            });

            adjustTabsNav();
        },

        // 移除所有任务
        removeAll: function () {
            var $tasks = $taskList.find('.task-item');

            if (!$tasks.length) return;

            $tasks.each(function (i, el) {
                var $el = $(el),
                    id = $el.data('id');

                $el.remove();

                taskCache[id].hide().destroy();
                taskCache[id] = null;
                delete taskCache[id];
            });

            adjustTabsNav();
        },

        // 激活任务
        activeTask: function (id) {
            var $task = TabsNav.getTask(id);

            if (!$task.hasClass('active')) {
                $task.addClass('active')
                    .siblings()
                    .removeClass('active');
            }

            // make active task visiable
            TabsNav.makeTaskVisiable(id);
        }
    };

    $(win).on('resize', Util.debounce(function () {
        containerSize = {
            width: $(win).width() - 66,
            height: $(win).height() - 50 - 40
        };
        adjustTabsNav();
        adjustTaskDialogSize();
    }, 50));

    // 向左
    $taskBar
        .on('click', '.scroll-l', function (event) {
            var mL = Math.abs(Util.toInt($taskList.css('margin-left'))),
                dis = mL - SCROLL_UNIT;

            // 已到头
            if (!mL) return;

            if (dis < 0) dis = 0;

            $taskList.stop(true)
                .animate({
                    marginLeft: -dis
                }, 200);

            // 向右
        })
        .on('click', '.scroll-r', function (event) {
            var mL = Math.abs(Util.toInt($taskList.css('margin-left'))),

                total_w = $taskList.find('.task-item').length * TASK_WIDTH,
                wrap_w = $tasksWrap.width(),
                delta = total_w - wrap_w;

            dis = mL + SCROLL_UNIT;

            // 已到末尾
            if (mL == total_w - wrap_w) return;

            if (dis > delta) {
                dis = delta;
            }

            $taskList.stop(true)
                .animate({
                    marginLeft: -dis
                }, 300);

            // 点击任务项
        }).on('click', '.task-item', function (event) {
            var $el = $(this),
                id = $el.data('id'),
                d = taskCache[id];

            if (!$el.hasClass('active')) {
                $el.addClass('active')
                    .siblings()
                    .removeClass('active');

                d.show(0, 0);
            } else {
                d.toggle();
            }

            // 支持contextmenu快捷操作
        }).on('contextmenu', '.task-item', function (event) {
            var id = $(this).data('id');

            contextMenu.setOptions('id', id).show({
                x: event.pageX,
                y: event.pageY
            });

            return false;
        });

    // epdialog - HD 点击时切换到最上
    $('body').on('click', '.epdialog-hd', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // 只有点击头部才触发，需要排除右侧按钮
        if (!/^epdialog-hd(?!-btn)/.test(e.target.className)) return;
        var dialogId = $(this).parent('.epdialog')[0].id,
            appId = dialogId.replace(/(.+)-epdialog$/, '$1');

        if (appId) TabsNav.addOrActiveTask(appId);
    });

    adjustTabsNav();

}(this, jQuery));

// 退出系统
(function (win, $) {
    var $topBtns = $('#metro-top-bar .top-btns');
    $topBtns.on('click', '.logout', function (event) {
        event.preventDefault();
        mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
            if (action == 'ok') {
                if (win.onLogout) {
                    eMsgSocket && eMsgSocket.close();
                    win.onLogout();
                }
            }
        });
        // logoutConfirm.show(true);
    });
}(this, jQuery));

// 消息提醒
(function (win, $) {
    var $msgSound = $('#msg-sound');
    var SOUND_URL = '../../msgsound/sound.html';

    var ROLLER_TEXT = '您有新消息提醒，请点击查看！',
        rollerTip = ROLLER_TEXT,
        timer = 0,
        title = '';
    // 消息滚动
    var rollDocTitle = function () {
        // 优先取后端返回的标题
        title = win.systemTitle || document.title;

        document.title = rollerTip;

        clearTimeout(timer);

        timer = setTimeout(function roll() {
            document.title = rollerTip.substring(1, rollerTip.length) + rollerTip.substring(0, 1);
            rollerTip = document.title;

            timer = setTimeout(roll, 300);
        }, 300);
    };

    // 停止滚动
    var restoreDocTitle = function () {
        clearTimeout(timer);

        document.title = title || document.title;
        rollerTip = ROLLER_TEXT;
    };
    // 标题滚动
    var docTitle = {
        roll: rollDocTitle,
        stop: restoreDocTitle
    };
    var parseNum = function (num) {
        var n = parseInt(num, 10);

        if (n > 99) {
            return '99+';
        } else if (n <= 0) {
            return '';
        }

        return n + '';
    };
    /**
     * 播放新消息的声音提醒
     *
     * @param {number}  retryLimit chrome 下用户未操作的最大播放次数
     */
    var playNewMsgSound = (function ($msgSoundContainer, soundIframeUrl, soundFileUrl) {
        // 关闭则不用播放提醒
        if (Util.getFrameSysParam('messageSound') === false) {
            return Util.noop;
        }
        soundIframeUrl = Util.getRightUrl(soundIframeUrl);

        // IE 构造 iframe 播放
        if (Util.browsers.isIE) {
            var $soundIframe = $('<iframe src="" frameborder="0" class="hidden"></iframe>').appendTo($msgSoundContainer);
            return function () {
                $soundIframe[0].src = soundIframeUrl + '?_=' + +new Date();
            };
        }

        // 其他情况使用 audio 标签即可
        var msgAudio = document.createElement('audio');
        msgAudio.src = Util.getRightUrl(soundFileUrl);
        msgAudio.className = 'hidden-accessible';
        $msgSoundContainer.append(msgAudio);
        var newMsgAudioTimer = null;
        /**
         * @param {number | undefined}  retryLimit chrome 下用户未操作的最大播放次数
         */
        return function doPlayNewMsgAudio(retryLimit) {
            if (retryLimit === undefined) {
                retryLimit = 100;
            }
            msgAudio.play()['catch'](function () {
                clearTimeout(newMsgAudioTimer);
                if (retryLimit > 0) {
                    newMsgAudioTimer = setTimeout(function () {
                        doPlayNewMsgAudio(--retryLimit);
                    }, 50);
                }
            });
        };
    })($msgSound, SOUND_URL, '../../msgsound/newsms.wav');

    // check unread message
    var getMsgCount = function (useCache) {
        var params = {
            haseXun: true,
            needNum: true
        };
        if (useCache) {
            params.inCache = true;
        }
        return Util.ajax({
            url: win.MetroDataActionUrl.msgCountUrl,
            dataType: 'json',
            global: false,
            data: {
                haseXun: true, // 是否包含eXun 消息数目
                needNum: true // 是否需要实际的提醒数目
            }
        }).done(updateMsgCount);
    };

    var $topBtns = $('#top-btns'),
        $remind = $('.msg-remind', $topBtns),
        $remindNum = $('.unread', $remind),
        $chat = $('.chat', $topBtns),
        $eMsgNum = $('.unread', $chat),
        $msgEMsg = $('#msgEMsg'),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent),
        $onlineUserNum = $('.online-user-num', $msgEMsg),
        onlineUserIframe = document.getElementById('online-user');

    function updateMsgCount(data) {
        var old = 0,
            hasNew = false;

        if (data.remind) {
            old = parseInt($remindNum.data('num'), 10) || 0;
            if (data.remind > old) {
                hasNew = true;
            }
            $remindNum.removeClass('hidden').text(parseNum(data.remind));
            $remindNum.data('num', data.remind);
        } else {
            $remindNum.text('').addClass('hidden');
        }
        if (data.eXun) {
            old = parseInt($eMsgNum.data('num'), 10) || 0;
            if (data.eXun > old) {
                hasNew = true;
            }
            $eMsgNum.removeClass('hidden').text(parseNum(data.eXun));
            $eMsgNum.data('num', data.eXun);
        } else {
            $eMsgNum.text('').addClass('hidden');
        }

        if (hasNew) {
            // 播放提醒 并滚动标题
            playNewMsgSound(100);
            // 标题滚动
            docTitle.roll();
        } else {
            // 停止标题滚动
            docTitle.stop();
        }
    }

    // exun 列表
    var emsgList;

    var loadEMsgList = function () {
        loadEMsgList = Util.noop;
        /* global EMsgList,EmsgConfig */
        return Util.loadJs('frame/fui/js/widgets/emsglist/emsglist.js', function () {
            emsgList = new EMsgList({
                content: $msgEMsgRecent,
                getUrl: EmsgConfig.baseUrl,
                ignoreUrl: EmsgConfig.baseUrl,
                userImg: EmsgConfig.userImg,
                groupImg: EmsgConfig.groupImg,
                afterOpenEMsg: function () {
                    toggleEmsgList(false);
                },
                onDecEmsgCount: function () {
                    var cnt = $eMsgNum.text();
                    if (cnt) {
                        cnt = parseInt(cnt, 10) - 1;
                    }
                    if (cnt == 0) {
                        cnt = '';
                        $eMsgNum.data('num', 0).addClass('hidden');
                    }
                    $eMsgNum.text(cnt);
                }
            });

            win.RefreshEMsg = $.proxy(emsgList.getData, emsgList);
            toggleEmsgList(true);
        });
    };
    $chat.on('click', function () {
        if (!emsgList) {
            return loadEMsgList();
        }

        toggleEmsgList(!$chat.hasClass('active'));
    });
    $msgEMsg.find('.msg-panel-hide').on('click', function () {
        toggleEmsgList(false);
    });
    $(document).on('click', function (ev) {
        var $target = $(ev.target);
        // 不在面板 且 不在触发按钮内
        if (!$target.closest($msgEMsg.add($chat)).length) {
            toggleEmsgList(false);
        }
    });

    function toggleEmsgList(active) {
        if (active) {
            return show();
        }
        hide();

        function show() {
            $chat.addClass('active');
            $msgEMsg.removeClass('hidden');
            $msgEMsg.stop(true).animate({
                right: 0
            });
        }

        function hide() {
            $msgEMsg.stop(true).animate({
                right: -350
            }, function () {
                $msgEMsg.addClass('hidden');
            });

            $chat.removeClass('active');
        }
    }
    /* global OnlineUserSettings */
    if (win.OnlineUserSettings && win.OnlineUserSettings.show) {
        $msgEMsg
            .find('.msg-panel-head')
            .addClass('tab')
            .find('.panel-hd-tab.hidden')
            .removeClass('hidden');

        onlineUserIframe.src = OnlineUserSettings.url;

        $msgEMsg.on('click', '.panel-hd-tab', function () {
            var $this = $(this),
                ref = $this.data('ref'),
                hasShow = $this.data('hasShow'),
                $content = $msgEMsgRecent;

            if (!$this.hasClass('active')) {
                $this
                    .addClass('active')
                    .siblings()
                    .removeClass('active');

                if (ref) {
                    $content = $('#' + ref, $msgEMsgContent);

                    if (!hasShow) {
                        setTimeout(function () {
                            OnlineUserSettings.onRefreshData(function (count) {
                                $onlineUserNum.html(count);
                            });
                            $this.data('hasShow', true);
                        }, 10);
                    }
                }

                $content
                    .removeClass('hidden')
                    .siblings()
                    .addClass('hidden');
            }
        });
    }


    // 界面信息完成后再开始获取新消息
    _MetroEvent_.on('afterPageInfo', function () {
        getMsgCount(false);

        if (!useWebsocket) {
            setInterval(function () {
                getMsgCount(true);
            }, 60000);
        }
    });

}(this, jQuery));

// 默认应用初始化
(function (win, $) {
    var $topBtns = $('#metro-top-bar .top-btns');

    $.each(win.defaultApps, function (i, data) {
        data = Util.fixPath(data);

        AppMgr.cacheAppData(data.id, data);
    });

    $topBtns.on('click', '.default-app-btn', function (event) {
        event.preventDefault();

        var id = $(this).data('id');

        AppMgr.openApp(id);
    });

}(this, jQuery));

/*
 * 打开E讯聊天窗口
 * sessionid 会话id，当传入一个参数时sessionid表示uid
 * uid 对方用户id
 * type 个人：friend 讨论组：group
 */
var eMsgSocket;
window.OpenEMsg = function (sessionid, uid, type) {

    if (window.eMsg) {
        if (typeof uid == 'undefined') {
            eMsg.open(sessionid);
        } else {
            eMsg.openSession(sessionid, uid, type);
        }
    } else {
        Util.loadPageModule({
            templ: 'frame/fui/pages/emsg/emsg.tpl',
            js: 'frame/fui/pages/emsg/emsg.js',
            css: 'frame/fui/pages/emsg/emsg.css',
            callback: function () {
                // eMsg = new EMsgDialog();
                eMsgSocket = new EMsgSocket(_userGuid_, _userName_);
                if (typeof uid == 'undefined') {
                    eMsg.open(sessionid);
                } else {
                    eMsg.openSession(sessionid, uid, type);
                }
            }
        });
    }
};

// 门户相关
(function (win, $) {
    var PORTAL_ITEM_TPL = '<li class="portal-item" data-id="{{code}}" data-url="{{url}}" data-opentype="{{openType}}" title="{{name}}"><span class="portal-icon {{icon}}"></span><span class="portal-name">{{name}}</span></li>';
    var $portalBtn = $('#portal-btn'),
        $portalWrap = $('#portal-wrap'),
        $portalContent = $('#portal-content'),
        $portal = $portalBtn.add($portalWrap),
        $boardPanel = $('#board-panel');

    function initPortal(homes, defaultHome) {
        if (!homes) {
            console.error('未获取到门户数据');
            $portalBtn.addClass('hidden');
            return;
        }
        var home = {
            closeIcon: false,
            refresh: true
        };
        // 记录无分类的门户
        var singleHomes = [];
        // 默认展示后端配置的 或者 第一个openType为tabnav的
        // 遍历一次 处理分类和不带分类的
        // 同时寻找 默认门户
        // todo 这里面干了太多的事情 待优化
        for (var i = 0; i < homes.length; i++) {
            var cate = homes[i];
            var finded = false;

            // 带分类的
            // if (cate.items && cate.items.length) {
            if (cate.items != undefined) {
                // 寻找默认门户或 第一个带url的用于默认值
                !finded &&
                    $.each(cate.items, function (j, item) {
                        if (defaultHome) {
                            // server set
                            if (item.code == defaultHome) {
                                home.id = item.code || 'home';
                                home.url = item.url;
                                home.name = item.name;
                                finded = true;
                                return false;
                            }
                        } else {
                            // the first
                            if (item.openType == 'tabsnav') {
                                home.id = item.code || 'home';
                                home.url = item.url;
                                home.name = item.name;
                                finded = true;
                                return false;
                            }
                        }
                    });
            } else {
                if (!finded) {
                    if (defaultHome) {
                        // server set
                        if (cate.code == defaultHome) {
                            home.id = cate.code || 'home';
                            home.url = cate.url;
                            home.name = cate.name;
                            finded = true;
                        }
                    } else {
                        // the first
                        if (cate.openType == 'tabsnav') {
                            home.id = cate.code || 'home';
                            home.url = cate.url;
                            home.name = cate.name;
                            finded = true;
                        }
                    }
                }
                // 不带分类的
                // singleHomes.push(homes.splice(i, 1));
                singleHomes = singleHomes.concat(homes.splice(i, 1));
                i--;
            }
        }

        initView(singleHomes, homes);
        initEvent(home);
    }

    function initEvent(defaultHome) {
        // var $cover = createMainContentCover();
        // var $cover = $('');

        // 顶部点击切换
        $portalBtn.on('click', function () {
            togglePortal(!$portal.hasClass('active'));
        });
        $portalWrap
            // .on('click', '.portal-header', function () {
            //     // 点击打开默认的
            //     TabsNav.addTab(defaultHome);

            // })
            // 点击打开门户
            .on('click', '.portal-item', function () {
                var $this = $(this),
                    openType = $this.data('opentype'),
                    url = Util.getRightUrl($this.data('url'));

                openType == 'blank' ? win.open(url) : BoardCenter.show($(this).data('id'));
                togglePortal(false);
            })
            // 分类点击切换
            .on('click', '.portal-cate', function () {
                var $block = $(this).parent();
                $block.toggleClass('collapse');
            });

        // 点击隐藏
        $boardPanel.on('click', '.board-close', function () {
            BoardCenter.hide();
        });

        function togglePortal(show) {
            if (show) {
                $portal.addClass('active');
                // $cover.removeClass('hidden');
                TabsNav.minAllTabs();
                BoardCenter.hide();
                return;
            }

            $portal.removeClass('active');
            // $cover.addClass('hidden');
        }
        // 空白点击隐藏
        $('body').on('click', function (ev) {
            if (!$(ev.target).closest($portal).length) {
                togglePortal(false);
            }
        });

        // 门户面板高度处理
        var $portalPanel = $portal.find('.portal');

        function adjustPortalHeight() {
            var h = $(win).height() - 140;
            h > 0 && $portalPanel.css('max-height', h);
        }
        adjustPortalHeight();
        $(win).on('resize', Util.debounce(adjustPortalHeight, 17));
    }

    function initView(singleHomes, homes) {
        var html = [];
        // 无分类的
        if (singleHomes) {
            html.push('<ul class="portal-list">');
            $.each(singleHomes, function (i, item) {
                item.icon = item.icon || 'default-modicon';
                html.push(Mustache.render(PORTAL_ITEM_TPL, item));
                BoardCenter.data[item.code] = item;
            });
            html.push('</ul>');
        }

        // 带分类的
        $.each(homes, function (i, cate) {
            // 根据条数计算下最大高度，用于优化动画效果
            html.push('<div class="portal-block"><h3 class="portal-cate">' + cate.name + '<span class="portal-cate-trigger"></span></h3><ul class="portal-list" style="max-height:' + 30 * cate.items.length + 'px">');
            $.each(cate.items, function (j, item) {
                item.icon = item.icon || 'default-modicon';
                html.push(Mustache.render(PORTAL_ITEM_TPL, item));
                BoardCenter.data[item.code] = item;
            });
            html.push('</ul></div>');
        });

        $(html.join('')).appendTo($portalContent);
    }
    /* global BoardCenter */
    // 显示看板
    win.BoardCenter = {
        // 数据
        data: {},
        // 是否已渲染
        cache: {},
        show: function (id) {
            var $target;
            if (!this.cache[id]) {
                $target = this.cache[id] = renderBoardIframe(id);
            } else {
                $target = this.cache[id];
            }
            // 最小化所有任务
            TabsNav.minAllTabs();

            $boardPanel.removeClass('hidden');
            $target
                .removeClass('hidden')
                .siblings('.board-content')
                .addClass('hidden');
        },
        hide: function () {
            $boardPanel.addClass('hidden');
        }
    };
    // 渲染看板内容
    var renderBoardIframe = function (id) {
        return $(Mustache.render(BOARD_CONTENT_TPL, BoardCenter.data[id])).appendTo($boardPanel);
    };
    _MetroEvent_.on('afterPageInfo', function (ev) {
        initPortal(ev.data.homes, ev.data.defaultHome);
    });
})(this, jQuery);

// 常用应用
(function (win, $) {
    var $leftBar = $('#left-bar'),
        $quickApps = $('#common-apps'),
        $list = $('.list-wrap', $quickApps),
        $cfgBtn = $('.common-cfg-btn', $quickApps);

    // 上方元素高度
    var PREV_HEIGHT = $('#portal-btn').outerHeight(true) || 50,
        // 下方元素高度
        NEXT_HEIGHT = 0,
        // 配置按钮高度
        CFG_BTN_HEIGHT = 50,
        wrap_h = 0;
    // 应用列表初始化滚动条
    Util.doNiceScroll($list, {
        cursorwidth: '2px',
        cursorcolor: 'rgba(0,0,0,.3)',
        cursorborder: '1px solid rgba(0,0,0,.6)',
        horizrailenabled: false
    });

    // 调整应用wrap的高度
    var adjustListHeight = function () {
        PREV_HEIGHT = $quickApps.position().top;

        var h = $leftBar.height();
        wrap_h = h - (PREV_HEIGHT + NEXT_HEIGHT);

        $quickApps.css('height', wrap_h);
        $list.css('max-height', wrap_h - CFG_BTN_HEIGHT);
    };

    // resize 时更新
    $(win).on('resize', Util.debounce(adjustListHeight, 50));
    /* global QuickApps */
    win.QuickApps = {
        isInit: false,
        init: function () {
            if (QuickApps.isInit) return;

            adjustListHeight();
            QuickApps._init();
        },
        _init: function () {
            return this.getData().done(function (data) {
                QuickApps._initView(data)._initEvent();
            });
        },
        update: function () {
            return this._init();
        },
        getData: function () {
            return Util.ajax({
                url: MetroDataActionUrl.commonAppsUrl
            });
        },
        _initView: function (data) {
            if (!data || !data.length) {
                return this;
            }
            var html = [];
            $.each(data, function (i, item) {
                item = Util.fixPath(item);
                item.sname = Util.getAppShortName(item.name);
                if (parseInt(item.count, 10) > 99) {
                    item.count = '99';
                }

                if (!item.id) {
                    item.id = item.code;
                }
                // 缓存数据
                if (!AppMgr.getAppData(item.id)) {
                    AppMgr.cacheAppData(item.id, item);
                }
                if (item.icon) {
                    item.icon = Util._genderIconHtml(item.icon, 'common-app-icon');
                }
                html.push(Mustache.render(COMMON_APP_TPL, item));
            });
            $(html.join('')).appendTo($list.empty());
            $cfgBtn.removeClass('hidden');
            return this;
        },
        _initEvent: function () {
            // 点击打开应用
            !this.isInit && $quickApps.on('click', '.common-app', function () {
                var id = $(this).data('id');
                AppMgr.openApp(id);
            });
            return this;
        }
    };

    _MetroEvent_.on('afterAllAppsLoad', QuickApps.init);

    var cfgUrl = MetroDataActionUrl.commonAppCfgUrl;
    var themeId = (function () {
        var themeMatch = location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
            theme = themeMatch && themeMatch[1];
        return theme;
    })();
    var pageId = Util.getUrlParams('pageId') || themeId;
    cfgUrl = Util.addUrlParams(cfgUrl, {
        themeId: themeId,
        pageId: pageId
    });

    var isCfgOpened = false;
    // 应用配置
    $cfgBtn.on('click', function () {
        if (isCfgOpened) {
            return;
        }
        isCfgOpened = true;
        var opt = {
            width: 920,
            height: 500
        };
        var win_size = Util.getWinSize();
        if (win_size.height < opt.height) {
            opt.height = win_size.height;
        } else {
            opt.height = win_size.height * .6 >> 0;
        }
        if (win_size.width < opt.width) {
            opt.width = win_size.width;
        }
        epoint.openDialog('常用应用配置', cfgUrl, function (isChanged) {
            if (isChanged === true) {
                QuickApps.update();
            }
            isCfgOpened = false;
        }, opt);
    });

})(this, jQuery);

// 应用中心
(function (win, $) {
    var appCenterUrl = 'frame/fui/js/widgets/appcenter/appcenter.js';
    var appCenter = null;

    function appCenterHandler() {
        if (appCenter) {
            appCenter.show();
            return;
        }
        loadAppCenter();
    }

    var loadAppCenter = function () {
        // 仅加载一次且回调也仅执行一次即可
        loadAppCenter = Util.noop;
        return Util.loadJs(appCenterUrl, function () {
            appCenter = new AppCenterDialog({
                getDataUrl: MetroDataActionUrl.appCenterDataUrl,
                on: {
                    show: function () {
                        $appStoreBtn.addClass('active');
                    },
                    hide: function () {
                        $appStoreBtn.removeClass('active');
                    },
                    installApp: function (ev) {
                        var data = ev.data;
                        // alert('安装应用- ' + data.id);
                        console.log(data);

                        AppMgr.installApp(data, function () {
                            appCenter._afterInstallApp(data.id);
                        });
                    },
                    uninstallApp: function (ev) {
                        var data = ev.data;
                        // alert('卸载应用- ' + data.id);
                        AppMgr.uninstallApp(data.id, function () {
                            this._afterUninstallApp(data.id);
                        });
                    }
                }
            });
            appCenter.show();
        });
    };

    var $appStoreBtn = $('#top-btns .appstore');
    $appStoreBtn.on('click', appCenterHandler);

}(this, jQuery));

// 全文检索入口
(function (win, $) {
    var $headerSearch = $('#header-search-container');

    function doSearch(type, kw) {
        type = type || 'all';
        // try {
        //     TabsNav.removeTab('fullsearch');
        // } catch (error) {}
        win.open(win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type, 'fullsearch');
    }

    function getCateData() {
        return Util.ajax({
            url: win._searchCfg.fullSearchCateUrl
        }).done(function (data) {
            initTopFullSearch(data.categories);
        });
    }

    function initTopFullSearch(cateData) {
        cateData = cateData || [];

        if (typeof cateData == 'string') {
            cateData = JSON.parse(cateData);
        }

        var cates = [];
        $.each(cateData, function (i, item) {
            cates.push({
                id: item.guid,
                name: item.name,
                iconCls: item.icon || 'view'
            });
        });
        if (!cates.length) {
            cates.push({
                id: 'all',
                name: '全文检索',
                iconCls: 'modicon-25'
            });
        }

        // 初始化组件
        /* global ClassifySearch */
        // 禁止组件内部加载样式文件
        ClassifySearch._styleLoaded = true;
        ClassifySearch.CLASSIFICATION_TPL = '<div class="classify-search-classify-item {{#isActive}}active{{/isActive}}" data-id="{{id}}" data-title-tpl="与${keyword}相关的{{name}}"><span class="classify-search-classify-icon {{iconCls}}"></span>与<span class="classify-search-classify-kw"></span>相关的{{name}}<span class="classify-search-classify-target hidden">{{target}}</span></div>';
        // 创建遮罩
        // ClassifySearch._$pageCover = createMainContentCover();
        var classifySearch = new ClassifySearch({
            id: 'header-search-container', // 绑定的容器id
            searchTarget: '内容', // 搜索目标
            category: cates,
            placeholder: '请输入', // 输入框placeholder内容
            maxShowCharacter: 3, // 下拉区域显示的最大关键字字符数
            enter: function (id, key) {
                // 回车，回车不会执行keyup
                // console.log('回车事件返回 id:' + id + 'key:' + key);
                doSearch(id, key);
            }
        });

        dealUserAppSearch(classifySearch);

        // 进入搜索时 隐藏应用
        classifySearch.$input.on('focus', function () {
            TabsNav.minAllTabs();
        });
    }

    // 处理用户和模块的实时搜索
    function dealUserAppSearch(classifySearch) {
        var $userItem = classifySearch.$classifyList.find('[data-id="user"]'),
            $appItem = classifySearch.$classifyList.find('[data-id="app"]');

        if (!$userItem.length || !$appItem.length) {
            return;
        }

        var $userList = $('<ul class="fulltext-search-user-list"></ul>'),
            $appList = $('<ul class="fulltext-search-app-list"></ul>');
        if ($userItem.length) {
            // $userList.appendTo($userItem);
            $userList.insertAfter($userItem);
            $userList.on('click', '.fulltext-search-user-item', function () {
                // epoint.showTips(this.getAttribute('data-id'));
                /* global _searchCfg */
                _searchCfg.userClick && _searchCfg.userClick(this.getAttribute('data-id'), this.title);
                classifySearch.$input.blur().val('');
                classifySearch.hidePopup();
            });
        }
        if ($appItem.length) {
            $appList.insertAfter($appItem);
            $appList.on('click', '.fulltext-search-app-item', function () {
                var $this = $(this);
                $this.data('url') &&
                    dealLinkOpen({
                        id: $this.data('id'),
                        name: this.title,
                        url: $this.data('url'),
                        openType: $this.data('opentype')
                    });
                classifySearch.$input.blur().val('');
                classifySearch.hidePopup();
            });
        }

        var timer;
        // enter,ctrl,shift,alt,esc,arrow*4
        var ignoreCodes = [13, 16, 17, 18, 27, 37, 38, 39, 40];
        var isSupportInput = (function () {
            var input = document.createElement('input');
            return 'oninput' in input;
        })();
        // keyup 会触发很多无用的搜索，需要对键码进行过滤，比较麻烦，支持input则优先使用
        if (isSupportInput) {
            classifySearch.$input.on('input', function () {
                clearTimeout(timer);
                timer = setTimeout(immediatelySearch, 50);
            });
        } else {
            classifySearch.$input.on('keyup', function (ev) {
                if ($.inArray(ev.which, ignoreCodes) != -1) return;
                clearTimeout(timer);
                timer = setTimeout(immediatelySearch, 50);
            });
        }
        // 设置一个历史搜索值时 也立即搜索
        classifySearch.$input.on('setHistoryValue', immediatelySearch);

        // 记录最后一次的请求
        var lastRequest;

        var USER_ITEM_TPL = '<li class="fulltext-search-user-item" data-id="{{guid}}" title="{{name}}" ><img class="fulltext-search-user-item-img" src="{{portrait}}" >{{{hlname}}}</li>';

        var APP_ITEM_TPL = '<li class="fulltext-search-app-item" data-id="{{code}}" title="{{name}}" data-opentype="{{openType}}" data-url="{{url}}"><img class="fulltext-search-app-item-icon" src="{{icon}}"/>{{{hlname}}}</li>';

        function immediatelySearch() {
            var value = $.trim(classifySearch.$input.val());

            /* global _searchCfg.userModuleSearchUrl */
            if (lastRequest) {
                lastRequest.abort();
            }
            if (!value) {
                return;
            }
            lastRequest = Util.ajax({
                url: epoint.dealRestfulUrl(_searchCfg.userModuleSearchUrl),
                data: {
                    cnum: 'user,app',
                    key: value,
                    rn: 3,
                    location: 'search'
                }
            });

            lastRequest.done(function (res) {
                var data = mini.decode(res.frameinfo);
                var userHTML = [],
                    appsHTML = [],
                    hlReg = new RegExp(value, 'ig');
                data.users &&
                    $.each(data.users, function (i, item) {
                        item.portrait = Util.getRightUrl(item.portrait);
                        item.hlname = item.name.replace(hlReg, '<span class="fulltext-search-kw">' + value + '</span>');
                        userHTML.push(Mustache.render(USER_ITEM_TPL, item));
                    });
                data.apps &&
                    $.each(data.apps, function (i, item) {
                        item.icon = Util.getRightUrl(item.icon);
                        item.hlname = item.name.replace(hlReg, '<span class="fulltext-search-kw" >' + value + '</span>');
                        appsHTML.push(Mustache.render(APP_ITEM_TPL, item));
                    });
                $(userHTML.join('')).appendTo($userList.empty());
                $(appsHTML.join('')).appendTo($appList.empty());
            });
        }
    }

    // 获取到全文检索地址后再进行初始化
    _MetroEvent_.on('afterPageInfo', function () {
        if (win._fullSearchUrl_) {
            getCateData();
        }
    });
})(this, jQuery);

// 消息中心集成
(function (win, $) {
    var msgCenterUrl = 'frame/fui/js/widgets/msgcenter/msgcenter.js';

    function initMsgCenter(data) {
        var msgcenterConfig = $.extend({}, MsgCenterConfig, {
            isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
            msgCenterOrder: data.msgCenterOrder || 'asc',
            hideCallback: function () {
                // $cover.addClass('hidden');
            }
        });

        var msgCenter = null;

        var $msgRemindBtn = $('#top-btns .msg-remind');

        var loadMsgCenter = function () {
            loadMsgCenter = Util.noop;
            return Util.loadJs(msgCenterUrl, function () {
                msgCenter = new MsgCenter(msgcenterConfig);
                msgCenter.show();
            });
        };

        $msgRemindBtn.on('click', function () {
            if (!msgCenter) {
                // msgCenter = new MsgCenter(msgcenterConfig);
                return loadMsgCenter();
            }
            if (!msgCenter.isShow) {
                msgCenter.show();
                // updateMsgRemindNum();
            } else {
                msgCenter.hide();
            }
        });
    }

    _MetroEvent_.on('afterUserInfo', function (ev) {
        var data = ev.data;

        initMsgCenter(data);
    });
})(this, jQuery);

// 主题皮肤切换
(function (win, $) {
    var $themeBtn = $('#theme-switch');
    var themeSelection;

    var themeSelectionUrl = 'frame/fui/js/widgets/themeselection/themeselection.js';

    var loadThemeSelection = function () {
        loadThemeSelection = Util.noop;
        return Util.loadJs(themeSelectionUrl, function () {
            ThemeSelection._styleLoaded = true;
            themeSelection = new ThemeSelection({
                getPagesUrl: MetroDataActionUrl.getPagesUrl,
                savePageUrl: MetroDataActionUrl.savePageUrl,
                hideCallback: function () {
                    $themeBtn.removeClass('active');
                }
            });
            win.themeSelection = themeSelection;
            themeSelection.show();
            $themeBtn.addClass('active');


            $('body').on('click', function (e) {
                var $target = $(e.target);
                if (!$target.closest('.theme-selection-container, #theme-switch').length) {
                    $themeBtn.removeClass('active');
                    themeSelection.hide();
                }
            });
        });
    };

    function initThemeSkin() {
        $themeBtn.on('click', function () {
            if (!themeSelection) {
                return loadThemeSelection();
            }
            if ($themeBtn.hasClass('active')) {
                $themeBtn.removeClass('active');
                themeSelection.hide();
            } else {
                themeSelection.show();
                $themeBtn.addClass('active');
            }
        });
    }

    initThemeSkin();
    /* global ThemeSelection */
})(this, jQuery);
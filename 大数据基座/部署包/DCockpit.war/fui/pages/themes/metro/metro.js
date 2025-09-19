/* jshint -W030 */
// 应用模板
var METRO_APP_TPL = '<div class="metro-app" data-id="{{id}}" title="{{name}}" style="top:{{top}}px;left:{{left}}px;width:{{width}}px;height:{{height}}px;"><div class="app-inner" style="background-color:{{bgcolor}}">{{#innerUrl}}<iframe src="{{innerUrl}}" frameborder="0" width="{{ifrWidth}}" height="{{ifrHeight}}" allowtransparency="true" class="app-iframe" scrolling="no"></iframe>{{/innerUrl}}{{#icon}}<img src="{{icon}}" class="app-icon" alt="">{{/icon}}<p class="app-name">{{name}}</p>{{#count}}<span class="unread">{{count}}</span>{{/count}}</div></div>',
    // 屏幕模板
    METRO_SCREEN_TPL = '<div class="screen-item l"><div class="apps-wrap"></div></div>',
    // 左侧导航模板
    METRO_LEFTNAV_TPL = '<li class="left-nav-item page-item"><a href="javascript:void(0);" class="left-nav-link " data-page="{{page}}"  data-index="{{screenIndex}}"  title="{{name}}">{{#icon}}<i  class="left-nav-icon {{icon}}"  title="{{name}}"></i>{{/icon}}<span class="left-nav-text">{{name}}</span></a></li>',
    // 快捷菜单模板
    METRO_QUICK_MENU_TPL = '<li><a href="javascript:void(0);" url="{{url}}" index="{{index}}"><i class="{{icon}}"></i>{{name}}</a></li>',
    // 底部任务项模板
    METRO_TASK_TPL = '<a href="javascript:void(0);" data-id="{{id}}" class="task-item l clearfix" title="{{name}}"><p class="task-name">{{name}}</p></a>';


// 工具方法和组件扩展
(function (win, $) {
    EpDialog.setMaxCoord({
        top: 50,
        left: 0,
        right: 0,
        bottom: 40
    });

    // 扩展TipDialog组件
    // $.extend(TipDialog.prototype, {
    //  setMsgStyle: function(css) {
    //      this.$msg.css(css);

    //      return this;
    //  }
    // });

    $.extend(Util, {

        // 获取z-index 这里重写一下，使用miniui的，否则被遮住了
        getZIndex: function () {
            return mini.getMaxZIndex();
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

            if (copy.icon) {
                copy.icon = Util.getRightUrl(data.icon);
            }

            if (data.innerUrl) {
                copy.innerUrl = Util.getRightUrl(data.innerUrl);
            }

            return copy;
        },

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
        }
    });

}(this, jQuery));


// metro分屏模块 + 左侧导航
(function (win, $) {
    var $screensCon = $('#metro-screens'),

        $screenList = $('.screen-list', $screensCon),
        $leftNavList = $('#left-nav-list');

    // leftnav width
    var LEFT_NAV_WIDTH = 90,
        // leftnav scroll btn width,height
        LEFT_leftNavList_topEIHT = 30 + 30,

        // app width,height
        APP_UNIT_WIDTH = 240,
        APP_UNIT_HEIGHT = 115,

        APP_BORDER_WIDTH = 3,

        // width, height for .apps-wrap
        appsWrap_w = METRO_COLUMN_NUM * APP_UNIT_WIDTH,
        appsWrap_h = METRO_ROW_NUM * APP_UNIT_HEIGHT,

        // margin-top, margin-left for .apps-wrap
        appsWrap_mt = appsWrap_h / 2,
        appsWrap_ml = appsWrap_w / 2;

    // 分页码
    var PAGE_WIDTH = 16,
        PAGE_GAP = 15,
        // 页码个数，默认5个
        PAGE_NUM = 5;

    var activePage = DEFAULT_ACTIVE_PAGE - 1;

    var M = Mustache,
        screenTempl = $.trim(METRO_SCREEN_TPL),
        leftNavTempl = $.trim(METRO_LEFTNAV_TPL),
        appTempl = $.trim(METRO_APP_TPL);
    // 桌面应用右键菜单对象
    var appCm;

    // 调节分屏尺寸
    var adjustScreenSize = function () {
        var bs = Util.getBdSize();

        var wh = {
            width: bs.width - LEFT_NAV_WIDTH,
            height: bs.height
        };
        // $screensCon.css(bs);
        $screensCon.css(wh);
        // $screensCon.find('.screen-item').css(bs);
        $screensCon.find('.screen-item').css(wh);

        $screenList.css('margin-top', -activePage * bs.height);
    };


    // 绘制分屏
    var renderScreens = function (data) {
        var html = [],
            l = data.length,
            i = 0;

        for (; i < l; i++) {
            html.push(screenTempl);
        }

        $screenList.html(html.join(''));

        $screenList.find('.apps-wrap').css({
            marginTop: -appsWrap_mt,
            marginLeft: -appsWrap_ml,
            width: appsWrap_w,
            height: appsWrap_h
        });
    };

    // 绘制应用
    var renderApps = function (data) {
        $.each(data, function (page, screen) {
            renderScreenApps(page, screen);
        });
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

            el_t = (i % METRO_ROW_NUM) * APP_UNIT_HEIGHT,
            el_l = Util.toInt(i / METRO_ROW_NUM) * APP_UNIT_WIDTH,

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

    // 绘制单页应用
    var renderScreenApps = function (page, data) {
        if (!data || !data.screenApps) {
            return;
        }
        var $screen = $screenList.find('.screen-item').eq(page),
            screenIndex = data.leftNav.screenIndex,
            html = [];

        $.each(data.screenApps, function (i, item) {
            item = Util.fixPath(item);

            // 客户端所在页面索引，根据屏幕数据顺序自动生成
            item.page = page;
            // 唯一的索引，用于服务端权限控制
            item.screenIndex = screenIndex;

            html.push(M.render(appTempl,
                $.extend({}, item, getPropStyles(item))));

            AppMgr.cacheAppData(item.id, item);
        });

        $screen.find('.apps-wrap').html(html.join(''));
    };


    // 记录菜单，用于应用右键菜单移动时显示名称 和 获取屏幕真实索引
    var leftItems = [];

    // 绘制左侧导航
    var renderPages = function (data) {
        var l = data.length,
            leftData,
            html = [],
            i = 0;

        for (; i < l; i++) {
            leftData = data[i].leftNav || {};

            // 记录菜单名，用于应用右键菜单
            leftItems.push(leftData);

            html.push(M.render(leftNavTempl, {
                page: i,
                name: leftData.name,
                icon: leftData.icon,
                screenIndex: leftData.screenIndex
            }));

        }

        $leftNavList.html(html.join(''));

        PAGE_NUM = l;
    };
    // 左侧导航滚动事件
    var initLeftNavEvent = function () {
        var $leftNavWrap = $('#left-nav-wrap'),
            // $left
            $up = $leftNavWrap.find('.left-scroll-up'),
            $down = $leftNavWrap.find('.left-scroll-down');

        // 菜单内容高度
        var content_HEIGHT = $leftNavList.height(),
            // 可视高度 resize时更新
            view_height = $leftNavWrap.height() - LEFT_leftNavList_topEIHT,
            // 可滚动高度 resize时更新
            scroll_range = content_HEIGHT - view_height;

        // 滚动计时器
        var srcollTimer,
            // 导航margin-top值，自动更新
            leftNavList_top = 0;

        // resize 时计算高度，调整按钮可见性,调整尺寸，调整激活条目可见性
        $(window).on('resize', function () {

            calculateHeight();
            adjustBtnVisible();
            adjustActiveVisibile();
            adjustSize();

        });
        // 计算高度
        var calculateHeight = function () {
            // 调整可视宽度和滚动高度
            view_height = $leftNavWrap.height() - LEFT_leftNavList_topEIHT;
            scroll_range = content_HEIGHT - view_height;
        };
        // 调整按钮可见性
        var adjustBtnVisible = function () {
            // 需要滚动
            if (view_height < content_HEIGHT) {
                $up.removeClass('invisible');
                $down.removeClass('invisible');
            } else {
                $up.addClass('invisible');
                $down.addClass('invisible');
            }
        };
        adjustBtnVisible();
        // 调整尺寸
        var adjustSize = function () {
            //
            if (Math.abs(leftNavList_top) > Math.abs(scroll_range)) {
                $leftNavList.stop(true).animate({
                    marginTop: -scroll_range
                }, 300, function () {
                    leftNavList_top = Math.ceil(parseFloat($leftNavList.css('margin-top'), 10));
                });
            }
        };
        // 调整激活菜单可见性 屏幕切换时调用
        var adjustActiveVisibile = function () {
            // 无需滚动无时不用响应
            if ($down.hasClass('invisible')) return;

            var $activeItem = MetroScreen.getActiveNavItem(),
                item_h = $activeItem.outerHeight(),
                $prevs = $activeItem.prevAll(),
                prev_h = $prevs.length * item_h;

            var scroll_h = Math.ceil((Math.abs(parseFloat($leftNavList.css('margin-top'), 10)))),
                marginTop = scroll_h;

            if (prev_h < scroll_h) {

                marginTop = prev_h;

            } else if (prev_h >= (view_height + scroll_h)) {

                marginTop = prev_h + item_h - view_height;

            } else if (prev_h > scroll_h && prev_h < (view_height + scroll_h) && (prev_h + item_h) > (view_height + scroll_h)) {

                marginTop = prev_h + item_h - view_height;
            }

            $leftNavList.stop(true).animate({
                marginTop: -marginTop
            }, 300, function () {
                leftNavList_top = Math.ceil(parseFloat($leftNavList.css('margin-top'), 10));
            });

        };

        win.adjustActiveVisibile = adjustActiveVisibile;


        // 向上滚
        var _goDown = function () {
                srcollTimer = setInterval(function () {
                    // 已经滚动到最下则无需滚动
                    if (Math.abs(leftNavList_top) >= scroll_range) {
                        clearInterval(srcollTimer);
                        return;
                    }

                    $leftNavList.animate({
                        marginTop: '-=1px'
                    }, 10, function () { // 更新顶部值
                        leftNavList_top = Math.ceil(parseFloat($leftNavList.css('margin-top'), 10));
                    });

                }, 20);

            },
            //向下滚
            _goUp = function () {
                srcollTimer = setInterval(function () {
                    // 已经在顶部则不需滚动
                    if (leftNavList_top >= 0) {
                        clearInterval(srcollTimer);
                        return;
                    }

                    // 动画
                    $leftNavList.animate({
                        marginTop: '+=1px'
                    }, 10, function () { // 更新顶部值
                        leftNavList_top = Math.ceil(parseFloat($leftNavList.css('margin-top'), 10));
                    });

                }, 20);
            };

        $down.on('mouseenter mouseleave', function (e) {
            if ($down.hasClass('invisible')) return;

            var type = e.type;

            if (type === 'mouseenter') {
                _goDown();
                // $leftNavList.animate({
                //     marginTop: view_height - content_HEIGHT
                // }, 500);
            } else {
                $leftNavList.stop(true);
                clearInterval(srcollTimer);
            }
        });
        $up.on('mouseenter mouseleave', function (e) {
            if ($up.hasClass('invisible')) return;

            var type = e.type;


            if (type === 'mouseenter') {
                _goUp();
                // $leftNavList.animate({
                //     marginTop: 0
                // }, 500);
            } else {
                $leftNavList.stop(true);
                clearInterval(srcollTimer);
            }
        });

    };
    // 获取分屏信息、应用信息
    var getScreenInfo = function () {
        Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: win.screenInfoUrl,
            data: {
                query: 'screen-apps'
            },
            success: function (data) {
                if (data && data.length) {
                    renderScreens(data);
                    renderPages(data);
                    renderApps(data);

                    // 应用右键菜单
                    if (appContextmenu) appCm = createAppContextMenu();

                    // 支持拖拽
                    AppDragMgr.enableAllApps();

                    // 立刻调节屏幕尺寸
                    adjustScreenSize();
                    // 设置默认分屏
                    MetroScreen.setPageActive(activePage);
                    // 初始化左侧事件
                    initLeftNavEvent();
                }
            },
            error: Util._ajaxErr
        });
    };




    // 获取合适的页码
    var getPropPage = function (page) {
        var rt = page;

        if (page < 0) {
            rt = 0;
        } else if (page >= PAGE_NUM) {
            rt = PAGE_NUM - 1;
        }

        return rt;
    };

    // 键盘：up down
    var UP_KEY = 38,
        DOWN_KEY = 40;

    var handleKeydown = function (event) {
        var code = event.which,
            page;

        if (code == UP_KEY) {
            page = activePage - 1;
        } else if (code == DOWN_KEY) {
            page = activePage + 1;
        }

        if (page === undefined) return;

        page = getPropPage(page);

        MetroScreen.setPageActive(page);
        // 调整左侧激活菜单可见
        adjustActiveVisibile();
    };

    $(document).on('keydown', handleKeydown);

    // 点击左侧导航
    $leftNavList.on('click', '.left-nav-link', function (event) {
        event.preventDefault();

        var page = $(this).data('page');

        MetroScreen.setPageActive(page);
        // 调整左侧激活菜单可见
        adjustActiveVisibile();
    });
    // 鼠标滚轮控制屏幕翻滚
    Util.loadJs(Util.getRightUrl('fui/js/lib/jquery.mousewheel.min.js'), function () {
        // 绑定鼠标滚轮事件
        var mousewheelTimer;

        $screensCon.on('mousewheel', function (event) {
            console.log(event.deltaX, event.deltaY, event.deltaFactor);

            // 虽然鼠标滚轮不是连续事件，但是为了防止一次拨动滚轮太多，导致连续翻页，所以使用定时器处理一下
            mousewheelTimer && clearTimeout(mousewheelTimer);
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

                page = getPropPage(page);

                MetroScreen.setPageActive(page);

                // 调整左侧激活菜单可见
                adjustActiveVisibile();
            }, 200);


        });
    });

    // 屏幕相关操作
    win.MetroScreen = {
        setPageActive: function (i) {
            var page = getPropPage(i),
                bd_h = $('body').height();

            var $page = $leftNavList.find('.page-item').eq(page);

            if ($page.hasClass('active')) return;

            $screenList.stop(true)
                .animate({
                    marginTop: -page * bd_h
                }, 300);

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
        getActiveNavItem: function () {
            return $leftNavList.find('.page-item').eq(activePage);
        },

        getScreen: function (page) {
            return $screenList.find('.screen-item').eq(page);
        },

        // 获取应用DOM
        getApp: function (id) {
            return $screensCon.find('[data-id="' + id + '"]');
        },

        // 添加应用
        addApp: function (data, page) {
            var $screen = $screenList.find('.screen-item').eq(page),
                $app = $(M.render(appTempl, $.extend({}, data, getPropStyles(data))));

            $app.appendTo($screen.find('.apps-wrap'));

            AppDragMgr.enableApp($app);

            data.page = page;

            data.screenIndex = leftItems[page].screenIndex;

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
                        arr.push(n + j * METRO_ROW_NUM);
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
            var isOut = (pos.left > (METRO_COLUMN_NUM - 1) * APP_UNIT_WIDTH + APP_UNIT_WIDTH / 2) || (pos.top > (METRO_ROW_NUM - 1) * APP_UNIT_HEIGHT + APP_UNIT_HEIGHT / 2);

            if (isOut) {
                index = -1;
            } else {
                c = (pos.left < 0 ? 0 : pos.left) / APP_UNIT_WIDTH;
                r = (pos.top < 0 ? 0 : pos.top) / APP_UNIT_HEIGHT;

                index = Math.round(c) * METRO_ROW_NUM + Math.round(r);
            }

            return index;
        },

        // 根据index调整应用位置
        adjustAppPosByIndex: function ($app, index) {
            var id = $app.data('id'),

                data = AppMgr.getAppData(id),
                pos = getAppPosByIndex(index);

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

                col = Util.toInt(idx / METRO_ROW_NUM),

                i = 1;

            for (; i < r; i++) {
                if (Util.toInt((idx + i) / METRO_ROW_NUM) != col) {
                    return false;
                }
            }

            return true;
        },

        // 获取指定页可用的格子索引数组
        getEmptyGrids: function (page) {
            var l = METRO_COLUMN_NUM * METRO_ROW_NUM,

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
        var col = Util.toInt(index / METRO_ROW_NUM),
            row = Util.toInt(index % METRO_ROW_NUM);

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

    // 应用右键菜单
    // 添加左侧导航后，导航内容不应该是简单的1234，应在初始化屏幕数据的回调中使用
    // var appCm = createAppContextMenu();

    // 卸载应用提示
    // var uninstallTip = new TipDialog({
    //  msg: '您确定卸载该应用吗？卸载后可从应用仓库中再次添加到桌面。',
    //  title: '系统提示',
    //  type: 'confirm',
    //  btns: [{
    //      text: '确定',
    //      role: 'yes'
    //  }, {
    //      text: '取消',
    //      role: 'no'
    //  }],
    //  callback: function(role, opt) {
    //      if(role == 'yes') {
    //          AppMgr.uninstallApp(opt.id);
    //      }
    //  }
    // }).setMsgStyle({
    //  fontSize: '15px',
    //  lineHeight: '25px'
    // });

    // 空间不足、安装成功 提示
    // var onlyOkTip = new TipDialog({
    //  msg: '',
    //  type: 'info',
    //  btns: [{
    //      text: '确定',
    //      role: 'yes',
    //  }]
    // }).setMsgStyle({
    //  fontSize: '15px',
    //  lineHeight: '25px'
    // });

    // 更新应用提醒数
    var updateUnread = function ($app, count) {
        var $inner = $app.find('.app-inner'),
            $unread = $inner.find('.unread');

        if (count <= 0) {
            $unread.remove();
        } else {
            if (!$unread.length) {
                $unread = $('<span class="unread"></span>');
                $unread.appendTo($inner);
            }

            $unread.html(count >= 99 ? 99 : count);
        }
    };

    // 应用缓存数据
    var appDataCache = {};
    win.sss = appDataCache;
    // 应用管理
    win.AppMgr = {
        cacheAppData: function (id, data) {
            appDataCache[id] = $.extend({}, data);
        },

        getAppData: function (id) {
            var info = appDataCache[id];

            if (!info) return false;
            return $.extend({}, info);
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
                TaskBar.addOrActiveTask(id);
            }
        },

        // 安装应用
        installApp: function (data) {
            var page = MetroScreen.getActivePage(),

                data = Util.fixPath(data);

            data.index = MetroScreen.getInsertIndex(data, page);

            if (data.index == -1) {
                epoint.alert('很抱歉，当前页没有足够的空间安装该应用，您可以选择其他分屏或者调整应用布局后再安装。', '系统提示');
                //                mini.showMessageBox({
                //                    title: '系统提示',
                //                    message: '很抱歉，当前页没有足够的空间安装该应用，您可以选择其他分屏或者调整应用布局后再安装。',
                //                    buttons: ["ok"],
                //                    iconCls: "mini-messagebox-warn"
                //                });
                // onlyOkTip.setMessage('很抱歉，当前页没有足够的空间安装该应用，您可以选择其他分屏或者调整应用布局后再安装。')
                //  .setType('warn')
                //  .show(true);

                // 安装失败
                return false;
            } else {
                MetroScreen.addApp(data, page);
                //                mini.showMessageBox({
                //                    title: '系统提示',
                //                    message: '应用【' + data.name + '】安装成功！',
                //                    buttons: ["ok"],
                //                    iconCls: "mini-messagebox-success"
                //                });
                epoint.alert('应用【' + data.name + '】安装成功！', '系统提示');
                // onlyOkTip.setMessage('应用【' + data.name + '】安装成功！')
                //  .setType('success')
                //  .show(true);

                // 安装成功，给后台发送page，index信息
                AppMgr.sendAppUpdate(data, 'install-app');
            }
        },

        // 移动到另一个分屏
        moveToScreen: function (id, page) {
            var data = AppMgr.getAppData(id),
                idx = MetroScreen.getInsertIndex(data, page);
            if (idx == -1) {
                epoint.alert('很抱歉，第' + (page + 1) + '分屏没有足够的空间，您可以选择其他分屏或者调整应用布局后再移动。', '系统提示');
                //                mini.showMessageBox({
                //                    title: '系统提示',
                //                    message: '很抱歉，第' + (page + 1) + '分屏没有足够的空间，您可以选择其他分屏或者调整应用布局后再移动。',
                //                    buttons: ["ok"],
                //                    iconCls: "mini-messagebox-warn"
                //                });
                // onlyOkTip.setMessage('很抱歉，第' + (page + 1) + '分屏没有足够的空间，您可以选择其他分屏或者调整应用布局后再移动。')
                //  .setType('warn')
                //  .show(true);
            } else {
                data.index = idx;

                // 移除应用
                MetroScreen.removeApp(id);

                // 添加应用
                MetroScreen.addApp(data, page);

                // 发送移动到屏幕请求
                AppMgr.sendAppUpdate(id, 'screen-to-screen');
            }
        },

        // 卸载应用
        uninstallApp: function (id) {
            // 移除任务应用
            TaskBar.removeTask(id);

            // 移除应用
            MetroScreen.removeApp(id);

            // 发送卸载请求
            AppMgr.sendAppUpdate(id, 'uninstall-app');

            // 删除应用数据
            AppMgr.delAppData(id);
        },

        // 更新应用提醒数目
        updateAppReminder: function (id) {
            Util.ajax({
                type: 'POST',
                dataType: 'json',
                url: win.updateAppUrl,
                data: {
                    query: 'update-app-reminder',
                    id: id
                },
                success: function (data) {
                    var n = data.count,
                        $app = MetroScreen.getApp(id);

                    updateUnread($app, n);
                },
                error: Util._ajaxErr
            });
        },

        // 发送应用信息更新请求
        sendAppUpdate: function (id, query) {
            var data = $.isPlainObject(id) ? id : AppMgr.getAppData(id),

                params = $.extend({}, data, {
                    query: query
                });

            Util.ajax({
                type: 'POST',
                url: win.updateAppUrl,
                dataType: 'json',
                data: params,
                success: Util.noop,
                error: Util._ajaxErr
            });
        }
    };

    // 点击应用，打开
    $screensCon.on('click', '.metro-app', function (event) {
        var id = $(this).data('id');

        AppMgr.openApp(id);


    });
    // 右键应用 弹出菜单
    if (appContextmenu) {
        $screensCon.on('contextmenu', '.metro-app', function (event) {
            var id = $(this).data('id'),
                data = AppMgr.getAppData(id);

            appCm.setOptions('id', id).show({
                x: event.pageX,
                y: event.pageY
            });

            Util.configAppCmOpers(appCm, data);

            return false;
        });
    }

    $(win).on('resize', adjustScreenSize);

    getScreenInfo();

}(this, jQuery));

// 应用拖动管理
(function (win, $) {
    var $screensCon = $('#metro-screens');

    var appDragStart = function (event, ui) {
        var $el = $(this);

        $el.addClass('app-drag-zindex');
    };

    var appDragStop = function (event, ui) {
        var $el = $(this),

            id = $el.data('id'),
            data = AppMgr.getAppData(id),

            // 原始的index
            oldIdx = data.index,

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
                        data = AppMgr.getAppData(id),

                        idx = MetroScreen.getInsertIndex(data, activePage);

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
            $screensCon.find('.metro-app')
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

// 右下角 快捷菜单
(function (win, $) {
    var $trigger = $('#metro-quick-menu-trigger'),

        $menu = $trigger.next(),
        $menu_ul = $menu.find('>ul'),

        $bd = $('body'),

        TRIGGER_HEIGHT = 40,
        ID_PREFIX = 'quick-menu-item-';

    $bd.on('click', function (event) {
        var t = event.target;

        if (!$.contains($menu[0], t) && $trigger.hasClass('active') && t !== $trigger[0]) {

            hide();
        }
    });

    var M = Mustache,
        itemTempl = $.trim(METRO_QUICK_MENU_TPL),
        menuData,
        h;

    Util.ajax({
        type: 'POST',
        dataType: 'json',
        url: win.quickMenuUrl,
        data: {
            query: 'quick-menu'
        },
        success: function (data) {
            var html = [];

            if (data.length) {
                menuData = data;

                $menu_ul[0].innerHTML = '';

                $.each(data, function (i, item) {
                    item.index = i;
                    html.push(M.render(itemTempl, item));

                    item = Util.fixPath(item);
                    // 把快捷菜单项当做应用来处理
                    AppMgr.cacheAppData(ID_PREFIX + i, $.extend(item, {
                        id: (ID_PREFIX + i)
                    }));
                });

                $menu_ul[0].innerHTML = html.join('');
            }

            h = $menu.outerHeight();

            $menu.css('bottom', -h)
                .addClass('hidden')
                .removeClass('hidden-accessible');
        },
        error: Util._ajaxErr
    });

    var hide = function () {
        if ($menu.is(':animated')) return;

        $menu.animate({
            bottom: -h
        }, 300, function () {
            $menu.addClass('hidden');
        });

        $trigger.removeClass('active');
    };

    var show = function () {
        if ($menu.is(':animated')) return;

        $menu.removeClass('hidden');
        $menu.animate({
            bottom: TRIGGER_HEIGHT
        }, 300);

        $trigger.addClass('active');
    };

    $bd.on('click', '.metro-quick-menu-trigger', function (event) {
        event.preventDefault();

        $trigger.hasClass('active') ? hide() : show();
    });

    $menu.on('click', 'a', function (event) {
        event.preventDefault();

        var i = parseInt(this.getAttribute('index'), 10);

        TaskBar.addOrActiveTask(ID_PREFIX + i);

        hide();
    });
}(this, jQuery));

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
        EXTRA_WIDTH = 90 + 40;

    var M = Mustache,
        taskTempl = $.trim(METRO_TASK_TPL);

    // 调整TaskBar组件的宽度 适时显示、隐藏导航
    var adjustTaskBar = function () {
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
                TaskBar.minAllTasks();
            }
        }, 'sep', {
            text: '关闭此任务',
            click: function (opt) {
                var id = opt.id;
                TaskBar.removeTask(id);
            }
        }, {
            text: '只显示此任务窗口',
            click: function (opt) {
                TaskBar.minAllTasks(opt.id);
            }
        }, 'sep', {
            text: '关闭其他任务',
            click: function (opt) {
                var id = opt.id;
                TaskBar.removeOthers(id);
            }
        }, {
            text: '关闭所有任务',
            click: function () {
                TaskBar.removeAll();
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

    win.TaskBar = {
        openTask: function (id) {
            var data = AppMgr.getAppData(id),
                dialog = null,
                bs = Util.getBdSize();

            if (!taskCache[id]) {
                dialog = new EpDialog({
                    id: id + '-epdialog',
                    title: data.name,
                    url: data.url,
                    draggable: true,
                    resizable: true,
                    width: (data.widthRatio || DIALOG_SIZE_RATIO[0]) * bs.width,
                    height: (data.heightRatio || DIALOG_SIZE_RATIO[1]) * bs.height,
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
                            TaskBar.removeTask(opt.id);
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
        minAllTasks: function (id) {
            var p, d;

            for (p in taskCache) {
                if (taskCache.hasOwnProperty(p)) {
                    d = taskCache[p];

                    if (p != id) {
                        d.hide();
                    } else {
                        d.show(0, 0);

                        TaskBar.activeTask(p);
                    }
                }
            }
        },

        // 添加任务项，并高亮
        addOrActiveTask: function (id) {
            var isOn = taskCache[id],
                data = AppMgr.getAppData(id);

            if (!isOn) {
                $(M.render(taskTempl, {
                    id: data.id,
                    name: data.name,
                })).appendTo($taskList);

                adjustTaskBar();
            }

            TaskBar.openTask(id);
            TaskBar.activeTask(id);
        },

        // 调节任务位置在可视范围内
        makeTaskVisiable: function (id) {
            var $task = TaskBar.getTask(id),
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
        removeTask: function (id) {
            var $task = TaskBar.getTask(id);

            if (!$task.length) return;

            $task.remove();

            taskCache[id].hide().destroy();
            taskCache[id] = null;
            delete taskCache[id];

            adjustTaskBar();
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

            adjustTaskBar();
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

            adjustTaskBar();
        },

        // 激活任务
        activeTask: function (id) {
            var $task = TaskBar.getTask(id);

            if (!$task.hasClass('active')) {
                $task.addClass('active')
                    .siblings()
                    .removeClass('active');
            }

            // make active task visiable
            TaskBar.makeTaskVisiable(id);
        }
    };

    $(win).on('resize', adjustTaskBar)
        .on('resize', adjustTaskDialogSize);

    // 向左
    $taskBar.on('click', '.scroll-l', function (event) {
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
    }).on('click', '.scroll-r', function (event) {
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

        if (appId) TaskBar.addOrActiveTask(appId);
    });

    adjustTaskBar();

    // 兼容菜单类主题TabsNav方法
    win.TabsNav = {
        addTab: function (data) {
            var id = data.id;
            AppMgr.getAppData(id) || AppMgr.cacheAppData(id, {
                name: data.name,
                id: id,
                url: data.url
            });
            TaskBar.addOrActiveTask(id);
        },
        refreshTabContent: function (id) {
            var dialog = taskCache[id];
            dialog && dialog.refresh && dialog.refresh();
        }
    };


}(this, jQuery));

// 侧边工具栏-门户选择
// (function(win, $) {
//  var $topBtns = $('#metro-top-bar .top-btns');

//  // 门户选择面板
//  var $widget = $('#portal-sel-panel'),
//      $trigger = $topBtns.find('.portal');

//  var PORTAL_WIDTH = 285;

//  var show = function() {
//      if($widget.is(':animated')) return;

//      $widget.removeClass('hidden');

//      $widget.animate({
//          right: 0
//      }, 200);

//      $trigger.addClass('active');
//  };

//  var hide = function() {
//      if($widget.is(':animated')) return;

//      $widget.animate({
//          right: -PORTAL_WIDTH
//      }, 200, function() {
//          $widget.addClass('hidden');
//      });

//      $trigger.removeClass('active');
//  };

//  $topBtns.on('click', '.portal', function(event) {
//      event.preventDefault();

//      $(this).hasClass('active') ? hide() : show();
//  });

//  // 自动隐藏
//  $('body').on('click', function(event) {
//      var t = event.target;

//      if(!$.contains($widget[0], t) && $trigger.hasClass('active') && t != $trigger[0]) {
//          hide();
//      }
//  });
// }(this, jQuery));

// 退出系统
(function (win, $) {
    var $topBtns = $('#metro-top-bar .top-btns');

    // var logoutConfirm = new TipDialog({
    //        title: '系统提示',
    //        type: 'confirm',
    //        msg: '您确定要退出系统吗？',
    //        btns: [{
    //            role: 'yes',
    //            text: '确定'
    //        }, {
    //            role: 'no',
    //            text: '取消'
    //        }],
    //        callback: function(role) {
    //          if(role == 'yes') {
    //              win.location.replace(Util.getRootPath() + 'logout.jspx');
    //          }
    //        }
    //    });

    $topBtns.on('click', '.logout', function (event) {
        event.preventDefault();
        mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
            if (action == 'ok') {
                if (win.onLogout) {
                    // eMsgSocket && eMsgSocket.close();
                    eWebSocket && eWebSocket.close();
                    win.onLogout();
                }
            }
        });
        // logoutConfirm.show(true);
    });
}(this, jQuery));

// 请求在线人数
(function (win, $) {
    var $userCount = $('#metro-top-bar .online');

    var getOnlineUserCount = function () {
        Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: win.onlineUserCountUrl,
            data: {
                query: 'online-user-count'
            },
            success: function (data) {
                $userCount.attr('title', '在线' + data.count + '人');
            },
            error: Util._ajaxErr
        });
    };

    getOnlineUserCount();

    setInterval(getOnlineUserCount, 60 * 1000);

}(this, jQuery));

// 消息提醒
(function (win, $) {
    var $msgSound = $('#msg-sound'),
        $soundIframe,
        msgAudio;

    // 根据浏览器加载不同的声音提醒方案
    if (Util.browsers.isIE) {
        $soundIframe = $('<iframe src="" frameborder="0" class="hidden" id="msgcenter-sound"></iframe>').appendTo($msgSound);
    } else {
        $msgSound.html('<audio id="msgcenter-sound-audio" controls="controls" src="../../msgsound/newsms.wav" class="hidden-accessible"></audio>');
        msgAudio = document.getElementById('msgcenter-sound-audio');
    }

    // 消息图标
    var $infoIcon = $('#metro-top-bar .message');

    var SOUND_URL = '../../msgsound/sound.html',
        ROLLER_TEXT = '您有新消息提醒，请点击查看！';

    // document title roller
    var title = document.title,
        rollerTip = ROLLER_TEXT,
        timer = 0;

    var restoreDocTitle = function () {
        clearTimeout(timer);

        document.title = title;
        rollerTip = ROLLER_TEXT;
    };

    var rollMsgTip = function () {
        document.title = rollerTip;

        clearTimeout(timer);

        timer = setTimeout(function roll() {
            document.title = rollerTip.substring(1, rollerTip.length) + rollerTip.substring(0, 1);
            rollerTip = document.title;

            timer = setTimeout(roll, 300);
        }, 300);
    };

    var hintNewMsg = function () {
        // 不需要反复提示，提示一次就够
        if (!$msgSound.hasClass('triggered')) {
            if (Util.browsers.isIE) {
                // $soundIframe[0].src = Util.getRightUrl(SOUND_URL) + '?timestamp=' + Util.uuid(8, 16);
                $soundIframe[0].src = Util.getRightUrl(SOUND_URL) + '?timestamp=' + (+new Date());
            } else {
                msgAudio.play();
            }

            $msgSound.addClass('triggered');
        }

        $infoIcon.removeClass('message')
            .addClass('message-new');

        rollMsgTip();
    };

    var stopNewMsg = function () {
        if (Util.browsers.isIE) {
            $soundIframe[0].src = '';
        }

        $infoIcon.removeClass('message-new')
            .addClass('message');

        $msgSound.removeClass('triggered');

        restoreDocTitle();
    };

    // check unread message
    var checkMsg = function () {
        Util.ajax({
            type: 'POST',
            url: win.msgCountUrl,
            dataType: 'json',
            global: false,
            data: {
                haseXun: true,
                needNum: true
            },
            success: function (data) {
                if (data.remind) {
                    hintNewMsg();
                } else {
                    stopNewMsg();
                }

                updateEmsgCount(parseInt(data.eXun) || 0);
            },
            error: Util.noop,
            complete: Util.noop
        });
    };

    checkMsg();
    // check unread message per 1 min
    setInterval(checkMsg, 60 * 1000);

}(this, jQuery));

// 默认应用初始化
(function (win, $) {
    // 获取消息系统应用的打开url
    Util.ajax({
        url: win.getMsgAppUrl,
        data: {
            query: 'get-msg-app-url'
        }
    }).done(function (data) {
        if (!data || !data.url) {
            initDefaultApps();
            return;
        }
        // 将获取到的url设置给消息应用
        $.each(win.defaultApps, function (i, app) {
            if (app.id === 'sys-msg-reminder') {
                app.url = data.url;
                return false;
            }
        });

        initDefaultApps();

    }).fail(function (err) {
        console && console.error && console.error(err);
        initDefaultApps();
    });

    var initDefaultApps = function () {
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
    };

}(this, jQuery));

// 获取用户信息
(function (win, $) {
    var $userInfo = $('#user-info');

    var getUserInfo = function () {
        Util.ajax({
            type: 'POST',
            dataType: 'json',
            url: win.userInfoUrl,
            data: {
                query: 'user-info'
            },
            success: function (data) {
                $userInfo.html(data.userName + '（' + data.ouName + '）');
                // 用户guid和name是E讯必须要使用的 需要记录下来
                win._userName_ = data.userName;
                win._userGuid_ = data.userGuid;
            },
            error: Util._ajaxErr
        });
    };

    getUserInfo();

}(this, jQuery));


/*
 * 打开E讯聊天窗口
 * sessionid 会话id，当传入一个参数时sessionid表示uid
 * uid 对方用户id
 * type 个人：friend 讨论组：group
 */
// var eMsgSocket;
// window.OpenEMsg = function (sessionid, uid, type) {

//     if (window.eMsg) {
//         if (typeof uid == 'undefined') {
//             eMsg.open(sessionid);
//         } else {
//             eMsg.openSession(sessionid, uid, type);
//         }
//     } else {
//         Util.loadPageModule({
//             templ: 'fui/pages/emsg/emsg.tpl',
//             js: 'fui/pages/emsg/emsg.js',
//             css: 'fui/pages/emsg/emsg.css',
//             callback: function () {

//                 eMsgSocket = new EMsgSocket(_userGuid_, _userName_);
//                 if (typeof uid == 'undefined') {
//                     eMsg.open(sessionid);
//                 } else {
//                     eMsg.openSession(sessionid, uid, type);
//                 }
//             }
//         });
//     }
// };

// 页面websocket对象
window.eWebSocket = undefined;

// 创建websocket链接
window.creatWebSocket = function (uid, uname, callback) {
    // 避免重复创建
    if (eWebSocket) {
        callback && callback();
        return;
    }

    var cfg = window.EWebSocketConfig ? window.EWebSocketConfig : {
        url: EmsgConfig.websocketUrl
    };

    cfg.uid = uid;
    cfg.uname = uname;

    if (window.EWebSocket) {
        eWebSocket = new EWebSocket(cfg);
        callback && callback();
        //_graceEvent_.fire('websocketCreated');

    } else {
        Util.loadJs('fui/pages/ewebsocket/ewebsocket.js', function () {
            eWebSocket = new EWebSocket(cfg);
            callback && callback();
            // _graceEvent_.fire('websocketCreated');
        });
    }
};

window.OpenEMsg = function (sessionid, uid, type) {
    /* global eMsg , eMsgSocket */
    if (window.eMsg) {
        if (typeof uid === 'undefined') {
            eMsg.open(sessionid);
        } else {
            eMsg.openSession(sessionid, uid, type);
        }
    } else {

        creatWebSocket(_userGuid_, _userName_, function () {
            eWebSocket.openEmsg(sessionid, uid, type);
        });
    }
};

// 主题皮肤切换
(function (win, $) {
    var themeSelection,
        $themeBtn = $('#theme-btn');

    function initThemeSkin() {
        themeSelection = new ThemeSelection({
            getThemesUrl: getThemesUrl,
            saveThemeUrl: saveThemeUrl
            // showCallback: function () {
            //     $pageCover.removeClass('hidden');
            // },
            // hideCallback: function () {
            //     $themeBtn.removeClass('active');
            // }
        });
        window.themeSelection = themeSelection;

        $themeBtn.on('click', function () {
            if ($themeBtn.hasClass('active')) {
                $themeBtn.removeClass('active');
                themeSelection.hide();
                // hidePageCover();
            } else {
                themeSelection.show();
                // $themeBtn.addClass('active');
            }
        });
    }

    if (!window.ThemeSelection) {
        Util.loadJs('fui/pages/themeselection/themeselection.js', initThemeSkin);
    } else {
        initThemeSkin();
    }

    $('body').on('click', function (e) {
        var $target = $(e.target);
        // 在主题面板内
        // 不在区域内 且不是按钮时
        if (!$.contains(themeSelection.$container[0], $target[0]) && !$target.closest('#theme-btn').length) {
            themeSelection.hide();
        }

    });
})(this, jQuery);

// E讯列表
(function (win, $) {
    var $msgTrigger = $('#msgTrigger'),
        $msgEMsg = $('#msgEMsg'),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent);

    var emsgList;

    var decreaseEmsgCount = function () {
        var cnt = $msgTrigger.data('num') || 0;
        if (cnt) {
            cnt = parseInt(cnt, 10) - 1;
        }
        updateEmsgCount(cnt);

    };
    var updateEmsgCount = function (count) {
        if (count <= 0) {
            $msgTrigger.data('num', 0).removeClass('new-msg');
        } else {
            $msgTrigger.data('num', count).addClass('new-msg');
        }
    };

    function initEMsgList() {
        /* global EMsgList,EmsgConfig */
        emsgList = new EMsgList({
            content: $msgEMsgRecent,
            getUrl: EmsgConfig.baseUrl,
            ignoreUrl: EmsgConfig.baseUrl,
            userImg: EmsgConfig.userImg,
            groupImg: EmsgConfig.groupImg,
            afterOpenEMsg: function () {
                hidePanel();
            },
            onDecEmsgCount: decreaseEmsgCount
        });

        win.RefreshEMsg = $.proxy(emsgList.getData, emsgList);
    }

    if (!win.EMsgList) {
        Util.loadJs('../../emsglist/emsglist.js', function () {
            initEMsgList();
        });
    } else {
        initEMsgList();
    }

    $msgTrigger.on('click', function () {
        var $this = $(this);
        if ($this.hasClass('active')) {
            hidePanel();
        } else {
            showPanel();
        }

    });

    // 点击隐藏
    $msgEMsg.on('click', '.msg-panel-hide', function () {
        hidePanel();
    });

    $('body').on('click', function (e) {
        var $target = $(e.target);
        if (!$target.closest('#msgEMsg , #msgTrigger').length) {
            hidePanel();
        }
    });

    function hidePanel() {
        $msgTrigger.removeClass('active');
        $msgEMsg.stop(true).animate({
                right: -350
            },
            function () {
                $msgEMsg.addClass('hidden');
            });
    }

    function showPanel() {
        emsgList.getData();
        $msgTrigger.addClass('active');
        $msgEMsg.removeClass('hidden');
        $msgEMsg.stop(true).animate({
            right: 0
        });
    }

    win.updateEmsgCount = updateEmsgCount;
}(this, jQuery));
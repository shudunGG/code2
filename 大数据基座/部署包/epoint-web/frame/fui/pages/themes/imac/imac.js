/* jshint -W030 */
// 分屏页码模板
var SCREEN_PAGE_TPL = '<a href="javascript:void(0);" data-page="{{page}}" class="page-item l mr10"><span>{{pageNum}}</span></a>', // 分屏模板
    SCREEN_TPL = '<div class="imac-screen l" data-title="第{{page}}分屏"></div>', // 桌面应用模板
    SCREEN_APP_TPL = '<div class="app-item trans" title="{{name}}" style="top:{{top}}px;left:{{left}}px" data-id="{{id}}"><span class="unread {{^count}}hidden{{/count}}">{{count}}</span><img src="{{icon}}" alt="" class="app-icon"><p class="app-name">{{name}}</p></div>', // 底部任务栏：任务模板
    TASK_ITEM_TPL = '<a href="javascript:void(0);" id="{{id}}-task" data-id="{{id}}" class="task-item l clearfix" title="{{name}}"><p class="task-name l">{{name}}</p></a>', // 下拉任务中的任务模板
    DROP_ITEM_TPL = '<li id="{{id}}-drop" data-id="{{id}}" class="drop-item" title="{{name}}">{{name}}</li>', // 工具栏：快捷应用模板
    DOCK_APP_TPL = '<div class="dock-app" data-id="{{id}}" title="{{name}}">{{#count}}<span class="unread">{{count}}</span>{{/count}}<img src="{{icon}}" alt="" ><p class="name">{{{sname}}}</p></div>', // 搜索中的应用模板
    SEARCH_APPS_TPL = '<div class="app-item trans in-panel l" title="{{name}}" id="{{id}}-search" data-id="{{id}}"><img src="{{icon}}" alt="" class="app-icon"><p class="app-name">{{name}}</p></div>', // 我的看板按钮模板
    BOARD_BTN_TPL = '<div class="right-board-btn" data-id="{{id}}" data-url="{{url}}">{{name}}</div>', // 我的看板内容模板
    BOARD_CONTENT_TPL = '<iframe src="{{url}}" class="board-content hidden" id="board-content-{{id}}" height="100%" width="100%" frameborder="0" scrolling="no"></iframe>',
    FOLDER_ITEM_TPL = '<li class="folder-item l" data-id="{{id}}"><img src="{{icon}}" class="folder-app-icon"></li>',
    SCREEN_FOLDER_TPL = '<div class="app-item folder"  title="{{name}}" style="top:{{top}}px;left:{{left}}px" data-id="{{id}}"><span class="unread {{^count}}hidden{{/count}}">{{count}}</span><ul class="folder-list">{{#apps}}<li class="folder-item l" data-id="{{id}}"><img src="{{icon}}" class="folder-app-icon"></li>{{/apps}}</ul><p class="app-name">{{name}}</p></div>',
    FOLDER_TPL = '<div class="folder-cover" data-id="{{id}}"><p class="folder-name" title="单击重命名"><span class="folder-name-text">{{name}}</span><input type="text" class="folder-name-input" maxlength="6" required/></p><div class="folder-container">{{{appHTML}}}</div></div>';

// 实现一个自定义事件 用于状态管理
window.ImacEvent = new Util.UserEvent();

// 屏幕应用大小配置
var OCCUPIED_H = 50 + 44,
    APP_INIT_TOP = 15,
    APP_INIT_LEFT = 25,
    APP_GAP_V = 20,
    APP_GAP_H = 40,
    APP_WIDTH = 105,
    APP_HEIGHT = 125;

// 处理链接打开
window.dealLinkOpen = function (linkData) {
    switch (linkData.openType) {
        case 'tabsnav':
            TabsNav.addTab(linkData);
            break;
        case 'dialog':
            epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
            break;
        case 'blank':
            window.open(Util.getRightUrl(linkData.url), (linkData.id + '').replace(/-/g, '_'));
            break;
        default:
            break;
    }
};
// imac所需工具方法
(function (win, $) {
    // 搜索记录存放多少个
    var SEARCH_APPS_NUM = 20;

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
            var timer, prevTime = +new Date();
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
        // 本地存储
        localMemory: {
            _get: function (key) {
                return JSON.parse(localStorage.getItem(key)) || [];
            },
            _add: function (value, key, length) {
                var data = this._get(key);

                // 已经存在则调整至首位
                var index = $.inArray(value, data);
                if (index != -1) {
                    data.splice(index, 1);
                    data.unshift(value);
                    return false;
                }

                // 添加到第一个并检查长度
                if (data.unshift(value) > length) {
                    data.length = length;
                }
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            },
            _del: function (value, key) {
                var data = this._get(key);
                var index = $.inArray(value, data);

                // 不存在直接
                if (index === -1)
                    return;

                // 删除 并重新写入
                data.splice(index, 1);
                localStorage.setItem(key, JSON.stringify(data));
            },
            // 搜索历史记录
            SearchHistory: {
                get: function () {
                    return Util.localMemory._get('_search-history_');
                },
                add: function (appId) {
                    return Util.localMemory._add(appId, '_search-history_', SEARCH_APPS_NUM);
                },
                remove: function (appId) {
                    return Util.localMemory._del(appId, '_search-history_');
                }
            },
            // 快捷应用
            QuickApps: {
                get: function () {
                    return Util.localMemory._get('_quick-apps_');
                },
                add: function (appId) {
                    return Util.localMemory._add(appId, '_quick-apps_', 10);
                },
                remove: function (appId) {
                    return Util.localMemory._del(appId, '_quick-apps_');
                }
            },
            // 最近使用
            RecentApps: {
                get: function () {
                    return Util.localMemory._get('_recent-apps_');
                },
                add: function (appId) {
                    return Util.localMemory._add(appId, '_recent-apps_', 10);
                },
                remove: function (appId) {
                    return Util.localMemory._del(appId, '_recent-apps_');
                }
            }
        },
        getBdSize: function () {
            return {
                width: $(win).width() - 60,
                height: $(win).height() - 50 - 44
            };
        },

        getAppShortName: function (name) {
            // var temp = name.substr(0, 2),
            // sname = temp[0] + '&nbsp;' + temp[1];

            // return sname;
            return name.substr(0, 4);
        },
        // 桌面应用：修复页面、图标路径
        fixPath: function (data) {
            var copy = $.extend({}, data);
            copy.url = Util.getRightUrl(data.url);
            copy.icon = Util.getRightUrl(data.icon);
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

            $app.queue('highlight', [dark, light, dark, light, dark, light, dark, light]);

            next();
        },
        // 动态加载js
        _jsPromise: {},
        loadJsPromise: function (url) {
            if (this._jsPromise[url])
                return this._jsPromise[url];

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
        },
        doPlaceHolder: function ($el) {
            this.loadJsPromise('frame/fui/js/widgets/jquery.placeholder.min.js').done(function () {
                $el.placeholder();
            });
        },
        parseNum: function (num) {
            var n = parseInt(num, 10);

            if (n > 99) {
                return '99+';
            } else if (n <= 0) {
                return '';
            }

            return n + '';
        }
    });

    EpDialog.setMaxCoord({
        top: 50,
        left: 0,
        right: 60,
        bottom: 50
    });
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
            ImacEvent.fire('websocketCreated');
        } else {
            Util.loadJs('frame/fui/js/widgets/ewebsocket/ewebsocket.js', function () {
                eWebSocket = new EWebSocket(cfg);
                callback && callback();
                ImacEvent.fire('websocketCreated');
            });
        }
    };
})(this, jQuery);

/* global ImacDataActionUrl, ImacEvent */
// 加载imac背景图片
(function (win, $) {
    var DEFAULT_BG = 'frame/fui/pages/themes/imac/images/skinbg/bg.jpg';

    var $bg = $('#imac-skin-bg');

    Util.ajax({
        url: ImacDataActionUrl.getBgUrl
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

// 分屏交互
(function (win, $) {
    var $pageList = $('#imac-page-list');

    var $screensCon = $('#imac-screens-container'),
        $screenList = $('.screen-list');

    var M = Mustache, // 页码模板
        pageTempl = $.trim(SCREEN_PAGE_TPL), // 分屏模板
        screenTempl = $.trim(SCREEN_TPL), // 应用模板
        appTempl = $.trim(SCREEN_APP_TPL),
        folderTempl = $.trim(SCREEN_FOLDER_TPL);

    // 页码宽度
    var PAGE_WIDTH = 28, // 页码间隔
        PAGE_GAP = 10;

    // 总页码数，用数据确定
    var pageNum;

    var activePage = DEFAULT_ACTIVE_PAGE - 1;

    // 每列应用数
    // var appNumPerCol = APP_COUNT_PER_COLUMN;
    var appNumPerCol = (($(win).height() - OCCUPIED_H - APP_INIT_TOP) / (APP_HEIGHT + APP_GAP_V)) >> 0;

    // 文件夹中每行应用数
    var appNumPerRow = 6;
    // app context menu
    var appCm;

    // 调整分屏尺寸
    var adjustScreenSize = function () {
        var $screens = $screensCon.find('.imac-screen'),
            bdSize = Util.getBdSize(),
            dis = activePage * bdSize.width;

        $screensCon.add($screens).css(bdSize);

        $screenList.css('margin-left', -dis);
    };

    // 渲染页码
    var renderPages = function (data) {
        var html = [],
            wd = data.length * (PAGE_WIDTH + PAGE_GAP);

        $.each(data, function (i) {
            var temp = {
                page: i,
                pageNum: i + 1
            };

            html.push(M.render(pageTempl, temp));
        });

        $pageList.css({
            marginLeft: -wd / 2,
            width: wd
        }).append(html.join(''));
    };

    // 渲染分屏
    var renderScreens = function (data) {
        var html = [];

        $.each(data, function (i, item) {
            var temp = {
                page: i + 1
            };

            // 保存屏幕信息
            ImacScreen._screenCache[i] = {
                id: item.id,
                name: item.name
            };
            html.push(M.render(screenTempl, temp));
        });

        $screenList.html(html.join(''));
    };

    // resize 时重新布局 app
    function reLayoutApp() {
        var newColNum = (($(win).height() - OCCUPIED_H - APP_INIT_TOP) / (APP_HEIGHT + APP_GAP_V)) >> 0;
        // 高度变化未导致展示数目变化时无需处理
        if (newColNum === appNumPerCol) {
            return;
        }
        appNumPerCol = newColNum;
        $.each($screenList.children(), function (i, screen) {
            var $screen = $(screen);
            $screen.find('.app-item').each(function (j, app) {
                var $app = $(app);
                var pos = getAppPosByIndex(j);
                $app.removeClass('trans').css(pos).addClass('trans');
            });
        });
    }
    $(win).on('resize', Util.debounce(reLayoutApp, 50));

    // 根据排序获取应用位置
    var getAppPosByIndex = function (index) {
        var col = Util.toInt(index / appNumPerCol),
            row = Util.toInt(index % appNumPerCol);

        return {
            left: APP_INIT_LEFT + (APP_WIDTH + APP_GAP_H) * col,
            top: APP_INIT_TOP + (APP_HEIGHT + APP_GAP_V) * row
        };
    };

    var getAppPosByIndexInFolder = function (index) {
        var col = Util.toInt(index % appNumPerRow),
            row = Util.toInt(index / appNumPerRow);

        return {
            left: APP_INIT_LEFT + (APP_WIDTH + APP_GAP_H) * col,
            top: APP_INIT_TOP + (APP_HEIGHT + APP_GAP_V) * row
        };
    }

    var renderAppsByPage = function (page, data) {
        var $screen = null,
            html = [];

        if (!data.length)
            return;

        $screen = $screenList.find('.imac-screen').eq(page);

        $.each(data, function (i, item) {
            var isFolder = item.apps && item.apps.length,
                count = 0;
            !isFolder && (item = Util.fixPath(item));

            var pos = getAppPosByIndex(i),
                view = $.extend({}, item, pos);

            item.page = page;
            item.index = i;

            if (isFolder) {

                $.each(item.apps, function (i1, item1) {
                    item1 = Util.fixPath(item1);
                    item1.index = i1;
                    item1.folderId = item.id;

                    // 缓存每一个app数据
                    AppMgr.cacheAppData(item1.id, item1);
                    item.apps[i1] = item1;

                    // 记录需要获取消息数目的应用集合
                    if (item1.needMsgRemind) {
                        AppMgr.msgRemindApps.push(item1.id);
                        count += item1.count;
                    }

                });
                item.count = count;
                // 缓存文件夹数据
                FolderMgr.cacheFolderData(item.id, item);

                view = $.extend({}, item, view, {
                    count: Util.parseNum(count)
                });

                html.push(M.render(folderTempl, view));
            } else {
                html.push(M.render(appTempl, view));
            }

            // 缓存每一个app数据
            AppMgr.cacheAppData(item.id, item);

            // 记录需要获取消息数目的应用集合
            if (item.needMsgRemind) {
                AppMgr.msgRemindApps.push(item.id);
            }
        });

        $screen.html(html.join(''));
    };

    // 渲染应用
    var renderApps = function (data) {
        if (data.length) {
            $.each(data, function (i, item) {
                renderAppsByPage(i, item.apps);
            });
        }

    };

    // 获取屏幕信息：分屏数 应用信息
    var getScreenInfo = function () {
        return Util.ajax({
            url: win.ImacDataActionUrl.screenAppsUrl
        }).done(function (data) {
            if (data) {
                if (Object.prototype.toString.call(data) != '[object Array]') {
                    console.error('屏幕应用数据错误！');
                    return;
                }
                renderPages(data);
                renderScreens(data);
                renderApps(data);

                // 渲染完成后触发
                ImacEvent.fire('afterAllAppsLoad');

                pageNum = data.length;

                // 创建应用上的右键菜单
                appCm = createAppContextMenu();

                // 创建文件夹上的右键菜单
                folderCm = createFolderContextMenu();

                // 启动拖拽、排序
                AppDragMgr.enableAllScreenApps();

                // 立刻调整分屏尺寸
                adjustScreenSize();
                setPageActive(activePage);
            }
        });
    };
    getScreenInfo();
    // 激活对应页码的分屏
    var setPageActive = function (page) {
        var dis = page * Util.getBdSize().width,
            $el = $pageList.find('.page-item').eq(page);

        $el.addClass('active').siblings().removeClass('active');

        $screenList.stop(true).animate({
            marginLeft: -dis
        }, 200);

        // contextmenu移动到当前页-失效
        appCm.enableItem('page-' + activePage).disableItem('page-' + page);

        // contextmenu移动到当前页-失效
        folderCm.enableItem('page-' + activePage).disableItem('page-' + page);
        // mini.getbyName('page-' + activePage, appCm).enable();
        // mini.getbyName('page-' + page, appCm).disable();

        activePage = page;
    };

    // 获取校验的页码
    var getPropPage = function (page) {
        var rt = page;

        if (page < 0) {
            rt = 0;
        } else if (page > pageNum - 1) {
            rt = pageNum - 1;
        }

        return rt;
    };

    // 页码导航
    $pageList.on('click', '.page-item', function () {
        var $el = $(this),
            page = Util.toInt($(this).data('page'));

        if ($el.hasClass('active'))
            return;

        setPageActive(page);
    });

    // 用于应用ContextMenu的可复用回调
    win.AppCmFuncs = {
        moveToScreen: function (opt, data) {
            AppMgr.moveToScreen(opt.id, data.page);
        },

        screenToToolbar: function (opt) {
            AppMgr.screenToToolbar(opt.id);
        },
        openApp: function (opt) {
            AppMgr.openApp(opt.id);
        },
        uninstallApp: function (opt) {
            epoint.confirm('确定要卸载此应用吗？卸载之后您可以重新从应用仓库中安装', '卸载提醒', function () {
                AppMgr.uninstallApp(opt.id);
            });
        }
    };

    // app contextmenu
    var createAppContextMenu = function () {
        var items = [],
            i, moveItems = [],
            funcs = AppCmFuncs;

        items.push({
            text: '打开应用',
            role: 'open-app',
            click: funcs.openApp
        });
        items.push('sep');

        items.push({
            text: '卸载应用',
            role: 'uninstall-app',
            click: funcs.uninstallApp
        });
        items.push('sep');

        // 快捷应用 可右键移入
        // if (win.rightUseQuickApps) {
        // items.push({
        // text: '添加到快捷应用',
        // click: funcs.screenToToolbar
        // });
        // items.push('sep');
        // }

        for (i = 1; i <= pageNum; i++) {
            moveItems.push({
                text: ImacScreen._screenCache[i - 1].name || '桌面-' + i,
                role: 'page-' + (i - 1),
                page: i - 1,
                click: funcs.moveToScreen
            });
        }

        items.push({
            text: '移动应用到',
            role: 'move-app',
            items: moveItems
        });
        // items.push('sep');

        items.push({
            text: '取消',
            role: 'hide',
            click: function () {
                appCm.hide();
            }
        });

        var cm = new EpContextMenu({
            items: items
        }).setOptions('from', 'screen');

        return cm;
    };
    // 用于文件夹ContextMenu的可复用回调
    win.FolderCmFuncs = {
        moveToScreen: function (opt, data) {
            AppMgr.moveToScreen(opt.id, data.page);
        },

        openFolder: function (opt) {
            ImacFolder.openFolder(opt.id);
        }
    };
    // app contextmenu
    var createFolderContextMenu = function () {
        var items = [],
            i, moveItems = [],
            funcs = FolderCmFuncs;

        items.push({
            text: '打开文件夹',
            role: 'open-folder',
            click: funcs.openFolder
        });
        items.push('sep');

        for (i = 1; i <= pageNum; i++) {
            moveItems.push({
                text: ImacScreen._screenCache[i - 1].name || '桌面-' + i,
                role: 'page-' + (i - 1),
                page: i - 1,
                click: funcs.moveToScreen
            });
        }

        items.push({
            text: '移动到',
            role: 'move-folder',
            items: moveItems
        });
        // items.push('sep');

        items.push({
            text: '取消',
            role: 'hide',
            click: function () {
                folderCm.hide();
            }
        });

        var cm = new EpContextMenu({
            items: items
        }).setOptions('from', 'screen');

        return cm;
    };
    // 键盘：< >
    var LEFT_KEY = 37,
        RIGHT_KEY = 39;

    var handleKeydown = function (event) {
        var code = event.which,
            page;

        if (code == LEFT_KEY) {
            page = activePage - 1;
        } else if (code == RIGHT_KEY) {
            page = activePage + 1;
        }

        if (page === undefined)
            return;

        page = getPropPage(page);

        setPageActive(page);
    };

    $(document).on('keydown', handleKeydown);

    $(win).on('resize', adjustScreenSize);

    $screensCon.on('click', '.app-item', function () {
        var $this = $(this),
            id = $this.data('id');
        if ($this.hasClass('folder')) {
            ImacFolder.openFolder(id);
        } else {
            AppMgr.openApp(id);
        }

    }).on('contextmenu', '.app-item', function (event) {
        var $this = $(this),
            id = $this.data('id'),
            isFolder = $this.hasClass('folder'),
            cm = isFolder ? folderCm : appCm;
    
        if($this.closest('.folder-container').length) {
            return false;
        }
        cm.setOptions('id', id).show({
            x: event.pageX,
            y: event.pageY
        });
        return false;
    });

    win.AppMgr = {
        // 应用缓存
        _data: {},
        // 需要获取消息数目的应用id集合
        msgRemindApps: [],
        cacheAppData: function (id, data) {
            this._data[id] = $.extend({}, data);
        },

        deleteAppData: function (id) {
            this._data[id] = null;
        },

        // return a copy of app info
        getAppData: function (id) {
            var info = this._data[id];

            if (!info)
                return false;

            return $.extend({}, info);
        },

        // 移动应用：屏幕 到 工具栏 作为快捷应用
        screenToToolbar: function (id) {
            if (QuickApps.isFull()) {
                return;
            }
            QuickApps.addApp(id, false, true);
        },

        // 移动应用：分屏 到 分屏
        moveToScreen: function (id, page) {
            // 目标屏幕最后一个应用
            var $prevApp = ImacScreen.getScreen(page).find('.app-item').last(),
                prevAppId = $prevApp.length ? $prevApp.data('id') : null;

            ImacScreen.removeApp(id);

            if(FolderMgr.getFolderData(id)) {
                ImacScreen.addFolder(id, page);
            } else {
                ImacScreen.addApp(id, page);
            }
            

            // 发送请求
            Util.ajax({
                url: ImacDataActionUrl.appToScreenUrl,
                data: {
                    appId: id,
                    screenId: ImacScreen._screenCache[page].id,
                    prevAppId: prevAppId
                }
            });
        },

        // 打开应用
        openApp: function (id) {
            // 应用打开时 记录为最近使用
            // if (!win.rightUseQuickApps) {
            // QuickApps.addApp(id);
            // }
            var data = AppMgr.getAppData(id);

            if (data.openType == 'blank') {
                win.open(data.url);
            } else {
                TabsNav.addOrActiveTab(id);
            }

            ImacFolder.closeFolder();
        },
        installApp: function (id, callback) {
            // 当前屏幕最后一个应用
            var $prevApp = ImacScreen.getScreen(activePage).find('.app-item').last(),
                prevAppId = $prevApp.length ? $prevApp.data('id') : null;

            // 根据传递的id发出请求 获取数据并添加到桌面
            return Util.ajax({
                url: ImacDataActionUrl.installAppUrl,
                data: {
                    appId: id,
                    screenId: ImacScreen._screenCache[activePage].id,
                    prevAppId: prevAppId
                }
            }).done(function (data) {
                if (!data)
                    return;

                // 执行成功回调
                callback && callback();

                data = Util.fixPath(data);

                // 保存应用数据
                AppMgr.cacheAppData(data.id, data);

                // 检查是否需要消息轮训 需要则更新数组
                if (data.needMsgRemind) {
                    AppMgr.msgRemindApps.push(data.id);
                }

                // 调用屏幕操作添加应用到最后
                ImacScreen.addApp(data.id, activePage);
            });
        },
        uninstallApp: function (id, callback) {
            // 已经打开的情况下 禁止卸载
            if (TabsNav._data[id]) {
                epoint.alert('此应用已经打开，请关闭后再卸载！', null, null, 'info');
                return;
            }
            // 发请求卸载应用
            return Util.ajax({
                url: ImacDataActionUrl.uninstallAppUrl,
                data: {
                    appId: id
                }
            }).done(function (data) {
                if (!data)
                    return;

                if (data.status == 'success') {
                    // 已经请求成功 检查有无消息提醒 处理后移除应用即可
                    var appData = AppMgr.getAppData(id);

                    // 如果 要删除的这个应用在需要获取消息数目的列表里 将其移除
                    if (appData && appData.msgCountUrl) {
                        for (var i = 0, l = AppMgr.msgRemindApps.length; i < l; ++i) {
                            var currAppId = AppMgr.msgRemindApps[i];
                            if (currAppId == id) {
                                AppMgr.msgRemindApps.splice(i, 1);
                                break;
                            }
                        }
                    }
                    appData = null;
                    ImacScreen.removeApp(id);
                    // 如果应用在右侧有副本或快捷方式也要移除
                    QuickApps.removeApp(id);

                    // dom移除后也要移除数据
                    AppMgr.deleteAppData(id);

                    // 触发卸载应用
                    ImacEvent.fire('afterAppUninstall', id);
                    epoint.showTips('应用卸载成功！', {
                        state: 'success'
                    });

                    callback && callback();
                } else if (data.description) {
                    epoint.alert(data.description, null, null, 'info');
                }
            });
        },
        // 将一个app变成文件夹
        creatFolder: function (app, callback) {
            return Util.ajax({
                url: ImacDataActionUrl.creatFolderUrl,
                data: {
                    screenId: ImacScreen._screenCache[activePage].id,
                    appId: app.id
                }
            }).done(function (data) {
                if (data.id) {
                    // 保存文件夹数据
                    AppMgr.cacheAppData(data.id, data);
                    // 将文件夹替换掉app
                    ImacScreen.changeAppToFolder(data.id, activePage, app);

                    callback && callback(data);
                }
            })
        },
        // 移动应用：文件夹 到 分屏
        folderToScreen: function (id, page, callback) {
            // 目标屏幕最后一个应用
            var $prevApp = ImacScreen.getScreen(page).find('.app-item').last(),
                prevAppId = $prevApp.length ? $prevApp.data('id') : null;

            // 发送请求
            Util.ajax({
                url: ImacDataActionUrl.appToScreenUrl,
                data: {
                    appId: id,
                    screenId: ImacScreen._screenCache[page].id,
                    prevAppId: prevAppId
                }
            }).done(function(data){
                if (!data)
                    return;

                // 执行成功回调
                callback && callback();
            });
        },

    };

    // 分屏上的一些操作集合
    win.ImacScreen = {
        // 存储屏幕信息
        _screenCache: [],
        getActivePage: function () {
            return activePage;
        },

        getApp: function (id) {
            return $screensCon.find('.app-item[data-id="' + id + '"]');
        },

        getScreen: function (page) {
            return $screensCon.find('.imac-screen').eq(page);
        },

        // 没有指定index，则默认加到末尾
        addApp: function (id, page, index) {
            var $screen = this.getScreen(page),
                data = AppMgr.getAppData(id),
                pos;

            if (index === undefined) {
                index = $screen.find(' > .app-item').length;
            }
            pos = getAppPosByIndex(index);

            $.extend(data, {
                index: index,
                page: page
            });

            $app = $(M.render(appTempl, data));
            $app.appendTo($screen).css(pos);

            Util.highlightApp($app);

            // 更新应用缓存
            AppMgr.cacheAppData(id, data);

            // 增加拖动支持
            AppDragMgr.enableScreenApp(id);
        },

        removeApp: function (id) {
            var $app = this.getApp(id),
                data = AppMgr.getAppData(id);

            $app.addClass('hidden');
            ImacScreen.adjustAppsPosFromIndex(data.page, data.index + 1, 1);

            // 去除draggable功能
            AppDragMgr.destroy($app);

            $app.remove();
        },

        addFolder: function(id, page, index) {
            var $screen = this.getScreen(page),
                data = AppMgr.getAppData(id),
                pos,
                appHtml = [],
                $html;

            if (index === undefined) {
                index = $screen.find(' > .app-item').length;
            }
            pos = getAppPosByIndex(index);

            $.extend(data, {
                index: index,
                page: page,
                count: Util.parseNum(data.count)
            });

            $html = $(M.render(folderTempl, data));

            $html.appendTo($screen).css(pos);

            Util.highlightApp($html);

            // 更新应用缓存
            AppMgr.cacheAppData(id, data);

            // 增加拖动支持
            AppDragMgr.enableScreenApp(id);

        },

        changeAppToFolder: function (id, page, app) {
            var $screen = this.getScreen(page),
                data = AppMgr.getAppData(id),
                index = app.index,
                pos = getAppPosByIndex(index),
                $app = $screensCon.find('[data-id="' + app.id + '"]');

            app.folderId = id;
            app.index = 0;

            $.extend(data, {
                index: index,
                page: page,
                name: '文件夹',
                apps: [app]
            });

            $folder = $(M.render(folderTempl, data));
            $folder.appendTo($screen).css(pos);

            // 更新文件夹缓存
            AppMgr.cacheAppData(id, data);

            // 增加拖动支持
            AppDragMgr.enableScreenApp(id);

            // 去除draggable功能
            AppDragMgr.destroy($app);

            $app.remove();

            // 更新应用缓存
            AppMgr.cacheAppData(app.id, app);
        },

        addAppToFolder: function (appId, folderId) {
            var $app = $screensCon.find('[data-id="' + appId + '"]'),
                $folder = $screensCon.find('[data-id="' + folderId + '"]'),
                appData = AppMgr.getAppData(appId),
                $list = $folder.find('.folder-list');
            $list.append(Mustache.render(FOLDER_ITEM_TPL, {
                id: appId,
                icon: appData.icon
            }));

            $app.addClass('hidden');
            ImacScreen.adjustAppsPosFromIndex(activePage, appData.index + 1, 1);

            // 去除draggable功能
            AppDragMgr.destroy($app);

            $app.remove();

            FolderMgr.addAppToFolder(appId, folderId);
        },

        updateFolderApps: function (folderId) {
            var $folder = $screensCon.find('[data-id="' + folderId + '"]'),
                folderData = AppMgr.getAppData(folderId),
                html = [];

            $.each(folderData.apps, function (i, item) {
                html.push(Mustache.render(FOLDER_ITEM_TPL, item));

            })

            $folder.find('.folder-list').html(html.join(''));

        },

        updateFolderName: function (folderId, name) {
            var $folder = $screensCon.find('.app-item[data-id="' + folderId + '"]');

            $folder.attr('title', name).find('.app-name').text(name);

            FolderMgr.updateFolderName(folderId, name);
        },

        updateFolderNum: function () {
            FolderMgr.folderIterator(function (folder) {
                var $folder = ImacScreen.getApp(folder.id),
                    isOpen = folder.id === ImacFolder._currOpenFolderId,
                    $count = $folder.find('> .unread'),
                    count = 0;

                $.each(folder.apps, function (i, item) {
                    if (item.needMsgRemind) {
                        count += item.count;

                        if (isOpen) {
                            ImacFolder.updateAppNum(item.id, item.count);
                        }
                    }
                });

                folder.count = count;
                AppMgr.cacheAppData(folder.id, folder);

                if (count) {
                    count = Util.parseNum(count);
                    $count.text(count).removeClass('hidden');
                } else {
                    $count.addClass('hidden');
                }
            });
        },
        // 在指定屏幕上 根据index查找应用
        getAppByIndex: function (page, index) {
            var $apps = this.getScreen(page).find('.app-item'),
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

        // 根据位置获取大致坐标
        getAppIndexByPos: function (pos) {
            var c, r, i, // 底部越界
                isOut = pos.top > APP_INIT_TOP + (appNumPerCol - 1) * (APP_GAP_V + APP_HEIGHT) + APP_HEIGHT / 2;

            if (isOut) {
                i = -1;
            } else {
                c = Math.round((pos.left - APP_INIT_LEFT) / (APP_GAP_H + APP_WIDTH));
                r = Math.round((pos.top - APP_INIT_TOP) / (APP_GAP_V + APP_HEIGHT));

                // i = c * APP_COUNT_PER_COLUMN + r;
                i = c * appNumPerCol + r;
            }

            return i;
        },

        // 根据index调整应用位置
        adjustAppPosByIndex: function (id, index) {
            var data = AppMgr.getAppData(id),
                pos = getAppPosByIndex(index),
                $app = ImacScreen.getApp(id);

            if (Util.browsers.isIE8 || Util.browsers.isIE9) {
                $app.stop(true).animate(pos, 200);
            } else {
                $app.css(pos);
            }

            if (data.index != index) {
                data.index = index;

                AppMgr.cacheAppData(id, data);
            }
        },

        // 从指定屏，指定应用Index开始 调整应用位置
        adjustAppsPosFromIndex: function (page, index, isUp) {
            var l = ImacScreen.getScreen(page).find('>.app-item').length,
                i, pos, data, id, temp;

            var appArr = [];

            for (i = index; i < l; i++) {
                appArr.push(ImacScreen.getAppByIndex(page, i));
            }

            $.each(appArr, function (n, $app) {
                id = $app.data('id');
                data = AppMgr.getAppData(id);

                temp = isUp ? data.index - 1 : data.index + 1;

                // new position
                pos = getAppPosByIndex(temp);
                $app.css(pos);

                data.index = temp;
                AppMgr.cacheAppData(id, data);
            });
        },
        /**
		 * 获取一个屏幕下的应用最新排序
		 * 
		 * @param {Number}
		 *            page 屏幕索引
		 * @return {Array} 当前屏幕下应用排序数组
		 */
        getAppsSort: function (page) {
            var sort = [];

            this.getScreen(page).find('.app-item').each(function (i, app) {
                sort.push($(app).data('id'));
            });

            return sort;
        }
    };

    win.FolderMgr = {
        _data: {},
        cacheFolderData: function (id, data) {
            this._data[id] = $.extend({}, data);
        },

        deleteFolderData: function (id) {
            this._data[id] = null;
            delete this._data[id];
        },
        getFolderData: function(id) {
            var info = this._data[id];

            if (!info)
                return false;

            return $.extend({}, info);
        },

        // updateAppData: function (folderId, appData) {
        // var folder = AppMgr.getAppData(folderId);

        // $.each(folder.apps, function (i, item) {
        // if (item.id === appData.id) {
        // folder.apps[i] = appData;

        // return false;
        // }
        // });

        // AppMgr.cacheAppData(folderId, folder);

        // },

        addAppToFolder: function (appId, folderId) {
            var folder = AppMgr.getAppData(folderId),
                app = AppMgr.getAppData(appId),

                view = $.extend({}, app, {
                    index: folder.apps.length,
                    folderId: folderId
                });

            folder.apps.push(view);


            Util.ajax({
                url: ImacDataActionUrl.addAppToFolderUrl,
                data: {
                    folderId: folderId,
                    appId: appId
                }
            }).done(function(data){
                AppMgr.cacheAppData(folderId, folder);
                AppMgr.cacheAppData(appId, view);

                if(app.needMsgRemind) {
                    ImacScreen.updateFolderNum(folderId);
                }
            });
        },

        removeAppFromFolder: function (appId, folderId) {
            var folder = AppMgr.getAppData(folderId),
                app = AppMgr.getAppData(appId),
                matchIndex = -1;

            $.each(folder.apps, function (i, item) {
                if (matchIndex > -1) {
                    item.index -= 1;
                } else {
                    if (item.id === appId) {
                        matchIndex = i;
                    }
                }
            });

            if (matchIndex > -1) {
                folder.apps.splice(matchIndex, 1);
            }

            AppMgr.folderToScreen(appId, ImacScreen.getActivePage(), function(){
                if(!folder.apps.length) {
                    FolderMgr.removeFolder(folderId);
                } else {
                    AppMgr.cacheAppData(folderId, folder);
                }

                app.folderId = null;
                delete app.folderId;
                AppMgr.cacheAppData(appId, app);

                
                ImacFolder.closeFolder();
            })
            
            
        },

        removeFolder: function(folderId) {
            ImacScreen.removeApp(folderId);
            Util.ajax({
                url: ImacDataActionUrl.removeFolderUrl,
                data: {
                    folderId: folderId
                }
            });
        },

        adjustFolderApps: function (folderId, appId) {
            var folder = AppMgr.getAppData(folderId),
                apps = [],
                app;

            if (appId) {
                $.each(folder.apps, function (i, item) {
                    if (item.id == appId) {
                        app = AppMgr.getAppData(appId);
                    } else {
                        app = item;
                    }
                    apps.push(app);
                });
            } else {
                $.each(folder.apps, function (i, item) {
                    app = AppMgr.getAppData(item.id);
                    apps[app.index] = app;
                });
            }


            folder.apps = apps;
            AppMgr.cacheAppData(folderId, folder);
        },

        updateFolderName: function (folderId, name) {
            var folder = AppMgr.getAppData(folderId);

            folder.name = name;
            AppMgr.cacheAppData(folderId, folder);

            Util.ajax({
                url: ImacDataActionUrl.updateFolderNameUrl,
                data: {
                    folderId: folderId,
                    name: name
                }
            });
        },
        folderIterator: function (callback) {
            $.each(this._data, function (i, folder) {
                callback(AppMgr.getAppData(folder.id));
            });
        }
    };

    win.ImacFolder = {
        _currOpenFolderId: null,
        // 在文件夹中根据index查找应用
        getAppByIndex: function (index) {
            var $folderCover = $('.folder-cover'),
                folderId = $folderCover.data('id'),
                $apps = $folderCover.find('.app-item'),
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
        getAppIndexByPos: function (pos) {
            var c, r, i;

            if (pos.top > 434 || pos.left + APP_WIDTH <= 0 || pos.left > 880) {
                return -1;
            }

            if (pos.left - APP_INIT_LEFT < 0) {
                c = 0;
            } else {
                c = Math.round((pos.left - APP_INIT_LEFT) / (APP_GAP_H + APP_WIDTH));
            }

            if (pos.top - APP_INIT_TOP < 0) {
                r = 0;
            } else {
                r = Math.round((pos.top - APP_INIT_TOP) / (APP_GAP_V + APP_HEIGHT));
            }

            // i = c * APP_COUNT_PER_COLUMN + r;
            i = r * appNumPerRow + c;

            return i;
        },
        // 根据index调整应用位置
        adjustAppPosByIndex: function (id, index) {
            var $folderCover = $('.folder-cover'),
                folderId = $folderCover.data('id'),
                data = AppMgr.getAppData(id),
                pos = getAppPosByIndexInFolder(index),
                $app = ImacScreen.getApp(id);

            if (Util.browsers.isIE8 || Util.browsers.isIE9) {
                $app.stop(true).animate(pos, 200);
            } else {
                $app.css(pos);
            }

            if (data.index != index) {
                data.index = index;

                AppMgr.cacheAppData(id, data);
            }
        },

        updateAppNum: function (appId, count) {
            var $folderCover = $('.folder-cover'),
                $app = $folderCover.find('.app-item[data-id="' + appId + '"]'),
                $unread = $app.find('.unread');

            if (count) {
                $unread.text(Util.parseNum(count)).removeClass('hidden');;
            } else {
                $unread.addClass('hidden');
            }
        },
        removeApp: function(appId, folderId) {
            var $folderCover = $('.folder-cover'),
                $app = $folderCover.find('.app-item[data-id="' + appId + '"]');

            ImacScreen.addApp(appId, ImacScreen.getActivePage());
            
            FolderMgr.removeAppFromFolder(appId, folderId);

             // 去除draggable功能
            AppDragMgr.destroy($app);
            $app.remove();

        },
        openFolder: function (id) {
            var data = AppMgr.getAppData(id),
                $screen = ImacScreen.getScreen(activePage),
                html, appHtml = [];
            $.each(data.apps, function (i, item) {
                var pos = getAppPosByIndexInFolder(i),
                    view = $.extend({}, item, pos);
                if (item.needMsgRemind) {
                    view.count = Util.parseNum(view.count);
                }

                appHtml.push(M.render(appTempl, view));

            });

            html = M.render(FOLDER_TPL, $.extend({}, data, {
                appHTML: appHtml.join('')
            }));

            $screensCon.append(html);

            AppDragMgr.enableFolderApps();

            this._currOpenFolderId = id;
             // 将所有打开的应用隐藏掉，避免遮住
            TabsNav.minAllTabs();

        },
        closeFolder: function () {
            if(!this._currOpenFolderId) {
                return;
            }
            var $folderCover = $('.folder-cover', $screensCon),
                folderId = $folderCover.data('id');

            $folderCover.remove();

            this._currOpenFolderId = null;

            ImacScreen.updateFolderApps(folderId);
            ImacScreen.updateFolderNum(folderId);

        },
        getAppsSort: function(folderId) {
            var sort = [],
                folder = AppMgr.getAppData(folderId);

            $.each(folder.apps, function(i, item){
                sort.push(item.id);
            })

            return sort;
        }
    }
})(this, jQuery);

// 文件夹相关操作
(function (win, $) {
    $(document).on('click', function (e) {
        var $target = $(e.target);

        if ($target.hasClass('folder-cover') || (!$target.closest('.imac-screen').length && !$target.closest('.folder-cover').length && !$target.closest('.ep-context-menu').length)) {
            ImacFolder.closeFolder();
        }
    }).on('click', '.folder-name-text', function (e) {
        var $this = $(this),
            oVal = $this.text(),
            $p = $this.parent(),
            $folderCover = $p.closest('.folder-cover'),
            folderId = $folderCover.data('id'),
            $input = $p.find('.folder-name-input');
        $input.val(oVal);

        $p.addClass('edit');
        $input.focus().off('blur keyup').on('blur', function (e) {
            onSaveName();
        }).on('keyup', function (e) {
            // 回车自动保存
            if (e.which === 13) {
                onSaveName();
            }
        });

        function onSaveName() {
            var val = $input.val();

            if(!val) {
                epoint.showTips('文件夹名称不能为空！', {
                    state: 'error'
                });
                return;
            }

            if (oVal != val) {
                $this.text(val);

                ImacScreen.updateFolderName(folderId, val);
            }

            $p.removeClass('edit');
        }
    });

})(this, jQuery);

// 应用拖动模块
(function (win, $) {
    var $screensCon = $('#imac-screens-container');

    // $quickApps = $('#imac-right-bar .quick-apps'),
    // // list
    // $quickAppList = $('.app-list', $quickApps),
    // // wrap
    // $quickAppWrap = $('.list-wrap', $quickApps);

    // 是否靠近toolbar区域
    // var isNearToolbar = function (pos) {
    // // 非快捷应用不能拖进
    // if (!win.rightUseQuickApps) return false;
    // var win_w = $(window).width();

    // return (win_w - pos.left <= 180);
    // };

    // 屏幕应用拖拽 stop回调
    var screenAppDragStop = function (event, ui) {
        var $el = $(this),
            id = $el.data('id'),
            data = AppMgr.getAppData(id),
            pos = ui.offset, // 应用所在分屏
            $p = $el.parent(), // 交换位置的应用
            $t = null,
            l = $p.find('.app-item').length,
            i = ImacScreen.getAppIndexByPos(pos);

        $el.addClass('trans').removeClass('app-drag-zindex');

        // 位置是否变化，标识是否要发请求
        var posChanged = false, // 位置变化的应用数组，用以进行调整位置
            changedAppPosArr = [];

        // 如果 $target 有值，说明是文件夹操作
        if ($target) {
            addToFolder($target, $el);
            $target.removeClass('folding');
            $target = null;
        } // 如果在原位置 则归位
        // 否则判断是否移动到最后
        // 最后则是插入情况，再分为前移和后移
        else if (i == -1 || i == data.index) {
            ImacScreen.adjustAppPosByIndex(id, data.index);
        } else if (i + 1 > l) {
            // 到最后位置
            var $lastApp = $p.children('.app-item').last();

            $el.nextAll().each(function (ix, item) {
                changedAppPosArr.push({
                    id: item.getAttribute('data-id'),
                    index: data.index + ix
                });
                // ImacScreen.adjustAppPosByIndex(item.getAttribute('data-id'),
				// data.index + ix);
            });
            $el.insertAfter($lastApp);
            changedAppPosArr.push({
                id: id,
                index: l - 1
            });
            // ImacScreen.adjustAppPosByIndex(id, l - 1);
            posChanged = true;
        } else {
            $t = ImacScreen.getAppByIndex(ImacScreen.getActivePage(), i);
            posChanged = true;

            // 记录自身位置改变
            changedAppPosArr.push({
                id: id,
                index: i
            });

            if (i < data.index) {
                // 向前移动
                $el.insertBefore($t);

                // ImacScreen.adjustAppPosByIndex(id, i);

                // 记录其余位置的改变
                $el.nextAll().each(function (ix, item) {
                    changedAppPosArr.push({
                        id: item.getAttribute('data-id'),
                        index: i + ix + 1
                    });
                    // ImacScreen.adjustAppPosByIndex(item.getAttribute('data-id'),
					// i + ix + 1);
                });
            } else {
                // 向后移动
                $el.insertAfter($t);

                // ImacScreen.adjustAppPosByIndex(id, i);

                // 记录其余位置的改变
                $el.prevAll().each(function (ix, item) {
                    changedAppPosArr.push({
                        id: item.getAttribute('data-id'),
                        index: i - 1 - ix
                    });
                    // ImacScreen.adjustAppPosByIndex(item.getAttribute('data-id'),
					// i - 1 - ix);
                });
            }
        }
        // 最后统一调整位置
        $.each(changedAppPosArr, function (i, app) {
            // ImacScreen.adjustAppPosByIndex(app.id, app.index);
            setTimeout(function () {
                ImacScreen.adjustAppPosByIndex(app.id, app.index);
            }, 20 * i);
        });

        // 发送请求
        if (posChanged) {
            Util.ajax({
                url: win.ImacDataActionUrl.updateAppPosUrl,
                data: {
                    appId: id,
                    screenId: ImacScreen._screenCache[ImacScreen.getActivePage()].id,
                    sort: JSON.stringify(ImacScreen.getAppsSort(ImacScreen.getActivePage()))
                }
            });
        }
    };

    // 应用拖动至文件夹
    var addToFolder = function ($target, $app) {
        var appId = $app.data('id'),
            data = AppMgr.getAppData(appId);;
        if ($target.hasClass('folder')) {
            ImacScreen.addAppToFolder(appId, $target.data('id'));
        } else {
            var targetId = $target.data('id'),
                targetData = AppMgr.getAppData(targetId);
            AppMgr.creatFolder(targetData, function (folder) {
                ImacScreen.addAppToFolder(appId, folder.id);
            });
        }
    };

    // 屏幕应用拖拽 start回调
    var screenAppDragStart = function () {
        $(this).removeClass('trans').addClass('app-drag-zindex');
    };

    var $target;
    var screenAppDragging = function (event, ui) {
        var pos = ui.position,
            oPos = ui.originalPosition,
            offset = ui.offset,
            tOffset, i, $t;

        if (ui.helper.hasClass('folder') || Math.abs(pos.left - oPos.left) <= APP_WIDTH / 2 && Math.abs(pos.top - oPos.top) <= APP_HEIGHT / 2) {
            $target = null;
            return;
        }

        $target && $target.removeClass('folding');
        i = ImacScreen.getAppIndexByPos(pos);
        if (i > -1) {
            $t = ImacScreen.getAppByIndex(ImacScreen.getActivePage(), i);
            if ($t) {
                tOffset = $t.offset();
                if (Math.abs(offset.left - tOffset.left) <= APP_WIDTH / 2 && Math.abs(offset.top - tOffset.top) <= APP_HEIGHT / 2) {
                    $t.addClass('folding');
                } else {
                    $t = null;
                }
            }

        }
        $target = $t;
    };

    var folderAppDragStop = function (event, ui) {
        var $folderCover = $('.folder-cover'),
            folderId = $folderCover.data('id'),
            $el = $(this),
            id = $el.data('id'),
            data = AppMgr.getAppData(id),
            pos = ui.position, // 应用所在文件夹
            $p = $el.parent(), // 交换位置的应用
            $t = null,
            l = $p.find('.app-item').length,
            i = ImacFolder.getAppIndexByPos(pos);

        $el.addClass('trans').removeClass('app-drag-zindex');

        // 位置是否变化，标识是否要发请求
        var posChanged = false, // 位置变化的应用数组，用以进行调整位置
            changedAppPosArr = [];

       
        // 如果移出文件夹，则将app插入到桌面最后
        if(i == -1) {
            ImacFolder.removeApp(id, folderId);
            return;
        }
         // 如果在原位置 则归位
        if (i == data.index) {
            ImacFolder.adjustAppPosByIndex(id, data.index);
        } else if (i + 1 > l) {
            // 到最后位置
            var $lastApp = $p.children('.app-item').last();

            $el.nextAll().each(function (ix, item) {
                changedAppPosArr.push({
                    id: item.getAttribute('data-id'),
                    index: data.index + ix
                });
            });
            $el.insertAfter($lastApp);
            changedAppPosArr.push({
                id: id,
                index: l - 1
            });
            // ImacScreen.adjustAppPosByIndex(id, l - 1);
            posChanged = true;
        } else {
            $t = ImacFolder.getAppByIndex(i);
            posChanged = true;

            // 记录自身位置改变
            changedAppPosArr.push({
                id: id,
                index: i
            });

            if (i < data.index) {
                // 向前移动
                $el.insertBefore($t);
                // 记录其余位置的改变
                $el.nextAll().each(function (ix, item) {
                    changedAppPosArr.push({
                        id: item.getAttribute('data-id'),
                        index: i + ix + 1
                    });
                });
            } else {
                // 向后移动
                $el.insertAfter($t);

                // 记录其余位置的改变
                $el.prevAll().each(function (ix, item) {
                    changedAppPosArr.push({
                        id: item.getAttribute('data-id'),
                        index: i - 1 - ix
                    });
                });
            }
        }
        // 最后统一调整位置
        // $.each(changedAppPosArr, function (i, app) {
        // setTimeout(function () {
        // ImacFolder.adjustAppPosByIndex(app.id, app.index);
        // }, 20 * i);
        // 

        var adjustAppPos = function () {
            var app = changedAppPosArr.shift();
            if (app) {
                ImacFolder.adjustAppPosByIndex(app.id, app.index);
                setTimeout(function () {
                    adjustAppPos();

                }, 20);
            } else {
                FolderMgr.adjustFolderApps(folderId);
            }

        };

        adjustAppPos();
        // 发送请求
        if (posChanged) {
            Util.ajax({
                url: win.ImacDataActionUrl.updateAppPosUrl,
                data: {
                    appId: id,
                    folderId: folderId,
                    sort: JSON.stringify(ImacFolder.getAppsSort(folderId))
                }
            });
        }
    };

    var screenAppDragConfig = {
        containment: 'parent',
        // containment: '.screen-list',
        scroll: false,
        opacity: 0.5,
        distance: 10,
        start: screenAppDragStart,
        drag: screenAppDragging,
        stop: screenAppDragStop
    };

    var folderAppDragConfig = {
        containment: '.folder-cover',
        scroll: false,
        opacity: 0.5,
        distance: 10,
        start: screenAppDragStart,
        stop: folderAppDragStop
    }

    win.AppDragMgr = {
        enableAllScreenApps: function () {
            $screensCon.find('.app-item').draggable(screenAppDragConfig);
        },

        enableFolderApps: function () {
            $('.folder-container').find('.app-item').draggable(folderAppDragConfig);
        },

        enableScreenApp: function (id) {
            ImacScreen.getApp(id).draggable(screenAppDragConfig);
        },

        destroy: function ($app) {
            $app.draggable('destroy');
        }
    };
})(this, jQuery);

// 分屏页面居中
(function (win, $) {
    var $widget = $('#imac-screen-pages'),
        widget_w = $widget.width();

    var adjustLeft = function () {
        var left = ($('body').width() - widget_w) / 2;

        $widget.css('left', left);
    };

    $(win).on('resize', adjustLeft);

    adjustLeft();
})(this, jQuery);

// 底部任务栏
(function (win, $) {
    var $taskBar = $('#imac-taskbar'),
        $tasksWrap = $('.tasks-wrap', $taskBar),
        $taskList = $('.task-list', $taskBar),
        $dropPanel = $('#task-drop'), // $dropBTn = $('.drop-btn',
										// $dropPanel),
        $dropList = $('.drop-list', $dropPanel);

    var DROP_SHOW_BOTTOM = 44,
        DROP_HIDE_BOTTOM = -280;

    // 包括a.scroll-l,a.scroll-r
    // var $scrollWrap = $taskBar.find('.scroll-wrap');

    var M = Mustache,
        taskTempl = $.trim(TASK_ITEM_TPL);

    // contextmenu for .task-item
    var contextMenu = new EpContextMenu({
        items: [{
            text: '显示桌面',
            click: function () {
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
                TabsNav.removeAll(id);
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

    // 只处理显示的、最大化的窗口
    var adjustTaskDialogSize = function () {
        var p, d;

        for (p in taskCache) {
            if (taskCache.hasOwnProperty(p)) {
                d = taskCache[p];

                if (!d.isHidden() && d.isMax()) {
                    d.maxWin();
                }
            }
        }
    };

    var taskCache = {};
    // 右侧按钮宽度
    var DROP_BTN_WIDTH = 0, // 任务宽度
        TASK_WIDTH = 114, // 最大宽度
        max_w = 0;
    // 调整尺寸
    var adjustTaskBar = function () {
        max_w = $taskBar.width() - DROP_BTN_WIDTH;

        var tabs_w = TASK_WIDTH * $taskList.children().length;
        if (tabs_w > 0) {
            $taskList.css('width', tabs_w);
        }

        if (tabs_w > max_w) {
            $tasksWrap.css('width', max_w);
            var scrollRange = tabs_w - max_w;
            $taskList.stop(true).animate({
                marginLeft: -scrollRange
            }, 500);
        } else {
            $taskList.stop(true).animate({
                marginLeft: 0
            }, 500);
            $tasksWrap.css('width', 'auto');
        }
    };
    win.TabsNav = {
        _data: taskCache,
        addTab: function (data) {
            // 如果data是一个字符串或者数字 则是表示id 是内部应用的打开 否则为内部页面调用
            if ('stringnumber'.indexOf(typeof data) != -1) {
                this.openTask(data);
                return;
            }

            data.id = data.id || +new Date();
            data.icon = data.icon || './images/app/8.png';

            if (!taskCache[data.id]) {
                $(M.render(taskTempl, {
                    id: data.id,
                    name: data.name,
                    icon: data.icon
                })).appendTo($taskList);

                $(M.render(DROP_ITEM_TPL, {
                    id: data.id,
                    name: data.name
                })).appendTo($dropList);

                adjustTaskBar();
            }
            TabsNav.openTask(data);
            TabsNav.activeTask(data.id);
        },
        openTask: function (id) {
            var data, dialog = null,
                bs = Util.getBdSize();
            // 加入参数为对象的兼容处理
            if (typeof id == 'object') {
                data = id;
                id = data.id || +new Date();
            } else {
                data = AppMgr.getAppData(id);
            }

            // 显示下拉面板
            $dropPanel.removeClass('hidden');

            if (!taskCache[id]) {
                // 处理宽高比例 禁止大于1的数据
                data.widthRatio = data.widthRatio > 1 ? 1 : data.widthRatio;
                data.heightRatio = data.heightRatio > 1 ? 1 : data.heightRatio;

                dialog = new EpDialog({
                    id: id + '-epdialog',
                    title: data.name,
                    url: Util.getRightUrl(data.url),
                    draggable: true,
                    // 窗口拖拽时限制在某容器之内
                    dragContainer: '.imac-screen',
                    resizable: true,
                    // resize 容器
                    resizeContainer: '.imac-screen',
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
                            TabsNav.removeTab(opt.id);
                            return false;
                        }
                    }]
                }).setOptions('id', id);

                // 是否全屏的配置 视占满的也为最大化
                data.isFullView = data.isFullView || (data.widthRatio == 1 && data.heightRatio == 1);

                if (data.isFullView) {
                    dialog.show(0, false).maxWin();
                } else {
                    dialog.show(0, true);
                }

                taskCache[id] = dialog;
            } else {
                dialog = taskCache[id];

                dialog.show(0, false);
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
        addOrActiveTab: function (id) {
            var isOn = taskCache[id],
                data = AppMgr.getAppData(id);

            if (!isOn) {
                $(M.render(taskTempl, {
                    id: data.id,
                    name: data.name,
                    icon: data.icon
                })).appendTo($taskList);

                $(M.render(DROP_ITEM_TPL, {
                    id: data.id,
                    name: data.name
                })).appendTo($dropList);

                adjustTaskBar();
            }

            TabsNav.openTask(id);
            TabsNav.activeTask(id);
        },

        // 调节任务位置在可视范围内
        makeTabVisiable: function (id) {
            var $task = TabsNav.getTab(id),
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

            if (!dis)
                return;

            $taskList.stop(true).animate({
                marginLeft: -dis
            }, 300);
        },

        // 获取任务元素
        getTab: function (id) {
            // return $taskList.find('[data-id="' + id + '"]');
            return $taskList.find('#' + id + '-task');
        },

        // 移除任务
        removeTab: function (id) {
            var $task = TabsNav.getTab(id);

            if (!$task.length)
                return;

            $task.remove();
            // drop 中的
            $dropList.find('#' + id + '-drop').remove();

            // 已经为空时则隐藏
            if (!$dropList.children().length) {
                $dropPanel.addClass('hidden');
            }

            taskCache[id].hide().destroy();
            taskCache[id] = null;
            delete taskCache[id];

            adjustTaskBar();
        },

        // 移除除了指定id的所有任务
        _removeOthers: function (stayId) {
            var $tasks = $taskList.find('.task-item');

            if (!$tasks.length)
                return;

            $tasks.each(function (i, el) {
                var $el = $(el),
                    id = $el.data('id');

                if (stayId != id) {
                    TabsNav.removeTab(id);
                }
            });
        },
        removeAll: function (exceptId) {
            exceptId ? this._removeOthers(exceptId) : this._removeAll();
        },

        // 移除所有任务
        _removeAll: function () {
            var $tasks = $taskList.find('.task-item');

            if (!$tasks.length)
                return;

            $tasks.each(function (i, el) {
                var $el = $(el),
                    id = $el.data('id');

                // TabsNav.removeTab(id);
                $el.remove();

                taskCache[id].hide().destroy();
                taskCache[id] = null;
                delete taskCache[id];
            });

            $dropPanel.addClass('hidden');

            $dropList.children().each(function (i, el) {
                $(el).remove();
            });

            adjustTaskBar();
        },

        // 激活任务
        activeTask: function (id) {
            var $task = TabsNav.getTab(id);

            if (!$task.hasClass('active')) {
                $task.addClass('active').siblings().removeClass('active');
            }

            // make active task visiable
            // TabsNav.makeTabVisiable(id);
            this.adjustTabPosOnActive(id);

            // 隐藏我的看板
            ImacBoard.hide();
        },
        adjustTabPosOnActive: function (id) {
            var $el = $taskList.find('#' + id + '-task');
            ($prevs = $el.prevAll()),
            (prev_w = TASK_WIDTH * $prevs.length),
            (scroll_w = Math.ceil(Math.abs(parseFloat($taskList.css('margin-left'), 10)))),
            // 目标ml
            (aimMarginLeft = scroll_w);

            if (prev_w < scroll_w) {
                aimMarginLeft = prev_w;
            } else if (prev_w >= max_w + scroll_w) {
                aimMarginLeft = prev_w + TASK_WIDTH - max_w;
            } else if (prev_w > scroll_w && prev_w < max_w + scroll_w && prev_w + TASK_WIDTH > max_w + scroll_w) {
                aimMarginLeft = prev_w + TASK_WIDTH - max_w;
            }

            $taskList.stop(true).animate({
                marginLeft: -aimMarginLeft
            }, 500);
        },
        refreshTabContent: function (id) {
            var dialog = taskCache[id];
            dialog && dialog.refresh && dialog.refresh();
        }
    };

    // epdialog - HD 点击时切换到最上
    $('body').on('click', '.epdialog-hd', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // 只有点击头部才触发，需要排除右侧按钮
        if (!/^epdialog-hd(?!-btn)/.test(e.target.className))
            return;
        var dialogId = $(this).parent('.epdialog')[0].id;

        var appId = dialogId.replace(/(.+)-epdialog$/, '$1');
        if (appId)
            TabsNav.addOrActiveTab(appId);
    });

    var timer;
    $(win).on('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            adjustTaskBar();
            adjustTaskDialogSize();
        }, 100);
    });

    $taskBar // 任务项目点击
        .on('click', '.task-item', function () {
            var $el = $(this),
                id = $el.data('id'),
                d = taskCache[id];

            if (!$el.hasClass('active')) {
                $el.addClass('active').siblings().removeClass('active');

                d.show(0, 0);
            } else {
                d.toggle();
            }
            TabsNav.activeTask(id);
        }) // 支持contextmenu快捷操作
        .on('contextmenu', '.task-item', function (event) {
            var id = $(this).data('id');

            contextMenu.setOptions('id', id).show({
                x: event.pageX,
                y: event.pageY
            });

            return false;
        });

    // 切换下拉面板
    var toggleDrop = function (hide) {
        var aim_bottom;
        if (hide) {
            $dropPanel.addClass('show');
        } else {
            // 任务栏添加z-index 以便遮住下拉面板
            $taskBar.addClass('drop-zindex');
        }

        // 隐藏
        if ($dropPanel.hasClass('show')) {
            aim_bottom = DROP_HIDE_BOTTOM;
        } else {
            // 显示
            aim_bottom = DROP_SHOW_BOTTOM;
        }
        $dropList.stop(true).animate({
            bottom: aim_bottom
        }, function () {
            $taskBar.removeClass('drop-zindex');
        });
        $dropPanel.toggleClass('show');
    };

    // 准备滚动条
    Util.doNiceScroll($dropList, {
        cursorwidth: '2px',
        cursorcolor: '#3b4252',
        cursorborder: '1px solid #aaa'
    });

    $dropPanel.on('click', '.drop-btn', function (e) {
            e.stopPropagation();
            // 无列表时不响应下拉
            if (!$dropList.children().length) {
                return;
            }
            // $dropPanel.toggle('show');
            toggleDrop();
        }) // 点击打开
        .on('click', '.drop-item', function (e) {
            e.stopPropagation();
            var id = this.getAttribute('data-id');
            // TabsNav.makeTabVisiable(id);
            TabsNav.addTab(id);
            TabsNav.activeTask(id);
            toggleDrop();
        });
    // 空白处点击 收起drop
    $('body').on('click', function (e) {
        if (!$(e.target).closest('.drop-panel').length) {
            if ($dropPanel.hasClass('show')) {
                toggleDrop(true);
            }
        }
    });

    adjustTaskBar();
})(this, jQuery);

// 消息提醒
(function (win, $) {
    var $msgSound = $('#msg-sound');

    var SOUND_URL = '../../msgsound/sound.html',
        ROLLER_TEXT = '您有新消息提醒，请点击查看！';
    /**
	 * 播放新消息的声音提醒
	 * 
	 * @param {number}
	 *            retryLimit chrome 下用户未操作的最大播放次数
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
		 * @param {number |
		 *            undefined} retryLimit chrome 下用户未操作的最大播放次数
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

    // 消息图标
    var $rightBar = $('#imac-right-bar'),
        $infoIcon = $('.message', $rightBar),
        $msgNum = $('.msg-num', $infoIcon),
        $emsgIcon = $('.emsg', $rightBar),
        $eMsgNum = $('.msg-num', $emsgIcon);

    // document title roller
    var title, rollerTip = ROLLER_TEXT,
        timer = 0;

    var restoreDocTitle = function () {
        title = win.systemTitle || document.title;
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
    var docTitle = {
        roll: rollMsgTip,
        stop: restoreDocTitle
    };
    // var parseNum = function (num) {
    // var n = parseInt(num, 10);

    // if (n > 99) {
    // return '99+';
    // } else if (n <= 0) {
    // return '';
    // }

    // return n + '';
    // };
    var nNum = 0,
        oNum = 0,
        hasNew, hasMessage;
    // check unread message
    var checkMsg = function () {
        hasNew = false;
        hasMessage = false;
        Util.ajax({
            url: win.ImacDataActionUrl.msgCountUrl,
            data: {
                haseXun: true,
                // 是否包含eXun 消息数目
                needNum: true // 是否需要实际的提醒数目
            },
            success: function (data) {
                if (data.remind) {
                    nNum = parseInt(data.remind) || 0;
                    oNum = $msgNum.data('num') || 0;

                    if (nNum > oNum) {
                        hasNew = true;
                    } else if (nNum) {
                        hasMessage = true;
                    }

                    $msgNum.text(Util.parseNum(nNum)).data('num', nNum).removeClass('hidden');
                } else {
                    $msgNum.text('').data('num', 0).addClass('hidden');
                }

                if (data.eXun) {
                    nNum = parseInt(data.eXun) || 0;
                    oNum = parseInt($eMsgNum.data('num'), 10) || 0;
                    if (nNum > oNum) {
                        hasNew = true;
                    }
                    $eMsgNum.removeClass('hidden').text(Util.parseNum(nNum)).data('num', nNum);
                } else {
                    $eMsgNum.text('').addClass('hidden');
                }

                if (hasNew) {
                    // 声音提醒
                    playNewMsgSound(100);
                    // 标题滚动
                    docTitle.roll();
                } else if (!hasMessage) {
                    // stop
                    docTitle.stop();
                }
            }
        });
    };

    checkMsg();
    win.updateMsgRemindNum = checkMsg;
    // check unread message per 1 min
    setInterval(checkMsg, 60 * 1000);
})(this, jQuery);

// 侧边工具栏 - 快捷应用或最近使用
// (function(win, $) {
// // 空白提示文字图片的路径
// var QUICK_TIPS_PATH = './images/right/quick-tips.png',
// RECENT_TIPS_PATH = './images/right/recent-tips.png';

// var $quickApps = $('#imac-right-bar .quick-apps'),
// $emptyTips = $('.r-empty-tpis-bg', $quickApps),
// $emptyTipsImg = $emptyTips.find('#r-empty-tips'),
// $wrap = $('.list-wrap', $quickApps);

// // 上方元素高度
// var PREV_HEIGHT = 0,
// // 下方元素高度
// NEXT_HEIGHT = 0,
// // topbar高度
// TOP_BAR_HEIGHT = 50,
// // 应用高度
// // APP_HEIGHT = 50,
// // // 每次滚动的距离
// // SCROLL_UNIT = 60,
// // 可视区域高度
// wrap_h = 0;

// var M = Mustache,
// dockAppTempl = $.trim(DOCK_APP_TPL);

// // 调整应用wrap的高度
// var adjustListHeight = function() {
// PREV_HEIGHT = $quickApps.position().top;
// NEXT_HEIGHT = $quickApps.next().outerHeight();

// var bd_h = $('body').height();
// wrap_h = bd_h - (TOP_BAR_HEIGHT + PREV_HEIGHT + NEXT_HEIGHT);

// $wrap.css('height', wrap_h);
// };
// // 应用列表初始化滚动条
// Util.doNiceScroll($wrap, {
// cursorwidth: '2px',
// cursorcolor: '#3b4252',
// cursorborder: '1px solid #aaa'
// });

// var timer;
// $(win).on('resize', function() {
// clearTimeout(timer);
// timer = setTimeout(function() {
// adjustListHeight();
// }, 100);
// });

// var createAppContextMenu = function() {
// var items = [],
// funcs = AppCmFuncs;

// items.push({
// text: '打开应用',
// click: funcs.openApp
// });
// items.push('sep');

// items.push({
// text: '移除应用',
// click: function(opt) {
// QuickApps.removeApp(opt.id);
// }
// });

// var cm = new EpContextMenu({
// items: items
// }).setOptions('from', 'toolbar');

// return cm;
// };

// // contextmenu for .dock-app
// var appCm = createAppContextMenu();

// $quickApps
// // 点击打开
// .on('click', '.dock-app', function() {
// var id = $(this).data('id');

// AppMgr.openApp(id);
// })
// // 右键菜单
// .on('contextmenu', '.dock-app', function(event) {
// // 最近使用不响应右键菜单
// if (!win.rightUseQuickApps) return;

// var id = $(this).data('id');

// appCm.setOptions('id', id).show({
// x: event.pageX,
// y: event.pageY
// });

// return false;
// });

// win.QuickApps = {
// // 展示空提示
// showEmptyTips: function() {
// $emptyTipsImg
// .attr('src', win.rightUseQuickApps ? QUICK_TIPS_PATH : RECENT_TIPS_PATH)

// .parent()
// .removeClass('hidden');
// },
// hideEmptyTips: function() {
// $emptyTips.addClass('hidden');
// },
// // 是否达到最大数
// isFull: function() {
// var n = $wrap.find('.dock-app').length,
// r = n == MAX_DOCK_APP_NUM;

// if (r) {
// mini.showMessageBox({
// title: '系统提示',
// message: '很抱歉，工具栏中的快捷应用已满（当前配置为最多' + MAX_DOCK_APP_NUM + '个）,建议移除个别不常用的应用。',
// buttons: ['ok'],
// iconCls: 'mini-messagebox-info'
// });
// // dockFullTip.show(true);
// }

// // return n == MAX_DOCK_APP_NUM;
// return r;
// },
// // init 初始化渲染
// isInit: false,
// init: function() {
// if (this.isInit) return;
// // 调整容器高度
// adjustListHeight();

// var ids = win.rightUseQuickApps ? Util.localMemory.QuickApps.get() :
// Util.localMemory.RecentApps.get();
// // renderApps(data);
// if (ids.length) {
// $.each(ids, function(i, id) {
// QuickApps.addApp(id, true);
// });
// } else {
// this.showEmptyTips();
// }
// this.isInit = true;
// },
// _addApp: function(id, init) {
// // 渲染应用
// var data = AppMgr.getAppData(id),
// $app = null;

// if (!data) return;

// data.sname = Util.getAppShortName(data.name);

// $app = $(M.render(dockAppTempl, data));

// // 数据已经是头部插入了 初始化直接按顺序即可 之后新增的 头部插入
// $app[init ? 'appendTo' : 'prependTo']($wrap);

// // 非初始化时 非最近使用 才高亮
// !init && !win.rightUseQuickApps && Util.highlightApp($app);

// return $app;
// },
// /**
// * 新增一个快捷应用
// *
// * @param {String} id 应用id
// * @param {Boolean} init 是初始化？
// * @param {Boolean} isMove 是移动？
// * @returns
// */
// addApp: function(id, init, isMove) {
// // 新增应用前先去掉空的提示
// this.hideEmptyTips();

// // 本地缓存中添加
// win.rightUseQuickApps ? Util.localMemory.QuickApps.add(id) :
// Util.localMemory.RecentApps.add(id);

// // 已经存在则不用处理
// // if ($.inArray(id, Util.localMemory.QuickApps.get()) != -1) {
// if (this.getApp(id).length) {
// // 最近使用是累加方式 不用提醒
// if (!win.rightUseQuickApps) return;

// mini.showMessageBox({
// title: '系统提示',
// message: '此应用已在右侧快捷应用中了',
// buttons: ['ok'],
// iconCls: 'mini-messagebox-warning'
// });
// return;
// }

// // 移动动画
// if (isMove) {
// // 新增并隐藏（不能在动画完成再添加，会导致计数不正确)
// var $app = this._addApp(id, init).addClass('hidden');

// var $fromApp = ImacScreen.getApp(id),
// pos = $fromApp.position();
// var $cloneApp = $fromApp
// .clone()
// .removeClass('trans')
// .css({
// position: 'absolute',
// top: pos.top + 50,
// zIndex: 5000
// })
// .appendTo('body');

// $cloneApp.animate(
// {
// top: 180,
// left: Util.getBdSize().width - 60
// // right: 0
// },
// function() {
// $cloneApp.remove();
// $cloneApp = null;
// // 显示新增的应用
// $app.removeClass('hidden');
// }
// );
// return;
// }

// // 新增
// this._addApp(id, init);
// },

// getApp: function(id) {
// return $wrap.find('[data-id="' + id + '"]');
// },

// removeApp: function(id) {
// var $app = this.getApp(id);

// if (!$app.length) return;

// // 本地移除
// // Util.localMemory.QuickApps.remove(id);
// Util.localMemory[win.rightUseQuickApps ? 'QuickApps' :
// 'RecentApps'].remove(id);
// // 去除draggable功能
// // AppDragMgr.destroy($app);

// $app.remove();
// }
// };

// // 应用加载完毕之后异步加载快捷应用 或最近使用
// // setTimeout(win.QuickApps.init, 20);
// ImacEvent.on('afterAllAppsLoad', function() {
// setTimeout(function() {
// QuickApps.init();
// }, 20);
// });
// })(this, jQuery);

// 初始化Imac默认应用
(function (win, $) {
    $.each(win.quickApps, function (i, data) {
        data = Util.fixPath(data);

        data.hasTaskbarIcon = true;

        AppMgr.cacheAppData(data.id, data);
    });

    $('body').on('click', '.default-app-btn', function (event) {
        event.preventDefault();

        var id = $(this).data('id');

        if (!id)
            return;

        AppMgr.openApp(id);
    });
})(this, jQuery);

// 获取用户信息 和 界面信息
(function (win, $) {
    var $userInfo = $('#top-user');

    // 加载图片 用户用户头像和logo 只有返回的资源可加载才会加载
    var loadImg = function (url, el) {
        if (!url) {
            return;
        }

        url = Util.getRightUrl(url);

        var img = new Image();

        img.onload = function () {
            img.onload = null;
            el.src = url;
        };

        img.onerror = function () {
            img.onerror = null;
            console.error(url + '对应的图片资源无法加载！');
        };

        img.src = url;
    };

    // 获取用户信息
    var getUserInfo = function () {
        return Util.ajax({
            url: win.ImacDataActionUrl.userInfoUrl
        }).done(function (data) {
            // user and ou
            $userInfo.find('.user-name').text(data.name + '，您好！');
            $userInfo.find('.user-ou').text(data.ouName);

            // portrait
            data.portrait && loadImg((function (url) {
                url = /^data:image/.test(url) ? url : Util.getRightUrl('rest/' + url);
                return url;
            })(data.portrait), $userInfo.find('.user-img')[0]);

            // 用户guid和name是E讯必须要使用的 需要记录下来
            win._userName_ = data.name;
            win._userGuid_ = data.ouName;

            ImacEvent.fire('afterUserInfo', data);
        });
    };

    getUserInfo();

    // 界面信息
    var getPageInfo = function () {
        return Util.ajax({
            url: ImacDataActionUrl.pageInfoUrl
        }).done(function (data) {
            // logo
            loadImg(Util.getRightUrl(data.logo || win.DEFAULT_LOGO_URL), $('.sys-logo')[0]);

            // title
            if (data.title) {
                document.title = data.title;
                win.systemTitle = data.title;
            }
            // fullsearch
            win._fullSearchUrl_ = data.fullSearchUrl;

            ImacEvent.fire('afterPageInfo', data);
        });
    };

    getPageInfo();
})(this, jQuery);

/*
 * 打开E讯聊天窗口 sessionid 会话id，当传入一个参数时sessionid表示uid uid 对方用户id type 个人：friend
 * 讨论组：group
 */
var eMsgSocket;
window.OpenEMsg = function (sessionid, uid, type) {
    /* global eMsg , {eMsgSocket:true} */
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

// E 讯消息列表
(function (win, $) {
    var $emsgIcon = $('.q-btn.emsg'),
        $eMsgNum = $('.msg-num', $emsgIcon),
        $msgEMsg = $('#msgEMsg'),
        $msgEMsgContent = $('.msg-panel-content', $msgEMsg),
        $msgEMsgRecent = $('.emsg-recent-list', $msgEMsgContent),
        $onlineUserNum = $('.online-user-num', $msgEMsg),
        onlineUserIframe = document.getElementById('online-user');

    var emsgList;

    var decreaseEmsgCount = function (sessionid) {
        var cnt = $eMsgNum.text();
        if (cnt) {
            cnt = parseInt(cnt, 10) - 1;
        }
        if (cnt == 0) {
            cnt = '';
            $eMsgNum.data('num', 0).addClass('hidden');
        }
        $eMsgNum.text(cnt);
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
            onDecEmsgCount: function (sessionid) {
                decreaseEmsgCount(sessionid);
            }
        });

        win.RefreshEMsg = $.proxy(emsgList.getData, emsgList);
    }

    if (!win.EMsgList) {
        Util.loadJs('frame/fui/js/widgets/emsglist/emsglist.js', function () {
            initEMsgList();
        });
    } else {
        initEMsgList();
    }
    /* global OnlineUserSettings */
    if (win.OnlineUserSettings && win.OnlineUserSettings.show) {
        $msgEMsg.find('.msg-panel-head').addClass('tab').find('.panel-hd-tab.hidden').removeClass('hidden');

        onlineUserIframe.src = OnlineUserSettings.url;

        $msgEMsg.on('click', '.panel-hd-tab', function () {
            var $this = $(this),
                ref = $this.data('ref'),
                hasShow = $this.data('hasShow'),
                $content = $msgEMsgRecent;

            if (!$this.hasClass('active')) {
                $this.addClass('active').siblings().removeClass('active');

                if (ref) {
                    $content = $('#' + ref, $msgEMsgContent);

                    if (!hasShow) {
                        setTimeout(function () {
                            OnlineUserSettings.onRefreshData(function (count) {
                                $onlineUserNum.html(count);
                            });
                            $this.data('hasShow', true);
                        }, 500);
                    }
                }

                $content.removeClass('hidden').siblings().addClass('hidden');
            }
        });
    }

    $emsgIcon.on('click', function () {
        if ($emsgIcon.hasClass('active')) {
            hidePanel();
        } else {
            emsgList.getData();
            if (win.OnlineUserSettings && win.OnlineUserSettings.show) {
                OnlineUserSettings.onRefreshData(function (count) {
                    $onlineUserNum.html(count);
                });
            }
            showPanel();
        }
    });

    // 点击隐藏
    $msgEMsg.on('click', '.msg-panel-hide', function () {
        hidePanel();
    });

    $('body').on('click', function (e) {
        var $target = $(e.target);

        if (!$target.closest('.q-btn.emsg, #msgEMsg').length) {
            hidePanel();
        }
    });

    function hidePanel() {
        $msgEMsg.stop(true).animate({
            right: -350
        }, function () {
            $msgEMsg.addClass('hidden');
        });

        $emsgIcon.removeClass('active');
    }

    function showPanel() {
        $msgEMsg.removeClass('hidden');
        $msgEMsg.stop(true).animate({
            right: 60
        });

        $emsgIcon.addClass('active');
    }
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
                getPagesUrl: ImacDataActionUrl.getPagesUrl,
                savePageUrl: ImacDataActionUrl.savePageUrl,
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

// 搜索面板
(function (win, $) {
    // right
    var $right = $('#imac-right-bar'), // 搜索面板
        $searchBox = $('#search-board'), // 输入框
        $searchInput = $('.a-search-input', $searchBox), // $closeBtn =
															// $('.close-btn',
															// $searchBox),
        // 所有应用容器
        $allAppsBox = $('#all-apps', $searchBox), // 无结果
        $noResult = $('.no-result', $allAppsBox), // 搜索关键字
        $searchKey = $('#search-key', $noResult), // 第一个tab按钮
        $allAppsTab = $('.tab-item', $searchBox).eq(0), // 历史记录容器
        $historyAppsBox = $('#search-history', $searchBox);

    // 初始化TabView
    var initTabView = function () {
        new TabView({
            dom: '#panel-tab-view',
            activeCls: 'active'
        });

        Util.doNiceScroll($searchBox.find('.tabview-bd'), {
            cursorwidth: '4px',
            cursorcolor: '#bebdbd',
            cursorborder: '1px solid #bebdbd'
        });
    };
    // 渲染所有应用
    var renderAllApps = function () {
        var data = AppMgr._data,
            appId, html = [];
        for (appId in data) {
            if (data.hasOwnProperty(appId)) {
                html.push(renderApp(appId));
            }
        }
        $(html.join('')).appendTo($allAppsBox);
    };
    // 渲染搜索历史
    var renderHistoryApps = function () {
        var ids = Util.localMemory.SearchHistory.get(),
            html = [];
        $.each(ids, function (i, id) {
            html.push(renderApp(id));
        });
        $(html.join('')).appendTo($historyAppsBox);
    };

    // 渲染单个应用
    var renderApp = function (appId) {
        var data = AppMgr.getAppData(appId);
        if (!data)
            return '';
        return Mustache.render(SEARCH_APPS_TPL, data);
    };

    // 搜索面板
    win.SearchPanel = {
        isInit: false,
        init: function () {
            renderHistoryApps();
            renderAllApps();
            initTabView();
            Util.doPlaceHolder($searchInput);
            this.isInit = true;
            // Util.doPlaceHolder($('[placeholder]'));
        },
        _show: function () {
            $searchBox.removeClass('hidden');

            // 清空输入框值 并重置搜索
            $searchInput[0].value = '';
            search();

            // 最小化所有应用
            TabsNav.minAllTabs();
            // 隐藏我的看板
            ImacBoard.hide();
        },
        show: function () {
            if (!this.isInit) {
                this.init();
            }
            this._show();
            this.show = this._show;
        },

        hide: function () {
            $searchBox.addClass('hidden');
        },
        // 渲染搜索到的目标app
        addAimedApp: function (appId) {
            // 已经存在则不用再次渲染
            if (Util.localMemory.SearchHistory.add(appId)) {
                $(renderApp(appId)).prependTo($historyAppsBox);
            } else {
                // 调整至首位
                $historyAppsBox.find('[data-id="' + appId + '"]').prependTo($historyAppsBox);
            }
        },
        removeApp: function (appId) {
            $allAppsBox.add($historyAppsBox).find('#' + appId + '-search').remove();
        }
    };

    // 点击关闭和显示
    $searchBox.on('click', '.close-btn', function () {
        SearchPanel.hide();
    });
    $right.on('click', '.right-search-btn', function () {
        SearchPanel.show();
    });

    // 事件绑定
    $searchBox.on('click', '.app-item', function () {
        var id = $(this).data('id');
        // TabsNav.addOrActiveTab(id);
        AppMgr.openApp(id);
        // 隐藏
        SearchPanel.hide();
        // 记录搜索并渲染
        SearchPanel.addAimedApp(id);
    });

    // 重置高亮和空提示
    var reset = function () {
        $allAppsBox.find('.app-name').each(function (i, appName) {
            appName.innerHTML = appName.innerText;
        });

        $noResult.addClass('hidden');
    };

    // 搜索
    var search = function () {
        // 需要切换到所有应用的搜索面板
        if (!$allAppsTab.hasClass('active')) {
            $allAppsTab.trigger('click');
        }
        // 关键字
        var key = $.trim($searchInput[0].value), // 操作的应用
            $app, $appName, // 是否有搜索结果
            hasResult = false;

        // 重置高亮 空提示
        reset();

        if (!key) {
            $allAppsBox.find('.app-item').removeClass('hidden');
            return;
        } else {
            $allAppsBox.find('.app-item').addClass('hidden');
            // 过滤
            var appId, data = AppMgr._data;
            for (appId in data) {
                if (data.hasOwnProperty(appId)) {
                    if (data[appId].name.indexOf(key) !== -1) {
                        $app = $allAppsBox.find('#' + appId + '-search');
                        // 高亮
                        $appName = $app.find('.app-name');
                        $appName.html($appName.html().replace(key, '<b>' + key + '</b>'));
                        $app.removeClass('hidden');

                        hasResult = true;
                    }
                }
            }
        }

        // 无结果提示
        if (!hasResult) {
            $searchKey.text(key);
            $noResult.removeClass('hidden');
        }
    };
    var searchTimer;
    if (Util.browsers.isIE8 || Util.browsers.isIE9) {
        // 8 9 不支持input事件
        $searchInput.on('onkeypress', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(search, 200);
        });
    } else {
        $searchInput.on('input', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(search, 200);
        });
    }

    $searchInput.on('onkeypress', function (e) {
        if (e.which === 13) {
            search();
        }
    });
})(this, jQuery);

// TabView
(function (win, $) {
    var defaultSettings = {
        // 默认选中的tab项，从0计数
        activeIndex: 0,
        // 容器dom对象
        dom: null,
        // 触发tab切换的事件：click|mouseover
        triggerEvent: 'click',
        // 高亮时的样式名
        activeCls: '',
        // mouseover触发切换的延时时间
        overDelay: 300
    };

    win.TabView = function (opts) {
        this.cfg = $.extend({}, defaultSettings, opts);

        this._initView();
        this._initEvent();
    };

    $.extend(TabView.prototype, {
        _initView: function () {
            var c = this.cfg;

            var $widget = $(c.dom),
                $widgetHd = $widget.find('> [data-role="head"]'),
                $widgetBd = $widget.find('> [data-role="body"]'),
                $tabs = $widgetHd.find('[data-role="tab"]'),
                $tabCons = $widgetBd.find('> [data-role="tab-content"]');

            $.extend(this, {
                $widgetHd: $widgetHd,
                $tabs: $tabs,
                $tabCons: $tabCons
            });

            this.activeTabByIndex(c.activeIndex);
        },

        _initEvent: function () {
            var c = this.cfg,
                triggerEvent = c.triggerEvent,
                $widgetHd = this.$widgetHd,
                self = this;

            // 用于mouseover触发时的延时
            var overTimer = 0;

            if (triggerEvent == 'click') {
                $widgetHd.on('click', '[data-role="tab"]', function (event) {
                    event.preventDefault();

                    $.proxy(self._activeTab, self, $(this))();
                });
            } else if (triggerEvent == 'mouseover') {
                $widgetHd.on('mouseover', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);

                    overTimer = setTimeout($.proxy(self._activeTab, self, $(this)), c.overDelay);
                }).on('mouseout', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);
                });
            }
        },

        _activeTab: function ($tab) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs;

            var targetId = $tab.data('target');

            $tabs.removeClass(activeCls);
            $tab.addClass(activeCls);

            this._activeTabContent(targetId);
        },

        // 通过index激活对应tab
        activeTabByIndex: function (index) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs,
                $activeTab = null,
                targetId = '';

            // 若index合法
            if (index >= 0 && index < $tabs.length) {
                $activeTab = $tabs.removeClass(activeCls).eq(index).addClass(activeCls);

                targetId = $activeTab.data('target');

                this._activeTabContent(targetId);
            }
        },

        _activeTabContent: function (targetId) {
            var $tabCons = this.$tabCons;

            $tabCons.addClass('hidden').filter('[data-id="' + targetId + '"]').removeClass('hidden');
        }
    });
})(this, jQuery);

// 对低级浏览器增加placeholder支持
(function (win, $) {
    Util.doPlaceHolder($('[placeholder]'));
})(this, jQuery);

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
        var appIds = JSON.stringify(ids);
        return Util.ajax({
            url: ImacDataActionUrl.updateAppMsgCountUrl,
            data: {
                appIds: appIds
            }
        }).done(function (data) {
            if (!data)
                return;

            $.each(data, function (id, count) {
                count = parseInt(count, 10) || 0;

                var app = AppMgr.getAppData(id);

                AppMgr.cacheAppData(id, $.extend(app, {
                    count: count
                }));

                if (app.folderId) {
                    FolderMgr.adjustFolderApps(app.folderId, app.id);
                } else {

                    var $appCount = appElCache[id] ? appElCache[id] : (appElCache[id] = $container.find('[data-id="' + id + '"]').find('.unread'));

                    if (count) {
                        count = Util.parseNum(count);
                        $appCount.text(count).removeClass('hidden');
                    } else {
                        $appCount.addClass('hidden');
                    }
                }

            });

            ImacScreen.updateFolderNum();
        });
    };

    function startUpdateAppMsgCount() {
        getAppMsgCount().always(function () {
            setTimeout(startUpdateAppMsgCount, 30 * 1000);
        });
    }

    ImacEvent.on('afterAllAppsLoad', startUpdateAppMsgCount);
})(this, jQuery);

// logout
(function (win, $) {
    $('body').on('click', '.q-btn.logout', function () {
        win.logout && logout();
    });
})(this, jQuery);

// 全文检索入口
(function (win, $) {
    var $headerSearch = $('#header-search-container');

    function doSearch(type, kw) {
        type = type || 'all';
        // try {
        // TabsNav.removeTab('fullsearch');
        // } catch (error) {}
        // win.open(win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type='
		// + type, 'fullsearch');
        TabsNav.addTab({
            id: 'fullsearch',
            name: '全文检索',
            url: win._fullSearchUrl_ + '?wd=' + win.encodeURI(kw) + '&type=' + type
        });
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
            id: 'header-search-container',
            // 绑定的容器id
            searchTarget: '内容',
            // 搜索目标
            category: cates,
            placeholder: '请输入',
            // 输入框placeholder内容
            maxShowCharacter: 3,
            // 下拉区域显示的最大关键字字符数
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
                $this.data('url') && dealLinkOpen({
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
                if ($.inArray(ev.which, ignoreCodes) != -1)
                    return;
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
                data.users && $.each(data.users, function (i, item) {
                    item.portrait = Util.getRightUrl(item.portrait);
                    item.hlname = item.name.replace(hlReg, '<span class="fulltext-search-kw">' + value + '</span>');
                    userHTML.push(Mustache.render(USER_ITEM_TPL, item));
                });
                data.apps && $.each(data.apps, function (i, item) {
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
    ImacEvent.on('afterPageInfo', function () {
        if (win._fullSearchUrl_) {
            getCateData();
        }
    });
})(this, jQuery);

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
                !finded && $.each(cate.items, function (j, item) {
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
        var $cover = $('');

        // 顶部点击切换
        $portalBtn.on('click', function () {
            togglePortal(!$portal.hasClass('active'));
        });
        $portalWrap.on('click', '.portal-header', function () {
                // 点击打开默认的
                TabsNav.addTab(defaultHome);
            }) // 点击打开门户
            .on('click', '.portal-item', function () {
                var $this = $(this),
                    openType = $this.data('opentype'),
                    url = Util.getRightUrl($this.data('url'));

                // dealLinkOpen({
                // url: this.getAttribute('data-url'),
                // name: this.title,
                // openType: this.getAttribute('data-opentype'),
                // id: this.getAttribute('data-id'),
                // });
                openType == 'blank' ? win.open(url) : ImacBoard.show($(this).data('id'));
                togglePortal(false);
            }) // 分类点击切换
            .on('click', '.portal-cate', function () {
                var $block = $(this).parent();
                $block.toggleClass('collapse');
            });

        // 点击隐藏
        $boardPanel.on('click', '.board-close', function () {
            ImacBoard.hide();
        });

        function togglePortal(show) {
            if (show) {
                $portal.addClass('active');
                $cover.removeClass('hidden');
                TabsNav.minAllTabs();
                ImacBoard.hide();
                return;
            }

            $portal.removeClass('active');
            $cover.addClass('hidden');
        }
        // 空白点击隐藏
        $('body').on('click', function (ev) {
            if (!$(ev.target).closest($portal).length) {
                togglePortal(false);
            }
        });

        // 门户面板高度处理
        var timer, $portalPanel = $portal.find('.portal');
        $(win).on('resize', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var h = $(win).height() - 140;
                h > 0 && $portalPanel.css('max-height', h);
            }, 17);
        }).trigger('resize');
    }

    function initView(singleHomes, homes) {
        var html = [];
        // 无分类的
        if (singleHomes) {
            html.push('<ul class="portal-list">');
            $.each(singleHomes, function (i, item) {
                item.icon = item.icon || 'default-modicon';
                item.url = Util.getRightUrl(item.url);
                html.push(Mustache.render(PORTAL_ITEM_TPL, item));
                ImacBoard.data[item.code] = item;
            });
            html.push('</ul>');
        }

        // 带分类的
        $.each(homes, function (i, cate) {
            // 根据条数计算下最大高度，用于优化动画效果
            html.push('<div class="portal-block"><h3 class="portal-cate">' + cate.name + '<span class="portal-cate-trigger"></span></h3><ul class="portal-list" style="max-height:' + 30 * cate.items.length + 'px">');
            $.each(cate.items, function (j, item) {
                item.icon = item.icon || 'default-modicon';
                item.url = Util.getRightUrl(item.url);
                html.push(Mustache.render(PORTAL_ITEM_TPL, item));
                ImacBoard.data[item.code] = item;
            });
            html.push('</ul></div>');
        });

        $(html.join('')).appendTo($portalContent);
    }
    // 显示看板
    win.ImacBoard = {
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
            $target.removeClass('hidden').siblings('.board-content').addClass('hidden');
        },
        hide: function () {
            $boardPanel.addClass('hidden');
        }
    };
    // 渲染看板内容
    var renderBoardIframe = function (id) {
        return $(Mustache.render(BOARD_CONTENT_TPL, ImacBoard.data[id])).appendTo($boardPanel);
    };
    ImacEvent.on('afterPageInfo', function (ev) {
        initPortal(ev.data.homes, ev.data.defaultHome);
    });
})(this, jQuery);

// 消息中心集成
(function (win, $) {
    var msgCenterUrl = 'frame/fui/js/widgets/msgcenter/msgcenter.js';

    function initMsgCenter(data) {
        var msgcenterConfig = $.extend({}, MsgCenterConfig, {
            isMsgCenterMaxSize: data.isMsgCenterMaxSize || false,
            msgCenterOrder: data.msgCenterOrder || 'asc',
            hideCallback: function () { // $cover.addClass('hidden');
            }
        });

        var msgCenter = null;

        var $msgRemindBtn = $('.q-btn.message');

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

    ImacEvent.on('afterUserInfo', function (ev) {
        var data = ev.data;

        initMsgCenter(data);
    });
})(this, jQuery);

// 常用应用
(function (win, $) {
    var $quickApps = $('#imac-right-bar .quick-apps'),
        $list = $('.list-wrap', $quickApps),
        $cfgBtn = $('.quick-cfg-btn', $quickApps);

    var dockAppTempl = $.trim(DOCK_APP_TPL);

    // 上方元素高度
    var PREV_HEIGHT = 0, // 下方元素高度
        NEXT_HEIGHT = 0, // topbar高度
        TOP_BAR_HEIGHT = 50, // 配置按钮高度
        CFG_BTN_HEIGHT = 50,
        wrap_h = 0;
    // 应用列表初始化滚动条
    Util.doNiceScroll($list, {
        cursorwidth: '2px',
        cursorcolor: '#3b4252',
        cursorborder: '1px solid #aaa',
        horizrailenabled: false
    });

    // 调整应用wrap的高度
    var adjustListHeight = function () {
        PREV_HEIGHT = $quickApps.position().top;
        NEXT_HEIGHT = $quickApps.next().outerHeight();

        var bd_h = $('body').height();
        wrap_h = bd_h - (TOP_BAR_HEIGHT + PREV_HEIGHT + NEXT_HEIGHT);

        $quickApps.css('height', wrap_h);
        $list.css('max-height', wrap_h - CFG_BTN_HEIGHT);
    };

    // resize 时更新
    $(win).on('resize', Util.debounce(adjustListHeight, 50));

    win.QuickApps = {
        isInit: false,
        init: function () {
            if (QuickApps.isInit)
                return;

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
        removeApp: function (id) {
            var $app = $list.find('[data-id="' + id + '"]');
            if ($app.length) {
                $app.remove();
            }
        },
        getData: function () {
            return Util.ajax({
                url: ImacDataActionUrl.getQuickAppsUrl
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

                if (!item.id) {
                    item.id = item.code;
                }
                // 缓存数据
                if (!AppMgr.getAppData(item.id)) {
                    AppMgr.cacheAppData(item.id, item);
                }
                html.push(Mustache.render(dockAppTempl, item));
            });
            $(html.join('')).appendTo($list.empty());
            $cfgBtn.removeClass('hidden');
            return this;
        },
        _initEvent: function () {
            // 点击打开应用
            !this.isInit && $quickApps.on('click', '.dock-app', function () {
                var id = $(this).data('id');
                AppMgr.openApp(id);
            });
            return this;
        }
    };

    ImacEvent.on('afterAllAppsLoad', QuickApps.init);

    var cfgUrl = ImacDataActionUrl.commonAppCfgUrl;
    var themeId = (function () {
        var themeMatch = location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
            themeId = themeMatch && themeMatch[1];
        return themeId;
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
                getDataUrl: ImacDataActionUrl.appCenterDataUrl,
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

                        AppMgr.installApp(data.id, function () {
                            appCenter._afterInstallApp(data.id);
                        });
                    },
                    uninstallApp: function (ev) {
                        var data = ev.data,
                            self = this;
                        // alert('卸载应用- ' + data.id);
                        AppMgr.uninstallApp(data.id, function () {
                            self._afterUninstallApp(data.id);
                        });
                    }
                }
            });
            appCenter.show();
        });
    };

    var $appStoreBtn = $('#imac-right-bar .q-btn.appstore');
    $appStoreBtn.on('click', appCenterHandler);

}(this, jQuery));
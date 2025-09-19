/* jshint -W030 */
// 分屏页码模板
var SCREEN_PAGE_TPL = '<a href="javascript:void(0);" data-page="{{page}}" class="page-item l mr10"><span>{{pageNum}}</span></a>',
    // 分屏模板
    SCREEN_TPL = '<div class="imac-screen l" title="第{{page}}分屏"></div>',
    // 桌面应用模板
    SCREEN_APP_TPL = '<div class="app-item trans" title="{{name}}" style="top:{{top}}px;left:{{left}}px"data-id="{{id}}">{{#count}}<span class="unread">{{count}}</span>{{/count}}<img src="{{icon}}" alt="" class="app-icon"><p class="app-name">{{name}}</p></div>',
    // 底部任务栏：任务模板
    TASK_ITEM_TPL = '<a href="javascript:void(0);" data-id="{{id}}" class="task-item l clearfix" title="{{name}}"><img src="{{icon}}" alt="" class="l task-icon"><p class="task-name l">{{name}}</p></a>',
    // 工具栏：快捷应用模板
    DOCK_APP_TPL = '<div class="dock-app" data-id="{{id}}" title="{{name}}">{{#count}}<span class="unread">{{count}}</span>{{/count}}<img src="{{icon}}" alt="" ><p class="name">{{{sname}}}</p></div>',
    // IMac元件模板
    IMAC_ELEM_TPL = '<div class="epdialog imac-elem {{#noBorder}}no-border{{/noBorder}} hidden-accessible" data-id="{{id}}"><div class="epdialog-hd clearfix"><h4 class="epdialog-title l">{{name}}</h4><div class="epdialog-hd-btns clearfix r">{{#btns}}<a href="javascript:void(0);" btn-role="{{role}}" class="epdialog-hd-btn {{role}} l" title="{{title}}"></a>{{/btns}}</div></div><div class="epdialog-bd"><iframe src="{{url}}" frameborder="0" scrolling="no" width="100%" height="100%"></iframe></div></div>';


// imac所需工具方法
(function (win, $) {
    var $skinBg = $('#imac-skin-bg');

    // 图标后缀
    var TASK_BAR_SUFFIX = '-taskbar',
        TOOL_BAR_SUFFIX = '-toolbar';

    $.extend(Util, {
        // 变换imac背景
        setIMacSkinBg: function (src) {
            $skinBg[0].src = src;
        },

        getAppShortName: function (name) {
            var temp = name.substr(0, 2),
                sname = temp[0] + '&nbsp;' + temp[1];

            return sname;
        },

        // 桌面应用：修复页面、图标路径
        fixPath: function (data) {
            var copy = $.extend({}, data);

            copy.url = Util.getRightUrl(data.url);
            copy.icon = Util.getRightUrl(data.icon);

            return copy;
        },


        // 切换icon类型（桌面、任务栏、工具栏）
        switchIcon: function (data, place) {
            var icon = data.icon;

            var dot = icon.lastIndexOf('.'),
                ext = icon.substr(dot),
                pre = icon.substring(0, dot);

            var rt = '';

            // 底部任务栏
            if (place == "taskbar") {
                rt = data.hasTaskbarIcon ? (pre + TASK_BAR_SUFFIX + ext) : data.icon;

                // 侧边工具栏
            } else if (place == "toolbar") {
                rt = data.hasToolbarIcon ? (pre + TOOL_BAR_SUFFIX + ext) : data.icon;
            }

            return rt;
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
            data.uninstallable !== false ?
                cm.enableItem('uninstall-app') :
                cm.disableItem('uninstall-app');

            // 是否可移动
            // TODO:
            // 如果应用不可移动，除了通过ContextMenu无法操作外，
            // 还应该无法进行鼠标的拖动，后者暂未处理
            data.movable !== false ?
                cm.enableItem('move-app') :
                cm.disableItem('move-app');

            // 是否可打开
            data.openable !== false ?
                cm.enableItem('open-app') :
                cm.disableItem('open-app');


            // var openItem = mini.getbyName('open-app', cm),
            //     moveItem = mini.getbyName("move-app", cm),
            //     uninstallItem = mini.getbyName("uninstall-app", cm);
            // // 是否可卸载
            // data.uninstallable !== false ?
            //     uninstallItem.enable() :
            //     uninstallItem.disable();

            // // 是否可移动
            // // TODO:
            // // 如果应用不可移动，除了通过ContextMenu无法操作外，
            // // 还应该无法进行鼠标的拖动，后者暂未处理
            // data.movable !== false ?
            //     moveItem.enable() :
            //     moveItem.disable();

            // // 是否可打开
            // data.openable !== false ?
            //     openItem.enable() :
            //     openItem.disable();
        }
    });

    EpDialog.setMaxCoord({
        top: 50,
        left: 0,
        right: 50,
        bottom: 50
    });

}(this, jQuery));

// IMac元件
(function (win, $) {
    // 针对元件修复路径问题
    var fixElemPath = function (data) {
        var app = data.linkedApp;

        data.url = Util.getRightUrl(data.url);

        if (data.cfgUrl) {
            data.cfgUrl = Util.getRightUrl(data.cfgUrl);
        }

        if (app) {
            app.icon = Util.getRootPath() + app.icon;
            app.url = Util.getRightUrl(app.url);
        }
    };

    // 全屏元件位置、大小计算所需常量
    var LEFT_MARGIN = 25,
        RIGHT_MARGIN = 75,

        TOP_MARGIN = 75,
        BOTTOM_MARGIN = 75;

    var M = Mustache;

    var defaultSetting = {
        id: '',
        name: '',
        width: 800,
        height: 500,
        minWidth: 200,
        minHeight: 200,
        top: 65,
        left: 25,
        url: '',
        // 分屏页码
        page: 0,
        // 按钮类型: refresh|maxwin|config|restore|close
        btns: [],
        // 关联应用
        linkedApp: false,
        // 是否有边框
        noBorder: true,
        // 是否可卸载
        closable: true,
        draggable: true,
        resizable: true
    };

    var defaultFns = {
        refresh: function () {
            this.refresh();
        }
    };

    // 基于EpDialog模板
    var templ = $.trim(IMAC_ELEM_TPL);

    var BORDER_WIDTH = 3;

    win.IMacElem = function (cfg) {
        this.cfg = $.extend(true, {}, defaultSetting, cfg);
        this._init();
    };

    IMacElem.prototype = {
        constructor: IMacElem,

        _init: function () {
            this._initConfig();

            this._initView();
            this._initEvent();
        },

        _initConfig: function () {
            var c = this.cfg;

            c.options = {};

            // 默认刷新按钮
            c.btns.push({
                role: 'refresh',
                title: '刷新'
            });

            // 有配置页，显示配置按钮
            if (c.cfgUrl) {
                c.btns.push({
                    role: 'config',
                    title: '打开配置',
                    click: function () {
                        // 配置dialog
                        new EpDialog({
                            title: '详细配置',
                            width: 600,
                            height: 500,
                            draggable: true,
                            resizable: true,
                            url: c.cfgUrl,
                            btns: [{
                                role: 'close',
                                title: '关闭',
                                click: function (opt) {
                                    ElemMgr.getElem(opt.id).refresh();

                                    this.hide().destroy();
                                    return false;
                                }
                            }]
                        }).setOptions('id', c.id).show(1, 1);
                    }
                });
            }

            // 可卸载，配置关闭按钮
            if (c.closable) {
                c.btns.push({
                    role: 'close',
                    title: '卸载元件',
                    click: function () {
                        mini.confirm('您确定卸载元件【' + c.name + '】吗？卸载后，可从应用仓库中再次添加到桌面。', '系统提示', function (action) {
                            if (action == 'ok') {
                                ElemMgr.getElem(c.id).uninstall();
                            }
                        });
                        // uninstallElemTip
                        //  .setMessage('您确定卸载元件【' + c.name + '】吗？卸载后，可从应用仓库中再次添加到桌面。')
                        //  .setOptions('id', c.id)
                        //  .show(true);
                    }
                });
            }

            // width、height为0，表示全屏元件
            if (!c.width || !c.height) {
                c.isFullView = true;

                // 全屏元件禁掉drag、resize
                c.draggable = false;
                c.resizable = false;
            }
        },

        // top, left, width, height
        _getFullViewInfo: function () {
            // client view size
            var cs = Util.getWinSize();

            return {
                top: TOP_MARGIN,
                left: LEFT_MARGIN,
                width: cs.width - LEFT_MARGIN - RIGHT_MARGIN,
                height: cs.height - TOP_MARGIN - BOTTOM_MARGIN
            };
        },

        _initView: function () {
            var c = this.cfg,
                // 所在分屏
                $screen = ImacScreen.getScreen(c.page),

                $widget = $(M.render(templ, c)).appendTo($screen);

            $.extend(this, {
                $widget: $widget,
                $iframe: $('iframe', $widget),
                $title: $('.epdialog-title', $widget),
                $hd: $('.epdialog-hd', $widget)
            });

            c.hd_h = this.$hd.height();

            // 有边框，边框颜色为hd背景色
            if (!c.noBorder) {
                $widget.css('border-color', this.$hd.css('background-color'));
            }

            // 有关联应用，用title属性提示
            if (c.linkedApp) {
                this.$title.attr('title', '打开关联应用【' + c.linkedApp.name + '】')
                    .addClass('title-link');
            }
        },

        _initEvent: function () {
            var c = this.cfg,
                self = this;

            var btns_callback = {},
                $widget = this.$widget;

            $.each(c.btns, function (i, btn) {
                btns_callback[btn.role] = btn.click;
            });

            // 如果有关联应用
            if (c.linkedApp) {
                $widget.on('click', '.epdialog-title', function (event) {
                    var appId = c.linkedApp.id,
                        app = AppMgr.getAppData(appId);

                    // 若未安装，则先存储数据再代开
                    if (!app) {
                        AppMgr.cacheAppData(appId, c.linkedApp);
                    }

                    AppMgr.openApp(appId);
                });
            }

            // make it draggable
            if (c.draggable) {
                $widget.draggable({
                    handle: '.epdialog-hd',
                    containment: 'body',
                    start: function () {
                        // 拖拽的元件处于顶层
                        self.$widget.css('z-index', Util.getZIndex());
                    },
                    stop: function (event, ui) {
                        // 提交位置
                        self._sendElemUpdate({
                            id: c.id,
                            left: ui.position.left,
                            top: ui.position.top
                        }, 'update-elem-pos');
                    }
                });
            }

            // make it resizable
            if (c.resizable) {
                $widget.resizable({
                    containment: 'body',
                    minWidth: c.minWidth,
                    minHeight: c.minHeight,
                    resize: function (event, ui) {
                        var size = ui.size;

                        self.setSize(size);
                    },
                    stop: function (event, ui) {
                        // 提交尺寸
                        self._sendElemUpdate({
                            id: c.id,
                            width: ui.size.width,
                            height: ui.size.height
                        }, 'update-elem-size');
                    }
                });
            }

            // 全屏元件window resize时进行尺寸调整
            if (c.isFullView) {
                $(win).on('resize', function () {
                    var info = self._getFullViewInfo();

                    self.setSize(info);
                });
            }

            $widget.on('click', '[btn-role]', function () {
                var role = this.getAttribute('btn-role'),
                    rt;

                if (btns_callback[role]) {
                    rt = $.proxy(btns_callback[role], self, c.options, this)();
                }

                if (defaultFns[role] && rt !== false) {
                    $.proxy(defaultFns[role], self, this)();
                }
            });

            // 解决IE8下头部hover失效
            if (Util.browsers.isIE8) {
                this.__fixIE8HeadHover();
            }
        },

        // IE8 div的background-color若为transparent，会有hover失效的问题，
        // 包括css的:hover伪类，js的mouseenter/mouseleave事件
        // 除非该div中有文字，鼠标hover到文字上
        __fixIE8HeadHover: function () {
            var c = this.cfg,
                $hd = this.$hd,
                $p,
                i,
                txt = '';

            $hd.css('position', 'relative');

            $p = $('<p></p>').appendTo($hd)
                .css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    lineHeight: '32px',
                    fontSize: 18,
                    cursor: 'move',
                    color: 'transparent',
                    width: '9999em',
                    height: $hd.height()
                });

            for (i = 0; i < 50; i++) {
                txt += '______________';
            }
            $p.html(txt);
        },

        // 发送更新信息
        _sendElemUpdate: function (data, query) {
            var params = $.extend(data, {
                query: query
            });

            Util.ajax({
                url: win.updateElemUrl,
                data: params,
                success: Util.noop,
                error: Util._ajaxErr
            });
        },

        // 卸载元件
        uninstall: function () {
            var c = this.cfg,
                self = this;

            Util.ajax({
                url: win.updateElemUrl,
                data: {
                    id: c.id,
                    query: 'uninstall-elem'
                },
                success: function () {
                    self.$widget.fadeOut(300, function () {
                        self.destroy();

                        ElemMgr.delElem(c.id);
                    });
                },
                error: Util._ajaxErr
            });
        },

        // 设置框体尺寸
        setSize: function (size) {
            var c = this.cfg;

            this.$widget.css({
                width: size.width,
                height: size.height
            });

            return this;
        },

        show: function () {
            var $widget = this.$widget;

            if (!this.isHidden()) return;

            var c = this.cfg,
                zIndex = Util.getZIndex(),

                info = {};

            if (c.isFullView) {
                info = this._getFullViewInfo();

                $.extend(c, info);
            }

            $widget.css({
                zIndex: zIndex,
                position: 'absolute',
                top: c.top,
                left: c.left,
                height: 0,
                width: 0
            }).removeClass('hidden-accessible');

            $widget.animate({
                height: c.height,
                width: c.width
            }, 600);

            return this;
        },

        isHidden: function () {
            return this.$widget.hasClass('hidden-accessible');
        },

        hide: function () {
            this.$widget.addClass('hidden-accessible');
            return this;
        },

        refresh: function () {
            this.$iframe[0].contentWindow.location.reload();
            return this;
        },

        setOptions: function (prop, value) {
            this.cfg.options[prop] = value;
            return this;
        },

        setUrl: function (url) {
            url += (url.indexOf('?') != -1 ? '&' : '?') + 'refresh_timestamp=' + Util.uuid(8, 16);

            this.$iframe[0].src = url;
            return this;
        },

        setTitle: function (title) {
            this.$title[0].innerHTML = title;
            return this;
        },

        destroy: function () {
            var c = this.cfg,

                $widget = this.$widget,
                $iframe = this.$iframe;

            c.draggable && $widget.draggable('destroy');
            c.resizable && $widget.resizable('destroy');

            $widget.off('click');
            $iframe.attr('src', '').remove();

            $widget.remove();

            this.$widget = null;
            this.$iframe = null;
            this.$title = null;
            this.$hd = null;
            this.cfg = null;
        }
    };

    //    // 卸载元件提示
    //    var uninstallElemTip = new TipDialog({
    //  type: 'confirm',
    //        btns: [{
    //            text: '确定',
    //            role: 'yes'
    //        }, {
    //            text: '取消',
    //            role: 'no'
    //        }],
    //        callback: function(role, opt) {
    //            if(role == 'yes') {
    //                ElemMgr.getElem(opt.id).uninstall();
    //            }
    //        }
    //    });

    // // 安装元件提示
    // var installElemTip = new TipDialog({
    //  type: 'success',
    //  btns: [{
    //      text: '确定',
    //      role: 'confirm'
    //  }]
    // });

    // 绘制元件
    var renderElems = function (data) {
        $.each(data, function (i, item) {
            fixElemPath(item);

            ElemMgr.cacheElem(item.id, new IMacElem(item).show());
        });
    };

    // 元件管理对象
    var elemCache = {};

    win.ElemMgr = {
        cacheElem: function (id, elem) {
            elemCache[id] = elem;
        },

        getElem: function (id) {
            var elem = elemCache[id];

            return elem ? elem : false;
        },

        delElem: function (id) {
            elemCache[id] = null;
        },

        // 安装元件
        installElem: function (id) {
            var activePage = ImacScreen.getActivePage();

            Util.ajax({
                url: win.updateElemUrl,
                data: {
                    query: 'install-elem',
                    // 安装在当前页
                    page: activePage,
                    id: id
                },
                success: function (data) {
                    if (data) {
                        fixElemPath(data);

                        data.page = activePage;

                        ElemMgr.cacheElem(data.id, new IMacElem(data).show());

                        mini.showMessageBox({
                            title: '系统提示',
                            message: '元件【' + data.name + '】安装成功！',
                            buttons: ["ok"],
                            iconCls: "mini-messagebox-info"
                        });
                        //               installElemTip
                        // .setMessage('元件【' + data.name + '】安装成功！')
                        // .show(true);
                    }
                },
                error: Util._ajaxErr
            });
        },

        // 获取元件信息
        getIMacElems: function () {
            Util.ajax({
                url: win.elementsUrl,
                data: {
                    query: 'imac-elements'
                },
                success: function (data) {
                    if (data && data.length) {
                        renderElems(data);
                    }
                },
                error: Util._ajaxErr
            });
        }
    };

}(this, jQuery));

// 调整侧边栏高度
(function (win, $) {
    var $rightBar = $('#imac-right-bar'),
        TOP_BAR_HEIGHT = 50;

    var adjustHeight = function () {
        var height = $('body').height() - TOP_BAR_HEIGHT;

        $rightBar.css('height', height);
    };

    $(win).on('resize', adjustHeight);

    adjustHeight();
}(this, jQuery));

// 分屏交互
(function (win, $) {
    var $pagesCon = $('#imac-screen-pages'),
        $pagesWrap = $('.pages-wrap', $pagesCon),
        $pageList = $('.page-list', $pagesCon),

        $pageNavL = $('.scroll-l', $pagesCon),
        $pageNavR = $('.scroll-r', $pagesCon);

    var $screensCon = $('#imac-screens-container'),
        $screenList = $('.screen-list');

    var M = Mustache,
        // 页码模板
        pageTempl = $.trim(SCREEN_PAGE_TPL),
        // 分屏模板
        screenTempl = $.trim(SCREEN_TPL),
        // 应用模板
        appTempl = $.trim(SCREEN_APP_TPL);

    // 页码显示长度
    var PAGES_SHOWN_WIDTH = 210,
        // 页码总长度
        PAGES_TOTAL_WIDTH = 0,
        // 页码宽度
        PAGE_WIDTH = 34,
        // 页码间隔
        PAGE_GAP = 10,
        // 可视页码数
        VISIBLE_PAGE_NUM = 5;

    // 总页码数，默认5页
    win.PAGE_NUM = 5;

    var activePage = DEFAULT_ACTIVE_PAGE - 1;

    // 每列应用数
    var appNumPerCol = APP_COUNT_PER_COLUMN;

    var APP_INIT_TOP = 65,
        APP_INIT_LEFT = 25,
        APP_GAP = 40,
        APP_WIDTH = 105,
        APP_HEIGHT = 105;

    // 更新应用提醒数
    var updateUnread = function ($app, count) {
        var $unread = $app.find('.unread');

        if (count <= 0) {
            $unread.remove();
        } else {
            if (!$unread.length) {
                $unread = $('<span class="unread"></span>');
                $unread.appendTo($app);
            }

            $unread.html(count >= 99 ? 99 : count);
        }
    };

    // 屏幕应用缓存管理
    var appDataCache = {};

    win.AppMgr = {
        cacheAppData: function (id, data) {
            // TODO: debug
            // console.log('%s:', id);
            // console.dir(data);
            // console.log('==============');

            appDataCache[id] = $.extend({}, data);
        },

        deleteAppData: function (id) {
            appDataCache[id] = null;
        },

        // return a copy of app info
        getAppData: function (id) {
            var info = appDataCache[id];

            if (!info) return false;

            return $.extend({}, info);
        },

        // 移动应用：屏幕 到 工具栏
        screenToToolbar: function (id) {
            if (QuickApps.isFull()) {
                return;
            }

            ImacScreen.removeApp(id);

            QuickApps.addApp(id);

            AppMgr.sendAppUpdate(id, 'screen-to-toolbar');
        },

        // 移动应用：分屏 到 分屏，工具栏 到 分屏
        moveToScreen: function (id, page, from) {
            // 从当前分屏移除应用
            if (from == 'screen') {
                ImacScreen.removeApp(id);

                // 从工具栏移除应用
            } else if (from == 'toolbar') {
                QuickApps.removeApp(id);
            }

            ImacScreen.addApp(id, page);

            AppMgr.sendAppUpdate(id, from + '-to-screen');
        },

        // 从 分屏、工具栏 卸载应用
        uninstallApp: function (id, from) {
            // 从当前分屏移除应用
            if (from == 'screen') {
                ImacScreen.removeApp(id);

                // 从工具栏移除应用
            } else if (from == 'toolbar') {
                QuickApps.removeApp(id);
            }

            // 关闭对应任务和窗口
            TaskBar.removeTask(id);

            AppMgr.sendAppUpdate(id, 'uninstall-app');

            // 将应用数据从缓存中清除
            AppMgr.deleteAppData(id);
        },

        // 安装应用到当前分屏
        installApp: function (data) {
            // 新装应用排在最后
            var idx = ImacScreen.getScreen(activePage).find('.app-item').length;

            data.index = idx;
            data.page = activePage;

            AppMgr.cacheAppData(data.id, Util.fixPath(data));
            ImacScreen.addApp(data.id, activePage);

            mini.showMessageBox({
                title: '系统提示',
                message: '应用【' + data.name + '】安装成功！',
                buttons: ["ok"],
                iconCls: "mini-messagebox-info"
            });

            // installTip.setMessage('应用【' + data.name + '】安装成功！')
            //     .show(true);

            // 安装成功，给后台发送page，index信息
            this.sendAppUpdate(data, 'install-app');
        },

        sendAppUpdate: function (id, query) {
            var data = $.isPlainObject(id) ? id : AppMgr.getAppData(id),

                params = $.extend({}, data, {
                    query: query
                });

            Util.ajax({
                url: win.updateAppUrl,
                data: params,
                success: Util.noop,
                error: Util._ajaxErr
            });
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

        // 范围：屏幕、侧边工具栏
        getApp: function (id) {
            var $a1 = ImacScreen.getApp(id),
                $a2 = QuickApps.getApp(id),

                $rt = $a1;

            if ($a2.length) {
                $rt = $a2;
            }

            return $rt;
        },

        // 更新应用提醒数目
        updateAppReminder: function (id) {
            Util.ajax({
                url: win.updateAppUrl,
                data: {
                    query: 'update-app-reminder',
                    id: id
                },
                success: function (data) {
                    var n = data.count,
                        $app = AppMgr.getApp(id);

                    updateUnread($app, n);
                },
                error: Util._ajaxErr
            });
        }
    };

    // // 应用卸载提示
    // var uninstallTip = new TipDialog({
    //  msg: '您确定卸载该应用吗？卸载后，可从应用仓库中再次添加到桌面。',
    //        type: 'confirm',
    //        btns: [{
    //            text: '确定',
    //            role: 'yes'
    //        }, {
    //            text: '取消',
    //            role: 'no'
    //        }],
    //        callback: function(role, opt) {
    //            if(role == 'yes') {
    //                AppMgr.uninstallApp(opt.id, opt.from);
    //            }
    //        }
    //    });

    //    // 安装成功提示
    //    var installTip = new TipDialog({
    //        type: 'success',
    //        btns: [{
    //            text: '确定',
    //            role: 'confirm',
    //        }]
    //    });

    // 分屏上的一些操作集合
    win.ImacScreen = {
        getActivePage: function () {
            return activePage;
        },

        getApp: function (id) {
            return $screensCon.find('[data-id="' + id + '"]');
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
                index = $screen.find('.app-item').length;
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
            var c, r, i,
                // 底部越界
                isOut = (pos.top > APP_INIT_TOP + (appNumPerCol - 1) * (APP_GAP + APP_HEIGHT) + APP_HEIGHT / 2);

            if (isOut) {
                i = -1;
            } else {
                c = Math.round((pos.left - APP_INIT_LEFT) / (APP_GAP + APP_WIDTH));
                r = Math.round((pos.top - APP_INIT_TOP) / (APP_GAP + APP_HEIGHT));

                i = c * APP_COUNT_PER_COLUMN + r;
            }

            return i;
        },

        // 根据index调整应用位置
        adjustAppPosByIndex: function (id, index) {
            var data = AppMgr.getAppData(id),
                pos = getAppPosByIndex(index),

                $app = ImacScreen.getApp(id);

            if (Util.browsers.isIE8 || Util.browsers.isIE9) {
                $app.stop(true)
                    .animate(pos, 200);
            } else {
                $app.css(pos);
            }

            if (data.index != index) {
                data.index = index;

                AppMgr.cacheAppData(id, data);
                AppMgr.sendAppUpdate(id, 'update-app-index');
            }
        },

        // 从指定屏，指定应用Index开始 调整应用位置
        adjustAppsPosFromIndex: function (page, index, isUp) {
            var l = ImacScreen.getScreen(page).find('.app-item').length,
                i,
                $app,
                pos,
                data,
                id,
                temp;

            var appArr = [];

            for (i = index; i < l; i++) {
                appArr.push(ImacScreen.getAppByIndex(page, i));
            }

            $.each(appArr, function (n, $app) {
                id = $app.data('id');
                data = AppMgr.getAppData(id);

                temp = isUp ? (data.index - 1) : (data.index + 1);

                // new position
                pos = getAppPosByIndex(temp);
                $app.css(pos);

                data.index = temp;
                AppMgr.cacheAppData(id, data);

                // 发送应用index调整信息到后台
                AppMgr.sendAppUpdate(id, 'update-app-index');
            });
        }
    };

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
            l = data.length;

        $.each(data, function (i, item) {
            var temp = {
                page: i,
                pageNum: (i + 1)
            };

            html.push(M.render(pageTempl, temp));
        });

        // 超过5屏，显示导航
        if (l > 5) {
            $pageNavR.add($pageNavL).removeClass('invisible');

            PAGES_TOTAL_WIDTH = (PAGE_WIDTH + PAGE_GAP) * l;

            PAGE_NUM = l;
        }

        $pageList.html(html.join(''));
    };

    // 渲染分屏
    var renderScreens = function (data) {
        var html = [];

        $.each(data, function (i, item) {
            var temp = {
                page: i + 1
            };

            html.push(M.render(screenTempl, temp));
        });

        $screenList.html(html.join(''));
    };

    // 根据排序获取应用位置
    var getAppPosByIndex = function (index) {
        var col = Util.toInt(index / appNumPerCol),
            row = Util.toInt(index % appNumPerCol);

        return {
            left: APP_INIT_LEFT + (APP_WIDTH + APP_GAP) * col,
            top: APP_INIT_TOP + (APP_HEIGHT + APP_GAP) * row
        };
    };

    var renderAppsByPage = function (page, data) {
        var $screen = null,
            html = [];

        if (!data.length) return;

        $screen = $screenList.find('.imac-screen').eq(page);

        $.each(data, function (i, item) {
            var item = Util.fixPath(item),

                pos = getAppPosByIndex(i),
                view = $.extend({}, item, pos);

            item.page = page;
            item.index = i;

            // 缓存每一个app数据
            AppMgr.cacheAppData(item.id, item);

            html.push(M.render(appTempl, view));
        });

        $screen.html(html.join(''));
    };

    // 渲染应用
    var renderApps = function (data) {
        $.each(data, function (i, item) {
            renderAppsByPage(i, item);
        });
    };

    // 获取屏幕信息：分屏数 应用信息
    var getScreenInfo = function () {
        Util.ajax({
            url: win.screenAppsUrl,
            data: {
                query: 'screen-apps'
            },
            success: function (data) {
                if (data) {
                    renderPages(data);
                    renderScreens(data);
                    renderApps(data);

                    // 启动拖拽、排序
                    AppDragMgr.enableAllScreenApps();

                    // 立刻调整分屏尺寸
                    adjustScreenSize();
                    setPageActive(activePage);

                    // 晚0.5s加载元件
                    setTimeout(function () {
                        ElemMgr.getIMacElems();
                    }, 500);
                }
            },
            error: Util._ajaxErr
        });
    };

    // 激活对应页码的分屏
    var setPageActive = function (page) {
        var dis = page * $('body').width(),
            $el = $pageList.find('.page-item').eq(page);

        $el.addClass('active')
            .siblings()
            .removeClass('active');

        $screenList.stop(true)
            .animate({
                marginLeft: -dis
            }, 200);

        // contextmenu移动到当前页-失效
        appCm.enableItem('page-' + activePage)
            .disableItem('page-' + page);

        // mini.getbyName('page-' + activePage, appCm).enable();
        // mini.getbyName('page-' + page, appCm).disable();

        activePage = page;

        adjustActivePagePos(page);
    };

    // 调整激活页码的位置
    var adjustActivePagePos = function (page) {
        var n = 0,
            mid = Util.toInt(VISIBLE_PAGE_NUM / 2),
            t = PAGE_NUM - 1;

        if (page + mid <= t && page - mid >= 0) {
            n = (page - mid);

        } else if (page - mid < 0) {
            n = 0;

        } else if (page + mid > t) {
            n = PAGE_NUM - VISIBLE_PAGE_NUM;
        }

        $pageList.stop(true)
            .animate({
                marginLeft: -n * (PAGE_WIDTH + PAGE_GAP)
            }, 300);
    };

    // 获取校验的页码
    var getPropPage = function (page) {
        var rt = page;

        if (page < 0) {
            rt = 0;
        } else if (page > PAGE_NUM - 1) {
            rt = PAGE_NUM - 1;
        }

        return rt;
    };

    // 页码导航
    // 向右
    $pagesCon.on('click', '.scroll-r', function (event) {
        var mL = Math.abs(Util.toInt($pageList.css('margin-left'))),
            delta = PAGES_TOTAL_WIDTH - mL - PAGES_SHOWN_WIDTH - PAGE_GAP * 2,
            dis = 0;

        if (delta == -PAGE_GAP) return;

        if (delta >= PAGES_SHOWN_WIDTH) {
            dis = mL + PAGES_SHOWN_WIDTH + PAGE_GAP;

        } else if (delta < PAGES_SHOWN_WIDTH) {
            dis = mL + delta + PAGE_GAP;
        }

        $pageList.stop(true)
            .animate({
                marginLeft: -dis
            }, 300);

        // 向左
    }).on('click', '.scroll-l', function (event) {
        var mL = Math.abs(Util.toInt($pageList.css('margin-left')));
        delta = mL - PAGE_GAP,
            dis = 0;

        if (delta == -PAGE_GAP) return;

        if (delta < PAGES_SHOWN_WIDTH) {
            dis = 0;
        } else if (delta >= PAGES_SHOWN_WIDTH) {
            dis = mL - (PAGES_SHOWN_WIDTH + PAGE_GAP);
        }

        $pageList.stop(true)
            .animate({
                marginLeft: -dis
            }, 300);

        // 点击页码
    }).on('click', '.page-item', function (event) {
        var $el = $(this),
            page = Util.toInt($(this).data('page'));

        if ($el.hasClass('active')) return;

        setPageActive(page);
    });

    // 用于应用ContextMenu的可复用回调
    win.AppCmFuncs = {
        moveToScreen: function (opt, data) {
            AppMgr.moveToScreen(opt.id, data.page, opt.from);
        },

        screenToToolbar: function (opt) {
            AppMgr.screenToToolbar(opt.id);
        },

        uninstallApp: function (opt) {
            mini.confirm('您确定卸载该应用吗？卸载后，可从应用仓库中再次添加到桌面。', '系统提示', function (action) {
                if (action == 'ok') {
                    AppMgr.uninstallApp(opt.id, opt.from);
                }
            });
            // uninstallTip.setOptions('id', opt.id)
            //  .setOptions('from', opt.from)
            //  .show(true);
        },

        openApp: function (opt) {
            AppMgr.openApp(opt.id);
        }
    };

    // app contextmenu
    var createAppContextMenu = function () {
        var items = [],
            i,
            moveItems = [],
            funcs = AppCmFuncs;

        items.push({
            text: '打开应用',
            role: 'open-app',
            click: funcs.openApp
        });
        items.push('sep');

        moveItems.push({
            text: '右侧工具栏',
            click: funcs.screenToToolbar
        });
        moveItems.push('sep');

        for (i = 1; i <= PAGE_NUM; i++) {
            moveItems.push({
                text: ('智慧桌面' + i),
                role: ('page-' + (i - 1)),
                page: (i - 1),
                click: funcs.moveToScreen
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
            click: funcs.uninstallApp
        });

        var cm = new EpContextMenu({
            items: items
        }).setOptions('from', 'screen');


        // items.push({
        //  text: '打开应用',
        //           name: 'open-app',
        //  onclick: function(e){
        //               var id = e.sender.appId;
        //               funcs.openApp({id: id});
        //           }
        // });
        // items.push('|');

        // moveItems.push({
        //  text: '右侧工具栏',
        //  onclick: function(e){
        //               var id = e.sender.appId;
        //               funcs.screenToToolbar({id: id});
        //           }
        // });
        // moveItems.push('|');

        // for(i = 1; i <= PAGE_NUM; i++) {
        //  moveItems.push({
        //      text: ('智慧桌面' + i),
        //      name: ('page-' + (i - 1)),
        //      page: (i - 1),
        //      onclick: function(e){
        //                   var id = e.sender.appId,
        //                       page = e.item.page;
        //                   funcs.moveToScreen({id: id, from: 'screen'}, {page: page});
        //               }
        //  });
        // }

        // items.push({
        //  text: '移动应用到',
        //           name: 'move-app',
        //  children: moveItems
        // });

        // items.push({
        //  text: '卸载应用',
        //           name: 'uninstall-app',
        //  onclick: function(e){
        //               var id = e.sender.appId,
        //                   page = e.item.page;
        //               funcs.uninstallApp({id: id, from: 'screen'});
        //           }
        // });

        // var cm = new mini.ContextMenu();
        //       cm.setItems(items);

        return cm;
    };

    // app context menu
    var appCm = createAppContextMenu();

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

        if (page === undefined) return;

        page = getPropPage(page);

        setPageActive(page);
    };

    $(document).on('keydown', handleKeydown);

    $(win).on('resize', adjustScreenSize);

    $screensCon.on('click', '.app-item', function (event) {
        var id = $(this).data('id');

        AppMgr.openApp(id);

    }).on('contextmenu', '.app-item', function (event) {
        var id = $(this).data('id'),
            data = AppMgr.getAppData(id);

        appCm.setOptions('id', id).show({
            x: event.pageX,
            y: event.pageY
        });

        Util.configAppCmOpers(appCm, data);

        //       Util.configAppCmOpers(appCm, data);

        // appCm.set({'appId': id}).showAtPos({
        //           x: event.pageX,
        //           y: event.pageY
        //       });


        return false;
    });

    getScreenInfo();

}(this, jQuery));

// 应用拖动模块
(function (win, $) {
    var $screensCon = $('#imac-screens-container'),

        $quickApps = $('#imac-right-bar .quick-apps'),
        // list
        $quickAppList = $('.app-list', $quickApps),
        // wrap
        $quickAppWrap = $('.list-wrap', $quickApps);

    // 是否靠近toolbar区域
    var isNearToolbar = function (pos) {
        var win_w = $(window).width();

        return (win_w - pos.left <= 180);
    };

    // 屏幕应用拖拽 stop回调
    var screenAppDragStop = function (event, ui) {
        var $el = $(this),
            id = $el.data('id'),
            data = AppMgr.getAppData(id),

            // 应用所在分屏
            $p = $el.parent(),
            // 交换位置的应用
            $t = null,

            l = $p.find('.app-item').length,

            i = ImacScreen.getAppIndexByPos(ui.offset);

        $el.addClass('trans')
            .removeClass('app-drag-zindex');

        // 靠近工具栏 则把应用加入工具栏
        if (isNearToolbar(ui.offset)) {
            // 工具栏已满
            if (QuickApps.isFull()) {
                // 恢复原位
                ImacScreen.adjustAppPosByIndex(id, data.index);
            } else {
                ImacScreen.removeApp(id);
                QuickApps.addApp(id);

                AppMgr.sendAppUpdate(id, 'screen-to-toolbar');
            }
        } else if (i == -1 || i + 1 > l || i == data.index) {
            ImacScreen.adjustAppPosByIndex(id, data.index);

        } else {
            $t = ImacScreen.getAppByIndex(ImacScreen.getActivePage(), i);

            ImacScreen.adjustAppPosByIndex(id, i);
            ImacScreen.adjustAppPosByIndex($t.data('id'), data.index);
        }
    };

    // 屏幕应用拖拽 start回调
    var screenAppDragStart = function () {
        $(this).removeClass('trans')
            .addClass('app-drag-zindex');
    };

    var toolbarAppDragStart = function (event, ui) {
        $quickAppWrap.css('overflow', 'visible');

        $(this).addClass('app-drag-zindex');
    };

    var toolbarAppDragStop = function (event, ui) {
        $quickAppWrap.css('overflow', 'hidden');

        var $el = $(this),
            id = $el.data('id'),

            activePage = ImacScreen.getActivePage(),
            // relative的left
            rel_l = Math.abs(Util.toInt(ui.position.left)),

            // 当前页面应用数
            l = ImacScreen.getScreen(activePage).find('.app-item').length,

            i = ImacScreen.getAppIndexByPos(ui.offset);

        $el.removeClass('app-drag-zindex');

        // 拖动距离不够
        if (rel_l <= 100) {
            // 恢复原位
            $el[0].style.cssText = '';
        } else {
            QuickApps.removeApp(id);

            if (i == -1 || i + 1 > l) {
                ImacScreen.addApp(id, activePage, l);
            } else {
                ImacScreen.adjustAppsPosFromIndex(activePage, i, 0);
                ImacScreen.addApp(id, activePage, i);
            }

            AppMgr.sendAppUpdate(id, 'toolbar-to-screen');
        }
    };

    var screenAppDragConfig = {
        containment: 'parent',
        scroll: false,
        opacity: 0.5,
        distance: 10,
        start: screenAppDragStart,
        stop: screenAppDragStop
    };

    var toolbarAppDragConfig = {
        containment: 'body',
        scroll: false,
        opacity: 0.5,
        distance: 10,
        start: toolbarAppDragStart,
        stop: toolbarAppDragStop
    };

    win.AppDragMgr = {
        enableAllScreenApps: function () {
            $screensCon.find('.app-item')
                .draggable(screenAppDragConfig);
        },

        enableScreenApp: function (id) {
            ImacScreen.getApp(id)
                .draggable(screenAppDragConfig);
        },

        enableAllToolbarApps: function () {
            $quickAppList.find('.dock-app')
                .draggable(toolbarAppDragConfig);
        },

        enableToolbarApp: function (id) {
            QuickApps.getApp(id)
                .draggable(toolbarAppDragConfig);
        },

        destroy: function ($app) {
            $app.draggable('destroy');
        }
    };

}(this, jQuery));

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
}(this, jQuery));

// 底部任务栏
(function (win, $) {
    var $taskBar = $('#imac-taskbar'),
        $tasksWrap = $('.tasks-wrap', $taskBar),
        $taskList = $('.task-list', $taskBar);

    // 包括a.scroll-l,a.scroll-r
    var $scrollWrap = $taskBar.find('.scroll-wrap');

    // 右侧工具条宽度
    var TOOLBAR_WIDTH = 50,
        // 滚动导航宽度
        SCROLL_WIDTH = 50,
        // 任务宽度
        TASK_WIDTH = 114,
        // 滚动一次的距离
        SCROLL_UNIT = 200;

    var M = Mustache,
        taskTempl = $.trim(TASK_ITEM_TPL);

    // 调整TaskBar组件的宽度 适时显示、隐藏导航
    var adjustTaskBar = function () {
        var bd_w = $('body').width(),
            bar_w = bd_w - TOOLBAR_WIDTH,
            wrap_w = bar_w - SCROLL_WIDTH * 2;

        $taskBar.css('width', bar_w);
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

    // var contextMenu = new mini.ContextMenu();
    // contextMenu.set({
    //     items: [{
    //         text: '显示桌面',
    //         onclick: function(opt) {
    //             TaskBar.minAllTasks();
    //         }
    //     }, '|', {
    //         text: '关闭此任务',
    //         onclick: function(opt) {
    //             var id = opt.id;
    //             TaskBar.removeTask(id);
    //         }
    //     }, {
    //         text: '只显示此任务窗口',
    //         onclick: function(opt) {
    //             TaskBar.minAllTasks(opt.id);
    //         }
    //     }, '|', {
    //         text: '关闭其他任务',
    //         onclick: function(opt) {
    //             var id = opt.id;
    //             TaskBar.removeOthers(id);
    //         }
    //     }, {
    //         text: '关闭所有任务',
    //         onclick: function() {
    //             TaskBar.removeAll();
    //         }
    //     }, '|', {
    //         text: '取消',
    //         role: 'cancel'
    //     }]
    // })

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

    win.TaskBar = {
        openTask: function (id) {
            var data = AppMgr.getAppData(id),
                dialog = null,
                bs = Util.getBdSize();

            if (!taskCache[id]) {
                dialog = new EpDialog({
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
                    icon: Util.switchIcon(data, 'taskbar')
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

    adjustTaskBar();

    
    // 兼容菜单类主题TabsNav方法
    win.TabsNav = {
        addTab: function(data) {
            var id = data.id;
            AppMgr.getAppData(id) || AppMgr.cacheAppData(id, {
                name: data.name,
                icon: data.icon || './images/app/8.png',
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
    var $infoIcon = $('#imac-right-bar .message');

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
        // $soundIframe[0].src = '';
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
            url: win.msgCountUrl,
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

// 侧边工具栏-门户选择
// (function(win, $) {
//  var $quickBtns = $('#imac-right-bar .quick-btns');

//  // 门户选择面板
//  var $widget = $('#portal-sel-panel'),
//      $trigger = $quickBtns.find('.portal');

//  var show = function() {
//      $widget.removeClass('hidden')
//          .stop(true)
//          .animate({
//              marginBottom: 0
//          }, 200);

//      $trigger.addClass('active');
//  };

//  var hide = function() {
//      $widget.stop(true)
//          .animate({
//              marginBottom: -80
//          }, 200, function() {
//              $widget.addClass('hidden');
//          });

//      $trigger.removeClass('active');
//  };

//  $quickBtns.on('click', '.portal', function(event) {
//      event.preventDefault();

//      $(this).hasClass('active') ?
//          hide() : show();
//  });

//  // 自动隐藏
//  $('body').on('click', function(event) {
//      var t = event.target;

//      if(!$.contains($widget[0], t) && $trigger.hasClass('active') && t != $trigger[0]) {
//          hide();
//      }
//  });
// }(this, jQuery));

// 侧边工具栏-退出系统
(function (win, $) {
    var $quickBtns = $('#imac-right-bar .quick-btns');

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
    //        callback: function(role, opt) {
    //            if(role == 'yes') {
    //                win.location.replace(Util.getRootPath() + 'logout.jspx');
    //            }
    //        }
    //    });

    $quickBtns.on('click', '.logout', function (event) {
        event.preventDefault();
        mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
            if (action == 'ok') {
                if (win.onLogout) {
                    eWebSocket && eWebSocket.close();
                    win.onLogout();
                }
            }
        });
        // logoutConfirm.show(true);
    });
}(this, jQuery));

// 侧边工具栏-快速应用列表
(function (win, $) {
    var $quickApps = $('#imac-right-bar .quick-apps'),

        $wrap = $('.list-wrap', $quickApps),
        $list = $('.app-list', $quickApps),

        $scrollUp = $('.scroll-up', $quickApps),
        $scrollDw = $('.scroll-dw', $quickApps);

    // 上方元素高度
    var PREV_WIDTH = $quickApps.prev().outerHeight(),
        // 下方元素高度
        NEXT_WIDTH = $quickApps.next().outerHeight(),
        // 导航高度
        SCROLL_HEIGHT = 25,
        // topbar高度
        TOP_BAR_HEIGHT = 50,
        // 应用高度
        APP_HEIGHT = 51,
        // 每次滚动的距离
        SCROLL_UNIT = 60;

    var M = Mustache,
        dockAppTempl = $.trim(DOCK_APP_TPL);

    // 调整应用wrap的高度，控制scroll的显隐
    var adjustListHeight = function () {
        var bd_h = $('body').height(),
            wrap_h = bd_h - (TOP_BAR_HEIGHT + PREV_WIDTH + NEXT_WIDTH + SCROLL_HEIGHT * 2),
            apps_h = APP_HEIGHT * $list.find('.dock-app').length;

        $wrap.css('height', wrap_h);

        if (apps_h > wrap_h) {
            $scrollUp.add($scrollDw)
                .removeClass('hidden');
        } else {
            $scrollUp.add($scrollDw)
                .addClass('hidden');

            $list.css('margin-top', 0);
        }
    };

    // 渲染应用
    var renderApps = function (data) {
        var html = [];

        $.each(data, function (i, app) {
            var app = Util.fixPath(app),

                data = $.extend({}, app);

            data.sname = Util.getAppShortName(app.name);
            data.icon = Util.switchIcon(data, 'toolbar');

            html.push(M.render(dockAppTempl, data));

            AppMgr.cacheAppData(app.id, app);
        });

        $list.html(html.join(''));
    };

    // 获取toolbar上的应用信息
    var getToolbarApps = function () {
        Util.ajax({
            url: win.toolbarAppsUrl,
            data: {
                query: 'toolbar-apps'
            },
            success: function (data) {
                if (data && data.length) {
                    renderApps(data);

                    adjustListHeight();

                    AppDragMgr.enableAllToolbarApps();
                }
            },
            error: Util._ajaxErr
        });
    };

    var createAppContextMenu = function () {
        var items = [],
            i,
            funcs = AppCmFuncs,
            moveItems = [];

        items.push({
            text: '打开应用',
            click: funcs.openApp
        });
        items.push('sep');

        for (i = 1; i <= PAGE_NUM; i++) {
            moveItems.push({
                text: ('智慧桌面' + i),
                page: (i - 1),
                click: funcs.moveToScreen
            });
        }

        items.push({
            text: '还原应用到',
            items: moveItems
        });

        items.push({
            text: '卸载应用',
            click: funcs.uninstallApp
        });

        var cm = new EpContextMenu({
            items: items
        }).setOptions('from', 'toolbar');

        // items.push({
        //  text: '打开应用',
        //           name: 'open',
        //  onclick: funcs.openApp
        // });
        // items.push('|');

        //       for(i = 1; i <= PAGE_NUM; i++) {
        //           moveItems.push({
        //               text: ('智慧桌面' + i),
        //               name: 'page' + (i - 1),
        //               onclick: funcs.moveToScreen
        //           });
        //       }

        //       items.push({
        //           text: '还原应用到',
        //           name: 'restore',
        //           childern: moveItems
        //       });


        // items.push({
        //  text: '卸载应用',
        //           name: 'unistall',
        //  onclick: funcs.uninstallApp
        // });

        // var cm = new mini.ContextMenu();
        //       cm.setItems(items);

        return cm;
    };

    // contextmenu for .dock-app
    var appCm = createAppContextMenu();

    // // 工具栏已满提示
    // var dockFullTip = new TipDialog({
    //  msg: '很抱歉，工具栏中的快捷应用已满（当前配置为最多' + MAX_DOCK_APP_NUM + '个）,建议移除个别不常用的应用。',
    //        title: '系统提示',
    //        type: 'info',
    //        btns: [{
    //            text: '确定',
    //            role: 'yes'
    //        }]
    // });

    // 向上
    $quickApps.on('click', '.scroll-up', function (event) {
        var mT = Math.abs(Util.toInt($list.css('margin-top'))),
            dis = 0;

        // 到头了
        if (!mT) return;

        if (mT - SCROLL_UNIT < 0) {
            dis = 0;
        } else {
            dis = mT - SCROLL_UNIT;
        }

        $list.stop(true)
            .animate({
                marginTop: -dis
            }, 300);

        // 向下
    }).on('click', '.scroll-dw', function (event) {
        var mT = Math.abs(Util.toInt($list.css('margin-top'))),
            wrap_h = $wrap.height(),
            apps_h = $list.find('.dock-app').length * APP_HEIGHT,
            dis = 0;

        // 到尾了
        if (mT == apps_h - wrap_h) return;

        if (mT + wrap_h + SCROLL_UNIT > apps_h) {
            dis = apps_h - wrap_h;
        } else {
            dis = mT + SCROLL_UNIT;
        }

        $list.stop(true)
            .animate({
                marginTop: -dis
            }, 300);

        // 点击.dock-app
    }).on('click', '.dock-app', function (event) {
        var id = $(this).data('id');

        AppMgr.openApp(id);
        // 右键菜单
    }).on('contextmenu', '.dock-app', function (event) {
        var id = $(this).data('id');

        appCm.setOptions('id', id).show({
            x: event.pageX,
            y: event.pageY
        });

        return false;
    });

    win.QuickApps = {
        // 是否达到最大数
        isFull: function () {
            var n = $list.find('.dock-app').length,
                r = (n == MAX_DOCK_APP_NUM);

            if (r) {
                mini.showMessageBox({
                    title: '系统提示',
                    message: '很抱歉，工具栏中的快捷应用已满（当前配置为最多' + MAX_DOCK_APP_NUM + '个）,建议移除个别不常用的应用。',
                    buttons: ["ok"],
                    iconCls: "mini-messagebox-info"
                });
                // dockFullTip.show(true);
            }

            return n == MAX_DOCK_APP_NUM;
        },

        addApp: function (id) {
            var data = AppMgr.getAppData(id),
                $app = null;

            data.icon = Util.switchIcon(data, 'toolbar');
            data.sname = Util.getAppShortName(data.name);

            $app = $(M.render(dockAppTempl, data));

            $app.appendTo($list);

            this.makeAppVisiable(id);
            Util.highlightApp($app);

            // 增加拖动支持
            AppDragMgr.enableToolbarApp(id);
        },

        makeAppVisiable: function (id) {
            var mT = Math.abs(Util.toInt($list.css('margin-top'))),
                prev_h = this.getApp(id).prevAll().length * APP_HEIGHT,
                wrap_h = $wrap.height(),
                dis = 0;

            if (prev_h < mT) {
                dis = prev_h;
            } else if (prev_h + APP_HEIGHT - wrap_h > mT) {
                dis = prev_h + APP_HEIGHT - wrap_h;
            }

            if (!dis) return;

            $list.stop(true)
                .animate({
                    marginTop: -dis
                }, 300);
        },

        getApp: function (id) {
            return $list.find('[data-id="' + id + '"]');
        },

        removeApp: function (id) {
            var $app = this.getApp(id);

            // 去除draggable功能
            AppDragMgr.destroy($app);

            $app.remove();
            adjustListHeight();
        }
    };

    $(win).on('resize', adjustListHeight);

    getToolbarApps();
}(this, jQuery));

// 初始化Imac默认应用
(function (win, $) {
    // 获取消息系统应用的打开url
    Util.ajax({
        url: win.getMsgAppUrl,
        data: {
            query: 'get-msg-app-url'
        }
    }).done(function (data) {
        if (!data || !data.url)  {
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

    // 初始化默认应用
    var initDefaultApps = function () {
        $.each(win.defaultApps, function (i, data) {
            data = Util.fixPath(data);

            data.hasTaskbarIcon = true;

            AppMgr.cacheAppData(data.id, data);
        });

        $('body').on('click', '.default-app-btn', function (event) {
            event.preventDefault();

            var id = $(this).data('id');

            AppMgr.openApp(id);
        });
    };

}(this, jQuery));

// 获取在线人数
(function (win, $) {
    var $userCount = $('#online-user-count');

    var getOnlineUserCount = function () {
        Util.ajax({
            url: win.onlineUserCountUrl,
            data: {
                query: 'online-user-count'
            },
            success: function (data) {
                $userCount.html('(' + data.count + ')');
            },
            error: Util._ajaxErr
        });
    };

    getOnlineUserCount();

    setInterval(getOnlineUserCount, 60 * 1000);

}(this, jQuery));

// 获取用户信息
(function (win, $) {
    var $userInfo = $('#user-info');

    var getUserInfo = function () {
        Util.ajax({
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
//                 // eMsg = new EMsgDialog();
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
    if(eWebSocket) {
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
            saveThemeUrl: saveThemeUrl,
            showCallback: function () {
                // $pageCover.removeClass('hidden');
            },
            hideCallback: function () {
                $themeBtn.removeClass('active');
            }
        });
        window.themeSelection = themeSelection;

        $themeBtn.on('click', function () {
            if ($themeBtn.hasClass('active')) {
                $themeBtn.removeClass('active');
                themeSelection.hide();
                hidePageCover();
            } else {
                themeSelection.show();
                $themeBtn.addClass('active');
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
(function(win, $){
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
    var updateEmsgCount = function(count) {
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

    $msgTrigger.on('click', function(){
        var $this = $(this);
        if($this.hasClass('active')) {
            hidePanel();
        } else {
            showPanel();
        }
        
    });

    // 点击隐藏
    $msgEMsg.on('click', '.msg-panel-hide', function () {
        hidePanel();
    });

    $('body').on('click', function(e){
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
            right: 50
        });
    }

    win.updateEmsgCount = updateEmsgCount;
}(this, jQuery));

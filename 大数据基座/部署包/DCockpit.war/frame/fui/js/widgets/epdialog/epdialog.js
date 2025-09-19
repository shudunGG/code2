// EpDialog - Epoint Dialog
(function (win, $) {
    var M = Mustache;

    var defaultSetting = {
        id: '',
        title: '',
        width: 800,
        height: 500,
        draggable: false,
        // 拖动容器
        dragContainer: '',
        resizable: false,
        // resize 容器
        resizeContainer: '',
        minWidth: 300,
        minHeight: 300,
        // iframe src
        url: '',
        // buttons in titlebar: refresh|maxwin|restore|close
        btns: [{
            role: 'close',
            title: '关闭',
            click: function () {}
        }]
    };

    var defaultFns = {
        refresh: function () {
            this.refresh();
        },
        close: function () {
            this.hide();
        },
        maxwin: function () {
            this.maxWin();
        },
        restore: function () {
            this.restoreWin();
        }
    };

    var template = '<div class="epdialog hidden" id="{{id}}"><div class="epdialog-hd ep-bg-1 clearfix"><h4 class="epdialog-title l">{{title}}</h4><div class="epdialog-hd-btns clearfix r">{{#btns}}<span btn-role="{{role}}" class="epdialog-hd-btn {{role}} l" title="{{title}}"></span>{{/btns}}</div></div><div class="epdialog-bd"><iframe src="{{url}}" frameborder="0" scrolling="no" width="100%" height="100%"></iframe></div></div>';
        // cover iframe in dialog body when drag
        // $dialogBdCover = $('<div class="epdialog-bd-cover"></div>');

    win.EpDialog = function (cfg) {
        // deep copy
        this.cfg = $.extend(true, {}, defaultSetting, cfg);
        this._init();
    };

    // 最大化时与四边的距离
    var maxCoord = {
        top: 8,
        left: 8,
        right: 8,
        bottom: 8
    };

    // static method 
    $.extend(EpDialog, {
        setMaxCoord: function (coord) {
            maxCoord = coord;
        }
    });

    EpDialog.prototype = {
        constructor: EpDialog,

        _init: function () {
            this.cfg.options = {};

            this._initView();
            this._initEvent();

            DialogMgr.cacheInstance(this);
        },

        _initView: function () {
            var c = this.cfg;

            if (!c.id) c.id = Util.uuid(8, 16) + '-epdialog';
            // modal cover
            this.$cover = Util.getModalCover(c.id);

            var $widget = $(M.render(template, c)).appendTo('body');

            $.extend(this, {
                $widget: $widget,
                $iframe: $('iframe', $widget),
                $title: $('.epdialog-title', $widget)
            });

            c.hd_h = 32;

            this.setSize(c);
        },

        _initEvent: function () {
            var c = this.cfg,
                self = this;

            var btns_callback = {},
                $widget = this.$widget;

            $.each(c.btns, function (i, btn) {
                btns_callback[btn.role] = btn.click;
            });

            // make it draggable
            if (c.draggable) {
                $widget.draggable({
                    handle: '.epdialog-hd',
                    containment: c.dragContainer || 'body',
                    stop: function (event, ui) {
                        // cfg设置top、left
                        self.setCfg(ui.position);
                    }
                });
            }

            // make it resizable
            if (c.resizable) {
                $widget.resizable({
                    containment: c.resizeContainer || 'body',
                    minWidth: c.minWidth,
                    minHeight: c.minHeight,
                    stop: function (event, ui) {
                        // cfg设置size
                        self.setCfg(ui.size);
                    }
                });
            }

            $widget.on('click', '.epdialog-hd-btn', function (event) {
                event.preventDefault();

                var role = this.getAttribute('btn-role'),
                    rt;

                if (btns_callback[role]) {
                    rt = $.proxy(btns_callback[role], self, c.options, this)();
                }

                if (defaultFns[role] && rt !== false) {
                    $.proxy(defaultFns[role], self, this)();
                }
            });
        },

        // 设置框体size
        setSize: function (size) {
            this.$widget.css({
                width: size.width,
                height: size.height
            });

            return this;
        },

        // 设置窗体top、left
        setCoord: function (coord) {
            this.$widget.css({
                top: coord.top,
                left: coord.left
            });
        },

        setCfg: function (setting) {
            $.extend(this.cfg, setting);
        },

        // modal true: show as a modal dialog
        show: function (modal, center) {
            // var c = this.cfg,
            var zIndex = mini.getMaxZIndex(),

                $widget = this.$widget,
                $cover = this.$cover;

            // ie8下 removeClass('hidden')之后， $(window).width()为0，导致居中时位置不对。先用定时器迟延removeClass('hidden')
            setTimeout(function () {
                $widget.css({
                    zIndex: zIndex,
                    position: 'absolute'
                }).removeClass('hidden');

                // show modal cover 
                if (modal) {
                    $cover.css({
                        zIndex: zIndex - 1
                    }).appendTo('body').removeClass('hidden');
                }

            }, 20);


            if (center) {
                this.center();
            }

            return this;
        },

        hide: function () {
            var $w = this.$widget,
                $c = this.$cover;

            $w && $w.addClass('hidden');
            $c && $c.addClass('hidden').remove();

            return this;
        },

        toggle: function () {
            if (this.isHidden()) {
                this.show(0, 0);
            } else {
                this.hide();
            }
        },

        center: function () {
            var $widget = this.$widget,

                cs = Util.getWinSize(),
                ss = Util.getScrollSize();

            this.setCfg({
                top: (cs.height - $widget.outerHeight()) / 2 + ss.top,
                left: (cs.width - $widget.outerWidth()) / 2 + ss.left
            });

            this.setCoord(this.cfg);
        },

        isHidden: function () {
            return this.$widget.hasClass('hidden');
        },

        // 是否处于最大化
        isMax: function () {
            return !!this.$widget.data('isMax');
        },

        refresh: function () {
            this.$iframe[0].contentWindow.location.reload();
            return this;
        },

        // enable or disable drag and drop
        setDndStatus: function (enable) {
            var c = this.cfg,
                $widget = this.$widget;

            var status = enable ? 'enable' : 'disable';

            c.draggable && $widget.draggable(status);
            c.resizable && $widget.resizable(status);
        },

        maxWin: function () {
            // var c = this.cfg
            var cs = Util.getWinSize();

            this.setSize({
                width: cs.width - maxCoord.left - maxCoord.right,
                height: cs.height - maxCoord.top - maxCoord.bottom
            });

            this.setCoord({
                top: maxCoord.top,
                left: maxCoord.left
            });

            this._toMaxState();

            // 最大化时，禁止拖动、拉伸
            this.setDndStatus(false);

            return this;
        },

        // 转成正常窗口状态
        _toRestoreState: function () {
            var $widget = this.$widget,

                isMax = $widget.data('isMax'),
                $el = $widget.find('.epdialog-hd-btn.restore');

            if (!isMax) return;

            if ($el.length) {
                $el.attr('btn-role', 'maxwin');
                $el.attr('title', '最大化');
                $el[0].className = 'epdialog-hd-btn maxwin l';
            }

            $widget.data('isMax', false);
        },

        // 转成最大化窗口状态
        _toMaxState: function () {
            var $widget = this.$widget,

                isMax = $widget.data('isMax'),
                $el = $widget.find('.epdialog-hd-btn.maxwin');

            if (isMax) return;

            if ($el.length) {
                $el.attr('btn-role', 'restore');
                $el.attr('title', '还原');
                $el[0].className = 'epdialog-hd-btn restore l';
            }

            $widget.data('isMax', true);
        },

        restoreWin: function () {
            var c = this.cfg;

            this.setSize({
                height: c.height,
                width: c.width
            });

            if (c.top !== undefined) {
                this.setCoord({
                    top: c.top,
                    left: c.left
                });
            } else {
                this.center();
            }

            this._toRestoreState();

            // 恢复时，启动拖动、拉伸
            this.setDndStatus(true);

            return this;
        },

        setOptions: function (prop, value) {
            this.cfg.options[prop] = value;
            return this;
        },
        getOptions: function (prop) {
            var rt = this.cfg.options[prop];

            return (rt ? rt : null);
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
                $iframe = this.$iframe,
                $cover = this.$cover;

            c.draggable && $widget.draggable('destroy');
            c.resizable && $widget.resizable('destroy');

            $widget.off('click');
            Util._clearIframe($iframe);

            $widget.remove();
            $cover.remove();

            DialogMgr.releaseInstance(this);

            // 清理实例上的对象引用
            this.$widget = null;
            this.$cover = null;
            this.$title = null;
            this.$iframe = null;
            this.cfg = null;
        }
    };

}(this, jQuery));

// 用于EpDialog、TipDialog的生成和销毁管理
(function (win, $) {
    var ACTIVE_DIALOG = 'active-dialog';

    win[ACTIVE_DIALOG] = {};

    win.DialogMgr = {
        // 缓存实例      
        cacheInstance: function (dialog) {
            top[ACTIVE_DIALOG][dialog.cfg.id] = dialog;
        },

        // 释放实例所占内存
        releaseInstance: function (dialog) {
            var id = dialog.cfg.id;

            top[ACTIVE_DIALOG][id] = null;
            delete top[ACTIVE_DIALOG][id];

            // 低于IE10，手动调用内存回收
            if (Util.browsers.isIE8 || Util.browsers.isIE9) {
                // IE特有方法 用于内存回收
                CollectGarbage();
            }
        },

        // 根据ID获取实例
        getInstance: function (dialogId) {
            var dialog = top[ACTIVE_DIALOG][dialogId];

            return dialog ? dialog : null;
        }
    };
}(this, jQuery));

// 打开页面对话框
(function (win, $) {
    // extend core EpDialog
    $.extend(EpDialog.prototype, {
        close: function () {
            var $widget = this.$widget;
            $widget.find('[btn-role="close"]').trigger('click');
        },

        // 隐藏关闭按钮         
        _hideCloseIcon: function () {
            var $widget = this.$widget;
            $widget.find('[btn-role="close"]').addClass('hidden');
        }
    });

    win.openDialog = function (url, params, width, height, title, funCallBack, ParentPageUrl, notAllowClose, id, modal, max, win, showRefresh, showMax, showClose) {

        var draggable = true,
            resizable = true;
            // showClose = true,
            // showMax = false,
            // showRefresh = true;
            showClose = showClose === undefined ? true : showClose;
            showMax = showMax === undefined ? false : showMax;
            showRefresh = showRefresh === undefined ? true : showRefresh;

        if (params) {
            if (params.draggable !== undefined) {
                draggable = params.draggable;
            }
            if (params.resizable !== undefined) {
                resizable = params.resizable;
            }
            if (params.showRefresh !== undefined) {
                showRefresh = params.showRefresh;
            }
            if (params.showMax !== undefined) {
                showMax = params.showMax;
            }
            if (params.showClose !== undefined) {
                showClose = params.showClose;
            }
        }

        if (!width && !height) {
            max = true;
        }

        var winSize = Util.getWinSize();

        width = width ? parseInt(width, 10) : (winSize.width - 200);
        height = height ? parseInt(height, 10) : (winSize.height - 120);

        if (width >= winSize.width) {
            width = winSize.width - 20;
        }

        if (height >= winSize.height) {
            height = winSize.height - 20;
        }

        // TODO: ugly code, should be removed
        if (url.indexOf('ProcessCreateInstance.jspx') >= 0) {
            showRefresh = false;
        }

        var refreshBtn = {
            role: 'refresh',
            title: '刷新'
        };

        var maxBtn = {
            role: 'maxwin',
            title: '最大化'
        };

        var closeBtn = {
            role: 'close',
            title: '关闭',
            click: function (options) {
                var custom = true;
                // var unlock = options['unlock'];
                var unlock = options.unlock;

                if (typeof unlock == 'function') {
                    custom = unlock.call(this, options.param);
                }
                if (custom) {
                    // var callback = options['callback'];
                    var callback = options.callback;
                    if (typeof callback == 'function') {
                        try {
                            callback.call(this, options.param);
                        } catch (err) {

                        }
                    }

                    this.hide();

                    // 目前先采用延时策略，把销毁时机放到当前js执行队列后面
                    setTimeout($.proxy(function () {
                        this.destroy();
                    }, this), 50);
                }
                return false;
            }
        };

        var btnArr = [refreshBtn, maxBtn, closeBtn],
            epDialog = null,
            strUrl;
            // id;

        if (!showRefresh && showMax && showClose) {
            btnArr = [maxBtn, closeBtn];
        } else if (!showMax && showRefresh && showClose) {
            btnArr = [refreshBtn, closeBtn];
        } else if (showMax && showRefresh && !showClose) {
            btnArr = [refreshBtn, maxBtn];
        } else if (!showRefresh && !showMax && showClose) {
            btnArr = [closeBtn];
        } else if (!showRefresh && showMax && !showClose) {
            btnArr = [maxBtn];
        } else if (showRefresh && !showMax && !showClose) {
            btnArr = [refreshBtn];
        } else {
            btnArr = [];
        }

        if (!id) id = Util.uuid(8, 16) + '-epdialog';

        strUrl = Util.getRightUrl(url);
        if (url.indexOf('?') != -1) {
            strUrl = strUrl + "&dialogId=" + id;
        } else {
            strUrl = strUrl + "?dialogId=" + id;
        }

        epDialog = new EpDialog({
            id: id,
            title: title,
            url: strUrl,
            width: width,
            height: height,
            draggable: draggable,
            resizable: resizable,
            btns: btnArr
        });

        // 若showClose为false，则隐藏关闭按钮        
        !showClose && epDialog._hideCloseIcon();

        if (typeof funCallBack == 'function') {
            epDialog.setOptions("callback", funCallBack);
        }

        //将params参数传递到dialog窗口
        if (params) {
            epDialog.setOptions("params", params);
        }

        epDialog.show(true, true);

        max && epDialog.maxWin();
    };

    $.extend(win, {
        // 通过dialog id获取dialog实例
        getDialog: function (id) {
            var dialogId = id ? id : Util.getUrlParams('dialogId');

            return DialogMgr.getInstance(dialogId);
        },

        // 关闭dialog，并传入close中回调执行的参数
        closeDialog: function (rtnValue) {
            closeDialogById(null, rtnValue);
        },

        // closeDialog内部使用
        closeDialogById: function (dialogId, rtnValue) {
            var dialog = getDialog(dialogId);

            if (dialog) {
                dialog.setOptions('param', rtnValue ? rtnValue : '');
                dialog.close();
            } else {
                try {
                    var tab = top.TabsNav.getActiveTab();
                    if (tab) {
                        tab.remove();
                    } else {
                        window.close();
                    }
                } catch (err) {
                    window.close();
                }
            }
        },

        // 执行配置于dialog中的自定义回调方法
        executeCallBack: function (msg, dialogId) {
            var dialog = getDialog(dialogId);

            if (dialog) {
                var cb = dialog.getOptions('callback');
                cb && cb(msg);
            }
        },

        // 获取配置于dialog中的键值对
        getParams: function (dialogId) {
            var dialog = getDialog(dialogId);

            if (dialog) {
                return dialog.getOptions('params');
            }
        }
    });

}(this, jQuery));
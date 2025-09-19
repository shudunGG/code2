// 应用中心dialog
(function (win, $) {
    var isMetro = /\/fui\/pages\/themes\/(metro)\/\1/i.test(top.location.pathname);
    var tpl = '<div class="app-center-container mini-window" title="应用中心"style="width:960px;height:540px;" showMaxButton="false" howCollapseButton="false" showShadow="true"showToolbar="false" showFooter="false" showModal="true" allowResize="false" allowDrag="true"><div class="app-center-inner"><div class="app-center-loading"></div><div class="app-center-left"><ul class="app-center-nav-list"></ul></div><div class="app-center-main"><div class="app-center-apps-wrap"></div></div></div></div>';
    var navTpl = '<li class="app-center-nav-item {{#hasNew}} has-new{{/hasNew}}{{#isInstalled}} active{{/isInstalled}}" data-id="{{id}}" title="{{name}}">{{sname}}{{#isInstalled}}(<span class="js-installed-count">{{count}}</span>){{/isInstalled}}</li>';
    var appTpl = '<div class="app-center-item' + (isMetro ? ' is-metro' : '') + ' {{#isNew}} new{{/isNew}}" data-id="{{id}}" data-bgcolor="{{bgcolor}}" data-cate="{{categoryId}}">{{{icon}}}<span class="app-center-item-name">{{name}}</span>{{^isInstalled}}<button class="app-center-item-btn install">安装</button>{{/isInstalled}}{{#isInstalled}}<button class="app-center-item-btn uninstall">卸载</button>{{/isInstalled}}</div>';
    var genderSvgHtml = (function () {
        // 非 Metro （即 imac 下直接使用图片）
        if (!isMetro) {
            return function (icon) {
                return '<img src="' + Util.getRightUrl(icon) + '" class="app-center-item-icon" alt="">';
            };
        }
        // IE8 不支持 svg 使用图片
        if (Util.browsers.isIE8) {
            return function (icon) {
                return '<img src="' + Util.getRightUrl('frame/fui/pages/themes/metro/images/app/' + icon + '.png') + '" class="app-center-item-icon" alt="">';
            };
        }
        // 正常使用 svg 以提供变色效果
        return function (icon, bgcolor) {
            var style = bgcolor ? ('fill="' + bgcolor + '"') : '';
            return '<svg class="app-center-item-icon" ' + style + '><use xlink:href="#metro-app-icon-' + icon + '"></use></svg>';
        };

    })();
    var appCenterDialog = null;

    function AppCenterDialog(cfg) {
        // 单例模式
        if (appCenterDialog !== null) {
            return appCenterDialog;
        }
        // 必须以构造函数使用
        if (!(this instanceof AppCenterDialog)) {
            return new AppCenterDialog();
        }

        this.cfg = cfg;
        this.init();
        // 处理事件绑定
        var that = this;
        if (this.cfg.on) {
            $.each(this.cfg.on, function (evName, fn) {
                // console.log(k, v);
                if (Util._getType(fn) !== 'function') {
                    console.error('Error in APPCenterDialog [on.' + evName + '] cfg: the Event handle must be a function!');
                    return;
                }
                that.on(evName.toLowerCase(), fn);
            });
        }
        appCenterDialog = this;
    }
    $.extend(AppCenterDialog.prototype, new Util.UserEvent(), {
        _installedApps: [],
        _stylePath: 'frame/fui/js/widgets/appcenter/appcenter.css',
        _tpl: tpl,
        _navTpl: navTpl,
        _appTpl: appTpl,
        _id: 'app-center-dialog',
        isInit: false,
        _cache: {},
        cacheData: function (data) {
            var cache = this._cache = {};
            if (!data) return;

            // 已经安装的
            $.each(data.installedApps, function (i, app) {
                cache[app.id] = app;
            });

            // 其他应用
            $.each(data.appList, function (i, category) {
                var categoryId = category.id;
                $.each(category.apps, function (i, app) {
                    app.categoryId = app.categoryId || categoryId;
                    cache[app.id] = app;
                });
            });
        },
        _copy: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        init: function () {
            if (!this.isInit) {
                this._init();
            }
            this.init = Util.noop;
        },
        _init: function () {
            Util.loadCss(this._stylePath, '#common-skin', 'Before', true);
            this.initView();
            this.initEvent();
            this.isInit = true;
        },
        _getData: function () {
            return this._getDataPromise = Util.ajax({
                url: this.cfg.getDataUrl
            });
        },
        initView: function () {
            $(this._tpl).attr({
                id: this._id
            }).addClass('hidden').appendTo('body');
            mini.parse();

            this.$container = $('#' + this._id).removeClass('hidden');
            this.dialog = mini.getAndCreate(this.$container[0]);
            this.dialog.on('close', this.hide, this);
            this.$el = this.$container.find('.app-center-inner');
            this.$navList = $('.app-center-nav-list', this.$el);
            this.$main = $('.app-center-main', this.$el);
            this.$appWrap = $('.app-center-apps-wrap', this.$el);
            this.$loading = $('.app-center-loading', this.$el);
        },
        updateContent: function () {
            var that = this;
            this.toggleLoading(true);
            return this._getData().done(function (data) {
                that.cacheData(data);
                that.render(data);
                that.toggleLoading(false);

                if (isMetro && Util.browsers.isIE8) {
                    // ie8 不支持SVG的修复
                    that.$appWrap.find('.app-center-item').each(function (i, app) {
                        var $app = $(app);
                        $app.css('background', $app.data('bgcolor'));
                    });
                }
            });
        },
        toggleLoading: function (show) {
            if (show === undefined) {
                return this.$loading.toggleClass('hidden');
            }
            return this.$loading[(show ? 'remove' : 'add') + 'Class']('hidden');
        },
        initEvent: function () {
            var that = this;
            this.$el
                .on('click', '.app-center-nav-item', function () {
                    that._activeNav(this);
                })
                .on('click', '.app-center-item > .app-center-item-btn', function () {
                    var $this = $(this),
                        $app = $this.closest('.app-center-item'),
                        id = $app.data('id'),
                        appData = that._copy(that._cache[id]);
                    if ($this.hasClass('install')) {
                        that.fire('installApp', appData, that);
                    } else if ($this.hasClass('uninstall')) {
                        epoint.confirm('确定要卸载此应用吗？卸载之后您可以重新从应用仓库中安装', '卸载提醒', function () {
                            that.fire('uninstallApp', appData, that);
                        });
                    }
                });
        },
        _afterInstallApp: function (appId) {
            var $app = this.$appWrap.find('[data-id="' + appId + '"]');
            var that = this;
            $app.fadeOut(function () {
                $app.appendTo(that.$installedAppList).show()
                    .find('.app-center-item-btn').removeClass('install').addClass('uninstall');
            });
            epoint.showTips('安装成功', {
                state: 'success'
            });
        },
        _afterUninstallApp: function (appId) {
            var $app = this.$appWrap.find('[data-id="' + appId + '"]'),
                categoryId = $app.data('cate'),
                $aimList = this.$appWrap.find('[data-target="' + categoryId + '"] > .app-center-list');
            $app.fadeOut(function () {
                $app.appendTo($aimList).show()
                    .find('.app-center-item-btn').removeClass('uninstall').addClass('install');
            });
            epoint.showTips('卸载成功', {
                state: 'success'
            });
        },
        _activeNav: function (el) {
            var $el = $(el),
                $target = this.$appWrap.find('[data-target="' + $el.data('id') + '"]');
            if ($el.hasClass('active')) {
                return;
            }
            $el.addClass('active').siblings().removeClass('active');

            this.$main.stop(true).animate({
                scrollTop: $target[0].offsetTop
            }, 200);
        },
        render: function (data) {
            var that = this;
            var nav = [],
                list = [];
            var installed = this._renderInstalledApps(data.installedApps || []);

            // installed
            nav.push(installed[0]);
            list.push(installed[1]);

            // 其他
            $.each(data.appList, function (i, catalogue) {
                var htmlArr = that._genderCatalogue(catalogue);
                nav.push(htmlArr[0]);
                list.push(htmlArr[1]);
            });

            var len = list.length + 1;

            $(nav.join('')).appendTo(this.$navList.empty());
            $(list.join('')).css({
                height: (1 / len) * 100 + '%'
            }).appendTo(this.$appWrap.empty().css({
                height: len * 100 + '%'
            }));
            this.$installedAppList = this.$appWrap.find('[data-target="installedApps"] > .app-center-list');
        },
        // 渲染已安装的应用
        _renderInstalledApps: function (installedData) {
            var catalogue = {
                id: 'installedApps',
                name: '已安装应用',
                count: installedData.length,
                isInstalled: true,
                apps: installedData
            };
            return this._genderCatalogue(catalogue);
        },
        // 生成分类的结构
        _genderCatalogue: function (catalogue) {
            var that = this;
            if (!catalogue.id) {
                catalogue.id = Util.uuid();
            }
            var isInstalled = !!catalogue.isInstalled;
            var appListHtml = ['<div class="app-center-list-wrap" data-target="' + catalogue.id + '"><div class="app-center-list clearfix">'];
            $.each(catalogue.apps, function (i, item) {
                if (item.isNew) {
                    catalogue.hasNew = true;
                }
                if (item.icon != undefined) {
                    item.icon = genderSvgHtml(item.icon, item.bgcolor);
                }
                // 补全所属分类
                if (!item.categoryId) {
                    item.categoryId = catalogue.id;
                }
                appListHtml.push(Mustache.render(that._appTpl, $.extend({
                    isInstalled: isInstalled
                }, item)));
            });
            appListHtml.push('</div></div>');

            catalogue.sname = catalogue.name.substr(0, 10);

            return [Mustache.render(this._navTpl, catalogue), appListHtml.join('')];
        },
        show: function () {
            var that = this;
            this.fire('beforeShow');

            this.dialog.show();
            this.updateContent().done(function () {
                that.fire('show');
            });
        },
        hide: function () {
            this.dialog.hide();
            this.fire('hide');
        }
    });

    win.AppCenterDialog = AppCenterDialog;

}(this, jQuery));
(function (win, $) {
    var TPL = '<div class="theme-selection-container"><div class="theme-selection-panel" id="theme-selection-panel"><div class="theme-selection-panel-inner"><div class="theme-selection-theme"><div class="theme-selection-header"><span class="theme-selection-icon"></span><span class="theme-selection-name">主题选择</span></div><div class="theme-selection-body theme-panel"></div></div><div class="theme-selection-skin"><div class="theme-selection-header"><span class="theme-selection-icon"></span><span class="theme-selection-name">可选皮肤</span><span class="theme-selection-skin-tips">非当前使用主题，切换皮肤无法实时看到效果</span></div><div class="theme-selection-body skin-panel"></div></div><div class="theme-selection-action"><span class="btn save">保存</span><span class="btn cancel">取消</span></div><div class="theme-preview-panel"></div></div></div></div>';
    var THEME_TPL = '<div class="theme-item  {{#isSys}}selected isSys{{/isSys}}{{#isUsed}} curr{{/isUsed}}" data-url="{{url}}" data-page="{{pageId}}" data-theme="{{themeId}}"><div class="theme-item-inner"><div class="theme-item-cover"></div><img src="{{preview}}" alt="" class="themee-item-preview"><img src="{{preview}}" alt="" class="themee-item-preview-big hidden"><span class="theme-item-name">{{name}}</span><span class="theme-item-icon"></span><span class="theme-item-quick-toggle" >立即切换</span></div></div>';
    var SKIN_TPL = '<div class="skin-item {{#isCurrent}}selected curr{{/isCurrent}}" data-path="{{path}}" data-name="{{name}}"><div class="skin-item-inner"><div class="skin-item-cover"></div><span class="skin-item-preview" style="background-color:{{color}}"></span>        <span class="skin-item-name">{{cname}}</span><span class="skin-item-icon"></span></div></div>';

    function emptyFn() {}
    var DEFAULT_CFG = {
        showCallback: emptyFn,
        hideCallback: emptyFn
    };

    function ThemeSelection(cfg) {
        this.cfg = cfg = $.extend({}, DEFAULT_CFG, cfg);
        this.showCallback = cfg.showCallback;
        this.hideCallback = cfg.hideCallback;
        this._init();
    }

    $.extend(ThemeSelection.prototype, {
        _init: function () {
            $(TPL).appendTo('body');

            this.$panel = $('#theme-selection-panel');
            this.$container = this.$panel.parent();
            this.$themePanel = this.$panel.find('.theme-selection-theme');
            this.$skinPanel = this.$panel.find('.theme-selection-skin');
            this.$themePanelBody = this.$panel.find('.theme-panel');
            this.$skinPanelBody = this.$panel.find('.skin-panel');

            this.$pagePreviewPanel = this.$panel.find('.theme-preview-panel');

            // this._$commonSkin = $('#common-skin');
            // this._$miniSkin = $('#miniui-skin');
            this._$themeSkin = $('#theme-skin');

            if (!ThemeSelection._styleLoaded) {
                Util.loadCss('frame/fui/js/widgets/themeselection/themeselection.css', null, null, true);
                ThemeSelection._styleLoaded = true;
            }

            var urlThemeId = (location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i) || [])[1];

            this.inUsedTheme = urlThemeId;
            this.inUsedPage = Util.getUrlParams('pageId') || this.inUsedTheme;

            // 正在使用的主题
            this.isUsedTheme = (location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i) || [])[1];
            // 系统配置的主题
            // this.sysSetTheme = Util.getFrameSysParam('currentTheme') || this.isUsedTheme;
            this._initEvent();

            // 记录初始使用的皮肤
            this._skins = {};
        },
        _setSkin: function (theme, name) {
            $.cookie('_' + theme + '_skin_', name, {
                path: window._rootPath || '/',
                expires: 365
            });
            // 非正在使用则无需切换
            if (theme === this.inUsedPage) {
                Util.skinSwitcher.postToChild(name, true);
            }
        },
        _initEvent: function () {
            var that = this;
            this.$panel
                // 点击主题切换皮肤
                .on('click', '.theme-item', function () {

                    var $this = $(this),
                        name = $this.data('theme');
                    $this.addClass('selected').siblings().removeClass('selected');

                    that.renderSkin(name, that.getSkins(name));
                })
                .on('mouseenter', '.theme-item', function () {
                    var id = $(this).data('page');
                    that.$pagePreviewPanel.find('#page-preview-' + id).addClass('show').siblings().removeClass('show');
                })
                .on('mouseleave', '.theme-item', function () {
                    var id = $(this).data('page');
                    that.$pagePreviewPanel.find('#page-preview-' + id).removeClass('show');
                })
                // 皮肤点击
                .on('click', '.skin-item', function () {
                    var $this = $(this),
                        name = $this.data('name'),
                        theme = that.$panel.find('.theme-item.selected').data('theme');
                    $this.addClass('selected').siblings().removeClass('selected');
                    // 如果是在使用的皮肤则实时切换皮肤
                    if (theme === that.isUsedTheme) {
                        // that._setSkin(that.isUsedTheme, name);
                        Util.skinSwitcher.postToChild(name, true);
                    }
                })
                // 保存 取消
                .on('click', '.theme-selection-action > .btn', function () {
                    var $this = $(this);
                    if ($this.hasClass('cancel')) {
                        that.hide();
                    } else if ($this.hasClass('save')) {
                        that.save();
                    }
                })
                // 快速切换
                .on('click', '.theme-item-quick-toggle', function (e) {
                    e.stopPropagation();
                    var $page = $(this).closest('.theme-item');

                    location.href = Util.getRightUrl($page.data('url'));
                });
            this._initEvent = Util.noop;
        },
        show: function () {
            var that = this;
            if (!this.isInit) {
                // 获取加载所有主题
                return this.getPages(this.cfg.getPagesUrl).done(function (data) {
                    // 渲染所有界面
                    that.renderPage(data);

                    // 自动加载当前系统配置界面对应的主题的皮肤
                    var skins = that.getSkins(that.sysSetTheme);

                    that.renderSkin(that.sysSetTheme, skins);
                    that.isInit = true;

                    that.$container.css('z-index', Util.getZIndex()).addClass('active');
                    that.showCallback();
                });
            }

            this.$container.css('z-index', Util.getZIndex()).addClass('active');
            this.showCallback();
        },
        isShow: function () {
            return this.$container.hasClass('active');
        },
        hide: function (noRest) {
            if (this.$container.hasClass('active')) {
                this.$container.removeClass('active');
                !noRest && this.reset();
                this.hideCallback();
            }
        },
        save: function () {
            var that = this;
            var $page = this.$panel.find('.theme-item.selected');
            var newTheme = $page.data('theme');
            var newPage = $page.data('page');
            var oldSkin = this.$panel.find('.skin-item.curr').data('name');
            var newSkin = this.$panel.find('.skin-item.selected').data('name');
            // 主题已经切换
            if (newPage != this.sysSetTheme) {
                // 设值皮肤
                $.cookie('_' + newTheme + '_skin_', newSkin, {
                    path: window._rootPath || '/',
                    expires: 365
                });
                // 发请求 保存主题
                Util.ajax({
                    url: this.cfg.savePageUrl,
                    data: {
                        id: newPage
                    }
                }).done(function () {
                    that.sysSetTheme = newTheme;
                    that.sysSetPage = newPage;
                    mini.confirm('主题设置成功，立即为您切换？', '系统提醒', function (e) {
                        if (e == 'ok') {
                            location.href = Util.getRightUrl($page.data('url'));
                        } else {
                            that.hide();
                        }
                    });
                });

            }

            if (oldSkin !== newSkin) {
                // 仅换肤
                $.cookie('_' + newTheme + '_skin_', newSkin, {
                    path: window._rootPath || '/',
                    expires: 365
                });
                epoint.showTips('皮肤设置已保存!', {
                    state: 'success'
                });
                // 换完后需要更新下内部记录的缓存
                that._skins[newTheme] = newSkin;
                that.hide(true);
            } else {
                that.hide();
            }

        },
        reset: function () {
            if (!this.isInit) {
                return;
            }
            var that = this;
            // 勾选系统配置的
            this.$panel.find('.theme-item[data-page="' + this.sysSetPage + '"]').addClass('selected')
                .siblings().removeClass('selected');
            // 重置皮肤: 
            this._setSkin(this.inUsedTheme, this._skins[this.inUsedTheme]);
            that.renderSkin(that.inUsedTheme, this.getSkins(this.sysSetTheme));
        },
        renderPage: function (data) {
            var that = this;
            var pages = data.pages;

            var html = '<div class="theme-list">';
            var prevHtml = '';
            $.each(pages, function (i, page) {

                // 当前访问的 page
                if (page.pageId == that.inUsedPage) {
                    page.isUsed = true;
                }
                // 系统配置的 page
                if (page.pageId == that.sysSetPage) {
                    page.isSys = true;
                }

                page.preview = Util.getRightUrl(page.preview);
                html += Mustache.render(THEME_TPL, page);
                prevHtml += '<img id="page-preview-' + page.pageId + '" src="' + page.preview + '">';
            });
            html += '<div>';
            $(html).appendTo(this.$themePanelBody.empty());
            $(prevHtml).appendTo(this.$pagePreviewPanel.empty());
        },
        getPages: function (url) {
            var that = this;
            return Util.ajax({
                url: url
            }).done(function (data) {
                // 记录系统配置的page
                if (data.defaultPage) {
                    that.sysSetPage = data.defaultPage;
                }

                // 遍历补充完整数据
                $.each(data.pages, function (i, page) {
                    // 无themeId 时从返回的url中进行匹配
                    if (!page.themeId) {
                        page.themeId = (page.url.match(/fui\/pages\/themes\/(\w+)\/\1/i) || [])[1];
                        if (!page.themeId) {
                            console.error('未返回themeId ，也未从url中匹配到themeId，皮肤获取存在问题');
                        }
                    }
                    // 记录 当前page对应的主题 用于皮肤加载
                    if (page.pageId == data.defaultPage) {
                        that.sysSetTheme = page.themeId;
                    }
                    // 记录初始的每个界面的所应用主题的皮肤
                    var theme = page.themeId;
                    that._skins[theme] = $.cookie('_' + theme + '_skin_') || 'default';
                });

                if (!that.sysSetTheme) {
                    console.error('未匹配到默认界面所使用的主题！！！');
                }
            });
        },

        getSkinPath: function (theme, skin) {
            var path = Util.getRightUrl('frame/fui/pages/themes/' + theme + '/skins/' + skin + '/skin.css');

            return window.SrcBoot && window.SrcBoot.handleResPath ? SrcBoot.handleResPath(path) : path;
        },
        getSkins: function (theme) {
            return SrcBoot.getThemeSkins(theme);
        },

        getCurrSkin: function (theme) {
            return $.cookie('_' + theme + '_skin_') || 'default';
        },
        handleSkinTips: function () {
            var $theme = this.$panel.find('.theme-item.selected');
            var theme = $theme.data('theme');
            // 添加非当前的提示
            if (theme == this.isUsedTheme) {
                this.$skinPanel.removeClass('not-in-use');
            } else {
                this.$skinPanel.addClass('not-in-use');
            }
        },
        /**
         * 渲染皮肤列表
         * @param {String} theme 主题
         * @param {Array} skins 皮肤数据
         */
        renderSkin: function (theme, skins) {
            var that = this;
            var html = '<div class="skin-list">',
                currSkin = this.getCurrSkin(theme);
            $.each(JSON.parse(JSON.stringify(skins)), function (i, item) {
                if (item.name == currSkin) {
                    item.isCurrent = true;
                }
                item.cname = item.cname || item.name;
                item.path = that.getSkinPath(theme, item.name);
                html += Mustache.render(SKIN_TPL, item);
            });

            html += '<div>';

            $(html).appendTo(this.$skinPanelBody.empty());

            // 添加非当前的提示
            if (theme == this.inUsedTheme) {
                this.$skinPanel.removeClass('not-in-use');
            } else {
                this.$skinPanel.addClass('not-in-use');
            }
        }
    });
    win.ThemeSelection = ThemeSelection;
})(this, jQuery);
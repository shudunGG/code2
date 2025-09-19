(function (win, $) {
    var TPL = '<div class="theme-selection-container hidden"><div class="theme-selection-panel" id="theme-selection-panel"><div class="theme-selection-panel-inner"><div class="theme-selection-theme"><div class="header"><span class="icon"></span><span class="name">主题选择</span></div><div class="body theme-panel"></div></div><div class="theme-selection-skin"><div class="header"><span class="icon"></span><span class="name">可选皮肤</span><span class="theme-selection-skin-tips">非当前使用主题，切换皮肤无法实时看到效果</span></div><div class="body skin-panel"></div></div><div class="theme-selection-action"><span class="btn save">保存</span><span class="btn cancel">取消</span></div></div></div></div>';
    var THEME_TPL = '<div class="theme-item  {{#isCurr}}selected isSys{{/isCurr}}{{#isUsed}} curr{{/isUsed}}" data-url="{{url}}" data-name="{{name}}"><div class="theme-item-inner"><div class="theme-item-cover"></div><img src="{{preview}}" alt="" class="themee-item-preview"><img src="{{preview}}" alt="" class="themee-item-preview-big"><span class="theme-item-name">{{name}}</span><span class="theme-item-icon"></span></div></div>';
    var SKIN_TPL = '<div class="skin-item {{#isCurrent}}selected curr{{/isCurrent}}" data-path="{{path}}" data-name="{{name}}"><div class="skin-item-inner"><div class="skin-item-cover"></div><span class="skin-item-preview" style="background-color:{{color}}"></span><span class="skin-item-name">{{cname}}</span><span class="skin-item-icon"></span></div></div>';

    function emptyFn() {}
    var DEFAULT_CFG = {
        showCallback: emptyFn,
        hideCallback: emptyFn
    };

    // 获取皮肤数据的Promise缓存
    var skinsPromise = {};

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

            this._$commonSkin = $('#common-skin');
            this._$miniSkin = $('#miniui-skin');
            this._$themeSkin = $('#theme-skin');

            // var link = document.createElement('link');
            // link.id = 'theme-selection-style';
            // link.rel = 'stylesheet';
            // link.href = Util.getRightUrl('fui/pages/themeselection/themeselection.css');
            // var themeSkinLink = document.getElementById('theme-skin');
            // if (themeSkinLink) {
            //     $(link).insertBefore(themeSkinLink);
            // } else {
            //     document.head.appendChild(link);
            // }
            if (!ThemeSelection._styleLoaded) {
                Util.loadCss('fui/pages/themeselection/themeselection.css', '#theme-skin', 'Before', true);
                ThemeSelection._styleLoaded = true;
            }
            // 模拟当前使用和系统配置不一样的场景
            // //win.EpFrameSysParams = {
            // //    currentTheme: 'metro'
            // //};
            // 正在使用的主题
            this.isUsedTheme = (location.href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i) || [])[1];
            // 系统配置的主题
            this.sysSetTheme = Util.getFrameSysParam('currentTheme') || this.isUsedTheme;
            // 记录初始使用的皮肤
            this._skins = {};
            this._initEvent();
        },
        _setSkin: function (theme, name) {
            var oldSkin = $.cookie('_' + theme + '_skin_');
            if (oldSkin == name) {
                return;
            }
            $.cookie('_' + theme + '_skin_', name, {
                path: '/',
                expires: 365
            });
            Util.skinSwitcher.postToChild(name, true);
            var path = [
                'fui/css/themes/' + theme + '/skins/' + name + '/skin.css',
                'fui/js/miniui/themes/' + theme + '/skins/' + name + '/skin.css',
                'fui/pages/themes/' + theme + '/skins/' + name + '/skin.css',
            ];
            var d = +new Date();

            this._$commonSkin.attr('href', Util.getRightUrl(path[0] + '?t=' + d));
            this._$miniSkin.attr('href', Util.getRightUrl(path[1] + '?t=' + d));
            this._$themeSkin.attr('href', Util.getRightUrl(path[2] + '?t=' + d));
        },
        _initEvent: function () {
            if (this._eventInited) {
                return;
            }
            var that = this;
            this.$panel
                // 点击主题切换皮肤
                .on('click', '.theme-item', function () {

                    var $this = $(this),
                        name = $this.data('name');
                    $this.addClass('selected').siblings().removeClass('selected');

                    that.getSkins(name).done(function (data) {
                        var skins = JSON.parse(JSON.stringify(data));

                        that.renderSkin(name, skins);
                    });
                })
                // 皮肤点击
                .on('click', '.skin-item', function () {
                    var $this = $(this),
                        name = $this.data('name'),
                        theme = that.$panel.find('.theme-item.selected').data('name');
                    $this.addClass('selected').siblings().removeClass('selected');
                    // 如果是在使用的皮肤则实时切换皮肤
                    if (theme === that.isUsedTheme) {
                        that._setSkin(that.isUsedTheme, name);
                        Util.skinSwitcher.postToChild(name, true);
                    } else {
                        // 否则更新cookie
                        $.cookie('_' + theme + '_skin_', name, {
                            path: '/',
                            expires: 365
                        });
                    }
                })
                // 保存 取消
                .on('click', '.theme-selection-action > .btn', function () {
                    var $this = $(this);
                    if ($this.hasClass('cancel')) {
                        that.reset();
                        that.hide();
                    } else if ($this.hasClass('save')) {
                        that.save();
                    }
                });
            this._eventInited = true;
        },
        show: function () {
            var that = this;
            var isUsedTheme = this.isUsedTheme;
            var isSysSetTheme = this.sysSetTheme;
            if (!this.isInit) {
                // 获取加载所有主体
                this.getThemes(this.cfg.getThemesUrl).done(function (data) {
                    that.renderTheme(data, isUsedTheme);
                });
                // 自动加载当前系统配置的主题下的皮肤
                this.getSkins(isSysSetTheme).done(function (data) {
                    var skins = JSON.parse(JSON.stringify(data));

                    that.renderSkin(isSysSetTheme, skins);
                });
                this.isInit = true;
            } else {
                this.reset();
            }

            this.$container.css('z-index', Util.getZIndex()).removeClass('hidden');
            this.showCallback();
        },
        isShow: function () {
            return !this.$container.hasClass('hidden');
        },
        hide: function (noReset) {
            if (this.isShow()) {
                this.$container.addClass('hidden');
                !noReset && this.reset();
                this.hideCallback();
            }
        },
        save: function () {
            var that = this;
            var newTheme = this.$panel.find('.theme-item.selected').data('name');
            var oldSkin = this.$panel.find('.skin-item.curr').data('name');
            var newSkin = this.$panel.find('.skin-item.selected').data('name');
            // 主题已经切换
            if (newTheme != this.sysSetTheme) {
                // 设值皮肤
                $.cookie('_' + newTheme + '_skin_', newSkin, {
                    path: '/',
                    expires: 365
                });
                // 发请求 保存主题
                Util.ajax({
                    url: this.cfg.saveThemeUrl,
                    data: {
                        id: newTheme
                    }
                }).done(function () {
                    that.sysSetTheme = newTheme;
                    mini.confirm('主题设置成功，立即为您切换？', '系统提醒', function (e) {
                        if (e == 'ok') {
                            location.href = Util.getRightUrl('fui/pages/themes/' + newTheme + '/' + newTheme);
                        } else {
                            that.hide();
                        }
                    });
                });

            }
            if (oldSkin !== newSkin) {
                that._skins[newTheme] = newSkin;
                // 仅换肤
                $.cookie('_' + newTheme + '_skin_', newSkin, {
                    path: '/',
                    expires: 365
                });
                // mini.confirm('是否刷新浏览器为您切换到新皮肤？', '系统提醒', function (e) {
                //     if (e == 'ok') {
                //         location.reload();
                //     } else {
                //         that.hide();
                //     }
                // });
                epoint.showTips('皮肤设置已保存!', {
                    state: 'success'
                });
                that.hide(true);
            } else {
                that.hide();
            }

        },
        reset: function () {
            var that = this;
            var isUsedTheme = this.isUsedTheme;
            var $skinPanelBody = this.$skinPanelBody;
            this.$panel.find('.theme-item[data-name="' + isUsedTheme + '"]:eq(0)').addClass('selected')
                .siblings().removeClass('selected');
            // 重置皮肤
            this._setSkin(isUsedTheme, this._skins[isUsedTheme]);
            this.getSkins(isUsedTheme).done(function (data) {
                var skins = JSON.parse(JSON.stringify(data));

                that.renderSkin(isUsedTheme, skins);
            }).fail(function () {
                $skinPanelBody.empty();
            });
        },
        renderTheme: function (themes, isUsedTheme) {
            var html = '<div class="theme-list">';
            var that = this;
            $.each(themes, function (i, theme) {
                if (theme.name == isUsedTheme) {
                    theme.isUsed = true;
                }
                if (theme.name == that.sysSetTheme) {
                    theme.isCurr = true;
                }
                // 记录初始的每个界面的所应用主题的皮肤
                that._skins[theme.name] = $.cookie('_' + theme.name + '_skin_') || 'default';

                theme.preview = Util.getRightUrl(theme.preview);
                html += Mustache.render(THEME_TPL, theme);
            });
            html += '<div>';
            $(html).appendTo(this.$themePanelBody.empty());
        },
        getThemes: function (url) {
            return Util.ajax({
                url: url
            });
        },

        getSkinPath: function (theme, skin) {
            var path = Util.getRightUrl('fui/pages/themes/' + theme + '/skins/' + skin + '/skin.css');

            return window.SrcBoot && window.SrcBoot.handleResPath ? SrcBoot.handleResPath(path) : path;
        },
        getSkins: function (theme) {
            var that = this;
            if (!skinsPromise[theme]) {
                skinsPromise[theme] = Util.ajax({
                        url: 'fui/pages/themes/' + theme + '/skins/skins.json'
                    })
                    .fail(function () {
                        that.$skinPanelBody.empty();
                        skinsPromise[theme] = null;
                    });
            }

            return skinsPromise[theme];
        },

        getCurrSkin: function (theme) {
            return $.cookie('_' + theme + '_skin_') || 'default';
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
            $.each(skins, function (i, item) {
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
            if (theme == this.isUsedTheme) {
                this.$skinPanel.removeClass('not-in-use');
            } else {
                this.$skinPanel.addClass('not-in-use');
            }
        }
    });
    win.ThemeSelection = ThemeSelection;
})(this, jQuery);
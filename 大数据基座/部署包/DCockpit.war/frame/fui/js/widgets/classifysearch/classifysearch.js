/*
 * @Author: chends
 * @Date: 2018-07-18 16:56:02
 * @LastEditors: chends
 * @LastEditTime: 2018-09-05 16:21:32
 * @Description: 分类搜索组件
 */
(function (win, $) {
    function ClassifySearch(opt) {
        // 必须使用 new
        if (!(this instanceof ClassifySearch)) {
            return new ClassifySearch(opt);
        }

        var $container = $(opt.el);

        if (opt.id && opt.id[0] != '#') {
            opt.id = '#' + opt.id;
        }

        $container = $container.length ? $container : $(opt.id);

        if (!$container.length) {
            return console.error('必须配置分类搜索生成容器，使用id或el属性进行配置');
        }

        if (!opt.category || !opt.category.length) {
            return console.error('必须配置分类搜索的分类配置 "category" ');
        }

        this.$container = $container;

        this.opt = $.extend({}, ClassifySearch.defaultSettings, opt);

        // 实例标识 用于多实例支持
        if (!ClassifySearch._idx) {
            ClassifySearch._idx = 0;
        }
        this._idx = ++ClassifySearch._idx;

        this.init();
    }

    function emptyFn() {}
    // 默认配置
    ClassifySearch.defaultSettings = {
        // 搜索模板
        'searchTarget': '内容',
        // 分类配置
        'category': [],
        // 关键字最大展示字数
        'maxShowCharacter': 5,
        // 历史记录最大纯属限制
        'localSaveMaxItems': 5,
        'placeholder': '请输入',
        'autoLoadStyle': true,
        'keyup': emptyFn, // 键盘按键释放事件
        'enter': emptyFn, // 回车事件
        'up': emptyFn, // 键盘按上释放事件
        'down': emptyFn // 键盘按下释放事件
    };
    // 设置默认配置
    ClassifySearch.setDefaultOpt = function (k, v) {
        // 验证是否函数
        if (/^(?:keyup|up|down|enter)$/.test(k) && !isFunction(v)) {
            console.error('【' + k + '】配置必须是函数');
            return false;
        }
        ClassifySearch.defaultSettings[k] = v;
    };
    // 处理遮罩
    ClassifySearch._$pageCover = null;

    ClassifySearch.CLASSIFICATION_TPL = '<div class="classify-search-classify-item {{#isActive}}active{{/isActive}}" data-id="{{id}}" data-title-tpl="包含{{name}}${keyword}的{{target}}"><span class="classify-search-classify-icon {{iconCls}}"></span>{{name}}包含<span class="classify-search-classify-kw"></span><span class="classify-search-classify-target">的{{target}}</span></div>';

    var HISTORY_TPL = '<div class="classify-search-history-item" title="{{name}}"><span class="classify-search-history-text">{{name}}</span><span class="action-icon icon-removethin classify-search-history-remove"></span></div>';

    function isString(v) {
        return v + '' === v;
    }

    function isFunction(fn) {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }
    // 实例方法
    $.extend(ClassifySearch.prototype, {
        init: function () {
            if (this.opt.autoLoadStyle && !ClassifySearch._styleLoaded) {
                Util.loadCss('frame/fui/js/widgets/classifysearch/classifysearch.css', '#common-skin', 'Before', true);
                ClassifySearch._styleLoaded = true;
            }
            this._initLocalSave();
            this._initView();
            this._initEvent();
            this.init = emptyFn;
        },
        _initView: function () {
            var that = this;
            // 初始化必要结构
            this.$container.addClass('classify-search-container').attr('data-id', this._idx);
            this.$input = $('<input class="classify-search-input" type="text" id="classify-search-input-' + this._idx + '" placeholder="' + this.opt.placeholder + '"/>');
            this.$searchBtn = $('<button class="classify-search-btn" title="点击搜索"></button>');
            this.$popup = $('<div class="classify-search-popup"></div>');

            this.$historyPanel = $('<div class="classify-search-history-panel"><div class="classify-search-history-list"></div><div class="classify-search-history-footer"><span class="classify-search-history-footer-icon"></span><span class="classify-search-history-footer-text">清空历史记录</span></div></div>');
            this.$historyList = $('.classify-search-history-list', this.$historyPanel);

            this.$classifyPanel = $('<div class="classify-search-classify-panel"><div class="classify-search-classify-list"></div></div>');
            this.$classifyList = $('.classify-search-classify-list', this.$classifyPanel);

            this.$container.append(this.$input).append(this.$searchBtn);

            this.$popup
                .append(this.$historyPanel).append(this.$classifyPanel)
                .appendTo(this.$container);

            // 预渲染分类
            var html = '';
            $.each(this.opt.category, function (i, item) {

                if (/^icon-/.test(item.iconCls)) {
                    // 操作图标
                    item.iconCls = 'action-icon ' + item.iconCls;
                } else {
                    // 模块图标 或预设的图片
                    item.iconCls = item.iconCls || 'view';
                }
                item.target = that.opt.searchTarget;
                item.isActive = i === 0;

                html += Mustache.render(ClassifySearch.CLASSIFICATION_TPL, item);
            });
            $(html).appendTo(this.$classifyList.empty());

            // keyword
            this._$kw = $('.classify-search-classify-kw', this.$classifyList);

            // 搜索目标
            this._$searchTarget = $('.classify-search-classify-target', this.$classifyList);
            // 预渲染搜索历史
            this._renderHistory();

            function enableHolder() {
                that.$input.placeholder();
            }
            // placeholder兼容处理
            if ($.placeholder) {
                enableHolder();
            } else {
                Util.loadJs('frame/fui/js/widgets/jquery.placeholder.min.js', enableHolder);
            }
        },
        _initEvent: function () {
            var that = this;
            // 聚焦popup  失去焦点移除
            this.blurTimer;
            this.$input.on('focus', function () {
                clearTimeout(that.blurTimer);
                var v = $.trim(this.value);
                if (v) {
                    that._renderSearchItems(v);
                }
                that._panelSwitch(v ? 'classify' : 'history');
                that.showPopup();

            });

            this.$container
                // 搜索图标点击
                .on('click', '.classify-search-btn', function () {
                    classifyCodeActions[13].call(that);
                })
                // 历史记录点击
                .on('click', '.classify-search-history-text', function () {
                    var $this = $(this).parent();
                    // 设置后自动聚焦、 并触发一个名为 setHistoryValue 的自定义事件（可用于需要即时搜索的情况调用搜索）
                    that.$input.val($this[0].title).trigger('focus').trigger('setHistoryValue');
                })
                // 历史记录删除
                .on('click', '.classify-search-history-remove', function () {
                    var $this = $(this).parent();
                    that.localSave.remove($this[0].title);
                    setTimeout(function () {
                        $this.remove();
                        if (!that.$historyList.children().length) {
                            that.$historyPanel.addClass('empty');
                        }
                    });
                })
                .on('click', '.classify-search-history-footer', function () {
                    that.localSave.empty();
                    that.$historyList.empty();
                    that.$historyPanel.addClass('empty');
                    // that.$container.trigger('historyChange');
                })
                // 分类项目点击
                .on('click', '.classify-search-classify-item', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    var key = that._getSelectedItem('classify').data('id');
                    var val = $.trim(that.$input.val());
                    classifyCodeActions[13].call(that, key, val);
                })
                // 绑定自定义事件 用于重新渲染搜索记录
                .on('historyChange', function () {
                    that._renderHistory();
                });
            // on('blur', function () {
            //     that.blurTimer = setTimeout(function () {
            //         that.$container.removeClass('popup');
            //     }, 100);
            // });
            // 不在当前区域 则失去popup
            this._bodyEnevtNameSpace = 'classify-search-' + this._idx;
            $('body').on('click.' + this._bodyEnevtNameSpace, function (e) {
                if (!$(e.target).closest('.classify-search-container[data-id="' + that._idx + '"]').length) {
                    that.blurTimer = setTimeout(function () {
                        that.hidePopup();
                    }, 100);
                }
            });

            // 历史记录键盘处理
            var historyCodeActions = {
                '13': function () {
                    var v = this._getSelectedItem('history').attr('title');
                    this.$input.val(v);
                    // 设置后自动聚焦、 并触发一个名为 setHistoryValue 的自定义事件（可用于需要即时搜索的情况调用搜索）
                    this.$input.trigger('focus').trigger('setHistoryValue');
                },
                '38': function () {
                    this._itemMove('up');
                },
                '40': function () {
                    this._itemMove('down');
                },
                '27': function () {
                    this.$container.removeClass('popup');
                    this.$input.blur();
                }
            };
            // 分类面板键盘事件
            var classifyCodeActions = {
                '13': function (k, v) {
                    v = v || $.trim(this.$input.val());
                    k = this._getSelectedItem('classify').data('id');
                    if (!v) return;
                    // 记录搜索值
                    this.localSave.add(v);
                    this.$classifyList.find('.classify-search-classify-item:eq(0)').addClass('active').siblings('.classify-search-classify-item.active').removeClass('active');
                    this.opt.enter.call(that, k, v);
                    this.hidePopup();
                    this.$input.blur().val('');

                    // rerender 
                    this.$container.trigger('historyChange');

                },
                '38': function (k, v) {
                    k = this._itemMove('up').data('id');
                    this.opt.up.call(this, k, v);
                },
                '40': function (k, v) {
                    k = this._itemMove('down').data('id');
                    this.opt.down.call(this, k, v);
                },
                '27': function () {
                    this.hidePopup();
                    this.$input.blur();
                }
            };

            // keyup 处理
            this.$input.on('keyup', function (e) {
                var code = e.which,
                    val = $.trim(this.value),
                    needCodeAction = code === 13 || code === 27 || code === 38 || code === 40,

                    key = that._getSelectedItem('classify').data('id');

                if (!key) {
                    key = that.$classifyList.find('.classify-search-classify-item:eq(0)').data('id');
                }

                if (val) {
                    that._renderSearchItems(val);
                    that._panelSwitch('classify');
                    needCodeAction && classifyCodeActions[code].call(that, key, val);
                } else {
                    that._panelSwitch('history');
                    needCodeAction && historyCodeActions[code].call(that);
                }
            });
        },
        /** 
         * 初始化本地存储
         * 返回api：
         * localSave:{
         *   get: get, // 获取所有值
         *   add: add, // 新增值
         *   remove: remove, // 移除一个值
         *   empty: empty // 清空所有值
         * }
         */
        _initLocalSave: function () {
            // 多实例支持 并防止多处使用存储冲突 以 路径 + 当前页面实例序号 开辟本地存储空间
            var _k = 'classifysearch_history_' + location.pathname + '_' + this._idx;
            var that = this;


            function get(noParse) {
                return noParse ? localStorage.getItem(_k) : JSON.parse(localStorage.getItem(_k) || '[]');
            }

            function add(value) {
                value = (value || '').substr(0, 10);
                var old = this.get();
                // 删除已经存在的
                old = _remove(value, old);
                // 重新加载到头部
                old.unshift(value);
                // 限制最大长度
                if (old.length > that.opt.localSaveMaxItems) {
                    old.length = that.opt.localSaveMaxItems;
                }
                // save
                localStorage.setItem(_k, JSON.stringify(old));
            }

            function _remove(value, old) {
                for (var i = 0, l = old.length; i < l; i++) {
                    if (old[i] === value) {
                        old.splice(i, 1);
                        return old;
                    }
                }
                return old;
            }

            function remove(value) {
                var old = this.get();
                old = _remove(value, old);
                localStorage.setItem(_k, JSON.stringify(old));
            }

            function empty() {
                localStorage.setItem(_k, '[]');
            }
            return this.localSave = {
                get: get,
                add: add,
                remove: remove,
                empty: empty
            };
        },
        /**
         * 面板条目上下移动
         *
         * @param {String} direction 移动方向 up/down
         * @return {jQueryObject} 移动后的激活项目
         */
        _itemMove: function (direction) {
            var $items;
            if (this.$container.hasClass('classify')) {
                $items = this.$classifyList.find('.classify-search-classify-item');
            } else {
                $items = this.$historyList.find('.classify-search-history-item');
            }
            var $active = $items.filter('.active');
            // 如果列表中被插入了其他元素 直接index()取得的索引值不对
            var idx = -1;
            $items.each(function (i, item) {
                // console.log(arguments);
                if ($(item).hasClass('active')) {
                    idx = i;
                    return false;
                }
            });

            if (direction === 'up') {
                if (idx === -1) {
                    idx = $items.length;
                }
                $active.removeClass('active');
                return $items.eq(--idx).addClass('active');
            }

            if (direction === 'down') {
                if (idx === $items.length - 1) {
                    idx = -1;
                }
                $active.removeClass('active');
                return $items.eq(++idx).addClass('active');
            }
        },
        /**
         * 获取面板中选中条目
         *
         * @param {String} target 面板名称 classify/history
         * @return {jQueryObject} 选中的项目
         */
        _getSelectedItem: function (target) {
            var $items = this['$' + target + 'List'].children();
            return $items.filter('.active');
        },
        /**
         * 渲染搜索内容
         * @param {*} v 
         */
        _renderSearchItems: function (v) {
            this.$classifyList.find('.classify-search-classify-item').each(function (i, item) {
                var title = ($(item).data('title-tpl') || '').replace(/\${keyword}/, v);
                item.title = title;
            });
            this._fillKeyWord(v);
        },
        /**
         * 向分类中填充关键字
         *
         * @param {String} v 当前的关键字
         */
        _fillKeyWord: function (v) {
            if (this._$kw) {
                if (v.length > this.opt.maxShowCharacter) {
                    v = v.substr(0, this.opt.maxShowCharacter) + '..';
                }
                this._$kw.text(v);
            }
        },
        /**
         * 渲染历史记录
         */
        _renderHistory: function () {
            var data = this.localSave.get();

            if (!data || !data.length) {
                this.$historyPanel.addClass('empty');
                this.$historyList.empty();
                return;
            }

            var html = '';
            $.each(data, function (i, item) {
                html += Mustache.render(HISTORY_TPL, {
                    name: item
                });
            });

            $(html).appendTo(this.$historyList.empty());
            this.$historyPanel.removeClass('empty');
        },
        /**
         * 切换展示面板
         *
         * @param {String} target 要展示的面板 取值 'history' / 'classify'
         */
        _panelSwitch: function (target) {
            var other = target === 'classify' ? 'history' : 'classify';
            this.$container.addClass(target).removeClass(other);
        },
        showPopup: function () {
            this.$container.addClass('popup');
            ClassifySearch._$pageCover && ClassifySearch._$pageCover.removeClass('hidden');
        },
        hidePopup: function () {
            this.$container.removeClass('popup');
            ClassifySearch._$pageCover && ClassifySearch._$pageCover.addClass('hidden');
        },
        /**
         * 动态修改配置
         * @param {String} key 要修改的配置名称
         * @param {Any} val 对应配置属性值
         */
        setOpt: (function () {
            // 禁止动态修改的属性
            function forbidModify(k) {
                console.error('分类搜索的【' + k + '】属性无法动态修改');
                return false;
            }

            function modify(k, v) {
                // 验证是否函数
                if (/^(?:keyup|up|down|enter)$/.test(k) && !isFunction(v)) {
                    console.error('【' + k + '】配置必须是函数');
                    return false;
                }
                this.opt[k] = v;
            }

            var optAction = {
                id: forbidModify,
                el: forbidModify,
                searchTarget: function (k, v) {
                    modify.apply(this, arguments);
                    this._$searchTarget && this._$searchTarget.text(v);
                },
                maxShowCharacter: modify,
                localSaveMaxItems: modify,
                up: modify,
                down: modify,
                esc: modify,
                keyup: modify,
                enter: modify
            };
            return function (key, val) {
                if (!isString(key)) {
                    return console.error('Failed to execute "setOpt", the first argument is required and must be string!');
                }
                if (!optAction[key]) {
                    return console.error('The [' + key + '] parameter is invalid');
                }
                return optAction[key].call(this, key, val);
            };
        })(),
        /**
         * 获取某个配置
         *
         * @param {String} key 配置名称
         * @returns 配置值
         */
        getOpt: function (key) {
            if (!isString(key)) {
                return console.error('Failed to execute "setOpt", the first argument is required and must be string!');
            }
            return this.opt[key];
        },

    });
    win.ClassifySearch = ClassifySearch;
})(this, jQuery);
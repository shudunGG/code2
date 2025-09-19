// toolbar overflow 支持
(function(win, $) {
    if (!Util.debounce) {
        /**
         * debounce 大于间隔时间时才触发
         * 连续触发时，仅当时间间隔大于指定时间才触发
         *
         * @param {function} fn 要处理的函数
         * @param {number} delay 间隔时间 单位 ms
         * @param {[object]} ctx 要绑定的上下文
         * @returns debounce 后的新函数
         */
        Util.debounce = function(fn, delay, ctx) {
            delay = delay || 17;
            var timer;
            return function() {
                var args = arguments;
                var context = ctx || this;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        };
    }
    if (!Util.throttle) {
        /**
         * throttle 降低触发频率
         * 连续触发时，降低执行频率到指定时间
         *
         * @param {function} fn 要处理的函数
         * @param {number} delay 间隔时间 单位 ms
         * @param {[object]} ctx 要绑定的上下文
         * @returns throttle 后的新函数
         */
        Util.throttle = function throttle(fn, delay, ctx) {
            delay = delay || 200;
            var timer,
                prevTime = +new Date();
            return function() {
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
                    timer = setTimeout(function() {
                        fn.apply(context, args);
                        prevTime = +new Date();
                    }, delay - pastTime);
                }
            };
        };
    }

    function ToolbarOverflow(el) {
        this.$el = $(el);

        if (!this.$el.length) {
            return;
        }
        if (this.$el[0].getAttribute(this.ATTRIBUTE_PREFIX + 'init') == 'true') {
            var target = ToolbarOverflow.instances[this.$el[0].getAttribute(this.ATTRIBUTE_PREFIX + 'uid')];
            if (!target) {
                return;
            }
            target.update();
            return target;
        }

        this.eventNamespace = ToolbarOverflow.name + '-' + this.uid;
        this.events = {};
        this.$el[0].setAttribute(this.ATTRIBUTE_PREFIX + 'init', 'true');

        this.uid = Util.uuid();
        this.$el[0].setAttribute(this.ATTRIBUTE_PREFIX + 'uid', this.uid);
        ToolbarOverflow.instances[this.uid] = this;

        this.$el.css('position', 'relative');
        this.isOver = false;
        this.$extArea = $('<div class="toolbar-ext-area"></div>').appendTo(this.$el);
        if (this.$el.hasClass('fui-toolbar-bottom')) {
            this.$extArea.css('bottom', '100%');
        } else {
            this.$extArea.css({ top: '100%' });
        }
        this.limit_w = this.$el.width();

        // 记录 toolbar 中最后一个非右浮动的元素
        this.$lastNormalChild = null;
        // 记录 toolbar 中第一个右浮动的元素（排除忽略的）
        this.$firstRightChild = null;

        this._insertToggleBtn();
        this.calcLimited();

        this.initEvent();
        this.update();
    }
    // 记录所有实例
    ToolbarOverflow.instances = {};
    // 获取单个实例
    ToolbarOverflow.getInstance = function(el) {
        if (!el) return null;
        return ToolbarOverflow.instances[$(el).attr(ToolbarOverflow.prototype.ATTRIBUTE_PREFIX + 'uid')];
    };

    $.extend(ToolbarOverflow.prototype, {
        // 属性前缀
        ATTRIBUTE_PREFIX: 'overflow-',
        /**
         * 在移动时需要忽略掉的选择器
         * 帮助按钮、高级搜索展开按钮、高级搜索主要搜索框、toolbar溢出的触发按钮和额外区域
         */
        ignoreSelectors: ['.fui-toolbar-helper', '.fui-search-trigger', '.fui-primary-search', '.fui-toolbar-over-trigger', '.toolbar-ext-area'].join(','),

        /**
         * 更新状态
         *
         */
        update: function() {
            var inner_w = this.calcInnerWidth();
            // 如果按钮已经是展示的 则无需加上宽度 否则要加上 避免出现本来能显示下 显示按钮后恰好展示不下了
            var trigger_w = this.$trigger.is(':visible') ? 0 : this.$trigger.outerWidth(true);
            if (inner_w > this.limit_w) {
                this.isOver = true;
                this.$trigger.removeClass('hidden');
                this.moveToExtArea(inner_w + trigger_w);
            } else {
                this.restoreToToolbar(inner_w);
            }
            return this;
        },

        /**
         * 计算容器的限制宽度
         */
        calcLimited: function() {
            this.limit_w = this.$el.width();
        },
        initEvent: function() {
            var that = this;
            this.$trigger.on('click.' + this.eventNamespace, function() {
                that.toggle();
            });

            $(win).on(
                'resize.' + this.eventNamespace,
                Util.throttle(
                    function() {
                        that.calcLimited();
                        that.update();
                    },
                    Util.browsers.isIE ? 100 : 50
                )
            );
            $(win).on('mousedown.' + this.eventNamespace, function(ev) {
                var $target = $(ev.target);
                if ($target.closest(that.$trigger).length) {
                    return;
                }
                if (!$target.closest(that.$extArea).length) {
                    that.toggle(false);
                }
            });
        },

        /**
         * 插入触发按钮
         *
         */
        _insertToggleBtn: function() {
            this.$trigger = $('<i></i>').addClass('fui-toolbar-over-trigger hidden r icon-rightdouble action-icon');
            if (this.$el.hasClass('fui-toolbar-bottom') && !this.$el.hasClass('left')) {
                this.$trigger.prependTo(this.$el);
            } else {
                //  顶部的 toolbar 和 左浮动的toolbar
                var $floatRight = this.$el.find('.r');
                if ($floatRight.length) {
                    $floatRight.eq(0).before(this.$trigger);
                } else {
                    this.$trigger.appendTo(this.$el);
                }
            }
        },

        /**
         * 切换额外区域的显示和隐藏 仅在溢出时生效
         *
         * @param {boolean | undefined} show 传递布尔值时 true 显示， false 隐藏； 不传值时切换状态
         * @returns
         */
        toggle: function(show) {
            if (!this.isOver) {
                return;
            }

            if (show === undefined) {
                this.$trigger.toggleClass('active');
                return this.$extArea.slideToggle(200, setZIndex);
            }
            if (show) {
                this.$trigger.addClass('active');
                this.$extArea.slideDown(200, setZIndex);
            } else {
                this.$trigger.removeClass('active');
                this.$extArea.slideUp(200);
            }
            function setZIndex() {
                var $this = $(this);
                if ($this.is(':visible')) {
                    $this.css('z-index', Util.getZIndex());
                }
            }
        },

        /**
         * 计算 toolbar 区域中的元素宽度 并做缓存
         *
         * @returns {number} 计算得出的宽度
         */
        calcInnerWidth: function() {
            var inner_w = 0;
            this.$el.children().each(function(i, el) {
                var $el = $(el);
                if ($el.hasClass('toolbar-ext-area')) {
                    // 扩展区域的 也需要更新一下
                    var ext_w = 0;
                    // 不可见需先调整为可见 计算完成再隐藏
                    var isVisible = $el.is(':visible');
                    if (!isVisible) {
                        $el.addClass('hidden-accessible').show();
                    }
                    $el.css('width', '10000px')
                        .children()
                        .each(function(j, item) {
                            var $item = $(item);
                            var w = $item.is(':hidden') ? 0 : $item.outerWidth(true);
                            $item.data('width', w);
                            ext_w += w;
                        });
                    if (!isVisible) {
                        $el.removeClass('hidden-accessible').hide();
                    }
                    $el.data('width', ext_w).css('width', ext_w + 2);
                    return;
                }
                var w = $el.is(':hidden') ? 0 : $el.outerWidth(true);
                $el.data('width', w);
                inner_w += w;
            });
            return inner_w;
        },

        /**
         * 获取 toolbar 中 视觉上的最后一个元素
         * 几个应固定在最右侧的已经排除在外 具体配置在 ignoreSelectors 中
         *
         * @returns
         */
        getToolbarLastChild: function() {
            var $floatRights = this.$el.find('> .r');

            var i = 0,
                len = 0;

            // 优先右浮动的 正序取出 即为最后的
            for (i = 0, len = $floatRights.length; i < len; i++) {
                var $currR = $floatRights.eq(i);
                // 在忽略列表中 则取下一个
                if ($currR.filter(this.ignoreSelectors).length || $currR.is(':hidden')) {
                    continue;
                } else {
                    return $currR;
                }
            }

            // 仍未返回则中最后开始取
            var $children = this.$el.children().filter(function(i, el) {
                var $el = $(el);
                return !$el.hasClass('r') && !$el.is(':hidden');
            });

            for (i = $children.length - 1; i > 0; i--) {
                var $currN = $children.eq(i);
                if ($currN.filter(this.ignoreSelectors).length) {
                    continue;
                } else {
                    return $currN;
                }
            }
        },

        /**
         * 宽度溢出 移动到额外区域
         *
         * @param {number} inner_w 当前 toolbar 中元素的宽度
         */
        moveToExtArea: function(inner_w) {
            if (!inner_w) {
                inner_w = this.calcInnerWidth();
            }
            // 移动导致新增的宽度
            var addedWidth = 0;
            // 记录当前元素的宽度
            var currWidth = 0;
            do {
                var $aim = this.getToolbarLastChild();
                if ($aim && $aim.length) {
                    if ($aim.hasClass('r')) {
                        this.$firstRightChild = $aim.next();
                    } else {
                        this.$lastNormalChild = $aim.prev();
                    }
                    currWidth = $aim.data('width');
                    addedWidth += currWidth;
                    inner_w -= currWidth;
                    $aim.prependTo(this.$extArea);
                } else {
                    this.$firstRightChild = this.$lastNormalChild = null;
                    break;
                }
            } while (inner_w > this.limit_w);

            if (addedWidth) {
                var w = (this.$extArea.data('width') || 0) + addedWidth;
                this.$extArea.css('width', w + 2).data('width', w);
            }
        },
        /**
         * 获取第一个可还原的元素
         *
         * @returns
         */
        getFirstExtraChild: function() {
            return this.$extArea.children(':eq(0)');
        },
        /**
         * 处理某个元素还原到正确的位置
         *
         * @param {jQuery Object} $targetChild 要处理元素
         * @returns
         */
        restoreToRightPos: function($targetChild) {
            // 右浮动的
            if ($targetChild.hasClass('r')) {
                if (this.$firstRightChild && this.$firstRightChild.length) {
                    this.$firstRightChild.before($targetChild);
                    this.$firstRightChild = $targetChild;
                } else {
                    $targetChild.appendTo(this.$targetChild);
                }
                return;
            }

            // 正常的直接插入到正常的最后一个的后面即可
            if (this.$lastNormalChild && this.$lastNormalChild.length) {
                this.$lastNormalChild.after($targetChild);
                // 更新记录
                this.$lastNormalChild = $targetChild;
            } else {
                $targetChild.appendTo(this.$el);
            }
        },
        /**
         * 判断当前元素是否可被还原
         *
         * @param {jQuery Object} $targetChild 要测试能否被还原的元素
         * @param {number} currInner_w 当前 toolbar 中所有元素的宽度
         * @returns
         */
        _restorable: function($targetChild, currInner_w) {
            if (!$targetChild.length) {
                return false;
            }
            return currInner_w + $targetChild.data('width') <= this.limit_w;
        },
        /**
         * 像 toolbar 中还原元素
         * @param {number} currInner_w 开始调整时的 toolbar 内部元素宽度
         * @param {boolean | undefined}  是否强制还原所有元素
         * @returns {undefined}
         * @memberof ToolbarOverflow
         */
        restoreToToolbar: function(currInner_w, force) {
            var $firstChild = this.getFirstExtraChild();

            while ((force && $firstChild.length) || this._restorable($firstChild, currInner_w)) {
                // 还原
                this.restoreToRightPos($firstChild);
                // 更新宽度
                var ext_w = (this.$extArea.data('width') || 0) - $firstChild.data('width');
                this.$extArea.data('width', ext_w);

                currInner_w += $firstChild.data('width');
                $firstChild = this.getFirstExtraChild();
            }

            this.$extArea.css('width', this.$extArea.data('width') + 2);
            // 是否全部还原完了
            if (force || !this.$extArea.children().length) {
                this.allRestore();
            }
        },
        /**
         * 全部还原后的统一调整
         * @returns {undefined}
         * @memberof ToolbarOverflow
         */
        allRestore: function() {
            this.isOver = false;
            this.$trigger
                .addClass('hidden')
                .data('width', 0)
                .removeClass('active');
            this.$extArea.hide();
        },
        /**
         * 实例销毁
         * @returns {undefined}
         * @memberof ToolbarOverflow
         */
        destroy: function() {
            this.$trigger.off('click');
            $(win).off('resize.' + this.eventNamespace);
            $(win).off('mousedown.' + this.eventNamespace);

            this.restoreToToolbar(null, true);

            this.$trigger.remove();
            this.$extArea.remove();
            this.$el[0].removeAttribute(this.ATTRIBUTE_PREFIX + 'uid');
            this.$el[0].removeAttribute(this.ATTRIBUTE_PREFIX + 'init');

            ToolbarOverflow.instances[this.uid] = null;
            delete ToolbarOverflow.instances[this.uid];

            for (var k in this) {
                if (Object.prototype.hasOwnProperty.call(this, k)) {
                    this[k] = null;
                    delete this[k];
                }
            }
        }
    });

    win.ToolbarOverflow = ToolbarOverflow;

    // auto init
    $(function() {
        $('.fui-toolbar, .fui-toolbar-bottom').each(function(i, item) {
            // eslint-disable-next-line no-new
            new ToolbarOverflow(item);
        });
    });
})(this, jQuery);

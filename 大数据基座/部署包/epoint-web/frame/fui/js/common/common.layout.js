(function(win, $) {
    var layoutInstance = {
        onToggle: Util.noop
    };
    var $body = $('body');
    var defaultResizeOptions = {
        animate: false, // 我们有css动画
        autoHide: true,
        delay: 20,
        ghost: false // 不要在resize的时候复制内容
    };

    var MIN_WIDTH = 150;
    var MIN_HEIGHT = 49;

    var EVENT_NAMESPACE = '.f9-layout';
    var isIE8 = Util.browsers.isIE8;
    var isIE9 = Util.browsers.isIE9;

    Util.UserEvent.installTo(layoutInstance);

    function parse() {
        var $top = $('.fui-top');
        var $left = $('.fui-left');
        var $main = $('.fui-main, .fui-right');
        var $right = $('.fui-rightbar');
        var $bottom = $('.fui-bottom');
        var $layoutRegion = $top
            .add($left)
            .add($main)
            .add($right)
            .add($bottom);

        // 切换或reseize需要调整宽度的集合
        var needUpdateTopArr = [];
        var needUpdateBottomArr = [];
        var needUpdateLeftArr = [];
        var needUpdateRightArr = [];

        if (!check()) {
            return;
        }
        layoutInstance.fire('befireParse');
        var hasPageLoading = $('.page-loading').length;
        var $pageLoading = $.fn;
        if (!hasPageLoading) {
            $pageLoading = $('<div class="page-loading"></div>').appendTo('body');
            $pageLoading.css('height');
        }

        adaptInitCls();

        $.each([$top, $left, $right, $bottom], function(i, $el) {
            addToggleBtn($el);
        });

        parseView($left);
        parseView($right);

        initTopEvent();
        initLeftEvent();
        initRightEvent();
        initBottomEvent();

        // 只要有拖动就为fui-main添加遮罩 避免 ifr 导致无法拖拽的问题
        if ($layoutRegion.filter(function (i, el) {
            var $el = $(el);
            return !$el.hasClass('fui-main') && $el.attr('resize') !== 'false';
        }).length) {
            $('<div class="fui-layout-cover"></div>').appendTo($main);
        }

        if (!hasPageLoading) {
            $pageLoading.fadeOut(function() {
                $pageLoading.remove();
            });
        }
        setTimeout(function() {
            $layoutRegion.addClass('fui-layout-tran');
        }, 1000);

        layoutInstance.fire('parse');
        layoutInstance.fire('afterParse');

        var resizeTimerMap = {};
        function afterResize(type) {
            // resize end
            // layoutInstance.fire('afterResize', {
            //     region: type
            // });
            // resize 之后 调整动画为 css 涉及区域多，处理复杂 直接 setTimeout
            if (isIE8 || isIE9) {
                return layoutInstance.fire('afterResize', {
                    region: type
                });
            }
            clearTimeout(resizeTimerMap[type]);
            resizeTimerMap[type] = setTimeout(function() {
                layoutInstance.fire('afterResize', {
                    region: type
                });
            }, 200);
        }

        /**
         * 检查是否符合使用规范
         *
         * @returns {boolean}
         */
        function check() {
            var rt = true;
            $.each([$top, $left, $main, $right, $bottom], function(i, $el) {
                if ($el.length > 1) {
                    rt = false;
                    console.error($el[0], '布局区域重复， 一个区域仅能出现一次');
                    return false;
                }
            });
            rt &&
                $layoutRegion.each(function(i, el) {
                    if ($(el).parent()[0] !== document.body) {
                        rt = false;
                        console.error(el, '不在body下，布局结构错误！！！');
                        return false;
                    }
                });
            return rt;
        }
        /**
         * 多种布情形下的 cls fix
         *
         */
        function adaptInitCls() {
            var hasTop = $top.length === 1,
                hasBottom = $bottom.length === 1,
                topInset,
                bottomInset;

            if (hasTop) {
                if ($top.attr('inset') == 'true') {
                    topInset = true;
                    $body.addClass('with-fui-top-inset');
                    needUpdateTopArr = [$main];
                } else {
                    $body.addClass('with-fui-top');
                    needUpdateTopArr = [$left, $main, $right];
                }
            } else {
                needUpdateTopArr = [];
            }
            if (hasBottom) {
                if ($bottom.attr('inset') == 'true') {
                    bottomInset = true;
                    $body.addClass('with-fui-bottom-inset');
                    needUpdateBottomArr = [$main];
                } else {
                    $body.addClass('with-fui-bottom');
                    needUpdateBottomArr = [$left, $main, $right];
                }
            } else {
                needUpdateBottomArr = [];
            }

            if ($left.length) {
                $body.addClass('with-fui-left');
                needUpdateLeftArr = [$main];
                if (hasTop && topInset) {
                    needUpdateLeftArr.push($top);
                }
                if (hasBottom && bottomInset) {
                    needUpdateLeftArr.push($bottom);
                }
            } else {
                needUpdateLeftArr = [];
            }

            if ($right.length) {
                $body.addClass('with-fui-right');
                needUpdateRightArr = [$main];
                if (hasTop && topInset) {
                    needUpdateRightArr.push($top);
                }
                if (hasBottom && bottomInset) {
                    needUpdateRightArr.push($bottom);
                }
            } else {
                needUpdateRightArr = [];
            }

            // 之前的 fui-right 自动兼容为 fui-main
            if ($main.hasClass('fui-right')) {
                $main.addClass('fui-main');
            }
        }
        /**
         * 插入切换按钮
         */
        function addToggleBtn($container) {
            if (!$container.length) return;
            if ($container.attr('toggle') !== 'false') {
                var $icon = $('<span class="fui-layout-toggle"></span>').appendTo($container);
                $container[0].removeAttribute('toggle');
                if ($container.hasClass('fui-top')) {
                    $icon.addClass('icon-totop');
                }
                if ($container.hasClass('fui-bottom')) {
                    $icon.addClass('icon-tobottom');
                }
                if ($container.hasClass('fui-left')) {
                    $icon.addClass('icon-toleft');
                }
                if ($container.hasClass('fui-rightbar')) {
                    $icon.addClass('icon-toright');
                }
            }
        }

        function initTopEvent() {
            if (!$top.length) return;

            var defaultClose = $top.attr('closed') == 'true';
            $top.off('click' + EVENT_NAMESPACE, '.fui-layout-toggle').on('click' + EVENT_NAMESPACE, '.fui-layout-toggle', function() {
                if (isIE8) {
                }
                var toClose = !$top.hasClass('closed');
                if (toClose) {
                    $top.addClass('closed');
                    updateTop(0);
                } else {
                    $top.removeClass('closed');
                    updateTop($top.data('height') || $top.outerHeight(true));
                }
                layoutInstance.fire('_toggle', {
                    region: 'top',
                    state: toClose ? 'closed' : 'opened'
                });
            });

            if (defaultClose) {
                $top.find('.fui-layout-toggle').trigger('click');
            }

            function updateTop(h) {
                $.each(needUpdateTopArr, function(i, $el) {
                    $el.css('top', h);
                });
            }

            var min_h = parseInt($top.attr('min-height'), 10) || MIN_HEIGHT;
            var max_h = parseInt($top.attr('max-height'), 10);
            // 还原
            var defaultHeight = makeInRange(parseInt($top.attr('default-height'), 10), min_h, max_h);
            var h = getLocalSize('top') || defaultHeight || 0;
            if (h) {
                $top.css('height', h);
                !defaultClose && updateTop(h);
            }
            // 拖拽
            if ($top.attr('resize') === 'false') {
                return;
            }
            $('<div class="fui-layout-resizebar"></div>').appendTo($top);
            var startWidth = 0;
            $top.resizable(
                $.extend({}, defaultResizeOptions, {
                    maxHeight: max_h || getMaxLimit('top'),
                    minHeight: min_h,
                    helper: 'fui-top-resize-helper',
                    handles: {
                        s: '.fui-top > .fui-layout-resizebar'
                    },
                    start: function(ev, ui) {
                        $body.addClass('row-resizing');
                        startWidth = $top.outerWidth(true);
                    },
                    resize: function(ev, ui) {
                        ui.helper.css('width', startWidth);
                    },
                    stop: function(ev, ui) {
                        $body.removeClass('row-resizing');
                        // console.log('stop', ev, ui);
                        var h = Math.round(ui.size.height);
                        $top.css({
                            width: '',
                            height: h
                        }).data('height', h);
                        updateTop(h);
                        setLocalSize('top', h);
                        afterResize('top');
                    }
                })
            );

            !max_h &&
                $(window).on('resize' + EVENT_NAMESPACE + 'top', function() {
                    $top.resizable('option', 'maxHeight', getMaxLimit('top'));
                });
        }

        function initLeftEvent() {
            if (!$left.length) return;
            var defaultClose = $left.attr('closed') == 'true';
            $left.off('click' + EVENT_NAMESPACE, '.fui-layout-toggle').on('click' + EVENT_NAMESPACE, '.fui-layout-toggle', function() {
                if (isIE8) {
                }
                var toClose = !$left.hasClass('closed');
                if (toClose) {
                    $left.addClass('closed');
                    updateLeft(0);
                } else {
                    $left.removeClass('closed');
                    updateLeft($left.data('width') || $left.outerWidth(true));
                }

                layoutInstance.fire('_toggle', {
                    region: 'left',
                    state: toClose ? 'closed' : 'opened'
                });
            });

            if (defaultClose) {
                $left.find('.fui-layout-toggle').trigger('click');
            }

            function updateLeft(w) {
                $.each(needUpdateLeftArr, function(i, $el) {
                    $el.css('left', w);
                });
            }

            var min_w = parseInt($left.attr('min-width'), 10) || MIN_HEIGHT;
            var max_w = parseInt($left.attr('max-width'), 10);

            // 还原
            var defaultWidth = makeInRange(parseInt($left.attr('default-width'), 10), min_w, max_w);
            var w = getLocalSize('left') || defaultWidth || 0;
            if (w) {
                $left.css('width', w);
                !defaultClose && updateLeft(w);
            }
            // 拖拽
            if ($left.attr('resize') === 'false') {
                return;
            }
            $('<div class="fui-layout-resizebar"></div>').appendTo($left);
            var startHeight = 0;
            $left.resizable(
                $.extend({}, defaultResizeOptions, {
                    maxWidth: max_w || getMaxLimit('left'),
                    minWidth: min_w,
                    helper: 'fui-left-resize-helper',
                    handles: {
                        e: '.fui-left > .fui-layout-resizebar'
                    },
                    start: function(ev, ui) {
                        $body.addClass('col-resizing');
                        startHeight = $left.outerHeight(true);
                    },
                    resize: function(ev, ui) {
                        ui.helper.css('height', startHeight);
                    },
                    stop: function(ev, ui) {
                        $body.removeClass('col-resizing');
                        // console.log('stop', ev, ui);
                        var w = Math.round(ui.size.width);
                        $left
                            .css({
                                width: w,
                                height: ''
                            })
                            .data('width', w);
                        updateLeft(w);
                        setLocalSize('left', w);

                        afterResize('left');
                    }
                })
            );

            !max_w &&
                $(window).on('resize' + EVENT_NAMESPACE + 'left', function() {
                    $left.resizable('option', 'maxWidth', getMaxLimit('left'));
                });
        }

        function initRightEvent() {
            if (!$right.length) return;

            $right.off('click' + EVENT_NAMESPACE, '.fui-layout-toggle').on('click' + EVENT_NAMESPACE, '.fui-layout-toggle', function() {
                if (isIE8) {
                }
                var toClose = !$right.hasClass('closed');
                if (toClose) {
                    $right.addClass('closed');
                    updateRight(0);
                } else {
                    $right.removeClass('closed');
                    updateRight($right.data('width') || $right.outerWidth(true));
                }

                layoutInstance.fire('_toggle', {
                    region: 'rightbar',
                    state: toClose ? 'closed' : 'opened'
                });
            });

            var defaultClose = $right.attr('closed') == 'true';
            if (defaultClose) {
                $right.find('.fui-layout-toggle').trigger('click');
            }

            function updateRight(w) {
                $.each(needUpdateRightArr, function(i, $el) {
                    $el.css('right', w);
                });
            }

            var min_w = parseInt($right.attr('min-width'), 10) || MIN_HEIGHT;
            var max_w = parseInt($right.attr('max-width'), 10);

            // 还原
            var defaultWidth = makeInRange(parseInt($right.attr('default-width'), 10), min_w, max_w);
            var w = getLocalSize('rightbar') || defaultWidth || 0;
            if (w) {
                $right.css('width', w);
                !defaultClose && updateRight(w);
            }

            // 拖拽
            if ($right.attr('resize') === 'false') {
                return;
            }
            $('<div class="fui-layout-resizebar"></div>').appendTo($right);
            var startTop = 0;
            var startBottom = 0;
            var maxLimit = getMaxLimit('rightbar');
            var actualW = 0;
            $right.resizable(
                $.extend({}, defaultResizeOptions, {
                    // maxWidth: getMaxLimit('rightbar'),
                    // minWidth: MIN_WIDTH,
                    helper: 'fui-rightbar-resize-helper',
                    handles: {
                        e: '.fui-rightbar > .fui-layout-resizebar'
                    },
                    start: function(ev, ui) {
                        $body.addClass('col-resizing');
                        maxLimit = max_w || getMaxLimit('rightbar');
                        startTop = parseInt($right.css('top'), 10) || 0;
                        startBottom = parseInt($right.css('bottom'), 10) || 0;
                    },
                    resize: function(ev, ui) {
                        var delta = ui.size.width - ui.originalSize.width;
                        actualW = ui.originalSize.width - delta;
                        actualW = makeInRange(actualW, min_w, maxLimit);
                        ui.helper.css({
                            left: 'auto',
                            right: 0,
                            top: startTop,
                            bottom: startBottom,
                            width: actualW,
                            height: ''
                        });
                    },
                    stop: function(ev, ui) {
                        $body.removeClass('col-resizing');
                        // console.log('stop', ev, ui);
                        $right
                            .css({
                                left: '',
                                width: actualW,
                                height: ''
                            })
                            .data('width', actualW);
                        updateRight(actualW);
                        setLocalSize('rightbar', actualW);

                        afterResize('rightbar');
                    }
                })
            );
        }

        function initBottomEvent() {
            if (!$bottom.length) return;

            $bottom.off('click' + EVENT_NAMESPACE, '.fui-layout-toggle').on('click' + EVENT_NAMESPACE, '.fui-layout-toggle', function() {
                if (isIE8) {
                }
                var toClose = !$bottom.hasClass('closed');
                if (toClose) {
                    $bottom.addClass('closed');
                    updateBottom(0);
                } else {
                    $bottom.removeClass('closed');
                    updateBottom($bottom.data('height') || $bottom.outerHeight(true));
                }
                layoutInstance.fire('_toggle', {
                    region: 'bottom',
                    state: toClose ? 'closed' : 'opened'
                });
            });
            var defaultClose = $bottom.attr('closed') == 'true';
            if (defaultClose) {
                $bottom.find('.fui-layout-toggle').trigger('click');
            }

            function updateBottom(h) {
                $.each(needUpdateBottomArr, function(i, $el) {
                    $el.css('bottom', h);
                });
            }

            var min_h = parseInt($bottom.attr('min-height'), 10) || MIN_HEIGHT;
            var max_h = parseInt($bottom.attr('max-height'), 10);
            // 还原
            var defaultHeight = makeInRange(parseInt($bottom.attr('default-height'), 10), min_h, max_h);
            var h = getLocalSize('bottom') || defaultHeight || 0;
            if (h) {
                $bottom.css('height', h);
                !defaultClose && updateBottom(h);
            }
            // 拖拽
            if ($bottom.attr('resize') === 'false') {
                return;
            }
            $('<div class="fui-layout-resizebar"></div>').appendTo($bottom);
            var startRight = 0;
            var startLeft = 0;
            var maxLimit = getMaxLimit('bottom');
            var actualH = 0;
            $bottom.resizable(
                $.extend({}, defaultResizeOptions, {
                    // maxHeight: getMaxLimit('bottom'),
                    // minHeight: MIN_HEIGHT,
                    helper: 'fui-bottom-resize-helper',
                    handles: {
                        s: '.fui-bottom > .fui-layout-resizebar'
                    },
                    start: function(ev, ui) {
                        $body.addClass('row-resizing');
                        maxLimit = max_h || getMaxLimit('bottom');
                        startRight = parseInt($bottom.css('right'), 10) || 0;
                        startLeft = parseInt($bottom.css('left'), 10) || 0;
                    },
                    resize: function(ev, ui) {
                        var delta = ui.size.height - ui.originalSize.height;
                        actualH = ui.originalSize.height - delta;

                        actualH = makeInRange(actualH, min_h, maxLimit);
                        ui.helper.css({
                            left: startLeft,
                            right: startRight,
                            top: 'auto',
                            bottom: 0,
                            width: '',
                            height: actualH
                        });
                    },
                    stop: function(ev, ui) {
                        $body.removeClass('row-resizing');
                        $bottom
                            .css({
                                top: '',
                                width: '',
                                height: actualH
                            })
                            .data('height', actualH);
                        updateBottom(actualH);
                        setLocalSize('bottom', actualH);
                        afterResize('bottom');
                    }
                })
            );
        }
    }

    /**
     * 获取本地存储的宽/高度
     */
    function getLocalSize(type) {
        var saveKey = 'FRAME_LAYOUT_SIZE_' + type + '-' + location.pathname;

        var localSize = parseInt(localStorage.getItem(saveKey), 10);
        if (type == 'top' || type == 'bottom') {
            if (localSize < MIN_HEIGHT) return MIN_HEIGHT;
            var max = getMaxLimit(type);
            if (localSize > max) return max;
            return localSize;
        } else if (type == 'left' || type == 'rightbar') {
            if (localSize < MIN_WIDTH) return MIN_WIDTH;
            var maxW = getMaxLimit(type);
            if (localSize > maxW) return maxW;
            return localSize;
        }
        return 0;
    }

    function setLocalSize(type, value) {
        var saveKey = 'FRAME_LAYOUT_SIZE_' + type + '-' + location.pathname;

        localStorage.setItem(saveKey, value);
    }

    /**
     * 四舍五入取整 10
     * @param {number} num
     */
    function roundToD(num) {
        return Math.round(num / 10) * 10;
    }
    function makeInRange(num, min, max) {
        if (!$.isNumeric(num)) return NaN;
        if ($.isNumeric(min) && num < min) return min;
        if ($.isNumeric(max) && num > max) return max;

        return num;
    }

    function getMaxLimit(type) {
        if (type == 'left' || type == 'rightbar') {
            // 最大限制宽度 取窗口的40%
            var w = window.innerWidth;
            var lw = roundToD(w * 0.4);
            return lw < MIN_WIDTH ? MIN_WIDTH : lw;
        }
        if (type == 'top' || type == 'bottom') {
            // 最大限制高度 取窗口的30%
            var h = window.innerHeight;
            var lh = Math.round(h * 0.3);
            return lh < MIN_HEIGHT ? MIN_HEIGHT : lh;
        }
    }

    function parseView($el) {
        if (!$el.length) return;
        var $hd = $el.find('> [role="head"]'),
            title = $hd.attr('title');

        var $bd = $el.find('> [role="body"]');
        var type = $el.hasClass('fui-left') ? 'left' : 'rightbar';
        if ($hd.length) {
            $hd.addClass('fui-' + type + '-hd')
                .append(getTitleHtml(title, type))
                .removeAttr('role');
        }

        if ($bd.length) {
            $bd.addClass('fui-' + type + '-bd').removeAttr('role');
        }
    }

    function getTitleHtml(title, type) {
        return title ? '<h4 class="fui-' + type + '-title">' + title + '</h4>' : '';
    }

    //
    function autoAdjustLeft() {
        var $children = $('.fui-left > *, .fui-left > .fui-left-bd > *');
        $children.each(function(i, el) {
            var ctr = mini.getAndCreate(el);
            ctr && ctr.doLayout && ctr.doLayout();
        });
    }

    function adjustGrid() {
        win.Util._layoutDatagridInContent && Util._layoutDatagridInContent();
    }

    // 事件 hook
    // resize 之后尺寸变化完成
    layoutInstance.on('afterResize', function(e) {
        // var region = e.data.region;
        $(window).trigger('resize');
        adjustGrid();

        // 还是不要做了 覆盖不全 还会被当bug 框架不该做太多事情
        // if (region != 'rightbar') {
        //     // 左侧 一般为树 尝试调整 layout 只要不是右侧 都可能影响左侧
        //     autoAdjustLeft();
        // }
        // // 全部调整 都影响 content
    });

    var toggleTimerMap = {};
    function afterToggle(type, data) {
        if (isIE8 || isIE9) {
            layoutInstance.fire('toggle' + type, data);
            layoutInstance.fire('toggle', data);
            return;
        }
        clearTimeout(toggleTimerMap[type]);
        toggleTimerMap[type] = setTimeout(function() {
            layoutInstance.fire('toggle' + type, data);
            layoutInstance.fire('toggle', data);
        }, 200);
    }

    // 切换
    layoutInstance.on('_toggle', function(e) {
        var data = e.data;
        var type = data.region;

        afterToggle(type, data);
    });
    layoutInstance.on('toggle', function(e) {
        var data = e.data;
        var region = data.region;
        if (region == 'left') {
            Util.leftRight.onToggle();
        }
        win.adjustContentHeight && win.adjustContentHeight();
        adjustGrid();
        layoutInstance.onToggle(region, data.state);
    });

    // 对外处理
    $.extend(layoutInstance, {
        parse: parse
    });
    Util.layoutInstance = layoutInstance;
    if (!Util.leftRight) {
        Util.leftRight = {};
    }
    if (!Util.leftRight.onToggle) {
        Util.leftRight.onToggle = Util.noop;
    }
    if (!Util.leftRight.parse) {
        Util.leftRight.parse = parse;
    }
    // auto parse
    // $(function() {
        parse();
    // });
})(this, this.jQuery);

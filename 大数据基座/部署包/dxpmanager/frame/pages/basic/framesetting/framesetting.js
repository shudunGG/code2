(function(win, $) {
    var $tabsHead = $('#tabs-header');
    var $tabsBody = $('.tabs-wrap[data-group="' + $tabsHead.data('group') + '"]');
})(this, this.jQuery);

(function(win, $) {
    var navIdPrefix = 'frame-config-nav-';
    var cfgIdPrefix = 'frame-config-item-';
    var $tabsHead = $('#tabs-header');
    var $tabsBody = $('.tabs-wrap[data-group="' + $tabsHead.data('group') + '"]');
    var $tabItems = $tabsHead.find('>.tab-item');
    var activeIndex = $tabItems.filter('.active').index();

    function activeTab(tid) {
        $tabsHead
            .find('>.tab-item[data-target="' + tid + '"]')
            .addClass('active')
            .siblings()
            .removeClass('active');
        $tabsBody
            .find('>.tab-body[data-id="' + tid + '"]')
            .removeClass('hidden')
            .siblings()
            .addClass('hidden');
    }
    function activeByIndex(idx) {
        if (idx === -1 || idx === undefined) idx = 0;
        activeTab(
            $tabsHead
                .find('>.tab-item')
                .eq(idx)
                .data('target')
        );
    }
    activeByIndex(activeIndex);

    $tabsHead.on('click', '.tab-item', function() {
        activeTab($(this).data('target'));
    });
    // var $nav = $('#config-nav');
    // var $content = $('#config-content');
    var miniSearchInput = mini.get('search-input');

    var NAV_ITEM_TPL = '<div class="category-nav-item" data-tab="{{tabId}}" data-target="{{id}}">{{name}}</div>';

    if ($.type(Util.debounce) != 'function') {
        /**
         * debounce 大于间隔时间时才触发
         * 连续触发时，仅当时间间隔大于指定时间才触发
         *
         * @param {function} fn 要处理的函数
         * @param {number} delay 间隔时间 单位 ms
         * @param {[object]} ctx 要绑定的上下文
         * @returns debounce 后的新函数
         */
        Util.debounce = function debounce(fn, delay, ctx) {
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

    var ConfigManager = {
        activeTab: activeTab,
        _data: null,
        getData: function getData() {
            var tabsData = [];
            var searchArr = [];
            $tabsBody.find('>.tab-body').each(function(i, item) {
                var $tb = $(item);
                var tabId = $tb.data('id');
                var $content = $tb.find('>.config-content');
                var navArr = [];
                $content.find('.fui-block').each(function(i, block) {
                    var $block = $(block);
                    var name = $block.find('.fui-block-hd').text();
                    var navIndex = i + 1;
                    var id = navIdPrefix + navIndex;

                    $block.data('id', id).attr('data-id', id);
                    $block.data('tab', tabId).attr('data-tab', tabId);

                    // 导航数据
                    var blockData = {
                        tabId: tabId,
                        id: id,
                        name: name,
                        items: [],
                        isNav: true
                    };

                    // 内部配置
                    $block.find('.fui-block-bd .form-row').each(function(j, row) {
                        var $row = $(row);
                        var label = $row.find('>.form-label').text();
                        var itemId = cfgIdPrefix + navIndex + '-' + (j + 1);
                        $row.data('id', itemId).attr('data-id', itemId);

                        if (label[label.length - 1] == '：') {
                            label = label.substring(0, label.length - 1);
                        }
                        var itemData = {
                            tabId: tabId,
                            navId: id,
                            id: itemId,
                            name: label
                        };
                        blockData.items.push(itemData);
                        searchArr.push(itemData);
                    });

                    navArr.push(blockData);
                    searchArr.push(blockData);
                });
                tabsData.push({
                    tabId: tabId,
                    navArr: navArr
                });
            });

            searchArr.sort(function(a, b) {
                // 都是或都不是分类 则位置不变
                if (a.isNav === b.isNav) {
                    return 0;
                }
                // 是分类的放前面
                return a.isNav ? -1 : 1;
            });

            $.each(searchArr, function(i, item) {
                item.uid = 'item-' + (i + 1);
            });

            this._data = tabsData;
            this._searchArr = searchArr;

            miniSearchInput.setData(searchArr);
        },
        buildNav: function buildNav(forceUpdate) {
            if (forceUpdate || !this._data || !this._data.length) {
                this.getData();
            }
            // 按照 tab 分组
            // var tabDataMap = {};
            // $.each()
            $(this._data).each(function(i, tabData) {
                var tabId = tabData.tabId;
                var $nav = $tabsBody.find('>.tab-body[data-id=' + tabId + '] > .category-nav');

                $(
                    $.map(tabData.navArr, function(nav) {
                        return Mustache.render(NAV_ITEM_TPL, nav);
                    }).join('')
                ).appendTo($nav.empty());
            });
            var activeTab = $tabsHead.find('>.tab-item.active').data('target');

            $tabsBody
                .find('> .tab-body[data-id="' + activeTab + '"] > .category-nav')
                .children(':eq(0)')
                .trigger('click');
            // $(
            //     $.map(this._data, function(nav) {
            //         return Mustache.render(NAV_ITEM_TPL, nav);
            //     }).join('')
            // ).appendTo($nav.empty());
            // $nav.children(':eq(0)').trigger('click');
            Util.hidePageLoading();
        },
        initEvent: function() {
            var that = this;
            $tabsBody.on('click', '.category-nav-item', function() {
                $(this)
                    .addClass('active')
                    .siblings()
                    .removeClass('active');
                that.scrollTo($(this).data('tab'), $(this).data('target'), true);
            });
            // 滚动时 同步 左侧导航高亮
            $tabsBody.find('.tab-body > .config-content').on(
                'scroll',
                Util.debounce(function() {
                    var $content = $(this);
                    // 获取每个布局块的位置信息 去高度偏移最小的即为高亮展示的
                    var offsetTopArr = $.map($content.find('.fui-block'), function(block) {
                        return { top: Math.abs($(block).position().top), id: block.getAttribute('data-id') };
                    });
                    offsetTopArr.sort(function(a, b) {
                        if (a.top === b.top) return 0;
                        return a.top < b.top ? -1 : 1;
                    });
                    var nearId = offsetTopArr[0].id;
                    var $hightNav = $('[data-target="' + nearId + '"]');
                    if (!$hightNav.hasClass('active')) {
                        $hightNav
                            .addClass('active')
                            .siblings()
                            .removeClass('active');
                    }
                }, 50)
            );
            // 重写 autocomplete 的 加载和无结果样式
            miniSearchInput.setPopupEmptyText('<div class="search-no-result"><span></span>无结果</div>');
            miniSearchInput.getPopupLoadingHtml = function() {
                return '<div class="search-loading"><span></span>搜索中</div>';
            };
            var doScroll = Util.debounce(function(itemData) {
                if (!itemData || !itemData.id) return;

                that.scrollTo(itemData.tabId, itemData.id, itemData.isNav);
            }, 10);
            // enter 必定会触发 valuechanged 而 重新点击和上次一样的则不会 分开节流处理
            miniSearchInput.on('valuechanged', function(ev) {
                doScroll(ev.selected);
            });
            miniSearchInput.on('enter', function(ev) {
                miniSearchInput.doValueChanged();
            });
            miniSearchInput._listbox.on('itemclick', function(ev) {
                doScroll(ev.item);
            });
        },
        _scrollTo: (function() {
            var pid = null;
            return function _scrollTo($content, $target, callback) {
                var s = $content.scrollTop();
                var e = $target.position().top + s;
                if (s == e) return;

                pid && easeOut.cancel(pid);

                pid = easeOut(s, e - 4, 4, function(v, isEnd) {
                    $content.scrollTop(v);
                    isEnd && callback && callback();
                });
            };
        })(),
        scrollTo: function(tabId, id, isNav) {
            var tabSelector = '.tab-body[data-id="' + tabId + '"]';
            var idSelector = '[data-id="' + id + '"]';

            var $tab = $(tabSelector, $tabsBody);
            var $content = $tab.find('>.config-content');

            var $target = isNav ? $('.fui-block' + idSelector, $content) : $('.form-row' + idSelector, $content);

            if (!$target || !$target.length) {
                return console.warn('不存在指定的的配置项');
            }
            // 先切换tab
            this.activeTab(tabId);

            var that = this;
            this._scrollTo($content, $target, function() {
                that.highlight($target);
            });
        },
        highlight: (function() {
            var $lastEl = null;
            // 优先使用 css 动画
            if (Util.browsers.isSupportAnimation) {
                return function highlight($target) {
                    // 结束上一个动画
                    if ($lastEl) {
                        $lastEl.removeClass('highlight');
                        $target.off(Util.browsers.animationend, clear);
                    }

                    $lastEl = $target;
                    $target.one(Util.browsers.animationend, clear);
                    $target.addClass('highlight');

                    function clear(ev) {
                        if (ev.target == this) {
                            $target.removeClass('highlight');
                        }
                    }
                };
            }

            // 不支持的情况 降级为jq动画
            return function highlight($target) {
                if ($lastEl) {
                    $lastEl
                        .stop(true)
                        .clearQueue('highlight')
                        .animate(
                            {
                                opacity: 1,
                                border: 'none'
                            },
                            200
                        );
                }
                var dark = function() {
                        $target.animate(
                            {
                                opacity: 0.6,
                                border: '1px solid #ddd'
                            },
                            200,
                            next
                        );
                    },
                    light = function() {
                        $target.animate(
                            {
                                opacity: 1
                            },
                            200,
                            next
                        );
                    },
                    next = function() {
                        var n = $target.queue('highlight');

                        if (!n.length) {
                            $target.clearQueue('highlight');
                        } else {
                            $target.dequeue('highlight');
                        }
                    };

                $lastEl = $target.stop(true).queue('highlight', [dark, light, dark, light, dark, light]);

                next();
            };
        })(),
        init: function() {
            this.initEvent();
            this.buildNav();
        },
        search: function(kw) {
            if (!kw) {
                return [];
            }
            if (!this._data || !this._data.length) {
                this.getData();
            }

            var res = [];
            var reg = new RegExp(kw, 'i');

            $.each(this._searchArr, function(i, item) {
                if (reg.test(item.name)) {
                    res.push({
                        tabId: item.tabId,
                        id: item.id,
                        name: item.name,
                        isNav: true,
                        ssss: 1111111
                    });
                }
            });

            // $.each(this._data, function(i, nav) {
            //     if (reg.test(nav.name)) {
            //         res.push({
            //             id: nav.id,
            //             name: nav.name,
            //             isNav: true
            //         });
            //     }
            //     if (!nav.items) return;

            //     $.each(nav.items, function(j, item) {
            //         if (reg.test(item.name)) {
            //             res.push({
            //                 id: item.id,
            //                 name: item.name
            //             });
            //         }
            //     });
            // });

            res.sort(function(a, b) {
                // 都是或都不是分类 则位置不变
                if (a.isNav === b.isNav) {
                    return 0;
                }
                // 是分类的放前面
                return a.isNav ? -1 : 1;
            });
            return res;
        }
    };

    win.ConfigManager = ConfigManager;

    var requestAnimationFrame =
        win.requestAnimationFrame ||
        win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame ||
        win.oRequestAnimationFrame ||
        function(fn) {
            return setTimeout(fn, 17);
        };
    var cancelAnimationFrame =
        win.cancelAnimationFrame ||
        win.webkitCancelAnimationFrame ||
        win.mozCancelAnimationFrame ||
        win.oCancelAnimationFrame ||
        function(id) {
            return clearTimeout(id);
        };
    function easeOut(start, end, rate, callback) {
        var _end = end;
        if (start == end || typeof start != 'number') {
            return callback(end, true);
        }
        end = end || 0;
        rate = rate || 2;

        var id;
        var step = function() {
            start = start + (end - start) / rate;
            if (Math.abs(start - _end) < 1) {
                callback(end, true);
                return;
            }
            callback(start, false);
            id = requestAnimationFrame(step);
        };
        step();
        return id;
    }
    // easeOut.cancel = cancelAnimationFrame.bind(window);
    easeOut.cancel = function(id) {
        return cancelAnimationFrame(id);
    };
})(this, this.jQuery);

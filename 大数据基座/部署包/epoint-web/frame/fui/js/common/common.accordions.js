(function (win, $) {
    var $fuiContent = $('.fui-content');
    function Accordion($wrap) {
        this.parse($wrap);
    }
    Accordion.parse = function ($wrap) {
        Util.accordion = new Accordion($wrap);
    };

    $.extend(Accordion.prototype, {
        parse: function ($wrap) {
            if (!$wrap) {
                $wrap = $('.fui-accordions');
            } else {
                $wrap = $($wrap);
            }
            if (!$wrap.length) {
                return;
            }
            this.$accsWrap = $wrap;
            this._accs = this.$accsWrap.find('[role="accordion"]');
            this._parse();
            this._initEvent();
        },
        _parse: function () {
            this.showNav = $fuiContent.length > 0 && this.$accsWrap.attr('showNav');
            if (this.showNav === undefined) {
                this.showNav = Util.getFrameSysParam('showAccordionsNav');
            } else {
                this.showNav = this.showNav === 'true';
            }

            var $accs = this.$accsWrap.find('[role="accordion"]');

            $.each($accs, function (i, acc) {
                var $acc = $(acc),
                    $hd = $acc.find('[role="head"]'),
                    $bd = $acc.find('[role="body"]');
                // 已经处理过了则跳过
                if ($acc.data('accordion')) {
                    return;
                }
                $acc.data('accordion', true);

                var opened = $acc.attr('opened') !== 'false',
                    title = $hd.attr('title');

                $acc.addClass('fui-accordion');
                $hd.addClass('fui-acc-hd');
                $bd.addClass('fui-acc-bd');

                opened ? $acc.addClass('opened') : $acc.addClass('closed');
                opened ? $bd.show() : $bd.hide();

                // 填充head默认内容
                $(getAccHdHtml(i + 1, title)).prependTo($hd);
            });
            if (this.showNav) {
                this._buildNav();
            } else {
                this.$accsWrap.removeClass('.shownav');
                $('.fui-acc-return').remove();
                $('.fui-acc-menu').remove();
            }
        },
        _buildNav: function () {
            var $accs = this.$accsWrap.find('[role="accordion"]'),
                navHtml = [];
            var that = this;
            $.each($accs, function (i, acc) {
                var $acc = $(acc),
                    $hd = $acc.find('[role="head"]');

                var title = $hd.attr('title');

                var id;
                // 配置个性化的手风琴 且 没有配置showNav
                if (that.showNav) {
                    id = acc.id ? acc.id : (acc.id = 'accordion_' + i);

                    navHtml.push(getNavItemHtml(id, title));
                }
            });
            this.$accNav = $('.fui-acc-menu');
            var oldActiveIndex = 0;
            if (this.$accNav.length) {
                oldActiveIndex = this.$accNav.find('.acc-menu-item.active').index();
                this.$accNav.remove();
            }
            this.$accNav = $(getNavHtml(navHtml.join('')));
            this.$accNav.appendTo(document.body);
            // 返回顶部按钮
            $('.fui-acc-return').remove();
            this.$accReturn = $('<div class="fui-acc-return" title="返回顶部" style="display:none;"></div>').appendTo(
                document.body
            );

            this.$accsWrap.addClass('shownav');
            this.$accNav.find('.acc-menu-item').eq(oldActiveIndex).addClass('active');
            this._setNavPos();
            this._adjustNavDisplay();
        },
        _setNavPos: function () {
            if (!this.showNav) {
                return;
            }
            var scrollContainerWidth = $fuiContent.width(),
                accWrapWidth = this.$accsWrap.outerWidth();

            var right = (scrollContainerWidth - accWrapWidth) / 2;

            // 避免导航区域遮住滚动条
            if (right < 17) {
                right = 17;
            }

            this.$accNav.css('right', right);
            this.$accNav.css('top', this.$accsWrap[0].offsetTop);

            this.$accReturn.css('right', right);
        },
        _adjustNavDisplay: function () {
            if (!this.showNav) {
                return;
            }
            var len = this.$accsWrap.find('[role="accordion"]').filter(function (i, el) {
                return !$(el).hasClass('hidden');
            }).length;

            if (len > 2) {
                this.$accsWrap.addClass('shownav');
                this.$accNav.removeClass('hidden');
                this.$accReturn.removeClass('hidden');
            } else {
                this.$accsWrap.removeClass('shownav');
                this.$accNav.addClass('hidden');
                this.$accReturn.addClass('hidden');
            }
        },
        _initEvent: function () {
            var that = this;
            this.$accsWrap.off('click.fui-accordion', '.fui-acc-toggle').on('click.fui-accordion', '.fui-acc-toggle', function () {
                var $el = $(this),
                    $acc = $el.closest('.fui-accordion'),
                    opened = $acc.hasClass('opened'),
                    ontoggle = $acc.attr('ontoggle');

                $acc.toggleClass('closed', opened).toggleClass('opened', !opened);
                $acc.find('>.fui-acc-bd').stop(true)[opened ? 'slideUp' : 'slideDown'](200);

                if (ontoggle && win[ontoggle]) {
                    win[ontoggle](opened ? 'closed' : 'opened');
                }
            });

            var timer;
            // 默认滚动区域为fui-content，滚动时激活对应导航item
            $fuiContent.off('scroll.fui-accordion').on('scroll.fui-accordion', function () {
                var $items = $('.fui-accordion:not(.hidden)'),
                    $navItems = $('.acc-menu-item:not(.hidden)');

                clearTimeout(timer);

                timer = setTimeout(function () {
                    $items.each(function (i, el) {
                        var top = $(el).offset().top;

                        if (top >= 0) {
                            $navItems.eq(i).addClass('active').siblings().removeClass('active');

                            return false;
                        }
                    });
                    var top = $items.eq(0).offset().top;
                    if (that.showNav) {
                        if (top <= -100) {
                            that.$accReturn.show();
                        } else {
                            that.$accReturn.hide();
                        }
                    }
                }, 200);
            });
            $(win)
                .off('resize.fui-accordion')
                .on('resize.fui-accordion', function () {
                    that._setNavPos();
                });

            if (this.showNav) {
                $('body')
                    .off('click.fui-accordion')
                    .on('click.fui-accordion', function (e) {
                        var $target = $(e.target),
                            ref = $target.data('ref');

                        var $scrollEl = $(Util.getFirstScrollEl(that.$accsWrap.find('.fui-accordion')[0]));

                        if ($target.closest(that.$accNav).length) {
                            if ($target.hasClass('acc-nav-trigger')) {
                                that.$accNav.toggleClass('active');
                            } else if ($target.hasClass('acc-menu-item')) {
                                if ($('#' + ref).hasClass('closed')) {
                                    $('#' + ref)
                                        .find('.fui-acc-toggle')
                                        .trigger('click');
                                }
                                scroll($target, $scrollEl);
                            }
                        } else {
                            that.$accNav.removeClass('active');
                        }

                        if ($target.hasClass('fui-acc-return')) {
                            scrollTopTo(0, $scrollEl);
                        }
                    });

                // 重写调整高度的方法，在高度调整时，需要同时调整导航的位置
                var _adjustHeight = win.adjustContentHeight;
                win.adjustContentHeight = function () {
                    _adjustHeight();
                    that._setNavPos();
                };
            }
        },
        _accTpl:
            '<div role="accordion" class="fui-accordion {{status}}"><div class="fui-acc-hd" role="head" title="{{title}}"><span class="fui-acc-order">{{order}}</span><i class="fui-acc-toggle"></i><h4 class="fui-acc-title">{{title}}</h4></div><div class="fui-acc-bd" role="body"><iframe frameborder="0" width="100%" height="{{contentHeight}}" src="{{url}}"></iframe></div></div>',
        // 显示手风琴项
        showItem: function (index) {
            var $acc = this._accs.eq(index);

            if ($acc.length && $acc.hasClass('hidden')) {
                $acc.removeClass('hidden');
                this._updateOrders();
            }

            if (this.showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length && $navItem.hasClass('hidden')) {
                    $navItem.removeClass('hidden');
                }
                this._adjustNavDisplay();
                $fuiContent.trigger('scroll');
            }
        }, // 隐藏手风琴项
        hideItem: function (index) {
            var $acc = this._accs.eq(index);

            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.addClass('hidden');
                this._updateOrders();
            }
            if (this.showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length && !$navItem.hasClass('hidden')) {
                    $navItem.addClass('hidden');
                }

                this._adjustNavDisplay();
                $fuiContent.trigger('scroll');
            }
        },
        hideNav: function () {
            if (this.showNav) {
                this.showNav = false;
                this.$accNav.addClass('hidden');
                this.$accReturn.addClass('hidden');
                this.$accsWrap.removeClass('shownav');
            }
        },

        // 展开手风琴
        expandItem: function (index) {
            var $acc = this._accs.eq(index);
            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.removeClass('closed').addClass('opened');
                $acc.find('>.fui-acc-bd').stop(true).slideDown(200);
            }
        },
        // 收起手风琴
        collapseItem: function (index) {
            var $acc = this._accs.eq(index);
            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.removeClass('opened').addClass('closed');
                $acc.find('>.fui-acc-bd').stop(true).slideUp(200);
            }
        },

        // 设置手风琴标题
        setTitle: function (title, index) {
            var $acc = this._accs.eq(index);
            if ($acc.length) {
                var $header = $acc.find('[role="head"]').attr('title', title);

                $header.find('.fui-acc-title').html(title);
            }

            if (this.showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length) {
                    $navItem.html(title).attr('title', title);
                }
            }
        },

        // 动态添加手风琴项
        addItem: function (title, url, opened, contentHeight) {
            var html = Mustache.render(this._accTpl, {
                title: title,
                url: url,
                status: opened ? 'opened' : 'closed',
                contentHeight: contentHeight || '100%'
            });

            $(html).appendTo(this.$accsWrap).data('accordion', true);

            this._accs = this.$accsWrap.find('[role="accordion"]');

            this._updateOrders();

            if (this.showNav) {
                var index = this._accs.length - 1,
                    acc = this._accs[index],
                    id = acc.id ? acc.id : (acc.id = 'accordion_' + index);
                html = getNavItemHtml(id, title);

                $(html).appendTo(this.$accNav.find('.acc-menu-list'));

                this._accNavs = this.$accNav.find('.acc-menu-item');

                this._adjustNavDisplay();
            }
        },
        /**
         * 通过未解析的html新增手风琴项
         * @param {HTMLString} html html字符串如：
         * <div role="accordion" opened="false">
                <div role="head" title="手风琴标题2"></div>
                <div role="body"><div style="height:600px"></div></div>
            </div>
         * @param {number} index 插入到哪个位置 下标位置
         * @param {string} pos 'before' 或 'after'
         * @returns
         */
        addItemHtml: function (html, index, pos) {

            if (arguments.length === 0) return;

            var $item;
            if (arguments.length === 1) {
                $item = $(html).appendTo(this.$accsWrap);
            } else {
                if (pos === 'before') {
                    $item = $(html).insertBefore(this.$accsWrap.find('[role="accordion"]').eq(index));
                } else {
                    $item = $(html).insertAfter(this.$accsWrap.find('[role="accordion"]').eq(index));
                }
            }

            // 重新解析
            Accordion.parse(this.$accsWrap);
            try {
                mini.parse($item[0]);
                $item = null;
            } catch (error) {}
        },

        // 显示|隐藏后需要更新下序号
        _updateOrders: function () {
            var order = 0;

            $.each(this._accs, function (i, acc) {
                var $acc = $(acc),
                    $order = $acc.find('.fui-acc-order');

                if (!$acc.hasClass('hidden')) {
                    $order.html(getOrder(++order));
                }
            });
        },

        _getAccNavs: function () {
            if (!this._accNavs) {
                this._accNavs = this.$accNav ? this.$accNav.find('.acc-menu-item') : undefined;
            }

            return this._accNavs;
        }
    });

    function getOrder(order) {
        if (order < 10) {
            order = '0' + order;
        }
        return order;
    }
    function getAccHdHtml(order, title) {
        var html = [];

        html.push('<span class="fui-acc-order">' + getOrder(order) + '</span>');
        html.push('<i class="fui-acc-toggle"></i>');
        html.push('<h4 class="fui-acc-title">' + title + '</h4>');

        return html.join('');
    }

    function getNavItemHtml(id, title) {
        return '<li class="acc-menu-item" data-ref="' + id + '" title="' + title + '">' + title + '</li>';
    }

    function getNavHtml(itemHtml) {
        var html = [];

        html.push('<div class="fui-acc-menu">');
        html.push('<ul class="acc-menu-list">');
        html.push(itemHtml);
        html.push('</ul>');
        html.push('</div>');

        return html.join('');
    }

    function scroll(el, $scrollEl) {
        var id = el.data('ref'),
            $accItem = $('#' + id);

        if ($scrollEl && $scrollEl.length) {
            // 解决滚动区域不具有定位属性时，计算offsetTop值不准确问题
            var _opos = $scrollEl[0].style.position;
            $scrollEl[0].style.position = 'relative';
            scrollTopTo($accItem[0].offsetTop, $scrollEl);
            $scrollEl[0].style.position = _opos;
        }

        el.addClass('active').siblings().removeClass('active');
    }

    var scrollTopTo = Util.browsers.isIE
        ? function (scrollTop, $scrollEl) {
              $scrollEl.stop(true).animate(
                  {
                      scrollTop: scrollTop
                  },
                  500
              );
          }
        : function (scrollTop, $scrollEl) {
              $scrollEl[0].scrollTop = scrollTop;
          };

    var $accsWrap = $('.fui-accordions');
    if ($accsWrap.length) {
        Util.accordion = new Accordion($accsWrap);
    } else {
        Util.accordion = {
            parse: Accordion.parse
        };
    }
})(this, jQuery);

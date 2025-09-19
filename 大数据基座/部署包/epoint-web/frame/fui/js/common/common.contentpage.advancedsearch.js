/*!
 * 高级搜索布局
 */
(function (win, $) {
    var $condition = $('.fui-search'),
        $toolbar = $('.fui-toolbar:eq(0)'),
        $notice = $('.fui-notice'),
        $content = $('.fui-content'),
        $toolbarbottom = $('.fui-toolbar-bottom'),
        type = $condition.data('type');

    if (!$condition.length) return;
    if (!$toolbar.length) return;

    // 是否默认为展开
    var opened = $condition.attr('opened') == 'true' ? true : false;

    // 创建trigger 和遮罩
    var $trigger,
        $cover,
        // 关联控件的id
        primaryId,
        // 工具栏上的输入框
        toolbarSearch;

    // opeded无需trigger 无需遮罩
    if (!opened) {
        $trigger = $('<i></i>', {
            'data-status': 'close'
        }).addClass('fui-search-trigger r');
        // OA 个性化了高级搜索触发按钮样式
        if(type) {
            $trigger.addClass(type);
        }
        // right
        var $floatRight = $toolbar.find('.r');
        if ($floatRight.length) {
            if ($floatRight.eq(0).hasClass('fui-toolbar-helper')) {
                $floatRight.eq(0).after($trigger);
            } else {
                $floatRight.eq(0).before($trigger);
            }
        } else {
            $trigger.appendTo($toolbar);
        }

        $cover = $('<div class="fui-search-cover hidden"></div>');
        $content.css('position', 'relative').append($cover);

        // 工具栏插入一个输入框 
        var insertInput = function () {
            primaryId = $condition[0].getAttribute('primaryControl');
            if (!primaryId) return;

            var connectedControl = mini.get(primaryId);

            // 没有或者类型不是textbox时不响应
            if (!connectedControl || connectedControl.type !== 'textbox') return;

            var width = $condition[0].getAttribute('primaryWidth');

            $trigger.after('<input type="text" id="toolbar-search-' + primaryId + '" emptyText="' + ((epoint_local.empty_beginning_text || '请输入') + $(connectedControl.el).parent().prev().text().slice(0, -1)) + '" class="mini-buttonedit fui-primary-search r" style="' + (width ? 'width:' + width + 'px' : '') + '">');
            mini.parse($toolbar[0]);

            toolbarSearch = mini.get('toolbar-search-' + primaryId);

            // 给两个控件绑定事件
            toolbarSearch.on('valuechanged', function () {
                var value = this.value;
                connectedControl.setValue(value);
                connectedControl.setText(value);
            });
            connectedControl.on('valuechanged', function (e) {
                var value = e.value;
                toolbarSearch.setValue(value);
                toolbarSearch.setText(value);
            });
            // 回车搜索
            var handleEnterSearch;
            if (Util.browsers.isIE) {
                handleEnterSearch = function () {
                    var activeEl = document.activeElement;
                    activeEl && activeEl.blur();
                    $searchBtn.trigger('click');
                    activeEl && activeEl.focus();
                };
            } else {
                handleEnterSearch = function () {
                    $searchBtn.trigger('click');
                };
            }
            toolbarSearch.on('enter', handleEnterSearch);
            // 点击搜索
            toolbarSearch.on('buttonclick', function (e) {
                $searchBtn.trigger('click');
            });
        };

        // 与 toolbar 区域的普通输入框联动 （OA需求）
        var linkWithToolbar = function() {
            var toolbar_form = $('.fui-toolbar-search', $toolbar)[0],
                controls,
                control;
            if(toolbar_form) {
                controls = mini.getChildControls(toolbar_form);

                for(var i = 0, l = controls.length; i < l; i++) {
                    control = controls[i];
                    if(control.relatedSearchId && control.relatedSearchId !== primaryId) {
                        bindRelationship(control);
                    }
                }
            }
            
        };

        var bindRelationship = function(control) {
            var relatedControl = mini.get(control.relatedSearchId);

            if(relatedControl) {
                // 给两个控件绑定事件
                control.on('valuechanged', function (e) {
                    var value = e.value;
                    relatedControl.setValue(value);
                });
                relatedControl.on('valuechanged', function (e) {
                    var value = e.value;
                    control.setValue(value);
                });
            }
        };

        $(function(){
            insertInput();
            linkWithToolbar();
        });
    }

    // 按钮处理
    var $searchBtn = $condition.find('[role="searcher"]'),
        $resetBtn = $condition.find('[role="reset"]'),
        $closeBtn = $condition.find('[role="close"]');

    var $footer = $('<div class="fui-search-footer"></div>');

    // 按钮文本
    var btnHtml = [];
    btnHtml.push('<span class="fui-search-srh-btn ">' + (win.epoint_search_text || '搜索') + '</span>');
    btnHtml.push('<span class="fui-search-reset-btn ">' + (win.epoint_reset_text || '重置') + '</span>');
    btnHtml.push('<span class="fui-search-close-btn ">' + (win.epoint_close_text || '关闭') + '</span>');

    $searchBtn.length && $(btnHtml[0]).appendTo($searchBtn);
    $resetBtn.length && $(btnHtml[1]).appendTo($resetBtn);
    !opened && $closeBtn.length && $(btnHtml[2]).appendTo($closeBtn);

    btnHtml = null;

    // 按钮插入到页面
    $footer.append($searchBtn)
        .append($resetBtn)
        .append($closeBtn)
        .appendTo($condition);

    // 搜索后的标签列表
    /**
    <div class="fui-search-result hidden clearfix"><span class="l fui-search-desc">已选条件：</span>
        <div class="l fui-search-list-wrap">
            <ul class="fui-search-list  clearfix"> 
                <!-- 此处添加搜索条件 -->
            </ul>
        </div>
        <div class="fui-search-result-btns r">
            <span class="fui-search-l l invisible"></span>
            <span class="fui-search-r l invisible"></span>
            <span class="fui-search-removeall l" title="移除全部"></span>
        </div>
    </div>
    */
    var $searchCondition = $('<div class="fui-search-result hidden clearfix"><span class="l fui-search-desc">' + (epoint_local.selected_text || '已选条件') + '：</span><div class="l fui-search-list-wrap"><ul class="fui-search-list  clearfix"></ul></div><div class="fui-search-result-btns r"><span class="fui-search-l l invisible"></span><span class="fui-search-r l invisible"></span><span class="fui-search-removeall l" title="移除全部"></span></div></div>').appendTo($condition),
        // 标签列表
        $tagListWrap = $searchCondition.find('.fui-search-list-wrap'),
        $tagList = $tagListWrap.find('.fui-search-list'),
        // 左右按钮
        $scrollLeft = $searchCondition.find('.fui-search-l'),
        $scrollRight = $scrollLeft.next();

    // 按钮点击切换方法
    var cilckSwitch = {
        searcher: function () {
            switchStatus('open');
        },
        close: function () {
            switchStatus('open');
        },
        open: function () {
            if ($tagList.children().length) {
                switchStatus('searcher');
            } else {
                switchStatus('close');
            }
        }
    };
    // 切换按钮点击
    !opened && $trigger.on('click', function (e) {
        e.stopPropagation();
        var status = $trigger.data('status');

        cilckSwitch[status]();
    });


    // 缓存三个按钮的回调函数名称
    // 主要是考虑回调中直接写epoint.refresh这样的方法，需要一层一层将其上下文找出，此处缓存可避免每次点击都遍历取出
    // 在第一次点击的时候再去取
    var cbCaChe,
        getCbCaChe = function () {
            var cbNames = {
                    'searcher': $searchBtn.length ? $searchBtn.attr('callback') : '',
                    'reset': $resetBtn.length ? $resetBtn.attr('callback') : '',
                    'close': $closeBtn.length ? $closeBtn.attr('callback') : ''
                },
                cache = {};
            for (var key in cbNames) {
                var names = cbNames[key].split('.');

                var fun = win[names[0]],
                    scope = win;
                var i = 1,
                    len = names.length;

                while (fun && i < len) {
                    scope = fun;
                    fun = fun[names[i]];
                    i++;
                }

                cache[key] = {
                    fun: fun,
                    scope: scope
                };
            }
            return cache;
        };

    // 按钮事件
    $condition.on('click', 'a', function (e) {
        e.stopPropagation();
        var $a = $(this),
            role = $a.attr('role');
        // 取回调并缓存
        if (!cbCaChe) {
            cbCaChe = getCbCaChe();
        }

        // 触发指定的回调
        doCallback(role, e);

        // 按钮应实现的功能
        if (role == 'reset') {
            // 重置值 清空标签 隐藏条目区域
            clearSearch(e);
        } else {
            switchStatus(role);
        }
    });

    // 获取所有控件
    var _$condForm = $condition.find('.fui-form');
    var _getControls = function () {
        if (!_$condForm.length) return [];
        var controls = mini.getChildControls(_$condForm[0]);
        if (controls.length > 1) {
            var prevControl = controls[0];
            for (var i = 1, l = controls.length; i < l; i++) {
                // 当前控件是上一个控件的父控件，说明上一个控件是当前控件的内部控件，去除上一个控件
                if (mini.isAncestor(controls[i].el, prevControl.el)) {
                    controls.splice(i - 1, 1);

                    i--;
                    l--;
                }
                // 上一个控件是当前控件的父控件，说明当前控件是上一个控件的内部控件，去除当前控件
                else if (mini.isAncestor(prevControl.el, controls[i].el)) {
                    controls.splice(i, 1);

                    i--;
                    l--;
                }
                prevControl = controls[i];
            }
        }

        return controls;
    };

    // 重置控件值
    var _resetValue = function () {
        var arr = _getControls();
        for (var i = 0, l = arr.length; i < l; ++i) {
            // 同步修改 隐藏域的值不能被重置
            // cause：项目管理9.3功能测试bug 后台管理-组织架构-用户管理：先选择部门，然后通过检索弹出界面的字段进行检索，检索后页面中显示部门guid检索条件。
            // modify by chendongshun at 2017.05.22
            if (arr[i].type == 'hidden') continue;

            // checkbox的setText方法是用来设置label的，不能清空
            arr[i].setText && arr[i]._clearText !== false && arr[i].setText('');
            arr[i].setValue('');

            arr[i].doValueChanged && arr[i].doValueChanged();

            // // 需要同步清除toolbar上的
            // if (arr[i].id == primaryId) {
            //     if (toolbarSearch) {
            //         toolbarSearch.setValue('');
            //         toolbarSearch.setText('');
            //     }
            // }
        }
    };

    // 清空搜索
    var clearSearch = function(e) {
        _resetValue();
        $tagList.empty();
        $searchCondition.addClass('hidden');

        // 重新搜索
        var cb = cbCaChe && cbCaChe.searcher;
        if (cb && typeof cb.fun == 'function') {
            cb.fun.call(cb.scope, e);
        }
        _isSearch = false;
    };
    var _isSearch = false;
    // 触发指定的回调
    var doCallback = function(role, e) {
        var cb = cbCaChe[role];
        if (cb && typeof cb.fun == 'function') {
            cb.fun.call(cb.scope, e);
        }
    };
    var TAG_TPL = '<li class="fui-search-item l"><span class="fui-search-item-text l" title="{{text}}">{{text}}</span><span class="fui-search-item-remove l" title="移除" {{#value}} data-value="{{value}}" {{/value}} data-id="{{id}}"></span></li>';
    // 渲染标签
    var _renderTag = function (obj) {
        return Mustache.render(TAG_TPL, obj);
    };

    // 渲染标签
    var renderTags = function () {
        // 记录是否有值，无值则不需要渲染标签
        var hasValue = false;
        var controls = _getControls();
        var html = [];
        for (var i = 0, l = controls.length; i < l; i++) {
            var control = controls[i];

            // 隐藏域不用渲染出来
            // cause：项目管理9.3功能测试bug 后台管理-组织架构-用户管理：先选择部门，然后通过检索弹出界面的字段进行检索，检索后页面中显示部门guid检索条件。
            // modify by chendongshun at 2017.05.22
            if (control.type == 'hidden') continue;

            var text = control.getText ? control.getText() : control.getValue();


            // 单个的checkbox text一直有值，不能直接渲染 需要进一步判断
            text = control._clearText !== false ? text : (control.checked ? text : '');

            if (!text) {
                continue;
            } else {
                hasValue = true;
            }
            // 新增关于checkboxlist显示为多值的处理
            if (control.type == 'checkboxlist') {
                var values = control.getValue().split(',');

                text = text.split(',');
                for (var j = 0, len = values.length; j < len; ++j) {
                    html.push(_renderTag({
                        value: values[j],
                        text: text[j],
                        id: control.id
                    }));
                }
            } else {
                html.push(_renderTag({
                    text: text,
                    id: control.id
                }));
            }
        }
        $tagList.empty();
        hasValue && $(html.join('')).appendTo($tagList);

        return _isSearch = hasValue;
    };

    // 用于checkboxlist的value中移除一个
    var getNewVal = function (oldVal, currVal) {
        // 如果为中间的 去掉多余的"，"
        // 如果为第一个还要去掉最前的","
        // 如果为最后的 替换掉最后的"，"
        return (',' + oldVal + ',').replace(',' + currVal + ',', ',').replace(/^,|,$/g, '');
    };

    // 搜索标签删除按钮点击
    $searchCondition
        .on('click', '.fui-search-item-remove', function (e) {
            var $this = $(this),
                id = $this.data('id');
            // 清空控件值
            if (id) {
                var control = mini.get(id);
                if (!control) return;

                if (control.type == 'checkboxlist') {
                    // checkboxlist 值需要单独处理
                    var oldVal = control.getValue(),
                        currVal = $this.data('value'),
                        // 移除当前值
                        newVal = getNewVal(oldVal, currVal);
                    // 赋值为新值
                    control.setValue(newVal);
                } else {
                    // checkbox的setText方法是用来设置label的，不能清空
                    control.setText && control._clearText !== false && control.setText('');
                    control.setValue('');
                }
                control.doValueChanged && control.doValueChanged();
            }

            // // id为绑定的id 则要清除工具栏上的
            // if (id == primaryId) {
            //     if (toolbarSearch) {
            //         toolbarSearch.setValue('');
            //         toolbarSearch.setText('');
            //     }
            // }
            // 移除元素
            $this.parent('.fui-search-item').remove();

            _adjustWidth();

            // 检查长度
            ($tagList.find('.fui-search-item').length === 0) && (_isSearch = false, switchStatus('close'));

            // 触发搜索的回调
            doCallback('searcher', e);
        })
        // 移除全部
        .on('click', '.fui-search-removeall', function (e) {
            clearSearch(e);
            switchStatus('close');
        })
        // 激活当前
        .on('click', '.fui-search-item', function (e) {
            e.stopPropagation();
            $(this).addClass('active').siblings().removeClass('active');
        });
    // 其他地方点击
    $('body').on('click', function () {
        $tagList.children().removeClass('active');

    }).on('keyup', function (e) {
        // esc 关闭
        var code = e.which;
        // console.log(code);
        code === 27 && switchStatus('close');
    });

    /**
     * 切换表单和标签状态
     * @param {string} type searcher open close 
     */
    var switchStatus = function (type) {
        if (type == 'searcher') {
            // 如果是默认展开 不需要显示标签
            if (opened) return;
            // 搜索则要显示标签
            var hasValue = renderTags();
            if (hasValue) {
                $toolbar.removeClass('searchopen');
                $searchCondition.removeClass('hidden');
                $condition.removeClass('hidden').removeClass('open').addClass('searcher');
                $trigger.data('status', 'searcher').removeClass('close');
                $cover.addClass('hidden');
            } else {
                $toolbar.removeClass('searchopen');
                $condition.addClass('hidden').removeClass('open').removeClass('searcher');
                $trigger.data('status', 'close').removeClass('close');
                $searchCondition.addClass('hidden');
                $cover.addClass('hidden');
            }
            _adjustWidth();
        } else if (type == 'close') {
            if(_isSearch) {
                $condition.removeClass('hidden').removeClass('open').addClass('searcher');
                $searchCondition.removeClass('hidden');
            } else {
                $condition.addClass('hidden').removeClass('open').removeClass('searcher');
                $searchCondition.addClass('hidden');
            }
            
            $toolbar.removeClass('searchopen');
            $trigger.data('status', 'close').removeClass('close');
            $cover.addClass('hidden');
        } else if (type == 'open') {
            $toolbar.addClass('searchopen');
            $condition.removeClass('hidden').removeClass('searcher').addClass('open');
            $trigger.data('status', 'open').addClass('close');
            $searchCondition.addClass('hidden');
            $cover.removeClass('hidden');
        }

        _adjustHeight();

    };


    // 只有非默认打开时 计算和绑定事件
    if (!opened) {
        // 左右侧保留宽度
        var HODE_WIDTH,
            // 一次滚动距离
            SETP_WITH = 100,
            cond_width,
            view_width,
            list_width = 0,
            scroll_width = 0;

        var _calculateWidth = function () {
            if (!$searchCondition.is(':visible')) return;
            if (!HODE_WIDTH) {
                HODE_WIDTH = $searchCondition.find('.fui-search-desc').outerWidth() + $searchCondition.find('.fui-search-result-btns').outerWidth();
            }

            cond_width = $searchCondition.width();

            view_width = cond_width - HODE_WIDTH - 10;

            $tagListWrap.css('width', view_width);

            list_width = 0;
            $tagList.find('.fui-search-item').each(function (i, item) {
                list_width += $(item).outerWidth() + 10;
            });

            scroll_width = (list_width - view_width) >> 0;
        };

        var _adjustWidth = function () {
            _calculateWidth();
            if (scroll_width > 0) {
                $scrollLeft.removeClass('invisible');
                $scrollRight.removeClass('invisible');
                $tagList.animate({
                    marginLeft: -scroll_width
                });
            } else {
                $scrollLeft.addClass('invisible');
                $scrollRight.addClass('invisible');
                $tagList.animate({
                    marginLeft: 0
                });
            }
        };
        $scrollRight.on('click', function () {
            var ml = -parseInt($tagList.css('margin-left')),
                // 最多滚到可滚动距离
                range = Math.min(SETP_WITH, scroll_width - ml);
            if ($tagList.is(':animated') || ml >= scroll_width) {
                return;
            }
            $tagList.animate({
                marginLeft: '-=' + range + 'px'
            });
        });
        $scrollLeft.on('click', function () {
            var ml = -parseInt($tagList.css('margin-left')),
                //  最多滚到0
                range = Math.min(SETP_WITH, ml);
            if ($tagList.is(':animated') || ml < 0) {
                return;
            }
            $tagList.animate({
                marginLeft: '+=' + range + 'px'
            });
        });
        $(win).on('resize', function () {
            _adjustWidth();
        });
    }
    // 
    $(win).off('resize.contentPage').on('resize', function () {
        _adjustHeight();
    });

    // 计算高度 不能直接使用 content区域计算中的方法
    var getHeight = function ($el) {
        var h = 0;

        if ($el.length && !$el.hasClass('hidden') && $el.css('position') != 'absolute') {
            h = $el.outerHeight();
        }
        return h;
    };

    // 切换状态后调整content高度
    var _adjustHeight = function () {
        var win_h = $content.parent().innerHeight() || $(win).height(),

            toolbar_h = getHeight($toolbar),

            condition_h = getHeight($condition),
            notice_h = getHeight($notice),
            toolbarbottom_h = getHeight($toolbarbottom);

        $content.css('height', win_h - toolbar_h - condition_h - notice_h - toolbarbottom_h);

        // content区域高度调整后，调整表格布局
        Util._layoutDatagridInContent();
    };
    // 重写调整高度的方法
    win.adjustContentHeight = _adjustHeight;

    // 默认打开时
    if (opened) {
        $condition.css({
            position: 'relative',
            top: '0',
            'box-shadow': 'none'
        });
        $closeBtn.addClass('hidden');
        $condition.addClass('open');
        $(function () {
            setTimeout(_adjustHeight, 60);
        });
    } else {
        $condition.addClass('hidden');
    }
    Util.advanceSearch = {
        _isHide: false,
        hide: function() {
            if(this._isHide) {
                return;
            }
            if(!opened) {
                $trigger.addClass('hidden');
                toolbarSearch.hide();

                $cover.addClass('hidden');
            }
            $condition.addClass('hidden');
            _isSearch && clearSearch();
            _adjustHeight();
            this._isHide = true;
        },
        show: function() {
            if(!this._isHide) {
                return;
            }
            if(!opened) {
                $trigger.removeClass('hidden');
                toolbarSearch.show();
            } else {
                $condition.removeClass('hidden');
                _adjustHeight();
            }
            this._isHide = false;
        }
    };
}(window, jQuery));
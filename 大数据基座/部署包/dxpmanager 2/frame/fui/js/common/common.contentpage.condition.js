/*!
 * contentpage条件区域condition交互与视图解析
 */
(function (win, $) {
    var $condition = $('.fui-condition');

    if (!$condition.length) return;

    var btnHtml = [];
    // 搜索按钮
    // win.epoint_search_text 用来支撑国际化，暂时配置在miniui的local文件里
    btnHtml.push('<span class="cond-srh-btn-text l">' + (win.epoint_search_text || '搜索') + '</span>');
    // 展开更多条件
    btnHtml.push('<i class="cond-srh-btn-toggle l" title="' + (win.epoint_search_title || '展开更多条件') + '"></i>');

    // var autoHeightFix = function () {
    //     var fixed = $condition.data('fixed');

    //     if (!fixed) {
    //         $condition.css({
    //             height: 'auto',
    //             overflow: 'auto'
    //         }).data('fixed', true);
    //     }
    // };

    var init = function () {
        var $form = $condition.find('.fui-form');

        // 没有查询条件，不予处理
        if (!$form.length) return;

        var $btn = $condition.find('[role="searcher"]'),
            // 搜索回调
            cbName = $btn.attr('callback');

        var $rows = $form.find('.form-row'),
            // 搜索条件行数
            line = $rows.length,
            isMultiLine = (line > 1);

        var $no1stRows = null;

        var toggleCondition = function (opened) {
             // 为解决第一行中放多行checkboxlist控件下面行被遮住问题，初始既是自适应，不用再调整
            // 恢复condition的高度自适应，以便显示更多条件
            // autoHeightFix();

            $no1stRows.toggleClass('hidden', opened);
            $btn.length && $btn.toggleClass('opened', !opened);

            adjustContentHeight();
        };

        // 初始化搜索按钮
        if ($btn.length) {
            $btn.addClass("cond-srh-btn clearfix")
                .removeAttr('role');

            $(btnHtml[0]).appendTo($btn);

            // 缓存回调 不必每次点击都向上查找
            var cbCaChe;

            $btn.on('click', '.cond-srh-btn-text', function (event) {
                if (!cbCaChe) {
                    cbCaChe = (function () {
                        var fun = '',
                            scope;
                        if (cbName) {
                            var names = cbName.split('.');
                            fun = win[names[0]];
                            scope = win;
                            var i = 1,
                                len = names.length;

                            while (fun && i < len) {
                                scope = fun;
                                fun = fun[names[i]];
                                i++;
                            }

                        }
                        return {
                            fun: fun,
                            scope: scope
                        };
                    })();
                }
                // 执行回调
                var fun = cbCaChe.fun,
                    scope = cbCaChe.scope;
                if (fun && typeof fun === 'function') {
                    fun.call(scope, event);
                }
            });

            if (isMultiLine) {
                // 多行条件，搜索按钮增加下拉
                $btn.length && $(btnHtml[1]).appendTo($btn);

                $btn.on('click', '.cond-srh-btn-toggle', function (event) {
                    event.preventDefault();

                    var opened = $btn.hasClass('opened');

                    toggleCondition(opened);
                });
            }
            // 回车搜索
            var handleEnterSearch;
            if (Util.browsers.isIE) {
                // 解决IE下中文输入法先触发了搜索的问题
                handleEnterSearch = function () {
                    var activeEl = document.activeElement;
                    activeEl && activeEl.blur();
                    $btn.find('.cond-srh-btn-text').trigger('click');
                    activeEl && activeEl.focus();
                };
            } else {
                handleEnterSearch = function () {
                    $btn.find('.cond-srh-btn-text').trigger('click');
                };
            }
            $condition.on('keyup', function (e) {
                var keyCode = e.which;
                if (keyCode === 13) handleEnterSearch();
            });
        }

        // 初始化条件行的显示、隐藏
        if (isMultiLine) {
            var isDefaultOpen = $condition.attr('opened') === 'true';
            // 非第一行的条件
            $no1stRows = $rows.filter(function (i) {
                if (i !== 0) {
                    !isDefaultOpen && $rows.eq(i).addClass('hidden');
                    return true;
                }
            });
            if (isDefaultOpen) {
                $condition.removeAttr('opened');
                $(function () {
                    toggleCondition(false);
                });
            }
        }
    };


    Util.condition = {
        // 隐藏下拉按钮
        hideToggleBtn: function () {
            var $toggleBtn = $condition.find('.cond-srh-btn-toggle');

            $toggleBtn.addClass('hidden');
        },
        // 显示下拉按钮
        showToggleBtn: function () {
            var $toggleBtn = $condition.find('.cond-srh-btn-toggle');

            $toggleBtn.removeClass('hidden');
        }
    };

    // 为了给由epoint.form生成的动态表单在生成完fui-form内容之后重新初始化fui-condition区域
    // 主要是为了绑定按钮事件
    win.initCondition = init;
    init();

}(this, jQuery));
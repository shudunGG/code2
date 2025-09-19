/*!
 * 解析表单布局
 */
(function(win, $) {
    var $forms = $('.fui-form');

    if (!$forms.length) return;

    var isVertical = $forms.data('vertical');

    if (isVertical) {
        $forms.addClass('vertical');
    }

    var getLblHtml = function(label, required) {
        var html = [];

        // 如果label为空，则不需要冒号了
        if (label !== '') {
            label += '：';
        }

        html.push('<label class="form-label');
        if (required) html.push(' required');
        html.push('">' + label + '</label>');

        return html.join('');
    };

    // 解析表单行
    var parseRow = function($row) {
        var $controls = $row.find('[role="control"]'),
            // 2列 = label + control
            cols = $controls.length * 2,
            newsection = $row.data('newsection');

        $row.addClass('form-row');

        if (newsection) {
            $row.addClass('newsection');
        }

        for (var i = 0, len = $controls.length; i < len; i++) {
            parseControl($controls.eq(i), cols);
        }
    };

    // 解析控件容器
    var parseControl = function($control, cols) {
        // 不用jquery attr，算是稍微提高点效率
        var required = $control[0].getAttribute('starred') === 'true',
            label = $control[0].getAttribute('label');

        // 生成label html，label可以不配置
        var lblhtml = getLblHtml(label ? label : '', required);

        // 根据列配置，决定组件容器的跨度
        var span = 0;

        if (cols == 2) {
            span = 5;
        } else if (cols == 4) {
            span = 2;
        } else if (cols == 6) {
            span = 1;
        }

        if (isVertical) {
            span++;
            $control
                .addClass('form-control')
                .addClass('span' + span)
                .prepend(lblhtml)
                // 清理role，防止重复parse
                .removeAttr('role');
        } else {
            $control
                .addClass('form-control')
                .addClass('span' + span)
                .before(lblhtml)
                // 清理role，防止重复parse
                .removeAttr('role');
        }
    };

    var parse = function($form) {
        $form = $form || $forms;

        var $inners = $form.find('[role="form"]'),
            $rows = $form.find('[role="row"]');

        // 先hidden需要解析的forms
        $form.addClass('hidden');

        $inners.addClass('form-inner');

        for (var i = 0, len = $rows.length; i < len; i++) {
            parseRow($rows.eq(i));
        }

        // 清理role，防止重复parse
        $inners.removeAttr('role');
        $rows.removeAttr('role');

        // label-width 支持
        setLabelWidth($form);

        // 解析结束，显示forms
        $form.removeClass('hidden');
    };

    var span2percent = {
        span1: '33.3333%',
        span2: '50%',
        span3: '66.6667%',
        span4: '83.3333%',
        span5: '100%'
    };

    /**
     * 读取 label-width 为 form 设置 label宽度
     * add by chends 
     * @param {jQueryObject} $forms 
     * @returns
     */
    function setLabelWidth($forms) {
        if (!$forms.length) return;
        $.each($forms, function(i, form) {
            var $form = $(form);
            var w = $form.attr('label-width');
            if (!w) return;
            var width = parseInt(w, 10) || 0;
            if (!width) return;
            if (Util.browsers.isIE8) {
                window.console && console.error('您的浏览器不支持label-width的配置');
                return;
            }
            if ($form.hasClass('vertical')) {
                window.console && console.error('vertical 下不支持label-width的配置');
                return;
            }
            $form.find('.form-row').each(function(i, row) {
                var $children = $(row).children();
                $children.each(function(j, span) {
                    var $span = $(span);
                    // label 直接设置
                    if ($span.hasClass('form-label')) {
                        $span.css('width', width);
                        return;
                    }
                    // ctr 则 calc - w
                    if ($span.hasClass('form-control')) {
                        var span_n = (span.className.match(/span\d/) || [])[0];
                        if (!span_n) return;

                        var p = span2percent[span_n];

                        p && $span.css('width', 'calc(' + p + ' - ' + width + 'px)');
                    }
                });
            });
        });
    }

    Util.form = {
        parse: function($form) {
            if (!$form.length) {
                return;
            }
            return parse($form);
        },
        /**
         * 设置表单的label宽度
         *
         * @param {string | number} width 表单label 的宽度 支持数值和xxpx两种形式
         * @param 为哪个表单设置label宽度，支持dom，jq对象等； 省略则应用于全部表格。
         * @returns
         */
        setLabelWidth: function(width, form) {
            var $forms = form ? $(form) : $('.fui-form');
            if (/^\d+(px)?$/.test(width)) {
                $forms.attr('label-width', width);
                setLabelWidth($forms);
            } else {
                window.console && console.error('label宽度配置仅支持数值或 xxpx 的形式');
                return;
            }
        },
        // 根据指定div[role="control"]隐藏表单域
        showField: function(id) {
            var $control = $(id),
                $label = $control.prev(),
                control = getControl($control[0]);

            $control.add($label).removeClass('invisible');

            // 显示时需要将隐藏时的禁用操作还原回来
            if (control && control.originEnabled) {
                control.setEnabled(true);
            }
        },

        // 根据指定div[role="control"]显示表单域
        hideField: function(id) {
            var $control = $(id),
                $label = $control.prev(),
                control = getControl($control[0]);

            $control.add($label).addClass('invisible');

            // mini对于invisible的元素还是会进行验证
            // 为了跳过于invisible的元素验证，需将其禁用
            if (control && control.enabled) {
                control.setEnabled(false);
                control.originEnabled = true;
            }
        },

        // 设置控件前面的label
        setLabel: function(id, label) {
            var $control = $(id),
                $label = $control.prev();

            $control.attr('label', label);
            if (label) {
                label += '：';
            }

            $label.text(label);
        }
    };

    var getControl = function(el) {
        var control = mini.getChildControls(el);

        return control[0];
    };

    parse();
})(this, jQuery);

(function(win, $) {
    var controlResources = epoint.controlResources || {};
    var M = Mustache;
    var getControlHtml = function(options) {
        var type = options.type,
            config = controlResources[type],
            tpl, opt;

        if (config) {
            tpl = config.templ;
            opt = config.options;

            if (tpl) {
                if (opt) {
                    options = $.extend({}, opt, options);
                }
                return M.render(tpl, options);
            }

        }

        console.warn('控件解析失败！未找到该类型的控件模板！options：', options);
        return '';

    };

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

    // 解析控件容器，包括label
    var parseControl = function(options) {
        var lblHtml = getLblHtml(options.label, options.required);
        var controlHtml = getControlHtml(options);
        var span = options.span;

        return lblHtml + '<div class="form-control span' + span + '">' + controlHtml + '</div>';
    };

    var parseRow = function(controls) {
        var html = ['<div class="form-row">'];
        var i = 0,
            l = controls.length;

        for (; i < l; i++) {
            html.push(parseControl(controls[i]));
        }

        html.push('</div>');

        return html.join('');
    };

    var parse = function(data, cols) {
        var html = ['<div class="fui-form"><div class="form-inner">'],
            row = [],
            control;
        var l = data.length,
            i = 0;

        if (cols == 2) {
            while (i < l) {
                control = data[i++];
                control.span = 5;

                row.push(control);

                html.push(parseRow(row));

                row = [];
            }
        } else if (cols == 4) {
            while (i < l) {
                control = data[i++];
                // 双倍宽
                if (control.width == 2) {
                    control.span = 5;

                    row.push(control);

                } else {
                    control.span = 2;

                    row.push(control);

                    control = data[i++];

                    if (control) {
                        // 如果第二个控件是双倍宽，则该行已显示不下，移到下行显示
                        if (control.width == 2) {
                            i--;
                        } else {
                            control.span = 2;

                            row.push(control);
                        }

                    }

                }
                html.push(parseRow(row));

                row = [];
            }
        } else if (cols == 6) {
            while (i < l) {
                // 当前行中已有控件占的列数
                var j = 0;
                while (j < 6) {
                    control = data[i++];
                    if (control) {
                        if (control.width == 2) {
                            // 双倍宽控件占4列
                            j += 4;
                            control.span = 3;
                        } else {
                            // 一个控件占2列
                            j += 2;
                            control.span = 1;
                        }

                        if (j <= 6) {
                            // 还未超出最大列数6，说明可以排在当前行
                            row.push(control);
                        } else {
                            // 超出最大列数，说明当前行已放不下，移到下一行
                            i--;
                        }
                    } else {
                        // 已经没有更多控件，跳出循环
                        break;
                    }
                }

                html.push(parseRow(row));

                row = [];

            }
        }

        html.push('</div></div>');
        return html.join('');
    };

    win.epoint = (function(epoint) {
        var parseForm = function(opt) {
            var data = opt.data || opt,
                cols = opt.cols || 4;

            if (data && data.length) {
                return parse(data, cols);
            } else {
                console.warn('parseForm失败！传递的参数不对！参数为：', opt)
            }
        };


        return jQuery.extend(epoint, {
            parseForm: parseForm
        });
    })(win.epoint || {});

}(this, jQuery));

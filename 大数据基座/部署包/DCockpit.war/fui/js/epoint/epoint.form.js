(function (win, $) {
    var controlResources = epoint.controlResources || {};
    var M = Mustache;
    var getControlHtml = function (options) {
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

    var getLblHtml = function (label, required) {
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
    var parseControl = function (options) {
        var lblHtml = getLblHtml(options.label, options.required);
        var controlHtml = getControlHtml(options);
        var span = options.span;

        return lblHtml + '<div class="form-control span' + span + '">' + controlHtml + '</div>';
    };

    var parseRow = function (controls) {
        var html = ['<div class="form-row">'];
        var i = 0,
            l = controls.length;

        for (; i < l; i++) {
            html.push(parseControl(controls[i]));
        }

        html.push('</div>');

        return html.join('');
    };

    var parse = function (data, cols) {
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

    win.epoint = (function (epoint) {
        var parseForm = function (opt) {
            var data = opt.data || opt,
                cols = opt.cols || 4;

            if (data && data.length) {
                return parse(data, cols);
            } else {
                console.warn('parseForm失败！传递的参数不对！参数为：', opt);
            }
        };


        return jQuery.extend(epoint, {
            parseForm: parseForm
        });
    })(win.epoint || {});

}(this, jQuery));

// 提供自动解析动态表单的功能
(function (win, $) {
    var $dynaForm = $('.dyna-form');
    var requestMapping = (function () {
        var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
        var root = Util.getRootPath();
        return Util.getRightUrl('rest/' + url.substring(root.length, url.lastIndexOf('/')));
    })();

    var init = function () {
        // 页面级action
        var pageAction = epoint.getCache('action');

        var initControl = function(ids){
            var commondto = DtoUtils.getCommonDto(ids, pageAction);
            var callback = epoint.getCache('callback');

            var url = requestMapping + '/' + pageAction + '/page_Load?isCommondto=true';

            // 加上页面地址中的请求参数
            var all = window.location.href,
                i = all.indexOf('?'),
                urlParam = i == -1 ? '' : all.substring(i + 1);

            if (urlParam) {
                url += '&' + urlParam;
            }

            var fields = commondto.getData(true),
                data = [];
            // 去除commonviewdata的值
            fields['_common_hidden_viewdata'].value = '';

            for (i in fields) {
                data.push(fields[i]);
            }

            $.ajax({
                // url在传入前外部已处理
                url: url,
                type: "post",
                dataType: 'json',
                data: {
                    commonDto: mini.encode(data, "yyyy-MM-dd HH:mm:ss").replace(/'/g, '_EpSingleQuotes_')
                },
                statusCode: Util._handleStatusCode(),
                
                success: function (data) {

                    var status = data.status,
                        controls = data.controls,
                        custom = data.custom || '',

                        code = parseInt(status.code),

                        text = status.text || '',
                        url = status.url,
                        tipTxt = (code === 1 || code === 200) ? '成功' : '失败',
                        tipType = (code === 1 || code === 200) ? 'success' : 'danger';

                    //有url，则先跳转
                    if (url) {
                        if (url.indexOf('http') !== 0) {
                            url = Util.getRootPath() + url;
                        }
                        window.location.href = url;
                        return;
                    } else {
                        if (text) {
                            mini.showTips({
                                content: "<b>" + tipTxt + "</b> <br/>" + text,
                                state: tipType,
                                x: 'center',
                                y: 'top',
                                timeout: 3000
                            });
                        }
                    }

                    if ((code === 1 || code === 200)) {

                        controls.length && commondto.setData(controls, custom);

                        if(callback) {
                            callback(custom);
                        }
                        
                    } else {
                        //操作失败
                        text = text ? text : '操作失败';

                        mini.showTips({
                            content: "<b>错误提示</b> <br/>" + text,
                            state: 'danger',
                            x: 'center',
                            y: 'top',
                            timeout: 3000
                        });
                    }


                }
            });

        };
        $dynaForm.each(function (index, item) {
            var $item = $(item),
                action = $item.attr('action'),
                url = requestMapping + '/' + pageAction + '/' + action + '?isCommondto=true',
                id = item.id;

            // 加上页面地址中的请求参数
            var all = window.location.href,
                i = all.indexOf('?'),
                urlParam = i == -1 ? '' : all.substring(i + 1);

            if (urlParam) {
                url += '&' + urlParam;
            }

            if (!id) {
                id = item.id = 'dynaForm-' + Util.uuid();
            }

            Util.ajax({
                url: url
            }).done(function (data) {
                var html = epoint.parseForm(data);
                $item.prepend(html);
                mini.parse(item);

                win.epoint_afterDynaformInit && epoint_afterDynaformInit(item);

                initControl(id);
            });
        });
    };

    // dom ready 时再执行，以便在 initPage 之后可以取到页面 action
    $(init);
}(this, jQuery));

mini.DynaForm = function () {
    mini.DynaForm.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.DynaForm, mini.UserControl, {
    // 定义控件的className
    uiCls: "uc-dynaform",

    mapClass: 'com.epoint.core.dto.component.DynaForm',

    _afterApply: function () {
        // 由于该控件没有模板，所以不需要去加载解析模板
        // this.parseTpl();
    },
    setData: function (data) {
        data = mini.decode(data);
        var formData = data.form,
            controlData = data.control,
            i = 0,
            l, item, control;

        if (formData) {
            this.el.innerHTML = epoint.parseForm(formData);
            this.formEl = this.el.firstChild;

            mini.parse(this.el);
        }

        if (controlData && (l = controlData.length) > 0) {
            for (; i < l; i++) {
                item = controlData[i];
                control = mini.get(item.id);

                if (control) {
                    if (item.data && control.setData) {
                        control.setData(item.data);
                    }
                    if (item.text && control.setText) {
                        control.setText(item.text);
                    }
                    if (item.value) {
                        control.setValue(item.value);
                    }
                }
            }
        }
    },
    getValue: function () {
        var value = '';
        if (this.formEl) {
            var commondto = DtoUtils.getCommonDto(this.formEl),
                controls = commondto.getData(true),
                data = [];
            for (var i in controls) {
                if (i != '_common_hidden_viewdata') {
                    data.push(controls[i]);
                }

            }

            value = mini.encode(data, "yyyy-MM-dd HH:mm:ss");
        }

        return value;

    }
});

mini.regClass(mini.DynaForm, "dynaform");
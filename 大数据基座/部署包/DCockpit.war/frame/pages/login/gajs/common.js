/* 页面交互公共效果 */

// 工具方法(针对前后端分离,如不是需删除)
(function(win, $) {
    if (!window.Util) {
        window.Util = {};
    }
    /*
     * 序列化表单元素，区别于jQuery 的serialize和serializeArray方法
     */
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    $.extend(Util, {
        /* 获取URL地址参数
         * prop:参数名
         */
        getUrlParams: function(prop) {
            var params = {},
                query = location.search.substring(1),
                arr = query.split('&'),
                rt;

            $.each(arr, function(i, item) {
                var tmp = item.split('='),
                    key = tmp[0],
                    val = tmp[1];

                if (typeof params[key] == 'undefined') {
                    params[key] = val;
                } else if (typeof params[key] == 'string') {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });
            rt = prop ? params[prop] : params;
            return rt;
        },

        // 适配f9中的response格式
        ajax: function(options) {
            options = $.extend({}, {
                type: 'POST',
                dataType: 'json',
                dataFilter: function(data, type) {
                    if (type == 'json') {
                        data = JSON.parse(data);

                        // TODO: 这里可以对data做些统一处理，权限处理等

                        data = data.UserArea;

                        if (typeof data == 'object') {
                            data = JSON.stringify(data);
                        }

                    }

                    return data;
                },
                error: Util._ajaxErr
            }, options);

            //options.url = SrcBoot.getPath(options.url);

            return $.ajax(options);
        },

        // 动态加载js
        loadJs: function(url, callback) {
            var script = document.createElement("script");
            script.type = 'text/javascript';

            // IE8-
            if (callback) {
                if (script.readyState) {
                    script.onreadystatechange = function() {
                        if (script.readyState == 'loaded' || script.readyState == 'complete') {

                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                    // w3c
                } else {
                    script.onload = function() {
                        callback();
                        script.onload = null;
                    };
                }
            }

            script.src = url;
            // append to head
            document.getElementsByTagName("body")[0].appendChild(script);
        },

        // 动态加载css
        loadCss: function(url) {
            var $link = $('<link/>', {
                type: 'text/css',
                rel: 'stylesheet',
                href: url
            });

            $link.appendTo(document.getElementsByTagName("head")[0]);
        },

        // empty function
        noop: function() {},

        // 去除html标签中的换行符和空格
        clearHtml: function(html) {
            return html.replace(/(\r\n|\n|\r)/g, "")
                .replace(/[\t ]+\</g, "<")
                .replace(/\>[\t ]+\</g, "><")
                .replace(/\>[\t ]+$/g, ">");
        },

        _ajaxErr: function(jqXHR, textStatus, errorThrown) {
            console.error('status: %s, error: %s', textStatus, errorThrown);
        }

    });

    /*
     * 动态加载CSSJS使用示例
     */
    //  Util.loadCss("css/grid.20.980.css");
    //  Util.loadJs('js/lib/jquery.cookie.js', function() {
    //      console.log("回调函数");
    //  });


}(this, jQuery));


// 加载头尾代码片段
(function(win, $) {

    win.Include = function(cfg) {
        this.cfg = cfg;

        this._init();
    };

    Include.prototype = {
        constructor: Include,

        _init: function() {
            var c = this.cfg;

            if (c.async !== false) c.async = true;

            this.$container = $('#' + c.id);
        },

        fetch: function() {
            var c = this.cfg,
                self = this;

            return $.ajax({
                url: c.src,
                type: 'GET',
                dataType: 'html',
                async: c.async,
                success: function(html) {
                    self.$container.html(html);

                    c.onload && c.onload(html);
                }
            });
        }
    };

    // 需要引入的代码片段 ★头尾是js加载的，头尾的js要写在回调函数里★
    var includes = [{
        id: 'header',
        src: 'header.inc.html',
        onload: function() {

            win.inputTips.init();

        }
    }, {
        id: 'footer',
        src: 'footer.inc.html',
        onload: function() {
            // console.log('...footer loaded...');
        }
    }];

    $.each(includes, function(i, cfg) {
        if ($('#' + cfg.id).length) {
            new Include(cfg).fetch();
        }
    });

}(this, jQuery));


/* 其他公用js */

(function(win, $) {
	
	// placeholder
	win.inputTips = new inputPlaceholder();

}(this, jQuery));
/*!
 * Util工具类
 */
(function (win, $) {

    var $win = $(win),
        $bd = $('body'),
        $doc = $(document);

    // minimum z-index for popups
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    // 是否存在activeX控件：object标签
    // var hasObjectTag = !!document.getElementsByTagName('object').length;
    // 由于存在iframe嵌套的情况，在当前页判断并不可靠，始终置为true
    var hasObjectTag = true;

    // 实现一个自定义事件
    function UserEvent() {
        // 必须使用new命令
        if (!(this instanceof UserEvent)) return new UserEvent();
        this.__events = {};
    }
    UserEvent.installTo = function (obj) {
        if (typeof obj != 'object') {
            throw new TypeError('obj must be an object');
        }
        if (obj.__events !== undefined) {
            throw new Error('此对象已经存在 __events 属性了。');
        }
        obj.__events = {};
        obj.on = UserEvent.prototype.on;
        obj.off = UserEvent.prototype.off;
        obj.fire = UserEvent.prototype.fire;
        obj.one = UserEvent.prototype.one;
        return obj;
    }
    $.extend(UserEvent.prototype, {
        on: function (type, fn) {
            if (Util._getType(type) != 'string') {
                console.error('The Event name must be a string');
                return this;
            }
            if (Util._getType(fn) != 'function') {
                console.error('The Event handler must be a function');
                return this;
            }
            type = type.toLowerCase();
            if (!this.__events[type]) {
                this.__events[type] = [];
            }
            this.__events[type].push(fn);
            return this;
        },
        fire: function (type, data, context) {
            if (Util._getType(type) != 'string') {
                console.error('The Event name must be a string');
                return this;
            }
            type = type.toLowerCase();
            var eventArr = this.__events[type];
            if (!eventArr || !eventArr.length) return;
            for (var i = 0, l = eventArr.length; i < l; ++i) {
                eventArr[i].call(context || this, {
                    type: type,
                    target: this,
                    data: data
                });
            }
            return this;
        },
        off: function (type, fn) {
            var eventArr = this.__events[type];
            if (!eventArr || !eventArr.length) return;

            if (!fn) {
                this.__events[type] = eventArr = [];
            } else {
                for (var i = 0; i < eventArr.length; ++i) {
                    if (fn === eventArr[i]) {
                        eventArr.splice(i, 1);
                        --i;
                    }
                }
            }
            return this;
        },
        one: function (type, fn) {
            var that = this;

            function nfn() {
                // 执行时 先取消绑定
                that.off(type, nfn);
                // 再执行函数
                fn.apply(this || that, arguments);
            }

            this.on(type, nfn);

            return this;
        }
    });

    if (!win.Util) {
        win.Util = {};
    }

    $.extend(Util, {
        // client size
        getWinSize: function () {
            return {
                width: $win.width(),
                height: $win.height()
            };
        },

        // body size
        getBdSize: function () {
            return {
                width: $bd.width(),
                height: $bd.height()
            };
        },

        // html size
        getDocSize: function () {
            return {
                width: $doc.width(),
                height: $doc.height()
            };
        },

        // scroll size
        getScrollSize: function () {
            return {
                left: document.body.scrollLeft || document.documentElement.scrollLeft,
                top: document.body.scrollTop || document.documentElement.scrollTop
            };
        },

        // 加密部分进行了重写优化
        // get query parameters of url
        // getUrlParams: function (prop) {
        //     var params = {},
        //         query = win.location.search.substring(1),
        //         arr = query.split('&'),
        //         rt;
        //     if (!query) {
        //         return prop ? undefined : {};
        //     }

        //     $.each(arr, function (i, item) {
        //         var tmp = item.split('='),
        //             key = tmp[0],
        //             val = tmp[1];

        //         if (typeof params[key] == 'undefined') {
        //             params[key] = val;
        //         } else if (typeof params[key] == 'string') {
        //             params[key] = [params[key], val];
        //         } else {
        //             params[key].push(val);
        //         }
        //     });

        //     rt = prop ? params[prop] : params;

        //     return rt;
        // },

        getZIndex: function () {
            // var curr = zIndex;
            // zIndex = curr + 2;
            // return curr;
            return mini.getMaxZIndex();
        },

        // generate random widget id
        uuid: function (len, radix) {
            var chars = CHARS,
                uuid = [],
                i;
            radix = radix || chars.length;

            if (len) {
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                var r;

                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        },

        // modal dialog cover
        // 用于F8中的EpDialog、TipDialog打开的蒙版
        getModalCover: function (prefix) {
            var $cover = $('<div></div>', {
                'id': prefix + '-cover'
            }).addClass('modal-dialog-cover hidden');

            // 此iframe用于覆盖activeX
            if (hasObjectTag) {
                var iframe = document.createElement('iframe');
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.scrolling = 'no';
                iframe.frameBorder = 0;
                iframe.src = 'about:blank';

                $(iframe).appendTo($cover);
            }

            return $cover;
        },

        // 返回完整的WebContent根路径
        getRootPath: function () {
            var loc = window.Util.getSafeLocation(),
                host = loc.hostname,
                protocol = loc.protocol,
                port = loc.port ? (':' + loc.port) : '',
                path = (_rootPath !== undefined ? _rootPath : ('/' + loc.pathname.split('/')[1])) + '/';
            if (/^(http|https|ftp|data:)/g.test(path)) {
                return path;
            }

            var rootPath = protocol + '//' + host + port + path;

            return rootPath;
        },
        /**
         * 获取 Url 上的 hash
         *
         * @param {string} url url值
         * @returns hash
         */
        getHash: function (url) {
            var idx = (url || location.href).indexOf('#');
            return idx === -1 ? '' : url.substr(idx);
        },
        /**
         * 移除 url 上的hash
         *
         * @param {string} url url值
         * @returns 移除 hash 后的 url值
         */
        removeHash: function (url) {
            var idx = url.indexOf('#');
            return idx === -1 ? url : url.substring(0, idx);
        },
        // 返回适合的url
        // 1.url为全路径，则返回自身
        // 2.url为，则返回自身
        // 3.url为WebContent开始的路径，则补全为完整的路径
        getRightUrl: function (url, noEncrypt) {
            if (!url) return '';

            var curUrl = Util.removeHash(Util.getSafeLocation().href),
                queryIndex = curUrl.indexOf('?');

            // 截取url参数前的路径
            if (queryIndex != -1) {
                curUrl = curUrl.substr(0, queryIndex);
            }

            // 是否是相对路径
            var isRelative = url.indexOf('./') != -1 || url.indexOf('../') != -1;

            // 全路径、相对路径直接返回
            if (/^(http|https|ftp|data:)/g.test(url)) {
                // url = url;

                // 相对路径
            } else if (isRelative) {
                url = curUrl.substr(0, curUrl.lastIndexOf('/') + 1) + url;

                // WebContent开始路径
            } else {
                // 去除最前面的 '/' ，避免拼出来后变成两个 '//'
                if (url.substring(0, 1) === '/') {
                    url = url.substring(1);
                }
                url = Util.getRootPath() + url;
            }

            // 如果不需要加密
            if (noEncrypt) {
                return url;
            }

            return Util.encryptUrlParams ? Util.encryptUrlParams(url) : url;
        },

        // browser detect
        browsers: {
            isIE67: '\v' == 'v',
            isIE8: !!document.all && document.querySelector && !document.addEventListener,
            isIE9: !!document.all && document.addEventListener && !window.atob,
            isIE10: !!document.all && window.atob,
            isIE11: '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style,
            // IE6~11
            isIE: ((!!document.all && document.compatMode) || ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style)),
            isWebkit: 'WebkitAppearance' in document.documentElement.style,
            isFirefox: !!navigator.userAgent.match(/firefox/i),
            isEdge: /Edge\/([\d.]+)/.test(navigator.userAgent)
        },

        toInt: function (val) {
            var r = parseInt(val, 10);
            return r ? r : 0;
        },

        openSelfWin: function (url) {
            // win.location = url;
            win.Util.getSafeLocation().setHref(url);
        },

        // 记录已经加载过的js，以避免多次加载
        _loadedJs: {},
        // 动态加载js
        loadJs: function (url, callback) {
            if (this._loadedJs[url]) {
                if (!this._loadedJs[url].callbacks) {
                    this._loadedJs[url].callbacks = [];
                }
                this._loadedJs[url].callbacks.push(callback);
                return;
            }

            var script = document.createElement('script');
            script.type = 'text/javascript';

            // IE8-
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {

                        script.onreadystatechange = null;
                        executeCallback();
                    }
                };
                // w3c
            } else {
                script.onload = function () {
                    executeCallback();
                    script.onload = null;
                };
            }

            function executeCallback() {
                var callbacks = Util._loadedJs[url].callbacks;
                if (callbacks) {
                    for (var i = 0, l = callbacks.length; i < l; i++) {
                        callbacks[i]();
                    }
                    Util._loadedJs[url].callbacks = undefined;
                }
            }

            this._loadedJs[url] = {};
            if (callback) {
                this._loadedJs[url].callbacks = [callback];
            }

            script.src = win.SrcBoot ? SrcBoot.handleResPath(url) : Util.getRightUrl(url);
            // append to head
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        // 页面预留的 懒加载的 style 标签
        _lazyLoadStyle: document.getElementById('lazy-load-style'),

        /**
         * 动态加载css
         *
         * @param {String} url css 路径 webapp目录开始写起的全路径或相对路径
         * @param {String/HTMLElement/jQueryObject} target 插入判断的位置元素
         * @param {String} pos 相对目标元素的前后位置 可选值 ['Before', 'After']
         * @param {Boolean} importToStyle 是否以@import的形式插入 占位的懒加载元素中 仅在IE下且 存在占位元素才有效
         * @returns
         */
        loadCss: function (url, target, pos, importToStyle) {
            if (importToStyle === undefined) importToStyle = true;
            if (Util.browsers.isIE && importToStyle && this._lazyLoadStyle) {
                var addExtraStyle = '@import "' + (win.SrcBoot ? SrcBoot.handleResPath(url) : Util.getRightUrl(url)) + '";';
                if ('styleSheet' in this._lazyLoadStyle) {
                    return this._lazyLoadStyle.styleSheet.cssText += addExtraStyle;
                }
                return $(this._lazyLoadStyle).text($(this._lazyLoadStyle).text() + addExtraStyle);
            }
            var $link = $('<link/>', {
                href: win.SrcBoot ? SrcBoot.handleResPath(url) : Util.getRightUrl(url),
                rel: 'stylesheet',
                type: 'text/css'
            });

            if (!target || !$(target).length) {
                target = document.getElementsByTagName('head')[0];
                $link.appendTo(target);
            } else {
                if (!pos) pos = 'After';
                $link['insert' + pos](target);
            }
        },

        // 动态加载模板页面功能模块
        loadPageModule: function (path) {
            $.ajax({
                type: 'POST',
                dataType: 'html',
                url: win.SrcBoot ? SrcBoot.handleResPath(path.templ) : this.getRightUrl(path.templ),
                data: {},
                beforeSend: function (XMLHttpRequest) {
                    path.css && Util.loadCss(path.css, document.getElementById('common-skin'), 'Before', true);
                    $.ajaxSettings.beforeSend(XMLHttpRequest);
                },
                success: function (html) {
                    $(html).appendTo('body');

                    path.js && Util.loadJs(path.js, function () {
                        if (path.callback) {
                            path.callback();
                        }
                    });
                }
            });
        },

        // 去除html标签中的换行符和空格
        clearHtml: function (html) {
            return html.replace(/(\r\n|\n|\r)/g, '')
                .replace(/[\t ]+</g, '<')
                .replace(/>[\t ]+</g, '><')
                .replace(/>[\t ]+$/g, '>');
        },

        _ajaxErr: function (jqXHR, textStatus, errorThrown) {
            console.error('status: %s, error: %s', textStatus, errorThrown);
            console.error('%c后台返回的数据：' + jqXHR.responseText, 'font-size: 16px;');

            // 由于安全模块拦截返回的的http code 是不确定的，所以把安全模块错误信息的处理移到了这边
            var data = jqXHR.responseJSON;

            if (data && data.status && data.status.text) {
                mini.showMessageBox({
                    title: '错误提示',
                    buttons: ['ok'],
                    message: data.status.text,
                    iconCls: 'mini-messagebox-error'
                });
            }
        },
        //处理statusCode
        _handleStatusCode: function (xhr) {
            var showMessage = function (xhr, msg) {
                var data = xhr.responseJSON,
                    error = msg,
                    stack = null;

                if (data) {
                    error = data.error;
                    stack = data.stackError;
                }

                // 先把loading效果去掉,不然弹出框会被loading层遮住
                // page loading 的层级已调低，不再需要隐藏
                // Util.hidePageLoading();
                if (error) {

                    if (!stack) {
                        mini.showMessageBox({
                            title: '错误提示',
                            buttons: ['ok'],
                            message: error,
                            iconCls: 'mini-messagebox-error'
                        });
                    } else {

                        mini.showMessageBox({
                            title: '错误提示',
                            buttons: ['ok'],
                            iconCls: 'mini-messagebox-error',
                            message: error + '<a class="messagebox-error-detail" href="javascript:;">详情…</a>'
                        });

                        $('body').on('click', '.messagebox-error-detail', function () {
                            var _zIndex = Util.getZIndex();

                            var detailStr = '<div id="message-dialog-detail" style="display:none;padding: 0 20px; position: fixed;width: 80%;left:10%;top: 5%;height: 90%;z-index:' + _zIndex + ';background-color:#fff;border:1px solid #ccc;"><div class="messagebox-close-btn" style="width: 20px;height:20px;position:absolute;right: -10px;top: -10px;border-radius:50%;background-color:rgba(0,0,0,.7);color:#fff;line-height: 18px;text-align:center;cursor:pointer;">&times;</div><div style="width:100%;height:100%;overflow-y:auto;">' + stack + '</div></div>';
                            $('#message-dialog-detail').remove();
                            $('body').append(detailStr);
                            $('#message-dialog-detail').show();
                        }).on('click', '.messagebox-close-btn', function () {
                            $('#message-dialog-detail').remove();
                        });

                    }
                }
            };

            return {
                //安全框架拦截
                400: function (xhr) {
                    showMessage(xhr);
                },
                //未登录的权限拦截
                401: function (xhr) {
                    var data = xhr.responseJSON,
                        url = '';

                    // 如果返回数据中带了url，则表示不需要弹出快捷登录（可能登录逻辑是个性化的，快捷登录无效），直接跳转到返回的 url 页面
                    if (data && (url = data.url)) {
                        if (url.indexOf('http') !== 0) {
                            url = Util.getRootPath() + url;
                        }
                        if (top.Util && top.Util.getSafeLocation) {
                            top.Util.getSafeLocation().setHref(url);
                        } else {
                            top.location.href = url;
                        }
                        return;
                    }

                    //弹出小登录框
                    //win.location.href = _rootPath + '/index.html';
                    if (top.window.quickLogin !== undefined) {
                        top.quickLogin.show();
                    } else {
                        top.Util.loadPageModule({
                            templ: 'frame/fui/js/widgets/quicklogin/quicklogin.tpl',
                            css: 'frame/fui/js/widgets/quicklogin/quicklogin.min.css',
                            js: 'frame/fui/js/widgets/quicklogin/quicklogin.js',
                            callback: function () {
                                top.quickLogin.show();
                            }
                        });
                    }
                },
                //功能权限拦截
                403: function (xhr) {
                    showMessage(xhr);
                },
                //404拦截
                404: function (xhr) {
                    showMessage(xhr, '请求地址错误，请联系管理员');
                },
                //报错类拦截
                500: function (xhr) {
                    showMessage(xhr);
                },
                // 用于被安全模块拦截后返回503的处理
                503: function (xhr) {
                    showMessage(xhr, '服务不可用');
                }

            };
        },
        // 简单封装ajax
        ajax: function (options) {
            // add主界面要自动带上themeid
            var themeMatch = Util.getSafeLocation().href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
                themeId = themeMatch && themeMatch[1];

            var viewData = mini.get('_common_hidden_viewdata');

            options = $.extend({}, {
                type: 'POST',
                dataType: 'json',
                error: Util._ajaxErr,
                statusCode: Util._handleStatusCode()
            }, options);

            options.data = options.data || {};

            // 如果是主界面 data中加上themeId
            if (themeId) {
                options.data = $.extend({
                    themeId: themeId,
                    pageId: Util.getUrlParams('pageId') || themeId
                }, options.data);
                
            }
            // 自动带上通用隐藏域，实现重放攻击防御
            if(!options.data.commonDto && viewData) {
                options.data.commonDto = mini.encode([{
                    id: "_common_hidden_viewdata",
                    type: "hidden",
                    value: viewData.getValue()
                }]);
            }
            
            // 自动携带当前页面的url参数过去
            options.data = $.extend(Util.getUrlParams(), options.data);
            // 如果需要加密 替换为加密格式
            if (!options.noEncryption) {
                options.data = Util.encryptAjaxParams(options.url, options.data);
            }
            options.url = Util.getRightUrl(options.url, options.noEncryption);
            // success 触发太早，防止对业务的影响 先去掉
            var okCb = options.success;
            if (okCb) {
                options.success = null;
                delete options.success;
            }
            var _jqXhr = $.ajax(options);

            var _ajax = _jqXhr.then(function (data) {
                if(data[Util.BODY_ENCRYPT_PARAM_NAME]) {
                    data = Util.decrypt(data[Util.BODY_ENCRYPT_PARAM_NAME]);

                    data = mini.decode(data);
                }
                var status = data.status,
                    controls = data.controls,
                    viewData;

                // 添加对通用隐藏域的处理
                // 解决快捷登录在主界面中需要获取通用隐藏域中存放的当前用户的loginid，实现快捷登录用其他账户登录时要刷新页面的需求
                if (controls && controls.length) {
                    viewData = controls[controls.length - 1];
                    if (viewData.id === '_common_hidden_viewdata') {
                        Util.setCommonViewData(viewData.value);
                    }
                }
                data = data.custom == undefined ? data : data.custom;
                if (data && (typeof data !== 'object') && options.dataType.toLowerCase() === 'json') {
                    data = JSON.parse(data);
                }

                if (status) {

                    var code = parseInt(status.code),
                        text = status.text || '',
                        url = status.url,
                        tipTxt = (code === 1 || code === 200) ? '成功' : '失败',
                        tipType = (code === 1 || code === 200) ? 'success' : 'danger';


                    if (url) {
                        if (url.indexOf('http') !== 0) {
                            url = Util.getRootPath() + url;
                        }
                        var aimWindow = status.top ? top : window;
                        if (aimWindow.Util && aimWindow.Util.getSafeLocation) {
                            aimWindow.Util.getSafeLocation().setHref(url);
                        } else {
                            aimWindow.location.href = url;
                        }
                        return;
                    }
                    if (text) {
                        mini.showTips({
                            content: "<b>" + tipTxt + "</b> <br/>" + text,
                            state: tipType,
                            x: 'center',
                            y: 'top',
                            timeout: 3000
                        });
                    }


                    // 处理成功回调
                    if (code === 1 || code === 200) {
                        if (okCb) {
                            okCb.apply(this, [data, arguments[1], arguments[2]]);
                        }
                    } else {
                        if (options.fail) {
                            options.fail.call(this, text, status);
                        }
                    }
                } else {
                    // 没有status 表示不符合规范，也需要执行sussess
                    okCb && okCb.apply(this, [data, arguments[1], arguments[2]]);
                }
                return data;
            });

            // then 返回的是新规范的promise 没有以下内容 兼容处理一下
            _ajax.success = _ajax.done;
            _ajax.error = _ajax.fail;
            _ajax.complete = _ajax.always;
            _ajax.abort = _jqXhr.abort;
            return _ajax;
        },

        // 释放iframe所占内存，并从dom树中移除
        clearIframe: function ($iframe) {
            var iframe = $iframe[0];

            iframe.src = 'about:blank';

            // 跨域时无法获取iframe的contentWindow
            try {
                iframe.contentWindow.document.write('');
                iframe.contentWindow.document.close();
            } catch (e) {}

            // 移除iframe
            try {
                iframe.parentNode.removeChild(iframe);
            } catch (e) {
                $iframe.remove();
            }
        },

        // empty function
        noop: function () {},

        // 调整content区域表格的布局
        _layoutDatagridInContent: function () {
            var grid = mini.get('datagrid');

            if (grid && grid.doLayout) {
                grid.doLayout();
            }
        },

        // 分时分批处理
        timeChunk: function (arr, fn, count, interval, callback) {
            var obj,
                t;

            var start = function () {
                var i = 0;
                for (; i < Math.min(count || 1, arr.length); i++) {
                    obj = arr.shift();
                    fn(obj);
                }
            };

            return function () {
                t = setInterval(function () {
                    if (!arr.length) {
                        clearInterval(t);

                        if (callback) {
                            callback();
                        }
                    }

                    start();
                }, interval || 100);
            };
        },

        // Force IE8 to redraw :before/:after pseudo elements
        redrawPseudoEl: function (el) {
            if (this.browsers.isIE8) {
                var $el = $(el);

                $el.addClass('content-empty');

                setTimeout(function () {
                    $el.removeClass('content-empty');
                }, 0);
            }
        },

        // get module properties from dom
        // for classicframe
        getModuleProps: function (el) {
            var data = {
                url: $.trim(el.getAttribute('modurl')),
                name: el.getAttribute('modname'),
                code: el.getAttribute('modcode'),
                isBlank: el.getAttribute('isblank') === 'true'
            };

            return data;
        },
        // 自定义事件
        UserEvent: UserEvent,
        // 框架更新了参数配置页面，重新对系统参数进行了规划，调整了参数名，考虑到对以前代码的兼容，需维护一个新老名字的映射关系
        _sysParamNameMapping: {
            fileSizeLimit: "file_limit_size",
            fileLimitType: "file_limit_type",
            uploadPreviewUrl: "upload_preview_url",
            uploadPreviewText: "upload_preview_text",
            enableCustomSort: "ui_customsort_enable",
            noUseTabsNav: "ui_use_tabsnav",
            gridPageSize: "ui_grid_pagesize",
            fileNameLengthLimit: "attach_filename_limitlength",
            gridAllowUnselect: "grid_allow_unselect",
            adjustGridPageSize: "grid_adjust_pagesize",
            editorModel: "editor_model",
            alertToTips: "alert_to_tips",
            messageSound: "message_sound"
        },
        // 获取框架系统参数的值
        // 使用前提：页面jsboot.js的引用路径为后端返回系统参数的动态接口地址     
        getFrameSysParam: function (name) {
            if (!win.EpFrameSysParams) {
                return;
            }

            if (win.EpFrameSysParams[name] === undefined) {
                name = Util._sysParamNameMapping[name];
                return name === 'ui_use_tabsnav' ? !win.EpFrameSysParams[name] : win.EpFrameSysParams[name];
            }

            return win.EpFrameSysParams[name];

            // return win.EpFrameSysParams ? EpFrameSysParams[name] : undefined;
        },

        getThemeName: function () {
            return Util.readCookie('_theme_');
        },

        getSkinName: function () {
            var themeName = this.getThemeName();

            return Util.readCookie('_' + themeName + '_skin_') || 'default';
        },
        // 查找第一个可滚动的父元素
        getFirstScrollEl: function (obj) {
            if (obj.scrollHeight > obj.clientHeight) {
                return obj;
            }

            if (obj.parentElement) {
                return this.getFirstScrollEl(obj.parentElement);
            }

            return null;
        },

        // Windows没有完整地支持IPv6，在UNC路径中，需使用破折号代替冒号，并在地址的末尾 加上.ipv6-literal.net后缀
        // 用于处理websocket地址
        getRightIPv6Url: function (url) {
            var location = Util.getSafeLocation(),
                hostname = location.hostname;
            // 判断是否是ipv6地址
            // 当前判断还不够精确，需优化
            if (Util.browsers.isIE && /:/.test(hostname)) {
                // 是否是相对路径
                var isRelative = url.indexOf('./') != -1 || url.indexOf('../') != -1;
                var curUrl = location.protocol + "//" + hostname.replace(/:/g, "-").replace(/%/g, "s").replace(/\[/g, '').replace(/\]/g, '') + ".ipv6-literal.net" + (location.port ? ':' + location.port : '');
                // 全路径、相对路径直接返回
                if (/^(http|https|ftp|data:)/g.test(url)) {
                    // url = url;

                    // 相对路径
                } else if (isRelative) {
                    url = curUrl + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1) + url;

                    // WebContent开始路径
                } else {
                    // 去除最前面的 '/' ，避免拼出来后变成两个 '//'
                    if (url.substring(0, 1) === '/') {
                        url = url.substring(1);
                    }
                    url = curUrl + (_rootPath !== undefined ? _rootPath : ('/' + location.pathname.split('/')[1])) + '/' + url;
                }

                return url;
            }

            return Util.getRightUrl(url);
        },
        /**
         * 获取目标的类型
         * @param {any} obj 要获取类型的任意内容
         * @returns {String} 目标的类型 如 string 、boolean、number、array、function等
         */
        _getType: function (obj) {
            return $.type(obj);
        },
        setCommonViewData: function (value) {
            var viewData = mini.get('_common_hidden_viewdata');
            if (!viewData) {
                viewData = new mini.Hidden();
                viewData.setId('_common_hidden_viewdata');
                viewData.render(document.body);
            }
            viewData.setValue(value);
        },
        /**
         * 缓存页面数据
         * @param {String/Object} data 要保存的数据
         * @param {String} key 数据保存到的字段名称，不传默认为当前页面的路径
         */
        cachePageData: function (data, key) {
            key = key || window.location.pathname;
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            localStorage.setItem(key, data);
        },
        /**
         * 获取页面缓存数据
         * @param {String} key 要获取的数据字段名称，不传默认为当前页面的路径
         */
        getPageData: function (key) {
            key = key || window.location.pathname;
            var data = localStorage.getItem(key);

            try {
                data = JSON.parse(data);
            } catch (e) {}

            return data;
        },
        /**
         * 清除页面缓存数据
         * @param {String/Boolen} key 要清除的数据字段名称，不传默认为当前页面的路径。当传 true 时，表示清空当前域名下的所有缓存数据。
         */
        clearPageData: function (key) {
            if (key === true) {
                localStorage.clear();
            } else {
                key = key || window.location.pathname;

                localStorage.removeItem(key);
            }

        },
        /**
         * rsa加密
         */
        encryptRSA: function (str, publicExponent, modulus) {

            if (!publicExponent) {
                publicExponent = Util.getFrameSysParam('rsa_publicExponent');

                if (!publicExponent) {
                    throw new Error('the second param [publicExponent] can not be empty');
                }
                publicExponent = publicExponent.substring(1);
            }

            modulus = modulus || Util.getFrameSysParam('rsa_modulus');
            if (!modulus) {
                throw new Error('the third param [modulus] can not be empty');
            }

            var rsaKey = RSAUtils.getKeyPair(publicExponent, "", modulus);
            str = RSAUtils.encryptedString(rsaKey, str);
            return str;
        },

        /**
         * sm2加密
         */
        encryptSM2: function (str, sm2PubKey) {
            sm2PubKey = sm2PubKey || Util.getFrameSysParam('security_sm2encode_pubk');
            if (!sm2PubKey) {
                throw new Error('the second param [sm2PubKey] can not be empty');
            }

            str = sm2Encrypt(str, sm2PubKey, 0);
            return str;
        }
    });
    // 动画支持检测和动画时间名称
    function testAnimate() {
        var el = document.createElement('div');
        var isSupportTransition = false;
        var isSupportAnimation = false;
        var transitionend = null;
        var animationend = null,
            animationiteration = null,
            animationstart = null;

        // transition 
        // transition 标准事件只有结束的end， firefox下还有开始、运行中、取消等，但非标准，此处不处理
        if ('transition' in el.style) {
            isSupportTransition = true;
            transitionend = 'transitionend';
        } else if ('-webkit-transition' in el.style) {
            isSupportTransition = true;
            transitionend = 'webkitTransitionEnd';
        } else if ('-moz-transition' in el.style) {
            isSupportTransition = true;
            transitionend = 'mozTransitionEnd';
        } else if ('-o-transition' in el.style) {
            isSupportTransition = true;
            transitionend = 'oTransitionEnd';
        }

        // animation
        // animation 标准事件有 开始、运行中、结束， firefox下还有取消，但非标准，此处不处理
        if (('animation' in el.style) || ('-moz-animation' in el.style)) {
            isSupportAnimation = true;
            animationend = 'animationend';
            animationiteration = 'animationiteration';
            animationstart = 'animationstart';
        } else if ('-webkit-animation' in el.style) {
            isSupportAnimation = true;
            animationend = 'webkitAnimationEnd';
            animationiteration = 'webkitAnimationIteration';
            animationstart = 'webkitAnimationStart';
        }
        el = null;
        return {
            isSupportTransition: isSupportTransition,
            isSupportAnimation: isSupportAnimation,
            animationend: animationend,
            animationiteration: animationiteration,
            animationstart: animationstart,
            transitionend: transitionend
        };
    }
    $.extend(Util.browsers, testAnimate());

    // edge 常常需要和IE相同的处理 也需要进行标记
    if (Util.browsers.isEdge) {
        $('body').addClass('edge');
    }


    // 用于F8框架，套用jsf模板的页面
    // iframe scrolling为no的情况下, 框架页面可以正常出现滚动条
    // 以后可能会删除
    Util.fixIframeNoScroll = function () {
        $('body').add('html').css({
            height: '100%',
            overflow: 'hidden'
        });

        $('form:eq(0)').css({
            height: '100%',
            overflow: 'auto'
        });
    };
    Util._fixIframeNoScroll = Util.fixIframeNoScroll;


    // 别名，适配代码中可能存在的老用法
    Util._clearIframe = Util.clearIframe;
    Util._loadPageModule = Util.loadPageModule;

    // getRightUrl的别名，参考.net的方法名
    Util.getAbsoluteUrl = Util.getRightUrl;
}(this, jQuery));


// 皮肤切换
(function (win, $) {
    var skinSwitcher = {
        updateSkin: function (skin) {
            $('[name="fui-ui-style"]').prop('disabled', true).filter('[data-name="' + skin + '"]').prop('disabled', false);
            $('[name="fui-theme-style"]').prop('disabled', true).filter('[data-name="' + skin + '"]').prop('disabled', false);
        },
        postToChild: function (skin, hasSelf) {

            var iframes = document.getElementsByTagName('iframe');
            var that = this;
            if (hasSelf) {
                setTimeout(function () {
                    that._postMessage(win, skin);
                });
            }
            try {
                $.each(iframes, function (i, ifr) {
                    setTimeout(function () {
                        that._postMessage(ifr.contentWindow, skin);
                    });
                });
            } catch (error) {
                console.error(error);
                iframes = null;
            }
            iframes = null;
        },
        _postMessage: function (aimWin, skin) {
            aimWin.postMessage(JSON.stringify({
                type: 'skinChange',
                skin: skin
            }), '*');
        },
        init: function () {
            var that = this;
            $(win).on('message', function (event) {
                event = event.originalEvent;
                if (!event.data) return;
                try {
                    var data = JSON.parse(event.data);
                    if (data.type == 'skinChange' && data.skin) {
                        that.updateSkin(data.skin);
                        that.postToChild(data.skin);
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }
    };
    skinSwitcher.init();
    Util.skinSwitcher = skinSwitcher;

}(this, jQuery));

// 字体大小切换
(function (win, $) {
    var htmlBase = win.HtmlBaseFontSize || 100;
    var bodyBase = win.BodyBaseFontSzie || 13;

    function calcFontSize(base, ratio) {
        return (base * ratio).toFixed(6) + 'px';
    }
    var fontSizeSwitcher = {
        doUpdateFontSize: function (ratio) {
            if (!ratio || isNaN(parseFloat(ratio, 10))) {
                return;
            }
            document.documentElement.style.fontSize = calcFontSize(htmlBase, ratio);
            document.body.style.fontSize = calcFontSize(bodyBase, ratio);
            setTimeout(function () {
                $(win).trigger('resize');
            }, 200);
        },
        updateFontSize: function (ratio) {
            this.doUpdateFontSize(ratio);
            this.postToChild(
                JSON.stringify({
                    ratio: ratio,
                    type: 'fontSizeChange'
                })
            );
        },
        postToChild: function (data) {
            [].slice.call(document.getElementsByTagName('iframe')).forEach(function (ifr) {
                ifr.contentWindow.postMessage(data, '*');
            });
        },
        saveFontSizeRatio: function (ratio) {
            ratio = parseFloat(ratio, 10);
            if (!ratio || isNaN(ratio)) {
                return;
            }
            Util.writeCookie('_font_size_ratio_', ratio, {
                expires: 365,
                path: window._rootPath ? window._rootPath : '/'
            });
            this.updateFontSize(ratio);
        },
        init: function () {
            var that = this;
            win.addEventListener('message', function (ev) {
                var data = ev.data;
                try {
                    if (data + '' === data) {
                        data = JSON.parse(data);
                    }
                    if (data.type == 'fontSizeChange') {
                        that.updateFontSize(data);
                    }
                } catch (error) {}
            });
        }
    };

    win.addEventListener && fontSizeSwitcher.init();
    win.Util.fontSizeSwitcher = fontSizeSwitcher;
})(this, jQuery);
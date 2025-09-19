(function () {
    /**
     * 为了防止代码中未移除的console在IE8\9下可能报错的问题，对没有console的情况进行了处理
     */
    if (!window.console) {
        window.console = {
            log: function () {},
            dir: function () {},
            dirxml: function () {},
            info: function () {},
            warn: function () {
                // var str = '【警告】\n原警告参数依次为：\n';
                // for (var i = 0, l = arguments.length; i < l; ++i) {
                //     str += String(arguments[i]) + '\n';
                // }
                // window.alert(arguments.length ? str : '【警告】');
            },
            error: function () {
                // var str = '【错误】\n原错误参数依次为：\n';
                // for (var i = 0, l = arguments.length; i < l; ++i) {
                //     str += String(arguments[i]) +'\n';
                // }
                // window.alert(arguments.length ? str : '【错误】');
            }
        };
    }

    // 绑定事件
    function on(el, type, fn) {
        if (el.addEventListener) {
            el.addEventListener(type, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
        }
    }
    // 对象合并
    function assign() {
        var target = arguments[0];
        var i = 1,
            len = arguments.length,
            key = '',
            obj = null,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        for (; i < len; i++) {
            obj = arguments[i];
            for (key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    target[key] = obj[key];
                }
            }
        }

        return target;
    }
    // 类型判断
    var class2type = { '[object Boolean]': 'boolean', '[object Number]': 'number', '[object String]': 'string', '[object Function]': 'function', '[object Array]': 'array', '[object Date]': 'date', '[object RegExp]': 'regexp', '[object Object]': 'object', '[object Error]': 'error', '[object Symbol]': 'symbol' };
    function getType(obj) {
        if (obj == null) {
            return obj + '';
        }

        var str = Object.prototype.toString.call(obj);
        return typeof obj === 'object' || typeof obj === 'function' ? 
            class2type[str] || 'object' : typeof obj;
    }

    // 一天的毫秒数目
    var DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

    // 统一的cookie配置
    var DEFAULT_COOKIE_OPTIONS = {
        // 过期时间 单位天
        // expires: 30,
        // path: '/',
        // domain: '',
        // secure: false
    };
    // 设置cookie的默认配置
    var setCookieDefaultOption = function (opt) {
        for (var k in opt) {
            if (Object.prototype.hasOwnProperty.call(opt, k)) {
                DEFAULT_COOKIE_OPTIONS[k] = opt[k];
            }
        }
    };

    /**
     * 写入cookie
     *
     * @param {string} key cookie 名称
     * @param {string} value cookie 值
     * @param {object | undefined} options 当前cookie的配置 { expires,path,domain,secure }
     * @returns {string} 写入的cookie
     */
    var writeCookie = function (key, value, options) {
        if (!options || getType(options) != 'object') {
            options = assign({}, DEFAULT_COOKIE_OPTIONS, options || {});
        }

        // 过期时间
        if (getType(options.expires) == 'number') {
            var d = options.expires;
            options.expires = new Date();
            options.expires.setMilliseconds(options.expires.getMilliseconds() + d * DAY_MILLISECONDS);
        }
        return (document.cookie = [encodeURIComponent(key), '=', value,
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    };

    /**
     * 读取cookie
     *
     * @param {string} key cookie 名称
     * @returns 读取到的cookie值
     */
    var readCookie = function (key) {
        var result = key ? undefined : {},
            cookies = document.cookie ? document.cookie.split('; ') : [],
            i = 0,
            l = cookies.length;
        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decodeURIComponent(parts.shift()),
                v = parts.join('=');

            if (key === name) {
                result = v;
                break;
            }

            if (!key && v !== undefined) {
                result[name] = v;
            }
        }
        return result;
    };

    /**
     * 移除一个cookie
     *
     * @param {string} key cookie名称
     * @param {object} options cookie配置
     * @returns
     */
    var removeCookie = function (key, options) {
        options = options || {};
        options.expires = -1;
        writeCookie(key, '', options);
        return !readCookie(key);
    };

    /**
     * 安全Location对象的封装 IE9+ 可保障表现和location一样 IE8赋值需使用对应set方法
     */
    function SafeLocation() {
        var that = this;
        // this.protocol = location.protocol;
        // this.host = location.host;
        // this.hostname = location.hostname;
        // this.port = location.port;
        // this.pathname = location.pathname;
        // this.search = location.search;
        // this.username = location.username;
        // this.password = location.password;
        this.origin = location.origin;

        this._writeProps = ['protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'username', 'password'];
        this._isSupportDescriptor = !!Object.defineProperties;

        // 需要额外处理的 这两个属性会随时变化 需要不同的时候来获取
        // hash href
        var hash;
        if (this._isSupportDescriptor) {
            Object.defineProperties(this, {
                protocol: {
                    get: function () {
                        return location.protocol;
                    },
                    set: function (v) {
                        location.protocol = v;
                    }
                },
                host: {
                    get: function () {
                        return location.host;
                    },
                    set: function (v) {
                        location.host = v;
                    }
                },
                hostname: {
                    get: function () {
                        return location.hostname;
                    },
                    set: function (v) {
                        location.hostname = v;
                    }
                },
                port: {
                    get: function () {
                        return location.port;
                    },
                    set: function (v) {
                        location.port = v;
                    }
                },
                pathname: {
                    get: function () {
                        return location.pathname;
                    },
                    set: function (v) {
                        location.pathname = v;
                    }
                },
                search: {
                    get: function () {
                        return location.search;
                    },
                    set: function (v) {
                        location.search = v;
                    }
                },
                username: {
                    get: function () {
                        return location.username;
                    },
                    set: function (v) {
                        location.username = v;
                    }
                },
                password: {
                    get: function () {
                        return location.password;
                    },
                    set: function (v) {
                        location.password = v;
                    }
                },
                href: {
                    get: function () {
                        return location.href;
                    },
                    set: function (v) {
                        // TODO 安全过滤
                        location.href = v;
                    }
                },
                hash: {
                    get: function () {
                        hash = location.hash;
                        return hash;
                    },
                    set: function (v) {
                        if ((v || '')[0] != '#') {
                            v = '#' + v;
                        }
                        // TODO 安全过滤
                        hash = location.hash = v;
                    }
                }
            });
        } else {
            // 监听变化事件进行更新
            on(window, 'hashchange', function () {
                that.href = location.href;
                that.hash = location.hash;
            });
        }

        var props = this._writeProps.concat(['href', 'hash']);
        for (var i = 0, len = props.length; i < len; i++) {
            // 属性
            var p = props[i];
            // 对应方法
            var fnName = p[0].toUpperCase() + p.substr(1);
            (function (p, fnName) {
                // 支持描述符 则直接赋值
                if (that._isSupportDescriptor) {
                    that['set' + fnName] = function (v) {
                        that[p] = v;
                    };
                } else {
                    that[p] = location[p];
                    // 否则需要方法处理
                    that['set' + fnName] = function (v) {
                        that[p] = location[p] = v;
                    };
                }

                that['get' + fnName] = function () {
                    return that[p];
                };
            })(p, fnName);
        }

        // IE8 下检测 直接赋值的更新
        if (!this._isSupportDescriptor) {
            setInterval(function () {
                for (var i = 0, l = props.length; i < l; i++) {
                    var p = props[i];
                    if (that[p] != location[p]) {
                        location[p] = that[p];
                    }
                }
            }, 50);
        }
    }

    SafeLocation.prototype.replace = function (url) {
        // TODO 安全过滤
        location.replace(url);
    };

    SafeLocation.prototype.reload = function () {
        location.reload();
    };
    SafeLocation.prototype.assign = function (url) {
        // TODO 安全过滤
        location.assign(url);
    };
    SafeLocation.prototype.toString = function () {
        return this.href;
    };

    /**
     * html 转义
     *
     * @param {string} html 要处理的字符串
     * @returns 经过html转义的字符串
     */
    function htmlEscape(html) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(html));
        var s = div.innerHTML;
        div = null;
        return s;
    }
    /**
     * html 还原转义
     */
    function htmlUnescape(str) {
        // var div = document.createElement('div');
        // div.innerHTML = str;
        // var t = div.innerText;
        // div = null;
        // return t;
        if (typeof str !== 'string') return str;
        var s = '';
        if (str.length == 0) return '';
        s = str.replace(/&amp;/g, '&');
        s = s.replace(/&lt;/g, '<');
        s = s.replace(/&gt;/g, '>');
        s = s.replace(/&nbsp;/g, ' ');
        s = s.replace(/&#39;/g, '\'');
        s = s.replace(/&quot;/g, '"');
        //s = s.replace(/<br>/g, "\n");
        return s;
    }

    /**
     * html XSS过滤
     * TODO: html XSS 注入的可能情况
     * 1、 script标签
     * 2、 style 样式中 url 发请求
     * 3、 资源型标签 src 触发
     * 4、 html行内事件，如onclick onmouseover等
     * @param {string} html 要处理的字符串
     * @returns 经过安全过滤html字符串
     */
    function getSafeHtml(html) {
        if (!html) return;
        // TODO
        // script 处理
        // html = html.replace(/<script(.*?)>/gi, '&lt;script$1&gt;').replace(/<\/script>/gi, '&lt;/script&gt;');
        html = html.replace(/<script(.*?)>/gi, '<noscript$1>').replace(/<\/script>/gi, '</noscript>');

        // createDocumentFragment 存在注入可能 $.parseHTML 存在相同问题
        // 测试代码：SafeUtil.getSafeHtml(`<div class="qm-item" id="qm-48ecf37e-b134-401c-b757-15dcd7bc0416" data-id="48ecf37e-b134-401c-b757-15dcd7bc0416" title="CBM" data-url="https://oa.epoint.com.cn/EpointCBM/login.aspx" data-hassub="" data-opentype="blank" style="width:20%"><div class="qm-item-inner" style="background:#5d73e0;"><span class="qm-item-icon modicon-77"></span><span class="qm-item-name ">CBM</span><img src="abc.png" onerror="alert(1)"/></div></div>`)
        // var doc = document.createDocumentFragment();
        // var wrap = document.createElement('div');
        // wrap.innerHTML = html;
        // doc.appendChild(wrap);

        // var parser = new DOMParser();
        // var wrap = parser.parseFromString(html, 'text/html');

        // var nodes = wrap.childNodes;
        // if (nodes.length) {
        //     filterNode(nodes);
        // }

        // function filterNode(nodeList) {
        //     for (var i = 0; i < nodeList.length; i++) {
        //         var node = nodeList[i];
        //         var type = node.nodeType;
        //         // 文本和注释
        //         if (type === 3 || type === 8) {
        //             continue;
        //         }
        //         if (node.getAttribute('src')) {
        //             console.warn('匹配到src', node);
        //             // todo
        //         }
        //         if (node.getAttribute('style')) {
        //             console.warn('匹配到style', node);
        //             // todo
        //         }
        //         if (node.childNodes && node.childNodes.length) {
        //             filterNode(node.childNodes);
        //         }
        //     }
        // }

        return html;
    }

    /**
     * 安全 eval
     * TODO: eval 本身就是风险非常大的，
     * 目前暂无内部过滤方案暂时统一使用，以便后期修改
     * @param {string} code
     * @returns eval 结果
     */
    function safeEval(code) {
        // TODO 暂时以关键字过滤处理 不过存在误伤可能性
        // function
        // => 箭头函数
        // delete
        if (/function/.test(code)) {
            console.warn('eval [function] 关键字');
        }
        // if (/=>/.test(code)) {
        //     console.warn('eval 潜在箭头函数');
        // }
        // if (/delete/.test(code)) {
        //     console.warn('eval [delete] 关键字');
        // }

        return eval(code);
    }

    var SafeUtil = {
        writeCookie: writeCookie,
        readCookie: readCookie,
        removeCookie: removeCookie,
        setCookieDefaultOption: setCookieDefaultOption,
        location: new SafeLocation(),
        htmlEscape: htmlEscape,
        htmlUnescape: htmlUnescape,
        getSafeHtml: getSafeHtml,
        safeEval: safeEval
    };
    SafeUtil.getSafeLocation = function () {
        return SafeUtil.location;
    };
    // window.SafeUtil = SafeUtil;
    if (!window.Util) {
        window.Util = {};
    }

    assign(Util, SafeUtil);
})();
/*!
 * Util工具类
 */
(function (win, $) {

    // 国际化多语言支持
    if(!win.epoint_local) {
        win.epoint_local = {};
    }

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
                var data = xhr.responseJSON || mini.decode(xhr.responseText),
                    error = msg,
                    stack = null,
                    viewData;

                if (data) {
                    error = data.error;
                    stack = data.stackError;
                    viewData = data._common_hidden_viewdata;
                }

                viewData && Util.setCommonViewData(viewData);

                // 对外提供个性化处理请求错误的接口
                if(win.epoint && win.epoint.onAjaxStatusError && win.epoint.onAjaxStatusError(error, stack, xhr.status, xhr)) {
                    return;
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
                            iconCls: 'mini-messagebox-error',
                            callback: function(action) {
                                if(win.epoint && win.epoint.ajaxStatusErrorAlertCallback) {
                                    win.epoint.ajaxStatusErrorAlertCallback(action);
                                }
                            }
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
                    var data = xhr.responseJSON || mini.decode(xhr.responseText),
                        url = '',
                        loc;

                    // 如果返回数据中带了url，则表示不需要弹出快捷登录（可能登录逻辑是个性化的，快捷登录无效），直接跳转到返回的 url 页面
                    if (data && (url = data.url)) {
                        if (url.indexOf('http') !== 0) {
                            url = Util.getRootPath() + url;
                            // 加上'.html'后缀
                            url = Util.addHtmlToUrl(url);
                        }
                        if (top.Util && top.Util.getSafeLocation) {
                            loc = top.Util.getSafeLocation();
                        } else {
                            loc = top.location;
                        }
                        loc.replace(url);
                        return;
                    }

                    var viewData = data ? data._common_hidden_viewdata : undefined;
                    viewData && Util.setCommonViewData(viewData);

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
                },
                429: function(xhr) {
                    var data = xhr.responseJSON || mini.decode(xhr.responseText);
                   
                    var viewData = data ? data._common_hidden_viewdata : undefined;
                    viewData && Util.setCommonViewData(viewData);

                    if (window.showInterceptTips !== undefined) {
                        showInterceptTips(data);
                    } else {
                        Util.loadCss('frame/fui/js/widgets/intercepttips/intercepttips.css');
                        Util.loadJs('frame/fui/js/widgets/intercepttips/intercepttips.js', function(){
                            showInterceptTips(data);
                        })
                    }
                }

            };
        },
        // 简单封装ajax
        ajax: function (options) {
            // add主界面要自动带上themeid
            var themeMatch = Util.getSafeLocation().href.match(/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i),
                themeId = themeMatch && themeMatch[1],
                isDtoRequest = Util._getUrlParams(options.url, 'isCommondto') === 'true';

            var viewData = mini.get('_common_hidden_viewdata');

            options = $.extend({}, {
                type: 'POST',
                dataType: 'json',
                error: Util._ajaxErr
                // statusCode: Util._handleStatusCode()
            }, options);

            options.url = Util.getRightUrl(options.url, options.noEncryption);
            options.data = options.data || {};

            // 如果是主界面 data中加上themeId
            if (themeId) {
                options.data = $.extend({
                    themeId: themeId,
                    pageId: Util.getUrlParams('pageId') || themeId
                }, options.data);
                
            }
            // 自动带上通用隐藏域，实现重放攻击防御
            if(isDtoRequest && !options.data.commonDto && viewData) {
                options.data.commonDto = mini.encode([{
                    id: "_common_hidden_viewdata",
                    type: "hidden",
                    value: viewData.getValue()
                }]);
            }

            // 自动带上pageUrl
            var cmdParams = mini.decode(options.data.cmdParams) || {};
            if(win.needPageUrlParams && !cmdParams.pageUrl) {
                cmdParams.pageUrl = win.location.href;

                options.data.cmdParams = mini.encode(cmdParams);
            }

            options.data = Util.addReplayAttackData(options.data);
            
            // 自动携带当前页面的url参数过去
            options.data = $.extend(Util.getUrlParams(), options.data);
            // 如果需要加密 替换为加密格式
            if (!options.noEncryption) {
                options.data = Util.encryptAjaxParams(options.url, options.data);
            }
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
                    controls = data.controls;

                // 添加对通用隐藏域的处理
                // 解决快捷登录在主界面中需要获取通用隐藏域中存放的当前用户的loginid，实现快捷登录用其他账户登录时要刷新页面的需求
                if (controls && controls.length) {
                    viewData = controls[controls.length - 1];
                    if (viewData.id === '_common_hidden_viewdata') {
                        Util.setCommonViewData(viewData.value);
                    }
                }
                data = data.custom === undefined ? data : data.custom;
                if (data && (typeof data !== 'object') && options.dataType.toLowerCase() === 'json') {
                    data = JSON.parse(data);
                }

                if (status) {

                    var code = parseInt(status.code, 10),
                        text = status.text || '',
                        url = status.url,
                        tipTxt = (code === 1 || code === 200) ? '成功' : '失败',
                        tipType = (code === 1 || code === 200) ? 'success' : 'danger';


                    if (url) {
                        if (url.indexOf('http') !== 0) {
                            url = Util.getRootPath() + url;
                            // 加上'.html'后缀
                            url = Util.addHtmlToUrl(url);
                        }
                        var aimWindow = status.top ? top : window,
                            loc;
                        if (aimWindow.Util && aimWindow.Util.getSafeLocation) {
                            loc = aimWindow.Util.getSafeLocation();
                        } else {
                            loc = aimWindow.location;
                        }
                        loc.replace(url);
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
        addReplayAttackData: function(data) {
            var viewData = mini.get('_common_hidden_viewdata'),
                uid = Util.uuid(8),
                key = '';
            if(viewData) {
                key = mini.decode(viewData.getValue()).replayAttack;
                if(key) {
                    data = $.extend({},{
                        replaynoticeid: uid,
                        sign: Util.encryptSM2(uid + ';' + key.substr(0, 32))
                    }, data);
                }
            }
            return data;
        },
        /**
         * 给页面url自动添加'.html'后缀
         * @param {String} url 
         */
        addHtmlToUrl: function(url) {
            // 加上'.html'后缀
            if(parseInt(Util.getFrameSysParam('dto_with_suffix'), 10) === 1 && url.indexOf('.html') < 0) {
                var i = url.indexOf('?');
                if(i < 0) {
                    url += '.html';
                } else {
                    url = url.substr(0, i) + '.html' + url.substr(i);
                }
            }
            return url;
        },
        adjustRequestContextCmd: function (url) {
            var alias = Util.getFrameSysParam('requestcontext_cmd_alias');
            if(alias) {
                url = url.replace('?cmd=', '?' + alias + '=');
            }

            return url;
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
        },
        /**
         * Mustache 模板渲染
         * @param {String} tpl 模板，可以是模板字符串，也可以是定义模板的父元素的 id 选择器，即形如 "#tplid"
         * @param {Object} data 模板数据
         * @param {String} target 可选参数。要渲染到的目标对象，可以是目标对象的 jQuery 选择器，也可以是 dom 对象。如果不传该参数，则模板不会自动渲染。
         * @returns {String} 生成的模板字符串
         */
        render: function(tpl, data, target) {
            var html = '';
            if(tpl.indexOf('#') === 0) {
                tpl = Util.clearHtml($(tpl).html());
            }

            html = Mustache.render(tpl, data);

            if(target) {
                $(target).html(html);
            }
            return html;
        },
        /**
         * 初始化页面 pager 控件
         * @param {String} pagerId pager 控件的 id
         * @param {Object} opts 需要设置的属性
         */
        renderPager: function(pagerId, opts) {
            var pager = mini.get(pagerId),
            callback;
            
            if(!pager || !opts) {
                return;
            }

            if(opts.callback) {
                callback = opts.callback;
                pager.on('pagechanged', function(e){
                    callback(e.pageIndex, e.pageSize);
                });
                
                delete opts.callback;
            }

            pager.set(opts);
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

/*!
 * contentpage结构content区域计算
 */
(function (win, $) {
    var $toolbar = $('.fui-toolbar'),
        $condition = $('.fui-condition'),
        $notice = $('.fui-notice'),
        $content = $('.fui-content'),
        $toolbarbottom = $('.fui-toolbar-bottom');

    win.adjustContentHeight = Util.noop;

    if (!$content.length) return;

    // // toolbar可以配置为在底部显示
    // if ($toolbar.data('position') == "bottom") {
    //     $toolbar.addClass('bottom');

    //     $toolbar.parent().append($toolbar.remove());
    // }

    var getHeight = function ($el) {
        var h = 0;

        if ($el.length && !$el.hasClass('hidden') && $el.css('position') != 'absolute') {
            h = $el.outerHeight();
        }
        return h;
    };

    var _adjustHeight = function () {
        var win_h = $content.parent().innerHeight() || $(win).height(),

            toolbar_h = getHeight($toolbar),
            condition_h = getHeight($condition),
            notice_h = getHeight($notice),
            toolbarbottom_h = getHeight($toolbarbottom);

        $content.css('height' ,win_h - toolbar_h - condition_h - notice_h - toolbarbottom_h);

        // content区域高度调整后，调整表格布局
        Util._layoutDatagridInContent();
    };

    var timer = 0;

    var adjustHeight = function () {
        timer && clearTimeout(timer);

        timer = setTimeout(_adjustHeight, 50);
    };

    $(win).on('resize.contentPage', adjustHeight);

    win.adjustContentHeight = _adjustHeight;

    $(_adjustHeight);

}(this, jQuery));
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

    var $no1stRows = null;

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
                $btn.addClass('multi');

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
                } else {
                    $rows.eq(i).removeClass('hidden');
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
// contentpage信息提示notice区域交互
(function (win, $) {
    var $notice = $('.fui-notice');

    if (!$notice.length) return;

    var $toolbar = $('.fui-toolbar:not(.bottom)'),
        $toolbarBottom = $('.fui-toolbar-bottom'),
        $helper = $toolbar.add($toolbarBottom).find('[role="helper"]');

    if (!$helper.length) {
        console.error('当前页面存在 【.fui-notice】 区域，但工具栏中不存在【[role="helper"]】按钮， 帮助提示功能无法正常使用');
        return;
    }

    $helper.addClass('fui-toolbar-helper').attr('title', $helper.text() ).empty();
    if ($helper.parent('.fui-toolbar').length) {
        // 如果是在顶部工具栏中 则在最后即可
        $helper.addClass('r');
        var $lr = $toolbar.find('> .r').eq(0);
        $lr.length ? $helper.insertBefore($lr) : $helper.appendTo($toolbar);
    } else {
        // 否则需要 fixed 到顶部
        $helper.addClass('fixed').appendTo('body');
    }

    // right
    // var $floatRight = $toolbar.find('.r');
    // if ($floatRight.length) {
    //     $floatRight.eq(0).before($helper);
    // } else {
    //     $helper.appendTo($toolbar);
    // }

    var showAsTooltip = $helper[0].getAttribute('showtype') == 'tooltip' ? true : false;

    // 创建关闭按钮
    var $close = $('<span class="notice-close-btn"></span>').appendTo($notice);

    // tooltip 格式
    if (showAsTooltip) {
        var contentHtml = $notice[0].innerHTML,
            tip = new mini.ToolTip();

        tip.set({
            target: document,
            scope: $toolbar[0],
            trigger: 'click',
            selector: '.fui-toolbar-helper',
            placement: 'bottom',
            autoHide: false,
            theme: 'light',
            defaultTheme: 'light',
            onbeforeopen: function (e) {
                $helper.addClass('active');
                if ($helper.hasClass('fixed')) {
                    $(tip.el).css('margin-right', 5);
                }
                e.content = contentHtml;
                e.cancel = false;
            }
        });
        tip.addCls('fui-toolbar-tooltip');

        $(window).on('resize', function () {
            $helper.removeClass('active');
            tip.close();
        });

        // 点击空白区域时自动隐藏
        $('body').on('click', function(e){
            if(!$(e.target).closest('.fui-toolbar-tooltip').length) {
                $helper.removeClass('active');
                tip.close();
            }
        });
        // 点击按钮关闭
        $('.fui-toolbar-tooltip').on('click', '.notice-close-btn', function () {
            $helper.removeClass('active');
            tip.close();
        });
    } else {
        // 默认格式
        var wrapHtml = '<div class="fui-notice-inner"></div>';

        $notice.children().wrapAll(wrapHtml);
        $helper.toggleClass('active', !$notice.hasClass('hidden'));

        $helper.on('click', function () {
            $notice.toggleClass('hidden', !$notice.hasClass('hidden'));
            $helper.toggleClass('active', !$notice.hasClass('hidden'));

            if ($helper.hasClass('fixed') && $helper.hasClass('active')) {
                $helper.addClass('hidden');
            } else {
                $helper.removeClass('hidden');
            }

            adjustContentHeight();
        });

        $close.on('click', function () {
            $helper.trigger('click');
        });

    }

}(this, jQuery));
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
(function (win, $) {
    var $accsWrap = $('.fui-accordions'),
        $fuiContent = $('.fui-content');

    var $accNav,
        $accReturn,
        $scrollEl;

    if (!$accsWrap.length) return;

    var getOrder = function (order) {
        if (order < 10) {
            order = '0' + order;
        }
        return order;
    };

    var showNav = $fuiContent.length > 0 && $accsWrap.attr('showNav');

    if(showNav === undefined) {
        showNav = Util.getFrameSysParam('showAccordionsNav');
    } else {
        showNav = showNav === "true";
    }

    var getAccHdHtml = function (order, title) {
        var html = [];

        html.push('<span class="fui-acc-order">' + getOrder(order) + '</span>');
        html.push('<i class="fui-acc-toggle"></i>');
        html.push('<h4 class="fui-acc-title">' + title + '</h4>');

        return html.join('');
    };

    var getNavItemHtml = function (id, title) {
        return '<li class="acc-menu-item" data-ref="' + id + '" title="' + title + '">' + title + '</li>';
    };

    var getNavHtml = function (itemHtml) {
        var html = [];

        html.push('<div class="fui-acc-menu">');
        html.push('<ul class="acc-menu-list">');
        html.push(itemHtml);
        html.push('</ul>');
        html.push('</div>');

        return html.join('');
    };

    var scroll = function (el) {

        var id = el.data("ref"),

            $accItem = $('#' + id);

        if ($scrollEl.length) {
            // var scrollTop = $accItem.offset().top + $scrollEl.scrollTop() - $scrollEl.offset().top;

            // if (Util.browsers.isIE) {
            //     $scrollEl.animate({
            //         scrollTop: scrollTop
            //     }, 500);
            // }else {
            //     $scrollEl[0].scrollTop = scrollTop;
            // }
            
            // 解决滚动区域不具有定位属性时，计算offsetTop值不准确问题
            var _opos = $scrollEl[0].style.position;
            $scrollEl[0].style.position = 'relative';
            scrollTopTo($accItem[0].offsetTop);
            $scrollEl[0].style.position = _opos;
            
        }

        el.addClass('active').siblings().removeClass('active');
    };

    var scrollTopTo = (function () {
        if (Util.browsers.isIE) {
            return function (scrollTop) {
                $scrollEl.stop(true).animate({
                    scrollTop: scrollTop
                }, 500);
            };
        }
        return function (scrollTop) {
            $scrollEl[0].scrollTop = scrollTop;
        };
    }());

    // 设置导航的位置
    var setNavPos = function () {
        var scrollContainerWidth = $fuiContent.width(),
            accWrapWidth = $accsWrap.outerWidth();

        var right = (scrollContainerWidth - accWrapWidth) / 2;

        // 避免导航区域遮住滚动条
        if (right < 17) {
            right = 17;
        }

        if (showNav) {
            $accNav.css('right', right);
            $accNav.css('top', $accsWrap[0].offsetTop);

            $accReturn.css('right', right);
        }
    };

    var adjustNavDisplay = function(){
        if(!showNav) {
            return;
        }
        var len = $accsWrap.find('[role="accordion"]').filter(function(){
            return !$(this).hasClass('hidden');
        }).length;

        if(len > 2) {
            $accsWrap.addClass('shownav');
            $accNav.removeClass('hidden');
            $accReturn.removeClass('hidden');
        } else {
            $accsWrap.removeClass('shownav');
            $accNav.addClass('hidden');
            $accReturn.addClass('hidden');
        }
    };

    // 解析手风琴html结构
    var parse = function () {
        var $accs = $accsWrap.find('[role="accordion"]'),
            len = $accs.length,
            navHtml = [];

        $.each($accs, function (i, acc) {
            var $acc = $(acc),
                $hd = $acc.find('[role="head"]'),
                $bd = $acc.find('[role="body"]');

            var opened = $acc.attr('opened') !== 'false',
                title = $hd.attr('title');

            $acc.addClass('fui-accordion');
            $hd.addClass('fui-acc-hd');
            $bd.addClass('fui-acc-bd');

            opened ? $acc.addClass('opened') : $acc.addClass('closed');
            opened ? $bd.show() : $bd.hide();

            // 填充head默认内容
            $(getAccHdHtml((i + 1), title)).prependTo($hd);
            var id;
            // 配置个性化的手风琴 且 没有配置showNav
            if (showNav) {
                id = acc.id ? acc.id : (acc.id = 'accordion_' + i);

                navHtml.push(getNavItemHtml(id, title));
            }
        });

        if (showNav) {
            $accNav = $(getNavHtml(navHtml.join('')));
            $accNav.appendTo(document.body);
            // 返回顶部按钮
            $accReturn = $("<div class='fui-acc-return' title='返回顶部' style='display:none;'></div>").appendTo(document.body);

            $accsWrap.addClass('shownav');
            $accNav.find('.acc-menu-item').eq(0).addClass('active');

            setNavPos();

            adjustNavDisplay();
        }
    };

    $accsWrap.on('click', '.fui-acc-toggle', function () {
        var $el = $(this),
            $acc = $el.closest('.fui-accordion'),
            opened = $acc.hasClass('opened'),
            ontoggle = $acc.attr('ontoggle');

        $acc.toggleClass('closed', opened)
            .toggleClass('opened', !opened);
        $acc.find('>.fui-acc-bd').stop(true)[opened ? 'slideUp': 'slideDown'](200);

        if (ontoggle && win[ontoggle]) {
            win[ontoggle](opened ? 'closed' : 'opened');
        }
    });

    var timer;
    // 默认滚动区域为fui-content，滚动时激活对应导航item
    $fuiContent.on('scroll', function (event) {
        var $items = $(".fui-accordion:not(.hidden)"),
            $navItems = $(".acc-menu-item:not(.hidden)");

        clearTimeout(timer);

        timer = setTimeout(function () {
            $items.each(function (i, el) {
                var top = $(el).offset().top;

                if (top >= 0) {
                    $navItems.eq(i).addClass('active')
                        .siblings().removeClass('active');

                    return false;
                }
            });
            var top = $items.eq(0).offset().top;
            if (showNav) {
                if (top <= -100) {
                    $accReturn.show();
                } else {
                    $accReturn.hide();
                }
            }
        }, 200);

    });

    $(win).on('resize', function (e) {
        setNavPos();
    });

    if (showNav) {
        $('body').on('click', function (e) {
            var $target = $(e.target),
                ref = $target.data('ref');

            $scrollEl = $(Util.getFirstScrollEl($accsWrap.find('.fui-accordion')[0]));

            if ($target.closest($accNav).length) {
                if ($target.hasClass('acc-nav-trigger')) {
                    $accNav.toggleClass('active');
                } else if ($target.hasClass('acc-menu-item')) {
                    if ($('#' + ref).hasClass('closed')) {
                        $('#' + ref).find('.fui-acc-toggle').trigger('click');
                    }
                    scroll($target);
                }
            } else {
                $accNav.removeClass('active');
            }

            if ($target.hasClass('fui-acc-return')) {
                // $scrollEl.animate({
                //     scrollTop: 0
                // }, 500);
                scrollTopTo(0);
            }

        });

        // 重写调整高度的方法，在高度调整时，需要同时调整导航的位置
        var _adjustHeight = win.adjustContentHeight;
        win.adjustContentHeight = function(){
            _adjustHeight();
            setNavPos();
        };
    }

    Util.accordion = {
        _accs: $accsWrap.find('[role="accordion"]'),

        _accNavs: undefined,

        _accTpl: '<div role="accordion" class="fui-accordion {{status}}"><div class="fui-acc-hd" role="head" title="{{title}}"><span class="fui-acc-order">{{order}}</span><i class="fui-acc-toggle"></i><h4 class="fui-acc-title">{{title}}</h4></div><div class="fui-acc-bd" role="body"><iframe frameborder="0" width="100%" height="{{contentHeight}}" src="{{url}}"></iframe></div></div>',

        // 显示手风琴项
        showItem: function (index) {
            var $acc = this._accs.eq(index);

            if ($acc.length && $acc.hasClass('hidden')) {
                $acc.removeClass('hidden');
                this._updateOrders();
            }

            if (showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length && $navItem.hasClass('hidden')) {
                    $navItem.removeClass('hidden');
                }
                adjustNavDisplay();
                $fuiContent.trigger('scroll');
            }
        },

        // 隐藏手风琴项
        hideItem: function (index) {
            var $acc = this._accs.eq(index);

            if ($acc.length && !$acc.hasClass('hidden')) {
                $acc.addClass('hidden');
                this._updateOrders();
            }
            if (showNav) {
                var $navItem = this._getAccNavs().eq(index);

                if ($navItem.length && !$navItem.hasClass('hidden')) {
                    $navItem.addClass('hidden');
                }

                adjustNavDisplay();
                $fuiContent.trigger('scroll');
            }
        },
        hideNav: function() {
            if (showNav) {
                showNav = false;
                $accNav.addClass('hidden');
                $accReturn.addClass('hidden');
                $accsWrap.removeClass('shownav');
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

            if (showNav) {
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
                status: opened ? "opened" : "closed",
                contentHeight: contentHeight || "100%"
            });

            $(html).appendTo($accsWrap);

            this._accs = $accsWrap.find('[role="accordion"]');

            this._updateOrders();

            if (showNav) {
                var index = this._accs.length - 1,
                    acc = this._accs[index],
                    id = acc.id ? acc.id : (acc.id = 'accordion_' + index);
                html = getNavItemHtml(id, title);

                $(html).appendTo($accNav.find('.acc-menu-list'));

                this._accNavs = $accNav.find('.acc-menu-item');

                adjustNavDisplay();
            }

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
                this._accNavs = $accNav ? $accNav.find('.acc-menu-item') : undefined;
            }

            return this._accNavs;
        }
    };

    parse();

}(this, jQuery));
// toolbar overflow 支持
(function(win, $) {
    if (!Util.debounce) {
        /**
         * debounce 大于间隔时间时才触发
         * 连续触发时，仅当时间间隔大于指定时间才触发
         *
         * @param {function} fn 要处理的函数
         * @param {number} delay 间隔时间 单位 ms
         * @param {[object]} ctx 要绑定的上下文
         * @returns debounce 后的新函数
         */
        Util.debounce = function(fn, delay, ctx) {
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
    if (!Util.throttle) {
        /**
         * throttle 降低触发频率
         * 连续触发时，降低执行频率到指定时间
         *
         * @param {function} fn 要处理的函数
         * @param {number} delay 间隔时间 单位 ms
         * @param {[object]} ctx 要绑定的上下文
         * @returns throttle 后的新函数
         */
        Util.throttle = function throttle(fn, delay, ctx) {
            delay = delay || 200;
            var timer,
                prevTime = +new Date();
            return function() {
                clearTimeout(timer);
                var args = arguments;
                var context = ctx || this;
                var pastTime = +new Date() - prevTime;

                if (pastTime >= delay) {
                    // 如果过去的时间已经大于间隔时间 则立即执行
                    fn.apply(context, args);
                    prevTime = +new Date();
                } else {
                    // 过去的时间还没到 则等待
                    timer = setTimeout(function() {
                        fn.apply(context, args);
                        prevTime = +new Date();
                    }, delay - pastTime);
                }
            };
        };
    }

    function ToolbarOverflow(el) {
        this.$el = $(el);

        if (!this.$el.length || this.$el.children().length < 2) {
            return;
        }
        if (this.$el[0].getAttribute(this.ATTRIBUTE_PREFIX + 'init') == 'true') {
            var target = ToolbarOverflow.instances[this.$el[0].getAttribute(this.ATTRIBUTE_PREFIX + 'uid')];
            if (!target) {
                return;
            }
            target.update();
            return target;
        }

        this.eventNamespace = ToolbarOverflow.name + '-' + this.uid;
        this.events = {};
        this.$el[0].setAttribute(this.ATTRIBUTE_PREFIX + 'init', 'true');

        this.uid = Util.uuid();
        this.$el[0].setAttribute(this.ATTRIBUTE_PREFIX + 'uid', this.uid);
        ToolbarOverflow.instances[this.uid] = this;

        this.$el.css('position', 'relative');
        this.isOver = false;
        this.$extArea = $('<div class="toolbar-ext-area"></div>').appendTo(this.$el);
        if (this.$el.hasClass('fui-toolbar-bottom')) {
            this.$extArea.css('bottom', '100%');
        } else {
            this.$extArea.css({ top: '100%' });
        }
        this.limit_w = this.$el.width();

        // 记录 toolbar 中最后一个非右浮动的元素
        this.$lastNormalChild = null;
        // 记录 toolbar 中第一个右浮动的元素（排除忽略的）
        this.$firstRightChild = null;

        this._insertToggleBtn();
        this.calcLimited();

        this.initEvent();
        this.update();
    }
    // 记录所有实例
    ToolbarOverflow.instances = {};
    // 获取单个实例
    ToolbarOverflow.getInstance = function(el) {
        if (!el) return null;
        return ToolbarOverflow.instances[$(el).attr(ToolbarOverflow.prototype.ATTRIBUTE_PREFIX + 'uid')];
    };

    $.extend(ToolbarOverflow.prototype, {
        // 属性前缀
        ATTRIBUTE_PREFIX: 'overflow-',
        /**
         * 在移动时需要忽略掉的选择器
         * 帮助按钮、高级搜索展开按钮、高级搜索主要搜索框、toolbar溢出的触发按钮和额外区域
         */
        ignoreSelectors: ['.fui-toolbar-helper', '.fui-search-trigger', '.fui-primary-search', '.fui-toolbar-over-trigger', '.toolbar-ext-area'].join(','),

        /**
         * 更新状态
         *
         */
        update: function() {
            var inner_w = this.calcInnerWidth();
            // 如果按钮已经是展示的 则无需加上宽度 否则要加上 避免出现本来能显示下 显示按钮后恰好展示不下了
            var trigger_w = this.$trigger.is(':visible') ? 0 : this.$trigger.outerWidth(true);
            if (inner_w > this.limit_w) {
                this.isOver = true;
                this.$trigger.removeClass('hidden');
                this.moveToExtArea(inner_w + trigger_w);
            } else {
                this.restoreToToolbar(inner_w);
            }
            return this;
        },

        /**
         * 计算容器的限制宽度
         */
        calcLimited: function() {
            this.limit_w = this.$el.width();
        },
        initEvent: function() {
            var that = this;
            this.$trigger.on('click.' + this.eventNamespace, function() {
                that.toggle();
            });

            $(win).on(
                'resize.' + this.eventNamespace,
                Util.throttle(
                    function() {
                        that.calcLimited();
                        that.update();
                    },
                    Util.browsers.isIE ? 100 : 50
                )
            );
            $(win).on('mousedown.' + this.eventNamespace, function(ev) {
                var $target = $(ev.target);
                if ($target.closest(that.$trigger).length) {
                    return;
                }
                // 点击下拉面板时不应该隐藏
                if ($target.closest('.mini-popup').length) {
					return;
				}
                if (!$target.closest(that.$extArea).length) {
                    that.toggle(false);
                }
            });
        },
        /**
         * 执行观察者或脏检查
         * 外部可能修改内容导致宽度变化需进行处理
         * @returns {() => void} 停止观察或脏检查的函数
         */
        watchOrDirtyCheck: function () {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var handle = Util.debounce(function () {
                this.calcLimited();
                this.update();
            }, 20, this);

            if (MutationObserver) {
                var observer = new MutationObserver(function() {
                    handle();
                    observer.takeRecords();
                });

                observer.observe(this.$el[0], {
                    childList: true,
                    attributes: true,
                    subtree: true
                });

                return function () {
                    observer.disconnect();
                };
            }
            // 不支持只能进行脏检查
            var timer;
            timer = setInterval(function() {
                handle();
            }, 100);
            return function () {
                clearInterval(timer);
            };
        },

        /**
         * 插入触发按钮
         *
         */
        _insertToggleBtn: function() {
            this.$trigger = $('<i></i>').addClass('fui-toolbar-over-trigger hidden r icon-rightdouble action-icon');
            if (this.$el.hasClass('fui-toolbar-bottom') && !this.$el.hasClass('left')) {
                this.$trigger.prependTo(this.$el);
            } else {
                //  顶部的 toolbar 和 左浮动的toolbar
                var $floatRight = this.$el.find('.r');
                if ($floatRight.length) {
                    $floatRight.eq(0).before(this.$trigger);
                } else {
                    this.$trigger.appendTo(this.$el);
                }
            }
        },

        /**
         * 切换额外区域的显示和隐藏 仅在溢出时生效
         *
         * @param {boolean | undefined} show 传递布尔值时 true 显示， false 隐藏； 不传值时切换状态
         * @returns
         */
        toggle: function(show) {
            if (!this.isOver) {
                return;
            }

            if (show === undefined) {
                this.$trigger.toggleClass('active');
                return this.$extArea.slideToggle(200, setZIndex);
            }
            if (show) {
                this.$trigger.addClass('active');
                this.$extArea.slideDown(200, setZIndex);
            } else {
                this.$trigger.removeClass('active');
                this.$extArea.slideUp(200);
            }
            function setZIndex() {
                var $this = $(this);
                if ($this.is(':visible')) {
                    $this.css('z-index', Util.getZIndex());
                    $(win).trigger('resize');
                }
            }
        },

        /**
         * 计算 toolbar 区域中的元素宽度 并做缓存
         *
         * @returns {number} 计算得出的宽度
         */
        calcInnerWidth: function() {
            var inner_w = 0;
            this.$el.children().each(function(i, el) {
                var $el = $(el);
                if ($el.hasClass('toolbar-ext-area')) {
                    // 扩展区域的 也需要更新一下
                    var ext_w = 0;
                    // 不可见需先调整为可见 计算完成再隐藏
                    var isVisible = $el.is(':visible');
                    if (!isVisible) {
                        $el.addClass('hidden-accessible').show();
                    }
                    $el.css('width', '10000px')
                        .children()
                        .each(function(j, item) {
                            var $item = $(item);
                            var w = $item.is(':hidden') ? 0 : $item.outerWidth(true);
                            $item.data('width', w);
                            ext_w += w;
                        });
                    if (!isVisible) {
                        $el.removeClass('hidden-accessible').hide();
                    }
                    $el.data('width', ext_w).css('width', ext_w + 2);
                    return;
                }
                var w = $el.is(':hidden') ? 0 : $el.outerWidth(true);
                $el.data('width', w);
                inner_w += w;
            });
            return inner_w + 2; // 由于字体放大后，会产生小数的请求，导致最后计算出来的值偏小
        },

        /**
         * 获取 toolbar 中 视觉上的最后一个元素
         * 几个应固定在最右侧的已经排除在外 具体配置在 ignoreSelectors 中
         *
         * @returns
         */
        getToolbarLastChild: function() {
            var $floatRights = this.$el.find('> .r');

            var i = 0,
                len = 0;

            // 优先右浮动的 正序取出 即为最后的
            for (i = 0, len = $floatRights.length; i < len; i++) {
                var $currR = $floatRights.eq(i);
                // 在忽略列表中 则取下一个
                if ($currR.filter(this.ignoreSelectors).length || $currR.is(':hidden')) {
                    continue;
                } else {
                    return $currR;
                }
            }

            // 仍未返回则中最后开始取
            var $children = this.$el.children().filter(function(i, el) {
                var $el = $(el);
                return !$el.hasClass('r') && !$el.is(':hidden');
            });

            for (i = $children.length - 1; i > 0; i--) {
                var $currN = $children.eq(i);
                if ($currN.filter(this.ignoreSelectors).length) {
                    continue;
                } else {
                    return $currN;
                }
            }
        },

        /**
         * 宽度溢出 移动到额外区域
         *
         * @param {number} inner_w 当前 toolbar 中元素的宽度
         */
        moveToExtArea: function(inner_w) {
            if (!inner_w) {
                inner_w = this.calcInnerWidth();
            }
            // 移动导致新增的宽度
            var addedWidth = 0;
            // 记录当前元素的宽度
            var currWidth = 0;
            do {
                var $aim = this.getToolbarLastChild();
                if ($aim && $aim.length) {
                    if ($aim.hasClass('r')) {
                        this.$firstRightChild = $aim.next();
                    } else {
                        this.$lastNormalChild = $aim.prev();
                    }
                    currWidth = $aim.data('width');
                    addedWidth += currWidth;
                    inner_w -= currWidth;
                    $aim.prependTo(this.$extArea);
                } else {
                    this.$firstRightChild = this.$lastNormalChild = null;
                    break;
                }
            } while (inner_w > this.limit_w);

            if (addedWidth) {
                var w = (this.$extArea.data('width') || 0) + addedWidth;
                this.$extArea.css('width', w + 2).data('width', w);
            }
        },
        /**
         * 获取第一个可还原的元素
         *
         * @returns
         */
        getFirstExtraChild: function() {
            return this.$extArea.children(':eq(0)');
        },
        /**
         * 处理某个元素还原到正确的位置
         *
         * @param {jQuery Object} $targetChild 要处理元素
         * @returns
         */
        restoreToRightPos: function($targetChild) {
            // 右浮动的
            if ($targetChild.hasClass('r')) {
                if (this.$firstRightChild && this.$firstRightChild.length) {
                    this.$firstRightChild.before($targetChild);
                    this.$firstRightChild = $targetChild;
                } else {
                    $targetChild.appendTo(this.$targetChild);
                }
                return;
            }

            // 正常的直接插入到正常的最后一个的后面即可
            if (this.$lastNormalChild && this.$lastNormalChild.length) {
                this.$lastNormalChild.after($targetChild);
                // 更新记录
                this.$lastNormalChild = $targetChild;
            } else {
                $targetChild.appendTo(this.$el);
            }
        },
        /**
         * 判断当前元素是否可被还原
         *
         * @param {jQuery Object} $targetChild 要测试能否被还原的元素
         * @param {number} currInner_w 当前 toolbar 中所有元素的宽度
         * @returns
         */
        _restorable: function($targetChild, currInner_w) {
            if (!$targetChild.length) {
                return false;
            }
            return currInner_w + $targetChild.data('width') <= this.limit_w;
        },
        /**
         * 像 toolbar 中还原元素
         * @param {number} currInner_w 开始调整时的 toolbar 内部元素宽度
         * @param {boolean | undefined}  是否强制还原所有元素
         * @returns {undefined}
         * @memberof ToolbarOverflow
         */
        restoreToToolbar: function(currInner_w, force) {
            var $firstChild = this.getFirstExtraChild();

            while ((force && $firstChild.length) || this._restorable($firstChild, currInner_w)) {
                // 还原
                this.restoreToRightPos($firstChild);
                // 更新宽度
                var ext_w = (this.$extArea.data('width') || 0) - $firstChild.data('width');
                this.$extArea.data('width', ext_w);

                currInner_w += $firstChild.data('width');
                $firstChild = this.getFirstExtraChild();
            }

            this.$extArea.css('width', this.$extArea.data('width') + 2);
            // 是否全部还原完了
            if (force || !this.$extArea.children().length) {
                this.allRestore();
            }
        },
        /**
         * 全部还原后的统一调整
         * @returns {undefined}
         * @memberof ToolbarOverflow
         */
        allRestore: function() {
            this.isOver = false;
            this.$trigger
                .addClass('hidden')
                .data('width', 0)
                .removeClass('active');
            this.$extArea.hide();
        },
        /**
         * 实例销毁
         * @returns {undefined}
         * @memberof ToolbarOverflow
         */
        destroy: function() {
            this.$trigger.off('click');
            $(win).off('resize.' + this.eventNamespace);
            $(win).off('mousedown.' + this.eventNamespace);

            this.restoreToToolbar(null, true);

            this.$trigger.remove();
            this.$extArea.remove();
            this.$el[0].removeAttribute(this.ATTRIBUTE_PREFIX + 'uid');
            this.$el[0].removeAttribute(this.ATTRIBUTE_PREFIX + 'init');

            ToolbarOverflow.instances[this.uid] = null;
            delete ToolbarOverflow.instances[this.uid];

            for (var k in this) {
                if (Object.prototype.hasOwnProperty.call(this, k)) {
                    this[k] = null;
                    delete this[k];
                }
            }
        }
    });

    win.ToolbarOverflow = ToolbarOverflow;

    // auto init
    $(function() {
        $('.fui-toolbar:eq(0), .fui-toolbar-bottom:eq(0)').each(function(i, item) {
            // eslint-disable-next-line no-new
            new ToolbarOverflow(item);
        });
    });
})(this, jQuery);

/*!
 * 通过body master属性动态载入导航模板资源
 */
(function (win, $) {
    var MASTER_NAMES = ['leftAccNav', 'leftAccTree', 'topWizard', 'leftWizard', 'topTabNav'];

    var $content = $('body > .master-content'),
        master = $content.attr('master'),
        srcdir = $content.attr('srcdir'); // 获取个性化的目录路径

    // 获取路径前半部分，如：fui/js/navpages/name/name
    var getPathPrefix = function (name) {
        var path = 'frame/fui/js/widgets/navpages'; // 默认路径
        if (srcdir) {
            path = srcdir; // 个性化路径
        }
        return path + '/' + name + '/' + name;
    };

    // 初始化模板结构和资源
    var initMaster = function (name) {
        var prefix = getPathPrefix(name);

        // $content.load(Util.getRightUrl(prefix + '_snippet.html'), function () {
        $.ajax(Util.getRightUrl(prefix + '_snippet.html')).done(function(tplHtml) {
            $content.replaceWith(tplHtml);
            if ($.inArray(name, ['leftAccNav', 'leftAccTree']) != -1) {
                // Util.leftRight.parse();
                Util.layoutInstance.parse();
            }

            Util.loadCss(prefix + '.css');
            Util.loadJs(prefix + '.js');
        });
    };

    $(function () {
        $content.length && initMaster(master);
    });

}(this, jQuery));
/*
 * 不带标题的轻量化弹窗
 */
'use strict';
(function(win, $){
    var defaultConfig = {
        showModal: true,
        showCloseButton: true,
        width: 600,
        height: 400
    };
    var LightDialog = function(cfg){
        this.cfg = $.extend({},defaultConfig, cfg);

        this.__onDestroy = cfg.ondestroy;
        this.__onLoad = cfg.onload;

        this._init();
    };

    LightDialog.prototype = {
        constructor: LightDialog,

        _init: function(){
            this.$container = $('<div class="lightdialog hidden"><iframe width="100%" height="100%" frameborder="0"></iframe><i class="lightdialog-close hidden"></i></div>');
            this.$iframe = this.$container.children('iframe');

            this.$closeIcon = this.$container.children('.lightdialog-close');

            this.$iframe[0].src = Util.getRightUrl(this.cfg.url);

            var self = this;
            this.$iframe.on('load', function(){
                self._doLoadIframe();
            });

            if(this.cfg.showModal) {
                this.$modal = $('<div class="lightdialog-modal hidden"></div>').appendTo('body');
            }

            if(this.cfg.showCloseButton) {
                this.$closeIcon.removeClass('hidden');
                this.$closeIcon.on('click', function(){
                    var ret = true;
                    try {
                        if (self.__onDestroy) ret = self.__onDestroy('close');
                    } catch (ex) {
                        console.error(ex);
                     }

                    if (ret === false) {
                        return false;
                    }
                    self.close();
                });
            }

            this.$container.appendTo('body');
        },

        _doLoadIframe: function() {
            var self = this;
            function CloseOwnerWindow(action) {
                var ret = true;
                try {
                    if (self.__onDestroy) ret = self.__onDestroy(action);
                } catch (ex) { 
                    console.error(ex);
                }

                if (ret === false) {
                    return false;
                }

                setTimeout(function () {
                    self.close();
                }, 10);
            }

            try {

                this.$iframe[0].contentWindow.Owner = win;
                this.$iframe[0].contentWindow.CloseOwnerWindow = CloseOwnerWindow;
            } catch (e) { }

            if(this.__onLoad) {
                this.__onLoad();
            }
        },

        _doRemoveIFrame: function() {
            if(this.$iframe) {
                Util.clearIframe(this.$iframe);

                this.$iframe = null;
            }
        },

        show: function() {
            var winBox = Util.getWinSize(),
                width = parseInt(this.cfg.width, 10),
                height = parseInt(this.cfg.height),
                left = (winBox.width - width) / 2,
                top = (winBox.height - height) / 2;

            if(this.cfg.showModal) {
                this.$modal.css('z-index', Util.getZIndex()).removeClass('hidden');
            }

            this.$container.css({
                left: left,
                top: top,
                width: width,
                height: height,
                zIndex: Util.getZIndex()
            }).removeClass('hidden');
        },

        close: function(){
            this._doRemoveIFrame();

            this.$container.remove();
            this.$modal && this.$modal.remove();
        },

        getIFrameEl: function() {
            return this.$iframe ? this.$iframe[0] : undefined;
        }
    };

    var topWin;
    function getTopWin(me) {
        try {
            if (me.Util && me.Util.openLightDialog) topWin = me;
            if (me.parent && me.parent != me) {
                getTopWin(me.parent);
            }
        } catch (ex) { }
    }

    $.extend(Util, {
        openLightDialog: function(cfg) {
            var dialog = new LightDialog(cfg);
    
            dialog.show();
    
            return dialog;
        },
        openTopLightDialog: function(cfg) {
            topWin || getTopWin(win);
            return topWin.Util.openLightDialog(cfg);
        }
    });
    
})(this, jQuery);
/*!
 * 其他通用的最页面功能效果增强的扩展
 */

// 隐藏页面loading效果
(function(win, $) {
    var $pageLoading = $('body > .page-loading');

    Util.hidePageLoading = function() {
        if (!$pageLoading.length) return;

        $pageLoading.fadeOut(300, function() {
            $pageLoading.remove();
        });
    };
})(this, jQuery);

// 添加 ajax 全局处理
(function (win, $) {
    var fp = localStorage.getItem('fingerprint') || '',
        userSign = Util.getFrameSysParam('epoint_user_loginid') || '';
    if (!fp) {
        calcFingerPrint();
    }

    function calcFingerPrint() {
        Fingerprint2.get(function (components) {
            var values = components.map(function (component) {
                return component.value;
            }); // 配置的值的数组
            fp = Fingerprint2.x64hash128(values.join(''), 31); // 生成浏览器指纹
            localStorage.setItem('fingerprint', fp);
        });
    }

    $.ajaxSetup({
        beforeSend: function (XMLHttpRequest) {
            var csrfcookie = Util.readCookie(win.CSRF_COOKIE_NAME || '_CSRFCOOKIE'),
                reqTime = new Date().getTime(),
                deviceId,
                userToken;

            // 如果已经有指纹，直接把指纹放到header中
            if (fp) {
                deviceId = fp;
                userToken = 'userSign=' + userSign + ',reqTime=' + reqTime + ',deviceId=' + deviceId;
            }
            // 对csrf防御处理
            if (csrfcookie) {
                XMLHttpRequest.setRequestHeader(win.CSRF_HD_NAME || 'CSRFCOOKIE', csrfcookie);
            }
            XMLHttpRequest.setRequestHeader('User-Token', userToken);
        },
        // 通用的状态码处理
        statusCode: Util._handleStatusCode()
    });
})(this, jQuery);

// 浏览器检测提醒
(function() {
    // 非主界面无需加载
    if (!/^https?:\/\/.*\/fui\/pages\/themes\/(\w+)\/\1/i.test(location.href)) return;

    // 加载文件自动提醒
    Util.loadJs('frame/fui/js/widgets/browsertips/browsertips.js');
})();

// 阻止IE下退格键回退页面
(function(win, $) {
    if (Util.browsers.isIE) {
        $(document).on('keydown', function(e) {
            var keyCode = e.which;
            var elem = e.target;
            var name = elem.nodeName;
            if (keyCode == 8) {
                if (name != 'INPUT' && name != 'TEXTAREA' && elem.contentEditable != 'true') {
                    return false;
                }
                var type_e = elem.type ? elem.type.toUpperCase() : '';
                if (name == 'INPUT' && (type_e != 'TEXT' && type_e != 'TEXTAREA' && type_e != 'PASSWORD' && type_e != 'FILE')) {
                    return false;
                }
                if (name == 'INPUT' && (elem.readOnly == true || elem.disabled == true)) {
                    return false;
                }
            }
        });
    }
})(this, jQuery);

// 为通过第三方安全检测，隐藏js库的版本号
(function($, Mustache) {
    var d = new Date();
    var t = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('.');
    d = null;

    try {
        // jquery / jquery.ui 版本号
        // jquery 版本号的隐藏已通过直接修改文件来实现
        // $.fn.jquery = $.ui.version = t;
        // Mustache 版本号
        Mustache.version = t;
    } catch (err) {}
})(jQuery, this.Mustache);

// 重写 JSON.parse 方法，以支持电子交易那边不正常的用法
(function(win) {
    if (win.JSON && JSON.parse) {
        var _oParse = JSON.parse;

        JSON.parse = function(s) {
            if (typeof s == 'object') {
                return s;
            }

            return _oParse(s);
        };
    }
})(this);
// 添加对操作系统版本的标记，临时解决左右布局中切换按钮在win7系统下的显示不全问题
(function($) {
    var version = navigator.userAgent,
        $document = $(document.documentElement);

    if (version.indexOf('Windows NT 5.1') > -1 || version.indexOf('Windows XP') > -1) {
        $document.addClass('winxp');
    } else if (version.indexOf('Windows 7') > -1 || version.indexOf('Windows NT 6.1') > -1) {
        $document.addClass('win7');
    } else if (version.indexOf('Windows NT 10.0') > -1 || version.indexOf('Windows 10') > -1) {
        $document.addClass('win10');
    }
})(jQuery);

// btn group 中按钮显隐变化后的适配
(function(win, $) {
    var observer;
    function markGroupBtn($group) {
        var $visibleBtns = $group.children().filter(function(i, btn) {
            var $btn = $(btn);
            return /(?:mini-button|mini-webuploader)/.test(btn.className) && $btn.is(':visible');
        });

        var lastIndex = $visibleBtns.length - 1;
        $visibleBtns.each(function(i, btn) {
            $(btn).removeClass('mini-btn-group-first mini-btn-group-last');
            // 修改属性会再次触发变化 手动清空待处理队列
            observer && observer.takeRecords();
            if (i === 0) {
                $(btn).addClass('mini-btn-group-first');
                observer && observer.takeRecords();
            }
            if (i === lastIndex) {
                $(btn).addClass('mini-btn-group-last');
                observer && observer.takeRecords();
            }
        });
    }

    /**
     * 适配 mini-btn-group 中的按钮样式
     *
     * @param {undefined|string|jQueryObject|HTMLElement} $targetGroup 要适配的 btngroup 省略时处理页面全部
     */
    function adaptButtonGroup($targetGroup) {
        var $btnGroup = $targetGroup ? $($targetGroup) : $('.fui-toolbar .mini-btn-group, .fui-toolbar-bottom .mini-btn-group');
        $btnGroup.each(function(i, group) {
            markGroupBtn($(group));
        });
    }
    Util.adaptButtonGroup = adaptButtonGroup;

    $(win).on('load', function () {
        adaptButtonGroup();
        // 如果支持 MutationObserver 则自动观察并适配
        win.MutationObserver &&  initObserver();
    });
    

    function initObserver() {
        observer = new MutationObserver(function(mutationsList) {
            mutationsList.forEach(function(mutation) {
                var type = mutation.type;
                switch (type) {
                    case 'childList':
                        handleAddOrRemove(mutation);
                        break;
                    case 'attributes':
                        handleAttributesChange(mutation);
                        break;
                    default:
                        break;
                }
            });
        });

        function handleAddOrRemove(/** @type MutationRecord */ mutation) {
            var $target = $(mutation.target);
            if ($target.hasClass('mini-btn-group')) {
                markGroupBtn($target);
            }
        }

        function handleAttributesChange(/** @type MutationRecord */ mutation) {
            if (mutation.attributeName == 'style' || mutation.attributeName === 'class') {
                markGroupBtn($(mutation.target).closest('.mini-btn-group'));
            }
        }

        $('.fui-toolbar .mini-btn-group, .fui-toolbar-bottom .mini-btn-group').each(function(i, el) {
            observer.observe(el, { childList: true, attributes: true, attributeOldValue: true, characterData: false, subtree: true });
        });
        $(win).on('beforeunload', function() {
            observer.disconnect();
        });
    }
})(this, this.jQuery);

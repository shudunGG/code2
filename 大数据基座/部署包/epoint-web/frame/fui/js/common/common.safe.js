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
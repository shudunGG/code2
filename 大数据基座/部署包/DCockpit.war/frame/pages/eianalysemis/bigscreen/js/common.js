'use strict';
/* global layer */

// 工具方法

if (!window.Util) {
    window.Util = {};
}
$.extend(window.Util, {
    /**
     * 获取数组中指定属性的最大值
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 最大数值
     * @example [{key:166},{key:200},{key:33}]=>getMax(arr,'key);=>200
     */
    getMax: function(arr, key) {
        var max = 0,
            len = arr.length;
        for (var i = 0; i < len; i++) {
            var item = arr[i][key];
            if (max < item) max = item;
        }
        return max;
    },
    /**
     * 获取数组中指定属性的最小值
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 最小值
     * @example [{key:166},{key:200},{key:33}]=>getMax(arr,'key);=>33
     */
    getMin: function(arr, key) {
        if (arr.length === 0) return;
        var min = arr[0][key],
            len = arr.length;
        for (var i = 1; i < len; i++) {
            var item = arr[i][key];
            if (min > item) min = item;
        }
        return min;
    },
    /**
     *将字符串按照固定的字数截取
     * @param {String} str 需要处理的字符串
     * @param {Number} num 截断间隔
     * @param {Str} split 需要插入的字符，不传默认换行符 '\n'
     */
    splitStr: function(str, num, split) {
        var splitStr = split || '\n',
            reg = new RegExp('(\\S{' + num + '})', 'g'),
            reg2 = new RegExp('(\\' + splitStr + ')$'),
            fmtStr = str.replace(reg, '$1' + splitStr);
        return fmtStr.replace(reg2, '');
    },
    /**
     * 数组分组，用于多页面渲染
     * @param {Number} num 每组元素的数量
     * @param {Array} arr 需要处理的数组
     */
    getArrTrans: function(arr, num) {
        var resultArr = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var page = Math.floor(i / num);
            if (!resultArr[page]) {
                resultArr[page] = [];
            }
            resultArr[page].push(arr[i]);
        }
        return resultArr;
    },
    /**
     * 根据value查找key
     * @param {Object} object 需要查找的对象
     * @param {Function} predicate 查询条件
     */
    findKey: function(object, predicate) {
        var result;

        // eslint-disable-next-line no-eq-null
        if (object == null) {
            return result;
        }

        Object.keys(object).some(function(key) {
            var value = object[key];

            if (predicate(value, key, object)) {
                result = key;
                return true;
            }
        });
        return result;
    },
    /**
     * 获取数组指定属性的和
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 和
     * @example [{key:166},{key:200},{key:33}]=>getSum(arr,'key);=>399
     */
    getSum: function(arr, key) {
        var sum = 0,
            len = arr.length;
        for (var i = 0; i < len; i++) {
            sum += arr[i][key];
        }
        return sum;
    },
    /**
     * 获取数组中指定属性的数组
     * @param {Array} arr 源数组
     * @param {String} key 指定属性
     * @returns {Array} 目标数组
     * @example [{key:166},{key:200},{key:33}]=>getValArr(arr,'key);=>[166,200,33]
     */
    getValArr: function(arr, key) {
        var val = [],
            len = arr.length;
        for (var i = 0; i < len; i++) {
            val.push(arr[i][key]);
        }
        return val;
    },
    /**
     * 加载滚动数字
     * @param {Object} $dom dom容器
     * @param {Number} data 数值
     * @param {Number} figure 长度
     */
    scrollNumber: function(id, value, figure, options) {
        var $dom = $(id);
        value = value || 0;
        options = $.extend({
                value: value,
                figure: figure,
                delay: 1500,
            },
            options
        );
        if ($.fn.scrollNumber) {
            if (!$dom.data('scrollnumberinit')) {
                $dom.data('scrollnumberinit', 1);
                options.number = value;
                $dom.scrollNumber(options);
            } else {
                $dom.scrollNumber('refresh', value);
            }
        } else {
            console.warn('请引入jquery.scrollnumber.js');
        }
    },
    /**
     * 快速渲染数字
     * @param {String} space 命名空间
     * @param {Object} data 数据
     * @param {Boolean} animate 是否动态加载效果
     * @param {Function} filterFn 过滤函数，处理渲染结果，比如加单位
     */
    renderNum: function(space, data, filterFn) {
        for (var i in data) {
            if (Object.prototype.hasOwnProperty.call(data, i)) {
                var $dom = $('#' + space + '-' + i);
                if ($dom.length > 0 && data[i] && data[i] != 0) {
                    $dom.removeClass('hidden').text(filterFn ? filterFn(data[i]) : data[i]);
                }
            }
        }
    },
    /**
     * 动态载入、更新数字，需要引入插件countUp.js
     * @param {String} id 元素ID
     * @param {Number} value 数据
     * @param {Object} options 插件自定义配置，可不传
     */
    animateNumber: function(id, value, options) {
        var $dom = $(id);

        if ($dom.length) {
            if (!isNaN(value)) {
                if (window.CountUp) {
                    var dotIdx = String(value).indexOf("."), //获取小数点的位置
                        decimal = 0; // 默认整数
                    if (dotIdx > -1) {
                        decimal = String(value).length - dotIdx - 1; //获取小数点后的个数
                    }

                    var settings = $.extend({}, {
                            //定义是否开启缓动
                            useEasing: true,
                            //是否开启分组
                            useGrouping: false,
                            decimalPlaces: decimal,
                        },
                        options || {}
                    );

                    $dom.each(function() {
                        if (!$(this).data('countup')) {
                            var num = new CountUp(this, value, settings);
                            if (!num.error) {
                                //开启滚动
                                num.start();
                            } else {
                                // eslint-disable-next-line no-console
                                console.log(num.error);
                            }
                            $(this).data('countup', num);
                        } else {
                            $(this).data('countup').update(value);
                        }
                    });
                } else {
                    $dom.text(value);
                    console.warn('请引入countUp.min.js');
                }
            } else {
                $dom.text(value);
            }
        }
    },
    /**
     * 动态载入、更新数字，需要引入插件countUp.js
     * @param {String} space 命名空间
     * @param {Number} data 数据
     * @param {Object} options 插件自定义配置，可不传
     */
    animateRender: function(space, data, options) {
        for (var i in data) {
            if (Object.prototype.hasOwnProperty.call(data, i)) {
                var $dom = $('#' + space + '-' + i),
                    d = data[i] - 0;
                if ($dom.length > 0) {
                    if (!isNaN(d)) {
                        var dotIdx = String(data[i]).indexOf('.'), //获取小数点的位置
                            decimal = 0; // 默认整数
                        if (dotIdx > -1) {
                            decimal = String(data[i]).length - dotIdx - 1; //获取小数点后的个数
                        }
                        var countUpOption = $.extend({}, {
                            //定义是否开启缓动
                            useEasing: true,
                            //是否开启分组
                            useGrouping: false,
                            decimalPlaces: decimal
                        }, options || {});
                        if (!$dom.data('countUp')) {
                            var num = new CountUp(space + '-' + i, data[i], countUpOption);
                            if (!num.error) {
                                //开启滚动
                                num.start();
                            } else {
                                // eslint-disable-next-line no-console
                                console.log(num.error);
                            }
                            //  = num;
                            $dom.data('countUp', num);
                        } else {
                            $dom.data('countUp').update(data[i]);
                        }
                    } else {
                        $dom.text(data[i]);
                    }
                }
            }
        }
    },
    /**
     * 载入状态，类似renderNum
     * @param {String} space 命名空间
     * @param {Number} data 数据
     * @param {String} stateCls 状态名称前缀，不传默认'state'
     */
    renderState: function(space, data, stateCls) {
        for (var i in data) {
            if (Object.prototype.hasOwnProperty.call(data, i)) {
                var $dom = $('#' + space + '-' + i);
                if ($dom.length > 0) {
                    $dom.attr('data-' + (stateCls || 'state'), data[i]);
                }
            }
        }
    },
    /**
     * 获取百分比
     * @param {Number} max 最大值
     * @param {Number} data 数据
     * @param {Number} fixed 精确到小数点位数，可不传，默认为0
     * @param {Number} unit 配置单位，可不传，默认%
     */
    getPercent: function(max, data, fixed, unit) {
        var _fixed = fixed || 0;
        var percent = (data / max * 100).toFixed(_fixed) + (unit || '%');
        return percent;
    },
    /**
     * 图表自动切换展示tooltip
     * @param {Object} chart 图表实例
     * @param {Number} length 图表数据量
     * @param {Number} interval 切换间隔，单位ms
     */
    showTooltip: function(chart, length, interval) {
        chart.dataLength = length;
        chart.currentIndex = 0;
        clearInterval(chart.timer);
        chart.interval = interval || 3000;
        chart.timer = setInterval(function() {
            if (chart.currentIndex === chart.dataLength) {
                chart.currentIndex = 0;
            }
            chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: chart.currentIndex
            });
            chart.currentIndex++;
        }, chart.interval);
    },
    /**
     * 鼠标悬浮到图表，停止showTooltip
     * @param {Object} chart 图表实例
     * @param {Number} length 图表数据量
     */
    chartHover: function(chart, length) {
        chart.on('mouseover', function() {
            clearInterval(chart.timer);
        });
        chart.on('mouseout', function() {
            Util.showTooltip(chart, length, chart.interval || 3000);
        });
    },
    /**
     * 定时切换地图高亮
     * @param {Object}chartInstance 图表实例
     * @param {Number} length 数据长度
     */
    areaHight: function(chartInstance, length) {
        chartInstance.dataLen = length;
        chartInstance.curData = 0;
        clearInterval(chartInstance.hightTimer);
        chartInstance.hightTimer = setInterval(function() {
            if (chartInstance.curData === chartInstance.dataLen) {
                chartInstance.curData = 0;
            }
            // 取消高亮
            chartInstance.dispatchAction({
                type: 'downplay',
                seriesIndex: 0
            });
            // 高亮地图区域
            chartInstance.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: chartInstance.curData
            });
            // 显示悬浮窗
            chartInstance.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: chartInstance.curData
            });
            chartInstance.curData++;
        }, 3000);
    },
    /**
     * 地图图表专用：鼠标悬浮到地图，停止showTooltip
     * @param {Object} chart 图表实例
     * @param {Number} length 图表数据量
     */
    mapChartHover: function(chart, length) {
        chart.on('mouseover', function() {
            clearInterval(chart.hightTimer);
        });
        chart.on('mouseout', function() {
            Util.areaHight(chart, length, chart.interval || 3000);
        });
    },
    /**
     * 自定义高亮，可配置高亮触发行为、高亮类名、回调等。
     * @param {Object} $ct 被委托jq容器
     * @param {String} target 委托监听目标选择器字符串
     * @param {Function} successFn 成功回调
     * @param {String} event 触发行为，可不传，默认监听click事件
     * @param {String} activeClass 高亮类名，可不传，默认active
     */
    activeDom: function($ct, target, successFn, event, activeClass) {
        var cls = activeClass || 'active';
        $ct.on(event || 'click', target, function(e) {
            var $this = $(this);
            if ($this.hasClass(cls)) return;
            $this.addClass(cls).siblings().removeClass(cls);
            // successFn接收点击事件和点击目标的jq对象作为参数
            successFn(e, $this);
            // 返回父容器jq对象，可以链式执行其他操作
            return $ct;
        });
    },
    /**
     * 数字千分位转换
     * @param {Number} n 转换数字
     */
    addCommas: function(n) {
        if (isNaN(n)) {
            return '-';
        }
        n = (n + '').split('.');
        return n[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') +
            (n.length > 1 ? ('.' + n[1]) : '');
    },
    /**
     * 生成随机数
     * @param {Number} m 最小值
     * @param {Number} n 最大值
     */
    randNum: function(m, n) {
        if (!n) {
            return Math.floor(Math.random() * m);
        }
        var c = n - m + 1;
        return Math.floor(Math.random() * c + m);
    },
    /**
     * echarts自适应
     */
    echartsResize: function() {
        var echartsResizeTimer = null;
        return function() {
            $(window).on('resize', function() {
                // 获取所有echarts容器的jQuery对象
                var $echarts = $('[_echarts_instance_]');
                if (echartsResizeTimer) clearTimeout(echartsResizeTimer);
                echartsResizeTimer = setTimeout(function() {
                    $.each($echarts, function(i, e) {
                        // 调用echarts的api获取图表实例，执行缩放
                        var chart = echarts.getInstanceByDom(e);
                        chart.resize();
                    });
                }, 50);
            });
        };
    },
    /**
     * echarts渐变色,适用双色渐变，可根据实际需求改写,方向参数可不传，默认水平方向渐变
     * @param {String} color1 jquery dom对象
     * @param {String} color2 html字符串
     * @param {Number} x1 渐变色方向起点的x坐标
     * @param {Number} y1 渐变色方向起点的y坐标
     * @param {Number} x2 渐变色方向终点的x坐标
     * @param {Number} y2 渐变色方向终点的y坐标
     */
    linearColor: function(color1, color2, x1, y1, x2, y2) {
        return new echarts.graphic.LinearGradient(
            ((typeof x1 === 'number') && x1 < 1) ? x1 : 1,
            ((typeof y1 === 'number') && y1 < 1) ? y1 : 0,
            ((typeof x2 === 'number') && x2 < 1) ? x2 : 0,
            ((typeof y2 === 'number') && y2 < 1) ? y2 : 0, [{
                    offset: 0,
                    color: color1
                },
                {
                    offset: 1,
                    color: color2
                }
            ]
        );
    },
    /**
     * 滚动列表，需要引入scrollbox插件使用
     * @param {Object} $dom jquery dom对象
     * @param {String} htmlStr html字符串
     */
    scrollList: function($dom, htmlStr) {
        $dom.empty().append(htmlStr);
        if (!$dom.isScroll) {
            $dom.isScroll = true;
            $dom.parent().scrollbox();
        }
    },
    /**
     * 点击高亮
     * @param {Object} $dom jquery dom对象
     * @param {Function} fn 高亮回调，默认传入jq dom对象和其他额外参数
     */
    act: function($dom, fn) {
        if ($dom.hasClass('active')) {
            return;
        }
        var ctx = this,
            args = Array.prototype.slice.call(arguments, 2);
        $dom.addClass('active').siblings().removeClass('active');
        args.unshift($dom);
        fn && fn.apply(ctx, args);
    },
    /**
     * 定位调试辅助方法
     * @param {Object} $dom jquery dom对象
     * @param {Boolean} isCss 是否转换为css
     */
    getPos: function($dom, isCss) {
        $dom.on('click', function(e) {
            var pos = this.getBoundingClientRect(),
                psdStr = '[' + (e.pageX - pos.x - window.scrollX) + ',' + (e.pageY - pos.y - window.scrollY) + ']';
            if (isCss) {
                psdStr = 'left: ' + (e.pageX - pos.x - window.scrollX) + 'px;top: ' + (e.pageY - pos.y - window.scrollY) + 'px;';
            }
            // eslint-disable-next-line no-console
            console.log(psdStr);
            var target = document.createElement('div');
            target.id = 'tempTarget';
            target.style.opacity = '0';
            target.style.position = 'absolute';
            target.innerText = psdStr;
            var range = document.createRange();
            var target2 = document.body.appendChild(target);
            try {
                range = document.createRange();
                range.selectNode(target);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
                // eslint-disable-next-line no-catch-shadow
            } catch (error) {}
            target.remove();
            target2.remove();
        });
    },
    /**
     * 删除链接中的html后缀
     * @param {String} url 需要处理的url字符串
     */
    removeHtml: function(url) {
        if (Config.debugInF9) {
            return url.replace(/\.html/ig, '');
        }
        return url;
    },
    /**
     * 模板快速渲染，模板的dom id 为 父容器dom id + ’-temp‘ 后缀
     * 如：#list 容器 对应的模板id为 #list-temp
     * @param {String} id 需要处理的url字符串
     * @param {Array|Object} data 被渲染数据
     */
    renderTemp: function(id, data) {
        var $temp = $('#' + id + '-temp');
        if ($temp && Mustache) {
            var temp = $('#' + id + '-temp').html();
            $('#' + id).empty().append(Mustache.render(temp, data));
        }
    },
    // 在顶层打开弹窗弹窗
    openTopLayer: function(param) {
        var width = param.width || '6.2rem',
            height = param.height || '5.25rem';
        var options = {
            type: 2,
            title: param.title || false,
            id: param.id || '',
            area: [width, height],
            content: [param.url, 'no'],
        };

        // 添加成功回调
        if (param.success) {
            options.success = param.success();
        }
        top.layer.open(options);
    },
    // 关闭顶层弹窗
    closeTopLayer: function() {
        var mylay = top.layer.getFrameIndex(window.name);
        top.layer.close(mylay);
    }
});

(function($, exports) {
    var M = Mustache;
    M._rendererCache = {};

    // 模板 内部类
    var Template = function(id) {
        this.tpl = Util.getTplStr(id);
        // 预处理，提高后续渲染效率
        M.parse(this.tpl);
    };

    $.extend(Template.prototype, {
        // 设置视图数据
        setView: function(data) {
            this.view = data;
            return this;
        },

        // id 为 container id 或者 dom节点
        renderTo: function(id) {
            var dom = null;
            dom = $.type(id) === 'string' ? document.getElementById(id) : id;
            $(dom).html(M.render(this.tpl, this.view));
        },
    });

    var Renderer = function(arg1, arg2) {
        if (typeof arg1 == 'string' && typeof arg2 == 'object') {
            this.getTplStr(arg1);
            this.createHtml(arg2);
        } else if (typeof arg1 == 'object') {
            this.data = arg1;
            this.target = arg2 || 'data-render';
        }
    };

    $.extend(Renderer.prototype, {
        getTplStr: function(id) {
            if (!M._rendererCache[id]) {
                var script = document.getElementById(id);

                if (script) {
                    M._rendererCache[id] = script.innerHTML;
                } else {
                    M._rendererCache[id] = '';

                    console.warn(id + '---模版为空，请确认模版id是否正确！');
                }
                M.parse(M._rendererCache[id]);
            }
            this.tpl = M._rendererCache[id];
            return this;
        },

        createHtml: function(data) {
            this.data = data;
            this.html = M.render(this.tpl, data);
            return this;
        },

        trim: function() {
            this.tpl = Util.trimHtml(this.html);
            return this;
        },

        log: function() {
            if (this.html) {
                console.log(this.html);
                return this;
            }

            if (this.tpl) {
                console.log(this.tpl);
                return this;
            }

            return this;
        },

        getStr: function() {
            return this.html;
        },

        // id 为 container id 或者 dom节点
        to: function(id) {
            var dom = $.type(id) === 'string' ? document.getElementById(id) : id;
            $(dom).html(this.html);
        },

        container: function(container) {
            var data = this.data,
                target = this.target;
            var $container = $('*[renderer=' + container + ']');

            var forms = ['input', 'textarea'],
                srcs = ['img', 'iframe'];

            var $itemValue = $('*[' + target + ']', $container),
                $itemClass = $('*[' + target + 'class]', $container),
                $itemAttr = $('*[' + target + 'attr]', $container);
            $itemValue.each(function() {
                var _this = this,
                    key = $(this).attr(target),
                    value = data[key],
                    tagName = _this.tagName.toLowerCase();

                if (forms.indexOf(tagName) != -1) {
                    //表单类型复制
                    _this.value = value;
                    _this.title = value;
                } else if (srcs.indexOf(tagName) != -1) {
                    _this.src = value;
                } else if (tagName == 'select') {
                    var $options = $(_this).find('option');
                    $(_this).attr('value', value);
                    $options.each(function() {
                        this.selected = this.value == value;
                    });
                } else {
                    // 数字滚动赋值
                    if ($(_this).data('scrollnum')) {
                        Util.scrollNumber(_this, value, {
                            figure: $(_this).data('scrolllen')
                        });
                    } else if ($(_this).data('animatenumber')) {
                        // // 数字叠加动画
                        Util.animateNumber(_this, value, {
                            useEasing: $(_this).data('useeasing'),
                            useGrouping: $(_this).data('usegrouping'),
                        });
                    } else {
                        // 普通赋值
                        _this.innerHTML = value;
                    }
                }
            });

            $itemClass.each(function() {
                var key = $(this).attr(target + 'class'),
                    value = data[key];
                $(this).addClass(value);
            });

            $itemAttr.each(function() {
                var attr = $(this).attr(target + 'attr'),
                    attrSplit = attr.split('|'),
                    dataName = attrSplit.length > 1 && attrSplit[0] ? attrSplit[0] : 'data',
                    value = attrSplit.length > 1 && data[attrSplit[1]] ? data[attrSplit[1]] : 'undefinded';

                $(this).attr(dataName, value);
            });
        },
        getResult: function(key, data) {
            var result;

            for (var k in data) {
                if (k == key) result = data[key];
            }

            if (!result) console.warn('数据中不存在' + key + '这条数据');

            return result;
        },
    });

    $.extend(exports, {

        // 获取script标签中的html模板
        getTplStr: function(id) {
            var script = document.getElementById(id);

            if (script) {
                return Util.trimHtml(script.innerHTML);
            }
            return '';
        },

        // 返回内部模板类，调用方式如下
        // tpl.setView(data).renderTo('container');
        getTplInstance: function(id) {
            return new Template(id);
        },

        renderer: function(arg1, arg2) {
            return new Renderer(arg1, arg2);
        },

        // 对 html 标签属性进行动态求值、并设置
        // scopeId 为容器 id
        // data 为求值数据对象，不设置则为 全局命名空间上的数据
        evalHtmlAttr: function(scopeId, data) {
            var $els = $(document.getElementById(scopeId)).find('[data-eval-attr]');

            if (!data) data = window;

            var $el, attr, evalstr;

            for (var i = 0, len = $els.length; i < len; i++) {
                $el = $els.eq(i);
                attr = $el.data('eval-attr');

                evalstr = $el.attr(attr);

                if (evalstr) {
                    $el.attr(attr, Mustache.render(evalstr, data)).removeAttr('data-eval-attr');
                }
            }
        }
    });
})(jQuery, window.Util);

// 公共js
(function(win, $) {
    if (win.layer) {
        layer.config({
            extend: 'custom/layer.css', //加载您的扩展样式
            skin: 'layer-custom', //一旦设定，所有弹层风格都采用此主题。
            success: function(layero) {
                if (layero.find('.layer-bg').length == 0) {
                    layero.append('\
                        <div class="layer-bg">\
                            <i class="layer-cover"></i>\
                            <i class="corner-l"></i>\
                            <i class="corner-r"></i>\
                        </div>\
                    ');
                }
                if ((Util.browsers.isIE && !Util.browsers.isIE11) || Util.browsers.isIE10) {
                    layero.addClass('hasshadow');
                }
            }
        });

    }
    $(win).on('resize', function() {
        if (top.layer) {
            var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            top.layer.iframeAuto(index);
        }
    });

    // 自定义链接跳转
    $('body').on('click', '.js-link', function() {
        var $this = $(this),
            url = $this.data('url'),
            target = $this.data('target') || '_blank';

        if (url) {
            win.open(url, target);
        }
    });
})(this, jQuery);
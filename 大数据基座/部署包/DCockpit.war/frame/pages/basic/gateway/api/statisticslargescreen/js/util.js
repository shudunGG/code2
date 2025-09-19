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
    getMax: function (arr, key) {
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
    getMin: function (arr, key) {
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
     * 获取数组指定属性的和
     * @param {Array} arr 数组
     * @param {String} key 指定属性
     * @returns {Number} 和
     * @example [{key:166},{key:200},{key:33}]=>getSum(arr,'key);=>399
     */
    getSum: function (arr, key) {
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
    getValArr: function (arr, key) {
        var val = [],
            len = arr.length;
        for (var i = 0; i < len; i++) {
            val.push(arr[i][key]);
        }
        return val;
    },
    /**
     * 快速渲染数字
     * @param {String} space 命名空间
     * @param {Object} data 数据
     * @param {Boolean} animate 是否动态加载效果
     */
    renderNum: function (space, data, animate) {
        for (var i in data) {
            if (Object.prototype.hasOwnProperty.call(data, i)) {
                var $dom = $('#' + space + '-' + i),
                    d = data[i] - 0;
                if ($dom.length > 0) {
                    if (animate && !isNaN(d)) {
                        $dom.prop('number', ($dom.text() - 0)).animateNumber({
                            number: d
                        }, 1000);
                    } else {
                        $dom.text(data[i]);
                    }
                }
            }
        }
    },
    getPercent: function (max, data, fixed) {
        var _fixed = fixed || 0;
        var percent = (data / max * 100).toFixed(_fixed) + '%';
        return percent;
    },
    showTooltip: function (chart, length, interval) {
        chart.dataLength = length;
        chart.currentIndex = 0;
        clearInterval(chart.timer);
        chart.timer = setInterval(function () {
            if (chart.currentIndex === chart.dataLength) {
                chart.currentIndex = 0;
            }
            chart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: chart.currentIndex
            });
            chart.currentIndex++;
        }, interval || 3000);
    },
    // 鼠标悬浮到图表，停止showTooltip
    chartHover: function (chart, length, interval) {
        chart.on('mouseover', function () {
            clearInterval(chart.timer);
        });
        chart.on('mouseout', function () {
            Util.showTooltip(chart, length, interval);
        });
    },
    activeDom: function ($ct, target, successFn, event, activeClass) {
        var cls = activeClass || 'active';
        $ct.on(event || 'click', target, function (e) {
            var $this = $(this);
            if ($this.hasClass(cls)) return;
            $this.addClass(cls).siblings().removeClass(cls);
            // successFn接收点击事件和点击目标的jq对象作为参数
            successFn(e, $this);
            // 返回父容器jq对象，可以链式执行其他操作
            return $ct;
        });
    },
    // 数字千分位转换
    addCommas: function (n) {
        if (isNaN(n)) {
            return '-';
        }
        n = (n + '').split('.');
        return n[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') +
            (n.length > 1 ? ('.' + n[1]) : '');
    },
    // 生成随机数
    randNum: function (m, n) {
        if (!n) {
            return Math.floor(Math.random() * m);
        } else {
            var c = n - m + 1;
            return Math.floor(Math.random() * c + m);
        }
    },
    // echarts自适应
    echartsResize: function () {
        var echartsResizeTimer = null;
        return function () {
            $(window).on('resize', function () {
                // 获取所有echarts容器的jQuery对象
                var $echarts = $('[_echarts_instance_]');
                if (echartsResizeTimer) clearTimeout(echartsResizeTimer);
                echartsResizeTimer = setTimeout(function () {
                    $.each($echarts, function (i, e) {
                        // 调用echarts的api获取图表实例，执行缩放
                        var chart = echarts.getInstanceByDom(e);
                        chart.resize();
                    });
                }, 50);
            });
        };
    },
    /**
     * 定时切换地图高亮
     * @param {Object}chartInstance 图表实例
     * @param {Number} length 数据长度
     */
    areaHight: function (chartInstance, length) {
        chartInstance.dataLen = length;
        chartInstance.curData = 0;
        chartInstance.arr = [];
        // 数据下标组成数组
        for (var i = 0; i < chartInstance.dataLen; i++) {
            chartInstance.arr.push(i);
        }
        clearInterval(chartInstance.hightTimer);
        chartInstance.hightTimer = setInterval(function () {
            if (chartInstance.curData === chartInstance.dataLen) {
                chartInstance.curData = 0;
            }
            // 取消高亮
            chartInstance.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: chartInstance.arr
            });
            // 高亮地图区域
            chartInstance.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: chartInstance.curData
            });
            chartInstance.curData++;
        }, 3000);
    },
    /**
     * 请求数据
     * @param {Object} options 对象，包含url、请求类型、请求参数
     * @param {Function} successFn 成功回调
     * @param {Object} extraParams 额外请求参数
     */
    getData: function (options, successFn, extraParams) {
        var args = arguments,
            context = this,
            module = options.module;

        options = $.extend({}, {
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
        }, options);

        options.url = (isMock ? '' : Config.preUrl) + Config.pageInterface[module] + "?isCommondto=true";
        $.ajax(options).done(function (data) {
            successFn && successFn(data.custom, extraParams);
            // 如果定义了定时请求时间，则定时请求数据
            if (Config.moduleRefresh[module]) {
                setTimeout(function () {
                    Util.getData.apply(context, args);
                }, Config.moduleRefresh[module]);
            }
        }).fail(function (err) {
            console.log('接口请求失败 ', err);
        });
    },
    /**
     * 加载滚动数字
     * @param {Object} $dom dom容器
     * @param {Number} data 数值
     * @param {Number} figure 长度
     */
    scrollNum: function ($dom, data, figure) {
        if (!$dom.isInited) {
            $dom.isInited = true;
            $dom.ScrollNumber({
                number: data,
                figure: figure || 6
            });
        } else {
            $dom.ScrollNumber('refresh', data);
        }
    }
});
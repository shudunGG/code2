/**
 * Util 工具方法
 */

(function($, exports) {
    $.extend(exports, {
        /**
         * 根据状态值为数据添加状态判断值
         * @param {Array|Object} data 原始数据
         * @param {String} key 状态的字段名
         * @param {Object} options 逻辑规则
         * @returns {Object} 返回处理好的值
         */
        setValueBoolean: function(data, key, options) {
            data = JSON.parse(JSON.stringify(data));
            if ($.isArray(data)) {
                for (var i = 0, len = data.length; i < len; i++) {
                    data[i] = arguments.callee(data[i], key, options);
                }
            } else {
                for (var k in options) {
                    var d = options[k];
                    // data[key] == options[k] && (data[k] = true);

                    if ($.isArray(d)) {
                        for (var i = 0, len = d.length; i < len; i++) {
                            if (data[key] == d[i]) {
                                data[k] = true;
                                break;
                            }
                        }
                    } else {
                        data[key] == options[k] && (data[k] = true);
                    }
                }
            }

            return data;
        },
        /**
         * 根据状态为数据添加文字表述
         * @param {Object|Array} data 原始数据
         * @param {String} key 状态的字段名
         * @param {Object} options 逻辑规则
         * @returns {Object} 返回处理好的值
         */
        setValueText: function(data, key, options) {
            data = JSON.parse(JSON.stringify(data));
            if ($.isArray(data)) {
                for (var i = 0, len = data.length; i < len; i++) {
                    data[i] = arguments.callee(data[i], key, options);
                }
            } else {
                for (var k in options) {
                    var ks = k.split("-"),
                        kl = ks.length;

                    for (var i = 0; i < kl; i++) {
                        if (data[key] == ks[i]) {
                            data[key + "Text"] = options[k];
                            break;
                        }
                    }
                }
            }

            return data;
        },
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
         * 获取百分比
         * @param {Number} sum 总数
         * @param {Number} value 当前数据
         * @param {Number} fixed 精确到小数点位数，可不传，默认为0
         * @param {String} unit 配置单位，可不传，默认%
         * @returns {String} 返回字符串
         */
        getPercent: function(sum, value, fixed, unit) {
            var _fixed = fixed || 0;
            var percent = ((value / sum) * 100).toFixed(_fixed) + (unit || "%");
            return percent;
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
         *将字符串按照固定的字数截取
         * @param {String} str 需要处理的字符串
         * @param {Number} num 截断间隔
         * @param {String} split 需要插入的字符，不传默认换行符 '\n'
         * @returns {String} 处理后字符串
         */
        splitStr: function(str, num, split) {
            var splitStr = split || "\n",
                reg = new RegExp("(\\S{" + num + "})", "g"),
                reg2 = new RegExp("(\\" + splitStr + ")$"),
                fmtStr = str.replace(reg, "$1" + splitStr);
            return fmtStr.replace(reg2, "");
        },
        /**
         * 数组分组，用于多页面渲染
         * @param {Array} arr 需要处理的数组
         * @param {Number} num 每组元素的数量
         * @returns {Array} 分割后数组
         */
        splitArr: function(arr, num) {
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
         * @returns {String} key
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
         * 数字千分位转换
         * @param {Number} n 转换数字
         * @returns {String} 分割后的数字
         */
        addCommas: function(n) {
            if (isNaN(n)) {
                return "-";
            }
            n = (n + "").split(".");
            return n[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (n.length > 1 ? "." + n[1] : "");
        },
        /**
         * 生成随机数
         * @param {Number} m 最小值
         * @param {Number} n 最大值
         * @returns {Number} 随机数
         */
        randNum: function(m, n) {
            if (!n) {
                return Math.floor(Math.random() * m);
            }
            var c = n - m + 1;
            return Math.floor(Math.random() * c + m);
        },
        /**
         * Mock接口
         * @param {String} url 接口地址
         * @param {Object|Function} mockdata 数据模板或者响应数据
         * @see {@link http://mockjs.com/}
         * @returns {any} Mock
         */
        mock: function(url, mockdata) {
            if (!url) console.warn('模拟数据url中存在未定义url地址，请检查对应模拟数据，以防出错');

            var apiName;
            for (var key in Config.ajaxUrls) {
                if (Config.ajaxUrls[key] == url) apiName = key;
            }

            if (Config.closeMockUrls && Config.closeMockUrls.indexOf(apiName) !== -1) {
                console.warn(apiName + "---该条模拟数据已被配置关闭，请使用正式接口进行对接！");
                return false;
            }

            Mock && Mock.mock(url, mockdata);
        },
        /**
         * 获取Mock参数
         * @param {any} options mock函数回调
         * @returns {Object} 返回参数对象
         */
        getMockParam: function(options) {
            var params = Util.getUrlParams(decodeURIComponent("?" + options.body), 'params');
            return JSON.parse(params);
        },
        renderNum: function(space, data, filterFn) {
            for (var i in data) {
                if (Object.prototype.hasOwnProperty.call(data, i)) {
                    var $dom = $('#' + space + '-' + i);
                    if ($dom.length > 0) {
                        $dom.text(filterFn ? filterFn(data[i]) : data[i]);
                    }
                }
            }
        }
    });
})(jQuery, window.Util);

// 工具方法
(function($) {
    if (!window.Util) {
        window.Util = {};
    }
    if (!window.console) {
        window.console = {
            log: function() {},
            dir: function() {},
            dirxml: function() {},
            info: function() {},
            warn: function() {
                window.alert('warn');
            },
            error: function() {
                window.alert('error');
            }
        };
    }
    $.extend(Util, {

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
            // if (themeId) {
            //     options.data = $.extend({
            //         themeId: themeId,
            //         pageId: Util.getUrlParams('pageId') || themeId
            //     }, options.data);
                
            // }
            // 自动带上通用隐藏域，实现重放攻击防御
            // if(!options.data.commonDto && viewData) {
            //     options.data.commonDto = mini.encode([{
            //         id: "_common_hidden_viewdata",
            //         type: "hidden",
            //         value: viewData.getValue()
            //     }]);
            // }
            
            // 自动携带当前页面的url参数过去
            // options.data = $.extend(Util.getUrlParams(), options.data);
            // 如果需要加密 替换为加密格式
            // if (!options.noEncryption) {
            //     options.data = Util.encryptAjaxParams(options.url, options.data);
            // }
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
                // var status = data.status,
                //     controls = data.controls,
                //     viewData;

                // // 添加对通用隐藏域的处理
                // // 解决快捷登录在主界面中需要获取通用隐藏域中存放的当前用户的loginid，实现快捷登录用其他账户登录时要刷新页面的需求
                // if (controls && controls.length) {
                //     viewData = controls[controls.length - 1];
                //     if (viewData.id === '_common_hidden_viewdata') {
                //         Util.setCommonViewData(viewData.value);
                //     }
                // }
                // data = data.custom == undefined ? data : data.custom;
                // if (data && (typeof data !== 'object') && options.dataType.toLowerCase() === 'json') {
                //     data = JSON.parse(data);
                // }

                // if (status) {

                //     var code = parseInt(status.code),
                //         text = status.text || '',
                //         url = status.url,
                //         tipTxt = (code === 1 || code === 200) ? '成功' : '失败',
                //         tipType = (code === 1 || code === 200) ? 'success' : 'danger';


                //     if (url) {
                //         if (url.indexOf('http') !== 0) {
                //             url = Util.getRootPath() + url;
                //         }
                //         var aimWindow = status.top ? top : window;
                //         if (aimWindow.Util && aimWindow.Util.getSafeLocation) {
                //             aimWindow.Util.getSafeLocation().setHref(url);
                //         } else {
                //             aimWindow.location.href = url;
                //         }
                //         return;
                //     }
                //     if (text) {
                //         /*mini.showTips({
                //             content: "<b>" + tipTxt + "</b> <br/>" + text,
                //             state: tipType,
                //             x: 'center',
                //             y: 'top',
                //             timeout: 3000
                //         });*/
                //     }


                //     // 处理成功回调
                //     if (code === 1 || code === 200) {
                //         if (okCb) {
                //             okCb.apply(this, [data, arguments[1], arguments[2]]);
                //         }
                //     } else {
                //         if (options.fail) {
                //             options.fail.call(this, text, status);
                //         }
                //     }
                // } else {
                //     // 没有status 表示不符合规范，也需要执行sussess
                //     okCb && okCb.apply(this, [data, arguments[1], arguments[2]]);
                // }
                return data;
            });

            // then 返回的是新规范的promise 没有以下内容 兼容处理一下
            _ajax.success = _ajax.done;
            _ajax.error = _ajax.fail;
            _ajax.complete = _ajax.always;
            _ajax.abort = _jqXhr.abort;
            return _ajax;
        }
    });
}(jQuery));

(function($, exports) {
    $.extend(exports, {
        echartStore: [],
        /**
         * 初始化ECharts图表对象
         * @param {String} id 图表dom元素ID
         * @returns {Object} 图表实例
         */
        echartsInit: function(id) {
            var echartsObj = echarts.init(document.getElementById(id));
            Util.echartStore.push(echartsObj);
            return echartsObj;
        },
        /**
         * 图表自动切换展示tooltip
         * @param {Object} chartInstance 图表实例
         * @param {Number} length 图表数据量
         * @param {Number} interval 切换间隔，单位ms
         */
        showTooltip: function(chartInstance, length, interval) {
            chartInstance.dataLength = length;
            chartInstance.currentIndex = 0;
            clearInterval(chartInstance.timer);
            chartInstance.interval = interval || 3000;
            chartInstance.timer = setInterval(function() {
                if (chartInstance.currentIndex === chartInstance.dataLength) {
                    chartInstance.currentIndex = 0;
                }
                chartInstance.dispatchAction({
                    type: "showTip",
                    seriesIndex: 0,
                    dataIndex: chartInstance.currentIndex
                });
                chartInstance.currentIndex++;
            }, chartInstance.interval);
        },
        /**
         * 鼠标悬浮到图表，停止showTooltip
         * @param {Object} chartInstance 图表实例
         * @param {Number} length 图表数据量
         */
        chartHover: function(chartInstance, length) {
            chartInstance.on("mouseover", function() {
                clearInterval(chartInstance.timer);
            });
            chartInstance.on("mouseout", function() {
                Util.showTooltip(chartInstance, length, chartInstance.interval || 3000);
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
                    type: "downplay",
                    seriesIndex: 0
                });
                // 高亮地图区域
                chartInstance.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: chartInstance.curData
                });
                // 显示悬浮窗
                chartInstance.dispatchAction({
                    type: "showTip",
                    seriesIndex: 0,
                    dataIndex: chartInstance.curData
                });
                chartInstance.curData++;
            }, 3000);
        },
        /**
         * 地图图表专用：鼠标悬浮到地图，停止showTooltip
         * @param {Object} chartInstance 图表实例
         * @param {Number} length 图表数据量
         */
        mapChartHover: function(chartInstance, length) {
            chartInstance.on("mouseover", function() {
                clearInterval(chartInstance.hightTimer);
            });
            chartInstance.on("mouseout", function() {
                Util.areaHight(chartInstance, length, chartInstance.interval || 3000);
            });
        },
        /**
         * echarts渐变色,适用双色渐变，可根据实际需求改写,方向参数可不传，默认水平方向渐变
         * @param {String} color1 0% 处的颜色
         * @param {String} color2 100% 处的颜色
         * @param {Number} x1 渐变色方向起点的x坐标
         * @param {Number} y1 渐变色方向起点的y坐标
         * @param {Number} x2 渐变色方向终点的x坐标
         * @param {Number} y2 渐变色方向终点的y坐标
         * @returns {echarts.graphic.LinearGradient} echarts渐变对象
         */
        linearColor: function(color1, color2, x1, y1, x2, y2) {
            return new echarts.graphic.LinearGradient(
                typeof x1 === "number" && x1 < 1 ? x1 : 1,
                typeof y1 === "number" && y1 < 1 ? y1 : 0,
                typeof x2 === "number" && x2 < 1 ? x2 : 0,
                typeof y2 === "number" && y2 < 1 ? y2 : 0, [{
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
        // 自适应
        echartsResize: function() {
            var echartsResizeTimer = null;
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
        }
    });
})(jQuery, window.Util);
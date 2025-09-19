function echartsResize() {
    var echartsResizeTimer = null;
    $(window).on("resize", function () {
        // 获取所有echarts容器的jQuery对象
        var $echarts = $("[_echarts_instance_]");
        if (echartsResizeTimer) clearTimeout(echartsResizeTimer);
        echartsResizeTimer = setTimeout(function () {
            $.each($echarts, function (i, e) {
                // 调用echarts的api获取图表实例，执行缩放
                var chart = echarts.getInstanceByDom(e);
                if (!$(e).is(":hidden")) {
                    chart.resize();
                }
            });
        }, 50);
    });
}
echartsResize();

(function (win, $) {
    $.extend(window.Util, {
        defaultScroll: {
            cursorcolor: "#1c7ded",
            cursorwidth: "5px",
            cursorborder: "none",
            zindex: 9999,
            horizrailenabled: false,
            background: "rgba(3,12,68,.43)",
            bouncescroll: false,
        },
        // 获取数组格式数据
        getArrayData: function (data, name) {
            var arr = [];
            $.each(data, function (i, item) {
                arr.push(item[name]);
            });
            return arr;
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
         * 快速渲染数字(小数或整数均可)
         * @param {String} space 命名空间
         * @param {Object} data 数据
         * @param {Boolean} animate 是否动态加载效果
         * @param {Function} filterFn 过滤函数，处理渲染结果，比如加单位
         */
        renderRoundNum: function (space, data, animate, filterFn) {
            for (var i in data) {
                if (Object.prototype.hasOwnProperty.call(data, i)) {
                    var $dom = $('#' + space + '-' + i),
                        d = data[i] - 0;
                    if ($dom.length > 0) {
                        if (animate && !isNaN(d)) {
                            var y = String(d).indexOf(".") + 1; //获取小数点的位置
                            var count = String(d).length - y; //获取小数点后的个数
                            var round = 1;
                            if (y > 0) {
                                for (var j = 0; j < count; j++) {
                                    round += '0';
                                }
                            }
                            anime({
                                targets: $dom[0],
                                innerHTML: [0, d],
                                easing: 'linear',
                                round: round
                            });
                        } else {
                            $dom.text(filterFn ? filterFn(data[i]) : data[i]);
                        }
                    }
                }
            }
        },
        // 获取url参数值
        getUrlParams: function (name) {
            var params = {},
                query = location.search.substring(1),
                arr = query.split("&"),
                rt;

            $.each(arr, function (i, item) {
                var tmp = item.split("="),
                    key = tmp[0],
                    val = decodeURIComponent(tmp[1]);

                if (typeof params[key] == "undefined") {
                    params[key] = val;
                } else if (typeof params[key] == "string") {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });

            rt = name ? params[name] : params;

            return rt;
        },
        // 地图区域滚动数字
        renderScrollNum: function ($dom, number) {
            var numArr = (number + "").split(""),
                len = numArr.length,
                str = "",
                $ct = $dom,
                $number = $ct.find(".number-item");
            if (!$dom.scrollNumber || numArr.length !== $number.length) {
                for (var i = len - 1; i >= 0; i--) {
                    if (numArr[i] !== '.') {
                        str = '<span class="number-item">' + numArr[i] + "</span>" + str;
                    } else {
                        str = '<span class="number-dot LED">.</span>' + str;
                    }
                }
                $ct.empty().append(str);
                $dom.scrollNumber = new ScrollNumber({
                    $dom: $ct.find(".number-item"), //jQuery dom对象
                    imgUrl: "./images/number.png", //背景图url
                    duration: 2000 // 非必须参数，切换时长，不传默认1000
                });
            } else {
                for (var j = len - 1; j >= 0; j--) {
                    $number.eq(j).text(numArr[j]);
                }
                $dom.scrollNumber.refresh();
            }
        },
        // 楼层导航
        guide: function ($guideContainer, guide, $listContainer, list, offset) {
            offset = offset ? offset : 0;
            $guideContainer.on("click", guide, function () {
                var $this = $(this),
                    index = $(this).index(),
                    offsetTop = $(list)[index].offsetTop - offset;
                $this.addClass("active")
                    .siblings(".active").removeClass("active", 5);
                $listContainer.getNiceScroll(0).doScrollTop(offsetTop, 300);
            });

            $listContainer.on("scroll", function () {
                var offsetTop = $listContainer.getNiceScroll(0).getScrollTop();
                $(list).each(function (i, el) {
                    if (el.offsetTop <= offsetTop + offset) {
                        var index = $(el).index(list);
                        $(guide).eq(index).addClass("active")
                            .siblings(".active").removeClass("active");
                    }
                });
            });
        },

        // 获取日期
        getNowFormatDate: function (type) {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate,
                result;
            switch (type) {
                // 今天
                case '01':
                    result = currentdate + ' - ' + currentdate;
                    break;
                    // 昨天
                case '02':
                    date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
                    year = date.getFullYear();
                    month = date.getMonth() + 1;
                    strDate = date.getDate();
                    if (month >= 1 && month <= 9) {
                        month = "0" + month;
                    }
                    if (strDate >= 0 && strDate <= 9) {
                        strDate = "0" + strDate;
                    }
                    result = year + seperator1 + month + seperator1 + strDate;
                    result += ' - ' + result;
                    break;
                    // 近一周
                case '03':
                    date.setTime(date.getTime() - 6 * 24 * 60 * 60 * 1000);
                    prevYear = date.getFullYear();
                    prevMonth = date.getMonth() + 1;
                    prevStrDate = date.getDate();
                    if (prevMonth >= 1 && prevMonth <= 9) {
                        prevMonth = "0" + prevMonth;
                    }
                    if (prevStrDate >= 0 && prevStrDate <= 9) {
                        prevStrDate = "0" + prevStrDate;
                    }
                    result = prevYear + seperator1 + prevMonth + seperator1 + prevStrDate + ' - ' + currentdate;
                    break;
                    // 近30天
                case '04':
                    date.setTime(date.getTime() - 29 * 24 * 60 * 60 * 1000);
                    prevYear = date.getFullYear();
                    prevMonth = date.getMonth() + 1;
                    prevStrDate = date.getDate();
                    if (prevMonth >= 1 && prevMonth <= 9) {
                        prevMonth = "0" + prevMonth;
                    }
                    if (prevStrDate >= 0 && prevStrDate <= 9) {
                        prevStrDate = "0" + prevStrDate;
                    }
                    result = prevYear + seperator1 + prevMonth + seperator1 + prevStrDate + ' - ' + currentdate;
                    break;
                    // 一年
                case '05':
                    date.setTime(date.getTime() - 364 * 24 * 60 * 60 * 1000);
                    prevYear = date.getFullYear();
                    prevMonth = date.getMonth() + 1;
                    prevStrDate = date.getDate();
                    if (prevMonth >= 1 && prevMonth <= 9) {
                        prevMonth = "0" + prevMonth;
                    }
                    if (prevStrDate >= 0 && prevStrDate <= 9) {
                        prevStrDate = "0" + prevStrDate;
                    }
                    result = prevYear + seperator1 + prevMonth + seperator1 + prevStrDate + ' - ' + currentdate;
                    break;
            }


            return result;
        }
    });
})(this, jQuery);
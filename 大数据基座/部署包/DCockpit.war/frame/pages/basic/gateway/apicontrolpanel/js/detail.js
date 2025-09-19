$(function() {

    var object = 'fgrg';
    // epoint.hideLoading();
    var startTime, endTime, currentTime, type;
    var startDate = mini.get('start-date'),
        startHour = mini.get('start-hour'),
        startMinute = mini.get('start-minute'),
        endDate = mini.get('end-date'),
        endHour = mini.get('end-hour'),
        endMinute = mini.get('end-minute');

    function initSelectduration() {
        Util.ajax({
            url: Util.getRightUrl(getDefaultTime),
            success: function(data) {
                $(".mini-selectduration-btn").each(function(i, el) {
                    var $el = $(el);
                    if ($el.data("day") > data.defaultInfo.days) {
                        $el.addClass("disabled");
                    }
                });

                currentTime = endTime = parserDate(data.defaultInfo.currentTime);
                startTime = new Date(endTime.getTime() - 3600000);

                var maxDate = endTime.Format('yyyy-MM-dd'),
                    minDate = new Date();
                minDate.setDate(endTime.getDate() -
                    data.defaultInfo.days);
                minDate = minDate.Format('yyyy-MM-dd');

                $("#count-time").text(endTime.Format('yyyy-MM-dd hh:mm:ss'));
                $("#tab-refresh").attr('title', '统计截止：' + endTime.Format('yyyy-MM-dd hh:mm:ss'));
                endDate.setMaxDate(maxDate);
                endDate.setMinDate(minDate);
                endDate.setValue(maxDate);
                endHour.setValue(endTime.getHours());
                endMinute.setValue(endTime.getMinutes());

                startDate.setMaxDate(maxDate);
                startDate.setMinDate(minDate);
                
                startDate.setValue(startTime.Format('yyyy-MM-dd'));
                startHour.setValue(startTime.getHours());
                startMinute.setValue(startTime.getMinutes());

                startTime = startTime.Format('yyyy-MM-dd hh:mm:00');
                endTime = endTime.Format('yyyy-MM-dd hh:mm:00');

                $(".mini-selectduration-custom-input").text(startTime.slice(0, 16) + ' ~ ' + endTime.slice(0, 16));
                getMonitorObject();
            }
        });
    }


    $(".mini-selectduration").on("click", ".mini-selectduration-btn", function() {
        var $this = $(this);
        if ($this.hasClass("disabled")) {
            return;
        }
        $this.addClass("active").siblings(".active").removeClass(
            "active");
        endTime = currentTime;
        startTime = new Date(endTime.getTime() -
            (3600000 * $this.data("hour")) -
            (3600000 * 24 * $this.data("day")));
       
        
        // 更新时间显示
        endDate.setValue(endTime.Format('yyyy-MM-dd'));
        endHour.setValue(endTime.getHours());
        endMinute.setValue(endTime.getMinutes());
        
        startDate.setValue(startTime.Format('yyyy-MM-dd'));
        startHour.setValue(startTime.getHours());
        startMinute.setValue(startTime.getMinutes());
        
        startTime = startTime.Format('yyyy-MM-dd hh:mm:00');
        endTime = endTime.Format('yyyy-MM-dd hh:mm:00');
        
        $(".mini-selectduration-custom-input").text(startTime.slice(0, 16) + ' ~ ' + endTime.slice(0, 16));
        
        getMonitorDetail();
    });

    $("body").on("click", function(e) {
        if (!$(e.target).closest(".mini-selectduration-custom").length && !$(e.target).closest(".mini-popup").length) {
            $(".mini-selectduration-custom-container").addClass(
                "hidden").prev().removeClass("active");
        }
    });
    Date.prototype.Format = function(fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    startDate.on("valuechanged", function(e) {
        if (e.value.getTime() > endDate.getValue().getTime()) {
            startDate.setValue(e.oldValue ? e.oldValue : startTime);
        }
    });
    endDate.on("valuechanged", function(e) {
        if (e.value.getTime() < startDate.getValue().getTime()) {
            endDate.setValue(e.oldValue ? e.oldValue : endTime);
        }
    });


    function parserDate(date) {
        var t = Date.parse(date);
        if (!isNaN(t)) {
            return new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            return new Date();
        }
    }

    window.changedGroup = function(e) {
        type = e.value;
        getMonitorDetail();
    };

    $(".mini-selectduration").on("click", ".mini-selectduration-custom-input", function() {
        $(this).toggleClass("active");
        $(this).next().toggleClass("hidden");
    });

    $(".mini-selectduration").on("click", "#selectduration-query", function() {
        startTime = startDate.getFormValue() + ' ' +
            (startHour.getValue() < 10 ? '0' + startHour.getValue() : startHour.getValue()) + 
            ':' + (startMinute.getValue() < 10 ? '0' + startMinute.getValue() : startMinute.getValue()) +
            ':00';
        endTime = endDate.getFormValue() + ' ' + (endHour.getValue() < 10 ? '0' + endHour.getValue() : endHour.getValue()) +
            ':' + (endMinute.getValue() < 10 ? '0' + endMinute.getValue() : endMinute.getValue()) +
            ':00';
            
        getMonitorDetail();
        $(this).closest(".mini-selectduration-custom-container")
            .addClass("hidden").prev().removeClass("active");
        $(".mini-selectduration-btn.active").removeClass("active");
        $(".mini-selectduration-custom-input").text(startTime.slice(0, 16) + ' ~ ' + endTime.slice(0, 16));
    });

    $("body").on("click", ".refresh-btn", function() {
        initSelectduration();
    });


    function getArrayData(data, name) {
        var arr = [];
        $.each(data, function(i, item) {
        	
        	// 时间显示格式化
        	if (name == "time") {
        		var dataTime = parserDate(item[name]);
        		var timeStr = dataTime.Format('MM-dd hh:mm:ss');
        		arr.push(timeStr);
        	} else {
        		arr.push(item[name]);
        	}
        });
        return arr;
    }


    // 监控详情交互
    // 图报表单、双列布局
    var M = Mustache;
    var chartTpl = $("#chart-tpl").html();
    var objects = [],
        methodCombo = [],
        charts = [],
        chartsData = [],
        colors = ['#1089ff', '#30c5d0', '#f7cb00', '#f8898b', '#b089f8'];
    var $legends = $("#charts-legend");
    // 图表默认配置项
    var defaultOption = {
        tooltip: {
            trigger: 'axis'
        },
        color: ['#1089ff'],
        dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            endValue: 5,
            zoomLock: true
        }, {
            type: 'inside',
            xAxisIndex: [0],
            start: 0,
            endValue: 5,
        }],
        grid: {
            left: 15,
            right: 15,
            top: 10,
            bottom: 60,
            containLabel: true
        },
        xAxis: {
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#ccd9f3'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#666',
                    fontSize: 14
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#f2f2f2',
                    type: 'solid'
                }
            },
            data: []
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: '#ccd9f3'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#666',
                    fontSize: 14
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#f2f2f2',
                    type: 'solid'
                }
            }
        },
        series: [{
            type: 'line',
            areaStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(235,241,255,1)' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'rgba(235,241,255,0)' // 100% 处的颜色
                        }]
                    }
                }
            },
            data: []
        }]
    };

    // 获取统计对象（图例）
    function getMonitorObject() {
        Util.ajax({
            url: Util.getRightUrl(getMonitorObjects),
            success: function(data) {

                // 渲染图例
                // var legends = '';
                // $.each(data.monitorObjects, function(i, item) {
                //     objects.push(item.id);
                //     legends += '<li class="chart-legend active" data-id=' + item.id + '>' + item.name + '</li>';
                // });
                // $legends.html(legends);
                $.each(data.monitorIndexs, function(i, item) {
                    item.methods = JSON.stringify(item.methods);
                });

                // 渲染图表名称、周期、聚合方式
                $("#chart-list").html(M.render(chartTpl, data));
                mini.parse();
                $(".chart-item").each(function(i, el) {
                    var $el = $(el),
                        index = $el.data("index");
                    methodCombo[index] = mini.get('method-' + index);
                    charts[index] = echarts.init($el.find(".chart")[0]);
                    if (methodCombo[index]) {
                        methodCombo[index].on("valuechanged", function(e) {
                            getMonitorChartData(index);
                        });
                    }
                });
                getMonitorDetail();
            }
        });
    }
    // getMonitorObject();

    // 获取所有图表数据
    function getMonitorDetail() {
        for (var key in charts) {
            if (charts[key].id) {
                getMonitorChartData(key);
            }
        }
    }

    // 图表数据
    function getMonitorChartData(index) {
        var method;
        if (methodCombo[index]) {
            method = methodCombo[index].getValue();
        } else {
            method = $(".chart-method > span").text();
        }
        Util.ajax({
            url: Util.getRightUrl(getMonitorChart),
            data: {
                'startTime': startTime,
                'endTime': endTime,
                'objects': object,
                'index': index,
                'method': method
            },
            success: function(data) {
                chartsData[index] = data.chartData;
                renderMonitorChart(index);
                Util.hidePageLoading();
            }
        });
    }

    // 渲染图表
    function renderMonitorChart(index) {
        var chart = charts[index],
            chartData = chartsData[index],
            series = [];
        chart.clear();
        chart.setOption(defaultOption);
        if (!chartData.length) {
            $(".chart-item[data-index=" + index + ']').find(".chart").addClass("hidden")
                .siblings(".no-result").removeClass("hidden");
        } else {
            $(".chart-item[data-index=" + index + ']').find(".chart").removeClass("hidden")
                .siblings(".no-result").addClass("hidden");
            $(".chart-legend").each(function(i, el) {
                var $el = $(el),
                    id = $el.data('id');
                if ($el.hasClass("active")) {
                    series.push({
                        type: 'line',
                        name: $(".chart-legend[data-id=" + id + "]").text(),
                        color: [colors[i]],
                        data: getArrayData(chartData, id)
                    });
                }
            });
            chart.setOption({
                xAxis: {
                    data: getArrayData(chartData, 'time')
                },
                series: [{
                    data: getArrayData(chartData, object)
                }]
            });

        }

    }
    


    initSelectduration();
});
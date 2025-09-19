$(function() {
    // epoint.hideLoading();
    var startTime, endTime, currentTime, type;
    var startDate = mini.get('start-date'),
        startHour = mini.get('start-hour'),
        startMinute = mini.get('start-minute'),
        endDate = mini.get('end-date'),
        endHour = mini.get('end-hour'),
        endMinute = mini.get('end-minute'),
        startTabDate = mini.get('tab-start-date'),
        startTabHour = mini.get('tab-start-hour'),
        startTabMinute = mini.get('tab-start-minute'),
        endTabDate = mini.get('tab-end-date'),
        endTabHour = mini.get('tab-end-hour'),
        endTabMinute = mini.get('tab-end-minute');

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

                endTabDate.setMaxDate(maxDate);
                endTabDate.setMinDate(minDate);
                endTabDate.setValue(maxDate);
                endTabHour.setValue(endTime.getHours());
                endTabMinute.setValue(endTime.getMinutes());

                startDate.setMaxDate(maxDate);
                startDate.setMinDate(minDate);
                
                startTabDate.setMaxDate(maxDate);
                startTabDate.setMinDate(minDate);

                startDate.setValue(startTime.Format('yyyy-MM-dd'));
                startHour.setValue(startTime.getHours());
                startMinute.setValue(startTime.getMinutes());
                
                startTabDate.setValue(startTime.Format('yyyy-MM-dd'));
                startTabHour.setValue(startTime.getHours());
                startTabMinute.setValue(startTime.getMinutes());

                startTime = startTime.Format('yyyy-MM-dd hh:mm:00');
                endTime = endTime.Format('yyyy-MM-dd hh:mm:00');

                $(".mini-selectduration-custom-input").text(startTime.slice(0, 16) + ' ~ ' + endTime.slice(0, 16));
                getVisitCounts();
            }
        });
    }

    // 固定时间段选择
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
            
        endDate.setValue(endTime.Format('yyyy-MM-dd'));
        endHour.setValue(endTime.getHours());
        endMinute.setValue(endTime.getMinutes());
        
        endTabDate.setValue(endTime.Format('yyyy-MM-dd'));
        endTabHour.setValue(endTime.getHours());
        endTabMinute.setValue(endTime.getMinutes());
            
        startDate.setValue(startTime.Format('yyyy-MM-dd'));
        startHour.setValue(startTime.getHours());
        startMinute.setValue(startTime.getMinutes());
        
        startTabDate.setValue(startTime.Format('yyyy-MM-dd'));
        startTabHour.setValue(startTime.getHours());
        startTabMinute.setValue(startTime.getMinutes());

        startTime = startTime.Format('yyyy-MM-dd hh:mm:00');
        endTime = endTime.Format('yyyy-MM-dd hh:mm:00');
        $(".mini-selectduration-custom-input").text(startTime.slice(0, 16) + ' ~ ' + endTime.slice(0, 16));
        getVisitCounts();
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

    // 使2处时间选择同步
    startDate.on("valuechanged", function(e) {
        if (e.value.getTime() > endDate.getValue().getTime()) {
            startDate.setValue(e.oldValue ? e.oldValue : startTime);
        }
        startTabDate.setValue(startDate.getValue());
    });
    startHour.on('valuechanged', function(e) {
        startTabHour.setValue(e.value);
    });
    startMinute.on('valuechanged', function(e) {
        startTabMinute.setValue(e.value);
    });
    endDate.on("valuechanged", function(e) {
        if (e.value.getTime() < startDate.getValue().getTime()) {
            endDate.setValue(e.oldValue ? e.oldValue : endTime);
        }
        endTabDate.setValue(endDate.getValue());
    });
    endHour.on('valuechanged', function(e) {
        endTabHour.setValue(e.value);
    });
    endMinute.on('valuechanged', function(e) {
        endTabMinute.setValue(e.value);
    });

    
    startTabDate.on("valuechanged", function(e) {
        if (e.value.getTime() > endDate.getValue().getTime()) {
            startTabDate.setValue(e.oldValue ? e.oldValue : startTime);
        }
        startDate.setValue(startTabDate.getValue());
    });
    startTabHour.on('valuechanged', function(e) {
        startHour.setValue(e.value);
    });
    startTabMinute.on('valuechanged', function(e) {
        startMinute.setValue(e.value);
    });
    endTabDate.on("valuechanged", function(e) {
        if (e.value.getTime() < startDate.getValue().getTime()) {
            endTabDate.setValue(e.oldValue ? e.oldValue : endTime);
        }
        endDate.setValue(endTabDate.getValue());
    });
    endTabHour.on('valuechanged', function(e) {
        endHour.setValue(e.value);
    });
    endTabMinute.on('valuechanged', function(e) {
        endMinute.setValue(e.value);
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
        getVisitCounts();
        getMonitorDetail();
    };

    $(".mini-selectduration").on("click", ".mini-selectduration-custom-input", function() {
        $(this).toggleClass("active");
        $(this).next().toggleClass("hidden");
    });

    $(".mini-selectduration").on("click", "#selectduration-query, #tab-selectduration-query", function() {
        startTime = startDate.getFormValue() + ' ' +
            (startHour.getValue() < 10 ? '0' + startHour.getValue() : startHour.getValue()) + 
            ':' + (startMinute.getValue() < 10 ? '0' + startMinute.getValue() : startMinute.getValue()) +
            ':00';
        endTime = endDate.getFormValue() + ' ' + (endHour.getValue() < 10 ? '0' + endHour.getValue() : endHour.getValue()) +
            ':' + (endMinute.getValue() < 10 ? '0' + endMinute.getValue() : endMinute.getValue()) +
            ':00';
        getVisitCounts();
        getMonitorDetail();
        $(this).closest(".mini-selectduration-custom-container")
            .addClass("hidden").prev().removeClass("active");
        $(".mini-selectduration-btn.active").removeClass("active");
        $(".mini-selectduration-custom-input").text(startTime.slice(0, 16) + ' ~ ' + endTime.slice(0, 16));
    });

    $("body").on("click", ".refresh-btn", function() {
        initSelectduration();
    });

    $("#object-select").on("click", function() {
        epoint.openDialog("请选择（最多选择5项）", './object-select.html', function() {}, {
            width: '638px',
            height: '500px',
        });
    });

    var visitCount = echarts.init(document.getElementById("visit-count")),
        flowCount = echarts.init(document.getElementById("flow-count")),
        responseCount = echarts.init(document.getElementById("response-count"));

    function initChart() {
        var option = {
            color: ['#f7cb00', '#26c2ce'],
            legend: {
                right: 15,
                top: 0,
                itemWidth: 18,
                itemHeight: 6,
                itemGap: 30,
                data: ['调用次数', '错误次数']
            },
            grid: {
                left: 15,
                right: 15,
                top: 50,
                bottom: 30,
                containLabel: true
            },
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#ccd9f3'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#666',
                        fontSize: 10
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
                        fontSize: 10
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
                name: '调用次数',
                smooth: true,
                label: {
                    normal: {
                        show: true
                    }
                },
                data: []
            }, {
                type: 'line',
                name: '错误次数',
                label: {
                    normal: {
                        show: true
                    }
                },
                smooth: true,
                data: []
            }]
        };
        visitCount.setOption(option);

        option.legend.data = ['上行流量', '下行流量'];
        option.series[0].name = '上行流量';
        option.series[1].name = '下行流量';
        flowCount.setOption(option);

        option.legend.data = ['响应时间', '平均值'];
        option.series[0].name = '响应时间';
        option.series[1].name = '平均值';
        responseCount.setOption(option);
    }

    var M = Mustache;
    var $callRank = $("#rank-call"),
        $responseRank = $("#rank-response"),
        $errorRank = $("#rank-error");

    var callRankTpl = $("#rank-call-tpl").html(),
        responseRankTpl = $("#rank-response-tpl").html(),
        errorRankTpl = $("#rank-error-tpl").html(),
        chartTpl = $("#chart-tpl").html();

    function getVisitCounts() {
        Util.ajax({
            url: Util.getRightUrl(getVisitCount),
            data: {
                startTime: startTime,
                endTime: endTime,
                type: type
            },
            success: function(data) {
                $callRank.html(M.render(callRankTpl, {
                    list: data.top5.call
                }));
                $responseRank.html(M.render(responseRankTpl, {
                    list: data.top5.response
                }));
                $errorRank.html(M.render(errorRankTpl, {
                    list: data.top5.error
                }));

                $("#service-total").text(data.overview.serviceTotal);
                $("#app-total").text(data.overview.appTotal);
                $("#ip-total").text(data.overview.ipTotal);

                $("#call-count").text(data.visitCount.total);
                $("#error-rate").text(data.visitCount.errorRate);
                renderChart(visitCount, data.visitCount.chartData, data.time);

                $("#flow-max").text(data.flowCount.inputflow);
                $("#flow-min").text(data.flowCount.outputflow);
                renderChart(flowCount, data.flowCount.chartData, data.time);

                $("#response-max").text(data.responseCount.max);
                $("#response-min").text(data.responseCount.min);
                renderChart(responseCount, data.responseCount.chartData, data.time);
            }
        });
    }

    function renderChart(chart, data, time) {
        chart.setOption({
            xAxis: {
                data: getArrayData(data, 'name')
            },
            series: [{
                data: getArrayData(data, 'value1')
            }, {
                data: getArrayData(data, 'value2')
            }]
        });
    }

    function getArrayData(data, name) {
        var arr = [];
        $.each(data, function(i, item) {
            arr.push(item[name]);
        });
        return arr;
    }

    $(window).on("resize", function() {
        visitCount.resize();
        flowCount.resize();
        responseCount.resize();
        for (var key in charts) {
            charts[key].resize();
        }
    });

    $(".fui-content").on("click", ".detail-btn", function() {
        // 标题
        var title = $(this).prev().text();
        // 时间为startTime+endTime
    });

    var $detailTab = $("#detail-tab"),
        toTop = $detailTab.offset().top;

    $detailTab.Tab({
    	hd: '.tab-title',
        bd: '.tab-content',
        after: function() {
            getMonitorObject();
        }
    });

    // 监控详情交互
    // 图报表单、双列布局
    $(".charts-toolbar").on('click', '.charts-column', function() {
        var $this = $(this);
        $this.addClass("active")
            .siblings(".active").removeClass("active");
        if ($this.hasClass("signal")) {
            $(".charts-list").addClass("signal");
        } else {
            $(".charts-list").removeClass("signal");
        }
        for (var key in charts) {
            charts[key].resize();
        }
    }).on("click", ".chart-legend", function() {
        var $this = $(this);
        $this.toggleClass("active");
        for (var key in charts) {
            renderMonitorChart(key);
        }
    });

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
        series: []
    };

    // 获取统计对象（图例）
    function getMonitorObject() {
        Util.ajax({
            url: Util.getRightUrl(getMonitorObjects),
            success: function(data) {

                // 渲染图例
                var legends = '';
                $.each(data.monitorObjects, function(i, item) {
                    objects.push(item.id);
                    legends += '<li class="chart-legend active" data-id=' + item.id + '>' + item.name + '</li>';
                });
                $legends.html(legends);
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
                'objects': objects.join(','),
                'index': index,
                'method': method
            },
            success: function(data) {
                chartsData[index] = data.chartData;
                renderMonitorChart(index);
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
                series: series
            });

        }

    }
    

    $('.fui-content').scroll(function() {
        if (($('.fui-content').scrollTop()) > toTop) {
            $detailTab.addClass("head-fixed");
        } else {
            $detailTab.removeClass("head-fixed");
        }
    }).trigger('scroll');


    initSelectduration();
    initChart();
});
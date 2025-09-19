/**
 * ! 统计看板 date:2021-03-02 author: heying;
 */

'use strict';
/* global pageConfig echarts */

(function(win, $) {

    var volumeChart,
        hotindChart,
        date = 'today', // 专题访问量统计 默认今日数据
        hottop, // 热点指标TOP5 热度默认第一个
        exhibitopt = 'projnums', // 对外展示情况 默认专题数
        warningopt = 'projnums', // 预警情况 默认专题数
        resizeTimer;

    // 图表样式
    function initChart() {

        // 专题访问量统计-图表
        var chartOption = {
            grid: {
                top: 36,
                left: 10,
                right: 8,
                bottom: 30,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                confine: true,
                formatter: '{a}<br/>{b}: {c}条',
                padding: 8,
                axisPointer: {
                    type: 'shadow',
                },
                backgroundColor: 'rgba(41, 47, 71, .8)',
            },
            color: ['#1ec6e3'],
            dataZoom: [{
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                left: 31,
                right: 10,
                bottom: 3,
                // start: 0,
                height: 20,
                end: 30, // 初始化滚动条
                backgroundColor: 'transparent',
                fillerColor: 'rgba(128, 132, 148, 0.549)',
                dataBackground: {
                    areaStyle: {
                        color: '#dbdfec',
                        opacity: '.33'
                    }
                },
                handleStyle: {
                    color: 'rgba(128, 132, 148, 0.549)'
                },
                showDetail: false,
            }, {
                type: 'inside',
                xAxisIndex: [0],
                end: 30, // 初始化滚动条
                zoomOnMouseWheel: false, // 滚轮是否触发缩放
                moveOnMouseMove: true, // 鼠标滚轮触发滚动
                moveOnMouseWheel: true
            }],

            xAxis: {
                type: 'category',
                axisLabel: {
                	rotate:10,
                	show: true,
                    margin: 10,
                    textStyle: {
                        fontSize: 14,
                        color: 'rgb(51, 57, 79)'
                    },
                    interval: 0
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgb(195, 204, 216)'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: [],
            },
            yAxis: {
                type: 'value',
                name: '条',
                nameRotate: '0.1',
                nameGap: 24,
                nameTextStyle: {
                    fontSize: 14,
                    color: 'rgb(110, 115, 132)',
                },
                axisLabel: {
                    show: true,
                    margin: 8,
                    textStyle: {
                        fontSize: 14,
                        color: 'rgb(51, 57, 79)'
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgb(236, 239, 248)'
                    }
                }
            },
            series: [{
                name: '专题访问量',
                type: 'bar',
                barWidth: 18,
                barMinHeight: 0,
                data: []
            }]
        };

        volumeChart = echarts.init(document.getElementById('volume-echart'));
        volumeChart.setOption(chartOption);

        // 热点指标TOP5-图表
        chartOption = {
            grid: {
                top: 45,
                left: 25,
                right: 8,
                bottom: 3,
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                confine: true,
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#eceff8',
                        width: 2
                    },
                },
                padding: [8, 12],
                backgroundColor: 'rgba(41, 47, 71, .8)',
            },
            color: ['#1ec6e3'],
            xAxis: {
                type: 'category',
                axisLabel: {
                    show: true,
                    margin: 12,
                    textStyle: {
                        fontSize: 14,
                        color: 'rgb(51, 57, 79)'
                    },
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#c3ccd8'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: [],
            },
            yAxis: {
                type: 'value',
                name: '热度',
                nameRotate: '0.1',
                nameGap: 24,
                nameTextStyle: {
                    fontSize: 14,
                    color: 'rgb(110, 115, 132)',
                },
                axisLabel: {
                    show: true,
                    margin: 12,
                    textStyle: {
                        fontSize: 14,
                        color: 'rgb(51, 57, 79)'
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#e8ebf0'
                    }
                }
            },
            series: [{
                name: '热度',
                type: 'line',
                showSymbol: false,
                symbol: 'circle',
                data: []
            }]
        };

        hotindChart = echarts.init(document.getElementById('hotind-echart'));
        hotindChart.setOption(chartOption);
    }

    initChart();

    // 渲染顶部总览数据
    function renderStattotal() {
    	epoint.execute('cockpitstatisticsaction.topDataView','',function(data){
    		Util.renderNum('total', JSON.parse(data), Util.addCommas);
    	});
    }
    renderStattotal();

    // 渲染专题访问量统计
    function renderVolume(dateval) {
    	epoint.execute('cockpitstatisticsaction.getProjectPageViewStatistics','',dateval,function(data){
    		var data = JSON.parse(data);
            // 取访问量最大值，固定坐标轴刻度
            var maxvalue = Util.getMax(data, 'value'),
                maxdata = formatInt(maxvalue, 1, true),
                endvalue; // 图表滚动条end值

            volumeChart.setOption({
                xAxis: {
                    data: Util.getValArr(data, 'name'),
                },
                yAxis: {
                    max: maxdata,
                },
                series: [{
                    data: Util.getValArr(data, 'value'),
                }],
            });

            endvalue = datazoomEnd(100, volumeChart);

            // 图表dataZoom 回到初始位置
            volumeChart.dispatchAction({
                type: 'dataZoom',
                // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
                dataZoomIndex: 0,
                // 结束位置的百分比，0 - 100
                end: endvalue,
                // 开始位置的数值
                start: 0,
            });

        });
    }
    renderVolume(date);

    // 渲染热点指标TOP5 表格
    function renderRanking() {
        Util.ajax({
            url: pageConfig.getRanking,
            success: function(data) {
                $.each(data.ranking, function(i, item) {
                    item.sort = i + 1;
                });

                // 设置第一个默认高亮
                if (!hottop) {
                    data.ranking[0].isActive = true;
                    hottop = data.ranking[0].guid;
                }

                Util.renderer('ranking-tmpl', data).to('hotind-tablecont');
                renderHotind(hottop);
            }
        });
    }
    renderRanking();

    // 渲染热点指标TOP5 热度
    function renderHotind(hottopval) {
        Util.ajax({
            url: pageConfig.getHotind,
            data: {
                params: JSON.stringify({
                    hottop: hottopval
                })
            },
            success: function(data) {
                hotindChart.setOption({
                    xAxis: {
                        data: Util.getValArr(data.hotind, 'name'),
                    },
                    series: [{
                        data: Util.getValArr(data.hotind, 'value')
                    }]
                });
            }
        });
    }

    // 渲染任务统计表格
    epoint.initPage(pageConfig.initPage, '@all', function() {});

    // 专题访问量统计 今日、近7天、近30天 点击事件
    $('.volume').on('click', '.mod-tab>li', function() {
        var $this = $(this);
        if (!$this.hasClass('active')) {
            date = $this.data('id');
            $this.addClass('active').siblings().removeClass('active');
            renderVolume(date);
        }
    });

    // 热点指标TOP5表格行 点击事件
    $('.hotind').on('click', '.hotind-table tbody tr', function() {
        var $this = $(this);
        if (!$this.hasClass('active')) {
            hottop = $this.data('id');
            $this.addClass('active').siblings().removeClass('active');
            renderHotind(hottop);
        }
    });

    // 对外展示情况 专题数、指标数、热度点击事件
    $('.exhibit').on('click', '.mod-options>li', function() {
        var $this = $(this);

        if (!$this.hasClass('active')) {
            exhibitopt = $this.data('id');
            $this.addClass('active').siblings().removeClass('active');
            mini.get('exhibitval').setValue(exhibitopt);
            if(exhibitopt == 'projnums'){
            	mini.get('datagrid1').updateColumn("nums", {
					header : "专题数",
					type : ""
				});
            } else if(exhibitopt == 'indnums'){
            	mini.get('datagrid1').updateColumn("nums", {
					header : "指标数",
					type : ""
				});
            }
            epoint.refresh(['datagrid1', 'exhibitval']);
        }
    });

    // 预警情况 专题数、指标数、热度点击事件
    $('.warning').on('click', '.mod-options>li', function() {
        var $this = $(this);

        if (!$this.hasClass('active')) {
            warningopt = $this.data('id');
            $this.addClass('active').siblings().removeClass('active');
            mini.get('warningval').setValue(warningopt);
            if(warningopt == 'projnums'){
                console.log("1");
            	mini.get('datagrid2').updateColumn("nums", {
					header : "预警数",
					type : ""
				});
            } else if(warningopt == 'redlightnums'){
                console.log("2");
            	mini.get('datagrid2').updateColumn("nums", {
					header : "红灯数",
					type : ""
				});
            }
            else if(warningopt == 'redlightrate'){
                console.log("3");
            	mini.get('datagrid2').updateColumn("nums", {
					header : "及时率",
					type : ""
				});
            }
            epoint.refresh(['datagrid2', 'warningval']);
        }
    });

    /**
	 * 计算图表滚动条 dataZoom end 值
	 * 
	 * @param {Number}
	 *            single 单个宽度
	 * @param {Object}
	 *            echartdom
	 */

    function datazoomEnd(single, echartdom) {
        var isshow = true, // 图表滚动条是否显示
            endval; // 图表滚动条end值

        var setlen = Math.floor(echartdom.getWidth() / single), // 根据设置的单个的宽度计算展示的数量
            len = echartdom.getOption().xAxis[0].data.length;  // 获取 X 轴总数量

        // 图表滚动条显隐
        if (len > setlen) {
            isshow = true; // 通过横轴数据多少来判断滚动条是否显示(官网说滚动条不显示，但过滤数据的功能还在)
            endval = (setlen / len) * 100;
        } else {
            isshow = false;
            endval = 100; // 不显示滚动条的时候要把滚动条结束位置设置一下，不然会有bug
        }

        echartdom.setOption({
            dataZoom: [{
                show: isshow,
                end: endval, // 初始化滚动条
            }, {
                show: isshow,
                end: endval, // 初始化滚动条
            }],
        });

        return endval;
    }

    // 图表自适应
    Util.echartsResize()();

    // 图表 dataZoom 自适应
    $(window).on('resize', function() {

        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            datazoomEnd(100, volumeChart);
        }, 120);
    });

    /**
	 * 将数字取整为10的倍数
	 * 
	 * @param {Number}
	 *            num 需要取整的值
	 * @param {Number}
	 *            prec 需要用0占位的数量
	 * @param {Boolean}
	 *            ceil 是否向上取整
	 */
    function formatInt(num, prec, ceil) {
        var len = String(num).length;
        if (len <= prec) return num;

        var mult = Math.pow(10, prec);
        return ceil ? Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult;
    }

})(this, jQuery);
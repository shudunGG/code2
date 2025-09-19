/**!
 * [消费者权益保护数据分析应用平台]
 * date:2017-03-23
 * author: [chengang];
 */

function getNow() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var day = now.getDate();
    if (day < 10) day = "0" + day;
    var hours = now.getHours();
    if (hours < 10) hours = "0" + hours;
    var minutes = now.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    var seconds = now.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;
    var week = new Array("日", "一", "二", "三", "四", "五", "六");
    var weekday = week[now.getDay()];
    var timeStr = year + "年&nbsp;" + month + "月&nbsp;" + day + "日&nbsp;" + hours + ":" + minutes + ":" + seconds + "&nbsp;&nbsp;星期" + weekday;
    return timeStr;
}
(function() {
    var arg = arguments;
    var nows = getNow();
    $("#timer").html(nows);
    setTimeout(function() { arg.callee(); }, 1000);
})();




$(function() {
    var chartMap,       //咨询投诉区域分布
        chartTotal,     //咨询投诉总量
        chartDept,      //部门咨询投诉
        chartIncrease,  //增长率
        chartGoods,     //商品服务类
        chartconsume;   //消费人群分布

    var chartoption;

    //初始化图表
    var initChart = function() {

        //#region 咨询投诉总量
        chartMap = echarts.init(document.getElementById('chartmap'));
        chartoption = {
            visualMap: {

                text: ['高', '低'],           // 文本，默认为数值文本
                textStyle: {
                    color: "#fff"
                },
                inverse: true,
                inRange: {
                    color: ['#fbaf6e', '#ff722d']
                },
                min: 0,
                itemWidth: 13,
                itemHeight: 175,
                left: 32
            },
            series: [
                {
                    type: 'map',
                    map: 'suqian',
                    roam: false,
                    selectedMode: 'single',
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 14,
                                color: "#fff"
                            }
                        },
                        emphasis: {
                            textStyle: {
                                fontSize: 14,
                                color: "#fff"
                            },
                            show: true
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            areaColor: "#f37c3a"
                        }
                    },
                    top: 15,
                    bottom: 15
                }
            ]
        };
        chartMap.setOption(chartoption);
        //#endregion


        //#region 咨询投诉总量
        chartTotal = echarts.init(document.getElementById('charttotal'));
        chartoption = {
            grid: {
                left: 80,
                right: 80,
                bottom: 20,
                top: 20,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value',
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 14
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: [],
                    inverse: true,
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '总量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: "#2f8ef9",
                                fontSize: 16
                            }
                        }
                    },
                    barWidth: 13,
                    itemStyle: {
                        normal: {
                            color: "#2f8ef9",
                            barBorderRadius: [0, 6, 6, 0]
                        }
                    },
                    data: []
                }
            ]
        };
        chartTotal.setOption(chartoption);
        //#endregion

        //#region 部门咨询投诉
        chartDept = echarts.init(document.getElementById('chartdept'));
        chartoption = {
            grid: {
                left: 20,
                right: 20,
                bottom: 20,
                top: 80,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 14
                        },
                        interval: 0
                    },
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: "数量",
                    nameGap: 30,
                    nameTextStyle: {
                        color: "#fff",
                        fontSize: 16
                    },
                    boundaryGap: ["0%", "5%"],
                    splitLine: {
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisTick: { show: false },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '总量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: "#fba432",
                                fontSize: 16
                            }
                        }
                    },
                    barWidth: 20,
                    itemStyle: {
                        normal: {
                            color: "#fba432"
                        }
                    },
                    data: []
                }
            ]
        };
        chartDept.setOption(chartoption);

        //#endregion

        //#region 增长率
        chartIncrease = echarts.init(document.getElementById('chartincrease'));
        chartoption = {
            legend: {
                data: ['数量', '增长率'],
                textStyle: {
                    color: "#fff",
                    fontSize: 16
                },
                itemGap: 40,
                top: 20
            },
            grid: {
                left: 20,
                right: 20,
                bottom: 20,
                top: 100,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 14
                        },
                        interval: 0
                    },
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: "数量",
                    nameGap: 30,
                    nameTextStyle: {
                        color: "#fff",
                        fontSize: 16
                    },
                    boundaryGap: ["0%", "5%"],
                    splitLine: {
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisTick: { show: false },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    }
                }, {
                    type: 'value',
                    name: "增长率",
                    nameGap: 30,
                    nameTextStyle: {
                        color: "#fff",
                        fontSize: 16
                    },
                    boundaryGap: ["0%", "5%"],
                    splitLine: {
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisTick: { show: false },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    barWidth: 20,
                    itemStyle: {
                        normal: {
                            color: "#2f8ef9"
                        }
                    },
                    data: []
                },
                {
                    name: '增长率',
                    type: 'line',
                    yAxisIndex: 1,
                    symbol: "circle",
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            color: "#fba432"
                        }
                    },
                    data: []
                }
            ]
        };
        chartIncrease.setOption(chartoption);
        //#endregion

        //#region 商品服务类
        chartGoods = echarts.init(document.getElementById('chartgoods'));
        chartoption = {
            color: ["#0078ff", "#fa5252", "#3d4bff", "#2bbcc1", "#ffc66c", "#8827ff", '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            legend: {
                data: [],
                textStyle: {
                    color: "#fff",
                    fontSize: 14
                },
                itemGap: 10,
                itemHeight: 3,
                top: 20
            },
            grid: {
                left: 20,
                right: 50,
                bottom: 20,
                top: 80,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisTick: { show: false },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 14
                        },
                        interval: 0
                    },
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    boundaryGap: ["0%", "5%"],
                    splitLine: {
                        lineStyle: {
                            color: "#747474",
                            type: "dashed"
                        }
                    },
                    axisTick: { show: false },
                    axisLabel: {
                        textStyle: {
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#747474"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '增长率',
                    type: 'line',
                    showSymbol: false,
                    data: []
                }
            ]
        };
        chartGoods.setOption(chartoption);
        //#endregion

        //#region 消费人群分布
        chartConsume = echarts.init(document.getElementById('chartconsume'));
        chartoption = {
            color: ["#0078ff", "#fa5252", "#3d4bff", "#2bbcc1", "#ffc66c", "#8827ff", '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
            series: [
                {
                    name: '消费人群分布',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    data: [
                        { "name": "宿城区", "value": 8218 },
                        { "name": "宿豫区", "value": 2588 },
                        { "name": "沭阳县", "value": 9811 },
                        { "name": "泗洪县", "value": 2487 },
                        { "name": "泗阳县", "value": 8724 }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        chartConsume.setOption(chartoption);
        //#endregion

    }

    //渲染咨询投诉总量
    var renderMap = function(data) {
        var max = 0;
        $.each(data, function(i, e) {
            if (e.value > max) {
                max = e.value;
            }
        })
        chartMap.setOption({
            visualMap: {
                max: max
            },
            series: [{
                data: data
            }]
        });
    }

    //渲染咨询投诉总量
    var renderTotal = function(data) {
        var lbls = [], vals = [];
        $.each(data, function(i, e) {
            lbls.push(e.label);
            vals.push(e.value);
        })
        chartTotal.setOption({
            yAxis: [
                {
                    data: lbls,
                }
            ],
            series: [
                {
                    name: '总量',
                    data: vals
                }
            ]
        })
    }

    //渲染咨询投诉总量
    var renderDept = function(data) {
        var lbls = [], vals = [];
        $.each(data, function(i, e) {
            lbls.push(e.label);
            vals.push(e.value);
        })
        chartDept.setOption({
            xAxis: [
                {
                    data: lbls,
                }
            ],
            series: [
                {
                    name: '数量',
                    data: vals
                }
            ]
        })
    }

    //渲染增长率排名
    var renderIncrease = function(data) {
        var lbls = [], vals1 = [], vals2 = [];
        $.each(data, function(i, e) {
            lbls.push(e.label);
            vals1.push(e.count);
            vals2.push(e.increase);
        })
        chartIncrease.setOption({
            xAxis: [
                {
                    data: lbls,
                }
            ],
            series: [
                {
                    name: '数量',
                    data: vals1
                },
                {
                    name: '增长率',
                    data: vals2
                }
            ]
        })
    }

    //渲染商品及服务
    var renderGoods = function(data) {
        var legends = [], series = [];
        $.each(data.details, function(i, e) {
            legends.push({
                name: e.label,
                icon: "rect"
            });
            series.push({
                name: e.label,
                type: 'line',
                showSymbol: false,
                data: e.data
            });
        });
        chartGoods.setOption({
            legend: {
                data: legends
            },
            xAxis: [
                {
                    data: data.months,
                }
            ],
            series: series
        })
    }

    //渲染消费人群分布
    var renderConsume = function(data) {
        chartConsume.setOption({
            series: {
                name: '消费人群分布',
                data: data
            }
        })
    }


    //初始化图表
    initChart();

    //请求数据
    var requestData = function() {
        $.ajax({
            url: settings.loaddata,
            success: function(data) {
                data = data.custom;
                renderMap(data.mapdata);
                renderTotal(data.total);
                renderDept(data.dept);
                renderIncrease(data.increase);
                renderGoods(data.goods);
                renderConsume(data.consume);
            }
        });
    }

    requestData();
})
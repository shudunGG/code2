/**!
 * 数字驾驶舱-事件预警指标台
 * date:2021-03-02
 * author: qxy
 */

'use strict';
/* global pageConfig, Donut3D */

(function(win, $) {

    Util.hidePageLoading();

    // 图表变量，地图纹理
    var option,
        chartHandle, //大厅运营情况折线图
        pieAuto, //事项分析饼图
        chartSatisfy, //综合满意度水球图
        chartMap, //政务服务拥挤通道地图
        symbolData = [], //地图点数据
        symbolText = [],
        img = new Image();
    img.src = './images/warningPlatform/map.jpg';


    // 初始化图表
    function initChart() {
        option = {
            baseOption: {
                tooltip: {
                    trigger: 'axis',
                    formatter: '受理量：{c}件',
                    padding: [6, 10, 6, 10],
                    backgroundColor: 'transparent',
                    confine: 'true',
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            type: 'dashed',
                            color: 'rgba(255, 210, 0, 1)'
                        }
                    },
                    textStyle: {
                        fontWeight: 'bold',
                        color: '#ffd200'
                    },
                    extraCssText: 'border-radius:0;box-shadow: 0 0 6px inset rgba(255,210,0, 1);'
                },
                grid: {
                    top: '7%',
                    bottom: '20%',
                    right: '3%',
                    left: '9%'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: 0,
                    axisLine: {
                        lineStyle: {
                            color: '#002D37'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        textStyle: {
                            color: '#007C96'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#002D37'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#007C96'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                },
                series: {
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 6,
                    hoverAnimation: false,
                    itemStyle: {
                        color: '#00FCFF',
                        emphasis: {
                            color: '#eac40b'
                        }
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'rgba(0, 234, 255, .6)'
                            }, {
                                offset: 1,
                                color: 'rgba(0, 234, 255, 0)'
                            }],
                            global: false
                        }
                    },
                    data: []
                }
            },
            media: [{
                query: {
                    minWidth: 471
                },
                option: {
                    grid: {
                        bottom: '20%',
                    },
                    xAxis: {
                        axisLabel: {
                            rotate: 0
                        }
                    }
                }
            }, {
                query: {
                    maxWidth: 470
                },
                option: {
                    grid: {
                        bottom: '25%',
                    },
                    xAxis: {
                        axisLabel: {
                            rotate: 40
                        }
                    }
                }
            }]
        };
        chartHandle = echarts.init(document.getElementById('chart-handle'));
        chartHandle.setOption(option);

        option = {
            baseOption: {
                title: {
                    x: 'center',
                    y: 'center',
                    textStyle: {
                        rich: {
                            title: {
                                color: '#fff'
                            },
                            rate: {
                                padding: [0, 0, 12, 0],
                                fontWeight: 'bold',
                                color: '#EEDD78',
                                textShadowColor: '#132851',
                                textShadowBlur: 5
                            }
                        }
                    }
                },
                series: [{
                    type: 'liquidFill',
                    radius: '100%',
                    center: ['50%', '50%'],
                    backgroundStyle: {
                        color: 'transparent'
                    },
                    itemStyle: {
                        opacity: 1,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00DEFF'
                        }, {
                            offset: 1,
                            color: '#0787FF'
                        }])
                    },
                    label: {
                        show: false
                    },
                    outline: {
                        show: false
                    },
                    data: []
                }]
            },
            media: [{
                query: {
                    minWidth: 109
                },
                option: {
                    title: {
                        textStyle: {
                            rich: {
                                title: {
                                    fontSize: 16
                                },
                                rate: {
                                    fontSize: 24
                                }
                            }
                        }
                    }
                }
            }, {
                query: {
                    maxWidth: 108
                },
                option: {
                    title: {
                        textStyle: {
                            rich: {
                                title: {
                                    fontSize: 12
                                },
                                rate: {
                                    fontSize: 14
                                }
                            }
                        }
                    }
                }
            }]
        };
        chartSatisfy = echarts.init(document.getElementById('chart-satisfy'));
        chartSatisfy.setOption(option);

        option = {
            baseOption: {
                geo: [{
                    z: 1,
                    top: '8%',
                    right: '11%',
                    bottom: '4%',
                    left: '14%',
                    itemStyle: {
                        areaColor: {
                            image: img,
                            repeat: 'no-repeat'
                        },
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,255,255,.6)',
                        borderWidth: 1,
                        borderColor: '#85e1ec'
                    },
                    emphasis: {
                        itemStyle: {
                            areaColor: {
                                image: img,
                                repeat: 'no-repeat'
                            },
                            shadowBlur: 10,
                            shadowColor: 'rgba(0,255,255,.6)',
                            borderWidth: 1,
                            borderColor: '#85e1ec'
                        }
                    }
                }, {
                    z: 2,
                    top: '8%',
                    right: '11.5%',
                    bottom: '4.5%',
                    left: '14%',
                    itemStyle: {
                        // areaColor: {
                        //     image: img,
                        //     repeat: 'no-repeat'
                        // },
                        areaColor: 'transparent',
                        borderWidth: 1,
                        borderColor: '#85e1ec'
                    },
                    emphasis: {
                        itemStyle: {
                            // areaColor: {
                            //     image: img,
                            //     repeat: 'no-repeat'
                            // },
                            areaColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#85e1ec'
                        }
                    }
                }, {
                    z: 3,
                    top: '8%',
                    right: '12%',
                    bottom: '5%',
                    left: '14%',
                    itemStyle: {
                        areaColor: 'transparent',
                        borderWidth: 1,
                        borderColor: '#85e1ec'
                    },
                    emphasis: {
                        label: {
                            show: false
                        },
                        itemStyle: {
                            areaColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#85e1ec'
                        }
                    }
                }],
                series: [{
                    z: 4,
                    top: '8%',
                    right: '12%',
                    bottom: '5%',
                    left: '14%',
                    type: 'map',
                    itemStyle: {
                        areaColor: 'transparent',
                        borderWidth: 0
                    },
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        },
                        itemStyle: {
                            areaColor: 'transparent',
                            borderWidth: 0
                        }
                    }
                }, {
                    z: 6,
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    label: {
                        show: true,
                        color: '#fff'
                    }
                }, {
                    z: 5,
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    symbolSize: 3,
                    symbolOffset: [0, 5],
                    rippleEffect: {
                        brushType: 'stroke',
                        scale: 20
                    }
                }]
            },
            media: [{
                query: {
                    minWidth: 581
                },
                option: {
                    series: [{}, {
                        label: {
                            padding: [0, 0, 60, 0],
                            fontSize: 16
                        },
                        symbolSize: [26, 34]
                    }]
                }
            }, {
                query: {
                    maxWidth: 580
                },
                option: {
                    series: [{}, {
                        label: {
                            padding: [0, 0, 45, 0],
                            fontSize: 12
                        },
                        symbolSize: [20, 26]
                    }]
                }
            }]
        };
        chartMap = echarts.init(document.getElementById('chart-map'));
        chartMap.setOption(option);
    }
    initChart();

    $.getJSON('./js/map/suzhou.json', function(mapCoordData) {
        echarts.registerMap('map', mapCoordData);
        chartMap.setOption({
            geo: [{
                map: 'map'
            }, {
                map: 'map'
            }, {
                map: 'map'
            }],
            series: [{
                map: 'map'
            }]
        });
    });

    // 请求 大厅运营情况 数据
    Util.ajax({
        url: pageConfig.getHallOperate,
        success: function(data) {
            // 加载滚动数字
            Util.scrollNumber('#whole-handle', data.wholeHandle, 6);
            Util.scrollNumber('#whole-finish', data.wholeFinish, 6);
            Util.scrollNumber('#month-handle', data.monthHandle, 4);
            Util.scrollNumber('#month-finish', data.monthFinish, 4);

            // 数据渲染
            Util.renderer(data, 'data-render').container('hallOperate');

            // 增减判断
            upOrDown('#compare-handle', data.monthHSymbol);
            upOrDown('#compare-finish', data.monthFSymbol);

            // 渲染图表
            chartHandle.setOption({
                xAxis: {
                    data: Util.getValArr(data.list, 'name')
                },
                series: {
                    data: data.list
                }
            });
        }
    });

    // 请求 事项分析 数据
    Util.ajax({
        url: pageConfig.getItemAnalysis,
        success: function(data) {
            var li = '',
                colorList = ['#03e3fe', '#fd8b3d', '#eedd78', '#f786a3', '#6ba2fe', '#ed4956', '#17de9a', '#00d4fd'],
                nameList = ['行政许可', '行政处罚', '行政裁决', '行政监督', '行政奖励'];
            // 数据处理
            $.each(data.list, function(i, e) {
                if(i == 5){ 
                    return false;
                }
                e.name = nameList[i];
                e.color = colorList[i];
                li += '<li>\
                <i class="ico" style="background:' + colorList[i] + '"></i>\
                <p class="info">\
                    <span class="val"><span>' + e.value + '</span>项</span>\
                    <span class="name" title="' + e.name + '">' + e.name + '</span>\
                </p>\
            </li>';
            });
            data.list = data.list.slice(0, 5);
            // 数据渲染
            Util.renderer(data, 'data-render').container('itemAnalysis');
            // 图表渲染
            pieAuto = new Donut3D({
                'dom': 'analysis-chart',
                'tooltip': true, //默认显示悬框(默认展示name:value(percent))；false不显示悬停框
                'formatter': '{a}:{b}({c})', //自定义悬停框展示内容;{a}为name;{b}为value;{c}为percent;
                'highLight': true, //鼠标移入高亮。默认不高亮；true高亮
                'data': data.list, //图形数据
                'innerCircle': 0.4, //3D内圈空心圆大小，范围：0-1，值越大圆越大
                'land': 12, //图形厚度

                // 是否保持固定宽高比
                'ratio': 0.85, // 固定高宽比、注意是 高/宽 的比例(设置了该值则纵向半径失效)，自适应时建议设置该值，以防拉升变形。
                'radius': ['90%', '40%'], // 半径，分别为横向半径、纵向半径(可以是比例、具体像素值),通过该值控制3D角度。
            });
            // 图表legend渲染
            $('#nalysis-legend').empty().append(li);
        }
    });

    // 请求 窗口统计 数据
    Util.ajax({
        url: pageConfig.getWindowStatistic,
        success: function(data) {
            var nameList = ['公安局', '国土局', '地税局', '烟草局', '环保局', '卫计委', '城管局'];
            // 数据处理
            $.each(data.data, function(i, e) {
                e.name = nameList[i];
                e.simpleName = e.name;
                if (e.name.length > 5) {
                    e.simpleName = (e.name).substring(0, 4) + '...';
                }
            });
            Util.renderer('window-tmpl', data).to('window-statistic');
        }
    });

    // 请求 中心窗口 数据
    Util.ajax({
        url: pageConfig.getCenterWindow,
        success: function(data) {
            var nameList = ['税务局', '房管局', '公安局', '国土局', '环保局'];
            $.each(data.data, function(i, e) {
                e.name = nameList[i];
            });
            Util.renderer('center-tmpl', data).to('center-window');
        }
    });

    // 请求 综合满意度 数据
    Util.ajax({
        url: pageConfig.getSatisfy,
        success: function(data) {
            // 渲染水球图
            chartSatisfy.setOption({
                title: {
                    text: '{title|综合满意度}\n{rate| ' + data.satisfy + '%}'
                },
                series: [{
                    data: [data.satisfy / 100, {
                        value: data.satisfy / 100,
                        itemStyle: {
                            opacity: 0.7
                        }
                    }, {
                        value: data.satisfy / 100,
                        itemStyle: {
                            opacity: 0.5
                        }
                    }, {
                        value: data.satisfy / 100,
                        itemStyle: {
                            opacity: 0.2
                        }
                    }]
                }]
            });
            // 列表渲染
            Util.renderer('satisfy-tmpl', data).to('satisfy-list');
        }
    });

    // 请求 一体机分析 数据
    Util.ajax({
        url: pageConfig.getAIO,
        success: function(data) {
            Util.renderer(data, 'data-render').container('aio');
            $.each(data.data, function(i, e) {
                e.name = '0' + (i+1) + '一体机';
            });
            Util.renderer('aio-tmpl', data).to('top-list');
        }
    });

    // 请求 村村办件 数据
    Util.ajax({
        url: pageConfig.getVillage,
        success: function(data) {
            var nameList = ['人民调解', '治安保卫', '公共卫生', '劳动关系协调'];
            $.each(data.data, function(i, e) {
                e.name = nameList[i];
            });
            Util.renderer(data, 'data-render').container('village');
            Util.renderer('village-tmpl', data).to('village-handle');
        }
    });

    // 请求 上门服务 数据
    Util.ajax({
        url: pageConfig.getDoorService,
        success: function(data) {
            var nameList = ['法制宣传教育', '特困老人补助', '职业培训', '创业服务', '兵役登记'];
            $.each(data.data, function(i, e) {
                e.name = nameList[i];
            });
            Util.renderer(data, 'data-render').container('doorService');
            Util.renderer('village-tmpl', data).to('door-service');
        }
    });

    // 请求 政务服务拥挤通道 的数据
    Util.ajax({
        url: pageConfig.getChannel,
        success: function(data) {
            var nameList = ['苏州市', '张家港市', '南通市', '太仓市', '无锡市', '湖州市']
            $.each(data.mapData, function(i,e){
                e.name = nameList[i];
            })
            var colorList = ['#f00', '#ff0', '#00B4FF'];
            symbolText = $.extend(true, [], data.mapData);
            symbolData = $.extend(true, [], data.mapData);
            // 数据渲染
            Util.renderer(data, 'data-render').container('yangtze');
            // 数据处理
            $.each(data.mapData, function(i, e) {

                symbolText[i].symbol = 'image://./images/warningPlatform/symbol' + e.degree + '.png';
                symbolData[i].itemStyle = {
                    color: colorList[e.degree]
                };
            });
            // 渲染地图
            chartMap.setOption({
                series: [{}, {
                    label: {
                        formatter: '{b}'
                    },
                    data: symbolText
                }]
            });
        }
    });

    // 地图点击事件
    chartMap.on('click', function(e) {
        var highText = $.extend(true, [], symbolText),
            highData = [],
            emphasisSize = 16;
        if ($('#chart-map').width() > 580) {
            emphasisSize = 20;
        }
        if (e.seriesType === 'scatter') {
            for (var i = 0; i < symbolData.length; i++) {
                if (symbolData[i].name === e.name) {
                    highData[0] = symbolData[i];
                    highText[i].label = {
                        fontSize: emphasisSize,
                        color: '#fff',
                        textBorderWidth: 3,
                        textBorderColor: '#003d5a',
                        textShadowBlur: 8,
                        textShadowColor: 'rgba(8,248,245,.6)'
                    };
                }
            }
            chartMap.setOption({
                series: [{}, {
                    data: highText
                }, {
                    data: highData
                }]
            });
        }
    });


    // 封装增减判断方法
    function upOrDown(id, data) {
        if (data == 0) {
            $(id).addClass('down');
        } else {
            $(id).addClass('up');
        }
    }

    // 图表自适应
    $(win).resize(function() {
        pieAuto.resize();
    });
    Util.echartsResize()();

})(this, jQuery);
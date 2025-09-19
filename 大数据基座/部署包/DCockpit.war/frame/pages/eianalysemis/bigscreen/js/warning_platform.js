/**!
 * 数字驾驶舱-事件预警指标台
 * date:2021-02-24
 * author: qxy
 */

'use strict';
/* global pageConfig */

(function(win, $) {

    setTimeout(function() {
        Util.hidePageLoading();
    }, 1500);

    // 图表变量，地图纹理
    var chartWarning,
        symbolData = [], //地图点数据
        symbolText = [],
        img = new Image();
    img.src = './images/warningPlatform/map.jpg';

    var resourceHd = $('.resource-hd'), //资源调度tab头部
        $dispatcherSta = $('.dispatcher-statistics'), //调度统计表格
        $statisticsDetail = $('.statistics-detail'), //调度统计详情
        $dynamicCon = $('#dynamic-con'); //事件动态内容

    // 初始化图表
    function initChart() {
        var chartOption = {
            geo: [{
                z: 1,
                top: '8%',
                right: '11%',
                bottom: '20%',
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
                right: '12%',
                bottom: '21%',
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
                z: 3,
                top: '8%',
                right: '13%',
                bottom: '22%',
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
                    label: {
                        show: false
                    },
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
            }],
            series: [{
                z: 4,
                top: '8%',
                right: '13%',
                bottom: '22%',
                left: '14%',
                type: 'map',
                itemStyle: {
                    borderColor: '#85e1ec',
                    areaColor: '#818181',
                    opacity: 0.14,
                    borderWidth: 1
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: false
                    },
                    itemStyle: {
                        borderColor: '#85e1ec',
                        areaColor: '#818181',
                        opacity: 0.14,
                        borderWidth: 1
                    }
                }
            }, {
                z: 6,
                type: 'scatter',
                coordinateSystem: 'geo',
                label: {
                    show: true,
                    padding: [0, 0, 60, 0],
                    fontSize: 16,
                    color: '#EAFFFF'
                },
                symbolSize: [26, 34]
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
        };
        chartWarning = echarts.init(document.getElementById('warning-chart'));
        chartWarning.setOption(chartOption);
    }
    initChart();

    $.getJSON('./js/map/suzhou.json', function(mapCoordData) {
        echarts.registerMap('map', mapCoordData);
        chartWarning.setOption({
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

    // 请求 事件预警指标台 数据
    Util.ajax({
        url: pageConfig.getWarningPlatform,
        success: function(data) {
            var colorList = ['#f00', '#ff0', '#00B4FF'];
            symbolText = $.extend(true, [], data.mapData);
            symbolData = $.extend(true, [], data.mapData);
            // 渲染数据
            Util.renderer(data, 'data-render').container('warningPaltform');
            // 渲染地图点标记
            $.each(data.mapData, function(i, e) {
                symbolText[i].symbol = 'image://./images/warningPlatform/symbol' + e.degree + '.png';
                symbolData[i].itemStyle = {
                    color: colorList[e.degree]
                };
            });
            chartWarning.setOption({
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
    chartWarning.on('click', function(e) {
        var highText = $.extend(true, [], symbolText),
            highData = [];
        if (e.seriesType === 'scatter') {
            for (var i = 0; i < symbolData.length; i++) {
                if (symbolData[i].name === e.name) {
                    highData[0] = symbolData[i];
                    highText[i].label = {
                        fontSize: 20,
                        color: '#fff',
                        textBorderWidth: 3,
                        textBorderColor: '#003d5a',
                        textShadowBlur: 8,
                        textShadowColor: 'rgba(8,248,245,.6)'
                    };
                }
            }
            chartWarning.setOption({
                series: [{}, {
                    data: highText
                }, {
                    data: highData
                }]
            });
        }
    });

    // 右侧整体tab切换
    $('.warning-tab').Tab({
        hd: '.tab-hd>li',
        bd: '.tab-bd>div'
    });

    // 事件动态-多行省略
    setTimeout(function() {
        $('.info-detial-text').ellipsis({
            row: 2
        });
    });

    // 事件动态 - 整体展开与折叠
    $dynamicCon.on('click', '.optionbtn', function() {
        var $this = $(this),
            $infoDetialItems = $('.info-detial-items'),
            $infoShowBtn = $('.info-show-btn');
        if ($this.hasClass('active')) {
            $infoDetialItems.slideDown();
            $infoShowBtn.removeClass('active');
        } else {
            $infoDetialItems.slideUp();
            $infoShowBtn.addClass('active');
        }
        $this.toggleClass('active');
    });

    // 事件动态 - 模块展开与折叠
    $dynamicCon.on('click', '.info-show-btn', function() {
        var $this = $(this),
            $infoItem = $this.closest('.info-item'),
            $infoDetialItems = $infoItem.find('.info-detial-items');
        if ($this.hasClass('active')) {
            $infoDetialItems.slideDown();
        } else {
            $infoDetialItems.slideUp();
        }
        $this.toggleClass('active');
    });

    // 组织结构tab切换
    $('.organization-structure').Tab({
        hd: '#organization-hd>li',
        bd: '.organization-bd>ul',
        after: function($hd) {
            if ($hd.index() == 0) {
                resourceHd.removeClass('active');
            } else {
                resourceHd.addClass('active');
            }
        }
    });

    // 组织结构 - 树展开与折叠
    $('.organization-tree').on('click', '.ico', function() {
        var $this = $(this),
            $ul = $this.siblings('ul');
        $this.toggleClass('active');
        $ul.slideToggle();
    });

    // 资源调度tab切换
    $('.resource-scheduling').Tab({
        hd: '#resource-hd>li',
        bd: '.resource-bd>div',
        after: function($hd) {
            if ($hd.index() == 0) {
                resourceHd.removeClass('active');
            } else {
                resourceHd.addClass('active');
            }
        }
    });

    // 资源调度 - 查看详情
    $dispatcherSta.on('click', '.view', function() {
        var name = $(this).parents('tr').find('.text-left').text();
        // 隐藏当前表格
        $dispatcherSta.hide();
        // 显示详情
        $statisticsDetail.show();
        $('#statistic-title').text(name);
    });

    // 资源调度 - 详情返回
    $statisticsDetail.on('click', '.back-btn', function() {
        $dispatcherSta.show();
        $statisticsDetail.hide();
    });

    // 图表自适应
    Util.echartsResize()();

})(this, jQuery);
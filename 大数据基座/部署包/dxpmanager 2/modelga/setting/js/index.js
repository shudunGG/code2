/*!
 *数据建模平台-配置中心脚本
 *author:guli
 *date:2020-08-21
 *version:1.1.0
 */
'use strict';
(function() {

	epoint.initPage('dxpmodelsettingmonitoraction');
    //在线人数、历史活跃人数、累计模型、仪表盘旋转角度、近一周使用率
    var $online = $('.online'),
        $history = $('.history'),
        $modelTxt = $('.modelTxt'),
        $panelTxt = $('.panelTxt'),
        $panelPointer = $('.panelPointer');
    epoint.execute('getUseInfo','','',function(data){
    	 var online = data.online,
         history = data.history,
         model = data.model,
         percent = data.percent,
         rotate = data.rotate,
     rot = 'rotate(' +
         rotate + 'deg)';
     $online.text(online);
     $history.text(history);
     $modelTxt.text(model);
     $panelTxt.text(percent);
     $panelPointer.css('transform', rot);
    });
    
//    $.ajax({
//        url: 'https://fe.epoint.com.cn/mock/223/gl/data',
//        type: 'POST'
//    }).done(function(data) {
//       
//    });
})(this, this.jQuery);
(function() {
    epoint.execute('getTodayChart','','',function(data){
    	//   if (data.length > 11) {
        //       $('#todayStatistic').css('width', '200%');
        //       $(".todayStatistic").niceScroll({
        //           touchbehavior: false,
        //           cursorcolor: "rgb(114,142,192)",
        //           cursoropacitymax: 1,
        //           cursorwidth: 5,
        //           cursorborder: "none",
        //           cursorborderradius: "4px",
        //           background: "#6a6a6a",
        //           autohidemode: false
        //       });
        //   } else {
        //       $('#todayStatistic').css('width', '100%');
        //   }
          $('#todayStatistic').css('width', '100%');
         var todayChart = echarts.init(document.getElementById('todayStatistic'));
        var name = [],
            value = [];
        $.each(data, function(i, item) {
            name.push(item.name);
            value.push(item.value);
        });
        var option = {
            grid: {
                left: 0,
                bottom: 0,
                right: 0,
                top: 60,
                containLabel: true
            },
            dataZoom: [
                {
                    type: 'inside',
                    // startValue: 0,
                    // endValue: 10,
                    minValueSpan: 10,
                    maxValueSpan: 10,
                    // minSpan: 10,
                    // maxSpan: 10,
                    // bottom: '0%',
                    // height: '5%',
                    // backgroundColor: '#6a6a6a',
                    // fillerColor: 'rgb(114,142,192)',
                    // textStyle: {
                    //     color: 'transparent'
                    // },
                    zoomLock:false,
                    zoomOnMouseWheel:true,
                    moveOnMouseMove:false, 
                }
            ],
            xAxis: {
                axisLabel: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                },
                axisLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: name
            },
            yAxis: {
                name: '次',
                nameLocation: 'end',
                nameTextStyle: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                    padding: [0, 0, 0, 16]
                },
                nameGap: 20,
                type: 'value',
                axisLabel: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                },
                axisLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },

            },
            series: [{
                type: 'line',
                data: value,
                symbol: 'circle',
                symbolSize: 9,
                color: '#0280e4',
                smooth: false,
                areaStyle: {
                    normal: {
                        color: {
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: "#0280e4" // 0% 处的颜色
                            }, {
                                offset: 0.9,
                                color: "#1a2842" // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        }
                    }
                }
            }]
        };
        todayChart.setOption(option);
    });
    
//    $.ajax({
//        url: 'https://fe.epoint.com.cn/mock/223/gl/todayChart',
//        type: 'POST'
//    }).done(function(data) {});


   /* $(window).load(function() {
        $(".todayStatistic").niceScroll({
            touchbehavior: false,
            cursorcolor: "rgb(114,142,192)",
            cursoropacitymax: 1,
            cursorwidth: 5,
            cursorborder: "none",
            cursorborderradius: "4px",
            background: "#6a6a6a",
            autohidemode: false
        });
    });*/
})(this, this.jQuery);


(function() {
    var panelChart = echarts.init(document.getElementById('modelPanel'));

    var option = {
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            radius: '60',
            center: ['50%', '97%'],
            axisLine: {
                lineStyle: {
                    width: 3,
                    color: [
                        [1, 'rgb(252, 217, 61)'],
                        [1, 'transparent']
                    ],
                }
            },
            axisTick: { show: false },
            axisLabel: { show: false, },
            splitLine: { show: false },
            pointer: {
                show: false,
            },
            itemStyle: {
                color: '#fff'
            },
            detail: {
                show: false,
                color: '#fff'
            }
        }]
    };
    panelChart.setOption(option);
})(this, this.jQuery);


(function() {
    var modelChart = echarts.init(document.getElementById('modelLine'));
    
    epoint.execute('getModelChart','','',function(data){
        var name = [],
            value = [];
        $.each(data, function(i, item) {
            name.push(item.name);
            value.push(item.value);
        });

        var option = {
            grid: {
                left: 0,
                bottom: 0,
                right: 0,
                top: 42,
                containLabel: true
            },
            xAxis: {
                axisLabel: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                },
                axisLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: name
            },
            yAxis: {
                name: '个',
                nameLocation: 'end',
                nameTextStyle: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                    padding: [0, 0, 0, 16]
                },
                nameGap: 14,
                type: 'value',
                axisLabel: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                },
                axisLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },

            },
            series: [{
                    type: 'line',
                    data: value,
                    symbol: 'circle',
                    symbolSize: 12,
                    color: '#fcd93d',
                    smooth: true,
                    areaStyle: {
                        normal: {
                            color: {
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: "#46483f" // 0% 处的颜色
                                }, {
                                    offset: 0.9,
                                    color: "#1a2842" // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    lineStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: '#fcd93d'
                            }, {
                                offset: 1,
                                color: '#17233e'
                            }]
                        },
                        width: 3
                    },
                    itemStyle: {    
                        normal: {        
                            label: {
                                show: true,
                                fontSize: 11,
                                formatter: function(param) {            
                                    var currentValue = new String();            
                                    currentValue = param.value;            
                                    if (currentValue == data.max) {
                                        currentValue = 'MAX';
                                    } else if (currentValue == data.min) {
                                        currentValue = 'MIN';
                                    } else {
                                        currentValue = '';
                                    }        
                                    return currentValue;    
                                }
                            },
                            color: function(param) {    
                                if (param.value == data.max) {
                                    return '#fcd93d';
                                } else if (param.value == data.min) {
                                    return 'abb2bf';
                                } else {
                                    return 'transparent';
                                }
                            },


                        }

                    },

                },

            ]
        };
        modelChart.setOption(option);
    });
    
//    $.ajax({
//        url: 'https://fe.epoint.com.cn/mock/223/gl/modelChart',
//        type: 'POST'
//    }).done(function(data) {});
})(this, this.jQuery);


(function() {
    var importChart = echarts.init(document.getElementById('importBar'));
    epoint.execute('getImportInfo','','',function(data){

        var name = [],file=[],
            table = [],bigger=[];
        $.each(data, function(i, item) {
            name.push(item.name);
            file.push(item.file);
            table.push(item.table);
            bigger.push(item.bigger);
        });

        var option = {
            grid: {
                left: 0,
                bottom: 0,
                right: 0,
                top: 34,
                containLabel: true
            },
            legend: {
                data: ['导入文件', '导入数据库'],
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 12,
                right: 0,
                textStyle: {
                    fontFamily: 'SourceHanSansCN-Regular',
                    fontSize: 15,
                    color: '#96a6b9'
                }
            },
            xAxis: {
                axisLabel: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                },
                axisLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },
                axisTick: {
                    show: false
                },
                type: 'category',
                data: name
            },
            yAxis: {
                name: '次',
                nameLocation: 'end',
                nameTextStyle: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                    padding: [0, 0, 0, 16]
                },
                nameGap: 10,
                type: 'value',
                axisLabel: {
                    color: '#96a6b9',
                    fontFamily: 'SourceHanSansCN-Light',
                    fontSize: 15,
                },
                axisLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#545d75'
                    }
                },

            },
            series: [{
                    name: '导入文件',
                    type: 'bar',
                    z: -10,
                    data: file,
                    color: '#4c92fb',
                },
                {
                    name: '导入数据库',
                    type: 'bar',
                    z: -10,
                    data: table,
                    color: '#1ebe7c',
                },
                {
                    type: "pictorialBar",
                    itemStyle: {
                        color: "#1c2640"
                    },
                    symbolRepeat: "fixed",
                    symbolMargin: 5,
                    symbol: 'rect',
                    symbolClip: true,
                    symbolSize: ["100%", 4],
                    data:bigger
                }
            ]
        };
        importChart.setOption(option);
    });
//    $.ajax({
//        url: 'https://fe.epoint.com.cn/mock/223/gl/importChart',
//        type: 'POST'
//    }).done(function(data) {});

})(this, this.jQuery);

(function() {
    function echartsResize() {
        var echartsResizeTimer = null;
        $(window).on("resize", function() {
            // 获取所有echarts容器的jQuery对象
            var $echarts = $("[_echarts_instance_]");
            if (echartsResizeTimer) clearTimeout(echartsResizeTimer);
            echartsResizeTimer = setTimeout(function() {
                $.each($echarts, function(i, e) {
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
    $('.section-outer').niceScroll({
        cursorcolor: "#5971a4",
        cursorborder: "none",
        cursorwidth: 6,
        autohidemode: true
    });
})(this, this.jQuery);
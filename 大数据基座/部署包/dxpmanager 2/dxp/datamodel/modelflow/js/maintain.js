(function(win, $) {
    var dispatchChart = echarts.init(document.getElementById("dispatch")),
        totalChart = echarts.init(document.getElementById("total"));

    //初始化图表
    function initChart() {
        var chartOption = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: {
                        backgroundColor: "#6a7985"
                    }
                }
            },
            title: {
                text: "调度情况",
                textStyle: {
                    color: "#333333",
                    fontSize: 15,
                    fontWeight: "normal"
                },
                top: 15,
                left: 15
            },
            legend: {
                data: ["成功", "失败"],
                top: 15,
                right: 16,
                icon: "rect",
                itemWidth: 14,
                itemHeight: 6,
                itemGap: 20,
                textStyle: {
                    color: "#858585"
                }
            },
            grid: {
                left: 20,
                right: 20,
                top: "22%",
                bottom: "5%",
                containLabel: true
            },
            xAxis: [
                {
                    type: "category",
                    boundaryGap: false,
                    data: "",
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#abadab",
                            fontSize: 12
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: "",
                    nameTextStyle: {
                        fontSize: 12,
                        color: "#858585",
                        padding: [0, 0, 0, -25]
                    },
                    type: "value",
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#abadab",
                            fontSize: 12
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed",
                            color: "#eee"
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    type: "line",
                    name: "成功",
                    smooth: true,
                    symbol: "none",
                    itemStyle: {
                        color: "#50b956",
                        borderColor: "#50b956",
                        borderWidth: 2
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "rgba(80, 185, 86, .3)"
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(80, 185, 86, 0)"
                                        // color: '#3fbbff0d'
                                    }
                                ],
                                false
                            )
                        }
                    },
                    data: []
                },
                {
                    type: "line",
                    name: "失败",
                    smooth: true,
                    symbol: "none",
                    itemStyle: {
                        color: "#eb6950",
                        borderColor: "#eb6950",
                        borderWidth: 2
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "rgba(234, 100, 74,.3)"
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(234, 100, 74,0)"
                                        // color: '#3fbbff0d'
                                    }
                                ],
                                false
                            )
                        }
                    },
                    data: []
                }
            ]
        };
        dispatchChart.setOption(chartOption);
        chartOption = {
            tooltip: {
                trigger: "item"
            },
            legend: {
                orient: "vertical",
                x: "center",
                bottom: 10,
                icon: "rect",
                itemWidth: 14,
                itemHeight: 6,
                data: []
            },
            series: [
                {
                    type: "pie",
                    color: ["#38b03f", "#ea644a"],
                    radius: ["40%", "60%"],
                    center: ["50%", "40%"],
                    avoidLabelOverlap: false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: []
                }
            ]
        };
        totalChart.setOption(chartOption);
    }

    initChart();

    // 渲染概况
    function renderDispatch(data) {
        dispatchChart.setOption({
            xAxis: {
                data: Util.getArrayData(data, "name")
            },
            series: [
                {
                    data: Util.getArrayData(data, "success")
                },
                {
                    data: Util.getArrayData(data, "fail")
                }
            ]
        });
    }

    function renderTotal(data) {
        var sumData = Util.getSum(data,'value');
        totalChart.setOption({
            legend: {
                formatter: function(e) {
                    var res = '';
                    $.each(data, function(i,item) {
                        if(item.name == e){
                            res = '{a|'+e+'}{b|'+item.value+'}{c|'+(item.value/sumData*100).toFixed(2)+'%}'
                        }
                    });
                    return res;
                },
                textStyle: {
                    fontSize: 12,
                    color: "#858585",
                    rich: {
                        a: {
                            width: 35
                        },
                        b: {
                            width: 100,
                        },
                        
                    }
                },
                data: Util.getArrayData(data, "name")
            },
            series: {
                label:{
                    normal:{
                        formatter:function(){
                            return '总数\n{a|'+sumData+'}';
                        },
                        position: "center",
                        textStyle:{
                            color:'#333333',
                            fontSize:14,
                            rich:{
                                a:{
                                    color:'#333333',
                                    fontSize:14,
                                    padding:[0,0,6,0] 
                                }
                            }
                        }
                    }
                },
                data: data
            }
        });
    }

    //获取数据
    function getData() {
        $.ajax({
            type: "post",
            url: getChartsData,
            data: "",
            dataType: "json",
            success: function(data) {
                Util.hidePageLoading(); // 隐藏pageloading
                data = data.custom;
                console.log(data);
                $('#totalNum').html(data.totalNum);
                $('#totalFlow').html(data.totalFlow);
                renderDispatch(data.dispatchData);
                renderTotal(data.totalData);
            }
        });
    }
    getData();
})(this, jQuery);

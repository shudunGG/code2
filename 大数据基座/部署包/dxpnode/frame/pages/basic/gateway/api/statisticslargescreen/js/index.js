/*
 * 广西自治区数字一体化智能运维平台
 * date: 2019-04-15
 * author : 程姣姣
 */

(function ($) {

    var $processCount = $('#processCount'),
        $warningScroll = $('#warningScroll'),
        $warningList = $('#warningList'),
        warningTemp = $('#warning-temp').html();
    // 流程相关
    var $addStorage = $('#add-storage'),
        $addWarning = $('#add-warning'),
        $storageUnit = $('#storageUnit'),
        $warningUnit = $('#warningUnit'),
        $processCollect = $('#processCollect'),
        $processStorage = $('#processStorage'),
        $processWarningVal = $('#processWarningVal'),
        $logCollect = $('#logCollect'),
        // 上次日志入库数
        lastLogStorageCount = 0,
        // 上次预警报警数
        lastWarningVal = 0;

    // 调用情况
    var $callTotal = $('#callTotal'),
        $callUnit = $('#callUnit');

    // 调用流量
    var $maxRequest = $('#maxRequest'),
        $requestUnit = $('#requestUnit'),
        $maxResponse = $('#maxResponse'),
        $responseUnit = $('#responseUnit');
    
    // 定义配置及图表变量
    var chartOption, callTrend, callHistory, flowrateTrend, responseFlowrate, responseTrend, responseTime;

    function initChart() {
        // 趋势折线图
        chartOption = {
            color: ['#2ab28a', '#2ab28a'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#1d96e8'
                    }
                }
            },
            legend: {
                icon: 'rect',
                itemWidth: 10,
                itemHeight: 3,
                itemGap: 0,
                right: '0%',
                top: 0,
                textStyle: {
                    color: '#fff',
                    fontSize: 11
                },
            },
            grid: {
                top: '18%',
                left: '4%',
                right: '8%',
                bottom: '14%',
                containLabel: true
            },
            dataZoom: [{
                show: true,
                start: 50,
                end: 100,
                bottom: 8,
                height: 9,
                backgroundColor: '#000a44',
                borderColor: 'transparent',
                fillerColor: '#4486EB',
                handleStyle: {
                    color: '#000a44'
                },
                textStyle: {
                    color: 'transparent'
                }
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#4E7ECE'
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                        color: '#02B1EC'
                    }
                },
                data: []
            },
            yAxis: {
                type: 'value',
                name: '次',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#42C7FF'
                },
                nameGap: 5,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                        color: '#42C7FF'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#4E7ECE'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#2a2b76'
                    }
                }
            },
            series: [{
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2
                },
                data: []
            }, {
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2,
                    type: 'dashed'
                },
                data: []
            }]
        };
        callTrend = echarts.init(document.getElementById("callTrend"));
        callTrend.setOption(chartOption);
        chartOption.yAxis.name = 'B';
        flowrateTrend = echarts.init(document.getElementById("flowrateTrend"));
        flowrateTrend.setOption(chartOption);
        chartOption.yAxis.name = 'sec';
        responseTrend = echarts.init(document.getElementById("responseTrend"));
        responseTrend.setOption(chartOption);


        chartOption = {
            color: ['#2ab28a'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        type: 'dashed',
                        color: '#1d96e8'
                    }
                }
            },
            legend: {
                itemWidth: 18,
                itemHeight: 6,
                itemGap: 18,
                right: '7%',
                top: 0,
                textStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                data: ['调用历史']
            },
            grid: {
                top: '13%',
                left: '2%',
                right: '8%',
                bottom: '13%',
                containLabel: true
            },
            dataZoom: [{
                show: true,
                start: 50,
                end: 100,
                bottom: 6,
                height: 9,
                backgroundColor: '#000a44',
                borderColor: 'transparent',
                fillerColor: '#4486EB',
                handleStyle: {
                    color: '#000a44'
                },
                textStyle: {
                    color: 'transparent'
                }
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                nameTextStyle: {
                    padding: [25, 0, 0, -5],
                    fontSize: 14,
                    color: '#02B1EC'
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#5a7ad4'
                    }
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 13,
                        color: '#02B1EC'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#2a2b76'
                    }
                },
                data: []
            },
            yAxis: {
                type: 'value',
                name: '次',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#42C7FF'
                },
                nameGap: 5,
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 13,
                        color: '#42C7FF'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#5a7ad4'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#2a2b76'
                    }
                }
            },
            series: [{
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(42,178,138, 0.7)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(42,178,138, 0)'
                            }
                        ], false)
                    }
                },
                data: []
            }]
        };
        callHistory = echarts.init(document.getElementById("callHistory"));
        callHistory.setOption(chartOption);
        chartOption.yAxis.name = 'bps';
        responseFlowrate = echarts.init(document.getElementById("responseFlowrate"));
        responseFlowrate.setOption(chartOption);
        chartOption.yAxis.name = 'sec';
        responseTime = echarts.init(document.getElementById("responseTime"));
        responseTime.setOption(chartOption);

    }
    // 处初始化所有图表
    initChart();


    // 请求总数据
    Util.getData({
        module: 'total'
    }, function (data) {
        Util.renderNum('total', data, true);
    });

    // 请求定时刷新时间
    Util.getData({
        module: 'time'
    }, function (data) {
        Config.moduleRefresh.process = data.time;
        getProcess();
    });

    // 万条单位换算
    function thousand(data, $dom, $unit) {
        if (data > 10000) {
            $unit.html('万条');
            data = (data / 10000).toFixed(0);
        } else {
            $unit.html('条');
        }
        $dom.text(data);
    }
    
    // 请求流程图数据
    function getProcess(){
	    Util.getData({
	        module: 'process'
	    }, function (data) {
	    	
	    	if (data.collect > 0) {
                $logCollect.addClass('collect');
                $processCollect.text(data.collect);
            }
            setTimeout(function () {
                $logCollect.removeClass('collect');
                $processCollect.text(0);
            }, 5000);
            thousand(data.storage, $processStorage, $storageUnit);
            thousand(data.warningVal, $processWarningVal, $warningUnit);
	        
	        // 渲染日志入库增量
	        // 比较上次日志入库数，是否有变化
	        // var addLogCount = data.storage - lastLogStorageCount;
            var addLogCount = data.collect;
	        $addStorage.text('+' + addLogCount);
	        lastLogStorageCount = data.storage;
	        
	        if (addLogCount === 0) {
                $addStorage.css('opacity', 0);
            } else {
                $addStorage.css('opacity', 1);
            }
	        
	        setTimeout(function() { 
	        	$addStorage.css('opacity', 0);
	        }, 5000);
	        
	        // 渲染报警数增量
	        // 比较上次报警数，是否有变化
	        var addWarningCount = data.warningVal - lastWarningVal;
	        $addWarning.text('+' + addWarningCount);
	        lastWarningVal = data.warningVal;
	        
	        if (addWarningCount === 0) {
                $addWarning.css('opacity', 0);
            } else {
                $addWarning.css('opacity', 1);
            }

	        setTimeout(function() { 
	        	$addWarning.css('opacity', 0);
	        }, 5000);
	        
	        $processCount.removeClass('start');
	        if (data.warning) {
	            $processCount.addClass('isWarning');
	            var ulWid = ((260 * data.warningList.length) / 100).toFixed(2) + 'rem';
	            $warningList.css('width', ulWid);
	            $warningList.empty().append(Mustache.render(warningTemp, {
	                data: data.warningList
	            })); // 渲染
	            // 滚动
	            if (!$warningScroll.isScroll) {
	                $warningScroll.isScroll = true;
	                $warningScroll.scrollbox({
	                    direction: 'h'
	                });
	            }
	        } else {
	            $processCount.removeClass('isWarning');
	            $warningList.empty();
	        }
	        setTimeout(function () {
	            $processCount.addClass('start');
	        }, 50);
	
	    });
    }
    
    // 折线图次、万次单位换算
    function lineUnit(data) {
        var max = Util.getMax(data, 'value'),
            unit = '次';
        if (max > 10000) {
            $.each(data, function (i, e) {
                e.value = (e.value / 10000).toFixed(4);
            });
            unit = '万次';
        }
        var dataJson = {
            data: data,
            unit: unit
        };
        return dataJson;
    }

    // 请求API调用情况
    Util.getData({
        module: 'callSituation'
    }, function (data) {
        var rate = data.rate,
            gaugeRot = (180 * (rate / 100) - 180).toFixed(2);
        data.success = rate;
        
        $('#gaugeRot').css('transform', 'rotate(' + gaugeRot + 'deg)');
        $('.pointer').css('transform', 'rotate(' + 180 * (rate / 100) + 'deg)');

        thousand(data.total, $callTotal, $callUnit);
        Util.renderNum('call', data, false);

        var trendJsonData = lineUnit(data.trend)
        var trendData = trendJsonData.data,
        	trendUnit = trendJsonData.unit,
            curData = [],
            predictData = [];

        // 记录前一个数据是否是历史数据
        // 如果前一个是历史数据，当前数据是预测数据，则将历史数据结尾存为该预测数据，以保持数据线段的连续性
        var lastDataIsHistory = false;
        $.each(trendData, function (i, e) {
            if (e.isTrendData) {
                predictData.push(e);
                if (lastDataIsHistory) {
                	curData.push(e);
                } else {
                	curData.push('');
                }
                lastDataIsHistory = false;
            } else {
            	curData.push(e);
            	predictData.push('');
            	lastDataIsHistory = true;
            }
        });
        

        // 调用趋势
        callTrend.setOption({
            tooltip: {
                formatter: function (param) {
                	var idx = param[0].dataIndex;
                    var isTrendData = trendData[idx].isTrendData;
                    var name = trendData[idx].name;
                    var value = trendData[idx].value;
                        tip = '';
                    if (isTrendData) {
                        tip = name + '<br/>预测：' + value;
                    } else {
                        tip = name + '<br/>调用：' + value;
                    }
                    return tip;
                }
            },
            xAxis: {
                data: Util.getValArr(trendData, 'name')
            },
            yAxis: {
                name: trendUnit
            },
            series: [{
                data: Util.getValArr(curData, 'value')
            }, {
                data: Util.getValArr(predictData, 'value')
            }]
        });
        
        var callHistoryJsonData = lineUnit(data.history);
        // 调用历史
        callHistory.setOption({
            xAxis: {
                data: Util.getValArr(callHistoryJsonData.data, 'name')
            },
            yAxis: {
                name: callHistoryJsonData.unit
            },
            series: [{
                name: '调用历史',
                data: Util.getValArr(callHistoryJsonData.data, 'value')
            }]
        });

    });

    // b->Kb->Mb->Gb换算
    function maxUnit(data, $dom, $unit) {
        if (data > 128 && data < 131072) {
            $unit.html('Kb');
            data = (data / 128).toFixed(2);
        } else if (data > 131072 && data < 134217728) {
            $unit.html('Mb');
            data = (data / 131072).toFixed(2);
        } else if (data > 134217728) {
            $unit.html('Gb');
            data = (data / 134217728).toFixed(2);
        } else {
        	data = (data * 8).toFixed(2);
            $unit.html('b');
        }
        $dom.text(data);
    }
    
    // 请求API调用流量
    Util.getData({
        module: 'callFlowrate'
    }, function (data) {
    	
    	maxUnit(data.request, $maxRequest, $requestUnit);
        maxUnit(data.response, $maxResponse, $responseUnit);
        // 流量趋势单位换算
        var trendData = data.trend,
            trendRequestMax = Util.getMax(trendData, 'request'),
            trendResponseMax = Util.getMax(trendData, 'response'),
            trendMax = trendRequestMax,
            trendUnit = 'b',
            trendScale = 1;
        if (trendResponseMax > trendRequestMax) {
            trendMax = trendResponseMax;
        }
        
        if (trendMax > 128 && trendMax < 131072) {
            trendUnit = 'Kb';
            trendScale = 128;
        } else if (trendMax > 131072 && trendMax < 134217728) {
            trendUnit = 'Mb';
            trendScale = 131072;
        } else if (trendMax > 134217728) {
            trendUnit = 'Gb';
            trendScale = 134217728;
        } else {
            trendUnit = 'b';
            trendScale = 0.125;
        }
        $.each(trendData, function (i, e) {
            e.request = (e.request / trendScale).toFixed(2);
            e.response = (e.response / trendScale).toFixed(2);
        });
        
        Util.renderNum('max', data, false);


        var curData = [],
            predictData = [];

        // 记录前一个数据是否是历史数据
        // 如果前一个是历史数据，当前数据是预测数据，则将历史数据结尾存为该预测数据，以保持数据线段的连续性
        var lastDataIsHistory = false;
        $.each(trendData, function (i, e) {
            if (e.isTrendData) {
                predictData.push(e);
                if (lastDataIsHistory) {
                	curData.push(e);
                } else {
                	curData.push('');
                }
                lastDataIsHistory = false;
            } else {
            	curData.push(e);
            	predictData.push('');
            	lastDataIsHistory = true;
            }
        });

        // 响应时间趋势
        flowrateTrend.setOption({
            color: ['#e1ff1b', '#e1ff1b', '#1489f6', '#1489f6'],
            legend: {
                data: ['请求总流量', '响应总流量']
            },
            tooltip: {
                formatter: function (param) {
                    var idx = param[0].dataIndex;
                    var isTrendData = trendData[idx].isTrendData;
                    var tip = '';
                    if (isTrendData) {
                        tip = trendData[idx].name + '<br/>请求总流量预测：' + trendData[idx].request + '<br/>响应总流量预测：' + trendData[idx].response;
                    } else {
                    	tip = trendData[idx].name + '<br/>请求总流量：' + trendData[idx].request + '<br/>响应总流量：' + trendData[idx].response;
                    }
                    return tip;
                }
            },
            xAxis: {
                data: Util.getValArr(trendData, 'name')
            },
            yAxis: {
                name: trendUnit
            },
            series: [{
                name: '请求总流量',
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                data: Util.getValArr(curData, 'request')
            }, {
                name: '请求总流量预测',
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2,
                    type: 'dashed'
                },
                data: Util.getValArr(predictData, 'request')
            }, {
                name: '响应总流量',
                type: 'line',
                symbol: 'circle',
                data: Util.getValArr(curData, 'response')
            }, {
                name: '响应总流量预测',
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2,
                    type: 'dashed'
                },
                data: Util.getValArr(predictData, 'response')
            }]
        });

        // 响应总流量单位换算
        var responseFlowrateData = data.responseFlowrate,
            flowrateRequestMax = Util.getMax(responseFlowrateData, 'request'),
            flowrateResponseMax = Util.getMax(responseFlowrateData, 'response'),
            flowrateMax = flowrateRequestMax,
            flowrateUnit = 'bps',
            flowrateScale = 1;
        if (flowrateResponseMax > flowrateRequestMax) {
            flowrateMax = flowrateResponseMax;
        }

        if (flowrateMax > 1024 && flowrateMax <= 1048576) {
            flowrateUnit = 'Kbps';
            flowrateScale = 1024;
        } else if (flowrateMax > 1048576 && flowrateMax <= 1073741824) {
            flowrateUnit = 'Mbps';
            flowrateScale = 1048576;
        } else if (flowrateMax > 1073741824) {
            flowrateUnit = 'Gbps';
            flowrateScale = 1073741824;
        } else {
            flowrateUnit = 'bps';
        }
        $.each(responseFlowrateData, function (i, e) {
            e.request = (e.request / flowrateScale).toFixed(2);
            e.response = (e.response / flowrateScale).toFixed(2);
        });
        
        // 响应总流量
        responseFlowrate.setOption({
            color: ['#e1ff15', '#1489f6'],
            legend: {
                data: ['请求流量', '响应流量']
            },
            xAxis: {
                data: Util.getValArr(data.responseFlowrate, 'name')
            },
            yAxis: {
                name: flowrateUnit
            },
            series: [{
                name: '请求流量',
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(225,255,21, 0.7)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(225,255,21, 0)'
                            }
                        ], false)
                    }
                },
                data: Util.getValArr(responseFlowrateData, 'request')
            }, {
                name: '响应流量',
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 2
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(20,137,246, 0.7)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(20,137,246, 0)'
                            }
                        ], false)
                    }
                },
                data: Util.getValArr(responseFlowrateData, 'response')
            }]
        });
    });


    // 请求API响应时间
    Util.getData({
        module: 'responseTime'
    }, function (data) {

        var trendData = data.trend,
            curData = [],
            predictData = [];

        // 记录前一个数据是否是历史数据
        // 如果前一个是历史数据，当前数据是预测数据，则将历史数据结尾存为该预测数据，以保持数据线段的连续性
        var lastDataIsHistory = false;
        $.each(trendData, function (i, e) {
            if (e.isTrendData) {
                predictData.push(e);
                if (lastDataIsHistory) {
                	curData.push(e);
                } else {
                	curData.push('');
                }
                lastDataIsHistory = false;
            } else {
            	curData.push(e);
            	predictData.push('');
            	lastDataIsHistory = true;
            }
        });

        // 响应时间趋势
        responseTrend.setOption({
            color: ['#efb441', '#efb441'],
            tooltip: {
                formatter: function (param) {
                    var idx = param[0].dataIndex;
                    var isTrendData = trendData[idx].isTrendData;
                    var tip = '';
                    if (isTrendData) {
                        tip = trendData[idx].name + '<br/>预测：' + trendData[idx].value
                    } else {
                    	tip = trendData[idx].name + '<br/>响应：' + trendData[idx].value
                    }
                    return tip;
                }
            },
            xAxis: {
                data: Util.getValArr(trendData, 'name')
            },
            series: [{
                data: Util.getValArr(curData, 'value')
            }, {
                data: Util.getValArr(predictData, 'value')
            }]
        });

        responseTime.setOption({
            color: ['#efb441'],
            legend: {
                data: ['响应时间']
            },
            xAxis: {
                data: Util.getValArr(data.responseTime, 'name')
            },
            series: [{
                name: '响应时间',
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(239,180,56, 0.7)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(239,180,56, 0)'
                            }
                        ], false)
                    }
                },
                data: Util.getValArr(data.responseTime, 'value')
            }]
        });

    });
})(jQuery);
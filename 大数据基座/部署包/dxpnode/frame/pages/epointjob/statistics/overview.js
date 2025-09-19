(function (win, $) {
    var runStatusChart = echarts.init(document.getElementById('run-status')),
        runStatusChartOptions = {
            color: ['#1dcc8b', '#ff6952', '#ffb851', '#00c1de', '#4d61db', '#d5dae5'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                show: true,
                top: '20%',
                left: '80%',
            },
            series: [{
                name: '运行状态',
                type: 'pie',
                radius: ['50%', '80%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: []
            }]
        };

    // runStatusChart.setOption(runStatusChartOptions);

    var taskCompletionChart = echarts.init(document.getElementById('task-completion')),
        taskCompletionChartOptions = {
            legend: {
                top: 0,
                data:  ['成功', '失败']
            },
            dataZoom: [{
                type: 'slider',
                height: 8,
                bottom: 20,
                start:75,
                borderColor: 'transparent',
                backgroundColor: '#e2e2e2',
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                handleSize: 20,
                handleStyle: {
                    shadowBlur: 6,
                    shadowOffsetX: 1,
                    shadowOffsetY: 2,
                    shadowColor: '#aaa'
                }
            }, {
                type: 'inside'
            }],
            tooltip: {},
            // dataset: {
            //     source: [
            //         ['status', '成功', '失败'],
            //         ['11/21/2020', 43.3, 85.8],
            //         ['11/22/2020', 83.1, 73.4],
            //         ['11/23/2020', 86.4, 65.2],
            //         ['11/24/2020', 72.4, 53.9],
            //         ['11/25/2020', 63.3, 95.8],
            //         ['11/26/2020', 83.1, 53.4],
            //         ['11/27/2020', 46.4, 35.2],
            //         ['11/28/2020', 92.4, 43.9],
            //         ['11/28/2020', 72.4, 53.9],
            //         ['11/30/2020', 63.3, 95.8],
            //         ['12/1/2020', 83.1, 53.4],
            //         ['12/2/2020', 46.4, 35.2],
            //         ['12/3/2020', 92.4, 43.9]
            //     ]
            // },
            xAxis: {
                type: 'category',
                data: ['11/21/2020', '11/22/2020', '11/23/2020', '11/24/2020', '11/25/2020', '11/26/2020', '11/27/2020']
            },
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [{
                    type: 'bar',
                    name: '成功',
                    data: [55, 66, 35, 78, 22, 96, 75]
                },
                {
                    type: 'bar',
                    name: '失败',
                    data: [85, 76, 30, 38, 72, 46, 58]
                }
            ]
        };

    // taskCompletionChart.setOption(taskCompletionChartOptions);

    var taskCountChart = echarts.init(document.getElementById('task-count')),
        taskCountChartOptions = {
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告']
            },
            xAxis: {
                type: 'category',
                data: ['11:01', '11:02', '11:03', '11:04', '11:05', '11:06', '11:07']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '邮件营销',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            },
            {
                name: '联盟广告',
                data: [320, 632, 951, 994, 490, 830, 1020],
                type: 'line'
            },
            {
                name: '视频广告',
                data: [920, 1032, 801, 1134, 490, 830, 1820],
                type: 'line'
            }]
        };

    //taskCountChart.setOption(taskCountChartOptions);

    var cpuUsageChart = echarts.init(document.getElementById('cpu-usage')),
        cpuUsageChartOptions = {
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告']
            },
            xAxis: {
                type: 'category',
                data: ['11:01', '11:02', '11:03', '11:04', '11:05', '11:06', '11:07']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '邮件营销',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            },
            {
                name: '联盟广告',
                data: [320, 632, 951, 994, 490, 830, 1020],
                type: 'line'
            },
            {
                name: '视频广告',
                data: [920, 1032, 801, 1134, 490, 830, 1820],
                type: 'line'
            }]
        };

    // cpuUsageChart.setOption(cpuUsageChartOptions);

    var memoryUsageChart = echarts.init(document.getElementById('memory-usage')),
        memoryUsageChartOptions = {
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告']
            },
            xAxis: {
                type: 'category',
                data: ['11:01', '11:02', '11:03', '11:04', '11:05', '11:06', '11:07']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: '邮件营销',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            },
            {
                name: '联盟广告',
                data: [320, 632, 951, 994, 490, 830, 1020],
                type: 'line'
            },
            {
                name: '视频广告',
                data: [920, 1032, 801, 1134, 490, 830, 1820],
                type: 'line'
            }]
        };

    // memoryUsageChart.setOption(memoryUsageChartOptions);


    var chartsConfig = {
        taskCompletion: {
            chart: taskCompletionChart,
            options: taskCompletionChartOptions
        },
        
        taskCount: {
            chart: taskCountChart,
            options: taskCountChartOptions
        },
        
        cpuUsage: {
            chart: cpuUsageChart,
            options: cpuUsageChartOptions
        },
        
        memoryUsage: {
            chart: memoryUsageChart,
            options: memoryUsageChartOptions
        }
    };
    var $focusList = $('#focus-list');

    var initData = function() {
        Util.ajax({
            url: win.initDataUrl
        }).done(function(data){
            if(!data) {
                return;
            }
            $focusList.find('.focus-item.fail > .focus-item-num').text(data.fail);
            $focusList.find('.focus-item.slow > .focus-item-num').text(data.slow);
            $focusList.find('.focus-item.wait > .focus-item-num').text(data.running);
            $focusList.find('.focus-item.isolated > .focus-item-num').text(data.dag);
            $focusList.find('.focus-item.stop > .focus-item-num').text(data.executor);
            $focusList.find('.focus-item.overdue > .focus-item-num').text(data.job);
        
            runStatusChartOptions.series[0].data = data.runStatus;
            runStatusChart.setOption(runStatusChartOptions);

            var taskCompletionData = dealTaskCompletionData(data.taskCompletion);

            taskCompletionChartOptions.xAxis.data = taskCompletionData.date;
            taskCompletionChartOptions.series[0].data = taskCompletionData.success;
            taskCompletionChartOptions.series[1].data = taskCompletionData.fail;

            taskCompletionChart.setOption(taskCompletionChartOptions);

            // var taskCountData = dealLineChartData(data.taskCount);
            // $.extend(taskCountChartOptions, taskCountData);
            // taskCountChart.setOption(taskCountChartOptions);

            // var cpuUsageData = dealLineChartData(data.cpuUsage);
            // $.extend(cpuUsageChartOptions, cpuUsageData);
            // cpuUsageChart.setOption(cpuUsageChartOptions);

            // var memoryUsageData = dealLineChartData(data.memoryUsage);
            // $.extend(memoryUsageChartOptions, memoryUsageData);
            // memoryUsageChart.setOption(memoryUsageChartOptions);

            var groupListData = [];
            groupListData.push({"text":"所有","id":"all"});
            if(data.groupList){
            	$.each(data.groupList, function(k,v){
            		groupListData.push({"text":v,"id":v});
            	});
            }
            mini.get("groupNameList").load(groupListData);
            console.log(mini.get("groupNameList"));
            refreshLineChartData('taskCount', data.taskCount);
            refreshLineChartData('cpuUsage', data.cpuUsage);
            refreshLineChartData('memoryUsage', data.memoryUsage);
        });
    };

    var dealTaskCompletionData = function(data) {
        var date = [],
            successData = [],
            failData = [];
    
        for(var i = 0, l = data.length; i < l; i++) {
            date.push(data[i].date);
            successData.push(data[i].success);
            failData.push(data[i].fail);
        }

        return {
            date: date,
            success: successData,
            fail: failData
        };
    };
    var dealLineChartData = function(data) {
        var name = [],
            time = [],
            value = [],
            series = [],
            item,
            i = 0,
            l = data.length,
            j, k;
        
        for(; i < l; i++) {
            name.push(data[i].name);
            item = data[i].data;
            value = [];
            for(j = 0, k = item.length; j < k; j++) {
                if(i === 0) {
                    time.push(item[j].time);
                }
                value.push(item[j].value);
            }
            series.push({
                name: data[i].name,
                data: value,
                type: 'line'
            });
        }

        return {
            legend: {
                data: name
            },
            tooltip: {},
            xAxis: {
                data: time
            },
            series: series
        };
    };

    initData();

    win.refreshLineChartData = function(key, data) {
        var chart = chartsConfig[key].chart,
            options = chartsConfig[key].options,
            newData = dealLineChartData(data);
        
        if(chart) {
            chart.setOption($.extend(options, newData), true);
        }
        

    };
})(this, jQuery);
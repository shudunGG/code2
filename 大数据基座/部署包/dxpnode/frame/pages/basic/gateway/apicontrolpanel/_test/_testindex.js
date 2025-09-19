

Mock.mock(Util.getRightUrl(getVisitCount), {
    controls: [],
    custom: {
    	overview: {
    		serviceTotal: '@integer(0,10)',
    		appTotal: '@integer(10,100)',
    		ipTotal: '@integer(100,1000)'
    	},
    	top5: {
    		'call|3': [
                {name: '@cword(4)', value: '@integer(0,100)'}
            ],
    		'response|3': [
                {name: '@cword(4)', value: '@integer(0,100)'}
            ],
    		'error|3': [
                {name: '@cword(4)', value: '@integer(0,100)'}
            ]
    	},
    	// 调用情况
        visitCount: {
        	total: '@integer(0,100)',
        	errorRate: '@float(0,100,2,2)',
        	'chartData|10': [
        		// name: 时间   value1: 调用次数   value2： 错误次数
        		{name: '@date(HH:mm)', value1: '@integer(0,1500)', value2: '@integer(0,1500)'}
        	]
        },
        // 数据流量
        flowCount: {
        	max: '@integer(0,100)',
        	min: '@integer(0,100)',
        	'chartData|10': [
        		// name: 时间   value1: 上行流量   value2： 下行流量
        		{name: '@date(HH:mm)', value1: '@integer(0,1500)', value2: '@integer(0,1500)'}
        	]
        },
        // 响应时间
        responseCount: {
        	max: '@integer(0,100)',
        	min: '@integer(0,100)',
        	'chartData|10': [
        		// name: 时间   value1: 响应时间   value2： 平均值
        		{name: '@date(HH:mm)', value1: '@integer(0,1500)', value2: '@integer(0,1500)'}
        	]
        }
    },
    status: {
        code: 1,
        text: "",
        url: ""
    }
});


Mock.mock(Util.getRightUrl(getDefaultTime), {
    controls: [],
    custom: {
        "defaultInfo": {
            days: '@integer(5,60)',
            currentTime: '@now'
        }
    },
    status: {
        code: 1,
        text: "",
        url: ""
    }
});

/**
 * 获取监控详请统计参数
 */
Mock.mock(Util.getRightUrl(getMonitorObjects), {
    controls: [],
    custom: {
        "monitorObjects|5": [{ // 监控事项（图例）
            id: '@word()',
            name: '@cword(4,6)'
        }],
        /**
         *  统计项（图表参数）
         * index: 图表名称
         * duration：周期
         * method：聚合方式
         * methods：聚合方式下拉选项
        */
        "monitorIndexs": [  
            {"index": 'code2XX', text: "code2XX", unit: '个', "duration": '60s', "method": 'Value'},
            {"index": 'code3XX', text: "code3XX", unit: '个', "duration": '60s', "method": 'Value'},
            {"index": 'code4XX', text: "code4XX", unit: '个', "duration": '60s', "method": 'Value'},
            {"index": 'flowin', text: "流入宽带", unit: '个', "duration": '60s', "method": "Default", "methods": [
                {id: 'Default', text: 'Default'},
                {id: 'Average', text: 'Average'},
                {id: 'Sum', text: 'Sum'},
                {id: 'Max', text: 'Max'},
                {id: 'Min', text: 'Min'},
            ]},
            {"index": 'flowout', text: "流出宽带", unit: '个', "duration": '60s', "method": "Default", "methods": [
                {id: 'Default', text: 'Default'},
                {id: 'Average', text: 'Average'},
                {id: 'Sum', text: 'Sum'},
                {id: 'Max', text: 'Max'},
                {id: 'Min', text: 'Min'},
            ]},
            {"index": 'responsetime', text: "响应时间", unit: '个', "duration": '60s', "method": "Default", "methods": [
                {id: 'Default', text: 'Default'},
                {id: 'Average', text: 'Average'},
                {id: 'Sum', text: 'Sum'},
                {id: 'Max', text: 'Max'},
                {id: 'Min', text: 'Min'},
            ]}
        ]
    },
    status: {
        code: 1,
        text: "",
        url: ""
    }
});


/**
 * 获取监控详请
 * 传入参数：
 *      'startTime': 开始时间,
        'endTime': 结束时间,
        'objects': 统计对象（激活状态的图例，以','连接的字符串）,
        'index': 图表名称,
        'method': 图表聚合方式
    返回参数chartData：
        [{
            time: x轴时间
            object: 名为objects的项，值为对应项的值
        }]
 */
Mock.mock(Util.getRightUrl(getMonitorChart), function(option) {
    var conditons = option.body.split('&')[2].slice(8).split('%2C');
    var chartData = [];
    for (var i = 0; i < 60; i++) {
        chartData.push({
            time: Mock.mock('@time(HH:mm)')
        });
        for (var j = 0, len = conditons.length; j < len; j++) {
            chartData[i][conditons[j]] = Mock.mock('@integer(0, 100)');
        }
    }
    return {
        controls: [],
        custom: {
            chartData: chartData
        },
        status: {
            code: 1,
            text: "",
            url: ""
        }
    }
});
// 广西自治区数字一体化智能运维平台页面模拟数据

var pageInterface = Config.pageInterface;

var rand = Util.randNum;

function mock(url, dataFn) {
    $.mockjax({
        url: url, // 此处的url和js中ajax请求的url一致
        status: 200,
        responseTime: 800, // 响应时间，可通过配置此项来模拟网络不稳定的情况
        contentType: "application/json",
        response: function (setting) {
            this.responseText = dataFn(setting);
        }
    });
}

// 总数据
mock(pageInterface.total, function (setting) {
    return {
        custom: {
            visit: rand(1000000), // 访问服务总数
            access: rand(100000) // 接入应用总数
        }
    };
});

//获取定时请求时间
mock(pageInterface.time, function (setting) {
 return {
     custom: {
         time: 3000 // 毫秒
     }
 };
});

// 流程图数据
mock(pageInterface.process, function (setting) {
    return {
        custom: {
            collect: rand(1000), // 日志采集
            storage: 17.1, // 日志入库
            warning: rand(2) === 0 ? true : false, // 是否预警
            warningVal: 12.11, // 预警警报 
            // API预警情况
            warningList: [{
                time: '11::23', // 发送时间
                reason: '这里是预警原因这里是预警原因这里是预警原因这里是预警...', // 预警原因
                result: '这里是产生后果这里是产生后果这里是...', // 产生后果
                way: '这里是处理方式这里是处理方式这里是...' // 处理方式
            }, {
                time: '11::23', // 发送时间
                reason: '这里是预警原因这里是预警原因这里是预警原因这里是预警...', // 预警原因
                result: '这里是产生后果这里是产生后果这里是...', // 产生后果
                way: '这里是处理方式这里是处理方式这里是...' // 处理方式
            }, {
                time: '11::23', // 发送时间
                reason: '这里是预警原因这里是预警原因这里是预警原因这里是预警...', // 预警原因
                result: '这里是产生后果这里是产生后果这里是...', // 产生后果
                way: '这里是处理方式这里是处理方式这里是...' // 处理方式
            }]
        }
    };
});

// API调用情况
mock(pageInterface.callSituation, function (setting) {
    return {
        custom: {
            rate: rand(100), // 89%去掉百分号
            total: rand(1000000000), // API累计调用次数
            success: rand(100), // 成功率
            // 调用趋势（后三天为预测数据）
            trend: [{
                name: '4/10',
                value: rand(150)
            }, {
                name: '4/11',
                value: rand(150)
            }, {
                name: '4/12',
                value: rand(150)
            }, {
                name: '4/13',
                value: rand(150)
            }, {
                name: '4/14',
                value: rand(150)
            }, {
                name: '4/15',
                value: rand(150)
            }, {
                name: '4/16',
                value: rand(150)
            }, {
                name: '4/17',
                value: rand(150)
            }, {
                name: '4/18',
                value: rand(150)
            }, {
                name: '4/19',
                value: rand(150)
            }],
            // 调用历史
            history: [{
                name: 0,
                value: rand(300)
            }, {
                name: 5,
                value: rand(300)
            }, {
                name: 10,
                value: rand(300)
            }, {
                name: 15,
                value: rand(300)
            }, {
                name: 20,
                value: rand(300)
            }, {
                name: 25,
                value: rand(300)
            }, {
                name: 30,
                value: rand(300)
            }, {
                name: 35,
                value: rand(300)
            }, {
                name: 40,
                value: rand(300)
            }, {
                name: 45,
                value: rand(300)
            }, {
                name: 50,
                value: rand(300)
            }, {
                name: 55,
                value: rand(300)
            }, {
                name: 60,
                value: rand(300)
            }]
        }
    };
});

// API调用流量
mock(pageInterface.callFlowrate, function (setting) {
    return {
        custom: {
            request: rand(10000), // APL MAX请求流量
            response: rand(10000), // APL MAX响应流量
            // 流量趋势
            trend: [{
                name: '4/10',
                request: rand(150), // 请求平均流量
                response: rand(150) // 响应总流量
            }, {
                name: '4/11',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/12',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/13',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/14',
                request: rand(150), // 请求平均流量
                response: rand(150) // 响应总流量
            }, {
                name: '4/15',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/16',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/17',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/18',
                request: rand(150),
                response: rand(150)
            }, {
                name: '4/19',
                request: rand(150),
                response: rand(150)
            }],
            // 响应总流量
            responseFlowrate: [{
                name: 0,
                request: rand(300), // 请求平均流量
                response: rand(300) // 响应总流量
            }, {
                name: 5,
                request: rand(300),
                response: rand(300)
            }, {
                name: 10,
                request: rand(300),
                response: rand(300)
            }, {
                name: 15,
                request: rand(300),
                response: rand(300)
            }, {
                name: 20,
                request: rand(300),
                response: rand(300)
            }, {
                name: 25,
                request: rand(300),
                response: rand(300)
            }, {
                name: 30,
                request: rand(300),
                response: rand(300)
            }, {
                name: 35,
                request: rand(300),
                response: rand(300)
            }, {
                name: 40,
                request: rand(300),
                response: rand(300)
            }, {
                name: 45,
                request: rand(300),
                response: rand(300)
            }, {
                name: 50,
                request: rand(300),
                response: rand(300)
            }, {
                name: 55,
                request: rand(300),
                response: rand(300)
            }, {
                name: 60,
                request: rand(300),
                response: rand(300)
            }]
        }
    };
});

// API响应时间
mock(pageInterface.responseTime, function (setting) {
    return {
        custom: {
            // 响应时间趋势
            trend: [{
                name: '4/10',
                value: rand(150)
            }, {
                name: '4/11',
                value: rand(150)
            }, {
                name: '4/12',
                value: rand(150)
            }, {
                name: '4/13',
                value: rand(150)
            }, {
                name: '4/14',
                value: rand(150)
            }, {
                name: '4/15',
                value: rand(150)
            }, {
                name: '4/16',
                value: rand(150)
            }, {
                name: '4/17',
                value: rand(150)
            }, {
                name: '4/18',
                value: rand(150)
            }, {
                name: '4/19',
                value: rand(150)
            }],
            // 平均响应时间
            responseTime: [{
                name: 0,
                value: rand(300)
            }, {
                name: 5,
                value: rand(300)
            }, {
                name: 10,
                value: rand(300)
            }, {
                name: 15,
                value: rand(300)
            }, {
                name: 20,
                value: rand(300)
            }, {
                name: 25,
                value: rand(300)
            }, {
                name: 30,
                value: rand(300)
            }, {
                name: 35,
                value: rand(300)
            }, {
                name: 40,
                value: rand(300)
            }, {
                name: 45,
                value: rand(300)
            }, {
                name: 50,
                value: rand(300)
            }, {
                name: 55,
                value: rand(300)
            }, {
                name: 60,
                value: rand(300)
            }]
        }
    };
});
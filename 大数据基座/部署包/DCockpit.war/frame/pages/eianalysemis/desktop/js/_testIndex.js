/**!
 * [新点智能应用分析平台]
 * date:2018-09-29
 * author: [xlb];
 */

$.mockjax({
    url: "mockUrl",
    status: 200,
    responseTime: 200, // 响应时间，可通过配置此项来模拟网络不稳定的情况
    contentType: "application/json",
    response: function() {
        this.responseText = {
            // api数据
            apiData: [
                { date: '2018/09/12', value: 300 },
                { date: '2018/09/13', value: 400 },
                { date: '2018/09/14', value: 345 },
                { date: '2018/09/15', value: 343 },
                { date: '2018/09/16', value: 321 },
                { date: '2018/09/17', value: 278 },
                { date: '2018/09/18', value: 283 },
                { date: '2018/09/19', value: 291 },
                { date: '2018/09/20', value: 276 },
                { date: '2018/09/21', value: 226 }
            ],
            // 使用率数据
            usageData:[
              {name:"CPU使用率",value:40},
              {name:"内存使用率",value:26},
              {name:"磁盘使用率",value:85}
            ]
        }
    }
});
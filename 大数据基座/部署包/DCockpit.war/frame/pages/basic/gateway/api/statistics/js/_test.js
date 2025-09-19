/**!
 *测试数据
 * date:2017-03-23
 * author: [chengang];
 */
$.mockjax({
    url: settings.loaddata,
    status: 200,
    responseTime: 100,
    contentType: "application/json",
    response: function(settings) {
        var now = new Date();
        this.responseText = {
            controls: [],
            custom: {
                mapdata: [      //咨询投诉区域分布
                    { name: "宿城区", value: 8218 },
                    { name: "宿豫区", value: 2588 },
                    { name: "沭阳县", value: 9811 },
                    { name: "泗洪县", value: 2487 },
                    { name: "泗阳县", value: 8724 }
                ],
                total: [        //咨询、投诉（举报）总量排名TOP10
                    { label: "食品", value: 7859 },
                    { label: "保健品", value: 7211 },
                    { label: "销售服务", value: 6584 },
                    { label: "中介服务", value: 5763 },
                    { label: "社会服务", value: 5049 },
                    { label: "化妆品", value: 4788 },
                    { label: "药品", value: 4370 },
                    { label: "家政服务", value: 3850 },
                    { label: "网购", value: 3131 },
                    { label: "售后服务", value: 2478 },
                ],
                dept: [         //部门办理咨询、投诉（举报）数量TOP10
                    { label: "食药局", value: 7859 },
                    { label: "工商局", value: 7211 },
                    { label: "物价局", value: 6584 },
                    { label: "住建局", value: 5763 },
                    { label: "公积金", value: 5049 },
                    { label: "人社局", value: 4788 },
                    { label: "环卫局", value: 4370 },
                    { label: "公安局", value: 3850 },
                    { label: "市监局", value: 3131 },
                    { label: "交通局", value: 2478 },
                ],
                increase: [     //咨询、投诉（举报）增长率排名增长率TOP10
                    { label: "TOP1", count: 2000, increase: 20 },
                    { label: "TOP2", count: 1800, increase: 18 },
                    { label: "TOP3", count: 1500, increase: 15 },
                    { label: "TOP4", count: 1400, increase: 14 },
                    { label: "TOP5", count: 1300, increase: 13 },
                    { label: "TOP6", count: 1200, increase: 12 },
                    { label: "TOP7", count: 1100, increase: 11 },
                    { label: "TOP8", count: 1000, increase: 10 },
                    { label: "TOP9", count: 900, increase: 9 },
                    { label: "TOP10", count: 800, increase: 8 },
                ],
                goods: {        //商品及服务类型TOP5的消费投诉变化趋势
                    months: ["2016年1月", "2016年3月", "2016年5月", "2016年7月", "2016年9月", "2016年11月"],
                    details: [
                        {
                            label: "日用百货",
                            data: [200, 231, 156, 215, 132, 156]
                        }, {
                            label: "家用电器",
                            data: [356, 156, 423, 134, 354, 231]
                        }, {
                            label: "房屋",
                            data: [213, 123, 432, 234, 342, 168]
                        }, {
                            label: "互联网服务",
                            data: [532, 234, 123, 432, 322, 498]
                        }, {
                            label: "电信服务",
                            data: [124, 342, 212, 434, 161, 161]
                        }, {
                            label: "居民服务",
                            data: [342, 123, 124, 342, 212, 434]
                        }
                    ]
                },
                consume: [      //消费人群分布
                    { name: "宿城区", value: 8218 },
                    { name: "宿豫区", value: 2588 },
                    { name: "沭阳县", value: 9811 },
                    { name: "泗洪县", value: 2487 },
                    { name: "泗阳县", value: 8724 }]
            },
            status: {
                code: 200,
                text: "",
                url: ""
            }
        }
    }
})

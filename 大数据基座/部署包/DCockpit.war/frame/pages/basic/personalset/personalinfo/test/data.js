Mock.setup({
    timeout: '20-600'
});

function getDataFromBody(opt) {
    if (!opt) return {};
    opt = decodeURIComponent(opt);
    var arr = opt.split('&');
    var o = {};
    arr.forEach(function (item) {
        var it = item.split('=');
        try {
            o[it[0]] = JSON.parse(it[1]);
        } catch (err) {
            o[it[0]] = it[1];
        }
    });

    return o;
}

// 流程代理
try {

Mock.mock(Util.getRightUrl(flowAgencyCfg.getDataUrl), function (opt) {
    console.log('============================');
    console.log('流程代理信息获取');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    console.log(params);

    var data = Mock.mock({
        'list|3-6': [{
            id: '@id',
            username: '@cname',
            'type|1': ['time', 'case'],
            caseName: '@cword(10,90)', // 单据名称
            startDate: '@date', // 开始时间
            endDate: '@date', // 结束时间
            portrait: './images/user-demo@integer(1,2).png',

        }]
    }).list;
    console.log(JSON.stringify(data, 0, 2));
    return data;
});
    
} catch (error) {
    
}

try {

Mock.mock(Util.getRightUrl(myOpinion.getUrl), function (opt) {
    console.log('============================');
    console.log('我的意见获取');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    console.log(params);

    var data = Mock.mock({
        'list|3-6': [{
            id: '@id',
            sort:"@increment",
            text: '@cword(5,20)',
        }]
    }).list;
    console.log(JSON.stringify(data, 0, 2));
    return data;
});
    
} catch (error) {
    
}
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
var color = function () {
    var i = 0,
        s = '';
    do {
        s += (Math.random() * 16 >> 0).toString(16)
    } while (++i < 6)
    return s;
};

// 配置模拟
Mock.mock(new RegExp('abcdedf'), function (opt) {
    var params = getDataFromBody(decodeURIComponent(opt.body));
    console.log(params);
    var data = Mock.mock({
        status: {
            code: 200
        },
        controls: [],
        'custom': {
            'imgList|99': ['https://dummyimage.com/20x20/' + color() + '&text=@integer(1,99)']
        }
    });
    console.log(data);
    return data;
});


// 展示模拟
if (window.getTodoDataUrl) {
    Mock.mock(new RegExp(Util.getRightUrl(getTodoDataUrl)), function (opt) {
        var params = getDataFromBody(decodeURIComponent(opt.body));
        console.log(params);
        var data = Mock.mock({
            contentColor: "@color", // 内容背景色
            linkOpenType: 'dialog', // 链接打开方式
            // 代办列表
            "itemList|3-8": [{
                id: '@id',
                title: '@cword(3,8)',
                content: '@csentence(10,90)',
                url: '../../portalNew/management/test/test1.html',
                date: '@date(MM-dd)'
            }]
        });
        console.log(data);
        return data;
    });
}

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

// 获取主栏目
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.getSubColumns)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return {
        columns: [
            {
                id: "11",
                name: "子栏目咦", // 名称
                url: "columnlist" // 值
            },
            {
                id: "22",
                name: "子栏目二", // 名称
                url: "columnlist" // 值
            },
            {
                id: "33",
                name: "子栏目三", // 名称
                url: "columnlist" // 值
            }

        ]
    }
});

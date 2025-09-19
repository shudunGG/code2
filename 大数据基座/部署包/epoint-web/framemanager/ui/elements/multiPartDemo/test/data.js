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

Mock.mock(new RegExp(Util.getRightUrl(getElementDataUrl)), function (opt) {
    console.log(getDataFromBody(opt.body));
    var multiPartData = Mock.mock({
        contentColor: '@color',
        linkOpenType: 'dialog',
        partList: [{
                type: 'text',
                name: '文本列表',
                'list|3-8': [{
                    id: '@id',
                    title: '@cword(3,8)',
                    content: '@csentence(10,90)',
                    url: '../../portalNew/management/test/test1.html',
                    date: '@date(MM-dd)'
                }]
            },
            {
                type: 'imgAndText',
                name: '图文列表',
                // 首条应为包含图片的，在模拟完成后再加入
                'list|3-8': [{
                    id: '@id',
                    title: '@cword(3,8)',
                    content: '@csentence(10,90)',
                    url: '../../portalNew/management/test/test1.html',
                    date: '@date(MM-dd)'
                }]
            },
            {
                type: 'imgs',
                name: '图片列表',
                'list|3-6': [{
                    id: '@id',
                    title: '@cword(3,8)',
                    img: '@image(400x240)',
                    content: '@csentence(10,90)',
                    url: '../../portalNew/management/test/test1.html',
                    date: '@date(MM-dd)'
                }]
            }
        ]
    });
    // 针对图文混合的插入带图片的内容
    multiPartData.partList[1].list.unshift(
        Mock.mock({
            id: '@id',
            title: '@cword(3,8)',
            img: '@image(80x80)',
            content: '@csentence(81,180)',
            url: '../../portalNew/management/test/test1.html',
            date: '@date(MM-dd)'
        })
    );
    // 随机变成单一栏目
    // if(Math.random() > 0.7) {
    //     multiPartData.partList.length = 1;
    // }

    // multiPartData.partList = [multiPartData.partList[2]];
    multiPartData.partList.unshift(multiPartData.partList[2]);
    console.log(multiPartData);
    return multiPartData;
});
Mock.mock(Util.getRightUrl(getUnerectedAppsUrl), function (opt) {
    console.log('获取所有未安装应用', window.decodeURIComponent(opt.body).split('&'));

    return Mock.mock({
        "list|3-5": [{
            "name": "@cword(3,5)", // 分类名称
            "apps|5-20": [{
                "id": "@id", // 应用id
                "icon": "../images/app/@integer(1,20).png", // 应用图标
                "name": "@cword(3,5)" // 应用名称
            }]
        }]
    }).list;
    // return []
});
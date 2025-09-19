// 模拟用户信息
Mock.mock(Util.getRightUrl(userInfoUrl), {
    // USER
    "name": "@cname", // 用户名
    "guid": "@id", // 用户唯一id
    "portrait": "", // 用户头像图片地址

    // 部门
    "ouName|1": ["财务部", "系统管理部", "人事部", "研发部", "销售部"], // 部门名称

    // 主界面相关
    // "title": "网页标题", // 网页标题
    // "logo": "@image", // 主界面logo图片地址

    // 我的首页 考虑可配置多个 使用数组形式
    // "homes|1-5": [{
    //     "name": "我的首页",
    //     "url": "./test/home.html"
    // }],
    // 全文检索地址
    // "fullSearchUrl": "http://fdoc.epoint.com.cn/onlinedoc/KlFront/fullsearch.html",

    // 是否有兼职
    "hasParttime": "@boolean(1,2,true)"
});
// 界面 信息
Mock.mock(Util.getRightUrl(pageInfoUrl), function (opt) {
    console.log('界面信息',window.decodeURIComponent(opt.body).split('&'));
    var data = Mock.mock({
        "title": "网页标题", // 网页标题
        "logo": "@image", // 主界面logo图片地址

        // 门户配置 考虑可配置多个 使用数组形式
        "homes|1-5": [{
            "id": "home-1",
            "name": "我的首页",
            "url": "./test/home.html"
        }],
        "defaultHome": "home-1", // 菜单类主题默认激活的home
        "defaultUrl": "./test/home.html", // 首页地址

        // 全文检索地址
        "fullSearchUrl": "http://fdoc.epoint.com.cn/onlinedoc/KlFront/fullsearch.html" // 全文检索地址，若无则不会在主界面上显示全文检索
    });
    data.homes.forEach(function (home, i) {
        home.id = 'home-' + (i + 1);
    });
    data.defaultHome = 'home-1';
    console.log('界面信息', data);
    return data;
});

// 消息数目
Mock.mock(Util.getRightUrl(msgCountUrl), {
    "remind": "@integer(0,99)"
});
// // 在线人数
// Mock.mock(Util.getRightUrl(onlineUserCountUrl), {
//     "count": "@integer(0,999)"
// });


// 模拟屏幕上app
var screenAppsData = Mock.mock({
    "list|3-7": [{
        "id": "@id", // 屏幕id
        "name": "@cword(3,6)", // 屏幕名称
        "icon": "modicon-@integer(1,124)", // 屏幕图标
        "apps|3-10": [{
            "id": "@id", // 应用id
            "name": "@cword(3,6)", // 应用名称
            "icon": "", // 应用图标
            "url": "./test.html", // 地址
            "index": 1, // 在当前屏幕内的索引
            "openType|1": ["blank", "tabsNav"], // 打开方式

            "count": 0, // 应用消息数目
            "needMsgRemind": "@boolean(1,2,true)", // 是否需要轮训更新消息数目

            "widthRadio": 0.5, // 应用打开时宽度比例
            "heightRadio": 0.5 //          高度比例
        }]
    }]
});



// 模拟toolbarApps
// Mock.mock(Util.getRightUrl(toolbarAppsUrl), function () {
//     return Mock.mock({
//         "list|1-7": [{
//             "name": "@cword(3,5)",
//             "icon": "./images/app/app@integer(1,3).png",
//             "url": "http://www.baidu.com",
//             "isBlank|9-1": false,
//             "id": "@id",
//             "count": "@integer(0,35)"
//         }]
//     }).list;
// });

// 当前屏幕内位置移动
Mock.mock(Util.getRightUrl(updateAppPosUrl), function (opt) {
    console.log('当前屏幕内位置移动', window.decodeURIComponent(opt.body).split('&'));
    return '{}';
});
// 移动到其他屏幕
Mock.mock(Util.getRightUrl(appToScreenUrl), function (opt) {
    console.log('移动到其他屏幕', window.decodeURIComponent(opt.body).split('&'));
    return '{}';
});

// 模拟安装应用
Mock.mock(Util.getRightUrl(installAppUrl), function (opt) {
    console.log('安装应用', window.decodeURIComponent(opt.body).split('&'));
    return {
        "id": +new Date() + 'new-app',
        "name": "新增应用",
        "icon": "data:image/png;base64,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",
        "url": "./test/test.html",
        "openType": "tabsNav",
        "count": 3,
        "msgCountUrl": "./test/appmsgcount.json",
        "widthRadio": 0.5,
        "heightRadio": 0.5
    };
});

// 屏幕数据
JSON.stringify(Mock.mock({
    "list|6": [{
        "id": "@id", // 屏幕id
        "name": "@cword(3,6)", // 屏幕名称
        "icon": "modicon-@integer(1,124)", // 屏幕图标
        "apps|3-10": [{
            "id": "@id", // 应用id
            "name": "@cword(3,6)", // 应用名称
            "icon": "./images/app/@integer(1,36).png", // 应用图标
            "url": "./test.html", // 地址
            "openType|1": ["blank", "tabsNav", "tabsNav", "tabsNav", "tabsNav", "tabsNav", "tabsNav", "tabsNav", "tabsNav"], // 打开方式

            "count": 0, // 应用消息数目
            "needMsgRemind": "@boolean(1,2,true)", // 是否需要轮训更新消息数目

            "widthRatio": "@float(0,0,1,2)", // 应用打开时宽度比例
            "heightRatio": "@float(0,0,1,2)" //          高度比例
        }]
    }]
}).list, 0, 4);
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
        "logo": "@image(370x30)", // 主界面logo图片地址

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
// 模拟用户信息
Mock.mock(Util.getRightUrl(userInfoUrl), {
    "userGuid": "@id",
    "userName": "@cname",
    "ouName|1": ["系统管理部", "人事部", "财务部", "研发部"]
});

// 消息数目
Mock.mock(Util.getRightUrl(msgCountUrl), {
    "count": "@integer(0,99)"
});
// 在线人数
Mock.mock(Util.getRightUrl(onlineUserCountUrl), {
    "count": "@integer(0,999)"
});


// 模拟屏幕上app
var screenAppsData = Mock.mock({
    "screenList|10": [{
        "appsList|0-5": [{
            "id": "@id",
            "name": "@cword(2,6)",
            "icon": "./images/app/app@integer(1,3).png",
            "url": "http://www.baidu.com",
            "isBlank|9-1": false,
            "count": "@integer(0,35)",
            "movable|8-2": true,
            "uninstallable|1-9": true,
            "openable|3-1": true,
            "hasTaskbarIcon|1-6": false,
            "hasToolbarIcon|1-6": false
        }]
    }]
});

function getScreenData(data) {
    var screenData = [],
        screenList = data.screenList,
        appsList = [];

    for (var i = 0, l1 = screenList.length; i < l1; i++) {
        appsList = screenList[i].appsList;
        screenData.push(appsList);
    }

    return screenData;
}

Mock.mock(Util.getRightUrl(screenAppsUrl), getScreenData(screenAppsData));

// 模拟toolbarApps
Mock.mock(Util.getRightUrl(toolbarAppsUrl), function() {
    return Mock.mock({
        "list|1-7": [{
            "name": "@cword(3,5)",
            "icon": "./images/app/app@integer(1,3).png",
            "url": "http://www.baidu.com",
            "isBlank|9-1": false,
            "id": "@id",
            "count": "@integer(0,35)"
        }]
    }).list;
});

// 模拟更新应用
Mock.mock(Util.getRightUrl(updateAppUrl), {
    "name": "新装应用",
    "icon": "images/app/app3.png",
    "url": "http://www.baidu.com",
    "isBlank|9-1": false,
    "id": "@id",
    "count": "@integer(0,35)"
});



// 模拟元件
Mock.mock(Util.getRightUrl(elementsUrl), function() {
    return Mock.mock({
        "list|0-5": [{
            "id": "@id",
            "name": "@cword(3,6)",
            "width": 0,
            "height": 0,
            "top": 0,
            "left": 0,
            "page": "@integer(0,9)",
            "url": "./test/elements.json",
            "cfgUrl": "null",
            "closable|9-1": true,
            "noBorder|1-1": true
        }]
    }).list;
});
// 模拟更新元件
Mock.mock(Util.getRightUrl(updateElemUrl), function() {
    return Mock.mock({
        "list|0-5": [{
            "id": "@id",
            "name": "新增元件@increment",
            "width": 0,
            "height": 0,
            "top": 0,
            "left": 0,
            "page": "@integer(0,9)",
            "url": "./test/newElem.json",
            "cfgUrl": "null",
            "closable|9-1": true,
            "noBorder|1-1": true
        }]
    }).list;
});

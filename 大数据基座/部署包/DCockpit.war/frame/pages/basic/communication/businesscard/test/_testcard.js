Mock.setup({
    timeout: '300-500'
});
// datagrid
Mock.mock(Util.getRightUrl(getInnerCardList), {
    "controls": [],
    "custom": {
        "data|20": [{
            "guid": "@guid",
            "userguid": "@guid",
            "displayname": "张三",
            "state": "在岗",
            "ouname": "交互设计部",
            "title": "部门经理",
            "usermobile": "18851335299",
            "telephoneoffice": "0512-58133333",
            "shortmobile": "5888",
            "carNum": "苏EX8888",
            "gender": "1"
        }]
    },
    "status": {
        "code": 200,
        "text": "还未登录",
        "url": "/pages/login.html"
    }
});

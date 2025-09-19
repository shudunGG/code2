Mock.setup({
    timeout: '300-500'
});
// datagrid
Mock.mock(Util.getRightUrl(getInAddressUrl), {
    "controls": [{
        "id": "datagrid",
        "total": 34,
        "data|20": [{
            "guid": "主键",
            "userguid": "88888",
            "displayname": "张三",
            "state": "在岗",
            "ouname": "交互设计部",
            "title": "部门经理",
            "usermobile": "18851335299",
            "telephoneoffice": "0512-58133333",
            "shortmobile": "5888"
        }]
    }],
    "custom": {},
    "status": {
        "code": 200,
        "text": "还未登录",
        "url": "/pages/login.html"
    }
});

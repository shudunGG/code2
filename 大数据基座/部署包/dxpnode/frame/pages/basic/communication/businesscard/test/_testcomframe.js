Mock.setup({
    timeout: '500-600'
});

// 组织
Mock.mock(Util.getRightUrl(getOrgDataUrl), {
    "controls": [{
        "id": "org-tree",
        "type": "tree-non-nested",
        "action": "getData",
        "data": [{
            "id": "base",
            "text": "新点软件",
            "checked": "true"
        }, {
            "id": "json",
            "text": "JSON",
            "pid": "base"
        }, {
            "id": "date",
            "text": "Date",
            "pid": "base",
            "checked": "true"
        }, {
            "id": "forms",
            "text": "Forms",
            "pid": "base",
            "isLeaf": "false"
        }, {
            "id": "button",
            "text": "Button",
            "pid": "forms"
        }, {
            "id": "layouts",
            "text": "Layouts"
        }, {
            "id": "panel",
            "text": "Panel",
            "pid": "layouts"
        }, {
            "id": "splitter",
            "text": "Splitter",
            "pid": "layouts"
        }, {
            "id": "other",
            "text": "Other",
            "isLeaf": "false"
        }, {
            "id": "tools",
            "text": "tools",
            "pid": "other"
        }]
    }],
    "custom": {
        "mydeptid": "1000",
        "view": "1" // 增加视图模式配置,1表格视图，2卡片视图
    },
    "status": {
        "code": 200,
        "text": "还未登录",
        "url": "/pages/login.html"
    }
});

// 内部群组
Mock.mock(Util.getRightUrl(getGroupDataUrl), {
    "controls": [],
    "custom": {
        "allId": "10000",
        "items": [{
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }, {
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }, {
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }, {
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }]
    },
    "status": {
        "code": 200,
        "text": "还未登录",
        "url": "/pages/login.html"
    }
});

// 外部联系人
Mock.mock(Util.getRightUrl(getOuterAddressUrl), {
    "controls": [],
    "custom": {
        "allId": "20000",
        "items": [{
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }, {
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }, {
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }, {
            "id": "12",
            "name": "分组名称",
            "amount": 15
        }]
    },
    "status": {
        "code": 200,
        "text": "还未登录",
        "url": "/pages/login.html"
    }
});

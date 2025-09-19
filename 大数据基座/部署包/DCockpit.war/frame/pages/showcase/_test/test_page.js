Util.mock(Config.ajaxUrls.loaddata, {
    custom: {
        userInfo: {
            username: "@cname",
            department: "@cword(6,8)"
        },
        baseInfo: {
            name: "@cname",
            className: "red",
            avatar: "images/icon.png",
            address: "张家港",
            "word|1": [1, 2],
            "number|100000-1000000": 1
        },
        "number|1000-10000": 1,
        "list|10": [
            {
                name: "@cname",
                "age|18-40": 1,
                "state|1": [0, 1, 2],
                note: "@cword(6,8)"
            }
        ]
    },
    status: {
        code: 1,
        text: "请求成功"
    }
});

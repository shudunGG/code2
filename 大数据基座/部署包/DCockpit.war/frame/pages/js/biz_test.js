Mock.mock(Config.ajaxUrls.isLogin, {
    status: {
        code: 1,
        text: "请求成功"
    },
    custom: {
        "isLogin|1": true,
        userName: "@cname",
        userId: "@guid"
    }
});

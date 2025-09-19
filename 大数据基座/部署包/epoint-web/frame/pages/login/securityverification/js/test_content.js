Mock.mock(getCode, function (options) {
    var data = Mock.mock({
        code: '7634'
    })

    return {
        'controls': [],
        'custom': data,
        'status': {
            'code': 200,
            'text': '',
            'url': ''
        }
    };
});

Mock.mock(login, function (options) {
    var data = Mock.mock({
        text: '验证成功！'
    })

    return {
        'controls': [],
        'custom': data,
        'status': {
            'code': 200,
            'text': '',
            'url': ''
        }
    };
});
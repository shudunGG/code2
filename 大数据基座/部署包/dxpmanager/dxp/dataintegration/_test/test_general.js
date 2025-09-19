Mock.mock(mission, function (options) {
    var data = Mock.mock({
        storage: {
            name: '库表集成',
            total: 1000,
            value: 675
        },
        file: {
            name: '文件集成',
            total: 1000,
            value: 325
        }
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

Mock.mock(trend, function (options) {
    var data = Mock.mock({
        'storage|7-24': [{
            'id': 1,
            'name': '@integer(1,30)',
            'value': '@integer(100,500)'
        }],
        'file|7-24': [{
            'id': 2,
            'name': '@integer(1,30)',
            'value': '@integer(100,500)'
        }]
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
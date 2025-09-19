Mock.mock(situtaion, function (options) {
    var data = Mock.mock({
        list: [{
            name: '3',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '5',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '7',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '9',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '11',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '13',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '15',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '17',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '19',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '21',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '23',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }, {
            name: '25',
            fail: '@integer(50,100)',
            success: '@integer(200,500)'
        }],
        'line|5': [{
            url: '@url()',
            name: '任务名称任务名称任务名称任务名称',
            count: '@integer(2000,3000)',
            percent: '@integer(10,65)' + '%'
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
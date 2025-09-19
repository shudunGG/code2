'use strict';

// 总览
Mock.mock(/getStattotal/, function() {
    var data = Mock.mock({
        proj: '@integer(1000,9999)', // 专题总数
        ind: '@integer(1000,9999)', // 指标总数
        indexset: '@integer(1000,9999)' // 指标领域总数
    });
    return {
        controls: [], // minui 数据
        custom: data, // 自定义数据
        status: {
            code: 200,
            text: '',
            url: ''
        }
    };
});

// 专题访问量统计
Mock.mock(/getVolume/, function() {
    var data = Mock.mock({

        'volume|10-30': [{
            name: '@cword(3,5)',
            value: '@integer(10,99)'
        }]

    });
    return {
        controls: [], // minui 数据
        custom: data, // 自定义数据
        status: {
            code: 200,
            text: '',
            url: ''
        }
    };
});

// 热点指标TOP5-表格
Mock.mock(/getRanking/, function() {
    var data = Mock.mock({

        'ranking|5': [{
            guid: '@guid',
            name: '@cword(10, 18)', // 指标名称
            hotval: '@float(10, 99, 1, 1)' // 热度
        }]

    });
    return {
        controls: [], // minui 数据
        custom: data, // 自定义数据
        status: {
            code: 200,
            text: '',
            url: ''
        }
    };
});

// 热点指标TOP5-热度图表
Mock.mock(/getHotind/, function() {
    var data = Mock.mock({

        'hotind|12': [{
            name: '@integer(1, 12)月',
            value: '@integer(10, 99)'
        }]

    });
    return {
        controls: [], // minui 数据
        custom: data, // 自定义数据
        status: {
            code: 200,
            text: '',
            url: ''
        }
    };
});

// 对外展示情况 表格数据
Mock.mock(/initPage/, function() {
    return Mock.mock({
        controls: [{
            id: 'datagrid1',
            total: 5,
            pageIndex: 0,
            'data|5': [{
                // 'rowguid': '@guid',
                name: '@cword(3, 8)', // 部门名称
                nums: '@integer(200, 400)个', // 专题数
            }]
        },{
            id: 'datagrid2',
            total: 5,
            pageIndex: 0,
            'data|5': [{
                // 'rowguid': '@guid',
                name: '@cword(3, 8)', // 部门名称
                nums: '@integer(200, 400)个', // 专题数
            }]
        }],
        custom: {},
        status: {
            code: 200,
            text: '',
            url: ''
        }
    });
});

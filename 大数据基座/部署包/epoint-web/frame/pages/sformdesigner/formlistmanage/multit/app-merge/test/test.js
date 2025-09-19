Mock.mock(/getTables/, function () {
    var data = Mock.mock({
        'list|3': [{
            'id': '@guid',
            'name': '@ctitle()',
            'fields|3': [{
                'name': '@ctitle()',
                'type|1': ['String', 'Number']
            }]
        }]
    })
    data.list.forEach(function (item, i) {
        item.fields.forEach(function (item1) {
            item1.control = 1
        })
    });
    return {
        custom: [{
            "id": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 表id
            "name": "府象风", // 表名
            "index": "1", // 表序号
            "fields": [{ // 表字段
                "name": "数效去物他", // 字段名
                "type": "String", // 字段类型
                "control": '1' // 控件类型
            }, {
                "name": "队党少支回",
                "type": "Number",
                "control": '2'
            }, {
                "name": "便却美非",
                "type": "String",
                "control": '1'
            }]
        }, {
            "id": "6fdAcA5E-3cc8-c2f0-499b-D85bC2d3Bf8C",
            "name": "共分张下农",
            "index": "2",
            "fields": [{
                "name": "给思际千别并",
                "type": "String",
                "control": '1'
            }, {
                "name": "回料月并",
                "type": "String",
                "control": '2'
            }, {
                "name": "音先号专标近低",
                "type": "String",
                "control": '1'
            }]
        }, {
            "id": "6d6fBFeC-ff5d-cCaA-D8Fb-b7c2EbBbAc72",
            "name": "做个科劳认体酸",
            "index": "3",
            "fields": [{
                "name": "北叫什毛时转界",
                "type": "Number",
                "control": '1'
            }, {
                "name": "角眼量志具想",
                "type": "String",
                "control": '2'
            }, {
                "name": "何系业教头",
                "type": "String",
                "control": '1'
            }]
        }]
    }
})

// 获取已合并字段，格式参照智能合并
Mock.mock(/getMerge/,function() {
    return {
        custom: [
            {
                "type": "String", // 合并字段的类型
                "control": "1", // 合并字段的控件类型
                "shareCName":"姓名",
                "shareName":"name",
                "fields": [
                    {
                        "index": "1", // 表序号,
                        "name": "数效去物他", // 字段名
                        "chartId": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 表id
                        "fieldname": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 字段英文名
                        "formguid": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 表单guid
                        "control": "1",
                    },
                    {
                        "index": "2", // 表序号,
                        "name": "给思际千别并", // 字段名
                        "chartId": "6fdAcA5E-3cc8-c2f0-499b-D85bC2d3Bf8C", // 表id
                        "control": "1",
                    }
                ]
            },
            {
                "type": "Number",
                "control": "2",
                "fields": [
                    {
                        "index": "1", // 表序号,
                        "name": "队党少支回", // 字段名
                        "chartId": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 表id
                        "control": "2",
                    }
                ]
            }
        ]
    }
})

// 传递字段chartData为初始化的表字段数据
Mock.mock(/autoMerge/, function (opt) {
    console.log(opt.body);
    return {
        custom: [
            {
                "type": "String", // 合并字段的类型
                "control": "1", // 合并字段的控件类型
                "fields": [
                    {
                        "index": "1", // 表序号,
                        "name": "数效去物他", // 字段名
                        "chartId": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 表id
                        "control": '1', // 控件类型
                    },
                    {
                        "index": "2", // 表序号,
                        "name": "给思际千别并", // 字段名
                        "chartId": "6fdAcA5E-3cc8-c2f0-499b-D85bC2d3Bf8C", // 表id
                        "control": '1',
                    }
                ]
            },
            {
                "type": "Number",
                "control": "2",
                "fields": [
                    {
                        "index": "1", // 表序号,
                        "name": "队党少支回", // 字段名
                        "chartId": "8Becf9fD-959B-3DE4-86c8-58bF3D418315", // 表id
                        "control": '2',
                    }
                ]
            }
        ]
    }
})

Mock.mock(/saveMergeData/, function (opt) {
    console.log(opt.body);
    return {
        custom: {}
    }
})
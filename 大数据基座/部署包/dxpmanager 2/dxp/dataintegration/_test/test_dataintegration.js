function getParams(str) {
    var arr = str.split('&'),
        params = {};
    arr.forEach(function(item) {
        params[item.split('=')[0]] = item.split('=')[1];
    })
    return params;
}
// 获取表数据
Mock.mock(/getTableData/,function(options) {
    return {
        'controls': [],
        'custom': {
            sourceList: [ // 来源表
                {
                    primaryKey: true, // 是否为主键
                    field: 'id', // 字段名
                    dataType: 'VARCHAR', // 字段类型
                    linkField: 'name', // 关联字段名称
                },
                {
                    primaryKey: false,
                    field: 'name',
                    dataType: 'VARCHAR',
                },
                {
                    primaryKey: false,
                    field: 'num',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num1',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num2',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num3',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num4',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num5',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num6',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num7',
                    dataType: 'INTENGER',
                },
                {
                    primaryKey: false,
                    field: 'num8',
                    dataType: 'INTENGER',
                },
            ],
            targetList: [ // 目标表
                {
                    field: 'id',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'name',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'num',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num1',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num2',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num3',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num4',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num5',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num6',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num7',
                    dataType: 'INTENGER',
                },
                {
                    field: 'num8',
                    dataType: 'INTENGER',
                },
            ],
            sourceRemoveList:[ // 来源表移除
                {
                    field: 'field1',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field2',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field3',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field4',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field5',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field6',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field7',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field8',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field9',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field10',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field11',
                    dataType: 'VARCHAR',
                },
            ],
            targetRemoveList: [ // 目标表移除
                {
                    field: 'field1',
                    dataType: 'VARCHAR',
                },
                {
                    field: 'field2',
                    dataType: 'VARCHAR',
                },
            ]
        },
        'status': {
            'code': 200,
            'text': '',
            'url': ''
        }
    };
});
// 获取字段类型数据
Mock.mock(/dataTypeList/,function(options){
    return {
        'controls': [],
        'custom': [
            {
                name: 'VARCHAR',
            },
            {
                name: 'INTENGER',
            },
        ],
        'status': {
            'code': 200,
            'text': '',
            'url': ''
        }
    };
})


Mock.mock(Util.getRightUrl('test/searchRole'),  {
    "list": [
        {
            "title": "@cname()", //名称
            "isChecked": false, // 是否选中
            "id": '1'   // id
        },
        {
            "title": "@cname()",
            "isChecked": false,
            "id": '2'
        },
        {
            "title": "@cname()",
            "isChecked": false,
            "id": '3'
        },
        {
            "title": "@cname()",
            "isChecked": false,
            "id": '4'
        }
    ]
});

Mock.mock(Util.getRightUrl('test/roleList'), {
    "roleStatus": false,    // 公开状态是否开启
    "isSingle": false,   //是否是特殊情况
    "list": [
        {
            "title": "@cname()", //名称
            "isChecked": false, // 是否选中
            "id": "123", // id
            "children": [ // 子集
                {
                    "title": "@cname()",
                    "isChecked": true,
                    "id": '1'
                },
                {
                    "title": "@cname()",
                    "isChecked": true,
                    "id": '2'
                },
                {
                    "title": "@cname()",
                    "isChecked": true,
                    "id": '3'
                },
                {
                    "title": "@cname()",
                    "isChecked": false,
                    "id": '4'
                }
                /* {
                    "title": "@cname()",
                    "isChecked|1": [true, false],
                    "id": '@increment(1)'
                } */
            ]
        },
        {
            "title": "@cname()", //名称
            "isChecked": false, // 是否选中
            "id": "456", // id
            "children": [ // 子集
                {
                    "title": "@cname()",
                    "isChecked": false,
                    "id": '11'
                },
                {
                    "title": "@cname()",
                    "isChecked": false,
                    "id": '12'
                },
                {
                    "title": "@cname()",
                    "isChecked": false,
                    "id": '13'
                },
                {
                    "title": "@cname()",
                    "isChecked": false,
                    "id": '14'
                }
                /* {
                    "title": "@cname()",
                    "isChecked|1": [true, false],
                    "id": '@increment(1)'
                } */
            ]
        }
    ]
    
});

var cc = [
    {
        "id":'aa',
        "isChecked": false,
        "children": [
            {
                "id": 'aa-1',
                "isChecked": true
            },
            {
                "id": 'aa-2',
                "isChecked": false
            },
            {
                "id": 'aa-3',
                "isChecked": false
            }
        ]
    },
    {
        "id":'bb',
        "isChecked": false,
        "children": [
            {
                "id": 'bb-1',
                "isChecked": true
            },
            {
                "id": 'bb-2',
                "isChecked": false
            }
        ]
    },
    {
        "id":'cc',
        "isChecked": false,
        "children": [
            {
                "id": 'cc-1',
                "isChecked": true
            },
            {
                "id": 'cc-2',
                "isChecked": false
            }
        ]
    }
]

var aa = [
    {
        "id":'aa',
        "isChecked": false,
        "children": [
            {
                "id": 'aa-1',
                "isChecked": false
            },
            {
                "id": 'aa-2',
                "isChecked": false
            }
        ]
    },
    {
        "id":'bb',
        "isChecked": false,
        "children": [
            {
                "id": 'bb-1',
                "isChecked": false
            },
            {
                "id": 'bb-2',
                "isChecked": false
            }
        ]
    }
];


function getQueryStriongArgs(url){
    var qs = (url.length>0?url:""),
        args = {},
        items = qs.length ? qs.split("&"):[],
        item = null,
        name = null,
        value= null,
        i = 0,
        len = items.length;
        for(i = 0;i<len;i++){
          item = items[i].split("=");
          name = decodeURIComponent(item[0]);
          value = decodeURIComponent(item[1]);
          if(name.length){
            args[name] = value;
          }
        }
    
    return args;
}


//from 是基础库，
// to 是部门前置库

// 领域
Mock.mock(Util.getRightUrl('test/filedUrl'), function(opt) {
    var params = getQueryStriongArgs(opt.body);
    var postData = '';
    console.log(params.from);
    console.log(params.to);

    if( params.from && params.to) {
        postData = {
            from: {
                name: '法人库',
                data: [
                    { "id": "1", "text": "法人库-全领域" },
                    { "id": "2", "text": "法人库-金融" },
                    { "id": "3", "text": "法人库-微观经济" },
                    { "id": "4", "text": "法人库-宏观经济" },
                    { "id": "5", "text": "法人库-食品安全" },
                    { "id": "6", "text": "法人库-企业信息" }
                ]
            },
            to: {
                name: '公安前置库',
                data: [
                    { "id": "1", "text": "公安前置库-全领域" },
                    { "id": "2", "text": "公安前置库-金融" },
                    { "id": "3", "text": "公安前置库-微观经济" },
                    { "id": "4", "text": "公安前置库-宏观经济" },
                    { "id": "5", "text": "公安前置库-食品安全" },
                    { "id": "6", "text": "公安前置库-企业信息" }
                ]
            }
        }
    } else {
        postData = {
            name: '法人库',
            data: [
                { "id": "1", "text": "全领域" },
                { "id": "2", "text": "金融" },
                { "id": "3", "text": "微观经济" },
                { "id": "4", "text": "宏观经济" },
                { "id": "5", "text": "食品安全" },
                { "id": "6", "text": "企业信息" }
            ]
        }
    }
    return {
        custom: {
            data: postData
        }
    };
});

Mock.mock(Util.getRightUrl('test/searchData'), function(opt) {
    var data = Mock.mock({
        "custom": {
               "list|5-10":  [
                    {
                        "id": "@guid()",
                        "name": "@cname()",
                        "sum": "@integer(3,150)",
                        "children|3-12": [
                            {
                                "id": "@guid()",
                                "name|1": ["A胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜胡娜(GASGKJHSFKJGSFJKGSJKGD)",'测试测试 '],
                                "mainId": "主体id",
                            }
                        ]
                    }
                ]
            }
      });
      return data;
})


Mock.mock(Util.getRightUrl('test/chartData'), function(opt) {
    console.log(opt);
    var postData = '';
    var params = getQueryStriongArgs(opt.body);

    console.log(params.from);
    console.log(params.to);


    if(params.type == 'table') {
        postData = { 
            "class": "go.GraphLinksModel",
            "nodeDataArray": [ 
                {"isGroup":true, "key": "site-1", "text":"法人库","category":"OfGroups","site": "left" },
        
                {"isGroup":true, "key": "site-4", "text":"公安前置库", "category":"OfGroups", "site": "right"},
                {"isGroup":true, "key": "lib-1",  "text":"法人库", "group": "site-1"},
                {"isGroup":true, "key": "lib-4",  "text":"公安前置库",  "group": "site-4"},
                {"key": "lib-1-0", "text": "APPMANAGE_APPINFO", "group": "lib-1"},
                {"key": "lib-1-1", "text": "FRAME_ANTI_TAMPER", "group": "lib-1"},
                {"key": "lib-1-2", "text": "FRAME_USER", "group": "lib-1"},
                {"key": "lib-1-3", "text": "FRAME_ATTACHINFO", "group": "lib-1"},
                {"key": "lib-1-4", "text": "FRAME_EXTTABSCONFIG", "group": "lib-1"},
                {"key": "lib-1-5", "text": "FRAME_LOGIN_LOG", "group": "lib-1"},
                {"key": "lib-1-6", "text": "FRAME_ATTACHINFO", "group": "lib-1"},
                {"key": "lib-1-7", "text": "APPMANAGE_APPINFO2", "group": "lib-1"},
                {"key": "lib-1-8", "text": "APPMANAGE_APPINFO", "group": "lib-1"},
                {"key": "lib-4-1000", "text": "APPMANAGE_APPINFO", "group": "lib-4"},
                {"key": "lib-4-1001", "text": "FRAME_ANTI_TAMPER", "group": "lib-4"},
                {"key": "lib-4-1002", "text": "FRAME_USER", "group": "lib-4"},
                {"key": "lib-4-1003", "text": "FRAME_ATTACHINFO", "group": "lib-4"},
                {"key": "lib-4-1004", "text": "FRAME_EXTTABSCONFIG", "group": "lib-4"}
        ],
            "linkDataArray": [ 
                {"from": "lib-1-0", "to": "lib-4-1000", "category":"Mapping"},
                {"from": "lib-1-2", "to": "lib-4-1003", "category":"Mapping"},
                {"from": "lib-1-4", "to": "lib-4-1002", "category":"Mapping"},
                {"from": "lib-1-7", "to": "lib-4-1001", "category":"Mapping"},
                {"from": "lib-1-8", "to": "lib-4-1004", "category":"Mapping"}
        ]}
    } else if(params.type == 'database') {
        postData = { 
                "class": "go.GraphLinksModel",
                "nodeDataArray": [ 
                    { key: "lib-1", text: "法人库", base: true },
                    { key: "lib-2", text: "安监前置库" },
                    { key: "lib-3", text: "地税前置库" },
                    { key: "lib-4", text: "公安前置库" },
                    { key: "lib-5", text: "工商前置库工商前置库工商前置库" },
                    { key: "lib-6", text: "国税前置库" },
                    { key: "lib-6-1", text: "国税前置库1" },
                    { key: "lib-6-2", text: "国税前置库2" }
                ],
                "linkDataArray": [ 
                    { from: "lib-1", to: "lib-2", relative: "item_id → user" },
                    { from: "lib-1", to: "lib-3", relative: "item_id → user" },
                    { from: "lib-1", to: "lib-4", relative: "item_id → user" },
                    { from: "lib-1", to: "lib-5", relative: "item_id → user" },
                    { from: "lib-1", to: "lib-6", relative: "item_id → user" },
                    { from: "lib-6", to: "lib-6-1", relative: "item_id → user" },
                    { from: "lib-6", to: "lib-6-2", relative: "item_id → user" }
                ]
            }
    } else {
        postData = { 
            data: { 
                "class": "go.GraphLinksModel",
                "nodeDataArray": [ 
                    {"isGroup":true, "key": "site-1", "text":"数据库A","category":"OfGroups","site": "left" },
    
                    {"isGroup":true, "key": "site-4", "text":"数据库B", "category":"OfGroups", "site": "right"},
                    {"isGroup":true, "key": "lib-1",  "text":"法人库", "group": "site-1"},
                    {"isGroup":true, "key": "lib-4",  "text":"公安前置库",  "group": "site-4"},
                    {"key": "lib-1-0", "text": "APPMANAGE_APPINFO", "group": "lib-1"},
                    {"key": "lib-1-1", "text": "FRAME_ANTI_TAMPER", "group": "lib-1"},
                    {"key": "lib-1-2", "text": "FRAME_USER", "group": "lib-1"},
                    {"key": "lib-1-3", "text": "FRAME_ATTACHINFO", "group": "lib-1"},
                    {"key": "lib-1-4", "text": "FRAME_EXTTABSCONFIG", "group": "lib-1"},
                    {"key": "lib-1-5", "text": "FRAME_LOGIN_LOG", "group": "lib-1"},
                    {"key": "lib-1-6", "text": "FRAME_ATTACHINFO", "group": "lib-1"},
                    {"key": "lib-1-7", "text": "APPMANAGE_APPINFO2", "group": "lib-1"},
                    {"key": "lib-1-8", "text": "APPMANAGE_APPINFO", "group": "lib-1"},
                    {"key": "lib-4-1000", "text": "APPMANAGE_APPINFO", "group": "lib-4"},
                    {"key": "lib-4-1001", "text": "FRAME_ANTI_TAMPER", "group": "lib-4"},
                    {"key": "lib-4-1002", "text": "FRAME_USER", "group": "lib-4"},
                    {"key": "lib-4-1003", "text": "FRAME_ATTACHINFO", "group": "lib-4"},
                    {"key": "lib-4-1004", "text": "FRAME_EXTTABSCONFIG", "group": "lib-4"}
            ],
                "linkDataArray": [ 
                    {"from": "lib-1-0", "to": "lib-4-1000", "category":"Mapping"},
                    {"from": "lib-1-2", "to": "lib-4-1003", "category":"Mapping"},
                    {"from": "lib-1-4", "to": "lib-4-1002", "category":"Mapping"},
                    {"from": "lib-1-7", "to": "lib-4-1001", "category":"Mapping"},
                    {"from": "lib-1-8", "to": "lib-4-1004", "category":"Mapping"}
            ]},
            from: "法人库",
            to: "公安前置库"
        }
    }
    
  return {
        custom: {
            data: postData
        }
    };
});


/* --------------------------表--------------------------------- */

Mock.mock(Util.getRightUrl('test/fromComboUrl'), function(opt) {
    var newTable = [
        { "id": "1", "text": "法人库-表1" },
        { "id": "2", "text": "法人库-表2" },
        { "id": "3", "text": "法人库-表3" },
        { "id": "4", "text": "法人库-表4" },
        { "id": "5", "text": "法人库-表5" },
        { "id": "6", "text": "法人库-表6" }
    ];
    return {
        data: newTable,
        name: '法人库'
    };
});

Mock.mock(Util.getRightUrl('test/toComboUrl'), function(opt) {
    var newTable = [
        { "id": "1", "text": "公安前置库-表1" },
        { "id": "2", "text": "公安前置库-表2" },
        { "id": "3", "text": "公安前置库-表3" },
        { "id": "4", "text": "公安前置库-表4" },
        { "id": "5", "text": "公安前置库-表5" },
        { "id": "6", "text": "公安前置库-表6" }
    ];
    return {
        data: newTable,
        name: '公安前置库'
    };
});


Mock.mock(Util.getRightUrl('test/tableChartData'), function(opt) {
    console.log(opt);

    var data =   {"custom": {
        "data": 
            { 
                "class": "go.GraphLinksModel",
                "nodeDataArray": [ 
                    {"isGroup":true, "key": "site-1", "text":"法人库","category":"OfGroups","site": "left" },

                    {"isGroup":true, "key": "site-4", "text":"公安前置库", "category":"OfGroups", "site": "right"},
                    {"isGroup":true, "key": "lib-1",  "text":"法人库", "group": "site-1"},
                    {"isGroup":true, "key": "lib-4",  "text":"公安前置库",  "group": "site-4"},
                    {"key": "lib-1-0", "text": "APPMANAGE_APPINFO", "group": "lib-1"},
                    {"key": "lib-1-1", "text": "FRAME_ANTI_TAMPER", "group": "lib-1"},
                    {"key": "lib-1-2", "text": "FRAME_USER", "group": "lib-1"},
                    {"key": "lib-1-3", "text": "FRAME_ATTACHINFO", "group": "lib-1"},
                    {"key": "lib-1-4", "text": "FRAME_EXTTABSCONFIG", "group": "lib-1"},
                    {"key": "lib-1-5", "text": "FRAME_LOGIN_LOG", "group": "lib-1"},
                    {"key": "lib-1-6", "text": "FRAME_ATTACHINFO", "group": "lib-1"},
                    {"key": "lib-1-7", "text": "APPMANAGE_APPINFO2", "group": "lib-1"},
                    {"key": "lib-1-8", "text": "APPMANAGE_APPINFO", "group": "lib-1"},
                    {"key": "lib-4-1000", "text": "APPMANAGE_APPINFO", "group": "lib-4"},
                    {"key": "lib-4-1001", "text": "FRAME_ANTI_TAMPER", "group": "lib-4"},
                    {"key": "lib-4-1002", "text": "FRAME_USER", "group": "lib-4"},
                    {"key": "lib-4-1003", "text": "FRAME_ATTACHINFO", "group": "lib-4"},
                    {"key": "lib-4-1004", "text": "FRAME_EXTTABSCONFIG", "group": "lib-4"}
                ],
                "linkDataArray": [ 
                    {"from": "lib-1-0", "to": "lib-4-1000", "category":"Mapping"},
                    {"from": "lib-1-2", "to": "lib-4-1003", "category":"Mapping"},
                    {"from": "lib-1-4", "to": "lib-4-1002", "category":"Mapping"},
                    {"from": "lib-1-7", "to": "lib-4-1001", "category":"Mapping"},
                    {"from": "lib-1-8", "to": "lib-4-1004", "category":"Mapping"}
                ]
            }
        }
    };
  return data;
});

function getFirstData() {
    var data =   Mock.mock({
        "custom": {
            "list|2":  [
                {
                    "id": "@guid()",
                    "name": "@cname()",
                    "sum": "@integer(3,150)",
                    // "parentId": "",
                    // "subjectType": "1",
                    // "direction|1": [0, 0],
                    // "color|1": ["#f00", "#f60", "#00f", "#0f0"], 
                    // "descript|1": ["包含", "其他关联"],
                    // "levelType": "2",
                    "children|4": [
                        {
                            "id": "@guid()",
                            "name": "方式打开记得发和数据库刚好看到和   ",
                            "mainId": "上一级id",
                            "subjectType": "1",
                            "color|1": ["#f00", "#f60", "#00f", "#0f0"],
                            "nodeType": "1",
                            "icon|1": [1,2,3,4,5,6],
                            "link|1":[7,6,5,4,3,2,1],
                            "direction|1": [0, 0],
                            "descript|1": ["包含", "其他关联"]
                        }
                    ]
                }
            ],
            "marks": {
                "icons": [{
                    id: "1",
                    name: "云",
                    icon: "node-icon-1"
                },
                {
                    id: "2",
                    name: "库表",
                    icon: "node-icon-2"
                }],
                "links": [
                {
                    id: "1",
                    name: "关联",
                    icon: "link-icon-1"
                },
                {
                    id: "7",
                    name: "分析",
                    icon: "link-icon-2"
                }
                ]
            }
        }
    });
    // data.custom.list[0].name = '主题';
    // data.custom.list[1].name = '库表';
    // data.custom.list[2].name = '部门';
    // data.custom.list[3].name = '文件文件';
    // data.custom.list[4].name = '权责事项权责事项权责事项';

    return data;
}

var leftData = getFirstData();

Mock.mock(Util.getRightUrl('test/exploreData'), function(opt) {
    
    return leftData;
})


Mock.mock(Util.getRightUrl('test/initData'), function(opt) {
    var data = Mock.mock({
        "custom": {
            "data|12": [{
                id: '',
                name: "@cname()",
                value: "@integer(3,150)",
                icon: "", // 图标，没有就传个空字符串
            }],
            "total": "1234"
        }
    })
    return data;
})


Mock.mock(Util.getRightUrl('test/getDetail'), function(opt) {
    var data =   Mock.mock({
        "custom": {
            "info|3-6": [
                {
                    "title": "所属@cword(2,4)",
                    "value": "@cword(2,5)民政厅"
                }
            ]
        }
    });
    return data;
})


Mock.mock(Util.getRightUrl('test/getDetailData'), function(opt) {
    return leftData;
})



Mock.mock(Util.getRightUrl('test/getDepart'), function(opt) {
    return {
        "custom": {
            "data": [
                /* {
                    "id": "1",
                    "value": "全部1"
                }, */
                {
                    "id": "2",
                    "value": "部门2"
                },
                {
                    "id": "3",
                    "value": "主题3"
                },
                {
                    "id": "4",
                    "value": "权责事项4"
                },
                {
                    "id": "5",
                    "value": "系统5"
                }
            ]
        }
    }
})


Mock.mock(Util.getRightUrl('test/addInCart'), function(opt) {
    var data =   {
        "custom": {
            
        }
    };
    return data;
})

Mock.mock(Util.getRightUrl('test/getCartData'), function(opt) {
    var data =   {
        "custom": {
            total: 16
        }
    };
    return data;
})

Mock.mock(Util.getRightUrl('test/getAnalysis'), function(opt) {
    var data =   {
        "custom": {
            "nodeDataArray": [ 
                {
                    "key": "1",
                    "name": "数据库名称",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    // "group": item.id,
                    // "group": baseKey,
                    "base": false
                    // "info": child
                },
                {
                    "key": "2",
                    "name": "数据库名称222",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    // "group": item.id,
                    // "group": baseKey,
                    "base": false
                    // "info": child
                },
                {
                    "key": "3",
                    "name": "数据库名称333",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    // "group": item.id,
                    // "group": baseKey,
                    "base": false
                    // "info": child
                },
                {
                    "key": "4",
                    "name": "数据库名称444",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "5",
                    "name": "数据库名称5",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "6",
                    "name": "数据库名称666",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "7",
                    "name": "数据库名称777",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "8",
                    "name": "数据库名称888",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "9",
                    "name": "数据库名称999",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "10",
                    "name": "数据库名称10",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                },
                {
                    "key": "11",
                    "name": "数据库名称11",
                    "mainId": "22222",
                    "nodeType": "child.nodeType",
                    "color": "#f60",
                    "icon": "1",
                    "link": "7",
                    "noExpand": true,
                    "base": false
                }
            ],
            "linkDataArray": [ 
                {"from": "1", "to": "2", "link":"7"},
                {"from": "2", "to": "3", "link":"7"},
                {"from": "2", "to": "4", "link":"7"},
                {"from": "2", "to": "5", "link":"7"},
                {"from": "2", "to": "6", "link":"7"},
                {"from": "7", "to": "4", "link":"7"},
                {"from": "8", "to": "7", "link":"7"},
                {"from": "8", "to": "9", "link":"7"},
                {"from": "8", "to": "10", "link":"7"},
                {"from": "8", "to": "11", "link":"7"},
            ]
        }
    };
    return data;
})

// https://fe.epoint.com.cn/showdoc/web/#/4?page_id=39
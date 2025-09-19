function getDataFromBody(opt) {
    if (!opt) return {};
    opt = decodeURIComponent(opt);
    var arr = opt.split('&');
    var o = {};
    arr.forEach(function (item) {
        var it = item.split('=');
        try {
            o[it[0]] = JSON.parse(it[1]);
        } catch (err) {
            o[it[0]] = it[1];
        }
    });

    return o;
}


// 门户设计器首页加载数据
Mock.mock(new RegExp('portaldesignaction'), function (opt) {
   
    var newTableData = [
        {
            "id": "410000199910266033",
            "url": "../../elements/todo/show.proto.html",
            "maxStart": "24",
            "maxEnd": "6",
            "minStart": "4",
            "minEnd": "4",
            "titleColor": "#79f2eb",
            "showHeader": "true",
            "border": 0,
            "borderColor": "",
            "bg": "#fff",
            "shadow": "",
            "radius": "",
            "titleBgColor": "",
            "icon": "2",
            "showAddBtn": "true",
            "addUrl": "https://www.baidu.com",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "https://www.google.com",
            "linkOpenType": "tabsNav",
            "col": 1,
            "row": 1,
            "sizex": "10",
            "sizey": "5",
            "title": "今进出计学技22222",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "itemlist", // 栏目地址
                "isDiy": false,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "2"
                    }
                ]
            }
        },
        {
            "id": "99000020181110244X",
            "url": "../../elements/todo/show.proto.html",
            "maxStart": "24",
            "maxEnd": "6",
            "minStart": "4",
            "minEnd": "4",
            "titleColor": "#a579f2",
            "showHeader": "true",
            "border": 0,
            "borderColor": "",
            "bg": "#fff",
            "shadow": "",
            "radius": "",
            "titleBgColor": "",
            "icon": "1",
            "showAddBtn": "true",
            "addUrl": "https://www.baidu.com",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "https://www.google.com",
            "linkOpenType": "tabsNav",
            "col": 11,
            "row": 1,
            "sizex": "7",
            "sizey": "5",
            "title": "料下社2222",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "isDiy": true,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1",
                        "isDiy": false
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "false", // 是否默认
                        "isDiy": false,
                        "sort": "2"
                    }
                ]
            }
        },
        {
            "id": "510000198009118993",
            "url": "../../elements/todo/show.proto.html",
            "maxStart": "24",
            "maxEnd": "6",
            "minStart": "4",
            "minEnd": "4",
            "showHeader": "true",
            "border": 0,
            "borderColor": "",
            "bg": "#fff",
            "shadow": "",
            "radius": "",
            "titleColor": "#333",
            "titleBgColor": "",
            "icon": "22",
            "showAddBtn": "true",
            "addUrl": "",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "tabsNav",
            "col": 1,
            "row": 6,
            "sizex": "4",
            "sizey": "5",
            "code": "510000198009118993",
            "title": "片小备2222",
            "visible": 'false',
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "isDiy": true,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "2"
                    }
                ]
            }
        },
        {
            "id": "450000198301185572",
            "url": "../../elements/todo/show.proto.html",
            "maxStart": "24",
            "maxEnd": "6",
            "minStart": "4",
            "minEnd": "4",
            "titleColor": "#daf279",
            "showHeader": "true",
            "border": 0,
            "borderColor": "",
            "bg": "#fff",
            "shadow": "",
            "radius": "",
            "titleBgColor": "",
            "icon": "27",
            "showAddBtn": "true",
            "addUrl": "",
            "titleBgColor": "",
            "titleIcon": "34",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 18,
            "row": 1,
            "sizex": "7",
            "sizey": "5",
            "code": "450000198301185572",
            "title": "提际各术2211",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "isDiy": true,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "2"
                    }
                ]
            }
        },
        {
            "id": "510000197310193488",
            "url": "../../elements/todo/show.proto.html",
            "maxStart": "24",
            "maxEnd": "6",
            "minStart": "4",
            "minEnd": "4",
            "titleColor": "#79f2c3",
            "showHeader": "true",
            "border": 0,
            "borderColor": "",
            "bg": "#fff",
            "shadow": "",
            "radius": "",
            "icon": "",
            "showAddBtn": "true",
            "addUrl": "",
            "titleBgColor": "",
            "titleIcon": "77",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 11,
            "row": 6,
            "sizex": "14",
            "sizey": "5",
            "code": "510000197310193488",
            "title": "劳说动难位22211",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "isDiy": true,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "2"
                    }
                ]
            }
        },
        {
            "id": "410000199910036510",
            "url": "../../elements/todo/show.proto.html",
            "maxStart": "24",
            "maxEnd": "6",
            "minStart": "4",
            "minEnd": "4",
            "titleColor": "#7c79f2",
            "showHeader": "true",
            "border": 0,
            "borderColor": "",
            "bg": "#fff",
            "shadow": "",
            "radius": "",
            "icon": "89",
            "showAddBtn": "true",
            "addUrl": "",
            "titleBgColor": "",
            "titleIcon": "34",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 5,
            "row": 6,
            "sizex": "6",
            "sizey": "5",
            "code": "410000199910036510",
            "title": "特办节3333",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "isDiy": true,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "isDiy": false,
                        "sort": "2"
                    }
                ]
            }
        }
    ];
        // console.log('============================');
        console.log('初始化');
        var data = Mock.mock({
            status: {
                code: 200
            },
            controls: [
                {id: 'widthType', value: "1"},
                {id: 'pageWidth', value: "998"},
                {id: 'pagePercent', value: "100"},
                {id: 'eleGrid', value: true},
                {id: 'eleRuler', value: false},
                {id: 'eleMove', value: true},
                {id: 'eleShow', value: true},
                {id: 'eleShow', value: true}
            ],
            'custom': {
                "tableData": newTableData
            }
        });
        return data;
});



// 元件内容获取
Mock.mock(new RegExp('itemlist'), function (opt) {
    // console.log('============================');
    // console.log('元件仓库获取');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    // 传递参数为：
    // {
    //     query: 'getElementTpl',
    //     portalGuid: portalGuid // 门户guid
    // }
    var d = Mock.mock({
        'itemList|5-12': [{
            title : '@ctitle()',
            url : 'https://www.baidu.com',
            content : '列表显示文字',
            date : '08-21',
            id : '@id'
        }]
    });
    // console.log(d);
    return d;
});
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
            "title": "今进出计学技",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "isDiy": false,
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "itemlist",
                        "default": false, // 是否默认
                        "isDiy": false,
                        "showNum": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "itemlist",
                        "default": true, // 是否默认
                        "isDiy": false,
                        "showNum": false,
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
            "title": "料下社",
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
                        "default": true, // 是否默认
                        "sort": "1",
                        "showNum": false,
                        "isDiy": true
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": false, // 是否默认
                        "isDiy": false,
                        "showNum": false,
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
            "title": "片小备",
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
                        "default": true, // 是否默认
                        "isDiy": false,
                        "showNum": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": false, // 是否默认
                        "isDiy": false,
                        "showNum": false,
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
            "title": "提际各术",
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
                        "default": true, // 是否默认
                        "isDiy": false,
                        "showNum": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": false, // 是否默认
                        "isDiy": false,
                        "showNum": false,
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
            "title": "劳说动难位",
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
                        "default": true, // 是否默认
                        "isDiy": false,
                        "showNum": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": false, // 是否默认
                        "isDiy": false,
                        "showNum": false,
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
            "title": "特办节",
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
                        "default": true, // 是否默认
                        "isDiy": false,
                        "showNum": false,
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": false, // 是否默认
                        "isDiy": false,
                        "showNum": false,
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

// 元件模板获取
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.getEleDataUrl)), function (opt) {
    // console.log('============================');
    // console.log('元件模板获取');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    // 传递参数为：
    // {
    //     query: 'getElementTpl',
    //     portalGuid: portalGuid // 门户guid
    // }
    var d = Mock.mock({
        'list|3-5': [{
            name: '元件分类@increment',
            id: '@id',
            'items|3-8': [{
                id: '@id',
                icon: 'modicon-@integer(1,124)', //'@image(24x24)',
                name: '元件模板-@cword(1,3)',
                "sizex": '@integer(3, 12)',
                "sizey": "@integer(3, 6)",
            }]
        }]
    }).list;
    // console.log(d);
    return d;
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


// 元件仓库获取
/* Mock.mock(new RegExp(Util.getRightUrl(portalConfig.getLibDataUrl)), function (opt) {
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
        'list|3-5': [{
            id: '@id',
            name: '仓库模板-@cword(1,3)',
            url: '',
            manageUrl: '',
            height: 'auto',
            "visible|1": [true, false]
        }],
        total: 4
    });
    // console.log(d);
    return d;
}); */


// 模板获取
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.getTemplateList)), function (opt) {
    // console.log('============================');
    // console.log('模板获取');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    // 传递参数为：
    // {
    //     query: 'getElementTpl',
    //     portalGuid: portalGuid // 门户guid
    // }
    /* var d = Mock.mock({
        'list': [{
            id: '@id',
            name: '公开模板',
            'items|2': [{
                id: '@id',
                img: '@image(40x30)',
                name: '模板-@cword(1,3)',
                "public|1": [true, false] // 是否公开模板
            }]
        },
        {
            id: '@id',
            name: '个人模板',
            'items|2': [{
                id: '@id',
                img: '@image(40x30)',
                name: '模板-@cword(1,3)',
                "public|1": [true, false] // 是否公开模板
            }]
        }]
    }).list; */
    var list = [
        {
            id: '1',
            img: 'http://dummyimage.com/40x30',
            name: '模板-1',
            "public": true, // 是否公开模板
            "publicId": ""
        },
        {
            id: '2',
            img: 'http://dummyimage.com/40x30',
            name: '模板-2',
            "public": true, // 是否公开模板
            "publicId": ""
        },
        {
            id: '3',
            img: 'http://dummyimage.com/40x30',
            name: '模板-3',
            "public": true, // 是否公开模板
            "publicId": ""
        },
        {
            id: '4',
            img: 'http://dummyimage.com/40x30',
            name: '模板-4',
            "public": false, // 是否公开模板
            "publicId": "2"
        },
        {
            id: '5',
            img: 'http://dummyimage.com/40x30',
            name: '模板-5',
            "public": false, // 是否公开模板
            "publicId": ""
        },
        {
            id: '6',
            img: 'http://dummyimage.com/40x30',
            name: '模板-6',
            "public": false, // 是否公开模板
            "publicId": ""
        }
    ]
    // var d = Mock.mock({
    //     'list|5-10': [{
    //         id: '@id',
    //         img: '@image(40x30)',
    //         name: '模板-@cword(1,3)',
    //         "public|1": [true, false], // 是否公开模板
    //         "publicId|1": ["123", ""]
    //     }]
    // }).list;
    // console.log(d);
    return list;
});


// 创建元件
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.createElementUrl)), function (opt) {
    // console.log('============================');
    // console.log('创建元件');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    // 传递参数为：
    // {
    //     query: 'createElement',
    //     portalGuid: portalGuid, // 门户guid
    //     tplId: elementTplId, // 元件模板id
    // }
    // if (/query=createElement/.test(opt.body)) {
    return Mock.mock({
        "id": "@id",
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
        "code": "410000199910036510",
        "title": "特办节",
        "visible": true,
        "column": {
            "columnId": "",
            "columnName": "",
            "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
            "columnItems": [
                {
                    "id": "",
                    "name": "待办",
                    "url": "../../elements/todo/show.proto.html",
                    "default": "true", // 是否默认
                    "sort": "1"
                },
                {
                    "id": "",
                    "name": "已办",
                    "url": "子栏目地址",
                    "default": "true", // 是否默认
                    "sort": "2"
                }
            ]
        }
    });
    // }
});



// 仓库模板是否可见
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.setEleVisible)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return true;
});


// 删除仓库模板
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.delEleLib)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return true;
});


// 公开模板
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.publicTemplate)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return {
        id: 55
    }
});

// 删除模板
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.deleteTemplate)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return true;
});

// 重命名模板
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.renameTemp)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return true;
});



// 预览页面首页加载数据
Mock.mock(new RegExp('portalpreviewaction'), function (opt) {
   
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
            "title": "今进出计学技",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "料下社",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "false", // 是否默认
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
            "title": "片小备",
            "visible": 'false',
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "提际各术",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "劳说动难位",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "特办节",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
               
            ],
            'custom': {
                "tableData": newTableData
            }
        });
        return data;
});



// 门户展示页面首页加载数据
Mock.mock(new RegExp('portaldeskaction'), function (opt) {
   
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
            "title": "今进出计学技",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "料下社",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "false", // 是否默认
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
            "title": "片小备",
            "visible": 'false',
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "提际各术",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "劳说动难位",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
            "title": "特办节",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "../../elements/todo/show.proto.html", // 栏目地址
                "columnItems": [
                    {
                        "id": "",
                        "name": "待办",
                        "url": "../../elements/todo/show.proto.html",
                        "default": "true", // 是否默认
                        "sort": "1"
                    },
                    {
                        "id": "",
                        "name": "已办",
                        "url": "子栏目地址",
                        "default": "true", // 是否默认
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
               
            ],
            'custom': {
                "tableData": newTableData
            }
        });
        return data;
});

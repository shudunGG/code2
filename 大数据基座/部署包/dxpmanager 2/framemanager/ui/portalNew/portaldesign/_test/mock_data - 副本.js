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

Mock.mock(new RegExp('portaldesignaction'), function (opt) {
    var tableData = [{
            "id": "410000199910266033",
            "name": "今进出计学技",
            "url": "../../elements/todo/show.proto.html",
            "titleColor": "#79f2eb",
            "showHeader": "true",
            "titleBgColor": "",
            "titleIcon": "2",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 1,
            "row": 1,
            "sizex": "10",
            "sizey": "5",
            "code": "410000199910266033",
            "title": "今进出计学技",
            "visible": false,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [{
                        id: "",
                        name: "待办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "1"
                    },
                    {
                        id: "",
                        name: "已办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "2"
                    }
                ]
            }
        },
        {
            "id": "99000020181110244X",
            "name": "料下社",
            "url": "../../elements/todo/show.proto.html",
            "titleColor": "#a579f2",
            "showHeader": "true",
            "titleBgColor": "",
            "titleIcon": "5",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "contentBg": "",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 11,
            "row": 1,
            "sizex": "7",
            "sizey": "5",
            "code": "99000020181110244X",
            "title": "料下社",
            "visible": true,
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [{
                        id: "",
                        name: "待办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "1"
                    },
                    {
                        id: "",
                        name: "已办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "2"
                    }
                ]
            }
        },
        {
            "id": "510000198009118993",
            "name": "片小备",
            "url": "../../elements/todo/show.proto.html",
            "titleColor": "#f27993",
            "showHeader": "true",
            "titleBgColor": "",
            "titleIcon": "10",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "contentBg": "",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 1,
            "row": 6,
            "sizex": "4",
            "sizey": "5",
            "code": "510000198009118993",
            "title": "片小备",
            "visible": "true",
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [{
                        id: "",
                        name: "待办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "1"
                    },
                    {
                        id: "",
                        name: "已办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "2"
                    }
                ]
            }
        },
        {
            "id": "450000198301185572",
            "name": "提际各术",
            "url": "../../elements/todo/show.proto.html",
            "titleColor": "#daf279",
            "showHeader": "true",
            "titleBgColor": "",
            "titleIcon": "34",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "contentBg": "",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 18,
            "row": 1,
            "sizex": "7",
            "sizey": "5",
            "code": "450000198301185572",
            "title": "提际各术",
            "visible": "true",
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [{
                        id: "",
                        name: "待办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "1"
                    },
                    {
                        id: "",
                        name: "已办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "2"
                    }
                ]
            }
        },
        {
            "id": "510000197310193488",
            "name": "劳说动难位",
            "url": "../../elements/todo/show.proto.html",
            "titleColor": "#79f2c3",
            "showHeader": "true",
            "titleBgColor": "",
            "titleIcon": "77",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "contentBg": "",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 11,
            "row": 6,
            "sizex": "14",
            "sizey": "5",
            "code": "510000197310193488",
            "title": "劳说动难位",
            "visible": "true",
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [{
                        id: "",
                        name: "待办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "1"
                    },
                    {
                        id: "",
                        name: "已办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "2"
                    }
                ]
            }
        },
        {
            "id": "410000199910036510",
            "name": "特办节",
            "url": "../../elements/todo/show.proto.html",
            "titleColor": "#7c79f2",
            "showHeader": "true",
            "titleBgColor": "",
            "titleIcon": "88",
            "showMoreBtn": "true",
            "showRefreshBtn": "true",
            "contentBg": "",
            "manageUrl": "../../elements/todo/manage2.proto.html",
            "moreUrl": "",
            "linkOpenType": "",
            "col": 5,
            "row": 6,
            "sizex": "6",
            "sizey": "5",
            "code": "410000199910036510",
            "title": "特办节",
            "visible": "true",
            "column": {
                "columnId": "",
                "columnName": "",
                "columnUrl": "", // 栏目地址
                "columnItems": [{
                        id: "",
                        name: "待办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "1"
                    },
                    {
                        id: "",
                        name: "已办",
                        url: "子栏目地址",
                        default: "true", // 是否默认
                        sort: "2"
                    }
                ]
            }
        }
    ];

    var completeData = [{
        id: '@id', // 标识
        "col": 1,
        "row": 1,
        "sizex": "10",
        "sizey": "5",
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        linkOpenType: "详情打开方式", // [tabsNav, dialog, blank] 三者之一
        themeCheck: "true",
        border: "1", //元件边框大小
        borderColor: '#fff', // 元件边框颜色
        bg: '#fff', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: 'true', // 标题区是否显示
        title: '今进出计学技', // 标题
        titleColor: '#333', // 标题颜色
        titleBgColor: '#fff', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: 'true', // 刷新按钮是否显示
        showMoreBtn: 'true', // 更多按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        showAddBtn: "true", // 新增按钮是否显示
        addUrl: '', // 新增按钮对应的地址
        visible: true,
        column: {
            columnId: "",
            columnName: "",
            columnUrl: "../../elements/todo/show.proto.html", // 栏目地址
            columnItems: [{
                id: "",
                name: "待办",
                url: "子栏目地址",
                default: "true", // 是否默认
                sort: "1"
            }, {
                id: "",
                name: "已办",
                url: "子栏目地址",
                default: "true", // 是否默认
                sort: "2"
            }]
        }
    },
    {
        id: '@id', // 标识
        "col": 11,
        "row": 1,
        "sizex": "7",
        "sizey": "5",
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        linkOpenType: "详情打开方式", // [tabsNav, dialog, blank] 三者之一
        themeCheck: "true",
        border: "1", //元件边框大小
        borderColor: '#fff', // 元件边框颜色
        bg: '#fff', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: 'true', // 标题区是否显示
        title: '料下社', // 标题
        titleColor: '#333', // 标题颜色
        titleBgColor: '#fff', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: 'true', // 刷新按钮是否显示
        showMoreBtn: 'true', // 更多按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        showAddBtn: "true", // 新增按钮是否显示
        addUrl: '', // 新增按钮对应的地址
        visible: true,
        column: {
            columnId: "",
            columnName: "",
            columnUrl: "../../elements/todo/show.proto.html", // 栏目地址
            columnItems: [{
                id: "",
                name: "待办",
                url: "子栏目地址",
                default: "true", // 是否默认
                sort: "1"
            }, {
                id: "",
                name: "已办",
                url: "子栏目地址",
                default: "true", // 是否默认
                sort: "2"
            }]
        }
    },
    {
        id: '@id', // 标识
        "col": 1,
        "row": 6,
        "sizex": "4",
        "sizey": "5",
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        linkOpenType: "详情打开方式", // [tabsNav, dialog, blank] 三者之一
        themeCheck: "true",
        border: "1", //元件边框大小
        borderColor: '#fff', // 元件边框颜色
        bg: '#fff', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: 'true', // 标题区是否显示
        title: '片小备', // 标题
        titleColor: '#333', // 标题颜色
        titleBgColor: '#fff', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: 'true', // 刷新按钮是否显示
        showMoreBtn: 'true', // 更多按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        showAddBtn: "true", // 新增按钮是否显示
        addUrl: '', // 新增按钮对应的地址
        visible: true,
        column: {
            columnId: "",
            columnName: "",
            columnUrl: "", // 栏目地址
            columnItems: [{
                id: "",
                name: "待办",
                url: "../../elements/todo/show.proto.html",
                default: "true", // 是否默认
                sort: "1"
            }, {
                id: "",
                name: "已办",
                url: "子栏目地址",
                default: "false", // 是否默认
                sort: "2"
            }]
        }
    },
    {
        id: '@id', // 标识
        "col": 18,
        "row": 1,
        "sizex": "7",
        "sizey": "5",
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        linkOpenType: "详情打开方式", // [tabsNav, dialog, blank] 三者之一
        themeCheck: "true",
        border: "1", //元件边框大小
        borderColor: '#fff', // 元件边框颜色
        bg: '#fff', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: 'true', // 标题区是否显示
        title: '提际各术', // 标题
        titleColor: '#333', // 标题颜色
        titleBgColor: '#fff', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: 'true', // 刷新按钮是否显示
        showMoreBtn: 'true', // 更多按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        showAddBtn: "true", // 新增按钮是否显示
        addUrl: '', // 新增按钮对应的地址
        visible: true,
        column: {
            columnId: "",
            columnName: "",
            columnUrl: "", // 栏目地址
            columnItems: [{
                id: "",
                name: "待办",
                url: "../../elements/todo/show.proto.html",
                default: "true", // 是否默认
                sort: "1"
            }, {
                id: "",
                name: "已办",
                url: "子栏目地址",
                default: "false", // 是否默认
                sort: "2"
            }]
        }
    },
    {
        id: '@id', // 标识
        "col": 11,
        "row": 6,
        "sizex": "14",
        "sizey": "5",
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        linkOpenType: "详情打开方式", // [tabsNav, dialog, blank] 三者之一
        themeCheck: "true",
        border: "1", //元件边框大小
        borderColor: '#fff', // 元件边框颜色
        bg: '#fff', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: 'true', // 标题区是否显示
        title: '劳说动难位', // 标题
        titleColor: '#333', // 标题颜色
        titleBgColor: '#fff', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: 'true', // 刷新按钮是否显示
        showMoreBtn: 'true', // 更多按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        showAddBtn: "true", // 新增按钮是否显示
        addUrl: '', // 新增按钮对应的地址
        visible: true,
        column: {
            columnId: "",
            columnName: "",
            columnUrl: "", // 栏目地址
            columnItems: [{
                id: "",
                name: "待办",
                url: "../../elements/todo/show.proto.html",
                default: "true", // 是否默认
                sort: "1"
            }, {
                id: "",
                name: "已办",
                url: "子栏目地址",
                default: "false", // 是否默认
                sort: "2"
            }]
        }
    },
    {
        id: '@id', // 标识
        "col": 5,
        "row": 6,
        "sizex": "6",
        "sizey": "5",
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        linkOpenType: "详情打开方式", // [tabsNav, dialog, blank] 三者之一
        themeCheck: "true",
        border: "1", //元件边框大小
        borderColor: '#fff', // 元件边框颜色
        bg: '#fff', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: 'true', // 标题区是否显示
        title: '特办节', // 标题
        titleColor: '#333', // 标题颜色
        titleBgColor: '#fff', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: 'true', // 刷新按钮是否显示
        showMoreBtn: 'true', // 更多按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        showAddBtn: "true", // 新增按钮是否显示
        addUrl: '', // 新增按钮对应的地址
        visible: true,
        column: {
            columnId: "",
            columnName: "",
            columnUrl: "", // 栏目地址
            columnItems: [{
                id: "",
                name: "待办",
                url: "../../elements/todo/show.proto.html",
                default: "true", // 是否默认
                sort: "1"
            }, {
                id: "",
                name: "已办",
                url: "子栏目地址",
                default: "false", // 是否默认
                sort: "2"
            }]
        }
    }]
    var libs = [{
            "id": "410000199910266033",
            "name": "今进出计学技",
            "sizex": 7,
            "sizey": 5,
            "visible": true
        },
        {
            "id": "330000197010187058",
            "name": "仓库模板-心长",
            "sizex": 8,
            "sizey": 5,
            "visible": true
        },
        {
            "id": "210000201902235395",
            "name": "仓库模板-细",
            "sizex": 7,
            "sizey": 4,
            "visible": true
        },
        {
            "id": "140000198002017824",
            "name": "仓库模板-往温酸",
            "sizex": 10,
            "sizey": 6,
            "visible": false
        },
        {
            "id": "330000197608154453",
            "name": "仓库模板-装论除",
            "sizex": 8,
            "sizey": 5,
            "visible": true
        }
    ]
    // console.log('============================');
    console.log('初始化');
    var data = Mock.mock({
        status: {
            code: 200
        },
        controls: [{
                id: 'widthType',
                value: "1"
            },
            {
                id: 'pageWidth',
                value: "998"
            },
            {
                id: 'pagePercent',
                value: "100"
            },
            {
                id: 'eleGrid',
                value: "true"
            },
            {
                id: 'eleRuler',
                value: "false"
            },
            {
                id: 'eleMove',
                value: "true"
            },
            {
                id: 'eleShow',
                value: "true"
            },
            {
                id: 'eleShow',
                value: "true"
            }
        ],
        'custom': {
            // "libs": libs,
            "tableData": completeData
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


// 元件仓库获取
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.getLibDataUrl)), function (opt) {
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
});


// 模板获取
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.getTempDataUrl)), function (opt) {
    // console.log('============================');
    // console.log('模板获取');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    // 传递参数为：
    // {
    //     query: 'getElementTpl',
    //     portalGuid: portalGuid // 门户guid
    // }
    var d = Mock.mock({
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
            }
        ]
    }).list;
    // console.log(d);
    return d;
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
        row: 0, // 行
        col: 0, // 列
        id: '@id', // 标识
        maxStart: "24",
        maxEnd: "6",
        minStart: "4",
        minEnd: "4",
        themeCheck: "true",
        border: '0',
        borderColor: '#fff', // 元件边框颜色
        bg: '@integer(1,140)', //元件背景
        shadow: '0', // 元件阴影
        radius: '3', // 元件圆角
        showHeader: true, // 是否显示标题
        title: '@cword(2,8)', // 名称
        titleColor: '@color', // 标题颜色
        icon: '5', // 标题图标 1-140
        iconColor: '#333', // 标题颜色
        showRefreshBtn: true, // 是否显示刷新按钮
        showMoreBtn: true, // 是否显示更多按钮
        showAddBtn: "true", // 新增按钮是否显示
        moreUrl: "", // 更多按钮对应的地址
        addUrl: '', // 新增按钮对应的地址
        manageUrl: '../../elements/todo/manage2.proto.html', // 管理页地址
        moreOpenUrl: '../management/test/test@integer(1,3).html', // 更多页打开地址
        url: '../../elements/todo/show.proto.html',
        itemNum: '@integer(8,20)', // 信息条数
        linkOpenType: 'tabsNav' // 更多按钮打开方式[tabNav, dialog, blank] 三者之一
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
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.publicTemp)), function (opt) {
    // console.log('============================');
    var params = getDataFromBody(decodeURIComponent(opt.body));
    // console.log(params);
    return true;
});

// 删除模板
Mock.mock(new RegExp(Util.getRightUrl(portalConfig.delTemp)), function (opt) {
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
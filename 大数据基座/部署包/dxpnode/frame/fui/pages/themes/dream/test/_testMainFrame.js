var menus = $.mockJSON.generateFromTemplate({
    "menus|8-15": [{
        "name": "@MODULE_NAME",
        "code": '@UUID',
        "icon": "@MODULE_ICON",
        "hasSub": "@boolean",
        "items|0-5": [{
            "name": "@MODULE_NAME",
            "code": '@UUID',
            "url": "@MODULE_URL",
            "items|0-10": [{
                "name": "@MODULE_NAME",
                "code": '@UUID',
                "url": "@MODULE_URL"
            }]
        }]
    }]
});
$.mockjax({
    url: Util.getRightUrl(epoint.dealRestfulUrl(SidebarNav.loadUrl)),
    dataType: 'json',
    responseTime: [1000, 2000],
    responseText: menus.menus
});
// 全局菜单
$.mockjax({
    url: Util.getRightUrl(SidebarNav.loadUrl),
    dataType: 'json',
    data: {
        query: "all"
    },
    responseTime: [1000, 2000],
    responseText: menus.menus
});
// 顶级菜单数据
var topMenus = $.mockJSON.generateFromTemplate({
    "menus|8-15": [{
        "name": "@MODULE_NAME",
        "code": '@UUID',
        "icon": "@MODULE_ICON",
        "hasSub": "@boolean"
    }]
});
$.mockjax({
    url: Util.getRightUrl(SidebarNav.loadUrl),
    dataType: 'json',
    data: {
        query: "top"
    },
    responseTime: [1000, 2000],
    responseText: {
        items: topMenus.menus
    }
});
// 子菜单
$.mockjax({
    url: Util.getRightUrl(SidebarNav.loadUrl),
    dataType: 'json',
    data: {
        query: "sub",
        code: /.*/
    },
    responseTime: [1000, 2000],
    responseText: topMenus.menus
});


// 获取快捷菜单数据
var quickMenu = [{
    "name": "撰写邮件",
    "code": "112001",
    "url": "_test/pages/module_4.html",
    "openType": "blank"
}, {
    "name": "收件箱",
    "code": "112002",
    "url": "_test/pages/module_4.html"
}, {
    "name": "发件箱",
    "code": "112003",
    "url": "_test/pages/module_4.html"
}, {
    "name": "个人计划",
    "code": "111002001",
    "url": "_test/pages/module_1.html",
    "openType": "blank"
}, {
    "name": "部门计划",
    "code": "111002002",
    "url": "_test/pages/module_2.html"
}];
$.mockjax({
    url: Util.getRightUrl('test/getQuickNavData'),
    dataType: 'json',
    responseTime: [100, 300],
    responseText: quickMenu
});


// 获取消息的数目
$.mockjax({
    url: Util.getRightUrl('test/getMsgNum'),
    dataType: 'json',
    responseTime: [100, 300],
    responseText: {
        'remind': 109,
        'eXun': 11
    }
});
$.mockjax({
    url: Util.getRightUrl('test/getUserInfo'),
    dataType: 'json',
    responseTime: [100, 300],
    responseText: {
        'guid': EmsgConfig.uid,
        'name': "张三",
        'ouName': '系统管理部'
    }
});


// 获取消息
var messageNum = {
    "111001": 100,
    "111002": 3,
    "111004": 3,
    "111005": 3
};

var messages = {};
messages['111001'] = {
    "name": "待办消息",
    "num": messageNum["111001"],
    "url": "module_2.html",
    "code": "111001",
    "items": [{
        "guid": "1111111",
        "name": "流水线背后的工业化思维",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }, {
        "guid": "222222",
        "name": "关于公司OA登录方式更新的通知",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }, {
        "guid": "3333333",
        "name": "新点周末影院",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }, {
        "guid": "444444",
        "name": "流水线背后的工业化思维",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }, {
        "guid": "5555555",
        "name": "新点周末影院",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }]
};
messages['111002'] = {
    "name": "系统消息",
    "num": messageNum['111002'],
    "url": "module3.html",
    "code": "111002",
    "items": [{
        "guid": "122221",
        "name": "流水线背后的工业化思维",
        "url": "_test/pages/module_4.html",
        "date": "09-10"
    }, {
        "guid": "2234344",
        "name": "关于公司OA登录方式更新的通知",
        "url": "_test/pages/module3.html",
        "date": "09-10"
    }, {
        "guid": "334545",
        "name": "新点周末影院",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }]
};
messages['111004'] = {
    "name": "预警消息",
    "num": messageNum["111004"],
    "url": "module_4.html",
    "code": "111004",
    "items": [{
        "guid": "124561",
        "name": "流水线背后的工业化思维",
        "url": "_test/pages/module_2.html",
        "date": "09-10"
    }, {
        "guid": "22676744",
        "name": "关于公司OA登录方式更新的通知",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }, {
        "guid": "3356745",
        "name": "新点周末影院",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }]
};
messages['111005'] = {
    "name": "邮件",
    "num": messageNum["111005"],
    "url": "module_5.html",
    "code": "111005",
    "items": [{
        "guid": "125451",
        "name": "流水线背后的工业化思维",
        "url": "_test/pages/module_2.html",
        "date": "09-10"
    }, {
        "guid": "224544",
        "name": "关于公司OA登录方式更新的通知",
        "url": "_test/pages/module_5.html",
        "date": "09-10"
    }, {
        "guid": "336775",
        "name": "新点周末影院",
        "url": "_test/pages/module_1.html",
        "date": "09-10"
    }]
};
$.mockjax({
    url: Util.getRightUrl('test/getMsgInfo'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var code = settings.data.code;

        var data = [];

        if (!code) {
            $.each(messages, function (i, item) {
                if (item) {
                    data.push(item);
                }
            })
        } else {
            data.push(messages[code]);
        }

        this.responseText = data;

    }
});
// 忽略info类型的消息
$.mockjax({
    url: Util.getRightUrl('test/ignoreMsgInfo'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var code = settings.data.code,
            guid = settings.data.guid;

        if (!guid) {
            messages[code] = false;
        } else {
            $.each(messages[code].items, function (i, item) {
                if (item.guid == guid) {
                    messages[code].items.splice(i, 1);
                    return false;
                }
            });

            if (!messages[code].items.length) {
                messages[code] = false;
            }
        }

        var data = [];

        if (messages[code]) {
            data = messages[code].items;
        }

        this.responseText = {
            "msgRemindNum": 88,
            "num": --messageNum[code],
            "items": data
        };
    }
});
// 搜索消息
var searchData = [{
    "code": "111001",
    "name": "待办消息",
    "items": [{
        "guid": "334375",
        "name": "流水线背后的工业化思维",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "997875",
        "name": "关于公司OA登录方式更新的通知",
        "url": "module_5.html",
        "date": "09-10",
    }, {
        "guid": "678842",
        "name": "新点周末影院",
        "url": "module_5.html",
        "date": "09-10"
    }]
}, {
    "code": "111002",
    "name": "邮件",
    "items": [{
        "guid": "5479070",
        "name": "OA升级配置",
        "url": "module_5.html",
        "date": "09-10",
    }, {
        "guid": "2145356",
        "name": "关于公司OA登录方式更新的通知",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "89546",
        "name": "政府OA的管理办法",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "789802",
        "name": "苏州OA办公系统发布",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "123567",
        "name": "OA拍照",
        "url": "module_5.html",
        "date": "09-10",
    }, {
        "guid": "92234",
        "name": "政府OA的配置",
        "url": "module_5.html",
        "date": "09-10"
    }]
}, {
    "code": "111003",
    "name": "系统消息",
    "items": [{
        "guid": "965334",
        "name": "流水线背后的工业化思维",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "121134",
        "name": "关于公司OA登录方式更新的通知",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "976543",
        "name": "新点周末影院",
        "url": "module_5.html",
        "date": "09-10"
    }]
}];
$.mockjax({
    url: Util.getRightUrl('test/searchMsgInfo'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var keyword = settings.data.keywords;

        var data = [];

        if (keyword) {
            $.each(searchData, function (i, child) {
                var view = {
                    "code": child.code,
                    "name": child.name,
                    "items": []
                };

                $.each(child.items, function (j, item) {
                    if (item.name.indexOf(keyword) > -1) {
                        view.items.push(item);
                    }
                });

                if (view.items.length) {
                    if (view.items.length > 5) {
                        view.moreUrl = 'module_1.html';
                    }
                    data.push(view);
                }
            });

        }

        this.responseText = data;
    }
});

// 组织
var org = {
    "inner": [{
        "guid": "001",
        "name": "新点软件",
        "items": [{
            "guid": "00001",
            "name": "曹立斌"
        }, {
            "guid": "001002",
            "name": "黄素龙"
        }, {
            "guid": "001003",
            "name": "李强"
        }, {
            "guid": "001004",
            "name": "企管部",
            "items": [{
                "guid": "001004001",
                "name": "周铭"
            }, {
                "guid": "001004002",
                "name": "张维铭"
            }, {
                "guid": "001004003",
                "name": "曹宇"
            }, {
                "guid": "001004004",
                "name": "丁丽"
            }, {
                "guid": "001004005",
                "name": "张维铭"
            }, {
                "guid": "001004006",
                "name": "曹宇"
            }, {
                "guid": "001004007",
                "name": "丁丽"
            }]
        }, {
            "guid": "001005",
            "name": "财务部",
            "items": [{
                "guid": "001005001",
                "name": "季琦"
            }, {
                "guid": "001005002",
                "name": "胡明锋"
            }, {
                "guid": "001005003",
                "name": "曹帅"
            }, {
                "guid": "001005004",
                "name": "华悦"
            }, {
                "guid": "001005005",
                "name": "金熙"
            }, {
                "guid": "001005006",
                "name": "刘杨"
            }]
        }, {
            "guid": "001006",
            "name": "行政部",
            "items": [{
                "guid": "001006001",
                "name": "戴静蕾"
            }, {
                "guid": "001006002",
                "name": "顾学卫"
            }]
        }]
    }, {
        "guid": "002",
        "name": "客户人员",
        "items": [{
            "guid": "002001",
            "name": "曹咏敏"
        }, {
            "guid": "002002",
            "name": "黄雪林"
        }]
    }],
    "public": [{
        "guid": "001",
        "name": "客户人员",
        "items": [{
            "guid": "001001",
            "name": "曹咏敏"
        }, {
            "guid": "001002",
            "name": "黄雪林"
        }, {
            "guid": "001003",
            "name": "曹咏敏"
        }, {
            "guid": "001004",
            "name": "黄雪林"
        }]
    }, {
        "guid": "002",
        "name": "常用人员",
        "items": [{
            "guid": "002001",
            "name": "曹咏敏"
        }, {
            "guid": "002002",
            "name": "黄雪林"
        }]
    }],
    "personal": [{
        "guid": "001",
        "name": "苏州人员",
        "items": [{
            "guid": "001001",
            "name": "曹咏敏"
        }, {
            "guid": "001002",
            "name": "黄雪林"
        }]
    }, {
        "guid": "002",
        "name": "南京人员",
        "items": [{
            "guid": "002001",
            "name": "曹咏敏"
        }, {
            "guid": "002002",
            "name": "黄雪林"
        }]
    }]
};

$.mockjax({
    url: Util.getRightUrl('test/getMsgOrg'),
    dataType: 'json',
    responseTime: [100, 300],
    responseText: org
});

var srhOrg = [{
    "name": "内部通讯录",
    "code": "111",
    "items": [{
        "guid": "002001",
        "name": "曹咏敏",
        "dptName": "企管部"
    }, {
        "guid": "002002",
        "name": "曹雪敏",
        "dptName": "企管部"
    }, {
        "guid": "002003",
        "name": "曹咏雪",
        "dptName": "企管部"
    }, {
        "guid": "002004",
        "name": "顾学卫",
        "dptName": "行政部"
    }, {
        "guid": "002005",
        "name": "周咏铭",
        "dptName": "行政部"
    }, {
        "guid": "002006",
        "name": "周颜雪",
        "dptName": "行政部"
    }]
}, {
    "name": "外部通讯录",
    "code": "222",
    "items": [{
        "guid": "001001",
        "name": "曹雪锋",
        "dptName": "国泰公司"
    }, {
        "guid": "001002",
        "name": "曹雪明",
        "dptName": "国泰公司"
    }, {
        "guid": "001003",
        "name": "顾咏雪",
        "dptName": "国泰公司"
    }, {
        "guid": "001004",
        "name": "周学卫",
        "dptName": "国泰公司"
    }, {
        "guid": "001005",
        "name": "周咏明",
        "dptName": "国泰公司"
    }, {
        "guid": "001006",
        "name": "周明锋",
        "dptName": "国泰公司"
    }]
}];
$.mockjax({
    url: Util.getRightUrl('test/searchMsgOrg'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var keyword = settings.data.keywords;

        var data = [];

        if (keyword) {
            $.each(srhOrg, function (i, child) {
                var view = {
                    "code": child.code,
                    "name": child.name,
                    "items": []
                };

                $.each(child.items, function (j, item) {
                    if (item.name.indexOf(keyword) > -1) {
                        view.items.push(item);
                    }
                });

                if (view.items.length) {
                    data.push(view);
                }
            });

        }

        this.responseText = data;
    }
});

// 关注
var attentions = {};
attentions['111001'] = {
    "name": "待办消息",
    "num": 8,
    "url": "module_2.html",
    "code": "111001",
    "items": [{
        "guid": "1111111",
        "name": "流水线背后的工业化思维",
        "url": "module_5.html",
        "date": "09-10",
        "hasNew": "true"
    }, {
        "guid": "222222",
        "name": "关于公司OA登录方式更新的通知",
        "url": "module_5.html",
        "date": "09-10",
        "hasNew": "true"
    }, {
        "guid": "3333333",
        "name": "新点周末影院",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "444444",
        "name": "流水线背后的工业化思维",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "5555555",
        "name": "新点周末影院",
        "url": "module_5.html",
        "date": "09-10"
    }]
};
attentions['111002'] = {
    "name": "系统消息",
    "num": 3,
    "url": "module3.html",
    "code": "111002",
    "items": [{
        "guid": "122221",
        "name": "流水线背后的工业化思维",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "2234344",
        "name": "关于公司OA登录方式更新的通知",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "334545",
        "name": "新点周末影院",
        "url": "module_5.html",
        "date": "09-10"
    }]
};
attentions['111004'] = {
    "name": "预警消息",
    "num": 3,
    "url": "module_4.html",
    "code": "111004",
    "items": [{
        "guid": "124561",
        "name": "<img src='_test/images/yujing-pass.png'/>流水线背后的工业化思维",
        "url": "module_5.html",
        "date": "09-10",
        "hasNew": "true"
    }, {
        "guid": "22676744",
        "name": "<img src='_test/images/yujing-warning.png'/>关于公司OA登录方式更新的通知",
        "url": "module_5.html",
        "date": "09-10"
    }, {
        "guid": "3356745",
        "name": "<img src='_test/images/yujing-danger.png'/>新点周末影院",
        "url": "module_5.html",
        "date": "09-10"
    }]
};
$.mockjax({
    url: Util.getRightUrl('test/getMsgAttention'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var code = settings.data.code;

        var data = [];

        if (!code) {
            $.each(attentions, function (i, item) {
                if (item) {
                    data.push(item);
                }
            })
        } else {
            data.push(attentions[code]);
        }

        this.responseText = data;

    }
});
// 取消关注
$.mockjax({
    url: Util.getRightUrl('test/ignoreMsgAttention'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var code = settings.data.code,
            guid = settings.data.guid;

        if (!guid) {
            attentions[code] = false;
        } else {
            $.each(attentions[code].items, function (i, item) {
                if (item.guid == guid) {
                    attentions[code].items.splice(i, 1);
                    return false;
                }
            });

            if (!attentions[code].items.length) {
                attentions[code] = false;
            }
        }

        var data = [];

        if (attentions[code]) {
            data = attentions[code].items;
        }

        this.responseText = {
            "msgAttentionNum": 5,
            "num": data.length,
            "items": data
        };
    }
});

$.mockjax({
    url: Util.getRightUrl('test/searchMsgAttention'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var keyword = settings.data.keywords;

        var data = [];

        if (keyword) {
            $.each(searchData, function (i, child) {
                var view = {
                    "code": child.code,
                    "name": child.name,
                    "items": []
                };

                $.each(child.items, function (j, item) {
                    if (item.name.indexOf(keyword) > -1) {
                        view.items.push(item);
                    }
                });

                if (view.items.length) {
                    if (view.items.length > 5) {
                        view.moreUrl = 'module_1.html';
                    }
                    data.push(view);
                }
            });

        }

        this.responseText = data;
    }
});

var recentSession = [{
        type: "friend", //会话类型,user:个人;group:讨论组
        uid: "00001", //唯一标识
        name: "于丽丽", //名称
        imgUrl: "../emsg/images/emsg-example-user02.jpg", //头像URL，讨论组为空
        hasRead: false, //是否已读
        date: mini.formatDate(new Date(), "MM-dd HH:mm"), //消息时间
        message: "此处显示最新一条微讯的文字信息，保持与MSG端的信息同步" //最近一条消息
    },
    {
        sessionId: "S00009",
        type: "group",
        uid: "99999",
        name: "网站与前端研发部",
        imgUrl: "",
        hasRead: false,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "此处显示最新一条微讯的文字信息！",
        createDate: mini.formatDate(new Date(), "yyyy/MM/dd"),
        member: [{
                uid: "00001",
                name: "于丽丽",
                imgUrl: "../emsg/images/msg-example-user02.jpg",
            },
            {
                uid: "00003",
                name: "张三",
                imgUrl: "../emsg/images/msg-example-user13.jpg",
            },
            {
                uid: "00004",
                name: "徐立",
                imgUrl: "../emsg/images/msg-example-user03.jpg",
            },
            {
                uid: "00005",
                name: "王大大",
                imgUrl: "../emsg/images/msg-example-user04.jpg",
            }
        ]
    },
    {
        type: "friend",
        uid: "00003",
        name: "张三",
        imgUrl: "../emsg/images/emsg-example-user13.jpg",
        hasRead: false,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "邮件已发，请注&nbsp;意查收！"
    },
    {
        type: "friend",
        uid: "00004",
        name: "徐立",
        imgUrl: "../emsg/images/emsg-example-user03.jpg",
        hasRead: true,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "此处显示最新一条微讯的文字信息"
    },
    {
        type: "friend",
        uid: "00005",
        name: "王大大",
        imgUrl: "../emsg/images/emsg-example-user04.jpg",
        hasRead: true,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "此处显示最新一条微讯的文字信息，保持与MSG端的信息同步"
    }
];


$.mockjax({
    url: Util.getRightUrl('test/openSession'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var uid = settings.data.userid;

        this.responseText = {
            success: true,
            sessionid: "S" + uid
        };
    }
});


$.mockjax({
    url: Util.getRightUrl('test/getuserlist'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var id = settings.data.id,
            key = settings.data.key;
        if (key) {
            this.responseText = [{
                    id: '10000',
                    name: "开发1部",
                    children: [{
                            id: '00000',
                            name: "程序员" + key,
                            isLeaf: true
                        },
                        {
                            id: '00005',
                            name: "王大大" + key,
                            isLeaf: true
                        }
                    ]

                },
                {
                    id: '20000',
                    name: "开发2部",
                    children: [{
                            id: '20001',
                            name: "张三(开发2部)" + key,
                            isLeaf: true
                        },
                        {
                            id: '20003',
                            name: "李四(开发2部)" + key,
                            isLeaf: true
                        }
                    ]
                },
            ];
            return;
        }
        if (!id) {
            this.responseText = [{
                    id: '1',
                    name: "开发1部",
                    isLeaf: false
                },
                {
                    id: '2',
                    name: "开发2部",
                    isLeaf: false
                },
                {
                    id: '3',
                    name: "开发3部",
                    isLeaf: false
                }
            ];
        } else {
            var l = Math.floor(Math.random() * 10 + 5),
                data = [];
            for (var i = 0; i < l; i++) {
                data.push({
                    id: id + i.toString(),
                    name: "开发" + id + "部张三" + i.toString(),
                    isLeaf: true
                });
            }
            this.responseText = data;
        }
    }

});

$.mockjax({
    url: Util.getRightUrl('test/treeUrl'),
    dataType: 'json',
    responseTime: 2000,
    response: function (settings) {
        var query = settings.data.query,
            result;
        console.log("获取人员列表");
        //#region

        result = [{
            guid: '10000',
            name: "研发群",
            items: [{
                    guid: '10001',
                    name: "基础支撑研发群",
                    items: [{
                        guid: '100011',
                        name: "框架研发部",
                        items: [{
                                guid: '1000111',
                                name: "程序员1",
                            },
                            {
                                guid: '1000112',
                                name: "程序员2",
                            },
                            {
                                guid: '1000113',
                                name: "程序员3",
                            },
                            {
                                guid: '1000114',
                                name: "程序员4",
                            }
                        ]

                    }, {
                        guid: '100012',
                        name: "移动研发部"
                    }, {
                        guid: '100013',
                        name: "网站与前端研发部"
                    }, {
                        guid: '100014',
                        name: "基础设施支持部"
                    }]
                },
                {
                    guid: '10002',
                    name: "政务服务研发群"
                }
            ]

        }, {
            guid: '20000',
            name: "实施部",
            items: [{
                    guid: '20001',
                    name: "实施一部"
                },
                {
                    guid: '20003',
                    name: "实施二部"
                }
            ]
        }]
        //#endregion
        this.responseText = result;
    }
});


$.mockjax({
    url: Util.getRightUrl('test/CreateGroup'),
    dataType: 'json',
    responseTime: [100, 300],
    responseText: {
        success: true,
        sessionid: "S_99999",
        groupid: "99999"
    }
})

$.each(recentSession, function (i, e) {
    e.sessionId = "S" + EmsgConfig.uid + "_" + e.uid;
    if (e.type == "group") {
        e.sessionId = "S" + "_" + e.uid;
        e.name = "网站与前端研发部" + Math.floor(Math.random() * 100)
    }
})

$.mockjax({
    url: Util.getRightUrl('test/emsgbaseUrl'),
    dataType: 'json',
    responseTime: [100, 300],
    response: function (settings) {
        var query = settings.data.query,
            result;
        switch (query) {
            case "opensession":
                { //打开聊天
                    var uid = settings.data.userid;
                    result = {
                        success: true,
                        sessionid: "S" + EmsgConfig.uid + "_" + uid
                    };
                    break;
                }
            case "loadrecentsession":
                { //加载最近聊天
                    var uid = EmsgConfig.uid;
                    var data = [];
                    $.each(recentSession, function (i, e) {
                        if (uid == e.uid) {
                            return true;
                        }
                        e.sessionId = "S" + uid + "_" + e.uid;
                        if (e.type == "group") {
                            e.sessionId = "S" + "_" + e.uid;
                            e.name = "网站与前端研发部" + Math.floor(Math.random() * 100)
                        }
                        data.push(e);
                    })
                    result = {
                        sessionlist: data
                    };
                    break;
                }
            case "getuserinfo":
                {
                    //#region加载个人信息
                    var uid = settings.data.uid || EmsgConfig.uid;
                    console.log("加载个人信息-Uid：" + uid);
                    $.each(recentSession, function (i, e) {
                        if (e.uid == uid) {
                            result = {
                                uid: e.uid,
                                name: e.name,
                                imgUrl: e.imgUrl,

                            };
                            return false;
                        }
                    })
                    if (!result) {
                        if (uid == "00000") {
                            result = {
                                uid: uid,
                                name: "管理员",
                                imgUrl: "images/top/top-headp-big.jpg",

                            };
                        } else {
                            result = {
                                uid: uid,
                                name: "通讯录人员",
                                imgUrl: "images/msg/msg-example-user03.jpg",

                            };
                        }
                    }
                    break;
                    //#endregion
                }
            case "getgroupinfo":
                {
                    //#region加载讨论组信息
                    var uid = settings.data.uid || EmsgConfig.uid;
                    console.log("加载讨论组信息-Uid：" + uid);
                    result = {
                        uid: "S_99999",
                        name: "网站与前端研发部" + Math.floor(Math.random() * 10),
                        createDate: mini.formatDate(new Date(), "yyyy/MM/dd"),
                        members: [{
                                uid: "00001",
                                name: "于丽丽",
                                imgUrl: "../emsg/images/emsg-example-user02.jpg",
                            },
                            {
                                uid: "00003",
                                name: "张三",
                                imgUrl: "../emsg/images/emsg-example-user13.jpg",
                            },
                            {
                                uid: "00004",
                                name: "徐立",
                                imgUrl: "../emsg/images/emsg-example-user03.jpg",
                            },
                            {
                                uid: "00005",
                                name: "王大大",
                                imgUrl: "../emsg/images/emsg-example-user04.jpg",
                            }
                        ]
                    };
                    break;
                    //#endregion
                }
            case "ignoremessage":
                { //忽略聊天信息
                    var sessionid = settings.data.sessionid;
                    console.log("忽略聊天信息-SessionId：" + sessionid);
                    result = {
                        success: true
                    };
                    this.responseTime = 2000;
                    break;
                }
            case "loadhistorymessage":
                {
                    //#region加载历史消息
                    var sessionId = settings.data.sessionid;
                    console.log("加载历史消息-SessionId：" + sessionId);

                    var session;
                    $.each(recentSession, function (i, e) {
                        if (e.sessionId == sessionId) {
                            session = e;
                            return false;
                        }
                    })
                    if (session == null) {
                        result = {
                            messagelist: []
                        };
                    } else {
                        var message = [];
                        if (session.type == "friend") {
                            var msgStr = "和" + session.name + "聊天记录";
                            for (var i = 0; i < 10; i++) {
                                var l = Math.floor(Math.random() * 3 + 2);
                                var m = ""
                                for (var j = 0; j < l; j++) {
                                    m += msgStr;
                                }

                                if (i % 2 == 0) {
                                    if (i == 8) {
                                        message.push({
                                            uid: EmsgConfig.uid,
                                            type: "file",
                                            href: "http://www.baidu.com",
                                            content: "附件下载附件下载附件下载附件下载附件下载附件下载.jpg",
                                            size: 336312,
                                            time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                            readtime: "2016-02-03 15:04:38"
                                        });
                                    } else {
                                        message.push({
                                            uid: session.uid,
                                            content: "收到" + m,
                                            time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                            readtime: "2016-02-03 15:04:38"
                                        });
                                    }
                                } else {
                                    if (i == 5) {
                                        message.push({
                                            uid: session.uid,
                                            type: "file",
                                            content: "附件下载附件下载附件下载附件下载附件下载附件下载.jpg",
                                            size: 20230,
                                            time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                            readtime: "2016-02-03 15:04:38"
                                        });
                                    } else {
                                        message.push({
                                            uid: EmsgConfig.uid,
                                            content: "发送" + m,
                                            time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                            readtime: "2016-02-03 15:04:38"
                                        });
                                    }
                                }
                            }

                            if (settings.data.pageindex == 4) {
                                result = {
                                    messagelist: []
                                };
                            } else {
                                if (settings.data.pageindex == 1) {
                                    for (var i = 0; i < 3; i++) {
                                        message.push({
                                            uid: session.uid,
                                            content: "未读消息",
                                            time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                            readtime: null
                                        });
                                    }

                                }
                                result = {
                                    messagelist: message
                                };;
                            }

                        } else {
                            var idx, groupMember = [],
                                user;
                            $.each(recentSession, function (i, e) {
                                if (e.type == "group") {
                                    return true;
                                }
                                groupMember.push({
                                    uid: e.uid,
                                    name: e.name,
                                    imgUrl: e.imgUrl
                                })
                            });
                            groupMember.push({
                                uid: "00000",
                                name: "管理员",
                                imgUrl: "images/mainframe/top/top-headp-big.jpg",
                            })

                            for (var i = 0; i < 10; i++) {
                                idx = Math.floor(Math.random() * 5);
                                if (idx == 4) {
                                    i--;
                                    continue;
                                }
                                user = groupMember[idx];
                                message.push({
                                    uid: user.uid,
                                    content: "收到和" + user.name + "聊天记录<img alt='[嘻嘻]' src='../emsg/images/emotion/tootha_thumb.gif' class='eimg'>",
                                    time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                    readtime: "2016-02-03 15:04:38"
                                });
                                if (i % 3 == 0) {
                                    message.push({
                                        uid: EmsgConfig.uid,
                                        content: "我自己发送的聊天消息",
                                        time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                        readtime: "2016-02-03 15:04:38"
                                    });
                                }
                                if (i == 8) {
                                    message.push({
                                        uid: EmsgConfig.uid,
                                        type: "file",
                                        href: "http://www.baidu.com",
                                        content: "附件下载附件下载附件下载附件下载附件下载附件下载.jpg",
                                        size: 23561316,
                                        time: mini.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                        readtime: "2016-02-03 15:04:38"
                                    });
                                }
                            }
                            if (settings.data.pageindex == 4) {
                                result = {
                                    member: groupMember,
                                    messagelist: []
                                };
                            } else {
                                result = {
                                    member: groupMember,
                                    messagelist: message
                                };
                            }
                        }
                    }

                    break;
                    //#endregion
                }
            case "renamegroup":
                { //重命名讨论组
                    var groupid = settings.data.groupid;
                    console.log("重命名讨论组-GroupId：" + groupid);
                    result = {
                        success: true
                    };
                    break;
                }
            case "quitgroup":
                { //退出讨论组
                    var groupid = settings.data.groupid;
                    console.log("退出讨论组-GroupId：" + groupid);
                    result = {
                        success: true
                    };
                    break;
                }
            case "creategroup":
                { //新建讨论组
                    var memberids = JSON.stringify(settings.data.memberids);
                    console.log("新建讨论组-Members：" + settings.data.groupname);
                    result = {
                        success: true,
                        sessionid: "S_99999",
                        groupid: "99999"
                    }
                    break;
                }
            case "editgroup":
                { //编辑讨论组
                    var memberids = JSON.stringify(settings.data.memberids);
                    console.log("新建讨论组-Members：" + memberids);
                    result = {
                        success: true
                    }
                    break;
                }
            default:
                break;
        }
        this.responseText = result;
    }
});
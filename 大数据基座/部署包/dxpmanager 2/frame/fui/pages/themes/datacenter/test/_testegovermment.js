// 用户信息
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getUserInfo')), {
    "name": "@cname()",
    "guid": "@id()",
    "portrait": "",
    // "portrait": "@image(44x44)",
    // "signature": "@scentence(1,20)",
    "ouName|1": ["财务部", "系统管理部", "人事部", "研发部", "销售部"],
    "title": "网页标题",
    "logo": "",
    "homes|1-2": [{
        "name": "我的首页",
        "url": "./test/testcolor.html"
    }],
    // "hasParttime": "@bool(1,2,true)"
    "hasParttime": true
});
// 界面 信息
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getPageInfo')), function (opt) {
    console.log('界面信息', window.decodeURIComponent(opt.body).split('&'));
    var data = Mock.mock({
        "title": "网页标题", // 网页标题
        "logo": "@image('250x32')", // 主界面logo图片地址

        // 门户配置 考虑可配置多个 使用数组形式
        "homes|1-5": [{
            "id": "home-1",
            "name": "我的首页",
            "url": "./test/home.html"
        }],
        "defaultHome": "home-1", // 菜单类主题默认激活的home
        "defaultUrl": "./test/home.html", // 首页地址

        // 全文检索地址
        "fullSearchUrl": "http://fdoc.epoint.com.cn/onlinedoc/KlFront/fullsearch.html" // 全文检索地址，若无则不会在主界面上显示全文检索
    });
    data.homes.forEach(function (home, i) {
        home.id = 'home-' + (i + 1);
    });
    data.defaultHome = 'home-2';
    console.log('界面信息', data);
    return data;
});

// 门户名称
// Mock.mock(Util.getRightUrl(doorUrl), function() {
//     var content = Mock.mock({
//         "list|5": [{
//             "name": "@cword(4,6)",
//             "code": "@id()",
//             "url": "./test/testcolor.html",
//             "openType|1": ["blank", "tabsnav"]
//         }]
//     });
//     return content.list;
// });

// 菜单
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getMenu')),
    function (opt) {
        var emt = opt.body,
            content;
            console.log( '/getMenu',window.decodeURIComponent(emt).split('&'));
        if (/query=top/.test(emt)) {
            content = Mock.mock({
                "items|4-18": [{
                    "name": "@cword(4)", // 菜单显示名称
                    "icon": 'modicon-@integer(1,124)', // 模块图标
                    "code": "@id", // 菜单id
                    "url": "", // 菜单url
                    "hasSub|1": [true, false],
                    "openType|1": ["blank", "tabsnav"] // 此菜单打开方式，含有url时才生效。
                }]
            });
            content.items[1].url = './test/home.html';
            content.items[3].url = './test/home.html';
            if (content.items[6]) {
                content.items[6].url = './test/home.html';
                content.items[6].openType = 'tabsnav';
            }
            content.code = content.items[0].code;
            content.items[0].hasSub = true;
            return content;
        } else {
            content = Mock.mock({
                "list|5-15": [{
                    "name": "@cword(3,12)", // 菜单显示名称
                    "icon": 'modicon-@integer(1,124)', // 模块图标
                    "code": "@id()", // 菜单id
                    "url": "", // 菜单url 存在url则不应再有子菜单
                    "openType|1": ["blank", "tabsnav", "tabsnav", "tabsnav", "tabsnav"], // 是否新窗口打开
                    // 如果有items 属性 且有内容 则该菜单具有子菜单
                    "items|1-10": [{
                        "name": "@cword(3,12)",
                        "icon": 'modicon-@integer(1,124)',
                        "code": "@id",
                        "url": "",
                        "openType|1": ["blank", "tabsnav", "tabsnav", "tabsnav", "tabsnav"],
                        "items|1-10": [{
                            "name": "@cword(3,8)",
                            "icon": 'modicon-@integer(1,124)',
                            "code": "@id",
                            "url": "",
                            "openType|1": ["blank", "tabsnav", "tabsnav", "tabsnav", "tabsnav"],
                            "items|2-10": [{
                                "name": "@cword(3,8)",
                                "icon": 'modicon-@integer(1,124)',
                                "code": "@id",
                                "url|1": ["./test/grid.html","./test/home.html","http://localhost:8080/NT/fui/pages/ntjy/ntjy.html"],
                                "openType|1": [ "tabsnav", "tabsnav", "tabsnav", "tabsnav"]
                            }]
                        }]
                    }]
                }]
            }).list;
            content.forEach(function (item) {
                if (!item.items.length) {
                    item.url = "./test/testcolor.html";
                } else {
                    item.items.forEach(function (item) {
                        if (!item.items.length) {
                            item.url = "./test/testcolor.html";
                        } else {
                            item.items.forEach(function (item) {
                                if (!item.items.length) {
                                    item.url = "./test/testcolor.html";
                                }
                            });
                        }
                    });
                }

            });
            content[0].items[0].items[0].items[1].url = "./test/home.html";
            content[0].items[0].items[0].items[0].url = './test/grid.html';
            return content;
        }

    }
);

// 快捷菜单、
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getQuickMenu')), function (opt) {
    console.log('/getQuickMenu', window.decodeURIComponent(opt.body).split('&'));
    return Mock.mock({
        "list|5-10": [{
            "code": "@id",
            "url": "./test/contentPage.html",
            "name":"@cword(3,6)",
            "openType|1": ["blank", "tabsnav", "tabsnav", "tabsnav", "tabsnav"]
        }]
    }).list;
});


// 主题切换
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getThemes')), function (opt) {
    console.log('/getThemes', window.decodeURIComponent(opt.body).split('&'));
    return Mock.mock({
        "list": [
            {
                "id":"id",
                "name": "梦幻",
                "preview": "预览图",
                "url": "此主题访问地址"
            },
            {
                "id":"id",
                "name": "classic",
                "preview": "预览图",
                "url": "此主题访问地址"
            },
            {
                "id":"id",
                "name": "imac",
                "preview": "预览图",
                "url": "此主题访问地址"
            },
            {
                "id":"id",
                "name": "metro",
                "preview": "预览图",
                "url": "此主题访问地址"
            }
        ]
    }).list;
});

// 主题保存
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/saveTheme')), function (opt) {
    console.log('/saveTheme', window.decodeURIComponent(opt.body).split('&'));
    return {code: 200};
});


// 消息数目

Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getMsgCount')), {
    "remind|0-200": 67,
    "eXun|0-105": 1
});

// 消息内容
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/getMsgData')), function () {
    return Mock.mock([{
        "name": "待办消息", // 分类名称
        "num": "@integer(0,99)", // 此分类下提醒数目
        "remindType": 'todo', // 提醒的类型，用于用户在忽略消息时回传给后端
        "url": "@url()", // 点击此分类标题的跳转地址
        "openType|1": ["dialog", "blank", "tabsnav"], // 此分类点击的打开方式，分别为dialog、新窗口、tabsNav
        // 此分类下的消息内容
        "items|5-7": [{
            "guid": "@id", // 提醒id
            "name": "@cword(5,20)", // 提醒显示的名称
            "url": "@url()", // 点击后的处理地址
            "date": "@date(MM-dd)", // 日期
            "status": "", // 状态 值可以是任何类型，用以可能的个性化需求扩展 比如 未读、已阅、代办、紧急、等等
            "openType|1": ["dialog", "blank", "tabsnav"] // 此提醒点击的打开方式，分别为dialog、新窗口、tabsNav
        }]
    }, {
        "name": "系统消息",
        "num": "@integer(0,99)",
        "remindType": 'system',
        "url": "@url()",
        "openType|1": ["dialog", "blank", "tabsnav"],
        "items|5-7": [{
            "guid": "@id",
            "name": "@cword(5,20)",
            "url": "@url()",
            "date": "@date(MM-dd)",
            "status": "", // 状态 值可以是任何类型，用以可能的个性化需求扩展 比如 未读、已阅、代办、紧急、等等
            "openType|1": ["dialog", "blank", "tabsnav"]
        }]
    }, {
        "name": "预警信息",
        "remindType": 'warn',
        "num": "@integer(0,99)",
        "url": "@url",
        "openType|1": ["dialog", "blank", "tabsnav"],
        "items|5-7": [{
            "guid": "@id",
            "name": "@cword(5,20)",
            "url": "@url",
            "date": "@date(MM-dd)",
            "status|1-3": 1, // 状态 值可以是任何类型，用以可能的个性化需求扩展 比如 未读、已阅、代办、紧急、等等
            "openType|1": ["dialog", "blank", "tabsnav"]
        }]
    }, {
        "name": "邮件",
        "remindType": 'email',
        "num": "@integer(0,99)",
        "url": "@url",
        "openType|1": ["dialog", "blank", "tabsnav"],
        "items|5-7": [{
            "guid": "@id",
            "name": "@cword(5,20)",
            "url": "@url",
            "date": "@date(MM-dd)",
            "status": "", // 状态 值可以是任何类型，用以可能的个性化需求扩展 比如 未读、已阅、代办、紧急、等等
            "openType|1": ["dialog", "blank", "tabsnav"]
        }]
    }]);
});

// 消息取消提醒
Mock.mock(Util.getRightUrl(epoint.dealRestfulUrl(getDataUrl + '/ignoreRemind')), {
    "success": 1
});


// E讯列表
Mock.mock(Util.getRightUrl(EmsgConfig.baseUrl), function () {
    var recentSession = [{
        type: "friend", //会话类型,user:个人;group:讨论组
        uid: "00001", //唯一标识
        name: "于丽丽", //名称
        imgUrl: "../OA/Msg/emsg-example-user02.jpg", //头像URL，讨论组为空
        hasRead: false, //是否已读
        date: mini.formatDate(new Date(), "MM-dd HH:mm"), //消息时间
        message: "此处显示最新一条微讯的文字信息，保持与MSG端的信息同步" //最近一条消息
    }, {
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
        }, {
            uid: "00003",
            name: "张三",
            imgUrl: "../images/msg-example-user13.jpg",
        }, {
            uid: "00004",
            name: "徐立",
            imgUrl: "../images/msg-example-user03.jpg",
        }, {
            uid: "00005",
            name: "王大大",
            imgUrl: "../images/msg-example-user04.jpg",
        }]
    }, {
        type: "friend",
        uid: "00003",
        name: "张三",
        imgUrl: "../images/emsg-example-user13.jpg",
        hasRead: false,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "邮件已发，请注&nbsp;意查收！"
    }, {
        type: "friend",
        uid: "00004",
        name: "徐立",
        imgUrl: "../images/emsg-example-user03.jpg",
        hasRead: true,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "此处显示最新一条微讯的文字信息"
    }, {
        type: "friend",
        uid: "00005",
        name: "王大大",
        imgUrl: "../images/emsg-example-user04.jpg",
        hasRead: true,
        date: mini.formatDate(new Date(), "MM-dd HH:mm"),
        message: "此处显示最新一条微讯的文字信息，保持与MSG端的信息同步"
    }];
    $.each(recentSession, function (i, e) {
        e.sessionId = "S" + EmsgConfig.uid + "_" + e.uid;
        if (e.type == "group") {
            e.sessionId = "S" + "_" + e.uid;
            e.name = "网站与前端研发部" + Math.floor(Math.random() * 100);
        }
    });
    return {
        sessionlist: recentSession
    };
});


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
                }, {
                    id: '00005',
                    name: "王大大" + key,
                    isLeaf: true
                }]

            }, {
                id: '20000',
                name: "开发2部",
                children: [{
                    id: '20001',
                    name: "张三(开发2部)" + key,
                    isLeaf: true
                }, {
                    id: '20003',
                    name: "李四(开发2部)" + key,
                    isLeaf: true
                }]
            }, ];
            return;
        }
        if (!id) {
            this.responseText = [{
                id: '1',
                name: "开发1部",
                isLeaf: false
            }, {
                id: '2',
                name: "开发2部",
                isLeaf: false
            }, {
                id: '3',
                name: "开发3部",
                isLeaf: false
            }];
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
                    }, {
                        guid: '1000112',
                        name: "程序员2",
                    }, {
                        guid: '1000113',
                        name: "程序员3",
                    }, {
                        guid: '1000114',
                        name: "程序员4",
                    }]

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
            }, {
                guid: '10002',
                name: "政务服务研发群"
            }]

        }, {
            guid: '20000',
            name: "实施部",
            items: [{
                guid: '20001',
                name: "实施一部"
            }, {
                guid: '20003',
                name: "实施二部"
            }]
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
});



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
                            imgUrl: "../images/emsg-example-user02.jpg",
                        }, {
                            uid: "00003",
                            name: "张三",
                            imgUrl: "../images/emsg-example-user13.jpg",
                        }, {
                            uid: "00004",
                            name: "徐立",
                            imgUrl: "../images/emsg-example-user03.jpg",
                        }, {
                            uid: "00005",
                            name: "王大大",
                            imgUrl: "../images/emsg-example-user04.jpg",
                        }]
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
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

Mock.mock(new RegExp('eleeditaction'), function (opt) {
    // console.log('============================');
    console.log('元件编辑');
    var data = Mock.mock({
        status: {
            code: 200
        },
        controls: [
            {id: 'maxStart', value: "24"},
            {id: 'maxEnd', value: "6"},
            {id: 'minStart', value: "4"},
            {id: 'minEnd', value: "4"},
            {id: 'linkOpenType', value: "tabsNav"},
            {id: 'themeCheck', value: "true"},
            {id: 'border', value: "0"},
            {id: 'borderColor', value: "#fff"},
            {id: 'bg', value: "#fff"},
            {id: 'shadow', value: "#fff"},
            {id: 'radius', value: "0"},
            {id: 'showHeader', value: "true"},
            {id: 'title', value: ""},
            {id: 'titleBorder', value: "0"},
            {id: 'titleColor', value: "#333"},
            {id: 'titleBgColor', value: "#fff"},
            {id: 'icon', value: "/framemanager/ui/elements/icons/f9mod-100.svg"},
            {id: 'iconColor', value: "#333"},
            {id: 'addUrl', value: "http://www.baidu.com"},
            {id: 'showRefreshBtn', value: true},
            {id: 'showMoreBtn', value: true},
            {id: 'showAddBtn', value: true},
            {id: 'visible', value: "true"}
        ],  
        'custom': {
            column: {
                columnId: "2",
                columnName: "栏目名称",
                columnUrl: "../../elements/todo/show.proto.html", // 栏目地址
                isDiy: false,
                columnItems: [
                    {
                        id: "11",
                        name: "待办",
                        url: "子栏目地址",
                        isDiy: false,
                        default: true, // 是否默认
                        showNum: false,
                        sort: "1"
                    },
                    {
                        id: "22",
                        name: "已办",
                        url: "子栏目地址",
                        isDiy: false,
                        default: false, // 是否默认
                        showNum: false,
                        sort: "2"
                    }
                ]
            }
            
        }
    });
    return data;
});



Mock.mock(new RegExp('eleeditactionsave'), function (opt) {
    // console.log('============================');
    console.log('元件保存');
    console.log(opt)
    // var params = getDataFromBody(decodeURIComponent(opt.body));

    var data = Mock.mock({
        status: {
            code: 200
        },
        controls: [
            {id: 'maxStart', value: "24"},
            {id: 'maxEnd', value: "6"},
            {id: 'minStart', value: "4"},
            {id: 'minEnd', value: "4"},
            {id: 'linkOpenType', value: "tabsNav"},
            {id: 'themeCheck', value: "true"},
            {id: 'border', value: "0"},
            {id: 'borderColor', value: "#fff"},
            {id: 'bg', value: "#fff"},
            {id: 'shadow', value: "#fff"},
            {id: 'radius', value: "0"},
            {id: 'showHeader', value: "true"},
            {id: 'title', value: ""},
            {id: 'titleBgColor', value: "#fff"},
            {id: 'titleColor', value: "#333"},
            {id: 'iconColor', value: "#333"},
            {id: 'showRefreshBtn', value: "true"},
            {id: 'showMoreBtn', value: "true"},
            {id: 'showAddBtn', value: "false"},
            {id: 'add', value: "2"},
            {id: 'column', value: "dialog"}
        ],
        'custom': {
            column: {
                columnId: "",
                columnName: "",
                columnUrl: "", // 栏目地址
                isDiy: true,
                columnItems: [
                    {
                        id: "",
                        name: "待办", // 名称
                        url: "地址", // 值
                        default: "true",
                        sort: "1",
                        isDiy: false,
                        showNum: false
                    }
                ]
            }
        }
    });
    return data;
});


Mock.mock(new RegExp('elementsave'), function (opt) {
    return true;
})
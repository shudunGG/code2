// var Util = {
//     getRightUrl: function(url) {
//         return url;
//     }
// }
function getQueryStriong(url) {
    url = url.split('?')[1];
    var qs = (url.length > 0 ? url : ""),
        args = {},
        items = qs.length ? qs.split("&") : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
    for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }

    return args;
}

Mock.mock(/test\/getData/, function (opt) {
    var nodeDataArray = [{
            key: 1,
            category: "start",
            text: "当前任务",
            hasChild: true,
            // line: 1
        },
        {
            key: 2,
            text: "任务名称两行显示示显示显示显示124",
            status: 0,
            hasChild: true,
            // line: 2
        },
        {
            key: 3,
            text: "Parts and Services",
            status: 1,
            hasChild: false
        },
        {
            key: 4,
            text: "Representative",
            status: 3,
            hasChild: false,
            // line: 2
        },
        {
            key: 5,
            text: "Compact",
            status: 3,
            hasChild: true
        },
        {
            key: 6,
            text: "Mid-Size",
            status: 3,
            hasChild: false,
            // line: 3

        },
        {
            key: 7,
            text: "Large",
            status: 2,
            hasChild: true,
            // line: 3
        },
        {
            key: 8,
            text: "Maintenance",
            status: 2,
            hasChild: false
        },
        {
            key: 9,
            text: "Repairs",
            status: 2,
            hasChild: false
        },
        {
            key: 10,
            text: "State Inspection",
            status: 2,
            hasChild: false
        },
        {
            key: 11,
            text: "SUV",
            status: 2,
            hasChild: true
        },
        {
            key: 12,
            text: "Van",
            status: 3,
            hasChild: false
        },
        {
            key: 13,
            text: "Test1",
            status: 3,
            hasChild: true,
            line: 3
        },
        {
            key: 14,
            text: "Test2",
            status: 3,
            hasChild: true
        }
    ];
    var linkDataArray = [{
            from: 1,
            to: 2,
            status: 0 // to节点的status
        },
        {
            from: 1,
            to: 4,
            status: 3
        },
        {
            from: 11,
            to: 5,
            status: 3
        },
        {
            from: 5,
            to: 3,
            status: 3
        },
        {
            from: 11,
            to: 8,
            status: 2
        },
        {
            from: 2,
            to: 6,
            status: 2
        },
        {
            from: 2,
            to: 7,
            status: 2
        },
        {
            from: 7,
            to: 11,
            status: 2
        },
        {
            from: 7,
            to: 12,
            status: 3
        },
        {
            from: 4,
            to: 13,
            status: 3
        },
        {
            from: 13,
            to: 14,
            status: 3
        },
        {
            from: 14,
            to: 9,
            status: 3
        },
        {
            from: 14,
            to: 10,
            status: 3
        }
    ];
    var data = {
        "custom": {
            "nodeDataArray": nodeDataArray,
            "linkDataArray": linkDataArray
        }
    };
    return data;
})

// https://fe.epoint.com.cn/showdoc/web/#/4?page_id=39
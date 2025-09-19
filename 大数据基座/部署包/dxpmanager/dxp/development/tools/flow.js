//左侧菜单接口数据
Mock.mock(Util.getRightUrl("test/leftMenu"), function(opt) {
    var emt = opt.body,
        content;
    var newTable = {
        custom: {
            navList: [
                {
                    name: "通用组件",
                    typeicon: "images/add-icon/flow.png",
                    list: [
                        {
                            name: "开始",
                            guid: Mock.mock("@guid"),
                            iconsmall: "images/add-icon/start-icon.png",
                            icon: "images/icon/start-icon.png",
                            url: "",
                            maxLinks : "",
                            type: "com.epoint.dxp.development.flow.steps.StartEntryStep",
                            introduce: "开始组件",
                            banwrong:1
                        },
                        {
                            name: "结束",
                            guid: Mock.mock("@guid"),
                            iconsmall: "images/add-icon/end-icon.png",
                            icon: "images/icon/end-icon.png",
                            url: "",
                            maxLinks : "1",
                            type: "com.epoint.dxp.development.flow.steps.SuccessEntryStep",
                            introduce: "结束组件",
                            banwrong:1
                        }
                    ]
                },
                {
                    name: "条件组件",
                    typeicon: "images/add-icon/flow.png",
                    list: [
                        {
                            name: "检验字段的值",
                            guid: Mock.mock("@guid"),
                            iconsmall: "images/add-icon/checkvalue-icon.png",
                            icon: "images/icon/checkvalue-icon.png",
                            url: "./jobassembly/simpleevalentry.html",
                            type: "com.epoint.dxp.development.flow.steps.SimpleEvalEntryStep",
                            introduce: "检验字段的值",
                        }
                    ]
                },
                {
                    name: "文件传输",
                    typeicon: "images/add-icon/flow.png",
                    list: [
                        {
                            name: "sftp文件同步",
                            guid: Mock.mock("@guid"),
                            iconsmall: "images/add-icon/checkvalue-icon.png",
                            icon: "images/icon/checkvalue-icon.png",
                            url: "./jobassembly/sftpsync.html",
                            type: "com.epoint.dxp.development.flow.steps.SFTPSyncStep",
                            introduce: "sftp文件同步",
                        },
                        {
                            name: "hadoopCopyFiles",
                            guid: Mock.mock("@guid"),
                            iconsmall: "images/add-icon/checkvalue-icon.png",
                            icon: "images/icon/checkvalue-icon.png",
                            url: "./jobassembly/hadoopcopyfiles.html",
                            type: "com.epoint.dxp.development.flow.steps.HadoopCopyFilesStep",
                            introduce: "hadoopCopyFiles",
                        }
                    ]
                }
            ]
        }
    };
    
    var navList = newTable.custom.navList.slice(0);
    
    Util.ajax({
        url: getLeftTransMenu,
        async:false,
        success: function(res) {
        	navList.push(res);
        	newTable.custom.navList = navList;
        }
    });
    return newTable;
});

//load
Mock.mock(Util.getRightUrl("test/getDesignById"), function(opt) {
    var emt = opt.body,
        content;
    console.log(opt);
    var query = emt.split("departId=")[1];
    console.log(query);

    var data = {
        custom: {
            data: {
                class: "go.GraphLinksModel",
                linkFromPortIdProperty: "fromPort",
                linkToPortIdProperty: "toPort",
                nodeDataArray: [
                    {
                        key: "Aa65ee50-7eAD-Ae3e-c31d-121A4f57D4BB",
                        type: "3873FD06-F21C-AeF5-Bd6F-45FBE4Ee9f1C",
                        name: "Excel输入",
                        url: "./edit.html",
                        icon: "images/icon/excel-icon.png",
                        maxLinks: "",
                        loc: "-253 -70",
                        id: "",
                        linksQueue: '["ABc9F77C-15ef-34C2-C6A2-e424234fd0E7"]'
                    },
                    {
                        key: "ABc9F77C-15ef-34C2-C6A2-e424234fd0E7",
                        type: "1218cfd5-8f6e-A8D3-7f5e-fDC9EF324Edf",
                        name: "GetdataformXML",
                        url: "./edit.html",
                        icon: "images/icon/getdata.png",
                        maxLinks: "",
                        loc: "5 -73",
                        id: "",
                        linksQueue: '["Aa65ee50-7eAD-Ae3e-c31d-121A4f57D4BB"]'
                    }
                ],
                linkDataArray: [
                    {
                        from: "Aa65ee50-7eAD-Ae3e-c31d-121A4f57D4BB",
                        to: "ABc9F77C-15ef-34C2-C6A2-e424234fd0E7",
                        type: "main",
                        color: "#2590eb",
                        points: [
                            -222.0000337986278,
                            -70.36046472327178,
                            -24.999966201372185,
                            -72.65116318370497
                        ]
                    }
                ],
                name: "涉毒人员警情分析", // 作品名称
                description: "涉毒人员警情分析描述描述描述" // 作品描述
            },        
        }
    };
    return data;
});

function GetQueryString(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.substr(0).match(reg);
    var context = "";
    if (r != null) context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined"
        ? ""
        : context;
}

// 运行接口
Mock.mock(Util.getRightUrl("test/logDataUrl"), function(opt) {
    var emt = opt.body,
        content;

    var newData = JSON.parse(decodeURIComponent(emt).split("=")[1]);

    // 生成随机数
    function randNum(m, n) {
        if (!n) {
            return Math.floor(Math.random() * m);
        }
        var c = n - m + 1;
        return Math.floor(Math.random() * c + m);
    }

    var mockIndex = randNum(2, 6);

    if (mockIndex == 5) {
        newData.complete = true;
    } else {
        newData.complete = false;
    }

    $.each(newData.nodeDataArray, function(i, item) {
        if (i % 2 == 0) {
            item.success = true;
            item.successicon = "images/success-icon.png";
            item.time = "2分01秒";
        } else {
            item.success = false;
            item.successicon = "images/fail-icon.png";
            item.time = "2分01秒";
        }
    });

    mockJson = {
        custom: newData
    };

    return mockJson;
});


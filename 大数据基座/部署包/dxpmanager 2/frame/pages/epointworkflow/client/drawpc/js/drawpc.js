var $header = $('#header'),
    $rangeScale = $('#range-scale'),  //放大缩小
    $myOverviewDiv = $('#myOverviewDiv'),//鸟瞰图
    $nameTip = $('#name-tip');


var cacheData = '';  //缓存数据


var cacheRequest = {};  //缓存ajax

var myDiagram;

var Util = {};
Util.ajax = function (opt) {
    if (typeof opt != 'object') {
        console.warning('ajax 请求参数为对象格式');
        return false;
    }
    console.log(opt);

    var data = opt.data || '',
        url = opt.url,
        success = opt.success;

    //      if(typeof data == 'object') {
    //        data = JSON.stringify(data);
    //      }

    if (!cacheRequest[url]) {
        cacheRequest[url] = {};
    }
    if (!cacheRequest[url][data]) {
        cacheRequest[url][data] = {
            hasEnd: true
        }
    }


    if (cacheRequest[url][data].hasEnd) {
        cacheRequest[url][data].hasEnd = false;
        $.ajax({
            type: 'POST',
            data: data,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: 'json',
            url: url,
            success: function (res) {
                if (typeof success == 'function') {
                    success(res);
                }
            }
        }).always(function () {
            console.warn('请求结束');
            cacheRequest[url][data].hasEnd = true;
        });
    } else {
        console.error('该请求正在发送，请勿多次操作');
    }

};

// 获取url参数
Util.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var context = "";
    if (r != null) context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
};

Util.getRightUrl = function (url, epointUrl) {
    if (!url)
        return '';

    // 是否是相对路径
    var isRelative = url.indexOf('./') != -1 || url.indexOf('../') != -1;

    // 全路径、相对路径直接返回
    if (/^(http|https|ftp)/g.test(url) || isRelative) {
        url = url;
    } else if (epointUrl
        && epointUrl.substr(epointUrl.length - 1, 1) == '/') {
        url = epointUrl + url;
    } else if (epointUrl
        && epointUrl.substr(epointUrl.length - 1, 1) != '/') {
        url = epointUrl + '/' + url;
    } else {
        url = Util.getRootPath() + url;
    }
    return url;
};

//返回完整的WebContent根路径
Util.getRootPath = function () {
    var loc = window.location, host = loc.hostname, protocol = loc.protocol, port = loc.port
        ? (':' + loc.port)
        : '', path = (Util._rootPath != undefined
            ? Util._rootPath
            : ('/' + loc.pathname.split('/')[1]))
            + '/';

    var rootPath = protocol + '//' + host + port + path;

    return rootPath;
};

Util._rootPath = (function () {
    var path = location.pathname;
    if (path.indexOf('/') === 0) {
        path = path.substring(1);
    }
    return '/' + path.split('/')[0];
}());


    //流程图
    (function (win, _$) {


        function init(nodeList) {
            if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make; // for conciseness in defining templates
            //初始化整个流程图
            myDiagram =
                $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
                    {
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                        autoScrollRegion: 0,
                        hasVerticalScrollbar: false,
                        hasHorizontalScrollbar: false,//滚动条隐藏
                        initialDocumentSpot: go.Spot.TopCenter,
                        initialViewportSpot: go.Spot.TopCenter,

                        // initialContentAlignment: go.Spot.Center,
                        allowDrop: false, // must be true to accept drops from the Palette
                        allowCopy: false,
                        allowMove: false,
                        allowRelink: false,
                        allowReshape: false,
                        allowResize: false,

                        // "LinkDrawn": showLinkLabel, // this DiagramEvent listener is defined below
                        //"LinkRelinked": showLinkLabel,
                        scrollsPageOnFocus: false,
                        // "removeModelChanged": function(e) {
                        //   console.log('remove')
                        //   console.log(e)
                        //  },
                        "undoManager.isEnabled": false // enable undo & redo
                    });

            // myDiagram.toolManager.mouseDownTools.add($(LinkShiftingTool));
            // when the document is modified, add a "*" to the title and enable the "Save" button


            //节点部分样式
            function nodeStyle() {
                return [
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
                        locationSpot: go.Spot.LeftCenter
                    }
                ];
            }

            //图标设置
            function findIconImg(icon) {
                //if (key < 0 || key > 16) return "images/HSnopic.png"; // There are only 16 images on the server
                if (!icon) return './css/images/1.jpg';
                return "./css/images/" + icon + ".jpg"
            }

            function changeIcon(detail) {
                if (detail && detail.transactor) {
                    return './css/images/icon_down.png';
                }
            }

            //1-完成,2-未完成, 3-进行中, 4-超时（老的）
            // 1 未开始， 2 待办理, 3 已完成, 4 超时
            function changeFill(status) {
                var color = '';
                if (status == 1) {
                    color = '#5498d7';
                } else if (status == 2) {
                    color = '#5bafa4';
                } else if (status == 3) {
                    color = '#a194c4';
                } else if (status == 4) {
                    color = '#cdb15d';
                } else if (status == 5) {
                    color = '#dc7463';
                }
                return color;
            };

            //定义节点模板，可添加多个
            var lightText = '#666666';


            myDiagram.nodeTemplate =  // the default category
                $(go.Node, "Spot", nodeStyle(), {
                    selectionAdorned: false
                    // resizable: true,
                },new go.Binding('visible', 'display',function(n) {
                    return n=='true'? true: false;
                }),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, "Auto",
                        $(go.Shape, "Border",
                            {
                                height: 40,
                                portId: '',
                                desiredSize: new go.Size(140, 40),
                                fill: "#66c06c",
                                stroke: '#b9bec5',
                                strokeWidth: 0
                            },
                            new go.Binding("fill", "status", changeFill),
                            new go.Binding('category', "category"),
                            new go.Binding("desiredSize", "visible", function (v, node) {
                                if (v) {
                                    return new go.Size(140, 40);
                                } else {
                                    return new go.Size(140, 40);

                                }
                            }).ofObject("LIST")
                        ),
                        $(go.Panel, 'Vertical',
                            {
                                name: 'INFO'
                            },
                            $(go.Panel, 'Horizontal',
                                $(go.Picture,
                                    {
                                        name: "Picture",
                                        desiredSize: new go.Size(16, 16),
                                        margin: new go.Margin(10, 4, 10, 10),
                                        cursor: "pointer"
                                    },
                                    new go.Binding("source", "icon", findIconImg)
                                ),
                                $(go.TextBlock,
                                    {
                                        font: "normal 14px Microsoft YaHei,Helvetica, Arial, sans-serif",
                                        stroke: '#fff',
                                        margin: new go.Margin(10, 10, 10, 0),
                                        desiredSize: new go.Size(85, NaN),
                                        minSize: new go.Size(85, NaN),
                                        wrap: go.TextBlock.WrapFit,
                                        editable: false,
                                        cursor: "pointer"
                                    },
                                    new go.Binding("text", "name").makeTwoWay()
                                )
                            )
                        ),
                        {
                            mouseEnter: function (e, obj) {
                                if (obj.part.data && obj.part.data.key) {
                                    showFlowList(e, obj.part.data);
                                }
                            }
                        }
                    )
                );


            myDiagram.groupTemplate =
                $(go.Group, "Vertical",
                    {
                        selectionObjectName: "PANEL",  // selection handle goes around shape, not label
                        ungroupable: true,
                        selectionAdorned: false
                    },  // enable Ctrl-Shift-G to ungroup a selected Group
                    $(go.Panel, "Auto",
                        { name: "PANEL" },
                        $(go.Shape, "Rectangle",  // the rectangular shape around the members
                            {
                                fill: null, stroke: "gray", strokeWidth: 0,
                                portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
                                // allow all kinds of links from and to this port
                                fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                                toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                            }),
                        $(go.Placeholder, { margin: 0, background: "transparent" })  // represents where the members are
                    ),
                    $(go.Panel, "Auto",
                        $(go.Shape, "Border",  // the rectangular shape around the members
                            {
                                fill: '#fff', 
                                stroke: "#b2c9ec", 
                                strokeWidth: 1,
                                desiredSize: new go.Size(139, 24),
                                margin: new go.Margin(-1,0,0,0),
                                cursor: "pointer"
                            },
                            new go.Binding("stroke", "status", changeFill)
                            ),
                    $(go.TextBlock, {
                        name: "title",
                        visible: true,
                        margin: 5,//new go.Margin(6, 0, 0, 0),
                        font: "normal 12px Microsoft YaHei",
                        isMultiline: false, // don't allow newlines in text
                        editable: false, // allow in-place editing by user
                        stroke: '#666'
                    },
                        new go.Binding('tempText', "name"),
                        new go.Binding("text", "name", function (val) {
                            var _arr = [];
                            if (val) {
                                _arr = val.split(',');
                                if (_arr.length > 1) {
                                    return _arr[0] + '…';
                                } else {
                                    return _arr[0];
                                }
                            }
                        })
                    ),
                    {
                        mouseEnter: function (e, obj) {
                            var _text = obj.part.findObject('title').tempText;
                            var _arr = [];
                            if (_text) {
                                _arr = _text.split(',');
                                if (_arr.length > 1) {
                                    // obj.part.findObject('title').text = _text;
                                    showLabel(e,_text);
                                } else {
                                    return false;
                                }
                            }
                        },
                        mouseLeave: function (e, obj) {
                            var _text = obj.part.findObject('title').tempText;
                            var _arr = [];

                            if (_text) {
                                var _result = '';
                                _arr = _text.split(',');

                                if (_arr.length > 1) {
                                    // _result = _arr[0] + '…';
                                    $nameTip.hide();
                                } else {
                                    _result = _arr[0];
                                }
                                // obj.part.findObject('title').text = _result;
                            }
                        }
                    }

                )
                );

            myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
                cacheData = e.subject.part.data;    //e.subject.part.data即获取到的data
            });

            myDiagram.addDiagramListener("AnimationFinished", function (e) {
                _$('#myDiagramDiv').css('visibility', 'visible');
            });
            //定义连线模板
            myDiagram.linkTemplate =
                $(go.Link, // the whole link panel
                    {
                        routing: go.Link.Orthogonal,
                        // curve: go.Link.JumpOver,
                        corner: 0,
                        toShortLength: 4,
                        relinkableFrom: false,
                        relinkableTo: false,
                        reshapable: false,
                        selectionAdorned: false,
                        resegmentable: false,
                    },
                    new go.Binding("points").makeTwoWay(),
                    $(go.Shape, // the highlight shape, normally transparent
                        {
                            isPanelMain: true,
                            strokeWidth: 4,
                            stroke: "transparent",
                            name: "HIGHLIGHT"
                        }),
                    $(go.Shape, // the link path shape
                        {
                            isPanelMain: true,
                            // stroke: "#525c6f",
                            strokeWidth: 2
                        },
                        new go.Binding('stroke', 'isdone', function (v) {
                            return v ? '#68b6ff' : '#525c6f';
                        })),
                    $(go.Shape, // the arrowhead
                        {
                            toArrow: "standard",
                            stroke: null,
                            // fill: "gray"
                        }, new go.Binding('fill', 'isdone', function (v) {
                            return v ? '#68b6ff' : '#525c6f';
                        }))
                );

            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
            }
            load();  // load an initial diagram from some JSON text

            //初始化鸟瞰图
            myOverview =
                $(go.Overview, "myOverviewDiv",
                    { observed: myDiagram, maxScale: 0.5 });

            // change color of viewport border in Overview
            myOverview.box.elt(0).stroke = "#2590eb";
            myOverview.box.elt(0).fill = "rgba(77,139,235,.35)";



        } // end init

        function load() {
            var pid = Util.getQueryString('pid') || '';
            top.Util.ajax({
                url: Util.getRightUrl(apiConfig.flowData, ""),
                data: {
                    processVersionInstanceGuid: Util.getQueryString('processVersionInstanceGuid')
                },
                success: function (res) {

                    /*if (typeof res.custom === 'string') {
                        res = JSON.parse(res.custom);
                    }*/
                    
                    console.log(res);
                    if(res.wfprops && res.wfprops.hidecategory) {
                        var _hidecategory = res.wfprops.hidecategory;
                        var hidecategoryList = _hidecategory.split(';');
                        //
                    }
                    var nodeSum = res.nodedataarray.length;

                    //处理数据添加group及处理者标题
                    res.nodedataarray.forEach(function (item, index) {
                        // item.isGroup = true;

                        if (item.detail && item.detail.transactor) {
                            var handleArr = item.detail;


                            var newkey = index + parseInt(nodeSum);
                            item.group = newkey;

                            res.nodedataarray.push({
                                key: newkey,
                                name: item.detail.transactor || '',
                                status: item.status,
                                isGroup: true
                            })
                        }
                    });

                    if (res) {
                        var renderData = {
                            "class": "go.GraphLinksModel",
                            "linkFromPortIdProperty": "fromPort",
                            "linkToPortIdProperty": "toPort",
                            "nodeDataArray": res.nodedataarray,
                            "linkDataArray": res.linkdataarray
                        }
                        myDiagram.model = go.Model.fromJson(renderData);

                        // _$('#myDiagramDiv').css('visibility','visible');
                    }
                }
            })
        }

        //数组某字段转字符串
        function formArr2Str(arr, key) {
            var _arr = [];

            for (var i = 0, len = arr.length; i < len; i++) {
                _arr.push(arr[i][key]);
            }

            return _arr.join(',');
        }

        init();

    })(window, jQuery);

//其他事件
(function (win, $) {
    var $flowList = $("#flow-list");

    var $flowListName = $('#flow-list-name'),
        $pageDetail = $('#page-detail');

    $rangeScale.jRange({
        from: 0.1,
        to: 10.0,
        step: 0.1,
        scale: [],
        format: '%s',
        width: 100,
        showLabels: false,
        snap: true
    });

    /**
     * [renderTipSite 确定tip提示框的位置]
     * @param  {[type]} $item [鼠标所在的元素]
     * @param  {[type]} $tip  [tip元素]
     * @param  {[type]} C_POS [常量偏移量]
     * @return {[type]}       [description]
     */
    var renderTipSite = function (mouse, $tip, C_POS,isname) {
        var itemHeight = 42,
            itemWidth = 20,

            docWidth = $(window).width(),
            docHeight = $(window).height(),

            tipWidth = $tip.outerWidth(),
            tipHeight = $tip.outerHeight(),

            site = {
                x: mouse.x + itemWidth,
                y: mouse.y + (isname ? 5 : itemHeight)
            };


        if (mouse.x + C_POS + tipWidth > docWidth) {
            site.x = docWidth - tipWidth - C_POS;
        }

        if (mouse.y + C_POS + tipHeight > docHeight) {
            site.y = docHeight - C_POS - tipHeight;
        }

        return site;
    };

    //加载iframe
    var cacheKey = '';
    win.showFlowList = function (e, data) {
        $nameTip.hide();
        if (!data.detail || !data.detail.url) {
            $flowList.hide();
            return false;
        }

        if (cacheKey != data.key) {
            $flowListName.text(data.name);
            // $pageDetail.src= "activityinstanceinfobrowser?processVersionInstanceGuid=" + ProcessVersionInstanceGuid + "&activityInstanceGuid=" + Arry[1] + "&mode=" + mode;
            // $pageDetail.attr('src',"test/test"+data.key+".html");
            if (data.detail.url) {
                $pageDetail.attr('src', data.detail.url);
            }
            cacheKey = data.key;
        }

        var mousePt = myDiagram.lastInput.viewPoint;


        $flowList.show();

        var site = renderTipSite(mousePt, $flowList, 10);

        $flowList.css({
            "left": site.x + 'px',
            "top": site.y + 'px'
        })
    };

    win.showLabel = function(e, data) {
        $flowList.hide();
        if(!data) {
            $nameTip.hide();
            return false;
        }
        $nameTip.text(data);
        
        var mousePt = myDiagram.lastInput.viewPoint;

        $nameTip.show();

        var site = renderTipSite(mousePt, $nameTip, 10, true);

        $nameTip.css({
            "left": site.x +'px',
            "top": site.y + 'px'
        })
    };

    $(document).on('click', '#myDiagramDiv', function () {
        $('#flow-list').hide();
    }).on('click', '.flow-list-close', function () {
        $('#flow-list').hide();
    });

    //按钮
    $header.on('click', '.icon-item', function () {
        var $this = $(this),
            type = $this.data('type');

        switch (type) {
            case 'max':
                // $rangeScale.val() += 0.2;
                if (myDiagram.scale < 10) {
                    myDiagram.scale += .1;

                    $rangeScale.jRange('setValue', myDiagram.scale + '');
                }

                break;
            case 'min':
                if (myDiagram.scale > 0.1) {
                    myDiagram.scale -= .1;
                    $rangeScale.jRange('setValue', myDiagram.scale + '');
                }
                break;
            case 'view':
                $this.toggleClass('active');
                $myOverviewDiv.toggleClass('active');
                break;

            case 'handler':
                myDiagram.groupTemplate.findObject('title').visible = !myDiagram.groupTemplate.findObject('title').visible;
            // myDiagram.groupTemplate.findObject('LIST').visible = !myDiagram.groupTemplate.findObject('LIST').visible; 
            // myDiagram.nodeTemplate.findObject("arrowPic").source = './css/images/icon_up.png';
            //myDiagram.rebuildParts();
            default:
                break;
        }
    }).on('change', '#range-scale', function () {
        myDiagram.scale = + $(this).val();
    });

})(window, jQuery);
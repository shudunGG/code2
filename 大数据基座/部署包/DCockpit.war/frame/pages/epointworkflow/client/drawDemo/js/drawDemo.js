var $attrPanel = jQuery('#attr-panel'),
    $attrIframe = jQuery('#attr-iframe'),
    $attrName = $('.attr-name', $attrPanel),
    $header = $('#header'),
    $rangeScale = $('#range-scale'),  //放大缩小
    $myOverviewDiv = $('#myOverviewDiv'),//鸟瞰图
    $cover = $('#cover'),
    $moduleUl = $('#module-ul'), //模板列表
    $nameTip = $('#name-tip');

var selectedObj = '';//选择的节点对象或者连线

var LEFT_WIDTH = 170;

var cacheData = '',  //缓存数据
    attrType = 1; //打开节点属性的类型 1表示拖拽，2表示右键
var tempValueData = {};	//临时缓存，用于存储服务端三个对象
var cacheRequest = {};  //缓存ajax

var myDiagram;

var Util = {};
Util.ajax = function (opt) {
    if (typeof opt != 'object') {
        console.warning('ajax 请求参数为对象格式');
        return false;
    }
    // console.log(opt);

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
//url 为?后面的
Util.getQueryString = function (name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        _url = url ? url : window.location.search;
    var r = _url.substr(1).match(reg);
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


/**
 * [renderTipSite 确定tip提示框的位置]
 * @param  {[type]} $item [鼠标所在的元素]
 * @param  {[type]} $tip  [tip元素]
 * @param  {[type]} C_POS [常量偏移量]
 * @return {[type]}       [description]
 */

var renderTipSite = function(mouse, $tip, C_POS) {
        var itemHeight = 42,
            itemWidth = 20,

            docWidth = $(window).width(),
            docHeight = $(window).height(),

            tipWidth = $tip.outerWidth(),
            tipHeight = $tip.outerHeight(),
        
            site = {
                x: mouse.x + itemWidth + 170, // 170为左侧模板宽度
                y: mouse.y + itemHeight + 10
            };

            // console.log(tipHeight);
            if(mouse.x + C_POS + tipWidth + 170 > docWidth) {
                site.x = docWidth - tipWidth - C_POS;
            }

            if(mouse.y + C_POS + tipHeight + 50 > docHeight) {
                site.y = docHeight - C_POS - tipHeight;
            }

            return site;
    };
	
	(function(win, $){
		// Create Base64 Objectvar
		win.Base64 = {
		  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		  encode: function (e) {
			var t = "";
			var n, r, i, s, o, u, a;
			var f = 0;
			e = Base64._utf8_encode(e);
			while (f < e.length) {
			  n = e.charCodeAt(f++);
			  r = e.charCodeAt(f++);
			  i = e.charCodeAt(f++);
			  s = n >> 2;
			  o = (n & 3) << 4 | r >> 4;
			  u = (r & 15) << 2 | i >> 6;
			  a = i & 63;
			  if (isNaN(r)) {
				u = a = 64
			  } else if (isNaN(i)) {
				a = 64
			  }
			  t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
			}
			return t
		  },
		  decode: function (e) {
			var t = "";
			var n, r, i;
			var s, o, u, a;
			var f = 0;
			e = e.replace(/[^A-Za-z0-9+/=]/g, "");
			while (f < e.length) {
			  s = this._keyStr.indexOf(e.charAt(f++));
			  o = this._keyStr.indexOf(e.charAt(f++));
			  u = this._keyStr.indexOf(e.charAt(f++));
			  a = this._keyStr.indexOf(e.charAt(f++));
			  n = s << 2 | o >> 4;
			  r = (o & 15) << 4 | u >> 2;
			  i = (u & 3) << 6 | a;
			  t = t + String.fromCharCode(n);
			  if (u != 64) {
				t = t + String.fromCharCode(r)
			  }
			  if (a != 64) {
				t = t + String.fromCharCode(i)
			  }
			}
			t = Base64._utf8_decode(t);
			return t
		  }, _utf8_encode: function (e) {
			e = e.replace(/rn/g, "n");
			var t = "";
			for (var n = 0; n < e.length; n++) {
			  var r = e.charCodeAt(n);
			  if (r < 128) {
				t += String.fromCharCode(r)
			  } else if (r > 127 && r < 2048) {
				t += String.fromCharCode(r >> 6 | 192);
				t += String.fromCharCode(r & 63 | 128)
			  } else {
				t += String.fromCharCode(r >> 12 | 224);
				t += String.fromCharCode(r >> 6 & 63 | 128);
				t += String.fromCharCode(r & 63 | 128)
			  }
			}
			return t
		  }, _utf8_decode: function (e) {
			var t = "";
			var n = 0;
			var r = c1 = c2 = 0;
			while (n < e.length) {
			  r = e.charCodeAt(n);
			  if (r < 128) {
				t += String.fromCharCode(r);
				n++
			  } else if (r > 191 && r < 224) {
				c2 = e.charCodeAt(n + 1);
				t += String.fromCharCode((r & 31) << 6 | c2 & 63);
				n += 2
			  } else {
				c2 = e.charCodeAt(n + 1);
				c3 = e.charCodeAt(n + 2);
				t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
				n += 3
			  }
			}
			return t
		  }
		}
	})(window, jQuery);

    //流程图
    (function (win, _$) {


        function init(nodeList) {
            if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
            var $ = go.GraphObject.make; // for conciseness in defining templates
            var CellSize = new go.Size(20, 20);
            //初始化整个流程图
            myDiagram =
                $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
                    {
                        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                        grid: $(go.Panel, "Grid",
                          { gridCellSize: CellSize },
                          $(go.Shape, "LineH", { stroke: "#efefef" }),
                          $(go.Shape, "LineV", { stroke: "#efefef" })
                        ),
                        "draggingTool.isGridSnapEnabled": true,
                        autoScrollRegion: 0,
                        hasVerticalScrollbar: false,
                        hasHorizontalScrollbar: false,//滚动条隐藏
                        initialContentAlignment: go.Spot.Center,
                        allowDrop: true, // must be true to accept drops from the Palette
                        allowCopy: false,
                        "LinkDrawn": showLinkLabel, // this DiagramEvent listener is defined below
                        "LinkRelinked": showLinkLabel,
                        scrollsPageOnFocus: false,
                        // "removeModelChanged": function(e) {
                        //   console.log('remove')
                        //   console.log(e)
                        //  },
                        "undoManager.isEnabled": true // enable undo & redo
                    });

            myDiagram.toolManager.mouseDownTools.add($(LinkShiftingTool));

            myDiagram.commandHandler.canDeleteSelection = function () {
                return true;
            };

            myDiagram.commandHandler.deleteSelection = function () {
                
                //节点的data属性为null，所以先判断data，有则表示是连线
                if (selectedObj.data && selectedObj.data.from && selectedObj.data.to) {
                    var fromKey = selectedObj.data.from,
                        toKey = selectedObj.data.to;

                    var fromNode = myDiagram.findNodeForKey(fromKey),
                        toNode = myDiagram.findNodeForKey(toKey);

                    //有一端数据里type为1则表示有右键，有右键就不能删
                    if (fromNode.data.info.status == '已流转' || toNode.data.info.status == '已流转') {
                        return false;
                    } else {
                        myDiagram.remove(selectedObj.part);
                        if(selectedObj.data.group) {
                            var transactorInfo = myDiagram.model.findNodeDataForKey(selectedObj.data.group);
                            myDiagram.model.removeNodeData(transactorInfo);
                        }
                        
                    }
                } else if (selectedObj.part && selectedObj.part.data.info.status != '已流转') {
                    //节点，有右键菜单的可以删除
                    myDiagram.remove(selectedObj.part);
                    
                    if(selectedObj.part.data.group) {
                        var transactorInfo = myDiagram.model.findNodeDataForKey(selectedObj.part.data.group);
                        myDiagram.model.removeNodeData(transactorInfo);
                    }
                }
            };

            // when the document is modified, add a "*" to the title and enable the "Save" button
            myDiagram.addDiagramListener("Modified", function (e) {
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });

            //监听节点拖拽的事件
            myDiagram.addModelChangedListener(function (evt) {
                // ignore unimportant Transaction events
                if (!evt.isTransactionFinished) return;
                var txn = evt.object; // a Transaction
                if (txn === null) return;
                // iterate over all of the actual ChangedEvents of the Transaction
                txn.changes.each(function (e) {
                    // ignore any kind of change other than adding/removing a node
                    if (e.modelChange !== "nodeDataArray") return;
                    // record node insertions and removals
                    if (e.change === go.ChangedEvent.Insert) {
                        // console.log(evt.propertyName + " added node with key: " + e.newValue.key);

                        
                        if((e.newValue.key+'').indexOf('group-') < 0) {
                            if (evt.propertyName != 'FinishedUndo') {
                                // console.log(e);

                                cacheData = e.newValue;
                                attrType = 1;
                                $attrName.text(e.newValue.name);
                                $attrIframe.attr('src', e.newValue.url);
                                _$('#cover').show();
                                _$('#attr-panel').addClass('show');
                                
                            } else {
                                //撤销节点，并且删除本地缓存
                            } 
                        }
                        



                    } else if (e.change === go.ChangedEvent.Remove) {
                        console.log(evt.propertyName + " removed node with key: " + e.oldValue.key);
                    }
                });
            });
            // helper definitions for node templates

            //节点部分样式
            function nodeStyle() {
                return [
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
                        locationSpot: go.Spot.LeftCenter,
                        mouseEnter: function (e, obj) {
                            showPorts(obj.part, true);
                        },
                        mouseLeave: function (e, obj) {
                            showPorts(obj.part, false);
                        }
                    }
                ];
            }

            // Define a function for creating a "port" that is normally transparent.
            // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
            // and where the port is positioned on the node, and the boolean "output" and "input" arguments
            // control whether the user can draw links from or to the port.
            function makePort(name, spot, output, input) {
                // the port is basically just a small circle that has a white stroke when it is made visible
                return $(go.Shape, "Circle", {
                    fill: "transparent",
                    stroke: null, // this is changed to "white" in the showPorts function
                    desiredSize: new go.Size(8, 8),
                    alignment: spot,
                    alignmentFocus: spot, // align the port on the main Shape
                    portId: name, // declare this object to be a "port"
                    fromSpot: spot,
                    toSpot: spot, // declare where links may connect at this port
                    fromLinkable: output,
                    toLinkable: input, // declare whether the user may draw links to/from here
                    cursor: "pointer" // show a different cursor to indicate potential link point
                });
            }

            //图标设置
            function findIconImg(icon) {
                //if (key < 0 || key > 16) return "images/HSnopic.png"; // There are only 16 images on the server
                if (!icon) return './css/images/ManuralTemplete.jpg';
                return "./css/images/" + icon + ".jpg"
            }

            //右键菜单
            var cxElement = document.getElementById("contextMenu");

            cxElement.addEventListener("contextmenu", function (e) {
                e.preventDefault();
                return false;
            }, false);

            function showContextMenu(e) {
                console.log('右键菜单');
                // console.log(e.selectionObject.Zd);
                cacheData = e.selectionObject.Zd;
                // console.log(e.selectionObject);
                selectedObj = e.selectionObject;

                myDiagram.select(selectedObj);

                console.log(cacheData)
                if (cacheData.type == 10 || cacheData.type == 20) {
                    return false;
                }
                // console.log("cacheData.info.status=" + cacheData.info.status);
                if (cacheData.info.status == "已流转") {
                    return false;
                }
                cxElement.style.display = "block";
                // console.log(myDiagram.lastInput);

                var mousePt = myDiagram.lastInput.viewPoint;
                cxElement.style.left = mousePt.x + LEFT_WIDTH + "px";
                cxElement.style.top = mousePt.y + "px";
            }

            var myContextMenu = $(go.HTMLInfo, {
                show: showContextMenu,
                mainElement: cxElement
            });

            //定义节点模板，可添加多个
            var lightText = '#666666';

            myDiagram.nodeTemplate =  // the default category
                $(go.Node, "Spot", nodeStyle(), {
                    contextMenu: myContextMenu,
                    selectionAdorned: false
                    // resizable: true,
                },new go.Binding('visible', 'display',function(n) {
                    return n=='true'? true: false;
                }),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    $(go.Panel, "Auto",
                        $(go.Shape, "RoundedRectangle", {
                            minSize: new go.Size(142, 40),
                            maxSize: new go.Size(142, 40),
                            // desiredSize: new go.Size(150, 32),
                            fill: "#fff",
                            stroke: '#b9bec5',
                            strokeWidth: 1
                        }),
                        $(go.Panel, 'Horizontal',
                            $(go.Picture, {
                                name: "Picture",
                                desiredSize: new go.Size(16, 16),
                                margin: new go.Margin(10, 10, 10, 15),
                            },
                                new go.Binding("source", "icon", findIconImg)),
                            $(go.TextBlock, {
                                font: "normal 14px Helvetica, Arial, sans-serif",
                                stroke: lightText,
                                margin: new go.Margin(10, 10, 10, 0),
                                minSize: new go.Size(99, NaN),
                                maxSize: new go.Size(99, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: false
                            },
                                new go.Binding("text", "name").makeTwoWay())
                        ), {
                            click: function (e, node) {
                                selectedObj = node;
                                myDiagram.select(selectedObj.part);
                            },
                            doubleClick: function (e, node) {
                                var _data = node.part.data;
                                if (_data.info.status == "已流转") {
                                    return false;
                                }
                                cacheData = _data;
                                attrType = 2;
                                $attrName.text(_data.name);
                                $cover.show();
                                $attrIframe.attr('src', _data.url);
                                _$('#attr-panel').addClass('show');
                            }
                        }
                    ),
                    // four named ports, one on each side:
                    makePort("T", go.Spot.Top, true, true),
                    makePort("L", go.Spot.Left, true, true),
                    makePort("R", go.Spot.Right, true, true),
                    makePort("B", go.Spot.Bottom, true, true)
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
                                fill: null, 
                                stroke: "gray", 
                                strokeWidth: 0,
                                portId: "", 
                                cursor: "pointer",  // the Shape is the port, not the whole Node
                                // allow all kinds of links from and to this port
                                fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                                toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true
                            }),
                        $(go.Placeholder, { margin: 0, background: "transparent" })  // represents where the members are
                    ),
                    $(go.Panel, "Auto",
                        $(go.Shape, "RoundedRectangle",  // the rectangular shape around the members
                            {
                                fill: '#e8f1ff', 
                                stroke: "#b2c9ec", 
                                strokeWidth: 1,
                                margin: new go.Margin(2,0,0,0),
                                cursor: "pointer"
                            }),
                        $(go.TextBlock, {
                            name: "title",
                            visible: true,
                            margin: 5,//new go.Margin(6, 0, 0, 0),
                            font: "normal 12px Microsoft YaHei",
                            isMultiline: false, // don't allow newlines in text
                            editable: false, // allow in-place editing by user
                            stroke: '#666'
                            
                        },
                            new go.Binding('tempText', "transactor"),
                            new go.Binding("text", "transactor", function (val) {
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
                                // obj.part.findObject('title').background = "#e8f1ff";
                                var _arr = [];
                                if(_text) {
                                    _arr = _text.split(',');
                                    if(_arr.length > 1) {
                                        showLabel(e,_text);
                                        // obj.part.findObject('title').text = _text;
                                    } else {
                                        return false;
                                    }
                                }
                            },
                            mouseLeave: function(e,obj) {
                                var _text = obj.part.findObject('title').tempText;
                                var _arr = [];
                                
                                if (_text) {
                                    var  _result = '';
                                    _arr = _text.split(',');

                                    if (_arr.length > 1) {
                                        //_result = _arr[0] + '…';
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

            myDiagram.nodeTemplate.contextMenu = myContextMenu;

            //定义连线模板
            myDiagram.linkTemplate =
                $(go.Link, // the whole link panel
                    {
                	selectable: true,
                    corner: 20,
                    toShortLength: 0,
                    fromShortLength: 0,
                    fromEndSegmentLength: 0,
                    toEndSegmentLength: 0,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: false,
                    // adjusting: go.Link.Stretch,
                    selectionAdorned: false,
                    resegmentable: true,
                        click: function (e, link) {
                            selectedObj = link;
                        },
                        // mouse-overs subtly highlight links:
                        mouseEnter: function (e, link) {
                            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.1)";
                        },
                        mouseLeave: function (e, link) {
                            link.findObject("HIGHLIGHT").stroke = "transparent";
                        }
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
                            stroke: "#525c6f",
                            strokeWidth: 2
                        }),
                    $(go.Shape, // the arrowhead
                        {
                            toArrow: "standard",
                            stroke: null,
                            fill: "gray"
                        }),
                    $(go.Panel, "Auto", // the link label, normally not visible
                        {
                            visible: false,
                            name: "LABEL",
                            segmentIndex: 2,
                            segmentFraction: 0.5
                        },
                        new go.Binding("visible", "visible").makeTwoWay(),
                        $(go.Shape, "RoundedRectangle", // the label shape
                            {
                                fill: "#F8F8F8",
                                stroke: null
                            }),
                        $(go.TextBlock, "Yes", // the label
                            {
                                textAlign: "center",
                                font: "10pt helvetica, arial, sans-serif",
                                stroke: "#333333",
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                );

            // Make link labels visible if coming out of a "conditional" node.
            // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
            }

            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

            load();  // load an initial diagram from some JSON text

            //初始化左侧面板
            myPalette =
                $(go.Palette, "myPaletteDiv", // must name or refer to the DIV HTML element
                    {
                        nodeTemplate: myDiagram.nodeTemplate,
                        "contextMenuTool.isEnabled": false,
                        allowHorizontalScroll: false,
                        autoScrollRegion: 0,

                        allowVerticalScroll: false,
                        hasVerticalScrollbar: false,
                        hasHorizontalScrollbar: false,//滚动条隐藏

                        scrollsPageOnFocus: false,
                        // nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
                        model: new go.GraphLinksModel(nodeList)
                    });

            //初始化鸟瞰图
            myOverview =
                $(go.Overview, "myOverviewDiv",
                    { observed: myDiagram, maxScale: 0.5 });

            // change color of viewport border in Overview
            myOverview.box.elt(0).stroke = "#2590eb";
            myOverview.box.elt(0).fill = "rgba(77,139,235,.35)";

        } // end init

        // Make all ports on a node visible when the mouse is over the node
        function showPorts(node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function (port) {
                port.stroke = (show ? "#007dfc" : null);
            });
            node.cursor = 'move';
        }


        // Show the diagram's model in JSON format that the user may edit
        /*function save() {
            console.log(myDiagram.model.toJson());
            myDiagram.isModified = false;
        }
        window.save = save;*/

        function load() {
            var pid = Util.getQueryString('pid') || '';//不存在则表示新建
            top.Util.ajax({
                url: Util.getRightUrl(apiConfig.flowData, ""),
                data: {
                    processVersionInstanceGuid: Util.getQueryString('processVersionInstanceGuid')
                },
                success: function (res) {
                    var resAfter;
                    /*if (typeof res.custom === 'string') {
                        resAfter = res;//JSON.parse(res.custom);
                    }*/
                    resAfter = res;
                    resAfter.data["linkFromPortIdProperty"] = "fromPort";
                    resAfter.data["linkToPortIdProperty"] = "toPort";

                    tempValueData["contextDataArray"] = resAfter.data.contextDataArray;
                    tempValueData["eventDataArray"] = resAfter.data.eventDataArray;
                    tempValueData["methodDataArray"] = resAfter.data.methodDataArray;

                    // console.log(resAfter.data);
                    // 添加处理人信息
                    if (resAfter.data.nodeDataArray && resAfter.data.nodeDataArray.length) {

                        $(resAfter.data.nodeDataArray).each(function (index, item) {
                            if(item.info.transactor) {
                                var newkey = 'group-' + item.id;
                                item.group = newkey;
    
                                resAfter.data.nodeDataArray.push({
                                    key: newkey,
                                    transactor: item.info.transactor||'',
                                    isGroup: true
                                })
                            }
                        });
                    }

                    myDiagram.model = go.Model.fromJson(resAfter.data);
                }
            })
            // myDiagram.model = go.Model.fromJson(data);
        }

        // add an SVG rendering of the diagram at the end of this page
        function makeSVG() {
            var svg = myDiagram.makeSvg({
                scale: 0.5
            });
            svg.style.border = "1px solid black";
            obj = document.getElementById("SVGArea");
            obj.appendChild(svg);
            if (obj.children.length > 0) {
                obj.replaceChild(svg, obj.children[0]);
            }
        }

        function loadNodeList() {
        	top.Util.ajax({
                url: Util.getRightUrl(apiConfig.nodeList, ""),
                data: {
                    processVersionInstanceGuid: Util.getQueryString('processVersionInstanceGuid')
                },
                success: function (res) {
                    var resAfter;
                    /*if (typeof res.custom === 'string') {
                        resAfter = JSON.parse(res.custom);
                    }*/
                    resAfter = res;
                    
                    if (resAfter && resAfter.length) {
                        $('#myPaletteDiv').css('height', resAfter.length * 50 + 'px');
                        $('.pannel-node').niceScroll({ cursorwidth: "5px", cursorcolor: "#ccc" });
                        init(resAfter);
                    } else {
                        init();
                    }

                    $('.module-scroll').niceScroll({ cursorwidth: "5px", cursorcolor: "#ccc" });
                }
            })
        }

        loadNodeList();

        //获取模板的列表
        function loadTemplate() {
        	top.Util.ajax({
                url: Util.getRightUrl(apiConfig.templateData, ""),
                data: {
                    templateType: 1,
                    processVersionInstanceGuid: Util.getQueryString('processVersionInstanceGuid')
                },
                success: function (res) {
                	if(res != null && res.length>0){
                		if (typeof res === 'string') {
                            res = JSON.parse(res);
                        }
                        // console.log('loadTemplate');
                        // console.log(res);
                        var listStr = '';
                        //if (typeof res.custom === 'string') {
                            listArr = res;
                        //}
                        i = 0;
                        len = listArr && listArr.length ? listArr.length : 0;

                        for (i; i < len; i++) {
                            var setStr = "<i class='module-item-icon'></i>";
                            //var setStr = listArr[i].showSet ? "<i class='module-item-icon'></i>" : '';
                            listStr += '<li class="module-item" data-id="' + listArr[i].templateguid + '"><p class="module-name">' + listArr[i].templatename +'</p>'+setStr+'</li>';
                        };

                        $moduleUl.html(listStr);
                        // $(".pannel-node").nanoScroller();
                        // $('.palette').niceScroll({ cursorwidth: "5px", cursorcolor: "#ccc" });
                        // $('.palette').niceScroll("#myPaletteDiv");
                	}
                }
            })
        }

        //loadTemplate();
        win.loadTemplate = loadTemplate;

        if (Util.getQueryString('tmp') == 1) {
            loadTemplate();
        } else {
            $('.module-list').hide();
            $('.module').hide();
            $('.node ').addClass('active');
            $('.save-temp-icon').hide();
        }

        //获取模板详情
        function getTempDetail(id, callback) {
        	top.Util.ajax({
                url: Util.getRightUrl(apiConfig.tempDetail, ""),
                data: {
                    templateGuid: id
                },
                success: function (res) {
                    if (typeof res === 'string') {
                        res = JSON.parse(res);
                    }
                    var detail = res;
                    if (typeof detail === 'string') {
                        detail = JSON.parse(detail);
                    }

                    //res.data["linkFromPortIdProperty"] = "fromPort";
                    //res.data["linkToPortIdProperty"] = "toPort";
                    myDiagram.model = go.Model.fromJson(detail.templatejson);


                    if (typeof callback == 'function') {
                        callback();
                    }

                }
            })
        }

        win.getTempDetail = getTempDetail;

    })(window, jQuery);


//其他事件
(function (win, $) {
    var $addTemplate = $('#add-template'),
        $editTemplate = $('#edit-template'),
        $editName = $('#edit-name', $editTemplate),
        $changeTemplate = $('#change-template'),
        $addConfirm = $('.tmp-save', $addTemplate),
        $addCancle = $('.tmp-cancle', $addTemplate),
        $tmpName = $('#tmp-name', $addTemplate),
        $changeConfirm = $('.tmp-save', $changeTemplate),
        $changeCancle = $('.tmp-cancle', $changeTemplate);

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

    $(document).on('click', '#cover', function () {
        $(this).hide();

        //隐藏切换模板
        if ($changeTemplate.css('display') == 'block') {
            $changeTemplate.hide();
            return false;
        }
        //隐藏添加模板
        if ($addTemplate.css('display') == 'block') {
            $addTemplate.hide();
            return false;
        }

        if ($editTemplate.css('display') == 'block') {
            $editTemplate.hide();
            return false;
        }

        $attrPanel.removeClass('show');

        if (attrType == 1) {
            myDiagram.commandHandler.deleteSelection();
        }

        var iframe = $attrIframe;

        iframe.attr('src', 'about:blank');
        try {
            iframe.contentWindow.document.write('');
            iframe.contentWindow.document.close();
        } catch (e) {
            //console.log(e)
        }

    }).on('click', '.cxm', function (event) {
        var $this = $(this),
            type = $this.data('type');

        var val = event.currentTarget.id;
        // console.log(event.currentTarget);
        // console.log(val);
        // console.log(type);

        if (type == 'delete') {
            myDiagram.commandHandler.deleteSelection();
        } else if (type == 'set') {
            // console.log(cacheData);
            attrType = 2;
            $attrName.text(cacheData.name);
            $('#cover').show();
            $attrIframe.attr('src', cacheData.url);
            $('#attr-panel').addClass('show');
        }

        myDiagram.currentTool.stopTool();
    });

    //点击左侧模板列表
    $moduleUl.on('click', '.module-item', function () {
        var $this = $(this),
            id = $this.data('id');

        $changeTemplate.data('id', id);
        // console.log(id);
        $changeTemplate.show();
        $cover.show();

    }).on('click', '.module-item-icon', function(e) {
        var $this = $(this),
            id = $this.parent().data('id'),
            name = $this.prev().text();

        $editName.val(name);
        $editTemplate.data('id', id).show();
        $cover.show();

        e.stopPropagation();
        
        
    });

    //切换模板
    $changeTemplate.on('click', '.tmp-save', function () {
        var _id = $changeTemplate.data('id');
        //此处不做缓存判断，可能用户就想再点击一次重新进行编辑
        getTempDetail(_id, function () {
            $cover.hide();
            $changeTemplate.hide();
        });

    }).on('click', '.tmp-cancle,.tmp-close', function () {
        $cover.hide();
        $changeTemplate.hide();
    });

    //新增模板
    $addTemplate.on('click', '.tmp-save', function () {
        var _name = $.trim($tmpName.val());
        if (!_name) {
            alert('请填写模板名称');
            return false;
        }
        var data = JSON.parse(myDiagram.model.toJson());
        data = $.extend(data, tempValueData);
        var strData = JSON.stringify(data);
        //var reg=new RegExp("已流转","g");
        //strData = strData.replace(reg,'未流转');
        //console.log("data="+JSON.stringify(data));
        var saveData = {
            templateName: _name,
            templateJson: Base64.encode(top.epoint.encodeUtf8(JSON.stringify(data))),
            //templateJson: myDiagram.model.toJson(),
            image: myDiagram.makeImageData({
                size: new go.Size(138, 94),
                background: "white"
            }),
            templateType: 1,
            processVersionInstanceGuid: Util.getQueryString('processVersionInstanceGuid')
        };

        saveTempData(saveData, function () {
            $cover.hide();
            $addTemplate.hide();
        });


    }).on('click', '.tmp-cancle,.tmp-close', function () {
        $cover.hide();
        $addTemplate.hide();
    });

    $editTemplate.on('click', '.tmp-cancle,.tmp-close', function() {
        $cover.hide();
        $editTemplate.hide();
    }).on('click', '.tmp-save', function() {
        var _id = $editTemplate.data('id'),
            _name = $editName.val();
        
        top.Util.ajax({
            url: Util.getRightUrl(apiConfig.editTemp, ""),
            data: {
                id: _id,
                name: _name
            },success: function(res) {
                if (res.msg) {
                    alert(res.msg);
                }
                $cover.hide();
                $editTemplate.hide();
                loadTemplate();
            }
        });

    }).on('click', '.tmp-delete', function() {
        var _id = $editTemplate.data('id');
        
        top.Util.ajax({
            url: Util.getRightUrl(apiConfig.deleteTemp, ""),
            data: {
                id: _id
            },
            success: function(res) {
                if (res.msg) {
                    alert(res.msg);
                }
                $cover.hide();
                $editTemplate.hide();
                loadTemplate();
            }
        });

    });

    $attrPanel.on('click', '.attr-cancel', function () {
        $('#cover').hide();
        $attrPanel.removeClass('show');

        if (attrType == 1) {
            myDiagram.commandHandler.deleteSelection();
        }

        var iframe = $attrIframe;

        iframe.attr('src', 'about:blank');
        try {
            iframe.contentWindow.document.write('');
            iframe.contentWindow.document.close();
        } catch (e) {
            // console.log(e)
        }


    }).on('click', '.attr-confirm', function () {
        //点击确定
    	// 保存iframe页面
        var tabIframe = document.getElementById('attr-iframe').contentWindow;

        var	intervalTime,
            isStart = false;

        intervalTime = setInterval(function() {
        	var endSum = 0;
        	
        	tabIframe.$('iframe').each(function(index,item) {
    
        		if(item.contentWindow.IS_END) {
                    isStart = false;
        			endSum++;
        		} else {
                    if(!isStart) {
                        isStart = true;
                        item.contentWindow.saveModify();
                    }
                }
        	});
        	
        	if(endSum == tabIframe.$('iframe').length) {
        		console.log('进来了')
                clearInterval(intervalTime);
                
    			//传到主页面并修改主页面的节点名称
                // var iframeData = $attrIframe.contents().getAllData();
                //var iframeData = $(window.parent.document).contents().find("#attr-iframe")[0].contentWindow.getAllData(),
                var iframeData = document.getElementById('attr-iframe').contentWindow.getAllData(),
                    _workflowactivity = iframeData ? JSON.parse(iframeData).workflowactivity : '',
                    _activityName = _workflowactivity ? _workflowactivity.activityname : cacheData.name,
                    _participatorflag = document.getElementById('attr-iframe').contentWindow.getParticipatorFlag();
                    
            	if (!iframeData || !JSON.parse(iframeData).activityguid) {
                    alert('请先确认保存基本信息后再操作');
                    return false;
                }

                if (cacheData.name != _activityName) {
                    myDiagram.model.setDataProperty(cacheData, "name", _activityName);
                    var _url = cacheData.url,
                        _prameUrl = _url.split('?')[1],
                        _name = Util.getQueryString('activityName', '?' + _prameUrl),
                        handleUrl = _url.replace(_name, _activityName);

                    myDiagram.model.setDataProperty(cacheData, "url", handleUrl);
                }
                myDiagram.model.setDataProperty(cacheData, "info", JSON.parse(iframeData));
                /* console.log("-----------------------------------------cacheData====================");
                console.log(cacheData);
                console.log("=================================iframeData=================");
                console.log(JSON.parse(iframeData));
 */
                var _iframeData = JSON.parse(iframeData);

                // 有处理者，则更新
                if(_iframeData.transactor) {
                    var transactorInfo = myDiagram.model.findNodeDataForKey('group-'+ _iframeData.activityguid);
                    


                    if(transactorInfo && transactorInfo.key) {
                        // 如果已经存在，则更新
                        myDiagram.model.setDataProperty(transactorInfo, "transactor", _iframeData.transactor);
                    } else {
                        // 不存在则添加
                        myDiagram.model.setDataProperty(cacheData, "group", 'group-'+ _iframeData.activityguid);
                        
                        myDiagram.model.addNodeData({
                            key: 'group-'+  _iframeData.activityguid,
                            transactor: _iframeData.transactor,
                            isGroup: true
                        })

                    }
                } else {
                	var transactorInfo = myDiagram.model.findNodeDataForKey('group-'+ _iframeData.activityguid); 
                	myDiagram.model.removeNodeData(transactorInfo);
                }
                
                myDiagram.model.setDataProperty(cacheData, "key", _iframeData.activityguid);

                myDiagram.model.setDataProperty(cacheData, "participatorflag", _participatorflag);


                $('#cover').hide();
                $attrPanel.removeClass('show');
                // console.log(222)
                var iframe = $attrIframe;

                iframe.attr('src', 'about:blank');
                try {
                    iframe.contentWindow.document.write('');
                    iframe.contentWindow.document.close();
                } catch (e) {
                    // console.log(e)
                }
            }
        },200);
        
    });

    $header.on('click', '.icon-item', function () {
        var $this = $(this),
            type = $this.data('type');

        switch (type) {
            case 'savetemp':

                $cover.show();
                $addTemplate.show();
                break;
            case 'save':
                var saveData = JSON.parse(myDiagram.model.toJson());
                saveData = $.extend(saveData, tempValueData);
                
                var newNodeDataArray = [];

                if(saveData.nodeDataArray && saveData.nodeDataArray.length ) {
                    $(saveData.nodeDataArray).each(function(index,item) {
                        if(item.group) {
                            delete item.group;
                        }
                        
                        if(!item.isGroup) {
                            newNodeDataArray.push(item);
                        }
                    })

                    saveData.nodeDataArray = newNodeDataArray;
                }

                // console.log(saveData);

                // console.log("save" + JSON.stringify(saveData));
               


                saveFlow(JSON.stringify(saveData));
                myDiagram.isModified = false;
                break;
            case 'undo':
                myDiagram.undoManager.undo();
                console.log('撤销');
                break;
            case 'redo':
                myDiagram.undoManager.redo();
                console.log('前进');
                break;
            case 'coordinate':
                // console.log('直角坐标系是什么鬼');
                break;
            case 'algin':
                // myDiagram.initialContentAlignment = "Left";
                // myDiagram.rebuildParts();
                // myDiagram.scale = 3;
                // console.log('剧中');
                break;
            case 'vertical':
                // console.log('看不懂');
                myDiagram.zoomToFit();
                break;
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

            default:
                break;
        }
    }).on('click', '.head-site-item', function () {
        var $this = $(this),
            type = $this.find('.icon-item').data('type');

        if (Util.getQueryString('tmp') == 1) {
            $this.toggleClass('active').siblings().toggleClass('active');
            $('.pannel-' + type).toggleClass('active').siblings().toggleClass('active');
        }

    }).on('change', '#range-scale', function () {
        // console.log($(this).val());
        myDiagram.scale = + $(this).val();
    });

    //保存流程
    function saveFlow(newData) {
    	top.Util.ajax({
            url: Util.getRightUrl(apiConfig.saveFlow, ""),
            data: {
                jsonData: Base64.encode(top.epoint.encodeUtf8(newData)),
                processVersionInstanceGuid: Util.getQueryString('processVersionInstanceGuid')
            },
            success: function (res) {
                if (res.msg) {
                    alert(res.msg);
                }
            }
        })
    }

    win.showLabel = function(e, data) {
        if(!data) {
            $nameTip.hide();
            return false;
        }

        $nameTip.text(data);
        
        var mousePt = myDiagram.lastInput.viewPoint;

        $nameTip.show();

        var site = renderTipSite(mousePt, $nameTip, 10);

        $nameTip.css({
            "left": site.x +'px',
            "top": site.y + 'px'
        })
    };

    //保存模板
    function saveTempData(data, callback) {
    	top.Util.ajax({
            url: Util.getRightUrl(apiConfig.saveTempData, ""),
            data: data,
            success: function (res) {
                if (res.msg) {
                    alert(res.msg);

                    if (typeof callback == 'function') {
                        callback();
                        loadTemplate();
                    }
                }
            }
        })
    }
})(window, jQuery);
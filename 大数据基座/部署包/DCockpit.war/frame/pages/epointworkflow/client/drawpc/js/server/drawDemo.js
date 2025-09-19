var $attrPanel = jQuery('#attr-panel'),
  $attrIframe = jQuery('#attr-iframe'),
  $attrName = $('.attr-name', $attrPanel),
  $header = $('#header'),
  $rangeScale = $('#range-scale'),  //放大缩小
  $myOverviewDiv = $('#myOverviewDiv');//鸟瞰图

var cacheData = '',  //缓存数据
    attrType = 1; //打开节点属性的类型 1表示拖拽，2表示右键

var cacheRequest = {};  //缓存ajax

var myDiagram;

var Util = {};
Util.ajax = function(opt) {
    if(typeof opt != 'object') {
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

    if(!cacheRequest[url]) {
      cacheRequest[url] = {};
    }
    if(!cacheRequest[url][data]) {
      cacheRequest[url][data]= {
        hasEnd:true
      }
    }

    if(cacheRequest[url][data].hasEnd) {
      cacheRequest[url][data].hasEnd = false;
      $.ajax({
            type: 'POST',
            data: data,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: 'json',
            url: url,
            success: function(res) {
              if(typeof success == 'function') {
                success(res);
              }
            }
        }).always(function(){
          console.warn('请求结束');
          cacheRequest[url][data].hasEnd = true;
        });
    } else {
      console.error('该请求正在发送，请勿多次操作');
    }

};

// 获取url参数
//url 为?后面的
Util.getQueryString = function(name,url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
    	_url = url?url:window.location.search;
    var r = _url.substr(1).match(reg);
    var context = "";
    if (r != null) context = decodeURIComponent(r[2]);
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
};

Util.getRightUrl = function(url, epointUrl) {
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
Util.getRootPath = function() {
	var loc = window.location, host = loc.hostname, protocol = loc.protocol, port = loc.port
			? (':' + loc.port)
			: '', path = (Util._rootPath != undefined
			? Util._rootPath
			: ('/' + loc.pathname.split('/')[1]))
			+ '/';

	var rootPath = protocol + '//' + host + port + path;

	return rootPath;
};

Util._rootPath = (function() {
	var path = location.pathname;
	if (path.indexOf('/') === 0) {
		path = path.substring(1);
	}
	return '/' + path.split('/')[0];
}()),

//流程图
(function(win,_$){


    function init(nodeList) {
        if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make; // for conciseness in defining templates

        //初始化整个流程图
        myDiagram =
            $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
                {
                    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                    autoScrollRegion:0,
                    hasVerticalScrollbar:false,
                    hasHorizontalScrollbar:false,//滚动条隐藏
                    initialContentAlignment: go.Spot.Center,
                    allowDrop: true, // must be true to accept drops from the Palette
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

        // when the document is modified, add a "*" to the title and enable the "Save" button
        myDiagram.addDiagramListener("Modified", function(e) {
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
        myDiagram.addModelChangedListener(function(evt) {
            // ignore unimportant Transaction events
            if (!evt.isTransactionFinished) return;
            var txn = evt.object; // a Transaction
            if (txn === null) return;
            // iterate over all of the actual ChangedEvents of the Transaction
            txn.changes.each(function(e) {
                // ignore any kind of change other than adding/removing a node
                if (e.modelChange !== "nodeDataArray") return;
                // record node insertions and removals
                if (e.change === go.ChangedEvent.Insert) {
                    console.log(evt.propertyName + " added node with key: " + e.newValue.key);

                    if(evt.propertyName != 'FinishedUndo') {
                          // console.log(e);
                        cacheData = e.newValue;
                        attrType = 1;
                        $attrName.text(e.newValue.name);
                        _$('#cover').show();
                        $attrIframe.attr('src', e.newValue.url);
                        _$('#attr-panel').addClass('show');
                      } else {
                        //撤销节点，并且删除本地缓存
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
                    mouseEnter: function(e, obj) {
                        showPorts(obj.part, true);
                    },
                    mouseLeave: function(e, obj) {
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
            if(!icon) return './css/images/1.jpg';
            return "./css/images/" + icon + ".jpg"
        }

        //右键菜单
        var cxElement = document.getElementById("contextMenu");

        cxElement.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            return false;
        }, false);

        function showContextMenu(e) {
            console.log('右键菜单');
            // console.log(e.selectionObject.Zd);
            cacheData = e.selectionObject.Zd;
            console.log(cacheData)
            if(cacheData.type == 10 || cacheData.type == 20) {
              return false;
            }
            cxElement.style.display = "block";
            // console.log(myDiagram.lastInput);

            var mousePt = myDiagram.lastInput.viewPoint;
            cxElement.style.left = mousePt.x + "px";
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
                },
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
                                margin: new go.Margin(10,10,10,15),
                            },
                            new go.Binding("source", "icon", findIconImg)),
                        $(go.TextBlock, {
                                font: "normal 14px Helvetica, Arial, sans-serif",
                                stroke: lightText,
                                margin: new go.Margin(10,10,10,0),
                                minSize: new go.Size(99, NaN),
                                maxSize: new go.Size(99, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: false
                            },
                            new go.Binding("text", "name").makeTwoWay())
                    ), {
                        click: function(e, node) {
                            console.log('click')
                            console.log(node);
                            console.log(e);
                            // _$('#cover').show();
                            // $attrIframe.attr('src', 'https://www.baidu.com');
                            // _$('#attr-panel').addClass('show');
                        }
                    }
                ),
                // four named ports, one on each side:
                makePort("T", go.Spot.Top, true, true),
                makePort("L", go.Spot.Left, true, true),
                makePort("R", go.Spot.Right, true, true),
                makePort("B", go.Spot.Bottom, true, false)
            );

        myDiagram.nodeTemplate.contextMenu = myContextMenu;

        var nodeData = [
            { id: '1', category: '', name: '百度', icon: '1',url:'./test/test.html',type: 0},
            { id: '2', category: '', name: '谷歌', icon: '2',url:'./test/test.html',type: 0},
            { id: '3', category: '', name: '名字很长名字很长名字很长', icon: '3',url:'./test/test.html',type: 0},
            { id: '4', category: '', name: '这是名字', icon: '4',url:'./test/test.html',type: 1},
        ];

        //定义连线模板
        myDiagram.linkTemplate =
            $(go.Link, // the whole link panel
                {
                    /*routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5,
                    toShortLength: 4,
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    selectionAdorned: false,
                    resegmentable: true,*/
                    relinkableFrom: true,
                    relinkableTo: true,
                    reshapable: true,
                    adjusting: go.Link.Stretch,
                    
                    selectionAdorned: false,
                    resegmentable: true,
                    // mouse-overs subtly highlight links:
                    mouseEnter: function(e, link) {
                        link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.1)";
                    },
                    mouseLeave: function(e, link) {
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

                    autoScrollRegion:0,
                    hasVerticalScrollbar:false,
                    hasHorizontalScrollbar:false,//滚动条隐藏

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
        node.ports.each(function(port) {
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
    	var pid = Util.getQueryString('pid')||'';//不存在则表示新建
        Util.ajax({
          url: Util.getRightUrl(apiConfig.flowData,""),
          data:{
            processVersionInstanceGuid:Util.getQueryString('processVersionInstanceGuid')
          },
          success: function(res) {
        	var resAfter;
            if(typeof res.custom === 'string') {
            	resAfter = JSON.parse(res.custom);
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
    	Util.ajax({
            url: Util.getRightUrl(apiConfig.nodeList,""),
            data: {
              processVersionInstanceGuid:Util.getQueryString('processVersionInstanceGuid')
            },
            success: function(res) {
              var resAfter;
              if(typeof res.custom === 'string') {
            	  resAfter = JSON.parse(res.custom);
              }
              if(resAfter && resAfter.length) {
                init(resAfter);
              } else {
                init();
              }
            }
          })
    }

    loadNodeList();
    
})(window, jQuery);


//其他事件
(function(win, $) {

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

    $(document).on('click', '#cover', function() {
        $(this).hide();
        $attrPanel.removeClass('show');

        if(attrType == 1) {
            myDiagram.commandHandler.deleteSelection();
        }

        var iframe = $attrIframe;

        iframe.attr('src', 'about:blank');
        try {
            iframe.contentWindow.document.write('');
            iframe.contentWindow.document.close();
        } catch (e) {
            console.log(e)
        }

    }).on('click', '.cxm',function(event) {
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


    $attrPanel.on('click', '.attr-cancel', function() {
        $('#cover').hide();
        $attrPanel.removeClass('show');

        if(attrType == 1) {
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


    }).on('click', '.attr-confirm', function() {
        //点击确定
        
        //传到主页面并修改主页面的节点名称
        // var iframeData = $attrIframe.contents().getAllData();
        var iframeData = $(window.parent.document).contents().find("#attr-iframe")[0].contentWindow.getAllData(),
        	_workflowactivity = iframeData ? JSON.parse(iframeData).workflowactivity : '',
        	_activityName = _workflowactivity ? _workflowactivity.activityname : cacheData.name;
        	
        console.log(".attr-confirm"+iframeData);
        
        if(cacheData.name != _activityName) {
          myDiagram.model.setDataProperty(cacheData, "name", _activityName);
          var _url = cacheData.url,
          	_prameUrl = _url.split('?')[1],
          	_name = Util.getQueryString('activityName','?'+_prameUrl),
          	handleUrl = _url.replace(_name,_activityName);
          
          	
          myDiagram.model.setDataProperty(cacheData, "url", handleUrl);
        }

        myDiagram.model.setDataProperty(cacheData, "info", JSON.parse(iframeData));

        myDiagram.model.setDataProperty(cacheData, "key", JSON.parse(iframeData).activityguid);


        $('#cover').hide();
        $attrPanel.removeClass('show');
        var iframe = $attrIframe;

        iframe.attr('src', 'about:blank');
        try {
            iframe.contentWindow.document.write('');
            iframe.contentWindow.document.close();
        } catch (e) {
            // console.log(e)
        }
    });

    $header.on('click','.icon-item', function() {
      var $this = $(this),
        type = $this.data('type');
      
      switch(type) {
        case 'save':
          console.log("save"+myDiagram.model.toJson());
          saveFlow(myDiagram.model.toJson());
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
          if(myDiagram.scale < 10) {
            myDiagram.scale += .1;

            $rangeScale.jRange('setValue',myDiagram.scale+'');
          }
          
          break;
        case 'min':
          if(myDiagram.scale > 0.1) {
            myDiagram.scale -= .1;
            $rangeScale.jRange('setValue',myDiagram.scale+'');
          }
          break;
        case 'view':
          $this.toggleClass('active');
          $myOverviewDiv.toggleClass('active');

        default:
          break;
      }
    }).on('click','.head-site-item', function() {
      var $this = $(this),
        type = $this.find('.icon-item').data('type');
        $this.toggleClass('active').siblings().toggleClass('active');

        $('.pannel-'+ type).toggleClass('active').siblings().toggleClass('active');
        

    }).on('change', '#range-scale', function(){
      console.log($(this).val());
      myDiagram.scale = + $(this).val();
    });

    function saveFlow(data) {
    	Util.ajax({
            url: Util.getRightUrl(apiConfig.saveFlow,""),
            data:{
            	data:data,
            	processVersionInstanceGuid:Util.getQueryString('processVersionInstanceGuid')
            },
            success: function(res){
            	if(res.custom.msg){
            		alert(res.custom.msg);
            	}
            }
          })
    }
})(window, jQuery);
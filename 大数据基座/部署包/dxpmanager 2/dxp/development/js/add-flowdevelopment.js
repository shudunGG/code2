/**!
 * 数据开发
 * date:2019-10-14
 * author: huangweiping;
 */

var $operationDescription = mini.get("operation-description"), // 操作说明的控件
    $designTips = $("#design-item-tips"), // 菜单提示框
    $myDiagramDiv = $("#myDiagramDiv"), //画布区域
    // $funcRelease          = $('#func-release'), //发布作业按钮
    $funcLog = $("#func-log"), // 运行日志按钮
    $designName = $("#design-name"), // 作业名称
    $designLeft = $("#design-left"), // 左侧菜单
    $designPanel = $("#design-panel"), // 右侧内容
    $cxm = $("#contextMenu"),
    newlinkData = "", //用于缓存连接数据
    $cxm_open = $(".cxm-open", $cxm), // 打开
    myDiagram = null, // 画布
    tempNodeData = {}, // 临时变量，用于存储iframe中返回的值
    cacheData = "", //缓存节点数据
    selectedObj = "", // 选择的节点
    timerSet, //鼠标悬浮定时器
    $tipBox = $("#tip-box"), //悬浮提示
    $tipName = $(".tip-name"), //提示名称
    $timeValue = $("#time-value"), //提示时间
    tableUrl = "./child/setparam", // 表详情页地址
    historyIndex = -1, //操作次数
    $funcPrev = $(".func-prev"), //后退按钮
    $funcNext = $(".func-next"), //前进按钮
    fromPointId = "", //from连线的点
    toPointId = "", //to连线的点
    gridStep = mini.get('datagridstep'),
    designId = Util.getUrlParams('flowguid'); //Util.getUrlParams('id'); // 如果是修改页面，则url上为已有的ID

// 提供给其他页面调用的方法
window.designUtil = {
    // 数据源拖拽后弹出页面确定事件
    setParam: {
        // 点击确定按钮
        onSuccess: function(res) {
            if (cacheData.name != res.name) {
                myDiagram.model.setDataProperty(cacheData, "name", res.name);
            }
        },
        // 点击关闭按钮
        onClose: function() {
            // 只需要判断attrType是否等于1，其他的值只是做个标记，1表示从左侧拖拽进入
            if (designConfig.attrType == 1) {
                myDiagram.undoManager.undo();
            }
        }
    },
    // 插件自带事件
    commandHandler: {
        // 删除选中节点
        deleteSelection: function() {
            myDiagram.commandHandler.deleteSelection();
        }
        // 复制选中节点
        // copySelection: function() {
        //     myDiagram.commandHandler.copySelection();
        // }
    },
    // 插件数据模型自带事件
    model: {
        // 添加节点
        addNodeData: function(data) {
            myDiagram.model.addNodeData(data);
        }
    }
};

// 左侧菜单
(function(win, $) {
    var leftNodeData = "";

    //渲染左侧数据
    Util.ajax({
        url: designConfig.leftMenu,
        data: {},
        success: function(res) {
            Util.hidePageLoading(); // 隐藏pageloading
            console.log(res);
            leftNodeData = res;
            if (typeof res == "string") {
                res = JSON.parse(res);
            }
            // var treeList = res.custom.treeList;
            // $designLeft.html('<ul>'+renderTree(treeList)+'</ul>');
            var navList = res.navList,
                hdList = [],
                resData;

            $.each(navList, function(i, item) {
                hdList.push({
                    name: item.name,
                    target: i + 1,
                    typeicon: item.typeicon
                });
                item.target = i + 1;
            });

            var template = $("#list-temp").html(),
                $mainBox = $(".main-box");
            Mustache.parse(template);
            var rendered = Mustache.render(template, {
                hdList: hdList,
                navList: navList
            });

            var $tab = $("#tab");

            $tab.html(rendered);
            $tab.Tab({
                hd: ".hdl",
                bd: ".bdl",
                target: "target",
                after: function() {
                    if ($mainBox.hasClass("state-mini")) {
                        $mainBox.removeClass("state-mini");
                    }
                    $(".json-list")
                        .getNiceScroll()
                        .resize();
                }
            });
            $(".left-control").on("click", function() {
                $mainBox.addClass("state-mini");
            });

            $("#search").on("focus", function() {
                if ($mainBox.hasClass("state-mini")) {
                    $mainBox.removeClass("state-mini");
                }
            });
        }
    });

    var resultList = [];

    //搜索功能
    var $search = $("#search"),
        $searchBtn = $("#search-btn"),
        $searchResult = $(".search-result"),
        $searchList = $("#search-result"),
        $tab = $("#tab"),
        $backBtn = $(".back-btn");

    //搜索点击
    $searchBtn.on("click", function() {
        var searchData = $search.val();
        if (searchData) {
            $searchResult.removeClass("hidden");
            $tab.addClass("hidden");

            $.each(leftNodeData.navList, function(i, item) {
                $.each(item.list, function(i, newitem) {
                    if (newitem.name.indexOf(searchData) >= 0) {
                        var newNodeData = mini.clone(newitem);
                        newNodeData.textname = newNodeData.name.replace(
                            searchData,
                            "<span>" + searchData + "</span>"
                        );
                        resultList.push(newNodeData);
                    }
                });
            });
            var template = $("#result-temp").html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, { list: resultList });
            $searchList.html(rendered);
            if (resultList.length > 0) {
                $searchList.removeClass("search-empty");
            } else {
                $searchList.addClass("search-empty");
            }
            resultList = [];
        } else {
            $searchResult.addClass("hidden");
            $tab.removeClass("hidden");
        }
    });

    //返回按钮
    $backBtn.on("click", function() {
        $searchResult.addClass("hidden");
        $tab.removeClass("hidden");
    });

    //回车键搜索
    $search.bind("keypress", function(event) {
        if (event.keyCode == "13") {
            $searchBtn.click();
        }
    });

    var $tipWrap = $(".tip-wrap");

    //鼠标悬浮显示介绍
    $("body").on("mouseenter", ".tree-text", function() {
        var $this = $(this);
        var poptop = $this.offset();
        $tipWrap.text($this.data("introduce"));
        if ($this.parents(".json-list").hasClass("result-json")) {
            $tipWrap.css({
                display: "block",
                left: poptop.left + 188,
                top: poptop.top
            });
        } else {
            $tipWrap.css({
                display: "block",
                left: poptop.left + 148,
                top: poptop.top
            });
        }
    });

    //鼠标离开隐藏介绍
    $("body").on("mouseleave", ".tree-text", function() {
        $tipWrap.css({
            display: "none"
        });
    });
})(window, jQuery);

(function(win, $) {
    var $designHeader = $("#design-header"),
        isHover = false,
        hoverTimer = null;

    //退出全屏
    var messageObj = {
        full: "full"
    };

    // 发送消息给父窗口
    var parentWindow = window.parent;

    var showAll = false;

    // 弹窗-发布作业
    $("body")
        .on("click", "#od-confirm", function() {
            // 操作说明-知道了按钮
            $operationDescription.hide();
        })
        .on("click", ".cxm", function(event) {
            // 右键菜单
            var $this = $(this),
                type = $this.data("type");

            if (type == "main") {
                myDiagram.model.setDataProperty(newlinkData, "type", "main");
                myDiagram.model.setDataProperty(
                    newlinkData,
                    "color",
                    "#2590eb"
                );
            } else if (type == "wrong") {
                // newlinkData.isWrongLink = true;
                //错误步骤
                myDiagram.model.setDataProperty(newlinkData, "type", "wrong");
                myDiagram.model.setDataProperty(
                    newlinkData,
                    "color",
                    "#ea644a"
                );
            }
            $cxm[0].style.display = "none";
        })
        .on("click", ".btns-icons", function() {
            var $this = $(this),
                ref = $this.data("ref");
            if (ref === "plus") {
                // 放大
                if (myDiagram.scale < 10) {
                    myDiagram.scale += 0.1;
                }
            } else if (ref === "reduce") {
                // 缩小
                if (myDiagram.scale > 0.1) {
                    myDiagram.scale -= 0.1;
                }
            } else if (ref === "location") {
                // 重置
                myDiagram.scale = 1;
            } else if (ref === "full") {
                if (showAll) {
                    messageObj = {
                        full: "full"
                    };
                    parentWindow.postMessage(
                        JSON.stringify(messageObj, null, 4),
                        "*"
                    );
                    showAll = false;
                } else {
                    messageObj = {
                        full: "nofull"
                    };
                    parentWindow.postMessage(
                        JSON.stringify(messageObj, null, 4),
                        "*"
                    );
                    showAll = true;
                }
                //以下内容添加到父页面
                //全屏
                // function launchFullscreen(element) {
                //     if (element.requestFullscreen) {
                //         element.requestFullscreen();
                //     } else if (element.mozRequestFullScreen) {
                //         element.mozRequestFullScreen();
                //     } else if (element.webkitRequestFullscreen) {
                //         element.webkitRequestFullscreen();
                //     } else if (element.msRequestFullscreen) {
                //         element.msRequestFullscreen();
                //     }
                // }

                // //退出全屏
                // function exitFullscreen() {
                //     if(document.exitFullscreen) {
                //         document.exitFullscreen();
                //     } else if(document.mozCancelFullScreen) {
                //         document.mozCancelFullScreen();
                //     } else if(document.webkitExitFullscreen) {
                //         document.webkitExitFullscreen();
                //     }
                // }

                // window.addEventListener('message', function(e) {
                //     // 收到消息后给对方回复
                //     var iframeData = JSON.parse(e.data);
                //     console.log(iframeData);

                //     if(iframeData.full == 'full'){
                //         console.log('退出全屏');
                //         exitFullscreen()

                //     }else if(iframeData.full == 'nofull'){
                //         console.log('全屏');
                //         launchFullscreen($('iframe')[0])
                //     }

                // });
            }
        });

    //测试前进后退状态
    designConfig.retreatState = function() {
        if (myDiagram.commandHandler.canUndo()) {
            $funcPrev.removeClass("unprev");
        } else {
            $funcPrev.addClass("unprev");
        }
        if (myDiagram.commandHandler.canRedo()) {
            $funcNext.removeClass("unnext");
        } else {
            $funcNext.addClass("unnext");
        }
    };

    //键盘监听事件
    document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if (ctrlKey && keyCode == 83) {
            $(".func-release").click();
            e.preventDefault();
            return false;
        } else if (ctrlKey && keyCode == 90) {
            myDiagram.undoManager.undo();
            e.preventDefault();
            return false;
        } else if (ctrlKey && keyCode == 89) {
            myDiagram.undoManager.redo();

            e.preventDefault();
            return false;
        }
    };

    //保存
    $designHeader
        .on("click", ".func-release", function() {
            var isEmpty = false;
            // 监测是否有数据
            if (myDiagram.model.nodeDataArray.length == 0) {
                isEmpty = true;
            }else{
            	var data = JSON.parse(myDiagram.model);
            	//保存前先排除掉运行后产生的步骤状态信息数据
				$.each(data.nodeDataArray,function(i, item){
					myDiagram.model.setDataProperty(item, "successicon",'');
                    myDiagram.model.setDataProperty(item, "success", '0');
                    myDiagram.model.setDataProperty(item, "time", '');
				});
            }

            if (
                designConfig.onSaveFrame &&
                typeof designConfig.onSaveFrame == "function"
            ) {
                designConfig.onSaveFrame(myDiagram.model.toJSON(), isEmpty);
            }
        })
        .on("click", ".func-log", function() {
            // 运行
            designConfig.attrType = 3;

            var $this = $(this);

            if (
                designConfig.onLogClick &&
                typeof designConfig.onLogClick == "function"
            ) {
                if (hasContent()) {
                	var btnValue = $this.text();
                	
                	if(btnValue == '运行'){
                		var data = JSON.parse(myDiagram.model);
                		//运行前先排除掉运行后产生的步骤状态信息数据
                		$.each(data.nodeDataArray,function(i, item){
                			myDiagram.model.setDataProperty(item, "successicon",'');
                			myDiagram.model.setDataProperty(item, "success", '0');
                			myDiagram.model.setDataProperty(item, "time", '');
                		});
                	}
                	
                    designConfig.onLogClick(myDiagram.model, $this);

                    $(".design-container").removeClass("design-mini");
                    //  画布自适应
                    setTimeout(function() {
                        myDiagram.scale -= 0.1;
                        myDiagram.scale += 0.1;
                    }, 300);

                } else {
                    mini.showTips({
                        content: "暂无数据",
                        state: "danger",
                        x: "center",
                        y: "center",
                        timeout: 3000
                    });
                }
            }
        })
        //发布
        .on("click", ".func-send", function() {
            if (
                designConfig.onLogClick &&
                typeof designConfig.onLogClick == "function"
            ) {
                if (hasContent()) {
                	
                	var data = JSON.parse(myDiagram.model);
                	//运行前先排除掉运行后产生的步骤状态信息数据
    				$.each(data.nodeDataArray,function(i, item){
    					myDiagram.model.setDataProperty(item, "successicon",'');
                        myDiagram.model.setDataProperty(item, "success", '0');
                        myDiagram.model.setDataProperty(item, "time", '');
    				});
                	
                    designConfig.onSendClick(myDiagram.model.toJSON());
                    // $myDiagramDiv.removeClass("design-tip");
                } else {
                    mini.showTips({
                        content: "暂无数据",
                        state: "danger",
                        x: "center",
                        y: "center",
                        timeout: 3000
                    });
                }
            }
        })
        .on("click", ".func-property", function() {
        	if (
                    designConfig.onPropertyClick &&
                    typeof designConfig.onPropertyClick == "function"
                ) {
        		designConfig.onPropertyClick();
        	}
        })
        .on("click", ".func-prev", function() {
            myDiagram.undoManager.undo();
        })
        .on("click", ".func-next", function() {
            myDiagram.undoManager.redo();
        })
        .on("click", ".design-help", function() {
            $operationDescription.show();
        });

    // 如果未连接数据源，双击数据处理组件弹窗提示
    // win.showTipForNoDatabase = function(number) {
    //     alert('请先配置 "+ number +" 个及以上数据源！');
    //     /*  mini.showMessageBox({
    //         minWidth: 250,
    //         title: "提示",
    //         buttons: ["ok"],
    //         message: "请先配置 "+ number +" 个及以上数据源！",
    //         iconCls: "mini-messagebox-warning",
    //         callback: function(action) {
    //             console.log(action);
    //         }
    //     }); */
    // };

    win.paramClose = function(e) {
        if (designConfig.attrType == 1) {
            myDiagram.undoManager.undo();
        }
    };

    var MSG_UNLOAD =
        "如果你此时离开设计作业系统，所做操作信息将全部丢失，是否离开?";
    var UnloadConfirm = {};
    //启用监听浏览器刷新、关闭的方法
    UnloadConfirm.set = function(confirm_msg) {
        window.onbeforeunload = function(event) {
            event = event || window.event;
            event.returnValue = confirm_msg;
        };
    };
    //关闭监听浏览器刷新、关闭的方法
    UnloadConfirm.clear = function() {
        window.onbeforeunload = function() {};
    };
    UnloadConfirm.set(MSG_UNLOAD);

    $(".control-tool").on("click", function() {
        $(".design-container").toggleClass("design-mini");
        //  画布自适应
        setTimeout(function() {
            myDiagram.scale -= 0.1;
            myDiagram.scale += 0.1;
        }, 300);
    });
})(window, jQuery);

// 画布
(function(win, _$) {
    init();
    var LEFT_WIDTH = 199;

    function init() {
        var dragged = null; // A reference to the element currently being dragged

        // highlight stationary nodes during an external drag-and-drop into a Diagram
        function highlight(node) {
            // may be null
            var oldskips = myDiagram.skipsUndoManager;
            myDiagram.skipsUndoManager = true;
            myDiagram.startTransaction("highlight");
            if (node !== null) {
                myDiagram.highlight(node);
            } else {
                myDiagram.clearHighlighteds();
            }
            myDiagram.commitTransaction("highlight");
            myDiagram.skipsUndoManager = oldskips;
        }
        // 开始拖拽
        document.addEventListener(
            "dragstart",
            function(event) {
                // if (event.target.className !== "tree-text") return;
                event.dataTransfer.setData("text", "");

                dragged = event.target;
                // event.target.style.border = "1px solid red";
            },
            false
        );

        document.addEventListener(
            "dragend",
            function(event) {
                dragged.style.border = "";
                highlight(null);
            },
            false
        );

        var div = document.getElementById("myDiagramDiv");
        div.addEventListener(
            "dragenter",
            function(event) {
                // _$('.design-header').css('background-color', '#fff');
                // _$('.design-header').css('background-color', '#315acc');
                console.log("执行了拖动");

                // event.preventDefault();
            },
            false
        );

        div.addEventListener(
            "dragover",
            function(event) {
                if (this === myDiagram.div) {
                    var can = event.target;
                    var pixelratio = window.PIXELRATIO;

                    if (!(can instanceof HTMLCanvasElement)) return;

                    var bbox = can.getBoundingClientRect();
                    var bbw = bbox.width;
                    if (bbw === 0) bbw = 0.001;
                    var bbh = bbox.height;
                    if (bbh === 0) bbh = 0.001;
                    var mx =
                        event.clientX -
                        bbox.left * (can.width / pixelratio / bbw);
                    var my =
                        event.clientY -
                        bbox.top * (can.height / pixelratio / bbh);
                    var point = myDiagram.transformViewToDoc(
                        new go.Point(mx, my)
                    );
                    var curnode = myDiagram.findPartAt(point, true);
                    if (curnode instanceof go.Node) {
                        highlight(curnode);
                    } else {
                        highlight(null);
                    }
                }

                if (event.target.className === "design-diagram") {
                    return;
                }

                event.preventDefault();
            },
            false
        );

        div.addEventListener(
            "dragleave",
            function(event) {
                if (event.target.className == "design-diagram") {
                    event.target.style.background = "";
                }
                highlight(null);
            },
            false
        );

        div.addEventListener(
            "drop",
            function(event) {
                event.preventDefault();

                if (this === myDiagram.div) {
                    var can = event.target;
                    var pixelratio = window.PIXELRATIO;

                    // if the target is not the canvas, we may have trouble, so just quit:
                    if (!(can instanceof HTMLCanvasElement)) return;

                    var bbox = can.getBoundingClientRect();
                    var bbw = bbox.width;
                    if (bbw === 0) bbw = 0.001;
                    var bbh = bbox.height;
                    if (bbh === 0) bbh = 0.001;
                    var mx =
                        event.clientX -
                        bbox.left * (can.width / pixelratio / bbw);
                    var my =
                        event.clientY -
                        bbox.top * (can.height / pixelratio / bbh);
                    var point = myDiagram.transformViewToDoc(
                        new go.Point(mx, my)
                    );
                    var loc = go.Point.stringify(point);
                    myDiagram.startTransaction("new node");

                    var itemData = {
                        key: dragged.dataset.id,
                        type: dragged.dataset.type,
                        name: dragged.dataset.name,
                        url: dragged.dataset.url,
                        icon: dragged.dataset.icon,
                        maxLinks: dragged.dataset.maxlinks,
                        banwrong:dragged.dataset.banwrong,
                        loc: loc
                    };

                    if (
                        designConfig.onDropStart &&
                        typeof designConfig.onDropStart == "function"
                    ) {
                        designConfig.onDropStart(itemData);
                    }

                    // myDiagram.model.addNodeData(itemData);
                    myDiagram.commitTransaction("new node");
                }

                // If we were using drag data, we could get it here, ie:
                // var data = event.dataTransfer.getData('text');
            },
            false
        );

        // *********************************************************
        // Second, set up a GoJS Diagram
        // *********************************************************

        var $ = go.GraphObject.make;

        myDiagram = $(go.Diagram, "myDiagramDiv", {
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            initialContentAlignment: go.Spot.Center,
            hasHorizontalScrollbar: false,
            hasVerticalScrollbar: false,
            "undoManager.isEnabled": true,
     
            "draggingTool.isGridSnapEnabled": true,
            "commandHandler.canCopySelection": function () {
                //复写复制
                myDiagram.commandHandler.copySelection();
            },
            "commandHandler.canPasteSelection": function () {
                var oldLoc = selectedObj.data.loc,
                    locAry = selectedObj.data.loc.split(" ");

                for (var i = 0; i < locAry.length; i++) {
                    locAry[i] = parseFloat(locAry[i]);
                    locAry[i] = locAry[i] + randNum(50, 200);
                }

                selectedObj.data.loc = locAry.toString().replace(",", " ");
                //复写复制
                myDiagram.commandHandler.pasteSelection();
                selectedObj.data.loc = oldLoc;
            },
            //背景网格
            grid: $(
                go.Panel,
                "Grid", // a simple 10x10 grid
                $(go.Shape, "LineH", { stroke: "#f4f6f6", strokeWidth: 0.5 }),
                $(go.Shape, "LineV", { stroke: "#f4f6f6", strokeWidth: 0.5 })
            ),
        });

        window.PIXELRATIO = myDiagram.computePixelRatio();

        //节点部分样式
        function nodeStyle() {
            return [
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
                    go.Point.stringify
                ),
                {
                    locationSpot: go.Spot.LeftCenter,
                    mouseEnter: function(e, obj) {
                    	if(obj.data.success != '0'){
                    		if (obj.data.success == true) {
                    			var mousePt = myDiagram.lastInput.viewPoint;
                    			
                    			$tipBox.removeClass("fail-tip");
                    			$tipName.text("执行成功");
                    			$timeValue.text(obj.data.time);
                    			
                    			timerSet = setTimeout(function() {
                    				$tipBox.css({
                    					display: "block",
                    					left: mousePt.x + LEFT_WIDTH + 20 + "px",
                    					top: mousePt.y - 40 + "px"
                    				});
                    			}, 200);
                    		} else if (obj.data.success == false) {
                    			var mousePt = myDiagram.lastInput.viewPoint;
                    			
                    			$tipBox.addClass("fail-tip");
                    			$tipName.text("执行失败");
                    			$timeValue.text(obj.data.time);
                    			
                    			timerSet = setTimeout(function() {
                    				$tipBox.css({
                    					display: "block",
                    					left: mousePt.x + LEFT_WIDTH + 20 + "px",
                    					top: mousePt.y - 40 + "px"
                    				});
                    			}, 200);
                    		}
                    	}

                        showPorts(obj.part, true);
                    },
                    mouseLeave: function(e, obj) {
                        clearTimeout(timerSet);
                        $tipBox.css({
                            display: "none"
                        });
                        showPorts(obj.part, false);
                    }
                }
            ];
        }

        function showPorts(node, show) {
            var color = "#2d94eb";
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
            node.ports.each(function(port) {
                port.stroke = show ? color : null;
            });
            node.cursor = "move";
        }

        function makePort(name, spot, output, input) {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(
                go.Shape,
                "Circle",
                {
                    fill: "transparent",
                    stroke: null, // this is changed to "white" in the showPorts function
                    desiredSize: new go.Size(8, 8),
                    alignment: spot,
                    alignmentFocus: spot, // align the port on the main Shape
                    portId: name, // declare this object to be a "port"
                    fromSpot: spot,
                    toSpot: spot, // declare where links may connect at this port
                    fromLinkable: true,
                    toLinkable: true,
                    // toLinkable: input, // declare whether the user may draw links to/from here
                    cursor: "pointer" // show a different cursor to indicate potential link point
                }
                // new go.Binding("toLinkable", "type", function(n) {
                //     // 数据源和结果数据不能手动被指向
                //     return n == "table" || n == "result" ? false : true;
                // })
                // new go.Binding("fromLinkable", "type", function(n) {
                //     // 处理节点不能手动往外指出
                //     return n == "handle" ? false : true;
                // })
            );
        }

        //右键菜单
        var cxElement = document.getElementById("contextMenu");

        cxElement.addEventListener(
            "contextmenu",
            function(e) {
                e.preventDefault();
                return false;
            },
            false
        );

        function showContextMenu(e) {
        	newlinkData = e.data;

            fromNode = myDiagram.findNodeForKey(newlinkData.from);

            if(fromNode.data.banwrong != 1){
                cxElement.style.display = "block";

                var mousePt = myDiagram.lastInput.viewPoint;
    
                cxElement.style.left = mousePt.x + LEFT_WIDTH + 20 + "px"; // 20为自定义偏移量
                cxElement.style.top = mousePt.y + 44 + "px"; // 44为自定义偏移量
            }
        }

        var myContextMenu = $(go.HTMLInfo, {
            show: showContextMenu,
            mainElement: cxElement
        });

        // 节点模板
        myDiagram.nodeTemplate = $(
            go.Node,
            "Spot",
            nodeStyle(),
            {
                name: "nodePoint",
                selectable: true,
                // contextMenu: myContextMenu,
                locationSpot: go.Spot.Center,
                selectionAdorned: false
            },

            // new go.Binding('location'),
            $(
                go.Panel,
                "Auto",
                {
                    portId: "",
                    fromSpot: go.Spot.AllSides,
                    toSpot: go.Spot.AllSides
                },
                $(
                    go.Shape,
                    "RoundedRectangle",
                    {
                        width: 60,
                        height: 60,
                        name: "rectBox",
                        fill: "#f5f5f5",
                        stroke: "#ccc",
                        isGeometryPositioned: true,
                        strokeDashArray: [4, 2]
                    },
                    new go.Binding("stroke", "edit", function(h) {
                        return h === "edit" ? "#2590eb" : "#ccc";
                    })
                ),
                $(
                    go.Picture,
                    {
                        position: new go.Point(0, 0),
                        width: 60,
                        height: 60,
                        name: "Picture",
                        desiredSize: new go.Size(30, 30),
                        margin: new go.Margin(0, 0, 0, 0)
                    },
                    new go.Binding("margin", "icon", function(n) {
                        if (n) {
                            new go.Margin(0, 5, 0, 10);
                        } else {
                            new go.Margin(0, 0, 0, 0);
                        }
                    }),
                    new go.Binding("source", "icon")
                ),
                $(
                    go.Picture,
                    {
                        position: new go.Point(0, 0),
                        width: 60,
                        height: 60,
                        name: "Picture",
                        desiredSize: new go.Size(16, 16),
                        margin: new go.Margin(0, 0, 40, 40)
                    },
                    new go.Binding("desiredSize", "successicon", function(n) {
                        if (n) {
                            return new go.Size(16, 16);
                        } else {
                            return new go.Size(0, 0);
                        }
                    }),
                    new go.Binding("margin", "successicon", function(n) {
                        if (n) {
                            new go.Margin(0, 0, 0, 0);
                        } else {
                            new go.Margin(0, 0, 0, 0);
                        }
                    }),
                    new go.Binding("source", "successicon")
                )
            ),

            $(
                go.TextBlock,
                {
                    name: "text",
                    alignment: new go.Spot(0, 1, 30, 20),
                    editable: false,
                    isMultiline: true,
                    width: 110,
                    // margin: new go.Margin(55, 0, 5, 0),
                    textAlign: "center",
                    font: "normal 13px Microsoft YaHei",
                    stroke: "#5c5c5c"
                },
                new go.Binding("text", "name").makeTwoWay()
            ),
            {
                click: function(e, node) {
                    selectedObj = node; // node.part.data
                    console.log(selectedObj.data);
                },
                // mouseEnter: function (e,node) {
                //     console.log('mouseenter');
                //   },
                //   mouseLeave:function(e,node){
                //     console.log('mouseout');
                //   },
                doubleClick: function(e, node) {
                    // 双击，判断数据源个数，满足条件则展示参数设置页
                    selectedObj = node;

                    var _nodeData = node.data,
                        _linkLists = node.findLinksConnected(),
                        _linkCount = _linkLists.count;
                    if (
                        designConfig.onNodeDoubleClick &&
                        typeof designConfig.onNodeDoubleClick == "function"
                    ) {
                        designConfig.onNodeDoubleClick({
                            nodeData: _nodeData,
                            linkCount: _linkCount
                        });
                    }
                }
            },
            makePort("T", go.Spot.Top, true, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, true)
        );

        // 连线模板
        myDiagram.linkTemplate = $(
            go.Link, // the whole link panel
            {
                cursor: "pointer",
                selectable: true, //可选择的
                corner: 0,
                contextMenu: myContextMenu,
                toShortLength: 0,
                relinkableFrom: true, //起始点是否可拖拽到其他节点
                relinkableTo: true,
                reshapable: false,
                // adjusting: go.Link.Stretch,
                selectionAdorned: false,
                resegmentable: true, // 是否可以改变连线形状
                click: function(e, link) {
                    selectedObj = link;
                    console.log("link");
                    console.log(link.data);
                }
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape, {
                isPanelMain: true,
                strokeWidth: 2,
                stroke: "transparent",
                name: "HIGHLIGHT"
            }),
            $(
                go.Shape,
                {
                    isPanelMain: true,
                    // stroke: "#668cf6",
                    strokeWidth: 1
                },
                new go.Binding("stroke", "color").makeTwoWay()
            ),
            $(
                go.Shape,
                {
                    fromArrow: "circle",
                    stroke: null,
                    scale: 0.6
                },
                new go.Binding("fill", "color").makeTwoWay()
            ),
            $(
                go.Shape,
                {
                    toArrow: "standard",
                    stroke: null,
                    scale: 0.8
                },
                new go.Binding("fill", "color").makeTwoWay()
            )
        );

        //监听节点拖拽的事件
        myDiagram.addModelChangedListener(function(evt) {
            if (!evt.isTransactionFinished) return;
            var txn = evt.object; // a Transaction
            if (txn === null) return;
            console.log(myDiagram.commandHandler.canUndo());
            console.log(myDiagram.commandHandler.canRedo());
            designConfig.retreatState();
            adjustToShowTip();
        });

        myDiagram.undoManager.maxHistoryLength = designConfig.maxHistoryLength;

        var cacheRect = "";
        //选择节点
        var selectDom;
        myDiagram.addDiagramListener("ChangedSelection", function(e) {
            // console.log(e.diagram.selection);
            var node = e.diagram.selection.first();
            // 模块节点的边框高亮
            if (cacheRect) {
                if (
                    selectDom &&
                    selectDom.data &&
                    selectDom.data.edit == "edit"
                ) {
                    cacheRect.stroke = "#2590eb";
                } else {
                    cacheRect.stroke = "#ccc";
                }
            }

            if (node && node.name && node.name == "nodePoint") {
                selectDom = node;
                cacheRect = node.part.findObject("rectBox");
                cacheRect.stroke = "#f60";
            }
        });

        // 显示右键菜单
        function showMenu() {
            cxElement.style.display = "block";
            var mousePt = myDiagram.lastInput.viewPoint;
            cxElement.style.left = mousePt.x + LEFT_WIDTH + 20 + "px"; // 20为自定义偏移量
            cxElement.style.top = mousePt.y + 44 + "px"; // 44为自定义偏移量
        }

        myDiagram.addDiagramListener("BackgroundSingleClicked", function(e) {
            cxElement.style.display = "none";
        });

        // 监听连线完成
        myDiagram.addDiagramListener("LinkDrawn", function(e) {
            console.log("连接后");
            console.log(e.subject.data); //这是这个线条的数据
            console.log(e);

            // linkData.color = 'blue';
            newlinkData = e.subject.data;
            var linkData = e.subject.data,
                fromNodeKey = linkData.from,
                toNodeKey = linkData.to,
                toNode = myDiagram.findNodeForKey(toNodeKey),
                fromNode = myDiagram.findNodeForKey(fromNodeKey);

            if(fromNode.data.banwrong!=1){
                showMenu();
            }
            
            myDiagram.model.setDataProperty(newlinkData, "type", "main");
            myDiagram.model.setDataProperty(newlinkData, "color", "#2590eb");

            // 操作运算相关的节点

            // toNode 相关操作
            var _toLinkLists = toNode.findLinksInto(), // to节点被连接相关联的连线信息
                _count = Number(_toLinkLists.count), // 当前连线数
                _linksQueue = toNode.data.linksQueue || "[]";

            var arr = JSON.parse(_linksQueue),
                index = arr.indexOf(fromNodeKey);

            if (index > -1) {
                arr.splice(index, 1);
            }

            arr.push(fromNodeKey);

            //修改状态
            myDiagram.model.setDataProperty(
                toNode.data,
                "linksQueue",
                JSON.stringify(arr)
            );

            // from Node相关操作

            var _fromLinkLists = fromNode.findLinksOutOf(), // from节点向外相关联的连线信息
                _fromCount = Number(_fromLinkLists.count), // 当前连线数
                _fromLinksQueue = fromNode.data.linksQueue || "[]";

            var fromArr = JSON.parse(_fromLinksQueue),
                fromIndex = fromArr.indexOf(fromNodeKey);

            if (fromIndex > -1) {
                fromArr.splice(fromIndex, 1);
            }

            fromArr.push(toNodeKey);

            //修改状态
            myDiagram.model.setDataProperty(
                fromNode.data,
                "linksQueue",
                JSON.stringify(fromArr)
            );

            if (
                designConfig.onLinked &&
                typeof designConfig.onLinked == "function"
            ) {
                designConfig.onLinked({
                    count: _count,
                    toNode: toNode,
                    fromNodeKey: fromNodeKey,
                    firstNodeKey: arr[0],
                    fromNode: fromNode,
                    fromFirstNodeKey: fromArr[0],
                    fromCount: _fromCount
                });
            }

            // myDiagram.commandHandler.deleteSelection();
        });

        // 连线的验证
        myDiagram.toolManager.linkingTool.linkValidation = function(
            fromNode,
            fromPort,
            toNode,
            toPort
        ) {
            var toNodeLinked = toNode.data.linksQueue || "[]",
                toNodeLinkedList = JSON.parse(toNodeLinked);
            // console.log(toNodeLinkedList)
            if (
                toNodeLinkedList.length &&
                toNodeLinkedList.indexOf(fromNode.data.key) > -1
            ) {
                return false;
            }

            return true;
        };


        //删除节点或者连线
        myDiagram.commandHandler.deleteSelection = function() {
            if (
                designConfig.canDelete &&
                typeof designConfig.canDelete == "function"
            ) {
                designConfig.canDelete(selectedObj);
                if (selectedObj.data.linksQueue) {
                    var linkArray = JSON.parse(selectedObj.data.linksQueue);
                    var fromKey = selectedObj.data.key;
                    for (var i = 0, l = linkArray.length; i < l; i++) {
                        var toNode = myDiagram.findNodeForKey(linkArray[i]),
                            _toLinkQueue = toNode.data.linksQueue || "[]",
                            toArr = JSON.parse(_toLinkQueue);
                        toArr.remove(fromKey);
                        myDiagram.model.setDataProperty(
                            toNode.data,
                            "linksQueue",
                            JSON.stringify(toArr)
                        );
                    }
                } else if (selectedObj.data.from) {
                    var toNode = myDiagram.findNodeForKey(selectedObj.data.to),
                        _toLinkQueue = toNode.data.linksQueue || "[]",
                        toArr = JSON.parse(_toLinkQueue),
                        fromNode = myDiagram.findNodeForKey(
                            selectedObj.data.from
                        ),
                        _fromLinkQueue = fromNode.data.linksQueue || "[]",
                        fromArr = JSON.parse(_fromLinkQueue);

                    toArr.remove(selectedObj.data.from);
                    fromArr.remove(selectedObj.data.to);
                    myDiagram.model.setDataProperty(
                        toNode.data,
                        "linksQueue",
                        JSON.stringify(toArr)
                    );
                    myDiagram.model.setDataProperty(
                        fromNode.data,
                        "linksQueue",
                        JSON.stringify(fromArr)
                    );
                }

                go.CommandHandler.prototype.deleteSelection.call(
                    myDiagram.commandHandler
                );
            }
        };

        // 阻止键盘事件
        myDiagram.commandHandler.doKeyDown = function(e) {
            var e = myDiagram.lastInput;
            // Meta（Command）键代替Mac命令的“控制”
            var control = e.control || e.meta;
            var key = e.key;
            //退出任何撤销/重做组合键，具体键值根据需求而定
            //  if (control && key === "Z"){
            //     // return;

            //  }else if (control &&  key === "Y" ){
            //     //  return;
            //  }

            //调用没有参数的基础方法（默认功能）
            go.CommandHandler.prototype.doKeyDown.call(this);
        };

        // 添加新节点
        win.designUtil.addNodeData = function(fromNodeKey, toNode) {
            var fromNode = myDiagram.findNodeForKey(fromNodeKey),
                fromLocation = go.Point.parse(fromNode.data.loc),
                ids = JSON.parse(toNode.data.linksQueue).join(",");

            if (
                designConfig.onAddNodeData &&
                typeof designConfig.onAddNodeData == "function"
            ) {
                designConfig.onAddNodeData({
                    toNode: toNode,
                    fromIds: ids,
                    fromLocation: fromLocation
                });
            }
        };

        // 移除连线
        win.designUtil.removeLink = function(fromKey, toKey) {
            var linkData = myDiagram.findLinksByExample({
                from: fromKey,
                to: toKey
            });
            myDiagram.removeParts(linkData);
            console.log(fromKey);
            console.log(toKey);

            // from jiedian
            var fromNode = myDiagram.findNodeForKey(fromKey),
                _fromLinkLists = fromNode.findLinksOutOf(), // from节点向外相关联的连线信息
                _fromCount = Number(_fromLinkLists.count), // 当前连线数
                _fromLinksQueue = fromNode.data.linksQueue || "[]";

            var fromArr = JSON.parse(_fromLinksQueue);

            //to节点
            var toNode = myDiagram.findNodeForKey(toKey);
            (_toLinkLists = toNode.findLinksOutOf()), //to节点连线信息
                (_toLinkQueue = toNode.data.linksQueue || "[]");

            var toArr = JSON.parse(_toLinkQueue);

            toArr.remove(fromKey);

            fromArr.splice(0, 1);

            // fromArr.push(linkData.to);

            //修改状态
            myDiagram.model.setDataProperty(
                fromNode.data,
                "linksQueue",
                JSON.stringify(fromArr)
            );

            myDiagram.model.setDataProperty(
                toNode.data,
                "linksQueue",
                JSON.stringify(toArr)
            );
        };

        // 创建节点
        win.designUtil.createNode = function(opt) {
            var _newKey = opt.key,
                _canInitView = opt.canInitView || false,
                _name = opt.name,
                _toNode = opt.toNode,
                fromLocation = opt.fromLocation,
                _url = opt.url;

            if (myDiagram.findNodeForKey(_newKey)) {
                return;
            }

            var _localtion = go.Point.parse(_toNode.data.loc),
                _newLoc = "";

            if (fromLocation.x > _localtion.x) {
                _newLoc = go.Point.stringify({
                    x: _localtion.x - _toNode.oc.width - 60,
                    y: _localtion.y
                });
            } else {
                _newLoc = go.Point.stringify({
                    x: _localtion.x + _toNode.oc.width + 60,
                    y: _localtion.y
                });
            }

            if (opt && typeof opt.callback == "function") {
                var data = {
                    key: _newKey,
                    type: "result",
                    canInitView: _canInitView,
                    name: _name,
                    url: _url,
                    loc: _newLoc,
                    icon: "",
                    maxLinks: "",
                    minLinks: "1"
                };
                opt.callback(data);
            }

            // noDelete 自定义属性，用于判断能否删除
            myDiagram.model.addLinkData({
                from: _toNode.key,
                to: _newKey,
                noDelete: true
            });
        };
    }

    function load() {
        if (!designId) return;
        Util.ajax({
            url: designUrl
        }).done(function(data) {
            myDiagram.model = go.Model.fromJson(data);

            adjustToShowTip();

            if (designId) {
                designConfig.isNewSave = false;
                $designName
                    .text(data.name)
                    .parent()
                    .removeClass("hidden");
                workName = data.name;
                workDescription = data.description;
            }
        });
    }

    //load();
    
    win.load=load;
    
    win.hasContent = function() {
        var myDiagramData = JSON.parse(myDiagram.model.toJson());
        if (
            !myDiagramData.nodeDataArray.length &&
            !myDiagramData.linkDataArray.length
        ) {
            return false;
        } else {
            return true;
        }
    };

    // 是否显示提示
    win.adjustToShowTip = function() {
        if (!hasContent()) {
            if (!$myDiagramDiv.hasClass("design-tip")) {
                $myDiagramDiv.addClass("design-tip");
            }
            $funcPrev.addClass("unprev");
        } else {
            if ($myDiagramDiv.hasClass("design-tip")) {
                $myDiagramDiv.removeClass("design-tip");
            }
        }
    };
})(window, jQuery);

//底部
(function(win, $) {
    $("#tab2").Tab();

    //兼容性监测
    if (Util.browsers.isIE) {
        if (!Util.browsers.isIE11) {
            mini.showTips({
                content: "请使用最新版本IE浏览器",
                state: "danger",
                x: "center",
                y: "center",
                timeout: 3000
            });
        }
    }
})(this, jQuery);

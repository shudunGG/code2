/// <reference path="./node_modules/@types/go/index.d.ts" />

var myDiagram,
    initY = 0,
    maxLine = 0;
var $tags = $('#tags');
(function (win, _$) {
    var $ = go.GraphObject.make;

    var hasLoadKey = [];
    // 颜色配置
    var blueGrad = $(go.Brush, "Linear", {
        0: "#72b3e1",
        1: "#5ba7dd",
        start: go.Spot.Left,
        end: go.Spot.Right
    });
    var greenGrad = $(go.Brush, "Linear", {
        0: "#66c698",
        1: "#56c18b",
        start: go.Spot.Left,
        end: go.Spot.Right
    });
    var redGrad = $(go.Brush, "Linear", {
        0: "#ed9b7c",
        1: "#ea8081",
        start: go.Spot.Left,
        end: go.Spot.Right
    });
    var grayGrad = $(go.Brush, "Linear", {
        0: "#b9b9b9",
        1: "#acacac",
        start: go.Spot.Left,
        end: go.Spot.Right
    });

    var status = {
        "0": { // 未开始
            c: grayGrad, // 内容背景色
            b: "#f3f2f2", // 边框颜色
            h: './images/gray_hover.png' // hover悬浮时的边框
        },
        "1": { // 运行成功
            c: greenGrad,
            b: "#e2f3e6",
            h: './images/green_hover.png' // hover悬浮时的边框
        },
        "2": { // 运行失败
            c: redGrad,
            b: "#faeaea",
            h: './images/red_hover.png' // hover悬浮时的边框
        },
        "3": { // 任务挂起
            c: blueGrad, // 内容背景色
            b: "#d6edfb", // 边框颜色
            h: './images/blue_hover.png' // hover悬浮时的边框
        }
    };

    // 颜色配置 end
    
    var showLineNum = dataConfig.showLineNum || 3; // 默认显示几层
    // init
    myDiagram =
        $(go.Diagram, "chart", {
            allowCopy: false,
            contentAlignment: go.Spot.TopCenter,
            // allowVerticalScroll: false,
            // "draggingTool.dragsTree": true,
            // "commandHandler.deletesTree": true,
            allowMove: false,
            allowDrop: false,
            allowResize: false,
            allowZoom: false,
            // allowScale: false,
            layout: $(go.TreeLayout, {
                angle: 90,
                // arrangement: go.TreeLayout.ArrangementFixedRoots,
                layerSpacing: 30,
                layerStyle: go.TreeLayout.LayerUniform,
                nodeSpacing: 140
            }),
            "undoManager.isEnabled": false
        });

    // define tooltips for nodes
    var tooltipTemplate =
        $(go.Adornment, "Auto",
            $(go.Shape, "Rectangle", {
                fill: "#fff",
                stroke: "#ccc"
            }),
            $(go.TextBlock, {
                    font: "12px Microsoft YaHei, sans-serif",
                    wrap: go.TextBlock.WrapFit,
                    desiredSize: new go.Size(200, NaN),
                    alignment: go.Spot.Center,
                    margin: 6,
                    stroke: "#333"
                },
                new go.Binding("text", "text"))
        );

    // define normal node
    myDiagram.nodeTemplate =
        $(go.Node, "Vertical", {
                selectionAdorned: false,
                deletable: false,
                visible: true,
                zOrder: 2
            },
            new go.Binding('visible', '', function (val, node) {
                var line = node.part.data.line;
                if (line <= showLineNum) {
                    return true;
                } else {
                    return false;
                }
            }),
            $(go.Panel, "Auto", {
                    name: "BODY"
                },
                $(go.Picture, {
                        // source: './images/blue_hover.png',
                        height: 64,
                        width: 146,
                        margin: new go.Margin(0, 0, 0, 0),
                        imageStretch: go.GraphObject.None,
                        alignment: go.Spot.TopLeft,
                        alignmentFocus: go.Spot.TopLeft, // align the port on the main Shape
                        fromSpot: go.Spot.TopLeft,
                        toSpot: go.Spot.TopLeft // declare
                    },
                    new go.Binding('source', 'isSelected', function(val, node) {
                        var s = node.part.data.status;
                        // return (val ? '#fbab2d' : status[s].b);
                        return status[s].h
                    }).ofObject(),
                    new go.Binding('visible', 'isSelected').ofObject()
                ),
                $(go.Shape, "RoundedRectangle", {
                        strokeWidth: 3,
                        desiredSize: new go.Size(140 ,58)
                    },
                    new go.Binding("portId", "key"),
                    new go.Binding('fill', 'status', function (s) {
                        return status[s].c;
                    }),
                    new go.Binding('stroke', 'isSelected', function (val, node) {
                        var s = node.part.data.status;
                        // return (val ? '#fbab2d' : status[s].b);
                        return status[s].b
                    }).ofObject()
                ),
                $(go.Panel, "Vertical", {
                        margin: new go.Margin(8, 12, 8, 12)
                    },
                    $(go.TextBlock, {
                            stretch: go.GraphObject.Horizontal,
                            desiredSize: new go.Size(116, 40),
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            font: "normal 14px Microsoft YaHei, sans-serif",
                            stroke: "#fff",
                            toolTip: tooltipTemplate
                        },
                        new go.Binding("text", "text"), {
                            click: function (e, node) {
                                dataConfig.clickEvent(node.part.data);
                            }
                        }
                    )
                )
            ),
            $(go.Picture, {
                    source: './images/icon_more.png',
                    height: 25,
                    margin: new go.Margin(0, 0, 0, 0),
                    imageStretch: go.GraphObject.None
                },
                new go.Binding('opacity', '', function (v, node) {
                    return (v.visible && v.source == './images/icon_plus.png') ? 1 : 0;
                }).ofObject('expandPic')
            ),
            $(go.Picture, {
                    cursor: 'pointer',
                    name: "expandPic",
                    width: 14,
                    height: 14,
                    imageStretch: go.GraphObject.Uniform,
                    margin: new go.Margin(-5, 0, 0, 0)
                },
                new go.Binding('source', '', function (val, node) {
                    var line = node.part.data.line;
                    if (line < showLineNum) {
                        return './images/icon_reduce.png'
                    } else {
                        return './images/icon_plus.png'
                    }
                }),
                new go.Binding('opacity', 'line', function (val) {
                    return val < showLineNum ? 0 : 1;
                }),
                new go.Binding('visible', 'hasChild'), {
                    click: function (e, node) {
                        var nodeKey = node.part.data.key,
                            nodeLine = node.part.data.line;

                        if(hasLoadKey.indexOf(nodeKey) < 0) {
                           /* Util.ajax({
                                url: dataConfig.getMoreData,
                                data: {
                                    id: nodeKey
                                }
                            }).done(function(res) {
                                // 记录已经请求过了
                                hasLoadKey.push(nodeKey);

                                var _nodeDataArray = res.nodeDataArray;
                                var _linkDataArray = [];
    
                                _$(_nodeDataArray).each(function(index,item) {
                                    item['line'] = nodeLine + 1;
                                    
                                    _linkDataArray.push({
                                        from: nodeKey,
                                        to: item.key,
                                        fromPort: nodeKey,
                                        toPort:  item.key,
                                        status: item.status
                                    });
                                })

                                if(maxLine < nodeLine) {
                                    maxLine = nodeLine;
                                }
                                
                                myDiagram.model.addNodeDataCollection(_nodeDataArray);
                                myDiagram.model.addLinkDataCollection(_linkDataArray);
    
                                if (node.part.data.line >= showLineNum) {
                                    expandAll(node)
                                }
                            });*/
                        	 epoint.execute('dxprelatedagaction.getChildNode','', nodeKey,function(res){
                        		 // 记录已经请求过了
                                 hasLoadKey.push(nodeKey);

                                 var _nodeDataArray = res.nodeDataArray;
                                 var _linkDataArray = [];
     
                                 _$(_nodeDataArray).each(function(index,item) {
                                     item['line'] = nodeLine + 1;
                                     
                                     _linkDataArray.push({
                                         from: nodeKey,
                                         to: item.key,
                                         fromPort: nodeKey,
                                         toPort:  item.key,
                                         status: item.status
                                     });
                                 })

                                 if(maxLine < nodeLine) {
                                     maxLine = nodeLine;
                                 }
                                 
                                 myDiagram.model.addNodeDataCollection(_nodeDataArray);
                                 myDiagram.model.addLinkDataCollection(_linkDataArray);
     
                                 if (node.part.data.line >= showLineNum) {
                                     expandAll(node)
                                 }
                             });
                        	
                        	
                        } else {
                            if (node.part.data.line >= showLineNum) {
                                expandAll(node)
                            }
                        }
                        
                        
                    }
                }
            )
        );

    // define a start node
    myDiagram.nodeTemplateMap.add("start",
        $(go.Node, "Vertical", {
                selectionAdorned: false,
                deletable: false,
                zOrder: 2
            },
            $(go.Picture, {
                name: "startPic",
                desiredSize: new go.Size(70, 70),
                source: './images/icon_start.png',
                margin: new go.Margin(0, 0, 5, 0)
            }),
            $(go.Panel, "Auto", $(go.Shape, "RoundedRectangle", {
                        strokeWidth: 3,
                        fill: null,
                        stroke: null
                    },
                    new go.Binding("portId", "key")
                ),
                $(go.Panel, "Vertical",
                    $(go.TextBlock, {
                            text: "",
                            font: "normal 14px bold Microsoft YaHei, sans-serif",
                            stroke: "#5ba7dd"
                        },
                        new go.Binding("text")
                    )
                )
            ),
            $(go.Picture, {
                source: './images/icon_more.png',
                height: 25,
                margin: new go.Margin(0, 0, 0, 0),
                imageStretch: go.GraphObject.None,
                opacity: 0
            })

        )
    );


    // 展开收起
    function expandAll(node, isSub, isHide) {
        // node.diagram.startTransaction("expand/collapse");
        
        if (isSub) {
            // 展开
            node.findObject('expandPic').source = isHide ? './images/icon_reduce.png' : './images/icon_plus.png';
            if(!isHide) {
                hideLine(node)
            }
            myDiagram.findNodeForKey(node.part.data.key).findNodesOutOf().each(function (item) {
                item.visible = isHide;
                expandAll(item, true, isHide)
            })
        } else {
            if (node.source == './images/icon_reduce.png') {
                // 收起
                hideLine(node)
                node.source = './images/icon_plus.png';
                myDiagram.findNodeForKey(node.part.data.key).findNodesOutOf().each(function (item) {
                    item.visible = false;
                    expandAll(item, true, false)
                })
            } else {
                // 展开
                showLine(node)
                node.source = './images/icon_reduce.png';
                myDiagram.findNodeForKey(node.part.data.key).findNodesOutOf().each(function (item) {
                    item.visible = true
                    // expandAll(item, true, true)
                })
            }
        }
        // node.diagram.commitTransaction("expand/collapse");
    }

    function showLine(node) {
        var line = node.part.data.line;
        if(!_$('#tag-' + line).length) {
            var top = +(_$('#tag-'+(line-1)).css('top').replace('px',''));
            var _num = line < 10 ? ('0' + line) : line;
            $tags.append('<li class="tag" id="tag-'+ line +'" style="top: '+ ( top + 128 ) +'px;"><span>'+ _num +'</span></li>')
        } else {
            _$('#tag-' + line).show();
        }
    }

    function hideLine(node) {
        var line = node.part.data.line;
        for(var i = maxLine; i >= line; i--) {
            var nodeCount = 0,
                relativeNode = myDiagram.findNodesByExample({
                    "line": i
                }),
                relativeCount = relativeNode.count;
            relativeNode.each(function(itemNode) {
                if(!itemNode.visible) {
                    nodeCount++;
                }
            });
            if(relativeCount == nodeCount) {
                // 大于隐藏
                _$('#tag-' + i).hide();
            }
        }
    }

    myDiagram.linkTemplate =
        $(go.Link, go.Link.Orthogonal, {
                selectionAdorned: false,
                deletable: false,
                corner: 10,
                zOrder: 1,
                // curviness: -1,
                // fromEndSegmentLength: 15,
                toEndSegmentLength: 15
            },
            $(go.Shape, {
                strokeWidth: 5,
                stroke: "#dfe6eb"
            }),
            $(go.Picture, {
                    name: "startPic",
                    desiredSize: new go.Size(20, 20),
                    // source: './images/arrow_blue.png',
                    // margin: new go.Margin(5, 0, 0, 0),
                    segmentIndex: -2,
                    segmentOrientation: go.Link.None
                },
                new go.Binding('source', 'status', function (s) {
                    var r = './images/arrow_blue.png';
                    if (s == 0) {
                        r = './images/arrow_gray.png';
                    } else if (s == 1) {
                        r = './images/arrow_green.png';
                    } else if (s == 2) {
                        r = './images/arrow_red.png';
                    }
                    return r;
                })
            )
        );

    myDiagram.addDiagramListener('ChangedSelection', function (e) {
        // var node = e.diagram.selection.first();
        // if (!node) {
        //     myDiagram.clearHighlighteds();
        // }
    });

    myDiagram.addDiagramListener('initialLayoutCompleted', function (e) {
        initY = myDiagram.position.y;
    });

    function loadData() {
        var urlParams = Util.getUrlParams();
     /*   Util.ajax({
            url: dataConfig.getData,
            data: {
                id: urlParams.id
            }
        }).done(function (data) {
            renderData(data.nodeDataArray, data.linkDataArray);
        });*/
        epoint.execute('dxprelatedagaction.getData','', urlParams.rowguid,function(data){
        	console.log(data);
        	renderData(data.nodeDataArray, data.linkDataArray);
        });
    }

    loadData();

    function renderData(nodeDataArray, linkDataArray) {
        _$(linkDataArray).each(function (index, item) {
            item['fromPort'] = item.from;
            item['toPort'] = item.to;
        });

        // 赋值 line 
        var startNodeKey = '',
            lineNum = 1;
        _$(nodeDataArray).each(function (index, item) {
            if (item.category == 'start') {
                startNodeKey = item.key;
            }
        });

        function setNodeLine(key, num) {
            _$(nodeDataArray).each(function (index, item) {
                if (item.key == key) {
                    item['line'] = num;
                }
            });
        }

        function eachSetNodeLine(nodeKey, num) {
            var toArr = [];
            _$(linkDataArray).each(function (index, item) {
                if (item.from == nodeKey) {
                    toArr.push(item.to);
                }
            });

            setNodeLine(nodeKey, num);
            num++;
            maxLine = num;
            _$(toArr).each(function (index, item) {
                eachSetNodeLine(item, num)
            })
        }
        eachSetNodeLine(startNodeKey, lineNum);

        // 赋值 line  end

         // create the Model with the above data, and assign to the Diagram
        myDiagram.model = $(go.GraphLinksModel, {
            "linkFromPortIdProperty": "fromPort",
            "linkToPortIdProperty": "toPort",
            nodeDataArray: nodeDataArray,
            linkDataArray: linkDataArray
        });
        
    }







   

})(window, jQuery);

// 左侧序号跟随滚动
(function (win, $) {
    
    $("#chart>div").scroll(function () { //开始监听滚动条
        var top = myDiagram.position.y - initY;
        $tags.css('top', (36 - top) + 'px');
    });
})(window, jQuery);
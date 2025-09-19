// 画布
(function (win, _$) {
    var $ = go.GraphObject.make;
    var chartDebug = 0;

    // var $completeTip = _$('#complete-tip');

    var nodeConfig = {
        dataComponent: {
            image: "./images/content/icon_type1.png"
        },
        aiComponent: {
            image: "./images/content/icon_type2.png"
        },
        visualComponent: {
            image: "./images/content/icon_type3.png"
        },
        localNode: {
            image: "./images/content/node_local.png",
        },
        sourceNode: {
            image: "./images/content/node_source.png",
        },
        handledNode: {
            image: "./images/content/node_handled.png",
        },
        Spot: {
            stroke: "#fff",
            fill: "#7b8192"
        },
        hoverColor: "#f60",
        linkColor: "#bce2f4",
        status: {
            doing: './images/content/status_doing.png',
            error: './images/content/status_error.png',
            success: './images/content/status_success.png',
            warn: './images/content/status_warn.png'
        }
    };



    myDiagram = $(go.Diagram, "chart", {
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        initialContentAlignment: go.Spot.Center,
        hasHorizontalScrollbar: false,
        hasVerticalScrollbar: true,
        "undoManager.isEnabled": true
        // "toolManager.hoverDelay": 1200
        // 悬浮延迟
    });


    // 节点部分样式
    function nodeStyle() {
        return [
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
                locationSpot: go.Spot.LeftCenter
            }
        ];
    }


    function makePort(name, spot, output, input) {
        return $(go.Shape, "Circle", {
            fill: nodeConfig.Spot.fill,
            stroke: nodeConfig.Spot.stroke,
            desiredSize: new go.Size(8, 8),
            alignment: spot,
            alignmentFocus: spot,
            portId: name,
            fromSpot: spot,
            toSpot: spot,
            opacity: 1,
            cursor: "pointer",
            toLinkable: true,
            fromLinkable: true,
            // mouseEnter: function (e, node) {
            // cacheMouseEnterNode['site'] = name;

            // },
            // mouseLeave: function (e, node) {
            // // node.fill = nodeConfig.Spot.fill;
            // // $tip.html('').hide();
            // },
            // click: function (e, node) {
            // node.fill = nodeConfig.hoverColor;
            // node["site"] = name;
            // if (cacheLinkArr.length < 2) {
            // cacheLinkArr.push(node);
            // if (cacheLinkArr.length === 2) {
            // // 两个的时候直接连线
            // cacheLinkArr[0].fill = nodeConfig.Spot.fill;
            // cacheLinkArr[1].fill = nodeConfig.Spot.fill;

            // pageConfig.twoSpotLinkEvent({
            // arr: cacheLinkArr
            // });
            // }
            // }
            // }
        });
    }

    // #region 数据资源表
    var tableNode = $(go.Node, "Spot", nodeStyle(), {
            selectionAdorned: false
        },
        $(go.Panel, "Auto",
            $(go.Shape, "RoundedRectangle", {
                fill: null,
                stroke: "#f00",
                strokeWidth: chartDebug ? 1 : 0
            }),
            $(go.Panel, 'Spot', {
                    alignment: go.Spot.Top
                },
                $(go.Picture, {
                        name: "Picture",
                        desiredSize: new go.Size(210, 62),
                        // margin: new go.Margin(9, 10, 9, 10),
                        source: nodeConfig.localNode.image
                    },
                    new go.Binding("source", "classify", function (val) {
                        return nodeConfig[val + 'Node'].image;
                    })
                ),
                makePort("L", new go.Spot(-.02, .5, 0, 0), true, true),
                makePort("R", new go.Spot(1.02, .5, 0, 0), true, true)
            ),
            $(go.Panel, 'Spot', {
                    alignment: go.Spot.Right
                },
                $(go.Picture, {
                        name: "Picture",
                        desiredSize: new go.Size(20, 20),
                        imageStretch: go.GraphObject.None,
                        margin: new go.Margin(0, 20, 0, 0),
                    },
                    new go.Binding("source", "status", function (status) {
                        if (status) {
                            if (status == 1) {
                                return nodeConfig.status.doing;
                            } else if (status == 2) {
                                return nodeConfig.status.error;
                            } else if (status == 3) {
                                return nodeConfig.status.success;
                            } else if (status == 4 || status == 5) {
                                return nodeConfig.status.warn;
                            }
                        } else {
                            return '';
                        }
                    })
                )
            ),
            $(go.Panel, 'Vertical', {
                    margin: new go.Margin(0, 0, 0, 0)
                },
                new go.Binding("margin", "status", function (status) {
                    if (status) {
                        return new go.Margin(0, 15, 0, 0)
                    } else {
                        return new go.Margin(0, 0, 0, 0)
                    }
                }),
                $(go.TextBlock, {
                        font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                        margin: new go.Margin(0, 10, 4, 10),
                        // maxSize: new go.Size(66, NaN),
                        desiredSize: new go.Size(190, 20),
                        editable: false,
                        cursor: "pointer",
                        textAlign: "center",
                        verticalAlignment: go.Spot.Center,
                        stretch: go.GraphObject.Horizontal,
                        wrap: go.TextBlock.WrapFit,
                        overflow: go.TextBlock.OverflowEllipsis,
                        stroke: "#fff",
                        toolTip: $(go.Adornment, "Auto",
                            $(go.Shape, {
                                fill: "#fff"
                            }),
                            $(go.Panel, "Vertical",
                                $(go.TextBlock, {
                                        margin: 3
                                    },
                                    new go.Binding("text", "name"))))
                    },
                    new go.Binding("desiredSize", "status", function (status) {
                        if (status) {
                            return new go.Size(160, 20);
                        } else {
                            return new go.Size(190, 20);
                        }
                    }),
                    new go.Binding("margin", "status", function (status) {
                        if (status) {
                            return new go.Margin(0, 10, 0, 0)
                        } else {
                            return new go.Margin(0, 10, 0, 10)
                        }
                    }),
                    new go.Binding("text", "name")),
                $(go.TextBlock, {
                        font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                        margin: new go.Margin(0, 10, 0, 10),
                        desiredSize: new go.Size(190, 20),
                        editable: false,
                        cursor: "pointer",
                        textAlign: "center",
                        stretch: go.GraphObject.Horizontal,
                        wrap: go.TextBlock.WrapFit,
                        overflow: go.TextBlock.OverflowEllipsis,
                        stroke: "#fff"
                    },
                    new go.Binding("desiredSize", "status", function (status) {
                        if (status) {
                            return new go.Size(160, 20);
                        } else {
                            return new go.Size(190, 20);
                        }
                    }),
                    new go.Binding("margin", "status", function (status) {
                        if (status) {
                            return new go.Margin(0, 10, 0, 0)
                        } else {
                            return new go.Margin(0, 10, 0, 10)
                        }
                    }),
                    new go.Binding("text", "count"))
            )
        )
    );

    myDiagram.nodeTemplateMap.add("", tableNode);

    // #endregion




    // #region 数组组件
    var dataComponent =
        $(go.Node, "Spot", nodeStyle(), {
                selectionAdorned: false
            },
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", {
                    fill: null,
                    stroke: "#f00",
                    strokeWidth: chartDebug ? 1 : 0
                }),
                $(go.Panel, 'Spot', {
                        alignment: go.Spot.Top,
                    },
                    $(go.Picture, {
                        name: "Picture",
                        desiredSize: new go.Size(66, 66),
                        // margin: new go.Margin(9, 10, 9, 10),
                        source: nodeConfig.dataComponent.image
                    }),
                    makePort("L", new go.Spot(-.08, .5, 0, 0), true, true),
                    makePort("R", new go.Spot(1.08, .5, 0, 0), true, true),
                    $(go.Picture, {
                            name: "Picture",
                            width: 66,
                            height: 66,
                            margin: new go.Margin(-66, 0, 8, 0),
                            imageStretch: go.GraphObject.None,
                            cursor: 'move'
                        },
                        new go.Binding("source", "icon"))
                ),
                $(go.Panel, 'Vertical', {
                        margin: new go.Margin(74, 0, 0, 0)
                    },
                    $(go.TextBlock, {
                            font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                            margin: new go.Margin(0, 0, 4, 0),
                            // maxSize: new go.Size(66, NaN),
                            desiredSize: new go.Size(66, 20),
                            editable: false,
                            cursor: "pointer",
                            textAlign: "center",
                            verticalAlignment: go.Spot.Center,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "name"))))
                        },
                        new go.Binding("text", "name")),
                    $(go.TextBlock, {
                            font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                            desiredSize: new go.Size(216, 46),
                            editable: false,
                            cursor: "pointer",
                            textAlign: "left",
                            visible: false,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "relativeInfo"))))
                        },
                        new go.Binding("text", "relativeInfo"),
                        new go.Binding("visible", "relativeInfo", function (val) {
                            return !!val;
                        })
                    )
                )
            )
        );

    myDiagram.nodeTemplateMap.add("data", dataComponent);
    // #endregion

    // #region 智能组件
    var aiComponent =
        $(go.Node, "Spot", nodeStyle(), {
                selectionAdorned: false
            },
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", {
                    fill: null,
                    stroke: "#f00",
                    strokeWidth: chartDebug ? 1 : 0
                }),
                $(go.Panel, 'Spot', {
                        alignment: go.Spot.Top,

                    },
                    $(go.Picture, {
                        name: "Picture",
                        desiredSize: new go.Size(64, 77),
                        // margin: new go.Margin(9, 10, 9, 10),
                        source: nodeConfig.aiComponent.image
                    }),
                    makePort("L", new go.Spot(-.08, .5, 0, 0), true, true),
                    makePort("R", new go.Spot(1.08, .5, 0, 0), true, true),
                    $(go.Picture, {
                            name: "Picture",
                            width: 64,
                            height: 77,
                            margin: new go.Margin(-77, 0, 8, 0),
                            imageStretch: go.GraphObject.None,
                            cursor: 'move'
                        },
                        new go.Binding("source", "icon"))
                ),
                $(go.Panel, 'Vertical', {
                        margin: new go.Margin(85, 0, 0, 0)
                    },
                    $(go.TextBlock, {
                            font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                            margin: new go.Margin(0, 0, 4, 0),
                            // maxSize: new go.Size(66, NaN),
                            desiredSize: new go.Size(64, 20),
                            editable: false,
                            cursor: "pointer",
                            textAlign: "center",
                            verticalAlignment: go.Spot.Center,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "name"))))
                        },
                        new go.Binding("text", "name")),
                    $(go.TextBlock, {
                            font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                            desiredSize: new go.Size(216, 46),
                            editable: false,
                            cursor: "pointer",
                            textAlign: "left",
                            visible: false,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "relativeInfo"))))
                        },
                        new go.Binding("text", "relativeInfo"),
                        new go.Binding("visible", "relativeInfo", function (val) {
                            return !!val;
                        })
                    )
                )
            )
        );

    myDiagram.nodeTemplateMap.add("ai", aiComponent);
    // #endregion

    // #region 可视化组件
    var visualComponent =
        $(go.Node, "Spot", nodeStyle(), {
                selectionAdorned: false
            },
            $(go.Panel, "Auto",
                $(go.Shape, "RoundedRectangle", {
                    fill: null,
                    stroke: "#f00",
                    strokeWidth: chartDebug ? 1 : 0
                }),
                $(go.Panel, 'Spot', {
                        alignment: go.Spot.Top
                    },
                    $(go.Picture, {
                        name: "Picture",
                        desiredSize: new go.Size(60, 60),
                        // margin: new go.Margin(9, 10, 9, 10),
                        source: nodeConfig.visualComponent.image
                    }),
                    makePort("L", new go.Spot(-.08, .5, 0, 0), true, true),
                    makePort("R", new go.Spot(1.08, .5, 0, 0), true, true),
                    $(go.Picture, {
                            name: "Picture",
                            width: 60,
                            height: 60,
                            margin: new go.Margin(-60, 0, 8, 0),
                            imageStretch: go.GraphObject.None,
                            cursor: 'move'
                        },
                        new go.Binding("source", "icon"))
                ),
                $(go.Panel, 'Vertical', {
                        margin: new go.Margin(68, 0, 0, 0)
                    },
                    $(go.TextBlock, {
                            font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                            margin: new go.Margin(0, 0, 4, 0),
                            // maxSize: new go.Size(66, NaN),
                            desiredSize: new go.Size(60, 20),
                            editable: false,
                            cursor: "pointer",
                            textAlign: "center",
                            verticalAlignment: go.Spot.Center,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "name"))))
                        },
                        new go.Binding("text", "name")),
                    $(go.TextBlock, {
                            font: "normal 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                            desiredSize: new go.Size(216, 46),
                            editable: false,
                            cursor: "pointer",
                            textAlign: "left",
                            visible: false,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "relativeInfo"))))
                        },
                        new go.Binding("text", "relativeInfo"),
                        new go.Binding("visible", "relativeInfo", function (val) {
                            return !!val;
                        }))
                )
            )
        );

    myDiagram.nodeTemplateMap.add("visual", visualComponent);
    // #endregion

    // #region 连线
    myDiagram.linkTemplate =
        $(go.Link, {
                curve: go.Link.Bezier,
                toEndSegmentLength: 60,
                fromEndSegmentLength: 60,
                selectionAdorned: false,
                reshapable: false,
                corner: 0,
                toShortLength: 0,
                relinkableFrom: false,
                relinkableTo: false
            },
            $(go.Shape, // the link shape
                {
                    name: "LINKLINE",
                    isPanelMain: true,
                    strokeWidth: 2,
                    stroke: nodeConfig.linkColor
                },
                new go.Binding("stroke", "isSelected", function (s) {
                    return s ? nodeConfig.hoverColor : nodeConfig.linkColor;
                }).ofObject()
                // new go.Binding("stroke", "", getLinkColor)
            )
        );
    // #endregion


    // //#region 背景双击
    // myDiagram.addDiagramListener("BackgroundDoubleClicked", function (e) {
    // handleChart.showLayer();
    // });

    // myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
    // $designLayer.hide();
    // });

    // myDiagram.addModelChangedListener(function (evt) {
    // if (evt.Ks == "Linking") {
    // if (evt.Ym == "RolledBackTransaction") {
    // // console.log('弹出来吧')
    // handleChart.linkLayer();
    // }
    // }
    // });

    // #endregion

    var rowguid = Util.getUrlParams("rowguid");
    function load() {
    	if (!rowguid)
			return;
		epoint.execute('designjobgaaction.getContent', null, null, function(res) {
			  if (res&&typeof res === 'string') {
	                res = JSON.parse(res);
	            }
	            if (res) {
	                var renderData = {
	                    "class": "go.GraphLinksModel",
	                    "linkFromPortIdProperty": "fromPort",
	                    "linkToPortIdProperty": "toPort",
	                    "nodeDataArray": res.nodeDataArray,
	                    "linkDataArray": res.linkDataArray
	                }
	                myDiagram.model = go.Model.fromJson(renderData);
	            }
		});
    }

    load();
})(window, jQuery);
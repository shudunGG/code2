
var cacheRequest = {};  //缓存ajax

var myDiagram;


//流程图
(function(win,_$){
    function init(nodeList) {
        var $ = go.GraphObject.make;

        //初始化整个流程图
        myDiagram =
            $(go.Diagram, "myDiagramDiv", 
                {
                    initialDocumentSpot: go.Spot.TopCenter,
                    initialViewportSpot: go.Spot.TopCenter,

                    allowDrop: false,
                    allowCopy: false,
                    allowMove: false,
                    layout: 
                    $(go.TreeLayout,
                      { angle: 90, nodeSpacing: 10, layerSpacing: 40, layerStyle: go.TreeLayout.LayerUniform }),
                    "undoManager.isEnabled": false // enable undo & redo
                });

        //节点部分样式
        function nodeStyle() {
            return [
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
                    locationSpot: go.Spot.LeftCenter
                }
            ];
        }

        //图标设置
        function findIconImg(status) {
            if(status == 1) {
                return './css/images/icon-init.png';
            } else if(status == -1) {
                return './css/images/icon-end.png';
            }
        }
        //节点填充色
        function changeFill(status) {
            var color = '';
            if(status == 1) {
                color = '#fffaf6'; 
            } else if(status == -1) {
                color = '#f7fff6'; 
            } else {
                color = '#fff'; 
            }
            return color;
        };
        //节点边框色
        function changeStroke(status) {
            var value = '';
            if(status == 1 ) {
                value = '#f4c6a1'; 
            } else if(status == -1) {
                value = '#b1dcad'; 
            } else {
                value = '#8cc4ec'; 
            }
            return value;
        };
        //文本颜色
        function changeTextStroke(status) {
            var value = '';
            if(status == 1 ) {
                value = '#bd5e11'; 
            } else if(status == -1) {
                value = '#3aa732';
            } else {
                value = '#666666'; 
            }
            return value;
        }

        var cacheColor = '';

        myDiagram.nodeTemplate =  
            $(go.Node, "Spot", nodeStyle(), {
                    selectionAdorned: false
                },
                
                $(go.Panel, "Auto",
                    $(go.Shape, "RoundedRectangle", {
                        minSize: new go.Size(194, 44),
                        maxSize: new go.Size(194, 44),
                        fill: "#fff",
                        stroke: '#b9bec5',
                        strokeWidth: 2
                    },
                    new go.Binding("fill", "status", changeFill),
                    new go.Binding("stroke", "status", changeStroke)
                    ),
                    $(go.Panel, 'Horizontal',
                        $(go.Picture, {
                                name: "Picture",
                            },
                            new go.Binding("desiredSize", "status", function(v){
                                if(v == 1 || v==-1) {
                                    return new go.Size(26, 26);
                                }
                            }),
                            new go.Binding("margin", "status", function(v){
                                if(v == 1 || v==-1) {
                                    return new go.Margin(9,10,9,30)
                                }
                            }),
                            new go.Binding("source", "status", findIconImg)),
                        $(go.TextBlock, {
                                font: "bold 14px 'Microsoft YaHei', arial, helvetica, sans-serif",
                                margin: new go.Margin(0,0,0,0),
                                minSize: new go.Size(99, NaN),
                                maxSize: new go.Size(99, NaN),
                                wrap: go.TextBlock.WrapFit,
                                editable: false,
                                cursor: "pointer"
                            },
                            new go.Binding('textAlign', 'status', function(v) {
                                if(v == 1 || v==-1) {
                                    return 'left';
                                } else {
                                    return "center"
                                }
                            }),
                            new go.Binding("minSize", "status", function(v){
                                if(v == 1 || v==-1) {
                                    return new go.Size(84, NaN);
                                } else {
                                    return new go.Size(194, NaN);
                                }
                            }),
                            new go.Binding("maxSize", "status", function(v){
                                if(v == 1 || v==-1) {
                                    return new go.Size(84, NaN);
                                } else {
                                    return new go.Size(194, NaN);
                                }
                            }),
                            new go.Binding('stroke','status', changeTextStroke),
                            {
                                mouseEnter: function(e, obj) {
                                    if(obj.stroke != '#666666') {
                                        cacheColor = obj.stroke;
                                        obj.stroke = '#23527c';
                                    }
                                },
                                mouseLeave: function(e, obj) {
                                    if(obj.stroke != '#666666') {
                                    obj.stroke = cacheColor;
                                    }
                                }
                            },
                            new go.Binding("text", "name").makeTwoWay())
                    ),
                    {
                        click: function() {
                        }
                    }
                )
            );

        myDiagram.addDiagramListener("ObjectSingleClicked", function(e) {
            var Select_Port = e.subject.part.data;

            if(Select_Port.status == '1' || Select_Port.status == '3') {
                if(Select_Port.detail && Select_Port.detail.length) {
                    showLayer(Select_Port);
                }
            }

        });

        //定义连线模板
        myDiagram.linkTemplate =
            $(go.Link, 
                {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 2,
                    toShortLength: 4,
                    relinkableFrom: false,
                    relinkableTo: false,
                    reshapable: false,
                    selectionAdorned: false,
                    resegmentable: false
                },
                new go.Binding("points").makeTwoWay(),
                $(go.Shape, 
                    {
                        isPanelMain: true,
                        strokeWidth: 4,
                        stroke: "transparent",
                        name: "HIGHLIGHT"
                    }),
                $(go.Shape,
                    {
                        isPanelMain: true,
                        stroke: "#8cc4ec",
                        strokeWidth: 2
                    }),
                $(go.Shape, 
                    {
                        toArrow: "Triangle",
                        scale: 1.3,
                        stroke: '#8cc4ec',
                        fill: "#8cc4ec"
                    })
               
            );

        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

        
      load(); 
       
    }

    init();

    function load() {
		var messagesMessageGuid = Util.getUrlParams('messagesMessageGuid');
        Util.ajax({
          url: dataUrl,
          data:{
        	  messagesMessageGuid: messagesMessageGuid
          },
          success: function(e) {
        	 var res = e.data;
            if(typeof res === 'string') {
              res = JSON.parse(res);
            }
            if(res) {
                var renderData = {
                    "class": "go.GraphLinksModel",
                    "nodeDataArray": res.nodedataarray,
                    "linkDataArray": res.linkdataarray
                }
                myDiagram.model = go.Model.fromJson(renderData);
            }
            
          }
        })
    }
    
})(window, jQuery);
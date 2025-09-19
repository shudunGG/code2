/* global designerConfig: true, designerUtil: true, addPageUrl, editPageUrl,linkEditUrl  */
function type2icon(type) {
    return './images/icon/' + type + '.png';
}
var myDiagram;
var $$ = go.GraphObject.make; // for conciseness in defining templates
myDiagram = $$(
    go.Diagram,
    'task-designer-diagram', // create a Diagram for the DIV HTML element
    {
        maxSelectionCount: 1,
        // contentAlignment: go.Spot.Center, // content is always centered in the viewport
        autoScale: go.Diagram.Uniform, // scale always has all content fitting in the viewport
        'undoManager.isEnabled': true, // enable undo & redo
        'toolManager.hoverDelay': 200
        // layout: $$(go.TreeLayout, {
        //     angle: 90,
        //     // sorting: go.TreeLayout.SortingAscending,
        //     // alignment: go.TreeLayout.AlignmentCenterSubtrees,
        //     alignment: go.TreeLayout.AlignmentCenterChildren,
        //     nodeSpacing: 20,
        //     nodeIndent: 0,
        //     layerSpacing: 50,
        //     rowSpacing: 30,
        //     sorting: go.TreeLayout.SortingForwards
        //     // layerStyle: go.TreeLayout.LayerUniform
        //     // alternateAlignment : go.TreeLayout.AlignmentCenterSubtrees
        // })
        // layout: $$(go.CircularLayout, { sorting: go.CircularLayout.Ascending })
    }
);
myDiagram.model.nodeKeyProperty = 'taskGuid';
myDiagram.model.linkKeyProperty = 'linkGuid';
// myDiagram.model.linkToKeyProperty = 'taskGuid';
// myDiagram.model.linkFromKeyProperty = 'taskGuid';

// myDiagram.model.linkFromPortIdProperty = 'fromPort';
// myDiagram.model.linkToPortIdProperty = 'toPort';
// 去掉键盘的快捷键
myDiagram.commandHandler.doKeyDown = function() {
    return;
};

var PIXELRATIO = myDiagram.computePixelRatio();
var myToolTip = $$(go.HTMLInfo, {
    show: showToolTip,
    hide: hideToolTip
});

//#region  tooltip
var hideTimer;
var $tip = $('#diagram-tooltip');
var TOOLTIP_TPL = $('#tooltip-tpl').html();
function showToolTip(obj, diagram) {
    // 连线模式时 不显示 tooltip
    if (myDiagram.allowLink) {
        return;
    }
    var pos = diagram.lastInput.viewPoint;
    clearTimeout(hideTimer);

    $tip.html(Mustache.render(TOOLTIP_TPL, obj.data)).css({
        left: pos.x,
        top: pos.y
    });
    if ($tip.hasClass('hide')) {
        $tip.removeClass('hide');
    }
    if (!$tip.hasClass('show')) {
        $tip.addClass('show');
    }
}
function hideToolTip() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function() {
        $tip.removeClass('show');
    }, 500);
}

$tip.on('mouseenter', function() {
    clearTimeout(hideTimer);
}).on('mouseleave', function() {
    hideToolTip();
});

// #endregion

// #region 右键菜单
var nodeCtxEl = document.getElementById('node-context-menu');

nodeCtxEl.addEventListener(
    'contextmenu',
    function(e) {
        e.preventDefault();
        return false;
    },
    false
);

var nodeCtxMenu = $$(go.HTMLInfo, {
    show: function showContextMenu(e) {
        // 获取节点信息 记录 以备点击时使用
        var nodeData = e.selectionObject.data;
        nodeCtxEl.setAttribute('data-id', nodeData.taskGuid);
        nodeCtxEl.setAttribute('data-type', nodeData.type);

        var mousePt = myDiagram.lastInput.viewPoint;

        nodeCtxEl.style.left = mousePt.x + 20 + 'px';
        nodeCtxEl.style.top = mousePt.y + 10 + 'px';

        if (!$(nodeCtxEl).hasClass('show')) {
            $(nodeCtxEl).addClass('show');
        }
    },
    hide: function() {
        nodeCtxEl.setAttribute('data-id', '');
        nodeCtxEl.setAttribute('data-type', '');
        $(nodeCtxEl)
            .removeClass('show')
            .css({
                top: -10000,
                left: -10000
            });
    }
});

$(nodeCtxEl).on('click', '.context-menu-item', function(e) {
    var action = this.getAttribute('data-action');

    var nodeGuid = nodeCtxEl.getAttribute('data-id');
    var type = nodeCtxEl.getAttribute('data-type');

    nodeCtxMenu.hide();

    if (!nodeGuid || !type) {
        return;
    }

    if (action == 'run') {
        designerConfig.onNodeRun(nodeGuid, type);
    } else if (action == 'edit') {
        configMange.openEditPage({
            type: type,
            taskGuid: nodeGuid
        });
    } else if(action == 'showLog'){
    	designerConfig.onNodeShowLog(nodeGuid,type);
    }else if (action == 'copy') {
        designerConfig.onNodeCopy(nodeGuid, type, designerUtil.getNodeData(nodeGuid));
    } else if (action == 'remove') {
        designerConfig.onNodeRemove(nodeGuid, type, designerUtil.getLinksByNodeId(nodeGuid));
    }
});

var linkCtxEl = document.getElementById('link-context-menu');
linkCtxEl.addEventListener(
    'contextmenu',
    function(e) {
        e.preventDefault();
        return false;
    },
    false
);
$(linkCtxEl).on('click', '.context-menu-item', function(e) {
    var action = this.getAttribute('data-action');

    var linkGuid = linkCtxEl.getAttribute('data-id');
    var from = linkCtxEl.getAttribute('data-from');
    var to = linkCtxEl.getAttribute('data-to');

    linkCtxMenu.hide();
    if (!linkGuid || !from || !to) {
        return;
    }

    if (action == 'edit') {
        // link 编辑
        configMange.openLinkEditPage({
            linkGuid: linkGuid,
            from: from,
            to: to
        });
    } else if (action == 'remove') {
        // link 删除
        designerConfig.onLinkRemove(linkGuid, from, to);
    }
});
var linkCtxMenu = $$(go.HTMLInfo, {
    show: function showContextMenu(e) {
        // 获取节点信息 记录 以备点击时使用
        var data = e.data;
        linkCtxEl.setAttribute('data-id', data.linkGuid);
        linkCtxEl.setAttribute('data-from', data.from);
        linkCtxEl.setAttribute('data-to', data.to);
        var mousePt = myDiagram.lastInput.viewPoint;

        linkCtxEl.style.left = mousePt.x + 4 + 'px';
        linkCtxEl.style.top = mousePt.y + 4 + 'px';

        if (!$(linkCtxEl).hasClass('show')) {
            $(linkCtxEl).addClass('show');
        }
    },
    hide: function() {
        linkCtxEl.setAttribute('data-id', '');
        linkCtxEl.setAttribute('data-from', '');
        linkCtxEl.setAttribute('data-to', '');
        $(linkCtxEl)
            .removeClass('show')
            .css({
                top: -10000,
                left: -10000
            });
    }
});

// #endregion

function makePort(name, spot, output, input) {
    // the port is basically just a small circle that has a white stroke when it is made visible
    return $$(
        go.Shape,
        'Circle',
        {
            fill: 'transparent',
            stroke: null, // this is changed to "white" in the showPorts function
            desiredSize: new go.Size(8, 8),
            alignment: spot,
            alignmentFocus: spot, // align the port on the main Shape
            portId: name, // declare this object to be a "port"
            fromSpot: spot,
            toSpot: spot, // declare where links may connect at this port
            fromLinkable: output,
            toLinkable: input, // declare whether the user may draw links to/from here
            cursor: 'pointer' // show a different cursor to indicate potential link point
        }
        // new go.Binding('toLinkable', 'toLinkable', function(n) {
        //
        //     // 数据源和结果数据不能手动被指向
        //     // return (n == "table" || n == "result") ? false : true;
        //     return true;
        // }),
        // new go.Binding('fromLinkable', 'fromLinkable', function(n) {
        //     // 处理节点不能手动往外指出
        //     // return n == "handle"? false : true;
        //
        //     return true;
        // })
    );
}
function showPorts(node, show) {
    var color = '#007dfc';
    if (node.data.type == 'result') {
        color = '#fff';
    }
    var diagram = node.diagram;
    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function(port) {
        port.stroke = show ? color : null;
    });
    node.cursor = 'move';
}
// 默认为连线模式
myDiagram.allowLink = false;

// #region 节点模板
myDiagram.nodeTemplate = $$(
    go.Node,
    'Auto',
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    {
        name: 'node',
        selectionAdorned: true,
        // toSpot : go.Spot.Center,
        selectable: true,
        // toolTip: myToolTip,
        contextMenu: nodeCtxMenu,
        //  selected
        selectionAdornmentTemplate: $$(
            go.Adornment,
            'Auto',
            $$(go.Shape, 'Rectangle', { fill: 'rgba(44, 107, 195, .2)', stroke: 'rgb(44, 107, 195)', strokeWidth: 1 }),
            $$(go.Placeholder, { margin: new go.Margin(0, 0, 0, 0) })
        ),
        click: function(e, node) {
            if (myDiagram.allowLink) {
                return;
            }
            // configMange.openEditPage(node.data);
        },
        doubleClick: function (e, node) {
            configMange.openEditPage({
                type: node.data.type,
                taskGuid: node.data.taskGuid
            });
        },
        locationSpot: go.Spot.LeftCenter,
        mouseEnter: function(e, obj) {
            showPorts(obj.part, true);
        },
        mouseLeave: function(e, obj) {
            showPorts(obj.part, false);
        }
    },
    $$(
        go.Panel,
        go.Panel.Vertical,
        {
            margin: new go.Margin(10, 10, 10, 10)
        },
        $$(
            go.Panel,
            go.Panel.Auto,
            {
                // background: '#2c6bc3',
                background: 'transparent',
                click: function() {}
            },
            $$(
                go.Shape,
                'RoundedRectangle',
                {
                    fill: '#2c6bc3',
                    stroke: '#2c6bc3',
                    strokeWidth: 1
                    // portId: '', // declare this object to be a "port"
                    // fromSpot: spot,
                    // toSpot: spot, // declare where links may connect at this port
                    // fromLinkable: true,
                    // toLinkable: true
                }
                // new go.Binding('portId', 'key')
            ),
            $$(
                go.Picture,
                {
                    name: 'node-icon',
                    cursor: 'pointer',
                    width: 48,
                    height: 48,
                    background: 'transparent',
                    imageStretch: go.GraphObject.None,
                    alignment: go.Spot.Center,
                    margin: new go.Margin(0, 0, 0, 0)
                },
                new go.Binding('source', 'type', function(s) {
                    return type2icon(s);
                })
            )
        ),
        $$(
            go.TextBlock,
            {
                font: 'normal 14px \'Microsoft YaHei\', arial, helvetica, sans-serif',
                margin: new go.Margin(10, 0, 0, 0),
                // minSize: new go.Size(99, NaN),
                // maxSize: new go.Size(99, NaN),
                desiredSize: new go.Size(100, 34),
                wrap: go.TextBlock.WrapFit,
                editable: false,
                cursor: 'pointer',
                textAlign: 'center',
                stroke: '#333',
                click: function() {}
            },
            new go.Binding('text', 'taskName').makeTwoWay()
        )
    ),
    makePort('T', go.Spot.Top, true, true),
    makePort('L', go.Spot.Left, true, true),
    makePort('R', go.Spot.Right, true, true),
    makePort('B', go.Spot.Bottom, true, true)
);
// #endregion

// #region 连线模板
myDiagram.linkTemplate = $$(
    go.Link,
    {
        name: 'link',
        contextMenu: linkCtxMenu,
        selectable: true, // 是否可选择
        // curve: go.Link.JumpOver,
        // routing: go.Link.AvoidsNodes,
        corner: 0, // 线条拐角圆角, 在curve 为 None、JumpGap或者JumpOver的时候才生效
        toShortLength: 4, // 连线终点与节点上可连接点的距离
        relinkableFrom: false, // 起始点是否可拖拽到其他节点
        relinkableTo: false,
        adjusting: go.Link.Stretch,
        // selectionAdorned: false,
        reshapable: false, // 是否可以改变连线形状
        resegmentable: false, // 是否可以修改连线的片段数
        alignment: go.Spot.Center,
        click: function() {},
        doubleClick: function (e, link) {
            configMange.openLinkEditPage({
                linkGuid:link.data.linkGuid,
                from:link.data.from,
                to:link.data.to
            });
        }
    },
    // new go.Binding('points').makeTwoWay(),
    $$(go.Shape, {
        isPanelMain: true,
        strokeWidth: 2, // 线条宽度
        stroke: 'transparent', // 一条是透明的，或者整个不写
        name: 'HIGHLIGHT'
    }),
    $$(go.Shape, {
        isPanelMain: true,
        stroke: '#96bcf2',
        strokeWidth: 1
    }),
    $$(go.Shape, {
        fromArrow: 'circle', // 连线起点形状
        stroke: null, // 边框
        scale: 0.6, // 放大缩小
        fill: '#96bcf2' // 填充
    }),
    $$(go.Shape, {
        toArrow: 'standard', // 连线终点形状
        stroke: null,
        scale: 1,
        fill: '#96bcf2'
    })
);

// #endregion

// #region 连线验证 简单限制不允许双向和重复链接
myDiagram.toolManager.linkingTool.linkValidation = function(fromNode, fromPort, toNode, toPort) {
    // 所有进入起始节点的 节点
    var fromNodeIntoNodes = fromNode.findNodesInto();
    // 起始节点所有的出去节点
    var fromNodeOutNodes = fromNode.findNodesOutOf();
    var toNodeKey = toNode.data.taskGuid;

    var n;

    // 如果新进入的节点 已经在指向起始节点的集合中 则将会构成双向链接 break
    while (fromNodeIntoNodes.next()) {
        n = fromNodeIntoNodes.value;
        if (n.data.taskGuid == toNodeKey) {
            console.warn('连接即将构成双向链接 break');
            return false;
        }
    }

    // 如果新的指向 已经在当前起始节点处出去节点集合中 则将会构成重复链接 break
    while (fromNodeOutNodes.next()) {
        n = fromNodeOutNodes.value;
        if (n.data.taskGuid == toNodeKey) {
            console.warn('连接即将构成重复指向 break');
            return false;
        }
    }

    return true;
};
// 路径绘制完成
myDiagram.addDiagramListener('LinkDrawn', function(e) {
    var data = e.subject.data; //这是这个线条的数据

    designerConfig.onLinkAdd(
        {
            from: data.from,
            to: data.to
        },
        function(newLinkGuid) {
            // 更新使用服务端给的 linkGuid
            if (newLinkGuid) {
                myDiagram.model.setKeyForLinkData(data, newLinkGuid);
            } else {
                myDiagram.model.removeLinkData(data);
            }
        }
    );
});
// #endregion

/**
 * 将某个元素全屏显示
 * @param {HTMLElement} el html元素
 */
function requestFullscreen(el) {
    if (el.requestFullscreen) {
        return el.requestFullscreen();
    } else if (el.webkitRequestFullScreen) {
        return el.webkitRequestFullScreen();
    } else if (el.mozRequestFullScreen) {
        return el.mozRequestFullScreen();
    }
    return el.msRequestFullscreen();
}

// 记录节点/路径的选中状态
var selectionCache = {
    data: null,
    type: '' // link 或 node
};

var $trash = $('.toolbar-item[data-type="trash"]');
// 监听选中事件
myDiagram.addDiagramListener('ChangedSelection', function(e) {
    var s = e.diagram.selection.first();

    if (s) {
        $trash.attr('disabled', false).removeClass('disabled');
        if (s.name == 'node') {
            selectionCache.type = 'node';
            selectionCache.data = s.data;
        } else if (s.name == 'link') {
            selectionCache.type = 'link';
            selectionCache.data = s.data;
        }
    } else {
        $trash.attr('disabled', true).addClass('disabled');

        selectionCache.type = '';
        selectionCache.data = null;
    }
});
// 顶部工具
var toolbarHandleMap = {
    pointer: function($it) {
        $it.siblings().removeClass('active');
        $it.addClass('active');

        myDiagram.allowLink = false;
        // myDiagram.model.nodeDataArray.forEach(function(node) {
        //     myDiagram.model.setDataProperty(node, 'toLinkable', false);
        //     myDiagram.model.setDataProperty(node, 'fromLinkable', false);
        //     // node.toLinkable = false;
        //     // node.fromLinkable = false;
        // });
    },
    link: function($it) {
        $it.siblings().removeClass('active');
        $it.addClass('active');
        myDiagram.allowLink = true;
        // myDiagram.model.nodeDataArray.forEach(function(node) {
        //     // node.toLinkable = true;
        //     // node.fromLinkable = true;

        //     myDiagram.model.setDataProperty(node, 'toLinkable', true);
        //     myDiagram.model.setDataProperty(node, 'fromLinkable', true);
        // });
    },
    trash: function($it) {
        if ($it.hasClass('disabled')) {
            return;
        }
        var type = selectionCache.type;
        var data = selectionCache.data;
        if (!type || !data) {
            return;
        }
        if (type == 'link') {
            designerConfig.onLinkRemove(data.linkGuid, data.from, data.to);
            return;
        }

        if (type == 'node') {
            var links = designerUtil.getLinksByNodeId(data.taskGuid);
            designerConfig.onNodeRemove(data.taskGuid, data.type, links);
        }
    },
    download: (function() {
        var a = document.createElement('a');
        a.className = 'hidden-accessible';
        a.download = 'dag设计';
        document.body.appendChild(a);
        return function($it) {
            var imgData = myDiagram.makeImageData({
                scale: 2
            });
            a.href = imgData;
            a.click();
        };
    })(),
    fullscreen: function($it) {
        requestFullscreen(document.getElementById('task-designer-diagram'));
    },
    layout: function() {
        myDiagram.layout = $$(go.TreeLayout, {
            angle: 90,
            // sorting: go.TreeLayout.SortingAscending,
            // alignment: go.TreeLayout.AlignmentCenterSubtrees,
            alignment: go.TreeLayout.AlignmentCenterChildren,
            nodeSpacing: 20,
            nodeIndent: 0,
            layerSpacing: 50,
            rowSpacing: 30,
            sorting: go.TreeLayout.SortingForwards
            // layerStyle: go.TreeLayout.LayerUniform
            // alternateAlignment : go.TreeLayout.AlignmentCenterSubtrees
        });
        myDiagram.rebuildParts();
    }
};

$('.top .toolbar-wrap').on('click', '.toolbar-item', function() {
    var $it = $(this);

    // var type = $.trim($it[0].className.replace(/(?:toolbar-item| l| l)/g, ''));
    var type = $it.data('type');

    toolbarHandleMap[type] && toolbarHandleMap[type]($it);
});
// 图表保存
$('#diagram-save').on('click', function() {
    var data = designerUtil.getData();
    designerConfig.onSave(data);
});

// #region 拖拽

function highlight(node) {
    if (node) {
    }
}

var dragged = null;
// 开始拖拽
// prettier-ignore
document.addEventListener('dragstart', function(ev) {
    var $item = $(ev.target).closest('.node-item');
    if (!$item.length) {
        dragged = null;
        return;
    }
    
    ev.dataTransfer.setData('text', '');

    dragged = $item[0];
}, false);

// prettier-ignore
document.addEventListener( 'dragend', function() {
    
    if (dragged) dragged.style.border = '';
    // highlight(null);
}, false);

var diagramEl = document.getElementById('task-designer-diagram');
// prettier-ignore
diagramEl.addEventListener('dragenter', function(event) {
    
    // _$('.design-header').css('background-color', '#fff');
    // _$('.design-header').css('background-color', '#315acc');
    event.preventDefault();
}, false);
diagramEl.addEventListener(
    'dragover',
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
            var mx = event.clientX - bbox.left * (can.width / pixelratio / bbw);
            var my = event.clientY - bbox.top * (can.height / pixelratio / bbh);
            var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
            var curnode = myDiagram.findPartAt(point, true);
            if (curnode instanceof go.Node) {
                highlight(curnode);
            } else {
                highlight(null);
            }
        }

        if (event.target.className === 'design-diagram') {
            return;
        }

        event.preventDefault();
    },
    false
);

// prettier-ignore
diagramEl.addEventListener( 'dragleave', function(event) {
    
    // if (event.target.className == "design-diagram") {
    //     // event.target.style.background = "";
    // }
    // highlight(null);
}, false);

// 放置
// prettier-ignore
diagramEl.addEventListener('drop', function(event) {
    
    event.preventDefault();

    if (this === myDiagram.div) {
        var can = event.target;
        var pixelratio = window.PIXELRATIO;

        // if the target is not the canvas, we may have trouble, so just quit:
        if (!(can instanceof HTMLCanvasElement)) return;

        // 计算位置
        var bbox = can.getBoundingClientRect();
        var bbw = bbox.width;
        if (bbw === 0) bbw = 0.001;
        var bbh = bbox.height;
        if (bbh === 0) bbh = 0.001;
        var mx = event.clientX - bbox.left * (can.width / pixelratio / bbw);
        var my = event.clientY - bbox.top * (can.height / pixelratio / bbh);
        var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
        var loc = go.Point.stringify(point);
        myDiagram.startTransaction('new node');

        var type = dragged.dataset.type;

        // 节点数据
        var nodeData = {
            type: type,
            taskName: dragged.dataset.name || '新节点',
            // id: type + +new Date(),
            // key: '111',
            icon: type2icon(type),
            loc: loc
        };
        

        // 打开配置页面 创建节点 确认后才添加
        configMange.openAddPage(nodeData);

        myDiagram.commitTransaction('new node');
    }

}, false);

// #endregion

// #region 配置
var $rightPanel = $('#right-panel');
var $panelTitle = $('.panel-header', $rightPanel);
var $configConfirmBtn = $('#node-config-save');
var $ifr = $rightPanel.find('#config-iframe');
//  取消
$rightPanel.on('click', '.design-btn.cancel-btn', function() {
    if (typeof designerConfig.onConfigCancel == 'function') {
        designerConfig.onConfigCancel();
    }

    // 撤销新增的节点 并隐藏配置窗口显示
    configMange.removeHolderNode();
    configMange.hide();
});

var configMange = {
    _currentNodeInfo: null,
    _holderNodeKey: 'node-bolder',
    createHolderNode: function(info) {
        myDiagram.model.addNodeData(
            $.extend(
                {
                    taskGuid: this._holderNodeKey
                },
                info
            )
        );
    },
    removeHolderNode: function() {
        var d = myDiagram.model.findNodeDataForKey(this._holderNodeKey);
        if (d) {
            myDiagram.model.removeNodeData(d);
        }

        this._currentNodeInfo = null;
    },
    openAddPage: function(info) {
        this._currentNodeInfo = info;
        this.createHolderNode(info);
        var params = {
            editType: 'add',
            type: info.type
        };
        $panelTitle.text('[' +info.type + ']' + '节点配置');
        var url = Util.addUrlParams(addPageUrl, $.extend({}, Util.getUrlParams(), params));
        $ifr.attr('src', url);

        $configConfirmBtn.text('确定添加');

        $rightPanel.addClass('show');
    },

    openEditPage: function(info) {
        this._currentNodeInfo = info;
        var params = {
            editType: 'edit',
            type: info.type,
            taskGuid: info.taskGuid
        };
        $panelTitle.text('[' +info.type + ']' + '节点配置');
        var url = Util.addUrlParams(editPageUrl, $.extend({}, Util.getUrlParams(), params));
        $ifr.attr('src', url);

        $configConfirmBtn.text('确定修改');
        $rightPanel.addClass('show');
    },
    openLinkEditPage: function(data) {
        var url = Util.addUrlParams(linkEditUrl, $.extend({}, Util.getUrlParams(), data));

        $panelTitle.text('当前路径配置');

        $ifr.attr('src', url);
        $configConfirmBtn.text('确定修改');
        $rightPanel.addClass('show');
    },
    hide: function() {
        $rightPanel.removeClass('show');
    }
};

window.designerUtil = {
    /**
     * 根据节点id获取连接信息
     * @param {string} nodeId 节点id
     * @param {boolean | undefined} refer 获取原始数据的拷贝而不是引用
     */
    getLinksByNodeId: function(nodeId, refer) {
        var nodeData = myDiagram.model.findNodeDataForKey(nodeId);
        if (!nodeData) {
            return [];
        }
        var targetNode = myDiagram.findNodeForData(nodeData);
        if (!targetNode) {
            return [];
        }
        var it = targetNode.findLinksConnected();

        var arr = [];

        while (it.next()) {
            arr.push(it.value.data);
        }
        if (refer === true) {
            return arr;
        }

        arr = JSON.parse(JSON.stringify(arr));
        arr.forEach(function(i, item) {
            delete item.__gohashid;
        });
        return arr;
    },
    getNodeData: function(nodeId, refer) {
        var nodeData = myDiagram.model.findNodeDataForKey(nodeId);
        if (refer === true) {
            return nodeData;
        }
        nodeData = JSON.parse(JSON.stringify(nodeData));

        delete nodeData.icon;
        delete nodeData.__gohashid;

        return nodeData;
    },
    getData: function() {
        var d = JSON.parse(myDiagram.model.toJson());
        var data = JSON.stringify({
            nodeArray: d.nodeDataArray.map(function(nodeItem) {
                delete nodeItem.icon;
                return nodeItem;
            }),
            linkArray: d.linkDataArray
        });
        return data;
    },
    // 设置数据
    setData: function(data) {
        // data.nodeArray.forEach(function(i, item) {
        //     item.icon = type2icon(item.type);
        // });
        myDiagram.model.nodeKeyProperty = 'taskGuid';
        myDiagram.model.linkKeyProperty = 'linkGuid';
        // myDiagram.model.linkToKeyProperty = 'taskGuid';
        // myDiagram.model.linkFromKeyProperty = 'taskGuid';

        myDiagram.model.nodeDataArray = data.nodeArray;
        myDiagram.model.linkDataArray = data.linkArray;
        // myDiagram.model = new go.GraphLinksModel(data.nodeArray, data.linkArray);
    },
    // 新增时替换占位节点
    replaceHolderNode: function(nodeData) {
        configMange.removeHolderNode();
        myDiagram.model.addNodeData(nodeData);
        epoint.showTips('任务新增成功', { state: 'success' });
        configMange.hide();
    },
    // 修改节点
    updateNodeData: function(nodeData) {
        var targetNode = myDiagram.model.findNodeDataForKey(nodeData.key || nodeData.taskGuid);
        if (!targetNode) {
            console.error('xxx');
            return;
        }
        // 遍历修改改变的节点属性值
        $.each(nodeData, function(k, v) {
            if (v !== targetNode[k]) {
                myDiagram.model.setDataProperty(targetNode, k, v);
            }
        });
        epoint.showTips('配置更新成功', { state: 'success' });
        configMange.hide();
    },
    // 新增或修改节点
    createOrModifyNode: function(node) {
        var currentData = configMange._currentNodeInfo;
        if (!currentData) {
            console.error('xxx');
            return;
        }
        // 是修改 还是新增
//        var type = currentData.taskGuid && currentData.key ? 'edit' : 'add';
        var type = node.editType;
        delete node.editType;//移除editType

        var data = $.extend(true, {}, currentData, node);

        if (!data.key) {
            data.key = data.taskGuid;
        }

        // 新增节点 则替换掉占位节点
        if (type == 'add') {
            designerUtil.replaceHolderNode(data);
            return;
        }
        // 修改
        designerUtil.updateNodeData(data);
    },
    // 移除节点
    removeNode: function(node) {
        var id;
        if (typeof node == 'object') {
            id = node.taskGuid || node.key;
        } else {
            id = node;
        }
        if (!node) {
            console.error('必须提供要删除的节点信息');
            return;
        }

        var nodeData = myDiagram.model.findNodeDataForKey(id);
        if (nodeData) {
            // 删除节点的链接
            var links = this.getLinksByNodeId(id, true);
            myDiagram.model.removeLinkDataCollection(links);
            // 删除节点
            myDiagram.model.removeNodeData(nodeData);
        }
    },
    getCopyNodeLoc: function(loc) {
        var node_w = 120;
        var node_h = 114;

        var point = go.Point.parse(loc);

        var offset = new go.Point((node_w * PIXELRATIO) / 2, (node_h * PIXELRATIO) / 2);

        point.add(offset);

        return go.Point.stringify(point);
    },
    addNode: function(node) {
        myDiagram.model.addNodeData(node);
        myDiagram.clearSelection();
    },
    removeLink: function(linkGuid) {
        var linkData = myDiagram.model.findLinkDataForKey(linkGuid);
        if (linkData) {
            myDiagram.model.removeLinkData(linkData);
        }
    },
    hideConfigPanel: function() {
        configMange.hide();
    }
};

// #endregion

// 还原初始化数据
designerConfig.init();

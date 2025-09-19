/* global showDetailPage, linkStatus2Color, hideDetailPage, runNodeScript1, runNodeScript2, killNode  */
function type2icon(type) {
    return './images/icon/' + type + '.png';
}
var myDiagram;
var $$ = go.GraphObject.make; // for conciseness in defining templates
myDiagram = $$(
    go.Diagram,
    'task-designer-diagram', // create a Diagram for the DIV HTML element
    {
        isReadOnly: true,
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

var PIXELRATIO = myDiagram.computePixelRatio();

// #region 节点提示
var myNodeToolTip = $$(go.HTMLInfo, {
    show: showNodeToolTip,
    hide: function() {
        hideNodeToolTip();
    }
});
var nodeHideTimer;
var $nodeTip = $('#diagram-tooltip-node');
var NODE_TOOLTIP_TPL = $('#node-tooltip-tpl').html();
var NODE_TOOLTIP_ROWS = NODE_TOOLTIP_TPL.split('tip-item').length - 1;
function showNodeToolTip(obj, diagram) {
    var pos = diagram.lastInput.viewPoint;
    clearTimeout(nodeHideTimer);

    $nodeTip.html(Mustache.render(NODE_TOOLTIP_TPL, obj.data)).css(
        getRightPos(
            {
                left: pos.x,
                top: pos.y
            },
            {
                width: 230,
                height: 32 + NODE_TOOLTIP_ROWS * 20
            }
        )
    );
    if (!$nodeTip.hasClass('show')) {
        $nodeTip.addClass('show');
    }
    hideLinkToolTip(true);
}
function hideNodeToolTip(now) {
    if (now) {
        clearTimeout(nodeHideTimer);
        return $nodeTip.removeClass('show').css({
            top: -10000,
            left: -10000
        });
    }
    clearTimeout(nodeHideTimer);
    nodeHideTimer = setTimeout(function() {
        $nodeTip.removeClass('show').css({
            top: -10000,
            left: -10000
        });
    }, 150);//这边延时由500改为150 by wujt
}

$nodeTip
    .on('mouseenter', function() {
        clearTimeout(nodeHideTimer);
    })
    .on('mouseleave', function() {
        hideNodeToolTip();
    });

// #endregion

// #region 路径提示
var myLinkToolTip = $$(go.HTMLInfo, {
    show: showLinkToolTip,
    hide: function() {
        hideLinkToolTip();
    }
});
var linkHideTimer;
var $linkTip = $('#diagram-tooltip-link');
var LINK_TOOLTIP_TPL = $('#link-tooltip-tpl').html();
var LINK_TOOLTIP_ROWS = LINK_TOOLTIP_TPL.split('tip-item').length - 1;
function showLinkToolTip(obj, diagram) {
    var pos = diagram.lastInput.viewPoint;
    clearTimeout(linkHideTimer);

    $linkTip.html(Mustache.render(LINK_TOOLTIP_TPL, obj.data)).css(
        getRightPos(
            {
                left: pos.x,
                top: pos.y
            },
            {
                width: 230,
                height: 20 * LINK_TOOLTIP_ROWS + 32
            }
        )
    );
    if (!$linkTip.hasClass('show')) {
        $linkTip.addClass('show');
    }
    hideNodeToolTip(true);
}
function hideLinkToolTip(now) {
    if (now) {
        clearTimeout(linkHideTimer);
        return $linkTip.removeClass('show').css({
            top: -10000,
            left: -10000
        });
    }
    clearTimeout(linkHideTimer);
    linkHideTimer = setTimeout(function() {
        $linkTip.removeClass('show').css({
            top: -10000,
            left: -10000
        });
    }, 150);//这边延时由500改为150 by wujt
}

$linkTip
    .on('mouseenter', function() {
        clearTimeout(linkHideTimer);
    })
    .on('mouseleave', function() {
        hideLinkToolTip();
    });

// #endregion

// #region 节点右键菜单

var nodeCtxEl = document.getElementById('node-context-menu');

nodeCtxEl.addEventListener(
    'contextmenu',
    function(e) {
        e.preventDefault();
        return false;
    },
    false
);

var current_ctx_data = null;
var nodeCtxMenu = $$(go.HTMLInfo, {
    show: function showContextMenu(e) {
        // 获取节点信息 记录 以备点击时使用
        var nodeData = e.selectionObject.data;
        nodeCtxEl.setAttribute('data-id', nodeData.taskGuid);
        nodeCtxEl.setAttribute('data-type', nodeData.type);

        current_ctx_data = JSON.parse(JSON.stringify(nodeData));

        // 显示前的校验
        if (typeof beforeNodeCtxMenuShow === 'function') {
            var check = window.beforeNodeCtxMenuShow(current_ctx_data);
            //0 : 全部隐藏，1：只显示run1和run2，2：只显示kill
            if (check == 0) {
                return nodeCtxMenu.hide();
            }else if(check == 1){
            	$(nodeCtxEl).find('.kill').hide();
            	$(nodeCtxEl).find('.run').show();
            }else if(check == 2){
            	$(nodeCtxEl).find('.run').hide();
            	$(nodeCtxEl).find('.kill').show();
            }
        }

        var mousePt = myDiagram.lastInput.viewPoint;

        nodeCtxEl.style.left = mousePt.x + 4 + 'px';
        nodeCtxEl.style.top = mousePt.y + 4 + 'px';

        if (!$(nodeCtxEl).hasClass('show')) {
            $(nodeCtxEl).addClass('show');
        }
        //右击的时候移除悬浮 by wujt
        $nodeTip.removeClass('show').css({
            top: -10000,
            left: -10000
        });
        hideDetailPage();
    },
    hide: function() {
        current_ctx_data = null;
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

    // var nodeGuid = nodeCtxEl.getAttribute('data-id');
    // var type = nodeCtxEl.getAttribute('data-type');

    var data = current_ctx_data;

    nodeCtxMenu.hide();

    if (!data) {
        console.error('节点数据不存在请检查');
        return;
    }

    if (action == 'run1') {
        runNodeScript1(data);
    } else if (action == 'run2') {
        runNodeScript2(data);
    } else if (action == 'kill') {
        killNode(data);
    }
});

// #endregion

// #region 节点模板
myDiagram.nodeTemplate = $$(
    go.Node,
    'Auto',
    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
    {
        name: 'node',
        selectionAdorned: true,
        selectable: true,
        toolTip: myNodeToolTip,
        contextMenu: nodeCtxMenu,
        //  selected
        selectionAdornmentTemplate: $$(
            go.Adornment,
            'Auto',
            { toolTip: myNodeToolTip },
            $$(go.Shape, 'Rectangle', { fill: 'rgba(44, 107, 195, .2)', stroke: 'rgb(44, 107, 195)', strokeWidth: 1 }),
            $$(go.Placeholder, { margin: new go.Margin(0, 0, 0, 0) })
        ),
        click: function() {
            myDiagram.clearSelection();
        },
        doubleClick: function(e, node) {
            myDiagram.select(node);
            showDetailPage(JSON.parse(JSON.stringify(node.data)));
        },
        locationSpot: go.Spot.LeftCenter
    },
    $$(
        go.Panel,
        go.Panel.Vertical,
        {
            margin: new go.Margin(10, 10, 10, 10)
        },
        $$(
            go.Picture,
            {
                name: 'node-status',
                // cursor: 'pointer',
                width: 18,
                height: 18,
                background: 'transparent',
                imageStretch: go.GraphObject.None,
                alignment: go.Spot.Center,
                margin: new go.Margin(0, 0, 0, 0)
            },
            new go.Binding('source', 'status', function(s) {
                // eslint-disable-next-line no-undef
                return nodeStatus2path(s);
            })
        ),
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
    )
);
// #endregion

// #region 连线模板
myDiagram.linkTemplate = $$(
    go.Link,
    {
        name: 'link',
        toolTip: myLinkToolTip,
        selectable: false, // 是否可选择
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
        click: function() {}
    },
    // new go.Binding('points').makeTwoWay(),
    $$(go.Shape, {
        isPanelMain: true,
        strokeWidth: 2, // 线条宽度
        stroke: 'transparent', // 一条是透明的，或者整个不写
        name: 'HIGHLIGHT'
    }),
    $$(
        go.Shape,
        {
            isPanelMain: true,
            stroke: '#96bcf2',
            strokeWidth: 1
        },
        new go.Binding('stroke', 'status', function(s) {
            return linkStatus2Color(s);
        })
    ),
    $$(
        go.Shape,
        {
            fromArrow: 'circle', // 连线起点形状
            stroke: null, // 边框
            scale: 0.6, // 放大缩小
            fill: '#96bcf2' // 填充
        },
        new go.Binding('fill', 'status', function(s) {
            return linkStatus2Color(s);
        })
    ),
    $$(
        go.Shape,
        {
            toArrow: 'standard', // 连线终点形状
            stroke: null,
            scale: 1,
            fill: '#96bcf2'
        },
        new go.Binding('fill', 'status', function(s) {
            return linkStatus2Color(s);
        })
    )
);

// #endregion

window.designerUtil = {
    setData: function(data) {
        myDiagram.model.nodeDataArray = data.nodeArray;
        myDiagram.model.linkDataArray = data.linkArray;
    }
};

/**
 * 计算合适的位置
 *
 * @param {Object} pos 初始位置信息 left + top
 * @param {Object} box 提示盒子大小 width + height
 * @returns 保障不超出屏幕的新位置信息
 */
function getRightPos(pos, box) {
    var rect = document.getElementById('container').getBoundingClientRect();
    var left = pos.left;
    var top = pos.top;

    var w = box.width;
    var h = box.height;

    var x = left;
    var y = top;

    if (left + w > rect.width) {
        x = rect.width - w;
    }

    if (top + h > rect.height) {
        y = rect.height - h;
    }
    return {
        left: x,
        top: y
    };
}

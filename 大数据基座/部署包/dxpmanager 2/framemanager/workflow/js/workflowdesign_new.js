var my_r;
var my_EpointWorkFlow;
var my_Y = 0;
var my_X = 0;
var my_path,_pa,_list,_arr,_re,_tex,_im,_bp,_bdo,_pas,_uid;
(function ($) {
    var EpointWorkFlow = {}, _states = {}, _paths = {}, isCtrlKeyDown = false, selectedStates = {};
    EpointWorkFlow.config = {
        editable: true,
        lineHeight: 15,
        basePath: '',
        rect: {// 状态
            attr: {
                x: 0,
                y: 0,
                width: 40,
                height: 60,
                r: 5,
                fill: '90-#fff-#C0C0C0',
                stroke: '#000',
                "stroke-width": 1,
                "cursor": "Move"
            },
            showType: 'image&text',// image,text,image&text
            type: 'state',
            // name: {
            // text: 'state'
            // },
            text: {
                text: '状态',
                'font-size': 12,
                "cursor": "Move"
            },
            margin: 3,
            props: [],
            img: {
                attr: { "cursor": "Move" }
            }
        },
        path: {// 路径转换
            attr: {
                path: {
                    path: 'M10 10L100 100',
                    stroke: '#808080',
                    fill: "none",
                    "stroke-width": 3
                },
                arrow: {
                    path: 'M10 10L10 10',
                    stroke: '#808080',
                    fill: "#808080",
                    "stroke-width": 3,
                    radius: 4
                },
                fromDot: {
                    width: 6,
                    height: 6,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                toDot: {
                    width: 6,
                    height: 6,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                bigDot: {
                    width: 8,
                    height: 8,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                smallDot: {
                    width: 6,
                    height: 6,
                    stroke: '#fff',
                    fill: '#000',
                    cursor: "move",
                    "stroke-width": 3
                },
                text: {
                    cursor: "move",
                    'background': '#000'
                }
            },
            text: {
                patten: 'TO {to}',
                textPos: {
                    x: 0,
                    y: -10
                }
            },
            props: {
                text: {
                    name: 'text',
                    label: '显示',
                    value: '',
                    editor: function () {
                        return new EpointWorkFlow.editors.textEditor();
                    }
                }
            }
        },
        tools: {// 工具栏
            attr: {
                left: 10,
                top: 10
            },
            pointer: {},
            path: {},
            states: {},
            save: {
                onclick: function (data) {
                    alert(data);
                }
            }
        },
        props: {// 属性编辑器
            attr: {
                top: 10,
                right: 30
            },
            props: {}
        },
        restore: '',
        activeRects: {// 当前激活状态
            rects: [],
            rectAttr: {
                stroke: '#ff0000',
                "stroke-width": 2
            }
        },
        historyRects: {// 历史激活状态
            rects: [],
            pathAttr: {
                path: {
                    stroke: '#00ff00'
                },
                arrow: {
                    stroke: '#00ff00',
                    fill: "#00ff00"
                }
            }
        },
        // mn添加，第二次初始化不再重现创建Raphael。用上一次的。
        flag: {}
    };

    EpointWorkFlow.util = {
        isLine: function (p1, p2, p3) {// 三个点是否在一条直线上
            var s, p2y;
            if ((p1.x - p3.x) == 0)
                s = 1;
            else
                s = (p1.y - p3.y) / (p1.x - p3.x);
            p2y = (p2.x - p3.x) * s + p3.y;
            // $('body').append(p2.y+'-'+p2y+'='+(p2.y-p2y)+', ');
            if ((p2.y - p2y) < 10 && (p2.y - p2y) > -10) {
                p2.y = p2y;
                return true;
            }
            return false;
        },
        center: function (p1, p2) {// 两个点的中间点
            return {
                x: (p1.x - p2.x) / 2 + p2.x,
                y: (p1.y - p2.y) / 2 + p2.y
            };
        },
        nextId: function () {
            try {
                var MaxID = 0, tempID;
                $.each(_states, function (k, node) {
                    if (node != null) {
                        MaxID = Math.max(parseInt(node.getVMLId()), MaxID);
                    }

                })
                $.each(_paths, function (k, line) {
                    if (line != null) {
                        MaxID = Math.max(parseInt(line.getVMLId()), MaxID);
                    }
                });
                MaxID++;
                return MaxID;
            }
            catch (err) {
                debugger;
            }
        },
        connPoint: function (rect, p) {// 计算矩形中心到p的连线与矩形的交叉点
            var start = p, end = {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2
            };
            // 计算正切角度
            var tag = (end.y - start.y) / (end.x - start.x);
            tag = isNaN(tag) ? 0 : tag;

            var rectTag = rect.height / rect.width;
            // 计算箭头位置
            var xFlag = start.y < end.y ? -1 : 1,
                yFlag = start.x < end.x ? -1 : 1,
                arrowTop, arrowLeft;
            // 按角度判断箭头位置
            if (Math.abs(tag) > rectTag && xFlag == -1) {// top边
                arrowTop = end.y - rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) > rectTag && xFlag == 1) {// bottom边
                arrowTop = end.y + rect.height / 2;
                arrowLeft = end.x + xFlag * rect.height / 2 / tag;
            } else if (Math.abs(tag) < rectTag && yFlag == -1) {// left边
                arrowTop = end.y + yFlag * rect.width / 2 * tag;
                arrowLeft = end.x - rect.width / 2;
            } else if (Math.abs(tag) < rectTag && yFlag == 1) {// right边
                arrowTop = end.y + rect.width / 2 * tag;
                arrowLeft = end.x + rect.width / 2;
            }
            return {
                x: arrowLeft,
                y: arrowTop
            };
        },

        arrow: function (p1, p2, r) {// 画箭头，p1 开始位置,p2 结束位置, r前头的边长
            var atan = Math.atan2(p1.y - p2.y, p2.x - p1.x) * (180 / Math.PI);

            var centerX = p2.x - r * Math.cos(atan * (Math.PI / 180));
            var centerY = p2.y + r * Math.sin(atan * (Math.PI / 180));

            var x2 = centerX + r * Math.cos((atan + 120) * (Math.PI / 180));
            var y2 = centerY - r * Math.sin((atan + 120) * (Math.PI / 180));

            var x3 = centerX + r * Math.cos((atan + 240) * (Math.PI / 180));
            var y3 = centerY - r * Math.sin((atan + 240) * (Math.PI / 180));
            return [p2, {
                x: x2,
                y: y2
            }, {
                x: x3,
                y: y3
            }];
        },

        fitPaper: function (_r, x, y) {
            var w = $('#WorkFlowWrapper').width(), h = $('#WorkFlowWrapper').height(), scrollRight = 0, scrollDown = 0;
            if (x > w) {
                $('#WorkFlowWrapper').width(x);
                scrollRight = x - w;
            }
            else
                x = w;
            if (y > h) {
                $('#WorkFlowWrapper').height(y);
                scrollDown = y - h;
            }
            else
                y = h;
            if (scrollRight > 0 || scrollDown > 0) {
                _r.setSize(x, y);
                $('#WorkFlowWrapperBg').scrollLeft(x - $('#WorkFlowWrapperBg').width()).scrollTop(y - $('#WorkFlowWrapperBg').height());
            }
        }
    }

    EpointWorkFlow.rect = function (o, r) {
        var _this = this, _uid = typeof o.id == "undefined" ? EpointWorkFlow.util.nextId() : o.id, _o = $.extend(true, {}, EpointWorkFlow.config.rect, o),
                        _id = 'rect' + _uid, _r = r, // Raphael画笔
        _rect, _img, // 图标
        // _name, // 状态名称
        _text, // 显示文本
        _ox, _oy, _outPath = [], _inPath = []; // 拖动时，保存起点位置;
        // _o.text.text += _uid;

        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
                        _o.attr.r).hide().attr(_o.attr);

        _img = _r.image(EpointWorkFlow.config.basePath + _o.img.src,
                        _o.attr.x + _o.img.width / 2,
                        _o.attr.y + (_o.attr.height - _o.img.height) / 2, _o.img.width,
                        _o.img.height).attr(_o.img.attr).hide();
        // _name = _r.text(
        // _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
        //                _o.attr.y + EpointWorkFlow.config.lineHeight / 2, _o.name.text).hide()
        // .attr(_o.name);
        _text = _r.text(
                        _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
                        _o.attr.y + (_o.attr.height - EpointWorkFlow.config.lineHeight) / 2
                                        + EpointWorkFlow.config.lineHeight, _o.text.text).hide()
                        .attr(_o.text);// 文本

        // 拖动处理----------------------------------------
        _rect.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        _img.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });
        // _name.drag(function (dx, dy) {
        // dragMove(dx, dy);
        // }, function () {
        // dragStart()
        // }, function () {
        // dragUp();
        // });
        _text.drag(function (dx, dy) {
            dragMove(dx, dy);
        }, function () {
            dragStart()
        }, function () {
            dragUp();
        });

        var dragMove = function (dx, dy) {// 拖动中
            if (!EpointWorkFlow.config.editable)
                return;

            var x = (_ox + dx);// -((_ox+dx)%10);
            var y = (_oy + dy);// -((_oy+dy)%10);

            _bbox.x = x - _o.margin;
            if (x < 5)
                return false;
            _bbox.y = y - _o.margin;

            resize();

        };

        var dragStart = function () {// 开始拖动
            _ox = _rect.attr("x");
            _oy = _rect.attr("y");
            _rect.attr({
                opacity: 0.5
            });
            _img.attr({
                opacity: 0.5
            });
            _text.attr({
                opacity: 0.5
            });
        };

        var dragUp = function () {// 拖动结束
            _rect.attr({
                opacity: 1
            });
            _img.attr({
                opacity: 1
            });
            _text.attr({
                opacity: 1
            });
            EpointWorkFlow.util.fitPaper(_r, _bbox.x + _bbox.width + _o.margin + 20, _bbox.y + _bbox.height + 20 + _o.margin);
        };

        // 改变大小的边框
        var _bpath, _bdots = {}, _bw = 5, _bbox = {
            x: _o.attr.x - _o.margin,
            y: _o.attr.y - _o.margin,
            width: _o.attr.width + _o.margin * 2,
            height: _o.attr.height + _o.margin * 2
        };

        _bpath = _r.path('M0 0L1 1').hide();
        _bdots['t'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 't');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw / 2, 't');
        // }, function () {
        // });// 上
        _bdots['lt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'nw-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'lt');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'lt');
        // }, function () {
        // });// 左上
        _bdots['l'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'l');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'l');
        // }, function () {
        // });// 左
        _bdots['lb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'sw-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'lb');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'lb');
        // }, function () {
        // });// 左下
        _bdots['b'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'b');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'b');
        // }, function () {
        // });// 下
        _bdots['rb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'se-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'rb');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'rb');
        // }, function () {
        // });// 右下
        _bdots['r'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'r');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'r')
        // }, function () {4
        // });// 右
        _bdots['rt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'ne-resize'
        }).hide();
        // .drag(function (dx, dy) {
        // bdragMove(dx, dy, 'rt');
        // }, function () {
        // bdragStart(this.attr('x') + _bw / 2, this.attr('y') + _bw
        // / 2, 'rt')
        // }, function () {
        // });// 右上
        //$([_bdots['t'].node, _bdots['lt'].node, _bdots['l'].node, _bdots['lb'].node, _bdots['b'].node, _bdots['rb'].node, _bdots['r'].node, _bdots['rt'].node]).click(function () { return false; });

        // var bdragMove = function (dx, dy, t) {
        // if (!EpointWorkFlow.config.editable)
        // return;
        // var x = _bx + dx, y = _by + dy;
        // switch (t) {
        // case 't':
        // _bbox.height += _bbox.y - y;
        // _bbox.y = y;
        // break;
        // case 'lt':
        // _bbox.width += _bbox.x - x;
        // _bbox.height += _bbox.y - y;
        // _bbox.x = x;
        // _bbox.y = y;
        // break;
        // case 'l':
        // _bbox.width += _bbox.x - x;
        // _bbox.x = x;
        // break;
        // case 'lb':
        // _bbox.height = y - _bbox.y;
        // _bbox.width += _bbox.x - x;
        // _bbox.x = x;
        // break;
        // case 'b':
        // _bbox.height = y - _bbox.y;
        // break;
        // case 'rb':
        // _bbox.height = y - _bbox.y;
        // _bbox.width = x - _bbox.x;
        // break;
        // case 'r':
        // _bbox.width = x - _bbox.x;
        // break;
        // case 'rt':
        // _bbox.width = x - _bbox.x;
        // _bbox.height += _bbox.y - y;
        // _bbox.y = y;
        // break;
        // }
        // resize();
        // // $('body').append(t);
        // };
        // var bdragStart = function (ox, oy, t) {
        // _bx = ox;
        // _by = oy;
        // };

        // 事件处理--------------------------------
        $([_rect.node, _text.node, _img.node]) // _name.node,
            .on('click', function () {
                if (!EpointWorkFlow.config.editable)
                    return;
                // 徐国春屏蔽，暂时不现实框
                showBox();
                var mod = $(_r).data('mod');
                switch (mod) {
                    case 'pointer':
                        break;
                    case 'path':
                        var pre = $(_r).data('currNode');
                        if (pre && pre.getId() != _id && pre.getId().substring(0, 4) == 'rect') {
                            $(_r).trigger('addpath', [pre, _this]);
                        }
                        break;
                }
                var prevNode = $(_r).data('currNode');
                if (prevNode && isCtrlKeyDown)
                    selectedStates[prevNode.getId()] = prevNode;
                $(_r).trigger('click', _this);
                $(_r).data('currNode', _this);
                return false;
            })
            .contextMenu('ie5menu1', {
                bindings: {
                    "OpenEdit": function () {
                        var title, w, h, pageName;
                        switch (o.type) {
                        case "ManualTemplete":
                            title = "人工活动配置模板";
                            w = 1100;
                            h = 500;
                            pageName = "activitytempleteframe";
                            break
                            case "Manual":
                                title = "人工活动详细信息";
                                w = 1100;
                                h = document.body.clientHeight - 100;
                                pageName = "activitymanualframe";
                                break
                            case "SubProcess":
                                title = "子流程活动";
                                w = 1100;
                                h = 482;
                                pageName = "activitysubprocessframe";
                                break
                            case "Router":
                                title = "路由详细信息";
                                w = 950;
                                h = 300;
                                pageName = "activityrouterframe";
                                break
                            case "External":
                                title = "外部活动详细信息";
                                w = 1100;
                                h = document.body.clientHeight - 100;
                                pageName = "activityexternalframe";
                                break
                            case "Browser":
                                title = "浏览活动详细信息";
                                w = 950;
                                h = 450;
                                pageName = "activitybrowserframe";
                                break
                        }
                        if (o.type == "Begin" || o.type == "End") {
                        	epoint.alert('开始节点或者结束节点没有设置属性', '提示');
                            return;
                        }
                        epoint.openDialog(title, 'framemanager/workflow/design/' + pageName + '?pid='+_uid+'&mainPVActivityGuid='+MainPVActivityGuid+'&processVersionGuid='+ProcessVersionGuid, afterInsertActivity, {
        					'width' : w,
        					'height' : h
        				});
                        function afterInsertActivity(data) {
                        	console.log(data);
                        	if (param){
                            	if(param.Added){
                            		o.id = _id;
                                    o.text = { text: param.Text };
                                    var rect = new EpointWorkFlow.rect($.extend(true, {}, EpointWorkFlow.config.tools.states[type], o), _r), title, pageName, h, w;
                                    _states[rect.getId()] = rect;
                            	}else if(o.text.text!=param.Text){
                            		_text.attr('text', param.Text);
                                }
                              param = null;	
                        	}
                        }
                    },
                    "Del": function () {
                        _this.remove();
                    }
                }
            });

        var clickHandler = function (e, src) {
            if (!EpointWorkFlow.config.editable)
                return;
            if (src.getId() == _id) {
                if (isCtrlKeyDown)
                    selectedStates[_id] = _this;
                else
                    $(_r).trigger('showprops', [_o.props, src]);
            } else {
                if (!isCtrlKeyDown)
                    hideBox();
            }
        };
        $(_r).on('click', clickHandler);

        var textchangeHandler = function (e, text, src) {
            if (src.getId() == _id) {
                _text.attr({
                    text: text
                });
            }
        };
        $(_r).on('textchange', textchangeHandler);

        // 私有函数-----------------------
        // 边框路径
        function getBoxPathString() {
            return 'M' + _bbox.x + ' ' + _bbox.y + 'L' + _bbox.x + ' '
                            + (_bbox.y + _bbox.height) + 'L' + (_bbox.x + _bbox.width)
                            + ' ' + (_bbox.y + _bbox.height) + 'L'
                            + (_bbox.x + _bbox.width) + ' ' + _bbox.y + 'L' + _bbox.x
                            + ' ' + _bbox.y;
        }
        // 显示边框
        function showBox() {
            _bpath.show();
            for (var k in _bdots) {
                _bdots[k].show();
            }
        }
        // 隐藏
        function hideBox() {
            selectedStates = {};
            _bpath.hide();
            for (var k in _bdots) {
                _bdots[k].hide();
            }
        }

        // 根据_bbox，更新位置信息
        function resize() {
            var rx = _bbox.x + _o.margin, ry = _bbox.y + _o.margin, rw = _bbox.width
                            - _o.margin * 2, rh = _bbox.height - _o.margin * 2;

            _rect.attr({
                x: rx,
                y: ry,
                width: rw,
                height: rh
            });
            switch (_o.showType) {
                case 'image':
                    _img.attr({
                        x: rx + (rw - _o.img.width) / 2,
                        y: ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
                case 'text':
                    _rect.show();
                    _text.attr({
                        x: rx + rw / 2,
                        y: ry + rh / 2
                    }).show();// 文本
                    break;
                case 'image&text':
                    // _rect.show();
                    // _name.attr({
                    // x: rx + _o.img.width + (rw - _o.img.width) / 2,
                    // y: ry + EpointWorkFlow.config.lineHeight / 2
                    // }).show();
                    _text.attr({
                        x: rx + (_bbox.width - _o.img.width) / 2 - 2 + _o.img.width / 2,//rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + 45 //ry + (rh - EpointWorkFlow.config.lineHeight) / 2  + EpointWorkFlow.config.lineHeight
                    }).show();// 文本
                    _img.attr({
                        x: rx + (_bbox.width - _o.img.width) / 2 - 2, //rx + _o.img.width / 2,
                        y: ry + 5   // ry + (rh - _o.img.height) / 2
                    }).show();
                    break;
            }

            _bdots['t'].attr({
                x: _bbox.x + _bbox.width / 2 - _bw / 2,
                y: _bbox.y - _bw / 2
            });// 上
            _bdots['lt'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2
            });// 左上
            _bdots['l'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            });// 左
            _bdots['lb'].attr({
                x: _bbox.x - _bw / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 左下
            _bdots['b'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width / 2,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 下
            _bdots['rb'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height
            });// 右下
            _bdots['r'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2 + _bbox.height / 2
            });// 右
            _bdots['rt'].attr({
                x: _bbox.x - _bw / 2 + _bbox.width,
                y: _bbox.y - _bw / 2
            });// 右上
            _bpath.attr({
                path: getBoxPathString()
            });



            $(_r).trigger('rectresize', _this);
        };

        // 函数----------------
        // 转化json字串
        this.toJson = function () {

            return '<Node><Id>' + this.getVMLId() + '</Id><X>' + Math.round(_rect.attr('x')) * 10 + '</X><Y>' + (Math.round(_rect.attr('y'))) * 10 + '</Y></Node>';

            // var data = "{type:'" + _o.type + "',text:{text:'"
            // + _text.attr('text') + "'}, attr:{ x:"
            // + Math.round(_rect.attr('x')) + ", y:"
            // + Math.round(_rect.attr('y')) + ", width:"
            // + Math.round(_rect.attr('width')) + ", height:"
            // + Math.round(_rect.attr('height')) + "}, props:{";
            // for (var k in _o.props) {
            // data += k + ":{value:'"
            // + _o.props[k].value + "'},";
            // }
            // if (data.substring(data.length - 1, data.length) == ',')
            // data = data.substring(0, data.length - 1);
            // data += "}}";
            // return data;
        };
        this.toJson2 = function () {

            return '<Node><Id>' + this.getVMLId() + '</Id><X>' + Math.round(_rect.attr('x')) * 10 + '</X><Y>' + (Math.round(_rect.attr('y'))) * 10 + '</Y>' + '<Name>' + _o.text.text + '</Name><Type>' + _o.type + '</Type></Node>';

        };
        // 从数据中恢复图
        this.restore = function (data) {
            var obj = data;
            // if (typeof data === 'string')
            // obj = eval(data);

            _o = $.extend(true, _o, data);

            _text.attr({
                text: obj.text.text
            });
            resize();
        };
        this.getBBox = function () {
            return _bbox;
        };
        this.getId = function () {
            return _id;
        };
        this.getVMLId = function () {
            return _uid;
        };
        this.get_text = function () {
            return _text;
        };
        this.get_img = function () {
            return _img;
        };
        this.get_rect = function () {
            return _rect;
        };
        this.get_bpath = function () {
            return _bpath;
        };
        this.get_bdots = function () {
            return _bdots;
        };
        this.geto = function () {
            return o;
        };
        this.remove = function () {
            if (o.type == "Begin" || o.type == "End") {
            	epoint.alert('开始节点或者结束节点不支持删除', '提示');
                return;
            }
            epoint.confirm('您确定删除当前活动吗？',null,function () {
            	_re = _rect;
                _tex = _text;
                _im = _img;
                _bp = _bpath;
                _bdo = _bdots;
                _pas = _paths;
                deleteNode(o.type,_uid)
            });
            
// epoint.dialog.confirm("您确定删除当前活动吗？", function () {
//
// deleteNode(o.type, ProcessVersionGuid, _uid, function () {
// _rect.remove();
// _text.remove();
// //_name.remove();
// _img.remove();
// _bpath.remove();
// for (var k in _bdots) {
// _bdots[k].remove();
// }
// for (var k in _paths) {
// if (_paths[k] == null) {
// continue;
// }
//                        if (_paths[k].to().getVMLId() == _uid || _paths[k].from().getVMLId() == _uid) {
// _paths[k].remove();
// }
// }
// }, onFail);
// });

        };
        this.text = function (text) {
            if (arguments.length == 1)
                _text.attr('text', text);
            else
                return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr)
                _rect.attr(attr);
        };
        this.setCursor = function (attr) {
            if (attr) {
                _rect.attr(attr);
                _text.attr(attr);
                _img.attr(attr);
            }
        };
        this.getInPath = function () {
            return _inPath;
        };
        this.getOutPath = function () {
            return _outPath;
        };
        this.setPosition = function (x, y) {
            if (!EpointWorkFlow.config.editable)
                return;
            _bbox.x = x || _bbox.x;
            _bbox.y = y || _bbox.y;
            resize();

        };
        this.setPositionX = function (x) {
            if (!EpointWorkFlow.config.editable)
                return;
            _bbox.x = x;
            resize();

        };
        this.setPositionY = function (y) {
            if (!EpointWorkFlow.config.editable)
                return;
            _bbox.y = y;
            resize();

        };
        resize();// 初始化位置
        EpointWorkFlow.util.fitPaper(_r, _bbox.x + _bbox.width + _o.margin + 20, _bbox.y + _bbox.height + 20 + _o.margin);
    };

    EpointWorkFlow.path = function (o, r, from, to) {
        var _this = this, _r = r, _o = $.extend(true, {}, EpointWorkFlow.config.path), _path, _arrow, _text, _needCheck = true,
            _textPos = _o.text.textPos, _ox, _oy, _from = from, _to = to, _id = 'path' + (typeof o.id == "undefined" ? EpointWorkFlow.util.nextId() : o.id), _dotList, _autoText = true,
            _intersectionPaths = {}, _ignorePaths = {};
        // _ignorePaths,是指在计算交叉点时需要忽略的路径
        // _intersectionPaths，是指和本路径相交的路径

        // 函数-------------------------------------------------
        this.from = function () {
            return _from;
        };
        this.to = function () {
            return _to;
        };
        // 转化json数据
        this.toJson = function () {

            var data = '<Action><Id>' + this.getVMLId() + '</Id><FromActivityGuid></FromActivityGuid><ToActivityGuid></ToActivityGuid><Points>';

            data += _dotList.toJson().replace("[", "").replace("]", "");
            // var data = "{from:'" + _from.getId() + "',to:'" + _to.getId()
            //                + "', dots:" + _dotList.toJson() // + ",text:{text:'" + _text.attr('text') + "',textPos:{x:"+ Math.round(_textPos.x) + ",y:" + Math.round(_textPos.y) + "}"
            // + "}, props:{";
            // for (var k in _o.props) {
            // data += k + ":{value:'"
            // + _o.props[k].value + "'},";
            // }
            // if (data.substring(data.length - 1, data.length) == ',')
            // data = data.substring(0, data.length - 1);
            data += '</Points></Action>';
            return data;
        };
        // 转化json2数据
        this.toJson2 = function () {

            var data = '<Action><Id>' + this.getVMLId() + '</Id><FromActivityGuid>' + _from.getVMLId() + '</FromActivityGuid><ToActivityGuid>' + _to.getVMLId() + '</ToActivityGuid><Points>';

            data += _dotList.toJson();
            data += '</Points></Action>';
            return data;
        };
        // 恢复
        this.restore = function (data) {
            var obj = data;

            _o = $.extend(true, _o, data);
            // $('body').append('['+_text.attr('text')+','+_o.text.text+']');
            // if (_text.attr('text') != _o.text.text) {
            // //$('body').append('['+_text.attr('text')+','+_o.text.text+']');
            //    _text.attr({ text:"id=path" + _id + " from " +  from.getId() + "  to  " + to.getId() });
            // _autoText = false;
            // }

            _dotList.restore(obj.dots);
        };
        // 删除
        this.remove = function () {
// epoint.dialog.confirm("您确定删除当前变迁吗？", function () {
            epoint.confirm('您确定删除当前变迁吗？',null,function () {
            	_list = _dotList;
            	_arr = _arrow;
            	_pa = _path;
            	deleteNode("Hdbq",_id.replace("path", ""))
            }
            );
        };
       	
        this.removePath = function () {
          _dotList.remove();
          _path.remove();
          _arrow.remove();
          // _text.remove();
          try {
              $(_r).off('click', clickHandler);
          } catch (e) {
          }
          try {
              $(_r).off('removerect', removerectHandler);
          } catch (e) {
          }
          try {
              $(_r).off('rectresize', rectresizeHandler);
          } catch (e) {
          }
          try {
              $(_r).off('textchange', textchangeHandler);
          } catch (e) {
          }
      };
        
//      PageMethods.DeleteNode("Hdbq", ProcessVersionGuid, _id.replace("path", ""), function () {
// _dotList.remove();
// _path.remove();
// _arrow.remove();
// //_text.remove();
// try {
// $(_r).unbind('click', clickHandler);
// } catch (e) {
// }
// try {
// $(_r).unbind('removerect', removerectHandler);
// } catch (e) {
// }
// try {
// $(_r).unbind('rectresize', rectresizeHandler);
// } catch (e) {
// }
// try {
// $(_r).unbind('textchange', textchangeHandler);
// } catch (e) {
// }
// }, onFail);
// });
      
      // 删除图标
      this.removePath = function () {
          _dotList.remove();
          _path.remove();
          _arrow.remove();
          // _text.remove();
          try {
              $(_r).off('click', clickHandler);
          } catch (e) {
          }
          try {
              $(_r).off('removerect', removerectHandler);
          } catch (e) {
          }
          try {
              $(_r).off('rectresize', rectresizeHandler);
          } catch (e) {
          }
          try {
              $(_r).off('textchange', textchangeHandler);
          } catch (e) {
          }
      };

        // 刷新路径
        function refreshpath() {
            var p = _dotList.toPathString(), mid = _dotList.midDot().pos();
            _path.attr({
                path: p[0]
            });
            _arrow.attr({
                path: p[1]
            });
            // _text.attr({
            // x: mid.x + _textPos.x,
            // y: mid.y + _textPos.y
            // });
            // $('body').append('refresh.');
        }
        this.refreshpath = refreshpath;
        this.getPath = function () {
            return _path.attr("path");
        }
        this.getId = function () {
            return _id;
        };
        this.getVMLId = function () {
            return parseInt(_id.replace("path", ""));
        };
        this.get_dotList = function () {
            return _dotList;
        };
        this.get_path = function () {
            return _path;
        };
        this.get_arrow = function () {
            return _arrow;
        };
        this.get_r = function () {
            return _r;
        };
        this.text = function () {
            return "";
            // return _text.attr('text');
        };
        this.attr = function (attr) {
            if (attr && attr.path)
                _path.attr(attr.path);
            if (attr && attr.arrow)
                _arrow.attr(attr.arrow);
            // $('body').append('aaaaaa');
        };
        this.intersectionPaths = function (p) {
            if (p)
                _intersectionPaths[p.getId()] = p;
            else
                return _intersectionPaths;
        };
        // /在移动path或者node的时候，需要设置相交线条的或略项。
        this.ignorePaths = function (p, isAdd) {
            if (p) {
                if (isAdd)
                    _ignorePaths[p.getId()] = p;
                else
                    delete _ignorePaths[p.getId()];
            }
            else
                return _ignorePaths;
        };

        // 点
        function dot(type, pos, left, right) {
            var _thisDot = this, _t = type, _n, _lt = left, _rt = right, _ox, _oy, // 缓存移动前时位置
            _pos = pos;// 缓存位置信息{x,y}, 注意：这是计算出中心点

            switch (_t) {
                case 'from':
                    _n = _r.rect(pos.x - _o.attr.fromDot.width / 2,
                                    pos.y - _o.attr.fromDot.height / 2,
                                    _o.attr.fromDot.width, _o.attr.fromDot.height)
                                    .attr(_o.attr.fromDot);
                    break;
                case 'big':
                    _n = _r.rect(pos.x - _o.attr.bigDot.width / 2,
                                    pos.y - _o.attr.bigDot.height / 2,
                                    _o.attr.bigDot.width, _o.attr.bigDot.height)
                                    .attr(_o.attr.bigDot);
                    break;
                case 'small':
                    _n = _r.rect(pos.x - _o.attr.smallDot.width / 2,
                                    pos.y - _o.attr.smallDot.height / 2,
                                    _o.attr.smallDot.width, _o.attr.smallDot.height)
                                    .attr(_o.attr.smallDot);
                    break;
                case 'to':
                    _n = _r.rect(pos.x - _o.attr.toDot.width / 2,
                                    pos.y - _o.attr.toDot.height / 2,
                                    _o.attr.toDot.width, _o.attr.toDot.height)
                                    .attr(_o.attr.toDot);

                    break;
            }
            if (_n && (_t == 'big' || _t == 'small')) {
                _n.drag(function (dx, dy) {
                    dragMove(dx, dy);
                }, function () {
                    dragStart()
                }, function () {
                    dragUp();
                });// 初始化拖动
                var dragMove = function (dx, dy) {// 拖动中
                    var x = (_ox + dx), y = (_oy + dy);
                    _thisDot.moveTo(x, y, false);
                };

                var dragStart = function () {// 开始拖动
                    if (_t == 'big') {
                        _ox = _n.attr("x") + _o.attr.bigDot.width / 2;
                        _oy = _n.attr("y") + _o.attr.bigDot.height / 2;
                    }
                    if (_t == 'small') {
                        _ox = _n.attr("x") + _o.attr.smallDot.width / 2;
                        _oy = _n.attr("y") + _o.attr.smallDot.height / 2;
                    }
                    for (var key in _intersectionPaths) {
                        _intersectionPaths[key].ignorePaths(_this, true);
                        _intersectionPaths[key].refreshpath();
                        _intersectionPaths[key].ignorePaths(_this, false);
                    }

                };

                var dragUp = function () {// 拖动结束
                    refreshpath();
                };
            }
            $(_n.node).click(function () { return false; });

            this.type = function (t) {
                if (t)
                    _t = t;
                else
                    return _t;
            };
            this.node = function (n) {
                if (n)
                    _n = n;
                else
                    return _n;
            };
            this.left = function (l) {
                if (l)
                    _lt = l;
                else
                    return _lt;
            };
            this.right = function (r) {
                if (r)
                    _rt = r;
                else
                    return _rt;
            };
            this.remove = function () {
                _lt = null;
                _rt = null;
                _n.remove();
            };
            this.pos = function (pos) {
                if (pos) {
                    _pos = pos;
                    _n.attr({
                        x: _pos.x - _n.attr('width') / 2,
                        y: _pos.y - _n.attr('height') / 2
                    });
                    return this;
                } else {
                    return _pos
                }
            };

            this.moveTo = function (x, y) {
                this.pos({
                    x: x,
                    y: y
                });

                switch (_t) {
                    case 'from':
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(EpointWorkFlow.util.connPoint(_to.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt.pos(EpointWorkFlow.util.center(_pos, _rt.right().pos()));
                        }
                        break;
                    case 'big':
                        if (_rt && _rt.right() && _rt.right().type() == 'to') {
                            _rt.right().pos(EpointWorkFlow.util.connPoint(_to.getBBox(), _pos));
                        }
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(EpointWorkFlow.util.connPoint(_from.getBBox(), _pos));
                        }
                        if (_rt && _rt.right()) {
                            _rt.pos(EpointWorkFlow.util.center(_pos, _rt.right().pos()));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(EpointWorkFlow.util.center(_pos, _lt.left().pos()));
                        }
                        // 三个大点在一条线上，移除中间的小点
                        var pos = {
                            x: _pos.x,
                            y: _pos.y
                        };
                        if (EpointWorkFlow.util.isLine(_lt.left().pos(), pos, _rt.right().pos())) {
                            _t = 'small';
                            _n.attr(_o.attr.smallDot);
                            this.pos(pos);
                            var lt = _lt;
                            _lt.left().right(_lt.right());
                            _lt = _lt.left();
                            lt.remove();
                            var rt = _rt;
                            _rt.right().left(_rt.left());
                            _rt = _rt.right();
                            rt.remove();
                            // $('body').append('ok.');
                        }
                        break;
                    case 'small':// 移动小点时，转变为大点，增加俩个小点
                        if (_lt && _rt && !EpointWorkFlow.util.isLine(_lt.pos(), {
                            x: _pos.x,
                            y: _pos.y
                        }, _rt.pos())) {

                            _t = 'big';

                            _n.attr(_o.attr.bigDot);
                            var lt = new dot('small', EpointWorkFlow.util.center(_lt.pos(), _pos), _lt, _lt.right());
                            _lt.right(lt);
                            _lt = lt;

                            var rt = new dot('small', EpointWorkFlow.util.center(_rt.pos(), _pos), _rt.left(), _rt);
                            _rt.left(rt);
                            _rt = rt;

                        }
                        break;
                    case 'to':
                        if (_lt && _lt.left() && _lt.left().type() == 'from') {
                            _lt.left().pos(EpointWorkFlow.util.connPoint(_from.getBBox(), _pos));
                        }
                        if (_lt && _lt.left()) {
                            _lt.pos(EpointWorkFlow.util.center(_pos, _lt.left().pos()));
                        }
                        break;
                }
                refreshpath();
            };
        }

        function dotList() {
            // if(!_from) throw '没有from节点!';
            var _fromDot, _toDot, _fromBB = _from.getBBox(), _toBB = _to
                            .getBBox(), _fromPos, _toPos;

            _fromPos = EpointWorkFlow.util.connPoint(_fromBB, {
                x: _toBB.x + _toBB.width / 2,
                y: _toBB.y + _toBB.height / 2
            });
            _toPos = EpointWorkFlow.util.connPoint(_toBB, _fromPos);

            //if (_o.dots.length || Math.abs(_fromPos.x - _toPos.x) < 10 || Math.abs(_fromPos.y - _toPos.y) < 10) {
            _fromDot = new dot('from', _fromPos, null, new dot('small', {
                x: (_fromPos.x + _toPos.x) / 2,
                y: (_fromPos.y + _toPos.y) / 2
            }));
            _fromDot.right().left(_fromDot);
            _toDot = new dot('to', _toPos, _fromDot.right(), null);
            _fromDot.right().right(_toDot);
            // } else {
            // //如果横向和纵向偏移均大于10个像素，增加转折中点
            // _fromDot = new dot('from', _fromPos, null, new dot('small', {
            // x: (_fromPos.x + _toPos.x) / 2,
            // y: _fromPos.y
            // }));
            // _fromDot.right().left(_fromDot);
            // var midDot1 = new dot('big',
            // { x: _toPos.x, y: _fromPos.y },
            // _fromDot.right(),
            //        new dot('small', { x: _toPos.x, y: (_fromPos.y + _toPos.y) / 2 }));
            // midDot1.right().left(midDot1);
            // _fromDot.right().right(midDot1);
            // _toDot = new dot('to', _toPos, midDot1.right(), null);
            // midDot1.right().right(_toDot);
            // }

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = [["M", d.pos().x, d.pos().y]], arr = '', subPath = []; // p = 'M' + d.pos().x + ' ' + d.pos().y,
                // 线的路径
                while (d.right()) {
                    // subPath[0] = ["M", d.pos().x, d.pos().y];
                    d = d.right();
                    p.push(["L", d.pos().x, d.pos().y]);
                    // subPath[1] = ["L", d.pos().x, d.pos().y];
                    // p = p.concat(this.checkIntersection(subPath));
                }

                // 箭头路径
                var arrPos = EpointWorkFlow.util.arrow(d.left().pos(), d.pos(),
                                _o.attr.arrow.radius);
                arr = 'M' + arrPos[0].x + ' ' + arrPos[0].y + 'L' + arrPos[1].x
                                + ' ' + arrPos[1].y + 'L' + arrPos[2].x + ' '
                                + arrPos[2].y + 'z';
                return [p.join(","), arr];
            };

            this.checkIntersection = function (p) {
                var rpath = [], index = -1, _tempPath;
                var getIndex = function (x, y) {
                    for (var j = 0; j < rpath.length; j += 2) {
                        if (Math.sqrt(Math.pow(x - p[0][1], 2) + Math.pow(y - p[0][2], 2)) >
                            Math.sqrt(Math.pow(rpath[j][1] - p[0][1], 2) + Math.pow(rpath[j][2] - p[0][2], 2)))
                            return j;
                    }
                    return rpath.length > 0 ? 0 : -1;
                }
                for (var pathId in _paths) {
                    _tempPath = _paths[pathId];
                    if (_tempPath.getId() == _id || _ignorePaths[_tempPath.getId()])
                        continue;
                    var ips = Raphael.pathIntersection(p.join(","), _paths[pathId].getPath());
                    if (ips.length) {
                        _tempPath.intersectionPaths(_this);
                        for (var i = 0; i < ips.length; i++) {
                            var atan = Math.atan2(p[0][2] - p[1][2], p[1][1] - p[0][1]) * (180 / Math.PI);
                            if (rpath.length > 1)
                                index = getIndex(ips[i].x, ips[i].y);
                            if (index == -1)
                                rpath.push(["L", (ips[i].x - 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y + 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)],
                                    ["A", 6, 6, 0, 0, 1, (ips[i].x + 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y - 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)] // ,
                                    );
                            else
                                rpath.splice(index, 0,
                                    ["L", (ips[i].x - 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y + 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)],
                                    ["A", 6, 6, 0, 0, 1, (ips[i].x + 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y - 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)] // ,
                                );
                        }
                    }
                }
                rpath.push(p[1]);
                return rpath;
            };
            this.toJson = function () {
                var data = "[", d = _fromDot;

                while (d) {
                    if (d.type() == 'big')
                        data += "{x:" + Math.round(d.pos().x) + ",y:"
                                        + Math.round(d.pos().y) + "},";
                    d = d.right();
                }
                if (data.substring(data.length - 1, data.length) == ',')
                    data = data.substring(0, data.length - 1);
                data += "]";
                return data;
            };
            this.restore = function (data) {
                var obj = data, d = _fromDot.right();
                for (var i = 0; i < obj.length; i++) {
                    d.moveTo(obj[i].x, obj[i].y, false);
                    d.moveTo(obj[i].x, obj[i].y, false);
                    d = d.right();
                }
                this.hide();
                refreshpath();
            };
            this.fromDot = function () {
                return _fromDot;
            };
            this.toDot = function () {
                return _toDot;
            };
            this.midDot = function () {// 返回中间点
                var mid = _fromDot.right(), end = _fromDot.right().right();
                while (end.right() && end.right().right()) {
                    end = end.right().right();
                    mid = mid.right();
                }
                return mid;
            };
            this.show = function () {
                var d = _fromDot;
                while (d) {
                    d.node().show();
                    d = d.right();
                }
            };
            this.hide = function () {
                var d = _fromDot;
                while (d) {
                    d.node().hide();
                    d = d.right();
                }
            };
            this.remove = function () {
                var d = _fromDot;
                while (d) {
                    if (d.right()) {
                        d = d.right();
                        d.left().remove();
                    } else {
                        d.remove();
                        d = null;
                    }
                }
            };
            // this.needCheckIntersection = function (needCheck) {
            // if (arguments.length == 1)
            // _needCheck = needCheck;
            // else
            // return _needCheck;
            // }
            this.findDot = function (index) {
                var _d = _fromDot;
                while (--index > -1 && _d.right()) {
                    _d = _d.right();
                }
                return _d;
            }
        }

        // 初始化操作
        _o = $.extend(true, _o, o);
        _path = _r.path(_o.attr.path.path).attr(_o.attr.path);
        _arrow = _r.path(_o.attr.arrow.path).attr(_o.attr.arrow);

        _dotList = new dotList();
        _dotList.hide();

        //_text = _r.text(0, 0, _o.text.text || _o.text.patten.replace('{from}', _from.text()).replace('{to}',
        // _to.text())).attr(_o.attr.text);
        // _text.drag(function (dx, dy) {
        // if (!EpointWorkFlow.config.editable)
        // return;
        // _text.attr({
        // x: _ox + dx,
        // y: _oy + dy
        // });
        // }, function () {
        // _ox = _text.attr('x');
        // _oy = _text.attr('y');
        // }, function () {
        // var mid = _dotList.midDot().pos();
        // _textPos = {
        // x: _text.attr('x') - mid.x,
        // y: _text.attr('y') - mid.y
        // };
        // });

        refreshpath();// 初始化路径

        // 事件处理--------------------
        $([_path.node, _arrow.node])
            .on('click', function () { // , _text.node
                if (!EpointWorkFlow.config.editable)
                    return;
                $(_r).trigger('click', _this);
                $(_r).data('currNode', _this);
                return false;
            })
            .contextMenu('ie5menu1', {
                bindings: {
                    "OpenEdit": function () {
                    	 epoint.openDialog("变迁设置", 'framemanager/workflow/design/activitytransitionframe?pid='+ _id.replace("path", "")+'&mainPVActivityGuid='+MainPVActivityGuid+'&processVersionGuid='+ProcessVersionGuid, '', {
         					'width' : 1100,
         					'height' : 500
         				});
                    },
                    "Del": function () {
                        _this.remove();

                    }
                }
            });

        // 处理点击事件，线或矩形
        var clickHandler = function (e, src) {
            if (!EpointWorkFlow.config.editable)
                return;
            if (src && src.getId() == _id) {
                _dotList.show();
                $(_r).trigger('showprops', [_o.props, _this]);
            } else {
                _dotList.hide();
            }
            var mod = $(_r).data('mod');
            switch (mod) {
                case 'pointer':

                    break;
                case 'path':

                    break;
            }

        };
        $(_r).on('click', clickHandler);

        // 删除事件处理
        var removerectHandler = function (e, src) {
            if (!EpointWorkFlow.config.editable)
                return;
            if (src && (src.getId() == _from.getId() || src.getId() == _to.getId())) {
                // _this.remove();
                $(_r).trigger('removepath', _this);
            }
        };
        $(_r).on('removerect', removerectHandler);

        // 矩形移动时间处理
        var rectresizeHandler = function (e, src) {
            if (!EpointWorkFlow.config.editable)
                return;
            if (_from && _from.getId() == src.getId()) {
                var rp;
                if (_dotList.fromDot().right() == null)
                    return;
                if (_dotList.fromDot().right().right().type() == 'to') {
                    rp = {
                        x: _to.getBBox().x + _to.getBBox().width / 2,
                        y: _to.getBBox().y + _to.getBBox().height / 2
                    };
                } else {
                    rp = _dotList.fromDot().right().right().pos();
                }
                var p = EpointWorkFlow.util.connPoint(_from.getBBox(), rp);
                _dotList.fromDot().moveTo(p.x, p.y);
                refreshpath();
            }
            if (_to && _to.getId() == src.getId()) {
                var rp;
                if (_dotList.toDot().left() == null) {
                    return;
                }
                if (_dotList.toDot().left().left().type() == 'from') {
                    rp = {
                        x: _from.getBBox().x + _from.getBBox().width / 2,
                        y: _from.getBBox().y + _from.getBBox().height / 2
                    };
                } else {
                    rp = _dotList.toDot().left().left().pos();
                }
                var p = EpointWorkFlow.util.connPoint(_to.getBBox(), rp);
                _dotList.toDot().moveTo(p.x, p.y);

                refreshpath();
            }
        };
        $(_r).on('rectresize', rectresizeHandler);

        // var textchangeHandler = function (e, v, src) {
        // if (src.getId() == _id) {// 改变自身文本
        // _text.attr({
        // text: v
        // });
        // _autoText = false;
        // }
        // //$('body').append('['+_autoText+','+_text.attr('text')+','+src.getId()+','+_to.getId()+']');
        // if (_autoText) {
        // if (_to.getId() == src.getId()) {
        // //$('body').append('change!!!');
        // _text.attr({
        // text: _o.text.patten.replace('{from}',
        // _from.text()).replace('{to}', v)
        // });
        // }
        // else if (_from.getId() == src.getId()) {
        // //$('body').append('change!!!');
        // _text.attr({
        // text: _o.text.patten.replace('{from}', v)
        // .replace('{to}', _to.text())
        // });
        // }
        // }
        // };
        // $(_r).bind('textchange', textchangeHandler);


    };

    EpointWorkFlow.props = function (o, r) {
        var _this = this, _pdiv = $('#myflow_props').hide()/*.draggable({
                                        handle : '#myflow_props_handle'
                                }).resizable().css(EpointWorkFlow.config.props.attr)*/.on('click',
                        function () {
                            return false;
                        }), _tb = _pdiv.find('table'), _r = r, _src;

        var showpropsHandler = function (e, props, src) {
            if (_src && _src.getId() == src.getId()) {// 连续点击不刷新
                return;
            }
            _src = src;
            $(_tb).find('.editor').each(function () {
                var e = $(this).data('editor');
                if (e)
                    e.destroy();
            });

            _tb.empty();
            _pdiv.show();
            for (var k in props) {
                _tb.append('<tr><th>' + props[k].label + '</th><td><div id="p'
                                + k + '" class="editor"></div></td></tr>');
                if (props[k].editor)
                    props[k].editor().init(props, k, 'p' + k, src, _r);
                // $('body').append(props[i].editor+'a');
            }
        };
        $(_r).on('showprops', showpropsHandler);

    };

    // 属性编辑器
    EpointWorkFlow.editors = {
        textEditor: function () {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props;
                _k = k;
                _div = div;
                _src = src;
                _r = r;

                $('<input  style="width:100%;"/>').val(_src.text()).change(
                                function () {
                                    props[_k].value = $(this).val();
                                    $(_r).trigger('textchange', [$(this).val(), _src]);
                                }).appendTo('#' + _div);
                // $('body').append('aaaa');

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                    $(_r).trigger('textchange', [$(this).val(), _src]);
                });
                // $('body').append('destroy.');
            };
        }
    };

    // 初始化流程
    EpointWorkFlow.init = function (c, o) {
        var _w = $(window).width() - 44, _h = $(window).height() - 10;
        var _r;
        _r = Raphael(c, _w, _h);
        my_r = _r;
        $.extend(true, EpointWorkFlow.config, o);
        /**
		 * 删除： 删除状态时，触发removerect事件，连接在这个状态上当路径监听到这个事件，触发removepath删除自身；
		 * 删除路径时，触发removepath事件
		 */
        $(document).keydown(function (arg) {
            if (!EpointWorkFlow.config.editable)
                return;
            switch (arg.keyCode) {
                // Delete Key
                case 46:
                    var c = $(_r).data('currNode');
                    if (c) {
                        if (c.getId().substring(0, 4) == 'rect') {
                            $(_r).trigger('removerect', c);
                        } else if (c.getId().substring(0, 4) == 'path') {
                            $(_r).trigger('removepath', c);
                        }

                        $(_r).removeData('currNode');
                    }
                    break;
                case 17:
                    isCtrlKeyDown = true;
                    break;
            }
        }).keyup(function (arg) {
            if (!EpointWorkFlow.config.editable)
                return;
            switch (arg.keyCode) {
                case 17:
                    isCtrlKeyDown = false;
                    selectedStates = {};
                    $(_r).trigger('click', {
                        getId: function () {
                            return '00000000';
                        }
                    });
                    break;
            }
        }).click(function () {
            selectedStates = {};
            $(_r).data('currNode', null);
            $(_r).trigger('click', {
                getId: function () {
                    return '00000000';
                }
            });
            $(_r).trigger('showprops', [EpointWorkFlow.config.props.props, {
                getId: function () {
                    return '00000000';
                }
            }]);
        });

        function setImageCursor(isMove) {
            // for (var k in _states)
            // _states[k].setCursor({ "cursor": isMove ? "move" : "default" });
        }

        // 删除事件
        var removeHandler = function (e, src) {
            if (!EpointWorkFlow.config.editable)
                return;
            if (src.getId().substring(0, 4) == 'rect') {
                _states[src.getId()] = null;
                src.remove();
            } else if (src.getId().substring(0, 4) == 'path') {
                _paths[src.getId()] = null;
                src.remove();
            }
        };
        $(_r).on('removepath', removeHandler);
        $(_r).on('removerect', removeHandler);

        // 添加状态
        $(_r).on('addrect', function (e, type, o) {
        	var activityType = "";
        	var templeteactguid = "";
        	switch (type) {
        	    case "ManualTemplete":
        	        title = "人工活动配置模板"; 
        	        w = 1100;
                    h = 500;
                    pageName = "activitytempleteframe";
                    break
            	case "Manual":
            	case "PassSign":
            	case "JoinSign":	
            		title = "人工活动详细信息"; 
            		if(type=="PassSign"){
            			title = "传签活动详细信息"; 
            			activityType = "1";
            		}
            		else if(type=="JoinSign"){
            			title = "会签活动详细信息"; 
            			activityType = "2";
            		}
// case "Manual":
// title = "人工活动详细信息";
                    w = 1100;
                    h = document.body.clientHeight - 100;
                    pageName = "activitymanualframe";
                    break
                case "SubProcess":
                    title = "子流程活动";
                    w = 1100;
                    h = 482;
                    pageName = "activitysubprocessframe";
                    break
                case "Suspension":
                    title = "悬挂待批活动";
                    w = 950;
                    h = 300;
                    pageName = "activitysuspensionframe";
                    break
                case "Router":
                    title = "路由详细信息";
                    w = 950;
                    h = 300;
                    pageName = "activityrouterframe";
                    break
                case "Browser":
                    title = "浏览活动详细信息";
                    w = 950;
                    h = 450;
                    pageName = "activitybrowserframe";
                    break
                case "External":
                    title = "外部活动详细信息";
                    w = 950;
                    h = 450;
                    pageName = "activityexternalframe";
                    break
                default:
	                if(type.indexOf("ManualByTemplete_") == 0){
	            		title = "人工活动详细信息（模板）"; 
	                    w = 1100;
	                    h = document.body.clientHeight - 100;
	                    pageName = "activitycommontempletecopy";
	                    templeteactguid = type.split("_")[1];
	                    type="ManualByTemplete";
	                }	
	                break
            }
            var _id = EpointWorkFlow.util.nextId();
            var url = 'framemanager/workflow/design/' + pageName + '?MaxID='+_id +'&IconX=' + o.attr.x * 10 + '&IconY=' + o.attr.y * 10 + '&mainPVActivityGuid='+MainPVActivityGuid+'&processVersionGuid='+ProcessVersionGuid;
            if(activityType){
            	url = url + '&activitytype='+activityType;
            }
            if(templeteactguid!=""){
            	url = url + '&bytempleteactguid='+templeteactguid;
            }
       	 	epoint.openDialog(title, url, afterInsertActivity, {
				'width' : w,
				'height' : h
			});
            
            function afterInsertActivity(data) {
            	if (param){
                	if(param.Added){
                		 o.id = _id;
                         o.text = { text: param.Text };
                         var rect = new EpointWorkFlow.rect($.extend(true, {}, EpointWorkFlow.config.tools.states[type], o), _r), title, pageName, h, w;
                         _states[rect.getId()] = rect;
                	}else if(o.text.text!=param.Text){
                		_text.attr('text', param.Text);
                    }
                	param = null;	
                }
            }
        });


        // 添加路径
        var addpathHandler = function (e, from, to) {
            var path = new EpointWorkFlow.path({}, _r, from, to);
            _paths[path.getId()] = path;
            workcheckIsCanAddHDBQ(from.getVMLId(), to.getVMLId(), path.getVMLId());
//            PageMethods.AddHdbq(ProcessVersionGuid, from.getVMLId(), to.getVMLId(), path.getVMLId(), null, onFail);

        };
        $(_r).on('addpath', addpathHandler);

        // 模式
        $(_r).data('mod', 'point');
        if (EpointWorkFlow.config.editable) {
            // 工具栏
            /*$("#myflow_tools").draggable({
                                    handle : '#myflow_tools_handle'
                            }).css(EpointWorkFlow.config.tools.attr);*/

            $('#toolBar div.node').hover(function () {
                $(this).addClass('mover');
            }, function () {
                $(this).removeClass('mover');
            });
            $('#toolBar .selectable').click(function () {
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                $(_r).data('mod', this.id);
                switch (this.id) {
                    case "pointer":
                        setImageCursor(true);
                        break;
                    case "path":
                        setImageCursor(false);
                        break;
                    case "save":
                        var xml = '<?xml version="1.0" standalone="no"?><WorkFlow><Attribute><ProcessVersionGuid>' + ProcessVersionGuid + '</ProcessVersionGuid></Attribute><Nodes>';
                        for (var k in _states) {
                            if (_states[k]) {
                                xml += _states[k].toJson();
                            }
                        }
                        xml += '</Nodes>';
                        xml += '<Actions>';
                        for (var k in _paths) {
                            if (_paths[k]) {
                                xml += _paths[k].toJson();
                            }
                        }
                        xml += '</Actions>';
                        xml += '</WorkFlow>';
                        EpointWorkFlow.config.tools.save.onclick(xml);
                }
            });

            $('#toolBar .clickable').click(function () {
                var pageName, w = 1000, h = 450, title, dialogid;
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                switch (this.id) {
                    case "save":
                        var xml = '<?xml version="1.0" standalone="no"?><WorkFlow><Attribute><ProcessVersionGuid>' + ProcessVersionGuid + '</ProcessVersionGuid></Attribute><Nodes>';
                        for (var k in _states) {
                            if (_states[k]) {
                                xml += _states[k].toJson();
                            }
                        }
                        xml += '</Nodes>';
                        xml += '<Actions>';
                        for (var k in _paths) {
                            if (_paths[k]) {
                                xml += _paths[k].toJson();
                            }
                        }
                        xml += '</Actions>';
                        xml += '</WorkFlow>';
                        EpointWorkFlow.config.tools.save.onclick(xml);
                        return;
                    case "alignLeft":
                        if (isCtrlKeyDown) {
                            var i = 0, tempStates, x;
                            for (var _id in selectedStates) {
                                if (i == 0) {
                                    x = selectedStates[_id].getBBox().x;
                                    i++;
                                }
                                else {
                                    selectedStates[_id].setPositionX(x);
                                }
                            }
                        }
                        return;
                    case "alignTop":
                        if (isCtrlKeyDown) {
                            var i = 0, tempStates, y;
                            for (var _id in selectedStates) {
                                if (i == 0) {
                                    y = selectedStates[_id].getBBox().y;
                                    i++;
                                }
                                else {
                                    selectedStates[_id].setPositionY(y);
                                }
                            }
                            return;
                        }
                    case "alignGrid":
                        var max = parseInt(Math.max($('#WorkFlowWrapper').width(), $('#WorkFlowWrapper').height())) / 5 + 1, gridValues = [];
                        for (var i = 1; i < max + 1; i++) {
                            gridValues.push(i * 10);
                        }
                        var tempStates, x, y;
                        if (isCtrlKeyDown) {
                            for (var _id in selectedStates) {
                                tempStates = selectedStates[_id];
                                x = Raphael.snapTo(gridValues, tempStates.getBBox().x - 5);
                                y = Raphael.snapTo(gridValues, tempStates.getBBox().y - 5);
                                tempStates.setPosition(x, y + 1);
                            }
                        }
                        else {
                            tempStates = $(_r).data('currNode');
                            if (tempStates && tempStates.getId().indexOf("rect") == 0) {
                                x = Raphael.snapTo(gridValues, tempStates.getBBox().x - 5);
                                y = Raphael.snapTo(gridValues, tempStates.getBBox().y - 5);
                                tempStates.setPosition(x, y + 1);
                            }
                        }
                        return;
//                    case "template":
//                        pageName = "framemanager/workflow/design/activitytempleteframe";
//                        h = 482;
//                        title = "人工活动配置模板";
//                        dialogid = "Template";
//                        break;
                    case "materail":
                    	pageName = "framemanager/workflow/manage/processmaterial";
                        title = "流程材料";
                        dialogid = "ProcessMaterial";
                        break;
                    case "context":
                    	pageName = "framemanager/workflow/design/contextfieldlist";
                        title = "相关数据";
                        dialogid = "ContextField";
                        break;
                    case "method":
                    	pageName = "framemanager/workflow/design/methodlist";
                        title = "方法管理";
                        dialogid = "MethodList";
                        break;
// case "print":
// pageName = "PrintAdapter_List";
// title = "表单打印";
// dialogid = "Print";
// break;
                    case "sort":
                    	pageName = "framemanager/workflow/design/activitylist";
                        title = "活动排序";
                        dialogid = "Activity";
                        break;
                }
          	 	epoint.openDialog(title, pageName + '?pid='+_uid+'&mainPVActivityGuid='+MainPVActivityGuid+'&processVersionGuid='+ProcessVersionGuid, '', {
    				'width' : w
    			});
            });

            $('#toolBar .state').each(function () {
                $(this).draggable({
                    helper: 'clone'
                });
            });
            
            $('#toolBar2 .clickable').off("click").click(function () {
                var pageName, w = 1000, h = 450, title, dialogid;
                $('.selected').removeClass('selected');
                $(this).addClass('selected');

                var _states = $('#WorkFlowWrapper').get_states();
                var _paths = $('#WorkFlowWrapper').get_paths();
                switch (this.id) {
                    case "save":
                        var xml = '<?xml version="1.0" standalone="no"?><WorkFlow><Attribute><ProcessVersionGuid>' + ProcessVersionGuid + '</ProcessVersionGuid></Attribute><Nodes>';
                        for (var k in _states) {
                            if (_states[k]) {
                                xml += _states[k].toJson();
                            }
                        }
                        xml += '</Nodes>';
                        xml += '<Actions>';
                        for (var k in _paths) {
                            if (_paths[k]) {
                                xml += _paths[k].toJson();
                            }
                        }
                        xml += '</Actions>';
                        xml += '</WorkFlow>';
                        EpointWorkFlow.config.tools.save.onclick(xml);
                        return;
                    case "alignLeft":
                        if (isCtrlKeyDown) {
                            var i = 0, tempStates, x;
                            for (var _id in selectedStates) {
                                if (i == 0) {
                                    x = selectedStates[_id].getBBox().x;
                                    i++;
                                }
                                else {
                                    selectedStates[_id].setPositionX(x);
                                }
                            }
                        }
                        return;
                    case "alignTop":
                        if (isCtrlKeyDown) {
                            var i = 0, tempStates, y;
                            for (var _id in selectedStates) {
                                if (i == 0) {
                                    y = selectedStates[_id].getBBox().y;
                                    i++;
                                }
                                else {
                                    selectedStates[_id].setPositionY(y);
                                }
                            }
                            return;
                        }
                    case "alignGrid":
                        var max = parseInt(Math.max($('#WorkFlowWrapper').width(), $('#WorkFlowWrapper').height())) / 5 + 1, gridValues = [];
                        for (var i = 1; i < max + 1; i++) {
                            gridValues.push(i * 10);
                        }
                        var tempStates, x, y;
                        if (isCtrlKeyDown) {
                            for (var _id in selectedStates) {
                                tempStates = selectedStates[_id];
                                x = Raphael.snapTo(gridValues, tempStates.getBBox().x - 5);
                                y = Raphael.snapTo(gridValues, tempStates.getBBox().y - 5);
                                tempStates.setPosition(x, y + 1);
                            }
                        }
                        else {
                            tempStates = $(_r).data('currNode');
                            if (tempStates && tempStates.getId().indexOf("rect") == 0) {
                                x = Raphael.snapTo(gridValues, tempStates.getBBox().x - 5);
                                y = Raphael.snapTo(gridValues, tempStates.getBBox().y - 5);
                                tempStates.setPosition(x, y + 1);
                            }
                        }
                        return;
                    case "image":
                        {
                            var svg = my_r.toSVG();
                            var tsvg = svg.split(";");
                            tsvg = tsvg.join("-=-");
                            $("#templateform\\:HidSvg")[0].value=tsvg;
// svg2png([tsvg]);
                            $("#templateform\\:btnSvg")[0].click();
// PageMethods.svg2png(svg, function () {
// AddPicture();
// });
                        }
                        return;
                    case "Typesetting":
                        {
                    		ReadXML2();
                        }
                        return;
                    case "MoveRight":
                        {
                    		MoveRight();
// var jsonStr = GetJsonNow();
// var flowshowobject = new FlowShow(JSON.parse("{}"));
// var returnjsonstring = flowshowobject.MoveRight(jsonStr);
// $('#WorkFlowWrapper').empty();
// $('#WorkFlowWrapper')
// .EpointWorkFlow({
// basePath: "../Images/",
// restore: JSON.parse(returnjsonstring),
// tools: {
// save: {
// onclick: function (xml) {
// workSaveXml([xml]);
// }
// }
// },
// flag: true
// });
                        }
                        return;
                    case "MoveDown":
                        {
                    		MoveDown();
                        }
                        return;
                    case "transform":
                        {
                    		MoveTransform2();
                        }
                        return;

//                    case "template":
//                    	pageName = "framemanager/workflow/design/activitytempleteframe";
//                        h = 482;
//                        title = "人工活动配置模板";
//                        dialogid = "Template";
//                        break;
                    case "materail":
                    	pageName = "framemanager/workflow/manage/processmaterial";
                        title = "流程材料";
                        dialogid = "ProcessMaterial";
                        break;
                    case "context":
                    	pageName = "framemanager/workflow/design/contextfieldlist";
                        title = "相关数据";
                        dialogid = "ContextField";
                        break;
                    case "method":
                    	pageName = "framemanager/workflow/design/methodlist";
                        title = "方法管理";
                        dialogid = "MethodList";
                        break;
// case "print":
// pageName = "PrintAdapter_List";
// title = "表单打印";
// dialogid = "Print";
// break;
                    case "sort":
                    	pageName = "framemanager/workflow/design/activitylist";
                        title = "活动排序";
                        dialogid = "Activity";
                        break;
                }
          	 	epoint.openDialog(title, pageName + '?mainPVActivityGuid='+MainPVActivityGuid+'&processVersionGuid='+ProcessVersionGuid, '', {
    				'width' : w
    			});
            });

            $(c).droppable({
                accept: '.state',
                drop: function (event, ui) {
                    $(_r).trigger('addrect', [ui.helper.attr('type'), {
                        attr: {
                            x: ui.helper.offset().left - 44,
                            y: ui.helper.offset().top - 5
                        }
                    }]);
                    // $('body').append($(ui).attr('type')+'drop.');
                }
            });
            
            $("#WorkFlowWrapper").contextMenu("ie5menu", {
                menuStyle: {
                    width: 150
                },
                bindings: {
                    "OpenActivitySort": function () {
                    	epoint.openDialog("活动排序", 'framemanager/workflow/design/activitylist?processVersionGuid='+ProcessVersionGuid+'&mainPVActivityGuid='+MainPVActivityGuid, '', {
            				'width' : 1000,
            				'height' : 450
            			});
                    },
                    "addManualTemplete": function (e) {
                        $(_r).trigger('addrect', ["ManualTemplete", {
                            attr: {
                                x: e.clientX,
                                y: e.clientY
                            }
                        }]);
                    },
                    "addManual": function (e) {
                        $(_r).trigger('addrect', ["Manual", {
                            attr: {
                                x: e.clientX,
                                y: e.clientY
                            }
                        }]);
                    },
                    "addSubProcess": function (e) {
                        $(_r).trigger('addrect', ["SubProcess", {
                            attr: {
                                x: e.clientX,
                                y: e.clientY
                            }
                        }]);
                    },
                    "addRouter": function (e) {
                        $(_r).trigger('addrect', ["Router", {
                            attr: {
                                x: e.clientX,
                                y: e.clientY
                            }
                        }]);
                    },
                    "addExternal": function (e) {
                        $(_r).trigger('addrect', ["External", {
                            attr: {
                                x: e.clientX,
                                y: e.clientY
                            }
                        }]);
                    }
                }
            });
            // 属性框
            new EpointWorkFlow.props({}, _r);
        }
        _r.left = 44;

        // 恢复
        if (o.restore) {
            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
            // o.restore);
            var data = o.restore;
            EpointWorkFlow.config.props.name = data.WFProps.name;
            EpointWorkFlow.config.props.key = data.WFProps.key;
            var rmap = {};
            if (data.Nodes) {
                for (var k in data.Nodes) {
                    data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
                    data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
                    var rect = new EpointWorkFlow.rect($.extend(true, {}, EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), _r);
                    rect.restore(data.Nodes[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                }
            }
            if (data.Actions) {
                for (var k in data.Actions) {
                    var p = new EpointWorkFlow.path($.extend(true, {}, EpointWorkFlow.config.tools.path, data.Actions[k]),
                                                    _r,
                                                    rmap[data.Actions[k].from],
                                                    rmap[data.Actions[k].to]);
                    rmap[data.Actions[k].to].getInPath().push(p);
                    rmap[data.Actions[k].from].getOutPath().push(p);
                    p.restore(data.Actions[k]);
                    _paths[p.getId()] = p;
                }
            }
        }
    }

    // 添加jquery方法
    $.fn.EpointWorkFlow = function (o) {
        return this.each(function () {
            EpointWorkFlow.init(this, o);
            my_EpointWorkFlow = EpointWorkFlow;
        });
    };

    $.EpointWorkFlow = EpointWorkFlow;
    $.fn.get_states = function () {
        return _states;
    }
    $.fn.get_paths = function () {
        return _paths;
    };
// PageMethods.Get_Path(function (appDir) {
// my_path = appDir;
// });
})(jQuery);

(function ($) {
    var EpointWorkFlow = $.EpointWorkFlow;
    $.extend(true, EpointWorkFlow.config.props, {
        name: '新建流程',
        key: '',
        desc: ''
    });

    // $.extend(true, EpointWorkFlow.config.props.props, {
    //    name: { name: 'name', label: '名称', value: '新建流程', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
    //    key: { name: 'key', label: '标识', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
    //    desc: { name: 'desc', label: '描述', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } }
    // });

    $.extend(true, EpointWorkFlow.config.tools.states, {
        Begin: {
            type: 'Begin',
            name: { text: '<<start>>' },
            text: { text: '开始' },
            img: { src: 'StartNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '开始' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        End: {
            type: 'End',
            name: { text: '<<end>>' },
            text: { text: '结束' },
            img: { src: 'EndNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '结束' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        ManualTemplete: {
            type: 'ManualTemplete',
            name: { text: '<<end-cancel>>' },
            text: { text: '人工活动配置模板' },
            img: { src: 'ManuralTemplete.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '取消' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        Manual: {
            type: 'Manual',
            name: { text: '<<end-cancel>>' },
            text: { text: '人工活动' },
            img: { src: 'ManualNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '取消' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        ManualByTemplete: {
            type: 'Manual',
            name: { text: '<<end-cancel>>' },
            text: { text: '人工活动' },
            img: { src: 'ManualNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '取消' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        Router: {
            type: 'Router',
            name: { text: '<<end-error>>' },
            text: { text: '路由活动' },
            img: { src: 'RouterNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '错误' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        External: {
            type: 'External',
            name: { text: '<<end-cancel>>' },
            text: { text: '外部活动' },
            img: { src: 'External.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '取消' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        SubProcess: {
            type: 'SubProcess',
            name: { text: '<<state>>' },
            text: { text: '子流程' },
            img: { src: 'SubProcessNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '状态' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },
        Browser: {
            type: 'Browser',
            name: { text: '<<state>>' },
            text: { text: '浏览活动' },
            img: { src: 'BrowserNewVml.jpg', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '状态' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor([{ name: 'aaa', value: 1 }, { name: 'bbb', value: 2 }]); } }
            }
        },      
        fork: {
            type: 'fork',
            name: { text: '<<fork>>' },
            text: { text: '分支' },
            img: { src: 'img/16/gateway_parallel.png', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '分支' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor('select.json'); } }
            }
        },
        join: {
            type: 'join',
            name: { text: '<<join>>' },
            text: { text: '合并' },
            img: { src: 'img/16/gateway_parallel.png', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '合并' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor('select.json'); } }
            }
        },
        task: {
            type: 'task',
            name: { text: '<<task>>' },
            text: { text: '任务' },
            img: { src: 'img/16/task_empty.png', width: 30, height: 30 },
            props: {
                text: { name: 'text', label: '显示', value: '', editor: function () { return new EpointWorkFlow.editors.textEditor(); }, value: '任务' },
                temp1: { name: 'temp1', label: '文本', value: '', editor: function () { return new EpointWorkFlow.editors.inputEditor(); } },
                temp2: { name: 'temp2', label: '选择', value: '', editor: function () { return new EpointWorkFlow.editors.selectEditor('select.json'); } }
            }
        }
    });
})(jQuery);

(function ($) {
    var EpointWorkFlow = $.EpointWorkFlow;

    $.extend(true, EpointWorkFlow.editors, {
        inputEditor: function () {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props; _k = k; _div = div; _src = src; _r = r;

                $('<input style="width:100%;"/>').val(props[_k].value).change(function () {
                    props[_k].value = $(this).val();
                }).appendTo('#' + _div);

                $('#' + _div).data('editor', this);
            }
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                });
            }
        },
        selectEditor: function (arg) {
            var _props, _k, _div, _src, _r;
            this.init = function (props, k, div, src, r) {
                _props = props; _k = k; _div = div; _src = src; _r = r;

                var sle = $('<select  style="width:100%;"/>').val(props[_k].value).change(function () {
                    props[_k].value = $(this).val();
                }).appendTo('#' + _div);

                if (typeof arg === 'string') {
                    $.ajax({
                        type: "GET",
                        url: arg,
                        success: function (data) {
                            var opts = eval(data);
                            if (opts && opts.length) {
                                for (var idx = 0; idx < opts.length; idx++) {
                                    sle.append('<option value="' + opts[idx].value + '">' + opts[idx].name + '</option>');
                                }
                                sle.val(_props[_k].value);
                            }
                        }
                    });
                } else {
                    for (var idx = 0; idx < arg.length; idx++) {
                        sle.append('<option value="' + arg[idx].value + '">' + arg[idx].name + '</option>');
                    }
                    sle.val(_props[_k].value);
                }

                $('#' + _div).data('editor', this);
            };
            this.destroy = function () {
                $('#' + _div + ' input').each(function () {
                    _props[_k].value = $(this).val();
                });
            };
        }
    });
})(jQuery);


function TypeSet(responseText) {
		my_X = 0;
		my_Y = 0;
		var _states = $('#WorkFlowWrapper').get_states();
		var _paths = $('#WorkFlowWrapper').get_paths();
		var flag = true;
		for (var k in _states) {
			if ((_states[k].geto().type != "Begin") && (_states[k].geto().type != "End")) {
				flag = false;
			}
		}
		if (!flag) {
			var fshow = new FlowShow();
            responseText = fshow.FlowChartSort(responseText);
            $.each(_states, function (k, node) {
                _states[node.getId()].get_rect().remove();
                _states[node.getId()].get_text().remove();
                _states[node.getId()].get_img().remove();
                _states[node.getId()].get_bpath().remove();

                for (var k in _states[node.getId()].get_bdots()) {
                    _states[node.getId()].get_bdots()[k].remove();
                }
            });
            $.each(_paths, function (k, line) {
                _paths[line.getId()].get_dotList().remove();
                _paths[line.getId()].get_path().remove();
                _paths[line.getId()].get_arrow().remove();
                // _text.remove();
                try {
                    $(_paths[line.getId()].get_r).off('click', clickHandler);
                } catch (e) {
                }
                try {
                    $(_paths[line.getId()].get_r).off('removerect', removerectHandler);
                } catch (e) {
                }
                try {
                    $(_paths[line.getId()].get_r).off('rectresize', rectresizeHandler);;
                } catch (e) {
                }
                try {
                    $(_paths[line.getId()].get_r).off('textchange', textchangeHandler);
                } catch (e) {
                }
            });
//            $("#WorkFlowWrapperBg").css({ width: $(this).width() - 44, height: $(this).height(), marginLeft: 44 });
            var NodeName = null;

            var workFlow = null;
            if(typeof responseText == "object"){
            	workFlow = eval("(" + JSON.stringify(responseText) + ")");
            }else{
            	workFlow = eval("(" + responseText + ")");
            }
            
            if (workFlow) {
            	var data = workFlow;
                my_EpointWorkFlow.config.props.name = data.WFProps.name;
                my_EpointWorkFlow.config.props.key = data.WFProps.key;
                var rmap = {};
                if (data.Nodes) {
                    for (var k in data.Nodes) {
                        data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
                        data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
                        var rect = new my_EpointWorkFlow.rect($.extend(true, {}, my_EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), my_r);
                        rect.restore(data.Nodes[k]);
                        rmap[k] = rect;
                        _states[rect.getId()] = rect;
                    }
                }
                if (data.Actions) {
                    for (var k in data.Actions) {
                    	var p = new my_EpointWorkFlow.path($.extend(true, {}, my_EpointWorkFlow.config.tools.path, data.Actions[k]),
                                my_r,
                                rmap[data.Actions[k].from],
                                rmap[data.Actions[k].to]);
                    			rmap[data.Actions[k].to].getInPath().push(p);
                    			rmap[data.Actions[k].from].getOutPath().push(p);
                    			p.restore(data.Actions[k]);
                    			_paths[p.getId()] = p;
                    }
                }
            }
// });
// $('#WorkFlowWrapper')
// .EpointWorkFlow({
// basePath: "../Images/",
// restore: JSON.parse(returnjsonstring),
// tools: {
// save: {
// onclick: function (xml) {
// workSaveXml([xml]);
// }
// }
// },
// flag: true
// });
		}
	}

function TypeSetting2() {
    my_X = 0;
    my_Y = 0;
    var _states = $('#WorkFlowWrapper').get_states();
    var _paths = $('#WorkFlowWrapper').get_paths();
    var flag = true;
    for (var k in _states) {
        if ((_states[k].geto().type != "Begin") && (_states[k].geto().type != "End")) {
            flag = false;
        }

    }
    if (!flag) {
    	ReadXML();
// PageMethods.ReadXML(ProcessVersionGuid, function (responseText) {
            // PageMethods.JsonToXML(responseText, function () {
            // PageMethods.FlowTypeSet(function b() {
            // PageMethods.XMLToJson("\\FlowTypeSet\\local_.xml", 1000, function (result) {
            var fshow = new FlowShow();
            responseText = fshow.FlowChartSort(responseText);

// $.each(_states, function (k, node) {
// _states[node.getId()].get_rect().remove();
// _states[node.getId()].get_text().remove();
// _states[node.getId()].get_img().remove();
// _states[node.getId()].get_bpath().remove();
//
// for (var k in _states[node.getId()].get_bdots()) {
// _states[node.getId()].get_bdots()[k].remove();
// }
// });
// $.each(_paths, function (k, line) {
// _paths[line.getId()].get_dotList().remove();
// _paths[line.getId()].get_path().remove();
// _paths[line.getId()].get_arrow().remove();
// //_text.remove();
// try {
// $(_paths[line.getId()].get_r).unbind('click', clickHandler);
// } catch (e) {
// }
// try {
// $(_paths[line.getId()].get_r).unbind('removerect', removerectHandler);
// } catch (e) {
// }
// try {
// $(_paths[line.getId()].get_r).unbind('rectresize', rectresizeHandler);;
// } catch (e) {
// }
// try {
// $(_paths[line.getId()].get_r).unbind('textchange', textchangeHandler);
// } catch (e) {
// }
// // });
//            $("#WorkFlowWrapperBg").css({ width: $(this).width() - 44, height: $(this).height(), marginLeft: 44 });
// var NodeName = null;
//
// var workFlow = eval("(" + JSON.stringify(responseText) + ")");
// if (workFlow) {
// var data = workFlow;
// my_EpointWorkFlow.config.props.name = data.WFProps.name;
// my_EpointWorkFlow.config.props.key = data.WFProps.key;
// var rmap = {};
// if (data.Nodes) {
// for (var k in data.Nodes) {
// data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
// data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
//                        var rect = new my_EpointWorkFlow.rect($.extend(true, {}, my_EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), my_r);
// rect.restore(data.Nodes[k]);
// rmap[k] = rect;
// _states[rect.getId()] = rect;
// }
// }
// if (data.Actions) {
// for (var k in data.Actions) {
//                        var p = new my_EpointWorkFlow.path($.extend(true, {}, my_EpointWorkFlow.config.tools.path, data.Actions[k]),
// my_r,
// rmap[data.Actions[k].from],
// rmap[data.Actions[k].to]);
// rmap[data.Actions[k].to].getInPath().push(p);
// rmap[data.Actions[k].from].getOutPath().push(p);
// p.restore(data.Actions[k]);
// _paths[p.getId()] = p;
// }
// }
// }
// });
        // });
        // });
        // });
    }

}
function json2xml(o, tab) {
    var toXml = function (v, name, ind) {
        name = "n" + name;
        var xml = "";
        if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++)
                xml += ind + toXml(v[i], name, ind + "\t") + "\n";
        }
        else if (typeof (v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
                if (m.charAt(0) == "@")
                    xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                    hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (var m in v) {
                    if (m == "#text")
                        xml += v[m];
                    else if (m == "#cdata")
                        xml += "<![CDATA[" + v[m] + "]]>";
                    else if (m.charAt(0) != "@")
                        xml += toXml(v[m], m, ind + "\t");
                }
                xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
        }
        else {
            xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
        }
        return xml;
    }, xml = "";
    for (var m in o)
        xml += toXml(o[m], m, "");
    return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}
function ReadXMLHd(responseText) {
    var NodeName = null;
    var workFlow = null;
    if(typeof responseText == "object"){
    	workFlow = eval("(" + JSON.stringify(responseText) + ")");
    }else{
    	workFlow = eval("(" + responseText + ")");
    }
    $('#WorkFlowWrapper')
	.EpointWorkFlow({
	    basePath: "../image/",
	    restore: workFlow,
	    tools: {
	        save: {
	            onclick: function (xml) {
	            	workSaveXml(xml);
// PageMethods.SaveXML(xml, ProcessVersionGuid, function () {
// epoint.dialog.alert('保存成功!');
// }, onFail);
	            }
	        }
	    },
	    flag: true
	});

    // //流程图的详细节点信息
    // //节点
    // $.each(workFlow.Nodes, function (k, node) {
    // NodeName = node.Name;
    // if (node.Type == "Begin")
    // NodeName = "开始";
    // else if (node.Type == "End")
    // NodeName = "结束";
    //    createNode(node.Type, node.Id, NodeName, parseInt(node.X) / 10, parseInt(node.Y) / 10).attr({ cursor: "move" });
    // });
    // //变迁
    // $.each(workFlow.Actions, function (k, action) {
    //    var line = paper.arrowSet(ActivityImages[action.BeginShape], ActivityImages[action.EndShape]);
    // lines[action.Id] = line;
    // line.line.data("id", action.Id);
    // line.line[0].data("id", action.Id);
    // line.line.click(function (e) {
    // LineClick(e, this.data("id"));
    // });
    // //line.bg.data("LineId", action.Id);
    // connections.push(line);
    // });
    // paper.safari();
    // 创建活动
}

function onFail(e) {
    epoint.dialog.error(e.get_message());
}

// mn2014年3月6日9:49:58添加 为了测试功能
function test() {
    // PageMethods.ReadXML(ProcessVersionGuid, function (responseText) {
    // PageMethods.JsonToXML_Test(responseText, function () { });
    // });
}
function MoveDown() {
	 	my_X = 0;
	    my_Y = 0;
	    var _states = $('#WorkFlowWrapper').get_states();
	    var _paths = $('#WorkFlowWrapper').get_paths();
	    var flag = true;
	    for (var k in _states) {
	        if ((_states[k].geto().type != "Begin") && (_states[k].geto().type != "End")) {
	            flag = false;
	        }

	    }
	    if (!flag) {
	        var jsonStr = GetJsonNow();
	        var flowshowobject = new FlowShow(JSON.parse("{}"));
	        // PageMethods.JsonToXML(responseText, function () {
	        // PageMethods.FlowTypeSet(function b() {
	        // PageMethods.XMLToJson("\\FlowTypeSet\\local_.xml", 1000, function (result) {
	        var fshow = new FlowShow();
	        responseText = fshow.MoveDown(jsonStr);

	        $.each(_states, function (k, node) {
	            _states[node.getId()].get_rect().remove();
	            _states[node.getId()].get_text().remove();
	            _states[node.getId()].get_img().remove();
	            _states[node.getId()].get_bpath().remove();

	            for (var k in _states[node.getId()].get_bdots()) {
	                _states[node.getId()].get_bdots()[k].remove();
	            }
	        });
	        $.each(_paths, function (k, line) {
	            _paths[line.getId()].get_dotList().remove();
	            _paths[line.getId()].get_path().remove();
	            _paths[line.getId()].get_arrow().remove();
	            // _text.remove();
	            try {
	                $(_paths[line.getId()].get_r).off('click', clickHandler);
	            } catch (e) {
	            }
	            try {
	                $(_paths[line.getId()].get_r).off('removerect', removerectHandler);
	            } catch (e) {
	            }
	            try {
	                $(_paths[line.getId()].get_r).off('rectresize', rectresizeHandler);;
	            } catch (e) {
	            }
	            try {
	                $(_paths[line.getId()].get_r).off('textchange', textchangeHandler);
	            } catch (e) {
	            }
	        });
	        // $.each(_states, function (k, node) {
	        //                     PageMethods.DeleteNode(_states[node.getId()].geto().type, ProcessVersionGuid, _states[node.getId()].getVMLId(), function () {
	        // 
	        // }, onFail);
	        // 
	        // 
	        // })
	        // $.each(_paths, function (k, line) {
	        //                     PageMethods.DeleteNode("Hdbq", ProcessVersionGuid, line.getId().replace("path", ""), function () {
	        // 
	        // }, onFail);
	        // });
	        $("#WorkFlowWrapperBg").css({ width: $(this).width() - 44, height: $(this).height() - 41, marginLeft: 44, marginTop : 41 });
	        // responseText = result;
	        var NodeName = null;

	        var workFlow = null;
	        if(typeof responseText == "object"){
	        	workFlow = eval("(" + JSON.stringify(responseText) + ")");
	        }else{
	        	workFlow = eval("(" + responseText + ")");
	        }
	        // $('#WorkFlowWrapper')
	        // .EpointWorkFlow({
	        // basePath: "../../Images/",
	        // restore: workFlow,
	        // tools: {
	        // save: {
	        // onclick: function (xml) {
	        // PageMethods.SaveXML(xml, ProcessVersionGuid, function () {
	        // epoint.dialog.alert('保存成功!');
	        // }, onFail);
	        // }
	        // }
	        // },
	        // flag: false
	        // });
	        // 恢复
	        //                   PageMethods.XMLToXML_("\\FlowTypeSet\\local_.xml",function Save(xml) {
	        // PageMethods.SaveXML(xml, ProcessVersionGuid, function () {
	        // epoint.dialog.alert('排版成功!');
	        // }, onFail);
	        // });
	        if (workFlow) {
	            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
	            // o.restore);
	            var data = workFlow;
	            my_EpointWorkFlow.config.props.name = data.WFProps.name;
	            my_EpointWorkFlow.config.props.key = data.WFProps.key;
	            var rmap = {};
	            if (data.Nodes) {
	                for (var k in data.Nodes) {
	                    data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
	                    data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
	                    var rect = new my_EpointWorkFlow.rect($.extend(true, {}, my_EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), my_r);
	                    rect.restore(data.Nodes[k]);
	                    rmap[k] = rect;
	                    _states[rect.getId()] = rect;
	                }
	            }
	            if (data.Actions) {
	                for (var k in data.Actions) {
	                    var p = new my_EpointWorkFlow.path($.extend(true, {}, my_EpointWorkFlow.config.tools.path, data.Actions[k]),
	                                                    my_r,
	                                                    rmap[data.Actions[k].from],
	                                                    rmap[data.Actions[k].to]);
	                    rmap[data.Actions[k].to].getInPath().push(p);
	                    rmap[data.Actions[k].from].getOutPath().push(p);
	                    p.restore(data.Actions[k]);
	                    _paths[p.getId()] = p;
	                }
	            }
	        }
	    };
}

function MoveRight() {
	 my_X = 0;
	    my_Y = 0;
	    var _states = $('#WorkFlowWrapper').get_states();
	    var _paths = $('#WorkFlowWrapper').get_paths();
	    var flag = true;
	    for (var k in _states) {
	        if ((_states[k].geto().type != "Begin") && (_states[k].geto().type != "End")) {
	            flag = false;
	        }

	    }
	    if (!flag) {
	        var jsonStr = GetJsonNow();
	        var flowshowobject = new FlowShow(JSON.parse("{}"));
	        var fshow = new FlowShow();
	        responseText = fshow.MoveRight(jsonStr);

	        $.each(_states, function (k, node) {
	            _states[node.getId()].get_rect().remove();
	            _states[node.getId()].get_text().remove();
	            _states[node.getId()].get_img().remove();
	            _states[node.getId()].get_bpath().remove();

	            for (var k in _states[node.getId()].get_bdots()) {
	                _states[node.getId()].get_bdots()[k].remove();
	            }
	        });
	        $.each(_paths, function (k, line) {
	            _paths[line.getId()].get_dotList().remove();
	            _paths[line.getId()].get_path().remove();
	            _paths[line.getId()].get_arrow().remove();
	            // _text.remove();
	            try {
	                $(_paths[line.getId()].get_r).off('click', clickHandler);
	            } catch (e) {
	            }
	            try {
	                $(_paths[line.getId()].get_r).off('removerect', removerectHandler);
	            } catch (e) {
	            }
	            try {
	                $(_paths[line.getId()].get_r).off('rectresize', rectresizeHandler);;
	            } catch (e) {
	            }
	            try {
	                $(_paths[line.getId()].get_r).off('textchange', textchangeHandler);
	            } catch (e) {
	            }
	        });
	        $("#WorkFlowWrapperBg").css({ width: $(this).width() - 44, height: $(this).height() - 41, marginLeft: 44 , marginTop : 41});
	        var NodeName = null;

	        var workFlow = null;
	        if(typeof responseText == "object"){
	        	workFlow = eval("(" + JSON.stringify(responseText) + ")");
	        }else{
	        	workFlow = eval("(" + responseText + ")");
	        }
	        if (workFlow) {
	            var data = workFlow;
	            my_EpointWorkFlow.config.props.name = data.WFProps.name;
	            my_EpointWorkFlow.config.props.key = data.WFProps.key;
	            var rmap = {};
	            if (data.Nodes) {
	                for (var k in data.Nodes) {
	                    data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
	                    data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
	                    var rect = new my_EpointWorkFlow.rect($.extend(true, {}, my_EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), my_r);
	                    rect.restore(data.Nodes[k]);
	                    rmap[k] = rect;
	                    _states[rect.getId()] = rect;
	                }
	            }
	            if (data.Actions) {
	                for (var k in data.Actions) {
	                    var p = new my_EpointWorkFlow.path($.extend(true, {}, my_EpointWorkFlow.config.tools.path, data.Actions[k]),
	                                                    my_r,
	                                                    rmap[data.Actions[k].from],
	                                                    rmap[data.Actions[k].to]);
	                    rmap[data.Actions[k].to].getInPath().push(p);
	                    rmap[data.Actions[k].from].getOutPath().push(p);
	                    p.restore(data.Actions[k]);
	                    _paths[p.getId()] = p;
	                }
	            }
	        }
	    };
}

function MoveTransform2() {
    my_X = 0;
    my_Y = 0;
    var _states = $('#WorkFlowWrapper').get_states();
    var _paths = $('#WorkFlowWrapper').get_paths();
    var flag = true;
    for (var k in _states) {
        if ((_states[k].geto().type != "Begin") && (_states[k].geto().type != "End")) {
            flag = false;
        }

    }
    if (!flag) {
        var jsonStr = GetJsonNow();
        var flowshowobject = new FlowShow(JSON.parse("{}"));
        // PageMethods.JsonToXML(responseText, function () {
        // PageMethods.FlowTypeSet(function b() {
        // PageMethods.XMLToJson("\\FlowTypeSet\\local_.xml", 1000, function (result) {
        var fshow = new FlowShow();
        responseText = fshow.MoveTransform(jsonStr);

        $.each(_states, function (k, node) {
            _states[node.getId()].get_rect().remove();
            _states[node.getId()].get_text().remove();
            _states[node.getId()].get_img().remove();
            _states[node.getId()].get_bpath().remove();

            for (var k in _states[node.getId()].get_bdots()) {
                _states[node.getId()].get_bdots()[k].remove();
            }
        });
        $.each(_paths, function (k, line) {
            _paths[line.getId()].get_dotList().remove();
            _paths[line.getId()].get_path().remove();
            _paths[line.getId()].get_arrow().remove();
            // _text.remove();
            try {
                $(_paths[line.getId()].get_r).off('click', clickHandler);
            } catch (e) {
            }
            try {
                $(_paths[line.getId()].get_r).off('removerect', removerectHandler);
            } catch (e) {
            }
            try {
                $(_paths[line.getId()].get_r).off('rectresize', rectresizeHandler);;
            } catch (e) {
            }
            try {
                $(_paths[line.getId()].get_r).off('textchange', textchangeHandler);
            } catch (e) {
            }
        });
        // $.each(_states, function (k, node) {
        //                     PageMethods.DeleteNode(_states[node.getId()].geto().type, ProcessVersionGuid, _states[node.getId()].getVMLId(), function () {
        // 
        // }, onFail);
        // 
        // 
        // })
        // $.each(_paths, function (k, line) {
        //                     PageMethods.DeleteNode("Hdbq", ProcessVersionGuid, line.getId().replace("path", ""), function () {
        // 
        // }, onFail);
        // });
        $("#WorkFlowWrapperBg").css({ width: $(this).width() - 44, height: $(this).height() - 41, marginLeft: 44 , marginTop : 41});
        // responseText = result;
        var NodeName = null;

        var workFlow = null;
        if(typeof responseText == "object"){
        	workFlow = eval("(" + JSON.stringify(responseText) + ")");
        }else{
        	workFlow = eval("(" + responseText + ")");
        }
        // $('#WorkFlowWrapper')
        // .EpointWorkFlow({
        // basePath: "../../Images/",
        // restore: workFlow,
        // tools: {
        // save: {
        // onclick: function (xml) {
        // PageMethods.SaveXML(xml, ProcessVersionGuid, function () {
        // epoint.dialog.alert('保存成功!');
        // }, onFail);
        // }
        // }
        // },
        // flag: false
        // });
        // 恢复
        //                   PageMethods.XMLToXML_("\\FlowTypeSet\\local_.xml",function Save(xml) {
        // PageMethods.SaveXML(xml, ProcessVersionGuid, function () {
        // epoint.dialog.alert('排版成功!');
        // }, onFail);
        // });
        if (workFlow) {
            // var data = ((typeof o.restore === 'string') ? eval(o.restore) :
            // o.restore);
            var data = workFlow;
            my_EpointWorkFlow.config.props.name = data.WFProps.name;
            my_EpointWorkFlow.config.props.key = data.WFProps.key;
            var rmap = {};
            if (data.Nodes) {
                for (var k in data.Nodes) {
                    data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
                    data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
                    var rect = new my_EpointWorkFlow.rect($.extend(true, {}, my_EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), my_r);
                    rect.restore(data.Nodes[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                }
            }
            if (data.Actions) {
                for (var k in data.Actions) {
                    var p = new my_EpointWorkFlow.path($.extend(true, {}, my_EpointWorkFlow.config.tools.path, data.Actions[k]),
                                                    my_r,
                                                    rmap[data.Actions[k].from],
                                                    rmap[data.Actions[k].to]);
                    rmap[data.Actions[k].to].getInPath().push(p);
                    rmap[data.Actions[k].from].getOutPath().push(p);
                    p.restore(data.Actions[k]);
                    _paths[p.getId()] = p;
                }
            }
        }
    };
}


function AfterDel(type,_uid) {
	switch (type) {
     case "Hdbq":
         DelLine();
         break;
     default:
    	 _re.remove();
     	 _tex.remove();
     	 // _name.remove();
     	 _im.remove();
     	 _bp.remove();
     	 for (var k in _bdo) {
     		_bdo[k].remove();
     	 }
     	 for (var k in _pas) {
     		 if (_pas[k] == null) {
     			 continue;
     		 }
     		 if (_pas[k].to().getVMLId() == _uid || _pas[k].from().getVMLId() == _uid) {
     			_pas[k].removePath();
     		 }
     	 }
	}
// switch (CurNodeType) {
// case "Hdbq":
// DelLine(CurNodeID);
// break;
// default:
// for (var i = connections.length; i--; ) {
//                if ((connections[i].from === ActivityImages[CurNodeID]) || (connections[i].to === ActivityImages
//
// [CurNodeID])) {
// DelLine(connections[i].line[0].data("id"));
// }
// }
// DelActivity(CurNodeID);
// break;
// }
// CurNodeID = null;
// CurNodeType = null;
	epoint.alert('删除成功！', '提示');
}

function DelLine() {
    _list.remove();
    _pa.remove();
    _arr.remove();
    // _text.remove();
    try {
        $(_r).off('click', clickHandler);
    } catch (e) {
    }
    try {
        $(_r).off('removerect', removerectHandler);
    } catch (e) {
    }
    try {
        $(_r).off('rectresize', rectresizeHandler);
    } catch (e) {
    }
    try {
        $(_r).off('textchange', textchangeHandler);
    } catch (e) {
    }
}

function aferGet(responseText){
        $.each(_states, function (k, node) {
            _states[node.getId()].get_rect().remove();
            _states[node.getId()].get_text().remove();
            _states[node.getId()].get_img().remove();
            _states[node.getId()].get_bpath().remove();

            for (var k in _states[node.getId()].get_bdots()) {
                _states[node.getId()].get_bdots()[k].remove();
            }
        });
        $.each(_paths, function (k, line) {
            _paths[line.getId()].get_dotList().remove();
            _paths[line.getId()].get_path().remove();
            _paths[line.getId()].get_arrow().remove();
            // _text.remove();
            try {
                $(_paths[line.getId()].get_r).off('click', clickHandler);
            } catch (e) {
            }
            try {
                $(_paths[line.getId()].get_r).off('removerect', removerectHandler);
            } catch (e) {
            }
            try {
                $(_paths[line.getId()].get_r).off('rectresize', rectresizeHandler);;
            } catch (e) {
            }
            try {
                $(_paths[line.getId()].get_r).off('textchange', textchangeHandler);
            } catch (e) {
            }
        });
        $("#WorkFlowWrapperBg").css({ width: $(this).width() - 44, height: $(this).height() - 41, marginLeft: 44 , marginTop : 41});
        responseText = result;
        var NodeName = null;
        var workFlow = null;
        if(typeof responseText == "object"){
        	workFlow = eval("(" + JSON.stringify(responseText) + ")");
        }else{
        	workFlow = eval("(" + responseText + ")");
        }
        if (workFlow) {
            var data = workFlow;
            my_EpointWorkFlow.config.props.name = data.WFProps.name;
            my_EpointWorkFlow.config.props.key = data.WFProps.key;
            var rmap = {};
            if (data.Nodes) {
                for (var k in data.Nodes) {
                    data.Nodes[k].attr.x = parseInt(data.Nodes[k].attr.x) / 10;
                    data.Nodes[k].attr.y = parseInt(data.Nodes[k].attr.y) / 10;
                    var rect = new my_EpointWorkFlow.rect($.extend(true, {}, my_EpointWorkFlow.config.tools.states[data.Nodes[k].type], data.Nodes[k]), my_r);
                    rect.restore(data.Nodes[k]);
                    rmap[k] = rect;
                    _states[rect.getId()] = rect;
                }
            }
            if (data.Actions) {
                for (var k in data.Actions) {
                    var p = new my_EpointWorkFlow.path($.extend(true, {}, my_EpointWorkFlow.config.tools.path, data.Actions[k]),
                                                    my_r,
                                                    rmap[data.Actions[k].from],
                                                    rmap[data.Actions[k].to]);
                    rmap[data.Actions[k].to].getInPath().push(p);
                    rmap[data.Actions[k].from].getOutPath().push(p);
                    p.restore(data.Actions[k]);
                    _paths[p.getId()] = p;
                }
            }
        }
}

function GetJsonNow() {
    // 缩放比例
    var Ratio = 10;
    var _states = $('#WorkFlowWrapper').get_states();
    var _paths = $('#WorkFlowWrapper').get_paths();

    var json = '{WFProps:{name:\'MoveWorkFlow\',key:\'' + ProcessVersionGuid + '\'},';
    // Nodes
    json += 'Nodes:{';
    for (var n in _states) {
        json += "\"Node" + _states[n].getVMLId() + '\":{';
        json += 'id:\'' + _states[n].getVMLId() + '\',';
        json += 'type:\'' + _states[n].geto().type + '\',';
        json += 'text:{text:\'' + _states[n].geto().text.text + '\'},';
        json += 'attr:{x:\'' + parseInt(_states[n].get_rect().attr('x')) * Ratio + '\',';
        json += 'y:\'' + parseInt(_states[n].get_rect().attr('y')) * Ratio + '\'}';
        json += '},';
    }
    if (json[json.length - 1].toString() == ',') json = json.substring(0, json.length - 1);
    json += '},';
    // Actions
    json += 'Actions:{';
    for (var p in _paths) {
        json += '\"Action' + _paths[p].getVMLId() + '\":{';
        json += 'id:\'' + _paths[p].getVMLId() + '\',';
        json += 'dots:' + _paths[p].get_dotList().toJson() + ',';
        json += 'from:\'Node' + _paths[p].from().getVMLId() + '\',';
        json += 'to:\'Node' + _paths[p].to().getVMLId() + '\'';
        json += '},';
    }
    if (json[json.length - 1].toString() == ',') json = json.substring(0, json.length - 1);
    json += '}';
    json += '}';
    return json;

}


/// <reference path="raphael-min.js" />
/// <reference path="graffle.js" />

var my_r;
var my_EpointWorkFlow;
var my_Y = 0;
var my_X = 0;
var my_path;
(function ($) {
    var EpointWorkFlow = {}, _states = {}, _paths = {}, isCtrlKeyDown = false, selectedStates = {};
    EpointWorkFlow.config = {
        editable: false,
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
                "cursor": ""
            },
            showType: 'image&text',// image,text,image&text
            type: 'state',
            //name: {
            //    text: 'state'
            //},
            text: {
                text: '状态',
                'font-size': 12,
                "cursor": ""
            },
            margin: 3,
            props: [],
            img: {
                attr: { "cursor": "" }
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
                    alert(data, null, null, 'info');
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
        //mn添加，第二次初始化不再重现创建Raphael。用上一次的。
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
        _rect, _img, imgUrl,// 图标
        //_name, // 状态名称
        _text, // 显示文本
        _ox, _oy, _outPath = [], _inPath = []; // 拖动时，保存起点位置;
        //_o.text.text += _uid;

        _rect = _r.rect(_o.attr.x, _o.attr.y, _o.attr.width, _o.attr.height,
                        _o.attr.r).hide().attr(_o.attr);

        switch (_o.style) {
            case "Same":
                imgUrl = "FlowChartIco/waitTodo.png"
                break;
            case "Opacity":
                imgUrl = "FlowChartIco/doneActivity.png";
                break;
            case "SameOverTime":
                imgUrl = "FlowChartIco/overdatedUndone.png";
                break;
            case "OpacityOverTime":
                imgUrl = "FlowChartIco/overdatedDone.png";
                break;
            case "BlackAndWhite":
                imgUrl = "FlowChartIco/noTransActivity.png";
                break;
        }
        _img = _r.image(EpointWorkFlow.config.basePath+ imgUrl,
                        _o.attr.x + _o.img.width / 2,
                        _o.attr.y + (_o.attr.height - _o.img.height) / 2, _o.img.width,
                        _o.img.height).attr(_o.img.attr).hide();

        _text = _r.text(
                        _o.attr.x + _o.img.width + (_o.attr.width - _o.img.width) / 2,
                        _o.attr.y + (_o.attr.height - EpointWorkFlow.config.lineHeight) / 2
                                        + EpointWorkFlow.config.lineHeight, _o.text.text).hide()
                        .attr(_o.text);// 文本





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
        // 上
        _bdots['lt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'nw-resize'
        }).hide();
        // 左上
        _bdots['l'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide();
        // 左
        _bdots['lb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'sw-resize'
        }).hide();
        // 左下
        _bdots['b'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 's-resize'
        }).hide();
        // 下
        _bdots['rb'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'se-resize'
        }).hide();
        // 右下
        _bdots['r'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'w-resize'
        }).hide();
        // 右
        _bdots['rt'] = _r.rect(0, 0, _bw, _bw).attr({
            fill: '#000',
            stroke: '#fff',
            cursor: 'ne-resize'
        }).hide();

        // 事件处理--------------------------------
        $([_text.node, _img.node]) // _name.node,
           .mouseover(function (e) {
               if (_o.style != "BlackAndWhite"&&_o.type != "Begin" && _o.type != "End" && _o.type != "Router") {
            	   var X = e.clientX + document.body.scrollLeft;
                   var Y = e.clientY + document.body.scrollTop;
                   if (X + 760 > $("#WorkFlowWrapper").width()) {
                       X = $("#WorkFlowWrapper").width() - 760;
                   }
                   if (Y + 270 > $("#WorkFlowWrapper").height()) {
                       Y = $("#WorkFlowWrapper").height() - 270;
                   }
                   $("#" + DetailPanelId).css({ "top": Y, "left": X }).show();
                   var Arry = _o.detail.split('★');
                   document.getElementById('ActivityName').innerText = Arry[0];
                   var ProcessVersionInstanceGuid=Util.getUrlParams("processVersionInstanceGuid");
                   var mode=Util.getUrlParams("mode");
                   url = Util.addUrlParams("activityinstanceinfomanage?processVersionInstanceGuid=" + ProcessVersionInstanceGuid + "&activityInstanceGuid=" + Arry[1] + "&mode=" + mode, Util.getUrlParams(), "ignore");
                   if (document.getElementById('PageDetail').src != url)
                       document.getElementById('PageDetail').src = url;
               }
               else if(_o.style == "BlackAndWhite"&&_o.type != "Begin" && _o.type != "End" && _o.type != "Router"){
            	   var X = e.clientX + document.body.scrollLeft;
                   var Y = e.clientY + document.body.scrollTop;
                   $("#" + DetailPanelId).css({ "top": Y, "left": X }).show();
                   var Arry = _o.detail.split('★');
                   document.getElementById('ActivityName').innerText = Arry[0];
                   var ProcessVersionInstanceGuid=Util.getUrlParams("processVersionInstanceGuid");
                   var mode="unactive";
                   url = Util.addUrlParams("activityinstanceinfomanage?processVersionInstanceGuid=" + ProcessVersionInstanceGuid + "&activityGuid=" + Arry[2] + "&mode=" + mode, Util.getUrlParams(), "ignore");
                   if (document.getElementById('PageDetail').src != url)
                       document.getElementById('PageDetail').src = url;
               }
           })
        // 私有函数-----------------------


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

                    _text.attr({
                        x: rx + (_bbox.width - _o.img.width) / 2 - 2 + _o.img.width / 2,//rx + _o.img.width + (rw - _o.img.width) / 2,
                        y: ry + 45 //ry + (rh - EpointWorkFlow.config.lineHeight) / 2  + EpointWorkFlow.config.lineHeight
                    }).show();// 文本
                    _img.attr({
                        x: rx + (_bbox.width - _o.img.width) / 2 - 2, //rx + _o.img.width / 2,
                        y: ry + 5   //ry + (rh - _o.img.height) / 2
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

        };

        // 函数----------------

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
        //_ignorePaths,是指在计算交叉点时需要忽略的路径
        //_intersectionPaths，是指和本路径相交的路径

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

            data += _dotList.toJson();

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

            _dotList.restore(obj.dots);
        };
        // 删除
        this.remove = function () {
        	openConfirmTipDialog('您确定删除当前变迁吗？',null,function () {
            	_list = _dotList;
            	_arr = _arrow;
            	_pa = _path;
            	deleteNode(["Hdbq",_id.replace("path", "")])
            }
            );
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
            //_text.attr({
            //    x: mid.x + _textPos.x,
            //    y: mid.y + _textPos.y
            //});
            //$('body').append('refresh.');
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
            //return _text.attr('text');
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
        ///在移动path或者node的时候，需要设置相交线条的或略项。
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
            //} else {
            //    //如果横向和纵向偏移均大于10个像素，增加转折中点
            //    _fromDot = new dot('from', _fromPos, null, new dot('small', {
            //        x: (_fromPos.x + _toPos.x) / 2,
            //        y: _fromPos.y
            //    }));
            //    _fromDot.right().left(_fromDot);
            //    var midDot1 = new dot('big',
            //        { x: _toPos.x, y: _fromPos.y },
            //        _fromDot.right(),
            //        new dot('small', { x: _toPos.x, y: (_fromPos.y + _toPos.y) / 2 }));
            //    midDot1.right().left(midDot1);
            //    _fromDot.right().right(midDot1);
            //    _toDot = new dot('to', _toPos, midDot1.right(), null);
            //    midDot1.right().right(_toDot);
            //}

            // 转换为path格式的字串
            this.toPathString = function () {
                if (!_fromDot)
                    return '';

                var d = _fromDot, p = [["M", d.pos().x, d.pos().y]], arr = '', subPath = []; // p = 'M' + d.pos().x + ' ' + d.pos().y,
                // 线的路径
                while (d.right()) {
                    //subPath[0] = ["M", d.pos().x, d.pos().y];
                    d = d.right();
                    p.push(["L", d.pos().x, d.pos().y]);
                    //subPath[1] = ["L", d.pos().x, d.pos().y];
                    //p = p.concat(this.checkIntersection(subPath));
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
                                    ["A", 6, 6, 0, 0, 1, (ips[i].x + 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y - 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)] //,
                                    );
                            else
                                rpath.splice(index, 0,
                                    ["L", (ips[i].x - 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y + 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)],
                                    ["A", 6, 6, 0, 0, 1, (ips[i].x + 6 * Math.cos(atan * (Math.PI / 180))).toFixed(3), (ips[i].y - 6 * Math.sin(atan * (Math.PI / 180))).toFixed(3)] //,
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
            //this.needCheckIntersection = function (needCheck) {
            //    if (arguments.length == 1)
            //        _needCheck = needCheck;
            //    else
            //        return _needCheck;
            //}
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
        if (_o.isdone == "1") {
            _o.attr.path.stroke = "#ff0000";
            _o.attr.arrow.stroke = "#ff0000";
        }
        _path = _r.path(_o.attr.path.path).attr(_o.attr.path);
        _arrow = _r.path(_o.attr.arrow.path).attr(_o.attr.arrow);

        _dotList = new dotList();
        _dotList.hide();

        refreshpath();// 初始化路径
    };

    EpointWorkFlow.props = function (o, r) {
        var _this = this, _pdiv = $('#myflow_props').hide()/*.draggable({
                                        handle : '#myflow_props_handle'
                                }).resizable().css(EpointWorkFlow.config.props.attr)*/.bind('click',
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
        $(_r).bind('showprops', showpropsHandler);

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
        var _w = $(window).width() - 10, _h = $(window).height() - 77;
        var _r;
        _r = Raphael(c, _w, _h);
        my_r = _r;
        $.extend(true, EpointWorkFlow.config, o);
        function setImageCursor(isMove) {
            //for (var k in _states)
            //    _states[k].setCursor({ "cursor": isMove ? "move" : "default" });
        }
        // 恢复
        if (o.restore) {

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
            // my_EpointWorkFlow = EpointWorkFlow;
        });
    };

    $.EpointWorkFlow = EpointWorkFlow;
    $.fn.get_states = function () {
        return _states;
    }
    $.fn.get_paths = function () {
        return _paths;
    }
//    PageMethods.Get_Path(function (appDir) {
//        my_path = appDir;
//    });
})(jQuery);

(function ($) {
    var EpointWorkFlow = $.EpointWorkFlow;
    $.extend(true, EpointWorkFlow.config.props, {
        name: '新建流程',
        key: '',
        desc: ''
    });



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




function AddPicture() {
    var aspxName = "ReadUserPicturt.aspx";
    top.OpenDialogBox(epoint.url.getAbsoluteUrl('../Design/ReadUserPicturt.aspx?PagesName=ProcessInstanceFlowChart_browser'), "", "  图片", null, 1000, 450, "Activity");
}
function ReadXMLHd(responseText) {
    var NodeName = null;
    var workFlow = null;
    if(typeof responseText == "object"){
    	workFlow = eval("(" + JSON.stringify(responseText) + ")");
    }else{
    	workFlow = eval("(" + responseText + ")");
    }
    var WFProps = workFlow.WFProps;
    if(WFProps&&WFProps.name){
    	var name = WFProps.name;
    	name = name.replace(/_PERCENT_/g,"%");
    	WFProps['name'] = epoint.decodeUtf8(name);
    	workFlow['WFProps'] = WFProps;
    }
    $('#WorkFlowWrapper')
  .EpointWorkFlow({
      basePath: "../image/",
      restore: workFlow,
      tools: {
          save: {
              onclick: function (xml) {
            	  workSaveXml([xml]);
//                  PageMethods.SaveXML(xml, ProcessVersionGuid, function () {
//                      epoint.dialog.alert('保存成功!');
//                  }, onFail);
              }
          }
      },
      flag: true
  });

}



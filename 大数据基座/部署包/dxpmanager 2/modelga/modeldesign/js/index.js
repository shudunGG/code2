/*
 * @Author: jjj 
 * @Date: 2020-08-19 15:59:31 
 * @Last Modified by: jjj
 * @Last Modified time: 2020-10-13 15:18:00
 * @Description: '' 
 */
var rowguid = Util.getUrlParams("flowGuid");
 var type=Util.getUrlParams('type');
var chartDebug = 0;

// 全局变量
var myDiagram = null, // 流程图
    cacheMouseEnterNode = '', // 缓存鼠标移入的节点
    cacheData = '', // 缓存节点数据
    cacheLinkArr = []; // 缓存要连线的节点
var LEFT_DIS = 274, // 画布距离左侧的距离
    TOP_DIS = 141; // 画布距离顶部距离并减去自身高度的一半

var $designLayer = $('#design-layer'), // 弹出框
    $designLayerUl = $('.design-layer-ul', $designLayer); // 弹出框ul

var TIP_ITEM_TPL = $.trim($('#tip-item-tpl').html());
var nodeGuid;
var flowGuid;
var indexWebSocket;
	var log = $('#log-do');
	var livyPath;
	var xms;
	var xmx;
	var flowName;
	var isErrorStep;
	var hdpType;
	var dsId;
	var prestoDsId;
	var callBackData;
var $funcLog = $("#func-log");
// 顶部
(function (win, $) {
    var $user = $('#user'),
        $clickUser = $('.click-user');
  /*  Util.ajax({
        url: pageConfig.pageInfo
    }).done(function (res) {
        if (res.userName) {
            $user.html(res.userName);
        }
    });*/
 // 取到左侧树的值
    epoint.initPage("dxpmodeldesignjobaction", null, function(data) {
        if (data.userName) {
            $user.html(data.userName);
        }	
        nodeGuid = data.nodeGuid;
    	flowGuid = data.flowGuid;
    	flowName = data.flowName;
    	dsId=data.dsId;
    	prestoDsId=data.prestoDsId;
    	if (data.property) {
    		callBackData = JSON.parse(data.property);
		}else{
			callBackData = {
					changeName:flowName
			}
		}
    	livyPath = data.livyPath;
    	xms = data.xms;
    	xmx = data.xmx;
    	hdpType = data.hdpType;
    	var sessionId = data.sessionId;
    	//websocket每个任务调试的唯一编号需动态传入
    	indexWebSocket = new IndexWebSocket(sessionId+flowGuid,log,data.contextPath+"/websocket/pushlog");
        if(type=='3'||type=='4'){
            $('.header').hide();
        }

    });
    
    $('body').on('click', '.back-home', function () {
        pageConfig.backHome();
    }).on('click', '.user', function () {
        $clickUser.slideToggle(100);
        $(this).toggleClass('active');
    }).on('click', '.logout', function () {
        mini.confirm('您确定要退出系统吗？', '系统提示', function (action) {
            if (action == 'ok') {
                window.location.href = Util.getRightUrl('rest/logout?isCommondto=true');
            }
        });
    }).on('click', '.change-pwd', function () {
       // 修改密码
            	dealLinkOpen({
                    id: "change-pwd",
                    name: "修改密码",
                    url: "frame/pages/basic/personalset/mypasswordmodify",
                    openType: "dialog"
                })
    }).on('click', function(e) {
        if (!$(e.target.closest('.user, .click-user')).length) {
            $('.user').removeClass('active');
            $clickUser.slideUp(100);
        }
    })

     win.dealLinkOpen = function (linkData, needLeft) {
        switch (linkData.openType) {
            case 'tabsnav':
                !needLeft && $main.addClass('left-none');
                TabsNav.addTab(linkData);
                break;
            case 'dialog':
                epoint.openTopDialog(linkData.name, Util.getRightUrl(linkData.url));
                break;
            case 'blank':
                var _id = linkData.id ? (linkData.id + '').replace(/-/g, '') : '';
                win.open(Util.getRightUrl(linkData.url), _id);
                break;
            default:
                break;
        }
    };

})(window, jQuery);

// 左侧菜单
(function (win, $) {

    var $leftPanel = $('#left-panel'),
        $allResource = $('#all-resource'),
        $myResource = $('#my-resource'),
        $dataComponent = $('#data-component'),
        $aiComponent = $('#ai-component'),
        $visualComponent = $('#visual-component'),

        LEFT_MENU_TPL = $.trim($('#left-menu-tpl').html()),
        COMPONENT_TPL = $.trim($('#component-item-tpl').html()),
        
        COMPONENT_LIST_TPL = $.trim($('#component-list-tpl').html()), // 20200924
        cacheLeftData = '';



    //#region 左侧菜单交互
    $leftPanel
        .on('click', '.source-tab-item', function () {
            var $this = $(this),
                type = $this.data("type");
            $this.addClass('active').siblings().removeClass('active');
            $('#source-' + type).removeClass('hidden').siblings().addClass('hidden');
        })
        .on('click', '.menu-item', function () {
            var $this = $(this),
                $parent = $this.parent();
            if (!$parent.hasClass('active')) {
                $parent.addClass('active').siblings('.active').removeClass('active');
            } else {
                $parent.removeClass('active');
            }
        })
        .on('click', '.tree-text', function () {
            var $this = $(this),
                hasChild = $this.hasClass('sub'),
                $item = $this.parent(),
                $child = $this.next();

            if (hasChild) {
                $item.toggleClass('active');
                $child.slideToggle(150);
            }
        })
        // 展开收起组件菜单
        // 20200924
        .on('click', '.component-title', function () {
            var $this = $(this),
                $child = $this.next();
            $this.toggleClass('active');
            $child.slideToggle(150);
        })
         // 20200924 end
        // 全局资源
        .on('input propertychange keyup', '#all-search', function () {
            var $this = $(this),
                val = $.trim($this.val());
            searchResult({
                val: val,
                data: cacheLeftData['allList'],
                $dom: $allResource
            })
        })
        // 我的资源
        .on('input propertychange keyup', '#my-search', function () {
            var $this = $(this),
                val = $.trim($this.val());
            searchResult({
                val: val,
                data: cacheLeftData['allList'],
                $dom: $myResource
            })
        })
        // 数据组件
        .on('input propertychange keyup', '#data-search', function () {
            var $this = $(this),
                val = $.trim($this.val());
            listComponentSearch({ // 20200924
                val: val,
                type: 'dataComponent',
                $dom: $dataComponent
            })

        })
        // 智能组件
        .on('input propertychange keyup', '#ai-search', function () {
            var $this = $(this),
                val = $.trim($this.val());
            listComponentSearch({ // 20200924
                val: val,
                type: 'aiComponent',
                $dom: $aiComponent
            })
        })
        // 可视化组件
        .on('input propertychange keyup', '#visual-search', function () {
            var $this = $(this),
                val = $.trim($this.val());
            componentSearch({
                val: val,
                type: 'visualComponent',
                $dom: $visualComponent
            })
        });
    //#endregion

    //#region  搜索
    // 组件搜索
    var dataSearchTimer = null;

    function componentSearch(opt) {
        var val = opt.val,
            type = opt.type,
            $dom = opt.$dom,
            data = JSON.parse(JSON.stringify(cacheLeftData[type]));

        if (val) {
            dataSearchTimer && clearTimeout(dataSearchTimer);
            dataSearchTimer = setTimeout(function () {
                // 搜索
//                console.log(val);
                var tempArr = [];
                $(data).each(function (index, item) {
//                    console.log(item);
                    if (item.name.indexOf(val) > -1) {
                        var reg = new RegExp(val, "g");
                        var tempObj = $.extend({}, item, {
                            result: item.name.replace(reg, '<span class="result-mark">' + val + '</span>')
                        })
                        tempArr.push(tempObj);
                    }
                });
                $dom.html(Mustache.render(COMPONENT_TPL, {
                    list: tempArr
                }));
            }, 250);
        } else {
            dataSearchTimer && clearTimeout(dataSearchTimer);
            // 渲染原来的
            $dom.html(Mustache.render(COMPONENT_TPL, {
                list: data
            }));
        }
    }

    // 20200924
    // 数据组件和智能组件搜索
    function listComponentSearch(opt) {
        var val = opt.val,
            type = opt.type,
            $dom = opt.$dom,
            data = JSON.parse(JSON.stringify(cacheLeftData[type]));

        if (val) {
            dataSearchTimer && clearTimeout(dataSearchTimer);
            dataSearchTimer = setTimeout(function () {
                // 搜索
//                console.log(val);
                var tempArr = [];
                $(data).each(function (index, el) {
                    $(el.children).each(function(m, item) {
                        if (item.name.indexOf(val) > -1) {
                            var reg = new RegExp(val, "g");
                            var tempObj = $.extend({}, item, {
                                result: item.name.replace(reg, '<span class="result-mark">' + val + '</span>')
                            })
                            var tempIndex = -1;

                            for(var i = 0, len = tempArr.length;i < len; i++) {
                                if(tempArr[i].id == el.id) {
                                    tempIndex = i;
                                    break;
                                }
                            }
                            if(tempIndex < 0) {
                                tempArr.push({
                                    id: el.id,
                                    name: el.name,
                                    children: []
                                })
                                tempIndex = tempArr.length - 1;
                            }
                            tempArr[tempIndex].children.push(tempObj);
                        }
                    })
                });
                $dom.html(Mustache.render(COMPONENT_LIST_TPL, {
                    list: tempArr
                }));

                $dom.find('.component-title').trigger('click');
            }, 250);
        } else {
            dataSearchTimer && clearTimeout(dataSearchTimer);
            // 渲染原来的
            $dom.html(Mustache.render(COMPONENT_LIST_TPL, {
                list: data
            }));
        }
    }

    // 20200924 end
    // 资源搜索
    var dep = ""; // 层级深度
    // 搜索并渲染
    var searchRenderTree = function (list, sepLen, searchVal) {
        var html = '';
        !sepLen ? (sepLen = 1) : sepLen++;
        dep = sepLen + 1;
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            item.depLength = 12 * sepLen;
            if (item.hasChild) {
                html += Mustache.render(LEFT_MENU_TPL, $.extend(item, {
                    child: "<ul class='tree-child'>" + searchRenderTree(item.children, sepLen, searchVal) + "</ul>"
                }));
            } else {
                if (item.name.indexOf(searchVal) > -1) {
                    var reg = new RegExp(searchVal, "g");
                    item.result = item.name.replace(reg, '<span class="result-mark">' + searchVal + '</span>');
                    html += Mustache.render(LEFT_MENU_TPL, item);
                }
            }
        }
        return html;
    }

    var menuSearchTimer = null;

    function searchResult(opt) {
        var val = opt.val,
            data = JSON.parse(JSON.stringify(opt.data)),
            $dom = opt.$dom;

        if (val) {
            menuSearchTimer && clearTimeout(menuSearchTimer);
            menuSearchTimer = setTimeout(function () {
                // 搜索
                $dom.empty().html('<ul class="tree-list-container">' + searchRenderTree(data, '', val) + '</ul>');

                for (var i = 0, len = dep; i < len; i++) {
                    removeEmpty($('.tree-list-container'));
                }

                // $('.tree-item').addClass('active');
                // $('.tree-text').addClass('active');
                $('.tree-child').slideDown();

            }, 250);
        } else {
            menuSearchTimer && clearTimeout(menuSearchTimer);
            // 渲染原来的
//            console.log('原来的')
            $dom.empty().html('<ul>' + renderTree(data) + '</ul>');
        }
    }

    // 递归移除没有匹配的数据
    function removeEmpty($ul) {
        $ul.children().each(function (index, item) {
            if ($(item).children('.tree-child').length) {
                if ($(item).children('.tree-child').children().length == 0) {
                    $(item).remove();
                } else {
                    removeEmpty($(item).children('.tree-child'));
                }
            }
        })
    }
    //#endregion

    //#region  渲染左侧菜单
    var renderTree = function (list, sepLen) {
        var html = '';
        !sepLen ? (sepLen = 1) : sepLen++;
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            item.depLength = 12 * sepLen;

            item.hasChild = item.children.length ? true : false;
            if (item.hasChild) {
                html += Mustache.render(LEFT_MENU_TPL, $.extend(item, {
                    child: "<ul class='tree-child'>" + renderTree(item.children, sepLen) + "</ul>"
                }));
            } else {
                html += Mustache.render(LEFT_MENU_TPL, item);
            }
        }
        return html;
    }

    var getLeftMenu = function () {
        Util.ajax({
            url: pageConfig.leftMenu
        }).done(function (res) {
//        	console.log(res);
            var allList = res.allList,
                myList = res.myList,
                dataComponent = res.dataComponent,
                aiComponent = res.aiComponent,
                visualComponent = res.visualComponent,
                menuInfo = res.menuInfo;

            cacheLeftData = res;

            // 一级标题数字
            if (menuInfo) {
                for (var key in menuInfo) {
                    $('#top-' + key).text('(' + menuInfo[key] + ')').attr('title', menuInfo[key]);
                }
            }

            // 全局资源
            if (allList.length) {
                $allResource.html('<ul>' + renderTree(allList) + '</ul>');
            }
            // 我的资源
            if (myList) {
                $myResource.html('<ul>' + renderTree(myList) + '</ul>');
            }

            // 20200924
            // 数据组件
            if (dataComponent.length) {
                $(dataComponent).each(function (index, item) {
                    if(item.children && item.children.length) {
                        $(item.children).each(function(m, el) {
                            el['category'] = "data";
                        })
                    }
                })
//                console.log(dataComponent)
                $dataComponent.html(Mustache.render(COMPONENT_LIST_TPL, {
                    list: dataComponent
                }));
            }

            // 智能组件
            if (aiComponent.length) {
                $(aiComponent).each(function (index, item) {
                    if(item.children && item.children.length) {
                        $(item.children).each(function(m, el) {
                            el['category'] = "ai";
                        })
                    }
                })
                $aiComponent.html(Mustache.render(COMPONENT_LIST_TPL, {
                    list: aiComponent
                }));
            }

            // 20200924 end

            // 可视化组件
           
            if (visualComponent.length) {
                $(visualComponent).each(function (index, item) {
                    item['category'] = "visual";
                })
//                 console.log(visualComponent);
                $visualComponent.html(Mustache.render(COMPONENT_TPL, {
                    list: visualComponent
                }));
            }

            //默认展开左侧树
            $('.component-title').click();

        })
    }

    getLeftMenu();
    //#endregion

    function getHeadWidth() {
        var servinameWidth = $leftPanel.outerWidth(),
            containWidth = $('.container').width(),
            infoWidth = 14;

        return {
            "containWidth": containWidth,
            "servinameWidth": servinameWidth,
            'infoWidth': infoWidth,
            "timeLineWidth": containWidth - servinameWidth - infoWidth,
            'left': servinameWidth + infoWidth
        }
    }

    var C_SERVICENAMEWIDTH = 122;

    bindResize(document.getElementById('move-line'));

    function bindResize(el){ 
		    //初始化参数 
		    var //els = el.style,
		      //鼠标的 X 和 Y 轴坐标 
		      	x = y = 0;
		    $(el).mousedown(function(e){
		      	//按下元素后，计算当前鼠标与对象计算后的坐标 
				x = e.clientX - el.offsetWidth,
				y = e.clientY - el.offsetHeight; 
				//在支持 setCapture 做些东东 
				el.setCapture ? ( 
				//捕捉焦点 
				el.setCapture(), 
				//设置事件 
				el.onmousemove = function(ev){ 
				  	mouseMove(ev || event) 
				}, 
				el.onmouseup = mouseUp 
				) : ( 
				//绑定事件 
					$(document).on("mousemove",mouseMove).on("mouseup",mouseUp) 
				);
				//防止默认事件发生 
				e.preventDefault();
		    }); 
		    //移动事件 
		    function mouseMove(e){
		    	var _calcW = e.clientX ;//- x,
		    		C_VAL = 862, 	//设定画布最小值
		    		_headItemWidth = getHeadWidth(),
		    		max_calcW = _headItemWidth.containWidth -_headItemWidth.infoWidth - C_VAL;
		    	
		    	if(_calcW < C_SERVICENAMEWIDTH) {

		    		_calcW = C_SERVICENAMEWIDTH;
		    	} else if( _calcW > max_calcW) {

		    		_calcW = max_calcW;
		    	}

// 				els.width = _calcW + 'px';
				$leftPanel.outerWidth(_calcW);

				$('#right-panel').css('left', _headItemWidth.left);
		    }
		    //停止事件 
		    function mouseUp(){ 
				//在支持 releaseCapture 做些东东 
				el.releaseCapture ? ( 
				//释放焦点 
				el.releaseCapture(),
				//移除事件 
				el.onmousemove = el.onmouseup = null 
				) : ( 
				//卸载事件 
					$(document).off("mousemove", mouseMove).off("mouseup", mouseUp)
				)
		    } 
		} 

})(window, jQuery);

// 右侧交互
(function (win, $) {
    var $rightPanel = $('#right-panel'),
        $logPanelBtn = $('#log-panel-btn'),
        $logPanel = $('#log-panel');
    var $scaleBox = $('#scale-box');

    var $cxm = $('#contextMenu');
    var $designLayer = $('#design-layer'), // 弹出框
        $designLayerUl = $('.design-layer-ul', $designLayer); // 弹出框ul

    var $rangeScale = $('#range-scale');

    $rightPanel
        // 日志 tab 切换
        .on('click', '.log-tab-item', function () {
            var $this = $(this),
                type = $this.data('type');

            $this.addClass('active').siblings().removeClass('active');
            $('#log-' + type).removeClass('hidden').siblings().addClass('hidden');
            grid.doLayout();

            // 没有数据时添加 no-data 的class
           /* if (type === 'preview') {
                $('#log-' + type).empty().addClass('no-data');
            }*/
        })
        .on('click', '.log-panel-btn', function () {
            var $this = $(this),
                $logPanel = $this.parent();
            $this.toggleClass('active');
            if ($logPanel.hasClass('unfold')) {
                $logPanel.css({
                    bottom: 32 - $logPanel.outerHeight()
                });
            }

            $logPanel.toggleClass('unfold');
        })
        .on('click', '.top-item', function () {
            var $this = $(this),
                type = $this.data('type');
//            console.log(type);
            if (type == 'scale') {
                if ($this.hasClass('active')) {
                    $this.removeClass('active');
                    $scaleBox.fadeOut(200);
                } else {
                    $this.addClass('active');
                    $scaleBox.fadeIn(200);
                }
            }
            if (pageConfig.topClickEvent && typeof pageConfig.topClickEvent == 'function') {
                pageConfig.topClickEvent({
                    type: type
                });
            }

        })
        .on('click', '.cxm', function () {
            var $this = $(this),
                type = $this.data('type');
            if (pageConfig.contextClickEvent && typeof pageConfig.contextClickEvent == 'function') {
                pageConfig.contextClickEvent({
                    type: type,
                    nodeData: cacheData
                });
            }
            $cxm.hide();
        });

    $("body").on('click', function (e) {
        if (!$(e.target.closest('.contextMenu')).length) {
            $cxm.hide();
        }

        if (!$(e.target.closest('.scale-box, .top-item-scale')).length) {
            $scaleBox.fadeOut(200);
            $('.top-item-scale').removeClass('active');
        }

        if (!$(e.target.closest('.source-search')).length) {
            $('.source-search').removeClass('focus');
        }
        
    })
    .on('click', '.source-search', function () {
        $(this).addClass('focus');
    })
    .on('change', '#range-scale', function () {
//        console.log($(this).val());
        if (myDiagram) {
            myDiagram.scale = +$(this).val();
        }
    }).on('click', '.min-icon', function () {
//        console.log($(this).val());
        if (myDiagram) {
            if (myDiagram.scale > 0.5) {
                myDiagram.scale -= .1;
                $rangeScale.jRange('setValue', myDiagram.scale + '');
            }
        }
    }).on('click', '.max-icon', function () {
//        console.log($(this).val());
        if (myDiagram) {
            if (myDiagram.scale < 1.5) {
                myDiagram.scale += .1;

                $rangeScale.jRange('setValue', myDiagram.scale + '');
            }
        }
    });


    $rangeScale.jRange({
        from: 0.5,
        to: 1.5,
        step: 0.1,
        scale: [],
        format: '%s',
        width: 250,
        showLabels: false,
        snap: true
    });

    $rangeScale.jRange('setValue', "0.8");
    
   /* $('#log-preview').empty().addClass('no-data');*/

    // 键盘监听事件
    document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
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
        } else if(ctrlKey && keyCode == 86) {
        	// 粘贴
//         	if(localStorage['copy']) {
//         		var copyData = JSON.parse(localStorage['copy']);

//         		myDiagram.model.addNodeDataCollection(copyData.nodeList);
//         		myDiagram.model.addLinkDataCollection(copyData.linkList);

//         	}
        }
    };

   


    // 交互事件
    win.handleChart = {
        // 获取数据
        getData: function () {
            return myDiagram.model.toJSON();
        },
        // 更新节点数据
        /**
         * 
         * @param {*} opt 
         * nodeData: 节点data参数
         * key 节点data中的参数名
         * val 节点data中参数名对应的值
         */
        updateNode: function (opt) {
            var nodeData = opt.nodeData,
                key = opt.key,
                val = opt.val;
            myDiagram.model.setDataProperty(nodeData, key, val);
        },
        // 保存
        save: function () {

        },
        // 另存
        otherSave: function () {

        },
        // 撤销
        prev: function () {
            myDiagram.undoManager.undo();
        },
        // 恢复
        next: function () {
            myDiagram.undoManager.redo();
        },
        // 清空
        clear: function () {
            myDiagram.clear();
        },
        del: function () {
            myDiagram.commandHandler.deleteSelection();
        },
        // 缩放
        scale: function () {

        },
        // 定位
        init: function () {
            myDiagram.zoomToFit();
            $rangeScale.jRange('setValue', '1');
        },
        // 执行
        do: function () {
            this.changeTab('do');
        },
        // 发布
        release: function () {

        },
        // 右键
        //  复制节点
        copyNode: function () {
            // myDiagram.commandHandler.copySelection();
            // epoint.showTips('复制成功, 请在空白处右键粘贴');
        },
        // 删除
        deleteNode: function () {
            myDiagram.commandHandler.deleteSelection();
        },
        // 切换日志 tab
        /**
         * tab: preview || do
         */
        changeTab: function (type) {
            if (!$('.log-item-' + type).hasClass('active')) {
                $('.log-item-' + type).trigger('click');
            }

            if (!$logPanelBtn.hasClass('active')) {
                $logPanelBtn.trigger('click');
            }
        },
        // 双击弹窗
        showLayer: function () {
            var LAYER_CHILD_TPL = $.trim($('#layer-item-tpl').html());
            cacheLayerData = ""; // 缓存数据处理的数据
            Util.ajax({
                url: pageConfig.leftMenu,
                data: {
                    type: "2"
                }
            }).done(function (res) {
                // var treeList = JSON.parse(ret).custom.treeList;
                var treeList = res.treeList;
                console.log(treeList);
                cacheLayerData = JSON.parse(JSON.stringify(treeList));
                $designLayerUl.html(Mustache.render(LAYER_CHILD_TPL, {
                    list: treeList
                }));
                cacheMouseEnterNode = "";
                $designLayer.show();
            })
        },
        // 连线出现弹窗
        linkLayer: function () {
            var LAYER_CHILD_TPL = $.trim($('#layer-item-tpl').html());
            cacheLayerData = ""; // 缓存数据处理的数据
            Util.ajax({
                url: pageConfig.leftMenu,
                data: {
                    type: "1"
                }
            }).done(function (res) {
                // var treeList = JSON.parse(ret).custom.treeList;
                var treeList = res.treeList;
                cacheLayerData = JSON.parse(JSON.stringify(treeList));
                $designLayerUl.html(Mustache.render(LAYER_CHILD_TPL, {
                    list: treeList
                }));
                // cacheMouseEnterNode = "";
                $designLayer.show();
            })
        }


    }


    // 触发移动
    function bindResize(el) {
        //初始化参数 
        var //els = el.style,
            //鼠标的 X 和 Y 轴坐标 
            x = y = 0,
            maxH = $rightPanel.height() - 77 - 20;

        $(el).mousedown(function (e) {
            //按下元素后，计算当前鼠标与对象计算后的坐标 
//            console.log($(el).parent()[0].className)
            if ($(el).parent()[0].className.indexOf('unfold') < 0) {
                return;
            }
            x = e.clientX - el.offsetWidth,
                y = e.clientY, // - el.offsetHeight,
                h = $logPanel.outerHeight();
            //在支持 setCapture 做些东东 
            el.setCapture ? (
                //捕捉焦点 
                el.setCapture(),
                //设置事件 
                el.onmousemove = function (ev) {
                    mouseMove(ev || event)
                },
                el.onmouseup = mouseUp
            ) : (
                //绑定事件 
                $(document).on("mousemove", mouseMove).on("mouseup", mouseUp)
            );
            //防止默认事件发生 
            e.preventDefault();
        });
        //移动事件 
        function mouseMove(e) {
            if ($(el).parent()[0].className.indexOf('unfold') < 0) {
                return;
            }
            if (e.clientY < y) {
                var _calcH = y - e.clientY + h;
            } else {
                var _calcH = h - e.clientY + y;
            }
            if (_calcH < 198) {
                _calcH = 198;
            }
            if (_calcH > maxH) {
                _calcH = maxH;
            }

            // els.height = _calcH + 'px';

            //serviceNameWidth = _calcW;
            $logPanel.outerHeight(_calcH);

            //els.height = e.clientY - y + 'px'
        }
        //停止事件 
        function mouseUp() {
            if ($(el).parent()[0].className.indexOf('unfold') < 0) {
                return;
            }
            //在支持 releaseCapture 做些东东 
            el.releaseCapture ? (
                //释放焦点 
                el.releaseCapture(),
                //移除事件 
                el.onmousemove = el.onmouseup = null
            ) : (
                //卸载事件 
                $(document).off("mousemove", mouseMove).off("mouseup", mouseUp)
            )
            mini.get('datagrid').doLayout();
        }
    }

    bindResize(document.getElementById('log-panel-move'))


})(window, jQuery);

// 移动spot拖拽后弹窗
(function (win, $) {


    var $rightPanel = $('#right-panel');

    var LAYER_CHILD_TPL = $.trim($('#layer-item-tpl').html());

    // var LAYER_CHILD_TPL = $.trim($('#layer-item-tpl').html()),
    //     cacheLayerData = ""; // 缓存数据处理的数据
    // function loadLayerData() {
    //     Util.ajax({
    //         url: pageConfig.leftMenu,
    //         data: {
    //             type: "1"
    //         }
    //     }).done(function (res) {
    //         var treeList = res.treeList;
    //         cacheLayerData = JSON.parse(JSON.stringify(treeList));
    //         $designLayerUl.html(Mustache.render(LAYER_CHILD_TPL, {
    //             list: treeList
    //         }));
    //     })
    // }
    // loadLayerData();

    // 拖拽
    $designLayer.draggable({
        handle: '#design-layer-move',
        cancel: '.design-layer-search,.design-layer-container',
        containment: ".chart-wrap",
        scroll: false,
        start: function () {
            $designLayer.css({
                // 'background-color': 'rgba(0,0,0,.2)',
                // 'border': '1px solid #999',
                'opacity': .2
            });
        },
        stop: function () {
            $designLayer.css({
                'background-color': '#1c3155',
                'border': '1px solid #475a77',
                "opacity": 1
            })
        }
    });

    // 搜索
    var designLayerTimer = null;
    $designLayer.on("input propertychange", '.layer-search-input', function () {
        var $this = $(this),
            val = $.trim($this.val());

        if (val) {
            designLayerTimer && clearTimeout(designLayerTimer);
            designLayerTimer = setTimeout(function () {
                // 搜索
                var tempArr = [];
                $(cacheLayerData).each(function (index, item) {
//                    console.log(item);
                    if (item.name.indexOf(val) > -1) {
                        var reg = new RegExp(val, "g");
                        var tempObj = $.extend({}, item, {
                            result: item.name.replace(reg, '<span class="result-mark">' + val + '</span>')
                        })
                        tempArr.push(tempObj);
                    }
                });
                $designLayerUl.html(Mustache.render(LAYER_CHILD_TPL, {
                    list: tempArr
                }));
            }, 250);
        } else {
            designLayerTimer && clearTimeout(designLayerTimer);
            // 渲染原来的
            $designLayerUl.html(Mustache.render(LAYER_CHILD_TPL, {
                list: cacheLayerData
            }));
        }

    }).on('click', '.tree-text', function () {
        var $this = $(this),
            itemData = $this.data();
        // console.log(itemData)
        var _fromNode = cacheMouseEnterNode;
        if (_fromNode) {
            var fromLocation = go.Point.parse(_fromNode.part.data.loc),
                _newLoc = '';

            // _newLoc = go.Point.stringify({
            //     x: fromLocation.x + _fromNode.oc.width + 60,
            //     y: fromLocation.y
            // });

            var mx = +$designLayer.css('left').replace(/px/, ''),
                my = +$designLayer.css('top').replace(/px/, '');

            mx = mx - LEFT_DIS;
            my = my - TOP_DIS;

            function convertLoc(mx, my) {
                var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
                var loc = go.Point.stringify(point);
                return loc;
            }

            itemData.loc = convertLoc(mx, my);
            var fromData = _fromNode.part.data;
            fromData['site'] = _fromNode['site'];
            pageConfig.linkLayerNodeClickEvent({
                data: itemData,
                fromData: fromData,
                fromNode:_fromNode.part
            })
            // designConfig.onClickLayer(_fromNode.part.data, itemData);
        } else {

            var mx = +$designLayer.css('left').replace(/px/, ''),
                my = +$designLayer.css('top').replace(/px/, '');

            mx = mx - LEFT_DIS;
            my = my - TOP_DIS;

            function convertLoc(mx, my) {
                var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
                var loc = go.Point.stringify(point);
                return loc;
            }
            var newData = $.extend({}, itemData, {
                loc: convertLoc(mx, my)
            });

            if (pageConfig.layerNodeClickEvent && typeof pageConfig.layerNodeClickEvent == 'function') {
                pageConfig.layerNodeClickEvent({
                    data: newData
                })
            }
        }

        // $designLayer.hide();
    });

    win.designLayerEvent = {
        show: function () {
            $designLayer.show();
        },
        hide: function () {
            $designLayer.hide();
        }
    }

    // 监听鼠标松开事件，此处一直监听，然后改变弹窗的位置
    $rightPanel.on('mouseup', function (e) {
        $designLayer.css({
            left: e.pageX + "px",
            top: e.pageY + "px"
        })
    }).on('mouseup', '.design-layer', function (e) {
        e.stopPropagation();
    })
})(window, jQuery);

// 画布
(function (win, _$) {
    var $ = go.GraphObject.make;

    var $completeTip = _$('#complete-tip');

    var nodeConfig = {
        dataComponent: {
            image: "./images/content/icon_type1.png",
            active: "./images/content/icon_type1_active.png"

        },
        aiComponent: {
            image: "./images/content/icon_type2.png",
            active: "./images/content/icon_type2_active.png"
        },
        visualComponent: {
            image: "./images/content/icon_type3.png",
            active: "./images/content/icon_type3_active.png"
        },
        localNode: {
            image: "./images/content/node_local.png",
            active: './images/content/node_local_active.png'
        },
        sourceNode: {
            image: "./images/content/node_source.png",
            active: "./images/content/node_source_active.png"
        },
        handledNode: {
            image: "./images/content/node_handled.png",
            active: "./images/content/node_handled.png"
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


    var dragged = null;

    myDiagram = $(go.Diagram, "chart-canvas", {
        // "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelScroll ,
        'toolManager.dragSelectingTool': $(RealtimeDragSelectingTool, { isPartialInclusion: true,delay: 100 }),
        initialContentAlignment: go.Spot.Center,
        hasHorizontalScrollbar: false,
        hasVerticalScrollbar: false,
        "undoManager.isEnabled": true,
        scrollMode: go.Diagram.InfiniteScroll,
        
        allowCopy: true
        // "toolManager.hoverDelay": 1200
        // 悬浮延迟
    });

    myDiagram.commandHandler.deleteSelection = function() {
        if(myDiagram.selection.count) {
            pageConfig.contextClickEvent({
                type: 'delete',
                nodeData: myDiagram.selection.first().part.data
            })
        }
        go.CommandHandler.prototype.deleteSelection.call(myDiagram.commandHandler);
    };

     myDiagram.commandHandler.doKeyDown = function(e) {
		var e = myDiagram.lastInput;
		// Meta（Command）键代替Mac命令的“控制”
		var control = e.control || e.meta;
		var key = e.key;
		//退出任何撤销/重做组合键，具体键值根据需求而定
		if(control &&(key == 'V')) {
			// 粘贴

			    if(localStorage['copy']) {
        		var copyData = JSON.parse(localStorage['copy']);

                var recordRelativeNode = {};
                // 修改key数据
        		_$(copyData.nodeList).each(function(index,nodeData) {
                    var oldKey = JSON.parse(JSON.stringify(nodeData)).key,
                        newKey = Util.uuid();

                        recordRelativeNode[oldKey] = newKey;

        		    _$(copyData.linkList).each(function(m,linkData) {
        		        if(linkData.from === oldKey) {
        		            linkData.from = newKey;
        		            linkData.fromPort = newKey;
        		        }
        		        if(linkData.to === oldKey) {
        		            linkData.to = newKey;
        		            linkData.toPort = newKey;
        		        }

        		        delete linkData.__gohashid; // 清空缓存，解决重复粘贴不显示问题
        		    });

        		    nodeData.key = newKey;
        		    delete nodeData.__gohashid;
        		});



_$(copyData.nodeList).each(function(index, nodeData) {
   if(nodeData.linksQueue) {
        var _linksQueue = [],
            nodeLinks = JSON.parse(nodeData.linksQueue);
        _$(nodeLinks).each(function(linkIndex, linkNodeKey) {
            if(recordRelativeNode[linkNodeKey]) {
                _linksQueue.push(recordRelativeNode[linkNodeKey])
            } else {
                _linksQueue.push(linkNodeKey);
            }
        });
        nodeData.linksQueue = JSON.stringify(_linksQueue);
   }

});
//
//_$(copyData.linkList).each(function(linkData) {
//    myDiagram.model.addLinkData(linkData);
//});

setTimeout(function() {
myDiagram.model.addNodeDataCollection(copyData.nodeList);
        		myDiagram.model.addLinkDataCollection(copyData.linkList);
},500);


        	}
		} ;

		//调用没有参数的基础方法（默认功能）
		go.CommandHandler.prototype.doKeyDown.call(this);
	};

    myDiagram.addDiagramListener("ClipboardChanged",
      function(e) {
       localStorage['copy'] = '';
          var nodeList = [],
          linkList = [];
          e.subject.each(function(e) {
            var data = e.part.data;

            if(data.from) {
                // 连线
                linkList.push(data);
            } else {
                nodeList.push(data);
            }
          });

          var copyData = JSON.stringify({
              nodeList: nodeList,
              linkList: linkList
          });


        localStorage['copy'] = copyData;


      });


    myDiagram.addDiagramListener("ClipboardPasted",
      function(e) {
         e.diagram.selection.each(function(item) {
			selectNode = item;
			selectNodeData = selectNode.part.data;
			if(selectNodeData.loc){
			    var mx=selectNodeData.loc.split(' ')[0];
                var my=selectNodeData.loc.split(' ')[1];
                //y轴下移80
                my=Number(my)+80;
                var loc = mx+" "+my;
                myDiagram.model.setDataProperty(selectNodeData, 'loc', loc);
			}else if(selectNodeData.fromPort){
                 myDiagram.model.setDataProperty(selectNodeData, 'fromPort', selectNodeData.from);
                 myDiagram.model.setDataProperty(selectNodeData, 'toPort', selectNodeData.to);
			}
			//复制后保存下画布
             var data = handleChart.getData();
                epoint.execute('saveData', '',data, function(msg) {
                     mini.showTips({ content: "复制成功,请重新配置组件！",
                                       state: "success",
                                       x: "center",
                                       y: "center",
                                       timeout: 2000
                       });
               });
		})
      });

    myDiagram.toolManager.linkingTool.temporaryLink =
        $(go.Link, {
                layerName: "Tool"
            },
            $(go.Shape, {
                stroke: nodeConfig.linkColor,
                strokeWidth: 2,
                strokeDashArray: [4, 2]
            })
        );

    var tempfromnode =
        $(go.Node, {
                layerName: "Tool"
            },
            $(go.Shape, "RoundedRectangle", {
                stroke: "transparent",
                strokeWidth: 3,
                fill: null,
                portId: "",
                width: 1,
                height: 1
            })
        );
    myDiagram.toolManager.linkingTool.temporaryFromNode = tempfromnode;
    myDiagram.toolManager.linkingTool.temporaryFromPort = tempfromnode.port;


    var temptonode =
        $(go.Node, {
                layerName: "Tool"
            },
            $(go.Shape, "RoundedRectangle", {
                stroke: "transparent",
                strokeWidth: 3,
                fill: null,
                portId: "",
                width: 1,
                height: 1
            })
        );
    myDiagram.toolManager.linkingTool.temporaryToNode = temptonode;
    myDiagram.toolManager.linkingTool.temporaryToPort = temptonode.port;

    // #region 拖拽事件
    function highlight(node) { // may be null
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

    var dragItemList = ['component-img', 'component-icon-box', 'component-txt']
    // 开始拖拽
    document.addEventListener("dragstart", function (event) {
        var className = event.target.className;
        if (className.indexOf('drag-item') > -1) {
            dragged = event.target;
        } else if (dragItemList.indexOf(className) > -1) {
            dragged = _$(event.target).closest('.drag-item')[0];
            className = "drag-item";
        } else {
            return;
        }
    }, false);

    document.addEventListener("dragend", function (event) {
        dragged.style.border = "";
        highlight(null);
    }, false);

    var div = document.getElementById("chart-canvas");
    div.addEventListener("dragenter", function (event) {
        event.preventDefault();
    }, false);

    div.addEventListener("dragover", function (event) {
        if (this === myDiagram.div) {
            var can = event.target;
            var pixelratio = window.PIXELRATIO || 1;

            if (!(can instanceof HTMLCanvasElement))
                return;

            var bbox = can.getBoundingClientRect();
            var bbw = bbox.width;
            if (bbw === 0)
                bbw = 0.001;
            var bbh = bbox.height;
            if (bbh === 0)
                bbh = 0.001;
            var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
            var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);
            var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
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
    }, false);

    div.addEventListener("dragleave", function (event) {
        if (event.target.className == "design-diagram") {
            event.target.style.background = "";
        }
        highlight(null);
    }, false);

    div.addEventListener("drop", function (event) {
        event.preventDefault();

        if (this === myDiagram.div) {
            var can = event.target;
            var pixelratio = window.PIXELRATIO || 1;

            // if the target is not the canvas, we may have trouble, so just
            // quit:
            if (!(can instanceof HTMLCanvasElement))
                return;

            var bbox = can.getBoundingClientRect();
            var bbw = bbox.width;
            if (bbw === 0)
                bbw = 0.001;
            var bbh = bbox.height;
            if (bbh === 0)
                bbh = 0.001;
            var x_shift = 94; // 104 为数据节点
            var y_shift = 0;
            if(dragged.dataset.category) {
            	x_shift = 90;
            	y_shift = 30;
            }
            var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw) - x_shift;
            var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh) + y_shift;
            var point = myDiagram.transformViewToDoc(new go.Point(mx, my));
            var loc = go.Point.stringify(point);
            myDiagram.startTransaction('new node');

            var itemData = {
                key: dragged.dataset.id,
                type: dragged.dataset.type,
                name: dragged.dataset.name,
                url: dragged.dataset.url,
                icon: dragged.dataset.icon,
                maxlinks: dragged.dataset.maxlinks,
                number: "0",
                designpage: dragged.dataset.designpage,
                extraction: dragged.dataset.extraction,
                bagguid: dragged.dataset.bagguid,
                category: dragged.dataset.category,
                sfname: dragged.dataset.sfname,
                status: dragged.dataset.status,
                message: dragged.dataset.message,
                tablename: dragged.dataset.tablename,
                tableid: dragged.dataset.tableid,
                canInitView: dragged.dataset.caninitview,
                from: dragged.dataset.from || "",
                step: dragged.step,
                modeltype: dragged.dataset.modeltype,
                loc: loc
            }


            // var newData = _$.extend({}, itemData, { //复写key
            //     key: Util.uuid(),
            //     count: "3000"
            //     // step : dragged.dataSet.step || 0,
            //     // bagguid : dragged.dataSet.bagguid || '',
            //     // dsid : dragged.dataSet.dsid || '',
            //     // tableid : dragged.dataSet.tableid || ''
            // });
            // myDiagram.model.addNodeData(newData);
            if (pageConfig.onDropEnd && typeof pageConfig.onDropEnd == 'function') {
                pageConfig.onDropEnd({
                    data: itemData
                });
            }
            // if (designConfig.onDropStart && typeof designConfig.onDropStart == 'function') {
            //     designConfig.onDropStart(itemData, dragged.dataset);
            // }

            // myDiagram.model.addNodeData(itemData);
            myDiagram.commitTransaction('new node');

        }

        // If we were using drag data, we could get it here, ie:
        // var data = event.dataTransfer.getData('text');
    }, false);

    //#endregion


    //#region 右键菜单
    var cxElement = document.getElementById("contextMenu");

    cxElement.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        return false;
    }, false);

    function showContextMenu(e) {
        cacheData = e.selectionObject.data;

        cxElement.style.display = "block";

        var mousePt = myDiagram.lastInput.viewPoint;

        cxElement.style.left = mousePt.x + 5 + "px"; // 20为自定义偏移量
        cxElement.style.top = mousePt.y + 5 + "px"; // 44为自定义偏移量

        $completeTip.hide();
    }

    var myContextMenu = $(go.HTMLInfo, {
        show: showContextMenu,
        mainElement: cxElement
    });

    //#endregion 右键菜单 end

    //节点部分样式
    function nodeStyle() {
        return [
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
                locationSpot: go.Spot.LeftCenter,
                contextMenu: myContextMenu,
                click: function (e, node) {
                    if (chartDebug) {
//                        console.log(node.part.data)
                    }
                },
                mouseEnter: function (e, node) {
                    myDiagram.startTransaction('cacheBlock');
                    myDiagram.model.setDataProperty(node.part.data, 'other', '');
                    myDiagram.commitTransaction('cacheBlock');
                    // showPorts(node.part, true);
                    cacheMouseEnterNode = node;
                    /*pageConfig.onMouseEnterNode({
                        data: node.part.data,
                        $dom: $completeTip,
                        cb: function () {
                            $completeTip.css({
                                left: e.Er.pageX + 'px',
                                top: e.Er.pageY + 5 + 'px'
                            }).show();
                        }
                    })*/
                },
                mouseLeave: function (e, obj) {
                    $completeTip.hide();
                    // showPorts(obj.part, false);
                    // cacheMouseEnterNode = ""
                },
                linkValidation: function (fromNode, fromPort, toNode, toPort) {
                    
                    var linksNum = toNode.findLinksInto().count;
                    var inputNum = +toNode.part.data.inputNum || +toNode.part.data.maxlinks;
                    if (linksNum >= inputNum) {
                        return false;
                    } else {
                        return true;
                    }
                },
                doubleClick: function (e, node) {
                    var nodeData = node.part.data,
                    _linkLists = node.findLinksInto(),
                    _linkCount = _linkLists.count;
                    pageConfig.openConfig({
                        nodeData: nodeData,
                        linkCount: _linkCount
                    })
                }
            }
        ];
    }

    function showPorts(node, show) {
        // var color = '#007dfc';
        // if (node.data.type == 'result') {
        //     color = "#fff";
        // }
        // if (!cacheMouseEnterNode) {
        //     cacheMouseEnterNode = node;
        // }
        // if (cacheMouseEnterNode && node.part.data.key != cacheMouseEnterNode.part.data.key) {
        //     cacheMouseEnterNode = node;
        // }

        var diagram = node.diagram;

        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;


        node.ports.each(function (port) {
            port.opacity = show ? 1 : 0;
        });
        node.cursor = 'move';
    }

    function makePort(name, spot, output, input) {
        return $(go.Shape, "Circle", {
                fill: nodeConfig.Spot.fill,
                stroke: nodeConfig.Spot.stroke,
                desiredSize: new go.Size(10, 10),
                alignment: spot,
                alignmentFocus: spot,
                // portId: name,
                fromSpot: spot,
                toSpot: spot,
                opacity: 1,
                cursor: "pointer",
                toLinkable: true,
                fromLinkable: false,
                // toMaxLinks: 2,
                mouseEnter: function (e, node) {
                    myDiagram.startTransaction('cacheBlock');
                    myDiagram.model.setDataProperty(node.part.data, 'other', '');
                    myDiagram.commitTransaction('cacheBlock');

                    cacheMouseEnterNode['site'] = name;
                    // cacheMouseEnterNode = node;
                    // if (typeof pageConfig.portEnter == 'function') {
                    //     pageConfig.portEnter($tip, cacheMouseEnterNode, function() {
                    //         var pageX = e.Er.pageX, pageY = e.Er.pageY;

                    //         var tipW = $tip.outerWidth(true);
                    //         var Margin = 12;
                    //         if (name == 'T') {
                    //             pageY = pageY - 32 - Margin;
                    //             pageX = pageX - tipW / 2;
                    //         } else if (name == 'R') {
                    //             pageX = pageX + Margin;
                    //             pageY = pageY - 16;
                    //         } else if (name == 'L') {
                    //             pageX = pageX - tipW - Margin;
                    //             pageY = pageY - 16;
                    //         } else if (name == "B") {
                    //             pageX = pageX - tipW / 2;
                    //             pageY = pageY + Margin;
                    //         }
                    //         $tip.css({
                    //             top : pageY + 'px',
                    //             left : pageX + 'px'
                    //         }).show();
                    //     });

                    // }
                    // node.fill = nodeConfig.hoverColor;
                },
                mouseLeave: function (e, node) {
                    // node.fill = nodeConfig.Spot.fill;
                    // $tip.html('').hide();
                }
//                click: function (e, node) {
//                    node.fill = nodeConfig.hoverColor;
//                    node["site"] = name;
//                    if (cacheLinkArr.length < 2) {
//                        cacheLinkArr.push(node);
//                        if (cacheLinkArr.length === 2) {
//                            // 两个的时候直接连线
//                            cacheLinkArr[0].fill = nodeConfig.Spot.fill;
//                            cacheLinkArr[1].fill = nodeConfig.Spot.fill;
//
//                            pageConfig.twoSpotLinkEvent({
//                                arr: cacheLinkArr
//                            });
//                        }
//                    }
//                },
                
            },
            new go.Binding("fromLinkable", "", function (nodeData) {
                var classify = nodeData.classify || '';
                if(classify == 'source') {
                    return false;
                }
                if(nodeData.sfname == '本地库' || nodeData.sfname == '外部库') {
                    return false;
                }

                return true;
            }),
            new go.Binding("portId", "key")
        );
    }

    function makeLinkPort(width, move) {
        return $(go.Shape, "LineH", {
                fill: '#f60',
                height: .01,
                width: width + (move ? move : 8),
                // selectionAdorned: false,
                margin: new go.Margin(0, 0, 0, -4),
                stroke: "#f00",
                // canSelect: false,
                // selectionAdorned:false,
                alignment: go.Spot.Center,
                strokeWidth: chartDebug ? 1 : 0,
                fromSpot: go.Spot.LeftRightSides, // links only go from the right side to the left side
                toSpot: go.Spot.LeftRightSides,
                fromLinkable: false,
                toLinkable: true,
                opacity: 0,
                cursor: "pointer"
            },
            new go.Binding("fromLinkable", "", function (nodeData) {
                var classify = nodeData.classify || '';
                if(classify == 'source') {
                    return false;
                }
                if(nodeData.sfname == '本地库' || nodeData.sfname == '外部库') {
                    return false;
                }

                return true;
            }),
            new go.Binding("portId", "key"),
            {
                mouseEnter: function (e, node) {
                    myDiagram.startTransaction('cacheBlock');
                    myDiagram.model.setDataProperty(node.part.data, 'other', '');
                    myDiagram.commitTransaction('cacheBlock');
                }
            }
        )
    }


    //#region 数据资源表
    var tableNode = $(go.Node, "Spot", nodeStyle(), {
            selectionAdorned: false
        },
        //#region
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
                    }),
                    new go.Binding("source", "isSelected", function (s, node) {
                        var val = node.part.data.classify || 'local';
                        return s ? nodeConfig[val + 'Node'].active : nodeConfig[val + 'Node'].image;
                    }).ofObject()
                ),
                makePort("L", new go.Spot(-.04, .5, 0, 0), true, true),
                makePort("R", new go.Spot(1.04, .5, 0, 0), true, true),
                makeLinkPort(210, 14)
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
                //#endregion
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
                    new go.Binding('visible', 'classify', function(val) {
                        return val == 'source' ? false : true;
                    }),
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
        // {
        //     click: function () {
        //         // alert(1)
        //     },
        //     mouseEnter: function (e, obj) {
        //         console.log('mouseenter')
        //         console.log(obj.part.data)
        //         if (obj.part.data && obj.part.data.key) {
        //             // showFlowList(e, obj.part.data);
        //         }
        //     }
        // }
    );

    myDiagram.nodeTemplateMap.add("", tableNode);

    //#endregion



    //#region 数组组件
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
                            source: nodeConfig.dataComponent.image,
                            fromSpot: go.Spot.LeftRightSides, // links only go from the right side to the left side
                            toSpot: go.Spot.LeftRightSides,
                            fromLinkable: false,
                            toLinkable: false
                        },
                        new go.Binding("source", "isSelected", function (s, node) {
                            return s ? nodeConfig.dataComponent.active : nodeConfig.dataComponent.image;
                        }).ofObject()
                        // new go.Binding("portId", "key"),
                    ),
                    
                    $(go.Picture, {
                            name: "Picture",
                            width: 66,
                            height: 66,
                            margin: new go.Margin(-66, 0, 8, 0),
                            imageStretch: go.GraphObject.None,
                            cursor: 'move'
                        },
                        new go.Binding("source", "icon")),
                    makePort("L", new go.Spot(-.08, .5, 0, 0), true, true),
                    makePort("R", new go.Spot(1.08, .5, 0, 0), true, true),
                    makeLinkPort(66),
                    $(go.Shape, "RoundedRectangle", {
                       width: 54,
                        height: 66,
                        margin: new go.Margin(0,0,0,6),
                        fill: 'transparent',
                        stroke: "#f00",
                        strokeWidth: 0
                    })

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
                            textAlign: "center",
                            visible: true,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            overflow: go.TextBlock.OverflowEllipsis,
                            verticalAlignment: go.Spot.Center,
                            stroke: "#fff",
                            toolTip: $(go.Adornment, "Auto",
                                $(go.Shape, {
                                    fill: "#fff"
                                }),
                                $(go.Panel, "Vertical",
                                    $(go.TextBlock, {
                                            margin: 3
                                        },
                                        new go.Binding("text", "count"))))
                        },
                        new go.Binding("text", "count"),
//                         new go.Binding("visible", "count", function (val) {
//                             return !!val;
//                         })
                    )
                )

            )
            // {
            //     click: function () {
            //         // alert(1)
            //     },
            //     mouseEnter: function (e, obj) {
            //         console.log('mouseenter')
            //         console.log(obj.part.data)
            //         if (obj.part.data && obj.part.data.key) {
            //             // showFlowList(e, obj.part.data);
            //         }
            //     }
            // }
        );

    myDiagram.nodeTemplateMap.add("data", dataComponent);
    //#endregion

    //#region 智能组件
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
                            source: nodeConfig.aiComponent.image,
                            fromSpot: go.Spot.LeftRightSides, // links only go from the right side to the left side
                            toSpot: go.Spot.LeftRightSides,
                            fromLinkable: false,
                            toLinkable: false
                        },
                        new go.Binding("source", "isSelected", function (s, node) {
                            return s ? nodeConfig.aiComponent.active : nodeConfig.aiComponent.image;
                        }).ofObject()
                        // new go.Binding("portId", "key"),
                    ),

                    $(go.Picture, {
                            name: "Picture",
                            width: 64,
                            height: 77,
                            margin: new go.Margin(-77, 0, 8, 0),
                            imageStretch: go.GraphObject.None,
                            cursor: 'move'
                        },
                        new go.Binding("source", "icon")),
                    makePort("L", new go.Spot(-.08, .5, 0, 0), true, true),
                    makePort("R", new go.Spot(1.08, .5, 0, 0), true, true),
                    makeLinkPort(64),
                    $(go.Shape, "RoundedRectangle", {
                       width: 52,
                        height: 66,
                        margin: new go.Margin(0,0,0,6),
                        fill: 'transparent',
                        stroke: "#f00",
                        strokeWidth: 0
                    })

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
                            textAlign: "center",
                            visible: true,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            verticalAlignment: go.Spot.Center,
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
                                        new go.Binding("text", "count"))))
                        },
                        new go.Binding("text", "count"),
//                         new go.Binding("visible", "count", function (val) {
//                             return !!val;
//                         })
                    )
                )

            )
            // {
            //     click: function () {
            //         // alert(1)
            //     },
            //     mouseEnter: function (e, obj) {
            //         console.log('mouseenter')
            //         console.log(obj.part.data)
            //         if (obj.part.data && obj.part.data.key) {
            //             // showFlowList(e, obj.part.data);
            //         }
            //     }
            // }
        );

    myDiagram.nodeTemplateMap.add("ai", aiComponent);
    //#endregion

    //#region 可视化组件
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
                            source: nodeConfig.visualComponent.image,
                            fromSpot: go.Spot.LeftRightSides, // links only go from the right side to the left side
                            toSpot: go.Spot.LeftRightSides,
                            fromLinkable: false,
                            toLinkable: false
                        },
                        new go.Binding("source", "isSelected", function (s, node) {
                            return s ? nodeConfig.visualComponent.active : nodeConfig.visualComponent.image;
                        }).ofObject()
                        // new go.Binding("portId", "key"),
                    ),

                    $(go.Picture, {
                            name: "Picture",
                            width: 60,
                            height: 60,
                            margin: new go.Margin(-60, 0, 8, 0),
                            imageStretch: go.GraphObject.None,
                            cursor: 'move'
                        },
                        new go.Binding("source", "icon")),
                    makePort("L", new go.Spot(-.08, .5, 0, 0), true, true),
                    makePort("R", new go.Spot(1.08, .5, 0, 0), true, true),
                    makeLinkPort(60),
                     $(go.Shape, "RoundedRectangle", {
                       width: 48,
                        height: 66,
                        margin: new go.Margin(0,0,0,6),
                        fill: 'transparent',
                        stroke: "#f00",
                        strokeWidth: 0
                    })

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
                            textAlign: "center",
                            visible: true,
                            stretch: go.GraphObject.Horizontal,
                            wrap: go.TextBlock.WrapFit,
                            verticalAlignment: go.Spot.Center,
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
                                        new go.Binding("text", "count"))))
                        },
                        new go.Binding("text", "count"),
//                         new go.Binding("visible", "count", function (val) {
//                             return !!val;
//                         })
)
                )

            )
            // {
            //     click: function () {
            //         // alert(1)
            //     },
            //     mouseEnter: function (e, obj) {
            //         console.log('mouseenter')
            //         console.log(obj.part.data)
            //         if (obj.part.data && obj.part.data.key) {
            //             // showFlowList(e, obj.part.data);
            //         }
            //     }
            // }
        );

    myDiagram.nodeTemplateMap.add("visual", visualComponent);
    //#endregion

    //#region 连线
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
                relinkableTo: false,
                mouseEnter: function (e, link) {

                    // console.log(link.data.to);
                    // console.log(link);
                    // link.stroke = '#f00'
                    // myDiagram.select(myDiagram.findNodeForKey(link.data.to));
                },
                mouseLeave: function (e, link) {
                    // myDiagram.clearSelection();
                }
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
    //#endregion


    //#region 背景双击
    myDiagram.addDiagramListener("BackgroundDoubleClicked", function (e) {
        handleChart.showLayer();
    });

    var layerContextMenu = $(go.HTMLInfo, {
		show: function() {
            handleChart.showLayer();
        },
		hide: function() {
            $designLayer.hide();
        }
    });
    
    myDiagram.contextMenu = layerContextMenu;

    myDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
        $designLayer.hide();
    });

    myDiagram.addModelChangedListener(function (evt) {
        if (evt.Ks == "Linking") {
            if (evt.Ym == "RolledBackTransaction") {
                // console.log('弹出来吧')
                handleChart.linkLayer();
            }
        }

        if(myDiagram.model.nodeDataArray.length > 1) {
            myDiagram.padding = new go.Margin(200, 5, 200, 5);
        } else {
            myDiagram.padding = 5;
        }
    });

 // 监听连线完成
    myDiagram.addDiagramListener("LinkDrawn", function(e) {
//        console.log("连接后");
//        console.log(e.subject.data); // 这是这个线条的数据
//        console.log(e);

        // linkData.color = 'blue';
        newlinkData = e.subject.data;
        var linkData = e.subject.data,
            fromNodeKey = linkData.from,
            toNodeKey = linkData.to,
            toNode = myDiagram.findNodeForKey(toNodeKey),
            fromNode = myDiagram.findNodeForKey(fromNodeKey);

        /*
		 * if(fromNode.data.banwrong!=1){ showMenu(); }
		 */
        
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

        // 修改状态
        myDiagram.model.setDataProperty(
            fromNode.data,
            "linksQueue",
            JSON.stringify(fromArr)
        );

        if (
        	pageConfig.onLinked &&
            typeof pageConfig.onLinked == "function"
        ) {
        	pageConfig.onLinked({
                count: _count,
                toNode: toNode,
                fromNodeKey: fromNodeKey,
                firstNodeKey: arr[0],
                fromNode: fromNode,
                fromFirstNodeKey: fromArr[0],
                fromCount: _fromCount
            });
        }

    });
    //#endregion


    function load() {
        // var pid = getQueryString('id')||'';
        Util.ajax({
            url: pageConfig.getContent,
            data: {
                // id: pid
            }
        }).done(function (res) {
//        	console.log(res);
            if (res&&typeof res === 'string') {
                res = JSON.parse(res);
            }

//            if (res) {
                var renderData = {
                    "class": "go.GraphLinksModel",
                    "linkFromPortIdProperty": "fromPort",
                    "linkToPortIdProperty": "toPort",
                    "nodeDataArray": res.nodeDataArray,
                    "linkDataArray": res.linkDataArray
                }
//                console.log(renderData);
                myDiagram.model = go.Model.fromJson(renderData);

                myDiagram.scale = 0.8;
//            }
        });
    }

    load();

    function reset() {
        myDiagram.layout = new go.LayeredDigraphLayout;

        myDiagram.layout.isOngoing = false;

        var arr = [],
        nodeArr = [];

        myDiagram.model.nodeDataArray.forEach(function(item){
            arr.push(+item.loc.split(' ')[0]);
            nodeArr.push(item);
        })


        arr.sort(function(a,b){return a-b;});

        var centerX = (arr[arr.length-1] - arr[0])/2;

        var minXNode = '',
            minX = 10000000;
        nodeArr.forEach(function(el) {
              var _x = +el.loc.split(' ')[0],
                absVal = Math.abs(centerX - _x);

              if(absVal < minX) {
                  minX = absVal;
                  minXNode = el;
              }
        });
        setTimeout(function() {
            myDiagram.commandHandler.scrollToPart(myDiagram.findNodeForKey(minXNode.key));
        }, 200);
    }

    win.reset = reset;


     // 移除连线
     win.removeLink=function(fromKey, toKey) {
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

            // to节点
            var toNode = myDiagram.findNodeForKey(toKey);
            (_toLinkLists = toNode.findLinksOutOf()), // to节点连线信息
                (_toLinkQueue = toNode.data.linksQueue || "[]");

            var toArr = JSON.parse(_toLinkQueue);

            toArr.remove(fromKey);

            fromArr.splice(0, 1);

            // fromArr.push(linkData.to);

            // 修改状态
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


})(window, jQuery);
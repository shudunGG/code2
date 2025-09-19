/*!
 * 查找
 * author:jiangqn
 * date: 2019-09-09
 * version: 1.0.0
 */

mini.parse();
var $window = $(window),
    $main = $('#main');
// 通用方法
(function(win,$) {
    var M = Mustache;
    // 获取模板html
    win.getTplHtml = function(id, data) {
        var tpl = $('#' + id).html();
        M.parse(tpl);
        return M.render(tpl, data);
    }
    // 动态生成svg元素
    win.makeSVG = function(tag, attrs) {
        var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs) {
            el.setAttribute(k, attrs[k]);
        }  
        return el;
    }
})(window,jQuery);

// 主体
(function(win,$) {
    var $helpBtn = $('#help-btn'),
    	$infoBtn = $(".info-btn"),
        $remind = $('#remind'),
        $saveBtn = $('#save-btn');
    
    var $bd = $(".fui-acc-bd");
    // 点击说明按钮
    $helpBtn.on('click',function() {
        if ($remind.hasClass('hidden')) {
            $remind.removeClass('hidden');
        } else {
            $remind.addClass('hidden');
        }
    })
    // 点击内容区域折叠
    $infoBtn.on("click", function () {
        var that = $(this),
            $parent = that.closest(".fui-accordion"),
            $notice = $parent.find(".fui-notice-inner");
        if ($parent.hasClass("opened")) {
            $notice.toggleClass("hidden");
            monitor();
        }
    });
    // 关闭说明
    $remind.on('click','.notice-close-btn',function() {
        $remind.addClass('hidden');
    })
    // 点击保存
    $saveBtn.on('click',function() {
        var submitTableData = win.mod2.submitTableData();
        if(epoint.validate()){
        	//是否存在
        	var primaryKeyNum=0;
        	var pkLinkNum=0;
        	submitTableData.sourceList.forEach(function(item) {
                if(item.primaryKey) {
                    primaryKeyNum += 1;
                }
            });
            if(primaryKeyNum>1) {
                epoint.alert('至多选择一个主键');
                return;
            }
        	//调度值清除不需要的
        	var scheduler=mini.get('scheduler'),
	    	schedulerType=mini.get('schedulerType'),
	    	schedulerunit=mini.get('schedulerunit'),
	    	intervalSeconds=mini.get('intervalSeconds'),
	    	intervalMinutes=mini.get('intervalMinutes'),
	    	timingtype=mini.get('timingtype'),
	    	weekDay=mini.get('weekDay'),
	    	dayOfMonth=mini.get('dayOfMonth'),
	    	hour=mini.get('hour'),
	    	minutes=mini.get('minutes');
        	if(scheduler.getValue()==1){
        		epoint.clear('row2');
        		epoint.clear('row3');
        		if(schedulerunit.getValue()=='sec'){
        			intervalMinutes.setValue('');
        			if(intervalSeconds.getValue()<=0){
        				epoint.alert('间隔时间必须大于0');
        				return;
        			}
        		}else if(schedulerunit.getValue()=='min'){
        			intervalSeconds.setValue('');
        			if(intervalMinutes.getValue()<=0){
        				epoint.alert('间隔时间必须大于0');
        				return;
        			}
        		}
        	}else if(scheduler.getValue()==2){
        		epoint.clear('row1');
        		epoint.clear('row3');
        		if(timingtype.getValue()=='day'){
        			epoint.clear('weekDay');
        			epoint.clear('dayOfMonth');
        		}else if(timingtype.getValue()=='week'){
        			epoint.clear('dayOfMonth');
        		}else if(timingtype.getValue()=='month'){
        			epoint.clear('weekDay');
        		}
        	}else if(scheduler.getValue()==3){
        		epoint.clear('row1');
        		epoint.clear('row2');
        	}else if(scheduler.getValue()==0){
        		epoint.clear('row1');
        		epoint.clear('row2');
        		epoint.clear('row3');
        	}
        	epoint.execute('save',"",submitTableData,function(data){
        		if(data.msg.indexOf('成功')!=-1||data.msg.indexOf('流程异常')!=-1){
        			epoint.alert(data.msg,'',function(){
        				back();
        			});
        		}else{
        			epoint.alert(data.msg);
        		}
        	});
        }
    })
    
    // 监听高度变化
    function monitor() {
        $.each($bd, function (i, item) {
            // 高度发生变化
            var $next = $(item).parent('[role="accordion"]').next();
            if ($next && $next.length > 0) {
                if ($next.offset().top <= win.scrollTop) {
                    $next.addClass("fixed").siblings().removeClass("fixed");
                    $next.find(".fui-acc-hd").css('top', win.scrollTop);
                }
            }
        })
    }
    
    $('body').on('click', '.tip-btn', function() {
		var $this = $(this);
		var $parent = $this.closest(".fui-accordion"),
        $notice = $parent.find(".fui-notice");
		var	 contentHtml = $notice[0].innerHTML, 
			tip = new mini.ToolTip();
		if($this.hasClass('flag')) {
			$this.removeClass('flag');
			tip.close();
		} else {
			$this.addClass('flag');
			
			tip.set({
				defaultTheme:'light',
				target : document,
				trigger : 'click',
				selector : '.tip-btn',
				 placement : 'bottom', 
				autoHide : true,
				onbeforeopen : function(e) {
					e.content = contentHtml;
					e.cancel = false;
				},
				onOpen : function(e) {
					// var $close = $('').appendTo($notice);
				}
			});
			tip.addCls('fui-toolbar-tooltip');
		}
		// 点击按钮关闭
		$('.fui-toolbar-tooltip').on('click', '.notice-close-btn', function() {
			tip.close();
			$this.removeClass('flag');
		});
		$("#main").scroll(function() {
			tip.close();
			$this.removeClass('flag');
		});
	})
})(window,jQuery);

// 步骤2
(function(win,$) {
    var sourceAddField = mini.get('source-add-field'),
        sourceAddDataType = mini.get('source-add-dataType'),
        node=mini.get('nodeguid'),
        fromds=mini.get('fromds'),
        targetds=mini.get('topic'),
        fromtable=mini.get('fromtable'),
        targetable=mini.get('topicUser'),
    	template=mini.get('template'),
    	synHistory=mini.get('synHistory'),
    	scheduler=mini.get('scheduler'),
    	schedulerType=mini.get('schedulerType'),
    	schedulerunit=mini.get('schedulerunit'),
    	intervalSeconds=mini.get('intervalSeconds'),
    	intervalMinutes=mini.get('intervalMinutes'),
    	timingtype=mini.get('timingtype'),
    	weekDay=mini.get('weekDay'),
    	dayOfMonth=mini.get('dayOfMonth'),
    	hour=mini.get('hour'),
    	minutes=mini.get('minutes'),
    	advancedsetting=mini.get('advancedsetting');

    var $tableBd = $('#table-bd'),
        $tableBdLeft = $('#table-bd-l'),
        $tableBdRight = $('#table-bd-r'),
        $svgcontent = $('#svg-content'),
        $svgBox = $('#svg-box'),
        $dragLine = $('#drag-line'),
        $deleteBtn = $('#delete-btn'),
        $toolBtns = $('#tool-btns'),
        $sourceSearch = $('#source-search'),
        $sourceInput = $('#source-input'),
        $sourceAdd = $('#source-add'),
        $tableBdBottom = $('#table-bd-bottom'),
        $tableBdBottomLeft = $('#table-bd-bottom-l'),
        $tableBdBottomRight = $('#table-bd-bottom-r'),
        $tableRemoveHdLeft = $('#table-remove-hd-l'),
        $tableRemoveHdRight = $('#table-remove-hd-r'),
        $tableRemoveBdLeft = $('#table-remove-bd-l'),
        $tableRemoveBdRight = $('#table-remove-bd-r'),
        $removeLeftNum = $('#remove-l-num'),
        $removeRightNum = $('#remove-r-num');

    /*var filterList = [
        {id: 0, text: '全部'},
        {id: 1, text: '已匹配'},
        {id: 2, text: '未匹配'},
    ], */// 筛选列表数据
    dataTypeList = [], // 数据类型列表
    sourceList= [], // 来源表
    targetList= [], // 目标表
    sourceRemoveList = [], // 来源表移除
    targetRemoveList = [], // 目标表移除
    dragFlag = false, // 控制是否可以连线
    type = 0; // 筛选的类型
    sourceQuery = '', //来源表搜素内容
    targetQuery = ''; // 目标表搜素内容
    // tableLeftScroll = 0, // 左侧表的滚动距离
    // tableRightScroll = 0; // 右侧表的滚动距离

//    filter.setData(filterList);
//    filter.select(0);
    
    // 获取表数据
    function getTableData() {
    	epoint.execute('getFieldData','@all','',function(data){
    		sourceList = data.sourceList;
            //targetList = data.targetList;
            sourceRemoveList = data.sourceRemoveList;
            //targetRemoveList = data.targetRemoveList;
            renderSourceList();
           // renderTargetList();
            renderSourceRemoveList();
           // renderTargetRemoveList();
            //$('.line').remove();
            //renderLine();
    	});
    }
    // 获取字段类型
    function getDataTypeList() {
    	epoint.execute('getAddFieldType','','',function(data){
    		dataTypeList = data;
            sourceAddDataType.setData(dataTypeList);
            sourceAddDataType.select(0);
    	});
    }
    // 重置新增表单
    function resetSourceAdd() {
        sourceAddField.setValue('');
        sourceAddDataType.select(0);
    }
    // 渲染来源表
    function renderSourceList() {
        for (var i = 0; i < sourceList.length; i++) {
            if (sourceList[i].primaryKey) {
                sourceList[i].extendClass = 'checked';
            } else {
                delete sourceList[i].extendClass;
            }
        }
        $sourceAdd.siblings().remove();
        var sourceListCopy = [];
        if (type == 0) {
            if (sourceQuery !== '') {
                sourceList.forEach(function(item) {
                    if (item.field.indexOf(sourceQuery) > -1) {
                        sourceListCopy.push(item);
                    }
                })
                $sourceAdd.before(getTplHtml('table-row-l-tpl',{list: sourceListCopy}));
            } else {
                $sourceAdd.before(getTplHtml('table-row-l-tpl',{list: sourceList}));
            }
            
        } else if (type == 1){
            sourceList.forEach(function(item) {
                if(item.linkField) {
                    if (sourceQuery == '' || (sourceQuery !== '' && item.field.indexOf(sourceQuery) > -1)) {
                        sourceListCopy.push(item)
                    }
                }
            })
            $sourceAdd.before(getTplHtml('table-row-l-tpl',{list: sourceListCopy}));
        } else if (type == 2) {
            sourceList.forEach(function(item) {
                if(!item.linkField) {
                    if (sourceQuery == '' || (sourceQuery !== '' && item.field.indexOf(sourceQuery) > -1)) {
                        sourceListCopy.push(item)
                    }
                }
            })
            $sourceAdd.before(getTplHtml('table-row-l-tpl',{list: sourceListCopy}));
        }
    }
    // 渲染目标表
    function renderTargetList() {
        var targetListCopy = [];
        if (type == 0) {
            if (targetQuery !== '') {
                targetList.forEach(function(item) {
                    if (item.field.indexOf(targetQuery) > -1) {
                        targetListCopy.push(item);
                    }
                })
                $tableBdRight.html(getTplHtml('table-row-r-tpl',{list: targetListCopy}));
            } else {
                $tableBdRight.html(getTplHtml('table-row-r-tpl',{list: targetList}));
            }
        } else if (type == 1) {
            targetList.forEach(function(item) {
                for (var i = 0;i < sourceList.length;i++) {
                    var source = sourceList[i];
                    if (source.linkField && source.linkField == item.field) {
                        if (targetQuery == '' || (targetQuery !== '' && item.field.indexOf(targetQuery) > -1)) {
                            targetListCopy.push(item);
                            break;
                        }
                    }
                }
            })
            console.log(targetListCopy);
            $tableBdRight.html(getTplHtml('table-row-r-tpl',{list: targetListCopy}));
        } else if(type == 2) {
            targetList.forEach(function(item) {
                var pushFlag = true;
                
                for (var i = 0;i < sourceList.length;i++) {
                    if (sourceList[i].linkField && sourceList[i].linkField == item.field) {
                        pushFlag = false;
                        break;
                    }
                }
                // debugger;
                if (targetQuery !== '' && item.field.indexOf(targetQuery) == -1) {
                    pushFlag = false;
                }
                if (pushFlag) {
                    targetListCopy.push(item);
                }
            })
            $tableBdRight.html(getTplHtml('table-row-r-tpl',{list: targetListCopy}));
        }
    }
    // 渲染来源表移除
    function renderSourceRemoveList() {
        if (sourceRemoveList.length) {
            $removeLeftNum.text(sourceRemoveList.length);
            $tableRemoveHdLeft.removeClass('hidden');
            $tableRemoveBdLeft.removeClass('hidden').html(getTplHtml('table-row-l-remove-tpl',{list: sourceRemoveList}))
        } else {
            $tableRemoveHdLeft.addClass('hidden');
            $tableRemoveBdLeft.addClass('hidden');
        }
    }
    // 渲染目标表移除
    function renderTargetRemoveList() {
        if (targetRemoveList.length) {
            $removeRightNum.text(targetRemoveList.length);
            $tableRemoveHdRight.removeClass('hidden');
            $tableRemoveBdRight.removeClass('hidden').html(getTplHtml('table-row-r-remove-tpl',{list: targetRemoveList}))
        } else {
            $tableRemoveHdRight.addClass('hidden');
            $tableRemoveBdRight.addClass('hidden')
        }
    }
    // 渲染连线
    function renderLine() {
        sourceList.forEach(function(item) {
            if (item.linkField) {
                var stroke = '#adadad',
                    markerEnd = 'url(#arrowdark)';
                // if (item.primaryKey) {
                //     stroke = '#f1a325',
                //     markerEnd = 'url(#arrowlight)';
                // }
                var data = {
                    class: 'line',
                    stroke: stroke,
                    'stroke-width': $dragLine.attr('stroke-width'),
                    'marker-end': markerEnd,
                    'stroke-dasharray': $dragLine.attr('stroke-dasharray'),
                    'id': 'source-'+ item.field + '_' + 'target-' + item.linkField,
                    'data-source': 'source-'+ item.field,
                    'data-target': 'target-'+item.linkField,
                },
                svgLine = makeSVG('line',data);
                // $(svgLine).removeAttr('marker-end');
                // $(svgLine).attr({'marker-end':markerEnd});
                $svgBox.append(svgLine);
            }
        })
        renderLinesPosition();
        renderLinesColor();
    }
    // 渲染所有连线的颜色
    function renderLinesColor() {
        var $line = $('.line');
        $line.each(function(i,item) {
            var $item = $(item),
                field = $item.attr('data-source').split('-')[1],
                $source = $('#' + $item.data('source')),
                $target = $('#' + $item.data('target'));
            for(var i = 0; i < sourceList.length;i++) {
                if (sourceList[i].field == field) {
                    if (sourceList[i].primaryKey) {
                        // debugger;
                        $item.attr({
                            'stroke':'#f1a325',
                            'marker-end':'url(#arrowlight)',
                        });
                        // 解决ie 下切换marker-end会显示不出
                        if (Util.browsers.isIE) {
                            $item.removeAttr('marker-end');
                            var $itemClone = $item.clone();
                            // console.log($itemClone);
                            $itemClone.attr({'marker-end':'url(#arrowlight)'});
                            $item.after($itemClone);
                            $item.remove();
                            $item.attr({'marker-end':'url(#arrowlight)'});
                        }
                        

                        $source.addClass('primary');
                        $target.addClass('primary');
                    } else {
                        $item.attr({
                            'stroke':'#adadad',
                            'marker-end':'url(#arrowdark)'
                        });
                        // 解决ie 下切换marker-end会显示不出
                        if (Util.browsers.isIE) {
                            $item.removeAttr('marker-end');
                            var $itemClone = $item.clone();
                            console.log($itemClone);
                            $itemClone.attr({'marker-end':'url(#arrowdark)'});
                            $item.after($itemClone);
                            $item.remove();
                        }

                        $source.removeClass('primary');
                        $target.removeClass('primary');
                    }
                    break;
                }
            } 
        })
    }
    // 拖拽后排序来源表数据
    function sortSourceList() {
        var arr = [],
            $tableRowLeft = $('.table-row',$tableBdLeft);
        $tableRowLeft.each(function(i,item) {
            var $item = $(item),
                field = $item.attr('id').split('-')[1];
            for (var i = 0; i < sourceList.length;i++) {
                if (sourceList[i].field == field) {
                    arr.push(sourceList[i]);
                    break;
                }
            }
        })
        sourceList = arr;
    }
    // 拖拽后排序目标表数据
    function sortTargetList() {
        var arr = [],
            $tableRowRight = $('.table-row',$tableBdRight);
        $tableRowRight.each(function(i,item) {
            var $item = $(item),
                field = $item.attr('id').split('-')[1];
            for (var i = 0; i < targetList.length;i++) {
                if (targetList[i].field == field) {
                    arr.push(targetList[i]);
                    break;
                }
            }
        })
        targetList = arr;
    }
    // 拖拽后排序来源表移除数据
    function sortSourceRemoveList() {
        var arr = [],
            $tableRowRemoveLeft = $('.table-row',$tableRemoveBdLeft);
        $tableRowRemoveLeft.each(function(i,item) {
            var $item = $(item),
                field = $item.attr('id').split('-')[1];
            for (var i = 0; i < sourceRemoveList.length;i++) {
                if (sourceRemoveList[i].field == field) {
                    arr.push(sourceRemoveList[i]);
                    break;
                }
            }
        })
        sourceRemoveList = arr;
    }
    // 拖拽后排序目标表移除数据
    function sortTargetRemoveList() {
        var arr = [],
            $tableRowRemoveRight = $('.table-row',$tableRemoveBdRight);
        $tableRowRemoveRight.each(function(i,item) {
            var $item = $(item),
                field = $item.attr('id').split('-')[1];
            for (var i = 0; i < targetRemoveList.length;i++) {
                if (targetRemoveList[i].field == field) {
                    arr.push(targetRemoveList[i]);
                    break;
                }
            }
        })
        targetRemoveList = arr;
    }
    // 拖拽方法
    function drag() {
        $('.table-bd-l').sortable({
            axis: "y", 
            handle: ".table-drag", 
            cancel: ".eye-close,.checkbox",
            deactivate: function(event, ui) {
                renderLinesPosition();
                sortSourceList();
                console.log(sourceList);
            }
        });
        $('.table-bd-r').sortable({
            axis: "y", 
            handle: ".table-drag",
            cancel: ".eye-close",
            deactivate: function(event, ui) {
                renderLinesPosition();
                sortTargetList();
                console.log(targetList)
            }
        });
        $('.table-remove-bd-l').sortable({
            axis: "y", 
            handle: ".table-drag", 
            cancel: ".eye-open",
            deactivate: function(event, ui) {
                sortSourceRemoveList();
                console.log(sourceRemoveList);
            }
        });
        $('.table-remove-bd-r').sortable({
            axis: "y", 
            handle: ".table-drag", 
            cancel: ".eye-open",
            deactivate: function(event, ui) {
                sortTargetRemoveList();
                console.log(targetRemoveList);
            }
        });
    }
    // 初始化连线
    function initDragLine() {
        $dragLine.attr({
            'x1': 400,
            'y1': 20,
            'x2': 400,
            'y2': 20,
            'data-source': '',
            'data-target': '',
        }).addClass('hidden');
    }
    // 对数据进行关联
    function linkData(source,target) {
        for (var i = 0; i < sourceList.length; i++) {
            if (sourceList[i].field == source) {
                sourceList[i].linkField = target;
            }
        }
    }
    // 取消数据关联
    function removeLink(source) {
        for (var i = 0; i < sourceList.length; i++) {
            if (sourceList[i].field == source) {
                delete sourceList[i].linkField;
            }
        }
    }
    // 给所有连线头尾定位
    function renderLinesPosition() {
        $('.table-row').removeClass('linked');
        $('.line').each(function(i,item) {
            renderLinePositon(item)
        })
    }
    // 给连线头尾定位
    function renderLinePositon(svgLine) {
        var $svgLine = $(svgLine),
            tableBdLeft = $tableBd.offset().left,
            tableBdTop = $tableBd.offset().top,
            $source = $('#' + $svgLine.data('source')),
            $target = $('#' + $svgLine.data('target'));
        if (!$source.length || !$target.length) {
            $svgLine.remove();
            return;
        }
        $source.addClass('linked');
        $target.addClass('linked');
        var x1 = $source.offset().left - tableBdLeft + 450,
            y1 = $source.offset().top - tableBdTop + 20,
            x2 = $target.offset().left - tableBdLeft - 5,
            y2 = $target.offset().top - tableBdTop + 20;
        if (y1 < 0) {
            y1 = 0;
        } else if (y1 > 400) {
            y1 = 400;
        }
        if (y2 < 0) {
            y2 = 0;
        } else if (y2 > 400) {
            y2 = 400;
        }
        svgLine.setAttribute('x1',x1);
        svgLine.setAttribute('y1',y1);
        svgLine.setAttribute('x2',x2);
        svgLine.setAttribute('y2',y2 < 0 ? 0 : y2);
    }
    // 重置删除按钮
    function initDeleteBtn() {
        $deleteBtn.addClass('hidden').data('id','');
    }
    // 重置搜索的高亮字段
    function resetFields($items) {
        $items.each(function(i,item) {
            resetItemText($(item))
        })
    }
    function resetItemText($item) {
        $item.children('.light').each(function(i,span) {
            var $span = $(span);
            $span.before($span.text()).remove();
        })
        return $item.text();
    }
    // 返回点击保存时返回的table数据
    function submitTableData() {
    	 var sourceListCopy = JSON.parse(JSON.stringify(sourceList));
         sourceListCopy.forEach(function(item) {
             delete item.extendClass;
             delete item.remove;
         })
         return {
             sourceList: sourceListCopy,
             targetList: targetList,
             sourceRemoveList: sourceRemoveList,
             targetRemoveList: targetRemoveList
         }
    }
    //选择节点
    node.on('valuechanged',function(e){
    	node.setValue(e.value);
    	fromds.setValue("");
    	targetds.setValue("");
    	fromtable.setValue("");
    	targetable.setValue("");
    	mini.get('viewData').setEnabled(false);
    	epoint.refresh(['fromds','template','topic','nodeguid'],function(){
    		epoint.refresh(['fromtable','fromds','topicUser','topic','nodeguid']);
    	});
    	getTableData();
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	epoint.clear('selectDataSource');
    	mini.get('viewData').setEnabled(false);
    	epoint.refresh(['fromtable','fromds','template','topicUser','topic','nodeguid']);
    	getTableData();
    });
    //选择数据来源
    fromds.on('valuechanged',function(e){
    	fromds.setValue(e.value);
    	fromtable.setValue("");
    	mini.get('viewData').setEnabled(false);
    	epoint.refresh(['fromtable','template','fromds','topic','nodeguid']);
    	getTableData();
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	fromtable.setValue("");
    	mini.get('viewData').setEnabled(false);
    	epoint.refresh(['fromtable','template','fromds','topic','nodeguid']);
    	getTableData();
    });
    //选择数据去向
    targetds.on('valuechanged',function(e){
    	targetds.setValue(e.value);
    	targetable.setValue("");
    	epoint.refresh(['topicUser','template','fromds','topic','nodeguid']);
    	getTableData();
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	targetable.setValue("");
    	epoint.refresh(['topicUser','template','fromds','topic','nodeguid']);
    	getTableData();
    });
    //选择源头表
    fromtable.on('valuechanged',function(e){
    	epoint.refresh(['timefield','fromtable','fromds','nodeguid']);
    	getTableData();
    	mini.get('viewData').setEnabled(true);
    }).on('closeclick',function(e){
    	//清空自己的输入框、时间戳的输入框
    	//刷新时间戳下拉列表
    	e.sender.setText('');
    	e.sender.setValue('');
    	epoint.clear('timefield');
    	epoint.refresh(['timefield','fromtable','fromds','nodeguid']);
    	mini.get('viewData').setEnabled(false);
    	getTableData();
    });
    //选择目标表
    targetable.on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	getTableData();
    });
    //选择交换策略
    template.on('valuechanged',function(e){
    	$('#synHistory-row').show();
    	epoint.clear('model');
    	epoint.clear('synHistory-row');
    	mini.get('synHistory').setVisible(true);
    	if(e.value=='003'){
    		//触发器
			Util.form.showField('#model');
			mini.get('timefield').setVisible(false);
			mini.get('transModel').setVisible(true);
			Util.form.setLabel('#model', '触发模式');
    	}else if(e.value=='002'){
    		//时间戳
			Util.form.showField('#model');
			mini.get('transModel').setVisible(false);
			mini.get('timefield').setVisible(true);
			Util.form.setLabel('#model', '时间戳字段');
    	}else if(e.value=='001'){
    		//全量
    		$('#synHistory-row').hide();
    		mini.get('synHistory').setVisible(false);
    		Util.form.hideField('#model');
			mini.get('transModel').setVisible(false);
			mini.get('timefield').setVisible(false);
    	}else{
			Util.form.hideField('#model');
			mini.get('timefield').setVisible(false);
			mini.get('transModel').setVisible(false);
    	}
    }).on('closeclick',function(e){
    	epoint.clear(e.sender.id);
    	Util.form.hideField('#model');
		mini.get('timefield').setVisible(false);
		mini.get('transModel').setVisible(false);
		$('#synHistory-row').show();
    	mini.get('synHistory').setVisible(true);
    });
    
    //高级设置
    advancedsetting.on('valuechanged',function(e){
    	if(e.value=='true'){
    		$('#advancedsetting-01').show();
    		$('#advancedsetting-02').show();
    	}else{
    		$('#advancedsetting-01').hide();
    		$('#advancedsetting-02').hide();
    	}
    });
    
    //调度方式变更
    scheduler.on('valuechanged',function(e){
    	if(e.value=='1'){
    		//时间间隔
    		$('#row1').show();
    		$('#row2').hide();
    		$('#row3').hide();
    		var schedulerunitValue=schedulerunit.getValue();
    		if(schedulerunitValue=='sec'){
    			//秒
    			intervalSeconds.setVisible(true);
    			intervalMinutes.setVisible(false);
    			$('#unit').html('秒');
    		}else{
    			//分
    			schedulerunit.setValue('min');
    			intervalSeconds.setVisible(false);
    			intervalMinutes.setVisible(true);
    			$('#unit').html('分');
    		}
    		schedulerType.setValue(1);
    	}else if(e.value=='2'){
    		//定时
    		$('#row1').hide();
    		$('#row2').show();
    		$('#row3').hide();
    		var timetype=timingtype.getValue();
    		if(timetype=='day'){
        		// 每天
        		weekDay.setVisible(false);
        		dayOfMonth.setVisible(false);
        		hour.setVisible(true);
        		minutes.setVisible(true);
        		$('#day').hide();
        		$('#week').hide();
        		schedulerType.setValue(2);
        	}else if(timetype=='week'){
        		// 每周
        		weekDay.setVisible(true);
        		dayOfMonth.setVisible(false);
        		hour.setVisible(true);
        		minutes.setVisible(true);
        		$('#day').hide();
        		$('#week').show();
        		schedulerType.setValue(3);
        	}else if(timetype=='month'){
        		// 每月
        		weekDay.setVisible(false);
        		dayOfMonth.setVisible(true);
        		hour.setVisible(true);
        		minutes.setVisible(true);
        		$('#day').show();
        		$('#week').hide();
        		schedulerType.setValue(4);
        	}
    	}else if(e.value=='3'){
    		//自定义
    		$('#row1').hide();
    		$('#row2').hide();
    		$('#row3').show();
    		schedulerType.setValue(5);
    	}else if(e.value=='0'){
    		$('#row1').hide();
    		$('#row2').hide();
    		$('#row3').hide();
    		schedulerType.setValue(0);
    	}
    });
    //间隔单位变更
    schedulerunit.on('valuechanged',function(e){
    	if(e.value=='sec'){
			//秒
			intervalSeconds.setVisible(true);
			intervalMinutes.setVisible(false);
			$('#unit').html('秒');
		}else{
			//分
			intervalSeconds.setVisible(false);
			intervalMinutes.setVisible(true);
			$('#unit').html('分');
		}
    });
    //定时类型变更
    timingtype.on('valuechanged',function(e){
    	Util.form.showField('#time');
    	if(e.value=='day'){
    		//每天
    		weekDay.setVisible(false);
    		dayOfMonth.setVisible(false);
    		hour.setVisible(true);
    		minutes.setVisible(true);
    		$('#day').hide();
    		$('#week').hide();
    		schedulerType.setValue(2);
    	}else if(e.value=='week'){
    		//每周
    		weekDay.setVisible(true);
    		dayOfMonth.setVisible(false);
    		hour.setVisible(true);
    		minutes.setVisible(true);
    		$('#day').hide();
    		$('#week').show();
    		schedulerType.setValue(3);
    	}else if(e.value=='month'){
    		//每月
    		weekDay.setVisible(false);
    		dayOfMonth.setVisible(true);
    		hour.setVisible(true);
    		minutes.setVisible(true);
    		$('#day').show();
    		$('#week').hide();
    		schedulerType.setValue(4);
    	}
    });
    // 筛选
    /*filter.on('valuechanged',function() {
        var val = filter.getValue();
        type = val;
        renderSourceList();
        renderTargetList();
        if (val == 0 || val == 1) {
            renderLine();
        } else {
            $('.line').remove();
        }
    })*/
    // 开始连线
    $tableBdLeft.on('mousedown','.table-row',function(e) {
        var $this = $(this),
            $target = $(e.target),
            field = $this.attr('id').split('-')[1],
            tableBdLeft = $tableBd.offset().left,
            tableBdTop = $tableBd.offset().top;
        
        if ($target.hasClass('checkbox')||
            $target.hasClass('eye-close')||
            $target.hasClass('table-row-close')||
            $target.hasClass('table-drag')||
            $this.hasClass('source-add')) {
            return;
        } 
        // 先判断该项是否有连线
        for(var i = 0;i < sourceList.length;i++) {
            if (sourceList[i].field == field && sourceList[i].linkField) {
                return;
            }
        }

        $this.addClass('linked');
        // $svgMask.css('z-index',3);
        $svgcontent.css('z-index',3);
        $dragLine.attr({
            'x1': $this.offset().left - tableBdLeft + 450,
            'y1': $this.offset().top - tableBdTop + 20,
            'x2': $this.offset().left - tableBdLeft + 450,
            'y2': $this.offset().top - tableBdTop + 20,
        });
        
        $dragLine.attr({
            'data-source': $this.attr('id')
        });
        $dragLine.removeClass('hidden');
        dragFlag = true;
    })
    .on('mouseover',function() {
        $('#main').css({
            'overflow': 'hidden',
        });
    })
    .on('mouseleave',function() {
        $('#main').css({
            'overflow': 'auto',
        });
    })
    // 点击checkbox
    $tableBd.on('click','.checkbox',function(e) {
        // e.stopPropagation();
        var $this = $(this),
            $row = $this.parent().parent(),
            field = $row.attr('id').split('-')[1],
            primaryKeyNum = 0;
        
        if ($this.hasClass('checked')) {
            // 移除主键
            // 先获取主键数量
            sourceList.forEach(function(item) {
                if(item.primaryKey) {
                    primaryKeyNum += 1;
                }
            })
            if(primaryKeyNum <= 1) {
                epoint.showTips('主键数量至少为1');
                return;
            }
            $this.removeClass('checked');
            for (var i = 0; i < sourceList.length; i++) {
                if (sourceList[i].field == field) {
                    sourceList[i].primaryKey = false;
                }
            }
        } else {
            $this.addClass('checked');
            for (var i = 0; i < sourceList.length; i++) {
                if (sourceList[i].field == field) {
                    sourceList[i].primaryKey = true;
                }
            }
        }
        renderLinesColor();
    })
    // 连线中
    .on('mousemove',function(e) {
        if (!dragFlag) return;
        var x2 = e.clientX - $svgBox.offset().left;
        var y2 = e.clientY - $svgBox.offset().top;
        $dragLine.attr({
            'x2': x2,
            'y2': y2,
        })
    })
    // 连线结束
    .on('mouseup',function() {
        var x2 = $dragLine.attr('x2'),
            y2 = $dragLine.attr('y2'),
            tableBdTop = $tableBd.offset().top,
            $tableRow = $('.table-row',$tableBdRight);
        // 大于容器宽度的一半则视为连线，否则视为取消连线
        if (x2 > ($svgBox.width() / 2)) {
            // 判断连接的是哪一项
            for (var i = 0; i < $tableRow.length; i ++) {
                var $item = $($tableRow[i]),
                    top = $item.offset().top - tableBdTop;
                if (y2 >= top && y2<= (top + 40)) {
                    // 判断该项是否被连接
                    for(var j = 0;j < sourceList.length;j++) {
                        // 已被连接过，则视为取消连线
                        if(sourceList[j].linkField == $item.attr('id').split('-')[1]) {
                            initDragLine();
                            dragFlag = false;
                            $svgcontent.css('z-index',0);
                            return;
                        }
                    }
                    $dragLine.attr({'data-target':$item.attr('id')});
                    break;
                }
            }
            var data = {
                class: 'line',
                stroke: $dragLine.attr('stroke'),
                'stroke-width': $dragLine.attr('stroke-width'),
                'marker-end': $dragLine.attr('marker-end'),
                // 'marker-end': 'url(#arrowcircledark)',
                // 'marke-start': $dragLine.attr('marker-start'),
                // 'stroke-dasharray': $dragLine.attr('stroke-dasharray'),
                'data-source': $dragLine.attr('data-source'),
                'data-target': $dragLine.attr('data-target'),
                'id': $dragLine.attr('data-source') + '_' + $dragLine.attr('data-target'),
                'stroke-linecap': $dragLine.attr('stroke-linecap')
            },
            svgLine = makeSVG('line',data);
            $svgBox.append(svgLine);
            
            renderLinePositon(svgLine);
            renderLinesColor();
            linkData($dragLine.attr('data-source').split('-')[1],$dragLine.attr('data-target').split('-')[1])
        } else {
        	if ($('#source-'+$dragLine.attr('data-source')).length) {
                $('#source-'+$dragLine.attr('data-source').split('-')[1]).removeClass('linked');
            }
        }
        initDragLine();
        dragFlag = false;
        $svgcontent.css('z-index',0);
    })
    // 点击连线
    .on('click','.line',function() {
        var $this = $(this),
            x1 = Number($this.attr('x1')),
            x2 = Number($this.attr('x2')),
            y1 = Number($this.attr('y1')),
            y2 = Number($this.attr('y2'));
        console.log(x1+x2,y1+y2);
        console.log((x1 + x2) / 2,(y1 + y2) / 2)
        $deleteBtn.css({
            'left': (x1 + x2) / 2 - 25 + 'px',
            'top': (y1 + y2) / 2 - 13 + 'px'
        }).removeClass('hidden')
        .data('id',$this.attr('id'));
    })
    // 删除连线
    .on('click','.delete-btn',function() {
        var lineId = $deleteBtn.data('id'),
            $source = $('#source-'+lineId.split('_')[0].split('-')[1]),
            $target = $('#target-'+lineId.split('_')[1].split('-')[1]);
        $('#' + lineId).remove();
        $source.removeClass('linked');
        $target.removeClass('linked');
        removeLink(lineId.split('_')[0].split('-')[1]);
        initDeleteBtn();
    })
    // 点击保存字段
    .on('click','.source-save-btn',function() {
        var field = sourceAddField.getValue(),
            dataType = sourceAddDataType.getValue();
        if (field == '') {
            epoint.showTips('字段名不得为空');
            return;
        }
        for(var i = 0; i < sourceList.length; i++) {
            if (sourceList[i].field == field) {
                epoint.showTips('字段名已存在');
                return;
            }
        }
        var sourceItem = {
            primaryKey: false,
            field: field,
            dataType: dataType,
            remove:true
        }
        $sourceAdd.before(getTplHtml('table-row-l-tpl',{list: [sourceItem]})).addClass('hidden');
        sourceList.push(sourceItem);
        resetSourceAdd();
    })
     // 取消新建
    .on('click','.source-cancel-btn',function() {
        $sourceAdd.addClass('hidden');
    })
     
    // 点击新增
    $tableBdBottom.on('click','.table-addbtn',function() {
    	  $sourceAdd.removeClass('hidden')
          $tableBdLeft.scrollTop(10000);
    })
    // 滚动表格
    $tableBdLeft.on('scroll',function() {
        // tableLeftScroll = $tableBdLeft.scrollTop();
        renderLinesPosition();
    })
    // 左侧表移除字段
    .on('click','.eye-close',function() {
        var $row = $(this).parent().parent(),
            field = $row.attr('id').split('-')[1],
            index = 0;
        for (var i = 0; i < sourceList.length;i++) {
            if (sourceList[i].field == field) {
                if (sourceList[i].primaryKey) {
                    epoint.showTips('主键不能被移除');
                    return;
                } else if (sourceList[i].linkField) {
                    epoint.showTips('关联字段不能被移除');
                    return;
                } else {
                    index = i;
                    break;
                }                
            }
        }
        var sourceItem = sourceList.splice(index,1)[0];
        delete sourceItem.primaryKey;
        sourceRemoveList.push(sourceItem);
        $row.remove();
        renderSourceRemoveList();
        renderLinesPosition();
    })
    // 左侧表删除新增字段
    .on('click','.table-row-close',function() {
        var $row = $(this).parent().parent(),
            field = $row.attr('id').split('-')[1],
            index = 0;
        for (var i = 0; i < sourceList.length;i++) {
            if (sourceList[i].field == field) {
                if (sourceList[i].primaryKey) {
                    epoint.showTips('主键不能被移除');
                    return;
                } else if (sourceList[i].linkField) {
                    epoint.showTips('关联字段不能被移除');
                    return;
                } else {
                    index = i;
                    break;
                }                
            }
        }
        sourceList.splice(index,1)[0];
        // delete sourceItem.primaryKey;
        // sourceRemoveList.push(sourceItem);
        $row.remove();
        // renderSourceRemoveList();
        renderLinesPosition();
    })
    // 滚动表格
    $tableBdRight.on('scroll',function() {
        // tableRightScroll = $tableBdRight.scrollTop();
        renderLinesPosition();
    })
    // 右侧表移除字段
    .on('click','.eye-close',function() {
        var $row = $(this).parent().parent(),
            field = $row.attr('id').split('-')[1],
            index = 0;
        for (var i = 0; i < targetList.length;i++) {
            if (targetList[i].field == field) {
                // 先判断是否有字段关联
                for(var j = 0; j < sourceList.length; j++) {
                    if (sourceList[j].linkField && sourceList[j].linkField == field) {
                        epoint.showTips('关联字段不能被移除');
                        return;
                    }
                }
                index = i;
                break;
            }
        }
        targetRemoveList.push(targetList.splice(index,1)[0]);
        $row.remove();
        renderTargetRemoveList();
        renderLinesPosition();
    })
    .on('mouseover',function() {
        $main.css({
            'overflow': 'hidden'
        })
    })
    .on('mouseleave',function() {
        $main.css({
            'overflow': 'auto'
        })
    })
    // 左侧表显示字段
    $tableBdBottomLeft.on('click','.eye-open',function() {
        var $row = $(this).parent().parent(),
            field = $row.attr('id').split('-')[1],
            index = 0;

        // 先判断来源表中有没有改字段
        for(var i = 0; i < sourceList.length;i++) {
            if (sourceList[i].field == field) {
                epoint.showTips('该字段名已存在于表中');
                return;
            }
        }
        for (var i = 0; i < sourceRemoveList.length;i++) {
            if (sourceRemoveList[i].field == field) {
                index = i;
                break;
            }
        }
        var sourceRemoveItem = sourceRemoveList.splice(index,1)[0];
        sourceRemoveItem.primaryKey = false;
        sourceList.push(sourceRemoveItem);
        // $row.remove();
        renderSourceRemoveList();
        renderSourceList();
        renderLinesPosition();
    })
    .on('mouseover',function() {
        $main.css({
            'overflow': 'hidden'
        })
    })
    .on('mouseleave',function() {
        $main.css({
            'overflow': 'auto'
        })
    })
    // 右侧表显示字段
    $tableBdBottomRight.on('click','.eye-open',function() {
        var $row = $(this).parent().parent(),
            field = $row.attr('id').split('-')[1],
            index = 0;
        // 先判断目标表中有没有改字段
        // for(var i = 0; i < targetList.length;i++) {
        // if (targetList[i].field == field) {
        // epoint.showTips('该字段名已存在于表中');
        // return;
        // }
        // }
        for (var i = 0; i < targetRemoveList.length;i++) {
            if (targetRemoveList[i].field == field) {
                index = i;
                break;
            }
        }
        targetList.push(targetRemoveList.splice(index,1)[0]);
        $row.remove();
        renderTargetRemoveList();
        renderTargetList();
        renderLinesPosition();
    })
    .on('mouseover',function() {
        $main.css({
            'overflow': 'hidden'
        })
    })
    .on('mouseleave',function() {
        $main.css({
            'overflow': 'auto'
        })
    })
    // 显示隐藏左侧移除字段列表
    $tableRemoveHdLeft.on('click',function() {
        if ($tableRemoveHdLeft.hasClass('close')) {
            $tableRemoveHdLeft.removeClass('close');
            $tableRemoveBdLeft.removeClass('hidden');
        } else {
            $tableRemoveHdLeft.addClass('close');
            $tableRemoveBdLeft.addClass('hidden');
        }
    })
    // 显示隐藏右侧移除字段列表
    $tableRemoveHdRight.on('click',function() {
        if ($tableRemoveHdRight.hasClass('close')) {
            $tableRemoveHdRight.removeClass('close');
            $tableRemoveBdRight.removeClass('hidden');
        } else {
            $tableRemoveHdRight.addClass('close');
            $tableRemoveBdRight.addClass('hidden');
        }
    })

    // 点击同名映射
    $toolBtns.on('click','.link-name',function() {
        $('.line').remove();
        $(this).addClass('active').siblings().removeClass('active');
        sourceList.forEach(function(item) {
            var linkFlag = false;
            for (var i = 0; i < targetList.length;i++) {
                if (targetList[i].field.toLowerCase() == item.field.toLowerCase()) {
                    linkFlag = true;
                    break;
                }
            }
            if (linkFlag) {
                item.linkField = targetList[i].field;
            }
        });
        renderLine();
    })
    // 点击同行映射
    .on('click','.link-row',function() {
        $('.line').remove();
        $(this).addClass('active').siblings().removeClass('active');
        var $tableLeftRow = $('.table-row',$tableBdLeft),
            $tableRightRow = $('.table-row',$tableBdRight),
            length = 0;
        if ($tableLeftRow.length > $tableRightRow.length) {
            length = $tableRightRow.length;
        } else {
            length = $tableLeftRow.length;
        }
        for (var i = 0; i < length; i++) {
            var sourceName = $tableLeftRow.eq(i).attr('id').split('-')[1],
                targetName = $tableRightRow.eq(i).attr('id').split('-')[1];
            for (var j = 0; j < sourceList.length; j++) {
                if (sourceList[j].field == sourceName) {
                    sourceList[j].linkField = targetName;
                    break;
                }
            }
        }
        renderLine();
    })
    // 点击取消映射
    .on('click','.link-cancel',function() {
        $('.line').remove();
        $(this).addClass('active').siblings().removeClass('active');
        sourceList.forEach(function(item) {
            if (item.linkField) {
                delete item.linkField;  
            }
        });
    })
    // 点击自动排版
    .on('click','.link-composing',function() {
        $(this).addClass('active').siblings().removeClass('active');
        var arr1 = [],
            arr2 = [];
        sourceList.forEach(function(item) {
            if (item.linkField) {
                arr1.push(item);
            } else {
                arr2.push(item)
            }
        })
        sourceList = arr1.concat(arr2);
        var targetListNew = [];
        arr1.forEach(function(item) {
            targetList.forEach(function(target) {
                if (target.field == item.linkField) {
                    targetListNew.push(target);
                }
            }) 
        })
        targetList.forEach(function(item) {
            var flag = true;
            for (var i = 0; i < targetListNew.length; i++) {
                if (targetListNew[i].field == item.field) {
                    // targetListNew.push(item);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                targetListNew.push(item);
            }
        })
        targetList = targetListNew;
        renderSourceList();
        renderTargetList();
        renderLine();
    })
    // 关闭来源表搜索
    $sourceSearch.on('click','.icon-remove',function() {
        sourceQuery = '';
        renderSourceList();
        $sourceSearch.addClass('hidden');
        $('#source-input').val('');
        resetFields($('.col-l-2',$tableBdLeft));
        if (type == 0 || type == 1) {
            renderLine();
        } else {
            $('.line').remove();
        }
    })
    // 按回车键搜索来源表
    .on('keydown','.search-input',function(e) {
        if(e.keyCode == 13) {
            sourceQuery = $sourceInput.val() 
            renderSourceList();
            var $colLeftField = $('.col-l-2',$tableBdLeft);
            
            resetFields($colLeftField);
            $colLeftField.each(function(i,item) {
                var $item = $(item);
                    text = $item.text();
                    if (!$item.parent().hasClass('source-add')) {
                        text = text.replace(sourceQuery, '<span class="light">'+ sourceQuery +'</span>')
                        $item.html(text);
                    }
            })
            if (type == 0 || type == 1) {
                renderLine();
            } else {
                $('.line').remove();
            }
        }
    })
    // 关闭目标表搜索
   /* $targetSearch.on('click','.icon-remove',function() {
        targetQuery = '';
        renderTargetList();
        $targetSearch.addClass('hidden');
        $('#target-input').val('');
        
        resetFields($('.col-r-1',$tableBdRight));
        if (type == 0 || type == 1) {
            renderLine();
        } else {
            $('.line').remove();
        }
    })
    // 按回车键搜索目标表
    .on('keydown','.search-input',function(e) {
        if(e.keyCode == 13) {
            targetQuery = $targetInput.val() 
            renderTargetList();
            var $colRightField = $('.col-r-1',$tableBdRight);
            resetFields($colRightField);
            $colRightField.each(function(i,item) {
                var $item = $(item);
                    text = $item.text();
                text = text.replace(searchStr, '<span class="light">'+ searchStr +'</span>')
                $item.html(text);
            })
            if (type == 0 || type == 1) {
                renderLine();
            } else {
                $('.line').remove();
            }
        }
    })*/
    // 显示搜索框
    $('#left-search').on('click',function() {
        $sourceSearch.removeClass('hidden');
    })
   /* $('#right-search').on('click',function() {
        $targetSearch.removeClass('hidden');
    })*/
    $window.on('resize',function() {
        renderLinesPosition();
    })

    //getTableData();
    getDataTypeList();
    drag();
    win.mod2 = {
        submitTableData: submitTableData
    }
    win.getTableData=getTableData;
})(window,jQuery)
/*!
 * 文件集成
 * author:xulb
 * date: 2019-09-23
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
(function (win, $) {
    var $helpBtn = $('#help-btn'),
        $remind = $('#remind'),
        $saveBtn = $('#save-btn'),
        $checkFromPath = $('#checkFrompath'),
        $checkTargetPath = $('#checkTargetpath'),
    	$infoBtn = $(".info-btn"),
    	$sourceAdd = $('#source-add'),
    	$sourceInput = $('#source-input'),
    	$tableBd = $('#table-bd'),
    	$tableBdLeft = $('#table-bd-l'),
        $tableBdRight = $('#table-bd-r'),
        $tableBdBottom = $('#table-bd-bottom'),
        $tableBdBottomLeft = $('#table-bd-bottom-l'),
        $tableBdBottomRight = $('#table-bd-bottom-r'),
        $tableRemoveHdLeft = $('#table-remove-hd-l'),
        $tableRemoveHdRight = $('#table-remove-hd-r'),
        $tableRemoveBdLeft = $('#table-remove-bd-l'),
        $tableRemoveBdRight = $('#table-remove-bd-r'),
        $removeLeftNum = $('#remove-l-num'),
        $removeRightNum = $('#remove-r-num'),
        $sourceSearch = $('#source-search');
    
    var node=mini.get('nodeguid'),
	    fromds=mini.get('fromds'),
	    targetds=mini.get('targetds'),
	    frompath=mini.get('frompath'),
	    targetpath=mini.get('targetpath'),
		template=mini.get('template'),
		scheduler=mini.get('scheduler'),
		schedulerType=mini.get('schedulerType'),
		schedulerunit=mini.get('schedulerunit'),
		intervalSeconds=mini.get('intervalSeconds'),
		intervalMinutes=mini.get('intervalMinutes'),
		timingtype=mini.get('timingtype'),
		weekDay=mini.get('weekDay'),
		dayOfMonth=mini.get('dayOfMonth'),
		hour=mini.get('hour'),
		minutes=mini.get('minutes');
		advancedsetting=mini.get('advancedsetting'),
		exchangemodels=mini.get('exchangemodels'),
		filter = mini.get('filter');
		filetype = mini.get('filetype');
	var filterList = [
	        {id: 0, text: '全部'},
	        {id: 1, text: '已匹配'},
	        {id: 2, text: '未匹配'},
	    ], // 筛选列表数据
	    dataTypeList = [], // 数据类型列表
	    sourceList= [], // 来源表
	    targetList= [], // 来源表

	    sourceRemoveList = [], // 来源表移除
	    dragFlag = false, // 控制是否可以连线
	    type = 0; // 筛选的类型
	    sourceQuery = '', //来源表搜素内容
	    filter.setData(filterList);
	    filter.select(0);
    // 点击说明按钮
    $helpBtn.on('click', function () {
        if ($remind.hasClass('hidden')) {
            $remind.removeClass('hidden');
        } else {
            $remind.addClass('hidden');
        }
    })
    // 关闭说明
    $remind.on('click', '.notice-close-btn', function () {
        $remind.addClass('hidden');
    })
    
    // 获取表数据
    function getTableData() {
    	if(targetds.getValue().indexOf('SFTP')==-1){
    		epoint.execute('getFieldData','@all','',function(data){
        		sourceList = data.targetList;
        		targetList = data.targetList;
                sourceRemoveList = data.sourceRemoveList;
                renderSourceList();
//                renderSourceRemoveList();

        	});
    	}
    }
    // 获取字段类型
    function getDataTypeList() {
    	epoint.execute('getAddFieldType','','',function(data){
    		dataTypeList = data;
            sourceAddDataType.setData(dataTypeList);
            sourceAddDataType.select(0);
    	});
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
                	console.log(item);
                    if (item.field.indexOf(sourceQuery) > -1) {
                        sourceListCopy.push(item);
                    }
                })
                var obj = document.getElementById("table-bd-l");
                obj.insertAdjacentHTML('beforeEnd',getTplHtml('table-row-l-tpl',{list: sourceListCopy}));
            } else {
                console.log(sourceList);
                $sourceAdd.before(getTplHtml('table-row-l-tpl',{list: sourceList}));
            }
            mini.parse();
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
    // 拖拽方法
    function drag() {
        $('.table-bd-l').sortable({
            axis: "y", 
            handle: ".table-drag", 
            cancel: ".eye-close,.checkbox",
            deactivate: function(event, ui) {
                sortSourceList();
                console.log(sourceList);
            }
        });
        $('.table-bd-r').sortable({
            axis: "y", 
            handle: ".table-drag",
            cancel: ".eye-close",
            deactivate: function(event, ui) {
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
    
    // 返回点击保存时返回的table数据
    function submitTableData() {
    	 var sourceListCopy = JSON.parse(JSON.stringify(sourceList));
    	 console.log(sourceList);
         sourceListCopy.forEach(function(item) {
             delete item.extendClass;
             delete item.remove;
         })
         return {
/*             sourceList: sourceListCopy,
*/             targetList: targetList,
             sourceRemoveList: sourceRemoveList,
             /*     	targetRemoveList: targetRemoveList*/ 
         }
    }
    
    // 点击保存
    $saveBtn.on('click',function() {
        var submitTableData = win.mod2.submitTableData();
        if(epoint.validate()){
        	//是否存在
        	var primaryKeyNum=0;
        	var pkLinkNum=0;
        	var linkNum=0;
        	submitTableData.targetList.forEach(function(item) {
                if(item.primaryKey) {
                    primaryKeyNum += 1;
                    if(item.linkField){
                    	pkLinkNum+=1;
                    }
                }
                item.diyType=mini.get('dataType-'+item.field).getValue();
                item.linkField = $('#apifield-'+item.field).val();
                if(item.linkField==''){
                	linkNum+=1;
                }
            });
            if(targetds.getValue().indexOf('SFTP')==-1&&primaryKeyNum==0) {
                epoint.alert('请选择主键后提交');
                return;
            }
            if(linkNum>0){
            	  epoint.alert('请填写文件解析字段后提交，如不需要解析可以点击后面的隐藏按钮！');
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
    //高级设置
    advancedsetting.on('valuechanged',function(e){
    	if(e.value=='true'){
    		$('#advancedsetting-01').show();
    		$('#advancedsetting-02').show();
    		console.log(targetds.getValue().indexOf('SFTP'));
    		if(targetds.getValue().indexOf('SFTP')!=-1){
        		$('#advancedsetting-03').hide();
        	}else{
        		$('#advancedsetting-03').show();
        	}
    	}else{
    		$('#advancedsetting-01').hide();
    		$('#advancedsetting-02').hide();
    		$('#advancedsetting-03').hide();
    	}
    	
    });
    //选择节点
    node.on('valuechanged',function(e){
    	node.setValue(e.value);
    	fromds.setValue("");
    	targetds.setValue("");
    	frompath.setValue("");
    	targetpath.setValue("");
    	epoint.refresh(['fromds','targetds','nodeguid'],function(){
    		epoint.refresh(['fromds','targetds','nodeguid']);
    	});
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	 $checkTargetPath.show();
    	epoint.clear('selectDataSource');
    	epoint.refresh(['fromds','targetds','nodeguid']);
    });
    
    //选择数据去向
    targetds.on('valuechanged',function(e){
    	targetds.setValue(e.value);
    	targetpath.setValue("");
    	exchangemodels.setValue("");
    	filetype.setValue("");
    	epoint.refresh(['targetpath','targetds','nodeguid','exchangemodels']);
    	if(e.value){
    		mini.get('targetpath').setAllowInput(true);
    	}
    	getTableData();
    	if(e.value.indexOf('SFTP')!=-1){
    		console.log(e.value.indexOf('SFTP'));
    		$('#splitCharacter-row').hide();
    		$('#filetype-row').hide();
    		$('#field-select').hide();
    		 $checkTargetPath.show();
    		Util.form.showField('#transmodels-control');
    		Util.form.hideField('#afterFTP-control');
    	}else{
    		$('#splitCharacter-row').hide();
    		$('#filetype-row').show();
    		$('#field-select').show();
    		Util.form.hideField('#transmodels-control');
    		Util.form.showField('#afterFTP-control');
    		 $checkTargetPath.hide();
    	}
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	targetpath.setValue("");
    	mini.get('targetpath').setAllowInput(false);
    	exchangemodels.setValue("");
    	filetype.setValue("");
    	 $checkTargetPath.show();
    	epoint.refresh(['targetpath','targetds','nodeguid','exchangemodels']);
    	getTableData();
    });
    
    //选择目标表
    targetpath.on('valuechanged',function(e){
    	getTableData();
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	getTableData();
    });
    
    //选择交换策略
    exchangemodels.on('valuechanged',function(e){
    	console.log(targetds);
    	if(targetds.value.indexOf('SFTP')==-1&&e.value==1){
    		Util.form.showField('#syncModel-control');
    		$('#fulltransmodels-row').hide();
		}else if(targetds.value.indexOf('SFTP')==-1&&e.value==0){
    		Util.form.hideField('#syncModel-control');
    		$('#fulltransmodels-row').show();
		}else{
    		Util.form.hideField('#syncModel-control');
    		$('#fulltransmodels-row').hide();
		}
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	getTableData();
    });
    
    //选择文件类型
    filetype.on('valuechanged',function(e){
    	if(e.value.indexOf('2')!=-1){
    		$('#splitCharacter-row').show();
		}else{
    		$('#splitCharacter-row').hide();
		}
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	getTableData();
    });
    
    fromds.on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    });
    targetds.on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    });
    mini.get('transmodels').on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
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
    
    $checkFromPath.on('click',function() {
    	if(fromds.getValue() == "" || frompath.getValue() == ""){
    		epoint.alert("数据源和路径不能为空");
    	}else{
    		epoint.execute('checkFolderExist',"","from",function(data){
        		if(data.msg.indexOf('目录存在')!=-1){
        			epoint.alert(data.msg,'',function(){
        				back();
        			});
        		}else{
        			epoint.alert(data.msg);
        		}
        	});
    	}
    });
    
    $checkTargetPath.on('click',function() {
    	if(targetds.getValue() == "" || targetpath.getValue() == ""){
    		epoint.alert("数据源和路径不能为空");
    	}else if(targetds.getValue().indexOf('SFTP')==-1){
    		epoint.alert("请选择所需测试的文件目录");
    	}else {
    		epoint.execute('checkFolderExist',"","target",function(data){
        		if(data.msg.indexOf('目录存在')!=-1){
        			epoint.alert(data.msg,'',function(){
        				back();
        			});
        		}else{
        			epoint.alert(data.msg);
        		}
        	});
    	}
    });
    
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
    })
    // 滚动表格
    $tableBdRight.on('scroll',function() {
        // tableRightScroll = $tableBdRight.scrollTop();
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
   
    // 关闭来源表搜索
    $sourceSearch.on('click','.icon-remove',function() {
        sourceQuery = '';
        renderSourceList();
        $sourceSearch.addClass('hidden');
        $('#source-input').val('');
        resetFields($('.col-l-2',$tableBdLeft));
        if (type == 0 || type == 1) {
            //renderLine();
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
                text = text.replace(sourceQuery, '<span class="light">'+ sourceQuery +'</span>')
                $item.html(text);
            })
            if (type == 0 || type == 1) {
               // renderLine();
            } else {
                $('.line').remove();
            }
        }
    })
   
    // 显示搜索框
    $('#left-search').on('click',function() {
        $sourceSearch.removeClass('hidden');
    })
    $('#right-search').on('click',function() {
        $targetSearch.removeClass('hidden');
    })
    $window.on('resize',function() {
        //renderLinesPosition();
    })
	
    win.mod2 = {
        submitTableData: submitTableData
    }
    win.getTableData=getTableData;

})(window, jQuery);
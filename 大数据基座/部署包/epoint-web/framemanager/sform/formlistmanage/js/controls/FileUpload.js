(function(win, $) {
    var $dataField = $('#DataField'),
        $dataFieldCn = $('#DataFieldCn'),
        $maxAttachCount = $('#MaxAttachCount'),
        $allowFileList = $('#AllowFileList'),
        $defaultValue = $('#DefaultValue'),
        $isExtra = $('#IsExtra'),
        $dataCtrl = $('#DataCtrl'),
        $dataFieldEn = $('#DataFieldEn'),
        $fieldCreateFlag =$('#fieldCreateFlag'),
        $codeId =$('#CodeId'),
        $itemId = $('#ItemId'),
        $columnOrderNum = $('#ColumnOrderNum');

    var M = Mustache,
        ctrlTempl = $.trim($('#ctrl-templ').html());

    // 是否需要验证ID
    var needCheckId = false,
        // 是否处于编辑状态
        isEditing = false,
        // old datafield
        oldDf;

    var pWin = win.parent,
        trigSrc = pWin._triggerSrc,
        actField = pWin._activeField;

    // 判断是否要验证ID重复
    $dataFieldCn.on('change', function(event) {
        var val = this.value;

        if(isEditing) {
            needCheckId = oldDf == val ? false : true;
        }
    });

    $.extend(win, {
        //确定前的验证
        CheckCtrlProp: function() {
            // console.log('----CheckCtrlProp---');
            var mac = $.trim($maxAttachCount.val()),
                afl = $.trim($allowFileList.val()),
                field = $dataField.val(),
                fieldCn = $dataFieldCn.val(),
                fieldEn = $dataFieldEn.val(),
                fieldCreateFlag= $fieldCreateFlag.val(),
                codeId = $codeId.val(),
                itemId = $itemId.val(),
                columnOrderNum = $columnOrderNum.val();
            
            if(!fieldCn) {
                Util.alert('中文名称未填写，无法添加');
                return false;
            }
			
            if($fieldCreateFlag.val() == 'manual' && !fieldEn){
           	    Util.alert('英文名称未填写，无法添加');
                return false;
            }
			
			//如果分类选择了，栏目及对应顺位必须校验选择
            if(codeId !='' && (itemId == '' || columnOrderNum == '')){
            	Util.alert('栏目或所属顺位未填写!');
                return false;
            }
            
            if(!isEditing){
            	if($fieldCreateFlag.val() == 'manual'){
            		field = fieldEn;
            	}else if(!field){
            		field = "Ctrl" + (parent.controlId + 1);
            	}
            }else{
            	field = fieldEn;
            }
            
            // datafield修改后要验证ID是否重复
            if(Util.isFieldUsed(field, fieldCn, isEditing)) {
            	parent.controlId +=1;
                Util.alert('字段已被使用');
                return false;
            }
            
            //datafield修改后要验证字段ID是否存在
            if(Util.isFieldUsedInTable(field, fieldCn, isEditing)){
            	parent.controlId +=1;
            	Util.alert('字段表结构中已存在');
                return false;
            }
            return true;
        },

        //新增情况下，生成html
        BuildCtrlHTML: function(name,matchExtra) {
        	var isextra;
        	var defaultvalue;
        	var datactrl;
        	if(matchExtra){
        		defaultvalue = matchExtra.defaultvalue;
        		isextra = "true";
        		datactrl = name;
        		$defaultValue.val(defaultvalue);
        		$isExtra.val(isextra);
        		$dataCtrl.val(datactrl);
        	}else{
        		datactrl = "fileupload";
        		$dataCtrl.val(datactrl);
        	}
        	
        	var df ;
            if($fieldCreateFlag.val() == 'manual'){
        		df = $dataFieldEn.val();
            }else{
            	parent.controlId +=1; 
        		df = "Ctrl" + parent.controlId;
            }
        	
            var dfcn = $dataFieldCn.val(),
                mac = $maxAttachCount.val(),
                afl = $allowFileList.val(),
                cId = $codeId.val(),
                iId = $itemId.val(),
                coNum = $columnOrderNum.val();

            var view = {
                id: (df + '_' + tableId),
                dataField: df,
                dataFieldCn: dfcn,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                maxAttachCount: mac,
                allowFileList: afl,
                defaultvalue: defaultvalue,
                isextra: isextra,
                datactrl: datactrl,
                codeId: cId,
                itemId: iId,
                columnOrderNum: coNum
            };

            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function() {
            var df = $dataFieldEn.val(),
                dfcn = $dataFieldCn.val(),  
                mac = $maxAttachCount.val(),
                afl = $allowFileList.val(),
                cId = $codeId.val(),
                iId = $itemId.val(),
                coNum = $columnOrderNum.val();

            var $el = $(activeElement);

            var attrs = {};

            !mac ? $el.removeAttr('MaxAttachCount') : (attrs['MaxAttachCount'] = mac);
            !afl ? $el.removeAttr('AllowFileList') : (attrs['AllowFileList'] = afl);

            $.extend(attrs, {
                datafield: df,
                datafieldcn: dfcn,
                id: (df + '_' + tableId),
                title: dfcn + '（' + df + '）',
                defaultvalue: $defaultValue.val(),
                isextra: $isExtra.val(),
                datactrl: $dataCtrl.val(),
                codeId: cId,
                itemId: iId,
                columnOrderNum: coNum
            });

            return attrs;
        },

        //修改情况下，属性值初始化
        InitCtrlProp: function(el, name, matchExtra) {
        	var isextra;
        	var defaultvalue;
        	var datactrl;
        	if(matchExtra){
        		name = matchExtra.controlname;
        		defaultvalue = matchExtra.defaultvalue;
        		isextra = "true";
        		datactrl = name;
        		$defaultValue.val(defaultvalue);
        		$isExtra.val(isextra);
        		$dataCtrl.val(datactrl);
        	}else{
        		datactrl = "fileupload";
        		$dataCtrl.val(datactrl);
        	}
        	
        	$dataFieldCn.val(name + (parent.controlId + 1));
            
            // 是否处于编辑状态
            isEditing = el ? true : false;

            // 触发源来自字段，则dataField设为该字段
            if(trigSrc == 'field') {
                $dataField.val(actField);
                $dataFieldEn.val(actField);
            }

            if(trigSrc != 'html') {
                needCheckId = true;
            }

            if(!isEditing) return;
            
            var $el = $(el);

            var df = $el.attr('DataField'),
                dfcn = $el.attr('DataFieldCn'),
                cId = $el.attr('codeid'),
                iId = $el.attr('itemid'),
                coNum = $el.attr('columnordernum');

            var afl = $el.attr('AllowFileList'),
                mac = $el.attr('MaxAttachCount');

            $dataField.val(df);
            $dataFieldEn.val(df);
            $dataFieldCn.val(dfcn);
            $dataField.attr('disabled', 'disabled');

            mac && $maxAttachCount.val(mac);
            afl && $allowFileList.val(afl);

            oldDf = dfcn;
			
			$codeId.val(cId);
            getItemListData();
            $itemId.val(iId);
            $columnOrderNum.val(coNum);
        },
		
		// 获取指定控件类型的属性集合
        getPropertyByCtrlType : function(ctrlType, extraFlag) {
        	$.ajax({
                type: 'POST',
                async: false,
                dataType: 'json',
                url: propertyUrl,
                data: {
                    ctrlType: ctrlType,
                    isExtensibleHtml: "false",//是否是ExtensibleControl.html页面
                    requireFlag: "true",
                    validateFlag: "true",
                    extraFlag: extraFlag//是否是可扩展控件
                },
                success: function (data) {
                	//获取表单合并配置
                	$("#CodeId").empty();//清空select分类列表数据
                	$("#CodeId").prepend("<option value=''>请选择</option>");
                	var value;
                	if(data.custom.dataValue && typeof data.custom.dataValue === 'string'){
                		value = JSON.parse(data.custom.dataValue);
                		console.log(value);
                	}
                	for (var i = 0; i < value.length; i++) {
                		$("#CodeId").append("<option value='" + value[i].itemid + "'>" + value[i].itemtext + "</option>");
                	}
                }
            });
        },
        
        getItemListData : function(){
        	if($("#CodeId").val()){
        		$.ajax({
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    url: codeItemsUrl,
                    data: {
                        codeId: $("#CodeId").val(),
                        mergeConfigFlag : "true"
                    },
                    success: function (data) {
						$("#ItemId").empty();//清空select栏目列表数据
                    	$("#ItemId").prepend("<option value=''>请选择</option>");
                    	var value;
                    	if(data.custom.itemDataValue && typeof data.custom.itemDataValue === 'string'){
                    		value = JSON.parse(data.custom.itemDataValue);
                    		console.log(value);
                    	}
                    	for (var i = 0; i < value.length; i++) {
                    		$("#ItemId").append("<option value='" + value[i].itemid + "'>" + value[i].itemtext + "</option>");
                    	}
                    }
                });
        	}
        }
    });
	
	//分类的change事件用了获取下拉列表的值
    $(document).on("change","#CodeId",function(){
    	getItemListData();
    });
    
    //动态加载控件属性页面
    window.onload = function() {
		  var ctrlName = Util._splitParam(window.location.search,'name');
    	  var ctrlCreateType = Util._splitParam(window.location.search,'fieldcreatetype');
          if(ctrlCreateType == 'manual'){//手动
        	  $("#fieldEn").toggle();//去除英文名控件隐藏显示属性
        	  $('#fieldCreateFlag').val('manual');//保存字段创建类型
          }
		  
		  var extraFlag = "";
    	  if(window.location.search != ""){
    		  extraFlag = "true";
    	  }
		  getPropertyByCtrlType(ctrlName, extraFlag);
    };
}(this, jQuery));


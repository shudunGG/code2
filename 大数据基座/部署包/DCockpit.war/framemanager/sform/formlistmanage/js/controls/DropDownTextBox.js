(function(win, $) {
    var $dataField = $('#DataField'),
        $dataFieldCn = $('#DataFieldCn'),
        $selObj = $("#items"),//下拉子项值
        $divHeight = $('#DivHeight'),
        $defaultValue = $('#DefaultValue'),
        $isExtra = $('#IsExtra'),
        $dataCtrl = $('#DataCtrl'),
        $message = $('#Message'),
        $dataFieldEn = $('#DataFieldEn'),
        $fieldCreateFlag =$('#fieldCreateFlag');
    
    var validateIds = [];//存放所有动态载入检验属性Id

    var M = Mustache,
        ctrlTempl = $.trim($('#ctrl-templ').html()),
        styleTempl = $.trim($('#style-templ').html());

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
        	var w = '100%',//$.trim($width.val()),
            dh = $.trim($divHeight.val()),
                field = $dataField.val(),
                fieldCn = $dataFieldCn.val(),
                fieldEn = $dataFieldEn.val(),
                fieldCreateFlag= $fieldCreateFlag.val(),
                selOpt = $("#items option");//下拉子项值

            if(!fieldCn) {
                Util.alert('中文名称未填写，无法添加');
                return false;
            }
            if($fieldCreateFlag.val() == 'manual' && !fieldEn){
           	    Util.alert('英文名称未填写，无法添加');
                return false;
            }
            
            if(selOpt==null || selOpt.length<1){
            	Util.alert('下拉子项值未维护，无法添加');
                return false;
            }

            /*if(w && !Util.isPosNum(w)) {
            Util.alert('宽度必须是三位正整数');
            $width.focus();
            return false;
           }*/

            if(dh && !Util.isPosNum(dh)) {
                Util.alert('下拉框高度必须是三位正整数');
                $divHeight.focus();
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
        		datactrl = "dropdowntextbox";
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
                mes = $message.val();

            var w = '100%',//$.trim($width.val()),
            dh = $.trim($divHeight.val());
            
            if(itemsString){
 				itemsString = itemsString.substring(0,itemsString.length-1);
 			}
            
            //整理data
            var data ="";
            for(var m=0; validateIds != null && validateIds.length >0 && m<validateIds.length; m++){
            	if((validateIds[m] == "requiredValidate") || (validateIds[m] =="linkFill")){
            		data +=validateIds[m]+":"+($('#'+validateIds[m])[0].checked ? 1 : 0);
            	}else{
            		data +=validateIds[m]+":"+$('#'+validateIds[m]).val();
            	}
            	if(m<validateIds.length-1 ){
            		data += ";"
            	}
            }

            var view = {
                id: (df + '_' + tableId),
                width: w,
                divHeight: dh,
                dataField: df,
                dataFieldCn: dfcn,
                dataoptions: itemsString,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                style: M.render(styleTempl, {
                    width: w
                }),
                defaultvalue: defaultvalue,
                isextra: isextra,
                datactrl: datactrl,
                message: mes,
                validate: data
            };

            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function() {
            var df = $dataFieldEn.val(),
                dfcn = $dataFieldCn.val(),
                
                w = '100%',//$width.val(),
                dh = $divHeight.val();

            var $el = $(activeElement);

            var attrs = {};

            !w ? $el.removeAttr('width') : (attrs['width'] = w);
            !dh ? $el.removeAttr('divheight') : (attrs['divheight'] = dh);
            
            if(itemsString){
 				itemsString = itemsString.substring(0,itemsString.length-1);
 			}
            
            var data ="";
            for(var m=0; validateIds != null && validateIds.length >0 && m<validateIds.length; m++){
            	if((validateIds[m] == "requiredValidate") || (validateIds[m] =="linkFill")){
            		data +=validateIds[m]+":"+($('#'+validateIds[m])[0].checked ? 1 : 0);
            	}else{
            		data +=validateIds[m]+":"+$('#'+validateIds[m]).val();
            	}
            	if(m<validateIds.length-1 ){
            		data += ";"
            	}
            }

            return $.extend(attrs, {
                id: (df + '_' + tableId),
                datafield: df,
                datafieldcn: dfcn,
                dataoptions: itemsString,
                value: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                id: (df + '_' + tableId),
                style: M.render(styleTempl, {
                    width: w
                }),
                defaultvalue: $defaultValue.val(),
                isextra: $isExtra.val(),
                datactrl: $dataCtrl.val(),
                message: $message.val(),
                validate: data
            });
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
        		$message.val(matchExtra.message);//可扩展控件为空时的提示信息
        	}else{
        		datactrl = "dropdowntextbox";
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

            var df = $el.attr('datafield'),
                dfcn = $el.attr('datafieldcn'),
              
                w = '100%',//$el.attr('width'),
                dh = $el.attr('divheight'),
             
                mes = $el.attr('message'),
                dataoptions = $el.attr('dataoptions');
            
            itemsString = dataoptions + ";";
            
			if(dataoptions && dataoptions.indexOf(";")>0){
				var items = dataoptions.split(";");
				for(var m=0; items!=null && items.length>0 && m<items.length ;m++){
					$selObj.append("<option value='"+items[m]+"'>" + items[m] + "</option>");
				}
			}else if(dataoptions && dataoptions.length>0){
				$selObj.append("<option value='"+ dataoptions +"'>" + dataoptions + "</option>");
			}
			
			//修改操作时分解validate中校验属性并对应赋值
            var data = $el.attr('validate');
            var params;
            var vals;
            var property = Util._splitData(data);
            if(property != null && property.indexOf('|')>-1){
            	params = property.split('|')[0];
            	vals = property.split('|')[1];
            	if(params != null && params.indexOf(';')>-1 && params.split(';').length>0 
            			&& vals != null && vals.indexOf(';')>-1 && vals.split(';').length>0
            			&& (params.split(';').length == vals.split(';').length)){
            		for(var i=0 ;i<params.split(';').length; i++){
            			if((params.split(';')[i]) == "requiredValidate" || (params.split(';')[i]) == "linkFill"){//复选框的时候设置checked属性
            				$('#'+params.split(';')[i]).prop('checked', vals.split(';')[i] == '1');
            			}else{
            				$('#'+params.split(';')[i]).val(vals.split(';')[i]);//修改操作时对可扩展控件属性值对应赋值
            			}
            		}
            	}else if(params != "" && vals != ""){
            		if(params == "requiredValidate" || params == "linkFill"){//复选框的时候设置checked属性
        				$('#'+params).prop('checked', vals == '1');
        			}else{
        				$('#'+params).val(vals);//修改操作时对可扩展控件属性值对应赋值
        			}
            	}
            }

            $dataField.val(df);
            $dataFieldEn.val(df);
            $dataFieldCn.val(dfcn);
            $dataField.attr('disabled', 'disabled');
            $message.val(mes);

            //w && $width.val(w);
            dh && $divHeight.val(dh);

            oldDf = dfcn;
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
                    validateFlag: "false",
                    extraFlag: extraFlag//是否是可扩展控件
                },
                success: function (data) {
                	var testdiv = document.getElementById("validatepropertylst");
                	testdiv.innerHTML = data.custom.reValue;
                }
            });
        }
    });
    
    //动态加载控件属性页面
    window.onload = function() {
    	  var testdiv = document.getElementById("validatepropertylst");
    	  var ctrlName = Util._splitParam(window.location.search,'name');
    	  var ctrlCreateType = Util._splitParam(window.location.search,'fieldcreatetype');
    	  var extraFlag = "";
    	  if(window.location.search != ""){
    		  extraFlag = "true";
    	  }
          getPropertyByCtrlType(ctrlName, extraFlag);
          
          var selects = document.getElementById("validatepropertylst").getElementsByTagName("select");
          var inputs = document.getElementById("validatepropertylst").getElementsByTagName("input");
          for(var j=0; selects != null && selects.length >0 && j<selects.length; j++){
        	  if(selects[j].id != null && selects[j].id !=""){
        		  validateIds.push(selects[j].id);
        	  }
          }
          for(var i=0; inputs != null && inputs.length >0 && i<inputs.length; i++){
        	  if(inputs[i].id != null && inputs[i].id !=""){
        		  validateIds.push(inputs[i].id);
        	  }
          } 
          if(ctrlCreateType == 'manual'){//手动
        	  $("#fieldEn").toggle();//去除英文名控件隐藏显示属性
        	  $('#fieldCreateFlag').val('manual');//保存字段创建类型
          }
    };
}(this, jQuery));


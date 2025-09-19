(function(win, $) {
    var $dataField = $('#DataField'),
        $dataFieldCn = $('#DataFieldCn'),
        //$width = $('#Width'),
        $height = $('#Height'),
        $fieldType = $('#FieldType'),
        $textAlign = $('#TextAlign'),
        $conceal = $('#Conceal'),
        $defaultValue = $('#DefaultValue'),
        $isExtra = $('#IsExtra'),
        $dataCtrl = $('#DataCtrl'),
        $message = $('#Message'),
        $messagetype = $('#MessageType'),
        $dataFieldEn = $('#DataFieldEn'),
        $fieldCreateFlag =$('#fieldCreateFlag'),
        $messagemaxlength = $('#MessageMaxLength');
    
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

    // 判断是否要验证重复
    $dataFieldCn.on('change', function(event) {
        var val = this.value;

        if(isEditing) {
            needCheckId = oldDf == val ? false : true;
        }
    });

    $.extend(win, {
        //确定前的验证
        CheckCtrlProp: function() {

        	var h = $.trim($height.val()),
                w = '100%',
               //w = $.trim($width.val()),

                field = $dataField.val(),
                fieldCn = $dataFieldCn.val(),
                fieldEn = $dataFieldEn.val(),
                fieldCreateFlag= $fieldCreateFlag.val();

            if(!fieldCn) {
                Util.alert('中文名称未填写，无法添加');
                return false;
            }
            if($fieldCreateFlag.val() == 'manual' && !fieldEn){
           	 Util.alert('英文名称未填写，无法添加');
                return false;
           }
            
            /*
            if(w && !Util.isPosNum(w)) {
                Util.alert('宽度必须是三位正整数');
                $width.focus();
                return false;
            }*/

            if(h && !Util.isPosNum(h)) {
                Util.alert('高度必须是三位正整数');              
                $height.focus();
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
            if(Util.isFieldUsed(field,fieldCn,isEditing)) {
            	parent.controlId +=1;
                Util.alert('字段已被使用');
                return false;
            }
            
            //datafield修改后要验证字段ID是否存在
            if(Util.isFieldUsedInTable(field,fieldCn,isEditing)){
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
        		datactrl = "textarea";
        		$dataCtrl.val(datactrl);
        	}

        	var df ;
            if($fieldCreateFlag.val() == 'manual'){
        		df = $dataFieldEn.val();
            }else{
            	parent.controlId +=1; 
        		df = "Ctrl" + parent.controlId;
            }

            var dfcn = $dataFieldCn.val(),//"Ctrl" + parent.controlId,
                ft = $fieldType.val(),
                ta = $textAlign.val(),
                mes = $message.val(),
                mestype = $messagetype[0].checked ? 1 : 0,
                messagemaxlength = $messagemaxlength.val();

            //var w = $width.val(),
            var w = '100%',
                h = $height.val();
            
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
                height: h,
                dataField: df,
                dataFieldCn: dfcn,
                fieldType: ft,
                textAlign: ta,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                conceal: $conceal[0].checked ? 1 : 0,
                style: M.render(styleTempl, {
                    width: w,
                    height: h,
                    textAlign: ta
                }),
                defaultvalue: defaultvalue,
                isextra: isextra,
                datactrl: datactrl,
                message: mes,
                messagetype: mestype,
                validate: data,
                messagemaxlength: messagemaxlength
            };

            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function() {
            // console.log('----BuildCtrlProp---');
            var conceal = $conceal[0].checked ? '1' : '0',

            	df = $dataFieldEn.val(),
                dfcn = $dataFieldCn.val(),
                ft = $fieldType.val(),
                ta = $textAlign.val(),  

              //w = $width.val(),
                w = '100%',
                h = $height.val();

            var $el = $(activeElement);

            var attrs = {};

            !w ? $el.removeAttr('width') : (attrs['width'] = w);
            !h ? $el.removeAttr('height') : (attrs['height'] = h);
            
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

            $.extend(attrs, {
                datafield: df,
                datafieldcn: dfcn,
                fieldtype: ft,
                textalign: ta,
                conceal: conceal,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                value: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                id: (df + '_' + tableId),
                style: M.render(styleTempl, {
                    width: w,
                    height: h,
                    textAlign: ta
                }),
                defaultvalue: $defaultValue.val(),
                isextra: $isExtra.val(),
                datactrl: $dataCtrl.val(),
                message: $message.val(),
                messagetype: $messagetype[0].checked ? 1 : 0,
                validate: data,
                messagemaxlength: $messagemaxlength.val()
            });

            return attrs;
        },

        //修改情况下，属性值初始化
        InitCtrlProp: function(el, name, matchExtra) {
        	var isextra;
        	var defaultvalue;
        	var datactrl;
        	var info;
        	var messagemaxlength;
        	if(matchExtra){
        		name = matchExtra.controlname;
        		defaultvalue = matchExtra.defaultvalue;
        		info = matchExtra.message;
        		messagemaxlength = matchExtra.messagemaxlength;
        		isextra = "true";
        		datactrl = name;
        		$defaultValue.val(defaultvalue);
        		$isExtra.val(isextra);
        		$dataCtrl.val(datactrl);
        		$message.val(info);//可扩展控件为空时的提示信息
        		$messagetype.val(matchExtra.messagetype);
        		$messagemaxlength.val(matchExtra.messagemaxlength);
        	}else{
        		datactrl = "textarea";
        		$dataCtrl.val(datactrl);
        	}
        	$dataFieldCn.val(name + (parent.controlId + 1));
            // console.log('----InitCtrlProp---');
            
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
                ft = $el.attr('fieldtype'),
                ta = $el.attr('textalign'),
                conceal = $el.attr('conceal'),
                mes = $el.attr('message'),
                mestype = $el.attr('messagetype'),
                messagemaxlength = $el.attr('messagemaxlength');

            var w = '100%',//$el.attr('width'),
            h = $el.attr('height');
            
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
            //$dataFieldCn.attr('disabled', 'disabled');
            $fieldType.val(ft);
            $textAlign.val(ta);
            $message.val(mes);
            $messagetype.prop('checked', mestype == '1');
            $messagemaxlength.val(messagemaxlength);

            //w && $width.val(w);
            h && $height.val(h);

            $conceal.prop('checked', conceal == '1');

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
                    validateFlag: "true",
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


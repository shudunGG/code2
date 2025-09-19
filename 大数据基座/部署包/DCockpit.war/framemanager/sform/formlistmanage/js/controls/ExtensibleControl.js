(function(win, $) {
    var $dataField = $('#DataField'),
        $dataFieldCn = $('#DataFieldCn'),
        //$width = $('#Width'),
        $height = $('#Height'),
        $propertylst = $('#extensiblecontrol_propertylst'),
        $defaultValue = $('#DefaultValue'),
        $dataFieldEn = $('#DataFieldEn'),
        $fieldCreateFlag =$('#fieldCreateFlag');
    
    var extIds = [];//存放所有可扩展动态载入属性Id

    var M = Mustache,
        ctrlTempl = $.trim($('#ctrl-templ2').html()),//可扩展控件模板
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

            var h = $.trim($height.val()),
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
            // console.log('----BuildCtrlHTML---');
        	var df ;
            if($fieldCreateFlag.val() == 'manual'){
        		df = $dataFieldEn.val();
            }else{
            	parent.controlId +=1; 
        		df = "Ctrl" + parent.controlId;
            } 
                
            var w = '100%';
            var h = $height.val();
            var defaultvalue = matchExtra.defaultvalue;//获取默认值
            var dfcn = $dataFieldCn.val()
            var ctrlclass = matchExtra.controlclass;//获取ctrlclass
            if(!ctrlclass){
            	ctrlclass = 'extensiblecontrol';
            }

            $defaultValue.val(defaultvalue);//隐藏控件保存
            $dataFieldCn.val(dfcn);
            
            //整理data
            var data ="";
            for(var m=0; extIds != null && extIds.length >0 && m<extIds.length; m++){
            	data +=extIds[m]+":"+$('#'+extIds[m]).val();
            	if(m<extIds.length-1 ){
            		data += ";"
            	}
            }

            var view = {
                id: (df + '_' + tableId),
                ctrlclass: ctrlclass,
                datactrl: name,
                width: w,
                height: h,
                dataField: df,
                dataFieldCn: dfcn,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                value: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                style: M.render(styleTempl, {
                    width: w,
                    height: h
                }),
                dataoptions: data,
                defaultvalue: defaultvalue
            };
            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function() {
            // console.log('----BuildCtrlProp---');

            var df = $dataFieldEn.val(),
                dfcn = $dataFieldCn.val(),
                w = '100%',
                h = $height.val();

            var $el = $(activeElement);

            var attrs = {};

            !w ? $el.removeAttr('width') : (attrs['width'] = w);
            !h ? $el.removeAttr('height') : (attrs['height'] = h);
            
            var data ="";
            for(var m=0; extIds != null && extIds.length >0 && m<extIds.length; m++){
            	data +=extIds[m]+":"+$('#'+extIds[m]).val();
            	if(m<extIds.length-1 ){
            		data += ";"
            	}
            }

            $.extend(attrs, {
                datafield: df,
                datafieldcn: dfcn,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                value: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                id: (df + '_' + tableId),
                style: M.render(styleTempl, {
                    width: w,
                    height: h
                }),
                dataoptions: data,
                defaultvalue: $defaultValue.val()
            });
            return attrs;
        },

      //修改情况下，属性值初始化
        InitCtrlProp: function(el,name,matchExtra) {	
            // console.log('----InitCtrlProp---');
        	var $el = $(el);
        	
        	var defaultvalue = matchExtra.defaultvalue,//获取默认值
                dfcn = matchExtra.controlname;//$el.attr('datafieldcn');
        	$dataFieldCn.val(dfcn + (parent.controlId + 1));
            
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

            var df = $el.attr('datafield'),
                dfcn = $el.attr('datafieldcn');

            var w = '100%',
                h = $el.attr('height');
            
            //修改操作时分解dataoption中属性并对应赋值
            var data = $el.attr('dataoptions');
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
            			$('#'+params.split(';')[i]).val(vals.split(';')[i]);//修改操作时对可扩展控件属性值对应赋值
            		}
            	}else if(params != "" && vals != ""){
            		$('#'+params).val(vals);
            	}
            }

            $dataField.val(df);
            $dataFieldEn.val(df);
            $dataField.attr('disabled', 'disabled');
            $dataFieldCn.val(dfcn);
            $defaultValue.val(defaultvalue);

            //w && $width.val(w);
            h && $height.val(h);

            oldDf = dfcn;
        },
        
        // 获取指定控件类型的属性集合
        getPropertyByCtrlType : function(ctrlType) {
        	$.ajax({
                type: 'POST',
                async: false,
                dataType: 'json',
                url: propertyUrl,
                data: {
                    ctrlType: ctrlType,
                    isExtensibleHtml: "true"//是否是ExtensibleControl.html页面
                },
                success: function (data) {
                	var testdiv = document.getElementById("extensiblecontrol_propertylst");
                	testdiv.innerHTML = data.custom.reValue;
                }
            });
        }
        
    });
    
    //动态加载控件属性页面
    window.onload = function() {
    	  var testdiv = document.getElementById("extensiblecontrol_propertylst");
    	  var ctrlName = Util._splitParam(window.location.search,'name');
    	  var ctrlCreateType = Util._splitParam(window.location.search,'fieldcreatetype');
          getPropertyByCtrlType(ctrlName);
          
          var inputs = document.getElementById("extensiblecontrol_propertylst").getElementsByTagName("input");
          var selects = document.getElementById("extensiblecontrol_propertylst").getElementsByTagName("select");
          for(var i=0; inputs != null && inputs.length >0 && i<inputs.length; i++){
        	  if(inputs[i].id != null && inputs[i].id !=""){
        		  extIds.push(inputs[i].id);
        	  }
          }
          for(var j=0; selects != null && selects.length >0 && j<selects.length; j++){
        	  if(selects[j].id != null && selects[j].id !=""){
        		  extIds.push(selects[j].id);
        	  }
          }
          if(ctrlCreateType == 'manual'){//手动
        	  $("#fieldEn").toggle();//去除英文名控件隐藏显示属性
        	  $('#fieldCreateFlag').val('manual');//保存字段创建类型
          }
          
    };
    
}(this, jQuery));


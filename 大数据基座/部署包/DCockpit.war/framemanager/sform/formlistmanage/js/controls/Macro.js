(function (win, $) {
    var $dataField = $('#DataField'),
        $dataFieldCn = $('#DataFieldCn'),
        $macroType = $('#MacroType'),
        $caculatetime = $('#CaculateTime'),
        $isdate = $('#IsDate'),
        $conceal = $('#Conceal'),
        $flowNumName = $('#FlowNumName'),
        $flowNumFlag = $('#FlowNumFlag'),
        $flowNumLength = $('#FlowNumLength'),
        $defaultValue = $('#DefaultValue'),
        $isExtra = $('#IsExtra'),
        $dataCtrl = $('#DataCtrl'),
        $dataFieldEn = $('#DataFieldEn'),
        $fieldCreateFlag =$('#fieldCreateFlag');
    
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
    $dataFieldCn.on('change', function (event) {
        var val = this.value;

        if (isEditing) {
            needCheckId = oldDf == val ? false : true;
        }
    });

    $.extend(win, {
        //确定前的验证
        CheckCtrlProp: function () {
            var field = $dataField.val(),
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

            if ($macroType.val() == "EPOINT_SYS_FlowNum") {
                if ($flowNumName.val() == "") {
                    Util.alert('流水号名称必填');
                    return false;
                }

                try {
                    var length = parseInt($flowNumLength.val());
                    if (length < 0 || length > 5)
                        throw Error('');
                }
                catch (err) {
                    Util.alert('流水号长度必须在1-5之间');
                    return false;
                }
            }

            return true;
        },

        //新增情况下，生成html
        BuildCtrlHTML: function (name,matchExtra) {
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
        		datactrl = "macro";
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
                mt = $macroType.val(),
                ct = $caculatetime.val(),
                isd = $isdate.val(),
                flowNumConfig = false,
                flowNumName = $flowNumName.val(),
                flowNumFlag = $flowNumFlag.val(),
                flowNumLength = $flowNumLength.val();
            if ($macroType.val() == "EPOINT_SYS_FlowNum")
                flowNumConfig = true;
            var view = {
                id: (df + '_' + tableId),
                dataField: df,
                dataFieldCn: dfcn,
                macroType: mt,
                isdate: isd,
                flowNumConfig: flowNumConfig,
                flowNumName: flowNumName,
                flowNumFlag: flowNumFlag,
                flowNumLength: flowNumLength,
                conceal: $conceal[0].checked ? 1 : 0,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                caculatetime: ct,
                defaultvalue: defaultvalue,
                isextra: isextra,
                datactrl: datactrl
            };

            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function () {
            var df = $dataFieldEn.val(),
                dfcn = $dataFieldCn.val(),
                conceal = $conceal[0].checked ? '1' : '0',
                mt = $macroType.val(),
                ct = $caculatetime.val(),
                isd = $isdate.val(),
                flowNumConfig = false,
                flowNumName = $flowNumName.val(),
                flowNumFlag = $flowNumFlag.val(),
                flowNumLength = $flowNumLength.val();
            
            var $el = $(activeElement);
            var attrs = {};
            if ($macroType.val() == "EPOINT_SYS_FlowNum") {
                flowNumConfig = true;
            }
            else {
                $el.removeAttr('flownumname');
                $el.removeAttr('flownumflag');
                $el.removeAttr('flownumlength');
            }
            $.extend(attrs, {
                id: (df + '_' + tableId),
                datafield: df,
                datafieldcn: dfcn,
                conceal: conceal,
                macroType: mt,
                isdate: isd,
                flowNumConfig: flowNumConfig,
                flowNumName: flowNumName,
                flowNumFlag: flowNumFlag,
                flowNumLength: flowNumLength,
                conceal: $conceal[0].checked ? 1 : 0,
                title: dfcn + '（' + df + '）',//Util.buildCtrlTitle(df),
                caculatetime: ct,
                defaultvalue: $defaultValue.val(),
                isextra: $isExtra.val(),
                datactrl: $dataCtrl.val()
            });

            return attrs;
        },

        //修改情况下，属性值初始化
        InitCtrlProp: function (el, name, matchExtra) {
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
        		datactrl = "macro";
        		$dataCtrl.val(datactrl);
        	}
        	
        	$dataFieldCn.val(name + (parent.controlId + 1));

            // 是否处于编辑状态
            isEditing = el ? true : false;

            // 触发源来自字段，则dataField设为该字段
            if (trigSrc == 'field') {
                $dataField.val(actField);
                $dataFieldEn.val(actField);
            }

            if (trigSrc != 'html') {
                needCheckId = true;
            }

            if (!isEditing) return;

            var $el = $(el);

            var df = $el.attr('datafield'),
                dfcn = $el.attr('datafieldcn'),
                mt = $el.attr('macrotype'),
                ct = $el.attr('caculatetime'),
                isd = $el.attr('isdate'),
                conceal = $el.attr('conceal');

            $conceal.prop('checked', conceal == '1');
            $dataField.val(df);
            $dataFieldEn.val(df);
            $dataFieldCn.val(dfcn);
            $dataField.attr('disabled', 'disabled');
            $macroType.val(mt);
            if (mt == "EPOINT_SYS_FlowNum") {
                $("#flownumconfig").show();
                $flowNumName.val($el.attr('flownumname'));
                $flowNumFlag.val($el.attr('flownumflag'));
                $flowNumLength.val($el.attr('flownumlength'));
            }
            $isdate.val(isd);

            $caculatetime.val(ct);
            oldDf = dfcn;
        }
    });
    
    //动态加载控件属性页面
    window.onload = function() {
    	  var ctrlCreateType = Util._splitParam(window.location.search,'fieldcreatetype');
          if(ctrlCreateType == 'manual'){//手动
        	  $("#fieldEn").toggle();//去除英文名控件隐藏显示属性
        	  $('#fieldCreateFlag').val('manual');//保存字段创建类型
          }
    };
}(this, jQuery));


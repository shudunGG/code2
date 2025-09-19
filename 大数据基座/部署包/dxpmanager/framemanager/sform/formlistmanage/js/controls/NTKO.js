(function (win, $) {
    var $dataField = $('#DataField'),
        $dataFieldCn = $('#DataFieldCn'),
        $defaultValue = $('#DefaultValue'),
        $isExtra = $('#IsExtra'),
        $dataCtrl = $('#DataCtrl');

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
                fieldCn = $dataFieldCn.val();

            if(!fieldCn) {
                Util.alert('字段中文名称未填写，无法添加');
                return false;
            }
            
            if(!isEditing && !field){
        		field = "Ctrl" + (parent.controlId + 1);
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
        		datactrl = "ntko";
        		$dataCtrl.val(datactrl);
        	}
        	
        	parent.controlId +=1; 
        	
            var df = "Ctrl" + parent.controlId,//$dataField.val(),
                dfcn = $dataFieldCn.val();

            var view = {
                id: (df + '_' + tableId),
                dataField: df,
                dataFieldCn: dfcn,
                title: dfcn + '（' + df + '）',
                defaultvalue: defaultvalue,
                isextra: isextra,
                datactrl: datactrl
            };

            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function () {
            var df = $dataField.val(),
                dfcn = $dataFieldCn.val();

            return {
                id: (df + '_' + tableId),
                datafield: df,
                datafieldcn: dfcn,
                title: dfcn + '（' + df + '）',
                defaultvalue: $defaultValue.val(),
                isextra: $isExtra.val(),
                datactrl: $dataCtrl.val()
            };
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
        		datactrl = "ntko";
        		$dataCtrl.val(datactrl);
        	}
        	
        	$dataFieldCn.val(name + (parent.controlId + 1));

            // 是否处于编辑状态
            isEditing = el ? true : false;

            // 触发源来自字段，则dataField设为该字段
            if (trigSrc == 'field') {
                $dataField.val(actField);
            }

            if (trigSrc != 'html') {
                needCheckId = true;
            }

            if (!isEditing) return;

            var $el = $(el);

            // DataField, InputDateType
            var df = $el.attr('datafield'),
                dfcn = $el.attr('datafieldcn');

            $dataField.val(df);
            $dataFieldCn.val(dfcn);
            $dataField.attr('disabled', 'disabled');

            oldDf = dfcn;
        }
    });
}(this, jQuery));


(function(win, $) {
    var $dataField = $('#DataField'),
        $width = $('#Width'),
        $height = $('#Height');

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
    $dataField.on('change', function(event) {
        var val = this.value;

        if(isEditing) {
            needCheckId = oldDf == val ? false : true;
        }
    });

    $.extend(win, {
        //确定前的验证
        CheckCtrlProp: function() {
            var w = $.trim($width.val()),
                h = $.trim($height.val()),

                field = $dataField.val();

            if(!field) {
                Util.alert('主表中无匹配字段，无法添加');
                return false;
            }
            
            if(needCheckId && !field){
            	parent.controlId +=1;
            	field = "Ctrl" + parent.controlId;
            }

            if(w && !Util.isPosNum(w)) {
                Util.alert('宽度必须是三位正整数');
                $width.focus();
                return false;
            }

            if(h && !Util.isPosNum(h)) {
                Util.alert('高度必须是三位正整数');
                $height.focus();
                return false;
            }

            // datafield修改后要验证ID是否重复
            if(needCheckId && Util.isFieldUsed(field)) {
                Util.alert('字段' + field + '已被使用');
                return false;
            }

            return true;
        },

        //新增情况下，生成html
        BuildCtrlHTML: function() {
            var df = $dataField.val();

            var w = $width.val(),
                h = $height.val();

            var view = {
                id: (df + '_' + tableId),
                width: w,
                height: h,
                dataField: df,
                title: Util.buildCtrlTitle(df),
                style: M.render(styleTempl, {
                    width: w,
                    height: h
                })
            };

            return M.render(ctrlTempl, view);
        },

        //修改情况下，生成对应的属性html
        BuildCtrlProp: function() {
            var df = $dataField.val(),

                w = $width.val(),
                h = $height.val();

            var $el = $(activeElement);

            var attrs = {};

            !w ? $el.removeAttr('width') : (attrs['width'] = w);
            !h ? $el.removeAttr('height') : (attrs['height'] = h);

            $.extend(attrs, {
                datafield: df,
                id: (df + '_' + tableId),
                value: Util.buildCtrlTitle(df),
                title: Util.buildCtrlTitle(df),
                style: M.render(styleTempl, {
                    width: w,
                    height: h
                })
            });

            return attrs;
        },

        //修改情况下，属性值初始化
        InitCtrlProp: function(el) {
            // 初始化DataField选项
            var ctrl = Util._getLastPathName();

            Util.initDataField($dataField, ctrl);
            
            // 是否处于编辑状态
            isEditing = el ? true : false;

            // 触发源来自字段，则dataField设为该字段
            if(trigSrc == 'field') {
                $dataField.val(actField);
            }

            if(trigSrc != 'html') {
                needCheckId = true;
            }

            if(!isEditing) return;
            
            var $el = $(el);

            var df = $el.attr('datafield');

            var w = $el.attr('width'),
                h = $el.attr('height');

            $dataField.val(df);
            $dataField.attr('disabled', 'disabled');

            w && $width.val(w);
            h && $height.val(h);
            
            oldDf = df;   
        }
    });
}(this, jQuery));


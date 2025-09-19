var urlparams = Util.getUrlParams();

mini.WorkflowFloatOpinion = function() {
    mini.WorkflowFloatOpinion.superclass.constructor.apply(this, arguments);
}
;

mini.extend(mini.WorkflowFloatOpinion, mini.UserControl, {
    // 定义控件的className
    uiCls: "uc-workflowfloatopinion",
    // 模板的地址，路径默认从webapp开始
    tplUrl: 'frame/pages/epointworkflow/client/uc/workflowfloatopinion/workflowfloatopinion.tpl',

    // css文件资源路径
    cssUrl: 'frame/pages/epointworkflow/css/opinion.css',

    // 初始化方法，将内部需要设值取值的控件缓存到this.controls中
    init: function() {
        this.controls.commonopinionlist = mini.get('commonopinionlist');
        this.controls.useropinionlist = mini.get('useropinionlist');

        this.opinionTextBox = mini.get('workflowopinion_content');
        var tabs = mini.get('opinionTmplTab');
        var $addmyopiniondiv = $('#workflowopinion_addmyopinion');
        var me = this;
        var handleType = urlparams.handleType;
        var showmode = this.showmode;
        if (handleType && handleType == "2") {
            document.getElementById("workflowopinion_main").style.display = 'none';
            return;
        }
        Util.loadPageModule({
            templ: 'frame/pages/epointworkflow/client/handlepage.templ'
        });

        if (showmode !== 3) {
            if (showmode === 1) {
                tabs.removeTab(0);
            }
            $(window).resize(function() {
                tabs.doLayout();
            });
            setTimeout(function() {
                $(window).resize();
            }, 100);
        } else {
            $('#workflowopinion_txt').toggleClass("shrink");
        }

        var $opinion = $('#workflowopinion_main')
          , $toggle = $('.opinion-toggle', $opinion)
          , $toggleText = $('.opinion-toggle-text', $toggleText);

        $toggle.on('click', function() {
            if ($opinion.hasClass('collapse')) {
                $opinion.removeClass('collapse');
                $toggleText.text('收起');
            } else {
                $opinion.addClass('collapse');
                $toggleText.text('签署意见');
            }
        });
        function onOpinionChecked(e) {
            var item = e.item
              , listbox = e.sender
              , selected = listbox.isSelected(item);
            if (selected) {
                me.opinionTextBox.setValue(me.opinionTextBox.getValue() + item.opiniontext);
            } else {
                me.opinionTextBox.setValue(me.opinionTextBox.getValue().replace(item.opiniontext, ""));
            }
        }
        this.controls.commonopinionlist.on('itemclick', onOpinionChecked);
        this.controls.useropinionlist.on('itemclick', onOpinionChecked);

        if ($addmyopiniondiv.length > 0) {
            $('.add-myopinion-row', $addmyopiniondiv).on('click', function(e) {
                var text = me.opinionTextBox.getValue();
                var showText = $('<div/>').text(text).html();
                if (text) {
                    epoint.execute('addintoopinion', "@none", [showText], function(data) {
                        if (data.message) {
                            epoint.alert(data.message, '提示', null, 'info');
                            if (data.opinionguid) {
                                me.controls.useropinionlist.addItem({
                                    opiniontext: showText,
                                    opinionguid: data.opinionguid
                                });
                            }

                            // ie中有时意见框会无法获取焦点，这里强制其获取焦点
                            me.opinionTextBox.focus();
                        }
                    });
                } else {
                    epoint.alert('添加个人意见为空！', '提示', null, 'warning');
                }
            });
        }
        
        setTimeout(function(){
            me.opinionTextBox.doLayout();
        }, 500);
    },

    getValue: function() {
        return "";
    },
    setData: function(data) {
        var data = epoint.decodeJson(data);
        if (!data)
            return;

        if (data.commonopinionlist) {
            this.controls.commonopinionlist.setData(data.commonopinionlist.data);
        }
        if (data.useropinionlist) {
            this.controls.useropinionlist.setData(data.useropinionlist.data);
        }
    }
});

mini.regClass(mini.WorkflowFloatOpinion, "workflowfloatopinion");

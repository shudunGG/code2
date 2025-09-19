var urlparams = Util.getUrlParams();

mini.WorkflowOpinion = function() {
    mini.WorkflowOpinion.superclass.constructor.apply(this, arguments);
}
;

mini.extend(mini.WorkflowOpinion, mini.UserControl, {
    // 定义控件的className
    uiCls: "uc-workflowopinion",
    // 模板的地址，路径默认从webapp开始
    tplUrl: 'frame/pages/epointworkflow/client/uc/workflowopinion/workflowopinion.tpl',
    // css文件资源路径
    cssUrl: 'frame/pages/epointworkflow/css/opinion.css',

    // 初始化方法，将内部需要设值取值的控件缓存到this.controls中
    init: function() {
        this.controls.datagrid = mini.get('workflowopinion_datagrid');
        this.controls.commonopinionlist = mini.get('commonopinionlist');
        this.controls.useropinionlist = mini.get('useropinionlist');

        this.__initEditField();

        this.opinionTextBox = mini.get('workflowopinion_content');
        var tabs = mini.get('opinionTmplTab');
        var $addmyopiniondiv = $('#workflowopinion_addmyopinion');

        var me = this;
        // Util.loadPageModule({
        // 	templ : 'frame/pages/epointworkflow/client/handlepage.templ'
        // });
        // 必须要通过同步的ajax获取控件的模板
        Util.ajax({
            url: 'frame/pages/epointworkflow/client/handlepage.templ',
            // 必须为同步请求
            async: false,
            dataType: 'html',
            success: function(html) {
                $(html).appendTo('body');
            }
        });

        var handleType = urlparams.handleType;
        if (handleType && handleType == "2") {
            document.getElementById("workflowopinion_txt").style.display = 'none';
            return;
        }
        var showmode = this.showmode;
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
        var json = epoint.decodeJson(data);
        this.controls.datagrid.setData(json.data);
        this.controls.datagrid.setTotalCount(json.total);

        if (json.commonopinionlist) {
            this.controls.commonopinionlist.setData(json.commonopinionlist.data);
        }
        if (json.useropinionlist) {
            this.controls.useropinionlist.setData(json.useropinionlist.data);
        }
        $(window).resize();
    },

    __initEditField: function() {
        var _self = this;
        window["workflowopinion_onEdit"] = function(e) {
            if (e.row.canedit) {
                return epoint.renderCell(e, "action-icon icon-remove", "workflowopinion_deleteOpinion", "opinionguid");
            }
        }
        ;
        window["workflowopinion_deleteOpinion"] = function(opinionguid) {
            // 弹出确认框
            epoint.confirm("确定删除选中记录？", '', function() {
                epoint.execute("deleteOpinion", "@none", [opinionguid], function(message) {
                    _self._opinionCallback(message);
                });
            });
        }
        ;
    },

    _opinionCallback: function(message) {
        this.opinionTextBox.setValue('');
        if (message) {
            epoint.alert(message, '提示', null, 'info');
        } else
            epoint.refresh([this.id]);
    }
});

mini.regClass(mini.WorkflowOpinion, "workflowopinion");

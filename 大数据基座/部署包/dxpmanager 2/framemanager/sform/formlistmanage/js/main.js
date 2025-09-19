function Init() {
    InitEditor(this, jQuery);
    InitToolBar(this, jQuery);
    InitControls(this, jQuery);
    InitFields(this, jQuery);
    var saveNewBtn=$('#saveNewBtn');
}

//初始化编辑器
function InitEditor(win, $) {
    // 触发控件Dialog的来源
    // ctrl: 控件列表，field: 字段列表，html: 编辑器控件html
    win._triggerSrc = '';

    // 通过字段来触发控件属性Dialog的field
    win._activeField = '';

    //工具栏、弹出窗口、事件个性化
    CKEDITOR.on('instanceCreated', function (ev) {
        var editor = ev.editor;
        var ctrlEnCreateType = CtrlEnCreateType;
        editor.on('pluginsLoaded', function () {
            editor.addCommand('td_delete', {
                exec: function (editor) {
                    var range = editor.getSelection().getRanges()[0];
                    if (range == null) return;
                    var node = range.getEnclosedNode();
                    if (node == null) return;
                    if (node.$ && node.$.tagName) {
                        var nodeName = node.$.tagName.toUpperCase();
                        var ctrlName = GetFieldTypeByTag(node.$);
                        if (ctrlName) {
                        	epoint.alert("是否确定删除选中控件", null, function(){
                        		range.deleteContents();
                                range.select();
                        	});
                        }
                    }
                },
                modes: {
                    wysiwyg: 1
                } // Command is available in wysiwyg mode only.
            });

            CKEDITOR.dialog.addIframe('td_js_script', 'JS脚本', './toolbar/js_css/dialog.php?FORM_ID=125&action=SCRIPT', 800, 450);

            CKEDITOR.dialog.addIframe('td_css_script', 'CSS样式', './toolbar/js_css/dialog.php?FORM_ID=125&action=CSS', 800, 450);

            CKEDITOR.dialog.addIframe('td_macro_mark', '使用宏标记', './toolbar/macro/dialog.php', 500, 350);

            CKEDITOR.dialog.addIframe('td_about', '关于表单设计器', '/module/html_editor/editor/plugins/td_toolbar/about.html', 300, 220);

            editor.addCommand('td_js_script', new CKEDITOR.dialogCommand('td_js_script'));
            editor.ui.addButton('td_js_script', {
                label: 'JS脚本',
                command: 'td_js_script',
                toolbar: 'insert'
            });

            editor.addCommand('td_css_script', new CKEDITOR.dialogCommand('td_css_script'));
            editor.ui.addButton('td_css_script', {
                label: 'CSS样式',
                command: 'td_css_script',
                toolbar: 'insert'
            });

            editor.addCommand('td_macro_mark', new CKEDITOR.dialogCommand('td_macro_mark'));
            editor.ui.addButton('td_macro_mark', {
                label: '使用宏标记',
                command: 'td_macro_mark',
                toolbar: 'insert'
            });

            editor.addCommand('td_about', new CKEDITOR.dialogCommand('td_about'));
            editor.ui.addButton('td_about', {
                label: '关于表单设计器',
                command: 'td_about',
                toolbar: 'insert'
            });

            CKEDITOR.dialog.addIframe('td_textbox', CtrlMeta.textbox.name, 'controls/textbox.html?fieldcreatetype='+ctrlEnCreateType, 270, 320);
            editor.addCommand('td_textbox', new CKEDITOR.dialogCommand('td_textbox'));

            CKEDITOR.dialog.addIframe('td_textarea', CtrlMeta.textarea.name, 'controls/textarea.html?fieldcreatetype='+ctrlEnCreateType, 270, 270);
            editor.addCommand('td_textarea', new CKEDITOR.dialogCommand('td_textarea'));

            CKEDITOR.dialog.addIframe('td_datetextbox', CtrlMeta.datetextbox.name, 'controls/datetextbox.html?fieldcreatetype='+ctrlEnCreateType, 270, 120);
            editor.addCommand('td_datetextbox', new CKEDITOR.dialogCommand('td_datetextbox'));

            CKEDITOR.dialog.addIframe('td_dropdowntextbox', CtrlMeta.dropdowntextbox.name, 'controls/dropdowntextbox.html?fieldcreatetype='+ctrlEnCreateType, 300, 400);
            editor.addCommand('td_dropdowntextbox', new CKEDITOR.dialogCommand('td_dropdowntextbox'));

            CKEDITOR.dialog.addIframe('td_radiobuttonlist', CtrlMeta.radiobuttonlist.name, 'controls/radiobuttonlist.html?fieldcreatetype='+ctrlEnCreateType, 300, 360);
            editor.addCommand('td_radiobuttonlist', new CKEDITOR.dialogCommand('td_radiobuttonlist'));

            CKEDITOR.dialog.addIframe('td_checkboxlist', CtrlMeta.checkboxlist.name, 'controls/checkboxlist.html?fieldcreatetype='+ctrlEnCreateType, 300, 360);
            editor.addCommand('td_checkboxlist', new CKEDITOR.dialogCommand('td_checkboxlist'));

            CKEDITOR.dialog.addIframe('td_fileupload', CtrlMeta.fileupload.name, 'controls/fileupload.html?fieldcreatetype='+ctrlEnCreateType, 270, 250);
            editor.addCommand('td_fileupload', new CKEDITOR.dialogCommand('td_fileupload'));

            CKEDITOR.dialog.addIframe('td_macro', CtrlMeta.macro.name, 'controls/macro.html?fieldcreatetype='+ctrlEnCreateType, 270, 220);
            editor.addCommand('td_macro', new CKEDITOR.dialogCommand('td_macro'));

            CKEDITOR.dialog.addIframe('td_datagrid', CtrlMeta.datagrid.name, 'controls/datagrid.html?fieldcreatetype='+ctrlEnCreateType, 900, 300);
            editor.addCommand('td_datagrid', new CKEDITOR.dialogCommand('td_datagrid'));
            
            CKEDITOR.dialog.addIframe('td_datagridnew', CtrlMeta.datagridnew.name, 'controls/datagridnew.html?fieldcreatetype='+ctrlEnCreateType, 900, 300);
            editor.addCommand('td_datagridnew', new CKEDITOR.dialogCommand('td_datagridnew'));
            
            CKEDITOR.dialog.addIframe('td_calculatecontrol', CtrlMeta.calculatecontrol.name, 'controls/calculatecontrol.html?fieldcreatetype='+ctrlEnCreateType, 270, 340);
            editor.addCommand('td_calculatecontrol', new CKEDITOR.dialogCommand('td_calculatecontrol'));

//            CKEDITOR.dialog.addIframe('td_orgsel', CtrlMeta.orgsel.name, 'controls/OrgSel.html', 300, 360);
//            editor.addCommand('td_orgsel', new CKEDITOR.dialogCommand('td_orgsel'));
//
//            CKEDITOR.dialog.addIframe('td_ntko', CtrlMeta.ntko.name, 'controls/ntko.html', 300, 360);
//            editor.addCommand('td_ntko', new CKEDITOR.dialogCommand('td_ntko'));          
//
//            CKEDITOR.dialog.addIframe('td_epimage', CtrlMeta.epimage.name, 'controls/epimage.html', 300, 360);
//            editor.addCommand('td_epimage', new CKEDITOR.dialogCommand('td_epimage'));
            
            var extra;
            var extraObject = JSON.parse(ExtraCtrlMeta);//epoint.decodeJson(ExtraCtrlMeta);
            for (extra in extraObject) {
            	if(extraObject[extra]){
            		for(var m=0; m<extraObject[extra].length; m++){
            			var cClass = extraObject[extra][m].controlclass;
            			var exCtrlName = extraObject[extra][m].sign;
                    	if(cClass=='textbox' || cClass=='textarea' || cClass=='datetextbox' || cClass=='dropdowntextbox' 
                    		|| cClass=='radiobuttonlist' || cClass=='checkboxlist' || cClass=='fileupload' || cClass=='macro' 
                    		|| cClass=='datagrid' || cClass=='calculatecontrol' || cClass=='datagridnew'){
                    		CKEDITOR.dialog.addIframe('td_'+exCtrlName, extraObject[extra][m].name, 'controls/'+cClass+'.html?name='+ exCtrlName + '&fieldcreatetype=' + ctrlEnCreateType, 270, 360);
                    	}else{
                    		CKEDITOR.dialog.addIframe('td_'+exCtrlName, extraObject[extra][m].name, 'controls/extensiblecontrol.html?name='+ exCtrlName + '&fieldcreatetype=' + ctrlEnCreateType, 270, 360);
                    	}
                        editor.addCommand('td_'+exCtrlName, new CKEDITOR.dialogCommand('td_'+exCtrlName));
            		}
            	}
            }
        });
    });

    //右键菜单个性化
    CKEDITOR.on('instanceReady', function (ev) {
        var editor = ev.editor;

        editor.addMenuGroup('td_field_group');

        editor.addMenuItem('td_textbox_item', {
            label: CtrlMeta.textbox.name + '属性',
            command: 'td_textbox',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_textarea_item', {
            label: CtrlMeta.textarea.name + '属性',
            command: 'td_textarea',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_datetextbox_item', {
            label: CtrlMeta.datetextbox.name + '属性',
            command: 'td_datetextbox',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_dropdowntextbox_item', {
            label: CtrlMeta.dropdowntextbox.name + '属性',
            command: 'td_dropdowntextbox',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_radiobuttonlist_item', {
            label: CtrlMeta.radiobuttonlist.name + '属性',
            command: 'td_radiobuttonlist',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_checkboxlist_item', {
            label: CtrlMeta.checkboxlist.name + '属性',
            command: 'td_checkboxlist',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_fileupload_item', {
            label: CtrlMeta.fileupload.name + '属性',
            command: 'td_fileupload',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_datagrid_item', {
            label: CtrlMeta.datagrid.name + '属性',
            command: 'td_datagrid',
            group: 'td_field_group'
        });
        
        editor.addMenuItem('td_datagridnew_item', {
            label: CtrlMeta.datagridnew.name + '属性',
            command: 'td_datagridnew',
            group: 'td_field_group'
        });

        editor.addMenuItem('td_macro_item', {
            label: CtrlMeta.macro.name + '属性',
            command: 'td_macro',
            group: 'td_field_group'
        });
        
        editor.addMenuItem('td_calculatecontrol_item', {
            label: CtrlMeta.calculatecontrol.name + '属性',
            command: 'td_calculatecontrol',
            group: 'td_field_group'
        });
        
//        editor.addMenuItem('td_orgsel_item', {
//            label: CtrlMeta.orgsel.name + '属性',
//            command: 'td_orgsel',
//            group: 'td_field_group'
//        });
//
//        editor.addMenuItem('td_ntko_item', {
//            label: CtrlMeta.ntko.name + '属性',
//            command: 'td_ntko',
//            group: 'td_field_group'
//        });
        
        //可扩展的控件增加右键属性
        var extra;
        var extraObject = JSON.parse(ExtraCtrlMeta);//epoint.decodeJson(ExtraCtrlMeta);
        for (extra in extraObject) {
        	if(extraObject[extra]){
        		for(var m=0; m<extraObject[extra].length; m++){
        			var exCtrlName = extraObject[extra][m].sign;
            		var name = extraObject[extra][m].name;
        			editor.addMenuItem('td_'+exCtrlName+'_item', {
                        label: name + '属性',
                        command: 'td_'+exCtrlName,
                        group: 'td_field_group'
                    });
        		}
        	}
        }
  
        editor.addMenuItem('td_delete_item', {
            label: '删除控件',
            command: 'td_delete',
            group: 'td_field_group'
        });

        editor.contextMenu.addListener(function (ev) {
            var tag = ev.$,
                ret = {},
                fieldType = GetFieldTypeByTag(tag);

            if (fieldType) {
                ret[fieldType + '_item'] = CKEDITOR.TRISTATE_OFF;
                ret['td_delete_item'] = CKEDITOR.TRISTATE_OFF;

                _triggerSrc = 'html'
            }

            return ret;
        });
    });

    //删除按钮点击触发事件、赋值操作事件
    CKEDITOR.on('instanceReady', function (ev) {
        var editor = ev.editor;
        var FCK = GetFlowEditorInstance();
        FCK.IsCut = false;
        editor.resize('100%', GetEditContentHeight());
        editor.focus();
        editor.on('key', function (evt) {
            var preventKeyPress;

            // backspace delete
            if (evt.data.keyCode == 8 || evt.data.keyCode == 46) {
            	if(!evt.editor.getSelection()) return;
                var range = evt.editor.getSelection().getRanges()[0];
                if (range == null) return;
                var node = range.getEnclosedNode();
                if (node == null) return;

                if (node.$ && node.$.tagName) {
                    var nodeName = node.$.tagName.toUpperCase();
                    var ctrlName = GetFieldTypeByTag(node.$);
                    if (ctrlName) {
                        preventKeyPress = true;
                        evt.editor.getCommand('td_delete').exec();
                    } else if (nodeName == "INPUT" || nodeName == "IMG" || nodeName == "TABLE" || nodeName == "A") {
                        preventKeyPress = true;
                        range.deleteContents();
                        range.select();
                    }
                }
            } else
                preventKeyPress = false;

            return !preventKeyPress;
        });
    });

    //编辑器初始化
    CKEDITOR.replace('editor1', {
        contentsCss: [
            _rootPath + '/framemanager/sform/formlistmanage/css/base.css',
            _rootPath + '/framemanager/sform/formlistmanage/css/form.css',
            _rootPath + '/framemanager/sform/formlistmanage/css/formdesign.css'
        ],
        tabSpaces: 4,
        allowedContent: true,
        removePlugins: 'forms,magicline',
        extraPlugins: 'iframedialog,elementspath,tableresize',
        toolbar: [
            ["Source"],
            ["Cut", "Copy", "Paste", "PasteText", "PasteWord", "PasteFromWord"],
            ["Undo", "Redo", "-", "Find", "Replace", "-", "SelectAll", "RemoveFormat"],
            ["Bold", "Italic", "Underline"],
            ["NumberedList", "BulletedList", "-", "Outdent", "Indent"],
             ["Styles", "Format", "Font", "FontSize"],
            ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyFull"],
            ["TextColor", "BGColor"],
            ["Link", "Unlink"],
            ["Image", "Flash", "Table", "HorizontalRule", "SpecialChar"],
            //["td_js_script", "td_css_script", "td_macro_mark"],
            ["ShowBlocks", "Templates", "Maximize"]
        ]
    });

    $(window).resize(function () {
        GetFlowEditorInstance().resize('100%', GetEditContentHeight());
    });

    $('body').keydown(function (e) {
        var $target = $(e.target);
        if (e.which == 8) {
            return $target.is('input:enabled,textarea:enabled') && !$target.is('input[readOnly],textarea[readOnly]');
        }
    });
}

// 保存、保存为新版本、关闭 
function InitToolBar(win, $) {
    var $toolbar = $('#top-toolbar');

    var editor = GetFlowEditorInstance();

    win.saveVersion = function (newVersionID) {
        mini.get("content").setValue(epoint.encodeUtf8(editor.getData()));
        if (newVersionID) { //新增模式
        	mini.get("versionId").setValue(newVersionID);
        }
        saveBtn.click();
    };
    win.saveNewVersion = function (newVersionID) {
        mini.get("content").setValue(epoint.encodeUtf8(editor.getData()));
        if (newVersionID) { //新增模式
        	mini.get("versionId").setValue(newVersionID);
        }
        saveNewBtn.click();
    };
    win.previewPage = function(newVersionID){
    	mini.get("content").setValue(epoint.encodeUtf8(editor.getData()));
        if (newVersionID) { //新增模式
        	mini.get("versionId").setValue(newVersionID);
        }
        previewBtn.click();
    };
    win.printPreviewPage = function(newVersionID){
    	mini.get("content").setValue(epoint.encodeUtf8(editor.getData()));
        if (newVersionID) { //新增模式
        	mini.get("versionId").setValue(newVersionID);
        }
        printPreviewBtn.click();
    };
}

// 字段是否已用，新版改造后应该不会再被调用  by shengjia  2017.4.24
//function isFieldUsed(subtableid) {
//    var ckeIframe = $(this.document.getElementById('cke_editor1')).find('iframe')[0],
//
//                ckeWin = ckeIframe.contentWindow,
//                ckeDoc = ckeWin.document;
//
//    // 控件DOM 
//    var ctrlEl = ckeDoc.getElementById('DataGrid_' + subtableid);
//
//    return !!ctrlEl;
//}

// 控件列表交互
function InitControls(win, $) {
	if(window.initControlsCustom){
		window.initControlsCustom();
		return;
	}
    var $widgetCon = $('#widget-container'),
    // 控件列表(表单控件+可扩展控件+个性化扩展区域)
    $ctrlList = $('.control-list', $widgetCon);
    $extensibleCtrlList = $('.extendcontrol-list', $widgetCon);
    $extensibleCtrlList2 = $('.extendcontrol-list2', $widgetCon);
    
    //除普通控件区域以外的区域id，用来控制是否显示
    var $extrapanel = $('#extrapanel');
    var $extrapanel2 = $('#extrapanel2');
    
    var M = Mustache,
    templ = $.trim($('#ctrl-templ').html());
    templ2 = $.trim($('#ctrl-templ2').html());

    var renderCtrls = function () {
        var prop,
        html = [],
        html2 = [];

        for (prop in CtrlMeta) {
        	// 开放列表控件插入功能      by shengjia  2017.4.24
        	html.push(M.render(templ, {
                enName: prop,
                zhName: CtrlMeta[prop].name
            }));
//            if (prop != 'datagrid') {
//                html.push(M.render(templ, {
//                    enName: prop,
//                    zhName: CtrlMeta[prop].name
//                }));
//            }
        }
        $ctrlList.html(html.join(''));
        
        var extraObject = JSON.parse(ExtraCtrlMeta);//epoint.decodeJson(ExtraCtrlMeta);
        var i=0;
        for (prop in extraObject) {
        	if(extraObject[prop]){
        		for(var m=0; m<extraObject[prop].length; m++){
        			html2.push(M.render(templ2, {
                        enName: extraObject[prop][m].sign,
                        zhName: extraObject[prop][m].name,
                        imagePath: extraObject[prop][m].image
                    }));
        		}
            	if(i==0){
            		$extrapanel.removeClass('hidden');
            		$extensibleCtrlList.html(html2.join(''));
            	}else{
            		$extrapanel2.removeClass('hidden');
            		$extensibleCtrlList2.html(html2.join(''));
            	}
                html2 = [];
                i++;
            }
        }
  
        	// 开放列表控件插入功能      by shengjia  2017.4.24
        	
//            if (prop != 'datagrid') {
//                html2.push(M.render(templ2, {
//                    enName: prop,
//                    zhName: extraObject[prop].name,
//                    imagePath: extraObject[prop].image
//                }));
//            }
    };

    // 侧边手风琴效果
    $widgetCon.on('click', '.widget-group-title', function (event) {
        var $el = $(this),
            $content = $el.next();

        if ($content.hasClass('hidden')) {
            $content.removeClass('hidden');

            $el.find('>span').removeClass('icon-chevron-right')
                .addClass('icon-chevron-down');
        } else {
            $content.addClass('hidden');

            $el.find('>span').removeClass('icon-chevron-down')
                .addClass('icon-chevron-right');
        }
    });

    // 点击控件列表项
    $ctrlList.on('click', 'li', function (event) {
        var $el = $(this),
            cmd = $el.data('cmd');

        _triggerSrc = 'ctrl';

        exec_cmd(cmd);
    });
    
    // 点击可扩展控件列表项
    $extensibleCtrlList.on('click', 'li', function (event) {
        var $el = $(this),
            cmd = $el.data('cmd');

        _triggerSrc = 'ctrl';

        exec_cmd(cmd);
    });
    
    // 点击扩展控件列表项
    $extensibleCtrlList2.on('click', 'li', function (event) {
        var $el = $(this),
            cmd = $el.data('cmd');

        _triggerSrc = 'ctrl';

        exec_cmd(cmd);
    });

    // 渲染控件列表
    renderCtrls();

    // 增加虚拟滚动条
    $widgetCon.parent().niceScroll();
}

window["controlClick"] = function(contronName){
	var cmd = "td_" + contronName;

	_triggerSrc = 'ctrl';

	exec_cmd(cmd);
}

// 删除数据源 by shengjia 2017.4.24
// 表字段列表交互
function InitFields(win, $) {
//    var $tbPanel = $('#table-panel'),
//    $tbName = $('.table-name', $tbPanel),
//    $fdList = $('.field-list.second-level', $tbPanel);
    
//    var $etPanel = $('#extra-panel');
    
    var M = Mustache,
        templ = $.trim($('#field-templ').html());

    var layoutTempl = $.trim($('#layout-tb-templ').html()),
        titleTempl = '<td class="title" style="width: 200px;">{{title}}：</td>',
        controlTempl = '<td class="control span{{span}}">{{{control}}}</td>',
        datagridTempl = '<td class="control span{{span}}"  colspan="{{colspan}}" style="padding-top: 5px;">{{{control}}}</td>',
        leftTempl = '<td colspan="{{colspan}}"></td>',
        colSpanMap = {
            2: 5,
            4: 2,
            6: 1
        };
    
 // 删除数据源  by shengjia 2017.4.24
//    // 按列自动布局
//    var autoLayout = function (cols) {
//        var editor = GetFlowEditorInstance(),
//        // 主表数据
//        tb = null,
//        // 字段集合
//        fds = [],
//        // 布局行html
//        rows = [],
//        // 需补足的td对
//        leftTdNum = -1,
//        // 最终生成的html
//        html = '';
//
//        // 用于循环
//        var i = 0;
//        var IsAddLet = 0;
//        var fieldnamelist = '';
//        var fieldwidthlist = '';
//
//        fds = FieldMgr.getFieldsByCtrlType('all');
//        tb = FieldMgr.getTableData(tableId);
//
//        $.each(fds, function (i, fd) {
//            fieldnamelist = '';
//            if (fd.ctrlType == 'datagrid') {
//                if (i % (cols / 2) != 0 && IsAddLet == 0) {
//                    // 补足剩余的td
//                    leftTdNum = cols - i % (cols / 2);
//
//                    if (leftTdNum && leftTdNum < cols) {
//                        rows.push(M.render(leftTempl, {
//                            colspan: leftTdNum
//                        }));
//
//                        rows.push('</tr>');
//                    }
//                }
//
//                for (var r in fd.subfields) {
//                    if (r != 0) {
//                        fieldnamelist += '*';
//                        fieldwidthlist += '*';
//                    }
//                    fieldnamelist += fd.subfields[r].enName;
//                    fieldwidthlist += "0";
//                }
//
//                // 新增datagrid
//                rows.push('<tr>')
//                rows.push(M.render(datagridTempl, {
//                    span: 6,
//                    colspan: cols,
//                    control: M.render(CtrlMeta[fd.ctrlType].template, $.extend({}, CtrlMeta[fd.ctrlType].defaultAttrs, {
//                        id: ('DataGrid_' + fd.id),
//                        tableid: fd.id,
//                        fieldlist: fieldnamelist,
//                        fieldwidth: fieldwidthlist,
//                        dataField: fd.enName,
//                        title: (fd.zhName + '（' + fd.enName + '）')
//                    }))
//                }));
//                rows.push('</tr>');
//                IsAddLet = 1;
//            }
//            else if (fd.ctrlType == 'macro') {
//                if (i % (cols / 2) == 0) {
//                    rows.push('<tr>')
//                }
//
//                rows.push(M.render(titleTempl, {
//                    title: fd.zhName
//                }));
//
//                rows.push(M.render(controlTempl, {
//                    span: colSpanMap[cols],
//                    control: M.render(CtrlMeta[fd.ctrlType].template, $.extend({}, CtrlMeta[fd.ctrlType].defaultAttrs, {
//                        id: (fd.enName + '_' + tableId),
//                        dataField: fd.enName,
//                        isdate: fd.isdate,
//                        macroType: fd.macroType,
//                        caculatetime: fd.caculatetime,
//                        flowNumLength: fd.flowNumLength,
//                        flowNumFlag: fd.flowNumFlag,
//                        flowNumName: fd.flowNumName,
//                        title: (fd.zhName + '（' + fd.enName + '）')
//                    }))
//                }));
//
//                if (i % (cols / 2) == ((cols / 2) - 1)) {
//                    rows.push('</tr>');
//                }
//            }
//            else if (fd.ctrlType == 'calculatecontrol') {
//                if (i % (cols / 2) == 0) {
//                    rows.push('<tr>')
//                }
//
//                rows.push(M.render(titleTempl, {
//                    title: fd.zhName
//                }));
//
//                rows.push(M.render(controlTempl, {
//                    span: colSpanMap[cols],
//                    control: M.render(CtrlMeta[fd.ctrlType].template, $.extend({}, CtrlMeta[fd.ctrlType].defaultAttrs, {
//                        id: (fd.enName + '_' + tableId),
//                        dataField: fd.enName,
//                        ItemValue: fd.ItemValue,
//                        ItemPrec: fd.ItemPrec,
//                        title: (fd.zhName + '（' + fd.enName + '）')
//                    }))
//                }));
//
//                if (i % (cols / 2) == ((cols / 2) - 1)) {
//                    rows.push('</tr>');
//                }
//            } 
//            else {
//                if (i % (cols / 2) == 0) {
//                    rows.push('<tr>')
//                }
//
//                rows.push(M.render(titleTempl, {
//                    title: fd.zhName
//                }));
//
//                if(CtrlMeta[fd.ctrlType]){//表单控件
//                	rows.push(M.render(controlTempl, {
//                        span: colSpanMap[cols],
//                        control: M.render(CtrlMeta[fd.ctrlType].template, $.extend({}, CtrlMeta[fd.ctrlType].defaultAttrs, {
//                            id: (fd.enName + '_' + tableId),
//                            dataField: fd.enName,
//                            fieldType: 'nvarchar',
//                            title: (fd.zhName + '（' + fd.enName + '）')
//                        }))
//                    }));
//                }else{//可扩展控件
//                	rows.push(M.render(controlTempl, {
//                        span: colSpanMap[cols],
//                        control: M.render(epoint.decodeJson(ExtraCtrlMeta)[fd.ctrlType].template, $.extend({}, epoint.decodeJson(ExtraCtrlMeta)[fd.ctrlType].image, {
//                            id: (fd.enName + '_' + tableId),
//                            dataField: fd.enName,
//                            title: (fd.zhName + '（' + fd.enName + '）'),
//                            dataoptions: ''
//                        }))
//                    }));
//                }
//                if (i % (cols / 2) == ((cols / 2) - 1)) {
//                    rows.push('</tr>');
//                }
//            }
//        });
//
//        //确保是Datagrid最后添加，不用再补足td
//        //            // 补足剩余的td
//        //            leftTdNum = cols - (fds.length * 2) % cols;
//
//        //            if (leftTdNum && leftTdNum < cols) {
//        //                rows.push(M.render(leftTempl, {
//        //                    colspan: leftTdNum
//        //                }));
//
//        //                rows.push('</tr>');
//        //            }
//
//        html = M.render(layoutTempl, {
//            zhName: tb.zhName,
//            rows: rows.join('')
//        });
//
//        editor.setData(html);
//    };

    // 字段缓存
    var fieldCache = {};

    win.FieldMgr = {
// 删除数据源  by shengjia 2017.4.24
//        cacheFieldData: function (field) {
//            fieldCache[field.enName] = $.extend({}, field);
//        },
//
//        getFieldData: function (enName) {
//            var field = fieldCache[enName];
//
//            return field ? $.extend({}, field) : false;
//        },

        cacheTableData: function (data) {
            fieldCache['table_' + data.id] = {
                id: data.id,
                zhName: data.zhName,
                enName: data.enName
            };
        },

        getTableData: function (id) {
            var data = fieldCache['table_' + id];

            return data ? $.extend({}, data) : false;
        },

        cacheAllFields: function (fields) {
            fieldCache['all'] = fields;
        },
        
        // 获取指定控件类型的字段集合
        getFieldsByCtrlType: function (ctrlType) {
            var rt = [],
                fields = fieldCache['all'];

            if (ctrlType == 'all') {
                rt = Array.prototype.concat.call(fields);
            } else {
                $.each(fields, function (i, field) {
                    if (field.ctrlType == ctrlType) {
                        rt.push($.extend({}, field));
                    }
                });
            }

            return rt;
        }
    };

 // 删除数据源  by shengjia 2017.4.24
//    var renderFields = function (fields) {
//        var html = [];
//
//        $.each(fields, function (i, field) {
//            var view = $.extend({}, field);
//
//            FieldMgr.cacheFieldData(field);
//
//            if(CtrlMeta[field.ctrlType]){
//            	view.ctrlType = CtrlMeta[field.ctrlType].name;
//            }else{
//            	view.ctrlType = epoint.decodeJson(ExtraCtrlMeta)[field.ctrlType].name;
//            }
//            html.push(M.render(templ, view));
//        });
//        $fdList.html(html.join(''));
//    };
    
    function callBack(rtn){
    	var data=JSON.parse(rtn.reVlue);
    	
    	if(data!=null){
            // 缓存主表信息，不包含其字表和字段信息
            FieldMgr.cacheTableData(data);
            
            var fields = data.fields;
            // 缓存所有字段
            FieldMgr.cacheAllFields(fields);

// 删除数据源  by shengjia 2017.4.24
//            $tbName.html(data.zhName)
//                .parent().attr('title', data.zhName + '(' + data.enName + ')');
//            
//            // 渲染字段列表
//            if (fields && fields.length) {
//                renderFields(fields);
//            }
//            $tbPanel.removeClass('hidden');
//            $etPanel.removeClass('hidden');
    	}else{
    		epoint.alert(data.msg);
    	}
    };

    var getTbFields = function () {
    	epoint.execute("returnContent","@none",[tableId],callBack);
    };

//    删除数据源 by shengjia 2017.4.24
//    // 点击【字段名】展开
//    $tbPanel.on('click', '.field-hd', function (event) {
//        var $hd = $(this),
//            $icon = $hd.find('>i'),
//            $con = $hd.next();
//
//        if ($con.hasClass('hidden')) {
//            $con.removeClass('hidden');
//            $icon.removeClass('epicon-plus')
//                .addClass('epicon-minus');
//        } else {
//            $con.addClass('hidden');
//            $icon.removeClass('epicon-minus')
//                .addClass('epicon-plus');
//        }
//
//        // 插入字段名
//    }).on('click', '.insert-text', function (event) {
//        event.preventDefault();
//        event.stopPropagation();
//
//        var id = $(this).data('field'),
//            field = FieldMgr.getFieldData(id);
//
//        ReplaceEditorHtml(field.zhName);
//
//        // 弹出控件配置dialog
//    }).on('click', '.insert-ctrl', function (event) {
//        var id = $(this).data('field'),
//            field = FieldMgr.getFieldData(id);
//
//        // datagrid要验证ID是否重复
//        if (field.ctrlType == 'datagrid' && isFieldUsed(field.id)) {
//            epoint.alert('子表列表' + field.enName + '已被使用！');
//            return false;
//        }
//        event.preventDefault();
//        event.stopPropagation();
//
//        _triggerSrc = 'field';
//        _activeField = id;
//
//        exec_cmd('td_' + field.ctrlType);
//
//    });

//    var $arrangeMenu = $('#arrange-menu');
//
//    $arrangeMenu.on('click', 'a', function (event) {
//        event.preventDefault();
//
//        var $el = $(this),
//            cols = $el.data('role');
//
//        // 2、4、6列布局
//        if (cols != 'cancel') {
//        	epoint.alert("自动布局会清除编辑器中原先的所有内容，确定继续码？", null, function(){
//        		autoLayout(cols);
//        	});
//        }
//
//        $el.parent().addClass('hidden');
//    });

//    删除数据源  by shengjia 2017.4.24
//    // 表名右键菜单
//    $tbName.parent().on('contextmenu', function (event) {
//        event.preventDefault();
//
//        $arrangeMenu.css({
//            top: event.pageY,
//            left: event.pageX
//        }).removeClass('hidden');
//
//        return false;
//    });

    getTbFields();
}

function GetFieldTypeByTag(tag) {
    var $tag = jQuery(tag),
        ctrlType = $tag.data('ctrl');

    return ('td_' + ctrlType);
}

//编辑器高度
function GetEditContentHeight() {
    return $('.main-container').height();
}

//获得editor实例对象
function GetFlowEditorInstance() {
    return CKEDITOR.instances.editor1;
}

//获得editor文档对象
function GetEditorDocument() {
    return GetFlowEditorInstance().document;
}

//获得当前dialog
function GetCurDialog() {
    return CKEDITOR.dialog.getCurrent();
}

//获得当前选中的元素
function GetEditorSelectedElement() {
    var ret, doc, $active;
    try {
        GetFlowEditorInstance().focus();
        doc = GetEditorDocument();
        $active = doc.getSelection().getSelectedElement();
        if (!$active) {
            $active = doc.getSelection().getStartElement();
            if ($active.getName() != 'button') {
                $active = null;
            }
        }
        ret = $active.getName() == 'body' ? null : $active['$'];
    } catch (e) {
        ret = null;
    }
    return ret;
}

//插入html到编辑器  
function ReplaceEditorHtml(html,flag) {
    var editor = GetFlowEditorInstance();
    try {
    	//编辑保存的模板时flag=1
    	if(flag != null && flag == 1){
    		editor.setData(html);
    	}else{
    		editor.insertHtml(html);
    	}
    } catch (e) { }
}

//根据prop更新el元素的属性
function UpdateEditorElement(el, prop) {
    if (!el || typeof (prop) != 'object') {
        return;
    }
    var propMap = 'async autofocus checked defaultValue location multiple nodeName nodeType readOnly seleced selectedIndex tagName'.split(' ');
    var attributeMap = ['hidden'];
    var $el = jQuery(el);
    $.each(prop, function (k, v) {
        if ($.inArray(k, attributeMap) != -1) {
            el.setAttribute(k, v);
        } else {
            if (k == 'value') {
                $el['val'](v);
                if (el.nodeName == 'TEXTAREA') {
                    $el.html(v);
                } else if (el.nodeName == 'INPUT' || el.nodeName == 'IMG') {
                    el.setAttribute('value', v);
                }
            } else {
                var method = $.inArray(k, propMap) == -1 ? 'attr' : 'prop';
                $el[method](k, v);
            }
        }
    });
}

function exec_cmd(cmd) {
    var FCK = GetFlowEditorInstance();
    FCK.focus();
    try {
        var doc = GetEditorDocument();
        var selection = doc.getSelection();
        var target = selection.getSelectedElement();
        var ranges = selection.getRanges();
        var range = ranges ? ranges[0] : null;
        target && range && range.moveToElementEditablePosition(target);
        range.select(true);
    } catch (e) { }
    FCK.getCommand(cmd).exec();
}


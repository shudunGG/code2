//当前控件的ID编号
//页面Load时如果编辑器中有控件被选中，则设置为控件的ID编号
//页面Load时如果编辑器中没有控件被选中，则在CheckCtrlProp时调用get_ctrl_id获取
// var ctrl_id = '';
//低版本ie 焦点选中dialog时会丢失选中元素，GetEditorSelectedElement()为空  load时缓存下
var activeElement = null;
//对话框事件的回调函数，确定为ok，取消为cancel，load为页面加载完成
(function(win, $) {
    var pWin = win.parent;

        win.InitCtrlProp = null;

    win.onDialogEvent = function(e) {
        win.sender = e.sender;
        switch (e.name) {
            case 'ok':
                e.data.hide = sumitData();
                break;
            case 'cancel':
                e.data.hide = true;
                break;
            case 'load':
                // InitStyle();
                $(document).keydown(function(event) {
                    if (event.keyCode == 13) {
                        event.preventDefault();
                        
                        initKeyListener();
                        return false;
                    }
                });

                $(win).on('contextmenu', function() {
                    return false;
                });
                
                if (typeof(pWin.GetEditorSelectedElement) == 'function') {
                    var editorSelectedElement = pWin.GetEditorSelectedElement();
                    if (editorSelectedElement) {
                        activeElement = editorSelectedElement;
                    }
                    //每次页面加载完成触发，是否有选中元素在每个页面中判断
                    var object = pWin.CtrlMeta;
                    var extraObject = JSON.parse(pWin.ExtraCtrlMeta);
                    var ctrlName = Util._getCtrlName(win.sender._.dialog._.name);

                    //判断匹配的可扩展控件对象
                    var matchExtra = Util._returnMatchCtrl(ctrlName, extraObject);
                    if(matchExtra){
                    	InitCtrlProp && InitCtrlProp(editorSelectedElement, ctrlName, matchExtra);//传递控件类型名（可扩展控件需要）
                    }else if(object[ctrlName]){//textbox
                    	var objName = Util._getCtrlName(object[ctrlName].name);
                    	InitCtrlProp && InitCtrlProp(editorSelectedElement, objName, matchExtra);//传递控件类型名（非可扩展控件）
                    }

                    $('input:text:first').focus();
                }
                
                break;
        }
    };

    win.sumitData = function(name) {
        var flag = CheckCtrlProp();
        if (flag && pWin) {
            if (typeof(pWin.GetEditorSelectedElement) == 'function') {
                var editorSelectedElement = pWin.GetEditorSelectedElement() || activeElement;
                if (editorSelectedElement) {
                    if (typeof(pWin.UpdateEditorElement) == 'function') {
                        pWin.UpdateEditorElement(editorSelectedElement, BuildCtrlProp());
                    }
                } else {
                    if (typeof(pWin.ReplaceEditorHtml) == 'function') {
                    	var eName;
                    	var matchExtra;
                    	var extraObject = JSON.parse(pWin.ExtraCtrlMeta);
                    	
                    	if(name){
                    		eName = Util._getCtrlName(name);
                    		//判断匹配的可扩展控件对象
                    		matchExtra = Util._returnMatchCtrl(eName, extraObject);
                    		pWin.ReplaceEditorHtml(BuildCtrlHTML(eName,matchExtra));//传递控件类型名（可扩展控件需要）
                    		
                    	}else{
                    		eName = Util._getCtrlName(win.sender._.name);
                    		//判断匹配的可扩展控件对象
                    		matchExtra = Util._returnMatchCtrl(eName, extraObject);
                    		pWin.ReplaceEditorHtml(BuildCtrlHTML(eName, matchExtra));//传递控件类型名（可扩展控件需要）win.sender._.name
                    	}
                    }
                }
            }
        }
        return flag;
    }

    function initKeyListener() {
        var flag = sumitData(sender.getDialog()._.name);
        flag && sender.getDialog().hide();
    }
}(this, jQuery));

// extended by Mr.Prime
(function(win, $) { 
    var pWin = win.parent,

        M = Mustache,
        selOptTempl = '<option value="{{enName}}">{{zhName}}({{enName}})</option>';

    // dialog提示，主要用于错误提示
    var DialogTip = function() {
        this.$widget = $('<p>').addClass('dialog-tip').appendTo('body');
    };

    $.extend(DialogTip.prototype, {
        show: function() {
            this.$widget
                .stop(true)
                .animate({ top: '30%' }, 300)
                .delay(1500)
                .animate({ top: -50 }, 300);
        },

        setMsg: function(msg) {
            this.$widget.html(msg);

            return this;
        },

        setType: function(type) {
            this.$widget
                .removeClass()
                .addClass('dialog-tip ' + type);

            return this;
        }
    });

    var dialogTip = new DialogTip();

    var valid_charactar = function(str, chars) {
        var re = new RegExp("[" + chars + "]+", "i");
        return str.search(re) < 0;
    };

    win.Util = {
        // 错误提示
        alert: function(msg) {
            dialogTip.setType('error')
                .setMsg(msg)
                .show();
        },

        isIllegalChars: function(val) {
            var invalid_chars = "'\"\\\\<>&`";

            if (!valid_charactar(val, invalid_chars)) {
                return true;
            }

            return false;
        },
// 删除数据源  by shengjia 2017.4.24
//        // 初始化属性页的DataField select
//        initDataField: function($sel, ctrlType) {
//            var fields = pWin.FieldMgr.getFieldsByCtrlType(ctrlType),
//                html = [];
//
//            $.each(fields, function(i, field) {
//                html.push(M.render(selOptTempl, field));
//            });
//            
//            $sel.empty().html(html.length ? 
//                html.join('') : 
//                '<option value="">表中无匹配字段</option>')
//
//            !html.length && $sel.attr('disabled', 'disabled');
//        },

        // 是否为扩展名字符集
        isExtList: function(val) {
            var reg = /^[A-Za-z][A-Za-z;]*[A-Za-z;]$/g,
                rt = 0;

            if(reg.test(val)) {
                rt = 1;
            }

            return !!rt;
        },

        // 是否为正数
        isPosNum: function(val) {
            var rt = 1;
            if(val.toString() != '0')
            {
                if(val.toString().length > 3) {
                    rt = 0;
                }
                else{
                    if(/^[1-9][0-9]+$/.test(val)) {
                        val = parseInt(val, 10)
                        if(val == 0) {
                            rt = 0;
                        }
                    } 
                    else {
                        rt = 0;
                    }
                }
            }
            return !!rt;
        },

        // 字段是否已用
        isFieldUsed: function(field,fieldCn,isEditing,data) {
            var ckeIframe = $(pWin.document.getElementById('cke_editor1')).find('iframe')[0],
                ckeWin = ckeIframe.contentWindow,
                ckeDoc = ckeWin.document;

            // 控件DOM 
            var ctrlEl = false;
            var matchElement = ckeDoc.getElementById(field + '_' + tableId);
            if(matchElement && !isEditing){
            	ctrlEl = true;
            	return ctrlEl;
            }
            //如果传入中文名称，判断中文名称有没有重复
            if(fieldCn){
            	var inputs = ckeDoc.getElementsByTagName('input');
            	for(var m=0;inputs != null && inputs.length>0 && m<inputs.length; m++){
            		if(inputs[m].attributes.datafieldcn.nodeValue == fieldCn && (inputs[m].attributes.datafield.nodeValue != field)){
            			ctrlEl = true;
            			break;
            		}else if(inputs[m].attributes.datafieldcn.nodeValue == fieldCn 
            				&& (inputs[m].attributes.datafield.nodeValue == field) 
            				&& inputs[m].className == "datagrid"){
            			var inputJson = JSON.parse(inputs[m].attributes.subfields.value);
            			if (data && data.length) {
                    		for(var j=0; data && data.length>0 && j<data.length; j++){
                    			for (var n = 0;  data && data.length>0 && n<data.length; n++) {
                					if((data[j].fieldname != data[n].fieldname) && (data[j].headername == data[n].headername)){
                						ctrlEl = true;
                            			break;
                					}
                				}
                    		}
            			}
            		}
            	}
            }
            return ctrlEl;
        },
        
        // 判断字段表中是否已存在该字段名
        isFieldUsedInTable: function(field,fieldCn,isEditing,data) {
        	var exitField = 0;
        	var fds = [];
        	fds = pWin.FieldMgr.getFieldsByCtrlType('all');
        	$.each(fds, function (i, fd) {
                fieldnamelist = '';
                if (fd.enName == field && !isEditing) {
                	exitField = !0;
                }else if(fd.zhName == fieldCn && (fd.enName != field)){
                	exitField = !0;
                }else if(fd.zhName == fieldCn && (fd.enName == field) && fd.ctrlType == "datagrid"){
                	if (data && data.length) {
                		for(var m=0; data && data.length>0 && m<data.length; m++){
                			for (var n = 0; data && data.length && n < data.length; n++) {
            					if((data[m].fieldname != data[n].fieldname)  && (data[m].headername == data[n].headername)){
            						exitField = !0;
            					}
            				}
                		}
        			}
                }
             });
            return exitField;
        },

        // controls/TextBox.php?tableId=123 --> textbox
        _getLastPathName: function() {
            var pathName = win.location.pathname,

                lastSlash = pathName.lastIndexOf('/'),
                lastDot = pathName.lastIndexOf('.');

            return pathName.substring(lastSlash + 1, lastDot).toLowerCase();
        },
        
        //可扩展控件名获取（获取td_后的字符串，就是当前控件的类型）
        _getCtrlName: function(id) {
            var lastSlash = id.indexOf('_');
            return id.substring(lastSlash+1,id.length).toLowerCase();
        },
        
        //过滤参数（获取=以后的参数值）
        _splitParam: function(id,name) {
        	if(id != null){
        		var lastSlash;
        		var nextParamLen;
        		var typeLen;
        		if(name == 'name'){
        			if(id.indexOf('name=')>-1){
        				lastSlash = id.indexOf('name=');
                        nextParamLen = id.indexOf('&');
                        return id.substring(lastSlash+5,nextParamLen).toLowerCase();
        			}
        		}else if(name == 'fieldcreatetype'){
        			typeLen = id.indexOf('fieldcreatetype=');
                    return id.substring(typeLen+16,id.length).toLowerCase();
        		}
        	}
        	return '';
        },
        
        //拆分数据(data:XXX;data2:XXX)
        _splitData: function(data) {
        	var partData;
        	var paramData;
        	var params ="";
        	var vals = "";
        	if(data != null && data.indexOf(';')>-1){
        		partData = data.split(';');
        		for(var i=0; partData.length>0 && i<partData.length; i++){
        			if(partData[i].indexOf(':')>-1 && partData[i].split(':').length>1){
        				if(i != partData.length-1){
        					params += partData[i].split(':')[0]+";";
            				vals += partData[i].split(':')[1]+";";
        				}else{
        					params += partData[i].split(':')[0];
            				vals += partData[i].split(':')[1];
        				}
        			}
        		}
        	}else if(data != null && data.indexOf(':')>-1 && data.split(':').length>1){
        		paramData = data.split(':');
        		params = paramData[0];
				vals = paramData[1];
        	}
            return params+"|"+vals;
        },

        //返回匹配可扩展控件对象
        _returnMatchCtrl: function(ctrlname, extraObject) {
            var retExtra;
            for (prop in extraObject) {
            	if(extraObject[prop]){
            		for(var m=0; m<extraObject[prop].length; m++){
            			if(extraObject[prop][m].sign == ctrlname){
            				retExtra = extraObject[prop][m];
            			}
            		}
                }
            }
            return retExtra;
        }
        

// 删除数据源  by shengjia 2017.4.24       
//        // 构建控件的title属性
//        buildCtrlTitle: function(df) {
//            var field = pWin.FieldMgr.getFieldData(df);
//
//            return (field.zhName + '（' + df + '）');
//        }
    };
}(this, jQuery));
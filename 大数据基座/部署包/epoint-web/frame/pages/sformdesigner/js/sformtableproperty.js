function setControlsAccessRight(data) {
    if (data && data.accessRight) {
        var json = epoint.decodeJson(data.accessRight);
        var tableid = epoint.decodeJson(data.tableId);
        var gridid = data.gridid;
        for (var id in json) {
            if (!Object.prototype.hasOwnProperty.call(json, id)) {
				continue;
			}
            // 用于表单设计器中
            // var newid=id+"_"+tableid;
            // 过滤掉子列表控件id
        	if (id.indexOf('SubTable_') == -1) {
            	var LowCaseId=id.toLowerCase();
                var controlobject = mini.getByName(LowCaseId);
            }
            try {
                // 				if (controlobject) {
                // 					var $label = $(controlobject.el).parent().prev("div,label");
                // 				}
                switch (json[id]) {
                    case 'readonly':
                        if (id.indexOf('SubTable_') != -1 && gridid) {
                            var grids = gridid.split('_');
                            var subid = grids[1];
                            document.getElementById(
                                subid + 'Add'
                            ).style.display = 'none';
                            document.getElementById(
                                subid + 'Del'
                            ).style.display = 'none';
                            mini.get(gridid).hideColumn('edit');
                            mini.get(gridid).hideColumn('check');
                            mini.get(gridid).hideColumn('subdel');
                            mini.get(gridid).allowCellEdit = false;
                        }
                        // controlobject.disable();
                        controlobject.setReadOnly(true);

                        break;
                    case 'required':
                        controlobject.setRequired(true);
                        controlobject.setRequiredErrorText('不能为空!');
                        break;
                    case 'hidden':
                        // 					if ($label.length)
                        // 						$label.hide();

                        // 					controlobject.hide();
                        doControlHide(controlobject);
                        if (id.indexOf('SubTable_') != -1 && gridid) {
                            var grids = gridid.split('_');
                            var subid = grids[1];
                            document.getElementById(
                                subid + 'Add'
                            ).style.display = 'none';
                            document.getElementById(
                                subid + 'Del'
                            ).style.display = 'none';
                            mini.get(gridid).hideColumn('edit');
                            mini.get(gridid).hideColumn('check');
                            mini.get(gridid).hideColumn('subdel');
                            mini.get(gridid).allowCellEdit = false;
                        }
                        break;
                    default:
                        break;
                }
            } catch (e) {}
        }
    }
    
 // 处理表单中所有上传控件的权限，返回都是没有权限的按钮信息-- edit by xuebing
	var hideUploaderStyle = [];
	if (data && data.isAllowAttachWrite) {
		var s = data.isAllowAttachWrite.split(';');
		/*$('.uc-oauploader').each(function(i, item) {
			if (item.id) {
				var id = item.id;
				if (s.length > 0) {
					for (i = 0; i < s.length; i++) {
						if ("uploader" == s[i]) {
							mini.get(id).setUploadBtnVisable(false);
						} else {
							mini.get(id)._setFunBtnVisable(0, s[i], false);
						}

					}
				}

			}
		});*/
		$('.uc-oauploader').each(function(i, item) {
			if (item.id) {
				var id = item.id;
				if (s.length > 0) {
					for (i = 0; i < s.length; i++) {
						if ("uploader" == s[i]) {
							mini.get(id).setUploadBtnVisable(false);
						} else {
							if("download" == s[i]){ 
								hideUploaderStyle.push('#'+id + '  .file-item .file-name { pointer-events: none;}');
							}
							// mini.get(id)._setFunBtnVisable(0, s[i], false);
							hideUploaderStyle.push('#'+id + ' .file-func .' + s[i] + '-file {display:none!important}');
						}

					}
				}

			}
		});
	}
	if(!data.isWrite){	
		// 隐藏所有按钮
		$('.uc-oauploader').each(function(i, item) {
			if (item.id) {
				var id = item.id;
				mini.get(id).setUploadBtnVisable(false);	
				hideUploaderStyle.push('#'+id + ' .file-func {display:none!important}');
			}
		});

	}
	if ($('#hideUploaderStyle').length) {
		$('#hideUploaderStyle').text(hideUploaderStyle.join('\n'));
	} else {
		$('<style id="hideUploaderStyle" ></style>').text(hideUploaderStyle.join('\n')).appendTo('head');
	}
}

function doControlHide(control) {
    var $ctr = $(control.el);

    var $row = $ctr.closest('.row');
    var $cols = $row.find('> .col');
    var colCount = $cols.length;

    // 只有控件 或 控件 + label 则直接全部隐藏行即可
    if (colCount == 1 || colCount == 2) {
        // 第一行上有整个表单的上边框需要特殊处理
        if ($row.hasClass('first')) {
            $row.css({
                height: '1px',
                overflow: 'hidden',
            });
        } else {
            $row.hide();
        }
    } else {
        // 更多列的情况 则是还有其他控件  则隐藏控件和label
        $ctr.hide();

        // 可能的tips
        var $tips = $ctr.next();
        if ($tips.hasClass('control-tips')) {
            $tips.hide();
        }
        // label
        var $label = $ctr.parent().prev().find('.design-form-label');
        $label.hide();
    }
}

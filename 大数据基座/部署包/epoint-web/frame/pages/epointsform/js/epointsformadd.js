$(function() {
	// 初始化页面
	if (Util.getUrlParams().ispreview) {
		$("#butList").addClass('hidden');
	}

	// 跨域处理
	var messenger = new epointsform.Messenger('epointsformIframe',
			'epointsformMessenger');

	// 跨域监听
	messenger.listen(function(msg) {
		if (!msg) {
			return;
		}
		msg = JSON.parse(msg);
		if (msg.handleType == "save") { // 保存表单
			if (epoint.validate()) {
				epoint.execute('saveForm', '', closeCallback);
			}
		} else if (msg.handleType == "getFormData") { // 获取表单数据
			var data = getFormData();
			if (data) {
				msg.formData = data;
			} else {
				msg.error = "获取表单数据失败！";
			}
			messenger.targets['parent'].send(JSON.stringify(msg));
		} else if (msg.handleType == "initFormData") { // 初始化表单数据
			if (msg.formData) {
				var form = DtoUtils.getCommonDto('@all');
				try {
					var formData = [];
					for (var i = 0, len = msg.formData.length; i < len; i++) {
						if (msg.formData[i].id == 'tableId'
								|| msg.formData[i].id == 'rowGuid'
								|| msg.formData[i].id == 'gridIds') {
							continue;
						}
						var item = {};
						item.id = msg.formData[i].id;
						if (msg.formData[i].type == 'datagrid') {
							item.data = msg.formData[i].data;
						} else {
							item.value = msg.formData[i].value;
						}
						formData.push(item);
					}
					form.setData(formData, null);
				} catch (ee) {
					msg.error = ee.toString();
					messenger.targets['parent'].send(JSON.stringify(msg));
					return;
				}
				messenger.targets['parent'].send(JSON.stringify(msg));
			} else {
				msg.error = "传入初始化表单页面数据为空！";
				messenger.targets['parent'].send(JSON.stringify(msg));
			}
		} else if (msg.handleType == "validate") { // 验证表单合法性
			try {
				if (epoint.validate()) {
					msg.validateTag = true;
				} else {
					msg.validateTag = false;
					msg.error = "表单保存校验未通过！";
				}
				messenger.targets['parent'].send(JSON.stringify(msg));
			} catch (e) {
				msg.error = "验证表单合法性失败！";
				messenger.targets['parent'].send(JSON.stringify(msg));
			}
		} else if (msg.handleType == "print" && msg.id) { // 打印表单
			if (document.getElementById(msg.id)) {
				msg.innerhtml = document.getElementById(msg.id).innerHTML;
			}
			messenger.targets['parent'].send(JSON.stringify(msg));
		}
	});

	// 跨域处理
	messenger.addTarget(window.parent, 'parent');

	if (!window.epointsformaddactionname) {// 新增页面actionname，可个性化
		window.epointsformaddactionname = "formcommonaddaction";
	}

	epoint.initPage(window.epointsformaddactionname, '', initCallBack);

	var tableId;

	function getFormData() {
		var form = DtoUtils.getCommonDto('@all');
		if (form && form.getData() && form.getData().commonDto) {
			var fields = JSON.parse(form.getData().commonDto);
			var formData = [];
			for (i in fields) {
				if (!fields[i].id) {
					continue;
				}

				var control = {};
				if (fields[i].id == 'tableId' || fields[i].id == 'rowGuid'
						|| fields[i].id == 'gridIds') {
					control.id = fields[i].id;
					control.fieldName = fields[i].id;
					control.fieldCNName = fields[i].id;
					control.value = fields[i].value;
					control.type = fields[i].type;
					formData.push(control);
					continue;
				} else if (!fields[i].type || fields[i].type == 'hidden') {
					continue;
				}

				if (fields[i].dataOptions) {
					var dataOptions = {};
					try {
						var datasSplit = fields[i].dataOptions.replace(
								/_EpSingleQuotes_/g, '\"');
						var dataOptions = JSON.parse(datasSplit);
					} catch (ee1) {
					}

					try {
						if (dataOptions && dataOptions.fieldName) {
							control.fieldName = dataOptions.fieldName;
						} else {
							control.fieldName = fields[i].id;
						}
					} catch (ee2) {
						control.fieldName = fields[i].id;
					}

					try {
						if (dataOptions && dataOptions.fieldCNName) {
							control.fieldCNName = dataOptions.fieldCNName;
						} else if (dataOptions && dataOptions.fieldName) {
							control.fieldCNName = dataOptions.fieldName;
						} else {
							control.fieldCNName = fields[i].id;
						}
					} catch (ee3) {
						control.fieldCNName = fields[i].id;
					}

				} else {
					control.fieldName = fields[i].id;
					control.fieldCNName = fields[i].id;
				}

				control.id = fields[i].id;
				control.type = fields[i].type;

				if (fields[i].type == 'datagrid') {
					fields[i].data = mini.get(fields[i].id).getData();
					control.data = fields[i].data;
				} else {
					if (fields[i].value) {
						control.value = fields[i].value;
					} else {
						control.value = '';
					}
				}
				formData.push(control);
			}
			return formData;
		} else {
			return null;
		}
	}

	function initCallBack(data) {
		if (data && data.error) {
			if (!Util.getUrlParams().isShowButton) {
				var msg = {};
				msg.handleType = "init";
				msg.error = data.error;
				messenger.targets['parent'].send(JSON.stringify(msg));
			}
			return;
		}

		try {
			var flag = mini.get("flag").getValue();
			if (addInit && (typeof (addInit) == "function") && (!flag || flag=="true") ) {
				mini.get("flag").setValue("true");
				addInit();
			}
		} catch (e) {
		}
		// 控制按钮显隐（外部调用时隐藏）
		if (data && data.isShowBtn && data.isShowBtn == "false") {
			$("#butList").addClass('hidden');
		}
		if (data && data.rowGuid) {
			mini.get("rowGuid").setValue(data.rowGuid);
		}

		if (!data) {
			if (!window.isfirstpageload && !Util.getUrlParams().isShowButton) {
				window.isfirstpageload = true;
				var msg = {};
				msg.handleType = "init";
				var data = getFormData();
				if (data) {
					msg.formData = data;
				} else {
					msg.formData = [];
				}
				messenger.targets['parent'].send(JSON.stringify(msg));
			}
			return;
		}
		// 宏控件
		if (data != null && data.map != null && data.map.reMap != null) {
			for (var m = 0; data.map.reMap.length > 0
					&& m < data.map.reMap.length; m++) {
				var id = data.map.reMap[m].id;
				var value = data.map.reMap[m].value;
				if (document.getElementById(id)) {
					mini.get(id).setValue(value);
					// document.getElementById(id).value = value;
				}
			}
		}
		if (!window.isfirstpageload
				&& Util.getUrlParams().isShowButton != 'true') {
			window.isfirstpageload = true;
			var msg = {};
			msg.handleType = "init";
			var data = getFormData();
			if (data) {
				msg.formData = data;
			} else {
				msg.formData = [];
			}
			// msg.height = $('body').height();
			msg.iframeId = 'epointsformIframe';
			messenger.targets['parent'].send(JSON.stringify(msg));
		}

		// 查找页面所有子表id,存放在hidden控件(保存)
		var a = $(".mini-datagrid");
		var ids = "";
		for (var n = 0; a.length > 0 && n < a.length; n++) {
			ids += a.get(n).id;
			if (n != a.length - 1) {
				ids += ",";
			}
		}
		mini.get("gridIds").setValue(ids);

		// 查询页面新子表Ids
		var newDataGridIds = $("div.newDatagrid");
		var newIds = "";
		for (var n = 0; newDataGridIds != null && newDataGridIds.length > 0
				&& n < newDataGridIds.length; n++) {
			newIds += newDataGridIds.get(n).id;
			if (n != newDataGridIds.length - 1) {
				newIds += ",";
			}
		}
		mini.get("newDatagridIds").setValue(newIds);
	}

	// 本页面按钮调用保存，非跨域
	window["saveForm"] = function() {
		if (epoint.validate()) {
			epoint.execute('saveForm', '', function(data) {
				if (data.msg) {
					epoint.alertAndClose(data.msg);
				}
			});
		}
	}

	// 关闭操作的回调
	function closeCallback(data) {
		var msg = {};
		msg.handleType = "save";
		if (data && data.error) {
			msg.error = data.error;
			messenger.targets['parent'].send(JSON.stringify(msg));
			return;
		}
		if (data.rowGuid) {
			mini.get("rowGuid").setValue(data.rowGuid);
		}
		if (data.msg && data.msg == "保存成功") {
			window.isFirstPageLoad = true;
			msg.rowGuid = data.rowGuid;
			messenger.targets['parent'].send(JSON.stringify(msg));
		} else {
			msg.error = data.msg;
			messenger.targets['parent'].send(JSON.stringify(msg));
		}
	}

	/**
	 *  子表列表控件下方新增空记录行事件
	 */
	window["add"] = function(id) {
		epoint.execute('add', '', [ id ], searchData);
	}

	/**
	 *  子表列表控件下方删除记录行事件
	 */
	window["del"] = function(id) {
		epoint.execute('del', '', [ id ], searchData);
	}

	window["searchData"] = function(data) {
		if (data && data.gridId) {
			epoint.refresh(data.gridId);
			mini.get("flag").setValue("false");
		}
	}

	/**
	 * 子表列表new控件新增记录操作响应事件
	 */
	window["openAdd"] = function(id) {
		var parentGuid = mini.get("rowGuid").getValue();
		epoint.execute('getEnableVersionUrl', '', [ id, parentGuid ],
				searchBack);
	}

	window["searchBack"] = function(args) {
		if (args && args.openAddUrl) {
			epoint.openDialog("新增记录", args.openAddUrl, recallBack, {
				'width' : 1000
			});
		} else {
			epoint.alertAndClose(args.msg);
		}
	}

	/**
	 * 子表列表new控件删除记录操作响应事件
	 */
	window["recallBack"] = function(data) {
		if (data == "ok") {
			epoint.refresh(mini.get("newDatagridIds").getValue().split(','));
			mini.get("flag").setValue("false");
		}
	}

	window["realDel"] = function(id) {
		epoint.execute('realDel', '', [ id ], searchData);
	}

	window["refreshControl"] = function() {
		epoint.refresh([ 'form' ]);
	}

	//身份证号码验证
	window["onIDCardsValidation"] = function(e) {
		if (e.isValid) {
			if(e.value != "" && e.value != null){
				var pattern = /\d*/;
				if (e.value.length < 15 || e.value.length > 18
						|| pattern.test(e.value) == false) {
					e.errorText = "身份证必须输入15~18位数字";
					e.isValid = false;
				}
		    }
		}
	}
	
	//移动电话验证
	window["mobileValidation"] = function(e) {
		if (e.isValid) {
			if(e.value !="" && e.value != null){
				var result=e.value.match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
				if(result==null){
					e.errorText = "请输入正确格式的移动电话";
					e.isValid = false;
				}
			}
		}
	}
	
	//固定电话验证（正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX）
	window["phoneValidation"] = function(e) {
		if (e.isValid) {
			if(e.value !="" && e.value != null){
				var result=e.value.match(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/);
				if(result==null){
					e.errorText = "请输入正确格式的固定电话";
					e.isValid = false;
				}
			}
		}
	}
	
	//邮政编码验证
	window["postCodeValidation"] = function(e) {
		if (e.isValid) {
			if(e.value !="" && e.value != null){
				var result=e.value.match(/^[1-9]{1}[0-9]{5}$/);
				if(result==null){
					e.errorText = "请输入正确格式的邮政编码";
					e.isValid = false;
				}
			}
		}
	}
	
	//整数验证
	window["intValidation"] = function(e) {
		if (e.isValid) {
			if(e.value !="" && e.value != null){
				var result=e.value.match(/^(-|\+)?\d+$/);
				if(result==null){
					e.errorText = "请输入整数";
					e.isValid = false;
				}
			}
		}
	}
	
	//数字验证
	window["floatValidation"] = function(e) {
		if (e.isValid) {
			if(e.value !="" && e.value != null){
				if(isNaN(e.value)){
					e.errorText = "请输入数字";
					e.isValid = false;
				}
			}
		}
	}

	window["fillControl"] = function(controlId) {
		epoint.execute('resetControlValue', '', [ controlId ],
				function callback(data) {
					// 可扩展控件默认值回传设置控件值
					if (data != null && data.resetControlMap != null
							&& data.resetControlMap.map != null) {
						for (var m = 0; data.resetControlMap.map.length > 0
								&& m < data.resetControlMap.map.length; m++) {
							var id = data.resetControlMap.map[m].id;
							var value = data.resetControlMap.map[m].value;
							if (document.getElementById(id)) {
								mini.get(id).setValue(value);
							}
						}
					}
				});
	}
	
	window["validate"] = function() {
		epoint.validate();
	}
	
	/**
	 * 子表列表new控件修改操作列相应事件
	 */
	var editTableId="";
	window["onEditRenderer"] = function(e){
		//editTableId = e.sender.el.id;
		return epoint.renderCell(e, "action-icon icon-edit", "openViewDialog", "rowguid,gridId");
	}
	
	window["openViewDialog"] = function(data){
		var rowguid = data.rowguid;
		var gridId = data.gridId;
		epoint.execute('getEditUrl', '', [gridId, rowguid], showUrl);
	}
	
	window["showUrl"] = function(args){
		editTableId = args.editTableId;
		if (args.editUrl) {
			epoint.openDialog("表单详细信息", args.editUrl, refreshBack, {
				'width' : 1000
			});
		} else {
			epoint.alertAndClose(args.message);
		}
	}
	
	window["refreshBack"] = function(){
		epoint.refresh(editTableId);
	}
	
})
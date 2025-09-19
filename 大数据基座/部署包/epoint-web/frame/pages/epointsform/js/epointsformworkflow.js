$(function() {
	// 初始化页面
	if (!window.epointsformworkflowactionname) {// 工作流页面actionname，可个性化
		window.epointsformworkflowactionname = "sformdesigncommonaction";
	}
	epoint.initPage(window.epointsformworkflowactionname, '', initCallBack);
	
	var tableId;
	
	function initCallBack(data){
		try {
			var flag = mini.get("flag").getValue();
			if (addInit && (typeof (addInit) == "function") && (!flag || flag=="true") ) {
				mini.get("flag").setValue("true");
				addInit();
			}
		} catch (e) {
		}
		if (data && data.rowGuid) {
			mini.get("rowGuid").setValue(data.rowGuid);
		}
		//宏控件
		if (data != null && data.map != null && data.map.reMap != null) {
			console.log(data.map.reMap);
			for (var m = 0; data.map.reMap.length > 0
					&& m < data.map.reMap.length; m++) {
				var id = data.map.reMap[m].id;
				var value = data.map.reMap[m].value;
				if(document.getElementById(id)){
					mini.get(id).setValue(value);
					//document.getElementById(id).value = value;
				}
			}
		}
		
		//查找页面所有子表id,存放在hidden控件
		var a = $(".mini-datagrid");
		var ids = "";
		for(var n=0; a.length>0 && n<a.length; n++){
			ids += a.get(n).id;
			if(n!=a.length-1){
				ids +=",";
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
		
		if(data){
			setControlsAccessRight(data);
		}
	}

	window["saveFrom"] = function () {
		if (epoint.validate()) {
			epoint.execute('saveForm', '', newCallback);
		} else
			ShowTdOperate(true);
	}

	window["submit"] = function () {
		if (epoint.validate()) {
			epoint.execute('submit', '', newCallback);
		} else
			ShowTdOperate(true);
	}

	function newCallback(data) {
		if(data && data.msg){
			epoint.alert(data.msg, '', null, 'info');
		}
		HeaderSubmit();
	}
	
	window["add"] = function (id) {
		epoint.execute('add', '', [id], searchData);
	}

	window["del"] = function (id, row) {
		var rowguid = "";
		if(row && row.rowguid){
			rowguid = row.rowguid;
		}
		epoint.execute('del', '', [id, rowguid], searchData);
	}
	
	window["searchData"] = function (data) {
		if(data && data.gridId){
			epoint.refresh(data.gridId);
			mini.get("flag").setValue("false");
		}
	}
	
	window["refreshControl"] = function (){
		epoint.refresh(['form']);	
	}
	
	/**
	 * 子表列表new控件新增记录操作响应事件
	 */
	window["openAdd"] = function(id) {
		var parentGuid = mini.get("rowGuid").getValue();
		epoint.execute('getEnableVersionUrl', '', [ id, parentGuid],
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

	window["realDel"] = function(id, row) {
		var rowguid = "";
		if(row && row.rowguid){
			rowguid = row.rowguid;
		}
		epoint.execute('realDel', '', [ id ,rowguid], searchData);
	}
	
	/**
	 * 表格数据导入成功
	 */
	window["onFileSuccess"] = function(e) {
		if (e.data && e.data.extraDatas.msg) {
			epoint.alert(e.data.extraDatas.msg, '', null, 'info');
			epoint.refresh(mini.get("gridIds").getValue().split(','));
		}
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
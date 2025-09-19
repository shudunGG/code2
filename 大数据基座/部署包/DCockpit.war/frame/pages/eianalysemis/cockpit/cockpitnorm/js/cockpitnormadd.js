// 初始化页面
var maxDimNum;
epoint.initPage('cockpitnormaddaction', null, function(data) {
	maxDimNum = data.maxDimNum;

	if (data.isAdd == 'true') {
		//Util.form.hideField('#apicodeText');
	}

	/*if (data.operationpersonname) {
		mini.get("operationperson").setText(data.operationpersonname);
	}*/
	if (data.liableOuName) {
		mini.get('liableou').setText(data.liableOuName);
	}
	if (data.isAdmin != true) {
		mini.get('liableou').disable();
	}

	if (data.setName) {
		mini.get('setguid').setText(data.setName);
	}

	if (data.kylinType) {
		lastDatasourceValue == 5;
	}
	// 指标类型默认为单值指标
	typeChanged();
	var grid2data = mini.get("datagrid2").getData();
	if (grid2data.length > 0) {
		var value = "", text = "";
		for (var i = 0; i < grid2data.length; i++) {
			value += "," + grid2data[i].DataFieldNameEN;
			text += "," + grid2data[i].DataFieldName;
		}
		mini.get('dimfieldguid').setValue(value.substring(1));
		mini.get('dimfieldguid').setText(text.substring(1));
		if (grid2data[0].DimFieldNameEN) {
			mini.get('dimvalue').setValue(grid2data[0].DimFieldNameEN);
			mini.get('dimvalue').setText(grid2data[0].DimFieldName);
		}
	}

	var timefieldguid = mini.get("timefieldguid").getValue();
	if (timefieldguid) {
		Util.form.showField('#timewindowCon');
		$('#timeDiv1').show();
		var statisticsCycle = mini.get("statisticsCycle").getValue();
		if (statisticsCycle) {
			Util.form.showField('#isCumsumCon');
		} else {
			Util.form.hideField('#isCumsumCon');
		}
	} else {
		// 默认隐藏时间窗口
		Util.form.hideField('#timewindowCon');
		Util.form.hideField('#isCumsumCon');
	}
	var resultCount = mini.get('resultCount').getValue();
	if (resultCount) {
		Util.form.showField('#sortOrderCon');
		if (mini.get("normtype").getValue() == "4") {
			$('#sortColumn').show();
		}
	} else {
		Util.form.hideField('#sortOrderCon');
		$('#sortColumn').hide();
	}
	var rightControl = mini.get('rightControl').getValue();
	if (rightControl == '1') {
		Util.form.showField('#rightControlFieldCon');
	} else {
		Util.form.hideField('#rightControlFieldCon');
	}
	var configType = mini.get("configtype").getValue();
	if (configType == "3" && mini.get("normtype").getValue() != 5) {

		ajaxParamsEditor.setValue(js_beautify(data.apiparams));
		ajaxFilterEditor.setValue(data.apifilter);
		ajaxResultEditor.setValue(js_beautify(data.apiresult));
		epoint.execute("getApiInfo", "@none", data.apiguid, loadApiInfo);
		if (data.matchtext) {
			var matchgrid = mini.get("matchgrid");
			var matchtext = JSON.parse(data.matchtext);
			for (var i = 0; i < matchgrid.getData().length; i++) {
				var row = matchgrid.getRow(i);
				if (matchtext[row.fieldname]) {
					matchgrid.updateRow(row, {
						matchname : matchtext[row.fieldname]
					});
					matchgrid.updateRow(row, {
						status : "匹配成功"
					});
				}
			}
		}
		mini.get("headers").setValue(data.headers);
	}
	var flowguid = mini.get('flowguid').getValue();
	if (flowguid && !mini.get('normtype').getValue() == '5') {
 		mini.get('generatesql').disable();
	}
	
});

function onClearSetguid() {
    mini.get("setguid").setValue("");
}

function onClearDimtableguid() {
    mini.get("dimtableguid").setValue("");
}

var grid = mini.get("datagrid1");
var grid3 = mini.get("datagrid3");
grid.load();
var fConditonDatas = [ {
	id : '=',
	text : '='
}, {
	id : '!=',
	text : '!='
}, {
	id : '<=',
	text : '<='
}, {
	id : '>=',
	text : '>='
}, {
	id : '<',
	text : '<'
}, {
	id : '>',
	text : '>'
} ];

var settree = mini.get('setguid');
settree.on('beforenodeselect', function(obj) {
	if (obj.node.ckr == true) {
		obj.cancel = false;
	} else {
		obj.cancel = true;
	}
});

var outree = mini.get('liableou');
outree.on('beforenodeselect', function(obj) {
	if (obj.node.ckr == true) {
		obj.cancel = false;
	} else {
		obj.cancel = true;
	}
});

function liableOuChanged() {
	var ouGuid = mini.get('liableou').getValue();
	if (ouGuid) {
		epoint.refresh([ 'liableou', 'liablePer' ], function(data) {
			var liabuserGuid = mini.get('liablePer').getValue();
			if (liabuserGuid) {
				mini.get('liablePer').setValue('');
				mini.get('liablePer').setText('');
			}
		});
	}
}

function onActionRenderer(e) {
	var grid = e.sender;
	var record = e.record;
	var uid = record._uid;
	var rowIndex = e.rowIndex;

	var s = '<a class="New_Button" href="javascript:newRow()" style="color:blue;text-decoration:underline;">新增</a>'
			+ '&nbsp;&nbsp;<a class="Edit_Button" href="javascript:editRow(\''
			+ uid
			+ '\')" style="color:green;text-decoration:underline;">编辑</a>'
			+ '&nbsp;&nbsp;<a class="Delete_Button" href="javascript:delRow(\''
			+ uid + '\')" style="color:red;text-decoration:underline;">删除</a>';

	if (grid.isEditingRow(record)) {
		s = '<a class="Update_Button" href="javascript:updateRow(\''
				+ uid
				+ '\')" style="color:green;text-decoration:underline;">更新</a>'
				+ '&nbsp;&nbsp;<a class="Cancel_Button" href="javascript:cancelRow(\''
				+ uid
				+ '\')" style="color:red;text-decoration:underline;">删除</a>'
	}
	return s;
}

// 数据来源表值
function getTable() {
	return mini.get('datatableguid').getValue();
}

function newRow() {
	if (!getTable()) {
		epoint.alert('请配置数据来源！', '', null, 'warning');
		return;
	}

	if (!epoint.validate()) {
		return;
	}
	if (epoint.validate()) {
		grid.commitEdit();
	}
	var row = {};
	grid.addRow(row, 0);
	grid.cancelEdit();
	grid.beginEditRow(row);
}

function editRow(row_uid) {
	var row = grid.getRowByUID(row_uid);
	if (row) {
		grid.cancelEdit();
		grid.beginEditRow(row);
	}
}

function cancelRow(row_uid) {
	var row = grid.getRowByUID(row_uid);
	grid.removeRow(row, true);

}

function delRow(row_uid) {
	var row = grid.getRowByUID(row_uid);
	grid.removeRow(row, true);
}

function updateRow(row_uid) {
	var row = grid.getRowByUID(row_uid);
	if (epoint.validate()) {
		grid.commitEdit();
	}
}

var grid2 = mini.get("datagrid2");

function onActionRenderer2(e) {
	var grid = e.sender;
	var record = e.record;
	var uid = record._uid;
	var rowIndex = e.rowIndex;
	var dimFilterFieldGuid = record.DimFilterFieldGuid ? record.DimFilterFieldGuid
			: '';
	var dimFilterValue = record.DimFilterValue ? record.DimFilterValue : '';

	var s = '<a class="Edit_Button" href="javascript:editRow2(\'' + uid
			+ '\')" style="color:green;text-decoration:underline;">编辑</a>';

	if (grid.isEditingRow(record)) {
		s = '<a class="Update_Button" href="javascript:updateRow2(\''
				+ uid
				+ '\')" style="color:green;text-decoration:underline;">更新</a>'
				+ '&nbsp;&nbsp;<a class="Delete_Button" href="javascript:cancelRow2(\''
				+ uid
				+ '\')" style="color:red;text-decoration:underline;">取消</a>';
	}
	return s;
}

function editFilter(row_uid, index, dimFilterFieldGuid, dimFilterValue) {
	var row = grid2.getRowByUID(row_uid);
	if (row) {
		epoint.openDiv('editWindow', 'none');
		var form = new mini.Form("#editform");
		epoint.execute('getDimFilter', '@none', [ index, row_uid ], function(
				data) {
			form.unmask();
			var o = mini.decode(data);
			if (!o.dimFilterFieldGuid && dimFilterFieldGuid) {
				o.DimFilterFieldGuid = dimFilterFieldGuid;
			}
			if (!o.dimFilterValue && dimFilterValue) {
				o.DimFilterValue = dimFilterValue;
			}
			epoint.refresh([ 'normtype', 'dimdatasourceid', 'dimtableguid',
					'dimFilterFieldGuid', 'dimFieldNameEN' ], function(data) {
				form.setData(o);
			});
		});
	}
}

function saveDimFilter() {
	var data = new mini.Form("#editform").getData();
	var row_uid = data.rowid;
	var normtype = mini.get('normtype').getValue();
	if ("2" == normtype) {
		var row = grid2.getRowByUID(row_uid);
		grid2.updateRow(row, data);
	}
	mini.get('editWindow').hide();
}

// 维度来源表值
function getTableDim() {
	return mini.get('dimtableguid').getValue();
}

function addGrid2Row() {
	var dims = mini.get("dimfieldguid").getSelecteds();
	if (dims.length > maxDimNum) {
		epoint.alert("维度字段最多可设置" + maxDimNum + "个");
		mini.get('dimfieldguid').setValue("");
		mini.get('dimfieldguid').setValue("");
		grid2.clearRows();
		return;
	}
	var dimfields = mini.get('dimfieldguid').getValue().split(",");
	var dimfieldnames = mini.get('dimfieldguid').getText().split(",");
	if (dimfields == null || dimfields[0] == "") {
		return;
	}
	grid2.clearRows();
	for (var i = 0; i < dimfields.length; i++) {
		var row = {
			DataFieldNameEN : dimfields[i],
			DataFieldName : dimfieldnames[i]
		};
		grid2.addRow(row, i);
	}

}

function editRow2(row_uid) {
	var dimtable = mini.get('dimtableguid').getValue();
	var dimvalue = mini.get('dimvalue').getValue();
	var dimtext = mini.get('dimtext').getValue();
	if (!dimtable || !dimvalue || !dimtext) {
		epoint.alert('请配置维度信息！', '', null, 'warning');
		return;
	}
	var row = grid2.getRowByUID(row_uid);
	if (row) {
		grid2.updateRow(row, {
			DimFilterRelateType : "="
		});
		grid2.cancelEdit();
		grid2.beginEditRow(row);
	}
}

function cancelRow2(row_uid) {
	var row = grid2.getRowByUID(row_uid);
	grid2.cancelEdit();
	grid2.updateRow(row, {
		DimFilterRelateType : ""
	});
}

function updateRow2(row_uid) {
	var row = grid2.getRowByUID(row_uid);
	var dimvalue = mini.get('dimvalue').getValue();
	var DataFieldName = row.DataFieldName;
	var DimFilterFieldNameEN = grid2.getCellEditor(grid2.getColumn(1), row)
			.getValue();
	var DimFilterValue = grid2.getCellEditor(grid2.getColumn(3), row)
			.getValue();
	if (DimFilterFieldNameEN && DimFilterValue) {// 验证
		grid2.commitEdit();
		grid2.updateRow(row, {
			DimFilterRelateType : "=",
			DimFieldNameEN : dimvalue,
			RelateType : "=",
			DataFieldName : DataFieldName
		});
	} else {
		epoint.alert("维表过滤字段/值未配置");
	}
}

function saveTemp() {
	epoint.confirm('仅保存指标基础信息', '', saveTempAndClose);
}

function saveTempAndClose() {
	if(!mini.get("normname").getValue()){
		epoint.alert("指标名称不能为空");
		return;
	}
	epoint.execute('saveTemp', 'fui-form', closeCallback);
	return;
}

function saveAndClose() {
	if (epoint.validate()) {
		var type = mini.get('normtype').getValue();
		// 如果是kylin指标，不需要校验其他内容
		if (type == 5) {
			epoint.execute('save', 'fui-form', [ "", "", "", "", "", "", "", "" ],
					closeCallback);
			return;
		}
		var configtype = mini.get('configtype').getValue();
		// api类型
		if (configtype == "3") {
			if (type != "4") {
				var matchArray = mini.get("matchgrid").getData();
				var matchMap = "{";
				for (var i = 0; i < matchArray.length; i++) {
					if (type == "1" && matchArray[i].fieldname == "fieldcount"
							&& matchArray[i].status == "未匹配") {
						epoint.alert("单值指标需要匹配指标值");
						return;
					}
					if (type == "2" && matchArray[i].fieldname == "fielddim"
							&& matchArray[i].status == "未匹配") {
						epoint.alert("多值指标至少需要匹配一个维度字段");
						return;
					}
					if (matchArray[i].status == "匹配成功") {
						matchMap += "\"" + matchArray[i].fieldname + "\":\""
								+ matchArray[i].matchname + "\",";
					}
				}
				matchMap = matchMap.substring(0, matchMap.length - 1);
				matchMap += "}"
				matchMap = JSON.parse(matchMap);
			}

			if (ace.edit("params").getValue() == null
					|| ace.edit("params").getValue() == "") {
				epoint.alert("未填写参数");
				return;
			}
			console.log(matchMap);
			// 保证格式
			// document.getElementById("matchtext1").innerHTML != "匹配成功"
			// 重做
			mini.get("dimtableguid").setValue(null);
			mini.get("dimfieldguid").setValue(null);
			mini.get("groupbytype").setValue(null);
			mini.get("timefieldguid").setValue(null);
			mini.get("timewindow").setValue(null);
			mini.get("statisticsCycle").setValue(null);
			mini.get("isCumsum").setValue(null);
			var headers = mini.get("headers").getValue();
			epoint.execute(
				"save",
				"fui-form",
				[
					"",
					"",
					"",
					JSON.stringify(eval("(" + ajaxParamsEditor.getValue() + ")")),
					ajaxFilterEditor.getValue(),
					matchMap ? matchMap : "",
					JSON.stringify(eval("(" + ajaxResultEditor.getValue() + ")")),
					headers
				],
				closeCallback
			);
		} else {
			if ("1" == type || "4" == type) {
				mini.get("dimtableguid").setValue(null);
				mini.get("dimfieldguid").setValue(null);

			}
			if ("4" == type) {
				mini.get("groupbytype").setValue(null);
				mini.get("timefieldguid").setValue(null);
				mini.get("timewindow").setValue(null);
				mini.get("statisticsCycle").setValue(null);
				mini.get("isCumsum").setValue(null);
			}
			var griddata = grid.getData();
			var dataStr = JSON.stringify(griddata);
			var griddata2 = grid2.getData();
			var dataStr2 = JSON.stringify(griddata2);
			var griddata3 = grid3.getData();
			var dataStr3 = JSON.stringify(griddata3);
			if ("1" == configtype && ("2" == type && griddata2.length < 1)) {
				epoint.alert("组合字段未设置完全");
			} else {
				epoint.execute('save', 'fui-form', [ dataStr, dataStr2,
						dataStr3, "", "", "", "", "" ], closeCallback);
			}
		}
	}
}

// 关闭操作的回调
function closeCallback(data) {
	if (data.error) {
		epoint.alert(data.error, '', null, 'warning');
		return;
	}
	if (data.msg.indexOf("成功") == -1) {
		epoint.alert(data.msg, '', null, null, 'info');
	} else {
		epoint.alertAndClose(data.msg, '', null, null, 'info');
	}
}

// 点击关闭按钮
function onCloseClick(e) {
	var obj = e.sender;
	obj.setText("");
	obj.setValue("");
	ontimefieldvaluechanged(mini.get('timefieldguid'));
	onStatisticsCycleChanged(mini.get('statisticsCycle'));
}

function loadData(e) {
	mini.get('datafieldguid').setValue("");
	mini.get('timefieldguid').setValue("");
	mini.get('dimfieldguid').setValue("");
	epoint.refresh([ 'datasourceid', 'datafieldguid', 'datatableguid',
			'dimfieldguid', 'timefieldguid', 'rightControlField' ]);
	grid.clearRows();
	grid.reload();
	grid2.clearRows();
	grid2.reload();
}

function OnCellBeginEdit(e) {
	var grid = e.sender;
	var field = e.field;
	var editor = e.editor;
	var record = e.record;
	if (field == "DataFieldNameEN") {
		var tableid = mini.get('datatableguid').getValue();
		var url = "cockpitnormaddaction.action?cmd=getFields&tableid="
				+ tableid;
		editor.setUrl(url);
	}
	if (field == "FilterValue") {
		var tableid = mini.get('datatableguid').getValue();
		var DataFieldGuid = record.DataFieldGuid;
		if (!DataFieldGuid || DataFieldGuid == undefined) {
			DataFieldGuid = '';
		}
		var url = "cockpitnormaddaction.action?cmd=getFieldValues&tableid="
				+ tableid + "&DataFieldGuid=" + DataFieldGuid;
		editor.setUrl(url);
	}
}

function onDataFieldGuidValueChanged(e) {
	var combo = e.sender;
	var row = grid.getEditorOwnerRow(combo);
	var editor = grid.getCellEditor("FilterValue", row);
	var id = combo.getValue();
	var tableid = mini.get('datatableguid').getValue();
	var url = "cockpitnormaddaction.action?cmd=getFieldValues&tableid="
			+ tableid + "&DataFieldGuid=" + id;
	editor.setUrl(url);
	editor.setValue("");
}

function loadData2(e) {

	epoint
			.refresh([ 'dimdatasourceid', 'dimtableguid', 'dimvalue', 'dimtext' ]);
}

function OnCellBeginEdit2(e) {
	var field = e.field;
	var editor = e.editor;
	if (field == "DimFilterFieldNameEN") {
		var tableid2 = mini.get('dimtableguid').getValue();
		var url2 = "cockpitnormaddaction.action?cmd=getFields2&tableid2="
				+ tableid2;
		editor.setUrl(url2);
	}
}

function entityChanged(e) {
	mini.get('datatag').setValue("");
	mini.get('dimtag').setValue("");
	grid3.clearRows();
	epoint.refresh([ 'entityguid', 'datatag', 'dimtag', 'tagsortColumnText' ]);
}

function tagResultCountChanged(e) {
	if (e.value) {
		Util.form.showField("#tagSortOrderCon");
		var type = mini.get('normtype').getValue();
		if (type == "4") {
			$("#tagSortColumn").show();
		}
		mini.get('tagsortOrder').setValue("desc");
	} else {
		Util.form.hideField("#tagSortOrderCon");
		$("#tagSortColumn").hide();
		mini.get('tagsortOrder').setValue("");
	}
}

function OnCellBeginEdit3(e) {
	var grid = e.sender;
	var field = e.field;
	var editor = e.editor;
	var record = e.record;
	if (field == "DataFieldNameEN") {
		var entityGuid = mini.get('entityguid').getValue();
		var url = "cockpitnormaddaction.action?cmd=getTagList&entityGuid="
				+ entityGuid;
		editor.setUrl(url);
	}
}

function onDataTagValueChanged(e) {
	var combo = e.sender;
	var row = grid.getEditorOwnerRow(combo);
	var editor = grid.getCellEditor("FilterValue", row);
	var id = combo.getValue();
	var tableid = mini.get('datatableguid').getValue();
	var url = "cockpitnormaddaction.action?cmd=getFieldValues&tableid="
			+ tableid + "&DataFieldGuid=" + id;
	editor.setUrl(url);
	editor.setValue("");
}

function newRow3() {
	var entityguid = mini.get('entityguid').getValue();
	if (!entityguid) {
		epoint.alert('请配置主体！', '', null, 'warning');
		return;
	}
	if (epoint.validate()) {
		grid.commitEdit();
	}
	var row = {};
	grid3.addRow(row, 0);
	grid3.cancelEdit();
	grid3.beginEditRow(row);
}

function onActionRenderer3(e) {
	var grid = e.sender;
	var record = e.record;
	var uid = record._uid;
	var rowIndex = e.rowIndex;

	var s = '<a class="New_Button" href="javascript:newRow3()" style="color:blue;text-decoration:underline;">新增</a>'
			+ '&nbsp;&nbsp;<a class="Edit_Button" href="javascript:editRow3(\''
			+ uid
			+ '\')" style="color:green;text-decoration:underline;">编辑</a>'
			+ '&nbsp;&nbsp;<a class="Delete_Button" href="javascript:delRow3(\''
			+ uid + '\')" style="color:red;text-decoration:underline;">删除</a>';

	if (grid3.isEditingRow(record)) {
		s = '<a class="Update_Button" href="javascript:updateRow3(\''
				+ uid
				+ '\')" style="color:green;text-decoration:underline;">更新</a>'
				+ '&nbsp;&nbsp;<a class="Cancel_Button" href="javascript:cancelRow3(\''
				+ uid
				+ '\')" style="color:red;text-decoration:underline;">删除</a>'
	}
	return s;
}

function editRow3(row_uid) {
	var row = grid3.getRowByUID(row_uid);
	if (row) {
		grid3.cancelEdit();
		grid3.beginEditRow(row);
	}
}

function cancelRow3(row_uid) {
	var row = grid3.getRowByUID(row_uid);
	grid3.removeRow(row, true);

}

function delRow3(row_uid) {
	var row = grid3.getRowByUID(row_uid);
	grid3.removeRow(row, true);
}

function updateRow3(row_uid) {
	var row = grid3.getRowByUID(row_uid);
	grid3.commitEdit();
}

function onTypeChanged(e) {
	var datafieldguid = mini.get('datafieldguid').getValue();
	if (datafieldguid) {
		mini.get('datafieldguid').setValue(null);
	}
	typeChanged(e);
}

var lastDatasourceValue = "1";
function typeChanged(e) {
	var type = mini.get('normtype').getValue();
	var configtype = mini.get('configtype').getValue();
	// 维度来源
	var datasourceid = mini.get("datasourceid").getValue();
	if (datasourceid) {
		mini.get("dimdatasourceid").setValue(datasourceid);
	}
	// 最小值
	mini.get("datafieldguid").setMultiSelect(false);
	Util.form.hideField("#iswarning");
	$("#zblx").hide();
	Util.form.hideField("#groupTypeDiv");
	$("#datasource").hide();
	$("#commonType").hide();
	$(".dim").hide();
	$("#timeDiv").hide();
	$("#timeDiv1").hide();
	$(".seniorType").hide();
	$(".APIType").hide();
	$(".tags").hide();
	if (!grid.getData()) {
		grid.clearRows();
	}
	if (!grid2.getData()) {
		grid2.clearRows();
	}
	if ("5" == type) {// kylin没有配置
		document.getElementById("generatesql").style.width = "100%";
		$("#datasource").show();
		$(".seniorType").show();
		$("#sqlDemoConf").hide();
		$("#prestodatasource").hide();
		$("#modelSqlConf").hide();
	} else if (configtype == "3") {// api
		$("#zblx").show();
		$(".APIType").show();
		$("#prestodatasource").hide();
		initMatchGrid();
	} else if (configtype == "2") {// 高级
		$("#zblx").show();
		document.getElementById("generatesql").style.width = "80%";
		$("#datasource").show();
		$(".seniorType").show();
		$("#sqlDemoConf").show();
		$("#modelSqlConf").hide();
		$("#prestodatasource").hide();
	} else if (configtype == "4") {// 建模
		$("#zblx").show();
		document.getElementById("generatesql").style.width = "80%";
		$("#datasource").hide();
		$(".seniorType").show();
		$("#sqlDemoConf").hide();
		$("#modelSqlConf").show();
		$("#prestodatasource").show();
	} else if (configtype == "5") { // 标签
		$("#zblx").show();
		$(".dim").hide();
		$(".tags").show();
		Util.form.hideField("#tagSortOrderCon");
		var resultCount = mini.get("tagresultCount").getValue();
		if ("1" == type) {
			$("#tagdim").hide();
			$("#tagSortColumn").hide();
			Util.form.showField("#groupTypeDiv");
			if (resultCount) {
				Util.form.showField("#tagSortOrderCon");
			}
		} else if ("2" == type) {
			$("#tagdim").show();
			$("#tagSortColumn").hide();
			Util.form.showField("#groupTypeDiv");
			if (resultCount) {
				Util.form.showField("#tagSortOrderCon");
			}
		} else if ("4" == type) {
			$("#tagdim").hide();
			Util.form.hideField("#groupTypeDiv");
			mini.get("datatag").setMultiSelect(true);
			if (resultCount) {
				Util.form.showField("#tagSortOrderCon");
				$("#tagSortColumn").show();
			}
		}
	} else {
		$("#zblx").show();
		$("#datasource").show();
		$("#commonType").show();
		if ("1" == type) {
			Util.form.showField("#iswarning");
			Util.form.showField("#groupTypeDiv");
			$("#timeDiv").show();
		} else if ("2" == type) {
			addGrid2Row();
			Util.form.showField("#iswarning");
			Util.form.showField("#groupTypeDiv");
			$("#datasource").show();
			$("#commonType").show();
			$(".dim").show();
			$(".tags").hide();
			$("#timeDiv").show();
		} else if ("4" == type) {
			mini.get("datafieldguid").setMultiSelect(true);
		}
		$("#prestodatasource").hide();
	}

	// 如果指标类型修改，且原类型跟现类型只要有一个是kylin指标，则重新获取
	if (lastDatasourceValue != type && (lastDatasourceValue == 5 || type == 5)) {
		lastDatasourceValue = type;
		if (type == 5) {
			mini.get('dataSourceType').setValue("2");
		} else {
			mini.get('dataSourceType').setValue("1");
		}
		epoint.refresh([ 'datasourceid', 'dataSourceType' ]);
	} else {
		lastDatasourceValue = type;
	}
}

// 时间字段值改变事件
function ontimefieldvaluechanged(e) {
	if (e.value) {
		Util.form.showField('#timewindowCon');
		//$("#timeDiv1").show();
		Util.form.showField('#statisticsCycle');
		//mini.get('timewindow').setValue("4");
	} else {
		Util.form.hideField('#timewindowCon');
		$("#timeDiv1").hide();
		Util.form.hideField('#statisticsCycle');
		mini.get('timewindow').setValue("");
		mini.get('statisticsCycle').setValue("");
	}
}

function onTimewindowChanged(e) {
	$("#timeDiv1").show();
	var statisticsCycle = mini.get('statisticsCycle').getValue();
	if (statisticsCycle == 5) {
		statisticsCycle = 3;
	}
	if (statisticsCycle == 6) {
		statisticsCycle = 2;
	}
	if (statisticsCycle == 7) {
		statisticsCycle = 1.5;
	}
	if (statisticsCycle == 8) {
		statisticsCycle = 1.5;
	}
	if (statisticsCycle == 9) {
		statisticsCycle = 1;
	}
	if (e.value && statisticsCycle && statisticsCycle > e.value) {
		mini.get('timewindow').setValue("4");
		epoint.alert('统计周期的时间跨度不可小于时间窗口的时间跨度！', '', null, 'warning');
		return;
	}
}

function onStatisticsCycleChanged(e) {
	if (e.value) {
		var timewindow = mini.get('timewindow').getValue();
		if (e.value == 5) {
			e.value = 3;
		}
		if (e.value == 6) {
			e.value = 2;
		}
		if (e.value == 7) {
			e.value = 1.5;
		}
		if (e.value == 8) {
			e.value = 1.5;
		}
		if (e.value == 9) {
			e.value = 1;
		}
		if (timewindow && timewindow < e.value) {
			mini.get('statisticsCycle').setValue('');
			Util.form.hideField("#isCumsumCon");
			mini.get('isCumsum').setValue("");
			epoint.alert('统计周期的时间跨度不可小于时间窗口的时间跨度！', '', null, 'warning');
			return;
		}
		Util.form.showField("#isCumsumCon");
		mini.get('isCumsum').setValue("0");
	} else {
		Util.form.hideField("#isCumsumCon");
		mini.get('isCumsum').setValue("");
	}
}

function onResultCountChanged(e) {
	if (e.value) {
		Util.form.showField("#sortOrderCon");
		if (mini.get("normtype").getValue() == "4") {
			$('#sortColumn').show();

		}
		mini.get('sortOrder').setValue("desc");
	} else {
		Util.form.hideField("#sortOrderCon");
		$('#sortColumn').hide();
		mini.get('sortOrder').setValue("");
	}
	mini.get('resultCount2').setValue(e.value);
}

function onRightControlChanged(e) {
	if (e.value == '1') {
		Util.form.showField("#rightControlFieldCon");
	} else {
		Util.form.hideField("#rightControlFieldCon");
	}
}

// 打开示例页面
function openSqlDemo() {
	epoint.openDialog('SQL示例',
			"frame/pages/eianalysemis/cockpit/cockpitnorm/cockpitnormsqldemo",
			null, {
				'width' : 1000,
				'height' : 800
			});
}

// 打开图形建模页面
function openModelSql() {

	if (!epoint.validate('normname')) {
		return;
	}

	var datasourceid = mini.get('datasourceidps').getValue();
	if (datasourceid) {
		epoint.execute('getFlowGuid', 'fui-form', '', function(data) {
			if (data.msg) {
				epoint.alert(data.msg);
			}
			if (data.flowGuid) {
				mini.get('flowguid').setValue(data.flowGuid);
				mini.get('flowJdbcUrl').setValue(data.jdbcUrl);
				var dxpRestUrl = "";
				if (data.dxpRestUrl) {
					dxpRestUrl = data.dxpRestUrl;
				}
				window.open(dxpRestUrl
						+ "/dxp/datamodel/modelflow/eia_model?flowGuid="
						+ data.flowGuid);
				// epoint.openTopDialog('图形配置', dxpRestUrl
				// + "/dxp/datamodel/modelflow/eia_model?flowGuid="
				// + data.flowGuid, function() {
				// epoint.execute('getPrestoSql','',data.flowGuid,function(sql){
				// mini.get('generatesql').setValue(sql);
				// });
				// });
			} else {
				epoint.alert('flowguid生成出错！');
			}
		});
	} else {
		epoint.alert('请选择来源库！');
	}
}

$('#generatesql').on('click', function(e) {
	if (mini.get('configtype').getValue() == '4') {
		var flowguid = mini.get('flowguid').getValue();
		if (flowguid) {
			epoint.execute('getPrestoSql', '', flowguid, function(sql) {
				mini.get('generatesql').setValue(sql);
			});
		}
	}
});

// 选择树
var datatree = mini.get('datatableguid');
datatree.on("beforenodeselect", function(e) {
	if (e.node.pid == 'f9root') {
		e.cancel = true;
	}
});

var dimtree = mini.get('dimtableguid');
dimtree.on("beforenodeselect", function(e) {
	if (e.node.pid == 'f9root') {
		e.cancel = true;
	}
});

var haspop = false;
function checkDataTableGuid() {
	if (!haspop && !getTable()) {
		epoint.alert('请配置数据来源！', '', null, 'warning');
		haspop = true;
		return;
	}
	haspop = false;
}

function checkDimTableGuid() {
	if (!getTableDim()) {
		epoint.alert('请配置维度来源！', '', null, 'warning');
		return;
	}
}

function beforenodeselect(e) {
	// 禁止选中 ckr=false节点
	if (e.node.ckr == false) {
		e.cancel = true;
	}
}

function datasourceChanged(e) {
	// 如果是kylin指标，不需要控制其他控件的显隐
	if (lastDatasourceValue == 5) {
		return;
	}
	var datasourceid = mini.get("datasourceid").getValue();
	if (datasourceid) {
		mini.get("dimdatasourceid").setValue(datasourceid);
	}
	grid.clearRows();
	grid2.clearRows();
	mini.get('datatableguid').setValue("");
	mini.get('datafieldguid').setValue("");
	mini.get('timefieldguid').setValue("");
	epoint.refresh([ 'datasourceid', 'datatableguid' ]);
	mini.get('dimtableguid').setValue("");
	mini.get('dimfieldguid').setValue("");
	epoint.refresh([ 'dimdatasourceid', 'dimtableguid', 'dimFilterFieldGuid' ]);
}
function checkSortColumn() {
	var normtype = mini.get("normtype").getValue();
	if ("4" == normtype) {
		mini.get("sortColumnText").setValue(null);
		epoint.refresh([ 'datasourceid', 'datafieldguid', 'datatableguid',
				'sortColumn' ]);
	}
}
// api类型
// 初始化超文本框
var ajaxParamsEditor = ace.edit("params");
ajaxParamsEditor.setTheme('ace/theme/xcode');
ajaxParamsEditor.getSession().setMode("ace/mode/json");
ajaxParamsEditor.setFontSize(14);
var ajaxFilterEditor = ace.edit("resultFilter");
ajaxFilterEditor.setTheme('ace/theme/xcode');
ajaxFilterEditor.setFontSize(14);
ajaxFilterEditor.getSession().setMode("ace/mode/javascript");
ajaxFilterEditor.setValue("//result = result.result;");
var ajaxResultEditor = ace.edit("apiResult");
ajaxResultEditor.setTheme('ace/theme/xcode');
ajaxResultEditor.getSession().setMode("ace/mode/json");
ajaxResultEditor.setFontSize(14);
function onAPISelected() {
	epoint.openDialog("选择服务",
			'frame/pages/eianalysemis/cockpit/cockpitapi/cockpitapiselect',
			function(data) {
				if (data != "close") {
					epoint.execute("getApiInfo", '@none', data, loadApiInfo);
				}
			}, {
				'width' : 1280,
				'height' : 800
			});
}
var apiurl = "";
var requestType = "";
var contentType = "";
function loadApiInfo(data) {
	if(data.length < 3){
		return;
	}
	data = JSON.parse(data);
	text = data.name + ', ' + data.url;
	mini.get("API").setValue(data.id);
	mini.get("API").setText(text);
	apiurl = data.url;
	requestType = data.requestType;
	contentType = data.contentType;
}
// 调用服务，如果是结果过滤调用的，调用完后执行过滤器。
function callApi(filter) {

	requestType = requestType == '1' ? 'get' : 'post';
	if (requestType == 'get') {
		data = {};
	} else {
		data = JSON.stringify(eval('(' + ajaxParamsEditor.getValue() + ')'));
	}
	var apiguid = mini.get("API").getValue();
	// 走后台调用
	// if (contentType == '0') {
	// 	data = "params=" + data;
	// }
	var headers = mini.get("headers").getValue();
	epoint.execute("callApi", "@none", [ apiguid, data, headers ], function(data) {
		if (data.error) {
			epoint.alert(data.error);
		} else {
			epoint.alert(data.msg);
			editor = ace.edit("apiResult");
			editor.setValue(js_beautify(data.result));
			if (filter == 1) {
				initFilter();
			}
		}
	});

}
// 结果过滤，为过滤器添加代码、然后执行调用服务。
function applyFilter() {
	var t = ace.edit("resultFilter").getValue();
	t = "function initFilter(){"
			+ "var result = JSON.parse(ace.edit(\"apiResult\").getValue());"
			+ t
			+ "ace.edit(\"apiResult\").setValue(js_beautify(JSON.stringify(result)));}";
	var el = document.createElement("script");
	var result = document.getElementById("resultScipt");
	el.innerHTML = t;
	for (var i = 0; i < result.childNodes.length; i++) {
		result.removeChild(result.childNodes[0]);
	}
	result.appendChild(el);
	callApi(1);
}
// 初始化映射
function initMatchGrid() {
	var matchgrid = mini.get("matchgrid");
	matchgrid.clearRows();
	var rows = [ {
		fieldname : "fieldcount",
		fielddisplayname : "指标值",
		status : "未匹配"
	}, {
		fieldname : "fielddim",
		fielddisplayname : "维度1",
		status : "未匹配"
	}, {
		fieldname : "fielddim2",
		fielddisplayname : "维度2",
		status : "未匹配"
	}, {
		fieldname : "fielddim3",
		fielddisplayname : "维度3",
		status : "未匹配"
	}, {
		fieldname : "fielddim4",
		fielddisplayname : "维度4",
		status : "未匹配"
	}, {
		fieldname : "fielddim5",
		fielddisplayname : "维度5",
		status : "未匹配"
	}, {
		fieldname : "fieldtimewindow",
		fielddisplayname : "时间窗口",
		status : "未匹配"
	}, ];
	var normType = mini.get("normtype").getValue();
	if (normType == "4") {
		return;
	}
	for (var i = 0; i < 7; i++) {
		if (i > maxDimNum && i != 6) {
			continue;
		}
		matchgrid.addRow(rows[i], i);
		if (i == 0 && normType == "1") {
			i = 5;
		}
	}
	matchgrid.on("cellendedit", function(e) {
		var result = ace.edit("apiResult").getValue();
		if (result != null && result != "") {
			result = JSON.parse(result)[0];
		}
		var row = e.row;
		matchgrid.updateRow(row, {
			status : result.hasOwnProperty(e.value) ? "匹配成功" : "未匹配"
		})
	});
}
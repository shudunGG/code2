//tab对象
var tabs = mini.get("tabs");

var grid = mini.get('datagrid');

var clickColumn;

var layout = mini.get("layout");

var startIndex = 0;
var searchIndex = -1;
var maxIndex = 0;
var isShowMenu = false;

// 视图列表
var gridview = mini.get("datagridview");

// 遍历tabs，更新tab的url
grid.on("select", function(e) {
	var tabs = mini.get("tabs");
	var tabArray = tabs.tabs;
	var tab = tabs.getActiveTab();
	for (var i = 0, len = tabArray.length; i < len; i++) {
		var url = subUrl + "?tableId=" + tabArray[i].id + "&recordGuid=" + e.record.recordguid + "&fatherTableId=" + mini.get("tableId").getValue();
		tabArray[i].url = url;
		tabs.reloadTab(tabArray[i]);
	}
	tabs.reloadTab(tab);
});

//行双击跳转详情表
grid.on("rowdblclick",function(e){
	var url = detailUrl;
	epoint.execute('getPersonalUrlByType', 'fui-form', ["detail"], function (data){
		if(data && data.url){
			url = data.url;
		}
		epoint.openTopDialog('详细信息表', url + "?tableId=" + mini.get("tableId").getValue() +"&tableName="+mini.get("tableName").getValue()+"&rowGuid=" + e.record.recordguid,
				function(data) {}, {
					'width' : 1000,
					'height' : 600
		});
	});
});

// 绘制动态列
function drawDynamicColumn(columns) {
	grid.setColumns(columns);
	searchData();
}

// 表格的搜索
function searchData() {
	// 获取查询区域的值并赋值给params
	if(fieldMaps){
		$.each(fieldMaps, function(k, v){
			var control = mini.get(k);
			if(control){
				fieldMaps[k] = control.getValue();
			}
		});
		params.setValue(JSON.stringify(fieldMaps));
	}
	epoint.refresh([ 'datagrid', 'fui-form', 'datagridview' ],function(){
		if(isShowMenu){
			$(".view").hide();
			$(".menu").show();
		}else{
			$(".view").show();
			$(".menu").hide();
		}
		
	});
}

// 锁定列
function frozenColumns(e) {
	var coloumn = grid.getColumn("check");
	console.log(coloumn);
	var start = 0;
	if(!coloumn.visible){
		start = 1;
	}
	grid.frozenColumns(start, clickColumn._index);
}

// 解锁列
function unFrozenColumns(e) {
	grid.unFrozenColumns();
}

// 定位右键菜单
grid.on('headercellcontextmenu', function(e) {
	mini.get("headerMenu").showAtPos(e.htmlEvent.pageX, e.htmlEvent.pageY);
	clickColumn = e.column;
});

// 人员查找
function searchColumn(data, startIndex) {
	var searchName = data.searchName;
	var searchText = data.searchText;
	var isBlur = data.isBlur;
	var type = data.type;

	var list = grid.getList();

	// 判断是查找第一行还是查找下一行
	if (type == 1) {
		startIndex = 0;
		searchIndex = -1;
	}
	if (searchIndex != -1 && type == 0) {
		startIndex = searchIndex;
	}

	// 判断起始行
	if (startIndex >= list.length) {
		startIndex = 0;
	}

	for (var i = startIndex, length = list.length; i < length; i++) {
		var row = grid.getRow(i);
		var column = grid.getColumn(searchName);
		// 判断是否是代码项
		var text = list[i][searchName + "_text"];
		if (typeof (text) == "undefined") {
			text = list[i][searchName];
		}

		if (!isNaN(text)) {
			text = text.toString();
		}

		if (!isNaN(searchText)) {
			searchText = searchText.toString();
		}

		// 模糊查询
		if (isBlur == "true") {
			if (text.indexOf(searchText) != -1) {
				searchIndex = i + 1;
				grid.setCurrentCell([ row, column ]);
				break;
			}
		}
		// 精确查询
		else {
			if (text == searchText) {
				searchIndex = i + 1;
				grid.setCurrentCell([ row, column ]);
				break;
			}
		}
	}
};

function getMaxIndex(){
	var userName = mini.get("userName").getValue();
	var list = grid.getList();
	for (var i = (list.length - 1), length = list.length; i >= 0; i--) {
		var row = grid.getRow(i);
		var column = grid.getColumn("A0101");
		var text = list[i]["A0101"];
	    if (text.indexOf(userName) != -1) {
	    	maxIndex = i;
			break;
		}
	}
};


function getChecked() {
	var checked = {};
	// 获取选中单元格
	var cell = grid.getCurrentCell();

	if (cell != null) {
		checked.id = cell[1].name;
		checked.text = cell[1].header;
		checked.index = grid.indexOf(cell[0]);
	}
	return checked;
};


function checkTableSelect(){
	var tableSelect = mini.get("tableId").getValue();
	if(!tableSelect){
		epoint.alert("请先选择业务主表！");
		return false;
	}else{
		return true;
	}
};

function appearCondition(data) {
	var html = epoint.parseForm(data.controls);
	console.log(html);
	$('#fui-form').prepend(html);
	initCondition();
};

var person = {
	// 简单查询
	simpleSearch : function() {
		if(!checkTableSelect()){
			return;
		}
		var isEdit = grid.isEditing();
		if(isEdit){
			epoint.confirm('确认是否保存', '保存确认', function () {
				var condition = mini.get("simpleCondition").getValue();
				var schemeGuid = mini.get("schemeCombobox").getValue();
				epoint.openTopDialog('简单查询', "framemanager/metadata/mis/datamanage/search/simplesearch/simplesearch?simpleCondition=" + condition + "&schemeGuid=" + schemeGuid + "&tableId=" + mini.get("tableId").getValue(),
						function(data) {
							if (data != "close") {
								var rtn = data.split(";")
								mini.get("simpleCondition").setValue(Base64.encode(top.epoint.encodeUtf8(rtn[0])));
								mini.get("schemeCombobox").setValue(rtn[1]);
								searchData();
							}
						}, {
							'width' : 1000,
							'height' : 800
						});
			});
		}else{
			var condition = Base64.encode(top.epoint.encodeUtf8(mini.get("simpleCondition").getValue()));
			var schemeGuid = mini.get("schemeCombobox").getValue();
			epoint.openTopDialog('简单查询', "framemanager/metadata/mis/datamanage/search/simplesearch/simplesearch?simpleCondition=" + condition + "&schemeGuid=" + schemeGuid+ "&tableId=" + mini.get("tableId").getValue(),
					function(data) {
						if (data != "close") {
							var rtn = data.split(";");
							mini.get("simpleCondition").setValue(Base64.encode(top.epoint.encodeUtf8(rtn[0])));
							mini.get("schemeCombobox").setValue(rtn[1]);
							searchData();
						}
					}, {
						'width' : 1000,
						'height' : 800
					});
		}
		
	},

	// 高级查询
	commonSearch : function() {
		if(!checkTableSelect()){
			return;
		}
		var isEdit = grid.isEditing();
		if(isEdit){
			epoint.confirm('确认是否保存', '保存确认', function () {
				var condition = mini.get("commonCondition").getValue();
				var schemeGuid = mini.get("schemeCombobox").getValue();
				epoint.openTopDialog('通用查询', "framemanager/metadata/mis/datamanage/search/commonsearch/commonsearch?commonCondition=" + condition + "&schemeGuid=" + schemeGuid + "&tableId="+ mini.get("tableId").getValue(),
						function(data) {
							if (data != "close") {
								var rtn = data.split(";")
								var condition = "";
								if (rtn[0] != null && rtn[0] != '' && rtn[2] != null && rtn[2] != "") {
									condition = rtn[0] + ";" + rtn[2];
								}
								mini.get("commonCondition").setValue(condition);
								mini.get("schemeCombobox").setValue(rtn[1]);
								searchData();
							}
						}, {
							'width' : 1000,
							'height' : 800
						});	
			});
		}else{
			var condition = Base64.encode(top.epoint.encodeUtf8(mini.get("commonCondition").getValue()));
			var schemeGuid = mini.get("schemeCombobox").getValue();
			epoint.openTopDialog('通用查询', "framemanager/metadata/mis/datamanage/search/commonsearch/commonsearch?commonCondition=" + condition + "&schemeGuid=" + schemeGuid + "&tableId="+ mini.get("tableId").getValue(),
					function(data) {
						if (data != "close") {
							var rtn = data.split(";")
							var condition = "";
							if (rtn[0] != null && rtn[0] != '' && rtn[2] != null && rtn[2] != "") {
								condition = rtn[0] + ";" + rtn[2];
							}
							mini.get("commonCondition").setValue(Base64.encode(top.epoint.encodeUtf8(condition)));
							mini.get("schemeCombobox").setValue(rtn[1]);
							searchData();
						}
					}, {
						'width' : 1000,
						'height' : 800
					});	
		}
	},

	// 显示方案改变
	showSchemeChange : function() {
		if(!checkTableSelect()){
			return;
		}
		var schemeGuid = mini.get("schemeCombobox").getValue();
		window.location.href = personUrl + "&schemeGuid=" + schemeGuid;
	},

	// 显示方案管理
	showSchemeManage : function() {
		if(!checkTableSelect()){
			return;
		}
		epoint.openTopDialog('方案管理', "framemanager/metadata/mis/datamanage/basedataconfig/displayscheme/schemeshowlist?schemeType=" + schemeType + "&tableId="+mini.get("tableId").getValue(),
				function(data) {
					epoint.refresh([ 'schemeGuid', 'schemeCombobox' ]);	
				}, {
					'width' : 1000,
					'height' : 800
				});
	},

	// 表显示方案管理
	tableSchemeManage : function() {
		if(!checkTableSelect()){
			return;
		}
		epoint.openTopDialog('表方案管理', "framemanager/metadata/mis/datamanage/basedataconfig/tablescheme/schemetableshowmanage?tableId="+mini.get("tableId").getValue(), function(data) {
			searchData();
		}, {
			'width' : 1000,
			'height' : 800
		});
	},

	// 排序方案管理
	orderSchemeManage : function() {
		if(!checkTableSelect()){
			return;
		}
		// var tab = mini.get("tabs").getActiveTab();
		epoint.openTopDialog('排序管理', "framemanager/metadata/mis/datamanage/basedataconfig/orderscheme/schemeorderlist?tableId="+mini.get("tableId").getValue(), function(data) {
			epoint.refresh([ 'orderSchemeGuid', 'orderSchemeCombobox' ]);
		}, {
			'width' : 1000,
			'height' : 800
		});
	},

	// 人员状态，排序方案
	searchChange : function() {
		if(!checkTableSelect()){
			return;
		}
		mini.get("orderSchemeGuid").setValue(mini.get("orderSchemeCombobox").getValue());
		searchData();
	},
	
	clearCondition: function(){
		mini.get("simpleCondition").setValue("");
		mini.get("commonCondition").setValue("");
		searchData();
	}

}

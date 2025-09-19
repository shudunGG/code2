/*
 * add页面通用js
 * @Author: liub 
 * @Date: 2019-06-14 17:07:01 
 * @Last Modified by: liub
 * @Last Modified time: 2019-06-15 13:57:05
 */
(function(win) {
	var action = win.epointsformaddactionname || 'sformdesigncommonaddaction';
	var datagrid;

	epoint.initPage(action+win.epointsformurl, 'fui-form', initCallBack);

	// 初始化页面回调
	function initCallBack(data) {

		if (data.gridid) {
			datagrid = mini.get(data.gridid);
			var isadd = true; // 是否可新增
			if (isadd && datagrid.data.length == 0) {
				var newRow = {
					rowname : "New Row"
				};
				// 使用data的长度，控制新增一行时始终在最下面一行
				var row = datagrid.data.length;
				datagrid.addRow(newRow, row);
			}
		}

		if (win.initPageControl) {
			initPageControl(data);
		}
	}

	// 保存表单
	var saveForm = function() {
		if (datagrid != "" && datagrid != null && datagrid != undefined) {
			if (datagrid.validate()) {
				return;
			}
		}
		if (epoint.validate()) {
			epoint.execute('saveForm', 'fui-form', function(data) {
				if (data.msg) {
					if (data.isSuccess == 1) {
						epoint.alertAndClose(data.msg);
					} else if (data.isSuccess == 2) {
						epoint.alertAndClose(data.msg);
					} else {
						epoint.alert(data.msg);
					}

				}
			});
		}
	};
	// 子表新增一条空记录
	var addRow = function(gridId) {
		epoint.execute('addRow', gridId, [ gridId ], refreshGrid);
	};
	// 子表删除一条记录
	var delRow = function(gridId, rowId) {
		epoint.execute('delRow', gridId, [ gridId, rowId ], refreshGrid);
	};
	// 刷新子表数据
	var refreshGrid = function(data) {
		if (data && data.gridId) {
			epoint.refresh(data.gridId);
		}
	};

	win.saveForm = saveForm;
	win.addRow = addRow;
	win.delRow = delRow;
})(this);
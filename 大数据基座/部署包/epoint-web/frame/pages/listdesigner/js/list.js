(function(win) {
	var action = win.epointlistactionname || 'listcommonaction';

	var addPageUrl = win.addPageUrl;
	var editPageUrl = win.editPageUrl;
    var searchid;
	var grid = mini.get('datagrid');

	epoint.initPage(action, '@all', initCallBack);

	// 初始化页面回调
	function initCallBack(data) {
        if(data.searchid){
            searchid=data.searchid;
        }
        /*隐藏fui-condition区域*/
        if(data.display && data.display==1){
            var fuicondition=document.getElementsByClassName('fui-condition');
            if(fuicondition && fuicondition.length>0){
                fuicondition[0].style.display = "none";
            }
		}
	};

	var openDialog = function(title, url, callback, opt, openType) {
		switch (openType) {
		case 'dialog':
			epoint.openDialog(title, url, callback, opt);
			break;
		case 'fulldialog':
			epoint.openTopDialog(title, url, callback, {
				width : 1920,
				height : 1080
			});
			break;
		case 'blank':
		default:
			var opts = '';
			if (opt.width) {
				opts += 'width=' + parseInt(opt.width, 10);
			}
			if (opt.height) {
				opts += ',height=' + parseInt(opt.height, 10);
			}
			if (opts.indexOf(',') === 0) {
				opts = opts.substr(1);
			}
			win.open(url, '', opts);
			break;

		}
	};

	// 打开新增dialog
	var openAddDialog = function(title, url, openType, opt) {
		openDialog(title, url, refreshGrid, opt, openType);
	};
	// 打开修改dialog
	var openModifyDialog = function(url, guid) {

		if (!guid) {
			var selects = grid.getSelecteds();

			if (selects.length === 0) {
				epoint.alert("请先选择要修改的记录！");
				return;
			}

			if (selects.length > 1) {
				epoint.alert("一次只能修改一条记录！</br>请确保只选择了一条记录！");
				return;
			}

			guid = selects[0][grid.idField];
		}

		if (url.indexOf('?') > 0) {
			url += '&rowGuid=' + guid;
		} else {
			url += '?rowGuid=' + guid;
		}

		epoint.openDialog('修改记录', url, refreshGrid);
	};
	// 删除行
	var delRow = function(tip) {
		var selects = grid.getSelecteds();

		if (selects.length === 0) {
			epoint.alert("请先选择要删除的记录！");
			return;
		}
		epoint.confirm(tip, '', function() {
			epoint.execute('delRow', 'datagrid', refreshGrid);
		});

	};
	// 保存表格
	var saveGrid = function() {
		grid.validate();

		if (!grid.isValid()) {
			var error = grid.getCellErrors()[0];
			grid.beginEditCell(error.record, error.column);
			return;
		}

		epoint.execute('saveGrid', 'datagrid', function(data) {
			var msg = data.msg;
			if (msg) {
				if (data.success) {
					epoint.alert(msg, '', '', 'success');
				} else {
					epoint.alert(msg, '', '', 'warning');
				}
			}

		});
	};
	// 刷新搜索表格
	var refreshGrid = function() {
		epoint.refresh();
	};

	var searchData = function() {
		var searchArea = "[";
		var form = new mini.Form('fui-form');
		var controls = form.getFields();
		for (var n = 0; controls.length > 0 && n < controls.length; n++) {
			searchArea += "{'id':'" + controls[n].id + "','value':'"
					+ controls[n].value + "'},";
		}
		if (searchArea.length > 1) {
			searchArea = searchArea.substring(0, searchArea.length - 1);
		}
		searchArea += "]";
		mini.get("params").setValue(searchArea);
		epoint.refresh([ 'datagrid', 'params' ]);
	};

	var startProcess = function(processGuid) {
		var url = "frame/pages/epointworkflow/client/processcreateinstance?ProcessGuid="
				+ processGuid;
		if (!processGuid) {
			epoint.alert("没有可启动的流程！", null, null, 'error');
			return false;
		}
		epoint.openTopDialog("新建工作流程", url, refreshGrid);
	};

	var callback = function callback(data) {
		if (data.msg) {
			epoint.alert(data.msg, '', refreshGrid);
		}
	}

    var tree = mini.get("tree");
    if(tree) {
    	tree.on('nodeclick', function(e) {
            // 获取点击节点的id
            var id = e.node.id;
            if(searchid){
                if (id!='f9root'){
                    mini.get(searchid).setValue(id);
                }else {
                    mini.get(searchid).setValue("");
    			}
            }
            searchData();
        });
    }

	win.openAddDialog = openAddDialog;
	win.openModifyDialog = openModifyDialog;
	win.delRow = delRow;
	win.saveGrid = saveGrid;
	win.refreshGrid = refreshGrid;
	win.searchData = searchData;
	win.startProcess = startProcess;
	win.callback = callback;
})(this);
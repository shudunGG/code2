function setControlsAccessRight(data) {
	if (data && data.accessRight) {
		var json = epoint.decodeJson(data.accessRight);
		var tableid = epoint.decodeJson(data.tableId);
		var gridid = data.gridid;
		for ( var id in json) {
			// 用于表单设计器中
			// var newid=id+"_"+tableid;
			// 过滤掉子列表控件id
			if (id.indexOf("SubTable_") == -1) {
				var controlobject = mini.getByName(id.toLowerCase());
			}
			try {
				if (controlobject) {
					var $label = $(controlobject.el).parent().prev("div,label");
				}
				switch (json[id]) {
				case "readonly":
					if (id.indexOf("SubTable_") != -1 && gridid) {
						var grids = gridid.split("_");
						var subid = grids[1];
						document.getElementById(subid + "Add").style.display = "none";
						document.getElementById(subid + "Del").style.display = "none";
						mini.get(gridid).hideColumn("edit");
						mini.get(gridid).hideColumn("check");
						mini.get(gridid).hideColumn("subdel");
						mini.get(gridid).allowCellEdit = false;

					}
					controlobject.disable();

					break;
				case "required":
					controlobject.setRequired(true);
					controlobject.setRequiredErrorText("不能为空!");
					// 增加label文字的星号。表单布局需要固定，add by xiaolong 20170425
					if ($label.length && $label.text() !== ""
							&& $label.text().indexOf('*') == -1) {
						var text = $label.text();
						$label.html('<span style="color:#f81f1f">* </span>'
								+ text);
					}
					break;
				case "hidden":
					if ($label.length)
						$label.hide();
					controlobject.hide();
					if (id.indexOf("SubTable_") != -1 && gridid) {
						var grids = gridid.split("_");
						var subid = grids[1];
						document.getElementById(subid + "Add").style.display = "none";
						document.getElementById(subid + "Del").style.display = "none";
						mini.get(gridid).hideColumn("edit");
						mini.get(gridid).hideColumn("check");
						mini.get(gridid).hideColumn("subdel");
						mini.get(gridid).allowCellEdit = false;
					}
					break;
				}
			} catch (e) {
			}
		}
	}
}

function setControlsAccessRight(data) {
	if (data && data.accessRight) {
		var json = epoint.decodeJson(data.accessRight);
		var tableId = data.tableId;
		for ( var id in json) {
			var controlobject = mini.get(id+"_"+tableId);
			if (!controlobject)
				continue;
			try {
				var $label = $(controlobject.el).parent().prev("div,label");
				switch(json[id]){
					case "readonly":
						controlobject.disable();
						break;
					case "required":
						controlobject.setRequired(true);
						controlobject.setRequiredErrorText("不能为空!");
						// 增加label文字的星号。表单布局需要固定，add by xiaolong 20170425						
						if($label.length && $label.text() !== "" &&  $label.text().indexOf('*') == -1 ) {
							var text = $label.text();
							$label.html('<span style="color:#f81f1f">* </span>' + text);
						}
						break;
					case "hidden":
						if($label.length)
							$label.hide();
						controlobject.hide();
						break;
				}				
			} catch (e) {
			}
		}
	}
}

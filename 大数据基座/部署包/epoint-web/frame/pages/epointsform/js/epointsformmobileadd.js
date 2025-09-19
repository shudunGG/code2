$(function() {
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
			if (epointm.validate("sform")) {
			    epointm.execute('saveForm', 'form', '', closeCallback);
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
				var form = new CommonDto('@all');
				try{
					var formData = [];
					for (var i = 0, len = msg.formData.length; i < len; i++) {
						if(msg.formData[i].id == 'tableId' || msg.formData[i].id == 'rowGuid'){
							continue;
						}
						var item = {};
						item.id = msg.formData[i].id;
						item.value = msg.formData[i].value;
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
				if (epointm.validate("sform")) {
					msg.validateTag = true;
				} else {
					msg.validateTag = false;
				}
				messenger.targets['parent'].send(JSON.stringify(msg));
			} catch(e) {
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
	
	epointm.initPage(window.epointsformaddactionname, '', initCallBack);

	var tableId;
	
	function getFormData() {
		var form = new CommonDto('@all');
		
		if (form && form.getData() && form.getData().commonDto) {
			var fields = JSON.parse(form.getData().commonDto);
			var formData = [];
			for (i in fields) {
				if(!fields[i].id){
					continue;
				}
				
				var control = {};
				if (fields[i].id == 'tableId' || fields[i].id == 'rowGuid') {
					control.id = fields[i].id;
					control.fieldName = fields[i].id;
					control.fieldCNName = fields[i].id;
					control.value = fields[i].value;
					formData.push(control);
					continue;
				} else if(!fields[i].type || fields[i].type == 'hidden') {
					continue;
				}
				
				if(fields[i].dataOptions){
					var dataOptions = {};
					try {
						var dataOptions = fields[i].dataOptions;
					} catch(ee1){
					}
					
					try {
						if(dataOptions && dataOptions.fieldName){
							control.fieldName = dataOptions.fieldName;
						}else{
							control.fieldName = fields[i].id;
						}
					} catch(ee2){
						control.fieldName = fields[i].id;
					}
					
					try {
						if(dataOptions && dataOptions.fieldCNName){
							control.fieldCNName = dataOptions.fieldCNName;
						}else if(dataOptions && dataOptions.fieldName){
							control.fieldCNName = dataOptions.fieldName;
						}else{
							control.fieldCNName = fields[i].id;
						}
					} catch(ee3){
						control.fieldCNName = fields[i].id;
					}
					
				} else {
					control.fieldName = fields[i].id;
					control.fieldCNName = fields[i].id;
				}
				
				control.id = fields[i].id;
				
				if (fields[i].value) {
					control.value = fields[i].value;
				} else {
					control.value = '';
				}
				
				formData.push(control);
			}
			return formData;
		} else {
			return null;
		}
	}

	function initCallBack(data) {
		//控制按钮显隐（外部调用时隐藏）
		if (data && data.isShowBtn && data.isShowBtn == "false") {
			document.getElementById("butList").style.display = "none";
		}
		
		if (data && data.error) {
			if (!epointsform.getUrlParams().isShowButton) {
			//if (!Util.getUrlParams().isShowButton) {
				var msg = {};
				msg.handleType = "init";
				msg.error = data.error;
				messenger.targets['parent'].send(JSON.stringify(msg));
			}
			return;
		}

		if (!data) {
			if (!window.isfirstpageload && !epointsform.getUrlParams().isShowButton) {//Util.getUrlParams().isShowButton
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
			console.log(data.map.reMap);
			for (var m = 0; data.map.reMap.length > 0
					&& m < data.map.reMap.length; m++) {
				var id = data.map.reMap[m].id;
				var value = data.map.reMap[m].value;
				if(document.getElementById(id)){
					document.getElementById(id).value = value;
				}
			}
		}
		if (!window.isfirstpageload && epointsform.getUrlParams().isShowButton != 'true') {
			window.isfirstpageload = true;
			var msg = {};
			msg.handleType = "init";
			var data = getFormData();
			if (data) {
				msg.formData = data;
			} else {
				msg.formData = [];
			}
			//msg.height = $('body').height();
			msg.iframeId = 'epointsformIframe';
			messenger.targets['parent'].send(JSON.stringify(msg));
		}
	}

	// 本页面按钮调用保存，非跨域
	window["saveForm"] = function() {
		if (epointm.validate("sform")) {
		    epointm.execute('saveForm', 'form', '', function(data){
				if (data.msg) {
					epointm.alert(data.msg);
					//epoint.alertAndClose(data.msg);
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
			document.getElementById("rowGuid").value = data.rowGuid;
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

	window["add"] = function() {
		epointm.execute('add', '', '', searchData);
	}

	window["del"] = function() {
		epointm.execute('del', '', '', searchData);
	}

	window["searchData"] = function (data) {
		epointm.refresh('dataGrid');
	}

	window["refreshControl"] = function () {
		epointm.refresh(['form']);
	}
})
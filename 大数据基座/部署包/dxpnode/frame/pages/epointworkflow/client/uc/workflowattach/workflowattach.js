var urlparams = Util.getUrlParams();

mini.WorkflowAttach = function() {
	mini.WorkflowAttach.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.WorkflowAttach, mini.UserControl, {
	// 定义控件的className
	uiCls : "uc-workflowattach",
	// 模板的地址，路径默认从webapp开始
	tplUrl : 'frame/pages/epointworkflow/client/uc/workflowattach/workflowattach.tpl',

	// 初始化方法，将内部需要设值取值的控件缓存到this.controls中
	init : function() {
		var that = this;
		this.controls.datagrid = mini.get(this.id + '_attachdatagrid');
		this.controls.outputtext = mini.get(this.id + '_attachoutput');
	},

	getValue : function() {
		return "";
	},
	setData : function(data) {
		var json = epoint.decodeJson(data);
		if(json.total&&json.total>0){
			this.controls.outputtext.setVisible(false);
			this.controls.datagrid.setData(json.data);
			this.controls.datagrid.setTotalCount(json.total);
		}
		else{
			this.controls.datagrid.setVisible(false);
		}
	}
});

mini.regClass(mini.WorkflowAttach, "workflowattach");

function onAttachEdit(e){
	if(urlparams.handleType && urlparams.handleType == "2") return;
	return epoint.renderCell(e, "action-icon icon-gear", "editAttachs","materialguid,pviguid,workitemguid");
}

//弹出材料窗口
function editAttachs(data) {
	epoint.openDialog("附件管理",
			'frame/pages/epointworkflow/client/activityattachlist?materialGuid='
					+ data.materialguid + "&processVersionInstanceGuid=" + data.pviguid + "&workItemGuid=" + data.workitemguid, callBack, {
				'width' : 1000,
				'height' : 500
			});
}

// 回调刷新
function callBack(param) {
	if (param) {
		epoint.refresh(['workflowattach']);
	}
}

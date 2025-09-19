
mini.WorkflowHistory = function() {
	mini.WorkflowHistory.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.WorkflowHistory, mini.UserControl, {
	// 定义控件的className
	uiCls : "uc-workflowhistory",
	// 模板的地址，路径默认从webapp开始
	tplUrl : 'frame/pages/epointworkflow/client/uc/workflowhistory/workflowhistory.tpl',

	// 初始化方法，将内部需要设值取值的控件缓存到this.controls中
	init : function() {
		var that = this;
		this.controls.datagrid = mini.get(this.id + '_datagrid');
	},

	getValue : function() {
		return "";
	},
	setData : function(data) {
		var json = epoint.decodeJson(data);
		this.controls.datagrid.setData(json.data);
		this.controls.datagrid.setTotalCount(json.total);
	}
});

mini.regClass(mini.WorkflowHistory, "workflowhistory");

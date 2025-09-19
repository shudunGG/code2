mini.DBWorkflow = function() {
	mini.DBWorkflow.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.DBWorkflow, mini.UserControl, {
	// 定义控件的className
    uiCls: "uc-dbworkflow",
    // 模板的地址，路径默认从webapp开始
    tplUrl: 'js/uc/dbworkflow/dbworkflow.tpl',
    // css文件资源路径
    cssUrl: 'js/uc/dbworkflow/dbworkflow.css',
    
    // 初始化方法，将内部需要设值取值的控件缓存到this.controls中
	init: function(){
		this.controls.biaoduanname = mini.get(this.id + '_biaoduanname');
    	this.controls.fabaocontent = mini.get(this.id + '_fabaocontent');
    	this.controls.jiaohuodate = mini.get(this.id + '_jiaohuodate');
    	this.controls.isusewebztb = mini.get(this.id + '_isusewebztb');
    	this.controls.proteammember = mini.get(this.id + '_proteammember');
    	this.controls.bdthirdtype = mini.get(this.id + '_bdthirdtype');
    	this.controls.newbdthirdty = mini.get(this.id + '_newbdthirdty');
    	
    	
    	this.$zhaobiaofangshi = $('#' + this.id + '_zhaobiaofangshi', this.el);
    },
    
    // 设置模板数据。默认为：this.tplData = {controlId: this.id};
    // 如需自定义，只需修改this.tplData的值
    setTplData: function(){
    	mini.DBWorkflow.superclass.setTplData.call(this);
    },
    
    // 设置内部控件的值以及一些根据后台返回数据来控制显隐等操作
    // commonDto中初始化时会调用
    // 具体的数据结构根据控件自己的特点来确定
    // 本控件的数据结构如dbworkflow.json
    // 该方法在mini.UserControl中已定义，没有特殊需求，一般不需要再定义
    setData: function(data){
    	mini.DBWorkflow.superclass.setData.call(this, data);
    	
    	// 根据数据来控制内部区域的显隐
    	if(data.zhaobiaofangshi == 'G'){
    		this.$zhaobiaofangshi.css('display', "block");
    	}
    },
    
    // 返回控件的数据
    // commonDto中表单提交 时会调用
    // 具体的数据结构根据控件自己的特点来确定
    // 该方法在mini.UserControl中已定义，没有特殊需求，一般不需要再定义
    getValue: function(){
    	var data = mini.DBWorkflow.superclass.getValue.call(this);
    	
    	return data;
    }
});

mini.regClass(mini.DBWorkflow, "dbworkflow");
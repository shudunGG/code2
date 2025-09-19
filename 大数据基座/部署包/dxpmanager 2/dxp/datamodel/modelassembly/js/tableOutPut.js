(function(win,$) {
	var dataSource = mini.get('dataSource'),
	tableName = mini.get('tableName');
	
	//选择数据来源
    dataSource.on('valuechanged',function(e){
    	dataSource.setValue(e.value);
    	tableName.setValue("");
    	epoint.execute("getFrontTableList", '', '', function(data) {
			tableList.setData(data);
		});
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	tableName.setValue("");
    });
    
    tableName.on('closeclick',function(e){
    	tableName.setValue("");
    });
    
})(window,jQuery);

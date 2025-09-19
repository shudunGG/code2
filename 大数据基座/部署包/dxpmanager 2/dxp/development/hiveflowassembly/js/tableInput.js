(function(win,$) {
	var dataSource = mini.get('dataSource'),
	tableName = mini.get('tableName'),
	sql = mini.get('sql');
	var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
	
	//选择数据来源
    dataSource.on('valuechanged',function(e){
    	dataSource.setValue(e.value);
    	tableName.setValue("");
    	sql.setValue('');
    	epoint.execute("getFrontTableList", '', '', function(data) {
			tableList.setData(data);
		});
    }).on('closeclick',function(e){
    	e.sender.setText('');
    	e.sender.setValue('');
    	tableName.setValue("");
    	sql.setValue('');
    });
    
    tableName.on('valuechanged',function(e){
    	epoint.execute("getChangeTableName", '', '', function(data) {
    		sql.setValue('select * from '+data);
		});
    }).on('closeclick',function(e){
    	tableName.setValue("");
    	sql.setValue('');
    });
    
    
    
})(window,jQuery);

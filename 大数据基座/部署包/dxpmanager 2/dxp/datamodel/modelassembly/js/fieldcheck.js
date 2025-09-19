	function englishjy(e) {
		var retainedFields = ['like','as'];
		if(retainedFields.indexOf(e.value) != -1){
			e.errorText = "字段名称不能为数据库保留字："+retainedFields;
			e.isValid = false;
			return;
		}
		var reg =  new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
		var v = reg.test(e.value);
		if (!v) {
			e.errorText = "必须以字母开头，英文、数字、下划线作为字段组合名称!";
			e.isValid = false;
		}
	}
	
	
	function onCellValidation(e){
		if (e.field == "name" || e.field == "othername") {
			var retainedFields = ['like','as'];
			if(retainedFields.indexOf(e.value) != -1){
				e.errorText = "字段名称不能为数据库保留字："+retainedFields;
				e.isValid = false;
				return;
			}
			var reg =  new RegExp("^[a-zA-Z][a-zA-Z0-9_]*$");
			var v = reg.test(e.value);
			if (!v) {
				e.errorText = "字段名称必须以字母开头，英文、数字、下划线作为字段组合名称!";
				e.isValid = false;
			}
		}else if(e.field == "chinesename"){
			if (e.value == '') {
				e.errorText = "字段中文名称不能为空!";
				e.isValid = false;
			}
		}else if(e.field == "type"){
			if (e.value == '') {
				e.errorText = "字段类型不能为空!";
				e.isValid = false;
			}
		}else if( e.field == "value"){
			if (e.value == '') {
				e.errorText = "常量值/表达式不能为空!";
				e.isValid = false;
			}
		}
	}
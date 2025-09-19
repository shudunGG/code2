(function (win, $) {

    var M = Mustache,
    $dataField = $('#DataField'),
    $dataFieldCn = $('#DataFieldCn'),
    $colDefTable = $("#col_def_table"),
    trTempl = $.trim($('#tr-templ').html()),
    ctrlTempl = $.trim($('#ctrl-templ').html()),
    $curTime = $('#CurTime'),
    $btnName = $('#BtnName');

    // 是否处于编辑状态
    var isEditing = false;

    var pWin = win.parent,
        trigSrc = pWin._triggerSrc,
        actField = pWin._activeField,
        datafield = pWin._activeField;


    $.extend(win, {
        // 确定前的验证
        CheckCtrlProp: function () {
        	var field = $curTime.val(),
            fieldCn = $dataFieldCn.val();
        
        	if(!fieldCn) {
        		Util.alert('子表未选择，无法添加');
        		return false;
        	}

        	//获取子表页面上的所有字段值
        	var setData = [], filledRows = valiateSettings(), item;
			var $rows = $colDefTable.find("tr").not("#tr_header");
			if (filledRows) {
				for (var i = 0, len = filledRows.length; i < len; i++) {
					$rows.eq(filledRows[i]).find("td").wrapAll('<form></form>');
					item = $rows.eq(filledRows[i]).find("form").serialize();
					$rows.eq(filledRows[i]).find("td").unwrap();

					setData.push(parseQuery(item));
				}
			} 
			var dataJson = JSON.stringify(setData);
			var data = JSON.parse(dataJson);
            
            // 修改后要验证ID是否重复
            if(Util.isFieldUsed(field, fieldCn, isEditing, data)) {
            	parent.controlId +=1;
                Util.alert('字段已被使用');
                return false;
            }

			return true;
        },
        
        // 验证表单, 规则：headername至少有一个
		valiateSettings: function () {
			var $rows = $colDefTable.find("tr").not("#tr_header"), filledRows = [], headername;

			$rows.each(function(i, el) {
						headername = $.trim($(el).find("#item_" + (i + 1)).val());

						if (headername !== "") {
							filledRows.push(i);
						}
					});

			if (filledRows.length === 0) {
				Util.alert("选择的子表至少包含一个字段！");

				return false;
			}

			return filledRows;
		},

		// 解析查询字符串
		parseQuery: function (str) {
			var result = {};

			var tempArr;

			tempArr = str.split('&');

			for ( var i in tempArr) {
				var innerArr;
				innerArr = tempArr[i].split('=');

				if (innerArr[1] === undefined) {
					innerArr[1] = '';
				}

				if (innerArr[0].length != 0) {
					result[innerArr[0].trim()] = innerArr[1].trim();
				}
			}

			return result;
		},

        // 新增情况下，生成html
        BuildCtrlHTML: function () {
        	parent.controlId +=1; 
        	
            var dfcn = $dataFieldCn.val(),
            btnName = $btnName.val();
            
            var setData = [], filledRows = valiateSettings(), item;

			var $rows = $colDefTable.find("tr").not("#tr_header");

			if (filledRows) {
				for (var i = 0, len = filledRows.length; i < len; i++) {
					$rows.eq(filledRows[i]).find("td").wrapAll('<form></form>');
					item = $rows.eq(filledRows[i]).find("form").serialize();
					$rows.eq(filledRows[i]).find("td").unwrap();

					setData.push(parseQuery(item));
				}
			} 
			
            var view = {
                id: ($curTime.val() + '_' + tableId),
                tableid: $curTime.val(),
                subfields: JSON.stringify(setData),
                dataField: $curTime.val(),
                dataFieldCn: dfcn,
                title: dfcn + '（' + $curTime.val() + '）',
                value: dfcn + '（' + $curTime.val() + '）',
                btnName: btnName
            };

            return M.render(ctrlTempl, view);
        },

        // 修改情况下，生成对应的属性html
        BuildCtrlProp: function () {
        	var setData = [], filledRows = valiateSettings(), item;

			var $rows = $colDefTable.find("tr").not("#tr_header");

			if (filledRows) {
				for (var i = 0, len = filledRows.length; i < len; i++) {
					$rows.eq(filledRows[i]).find("td").wrapAll('<form></form>');
					item = $rows.eq(filledRows[i]).find("form").serialize();
					$rows.eq(filledRows[i]).find("td").unwrap();

					setData.push(parseQuery(item));
				}
			} 
        	
            var attrs = {};
            var df = $dataField.val(),
            dfcn = $dataFieldCn.val(),
            curTime = $curTime.val(),
            btnName = $btnName.val();

            return $.extend(attrs, {
            	id: (curTime + '_' + tableId),
                tableid: curTime,
                subfields: JSON.stringify(setData),
                dataField: curTime,
                dataFieldCn: dfcn,
                title: dfcn + '（' + curTime + '）',
                value: dfcn + '（' + curTime + '）',
                btnName: btnName
            });

            return attrs;
        },

        // 修改情况下，属性值初始化
        InitCtrlProp: function (el, name, matchExtra) {
            // 是否处于编辑状态
            isEditing = el ? true : false;

            if(trigSrc != 'html') {
                needCheckId = true;
            }
            if(!isEditing) {
            	return;
            }

            var $el = $(el);
            
            var df = $el.attr('datafield'),
            dfcn = $el.attr('datafieldcn'),
            subfields = $el.attr('subfields'),
            tableid = $el.attr('tableid'),
            btnName = $el.attr('btnname');
            
            $dataField.val(df);
            $dataFieldCn.val(dfcn);
            $curTime.val(tableid);
            $btnName.val(btnName);
            
            var data = JSON.parse(window.decodeURIComponent(subfields));
            if (data && data.length) {
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].order = i + 1;
				}
				
				//删除现有行再添加
		    	var index=document.getElementsByTagName("tr").length;
		    	for(var i=0;index>0 && i<index;i++){
		    		var $row = $("#tr_" + i);
		    		if($row){
		    			$row.remove();
		    		}
		    	}
				$colDefTable.find('tbody').append(Mustache.render(trTempl, {
					items : data
				}));
				
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#item_' + (i + 1));
					if($select){
						$select.val(window.decodeURIComponent(data[i].headername));
					}
				}
			}
        }
    });
    
    //动态加载控件属性页面
    window.onload = function() {
    	  var data="";
    	  var testdiv = document.getElementById("DataField");
    	  var basicObject = JSON.parse(pWin.BasicData);
    	  var structObject = JSON.parse(pWin.StructData);
    	  var name;
    	  var cnName;
    	  if(testdiv){
    		  var selObj = $("#DataField");
			  for (prop in basicObject) {
				  if(basicObject[prop]){
					  if(prop==0){
						  name = basicObject[prop].sqltablename;
						  cnName = basicObject[prop].tablename;
					  }
				      selObj.append("<option value='"+basicObject[prop].sqltablename+"'>" + basicObject[prop].tablename + "</option>"); 
		          }
		      }
		  }
    	  $curTime.val(name);
    	  $dataFieldCn.val(cnName);
    	  
    	  for (prop in structObject) {
          	if(name==prop && structObject[prop]){
          		data = structObject[prop];
              }
          }
    	  for (var i = 0, l = data.length; i < l; i++) {
				data[i].order = i + 1;
		  }
          $colDefTable.find('tbody').append(Mustache.render(trTempl, {
				items : data
		  }));
    	  
    };
    
    showData = function(obj) {
    	var data = "";
    	//删除现有行，重新加载
    	var index=document.getElementsByTagName("tr").length;
    	for(var i=0;index>0 && i<index;i++){
    		var $row = $("#tr_" + i);
    		if($row){
    			$row.remove();
    		}
    	}
    	$curTime.val(obj.value);
    	//$dataFieldCn.val(obj.selectedOptions[0].innerText);
    	$dataFieldCn.val($(obj).find("option:selected").text());
  	    
        var structObject = JSON.parse(pWin.StructData);
        for (prop in structObject) {
          	if(obj.value==prop && structObject[prop]){
          		data = structObject[prop];
            }
        }
        for (var i = 0, l = data.length; i < l; i++) {
			data[i].order = i + 1;
	    }
        $colDefTable.find('tbody').append(Mustache.render(trTempl, {
			items : data
	    }));
     }
 
} (this, jQuery));


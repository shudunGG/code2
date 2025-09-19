(function (win, $) {

    var M = Mustache,
    $dataField = $('#DataField'),
    $dataFieldCn = $('#DataFieldCn'),
    $colDefTable = $("#col_def_table"),
    trTempl = $.trim($('#tr-templ').html()),
    ctrlTempl = $.trim($('#ctrl-templ').html()),
    $curTime = $('#CurTime'),
    trTempl2 = $.trim($('#tr-templ2').html()),
    $fieldCreateFlag =$('#fieldCreateFlag'),
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
        	var field = $dataField.val(),
            fieldCn = $dataFieldCn.val(),
            fieldCreateFlag= $fieldCreateFlag.val();
        
        	if(!fieldCn) {
        		Util.alert('中文名称未填写，无法添加');
        		return false;
        	}
        	if(!isEditing && !field){
        		field = "Ctrl" + (parent.controlId + 1);
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
            
            //修改后要验证字段ID是否存在
            if(Util.isFieldUsedInTable(field, fieldCn, isEditing, data)){
            	parent.controlId +=1;
            	Util.alert('字段表结构中已存在');
                return false;
            }

            var $rows = $colDefTable.find("tr").not("#tr_header"), filledRows = [], headername, fieldname;
            var count = 0;

			$rows.each(function(i, el) {
						headername = $.trim($(el).find("#item_" + (i + 1)).val());
						fieldname =  $.trim($(el).find("#field_" + (i + 1)).val());

						if (headername !== "" && fieldname !== "") {
							filledRows.push(i);

//							if (hasfield) {
//								field = $.trim($(el).find("#field_" + (i + 1))
//										.val());
//
//								field.length === 0
//										? hasfield = false
//										: hasfield = true;
//							}

						}else if((headername !== "" && fieldname == "") || (headername == "" && fieldname !== "")){
							count++;
						}
					});

			if (filledRows.length === 0) {
				Util.alert("请至少为列表控件建立1个列！");

				return false;
			}else if(count>0){
				Util.alert("请检查表头名称和表头英文名称，并填写！");
				return false;
			}

//			if (!hasfield) {
//				Util.alert("字段名称不能为空！");
//
//				return false;
//			}

			return true;
        },
        
        // 验证表单, 规则：headername至少一个填写，填了headername的必填field
		valiateSettings: function () {
			var $rows = $colDefTable.find("tr").not("#tr_header"), filledRows = [], headername, fieldname;
			var count = 0;

			$rows.each(function(i, el) {
						headername = $.trim($(el).find("#item_" + (i + 1)).val());
						fieldname =  $.trim($(el).find("#field_" + (i + 1)).val());

						if (headername !== "" && fieldname !== "") {
							filledRows.push(i);

//							if (hasfield) {
//								field = $.trim($(el).find("#field_" + (i + 1))
//										.val());
//
//								field.length === 0
//										? hasfield = false
//										: hasfield = true;
//							}

						}else if((headername !== "" && fieldname == "") || (headername == "" && fieldname !== "")){
							count++;
						}
					});

			if (filledRows.length === 0) {
				Util.alert("请至少为列表控件建立1个列！");

				return false;
			}else if(count>0){
				Util.alert("请检查表头名称和表头英文名称，并填写！");
				return false;
			}

//			if (!hasfield) {
//				Util.alert("字段名称不能为空！");
//
//				return false;
//			}

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
		
		// 添加行
		addCell: function ()  {
			// 获取最后一行的id
			var id = $colDefTable.find("tr").last()[0].id.substring(3);

			// 获取最后一行的order
			var order = $colDefTable.find("tr").last().find("span").text();

			if (order == "") {
				order = 0;
				fieldname = "SubCtrl"+order;
			}

			if($fieldCreateFlag.val() == 'manual'){
				$colDefTable.find("tbody").append(Mustache.render(trTempl2, {
					items : [{
						order : order - 0 + 1,
						fieldname : "",
						cellwidth : "100"
					}]
				}));
			}else{
				$colDefTable.find("tbody").append(Mustache.render(trTempl, {
					items : [{
						order : order - 0 + 1,
						fieldname : "SubCtrl"+(order-0+1),
						cellwidth : "100"
					}]
				}));
			}
			

			$colDefTable.find("tr").last().find("span").text(order - 0 + 1);
		},

		// 删除行
		deleteCell: function (id) {
			var $row = $("#tr_" + id);

			$row.remove();

			refreshOrder();
		},

		// 刷新序号
		refreshOrder: function () {
			$rows = $colDefTable.find("tr");

			$rows.each(function(index, el) {
				if (index !== 0) {
					$(el).find("span").text(index);
				}
			});
		},

        // 新增情况下，生成html
        BuildCtrlHTML: function () {
            parent.controlId +=1; 
        	
            var df = "Ctrl" + parent.controlId,//$dataField.val(),
            dfcn = $dataFieldCn.val(),
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
			var time = new Date();
			var year = time.getFullYear();
			var month = ((time.getMonth()+1)>9?'':'0')+(time.getMonth()+1);
			var date = (time.getDate()>9?'':'0')+time.getDate();
            var hour = (time.getHours()>9?'':'0')+time.getHours();
            var minutes = (time.getMinutes()>9?'':'0')+time.getMinutes();
            var second = (time.getSeconds()>9?'':'0')+time.getSeconds();
			var curTime = year+""+month+""+date+""+hour+""+minutes+""+second+"";
			
			$curTime.val("table"+curTime);
			
            var view = {
                id: ("table"+curTime + '_' + tableId),
                tableid: "table"+curTime,//df,
                subfields: JSON.stringify(setData),
                dataField: "table"+curTime,
                dataFieldCn: dfcn,
                title: dfcn + '（' + "table"+curTime + '）',
                value: dfcn + '（' + "table"+curTime + '）',
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
                tableid: curTime,//df,
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
        	$dataFieldCn.val(name + (parent.controlId + 1));

            // 是否处于编辑状态
            isEditing = el ? true : false;

            if(trigSrc != 'html') {
                needCheckId = true;
            }

            if(!isEditing) {
            	var data = [{
        			"headername" : "",
        			"fieldname" : "SubCtrl1",
        			"cellwidth" : 100,
        			"type" : "textbox",
        			"requiredValidate" : false,
        			"formatValidate" : "",
        			"total" : false,
        			"formula" : "",
        			"value" : "",
        			"dvalue" : ""
        		}, {
        			"headername" : "",
        			"fieldname" : "SubCtrl2",
        			"cellwidth" : 100,
        			"type" : "textbox",
        			"requiredValidate" : false,
        			"formatValidate" : "",
        			"total" : false,
        			"formula" : "",
        			"value" : "",
        			"dvalue" : ""
        		}, {
        			"headername" : "",
        			"fieldname" : "SubCtrl3",
        			"cellwidth" : 100,
        			"type" : "textbox",
        			"requiredValidate" : false,
        			"formatValidate" : "",
        			"total" : false,
        			"formula" : "",
        			"value" : "",
        			"dvalue" : ""
        		}];
            	
            	//如果是手动
                if($fieldCreateFlag.val() == 'manual'){
                	data = [{
            			"headername" : "",
            			"fieldname" : "",
            			"cellwidth" : 100,
            			"type" : "textbox",
            			"requiredValidate" : false,
            			"formatValidate" : "",
            			"total" : false,
            			"formula" : "",
            			"value" : "",
            			"dvalue" : ""
            		}, {
            			"headername" : "",
            			"fieldname" : "",
            			"cellwidth" : 100,
            			"type" : "textbox",
            			"requiredValidate" : false,
            			"formatValidate" : "",
            			"total" : false,
            			"formula" : "",
            			"value" : "",
            			"dvalue" : ""
            		}, {
            			"headername" : "",
            			"fieldname" : "",
            			"cellwidth" : 100,
            			"type" : "textbox",
            			"requiredValidate" : false,
            			"formatValidate" : "",
            			"total" : false,
            			"formula" : "",
            			"value" : "",
            			"dvalue" : ""
            		}];
            	}
            	for (var i = 0, l = data.length; i < l; i++) {
					data[i].order = i + 1;
				}
            	
            	if($fieldCreateFlag.val() == 'manual'){
            		$colDefTable.find('tbody').append(Mustache.render(trTempl2, {
    					items : data
    				}));
                }else{
                	$colDefTable.find('tbody').append(Mustache.render(trTempl, {
    					items : data
    				}));
                }
				
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#coltype_' + (i + 1));
					if($select){
						$select.val(data[i].type);
					}
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#formatValidate_' + (i + 1));
					if($select){
						$select.val(data[i].formatValidate);
					}
				}
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
            var data = JSON.parse(subfields);
            
            if (data && data.length) {
				for (var i = 0, l = data.length; i < l; i++) {
					data[i].order = i + 1;
				}

				if($fieldCreateFlag.val() == 'manual'){
					$colDefTable.find('tbody').append(Mustache.render(trTempl2, {
						items : data
					}));
				}else{
					$colDefTable.find('tbody').append(Mustache.render(trTempl, {
						items : data
					}));
				}
				
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#coltype_' + (i + 1));
					if($select){
						$select.val(data[i].type);
					}
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#item_' + (i + 1));
					if($select){
						$select.val(window.decodeURIComponent(data[i].headername));
					}
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#field_' + (i + 1));
					if($select){
						$select.val(window.decodeURIComponent(data[i].fieldname));
					}
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#colvalue_' + (i + 1));
					if($select){
						$select.val(window.decodeURIComponent(data[i].value));
					}
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#formatValidate_' + (i + 1));
					if($select){
						$select.val(data[i].formatValidate);
					}
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var $select = $('#defaultvalue_' + (i + 1));
					if($select){
						$select.val(window.decodeURIComponent(data[i].dvalue));
					}
				}
			}
        }
    });
    
    //动态加载控件属性页面
    window.onload = function() {
    	  var ctrlCreateType = Util._splitParam(window.location.search,'fieldcreatetype');
          if(ctrlCreateType == 'manual'){//手动
        	  $("#selectName").toggle();//去除英文名控件隐藏显示属性
        	  $('#fieldCreateFlag').val('manual');//保存字段创建类型
          }
    };
} (this, jQuery));


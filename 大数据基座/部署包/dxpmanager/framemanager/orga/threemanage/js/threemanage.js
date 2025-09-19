// (function (win, $) {

    var $threeHeader = $('#three-header'),
        $threeTablelist = $('#three-tablelist'),
        $threeLayer = $('#three-layer');

    var currentStatus;  // 当前开启/关闭状态 0 表示关闭，1表示开启

    var miniCollect = {
        securityAuditor: mini.get('security-auditor'),
        securityAdmin: mini.get('security-admin'),
        systemAdmin: mini.get('system-admin'),
        superAdmin: mini.get('super-admin')
    };

    var roleGroupChange = function() {
    	var value = mini.get('roleGroup').getValue();
    	epoint.execute('hideOuAdmin', '', [value], function (data) {
    		epoint.showTips("保存成功");
		});
    }
    
    //页面加载后，初始化赋值
    var renderInputValue = function(data) {
    	
    	if (data.securityAuditor) {
    		miniCollect.securityAuditor.setValue(data.securityAuditor.ids);
    		miniCollect.securityAuditor.setText(data.securityAuditor.names);
    	}

    	if (data.securityAdmin) {
	        miniCollect.securityAdmin.setValue(data.securityAdmin.ids);
	        miniCollect.securityAdmin.setText(data.securityAdmin.names);
    	}
    	
        if (data.systemAdmin) {
	        miniCollect.systemAdmin.setValue(data.systemAdmin.ids);
	        miniCollect.systemAdmin.setText(data.systemAdmin.names);
        }
        
        if (data.superAdmin) {
	        miniCollect.superAdmin.setValue(data.superAdmin.ids);
	        miniCollect.superAdmin.setText(data.superAdmin.names);
        }
    }

    // 初始化状态
    var renderStatus = function(currentStatus) {
        if(currentStatus == 0) {
            $threeHeader.addClass('close');
            $threeTablelist.addClass('close');
        } else {
            $threeHeader.removeClass('close');
            $threeTablelist.removeClass('close');
        }
    }

    // 初始化页面数据
    function initData(res){
    	currentStatus = res.status;
        renderStatus(currentStatus);
        renderInputValue(res.data);
        // 初始化checkboxlist
        if(res.hideouadmin == 1) {
        	mini.get('roleGroup').setValue('hideouadmin');
        }
    }
    
    // 交互事件
    $threeHeader.on('click', '.input-add', function () {
        var $this = $(this),
            name = $this.data('name'),
            thisInput = miniCollect[name],
            ids = thisInput.getValue(); // 输入框中的值
        	// 将ids转换为后台可处理的用“;”区分的格式
        var	userGuid = ''
        if (ids) {
        	var userGuidArray = ids.split(',')
        	userGuid = userGuidArray.join(';')
    	}
    
    	epoint.openDialog('人员选择', "framemanager/orga/orga/user/selectuser?userGuid=" + userGuid, function(res){
    		// 关闭时回传到当前输入框
    		if (res) {
    			var rtnValueArray = res.split('_SPLIT_');
    			var rtnIds = rtnValueArray[0];
    			var rtnNames = rtnValueArray[1];
    			
    			// 将ids转换为前端可处理的用“,”区分的格式
    			var rtnIdsArray = rtnIds.split(';')
            	var idsStr = rtnIdsArray.join(',')
    			
            	// 将names转换为前端可处理的用“,”区分的格式
    			var rtnNamesArray = rtnNames.split(';')
            	var namesStr = rtnNamesArray.join(',')
            	
    			// 提交保存
    			epoint.execute('addUser', '', '[' + name + ',' + rtnIds + ']', function (data) {
    				if(data) {
    	    			if(data.success) {
    	    				thisInput.setValue(idsStr);
    	        			thisInput.setText(namesStr);
    	    				epoint.showTips(data.msg);
    	    			}
    	    			else {
    	    				epoint.showTips(data.msg,{state:'danger'});
    	    			}
    	            }
    	    	});
    			
    		}
        }, {
            'width' : 680,
            'height' : 500
        });

    }).on('click', '.close-manage', function() {
        // 调用接口，关闭成功就addClass('close');
        // 开启成功就 removeClass('close');
    	var confirmMsg = "";
    	if(currentStatus == 0) {
    		confirmMsg = "开启三员管理将会把后台管理模块的权限重置，请谨慎操作！";
    	}
    	else {
    		confirmMsg = "关闭三员管理将会把后台管理模块的权限重置，请谨慎操作！";
    	}
    	epoint.confirm(confirmMsg, '确认', function(){
    		epoint.execute('switchThreeManageStatus', '', function (data) {
        		if(data) {
        			if(data.success) {
    					epoint.alert(data.msg, '', '', 'success');
    					epoint.execute('init', '', function (data) {
        					initData(data);
            				epoint.refresh('datagrid');
            			});
        			}
        			else {
        				if(data.msg) {
    						epoint.alert(data.msg, '', '', 'warning');
    					}
        			}
                }
        	});
    	});
    });

    // 删除人员
    function removeItem(e) {
    	// 获取被删除条目
    	var removeData = e.item;
    	var userGuid = removeData.id;
    	
    	// 获取角色
    	var role = e.source.id
    	
    	// 提交保存
		epoint.execute('deleteUser', '', '[' + role + ',' + userGuid + ']', function (data) {
    		
    		if(data) {
    			if(data.superAdminValue && data.superAdminText) {
    				var superAdminInput = mini.get('super-admin');
    				superAdminInput.setValue(data.superAdminValue);
    				superAdminInput.setText(data.superAdminText);
    			}
    			epoint.showTips(data.msg);
            }
    	});
    }
    
    var grid = mini.get('datagrid');

    // 新增模块
    function addModule() {
		var settings = {
			'width' : 1000,
			'height' : 500
		};
		epoint.openDialog('新增功能', 'framemanager/orga/threemanage/module/threemanagemoduleadd', addCallBack, settings);
	}
    
    // 新增模块回调
    function addCallBack(param) {
		if (param) {
			epoint.refresh(['datagrid'],'',true);
		}
	}
    
    // 保存设置
    function saveBtn() {
    	grid.validate();
        if (grid.isValid() == false) {
            var error = grid.getCellErrors()[0];
            grid.beginEditCell(error.record, error.column);
            return;
        }
        epoint.execute('threemanageaction.save', '', callback);

    }
    
    // 保存设置的回调
    function callback(data) {
		if (data.msg) {
			epoint.alert(data.msg, '', function(){
				epoint.refresh(['datagrid'],'',true);
			}, 'info');
		}
	}

// })(window, jQuery);
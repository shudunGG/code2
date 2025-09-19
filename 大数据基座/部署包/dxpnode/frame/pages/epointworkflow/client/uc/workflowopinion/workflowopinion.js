var urlparams = Util.getUrlParams();

mini.WorkflowOpinion = function() {
	mini.WorkflowOpinion.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.WorkflowOpinion, mini.UserControl, {
	// 定义控件的className
	uiCls : "uc-workflowopinion",
	// 模板的地址，路径默认从webapp开始
	tplUrl : 'frame/pages/epointworkflow/client/uc/workflowopinion/workflowopinion.tpl',
	// css文件资源路径
    cssUrl: 'frame/pages/epointworkflow/css/opinion.css',
    
	// 初始化方法，将内部需要设值取值的控件缓存到this.controls中
	init : function() {
		this.controls.datagrid = mini.get('workflowopinion_datagrid');

		this.__initEditField();
		
		var $opinioncontent = $('#workflowopinion_content');

		// Util.loadPageModule({
		// 	templ : 'frame/pages/epointworkflow/client/handlepage.templ'
		// });
		// 必须要通过同步的ajax获取控件的模板
		Util.ajax({
			url: 'frame/pages/epointworkflow/client/handlepage.templ',
			// 必须为同步请求
			async: false,
			dataType: 'html',
			success: function (html) {
				$(html).appendTo('body');
			}
		});
		
		var handleType = urlparams.handleType;
		if(handleType && handleType == "2"){
			document.getElementById("workflowopinion_txt").style.display = 'none';
			return;
		}
		var showmode = this.showmode;
		if(!showmode || showmode != 3){
			Util.loadJs("frame/pages/epointworkflow/js/tabview.js", function(){
				var tab = new TabView({
					dom : document.getElementById("opinionTmplTab"),
					activeCls : 'active',
					triggerEvent : 'click'
				});
			
				if(!showmode || showmode == 1){
					tab.hiddenTab("tab1");
					tab.activeTabByIndex(1);
				}
			});
		}
		else{
			$('#workflowopinion_txt').toggleClass("shrink");
		}
		
		if ($('#commonopinionlist').length > 0) {
			$('#commonopinionlist').on("click", ".step-chk",
				function(e) {
					var $self = $(this),
						$li = $self.closest("li");
					if ($self.prop("checked") == true) {
						$opinioncontent.val($opinioncontent.val() + $li.data("opiniontext"));
					}else{
						$opinioncontent.val($opinioncontent.val().replace($li.data("opiniontext"), ""));
					}
				})
		}

		if ($('#useropinionlist').length > 0) {
			$('#useropinionlist').on("click", ".step-chk",
				function(e) {
					var $self = $(this),
						$li = $self.closest("li");
					if ($self.prop("checked") == true) {
						$opinioncontent.val($opinioncontent.val() + $li.data("opiniontext"));
					}else{
						$opinioncontent.val($opinioncontent.val().replace($li.data("opiniontext"), ""));
					}
				})
		}

		if ($("#workflowopinion_addmyopinion").length > 0) {
			$("#workflowopinion_addmyopinion").on("click", ".step-chk",
				function(e) {
					var $self = $(this);
					if ($self.prop("checked") == true) {
						var text = $opinioncontent.val();
						var showText=$('<div/>').text(text).html();
						if (text) {
							epoint.execute('addintoopinion', "@none", [showText],
								function(data) {
									if (data.message) {
										epoint.alert(data.message,'提示', null, 'info');
										if (data.opinionguid) {
											var opinion = $('#useropinionlist>.opiniontmpl-list');
											var html = "<li class='opiniontmpl-item' data-opiniontext="
													+ showText
													+ " data-opinionguid="
													+ data.opinionguid
													+ "><input class='step-chk' type='checkbox'><span>"
													+ showText
													+ "</span></li>";
											opinion.append(html);
										}
										
										// ie中有时意见框会无法获取焦点，这里强制其获取焦点
										$opinioncontent.focus();
									}
								});
						} else {
							epoint.alert('添加个人意见为空！', '提示', null, 'warning');
						}
						$self.prop("checked", false);
					}
				})

		}
	},

	getValue : function() {
		return "";
	},
	setData : function(data) {
		var json = epoint.decodeJson(data);
		this.controls.datagrid.setData(json.data);
		this.controls.datagrid.setTotalCount(json.total);
		
		var $commonopinionlist = $('#commonopinionlist'),
		$useropinionlist = $('#useropinionlist'),
		M = Mustache,
		opinionTmpl = $('#opinionTmpl').html();
		if ($commonopinionlist.length > 0 && json.commonopinionlist) 
			$commonopinionlist.empty().html(M.render(opinionTmpl, json.commonopinionlist));
		if ($useropinionlist.length > 0 && json.useropinionlist) 
			$useropinionlist.empty().html(M.render(opinionTmpl, json.useropinionlist));
	},

	__initEditField : function() {
		var _self = this;
		window["workflowopinion_onEdit"] = function(e) {
			if (e.row.canedit) {
				return epoint.renderCell(e, "action-icon icon-remove", 
						"workflowopinion_deleteOpinion", "opinionguid");
			}
		};
		window["workflowopinion_deleteOpinion"] = function(opinionguid) {
			// 弹出确认框
			epoint.confirm("确定删除选中记录？", '', function() {
				epoint.execute("deleteOpinion", "@none", [ opinionguid ],
						function(message) {
							_self._opinionCallback(message);
						});
			});
		};
	},

	_opinionCallback : function(message) {
		$("#workflowopinion_content").val('');
		if (message) {
			epoint.alert(message, '提示', null, 'info');
		} else
			epoint.refresh([ this.id ]);
	}
});

mini.regClass(mini.WorkflowOpinion, "workflowopinion");

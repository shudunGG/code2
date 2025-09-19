var urlparams = Util.getUrlParams();

mini.WorkflowFloatOpinion = function() {
	mini.WorkflowFloatOpinion.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.WorkflowFloatOpinion, mini.UserControl, {
	// 定义控件的className
	uiCls : "uc-workflowfloatopinion",
	// 模板的地址，路径默认从webapp开始
	tplUrl : 'frame/pages/epointworkflow/client/uc/workflowfloatopinion/workflowfloatopinion.tpl',
	
	// css文件资源路径
    cssUrl: 'frame/pages/epointworkflow/css/opinion.css',

	// 初始化方法，将内部需要设值取值的控件缓存到this.controls中
	init : function() {
		var handleType = urlparams.handleType;
		var showmode = this.showmode;
		if(handleType && handleType == "2"){
			document.getElementById("workflowopinion_main").style.display = 'none';
			return;
		}
			Util.loadPageModule({
				templ : 'frame/pages/epointworkflow/client/handlepage.templ'
			});
			
			if(!showmode || showmode != 3){
				Util.loadJs("frame/pages/epointworkflow/js/tabview.js", function(){
					var tab = new TabView({
						dom : document.getElementById("opinionTmplTab"),
						activeCls : 'active',
						triggerEvent : 'click'
					});
					
					if(!showmode || showmode != 3){
						tab.hiddenTab("tab1");
						tab.activeTabByIndex(1);
					}
				});
			}
			else{
				$('.floatopinion-maincontainer').toggleClass("shrink");
			}
			
			var $opinion = $('#workflowopinion_main'),
	            $toggle = $('.opinion-toggle', $opinion),
	            $toggleText = $('.opinion-toggle-text', $toggleText),
	            $opinioncontent = $('#workflowopinion_content');

	        $toggle.on('click', function(){
	            if($opinion.hasClass('collapse')) {
	                $opinion.removeClass('collapse');
	                $toggleText.text('收起');
	            } else {
	                $opinion.addClass('collapse');
	                $toggleText.text('签署意见');
	            }
	        });
			
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
							if (text) {
								epoint.execute('addintoopinion', "@none", [text],
									function(data) {
										if (data.message) {
											epoint.alert(data.message, '提示', null, 'info');
											if (data.opinionguid) {
												var opinion = $('.opiniontmpl-list');
												var html = "<li class='opiniontmpl-item' data-opiniontext="
														+ text
														+ " data-opinionguid="
														+ data.opinionguid
														+ "><input class='step-chk' type='checkbox'><span>"
														+ text
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
		var data = epoint.decodeJson(data);
		if(!data) return; 
		var $commonopinionlist = $('#commonopinionlist'),
		$useropinionlist = $('#useropinionlist'),
		M = Mustache,
		opinionTmpl = $('#opinionTmpl').html();
		if ($commonopinionlist.length > 0 && data.commonopinionlist) 
			$commonopinionlist.empty().html(M.render(opinionTmpl, data.commonopinionlist));
		if ($useropinionlist.length > 0 && data.useropinionlist) 
			$useropinionlist.empty().html(M.render(opinionTmpl, data.useropinionlist));
	}
});

mini.regClass(mini.WorkflowFloatOpinion, "workflowfloatopinion");



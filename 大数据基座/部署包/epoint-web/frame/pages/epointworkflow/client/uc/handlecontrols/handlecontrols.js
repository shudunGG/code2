var operationGuid = null;
var transitionGuid = null;
var afterbtn = null;
var pviGuid = null;
var workitemGuid = null;
var workflowopinioncontent = null;
var urlparams = Util.getUrlParams();

mini.HandleControls = function() {
	mini.HandleControls.superclass.constructor.apply(this, arguments);
};

mini.extend(mini.HandleControls, mini.UserControl, {
	// 定义控件的className
	uiCls : "uc-handlecontrols",
	// 模板的地址，路径默认从webapp开始
	tplUrl : 'frame/pages/epointworkflow/client/uc/handlecontrols/handlecontrols.tpl',
	
	height : "26px",

	width : "100%",

	// 初始化方法，将内部需要设值取值的控件缓存到this.controls中
	init : function() {
		var that = this;
		// this.controls.handlecontrols = mini.get(this.id + '_handlecontrols');
	},

	getValue : function() {
		return "";
	},
	setData : function(data) {
		var json = epoint.decodeJson(data);
		if (json && json.message) {
			epoint.alert(json.message, "错误", function(action) {
				window.location.href = _rootPath;
			}, 'error');
		}
		// $(".xxx").addbutton()
		// var info = $("#handlecontrols_helper");
		var info = $("#handlecontrols_helpinfo");
		if (info && json.info) {
			info[0].innerHTML = json.info;
			$("#handlecontrols_helper").removeClass('hidden');
		} else {
			$("#handlecontrols_helper").addClass('hidden');
		}

		if (json.workitemguid) {
			workitemGuid = json.workitemguid;
		}
		else if (urlparams.WorkItemGuid && urlparams.WorkItemGuid != undefined) {
			workitemGuid = urlparams.WorkItemGuid;
		}
		
		pviGuid = json.pviguid;
		if (!pviGuid)
			pviGuid = urlparams.ProcessVersionInstanceGuid;

		var lockpart = $("#handlecontrols_lockpart");
		var btnlock = $("#handlecontrols_btnlock");
		var lockLabel = $("#handlecontrols_locklabel");
		var lockdttm = json.lockdttm;
		var lockTimeControl = json.lockTimeControl;//参数锁定值（有值：配置了且对应锁定的）
		var timer;
		var isshowlockbut = json.isshowlockbut;

		var trackpart = $("#handlecontrols_trackpart");
		var acthtml = $("#handlecontrols_acthtml");
		var act = json.acthtml;
		if (act && acthtml) {
			acthtml[0].textContent = act;
		}

		var item = json.btn;

		var btns = $("#handlecontrols_btnlst");
		btns.empty();

		if (item && item.length) {
			for (var i = 0; i < item.length; i++) {
				var btn = new mini.Button();
				btn.render("handlecontrols_btnlst");
				btn.setText(item[i].text);
				btn.setId(item[i].btnid);
				btn.set(item[i]);
				// 如果是"通过"、"签收"、"保存"类型按钮，设置主按钮
				if(item[i].operationtype == "Pass" || item[i].operationtype == "8" || item[i].operationtype == "60"){
					btn.setState("primary");
					btn.setGhost(false);
				}else if(item[i].operationtype == "Back" || item[i].operationtype == "BackToStart" ||item[i].operationtype == "40" || item[i].operationtype == "45"){
					// "退回"、"退回到开始"、"终止工作项"、"终止流程实例"
					btn.setState("danger");
				}
				// btn.setToolTip(item[i].note);
				btn.on('click', function() {
					AjaxOperation(this.operationguid, this.transitionguid,
							this.operationtype, this.beforeact, this.afteract,
							this.isrequireopinion);
				});
			}
		}
		
		
		if (lockdttm && lockpart) {
			lockpart[0].textContent = lockdttm;
			if(!lockTimeControl){
			    if (btnlock && isshowlockbut){
				   btnlock.removeClass("hidden");
			    }	
			}
			else{
				if (btnlock && isshowlockbut){
				   btnlock.addClass("hidden");
			    }
			}
			lockLabel.addClass("hidden");		
		} else {
			lockpart[0].textContent = "";
			if (btnlock){
				btnlock.addClass("hidden");
			}
			if(!lockTimeControl){	
				lockLabel.addClass("hidden");
			}else{
				//开启了新锁定逻辑，且有操作按钮返回默认流程流转，显示倒计时等；否则为已办等无需锁定及显示倒计时
				if (item && item.length){
					lockLabel.removeClass("hidden");
				}else{
					lockLabel.addClass("hidden");
				}
			}
		}
		
		//配置了锁定时间且倒计时控件显示情况下触发
		var display = lockLabel.css('display');
		if(lockTimeControl && display == "block"){
			var min = parseInt(lockTimeControl) -1;
			var second = 59;
			timer = setInterval(function(){
				if(min != 0){
					if(second == 0){
						min--;
						second = 59;
					}else{
						second--;
					}
				}else{
					if(second== 59){
						clearInterval(timer);
						remindFunction();
					}
					else if(second== 0){
						clearInterval(timer);	
					}else{
						second--;
					}
				}
				lockLabel.text("倒计时："+min+"分"+second+"秒");	
			},1000);	
		}
	},
	setValue : function(data) {
	}
});

mini.regClass(mini.HandleControls, "handlecontrols");

//新锁定逻辑，倒是提醒弹框
function remindFunction(){
	var timeobj = 59;
	var operateHasDone = 0;
	var lockLabel = $("#handlecontrols_locklabel");
	//如果确认框未操作选择，定时关闭
	setInterval(function(){
		timeobj--;
		if(operateHasDone !=1){
			lockLabel.text("倒计时："+0+"分"+timeobj+"秒");	
		}
		//倒计时到0，且确认框仍未做操作，自动关闭并解锁
		if(timeobj == 0 && operateHasDone == 0){
			CloseMe();
		}
	},1000);
	epoint.confirm('还有1分钟即将到期，到期后会自动关闭此处理页面，是否要延期？如不延期请尽快处理！', '确定', function() {
		if (urlparams.WorkItemGuid && urlparams.WorkItemGuid != undefined) {
			workitemGuid = urlparams.WorkItemGuid;
		}
		if (urlparams.ProcessVersionInstanceGuid && urlparams.ProcessVersionInstanceGuid != undefined) {
			processVersionInstanceGuid = urlparams.ProcessVersionInstanceGuid;
		}
		if (processVersionInstanceGuid && workitemGuid) {
		    epoint.execute("handlecontrolsaction.workItem_LockFresh", "@none", [processVersionInstanceGuid, workitemGuid ],function(){epoint.refresh();});
		}
		operateHasDone = 1;
	}, function(){
		var lastTime = timeobj;
		console.log(timeobj);
		setInterval(function(){
			lastTime--;
			lockLabel.text("倒计时："+0+"分"+lastTime+"秒");	
			if(lastTime ==0){
				CloseMe();
			}
			operateHasDone = 1;
		},1000);
	});
};


function AjaxOperation(OperationGuid, TransitionGuid, OperationType, btnbefore,
		btnafter, isrequireopinion) {
	operationGuid = OperationGuid;
	transitionGuid = TransitionGuid;
	afterbtn = btnafter;
	var batchHandleGuid = null;
	var opinionTextBox = mini.get('workflowopinion_content');
	try {
		batchHandleGuid = document.getElementById("hidIsBatchHandle").value;
	} catch (ee) {
	}
	try {
		if(opinionTextBox){
			workflowopinioncontent = opinionTextBox.getValue();
			if (isrequireopinion && !workflowopinioncontent) {
				epoint.alert('请签署意见！', '提示', null, 'warning');
				return;
			}
		}
	} catch (e) {
	}
	if (btnbefore != null && btnbefore != "" && btnbefore != "undefined") {
		try {
			if (batchHandleGuid) {
				var btnSubmit = getButton(batchHandleGuid);
			} else {
				var btnSubmit = getButton(btnbefore);
			}
			if (btnSubmit != null) {
				btnSubmit.doClick();
			}
		} catch (er) {
			HandleNextStep(OperationGuid, TransitionGuid, OperationType,
					btnbefore, btnafter);
		}
	} else {
		HandleNextStep(OperationGuid, TransitionGuid, OperationType, btnbefore,
				btnafter);
	}
};

// 根据操作的具体情况，打开处理页面url
function OpenHandlePage(url, button) {
	var w = 1240;
	var h = 625;
	if (url.indexOf("singletransition") > 0) {
		w = 1100;
		h = 625;
	}

	url = url.replace("\\", "/");

	var p = url.lastIndexOf("/");
	if (p > 0) {
		url = url.substr(0, p).toLowerCase() + url.substr(p);
	}
	if (button != null)
		operatorButton = button;
	epoint.openDialog('流程处理', Util.getRightUrl(url), DefaultOperateHd, {
		width : w,
		height : h,
		allowResize : false
	});
};

// 默认处理pass操作后，根据处理结果进行下一步动作
function DefaultOperateHd(value) {
	// mini.alert(value);
	// 取消等其他操作,恢复初始状态
	if (!value || value == 'close' || value == 'ok') {
		ShowTdOperate(true);
	}
	// 成功执行,关闭工作流窗口
	else if (value == "Success") {
		AfterClick();
		CloseMe();
	} else {
		try {
			// 到此已排除了value=null或""或"undefined"等特殊情况
			// 如果能够通过epoint.decodeJson转换成功说明是F9标准操作处理页面返回的json数据
			// 除数组和json格式其余epoint.decodeJson验证不通过
			var jsonstring = epoint.decodeUtf8(value);
			var json = epoint.decodeJson(jsonstring);
			if (workflowopinioncontent && !json.opinion) {
				json['opinion'] = workflowopinioncontent;
			}
			epoint.execute("getoperate", "@none", epoint.encodeUtf8(epoint.encodeJson(json)),
					AjaxOperationHd);
		} catch (e) {
			// 提示错误信息
			if (value.indexOf('|') > -1) {
				var rtn = value.split('|');
				if (rtn[0] == "Alert") {
					epoint.alert(rtn[1], '提示', null, 'info');
					ShowTdOperate(true);
				} else if (rtn[0] == "Eval") {
					eval(rtn[1]);
					ShowTdOperate(true);
				}
			}
		}
	}
};

function HandleNextStep(OperationGuid, TransitionGuid, OperationType,
		btnbefore, btnafter) {
	// “通过”操作需要在表单的提交后通知本页面提交
	// 自定义外调函数按钮
	ShowTdOperate(false);
	var batchHandleGuid = null;
	try {
		batchHandleGuid = document.getElementById("hidIsBatchHandle").value;
	} catch (ee) {
	}
	if (OperationType == "Save" || OperationType == 60) {
		var btnId = "btnSaveFrom";
		if (batchHandleGuid != null && batchHandleGuid != "") {
			btnId = "btnSaveBatchHandle";
		}
		try {
			var saveBtn = getButton(btnId);
			if (saveBtn != null) {
				saveBtn.doClick();
			} else {
				HeaderSubmit();
			}
		} catch (er) {
			HeaderSubmit();
		}
	}
	else if (OperationType == "Custom" || OperationType == 1) {
		eval(btnafter);
	}
	else if (OperationType == "Pass" || OperationType == "Pass_Transition"
			|| OperationType == 10 || OperationType == 15) {
		// 先执行个性化的业务逻辑
		var btnId = "btnSubmit";
		if (batchHandleGuid) {
			btnId = "btnSubmitBatchHandle";
		}
		try {
			var btnSubmit = getButton(btnId);
			if (btnSubmit != null) {
				btnSubmit.doClick();
			} else {
				HeaderSubmit();
			}
		} catch (err) {
			HeaderSubmit();
		}
	} else if (OperationType == "DrawBack" || OperationType == 50) {
		//epoint.confirm('确认收回已发待办事项？', '收回', function() {
			HeaderSubmit();
			ShowTdOperate(true);
		//}, function(){ShowTdOperate(true);});
	} else {
		HeaderSubmit();
	}
};

function HeaderSubmit() {
	if (!transitionGuid) {
		transitionGuid = "";
	}
	var jsonreturn = {};
	jsonreturn['transitionguid'] = transitionGuid;
	jsonreturn['operationguid'] = operationGuid;
	jsonreturn['pviguid'] = urlparams.ProcessVersionInstanceGuid;
	jsonreturn['workitemguid'] = urlparams.WorkItemGuid;
	if (workflowopinioncontent) 
		jsonreturn['opinion'] = workflowopinioncontent;
	epoint.execute("getPageUrlOfOperate", "@none", epoint.encodeUtf8(epoint.encodeJson(jsonreturn)), AjaxOperationHd);
};

function CloseMe() {
	try {
	    if(top.messageCenter) {
	    	//调用主界面消息中心刷新按钮
	    	top.messageCenter.refresh();
	    }
	}catch(er){
		
	}
	// try {
	// var _button = mini.get("workflowopinion_button");
	// if (_button != null) {
	// _button.doClick();
	// }
	// } catch (er) {
	// }
	epoint.closeDialog('ok');
}

// 通用的ajax方法返回结果处理
function AjaxOperationHd(response) {
	if (response) {
		try {
			// 2016.9.21 by shengjia
			// 后台传入json数据，格式为:{'operationtype':'','url':'','message':''}
			// 如果能够通过epoint.decodeJson转换成功说明是9.2版本返回的json数据
			// 除数组和json格式其余epoint.decodeJson验证不通过
			var json = epoint.decodeJson(response);
			// 2017.5.18 by shengjia
			// 新增默认送下一步操作前提示“确认执行送下一步操作？”
			if (json.isdefoperation){
				var operationname = "送下一步";
				if(json.operationname){
					operationname = json.operationname;
				}
				epoint.confirm('确认执行' + operationname + '操作？', '确认', function() {
					epoint.execute("getoperate", "@none", epoint.encodeUtf8(epoint
							.encodeJson(json)), AjaxOperationHd);
				}, ShowTdOperate(true));
			}
			else if (json.url){ // 返回url需要打开操作处理页面
				OpenHandlePage(json.url);
			}
			else if (json.operationtype
					&& (json.operationtype == 25 || json.operationtype == "SendToSign")
					&& // 如果当前操作是送阅读并且message为空则需要保持当前页面，不关闭
					(!json.message || json.message == "Success")) {
				AfterClick();
				ShowTdOperate(true);
			} else if (!json.message || json.message == "Success") { // message为空则处理成功，关闭当前页面
				AfterClick();
				CloseMe();
			} else if (json.message) { // message不为空或者Success则处理出错，提示错误
				epoint.alert(json.message, '提示', null, 'info');
				ShowTdOperate(true);
			}
		} catch (er) {
			// 以下兼容老版本 ，9.2之前版本
			if (response == "refresh") {
				AfterClick();
				ShowTdOperate(true);
			} else {
				var rtn = response.split('|');
				if (rtn[0] == "Alert") {
					ShowTdOperate(true);
					epoint.alert(rtn[1], '提示', null, 'info');
				} else
					eval(response);
			}
		}
	}
	else
		ShowTdOperate(true);
};

function AfterClick() {
	if (afterbtn != null && afterbtn != "" && afterbtn != "undefined") {
		try {
			var btnSubmit = getButton(afterbtn);
			if (btnSubmit != null) {
				btnSubmit.doClick();
			}
		} catch (er) {
		}
	}
};

function ShowInfo(tag) {
	var info = $("#handlecontrols_helpinfo");
	if (tag == 0) {
		info.removeClass('hidden');
	} else {
		info.addClass('hidden');
	}
};

//打开流程追踪图
function ShowFlowChart() {
	epoint.execute("getCustomType", "@none",[pviGuid], openFlowChartPage);
};


function openFlowChartPage(args){
	if(args){
		var customFlag = args.flag;
		var newCustomProcess = args.newCustomProcess;
		if(customFlag && customFlag == "1" && newCustomProcess && newCustomProcess == "1"){
			epoint.openDialog("流程追踪",
					'frame/pages/epointworkflow/client/drawpc/drawpc?processVersionInstanceGuid='
							+ pviGuid, "");
		}else{
			epoint.openDialog("流程追踪", Util.addUrlParams('frame/pages/epointworkflow/client/processoa9browser?processVersionInstanceGuid=' + pviGuid, Util.getUrlParams(), "ignore"), "");
		}
	}
}


// 按钮区域的显隐控制
function ShowTdOperate(Is_Show) {
	if (Is_Show) {
		if ($("div[id$=handlecontrols_btnlst]").length > 0) {
			$("div[id$=handlecontrols_btnlst]").css('display', '')
		}
	} else {
		if ($("div[id$=handlecontrols_btnlst]").length > 0) {
			$("div[id$=handlecontrols_btnlst]").css('display', 'none')
		}
	}
}

// 窗口关闭时回调函数
window.onbeforeunload=function () {
	// 2017-4-5 改用top执行execute事件，解决js报错问题
	// 2017-5-12 兼容页面Url不带工作项guid的情况并且获取流程按钮时没有返回workitemguid
	if (workitemGuid && pviGuid) {
		epoint.execute("workItem_Unlock", "@none", [pviGuid, workitemGuid, ""]);
		
//		Util.ajax({
//		    url: 'epointworkflow/handlemainnomateriallistaction.action?cmd=workItem_Unlock',
//		    data: {
//		    	pviGuid: pviGuid,
//		    	workitemGuid:workitemGuid,
//		    	tag:"",
//            },
//            async:false
//		});
		
	}
}

function beforeUnlock() {
	// 2017-5-12 兼容页面Url不带工作项guid的情况并且获取流程按钮时没有返回workitemguid
	if (workitemGuid && pviGuid) {
		epoint.execute("workItem_Unlock", "@none", [pviGuid, workitemGuid, "norm"], UnlockCallBack);
	}
}

function UnlockCallBack(msg) {
	try {
		if (msg && msg == "refresh") {
			epoint.refresh();
		}
		if (msg.message && msg.message == "refresh") {
			epoint.refresh();
		}
	} catch (ee) {
	}

}

function getButton(id) {
	try {
		return mini.get(id);
	} catch (ee) {
	}
	return null;
}
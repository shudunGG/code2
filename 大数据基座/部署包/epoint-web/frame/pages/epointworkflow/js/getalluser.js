var PassStep = {
	urlparams: Util.getUrlParams(),
	tabtree: null,
	$sms: $("#sms")
};

PassStep = $.extend({}, PassStep, {
	workitemguid: PassStep.urlparams.workitemguid,
	// 当前工作项标识
	stepguid: PassStep.urlparams.stepguid,
	// 当前按钮标识
	sms_chk: mini.get("sms_chk"),
	smscontent: mini.get("smscontent")
});

$(function () {
	//可个性化actionname
	window.handleactionname = window.handleactionname || "commonoperationhandleaction";

	//选人树actionname，可个性化
	window.workflowtreeactionname = window.workflowtreeactionname || "workflowtreeaction";

	var $memberlist = $("#memberlist");

	var M = Mustache,
		selectMemberTmpl = $("#selectMemberTmpl").html();

	// 初始化页面
	epoint.execute(window.handleactionname + '.getStepInfo', "@none", [PassStep.workitemguid, PassStep.stepguid], function (data) {
		render(data);
		Util.hidePageLoading();
	});

	// 渲染页面
	var render = function (jsonString) {
		var data = epoint.decodeJson(jsonString);
		if (!data.smsvisible) {
			PassStep.$sms.remove();
			$memberlist.addClass("nosms");
		} else {
			PassStep.sms_chk.setChecked(data.smschecked);
			PassStep.smscontent.setValue(data.smscontext);
		}
		if (data.addhandler) {
			var tabsConfig = [];
			if (!data.handlertree) {
				data.handlertree = [{
					"type": "ownou",
					"name": "本部门"
				}, {
					"type": "ou",
					"name": "所有用户"
				}];
			}
			var key = "ownou";
			$.each(data.handlertree,
				function (i, e) {
					if (i === 0) {
						key = e.type;
					}
					if (!e.name) {
						switch (e.type) {
							case "subwebflowou":
								e.name = "本单位";
								break;
							case "ou":
								e.name = "所有用户";
								break;
							case "ownou":
								e.name = "本部门";
								break;
							case "address":
								e.name = "地址簿";
								break;
							case "jobrole":
								e.name = "岗位";
								break;
							default:
								break;
						}
					}
					tabsConfig.push({
						tabText: e.name,
						tabKey: e.type
					})
				});

			PassStep.tabtree = new mini.TabsTreeSelect(); // 构造树
			PassStep.tabtree.set({
				url: Util.getRightUrl(epoint.dealRestfulUrl(window.workflowtreeactionname + "/getTreeOuModel")),
				width: "100%",
				height: "100%",
				tabs: tabsConfig,
				filterMode: "server",
				action: window.workflowtreeactionname + ".getTreeOuModel"
			});
			PassStep.tabtree.on("drawnode", function (e) {
				if (e.isLeaf) {
					if (e.iconCls === null || e.iconCls !== "mini-tree-folder") {
						//e.iconCls = "msg-org-people";
					}
				}
			}).on("nodeclick", function (e) {

			});
			PassStep.tabtree.tree.on("beforenodecheck", function (e) {
				if (e.node.ckr === false) {
					e.cancel = true;
				}
			});
			PassStep.tabtree.render(document.getElementById("memberlist"));
			DtoUtils.bindBeforeLoad();
			//如果第一个选项不是本部门需要带上参数
			epoint.initPage(window.workflowtreeactionname + "?tabKey=" + key);
			//epoint.initPage("workflowtreeaction");
		} else { // 不能添加成员
			if (!data.edithandler) {
				$memberlist.addClass("noedit");
			} else {
				bindSelectedEvent();
			}

			if (data.handlerlist) {
				var fixdata = {
					candelete: data.edithandler,
					memberlist: data.handlerlist
				};
				$memberlist.empty().html(M.render(selectMemberTmpl, fixdata));
			}
			var inithtml = $("ul", $memberlist).html();
			$memberlist.data("initHtml", inithtml);
		}
	};

	var bindSelectedEvent = function () {
		$memberlist.on("click", ".removeall", function () {
			$("ul", $memberlist).empty();
		}).on("click", ".recover", function () {
			$("ul", $memberlist).html($memberlist.data("initHtml"));
		}).on("click", ".remove", function () {
			$(this).closest("li").remove();
		}).on('click', '.mini-tabstreeselect-item', function () {
			$(this).siblings().removeClass("selected").end().addClass('selected');
		});
	};
});

// 获取步骤数据，供父页面调用
window.getDealData = function () {
	var data = {
		'stepguid': PassStep.stepguid
	};
	if ($("#sms").length) {
		data = $.extend(data, {
			'sendsms': PassStep.sms_chk.getChecked(),
			'sendsms_jjcd': mini.get("smsjj").getValue(),
			'smscontext': PassStep.smscontent.getValue()
		});
	}

	if (PassStep.tabtree) {
		var vals = PassStep.tabtree.getValue();
		if (vals.length) {
			data.handlerlist = {
				'values': vals,
				'texts': PassStep.tabtree.getText()
			};
		}
	} else {
		var $li = $("li", $("#memberlist"));
		if ($li.length) {
			data.handlerlist = [];
			$li.each(function (i, li) {
				var handlerdata = {};
				handlerdata.handlerguid = $(li).data("handlerguid");
				handlerdata.handlername = $(li).data("handlername");
				handlerdata.ouguid = $(li).data("ouguid");
				data.handlerlist.push(handlerdata);
			});
		}
	}
	return data;
};
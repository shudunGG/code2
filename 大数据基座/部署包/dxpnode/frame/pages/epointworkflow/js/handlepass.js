$(function() {
	if (!window.handleactionname) // 可个性化actionname
		window.handleactionname = "commonoperationhandleaction";

	if (!window.getalluserurl) // 设置commonoperationhandlepass标签页打开地址
		window.getalluserurl = "dlguser/getalluser";

	if (typeof window.isexecutebtnsubmit != "boolean") // 点击确认按钮是否执行后台btnsubmit方法，框架默认执行
		window.isexecutebtnsubmit = true;

	if (!window.workflowtreeactionname) // 选人树actionname，可个性化
		window.workflowtreeactionname = "workflowtreeaction";

	var transactorcount = [];
	var isShowSms = false;
	var is_ShowAdvicetab = false;
	var urlparams = Util.getUrlParams(),
	// 当前工作项标识
	workitemguid = urlparams.workItemGuid,
	// 当前流程版本实例标识
	processVersionInstanceGuid = urlparams.processVersionInstanceGuid,
	// 当前按钮标识
	operationguid = urlparams.operationGuid,
	// 当前步骤
	currentstepguid = urlparams.stepguid;

	// 步骤选择区域 commonoperationhandleback和commonoperationhandlepass
	var $steplist = $("#steplist"),
	// 选择步骤后打开选人标签区域 commonoperationhandlepass
	$steptab = $("#steptab"),
	// 选人标签区域 commonoperationhandlepass
	$steptabhd = $(".step-tab-hd", $steptab),
	// 选人标签区域 commonoperationhandlepass
	$steptabbd = $(".step-tab-bd", $steptab),
	// 工作项历史记录grid commonoperationhandleback和commonoperationhandlesign
	$datagrid = mini.get("workitemdatagrid"),
	// 包裹工作项历史记录grid的div根据短信区域是否显示控制高度变化 commonoperationhandleback
	$workitemdiv = $("#workitemdiv"),
	// 公共意见模板区域 commonoperationhandleback和commonoperationhandlesign
	$commonopinionlist = $("#commonopinionlist"),
	// 个人意见模板区域 commonoperationhandleback和commonoperationhandlesign
	$useropinionlist = $("#useropinionlist"),
	// 意见填写区域 commonoperationhandleback和commonoperationhandlesign
	$opinioncontent = mini.get("opinioncontent"),
	// 短信配置区域
	// commonoperationhandlepass_singletransition和commonoperationhandleback
	$sms = $("#sms"),
	// 短信发送是否勾选
	// commonoperationhandlepass_singletransition和commonoperationhandleback
	$sms_chk = $("#sms_chk"),
	// 短信内容 commonoperationhandlepass_singletransition和commonoperationhandleback
	$smscontent = $("#smscontent"),
	// 当前步骤 所有页面
	$currstep = $("#curr_step"),
	// 当前操作 所有页面
	$currop = $("#curr_op"),
	// 提交按钮 所有页面
	$btnbar = $("#btnbar"),
	// 选人树区域 commonoperationhandlepass_singletransition
	$memberlist = $("#memberlist"),
	// 选人树 commonoperationhandlepass_singletransition
	tabtree = null;
	var M = Mustache, stepTmpl = $("#stepTmpl").html(), stepSingleTmpl = $(
			"#stepSingleTmpl").html(), tabTmpl = $("#tabTmpl").html(), opinionTmpl = $(
			"#opinionTmpl").html(), selectMemberTmpl = $("#selectMemberTmpl")
			.html();

	// 初始化页面
	epoint.execute(window.handleactionname + '.initPage', "", function(data) {
		render(data);
		Util.hidePageLoading();
	});

	// 渲染页面
	var render = function(jsonString) {
		var data = epoint.decodeJson(jsonString);
		if (!data) {
			epoint.alert('数据为空,初始化页面失败！', '提示', function() {
				epoint.closeDialog();
			}, 'error');
			return;
		}
		if ($currstep.length > 0 && data.activityname)
			$currstep.text(data.activityname);
		if ($currop.length > 0 && data.operationname)
			$currop.text(data.operationname);

		// 初始化步骤区域
		if ($steplist.length > 0) {
			var steplist = data.nextsteplist;
			is_ShowAdvicetab = data.is_ShowAdvicetab;
			if (!steplist || !steplist.data) {
				if (!is_ShowAdvicetab) {
					epoint.alert('没有可选择步骤！', '提示', function() {
						epoint.closeDialog();
					});
					return;
				}
			}

			if (steplist.issinglecheck)
				$steplist.empty().html(M.render(stepSingleTmpl, steplist));
			else
				$steplist.empty().html(M.render(stepTmpl, steplist));
			if ($steptab.length > 0) {
				$.each(steplist.data, function(i, e) {
					if (e.checked) {
						if (e.subnextsteplist) {
							$.each(e.subnextsteplist.data, function(j, s) {
								if (s.checked) {
									addStepTab(s.stepguid, s.stepname);
								}
							})
						} else {
							addStepTab(e.stepguid, e.stepname);
						}
					}
					if (e.transactormaxcount && e.transactormaxcount > 0) {
						var item = {
							name : e.stepguid,
							count : e.transactormaxcount
						};
						transactorcount.push(item);
					}
				})
			}
		} else {
			if (data.nextsteplist && data.nextsteplist.data
					&& data.nextsteplist.data[0]
					&& data.nextsteplist.data[0].transactormaxcount
					&& data.nextsteplist.data[0].transactormaxcount > 0) {
				var item = {
					name : data.nextsteplist.data[0].stepguid,
					count : data.nextsteplist.data[0].transactormaxcount
				};
				transactorcount.push(item);
			}
		}

		// 初始化意见区域
		if ($opinioncontent && data.opinion) {
			if (parent.workflowopinioncontent)
				$opinioncontent.setValue(parent.workflowopinioncontent);
			else
				$opinioncontent.setValue(data.opinion.text);
			$opinioncontent.setRequired(data.opinion.required);
			$opinioncontent.setRequiredErrorText("请签署意见！");
			if ($commonopinionlist.length > 0 && data.opinion.commonopinionlist)
				$commonopinionlist.empty().html(
						M.render(opinionTmpl, data.opinion.commonopinionlist));
			if ($useropinionlist.length > 0 && data.opinion.useropinionlist)
				$useropinionlist.empty().html(
						M.render(opinionTmpl, data.opinion.useropinionlist));
		}

		// 初始化处理历史
		if ($datagrid && data.workitemlist) {
			$datagrid.setData(data.workitemlist.data);
			$datagrid.setTotalCount(data.workitemlist.total);
		}

		// 初始化选人树
		var stepinfo = null;
		if ($memberlist.length > 0) {
			if (data.nextsteplist && data.nextsteplist.data
					&& data.nextsteplist.data.length > 0) {
				stepinfo = data.nextsteplist.data[0];
			}

			var show = true;

			if (stepinfo == null) {
				stepinfo = {
					"smsvisible" : true,
					"smschecked" : false,
					"smscontext" : "",
					"handlertree" : [ {
						"type" : "ownou",
						"name" : "本部门"
					}, {
						"type" : "ou",
						"name" : "所有用户"
					} ]
				}
			} else if (!stepinfo.addhandler) {
				show = false;
			}

			if (show) {
				if (!currentstepguid && stepinfo.stepguid) {
					currentstepguid = stepinfo.stepguid;
				}
				if ($sms.length > 0) {
					if (!stepinfo.smsvisible) {
						$sms.remove();
						if ($memberlist.length > 0)
							$memberlist.addClass("nosms");
					} else {
						isShowSms = true;
						if ($sms_chk.length > 0)
							$sms_chk.prop("checked", stepinfo.smschecked);
						if ($smscontent.length > 0) {
							$smscontent.val(stepinfo.smscontext);
						}
					}
				}

				var tabsConfig = [], vals = [], texts = [];
				if (!stepinfo.handlertree) {
					stepinfo.handlertree = [ {
						"type" : "ownou",
						"name" : "本部门"
					}, {
						"type" : "ou",
						"name" : "所有用户"
					} ];
				}
				var key = "ownou";
				$.each(stepinfo.handlertree, function(i, e) {
					if (i == 0)
						key = e.type;
					if (!e.name) {
						switch (e.type) {
						case "subwebflowou": {
							e.name = "本单位";
							break;
						}
						case "ou": {
							e.name = "所有用户";
							break;
						}
						case "ownou": {
							e.name = "本部门";
							break;
						}
						case "address": {
							e.name = "地址簿";
							break;
						}
						case "jobrole":{
							e.name = "岗位";
							break;
						}
						default:
							break;
						}
					}
					tabsConfig.push({
						tabText : e.name,
						tabKey : e.type
					})
				});

				tabtree = new mini.TabsTreeSelect(); // 构造树
				tabtree.set({
					url : Util.getRightUrl(epoint
							.dealRestfulUrl(window.workflowtreeactionname
									+ "/getTreeOuModel")),
					width : "100%",
					height : "100%",
					tabs : tabsConfig,
					filterMode : "server",
					action : window.workflowtreeactionname + ".getTreeOuModel"
				});
				tabtree.on("drawnode", function(e) {

					if (e.isLeaf) {
						// e.iconCls = "msg-org-people";
					}
				}).on("nodeclick", function(e) {

				});
				tabtree.render(document.getElementById("memberlist"));
				DtoUtils.bindBeforeLoad();
				// 如果第一个选项不是本部门需要带上参数
				epoint.initPage(window.workflowtreeactionname + "?tabKey="
						+ key);
				// epoint.initPage("workflowtreeaction");
			} else { // 不能添加成员
				if (!stepinfo.edithandler) {
					$memberlist.addClass("noedit");
				} else {
					bindSelectedEvent();
				}

				if (stepinfo.handlerlist) {
					var fixdata = {
						candelete : stepinfo.edithandler,
						memberlist : stepinfo.handlerlist
					};
					$memberlist.empty().html(
							M.render(selectMemberTmpl, fixdata));
				}
				var inithtml = $("ul", $memberlist).html();
				$memberlist.data("initHtml", inithtml);
			}
		}
		// 初始化短信区域
		if ($sms.length > 0 && !isShowSms) {
			if (!data.smsvisible) {
				$sms.remove();
				if ($workitemdiv.length > 0)
					$workitemdiv.addClass("nosms");
			} else {
				isShowSms = true;
				if ($sms_chk.length > 0)
					$sms_chk.prop("checked", data.smschecked);
				if ($smscontent.length > 0)
					$smscontent.val(data.smscontext);
			}
		}
	}

	if ($steplist.length > 0) {
		// 改变步骤状态
		var changeStepStatus = function($li, ischeck) {
			if ($steplist.length == 0)
				return;
			var stepguid = $li.data("stepguid"), name = $li.data("name");
			$(".step-chk", $li).prop("checked", ischeck);
			if (ischeck) {
				$li.addClass("check");
				// 送下一步步骤选择需要打开tab页
				if ($steptab.length > 0) {
					if ($li.hasClass("has-sub")) {
						var $sli = $("li.check", $li);
						stepguid = $sli.data("stepguid");
						name = $sli.data("name");
						if ($sli.length) {
							addStepTab(stepguid, name);
						}
					} else {
						addStepTab(stepguid, name);
					}
				}
			} else {
				$li.removeClass("check");
				// 送下一步步骤取消需要关闭tab页
				if ($steptab.length > 0) {
					if ($li.hasClass("has-sub")) {
						var $sli = $("li.check", $li);
						if ($sli.length > 0) {
							stepguid = $sli.data("stepguid");
							removeStepTab(stepguid);
						}
					} else {
						removeStepTab(stepguid);
					}
				}
			}
		}

		// 添加选人tab
		var addStepTab = function(stepguid, name) {
			if ($steptab.length == 0)
				return;
			if (!$steptab.is(':visible')) {
				$steptab.show();
			}
			var $thd = $(
					"<span class='active' data-target=" + stepguid + ">" + name
							+ "</span>").appendTo($steptabhd);
			var param = window.location.search;
			if (param.indexOf("?") > -1) {
				param = param.substr(param.indexOf("?") + 1);
			}
			var url = window.getalluserurl + "?stepguid=" + stepguid + "&"
					+ param;
			$steptabbd.append(M.render(tabTmpl, {
				id : stepguid,
				url : url
			}));
			$thd.trigger("click");
		}

		// 移除选人tab
		var removeStepTab = function(stepguid) {
			if ($steptab.length == 0)
				return;
			var $thd = $('span[data-target="' + stepguid + '"]', $steptabhd), $tbd = $steptabbd
					.children('div[data-id="' + stepguid + '"]');
			if ($thd.hasClass("active")) {
				var activehb;
				activehb = $thd.next();
				if (activehb.length == 0) {
					activehb = $thd.prev();
				}
				if (activehb.length > 0) {
					activehb.trigger("click");
				} else {
					$steptab.hide();
				}
			}
			$thd.remove();
			var iframe = $("iframe", $tbd);
			Util.clearIframe(iframe);
			$tbd.remove();
		}

		// 步骤列表事件
		$steplist
				.on(
						"click",
						".step-name",
						function(e) {
							var $self = $(this), $li = $self.closest("li"), isSingleCheck = $self
									.closest(".step-list")
									.data("issinglecheck");
							var currCheck = $li.hasClass("check");
							if (isSingleCheck) {
								var $othli = $li.siblings("li.check");
								if ($othli.length > 0) {
									changeStepStatus($othli, false);
									changeStepStatus($li, !currCheck);
								}
							} else
								changeStepStatus($li, !currCheck);
						})
				.on(
						"click",
						".sub-step-item ",
						function(e) {
							var $li = $(this), $selfli = $li.closest("li"), stepguid = $li
									.data("stepguid"), name = $li.data("name"), _checktype = $(
									this).data('checktype'), isSingleCheck = $li
									.closest(".sub-step-list").data(
											"issinglecheck");
							;
							// if ($li.hasClass("check")){
							// return false;
							// }
							var currCheck = $li.hasClass("check");
							if (isSingleCheck) {
								if ($li.hasClass("check"))
									return false;
								var $origli = $li.siblings("li.check");
								if ($origli.length) {
									$origli.removeClass("check").children(
											".sub-step-chk").prop("checked",
											false);
									if ($steptab.length > 0)
										removeStepTab($origli.data("stepguid"));
								}
								$li.addClass("check").children(".sub-step-chk")
										.prop("checked", true);
								if ($steptab.length > 0)
									addStepTab(stepguid, name);
							} else {
								if ($li.hasClass("check")) {
									changeStepStatus($li, false);
									$li.removeClass("check").children(
											".sub-step-chk").prop("checked",
											false);
								} else {
									$li.addClass("check").children(
											".sub-step-chk").prop("checked",
											true);
									if ($steptab.length > 0)
										addStepTab(stepguid, name);
								}
							}
						})
	}

	if ($steptab.length > 0) {
		// 步骤tab切换
		$steptabhd.on("click", "span", function(e) {
			var $self = $(this), targetId = $self.data("target");
			$self.siblings().removeClass("active").end().addClass("active");
			var $tab = $steptabbd.children('div[data-id="' + targetId + '"]');
			$tab.siblings().hide().end().show();
		})
	}

	if ($btnbar.length > 0) {
		// 提交 拼接json返回给流程处理页面推送流程流转
		mini
				.get("btnsubmit")
				.on(
						"click",
						function(e) {
							var params = {
								'pviguid' : processVersionInstanceGuid,
								'workitemguid' : workitemguid,
								'operationguid' : operationguid
							}, flag = true;

							// 判断时候必须填写意见，并拼接意见字段
							if ($opinioncontent) {
								if (!epoint.validate()) {
									return false;
								}
								if (!$opinioncontent.getValue()) {
									epoint.alert('请签署意见！', '提示', null,
											'warning');
									return false;
								} else
									params['opinion'] = $opinioncontent
											.getValue();
							} else if (parent.workflowopinioncontent) {
								params['opinion'] = parent.workflowopinioncontent;
							}

							// 判断是否勾选后续步骤，并拼接步骤信息
							if ($steplist.length > 0) {
								if (!is_ShowAdvicetab) {
									var $selectli = $(".step-item.check",
											$steplist), stepguid, name;
									if ($selectli.children().length == 0) {
										epoint.alert('请选择步骤！', '提示', null,
												'warning');
										return false;
									}
									params['nextsteplist'] = [];
									$selectli
											.each(function(i, s) {
												if (!flag)
													return false;
												var stepguid = $(this).data(
														"stepguid"), name = $(
														this).data("name"), ischeckuser = $(
														this).data(
														"ischeckuser"), stepdata = {
													'stepguid' : stepguid
												};
												if ($(this).hasClass("has-sub")) { // 分支
													stepdata.stepguid = stepguid;
													stepdata.subnextsteplist = [];
													var $sli = $("li.check",
															$(this));
													$
															.each(
																	$sli,
																	function(i,
																			ss) {
																		childstepguid = $(
																				ss)
																				.data(
																						"stepguid");
																		childname = $(
																				ss)
																				.data(
																						"name");
																		var substepdata = {
																			'stepguid' : childstepguid
																		};
																		if ($steptab.length > 0) {
																			substepdata = getStepData(
																					childstepguid,
																					childname,
																					ischeckuser);
																		}
																		userString2UserList(substepdata);
																		if (ischeckuser
																				&& !substepdata) {
																			flag = false;
																			return false;
																		}
																		stepdata.subnextsteplist
																				.push(substepdata);
																		stepdata.handlerlist = substepdata.handlerlist;
																	})
												} else {
													if ($steptab.length > 0)
														stepdata = getStepData(
																stepguid, name,
																ischeckuser);
													if (ischeckuser
															&& !stepdata) {
														flag = false;
													}
													if (flag
															&& transactorcount
															&& transactorcount.length > 0) {
														for (var i = 0; i < transactorcount.length; i++) {
															if (transactorcount[i].name == stepguid) {
																var count = transactorcount[i].count;
																if (count
																		&& count > 0) {
																	if (stepdata.handlerlist.values) {
																		var length = stepdata.handlerlist.values
																				.split(',').length;
																	} else {
																		var length = stepdata.handlerlist.length;
																	}
																	if (count < length) {
																		epoint
																				.alert(
																						'步骤'
																								+ name
																								+ '选择的处理人超过了限制的'
																								+ count
																								+ '人,请减少该步骤的处理人!',
																						'提示',
																						null,
																						'warning');
																		flag = false;
																		return false;
																	}
																}
															}
														}
													}
												}
												params.nextsteplist
														.push(stepdata);
											})
									if (!flag) {
										return false;
									}
								}
							}

							// 不显示步骤信息页面拼接处理人列表和是否发送短信信息
							if ($memberlist.length > 0) {
								params['nextsteplist'] = [];
								var stepuserdata = {};
								if (currentstepguid)
									stepuserdata.stepguid = currentstepguid;
								if (tabtree) {
									var vals = tabtree.getValue();
									if (vals.length) {
										if (transactorcount
												&& transactorcount.length > 0) {
											for (var i = 0; i < transactorcount.length; i++) {
												if (transactorcount[i].name == currentstepguid) {
													var count = transactorcount[i].count;
													if (count && count > 0) {
														var length = vals
																.split(',').length;
														if (count < length) {
															epoint
																	.alert(
																			'选择的处理人超过了限制的'
																					+ count
																					+ '人,请减少该步骤的处理人!',
																			'提示',
																			null,
																			'warning');
															return false;
														}
													}
												}
											}
										}
										stepuserdata.handlerlist = {
											'values' : vals,
											'texts' : tabtree.getText()
										}
									} else {
										epoint.alert('请选择处理人员！', '提示', null,
												'warning');
										return false;
									}
									if (isShowSms) {
										stepuserdata.sendsms = $sms_chk
												.prop("checked");
										stepuserdata.sendsms_jjcd = mini.get(
												"smsjj").getValue();
										stepuserdata.smscontext = $smscontent
												.val();
									}
								} else {
									var $li = $("li", $("#memberlist"));
									if ($li.length) {
										stepuserdata.handlerlist = [];
										$li.each(function(i, e) {
											var handlerdata = {};
											handlerdata.handlerguid = $(this)
													.data("handlerguid");
											handlerdata.handlername = $(this)
													.data("handlername");
											handlerdata.ouguid = $(this).data(
													"ouguid");
											stepuserdata.handlerlist
													.push(handlerdata);
										})
									} else {
										epoint.alert('请选择处理人员！', '提示', null,
												'warning');
										return false;
									}
									if (isShowSms) {
										stepuserdata.sendsms = $sms_chk
												.prop("checked");
										stepuserdata.sendsms_jjcd = mini.get(
												"smsjj").getValue();
										stepuserdata.smscontext = $smscontent
												.val();
									}
								}
								params.nextsteplist.push(stepuserdata);
							}

							// 全局设置是否发送短信时，拼接是否发送短信
							if (isShowSms) {
								params['sendsms'] = $sms_chk.prop("checked");
								params['sendsms_jjcd'] = mini.get("smsjj")
										.getValue();
								params['smscontext'] = epoint
										.encodeUtf8($smscontent.val());
							}

							// 是否执行action方法
							if (window.isexecutebtnsubmit) {
								epoint
										.execute(
												window.handleactionname
														+ '.btnsubmit',
												"",
												epoint.encodeUtf8(epoint
														.encodeJson(params)),
												function(data) {
													if (data.message) {
														epoint
																.closeDialog(data.message);
													}
												});
							} else {
								epoint.closeDialog(epoint.encodeUtf8(epoint
										.encodeJson(params)));
							}
						});
		mini.get("btncancel").on("click", function(e) {
			epoint.confirm('您将放弃本次流程处理，确认关闭？', '提示', function() {
				epoint.closeDialog('close');
			});
		});
	}

	if ($commonopinionlist.length > 0) {
		$commonopinionlist.on("click", ".step-chk", function(e) {
			var $self = $(this), $li = $self.closest("li");
			if ($self.prop("checked") == true) {
				$opinioncontent.setValue($opinioncontent.getValue()
						+ $li.data("opiniontext"));
			} else {
				$opinioncontent.setValue($opinioncontent.getValue().replace(
						$li.data("opiniontext"), ""));
			}
		})
	}

	if ($useropinionlist.length > 0) {
		$useropinionlist.on("click", ".step-chk", function(e) {
			var $self = $(this), $li = $self.closest("li");
			if ($self.prop("checked") == true) {
				$opinioncontent.setValue($opinioncontent.getValue()
						+ $li.data("opiniontext"));
			} else {
				$opinioncontent.setValue($opinioncontent.getValue().replace(
						$li.data("opiniontext"), ""));
			}
		})
	}

	if ($("#addmyopiniondiv").length > 0) {
		$("#addmyopiniondiv")
				.on(
						"click",
						".step-chk",
						function(e) {
							var $self = $(this);
							if ($self.prop("checked") == true) {
								var text = $opinioncontent.getValue();
								if (text) {
									var showText=$('<div/>').text(text).html();
									epoint
											.execute(
													window.handleactionname
															+ '.addintoopinion',
													"@none",
													[ showText ],
													function(data) {
														if (data.message) {
															epoint
																	.alert(
																			data.message,
																			'提示');
															if (data.opinionguid) {
																var opinion = $('#useropinionlist>.opiniontmpl-list');
																var html = "<li class='opiniontmpl-item' data-opiniontext="
																		+ showText
																		+ " data-opinionguid="
																		+ data.opinionguid
																		+ "><input class='step-chk' type='checkbox'><span>"
																		+ showText
																		+ "</span></li>";
																opinion
																		.append(html);
															}
															// ie中有时意见框会无法获取焦点，这里强制其获取焦点
															$opinioncontent
																	.focus();
														}
													});
								} else {
									epoint.alert('添加个人意见为空！', '提示', null,
											'warning');
								}
								$self.prop("checked", false);
							}
						})

	}

	var bindSelectedEvent = function() {
		$memberlist.on("click", ".removeall", function() {
			$("ul", $memberlist).empty();
		}).on("click", ".recover", function() {
			$("ul", $memberlist).html($memberlist.data("initHtml"));
		}).on("click", ".remove", function() {
			$(this).closest("li").remove();
		}).on(
				'click',
				'.mini-tabstreeselect-item',
				function() {
					$(this).siblings().removeClass("selected").end().addClass(
							'selected');
				})
	}

	// 从步骤子页面获取数据
	var getStepData = function(stepid, name, ischeckuser) {
		if ($steptab.length == 0)
			return {};
		var $tab = $steptabbd.children('div[data-id="' + stepid + '"]');
		var data = $("iframe", $tab)[0].contentWindow.getDealData();

		if (ischeckuser && !data.handlerlist) {
			epoint.alert(name + '未选择人员！', '提示', null, 'warning');
			return false;
		}
		data.stepguid = stepid;
		return data;
	}

	var userString2UserList = function(data) {
		var userGuidArray = data.handlerlist.values.split(',');
		var userNameArray = data.handlerlist.texts.split(',');
		var handerlist = [];
		for (var x = 0, size = userGuidArray.length; x < size; x++) {
			handerlist.push({
				"handlerguid" : userGuidArray[x],
				"handlername" : userNameArray[x]
			});
		}
		data.handlerlist = handerlist;
	}
})
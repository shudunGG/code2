var domain = 'test/';
var pageConfig = {
	pageInfo : domain + 'pageInfo', // 顶部信息
	leftMenu : domain + 'leftMenu', // 左侧菜单
	getContent : domain + 'getContent', // 设计数据
	deleteDrawNode : domain + 'deleteDrawNode', // 删除节点
	getPreviewData : domain + 'getPreviewData', // 预览数据
	save : domain + 'save', // 保存
	othersave : domain + 'othersave', // 另存
	release : domain + 'release', // 发布
	onShowContextMenu : function(data) {

	},
	// 返回首页
	backHome : function() {
		location.replace("../../../../frame/fui/pages/themes/datamode/index");
		/*
		 * epoint .confirm( '返回首页是否保存', '提醒', function() { location
		 * .replace("../../../../frame/fui/pages/themes/datamode/index"); })
		 */
	},
	// 顶部图标操作事件
	topClickEvent : function(opt) {
		var type = opt.type;
		// 保存
		if (type === 'save') {
			epoint.openTopDialog("保存模型",
					'frame/pages/eianalysemis/modulemanagega/modeledit?rowguid='
							+ rowguid, function(ret) {
					}, {
						'width' : 600,
						'height' : 250
					});
		} else if (type === 'othersave') { // 另存为
			var saveData = handleChart.getData();
			// console.log(saveData);
			epoint.openDialog("模型另存为", './modeladd?type=0&historyguid='
					+ rowguid, function(ret) {

			}, {
				'width' : 1000,
				'height' : 450
			});
		} else if (type === 'prev') { // 撤销
			handleChart.prev();
		} else if (type === 'next') { // 恢复
			handleChart.next();
		} else if (type === 'clear') { // 清空
			epoint.confirm('是否确认清空？', '提醒', function() {
				handleChart.clear();
				epoint.execute('dxpmodeldesignjobaction.deleteAll', null, null,
						function(ret) {
							if (ret) {
								epoint.showTips(ret, {
									state : "success"
								});
							} else {
								epoint.showTips('清空失败,请联系管理员!', {
									state : "error"
								});
							}
						});
			});
		} else if (type === 'scale') { // 缩放

		} else if (type === 'init') { // 定位
			handleChart.init();
		} else if (type === 'del') { // 删除
			var allcontent = myDiagram.model.toJSON();
			var selectNode = '', selectNodeData = '';
			var count = myDiagram.selection.count;
			if (count == 1) {
				myDiagram.selection.each(function(item) {
					selectNode = item;
					selectNodeData = selectNode.part.data;
				})
			} else {
				epoint.showTips('请选择一个节点或者连线');
				return;
			}

			// 非空表示的是图形
			if (!selectNodeData.to) {
				// 节点
				epoint.execute('dxpmodeldesignjobaction.deleteDrawNode', null, [
						selectNodeData.key, allcontent ], function(ret) {
					handleChart.del();
				});
			} else {
				// 连线
				epoint.execute('dxpmodeldesignjobaction.deleteDrawLine', null, [
						selectNodeData.from, selectNodeData.to, allcontent ],
						function(ret) {
							handleChart.del();
						});// 删除连线
			}
		} else if (type === 'do') { // 立即执行

			$('#datapreview').removeClass('active').siblings().addClass(
					'active');
			$('#log-preview').addClass('hidden').siblings().removeClass(
					'hidden');

			// 立即运行
			/*
			 * if (document.getElementById("handle-icon-text").innerHTML ==
			 * '运行中(查看日志)' && thisrunguid) { epoint.openDialog('模型执行记录',
			 * 'frame/pages/eianalysemis/jobrunlog/taskruninfolist?rowguid=' +
			 * thisrunguid, null, { 'width' : 1500, 'height' : 750 }); }
			 */
			// else {
			epoint.execute("dxpmodeldesignjobaction.startJobNow", null, [], function(
					data) {
				if (data.failed && data.failed == '1') {// 标识启动失败
					epoint.showTips(data.msg, {
						state : "error"
					});
					return;
				} else {
					epoint.alert("启动成功!");
					// 启动成功 监听模型运行状态
					// var currentImage = "images/top/wait.gif";
					// document.getElementById("handle-icon-do").style.backgroundImage
					// = "url('"
					// + currentImage + "')";
					// document.getElementById("handle-icon-text").innerHTML =
					// '运行中(查看日志)';
					// thisrunguid = data.msg;
					// // 增加轮询
					// InterStatus = setInterval(function() {
					// listenRunStatus(data.msg);
					// }, 5000);
				}
			});
			// }

		} else if (type === 'release') { // 发布
			var saveData = handleChart.getData();

			epoint.confirm('是否确认发布？', '提醒', function() {
				epoint.execute('dxpmodeldesignjobaction.deploymodel', null,
						[ rowguid ], function(ret) {
							if (ret.msg) {
								epoint.alertAndClose(ret.msg);
							} else {
								epoint.alertAndClose("发布失败,请联系管理员!");
							}
						});
			});
		}
	},
	// 打开配置
	openConfig : function(opt) {
		var nodeData = opt.nodeData, linkCount = opt.linkCount;

		if (nodeData.maxlinks && (linkCount < Number(nodeData.maxlinks))) {
			// 判断有最小连接的数操作能否打开
			epoint.showTips('请配置' + nodeData.maxlinks + '个输入源', {
				state : "warning"
			});
			return;
		}
		var width = 1000;
		var height = 600;
		var openurl = 'frame/pages/eianalysemis/modulemanagega/normalmodeladd?rowguid='
				+ nodeData.key + '&fromdeisgn=true' + '&modelguid=' + rowguid;
		if (nodeData.designpage) {
			var page = nodeData.designpage;
			if (page.indexOf(",") > 0) {
				var seg = page.split(',');
				width = seg[1];
				height = seg[2];
				page = seg[0];
			}
			openurl = "frame/pages/eianalysemis/modulemanagega/stepeditor/"
					+ page + "?rowguid=" + nodeData.key + "&fromdeisgn=true"
					+ "&modelguid=" + rowguid;
		}

		epoint.openDialog("参数修改", openurl, function(param) {
			if (param != 'close') {
				$("#count").html('0');
				tempstatus = true;
				showdatapreview();
				if (nodeData.extraction
						&& nodeData.extraction.indexOf("initnocount") != -1) {
					beginLoadStatus(nodeData.key, false, 0);
				} else {
					beginLoadStatus(nodeData.key, false, 1);
				}
				if (param) {
					myDiagram.model.setDataProperty(nodeData, 'name', param);
				}
			}
		}, {
			'width' : width,
			'height' : height
		});

	},
	// 右键事件
	contextClickEvent : function(opt) {
		var type = opt.type, nodeData = opt.nodeData;

		// 配置
		var node = myDiagram.findNodeForKey(nodeData.key);

		if (type === 'config') {
			var _nodeData = nodeData, _linkLists = node.findLinksConnected(), _linkCount = _linkLists.count;
			this.openConfig({
				nodeData : _nodeData,
				linkCount : _linkCount
			});
		} else if (type === 'preview') { // 预览数据
			// 预览数据的
			if (nodeData.extraction == 'preview') {
				// 实验室状态没好提示不能预览
				/*
				 * if (!mini.get("livysession").getValue()) {
				 * epoint.showTips('实验室状态获取失败,请确认实验室是否开启!"', { state : "warning"
				 * }); return; }
				 */
				// 直接根据node上状态判断，没必要再后台执行了
				if (nodeData.status != 3) {
					epoint.showTips('此步骤运行状态还未成功,暂不支持预览!', {
						state : "warning"
					});
				} else {
					epoint.openDialog("数据预览", './datapreview?stepguid='
							+ nodeData.key + '&sessionId='
							+ mini.get("livysession").getValue() + '&type='
							+ type, function(param) {
					}, {
						'width' : 800,
						'height' : 550
					});
				}
			} else {
				if (nodeData.step == 'writeData') {// 单独处理外部表
					epoint.openDialog("数据查看", './dataresult/datalist?stepguid='
							+ nodeData.key, function(param) {
					}, {
						'width' : 1300,
						'height' : 650
					});
				} else if (nodeData.extraction == 'listopen') {
					epoint.openDialog("数据查看", './viewtableresultinfo?stepguid='
							+ nodeData.key, function(param) {
					}, {
						'width' : 1300,
						'height' : 650
					});
				}

				else if (nodeData.extraction == 'chartopen') {
					epoint.openDialog("数据查看", './viewchartresultinfo?stepguid='
							+ nodeData.key, function(param) {
					}, {
						'width' : 800,
						'height' : 550
					});
				}
			}

		} else if (type === 'restart') { // 重新运行
			if (nodeData.classify == 'source' || nodeData.category == 'visual') {
				tempstatus = false;
			} else {
				showdatapreview();
				tempstatus = true;
				$("#count").html('0');
			}
			beginLoadStatus(nodeData.key, true, 0);
		} else if (type === 'save') { // 结果保存

		} else if (type === 'copy') { // 复制

		} else if (type === 'delete') { // 删除 所选中节点或者连线
			var allcontent = myDiagram.model.toJSON();
			if (nodeData.key) // 删除图形
				epoint.execute('dxpmodeldesignjobaction.deleteDrawNode', null, [
						nodeData.key, allcontent ], function(ret) {
					handleChart.deleteNode();
				});
			else
				epoint.execute('dxpmodeldesignjobaction.deleteDrawLine', null, [
						nodeData.from, nodeData.to, allcontent ],
						function(ret) {
							handleChart.deleteNode();
						});// 删除连线
		}
	},
	// 鼠标移入节点
	onMouseEnterNode : function(opt) {
		var $dom = opt.$dom, cb = opt.cb, data = opt.data;
		var statustext = "";
		if (data.status == '0') {
			statustext = "未运行";
		} else if (data.status == '1') {
			statustext = "执行中";
		} else if (data.status == '2') {
			statustext = "执行失败";
		} else if (data.status == '3') {
			statustext = "执行完成";
		} else if (data.status == '4') {
			statustext = "未连线";
		} else if (data.status == '5') {
			statustext = "参数未配置";
		}
		if (data.message && data.status != '1') {
			statustext = data.message;
		}
		if (!data.number) {
			data.number = 0;
		}
		var tempArr = [ {
			"name" : "节点名称",
			'val' : data.name
		}, {
			"name" : "算子名称",
			'val' : data.sfname
		}, {
			"name" : "运行状态",
			'val' : statustext
		}, {
			"name" : "总数量",
			'val' : data.number
		} ]
		$dom.html(Mustache.render(TIP_ITEM_TPL, {
			list : tempArr
		}));

		if (cb && typeof cb == 'function') {
			cb();
		}

	},
	// 拖拽后添加节点
	onDropEnd : function(opt) {
		var data = opt.data;
		var newData = $.extend({}, data, {// 复写key
			key : getUUID(),
			step : data.step || '',
			bagguid : data.bagguid || '',
			dsid : data.dsid || '',
			tableid : data.tableid || ''
		});
		myDiagram.model.addNodeData(newData);
		console.log("算子拖进了画布");
		var allconent = myDiagram.model.toJSON();
		epoint.execute('dxpmodeldesignjobaction.saveStep', null, [ flaguuid, "",
				newData, allconent ], function(ret) {
			if (newData.classify == 'local') {
				tempstatus = true;
			} else {
				tempstatus = false;
			}
			if (newData.extraction
					&& newData.extraction.indexOf("initnocount") != -1) {
				beginLoadStatus(newData.key, false, 0);
			} else {
				beginLoadStatus(newData.key, false, 1);
			}
		}, true);

	},
	// 双击弹出层节点点击事件
	layerNodeClickEvent : function(opt) {
		var data = opt.data;
		var newData = $.extend({}, data, {// 复写key
			key : getUUID(),
			step : data.step || '',
			bagguid : data.bagguid || '',
			dsid : data.dsid || '',
			tableid : data.tableid || ''
		});
		myDiagram.model.addNodeData(newData);
		cacheMouseEnterNode = '';
		designLayerEvent.hide();
		var allconent = myDiagram.model.toJSON();
		epoint.execute('dxpmodeldesignjobaction.saveStep', null, [ flaguuid, "",
				newData, allconent ], function(ret) {
			if (newData.classify == 'local') {
				tempstatus = true;
			} else {
				tempstatus = false;
			}
			if (newData.extraction
					&& newData.extraction.indexOf("initnocount") != -1) {
				beginLoadStatus(newData.key, false, 0);
			} else {
				beginLoadStatus(newData.key, false, 1);
			}
		}, true);
	},
	addLinkTimer : null,
	// 连线弹出层节点点击事件
	linkLayerNodeClickEvent : function(opt) {
		var that = this;
		var nodeData = opt.data, fromData = opt.fromData;

		var newNodeData = $.extend({}, nodeData, {
			key : getUUID(),
			step : nodeData.step || '',
			bagguid : nodeData.bagguid || '',
			dsid : nodeData.dsid || '',
			tableid : nodeData.tableid || ''
		});
		if (newNodeData.from == 'layer') {
			that.addLinkTimer && clearTimeout(that.addLinkTimer);

			myDiagram.model.addNodeData(newNodeData);
			designLayerEvent.hide();

			that.addLinkTimer = setTimeout(function() {

				myDiagram.model.addLinkData({
					"from" : fromData.key,
					"to" : newNodeData.key,
					"fromPort" : fromData.key, // fromData['site'],
					"toPort" : newNodeData.key, // fromData['site'] == 'R' ? "L"
					// : "R",
					noDelete : false
				});
			}, 200);

			var allconent = myDiagram.model.toJSON();
			epoint
					.execute(
							'dxpmodeldesignjobaction.saveStep',
							null,
							[ flaguuid, "", newNodeData, allconent ],
							function(ret) {
								if (newNodeData.classify == 'local') {
									tempstatus = true;
								} else {
									tempstatus = false;
								}
								if (newNodeData.extraction
										&& newNodeData.extraction
												.indexOf("initnocount") != -1) {
									beginLoadStatus(newNodeData.key, false, 0);
								} else {
									beginLoadStatus(newNodeData.key, false, 1);
								}
								epoint
										.execute(
												'dxpmodeldesignjobaction.updateParentGuid',
												null,
												[
														fromData.key,
														newNodeData.key,
														myDiagram.model
																.toJSON(), "",
														"" ],
												function(ret) {
													if (newNodeData.extraction
															&& newNodeData.extraction
																	.indexOf("initnocount") != -1) {
														beginLoadStatus(
																newNodeData.key,
																false, 0);
													} else {
														beginLoadStatus(
																newNodeData.key,
																false, 1);
													}
												});
							}, true);
			return false;
		}
	},
	// 连续点击两个节点进行
	twoSpotLinkEvent : function(opt) {
		var fromData = opt.arr[0], toData = opt.arr[1];

		myDiagram.model.addLinkData({
			"from" : fromData.part.data.key,
			"to" : toData.part.data.key,
			"fromPort" : fromData.part.data.key, // fromData['site'],
			"toPort" : toData.part.data.key
		// toData['site']
		});

		cacheLinkArr = [];
	},




}
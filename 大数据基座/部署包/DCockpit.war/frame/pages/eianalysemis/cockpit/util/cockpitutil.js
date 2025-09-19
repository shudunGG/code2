var eputil = {
	version : "1.2",
	// res路径，根据实际项目修改
	resPath : "eianalysedemosys/res/",

	// 地图地址配置
	mapUrl : {
		// 根路径
		root : "http://localhost:8012/epointzhsqmap/emap/gis/page/"
	},
	// 弹出页面默认尺寸,
	dialogWidth : 1000,
	dialogHeight : 600,
	// 大尺寸
	dialogWidthBig : 1300,
	// 小尺寸
	dialogSizeNormal : 800,
	// 前台通用的yesNoModel的数据
	yesNoData : [ {
		id : "1",
		text : "是"
	}, {
		id : "0",
		text : "否"
	} ],

	// 绑定数据
	bindData : function(data) {
		$("[data-key]").each(function() {
			var $this = $(this);
			var value = data[$this.data("key")];
			$this.html(value || "");
		});
	},

	// 加载图片，失败就显示默认头像图片
	loadPhoto : function(imgId, attachGuid, defaultPhoto) {
		if (!imgId) {
			return;
		}
		var $img = $("#" + imgId);
		if ($img.length == 0) {
			return;
		}

		if (!defaultPhoto) {
			defaultPhoto = _rootPath + "/fui/css/images/default-profile.jpg";
		}

		if (attachGuid) {
			var src = _rootPath + "/rest/attachAction.action?cmd=getContent&attachGuid=" + attachGuid;
			var image = new Image();
			image.src = src;

			image.onload = function() {
				$img.prop("src", src);
			};
			if (image.complete) {
				$img.prop("src", src);
			}
			;
			image.onerror = function() {
				$img.prop("src", defaultPhoto);
			};
		} else {
			$img.prop("src", defaultPhoto);
		}
	},

	toNumber : function(px) {
		if (px) {
			px = px.replace("px", "");

			if (px.indexOf(".") > 0) {
				px = parseFloat(px);
			} else {
				px = parseInt(px);
			}

			if (px == "NaN") {
				return 0;
			} else {
				return px;
			}
		}

		return 0;
	},

	/** 缓存页面首次加载的控件，在保存新增之后，会根据这些值恢复控件状态* */
	_cacheControls : {},

	initCacheControl : function() {
		var _this = this;

		var $buttonedit = $(".mini-buttonedit");
		$buttonedit.each(function(i) {
			var id = this.id;

			var buttonedit = mini.get(id);
			if (buttonedit) {
				_this._cacheControls[id] = {
					value : buttonedit.getValue(),
					text : buttonedit.getText()
				};
			}
		});

		var $hidden = $(".mini-hidden");
		$hidden.each(function(i) {
			var id = this.id;

			if (id == "_common_hidden_viewdata") {
				return;
			}

			var hidden = mini.get(id);
			if (hidden) {
				_this._cacheControls[id] = {
					value : hidden.getValue()
				};
			}
		});

		var $combo = $(".mini-combobox");
		$combo.each(function(i) {
			var id = this.id;

			var combo = mini.get(id);
			if (combo) {
				_this._cacheControls[id] = {
					value : combo.getValue()
				};
			}
		});

		var $output = $(".mini-outputtext");
		$output.each(function(i) {
			var id = this.id;

			var output = mini.get(id);
			if (output) {
				_this._cacheControls[id] = {
					value : output.getValue()
				};
			}
		});

		var $radiolist = $(".mini-radiobuttonlist");
		$radiolist.each(function(i) {
			var id = this.id;

			var radiolist = mini.get(id);
			if (radiolist) {
				_this._cacheControls[id] = {
					value : radiolist.getValue()
				};
			}
		});
	},

	restoreCacheControl : function() {
		var _this = this;

		for ( var id in _this._cacheControls) {
			var miniObj = mini.get(id);
			if (miniObj) {
				if ("buttonedit" == miniObj.type) {
					miniObj.setValue(_this._cacheControls[id].value);
					miniObj.setText(_this._cacheControls[id].text);
				} else if ("hidden" == miniObj.type) {
					miniObj.setValue(_this._cacheControls[id].value);
				} else if ("combobox" == miniObj.type) {
					miniObj.setValue(_this._cacheControls[id].value);
				} else if ("outputtext" == miniObj.type) {
					miniObj.setValue(_this._cacheControls[id].value);
				} else if ("radiobuttonlist" == miniObj.type) {
					miniObj.setValue(_this._cacheControls[id].value);
				}
			}
		}

		// 数字类型的需要默认一个
		var $textbox = $(".mini-textbox");
		$textbox.each(function(i) {
			var id = this.id;

			var textbox = mini.get(id);
			if (textbox) {
				var vtype = textbox.vtype;

				if (vtype == "int" || vtype == "float") {
					textbox.setValue(0);
				}
			}
		});
	},
	/** 缓存结束* */

	// 保存并新建
	saveAndNew : function() {
		if (eputil.beforeValidate() == false) {
			return;
		}

		if (epoint.validate()) {
			if (eputil.afterValidate() == false) {
				return;
			}

			epoint.execute('addNew', 'fui-form', eputil.newCallback);
		}
	},
	// 保存并关闭
	saveAndClose : function() {
		if (eputil.beforeValidate() == false) {
			return;
		}

		if (epoint.validate()) {
			if (eputil.afterValidate() == false) {
				return;
			}

			epoint.execute('add', 'fui-form', eputil.closeCallback);
		}
	},
	// 保存修改
	saveModify : function() {
		if (eputil.beforeValidate() == false) {
			return;
		}

		if (epoint.validate()) {
			if (eputil.afterValidate() == false) {
				return;
			}

			epoint.execute('save', 'fui-form', eputil.closeCallback);
		}
	},
	// 提交
	submit : function() {
		if (eputil.beforeValidate() == false) {
			return;
		}

		if (epoint.validate()) {
			if (eputil.afterValidate() == false) {
				return;
			}

			epoint.execute('submit', 'fui-form', function(result) {
				if (!result.alertMsg) {
					result.alertMsg = "提交成功！";
				}

				eputil.closeCallback(result);
			});
		}
	},

	// 验证之前
	beforeValidate : function() {
		return true;
	},

	// 验证之后
	afterValidate : function() {
		return true;
	},

	// 保存并新建
	newCallback : function(result) {
		var message = result.msg;
		if (message) {
			if (message == 'success') {
				var alertMsg = '保存成功！';
				if (result.alertMsg) {
					alertMsg = result.alertMsg;
				}

				epoint.alert(alertMsg);
				// 清理表单
				epoint.clear('fui-form');
				// 清理个性化的附件
				eputil.clearAttachList();

				eputil.restoreCacheControl();
			} else {
				epoint.alert(message);
			}
		} else {
			epoint.alert('没有返回值！');
		}

		// 保存并新增的回调函数blcinfoworkflowblfk
		eputil.saveAndNewCall(result);
	},

	saveAndNewCall : function(result) {

	},

	// 保存并关闭
	closeCallback : function(result) {
		var message = result.msg;
		if (message) {
			if (message == 'success') {
				var alertMsg = '保存成功！';
				if (result.alertMsg) {
					alertMsg = result.alertMsg;
				}
				epoint.alertAndClose(alertMsg);
				// 清理个性化的附件
				eputil.clearAttachList();
			} else {
				epoint.alert(message);
			}
		} else {
			epoint.alert('没有返回值！');
		}
	},

	// 弹出框的回调
	dialogCallback : function(param) {
		if (param && param != 'close') {
			// 一般是刷新树和表格，其他情况自定义
			if (searchData) {
				var $tree = $(".mini-tree");
				if ($tree.length > 0) {
					searchData($tree.prop("id"));
				} else {
					searchData();
				}
			}
		}
	},

	// 绘制行编辑按钮
	onEditRenderer : function(e) {
		return epoint.renderCell(e, "action-icon icon-edit", "eputil.openEdit", "epoint_total");
	},
	// 绘制行查看按钮
	onDetailRenderer : function(e) {
		return epoint.renderCell(e, "action-icon icon-search", "eputil.openDetail", "epoint_total");
	},
	// 绘制设置属性按钮
	onSettingRenderer : function(e) {
		return epoint.renderCell(e, "action-icon icon-doc", "eputil.openSetting", "epoint_total");
	},
	// 绘制删除属性按钮
	onDeleteRenderer : function(e) {
		return epoint.renderCell(e, "action-icon icon-remove", "eputil.openDelete", "epoint_total");
	},
	// 绘制删除前台一行的属性按钮
	onDeleteRowRenderer : function(e) {
		return "<a href='javascript: eputil.deleteFrontRow(\"" + e.record._uid + "\", \"" + e.sender.id + "\");' class='action-icon icon-remove'></a>";
	},

	openEdit : function(e) {
		var mixed = {};

		if (eputil.publicKey) {
			for (obj in e) {
				mixed[obj] = eputil.encryptedString(e[obj]);
			}
		} else {
			mixed = e;
		}

		if (openEdit) {
			openEdit(mixed);
		}
	},

	openDetail : function(e) {
		var mixed = {};

		if (eputil.publicKey) {
			for (obj in e) {
				mixed[obj] = eputil.encryptedString(e[obj]);
			}
		} else {
			mixed = e;
		}

		if (openDetail) {
			openDetail(mixed);
		}
	},

	openSetting : function(e) {
		var mixed = {};

		if (eputil.publicKey) {
			for (obj in e) {
				mixed[obj] = eputil.encryptedString(e[obj]);
			}
		} else {
			mixed = e;
		}

		if (openSetting) {
			openSetting(mixed);
		}
	},

	openDelete : function(e) {
		var mixed = {};

		if (eputil.publicKey) {
			for (obj in e) {
				mixed[obj] = eputil.encryptedString(e[obj]);
			}
		} else {
			mixed = e;
		}

		if (openDelete) {
			openDelete(mixed);
		}
	},

	deleteFrontRow : function(uid, gridId) {
		var grid = mini.get(gridId);
		if (!grid) {
			return;
		}

		var row = grid.getRowByUID(uid);
		if (!row) {
			return;
		}

		grid.removeRow(row);

		eputil.afterDeleteFrontRow(row);
	},

	afterDeleteFrontRow : function(row) {

	},

	// 表格选中操作
	tableSelect : function(dataGridId, actionName, operateName, callBack) {
		if (dataGridId && actionName) {
			if (!operateName) {
				operateName = "操作";
			}

			var table = mini.get(dataGridId);
			if (table) {
				if (table.getSelecteds().length <= 0)
					epoint.alert("请选择要" + operateName + "的记录!");
				else {
					epoint.confirm("确认要" + operateName + "吗？", "提示", function() {
						var ids = [ dataGridId ];
						if ($("#fui-form").length > 0) {
							ids.push("fui-form");
						}

						epoint.execute(actionName, ids, null, function(result) {
							if (callBack) {
								callBack(result);
							}
						});
					});
				}
			} else {
				epoint.alert("没有找到表格！");
			}
		} else {
			epoint.alert("无效的操作！");
		}
	},

	// 验证的正则表达式
	validationExpression : {
		// 大于零的整数
		intOverZero : function(e) {
			if (e.isValid && e.value) {
				var reg = /^[1-9]\d*$/;
				if (!reg.test(e.value)) {
					e.isValid = false;
					e.errorText = "必须输入大于0的整数";
				}
			}
		},
		// 小数点后最多2位的正数
		maxTwoAfterPointOverZero : function(e) {
			if (e.isValid && e.value && e.value != "0") {
				var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
				if (!reg.test(e.value)) {
					e.isValid = false;
					e.errorText = "必须输入小数点后最多2位的数字";
				}
			}
		},
		// text必填，而非value
		textRequired : function(e) {
			if (e.isValid) {
				if (!e.source.getText()) {
					e.isValid = false;
					e.errorText = "不能为空";
				}
			}
		}
	},

	idCardValidate : function(idcard) {
		var errors = new Array("", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
		var area = {
			11 : "北京",
			12 : "天津",
			13 : "河北",
			14 : "山西",
			15 : "内蒙古",
			21 : "辽宁",
			22 : "吉林",
			23 : "黑龙江",
			31 : "上海",
			32 : "江苏",
			33 : "浙江",
			34 : "安徽",
			35 : "福建",
			36 : "江西",
			37 : "山东",
			41 : "河南",
			42 : "湖北",
			43 : "湖南",
			44 : "广东",
			45 : "广西",
			46 : "海南",
			50 : "重庆",
			51 : "四川",
			52 : "贵州",
			53 : "云南",
			54 : "西藏",
			61 : "陕西",
			62 : "甘肃",
			63 : "青海",
			64 : "宁夏",
			65 : "新疆",
			71 : "台湾",
			81 : "香港",
			82 : "澳门",
			91 : "国外"
		};
		var Y, JYM;
		var S, M;
		var idcardArray = new Array();
		idcard = idcard.toUpperCase();
		idcardArray = idcard.split("");
		// 地区检验
		if (area[parseInt(idcard.substr(0, 2))] == null)
			return errors[4];
		// 身份号码位数及格式检验
		switch (idcard.length) {
		case 15:
			if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
				ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; // 测试出生日期的合法性
			} else {
				ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; // 测试出生日期的合法性
			}
			if (ereg.test(idcard))
				return errors[0];
			else
				return errors[2];
			break;
		case 18:
			if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
				// alert(1);
				ereg1 = /^[1-9][0-9]{5}20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的合法性正则表达式
				ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的合法性正则表达式
			} else {
				// alert(2);
				ereg1 = /^[1-9][0-9]{5}20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
				ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
			}
			if (ereg.test(idcard) || ereg1.test(idcard)) { // 测试出生日期的合法性
				// 计算校验位
				S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 + (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 + (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10
						+ (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 + (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 + (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4
						+ (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 + parseInt(idcardArray[7]) * 1 + parseInt(idcardArray[8]) * 6 + parseInt(idcardArray[9]) * 3;
				Y = S % 11;
				M = "F";
				JYM = "10X98765432";
				M = JYM.substr(Y, 1); // 判断校验位
				if (M == idcardArray[17])
					return errors[0]; // 检测ID的校验位
				else
					return errors[3];
			} else
				return errors[2];
			break;
		default:
			return errors[1];
			break;
		}
	},

	// 日期控件范围限制
	initDateSection : function(fromDateId, toDateId) {
		var fromDate = mini.get(fromDateId);
		var toDate = mini.get(toDateId);

		if (!fromDate || !toDate) {
			return;
		}

		fromDate.on("drawdate", function(e) {
			var toDateTime = toDate.getValue();
			if (toDateTime) {
				if (toDateTime < e.date) {
					e.allowSelect = false;
				}
			}
		});
		toDate.on("drawdate", function(e) {
			var fromDateTime = fromDate.getValue();
			if (fromDateTime) {
				if (fromDateTime > e.date) {
					e.allowSelect = false;
				}
			}
		});

		// 不符合的清空
		fromDate.on("valuechanged", function(e) {
			if (toDate.getValue() && e.value > toDate.getValue()) {
				e.source.setValue(null);
			}
		});
		toDate.on("valuechanged", function(e) {
			if (fromDate.getValue() && e.value < fromDate.getValue()) {
				e.source.setValue(null);
			}
		});
	},

	// 列单选，事件注册请放置于grid的onupdate事件中，有BUG，请勿用
	tableColumnCheckSingle : function(grid, column) {
		if (typeof grid == 'string') {
			grid = mini.get(grid);
		}
		if (!grid) {
			return;
		}

		if (typeof column == 'string') {
			column = grid.getColumn(column);
		}
		if (!column) {
			return;
		}

		grid.on("load", function() {
			grid.on("update", function() {
				var list = grid.getList();
				for (var i = 0, length = list.length; i < length; i++) {
					var currentEditor = grid.getCellEditor(column, i);
					if (!currentEditor || currentEditor.type != "checkbox") {
						continue;
					}

					currentEditor.on("valuechanged", function(e) {
						if (e.source.checked) {
							for (var j = 0, length = list.length; j < length; j++) {
								var editor = grid.getCellEditor(column, j);
								if (!editor || editor.type != "checkbox") {
									continue;
								}

								editor.setValue(0);
							}

							e.source.setValue(editor.trueValue || 1);
						}
					});
				}
			});
		});
	},
	// 表格列全选
	tableColumnCheckAll : function(grid, column) {
		if (typeof grid == 'string') {
			grid = mini.get(grid);
		}
		if (!grid) {
			return;
		}

		if (typeof column == 'string') {
			column = grid.getColumn(column);
		}
		if (!column) {
			return;
		}

		grid.on("load", function(loadEvent) {
			column.header = '<div class="table-col-check-all-header"><span class="mini-grid-checkbox"></span>' + column.header + '</div>';

			$(grid.el).on("click", ".table-col-check-all-header", function(e) {
				var cellEl = $(e.target).closest(".mini-grid-headerCell");

				var ss = cellEl[0].id.split('$');
				if (column._id == ss[ss.length - 1]) {
					var $this = $(this);
					var $checkBox = $this.find(".mini-grid-checkbox");

					if ($checkBox.hasClass("mini-grid-checkbox-checked")) {
						$checkBox.removeClass("mini-grid-checkbox-checked");
					} else {
						$checkBox.addClass("mini-grid-checkbox-checked");
					}

				}
			});
		});
	},

	// 初始化表格控件编辑
	initEditTable : function(grid) {
		if (typeof grid == 'string') {
			grid = mini.get(grid);
		}
		if (!grid) {
			return;
		}

		var list = grid.getList();
		for (var i = 0, length = list.length; i < length; i++) {
			if (!grid.isEditingRow(list[i])) {
				grid.beginEditRow(list[i]);
			}
		}
	},
	// 加载图表
	initECharts : function(id, option, theme) {
		var obj = document.getElementById(id);
		if (obj) {
			theme = theme ? theme : "macarons";

			var myCharts = echarts.init(obj, theme);
			myCharts.setOption(eval("(" + option + ")"));

			return myCharts;
		}
	},

	/** 地图定位渲染结束* */
	// 地图的弹出层DIALOG
	_mapDialog : null,

	// 打开地图定位
	openMapLocate : function(x, y, code) {
		if (!eputil.mapUrl || !eputil.mapUrl.locate) {
			epoint.alert("没有定位页面！");
			return;
		}

		// 如果不传参数的话，读取表单上的隐藏域
		if (!x || !y) {
			var gisx = mini.get("gisx");
			var gisy = mini.get("gisy");
			if (gisx && gisy) {
				x = gisx.getValue();
				y = gisy.getValue();
			}
		}

		if (!code) {
			var giscode = mini.get("giscode");
			if (giscode) {
				code = giscode.getValue();
			}
		}

		x = x || "";
		y = y || "";
		code = code || "";

		top.eputil._mapDialog = epoint.openTopDialog('定位', eputil.mapUrl.locate + "?x=" + x + "&y=" + y + "&code=" + code);

		// 添加消息监听，通过消息监听来完成数据的传输
		var onMapMessage = function(event) {
			var data = event.data;
			var origin = event.origin;

			var x = "";
			var y = "";
			var code = "";
			if (data) {
				var datas = data.split("#@#");
				if (datas.length > 1) {
					x = datas[0];
					y = datas[1];
				}
				if (datas.length > 2) {
					code = datas[2];
				}
			}

			// 移除监听事件
			if (top.removeEventListener) {
				top.removeEventListener('message', onMapMessage, false);
			} else if (typeof top.attachEvent) {
				top.detachEvent('onmessage', onMapMessage);
			}

			// 关闭弹出窗口
			if (top.eputil._mapDialog) {
				var source = top.eputil._mapDialog.Owner;

				var gisx = source.mini.get("gisx");
				var gisy = source.mini.get("gisy");
				var giscode = source.mini.get("giscode");
				if (gisx && gisy) {
					gisx.setValue(x);
					gisy.setValue(y);

					if (giscode) {
						giscode.setValue(code);
					}
				}

				source.eputil.renderLocate();

				top.eputil._mapDialog._CloseOwnerWindow();
				top.eputil._mapDialog = null;
			}
		};

		if (typeof top.addEventListener) {
			top.addEventListener('message', onMapMessage, false);
		} else if (typeof top.attachEvent) {
			// for ie
			top.attachEvent('onmessage', onMapMessage);
		}
	},

	openMapDraw : function(area) {
		if (!eputil.mapUrl || !eputil.mapUrl.draw) {
			epoint.alert("没有定位页面！");
			return;
		}

		// 如果不传参数的话，读取表单上的隐藏域
		if (!area) {
			var gisarea = mini.get("gisarea");
			if (gisarea) {
				area = gisarea.getValue();
			}
		}

		area = area || "";

		top.eputil._mapDialog = epoint.openTopDialog('定位', eputil.mapUrl.draw);

		// 添加消息监听
		var onMapMessage = function(event) {
			var data = event.data;
			var origin = event.origin;

			var rings = "";
			var level = "";
			if (data) {
				var datas = data.split("#@#");
				rings = datas[0];
				if (datas.length > 1) {
					level = datas[1];
				}
			}

			// 移除监听事件
			if (top.removeEventListener) {
				top.removeEventListener('message', onMapMessage, false);
			} else if (typeof top.attachEvent) {
				top.detachEvent('onmessage', onMapMessage);
			}

			// 关闭弹出窗口
			if (top.eputil._mapDialog) {
				var source = top.eputil._mapDialog.Owner;

				top.eputil._mapDialog._CloseOwnerWindow();
				top.eputil._mapDialog = null;

				var gisarea = source.mini.get("gisarea");
				var maplevel = source.mini.get("maplevel");
				if (gisarea) {
					gisarea.setValue(rings);
				}
				if (maplevel) {
					maplevel.setValue(level);
				}
				source.eputil.renderLocate();
			}
		};

		if (typeof top.addEventListener) {
			top.addEventListener('message', onMapMessage, false);
		} else if (typeof top.attachEvent) {
			// for ie
			top.attachEvent('onmessage', onMapMessage);
		}
	},

	openMapView : function() {
		if (!eputil.mapUrl || !eputil.mapUrl.view) {
			epoint.alert("没有预览页面！");
			return;
		}

		// 如果不传参数的话，读取表单上的隐藏域
		var data = {};

		var gisarea = mini.get("gisarea");
		if (gisarea) {
			data.type = "area";
			data.value = gisarea.getValue();
		} else {
			var gisx = mini.get("gisx");
			var gisy = mini.get("gisy");
			if (gisx && gisy) {
				data.type = "point";
				data.value = {
					x : gisx.getValue(),
					y : gisy.getValue()
				}
			}
		}

		var source = epoint.openTopDialog('位置', eputil.mapUrl.view)._iframeEl.contentWindow;
		// 把数据推送过去，因为子窗体加载需要一定的时间，故暂时延迟1秒，后续再看情况
		setTimeout(function() {
			source.postMessage(JSON.stringify(data), "*");
		}, 1000);
	},

	renderLocate : function(source, renderTargetId) {
		if (!source) {
			source = self;
		}

		var gisx = source.mini.get("gisx");
		var gisy = source.mini.get("gisy");
		var gisarea = source.mini.get("gisarea");

		var $locate = source.$(".gis-locate");
		var $draw = source.$(".gis-draw");
		var $view = source.$(".gis-view");

		if ($locate) {
			$locate.unbind("click");
			$locate.on("click", function() {
				eputil.openMapLocate();
			});
		}
		if ($draw) {
			$draw.unbind("click");
			$draw.on("click", function() {
				eputil.openMapDraw();
			});
		}
		if ($view) {
			$view.unbind("click");
			$view.on("click", function() {
				eputil.openMapView();
			});
		}

		if (gisx && gisy) {
			var x = gisx.getValue();
			var y = gisy.getValue();

			if (x && y) {
				$locate.removeClass("off");
				$locate.addClass("on");
				$locate.text("已定位");
				$view.removeClass("off");
				$view.addClass("on");
				$view.text("已定位");
			} else {
				$locate.removeClass("on");
				$locate.addClass("off");
				$locate.text("未定位");
				$view.removeClass("on");
				$view.addClass("off");
				$view.text("未定位");
			}
		} else if (gisarea) {
			var rings = gisarea.getValue();
			if (rings) {
				$draw.removeClass("off");
				$draw.addClass("on");
				$draw.text("已定位");
				$view.removeClass("off");
				$view.addClass("on");
				$view.text("已定位");
			} else {
				$draw.removeClass("on");
				$draw.addClass("off");
				$draw.text("未定位");
				$view.removeClass("on");
				$view.addClass("off");
				$view.text("未定位");
			}
		}
	},
	/** 地图定位渲染结束* */

	/** 辅助输入器* */
	openInputDialog : function(inputObj, size, okJs, cancelJs) {
		var oldDiv = document.getElementById('inputBodyDiv');
		if (oldDiv) {
			oldDiv.innerHTML = '';
			document.body.removeChild(oldDiv);
		}
		var oldShade = top.document.getElementById('inputShadeDiv');
		if (oldShade) {
			oldShade.innerHTML = '';
			top.document.body.removeChild(oldShade);
		}

		// 背景容器
		var shadeDiv = top.document.createElement('div');
		shadeDiv.id = 'inputShadeDiv';
		shadeDiv.className = 'dialog-shade';
		shadeDiv.style.width = top.document.body.clientWidth + 'px';
		shadeDiv.style.height = top.document.body.clientHeight + 'px';
		top.document.body.appendChild(shadeDiv);

		// 输入容器
		var inputBodyHeight = ((document.body.clientHeight - 100) > 400 ? 400 : (document.body.clientHeight - 100));

		var inputBodyWidth = ((document.body.clientWidth - 100) > 600 ? 600 : (document.body.clientWidth - 100));

		var inputBodyDiv = top.document.createElement('div');
		inputBodyDiv.id = 'inputBodyDiv';
		inputBodyDiv.className = 'input-dialog';
		inputBodyDiv.style.height = inputBodyHeight + 'px';
		inputBodyDiv.style.width = inputBodyWidth + 'px';
		inputBodyDiv.style.top = (top.document.body.clientHeight - inputBodyHeight) / 2 + 'px';
		inputBodyDiv.style.left = (top.document.body.clientWidth - inputBodyWidth) / 2 + 'px';
		top.document.body.appendChild(inputBodyDiv);

		var inputContentDiv = top.document.createElement('div');
		inputContentDiv.id = 'inputContentDiv';
		inputContentDiv.className = 'input-content';
		inputContentDiv.style.width = (inputBodyWidth - 52) + 'px';
		inputContentDiv.style.height = (inputBodyDiv.style.height.replace('px', '') - 80) + 'px';
		inputBodyDiv.appendChild(inputContentDiv);

		// 输入域
		var inputTextarea = top.document.createElement('textarea');
		inputTextarea.className = 'input-textarea';
		inputContentDiv.appendChild(inputTextarea);
		// 初始化值
		if (inputObj && inputObj.value) {
			inputTextarea.value = inputObj.value;
		}
		// 初始化文本最大上限
		if (inputObj.maxLength) {
			inputTextarea.maxLength = inputObj.maxLength;
			inputTextarea.onkeyup = function() {
				if (this.value.length >= inputObj.maxLength) {
					event.returnValue = false;
				}
			};

			inputTextarea.onkeypress = function() {
				if (this.value.length >= inputObj.maxLength) {
					event.returnValue = false;
				}
			};

			inputTextarea.onpaste = function() {
				if (this.value.length >= inputObj.maxLength) {
					event.returnValue = false;
				}
			};
		}

		var inputButtonDiv = top.document.createElement('div');
		inputButtonDiv.id = 'inputButtonDiv';
		inputButtonDiv.className = 'input-buttons';
		inputBodyDiv.appendChild(inputButtonDiv);

		// 确定，清除按钮
		var okBtn = top.document.createElement('input');
		okBtn.type = 'button';
		okBtn.value = '确定';
		okBtn.className = 'input-btn';
		inputButtonDiv.appendChild(okBtn);

		var closeBtn = top.document.createElement('input');
		closeBtn.type = 'button';
		closeBtn.value = '关闭';
		closeBtn.style.marginLeft = '50px';
		closeBtn.className = 'input-btn';
		inputButtonDiv.appendChild(closeBtn);

		// 添加事件
		okBtn.onclick = function() {
			var id = (typeof inputObj == 'string') ? inputObj : inputObj.id;
			if (id) {
				// 判断下是不是mini控件
				var obj = mini.get(inputObj.id);
				if (obj && obj.type == "textbox") {
					inputObj.setValue(inputTextarea.value);
				} else {
					inputObj.value = inputTextarea.value;
				}
			}

			if (inputBodyDiv) {
				inputBodyDiv.innerHTML = '';
				top.document.body.removeChild(inputBodyDiv);
			}
			if (shadeDiv) {
				shadeDiv.innerHTML = '';
				top.document.body.removeChild(shadeDiv);
			}

			if (okJs) {
				okJs();
			}
		};

		closeBtn.onclick = function() {
			if (inputBodyDiv) {
				inputBodyDiv.innerHTML = '';
				top.document.body.removeChild(inputBodyDiv);
			}
			if (shadeDiv) {
				shadeDiv.innerHTML = '';
				top.document.body.removeChild(shadeDiv);
			}

			if (cancelJs) {
				cancelJs();
			}
		};
	},
	/** 辅助输入器* */

	/** 附件列表渲染* */
	// 渲染简单附件效果
	renderSimpleAttach : function(datas, sourceId) {
		var $source = $("#" + sourceId);
		$source.html("");

		if (!datas || datas.length == 0) {
			return;
		}

		var html = "<ul style='margin-left: 50px;'>";

		for (var i = 0, length = datas.length; i < length; i++) {
			html += "<li style='cursor: pointer;' data-guid='" + datas[i].attachGuid + "'>" + datas[i].attachFileName + "</li>";
		}

		html += "</ul>";

		$source.html(html);

		$source.on("click", "ul>li", function() {
			window.location.href = _rootPath + "/rest/attachAction.action?cmd=getContent&attachGuid=" + $(this).data("guid");
		});
	},

	onUploadProcess : function(e) {
		var $contain = eputil.getAttachContain(e.source.id);
		if (!$contain || $contain.length == 0) {
			return;
		}

		var $process = $contain.children(".attach-list-process");
		if ($process.length == 0) {
			$process = $("<div class='attach-list-process'></div>");
			$contain.prepend($process);

			var $processing = $("<div class='processing'></div>");
			$process.append($processing);
		}

		$process.children("div").css("width", (parseFloat(e.percentage) * 100) + "%");
	},

	onUploadSuccess : function(e) {
		var $contain = eputil.getAttachContain(e.source.id);
		if (!$contain || $contain.length == 0) {
			return;
		}

		$contain.children(".attach-list-process").remove();

		// 清除客户端的文件信息，均由服务端来判断
		// 限制附件个数的有问题，后期完善
		// e.source.clearFile();
		// 找出当前上传控件的响应值
		eputil.addAttach(e.data, e.source.id);
	},
	// 获取附件列表容器
	getAttachContain : function(sourceId) {
		// 图片列表容器
		var $target = null;

		if (sourceId) {
			$target = $("#" + sourceId + "_attach");
		}
		if (!$target || $target.length == 0) {
			// 如果有加ID标识，则寻找最近的attach-list
			if (sourceId) {
				$target = $("#" + sourceId).next(".attach-list");
			} else {
				// 没有的话只能随便找一个了
				$target = $(".attach-list");
			}
		}

		return $target;
	},
	// 添加一个附件到列表中
	addAttach : function(data, sourceId, $contain) {
		$contain = $contain || eputil.getAttachContain(sourceId);
		if (!$contain || $contain.length == 0) {
			return;
		}

		var attachGuid = data.attachGuid;
		var attachFileName = data.attachFileName;

		var $ul = $contain.children("ul");
		if ($ul.length == 0) {
			$ul = $("<ul></ul>");
			$contain.append($ul);
		}

		var $item = $("<li class='attach-list-item' data-guid='" + attachGuid + "'></li>");
		$ul.prepend($item);

		var $itemBody = $("<div class='attach-list-item-body image-dialog-link' data-guid='" + attachGuid + "'></div>");
		var $itemFoot = $("<div class='attach-list-item-foot'></div>");
		$item.append($itemBody);
		$item.append($itemFoot);

		var $name = $("<div title='" + attachFileName + "' class='filename'>" + attachFileName + "</div>");
		$itemFoot.append($name);

		var src = "";
		if (eputil.isImage(attachFileName)) {
			src = _rootPath + "/rest/attachAction.action?cmd=getContent&attachGuid=" + attachGuid;
		} else {
			src = _rootPath + "/" + eputil.resPath + "images/attach/attach-short-";

			if (attachFileName.toUpperCase().endWith(".PDF")) {
				src += "pdf.png";
			} else if (attachFileName.toUpperCase().endWith(".XLSX") || attachFileName.toUpperCase().endWith(".XLS")) {
				src += "excel.png";
			} else if (attachFileName.toUpperCase().endWith(".DOCX") || attachFileName.toUpperCase().endWith(".DOC")) {
				src += "word.png";
			} else if (attachFileName.toUpperCase().endWith(".PPTX") || attachFileName.toUpperCase().endWith(".PPT")) {
				src += "ppt.png";
			} else if (attachFileName.toUpperCase().endWith(".VSDX") || attachFileName.toUpperCase().endWith("VSD")) {
				src += "visio.png";
			} else if (attachFileName.toUpperCase().endWith(".MPPX") || attachFileName.toUpperCase().endWith(".MPP")) {
				src += "project.png";
			} else {
				src += "file.png";
			}
		}

		var $img = $("<img title='" + attachFileName + "' src='" + src + "'></img>");
		$itemBody.append($img);

		if ($contain.hasClass("modify")) {
			var $delete = $("<div class='delete'>删除</div>");
			$itemFoot.append($delete);

			$delete.on("click", function() {
				var guid = $(this).parent().parent().data("guid");

				epoint.execute("deleteAttach", null, [ guid ], function(result) {
					if (result.msg == "success") {
						eputil.removeAttach(guid, sourceId);
					}
				});
			});
		}

		// 事件绑定
		$itemBody.on("click", function() {
			var $parent = $(this).parent();
			var guid = $parent.data("guid");
			var name = $parent.children(".attach-list-item-foot").children(".filename").text();

			if (eputil.isImage(name)) {
				eputil.openImageTopDialog(guid, name);
			} else if (attachFileName.toUpperCase().endWith(".PDF")) {
				eputil.openOfficeTopDialog(guid, name);

			} else if (attachFileName.toUpperCase().endWith(".DOCX") || attachFileName.toUpperCase().endWith(".DOC")) {
				if (eputil.publicKey) {
					guid = eputil.encryptedString(guid);
				}
				eputil.openOfficeTopDialog(guid, name, "doc");
			} else if (attachFileName.toUpperCase().endWith(".PPTX") || attachFileName.toUpperCase().endWith(".PPT")) {
				if (eputil.publicKey) {
					guid = eputil.encryptedString(guid);
				}
				eputil.openOfficeTopDialog(guid, name, "ppt");
			} else if (attachFileName.toUpperCase().endWith(".XLSX") || attachFileName.toUpperCase().endWith(".XLS")) {
				if (eputil.publicKey) {
					guid = eputil.encryptedString(guid);
				}
				eputil.openOfficeTopDialog(guid, name, "excel");

			} else {
				window.location.href = _rootPath + "/rest/attachAction.action?cmd=getContent&attachGuid=" + guid;
			}
		});
		// 点文件名可下载
		$name.on("click", function() {
			var guid = $(this).parent().parent().data("guid");
			window.location.href = _rootPath + "/rest/attachAction.action?cmd=getContent&attachGuid=" + guid;
		});
	},
	// 从列表中移除一个附件
	removeAttach : function(attachGuid, sourceId) {
		var $contain = eputil.getAttachContain(sourceId);
		if (!$contain || $contain.length == 0) {
			return;
		}

		var $item = $contain.children("ul").children("li");
		$item.each(function(i) {
			var $this = $(this);
			if ($this.data("guid") == attachGuid) {
				$this.remove();

				if (!sourceId) {
					// 如果sourceId不存在，则寻找离他最近的那个附件上传 $this.prev
					sourceId = $contain.prev(".mini-webuploader").prop("id");
				}

				var uploader = mini.get(sourceId);
				if (uploader) {
					// 页面初始化时，服务端的逻辑
					if (uploader.serverFileNum > 0) {
						uploader.serverFileNum -= 1;

						for ( var key in uploader.serverFiles) {
							if (attachGuid == key) {
								delete uploader.serverFiles[key];
							}
						}
						if (uploader.fileNumLimit) {
							uploader.setFileNumLimit(uploader.fileNumLimit);
						}
					}

					var files = uploader.getUploader().getFiles();
					if (files && files.length > 0) {
						// 懒的知道要删是哪个附件，只要保证删掉一个就行了
						// 默认UI只要不显示就行了
						uploader.getUploader().removeFile(files[0]);
					}
				}

				return;
			}
		});
	},
	// 清除附件列表
	clearAttachList : function(sourceId) {
		var $target = eputil.getAttachContain(sourceId);
		if ($target) {
			$target.html("");
		}

		// 清除所有上传控件的附件
		$(".mini-webuploader").each(function() {
			var uploader = mini.get(this.id);
			if (uploader) {
				uploader.clearFile();
			}
		});
	},
	// 渲染附件效果
	renderAttachList : function(result, sourceId) {
		// 初始化附件列表
		var $target = eputil.getAttachContain(sourceId);
		if (!$target || $target.length == 0) {
			return;
		}

		if (!$target.hasClass("clearfix")) {
			$target.addClass("clearfix");
		}
		$target.html('');

		if (!result) {
			return;
		}

		var attachLists = [];

		for ( var key in result) {
			if (key.indexOf("attachList") == 0) {
				attachLists.push(key);
			}
		}

		if (attachLists.length == 0) {
			return;
		}

		// 进行排序
		if (attachLists.length > 1) {
			var temp = null;
			for (var i = 0, length = attachLists.length; i < length; i++) {
				for (var j = i + 1; j < length; j++) {
					if (attachLists[j].length == 10) {
						temp = attachLists[0];
						attachLists[0] = attachLists[j];
						attachLists[j] = temp;
					} else if (parseInt(attachLists[j].substr(10)) < parseInt(attachLists[i].substr(10))) {
						temp = attachLists[i];
						attachLists[i] = attachLists[j];
						attachLists[j] = temp;
					}
				}
			}
		}

		$target.each(function(i) {
			try {
				var $this = $(this);

				var datas = result[attachLists[i]];

				for (var i = datas.length - 1; i >= 0; i--) {
					// 判断一下前一个元素是不是mini-webuploader
					var _sourceId = sourceId;

					if (!_sourceId) {
						var $previous = $this.prev();
						if ($previous.hasClass("mini-webuploader")) {
							_sourceId = $previous.prop("id");
						}
					}

					eputil.addAttach(datas[i], _sourceId, $this);
				}
			} catch (e) {
				try {
					console.log(e);
				} catch (e2) {

				}
			}
		});
	},
	/** 附件列表渲染结束* */
	/** PDF预览* */
	openOfficeTopDialog : function(guid, title, type) {
		this.openOfficeDialog(guid, title, type, top);
	},

	openOfficeDialog : function(guid, title, type, source) {
		var _this = this;

		if (!source) {
			source = self;
		}

		if (!guid) {
			return;
		}

		var $root = source.$("body");
		// 遮盖层
		var $shade = source.$("<div class='dialog-shade'></div>");
		$root.append($shade);

		var $dialog = source.$(".pdf-dialog");
		if ($dialog.length == 0) {
			$dialog = source.$("<div class='pdf-dialog'></div>");
			$root.append($dialog);
		}

		var $head = source.$("<div class='pdf-dialog-head'></div>");
		var $body = source.$("<div class='pdf-dialog-body'></div>");
		$dialog.append($head);
		$dialog.append($body);

		var $iframe = source.$("<iframe frameborder='0' allowTransparency='true'></iframe>");
		$body.append($iframe);

		var $title = source.$("<font></font>");
		var $close = source.$("<div class='pdf-dialog-close'></div>");
		$head.append($title);
		$head.append($close);

		$dialog.css("height", $(source).height() - _this.toNumber($dialog.css("top")) * 2);
		$dialog.css("left", ($(source).width() - _this.toNumber($dialog.css("width"))) / 2);
		// 头
		if (title) {
			$title.text(title);
		}
		$body.css("height", $dialog.height() - $head.outerHeight(true));

		var previewUrl = null;

		if (type == "doc" || type == "ppt" || type == "pdf" || type == "excel") {
			// 因为是进行过转换，这边先将类型强制转换成PDF
			var fileName = "";
			if (title) {
				var array = title.split(".");
				if (array.length > 1) {
					fileName = array[array.length - 2] + ".pdf";
				} else {
					fileName = array[0] + ".pdf";
				}
			}

			previewUrl = _rootPath + "/" + eputil.resPath + "pdfviewer/viewer?fileName=" + fileName + "&";

			if (type == "doc") {
				previewUrl += "wordGuid=" + guid;
			} else if (type == "ppt") {
				previewUrl += "pptGuid=" + guid;
			} else if (type == 'excel') {
				previewUrl += "excelGuid=" + guid;
			}
		}
		// else if (type == "excel") {
		// previewUrl = _rootPath + "/" + eputil.resPath +
		// "pdfviewer/viewer?excelGuid=" + guid;
		// }
		else {
			previewUrl = _rootPath + "/" + eputil.resPath + "pdfviewer/viewer?fileName=" + (encodeURIComponent(title) || "") + "&attachGuid=" + guid;
		}

		$iframe.prop("src", previewUrl);

		$shade.on("click", function() {
			_this._destoryOfficeDialog(source);
		});
		$close.on("click", function() {
			_this._destoryOfficeDialog(source);
		});
	},

	_destoryOfficeDialog : function(source) {
		source.$(".pdf-dialog").remove();
		source.$(".dialog-shade").remove();
	},
	/** PDF预览结束* */

	/** 附件展示* */
	_currentDegree : 0,

	_orginalImageWidth : 0,
	_orginalImageHeight : 0,
	_currentImageRate : 100,

	_isImageDrag : false,
	_imageDialogStartX : 0,
	_imageDialogStartY : 0,
	_mouseStartX : 0,
	_mouseStartY : 0,

	openImageDialog : function(guid, title, source) {
		var _this = this;

		if (!source) {
			source = self;
		}

		_this._clearImageDialog(source);

		if (typeof guid != 'string') {
			// 如果是dom节点
			guid = guid.getAttribute("data-guid");
		}

		if (!guid) {
			return;
		}

		var src = "";
		if (guid.length < 50) {
			src = _rootPath + "/rest/attachAction.action?cmd=getContent&attachGuid=" + guid;
		} else {
			src = guid;
		}
		// 根
		var $root = source.$("body");
		// 遮盖层
		var $shade = source.$("<div class='dialog-shade'></div>");
		$root.append($shade);

		var $dialog = source.$(".image-dialog");
		if ($dialog.length == 0) {
			$dialog = source.$("<div class='image-dialog'></div>");
			$root.append($dialog);
		}

		var $head = source.$("<div class='image-dialog-head'></div>");
		var $tool = source.$("<div class='image-dialog-toolbar'></div>");
		var $body = source.$("<div class='image-dialog-body'></div>");
		$dialog.append($head);
		$dialog.append($tool);
		$dialog.append($body);

		var $title = source.$("<font></font>");
		var $close = source.$("<div class='image-dialog-close'></div>");
		$head.append($title);
		$head.append($close);

		var $left = source.$("<div class='image-dialog-icon' type='left'></div>");
		var $right = source.$("<div class='image-dialog-icon' type='right'></div>");
		var $bigger = source.$("<div class='image-dialog-icon' type='bigger'></div>");
		var $smaller = source.$("<div class='image-dialog-icon' type='smaller'></div>");
		var $download = source.$("<div class='image-dialog-icon' type='download'></div>");
		$tool.append($left);
		$tool.append($right);
		$tool.append($bigger);
		$tool.append($smaller);
		$tool.append($download);

		var $previous = source.$("<div class='image-dialog-jump' type='previous'></div>");
		var $content = source.$("<div class='image-dialog-body-content'></div>");
		var $next = source.$("<div class='image-dialog-jump' type='next'></div>");
		$body.append($previous);
		$body.append($content);
		$body.append($next);

		var $img = source.$("<img></img>");
		$content.append($img);

		// 渲染效果
		$dialog.css("width", $(source).width() - _this.toNumber($dialog.css("left")) * 2);
		$dialog.css("height", $(source).height() - _this.toNumber($dialog.css("top")) * 2);
		// 头
		if (title) {
			$title.text(title);
		}
		// 主体
		$body.css("height", $dialog.height() - $head.outerHeight(true) - $tool.outerHeight(true));

		var content_width = $body.width() - $previous.outerWidth(true) - $next.outerWidth(true);
		var content_height = $body.height() - 10;

		$content.css("width", content_width);
		$content.css("height", content_height);

		var image = new Image();
		image.src = src;
		$img[0].src = src;

		image.onload = function() {
			_this._resizeImage($img, this, content_width, content_height);
		};
		if (image.complete) {
			_this._resizeImage($img, image, content_width, content_height);
		}

		// 事件
		$close.on("click", function() {
			_this._destoryImageDialog(source);
		});
		$shade.on("click", function() {
			_this._destoryImageDialog(source);
		});
		$left.on("click", function() {
			_this._rotateImage($img, -1);
		});
		$right.on("click", function() {
			_this._rotateImage($img, 1);
		});
		$bigger.on("click", function() {
			_this._zoomImage($img, $content, 1);
		});
		$smaller.on("click", function() {
			_this._zoomImage($img, $content, -1);
		});
		$download.on("click", function() {
			if (guid.length < 50) {
				window.location.href = src;
			} else {
				window.open(src);
			}
		});
		$previous.on("click", function() {
			_this._jumpImage(-1, guid);
		});
		$next.on("click", function() {
			_this._jumpImage(1, guid);
		});
		// 拖动
		$img.on("mousedown", function(e) {
			_this.isImageDrag = true;

			_this.mouseStartX = e ? e.clientX : window.event.clientX;
			_this.mouseStartY = e ? e.clientY : window.event.clientY;

			_this.imageDialogStartX = _this.toNumber(this.style.marginLeft);
			_this.imageDialogStartY = _this.toNumber(this.style.marginTop);
		});
		$img.on("mouseup", function() {
			_this.isImageDrag = false;
		});
		$img.on("mousemove", function(e) {
			if (_this.isImageDrag) {
				var currentX = e ? e.clientX : window.event.clientX;
				var currentY = e ? e.clientY : window.event.clientY;

				this.style.marginLeft = (_this.imageDialogStartX + currentX - _this.mouseStartX) + 'px';
				this.style.marginTop = (_this.imageDialogStartY + currentY - _this.mouseStartY) + 'px';
			}

			return false;
		});
		// 滚动
		if (window.addEventListener) {
			window.addEventListener("mousewheel", function(e) {
				e = e || window.event;
				var direct = e.wheelDelta ? e.wheelDelta : e.detail;

				_this._mousewheelImage($img, $content, direct);
			});
		} else if (window.attachEvent) {
			window.attachEvent("onmousewheel", function(e) {
				e = e || window.event;
				var direct = e.wheelDelta ? e.wheelDelta : e.detail;

				_this._mousewheelImage($img, $content, direct);
			});
		}
	},

	openImageTopDialog : function(guid, title) {
		this.openImageDialog(guid, title, top);
	},

	_clearImageDialog : function(source) {
		var $dialog = source.$(".image-dialog");
		$dialog.html('');

		source.$(".dialog-shade").remove();

		this._currentDegree = 0;
		this._orginalImageWidth = 0;
		this._orginalImageHeight = 0;
		this._currentImageRate = 100;

		this._isImageDrag = false;
		this._imageDialogStartX = 0;
		this._imageDialogStartY = 0;
		this._mouseStartX = 0;
		this._mouseStartY = 0;

		return $dialog;
	},

	_destoryImageDialog : function(source) {
		var $dialog = this._clearImageDialog(source);
		$dialog.remove();
	},

	_resizeImage : function($img, imageObj, c_width, c_height) {
		var f_height = 0;
		var f_width = 0;

		if (imageObj.height > c_height || imageObj.width > c_width) {
			var ip = imageObj.height / imageObj.width;
			var cp = c_height / c_width;
			if (ip > cp) {
				f_height = c_height;
				f_width = c_height / ip;
			} else {
				f_width = c_width;
				f_height = c_width * ip;
			}
		} else {
			f_height = imageObj.height;
			f_width = imageObj.width;
		}

		this._orginalImageHeight = f_height;
		this._orginalImageWidth = f_width;

		$img.prop("height", f_height);
		$img.prop("width", f_width);
		$img.css("margin-top", (c_height - f_height) / 2);
		$img.css("margin-left", (c_width - f_width) / 2);
	},

	_rotateImage : function($img, type) {
		var img = $img[0];

		if (type == 1) {
			this._currentDegree++;
			if (this._currentDegree > 3) {
				this._currentDegree = 0;
			}
		} else {
			this._currentDegree--;
			if (this._currentDegree < 0) {
				this._currentDegree = 3;
			}
		}

		img.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')";
		if (img.filters) {
			var deg2radians = Math.PI * 2 / 360;

			var rad = (this._currentDegree * 90) % 360 * deg2radians;
			var costheta = Math.cos(rad);
			var sintheta = Math.sin(rad);
			img.filters.item(0).M11 = costheta;
			img.filters.item(0).M12 = -sintheta;
			img.filters.item(0).M21 = sintheta;
			img.filters.item(0).M22 = costheta;
		} else {
			img.style.filter = '';

			$img.css("transform", "rotate(" + (this._currentDegree * 90) + "deg)");
			$img.css("-ms-transform", "rotate(" + (this._currentDegree * 90) + "deg)");
		}
	},

	_zoomImage : function($img, $contain, type) {
		if (type == 1) {
			if (this._currentImageRate >= 300) {
				return;
			} else {
				this._currentImageRate += 10;
			}
		} else {
			if (this._currentImageRate <= 20) {
				return;
			} else {
				this._currentImageRate -= 10;
			}
		}

		$img.prop("height", this._orginalImageHeight * this._currentImageRate / 100);
		$img.prop("width", this._orginalImageWidth * this._currentImageRate / 100);
		$img.css("margin-top", ($contain.height() - $img.height()) / 2);
		$img.css("margin-left", ($contain.width() - $img.width()) / 2);
	},

	_mousewheelImage : function($img, $contain, nagative) {
		var type = 1;
		if (nagative == 120 || nagative == -3) {
			type = 1;
		} else {
			type = -1;
		}

		this._zoomImage($img, $contain, type);
	},

	_jumpImage : function(type, currentGuid) {
		var next = null;
		var $link = $(".image-dialog-link");

		$link.each(function(i) {
			var $this = $(this);

			var guid = $this.data("guid");
			if (guid) {
				if (guid == currentGuid) {
					if (type == 1) {
						next = $link[i + 1];
					} else {
						next = $link[i - 1];
					}

					return false;
				}
			}
		});

		if (next) {
			next.click();
		} else {
			alert("没有更多图片了");
		}
	},
	/** 附件展示结束* */

	/**
	 * 绑定树的搜索事件
	 */
	bindTreeSearch : function(treeId, searchId) {
		var tree = mini.get(treeId);
		if (tree) {
			tree.on("nodeselect", function(e) {
				if (e.node.id != "") {
					mini.get(searchId).setValue(e.node.id);
				} else {
					mini.get(searchId).setValue();
				}
				searchData();
			});
		}
	},

	// 是否是图片
	isImage : function(fileName) {
		try {
			if (fileName) {
				var extStart = fileName.lastIndexOf(".");
				var ext = fileName.substring(extStart, fileName.length).toUpperCase();
				if (ext == ".BMP" || ext == ".PNG" || ext == ".GIF" || ext == ".JPG" || ext == ".JPEG") {
					return true;
				}
			}
		} catch (e) {

		}

		return false;
	},

	// 页面加载后一些特殊控件的处理
	initSpecial : function() {
		// 单选按钮如果未有选中，默认选择第一个
		var $radiolist = $(".mini-radiobuttonlist");
		$radiolist.each(function(i) {
			var radiolist = mini.get(this.id);
			if (radiolist && !radiolist.getValue()) {
				if (radiolist.data && radiolist.data.length > 0) {
					radiolist.setValue(radiolist.data[0].id);
				}
			}
		});

		// 排序号字段默认一个0
		var ordernumber = mini.get("ordernumber");
		if (ordernumber && !ordernumber.getValue()) {
			ordernumber.setValue(0);
		}
	},
	// 数据异常处理
	initError : function(data) {
		if (data && data.dataError) {
			// 数据异常之后，禁用所有按钮，并弹出提示框
			epoint.alert("数据异常，请勿继续操作！");

			$(".mini-button").each(function() {
				var button = mini.get(this.id);
				if (button && !$(this).hasClass("mini-messagebox-button")) {
					button.disable();
				}
			});
			// 禁用上传
			$(".mini-webuploader").each(function() {
				var uploader = mini.get(this.id);
				if (uploader) {
					uploader.disable();
				}
			});
		}
	},
	// 初始化水印
	initWaterMark : function() {
		var waterMarkCss = "url(" + _rootPath + "/rest/zhattachaction/getWaterMark?isCommonDto=true) repeat";

		// 手风琴
		var $accordion = $(".fui-acc-bd");
		if ($accordion.length > 0) {
			$accordion.css("background", waterMarkCss);
		} else {
			// 无手风琴的话，加到form上
			var $content = $(".fui-content");
			if ($content.length > 0) {
				$content.css("background", waterMarkCss);
			}
		}

		// 表格
		var $grid = $(".mini-grid-rows-view");
		if ($grid.length > 0) {
			$grid.css("background", waterMarkCss);
			// 此时要覆盖掉表格的一些样式
			var styleSheets = document.styleSheets;
			for (var i = styleSheets.length - 1; i >= 0; i++) {
				if (!styleSheets[i].href) {
					styleSheets[i].insertRule("html body .mini-grid-row-selected{background: #dfedfa !important;}");
					styleSheets[i].insertRule("html body .mini-grid-row-hover{background: #fffed5 !important;}");
					styleSheets[i].insertRule(".mini-grid-row-alt{background: transparent !important;}");
					break;
				}
			}
		}
	},

	/** 流程步骤开始* */
	WORK_FLOW_DEFAULT_TEMPLATE : "<div class='head'><span class='date'>{{donedate}}</span><span class='step-name'>{{stepname}}</span><span class='step-label'>当前节点：</span></div><div class='body'>{{#contents}}<p>{{.}}</p>{{/contents}}</div>",

	renderWorkflowSteps : function(rootId, datas, param) {
		var $root = $("#" + rootId);
		if ($root.length == 0) {
			return;
		}

		$root.addClass("clearfix");
		$root.addClass("workflow-steps")

		$root.html("<div class='left'><ul></ul></div><div class='right'><ul></ul></div>")

		if (!datas) {
			return;
		}

		if (typeof data == 'string') {
			datas = JSON.parse(datas);
		}

		for (var i = 0, length = datas.length; i < length; i++) {
			eputil.addWorkflowStep($root, i, datas[i]);
		}

		// 最后绑定事件

	},
	// 添加一个活动步骤
	addWorkflowStep : function($root, index, data) {
		var $left = $root.find(".left>ul");
		var $right = $root.find(".right>ul");

		var guid = data.guid || "workflow_" + index;

		var li = ("<li data-guid='" + guid + "'><a>" + data.stepname + "</a></li>");
		$left.append(li);

		var item = "<li data-guid='" + guid + "'>" + Mustache.render(eputil.WORK_FLOW_DEFAULT_TEMPLATE, data) + "</li>"
		$right.append(item);
	},
	/** 流程步骤结束* */

	encryptedString : function(value) {
		if (!value) {
			return "";
		}

		return RSAUtils.encryptedString(eputil.publicKey, value);
	},

	// 页面是否已经加载完毕，用于区分是页面初始化还是后续refresh
	isPageLoaded : false,
	// 公钥
	publicKey : null,

	beforeOnLoad : function(data) {
		if (!this.isPageLoaded) {
			// 创建公钥，加密过程必须放before里
			try {
				this.publicKey = RSAUtils.getKeyPair(data.publicExponent, "", data.modulus);
			} catch (e) {
				this.publicKey = null;
			}
		}
	},

	afterOnLoad : function(data) {
		if (!this.isPageLoaded) {
			// 页面已经加载过一次了
			this.isPageLoaded = true;

			// 特殊处理
			this.initSpecial();
			// 数据非法提示
			this.initError(data);
			// 渲染定位信息
			this.renderLocate();
			// 渲染附件
			this.renderAttachList(data);
			// 缓存控件
			this.initCacheControl();
			// 水印
			if (data.waterMark) {
				this.initWaterMark();
			}
		}
	},

	/** 目录树相关 * */
	catalogTreeSingleSelectCall : function(data) {

	},
	openCatalogTreeSingle : function(targettype, e) {
		eputil.openCatalogTree("single", targettype, e.source);
	},
	openDataCatalogTreeSingle : function(e) {
		eputil.openCatalogTree("data", null, e.source);
	},
	openCatalogTree : function(model, targettype, source) {
		var url = null;
		var param = null;
		if (model == 'single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdtagcatalogtreesingle?targettype=' + targettype;

			param = {
				width : 350,
				height : 400
			};
		} else if (model == 'data') {
			url = 'frame/pages/eianalysedemosys/tree/pbdtagdatatreesingle';

			param = {
				width : 350,
				height : 400
			};
		}

		if (url) {
			epoint.openTopDialog('选择', url, function(rtn) {
				if (!rtn) {
					return;
				}
				if (rtn != "close") {
					if (source.type == "buttonedit") {
						var text = "";
						var value = "";

						if (model.indexOf("single") >= 0) {
							text = rtn.fullPath || rtn.text;
							value = rtn.id;
						} else if (model.indexOf("data") >= 0) {
							text = rtn.text;
							value = rtn.id;
						} else {
							for (var i = 0, length = rtn.length; i < length; i++) {
								text += rtn[i].text + ";";
								value += rtn[i].value + ";";
							}
						}
						source.setValue(value);
						source.setText(text);
						source.validate(source);
					}
				}
				eputil.catalogTreeSingleSelectCall(rtn);
			}, param);
		} else {
			epoint.alert("未知的选择树！");
		}
	},
	/** 目录树开始* */
	/** 关系树开始 * */
	pbdRelationCatalogTreeSingleSelectCall : function(data) {

	},
	openPbdRelationCatalogTreeSingle : function(e) {
		eputil.openPbdRelationCatalogTree("single", e.source);
	},
	openPbdRelationCatalogCodeTreeSingle : function(e) {
		eputil.openPbdRelationCatalogTree("code-single", e.source);
	},
	openPbdRelationCatalogTree : function(model, source) {
		var url = null;
		var param = null;

		if (model == 'single') {
			url = 'eianalysedemosys/tree/pbdrelationcatalogsingle';
			param = {
				width : 350,
				height : 400
			};
		} else if (model == 'code-single') {
			url = 'eianalysedemosys/tree/pbdrelationcatalogsingle';
			param = {
				width : 350,
				height : 400
			};
		}
		if (url) {
			epoint.openTopDialog('选择', url, function(rtn) {
				if (!rtn) {
					return;
				}
				if (rtn != "close") {
					if (source.type == "buttonedit") {
						var text = "";
						var value = "";
						if (model.indexOf("code") >= 0) {
							text = rtn.text;
							value = rtn.code;
						} else {
							text = rtn.text;
							value = rtn.id;
						}

						source.setValue(value);
						source.setText(text);
						source.validate(source);
					}
				}
				eputil.pbdRelationCatalogTreeSingleSelectCall(rtn);
			}, param);
		} else {
			epoint.alert("未知的选择树！");
		}
	},
	/** 关系树结束* */
	/** 模型分类树相关 * */
	modelCategoryTreeSingleSelectCall : function(data) {

	},
	openModelCategoryTreeSingle : function(e) {
		eputil.openModelCategoryTree("single", e.source);
	},
	openModelCategoryTree : function(model, source) {
		var url = null;
		var param = null;

		if (model == 'single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdmodelcategorytreesingle';

			param = {
				width : 350,
				height : 400
			};
		}
		if (url) {
			epoint.openTopDialog('选择', url, function(rtn) {
				if (!rtn) {
					return;
				}
				if (rtn != "close") {
					if (source.type == "buttonedit") {
						var text = "";
						var value = "";

						if (model.indexOf("single") >= 0) {
							text = rtn.fullPath || rtn.text;
							value = rtn.id;
						} else if (model.indexOf("data") >= 0) {
							text = rtn.text;
							value = rtn.tagcode;
						} else {
							for (var i = 0, length = rtn.length; i < length; i++) {
								text += rtn[i].text + ";";
								value += rtn[i].value + ";";
							}
						}
						source.setValue(value);
						source.setText(text);
						source.validate(source);
					}
				}
				eputil.modelCategoryTreeSingleSelectCall(rtn);
			}, param);
		} else {
			epoint.alert("未知的选择树！");
		}
	},
	/** 目录树开始* */

	/** 目录类别树相关 * */
	importCatalogTreeSelectCall : function(data) {

	},
	openImportCatalogRootTreeSingle : function(e) {
		eputil.openImportCatalogTree("root-single", e.source);
	},
	openImportCatalogTreeSingle : function(e) {
		eputil.openImportCatalogTree("catalog-single", e.source);
	},
	openImportCatalogTree : function(model, source, param) {
		var url = null;
		var opt = null;

		if (model.indexOf("single") > 0) {
			opt = {
				width : 400,
				height : 500
			};
		} else {
			opt = {
				width : 750,
				height : 500
			};
		}
		if (param) {
			opt.param = param;
		} else {
			opt.param = {};
		}

		if (model == 'root-single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdimportcatalogtreesingle?contain=root';
		} else if (model == 'catalog-single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdimportcatalogtreesingle';
		}

		if (url) {
			epoint.openTopDialog('选择', url, function(rtn) {
				if (!rtn) {
					return;
				}

				if (rtn != "close" && source) {
					rtn.source = source.id;

					if (source.type == "buttonedit") {
						var text = "";
						var value = "";

						if (model.indexOf("single") > 0) {
							text = rtn.fullPath || rtn.text;
							value = rtn.id;
						} else {
							for (var i = 0, length = rtn.length; i < length; i++) {
								text += rtn[i].text + ";";
								value += rtn[i].value + ";";
							}
						}

						source.setValue(value);
						source.setText(text);
						source.validate();
					}
				}

				eputil.importCatalogTreeSelectCall(rtn);
			}, opt);
		} else {
			epoint.alert("未知的选择树！");
		}
	},
	/** 目录类别树相关结束 * */
	/** 资源类别树相关 * */
	resourceCategroyTreeSelectCall : function(data) {

	},
	openResourceCategroyContainRootTreeSingle : function(e) {
		eputil.openResourceCategroyTree("root-single", e.source);
	},
	openResourceCategroyTreeSingle : function(e) {
		eputil.openResourceCategroyTree("category-single", e.source);
	},
	openResourceCategroyTree : function(model, source, param) {
		var url = null;
		var opt = null;

		if (model.indexOf("single") > 0) {
			opt = {
				width : 400,
				height : 500
			};
		} else {
			opt = {
				width : 400,
				height : 500
			};
		}
		if (param) {
			opt.param = param;
		} else {
			opt.param = {};
		}

		if (model == 'root-single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdresourcecategorycontainroottree';
		} else if (model == 'category-single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdresourcecategorytree';
		}

		if (url) {
			epoint.openTopDialog('选择', url, function(rtn) {
				if (!rtn) {
					return;
				}

				if (rtn != "close" && source) {
					rtn.source = source.id;

					if (source.type == "buttonedit") {
						var text = "";
						var value = "";

						if (model.indexOf("single") > 0) {
							text = rtn.fullPath || rtn.text;
							value = rtn.id;
						} else {
							text = rtn.text;
							value = rtn.value;
						}

						source.setValue(value);
						source.setText(text);
						source.validate();
					}
				}

				eputil.resourceCategroyTreeSelectCall(rtn);
			}, opt);
		} else {
			epoint.alert("未知的选择树！");
		}
	},
	/** 资源类别树相关结束 * */
	/** 全文检索目录分类树相关 * */
	searchGlobalCatalogTreeSelectCall : function(data) {

	},
	openSearchGlobalCatalogRootTreeSingle : function(e) {
		eputil.openSearchGlobalCatalogTree("root-single", e.source);
	},
	openSearchGlobalCatalogTreeSingle : function(e) {
		eputil.openSearchGlobalCatalogTree("catalog-single", e.source);
	},
	openSearchGlobalCatalogTree : function(model, source, param) {
		var url = null;
		var opt = null;

		if (model.indexOf("single") > 0) {
			opt = {
				width : 400,
				height : 500
			};
		} else {
			opt = {
				width : 750,
				height : 500
			};
		}
		if (param) {
			opt.param = param;
		} else {
			opt.param = {};
		}

		if (model == 'root-single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdsearchglobalcatalogtreesingle?contain=root';
		} else if (model == 'catalog-single') {
			url = 'frame/pages/eianalysedemosys/tree/pbdsearchglobalcatalogtreesingle';
		}

		if (url) {
			epoint.openTopDialog('选择', url, function(rtn) {
				if (!rtn) {
					return;
				}

				if (rtn != "close" && source) {
					rtn.source = source.id;

					if (source.type == "buttonedit") {
						var text = "";
						var value = "";

						if (model.indexOf("single") > 0) {
							text = rtn.fullPath || rtn.text;
							value = rtn.id;
						} else {
							for (var i = 0, length = rtn.length; i < length; i++) {
								text += rtn[i].text + ";";
								value += rtn[i].value + ";";
							}
						}

						source.setValue(value);
						source.setText(text);
						source.validate();
					}
				}

				eputil.searchGlobalCatalogTreeSelectCall(rtn);
			}, opt);
		} else {
			epoint.alert("未知的选择树！");
		}
	},
/** 目录类别树相关结束 * */
};

/** 初始化地图地址* */
// 地图点定位地址
try {
	eputil.mapUrl.locate = eputil.mapUrl.root + "maplocate.html",
	// 地图面定位地址
	eputil.mapUrl.draw = eputil.mapUrl.root + "mapdraw.html",
	// 地址坐标预览地址
	eputil.mapUrl.view = eputil.mapUrl.root + "mapview.html"
} catch (e) {

}
/** 初始化地图地址结束* */

// initPage之之前
function epoint_beforeInit(e) {
	eputil.beforeOnLoad(e);
}
function epoint_afterInit(e) {
	eputil.afterOnLoad(e);
}
// 表格的搜索
function searchData(extraIds) {
	var ids = [ 'datagrid' ];

	if ($("#fui-form").length > 0) {
		ids.push("fui-form");
	}

	if (extraIds) {
		if ($.isArray(extraIds)) {
			ids.concat(extraIds);
		} else {
			ids.push(extraIds);
		}
	}
	epoint.refresh(ids, null, true);
}

function onEditRenderer(e) {
	return eputil.onEditRenderer(e);
}

function onDetailRenderer(e) {
	return eputil.onDetailRenderer(e);
}

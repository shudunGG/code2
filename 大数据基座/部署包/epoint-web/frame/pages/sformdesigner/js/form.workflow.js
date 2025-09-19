$(function() {
	// 初始化页面
	if (!window.epointsformworkflowactionname) {// 工作流页面actionname，可个性化
		window.epointsformworkflowactionname = "sformdesigncommonaction";
	}
	epoint.initPage(window.epointsformworkflowactionname
			+ window.epointsformurl, '', initCallBack);

	var tableId;

	// 所有代码项联动控件
	var allCodeSyncCtrArr = mini.findControls(function(a) {
		if (a.type == 'combobox'
				&& a.el.getAttribute('data-codelist') == 'true')
			return true;
	});

	function closeValueFromSelect() {
		// 加载数据前 先关闭 ValueFromSelect 属性 防止误数据源时 value 丢失
		$.each(allCodeSyncCtrArr, function(i, ctr) {
			ctr.setValueFromSelect && ctr.setValueFromSelect(false);
		});
	}
	if (epoint.on) {
		epoint.on('preload', closeValueFromSelect);
	} else {
		epoint.onPreload = closeValueFromSelect;
	}

	function initCallBack(data) {
		if (window.initPageControl) {
			initPageControl(data);
		};

		// 触发加载代码项联动
		$.each(allCodeSyncCtrArr, function(i, ctr) {
			var v = ctr.getValue();
			if (!v) {
				return;
			}
			var valuechangedArr = ctr._events && ctr._events.valuechanged;
			if (!valuechangedArr || !valuechangedArr.length) {
				return;
			}
			// 为了避免联动代码项触发 valuechanged 事件时同时触发用户自己绑定valuechange事件 代码联动的事件加了事件名称来过滤调用
            valuechangedArr.forEach(function (item) {
                if (item && item[0].name === 'handleCodeLink') {
                    item[0].call(ctr, {
                        value: v,
                        type: 'valuechanged',
                        sender: ctr
                    });
                }
            });
			ctr.setValueFromSelect && ctr.setValueFromSelect(true);
		});

		try {
			var flag = mini.get("flag").getValue();
			if (addInit && (typeof (addInit) == "function")
					&& (!flag || flag == "true")) {
				mini.get("flag").setValue("true");
				addInit();
			}
		} catch (e) {
		}
		if (data && data.rowGuid) {
			mini.get("rowGuid").setValue(data.rowGuid);
		}
		// 宏控件
		if (data != null && data.map != null && data.map.reMap != null) {
			console.log(data.map.reMap);
			for (var m = 0; data.map.reMap.length > 0
					&& m < data.map.reMap.length; m++) {
				var id = data.map.reMap[m].id;
				var value = data.map.reMap[m].value;
				if (document.getElementById(id)) {
					mini.get(id).setValue(value);
					// document.getElementById(id).value = value;
				}
			}
		}

		// 查找页面所有子表id,存放在hidden控件
		var a = $(".mini-datagrid");
		var ids = "";
		for (var n = 0; a.length > 0 && n < a.length; n++) {
			ids += a.get(n).id;
			if (n != a.length - 1) {
				ids += ",";
			}
		}
		mini.get("gridIds").setValue(ids);

		if (data) {
			setControlsAccessRight(data);
		}
		;

		// 针对人员控件弹窗模式在修改页面时无法展示对应的文本值
		var items = "";
		$('.mini-buttonedit').each(
				function(i, item) {
					if (item.id) {
						items += item.id + "_gtigepoint_"
								+ mini.get(item.id).getValue() + ":";
					}

				});
		epoint.execute('initButtonEdit', '', items, function(datas) {
			var s = datas.dataList.split(":");
			if (s.length > 0) {
				for (i = 0; i < s.length; i++) {
					var controls = s[i].split("_gtigepoint_");
					if (controls.length == 2) {
						mini.get(controls[0]).setText(controls[1]);
					}
				}
			}
		});
		var formids = Util.getUrlParams('formids') || '';
        if(formids){
        	   epoint.execute('inItMulitRelation', '@none', '',function(data){
        		   if(data){
        			   var arr=data.shareFieldList;        	     
                       var role = $("[role='accordion']");
                         role.each(function (i, item) {
                             if (item.id == 'share') {
                             	var childControls=mini.getChildControls(item);
                             	for (i = 0; i < childControls.length; i++){
                             		var control = childControls[i];
                             		 if(arr){
                             			 var index=arr.indexOf(control.name);
                             			 if(index==-1){           				 
                             				 eventFuns.hide([{ type: 'control', id: control.id }])
                             			 }
                              			
                             		 }
                             	}
                              
                             }
                      
                          });
        		   }              	                 
                });
        }
	}

	window["saveForm"] = function() {
		if (epoint.validate()) {
			epoint.execute('newSaveForm', 'fui-form', newSaveCallback);
		} else
			ShowTdOperate(true);
	};

	function newSaveCallback(data) {
		if (data.validate && data.validate == "false") {
			if (data && data.msg) {
				epoint.alert(data.msg, '', null, 'info');
			}
			ShowTdOperate(true);
		} else {
			if (data.isSuccess == 2) {
				epoint.alert(data.msg);
				ShowTdOperate(true);
			} else {
				HeaderSubmit();
			}
		}

	}
	;

	window["submit"] = function() {
		if (epoint.validate()) {
			epoint.execute('submit', 'fui-form', newCallback);
		} else
			ShowTdOperate(true);
	}

	function newCallback(data) {
		if (data.validate && data.validate == "false") {
			if (data && data.msg) {
				epoint.alert(data.msg, '', null, 'info');
			}
			ShowTdOperate(true);
		} else {
			if (data.isSuccess == 2) {
				epoint.alert(data.msg);
				ShowTdOperate(true);
			} else {
				HeaderSubmit();
			}
		}

	}

	window["add"] = function(id) {
		epoint.execute('add', '', [ id ], searchData);
	}

	window["del"] = function(id, row) {
		var rowguid = "";
		if (row && row.rowguid) {
			rowguid = row.rowguid;
		}
		epoint.execute('del', '', [ id, rowguid ], searchData);
	}

	window["searchData"] = function(data) {
		if (data && data.gridId) {
			epoint.refresh(data.gridId);
			mini.get("flag").setValue("false");
		}
	}

	window["refreshControl"] = function() {
		epoint.refresh([ 'form' ]);
	}

	/**
	 * 子表列表new控件新增记录操作响应事件
	 */
	window["openAdd"] = function(id) {
		var parentGuid = mini.get("rowGuid").getValue();
		epoint.execute('getEnableVersionUrl', '', [ id, parentGuid ],
				searchBack);
	}

	window["searchBack"] = function(args) {
		if (args && args.openAddUrl) {
			epoint.openDialog("新增记录", args.openAddUrl, recallBack, {
				'width' : 1000
			});
		} else {
			epoint.alertAndClose(args.msg);
		}
	}

	window["realDel"] = function(id, row) {
		var rowguid = "";
		if (row && row.rowguid) {
			rowguid = row.rowguid;
		}
		epoint.execute('realDel', '', [ id, rowguid ], searchData);
	}

	/**
	 * 表格数据导入成功
	 */
	window["onFileSuccess"] = function(e) {
		if (e.data && e.data.extraDatas.msg) {
			epoint.alert(e.data.extraDatas.msg, '', null, 'info');
			epoint.refresh(mini.get("gridIds").getValue().split(','));
		}
	}

	// 身份证号码验证
	window["onIDCardsValidation"] = function(e) {
		if (e.isValid) {
			if (e.value != "" && e.value != null) {
				var pattern = /\d*/;
				if (e.value.length < 15 || e.value.length > 18
						|| pattern.test(e.value) == false) {
					e.errorText = "身份证必须输入15~18位数字";
					e.isValid = false;
				}
			}
		}
	}

	// 移动电话验证
	window["mobileValidation"] = function(e) {
		if (e.isValid) {
			if (e.value != "" && e.value != null) {
				var result = e.value
						.match(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/);
				if (result == null) {
					e.errorText = "请输入正确格式的移动电话";
					e.isValid = false;
				}
			}
		}
	}

	// 固定电话验证（正确格式为：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX）
	window["phoneValidation"] = function(e) {
		if (e.isValid) {
			if (e.value != "" && e.value != null) {
				var result = e.value.match(/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/);
				if (result == null) {
					e.errorText = "请输入正确格式的固定电话";
					e.isValid = false;
				}
			}
		}
	}

	// 邮政编码验证
	window["postCodeValidation"] = function(e) {
		if (e.isValid) {
			if (e.value != "" && e.value != null) {
				var result = e.value.match(/^[1-9]{1}[0-9]{5}$/);
				if (result == null) {
					e.errorText = "请输入正确格式的邮政编码";
					e.isValid = false;
				}
			}
		}
	}

	// 整数验证
	window["intValidation"] = function(e) {
		if (e.isValid) {
			if (e.value != "" && e.value != null) {
				var result = e.value.match(/^(-|\+)?\d+$/);
				if (result == null) {
					e.errorText = "请输入整数";
					e.isValid = false;
				}
			}
		}
	}

	// 数字验证
	window["floatValidation"] = function(e) {
		if (e.isValid) {
			if (e.value != "" && e.value != null) {
				if (isNaN(e.value)) {
					e.errorText = "请输入数字";
					e.isValid = false;
				}
			}
		}
	}

	window["fillControl"] = function(controlId) {
		epoint.execute('resetControlValue', 'fui-form', [ controlId ],
				function callback(data) {
					// 可扩展控件默认值回传设置控件值
					if (data != null && data.resetControlMap != null
							&& data.resetControlMap.map != null) {
						for (var m = 0; data.resetControlMap.map.length > 0
								&& m < data.resetControlMap.map.length; m++) {
							var id = data.resetControlMap.map[m].id;
							var value = data.resetControlMap.map[m].value;
							if (document.getElementById(id)) {
								mini.get(id).setValue(value);
							}
						}
					}
				});
	}

	window["validate"] = function() {
		epoint.validate();
	}

	/**
	 * 子表列表new控件修改操作列相应事件
	 */
	var editTableId = "";
	window["onEditRenderer"] = function(e) {
		// editTableId = e.sender.el.id;
		return epoint.renderCell(e, "action-icon icon-edit", "openViewDialog",
				"rowguid,gridId");
	}

	window["openViewDialog"] = function(data) {
		var rowguid = data.rowguid;
		var gridId = data.gridId;
		epoint.execute('getEditUrl', '', [ gridId, rowguid ], showUrl);
	}

	window["showUrl"] = function(args) {
		editTableId = args.editTableId;
		if (args.editUrl) {
			epoint.openDialog("表单详细信息", args.editUrl, refreshBack, {
				'width' : 1000
			});
		} else {
			epoint.alertAndClose(args.message);
		}
	}

	window["refreshBack"] = function() {
		epoint.refresh(editTableId);
	}

	/* word打印 */
	window["sfromWordPrint"] = function() {
		var docPrintUrl = "frame/pages/sformdesigner/formlistmanage/epointsfromprint?processVersionInstanceGuid="
				+ Util.getUrlParams('ProcessVersionInstanceGuid')
				+ "&tableId="
				+ window.tableId + "&tableguid=" + window.tableguid;
		epoint.openDialog('表单打印', docPrintUrl, function() {
			Util.getSafeLocation().reload();
			parent.ShowTdOperate(true);
		}, {
			'width' : 1200,
			'height' : 1050,
		});
	};

	// tooltips 提示支持
	(function() {
		var $tooltips = $('.control-tips.tips-tooltip');
		if (!$tooltips.length) {
			return;
		}
		// 控件宽度修正 控件宽度需扣除 提示问号宽度
		$tooltips.each(function(i, tip) {
			var $ctr = $(tip).prev();

			var w = $ctr.css('width');

			var w2 = '';
			if (/px$/.test(w)) {
				w2 = parseInt(w, 10) - 30;
			}
			if (!w2) {
				w2 = 'calc( ' + w + ' - ' + '30px )';
			}
			console.log(w, w2);
			$ctr.css('width', w2)

		});

		// 初始化tooltips
		var tip = new mini.ToolTip();
		tip.set({
			target : document,
			trigger : 'hover',
			selector : '.control-tips.tips-tooltip',
			placement : 'bottom',
			autoHide : true
		});
	})();

	// 这边用来显示多表合一情况下指定显示的表单，之前是用tablieID的 后因政务服务改成formid
	var formids = Util.getUrlParams('formids') || '';
	if (formids) {
		var _formids = formids.split(',');
		var $first = $('#' + _formids[0]);
		var $siblings = $first.siblings();
		$siblings.each(function(index, item) {
			if (item.id != 'share' && _formids.indexOf(item.id) < 0) {
				$(item).addClass('hidden');
			}
		});
		var role = $("[role='accordion']");
		role.each(function(i, item) {
			if (item.id != 'share' && _formids.indexOf(item.id) < 0) {
				Util.accordion.hideItemI(i);
			}
		})
	}
	;


	if (Util.browsers.isIE) {
		$(".row-layout").each(function(i, row) {
			var minH = row.style.minHeight;
			if (!minH)
				return;
			$(row).children().each(function(j, col) {
				col.style.minHeight = minH;
			});
		});
	}
	;

});

// 用于电子表单作为iframe嵌入时 高度自适应需求的高度计算实现
(function (win, $) {
    // 非嵌入情况无须处理
    if (win.parent === win) {
        return;
    }

    var log_h = 0;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    function getMinHeight() {
		var ratio = parseInt(document.documentElement.style.fontSize, 10) / (win.HtmlBaseFontSize || 14) || 1;
		// 导出
		if ($('.mini-dataexport').filter(':visible').length) {
            return (360 + 50) * ratio;
        }
        // 日期范围选择
        if ($('.mini-daterangepicker').filter(':visible').length) {
            return (280 + 50) * ratio;
        }
        if ($('.mini-datepicker').filter(':visible').length) {
            return (250 + 50) * ratio;
        }
        if ($('.mini-combobox').filter(':visible').length) {
            return (200 + 50) * ratio;
        }

        return 0;
    }

    function calcPageHeight() {
        var body_h = $('body').height();

        var children_h = calcChildrenHeight($('body'));

        var min_h = getMinHeight();

        return Math.max(min_h, body_h, children_h);
    }
    /**
     * 计算页面某个子元素下所有内容的高度
     *
     * @param {*} dom
     * @returns
     */
    function calcChildrenHeight(dom) {
        var heightArr = $.map($(dom).children(), function (el) {
            var $el = $(el);
            var pos = $el.css('position');
            if (!$el.is(':visible') || pos == 'absolute' || pos == 'fixed') {
                return 0;
            }
            if ($el.hasClass('fui-content')) {
                // 不支持计算就写死20
                var padding = 20;
                // 计算fui-content上的padding
                if (window.getComputedStyle) {
                    var s = window.getComputedStyle($el[0]);
                    padding = (parseInt(s.paddingTop, 10) || 0) + (parseInt(s.paddingBottom, 10) || 0);
                }
                return calcChildrenHeight($el) + padding;
            }
            return $el.outerHeight(true) || 0;
        });

        var t = 0;
        $.each(heightArr, function (i, v) {
            t += v;
        });

        return t;
    }

    var resizeHeight = function () {
        var curr_h = calcPageHeight();
        if (curr_h != log_h) {
            // 发送给父页面 高度信息
            var postData = JSON.stringify({
                type: 'setSFormIframeHeight',
                height: curr_h,
            });
            window.parent.postMessage(postData, '*');
            log_h = curr_h;
        }
    };

    if (MutationObserver) {
        var debounce = function (idle, action) {
            var last;
            return function () {
                var ctx = this,
                    args = arguments;
                clearTimeout(last);
                last = setTimeout(function () {
                    action.apply(ctx, args);
                }, idle);
            };
        };

        var mo = new MutationObserver(debounce(200, resizeHeight));

        mo.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true,
        });
    } else {
        var resizeFun = function () {
            resizeHeight();
            setTimeout(function () {
                resizeFun();
            }, 200);
        };
        resizeFun();
    }
})(this, this.jQuery);

// 电子表单被嵌入使用 弹出dialog可能由于滚动条原因不可见的问题
(function (win, $) {
    if (window.parent === window) return;

    // 在openDialog 时 发送 openDialog 的消息 关闭时 发送 closeDialog 消息
    var _openDialog = epoint.openDialog;
    epoint.openDialog = function openDialog() {
        win.parent.postMessage(JSON.stringify({type:'openDialog'}), '*');
        var d = _openDialog.apply(this, arguments);
        d.on('unload', function () {
            win.parent.postMessage(JSON.stringify({type:'closeDialog'}), '*');
        });
        return d;
    };

    // 父页面如果是滚动条出现的页面 则监听到之后 滚动到可见位置即可。
    // 如父页面仍是iframe嵌入的 则继续向上发消息即可。
    // 注：滚动条页面需完成两个功能：
    // 1、出现dialog时 锁定滚动条，取消时还原（因为继续允许滚动则可能滚成看不见的状态） `.mini-window-lock-scroll {overflow: hidden !important;}` 即可
    // 2、滚动到合适位置使得 dialog 可见。因dialog在显示的父页面中是垂直居中的，则滚动条页面合适的scrollTop为iframe的顶部距离 + iframe可视高度的一半
})(this, this.jQuery);
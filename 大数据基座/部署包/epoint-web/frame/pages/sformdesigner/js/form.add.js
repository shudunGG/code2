/*
 * add页面通用js
 * @Author: liub
 * @Date: 2019-06-14 17:07:01
 * @Last Modified by: chends
 * @Last Modified time: 2021-08-02 17:00:05
 */
(function (win) {
    // 跨域处理
    var messenger = new epointsform.Messenger('epointsformIframe', 'epointsformMessenger');

    // 跨域监听
    messenger.listen(function (msg) {
        if (!msg) {
            return;
        }
        try {
            msg = JSON.parse(msg);
        } catch (e) {}
        if (msg.handleType == 'save') {
            // 保存表单
            if (epoint.validate()) {
                epoint.execute('saveForm', '', closeCallback);
            }
        } else if (msg.handleType == 'getFormData') {
            // 获取表单数据
            var data = getFormData();
            if (data) {
                msg.formData = data;
            } else {
                msg.error = '获取表单数据失败！';
            }
            messenger.targets['parent'].send(JSON.stringify(msg));
        } else if (msg.handleType == 'initFormData') {
            // 初始化表单数据
            if (msg.formData) {
                var form = DtoUtils.getCommonDto('@all');
                try {
                    var formData = [];
                    for (var i = 0, len = msg.formData.length; i < len; i++) {
                        if (msg.formData[i].id == 'tableId' || msg.formData[i].id == 'rowGuid' || msg.formData[i].id == 'gridIds') {
                            continue;
                        }
                        var item = {};
                        var id = mini.getByName(msg.formData[i].fieldName).id;
                        item.id = id;
                        if (msg.formData[i].type == 'datagrid') {
                            item.data = msg.formData[i].data;
                        } else {
                            item.value = msg.formData[i].value;
                        }
                        formData.push(item);
                    }
                    form.setData(formData, null);
                } catch (ee) {
                    msg.error = ee.toString();
                    messenger.targets['parent'].send(JSON.stringify(msg));
                    return;
                }
                messenger.targets['parent'].send(JSON.stringify(msg));
            } else {
                msg.error = '传入初始化表单页面数据为空！';
                messenger.targets['parent'].send(JSON.stringify(msg));
            }
        } else if (msg.handleType == 'validate') {
            // 验证表单合法性
            try {
                if (epoint.validate(msg.notShowAlert)) {
                    msg.validateTag = true;
                } else {
                    msg.validateTag = false;
                    msg.error = '表单保存校验未通过！';
                }
                messenger.targets['parent'].send(JSON.stringify(msg));
            } catch (e) {
                msg.error = '验证表单合法性失败！';
                messenger.targets['parent'].send(JSON.stringify(msg));
            }
        } else if (msg.handleType == 'print' && msg.id) {
            // 打印表单
            if (document.getElementById(msg.id)) {
                msg.innerhtml = document.getElementById(msg.id).innerHTML;
            }
            messenger.targets['parent'].send(JSON.stringify(msg));
        }
    });

    // 跨域处理
    messenger.addTarget(window.parent, 'parent');

    var action = win.epointsformaddactionname || 'sformdesigncommonaddaction';
    var datagrid;

    // 所有代码项联动控件
    var allCodeSyncCtrArr = mini.findControls(function (a) {
        if (a.type == 'combobox' && a.el.getAttribute('data-codelist') == 'true') return true;
    });
    function closeValueFromSelect() {
        // 加载数据前 先关闭 ValueFromSelect 属性 防止误数据源时 value 丢失
        $.each(allCodeSyncCtrArr, function(i, ctr) {
            ctr.setValueFromSelect && ctr.setValueFromSelect(false);
        });
    }
    function restoreValueFromSelect() {
        $.each(allCodeSyncCtrArr, function(i, ctr) {
            ctr.setValueFromSelect && ctr.setValueFromSelect(true);
        });
    }
    if (epoint.on) {
        epoint.on('preload', closeValueFromSelect);
        epoint.on('afterInit', restoreValueFromSelect);
    
    } else {
        epoint.onPreload = closeValueFromSelect;
        epoint.onAfterInit = restoreValueFromSelect;
    }

    epoint.initPage(action + win.epointsformurl, 'fui-form', initCallBack);

    // 初始化页面回调
    function initCallBack(data) {
        if (win.initPageControl) {
            initPageControl(data);
		}
        
        // 触发加载代码项联动
        $.each(allCodeSyncCtrArr, function (i, ctr) {
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
        });
        
        if (data.gridid) {
            datagrid = mini.get(data.gridid);
            var isadd = true; // 是否可新增
            if (isadd && datagrid && datagrid.data.length == 0) {
                var newRow = {
                    rowname: 'New Row',
                };
                // 使用data的长度，控制新增一行时始终在最下面一行
                var row = datagrid.data.length;
                datagrid.addRow(newRow, row);
            }
        }
        // 控制按钮显隐（外部调用时隐藏）
        if (data && data.isShowBtn && data.isShowBtn == 'false') {
            $('#butList').addClass('hidden');
        }

        if (!window.isfirstpageload) {
            window.isfirstpageload = true;
            var msg = {};
            msg.handleType = 'init';
            var data = getFormData();
            if (data) {
                msg.formData = data;
            } else {
                msg.formData = [];
            }
            // msg.height = $('body').height();
            msg.iframeId = 'epointsformIframe';
            messenger.targets['parent'].send(JSON.stringify(msg));
        }
        // 针对人员控件弹窗模式在修改页面时无法展示对应的文本值
        var items = '';
        $('.mini-buttonedit').each(function (i, item) {
            if (item.id) {
                items += item.id + '_gtigepoint_' + mini.get(item.id).getValue() + ':';
            }
        });
        epoint.execute('initButtonEdit', '', items, function (datas) {
            var s = datas.dataList.split(':');
            if (s.length > 0) {
                for (i = 0; i < s.length; i++) {
                    var controls = s[i].split('_gtigepoint_');
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

    // 保存表单
    var saveForm = function () {
        if (datagrid != '' && datagrid != null && datagrid != undefined) {
            if (datagrid.validate()) {
                return;
            }
        }
        if (epoint.validate()) {
            epoint.execute('saveForm', 'fui-form', function (data) {
                if (data.isSuccess) {
                    if (data.isSuccess == 1) {
                        if (data.msg) {
                            epoint.alertAndClose(data.msg);
                        } else {
                            // 这边兼容保存的时候没有返回成功信息
                            epoint.alertAndClose('保存成功!');
                        }
                    } else if (data.isSuccess == 2) {
                        epoint.alertAndClose(data.msg);
                    } else {
                        epoint.alert(data.msg);
                    }
                } else {
                    if (data.isSuccess == 1) {
                        epoint.alertAndClose('保存成功');
                    }
                }
            });
        }
    };
    // 子表新增一条空记录
    var addRow = function (gridId) {
        epoint.execute('addRow', gridId, [gridId], refreshGrid);
    };
    // 子表删除一条记录
    var delRow = function (gridId, rowId) {
        epoint.execute('delRow', gridId, [gridId, rowId], refreshGrid);
    };
    // 刷新子表数据
    var refreshGrid = function (data) {
        if (data && data.gridId) {
            epoint.refresh(data.gridId);
        }
    };

    function getFormData() {
        var form = DtoUtils.getCommonDto('@all');
        if (form && form.getData() && form.getData().commonDto) {
            var fields = JSON.parse(form.getData().commonDto);
            var formData = [];
            for (i in fields) {
                if (!fields[i].id) {
                    continue;
                }

                var control = {};
                if (fields[i].id == 'rowGuid' || fields[i].id == 'gridIds') {
                    control.id = fields[i].id;
                    control.fieldName = fields[i].id;
                    control.fieldCNName = fields[i].id;
                    control.value = fields[i].value;
                    control.type = fields[i].type;
                    formData.push(control);
                    continue;
                } else if (!fields[i].type || fields[i].type == 'hidden') {
                    continue;
                }

                control.fieldName = fields[i].name;
                control.fieldCNName = fields[i].name;

                control.id = fields[i].id;
                control.type = fields[i].type;

                if (fields[i].type == 'datagrid') {
                    fields[i].data = mini.get(fields[i].id).getData();
                    control.data = fields[i].data;
                } else {
                    if (fields[i].value) {
                        control.value = fields[i].value;
                    } else {
                        control.value = '';
                    }
                }
                formData.push(control);
            }
            return formData;
        } else {
            return null;
        }
    }

    // 关闭操作的回调
    function closeCallback(data) {
        var msg = {};
        msg.handleType = 'save';
        if (data && data.error) {
            msg.error = data.error;
            messenger.targets['parent'].send(JSON.stringify(msg));
            return;
        }
        if (data.msg) {
            if (data.isSuccess == 1) {
                window.isFirstPageLoad = true;
                msg.rowGuid = data.rowGuid;
                msg.message = data.msg;
                messenger.targets['parent'].send(JSON.stringify(msg));
            } else if (data.isSuccess == 2) {
                msg.error = data.msg;
                msg.message = data.msg;
                messenger.targets['parent'].send(JSON.stringify(msg));
            } else {
                msg.error = data.msg;
                msg.message = data.msg;
                messenger.targets['parent'].send(JSON.stringify(msg));
            }
        } else {
            if (data.isSuccess == 1) {
                window.isFirstPageLoad = true;
                msg.rowGuid = data.rowGuid;
                msg.message = data.msg;
                messenger.targets['parent'].send(JSON.stringify(msg));
            }
        }
    }

    // 这边用来显示多表合一情况下指定显示的表单，之前是用tablieID的 后因政务服务改成formid
    var formids = Util.getUrlParams('formids') || '';
    if (formids) {
        var _formids = formids.split(',');
        var $first = $('#' + _formids[0]);
        var $siblings = $first.siblings();
        $siblings.each(function (index, item) {
            if (item.id != 'share' && _formids.indexOf(item.id) < 0) {
                $(item).addClass('hidden');
            }
        });

        var role = $("[role='accordion']");
        role.each(function (i, item) {
            if (item.id != 'share' && _formids.indexOf(item.id) < 0) {
                Util.accordion.hideItemI(i);
            }
        });
    }

    if (Util.browsers.isIE) {
        $('.row-layout').each(function (i, row) {
            var minH = row.style.minHeight;
            if (!minH) return;
            $(row)
                .children()
                .each(function (j, col) {
                    col.style.minHeight = minH;
                });
        });
    }
    win.saveForm = saveForm;
    win.addRow = addRow;
    win.delRow = delRow;
})(this);


// 还原字体放大 字体放大导致控件放大，从而会溢出
(function(win, $) {
	
	function restoreFontSize() {
		if (win.Util && win.Util.fontSizeSwitcher) {
			win.Util.fontSizeSwitcher.doUpdateFontSize(1);
		} else {
			document.documentElement.style.fontSize = "100px";
			document.body.style.fontSize = "14px";
		}
	}
	win.addEventListener && win.addEventListener("message", function(ev) {
		var data = ev.data;
		try {
			if (data + "" === data) {
				data = JSON.parse(data);
			}
			if (data.type == "fontSizeChange") {
				restoreFontSize();
			}
		} catch (error) {
		}
	});

	$(restoreFontSize);
})(this, this.jQuery);


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

        var content_h = children_h || body_h;

        var min_h = getMinHeight();

        return Math.max(min_h, content_h);
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
                height: curr_h
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

        var mo = new MutationObserver(function () {
			resizeHeight();
			mo && mo.takeRecords && mo.takeRecords();
		});

        mo.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true
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
    // 手风琴展开收起有动画 需在动画完成时再次计算
    if ($('.fui-accordions').length) {
        $('body').on('click', '.fui-acc-toggle', function () {
            var $div = $(this).closest('.fui-accordion').find('>.fui-acc-bd');
            // console.log('end', $div.queue(), $div.queue().length);
            var queue;
            if ((queue = $div.queue()) && queue.length) {
                // 若存在执行中的动画 直接跳到动画结束 再计算
                $div.stop('fx', false, true);
                window.requestAnimationFrame ? requestAnimationFrame(resizeHeight) : setTimeout(resizeHeight);
            }
        });
    }
})(this, this.jQuery);

// 电子表单被嵌入使用 弹出dialog可能由于滚动条原因不可见的问题
(function (win, $) {
    if (window.parent === window) return;

    // 在openDialog 时 发送 openDialog 的消息 关闭时 发送 closeDialog 消息
    var _openDialog = epoint.openDialog;
    epoint.openDialog = function openDialog() {
        win.parent.postMessage(JSON.stringify({ type: 'openDialog' }), '*');
        var d = _openDialog.apply(this, arguments);
        d.on('unload', function () {
            win.parent.postMessage(JSON.stringify({ type: 'closeDialog' }), '*');
        });
        return d;
    };

    // 父页面如果是滚动条出现的页面 则监听到之后 滚动到可见位置即可。
    // 如父页面仍是iframe嵌入的 则继续向上发消息即可。
    // 注：滚动条页面需完成两个功能：
    // 1、出现dialog时 锁定滚动条，取消时还原（因为继续允许滚动则可能滚成看不见的状态） `.mini-window-lock-scroll {overflow: hidden !important;}` 即可
    // 2、滚动到合适位置使得 dialog 可见。因dialog在显示的父页面中是垂直居中的，则滚动条页面合适的scrollTop为iframe的顶部距离 + iframe可视高度的一半
})(this, this.jQuery);

// tooltips 提示支持
(function () {
    var $tooltips = $('.control-tips.tips-tooltip');
    if (!$tooltips.length) {
        return;
    }
	// 控件宽度修正 控件宽度需扣除 提示问号宽度
	$tooltips.each(function(i, tip) {
		var $ctr = $(tip).prev();

		var w = $ctr[0].style.width;

		var w2 = '';
		if (/px$/.test(w)) {
			w2 = parseInt(w, 10) - 30;
		}
		if (!w2) {
			w2 = 'calc( ' + (w || '100%') + ' - ' + '30px )';
		}
		// console.log(w, w2);
		$ctr.css('width', w2);
	});

    // 初始化tooltips
    var tip = new mini.ToolTip();
    tip.set({
        target: document,
        trigger: 'hover',
        selector: '.control-tips.tips-tooltip',
        placement: 'bottom',
        autoHide: true,
    });
})();
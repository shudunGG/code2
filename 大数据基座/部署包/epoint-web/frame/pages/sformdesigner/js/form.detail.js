// detail页面通用js
(function(win) {

	var messenger = new epointsform.Messenger('epointsformPrintIframe',
			'epointsformMessenger');

	messenger.listen(function(msg) {
		if (!msg) {
			return;
		}
		try {
			msg = JSON.parse(msg);
		} catch (e) {

		}
		if (msg.handleType == "print") {
			if (msg.flag && msg.flag == '1') {
				// document.getElementById("toolPrint").click();
				doPrint('打印预览...')
				msg.success = "true";
				messenger.targets['parent'].send(JSON.stringify(msg));
			} else {
				msg.innerHtml = document.getElementById(msg.id).innerHTML;
				messenger.targets['parent'].send(JSON.stringify(msg));
			}
		} else if (msg.handleType == "convert") {
			document.body.style.height = 'auto';
			document.body.style.overflow = 'auto';
			document.body.style.minHeight = '100vh';
			document.body.style.background = '#fff';
			var content = document.getElementById('fui-content');
			var c_h = content.style.height;
			content.style.height = 'auto';

			// 获取渲染后的页面内容，去除按钮区域
			var toolBar = document.getElementById('butList');
			if (toolBar) {
				document.body.removeChild(toolBar);
			}
			// css引用href地址拼接头部
			var links = document.getElementsByTagName('link');
			var prefix = location.protocol + '//' + location.host;
			var flag = false;
			var num = "";
			for (var i = 0, len = links.length; i < len; ++i) {
				var href = links[i].getAttribute('href');
				// 不是http 或 // 开始 则拼接当前协议和域名
				if (!/^http|^\/\//.test(href)) {
					links[i].setAttribute('href', prefix + href);
				}
				if (links[i].getAttribute('href').indexOf('miniui.css') > -1) {
					flag = true;
					num = i;
				}
			}
			if (flag) {
				links[num].outerHTML = "";
			}

			// 去除Js引用<script>块
			convertHtml2PdfFun(document.documentElement.outerHTML.replace(
					/<script.*?>[\s\S]*?<\/script>/ig, ''), msg.convertPath,
					msg.savePath);

			// 完成后设回
			document.body.style.height = '100%';
			document.body.style.overflow = 'hidden';
			content.style.height = c_h;

			msg.formData = mini.get("pdfData").getValue();
			msg.success = "true";
			messenger.targets['parent'].send(JSON.stringify(msg));
		} else if (msg.handleType == "convertPic") {
			document.getElementById('picBtn').onclick();
		}
	});

	messenger.addTarget(window.parent, 'parent');
	var action = win.epointsformdetailactionname || 'formcommondetailaction';
	
    // 所有代码项联动控件
    var allCodeSyncCtrArr = mini.findControls(function (a) {
        if (a.type == 'combobox' && a.el.getAttribute('data-codelist') == 'true') return true;
    });

    function closeValueFromSelect() {
        // 加载数据前 先关闭  ValueFromSelect 属性 防止误数据源时 value 丢失
        $.each(allCodeSyncCtrArr, function (i, ctr) {
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
        
		// 控制按钮显隐（外部调用时隐藏）
		if (data && data.isShowBtn && data.isShowBtn == "false") {
			if ($("#butList")) {
				$("#butList").addClass('hidden');
			}
		}

		var msg = {};
		msg.handleType = "init";
		msg.iframeId = 'epointsformIframe';
        var data = getFormData();
        if (data) {
            msg.formData = data;
        } else {
            msg.formData = [];
        }
		messenger.targets['parent'].send(JSON.stringify(msg));

		if (Util.getUrlParams('print') == 'true') {
			exportPDFByCanvas(function() {
				window.close();
			});
		};

		// 针对人员控件弹窗模式在修改页面时无法展示对应的文本值
		var items = "";
		$('.mini-buttonedit').each(
				function(i, item) {
					items += item.id + "_gtigepoint_"
							+ mini.get(item.id).getValue() + ":";

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
	};

	/**
	 * html转Pdf
	 */
	window["convertHtml2PdfFun"] = function(convertHtml, convertPath, savePath) {
		// 将处理好的printdetail的html编码后存入页面hidden控件
		mini.get("convertHtml").setValue(epoint.encodeUtf8(convertHtml));
		if (savePath != null && savePath != "") {
			epoint.execute('convertHtml2PdfForPathSave', '', [ convertPath,
					savePath ], returnBack);
		} else {
			epoint.execute('convertHtml2PdfForCont', '', [ convertPath ],
					returnBack);
		}
	}

	window["returnBack"] = function(data) {
		if (data) {
			if (data.msg) {
				alert(data.msg);
			}
			if (data.pdfData) {
				mini.get("pdfData").setValue(data.pdfData);
			}
		}
	}

	var tables = Util.getUrlParams('tables') || '';
	if (tables) {
		var _tables = tables.split(',');
		var $first = $('#' + _tables[0]);
		var $siblings = $first.siblings();
		$siblings.each(function(index, item) {
			if (item.id != 'share' && _tables.indexOf(item.id) < 0) {
				$(item).addClass('hidden');
			}
		});

		$first.parent().children(':not(.hidden)').each(function(i, item) {
			var _index = i + 1, _num = _index < 9 ? '0' + _index : _index;

			// 此处因为不知道其他布局方式的格式，所以用 children().find()
			// 不能用class选择器，因为只有手风琴才是 acc
			$(item).children().find('span').text(_num);
		})
	}

	window["exportPDFByCanvas"] = function(cb) {
		// 处理滚动条问题，先让滚动条正常出现在body上
		// 等导出完成再修复回去
		document.body.style.height = 'auto';
		document.body.style.overflow = 'auto';
		document.body.style.minHeight = '100vh';
		document.body.style.background = '#fff';
		var content = document.getElementById('fui-content');
		console.log(content);
		var c_h = content.style.height;
		content.style.height = 'auto';

		html2canvas(document.body, {
			onrendered : function(canvas) {
				var contentWidth = canvas.width;
				var contentHeight = canvas.height;

				// 一页pdf显示html页面生成的canvas高度;
				var pageHeight = contentWidth / 592.28 * 841.89;
				// 未生成pdf的html页面高度
				var leftHeight = contentHeight;
				// 页面偏移
				var position = 0;
				// a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
				var imgWidth = 595.28;
				var imgHeight = 592.28 / contentWidth * contentHeight;

				var pageData = canvas.toDataURL('image/jpeg', 1.0);

				var pdf = new jsPDF('', 'pt', 'a4');

				// 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
				// 当内容未超过pdf一页显示的范围，无需分页
				if (leftHeight < pageHeight) {
					pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
				} else {
					while (leftHeight > 0) {
						pdf.addImage(pageData, 'JPEG', 0, position, imgWidth,
								imgHeight)
						leftHeight -= pageHeight;
						position -= 841.89;
						// 避免添加空白页
						if (leftHeight > 0) {
							pdf.addPage();
						}
					}
				}
				pdf.save('test2.pdf');
				// 完成后设回
				document.body.style.height = '100%';
				document.body.style.overflow = 'hidden';
				content.style.height = c_h;

				if (cb) {
					setTimeout(cb, 2000);
				}
			}
		});
	};

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
				Util.accordion.hideItem(i);
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
    };

})(this);

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
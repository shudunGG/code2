$(function() {
	var messenger = new epointsform.Messenger('epointsformPrintIframe',
			'epointsformMessenger');

	messenger.listen(function(msg) {
		if (!msg) {
			return;
		}
		msg = JSON.parse(msg);
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
		}else if(msg.handleType == "convert"){
			document.body.style.height ='auto';
			document.body.style.overflow ='auto';
			document.body.style.minHeight ='100vh';
			document.body.style.background ='#fff';
			var content = document.getElementById('fui-content');
            var c_h = content.style.height;
            content.style.height = 'auto';
			
			//获取渲染后的页面内容，去除按钮区域
			var toolBar = document.getElementById('butList');
			if(toolBar){
				document.body.removeChild(toolBar);
			}
			//css引用href地址拼接头部
			var links = document.getElementsByTagName('link');
			var prefix = location.protocol + '//' + location.host;
			for (var i = 0, len = links.length; i < len; ++i) {
			    var  href = links[i].getAttribute('href');
			    // 不是http  或 // 开始 则拼接当前协议和域名
			    if(!/^http|^\/\//.test(href)) {
			        links[i].setAttribute('href', prefix + href);
			    }
			}
			//去除Js引用<script>块
			convertHtml2PdfFun(document.documentElement.outerHTML.replace(/<script.*>.*<\/script>/ig,''), msg.convertPath, msg.savePath);
			
			// 完成后设回
			document.body.style.height ='100%';
			document.body.style.overflow ='hidden';
			content.style.height = c_h;
			
			msg.formData = mini.get("pdfData").getValue();
			msg.success = "true";
			messenger.targets['parent'].send(JSON.stringify(msg));
		}else if(msg.handleType == "convertPic"){
			document.getElementById('picBtn').onclick();
		}
	});

	messenger.addTarget(window.parent, 'parent');
	// 初始化页面
	if (!window.epointsformdetailactionname) {// 详情页面actionname，可个性化
		window.epointsformdetailactionname = "formcommondetailaction";
	}
	epoint.initPage(window.epointsformdetailactionname, 'fui-form',
			initCallBack);

	var tableId;

	function initCallBack(data) {
		// 查找页面所有子表id,存放在hidden控件（保存）
		var a = $(".mini-datagrid");
		var ids = "";
		for (var n = 0; a.length > 0 && n < a.length; n++) {
			ids += a.get(n).id;
			if (n != a.length - 1) {
				ids += ";";
			}
		}
		mini.get("gridIds").setValue(ids);
		try {
			if (window.detail && window.detail == "printdetail") {
				if (printdetailInit && typeof (printdetailInit) == "function") {
					printdetailInit();
				}
			} else {
				if (detailInit && typeof (detailInit) == "function") {
					detailInit();
				}
			}
		} catch (e) {
		}
		// 控制按钮显隐（外部调用时隐藏）
		if (data && data.isShowBtn && data.isShowBtn == "false") {
			if ($("#butList")) {
				$("#butList").addClass('hidden');
			}
		}
		
		if (data && data.rowGuid) {
			mini.get("rowGuid").setValue(data.rowGuid);
		}

		if (data.record) {
			var recordData = JSON.parse(data.record);
			for (prop in recordData) {
				var value = recordData[prop];
				var ctrls = document.getElementsByName(prop);
				if (value && ctrls && ctrls.length > 0) {
					if (value.indexOf(',') > -1) {
						var items = value.split(',');
						for (var i = 0; items.length > 0 && i < items.length; i++) {
							for (var j = 0; j < ctrls.length; j++) {
								if (ctrls[j].value == items[i]) {
									ctrls[j].checked = true;
									ctrls[j].setAttribute('checked', true);
									break;
								}
							}
						}
					} else {
						for (var i = 0; i < ctrls.length; i++) {
							if (ctrls[i].value == value) {
								ctrls[i].checked = true;
								ctrls[i].setAttribute('checked', true);
								break;
							}
						}
					}
				}
			}
		}

		// 发起 流程后的页面带不出控件值问题，暂时js处理
		// if (!data) {
		// return;
		// }
		var msg = {};
		msg.handleType = "init";
		// msg.height = $('body').height();
		msg.iframeId = 'epointsformIframe';
		messenger.targets['parent'].send(JSON.stringify(msg));
		
		if(Util.getUrlParams('print') == 'true') {
			exportPDFByCanvas(function() {
				window.close();
			});
		}
	}

	window["searchData"] = function(data) {
		if (data && data.gridId) {
			epoint.refresh(data.gridId);
		}
	}
	
	window["downLoad"] = function(id){
		epoint.execute('getAttachGuid', '', [id], openUrl);
	}
	
	window["openUrl"] = function(data){
		var attachGuid = data.attachGuid;
		var data;
		if(attachGuid.indexOf(";")>-1){
			data = attachGuid.split(';');
			for(var i=0; data.length>0 && i<data.length; i++){
		    	 window.open("../../../../../../frame/pages/basic/attach/attachdown?attachGuid=" + data[i]);
			}
		}else{
			window.open("../../../../../../frame/pages/basic/attach/attachdown?attachGuid=" + attachGuid);
		}
    }
	
	/**
	 * html转Pdf
	 */
	window["convertHtml2PdfFun"] = function(convertHtml, convertPath, savePath) {
		//将处理好的printdetail的html编码后存入页面hidden控件
		mini.get("convertHtml").setValue(epoint.encodeUtf8(convertHtml));
		if(savePath != null && savePath !=""){
			epoint.execute('convertHtml2PdfForPathSave', '',[convertPath, savePath], returnBack);
		}else{
			epoint.execute('convertHtml2PdfForCont', '',[convertPath], returnBack);
		}
	}
	
	window["returnBack"] = function(data) {
		if(data){
			if(data.msg){
				alert(data.msg);
			}
			if(data.pdfData){
				mini.get("pdfData").setValue(data.pdfData);
			}
		}
	}
	
	window["openAndExport"] = function() {
		var param = location.href.indexOf('?') != -1 ? '&print=true'
				: '?print=true';
		window.open(location.href + param);
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

				//一页pdf显示html页面生成的canvas高度;
				var pageHeight = contentWidth / 592.28 * 841.89;
				//未生成pdf的html页面高度
				var leftHeight = contentHeight;
				//页面偏移
				var position = 0;
				//a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
				var imgWidth = 595.28;
				var imgHeight = 592.28 / contentWidth * contentHeight;

				var pageData = canvas.toDataURL('image/jpeg', 1.0);

				var pdf = new jsPDF('', 'pt', 'a4');

				//有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
				//当内容未超过pdf一页显示的范围，无需分页
				if (leftHeight < pageHeight) {
					pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth,
							imgHeight);
				} else {
					while (leftHeight > 0) {
						pdf.addImage(pageData, 'JPEG', 0, position,
								imgWidth, imgHeight)
						leftHeight -= pageHeight;
						position -= 841.89;
						//避免添加空白页
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
	}
})
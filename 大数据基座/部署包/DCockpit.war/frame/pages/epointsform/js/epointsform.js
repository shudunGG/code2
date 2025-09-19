/**
 * epointsform
 * 
 * @description 新点在线表单设计器JS
 * @author jlx
 * @version 1.0
 */
if (!window.epointsform) {
	window.epointsform = {};
}

var epointsform = {
	_rootPath : (function() {
		var path = location.pathname;
		if (path.indexOf('/') === 0) {
			path = path.substring(1);
		}
		return '/' + path.split('/')[0];
	}()),

	Messenger : (function() {

		// 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
		// !注意 消息前缀应使用字符串类型
		var prefix = "[PROJECT_NAME]", supportPostMessage = 'postMessage' in window;

		// Target 类, 消息对象
		function Target(target, name) {
			var errMsg = '';
			if (arguments.length < 2) {
				errMsg = 'target error - target and name are both required';
			} else if (typeof target != 'object') {
				errMsg = 'target error - target itself must be window object';
			} else if (typeof name != 'string') {
				errMsg = 'target error - target name must be string type';
			}
			if (errMsg) {
				throw new Error(errMsg);
			}
			this.target = target;
			this.name = name;
		}

		// 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
		if (supportPostMessage) {
			// IE8+ 以及现代浏览器支持
			Target.prototype.send = function(msg) {
				this.target.postMessage(prefix + msg, '*');
			};
		} else {
			// 兼容IE 6/7
			Target.prototype.send = function(msg) {
				var targetFunc = window.navigator[prefix + this.name];
				if (typeof targetFunc == 'function') {
					targetFunc(prefix + msg, window);
				} else {
					throw new Error("target callback function is not defined");
				}
			};
		}

		// 信使类
		// 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
		// !注意: 父子页面中projectName必须保持一致, 否则无法匹配
		function Messenger(messengerName, projectName) {
			this.targets = {};
			this.name = messengerName;
			this.listenFunc = [];
			prefix = projectName || prefix;
			if (typeof prefix !== 'string') {
				prefix = prefix.toString();
			}
			this.initListen();
		}

		// 添加一个消息对象
		Messenger.prototype.addTarget = function(target, name) {
			var targetObj = new Target(target, name);
			this.targets[name] = targetObj;
		};

		// 初始化消息监听
		Messenger.prototype.initListen = function() {
			var self = this;
			var generalCallback = function(msg) {
				if (typeof msg == 'object' && msg.data) {
					msg = msg.data;
				}
				// 剥离消息前缀
				msg = msg.slice(prefix.length);
				for (var i = 0; i < self.listenFunc.length; i++) {
					self.listenFunc[i](msg);
				}
			};

			if (supportPostMessage) {
				if ('addEventListener' in document) {
					window.addEventListener('message', generalCallback, false);
				} else if ('attachEvent' in document) {
					window.attachEvent('onmessage', generalCallback);
				}
			} else {
				// 兼容IE 6/7
				window.navigator[prefix + this.name] = generalCallback;
			}
		};

		// 监听消息
		Messenger.prototype.listen = function(callback) {
			this.listenFunc.push(callback);
		};
		// 注销监听
		Messenger.prototype.clear = function() {
			this.listenFunc = [];
		};
		// 广播消息
		Messenger.prototype.send = function(msg) {
			var targets = this.targets, target;
			for (target in targets) {
				if (targets.hasOwnProperty(target)) {
					targets[target].send(msg);
				}
			}
		};

		return Messenger;
	})(),

	/**
	 * 初始化页面，嵌入表单页面
	 * 
	 * @param tableId
	 *            表单tableId
	 * @param divId
	 *            嵌入表单页面的父区域id
	 * @param formType
	 *            表单查看类型 add：新增/修改页面；detail：查看页面
	 * @param param
	 *            json格式，拼接Url使用参数(epointUrl如果为空默认当前系统地址)
	 *            {epointUrl:'http://ip:port/applicationName',rowGuid:'',isShowButton:false}
	 * @param successCallBack
	 *            初始化成功回调事件
	 * @param failedCallBack
	 *            初始化失败回调事件
	 */
	init : function(tableId, divId, formType, param, successCallBack,
			failedCallBack) {
		if (!param) {
			param = {};
		} else if (typeof param == "string") {
			param = JSON.parse(param);
		}

		if (param.epointUrl) {
			window.epointsform.epointUrl = param.epointUrl;
		} else {
			window.epointsform.epointUrl = param["epointUrl"];
		}

		if (typeof param.isMobile == "boolean") {
			window.epointsform.mobilePrefix = (param.isMobile) ? "mobile" : "";
		} else {
			window.epointsform.mobilePrefix = (param["isMobile"]) ? "mobile" : "";
		}
		
		if(param.printPageType){
			window.epointsform.printPageType = param.printPageType;
		}else{
			window.epointsform.printPageType = param["printPageType"];
		}

		window.epointsform.initSuccessCallBack = successCallBack;
		window.epointsform.initFailedCallBack = failedCallBack;

		try {
			// 获取表单展示url,并拼接参数
			document.getElementById(divId).innerHTML = '<iframe id="epointsformIframe" frameborder="0" allowTransparency="true" style="background-color:transparent" scrolling="no" width="100%" height="100%"></iframe><iframe id="epointsformPrintIframe" frameborder="0" width="100%" style="position:absolute;top:-20000px;left:-20000px;" ></iframe>';

			// 获取表单地址的iframe
			document.getElementById("epointsformPrintIframe").src = epointsform
					.getRightUrl(
							"frame/pages/epointsform/formversionsearch?tableId="
									+ tableId + "&formType=" + formType
									+ "&mobilePrefix="
									+ window.epointsform.mobilePrefix
									+ "&versionId=" + param.versionId
									+ "&printPageType="+param.printPageType,
							window.epointsform.epointUrl);
			var customUrl = "frame/pages/epointsform/genpages/";

			// 跨域处理
			window.epointsform.messengerObject = new epointsform.Messenger(
					'parent', 'epointsformMessenger');

			// 跨域处理
			window.epointsform.messengerObject.addTarget(document
					.getElementById("epointsformPrintIframe").contentWindow,
					'epointsformGetFormUrlIframe');

			// 跨域监听
			window.epointsform.messengerObject
					.listen(function(msg) {
						if (!msg) {
							return;
						}
						msg = JSON.parse(msg);
						if (msg.handleType == "getFormUrl") {
							if (msg.formUrl.error
									&& window.epointsform.initFailedCallBack) {
								window.epointsform.initFailedCallBack.call(
										this, msg.formUrl.error);
								return;
							}

							if (!msg.formUrl.versionId) {
								window.epointsform.initFailedCallBack.call(
										this, "传入的表单ID不存在激活版本！tableId："
												+ tableId);
								return;
							}
							var versionId = msg.formUrl.versionId;
							var addUrl = msg.formUrl.addUrl;
							var detailUrl = msg.formUrl.detailUrl;
							if(msg.formUrl.customUrl != null && msg.formUrl.customUrl != ""){
								customUrl = msg.formUrl.customUrl;
							}

							// 拼接打印Url
							if (!detailUrl) {
								//如果打印页面类型是“1”，代表调detail页面打印（单选复选框按钮组文本显示）；如果为空调printdetail页面的打印（单选复选控件形式显示打印）
								if(window.epointsform.printPageType == "1"){
									detailUrl = customUrl
										+ tableId + "/" + versionId + "/"
										+ window.epointsform.mobilePrefix
										+ "detail?tableId=" + tableId
										+ "&versionInfo=" + versionId;
								}else{
									detailUrl = customUrl
										+ tableId + "/" + versionId + "/"
										+ "printdetail?tableId=" + tableId
										+ "&versionInfo=" + versionId;
								}
							}

							// 根据类型拼接Url
							if (!addUrl && ((formType == 'add') || (formType == 'detail'))) {
								addUrl = customUrl
										+ tableId + "/" + versionId + "/"
										+ window.epointsform.mobilePrefix
										+ formType +"?tableId=" + tableId
										+ "&versionInfo=" + versionId;
							}else if (!addUrl && formType == 'printdetail') {
								addUrl = customUrl
									+ tableId + "/" + versionId + "/"
									+ "printdetail?tableId=" + tableId
									+ "&versionInfo=" + versionId;
						    }

							// 拼接打印Url
							detailUrl = epointsform.getRightUrl(detailUrl,
									window.epointsform.epointUrl);
							// 拼接Url
							addUrl = epointsform.getRightUrl(addUrl,
									window.epointsform.epointUrl);

							// 拼接需要带入Url的参数
							for ( var prop in param) {
								if (prop != 'epointUrl') {
									if (param.prop) {
										addUrl += "&"
												+ prop
												+ "="
												+ epointsform
														.encodeUtf8(param.prop);
										detailUrl += "&"
												+ prop
												+ "="
												+ epointsform
														.encodeUtf8(param.prop);
									} else {
										addUrl += "&"
												+ prop
												+ "="
												+ epointsform
														.encodeUtf8(param[prop]);
										detailUrl += "&"
												+ prop
												+ "="
												+ epointsform
														.encodeUtf8(param[prop]);
									}
								}
							}

							// 设置iframe表单地址
							document.getElementById("epointsformIframe").src = addUrl;

							// 跨域处理
							window.epointsform.messengerObject
									.addTarget(
											document
													.getElementById("epointsformIframe").contentWindow,
											'epointsformIframe');

							if (!window.epointsform.mobilePrefix) {
								document
										.getElementById("epointsformPrintIframe").src = detailUrl;

								window.epointsform.messengerObject
										.addTarget(
												document
														.getElementById("epointsformPrintIframe").contentWindow,
												'epointsformPrintIframe');
							}

						} else if (msg.handleType == "save") { // 保存表单回调事件
							if (msg.error
									&& window.epointsform.saveFailedCallBack) {
								window.epointsform.saveFailedCallBack.call(
										this, msg.error);
							} else if (msg.rowGuid) {
								document.getElementById("epointsformIframe").src = epointsform
										.getNewFormUrl(
												document
														.getElementById("epointsformIframe").src,
												msg.rowGuid);
								window.epointsform.messengerObject
										.addTarget(
												document
														.getElementById("epointsformIframe").contentWindow,
												'epointsformIframe');
								document
										.getElementById("epointsformPrintIframe").src = epointsform
										.getNewFormUrl(
												document
														.getElementById("epointsformPrintIframe").src,
												msg.rowGuid);
								window.epointsform.messengerObject
										.addTarget(
												document
														.getElementById("epointsformPrintIframe").contentWindow,
												'epointsformPrintIframe');
								if (window.epointsform.saveSuccessCallBack) {
									window.epointsform.saveSuccessCallBack
											.call(this, msg.rowGuid);
								}
							}
						} else if (msg.handleType == "init") { // 初始化页面回调事件
							if (window.epointsform.isfirst) {
								return;
							}
							if(msg.height && msg.iframeId) {
								$('#fui-content').find('#'+msg.iframeId).css('height',msg.height);
							}
							if (msg.error
									&& window.epointsform.initFailedCallBack) {
								window.epointsform.initFailedCallBack.call(
										this, msg.error);
							} else if (msg.formData) {
								window.epointsform.isfirst = true;
								if (window.epointsform.initSuccessCallBack) {
									window.epointsform.initSuccessCallBack
											.call(this, msg.formData);
								}
							}
						} else if (msg.handleType == "getFormData") { // 获取表单数据回调事件
							if (msg.error
									&& window.epointsform.getFormDataFailedCallBack) {
								window.epointsform.getFormDataFailedCallBack
										.call(this, msg.error);
							} else if (msg.formData
									&& window.epointsform.getFormDataSuccessCallBack) {
								window.epointsform.getFormDataSuccessCallBack
										.call(this, msg.formData);
							}
						} else if (msg.handleType == "validate") { // 验证表单合法性回调事件
							if (msg.error
									&& window.epointsform.validateFailedCallBack) {
								window.epointsform.validateFailedCallBack.call(
										this, msg.error);
							} else if (window.epointsform.validateSuccessCallBack) {
								window.epointsform.validateSuccessCallBack
										.call(this, msg.validateTag);
							}
						} else if (msg.handleType == "initFormData") { // 反向初始化表单数据回调事件
							if (msg.error
									&& window.epointsform.initFormDataFailedCallBack) {
								window.epointsform.initFormDataFailedCallBack
										.call(this, msg.error);
							} else if (msg.formData
									&& window.epointsform.initFormDataSuccessCallBack) {
								window.epointsform.initFormDataSuccessCallBack
										.call(this, true);
							}
						} else if (msg.handleType == "print") { // 打印表单时获取detail页面元素回调事件
							if (msg.error
									&& window.epointsform.printFailedCallBack) {
								window.epointsform.printFailedCallBack.call(
										this, msg.error);
							} else if (msg.innerHtml) {
								var oldstr = document.body.innerHTML;
								var sformcssboot = epointsform
										.getRightUrl(
												"frame/pages/epointsform/js/sformcssboot.js",
												window.epointsform.epointUrl);
								var formrecord = epointsform
										.getRightUrl(
												"frame/pages/epointsform/css/formrecord.css",
												window.epointsform.epointUrl);
								var jsboot = epointsform
				                        .getRightUrl(
						                        "frame/fui/js/jsboot.js",
						                        window.epointsform.epointUrl);
								document.body.innerHTML = "<title>代码模板</title><meta charset=\"UTF-8\" /><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />"
										+ "<script src="
										+ sformcssboot
										+ "></script>"
										+ "<link rel=\"stylesheet\" href="
										+ formrecord
										+ "></link>" 
										+ "<style type=\"text/css\">.mini-outputtext{display:inline} .MsoNormalTable{word-wrap:break-word;word-break:break-all;}</style>"
										+ "<body>"
										+ msg.innerHtml 
										+ "</body>" 
										+ "<script src="
										+ jsboot
										+ "></script>"
										+ "</html>";
								window.print();
								document.body.innerHTML = oldstr;
								window.epointsform.messengerObject
										.addTarget(
												document
														.getElementById("epointsformIframe").contentWindow,
												'epointsformIframe');
								window.epointsform.messengerObject
										.addTarget(
												document
														.getElementById("epointsformPrintIframe").contentWindow,
												'epointsformPrintIframe');
								if (window.epointsform.printSuccessCallBack) {
									window.epointsform.printSuccessCallBack
											.call(this, true);
								}
							}else if(msg.success=="true"){
								//工具打印
								if (window.epointsform.printSuccessCallBack) {
									window.epointsform.printSuccessCallBack
											.call(this, true);
								}
							}
						}else if (msg.handleType == "convert") { // 表单html转pdf
							if (msg.error
									&& window.epointsform.convertFailedCallBack) {
								window.epointsform.convertFailedCallBack
										.call(this, msg.error);
							} else if (msg.formData
									&& window.epointsform.convertSuccessCallBack) {
								window.epointsform.convertSuccessCallBack
										.call(this, true);
							}
						}
						else if (msg.handleType == "convertPic") { // 表单html转图片再转pdf
							if (msg.error
									&& window.epointsform.convertFailedCallBack) {
								window.epointsform.convertFailedCallBack
										.call(this, msg.error);
							}
						}
					});

		} catch (e) {
			if (window.epointsform.initFailedCallBack) {
				window.epointsform.initFailedCallBack.call(this, e.toString());
			}
		}
	},

	/**
	 * 新增/修改保存表单
	 * 
	 * @param successCallBack
	 *            成功回调事件
	 * @param failedCallBack
	 *            失败回调事件
	 */

	save : function(successCallBack, failedCallBack) {
		window.epointsform.saveSuccessCallBack = successCallBack;
		window.epointsform.saveFailedCallBack = failedCallBack;
		var msg = {};
		msg.handleType = "save";
		window.epointsform.messengerObject.targets['epointsformIframe']
				.send(JSON.stringify(msg));
	},

	/**
	 * 获取表单数据
	 * 
	 * @param successCallBack
	 *            成功获取表单数据回调事件
	 * @param failedCallBack
	 *            失败获取表单数据回调事件
	 */

	getFormData : function(successCallBack, failedCallBack) {
		window.epointsform.getFormDataSuccessCallBack = successCallBack;
		window.epointsform.getFormDataFailedCallBack = failedCallBack;
		var msg = {};
		msg.handleType = "getFormData";
		window.epointsform.messengerObject.targets['epointsformIframe']
				.send(JSON.stringify(msg));
	},

	/**
	 * 初始化表单数据
	 * 
	 * @param formData
	 *            初始化数据
	 * @param successCallBack
	 *            成功初始化表单数据回调事件
	 * @param failedCallBack
	 *            失败初始化表单数据回调事件
	 */

	initFormData : function(formData, successCallBack, failedCallBack) {
		window.epointsform.initFormDataSuccessCallBack = successCallBack;
		window.epointsform.initFormDataFailedCallBack = failedCallBack;
		var msg = {};
		msg.handleType = "initFormData";
		if (typeof formData == "string") {
			formData = JSON.parse(formData);
		}
		msg.formData = formData;
		window.epointsform.messengerObject.targets['epointsformIframe']
				.send(JSON.stringify(msg));
	},

	/**
	 * 验证表单
	 * 
	 * @param successCallBack
	 *            成功验证表单回调事件
	 * @param failedCallBack
	 *            失败验证表单回调事件
	 */
	validate : function(successCallBack, failedCallBack) {
		window.epointsform.validateSuccessCallBack = successCallBack;
		window.epointsform.validateFailedCallBack = failedCallBack;
		var msg = {};
		msg.handleType = "validate";
		window.epointsform.messengerObject.targets['epointsformIframe']
				.send(JSON.stringify(msg));
	},

	/**
	 * 打印表单
	 * 
	 * @param id
	 *            打印表单id，允许为空就全部区域打印
	 * @param successCallBack
	 *            打印表单成功回调事件
	 * @param failedCallBack
	 *            打印表单失败回调事件
	 * @param failedCallBack
	 *            是否是工具打印标记  1是工具打印
	 */
	print : function(id, successCallBack, failedCallBack, flag) {
		if (!id) {
			id = "form";
		}
		window.epointsform.printFailedCallBack = failedCallBack;
		window.epointsform.printSuccessCallBack = successCallBack;
		var msg = {};
		msg.handleType = "print";
		msg.id = id;
		msg.flag = flag;
		window.epointsform.messengerObject.targets['epointsformPrintIframe']
				.send(JSON.stringify(msg));
	},
	
	/**
	 * 表单html转Pdf
	 * @param convertUrl 配置访问.net转换服务地址
	 * @param savePath 转换后pdf存放路径
	 * @param convertSuccessCallBack  表单转Pdf成功回调事件
	 * @param convertFailedCallBack     表单转Pdf失败回调事件
	 */
	convertHtml2Pdf : function(convertPath, savePath, convertSuccessCallBack, convertFailedCallBack) {
		window.epointsform.convertFailedCallBack = convertFailedCallBack;
		window.epointsform.convertSuccessCallBack = convertSuccessCallBack;
		var msg = {};
		msg.handleType = "convert";
		msg.convertPath = convertPath;
		msg.savePath = savePath;
		window.epointsform.messengerObject.targets['epointsformPrintIframe']
				.send(JSON.stringify(msg));
	},
	
	/**
	 * 表单html转图片再转Pdf
	 * @param convertSuccessCallBack  表单转Pdf成功回调事件
	 * @param convertFailedCallBack     表单转Pdf失败回调事件
	 */
	convertHtml2Pic2Pdf : function(convertSuccessCallBack, convertFailedCallBack) {
		window.epointsform.convertFailedCallBack = convertFailedCallBack;
		window.epointsform.convertSuccessCallBack = convertSuccessCallBack;
		var msg = {};
		msg.handleType = "convertPic";
		window.epointsform.messengerObject.targets['epointsformPrintIframe']
				.send(JSON.stringify(msg));
	},

	// 返回带上rowGuid的表单地址
	getNewFormUrl : function(oldurl, rowGuid) {
		var url = "";
		var itemlist = oldurl.split('&');
		for ( var index in itemlist) {
			if (typeof itemlist[index] == "string"
					&& itemlist[index].indexOf("rowGuid") == 0) {
				url += "&rowGuid=" + rowGuid;
			} else if (typeof itemlist[index] == "string" && index != 0) {
				url += "&" + itemlist[index];
			} else if (typeof itemlist[index] == "string" && index == 0) {
				url += itemlist[index];
			}
		}
		return url;
	},

	// 返回完整的WebContent根路径
	getRootPath : function() {
		var loc = window.location, host = loc.hostname, protocol = loc.protocol, port = loc.port
				? (':' + loc.port)
				: '', path = (epointsform._rootPath != undefined
				? epointsform._rootPath
				: ('/' + loc.pathname.split('/')[1]))
				+ '/';

		var rootPath = protocol + '//' + host + port + path;

		return rootPath;
	},

	// 返回适合的url
	// 1.url为全路径，则返回自身
	// 2.url为，则返回自身
	// 3.url为WebContent开始的路径，则补全为完整的路径
	getRightUrl : function(url, epointUrl) {
		if (!url)
			return '';

		// 是否是相对路径
		var isRelative = url.indexOf('./') != -1 || url.indexOf('../') != -1;

		// 全路径、相对路径直接返回
		if (/^(http|https|ftp)/g.test(url) || isRelative) {
			url = url;
		} else if (epointUrl
				&& epointUrl.substr(epointUrl.length - 1, 1) == '/') {
			url = epointUrl + url;
		} else if (epointUrl
				&& epointUrl.substr(epointUrl.length - 1, 1) != '/') {
			url = epointUrl + '/' + url;
		} else {
			url = epointsform.getRootPath() + url;
		}
		return url;
	},

	/**
	 * 获取请求映射前缀
	 * 
	 * @return /frame/sysconf/code/codemainlist
	 */
	getRequestMapping : function() {
		var url = window.location.protocol + '//' + window.location.host
				+ window.location.pathname;
		var root = epointsform.getRootPath();
		return url.substring(root.length, url.lastIndexOf('/'));
	},

	/**
	 * utf-8编码函数
	 * 
	 * @param s1
	 *            要编码的数据
	 */
	encodeUtf8 : function(s1) {
		var s = escape(s1);
		var sa = s.split("%");
		var retV = "";
		if (sa[0] !== "") {
			retV = sa[0];
		}
		for (var i = 1; i < sa.length; i++) {
			if (sa[i].substring(0, 1) == "u") {
				retV += epointsform.Hex2Utf8(epointsform.Str2Hex(sa[i]
						.substring(1, 5)));
				if (sa[i].length > 5) {
					retV += sa[i].substring(5);
				}

			} else
				retV += "%" + sa[i];
		}

		return retV;
	},

	Hex2Utf8 : function(s) {
		var retS = "";
		var tempS = "";
		var ss = "";
		if (s.length == 16) {
			tempS = "1110" + s.substring(0, 4);
			tempS += "10" + s.substring(4, 10);
			tempS += "10" + s.substring(10, 16);
			var sss = "0123456789ABCDEF";
			for (var i = 0; i < 3; i++) {
				retS += "%";
				ss = tempS.substring(i * 8, (eval(i) + 1) * 8);

				retS += sss.charAt(epointsform.Dig2Dec(ss.substring(0, 4)));
				retS += sss.charAt(epointsform.Dig2Dec(ss.substring(4, 8)));
			}
			return retS;
		}
		return "";
	},

	Str2Hex : function(s) {
		var c = "";
		var n;
		var ss = "0123456789ABCDEF";
		var digS = "";
		for (var i = 0; i < s.length; i++) {
			c = s.charAt(i);
			n = ss.indexOf(c);
			digS += epointsform.Dec2Dig(eval(n));
		}
		// return value;
		return digS;
	},

	Dec2Dig : function(n1) {
		var s = "";
		var n2 = 0;
		for (var i = 0; i < 4; i++) {
			n2 = Math.pow(2, 3 - i);
			if (n1 >= n2) {
				s += '1';
				n1 = n1 - n2;
			} else
				s += '0';

		}
		return s;
	},

	Dig2Dec : function(s) {
		var retV = 0;
		if (s.length == 4) {
			for (var i = 0; i < 4; i++) {
				retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
			}
			return retV;
		}
		return -1;
	},

	// get query parameters of url
	getUrlParams : function(prop) {
		var params = {}, query = window.location.search.substring(1), arr = query
				.split('&'), rt;

		for ( var item in arr) {
			if(typeof arr[item] != "string" ){
				continue;
			}
			var tmp = arr[item].split('='), key = tmp[0], val = tmp[1];

			if (typeof params[key] == 'undefined') {
				params[key] = val;
			} else if (typeof params[key] == 'string') {
				params[key] = [params[key], val];
			} else {
				params[key].push(val);
			}
		}

		rt = prop ? params[prop] : params;

		return rt;
	}
}

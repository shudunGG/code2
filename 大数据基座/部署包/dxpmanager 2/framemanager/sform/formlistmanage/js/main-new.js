// 编辑器初始化
(function(win, $) {

	var ueditor;

	win.Formdesign = {
		/**
		 * 初始化编辑器
		 * 
		 * @param {*Object}
		 *            cfg 初始化的配置参数
		 */
		init : function(cfg) {
			this.ueditor = ueditor = UE.getEditor('ueditor-container', cfg);
			this.adjustHeight();
			this.InitToolBar();
		},

		// 设置编辑器高度
		adjustHeight : function() {
			if (!this.ueditor)
				throw new Error('编辑器还没有初始化');

			var me = this;
			this.ueditor.ready(function() {
				var $container = $(me.ueditor.container);
				var toolbarHeight = $container.find('.edui-editor-toolbarbox')
						.height();
				var bottomHeight = $container.find(
						'.edui-editor-bottomContainer').height();
				var aimHeight = $('#flow-editor-wrapper').height()
						- toolbarHeight - bottomHeight - 2;
				me.ueditor.setHeight(aimHeight);
			});
		},

		// 保存、保存为新版本、关闭
		InitToolBar : function() {
			var $toolbar = $('#top-toolbar');

			var editor = this.ueditor;

			win.saveVersion = function(newVersionID) {
				mini.get("content").setValue(editor.getContent());
				if (newVersionID) { // 新增模式
					mini.get("versionId").setValue(newVersionID);
				}
				saveBtn.click();
			};
			win.saveNewVersion = function(newVersionID) {
				mini.get("content").setValue(editor.getContent());
				if (newVersionID) { // 新增模式
					mini.get("versionId").setValue(newVersionID);
				}
				saveNewBtn.click();
			};
			win.previewPage = function(newVersionID) {
				mini.get("content").setValue(editor.getContent());
				if (newVersionID) { // 新增模式
					mini.get("versionId").setValue(newVersionID);
				}
				previewBtn.click();
			};
		},
		// 扩展控件的统一配置
		_exControlDefaultSettings : {
			// 扩展控件的页面地址
			baseUrl : 'extendcontrol.html',
			// 地址后拼接的参数名称
			exParamName : 'controlType',
			// Dialog中页面的大小
			size : 'width:400px;height:500px;'
		},
		/**
		 * 添加扩展命令 内部调用了 表单编辑扩展 中开放的__createDialog 方法
		 * 
		 * @param {*Object}
		 *            exControlData 扩展控件的相关数据对象 数据示例： exControlData { // 命令名称
		 *            cmd: 'ex_test1', // 控件名称 也是弹出Dialog的标题 name: '扩展控件1', //
		 *            dialog 页面地址后的参数值 由于扩展统一使用一个页面 不同的需要以参数区分 controlType:
		 *            'exControl_1', // 打开Dialog的大小，字符串形式 如
		 *            "width:800px;height:400px;" 可省略 dialogSize:
		 *            'width:800px;height:400px;' }
		 */
		addExControlCmd : function(cClass, exCtrlName, name) {
			if (!this.ueditor)
				throw new Error('编辑器还没有初始化');

			var me = this;
			this.ueditor.registerCommand(exCtrlName, {
				execCommand : function() {
					var dialog = __createDialog.call(this,
					// 此控件控件将打开的页面地址 扩展控件页面地址 + ?controlType = xxx
					getBaseUrl(cClass) + '.html?name=' + exCtrlName,
					// dialog 类型 实际并无意义
					// 但由于需要记住此cmd的名称
					// 点击编辑要再次执行命令显示Dialog，需要添加到控件上，此处借用来传递cmd
					exCtrlName,
					// 打开的Dialog的title
					name,
					// dialog 尺寸
					me._exControlDefaultSettings.size);

					dialog.open();
				}
			});
		},
		/**
		 * 设置编辑器内容 异步操作 需要在编辑器初始化后会执行 等同 this.setData 和
		 * .ueditor.setContent(value);
		 * 
		 * @param {*String}
		 *            Value HTML文本
		 */
		setValue : function(value) {
			if (!this.ueditor)
				throw new Error('编辑器还没有初始化');

			var me = this;
			this.ueditor.ready(function() {
				me.ueditor.setContent(value || '');
			});
		},
		/**
		 * 获取编辑器中的内容 等同 this.getData 和 this.ueditor.getContent()
		 * 
		 * @return {*String} 编辑器中内容文本
		 */
		getValue : function() {
			if (!this.ueditor)
				throw new Error('编辑器还没有初始化');

			return this.ueditor.getContent();
		},
		/**
		 * 获取编辑器中的内容 等同 this.getValue 和 this.ueditor.getContent()
		 * 
		 * @return {*String} 编辑器中内容文本
		 */
		getData : function() {
			return this.getValue();
		},
		/**
		 * 设置编辑器内容 异步操作 需要在编辑器初始化后会执行 等同 this.setValue 和
		 * .ueditor.setContent(value);
		 * 
		 * @param {*String}
		 *            data HTML文本
		 */
		setData : function(data) {
			return this.setValue(data);
		},
		/**
		 * 在当前光标位置插入一段HTML 等同 this.ueditor.execCommand('inserthtml', html);
		 * 
		 * @param {*String}
		 *            html HTML文本
		 */
		insertHtml : function(html) {
			return this.ueditor.execCommand('inserthtml', html);
		},
		/**
		 * 获取编辑器对象
		 * 
		 * @return {*Object} 编辑器对象
		 */
		getEditor : function() {
			return this.ueditor;
		},
		/**
		 * 获取编辑器的 document对象
		 * 
		 * @return {*document} 编辑器的 document 对象
		 */
		getEditorDocument : function() {
			return this.ueditor.document;
		},
		/**
		 * 内部编辑器执行一个命令 等同 this.ueditor.execCommand(cmd);
		 * 
		 * @param {*String}
		 *            cmd 命令名称
		 */
		execCommand : function(cmd) {
			return this.ueditor.execCommand(cmd);
		}
	};

	function getBaseUrl(cClass) {
		if (cClass == 'textbox' || cClass == 'textarea'
				|| cClass == 'datetextbox' || cClass == 'dropdowntextbox'
				|| cClass == 'radiobuttonlist' || cClass == 'checkboxlist'
				|| cClass == 'fileupload' || cClass == 'macro'
				|| cClass == 'datagrid' || cClass == 'calculatecontrol'
				|| cClass == 'datagridnew') {
			if (cClass == 'textbox') {
				return 'text';
			}
			if (cClass == 'radiobuttonlist') {
				return 'radios';
			}
			if (cClass == 'checkboxlist') {
				return 'checkboxs';
			}
			if (cClass == 'macro') {
				return 'macros';
			}
			return cClass;
		}
		return 'extendcontrol';
	}

	// resize时重置编辑器高度
	var timer;
	$(win).on('resize', function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			Formdesign.adjustHeight();
		}, 100);
	});
})(this, jQuery);
/**
 * 作者: 郭天琦
 * 创建时间: 2017/07/14
 * 版本: [1.0, 2017/07/14 ]
 * 版权: 江苏国泰新点软件有限公司
 * 描述: form表单验证
 */

(function(doc, Util, stringTools) {
	"use strict";

	/*
	 * 兼容统一用法，兼容Util.string.idcard
	 */
	var compatible = {
		idcard: stringTools.idcard.validate
	};

	/*
	 * 默认参数
	 */
	var defaultSetting = {
		tag: 'input',
		result: function() {}
	};

	/**
	 * 表单验证
	 * @constructor
	 * @param {Object} options
	 * container {HTMLElement} 容器id
	 * tag {String} 标签名 
	 * result {Function} 结果函数
	 */
	function FormValidate(options) {
		var self = this;

		if(!options.container) {
			throw new Error('请传入容器id');
		}

		self = Util.extend(self, defaultSetting, options);

		self.container = Util.selector(self.container);
		// 得到需要验证的元素
		self.serializeArray = self._serialize(self.tag);
		// 得到需要必填项
		self.mateArray = self._serialize(null, '[data-mate]');

		// 解析规则
		self._resolveRule(self.serializeArray);
	}

	/**
	 * 原型
	 */
	FormValidate.prototype = {

		/**
		 * 获取需要验证表单
		 * @param {String} tag 类型
		 * @param {String} tagType 自定义类型
		 * return {Array} 返回纯数组，非伪数组
		 */
		_serialize: function(tag, tagType) {
			tag = tag || tagType;

			return [].slice.call(this.container.querySelectorAll(tag));
		},

		/**
		 * 解析规则 如果无data-reg只做简单的非空操作
		 * @param {Array} 集合
		 */
		_resolveRule: function(serializeArray) {
			var self = this;

			for(var item of serializeArray) {
				var reg = item.dataset.reg;

				// 未设置reg配置，派发进_processingEmpty处理, 失败则终止操作
				if(!reg) {
					if(!self._processingEmpty(item)) {
						return false;
					}

				} else if(reg) {
					reg = JSON.parse(reg.replace(/\\/g, "\\\\"));

					for(var i in reg) {
						var failMsg = reg.failMsg || '';

						if(!self._distribute(i, reg[i], item, failMsg)) {
							return false;
						}
					}
				}
			}

			// 如果有mateArray的话则走_mateMatch处理，否侧直接输出成功匹配状态
			if(self.mateArray.length === 0) {
				self.result.call(self, {
					status: 1,
					msg: '',
					dom: '',
					value: self.handleResultData(self.serializeArray)
				});
			} else {
				self._mateMatch(self.mateArray);
			}
		},

		/**
		 * 派发
		 * @param {String} key 各项key
		 * @param {String} value 值 
		 * @param {HTMLElement} dom 元素
		 * @param {String} failMsg toast的值
		 * @return {Boolean} 
		 */
		_distribute: function(key, value, dom, failMsg) {
			var self = this;

			switch(key) {

				//  是否允许为空
				case 'allowEmpty':
					if(!self._processingEmpty(dom, value, failMsg)) {
						return false;
					}

					break;

					// 正则类型
				case 'regType':
					if(!self._resolveRegType(dom, value, failMsg)) {
						return false;
					}

					break;

					// 自定义正则表达式
				case 'regExp':
					if(!self._resolveRegExp(dom, value, failMsg)) {
						return false;
					}

					break;
			}

			return true;
		},

		/**
		 * 处理为空的情况, 为配置reg时，默认输出placeholder
		 * @param {HTMLElement} 
		 * @param {Boolean} 是否允许为空
		 * @param {String} toast的值
		 * @return {Boolean} 
		 */
		_processingEmpty: function(dom, allowEmpty, failMsg) {
			if(allowEmpty === 'false') {
				allowEmpty = false;
			}

			if(dom.value == '' && !allowEmpty) {
				this.showResultAndToast({
					msg: failMsg,
					dom: dom,
					value: dom.value,
					status: false
				});

				return false;
			}

			return true;
		},

		/**
		 * 自定义正则表达式处理
		 * @param {HTMLElement} 
		 * @param {Boolean} 是否允许为空
		 * @param {String} toast的值
		 * @return {Boolean} 
		 */
		_resolveRegExp: function(dom, regExp, failMsg) {
			var self = this;
			regExp = eval(regExp);

			if(regExp.test(dom.value)) {
				return true;
			}

			self.showResultAndToast({
				msg: failMsg,
				dom: dom,
				value: dom.value,
				status: false
			});

			return false;
		},

		/**
		 * 基于Util.string处理正则表达式
		 * @param {HTMLElement} dom元素
		 * @param {String} 正则类型-与Util.string一直 
		 */
		_resolveRegType: function(dom, regType, failMsg) {
			var self = this,
				value = dom.value,
				stringToolsRegType = stringTools[regType],
				compatibleRegType = compatible[regType];

			try {
				if(stringToolsRegType && !stringToolsRegType(value)) {
					self.showResultAndToast({
						msg: failMsg,
						dom: dom,
						value: value,
						status: 0
					});

					return false;
				}

			} catch(e) {
				if(compatibleRegType && !compatibleRegType(value)) {
					self.showResultAndToast({
						msg: failMsg,
						dom: dom,
						value: value,
						status: 0
					});

					return false;
				}
			}

			return true;
		},

		/**
		 * 处理匹配两次是否输入的一致
		 * @param {String} mateArray
		 * return {Array} 返回纯数组，非伪数组
		 */
		_mateMatch: function(mateArray) {
			var len = mateArray.length,
				self = this;

			// 只有一项的话不处理，直接返回
			if(len <= 1) {
				return;
			}

			var isTrue = mateArray.reduce(function(pre, next) {
				var mateJSON = JSON.parse(pre.dataset.mate),
					_mateJSON = JSON.parse(next.dataset.mate);

				if(mateJSON.mate == _mateJSON.mate) {
					// 验证失败
					if(!(pre.value == next.value)) {

						self.showResultAndToast({
							msg: mateJSON.failMsg,
							dom: next,
							value: next.value,
							status: 0
						});

						return false;
					}

					return true;
				}
			});

			// 如果mate匹配正确 输出结果
			if(isTrue) {
				self.result.call(self, {
					status: 1,
					msg: '',
					dom: '',
					value: self.handleResultData(self.serializeArray)
				});
			}
		},
		
		/**
		 * 处理data-id，直接打包成对象
		 * @param {Array} domArray 集合
		 * return {Object} 返回处理过后的数据 
		 */
		handleResultData: function(domArray) {
			var data = {};
			
			for(var item of domArray) {
				var dataId = item.dataset.id;
				
				if(dataId) {
					data[dataId] = item.value;
				}
			}
			
			return data;
		},

		/**
		 * 输出提示内容
		 * @param {String} failMsg 提示内容
		 * @param {HTMLElement} dom
		 */
		toast: function(failMsg, dom) {
			Util.ejs.ui.toast(failMsg || dom.placeholder || '');
		},

		/**
		 * 输出结果并且提示
		 * @param {Object} result
		 * msg {String} toast的内容
		 * status {Boolean} 成功与否的状态
		 * dom {HTMLElement} 当前元素
		 * value {Stirng} 当前元素的输入值
		 */
		showResultAndToast: function(result) {
			var dom = result.dom,
				self = this;

			result.msg = result.msg || result.dom.placeholder;

			self.toast(result.msg, dom);
			self.result.call(self, result);
		}
	};

	window.FormValidate = FormValidate;

}(document, window.Util, window.Util.string));
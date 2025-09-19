/*
 * 表单事件相关js
 * @Author: liub 
 * @Date: 2019-06-15 13:51:49 
 * @Last Modified by: liub
 * @Last Modified time: 2019-06-15 13:55:47
 */
(function(win, $) {
	var assignmentname = win.assignmentname || 'assignment';
	var setDataName = win.setDataName || 'setDataSource';
	// 事件处理中会用到的通用方法
	var eventFuns = {
		// 显示控件或区域
		show : function(targets) {
			var i = 0, l, target, control;

			if (!targets || !(l = targets.length)) {
				return;
			}

			for (; i < l; i++) {
				target = targets[i];

				if (target.type === 'control') {
					control = mini.get(target.id);
					control && control.show();
				} else {
					$('#' + target.id).removeClass('hidden');
				}
			}
		},
		// 隐藏控件获取区域
		hide : function(targets) {
			var i = 0, l, target, control;

			if (!targets || !(l = targets.length)) {
				return;
			}

			for (; i < l; i++) {
				target = targets[i];

				if (target.type === 'control') {
					control = mini.get(target.id);
					control && control.hide();
				} else {
					$('#' + target.id).addClass('hidden');
				}
			}
		},
		// 赋值控件
		assignment : function(targets, sourceTableId, val, name) {
			var i = 0, l, control, value;
			if (!targets || !(l = targets.length) || !sourceTableId) {
				return;
			}

			var targetFields = getTargetFields(targets);

			epoint.execute(assignmentname, '@none', {
				sourceTableId : sourceTableId,
				fields : targetFields,
				key : val,
				fieldName : name
			}, function(data) {
				/*
				 * 返回数据 data 格式为： { [#fieldName]: [#value], [#fieldName]:
				 * [#value], ... }
				 */

				for (; i < l; i++) {
					control = mini.get(targets[i].id);
					value = data[targets[i].setValueField];

					if (control && value !== undefined) {
						control.setValue(value);
					}
				}
			});

		},
		// 清空区域或控件
		clear : function(targets) {
			var i = 0, l, form;
			if (!targets || !(l = targets.length)) {
				return;
			}

			for (; i < l; i++) {
				form = new mini.Form('#' + targets[i].id);
				form.clear();
			}

		},
		// 设置控件数据源
		setData : function(targets, val, name, codeName) {
			var i = 0, l, id, control;
			if (!targets || !(l = targets.length)) {
				return;
			}

			var controlData = getTargetControlData(targets);
			epoint.execute(setDataName, '@none', {
				key : val,
				controlData : controlData,
				fieldName : name,
				codeName : codeName
			}, function(data) {
				/*
				 * 返回数据 data 格式为： { [#id]: [#data], [#id]: [#data], ... }
				 */

				for (; i < l; i++) {
					id = targets[i].id;
					control = mini.get(id);

					if (control && control.setData) {
						control.setData(data[id]);
						control._codeName = codeName;
					}
				}
			});
		}
	};

	var getTargetFields = function(targets) {
		var fields = [];
		for (var i = 0, l = targets.length; i < l; i++) {
			fields.push(targets[i].setValueField);
		}

		return fields;
	};

	var getTargetControlData = function(targets) {
		var data = [], control;

		for (var i = 0, l = targets.length; i < l; i++) {
			control = mini.get(targets[i].id);
			data.push({
				id : control.id
			});
		}

		return data;
	};

	win.eventFuns = eventFuns;

})(this, jQuery);
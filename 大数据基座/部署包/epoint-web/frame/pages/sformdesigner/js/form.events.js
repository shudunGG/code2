/*
 * 表单事件相关js
 * @Author: liub 
 * @Date: 2019-06-15 13:51:49 
 * @Last Modified by: chends
 * @Last Modified time: 2021-05-18 10:23:28
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
                    if (control)  {
                        doControlShow(control);
                    }
				} else if (target.type === 'acc-item') {
					Util.accordion.showItem($('#' + target.id).index());
				} else {
                    // label 和 title 是有id的
                    var $el = $('#' + target.id).removeClass('hidden');
                    if ($el.hasClass('design-form-label') || $el.hasClass('design-form-title')) {
                        $el.closest('.row').removeClass('first-row-hide').show();
                    }
                    // 行上没有id
                    $('[row-id="' + target.id + '"]').removeClass('hidden');
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
                    if (control) {
                        doControlHide(control);
                    }
				} else if (target.type === 'acc-item') {
					Util.accordion.hideItem($('#' + target.id).index());
				} else {
                    // label 和 title 是有id的
                    var $el = $('#' + target.id).addClass('hidden');
                    // label 和 title 隐藏后也需要检查
                    if ($el.hasClass('design-form-label') || $el.hasClass('design-form-title')) {
                        _doRowHide($el.closest('.row'));
                    }
                    // 行上没有id
                    $('[row-id="' + target.id + '"]').addClass('hidden');
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

    $('<style>.first-row-hide{height: 1px!important; min-height: 1px!important;overflow: hidden!important;}</style>').appendTo('head');
    
    function doControlHide(control) {
        control.hide();
        var $ctr = $(control.el);

        // 控件 和 label 隐藏
        $ctr.hide();

        // 可能的tips
        var $tips = $ctr.next();
        if ($tips.hasClass('control-tips')) {
            $tips.hide();
        }
        // label
        var $label = $ctr.parent().prev().find('.design-form-label');
        $label.hide();

        var $row = $ctr.closest('.row');
        _doRowHide($row);
    }

    function _doRowHide($row) {
        var $cols = $row.find('> .col');
        var colCount = $cols.length;
        // 只有控件 或 控件 + label 则直接全部隐藏行即可
        if (colCount == 1 || colCount == 2) {
            // 第一行上有整个表单的上边框需要特殊处理
            if ($row.hasClass('first')) {
                // $row.css({
                //     height: '1px',
                //     minHeight: '',
                //     overflow: 'hidden',
                // });
                $row.addClass('first-row-hide');
            } else {
                $row.hide();
            }
        } else {
            // 否则检查一次 是否一整行的控件都被隐藏了
            var allHide = true;
            $.each($cols, function (i, col) {
                var $col = $(col);
                $col.find('> *').each(function (j, el) {
                    // 任意元素还在显示 则无需继续
                    if ($(el).is(':visible')) {
                        allHide = false;
                        return false;
                    }
                });
                if (!allHide) {
                    return false;
                }
            });

            if (allHide) {
                if ($row.hasClass('first')) {
                    $row.addClass('first-row-hide');
                } else {
                    $row.hide();
                }
            }
        }
    }

    function doControlShow(control) {
        control.show();
        var $ctr = $(control.el);
    
        // 控件 和 label 显示
        $ctr.show();
    
        // 可能的tips
        var $tips = $ctr.next();
        if ($tips.hasClass('control-tips')) {
            $tips.show();
        }
        // label
        var $label = $ctr.parent().prev().find('.design-form-label');
        $label.show();
    
    
		var $row = $ctr.closest('.row');
		// 一行任意内容显示了 这一行就必须显示
		$row.removeClass('first-row-hide');
		$row.show();
    }

})(this, jQuery);
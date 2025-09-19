// var targetDom = document.elementFromPoint(evt.clientX, evt.clientY);

(function(win, $) {
	win.getTplHtml = function(id, data) {
		var tpl = $('#' + id).html();
		Mustache.parse(tpl);
		return Mustache.render(tpl, data);
	}

	win.deepClone = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	var $chartList = $('#chart-list'), $fieldList = $('#field-list'), $mergeList = $('#merge-list'), $field = $('#field'), $fieldInput = $('#field-input'), $chart = $('#chart'), $placeholder = $('#placeholder'), $main = $('#main'), $mergeHdTxt = $('#merge-hd-txt'), $bottom = $('#bottom'), $autoMerge = $('#auto-merge'), $deleteBtn = $('#delete-btn');

	var chartData = [], chartIndex = 1, chartId = '', fieldData = [], ajaxFlag = 0, mergeData = [];
	// 获取表格数据
	function getTables() {
		Util.ajax({
			url : getTablesUrl
		}).done(function(data) {
			chartData = data;
			// console.log(JSON.stringify(chartData))
			// chartData.forEach(function(item,i) {
			// item.index = i + 1;
			// })
			$chartList.html(getTplHtml('chart-tpl', {
				list : chartData
			}));
			$('.chart-item').eq(0).trigger('click');
			ajaxFlag += 1;
			renderMerge()
		})
	}
	// 获取已合并字段数据
	function getMerge() {
		Util.ajax({
			url : getMergeUrl
		}).done(function(data) {
			mergeData = data;
			ajaxFlag += 1;
			renderMerge()
		})
	}
	getMerge();
	function renderMerge() {
		if (ajaxFlag == 2) {
			var html = '';
			mergeData.forEach(function(item) {
				var str = '';
				item.fields.forEach(function(field) {
					str += getTplHtml('merge-tpl', {
						list : {
							index : field.index,
							chartId : field.chartId,
							name : field.name,
							control : field.control,
							fieldName : field.fieldName,
							formguid : field.formguid
						}
					});
					disabledField(field.chartId, field.name)
				})
				html += getTplHtml('merge-box-tpl', {
					list : {
						type : item.type,
						control : item.control,
						html : str
					}
				});
			})
			$mergeList.html(html);
			search();
			selectDrag();
			renderMergeNum();
		}
	}
	// 表字段拖拽
	function fieldDrag() {
		$fieldList
				.find('.field-item')
				.draggable(
						{
							cancel : '.disabled',
							cursor : 'move',
							cursorAt : {
								top : 15,
								left : 20
							},
							helper : function(e) {
								var $target = $(e.target);
								var html = getTplHtml('helper-tpl', {
									list : {
										chartId : chartId,
										index : chartIndex,
										name : $target.data('name'),
										control : $target.data('control'),
										type : $target.data('type'),
										fieldName : $target.data('fieldname'),
										formguid : $target.data('formguid')
									}
								});
								return $(html)[0];
							},
							opacity : .8,
							drag : function(e, ui) {
								var $helper = ui.helper, helperWidth = $helper
										.outerWidth(), targetDom = document
										.elementFromPoint(e.clientX, e.clientY), $parentMergeBox = $(
										targetDom).closest('.merge-box'), $parentMergeList = $(
										targetDom).closest('.merge-list');

								if ($parentMergeBox.length) {
									$parentMergeBox.scrollLeft(10000);
									$placeholder.width(helperWidth);
									$parentMergeBox.append($placeholder
											.removeClass('hidden').removeClass(
													'mar'));
								} else if (!$parentMergeBox.length
										&& $parentMergeList.length) {
									$placeholder.width(helperWidth);
									$parentMergeList.append($placeholder
											.removeClass('hidden').addClass(
													'mar'));
								} else {
									$placeholder.addClass('hidden')
											.removeClass('mar').appendTo($main);
								}
							},
							stop : function(e, ui) {
								$placeholder.addClass('hidden').removeClass(
										'mar').appendTo($main);
								var $helper = ui.helper, control = $helper
										.data('control'), type = $helper
										.data('type'), name = $helper
										.data('name'), fieldName = $helper
										.data('fieldname'), formguid = $helper
										.data('formguid'), id = $helper
										.data('chartid'), index = $helper
										.data('index'), targetDom = document
										.elementFromPoint(e.clientX, e.clientY), $parentMergeBox = $(
										targetDom).closest('.merge-box'), $parentMergeList = $(
										targetDom).closest('.merge-list');

								if ($parentMergeBox.length) {
									if ($parentMergeBox.data('control') != control) {
										epoint.showTips('控件类型不匹配，无法合并', {
											state : 'warning',
											timeout : 3000
										});
										return;
									}

									if ($parentMergeBox.data('type') != type) {
										epoint.showTips('字段类型不匹配，无法合并', {
											state : 'warning',
											timeout : 3000
										});
										return;
									}
									var $mergeItems = $parentMergeBox
											.find('.merge-item');
									for (var i = 0; i < $mergeItems.length; i++) {
										var $item = $mergeItems.eq(i);
										if ($item.data('chartid') == id) {
											epoint.showTips('同一张表下的字段无法合并', {
												state : 'warning',
												timeout : 3000
											});
											return;
										}
									}
									console.log(fieldName, formguid)
									$parentMergeBox.append(getTplHtml(
											'merge-tpl', {
												list : {
													chartId : id,
													index : index,
													name : name,
													fieldName : fieldName,
													formguid : formguid
												}
											}));
									$parentMergeBox.scrollLeft(10000);
									disabledField(id, name);
									search();
									selectDrag();
									renderMergeNum();
									// if($parentMergeBox.data('control') ==
									// control && $parentMergeBox.data('type')
									// == type) {

									// } else {
									// epoint.showTips('字段类型或控件类型不匹配，无法合并', {
									// state: 'warning',
									// timeout: 3000
									// });
									// }
								} else if (!$parentMergeBox.length
										&& $parentMergeList.length) {
									var html = getTplHtml('merge-tpl', {
										list : {
											chartId : id,
											index : index,
											name : name,
											control : control,
											fieldName : fieldName,
											formguid : formguid
										}
									});
									$parentMergeList.append(getTplHtml(
											'merge-box-tpl', {
												list : {
													html : html,
													control : control,
													type : type
												}
											}))
									disabledField(chartId, name);
									search();
									selectDrag();
									renderMergeNum();
								}
							}
						})
	}
	// 已合并的字段拖拽
	function selectDrag() {
		$mergeList
				.find('.merge-item')
				.draggable(
						{
							cursor : 'move',
							cursorAt : {
								top : 15,
								left : 20
							},
							opacity : .8,
							helper : function(e) {
								var $target = $(e.target)
										.closest('.merge-item'), $parentMergeBox = $target
										.closest('.merge-box');
								var html = getTplHtml('helper-tpl', {
									list : {
										chartId : $target.data('chartid'),
										index : $target.data('index'),
										name : $target.data('name'),
										fieldName : $target.data('fieldname'),
										control : $parentMergeBox
												.data('control'),
										type : $parentMergeBox.data('type'),
										formguid : $target.data('formguid')
									}
								});
								return $(html)[0];
							},
							drag : function(e, ui) {
								var $helper = ui.helper, helperWidth = $helper
										.outerWidth(), targetDom = document
										.elementFromPoint(e.clientX, e.clientY), $parentMergeBox = $(
										targetDom).closest('.merge-box'), $parentMergeList = $(
										targetDom).closest('.merge-list');

								if ($parentMergeBox.length) {
									$parentMergeBox.scrollLeft(10000);
									$placeholder.width(helperWidth);
									$parentMergeBox.append($placeholder
											.removeClass('hidden').removeClass(
													'mar'));
								} else if (!$parentMergeBox.length
										&& $parentMergeList.length) {
									$placeholder.width(helperWidth);
									$parentMergeList.append($placeholder
											.removeClass('hidden').addClass(
													'mar'));
								} else {
									$placeholder.addClass('hidden')
											.removeClass('mar').appendTo($main);
								}
							},
							stop : function(e, ui) {
								$placeholder.addClass('hidden').removeClass(
										'mar').appendTo($main);
								var $target = $(e.target), $helper = ui.helper, control = $helper
										.data('control'), type = $helper
										.data('type'), name = $helper
										.data('name'), fieldName = $helper
										.data('fieldname'), formguid = $helper
										.data('formguid'), id = $helper
										.data('chartid'), index = $helper
										.data('index'), targetDom = document
										.elementFromPoint(e.clientX, e.clientY), $parentMergeBox = $(
										targetDom).closest('.merge-box'), $parentMergeList = $(
										targetDom).closest('.merge-list');
								if ($parentMergeBox.length) {
									if ($parentMergeBox[0] == $target.parent()[0]) {
										return;
									}
									if ($parentMergeBox.data('control') != control) {
										epoint.showTips('控件类型不匹配，无法合并', {
											state : 'warning',
											timeout : 3000
										});
										return;
									}
									if ($parentMergeBox.data('type') != type) {
										epoint.showTips('字段类型不匹配，无法合并', {
											state : 'warning',
											timeout : 3000
										});
										return;
									}
									var $mergeItems = $parentMergeBox
											.find('.merge-item');
									for (var i = 0; i < $mergeItems.length; i++) {
										var $item = $mergeItems.eq(i);
										if ($item.data('chartid') == id) {
											epoint.showTips('同一张表下的字段无法合并', {
												state : 'warning',
												timeout : 3000
											});
											return;
										}
									}
									$parentMergeBox.append(getTplHtml(
											'merge-tpl', {
												list : {
													chartId : id,
													index : index,
													name : name,
													fieldName : fieldName,
													formguid : formguid
												}
											}));
									$parentMergeBox.scrollLeft(10000);
									selectDrag();
									if ($target.parent().find('.merge-item').length == 2) {
										$target.parent().remove();
									} else {
										$target.remove();
									}
									renderMergeNum();
									// if($parentMergeBox.data('control') ==
									// control && $parentMergeBox.data('type')
									// == type) {

									// } else {
									// epoint.showTips('字段类型或控件类型不匹配，无法合并', {
									// state: 'warning',
									// timeout: 3000
									// });
									// }
								} else if (!$parentMergeBox.length
										&& $parentMergeList.length) {
									var html = getTplHtml('merge-tpl', {
										list : {
											chartId : id,
											index : index,
											name : name,
											control : control,
											fieldName : fieldName,
											formguid : formguid
										}
									});
									$parentMergeList.append(getTplHtml(
											'merge-box-tpl', {
												list : {
													html : html,
													control : control,
													type : type
												}
											}));
									selectDrag();
									if ($target.parent().find('.merge-item').length == 2) {
										$target.parent().remove();
									} else {
										$target.remove();
									}
									renderMergeNum();
								}
							}
						})
	}
	// 根据表id 字段名 禁用字段
	function disabledField(id, name) {
		for (var i = 0; i < chartData.length; i++) {
			var item = chartData[i];
			if (item.id == id) {
				item.fields.forEach(function(field) {
					if (field.name == name) {
						field.disabled = true;
						if (id == chartId) {
							fieldData = item.fields;
						}
						return;
					}
				})
			}
		}
	}
	// 接触禁用字段
	function unDisabledField(id, name) {
		for (var i = 0; i < chartData.length; i++) {
			var item = chartData[i];
			if (item.id == id) {
				item.fields.forEach(function(field) {
					if (field.name == name) {
						delete field.disabled
						// field.disabled = false;
						if (id == chartId) {
							fieldData = item.fields;
						}
						return;
					}
				})
			}
		}
	}
	// 计算已合并的数量
	function renderMergeNum() {
		$mergeHdTxt.html('已合并&nbsp;' + $('.merge-box').length);
	}
	// 获取需要提交的数据
	function getSubmitData() {
		var data = [], $mergeBox = $('.merge-box');
		for (var i = 0; i < $mergeBox.length; i++) {
			var $item = $mergeBox.eq(i), mdata = {}, $mergeItems = $(
					'.merge-item', $item);
			mdata.shareCName = $mergeItems.eq(0).data('name');
			mdata.shareName = $mergeItems.eq(0).data('fieldname');
			mdata.type = $item.data('type');
			mdata.control = $item.data('control');
			mdata.fields = [];
			for (var j = 0; j < $mergeItems.length; j++) {
				var $mergeItem = $mergeItems.eq(j);
				mdata.fields.push({
					chartId : $mergeItem.data('chartid'),
					name : $mergeItem.data('name'),
					formguid : $mergeItem.data('formguid'),
					fieldName : $mergeItem.data('fieldname'),
					index : $mergeItem.data('index'),
					control : $item.data('control')
				})
			}
			data.push(mdata);
		}
		console.log(data);
		return data;
	}
	// 表字段搜索
	function search() {
		var val = $fieldInput.val(), fieldDataCopy = [];
		if (val != '') {
			fieldData.forEach(function(item) {
				if (item.name.indexOf(val) > -1) {
					var itemCopy = deepClone(item);
					itemCopy.nameHtml = itemCopy.name.replace(val,
							'<span class="mini-highlight">' + val + '</span>');
					fieldDataCopy.push(itemCopy);
				}
			})
			$fieldList.html(getTplHtml('field-tpl', {
				list : fieldDataCopy
			}));
		} else {
			console.log(fieldData);
			$fieldList.html(getTplHtml('field-tpl', {
				list : fieldData
			}));
		}

		fieldDrag();
	}
	// 点击表名
	$chart.on('click', '.chart-item', function() {
		var $this = $(this), id = $this.data('id');
		chartId = id;
		chartIndex = $this.data('index');
		$this.addClass('active').siblings().removeClass('active');
		for (var i = 0; i < chartData.length; i++) {
			if (chartData[i].id == id) {
				fieldData = chartData[i].fields;
				break;
			}
		}
		fieldData.forEach(function(item) {
			item.nameHtml = item.name;
		})
		search();
	})
	// 搜索
	$fieldInput.on('keydown', function(e) {
		if (e.keyCode == 13) {
			search();
		}
	})
	$field.on('click', '.icon-search', function() {
		search();
	})
	// 点击上一步
	$bottom.on('click', '.prev-btn', function() {
		var rowguid = Util.getUrlParams('rowguid');
		var isSub = Util.getUrlParams('isSub');
		var relationguid = Util.getUrlParams('relationguid');
		win.parent.goCustomPrev(rowguid, isSub, relationguid);
	})
	// 点击下一步
	.on('click', '.next-btn', function() {
		Util.ajax({
			url : saveMergeDataUrl,
			data : {
				mergeData : JSON.stringify(getSubmitData())
			}
		}).done(function(data) {
			if (data.flg == "1") {
				var rowguid = Util.getUrlParams('rowguid');
				var isSub = Util.getUrlParams('isSub');
				var relationguid = Util.getUrlParams('relationguid');
				win.parent.goCustomNext(rowguid, isSub, relationguid);
			} else {
				epoint.showTips('选中的表无可用字段，无法进行合并请重新选择', {
					state : 'warning',
					timeout : 3000
				});
			}

		})
	})
	// 点击智能合并
	$autoMerge.on('click', function() {
		Util.ajax({
			url : autoMergeUrl,
			data : {
				chartData : JSON.stringify(chartData)
			}
		}).done(function(data) {
			if (data.length != 0) {
				var html = '';
				data.forEach(function(item) {
					var str = '';
					item.fields.forEach(function(field) {
						str += getTplHtml('merge-tpl', {
							list : {
								index : field.index,
								chartId : field.chartId,
								name : field.name,
								control : field.control,
								fieldName : field.fieldName,
								formguid : field.formguid
							}
						});
						disabledField(field.chartId, field.name)
					})
					html += getTplHtml('merge-box-tpl', {
						list : {
							type : item.type,
							control : item.control,
							html : str
						}
					});
				})
				$mergeList.html(html);
				search();
				selectDrag();
				renderMergeNum();
			} else {
				epoint.showTips('选中的表无可用字段，无法进行智能合并操作', {
					state : 'warning',
					timeout : 3000
				});
			}

		})
	})
	// 选中字段
	$mergeList
			.on('click', '.merge-item', function() {
				$('.merge-item').removeClass('checked');
				$(this).addClass('checked');
			})
			// 点击字段删除按钮
			.on(
					'click',
					'.merge-delete-btn',
					function() {
						var $activeMergeItem = $(this).parent(), chartId = $activeMergeItem
								.data('chartid'), name = $activeMergeItem
								.data('name');

						unDisabledField(chartId, name);
						search();
						if ($activeMergeItem.parent().find('.merge-item').length > 1) {
							$activeMergeItem.remove();
						} else {
							$activeMergeItem.parent().remove();
						}
						renderMergeNum();
					})
	// 点击删除按钮
	$deleteBtn.on('click', function() {
		$mergeList.html('');
		for (var i = 0; i < chartData.length; i++) {
			var item = chartData[i];

			item.fields.forEach(function(field) {
				if (field.disabled) {
					delete field.disabled;
				}
			})
			if (item.id == chartId) {
				fieldData = item.fields;
				search();
				renderMergeNum();
			}
		}
	})
	// 按delete 删除
	$('body')
			.on(
					'keydown',
					function(e) {
						if (e.keyCode == 46) {
							var $activeMergeItem = $('.merge-item.checked'), chartId = $activeMergeItem
									.data('chartid'), name = $activeMergeItem
									.data('name');

							unDisabledField(chartId, name);
							search();
							if ($activeMergeItem.parent().find('.merge-item').length > 1) {
								$activeMergeItem.remove();
							} else {
								$activeMergeItem.parent().remove();
							}
							renderMergeNum();
						}
					}).on('click', function(e) {
				if (!$(e.target).closest('.merge-item').length) {
					$('.merge-item.checked').removeClass('checked');
				}
			})
	getTables();
	// fieldDrag()
})(this, jQuery);
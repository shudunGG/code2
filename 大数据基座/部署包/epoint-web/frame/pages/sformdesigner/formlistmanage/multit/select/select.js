/*!
 * 多表合一
 * author:jiangqn
 * date: 2020-02-11
 * version: 1.0.0
 */

(function(win, $) {
	win.getTplHtml = function(id, data) {
		var tpl = $('#' + id).html();
		Mustache.parse(tpl);
		return Mustache.render(tpl, data);
	}

	win.deepClone = function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	var $chartSelect = $('#chart-l-list'), $chartChecked = $('#chart-r-list'), $chartRight = $('#chart-r'), $chartRTitle = $('#chart-r-title'), $chartInput = $('#chart-input'), $iconSearch = $('#icon-search'), $bottom = $("#bottom");

	var selectList = [], checkedList = []; // 已选择的数据

	var ajaxFlag = 0;
	function getSelectList() {
		Util.ajax({
			url : getSelectListUrl
		}).done(function(data) {
			selectList = data;
			selectList.forEach(function(item) {
				item.nameHtml = item.name;
			})
			$chartSelect.html(getTplHtml('left-item-tpl', {
				list : selectList
			}));
			ajaxFlag += 1;
			renderChecked();
		})
	}

	function getCheckedList() {
		Util.ajax({
			url : getCheckedListUrl
		}).done(function(data) {
			checkedList = data;

			ajaxFlag += 1;
			renderChecked();
		})
	}
	getCheckedList();

	function renderChecked() {
		if (ajaxFlag == 2) {
			$('.chart-l-item').each(function(i, item) {
				var $item = $(item);
				for (var i = 0; i < checkedList.length; i++) {
					if ($item.data('id') == checkedList[i].id) {
						$item.addClass('checked');
						break;
					}
				}
			})
			renderCheckedList();
		}
	}

	getSelectList();
	// 点击左侧列表
	$chartSelect.on('click', '.chart-l-item', function(e) {
		var $this = $(this), id = $this.data('id'), name = $this.data('name');
		if ($this.hasClass('checked')) {
			$this.removeClass('checked');
			for (var i = 0; i < checkedList.length; i++) {
				if (checkedList[i].id == id) {
					checkedList.splice(i, 1);
					break
				}
			}

		} else {
			$this.addClass('checked');
			checkedList.push({
				id : id,
				name : name
			})
		}
		renderCheckedList()
	})
	// 删除全部
	$chartRight.on('click', '.back-btn', function() {
		checkedList = [];
		$chartChecked.html('');
		$('.chart-l-item.checked').removeClass('checked');
		$chartRTitle.html('已选&nbsp;0');
	}).on('click', '.delete-btn', function() {
		checkedList = [];
		$chartChecked.html('');
		$('.chart-l-item.checked').removeClass('checked');
		$chartRTitle.html('已选&nbsp;0');
	})
	// 点击close 图标
	.on('click', '.chart-r-close', function() {
		var $this = $(this).parent(), id = $this.data('id');
		for (var i = 0; i < checkedList.length; i++) {
			if (checkedList[i].id == id) {
				checkedList.splice(i, 1);
				break;
			}
		}
		renderCheckedList();
		$('.chart-l-item.checked').each(function(i, item) {
			if ($(item).data('id') == id) {
				$(item).removeClass('checked');
			}
		})
	})
	// 渲染右侧列表
	function renderCheckedList() {
		$chartChecked.html('');
		checkedList.forEach(function(item, i) {
			var itemCopy = deepClone(item);
			itemCopy.index = i + 1;
			$chartChecked.append(getTplHtml('right-item-tpl', {
				list : itemCopy
			}));
		})
		$chartRTitle.html('已选&nbsp;' + checkedList.length);
		drag();
	}

	function drag() {
		$chartChecked.sortable({
			axis : 'y',
			cursor : 'move',
			cancel : '.chart-r-close',
			stop : function() {
				checkedList = [];
				$('.chart-r-item').each(function(i, item) {
					var $item = $(item);
					checkedList.push({
						id : $item.data('id'),
						name : $item.data('name')
					})
				})
				renderCheckedList();
			}
		})
	}
	// 搜索
	$chartInput.on('keydown', function(e) {
		if (e.keyCode == 13) {
			search()
		}
	})
	$iconSearch.on('click', function() {
		search()
	})

	function search() {
		var selectListCopy = [], val = $chartInput.val();
		if (val != '') {
			selectList.forEach(function(item, i) {
				if (item.name.indexOf(val) > -1) {
					var itemCopy = deepClone(item);
					itemCopy.nameHtml = itemCopy.name.replace(val,
							'<span class="mini-highlight">' + val + '</span>')
					selectListCopy.push(itemCopy);
				}
			})
			$chartSelect.html(getTplHtml('left-item-tpl', {
				list : selectListCopy
			}))
		} else {
			$chartSelect.html(getTplHtml('left-item-tpl', {
				list : selectList
			}))
		}

		$('.chart-l-item').each(function(i, item) {
			var $item = $(item), id = $item.data('id');
			for (var i = 0; i < checkedList.length; i++) {
				if (checkedList[i].id == id) {
					$item.addClass('checked');
					return;
				}
			}

		})
	}

	$bottom.on('click', '.prev-btn', function() {
		var rowguid = Util.getUrlParams('rowguid');
		var isSub = Util.getUrlParams('isSub');
		var relationguid = Util.getUrlParams('relationguid');
		if (relationguid == "" || relationguid == "undefined") {
			window.parent.goPrev(rowguid, isSub);
		} else {
			window.parent.goCustomPrev(rowguid, isSub, relationguid);
		}

	}).on('click', '.next-btn', function() {
		var rowguid = Util.getUrlParams('rowguid');
		var isSub = Util.getUrlParams('isSub');
		if(checkedList.length>1){							
	        Util.ajax({
                url : saveSelectDataUrl,
                data : {
	                 selectData : JSON.stringify(checkedList)
                }
            }).done(function(data) {
                if(data.relationguid){
                	window.parent.goCustomNext(rowguid, isSub, data.relationguid);
                }else if(data.msg){
	                epoint.alert(data.msg, null, null, 'info');
                }else{
	                 window.parent.goNext(rowguid, isSub);
                }
            })
		} else {
			epoint.showTips('所选单表不足，无法进行多表合一操作！', {
				state : 'warning',
				timeout : 3000
			});
			return;
		}
		
			
	})

})(this, jQuery);
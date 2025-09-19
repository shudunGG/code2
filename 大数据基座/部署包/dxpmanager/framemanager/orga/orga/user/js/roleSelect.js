(function(win, $) {
	var $roleContain = $('#role-contain'), $multiTab = $('#multi-tabs'), $singleTab = $('#single-tab'), $publicStatus = $('#public-status'), $publicLable = $('#public-lable'),

	$roleTab, $roleBox, $searchInput, ROLETPL = $.trim($('#role-template')
			.html());

	// cacheRoleCollection = []; // 加载后缓存数据
	// win.cacheRoleCollection = cacheRoleCollection;
	// 获取角色列表
	var renderRoleList = function(cacheData) {

		Util.ajax({
			url : roleConfig.roleList
		}).done(function(res) {
			// console.log(res);

			// 选择器初始化
			if (res.isSingle) {
				$roleBox = $('.role-box', $singleTab);
				$searchInput = $('.search-input', $singleTab);
				$roleTab = $('.role-tab', $singleTab);
				$singleTab.removeClass('hidden')

			} else {
				$roleBox = $('.role-box', $multiTab);
				$searchInput = $('.search-input', $multiTab);
				$roleTab = $('.role-tab', $multiTab);
				$multiTab.removeClass('hidden');
				mini.get('tabs1').doLayout();
			}

			if (res.roleStatus) {
				$publicStatus.addClass('active');
				$roleBox.addClass('status-active');
				$publicLable.text(' 公开状态：已开启');
			}

			if (cacheData) {
				$roleBox.html(Mustache.render(ROLETPL, {
					list : cacheData
				}));
			} else {
				$roleBox.html(Mustache.render(ROLETPL, {
					list : res.list
				}));
				// 缓存数据
				cacheRoleCollection = JSON.parse(JSON.stringify(res.list));// getRoleList();
			}
		})
	};

	renderRoleList();
	
	var refreshRoleList = function(data) {
		$roleBox.html(Mustache.render(ROLETPL, {
			list : data
		}));
		// 缓存数据
		cacheRoleCollection = JSON.parse(JSON.stringify(data));// getRoleList();
	}
	window.refreshRoleList = refreshRoleList;

	// 状态点击事件
	$roleContain.on('click', '.public-status', function() {
		var $this = $(this);
		if ($this.hasClass("active")) {
			$this.removeClass('active');
			$roleBox.removeClass('status-active');
			$publicLable.text(' 公开状态：未开启');
		} else {
			$roleBox.addClass('status-active');
			$this.addClass('active');
			$publicLable.text(' 公开状态：已开启');
		}

	}).on(
			'click',
			'.role-check',
			function() {
				// 复选框
				if ($publicStatus.hasClass('active'))
					return false;

				var $this = $(this), $classify = $this.parent().parent()
						.parent().parent(), _id = $this.data('id');

				// 如果子集也要添加是否显示复选框，则 if 中添加 || $this.hasClass('no-check')
				if ($classify.hasClass('select-all')) {
					return false;
				} else {
					// 如果是点击的搜索结果
					var fromSearch = $this.hasClass('search-check') ? true
							: false;

					if ($this.hasClass('active')) {
						changeRoleStatusById(cacheRoleCollection, _id, false,
								fromSearch);
						$this.removeClass('active');
					} else {
						changeRoleStatusById(cacheRoleCollection, _id, true,
								fromSearch);
						$this.addClass('active');
					}

				}

			}).on('click', '.role-title-check', function() {

		if ($publicStatus.hasClass('active'))
			return false;

		var $this = $(this);
		$parent = $this.parent().parent(), _id = $this.data('id');
		// 类别复选框
		if ($this.hasClass('no-check'))
			return false;

		if ($this.hasClass('search-title'))
			return false;

		if (!$this.hasClass('active')) {
			$this.addClass('active');
			$parent.addClass('select-all');
			changeRoleStatusById(cacheRoleCollection, _id, true);
		} else {
			$this.removeClass('active');
			$parent.removeClass('select-all');
			changeRoleStatusById(cacheRoleCollection, _id, false);
		}

	}).on('click', '.role-arrow', function() {
		// 展开收起
		var $this = $(this);
		$this.toggleClass('active');
		$this.parent().next().slideToggle(200)
	}).on('click', '.confirm-btn', function() {
		confirm('save');
	}).on('click', '.cancle-btn', function() {
		epoint.alertAndClose('确认关闭！');
	}).on('click', '.confirm-btn1', function() {
		confirm('saveCascade');
	});

	function confirm(value) {
		var isPublic = $publicStatus.hasClass('active');
		// console.log('公开状态:' + isPublic);
		var result;
		if (!isPublic) {
			// 角色授权数据
			var roleData = [];
			$(cacheRoleCollection).each(function(index, item) {
				if (!item.isChecked) {
					$(item.children).each(function(i, el) {
						if (el.isChecked) {
							if (el.fromSearch) {
								roleData.push({
									id : el.id,
									fromSearch : el.fromSearch
								});
							} else {
								roleData.push({
									id : el.id
								});
							}
						}
					});
				} else {
					roleData.push({
						classify : true,
						id : item.id
					});
				}
			});
			// 角色授权数据 end
			// console.log(roleData);
			result = JSON.stringify(roleData);
		}
		if (value == 'save') {
			epoint.execute(roleConfig.roleSave, '', [ isPublic, result ],
					function(data) {
						epoint.alertAndClose(data.msg);
					});
		}
		if (value == 'saveCascade') {
			epoint.execute(roleConfig.saveCascade, '', [ isPublic, result ],
					function(data) {
						epoint.alertAndClose(data.msg);
					});
		}

	}

	// 选择角色数据操作
	/*
	 * var roleUtil = { collection: [], cancleCollection: [], roleSite:
	 * function(id) { return this.collection.indexOf(id); }, addRole:
	 * function(id) { var _id = id, _index = this.roleSite(_id);
	 * 
	 * if( _index < 0) { this.collection.push(_id); } }, removeRole:
	 * function(id) { var _id = id, _index = this.roleSite(_id); if(_index > -1) {
	 * this.collection.splice(_index, 1); } } }
	 */

	// 根据ID查找对应的状态
	var findRoleStatusById = function(roleCollection, id) {
		for (var i = 0, len = roleCollection.length; i < len; i++) {
			for (var m = 0, mlen = roleCollection[i].children.length; m < mlen; m++) {
				if (roleCollection[i].children[m].id == id) {
					return roleCollection[i].children[m].isChecked;
				}
			}
		}
	};

	// 修改数据
	// fromSearch 表示从搜索来
	var changeRoleStatusById = function(roleCollection, id, status, fromSearch) {

		$(roleCollection).each(function(index, item) {
			if (item.id == id) {
				item.isChecked = status;
			} else {
				$(item.children).each(function(i, el) {
					if (el.id == id) {
						el.isChecked = status;
						if (fromSearch && status) {
							el.fromSearch = fromSearch;
						}
					}
				});
			}
		})
		cacheRoleCollection = roleCollection;
		//console.log(cacheRoleCollection)
	};

	var searchRole = function(name) {
		// 原先的数据
		// var roleCollection = getRoleList();

		Util.ajax({
			url : roleConfig.searchRole,
			data : {
				name : name
			}
		}).done(
				function(res) {
					if (res.list && res.list.length) {
						var searchList = [ {
							"isSearch" : true,
							"title" : '搜索结果',
							"id" : 'search-result',
							"isChecked" : false,
							"children" : res.list
						} ];

						$roleBox.html(Mustache.render(ROLETPL, {
							list : searchList
						}));

						// 初始化渲染搜索结果，如果之前的选中了，则，搜索结果中也选中
						$(res.list).each(
								function(index, item) {
									var _isChecked = findRoleStatusById(
											cacheRoleCollection, item.id);
									if (_isChecked) {
										$('#check-' + item.id).addClass(
												'active');
									} else {
										$('#check-' + item.id).removeClass(
												'active');
									}
								});

					} else {
						$roleBox.html('没有搜到相关数据');
					}

				})
	}

	document.onkeydown = function(e) {
		e = window.event || e;
		if (e.keyCode == 13) {
			var name = $.trim($searchInput.val());
			if (name) {
				searchRole(name);
			} else {
				renderRoleList(cacheRoleCollection);
			}
		}
	}

})(window, jQuery);

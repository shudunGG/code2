(function(win, $) {
	var $roleContain = $('#role-contain'), $multiTab = $('#multi-tabs'), $singleTab = $('#single-tab'), $publicStatus = $('#public-status'), $publicLable = $('#public-lable'),

	$roleTab, $roleBox, $searchInput, ROLETPL = $.trim($('#role-template')
			.html()), $singleTab2 = $('#single-tab2'), $role = $('#role-a'), $job = $('#role-job'), $searchInput2, $roleBox2, $roleTab2,

	cacheRoleCollection = []; // 加载后缓存数据
	cacheJobRoleCollection = [];// 加载后缓存岗位数据

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
				$singleTab.removeClass('hidden');

			} else {
				$roleBox = $('.role-box', $role);
				$searchInput = $('.search-input', $role);
				$roleTab = $('.role-tab', $role);
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

	// renderRoleList();
	// 解决点击加载部门人员后台报错的问题  add by gjf 2019-08-29
	window.renderRoleList = renderRoleList;

	// 如果有配置岗位列表查询地址
	if (roleConfig.jobRoleList) {
		renderJobList();
	}

	// 获取岗位列表
	function renderJobList(cacheData) {

		Util.ajax({
			url : roleConfig.jobRoleList
		}).done(function(res) {
			// console.log(res);

			// 选择器初始化
			if (res.isSingle) {
				$roleBox2 = $('.role-box', $singleTab2);
				$searchInput2 = $('.search-input', $singleTab2);
				$roleTab2 = $('.role-tab', $singleTab2);
				$singleTab2.removeClass('hidden')

			} else {
				$roleBox2 = $('.role-box', $job);
				$searchInput2 = $('.search-input', $job);
				$roleTab2 = $job; // $('.role-tab', $job);
				$multiTab.removeClass('hidden');
				mini.get('tabs1').doLayout();
			}

			if (res.roleStatus) {
				$publicStatus.addClass('active');
				$roleBox2.addClass('status-active');
				$publicLable.text(' 公开状态：已开启');
			}

			if (cacheData) {
				$roleBox2.html(Mustache.render(ROLETPL, {
					list : cacheData
				}));
			} else {

				$roleBox2.html(Mustache.render(ROLETPL, {
					list : res.list
				}));
				// 缓存岗位数据
				cacheJobRoleCollection = JSON.parse(JSON.stringify(res.list));
			}
		})
	}
	;

	// 状态点击事件
	$roleContain.on('click', '.public-status', function() {
		var $this = $(this);
		if ($this.hasClass("active")) {
			$this.removeClass('active');
			$roleBox.removeClass('status-active');
			if ($roleBox2) {
				$roleBox2.removeClass('status-active');
			}
			$publicLable.text(' 公开状态：未开启');
		} else {
			$roleBox.addClass('status-active');
			if ($roleBox2) {
				$roleBox2.addClass('status-active');
			}
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

						if (roleConfig.jobRoleList) {
							changeRoleStatusById(cacheJobRoleCollection, _id,
									false, fromSearch);
						}
					} else {
						changeRoleStatusById(cacheRoleCollection, _id, true,
								fromSearch);
						$this.addClass('active');
						if (roleConfig.jobRoleList) {
							changeRoleStatusById(cacheJobRoleCollection, _id,
									true, fromSearch);
						}
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
		var result2;
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

			// 岗位授权数据
			var jobRoleData = [];
			$(cacheJobRoleCollection).each(function(index, item) {
				if (!item.isChecked) {
					$(item.children).each(function(i, el) {
						if (el.isChecked) {
							if (el.fromSearch) {
								jobRoleData.push({
									id : el.id,
									fromSearch : el.fromSearch
								});
							} else {
								jobRoleData.push({
									id : el.id
								});
							}
						}
					});
				} else {
					jobRoleData.push({
						classify : true,
						id : item.id
					});
				}
			});
			// 岗位授权数据 end
			// console.log(jobRoleData);
			result2 = JSON.stringify(jobRoleData);
		}
		if (value == 'save') {
			epoint.execute(roleConfig.roleSave, '',
					[ isPublic, result, result2 ], function(data) {
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

	var searchJobRole = function(name) {
		// 原先的数据
		// var roleCollection = getRoleList();

		Util.ajax({
			url : roleConfig.searchJobRole,
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
											cacheJobRoleCollection, item.id);
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
		// 如果是miniui控件中的回车，则不需要处理
		if(e.target.className.indexOf('mini-textbox') > -1) {
			return;
		}
		if (e.keyCode == 13) {
			var name = $.trim($searchInput.val());
			if (name) {
				searchRole(name);
			} else {
				renderRoleList(cacheRoleCollection);
			}

			var jobName = $.trim($searchInput2.val());
			if (jobName) {
				if (roleConfig.jobRoleList) {
					searchJobRole(jobName);
				}
			} else {
				if (roleConfig.jobRoleList) {
					renderJobList(cacheJobRoleCollection);
				}
			}
		}
	}

})(window, jQuery);
function FlowShow() {
	this.ActivityList = [];
	this.RuleList = [];
	this.PathList = [];
	this.OtherPathList = [];
	this.longestPath = []; // 最长路径
	this.ActWidth = 1500; // 活动间宽度1500
	this.ActHight = 1500; // 活动间高度1500
	this.InitX = 1000; // 起始位置X
	this.InitY = 500; // 起始位置Y
	this.Ratio = 10; // 像素与插件单位的缩放比例
	this.OffX = 20; // 缩放后内部X偏移
	this.OffY = 30; // 缩放后内部Y偏移
	this.OffMove = 60; // 缩放后Y偏移手动

	// 设置节点的属性 BefActivityList、BefRules、 AftActivityList、AftRules
	this.SetActivityList = function() {
		for (var a in this.RuleList) {
			var ruleGetted = this.RuleList[a];
			if (typeof ruleGetted != 'function') {
				if (ruleGetted.BefAct != "") {
					ruleGetted.BefAct.AftActivityList.push(ruleGetted.AftAct);
					ruleGetted.BefAct.AftRules.push(ruleGetted);
				}
				if (ruleGetted.AftAct != "") {
					ruleGetted.AftAct.BefActivityList.push(ruleGetted.BefAct);
					ruleGetted.AftAct.BefRules.push(ruleGetted);
				}
			}
		}
	}

	// 寻找所有路径，并加到PathList中（为了找 最长路径）
	this.SetPathList = function(activity, paList) {
		for (var i = 0; i < activity.AftActivityList.length; i++) { // 取分支路径
			var paListNew = [];
			paListNew.length = 0;
			for (var r = 0; r < paList.length; r++) {
				paListNew[r] = paList[r];
			}
			var nextAct = activity.AftActivityList[i];
			var isContains = false;
			for (var r = 0; r < paListNew.length; r++) {
				var actr = paListNew[r];
				if (actr == nextAct) {
					isContains = true;
					break;
				}
			}
			// 如果AftActivityList不存在nextAct这个活动
			if (isContains == false) {
				paListNew.push(nextAct);
				if (nextAct.Type != "End")
					this.SetPathList(nextAct, paListNew); // 如果取到后续活动，继续取；
				else {
					this.PathList.push(paListNew); // 如果取不到，就结束，添加到PathList；
				}
			}
		}
	}

	// 开始编辑 活动的属性
	this.FlowSort = function() {

		var longestFlag = 0;
		// 取到最长的路径
		var num = 0
		if (this.PathList.length <= 0) {
			alert("未找到完整路径！");
			return;
		}
		for (var z = 0; z < this.PathList.length; z++) {

			if (num < this.PathList[z].length) {
				num = this.PathList[z].length;
				longestFlag = z;
			}
		}
		// 这是最长路径,找到并设置位置 this.longestPath(全局变量)
		this.longestPath = this.PathList[longestFlag];
		for (var k = 0; k < this.longestPath.length; k++) {
			this.longestPath[k].LevelX = 0; // 最左边level=0
			this.longestPath[k].LevelY = k;
			this.longestPath[k].Y1 = 0;
			this.longestPath[k].Y2 = this.longestPath.length - 1; // Y1Y2区间
			// 每个Activity活动
			// 都要设置
		}

		// 其他的 从最长路径开始循环节点遍历
		for (var i = 0; i < this.longestPath.length; i++) {
			var nowAct = this.longestPath[i];
			this.BranchSort(nowAct, nowAct.LevelX + 1, nowAct.LevelX + 1);
		}

	}

	// 分支排序
	this.BranchSort = function(nowAct, MaxLevelXUp, MaxLevelXDown) {
		var MaxLevelX = [];
		var AftActivityListSort = [];
		for (var i = 0; i < nowAct.AftActivityList.length; i++) {
			if (nowAct.AftActivityList[i].LevelX < 0) {
				this.OtherPathList = [];
				this.OtherPathList.length = 0;
				nowAct.AftActivityList[i].MathPath = this
					.FindMaxPath(nowAct.AftActivityList[i]);
			}
		}
		nowAct.AftActivityList.sort(function(a, b) {
			return a.MathPath.length < b.MathPath.length ? 1 : -1
		});
		for (var i = 0; i < nowAct.AftActivityList.length; i++) { // 遍历 获取后续活动
			var nextAct = nowAct.AftActivityList[i];
			var editRule = this.FindRuleByActs(nowAct.Name, nextAct.Name);
			if (nextAct.LevelX >= 0) { // 已经赋值了
				if (nowAct.LevelX == nextAct.LevelX) {
					if (nextAct.LevelY == nowAct.LevelY - 1) { // 1.往上一格,不需要变
						continue;
					} else if (nextAct.LevelY < nowAct.LevelY - 1) { // 2.往上大于1
						// continue;
						if (editRule != "") {
							editRule.LevelX = this.MoveActs(MaxLevelXUp,
								nextAct.LevelY, nowAct.LevelY, true,
								MaxLevelXUp); // nextAct.LevelY小于
							// nowAct.LevelY
							// MaxLevelXUp = editRule.LevelX +
							// 1;//MaxLevelXDown没有加一
							editRule.Y1 = nextAct.LevelY;
							editRule.Y2 = nowAct.LevelY;
						}
						continue;
					} else if (nextAct.LevelY == nowAct.LevelY + 1) { // 4.往下一格,不需要变
						continue;
					} else if (nextAct.LevelY > nowAct.LevelY) { // 5.往下大于一格
						if (editRule != "") {
							editRule.LevelX = this.MoveActs(MaxLevelXDown,
								nowAct.LevelY, nextAct.LevelY, false,
								MaxLevelXDown); // nextAct.LevelY小于
							// nowAct.LevelY
							// MaxLevelXDown = editRule.LevelX +
							// 1;//MaxLevelXUp没有加一
							editRule.Y1 = nowAct.LevelY;
							editRule.Y2 = nextAct.LevelY;
						}
						continue;
					} else { // 3.本身？？if (nextAct.LevelY == nowAct.LevelY)
						continue;
					}
				} else {
					for (var k in this.ActivityList) {
						var activity = this.ActivityList[k];
						if (typeof activity != 'function') {
							if (activity.LevelX == nowAct.LevelX) {
								if (nextAct.LevelY < nowAct.LevelY - 1) { // 向上
									if (activity.LevelX == nowAct.LevelX && activity.LevelY == nowAct.LevelY - 1) {
										editRule.LevelX = this.MoveActs(
											MaxLevelXUp, nowAct.LevelY,
											nextAct.LevelY, true,
											MaxLevelXUp);
										MaxLevelXUp = editRule.LevelX + 1;
										editRule.Y1 = nextAct.LevelY;
										editRule.Y2 = nowAct.LevelY;
										break;
									}
								} else if (nextAct.LevelY > nowAct.LevelY + 1) {

									// 划线，如果我找到向下划线时，有活动在路上，就画在外侧
									if (activity.LevelX == nowAct.LevelX && activity.LevelY == nowAct.LevelY + 1) {
										editRule.LevelX = this.MoveActs(
											MaxLevelXDown, nowAct.LevelY,
											nextAct.LevelY, false,
											MaxLevelXDown);
										MaxLevelXDown = editRule.LevelX + 1;
										editRule.Y1 = nowAct.LevelY;
										editRule.Y2 = nextAct.LevelY;
										break;
									}
								}
							}
						}
					}
					continue;
				}

			} else {
				// OtherPathList.length = 0;
				// 下一个Activity 未赋值
				var path = nextAct.MathPath;
				if (path.length == 0)
					continue;
				if (path.length == 2 && path[0].AftActivityList[0].LevelY == nowAct.LevelY) {
					var YFlag = nowAct.LevelY;
					var Y1Flag = nowAct.LevelY;
					var Y2Flag = nowAct.LevelY + 1;

					// 移动 参数 Y1 Y2 LevelX
					var XFlag = this.MoveActs(MaxLevelXDown, Y1Flag, Y2Flag,
						false, MaxLevelXDown);
					MaxLevelXDown = XFlag + 1;

					// 找到这个最长路径 给他赋值 xy,y1y2
					var act = path[0];
					act.LevelX = XFlag;
					act.LevelY = Y2Flag;
					act.Y1 = Y1Flag;
					act.Y2 = Y2Flag;
				} else {
					if (path[path.length - 1].LevelY >= nowAct.LevelY) {
						var YFlag = nowAct.LevelY + 1;
						var Y1Flag = nowAct.LevelY;
						var Y2Flag = path[path.length - 1].LevelY;

						// 移动 参数 Y1 Y2 LevelX
						var XFlag = this.MoveActs(MaxLevelXDown, Y1Flag,
							Y2Flag, false, MaxLevelXDown);
						MaxLevelXDown = XFlag + 1;
						for (var k = 0; k < path.length - 1; k++) {
							var act = path[k];
							act.LevelX = XFlag;
							act.LevelY = YFlag;
							act.Y1 = Y1Flag;
							act.Y2 = Y2Flag;
							YFlag = YFlag + 1;
						}
					} else {
						var YFlag = nowAct.LevelY - 1;
						var Y2Flag = nowAct.LevelY;
						var Y1Flag = path[path.length - 1].LevelY;

						// 移动 参数 Y1 Y2 LevelX
						var XFlag = this.MoveActs(MaxLevelXUp, Y1Flag, Y2Flag,
							true, MaxLevelXUp);
						MaxLevelXUp = XFlag + 1;
						for (var k = 0; k < path.length - 1; k++) {
							var act = path[k];
							act.LevelX = XFlag;
							act.LevelY = YFlag;
							act.Y1 = Y1Flag;
							act.Y2 = Y2Flag;
							YFlag = YFlag - 1;
						}
					}
				}
				for (var j = 0; j < path.length - 1; j++) {
					var nowAct2 = path[j];
					MaxLevelX = [];
					MaxLevelX.length = 0;
					MaxLevelX = this.BranchSort(nowAct2, MaxLevelXUp,
						MaxLevelXDown);
					MaxLevelXUp = MaxLevelX[0];
					MaxLevelXDown = MaxLevelX[1];
				}

				// BranchSort(nextAct);
			}

		}

		MaxLevelX = [];
		MaxLevelX.length = 0;
		MaxLevelX.push(MaxLevelXUp);
		MaxLevelX.push(MaxLevelXDown);
		return MaxLevelX;
	}

	this.FindMaxPath = function(activity) {
		var path = [];
		path.push(activity);
		this.FindPathListFromActivity(activity, path);
		// 查询当前节点出发 的最长路径
		var longestFlag = 0;
		var len = 0;
		// 取到最长的路径

		if (this.OtherPathList.length > 0) {
			for (var z = 0; z < this.OtherPathList.length; z++) {

				if (len < this.OtherPathList[z].length) {
					len = this.OtherPathList[z].length;
					longestFlag = z;
				}
			} // 设置这个调长路径的xy，y1y2
			return this.OtherPathList[longestFlag];
		} else {
			return "";
		}

	}

	// 获取这个节点后面所有路径
	this.FindPathListFromActivity = function(activity, path) {

		var pathNew = [];
		for (var i = 0; i < activity.AftActivityList.length; i++) { // 取分支路径
			var nextAct = activity.AftActivityList[i];

			pathNew.length = 0;
			for (var r = 0; r < path.length; r++) {
				pathNew[r] = path[r]; // 把Lisr类型参数给变量
			}

			var isEndPath = false;
			if (nextAct.LevelX >= 0) { // 如果已经赋值了，那么就认为他回到主路上了
				isEndPath = true;
			}

			// 如果是回路
			var isContains = false;
			for (var r = 0; r < pathNew.length; r++) {
				var actr = pathNew[r];
				if (actr == nextAct) {
					isContains = true;
					break;
				}
			}
			if (isContains == false) {
				if (isEndPath == true) {
					pathNew.push(nextAct);
					this.OtherPathList.push(pathNew); // 如果回到主路上，就结束，添加到OtherPathList；
				} else {
					// 没有回到主路，就继续找下一个，然后继续添加到OtherPathList
					pathNew.push(nextAct);
					this.FindPathListFromActivity(nextAct, pathNew); // 如果取到后续活动，继续取；
				}
			}

		}
	}

	// 移动冲突的Activity以及路线
	this.MoveActs = function(levX, y1, y2, isMove, returnLevX) {
		// 遍历所有Activity 如果有 这个levelX以上及以外的，有y1 y2在 上的 移动

		var flag = 0;
		for (var k in this.ActivityList) {
			var activity = this.ActivityList[k];
			if (typeof activity != 'function') {
				if (activity.LevelX == levX) {
					if (activity.Y1 < y2 && activity.Y2 > y1) { // 在这一层，区间有交集的

						if (isMove) {
							returnLevX = this.MoveActs(levX + 1, y1, y2,
								isMove, returnLevX + 1);
							break;
						} else {
							// var thisX = activity.LevelX+1;
							returnLevX = this.MoveActs(levX + 1, activity.Y1,
								activity.Y2, isMove, returnLevX);
							// activity.LevelX = levX + 1;//活动都 往外移一层

							for (var h in this.ActivityList) {
								var activity2 = this.ActivityList[h];
								if (typeof activity2 != 'function') {
									if (activity2.LevelX == levX) {
										if (activity2.Y1 == activity.Y1 && activity2.Y2 == activity.Y2) {
											activity2.LevelX = activity2.LevelX + 1; // 活动都
											// 往外移一层
										}
									}
								}
							}
						}

					}
				}
			}
		}

		// 移动 线

		for (var r in this.RuleList) {
			var rule = this.RuleList[r];
			if (typeof rule != 'function') {
				if (rule.LevelX >= 0 && rule.LevelX == levX) {
					if (rule.Y1 < y2 && rule.Y2 > y1) {
						if (isMove) {
							var thisRx = rule.LevelX + 1;
							returnLevX = this.MoveActs(thisRx, rule.Y1,
								rule.Y2, isMove, thisRx);
							break;
						} else {
							var thisRx = rule.LevelX + 1;
							returnLevX = this.MoveActs(thisRx, rule.Y1,
								rule.Y2, isMove, returnLevX);
							rule.LevelX = rule.LevelX + 1;
						}
					}
				}

			}
		}

		return returnLevX;
	}

	// 根据活动获取这条线
	this.FindRuleByActs = function(actName, aftActName) {
		var flag = "";
		for (var k in this.RuleList) {
			if (typeof this.RuleList[k] != 'function') {
				if (this.RuleList[k].BefAct.Name == actName && this.RuleList[k].AftAct.Name == aftActName) {
					flag = k;
					break;
				}
			}
		}
		if (flag != "") {
			return this.RuleList[flag];

		} else {
			return "";
		}
	}

	FlowShow.prototype.FlowChartSort = function(jsonstring) {
		// 全局变量 清空
		this.ActivityList.length = 0;
		this.ActivityList = [];
		this.RuleList.length = 0;
		this.RuleList = [];
		this.PathList.length = 0;
		this.PathList = [];
		this.OtherPathList.length = 0;
		this.OtherPathList = [];
		this.longestPath.length = 0;
		this.longestPath = [];

		var arrayList = null;
	    if(typeof jsonstring == "object"){
	    	arrayList = eval("(" + JSON.stringify(jsonstring) + ")");
	    }else{
	    	arrayList = eval("(" + jsonstring + ")");
	    }
		var nodeslist = arrayList.Nodes;
		var actionslist = arrayList.Actions;
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				this.ActivityList[k] = new Activity(this, nodeslist[k]);
			}
		}
		for (var a in actionslist) {
			if (typeof actionslist[a] != 'function') {
				actionslist[a].dots.length = 0;
				this.RuleList[a] = new Transition(this, actionslist[a]);
			}
		}
		// 根据ruleList里面的 from to 设置ActivityList 里面activity 的属性
		this.SetActivityList();

		// 找到开始
		var beginAct = "";
		for (var i in this.ActivityList) {
			if (typeof this.ActivityList[i] != 'function' && this.ActivityList[i].Type == "Begin") {
				beginAct = this.ActivityList[i];
				break;
			}
		}
		// 找到开始后，把所有路径放到SetPathList[] 全局变量（找最长路径）
		var paList = [];
		if (beginAct != "" && beginAct.AftActivityList != []) {
			paList.push(beginAct);
			this.PathList.length = 0;
			this.SetPathList(beginAct, paList);
		}

		// 开始编辑 活动的属性,LevelX,LevelY,Y1,Y2
		this.FlowSort();

		// ReadXMLHd(JSON.stringify(arrayList));
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function' && this.ActivityList[k].LevelX >= 0) {
				this.ActivityList[k].X = parseInt(this.InitX) + (parseInt(this.ActWidth) * parseInt(this.ActivityList[k].LevelX));
				this.ActivityList[k].Y = parseInt(this.InitY) + (parseInt(this.ActHight) * parseInt(this.ActivityList[k].LevelY));

				nodeslist[k].attr.x = this.ActivityList[k].X.toString();
				nodeslist[k].attr.y = this.ActivityList[k].Y.toString();
			}
		}

		for (var a in this.RuleList) {
			if (typeof this.RuleList[a] != 'function') {
				if (this.RuleList[a].LevelX >= 0) {
					if (this.RuleList[a].BefAct.LevelY < this.RuleList[a].AftAct.LevelY) {
						var dotsarray = [];
						dotsarray.length = 0;
						dotsarray["x"] = (parseInt(this.InitX) + (parseInt(this.ActWidth) * parseInt(this.RuleList[a].LevelX))) / this.Ratio + this.OffX;
						dotsarray["y"] = (parseInt(this.InitY) + (parseInt(this.ActHight) * parseInt(this.RuleList[a].Y1))) / this.Ratio + this.OffY + this.OffMove;
						var arr = {
							x: dotsarray["x"],
							y: dotsarray["y"]
						};
						actionslist[a].dots[actionslist[a].dots.length] = arr;
						var dotsarray1 = [];
						dotsarray1.length = 0;
						dotsarray1["x"] = (parseInt(this.InitX) + (parseInt(this.ActWidth) * parseInt(this.RuleList[a].LevelX))) / this.Ratio + this.OffX;
						dotsarray1["y"] = (parseInt(this.InitY) + (parseInt(this.ActHight) * parseInt(this.RuleList[a].Y2))) / this.Ratio + this.OffY - this.OffMove;
						var arr1 = {
							x: dotsarray1["x"],
							y: dotsarray1["y"]
						};
						actionslist[a].dots[actionslist[a].dots.length] = arr1;
					} else {
						var dotsarray = [];
						dotsarray.length = 0;
						dotsarray["x"] = (parseInt(this.InitX) + (parseInt(this.ActWidth) * parseInt(this.RuleList[a].LevelX))) / this.Ratio + this.OffX;
						dotsarray["y"] = (parseInt(this.InitY) + (parseInt(this.ActHight) * parseInt(this.RuleList[a].Y2))) / this.Ratio + this.OffY - this.OffMove;
						var arr = {
							x: dotsarray["x"],
							y: dotsarray["y"]
						};
						actionslist[a].dots[actionslist[a].dots.length] = arr;
						var dotsarray1 = [];
						dotsarray1.length = 0;
						dotsarray1["x"] = (parseInt(this.InitX) + (parseInt(this.ActWidth) * parseInt(this.RuleList[a].LevelX))) / this.Ratio + this.OffX;
						dotsarray1["y"] = (parseInt(this.InitY) + (parseInt(this.ActHight) * parseInt(this.RuleList[a].Y1))) / this.Ratio + this.OffY + this.OffMove;
						var arr1 = {
							x: dotsarray1["x"],
							y: dotsarray1["y"]
						};
						actionslist[a].dots[actionslist[a].dots.length] = arr1;
					}
				} else {
					if (this.RuleList[a].BefAct.LevelX != this.RuleList[a].AftAct.LevelX && this.RuleList[a].BefAct.LevelY != this.RuleList[a].AftAct.LevelY) {
						if (this.RuleList[a].BefAct.LevelY < this.RuleList[a].AftAct.LevelY) {
							// 1,向下 往外
							if (this.RuleList[a].BefAct.LevelX < this.RuleList[a].AftAct.LevelX) {
								var dotsarray = [];
								dotsarray.length = 0;
								dotsarray["x"] = this.RuleList[a].AftAct.X / this.Ratio + this.OffX;
								dotsarray["y"] = this.RuleList[a].BefAct.Y / this.Ratio + this.OffY + this.OffMove;
								var arr = {
									x: dotsarray["x"],
									y: dotsarray["y"]
								};
								actionslist[a].dots[actionslist[a].dots.length] = arr;
							} else {
								// 2,向下 往内
								var dotsarray = [];
								dotsarray.length = 0;
								dotsarray["x"] = this.RuleList[a].BefAct.X / this.Ratio + this.OffX;
								dotsarray["y"] = this.RuleList[a].AftAct.Y / this.Ratio + this.OffY - this.OffMove;
								var arr = {
									x: dotsarray["x"],
									y: dotsarray["y"]
								};
								actionslist[a].dots[actionslist[a].dots.length] = arr;
							}

						} else {
							// 3,向上 往外
							if (this.RuleList[a].BefAct.LevelX < this.RuleList[a].AftAct.LevelX) {
								var dotsarray = [];
								dotsarray.length = 0;
								dotsarray["x"] = this.RuleList[a].AftAct.X / this.Ratio + this.OffX;
								dotsarray["y"] = this.RuleList[a].BefAct.Y / this.Ratio + this.OffY - this.OffMove;
								var arr = {
									x: dotsarray["x"],
									y: dotsarray["y"]
								};
								actionslist[a].dots[actionslist[a].dots.length] = arr;
							} else {
								// 4,向上 往内
								var dotsarray = [];
								dotsarray.length = 0;
								dotsarray["x"] = this.RuleList[a].BefAct.X / this.Ratio + this.OffX;
								dotsarray["y"] = this.RuleList[a].AftAct.Y / this.Ratio + this.OffY + this.OffMove;
								var arr = {
									x: dotsarray["x"],
									y: dotsarray["y"]
								};
								actionslist[a].dots[actionslist[a].dots.length] = arr;
							}
						}
					}
				}
			}
		}
		return JSON.stringify(arrayList);
	}
	FlowShow.prototype.MoveRight = function(jsonStr) {
		// 全局变量 清空
		this.ActivityList.length = 0;
		this.ActivityList = [];
		// 解析
		var arrayList = null;
	    if(typeof jsonStr == "object"){
	    	arrayList = eval("(" + JSON.stringify(jsonStr) + ")");
	    }else{
	    	arrayList = eval("(" + jsonStr + ")");
	    }
		var nodeslist = arrayList.Nodes;

		var actionslist = arrayList.Actions;
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				this.ActivityList[k] = new ActivityToMove(this, nodeslist[k]);
			}
		}
		// 移动
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				this.ActivityList[k].X = parseInt(this.ActivityList[k].X) + parseInt(this.ActWidth) / this.Ratio;
				// this.ActivityList[k].Y = parseInt(this.ActivityList[k].Y) +
				// parseInt(this.ActHight) / this.Ratio;

				nodeslist[k].attr.x = this.ActivityList[k].X.toString();
				// nodeslist[k].attr.y = this.ActivityList[k].Y.toString();
			}
		}
		for (var a in actionslist) {
			if (typeof actionslist[a] != 'function') {
				if (actionslist[a].dots.length > 0) {
					for (var d in actionslist[a].dots) {
						if (typeof actionslist[a].dots[d] != 'function') {
							actionslist[a].dots[d].x = parseInt(actionslist[a].dots[d].x) + parseInt(this.ActWidth) / this.Ratio / this.Ratio;
						}
					}
				}
			}
		}
		return JSON.stringify(arrayList);
	}

	FlowShow.prototype.MoveDown = function(jsonStr) {
		// 全局变量 清空
		this.ActivityList.length = 0;
		this.ActivityList = [];
		// 解析
		var arrayList = null;
	    if(typeof jsonStr == "object"){
	    	arrayList = eval("(" + JSON.stringify(jsonStr) + ")");
	    }else{
	    	arrayList = eval("(" + jsonStr + ")");
	    }
		var nodeslist = arrayList.Nodes;
		var actionslist = arrayList.Actions;
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				this.ActivityList[k] = new ActivityToMove(this, nodeslist[k]);
			}
		}
		// 移动
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				this.ActivityList[k].Y = parseInt(this.ActivityList[k].Y) + parseInt(this.ActHight) / this.Ratio;
				nodeslist[k].attr.y = this.ActivityList[k].Y.toString();
			}
		}
		for (var a in actionslist) {
			if (typeof actionslist[a] != 'function') {
				if (actionslist[a].dots.length > 0) {
					for (var d in actionslist[a].dots) {
						actionslist[a].dots[d].y = parseInt(actionslist[a].dots[d].y) + parseInt(this.ActHight) / this.Ratio / this.Ratio;
					}
				}
			}
		}
		return JSON.stringify(arrayList);
	}

	FlowShow.prototype.MoveTransform = function(jsonStr) {
		// 全局变量 清空
		this.ActivityList.length = 0;
		this.ActivityList = [];
		// 解析
		var arrayList = null;
	    if(typeof jsonStr == "object"){
	    	arrayList = eval("(" + JSON.stringify(jsonStr) + ")");
	    }else{
	    	arrayList = eval("(" + jsonStr + ")");
	    }
		var nodeslist = arrayList.Nodes;
		var actionslist = arrayList.Actions;
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				this.ActivityList[k] = new ActivityToMove(this, nodeslist[k]);
			}
		}
		// 移动
		for (var k in nodeslist) {
			if (typeof nodeslist[k] != 'function') {
				var transX = this.ActivityList[k].X;
				this.ActivityList[k].X = parseInt(this.ActivityList[k].Y);
				this.ActivityList[k].Y = parseInt(transX);
				nodeslist[k].attr.x = this.ActivityList[k].X.toString();
				nodeslist[k].attr.y = this.ActivityList[k].Y.toString();
			}
		}
		for (var a in actionslist) {
			if (typeof actionslist[a] != 'function') {
				if (actionslist[a].dots.length > 0) {
					for (var d in actionslist[a].dots) {
						if (typeof actionslist[a] != 'function') {
							var transDotX = actionslist[a].dots[d].x;
							actionslist[a].dots[d].x = parseInt(actionslist[a].dots[d].y);
							actionslist[a].dots[d].y = parseInt(transDotX);
						}
					}
				}
			}
		}
		return JSON.stringify(arrayList);
	}
}

var demojsonstring = "{WFProps:{name:\'示例\',key:\'d7711292-90dd-4eb4-b14e-63a1e6af4f22\'},Nodes:{\"Node-1\":{id:-1,type:\'End\',text:{text:\'结束\'},attr:{x:\'11630\',y:\'1840\'}},\"Node1\":{id:1,type:\'Begin\',text:{text:\'开始\'},attr:{x:\'300\',y:\'2000\'}},\"Node2\":{id:2,type:\'Manual\',text:{text:\'活动1\'},attr:{x:\'1400\',y:\'1960\'}},\"Node3\":{id:3,type:\'Manual\',text:{text:\'活动2\'},attr:{x:\'2400\',y:\'1970\'}},\"Node4\":{id:4,type:\'Manual\',text:{text:\'活动3\'},attr:{x:\'3280\',y:\'1970\'}},\"Node5\":{id:5,type:\'Manual\',text:{text:\'活动4\'},attr:{x:\'4290\',y:\'1930\'}},\"Node6\":{id:6,type:\'Manual\',text:{text:\'活动5\'},attr:{x:\'5160\',y:\'1930\'}},\"Node7\":{id:7,type:\'Manual\',text:{text:\'活动6\'},attr:{x:\'6210\',y:\'1920\'}},\"Node8\":{id:8,type:\'Manual\',text:{text:\'活动7\'},attr:{x:\'7270\',y:\'1910\'}},\"Node9\":{id:9,type:\'Manual\',text:{text:\'活动8\'},attr:{x:\'8570\',y:\'1900\'}},\"Node10\":{id:10,type:\'Manual\',text:{text:\'活动9\'},attr:{x:\'10100\',y:\'1870\'}},\"Node11\":{id:11,type:\'Manual\',text:{text:\'活动10\'},attr:{x:\'2900\',y:\'160\'}},\"Node12\":{id:12,type:\'Manual\',text:{text:\'活动11\'},attr:{x:\'5410\',y:\'2970\'}},\"Node13\":{id:13,type:\'Manual\',text:{text:\'活动12\'},attr:{x:\'6880\',y:\'3010\'}},\"Node14\":{id:14,type:\'Manual\',text:{text:\'活动13\'},attr:{x:\'8440\',y:\'2950\'}},\"Node15\":{id:15,type:\'Manual\',text:{text:\'活动14\'},attr:{x:\'4190\',y:\'4460\'}},\"Node16\":{id:16,type:\'Manual\',text:{text:\'活动15\'},attr:{x:\'6200\',y:\'3720\'}},\"Node17\":{id:17,type:\'Manual\',text:{text:\'活动16\'},attr:{x:\'5380\',y:\'4680\'}},\"Node18\":{id:18,type:\'Manual\',text:{text:\'活动17\'},attr:{x:\'7880\',y:\'4540\'}},\"Node19\":{id:19,type:\'Manual\',text:{text:\'活动18\'},attr:{x:\'3240\',y:\'1140\'}},\"Node20\":{id:20,type:\'Manual\',text:{text:\'活动19\'},attr:{x:\'2510\',y:\'1150\'}}},Actions:{\"Action21\":{id:21,dots:[],from:\'Node1\',to:\'Node2\'},\"Action22\":{id:22,dots:[],from:\'Node2\',to:\'Node3\'},\"Action23\":{id:23,dots:[],from:\'Node3\',to:\'Node4\'},\"Action24\":{id:24,dots:[],from:\'Node4\',to:\'Node5\'},\"Action25\":{id:25,dots:[],from:\'Node5\',to:\'Node6\'},\"Action26\":{id:26,dots:[],from:\'Node6\',to:\'Node7\'},\"Action27\":{id:27,dots:[],from:\'Node7\',to:\'Node8\'},\"Action28\":{id:28,dots:[],from:\'Node8\',to:\'Node9\'},\"Action29\":{id:29,dots:[],from:\'Node9\',to:\'Node10\'},\"Action30\":{id:30,dots:[],from:\'Node10\',to:\'Node-1\'},\"Action31\":{id:31,dots:[],from:\'Node5\',to:\'Node12\'},\"Action32\":{id:32,dots:[],from:\'Node12\',to:\'Node13\'},\"Action33\":{id:33,dots:[],from:\'Node13\',to:\'Node14\'},\"Action34\":{id:34,dots:[],from:\'Node14\',to:\'Node10\'},\"Action35\":{id:35,dots:[],from:\'Node12\',to:\'Node16\'},\"Action36\":{id:36,dots:[],from:\'Node16\',to:\'Node14\'},\"Action37\":{id:37,dots:[],from:\'Node5\',to:\'Node15\'},\"Action38\":{id:38,dots:[],from:\'Node15\',to:\'Node5\'},\"Action39\":{id:39,dots:[],from:\'Node5\',to:\'Node17\'},\"Action40\":{id:40,dots:[],from:\'Node17\',to:\'Node18\'},\"Action41\":{id:41,dots:[],from:\'Node18\',to:\'Node10\'},\"Action42\":{id:42,dots:[],from:\'Node5\',to:\'Node11\'},\"Action43\":{id:43,dots:[],from:\'Node11\',to:\'Node2\'},\"Action44\":{id:44,dots:[],from:\'Node5\',to:\'Node19\'},\"Action45\":{id:45,dots:[],from:\'Node19\',to:\'Node20\'},\"Action46\":{id:46,dots:[],from:\'Node20\',to:\'Node2\'},\"Action47\":{id:47,dots:[],from:\'Node5\',to:\'Node2\'},\"Action48\":{id:48,dots:[],from:\'Node5\',to:\'Node10\'},\"Action49\":{id:49,dots:[],from:\'Node5\',to:\'Node4\'}}";

// 活动和变迁
function Activity(parentObject, param) {
	// this.text = param.text.text;
	this.Id = param.id;
	this.Name = "Node" + param.id;
	this.Type = param.type;
	this.IsBack = false;
	this.MathPath = [];
	// this.MathPath.length = 0;
	// this.name = "";
	this.BefRules = [];
	this.AftRules = [];
	this.BefActivityList = [];
	this.AftActivityList = [];
	this.X = parentObject.InitX;
	this.Y = parentObject.InitY;

	this.LevelX = -1;
	this.LevelY = -1;
	this.Y1 = ""; // Y1-Y2区间
	this.Y2 = "";
}

function Transition(parentObject, param) {
	this.Id = param.id;
	this.BefAct = GetActByName(param.from);
	this.AftAct = GetActByName(param.to);
	this.LevelX = -1; // befo 的LevelX
	this.LevelY = -1;
	this.Y1 = -1;
	this.Y2 = -1;

	// 获取节点
	function GetActByName(name) {
		var actFlag = "";
		for (var i in parentObject.ActivityList) {
			if (typeof parentObject.ActivityList[i] != 'function') {
				if (parentObject.ActivityList[i].Name == name) {
					actFlag = i;
					break;
				}
			}
		}
		if (actFlag != "") {
			return parentObject.ActivityList[actFlag];
		} else
			return null;

	}
}

function ActivityToMove(parentObject, param) {
	// this.text = param.text.text;
	this.Id = param.id;
	this.Name = "Node" + param.id;
	this.Type = param.type;
	this.IsBack = false;
	this.MathPath = [];
	// this.MathPath.length = 0;
	// this.name = "";
	this.BefRules = [];
	this.AftRules = [];
	this.BefActivityList = [];
	this.AftActivityList = [];
	// 修改
	this.X = param.attr.x;
	this.Y = param.attr.y;

	this.LevelX = -1;
	this.LevelY = -1;
	this.Y1 = ""; // Y1-Y2区间
	this.Y2 = "";
}
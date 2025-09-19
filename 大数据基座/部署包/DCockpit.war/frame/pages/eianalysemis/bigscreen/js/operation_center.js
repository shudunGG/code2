/**!
* 数字驾驶舱-操作中心
* date:2021-02-23
* author: xulei;
*/

'use strict';

/* global pageConfig, pageInfo, getNormoperaList, getMsglist */
(function (win, $) {

    Util.hidePageLoading();

    // 页面模板
    var redlightTmpl = $('#redlight-tmpl').html(),
        righttabTmpl = $('#right-tab-tmpl').html(),
		righttabTmpl1 = $('#right-tab-tmpl1').html(),
        latestFeedbackTmpl = $('#latest-feedback-tmpl').html(),
        startedTmpl = $('#started-tmpl').html(),
        feedbackItemTmpl = $('#feedback-item-tmpl').html(),
        normTmpl = $('#norm-tmpl').html(),
        normListTmpl = $('#norm-list-tmpl').html(),
        menuTmpl = '<ul id="contextMenu" class="mini-contextmenu">{{#list}}<li onclick="{{event}}">{{text}}</li>{{/list}}</ul>';

    // 缓存dom
    var $body = $('body'),
        $msgContent = $('#msg-content'),
        $operationNumTip = $('.operation-num-tip'),
        $msgOperation = $('#msg-operation'),
        $menuWarp = $('#menu-warp'),
        $stateCombo = $('#state-combo');

    var M = Mustache,
        todayTime = timeFormat(new Date(), 'yyyy-MM-dd'),
        // 全部右键菜单数据
        menuData = {
            feedback: {
                text: '指标需求反馈',
                event: 'indexDemandFeedback'
            },
            red: {
                text: '发起红灯',
                event: 'startRed'
            },
            supervise: {
                text: '发起督办',
                event: 'startSupervise'
            },
            warning: {
                text: '预警雷达',
                event: 'warningRadar'
            },
            like: {
                text: '点赞指标',
                event: 'likeIndex'
            },
            unfollow: {
                text: '取消关注',
                event: 'handleFollow(0)'
            },
            follow: {
                text: '关注指标',
                event: 'handleFollow(1)'
            },
            than: {
                text: '指标比对',
                event: 'indexThan'
            },
        };

    // 存放页面信息
    win.pageInfo = {
        sum: 0,
        lastSum: 0,
        keyword: '',
        rightType: 'accept', // 右侧tab类型
        rightState: 2, // 右侧tab选中状态
        curTab: { // 当前选中tab类型
            text: "红灯",
            type: "redlight"
        },
        normOrder: '0', // 更新时间排序方式
        normoperaData: [], // 存放关注指标数据
    };

    /* 页面工具方法 start */

    // 格式化时间
    function timeFormat(dateTime, format) {
        var _this = dateTime;
        var date = {
            'M+': _this.getMonth() + 1,
            'd+': _this.getDate(),
            'h+': _this.getHours(),
            'm+': _this.getMinutes(),
            's+': _this.getSeconds(),
            'q+': Math.floor((_this.getMonth() + 3) / 3),
            'S+': _this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (_this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length));
            }
        }
        return format;
    }

    // 处理数据
    function adjustMsgList(list) {
        var that = win;
        var addNum = 0;
        that.lastTime = '';
        $(list).each(function (index, item) {
            // 添加时间
            if (item.createTime && !item.isTime) {
                if (todayTime === item.createTime.substr(0, 10)) {
                    that.lastTime = item.createTime.substr(0, 10);
                } else {
                    if (that.lastTime !== item.createTime.substr(0, 10)) {
                        that.lastTime = item.createTime.substr(0, 10);
                        list.splice(index + addNum, 0, {
                            isTime: true,
                            time: timeToChn(that.lastTime)
                        });
                        addNum++;
                    }
                }
            }
            // 处理反馈显示
            if (item.feedbackCount && item.feedbackCount.toString() !== '0') {
                item.feedbackText = item.feedbackCount + '条反馈';
                item.hasFedback = true;
            } else {
                item.feedbackText = '<span class="warn">未反馈</span>';
            }
        });
    }

    // 转换时间为年月日
    var timeToChn = function (datatime) {
        var _arr = datatime.split('-');
        return _arr[0] + '年' + _arr[1] + '月' + _arr[2] + '日';
    };

    // 渲染最新反馈列表
    function renderMsgList(list, isRed) {
        var $msgLists = $('#msg-lists');
        $(list).each(function (index, item) {
            if (!item.isTime) {
                if (item.createTime.substr(0, 10) === todayTime) {
                    item.showTime = '今天' + item.createTime.substr(10, item.createTime.length);
                } else {
                    item.showTime = item.createTime;
                }
                item.isTime = false;
                if (item.content) {
                    // 对开头的div和p标签进行移除，效率低，后面有时间用正则优化
                    var _content = item.content;
                    if (_content.substr(0, 5) === '<div>') {
                        if (_content.substr(_content.length - 6, _content.length) === '</div>') {
                            _content = _content.substring(5, _content.length - 6);
                        }
                    } else if (_content.substr(0, 3) === '<p>') {
                        if (_content.substr(_content.length - 4, _content.length) === '</p>') {
                            _content = _content.substring(3, _content.length - 4);
                        }
                    }
                    item.content = _content;
                }
            }
        });
        $msgLists.html(Util.clearHtml(M.render(latestFeedbackTmpl, {
            list: list,
            isRed: isRed
        })));
        mini.parse();

        // 最多显示两行处理
        var $content = $('.msg-item-content', $msgLists);

        for (var i = 0, l = $content.length; i < l; i++) {
            $($content[i]).find('span').ellipsis({
                row: 2 // 设置超过 2 行省略
            });
        }
    }

    // 渲染右键菜单
    function renderContextMenu(guid) {
        var menu = [];
        // 添加默认选项
        menu.push(menuData.feedback);
        // 根据数据状态按需添加选项
        $.each(pageInfo.normoperaData, function (i, item) {
            if (item.guid === guid) {
                if (item.isStartRed) {
                    menu.push(menuData.red);
                }
                if (item.isStartSupervise) {
                    menu.push(menuData.supervise);
                }
                if (item.isWarningRadar) {
                    menu.push(menuData.warning);
                }
                if (item.isLikeIndex) {
                    menu.push(menuData.like);
                }
                if (item.isFollow) {// 关注指标信息
                    menu.push(menuData.follow);
                } else {
                    menu.push(menuData.unfollow);
                }
            }
        });
        // 添加默认选项
        menu.push(menuData.than);
        $menuWarp.html(M.render(menuTmpl, {
            list: menu
        }));
        mini.parse();
    }

    /* 页面工具方法 end */

    // 获取操作中心消息数量
    function getNewsCount() {
        Util.ajax({
            url: pageConfig.getNewsCountUrl,
            success: function (data) {
                $operationNumTip.addClass('hidden');
                Util.renderNum('count', data);

                // 修改最新反馈数量
                $.extend(pageInfo, data);
                var $msgUnread = $('#msg-unread');
                $msgUnread.text(pageInfo[pageInfo.curTab.type]);
                pageInfo.lastSum = pageInfo[pageInfo.curTab.type];
            }
        });
    }

    // 获取消息列表
    win.getMsglist = function () {
        var type = pageInfo.curTab.type;
        // 红灯信息
        if (type === 'redlight') {
            getComMsglist({
                url: pageConfig.getRedLightListUrl,
                data: {
                    infoType: 'redlight',
                }
            });
        } else if (type === 'problem') { // 问题反馈信息
            getComMsglist({
                url: pageConfig.getFeedbackListUrl,
                data: {
                    infoType: 'problem',
                }
            });
        } else if (type === 'warning') { // 事件预警信息
            getComMsglist({
                url: pageConfig.getWarningListUrl,
                data: {
                    infoType: 'warning',
                }
            });
        } else if (type === 'norm') { // 关注指标信息
            getNormoperaList();
        }
    };

    // 获取通用消息列表
    function getComMsglist(params) {
        // epoint.showLoading();
        // var param = $.extend({}, params.data, {
        //     type: pageInfo.rightType, // 类型：0：最新反馈；1： 我发起的；2：我接受的
        // });

        var param = {
			userGuid: '45f0c5f9-cad2-49e6-887d-b38dfcbc23de',
			pageNum: '0',
            pageIndex: '0',
			pageSize: '20'
		}
        if(params.data.infoType == 'redlight'){
			if(pageInfo.rightType == 'started'){
				$.extend(param, {
					type: '0',
					status: $stateCombo.val() || '0'
				})
			}
			if(pageInfo.rightType == 'accept'){
				$.extend(param, {
					type: '1',
					status: $stateCombo.val() || '0'
				})
			}
		}
		else if(params.data.infoType == 'problem'){
			$.extend(param, {
				ishandle: $stateCombo.val() || '2'
			})
		}
		else if(params.data.infoType == 'warning'){
			$.extend(param, {
				userguid: '45f0c5f9-cad2-49e6-887d-b38dfcbc23de',
			})
			
		}
        if (pageInfo.rightType !== 'unread') {
            // param.state = mini.get('state-combo').getValue() || 0; // 状态：0：全部状态；1： 已反馈；2：未反馈
            // param.keyword = mini.get('searchbox').getText() || ''; // 搜索关键字
            param.state = $stateCombo.val() || 0;
			param.keyword = $('#searchbox').val() || '';
        }
        pageInfo.rightState = param.state;
        // console.log(param);
        Util.ajax({
            url: params.url,
            data: {
				params:JSON.stringify(param)
			},
            success: function (data) {
                var $msgLists = $('#msg-lists');
                $msgLists.empty().scrollTop(0);
                // epoint.hideLoading();

                // 最新反馈隐藏筛选条件
                $msgOperation = $('#msg-operation');
                $msgOperation.addClass('hidden');
                if (pageInfo.rightType !== 'unread') {
                    $msgOperation.removeClass('hidden');
                }

                if(params.data.infoType == 'redlight'){
					if (data && data.redLightList.length) {
					 	$msgLists.removeClass('no-data');
					 	if(pageInfo.rightType == 'started'){
						
					 		$msgLists.html(
					 			Util.clearHtml(
					 				M.render($('#redlight-tmpl').html(), {
					 					list: data.redLightList,
					 					isStarted: true, // 我发起的
					 				})
					 			)
					 		);
					 	}
					 	else if(pageInfo.rightType == 'accept'){
					 		$msgLists.html(
					 			Util.clearHtml(
					 				M.render($('#redlight-tmpl').html(), {
					 					list: data.redLightList
					 				})
					 			)
					 		);
					 	}
					 } else {
					 	// 无数据
					 	$msgLists.addClass('no-data');
					 }
//                    $msgLists.html(
//                        Util.clearHtml(
//                            M.render($('#redlight-tmpl').html(), {
//                                list: [
//                                    {cockpitName: '人口增长', createTime: '2021-4-4', launchUserName: '系统管理员', content: '人口增长指标被发起红灯', isSupervise: 'true', isPriority: 'true'},
//                                    {cockpitName: '交通运行', createTime: '2021-4-3', launchUserName: '系统管理员', content: '交通运行指标被发起红灯', isSupervise: 'true', isPriority: 'true'},
//                                    {cockpitName: '本年GDP总额', createTime: '2021-4-3', launchUserName: '系统管理员', content: '本年GDP总额指标被发起红灯', isSupervise: 'true', isPriority: 'true'},
//                                    {cockpitName: '能源用量-供水', createTime: '2021-4-1', launchUserName: '系统管理员', content: '能源用量-供水指标被发起红灯', isSupervise: 'true', isPriority: 'true'},
//                                    {cockpitName: '能源用量-电力', createTime: '2021-4-1', launchUserName: '系统管理员', content: '能源用量-电力指标被发起红灯', isSupervise: 'true', isPriority: 'true'},
//                                ]
//                            })
//                        )
//                    );
					console.log(data.redLightList);
					renderMsgList(data.redLightList);
				}
				else if(params.data.infoType == 'problem'){
					if (data && data.cockpitFeedbackList.length) {
						$msgLists.removeClass('no-data');
						$msgLists.html(
							Util.clearHtml(
								M.render($('#feedback-tmpl').html(), {
									list: data.cockpitFeedbackList,
									isStarted: true, // 我发起的
								})
							)
						);
					} else {
						// 无数据
						$msgLists.addClass('no-data');
					}
				}
				else if(params.data.infoType == 'warning'){
					if (data && data.result.length) {
						$msgLists.removeClass('no-data');
						$msgLists.html(
							Util.clearHtml(
								M.render($('#warning-tmpl').html(), {
									list: data.result,
									isStarted: true, // 我发起的
								})
							)
						);
					} else {
						// 无数据
						$msgLists.addClass('no-data');
					}
				}
            }
        });
    }

    // 获取信息详情（用于渲染反馈列表）
    function getMsgDetail(guid, $el) {
        Util.ajax({
            url: pageConfig.getMsgDetailUrl,
            data: {
                infoType: pageInfo.curTab.type, // 信息类型
                guid: guid, // guid
            },
            success: function (data) {
                // 渲染红灯详情
                var count = data.feedbackList.length - 2 > 0 ? data.feedbackList.length - 2 : 0;
                $el.html(M.render(feedbackItemTmpl, {
                    list: data.feedbackList,
                    count: count
                }));
                $el.slideDown();
            }
        });
    }

    // 获取关注指标信息列表
    win.getNormoperaList = function () {
        epoint.showLoading();
        var param = {
            // order: mini.get('norm-combo').getValue(), // 排序方式：0：正序；1：倒序
            // keyword: mini.get('searchbox').getText(), // 搜索关键字
        };
        pageInfo.normOrder = param.order;
        // console.log(param);
        Util.ajax({
            url: pageConfig.getNormoperaListUrl,
            data: {
                params: JSON.stringify({
                    subscriber: '45f0c5f9-cad2-49e6-887d-b38dfcbc23de'
                })
            },
            success: function (data) {
                epoint.hideLoading();
                $('#normopera-list').html(M.render(normListTmpl, {
                    list: data.result
                }));

                pageInfo.normoperaData = data.result;

                // $('.normopera-item').bind('contextmenu', function (e) {
                //     var $this = $(this);
                //     pageInfo.normoperaGuid = $(this).data('guid');
                //     // 关注指标信息绑定右键菜单
                //     renderContextMenu(pageInfo.normoperaGuid);
                //     var menu = mini.get('contextMenu');

                //     menu.showAtPos(e.pageX, e.pageY);
                //     $this.addClass('active').siblings().removeClass('active');

                //     return false;
                // });

            }
        });
    };

    // 忽略消息
    function lgnoreMsg(guid, callback) {
    	console.log(111);
    	console.log(guid);
        Util.ajax({
            url: pageConfig.lgnoreMsgUrl,
            data: {
                guid: guid, // guid
                infoType: pageInfo.curTab.type, // 信息类别
            },
            success: function (data) {
                if (!data.text) {
                    if (callback) {
                        callback();
                    }
                } else {
                    epoint.showTips(data.text, {
                        state: 'error'
                    });
                }
            }
        });
    }

    // 页面事件
    function bindEvents() {
        // 切换左侧菜单
        $('.operation-tabs').on('click', '.operation-tab', function () {
            var $this = $(this),
                type = $this.data('type'),
                text = $this.data('text');

            if (!$this.hasClass('active')) {
                $this.addClass('active').siblings().removeClass('active');
                pageInfo.curTab = {
                    text: text || '信息',
                    type: type,
                };

                // 渲染右侧
                pageInfo.keyword = mini.get('searchbox') ? mini.get('searchbox').getText() : '';
                // 关注指标信息
                if (type === 'norm') {
                    $msgContent.html(M.render(normTmpl, pageInfo));
                    mini.parse();
                    getNormoperaList();
                } else if(type === 'redlight'){
                	$msgContent.html(M.render(righttabTmpl1, pageInfo));
                } else { // 通用列表
                    $msgContent.html(M.render(righttabTmpl, pageInfo));
                }

                // 默认选中第一个(最新反馈)
                setTimeout(function () {
                    var index = 0;
                    // if (pageInfo.rightType === 'unread') {
                    //     index = 0;
                    // } else if (pageInfo.rightType === 'started') {
                    //     index = 1;
                    // } else if (pageInfo.rightType === 'accept') {
                    //     index = 2;
                    // }
                    $('.msgopera-tab').eq(index).trigger('click');
                }, 30);
            }
        });

        // 切换右侧tab
        $body.on('click', '.msgopera-tab', function () {
            var $this = $(this),
                ref = $this.data('ref');

            getNewsCount();
            if (!$this.hasClass('active')) {
                $this.addClass('active').siblings().removeClass('active');

                // 渲染右侧
                pageInfo.rightType = ref;
                getMsglist();
            }
        });

        // 反馈
        $body.on('click', '.feedback-btn', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item');
            $item.addClass('isfeedback');
        });

        // 取消
        $body.on('click', '.cancel-btn', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item');
            $item.removeClass('isfeedback');
        });

        // 确认反馈
        $body.on('click', '.affirm-feedback', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item'),
                guid = $item.data('guid'),
                textarea = mini.get($item.find('.feedback-textarea')[0]),
                $detail = $item.find('.feedback-detail');

            // 获取反馈信息
            var feedbackContent = textarea.getValue();
            if (feedbackContent) {
                // ajax
                Util.ajax({
                    url: pageConfig.setFeedbackUrl,
                    data: {
                        guid: guid, // guid
                        content: feedbackContent, // 反馈内容
                        infoType: pageInfo.curTab.type, // 信息类别
                    },
                    success: function (data) {
                        if (!data.text) {
                            epoint.showTips('反馈成功', {
                                state: 'success'
                            });

                            // 隐藏输入框
                            $item.removeClass('isfeedback');

                            // 清空输入框
                            textarea.setValue('');

                            // 刷新反馈详情
                            getMsgDetail(guid, $detail);
                            $detail.removeClass('showall');
                        } else {
                            epoint.showTips(data.text, {
                                state: 'error'
                            });
                        }
                    }
                });

            }
        });

        // 催办
        $body.on('click', '.supervise-btn:not(.js-disabled)', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item'),
                guid = $item.data('guid');
            // ajax
            Util.ajax({
                url: pageConfig.urgeUrl,
                data: {
//                    guid: guid, // guid
//                    infoType: pageInfo.curTab.type, // 信息类别
                	params: JSON.stringify({
                    	redLightGuid: guid,
                    	userGuid:'45f0c5f9-cad2-49e6-887d-b38dfcbc23de'
                    })
                },
                success: function (data) {
                	console.log(data);
                    if (!data.text) {
                        epoint.showTips('已催办', {
                            state: 'success'
                        });
                        // 禁用按钮
                        $this.addClass('js-disabled');
                        setTimeout(function () {
                            mini.get($this[0]).setEnabled(false);
                        }, 1000);
                    } else {
                        epoint.showTips(data.text, {
                            state: 'error'
                        });
                    }
                }
            });
        });

        // 优先处理
        $body.on('click', '.priority-btn:not(.js-disabled)', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item'),
                guid = $item.data('guid');
            
            // ajax
            Util.ajax({
                url: pageConfig.priorityUrl,
                data: {
//                    guid: guid, // guid
//                    userGuid:'45f0c5f9-cad2-49e6-887d-b38dfcbc23de',
//                    infoType: pageInfo.curTab.type, // 信息类别
                    params: JSON.stringify({
                    	redLightGuid: guid,
                    	userGuid:'45f0c5f9-cad2-49e6-887d-b38dfcbc23de'
                    })
                },
                success: function (data) {
                    if (!data.text) {
                        epoint.showTips('已协调优先处理', {
                            state: 'success'
                        });
                        // 禁用按钮
                        $this.addClass('js-disabled');
                        setTimeout(function () {
                            mini.get($this[0]).setEnabled(false);
                        }, 1000);
                    } else {
                        epoint.showTips(data.text, {
                            state: 'error'
                        });
                    }
                }
            });
        });

        // 忽略本条消息
        $body.on('click', '.lgnore-btn', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item'),
                $lists = $this.closest('.msg-lists'),
                guid = $item.data('guid'),
                $next = $item.next(),
                $prev = $item.prev();

            // ajax
            lgnoreMsg(guid, function () {
                epoint.showTips('已忽略', {
                    state: 'success'
                });

                // 删除dom（刷新dom）
                $item.remove();
                // 判断当天无其他消息，则删除时间
                if (($next.hasClass('msg-time-item') && $prev.hasClass('msg-time-item')) || $prev.hasClass('msg-time-item') && $next.length === 0) {
                    $prev.remove();
                }
                // 无数据
                if ($lists.find('.msg-item').length === 0) {
                    $lists.addClass('no-data');
                }
            });
        });

        // 查看最新反馈后设置为已读
        $body.on('click', '.js-lgnore', function () {
            var $this = $(this),
                $item = $this.closest('.msg-item'),
                guid = $item.data('guid');

            // ajax
            lgnoreMsg(guid);
        });

        // 清空所有未读消息
        $body.on('click', '.msg-clearall', function () {
            // ajax
            lgnoreMsg('', function () {
                epoint.showTips('已清空所有未读消息', {
                    state: 'success'
                });
                // 刷新数量
                getNewsCount();
                // 如果当前选中最新反馈，需要刷新列表
                if (pageInfo.rightType === 'unread') {
                    getMsglist();
                }
            });
        });

        // 鼠标移入显示反馈详情
        var timer1 = null,
            timer2 = null;
        $body.on('mouseenter', '.msg-item.hasfedback', function () {
            var $this = $(this).closest('.msg-item'),
                guid = $this.data('guid'),
                $detail = $this.find('.feedback-detail');

            if (timer1) {
                clearTimeout(timer1);
            }
            if (timer2) {
                clearTimeout(timer2);
            }
            timer1 = setTimeout(function () {
                $this.siblings().find('.feedback-detail').slideUp();
                if (!$detail.hasClass('inited')) {
                    $detail.addClass('inited');

                    // 获取信息详情
                    getMsgDetail(guid, $detail);
                } else {
                    $detail.stop(true, false).slideDown();
                }

            }, 500);

        }).on('mouseleave', '.msg-item.hasfedback', function () {
            var $this = $(this),
                $detail = $this.find('.feedback-detail');
            if (timer2) {
                clearTimeout(timer2);
            }
            timer2 = setTimeout(function () {
                $detail.slideUp();
            }, 500);

        });

        // 点击查看更多反馈
        $body.on('click', '.feedback-more-btn', function () {
            var $this = $(this),
                $detail = $this.closest('.feedback-detail');

            $detail.toggleClass('showall');
        });

        // 取消高亮
        $body.on('click', function () {
            $('.normopera-item').removeClass('active');
        });

    }

    // 初始化页面
    function initPage() {
        getNewsCount();
        bindEvents();

        // 默认选中第一个(红灯信息)
        $('.operation-tab').eq(0).trigger('click');
    }

    initPage();

})(this, jQuery);

// 页面公共方法
(function (win) {
    // 指标需求反馈
    win.indexDemandFeedback = function () {
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发自行参照开发
        Util.openTopLayer({
            title: '指标需求反馈',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './start_supervise.html?guid=' + pageInfo.normoperaGuid,
        });
    };

    // 发起红灯
    win.startRed = function () {
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发参照原型开发
        Util.openTopLayer({
            title: '发起红灯',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './start_supervise.html?guid=' + pageInfo.normoperaGuid,
        });
    };

    // 发起督办
    win.startSupervise = function () {
        Util.openTopLayer({
            title: '发起督办',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './start_supervise.html?guid=' + pageInfo.normoperaGuid,
        });
    };

    // 预警雷达
    win.warningRadar = function () {
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发参照原型开发
        Util.openTopLayer({
            title: '预警雷达',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './start_supervise.html?guid=' + pageInfo.normoperaGuid,
        });
    };

    // 点赞指标
    win.likeIndex = function () {
        Util.ajax({
            url: pageConfig.likeNormUrl,
            data: {
                guid: pageInfo.normoperaGuid, // 指标guid
            },
            success: function (data) {
                if (!data.text) {
                    epoint.showTips('点赞指标成功', {
                        state: 'success'
                    });

                    // 刷新列表
                    getNormoperaList();
                } else {
                    epoint.showTips(data.text, {
                        state: 'error'
                    });
                }
            }
        });
    };

    // 关注指标
    win.handleFollow = function (type) {
        Util.ajax({
            url: pageConfig.followNormUrl,
            data: {
                guid: pageInfo.normoperaGuid, // 指标guid
                type: type, // 操作类型：0：取消关注；1：关注指标
            },
            success: function (data) {
                var text = '';
                if (type.toString() === '0') {
                    text = '取消关注成功';
                } else {
                    text = '关注成功，可至消息中心查看';
                }
                if (!data.text) {
                    epoint.showTips(text, {
                        state: 'success'
                    });

                    // 刷新列表
                    getNormoperaList();
                } else {
                    epoint.showTips(data.text, {
                        state: 'error'
                    });
                }
            }
        });

    };

    // 指标比对
    win.indexThan = function () {
        // TODO：此处仅为示例弹窗，具体弹窗请业务开发参照原型开发
        Util.openTopLayer({
            title: '指标比对',
            id: '',
            width: '6.2rem',
            height: '5.25rem',
            url: './start_supervise.html?guid=' + pageInfo.normoperaGuid,
        });
    };
})(this);
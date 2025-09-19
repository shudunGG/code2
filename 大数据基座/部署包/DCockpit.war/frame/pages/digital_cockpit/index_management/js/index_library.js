/**!
 * 部门标签页
 * date:2021-03-15
 * author: guohanyu;
 */

'use strict';

/* global pageConfig,tooltip */
(function (win, $) {
    var navInfoTmpl = $('#nav-info-tmpl').html(),
        leftNavTmpl = $('#left-nav-tmpl').html(),
        labelItemTmpl = $('#label-item-tmpl').html(),
        labelDetailTmpl = $('#label-detail-tmpl').html(),
        $labelList = $('#label-list'),
        $leftNav = $('#left-nav'),
        $legend = $('#legend'),
        $more = $('#more'),
        $basket = $('#basket'),
        searchName = $('#search-name'),
        search = $('#search');

    var leftNavSwiper; //声明一个变量放初始化后的swiper

    // 对应状态值
    var statuArr = [{
        status: 0,
        text: '未申请',
    }, {
        status: 1,
        text: '审批中',
    }, {
        status: 2,
        text: '已申请',
    }];

    // 参数
    var param = {
        nav_id: 1, // 当前左侧选中部门id
        label_id: '', // 标签id
        label_status: 0, // 当前选中标签状态  0：未申请 1：审批中 2: 已有权限
        search_name: '', // 要搜索标签名称
        status: '', // 下拉框状态 0：未申请 1：审批中 2: 已有权限 4：全部
        search_key: '', // 左侧搜索值
        type:''
    };

    // 关闭树形框
    win.onCloseClick = function (e) {
        var obj = e.sender;
        obj.setText('');
        obj.setValue('');
    };

    // 获取标签列表数据
    /** 
     * @param {boolean} is_more  是否是加载更多
     */
    function getLabels(is_more) {
        var item_is_more = is_more || false;
        Util.ajax({
            url: pageConfig.getLabelsData,
            data: {
                params: JSON.stringify({
                    data: param
                })
            }
        }).done(function (data) {
            var labels = data.labels;
            $.each(labels, function (i, item) {
                item.statusClass = 'status' + item.status;
                item.mright = Math.round(Math.random() * 30) + 'px';
                item.mleft = Math.round(Math.random() * 30) + 'px';
                // item.transY = 20 - Math.round(Math.random() * 40) + 'px';
            });

            // 是否是加载更多
            if (item_is_more) {
                $labelList.append(Mustache.render(labelItemTmpl, {
                    list: data.labels
                }));
            } else {
                $labelList.html(Mustache.render(labelItemTmpl, {
                    list: data.labels
                }));
            }

            // 插入两个div限制一下顶部排列
            if ($labelList.find('.left-top').length === 0 && $labelList.find('.right-top').length === 0) {
                $labelList.prepend('<div class="left-top"></div>').prepend('<div class="right-top"></div>');
            }

            // 排版(放弃)
            // $.each($('.label-item:lt(20)'), function (n, label) {
            //     console.log($(label).text())
            //     console.log($(label).position().top);
            //     if($(label).position().left < 250 && $(label).position().top > 91) { 
            //         $(label).css({
            //             border: '2px solid red',
            //             transform: 'translateX(-20px)'
            //         });
            //     }
            // });
        });
    }

    // 获取左侧导航数据
    var getLeftNav = function () {
        Util.ajax({
            url: pageConfig.getLeftNavData,
            data: {
                params: JSON.stringify({
                    param: param
                })
            }
        }).done(function (data) {
            $leftNav.html(Mustache.render(leftNavTmpl, data));
            // 渲染完成后,初始化swiper
            // 左侧导航轮播
            leftNavSwiper = new Swiper('#left-nav', {
                direction: 'vertical',
                slidesPerView: 'auto',
                mousewheel: true,
                spaceBetween: 20,
            });
            // 触发第一条点击
            // 默认选中第一个主体
            $leftNav.find('.nav-item').eq(0).click();
        });
    };

    // 获取标签详情数据
    function getLabelDetail(_this) {
        Util.ajax({
            url: pageConfig.getLabelDetailData,
            data:  {
                params: JSON.stringify({
                    data: param
                })
            },
        }).done(function (data) {
            data.id = param.label_id;
            data.status = param.label_status;
            $.each(statuArr, function (i, item) {
                if (item.status === data.status) {
                    data.statusText = item.text;
                    data.statusClass = 'status' + item.status;
                    return;
                }
            });
            var html = Mustache.render(labelDetailTmpl, {
                detail: data
            });
            // 获取标签详细信息
            tooltip.pop(_this, html, {
                // hideDelay: 300000,
                showDelay: 0,
                offsetX: -60,
                offsetY: 100,
            });
        });
    }

    // 左侧导航点击事件
    $leftNav.on('click', '.nav-item', function () {
        var $this = $(this);
        param.nav_id = $this.data('id');
        $this.addClass('active').siblings().removeClass('active');
        getLabels();
    }).on('mouseover', '.nav-item', function () {
        var _this = this,
            id = $(_this).data('id');

        // 获取主体详细信息
        Util.ajax({
            url: pageConfig.getNavInfo,
            data: {
                params: JSON.stringify({
                    id: id
                })
            },
        }).done(function (data) {
            var html = Mustache.render(navInfoTmpl, {
                info: data
            });
            tooltip.pop(_this, html, {
                // hideDelay: 300000,
                showDelay: 0,
                offsetX: -60,
                offsetY: 55,
            });
        });
    });

    // 图例点击
    $legend.on('click', '.legend-item', function () {
        var $this = $(this),
            status = $this.data('status');
        $this.toggleClass('active');
        $this.hasClass('active') ? $labelList.find('.status' + status).removeClass('hidden') : $labelList.find('.status' + status).addClass('hidden');
    });

    // 标签 tooltip
    $labelList.on('mouseover', '.label-item', function () {
        var _this = this;
        param.label_id = $(this).data('id');
        param.label_status = $(this).data('status');
        getLabelDetail(_this);
    });

    // 标签操作
    $('body').on('click', '.label-btn', function () {
        var $this = $(this),
            func = $this.data('func'),
            $labelItem = $('.label-item[data-id="' + param.label_id + '"]'),
            $labelDetail = $(this).parents().find('.label-detail'),
            name = $labelDetail.find('.name').text(),
            type = $labelDetail.find('.type').text(),
        	normtype = $labelDetail.find('.normtype').text();
        param.type = type;
        switch (func) {
            // 申请
            case 'apply':
                epoint.confirm('是否申请“' + name + '”？', '操作确认', function () {
                		epoint.openDialog('申请引用',
            					"frame/pages/eianalysemis/cockpit/cockpitnormlibrary/cockpitnormlibraryapply?guid="
            							+ param.label_id+"&type="+type, function(){
                			getLabels();
                		}, {
            						'width' : 800,
            						'height' : 500
            					});

                    // 切换为已审批中状态
                    $labelDetail.removeClass('status0').removeClass('status1').removeClass('status2').addClass('status1');
                }, function () {
                    //  console.log('取消按钮被点击');
                });
                break;

                // 加入标签篮
            case 'add':
            	var offset = $basket.offset(),
                flyer = $labelItem.clone();

            // 已加入状态
            /*if ($this.hasClass('add')) {
                // 执行 取消加入标签篮 相关操作

                $this.toggleClass('add');
                $this.text('加入标签篮');
                return;
            }*/

            var basket = 0;
            if('加入申请篮' == $this.text()){
                basket = 0;
            }
            else if('取消加入申请篮' == $this.text()){
                basket = 1;
            }
            param.basket = basket;
            Util.ajax({
                url: pageConfig.getBasket,
                data: {
                    params: JSON.stringify({
                        data: param
                    })
                }
            }).done(function (data) {
            	if(data.msg){
            		epoint.alert(data.msg);
            		return;
            	}
                if(basket == 0){
                    $this.text('取消加入申请篮');
                    flyer.fly({
                        start: {
                            left: $labelItem.offset().left,
                            top: $labelItem.offset().top,
                        },
                        end: {
                            left: offset.left,
                            top: offset.top,
                            width: 0,
                            height: 0
                        },
                        onEnd: function () {
                            flyer.remove();
                            /*$basket.addClass('add');
                            setTimeout(function () {
                                $basket.removeClass('add');
                            }, 600);
                            $this.toggleClass('add');*/

                            $('.num').html(data);
                            // 执行 加入标签篮 相关操作
                        }
                    });

                }else if(basket == 1){
                    epoint.alert('取消加入申请篮成功'
                        ,'提示信息',function (action) {
                            $('.num').html(data);
                        }
                        );
                }
            });


            break;

                // 预览标签值
            case 'view':
            	if(type == '0'){
            		epoint.openDialog(name, './cockpitnormlibrarylist.html?guid='+param.label_id, function () {
            			
            		}, {
            			width: 1000,
            			height: 530,
            			param: param
            		});      
            	}
            	if(type == '1'){

								if (normtype&&normtype == '5') {
									epoint.alert("kylin指标不能查看指标结果！", '', '',
											'info');
									return;
								}
								epoint.openDialog('样例数据',
										"./cockpitnormlibraryresultview?guid="
												+ param.label_id, null, {
											'width' : 1000,
											'height' : 550
										});
            		
	
            	}
                break;

                // 点赞
            case 'up':
                $this.toggleClass('up');
                if ($this.hasClass('up')) {
                    $this.text('取消点赞');
                } else {
                    $this.text('点赞');
                }
                break;

                // 评价
            case 'evaluate':
                epoint.openDialog('评价详情', './evaluate.html', function () {

                }, {
                    width: 925,
                    height: 690,
                    param: param
                });
                break;

                // 收藏
            case 'collect':
                $this.toggleClass('collect');
                if ($this.hasClass('collect')) {
                    $this.text('取消收藏');
                } else {
                    $this.text('收藏');
                }
                break;

                // 查看实体数据
            case 'entity':
                epoint.openDialog('评价详情', './entity_data.html', function () {

                }, {
                    width: 1000,
                    height: 600,
                    param: param
                });
                break;
                
            case 'cancel':
            	 Util.ajax({
                     url: pageConfig.cancelApply,
                     data: {
                         params: JSON.stringify({
                             data: param
                         })
                     }
                 }).done(function (data) {
                	 getLabels();
                	 epoint.alert('取消申请成功');
                 });
            	break;

            default:
                break;
        }

    });

    // 加载更多
    $more.on('click', function () {
        getLabels(true);
    });

    // 搜索
    search.on('click', function () {
        param.search_name = searchName.val();
        param.searchName = searchName.val();
        $searchResult.hide();
        getLabels();
    });
    // 失去焦点
    searchName.on('blur', function () {
        $searchResult.hide();
    });

    // 状态下拉框
    var $status = mini.get('status');
    $status.on('valuechanged', function (data) {
        param.status = data.selected.id;
        if (param.status === 4) {
            $legend.find('.legend-item').addClass('active');
        } else {
            $legend.find('.legend-item').eq(param.status).addClass('active').siblings().removeClass('active');
        }
        getLabels();
    });

    var $searchResult = $('#s-results');
    // 左侧搜索
    $('.search-box').on('input', '.search-input', function () {
        param.search_key = $.trim($('.search-input').val());
        if (param.search_key) {
            $searchResult.show();
            getSearchListData();
        } else {
            $searchResult.hide();
        }
    });

    $searchResult.on('mousedown', '.result-item', function () {
        $('.search-input').val($(this).text());
        $searchResult.hide();
        // 重新加载左侧部门数据
        param.searchName = $(this).text();
        // $.each($leftNav.find('.swiper-slide'), function (i, item) {
        //     if ($(item).data('id') === id && leftNavSwiper) {
        //         leftNavSwiper.slideTo(i);
        //         $(item).addClass('active').siblings().removeClass('active');
        //         return;
        //     }
        // });
        getLabels();
    });

    // 搜索列表
    function getSearchListData() {
        Util.ajax({
            type: 'post',
            url: pageConfig.getSearchList,
            data: {
                params: JSON.stringify({
                    data: param
                })
            }
        }).done(function (data) {
            data = data.list;
            var html = '';
            var key = param.search_key;

            $.each(data, function (i, item) {
                var newItem = item.value.replace(key, '<i>' + key + '</i>');
                html += '<li class="result-item" data-id="' + item.id + '">' + newItem + '</li>';
            });
            $searchResult.html(html);
        });
    }

    var initPage = function () {
        // 获取左侧列表数据并触发一次点击
        getLeftNav();
    };
    
    $basket.on('click', function () {
        epoint.openTopDialog('申请篮',
            "frame/pages/eianalysemis/cockpit/cockpitnormlibrary/cockpitnormlibraryapplyworkflow"
            , function (param) {
                getLabels();
                getBasket();
            }, {
                'width': 1200,
                'height': 550
            });
    });
    
    function getBasket(){
    	param.basket = '';
    	Util.ajax({
            url: pageConfig.getBasket,
            data: {
                params: JSON.stringify({
                    data: param
                })
            }
        }).done(function (data) {
            $('.num').html(data);
        });
    }
    

    $('#myapply').on('click', function () {
        epoint.openTopDialog('我的申请',
            "frame/pages/eianalysemis/cockpit/cockpitnormlibrary/cockpitnormlibrarymyapply"
            , function (data) {
                getLabels();
                Util.ajax({
                    url: pageConfig.getMyApplyCount,
                    data: {
                        params: JSON.stringify({
                            data: param
                        })
                    }
                }).done(function (data) {
                	console.log(data)
                    $('.tipvalue').html(data);
                });
            }, {
                'width': 1200,
                'height': 550
            });
    });
    
    initPage();
    Util.ajax({
        url: pageConfig.getBasket,
        data: {
            params: JSON.stringify({
                data: param
            })
        }
    }).done(function (data) {
        $('.num').html(data);
    });
    Util.ajax({
        url: pageConfig.getMyApplyCount,
        data: {
            params: JSON.stringify({
                data: param
            })
        }
    }).done(function (data) {
    	console.log(data)
        $('.tipvalue').html(data);
    });
})(this, jQuery);
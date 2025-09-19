/*!
 *“聚通用”智慧政府大数据管理平台新点数据平台 (比对源选择) 脚本
 *author:guli
 *date:2020-11-12
 *version:9.4.1
 */
(function(win, $) {
  var tip = new mini.ToolTip();
	    tip.set({
	        target: document,
	        selector: '[data-tooltip]',
	        autoHide: true
	    });
	var template = $('#init-tpl').html();
	var $kindsTtInner = $('.kinds-tt-inner'), $kindsCt = $('.kinds-ct');
	kind = {
		id : 1
	};

	var $kindsMove = $('.kinds-move'), $kindsLeftArrow = $('.kinds-left-arrow'), $kindsRightArrow = $('.kinds-right-arrow');
	var move = {
		id : 0
	};

	var $crashWay = $('.crash-way');
	// 页面初始化
	Util.ajax({
		url : initUrl,
		type : 'POST'
	}).done(function(data) {
		if (data.list.length > 0) {
			renderKind(data.kind, '.kinds-tt-inner');
			var length = data.detail.length, ratio = Math.ceil(length / 12), width1 = 100 * ratio + '%', width2 = 100 / ratio + '%';
			if (length > 12) {
				$kindsRightArrow.addClass('usable');
				nextClick(ratio);
			}
			$kindsMove.css('width', width1);
            var $dom = $(' <div class="kinds-move-items l"></div>');
            $kindsMove.append($dom);
            // for (var i = 0; i < ratio; i++) {
            //     var $dom = $(' <div class="kinds-move-items l"></div>');
            //     $kindsMove.append($dom);
            // }
			var $kindsMoveItems = $('.kinds-move-items');
            // $kindsMoveItems.css('width', width2);
            // var list = [];
            // for (var j = 0; j < ratio; j++) {
            //     var group = [];
            //     for (var i = 0; i < 12; i++) {
            //         if (12 * j + i == parseInt(length)) {
            //             break;
            //         }
            //         group.push(data.detail[12 * j + i]);
            //     }
            //     list.push(group);
            // }
            // $kindsMoveItems.each(function(i, item) {
            //     var $cur = $(this);
            //     renderMove(list[i], $cur);
            //     $('.kinds-move-item').eq(0).addClass('active');
            // });
            renderMove(data.detail, $kindsMoveItems);
            /////////////////////////
            updateMove();

			$('.option-outer').html(Mustache.render(template, data));
			if (data.list.length > 0) {
				$('.choose').find('.option').find('.option-detail').show();
			}
			if (data.list.length > 2) {
				$('.choose').find('.option').find('.option-delete').show();
			}

			var $items = $('.choose').find('.option-ct-txt-inner');
			$items.each(function(i, item) {
				var $cur = $(item), text = $cur.text();
				if (text.length > 5) {
					var newText = text.substring(0, 5) + '...';
					$cur.text(newText);
				}
			});

			var $options = $('.choose').find('.option');
			$options.each(function(i, item) {
				var $cur = $(item), num = $cur.find('.option-ct-txt-inner').length;
				if (num > 20) {
					$cur.find('.item-arrow').show();
				} else {
					$cur.find('.item-arrow').hide();
				}
			});

			$('.choose-next').addClass('usable');
			drag();

			var way = data.way;
			if (way == '内关联') {
				$crashWay.eq(0).addClass('active');
			} else {
				$crashWay.eq(1).addClass('active');
			}
			itemMore();
		} else {
			updateKind();
			updateMove();
			// 选择碰撞方式
			$crashWay.eq(0).addClass('active');
			itemMore();
		}
	});

    // 滚动条
	    $('.choose-outer').niceScroll({
	        cursorcolor: "#5971a4",
	        cursorborder: "none",
	        cursorwidth: 6,
	        autohidemode: true
	    });


	// 渲染种类名称
	var TPL = $('#kind-tpl').html();

	function renderKind(data, target) {
		if (!data || !data.length)
			return $(target).empty();
		var html = $.map(data, function(item) {
			return Mustache.render(TPL, item);
		}).join('');
		$(target).html(html);
	}

	function updateKind() {
		Util.ajax({
			url : kindUrl,
			type : 'POST'
		}).done(function(data) {
			renderKind(data.list, '.kinds-tt-inner');
			var $initActive = $kindsTtInner.children().first();
			console.log($initActive);
			$initActive.addClass('active');
			clickDown(data);
		});
	}
	// updateKind();
	$kindsTtInner.on('click', '.kind-tt', function() {
		var $cur = $(this);
		$cur.addClass('active');
		$cur.siblings().removeClass('active');
		kind.id = $cur.data('id');
		updateMove();
	});

    // updateKind();
	$("body").on('click', '.my-search', function() {
		var $cur = $(this);
		kind.id = $('.kind-tt.active').data('id');
		kind.searchVal = mini.get("my-textbox").getValue();
		updateMove();
	}).on('change', '.my-textbox', function() {
		var $cur = $(this);
		kind.id = $('.kind-tt.active').data('id');
		kind.searchVal = mini.get("my-textbox").getValue();
		updateMove();
	});

	// 种类名称下拉收起
	var $kindsTtArrow = $('.kinds-tt-arrow');

	function clickDown(data) {
		if (data.list.length > 14) {
			$kindsTtArrow.addClass('usable');
			$kindsTtArrow.on('click', function() {
				$(this).toggleClass('up');
				$kindsTtInner.toggleClass('height');
				$kindsCt.toggleClass('padding');
			});
		}
	}

	// 渲染种类分类详情
	var TPL1 = $('#move-tpl').html();

	function renderMove(data, target) {
		if (!data || !data.length)
			return $(target).empty();
		var html = $.map(data, function(item) {
			return Mustache.render(TPL1, item);
		}).join('');
		$(target).html(html);
	}

	function updateMove() {
		Util.ajax({
			url : moveUrl,
			type : 'POST',
			data : kind
		}).done(function(data) {
			$kindsMove.removeClass('move');
			$kindsMove.css('left', 0);
			$kindsRightArrow.removeClass('usable');
			$kindsLeftArrow.removeClass('usable');
			var length = data.list.length, ratio = Math.ceil(length / 12), width1 = 100 * ratio + '%', width2 = 100 / ratio + '%';
			if (data.list.length > 12) {
				$kindsRightArrow.addClass('usable');
				nextClick(ratio);
			}
			$kindsMove.css('width', width1);
			for (var i = 0; i < ratio; i++) {
				var $dom = $(' <div class="kinds-move-items l"></div>');
				$kindsMove.append($dom);
			}
			var $kindsMoveItems = $('.kinds-move-items');
			$kindsMoveItems.css('width', width2);
			var list = [];
			for (var j = 0; j < ratio; j++) {
				var group = [];
				for (var i = 0; i < 12; i++) {
					if (12 * j + i == parseInt(length)) {
						break;
					}
					group.push(data.list[12 * j + i]);
				}
				list.push(group);
			}
			$kindsMoveItems.each(function(i, item) {
				var $cur = $(this);
				renderMove(list[i], $cur);
				$('.kinds-move-item').eq(0).addClass('active');
			});
			$('.kinds-move-item').on('click', function() {
				$('.kinds-move-item').removeClass('active');
				$(this).addClass('active');
				move.id = $(this).data('id');
			});
			drag();
		});
	}
	// updateMove();

	function nextClick(ratio) {
		var index = 0;
		$kindsRightArrow.on('click', function() {
			$kindsMove.addClass('move');
			$kindsLeftArrow.addClass('usable');
			index++;
			if (index > ratio - 1) {
				index = ratio - 1;
			}
			if (index > ratio - 2) {
				$kindsRightArrow.removeClass('usable');
			} else {
				$kindsRightArrow.addClass('usable');
			}
			var left = -index * 100 + '%';
			$kindsMove.css('left', left);
		});

		$kindsLeftArrow.on('click', function() {
			index--;
			if (index < 0) {
				index = 0;
			}
			if (index == 0) {
				$kindsLeftArrow.removeClass('usable');
				$kindsRightArrow.addClass('usable');
			} else {
				$kindsLeftArrow.addClass('usable');
				$kindsRightArrow.addClass('usable');
			}
			var left = -index * 100 + '%';
			$kindsMove.css('left', left);
		});
	}

	// 拖动种类分类详情 对换位置
	// drag();

	function drag() {
		// 拖动
		$('.choose').find(".kinds-move-item").draggable({
			revert : "invalid",
			helper : "clone",
			cursor : "move",
			stop : function(event, ui) {

			},
			appendTo : 'body'
		});

		// 放置
		$('.choose').find(".kinds-move-item").droppable({
			accept : ".kinds-move-item",
			drop : function(e, ui) { // 放置结束回调
				var dragHtml = ui.draggable.html(), $draggableItem = $(this), dorpHmtl = $draggableItem.html();
				$draggableItem.html(dragHtml);
				ui.draggable.html(dorpHmtl);
			}
		});

		$('.choose').find(".option-ct").droppable({
			accept : ".kinds-move-item",
			hoverClass : "ui-state-active",
			drop : function(e, ui) {
				var $droppable = $(this), $draggable = ui.draggable, item = {
					id : ui.draggable.data('id'),
					condition:ui.draggable.data('condition'),
					guid:ui.draggable.data('guid')
				}, name = $draggable.find('.kinds-move-tt').text(), $name = $droppable.siblings('.option-tt').find('.option-name');
				var condition = JSON.stringify(item.condition);
				$name.text(name);
				$droppable.siblings('.option-tt').find('.option-detail').show();
				$droppable.addClass('active');
				updateItem(item, $droppable);
				$droppable.parents('.option').attr('data-name', item.id);
				$droppable.parents('.option').attr('data-condition', condition);
				$droppable.parents('.option').attr('data-guid', item.guid);
				nextNum = 1;
				next();
			}
		});
	}

	var TPL2 = $('#item-tpl').html();

	function renderItem(data, target) {
		if (!data || !data.length)
			return $(target).empty();
		var html = $.map(data, function(item) {
			return Mustache.render(TPL2, item);
		}).join('');
		$(target).html(html);
	}

	function updateItem(item, $droppable) {
		Util.ajax({
			url : itemUrl,
			type : 'POST',
			data : item
		}).done(function(data) {
			renderItem(data.list, $droppable);
			ellipsis($droppable);
			if (data.list.length > 20) {
				$droppable.siblings('.item-arrow').show();
			} else {
				$droppable.siblings('.item-arrow').hide();
			}
		});
	}

	// 超过五个字显示省略号
	function ellipsis($droppable) {
	    if($droppable){
            var $items = $droppable.find('.option-ct-txt-inner');
            $items.each(function(i, item) {
                var $cur = $(item), text = $cur.text();
                if (text.length > 5) {
                    var newText = text.substring(0, 5) + '...';
                    $cur.text(newText);
                }
            });
		}
	}

	// 点击显示更多数据项
	function itemMore() {
		$('.options').find('.item-arrow').on('click', function() {

			var $cur=$(this);

			$cur.siblings('.option-ct').toggleClass('height');
			$cur.toggleClass('active');

		});
	}

	// 点击新增比对源
	$('.option-add').on(
			'click',
			function() {
				$options = $('.option');
				var newLength = $options.length + 1, $optionOuter = $('.option-outer');
				$dom = $('<div class="option" data-name="">' + '<p class="option-tt">' + '这里是<span class="option-name">数据源' + newLength + '</span>' + '<span class="option-detail">查看详情</span>' + '<span class="option-delete"></span>' + '</p>'
						+ '<div class="option-ct">' + '<div class="option-ct-init">' + '<img src="./images/img/option-init-img.png" alt="" class="option-int-img">' + '<p class="option-init-tip">请从上方拖拽需要比对的数据项至此处</p>' + '</div>' + '</div>'
						+ '<span class="item-arrow"></span>' + '</div>');
				$optionOuter.append($dom);
				drag();
				if (newLength > 1) {
					$options.find('.option-delete').show();
					$dom.find('.option-delete').show();
				}
			});

	// 点击删除比对源
	$('.option-outer').on('click', '.option-delete', function() {
		$(this).parents('.option').remove();
		var $newOptions = $('.option');
		if ($newOptions.length < 3) {
			$newOptions.find('.option-delete').hide();
		}
		nextNum = 0;
		next();
	});

	// 点击碰撞方式
	$crashWay.on('click', function() {
		$crashWay.removeClass('active');
		$(this).addClass('active');
	});
    $('.crash').on('click', '.crash-icon', function() {
        $crashWay.removeClass('active');
        if ($(this).hasClass('inner-link')) {
            $crashWay.eq(0).addClass('active');
        } else {
            $crashWay.eq(1).addClass('active');
        }
    });
	// 下一步按钮

	function next() {
		$('.option').each(function(i, item) {
			var $cur = $(item);
			if ($(item).find('.option-ct-txt').length > 0) {
				nextNum++;
			}
		});
		if (nextNum > 1) {
			$('.choose-next').addClass('usable');
		} else {
			$('.choose-next').removeClass('usable');
		}
		;
	}
	var rowguid = Util.getUrlParams('rowguid');
	// 点击下一步按钮
	$('.choose-next').on('click', function() {
		if ($('.choose-next').hasClass('usable')) {
			var resultdata = {};
			var dataArr = [];
			$('.option').each(function(i, item) {
				var $cur = $(item), name = $cur.attr('data-name'), guid = $cur.attr('data-guid'), condition = $cur.attr('data-condition');
				if (name.length > 0) {
					var data = {
						id : name,
						title : $cur.find('.option-name').text(),
						guid : guid,
						condition : condition
					}
					dataArr.push(data);
				}
			});
			var kind = $('.kind-tt.active').attr('data-id'), crash = $('.crash-way.active').find('.crash-way-name').text();
			resultdata.tables = dataArr;
			resultdata.kind = kind
			resultdata.way = crash
			// 存储
			epoint.execute('dxpguidemodelaction.saveStep', '', [ resultdata, '1' ],function(data) {
				 if(data.msg=='保存成功'){
                    window.sessionStorage.setItem(rowguid + "_step1",JSON.stringify(resultdata));
				    Util.openSelfWin('./relevance?rowguid=' + rowguid);
                }else{
                    epoint.showTips(data.msg);
                }
            });
		}
	});

	$('.choose-save').on('click', function() {
		var resultdata = {};
		var dataArr = [];
		$('.option').each(function(i, item) {
			var $cur = $(item), name = $cur.attr('data-name'), guid = $cur.attr('data-guid'), condition = $cur.attr('data-condition');
			if (name.length > 0) {
				var data = {
					id : name,
					title : $cur.find('.option-name').text(),
					guid : guid,
					condition : condition
				}
				dataArr.push(data);
			}
		});
		var kind = $('.kind-tt.active').attr('data-id'), crash = $('.crash-way.active').find('.crash-way-name').text();
		resultdata.tables = dataArr;
		resultdata.kind = kind
		resultdata.way = crash
		epoint.execute('dxpguidemodelaction.saveStep', '', [ resultdata, '1' ], function(data) {
			epoint.showTips(data.msg);
		});
	});
	
	// 点击跳转详情页
	$('.option-outer').on('click', '.option-detail', function() {
		var tableGuid=$(this).parents('.option').attr("data-guid");
		var tableId=$(this).parents('.option').attr("data-name");
		var condition = $(this).parents('.option').attr("data-condition");
		var $option = $(this).parents('.option');
		epoint.openTopDialog('表筛选', "./guidmodeltablefilter?modelguid="+rowGuid+"&tableguid="+tableGuid+"&tableid="+tableId, function(e){
			if(e!='close'){
			    $option.attr("data-condition",e);
			}
		}, {
			width : 1000,
			height : 600,
			param: {
				condition:condition
			}
		});
		
	});

	function openKindConfig(){
		epoint.openDialog('数据分类管理','modelga/setting/tabletypelist',function(){
			updateKind();
			updateMove();
		});
	}
	window.openKindConfig=openKindConfig;

})(this, this.jQuery);
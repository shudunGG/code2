var idList = [];
var slideClass = [];
(function($, idList, slideClass){
	
	var _this;

	function ToolBar (opts) {
		_this = this;

		if(_this == $) {
            //防止多次绑定同一个dom
            if(idList.indexOf(opts.leftBar) > -1) {
                delete opts.leftBar;
            } else {
                idList.push(opts.leftBar);
            }

			return new ToolBar(opts);
		}
        
        _this.status = {
            mouseLocs: [], //最新的三个鼠标位置
            itemLoc: {},    //item的上下左右角坐标
            isEnd: true,    //同级面板是否收缩完毕
            isOut: true,    //是否移出item
            isLeftBarOut: true, //是否移出整个侧边栏
            isActive: true,  //激活子面板是否结束
            isActiveItem: true  //激活ul块是否结束
           // itemTimer: null
        };

		var DEFAULT = {
			MOUSE_LOCS_TRACKED: 3,
			DELAY: 200,		//显示隐藏动画的时间

			slideIn: 'slide-in-',	//显示动画类名
			slideOut: 'slide-out-',	//隐藏动画类名
			active: 'active',		//激活各个面板和tab按钮状态的类名，（共用同一个类名）

			level: 'level',			//面板的data-level 层级属性 data-*,可自定义
			ref: 'ref',				//tab按钮上表示id的data属性 data-ref，用于与下一面板中的ul块的class关联的
			hasChild: 'haschild',	//tab按钮上用来表示是否有子菜单的 data属性 data-haschild （小写）

			//下面为常用替换参数		
			menu: '#menu',	//用来触发侧边栏的类名
			menuEvent: 'mouseover', //用来触发侧边栏的类名上的事件

			CHANGEDELAY: 200, //三角区域停留时间触发切换
			leftBar: '#left-bar',
			leftBarFirst: 'left-bar-first',	//侧边栏第一个面板类名
            leftBarContent: 'left-bar-content', //侧边栏面板中的ul类名
			barItem: 'bar-item',	//侧边栏所有面板的公共类名
			item: 'common-item',	//侧边栏单个面板中tab按钮的类名

			hiddenAll: $.noop,   //所有面板隐藏后的回调方法
			hidden: $.noop   //单个面板隐藏后的回调方法
		};
		_this.config = $.extend(DEFAULT, opts);

		_this.$leftBar = $(opts.leftBar);

        if(_this.$leftBar.length) {
            _this.initEvent();
        }

        //记录切换的动画类名
        if(!slideClass.length) {
            slideClass.push(_this.config.slideIn);
            slideClass.push(_this.config.slideOut);
        } else {
            if(slideClass.indexOf(_this.config.slideIn) == -1 && slideClass.indexOf(_this.config.slideOut)) {
                slideClass.push(_this.config.slideIn);
                slideClass.push(_this.config.slideOut);
            }
        }

	}

    //初始化dom操作
    ToolBar.prototype.initEvent = function() {
        
        _this.$leftBarFirst = $('.' + _this.config.leftBarFirst, _this.$leftBar);
        _this.$barItem = $('.' + _this.config.barItem, _this.$leftBar);

        //记录鼠标的最新位置
        $(document).off('mousemove').on('mousemove', function(e) {
            //console.log(' x---'+ e.pageX+ '---------y-------'+ e.pageY );
            
            _this.status.mouseLocs.push({ x: e.pageX, y: e.pageY });

            if (_this.status.mouseLocs.length > _this.config.MOUSE_LOCS_TRACKED) {
                _this.status.mouseLocs.shift();
            }
        });

        //第一列菜单划过，标记进入侧边栏
        _this.$leftBarFirst.off( _this.config.menuEvent).on( _this.config.menuEvent, function() {
            
            _this.status.isLeftBarOut = true;
        });

        //只显示当前面板的后面一个
        _this.$barItem.on('mouseover', function() {
            var $this = $(this),
                $next = $this.next(),
                $nextAll = $next.nextAll('.' + _this.config.active);

            if ($nextAll.length) {
                _this.deActiveDi($nextAll);
            }
        });

        var enterTimer = null;
        _this.$leftBar.on('mouseenter', '.' + _this.config.item, function(e) {
            
            var $item = $(this);

            enterTimer && clearTimeout(enterTimer);

            if (_this.status.isOut) {

                //不在三角形中直接激活item对应的ul块
                _this.activateItem($item);
                
                //在从后面隔两面板往该tab所在列移动，
                //滑过无子面板后移动到有子面板的tab时，
                //判断是否已经显示，没显示则显示
                //时间设定800ms，因为最长有200*3个动画时间，加上一些dom操作时间，约为800
                //_this.status.itemTimer && clearTimeout(_this.status.itemTimer);

                // _this.status.itemTimer = setTimeout(function() {

                //     if($item.data('haschild') && !$item.parent().parent().next().hasClass('active')) {
                //         _this.activateItem($item);
                //     }
                // }, 800);
                
            } else {

                //如果在三角形中则停留显示
                _this.calcItemLoc($item);

                enterTimer = setTimeout(function() {

                    var currentLoc = _this.status.mouseLocs[_this.status.mouseLocs.length - 1];
                    if(_this.adjustInItem(currentLoc)) {
                        _this.status.isOut = true;
                        _this.activateItem($item);
                    }

                }, _this.config.CHANGEDELAY);
            }
        }).on('mouseleave', '.' + _this.config.item, function(e) {
            //鼠标移出该item
            //判断是否在三角形区域内
            
            //如果item对应的ul还没显示完，则不做任何操作
            if(!_this.status.isActiveItem) {
                return false;
            }

            _this.status.isOut = false;

            var $item = $(this),
                $itemparent = $item.parent(),
                $parentRoom = $itemparent.parent(),
                $next = $parentRoom.next(),

                itemLeftVal = + $item.offset().left,
                UlWidth = + $itemparent.outerWidth();

            if (e.pageX >= itemLeftVal + UlWidth) {
                //下一面板
                _this.status.isOut = true;
            } else if (e.pageX < itemLeftVal) {
                //上一面板
                _this.status.isOut = true;
            } else {

                /*if(e.pageY > parseInt(ulTop) + parseInt(ulHeight)){
                    //移出ul块则不添加active
                    //有问题，如果下面没有了，而右边有，滑动事件判断冲突了
                    //console.log('移出了')
                    $item.removeClass( _this.config.active);
                    _this.deActiveDi($next);
                } else {
                }*/

                if ($next.length) {
                    //离开items时的鼠标最后三个位置
                    var copyMouseLocs = _this.status.mouseLocs.concat([]);

                    var nextLeftLoc = _this.calcNextLeftLoc($next), //下一面板的左上角和左下角坐标
                        leaveLoc = { x: e.pageX, y: e.pageY + 5 }, //移出item时候的坐标
                        start = copyMouseLocs[0],
                        end = copyMouseLocs[copyMouseLocs.length -1],
                        isInDelta = _this.adjustIsInDelta(leaveLoc, nextLeftLoc, start, end); //是否在三角形中

                    _this.status.isOut = isInDelta ? false : true;

                } else {
                    _this.status.isOut = true;
                }

            }
        }).on('mouseleave', function() {
            //离开left-bar
            var $barItem = $('.' + _this.config.barItem + '.'+_this.config.active);

            _this.deActiveDi($barItem);
            _this.status.isLeftBarOut = false;
            _this.status.mouseLocs = [];
        });

        // $('.top-name').off('mouseover').on('mouseover',function() {
        //     console.log(1);

        //     var $barItem = $('.' + _this.config.barItem + '.'+_this.config.active);

        //     _this.deActiveDi($barItem);
        //     _this.status.isLeftBarOut = false;
        //     _this.status.mouseLocs = [];
        // });
    };

	//激活包含ul的面板
	var activeTimer = null,
        slideTime = null;
	ToolBar.prototype.activate = function($selector, level, callback) {

        _this.status.isActive = false;

        //移出面板后快速移入如果已经移出了则不进行任何操作
        if(! _this.status.isLeftBarOut) {
            return false;
        }

        activeTimer && clearTimeout(activeTimer);

        //如果缩回的动画结束则执行展开的操作
		if( _this.status.isEnd ) {
            
			var _hasActive = $selector.hasClass( _this.config.active ),
                classStr = '';

			for(var i = 0,len = slideClass.length; i< len; i++) {
                classStr += slideClass[i] + level+ ' ';
             }
            //确保将原先的动画类名清除
            $selector.removeClass(classStr);

			if( !_hasActive ) {

                $selector.addClass( _this.config.active + ' ' + _this.config.slideIn + level );
                
                slideTime && clearTimeout(slideTime);

                slideTime = setTimeout(function() {

                    $selector.removeClass( _this.config.slideIn + level );
                }, _this.config.DELAY);

                if(typeof callback == 'function') {
                    callback();
                }
                _this.status.isActive = true;
			} else {

                //如果已经显示，则直接返回
                if(typeof callback == 'function') {
                    callback();
                }
                _this.status.isActive = true;

                return false;
            }
		} else {

			//如果动画没有结束
            //解决滑动过快，有些菜单没有子菜单导致对应的面板错位
        	activeTimer = setTimeout(function(){
        		_this.activate($selector, level, callback);
        	}, 16.7);
		}
	};

    //激活item对应的ul块
    var deTimer = null;
    ToolBar.prototype.activateItem = function($item) {
        
        _this.status.isActiveItem = false;
        
        deTimer && clearTimeout(deTimer);

        if (_this.status.isOut && _this.status.isLeftBarOut) {

            var ref = $item.data( _this.config.ref ),
                hasChild = $item.data( _this.config.hasChild ),
                $parentRoom = $item.parent().parent(), //该选项最外层的面板
                level = parseInt($parentRoom.data( _this.config.level )) + 1, //取得下一层级是第几个
                $next = $parentRoom.next(), //当前鼠标所在的下一面板
                $nextAll = $next.nextAll('.bar-item'),
                $leftBarContentAll = $('.' + _this.config.leftBarContent, $next),
                $leftBarContents = $('.' + ref, $next), //当前选项对应的下一面板中的ul块
                active = _this.config.active,
                item = _this.config.item;

            //ul块中有选项则显示
            if (hasChild) {
                
                _this.activate($next, level,function() {

                    if(!$leftBarContents.hasClass(active)) {

                        $leftBarContents.addClass(active)
                            .siblings().removeClass(active);

                        $('.' + item + '.' + active, $leftBarContents).removeClass(active);

                        _this.status.isActiveItem = true;

                         }
                });
                    //_this.status.itemTimer && clearTimeout(_this.status.itemTimer);
                        
           } else {

                //无则隐藏其他面板
                var isHasNext = $next.next().hasClass(active),
                    $paramDom = null;

                $paramDom = isHasNext ? $parentRoom.nextAll('.bar-item.active') : $next;

                if( _this.status.isActive) {
                     _this.deActiveDi($paramDom);
                 } else {
                    deTimer = setTimeout(function() {
                         _this.deActiveDi($paramDom);
                        
                    }, 16.7);
                 }

                 _this.status.isActiveItem = true;
            }
            
            $item.addClass(active).siblings().removeClass(active);
        }
    };

	//递归隐藏所有显示的
    ToolBar.prototype.deActiveDi = function($selectors, callback) {

        var _index = $selectors.length - 1,
        	$selector = $($selectors[_index]),
            level = $selector.data( _this.config.level );

        if ($selector.hasClass( _this.config.active )) {

            _this.status.isEnd = false;
            $selector.addClass(_this.config.slideOut + level);

            var timer = setTimeout(function() {

                $selector.removeClass( _this.config.active + ' ' + _this.config.slideOut + level)
                    .find('.' + _this.config.leftBarContent + '.' + _this.config.active)
                    .removeClass(_this.config.active)
                    .find('.'+ _this.config.item + '.' + _this.config.active)
                    .removeClass(_this.config.active);

                //$('.' + _this.config.item, $selector).removeClass( _this.config.active );

                //当前面板后面的最后一个动画执行
                if (_index === 0) {
                    //最后一个面板动画结束
                    var temTime = setTimeout(function() {

                    	_this.status.isEnd = true;
                    	clearTimeout(temTime);
                    }, _this.config.DELAY);
                    
                    if(typeof callback == 'function') {
                    	callback();
                    }

                    _this.config.hidden($selector);

                    return;
                }

                var selectorArr = $selectors.toArray();

                selectorArr.pop();
                _this.deActiveDi($(selectorArr),callback);

            }, _this.config.DELAY);
        }
    };

    ToolBar.prototype.slope = function(a,b) {
    	return Math.abs(b.y - a.y) / Math.abs(b.x - a.x);
    };

    //判断是否在三角形中方法一
    ToolBar.prototype.adjustIsInDelta = function(leaveLoc, nextLeftLoc, start, end) {
        
        var preRatio, lastRatio, ret,
            TOLERANT = 5;   //容错常量，允许用户有5px的手抖位移误差

        if (leaveLoc.x > end.x) {
            //第一第四象限
            if (leaveLoc.y > end.y) {
                //向下
                preRatio = _this.slope(nextLeftLoc.lowerLeft, {x: end.x - TOLERANT, y: end.y});
                lastRatio = _this.slope(nextLeftLoc.lowerLeft, leaveLoc);

            } else {
                //向上
                preRatio = _this.slope(nextLeftLoc.upperLeft, {x: end.x - TOLERANT, y: end.y});
                lastRatio = _this.slope(nextLeftLoc.upperLeft, leaveLoc);
            }
            ret = lastRatio >= preRatio ? true : false; 

        } else {
            //第二第三象限
            ret = false;
        }
        return ret;
    };

    //计算下一面板的左侧坐标
    ToolBar.prototype.calcNextLeftLoc = function($next) {
        return {
            upperLeft: {
                x: $next.offset().left,
                y: $next.offset().top
            },
            lowerLeft: {
                x: $next.offset().left,
                y: $next.offset().top + $next.height()
            }
        };
    };

    //计算所在选项的角坐标
    ToolBar.prototype.calcItemLoc = function($item) {
        var _liWidth = $item.outerWidth(),
            _liHeight = $item.outerHeight(),
            _liOffset = $item.offset();

        _this.status.itemLoc = {
            upperLeft: {
                x: _liOffset.left,
                y: _liOffset.top
            },
            upperRight: {
                x: _liOffset.left + _liWidth,
                y: _liOffset.top
            },
            lowerLeft: {
                x: _liOffset.left,
                y: _liOffset.top + _liHeight
            },
            lowerRight: {
                x: _liOffset.left + _liWidth,
                y: _liOffset.top + _liHeight
            }
        };
    };

    //判断是否在单个tab中
    ToolBar.prototype.adjustInItem = function(lastLoc) {
    	lastLoc = lastLoc || {x:0,y:0};
        var x = lastLoc.x,
            y = lastLoc.y,
            itemLoc = _this.status.itemLoc;

        if (!itemLoc.upperRight || !itemLoc.upperRight.x) {
            return false;
        }
        if (x < itemLoc.upperRight.x &&
        	 x > itemLoc.upperLeft.x &&
        	 y < itemLoc.lowerLeft.y &&
        	 y > itemLoc.upperLeft.y) {

            return true;
        }
    };

	$.ToolBar = ToolBar;

})(jQuery, idList, slideClass);
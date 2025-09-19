/**!
 * 数字驾驶舱
 * date:2021-02-18
 * author: qxy
 */
'use strict';
/* global pageConfig */

(function(win, $) {

    Util.hidePageLoading();
    //驾驶舱数据
    var cockpitguid = "",
        cockpitname = "",
        newCockpitguid = "";
    var isWater = "0";
    function getCockpitInfo(){
        Util.ajax({
            url: pageConfig.getCockpitInfo,
            async: false,
            data: {
                params: JSON.stringify({
                    cockpitguid: newCockpitguid
                })
            },
            success: function(data) {
            	console.log(data);
                if(data){
                    data = data.result
                    cockpitname = data.name;
                    if(!cockpitname){
                        Util.getSafeLocation().href = pageConfig.login;
                    }
                    document.getElementById("cockpitname").innerHTML = cockpitname;
                    if(newCockpitguid){
                        cockpitguid = newCockpitguid;
                    }
                    else{
                        cockpitguid = data.id;
                    }
                    if(data.mgrUrl){
                        document.getElementById("mgrUrl").innerHTML = '后台管理';
                        document.getElementById("mgrUrl").href = data.mgrUrl;
                    }
                    if ($(win).width() >= 4000) {
                        document.getElementById("mgrUrl").innerHTML = '';
                        document.getElementById("cockpitname").innerHTML = '';
                    }
                    if("1"== data.hasWater && isWater=="0"){
                    	var wartertest;
                    	if(data.userName){
                    		wartertest = data.userName;
                    	}
                    	else{
                    		wartertest = cockpitname;
                    	}
                        watermark({ watermark_txt: wartertest })//传入动态水印内容 
                    }
                }
                $('#loc-now').html('<span>' + cockpitname + '</span>');
            }
        });
    }
    getCockpitInfo();

    var $noticeNum = $('#notice-num'),
        searchWrap = $('#search-wrap'),
        $searchInput = $('#search-input'),
        $searchResult = $('#search-result'),
        $locNow = $('#loc-now'),
        $locClarify = $('.loc-clarify'),
        $locWhole = $('.loc-whole'),
        $locArea = $('#loc-area'),
        $iframe = $('iframe'),
        $swiperNav = $('#swiper-nav'), //一级导航栏
        $navLevel = $('.nav-level'), //二级导航栏
        $NavWrapper = $('#nav-wrapper'), //一级导航栏内部
        swiperSpace, //swiper滑块间隔
        curSkin = '', //当前皮肤
        layerArea = [];

    if ($(win).width() >= 4000) {
        swiperSpace = -93;
        curSkin = 'bigscreen';
        layerArea = ['4.72rem', '3.007rem'];
    } else {
        swiperSpace = 0;
        curSkin = 'system';
        layerArea = ['9.28rem', '6.2rem'];
    }

    // 与位置弹窗相关的变量
    var nowLocLevel = 0,
        isMidClose = false, //是否中途关闭过该窗口
        locLevel;

    // swiper相关数据
    var swiper, swiperSub;
    
    // nav数据
    var nowNavLevel = 0, // 当前导航处于几级
        secLevelIndex, //二级栏目当前被选中的索引
        navArr = [];
    
    function loadNavigator(){
        // 加载导航栏
        Util.ajax({
            url: pageConfig.getNavigator,
            async: false,
            data: {
                params: JSON.stringify({
                    cockpitguid: newCockpitguid || cockpitguid,
                    resolution: window.screen.width + '*' + window.screen.height
                })
            },
            success: function(data) {
                if(data){
                    navArr = JSON.parse(data.result);
                }
            }
        });
        // 默认显示一级导航栏
        var navItem = '';
        $.each(navArr, function(i, e) {
            navItem += '<div class="swiper-slide"><a href="javascript:;" data-id="' + e.id + '" class="nav-item" data-src="' + e.url + '">' + e.name + '</a></div>';
        });
        $NavWrapper.empty().append(navItem);

        // 加载swiper
        swiper = new Swiper('#swiper-nav', {
            slidesPerView: 6,
            simulateTouch: false,
            prevButton: '.swiper-prev',
            nextButton: '.swiper-next'
        });
        // 判断swiper轮播按钮是否显示
        if (navArr.length > 6) {
            $('.swiper-btn').removeClass('hidden');
        }
    }
    loadNavigator();

    // 导航栏点击事件
    $('.nav').on('click', '.nav-item', function() {
        var $this = $(this),
            itemId = $this.data('id'),
            itemUrl = $this.data('src'),
            parentId = $this.data('pid'),
            txt = $this.text();
        // 高亮当前模块
        $('.nav').find('.nav-item').removeClass('active');
        $this.addClass('active');
        if (swiperSub) {
            swiperSub.slideTo(0);
        }
        // 通过判断当前导航项是否具有该data()属性，来判断该项是否具有子项
        if (!itemUrl || itemUrl == 'undefined') {
            $('.level-parent').text(txt);
            $.each(navArr, function(eleIndex, e) {
                console.log(e.id);
                if (e.id === itemId) {
                    nowNavLevel = 1;
                    $('.level-parent').data('id', itemId).attr('data-id', itemId);
                    var pLen = e.projectList.length, // 二级导航栏中无分类专题的长度
                        cLen = e.cateList.length, // 二级导航栏中专题分类的长度
                        subNavItem = ''; // 二级导航栏的item
                    if (pLen !== 0) {
                        for (var i = 0; i < pLen; i++) {
                            subNavItem += '<div class="swiper-slide"><a href="javascript:;" data-src="' + e.projectList[i].url + '" data-vid="' + e.projectList[i].id + '" class="nav-item">' + e.projectList[i].name + '</a></div>';
                        }
                    }
                    if (cLen !== 0) {
                        for (var j = 0; j < cLen; j++) {
                            subNavItem += '<div class="swiper-slide"><a href="javascript:;" data-id="' + e.cateList[j].id + '" data-pid="' + e.id + '" data-src="' + e.cateList[j].url + '" class="nav-item">' + e.cateList[j].name + '</a></div>';
                        }
                    }
                    // 隐藏一级导航，显示二级导航
                    $swiperNav.addClass('hidden');
                    $navLevel.removeClass('hidden');
                    $('#subNavWrapper').empty().append(subNavItem);
                    // 加载二级导航的swiper
                    swiperSub = new Swiper('#swiper-sub', {
                        slidesPerView: 4,
                        spaceBetween: swiperSpace,
                        simulateTouch: false,
                        prevButton: '.swiper-prev',
                        nextButton: '.swiper-next'
                    });
                    // 判断swiper轮播按钮是否显示
                    if (pLen + cLen > 4) {
                        $('.sub-swiper-btn').removeClass('hidden');
                    } else {
                        $('.sub-swiper-btn').addClass('hidden');
                    }
                    // 判断高亮页面
                    if (pLen !== 0) {
                        $('#subNavWrapper').find('.swiper-slide:first a').trigger('click');
                    } else if(cLen !== 0) {
                        if(e.cateList[0].url){
                            $('#subNavWrapper').find('.swiper-slide:first a').addClass('active');
                            $iframe.attr('src', e.cateList[0].url).data('id', e.cateList[0].id);
                            visitProject(e.cateList[0].id);
                        }
                        else{
                            $('#subNavWrapper').find('.swiper-slide:first a').addClass('active');
                            $iframe.attr('src', e.cateList[0].projectList[0].url).data('id', e.cateList[0].projectList[0].id);
                            visitProject(e.cateList[0].projectList[0].id);
                        }
                        
                    } else {
                        $iframe.attr('src', e.url).data('id', e.id);
                    }
                } else if (e.id === parentId) {
                    secLevelIndex = $this.parent().index();
                    nowNavLevel = 2;
                    var thirdNavItem = '',
                        amountItem = 0;
                    for (var index = 0; index < e.cateList.length; index++) {
                        if (e.cateList[index].id === itemId) {
                            $.each(e.cateList[index].projectList, function(projectIndex, ele) {
                                thirdNavItem += '<div class="swiper-slide"><a href="javascript:;" data-src="' + ele.url + '" data-vid="' + ele.id + '" class="nav-item">' + ele.name + '</a></div>';
                                amountItem++;
                            });
                            $('#subNavWrapper').empty().append(thirdNavItem);
                            if (swiperSub) {
                                swiperSub.destroy(false);
                                swiperSub = new Swiper('#swiper-sub', {
                                    slidesPerView: 4,
                                    simulateTouch: false,
                                    prevButton: '.swiper-prev',
                                    nextButton: '.swiper-next'
                                });
                            }
                            if (amountItem > 4) {
                                $('.sub-swiper-btn').removeClass('hidden');
                            } else {
                                $('.sub-swiper-btn').addClass('hidden');
                            }
                        }
                    }
                    $('#subNavWrapper').find('.swiper-slide:first a').trigger('click');
                }
            });
            if (swiperSub) {
                swiperSub.onResize();
            }
        } else {
            // 若当前导航项不具备子项
            if ($iframe.attr('src') !== $this.data('src')) {
                $iframe.attr('src', $this.data('src'));
                visitProject($this.data('vid'));
            }
        }
    });

    // 二级导航栏返回事件
    $navLevel.on('click', '.level-parent', function() {
        var id = $(this).data('id');
        if (nowNavLevel === 1) {
            $navLevel.addClass('hidden');
            $swiperNav.removeClass('hidden');
            $.each(navArr, function(i, e) {
                if (e.id === id) {
                    // defaultHigh($swiperNav, i);
                    $('.nav').find('.nav-item').removeClass('active');
                    $swiperNav.find('.swiper-slide').eq(i).find('a').addClass('active');
                }
            });
            nowNavLevel = 0;
        } else {
            $.each(navArr, function(index, e) {
                if (e.id === id) {
                    $('.level-parent').text(e.name);
                    var pLen = e.projectList.length, // 二级导航栏中无分类专题的长度
                        cLen = e.cateList.length, // 二级导航栏中专题分类的长度
                        subNavItem = ''; // 二级导航栏的item
                    if (pLen !== 0) {
                        for (var i = 0; i < pLen; i++) {
                            subNavItem += '<div class="swiper-slide"><a href="javascript:;" data-src="' + e.projectList[i].url + '" data-vid="' + e.projectList[i].id + '" class="nav-item">' + e.projectList[i].name + '</a></div>';
                        }
                    }
                    if (cLen !== 0) {
                        for (var j = 0; j < cLen; j++) {
                            subNavItem += '<div class="swiper-slide"><a href="javascript:;" data-id="' + e.cateList[j].id + '" data-pid="' + e.id + '" data-src="' + e.cateList[j].url + '" class="nav-item">' + e.cateList[j].name + '</a></div>';
                        }
                    }
                    $('#subNavWrapper').empty().append(subNavItem);
                    // 判断swiper轮播按钮是否显示
                    if (pLen + cLen > 4) {
                        $('.sub-swiper-btn').removeClass('hidden');
                    } else {
                        $('.sub-swiper-btn').addClass('hidden');
                    }
                    $('#subNavWrapper').find('.swiper-slide').eq(secLevelIndex).find('a').addClass('active');
                    // $iframe.attr('src', e.cateList[secLevelIndex - pLen].projectList[0].url).data('id', e.cateList[secLevelIndex - pLen].projectList[0].id);
                    // visitProject(e.cateList[secLevelIndex - pLen].projectList[0].id);
                }
            });
            nowNavLevel = 1;
            swiperSub.onResize();
        }
    });

    // 封装默认高亮与显示的方法
    function defaultHigh($swiper, index) {
        if(navArr.length < 1){
            return;
        }
        $('.nav').find('.nav-item').removeClass('active');
        $swiper.find('.swiper-slide').eq(index).find('a').addClass('active');
        if (navArr[index].projectList.length !== 0) {
            if ($iframe.attr('src') !== navArr[index].projectList[0].url) {
                $iframe.attr('src', navArr[index].projectList[0].url);
            }
        } else if (navArr[index].cateList.length !== 0 && navArr[index].cateList[0].projectList.length !== 0){
            if ($iframe.attr('src') !== navArr[index].cateList[0].projectList[0].url) {
                $iframe.attr('src', navArr[index].cateList[0].projectList[0].url);
            }
        } else {
            if ($iframe.attr('src') !== navArr[index].url) {
                $iframe.attr('src', navArr[index].url);
            }
        }
    }
    defaultHigh($swiperNav, 0);


    // 当前时间
    var getnow = function() {

        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) month = '0' + month;
        var day = now.getDate();
        if (day < 10) day = '0' + day;
        var hours = now.getHours();
        if (hours < 10) hours = '0' + hours;
        var minutes = now.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        var seconds = now.getSeconds();
        if (seconds < 10) seconds = '0' + seconds;
        var week = new Array('日', '一', '二', '三', '四', '五', '六');
        var weekday = week[now.getDay()];

        $('#datetime').text(year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' 星期' + weekday);

        setTimeout(function() {
            getnow();
        }, 1000);
    };
    getnow();

    // 请求用户信息
    Util.ajax({
        url: pageConfig.getUserInfo,
        data: {
            params: JSON.stringify({
                cockpitguid:''
            })
        },
        success: function(data) {
            // 消息数量
            // if (data.notices === 0) {
            //     $noticeNum.hide();
            // } else {
            //     $noticeNum.text(data.notices);
            // }
            data = data.result;
            // data.initLoc = '广西壮族自治区/南宁市';
            // 欢迎
            $('#welcome').empty().html('欢迎您！<span class="dep" title="' + data.userdep + '">' + data.userdep + '</span>-' + data.username);
            // 默认区域/部门
            // $locNow.html('<span>' + data.initLoc + '</span>');
        }
    });

    // 点击显示 搜索框
    $('.search-con').on('click', '.search-btn', function() {
        $searchInput.val('');
        $searchResult.empty().hide();
        searchWrap.show();
    });

    $('.user-con').on('click', '.quit-btn', function() {
        epoint.confirm('您确定要退出系统吗？','退出系统', function () {
            Util.getSafeLocation().href = Util.getRightUrl('rest/logout?isCommondto=true');
        });
    });

    // 监听文本框 回车事件
    $searchInput.keypress(function(e) {
        if (e.which === 13) {
            var key = $(this).val();
            if (key) {
                getSearchResult(key);
            }
        }
    });

    var loaded = false;
    // 搜索结果列表 点击
    $searchResult.on('click', 'li', function() {
        var $this = $(this),
            type = $this.data('type'),
            id = $this.data('id'),
            pid = $this.data('pid'),
            specialId = 'c1e266a1-7c9b-41e7-ad8c-ea273ab7f214'; // 具有指标的页面的id（请开发根据实际情况自己修改）
        searchWrap.hide();
        if (type === 1) {
            // 专题
            searchHeight(id);
        } else {
            // 指标
            searchHeight(pid);
            setTimeout(function() {
                $iframe[0].contentWindow.targetHigh(id);
            }, 1200);
            var src = $iframe.attr('src').split('#')[0];
            // src = 'http://218.4.136.116:8001/shareScreen/eyJzY3JlZW5JZCI6MTk0OTR9';
            if(loaded){
                $iframe.attr('src',src + '#highlight=' + id);
            }
            else{
                var iframe = document.getElementById("iframe");
                iframe.onload = function(){
                    $iframe.attr('src',src + '#highlight=' + id);
                    //清理事件
                    iframe.onload = function(){};
                }
                
            }
        }
    });

    function searchHeight(id) {
        $.each(navArr, function(navIndex, e) {
            if (e.projectList.length > 0) {
                for (var i = 0; i < e.projectList.length; i++) {
                    if (e.projectList[i].id === id) {
                        if(e.projectList[i].url == $iframe.attr('src').split('#')[0]){
                            loaded = true;
                            return;
                        }
                        $NavWrapper.find('.swiper-slide').eq(navIndex).find('a').trigger('click');
                        $navLevel.find('.swiper-slide').eq(i).find('a').trigger('click');
                        loaded = false;
                        return;
                    }
                }
            }
            if (e.cateList.length > 0) {
                for (var j = 0; j < e.cateList.length; j++) {
                    for (var index = 0; index < e.cateList[j].projectList.length; index++) {
                        if (e.cateList[j].projectList[index].id === id) {
                            if(e.cateList[j].projectList[index].url == $iframe.attr('src').split('#')[0]){
                                loaded = true;
                                return;
                            }
                            $NavWrapper.find('.swiper-slide').eq(navIndex).find('a').trigger('click');
                            $navLevel.find('.swiper-slide').eq(j + e.projectList.length).find('a').trigger('click');
                            $navLevel.find('.swiper-slide').eq(index).find('a').trigger('click');
                            loaded = false;
                            return;
                        }
                    }
                    if (e.cateList[j].id ===id){
                        console.log("如果你看到这行字，说明程序有问题");
                        $NavWrapper.find('.swiper-slide').eq(navIndex).find('a').trigger('click');
                        $navLevel.find('.swiper-slide').eq(j + e.projectList.length).find('a').trigger('click');
                        return;
                    }
                }
            }
        });
        
    }
    var cockpitListData;
    function getAreaDep(){
        Util.ajax({
            url: pageConfig.getAreaDep2,
            async: false,
            data: {
                params: JSON.stringify({
                    resolution: window.screen.width + '*' + window.screen.height
                })
            },
            success: function(data) {
                if(data){
                    cockpitListData = data.result;
                }
            }
        });
    }
    getAreaDep();
    var curList,curList1,curList2,curList3,curList4;
    // 当前选中区域/部门 点击事件
    $locNow.on('click', function() {
        if($locWhole.css('display') !== 'none'){
            $locWhole.hide();
        }
        else{
            $locWhole.show();
        }
        
        if (!curList) {
            getLocArea();
        }
    });

    // 区域/部门列表 点击事件
    $locArea.on('click', 'li', function() {
        var $this = $(this),
            txt = $this.text(),
            type = $this.data('type'),
            id = $this.data('id');
        $this.addClass('active');

        isMidClose = true;
        $locNow.html('<span>' + txt + '</span>');
        $locWhole.hide();
        newCockpitguid = id;
        getCockpitInfo();
        loadNavigator();
        searchHeight(id);
        defaultHigh($swiperNav, 0);
        // if (type == 'cockpit' || (type == 'column' && txt == '不限')){
        //     newCockpitguid = id;
        // }
        // if (type == 'project' || txt == '不限') {
        //     isMidClose = true;
        //     var locTxt1 = '';
        //     $locClarify.find('li.chosen').each(function(i, e) {
        //         locTxt1 += $(e).find('a').html() + '/';
        //     });
        //     $locNow.html('<span>' + locTxt1 + txt + '</span>');
        //     $locWhole.hide();

        //     getCockpitInfo();
        //     loadNavigator();
        //     searchHeight(id);
        //     if(type == 'cockpit' || (type == 'column' && txt == '不限')){
        //         defaultHigh($swiperNav, 0);
        //     }
        // }
        // else {
        //     // 区域/部门 头部 新增li项
        //     $locClarify.find('li:last').removeClass('active').addClass('chosen').data('id', $this.data('id')).find('a').text(txt);
        //     $locClarify.append('<li class="active"><a href="javascript:;">请选择</a></li>');
        //     // 请求下一层列表数据
        //     getLocArea($this.data('id'));
        // }
        // if (nowLocLevel < locLevel) {
        //     if (txt !== '不限') {
        //         // 区域/部门 头部 新增li项
        //         $locClarify.find('li:last').removeClass('active').addClass('chosen').data('id', $this.data('id')).find('a').text(txt);
        //         $locClarify.append('<li class="active"><a href="javascript:;">请选择</a></li>');
        //         // 请求下一层列表数据
        //         getLocArea($this.data('id'));
        //     } else {
        //         isMidClose = true;
        //         var locTxt1 = '';
        //         $locClarify.find('li.chosen').each(function(i, e) {
        //             locTxt1 += $(e).find('a').html() + '/';
        //         });
        //         $locNow.html('<span>' + locTxt1 + '</span>');
        //         $locWhole.hide();
        //     }
        // } else if (nowLocLevel >= locLevel) {
        //     // 修改 当前选中区域/部门 内容
        //     isMidClose = true;
        //     var locTxt = '';
        //     $locClarify.find('li.chosen').each(function(i, e) {
        //         locTxt += $(e).find('a').html() + '/';
        //     });
        //     if (txt !== '不限') {
        //         $locNow.html('<span>' + locTxt + txt + '</span>');
        //     } else {
        //         $locNow.html('<span>' + locTxt + '</span>');
        //     }
        //     $locWhole.hide();
        // }
    });

    // 区域/部门 头部点击事件
    $locClarify.on('click', 'li.chosen a', function() {
        var $this = $(this),
            $li = $this.parent(),
            index = $li.index();
        nowLocLevel = index;
        // 高亮当前被选中元素
        $li.addClass('active').removeClass('chosen');
        // 删除该元素后的li节点
        $locClarify.find('li').each(function(i, e) {
            if (i > index) {
                $(e).remove();
            }
        });
        // 重新请求列表数据
        getLocArea($li.prev().data('id'));
    });

    // 封装 区域选择 方法
    function getLocArea(prevGuid) {
        nowLocLevel++;
        // locLevel = 4;
        if(nowLocLevel == 1){
            //驾驶舱层
            curList1 = cockpitListData;
            curList = curList1;
        }
        else if(nowLocLevel == 2){
            //栏目和未绑定栏目的专题层
            //未绑定栏目的专题？
            $.each(curList1, function(i, e){
                if(e.id == prevGuid){
                    curList1 = e;
                    newCockpitguid = e.id;
                }
            });
            curList2 = curList1.columnList;
            curList = curList2;
        }
        else if(nowLocLevel == 3){
            //栏目下，专题分类层和专题层
            $.each(curList2, function(i, e){
                if(e.id == prevGuid){
                    curList2 = e;
                }
            });
            curList3 = curList2.projectList.concat(curList2.cateList);
            curList = curList3;
        }
        else if(nowLocLevel == 4){
            //专题分类下，专题层
            $.each(curList3, function(i, e){
                if(e.id == prevGuid){
                    curList3 = e;
                }
            });
            curList4 = curList3.projectList;
            curList = curList4;
        }
        // 设置列表数据
        var li = '';
        if (nowLocLevel == 2){
            li = '<li data-id="' + prevGuid + '" data-type="column">不限</li>'; 
        }
        else if(nowLocLevel != 1){
            li = '<li data-id="' + prevGuid + '" data-type="cate">不限</li>'; 
        }
        $.each(curList, function(i, e) {
            li += '<li data-id="' + e.id + '" data-type="' + e.type + '">' + e.name + '</li>';
        });
        $locArea.empty().append(li);
    }

    // 获取搜索结果列表
    function getSearchResult(key) {
        Util.ajax({
            url: pageConfig.getSearchList,
            data: {
                params: JSON.stringify({
                    cockpitguid: cockpitguid,
                    keyword: key, 
                    resolution: window.screen.width + '*' + window.screen.height
                })
            },
            success: function(data) {
                var li = '';
                $.each(data.result, function(i, e) {
                    if(e.type == 0){
                        li += '<li data-id="' + e.id + '" data-type="' + e.type + '" data-pid="' + e.projectguid + '">';
                        li += e.projectname +'-'+ e.name + '</li>';
                    }
                    else{
                        li += '<li data-id="' + e.id + '" data-type="' + e.type + '">' + e.name + '</li>';
                    }
                    
                });
                $searchResult.show().empty().append(li);
            }
        });
    }

    // 点击其他区域，关闭地区选框
    $('body').on('click', function(e) {
        if (($(e.target).data('type') == 'project' || $(e.target).text() == '不限') && $locWhole.css('display') !== 'none') {
            closeLoc();
        }
        if ($(e.target).parents('.search-con').length === 0) {
            searchWrap.hide();
        }
    });

    // 打开 操作中心 弹窗
    $('.header').on('click', '.notice-btn', function() {
        Util.openTopLayer({
            title: '操作中心',
            id: 'operation-layer',
            width: '9.28rem',
            height: '6.2rem',
            url: './operation_center.html',
        });
    });

    // 关闭其他区域选框
    function closeLoc() {
        $locWhole.hide();
        isMidClose = true;
    }
    win.closeLoc = closeLoc;

    // swiper自适应
    $(win).resize(function() {
        setTimeout(function() {
            swiper.onResize();
            if (swiperSub) {
                swiperSub.onResize();
            }
        }, 80);
    });

    function visitProject(projectguid){
        Util.ajax({
            url: pageConfig.visitProject,
            async: false,
            data: {
                params: JSON.stringify({
                    projectguid: projectguid
                })
            },
            success: function(data) {
            }
        });
    }
    
    
    function watermark(settings) {    //默认设置    
    	isWater=1;
    	var defaultSettings={       
    		watermark_txt:"text",        
    		watermark_x:100,//水印起始位置x轴坐标        
    		watermark_y:20,//水印起始位置Y轴坐标        
    		watermark_rows:20,//水印行数        
    		watermark_cols:20,//水印列数        
    		watermark_x_space:100,//水印x轴间隔        
    		watermark_y_space:50,//水印y轴间隔        
    		//watermark_color:'#000000',//水印字体颜色     
    		watermark_color:'white',//水印字体颜色    
    		watermark_alpha:0.3,//水印透明度        
    		watermark_fontsize:'18px',//水印字体大小        
    		watermark_font:'微软雅黑',//水印字体        
    		watermark_width:120,//水印宽度        
    		watermark_height:80,//水印长度       
    		watermark_angle:15//水印倾斜度数    
    	};    
    	//采用配置项替换默认值，作用类似jquery.extend    
    	if(arguments.length===1&&typeof arguments[0] ==="object" ){
    		var src=arguments[0]||{};       
    		if(src["watermark_txt"]){
    			defaultSettings["watermark_txt"]=src["watermark_txt"];   
    		}    
    	}
    	var oTemp = document.createDocumentFragment();    //获取页面最大宽度    
    	var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth);    //获取页面最大长度    
    	var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight);    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔    
    	if (defaultSettings.watermark_cols == 0 ||(parseInt(defaultSettings.watermark_x+defaultSettings.watermark_width *defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1))> page_width)) {        
    		defaultSettings.watermark_cols =parseInt((page_width-defaultSettings.watermark_x+defaultSettings.watermark_x_space)/ (defaultSettings.watermark_width+defaultSettings.watermark_x_space));        
    		defaultSettings.watermark_x_space =parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols)　/ (defaultSettings.watermark_cols - 1));    
    	}    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔    
    	if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {        
    		defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));        
    		defaultSettings.watermark_y_space = parseInt((page_height - defaultSettings.watermark_y - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));    
    	}    
    	var x;    
    	var y;    
    	for (var i = 0; i < defaultSettings.watermark_rows; i++) {        
    		y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;        
    		for (var j = 0; j < defaultSettings.watermark_cols; j++) {            
    			x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;            
    			var mask_div = document.createElement('div');            
    			mask_div.id = 'mask_div' + i + j;            
    			mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));//设置水印div倾斜显示            
    			mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";            
    			mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";            
    			mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";            
    			mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";            
    			mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";            
    			mask_div.style.visibility = "";           
    			mask_div.style.position = "absolute";            
    			mask_div.style.left = x + 'px';            
    			mask_div.style.top = y + 'px';            
    			mask_div.style.overflow = "hidden";            
    			mask_div.style.zIndex = "9999";            
    			//mask_div.style.border="solid #eee 1px";           
    			mask_div.style.opacity = defaultSettings.watermark_alpha;            
    			mask_div.style.fontSize = defaultSettings.watermark_fontsize;           
    			mask_div.style.fontFamily = defaultSettings.watermark_font;            
    			mask_div.style.color = defaultSettings.watermark_color;            
    			mask_div.style.textAlign = "center";            
    			mask_div.style.width = defaultSettings.watermark_width + 'px';            
    			mask_div.style.height = defaultSettings.watermark_height + 'px';            
    			mask_div.style.display = "block";         
    			mask_div.style.pointerEvents='none';   
    			oTemp.appendChild(mask_div);        
    		};    
    	};    
    	document.body.appendChild(oTemp);
    } 
})(this, jQuery);
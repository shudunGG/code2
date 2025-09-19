/*
 * @Author: jjj 
 * @Date: 2018-09-10 10:50:44 
 * @Last Modified by: chends
 * @Last Modified time: 2019-09-26 14:59:07
 * @Description: '消息中心' 
 */
(function(win, $){
  var defaultConfig = {
      "id": 'msg-center', // 消息中心ID
      "title": '消息中心', // 消息中心标题
      "showSet": true, // 是否显示右上角的设置按钮
      "isMsgCenterMaxSize": false, // 打开窗口是否全屏
      "msgCenterOrder": "asc", // 列表消息排序，asc 为最新的，desc为最早的
      "shortcutKey": false, // 是否支持快捷键呼出消息
      "enterToSearch": false, // 是否支持回车键进行搜索
      "showBtnLoad": false, // 是否支持点击按钮进行加载更多消息，默认滚动条加载，个人觉得体验不会好
      "colors": ['#7d91ff','#57d1c4','#ffd272','#79b8f9','#ff8a8a'], // 图标背景色
      "index": 1, // 默认显示第几页
      "page": 10, //默认一页显示多少条

      "hideCallback": $.noop,
      "typeListUrl": '', // 类型接口
      "msglistUrl": '', // 右侧列表接口
      "markToReadUrl": '', // 标记为已读接口，多个用逗号隔开
      "deleteUrl": '', // 删除接口, 类型为all表示删除所有，不然直接传id，多个逗号隔开
      "msgSearchUrl": '', // 搜索接口
      "msgTipsUrl": '', // 消息提醒接口，返回各个类别的数据和总数
      "coverId": 'msg-cover' // 背景ID
  };

  var M = Mustache,
      STATUSHEIGHT = 60; // 加载中，五更多信息div的高度
      

  var MSGBOX_TPL = '<div id="mc-wrapper"><div class="mc-header" id="mc-header">{{title}}'+
          '<div class="mc-header-btns r">'+
              '<div title="关闭" class="mc-hd-close r"></div>'+
              '<div title="恢复" class="mc-hd-recovery r {{^isMsgCenterMaxSize}}hidden{{/isMsgCenterMaxSize}}"></div>'+
              '<div title="全屏" class="mc-hd-max r {{#isMsgCenterMaxSize}}hidden{{/isMsgCenterMaxSize}}"></div>'+
              '{{#showSet}}<div title="设置" class="mc-hd-set r"></div>{{/showSet}}'+
              '<div title="刷新" class="mc-hd-refresh r"></div>'+
          '</div>'+
      '</div>'+
      '<div class="mc-container">'+
          '<div class="msg-tabs" id="msg-tabs">'+
          '</div>'+
          '<div class="msg-content" id="msg-content">'+
              '<div class="msg-operation clearfix" id="msg-operation">'+
                  '<div class="l msgopera-edit-container" id="msgopera-edit-container">'+
                      '<div class="l msg-check-btn" id="msg-check-all"></div>'+
                      '<div class="l msgopera-edit" data-ref="readed" id="msg-markreaded"> 标记已读</div>'+
                      '<div class="l msgopera-edit" data-ref="delete"> 删除</div>'+
                      '<div class="l msgopera-edit" data-ref="deleteall"> 删除所有</div>'+
                  '</div>'+
                  '<div class="l msgopera-tab-container" id="msgopera-tab-container">'+
                      '<span class="l msgopera-tab" data-ref="all">全部</span>'+
                      '<span class="l msgopera-tab active" data-ref="unread">未读<span id="msg-unread"></span></span>'+
                      '<div class="l msg-clearall" id="msg-clearall" title="清空所有未读消息"></div>'+
                  '</div>'+
                  '<div class="r msg-search" id="msg-search">'+
                      '<input type="text" class="msg-search-input l" autocomplete="off" id="msg-search-input" />'+
                      '<div class="msg-search-icon l"></div>'+
                  '</div>'+
                  '<div class="r msg-order-btn {{#orderAsc}}msg-order-asc{{/orderAsc}}" title="{{orderTitle}}" id="msg-order-btn"></div>'+
                  '<div class="r msg-edit-btn" title="编辑" id="msg-edit-btn"></div>'+
              '</div>'+
              '<div class="msg-lists list-loading" id="msg-lists"><ul id="msg-lists-ul">'+
              '</ul>'+
              '<div class="msg-load-status">'+
                  '<span class="msg-loading hidden" id="msg-loading">'+
                      '<i class="msg-circle-1"></i>'+
                      '<i class="msg-circle-2"></i>'+
                      '<i class="msg-circle-3"></i>'+
                      '<span class="msg-loading-text">加载中</span>'+
                      '<i class="msg-circle-3"></i>'+
                      '<i class="msg-circle-2"></i>'+
                      '<i class="msg-circle-1"></i>'+
                  '</span>'+
                  '<span class="msg-nomore hidden" id="msg-nomore"></span>'+
              '</div>'+
              '</div>'+
          '</div>'+
      '</div></div>',

  TYPE_TPL = '<ul>{{#msgTypes}}<li data-id="{{id}}" class="msg-tab {{#show}}active{{/show}}"><i class="msg-tab-icon {{icon}}" style="background-color: {{bg}}"></i><span class="msg-tab-text">{{name}}</span> <i id="msg-num-{{id}}" class="msg-num-tip hidden"></i></li>{{/msgTypes}}</ul>',

  MSGITEM_TPL = '{{#list}}{{#isTime}}<li class="msg-time-item"><span class="msg-time-tip">{{time}}</span></li>{{/isTime}}{{^isTime}}<li id="msg-item-id-{{id}}" class="msg-item {{#readed}}msg-readed{{/readed}} clearfix"><div class="msg-check-btn msg-item-check" {{#emailId}}data-emailid="{{emailId}}"{{/emailId}} data-id="{{id}}"></div><div class="msg-item-container"><div class="msg-item-top clearfix"><h3 class="l msg-item-type"><i class="msg-tab-icon {{icon}}" style="background-color: {{bg}}"></i><span class="msg-type-name">{{typeName}}</span></h3><span class="r">{{showTime}}</span></div><div data-opentype="{{openType}}" data-id="{{id}}" {{#emailId}}data-emailid="{{emailId}}"{{/emailId}} data-name="{{typeName}}"  data-url="{{url}}" data-typeid="{{typeId}}" data-readed={{readed}} class="msg-item-title">{{{content}}}</div><div class="msg-item-more"><div class="msg-item-link text-ellipsis" data-opentype="{{openType}}" data-id="{{id}}" {{#emailId}}data-emailid="{{emailId}}"{{/emailId}} data-name="{{typeName}}"  data-url="{{url}}" data-typeid="{{typeId}}" class="msg-item-link">{{{title}}} ></div>{{#showIgnore}}<div class="msg-ignore r" title="设为已读" data-id="{{id}}" {{#emailId}}data-emailid="{{emailId}}"{{/emailId}}></div>{{/showIgnore}}</div></div></li>{{/isTime}}{{/list}}';

  // 获取消息类型数据
  var getTypeList = function(url, callback) {
      Util.ajax({
          url: url
      }).done(function(res) {
          if(res && res.msgTypes.length) {
              if(typeof callback == 'function') {
                  callback(res);
              }
          }
      })
  };

  // 格式化时间
  var timeFormat = function(dateTime, format) {
      var _this = dateTime;
      var date = {
            "M+": _this.getMonth() + 1,
            "d+": _this.getDate(),
            "h+": _this.getHours(),
            "m+": _this.getMinutes(),
            "s+": _this.getSeconds(),
            "q+": Math.floor((_this.getMonth() + 3) / 3),
            "S+": _this.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (_this.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
        }
        return format;
  };

  // 转换时间为年月日
  var timeToChn = function(datatime) {
      var _arr =datatime.split('-');
      return _arr[0] + '年' + _arr[1] + '月' + _arr[2] + '日';
  }

  var MsgCenter = function(opt) {
      if(opt.msgCenterOrder == 'asc') {
          opt.orderAsc = true;
          opt.orderTitle = "按最新排序";
      } else {
          opt.orderAsc = false;
          opt.orderTitle = "按最早排序";
      }
      this.config = $.extend({}, defaultConfig, opt);
      this.copyConfig = JSON.parse(JSON.stringify(this.config)); // 拷贝配置，用于分类查询时，获取分页数据等信息 
      this._init();
  }

  $.extend(MsgCenter.prototype, {
      _init: function() {
          Util.loadCss('frame/fui/js/widgets/msgcenter/msgcenter.css', '#common-skin', 'Before');
          this.isShow = false;
          this.height = 490; // 消息中心高度
          this.width = 780; // 消息中心宽度
          this.msgTypeLength = 0; // 消息中心左侧列表个数
          this.typeObj = {}; // 图标对应颜色等信息
          this.todayTime = timeFormat(new Date(), 'yyyy-MM-dd');
          this.lastTime = ''; // 列表中显示的时间
          this.activeTypeId = ''; // 当前激活的类型id
          this.updateTimer = null; // 消息更新的定时器
          this.pageInfo = {
              sum: ''
          }; // 分页信息,主要用到总页数用于判断
          this.unread = true; // false表示全部，true表示未读

          this.$msg_clamp = null;

          this.msglistAjax = null;
          
          
          this._initBaseContain();
      },
      _initBaseContain: function() {
          // 渲染基础容器
          if(!document.getElementById(this.config.id)) {
              var _msgCenterDiv = document.createElement('div');
              _msgCenterDiv.id = this.config.id;
              _msgCenterDiv.className = 'msg-center zoom-enter';
              _msgCenterDiv.style.width = this.width + 'px';
              _msgCenterDiv.style.height = this.height + 'px';
              document.body.appendChild(_msgCenterDiv);
              document.getElementById(this.config.id).innerHTML = Util.clearHtml(M.render(MSGBOX_TPL, this.config));   
          }
          
          this._initDomObj();
          this._adjustHeight();
          this._initEvent();

          /* setTimeout(function() {
              this.$msgCenter.removeClass('zoom-enter');
          },500); */
          
      },
      _initDomObj: function() {
          // 初始化dom变量
          this.$msgCenter = $('#'+ this.config.id); // 消息中心
          this.$header = $('#mc-header');
          this.$msgWrapper = $('#mc-wrapper'); // 消息中心的容器
          this.$msgTabs = $('#msg-tabs'); // 左侧列表
          this.$msgLists = $('#msg-lists'); // 右侧列表
          this.$msgListsUl = $('#msg-lists-ul'); // 加载列表的ul
          this.$msgEditBtn = $('#msg-edit-btn'); // 编辑按钮
           
          this.$msgContent = $('#msg-content'); //右侧容器
          this.$msgSearch = $('#msg-search'); // 搜索
          this.$searchInput = $('#msg-search-input'); // 搜索输入框
          this.$msgUnread = $('#msg-unread'); // 未读数
          this.$msgClearall = $('#msg-clearall'); // 清空所有消息
          this.$msgMarkreaded = $('#msg-markreaded');

          this.$msgLoading = $('#msg-loading'); // 加载中
          this.$msgnoMore = $('#msg-nomore'); // 没有更多
          
          this.$msgCheckAll = $('#msg-check-all'); // 复选框-全部
      },
      _initBaseRequest: function() {
          // 初始化一些基础请求
          var that = this;

          var initQueryList = function() {
              that._loadingListRequest();
              that._renderMsgTip();
          }
          // 渲染左侧列表
          if(that.$msgTabs.html()) {

              initQueryList();
              
              return false;
          }
          
          // 请求左侧的类型，沟通后，只需要请求一次，所以有上面的判断代码
          //updateMode释义：
          // client:表示更新都由业务端操作,前端打开页面之后,延时3s刷新
          // server:表示更新都由服务端操作,前端打开页面同时请求后台更新状态,然后刷新
          // window:表示更新由打开的页面自己回调父页面的刷新js,前端不做任何操作
          getTypeList(this.config.typeListUrl, function(res) {
              if(res.msgTypes && res.msgTypes.length) {
                  that.msgTypeLength = res.msgTypes.length;
                  $(res.msgTypes).each(function(index, item) {
                      item.bg = item.iconBg || that.config.colors[index];
                      that.typeObj['typeid-'+item.id] = {
                          color: item.bg,
                          name: item.name,
                          icon: item.icon,
                          updateMode: item.updateMode // 注释见上方
                      };
                      
                      if(item.show) {
                          that.activeTypeId = item.id;
                      }
                  });
                  document.getElementById('msg-tabs').innerHTML = Util.clearHtml(M.render(TYPE_TPL, res));
                  
                  initQueryList();
              }
              
          });

          
      },
      _initEvent: function() {
          var that = this;

          var _inputSearch = function() {
              that._loadingListRequest();
          };
          var msgSetting = null;
          // 关闭事件和设置按钮
          this.$msgCenter.on('click', '.mc-hd-close', function(e) {
              // 关闭
              e.stopPropagation();
              that.hide();
          }).on('click', '.mc-hd-set', function(e) {
              // 设置按钮
              e.stopPropagation();
              if(!msgSetting) {
                  Util.loadCss('frame/fui/js/widgets/msgcenter/msgsetting/messagesetting.css', '#common-skin', 'Before');

                  Util.loadJs('frame/fui/js/widgets/msgcenter/msgsetting/messagesetting.js', function() {
                      msgSetting = MessageSetting;
                      msgSetting.showAdvance();
                  });
              } else {
                  msgSetting.showAdvance();
              }
              
          }).on('click', '.mc-hd-refresh', function(e) {
              // 刷新消息数和右侧列表
              e.stopPropagation();
              that._loadingListRequest();
              that._renderMsgTip();
              
          }).on('click', '.mc-hd-max', function(e) {
              // 全屏
              e.stopPropagation();
              that.config.isMsgCenterMaxSize = true;
              $('.mc-hd-recovery', that.$msgCenter).removeClass('hidden');
              $(this).addClass('hidden');
              that._adjustHeight();
              that.$msgCenter.draggable({ disabled: true });
              that.$header.css('cursor', 'default');
          }).on('click', '.mc-hd-recovery', function(e) {
              // 恢复
              e.stopPropagation();
              that.config.isMsgCenterMaxSize = false;
              $('.mc-hd-max', that.$msgCenter).removeClass('hidden');
              $(this).addClass('hidden');
              that._adjustHeight();
              that.$msgCenter.draggable({ disabled: false });
              that.$header.css('cursor', 'move')
          }).on('keyup', '#msg-search-input', function(e) {
              if(e.keyCode == 13) {
                  _inputSearch();
                  e.preventDefault();
              }
              if(that.$searchInput.val() == '') {
                  _inputSearch();
                  e.preventDefault();
              }
          });

          // 右侧点击事件
          this.$msgContent.on('click', '.msg-edit-btn', function() {
                  // 搜索框旁边得编辑按钮
                  var active = that.$msgContent.hasClass('active');
                  if(active) {
                      that.$msgContent.removeClass('active');
                      $('.msg-check-btn').removeClass('active');
                  } else {
                      that.$msgContent.addClass('active');
                  }
                  
              }).on('click', '.msg-order-btn', function() {
                  // 排序按钮
                  var $this = $(this);
                  if($this.hasClass('msg-order-asc')) {
                      // 最新变最早
                      $this.attr('title',"按最早排序");
                      $this.removeClass('msg-order-asc');
                      that.config.msgCenterOrder = 'desc';
                  } else {
                      $this.attr('title',"按最新排序");
                      $this.addClass('msg-order-asc');
                      that.config.msgCenterOrder = 'asc';
                  }

                  that._loadingListRequest();
                  
              }).on('click','.msgopera-edit', function() {
                  // 标记已读，删除，删除所有
                  var $this = $(this),
                      ref = $this.data('ref'),
                      ids = [],
                      idStr = '',
                      emailId = [],
                      emailIdStr = '';

                  $('.msg-item-check.active').map(function(index, item) {
                      var $item =  $(item),
                          _emailId = $item.data('emailid') || '';
                      ids.push($item.data('id'));
                      // 邮件反馈类型
                      if(_emailId) {
                          if(emailId.indexOf(_emailId) < 0) {
                              emailId.push(_emailId);
                          }
                      }
                  });
                  
                  // 没有选中则不往下执行
                  if(!ids.length && (ref == 'readed' || ref == 'delete')) {
                      epoint.showTips('请选择要操作的消息', {
                          state: 'info'
                      });
                      return false;
                  }

                  idStr = ids.join(',');
                  emailIdStr = emailId.join(',');

                  var _renderEmptyByDelete = function() {
                      that.$msgListsUl.html('');
                      that.$msgLists.removeClass('msg-no msg-no-result list-loading').addClass('msg-no');
                      that.$msgEditBtn.trigger('click');
                  }

                  if(ref == 'readed') {
                      // 多个标记已读
                      that._markToReadedRequest({
                          id: idStr,
                          emailId: emailIdStr
                      }, function(){
                          for(var i = 0,len = ids.length; i < len; i++) {
                              $('#msg-item-id-'+ ids[i]).addClass('msg-readed');
                          }
                      });
                  } else if(ref == 'delete') {
                      // 多个删除
                      that.$msgCheckAll.removeClass('active');
                      that._deleteRequest(idStr, function() {
                          
                          that.lastTime = '';
                          that.$msgLists.scrollTop(0);
                          that.pageInfo.sum = 0;
                          // 删除成功后重新请求新数据
                          that._msgListRequest({
                              index: that.copyConfig.index,
                              page: that.copyConfig.page,
                              changeType: true // 是否是切换tab
                          });
                          that._scrollLoad();
                      });
                  } else if(ref == 'deleteall') {
                      // 删除所有，通过接口，清空该分类下的所有数据包含未动态加载出来的数据
                      mini.confirm('您确定要删除所有吗？', '系统提示', function (action) {
                          if (action == 'ok') {
                              that._deleteRequest('all', function() {
                                  _renderEmptyByDelete();
                              });
                          }
                      });
                  }
              }).on('click', '.msgopera-tab', function() {
                  // 全部、未读
                  var $this = $(this),
                      ref = $this.data('ref');
                  that.unread = ref == 'all' ? false : true; // 全部是false，未读是true

                  $this.addClass('active').siblings('.msgopera-tab').removeClass('active');

                  that._loadingListRequest();
              }).on('click', '.msg-clearall', function() {
                  // 清除所有未读
                  if(!$(this).hasClass('active')) {
                      epoint.showTips('暂无未读消息', {
                          state: 'info'
                      });
                      return;
                  }

                  mini.confirm('您确定要清空所有未读消息吗？', '系统提示', function (action) {
                      if (action == 'ok') {
                          that._markToReadedRequest({
                              id: ''
                          }, function() {
                              $('.msg-item').addClass('msg-readed');
                          });
                      }
                  });
              }).on('click', '.msg-check-btn', function() {
                  // 复选框点击
                  var $this = $(this),
                      isItem = $this.hasClass('msg-item-check'); // 是否是所有
                      if(isItem) {
                          if($this.hasClass('active')) {
                              $this.removeClass('active');
                              that.$msgCheckAll.removeClass('active');
                          } else {
                              $this.addClass('active');
                          }
                      } else {
                          // 点击复选框-全部
                          var $itemChecks = $('.msg-item-check', that.$msgLists);
                          if($this.hasClass('active')) {
                              $this.removeClass('active')
                              $itemChecks.removeClass('active');
                          } else {
                              $this.addClass('active');
                              $itemChecks.addClass('active');
                          }
                          
                      }
                  
              }).on('click', '.msg-ignore', function() {
                  // 单个标记已读
                  var $this = $(this),
                      $item = $this.parent().parent().parent(),
                      id = $this.data('id'),
                      emailId = $this.data('emailid');
                  
                  that._markToReadedRequest({
                      id: id,
                      emailId: emailId
                  }, function() {
                      $item.addClass('msg-readed');
                  });
              
              }).on('click', '.msg-search-icon', function() {
                  _inputSearch();
              }).on('click', '.msg-item-link,.msg-item-title', function() {
                  var $this = $(this),
                      id = $this.data('id'),
                      emailId = $this.data('emailid'),
                      openType = $this.data('opentype'),
                      name = $this.data('name'),
                      typeId = $this.data('typeid'),
                      url = $this.data('url'),
                      readed = $this.data('readed'),
                      $item = $this.parent().parent().parent();

                  if($this.hasClass('msg-item-title')) {
                      $item = $this.parent().parent();
                  }
                  // 针对 ”待办通知“ 单独处理，不进行忽略
                  // if(!that._isCancleMark(name)) {
                      
                  // }
                  if(!readed) {
                    that._markToReadedRequest({
                        id: id,
                        emailId: emailId,
                        isDetail: true,
                        typeId: typeId
                    }, function() {
                        $item.addClass('msg-readed');
                    }, true);
                  }

                  if(openType == 'tabsnav') {
                      that.hide();
                  }
                  dealLinkOpen({
                      id: id,
                      openType: openType,
                      name: name,
                      url: url
                  });
              }).on('focus', '.msg-search-input', function() {
                  that.$msgSearch.addClass('msg-search-focus');
              }).on('blur', '.msg-search-input', function() {
                  that.$msgSearch.removeClass('msg-search-focus');
              });

          // 左侧点击事件
          this.$msgTabs.on('click', '.msg-tab', function() {
              var $this = $(this),
                  id = $this.data('id'),
                  unreadTxt = '',
                  name = that.typeObj['typeid-' + id]['name'];

              /* if(that._isCancleMark(name)) {
                  that.$msgMarkreaded.addClass('hidden');
                  that.$msgClearall.addClass('hidden');
              } else {
                  that.$msgMarkreaded.removeClass('hidden');
                  that.$msgClearall.removeClass('hidden');
              } */
              if($('#msg-num-' + id).data('num')) {
                  unreadTxt = '('+$('#msg-num-' + id).data('num')+')';
                  that.$msgClearall.addClass('active');
              } else {
                  that.$msgClearall.removeClass('active');
              }

              that.activeTypeId = id;
              that.$msgUnread.text(unreadTxt);
              $this.addClass('active').siblings('.active').removeClass('active');
              
              // loading效果
              that._loadingListRequest();
          });

          // 初始化拖拽事件
          that._drag();

          // 初始化背景点击事件
          /* $(document).on('click', '#'+ that.config.coverId, function() {
              that.hide();
          }); */

          // 实时修改消息中心高度
          var timer = null;
          $(win).on('resize', function () {
              clearTimeout(timer);
              timer = setTimeout(function () {
                  that._adjustHeight();
              }, 17);
          });
      },
      _isCancleMark: function(name) {
          // return false;
          if(name == '待办通知') {
              return true;
          } else {
              return false;
          }
      },
      _loadingListRequest: function() {
          // 带loading效果的右侧列表请求
          var that = this;
          that.lastTime = '';
          that.$msgLists.scrollTop(0);
          that.pageInfo.sum = 0;
          that.$msgLoading.addClass('hidden');
          that.$msgnoMore.addClass('hidden');
          that.$msgListsUl.html('');
          that.$msgLists.removeClass('msg-no msg-no-result').addClass('list-loading');
          
          that._msgListRequest({
              index: that.copyConfig.index,
              page: that.copyConfig.page,
              changeType: true // 是否是切换tab
          }, function() {
              that.$msgLists.removeClass('list-loading');
          });
          
          that._scrollLoad();
      },
      _msgListRequest: function(opt, callback) {
          // 获取右侧列表数据
          // 动态加载得时候，需要将复选框-全部，置为未选中状态
          var that = this;
          var searchVal = that.$searchInput.val() || ''; // 搜索关键字
          var _index = opt.index,
              _page = opt.page,
              _key = opt.key || searchVal, // 搜索关键字
              _isChangeType = opt.changeType, // 是否是切换tab或者重新加载
              _order = that.config.msgCenterOrder || 'asc';
          
          if(that.msglistAjax) {
              that.msglistAjax.abort();
          }

          that.msglistAjax = Util.ajax({
              url: that.config.msglistUrl,
              data: {
                  index: _index,
                  page: _page,
                  msgtype: that.activeTypeId,
                  unread: that.unread, // false 表示全部，true表示查询未读
                  key: _key,
                  order: _order //排序，最新的为asc，最早的为desc
              }
          }).done(function(res) {
              // 后端返回得是总数量
              res.pageInfo.sum = Math.ceil(parseInt(res.pageInfo.sum)/parseInt(_page));
              if(res && res.pageInfo && res.pageInfo.sum == 0) {
                  // 如果pageInfo的sum值为0，则表示该类别或者搜索结果没有数据
                  that.$msgListsUl.html('');
                  that.$msgnoMore.addClass('hidden');
                  that.$msgLoading.addClass('hidden');
                  if(_key) {
                      that.$msgLists.removeClass('msg-no msg-no-result list-loading').addClass('msg-no-result');
                  } else {
                      that.$msgLists.removeClass('msg-no msg-no-result list-loading').addClass('msg-no');
                  }
                  if(typeof callback == 'function') {
                      callback();
                  }
                  return false;
              }
              if(res && res.list.length) {
                  
                  that.$msgLists.removeClass('msg-no msg-no-result list-loading');

                  that._adjustMsgList(res.list);
                  
                  that._renaderMsgList(res.list, _isChangeType);
                  if(typeof callback == 'function') {
                      callback();
                  }

                  if(res.pageInfo) {
                      that.pageInfo = res.pageInfo;
                      if(_index < res.pageInfo.sum) {
                          that.$msgLoading.removeClass('hidden');
                          that.$msgnoMore.addClass('hidden');
                      } else {
                          that.$msgLoading.addClass('hidden');
                          that.$msgnoMore.removeClass('hidden');
                      }
                  }
              }
          });

      },
      _adjustMsgList: function(list) {
          // 添加时间
          var that = this;
          var addNum = 0;
          $(list).each(function(index, item) {
              if(item.createTime && !item.isTime) {
                  if(that.todayTime == item.createTime.substr(0, 10)) {
                      that.lastTime = item.createTime.substr(0, 10);
                  } else {
                      if(that.lastTime != item.createTime.substr(0, 10)) {
                          that.lastTime = item.createTime.substr(0, 10);
                          list.splice(index + addNum, 0, {
                              isTime: true,
                              time: timeToChn(that.lastTime)
                          })
                          addNum++;
                      }
                  }
              }
          })
      },
      _renaderMsgList: function(list, isChangeType) {
          var that = this;
          $(list).each(function(index, item) {
              if(!item.isTime) {
                  if(item.createTime.substr(0,10) == that.todayTime) {
                      item.showTime = '今天' + item.createTime.substr(10, item.createTime.length);
                  } else {
                      item.showTime = item.createTime;
                  }
                  item.isTime = false;
                  item.bg = that.typeObj['typeid-' + item.typeId]["color"];
                  item.typeName = that.typeObj['typeid-' + item.typeId]['name'];
                  item.icon = that.typeObj['typeid-' + item.typeId]['icon'];
                  item.showIgnore = true;// !that._isCancleMark(item.typeName);
                  if(item.content) {
                      // 对开头的div和p标签进行移除，效率低，后面有时间用正则优化
                      var _content = item.content;
                      if(_content.substr(0,5) == '<div>') {
                          if(_content.substr(_content.length-6,_content.length) == '</div>') {
                              _content = _content.substring(5, _content.length-6);
                          }
                      } else if(_content.substr(0,3) == '<p>') {
                          if(_content.substr(_content.length-4,_content.length) == '</p>') {
                              _content = _content.substring(3, _content.length-4);
                          }
                      }
                      item.content = '<span class="msg-user" data-guid="'+item.fromUserGuid+'">' + (item.fromUserName||'系统') + '</span>：' + _content;
                  } else {
                      item.content = item.fromUserName ? ('您收到&nbsp <span class="msg-user" data-guid="'+item.fromUserGuid+'">' + item.fromUserName + '</span> 提交的'+ item.typeName + '，标题：' + item.title) : '标题：'+ item.title;
                      item.title = '查看详情';
                  }
                  // item.title = (item.typeName == "邮件反馈" && item.title) ? item.title : "查看详情"; // == 用的名称进行判断，因为后台的表可能会增加，ID不确定
              }
          });
          if(isChangeType) {
              that.$msgListsUl.html(Util.clearHtml(M.render(MSGITEM_TPL, {list: list})));
          } else {
              that.$msgListsUl.append(Util.clearHtml(M.render(MSGITEM_TPL, {list: list})));
          }

          // 最多显示两行处理
          /* var $content = $('.msg-item-title', that.$msgListsUl);
      
          for (var i = 0, l = $content.length; i < l; i++) {
              that.$msg_clamp($content[i], {
                  clamp: 2
              });
          } */
      },
      /**
       * read 为true表示是查看详情来的
       */
      _markToReadedRequest: function(opt, callback, read) {
          // 标记为已读
          var that = this;
          var id = opt.id,
              emailId = opt.emailId || '',
              typeId = opt.typeId || '';
          var postData = {
              id: id || '' // 不传表示忽略全部
          };
          if(emailId) {
              postData.emailId = emailId;
          }
          //只在全部已读的时候
          if(!id) {
              postData.msgtype = that.activeTypeId;
          }
          // 20190529 - 在点击消息详情的时候，添加isDetail字段，并且传该消息自己的 typeId
          if(opt.isDetail) {
            postData.isDetail = opt.isDetail;
            postData.msgtype = typeId;
          }
          Util.ajax({
              url: that.config.markToReadUrl,
              data: postData
          }).done(function(res) {
              if(res) {
                  if(typeof callback == 'function') {
                      callback(res);

                      
                      
                      var _updateInfo = function() {
                          // 标记后更新右侧列表数据
                          that.lastTime = '';
                          that.$msgLists.scrollTop(0);
                          that.pageInfo.sum = 0;
                          that._msgListRequest({
                              index: that.copyConfig.index,
                              page: that.copyConfig.page,
                              changeType: true
                          });
                          that._scrollLoad();
                          // 标记为已读后需要更新提醒数目
                          that._renderMsgTip();
                      }

                      if(that.updateTimer) clearTimeout(that.updateTimer);

                      // 只有点击详情的时候需要根据类型来调不同的方式刷新
                      if(opt.isDetail) {
                          var updateMode = typeId ? that.typeObj['typeid-' + typeId].updateMode : '';
                          var time = Util.getFrameSysParam('msgTime') || 2000;
                          if(updateMode == 'client') {
                              updateTimer = setTimeout(function() {
                                  _updateInfo();
                              }, time);
                          } else if(updateMode == 'server') {
                            setTimeout(function() {_updateInfo();}, 200);
                          }
                      } else {
                        setTimeout(function() {_updateInfo();}, 200);
                      }
                      if(res.result == 'success') {
                          if(!read) {
                              epoint.showTips('设置成功', {
                                  state: 'success'
                              });
                          }
                      }
                      
                  }
              }
          })
      },
      _deleteRequest: function(id, callback) {
          var that = this,
              postData = {
                  id: id || ''
              };
          if(id == 'all') {
              postData.msgType = that.activeTypeId; //如果是删除所有，则传左侧的消息类型id
          }
          Util.ajax({
              url: that.config.deleteUrl,
              data: postData
          }).done(function(res) {
              if(res) {
                  if(typeof callback == 'function') {
                      callback(res);
                      if(res.result == 'success') {
                          epoint.showTips('删除成功', {
                              state: 'success'
                          });
                      }
                      // 删除后需要更新提醒数目
                      that._renderMsgTip();

                      that.$msgLoading.addClass('hidden');
                      that.$msgnoMore.addClass('hidden');
                  }
              }
          })
      },
      _msgTipRequest: function(callback) {
           var that = this;
          Util.ajax({
              url: that.config.msgTipsUrl
          }).done(function(res) {
              if(res) {
                  if(typeof callback == 'function') {
                      callback(res);
                  }
              }
          })
      },
      _renderMsgTip: function() {
          var that = this;
          
          this._msgTipRequest(function(res) {
              var cacheAllCount = ""; // 缓存所有提醒消息数

              for(var i = 0,len = res.length; i< len; i++) {
                  var str = parseInt(res[i].num) > 99 ? '99+' : res[i].num;
                  if(!str) {
                      $('#msg-num-' + res[i].id).data('num', res[i].num).addClass('hidden');
                  } else {
                      $('#msg-num-' + res[i].id).data('num', res[i].num).text(str).removeClass('hidden');
                  }

                  // 缓存所有提醒消息数
                  if(res[i].id == '0') {
                      cacheAllCount = str;
                  }

                  if(res[i].id == that.activeTypeId) {
                      var unreadTxt = '';
                      if(res[i].num) {
                          unreadTxt = '('+ res[i].num +')';
                          that.$msgClearall.addClass('active');
                      } else {
                          that.$msgClearall.removeClass('active');
                      }
                      that.$msgUnread.text(unreadTxt);
                  }
              }

              // 更新aide主题中的消息数
              if(window.updateMsgTipCount && (typeof window.updateMsgTipCount == 'function')) {
                  window.updateMsgTipCount({
                      remind: cacheAllCount
                  })
              }
              

          });
      },
      _drag: function() {
          var that = this;
          var $cacheWrap = '';
          // Util.loadJs('frame/fui/js/libs/jquery-ui.min.js', function() {
          that.$msgCenter.draggable({ 
              handle: '#mc-header', 
              cancel: '.mc-hd-refresh,mc-hd-set,.mc-hd-max,.mc-hd-recovery,.mc-hd-close',
              containment: "document",
              scroll: false,
              start: function() {
                  $cacheWrap = that.$msgWrapper.detach();
                  that.$msgCenter.css({
                      'background-color':'rgba(0,0,0,.2)',
                      'border': '1px solid #999'
                  });
              },
              stop: function() {
                  that.$msgCenter.html($cacheWrap).css({
                      'background-color':'#fff',
                      'border': '0'
                  })
              }
          });
          // });    
      },
      _scrollLoad: function() {
          var that = this,
              index = parseInt(this.copyConfig.index),
              page = this.copyConfig.page;

          var isLoaded = true; // 解决IE下滚动时多次触发的问题
          that.$msgLists.off('scroll').on('scroll', function() {
              
              if(isLoaded) {
                  var scrollTop = 0,
                      clientHeight = that.$msgLists.height();
                  var scrollHeight = that.$msgListsUl.outerHeight();
                  if (that.$msgLists && that.$msgLists.scrollTop()) {
                      scrollTop = that.$msgLists.scrollTop();
                  }

                  if (scrollTop + clientHeight >= scrollHeight + STATUSHEIGHT) {
                      if(index < that.pageInfo.sum) {
                          index++;
                          isLoaded = false;
                          that.$msgCheckAll.removeClass('active');
                          that._msgListRequest({
                              index: index,
                              page: page
                          },function() {
                              isLoaded = true;
                          });
                      }
                  }
              }
          });
      },
      _adjustHeight: function() {
          var that = this;

          // 如果不是全屏状态，则自动调整
          if(!that.config.isMsgCenterMaxSize) {
              var _winH = $(win).height(),
                  _winW = $(win).width();
              
              if(_winH <= 768) {
                  that.height = 490;
              } else {
                  var _height = parseInt(_winH * .638);
                  that.height =  _height;
              }

              that.width = parseInt(that.height * 1.6);

              that.$msgCenter.css({
                  width: that.width,
                  height: that.height,
                  top: (_winH - that.height)/2 + 'px',
                  left:  (_winW - that.width)/2 + 'px'
              });
          } else {
              that.$msgCenter.css({
                  width: 'auto',
                  height: 'auto',
                  top: '10px',
                  left: '10px',
                  bottom: '10px',
                  right: '10px'
              });
          }
          
      },
      _showCover: function() {
          if(!document.getElementById(this.config.coverId)) {
              var _msgCenterDiv = document.createElement('div');
              _msgCenterDiv.id = this.config.coverId;
              _msgCenterDiv.className = this.config.coverId;
              document.body.appendChild(_msgCenterDiv);
          } else {
              $('#' + this.config.coverId).removeClass('hidden');
          }   
      },
      _hideCover: function() {
          $('#' + this.config.coverId).addClass('hidden');
      },
      refresh: function() {
          // 刷新右侧列表及消息数
          this._loadingListRequest();
          this._renderMsgTip();
      },
      show: function() {
          var that = this;
          this.isShow = true;

          that._initBaseRequest();

          // 最多显示两行处理
          /* if(that.$msg_clamp) {
              that._initBaseRequest();
          } else {
              Util.loadJs('frame/fui/js/widgets/msgcenter/clamp.min.js', function() {
                  that.$msg_clamp = $clamp; 
                  that._initBaseRequest();
              });
          } */
          
          this._showCover();
          this._adjustHeight();
          this.$msgCenter.show();
          
      },
      hide: function() {
          this.isShow = false;
          this.$msgCenter.hide();
          this._hideCover();
          if(this.$msgContent.hasClass('active')) {
              this.$msgEditBtn.trigger('click');
          }
          this.config.hideCallback();
      }
  });

  win.MsgCenter = MsgCenter;

})(window, jQuery);
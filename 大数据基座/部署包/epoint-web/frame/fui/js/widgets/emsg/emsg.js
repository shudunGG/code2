// jshint -W030
//EMsg聊天窗口定义
function EMsgDialog(currUserId) {
    var self = this,
        mine, currSession, sessionList = {};
    var win_status = 'close'; //窗口状态：close-关闭；max：打开；min：最小化

    var $emsgEMsg = $('#msgEMsg'),
        $emsgRecentList = $('.emsg-recent-list', $emsgEMsg);
    var $eMsgDialog = $('#emsgDialog'), //聊天窗口
        $eMsgSessionList = $('.emsg-session-list', $eMsgDialog), //会话列表
        $eMsgDialogHead = $('.emsg-dialog-head', $eMsgDialog), //窗口头部
        $eMsgMessagePanel = $('.emsg-message-panel', $eMsgDialog), //消息面板
        $eMsgText = $('.emsg-message-text', $eMsgDialog), //消息输入框
        $eMsgbar = $('.emsg-top-bar', $eMsgDialog), //对话框操作按钮
        $eMsgBtn = $('.emsg-btn-send', $eMsgDialog);

    // 是否启用回车发送
    this.useEnterSend = EmsgConfig.enterSend === true;
    if (this.useEnterSend) {
        $eMsgBtn[0].title = '按ENTER键发送';
    }

    var $currInfo = $('.emsg-session-info', $eMsgDialogHead), //活动用户顶部信息
        $currImg = $('.emsg-user-img img', $eMsgDialogHead), //活动用户头像
        $currName = $('.emsg-curr-name', $currInfo), //活动用户姓名
        $currDate = $('.emsg-group-date', $currInfo), //讨论组创建时间
        $reNameTxt = $('.emsg-group-rename', $currInfo); //对话框操作按钮

    var $notread = $('<i class=\'emsg-not-read\'></i>');

    var groupDialog;

    var M = Mustache,
        sessionItemTempl = Util.clearHtml($('#emsg-sessionitem-templ').html()), //新会话模板
        messagelistTempl = Util.clearHtml($('#emsg-messagelist-templ').html()), //会话窗口模板
        fileuploadTempl = Util.clearHtml($('#emsg-fileupload-templ').html()); //附件上传模板

    this.status = function () {
        return win_status;
    };

    //获取当前用户信息
    var getCurrentUserInfo = function () {
        getUserInfo().done(function (data) {
            mine = data;
            mine.imgUrl = mine.imgUrl || EmsgConfig.userImg;
        });

    };
    //获取个人信息
    var getUserInfo = function (userId) {
        var params = {
            'query': 'getuserinfo',
            'uid': userId
        };
        if (userId) {
            params.uid = userId;
        }
        var options = {
            url: EmsgConfig.baseUrl,
            data: params
        };
        if (!userId) {
            options.async = false;
        }
        return Util.ajax(options);
    };

    //获取讨论组信息
    var getGroupInfo = function (groupId) {
        return Util.ajax({
            url: EmsgConfig.baseUrl,
            data: {
                'query': 'getgroupinfo',
                'uid': groupId
            }
        });
    };

    //初始化滚动条
    var niceScroll = function () {
        if ($.nicescroll) {
            init_niceScroll();
        } else {
            Util.loadJs('/frame/fui/js/widgets/jquery.nicescroll.min.js', function () {
                init_niceScroll();
            });
        }

        function init_niceScroll() {
            $('.nicescroll', $eMsgDialog).niceScroll({
                cursorcolor: '#ff821b',
                horizrailenabled: false
            });
            $eMsgMessagePanel.niceScroll({
                cursorcolor: '#ff821b',
                horizrailenabled: false
            });
        }
    };

    //初始化表情
    var initEmotion = function () {
        Util.loadJs('/frame/fui/js/widgets/jquery.emotion.js', function () {
            $('.emsg-emotion-icon').emotion({
                target: '.emsg-message-text',
                path: '/' + Util.getRootPath().split('//')[1].split('/')[1] + '/frame/fui/js/widgets/emsg/images/emotion/'
            });
        });
    };

    var attachSizeLimit = parseInt(EmsgConfig.attachSizeLimit) || 5;
    //初始化上传控件
    var initUploader = function () {
        var allowType = ['gif', 'jpg', 'jpeg', 'bmp', 'png', 'rar', 'zip', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx', 'txt', 'pdf'],
            $uploadprocess;
        var uploader = WebUploader.create({
            dnd: '#EmsgText',
            auto: true,
            swf: Util.getRightUrl('/frame/fui/js/widgets/webuploader/Uploader.swf'),
            //server: "http://127.0.0.1:9004/webupload/Home/Uploader",
            server: Util.getRightUrl(EmsgConfig.baseUrl),
            pick: {
                id: '#fileUploader',
                multiple: false
            },
            duplicate: true,
            accept: {
                extensions: allowType.join(',')
            }
        });

        uploader.on('beforeFileQueued', function (file) {
            if (!eMsgSocket.isConnect()) {
                mini.showTips({
                    content: 'E讯已断开连接，无法发送消息！',
                    state: 'danger',
                    x: 'center',
                    y: 'center',
                    timeout: 2000
                });
                return false;
            }
            var ext = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase(),
                size = file.size;
            if ($.inArray(ext, allowType) == -1) {
                mini.alert('选择的格式不正确！');
                return false;
            }
            if (size == 0) {
                mini.alert('不能发送空文件！');
                return false;
            }
            if (size > attachSizeLimit * 1024 * 1024) {
                mini.alert('文件大小需小于' + attachSizeLimit + 'M！');
                return false;
            }
        });

        uploader.on('uploadStart', function (file) {
            var html = M.render(fileuploadTempl, {
                name: file.name,
                size: FixFileSize(file.size)
            });
            $uploadprocess = renderNewMessage(currSession.sessionId, {
                content: html,
                time: mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                IsSend: true,
                imgUrl: mine.imgUrl
            });
            uploader.options.formData = {
                'query': 'uploadfile',
                'sessionid': currSession.sessionId
            };

            $('.emsg-uploader-status', $uploadprocess).removeClass('down');
            $('.emsg-uploader-process', $uploadprocess).css('visibility', 'visible');

        });

        uploader.on('uploadProgress', function (file, percentage) {
            $('.emsg-process-inner', $uploadprocess).css('width', percentage * 100 + '%');
        });

        uploader.on('uploadSuccess', function (file, data) {
            data = data.custom;

            if (data.success === false) {
                mini.alert('上传失败' + (data.msg ? '：' + data.msg : ''));
                $uploadprocess.remove();
            } else {
                $('.emsg-uploader-status', $uploadprocess).addClass('success');
                $('.emsg-file-uploader', $uploadprocess).wrap($('<a/>', {
                    'class': 'emsg-file-down',
                    'href': Util.getRightUrl(data.href),
                    'target': '_blank'
                }));
            }

        });

        uploader.on('uploadError', function (file) {
            $('.emsg-uploader-status', $uploadprocess).addClass('fail');
            $('.emsg-file-reupload', $uploadprocess).show().on('click', function () {
                $uploadprocess.remove();
                uploader.retry();
            });
        });

        uploader.on('uploadComplete', function (file) {
            $('.emsg-uploader-process', $uploadprocess).css('visibility', 'hidden');
        });

        // 添加对csrf防御处理
        uploader.on('uploadBeforeSend', function (obj, data, headers) {
            var csrfcookie = $.cookie('_CSRFCOOKIE');
            if (csrfcookie) {
                headers.CSRFCOOKIE = csrfcookie;
            }
        });

    };

    //转换文件大小
    var FixFileSize = function (size) {
        var K = 1024,
            M = 1048576;
        if (size > M) {
            return (size / M).toFixed(2) + 'MB';
        } 
            return (size / K).toFixed(2) + 'KB';
        
    };

    //绑定事件
    var bindEvent = function () {
        $eMsgDialog.draggable({
            handle: $eMsgDialogHead,
            containment: 'body',
            cursor: 'move',
        });
        var $btnMin = $('.emsg-dialog-min', $eMsgDialog),
            $btnClose = $('.emsg-dialog-close', $eMsgDialog),
            $btnHistory = $('.emsg-history-link', $eMsgDialog);
        //最小化
        $btnMin.on('click', function () {
            if (!$(this).hasClass('max')) {
                self.show('min');
            } else {
                self.show('max');
            }
        });
        //关闭
        $btnClose.on('click', function () {
            if (getSessionCnt() == 1) {
                removeSession(currSession.sessionId);
                return;
            }
            mini.showMessageBox({
                title: '系统提示',
                message: '关闭此窗口所有会话还是仅关闭当前会话？',
                buttons: ['关闭所有', '关闭当前'],
                iconCls: 'mini-messagebox-question',
                callback: function (action) {
                    if (action == '关闭所有') {
                        close();
                    } else if(action == '关闭当前') {
                        removeSession(currSession.sessionId);
                    }
                }
            });
        });

        //会话列表点击
        $eMsgSessionList.on('click', '.emsg-session-item', function (event) {
            activeSession($(this).data('sessionid'));
        }).on('click', '.emsg-remove', function (e) {
            e.stopPropagation();
            var sessionid = $(this).closest('li').data('sessionid');
            removeSession(sessionid);
        });
        //加载历史消息
        $eMsgMessagePanel.on('click', '.emsg-load-link', function () {
            var $tab = $(this).closest('.emsg-message-tab');
            if ($(this).find('.emsg-load-icon').hasClass('nomore')) {
                return;
            }
            loadHistoryMessage($tab);
        });
        //发送消息快捷键
        $eMsgText.on('keydown', function (event) {
            // if (event.ctrlKey && event.keyCode == 13) {
            //     sendMessage();
            //     return false;
            // }
            var isEnter = event.which === 13,
                ctrl = event.ctrlKey,
                shift = event.shiftKey;
            if (!isEnter) {
                // 不是回车键 不响应
                return;
            }

            // 非回车发送时 ctrl + enter 发送
            if (!self.useEnterSend) {
                if (ctrl) {
                    sendMessage();
                    return false;
                }
                return;
            }

            // 回车发送时  仅能有回车键 不能有 ctrl、shift
            if (!ctrl && !shift) {
                sendMessage();
                return false;
            }
            // ctrl + enter 转化也换行符
            // shift + enter 本身就是换行 无须处理
            ctrl && insertBr();
        });
        // 直接回车发送时 ctrl、shift + enter 时需要插入换行符
        function insertBr() {
            var $br = $('<div><br></div>');
            var selection, range;
            if (window.getSelection) {
                selection = window.getSelection();
                range = selection.getRangeAt(0);
                range.insertNode($br[0]);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                selection.collapseToEnd();
            } else if (document.selection && document.selection.createRange) {
                selection = document.selection;
                range = selection.createRange();
                range.pasteHTML($br[0].outerHTML);
                range.collapse(false);
                range.select();
            } else {
                $br.appendTo($eMsgText);
                $eMsgText.focus();
            }
            $br = selection = range = null;
        }
        //讨论组重命名
        $currName.on('mousedown', function () {
            if ($(this).closest('.emsg-group-info').length == 0 || win_status == 'min') {
                return;
            }
            var w = $(this).width(),
                n = $(this).hide().html();
            $reNameTxt.data('origname', n).val(n).width(w).show().focus();
            return false;
        });

        $reNameTxt.on('keydown', function (event) {
            if (event.keyCode == 13) {
                $reNameTxt.trigger('blur');
            }
        }).on('blur', function () {
            var $this = $(this);
            var n = $this.hide().val();
            $currName.show();
            if ($.trim(n) == '') {
                return epoint.showTips('讨论组名称不能为空', {
                    state: 'error'
                });
            }
            if (n != $this.data('origname')) {
                Util.ajax({
                    url: EmsgConfig.baseUrl,
                    data: {
                        'query': 'renamegroup',
                        'groupid': currSession.uid,
                        'name': n
                    },
                    success: function (data) {
                        //需要groupdId。name。
                        //成功的时候
                        var res = data;
                        if (res.success) {
                            $currName.html(n);
                            $this.data('origname', res.name);
                            sessionList[currSession.sessionId].name = res.name;
                            var $li = getSessionNav(res.groupid);
                            $('.emsg-user-name', $li).html(res.name);
                        } else {
                            //处理失败的时候
                            mini.showTips({
                                content: '修改组名失败',
                                state: 'danger',
                                x: 'center',
                                y: 'center',
                                timeout: 2000
                            });
                        }

                    },
                    error: function () {
                        //失败的时候提示修改失败
                        mini.showTips({
                            content: '修改组名失败',
                            state: 'danger',
                            x: 'center',
                            y: 'center',
                            timeout: 2000
                        });
                    }
                });
            }
        });

        //发送邮件
        if (EmsgConfig.sendEmailUrl) {
            $eMsgDialogHead.find('.emsg-write-email').removeClass('hidden');

            var sendUrl = EmsgConfig.sendEmailUrl + (EmsgConfig.sendEmailUrl.indexOf('?') != -1 ? '&' : '?');

            $eMsgbar.on('click', '.emsg-write-email', function () {
                if (currSession.type == 'group') {
                    getGroupInfo(currSession.uid).done(function (data) {
                        var ids = $.map(data.members, function (e, i) {
                            return e.uid;
                        }).join(';');
                        // console.log("给" + ids + "发邮件");
                        // var url = "oa/epointdbmail/InnerEmailLeftMenuTree.jspx?moduleCode=00690002&UserGuidList=" + ids;
                        var url = sendUrl + 'ToUserGuidList=' + ids;
                        epoint.openDialog('发送邮件', url, '', {
                            'showCloseButton': true,
                            'showMaxButton': true,
                            'allowResize': true
                        });
                    });
                } else {
                    // console.log("给" + currSession.uid + "发邮件");
                    // var url = "oa/epointdbmail/InnerEmailLeftMenuTree.jspx?moduleCode=00690002&ToUserGuid=" + currSession.uid;
                    var url = sendUrl + 'ToUserGuid=' + currSession.uid;
                    epoint.openDialog('发送邮件', url, '', {
                        'showCloseButton': true,
                        'showMaxButton': true,
                        'allowResize': true
                    });
                }

            });
        }

        $eMsgbar.on('click', '.emsg-quit-group', function () { //退出讨论组
            var groupid = currSession.uid,
                sessionId = currSession.sessionId;
            mini.showMessageBox({
                title: '系统提示',
                message: '确定退出讨论组？',
                buttons: ['确定', '取消'],
                iconCls: 'mini-messagebox-question',
                callback: function (action) {
                    if (action == '确定') {
                        Util.ajax({
                            url: EmsgConfig.baseUrl,
                            data: {
                                'query': 'quitgroup',
                                'groupid': groupid
                            },
                            success: function (data) {
                                if (data.success == true) {
                                    removeSession(sessionId);
                                    if (RefreshEMsg) {
                                        RefreshEmsg();
                                    }
                                } else {
                                    mini.alert('退出失败！');
                                }
                            }
                        });
                    }
                }
            });

        }).on('click', '.emsg-create-group', function () { //创建讨论组
            if (!groupDialog) {
                groupDialog = new EMsgGroupDialog(currUserId);
            }
            if (currSession.type == 'friend') {
                groupDialog.createGroup([{
                    uid: mine.uid,
                    name: mine.name
                }, {
                    uid: currSession.uid,
                    name: currSession.name
                }]);
            } else {
                groupDialog.editGroup(currSession.uid);
            }
        });
        //发送消息
        $eMsgBtn.on('click', function () {
            sendMessage();
        });
        $btnHistory.on('click', function () {
            var url = EmsgConfig.historyUrl + '?exunsessionid=' + currSession.sessionId;

            url = Util.getRightUrl(url);

            if (EmsgConfig.onHistoryBtnClick) {
                EmsgConfig.onHistoryBtnClick(url, currSession);
            } else {
                TabsNav.addTab({
                    id: currSession.sessionId,
                    name: '和' + currSession.name + '聊天记录',
                    url: url
                });
            }

            self.show('min');
        });
    };

    //获取会话列表li
    var getSessionNav = function (sessionId) {
        return $eMsgSessionList.find('li[data-sessionid=\'' + sessionId + '\']');
    };
    //获取会话Tab
    var getSessionTab = function (sessionId) {
        return $eMsgMessagePanel.find('div[data-sessionid=\'' + sessionId + '\']');
    };

    //激活会话
    var activeSession = function (sessionId, isNewSession) {
        var $li = getSessionNav(sessionId);
        $li.siblings().removeClass('active').end().addClass('active');
        var s = sessionList[sessionId];
        currSession = s;
        if (s.type == 'group') {
            $currDate.html('创建日期：' + s.createDate).show();
            $currInfo.addClass('emsg-group-info');
        } else {
            $currInfo.removeClass('emsg-group-info');
            $currDate.hide();
        }
        $currImg.attr('src', s.imgUrl).on('error', function () {
            this.src = EmsgConfig.userImg;
            $currImg.off('error');
        });
        $currName.html(s.name).show();
        $reNameTxt.hide();
        var $ignore = $('.emsg-not-read', $li);
        if ($ignore.length) {
            $ignore.remove();
        }
        var saveMsg = $.trim($eMsgText.html());
        $eMsgText.empty();
        var orig_sessionId = $eMsgText.data('sessionId'),
            orig_li = getSessionNav(orig_sessionId);
        orig_li.data('saveMsg', saveMsg); //保存未发送的消息

        if (isNewSession === true) { //新会话
            requestHistoryMessage({
                sessionId: sessionId,
                pageIndex: 1
            }).done(function (data) {
                ignoreMessage(sessionId);
                var read, notread, idx = -1;
                if (s.type == 'friend') {
                    var messagelist = data.messagelist;
                    read = [];
                    notread = [];
                    for (var i = 0, l = messagelist.length; i < l; i++) {
                        if (!messagelist[i].readtime) {
                            idx = i;
                            break;
                        }
                    }
                    if (idx == -1) {
                        idx = messagelist.length;
                    }
                    read = messagelist.slice(0, idx);
                    notread = messagelist.slice(idx);
                } else {
                    read = {
                        'member': data.member
                    };
                    notread = {
                        'member': data.member
                    };
                    for (var i = 0, l = data.messagelist.length; i < l; i++) {
                        if (!data.messagelist[i].readtime) {
                            idx = i;
                            break;
                        }
                    }
                    if (idx == -1) {
                        idx = data.messagelist.length;
                    }
                    read.messagelist = data.messagelist.slice(0, idx);
                    notread.messagelist = data.messagelist.slice(idx);
                }
                renderHistoryMessage(notread, s);
                var tb = getSessionTab(sessionId);
                if (data.messagelist.length > 0) {
                    $('.emsg-message-list', tb).prepend('<li class=\'emsg-message-tip\'><i class=\'emsg-tip-icon\'></i>以上是历史消息</li>');
                }
                renderHistoryMessage(read, s, tb);

                // 滚动条加在了外面的panel上 这不用每次都加了                
                // tb.siblings().hide().end().show().data("page", 1).niceScroll({
                //     cursorcolor: "#ff821b",
                //     horizrailenabled: false
                // });
                tb.siblings().hide().end().show().data('page', 1);

                $eMsgMessagePanel.scrollTop(tb.prop('scrollHeight'));
                $eMsgText.empty();
            });
            updateSessionStatus(sessionId, 'open');
        } else {
            var tb = getSessionTab(sessionId).siblings().hide().end().show();
            $eMsgMessagePanel.scrollTop(tb.prop('scrollHeight')); //当前聊天窗口
            ignoreMessage(sessionId);
            var orig_Msg = $li.data('saveMsg'); //显示上一次未发送的消息
            if ($.trim(orig_Msg).length > 0) {
                $eMsgText.html($.trim(orig_Msg));
            }
        }
        $eMsgText.data('sessionId', sessionId);
        resetSelection($eMsgText[0]);
    };

    //移除聊天会话
    var removeSession = function (sessionId) {
        var $li = getSessionNav(sessionId),
            $tab = getSessionTab(sessionId);
        if ($li.hasClass('active')) {
            var activeLi;
            activeLi = $li.next();
            if (activeLi.length === 0) {
                activeLi = $li.prev();
            }
            if (activeLi.length > 0) {
                var activeSessionId = activeLi.data('sessionid');
                activeSession(activeSessionId, false);
            }
        }
        var $ignore = $('.emsg-not-read', $li);
        if ($ignore.length) {
            ignoreMessage(sessionId);
        }
        $li.remove();
        // $tab.getNiceScroll().remove();
        $tab.remove();
        updateSessionStatus(sessionId, 'close');

        delete sessionList[sessionId];
        if (getSessionCnt() === 0) {
            close();
        }
    };

    //标记新消息
    var markNewMessage = function (sessionId) {
        if (sessionId != currSession.sessionId) { //非当前聊天窗口
            var $li = getSessionNav(sessionId);
            if ($('.emsg-not-read', $li).length === 0) {
                $li.append($notread.clone());
            }
        } else {
            if (win_status == 'min') { //窗口最小化
                if ($('.emsg-not-read', $currInfo).length === 0) {
                    $currName.next().after($notread.clone());
                }
            }
        }
    };

    //忽略消息
    //之前方法在渲染、激活新会话的时候也触发，这是有问题的，
    //渲染和激活会话时，应该是取消提醒的动画，而不是彻底忽略消息，
    var ignoreMessage = function (sessionId) {
        Util.ajax({
            url: EmsgConfig.baseUrl,
            data: {
                'query': 'ignoremessage',
                'sessionid': sessionId
            },
            success: function (data) {}
        });
    };

    //刷新讨论组信息
    var refreshGroupInfo = function (sessionId, groupId) {
        if (!isInSession(sessionId)) {
            return;
        }
        getGroupInfo(groupId).done(function (info) {
            $.extend(info, {
                type: 'group',
                sessionId: sessionId,
                imgUrl: EmsgConfig.groupImg
            });
            sessionList[sessionId] = info;
            var $li = getSessionNav(sessionId);
            $('.emsg-user-name', $li).html(info.name);
            if (currSession.sessionId == sessionId) {
                $currName.html(info.name);
            }
        });
    };

    //判断是否在会话中
    var isInSession = function (sessionId) {
        if (typeof (sessionList[sessionId]) == 'undefined') {
            return false;
        }
        return true;
    };

    //获取会话数量
    var getSessionCnt = function () {
        var l = 0;
        for (var key in sessionList) {
            l++;
        }
        return l;
    };

    //关闭对话框
    var close = function () {
        $eMsgSessionList.empty();
        $.each($eMsgMessagePanel.children(), function (i, e) {
            $(e).getNiceScroll().remove();
        });
        $eMsgMessagePanel.empty();
        var sessionIds = [];
        for (var key in sessionList) {
            sessionIds.push(key);
        }
        updateSessionStatus(sessionIds, 'close');
        sessionList = {};
        $eMsgDialog.hide();
        $eMsgText.removeData('uid').empty();
        win_status = 'close';
    };

    //更新会话状态，提交服务器
    var updateSessionStatus = function (sessionIds, status) {
        if (!$.isArray(sessionIds)) {
            sessionIds = [sessionIds];
        }
        status = (status == 'open' ? 1 : 0);
        //Util.ajax({
        //    url: EmsgConfig.baseUrl,
        //    data: { 'query': 'updatestatus', 'sessionids': sessionIds, 'status': status },
        //    success: function (data) {
        //        if (data.success == true) {

        //        }
        //    }
        //});
    };

    //加载历史聊天记录
    var requestHistoryMessage = function (param, beforeSend) {
        return Util.ajax({
            url: EmsgConfig.baseUrl,
            beforeSend: beforeSend,
            data: {
                'query': 'loadhistorymessage',
                'sessionid': param.sessionId,
                'pageindex': param.pageIndex
            }
        });
    };

    //加载历史聊天记录
    var loadHistoryMessage = function (tab) {
        var pageindex = tab.data('page') + 1,
            $loadbtn = $('.emsg-load-link', tab),
            $loadIcon = $('.emsg-load-icon', $loadbtn),
            $loadText = $('.emsg-load-text', $loadbtn);
        tab.data('page', pageindex);
        var bs = function (XMLHttpRequest) {
                // Util.ajax方法默认会在beforeSend事件中处理csrf防御，在重写试需先掉用默认的处理方法
                if ($.ajaxSettings.beforeSend) {
                    $.ajaxSettings.beforeSend(XMLHttpRequest);
                }
                $loadIcon.addClass('loading');
                $loadText.html('加载等待');
            },
            sessionId = tab.data('sessionid');
        var s = sessionList[sessionId];
        requestHistoryMessage({
            sessionId: sessionId,
            pageIndex: pageindex
        }, bs).done(function (data) {
            $loadIcon.removeClass('loading');
            if (data.messagelist.length > 0) {
                if (s.type == 'friend') {
                    data = data.messagelist;
                }
                renderHistoryMessage(data, s, tab);
                $loadText.html('查看更多信息');
            } else {
                $loadIcon.addClass('nomore');
                $loadText.html('无更多信息');
            }
        });
    };

    //渲染聊天记录
    var renderHistoryMessage = function (data, s, tab) {
        var fixdata;
        if (s.type == 'friend') {
            fixdata = $.map(data, function (e, i) {
                if (e.uid == mine.uid) {
                    e.IsSend = true;
                    e.imgUrl = mine.imgUrl;
                } else {
                    e.IsReceive = true;
                    e.imgUrl = s.imgUrl;
                }
                // 还原换行符
                if (e.content) {
                    e.content = e.content.replace(/\n/g, '<br>');
                }
                if (e.type === 'file') {
                    var html = M.render(fileuploadTempl, {
                        name: e.content,
                        size: FixFileSize(e.size)
                    });
                    e.IsFile = true;
                    e.href = Util.getRightUrl(e.href);
                    e.content = html;
                }
                return e;
            });
        } else {
            var groupmember = [];
            $.each(data.member, function (i, e) {
                groupmember[e.uid] = e;
            });

            fixdata = $.map(data.messagelist, function (e, i) {
                e.IsGroup = true;
                if (e.uid == mine.uid) {
                    e.IsSend = true;
                    e.imgUrl = mine.imgUrl;
                } else {
                    e.IsReceive = true;
                    e.imgUrl = groupmember[e.uid].imgUrl || EmsgConfig.userImg;
                    e.name = groupmember[e.uid].name;
                }
                // 还原换行符
                if (e.content) {
                    e.content = e.content.replace(/\n/g, '<br>');
                }
                if (e.type === 'file') {
                    var html = M.render(fileuploadTempl, {
                        name: e.content,
                        size: FixFileSize(e.size)
                    });
                    e.IsFile = true;
                    e.href = Util.getRightUrl(e.href);
                    e.content = html;
                }
                return e;
            });
        }

        var $html;
        if (!tab) {
            $html = $(Util.clearHtml(M.render(messagelistTempl, {
                sessionId: s.sessionId,
                items: fixdata
            })));
            $html.appendTo($eMsgMessagePanel);
        } else {
            $html = $(Util.clearHtml(M.render(messagelistTempl, {
                hasHead: true,
                sessionId: s.sessionId,
                items: fixdata
            })));
            $html.prependTo($('.emsg-message-list', tab));
        }
        console.log($html);
    };

    //渲染新消息
    var renderNewMessage = function (sessionId, message) {
        var html = '',
            $html;
        // 还原换行符
        if (message.content) {
            message.content = message.content.replace(/\n/g, '<br>');
        }
        html = M.render(messagelistTempl, {
            hasHead: true,
            items: [message]
        });
        var $tab = getSessionTab(sessionId);
        $html = $(html);
        $html.appendTo($('.emsg-message-list', $tab));
        $eMsgMessagePanel.getNiceScroll().resize();
        $eMsgMessagePanel.scrollTop($tab.prop('scrollHeight'));
        ignoreMessage(sessionId);
        return $html;
    };

    //渲染系统消息
    var renderSystemMessage = function (sessionId, type, message) {
        var $tab = getSessionTab(sessionId);
        var msg1 = '',
            msg2 = '';
        if (type == 'renamegroup') {
            msg1 = message.member, msg2 = '将讨论组更名为<span class=\'emsg-tip-important\'>' + message.name + '</span>';
        } else if (type == 'quitgroup') {
            msg1 = message.member, msg2 = '退出讨论组';
        } else if (type == 'joingroup') {
            msg1 = message.members.join('、'), msg2 = '加入讨论组';
        } else if (type == 'receivedfile') {
            msg2 = '对方已成功接收了您发送的文件“' + message.name + '”';
        }
        $('.emsg-message-list', $tab).append('<li class=\'emsg-message-tip\'><i class=\'emsg-tip-icon\'></i><span class=\'emsg-tip-important\'>' + msg1 + '</span>' + msg2 + '</li>');
        $eMsgMessagePanel.getNiceScroll().resize();
        $eMsgMessagePanel.scrollTop($tab.prop('scrollHeight'));

    };

    //监听粘贴事件，如果浏览器不支持，则提示
    document.addEventListener('paste', function (event) {
        var isIE = function () {
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            return false;
        };

        var isFF = function () {
            if (isFirefox = navigator.userAgent.indexOf('Firefox') > 0) {
                return true;
            }
        };

        var isSuppotPic = function () {
            return isFF() || isIE();
        };

        if (event.clipboardData || event.originalEvent) {
            //not for ie11  某些chrome版本使用的是event.originalEvent
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if (clipboardData.items) {
                var items = clipboardData.items,
                    len = items.length;

                //在items里找粘贴的image,据上面分析,需要循环  
                for (var i = 0; i < len; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        if (!isSuppotPic()) {
                            mini.showTips({
                                content: '您当前浏览器不支发送截图，若要使用，请用IE',
                                state: 'danger',
                                x: 'center',
                                y: 'center',
                                timeout: 2000
                            });
                            //阻止默认行为即不让剪贴板内容在div中显示出来
                            event.preventDefault();
                        }
                    }
                }
            }
        }
    });

    var msgLengthLimit = EmsgConfig.msgLengthLimit === undefined ? 1000 : parseInt(EmsgConfig.msgLengthLimit);

    // 将转义的html还原
    function htmlDecode(str) {
        if (typeof str !== "string") return str;
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        // 空格不需要处理
        // s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");

        return s;
    }
    //发送消息
    var sendMessage = function () {
        var msg = $eMsgText.html();
        var regex = new RegExp('<img', 'g');
        var result = msg.match(regex);
        var count = !result ? 0 : result.length; //图片个数
        var textlen = count * 10 + msg.replace(/<.*?>/g, '').length;
        //var textlen = msg.replace(/<.*?>/g, '').length;
        // var textlen = msg.replace(/<.*?>/g, '').length;
        if (msgLengthLimit && textlen > msgLengthLimit) {
            // if (textlen > 990) {
            epoint.alert('输入的内容过长');
            return;
        }
        // 换行转化为 \n 以便显示时还原 
        // ! 注意此操作只是匹配了每行开始的标签 转化为 \n 已经破坏了正常的html结构 （需要与后面过滤掉所有标签结合使用）
        // msg = msg.replace(/<(?!(img|\/|br))[^>]*?>/g, '\n')
        msg = msg.replace(/<\/(?:div|p)>/ig, '\n')
            .replace(/<br>/g, '\n');

        msg = msg.replace(/<(?!img)[^>]*>/g, ''); //过滤除了图片外的其他html标签

        $eMsgText.empty();
        if ($.trim(msg.replace(/&nbsp;/ig, '').replace(/<br\s*\/?>/g, '')).length === 0) {
            $eMsgBtn.addClass('empty-tootip');
            setTimeout(function () {
                $eMsgBtn.removeClass('empty-tootip');
            }, 1000);
            return;
        }
        
        var message = {
            content: msg,
            time: mini.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            IsSend: true,
            imgUrl: mine.imgUrl
        };
        // 安全整改后要求用户输入什么就提交什么，服务端会对内容做处理。
        // 所以提交时需要把 html 标签转义还原回来
        msg = htmlDecode(msg);

        // 由于 url 识别功能无法处理有换行的情况，而服务端xss安全过滤又会把换行符过滤掉，就会导致接收方接收到的都是无换行的，但是有的却是一个链接，有的却没有生成链接这种表现不一致的情况
        // 所以经过讨论暂时先去掉该功能
        // // 只能识别纯 url 字符串。
        // // 若任意识别字符串中的 url ，会有误替换问题，如 url 是 image 的 src
        // var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
        // msg = msg.replace(reg, function (m) { return '<a href="' + m + '" target="_blank" >' + m + '</a>'; });

        var isSuccess = eMsgSocket.sendMessage(JSON.stringify({
            type: 'message',
            sessionid: currSession.sessionId,
            from_uid: mine.uid,
            from_name: mine.name,
            content: msg
        }));
        if (isSuccess) {
            renderNewMessage(currSession.sessionId, message);
        }
        resetSelection($eMsgText[0]);
    };

    //重置输入框光标
    var resetSelection = function (ele) {
        if ($.fn.emotion) {
            $(ele).emotion('resetCursor');
        }
    };

    //初始化
    this.init = function () {
        getCurrentUserInfo();
        bindEvent();
        niceScroll();
        initEmotion();

        if (window.WebUploader) {
            initUploader();
        } else {
            Util.loadJs('/frame/fui/js/widgets/webuploader/webuploader.min.js', function () {
                initUploader();
            });

        }
    };

    //打开会话
    this.openSession = function (sessionId, uid, type) {
        if (isInSession(sessionId)) {
            self.show('max');
            activeSession(sessionId, false);
        } else {
            var getInfo = (type == 'friend' ? getUserInfo(uid) : getGroupInfo(uid));
            getInfo.done(function (info) {
                // 防止多次连续请求而创建多个相同会话
                if (isInSession(sessionId)) {
                    self.show('max');
                    activeSession(sessionId, false);
                    return;
                }
                info.type = type;
                info.sessionId = sessionId;
                if (type === 'friend') {
                    info.imgUrl = info.imgUrl || EmsgConfig.userImg;
                }
                if (type == 'group') {
                    info.imgUrl = EmsgConfig.groupImg;
                    $.each(info.members, function (i, e) {
                        e.imgUrl = e.imgUrl || EmsgConfig.userImg;
                    });
                }
                sessionList[sessionId] = info;

                var html = M.render(sessionItemTempl, $.extend({}, info, {
                    sessionid: sessionId
                }));
                $eMsgSessionList.find('li').removeClass('active');
                $(Util.clearHtml(html)).prependTo($eMsgSessionList);
                activeSession(sessionId, true);
                self.show('max');
            }).fail(function () {
                mini.alert('E讯打开失败！');
            });
        }
    };

    //打开E讯聊天窗口，供外部调用
    this.open = function (userId) {
        if (userId == eMsgSocket.uid) {
            mini.alert('无法和自己聊天！');
            return;
        }
        Util.ajax({
            url: EmsgConfig.baseUrl,
            data: {
                'query': 'opensession',
                'userid': userId
            },
            success: function (data) {
                if (data.success == true) {
                    self.openSession(data.sessionid, userId, 'friend');
                } else {
                    mini.alert('E讯打开失败！');
                }
            },
            error: function (data) {
                mini.alert('E讯打开失败！');
            }
        });
    };

    //显示聊天窗口
    this.show = function (pos) {
        var dw = 800,
            dh = 540,
            $btnMin = $('.emsg-dialog-min', $eMsgDialog);
        if (!pos || pos === 'max') {
            if (win_status == pos) {
                return;
            }
            $eMsgDialog.draggable('enable');
            $('.emsg-not-read', $currInfo).remove();
            var t, l, orig_offset = $eMsgDialog.data('offset');
            if (orig_offset) {
                t = orig_offset.top;
                l = orig_offset.left;
            } else {
                t = ($(window).height() - dh) / 2;
                l = ($(window).width() - dw) / 2;
            }
            // 不能是负数
            if (t < 0) t = 0;
            if (l < 0) l = 0;
            $eMsgDialog.removeClass('bottom min').removeAttr('style').css({
                'left': l,
                'top': t,
                'width': dw,
                'height': dh,
                'font-size': 'inherit'
            });
            $eMsgDialog.show();
            win_status = 'max';
            $btnMin.removeClass('max').attr('title', '最小化');
            resetSelection($eMsgText[0]);
            if (pos === 'max') {
                var $tab = getSessionTab(currSession.sessionId);
                $eMsgMessagePanel.scrollTop($tab.prop('scrollHeight'));
            }
        } else {
            $eMsgText.blur();
            $reNameTxt.hide();
            $currName.html($(this).data('origname')).show();
            $eMsgDialog.data('offset', $eMsgDialog.offset());
            $eMsgDialog.draggable('disable');
            $eMsgDialog.effect('size', {
                to: {
                    width: 250,
                    height: 42
                }
            }, 300, function () {
                $(this).addClass('min');
            }).effect('transfer', {
                to: '.emsg-mindialog',
                className: 'emsg-dialog-transfer'
            }, 500, function () {
                $(this).css({
                    left: '',
                    top: ''
                }).addClass('bottom');

            });

            win_status = 'min';
            $btnMin.addClass('max').attr('title', '最大化');
        }

        $eMsgDialog.css('z-index', Util.getZIndex());
    };

    //接受消息
    this.receiveMessage = function (message) {
        var sessionid = message.sessionid,
            type = message.type;
        if (isInSession(sessionid)) {
            var session = sessionList[sessionid];
            markNewMessage(session.sessionId);
            if (type == 'message' || type == 'file') {
                var msgObj = {
                    IsReceive: true,
                    imgUrl: session.imgUrl,
                    content: message.content,
                    time: message.time
                };
                if (type == 'file') {
                    var html = M.render(fileuploadTempl, {
                        name: message.content,
                        size: FixFileSize(message.size)
                    });
                    $.extend(msgObj, {
                        IsFile: true,
                        href: Util.getRightUrl(message.href),
                        content: html
                    });
                }
                if (session.type == 'group') {
                    msgObj.IsGroup = true;
                    var from_user;
                    $.each(session.members, function (i, e) {
                        if (e.uid == message.from_uid) {
                            from_user = e;
                            return false;
                        }
                    });
                    if (from_user == null) {
                        getUserInfo(message.from_uid).done(function (info) {
                            msgObj.imgUrl = info.imgUrl || EmsgConfig.userImg;
                            msgObj.name = info.name;
                            renderNewMessage(sessionid, msgObj);
                        });
                        return;
                    }
                    msgObj.imgUrl = from_user.imgUrl;
                    msgObj.name = from_user.name;
                }
                renderNewMessage(sessionid, msgObj);
            } else if ($.inArray(type, ['renamegroup', 'quitgroup', 'joingroup', 'receivedfile']) > -1) {
                if (session.type == 'renamegroup') {
                    //修改组名
                    var $li = getSessionNav(sessionid);
                    $('.emsg-user-name', $li).html(message.name);
                    $currName.html(message.name);
                }

                renderSystemMessage(sessionid, type, message);

                if (type !== 'receivedfile') {
                    refreshGroupInfo(sessionid, message.groupid);
                }
            }
        }
    };

    //初始化
    this.init();
}

//讨论组编辑对话框
function EMsgGroupDialog(currUserId) {

    var $emsgGroupLayer = $('.emsg-cgroup-layer'),
        $emsgGroupDialog = $('.emsg-cgroup-dialog'),
        $emsgGroupTitle = $('.emsg-cgroup-title', $emsgGroupDialog),
        $emsgGroupList = $('.emsg-cgroup-list', $emsgGroupDialog),
        $emsgGroupSrc = $('.emsg-cgroup-src', $emsgGroupDialog),
        $emsgGroupFilter = $('.emsg-cgroup-filter', $emsgGroupDialog),
        emsgGroupTree, groupId = null;

    //绑定事件
    var bindEvent = function () {
        $emsgGroupDialog.draggable({
            handle: $emsgGroupTitle,
            containment: 'body',
            cursor: 'move',
        });

        $emsgGroupDialog.on('click', '.emsg-cgroup-close', function () {
            if ($('.remove', $emsgGroupList).length > 0) {

                mini.confirm('是否保存修改？', '系统提示',
                    function (action) {
                        if (action == 'ok') {
                            saveGroupConfig();
                        } else {
                            closeGroupDialog();
                        }
                    }
                );
                // var closeConfirm = new TipDialog({
                //     title: '系统提示',
                //     type: 'confirm',
                //     showClose: true,
                //     msg: '是否保存修改？',
                //     btns: [{
                //         role: 'yes',
                //         text: '确定'
                //     }, {
                //         role: 'cancel',
                //         text: '取消'
                //     }],

                //     callback: function (role, options) {
                //         if (role == 'yes') {
                //             saveGroupConfig();
                //         } else if (role == 'cancel') {
                //             closeGroupDialog();
                //         }
                //     }
                // });
                // closeConfirm.show(true);
            } else {
                closeGroupDialog();
            }
        }).on('click', '.emsg-btn-cancle', function () {
            closeGroupDialog();
        }).on('click', '.emsg-btn-ok', function () {
            saveGroupConfig();
        });

        $emsgGroupFilter.on('keyup', function (event) {
            // 回车触发搜索
            if (event.keyCode == 13) {
                var key = $(this).val();
                if (key == '') {
                    emsgGroupTree.clearFilter();
                    emsgGroupTree.collapseAll();
                } else {
                    key = key.toLowerCase();
                    emsgGroupTree.filter(function (node) {
                        var name = node.name ? node.name.toLowerCase() : '';
                        if (name.indexOf(key) != -1) {
                            return true;
                        }
                    });
                    emsgGroupTree.expandAll();
                }
            }
        });

        $emsgGroupList.on('click', '.remove', function () {
            $(this.parentNode).remove();
        });

        $emsgGroupLayer.click(function () {
            $emsgGroupDialog.addClass('zoom');
        });
        $emsgGroupDialog.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
            $emsgGroupDialog.removeClass('zoom');
        });
    };

    //初始化讨论组选人控件
    var init = function () {
        emsgGroupTree = new mini.Tree(),
            emsgGroupTree.set({
                idField: 'guid',
                textField: 'name',
                nodesField: 'items',
                autoLoad: true,
                resultAsTree: true
            });
        emsgGroupTree.on('drawnode', function (e) {
            var tree = e.sender;
            var node = e.node;

            var isLeaf = !node.items;

            if (isLeaf === true) {
                // e.iconCls = "msg-org-people";
            } else {
                e.nodeHtml = '<span class=\'mini-tree-nodetext\'>' + e.node.name + '</span><i class=\'emsg-cgroup-additem\' title=\'添加\'></i>';
                // e.iconCls = "msg-org-folder";
            }
        }).on('nodeclick', function (e) {
            var node = e.node,
                items = node.items;
            if ($(e.htmlEvent.target).hasClass('emsg-cgroup-additem')) {
                if (items) {
                    addNode(node);
                }
                return;
            }
            if (!items || !items.length) {
                addPeople(node);
            } else {
                var isExpande = emsgGroupTree.isExpandedNode(node);
                if (isExpande) {
                    emsgGroupTree.collapseNode(node);
                } else {
                    emsgGroupTree.expandNode(node);
                }
            }
        });
        emsgGroupTree.render(document.getElementById('emsg_group'));
        initGroupTree();
        bindEvent();
    };

    var initGroupTree = function () {
        Util.ajax({
            url: EmsgConfig.treeUrl,
            dataType: 'json',
            success: function (data) {
                emsgGroupTree.loadData(data);
            }
        });
    };

    //选中节点
    var addNode = function (node) {
        var items = node.items;
        if (items) {
            for (var i = 0, len = items.length; i < len; i++) {
                addNode(items[i]);
            }
        } else {
            addPeople(node);
        }
    };

    //加入成员
    var addPeople = function (node) {
        var $li = $emsgGroupList.find('li[uid="' + node.guid + '"]');
        if ($li.length === 0) {
            renderPeople(node.guid, node.name, true);
        }
    };

    //渲染成员Html
    var renderPeople = function (id, name, candel) {
        var $li = $('<li uid=\'' + id + '\' class=\'emsg-cgroup-item\'><span class=\'name\'>' + name + '</span></li>');
        if (candel) {
            $li.append('<i title=\'删除\' class=\'remove\'>×</i>');
        }
        $emsgGroupList.append($li);
    };

    //初始化原有讨论组成员
    var initGroupMember = function (members) {
        if ($.isArray(members)) {
            $.each(members, function (i, e) {
                renderPeople(e.uid, e.name);
            });
        } else {
            //获取讨论组信息
            Util.ajax({
                url: EmsgConfig.baseUrl,
                data: {
                    'query': 'getgroupinfo',
                    uid: groupId
                },
                success: function (data) {
                    $.each(data.members, function (i, e) {
                        var isSelf = e.uid === currUserId || e.uid === window._userGuid_;
                        renderPeople(e.uid, e.name, !isSelf);
                    });
                }
            });
        }
    };

    //打开编辑讨论组对话框
    var openGroupDialog = function () {
        $emsgGroupFilter.val('');
        var t = ($(window).height() - 400) / 2,
            l = ($(window).width() - 500) / 2;
        $emsgGroupDialog.css({
            left: l,
            top: t,
            'z-index': Util.getZIndex()
        }).show();
        $emsgGroupLayer.show();
    };

    //关闭讨论组对话框
    var closeGroupDialog = function () {
        $emsgGroupDialog.hide();
        $emsgGroupLayer.hide();
        emsgGroupTree.uncheckAllNodes();
        emsgGroupTree.collapseAll();
        $emsgGroupList.empty();
        groupId = null;
    };

    //保存讨论组设置
    var saveGroupConfig = function () {
        var $lis = $('li', $emsgGroupList),
            ids = [],
            groupname = '',
            membername = '';
        $lis.each(function (i, li) {
            ids.push($(this).attr('uid'));
            membername = $(this).find('span').text();
            if (groupname.length < 10 && groupname.length + membername.length < 10) {
                groupname += membername + '、';
            }
        });
        if (groupname == '') {
            groupname = $lis.eq(0).find('span').text();
        } else {
            groupname = groupname.substr(0, groupname.length - 1);
        }
        if (ids.length <= 2) {
            mini.showTips({
                content: '请选择讨论组成员！',
                state: 'danger',
                x: 'center',
                y: 'center',
                timeout: 1000
            });
            return false;
        }
        var params = {
            'query': 'creategroup',
            'memberids': ids.join(';')
        };
        if (groupId) {
            params.groupid = groupId;
            params.query = 'editgroup';
        } else {
            params.groupname = groupname;
        }
        Util.ajax({
            url: EmsgConfig.baseUrl,
            data: params,
            success: function (data) {
                if (data.success == true && data.sessionid) {
                    eMsg.openSession(data.sessionid, data.groupid, 'group'); //新建讨论组(编辑讨论组的刷新通过后台WebSocket推送)
                }
                closeGroupDialog();
            },
            error: function () {
                closeGroupDialog();
                mini.alert('讨论组编辑失败！');
            }
        });
    };

    //创建讨论组
    this.createGroup = function (members) {
        var title = '创建讨论组';
        if (groupId) {
            title = '编辑讨论组';
        }
        $emsgGroupTitle.html(title);
        openGroupDialog();
        initGroupTree();
        initGroupMember(members);
    };

    //编辑讨论组
    this.editGroup = function (groupid) {
        groupId = groupid;
        this.createGroup();
    };
    init();
}

//消息通讯WebSocket
function EMsgSocket(uid, uname, socket) {
    this.uid = uid;
    this.uname = uname;

    var subSocket = socket.subSocket;

    // var socket = atmosphere;
    // var subSocket;
    // var transport = 'websocket';

    // var request = {
    //     url: EmsgConfig.websocketUrl,
    //     contentType: "application/json",
    //     transport: transport,
    //     reconnectInterval: 5000,
    //     maxReconnectOnClose: 100,
    //     headers: {
    //         "uid": uid,
    //         "uname": uname
    //     }
    // };
    // request.onTransportFailure = function (errorMsg, request) {
    //     request.fallbackTransport = "long-polling";
    //     transport = "long-polling";
    // };
    // request.onMessage = function (response) {
    //     var msgStr = response.responseBody;
    //     var msgObj;
    //     try {
    //         if (transport == "long-polling") { //处理在长轮训的情况下，可能请求到多条消息
    //             msgStr = "[" + msgStr.replace(/}{/g, '},{') + "]";
    //             msgObj = atmosphere.util.parseJSON(msgStr);
    //             $.each(msgObj, function (i, e) {
    //                 handleMsgObj(e);
    //             });
    //         } else {
    //             msgObj = atmosphere.util.parseJSON(msgStr);
    //             handleMsgObj(msgObj);
    //         }
    //     } catch (e) {
    //         return;
    //     }
    // };

    // var handleMsgObj = function (data) {
    //     // 相应事件触发
    //     socketEvent.fire(data.type, data);
    // };

    var errorMsg = function (msg) {
        mini.showTips({
            content: msg,
            state: 'danger',
            x: 'center',
            y: 'center',
            timeout: 2000
        });
    };

    // request.onClose = function (response) {
    //     if (!EmsgConfig.showErrorMsg) {
    //         return false;
    //     }
    //     setTimeout(function () {
    //         errorMsg(EmsgConfig.closeMsg || "E讯已断开连接，请尝试重新登录！");
    //     }, 3000);
    // };

    // request.onError = function (response) {
    //     if (!EmsgConfig.showErrorMsg) {
    //         return false;
    //     }
    //     setTimeout(function () {
    //         errorMsg(EmsgConfig.errorMsg || "E讯连接出现错误，请联系管理员！");
    //     }, 3000);
    // };

    // request.onReconnect = function (request, response) {};

    // 如果有自定义Request配置 进行合并
    // if (diyRequest) {
    //     $.extend(request, diyRequest);
    // }

    // subSocket = socket.subscribe(request);

    this.sendMessage = function (message) {
        if (!subSocket.request.isOpen) {
            errorMsg('E讯已断开连接，无法发送消息！');
            return false;
        }
        subSocket.push(message);
        return true;
    };
    this.isConnect = function () {
        return subSocket.request.isOpen;
    };
    this.close = function () {
        atmosphere.unsubscribe();
    };

    /**
     * 实现一个自定义事件，用以根据类型触发相应的处理函数
     */
    // function UserEvent() {
    //     this.events = {};
    // }
    // UserEvent.prototype = {
    //     constructor: UserEvent,
    //     on: function (type, fn) {
    //         if (!this.events[type]) {
    //             this.events[type] = [];
    //         }
    //         this.events[type].push(fn);
    //     },
    //     fire: function (type, data) {
    //         var eventArr = this.events[type];
    //         if (!eventArr || !eventArr.length) return;
    //         for (var i = 0, l = eventArr.length; i < l; ++i) {
    //             eventArr[i]({
    //                 type: type,
    //                 target: this,
    //                 data: data
    //             });
    //         }
    //     },
    //     off: function (type, fn) {
    //         var eventArr = this.events[type];
    //         if (!eventArr || !eventArr.length) return;

    //         if (!fn) {
    //             eventArr = [];
    //         } else {
    //             for (var i = 0, l = eventArr.length; i < l; ++i) {
    //                 if (fn === eventArr[i]) {
    //                     break;
    //                 }
    //                 eventArr.splice(i, 1);
    //             }
    //         }
    //     }
    // };

    // 桌面右下角消息提醒
    var infodict = {};
    var msgNotify = function (message) {
        var sessiontype = message.sessiontype,
            querydata;
        if (sessiontype == 'friend') {
            querydata = {
                'query': 'getuserinfo',
                'uid': message.from_uid
            };
        } else {
            querydata = {
                'query': 'getgroupinfo',
                'uid': message.sessionid
            };
        }
        if (typeof (infodict[querydata.uid]) == 'undefined') {
            Util.ajax({
                url: EmsgConfig.baseUrl,
                data: querydata
            }).done(function (info) {
                if (sessiontype == 'friend') {
                    info.imgUrl = info.imgUrl || EmsgConfig.userImg;
                } else {
                    info.imgUrl = EmsgConfig.groupImg;
                }
                infodict[querydata.uid] = info;
                winNotify(info.name, {
                    body: message.content,
                    icon: info.imgUrl
                });

            }).fail(function () {

            });
        } else {
            var info = infodict[querydata.uid];
            winNotify(info.name, {
                body: message.content,
                icon: info.imgUrl
            });
        }

    };
    var winNotify = function (title, options, interval) {
        var n;
        if (typeof options == 'string') {
            options = {
                body: options
            };
        }
        if (!('Notification' in window)) {
            return false;
        } else if (Notification.permission === 'granted') {
            n = new Notification(title, options);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === 'granted') {
                    n = new Notification(title, options);
                }
            });
        }
        setTimeout(function () {
            n.close();
        }, interval || 3000);
    };
    // websocket  收到消息的事件监听对象
    var socketEvent = socket.socketEvent;
    this.socketEvent = socketEvent;
    // 消息提醒 消息提醒改为了轮训方式 这里不用处理了
    // socketEvent.on('messagecount', function (e) {
    // NewMessageRemind(e.data);
    // });
    // E 讯消息
    function emsgMessage(data) {
        if (eMsg) {
            eMsg.receiveMessage(data);
        }
        if (!eMsg || eMsg.status() != 'max') {
            if (data.type == 'message' || data.type == 'file') {
                msgNotify(data);
            }
        }
        if ($.inArray(data.type, ['message', 'creategroup', 'joingroup']) > -1) {
            window.RefreshEMsg && RefreshEMsg();
        }
    }
    socketEvent.on('message', function (e) {
        emsgMessage(e.data);
    });
    socketEvent.on('file', function (e) {
        emsgMessage(e.data);
    });

    socketEvent.on('renamegroup', function (e) {
        emsgMessage(e.data);
    });

    // remotelogin
    socketEvent.on('remotelogin', function (e) {
        var data = e.data;
        epoint.alert(data.message, '系统提示', function (action) {
            if (UserConfig.onLogout) {
                UserConfig.onLogout();
            }
        });
    });
    // config
    socketEvent.on('config', function (e) {
        EmsgConfig.showErrorMsg = e.data.showerrormsg;
    });

    // 实例化E讯窗口对象
    window.eMsg = new EMsgDialog(uid);
}
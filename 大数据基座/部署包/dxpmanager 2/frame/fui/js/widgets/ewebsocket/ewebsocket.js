// 建立websocket链接
(function (win) {
    function EWebSocket(cfg) {
        this.transport = 'websocket';

        this.showErrorMsg = true;
        this.socketCloseMsg = "websocket已断开连接，请尝试重新登录！";
        this.socketErrorMsg = "websocket连接出现错误，请联系管理员！";

        var request = {
            url: cfg.url,
            contentType: "application/json",
            transport: this.transport,
            reconnectInterval: 5000,
            maxReconnectOnClose: 10,
            maxRequest: 10,
            headers: {
                "uid": cfg.uid,
                "uname": cfg.uname
            }
        };

        var self = this;
        request.onTransportFailure = function (errorMsg, request) {
            request.fallbackTransport = "long-polling";
            self.transport = "long-polling";
        };

        request.onMessage = function (response) {
            var msgStr = response.responseBody;
            var msgObj;
            try {
                if (self.transport == "long-polling") { //处理在长轮训的情况下，可能请求到多条消息
                    msgStr = "[" + msgStr.replace(/}{/g, '},{') + "]";
                    msgObj = atmosphere.util.parseJSON(msgStr);
                    $.each(msgObj, function (i, e) {
                        handleMsgObj(e);
                    });
                } else {
                    msgObj = atmosphere.util.parseJSON(msgStr);
                    handleMsgObj(msgObj);
                }
            } catch (e) {
                return;
            }
        };

        // websocket  收到消息的事件监听对象
        this.socketEvent = new Util.UserEvent();

        var handleMsgObj = function (data) {
            // 相应事件触发
            if(data.type) {
                self.socketEvent.fire(data.type, data);
            }
        };

        var errorMsg = function (msg) {
            mini.showTips({
                content: msg,
                state: "danger",
                x: "center",
                y: "center",
                timeout: 2000
            });
        };

        request.onClose = function (response) {
            if (!self.showErrorMsg) {
                return false;
            }
            setTimeout(function () {
                errorMsg(self.socketCloseMsg);
            }, 3000);
        };

        request.onError = function (response) {
            if (!self.showErrorMsg) {
                return false;
            }
            setTimeout(function () {
                errorMsg(self.socketErrorMsg);
            }, 3000);
        };

        request.onReconnect = function (request, response) {};
        // 如果有自定义Request配置 进行合并
        if (cfg) {
            if (cfg.showErrorMsg !== undefined) {
                this.showErrorMsg = cfg.showErrorMsg;
                delete cfg.showErrorMsg;
            }
            if (cfg.socketCloseMsg) {
                this.socketCloseMsg = cfg.socketCloseMsg;
                delete cfg.socketCloseMsg;
            }
            if (cfg.socketErrorMsg) {
                this.socketErrorMsg = cfg.socketErrorMsg;
                delete cfg.socketErrorMsg;
            }

            $.extend(request, cfg);
        }

        this.subSocket = atmosphere.subscribe(request);

        this.close = function () {
            atmosphere.unsubscribe();
        };

        this.openEmsg = function (sessionid, uid, type) {
            var self = this;
            var tplFlag='frame/fui/js/widgets/emsg/emsg.tpl';
            Util.ajax({
                url: Util.getRightUrl("rest/exundataaction/getSmVersionData?isCommondto=true",""),
                
            }).done(function (data) {
            	//如果是涉密版本，Exun不能上传附件
            	if(data && data.flag){
            		tplFlag = 'frame/fui/js/widgets/emsg/emsg2.tpl';
                }
            	
            	Util.loadPageModule({
                    templ: tplFlag,
                    js: 'frame/fui/js/widgets/emsg/emsg.js',
                    css: 'frame/fui/js/widgets/emsg/emsg.css',
                    callback: function () {
                        win.eMsgSocket = new EMsgSocket(_userGuid_, _userName_, self);
                        if (typeof uid === 'undefined') {
                            eMsg.open(sessionid);
                        } else {
                            eMsg.openSession(sessionid, uid, type);
                        }
                    }
                });
            });  
        };

    }

    win.EWebSocket = EWebSocket;

}(this));
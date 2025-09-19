function IndexWebSocket(uid, utype, websocketUrl) {
	var socket = atmosphere;
	var subSocket;
	var transport = 'websocket';

	var request = {
		url : websocketUrl,
		contentType : "application/json",
		transport : transport,
		reconnectInterval : 5000,
		headers : {
			"uid" : uid
		}
	};
	request.onTransportFailure = function(errorMsg, request) {
		// request.fallbackTransport = "long-polling";
		// transport = "long-polling";
	};
	request.onMessage = function(response) {
		var msgStr = response.responseBody;
		try {
			if (transport == "long-polling") { // 处理在长轮训的情况下，可能请求到多条消息
				msgStr = "[" + msgStr.replace(/}{/g, '},{') + "]";
				var msgObj = atmosphere.util.parseJSON(msgStr);
				$.each(msgObj, function(i, e) {
					handleMsgObj(e);
				});
			} else {
				var msgObj = atmosphere.util.parseJSON(msgStr);
				handleMsgObj(msgObj);
			}
		} catch (e) {
			return;
		}
	};

	var handleMsgObj = function(msgObj) {
		if ("showlog" == msgObj.type) {
			showlog(msgObj.content);
			// alert("zzzp");
			// updateStatus(msgObj.biaoduanguid, msgObj.status);
		} else if ("changestatus" == msgObj.type) {
			var jsonobj = JSON.parse(msgObj.content);
			changestatus(jsonobj.key, jsonobj.value);
		} else if ("sendcachelog" == msgObj.type) {
			var jsonobj = JSON.parse(msgObj.content);
			sendcachelog(jsonobj);
		}
	};

	var errorMsg = function(msg) {
		mini.showTips({
			content : msg,
			state : "danger",
			x : "center",
			y : "center",
			timeout : 2000
		});
	};

	request.onClose = function(response) {
		setTimeout(function() {
			// errorMsg("E讯已断开连接，请尝试重新登录！");
		}, 3000);
	};

	request.onError = function(response) {
		setTimeout(function() {
			// errorMsg("E讯连接出现错误，请联系管理员！");
		}, 3000);
	};

	request.onReconnect = function(request, response) {
	};

	subSocket = socket.subscribe(request);

	this.sendMessage = function(message) {
		if (!subSocket.request.isOpen) {
			// errorMsg("E讯已断开连接，无法发送消息！");
			return false;
		}
		subSocket.push(message);
		return true;
	};
	this.isConnect = function() {
		return subSocket.request.isOpen;
	};
	this.close = function() {
		socket.unsubscribe();
	};
	this.uid = uid;
}
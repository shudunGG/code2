/**!
 * 首页
 * date:2020-09-16
 * author: xhz;
 */

// 参数解析
function parseParam(paramstr) {
	var params = {};
	$.each(paramstr.split('&'), function (i, item) {
		// base64 编码情况下 base64尾部可能是有 0~2个 = 的 不能直接split
		var splitIdx = item.indexOf('=');
		var k, v;
		if (splitIdx !== -1) {
			k = item.substr(0, splitIdx);
			v = decodeURIComponent(item.substr(splitIdx + 1));
		} else {
			k = item;
			v = '';
		}
		var type = getType(params[k]);

		if (type == 'undefined') {
			params[k] = v;
		} else if (type == 'string') {
			params[k] = [params[k], v];
		} else if (type == 'array') {
			params[k].push(v);
		}
	});
	return params;
}

function getType(obj) {
	var s = Object.prototype.toString.call(obj);
	return s.substring(8, s.length - 1).toLowerCase();
}

// 数据建模流程
Mock.mock(/getflow/, function (options) {
	data = Mock.mock({
		controls: [],
		custom: {
			list: [
				{
					img: 'images/flow-icon1.png',
					name: 'Step1:流程开发',
					txt: '@cword(10,30)',
				},
				{
					img: 'images/flow-icon2.png',
					name: 'Step2:流程测试',
					txt: '@cword(10,30)',
				},
				{
					img: 'images/flow-icon3.png',
					name: 'Step3:流程部署',
					txt: '@cword(10,30)',
				},
				{
					img: 'images/flow-icon4.png',
					name: 'Step4:任务运维',
					txt: '@cword(10,30)',
				},
			],
		},
		status: {
			code: 200,
			text: '',
			url: '',
		},
	});
	return data;
});

// 平台模型数据统计
Mock.mock(/getplatform/, function (options) {
	data = Mock.mock({
		controls: [],
		custom: {
			total: [
				{
					name: '累计模型',
					value: '@integer(0,1000)',
				},
				{
					name: '近一周使用率',
					value: '13.33%',
				},
			],
			statistics: {
				name: ['9-21', '9-22', '9-23', '9-24', '9-25', '9-26', '9-27'],
				'data|7': ['@integer(0,100)'],
			},
		},
		status: {
			code: 200,
			text: '',
			url: '',
		},
	});
	return data;
});

// 近一周个人使用情况统计
Mock.mock(/getmodelUseData/, function (options) {
	data = Mock.mock({
		controls: [],
		custom: {
			statistics: {
				name: ['9-21', '9-22', '9-23', '9-24', '9-25', '9-26', '9-27'],
				'fileData|7': ['@integer(0,100)'],
				'DataBaseData|7': ['@integer(0,100)'],
			},
		},
		status: {
			code: 200,
			text: '',
			url: '',
		},
	});
	return data;
});

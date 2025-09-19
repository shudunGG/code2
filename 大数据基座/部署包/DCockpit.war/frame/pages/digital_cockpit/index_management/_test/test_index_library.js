/**!
 * 部门标签页
 * date:2021-03-15
 * author: guohanyu;
 */

'use strict';

// 获取参数
function getParams(options, prop) {
	var params = {};
	var bodyArr = options.body.split('&');
	$.each(bodyArr, function (i, item) {
		var tmp = item.split('='),
			key = tmp[0],
			val = tmp[1];

		if (typeof params[key] === 'undefined') {
			params[key] = val;
		} else if (typeof params[key] === 'string') {
			params[key] = [params[key], val];
		} else {
			params[key].push(val);
		}
	});
	var rt = prop ? params[prop] : params;
	return rt;
}


// 左侧导航主体详细信息
Mock.mock(/getNavInfo/, function () {
	var	data = Mock.mock({
		'controls': [],
		'custom': {
			'name': '@cword(2,8)', // 主体名称
			'alias': '@cword(2,8)', // 别名
			'describe': '@cword(2,40)' // 描述
		},
		'status': {
			'code': 200,
			'text': '',
			'url': ''
		}
	});
	return data;
});

// 标签
Mock.mock(/getLabelsData/, function () {
	var	data = Mock.mock({
		'controls': [],
		'custom': {
			'labels|20': [{
				'id': '@id()',
				'name': '@cword(2,10)', // 标签名称
				'status': '@integer(0,2)', // 状态：0：未申请 1：审批中 2: 已申请
				
			}],
		},
		'status': {
			'code': 200,
			'text': '',
			'url': ''
		}
	});
	return data;
});

// 标签详情
Mock.mock(/getLabelDetailData/, function () {
	var	data = Mock.mock({
		'controls': [],
		'custom': {
			'name': '@cword(2,10)', // 标签名称
			'createTime': '@date(yyyy-MM-dd HH:mm:ss)', // 创建时间	
			'provideDept': '民政局', // 所属部门	
			'charge': '@cword(2)', // 负责人
			'phone': '13813813888', // 联系方式	
		},
		'status': {
			'code': 200,
			'text': '',
			'url': ''
		}
	});
	return data;
});

// 搜索列表
Mock.mock(/getSearchList/, function (options) {
	var search = decodeURIComponent(getParams(options, 'search_key'));
	var data = Mock.mock({
		'data|6': [{
			'id|+1': 1,
			value: search + '@ctitle(0,2)',
		}],
	});

	return {
		'controls': [],
		'custom': data,
		'status': {
			'code': 200,
			'text': '',
			'url': ''
		}
	};
});

// 左侧导航列表渲染
Mock.mock(/getLeftNavData/, function () {
	var data = Mock.mock({
		'navList|20': [{
			'guid': '@guid',
			'mark|1':['mark',''], // 部门前是否带有图标样式,
			'name':'@cword(4)' // 部门名称
		}],
	});

	return {
		'controls': [],
		'custom': data,
		'status': {
			'code': 200,
			'text': '',
			'url': ''
		}
	};
});
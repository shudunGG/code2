/**
 * 卡片模板管理
 * date: 2020-03-16
 * author: guohanyu
 **/

'use strict';

/**
 * 卡片列表
 * 
 * @param {integer} pageIndex 第几页，初始0
 * @param {integer} pageSize 页大小，初始12
 * @param {String} type 状态类型
 * @param {String} keyword 搜索关键字
 */
Mock.mock(/getCardListUrl/, function () {
	var data = Mock.mock({
		'dataList|12': [{
			'guid': '@guid',
			'img': './images/item-img.jpg', // 卡片图片,
			'name': '@cword(4)', // 卡片名称
			'ordernum': '@integer(1,99)', // 卡片排序号
			'status|1': ['enable','disable'] // enable启用 disable停用
		}],
		'total': 200
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

/**
 * 修改排序号
 * 
 * @param data 存放修改排序号的数组
 * @param id 修改记录
 * @param order 修改的排序号
 */
Mock.mock(/editOrderNumUrl/, function () {
	var data = Mock.mock({
		isSuccess: true
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

/**
 * 启用按钮
 * 
 * @param id 要启用的按钮id
 */
 Mock.mock(/enableItemUrl/, function () {
	var data = Mock.mock({
		isSuccess: true
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

/**
 * 停用按钮
 * 
 * @param id 要停用的按钮id
 */
 Mock.mock(/disableItemUrl/, function () {
	var data = Mock.mock({
		isSuccess: true
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

/**
 * 删除按钮
 * 
 * @param id 要停用的按钮id
 */
 Mock.mock(/deleteItemUrl/, function () {
	var data = Mock.mock({
		isSuccess: true
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
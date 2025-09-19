// NTKO 大文件上传控件的标题配置
// ProductKey请根据ProductCaption用算码工具算出来
var NTKO_ProductCaption = '国泰新点用户';
var NTKO_ProductKey = '3CF3019EA6883730AB34F0D5A8FACDB1CDB2A9EA';

// 表格点击某行单元格后是否允许反选
var mini_grid_allowUnselect = false;

// 360兼容模式下ewebeditor资源路径可能不对，所以在这里预先定义好
var EWEBEDITOR_BASEPATH  =  _rootPath + '/frame/fui/js/widgets/ewebeditor/';

var CSRF_HD_NAME = 'EPTOKEN';
var CSRF_COOKIE_NAME = 'EPTOKEN';

// 为了支持框架的国际化，将语言配置作为参数传递过来
// miniLocal在每个页面中进行定义，不定义则默认为中文
// 国际化只在9.2里实现，9.1中不做修改
(function(miniLocal) {

	var main_dev = [
		'frame/fui/js/dist/libs.min.js',
		'frame/fui/js/dist/miniui.js',
		'frame/fui/js/miniui/local/' + miniLocal,
		'frame/fui/js/dist/frame.js'
	];


	if(SrcBoot.mock) {
		// 开发环境自动把模拟数据插件mock.js引入
		main_dev.push('frame/fui/js/libs/mock-min.js');
	}
	
	
	var main_debug = [
		'frame/fui/js/dist/libs.min.js',
		'frame/fui/js/dist/miniui.min.js',
		'frame/fui/js/miniui/local/' + miniLocal,
		'frame/fui/js/dist/frame.js'
	];

	var main_prod =[
		'frame/fui/js/dist/fui.min.js',
		'frame/fui/js/miniui/local/' + miniLocal,
		'frame/fui/js/dist/frame.min.js'
	];

	// JSON 的兼容性是ie8+，所以不需要额外引用了
	// if(!(window.JSON && window.JSON.parse)) {
	// 	main_dev.unshift('frame/fui/js/libs/json3.min.js');
	// 	main_debug.unshift('frame/fui/js/libs/json3.min.js');
	// 	main_prod.unshift('frame/fui/js/libs/json3.min.js');
	// }
	
	main_dev.push('frame/fui/js/frame.custom.js');
	main_debug.push('frame/fui/js/frame.custom.js');
	main_prod.push('frame/fui/js/frame.custom.js');
	
	SrcBoot.output(SrcBoot.debug ? (SrcBoot.develop ? main_dev : main_debug) : main_prod);
			
}(window.miniLocal || 'zh_CN.js'));
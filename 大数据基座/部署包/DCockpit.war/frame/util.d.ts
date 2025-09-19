declare namespace Util {

    /**
     * 把代表数字的字符串转为10进制整数.
     * @param num 数字的字符串
     */
	function toInt(num: number)

	/** 生成uuid，一般用于生成组件 id、缓存 key 值等场景. */
	function uuid()

	/** 一个空方法，一般用于函数 或者 回调 的初始化. */
	function noop()

    /**
     * 复写某个Util方法
     * @param name 方法名
     * @param method 复写逻辑
     */
	function overwrite(name: string, method: Function)

	/** 显示加载提示效果，一般用异步请求中提示用户请求在处理中。底层依赖 layer 组件，框架页面已默认引入.*/
	function showLoading()

	/** 隐藏加载提示效果，一般用于异步请求结束后调用.*/
	function hideLoading()

	/** 此方法需要业务开发人员进行实现，用于后端 session 失效后，用户提交数据时，展示登录面板，让用户重新登录. */
	function showLogin()

    /**
     * 发送 ajax 请求，对 jQuery 的 ajax 方法进行了一层封装
     * @param settings
     */
	function ajax(settings: JQuery.AjaxSettings)

	/**判断浏览器环境相关的 Util 方法 */
	declare namespace browsers {
		/**判断是否是IE6，IE7. */
		declare var isIE67: boolean

		/**判断是否是IE8。 */
		declare var isIE8: boolean

		/**判断是否是IE9. */
		declare var isIE9: boolean

		/**判断是否是IE10. */
		declare var isIE10: boolean

		/**判断是否是IE11. */
		declare var isIE11: boolean

		/**判断是否是IE。 */
		declare var isIE: boolean

		/**判断是否是Chrome. */
		declare var isWebkit: boolean

		/**判断是否是Firefox. */
		declare var isFirefox: boolean

		/**判断是否是Edge. */
		declare var isEdge: boolean

		/**判断是否是移动设备. */
		declare var isMobile: boolean
	}

    /**
    * 根据状态值为数据添加状态判断值
    * @param {Array|Object} data 原始数据
    * @param {String} key 状态的字段名
    * @param {Object} options 逻辑规则
    * @returns {Array|Object} 返回处理好的值
    */
	function setValueBoolean(data: Array<Object> | Object, key: String, options: Object): Array<Object> | Object

    /**
    * 根据状态为数据添加文字表述
    * @param {Object|Array} data 原始数据
    * @param {String} key 状态的字段名
    * @param {Object} options 逻辑规则
    * @returns {Object} 返回处理好的值
    */
	function setValueText(data: Array<Object> | Object, key: String, options: Object): Array<Object> | Object

    /**
    * 获取数组中指定属性的最大值
    * @param {Array} arr 数组
    * @param {String} key 指定属性
    * @returns {Number} 最大数值
    * @example [{key:166},{key:200},{key:33}]=>getMax(arr,'key);=>200
    */
	function getMax(arr: Array<Object>, key: string): Number

    /**
    * 获取数组中指定属性的最小值
    * @param {Array} arr 数组
    * @param {String} key 指定属性
    * @returns {Number} 最小值
    * @example [{key:166},{key:200},{key:33}]=>getMax(arr,'key);=>33
    */
	function getMin(arr: Array<Object>, key: string): Number

    /**
    * 获取数组指定属性的和
    * @param {Array} arr 数组
    * @param {String} key 指定属性
    * @returns {Number} 和
    * @example [{key:166},{key:200},{key:33}]=>getSum(arr,'key);=>399
    */
	function getSum(arr: Array<Object>, key: string): Number

    /**
    * 获取百分比
    * @param {Number} sum 总数
    * @param {Number} value 当前数据
    * @returns {String} 返回百分比字符串
    * @example Util.getPercent(100,10);=>10%
    */
	function getPercent(sum: number, value: number): String

    /**
    * 获取百分比
    * @param {Number} sum 总数
    * @param {Number} value 当前数据
    * @param {Number} fixed 精确到小数点位数，可不传，默认为0
    * @returns {String} 返回字符串
    * @example Util.getPercent(100,10,1);=>10.0%
    */
	function getPercent(sum: number, value: number, fixed?: number): String

    /**
    * 获取百分比
    * @param {Number} sum 总数
    * @param {Number} value 当前数据
    * @param {Number} fixed 精确到小数点位数，可不传，默认为0
    * @param {Number} unit 配置单位，可不传，默认为%
    * @returns {String} 返回字符串
    * @example Util.getPercent(100,10,1,'百分');=>10.0百分
    */
	function getPercent(sum: number, value: number, fixed?: number, unit?: string): String

    /**
    * 获取数组中指定属性的数组
    * @param {Array} arr 源数组
    * @param {String} key 指定属性
    * @returns {Array} 目标数组
    * @example [{key:166},{key:200},{key:33}]=>getValArr(arr,'key);=>[166,200,33]
    */
	function getValArr(arr: Array<Object>, key: string): Array.<Object>

    /**
    *将字符串按照固定的字数截取并插入换行符
    * @param {String} str 需要处理的字符串
    * @param {Number} num 截断间隔
    * @returns {String} 处理后字符串
    * @example splitStr('abcdefg',3);=>
    'abc
    def
    g'
    */
	function splitStr(str: string, num: number): String

    /**
    *将字符串按照固定的字数截取
    * @param {String} str 需要处理的字符串
    * @param {Number} num 截断间隔
    * @param {String} split 需要插入的字符，不传默认换行符 '\n'
    * @returns {String} 处理后字符串
    * @example splitStr('abcdefg',3,'|');=>"abc|def|g"
    */
	function splitStr(str: string, num: number, split?: string): String

    /**
    * 数组分组
    * @param {Array} arr 需要处理的数组
    * @param {Number} num 每组元素的数量
    * @returns {Array<Array>} 分割后数组
    * @example splitArr([1,2,3,4,5],2)=>[[1,2],[3,4],[5]]
    */
	function splitArr(arr: Array<any>, num: number): Array<Array>

    /**
    * 根据value查找key
    * @param {Object} object 需要查找的对象
    * @param {Function} predicate 查询条件
    * @returns {String} key
    */
	function findKey(object: Object, predicate: (value: T, index: string, object: Object) => boolean): String;

    /**
     * 数字千分位转换
     * @param {Number} n 转换数字
     * @returns {String} 分割后的数字
     */
	function addCommas(n: number): string

    /**
    * 生成0到m-1随机数
    * @param {Number} m 最大值（不包含）
    * @returns {Number} 随机数
    */
	function randNum(m: number): number

    /**
    * 生成随机数
    * @param {Number} m 最小值
    * @param {Number} n 最大值
    * @returns {Number} 随机数
    */
	function randNum(m: number, n: number): number

    /**
    * 根据数据模板生成模拟数据
    * @param {String} url 接口地址
    * @param {Object} template 数据模板
    * @see {@link http://mockjs.com/}
    * @returns {any} Mock
    */
	function mock(url: string, template: Object): void

    /**
    * 根据响应数据的函数执行结果生成模拟数据
    * @param {String} url 接口地址
    * @param {Object} callback 响应数据的函数
    * @see {@link http://mockjs.com/}
    * @returns {any} Mock
    */
	function mock(url: string, callback: (options: Object) => Object): void

    /**
    * 获取Mock参数
    * @param {any} options mock函数回调
    * @returns {Object} 返回参数对象
    */
	function getMockParam(options: object): object

    /**
    * 按照格式输出日期
    * @param {any} date 日期对象
    * @param {any} fmt  格式如：yyyy-MM-dd HH:mm:ss
    * @example `Util.dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')`
    * @returns {string} 日期字符串
    */
	function dateFormat(data: Date, fmt: string): string

    /**
    * 初始化ECharts图表对象
    * @param {String} selectors 图表dom元素选择器
    * @returns {ECharts|Array<ECharts>} 图表实例
    */
	function echartsInit(selectors: string): ECharts | Array<ECharts>

    /**
    * 图表自动切换展示tooltip
    * @param {Object} chartInstance 图表实例
    * @param {Number} length 图表数据量
    * @param {Number} interval 切换间隔，单位ms
    */
	function showTooltip(chartInstance: Object, length: Number, interval: Number): void

    /**
     * 鼠标悬浮到图表，停止showTooltip
     * @param {Object} chart 图表实例
     * @param {Number} length 图表数据量
     */
	function chartHover(chartInstance: Object, length: Number): void

    /**
    * 定时切换地图高亮
    * @param {Object}chartInstance 图表实例
    * @param {Number} length 数据长度
    */
	function areaHight(chartInstance: Object, length: Number): void

    /**
    * 地图图表专用：鼠标悬浮到地图，停止showTooltip
    * @param {Object} chartInstance 图表实例
    * @param {Number} length 图表数据量
    */
	function mapChartHover(chartInstance: Object, length: Number): void

    /**
    * echarts渐变色,适用双色渐变，可根据实际需求改写,方向参数可不传，默认水平方向渐变
    * @param {String} color1 0% 处的颜色
    * @param {String} color2 100% 处的颜色
    * @param {Number} x1 渐变色方向起点的x坐标
    * @param {Number} y1 渐变色方向起点的y坐标
    * @param {Number} x2 渐变色方向终点的x坐标
    * @param {Number} y2 渐变色方向终点的y坐标
    * @returns {echarts.graphic.LinearGradient} echarts渐变对象
    */
	function linearColor(color1, color2, x1, y1, x2, y2): echarts.graphic.LinearGradient

    /**
    * 字符串加密 （先 encodeURIComponent 在 转 base64 再 encodeURIComponent）
    * @param {String} str 要处理的字符串
    * @returns {String} 加密后的字符串
    */
	function encrypt(str: string): string

    /**
    * 字符串解密 （先 decodeURIComponent 再 base64还原 再 decodeURIComponent ）
    * @param {String} str 要处理的字符串
    * @returns {String} 解密后的字符串
    */
	function decrypt(str: string): string

    /**
    * 把表单控件序列化为字面对象, 如： { controlName: 'controlValue' }
    * @param {string} id form id
    * @returns {Object} 序列化对象
    */
	function toFormData(id: string): Object

    /**
    * 为表单控件进行批量赋值
    * @param {string} id form id
    * @param {Object} data  为表单控件数据的字面对象，如： { controlName： 'controlValue' }
    */
	function loadFormData(id: string, data: Object): void

    /**
     * 加载通用Html片段
     * @param id Html片段容器
     * @param path  Html片段路径
     * @param callback 加载完成回调，回调参数：容器Html元素、Html片段JQ对象
     */
	function loadInclude(id: string, path: string, callback: (el: HTMLElement, $html: JQuery<HTMLElement>) => void): void

    /**
     * 获取完整路径
     * @param path 配置路径
     */
	function getFullPath(path?: string): string

    /**
     * 页面跳转
     * @param url 需要处理并跳转的url地址
     * @param params url跳转时带有的参数
     */
	function gotoUrl(url: string, params: Object): void

    /**
     * 页面跳转
     * @param url 需要处理并跳转的url地址
     * @param params url跳转时带有的参数
     */
	function replaceUrl(url: string, params: Object): void

	/**刷新页面 */
	function reloadPage(): void

    /**
     * 将Url参数字符串转换成字面对象
     * @param {string} paramstr Url参数字符串
     * @example width=1680&height=1050=>>{ width:1900, height:1200 }
     */
	function parseParam(paramstr: string): Object

    /**
     * 删除当前Url参数
     * @param keys  参数键数组格式
     */
	function deleteUrlParams(keys: Array<String>): string

    /**
     * 删除指定Url参数
     * @param url  url地址
     * @param keys  参数键数组格式
     */
	function deleteUrlParams(url: string, keys: Array<String>): string

    /**
     * 更新或追加 url 的查询参数
     * @param url url地址
     * @param key   参数键
     * @param value 参数值
     */
	function updateUrlParam(url: string, key: string, value: string): string

	/**获取当前页面的Url所有参数，以键值对形式返回 */
	function getUrlParams(): object | undefined

    /**
     * 获取当前页面的Url指定参数值
     * @param {String} prop 参数
     * @returns {String|undefined} 返回参数 
     */
	function getUrlParams(prop: string): string | undefined

    /**
    * 获取指定Url地址的指定参数值
    * @param {String} url 地址参数
    * @param {String} prop 参数
    * @returns {String|undefined} 返回参数
    */
	function getUrlParams(url: string, prop: string): string | undefined

    /**
    * 对url上的参数进行加密 返回加密后的url
    * @param {string | undefined} url 要处理的 url 为空时取当前页面url
    * @returns {string} 加密后的url
    */
	function encryptUrlParams(url: string): string

    /**
    * 解密 url参数 返回
    * @param {string | undefined} url 要处理的 url 为空时取当前页面url
    * @returns  {string} 解密后的url
    */
	function decryptUrlParams(url?: string): string

    /**
    * 在url上新增参数 内部会自动处理加密逻辑
    * @param {String} url 要处理的url
    * @param {Object} params 要新增的参数 ，键值对形式
    * @returns {String} 处理完成后的url
    */
	function addUrlParams(url: string, params: Object): string

    /**
    * 根据Config中的suffix参数来设置url是否需要带有.html后缀名
    * @param {String} url 要处理的url
    * @param {Object} params 要新增的参数 ，键值对形式
    * @returns {String} 处理完成后的url
    */
	function setUrlSuffix(url: string, params?: Object): string

    /**
    * 根据Config中的suffix参数来设置url是否需要带有.html后缀名
    * @param url 要处理的url
    * @returns   处理完成后的url
    */
	function setUrlSuffix(url: string): string

	/**模板 内部类*/
	interface Template {
        /**
         * @param id script标签id
         */
		constructor(id: string)

        /**
         * 设置数据
         * @param data 数据
         */
		setView(data: any): Template

        /**
         * 渲染数据到页面
         * @param id 容器id或者dom元素
         */
		renderTo(id: string | HTMLElement): void
	}

	/**渲染器 内部类 */
	interface Renderer {

        /**
         * 渲染数据到页面
         * @param id 容器id或者dom元素
         */
		to(id: string): void

        /**
         * 无模板渲染
         * @param container 容器关联属性[renderer]
         * @example <div renderer='baseInfo'></div>
         */
		container(container: string): void

		/**调试打印模板或Html片段 */
		log(): void
	}


    /**
     * 去除html标签中的换行符和空格
     * @param html 需要处理的html片段
    * @returns {String} 处理完成后的html
     */
	function trimHtml(html: string): string

    /**
     * 获取script标签中的html模板
     * @param id script标签id
     * @returns {string} html模板
     */
	function getTplStr(id: string): string


    /**
     * 构建渲染对象Renderer
     * @param templateid  模板script标签ID
     * @param data  数据对象
     */
	function renderer(templateid: string, data: object): Renderer

    /**
    * 构建渲染对象Renderer
    * @param data  数据对象
    * @param property  数据对象关联属性,如data-render
    * @example <p>姓名：<span data-render="name" data-renderclass="className" data-renderattr="title|name"></span></p>
    */
	function renderer(data: object, property: string): Renderer

    /**
     * 构造Template对象
     * @param id script标签id
     */
	function getTplInstance(id: string): Template


	declare namespace STORAGE_TYPE {
		/**使用Cookie存储 */
		declare var COOKIE: number

		/**使用localStorage存储 */
		declare var LOCAL: number

		/**使用sessionStorage存储 */
		declare var SESSION: number
	}

	interface STORAGE_TYPE { }


	/**内部存储类 */
	interface Store {

        /**
         * 渲染数据到页面
         * @param id 容器id或者dom元素
         */
		constructor(type: STORAGE_TYPE): void

        /**
         * 获取缓存数据
         * @param key 键
         */
		getItem(key: string): string

        /**
         * 获取缓存对象
         * @param key 键
         */
		getJSON(key: string): string

        /**
         * 缓存数据
         * @param key 键
         * @param value 值
         * @param options Cookie存储属性
         */
		setItem(key: string, value: string | Object, options?: Cookies.CookieAttributes): void

        /**
         * 移除缓存数据
         * @param key 键
         * @param options Cookie存储属性
         */
		removeItem(key: string, options?: Cookies.CookieAttributes): void

	}

	let STORAGE_TYPE: STORAGE_TYPE


    /**
     * 定义存储对象
     * @param type 存储类型，分Cookie、localStorage、sessionStorage
     */
	function getStorage(type: STORAGE_TYPE): Store

    /**
     * 生成时间
     * @param  template 模板
     * @param  container 容器
     */
	function clock(template: string, container: string | Element | JQuery<Element>): void

    /**
     * 加载滚动数字
     * @param id 容器id
     * @param value 数值
     * @param options 配置选项,可选 {value:100,figure:5,delay:1500}
     */
	function scrollNumber(id: string, value: number, options?: object): void

    /**
     * 动态载入、更新数字，需要引入插件countUp.js
     * @param {String} space 命名空间
     * @param {Number} data 数据
     * @param {Object} options 插件自定义配置，可不传
     */
	function animateNumber(space: string, data: object, options?: object): void

    /**
     * 滚动列表
     * @param {JQuery<Element>} $elem 列表的JQuery对象
     * @param {String} htmlContent	列表内容
     */
	function scrollList($elem: JQuery<Element>, htmlContent: string): void

    /**
    * 高亮元素
    * @param {String|JQuery<Element>} $element 元素jq对象或者选择器
    * @param {Function} callback 回调
    */
	function activeElement($element: string | JQuery<Element>, callback: ($e: JQuery<Element>) => void): JQuery<Element>

    /**
     * 高亮元素
     * @param {String|JQuery<Element>} $element 元素jq对象或者选择器
     * @param {String} selector	代理选择器
     * @param {Function} callback 回调
     */
	function activeElement($element: string | JQuery<Element>, selector: string, callback: ($e: JQuery<Element>) => void): JQuery<Element>

    /**
     * 高亮元素
     * @param {String|JQuery<Element>} $element 元素jq对象或者选择器
     * @param {String} event 触发事件
     * @param {Function} callback 回调
     */
	function activeElement($element: string | JQuery<Element>, event: string, callback: ($e: JQuery<Element>) => void): JQuery<Element>


	/**
	 * 高亮元素
	 * @param {String|JQuery<Element>} $element 元素jq对象或者选择器
	 * @param {String} selector	代理选择器
	 * @param {String} event 触发事件
	 * @param {Function} callback 回调
	 */
	function activeElement($element: string | JQuery<Element>, selector: string, event: string, callback: ($e: JQuery<Element>) => void): JQuery<Element>
}


declare module 'epoint' {
  export = epoint;
}

declare const epoint: epoint;

interface epoint {
  /**
   * 初始化页面
   *
   * @param {string} url ajax请求地址(如果不传，默认为page_Load)
   * @param {((string | number)[])} ids 要回传的页面元素id，是个数组['tree', 'datagrid1']
   * @param {function} callback 回调事件
   * @param {object} opt 其他参参数
   * @memberof epoint
   */
  initPage(url: string, ids: (string | number)[], callback: Function, opt: epointInitPageOption);
  /**
   * 刷新页面
   *
   * @param {(string | number)[]} ids 要回传的页面元素id，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
   * @param {function} callback 回调事件
   * @param {boolean} keepPageIndex 其中的 datagrid 是否保持在当前页码
   * @memberof epoint
   */
  refresh(ids: (string | number)[], callback: (data) => {}, keepPageIndex: boolean);

  /**
   * 提交表单数据
   *
   * @param {string} url ajax请求地址
   * @param {((string | number)[])} ids 要回传的页面元素id，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
   * @param {*} params 要提交的额外参数
   * @param {function} callback 回调函数
   * @param {boolean} notShowLoading 不显示遮罩
   * @memberof epoint
   * @returns {undefined}
   */
  execute(url: string, ids: (string | number)[], params: any, callback: (data) => {}, notShowLoading: boolean);

  /**
   * 验证表单
   *
   * @param {string[]} ids 验证的范围，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
   * @memberof epoint
   * @returns {boolean} 验证成功，则返回true，失败返回false
   */
  validate(ids: string[]);

  /**
   * 获取组织成commonDto格式的数据
   *
   * @param {string[]} ids 范围，是个数组['tree', 'datagrid1'],如果不传，默认为整个body
   * @returns {object[]}
   * @memberof epoint
   */
  getCommonDtoData(ids: string[]): object[];

  /**
   * 渲染datagrid的列
   *
   * @param {MiniUIColumnRenderEvent} e 渲染事件
   * @param {string} cls 渲染的列的dom元素的classname属性值
   * @param {string} func 点击事件中执行的函数名称
   * @param {string} fieldName 传递到事件函数中的参数值 默认为行对象的idField值，你可以手动指定其他字段名称,支持多个以,分割，如果设置epoint_total,那么将传递所有
   * @returns {string}
   * @memberof epoint
   */
  renderCell(e: MiniUIColumnRenderEvent, cls: string, func: string, fieldName: string): string;

  /**
   * 打开dialog窗口
   *
   * @param {string} title dialog 标题名称
   * @param {string} url 加载页面的地址
   * @param {(action) => {}} callback 关闭时的回调函数
   * @param {MiniUIDialogOption} settings dialog 配置选项
   * @returns {MiniUIDialog}
   * @memberof epoint
   */
  openDialog(title: string, url: string, callback: (action) => {}, settings: MiniUIDialogOption): MiniUIDialog;

  /**
   * 打开提问框
   *
   * @param {string} message 提问内容
   * @param {string} title 提问标题
   * @param {() => {}} okCallback 确定回调
   * @param {() => {}} cancelCallback 取消关闭回调
   * @returns {undefined}
   * @memberof epoint
   */
  confirm(message: string, title: string, okCallback: () => {}, cancelCallback: () => {}): undefined;

  /**
   * 打开 alert 提醒
   *
   * @param {string} message 提醒内容
   * @param {string} title 提醒标题
   * @param {() => {}} callback 回调函数
   * @param {string} icon 图标 可选值'success', 'info','warning' ,'question' ,'deny','error'，默认为'info'
   * @param {boolean} forceAlert 强制alert
   * @returns {undefined}
   * @memberof epoint
   */
  alert(message: string, title: string, callback: () => {}, icon: string, forceAlert: boolean): undefined;
}

/**
 * epoint initPageOption
 *
 * @interface epointInitPageOption
 */
interface epointInitPageOption {
  /**
   * 是否是回传，默认为false
   *
   * @type {boolean}
   * @memberof epointInitPageOpt
   */
  isPostBack: boolean;
  /**
   * 是否停留在当前页码 默认为false
   *
   * @type {Boolean}
   * @memberof epointInitPageOpt
   */
  keepPageIndex: Boolean;
  /**
   * 初始化时控件在setValue后的回调
   *
   * @type {function}
   * @memberof epointInitPageOpt
   */
  initHook: () => {};
}

/**
 * MiniUI 表格列的渲染事件接口
 *
 * @interface MiniUIColumnRenderEvent
 */
interface MiniUIColumnRenderEvent {
  row: object;
  record: object;
  sender: object;
  field: string;
}

interface MiniUIDialog {
  id: string;
  show: () => {};
  hide: Function;
  close: Function;
}

interface MiniUIDialogOption {
  /**
   * 要传递给弹出页面的参数
   *
   * @type {object}
   * @memberof MiniUIDialogOption
   */
  param: object; //要传递给弹出页面的参数
  width: string; //宽度
  height: string; //高度
  iconCls: string; //标题图标
  allowResize: boolean; //允许尺寸调节
  allowDrag: boolean; //允许拖拽位置
  showCloseButton: boolean; //显示关闭按钮
  showMaxButton: boolean; //显示最大化按钮
  showModal: boolean; //显示遮罩
  loadOnRefresh: false; //true每次刷新都激发onload事件
  onload: () => {}; //弹出页面加载完成
  ondestroy: (action: any) => {}; //弹出页面关闭前
}

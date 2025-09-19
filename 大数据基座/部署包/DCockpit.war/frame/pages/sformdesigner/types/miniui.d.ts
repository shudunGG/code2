declare module 'mini' {
  export = mini;
}
declare const mini: mini;

interface mini {
  /**
   * 获取控件
   *
   * @param {string} id
   * @returns {miniControl}
   * @memberof mini
   */
  get(id: string): miniControl;

  /**
   * 根据name获取单个控件
   *
   * @param {string} name 控件name
   * @param {*} [parent] 可选。限定获取控件的范围
   * @returns {miniControl}
   * @memberof mini
   */
  getByName(name: string, parent?: any): miniControl;

  /**
 * 根据name获取多个控件
 *
 * @param {string} name 控件name
 * @param {*} [parent] 可选。限定获取控件的范围
 * @returns {miniControl}
 * @memberof mini
 */
  getsbyName(name: string, parent?: any): Array<miniControl>;

  /**
   * 把JS对象序列化为字符串
   *
   * @param {Object} obj 待序列化的对象
   * @returns {string} 序列化后的字符串
   * @memberof mini
   */
  encode(obj: Object): string;

  /**
   * 把字符串反序列化为JS对象
   *
   * @param {string} json 待序列化的字符串
   * @param {boolean} [autoParseDate] 是否自动解析日期字符串为Date类型
   * @returns {Object} JS对象
   * @memberof mini
   */
  decode(json: string, autoParseDate?: boolean): Object;

  /**
   * 解析区域内的miniui控件
   *
   * @param {string} [id] 解析区域ID
   * @memberof mini
   */
  parse(id?: string);


  /**
   * 把字符串转换成Date类型对象。
   *
   * @param {string} str 特定格式字符串 ['2010-11-22', '2010/11/22', '11-22-2010', '11/22/2010', '2010-11-22T23:23:59', '2010/11/22T23:23:59', '2010-11-22 23:23:59', '2010/11/22 23:23:59']
   * @returns {Date}  JavaScript日期对象
   * @memberof mini
   */
  parseDate(str: string): Date;

  /**
   * 把Date类型转换为字符串	
   *
   * @param {Date} date  JavaScript日期对象
   * @param {string} format 格式化字符串。例如："yyyy-MM-dd HH:mm:ss" 详情参考：https://fe.epoint.com.cn/miniui_dev/docs/api/index.html#ui=date
   * @returns {string} 指定格式的日期字符串
   * @memberof mini
   */
  formatDate(date: Date, format: string): string;

  /**
   * 格式化数字
   *
   * @param {number} number 数值
   * @param {string} [format]  小数点和千分位：format="n"。
        货币格式：format="c"。
        百分比格式：format="p"。
        自定义格式：format="¥#,0.00"
   * @returns {string} 格式化后的字符串
   * @memberof mini
   */
  formatNumber(number: number, format?: string): string;
}


interface miniControl {
  /**
   * 控件id
   *
   * @type {string}
   * @memberof miniControl
   */
  id: string;
  /**
   * 控件bind属性
   *
   * @type {string}
   * @memberof miniControl
   */
  bind: string;
  /**
   * 控件值
   *
   * @type {*}
   * @memberof miniControl
   */
  value: any;

  /**
   * 控件是否可见
   *
   * @type {boolean}
   * @memberof miniControl
   */
  visible: boolean;

  /**
   * 控件是否可用
   *
   * @type {boolean}
   * @memberof miniControl
   */
  enabled: boolean;

  /**
   * 验证规则
   *
   * @type {string}
   * @memberof miniControl
   */
  vtype: string;

  /**
   * 是否选中
   *
   * @type {boolean}
   * @memberof miniControl
   */
  checked: boolean;
  data: any[];
  idField: string;
  textField: string;
  trueValue: String;
  falseValue: String;

  /**
   * 验证控件值
   *
   * @returns {boolean} 是否通过
   * @memberof miniControl
   */
  validate(): boolean;
  /**
   * 是否通过验证
   *
   * @returns {boolean} 是否通过
   * @memberof miniControl
   */
  isValid(): boolean;

  /**
   *  设置验证结果
   *
   * @param {boolean} validate 验证状态
   * @memberof miniControl
   */
  setIsValid(validate: boolean);

  /**
   * 获取控件值
   *
   * @returns {*}
   * @memberof miniControl
   */
  getValue(): any;

  /**
   * 获取控件表单值
   *
   * @returns {*}
   * @memberof miniControl
   */
  getFormValue(): any;
  /**
   * 为控件设值值
   *
   * @param {*} value
   * @memberof miniControl
   */
  setValue(value: any);

  /**
   * 获取控件数据
   *
   * @returns {any[]}
   * @memberof miniControl
   */
  getData(): any[];

  /**
   * 为控件设值数据
   *
   * @param {any[]} data
   * @memberof miniControl
   */
  setData(data: any[]);

  /**
   * 设值控件启用/禁用状态
   *
   * @param {boolean} enable
   * @memberof miniControl
   */
  setEnable(enable: boolean);

  /**
   * 启用控件
   *
   * @memberof miniControl
   */
  enable();
  /**
   * 禁用控件	
   * @memberof miniControl
   */
  disable();
  /**
   * 增加样式类
   *
   * @param {string} className class 名称
   * @memberof miniControl
   */
  addCls(className: string);

  /**
   * 移除样式类
   *
   * @param {string} className class 名称
   * @memberof miniControl
   */
  removeCls(className: string);

  /**
   * 绑定一个事件
   *
   * @param {string} type 事件名称
   * @param {(ev: miniuiEvent) => {}} handle 事件处理函数
   * @param {object} [scope] 事件处理函数中绑定的上下文对象
   * @memberof miniControl
   */
  on(type: string, handle: (ev: miniuiEvent) => {}, scope?: object);
  /**
   * 取消绑定一个事件
   *
   * @param {string} type 事件名称
   * @param {(ev: miniuiEvent) => {}} handle 事件处理函数
   * @param {object} [scope] 事件处理函数中绑定的上下文对象
   * @memberof miniControl
   */
  un(type: string, handle: (ev: miniuiEvent) => {}, scope?: object);

  /**
   * 销毁控件
   *
   * @memberof miniControl
   */
  destroy();

  /**
   * 将控件渲染到某个dom元素
   *
   * @param {HTMLElement} el dom元素
   * @memberof miniControl
   */
  render(el: HTMLElement);

  /**
   * 调整控件布局
   *
   * @memberof miniControl
   */
  doLayout();

  /**
   *获取焦点
   *
   * @memberof miniControl
   */
  focus();

  /**
   * 失去焦点	
   *
   * @memberof miniControl
   */
  blur();
}

interface miniuiEvent {
  sender: miniControl
}
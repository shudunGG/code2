# 表单设计器

## Project setup

```bash
yarn
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

**OR**

start `rundev.sh` or `rundev.cmd`

### Compiles and minifies for production

```bash
yarn build
```

**OR**

start `runbuild.sh` or `runbuild.cmd`

## 接口说明

### 初始化

主要用于获取以下初始信息

1. 表单标题
2. 扩展控件列表
3. 设计区数据(如果是新建则没有或为空)
4. 可选表字段
5. 子表信息列表
6. 数据表信息列表

**请求**

地址： `formDesignerActions.getUrl` : `sformdesignaction.action?cmd=initFormRelationTableInfo`

```js
{
  designId: '',
  tableGuid: ''
}
```

**响应**

```js
{
  // 表单名称
  name: '',
  // 扩展控件列表 extControlItem 格式见下文
  extControls: [{extControlItem},{extControlItem},...],
  // 设计区数据 直接返回保存时的此数据即可
  designData: {},
  // 可选的 表-字段列表 具体格式见下文
  fieldList: [],
  // 宏控件下拉
  macroTypes: [],
  // 子表信息列表
  sourceTables: [],
  // 数据表信息列表
  dataTables: [],
  // js 代码
  jsCode: '',
  // css 代码
  cssCode: ''
}
```

**扩展控件列表**

用于控制显示哪些扩展控件

参考基本控件的配置，每个成员各式如下：

```js
{
  name: '控件名称',
  type: '控件类型，应是唯一的',
  icon: '控件的图标， 一个字符串的名称即可'
}
```

**设计区数据**

原文存储并返回即可

**可选字段列表**

由于可能存在多表情况，字段按表组织

采用类似以下的数据格式即可：

```js
[
  // 表 一
  {
    name: '表 一',
    id: 'table1',
    fields: [
      {
        name: '字段一',
        field: 'field1',
        // datasource 值为 代码项的text 值 存在时需要自动关联
        datasource: '远程数据源-1',
        // 字段类型 1 数值 2 整数 0 不限
        fieldtype: '1',
        // 此字段适用的控件类型
        fielddisplaytype: 'textbox',
        // 此字段要求必填
        required: '0'
      },
      {
        name: '字段二',
        field: 'field2',
        // datasource 值为 代码项的text 值 存在时需要自动关联
        datasource: '远程数据源-1',
        // 字段类型 1 数值 2 整数 0 不限
        fieldtype: '1',
        // 此字段适用的控件类型
        fielddisplaytype: 'textbox',
        // 此字段要求必填
        required: '0'
      }
    ]
  },
  // 表二
  {
    name: '表二',
    id: 'table2',
    fields: [
      {
        name: '字段一',
        field: 'field1',
        // datasource 值为 代码项的text 值 存在时需要自动关联
        datasource: '远程数据源-1',
        // 字段类型 1 数值 2 整数 0 不限
        fieldtype: '1',
        // 此字段适用的控件类型
        fielddisplaytype: 'textbox',
        // 此字段要求必填
        required: '1'
      },
      {
        name: '字段二',
        field: 'field2', // datasource 值为 代码项的text 值 存在时需要自动关联
        datasource: '远程数据源-1',
        // 字段类型 1 数值 2 整数 0 不限
        fieldtype: '1',
        // 此字段适用的控件类型
        fielddisplaytype: 'textbox',
        // 此字段要求必填
        required: '1'
      }
    ]
  }
]
```

假设 一个 textbox 的 `bind` 指定为 `table2` 的 `field1` ，则将属性存储为: `textbox.bind="table2;field1"`

日期范围选择除 `bind` 之外 还有一个 `bind2` 用于选择日期的结束关键字段，后端需按照格式将 `bind2` 拼接到 `bind` 上

**宏控件下拉选项**

用于配置宏控件时所需要的信息，格式如下：

```js
[{ id: '宏预设id', text: '宏预设名称' }, ...]
```

**子表信息列表**

用于子表控件可以选择的表格，数据格式如下：

```js
[{ id: '子表id', text: '子表展示名称' }, ...]
```

**数据表信息列表**

用于事件配置中， 【赋值】 操作为其他控件赋值时的可选查询表， 数据格式如下：

此表不一定为真实的数据库物理表，可能只是一个标识，服务端需根据标识名称进行相关的业务查询

```js
[{ id: '数据表id', text: '数据表展示名称' }, ...]
```

### 请求代码项列表

地址： `formDesignerActions.getCodeItemUrl` : `sformdesignaction.action?cmd=initCodeItemInfo`

用于请求所有可选的数据源，以供需要配置数据源的控件进行选择。

此接口单独出来是由于此接口可被业务上进行重写，加入框架以外的业务数据。

**请求**

```js
{
  designId: ''
  tableGuid: ''
}
```

**响应**

```js
[{id,text},{id,text},...]
```

### 子表详情信息

地址： `formDesignerActions.getSubTableInfoUrl` : `sformdesignaction.action?cmd=getSubTableInfo`

用于配置子列表时 根据选择的子表获取子表内的字段列表和编辑表单

**请求**

```js
{
  tableId: 'subTable-19'
}
```

**响应**

```js
{
  // 编辑表单
  SubTableForm: [{formName: "配置表单-1", formGuid: "form_page-1"}},...],
  // 子表字段
  SubTableStruct: [{field: "field-1", fieldName: "fieldName-1", name: "字段名称-1", required: "1", controlType: "", vtype: ""},...]
}
```

其中 `SubTableForm` 的配置用于表格的编辑方式为 `dialog` 时，选中的 `formGuid` 值将被提交到表格控件的 `editFormGuid` 属性上

### buttonedit 弹出列表

地址： `formDesignerActions.getListInfoUrl` : `sformdesignaction.action?cmd=getSformListInfo`

用于获取 buttonedit 可选的弹出页面信息

**请求**

```js
{
  designId: ''
  tableGuid: ''
}
```

**响应**

```js
{
  SformListInfo: [{id:"page-1-guid",text:"页面-1"},...]
}
```

### 获取 buttonedit 控件的页面的字段信息

地址： `formDesignerActions.getListStructUrl` : `sformdesignaction.action?cmd=getlistStructInfo`

用于 buttonedit 控件弹出选择信息后，设置到 buttonedit 控件上的值字段和显示字段可选列表

**请求**

```js
{
  // 所选弹出页面列表的guid
  listGuid: "page-1-guid"
}
```

**响应**

```js
{
  ListStruct: [{id:"name",text:"姓名"},{id:"guid",text:"用户guid"}, ...]
}
```

### 保存表单设计器数据

地址： `formDesignerActions.saveUrl` : `sformdesignaction.action?cmd=generateCode`

1. 设计区数据
2. 生成的布局html和样式片段
3. 控件列表

**请求**

```js
{
  designId: ''
  tableGuid: '',
  // 设计区数据
  designData: designData,
  // 前端构建好的内容
  build: {
    html:'构建好的html字符串，布局和控件占位符',
    style:'生成的样式信息'
  },
  // 所有控件的列表 用于服务端解析生成控件
  controls: [{control1},{control2},...],
  // js 代码
  jsCode: "",
  // css 代码
  cssCode: ""
}
```

**设计区数据**

此块数据直接使用一个json对象进行存储即可， 设计区域所有的数据都存储在这里面。

**生成的布局html和样式片段**

html 字符串和 css 样式

**控件列表**

所有控件的列表 用于服务端解析生成控件

示例格式：

```js
[
  {
    type: 'label',
    labelText: '邮  箱：',
    fontSize: 13,
    fontFamily: 'Microsoft Yahei',
    fontColor: '#333333',
    fontBolder: false,
    fontItalic: false,
    fontUnderline: false,
    textAlign: 'right',
    id: 'label-8hgetb5f9',
    name: 'label控件',
    icon: null,
    width: '100%'
  },
  {
    type: 'textbox',
    required: true,
    readOnly: true,
    bind: 'user;email',
    emptyText: '请输入邮箱',
    vtype: 'email',
    customValidate: {
      regExp: '',
      errorText: ''
    },
    width: '100%',
    id: 'textbox-7fcuj1kfc',
    name: '文本输入框',
    icon: 'textbox'
  }
]
```

**控件配置中特殊值说明**

- 值用 方括号括起来 ，如 `[currDate]` 标识其为一个特殊值。
  - 目前出现在两个地方： 
  - 日期选择的默认值 `defaultValue` 属性中，如`defaultValue = [currDate]`， 标识默认值为当前日期，即访问页面的日期
  - 文件上传控件的类型限制值 `limitType` 数值中，如 `limitType = [default]`， 标识不要给控件设置这个属性，这样控件就可以应用当前系统的系统参数值。
- 值用 花括号括起来， 如 `{controlId}` 标识其值一个控件的id
  - 目前出现在两个地方
  - 日期选择控件中， `minDate` 和 `maxDate` 可能出现，标识最大最小值取决于指定的控件
  - 文本框的验证属性 `rangeValidator` 中， 标识某个操作的比较目前取指定的控件

**上传控件 limitType 值说明**

文件上传类型限制提交值格式

- `'[default]'` 使用系统参数，就是控件上不要加这个属性, 这样控件就可以应用当前系统的系统参数值。
- `''` 不限制类型 
- `'jpg,png'` 用户通过选择或输入配置的扩展名

**日期选择默认值 defaultValue 配置格式**

- `'[currDate]'` 特殊值 标识取当前访问表单的日期
- `''`   为空标识不配置
- `'2019-06-20'` 普通的日期 即用用户选的的默认值

**日期选择的最大最小值配置**

日期范围范围配置 `minDate`  `maxDate` 分别表示最小值 最大值

- `'{controlId}'` 最大或最小值取此控件的值
- `''` 最大或最小值无限制
- `'2019-06-10'` 最大或最小值为当前指定的值

**文本框的范围校验**

文本框有一个配置属性 `rangeValidator` ，格式如下

```js
{
  // 范围校验
  rangeValidator: {
    // 检验类型 string || number
    type: 'string',
    // 校验条件  两个条件是且的关系
    conditions: [
        // 条件1 (可选)
      {
        operation: '==',  // 操作符 数值 可选 < <= = > >= 文本仅有 == 
        value:'{someControlId}' // 对应的值 值用花括号括起来表示是一个控件id 表示和此控件进行比较
      },
      // 条件2 (可选)
      {
        operation: '>=',
        value:'123'
      }
    ]
  }
}
```

关于 上诉结构中 `conditions[n].value` 的取值说明：

- 首先在比较前需读取 type 属性， 看当前是如何进行比较，如 数值才有大于小于，数值的大小比较要先转化为数值
- 如果 value 的值是用花括号括起来的，标识其取某个控件，需要转化事件，读取对应控件值进行比较。

### 获取数据表的字段信息

地址： `formDesignerActions.getTableFieldsUrl` : `sformdesignaction.action?cmd=getTableFields`

用于事件配置中，【赋值】 动作选定数据表之后的相关的字段信息。

赋值动作将根据一定条件发请求获取指定表格中的信息， 此请求经获取到返回结果中的属性名称，将其配置到某个控件上，即可完成对此控件的赋值操作。

**请求**

```js
{
  tableId: '所选数据表的id标识'
}
```

**响应**

```js
{
  'TableStruct': [ {id: '字段标识', text: '字段名称'}, ...]
}
```

### 获取控件的真实数据源

地址： `formDesignerActions.getControlDataListUrl` : `sformdesignaction.action?cmd=getControlDataList`

将在 【值变更：关系比较】 `valuechanged:compare` 中使用，用于获取此控件所有可能的值，供用户选择，已完成赋值操作。

**请求**

```js
{
  controlData: {'当前控件的全部配置'}
}
```

**响应**

```js
{
  [ {id: '值', text: '值显示名称'}, ...]
}
```

## 事件

### 事件类型

**值变更** `valuechanged`

场景：

1. 输入值变更时，发起请求，查询相关信息赋值给某些控件

支持控件：

- 控件：all

配置流程

1. 选择要查询的数据表
2. 选择赋值目标控件
3. 为赋值的目标控件选择赋值的字段
  
**值变更：关系比较** `valuechanged:compare`

场景：

1. 控件值变更，且当前值符合于指定值的比较关系成立时 执行显示 / 隐藏 / 清空 / 赋值 等操作

支持控件为选择性控件：

- **combobox**
- **radiobuttonList**
- **treeSelect**

配置流程

1. 选择条件比较的操作符，等于或不等于
2. 选择条件比较的目标值
3. 选择事件的执行动作和相应的目标控件

若事件动作为赋值，则 还需要配置：

1. 数据查询的数据表
2. 赋值目标控件的赋值字段

**值变更：获取代码子项** `valuechanged:getcodelist`

场景：

1. combobox 联动选择

支持控件：

- **combobox**
  
配置流程：

为具有联动关系的父组件配置此事件，事件目标选择为待联动的子控件即可。

如：省市区的联动选择，则为省和市下拉框配置此事件，其中省事件的动作目标为市控件、市控件的动作目标为区控件即可。

### 动作

```js
{
  show: { name: '显示' },
  hide: { name: '隐藏' },
  assignment: { name: '赋值' },
  clear: { name: '清空' },
  setData: { name: '数据源设置' }
}
```

### 数据组织

```js
{
  events: {
    // 事件类型名称 用于配置时使用，如：值改变（关系比较）、值改变（获取用户详情）
    // 此 eventName 并非生成时控件上的事件类型， 目前生成绑定事件应统一为： valueChanged
    [eventName]: [
      // event description object
      {
        // 事件名称 同外部的 eventName 仅用于配置时的标识
        type: 'eventName',
        // 真实绑定给控件的事件名称
        originType: 'valuechanged',
        // 是否在初始化执行
        runAtInit: false,
        // 条件 可能为空
        conditions: [
          {
            // 比较操作符 == !=
            operation: '>',
            // 比较的目标值 即选择控件的value字段值
            target: ''
          }
        ],
        // 事件操作
        actions: [
          {
            // 事件操作类型 如显示、隐藏、赋值、清空等
            type: 'show',
            // 目标信息
            targets: [
              {
                // 目标类型
                type: 'layout',
                // 目标id
                id: 'rowid-asghjsgsd82j'
              },
              {
                type: 'control',
                id: 'controlId'
              }
            ]
          },
          {
            type: 'assignment',
            sourceTableId: '目标数据表id',
            targets: [
              {
                type: 'control',
                id: 'controlId',
                setValueField: '控件赋值时新的关联字段'
              }
            ]
          }
        ]
      }
    ]
  }
}
```

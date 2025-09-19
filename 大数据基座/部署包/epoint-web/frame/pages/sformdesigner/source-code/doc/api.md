# 接口说明

## 初始化

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
  cssCode: '',
  // 创建新字段时 可选的数据库类型
  dataType: [
    {
      id: "DateTime",
      text: "日期类型(DateTime)"
    },
    {
      id: "Numeric",
      text: "数字类型(Numeric)"
    },
    {
      id: "Integer",
      text: "整数类型(Integer)"
    },
    {
      id: "ntext",
      text: "文本类型(ntext)"
    },
    {
      id: "nvarchar",
      text: "字符串(nvarchar)"
    },
    {
      id: "Image",
      text: "二进制流(Image)"
    }
  ],
  // 通用字段列表 格式见下文
  commonFields: [],
  // 自动保存时间 单位 ms 
  // 此处指执行是否需要自动保存的间隔时间，并非代表此间隔必定触发保存
  // 如用户一直未操作，或数据无变动，则无需自动保存
  autoSaveTime: 1000 * 60
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
    sqltablename: 'sqltablename-1',
    fields: [
      {
        name: '字段一',
        field: 'field1',
        fieldname: "fieldname-1",
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
        fieldname: "fieldname-2",
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
    sqltablename: 'sqltablename-2',
    fields: [
      {
        name: '字段一',
        field: 'field1',
        
        fieldname: "fieldname-1",
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
        fieldname: "fieldname-2",
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

::: tip
新格式： 使用 `sqltablename` 和 `fieldname` 来拼接，取代开始的 `tableId` 和 `field` ， 用于新旧区分，新格式前用 `#` 标识：

即 绑定表二的字段一格式为：

`#sqltablename-2;#fieldname-1`
:::

日期范围选择除 `bind` 之外 还有一个 `bind2` 用于选择日期的结束关键字段，后端需按照格式将 `bind2` 拼接到 `bind` 上。

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

**通用字段列表**

用于获取并显示可用的通用字段，通用字段实际就是某种控件，但是这种控件上已经预设好了绝大多数属性，无须用户再从头进行配置。

其格式如下：

```js
[
  {
    // 对应的控件类型
    type: 'textbox',
    // 显示的名称
    name: `姓名`,
    // 显示的图标
    icon: 'textbox',
    // 分类类型标识 前端将据此为通用字段进行分组
    businessType: `catalog_${catalog}`,
    // 分类名称
    businessName: `分类—${catalog}`,
    // 唯一的标识 后端需要
    universalId: '222280dc-0a5d-4904-94a8-1e13516bb445',
    // 字段名称 后端需要
    fieldName: 'date',
    // 此通用字段已经预设好的控件属性， 具体取决于控件本身
    props: {
      name: `姓名_${i}`,
      emptyText: '请输入姓名',
      required: true
    }
  },
  {
    name: '日期测试',
    universalId: '222280dc-0a5d-4904-94a8-1e13516bb445',
    fieldName: 'date',
    type: 'datepicker',
    icon: 'datepicker',
    businessType: '3',
    businessName: 'cdstest',
    props: {
      supportevents: ['valuechanged'],
      emptytext: '请选择执行日期',
      mindate: '2020-04-28',
      readonly: false,
      defaultvalue: '2020-04-29 09:26:46',
      maxdate: '2020-04-30',
      width: '100%',
      format: 'yyyy-MM-dd',
      info_ignoreModifyFlag: '1',
      type: 'datepicker',
      events: {},
      required: false
    }
  }
]
```

## 请求代码项列表

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

## 子表详情信息

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

## buttonedit 弹出列表

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

## 获取 buttonedit 控件的页面的字段信息

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

## 保存表单设计器数据

地址： `formDesignerActions.saveUrl` : `sformdesignaction.action?cmd=generateCode`

1. 新创建的字段列表
1. 设计区数据
1. 生成的布局html和样式片段
1. 控件列表

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
  cssCode: "",
  // 新创建的字段列表
  newFieldList: []
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

## 获取数据表的字段信息

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

## 获取控件的真实数据源

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

## 根据 dbtype 获取 displayTypeList

在表单设计器内直接创建字段时使用，根据 dbtype 获取 displayTypeList

请求参数：

```js
{
  dbType: "Integer"
}
```

响应：

```js
{
  "controls": [],
  "custom": [{"id":"textboxNumeric","text":"文本框Numeric"},{"id":"comboboxNumeric","text":"下拉列表Numeric"},{"id":"checkboxNumeric","text":"复选框Numeric"},{"id":"checkboxlistNumeric","text":"复选框组Numeric"},{"id":"radiobuttonlistNumeric","text":"单选框组Numeric"},{"id":"textareaNumeric","text":"多行文本框Numeric"}],
  "status": {"code":200}}
```

## 获取可选风格列表

相当于预设好了全局样式，切换时可直接应用于全局表单。每个成员的data即为设计数据的全局样式。

地址： `formDesignerActions.getSkinListUrl` : `sformdesignaction.action?cmd=getSformStyle`

响应：

```js
{
  "skinList": [
    {
      "id": "default",
      "name": "F9默认",
      "data": {
        "autoColons": true,
        "fontSize": 14,
        "fontFamily": "Microsoft Yahei",
        "fontColor": "#333333",
        "fontBolder": false,
        "fontItalic": false,
        "fontUnderline": false,
        "textAlign": "right",
        "verticalAlign": "middle",
        "border": {
          "top": {
            "width": 0,
            "style": "solid",
            "color": "#e5e5e5"
          },
          "right": {
            "width": 0,
            "style": "solid",
            "color": "#e5e5e5"
          },
          "bottom": {
            "width": 0,
            "style": "solid",
            "color": "#e5e5e5"
          },
          "left": {
            "width": 0,
            "style": "solid",
            "color": "#e5e5e5"
          }
        },
        "allBorderType": "none"
      }
    },
    {
      "id": "red",
      "name": "红头文件",
      "data": {
        "autoColons": false,
        "fontSize": 14,
        "fontFamily": "Microsoft Yahei",
        "fontColor": "#f60000",
        "fontBolder": false,
        "fontItalic": false,
        "fontUnderline": false,
        "textAlign": "center",
        "verticalAlign": "middle",
        "border": {
          "top": {
            "width": 1,
            "style": "solid",
            "color": "#f81f1f"
          },
          "right": {
            "width": 1,
            "style": "solid",
            "color": "#f81f1f"
          },
          "bottom": {
            "width": 1,
            "style": "solid",
            "color": "#f81f1f"
          },
          "left": {
            "width": 1,
            "style": "solid",
            "color": "#f81f1f"
          }
        },
        "allBorderType": "all"
      }
    },
    {
      "id": "simple",
      "name": "默认边框",
      "data": {
        "autoColons": true,
        "fontSize": 14,
        "fontFamily": "Microsoft Yahei",
        "fontColor": "#333333",
        "fontBolder": false,
        "fontItalic": false,
        "fontUnderline": false,
        "textAlign": "right",
        "verticalAlign": "middle",
        "border": {
          "top": {
            "width": 1,
            "style": "solid",
            "color": "#e5e5e5"
          },
          "right": {
            "width": 1,
            "style": "solid",
            "color": "#e5e5e5"
          },
          "bottom": {
            "width": 1,
            "style": "solid",
            "color": "#e5e5e5"
          },
          "left": {
            "width": 1,
            "style": "solid",
            "color": "#e5e5e5"
          }
        },
        "allBorderType": "all"
      }
    }
  ]
}
```

## 将当前全局样式保存为新风格

地址： `formDesignerActions.addSkinUrl` : `sformdesignaction.action?cmd=creatSformStyle`

请求参数

```js
{
  skinName: '新风格名称',
  // 当前的全局样式数据
  data: {}
}
```

响应

```js
{
  id: '新风格保存后的标识'
}
```

## 自动保存

数据有变动时，定期自动保存

地址： `formDesignerActions.autoSaveUrl` : `sformdesignaction.action?cmd=autoSave`

请求参数

```js
{
  designId: '',
  tableGuid: '',
  designData: {},
  newFieldList: [],
}
```

响应

```js
{
  msg: 1
}
```

## 存为模板

将当前设计存为新模板时使用。

地址： `formDesignerActions.saveAsTplUrl` : `sformdesignaction.action?cmd=copyFormDesign`

请求参数

```js
{
  designId: '',
  tableGuid: '',
  name: '模板名称',
  // 正常保存时的其他数据字段
  ...
}
```

## 获取所有模板

地址： `formDesignerActions.getAllFormTplUrl` : `sformdesignaction.action?cmd=getAllDesignTemplate`

响应格式

```js
{
  list: [{
    id: '模板标识',
    text: '模板名称',
    data: {} // 模板数据
  },
  {},
  ...
  ]
}
```

## 存为副本

地址： `formDesignerActions.saveAsCopyUrl` : `sformdesignaction.action?cmd=createNewForm`

请求参数

```js
{
  designId: '',
  tableGuid: '',
  name: '副本名称',
  // 正常保存时的其他数据字段
  ...
}
```

## 生成新版本时获取模板信息

地址： `formDesignerActions.getSFormTplUrl` : `sformdesignaction.action?cmd=getsformTemplate`

响应

```js
{
  list: [{
    id: '模板标识',
    text: '模板名称',
    data: {} // 模板数据
  },
  {},
  ...
  ]
}
```

## 生成新版本

地址： `formDesignerActions.saveAsNewVersionUrl` : `sformdesignaction.action?cmd=createFormVersion`

请求参数

```js
{
  designId: '',
  tableGuid: '',
  tplId: '所选模板的id',
  // 正常保存时的其他数据字段
  ...
}
```

## 自动创建字段

表单设计器在保存时，如果存在控件未绑定字段，则会先发起请求，根据控件信息自动创建字段并绑定，成功后才执行真实保存。

地址： `formDesignerActions.autoCreateFieldUrl` : `sformdesignaction.action?cmd=autoCreateField`

请求参数

```js
{
  designId: '',
  tableGuid: '',
  // 所有未绑定字段的控件的数组，成员为控件详细配置
  controls: [{},{}]
}
```

响应：

```js
{
  "fieldList":[
    {
      // 控件id
      "controlId": "111",
      // 控件名称
      "name": "文本框-1",
      // 字段id
      "field": "field-1589101135101-0",
      // 字段名
      "fieldname": "WenBenKuang-1",
      "datasource": "远程数据源-46",
      "fieldtype": "2",
      "fielddisplaytype": "textbox",
      "required": "1"
    },
    {
      "controlId": "222",
      "name": "文本框-2",
      "field": "field-1589101135101-1",
      "fieldname": "WenBenKuang-2",
      "datasource": "",
      "fieldtype": "1",
      "fielddisplaytype": "combobox","required": "1"
    }
  ]
}
```

## pc 转 移动

按照一定的格式将PC端转化为移动端数据

地址： `formDesignerActions.pc2mobileUrl` : `sformdesignaction.action?cmd=initMobileDesignData`

请求参数

```js
{
  // pc端保存时的全部数据
}
```

响应：

```js
{
  "mobileDesignData":[
    // 一个对象对应移动端一行
    {
      // label 信息配置
      "label": {},
      // 控件信息配置
      "control": {}
    },
    {}
  ]
}
```

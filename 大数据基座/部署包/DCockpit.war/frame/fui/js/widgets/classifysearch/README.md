# ClassifySearch 分类搜索

可配置那些分类，直接生成具备显示历史记录和输入时自动展示搜索分类的组件，具有如下功能：

- 支持历史记录，历史记录基于页面路径和控件id生成，保证相关影响和冲突
- 配置分类自动生成分类搜索
- 历史记录和搜索分类自动切换

## 使用说明

引入js资源，然后使用如下方式进行初始即可

```js
new ClassifySearch({
    id: 'header-search',        // 绑定的容器id
    searchTarget: '内容',       // 搜索目标
    category: cates,            // 分裂的配置数组
    placeholder: '请输入',      // 输入框placeholder内容
    maxShowCharacter: 5,        // 下拉区域显示的最大关键字字符数
    enter: function (categoryId, key) {
        // 回车时触发
        // console.log('回车事件返回 categoryId:' + categoryId + 'key:' + key);
        // 搜索图标的点击也触发此事件
        doSearch(categoryId, key);
    }
});
```

其中 `category` 的配置表示有哪些分类，配置格式如下：

```js
[
    {
        id: 'all', // 分类的标识，在触发搜索时会传递此参数
        name: '全文检索', // 显示的分类名称
        iconCls: 'modicon-25' // 分类前面的图标 支持框架模块和操作图标
    },
    {
        id: 'email',
        name: '邮件',
        iconCls: 'modicon-26'
    },
    {
        id: 'notice',
        name: '通知公告',
        iconCls: 'modicon-27'
    }
]
```

使用demo可参考当前目录下的demo.html

## 具体配置说明

配置如下，以下展示的是默认值及其说明

```js
{
    // 生成分类搜索的容器 必填选项，支持id值、dom元素或jq元素 具有别名el
    id: '',
    // 搜索模板
    'searchTarget': '内容',
    // 分类配置
    'category': [],
    // 关键字最大展示字数
    'maxShowCharacter': 5,
    // 历史记录最大纯属限制
    'localSaveMaxItems': 5,
    // 搜索框的 placeholder
    'placeholder': '请输入',
    // 是否自动加载css 如果需要自行个性化css 可以关闭此选项
    'autoLoadStyle': true,
    'keyup': emptyFn, // 键盘按键释放事件
    'enter': emptyFn, // 回车事件
    'up': emptyFn, // 键盘按上释放事件
    'down': emptyFn // 键盘按下释放事件
}
```

## 静态方法和属性

- `ClassifySearch.setDefaultOpt(key, value)` 静态方法，用于修改分类搜索组件 `ClassifySearch` 的配置值。
- `ClassifySearch._$pageCover` 静态属性，标识当前页面下的分类搜索的遮罩的容器，默认为空。如果存在，组件将在相关面板展示时自动显示遮罩，面板收起时取消遮罩。（用于页面内存在iframe，且需要点击空白收起搜索的弹出面板时使用）

## 实例属性和方法

相关属性和方法均已经内部集成、对外派发键盘的上下事件和响应的搜索事件，基本功能完备，仅有的方法为动态获取或设置相关配置值

- `setOpt(key, value)` 动态修改某个配置值，其中配置中的id或el无法动态修改
- `getOpt(key)`  获取某项配置值
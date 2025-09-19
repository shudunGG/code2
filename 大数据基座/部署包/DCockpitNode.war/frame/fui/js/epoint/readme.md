`epoint.form.js` 文件功能是生成动态表单的。

会自动解析页面中 `class="dyna-form"` 的 dom 元素为动态表单。

动态表单初始化数据的请求地址通过 dom 元素的 `action` 属性配置，其使用方式与 miniUI 控件一致。

因为要使用 `action` 配置地址，所以页面必须要执行 `epoint.initPage` 方法。

在动态表单初始化完后，会触发 `epoint_afterDynaformInit` 事件，参数为动态表单 dom 对象。
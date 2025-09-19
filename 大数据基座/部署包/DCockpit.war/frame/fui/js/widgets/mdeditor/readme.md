# 编辑器组件

## 浏览器兼容情况

> 编辑器支持 IE9 及以上

> 按钮图片及文件上传支持 IE10 及以上

> 截图粘贴图片只支持 chrome 和 FF

建议使用 chrome 或者 FF

## demo 启动

1、本地启动服务器

2、访问 => http://192.168.118.77:8080/dev-F9.3.4/frame/fui/js/widgets/mdeditor/index.html?book_id=1&article_id=2

### 访问地址参数

`book_id` 表示应用场景，比如邮件、论坛等

`article_id` 表示文章 id

**注意：**

目前只支持这两个参数，如果启用本地存储进行缓存，类型ID(指url后面的参数)较多，可在页面中用下划线拼接后组成 articleId


### 本地存储功能

用途： 如果编辑器不是实时保存的，在所有内容编辑完后再保存，可能会发生电脑死机，或者不小心浏览器关闭，或者其他异常操作导致信息丢失，启用后，会在工具栏最后出现一个按钮，重新打开页面，不编辑的情况下点击可以恢复。

**默认不启用**

启用操作：

配置项 `useStorage` 设为true

启用后保存时记得清空该文章的本地缓存

```
mdEditor.removeStorage(bookId, articleId);
```


## 使用

> 可将 `demo.html` 复制到 `frame/pages/项目目录/`下直接使用查看效果

### 资源加载

加载 mdeditor 组件下的 `mdConfig.js`

构建实例及渲染内容 需要在 `mdConfig.js` 加载结束后调用

```html
<div id="editormd"></div>
<script src="../../../rest/resource/jsboot"></script>
<script src="mdConfig.js"></script>
<script type="text/javascript">
    var domain = 'http://192.168.201.159:1199/mock/49/';//'http://fdoc.epoint.com.cn:8089/framedoc_bak';

    var mdEditor = MDEditor({
        id: "editormd",
        bookId: 2,
        articleId: 3,
        useStorage: false, // 是否启用本地存储
        clipImageUrl: domain + 'uploadList', // 图片上传地址
        getReferInfoList: domain + 'getReferInfoList', //获取文章列表
        imgUploadSuccess: function (file) {
            // 图片上传成功
            console.log(file);
        },
        imgUploadFaild: function (file) {
            // 图片上传失败
            console.log(file);
        },
        imgUploadComplete: function(info) {
            // 全部上传完成
        },
        onMdLoad: function () {
            // 编辑器初始化结束的回调
            console.log('加载完毕');
        },
        onMdChange: function (editor) {
            // 监听文档内容变化
            console.log(editor.getMarkdown());
        }
    });

    // 调用初始化或渲染内容
    mdeditor.renderEditor({
        bookId: 2, // 切换不同文章时传入
        articleId: 3, // 切换不同文章时传入
        content: '编辑器内容'
    })
</script>
```

### 接口等配置：

以上面代码为例

1、实例 `mdEditor`

`mdEditor.editor.getMarkdown();` 用于获取 markdown 内容

`mdEditor.editor.getHTML();` 用于获取生成的 html 内容；


2、方法 `mdEditor.renderEditor`

资源加载后调用此方法进行初始化。

没有内容则直接执行 `renderEditor();` 或 `renderEditor({content: ''});`

有内容则执行

```
renderEditor({
    bookId: 2, // 切换不同文章时传入
    articleId: 3, // 切换不同文章时传入
    content: '编辑器内容'
});
```

3、方法 `mdEditor.removeStorage`

**保存后需要移除本地缓存存储**

```
mdEditor.removeStorage(bookId, articleId);
```

4、图片上传返回的数据格式 clipImageUrl

请求方式： `POST`

```
{
  "error": "", // 错误信息
  "imgurl": "http://localhost/WebTemp/InformationSrcPics/InfoPic/70213e60-098c-4505-bedc-cd0f041761a2/photo.jpg"
}
```

5、查询文档标题返回的数据格式 getReferInfoList

请求方式： `POST`

```
[
  {
    "id": "8c41fb63-ef70-4252-a9ce-86e5d60dda4c",
    "title": "单元测试（静态检查工具）"
  },
  {
    "id": "efc72bfd-2dde-4cc0-ba36-f3c8597b5ffd",
    "title": "服务化集成测试（开发指南）"
  },
  ...
]
```
# OAUploader 上傳控件

其定义为用户控件，内部直接使用原来封装的mini-webuploader，重新实现一套UI界面。

使用方法：页面上写入控件，class指定为uc-oauploader，同时在页面上引入此用户控件的js即可。

新增了编辑功能，需要配置编辑地址 和 可编辑文件类型的扩展名。无配置则不会显示编辑按钮，未上传的不能编辑，会给用户提示未上传 不能编辑。

## 修改记录

### 2017-04-18

- 对编辑地址进行了处理，前面会自动凭借上虚拟目录，编辑地址参数统一确定为`attachGuid`,可以不用在编辑地址里手动写上`?attachGuid=`了。
- 新增预览功能，如果在控件上配置了`previewurl`属性，则会显示预览按钮，上传成功后以及初始化的文件，后端会返回`preparams`字段，将会设置上去，点击预览时，使用配置的地址自动拼接上参数`preparams`来打开预览窗口。

```html
<div id="x" action="myinfomodifyaction.getFileUploadModel2" class="uc-oauploader" editurl="editfileurl" editext="jpeg,jpg,gif,png,bmp" previewurl="http://192.168.202.160:8088/">
    <!--
        editurl 编辑地址 实际打开地址为 虚拟目录 + editfileurl?attachGuid=guid
        editext 可编辑扩展名 不带.
        previewurl 预览地址 实际打开地址为 配置地址  + '?fname=' + 附件guid.扩展名 + '&furl=' + 当前跟路径 + 返回的preparams
                        为：http://192.168.202.160:8088/?fname=27cdde2a-f444-44c1-a2a3-3149563962a5.docx&furl=http://192.168.112.30:8070/EpointFrame/rest/frame/base/attach/attachAction/getContent?isCommondto=true&attachGuid=27cdde2a-f444-44c1-a2a3-3149563962a5
    --> 
</div>
```

### 2017-05-02

- 上传控件未触发`onfileremovesuccess`事件，排查后发现在`getAttrs`中未添加，进行了修改，并补充了完善了`getAttrs`。
- oauploader上传控件删除文件后，前端文件列表数目未更新的问题

### 2017-08-22

- 修复了绑定事件不会触发的问题。

- 修复了文件图标的支持，默认图标名为`.common` 文件的图标样式直接为 文件的后缀名，方便扩展。如需要扩展一个后缀为 `.sql` 的文件图标。可如下进行扩展

```css
.file-type.sql {
    background-image: url("./images/file/SQL.png");
}
```

图片最佳尺寸为36*36

- 新增 `showAsFileList` 属性，设为 `true` 时，可以隐藏上传按钮，仅作为文件列表展示，同时隐藏文件上的删除按钮

- 新增 `menu` 属性，值为一个字符串，指向一个miniui的mini-menu组件，当此属性和指定的menu的dom均存在时，会自动在上传按钮旁边生成一个下拉按钮，用于控制下拉菜单的显示隐藏，形成类似于split-button的作用。使用如下

```html
<div id="uploader" class="uc-oauploader" editurl="frame/fui/fileedit" editext="png,jpg" editurl="../" action="xss" uploadUrl="./webupload.php"
    menu="#popupMenu" previewurl="http://192.168.118.47/getRquestInfo.php" onuploadsuccess="onUploadSuccess" onbeforefilequeued="beforefilequeued" fileNumLimit="3"></div>

<ul id="popupMenu" class="mini-menu" style="display:none;">
    <li onclick="onAddFile">附件库选择</li>
    <li class="separator"></li>
    <li onclick="onItemClick">从百度网盘选取</li>
    <li onclick="onItemClick">从360网盘选取</li>
</ul>
```

- 新增 `addFile` 方法，用于从附件库或其他地方选择文件后将文件插入的文件列表，其参数格式为：

```js
{
    attachGuid: 'uudsjdghg' // 文件guid,
    attachFileName: '我是选择的文件.png' // 文件名称 必须包含扩展名,
    attachLength: 6200, // 文件大小
    downloadUrl: "下载地址", // 文件下载地址
    preparams: "预览参数", // 文件的预览参数值
    readonly: false, //  是否只读，即不显示删除按钮
}
```

文件加入列表后相当于服务端文件数目+1，用户可上传文件数目-1

- 新增 `onFileItemClick` 事件 在文件上的dom块上点击触发，用于自定义指定点击时的操作，事件参数中的e.el为文件的dom元素

- 新增 `onfilerender` 事件，渲染每个文件的dom结构是触发，事件参数中的 `e.fileData` 、 `e.html` 分别表示当前渲染文件的数据和默认渲染出的html结构，通过修改此html即可做到自定义文件样式的渲染。

## 2017-09-04

- 新增 `previewExt` 属性，用于配置可预览的文件的扩展名，不含 `.` ,多个以 `,` 分隔。

## 2017-09-07

- 新增 `minSize` 属性，用于设置是否显示为小状态，同时具有 `setMinSize()` `getMinSize()` 方法,用于设置或获取是否显示为小状态。

- 新增 `getFunBtnEnable()` 方法，用于获取文件列表中文件中各个按钮的可用性。可以接受一个数值类型的参数，表示只获取此文件的按钮可以性。不传或者为非数值时，将返回所有文件的按钮可用性数组。

  ```js
  // 无参数或者参数为非数值 表示获取所有文件的
  uploader.getFunBtnEnable();
  // [{
  //         "edit": false,
  //         "preview": true
  //     },
  //     {
  //         "edit": false,
  //         "preview": true
  //     },
  //     {
  //         "edit": false,
  //         "preview": true
  //     }
  // ]
  
  // 获取第n个文件的按钮可用性 下标从0开始
  uploader.getFunBtnEnable(1); 
  // {
  //     "edit": false,
  //     "preview": true
  // }
  ```

- 新增 `_setFunBtnVisable(fileIndex, btnName, show)` 方法用于设值几个功能按钮的可见性
  - 第一个参数为要操作文件的下标，不传或者非数值表示全部文件的按钮。
  - 第二个参数为要操作的按钮名称，字符串形式，如  'edit' 'preview' 'delete' 等。
  - 第三个参数为布尔值，true为显示，false隐藏。
  - 为了方便使用，还提供了`setEditBtnVisable` 、 `setPreviewBtnVisable` 和 `setDeleteBtnVisable` 第一个参数为要操作文件的下标，不传或者非数值表示全部文件的指定按钮，第二个参数为布尔值，true为显示，false隐藏。

## 2017-09-08

- 显示为文件列表时在隐藏删除的同时也隐藏编辑按钮，同时将此处的显示隐藏由单独的按钮控制改为文件列表dom上的统一控制，避免冲突。

- 新增 `setUploadBtnVisable` 和 `getUploadBtnVisable` 用于设置和获取上传按钮的显示隐藏。

## 2017-11-13

- 编辑和预览的扩展名统一转化为小写，防止匹配失败的问题。

## 2018-01-28

- 新增 `enableSort` 属性， 用于配置是否启用附件排序功能，与之配套的有相应的set和get方法（`setEnableSort(true/false)` 和 `getEnableSort`）

## 2018-05-21

- 调用预览时，除 `furl` 之外，再多拼接一个参数，名称为 `fname` ，值为 `文件guid + 文件扩展名`
- 新增 `fileItemWidth` 配置，值为一个字符串，用以控制文件列表中 文件dom元素的宽度。
  - 值为一个字符串，直接作为 style.width  的属性值。可支持百分比值。
  - 如 `fileItemWidth="300px"` 则实际渲染出来的文件dom元素宽度则为300px。
  - 提供相应的 `setFileItemWidth` 和 `getFileItemWidth` 方法。
  - 注意为保证正常显示，在控件的样式文件中定义了最小宽度，小于这个宽度的值(236px)不会生效,如 `fileItemWidth="100px"` 。
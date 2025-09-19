# 常用应用配置页面

## 使用

```js
// 父页面打开此页面即可
// ! 应在url上传递 themeId 和 pageId
epoint.openDialog('常用应用配置', 'quickappsetting/quickappsetting.proto.html?themeId=imac&pageId=imac', function(isChanged) {
    if (isChanged === true) {
        // 此时标识应用的配置已经发生变化 可以更新页面上的常用应用
    }
});
```

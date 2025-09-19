### 特别说明

`ejs 2.x`的示例，只有在`exports.ejsVer = 2;`的情况下才能正常运行

示例中如果不是2.x的ejs，默认重新载入了ejs 2.x类库(这是为了同时兼容运行2.x和3.x的示例)

但实际项目中请直接修改框架配置:`exports.ejsVer = 2;`

`openPage` 请尽量使用相对路径(`./`和`../`开头为相对路径)，这样更方便移植，例如

```js
ejs.page.openPage('./ejs_demo_v2_simple.html');
```
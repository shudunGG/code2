# 主界面TabsNav插件说明

## 使用方式

```js
    // 为了保持之前的API不变，需将组件实例命名为 TabsNav，并开放出来
    window.TabsNav = new EpTabsNav({
        ifrContainer: '#maincontent', //内容父容器
        tabContainer: '#footer',   //任务栏容器

        needScrollBtn: false, //是否显示左右滚动按钮
        scrollBtnSite: 'sides', //左右滚动按钮的位置，两侧：'sides',右侧：'right'
        smoothItems: 3, //点击左右滚动按钮，滑动单个tab的宽度的倍数，默认为3

        needQuickNav: true, //是否显示快捷导航

        position: 'bottom', // tab显示的位置，头部：'top'，底部：'bottom'，默认为'bottom'
        tabWidth: 112 // 默认一个tab的宽度，没有固定tab时必须设置
    });
```

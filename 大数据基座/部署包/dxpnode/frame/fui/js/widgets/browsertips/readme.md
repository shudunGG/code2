# browsertips.js 使用说明

## 作用

加载此js后可自动判断当前系统版本和浏览器版本

- 如果是系统为 XP ，则会提醒用户升级系统

- 如果浏览器为 IE8 ，则提醒用户升级浏览器为最新 IE 或 Chrome

- 如果用户浏览器为 IE9 ，则会在顶部给出提示用户升级到最新版的ie浏览器。 此提示过一分钟后会自动消失。

## 相关配置

由于加载此js就自动进行了判断展示，无需手动调用，因此如果需要个性化配置，需要在引入此js之前通过一个名为 `BROWSER_TIPS_CFG` 的全局变量进行配置。

可配置值、默认值及其说明如下：

```js
{
    ieUrl: 'https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads', // 最新版ie链接地址
    chromeUrl: 'http://www.google.cn/intl/zh-CN/chrome/browser/desktop/', // chrome链接地址
    zIndex: 5000, // 展示的z-index值
    timeout: 60000, // ie9自动顶部提示消失的时间 单位毫秒
    useIE: true, // 是否展示使用最新版IE
    useChrome: true // 是否展示使用chrome
}
```
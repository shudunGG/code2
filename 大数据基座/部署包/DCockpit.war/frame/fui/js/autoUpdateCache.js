/**
 * start-commit 钩子
 * 用于提交代码前更新控制缓存的时间戳
 * 在svn的配置中进行配置 Hook Scripts 即可 记得勾选 "Wait for the script to finish"
 * @example
 * workpath: D:\EpointFrame\epoint-web-9.3\src\main\webapp
 * hook: node D:\EpointFrame\epoint-web-9.3\src\main\webapp\frame\fui\js\autoUpdateCache.js
 */
const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'cssboot.js');

let content = fs.readFileSync(filePath).toString();

function pad2(v) {
    return (v + '').padStart(2, '0');
}

const d = new Date();
const t = d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    pad2(d.getHours()) +
    pad2(d.getMinutes());

content = content.replace(/var _t = '\d+';/, `var _t = '${t}';`);

fs.writeFileSync(filePath, content);

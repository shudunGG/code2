const path = require('path');
const fse = require('fs-extra');

console.log('清空旧资源');
fse.emptyDirSync(path.join(__dirname, '../../assets'));
fse.emptyDirSync(path.join(__dirname, '../../preset'));
console.log('清空旧资源完成');

console.log('拷贝新资源中');
fse.copySync(path.join(__dirname, '../dist/'), path.join(__dirname, '../../'));
console.log('拷贝完成');

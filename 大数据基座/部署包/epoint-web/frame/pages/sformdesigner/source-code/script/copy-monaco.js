/**
 * 从 node_modules 下拷贝 monaco-editor 资源
 * 原因 monaco-editor 的 esm 版本不支持本地化 因此采用其 自身的 AMD 方案。
 */
const path = require('path');
const fse = require('fs-extra');

const monacoToFolder = path.resolve(__dirname, '../public/monaco-editor/');
const monacoFromFolder = path.resolve(__dirname, '../node_modules/monaco-editor/min/');

const languagesReg = /min\\vs\\basic-languages\\/;
const includeLanguages = /min\\vs\\basic-languages\\(?:typescript|javascript|css)/;

console.log(`/**
* 从 node_modules 下拷贝 monaco-editor 资源
* 原因 monaco-editor 的 esm 版本不支持本地化 因此采用其 自身的 AMD 方案。
*/`);
fse.copySync(monacoFromFolder, monacoToFolder, {
  filter(file) {
    // 如果是语言文件夹下
    if (languagesReg.test(file)) {
      return includeLanguages.test(file);
    }
    return true;
  }
});
console.log(`/* 拷贝完成 */`);

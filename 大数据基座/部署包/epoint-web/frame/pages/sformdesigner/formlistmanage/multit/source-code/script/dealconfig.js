const path = require('path');
const fs = require('fs');
const jsonc = require('jsonc-parser');

const inputFolder = path.resolve(__dirname, '../public/preset/controls');
const outputFolder = path.resolve(__dirname, '../public/preset');
const outputFileName = 'index.js';

// 记录所有的控件配置
const controlMap = {};

console.log('=======================');
console.log('开始读取配置文件...');
// 遍历控件的文件夹加入所有控件配置
const allFile = fs.readdirSync(inputFolder);
if (allFile) {
  allFile.forEach(file => {
    const content = fs.readFileSync(path.join(inputFolder, file)).toString();
    const fileName = file.substring(0, file.indexOf('.'));
    controlMap[fileName] = jsonc.parse(content);
  });
}

// 读取预设配置
const presetContent = fs.readFileSync(path.resolve(__dirname, '../public/preset/preset.jsonc')).toString();
const preset = jsonc.parse(presetContent);

// 读取控件列表
const controlListContent = fs.readFileSync(path.resolve(__dirname, '../public/preset/controllist.jsonc')).toString();
const controlList = jsonc.parse(controlListContent);

const minifyContent = JSON.stringify({
  controls: controlMap,
  preset: preset,
  controlList
});

const outputContent = `// 此文件由工具合并生成，不应该直接修改此文件
// eslint-disable-next-line no-unused-vars
var FORM_DESIGN_CONFIG=${minifyContent};`;

fs.writeFileSync(path.join(outputFolder, outputFileName), outputContent);

console.log('配置文件合并写入完成, output: ' + path.join(outputFolder, outputFileName));
console.log('=======================');
/**
 * 用于合并生成 控件配置的引入和导出
 */

console.log(`====================================
开始处理配置控件的导入和导出!`);

const path = require('path');
const fs = require('fs');

const inputFolder = path.resolve(__dirname, '../src/components/form');
const outputFile = path.resolve(__dirname, '../src/components/form/controlMap.js');

const imports = []; // 存储 import 导入数据
const content = []; // 文件内容

const allFile = fs.readdirSync(inputFolder);
if (allFile) {
  allFile.forEach(file => {
    // 基础控件 或 预设
    const isBaseControl = /^Control-/.test(file);
    const isExtend = /^Extend-/.test(file);

    if (isBaseControl || isExtend) {
      const fileName = file.replace(/\.vue$/, '');
      const componentName = fileName.replace('-', '');
      imports.push(`import ${componentName} from './${file}';`);

      if (isBaseControl) {
        content.push(`${componentName.replace(/^Control/, '').toLowerCase()}: ${componentName}`);
      } else if (isExtend) {
        content.push(`'${componentName.replace(/^Extend/, 'extend-').toLowerCase()}': ${componentName}`);
      }
    }
  });
} else {
  throw new Error('目录读取失败！！！');
}

const fileContent = `/**
 * ！！！此文件不应被修改！！！
 * 
 * 此文件用于导入所有提供的基础配置组件件和预设配置组件
 * 此文件由 {/script/genderControl.js} 脚本自动生成
 * 在新增基础组件和预设组件后 请运行 {yarn genderControl} 命令来重新生成此文件
 */
${imports.join('\r')}

// 此处对配置文件中配置的控件type进行转化 提供统一的输入和输出
// 针对配置控件
// 组件属性传入为 config 、 value
// config 为当前编辑控件的属性
// value 作为初始值传入
// 值变化 通过 change 事件派发，参数（新的值，编辑控件配置）

// 针对 预设控件
// 组件传入属性 control-data
// 值变化 通过 change 事件派发 参数 (新的值， 要修改的控件属性名)
const controlTypeMap = {
  ${content.join(',\r  ')}
};
const defaultComponent = {
  name: "default-control-component",
  inheritAttrs: false,
  props: ['config', 'value', 'controlData'],
  template: '<div>{{controlData ? "配置功能" : config.type}} 开发中...</div>'
};

export { controlTypeMap, defaultComponent };
`;

// 写入生成文件
fs.writeFileSync(outputFile, fileContent);

console.log('生成成功 => ' + outputFile);
console.log(`配置控件的导入和导出成功
====================================`);

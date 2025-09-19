const fs = require('fs');
const path = require('path');
// const jQuery = require('../../../../js/libs/jquery-1.12.4.min.js');

const svgFolder = path.resolve(__dirname, '../images/app/svg');
const svgOutput = path.resolve(__dirname, '../images/app/svg.svg');

const svgArr = [];
let i = 0;
fs.readdirSync(svgFolder).forEach(file => {
    const content = fs.readFileSync(path.join(svgFolder, file), {
        encoding: 'utf8'
    });
    const svg = getSvgContent(content, file, i);
    svgArr.push(svg);
    i++;
});

fs.writeFileSync(svgOutput, '<svg>' + svgArr.join('') + '</svg>');

function getSvgContent(input, title, idx) {
    let svgContent = input.substring(input.indexOf('<g>'), input.lastIndexOf('</svg>'));
    // class 修改
    svgContent = svgContent.replace(/<path class=".+?"/,'<path class="metro-app-icon-path"');
    const str = `<symbol id="metro-app-icon-${idx}" viewBox="0 0 1024 1024"><title>${title.substring(0, title.lastIndexOf('.'))}</title>${svgContent}</symbol>`;
    return str;
}
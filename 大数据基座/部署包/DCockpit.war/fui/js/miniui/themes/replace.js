const efc = require('../../../css/efc');
const fs = require('fs');
const path = require('path');
console.log(process);
fs.readFile(path.join(process.cwd(), 'fui/js/miniui/themes/large-mode.css'), function (err, data) {
    // console.log(arguments);
    // console.log(data.toString('utf-8'));
    var str = data.toString('utf-8').replace(/(\d+\.?\d+)rem/g, function () {
        console.log(arguments[1]);
        return efc.div(arguments[1], 10) + 'rem'
    });
    fs.writeFileSync(path.join(process.cwd(), 'fui/js/miniui/themes/large-mode-new.css'), str, {
        encoding: 'utf-8'
    });
});

fs.readFile(path.join(process.cwd(), 'fui/js/miniui/themes/medium-mode.css'), function (err, data) {
    // console.log(arguments);
    // console.log(data.toString('utf-8'));
    var str = data.toString('utf-8').replace(/(\d+\.?\d+)rem/g, function () {
        console.log(arguments[1]);
        return efc.div(arguments[1], 10) + 'rem'
    });
    fs.writeFileSync(path.join(process.cwd(), 'fui/js/miniui/themes/medium-mode-new.css'), str, {
        encoding: 'utf-8'
    });
});
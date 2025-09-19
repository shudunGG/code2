/*
 * @Author: guotq
 * @Date: 2018-07-03 16:26:02
 * @Last Modified by: guotq
 * @Last Modified time: 2018-07-03 17:44:39
 * @Description: webpack 需要的配置项
 */

(function () {
    'use strict';

    /**
     * 项目结构目录
     * directory 文件夹名
     * group 当前文件夹下的页面名称，不要带文件后缀
     */
    exports.Dirs = [{
        directory: 'module',
        group: [
            'module_page1',
            'module_page2'
        ]
    }];

    /**
     * 当前服务器部署地址
     * 注意：路径指向当前工程目录
     * 例如：http://192.168.118.28:8082/ejs.m7.mobileFrame
     */
    exports.serverPath = 'http://192.168.118.28:8082/ejs.m7.mobileFrame';
}());
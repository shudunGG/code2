// package.json 中读取版本信息
process.env.VUE_APP_VERSION = require('./package.json').version;
// 注入构建的时间
process.env.VUE_APP_UPDATED_AT = new Date().toLocaleDateString() + 'T' + new Date().toLocaleTimeString();
// 本地调试模式
process.env.VUE_APP_DEBUG_MODE = process.env.NODE_ENV != 'production';

// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const fs = require('fs');
const path = require('path');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  publicPath: './',
  assetsDir: 'assets',
  indexPath: 'designer.html',
  css: {
    sourceMap: false
  },
  productionSourceMap: false,
  devServer: {
    proxy: {
      // 请求接口转发到 mock
      sformdesignaction: {
        target: 'https://fe.epoint.com.cn',
        ws: false,
        changeOrigin: true,
        pathRewrite: function(path) {
          // const mockUrl = path.replace(/sformdesignaction\.action\?cmd=(\w+)?(&\w+=\w+)?/, 'mock/109/formdesigner/$1');
          const mockUrl = path.replace(/sformdesignaction\.action\?cmd=(\w+)?(&\w+=\w+)?/, (all, g1, g2) => {
            const query = g2 ? g2.replace(/^&/, '?') : g2 || '';
            return `mock/109/formdesigner/${g1}${query}`;
          });
          console.log(`[pathRewrite] ${path} => ${mockUrl}`);
          return mockUrl;
        }
      },
      // 请求转发到 真实的
      // sformdesignaction: {
      //   target: 'http://192.168.171.95:8080',
      //   ws: false,
      //   changeOrigin: true,
      //   headers: {
      //     'Cookie': 'sid=04770AC48CB74DDB905779FDD1031E45; epoint_local=zh_CN'
      //   },
      //   pathRewrite: function (path) {
      //     const newPath =  '/epoint-zwfwsform-web/frame/pages/sformdesigner/'  + path;
      //     console.log(`[pathRewrite] ${path}\n  => \n${newPath} \n\n`);
      //     return newPath;
      //   }
      // },
      // preview: {
      //   target: 'http://localhost',
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: function(path) {
      //     const mockUrl = path.replace('preview/preview', '/ep94/frame/pages/sformdesigner/preview/preview.html');
      //     console.log(`[pathRewrite] ${path} => ${mockUrl}`);
      //     return mockUrl;
      //   }
      // },
      '/webapp': {
        target: 'http://localhost',
        ws: false,
        changeOrigin: true,
        pathRewrite: {'^/webapp' : '/ep94'},
        onProxyRes: function onProxyRes(proxyRes, req, res) {
          delete proxyRes.headers['x-frame-options']; // remove header from response
        }
      },
      // config 静态文件转发到本地
      config: {
        target: 'http://localhost',
        ws: false,
        changeOrigin: true,
        pathRewrite: function(path) {
          const mockUrl = path.replace('config', '/ep94/frame/pages/sformdesigner/config');
          console.log(`[pathRewrite] ${path} => ${mockUrl}`);
          return mockUrl;
        }
      }
    }
  },
  // 开启包含编译器 以便可直接以 template 构建组件
  runtimeCompiler: true,
  // filenameHashing: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 移除代码中的 'console.log', 'console.group', 'console.groupEnd'
      // https://github.com/terser-js/terser#compress-options
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = [
        'console.log',
        'console.group',
        'console.groupEnd'
      ];
    }
    config.plugins.push(new HardSourceWebpackPlugin());
    // 添加
    // config.plugins.push(
    //   new MonacoWebpackPlugin({
    //     languages: ['typescript', 'javascript', 'css']
    //   })
    // );
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      var myUrl = path.resolve(__dirname, '../designer-tpl.html');
      if (!args[0] || !args[0].template) {
        return args;
      }
      args[0].template = fs.existsSync(myUrl) ? myUrl : './public/index.html';
      console.log('use ' + args[0].template + ' as template to build');
      return args;
    });
  }
};

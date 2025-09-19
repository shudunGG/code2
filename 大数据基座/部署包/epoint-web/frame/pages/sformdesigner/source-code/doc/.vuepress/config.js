const fs = require('fs');
const sidebar = [];

function getArticals() {
  const folder = fs.readdirSync('/');
}

module.exports = {
  host: '0.0.0.0',
  port: '3004',
  base: '/',
  title: '表单设计器',
  description: '表单设计器',
  head: [
    [
      'meta',
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'ie=edge'
      }
    ],
    [
      'meta',
      {
        name: 'icon Shortcut Bookmark',
        href: '/favicon.ico'
      }
    ]
  ],
  serviceWorker: true,
  themeConfig: {
    docsDir: 'doc',
    lastUpdated: 'Last Updated',
    displayAllHeaders: true,
    sidebarDepth: 3,
    sidebar: [
      'api.md',
      'event.md',
      'code.md',
      'control-config.md'
      // {
      //     title: '接口说明',
      //     children: ['/explain/about-responsive-web.md', '/explain/how-to-responsive-web.md']
      // },
      // {
      //     title: 'F9',
      //     children: ['/f9/skin-change.md', '/f9/skin-builder.md', '/f9/fetools.md', '/f9/safe-measures.md', '/f9/toolbar-overflow.md']
      // }
    ],
    nav: [
      {
        text: 'Home',
        link: '/'
      }
    ]
  },
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/nprogress', '@vuepress/back-to-top', '@vuepress/medium-zoom']
};

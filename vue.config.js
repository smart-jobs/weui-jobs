const path = require('path');

module.exports = {
  baseUrl: './',
  pages: {
    index: 'src/pages/index/main.js',
    jobfairDetail: 'src/pages/jobfairDetail/main.js',
    campusDetail: 'src/pages/campusDetail/main.js',
    jobinfoDetail: 'src/pages/jobinfoDetail/main.js',
    indexList: 'src/pages/indexList/main.js',
    user: 'src/pages/user/main.js',
    corp: 'src/pages/corp/main.js',
    guest: 'src/pages/guest/main.js',
  },
  configureWebpack: config => {
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@c': path.resolve(__dirname, './src/components'),
          '@a': path.resolve(__dirname, './src/assets'),
        },
      },
    });
  },
  devServer: {
    port: '8001',
    //api地址前缀
    proxy: {
      '/weixin': {
        target: 'http://smart.chinahuian.cn',
        changeOrigin: true,
        ws: true,
      },
    },
  },
};

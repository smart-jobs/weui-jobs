const path = require("path");

module.exports = {
  baseUrl: './',
  pages: {
    index: 'src/pages/index/main.js',
    jobfairDetail: 'src/pages/jobfairDetail/main.js',
    campusDetail: 'src/pages/campusDetail/main.js',
    jobinfoDetail: 'src/pages/jobinfoDetail/main.js',
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
        target: 'http://smart.jilinjobswx.cn',
        changeOrigin: true,
        ws: true,
      },
    },
  },
};

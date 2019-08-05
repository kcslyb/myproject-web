const path = require('path');
const vConsolePlugin = require('vconsole-webpack-plugin'); // 引入 移动端模拟开发者工具 插件
const CompressionPlugin = require('compression-webpack-plugin'); //Gzip
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //Webpack包文件分析器
const baseUrl = process.env.NODE_ENV === "production" ? "/static/" : "/"; //font scss资源路径 不同环境切换控制

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  //以多页模式构建应用程序。
  pages: undefined,
  //是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  //生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,
  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8018,
    host: '127.0.0.1',
    https: false,
    disableHostCheck: true,
    open: true, //配置自动启动浏览器
    hotOnly: true, // 热更新
    proxy: process.env.NODE_ENV === 'production' ? { //配置自动启动浏览器
      "/api/*": {
        target: "http://127.0.0.1:8088",
        changeOrigin: true,
        ws: true,//websocket支持
        secure: false
      }
    } : {
      '/api': {
        target: 'http://127.0.0.1:8088',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'  //删除基本路径
        },
      },
    }
  },

  // webpack配置
  chainWebpack: config => {
    config.module
        .rule('vue')
        .use('vue-loader')
        .tap(options => {
          return options
        });
    config.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|ico)(\?.*)?$/)
        .use('url-loader')
        .loader('url-loader')
        .options({
          name: path.join('../main/static/', 'img/[name].[ext]')
        })
  },
  configureWebpack: config => {
    // 生产and测试环境
    let pluginsPro = [
      new CompressionPlugin({ //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$', ),
        threshold: 8192,
        minRatio: 0.8,
      }),
      //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      // new BundleAnalyzerPlugin(),
    ];
    // git clone git@13.250.177.223:Binaryify/NeteaseCloudMusicApi.git
    //开发环境13.250.177.223
    let pluginsDev = [
      //移动端模拟开发者工具(https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
      new vConsolePlugin({
        filter: [], // 需要过滤的入口文件
        enable: false // 发布代码前记得改回 false
      }),
    ];
    if(process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
      config.plugins = [...config.plugins, ...pluginsPro];
    } else {
      // 为开发环境修改配置...
      config.plugins = [...config.plugins, ...pluginsDev];
    }
  },
  css: {
    // 启用 CSS modules
    modules: false,
    // 是否使用css分离插件
    extract: true,
    // 开启 CSS source maps，一般不建议开启
    sourceMap: false,
  }
};

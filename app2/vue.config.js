const path = require("path");
const { name } = require('./package');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = 3002;

module.exports = {
  publicPath: `//localhost:${port}`,
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  filenameHashing: true,
  lintOnSave: true,
  devServer: {
    host: "0.0.0.0",
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    historyApiFallback: {
        index: '/index.html' //与output的publicPath有关(HTMLplugin生成的html默认为index.html)
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    // name: name,
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    output: {
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    }
  }
};

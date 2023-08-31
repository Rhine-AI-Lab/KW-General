const {
  override,
  addWebpackAlias,
  addWebpackModuleRule,
  addWebpackExternals,
  adjustStyleLoaders,
} = require('customize-cra')
const path = require('path')
const paths = require("./paths")
const fs = require("fs")

const NODE_ENV = process.env.NODE_ENV;
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  // Don't include `.env` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  paths.dotenv,
].filter(Boolean);
// console.log(dotenvFiles)

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

module.exports = override(
  (config, env) => {
    config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false
    if (env === 'development') {
      // 映射别名 当前可省略
      // config.resolve.alias = {
      //   ...config.resolve.alias,
      //   '@babylonjs/core': path.resolve(__dirname, 'node_modules/@babylonjs/core'),
      // };
    } else {
      // 排除@babylonjs/core模块，使用外部脚本引入
      config.externals = {
        '@babylonjs/core': 'BABYLON',
        '@babylonjs/material': 'BABYLON',
      };
      config.output.filename = 'static/js/[name].[fullhash].js';
      config.output.chunkFilename = 'static/js/[name].[fullhash].chunk.js';
    }
    return config
  },
  addWebpackExternals({
    babylonjs: 'BABYLON', // 将 Babylon.js 声明为外部库
  }),
  // @别名
  addWebpackAlias({
    '@': path.resolve('../src')
  }),
  // css编译流程 类名别名
  addWebpackModuleRule({
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: "[name]_[local]_[hash:base64:8]",
          },
        }
      },
      {
        loader: 'sass-loader',
        options: {
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: ['./src/assets/scss/variable.scss']
        }
      }
    ]
  }),
  // scss全局变量
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: ['./src/assets/scss/variable.scss']
        }
      })
    }
  })
)

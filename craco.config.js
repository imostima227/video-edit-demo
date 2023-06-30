const CracoLessPlugin = require('craco-less');
const { loaderByName } = require('@craco/craco');
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);
const lessModuleRegex = /\.module\.less$/;


module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
        modifyLessRule(lessRule) {
          lessRule.exclude = lessModuleRegex;
          return lessRule;
        },
        modifyLessModuleRule(lessModuleRule) {
          lessModuleRule.test = lessModuleRegex;
          const cssLoader = lessModuleRule.use.find(loaderByName('css-loader'));
          cssLoader.options.modules = {
            localIdentName: '[local]_[hash:base64:5]',
          };
          return lessModuleRule;
        },
      },
    },
  ],
  webpack: {
    alias: {
      '@': resolve('src'),
    }
  },
  devServer: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    }
  },
}
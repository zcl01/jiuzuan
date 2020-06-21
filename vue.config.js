const webpack = require('webpack')

module.exports = {
  devServer: {
    open: true,
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          // require('postcss-px2rem')({remUnit: 75}), // 换算的基数
          require('postcss-pxtorem')({
            rootValue : 37.5, // 换算的基数
            propList  : ['*'],
          }),
          require('autoprefixer')({
            browsers: ['Android >= 4.0', 'iOS >= 8']
          }),
        ]
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      })
    ]
  },
  runtimeCompiler: true,
  publicPath: './'
}

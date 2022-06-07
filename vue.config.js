module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? ''
      : '/',
    devServer: {
      https: false,
    },
    runtimeCompiler: true,
    configureWebpack: {
      externals: {
        experiments: {
          asyncWebAssembly: true,
          topLevelAwait: true,
          futureDefaults: true
        }
      }
    }
  }
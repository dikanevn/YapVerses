const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        os: require.resolve("os-browserify/browser"),
        url: require.resolve("url"),
        fs: false,
        buffer: require.resolve("buffer"),
        ...(webpackConfig.resolve.fallback || {}),
      };

      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        codecs: require.resolve("./src/codecs-shim.js"),
      };

      webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
      ]);

      return webpackConfig;
    },
  },
}; 
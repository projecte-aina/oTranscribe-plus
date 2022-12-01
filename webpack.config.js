const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
  return {
    mode: 'none',
    entry: {
      app: ['./src/index.js'] // This is the main file that gets loaded first; the "bootstrap", if you will.
    },
    output: { // Transpiled and bundled output gets put in `build/bundle.js`.
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.[fullhash].js'   // Really, you want to upload index.htm and assets/bundle.js
    },
    module: {
      rules: [
        {
          test:  /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'img/[name][ext][query]'
          }
        },
        {
          test: /\.ms$/i,
          use: {
            loader: 'raw-loader',
            options: {
              esModule: false,
            }
          }
        },
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins:[
                ['@babel/transform-react-jsx', {pragma:'h'}]
              ],
              cacheDirectory: true
            }
          }
        },
        // Extract css files
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
          options: {
            sources: {
              list: [
                {
                  tag: "img",
                  attribute: "data-src",
                  type: "src",
                },
              ]
            },
          },
        }
      ],
    },
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
      new MiniCssExtractPlugin({filename: "style.css"}),
      new CopyPlugin({
        patterns: [
          { from: './node_modules/webl10n/l10n.js' },
          { from: './node_modules/vosk-browser/dist/vosk.js' },
          { from: './models', to: './models' },
          { from: './src/recognizer-processor.js' },
          { from: './src/help.htm', to: './help/index.htm' },
          { from: './src/opensource.htm', to: './opensource/index.htm' },
          { from: './src/privacy.htm', to: './privacy/index.htm' }
        ]
      }),
      new HtmlWebpackPlugin({
        template: './src/index.htm'
      }),
      new webpack.DefinePlugin({
        APPLICATION: env.APPLICATION,
        MODELSPREFIX: JSON.stringify(env.MODELSPREFIX)
      })
    ]
  }
};

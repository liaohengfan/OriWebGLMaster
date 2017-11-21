var path = require('path');
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'app.js',
        path: __dirname + '/dist'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    devServer: {
        inline: true,
        port: 8099
    },
    module: {
        loaders: [
            //{ test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.ts$/, loader: 'awesome-typescript-loader' },
            {test: /\.html$/, loader: 'html-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader'},
            {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
            //{test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            {
                //  普通图像
                test: /\.(jpe?g|png|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        // use HASH file name for 'production
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        // publicPath: 'images/',
                    },
                }],
            },
            //{ test: /\.(png|jpg|gif)$/, loader: "file-loader?name=img/[hash:8].[name].[ext]" },
            {
                test: /\.(woff|woff2|ttc|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname+'/src/index.html'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
        }),
        new webpack.ProvidePlugin({
            TWEEN: 'tween.js'
        }),
        new webpack.ProvidePlugin({
            h337: 'heatmap.js'
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/assets',
            to:'./assets'
        }]),
        new webpack.HotModuleReplacementPlugin()
    ]
}
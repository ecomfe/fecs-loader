/**
 * @file webpack.config.js webpack config file
 * @author zhangzhiqiang<zhiqiangzhang37@gmail.com>
 */

var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './main.js'
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.vue/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test: /\.jsx/,
                use: [
                    'jsx-loader'
                ]
            },
            // 要把fecs-loader放在语言处理loader之前
            {
                test: /\.(less|css|js|vue|es|es6|jsx)$/,
                use: [
                    {
                        loader: 'fecs-loader',
                        options: {
                            failOnError: true,
                            // failOnWarning: true,
                            exclude: './index2.js'
                        }
                    }
                ]
            }
        ]
    }
};

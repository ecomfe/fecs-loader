/**
 * @file webpack.config.js webpack config file
 * @author zhangzhiqiang<zhiqiangzhang37@gmail.com>
 */
module.exports = {
    entry: {
        main: './main.js'
    },
    output: {
        path: './build',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.vue/, loader: 'vue-loader'},
            // 要把fecs-loader放在语言处理loader之前
            {test: /\.(less|css|js|vue)$/, loader: 'fecs-loader'}
        ]
    },
    fecs: {
        failOnError: true,
        // failOnWarning: true,
        exclude: './index2.js'
    }
};
